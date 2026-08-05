// @ts-nocheck
import { Router } from 'express';
import { prisma } from '../config/prisma';
import { authenticate } from '../middleware/auth.middleware';
import { JudgeService } from '../services/judge.service';
import { sendSuccess } from '../utils/response.utils';
import { AppError } from '../middleware/errorHandler.middleware';
import { logger } from '../utils/logger';

const router = Router();
const judge = new JudgeService();

// Helper to detect hardcoding outputs
function detectHardcoding(code: string, expectedOutputs: string[]): boolean {
  const normalizedCode = code.replace(/\s+/g, '');
  for (const out of expectedOutputs) {
    const cleanOut = String(out).trim();
    if (!cleanOut || cleanOut.length === 0) continue;
    const patterns = [
      `print("${cleanOut}")`, `print('${cleanOut}')`, `print(${cleanOut})`,
      `console.log("${cleanOut}")`, `console.log('${cleanOut}')`, `console.log(${cleanOut})`,
      `System.out.println("${cleanOut}")`, `System.out.println(${cleanOut})`,
      `cout<<"${cleanOut}"`, `cout<<${cleanOut}`,
    ];
    if (patterns.some(p => normalizedCode.includes(p))) return true;
  }
  return false;
}

// POST /question-submissions/:questionId/run — Run code with custom input
router.post('/:questionId/run', authenticate, async (req, res, next) => {
  try {
    const { code, language, input } = req.body;
    const { questionId } = req.params;

    if (!code || !language) throw new AppError('Code and language are required', 400);

    const question = await prisma.tcsNqtQuestion.findUnique({
      where: { id: questionId },
    });

    if (!question) throw new AppError('Question not found', 404);

    // Parse testCases JSON
    const testCases = Array.isArray(question.testCases) ? question.testCases : [];
    const sampleTestCase = testCases.find((tc: any) => !tc.isHidden);

    // Use provided input, or fall back to sample test case input
    const inputToUse = input || (sampleTestCase ? sampleTestCase.input : '');
    if (!inputToUse) throw new AppError('No input provided', 400);

    const expectedOutput = sampleTestCase?.expectedOutput || sampleTestCase?.output;

    const result = await judge.runTestCase(
      code,
      language,
      inputToUse,
      expectedOutput,
      question.timeLimit || 5000
    );

    sendSuccess({
      res,
      data: {
        passed: expectedOutput ? result.passed : true,
        actualOutput: result.actualOutput,
        expectedOutput: expectedOutput || null,
        input: inputToUse,
        runtime: result.runtime,
        errorMessage: result.errorMessage,
      },
    });
  } catch (err) { next(err); }
});

// POST /question-submissions/:questionId/submit — Submit and judge solution
router.post('/:questionId/submit', authenticate, async (req, res, next) => {
  try {
    const { code, language, input } = req.body;
    const { questionId } = req.params;

    if (!code || !language) throw new AppError('Code and language are required', 400);

    const question = await prisma.tcsNqtQuestion.findUnique({
      where: { id: questionId },
    });

    if (!question) throw new AppError('Question not found', 404);

    // Parse testCases JSON
    const testCases: any[] = Array.isArray(question.testCases) ? question.testCases : [];

    if (testCases.length > 0) {
      // Anti-cheat check
      const visibleOutputs = testCases.filter((tc: any) => !tc.isHidden).map((tc: any) => tc.expectedOutput || tc.output);
      if (detectHardcoding(code, visibleOutputs)) {
        const submission = await prisma.questionSubmission.create({
          data: { userId: req.user!.userId, questionId: question.id, code, language, status: 'wrong_answer', errorMessage: 'Cheat Detected', totalCount: testCases.length },
        });
        return sendSuccess({ res, data: { submissionId: submission.id, status: 'wrong_answer', errorMessage: 'Cheat Detected' } });
      }

      // Run all test cases synchronously
      let passedCount = 0;
      let maxRuntime = 0;
      let finalStatus = 'accepted';
      let firstError = '';

      for (let i = 0; i < testCases.length; i++) {
        const tc = testCases[i];
        const expected = tc.expectedOutput || tc.output;
        const result = await judge.runTestCase(code, language, tc.input, expected, question.timeLimit || 5000);

        if (result.passed) {
          passedCount++;
          maxRuntime = Math.max(maxRuntime, result.runtime);
        } else {
          finalStatus = result.errorType || 'wrong_answer';
          firstError = result.errorMessage || `Wrong Answer on test case ${i + 1}`;
          break;
        }
      }

      // Save submission
      const submission = await prisma.questionSubmission.create({
        data: {
          userId: req.user!.userId,
          questionId: question.id,
          code,
          language,
          status: finalStatus,
          runtime: maxRuntime,
          passedCount,
          totalCount: testCases.length,
          errorMessage: firstError || null,
        },
      });

      // Award XP on first accepted submission
      let xpAwarded = 0;
      if (finalStatus === 'accepted') {
        const previousAccepted = await prisma.questionSubmission.findFirst({
          where: { userId: req.user!.userId, questionId: question.id, status: 'accepted', id: { not: submission.id } },
        });
        if (!previousAccepted) {
          xpAwarded = question.xpReward || 10;
          try {
            await prisma.studentProfile.updateMany({ where: { userId: req.user!.userId }, data: { xp: { increment: xpAwarded } } });
          } catch (e) { /* profile may not exist for admin */ }
        }
      }

      sendSuccess({
        res,
        data: {
          submissionId: submission.id,
          status: finalStatus,
          passedCount,
          totalCount: testCases.length,
          runtime: maxRuntime,
          errorMessage: firstError || null,
          xpAwarded,
        },
      });
    } else {
      // No test cases: just run the code and accept if no errors
      const customInput = input || '';
      const result = await judge.runTestCase(code, language, customInput, undefined, question.timeLimit || 5000);
      const status = result.errorMessage ? 'runtime_error' : 'accepted';

      const submission = await prisma.questionSubmission.create({
        data: {
          userId: req.user!.userId,
          questionId: question.id,
          code,
          language,
          status,
          runtime: result.runtime,
          passedCount: status === 'accepted' ? 1 : 0,
          totalCount: 1,
          errorMessage: result.errorMessage || null,
        },
      });

      let xpAwarded = 0;
      if (status === 'accepted') {
        const prev = await prisma.questionSubmission.findFirst({
          where: { userId: req.user!.userId, questionId: question.id, status: 'accepted', id: { not: submission.id } },
        });
        if (!prev) {
          xpAwarded = question.xpReward || 10;
          try {
            await prisma.studentProfile.updateMany({ where: { userId: req.user!.userId }, data: { xp: { increment: xpAwarded } } });
          } catch (e) { /* ignore */ }
        }
      }

      sendSuccess({
        res,
        data: {
          submissionId: submission.id,
          status,
          actualOutput: result.actualOutput,
          runtime: result.runtime,
          passedCount: status === 'accepted' ? 1 : 0,
          totalCount: 1,
          errorMessage: result.errorMessage,
          xpAwarded,
        },
      });
    }
  } catch (err) { next(err); }
});

export default router;
