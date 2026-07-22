import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { prisma } from '../config/prisma';
import { sendSuccess } from '../utils/response.utils';
import { AppError } from '../middleware/errorHandler.middleware';

const router = Router();

// POST /enrollments — Enroll (free courses or post-payment)
router.post('/', authenticate, authorize('student'), async (req, res, next) => {
  try {
    const { courseId, paymentId } = req.body;
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new AppError('Course not found', 404);

    if (!course.isFree && !paymentId) {
      throw new AppError('Payment required for this course', 402);
    }

    const existing = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: req.user!.userId, courseId } },
    });
    if (existing) throw new AppError('Already enrolled', 409);

    const enrollment = await prisma.enrollment.create({
      data: { userId: req.user!.userId, courseId },
    });

    if (course.isFree) {
      await prisma.course.update({
        where: { id: courseId },
        data: { enrollmentCount: { increment: 1 } },
      });
    }

    sendSuccess({ res, statusCode: 201, data: enrollment, message: 'Enrolled successfully' });
  } catch (err) { next(err); }
});

// GET /enrollments/my-courses
router.get('/my-courses', authenticate, async (req, res, next) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: req.user!.userId },
      include: {
        course: {
          select: { id: true, title: true, image: true, category: true, level: true, rating: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
    sendSuccess({ res, data: enrollments });
  } catch (err) { next(err); }
});

// GET /enrollments/:courseId/progress
router.get('/:courseId/progress', authenticate, async (req, res, next) => {
  try {
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: req.user!.userId, courseId: req.params.courseId } },
    });
    if (!enrollment) throw new AppError('Enrollment not found', 404);
    sendSuccess({ res, data: enrollment });
  } catch (err) { next(err); }
});

// PUT /enrollments/:courseId/progress — Update progress percentage
router.put('/:courseId/progress', authenticate, async (req, res, next) => {
  try {
    const { progress } = req.body;
    const enrollment = await prisma.enrollment.update({
      where: { userId_courseId: { userId: req.user!.userId, courseId: req.params.courseId } },
      data: {
        progress: Math.min(100, Math.max(0, parseInt(progress ?? 0))),
        ...(progress >= 80 ? { isCompleted: true, completedAt: new Date() } : {}),
      },
    });
    sendSuccess({ res, data: enrollment });
  } catch (err) { next(err); }
});

export default router;
