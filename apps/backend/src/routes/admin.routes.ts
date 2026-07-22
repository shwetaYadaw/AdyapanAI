import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { prisma } from '../config/prisma';
import { sendSuccess, getPaginationParams, sendPaginated } from '../utils/response.utils';
import { AppError } from '../middleware/errorHandler.middleware';

const router = Router();
router.use(authenticate, authorize('admin', 'superadmin'));

// GET /admin/users
router.get('/users', async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query as Record<string, unknown>);
    const where: any = {};
    if (req.query.role) where.role = String(req.query.role);
    if (req.query.isActive !== undefined) where.isActive = req.query.isActive === 'true';
    if (req.query.search) {
      where.OR = [
        { firstName: { contains: String(req.query.search) } },
        { email: { contains: String(req.query.search) } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true, email: true, firstName: true, lastName: true,
          role: true, isActive: true, isEmailVerified: true, createdAt: true, avatar: true,
        },
      }),
      prisma.user.count({ where }),
    ]);
    sendPaginated({ res, data: users.map(u => ({ ...u, _id: u.id })), total, page, limit });
  } catch (err) { next(err); }
});

// PUT /admin/users/:id/status
router.put('/users/:id/status', async (req, res, next) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { isActive: req.body.isActive },
      select: { id: true, email: true, firstName: true, lastName: true, isActive: true, role: true },
    });
    sendSuccess({ res, data: { ...user, _id: user.id }, message: `User ${req.body.isActive ? 'activated' : 'deactivated'}` });
  } catch (err) { next(err); }
});

// GET /admin/courses/pending
router.get('/courses/pending', async (req, res, next) => {
  try {
    const courses = await prisma.course.findMany({
      where: { isApproved: false, isPublished: true },
      orderBy: { createdAt: 'desc' },
    });
    sendSuccess({ res, data: courses });
  } catch (err) { next(err); }
});

// PUT /admin/courses/:id/approve
router.put('/courses/:id/approve', async (req, res, next) => {
  try {
    const course = await prisma.course.update({
      where: { id: req.params.id },
      data: { isApproved: true, approvedBy: req.user!.userId },
    });
    sendSuccess({ res, data: course, message: 'Course approved' });
  } catch (err) { next(err); }
});

// GET /admin/analytics/overview
router.get('/analytics/overview', async (_req, res, next) => {
  try {
    const [
      totalUsers,
      activeStudents,
      totalCourses,
      publishedCourses,
      totalEnrollments,
      completedEnrollments,
      revenueAgg,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'student', isActive: true } }),
      prisma.course.count(),
      prisma.course.count({ where: { isPublished: true, isApproved: true } }),
      prisma.enrollment.count(),
      prisma.enrollment.count({ where: { isCompleted: true } }),
      prisma.payment.aggregate({ where: { status: 'completed' }, _sum: { amount: true } }),
    ]);

    sendSuccess({
      res,
      data: {
        totalUsers, activeStudents, totalCourses, publishedCourses,
        totalEnrollments, completedEnrollments,
        completionRate: totalEnrollments > 0
          ? ((completedEnrollments / totalEnrollments) * 100).toFixed(1) : 0,
        totalRevenue: revenueAgg._sum.amount ?? 0,
      },
    });
  } catch (err) { next(err); }
});

// GET /admin/analytics/revenue
router.get('/analytics/revenue', async (req, res, next) => {
  try {
    const days = parseInt(String(req.query.days ?? '30'), 10);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Group daily revenue via raw SQL for MySQL
    const revenueData = await prisma.$queryRaw<{ date: string; revenue: number; count: number }[]>`
      SELECT DATE_FORMAT(createdAt, '%Y-%m-%d') as date,
             SUM(amount) as revenue,
             COUNT(*) as count
      FROM Payment
      WHERE status = 'completed' AND createdAt >= ${since}
      GROUP BY DATE_FORMAT(createdAt, '%Y-%m-%d')
      ORDER BY date ASC
    `;

    sendSuccess({ res, data: revenueData });
  } catch (err) { next(err); }
});

// POST /admin/enrollments — Enroll a student manually
router.post('/enrollments', async (req, res, next) => {
  try {
    const { studentEmail, courseId } = req.body;
    const student = await prisma.user.findFirst({
      where: { email: studentEmail.toLowerCase(), role: 'student' },
    });
    if (!student) throw new AppError('Student with this email not found', 404);

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new AppError('Course not found', 404);

    const existing = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: student.id, courseId } },
    });
    if (existing) throw new AppError('Student is already enrolled in this course', 409);

    const enrollment = await prisma.enrollment.create({
      data: { userId: student.id, courseId },
    });

    await prisma.course.update({
      where: { id: courseId },
      data: { enrollmentCount: { increment: 1 } },
    });

    sendSuccess({ res, statusCode: 201, data: enrollment, message: 'Student enrolled successfully' });
  } catch (err) { next(err); }
});

export default router;
