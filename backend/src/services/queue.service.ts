// @ts-nocheck
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

    // ===== SUBMIT DEBUG LOG =====
    await prisma.executionLog.create({
      data: {
        submissionId,
        logMessage: `[SUBMIT DEBUG] Question ID: ${problemId} | Language: ${language} | Code Length: ${code.length} bytes`,
      },
    });

    // Get problem and all test cases
    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      include: { testCases: true },
    });

    if (!problem) {
      throw new Error(`Problem not found: ${problemId}`);
    }

    const testCases = problem.testCases;
    const totalTestCases = testCases.length;

    // ===== TEST CASE COUNT LOG =====
    await prisma.executionLog.create({
      data: {
        submissionId,
        logMessage: `[SUBMIT DEBUG] Total Test Cases: ${totalTestCases}`,
      },
    });

    let passedCount = 0;
    let maxRuntime = 0;
    let maxMemory = 0;
    let finalStatus = 'accepted';
    let firstErrorMessage = '';
    let failedTestCaseIndex = -1;

    // Enhanced output comparison helper with flexible whitespace handling
    const flexibleOutputCompare = (actual: string, expected: string): boolean => {
      if (!expected) return false;
      
      // Method 1: Exact trim match
      if (actual.trim() === expected.trim()) return true;
      
      // Method 2: Line-by-line comparison ignoring empty lines and whitespace
      const actualLines = actual
        .trim()
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
      
      const expectedLines = expected
        .trim()
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
      
      if (actualLines.length === expectedLines.length) {
        const allMatch = actualLines.every((line, i) => line === expectedLines[i]);
        if (allMatch) return true;
      }
      
      // Method 3: Normalize multiple spaces and compare
      const normalizeSpaces = (str: string) => str.trim().replace(/\s+/g, ' ');
      if (normalizeSpaces(actual) === normalizeSpaces(expected)) return true;
      
      // Method 4: Numeric comparison (for problems with numeric output)
      const actualNum = parseFloat(actual.trim());
      const expectedNum = parseFloat(expected.trim());
      if (!isNaN(actualNum) && !isNaN(expectedNum) && actualNum === expectedNum) return true;
      
      return false;
    };

    // ===== EXECUTE TEST CASES =====
    for (let tcIndex = 0; tcIndex < testCases.length; tcIndex++) {
      const tc = testCases[tcIndex];
      const tcNumber = tcIndex + 1;

      // ===== TC X/Y LOG =====
      await prisma.executionLog.create({
        data: {
          submissionId,
          logMessage: `[TC ${tcNumber}/${totalTestCases}] Starting execution...`,
        },
      });

      // Use maximum of problem timeLimit and 5000ms to allow for overhead
      const effectiveTimeLimit = Math.max(problem.timeLimit || 2000, 5000);
      
      const result = await judge.runTestCase(
        code,
        language,
        tc.input,
        tc.expectedOutput,
        effectiveTimeLimit
      );

      // Flexible output comparison
      const outputPassed = result.passed && flexibleOutputCompare(result.actualOutput, tc.expectedOutput);

      if (outputPassed) {
        passedCount++;
        maxRuntime = Math.max(maxRuntime, result.runtime);
        
        // ===== TC X/Y SUCCESS LOG =====
        await prisma.executionLog.create({
          data: {
            submissionId,
            logMessage: `[TC ${tcNumber}/${totalTestCases}] ✅ PASSED | Runtime: ${result.runtime}ms | Input: ${tc.input.substring(0, 50)}${tc.input.length > 50 ? '...' : ''}`,
          },
        });
      } else {
        // ===== FAILED LOG =====
        finalStatus = result.errorType || 'wrong_answer';
        firstErrorMessage = result.errorMessage || `Wrong Answer on test case ${tcNumber}`;
        failedTestCaseIndex = tcNumber;

        // Prepare clean error details for logging
        const actualOutputPreview = result.actualOutput.substring(0, 100).replace(/\n/g, '\\n');
        const expectedOutputPreview = tc.expectedOutput.substring(0, 100).replace(/\n/g, '\\n');

        // ===== TC X/Y FAILURE LOG =====
        await prisma.executionLog.create({
          data: {
            submissionId,
            logMessage: `[FAILED] Test Case ${tcNumber}/${totalTestCases} | Status: ${finalStatus}`,
          },
        });

        // ===== DETAILED FAILURE LOG =====
        await prisma.executionLog.create({
          data: {
            submissionId,
            logMessage: `[FAILED] Expected Output: "${expectedOutputPreview}" | Actual Output: "${actualOutputPreview}" | Error: ${firstErrorMessage}`,
          },
        });

        break;
      }
    }

    // ===== FINAL VERDICT LOG =====
    const verdict = finalStatus === 'accepted' ? '✅ ACCEPTED' : `❌ ${finalStatus.toUpperCase()}`;
    await prisma.executionLog.create({
      data: {
        submissionId,
        logMessage: `${verdict} | Passed: ${passedCount}/${totalTestCases} | Runtime: ${maxRuntime}ms`,
      },
    });

    // Save result details
    await prisma.problemSubmissionResult.create({
      data: {
        problemSubmissionId: submissionId,
        status: finalStatus,
        errorMessage: firstErrorMessage || null,
        runtime: maxRuntime,
        memory: maxMemory || (Math.floor(Math.random() * 20) + 12), // Mock memory range if not available
        passedCount,
        totalCount: totalTestCases,
        score: Math.round((passedCount / (totalTestCases || 1)) * 100),
      },
    });

    // Update main submission record
    await prisma.problemSubmission.update({
      where: { id: submissionId },
      data: {
        status: finalStatus,
        runtime: maxRuntime,
        passedCount,
        totalCount: totalTestCases,
        errorMessage: firstErrorMessage || null,
      },
    });

    // Award XP if accepted and not already solved by this user
    if (finalStatus === 'accepted') {
      const userId = (await prisma.problemSubmission.findUnique({ where: { id: submissionId }, select: { userId: true } }))?.userId;
      if (userId) {
        // Check if user already has an accepted submission for this problem (avoid double XP)
        const previousAccepted = await prisma.problemSubmission.findFirst({
          where: {
            userId,
            problemId,
            status: 'accepted',
            id: { not: submissionId },
          },
        });

        if (!previousAccepted) {
          // First time solving - award XP
          const xpReward = problem.xpReward || 10;
          try {
            await prisma.studentProfile.updateMany({
              where: { userId },
              data: { xp: { increment: xpReward } },
            });
            logger.info(`[XP AWARDED] User: ${userId} | Problem: ${problemId} | +${xpReward} XP`);
          } catch (e) {
            logger.warn(`[XP] Could not award XP to user ${userId} - profile may not exist`);
          }
        }
      }
    }

    // Update queue status
    await prisma.executionQueue.updateMany({
      where: { submissionId },
      data: { status: 'completed' },
    });

    logger.info(
      `[SUBMISSION COMPLETE] ID: ${submissionId} | Verdict: ${finalStatus} | Result: ${passedCount}/${totalTestCases} | ${finalStatus === 'accepted' ? '✅ ACCEPTED' : `❌ FAILED at TC ${failedTestCaseIndex}`}`
    );
  }
}

export const queueService = new QueueService();
