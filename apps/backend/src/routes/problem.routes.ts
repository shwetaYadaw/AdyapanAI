import { Router } from 'express';
import { prisma } from '../config/prisma';
import { authenticate } from '../middleware/auth.middleware';
import { JudgeService } from '../services/judge.service';
import { testCaseGeneratorService } from '../services/testCaseGenerator.service';
import { queueService } from '../services/queue.service';
import { sendSuccess } from '../utils/response.utils';
import { AppError } from '../middleware/errorHandler.middleware';

const router = Router();
const judge = new JudgeService();

// Helper to detect hardcoding outputs
function detectHardcoding(code: string, expectedOutputs: string[]): boolean {
  const normalizedCode = code.replace(/\s+/g, '');
  for (const out of expectedOutputs) {
    const cleanOut = String(out).trim();
    if (!cleanOut || cleanOut.length === 0) continue;
    const patterns = [
      `return"${cleanOut}"`,
      `return'${cleanOut}'`,
      `return\`${cleanOut}\``,
      `return${cleanOut}`,
      `print("${cleanOut}")`,
      `print('${cleanOut}')`,
      `print(${cleanOut})`,
      `console.log("${cleanOut}")`,
      `console.log('${cleanOut}')`,
      `console.log(${cleanOut})`,
      `System.out.println("${cleanOut}")`,
      `System.out.println('${cleanOut}')`,
      `System.out.println(${cleanOut})`,
      `cout<<"${cleanOut}"`,
      `cout<<${cleanOut}`
    ];
    if (patterns.some(p => normalizedCode.includes(p))) {
      return true;
    }
  }
  return false;
}

// POST /problems — Create a new problem with test cases (uses Trusted Reference Solution to auto-generate expected outputs)
router.post('/', authenticate, async (req, res, next) => {
  try {
    const {
      title,
      slug,
      difficulty,
      statement,
      constraints,
      inputFormat,
      outputFormat,
      timeLimit,
      memoryLimit,
      starterCode,
      referenceSolution,
      topics,
      companies,
      testCases, // array of { input, expectedOutput?, isHidden, type }
    } = req.body;

    const resolvedTestCases: any[] = [];

    // Auto-generate expected output using Reference Solution if missing
    for (const tc of testCases) {
      let expectedOutput = tc.expectedOutput || '';
      if (!expectedOutput) {
        // Run reference solution using JavaScript/Python fallback or default executor
        const result = await judge.runTestCase(
          referenceSolution,
          'javascript', // assuming js or matching language
          tc.input,
          '1',
          timeLimit || 2000
        );
        expectedOutput = result.actualOutput;
      }
      resolvedTestCases.push({
        input: tc.input,
        expectedOutput,
        isHidden: tc.isHidden ?? true,
        type: tc.type || 'hidden',
      });
    }

    // Save to PostgreSQL/MySQL via Prisma using transaction
    const problem = await prisma.$transaction(async (tx) => {
      const p = await tx.problem.create({
        data: {
          title,
          slug,
          difficulty: difficulty || 'easy',
          statement,
          constraints,
          inputFormat,
          outputFormat,
          timeLimit: timeLimit || 2000,
          memoryLimit: memoryLimit || 256,
          starterCode,
          referenceSolution,
          topics: topics || '',
          companies: companies || '',
        },
      });

      for (const tc of resolvedTestCases) {
        await tx.problemTestCase.create({
          data: {
            problemId: p.id,
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            isHidden: tc.isHidden,
            type: tc.type,
          },
        });
      }

      return p;
    });

    sendSuccess({ res, message: 'Problem created successfully', data: problem });
  } catch (err) { next(err); }
});

// GET /problems — Get list of all problems
router.get('/', async (req, res, next) => {
  try {
    const problems = await prisma.problem.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        difficulty: true,
        topics: true,
        companies: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    sendSuccess({ res, data: problems });
  } catch (err) { next(err); }
});

// GET /problems/:id — Get details of a single problem (excluding reference solution and hidden testcases)
router.get('/:id', async (req, res, next) => {
  try {
    const problem = await prisma.problem.findUnique({
      where: { id: req.params.id },
      include: {
        testCases: {
          where: { isHidden: false }, // Only return visible sample testcases to front-end
        },
      },
    });

    if (!problem) throw new AppError('Problem not found', 404);
    
    // Omit sensitive reference solution fields before returning
    const { referenceSolution, ...safeProblem } = problem;

    sendSuccess({ res, data: safeProblem });
  } catch (err) { next(err); }
});

// POST /problems/:id/run — Execute code against ONLY visible/sample test cases
router.post('/:id/run', authenticate, async (req, res, next) => {
  try {
    const { code, language } = req.body;
    const problem = await prisma.problem.findUnique({
      where: { id: req.params.id },
      include: { testCases: { where: { isHidden: false } } },
    });

    if (!problem) throw new AppError('Problem not found', 404);

    const sampleTestCase = problem.testCases[0];
    if (!sampleTestCase) throw new AppError('No sample testcase found for this problem', 400);

    const result = await judge.runTestCase(
      code,
      language,
      sampleTestCase.input,
      sampleTestCase.expectedOutput,
      problem.timeLimit
    );

    sendSuccess({
      res,
      data: {
        passed: result.passed,
        actualOutput: result.actualOutput,
        expectedOutput: sampleTestCase.expectedOutput,
        input: sampleTestCase.input,
        runtime: result.runtime,
        errorMessage: result.errorMessage,
      },
    });
  } catch (err) { next(err); }
});

// POST /problems/:id/submit — Submit solution to the Async Queue system
router.post('/:id/submit', authenticate, async (req, res, next) => {
  try {
    const { code, language } = req.body;
    const problem = await prisma.problem.findUnique({
      where: { id: req.params.id },
      include: { testCases: true },
    });

    if (!problem) throw new AppError('Problem not found', 404);

    // Anti-cheat check: detect static hardcoding of outputs
    const visibleOutputs = problem.testCases.filter(t => !t.isHidden).map(t => t.expectedOutput);
    const expectedOutputs = Array.from(new Set(visibleOutputs));
    const isCheating = detectHardcoding(code, expectedOutputs);

    if (isCheating) {
      const submission = await prisma.submission.create({
        data: {
          userId: req.user!.userId,
          problemId: problem.id,
          code,
          language,
          status: 'wrong_answer',
          errorMessage: 'Cheat Detected: Hardcoded output values found.',
        },
      });

      await prisma.submissionResult.create({
        data: {
          submissionId: submission.id,
          status: 'wrong_answer',
          errorMessage: 'Cheat Detected: Hardcoded output values found.',
          totalCount: problem.testCases.length,
          passedCount: 0,
        },
      });

      return sendSuccess({
        res,
        message: 'Cheat detected, submission rejected.',
        data: submission,
      });
    }

    // Create pending submission record
    const submission = await prisma.submission.create({
      data: {
        userId: req.user!.userId,
        problemId: problem.id,
        code,
        language,
        status: 'pending',
      },
    });

    // Enqueue for background worker processing
    await queueService.enqueue({
      submissionId: submission.id,
      problemId: problem.id,
      code,
      language,
    });

    sendSuccess({
      res,
      message: 'Submission enqueued successfully',
      data: { submissionId: submission.id, status: 'pending' },
    });
  } catch (err) { next(err); }
});

// GET /problems/submissions/:id — Retrieve status of a queued/processed submission
router.get('/submissions/:id', authenticate, async (req, res, next) => {
  try {
    const submission = await prisma.submission.findUnique({
      where: { id: req.params.id },
      include: { result: true },
    });

    if (!submission) throw new AppError('Submission not found', 404);

    // Check if user owns this submission
    if (submission.userId !== req.user!.userId) {
      throw new AppError('Unauthorized: You can only view your own submissions', 403);
    }

    // Fetch execution logs for detailed debugging
    const executionLogs = await prisma.executionLog.findMany({
      where: { submissionId: submission.id },
      orderBy: { createdAt: 'asc' },
    });

    // Format response with comprehensive details
    const enhancedResponse = {
      id: submission.id,
      status: submission.status,
      language: submission.language,
      runtime: submission.runtime,
      passedCount: submission.passedCount,
      totalCount: submission.totalCount,
      score: submission.result?.score || 0,
      verdict:
        submission.status === 'accepted'
          ? '✅ ACCEPTED'
          : submission.status === 'wrong_answer'
            ? '❌ WRONG ANSWER'
            : submission.status === 'compile_error'
              ? '❌ COMPILE ERROR'
              : submission.status === 'runtime_error'
                ? '❌ RUNTIME ERROR'
                : submission.status === 'time_limit_exceeded'
                  ? '⏱️ TIME LIMIT EXCEEDED'
                  : `❌ ${submission.status.toUpperCase()}`,
      errorMessage: submission.errorMessage,
      result: submission.result,
      executionLogs: executionLogs.map((log) => ({
        timestamp: log.createdAt,
        message: log.logMessage,
      })),
      createdAt: submission.createdAt,
    };

    sendSuccess({ res, data: enhancedResponse });
  } catch (err) {
    next(err);
  }
});

// GET /problems/submissions/history — Retrieve student's submission history
router.get('/submissions/history', authenticate, async (req, res, next) => {
  try {
    const history = await prisma.submission.findMany({
      where: { userId: req.user!.userId },
      include: { problem: true, result: true },
      orderBy: { createdAt: 'desc' },
    });
    sendSuccess({ res, data: history });
  } catch (err) { next(err); }
});

// POST /problems/generate-test-cases — Generate dynamic test cases for a problem (e.g., "Find Smallest Number")
router.post('/generate-test-cases', authenticate, async (req, res, next) => {
  try {
    const { problemSlug, visibleCount = 6, hiddenCount = 18 } = req.body;

    if (!problemSlug) {
      throw new AppError('problemSlug is required', 400);
    }

    // Currently supports only "smallest-number-with-given-digit-sum"
    if (problemSlug !== 'smallest-number-with-given-digit-sum') {
      throw new AppError(
        `Dynamic test case generation not supported for problem slug: ${problemSlug}`,
        400
      );
    }

    // Generate test cases using the test case generator service
    const testCases = testCaseGeneratorService.generateAndVerifyTestCases({
      problemSlug,
      visibleCount,
      hiddenCount,
    });

    // Find the problem
    const problem = await prisma.problem.findUnique({
      where: { slug: problemSlug },
      include: { testCases: true },
    });

    if (!problem) {
      throw new AppError(`Problem not found for slug: ${problemSlug}`, 404);
    }

    // Delete existing test cases
    await prisma.problemTestCase.deleteMany({
      where: { problemId: problem.id },
    });

    // Create new test cases
    const createdTestCases = await Promise.all(
      testCases.map((tc) =>
        prisma.problemTestCase.create({
          data: {
            problemId: problem.id,
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            isHidden: tc.isHidden,
            type: tc.type,
          },
        })
      )
    );

    sendSuccess({
      res,
      message: 'Test cases generated and updated successfully',
      data: {
        problemSlug,
        testCaseCount: createdTestCases.length,
        visibleCount: createdTestCases.filter((tc) => !tc.isHidden).length,
        hiddenCount: createdTestCases.filter((tc) => tc.isHidden).length,
        testCases: testCases,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /problems/execution-logs/:submissionId — Get detailed execution logs for a submission
router.get('/execution-logs/:submissionId', authenticate, async (req, res, next) => {
  try {
    const { submissionId } = req.params;

    // Verify the submission belongs to the current user
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
    });

    if (!submission) {
      throw new AppError('Submission not found', 404);
    }

    if (submission.userId !== req.user!.userId) {
      throw new AppError('Unauthorized: You can only view your own submissions', 403);
    }

    // Fetch all execution logs for this submission
    const logs = await prisma.executionLog.findMany({
      where: { submissionId },
      orderBy: { createdAt: 'asc' },
    });

    // Format logs with proper structure
    const formattedLogs = logs.map((log) => ({
      timestamp: log.createdAt,
      message: log.logMessage,
    }));

    sendSuccess({
      res,
      message: 'Execution logs retrieved successfully',
      data: {
        submissionId,
        totalLogs: formattedLogs.length,
        logs: formattedLogs,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;


// PUT /problems/:id — Update existing problem (admin only)
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const {
      title,
      slug,
      difficulty,
      statement,
      constraints,
      inputFormat,
      outputFormat,
      timeLimit,
      memoryLimit,
      starterCode,
      referenceSolution,
      topics,
      companies,
      testCases,
    } = req.body;

    // Check if problem exists
    const existingProblem = await prisma.problem.findUnique({
      where: { id: req.params.id },
    });

    if (!existingProblem) {
      throw new AppError('Problem not found', 404);
    }

    // Update problem and test cases in transaction
    const problem = await prisma.$transaction(async (tx) => {
      // Update problem
      const updatedProblem = await tx.problem.update({
        where: { id: req.params.id },
        data: {
          title: title || existingProblem.title,
          slug: slug || existingProblem.slug,
          difficulty: difficulty || existingProblem.difficulty,
          statement: statement || existingProblem.statement,
          constraints: constraints || existingProblem.constraints,
          inputFormat: inputFormat || existingProblem.inputFormat,
          outputFormat: outputFormat || existingProblem.outputFormat,
          timeLimit: timeLimit || existingProblem.timeLimit,
          memoryLimit: memoryLimit || existingProblem.memoryLimit,
          starterCode: starterCode || existingProblem.starterCode,
          referenceSolution: referenceSolution || existingProblem.referenceSolution,
          topics: topics !== undefined ? topics : existingProblem.topics,
          companies: companies !== undefined ? companies : existingProblem.companies,
        },
      });

      // Update test cases if provided
      if (testCases && Array.isArray(testCases)) {
        // Delete existing test cases
        await tx.problemTestCase.deleteMany({
          where: { problemId: req.params.id },
        });

        // Create new test cases
        for (const tc of testCases) {
          await tx.problemTestCase.create({
            data: {
              problemId: req.params.id,
              input: tc.input,
              expectedOutput: tc.expectedOutput || '',
              isHidden: tc.isHidden ?? true,
              type: tc.type || 'hidden',
            },
          });
        }
      }

      return updatedProblem;
    });

    sendSuccess({ res, message: 'Problem updated successfully', data: problem });
  } catch (err) {
    next(err);
  }
});

// DELETE /problems/:id — Delete problem (admin only)
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const problem = await prisma.problem.findUnique({
      where: { id: req.params.id },
    });

    if (!problem) {
      throw new AppError('Problem not found', 404);
    }

    // Delete problem (test cases will be cascade deleted)
    await prisma.problem.delete({
      where: { id: req.params.id },
    });

    sendSuccess({ res, message: 'Problem deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// GET /problems/:id/admin — Get full problem details including test cases (admin only)
router.get('/:id/admin', authenticate, async (req, res, next) => {
  try {
    const problem = await prisma.problem.findUnique({
      where: { id: req.params.id },
      include: {
        testCases: true, // Include all test cases for admin
      },
    });

    if (!problem) {
      throw new AppError('Problem not found', 404);
    }

    sendSuccess({ res, data: problem });
  } catch (err) {
    next(err);
  }
});
