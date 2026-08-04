import { prisma } from '../config/prisma';
import { Problem, CreateProblemDTO, UpdateProblemDTO, ProblemWithTestCases, TestCase, CreateTestCaseDTO } from '../models/problem.model';

export class ProblemRepository {
  async findById(id: string): Promise<Problem | null> {
    return await prisma.problem.findUnique({ where: { id } }) as Problem | null;
  }

  async findByIdWithTestCases(id: string): Promise<ProblemWithTestCases | null> {
    return await prisma.problem.findUnique({
      where: { id },
      include: { testCases: true },
    }) as ProblemWithTestCases | null;
  }

  async findBySlug(slug: string): Promise<Problem | null> {
    return await prisma.problem.findUnique({ where: { slug } }) as Problem | null;
  }

  async findAll(filters?: { difficulty?: string; topics?: string; limit?: number; offset?: number }): Promise<Problem[]> {
    return await prisma.problem.findMany({
      where: {
        difficulty: filters?.difficulty,
        topics: filters?.topics ? { contains: filters.topics, mode: 'insensitive' } : undefined,
        isArchived: false,
      },
      take: filters?.limit,
      skip: filters?.offset,
      orderBy: [{ topics: 'asc' }, { difficulty: 'asc' }, { title: 'asc' }],
    }) as Problem[];
  }

  async create(data: CreateProblemDTO): Promise<Problem> {
    return await prisma.problem.create({
      data: {
        title: data.title,
        slug: data.slug,
        difficulty: data.difficulty,
        statement: data.statement,
        constraints: data.constraints,
        inputFormat: data.inputFormat,
        outputFormat: data.outputFormat,
        topics: data.topics,
        companies: data.companies || '',
        timeLimit: data.timeLimit || 2000,
        memoryLimit: data.memoryLimit || 256,
        starterCode: data.starterCode || {},
        referenceSolution: data.referenceSolution || '',
      },
    }) as Problem;
  }

  async update(id: string, data: UpdateProblemDTO): Promise<Problem> {
    return await prisma.problem.update({ where: { id }, data }) as Problem;
  }

  async delete(id: string): Promise<void> {
    await prisma.problemTestCase.deleteMany({ where: { problemId: id } });
    await prisma.problem.delete({ where: { id } });
  }

  async count(filters?: { difficulty?: string; topics?: string }): Promise<number> {
    return await prisma.problem.count({
      where: {
        difficulty: filters?.difficulty,
        topics: filters?.topics ? { contains: filters.topics, mode: 'insensitive' } : undefined,
        isArchived: false,
      },
    });
  }

  async createTestCase(data: CreateTestCaseDTO): Promise<TestCase> {
    return await prisma.problemTestCase.create({ data }) as TestCase;
  }

  async getTestCases(problemId: string, includeHidden = false): Promise<TestCase[]> {
    return await prisma.problemTestCase.findMany({
      where: { problemId, ...(includeHidden ? {} : { isHidden: false }) },
      orderBy: { order: 'asc' },
    }) as TestCase[];
  }

  async deleteTestCase(id: string): Promise<void> {
    await prisma.problemTestCase.delete({ where: { id } });
  }

  async getByTopic(topic: string): Promise<Problem[]> {
    return await prisma.problem.findMany({
      where: { topics: { contains: topic, mode: 'insensitive' }, isArchived: false },
      orderBy: { title: 'asc' },
    }) as Problem[];
  }
}

export const problemRepository = new ProblemRepository();
