import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { prisma } from '../config/prisma';
import { sendSuccess, sendError } from '../utils/response.utils';
import { AppError } from '../middleware/errorHandler.middleware';
import { logger } from '../utils/logger';
import axios from 'axios';

const router = Router();

// ──────────────────────────────────────────────────────────────────────────────
// GET /puzzles — List all published puzzles with filters
// ──────────────────────────────────────────────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const { puzzleType, difficulty, category, search, page = 1, limit = 20 } = req.query;
    
    const where: any = { isPublished: true };
    
    if (puzzleType) {
      where.puzzleType = String(puzzleType);
    }
    
    if (difficulty) {
      where.difficulty = String(difficulty);
    }
    
    if (category) {
      where.category = String(category);
    }
    
    if (search) {
      where.OR = [
        { title: { contains: String(search), mode: 'insensitive' } },
        { description: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [puzzles, total] = await Promise.all([
      prisma.puzzle.findMany({
        where,
        select: {
          id: true,
          title: true,
          description: true,
          puzzleType: true,
          difficulty: true,
          category: true,
          topic: true,
          estimatedTime: true,
          rating: true,
          ratingCount: true,
          completionRate: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.puzzle.count({ where }),
    ]);

    sendSuccess({
      res,
      data: {
        puzzles,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// GET /puzzles/:id — Get puzzle details
// ──────────────────────────────────────────────────────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const puzzle = await prisma.puzzle.findUnique({
      where: { id },
      include: {
        reviews: {
          where: { rating: { gt: 0 } },
          select: {
            rating: true,
            comment: true,
            user: {
              select: { id: true, firstName: true, avatar: true },
            },
          },
          take: 5,
        },
      },
    });

    if (!puzzle) {
      throw new AppError('Puzzle not found', 404);
    }

    sendSuccess({ res, data: puzzle });
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// POST /puzzles/:id/attempt — Submit a puzzle attempt
// ──────────────────────────────────────────────────────────────────────────────
router.post('/:id/attempt', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { selectedAnswer, timeSpent, confidence } = req.body;
    const userId = (req as any).user.id;

    if (!selectedAnswer || timeSpent === undefined) {
      throw new AppError('selectedAnswer and timeSpent are required', 400);
    }

    const puzzle = await prisma.puzzle.findUnique({
      where: { id },
      select: { correctAnswer: true, explanation: true },
    });

    if (!puzzle) {
      throw new AppError('Puzzle not found', 404);
    }

    const isCorrect = selectedAnswer === puzzle.correctAnswer;
    const xpEarned = isCorrect ? 10 : 0;

    // Create attempt record
    const attempt = await prisma.puzzleAttempt.create({
      data: {
        puzzleId: id,
        userId,
        selectedAnswer,
        isCorrect,
        timeSpent,
        confidence,
        xpEarned,
      },
    });

    // Update user XP
    await prisma.studentProfile.update({
      where: { userId },
      data: { xp: { increment: xpEarned } },
    });

    sendSuccess({
      res,
      data: {
        attempt,
        isCorrect,
        xpEarned,
        explanation: puzzle.explanation,
        correctAnswer: puzzle.correctAnswer,
      },
      statusCode: 201,
    });
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// GET /puzzles/:id/attempts — Get user's attempts on a puzzle
// ──────────────────────────────────────────────────────────────────────────────
router.get('/:id/attempts', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    const attempts = await prisma.puzzleAttempt.findMany({
      where: {
        puzzleId: id,
        userId,
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        selectedAnswer: true,
        isCorrect: true,
        timeSpent: true,
        confidence: true,
        xpEarned: true,
        createdAt: true,
      },
    });

    const stats = {
      totalAttempts: attempts.length,
      correctAttempts: attempts.filter((a) => a.isCorrect).length,
      accuracy: attempts.length > 0 ? (attempts.filter((a) => a.isCorrect).length / attempts.length) * 100 : 0,
      totalXpEarned: attempts.reduce((sum, a) => sum + a.xpEarned, 0),
      averageTimeSpent: attempts.length > 0 ? attempts.reduce((sum, a) => sum + a.timeSpent, 0) / attempts.length : 0,
    };

    sendSuccess({ res, data: { attempts, stats } });
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// POST /puzzles/:id/review — Submit or update a review
// ──────────────────────────────────────────────────────────────────────────────
router.post('/:id/review', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment, helpful } = req.body;
    const userId = (req as any).user.id;

    if (!rating || rating < 1 || rating > 5) {
      throw new AppError('Rating must be between 1 and 5', 400);
    }

    // Check if puzzle exists
    const puzzle = await prisma.puzzle.findUnique({ where: { id } });
    if (!puzzle) {
      throw new AppError('Puzzle not found', 404);
    }

    // Upsert review
    const review = await prisma.puzzleReview.upsert({
      where: { puzzleId_userId: { puzzleId: id, userId } },
      update: { rating, comment, helpful },
      create: { puzzleId: id, userId, rating, comment, helpful },
    });

    // Recalculate puzzle rating
    const reviews = await prisma.puzzleReview.findMany({
      where: { puzzleId: id },
      select: { rating: true },
    });

    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await prisma.puzzle.update({
      where: { id },
      data: {
        rating: avgRating,
        ratingCount: reviews.length,
      },
    });

    sendSuccess({
      res,
      data: review,
      statusCode: 201,
    });
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// GET /puzzles/stats/dashboard — Get user's puzzle dashboard stats
// ──────────────────────────────────────────────────────────────────────────────
router.get('/stats/dashboard', authenticate, async (req, res, next) => {
  try {
    const userId = (req as any).user.id;

    const [totalAttempts, correctAttempts, byDifficulty, byType] = await Promise.all([
      prisma.puzzleAttempt.count({ where: { userId } }),
      prisma.puzzleAttempt.count({
        where: { userId, isCorrect: true },
      }),
      prisma.puzzleAttempt.groupBy({
        by: ['puzzle'],
        where: { userId },
        _count: { isCorrect: true },
      }),
      prisma.puzzle.groupBy({
        by: ['puzzleType'],
        where: { attempts: { some: { userId } } },
        _count: { id: true },
      }),
    ]);

    const stats = {
      totalAttempts,
      correctAttempts,
      accuracy: totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0,
      byDifficulty: {},
      byType: {},
    };

    sendSuccess({ res, data: stats });
  } catch (err) {
    next(err);
  }
});

export default router;
