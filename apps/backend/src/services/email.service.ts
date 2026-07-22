import nodemailer from 'nodemailer';
import { env } from '../config/env';
import { logger } from '../utils/logger';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }

  private async send(to: string, subject: string, html: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: env.EMAIL_FROM,
        to,
        subject,
        html,
      });
    } catch (error) {
      logger.error('Email send failed:', { to, subject, error });
      // Don't throw — email failure shouldn't break auth flow
    }
  }

  async sendVerificationEmail(
    to: string,
    firstName: string,
    token: string
  ): Promise<void> {
    const verifyUrl = `${env.FRONTEND_URL}/verify-email?token=${token}`;
    const html = this.buildEmailTemplate({
      title: 'Verify Your Email',
      greeting: `Hi ${firstName},`,
      body: `Welcome to ADYAPAN! Please verify your email address to activate your account and start your learning journey.`,
      ctaLabel: 'Verify Email',
      ctaUrl: verifyUrl,
      footer: 'This link expires in 24 hours. If you did not create an account, please ignore this email.',
    });
    await this.send(to, 'Verify Your Email — ADYAPAN', html);
  }

  async sendPasswordResetEmail(
    to: string,
    firstName: string,
    token: string
  ): Promise<void> {
    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${token}`;
    const html = this.buildEmailTemplate({
      title: 'Reset Your Password',
      greeting: `Hi ${firstName},`,
      body: `We received a request to reset your ADYAPAN password.`,
      ctaLabel: 'Reset Password',
      ctaUrl: resetUrl,
      footer: 'This link expires in 1 hour. If you did not request a password reset, please ignore this email.',
    });
    await this.send(to, 'Reset Your Password — ADYAPAN', html);
  }

  async sendCertificateEmail(
    to: string,
    firstName: string,
    courseName: string,
    certificateUrl: string
  ): Promise<void> {
    const html = this.buildEmailTemplate({
      title: 'Congratulations! Your Certificate is Ready',
      greeting: `Congratulations ${firstName}! 🎉`,
      body: `You have successfully completed <strong>${courseName}</strong>. Your certificate is ready for download.`,
      ctaLabel: 'Download Certificate',
      ctaUrl: certificateUrl,
      footer: 'Share your achievement on LinkedIn and let the world know!',
    });
    await this.send(to, `Certificate: ${courseName} — ADYAPAN`, html);
  }

  async sendEnrollmentConfirmation(
    to: string,
    firstName: string,
    courseName: string
  ): Promise<void> {
    const html = this.buildEmailTemplate({
      title: 'Enrollment Confirmed',
      greeting: `Hi ${firstName},`,
      body: `You have successfully enrolled in <strong>${courseName}</strong>. Start learning now!`,
      ctaLabel: 'Start Learning',
      ctaUrl: `${env.FRONTEND_URL}/dashboard`,
      footer: 'Happy learning! The ADYAPAN team is here to support you.',
    });
    await this.send(to, `Enrollment Confirmed: ${courseName} — ADYAPAN`, html);
  }

  async sendJobApplicationNotification(
    to: string,
    firstName: string,
    jobTitle: string,
    companyName: string
  ): Promise<void> {
    const html = this.buildEmailTemplate({
      title: 'Application Submitted',
      greeting: `Hi ${firstName},`,
      body: `Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been submitted successfully.`,
      ctaLabel: 'View Application',
      ctaUrl: `${env.FRONTEND_URL}/student/jobs`,
      footer: 'Track your application status from your dashboard.',
    });
    await this.send(to, `Application Submitted: ${jobTitle} — ADYAPAN`, html);
  }

  private buildEmailTemplate(opts: {
    title: string;
    greeting: string;
    body: string;
    ctaLabel: string;
    ctaUrl: string;
    footer: string;
  }): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${opts.title}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#3b82f6,#8b5cf6);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">ady. ADYAPAN</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:13px;">AI-Powered Career Development Ecosystem</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 24px;">
              <h2 style="margin:0 0 8px;color:#111827;font-size:22px;">${opts.title}</h2>
              <p style="margin:0 0 16px;color:#374151;font-size:16px;">${opts.greeting}</p>
              <p style="margin:0 0 32px;color:#6b7280;font-size:15px;line-height:1.6;">${opts.body}</p>
              <a href="${opts.ctaUrl}"
                style="display:inline-block;background:linear-gradient(135deg,#3b82f6,#8b5cf6);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:15px;font-weight:600;letter-spacing:0.3px;">
                ${opts.ctaLabel}
              </a>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px 32px;border-top:1px solid #e5e7eb;">
              <p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.5;">${opts.footer}</p>
              <p style="margin:16px 0 0;color:#d1d5db;font-size:12px;">
                © ${new Date().getFullYear()} ADYAPAN. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }
}
