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

// POST /questions/:id/run — Execute code against ONLY visible/sample test cases (TCS NQT)
router.post('/:questionId/run', authenticate, async (req, res, next) => {
  try {
    const { code, language } = req.body;
    const { questionId } = req.params;

    const question = await prisma.question.findUnique({
      where: { id: questionId }
    });

    if (!question) throw new AppError('Question not found', 404);

    // Parse testCases JSON
    const testCases = Array.isArray(question.testCases) 
      ? question.testCases 
      : [];

    const sampleTestCase = testCases.find((tc: any) => !tc.isHidden);
    
    if (!sampleTestCase) {
      throw new AppError('No sample test case found for this question', 400);
    }

    const result = await judge.runTestCase(
      code,
      language,
      sampleTestCase.input,
      sampleTestCase.expectedOutput || sampleTestCase.output,
      question.timeLimit
    );

    sendSuccess({
      res,
      data: {
        passed: result.passed,
        actualOutput: result.actualOutput,
        expectedOutput: sampleTestCase.expectedOutput || sampleTestCase.output,
        input: sampleTestCase.input,
        runtime: result.runtime,
        errorMessage: result.errorMessage,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /questions/:id/submit — Submit solution for TCS NQT questions
router.post('/:questionId/submit', authenticate, async (req, res, next) => {
  try {
    const { code, language } = req.body;
    const { questionId } = req.params;

    const question = await prisma.question.findUnique({
      where: { id: questionId }
    });

    if (!question) throw new AppError('Question not found', 404);

    // Parse testCases JSON
    const testCases = Array.isArray(question.testCases) 
      ? question.testCases 
      : [];

    // Anti-cheat check: detect static hardcoding of outputs
    const visibleTestCases = testCases.filter((tc: any) => !tc.isHidden);
    const visibleOutputs = visibleTestCases.map((tc: any) => tc.expectedOutput || tc.output);
    const expectedOutputs = Array.from(new Set(visibleOutputs));
    const isCheating = detectHardcoding(code, expectedOutputs);

    if (isCheating) {
      const submission = await prisma.questionSubmission.create({
        data: {
          userId: req.user!.userId,
          questionId: question.id,
          code,
          language,
          status: 'wrong_answer',
          errorMessage: 'Cheat Detected: Hardcoded output values found.',
          totalCount: testCases.length,
        },
      });

      await prisma.questionSubmissionResult.create({
        data: {
          questionSubmissionId: submission.id,
          status: 'wrong_answer',
          errorMessage: 'Cheat Detected: Hardcoded output values found.',
          totalCount: testCases.length,
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
    const submission = await prisma.questionSubmission.create({
      data: {
        userId: req.user!.userId,
        questionId: question.id,
        code,
        language,
        status: 'pending',
        totalCount: testCases.length,
      },
    });

    // Enqueue for background worker processing
    await queueService.enqueue({
      submissionId: submission.id,
      questionId: question.id,
      code,
      language,
      type: 'question' // Flag to indicate this is a Question submission
    });

    sendSuccess({
      res,
      message: 'Submission enqueued successfully',
      data: { submissionId: submission.id, status: 'pending', type: 'question' },
    });
  } catch (err) {
    next(err);
  }
});

// GET /questions/submissions/:id — Retrieve status of a Question submission
router.get('/submissions/:submissionId', authenticate, async (req, res, next) => {
  try {
    const { submissionId } = req.params;

    const submission = await prisma.questionSubmission.findUnique({
      where: { id: submissionId },
      include: { 
        questionSubmissionResult: true,
        question: {
          select: {
            id: true,
            title: true,
            slug: true,
            difficulty: true,
            xpReward: true
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
      questionId: submission.questionId,
      question: submission.question,
      status: submission.status,
      language: submission.language,
      runtime: submission.runtime,
      passedCount: submission.passedCount,
      totalCount: submission.totalCount,
      score: submission.questionSubmissionResult?.score || 0,
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
      result: submission.questionSubmissionResult,
      createdAt: submission.createdAt,
    };

    sendSuccess({ res, data: enhancedResponse });
  } catch (err) {
    next(err);
  }
});

// GET /questions/submissions/history — Retrieve user's Question submission history
router.get('/submissions/history', authenticate, async (req, res, next) => {
  try {
    const { questionId, status, limit = 50, offset = 0 } = req.query;

    const where: any = { userId: req.user!.userId };
    
    if (questionId) {
      where.questionId = String(questionId);
    }
    
    if (status) {
      where.status = String(status);
    }

    const submissions = await prisma.questionSubmission.findMany({
      where,
      include: { 
        question: {
          select: {
            id: true,
            title: true,
            slug: true,
            difficulty: true,
            xpReward: true
          }
        },
        questionSubmissionResult: true 
      },
      orderBy: { createdAt: 'desc' },
      take: Number(limit),
      skip: Number(offset)
    });

    const total = await prisma.questionSubmission.count({ where });

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

// GET /questions/:questionId/my-submissions — Get all submissions for a specific question by current user
router.get('/:questionId/my-submissions', authenticate, async (req, res, next) => {
  try {
    const { questionId } = req.params;

    const submissions = await prisma.questionSubmission.findMany({
      where: {
        userId: req.user!.userId,
        questionId: questionId
      },
      include: {
        questionSubmissionResult: true
      },
      orderBy: { createdAt: 'desc' }
    });

    sendSuccess({ res, data: submissions });
  } catch (err) {
    next(err);
  }
});

// GET /questions/:questionId/stats — Get question statistics (acceptance rate, submission count, etc.)
router.get('/:questionId/stats', async (req, res, next) => {
  try {
    const { questionId } = req.params;

    const totalSubmissions = await prisma.questionSubmission.count({
      where: { questionId }
    });

    const acceptedSubmissions = await prisma.questionSubmission.count({
      where: { questionId, status: 'accepted' }
    });

    const uniqueUsers = await prisma.questionSubmission.findMany({
      where: { questionId },
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
