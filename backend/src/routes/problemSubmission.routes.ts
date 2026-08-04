// @ts-nocheck
import { Router } from 'express';
import { prisma } from '../config/prisma';
import { authenticate } from '../middleware/auth.middleware';
import { JudgeService } from '../services/judge.service';
import { queueService } from '../services/queue.service';
import { sendSuccess } from '../utils/response.utils';
import { AppError } from '../middleware/errorHandler.middleware';

const router = Router();
const judge = new JudgeService();

// Helper to detect hardcoding outputs
function detectHardcoding(code: string, expectedOutputs: string[]): boolean {
  const normalizedCode = code.replace(/\s+/g, '');
  for (const out of expectedOutputs) {
    const cleanOut = String(out).trim();
    if (!cleanOut || cleanOut.length === 0) continue;
    const patterns = [
      `return"${cleanOut}"`,
      `return'${cleanOut}'`,
      `return\`${cleanOut}\``,
      `return${cleanOut}`,
      `print("${cleanOut}")`,
      `print('${cleanOut}')`,
      `print(${cleanOut})`,
      `console.log("${cleanOut}")`,
      `console.log('${cleanOut}')`,
      `console.log(${cleanOut})`,
      `System.out.println("${cleanOut}")`,
      `System.out.println('${cleanOut}')`,
      `System.out.println(${cleanOut})`,
      `cout<<"${cleanOut}"`,
      `cout<<${cleanOut}`
    ];
    if (patterns.some(p => normalizedCode.includes(p))) {
      return true;
    }
  }
  return false;
}

// POST /problems/:id/run — Execute code against ONLY visible/sample test cases (Coding Arena)
router.post('/:problemId/run', authenticate, async (req, res, next) => {
  try {
    const { code, language } = req.body;
    const { problemId } = req.params;

    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      include: { testCases: { where: { isHidden: false } } },
    });

    if (!problem) throw new AppError('Problem not found', 404);

    const sampleTestCase = problem.testCases[0];
    if (!sampleTestCase) throw new AppError('No sample test case found for this problem', 400);

    const result = await judge.runTestCase(
      code,
      language,
      sampleTestCase.input,
      sampleTestCase.expectedOutput,
      problem.timeLimit
    );

    sendSuccess({
      res,
      data: {
        passed: result.passed,
        actualOutput: result.actualOutput,
        expectedOutput: sampleTestCase.expectedOutput,
        input: sampleTestCase.input,
        runtime: result.runtime,
        errorMessage: result.errorMessage,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /problems/:id/submit — Submit solution for Coding Arena problems
router.post('/:problemId/submit', authenticate, async (req, res, next) => {
  try {
    const { code, language } = req.body;
    const { problemId } = req.params;

    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      include: { testCases: true },
    });

    if (!problem) throw new AppError('Problem not found', 404);

    // Anti-cheat check: detect static hardcoding of outputs
    const visibleOutputs = problem.testCases.filter(t => !t.isHidden).map(t => t.expectedOutput);
    const expectedOutputs = Array.from(new Set(visibleOutputs));
    const isCheating = detectHardcoding(code, expectedOutputs);

    if (isCheating) {
      const submission = await prisma.problemSubmission.create({
        data: {
          userId: req.user!.userId,
          problemId: problem.id,
          code,
          language,
          status: 'wrong_answer',
          errorMessage: 'Cheat Detected: Hardcoded output values found.',
        },
      });

      await prisma.problemSubmissionResult.create({
        data: {
          problemSubmissionId: submission.id,
          status: 'wrong_answer',
          errorMessage: 'Cheat Detected: Hardcoded output values found.',
          totalCount: problem.testCases.length,
          passedCount: 0,
        },
      });

      return sendSuccess({
        res,
        message: 'Cheat detected, submission rejected.',
        data: submission,
      });
    }

    // Create pending submission record
    const submission = await prisma.problemSubmission.create({
      data: {
        userId: req.user!.userId,
        problemId: problem.id,
        code,
        language,
        status: 'pending',
      },
    });

    // Enqueue for background worker processing
    await queueService.enqueue({
      submissionId: submission.id,
      problemId: problem.id,
      code,
      language,
      type: 'problem' // Flag to indicate this is a Problem submission
    });

    sendSuccess({
      res,
      message: 'Submission enqueued successfully',
      data: { submissionId: submission.id, status: 'pending', type: 'problem' },
    });
  } catch (err) {
    next(err);
  }
});

// GET /problems/submissions/:id — Retrieve status of a Problem submission
router.get('/submissions/:submissionId', authenticate, async (req, res, next) => {
  try {
    const { submissionId } = req.params;

    const submission = await prisma.problemSubmission.findUnique({
      where: { id: submissionId },
      include: { 
        problemSubmissionResult: true,
        problem: {
          select: {
            id: true,
            title: true,
            slug: true,
            difficulty: true
          }
        }
      },
    });

    if (!submission) throw new AppError('Submission not found', 404);

    // Check if user owns this submission
    if (submission.userId !== req.user!.userId) {
      throw new AppError('Unauthorized: You can only view your own submissions', 403);
    }

    // Format response
    const enhancedResponse = {
      id: submission.id,
      problemId: submission.problemId,
      problem: submission.problem,
      status: submission.status,
      language: submission.language,
      runtime: submission.runtime,
      passedCount: submission.passedCount,
      totalCount: submission.totalCount,
      score: submission.problemSubmissionResult?.score || 0,
      verdict:
        submission.status === 'accepted'
          ? '✅ ACCEPTED'
          : submission.status === 'wrong_answer'
            ? '❌ WRONG ANSWER'
            : submission.status === 'compile_error'
              ? '❌ COMPILE ERROR'
              : submission.status === 'runtime_error'
                ? '❌ RUNTIME ERROR'
                : submission.status === 'time_limit_exceeded'
                  ? '⏱️ TIME LIMIT EXCEEDED'
                  : `❌ ${submission.status.toUpperCase()}`,
      errorMessage: submission.errorMessage,
      result: submission.problemSubmissionResult,
      createdAt: submission.createdAt,
    };

    sendSuccess({ res, data: enhancedResponse });
  } catch (err) {
    next(err);
  }
});

// GET /problems/submissions/history — Retrieve user's Problem submission history
router.get('/submissions/history', authenticate, async (req, res, next) => {
  try {
    const { problemId, status, limit = 50, offset = 0 } = req.query;

    const where: any = { userId: req.user!.userId };
    
    if (problemId) {
      where.problemId = String(problemId);
    }
    
    if (status) {
      where.status = String(status);
    }

    const submissions = await prisma.problemSubmission.findMany({
      where,
      include: { 
        problem: {
          select: {
            id: true,
            title: true,
            slug: true,
            difficulty: true
          }
        },
        problemSubmissionResult: true 
      },
      orderBy: { createdAt: 'desc' },
      take: Number(limit),
      skip: Number(offset)
    });

    const total = await prisma.problemSubmission.count({ where });

    sendSuccess({ 
      res, 
      data: {
        submissions,
        pagination: {
          total,
          limit: Number(limit),
          offset: Number(offset),
          hasMore: total > Number(offset) + Number(limit)
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /problems/:problemId/my-submissions — Get all submissions for a specific problem by current user
router.get('/:problemId/my-submissions', authenticate, async (req, res, next) => {
  try {
    const { problemId } = req.params;

    const submissions = await prisma.problemSubmission.findMany({
      where: {
        userId: req.user!.userId,
        problemId: problemId
      },
      include: {
        problemSubmissionResult: true
      },
      orderBy: { createdAt: 'desc' }
    });

    sendSuccess({ res, data: submissions });
  } catch (err) {
    next(err);
  }
});

// GET /problems/:problemId/stats — Get problem statistics (acceptance rate, submission count, etc.)
router.get('/:problemId/stats', async (req, res, next) => {
  try {
    const { problemId } = req.params;

    const totalSubmissions = await prisma.problemSubmission.count({
      where: { problemId }
    });

    const acceptedSubmissions = await prisma.problemSubmission.count({
      where: { problemId, status: 'accepted' }
    });

    const uniqueUsers = await prisma.problemSubmission.findMany({
      where: { problemId },
      select: { userId: true },
      distinct: ['userId']
    });

    const acceptanceRate = totalSubmissions > 0 
      ? ((acceptedSubmissions / totalSubmissions) * 100).toFixed(2)
      : '0.00';

    sendSuccess({
      res,
      data: {
        totalSubmissions,
        acceptedSubmissions,
        uniqueSolvers: uniqueUsers.length,
        acceptanceRate: `${acceptanceRate}%`
      }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
