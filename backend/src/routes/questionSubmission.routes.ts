// @ts-nocheck
import { Router } from 'express';
import { prisma } from '../config/prisma';
import { authenticate } from '../middleware/auth.middleware';
import { JudgeService } from '../services/judge.service';
import { sendSuccess } from '../utils/response.utils';
import { AppError } from '../middleware/errorHandler.middleware';
import { awardXP } from '../utils/xp.utils';
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

// POST /question-submissions/:questionId/run — Run code against visible test cases
router.post('/:questionId/run', authenticate, async (req, res, next) => {
  try {
    const { code, language, input } = req.body;
    const { questionId } = req.params;

    if (!code || !language) throw new AppError('Code and language are required', 400);

    const question = await prisma.tcsNqtQuestion.findUnique({ where: { id: questionId } });
    if (!question) throw new AppError('Question not found', 404);

    const testCases: any[] = Array.isArray(question.testCases) ? question.testCases : [];
    const visibleTestCases = testCases.filter((tc: any) => !tc.isHidden);

    if (visibleTestCases.length > 0) {
      let allPassed = true;
      let failedAt = -1;
      let failedInput = '';
      let failedExpected = '';
      let failedActual = '';
      let totalRuntime = 0;
      let errorMsg = '';

      for (let i = 0; i < visibleTestCases.length; i++) {
        const tc = visibleTestCases[i];
        const expected = tc.expectedOutput || tc.output;
        const result = await judge.runTestCase(code, language, tc.input, expected, question.timeLimit || 5000);
        totalRuntime = Math.max(totalRuntime, result.runtime);

        if (result.errorMessage) {
          allPassed = false;
          failedAt = i + 1;
          failedInput = tc.input;
          failedExpected = expected;
          failedActual = result.actualOutput;
          errorMsg = result.errorMessage;
          break;
        }
        if (!result.passed) {
          allPassed = false;
          failedAt = i + 1;
          failedInput = tc.input;
          failedExpected = expected;
          failedActual = result.actualOutput;
          errorMsg = `Wrong Answer on Test Case ${i + 1}: Expected "${expected.trim()}" but got "${result.actualOutput.trim()}"`;
          break;
        }
      }

      sendSuccess({ res, data: {
        passed: allPassed,
        passedCount: allPassed ? visibleTestCases.length : failedAt - 1,
        totalCount: visibleTestCases.length,
        actualOutput: allPassed ? (visibleTestCases[visibleTestCases.length - 1].expectedOutput || visibleTestCases[visibleTestCases.length - 1].output) : failedActual,
        expectedOutput: allPassed ? null : failedExpected,
        input: allPassed ? visibleTestCases[0].input : failedInput,
        runtime: totalRuntime,
        errorMessage: allPassed ? null : errorMsg,
      }});
    } else {
      // No test cases — just execute with custom input
      const inputToUse = input || '';
      if (!inputToUse) throw new AppError('No input provided', 400);
      const result = await judge.runTestCase(code, language, inputToUse, undefined, question.timeLimit || 5000);
      sendSuccess({ res, data: {
        passed: !result.errorMessage,
        actualOutput: result.actualOutput,
        expectedOutput: null,
        input: inputToUse,
        runtime: result.runtime,
        errorMessage: result.errorMessage,
      }});
    }
  } catch (err) { next(err); }
});

// POST /question-submissions/:questionId/submit — Submit and judge against ALL test cases
router.post('/:questionId/submit', authenticate, async (req, res, next) => {
  try {
    const { code, language, input } = req.body;
    const { questionId } = req.params;

    if (!code || !language) throw new AppError('Code and language are required', 400);

    const question = await prisma.tcsNqtQuestion.findUnique({ where: { id: questionId } });
    if (!question) throw new AppError('Question not found', 404);

    const testCases: any[] = Array.isArray(question.testCases) ? question.testCases : [];

    if (testCases.length > 0) {
      // Anti-cheat
      const visibleOutputs = testCases.filter((tc: any) => !tc.isHidden).map((tc: any) => tc.expectedOutput || tc.output);
      if (detectHardcoding(code, visibleOutputs)) {
        const submission = await prisma.questionSubmission.create({
          data: { userId: req.user!.userId, questionId: question.id, code, language, status: 'wrong_answer', errorMessage: 'Cheat Detected', totalCount: testCases.length },
        });
        return sendSuccess({ res, data: { submissionId: submission.id, status: 'wrong_answer', errorMessage: 'Cheat Detected' } });
      }

      // Run ALL test cases
      let passedCount = 0;
      let maxRuntime = 0;
      let finalStatus = 'accepted';
      let firstError = '';

      for (let i = 0; i < testCases.length; i++) {
        const tc = testCases[i];
        const expected = tc.expectedOutput || tc.output;
        const result = await judge.runTestCase(code, language, tc.input, expected, question.timeLimit || 5000);

        if (result.errorMessage) {
          finalStatus = result.errorType || 'runtime_error';
          firstError = result.errorMessage;
          break;
        }
        if (result.passed) {
          passedCount++;
          maxRuntime = Math.max(maxRuntime, result.runtime);
        } else {
          finalStatus = 'wrong_answer';
          firstError = `Wrong Answer on Test Case ${i + 1}: Expected "${expected.trim()}" but got "${result.actualOutput.trim()}"`;
          break;
        }
      }

      // Save submission
      const submission = await prisma.questionSubmission.create({
        data: { userId: req.user!.userId, questionId: question.id, code, language, status: finalStatus, runtime: maxRuntime, passedCount, totalCount: testCases.length, errorMessage: firstError || null },
      });

      // Award XP on first accepted submission
      let xpAwarded = 0;
      if (finalStatus === 'accepted') {
        const prev = await prisma.questionSubmission.findFirst({
          where: { userId: req.user!.userId, questionId: question.id, status: 'accepted', id: { not: submission.id } },
        });
        if (!prev) {
          xpAwarded = question.xpReward || 10;
          await awardXP(req.user!.userId, xpAwarded);
        }
      }

      sendSuccess({ res, data: { submissionId: submission.id, status: finalStatus, passedCount, totalCount: testCases.length, runtime: maxRuntime, errorMessage: firstError || null, xpAwarded } });
    } else {
      // No test cases: just run and accept if no errors
      const customInput = input || '';
      const result = await judge.runTestCase(code, language, customInput, undefined, question.timeLimit || 5000);
      const status = result.errorMessage ? 'runtime_error' : 'accepted';

      const submission = await prisma.questionSubmission.create({
        data: { userId: req.user!.userId, questionId: question.id, code, language, status, runtime: result.runtime, passedCount: status === 'accepted' ? 1 : 0, totalCount: 1, errorMessage: result.errorMessage || null },
      });

      let xpAwarded = 0;
      if (status === 'accepted') {
        const prev = await prisma.questionSubmission.findFirst({
          where: { userId: req.user!.userId, questionId: question.id, status: 'accepted', id: { not: submission.id } },
        });
        if (!prev) {
          xpAwarded = question.xpReward || 10;
          await awardXP(req.user!.userId, xpAwarded);
        }
      }

      sendSuccess({ res, data: { submissionId: submission.id, status, actualOutput: result.actualOutput, runtime: result.runtime, passedCount: status === 'accepted' ? 1 : 0, totalCount: 1, errorMessage: result.errorMessage, xpAwarded } });
    }
  } catch (err) { next(err); }
});

export default router;
