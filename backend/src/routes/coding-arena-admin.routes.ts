import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { prisma } from '../config/prisma';
import { sendSuccess, sendPaginated, getPaginationParams } from '../utils/response.utils';
import { AppError } from '../middleware/errorHandler.middleware';

const router = Router();
router.use(authenticate, authorize('admin'));

// ============================================================================
// CODING ARENA ADMIN ENDPOINTS — Uses the SAME "Problem" table that students see
// ============================================================================

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// GET /admin/coding-arena - List all Coding Arena problems
router.get('/', async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query as Record<string, unknown>);
    const where: any = {};

    if (req.query.topic) {
      where.topics = { contains: String(req.query.topic), mode: 'insensitive' };
    }

    if (req.query.difficulty) {
      where.difficulty = String(req.query.difficulty);
    }

    if (req.query.search) {
      where.title = { contains: String(req.query.search), mode: 'insensitive' };
    }

    // Include archived filter (admin can see both)
    if (req.query.archived === 'true') {
      where.isArchived = true;
    } else if (req.query.archived === 'false') {
      where.isArchived = false;
    }
    // If no archived filter, show all

    const [problems, total] = await Promise.all([
      prisma.problem.findMany({
        where,
        include: { testCases: { orderBy: { order: 'asc' } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.problem.count({ where }),
    ]);

    // Map to admin-friendly format
    const mapped = problems.map(p => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      difficulty: p.difficulty,
      topic: p.topics, // CSV string — admin sees raw
      companies: p.companies,
      statement: p.statement,
      inputFormat: p.inputFormat,
      outputFormat: p.outputFormat,
      constraints: p.constraints,
      referenceSolution: p.referenceSolution,
      timeLimit: p.timeLimit,
      memoryLimit: p.memoryLimit,
      isArchived: p.isArchived,
      category: p.category,
      tags: p.tags,
      testCases: p.testCases.map(tc => ({
        input: tc.input,
        output: tc.expectedOutput,
        isHidden: tc.isHidden,
        explanation: tc.explanation || '',
      })),
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    sendPaginated({ res, data: mapped, total, page, limit });
  } catch (err) {
    next(err);
  }
});

// GET /admin/coding-arena/:id - Get single problem (by id or slug)
router.get('/:id', async (req, res, next) => {
  try {
    const param = req.params.id;
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(param);

    const problem = isUUID
      ? await prisma.problem.findUnique({ where: { id: param }, include: { testCases: { orderBy: { order: 'asc' } } } })
      : await prisma.problem.findUnique({ where: { slug: param }, include: { testCases: { orderBy: { order: 'asc' } } } });

    if (!problem) {
      throw new AppError('Coding Arena problem not found', 404);
    }

    sendSuccess({
      res,
      data: {
        ...problem,
        topic: problem.topics,
        testCases: problem.testCases.map(tc => ({
          input: tc.input,
          output: tc.expectedOutput,
          isHidden: tc.isHidden,
          explanation: tc.explanation || '',
        })),
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /admin/coding-arena - Create new Coding Arena problem (writes to Problem table)
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
      testCases, // array of { input, output, isHidden, explanation }
      topic,
      companies,
      timeLimit,
      memoryLimit,
    } = req.body;

    if (!title || !statement || !difficulty) {
      throw new AppError('Title, statement, and difficulty are required', 400);
    }

    const slug = slugify(title) + '-arena';

    // Check slug uniqueness
    const existing = await prisma.problem.findUnique({ where: { slug } });
    if (existing) {
      throw new AppError('Problem with this title already exists', 409);
    }

    const starterCodeJson = {
      javascript: `// Write your solution here\nfunction solve(input) {\n  const lines = input.trim().split('\\n');\n  // Your code\n}\nsolve();`,
      python: `# Write your solution here\ndef solve():\n    import sys\n    data = sys.stdin.read().split()\n    # Your code\n    pass\nsolve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Your code\n    }\n}`,
      cpp: `#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    // Your code\n    return 0;\n}`,
    };

    // Create problem + test cases in one transaction
    const problem = await prisma.$transaction(async (tx: any) => {
      const p = await tx.problem.create({
        data: {
          title,
          slug,
          difficulty: difficulty || 'easy',
          statement,
          constraints: constraints || '',
          inputFormat: inputFormat || '',
          outputFormat: outputFormat || '',
          timeLimit: timeLimit || 2000,
          memoryLimit: memoryLimit || 256,
          starterCode: starterCodeJson,
          referenceSolution: referenceSolution || '',
          topics: topic || '',
          companies: companies || '',
          tags: '',
          category: 'general',
          createdBy: req.user?.userId,
        },
      });

      // Create test cases
      if (testCases && testCases.length > 0) {
        for (let i = 0; i < testCases.length; i++) {
          const tc = testCases[i];
          await tx.problemTestCase.create({
            data: {
              problemId: p.id,
              input: tc.input || '',
              expectedOutput: tc.output || tc.expectedOutput || '',
              isHidden: tc.isHidden ?? false,
              type: tc.isHidden ? 'hidden' : 'sample',
              explanation: tc.explanation || null,
              order: i,
            },
          });
        }
      }

      return p;
    });

    sendSuccess({ res, statusCode: 201, data: problem, message: 'Coding Arena problem created successfully' });
  } catch (err) {
    next(err);
  }
});

// PUT /admin/coding-arena/:id - Update Coding Arena problem
router.put('/:id', async (req, res, next) => {
  try {
    const param = req.params.id;
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(param);

    const existing = isUUID
      ? await prisma.problem.findUnique({ where: { id: param } })
      : await prisma.problem.findUnique({ where: { slug: param } });

    if (!existing) {
      throw new AppError('Coding Arena problem not found', 404);
    }

    const {
      title,
      statement,
      difficulty,
      inputFormat,
      outputFormat,
      constraints,
      referenceSolution,
      testCases,
      topic,
      companies,
      timeLimit,
      memoryLimit,
      isArchived,
    } = req.body;

    // Update in transaction (problem + replace test cases if provided)
    const updated = await prisma.$transaction(async (tx: any) => {
      const p = await tx.problem.update({
        where: { id: existing.id },
        data: {
          title: title || existing.title,
          statement: statement || existing.statement,
          difficulty: difficulty || existing.difficulty,
          inputFormat: inputFormat ?? existing.inputFormat,
          outputFormat: outputFormat ?? existing.outputFormat,
          constraints: constraints ?? existing.constraints,
          referenceSolution: referenceSolution ?? existing.referenceSolution,
          topics: topic ?? existing.topics,
          companies: companies ?? existing.companies,
          timeLimit: timeLimit ?? existing.timeLimit,
          memoryLimit: memoryLimit ?? existing.memoryLimit,
          isArchived: isArchived !== undefined ? isArchived : existing.isArchived,
          updatedBy: req.user?.userId,
        },
      });

      // Replace test cases if new ones provided
      if (testCases && Array.isArray(testCases)) {
        await tx.problemTestCase.deleteMany({ where: { problemId: existing.id } });
        for (let i = 0; i < testCases.length; i++) {
          const tc = testCases[i];
          await tx.problemTestCase.create({
            data: {
              problemId: existing.id,
              input: tc.input || '',
              expectedOutput: tc.output || tc.expectedOutput || '',
              isHidden: tc.isHidden ?? false,
              type: tc.isHidden ? 'hidden' : 'sample',
              explanation: tc.explanation || null,
              order: i,
            },
          });
        }
      }

      return p;
    });

    sendSuccess({ res, data: updated, message: 'Coding Arena problem updated successfully' });
  } catch (err) {
    next(err);
  }
});

// DELETE /admin/coding-arena/:id - Archive (soft-delete) a Coding Arena problem
router.delete('/:id', async (req, res, next) => {
  try {
    const param = req.params.id;
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(param);

    const problem = isUUID
      ? await prisma.problem.findUnique({ where: { id: param } })
      : await prisma.problem.findUnique({ where: { slug: param } });

    if (!problem) {
      throw new AppError('Coding Arena problem not found', 404);
    }

    // Soft delete (archive) — keeps submissions and history intact
    await prisma.problem.update({
      where: { id: problem.id },
      data: { isArchived: true },
    });

    res.setHeader('X-Cache-Invalidate', 'coding-arena');
    res.setHeader('X-Entity-ID', problem.id);

    sendSuccess({ res, statusCode: 200, message: 'Coding Arena problem archived successfully' });
  } catch (err) {
    next(err);
  }
});

// GET /admin/coding-arena/stats/overview - Get Coding Arena statistics
router.get('/stats/overview', async (_req, res, next) => {
  try {
    const total = await prisma.problem.count({ where: { isArchived: false } });

    const byDifficulty = await prisma.problem.groupBy({
      by: ['difficulty'],
      _count: true,
      where: { isArchived: false },
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
