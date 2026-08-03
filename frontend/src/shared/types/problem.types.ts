/**
 * Problem Type Definitions
 */

export type Difficulty = 'easy' | 'medium' | 'hard';

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
  createdAt: string;
  updatedAt: string;
}

export interface TestCase {
  id: string;
  problemId: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  createdAt: string;
}

export interface ProblemWithTestCases extends Problem {
  testCases: TestCase[];
}

export interface ProblemFilters {
  difficulty?: Difficulty;
  topics?: string;
  search?: string;
}
