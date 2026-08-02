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

// POST /api/admin/problems - Create new problem with comprehensive data
router.post('/', authenticate, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      title,
      slug,
      difficulty,
      statement,
      constraints,
      inputFormat,
      outputFormat,
      timeLimit,
      memoryLimit,
      starterCode,
      referenceSolution,
      topics,
      companies,
      tags,
      category,
      testCases, // array of { input, expectedOutput, isHidden, explanation, order }
      solutions, // array of { code, language, approach, timeComplexity, spaceComplexity, explanation, isOptimal }
    } = req.body;

    // Validate required fields
    if (!title || !statement) {
      throw new AppError('Title and statement are required', 400);
    }

    // Generate slug if not provided
    const finalSlug = slug || slugify(title, { lower: true, strict: true });

    // Check if problem already exists
    const existing = await prisma.problem.findUnique({
      where: { slug: finalSlug }
    });

    if (existing) {
      throw new AppError('Problem with this slug already exists', 409);
    }

    // Create problem with test cases and solutions in transaction
    const problem = await prisma.$transaction(async (tx) => {
      // Create problem
      const p = await tx.problem.create({
        data: {
          title,
          slug: finalSlug,
          difficulty: difficulty || 'easy',
          statement,
          constraints,
          inputFormat,
          outputFormat,
          timeLimit: timeLimit || 2000,
          memoryLimit: memoryLimit || 256,
          starterCode: starterCode || {},
          referenceSolution,
          topics: topics || '',
          companies: companies || '',
          tags: tags || '',
          category: category || 'general',
          createdBy: req.user?.userId,
        }
      });

      // Add test cases
      if (testCases && Array.isArray(testCases)) {
        for (let i = 0; i < testCases.length; i++) {
          const tc = testCases[i];
          await tx.problemTestCase.create({
            data: {
              problemId: p.id,
              input: tc.input,
              expectedOutput: tc.expectedOutput,
              isHidden: tc.isHidden ?? true,
              explanation: tc.explanation,
              order: tc.order ?? i
            }
          });
        }
      }

      // Add solutions
      if (solutions && Array.isArray(solutions)) {
        for (const sol of solutions) {
          await tx.problemSolution.create({
            data: {
              problemId: p.id,
              code: sol.code,
              language: sol.language,
              approach: sol.approach,
              timeComplexity: sol.timeComplexity,
              spaceComplexity: sol.spaceComplexity,
              explanation: sol.explanation,
              isOptimal: sol.isOptimal ?? false,
              createdBy: req.user?.userId
            }
          });
        }
      }

      // Create initial version
      await tx.problemVersion.create({
        data: {
          problemId: p.id,
          versionNum: 1,
          title,
          statement,
          difficulty: difficulty || 'easy',
          changes: {
            created: true,
            fields: ['title', 'statement', 'difficulty']
          },
          changedBy: req.user?.userId,
          changeReason: 'Initial creation'
        }
      });

      return p;
    });

    sendSuccess({
      res,
      message: 'Problem created successfully',
      data: problem,
      statusCode: 201
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/problems - Get all problems with pagination
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
    const category = req.query.category as string | undefined;
    const tags = req.query.tags as string | undefined;

    const pageNum = Math.max(1, page);
    const limitNum = Math.max(1, Math.min(limit, 100)); // Cap at 100
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const where: any = {
      isArchived: false
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

    if (category) {
      where.category = category;
    }

    if (tags) {
      where.tags = { contains: tags };
    }

    // Get total count
    const total = await prisma.problem.count({ where });

    // Get problems
    const problems = await prisma.problem.findMany({
      where,
      include: {
        testCases: {
          select: {
            id: true,
            isHidden: true,
            order: true
          }
        },
        solutions: {
          select: {
            id: true,
            language: true,
            isOptimal: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum
    });

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

// GET /api/admin/problems/:id - Get full problem details including all test cases and solutions
router.get('/:id', authenticate, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const problem = await prisma.problem.findUnique({
      where: { id },
      include: {
        testCases: true,
        solutions: true,
        versionHistory: {
          orderBy: { versionNum: 'desc' },
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

// PUT /api/admin/problems/:id - Update problem with version tracking
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
      starterCode,
      referenceSolution,
      topics,
      companies,
      tags,
      category,
      testCases,
      solutions,
      changeReason
    } = req.body;

    // Get existing problem
    const existing = await prisma.problem.findUnique({
      where: { id },
      include: { versionHistory: true }
    });

    if (!existing) {
      throw new AppError('Problem not found', 404);
    }

    // Update problem with transaction
    const updated = await prisma.$transaction(async (tx) => {
      // Track changes
      const changes: any = {};
      if (title && title !== existing.title) changes.title = { from: existing.title, to: title };
      if (difficulty && difficulty !== existing.difficulty) changes.difficulty = { from: existing.difficulty, to: difficulty };
      if (statement && statement !== existing.statement) changes.statement = { from: existing.statement, to: statement };

      // Update problem
      const p = await tx.problem.update({
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
          starterCode: starterCode || existing.starterCode,
          referenceSolution: referenceSolution || existing.referenceSolution,
          topics: topics || existing.topics,
          companies: companies || existing.companies,
          tags: tags || existing.tags,
          category: category || existing.category,
          updatedBy: req.user?.userId
        }
      });

      // Update test cases if provided
      if (testCases && Array.isArray(testCases)) {
        // Delete existing
        await tx.problemTestCase.deleteMany({
          where: { problemId: id }
        });

        // Create new
        for (let i = 0; i < testCases.length; i++) {
          const tc = testCases[i];
          await tx.problemTestCase.create({
            data: {
              problemId: id,
              input: tc.input,
              expectedOutput: tc.expectedOutput,
              isHidden: tc.isHidden ?? true,
              explanation: tc.explanation,
              order: tc.order ?? i
            }
          });
        }
        changes.testCases = `Updated to ${testCases.length} test cases`;
      }

      // Update solutions if provided
      if (solutions && Array.isArray(solutions)) {
        // Mark old as inactive
        await tx.problemSolution.updateMany({
          where: { problemId: id },
          data: { isActive: false }
        });

        // Create new
        for (const sol of solutions) {
          await tx.problemSolution.create({
            data: {
              problemId: id,
              code: sol.code,
              language: sol.language,
              approach: sol.approach,
              timeComplexity: sol.timeComplexity,
              spaceComplexity: sol.spaceComplexity,
              explanation: sol.explanation,
              isOptimal: sol.isOptimal ?? false,
              createdBy: req.user?.userId
            }
          });
        }
        changes.solutions = `Updated to ${solutions.length} solutions`;
      }

      // Create new version
      const newVersion = (existing.versionHistory?.length || 0) + 1;
      await tx.problemVersion.create({
        data: {
          problemId: id,
          versionNum: newVersion,
          title: title || existing.title,
          statement: statement || existing.statement,
          difficulty: difficulty || existing.difficulty,
          changes,
          changedBy: req.user?.userId,
          changeReason: changeReason || 'Updated'
        }
      });

      return p;
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

// DELETE /api/admin/problems/:id - Soft delete (archive) problem
router.delete('/:id', authenticate, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const problem = await prisma.problem.findUnique({ where: { id } });

    if (!problem) {
      throw new AppError('Problem not found', 404);
    }

    // Soft delete
    await prisma.problem.update({
      where: { id },
      data: { isArchived: true, updatedBy: req.user?.userId }
    });

    sendSuccess({ res, message: 'Problem archived successfully' });
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
