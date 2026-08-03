import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { prisma } from '../config/prisma';
import { sendSuccess, sendPaginated, getPaginationParams } from '../utils/response.utils';
import { AppError } from '../middleware/errorHandler.middleware';

const router = Router();
router.use(authenticate, authorize('admin'));

// GET /admin/questions - List all questions with advanced filtering
router.get('/', async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query as Record<string, unknown>);
    
    const where: any = {};

    // Filter by source (tcs-nqt or coding-arena)
    if (req.query.source) {
      where.OR = [
        { slug: { contains: String(req.query.source) } },
        { companies: { has: 'TCS' } } // TCS NQT filter
      ];
    }

    // Filter by topic
    if (req.query.topic) {
      where.topics = { has: String(req.query.topic) };
    }

    // Filter by difficulty
    if (req.query.difficulty) {
      where.difficulty = String(req.query.difficulty);
    }

    // Search by title or statement
    if (req.query.search) {
      where.OR = [
        { title: { contains: String(req.query.search) } },
        { statement: { contains: String(req.query.search) } }
      ];
    }

    // Filter by company (TCS, Google, Amazon, etc.)
    if (req.query.company) {
      where.companies = { has: String(req.query.company) };
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
          companies: true,
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

// GET /admin/questions/:id - Get single question with full details
router.get('/:id', async (req, res, next) => {
  try {
    const question = await prisma.question.findUnique({
      where: { id: req.params.id },
    });

    if (!question) {
      throw new AppError('Question not found', 404);
    }

    sendSuccess({ res, data: question });
  } catch (err) {
    next(err);
  }
});

// POST /admin/questions - Create new question
router.post('/', async (req, res, next) => {
  try {
    const {
      title,
      statement,
      difficulty,
      topics,
      companies,
      inputFormat,
      outputFormat,
      constraints,
      sampleInput,
      sampleOutput,
      testCases,
    } = req.body;

    // Validate required fields
    if (!title || !statement || !difficulty || !topics || !Array.isArray(topics)) {
      throw new AppError('Title, statement, difficulty, and topics array are required', 400);
    }

    // Generate slug from title and first topic
    const slug = `${title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')}-${topics[0]}`;

    // Check if slug already exists
    const existing = await prisma.question.findUnique({ where: { slug } });
    if (existing) {
      throw new AppError('Question with this title in this topic already exists', 409);
    }

    const question = await prisma.question.create({
      data: {
        title,
        slug,
        statement,
        difficulty,
        topics,
        companies: companies || [],
        inputFormat: inputFormat || 'Input format not specified',
        outputFormat: outputFormat || 'Output format not specified',
        constraints: constraints || 'Constraints not specified',
        sampleInput: sampleInput || '',
        sampleOutput: sampleOutput || '',
        testCases: testCases || [{ input: '', output: '', isHidden: false }],
        timeLimit: 1000,
        memoryLimit: 128,
        templates: {}, // Empty templates - can be populated later
      },
    });

    sendSuccess({ res, statusCode: 201, data: question, message: 'Question created successfully' });
  } catch (err) {
    next(err);
  }
});

// PUT /admin/questions/:id - Update question
router.put('/:id', async (req, res, next) => {
  try {
    const question = await prisma.question.findUnique({
      where: { id: req.params.id },
    });

    if (!question) {
      throw new AppError('Question not found', 404);
    }

    const updated = await prisma.question.update({
      where: { id: req.params.id },
      data: {
        title: req.body.title || question.title,
        statement: req.body.statement || question.statement,
        difficulty: req.body.difficulty || question.difficulty,
        topics: req.body.topics || question.topics,
        companies: req.body.companies !== undefined ? req.body.companies : question.companies,
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

// DELETE /admin/questions/:id - Delete question
router.delete('/:id', async (req, res, next) => {
  try {
    const question = await prisma.question.findUnique({
      where: { id: req.params.id },
    });

    if (!question) {
      throw new AppError('Question not found', 404);
    }

    await prisma.question.delete({
      where: { id: req.params.id },
    });

    sendSuccess({ res, statusCode: 204, message: 'Question deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// GET /admin/questions/stats/overview - Get statistics for all questions
router.get('/admin/stats/overview', async (_req, res, next) => {
  try {
    const total = await prisma.question.count();

    const byDifficulty = await prisma.question.groupBy({
      by: ['difficulty'],
      _count: true,
    });

    const tcsCount = await prisma.question.count({
      where: { companies: { has: 'TCS' } },
    });

    const codingArenaCount = total - tcsCount;

    // Get topic distribution
    const allQuestions = await prisma.question.findMany({
      select: { topics: true },
      take: 10000,
    });

    const topicMap: Record<string, number> = {};
    for (const q of allQuestions) {
      for (const topic of q.topics) {
        topicMap[topic] = (topicMap[topic] || 0) + 1;
      }
    }

    const stats = {
      total,
      byDifficulty: byDifficulty.reduce((acc: any, item: any) => {
        acc[item.difficulty] = item._count;
        return acc;
      }, {}),
      bySource: {
        'tcs-nqt': tcsCount,
        'coding-arena': codingArenaCount,
      },
      byTopic: topicMap,
    };

    sendSuccess({ res, data: stats });
  } catch (err) {
    next(err);
  }
});

// GET /admin/questions/stats/by-source - Get statistics by source (TCS vs Coding Arena)
router.get('/admin/stats/by-source', async (_req, res, next) => {
  try {
    const tcsQuestions = await prisma.question.findMany({
      where: { companies: { has: 'TCS' } },
      select: { difficulty: true },
      take: 10000,
    });

    const codingArenaQuestions = await prisma.question.findMany({
      where: { companies: { not: { has: 'TCS' } } },
      select: { difficulty: true },
      take: 10000,
    });

    const countByDifficulty = (questions: any[]) => {
      return questions.reduce((acc, q) => {
        acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
        return acc;
      }, {});
    };

    sendSuccess({
      res,
      data: {
        'tcs-nqt': {
          total: tcsQuestions.length,
          byDifficulty: countByDifficulty(tcsQuestions),
        },
        'coding-arena': {
          total: codingArenaQuestions.length,
          byDifficulty: countByDifficulty(codingArenaQuestions),
        },
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /admin/questions/bulk-import - Bulk import questions from JSON
router.post('/bulk-import', async (req, res, next) => {
  try {
    const { questions } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new AppError('Questions array is required and must not be empty', 400);
    }

    const imported = [];
    const errors = [];

    for (let i = 0; i < questions.length; i++) {
      try {
        const q = questions[i];
        const slug = `${q.title
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w\-]+/g, '')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, '')}-${(q.topics || ['uncategorized'])[0]}`;

        const result = await prisma.question.upsert({
          where: { slug },
          update: q,
          create: {
            title: q.title,
            slug,
            statement: q.statement,
            difficulty: q.difficulty,
            topics: q.topics || [],
            companies: q.companies || [],
            inputFormat: q.inputFormat || '',
            outputFormat: q.outputFormat || '',
            constraints: q.constraints || '',
            sampleInput: q.sampleInput || '',
            sampleOutput: q.sampleOutput || '',
            testCases: q.testCases || [],
            timeLimit: q.timeLimit || 1000,
            memoryLimit: q.memoryLimit || 128,
            templates: q.templates || {},
          },
        });

        imported.push(result.slug);
      } catch (e: any) {
        errors.push(`Question ${i}: ${e.message}`);
      }
    }

    sendSuccess({
      res,
      statusCode: 201,
      data: {
        imported: imported.length,
        failed: errors.length,
        importedSlugs: imported,
        errors: errors.length > 0 ? errors : undefined,
      },
      message: `Imported ${imported.length} questions${errors.length > 0 ? `, ${errors.length} failed` : ''}`,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
