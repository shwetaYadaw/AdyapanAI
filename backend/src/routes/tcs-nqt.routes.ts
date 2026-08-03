import { Router } from 'express';
import { prisma } from '../config/prisma';
import { authenticate } from '../middleware/auth.middleware';
import { sendSuccess, sendPaginated, getPaginationParams } from '../utils/response.utils';
import { AppError } from '../middleware/errorHandler.middleware';

const router = Router();

// ============================================================================
// TCS NQT STUDENT ROUTES - Public/Student-facing TCS NQT question endpoints
// ============================================================================

// GET /tcs-nqt - Get all TCS NQT questions for students
router.get('/', async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query as Record<string, unknown>);
    const where: any = {};

    // Filter by topic if provided
    if (req.query.topic) {
      where.topic = String(req.query.topic);
    }

    // Filter by difficulty if provided
    if (req.query.difficulty) {
      where.difficulty = String(req.query.difficulty);
    }

    // Search by title if provided
    if (req.query.search) {
      where.title = { contains: String(req.query.search), mode: 'insensitive' };
    }

    const [questions, total] = await Promise.all([
      prisma.tcsNqtQuestion.findMany({
        where,
        select: {
          id: true,
          slug: true,
          title: true,
          difficulty: true,
          topic: true,
          companies: true,
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

// GET /tcs-nqt/stats - Get TCS NQT statistics for student dashboard
router.get('/stats', authenticate, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    
    const total = await prisma.tcsNqtQuestion.count();

    const byDifficulty = await prisma.tcsNqtQuestion.groupBy({
      by: ['difficulty'],
      _count: true,
    });

    const byTopic = await prisma.tcsNqtQuestion.groupBy({
      by: ['topic'],
      _count: true,
    });

    let solvedCount = 0;
    if (userId) {
      // Count unique problems solved by this user
      const solvedSubmissions = await prisma.questionSubmission.findMany({
        where: {
          userId,
          status: 'accepted',
        },
        select: {
          questionId: true,
        },
        distinct: ['questionId'],
      });
      solvedCount = solvedSubmissions.length;
    }

    const stats = {
      total,
      solvedCount,
      totalQuestions: total,
      byDifficulty: byDifficulty.reduce((acc: any, item: any) => {
        acc[item.difficulty] = item._count;
        return acc;
      }, {}),
      byTopic: byTopic.reduce((acc: any, item: any) => {
        acc[item.topic] = item._count;
        return acc;
      }, {}),
    };

    sendSuccess({ res, data: stats });
  } catch (err) {
    next(err);
  }
});

// GET /tcs-nqt/:slug - Get single TCS NQT question by slug (no authentication required for viewing)
router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;

    // Try to find by slug first
    let question = await prisma.tcsNqtQuestion.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        title: true,
        statement: true,
        difficulty: true,
        topic: true,
        companies: true,
        inputFormat: true,
        outputFormat: true,
        constraints: true,
        testCases: true, // Include test cases for TCS NQT
        xpReward: true,
        createdAt: true,
      },
    });

    // If not found by slug, try by ID
    if (!question) {
      question = await prisma.tcsNqtQuestion.findUnique({
        where: { id: slug },
        select: {
          id: true,
          slug: true,
          title: true,
          statement: true,
          difficulty: true,
          topic: true,
          companies: true,
          inputFormat: true,
          outputFormat: true,
          constraints: true,
          testCases: true,
          xpReward: true,
          createdAt: true,
        },
      });
    }

    if (!question) {
      throw new AppError('TCS NQT question not found', 404);
    }

    sendSuccess({ res, data: question });
  } catch (err) {
    next(err);
  }
});

// GET /tcs-nqt/leaderboard - Get TCS NQT leaderboard (top performers)
router.get('/leaderboard', async (_req, res, next) => {
  try {
    // Get top 10 users by solved TCS NQT questions
    const leaderboard = await prisma.user.findMany({
      where: {
        role: 'student',
      },
      select: {
        id: true,
        name: true,
        email: true,
        totalXP: true,
        questionSubmissions: {
          where: {
            status: 'accepted',
          },
          select: {
            questionId: true,
          },
          distinct: ['questionId'],
        },
      },
      orderBy: {
        totalXP: 'desc',
      },
      take: 10,
    });

    const formattedLeaderboard = leaderboard.map((user) => ({
      userId: user.id,
      name: user.name,
      email: user.email,
      totalXP: user.totalXP,
      solvedCount: user.questionSubmissions.length,
    }));

    sendSuccess({ res, data: formattedLeaderboard });
  } catch (err) {
    next(err);
  }
});

export default router;
