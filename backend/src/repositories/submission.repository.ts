import { prisma } from '../config/prisma';
import { ProblemSubmission, CreateSubmissionDTO, SubmissionStatus, SubmissionWithResults } from '../models/submission.model';

export class SubmissionRepository {
  async findById(id: string): Promise<SubmissionWithResults | null> {
    const result = await prisma.problemSubmission.findUnique({
      where: { id },
      include: {
        problemSubmissionResult: true,
        problem: { select: { id: true, title: true, slug: true, difficulty: true } },
      },
    });
    return result as SubmissionWithResults | null;
  }

  async create(data: CreateSubmissionDTO): Promise<ProblemSubmission> {
    return await prisma.problemSubmission.create({
      data: { userId: data.userId, problemId: data.problemId, code: data.code, language: data.language, status: 'pending' },
    }) as ProblemSubmission;
  }

  async updateStatus(id: string, status: SubmissionStatus, data?: { runtime?: number; passedCount?: number; totalCount?: number; errorMessage?: string }): Promise<ProblemSubmission> {
    return await prisma.problemSubmission.update({
      where: { id },
      data: { status, ...data },
    }) as ProblemSubmission;
  }

  async findByUser(userId: string, filters?: { problemId?: string; status?: string; limit?: number; offset?: number }): Promise<SubmissionWithResults[]> {
    const results = await prisma.problemSubmission.findMany({
      where: { userId, problemId: filters?.problemId, status: filters?.status },
      include: {
        problem: { select: { id: true, title: true, slug: true, difficulty: true } },
        problemSubmissionResult: true,
      },
      orderBy: { createdAt: 'desc' },
      take: filters?.limit,
      skip: filters?.offset,
    });
    return results as SubmissionWithResults[];
  }

  async findByProblem(problemId: string): Promise<ProblemSubmission[]> {
    return await prisma.problemSubmission.findMany({
      where: { problemId },
      orderBy: { createdAt: 'desc' },
    }) as ProblemSubmission[];
  }

  async countByUser(userId: string, filters?: { status?: string }): Promise<number> {
    return await prisma.problemSubmission.count({ where: { userId, status: filters?.status } });
  }

  async countAcceptedByUser(userId: string): Promise<number> {
    return await prisma.problemSubmission.count({ where: { userId, status: 'accepted' } });
  }

  async countByProblem(problemId: string, filters?: { status?: string }): Promise<number> {
    return await prisma.problemSubmission.count({ where: { problemId, status: filters?.status } });
  }

  async getUniqueSolvers(problemId: string): Promise<string[]> {
    const submissions = await prisma.problemSubmission.findMany({
      where: { problemId, status: 'accepted' },
      select: { userId: true },
      distinct: ['userId'],
    });
    return submissions.map(s => s.userId);
  }

  async createSubmissionResult(data: { problemSubmissionId: string; status: SubmissionStatus; totalCount: number; passedCount: number; score: number; runtime?: number; memory?: number; errorMessage?: string }) {
    return await prisma.problemSubmissionResult.create({
      data: {
        problemSubmissionId: data.problemSubmissionId,
        status: data.status,
        totalCount: data.totalCount,
        passedCount: data.passedCount,
        score: data.score,
        runtime: data.runtime ?? 0,
        memory: data.memory ?? 0,
        errorMessage: data.errorMessage,
      },
    });
  }
}

export const submissionRepository = new SubmissionRepository();
