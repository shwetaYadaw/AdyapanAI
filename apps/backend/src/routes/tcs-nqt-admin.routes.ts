import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { prisma } from '../config/prisma';
import { sendSuccess, sendPaginated, getPaginationParams } from '../utils/response.utils';
import { AppError } from '../middleware/errorHandler.middleware';

const router = Router();
router.use(authenticate, authorize('admin'));

// GET /admin/tcs-nqt - List all TCS NQT questions
router.get('/', async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query as Record<string, unknown>);
    const where: any = { topics: { has: 'tcs-nqt' } };

    if (req.query.difficulty) {
      where.difficulty = String(req.query.difficulty);
    }

    if (req.query.search) {
      where.title = { contains: String(req.query.search) };
    }

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          slug: true,
          title: true,
          difficulty: true,
          topics: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.question.count({ where }),
    ]);

    sendPaginated({ res, data: questions, total, page, limit });
  } catch (err) {
    next(err);
  }
});

// GET /admin/tcs-nqt/:id - Get single TCS NQT question
router.get('/:id', async (req, res, next) => {
  try {
    const question = await prisma.question.findUnique({
      where: { id: req.params.id },
    });

    if (!question) {
      throw new AppError('Question not found', 404);
    }

    if (!question.topics.includes('tcs-nqt')) {
      throw new AppError('This question is not a TCS NQT question', 400);
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
      sampleInput,
      sampleOutput,
      testCases,
    } = req.body;

    // Validate required fields
    if (!title || !statement || !difficulty) {
      throw new AppError('Title, statement, and difficulty are required', 400);
    }

    const slug = title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '') + '-tcs-nqt';

    // Check if slug already exists
    const existing = await prisma.question.findUnique({ where: { slug } });
    if (existing) {
      throw new AppError('Question with this title already exists', 409);
    }

    const question = await prisma.question.create({
      data: {
        title,
        slug,
        statement,
        difficulty,
        topics: ['tcs-nqt'],
        companies: ['TCS'],
        inputFormat: inputFormat || 'Input format not specified',
        outputFormat: outputFormat || 'Output format not specified',
        constraints: constraints || 'Constraints not specified',
        sampleInput: sampleInput || '',
        sampleOutput: sampleOutput || '',
        testCases: testCases || [{ input: '', output: '', isHidden: false }],
        timeLimit: 1000,
        memoryLimit: 128,
        templates: {},
      },
    });

    sendSuccess({ res, statusCode: 201, data: question, message: 'Question created successfully' });
  } catch (err) {
    next(err);
  }
});

// PUT /admin/tcs-nqt/:id - Update TCS NQT question
router.put('/:id', async (req, res, next) => {
  try {
    const question = await prisma.question.findUnique({
      where: { id: req.params.id },
    });

    if (!question) {
      throw new AppError('Question not found', 404);
    }

    if (!question.topics.includes('tcs-nqt')) {
      throw new AppError('This question is not a TCS NQT question', 400);
    }

    const updated = await prisma.question.update({
      where: { id: req.params.id },
      data: {
        title: req.body.title || question.title,
        statement: req.body.statement || question.statement,
        difficulty: req.body.difficulty || question.difficulty,
        inputFormat: req.body.inputFormat || question.inputFormat,
        outputFormat: req.body.outputFormat || question.outputFormat,
        constraints: req.body.constraints || question.constraints,
        sampleInput: req.body.sampleInput || question.sampleInput,
        sampleOutput: req.body.sampleOutput || question.sampleOutput,
        testCases: req.body.testCases || question.testCases,
      },
    });

    sendSuccess({ res, data: updated, message: 'Question updated successfully' });
  } catch (err) {
    next(err);
  }
});

// DELETE /admin/tcs-nqt/:id - Delete TCS NQT question
router.delete('/:id', async (req, res, next) => {
  try {
    const question = await prisma.question.findUnique({
      where: { id: req.params.id },
    });

    if (!question) {
      throw new AppError('Question not found', 404);
    }

    if (!question.topics.includes('tcs-nqt')) {
      throw new AppError('This question is not a TCS NQT question', 400);
    }

    await prisma.question.delete({
      where: { id: req.params.id },
    });

    sendSuccess({ res, statusCode: 204, message: 'Question deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// GET /admin/tcs-nqt/stats - Get TCS NQT statistics
router.get('/admin/stats', async (_req, res, next) => {
  try {
    const total = await prisma.question.count({
      where: { topics: { has: 'tcs-nqt' } },
    });

    const byDifficulty = await prisma.question.groupBy({
      by: ['difficulty'],
      where: { topics: { has: 'tcs-nqt' } },
      _count: true,
    });

    const stats = {
      total,
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
