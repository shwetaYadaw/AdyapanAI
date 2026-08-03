import { Router } from 'express';
import { prisma } from '../config/prisma';
import { authenticate } from '../middleware/auth.middleware';
import { executionEngineService } from '../services/executionEngine.service';
import { sendSuccess } from '../utils/response.utils';
import { AppError } from '../middleware/errorHandler.middleware';
import { logger } from '../utils/logger';

const router = Router();

/**
 * POST /api/submissions/:problemId/run
 * Run code with custom input using Execution Engine
 */
router.post('/:problemId/run', authenticate, async (req, res, next) => {
  try {
    const { code, language, input } = req.body;
    const { problemId } = req.params;

    if (!code || !language) {
      throw new AppError('Code and language are required', 400);
    }

    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
    });

    if (!problem) {
      throw new AppError('Problem not found', 404);
    }

    logger.info(`Running code for user ${req.user!.userId}, problem ${problemId}`);

    const result = await executionEngineService.runCode(
      code,
      language,
      input || '',
      problem.timeLimit,
      problem.memoryLimit
    );

    sendSuccess({
      res,
      data: {
        output: result.output,
        error: result.error,
        runtime: result.runtime,
        memory: result.memory,
        verdict: result.verdict,
        timeout: result.timeout,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/submissions/:problemId/submit
 * Submit code for judging using Execution Engine
 */
router.post('/:problemId/submit', authenticate, async (req, res, next) => {
  try {
    const { code, language } = req.body;
    const { problemId } = req.params;

    if (!code || !language) {
      throw new AppError('Code and language are required', 400);
    }

    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      include: { testCases: true },
    });

    if (!problem) {
      throw new AppError('Problem not found', 404);
    }

    if (problem.testCases.length === 0) {
      throw new AppError('No test cases available for this problem', 400);
    }

    logger.info(`Submitting code for user ${req.user!.userId}, problem ${problemId}`);

    // Create pending submission
    const submission = await prisma.submission.create({
      data: {
        userId: req.user!.userId,
        problemId: problem.id,
        code,
        language,
        status: 'pending',
        totalCount: problem.testCases.length,
      },
    });

    // Prepare test cases for execution engine
    const testCases = problem.testCases.map(tc => ({
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      isHidden: tc.isHidden,
    }));

    // Submit to execution engine
    const result = await executionEngineService.submitCode(
      submission.id,
      code,
      language,
      testCases,
      problem.timeLimit,
      problem.memoryLimit
    );

    sendSuccess({
      res,
      message: 'Submission enqueued successfully',
      data: {
        submissionId: submission.id,
        jobId: result.jobId,
        status: 'pending',
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/submissions/:submissionId
 * Get submission details and result
 */
router.get('/:submissionId', authenticate, async (req, res, next) => {
  try {
    const { submissionId } = req.params;

    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        result: true,
        problem: {
          select: {
            id: true,
            title: true,
            slug: true,
            difficulty: true,
          },
        },
      },
    });

    if (!submission) {
      throw new AppError('Submission not found', 404);
    }

    // Check ownership
    if (submission.userId !== req.user!.userId) {
      throw new AppError('Unauthorized to view this submission', 403);
    }

    sendSuccess({
      res,
      data: submission,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/submissions/:submissionId/result
 * Callback endpoint for Execution Engine to send results
 * (Internal use - should be protected by API key)
 */
router.post('/:submissionId/result', async (req, res, next) => {
  try {
    // Verify API key from execution engine
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== process.env.EXECUTION_ENGINE_API_KEY) {
      throw new AppError('Invalid API key', 403);
    }

    const { submissionId } = req.params;
    const {
      status,
      runtime,
      memory,
      passedCount,
      totalCount,
      errorMessage,
      testResults,
    } = req.body;

    logger.info(`Received result for submission ${submissionId}: ${status}`);

    // Update submission
    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        status,
        runtime,
        passedCount,
        totalCount,
        errorMessage,
      },
    });

    // Create or update submission result
    await prisma.submissionResult.upsert({
      where: { submissionId },
      create: {
        submissionId,
        status,
        runtime,
        memory,
        passedCount,
        totalCount,
        errorMessage,
        score: status === 'accepted' ? 100 : Math.floor((passedCount / totalCount) * 100),
      },
      update: {
        status,
        runtime,
        memory,
        passedCount,
        totalCount,
        errorMessage,
        score: status === 'accepted' ? 100 : Math.floor((passedCount / totalCount) * 100),
      },
    });

    // Award XP if accepted
    if (status === 'accepted') {
      const submission = await prisma.submission.findUnique({
        where: { id: submissionId },
        include: { problem: true },
      });

      if (submission?.problem) {
        // Check if this is the first accepted submission for this problem
        const previousAccepted = await prisma.submission.findFirst({
          where: {
            userId: submission.userId,
            problemId: submission.problemId,
            status: 'accepted',
            id: { not: submissionId },
          },
        });

        // Award XP only for first acceptance
        if (!previousAccepted) {
          const xpReward = submission.problem.difficulty === 'easy' ? 10 :
                          submission.problem.difficulty === 'medium' ? 20 : 30;

          await prisma.studentProfile.upsert({
            where: { userId: submission.userId },
            create: {
              userId: submission.userId,
              xp: xpReward,
              level: 1,
            },
            update: {
              xp: { increment: xpReward },
            },
          });

          logger.info(`Awarded ${xpReward} XP to user ${submission.userId}`);
        }
      }
    }

    sendSuccess({
      res,
      message: 'Result updated successfully',
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/submissions/user/history
 * Get user's submission history
 */
router.get('/user/history', authenticate, async (req, res, next) => {
  try {
    const { page = '1', limit = '20', problemId, status } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      userId: req.user!.userId,
    };

    if (problemId) {
      where.problemId = problemId as string;
    }

    if (status) {
      where.status = status as string;
    }

    const [submissions, total] = await Promise.all([
      prisma.submission.findMany({
        where,
        include: {
          problem: {
            select: {
              id: true,
              title: true,
              slug: true,
              difficulty: true,
            },
          },
          result: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.submission.count({ where }),
    ]);

    sendSuccess({
      res,
      data: {
        submissions,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
