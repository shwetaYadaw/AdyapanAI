/**
 * Student Controller
 * Handles HTTP requests for student profiles and stats
 */

import { Request, Response, NextFunction } from 'express';
import { studentRepository } from '../repositories/student.repository';
import { badgeService } from '../services/badge.service';
import { sendSuccess } from '../utils/response.utils';
import { AppError } from '../middleware/errorHandler.middleware';

export class StudentController {
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;

      const profile = await studentRepository.findByUserId(userId);

      if (!profile) {
        throw new AppError('Student profile not found', 404);
      }

      sendSuccess({ res, data: profile });
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;

      const stats = await studentRepository.getUserStats(userId);

      sendSuccess({ res, data: stats });
    } catch (error) {
      next(error);
    }
  }

  async getBadges(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;

      const badges = await badgeService.getUserBadges(userId);

      sendSuccess({ res, data: badges });
    } catch (error) {
      next(error);
    }
  }

  async getBadgeStats(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;

      const badgeStats = await badgeService.getBadgeStats(userId);

      sendSuccess({ res, data: badgeStats });
    } catch (error) {
      next(error);
    }
  }

  async getLeaderboard(req: Request, res: Response, next: NextFunction) {
    try {
      const { limit = 10 } = req.query;

      const leaderboard = await studentRepository.getLeaderboard(Number(limit));

      sendSuccess({ res, data: leaderboard });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { xpToAdd, streakUpdate } = req.body;

      let profile = await studentRepository.findByUserId(userId);

      if (!profile) {
        // Create profile if it doesn't exist
        profile = await studentRepository.create(userId);
      }

      if (xpToAdd) {
        profile = await studentRepository.updateXP(userId, xpToAdd);
      }

      if (streakUpdate !== undefined) {
        profile = await studentRepository.updateStreak(userId, streakUpdate);
      }

      sendSuccess({
        res,
        message: 'Profile updated successfully',
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const studentController = new StudentController();
