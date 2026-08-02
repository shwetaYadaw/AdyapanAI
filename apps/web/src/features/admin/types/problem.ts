export interface ProblemTestCase {
  id?: string;
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
  explanation?: string;
  order?: number;
}

export interface ProblemSolution {
  id?: string;
  code: string;
  language: string;
  approach: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  explanation: string;
  isOptimal?: boolean;
  rating?: number;
}

export interface Problem {
  id?: string;
  title: string;
  slug?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  statement: string;
  constraints: string;
  inputFormat: string;
  outputFormat: string;
  timeLimit?: number;
  memoryLimit?: number;
  starterCode?: Record<string, string>;
  referenceSolution: string;
  topics: string;
  companies: string;
  tags?: string;
  category?: string;
  testCases?: ProblemTestCase[];
  solutions?: ProblemSolution[];
  successRate?: number;
  totalAttempts?: number;
  totalAccepted?: number;
  averageRuntime?: number;
  createdAt?: string;
  updatedAt?: string;
  isArchived?: boolean;
}

export interface ProblemVersion {
  id: string;
  versionNum: number;
  title: string;
  statement: string;
  difficulty: string;
  changes: Record<string, any>;
  changedBy?: string;
  changeReason?: string;
  createdAt: string;
}

export interface AdminProblemFilters {
  page?: number;
  limit?: number;
  search?: string;
  difficulty?: string;
  category?: string;
  tags?: string;
}

export interface AdminProblemResponse {
  problems: Problem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
