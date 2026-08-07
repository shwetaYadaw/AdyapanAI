import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { prisma } from '../config/prisma';
import { sendSuccess, sendPaginated, getPaginationParams } from '../utils/response.utils';
import { AppError } from '../middleware/errorHandler.middleware';

const router = Router();

// Apply auth and admin authorization to all routes
router.use(authenticate, authorize('admin'));

// ============================================================================
// TOPIC MANAGEMENT
// ============================================================================

// GET /admin/aptitude/topics - List all topics
router.get('/topics', async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query as Record<string, unknown>);
    const where: any = { isActive: true };

    const [topics, total] = await Promise.all([
      prisma.aptitudeTopic.findMany({
        where,
        include: {
          chapters: {
            where: { isActive: true },
            orderBy: { order: 'asc' },
            include: {
              questions: {
                where: { isActive: true },
                orderBy: { createdAt: 'asc' },
                select: { id: true, statement: true, difficulty: true, correctOption: true, explanation: true, xpReward: true, options: { select: { optionKey: true, text: true }, orderBy: { optionKey: 'asc' } } },
              },
            },
          },
        },
        orderBy: [{ order: 'asc' }, { name: 'asc' }],
        skip,
        take: limit,
      }),
      prisma.aptitudeTopic.count({ where }),
    ]);

    // Attach questionCount to each topic
    const enriched = topics.map((t) => ({
      ...t,
      questionCount: t.chapters.reduce((sum, ch) => sum + ch.questions.length, 0),
    }));

    sendPaginated({ res, data: enriched, total, page, limit });
  } catch (err) { next(err); }
});

// GET /admin/aptitude/topics/:topicId - Get specific topic with chapters
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
              select: { id: true, statement: true, difficulty: true, createdAt: true },
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

// POST /admin/aptitude/topics - Create new topic
router.post('/topics', async (req, res, next) => {
  try {
    const { name, description, icon, order } = req.body;

    if (!name) {
      throw new AppError('Topic name is required', 400);
    }

    // Check if topic already exists
    const existing = await prisma.aptitudeTopic.findUnique({ where: { name } });
    if (existing) {
      throw new AppError('Topic with this name already exists', 409);
    }

    const topic = await prisma.aptitudeTopic.create({
      data: {
        name,
        description: description || null,
        icon: icon || null,
        order: order || 0,
        createdBy: req.user?.userId,
      },
    });

    sendSuccess({ res, statusCode: 201, data: topic, message: 'Topic created successfully' });
  } catch (err) {
    next(err);
  }
});

// PUT /admin/aptitude/topics/:topicId - Update topic
router.put('/topics/:topicId', async (req, res, next) => {
  try {
    const { name, description, icon, order, isActive } = req.body;

    const topic = await prisma.aptitudeTopic.findUnique({
      where: { id: req.params.topicId },
    });

    if (!topic) {
      throw new AppError('Topic not found', 404);
    }

    // Check if new name already exists
    if (name && name !== topic.name) {
      const existing = await prisma.aptitudeTopic.findUnique({ where: { name } });
      if (existing) {
        throw new AppError('Topic with this name already exists', 409);
      }
    }

    const updated = await prisma.aptitudeTopic.update({
      where: { id: req.params.topicId },
      data: {
        name: name || topic.name,
        description: description !== undefined ? description : topic.description,
        icon: icon !== undefined ? icon : topic.icon,
        order: order !== undefined ? order : topic.order,
        isActive: isActive !== undefined ? isActive : topic.isActive,
      },
    });

    sendSuccess({ res, data: updated, message: 'Topic updated successfully' });
  } catch (err) {
    next(err);
  }
});

// DELETE /admin/aptitude/topics/:topicId - Delete topic (cascades to chapters & questions)
router.delete('/topics/:topicId', async (req, res, next) => {
  try {
    const topic = await prisma.aptitudeTopic.findUnique({
      where: { id: req.params.topicId },
    });

    if (!topic) {
      throw new AppError('Topic not found', 404);
    }

    await prisma.aptitudeTopic.delete({
      where: { id: req.params.topicId },
    });

    // Add cache invalidation header so frontend knows to clear cache
    res.setHeader('X-Cache-Invalidate', 'aptitude-topics');
    res.setHeader('X-Entity-ID', req.params.topicId);

    sendSuccess({ res, statusCode: 200, message: 'Topic deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// ============================================================================
// CHAPTER MANAGEMENT
// ============================================================================

// GET /admin/aptitude/topics/:topicId/chapters - List chapters in topic
router.get('/topics/:topicId/chapters', async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query as Record<string, unknown>);
    const where = { topicId: req.params.topicId, isActive: true };

    const [chapters, total] = await Promise.all([
      prisma.aptitudeChapter.findMany({
        where,
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
      prisma.aptitudeChapter.count({ where }),
    ]);

    sendPaginated({ res, data: chapters, total, page, limit });
  } catch (err) {
    next(err);
  }
});

// GET /admin/aptitude/topics/:topicId/chapters/:chapterId - Get specific chapter
router.get('/topics/:topicId/chapters/:chapterId', async (req, res, next) => {
  try {
    const chapter = await prisma.aptitudeChapter.findUnique({
      where: { id: req.params.chapterId },
      include: {
        questions: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
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

// POST /admin/aptitude/topics/:topicId/chapters - Create chapter
router.post('/topics/:topicId/chapters', async (req, res, next) => {
  try {
    const { name, description, order } = req.body;

    if (!name) {
      throw new AppError('Chapter name is required', 400);
    }

    // Verify topic exists
    const topic = await prisma.aptitudeTopic.findUnique({
      where: { id: req.params.topicId },
    });

    if (!topic) {
      throw new AppError('Topic not found', 404);
    }

    // Check if chapter name already exists in this topic
    const existing = await prisma.aptitudeChapter.findFirst({
      where: { topicId: req.params.topicId, name },
    });

    if (existing) {
      throw new AppError('Chapter with this name already exists in this topic', 409);
    }

    const chapter = await prisma.aptitudeChapter.create({
      data: {
        topicId: req.params.topicId,
        name,
        description: description || null,
        order: order || 0,
        createdBy: req.user?.userId,
      },
    });

    sendSuccess({ res, statusCode: 201, data: chapter, message: 'Chapter created successfully' });
  } catch (err) {
    next(err);
  }
});

// PUT /admin/aptitude/topics/:topicId/chapters/:chapterId - Update chapter
router.put('/topics/:topicId/chapters/:chapterId', async (req, res, next) => {
  try {
    const { name, description, order, isActive } = req.body;

    const chapter = await prisma.aptitudeChapter.findUnique({
      where: { id: req.params.chapterId },
    });

    if (!chapter || chapter.topicId !== req.params.topicId) {
      throw new AppError('Chapter not found', 404);
    }

    const updated = await prisma.aptitudeChapter.update({
      where: { id: req.params.chapterId },
      data: {
        name: name || chapter.name,
        description: description !== undefined ? description : chapter.description,
        order: order !== undefined ? order : chapter.order,
        isActive: isActive !== undefined ? isActive : chapter.isActive,
      },
    });

    sendSuccess({ res, data: updated, message: 'Chapter updated successfully' });
  } catch (err) {
    next(err);
  }
});

// DELETE /admin/aptitude/topics/:topicId/chapters/:chapterId - Delete chapter
router.delete('/topics/:topicId/chapters/:chapterId', async (req, res, next) => {
  try {
    const chapter = await prisma.aptitudeChapter.findUnique({
      where: { id: req.params.chapterId },
    });

    if (!chapter || chapter.topicId !== req.params.topicId) {
      throw new AppError('Chapter not found', 404);
    }

    await prisma.aptitudeChapter.delete({
      where: { id: req.params.chapterId },
    });

    // Add cache invalidation header so frontend knows to clear cache
    res.setHeader('X-Cache-Invalidate', 'aptitude-chapters');
    res.setHeader('X-Entity-ID', req.params.chapterId);

    sendSuccess({ res, statusCode: 204, message: 'Chapter deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// ============================================================================
// QUESTION MANAGEMENT (with MCQ options)
// ============================================================================

// GET /admin/aptitude/topics/:topicId/chapters/:chapterId/questions - List questions
router.get('/topics/:topicId/chapters/:chapterId/questions', async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query as Record<string, unknown>);
    const where = { chapterId: req.params.chapterId, isActive: true };

    const [questions, total] = await Promise.all([
      prisma.aptitudeQuestion.findMany({
        where,
        include: {
          options: { orderBy: { order: 'asc' } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.aptitudeQuestion.count({ where }),
    ]);

    sendPaginated({ res, data: questions, total, page, limit });
  } catch (err) {
    next(err);
  }
});

// GET /admin/aptitude/topics/:topicId/chapters/:chapterId/questions/:questionId - Get question details
router.get('/topics/:topicId/chapters/:chapterId/questions/:questionId', async (req, res, next) => {
  try {
    const question = await prisma.aptitudeQuestion.findUnique({
      where: { id: req.params.questionId },
      include: {
        options: { orderBy: { order: 'asc' } },
        chapter: true,
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

// POST /admin/aptitude/topics/:topicId/chapters/:chapterId/questions - Create question
router.post('/topics/:topicId/chapters/:chapterId/questions', async (req, res, next) => {
  try {
    const {
      statement,
      difficulty,
      options,
      explanation,
      xpReward,
      companies,
      timeLimit,
    } = req.body;

    // Validate required fields
    if (!statement || !options || options.length === 0) {
      throw new AppError('Statement and at least one option are required', 400);
    }

    // Validate options - each must have optionKey and text
    if (!options.every((opt: any) => opt.optionKey && opt.text)) {
      throw new AppError('Each option must have optionKey (A, B, C, D) and text', 400);
    }

    // Find correct option
    const correctOpt = options.find((opt: any) => opt.isCorrect === true);
    if (!correctOpt) {
      throw new AppError('At least one option must be marked as correct', 400);
    }

    // Verify chapter exists
    const chapter = await prisma.aptitudeChapter.findUnique({
      where: { id: req.params.chapterId },
    });

    if (!chapter || chapter.topicId !== req.params.topicId) {
      throw new AppError('Chapter not found', 404);
    }

    // Create question with options
    const question = await prisma.aptitudeQuestion.create({
      data: {
        chapterId: req.params.chapterId,
        statement,
        difficulty: difficulty || 'medium',
        correctOption: correctOpt.optionKey,
        explanation: explanation || null,
        xpReward: xpReward || 10,
        companies: companies || '',
        timeLimit: timeLimit || 30,
        createdBy: req.user?.userId,
        options: {
          create: options.map((opt: any, index: number) => ({
            optionKey: opt.optionKey,
            text: opt.text,
            isCorrect: opt.isCorrect || false,
            order: index,
          })),
        },
      },
      include: { options: { orderBy: { order: 'asc' } } },
    });

    sendSuccess({ res, statusCode: 201, data: question, message: 'Question created successfully' });
  } catch (err) {
    next(err);
  }
});

// PUT /admin/aptitude/topics/:topicId/chapters/:chapterId/questions/:questionId - Update question
router.put('/topics/:topicId/chapters/:chapterId/questions/:questionId', async (req, res, next) => {
  try {
    const {
      statement,
      difficulty,
      options,
      explanation,
      xpReward,
      companies,
      timeLimit,
      isActive,
    } = req.body;

    const question = await prisma.aptitudeQuestion.findUnique({
      where: { id: req.params.questionId },
      include: { options: true },
    });

    if (!question || question.chapterId !== req.params.chapterId) {
      throw new AppError('Question not found', 404);
    }

    // If options are provided, validate them
    let correctOption = question.correctOption;
    if (options && options.length > 0) {
      if (!options.every((opt: any) => opt.optionKey && opt.text)) {
        throw new AppError('Each option must have optionKey (A, B, C, D) and text', 400);
      }
      const correctOpt = options.find((opt: any) => opt.isCorrect === true);
      if (correctOpt) {
        correctOption = correctOpt.optionKey;
      }
    }

    // Delete existing options and create new ones if provided
    if (options && options.length > 0) {
      await prisma.aptitudeOption.deleteMany({
        where: { questionId: req.params.questionId },
      });
    }

    const updated = await prisma.aptitudeQuestion.update({
      where: { id: req.params.questionId },
      data: {
        statement: statement || question.statement,
        difficulty: difficulty || question.difficulty,
        correctOption,
        explanation: explanation !== undefined ? explanation : question.explanation,
        xpReward: xpReward || question.xpReward,
        companies: companies || question.companies,
        timeLimit: timeLimit || question.timeLimit,
        isActive: isActive !== undefined ? isActive : question.isActive,
        updatedBy: req.user?.userId,
        ...(options && options.length > 0 && {
          options: {
            create: options.map((opt: any, index: number) => ({
              optionKey: opt.optionKey,
              text: opt.text,
              isCorrect: opt.isCorrect || false,
              order: index,
            })),
          },
        }),
      },
      include: { options: { orderBy: { order: 'asc' } } },
    });

    sendSuccess({ res, data: updated, message: 'Question updated successfully' });
  } catch (err) {
    next(err);
  }
});

// DELETE /admin/aptitude/topics/:topicId/chapters/:chapterId/questions/:questionId - Delete question
router.delete('/topics/:topicId/chapters/:chapterId/questions/:questionId', async (req, res, next) => {
  try {
    const question = await prisma.aptitudeQuestion.findUnique({
      where: { id: req.params.questionId },
    });

    if (!question || question.chapterId !== req.params.chapterId) {
      throw new AppError('Question not found', 404);
    }

    await prisma.aptitudeQuestion.delete({
      where: { id: req.params.questionId },
    });

    // Add cache invalidation header so frontend knows to clear cache
    res.setHeader('X-Cache-Invalidate', 'aptitude');
    res.setHeader('X-Entity-ID', req.params.questionId);

    sendSuccess({ res, statusCode: 204, message: 'Question deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// ============================================================================
// STATISTICS
// ============================================================================

// GET /admin/aptitude/stats - Get Aptitude statistics
router.get('/stats', async (_req, res, next) => {
  try {
    const totalTopics = await prisma.aptitudeTopic.count({ where: { isActive: true } });
    const totalChapters = await prisma.aptitudeChapter.count({ where: { isActive: true } });
    const totalQuestions = await prisma.aptitudeQuestion.count({ where: { isActive: true } });

    const byDifficulty = await prisma.aptitudeQuestion.groupBy({
      by: ['difficulty'],
      _count: true,
      where: { isActive: true },
    });

    const stats = {
      topics: totalTopics,
      chapters: totalChapters,
      questions: totalQuestions,
      byDifficulty: byDifficulty.reduce((acc: any, item: any) => {
        acc[item.difficulty] = item._count;
        return acc;
      }, {}),
    };

    sendSuccess({ res, data: stats });
  } catch (err) {
    next(err);
  }
});

export default router;
