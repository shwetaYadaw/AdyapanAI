/**
 * Submission Type Definitions
 */

export type SubmissionStatus = 
  | 'pending' 
  | 'accepted' 
  | 'wrong_answer' 
  | 'compile_error' 
  | 'runtime_error' 
  | 'time_limit_exceeded'
  | 'memory_limit_exceeded';

export interface Submission {
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
  createdAt: string;
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
  createdAt: string;
}

export interface SubmissionWithDetails extends Submission {
  problem: {
    id: string;
    title: string;
    slug: string;
    difficulty: string;
  };
  problemSubmissionResult?: SubmissionResult;
  verdict: string;
}

export interface RunCodeRequest {
  code: string;
  language: string;
}

export interface RunCodeResponse {
  passed: boolean;
  actualOutput: string;
  expectedOutput: string;
  input: string;
  runtime?: number;
  errorMessage?: string;
}
