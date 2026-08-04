/**
 * Problem Domain Models — aligned with Prisma schema
 */

export interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
  statement: string;
  constraints: string;
  inputFormat: string;
  outputFormat: string;
  timeLimit: number;
  memoryLimit: number;
  starterCode: any;
  referenceSolution: string;
  topics: string;
  companies: string;
  tags: string;
  category: string;
  successRate: number;
  totalAttempts: number;
  totalAccepted: number;
  isArchived: boolean;
  createdBy?: string | null;
  updatedBy?: string | null;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface CreateProblemDTO {
  title: string;
  slug: string;
  difficulty: Difficulty;
  statement: string;
  constraints: string;
  inputFormat: string;
  outputFormat: string;
  topics: string;
  companies?: string;
  timeLimit?: number;
  memoryLimit?: number;
  starterCode?: any;
  referenceSolution?: string;
}

export interface UpdateProblemDTO {
  title?: string;
  difficulty?: Difficulty;
  statement?: string;
  constraints?: string;
  inputFormat?: string;
  outputFormat?: string;
  topics?: string;
  companies?: string;
  timeLimit?: number;
  memoryLimit?: number;
}

export interface TestCase {
  id: string;
  problemId: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  type: string;
  explanation?: string | null;
  order: number;
  createdAt: Date;
}

export interface CreateTestCaseDTO {
  problemId: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  type?: string;
}

export interface ProblemWithTestCases extends Problem {
  testCases: TestCase[];
}
