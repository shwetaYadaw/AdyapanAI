import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { prisma } from '../config/prisma';
import { sendSuccess } from '../utils/response.utils';
import { AppError } from '../middleware/errorHandler.middleware';

const router = Router();

// GET /users/me
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        avatar: true, role: true, isEmailVerified: true, isActive: true,
        phone: true, phoneVerified: true, preferences: true, createdAt: true,
      },
    });
    if (!user) throw new AppError('User not found', 404);
    sendSuccess({ res, data: { ...user, _id: user.id } });
  } catch (err) { next(err); }
});

// PUT /users/me
router.put('/me', authenticate, async (req, res, next) => {
  try {
    const allowed = ['firstName', 'lastName', 'avatar', 'phone', 'preferences'];
    const updates: Record<string, unknown> = {};
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: updates,
      select: {
        id: true, email: true, firstName: true, lastName: true,
        avatar: true, role: true, phone: true, preferences: true,
      },
    });
    sendSuccess({ res, data: { ...user, _id: user.id }, message: 'Profile updated' });
  } catch (err) { next(err); }
});

// DELETE /users/me — deactivate account
router.delete('/me', authenticate, async (req, res, next) => {
  try {
    await prisma.user.update({ where: { id: req.user!.userId }, data: { isActive: false } });
    sendSuccess({ res, message: 'Account deactivated' });
  } catch (err) { next(err); }
});

// GET /users/:id/public — public profile
router.get('/:id/public', async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: { id: true, firstName: true, lastName: true, avatar: true, role: true },
    });
    if (!user) throw new AppError('User not found', 404);
    sendSuccess({ res, data: { ...user, _id: user.id } });
  } catch (err) { next(err); }
});

export default router;
