/**
 * Submission Controller
 * Handles HTTP requests for submissions
 */

import { Request, Response, NextFunction } from 'express';
import { submissionRepository } from '../repositories/submission.repository';
import { problemRepository } from '../repositories/problem.repository';
import { queueService } from '../services/queue.service';
import { JudgeService } from '../services/judge.service';
import { badgeService } from '../services/badge.service';
import { sendSuccess } from '../utils/response.utils';
import { AppError } from '../middleware/errorHandler.middleware';

const judge = new JudgeService();

export class SubmissionController {
  /**
   * Run code against sample test cases only
   */
  async runCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, language } = req.body;
      const { problemId } = req.params;

      const problem = await problemRepository.findByIdWithTestCases(problemId);

      if (!problem) {
        throw new AppError('Problem not found', 404);
      }

      const sampleTestCase = problem.testCases.find((tc) => !tc.isHidden);
      if (!sampleTestCase) {
        throw new AppError('No sample test case found for this problem', 400);
      }

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
    } catch (error) {
      next(error);
    }
  }

  /**
   * Submit solution for judging
   */
  async submit(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, language } = req.body;
      const { problemId } = req.params;
      const userId = req.user!.userId;

      const problem = await problemRepository.findById(problemId);

      if (!problem) {
        throw new AppError('Problem not found', 404);
      }

      // Create submission record
      const submission = await submissionRepository.create({
        userId,
        problemId,
        code,
        language,
      });

      // Enqueue for background processing
      await queueService.enqueue({
        submissionId: submission.id,
        problemId: problem.id,
        code,
        language,
        type: 'problem',
      });

      sendSuccess({
        res,
        message: 'Submission enqueued successfully',
        data: { submissionId: submission.id, status: 'pending', type: 'problem' },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get submission status and result
   */
  async getSubmission(req: Request, res: Response, next: NextFunction) {
    try {
      const { submissionId } = req.params;

      const submission = await submissionRepository.findById(submissionId);

      if (!submission) {
        throw new AppError('Submission not found', 404);
      }

      // Check ownership
      if (submission.userId !== req.user!.userId && req.user!.role !== 'admin') {
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
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user's submission history
   */
  async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { problemId, status, limit = 50, offset = 0 } = req.query;
      const userId = req.user!.userId;

      const submissions = await submissionRepository.findByUser(userId, {
        problemId: problemId as string,
        status: status as string,
        limit: Number(limit),
        offset: Number(offset),
      });

      const total = await submissionRepository.countByUser(userId, {
        status: status as string,
      });

      sendSuccess({
        res,
        data: {
          submissions,
          pagination: {
            total,
            limit: Number(limit),
            offset: Number(offset),
            hasMore: total > Number(offset) + Number(limit),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all submissions for a specific problem
   */
  async getProblemSubmissions(req: Request, res: Response, next: NextFunction) {
    try {
      const { problemId } = req.params;
      const userId = req.user!.userId;

      const submissions = await submissionRepository.findByUser(userId, {
        problemId,
      });

      sendSuccess({ res, data: submissions });
    } catch (error) {
      next(error);
    }
  }
}

export const submissionController = new SubmissionController();
