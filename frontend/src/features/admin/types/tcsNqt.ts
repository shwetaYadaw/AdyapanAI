export interface TestCase {
  input: string;
  output: string;
  isHidden: boolean;
  explanation?: string;
}

export interface TcsQuestion {
  id?: string;
  slug?: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  statement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  referenceSolution: string;
  topic?: string;
  companies?: string;
  experienceLevel?: 'freshers' | 'experienced';
  testCases?: TestCase[];
  timeLimit?: number;
  memoryLimit?: number;
  xpReward?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TcsQuestionResponse {
  questions: TcsQuestion[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
