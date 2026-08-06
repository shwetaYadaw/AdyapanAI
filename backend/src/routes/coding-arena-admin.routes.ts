import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { prisma } from '../config/prisma';
import { sendSuccess, sendPaginated, getPaginationParams } from '../utils/response.utils';
import { AppError } from '../middleware/errorHandler.middleware';

const router = Router();
router.use(authenticate, authorize('admin'));

// ============================================================================
// CODING ARENA PROBLEM ENDPOINTS - Using CodingArenaProblem Table
// ============================================================================

// GET /admin/coding-arena - List all Coding Arena problems
router.get('/', async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query as Record<string, unknown>);
    const where: any = {};

    // Filter by topic if provided
    if (req.query.topic) {
      where.topics = { contains: String(req.query.topic) };
    }

    if (req.query.difficulty) {
      where.difficulty = String(req.query.difficulty);
    }

    if (req.query.search) {
      where.title = { contains: String(req.query.search), mode: 'insensitive' };
    }

    // Fetch from CodingArenaProblem table
    const [problems, total] = await Promise.all([
      prisma.problem.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.problem.count({ where }),
    ]);

    sendPaginated({ res, data: problems, total, page, limit });
  } catch (err) {
    next(err);
  }
});

// GET /admin/coding-arena/:id - Get single Coding Arena problem
router.get('/:id', async (req, res, next) => {
  try {
    const problem = await prisma.problem.findUnique({
      where: { id: req.params.id },
    });

    if (!problem) {
      throw new AppError('Coding Arena problem not found', 404);
    }

    sendSuccess({ res, data: problem });
  } catch (err) {
    next(err);
  }
});

// POST /admin/coding-arena - Create new Coding Arena problem
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
      timeLimit,
      memoryLimit,
      xpReward,
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
      .replace(/^-+|-+$/g, '') + '-arena';

    // Check if slug already exists
    const existing = await prisma.problem.findUnique({ where: { slug } });
    if (existing) {
      throw new AppError('Problem with this title already exists', 409);
    }

    // Create in Problem table
    const problem = await prisma.problem.create({
      data: {
        title,
        slug,
        statement,
        difficulty,
        topics: topic,  // Store the selected topic
        companies: companies || 'MNC',
        inputFormat: inputFormat || '',
        outputFormat: outputFormat || '',
        constraints: constraints || '',
        referenceSolution: referenceSolution || '',
        starterCode: {}, // mandatory field
        timeLimit: timeLimit || 2000,
        memoryLimit: memoryLimit || 256,
        createdBy: req.user?.userId,
        testCases: testCases && testCases.length > 0 ? {
          create: testCases.map((tc: any, index: number) => ({
            input: tc.input || '',
            expectedOutput: tc.expectedOutput || '',
            isHidden: tc.isHidden ?? true,
            order: index
          }))
        } : undefined,
      },
    });

    sendSuccess({ res, statusCode: 201, data: problem, message: 'Coding Arena problem created successfully' });
  } catch (err) {
    next(err);
  }
});

// PUT /admin/coding-arena/:id - Update Coding Arena problem
router.put('/:id', async (req, res, next) => {
  try {
    const problem = await prisma.problem.findUnique({
      where: { id: req.params.id },
    });

    if (!problem) {
      throw new AppError('Coding Arena problem not found', 404);
    }

    const updated = await prisma.problem.update({
      where: { id: req.params.id },
      data: {
        title: req.body.title || problem.title,
        statement: req.body.statement || problem.statement,
        difficulty: req.body.difficulty || problem.difficulty,
        inputFormat: req.body.inputFormat || problem.inputFormat,
        outputFormat: req.body.outputFormat || problem.outputFormat,
        constraints: req.body.constraints || problem.constraints,
        referenceSolution: req.body.referenceSolution || problem.referenceSolution,
        topics: req.body.topic || problem.topics,
        companies: req.body.companies || problem.companies,
        timeLimit: req.body.timeLimit || problem.timeLimit,
        memoryLimit: req.body.memoryLimit || problem.memoryLimit,
        updatedBy: req.user?.userId,
      },
    });

    sendSuccess({ res, data: updated, message: 'Coding Arena problem updated successfully' });
  } catch (err) {
    next(err);
  }
});

// DELETE /admin/coding-arena/:id - Delete Coding Arena problem (HARD DELETE)
router.delete('/:id', async (req, res, next) => {
  try {
    const problem = await prisma.problem.findUnique({
      where: { id: req.params.id },
    });

    if (!problem) {
      throw new AppError('Coding Arena problem not found', 404);
    }

    // Hard delete from CodingArenaProblem table
    await prisma.problem.delete({
      where: { id: req.params.id },
    });

    // Add cache invalidation header so frontend knows to clear cache
    res.setHeader('X-Cache-Invalidate', 'coding-arena');
    res.setHeader('X-Entity-ID', req.params.id);

    sendSuccess({ res, statusCode: 204, message: 'Coding Arena problem deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// GET /admin/coding-arena/stats - Get Coding Arena statistics
router.get('/admin/stats', async (_req, res, next) => {
  try {
    const total = await prisma.problem.count();

    const byDifficulty = await prisma.problem.groupBy({
      by: ['difficulty'],
      _count: true,
    });

    const byTopic = await prisma.problem.groupBy({
      by: ['topics'],
      _count: true,
    });

    const stats = {
      total,
      byDifficulty: byDifficulty.reduce((acc: any, item: any) => {
        acc[item.difficulty] = item._count;
        return acc;
      }, {}),
      byTopic: byTopic.reduce((acc: any, item: any) => {
        acc[item.topics] = item._count;
        return acc;
      }, {}),
    };

    sendSuccess({ res, data: stats });
  } catch (err) {
    next(err);
  }
});

export default router;
