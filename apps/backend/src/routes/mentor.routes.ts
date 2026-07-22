import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { prisma } from '../config/prisma';
import { sendSuccess, sendPaginated, getPaginationParams } from '../utils/response.utils';
import { AppError } from '../middleware/errorHandler.middleware';

const router = Router();

// GET /mentors — public list
router.get('/', async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query as Record<string, unknown>);
    const where: any = { isApproved: true, isActive: true };

    const [mentors, total] = await Promise.all([
      prisma.mentor.findMany({
        where,
        include: { user: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
        orderBy: { rating: 'desc' },
        skip,
        take: limit,
      }),
      prisma.mentor.count({ where }),
    ]);
    sendPaginated({ res, data: mentors, total, page, limit });
  } catch (err) { next(err); }
});

// GET /mentors/:id
router.get('/:id', async (req, res, next) => {
  try {
    const mentor = await prisma.mentor.findUnique({
      where: { id: req.params.id },
      include: { user: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
    });
    if (!mentor) throw new AppError('Mentor not found', 404);
    sendSuccess({ res, data: mentor });
  } catch (err) { next(err); }
});

// POST /mentors/profile — mentor creates profile
router.post('/profile', authenticate, authorize('mentor'), async (req, res, next) => {
  try {
    const existing = await prisma.mentor.findUnique({ where: { userId: req.user!.userId } });
    if (existing) throw new AppError('Mentor profile already exists', 409);
    const mentor = await prisma.mentor.create({
      data: { ...req.body, userId: req.user!.userId },
    });
    sendSuccess({ res, statusCode: 201, data: mentor });
  } catch (err) { next(err); }
});

// PUT /mentors/profile
router.put('/profile', authenticate, authorize('mentor'), async (req, res, next) => {
  try {
    const mentor = await prisma.mentor.update({
      where: { userId: req.user!.userId },
      data: req.body,
    });
    sendSuccess({ res, data: mentor });
  } catch (err) { next(err); }
});

// POST /mentors/sessions/book — student books session
router.post('/sessions/book', authenticate, authorize('student'), async (req, res, next) => {
  try {
    const { mentorId, scheduledAt, topic, paymentId } = req.body;
    const mentor = await prisma.mentor.findUnique({ where: { id: mentorId } });
    if (!mentor) throw new AppError('Mentor not found', 404);

    const session = await prisma.mentorSession.create({
      data: {
        mentorId,
        studentId: req.user!.userId,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
        topic,
        paymentId,
        duration: mentor.sessionDuration,
      },
    });
    sendSuccess({ res, statusCode: 201, data: session });
  } catch (err) { next(err); }
});

// GET /mentors/sessions/my-sessions
router.get('/sessions/my-sessions', authenticate, async (req, res, next) => {
  try {
    const where = req.user!.role === 'mentor'
      ? { mentor: { userId: req.user!.userId } }
      : { studentId: req.user!.userId };

    const sessions = await prisma.mentorSession.findMany({
      where,
      include: {
        mentor: { select: { id: true, headline: true, currentCompany: true, currentRole: true } },
        student: { select: { id: true, firstName: true, lastName: true, avatar: true } },
      },
      orderBy: { scheduledAt: 'desc' },
    });
    sendSuccess({ res, data: sessions });
  } catch (err) { next(err); }
});

// PUT /mentors/sessions/:id/review
router.put('/sessions/:id/review', authenticate, authorize('student'), async (req, res, next) => {
  try {
    const session = await prisma.mentorSession.update({
      where: { id: req.params.id },
      data: { studentRating: req.body.rating, studentReview: req.body.review },
    });
    if (!session) throw new AppError('Session not found', 404);

    // Recalculate mentor average rating
    const avgRating = await prisma.mentorSession.aggregate({
      where: { mentorId: session.mentorId, studentRating: { not: null } },
      _avg: { studentRating: true },
    });
    await prisma.mentor.update({
      where: { id: session.mentorId },
      data: { rating: avgRating._avg.studentRating ?? 0 },
    });

    sendSuccess({ res, data: session });
  } catch (err) { next(err); }
});

export default router;
