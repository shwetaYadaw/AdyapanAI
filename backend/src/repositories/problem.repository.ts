/**
 * Problem Repository
 * Handles all database operations for problems
 */

import { prisma } from '../config/prisma';
import {
  Problem,
  CreateProblemDTO,
  UpdateProblemDTO,
  ProblemWithTestCases,
  TestCase,
  CreateTestCaseDTO,
} from '../models/problem.model';

export class ProblemRepository {
  async findById(id: string): Promise<Problem | null> {
    return await prisma.problem.findUnique({
      where: { id },
    });
  }

  async findByIdWithTestCases(id: string): Promise<ProblemWithTestCases | null> {
    return await prisma.problem.findUnique({
      where: { id },
      include: {
        testCases: true,
      },
    });
  }

  async findBySlug(slug: string): Promise<Problem | null> {
    return await prisma.problem.findUnique({
      where: { slug },
    });
  }

  async findAll(filters?: {
    difficulty?: string;
    topics?: string;
    limit?: number;
    offset?: number;
  }): Promise<Problem[]> {
    return await prisma.problem.findMany({
      where: {
        difficulty: filters?.difficulty,
        topics: filters?.topics ? { contains: filters.topics } : undefined,
      },
      take: filters?.limit,
      skip: filters?.offset,
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: CreateProblemDTO): Promise<Problem> {
    return await prisma.problem.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        difficulty: data.difficulty,
        topics: data.topics,
        constraints: data.constraints,
        hints: data.hints,
        timeLimit: data.timeLimit || 2000,
        memoryLimit: data.memoryLimit || 256,
      },
    });
  }

  async update(id: string, data: UpdateProblemDTO): Promise<Problem> {
    return await prisma.problem.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    // Delete related test cases first
    await prisma.testCase.deleteMany({
      where: { problemId: id },
    });
    
    await prisma.problem.delete({
      where: { id },
    });
  }

  async count(filters?: { difficulty?: string; topics?: string }): Promise<number> {
    return await prisma.problem.count({
      where: {
        difficulty: filters?.difficulty,
        topics: filters?.topics ? { contains: filters.topics } : undefined,
      },
    });
  }

  // Test Case operations
  async createTestCase(data: CreateTestCaseDTO): Promise<TestCase> {
    return await prisma.testCase.create({
      data,
    });
  }

  async getTestCases(problemId: string, includeHidden: boolean = false): Promise<TestCase[]> {
    return await prisma.testCase.findMany({
      where: {
        problemId,
        ...(includeHidden ? {} : { isHidden: false }),
      },
    });
  }

  async deleteTestCase(id: string): Promise<void> {
    await prisma.testCase.delete({
      where: { id },
    });
  }

  async getByTopic(topic: string): Promise<Problem[]> {
    return await prisma.problem.findMany({
      where: {
        topics: { contains: topic },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const problemRepository = new ProblemRepository();
