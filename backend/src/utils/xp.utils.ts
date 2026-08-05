import { prisma } from '../config/prisma';
import { logger } from './logger';

/**
 * Award XP to a student and update their streak
 */
export async function awardXP(userId: string, xpAmount: number): Promise<void> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const profile = await prisma.studentProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      // Create profile if it doesn't exist
      await prisma.studentProfile.create({
        data: {
          userId,
          xp: xpAmount,
          totalXP: xpAmount,
          streak: 1,
          lastActiveDate: today,
        },
      });
      logger.info(`[XP] Created profile and awarded ${xpAmount} XP to user ${userId}`);
      return;
    }

    // Calculate streak
    let newStreak = profile.streak;
    const lastActive = profile.lastActiveDate;

    if (lastActive) {
      const lastActiveDay = new Date(lastActive);
      lastActiveDay.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((today.getTime() - lastActiveDay.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        // Same day — streak unchanged
      } else if (diffDays === 1) {
        // Consecutive day — increment streak
        newStreak = profile.streak + 1;
      } else {
        // Streak broken — reset to 1
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    // Update XP, totalXP, and streak
    await prisma.studentProfile.update({
      where: { userId },
      data: {
        xp: { increment: xpAmount },
        totalXP: { increment: xpAmount },
        streak: newStreak,
        lastActiveDate: today,
      },
    });

    logger.info(`[XP] Awarded ${xpAmount} XP to user ${userId} | Streak: ${newStreak}`);
  } catch (err: any) {
    logger.warn(`[XP] Could not award XP to user ${userId}: ${err.message}`);
  }
}
