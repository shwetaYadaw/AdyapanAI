// @ts-nocheck
import { prisma } from '../config/prisma';
import { StudentProfile } from '../models/user.model';

export class StudentRepository {
  async findByUserId(userId: string): Promise<StudentProfile | null> {
    return await prisma.studentProfile.findUnique({ where: { userId } }) as StudentProfile | null;
  }

  async create(userId: string): Promise<StudentProfile> {
    return await prisma.studentProfile.create({
      data: { userId, xp: 0, totalXP: 0, level: 1, streak: 0 },
    }) as StudentProfile;
  }

  async updateXP(userId: string, xpToAdd: number): Promise<StudentProfile> {
    const profile = await this.findByUserId(userId);
    const current = profile?.totalXP ?? 0;
    return await prisma.studentProfile.update({
      where: { userId },
      data: { xp: current + xpToAdd, totalXP: current + xpToAdd },
    }) as StudentProfile;
  }

  async updateStreak(userId: string, newStreak: number): Promise<StudentProfile> {
    return await prisma.studentProfile.update({
      where: { userId },
      data: { streak: newStreak, lastActiveDate: new Date() },
    }) as StudentProfile;
  }

  async getLeaderboard(limit = 10) {
    return await prisma.studentProfile.findMany({
      take: limit,
      orderBy: { totalXP: 'desc' },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } },
      },
    });
  }

  async getUserStats(userId: string) {
    const profile = await prisma.studentProfile.findUnique({ where: { userId } });

    const [totalProblems, easyCount, mediumCount, hardCount] = await Promise.all([
      prisma.problemSubmission.count({ where: { userId, status: 'accepted' }, distinct: ['problemId'] }),
      prisma.problemSubmission.count({ where: { userId, status: 'accepted', problem: { difficulty: 'easy' } }, distinct: ['problemId'] }),
      prisma.problemSubmission.count({ where: { userId, status: 'accepted', problem: { difficulty: 'medium' } }, distinct: ['problemId'] }),
      prisma.problemSubmission.count({ where: { userId, status: 'accepted', problem: { difficulty: 'hard' } }, distinct: ['problemId'] }),
    ]);

    return {
      profile,
      problemsSolved: { total: totalProblems, easy: easyCount, medium: mediumCount, hard: hardCount },
    };
  }
}

export const studentRepository = new StudentRepository();
