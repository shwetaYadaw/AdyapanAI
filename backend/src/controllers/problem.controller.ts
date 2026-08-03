/**
 * Problem Controller
 * Handles HTTP requests for problems
 */

import { Request, Response, NextFunction } from 'express';
import { problemRepository } from '../repositories/problem.repository';
import { sendSuccess } from '../utils/response.utils';
import { AppError } from '../middleware/errorHandler.middleware';

export class ProblemController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { difficulty, topics, limit = 50, offset = 0 } = req.query;

      const problems = await problemRepository.findAll({
        difficulty: difficulty as string,
        topics: topics as string,
        limit: Number(limit),
        offset: Number(offset),
      });

      const total = await problemRepository.count({
        difficulty: difficulty as string,
        topics: topics as string,
      });

      sendSuccess({
        res,
        data: {
          problems,
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

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const problem = await problemRepository.findByIdWithTestCases(id);

      if (!problem) {
        throw new AppError('Problem not found', 404);
      }

      // Filter test cases - only show visible ones to students
      const isAdmin = req.user?.role === 'admin';
      const filteredProblem = {
        ...problem,
        testCases: isAdmin ? problem.testCases : problem.testCases.filter((tc) => !tc.isHidden),
      };

      sendSuccess({ res, data: filteredProblem });
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;

      const problem = await problemRepository.findBySlug(slug);

      if (!problem) {
        throw new AppError('Problem not found', 404);
      }

      sendSuccess({ res, data: problem });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const problemData = req.body;

      const problem = await problemRepository.create(problemData);

      sendSuccess({
        res,
        message: 'Problem created successfully',
        data: problem,
        statusCode: 201,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const problem = await problemRepository.update(id, updateData);

      sendSuccess({
        res,
        message: 'Problem updated successfully',
        data: problem,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await problemRepository.delete(id);

      sendSuccess({
        res,
        message: 'Problem deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const totalSubmissions = await problemRepository.count();
      // Add more stats logic here

      sendSuccess({
        res,
        data: {
          totalSubmissions,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const problemController = new ProblemController();
