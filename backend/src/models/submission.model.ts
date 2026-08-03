/**
 * Submission Domain Models
 */

export interface ProblemSubmission {
  id: string;
  userId: string;
  problemId: string;
  code: string;
  language: string;
  status: SubmissionStatus;
  runtime?: number;
  passedCount: number;
  totalCount: number;
  errorMessage?: string;
  createdAt: Date;
}

export type SubmissionStatus = 
  | 'pending' 
  | 'accepted' 
  | 'wrong_answer' 
  | 'compile_error' 
  | 'runtime_error' 
  | 'time_limit_exceeded'
  | 'memory_limit_exceeded';

export interface CreateSubmissionDTO {
  userId: string;
  problemId: string;
  code: string;
  language: string;
}

export interface SubmissionResult {
  id: string;
  problemSubmissionId: string;
  status: SubmissionStatus;
  totalCount: number;
  passedCount: number;
  failedCount: number;
  score: number;
  errorMessage?: string;
  createdAt: Date;
}

export interface TestCaseResult {
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  runtime?: number;
  errorMessage?: string;
}

export interface SubmissionWithResults extends ProblemSubmission {
  problemSubmissionResult?: SubmissionResult;
  problem: {
    id: string;
    title: string;
    slug: string;
    difficulty: string;
  };
}
