import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { prisma } from '../config/prisma';
import { sendSuccess, sendPaginated, getPaginationParams } from '../utils/response.utils';
import { AppError } from '../middleware/errorHandler.middleware';

const router = Router();
router.use(authenticate, authorize('admin'));

// ============================================================================
// TCS NQT QUESTION ENDPOINTS - Using NEW TcsNqtQuestion Table
// ============================================================================

// GET /admin/tcs-nqt - List all TCS NQT questions
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

    if (req.query.search) {
      where.title = { contains: String(req.query.search), mode: 'insensitive' };
    }

    // Fetch from NEW TcsNqtQuestion table
    const [questions, total] = await Promise.all([
      prisma.tcsNqtQuestion.findMany({
        where,
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

// GET /admin/tcs-nqt/:id - Get single TCS NQT question (supports both id and slug)
router.get('/:id', async (req, res, next) => {
  try {
    const param = req.params.id;
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(param);

    const question = isUUID
      ? await prisma.tcsNqtQuestion.findUnique({ where: { id: param } })
      : await prisma.tcsNqtQuestion.findUnique({ where: { slug: param } });

    if (!question) {
      throw new AppError('TCS NQT question not found', 404);
    }

    sendSuccess({ res, data: question });
  } catch (err) {
    next(err);
  }
});

// POST /admin/tcs-nqt - Create new TCS NQT question
router.post('/', async (req, res, next) => {
  try {
    const {
      title,
      statement,
      difficulty,
      inputFormat,
      outputFormat,
      constraints,
      referenceSolution,
      testCases,
      topic,  // Topic name (e.g., "Arrays")
      companies,
      experienceLevel,  // "freshers" | "experienced"
    } = req.body;

    // Validate required fields
    if (!title || !statement || !difficulty || !topic) {
      throw new AppError('Title, statement, difficulty, and topic are required', 400);
    }

    const slug = title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '') + '-tcs-nqt';

    // Check if slug already exists
    const existing = await prisma.tcsNqtQuestion.findUnique({ where: { slug } });
    if (existing) {
      throw new AppError('Question with this title already exists', 409);
    }

    // Create in NEW TcsNqtQuestion table
    const question = await prisma.tcsNqtQuestion.create({
      data: {
        title,
        slug,
        statement,
        difficulty,
        topic,  // Store the selected topic (e.g., "Arrays")
        companies: companies || 'TCS',
        inputFormat: inputFormat || '',
        outputFormat: outputFormat || '',
        constraints: constraints || '',
        referenceSolution: referenceSolution || '',
        testCases: testCases || [],
        xpReward: 10,
        experienceLevel: experienceLevel || 'freshers',
        createdBy: req.user?.userId,
      },
    });

    sendSuccess({ res, statusCode: 201, data: question, message: 'TCS NQT question created successfully' });
  } catch (err) {
    next(err);
  }
});

// PUT /admin/tcs-nqt/:id - Update TCS NQT question
router.put('/:id', async (req, res, next) => {
  try {
    const question = await prisma.tcsNqtQuestion.findUnique({
      where: { id: req.params.id },
    });

    if (!question) {
      throw new AppError('TCS NQT question not found', 404);
    }

    const updated = await prisma.tcsNqtQuestion.update({
      where: { id: req.params.id },
      data: {
        title: req.body.title || question.title,
        statement: req.body.statement || question.statement,
        difficulty: req.body.difficulty || question.difficulty,
        inputFormat: req.body.inputFormat || question.inputFormat,
        outputFormat: req.body.outputFormat || question.outputFormat,
        constraints: req.body.constraints || question.constraints,
        referenceSolution: req.body.referenceSolution || question.referenceSolution,
        testCases: req.body.testCases !== undefined ? req.body.testCases : question.testCases,
        topic: req.body.topic || question.topic,
        companies: req.body.companies || question.companies,
        experienceLevel: req.body.experienceLevel || question.experienceLevel || 'freshers',
        updatedBy: req.user?.userId,
      },
    });

    sendSuccess({ res, data: updated, message: 'TCS NQT question updated successfully' });
  } catch (err) {
    next(err);
  }
});

// DELETE /admin/tcs-nqt/:id - Delete TCS NQT question
router.delete('/:id', async (req, res, next) => {
  try {
    const question = await prisma.tcsNqtQuestion.findUnique({
      where: { id: req.params.id },
    });

    if (!question) {
      throw new AppError('TCS NQT question not found', 404);
    }

    await prisma.tcsNqtQuestion.delete({
      where: { id: req.params.id },
    });

    // Add cache invalidation header so frontend knows to clear cache
    res.setHeader('X-Cache-Invalidate', 'tcs-nqt');
    res.setHeader('X-Entity-ID', req.params.id);

    sendSuccess({ res, statusCode: 204, message: 'TCS NQT question deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// GET /admin/tcs-nqt/stats - Get TCS NQT statistics
router.get('/admin/stats', async (_req, res, next) => {
  try {
    const total = await prisma.tcsNqtQuestion.count();

    const byDifficulty = await prisma.tcsNqtQuestion.groupBy({
      by: ['difficulty'],
      _count: true,
    });

    const byTopic = await prisma.tcsNqtQuestion.groupBy({
      by: ['topic'],
      _count: true,
    });

    const stats = {
      total,
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

export default router;
