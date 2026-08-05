// @ts-nocheck
import { Router, Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { authenticate } from '../middleware/auth.middleware';
import { sendSuccess } from '../utils/response.utils';
import { AppError } from '../middleware/errorHandler.middleware';
import { COURSES, getCourseById, getCoursesByCategory } from '../config/courses';

const router = Router();

// GET /courses — Get all available courses (public)
router.get('/', (req: Request, res: Response) => {
  const grouped = req.query.grouped === 'true';
  if (grouped) {
    sendSuccess({ res, data: getCoursesByCategory() });
  } else {
    sendSuccess({ res, data: COURSES });
  }
});

// GET /courses/my-course — Get current student's course (MUST be before /:id)
router.get('/my-course', authenticate, async (req: Request, res: Response, next) => {
  try {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: req.user!.userId },
      select: { course: true },
    });

    const courseId = profile?.course;
    const course = courseId ? getCourseById(courseId) : null;

    sendSuccess({ res, data: { courseId, course } });
  } catch (err) { next(err); }
});

// PUT /courses/select — Student selects their course
router.put('/select', authenticate, async (req: Request, res: Response, next) => {
  try {
    const { courseId } = req.body;
    if (!courseId) throw new AppError('courseId is required', 400);

    const course = getCourseById(courseId);
    if (!course) throw new AppError('Invalid course ID', 400);

    // Update student profile
    await prisma.studentProfile.upsert({
      where: { userId: req.user!.userId },
      update: { course: courseId },
      create: { userId: req.user!.userId, course: courseId },
    });

    sendSuccess({ res, data: { courseId, course }, message: 'Course selected successfully' });
  } catch (err) { next(err); }
});

// GET /courses/:id — Get single course details
router.get('/:id', (req: Request, res: Response) => {
  const course = getCourseById(req.params.id);
  if (!course) throw new AppError('Course not found', 404);
  sendSuccess({ res, data: course });
});

export default router;
