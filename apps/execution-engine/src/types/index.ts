export type Language = 'cpp' | 'java' | 'python' | 'javascript';

export type ExecutionMode = 'run' | 'submit';

export type Verdict =
  | 'accepted'
  | 'wrong_answer'
  | 'compilation_error'
  | 'runtime_error'
  | 'time_limit_exceeded'
  | 'memory_limit_exceeded'
  | 'output_limit_exceeded';

export interface ExecutionRequest {
  code: string;
  language: Language;
  input?: string;
  timeLimit?: number; // milliseconds
  memoryLimit?: number; // MB
}

export interface TestCase {
  input: string;
  expectedOutput?: string;
}

export interface SubmissionRequest {
  code: string;
  language: Language;
  testCases: TestCase[];
  timeLimit?: number;
  memoryLimit?: number;
}

export interface ExecutionResult {
  output: string;
  stderr: string;
  exitCode: number;
  runtime: number; // milliseconds
  memory: number; // MB
  verdict: Verdict;
  compilationLog?: string;
  signal?: string;
}

export interface TestCaseResult {
  input: string;
  expectedOutput?: string;
  actualOutput: string;
  passed: boolean;
  runtime: number;
  memory: number;
  verdict: Verdict;
  errorMessage?: string;
}

export interface SubmissionResult {
  verdict: Verdict;
  passedCount: number;
  totalCount: number;
  runtime: number; // max runtime across all test cases
  memory: number; // max memory across all test cases
  testCaseResults: TestCaseResult[];
  compilationLog?: string;
  errorMessage?: string;
}

export interface DockerExecutionOptions {
  image: string;
  cmd: string[];
  workDir: string;
  timeout: number;
  memory: string;
  cpuLimit: number;
  networkDisabled: boolean;
  readOnly: boolean;
  binds?: string[];
}

export interface LanguageConfig {
  image: string;
  compileCommand?: (filename: string) => string[];
  runCommand: (filename: string, compiled?: string) => string[];
  fileExtension: string;
  needsCompilation: boolean;
  timeout: number;
}
