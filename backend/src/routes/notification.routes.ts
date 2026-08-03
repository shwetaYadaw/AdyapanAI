import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { prisma } from '../config/prisma';
import { sendSuccess, getPaginationParams, sendPaginated } from '../utils/response.utils';
import { AppError } from '../middleware/errorHandler.middleware';

const router = Router();
router.use(authenticate);

// GET /notifications
router.get('/', async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query as Record<string, unknown>);
    const where: any = { userId: req.user!.userId };
    if (req.query.unread === 'true') where.isRead = false;

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { userId: req.user!.userId, isRead: false } }),
    ]);

    res.status(200).json({
      success: true,
      data: notifications,
      unreadCount,
      pagination: { total, page, pages: Math.ceil(total / limit), limit },
    });
  } catch (err) { next(err); }
});

// PUT /notifications/:id/read
router.put('/:id/read', async (req, res, next) => {
  try {
    const existing = await prisma.notification.findFirst({
      where: { id: req.params.id, userId: req.user!.userId },
    });
    if (!existing) throw new AppError('Notification not found', 404);

    const notif = await prisma.notification.update({
      where: { id: req.params.id },
      data: { isRead: true, readAt: new Date() },
    });
    sendSuccess({ res, data: notif });
  } catch (err) { next(err); }
});

// PUT /notifications/read-all
router.put('/read-all', async (req, res, next) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user!.userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
    sendSuccess({ res, message: 'All notifications marked as read' });
  } catch (err) { next(err); }
});

// DELETE /notifications/:id
router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.notification.deleteMany({
      where: { id: req.params.id, userId: req.user!.userId },
    });
    sendSuccess({ res, message: 'Notification deleted' });
  } catch (err) { next(err); }
});

export default router;
