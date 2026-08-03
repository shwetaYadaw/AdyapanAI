import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { prisma } from '../config/prisma';
import { sendSuccess } from '../utils/response.utils';
import { AppError } from '../middleware/errorHandler.middleware';

const router = Router();

// GET /contests - Get all contests (public for students)
router.get('/', async (req, res, next) => {
  try {
    const contests = await prisma.contest.findMany({
      orderBy: { startTime: 'desc' },
    });

    sendSuccess({ res, data: contests });
  } catch (err) {
    next(err);
  }
});

// GET /contests/:id - Get single contest
router.get('/:id', async (req, res, next) => {
  try {
    const contest = await prisma.contest.findUnique({
      where: { id: req.params.id },
    });

    if (!contest) {
      throw new AppError('Contest not found', 404);
    }

    sendSuccess({ res, data: contest });
  } catch (err) {
    next(err);
  }
});

// POST /contests - Create contest (admin only)
router.post('/', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { title, description, startTime, endTime, questions } = req.body;

    if (!title || !startTime || !endTime) {
      throw new AppError('Title, start time, and end time are required', 400);
    }

    const contest = await prisma.contest.create({
      data: {
        title,
        description: description || '',
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        questions: questions || [],
      },
    });

    sendSuccess({ res, statusCode: 201, data: contest, message: 'Contest created successfully' });
  } catch (err) {
    next(err);
  }
});

// PUT /contests/:id - Update contest (admin only)
router.put('/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { title, description, startTime, endTime, questions } = req.body;

    const existing = await prisma.contest.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      throw new AppError('Contest not found', 404);
    }

    const contest = await prisma.contest.update({
      where: { id: req.params.id },
      data: {
        title: title || existing.title,
        description: description !== undefined ? description : existing.description,
        startTime: startTime ? new Date(startTime) : existing.startTime,
        endTime: endTime ? new Date(endTime) : existing.endTime,
        questions: questions !== undefined ? questions : existing.questions,
      },
    });

    sendSuccess({ res, data: contest, message: 'Contest updated successfully' });
  } catch (err) {
    next(err);
  }
});

// DELETE /contests/:id - Delete contest (admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const existing = await prisma.contest.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      throw new AppError('Contest not found', 404);
    }

    await prisma.contest.delete({
      where: { id: req.params.id },
    });

    sendSuccess({ res, message: 'Contest deleted successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
