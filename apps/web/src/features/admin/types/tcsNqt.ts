export interface TcsQuestion {
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
  referenceSolution: string;
  topics?: string;
  companies?: string;
  testCases?: any[];
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
