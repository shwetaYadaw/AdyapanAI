/**
 * Problem Domain Models
 */

export interface Problem {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: Difficulty;
  topics: string;
  constraints?: string;
  hints?: string;
  timeLimit: number;
  memoryLimit: number;
  createdAt: Date;
  updatedAt: Date;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface CreateProblemDTO {
  title: string;
  slug: string;
  description: string;
  difficulty: Difficulty;
  topics: string;
  constraints?: string;
  hints?: string;
  timeLimit?: number;
  memoryLimit?: number;
}

export interface UpdateProblemDTO {
  title?: string;
  description?: string;
  difficulty?: Difficulty;
  topics?: string;
  constraints?: string;
  hints?: string;
  timeLimit?: number;
  memoryLimit?: number;
}

export interface TestCase {
  id: string;
  problemId: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  createdAt: Date;
}

export interface CreateTestCaseDTO {
  problemId: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface ProblemWithTestCases extends Problem {
  testCases: TestCase[];
}
