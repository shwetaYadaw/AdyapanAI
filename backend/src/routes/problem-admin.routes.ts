import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { authenticate } from '../middleware/auth.middleware';
import { AppError } from '../middleware/errorHandler.middleware';
import { sendSuccess } from '../utils/response.utils';
import slugify from 'slugify';

const router = Router();

// Middleware to check if user is admin
async function isAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.userId || '' }
    });
    
    if (!user || user.role !== 'admin') {
      throw new AppError('Admin access required', 403);
    }
    next();
  } catch (err) {
    next(err);
  }
}

// ============================================
// ADMIN PROBLEM MANAGEMENT ENDPOINTS
// ============================================

// POST /api/admin/problems - Create new Problem
// Uses Problem table
router.post('/', authenticate, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      title,
      difficulty,
      statement,
      constraints,
      inputFormat,
      outputFormat,
      timeLimit,
      memoryLimit,
      referenceSolution,
      topics,  // Topic name (e.g., "Arrays")
      companies,
      tags,
      category,
      testCases,
      starterCode
    } = req.body;

    // Validate required fields
    if (!title || !statement || !difficulty || !topics) {
      throw new AppError('Title, statement, difficulty, and topic are required', 400);
    }

    const slug = slugify(title, {
      lower: true,
      strict: true,
      trim: true
    }) + '-' + Date.now();

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
        topics,  // Store the selected topic (e.g., "Arrays")
        companies: companies || 'MNC',
        inputFormat: inputFormat || '',
        outputFormat: outputFormat || '',
        constraints: constraints || '',
        referenceSolution: referenceSolution || '',
        starterCode: starterCode || {
          javascript: '',
          python: '',
          cpp: '',
          java: ''
        },
        tags: tags || '',
        category: category || 'general',
        timeLimit: timeLimit || 2000,
        memoryLimit: memoryLimit || 256,
        createdBy: req.user?.userId,
        isArchived: false
      },
    });

    // Create test cases if provided
    if (testCases && Array.isArray(testCases) && testCases.length > 0) {
      await prisma.problemTestCase.createMany({
        data: testCases.map((tc: any, index: number) => ({
          problemId: problem.id,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          isHidden: tc.isHidden !== undefined ? tc.isHidden : true,
          explanation: tc.explanation || '',
          order: index
        }))
      });
    }

    sendSuccess({
      res,
      statusCode: 201,
      data: problem,
      message: 'Problem created successfully'
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/problems - Get all Coding Arena problems with pagination
// Uses the Problem table (contains 436 organized problems)
router.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check admin role
    if (!req.user || !req.user.userId) {
      throw new AppError('Unauthorized', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    if (!user || user.role !== 'admin') {
      throw new AppError('Admin access required', 403);
    }

    const page = parseInt((req.query.page as string) || '1');
    const limit = parseInt((req.query.limit as string) || '20');
    const search = req.query.search as string | undefined;
    const difficulty = req.query.difficulty as string | undefined;
    const topic = req.query.topic as string | undefined;

    const pageNum = Math.max(1, page);
    const limitNum = Math.max(1, Math.min(limit, 100)); // Cap at 100
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const where: any = {
      isArchived: false // Only show non-archived problems
    };

    if (search && search.trim()) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { statement: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (difficulty) {
      where.difficulty = difficulty;
    }

    if (topic) {
      // Will filter in-memory for exact topic match
    }

    // Get all problems first (without topic filter to handle in-memory filtering)
    let allProblems = await prisma.problem.findMany({
      where: {
        isArchived: false,
        ...(search && {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { slug: { contains: search, mode: 'insensitive' } },
            { statement: { contains: search, mode: 'insensitive' } }
          ]
        }),
        ...(difficulty && { difficulty })
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        difficulty: true,
        statement: true,
        constraints: true,
        inputFormat: true,
        outputFormat: true,
        timeLimit: true,
        memoryLimit: true,
        topics: true,
        companies: true,
        tags: true,
        category: true,
        successRate: true,
        totalAttempts: true,
        totalAccepted: true,
        isArchived: true,
        createdAt: true,
        updatedAt: true,
        createdBy: true,
        updatedBy: true
      }
    });

    // Filter by exact topic match if topic provided
    if (topic) {
      const topicLower = topic.toLowerCase();
      allProblems = allProblems.filter(p => {
        const problemTopics = p.topics
          .split(',')
          .map(t => t.trim().toLowerCase());
        return problemTopics.includes(topicLower);
      });
    }

    const total = allProblems.length;
    const problems = allProblems.slice(skip, skip + limitNum);

    return sendSuccess({
      res,
      data: {
        problems,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/problems/:id - Get full problem details
// Uses Problem table
router.get('/:id', authenticate, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const problem = await prisma.problem.findUnique({
      where: { id },
      include: {
        testCases: {
          orderBy: { order: 'asc' }
        },
        solutions: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' }
        },
        versionHistory: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!problem) {
      throw new AppError('Problem not found', 404);
    }

    sendSuccess({ res, data: problem });
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/problems/:id - Update Problem
// Uses Problem table
router.put('/:id', authenticate, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const {
      title,
      difficulty,
      statement,
      constraints,
      inputFormat,
      outputFormat,
      timeLimit,
      memoryLimit,
      referenceSolution,
      topics,
      companies,
      tags,
      category,
      testCases,
      changeReason
    } = req.body;

    // Check if problem exists
    const existing = await prisma.problem.findUnique({
      where: { id }
    });

    if (!existing) {
      throw new AppError('Problem not found', 404);
    }

    // Create version history entry
    const versionCount = await prisma.problemVersion.count({
      where: { problemId: id }
    });

    await prisma.problemVersion.create({
      data: {
        problemId: id,
        versionNum: versionCount + 1,
        title: existing.title,
        statement: existing.statement,
        difficulty: existing.difficulty,
        changes: {
          title: title !== existing.title,
          statement: statement !== existing.statement,
          difficulty: difficulty !== existing.difficulty,
          topics: topics !== existing.topics,
          companies: companies !== existing.companies
        },
        changedBy: req.user?.userId,
        changeReason: changeReason || 'Updated via admin panel'
      }
    });

    // Update problem
    const updated = await prisma.problem.update({
      where: { id },
      data: {
        title: title || existing.title,
        difficulty: difficulty || existing.difficulty,
        statement: statement || existing.statement,
        constraints: constraints || existing.constraints,
        inputFormat: inputFormat || existing.inputFormat,
        outputFormat: outputFormat || existing.outputFormat,
        timeLimit: timeLimit ?? existing.timeLimit,
        memoryLimit: memoryLimit ?? existing.memoryLimit,
        referenceSolution: referenceSolution || existing.referenceSolution,
        topics: topics || existing.topics,
        companies: companies || existing.companies,
        tags: tags || existing.tags,
        category: category || existing.category,
        updatedBy: req.user?.userId,
      }
    });

    sendSuccess({
      res,
      message: 'Problem updated successfully',
      data: updated
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/admin/problems/:id - Archive Problem (soft delete)
// Uses Problem table
router.delete('/:id', authenticate, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const problem = await prisma.problem.findUnique({ where: { id } });

    if (!problem) {
      throw new AppError('Problem not found', 404);
    }

    // Soft delete by setting isArchived to true
    await prisma.problem.update({
      where: { id },
      data: { 
        isArchived: true,
        updatedBy: req.user?.userId
      }
    });

    // Add cache invalidation header to clear student-side cache
    res.setHeader('X-Cache-Invalidate', 'problems,coding-arena');

    sendSuccess({ res, statusCode: 200, message: 'Problem archived successfully' });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/problems/:id/restore - Restore archived problem
router.post('/:id/restore', authenticate, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const problem = await prisma.problem.findUnique({ where: { id } });

    if (!problem) {
      throw new AppError('Problem not found', 404);
    }

    if (!problem.isArchived) {
      throw new AppError('Problem is not archived', 400);
    }

    await prisma.problem.update({
      where: { id },
      data: { isArchived: false, updatedBy: req.user?.userId }
    });

    sendSuccess({ res, message: 'Problem restored successfully' });
  } catch (err) {
    next(err);
  }
});

// ============================================
// BULK OPERATIONS
// ============================================

// POST /api/admin/problems/bulk/import - Import problems from JSON file
router.post('/bulk/import', authenticate, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { problems: problemsData } = req.body;

    if (!Array.isArray(problemsData)) {
      throw new AppError('Expected array of problems', 400);
    }

    let created = 0;
    let skipped = 0;
    const results: any[] = [];

    for (const problemData of problemsData) {
      try {
        const slug = problemData.slug || slugify(problemData.title, { lower: true, strict: true });

        // Check if exists
        const exists = await prisma.problem.findUnique({
          where: { slug }
        });

        if (exists) {
          skipped++;
          results.push({
            title: problemData.title,
            status: 'skipped',
            reason: 'Already exists'
          });
          continue;
        }

        // Create problem
        await prisma.problem.create({
          data: {
            title: problemData.title,
            slug,
            difficulty: problemData.difficulty || 'easy',
            statement: problemData.statement,
            constraints: problemData.constraints || '',
            inputFormat: problemData.inputFormat || '',
            outputFormat: problemData.outputFormat || '',
            timeLimit: problemData.timeLimit || 2000,
            memoryLimit: problemData.memoryLimit || 256,
            starterCode: problemData.starterCode || {},
            referenceSolution: problemData.referenceSolution || '',
            topics: problemData.topics || '',
            companies: problemData.companies || '',
            tags: problemData.tags || '',
            category: problemData.category || 'general',
            createdBy: req.user?.userId
          }
        });

        created++;
        results.push({
          title: problemData.title,
          status: 'created',
          slug
        });
      } catch (err: any) {
        skipped++;
        results.push({
          title: problemData.title,
          status: 'error',
          reason: err.message
        });
      }
    }

    sendSuccess({
      res,
      message: `Imported ${created} problems, skipped ${skipped}`,
      data: {
        created,
        skipped,
        total: problemsData.length,
        results: results.slice(0, 50) // Return first 50 for preview
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/problems/analytics - Get problem analytics
router.get('/analytics/overview', authenticate, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [
      totalProblems,
      byDifficulty,
      byCategory,
      byTopics,
      averageStats
    ] = await Promise.all([
      prisma.problem.count({ where: { isArchived: false } }),
      prisma.problem.groupBy({
        by: ['difficulty'],
        where: { isArchived: false },
        _count: true
      }),
      prisma.problem.groupBy({
        by: ['category'],
        where: { isArchived: false },
        _count: true
      }),
      prisma.problem.findMany({
        where: { isArchived: false },
        select: { topics: true }
      }),
      prisma.problem.aggregate({
        where: { isArchived: false },
        _avg: { successRate: true, totalAttempts: true, averageRuntime: true },
        _sum: { totalAccepted: true }
      })
    ]);

    sendSuccess({
      res,
      data: {
        totalProblems,
        byDifficulty,
        byCategory,
        statistics: {
          averageSuccessRate: (averageStats._avg.successRate || 0).toFixed(2),
          averageAttempts: (averageStats._avg.totalAttempts || 0).toFixed(0),
          totalAccepted: averageStats._sum.totalAccepted || 0,
          averageRuntime: (averageStats._avg.averageRuntime || 0).toFixed(0)
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/problems/:id/version-history - Get version history for a problem
router.get('/:id/version-history', authenticate, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const versions = await prisma.problemVersion.findMany({
      where: { problemId: id },
      orderBy: { versionNum: 'desc' }
    });

    sendSuccess({ res, data: versions });
  } catch (err) {
    next(err);
  }
});

export default router;
