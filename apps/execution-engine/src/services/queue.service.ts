import Bull, { Queue, Job } from 'bull';
import { redis } from '../config/redis';
import { logger } from '../config/logger';
import { JudgeService, TestCase, ExecutionOptions } from './judge.service';
import axios from 'axios';
import { env } from '../config/env';

export interface SubmissionJob {
  submissionId: string;
  code: string;
  language: string;
  testCases: TestCase[];
  timeLimit?: number;
  memoryLimit?: number;
  callbackUrl?: string;
  executionMode?: 'fullProgram' | 'function';
  functionSignature?: any;
}

export class QueueService {
  private queue: Queue<SubmissionJob>;
  private judgeService: JudgeService;

  constructor() {
    this.judgeService = new JudgeService();
    
    this.queue = new Bull<SubmissionJob>('execution-queue', {
      redis: {
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
        password: env.REDIS_PASSWORD || undefined,
      },
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: 100,
        removeOnFail: 100,
      },
    });

    this.setupProcessors();
    this.setupEventListeners();
  }

  /**
   * Setup queue processors
   */
  private setupProcessors(): void {
    // Process submission jobs
    this.queue.process('judge-submission', 5, async (job: Job<SubmissionJob>) => {
      logger.info(`Processing submission: ${job.data.submissionId}`);
      
      try {
        const executionOptions: ExecutionOptions = {
          executionMode: job.data.executionMode,
          functionSignature: job.data.functionSignature,
        };

        const result = await this.judgeService.judgeSubmission(
          job.data.code,
          job.data.language,
          job.data.testCases,
          job.data.timeLimit,
          job.data.memoryLimit,
          executionOptions
        );

        // Send result back to backend
        await this.sendResultToBackend(job.data.submissionId, result);

        // Execute callback if provided
        if (job.data.callbackUrl) {
          await this.executeCallback(job.data.callbackUrl, {
            submissionId: job.data.submissionId,
            result,
          });
        }

        logger.info(`Submission ${job.data.submissionId} completed: ${result.verdict}`);
        
        return result;
      } catch (error: any) {
        logger.error(`Submission ${job.data.submissionId} failed:`, error);
        
        // Notify backend about the failure
        await this.sendResultToBackend(job.data.submissionId, {
          verdict: 'RE',
          totalTests: job.data.testCases.length,
          passedTests: 0,
          failedTests: job.data.testCases.length,
          runtime: 0,
          memory: 0,
          testResults: [],
          compilationError: error.message || 'Internal server error',
        });

        throw error;
      }
    });
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    this.queue.on('completed', (job, result) => {
      logger.info(`Job ${job.id} completed with verdict: ${result.verdict}`);
    });

    this.queue.on('failed', (job, err) => {
      logger.error(`Job ${job?.id} failed:`, err);
    });

    this.queue.on('error', (error) => {
      logger.error('Queue error:', error);
    });

    this.queue.on('stalled', (job) => {
      logger.warn(`Job ${job.id} stalled`);
    });
  }

  /**
   * Add submission to queue
   */
  async enqueueSubmission(submission: SubmissionJob): Promise<string> {
    const job = await this.queue.add('judge-submission', submission, {
      priority: 1,
      jobId: submission.submissionId,
    });

    logger.info(`Enqueued submission: ${submission.submissionId}, job ID: ${job.id}`);
    
    return job.id?.toString() || submission.submissionId;
  }

  /**
   * Get job status
   */
  async getJobStatus(jobId: string): Promise<any> {
    const job = await this.queue.getJob(jobId);
    
    if (!job) {
      return { status: 'not_found' };
    }

    const state = await job.getState();
    const progress = job.progress();
    const result = job.returnvalue;

    return {
      id: job.id,
      status: state,
      progress,
      result,
      attemptsMade: job.attemptsMade,
      failedReason: job.failedReason,
      finishedOn: job.finishedOn,
      processedOn: job.processedOn,
    };
  }

  /**
   * Send result to backend API
   */
  private async sendResultToBackend(submissionId: string, result: any): Promise<void> {
    try {
      await axios.post(
        `${env.BACKEND_API_URL}/api/submissions/${submissionId}/result`,
        {
          submissionId,
          status: result.verdict === 'AC' ? 'accepted' : 
                  result.verdict === 'WA' ? 'wrong_answer' :
                  result.verdict === 'TLE' ? 'time_limit_exceeded' :
                  result.verdict === 'MLE' ? 'memory_limit_exceeded' :
                  result.verdict === 'CE' ? 'compile_error' : 'runtime_error',
          runtime: result.runtime,
          memory: result.memory,
          passedCount: result.passedTests,
          totalCount: result.totalTests,
          errorMessage: result.compilationError || (result.failedTests > 0 ? `Failed ${result.failedTests} test(s)` : undefined),
          testResults: result.testResults,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': env.BACKEND_API_KEY,
          },
          timeout: 10000,
        }
      );

      logger.info(`Result sent to backend for submission: ${submissionId}`);
    } catch (error: any) {
      logger.error(`Failed to send result to backend for ${submissionId}:`, error.message);
      // Don't throw - submission was processed successfully
    }
  }

  /**
   * Execute callback URL
   */
  private async executeCallback(url: string, data: any): Promise<void> {
    try {
      await axios.post(url, data, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000,
      });
      logger.info(`Callback executed: ${url}`);
    } catch (error: any) {
      logger.error(`Callback failed for ${url}:`, error.message);
    }
  }

  /**
   * Get queue statistics
   */
  async getStats(): Promise<any> {
    const counts = await this.queue.getJobCounts();
    const completed = await this.queue.getCompleted();
    const failed = await this.queue.getFailed();
    const active = await this.queue.getActive();
    const waiting = await this.queue.getWaiting();

    return {
      counts,
      jobs: {
        completed: completed.length,
        failed: failed.length,
        active: active.length,
        waiting: waiting.length,
      },
    };
  }

  /**
   * Clean up old jobs
   */
  async cleanup(): Promise<void> {
    await this.queue.clean(24 * 60 * 60 * 1000); // Clean jobs older than 24 hours
    logger.info('Queue cleanup completed');
  }

  /**
   * Close queue connection
   */
  async close(): Promise<void> {
    await this.queue.close();
    logger.info('Queue closed');
  }
}
