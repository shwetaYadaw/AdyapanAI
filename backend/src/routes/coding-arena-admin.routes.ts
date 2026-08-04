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
      where.topic = String(req.query.topic);
    }

    if (req.query.difficulty) {
      where.difficulty = String(req.query.difficulty);
    }

    if (req.query.search) {
      where.title = { contains: String(req.query.search), mode: 'insensitive' };
    }

    // Fetch from CodingArenaProblem table
    const [problems, total] = await Promise.all([
      prisma.codingArenaProblem.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.codingArenaProblem.count({ where }),
    ]);

    sendPaginated({ res, data: problems, total, page, limit });
  } catch (err) {
    next(err);
  }
});

// GET /admin/coding-arena/:id - Get single Coding Arena problem
router.get('/:id', async (req, res, next) => {
  try {
    const problem = await prisma.codingArenaProblem.findUnique({
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
    const existing = await prisma.codingArenaProblem.findUnique({ where: { slug } });
    if (existing) {
      throw new AppError('Problem with this title already exists', 409);
    }

    // Create in CodingArenaProblem table
    const problem = await prisma.codingArenaProblem.create({
      data: {
        title,
        slug,
        statement,
        difficulty,
        topic,  // Store the selected topic (e.g., "Arrays")
        companies: companies || 'MNC',
        inputFormat: inputFormat || '',
        outputFormat: outputFormat || '',
        constraints: constraints || '',
        referenceSolution: referenceSolution || '',
        testCases: testCases || [],
        timeLimit: timeLimit || 2000,
        memoryLimit: memoryLimit || 256,
        xpReward: xpReward || 10,
        createdBy: req.user?.userId,
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
    const problem = await prisma.codingArenaProblem.findUnique({
      where: { id: req.params.id },
    });

    if (!problem) {
      throw new AppError('Coding Arena problem not found', 404);
    }

    const updated = await prisma.codingArenaProblem.update({
      where: { id: req.params.id },
      data: {
        title: req.body.title || problem.title,
        statement: req.body.statement || problem.statement,
        difficulty: req.body.difficulty || problem.difficulty,
        inputFormat: req.body.inputFormat || problem.inputFormat,
        outputFormat: req.body.outputFormat || problem.outputFormat,
        constraints: req.body.constraints || problem.constraints,
        referenceSolution: req.body.referenceSolution || problem.referenceSolution,
        testCases: req.body.testCases !== undefined ? req.body.testCases : problem.testCases,
        topic: req.body.topic || problem.topic,
        companies: req.body.companies || problem.companies,
        timeLimit: req.body.timeLimit || problem.timeLimit,
        memoryLimit: req.body.memoryLimit || problem.memoryLimit,
        xpReward: req.body.xpReward || problem.xpReward,
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
    const problem = await prisma.codingArenaProblem.findUnique({
      where: { id: req.params.id },
    });

    if (!problem) {
      throw new AppError('Coding Arena problem not found', 404);
    }

    // Hard delete from CodingArenaProblem table
    await prisma.codingArenaProblem.delete({
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
    const total = await prisma.codingArenaProblem.count();

    const byDifficulty = await prisma.codingArenaProblem.groupBy({
      by: ['difficulty'],
      _count: true,
    });

    const byTopic = await prisma.codingArenaProblem.groupBy({
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
