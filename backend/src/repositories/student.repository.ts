/**
 * Student Repository
 * Handles all database operations for student profiles
 */

import { prisma } from '../config/prisma';
import { StudentProfile } from '../models/user.model';

export class StudentRepository {
  async findByUserId(userId: string): Promise<StudentProfile | null> {
    return await prisma.studentProfile.findUnique({
      where: { userId },
    });
  }

  async create(userId: string): Promise<StudentProfile> {
    return await prisma.studentProfile.create({
      data: {
        userId,
        totalXP: 0,
        streak: 0,
      },
    });
  }

  async updateXP(userId: string, xpToAdd: number): Promise<StudentProfile> {
    const profile = await this.findByUserId(userId);
    
    return await prisma.studentProfile.update({
      where: { userId },
      data: {
        totalXP: (profile?.totalXP || 0) + xpToAdd,
      },
    });
  }

  async updateStreak(userId: string, newStreak: number): Promise<StudentProfile> {
    return await prisma.studentProfile.update({
      where: { userId },
      data: {
        streak: newStreak,
        lastActivityDate: new Date(),
      },
    });
  }

  async getLeaderboard(limit: number = 10): Promise<StudentProfile[]> {
    return await prisma.studentProfile.findMany({
      take: limit,
      orderBy: { totalXP: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async getUserStats(userId: string) {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId },
    });

    const totalProblems = await prisma.problemSubmission.count({
      where: { userId, status: 'accepted' },
      distinct: ['problemId'],
    });

    const easyCount = await prisma.problemSubmission.count({
      where: {
        userId,
        status: 'accepted',
        problem: { difficulty: 'easy' },
      },
      distinct: ['problemId'],
    });

    const mediumCount = await prisma.problemSubmission.count({
      where: {
        userId,
        status: 'accepted',
        problem: { difficulty: 'medium' },
      },
      distinct: ['problemId'],
    });

    const hardCount = await prisma.problemSubmission.count({
      where: {
        userId,
        status: 'accepted',
        problem: { difficulty: 'hard' },
      },
      distinct: ['problemId'],
    });

    return {
      profile,
      problemsSolved: {
        total: totalProblems,
        easy: easyCount,
        medium: mediumCount,
        hard: hardCount,
      },
    };
  }
}

export const studentRepository = new StudentRepository();
