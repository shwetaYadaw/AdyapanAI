// @ts-nocheck
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { Readable } from 'stream';
import { prisma } from '../config/prisma';
import cloudinary from '../config/cloudinary';
import { AppError } from '../middleware/errorHandler.middleware';
import { env } from '../config/env';
import { EmailService } from './email.service';

const emailService = new EmailService();

export class CertificateService {
  /**
   * Generate a DSA-specific certificate (may be called without a real courseId).
   * courseId is required by the Prisma schema FK, so caller must pass a valid one.
   */
  async generateDSACertificate(userId: string, courseId: string, topicName?: string) {
    // Check if certificate already exists for this user+course
    const existing = await prisma.certificate.findFirst({ where: { userId, courseId } });
    if (existing) return existing;

    const [user, course] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.course.findUnique({ where: { id: courseId } }),
    ]);

    if (!user || !course) throw new AppError('User or course not found', 404);

    const displayName = topicName
      ? `DSA Topic: ${topicName.toUpperCase()}`
      : 'Data Structures & Algorithms (DSA) Placement Preparation Program';

    const skillsList = topicName ? [topicName] : [
      'Arrays', 'Strings', '2D Arrays', 'Hashing', 'Two Pointers', 'Sliding Window',
      'Binary Search', 'Searching & Sorting', 'Linked Lists', 'Stacks', 'Queues',
      'Recursion', 'Trees', 'BST', 'Heaps', 'Graphs', 'DP', 'Greedy', 'Bit Manipulation',
    ];

    // Create initial record to get the ID
    let cert = await prisma.certificate.create({
      data: {
        userId,
        courseId,
        studentName: `${user.firstName} ${user.lastName}`,
        courseName: displayName,
        instructorName: 'Morsu Niranjan Reddy',
        skills: skillsList,
        qrData: '',
        certificateUrl: '',
      },
    });

    const verifyUrl = `${env.FRONTEND_URL}/verify/${cert.id}`;
    const qrDataUrl = await QRCode.toDataURL(verifyUrl);

    const today = new Date();
    const completionDate = `${today.getDate()} ${today.toLocaleString('en-IN', { month: 'long' })} ${today.getFullYear()}`;

    // Generate PDF
    const pdfBuffer = await this.generatePDF({
      studentName: cert.studentName,
      courseName: cert.courseName,
      instructorName: cert.instructorName,
      certificateId: cert.id,
      issuedAt: cert.issuedAt,
      qrDataUrl,
      skills: skillsList,
      isDSA: true,
      topicName,
      completionDate,
    });

    // Upload to Cloudinary
    const uploadResult = await this.uploadToCloudinary(
      pdfBuffer,
      `adyapan/certificates/${cert.id}`
    );

    // Update cert with QR and PDF URL
    cert = await prisma.certificate.update({
      where: { id: cert.id },
      data: { qrData: qrDataUrl, certificateUrl: uploadResult.secure_url },
    });

    // Send email
    await emailService.sendCertificateEmail(
      user.email,
      user.firstName,
      course.title,
      cert.certificateUrl
    );

    return cert;
  }

  async generateCertificate(userId: string, courseId: string) {
    // Verify enrollment and completion
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (!enrollment) throw new AppError('Not enrolled in this course', 400);
    if (!enrollment.isCompleted) {
      throw new AppError('Course not completed yet', 400);
    }

    // Check if certificate already exists
    const existing = await prisma.certificate.findFirst({ where: { userId, courseId } });
    if (existing) return existing;

    const [user, course] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.course.findUnique({ where: { id: courseId } }),
    ]);

    if (!user || !course) throw new AppError('User or course not found', 404);

    // Resolve instructor name
    let instructorName = 'ADYAPAN';
    if (course.instructorId) {
      const instructor = await prisma.user.findUnique({
        where: { id: course.instructorId },
        select: { firstName: true, lastName: true },
      });
      if (instructor) {
        instructorName = `${instructor.firstName} ${instructor.lastName}`;
      }
    }

    // Create initial record
    let cert = await prisma.certificate.create({
      data: {
        userId,
        courseId,
        studentName: `${user.firstName} ${user.lastName}`,
        courseName: course.title,
        instructorName,
        skills: [],
        qrData: '',
        certificateUrl: '',
      },
    });

    // Generate QR code
    const verifyUrl = `${env.FRONTEND_URL}/verify/${cert.id}`;
    const qrDataUrl = await QRCode.toDataURL(verifyUrl);

    // Generate PDF
    const pdfBuffer = await this.generatePDF({
      studentName: cert.studentName,
      courseName: cert.courseName,
      instructorName: cert.instructorName,
      certificateId: cert.id,
      issuedAt: cert.issuedAt,
      qrDataUrl,
      skills: (cert.skills as string[]) ?? [],
    });

    // Upload to Cloudinary
    const uploadResult = await this.uploadToCloudinary(
      pdfBuffer,
      `adyapan/certificates/${cert.id}`
    );

    // Update cert
    cert = await prisma.certificate.update({
      where: { id: cert.id },
      data: { qrData: qrDataUrl, certificateUrl: uploadResult.secure_url },
    });

    // Send email
    await emailService.sendCertificateEmail(
      user.email,
      user.firstName,
      course.title,
      cert.certificateUrl
    );

    return cert;
  }

  async verifyCertificate(certificateId: string) {
    const cert = await prisma.certificate.findUnique({
      where: { id: certificateId },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        course: { select: { title: true, category: true } },
      },
    });

    if (!cert) throw new AppError('Certificate not found or invalid', 404);
    if (cert.isRevoked) throw new AppError('This certificate has been revoked', 410);

    return {
      valid: true,
      certificate: {
        certificateId: cert.id,
        studentName: cert.studentName,
        courseName: cert.courseName,
        instructorName: cert.instructorName,
        issuedAt: cert.issuedAt,
        skills: cert.skills,
        course: cert.course,
        user: cert.user,
      },
    };
  }

  async getStudentCertificates(userId: string) {
    return prisma.certificate.findMany({
      where: { userId, isRevoked: false },
      include: {
        course: { select: { title: true, image: true, category: true } },
      },
      orderBy: { issuedAt: 'desc' },
    });
  }

  private async generatePDF(data: {
    studentName: string;
    courseName: string;
    instructorName: string;
    certificateId: string;
    issuedAt: Date;
    qrDataUrl: string;
    skills: string[];
    isDSA?: boolean;
    completionDate?: string;
    topicName?: string;
  }): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        layout: 'landscape',
        size: 'A4',
        margins: { top: 40, bottom: 40, left: 40, right: 40 },
      });

      const buffers: Buffer[] = [];
      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      const width = doc.page.width;
      const height = doc.page.height;

      // Clean white background
      doc.rect(0, 0, width, height).fill('#ffffff');

      // Thin inner gold border matching the image
      doc.lineWidth(2.5);
      doc.rect(20, 20, width - 40, height - 40).stroke('#d97706');

      // Thin black/grey inner boundary
      doc.lineWidth(0.5);
      doc.rect(25, 25, width - 50, height - 50).stroke('#e5e7eb');

      // Certificate No at top right
      const certNoText = `CERTIFICATE NO: ${data.certificateId.toUpperCase()}`;
      doc.fillColor('#111827')
        .font('Helvetica-Bold')
        .fontSize(8)
        .text(certNoText, width - 250, 35, { width: 215, align: 'right' });

      // ADYAPAN Logo/Header Centered at the top
      doc.save();
      const logoCircleX = (width / 2) - 80;
      const logoCircleY = 65;
      doc.circle(logoCircleX, logoCircleY, 15).fill('#FAA307');
      doc.fillColor('#ffffff')
        .font('Helvetica-Bold')
        .fontSize(11)
        .text('ady.', logoCircleX - 12, logoCircleY - 6, { width: 24, align: 'center' });
      doc.restore();

      doc.fillColor('#000000')
        .font('Helvetica-Bold')
        .fontSize(26)
        .text('ADYAPAN', (width / 2) - 55, 52);

      // Main Heading
      doc.moveDown(0.8);
      doc.fillColor('#111827')
        .font('Times-Bold')
        .fontSize(38)
        .text('CERTIFICATE', { align: 'center' });

      const dsaSubheading = data.topicName ? 'TOPIC COMPLETION' : 'PROGRAM COMPLETION';
      doc.moveDown(0.1);
      doc.fontSize(12).font('Helvetica-Bold');
      doc.fillColor('#111827').text('OF ', { align: 'center', continued: true })
         .fillColor('#FAA307').text(data.isDSA ? 'DSA ' : 'COURSE ', { continued: true })
         .fillColor('#111827').text(data.isDSA ? dsaSubheading : 'COMPLETION');

      // Student Name with Thin Underline
      doc.moveDown(1.5);
      doc.fillColor('#111827')
        .font('Times-Roman')
        .fontSize(26)
        .text(data.studentName, { align: 'center' });

      const nameWidth = doc.widthOfString(data.studentName);
      doc.lineWidth(0.5);
      doc.moveTo((width / 2) - (nameWidth / 2) - 10, 245)
         .lineTo((width / 2) + (nameWidth / 2) + 10, 245)
         .stroke('#111827');

      // Body Paragraph Text
      doc.moveDown(1.2);

      const endObj = new Date(data.issuedAt);
      const startObj = new Date(endObj.getTime() - (90 * 24 * 60 * 60 * 1000));

      const getOrdinalSuffix = (day: number) => {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
          case 1:  return 'st';
          case 2:  return 'nd';
          case 3:  return 'rd';
          default: return 'th';
        }
      };

      const formatOrdinalDate = (d: Date) => {
        const day = d.getDate();
        const month = d.toLocaleString('en-IN', { month: 'long' });
        const year = d.getFullYear();
        return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
      };

      const startDateStr = formatOrdinalDate(startObj);
      const endDateStr = formatOrdinalDate(endObj);

      doc.fontSize(11)
         .fillColor('#111827')
         .font('Helvetica');

      if (data.isDSA) {
        if (data.topicName) {
          const topicHighlight = data.topicName.toUpperCase();
          const topicLower = data.topicName.toLowerCase();

          doc.text('This is to certify that ', { align: 'center', continued: true, lineGap: 4 })
             .font('Helvetica-Bold').text(`${data.studentName} `, { continued: true })
             .font('Helvetica').text('has successfully completed the coursework', { continued: false });
          doc.text('and assessments for the specific Data Structures and Algorithms topic:', { align: 'center', lineGap: 4 });

          doc.moveDown(0.2);
          doc.font('Helvetica-Bold').fontSize(12).text(`${topicHighlight}.`, { align: 'center', lineGap: 6 });

          doc.moveDown(0.2);
          doc.font('Helvetica').fontSize(11).text(`This certificate recognizes the dedication, proficiency, and application of algorithmic principles demonstrated in mastering fundamental concepts, complexity analysis, and problem-solving techniques related to ${topicLower} data structures.`, { align: 'center', width: width - 180, lineGap: 4 });

          doc.moveDown(0.2);
          doc.font('Helvetica-Bold').text('Awarded with distinction.', { align: 'center' });
        } else {
          doc.text('This is to certify that ', { align: 'center', continued: true, lineGap: 4 })
             .font('Helvetica-Bold').text(`${data.studentName} `, { continued: true })
             .font('Helvetica').text('has successfully completed all coursework', { continued: false });
          doc.text('and assessments for the Data Structures and Algorithms Core Program.', { align: 'center', lineGap: 4 });

          doc.moveDown(0.2);
          doc.font('Helvetica-Bold').fontSize(12).text('DSA CORE PROGRAM.', { align: 'center', lineGap: 6 });

          doc.moveDown(0.2);
          doc.font('Helvetica').fontSize(11).text('This certificate recognizes the dedication, proficiency, and application of algorithmic principles demonstrated in mastering fundamental concepts, complexity analysis, and problem-solving techniques related to core data structures and algorithms.', { align: 'center', width: width - 180, lineGap: 4 });

          doc.moveDown(0.2);
          doc.font('Helvetica-Bold').text('Awarded with distinction.', { align: 'center' });
        }
      } else {
        doc.text('This is to certify that ', { align: 'center', continued: true, lineGap: 6 })
           .font('Helvetica-Bold').text(`${data.studentName} `, { continued: true })
           .font('Helvetica').text('has successfully completed the ', { continued: true })
           .font('Helvetica-Bold').text(`${data.courseName} `, { continued: true })
           .font('Helvetica').text('offered by ', { continued: true })
           .font('Helvetica-Bold').fillColor('#FAA307').text('ADYAPAN ', { continued: true })
           .fillColor('#111827').font('Helvetica').text('from ', { continued: true })
           .font('Helvetica-Bold').text(`${startDateStr} `, { continued: true })
           .font('Helvetica').text('to ', { continued: true })
           .font('Helvetica-Bold').text(`${endDateStr}. `, { continued: false });

        doc.moveDown(0.6);
        doc.fontSize(11)
           .font('Helvetica')
           .fillColor('#111827')
           .text('The participant actively engaged in the course and successfully fulfilled all learning objectives and assessment requirements. We commend their commitment to skill development and wish them every success in their future endeavors.', { align: 'center', width: width - 180 });
      }

      // Footer Sections
      const footerY = 410;

      // 1. Signature Area (Left)
      doc.save();
      doc.strokeColor('rgba(30, 58, 138, 0.2)').lineWidth(1);
      doc.circle(130, footerY + 10, 24).stroke();
      doc.fontSize(5).fillColor('rgba(30, 58, 138, 0.4)').text('ADYAPAN EDUCATION', 110, footerY + 2, { width: 40, align: 'center' });
      doc.restore();

      doc.fillColor('#1e3a8a')
         .font('Times-Italic')
         .fontSize(18)
         .text('M. N. Reddy', 80, footerY - 5);

      doc.moveTo(60, footerY + 38).lineTo(200, footerY + 38).stroke('#e5e7eb');

      doc.fillColor('#111827')
         .font('Helvetica-Bold')
         .fontSize(9)
         .text('MORSU NIRANJAN REDDY', 60, footerY + 44);
      doc.fillColor('#6b7280')
         .font('Helvetica-Bold')
         .fontSize(8)
         .text('CO-FOUNDER', 60, footerY + 54);

      // 2. Date of Issue (Center — only for standard courses)
      if (!data.isDSA) {
        doc.fillColor('#111827')
           .font('Helvetica')
           .fontSize(9)
           .text('Date of Issue', width / 2 - 100, footerY + 5, { width: 200, align: 'center' });

        doc.save();
        doc.strokeColor('#FAA307').lineWidth(1.5);
        doc.moveTo(width / 2 - 65, footerY + 32).quadraticCurveTo(width / 2 - 50, footerY + 50, width / 2 - 10, footerY + 50).stroke();
        doc.moveTo(width / 2 + 65, footerY + 32).quadraticCurveTo(width / 2 + 50, footerY + 50, width / 2 + 10, footerY + 50).stroke();
        doc.restore();

        doc.fillColor('#111827')
           .font('Helvetica-Bold')
           .fontSize(10)
           .text(endDateStr, width / 2 - 100, footerY + 22, { width: 200, align: 'center' });
      }

      // 3. Golden Seal Badge (Right)
      doc.save();
      doc.fillColor('#1e3a8a');
      doc.rect(width - 128, footerY + 15, 10, 35).fill();
      doc.rect(width - 114, footerY + 15, 10, 35).fill();

      doc.circle(width - 120, footerY + 10, 22).fill('#FAA307');
      doc.circle(width - 120, footerY + 10, 20).stroke('#ffffff').lineWidth(1.5);

      doc.fillColor('#000000')
         .font('Helvetica-Bold')
         .fontSize(4)
         .text('LEARN • PRACTICE • EXCEL', width - 138, footerY + 4, { width: 36, align: 'center' });
      doc.fillColor('#000000')
         .font('Helvetica-Bold')
         .fontSize(9)
         .text('ady.', width - 138, footerY + 10, { width: 36, align: 'center' });
      doc.restore();

      // QR Code
      const qrBuffer = Buffer.from(
        data.qrDataUrl.replace('data:image/png;base64,', ''),
        'base64'
      );
      doc.image(qrBuffer, width - 75, height - 75, { width: 50, height: 50 });
      doc.fontSize(6).fillColor('#9ca3af').text('Scan to verify', width - 85, height - 22, { width: 70, align: 'center' });

      doc.end();
    });
  }

  private async uploadToCloudinary(
    buffer: Buffer,
    publicId: string
  ): Promise<{ secure_url: string }> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { public_id: publicId, resource_type: 'raw', format: 'pdf' },
        (error, result) => {
          if (error || !result) reject(error ?? new Error('Upload failed'));
          else resolve(result);
        }
      );
      const readable = new Readable();
      readable.push(buffer);
      readable.push(null);
      readable.pipe(stream);
    });
  }
}
