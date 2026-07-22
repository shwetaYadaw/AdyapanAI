import { prisma } from '../config/prisma';
import { JudgeService } from './judge.service';
import { logger } from '../utils/logger';

const judge = new JudgeService();

interface QueueTask {
  submissionId: string;
  problemId: string;
  code: string;
  language: string;
}

class QueueService {
  private queue: QueueTask[] = [];
  private processing = false;

  async enqueue(task: QueueTask) {
    this.queue.push(task);
    await prisma.executionQueue.create({
      data: {
        submissionId: task.submissionId,
        status: 'queued',
      },
    });
    this.processNext();
  }

  private async processNext() {
    if (this.processing || this.queue.length === 0) return;
    this.processing = true;

    const task = this.queue.shift()!;
    try {
      await prisma.executionQueue.updateMany({
        where: { submissionId: task.submissionId, status: 'queued' },
        data: { status: 'processing' },
      });

      await this.processSubmission(task);
    } catch (err: any) {
      logger.error(`Error processing queued submission ${task.submissionId}:`, err);
      await prisma.executionQueue.updateMany({
        where: { submissionId: task.submissionId },
        data: { status: 'failed' },
      });
    } finally {
      this.processing = false;
      this.processNext();
    }
  }

  private async processSubmission(task: QueueTask) {
    const { submissionId, problemId, code, language } = task;

    // Get problem and all test cases
    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      include: { testCases: true },
    });

    if (!problem) {
      throw new Error(`Problem not found: ${problemId}`);
    }

    const testCases = problem.testCases;
    let passedCount = 0;
    let maxRuntime = 0;
    let finalStatus = 'accepted';
    let firstErrorMessage = '';

    // Output comparison helper that ignores trailing spaces, blank lines, and trims output
    const cleanOutputCompare = (actual: string, expected: string): boolean => {
      const formatLines = (str: string) =>
        str
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line.length > 0)
          .join('\n');
      return formatLines(actual) === formatLines(expected);
    };

    for (const tc of testCases) {
      // Log execution step
      await prisma.executionLog.create({
        data: {
          submissionId,
          logMessage: `Running testcase ID ${tc.id} (${tc.type})`,
        },
      });

      const result = await judge.runTestCase(
        code,
        language,
        tc.input,
        tc.expectedOutput,
        problem.timeLimit
      );

      // Secure comparison override
      const outputPassed = result.passed && cleanOutputCompare(result.actualOutput, tc.expectedOutput);

      if (outputPassed) {
        passedCount++;
        maxRuntime = Math.max(maxRuntime, result.runtime);
      } else {
        finalStatus = result.errorType || 'wrong_answer';
        firstErrorMessage = result.errorMessage || `Wrong Answer on testcase ${passedCount + 1}`;
        await prisma.executionLog.create({
          data: {
            submissionId,
            logMessage: `Failed testcase ID ${tc.id}. Expected: "${tc.expectedOutput}", Got: "${result.actualOutput}". Error: ${firstErrorMessage}`,
          },
        });
        break;
      }
    }

    // Save result details
    await prisma.submissionResult.create({
      data: {
        submissionId,
        status: finalStatus,
        errorMessage: firstErrorMessage || null,
        runtime: maxRuntime,
        memory: Math.floor(Math.random() * 20) + 12, // Mock memory range
        passedCount,
        totalCount: testCases.length,
        score: Math.round((passedCount / (testCases.length || 1)) * 100),
      },
    });

    // Update main submission record
    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: finalStatus,
        runtime: maxRuntime,
        passedCount,
        totalCount: testCases.length,
        errorMessage: firstErrorMessage || null,
      },
    });

    // Update queue status
    await prisma.executionQueue.updateMany({
      where: { submissionId },
      data: { status: 'completed' },
    });

    logger.info(`Submission ${submissionId} finished execution with verdict: ${finalStatus}`);
  }
}

export const queueService = new QueueService();
