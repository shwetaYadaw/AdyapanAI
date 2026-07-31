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
    const { id } = req.params;
    
    // Check if it's a UUID (id) or a slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    
    const problem = await prisma.problem.findUnique({
      where: isUUID ? { id } : { slug: id },
      include: {
        testCases: true, // Get ALL test cases
      },
    });

    if (!problem) throw new AppError('Problem not found', 404);
    
    // Return first 2 test cases as visible (for sample display), rest as hidden
    const visibleTestCases = problem.testCases.slice(0, 2).map(tc => ({
      ...tc,
      isHidden: false, // Force first 2 to be visible for display
      type: 'visible'
    }));
    
    const hiddenTestCases = problem.testCases.slice(2).map(tc => ({
      ...tc,
      isHidden: true,
      type: 'hidden'
    }));
    
    // Omit sensitive reference solution fields before returning
    const { referenceSolution, ...safeProblem } = problem;
    
    // Return with modified test cases
    sendSuccess({ 
      res, 
      data: {
        ...safeProblem,
        testCases: [...visibleTestCases, ...hiddenTestCases]
      }
    });
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

// POST /problems/batch/add-sample-testcases — Add sample test cases to all problems that don't have any
router.post('/batch/add-sample-testcases', authenticate, async (req, res, next) => {
  try {
    console.log('🔍 Starting to add sample test cases to all problems...\n');

    // Get all problems without test cases
    const problems = await prisma.problem.findMany({
      include: {
        testCases: true
      }
    });

    const problemsWithoutTestCases = problems.filter(p => p.testCases.length === 0);
    
    if (problemsWithoutTestCases.length === 0) {
      return sendSuccess({ 
        res, 
        message: 'All problems already have test cases', 
        data: { processedCount: 0 } 
      });
    }

    let addedCount = 0;
    const results: any[] = [];

    for (const problem of problemsWithoutTestCases) {
      const testCases = generateTestCasesForProblem(problem);

      // Add test cases to database
      for (const tc of testCases) {
        await prisma.problemTestCase.create({
          data: {
            problemId: problem.id,
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            isHidden: tc.isHidden,
            type: tc.type
          }
        });
      }

      addedCount++;
      results.push({
        problemId: problem.id,
        title: problem.title,
        slug: problem.slug,
        testCasesAdded: testCases.length
      });
    }

    sendSuccess({ 
      res, 
      message: `Successfully added test cases to ${addedCount} problems`, 
      data: { 
        processedCount: addedCount,
        totalTestCases: addedCount * 2,
        results: results.slice(0, 10) // Return first 10 for preview
      } 
    });
  } catch (err) {
    next(err);
  }
});

// POST /problems/batch/add-reference-content — Add rich reference content to problem statements
router.post('/batch/add-reference-content', authenticate, async (req, res, next) => {
  try {
    console.log('🔍 Starting to add reference content to all problems...\n');

    // Get all problems
    const problems = await prisma.problem.findMany();
    
    let updatedCount = 0;
    const results: any[] = [];

    for (const problem of problems) {
      // Check if statement already has detailed content (skip if it does)
      if (problem.statement.includes('Algorithm Approach') || problem.statement.includes('Common Mistakes')) {
        continue; // Skip already enriched problems
      }

      // Generate rich reference content
      const enrichedStatement = generateRichProblemStatement(problem);

      // Update problem statement
      await prisma.problem.update({
        where: { id: problem.id },
        data: { statement: enrichedStatement }
      });

      updatedCount++;
      results.push({
        problemId: problem.id,
        title: problem.title,
        slug: problem.slug
      });
    }

    sendSuccess({ 
      res, 
      message: `Successfully added reference content to ${updatedCount} problems`, 
      data: { 
        processedCount: updatedCount,
        results: results.slice(0, 10) // Return first 10 for preview
      } 
    });
  } catch (err) {
    next(err);
  }
});

// Helper function to generate rich problem statement with reference content
function generateRichProblemStatement(problem: any): string {
  const originalStatement = problem.statement || '';
  const slug = problem.slug.toLowerCase();
  const title = problem.title.toLowerCase();
  const difficulty = problem.difficulty || 'medium';

  let enrichedStatement = originalStatement + '\n\n';

  // Add detailed examples if not present
  if (!originalStatement.includes('**Examples:**')) {
    enrichedStatement += `**Examples:**\n`;
    enrichedStatement += `- Input: [sample input]\n`;
    enrichedStatement += `  Output: [sample output]\n`;
    enrichedStatement += `  Explanation: [Brief explanation of the example]\n\n`;
  }

  // Add Algorithm Approach section
  enrichedStatement += `**Algorithm Approach:**\n`;
  
  // Pattern-based algorithm suggestions
  if (slug.includes('array') || slug.includes('maximum') || slug.includes('minimum')) {
    enrichedStatement += `1. **Linear Scan:** Iterate through the array once to find the result\n`;
    enrichedStatement += `   - Time Complexity: O(n)\n`;
    enrichedStatement += `   - Space Complexity: O(1)\n\n`;
    enrichedStatement += `2. **Divide and Conquer:** Split the array and solve recursively\n`;
    enrichedStatement += `   - Time Complexity: O(n log n)\n`;
    enrichedStatement += `   - Space Complexity: O(log n)\n\n`;
  } else if (slug.includes('sort')) {
    enrichedStatement += `1. **Comparison-Based Sorting:** QuickSort, MergeSort, HeapSort\n`;
    enrichedStatement += `   - Time Complexity: O(n log n) average\n`;
    enrichedStatement += `   - Space Complexity: O(log n) to O(n)\n\n`;
    enrichedStatement += `2. **Non-Comparison Sorting:** Counting Sort, Radix Sort (for specific input ranges)\n`;
    enrichedStatement += `   - Time Complexity: O(n + k) where k is range\n`;
    enrichedStatement += `   - Space Complexity: O(k)\n\n`;
  } else if (slug.includes('search') || slug.includes('binary')) {
    enrichedStatement += `1. **Binary Search:** For sorted arrays\n`;
    enrichedStatement += `   - Time Complexity: O(log n)\n`;
    enrichedStatement += `   - Space Complexity: O(1)\n\n`;
    enrichedStatement += `2. **Linear Search:** For unsorted arrays\n`;
    enrichedStatement += `   - Time Complexity: O(n)\n`;
    enrichedStatement += `   - Space Complexity: O(1)\n\n`;
  } else if (slug.includes('dp') || slug.includes('climb') || slug.includes('subsequence')) {
    enrichedStatement += `1. **Dynamic Programming (Top-Down):** Memoization with recursion\n`;
    enrichedStatement += `   - Time Complexity: O(n)\n`;
    enrichedStatement += `   - Space Complexity: O(n) for cache + O(n) for recursion\n\n`;
    enrichedStatement += `2. **Dynamic Programming (Bottom-Up):** Iterative tabulation\n`;
    enrichedStatement += `   - Time Complexity: O(n)\n`;
    enrichedStatement += `   - Space Complexity: O(n) or O(1) with optimization\n\n`;
    enrichedStatement += `3. **Mathematical Formula:** Direct calculation if pattern exists\n`;
    enrichedStatement += `   - Time Complexity: O(1)\n`;
    enrichedStatement += `   - Space Complexity: O(1)\n\n`;
  } else if (slug.includes('tree') || slug.includes('bfs') || slug.includes('dfs')) {
    enrichedStatement += `1. **Depth-First Search (DFS):** Explore depth-first using stack/recursion\n`;
    enrichedStatement += `   - Time Complexity: O(V + E) where V=vertices, E=edges\n`;
    enrichedStatement += `   - Space Complexity: O(h) where h=height\n\n`;
    enrichedStatement += `2. **Breadth-First Search (BFS):** Level-order traversal using queue\n`;
    enrichedStatement += `   - Time Complexity: O(V + E)\n`;
    enrichedStatement += `   - Space Complexity: O(w) where w=max width\n\n`;
  } else if (slug.includes('string') || slug.includes('anagram') || slug.includes('palindrome')) {
    enrichedStatement += `1. **Hash Map Approach:** Count character frequencies\n`;
    enrichedStatement += `   - Time Complexity: O(n)\n`;
    enrichedStatement += `   - Space Complexity: O(k) where k=unique characters\n\n`;
    enrichedStatement += `2. **Two Pointers:** For palindrome or comparison problems\n`;
    enrichedStatement += `   - Time Complexity: O(n)\n`;
    enrichedStatement += `   - Space Complexity: O(1)\n\n`;
  } else if (slug.includes('linked') || slug.includes('list')) {
    enrichedStatement += `1. **Iterative Approach:** Traverse and modify links iteratively\n`;
    enrichedStatement += `   - Time Complexity: O(n)\n`;
    enrichedStatement += `   - Space Complexity: O(1)\n\n`;
    enrichedStatement += `2. **Recursive Approach:** Solve recursively\n`;
    enrichedStatement += `   - Time Complexity: O(n)\n`;
    enrichedStatement += `   - Space Complexity: O(n) due to call stack\n\n`;
  } else {
    // Generic approach
    enrichedStatement += `1. **Brute Force:** Try all possible solutions\n`;
    enrichedStatement += `   - Analyze time and space complexity based on problem constraints\n\n`;
    enrichedStatement += `2. **Optimized Approach:** Use appropriate data structures (hash maps, sets, heaps)\n`;
    enrichedStatement += `   - Consider greedy, divide-and-conquer, or dynamic programming patterns\n\n`;
  }

  // Add Interview Tips section
  enrichedStatement += `---\n\n`;
  enrichedStatement += `**Interview Tips:**\n`;
  enrichedStatement += `- **State Your Approach:** Explain your solution strategy before coding\n`;
  enrichedStatement += `- **Discuss Complexity:** Mention time and space complexity upfront\n`;
  enrichedStatement += `- **Consider Edge Cases:** Empty input, single element, duplicates, maximum bounds\n`;
  enrichedStatement += `- **Ask Clarifying Questions:** Input format, constraints, expected output format\n`;
  enrichedStatement += `- **Test with Examples:** Walk through your solution with the given examples\n`;
  enrichedStatement += `- **Optimize Iteratively:** Start with a working solution, then optimize\n\n`;

  // Add Common Mistakes section
  enrichedStatement += `**Common Mistakes:**\n`;
  enrichedStatement += `- Off-by-one errors in loop bounds or array indices\n`;
  enrichedStatement += `- Not handling edge cases (empty input, single element)\n`;
  enrichedStatement += `- Integer overflow for large inputs (use appropriate data types)\n`;
  enrichedStatement += `- Forgetting to initialize variables or return values\n`;
  enrichedStatement += `- Incorrect boundary conditions in recursive solutions\n`;
  enrichedStatement += `- Not considering time/space complexity constraints\n\n`;

  // Add Related Topics section
  enrichedStatement += `**Related Topics:**\n`;
  
  if (slug.includes('array')) {
    enrichedStatement += `Arrays, Sorting, Searching, Two Pointers, Sliding Window, Kadane's Algorithm\n\n`;
  } else if (slug.includes('string')) {
    enrichedStatement += `Strings, Hash Maps, Two Pointers, String Matching, Pattern Recognition\n\n`;
  } else if (slug.includes('tree') || slug.includes('bfs') || slug.includes('dfs')) {
    enrichedStatement += `Trees, Binary Trees, Binary Search Trees, DFS, BFS, Tree Traversals\n\n`;
  } else if (slug.includes('linked')) {
    enrichedStatement += `Linked Lists, Two Pointers, Fast and Slow Pointers, Reversal\n\n`;
  } else if (slug.includes('dp') || slug.includes('climb')) {
    enrichedStatement += `Dynamic Programming, Recursion, Memoization, Tabulation\n\n`;
  } else if (slug.includes('graph')) {
    enrichedStatement += `Graphs, DFS, BFS, Shortest Path, Topological Sort, Union-Find\n\n`;
  } else {
    enrichedStatement += `Data Structures, Algorithms, Problem Solving\n\n`;
  }

  // Add Follow-up Questions section
  enrichedStatement += `**Follow-up Interview Questions:**\n`;
  enrichedStatement += `- Can you solve this in O(1) space?\n`;
  enrichedStatement += `- What if the input is very large (doesn't fit in memory)?\n`;
  enrichedStatement += `- How would you handle concurrent modifications to the data?\n`;
  enrichedStatement += `- Can you generalize this solution to handle additional constraints?\n`;

  return enrichedStatement;
}

// Helper function to generate test cases based on problem characteristics
function generateTestCasesForProblem(problem: any): Array<{
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  type: string;
}> {
  const slug = problem.slug.toLowerCase();
  const title = problem.title.toLowerCase();

  // Array problems
  if (slug.includes('array') || slug.includes('element') || title.includes('array') || 
      slug.includes('maximum') || slug.includes('minimum')) {
    return [
      {
        input: '5\n1 2 3 4 5',
        expectedOutput: '5',
        isHidden: false,
        type: 'visible'
      },
      {
        input: '3\n10 20 30',
        expectedOutput: '30',
        isHidden: false,
        type: 'visible'
      }
    ];
  }

  // String problems
  if (slug.includes('string') || slug.includes('anagram') || slug.includes('palindrome') ||
      slug.includes('reverse')) {
    return [
      {
        input: 'hello',
        expectedOutput: 'olleh',
        isHidden: false,
        type: 'visible'
      },
      {
        input: 'world',
        expectedOutput: 'dlrow',
        isHidden: false,
        type: 'visible'
      }
    ];
  }

  // Tree problems
  if (slug.includes('tree') || slug.includes('bfs') || slug.includes('dfs')) {
    return [
      {
        input: '7\n1 2 3 4 5 6 7',
        expectedOutput: '1 2 3 4 5 6 7',
        isHidden: false,
        type: 'visible'
      },
      {
        input: '3\n1 2 3',
        expectedOutput: '1 2 3',
        isHidden: false,
        type: 'visible'
      }
    ];
  }

  // Linked List problems
  if (slug.includes('linked') || slug.includes('list')) {
    return [
      {
        input: '1 2 3 4 5',
        expectedOutput: '5 4 3 2 1',
        isHidden: false,
        type: 'visible'
      },
      {
        input: '1',
        expectedOutput: '1',
        isHidden: false,
        type: 'visible'
      }
    ];
  }

  // Sorting problems
  if (slug.includes('sort') || title.includes('sort')) {
    return [
      {
        input: '5\n5 2 8 1 9',
        expectedOutput: '1 2 5 8 9',
        isHidden: false,
        type: 'visible'
      },
      {
        input: '3\n3 2 1',
        expectedOutput: '1 2 3',
        isHidden: false,
        type: 'visible'
      }
    ];
  }

  // Searching problems
  if (slug.includes('search') || title.includes('search') || slug.includes('binary')) {
    return [
      {
        input: '5 3\n1 2 3 4 5',
        expectedOutput: '2',
        isHidden: false,
        type: 'visible'
      },
      {
        input: '5 7\n1 2 3 4 5',
        expectedOutput: '-1',
        isHidden: false,
        type: 'visible'
      }
    ];
  }

  // Math/Number problems
  if (slug.includes('number') || slug.includes('digit') || slug.includes('prime') || 
      slug.includes('factorial') || slug.includes('fibonacci') || slug.includes('sum') ||
      slug.includes('bit')) {
    return [
      {
        input: '5',
        expectedOutput: '5',
        isHidden: false,
        type: 'visible'
      },
      {
        input: '10',
        expectedOutput: '10',
        isHidden: false,
        type: 'visible'
      }
    ];
  }

  // Dynamic Programming (Climbing Stairs specific)
  if (slug.includes('climb') || slug.includes('stair')) {
    return [
      {
        input: '5',
        expectedOutput: '8',
        isHidden: false,
        type: 'visible'
      },
      {
        input: '3',
        expectedOutput: '3',
        isHidden: false,
        type: 'visible'
      }
    ];
  }

  // Stack/Queue problems
  if (slug.includes('stack') || slug.includes('queue') || slug.includes('parenthes') ||
      slug.includes('valid')) {
    return [
      {
        input: '(())',
        expectedOutput: 'true',
        isHidden: false,
        type: 'visible'
      },
      {
        input: '(()',
        expectedOutput: 'false',
        isHidden: false,
        type: 'visible'
      }
    ];
  }

  // Matrix problems
  if (slug.includes('matrix') || slug.includes('grid') || slug.includes('2d')) {
    return [
      {
        input: '3 3\n1 2 3\n4 5 6\n7 8 9',
        expectedOutput: '45',
        isHidden: false,
        type: 'visible'
      },
      {
        input: '2 2\n1 2\n3 4',
        expectedOutput: '10',
        isHidden: false,
        type: 'visible'
      }
    ];
  }

  // Default generic test cases
  return [
    {
      input: '5',
      expectedOutput: 'Sample output',
      isHidden: false,
      type: 'visible'
    },
    {
      input: '10',
      expectedOutput: 'Sample output',
      isHidden: false,
      type: 'visible'
    }
  ];
}


// POST /problems/batch/add-reference-starter-code — Add reference solution code to problem starter templates
router.post('/batch/add-reference-starter-code', authenticate, async (req, res, next) => {
  try {
    console.log('🔍 Starting to add reference starter code to all problems...\n');

    // Get all problems
    const problems = await prisma.problem.findMany();
    
    let updatedCount = 0;
    const results: any[] = [];

    for (const problem of problems) {
      // Generate reference starter code based on problem type
      const referenceStarterCode = generateReferenceStarterCode(problem);

      // Update problem with reference starter code
      await prisma.problem.update({
        where: { id: problem.id },
        data: { starterCode: referenceStarterCode }
      });

      updatedCount++;
      results.push({
        problemId: problem.id,
        title: problem.title,
        slug: problem.slug
      });

      if (updatedCount % 10 === 0) {
        console.log(`Processed ${updatedCount} problems...`);
      }
    }

    sendSuccess({ 
      res, 
      message: `Successfully added reference starter code to ${updatedCount} problems`, 
      data: { 
        processedCount: updatedCount,
        results: results.slice(0, 10) // Return first 10 for preview
      } 
    });
  } catch (err) {
    next(err);
  }
});

// Helper function to generate reference starter code for each language
function generateReferenceStarterCode(problem: any): any {
  const slug = problem.slug.toLowerCase();
  const title = problem.title;
  const functionName = slug.replace(/-/g, '');

  // Base template structure
  const templates: any = {};

  // JavaScript Template
  templates.javascript = generateJavaScriptTemplate(problem, functionName);
  
  // Python Template  
  templates.python = generatePythonTemplate(problem, functionName);
  
  // Java Template
  templates.java = generateJavaTemplate(problem, functionName);
  
  // C++ Template
  templates.cpp = generateCppTemplate(problem, functionName);

  return templates;
}

function generateJavaScriptTemplate(problem: any, functionName: string): string {
  const slug = problem.slug.toLowerCase();
  const title = problem.title;

  let template = `// Solution for ${title}\nconst fs = require('fs');\n\n`;

  // Pattern-based solution templates
  if (slug.includes('array') || slug.includes('maximum') || slug.includes('minimum')) {
    template += `function ${functionName}(arr) {
    // Write your logic here
    // Approach 1: Linear scan to find max/min
    // Time Complexity: O(n), Space Complexity: O(1)
    
    if (arr.length === 0) return null;
    
    let result = arr[0];
    for (let i = 1; i < arr.length; i++) {
        // Compare and update result
        // For maximum: if (arr[i] > result) result = arr[i];
        // For minimum: if (arr[i] < result) result = arr[i];
    }
    
    return result;
}\n\n`;
  } else if (slug.includes('climb') || slug.includes('stair')) {
    template += `function ${functionName}(n) {
    // Dynamic Programming Approach
    // dp[i] = number of ways to reach step i
    // dp[i] = dp[i-1] + dp[i-2]
    // Time Complexity: O(n), Space Complexity: O(n) or O(1) optimized
    
    if (n <= 2) return n;
    
    // Bottom-up DP approach
    let dp = new Array(n + 1);
    dp[0] = 1;
    dp[1] = 1;
    
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}\n\n`;
  } else if (slug.includes('reverse') && slug.includes('linked')) {
    template += `function ${functionName}(head) {
    // Iterative approach to reverse linked list
    // Time Complexity: O(n), Space Complexity: O(1)
    
    let prev = null;
    let current = head;
    
    while (current !== null) {
        let next = current.next;
        current.next = prev;
        prev = current;
        current = next;
    }
    
    return prev; // new head
}\n\n`;
  } else if (slug.includes('anagram') || slug.includes('string')) {
    template += `function ${functionName}(s) {
    // Write your logic here
    // Approach: Use hash map or sorting
    // Time Complexity: O(n), Space Complexity: O(k) where k = unique chars
    
    // Example: Check if two strings are anagrams
    // Sort both strings and compare OR
    // Count character frequencies using Map
    
    let result = '';
    // Implement your solution here
    
    return result;
}\n\n`;
  } else if (slug.includes('bfs') || slug.includes('tree')) {
    template += `function ${functionName}(root) {
    // Breadth-First Search (Level Order Traversal)
    // Time Complexity: O(n), Space Complexity: O(w) where w = max width
    
    if (!root) return [];
    
    let result = [];
    let queue = [root];
    
    while (queue.length > 0) {
        let node = queue.shift();
        result.push(node.val);
        
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
    }
    
    return result;
}\n\n`;
  } else if (slug.includes('search') || slug.includes('binary')) {
    template += `function ${functionName}(arr, target) {
    // Binary Search (for sorted array)
    // Time Complexity: O(log n), Space Complexity: O(1)
    
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    
    return -1; // not found
}\n\n`;
  } else if (slug.includes('sort')) {
    template += `function ${functionName}(arr) {
    // Sorting Algorithm
    // Built-in: arr.sort((a, b) => a - b) - O(n log n)
    // Or implement your own sorting algorithm
    
    // QuickSort, MergeSort, or other sorting approach
    arr.sort((a, b) => a - b);
    
    return arr;
}\n\n`;
  } else if (slug.includes('bit') || slug.includes('xor')) {
    template += `function ${functionName}(n) {
    // Bit Manipulation
    // Count set bits, XOR operations, etc.
    // Time Complexity: O(log n), Space Complexity: O(1)
    
    let count = 0;
    while (n > 0) {
        count += n & 1;
        n >>= 1;
    }
    
    return count;
}\n\n`;
  } else {
    // Generic template
    template += `function ${functionName}(input) {
    // Write your solution here
    // 1. Understand the problem requirements
    // 2. Identify the algorithm or data structure needed
    // 3. Implement step by step
    // 4. Test with sample inputs
    
    let result;
    // Your code here
    
    return result;
}\n\n`;
  }

  // Add input/output handling
  template += `function solve() {
    const input = fs.readFileSync(0, 'utf-8').trim();
    if (!input) return;
    
    const lines = input.split(/\\r?\\n/);
    // Parse input based on problem requirements
    // const n = parseInt(lines[0]);
    // const arr = lines[1].split(/\\s+/).map(Number);
    
    // Call your function
    // const result = ${functionName}(arr);
    
    // Print output
    // console.log(result);
}

solve();`;

  return template;
}

function generatePythonTemplate(problem: any, functionName: string): string {
  const slug = problem.slug.toLowerCase();
  const title = problem.title;

  let template = `# Solution for ${title}\n\n`;

  if (slug.includes('array') || slug.includes('maximum') || slug.includes('minimum')) {
    template += `def ${functionName}(arr):
    # Write your logic here
    # Approach: Linear scan
    # Time: O(n), Space: O(1)
    
    if not arr:
        return None
    
    result = arr[0]
    for num in arr[1:]:
        # Update result based on requirement
        pass
    
    return result\n\n`;
  } else if (slug.includes('climb')) {
    template += `def ${functionName}(n):
    # Dynamic Programming
    # dp[i] = dp[i-1] + dp[i-2]
    
    if n <= 2:
        return n
    
    dp = [0] * (n + 1)
    dp[0], dp[1] = 1, 1
    
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    
    return dp[n]\n\n`;
  } else {
    template += `def ${functionName}(input_data):
    # Write your solution here
    # Implement step by step
    
    result = None
    # Your code here
    
    return result\n\n`;
  }

  template += `def solve():
    import sys
    input_data = sys.stdin.read().strip()
    if not input_data:
        return
    
    lines = input_data.split('\\n')
    # Parse input
    # n = int(lines[0])
    # arr = list(map(int, lines[1].split()))
    
    # Call function and print result
    # result = ${functionName}(arr)
    # print(result)

if __name__ == "__main__":
    solve()`;

  return template;
}

function generateJavaTemplate(problem: any, functionName: string): string {
  const className = problem.slug.split('-').map((w: string) => 
    w.charAt(0).toUpperCase() + w.slice(1)
  ).join('');

  return `// Solution for ${problem.title}
import java.util.*;
import java.io.*;

public class ${className} {
    // Write your solution here
    public static void solve() {
        Scanner sc = new Scanner(System.in);
        
        // Read input
        // int n = sc.nextInt();
        // int[] arr = new int[n];
        
        // Process and print output
        
        sc.close();
    }
    
    public static void main(String[] args) {
        solve();
    }
}`;
}

function generateCppTemplate(problem: any, functionName: string): string {
  return `// Solution for ${problem.title}
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

// Write your solution here

int main() {
    // Read input
    // int n;
    // cin >> n;
    // vector<int> arr(n);
    
    // Process and print output
    
    return 0;
}`;
}
