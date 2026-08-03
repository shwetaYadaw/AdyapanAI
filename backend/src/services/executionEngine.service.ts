import { DockerService, ExecutionResult } from './docker.service';
import { queueService } from './queue.service';
import { getLanguageConfig } from '../config/languages';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

interface SubmissionResult {
  jobId: string;
}

/**
 * Execution Engine Service
 * Wraps Docker and Queue services for code execution
 */
class ExecutionEngineService {
  private dockerService: DockerService;

  constructor() {
    this.dockerService = new DockerService();
  }

  /**
   * Run code with custom input (for testing)
   */
  async runCode(
    code: string,
    language: string,
    input: string,
    timeLimit?: number,
    memoryLimit?: number
  ): Promise<ExecutionResult> {
    const languageConfig = getLanguageConfig(language);
    
    if (!languageConfig) {
      logger.error(`Unsupported language: ${language}`);
      return {
        output: '',
        error: `Unsupported language: ${language}`,
        exitCode: -1,
        runtime: 0,
        memory: 0,
        timeout: false,
        verdict: 'CE',
      };
    }

    try {
      logger.info(`Running code with language: ${language}`);
      
      const result = await this.dockerService.executeCode(
        code,
        languageConfig,
        input,
        undefined, // No expected output for custom run
        timeLimit,
        memoryLimit
      );

      return result;
    } catch (error: any) {
      logger.error(`Code execution failed:`, error);
      return {
        output: '',
        error: error.message || 'Execution failed',
        exitCode: -1,
        runtime: 0,
        memory: 0,
        timeout: false,
        verdict: 'RE',
      };
    }
  }

  /**
   * Submit code for judging against test cases
   */
  async submitCode(
    submissionId: string,
    code: string,
    language: string,
    testCases: TestCase[],
    timeLimit?: number,
    memoryLimit?: number
  ): Promise<SubmissionResult> {
    const jobId = uuidv4();

    logger.info(`Queueing submission ${submissionId} with job ${jobId}`);

    // Get the problem ID from the submission
    const submission = await import('../config/prisma').then(m => m.prisma.submission.findUnique({
      where: { id: submissionId },
      select: { problemId: true },
    }));

    if (!submission?.problemId) {
      throw new Error('Submission not found or missing problem ID');
    }

    // Add to queue for background processing using the singleton instance
    await queueService.enqueue({
      submissionId,
      problemId: submission.problemId,
      code,
      language,
    });

    return { jobId };
  }

  /**
   * Check if Docker images are available
   */
  async checkDockerImages(): Promise<{ available: boolean; missing: string[] }> {
    const requiredImages = [
      'adyapan/runner-cpp:latest',
      'adyapan/runner-java:latest',
      'adyapan/runner-python:latest',
      'adyapan/runner-javascript:latest',
    ];

    return await this.dockerService.checkDockerImages(requiredImages);
  }

  /**
   * Cleanup orphaned containers
   */
  async cleanupOrphanedContainers(): Promise<void> {
    await this.dockerService.cleanupOrphanedContainers();
  }
}

// Export singleton instance
export const executionEngineService = new ExecutionEngineService();



