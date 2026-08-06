import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { authenticate } from '../middleware/auth.middleware';
import { sendSuccess, sendPaginated, getPaginationParams } from '../utils/response.utils';
import { AppError } from '../middleware/errorHandler.middleware';

const router = Router();

// ============================================================================
// TOPIC ROUTES (Student View)
// ============================================================================

// GET /aptitude/topics — Get all aptitude topics
router.get('/topics', async (req, res, next) => {
  try {
    const topics = await prisma.aptitudeTopic.findMany({
      where: { isActive: true },
      include: {
        chapters: {
          where: { isActive: true },
          select: { id: true, name: true, description: true, order: true },
        },
      },
      orderBy: { order: 'asc' },
    });

    sendSuccess({ res, data: topics });
  } catch (err) {
    next(err);
  }
});

// GET /aptitude/topics/:topicId — Get specific topic with chapters
router.get('/topics/:topicId', async (req, res, next) => {
  try {
    const topic = await prisma.aptitudeTopic.findUnique({
      where: { id: req.params.topicId },
      include: {
        chapters: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
          include: {
            questions: {
              where: { isActive: true },
              select: { id: true, statement: true, difficulty: true },
            },
          },
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

// ============================================================================
// CHAPTER ROUTES (Student View)
// ============================================================================

// GET /aptitude/topics/:topicId/chapters — Get all chapters in a topic
router.get('/topics/:topicId/chapters', async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query as Record<string, unknown>);

    const topic = await prisma.aptitudeTopic.findUnique({
      where: { id: req.params.topicId },
    });

    if (!topic) {
      throw new AppError('Topic not found', 404);
    }

    const [chapters, total] = await Promise.all([
      prisma.aptitudeChapter.findMany({
        where: { topicId: req.params.topicId, isActive: true },
        include: {
          questions: {
            where: { isActive: true },
            select: { id: true },
          },
        },
        orderBy: { order: 'asc' },
        skip,
        take: limit,
      }),
      prisma.aptitudeChapter.count({ where: { topicId: req.params.topicId, isActive: true } }),
    ]);

    sendPaginated({ res, data: chapters, total, page, limit });
  } catch (err) {
    next(err);
  }
});

// GET /aptitude/topics/:topicId/chapters/:chapterId — Get specific chapter with questions
router.get('/topics/:topicId/chapters/:chapterId', async (req, res, next) => {
  try {
    const chapter = await prisma.aptitudeChapter.findUnique({
      where: { id: req.params.chapterId },
      include: {
        questions: {
          where: { isActive: true },
          include: { options: { orderBy: { order: 'asc' } } },
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

// ============================================================================
// QUESTION ROUTES (Student View)
// ============================================================================

// GET /aptitude/topics/:topicId/chapters/:chapterId/questions — Get all questions in chapter
router.get('/topics/:topicId/chapters/:chapterId/questions', async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query as Record<string, unknown>);

    const chapter = await prisma.aptitudeChapter.findUnique({
      where: { id: req.params.chapterId },
    });

    if (!chapter || chapter.topicId !== req.params.topicId) {
      throw new AppError('Chapter not found', 404);
    }

    const [questions, total] = await Promise.all([
      prisma.aptitudeQuestion.findMany({
        where: { chapterId: req.params.chapterId, isActive: true },
        include: { options: { orderBy: { order: 'asc' } } },
        orderBy: { createdAt: 'asc' },
        skip,
        take: limit,
      }),
      prisma.aptitudeQuestion.count({ where: { chapterId: req.params.chapterId, isActive: true } }),
    ]);

    sendPaginated({ res, data: questions, total, page, limit });
  } catch (err) {
    next(err);
  }
});

// GET /aptitude/topics/:topicId/chapters/:chapterId/questions/:questionId — Get specific question
router.get('/topics/:topicId/chapters/:chapterId/questions/:questionId', async (req, res, next) => {
  try {
    const question = await prisma.aptitudeQuestion.findUnique({
      where: { id: req.params.questionId },
      include: {
        options: { orderBy: { order: 'asc' } },
      },
    });

    if (!question || question.chapterId !== req.params.chapterId) {
      throw new AppError('Question not found', 404);
    }

    sendSuccess({ res, data: question });
  } catch (err) {
    next(err);
  }
});

// ============================================================================
// SUBMISSION ROUTES (Authenticated)
// ============================================================================

// POST /aptitude/submit — Submit an aptitude question answer
router.post('/submit', authenticate, async (req, res, next) => {
  try {
    const { questionId, selectedOption, timeSpent } = req.body;

    if (!questionId || !selectedOption) {
      throw new AppError('Question ID and selected option are required', 400);
    }

    const question = await prisma.aptitudeQuestion.findUnique({
      where: { id: questionId },
      include: { options: true },
    });

    if (!question) {
      throw new AppError('Question not found', 404);
    }

    const isCorrect = question.correctOption === selectedOption;

    const submission = await prisma.aptitudeSubmission.create({
      data: {
        userId: req.user?.userId,
        questionId,
        selectedOption,
        isCorrect,
        timeSpent: timeSpent || 0,
      },
    });

    sendSuccess({
      res,
      statusCode: 201,
      data: { ...submission, isCorrect, correctOption: question.correctOption },
      message: 'Answer submitted successfully',
    });
  } catch (err) {
    next(err);
  }
});

// GET /aptitude/submissions — Get user's aptitude submissions
router.get('/submissions', authenticate, async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query as Record<string, unknown>);

    const [submissions, total] = await Promise.all([
      prisma.aptitudeSubmission.findMany({
        where: { userId: req.user?.userId },
        include: {
          question: {
            include: { chapter: { include: { topic: true } } },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.aptitudeSubmission.count({ where: { userId: req.user?.userId } }),
    ]);

    sendPaginated({ res, data: submissions, total, page, limit });
  } catch (err) {
    next(err);
  }
});

// GET /aptitude/submissions/:topicId — Get submissions for a specific topic
router.get('/submissions/:topicId', authenticate, async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query as Record<string, unknown>);

    const [submissions, total] = await Promise.all([
      prisma.aptitudeSubmission.findMany({
        where: {
          userId: req.user?.userId,
          question: {
            chapter: { topicId: req.params.topicId },
          },
        },
        include: {
          question: { include: { chapter: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.aptitudeSubmission.count({
        where: {
          userId: req.user?.userId,
          question: {
            chapter: { topicId: req.params.topicId },
          },
        },
      }),
    ]);

    sendPaginated({ res, data: submissions, total, page, limit });
  } catch (err) {
    next(err);
  }
});

// ============================================================================
// STATISTICS ROUTES (Authenticated)
// ============================================================================

// GET /aptitude/stats — Get user's aptitude statistics
router.get('/stats', authenticate, async (req, res, next) => {
  try {
    const userId = req.user?.userId;

    const totalAttempts = await prisma.aptitudeSubmission.count({ where: { userId } });
    const correctAnswers = await prisma.aptitudeSubmission.count({
      where: { userId, isCorrect: true },
    });
    const accuracy = totalAttempts > 0 ? ((correctAnswers / totalAttempts) * 100).toFixed(2) : '0';

    const allSubs = await prisma.aptitudeSubmission.findMany({
      where: { userId },
      include: { question: { select: { difficulty: true } } }
    });
    
    const byDifficulty = allSubs.reduce((acc, sub) => {
      const diff = sub.question?.difficulty || 'medium';
      acc[diff] = (acc[diff] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topicStats = await prisma.aptitudeSubmission.findMany({
      where: { userId },
      include: {
        question: {
          include: { chapter: { include: { topic: true } } },
        },
      },
    });

    const statsByTopic: any = {};
    topicStats.forEach((submission) => {
      const topicId = submission.question.chapter.topic.id;
      const topicName = submission.question.chapter.topic.name;

      if (!statsByTopic[topicId]) {
        statsByTopic[topicId] = {
          topicName,
          totalAttempts: 0,
          correctAnswers: 0,
          accuracy: 0,
        };
      }

      statsByTopic[topicId].totalAttempts += 1;
      if (submission.isCorrect) {
        statsByTopic[topicId].correctAnswers += 1;
      }
      statsByTopic[topicId].accuracy = (
        (statsByTopic[topicId].correctAnswers / statsByTopic[topicId].totalAttempts) *
        100
      ).toFixed(2);
    });

    sendSuccess({
      res,
      data: {
        totalAttempts,
        correctAnswers,
        accuracy,
        byTopic: statsByTopic,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
