import axios from 'axios';
import { env } from '../config/env';
import { logger } from '../utils/logger';

const EXECUTION_ENGINE_URL = process.env.EXECUTION_ENGINE_URL || 'http://localhost:8001';
const EXECUTION_ENGINE_API_KEY = process.env.EXECUTION_ENGINE_API_KEY || '';

export interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface RunCodeResult {
  output: string;
  error: string;
  runtime: number;
  memory: number;
  verdict: string;
  timeout: boolean;
}

export interface JudgeResult {
  verdict: 'AC' | 'WA' | 'TLE' | 'MLE' | 'RE' | 'CE';
  totalTests: number;
  passedTests: number;
  failedTests: number;
  runtime: number;
  memory: number;
  testResults: any[];
  compilationError?: string;
}

export class ExecutionEngineService {
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = EXECUTION_ENGINE_URL;
    this.apiKey = EXECUTION_ENGINE_API_KEY;
  }

  /**
   * Run code with custom input (synchronous)
   */
  async runCode(
    code: string,
    language: string,
    input: string,
    timeLimit?: number,
    memoryLimit?: number
  ): Promise<RunCodeResult> {
    try {
      const response = await axios.post(
        `${this.baseURL}/api/execute/run`,
        {
          code,
          language,
          input,
          timeLimit,
          memoryLimit,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': this.apiKey,
          },
          timeout: 30000, // 30 seconds
        }
      );

      return response.data.data;
    } catch (error: any) {
      logger.error('Execution Engine run code error:', error.message);
      throw new Error(error.response?.data?.message || 'Failed to execute code');
    }
  }

  /**
   * Submit code for async judging
   */
  async submitCode(
    submissionId: string,
    code: string,
    language: string,
    testCases: TestCase[],
    timeLimit?: number,
    memoryLimit?: number
  ): Promise<{ submissionId: string; jobId: string; status: string }> {
    try {
      const response = await axios.post(
        `${this.baseURL}/api/execute/submit`,
        {
          submissionId,
          code,
          language,
          testCases,
          timeLimit,
          memoryLimit,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': this.apiKey,
          },
          timeout: 10000,
        }
      );

      return response.data.data;
    } catch (error: any) {
      logger.error('Execution Engine submit code error:', error.message);
      throw new Error(error.response?.data?.message || 'Failed to submit code');
    }
  }

  /**
   * Judge code synchronously (wait for result)
   */
  async judgeCode(
    code: string,
    language: string,
    testCases: TestCase[],
    timeLimit?: number,
    memoryLimit?: number
  ): Promise<JudgeResult> {
    try {
      const response = await axios.post(
        `${this.baseURL}/api/execute/judge`,
        {
          code,
          language,
          testCases,
          timeLimit,
          memoryLimit,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': this.apiKey,
          },
          timeout: 60000, // 60 seconds for multiple test cases
        }
      );

      return response.data.data;
    } catch (error: any) {
      logger.error('Execution Engine judge code error:', error.message);
      throw new Error(error.response?.data?.message || 'Failed to judge code');
    }
  }

  /**
   * Get submission status
   */
  async getSubmissionStatus(jobId: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.baseURL}/api/execute/status/${jobId}`,
        {
          headers: {
            'X-API-Key': this.apiKey,
          },
          timeout: 5000,
        }
      );

      return response.data.data;
    } catch (error: any) {
      logger.error('Execution Engine get status error:', error.message);
      throw new Error(error.response?.data?.message || 'Failed to get submission status');
    }
  }

  /**
   * Get supported languages
   */
  async getSupportedLanguages(): Promise<string[]> {
    try {
      const response = await axios.get(
        `${this.baseURL}/api/execute/languages`,
        {
          headers: {
            'X-API-Key': this.apiKey,
          },
          timeout: 5000,
        }
      );

      return response.data.data.languages;
    } catch (error: any) {
      logger.error('Execution Engine get languages error:', error.message);
      return ['cpp', 'java', 'python', 'javascript'];
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseURL}/health`, {
        timeout: 3000,
      });
      return response.data.success === true;
    } catch (error) {
      logger.warn('Execution Engine health check failed');
      return false;
    }
  }
}

// Singleton instance
export const executionEngineService = new ExecutionEngineService();
