import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { prisma } from '../config/prisma';
import { sendSuccess, sendPaginated, getPaginationParams } from '../utils/response.utils';
import { AppError } from '../middleware/errorHandler.middleware';

const router = Router();

// ============================================================================
// PUBLIC ENDPOINTS - List topics and chapters
// ============================================================================

// GET /aptitude/topics - List all topics
router.get('/topics', async (req, res, next) => {
  try {
    const topics = await prisma.aptitudeTopic.findMany({
      where: { isActive: true },
      include: {
        chapters: {
          where: { isActive: true },
          select: { id: true, name: true, order: true },
        },
      },
      orderBy: { order: 'asc' },
    });

    sendSuccess({ res, data: topics });
  } catch (err) {
    next(err);
  }
});

// GET /aptitude/topics/:topicId - Get topic with chapters
router.get('/topics/:topicId', async (req, res, next) => {
  try {
    const topic = await prisma.aptitudeTopic.findUnique({
      where: { id: req.params.topicId, isActive: true },
      include: {
        chapters: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!topic) {
      throw new AppError('Topic not found', 404);
    }

    sendSuccess({ res, data: topic });
  } catch (err) {
    next(err);
  }
});

// GET /aptitude/topics/:topicId/chapters/:chapterId - Get chapter with questions
router.get('/topics/:topicId/chapters/:chapterId', async (req, res, next) => {
  try {
    const chapter = await prisma.aptitudeChapter.findUnique({
      where: { id: req.params.chapterId, isActive: true },
      include: {
        questions: {
          where: { isActive: true },
          include: {
            options: {
              select: { id: true, optionKey: true, text: true, order: true },
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!chapter || chapter.topicId !== req.params.topicId) {
      throw new AppError('Chapter not found', 404);
    }

    sendSuccess({ res, data: chapter });
  } catch (err) {
    next(err);
  }
});

// GET /aptitude/questions/:questionId - Get single question
router.get('/questions/:questionId', async (req, res, next) => {
  try {
    const question = await prisma.aptitudeQuestion.findUnique({
      where: { id: req.params.questionId, isActive: true },
      include: {
        options: {
          select: { id: true, optionKey: true, text: true, order: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!question) {
      throw new AppError('Question not found', 404);
    }

    sendSuccess({ res, data: question });
  } catch (err) {
    next(err);
  }
});

// ============================================================================
// AUTHENTICATED ENDPOINTS - Student submissions and progress
// ============================================================================

// POST /aptitude/questions/:questionId/submit - Submit answer
router.post('/questions/:questionId/submit', authenticate, async (req, res, next) => {
  try {
    const { selectedOption, timeSpent } = req.body;

    if (!selectedOption) {
      throw new AppError('Selected option is required', 400);
    }

    const question = await prisma.aptitudeQuestion.findUnique({
      where: { id: req.params.questionId, isActive: true },
    });

    if (!question) {
      throw new AppError('Question not found', 404);
    }

    // Check if option is valid
    const option = await prisma.aptitudeOption.findFirst({
      where: {
        questionId: req.params.questionId,
        optionKey: selectedOption,
      },
    });

    if (!option) {
      throw new AppError('Invalid option selected', 400);
    }

    // Determine if answer is correct
    const isCorrect = selectedOption === question.correctOption;
    const xpGained = isCorrect ? question.xpReward : 0;

    // Create submission record
    const submission = await prisma.aptitudeSubmission.create({
      data: {
        userId: req.user!.userId,
        questionId: req.params.questionId,
        selectedOption,
        isCorrect,
        timeSpent: timeSpent || 0,
        xpEarned: xpGained,
      },
    });

    // Update user XP if correct
    if (isCorrect) {
      await prisma.studentProfile.updateMany({
        where: { userId: req.user!.userId },
        data: {
          xp: {
            increment: xpGained,
          },
          totalXP: {
            increment: xpGained,
          },
        },
      });
    }

    sendSuccess({
      res,
      statusCode: 201,
      data: {
        submission,
        isCorrect,
        xpGained,
        correctOption: question.correctOption,
        explanation: isCorrect ? null : question.explanation, // Show explanation only if wrong
      },
      message: isCorrect ? 'Correct answer!' : 'Incorrect answer. Check the explanation.',
    });
  } catch (err) {
    next(err);
  }
});

// GET /aptitude/progress - Get student progress
router.get('/progress', authenticate, async (req, res, next) => {
  try {
    const submissions = await prisma.aptitudeSubmission.findMany({
      where: { userId: req.user!.userId },
      include: {
        question: {
          include: { chapter: { include: { topic: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate stats
    const totalAttempted = submissions.length;
    const totalCorrect = submissions.filter((s) => s.isCorrect).length;
    const accuracy = totalAttempted > 0 ? (totalCorrect / totalAttempted) * 100 : 0;
    const totalXP = submissions.reduce((sum, s) => sum + s.xpEarned, 0);

    // Topic-wise breakdown
    const topicStats: Record<
      string,
      { attempted: number; correct: number; accuracy: number }
    > = {};

    submissions.forEach((sub) => {
      const topicName = sub.question.chapter.topic.name;
      if (!topicStats[topicName]) {
        topicStats[topicName] = { attempted: 0, correct: 0, accuracy: 0 };
      }
      topicStats[topicName].attempted++;
      if (sub.isCorrect) topicStats[topicName].correct++;
    });

    // Calculate accuracy for each topic
    Object.keys(topicStats).forEach((topic) => {
      topicStats[topic].accuracy = 
        topicStats[topic].attempted > 0
          ? (topicStats[topic].correct / topicStats[topic].attempted) * 100
          : 0;
    });

    const progress = {
      overall: {
        totalAttempted,
        totalCorrect,
        accuracy: Math.round(accuracy * 100) / 100,
        totalXP,
      },
      topicwise: topicStats,
      recentSubmissions: submissions.slice(0, 10).map((s) => ({
        id: s.id,
        question: s.question.statement.substring(0, 50) + '...',
        topic: s.question.chapter.topic.name,
        chapter: s.question.chapter.name,
        isCorrect: s.isCorrect,
        xpGained: s.xpEarned,
        attemptedAt: s.createdAt,
      })),
    };

    sendSuccess({ res, data: progress });
  } catch (err) {
    next(err);
  }
});

// GET /aptitude/progress/:topicId - Get progress for specific topic
router.get('/progress/:topicId', authenticate, async (req, res, next) => {
  try {
    const submissions = await prisma.aptitudeSubmission.findMany({
      where: {
        userId: req.user!.userId,
        question: {
          chapter: {
            topicId: req.params.topicId,
          },
        },
      },
      include: {
        question: {
          include: { chapter: true },
        },
      },
    });

    const totalAttempted = submissions.length;
    const totalCorrect = submissions.filter((s) => s.isCorrect).length;
    const accuracy = totalAttempted > 0 ? (totalCorrect / totalAttempted) * 100 : 0;
    const totalXP = submissions.reduce((sum, s) => sum + s.xpEarned, 0);

    // Chapter-wise breakdown
    const chapterStats: Record<
      string,
      { attempted: number; correct: number; accuracy: number }
    > = {};

    submissions.forEach((sub) => {
      const chapterName = sub.question.chapter.name;
      if (!chapterStats[chapterName]) {
        chapterStats[chapterName] = { attempted: 0, correct: 0, accuracy: 0 };
      }
      chapterStats[chapterName].attempted++;
      if (sub.isCorrect) chapterStats[chapterName].correct++;
    });

    Object.keys(chapterStats).forEach((chapter) => {
      chapterStats[chapter].accuracy =
        chapterStats[chapter].attempted > 0
          ? (chapterStats[chapter].correct / chapterStats[chapter].attempted) * 100
          : 0;
    });

    sendSuccess({
      res,
      data: {
        topic: req.params.topicId,
        overall: {
          totalAttempted,
          totalCorrect,
          accuracy: Math.round(accuracy * 100) / 100,
          totalXP,
        },
        chapterwise: chapterStats,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /aptitude/submissions - Get all submissions for current user
router.get('/submissions', authenticate, async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query as Record<string, unknown>);

    const [submissions, total] = await Promise.all([
      prisma.aptitudeSubmission.findMany({
        where: { userId: req.user!.userId },
        include: {
          question: {
            include: { chapter: { include: { topic: true } } },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.aptitudeSubmission.count({ where: { userId: req.user!.userId } }),
    ]);

    sendPaginated({
      res,
      data: submissions.map((s) => ({
        id: s.id,
        question: s.question.statement,
        topic: s.question.chapter.topic.name,
        chapter: s.question.chapter.name,
        selectedOption: s.selectedOption,
        correctOption: s.question.correctOption,
        isCorrect: s.isCorrect,
        xpGained: s.xpEarned,
        timeSpent: s.timeSpent,
        attemptedAt: s.createdAt,
      })),
      total,
      page,
      limit,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
