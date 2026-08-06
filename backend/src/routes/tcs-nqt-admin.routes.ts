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

    if (req.query.courseId) {
      where.courseId = String(req.query.courseId);
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
      courseId,
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

    // Create in TcsNqtQuestion table (Placement Prep)
    const question = await prisma.tcsNqtQuestion.create({
      data: {
        title,
        slug,
        statement,
        difficulty,
        courseId: courseId || null,
        topic,
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

    // ─── AUTO-SYNC: Also create in Problem table (Coding Arena) ───────────
    const arenaSlug = slug.replace(/-tcs-nqt$/, '-arena');
    // Map TCS NQT topic names to Coding Arena topic names
    const topicNameMap: Record<string, string> = {
      'Problems on Arrays': 'Arrays',
      'problems on arrays': 'Arrays',
    };
    const arenaTopicName = topicNameMap[topic] || topic;
    try {
      const existingProblem = await prisma.problem.findUnique({ where: { slug: arenaSlug } });
      if (!existingProblem) {
        const starterCode = {
          javascript: `// Write your solution here\nfunction solve(input) {\n  const lines = input.trim().split('\\n');\n  // Your code\n}\nsolve();`,
          python: `# Write your solution here\nimport sys\ndata = sys.stdin.read().split('\\n')\n# Your code`,
          java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Your code\n    }\n}`,
          cpp: `#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    // Your code\n    return 0;\n}`,
        };

        await prisma.problem.create({
          data: {
            title,
            slug: arenaSlug,
            difficulty,
            statement,
            constraints: constraints || '',
            inputFormat: inputFormat || '',
            outputFormat: outputFormat || '',
            timeLimit: 2000,
            memoryLimit: 256,
            starterCode,
            referenceSolution: referenceSolution || '',
            topics: arenaTopicName || '',
            companies: companies || 'TCS',
            tags: '',
            category: (experienceLevel || 'freshers'),
            isArchived: false,
            createdBy: req.user?.userId,
            testCases: {
              create: (testCases || []).map((tc: any, idx: number) => ({
                input: tc.input || '',
                expectedOutput: tc.output || tc.expectedOutput || '',
                isHidden: tc.isHidden ?? false,
                type: tc.isHidden ? 'hidden' : 'sample',
                explanation: tc.explanation || null,
                order: idx,
              })),
            },
          },
        });
      }
    } catch (syncErr: any) {
      // Don't fail the main request if Coding Arena sync fails
      console.warn('⚠️ Auto-sync to Coding Arena failed:', syncErr.message);
    }

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

    // ─── AUTO-SYNC: Also update in Problem table (Coding Arena) ───────────
    try {
      const arenaSlug = question.slug.replace(/-tcs-nqt$/, '-arena');
      const topicMap: Record<string, string> = { 'Problems on Arrays': 'Arrays' };
      const existingProblem = await prisma.problem.findUnique({ where: { slug: arenaSlug } });
      if (existingProblem) {
        const mappedTopic = topicMap[updated.topic] || updated.topic;
        const updateData: any = {
          title: updated.title,
          statement: updated.statement,
          difficulty: updated.difficulty,
          inputFormat: updated.inputFormat,
          outputFormat: updated.outputFormat,
          constraints: updated.constraints,
          referenceSolution: updated.referenceSolution,
          topics: mappedTopic,
          companies: updated.companies,
          updatedBy: req.user?.userId,
        };
        await prisma.problem.update({ where: { id: existingProblem.id }, data: updateData });

        // Replace test cases if updated
        if (req.body.testCases !== undefined) {
          await prisma.problemTestCase.deleteMany({ where: { problemId: existingProblem.id } });
          const tcs = req.body.testCases || [];
          for (let i = 0; i < tcs.length; i++) {
            await prisma.problemTestCase.create({
              data: {
                problemId: existingProblem.id,
                input: tcs[i].input || '',
                expectedOutput: tcs[i].output || tcs[i].expectedOutput || '',
                isHidden: tcs[i].isHidden ?? false,
                type: tcs[i].isHidden ? 'hidden' : 'sample',
                explanation: tcs[i].explanation || null,
                order: i,
              },
            });
          }
        }
      }
    } catch (syncErr: any) {
      console.warn('⚠️ Auto-sync update to Coding Arena failed:', syncErr.message);
    }

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

    // ─── AUTO-SYNC: Archive corresponding Problem in Coding Arena ─────────
    try {
      const arenaSlug = question.slug.replace(/-tcs-nqt$/, '-arena');
      const existingProblem = await prisma.problem.findUnique({ where: { slug: arenaSlug } });
      if (existingProblem) {
        await prisma.problem.update({ where: { id: existingProblem.id }, data: { isArchived: true } });
      }
    } catch (syncErr: any) {
      console.warn('⚠️ Auto-sync delete to Coding Arena failed:', syncErr.message);
    }

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
