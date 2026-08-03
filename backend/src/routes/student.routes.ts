import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { prisma } from '../config/prisma';
import { sendSuccess, getPaginationParams, sendPaginated } from '../utils/response.utils';
import { AppError } from '../middleware/errorHandler.middleware';

const router = Router();

// GET /students/profile — own profile
router.get('/profile', authenticate, async (req, res, next) => {
  try {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: req.user!.userId },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } },
      },
    });
    if (!profile) throw new AppError('Profile not found', 404);
    sendSuccess({ res, data: profile });
  } catch (err) { next(err); }
});

// PUT /students/profile — update own profile
router.put('/profile', authenticate, async (req, res, next) => {
  try {
    const profile = await prisma.studentProfile.upsert({
      where: { userId: req.user!.userId },
      create: { userId: req.user!.userId, ...req.body },
      update: req.body,
    });
    sendSuccess({ res, data: profile, message: 'Profile updated' });
  } catch (err) { next(err); }
});

// GET /students/search — Recruiter and Teacher access
router.get('/search', authenticate, authorize('teacher', 'recruiter', 'admin', 'superadmin'), async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query as Record<string, unknown>);

    const [profiles, total] = await Promise.all([
      prisma.studentProfile.findMany({
        include: { user: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } } },
        skip,
        take: limit,
      }),
      prisma.studentProfile.count(),
    ]);

    sendPaginated({ res, data: profiles, total, page, limit });
  } catch (err) { next(err); }
});

// GET /students/:id/profile — view another student's profile
router.get('/:id/profile', authenticate, async (req, res, next) => {
  try {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: req.params.id },
      include: { user: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
    });
    if (!profile) throw new AppError('Profile not found', 404);
    sendSuccess({ res, data: profile });
  } catch (err) { next(err); }
});

// PUT /students/placement-status
router.put('/placement-status', authenticate, authorize('student'), async (req, res, next) => {
  try {
    const profile = await prisma.studentProfile.update({
      where: { userId: req.user!.userId },
      data: req.body,
    });
    sendSuccess({ res, data: profile });
  } catch (err) { next(err); }
});

export default router;
