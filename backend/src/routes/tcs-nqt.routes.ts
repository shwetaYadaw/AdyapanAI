import { Router } from 'express';
import { prisma } from '../config/prisma';
import { sendSuccess, sendPaginated, getPaginationParams } from '../utils/response.utils';
import { AppError } from '../middleware/errorHandler.middleware';

const router = Router();

// GET /tcs-nqt - List all TCS NQT questions for students
router.get('/', async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query as Record<string, unknown>);
    const where: any = {};

    // Filter by topic if provided
    if (req.query.topic) {
      where.topic = String(req.query.topic);
    }

    if (req.query.difficulty) {
      where.difficulty = String(req.query.difficulty);
    }

    if (req.query.courseId) {
      where.courseId = String(req.query.courseId);
    }

    if (req.query.search) {
      where.title = { contains: String(req.query.search), mode: 'insensitive' };
    }

    if (req.query.experienceLevel) {
      where.experienceLevel = String(req.query.experienceLevel);
    }

    const [questions, total] = await Promise.all([
      prisma.tcsNqtQuestion.findMany({
        where,
        select: { // Explicitly select fields to ensure experienceLevel is included
          id: true,
          title: true,
          slug: true,
          difficulty: true,
          topic: true,
          companies: true,
          experienceLevel: true, // <--- IMPORTANT: Include this field
          xpReward: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.tcsNqtQuestion.count({ where }),
    ]);

    sendPaginated({ res, data: questions, total, page, limit });
  } catch (err) {
    next(err);
  }
});

// GET /tcs-nqt/:id - Get single TCS NQT question for students (supports both id and slug)
router.get('/:id', async (req, res, next) => {
  try {
    const param = req.params.id;

    // Detect if param is a UUID or a slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(param);

    const selectFields = {
      id: true, title: true, slug: true, statement: true, difficulty: true,
      topic: true, companies: true, inputFormat: true, outputFormat: true,
      constraints: true, testCases: true,
      experienceLevel: true,
      xpReward: true, createdAt: true,
    };

    const question = isUUID
      ? await prisma.tcsNqtQuestion.findUnique({ where: { id: param }, select: selectFields })
      : await prisma.tcsNqtQuestion.findUnique({ where: { slug: param }, select: selectFields });

    if (!question) {
      throw new AppError('TCS NQT question not found', 404);
    }

    sendSuccess({ res, data: question });
  } catch (err) {
    next(err);
  }
});

export default router;