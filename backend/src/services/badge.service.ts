/**
 * Badge Service
 * Handles badge awarding logic for achievements
 */

import { prisma } from '../config/prisma';
import { logger } from '../utils/logger';

export interface BadgeConfig {
  type: string;
  name: string;
  description: string;
  iconUrl: string;
  metadata?: any;
}

// Badge Type Definitions
export const BADGE_TYPES = {
  // Topic Completion Badges
  TOPIC_COMPLETION: 'topic_completion',
  
  // System Completion Badges
  CODING_ARENA_COMPLETE: 'coding_arena_complete',
  TCS_NQT_COMPLETE: 'tcs_nqt_complete',
  APTITUDE_COMPLETE: 'aptitude_complete',
  
  // Milestone Badges
  FIRST_SOLVE: 'first_solve',
  TEN_PROBLEMS: '10_problems',
  FIFTY_PROBLEMS: '50_problems',
  HUNDRED_PROBLEMS: '100_problems',
  
  // XP Milestones
  XP_100: 'xp_100',
  XP_500: 'xp_500',
  XP_1000: 'xp_1000',
  XP_5000: 'xp_5000',
  
  // Streak Milestones
  STREAK_3: 'streak_3',
  STREAK_7: 'streak_7',
  STREAK_30: 'streak_30',
  STREAK_100: 'streak_100',
  
  // Difficulty Milestones
  EASY_MASTER: 'easy_master',
  MEDIUM_MASTER: 'medium_master',
  HARD_HERO: 'hard_hero',
};

// Badge Configurations
const BADGE_CONFIGS: Record<string, Omit<BadgeConfig, 'metadata'>> = {
  // Topic Completion
  [BADGE_TYPES.TOPIC_COMPLETION]: {
    type: BADGE_TYPES.TOPIC_COMPLETION,
    name: 'Topic Master',
    description: 'Completed all problems in a topic',
    iconUrl: '/badges/topic-master.png',
  },
  
  // System Completion
  [BADGE_TYPES.CODING_ARENA_COMPLETE]: {
    type: BADGE_TYPES.CODING_ARENA_COMPLETE,
    name: 'Coding Arena Champion',
    description: 'Completed all Coding Arena problems',
    iconUrl: '/badges/arena-champion.png',
  },
  [BADGE_TYPES.TCS_NQT_COMPLETE]: {
    type: BADGE_TYPES.TCS_NQT_COMPLETE,
    name: 'TCS NQT Pro',
    description: 'Completed all TCS NQT questions',
    iconUrl: '/badges/tcs-pro.png',
  },
  [BADGE_TYPES.APTITUDE_COMPLETE]: {
    type: BADGE_TYPES.APTITUDE_COMPLETE,
    name: 'Aptitude Expert',
    description: 'Completed all Aptitude tests',
    iconUrl: '/badges/aptitude-expert.png',
  },
  
  // Problem Count Milestones
  [BADGE_TYPES.FIRST_SOLVE]: {
    type: BADGE_TYPES.FIRST_SOLVE,
    name: 'First Steps',
    description: 'Solved your first problem',
    iconUrl: '/badges/first-solve.png',
  },
  [BADGE_TYPES.TEN_PROBLEMS]: {
    type: BADGE_TYPES.TEN_PROBLEMS,
    name: '10 Club',
    description: 'Solved 10 problems',
    iconUrl: '/badges/10-club.png',
  },
  [BADGE_TYPES.FIFTY_PROBLEMS]: {
    type: BADGE_TYPES.FIFTY_PROBLEMS,
    name: '50 Club',
    description: 'Solved 50 problems',
    iconUrl: '/badges/50-club.png',
  },
  [BADGE_TYPES.HUNDRED_PROBLEMS]: {
    type: BADGE_TYPES.HUNDRED_PROBLEMS,
    name: '100 Club',
    description: 'Solved 100 problems',
    iconUrl: '/badges/100-club.png',
  },
  
  // XP Milestones
  [BADGE_TYPES.XP_100]: {
    type: BADGE_TYPES.XP_100,
    name: 'XP Beginner',
    description: 'Earned 100 XP',
    iconUrl: '/badges/xp-100.png',
  },
  [BADGE_TYPES.XP_500]: {
    type: BADGE_TYPES.XP_500,
    name: 'XP Hunter',
    description: 'Earned 500 XP',
    iconUrl: '/badges/xp-500.png',
  },
  [BADGE_TYPES.XP_1000]: {
    type: BADGE_TYPES.XP_1000,
    name: 'XP Master',
    description: 'Earned 1000 XP',
    iconUrl: '/badges/xp-1000.png',
  },
  [BADGE_TYPES.XP_5000]: {
    type: BADGE_TYPES.XP_5000,
    name: 'XP Legend',
    description: 'Earned 5000 XP',
    iconUrl: '/badges/xp-5000.png',
  },
  
  // Streak Milestones
  [BADGE_TYPES.STREAK_3]: {
    type: BADGE_TYPES.STREAK_3,
    name: '3-Day Warrior',
    description: 'Maintained a 3-day streak',
    iconUrl: '/badges/streak-3.png',
  },
  [BADGE_TYPES.STREAK_7]: {
    type: BADGE_TYPES.STREAK_7,
    name: '7-Day Warrior',
    description: 'Maintained a 7-day streak',
    iconUrl: '/badges/streak-7.png',
  },
  [BADGE_TYPES.STREAK_30]: {
    type: BADGE_TYPES.STREAK_30,
    name: '30-Day Champion',
    description: 'Maintained a 30-day streak',
    iconUrl: '/badges/streak-30.png',
  },
  [BADGE_TYPES.STREAK_100]: {
    type: BADGE_TYPES.STREAK_100,
    name: '100-Day Legend',
    description: 'Maintained a 100-day streak',
    iconUrl: '/badges/streak-100.png',
  },
  
  // Difficulty Milestones
  [BADGE_TYPES.EASY_MASTER]: {
    type: BADGE_TYPES.EASY_MASTER,
    name: 'Easy Explorer',
    description: 'Solved 20 easy problems',
    iconUrl: '/badges/easy-master.png',
  },
  [BADGE_TYPES.MEDIUM_MASTER]: {
    type: BADGE_TYPES.MEDIUM_MASTER,
    name: 'Medium Master',
    description: 'Solved 20 medium problems',
    iconUrl: '/badges/medium-master.png',
  },
  [BADGE_TYPES.HARD_HERO]: {
    type: BADGE_TYPES.HARD_HERO,
    name: 'Hard Hero',
    description: 'Solved 10 hard problems',
    iconUrl: '/badges/hard-hero.png',
  },
};

class BadgeService {
  /**
   * Award a badge to a user if they don't already have it
   */
  async awardBadge(
    userId: string,
    badgeType: string,
    metadata?: any
  ): Promise<boolean> {
    try {
      // Check if user already has this badge
      const existingBadge = await prisma.badge.findFirst({
        where: {
          userId,
          badgeType,
        },
      });

      if (existingBadge) {
        return false; // Already has badge
      }

      // Get badge configuration
      const config = BADGE_CONFIGS[badgeType];
      if (!config) {
        logger.warn(`Badge type ${badgeType} not found in configurations`);
        return false;
      }

      // Create badge with custom name if provided in metadata
      await prisma.badge.create({
        data: {
          userId,
          badgeType: config.type,
          name: metadata?.name || config.name,
          description: metadata?.description || config.description,
          iconUrl: config.iconUrl,
          metadata: metadata || {},
        },
      });

      logger.info(`Badge awarded: ${config.name} to user ${userId}`);
      return true;
    } catch (error) {
      logger.error('Error awarding badge:', error);
      return false;
    }
  }

  /**
   * Check and award milestone badges after a submission
   */
  async checkMilestoneBadges(userId: string): Promise<void> {
    try {
      // Get user's student profile
      const profile = await prisma.studentProfile.findUnique({
        where: { userId },
      });

      if (!profile) return;

      // Count successful submissions
      const successfulSubmissions = await prisma.problemSubmission.count({
        where: {
          userId,
          status: 'accepted',
        },
      });

      // Check problem count milestones
      if (successfulSubmissions === 1) {
        await this.awardBadge(userId, BADGE_TYPES.FIRST_SOLVE);
      } else if (successfulSubmissions === 10) {
        await this.awardBadge(userId, BADGE_TYPES.TEN_PROBLEMS);
      } else if (successfulSubmissions === 50) {
        await this.awardBadge(userId, BADGE_TYPES.FIFTY_PROBLEMS);
      } else if (successfulSubmissions === 100) {
        await this.awardBadge(userId, BADGE_TYPES.HUNDRED_PROBLEMS);
      }

      // Check XP milestones
      const xp = profile.totalXP;
      if (xp >= 100) await this.awardBadge(userId, BADGE_TYPES.XP_100);
      if (xp >= 500) await this.awardBadge(userId, BADGE_TYPES.XP_500);
      if (xp >= 1000) await this.awardBadge(userId, BADGE_TYPES.XP_1000);
      if (xp >= 5000) await this.awardBadge(userId, BADGE_TYPES.XP_5000);

      // Check streak milestones
      const streak = profile.streak;
      if (streak >= 3) await this.awardBadge(userId, BADGE_TYPES.STREAK_3);
      if (streak >= 7) await this.awardBadge(userId, BADGE_TYPES.STREAK_7);
      if (streak >= 30) await this.awardBadge(userId, BADGE_TYPES.STREAK_30);
      if (streak >= 100) await this.awardBadge(userId, BADGE_TYPES.STREAK_100);

      // Check difficulty milestones
      await this.checkDifficultyBadges(userId);
    } catch (error) {
      logger.error('Error checking milestone badges:', error);
    }
  }

  /**
   * Check difficulty-based badges
   */
  private async checkDifficultyBadges(userId: string): Promise<void> {
    // Count by difficulty
    const easyCount = await prisma.problemSubmission.count({
      where: {
        userId,
        status: 'accepted',
        problem: { difficulty: 'easy' },
      },
    });

    const mediumCount = await prisma.problemSubmission.count({
      where: {
        userId,
        status: 'accepted',
        problem: { difficulty: 'medium' },
      },
    });

    const hardCount = await prisma.problemSubmission.count({
      where: {
        userId,
        status: 'accepted',
        problem: { difficulty: 'hard' },
      },
    });

    if (easyCount >= 20) {
      await this.awardBadge(userId, BADGE_TYPES.EASY_MASTER);
    }
    if (mediumCount >= 20) {
      await this.awardBadge(userId, BADGE_TYPES.MEDIUM_MASTER);
    }
    if (hardCount >= 10) {
      await this.awardBadge(userId, BADGE_TYPES.HARD_HERO);
    }
  }

  /**
   * Check and award topic completion badge
   */
  async checkTopicCompletionBadge(
    userId: string,
    topic: string,
    system: 'coding-arena' | 'tcs-nqt' | 'aptitude'
  ): Promise<void> {
    try {
      // Count total problems in this topic
      let totalProblems = 0;
      
      if (system === 'coding-arena') {
        totalProblems = await prisma.problem.count({
          where: { topics: { contains: topic } },
        });
      }
      // Add other systems as needed

      if (totalProblems === 0) return;

      // Count user's solved problems in this topic
      const solvedCount = await prisma.problemSubmission.count({
        where: {
          userId,
          status: 'accepted',
          problem: { topics: { contains: topic } },
        },
        distinct: ['problemId'],
      });

      // If completed all problems in topic, award badge
      if (solvedCount >= totalProblems) {
        await this.awardBadge(userId, BADGE_TYPES.TOPIC_COMPLETION, {
          name: `${topic} Master`,
          description: `Completed all ${topic} problems`,
          topic,
          system,
        });
      }
    } catch (error) {
      logger.error('Error checking topic completion badge:', error);
    }
  }

  /**
   * Get all badges for a user
   */
  async getUserBadges(userId: string) {
    return await prisma.badge.findMany({
      where: { userId },
      orderBy: { unlockedAt: 'desc' },
    });
  }

  /**
   * Get badge statistics
   */
  async getBadgeStats(userId: string) {
    const badges = await this.getUserBadges(userId);
    
    const byType = {
      topic_completion: badges.filter(b => b.badgeType === BADGE_TYPES.TOPIC_COMPLETION).length,
      milestones: badges.filter(b => 
        b.badgeType.includes('problems') || 
        b.badgeType === BADGE_TYPES.FIRST_SOLVE
      ).length,
      xp: badges.filter(b => b.badgeType.startsWith('xp_')).length,
      streak: badges.filter(b => b.badgeType.startsWith('streak_')).length,
      difficulty: badges.filter(b => 
        b.badgeType.includes('easy') || 
        b.badgeType.includes('medium') || 
        b.badgeType.includes('hard')
      ).length,
    };

    return {
      total: badges.length,
      byType,
      badges,
    };
  }
}

export const badgeService = new BadgeService();
