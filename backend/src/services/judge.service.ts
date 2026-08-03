import { DockerService } from './docker.service';
import { LANGUAGE_CONFIGS } from '../config/languages';
import { logger } from '../utils/logger';

export class JudgeService {
  private dockerService: DockerService;

  constructor() {
    this.dockerService = new DockerService();
  }

  async runTestCase(
    code: string,
    language: string,
    input: string,
    expectedOutput: string | undefined,
    timeLimitMs = 5000
  ): Promise<{
    passed: boolean;
    actualOutput: string;
    runtime: number;
    errorType?: 'compile_error' | 'runtime_error' | 'time_limit_exceeded';
    errorMessage?: string;
  }> {
    const lang = language.toLowerCase();
    const languageConfig = LANGUAGE_CONFIGS.find(
      (config) => config.id === lang || config.name.toLowerCase() === lang
    );

    if (!languageConfig) {
      return {
        passed: false,
        actualOutput: '',
        runtime: 0,
        errorType: 'compile_error',
        errorMessage: `Unsupported language: ${language}`,
      };
    }

    try {
      // Convert timeLimitMs to seconds for Docker service
      const timeLimitSeconds = Math.max(1, Math.ceil(timeLimitMs / 1000));

      const result = await this.dockerService.executeCode(
        code,
        languageConfig,
        input,
        expectedOutput,
        timeLimitSeconds,
        languageConfig.memoryLimit
      );

      logger.debug(`[DOCKER] Verdict: ${result.verdict}, Runtime: ${result.runtime}ms`);

      if (result.verdict === 'AC') {
        return {
          passed: true,
          actualOutput: result.output,
          runtime: result.runtime,
        };
      }

      if (result.verdict === 'WA') {
        return {
          passed: false,
          actualOutput: result.output,
          runtime: result.runtime,
          errorType: undefined,
          errorMessage: 'Wrong Answer',
        };
      }

      if (result.verdict === 'TLE') {
        return {
          passed: false,
          actualOutput: result.output,
          runtime: result.runtime,
          errorType: 'time_limit_exceeded',
          errorMessage: `Time Limit Exceeded: Execution took longer than ${timeLimitMs}ms`,
        };
      }

      if (result.verdict === 'CE') {
        return {
          passed: false,
          actualOutput: '',
          runtime: 0,
          errorType: 'compile_error',
          errorMessage: result.error || 'Compilation Error',
        };
      }

      // Runtime errors (RE, MLE)
      return {
        passed: false,
        actualOutput: result.output,
        runtime: result.runtime,
        errorType: 'runtime_error',
        errorMessage: result.error || 'Runtime Error',
      };

    } catch (err: any) {
      logger.error('Docker execution error:', err.message || err);
      return {
        passed: false,
        actualOutput: '',
        runtime: 0,
        errorType: 'runtime_error',
        errorMessage: err.message || 'Internal execution error',
      };
    }
  }
}
