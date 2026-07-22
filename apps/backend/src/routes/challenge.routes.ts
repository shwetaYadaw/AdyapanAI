import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { prisma } from '../config/prisma';
import { JudgeService } from '../services/judge.service';
import { sendSuccess } from '../utils/response.utils';
import { AppError } from '../middleware/errorHandler.middleware';
import axios from 'axios';

const router = Router();
const judge = new JudgeService();

// GET /challenges/questions — List coding questions
router.get('/questions', async (req, res, next) => {
  try {
    const { difficulty, topic, search, company } = req.query;
    
    // Build Prisma query condition
    const where: any = {};

    if (difficulty) {
      where.difficulty = String(difficulty);
    }
    
    // Prisma JSON field filtering or simple parsing
    if (topic) {
      where.topics = {
        array_contains: String(topic).toLowerCase()
      };
    }
    
    if (company) {
      where.companies = {
        array_contains: String(company).toLowerCase()
      };
    }
    
    if (search) {
      where.OR = [
        { title: { contains: String(search) } },
        { statement: { contains: String(search) } },
      ];
    }

    // Retrieve all questions
    const questions = await prisma.question.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        statement: true,
        difficulty: true,
        topics: true,
        companies: true,
        timeLimit: true,
        memoryLimit: true,
        inputFormat: true,
        outputFormat: true,
        constraints: true,
        sampleInput: true,
        sampleOutput: true,
        templates: true,
        xpReward: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    sendSuccess({ res, data: questions });
  } catch (err) { next(err); }
});

function enrichQuestionDescription(question: any) {
  const title = question.title;
  const topic = question.topics[0] || 'algorithm';
  const difficulty = question.difficulty || 'Easy';
  const xpReward = question.xpReward || 10;
  const slug = question.slug;
  const id = question.id;

  let statement = '';
  let inputFormat = '';
  let outputFormat = '';
  let constraints = '';
  let explanation = '';
  let timeComplexity = '';
  let spaceComplexity = '';
  let hints: string[] = [];
  let bruteForceEditorial = '';
  let optimizedEditorial = '';
  let correctnessProof = '';
  let pythonSol = '';
  let javaSol = '';
  let cppSol = '';
  let jsSol = '';
  let commonMistakes = '';
  let interviewTips = '';
  let relatedProblems: string[] = [];
  let followUpQuestions: string[] = [];

  if (title === 'Chocolate Distribution Problem') {
    statement = `Given an array of integer values representing the number of chocolates in a packet. There are $m$ packets and $n$ students. The task is to distribute chocolate packets such that:\n1. Each student gets exactly one packet.\n2. The difference between the maximum number of chocolates given to a student and the minimum number of chocolates given to a student is minimized.\n\nReturn the minimum difference.`;
    inputFormat = `First line contains space-separated integers representing packet sizes.\nSecond line contains the integer $m$ (number of students).`;
    outputFormat = `An integer representing the minimum possible difference.`;
    constraints = `1 <= nums.length <= 10^5\n1 <= m <= nums.length`;
    explanation = `Sorted packets: [1, 2, 3]\nFor m=2, subarray of size 2 with minimum diff is [1, 2] or [2, 3], diff is 1.`;
    timeComplexity = `O(N \\log N) where N is the number of packets.`;
    spaceComplexity = `O(1) auxiliary space.`;
    hints = [
      `Try sorting the array of packet sizes first.`,
      `Use a sliding window of size m to track the difference between the maximum and minimum elements in each window.`,
      `The first element in the window will be the minimum, and the last will be the maximum.`
    ];
    bruteForceEditorial = `Generate all combinations of size m, find the difference between max and min in each combination, and return the minimum. Time complexity: O(2^N).`;
    optimizedEditorial = `Sort the array. Use a sliding window of size m. The difference between the maximum and minimum chocolate packet sizes in the window starting at index i is nums[i + m - 1] - nums[i]. Find the minimum of this value over all i.`;
    correctnessProof = `Since the array is sorted, any contiguous subarray of size m represents the closest possible values for m students. Non-contiguous selections would only increase or keep the difference same.`;
    pythonSol = `def chocolateDistributionProblem(nums, m):\n    nums.sort()\n    min_diff = float('inf')\n    for i in range(len(nums) - m + 1):\n        min_diff = min(min_diff, nums[i+m-1] - nums[i])\n    return min_diff`;
    javaSol = `public static int chocolateDistributionProblem(int[] nums, int m) {\n    Arrays.sort(nums);\n    int minDiff = Integer.MAX_VALUE;\n    for (int i = 0; i <= nums.length - m; i++) {\n        minDiff = Math.min(minDiff, nums[i + m - 1] - nums[i]);\n    }\n    return minDiff;\n}`;
    cppSol = `int chocolateDistributionProblem(vector<int>& nums, int m) {\n    sort(nums.begin(), nums.end());\n    int min_diff = 1e9;\n    for (int i = 0; i <= nums.size() - m; i++) {\n        min_diff = min(min_diff, nums[i + m - 1] - nums[i]);\n    }\n    return min_diff;\n}`;
    jsSol = `function chocolateDistributionProblem(nums, m) {\n    nums.sort((a, b) => a - b);\n    let minDiff = Infinity;\n    for (let i = 0; i <= nums.length - m; i++) {\n        minDiff = Math.min(minDiff, nums[i + m - 1] - nums[i]);\n    }\n    return minDiff;\n}`;
    commonMistakes = `Not sorting the array first, or using incorrect window boundaries.`;
    interviewTips = `Be ready to explain how sorting guarantees that the contiguous window contains the optimal subset.`;
    relatedProblems = [`Sliding Window Maximum`, `Minimum Window Substring`];
    followUpQuestions = [`Can we solve this without sorting if the range of chocolates is very small?`];
  } else {
    // Prefer the complete MySQL problem definition. The previous generic
    // description hid carefully authored statements, samples, and diagrams.
    statement = question.statement || `Implement the algorithm to solve **${title}**. Design your solution to handle standard test parameters as well as edge cases such as empty input, maximum boundaries, and singular inputs.`;
    inputFormat = question.inputFormat || `A single line containing the primary input sequence or value.`;
    outputFormat = question.outputFormat || `The computed result formatted according to the problem constraints.`;
    constraints = question.constraints || `1 <= input.length <= 10^5`;
    explanation = `The sample output matches the expected result of applying the algorithm on the sample input.`;
    timeComplexity = `O(N) or O(N \\log N) depending on optimal data structure choice.`;
    spaceComplexity = `O(1) or O(N) auxiliary space.`;
    hints = [
      `Identify the core sub-problems.`,
      `Consider standard techniques such as sorting, sliding window, or recursion.`,
      `Handle constraints and boundary inputs first.`
    ];
    bruteForceEditorial = `Test every possible configuration or value. Time complexity: O(N^2) or O(2^N).`;
    optimizedEditorial = `Apply greedy, sorting, or dynamic programming properties to decrease complexity to O(N log N) or O(N).`;
    correctnessProof = `Optimal substructure allows building the global solution from solved local substructures.`;
    pythonSol = `def solveQuestion(input_val):\n    return input_val`;
    javaSol = `public static String solveQuestion(String inputVal) {\n    return inputVal;\n}`;
    cppSol = `string solveQuestion(string inputVal) {\n    return inputVal;\n}`;
    jsSol = `function solveQuestion(inputVal) {\n    return inputVal;\n}`;
    commonMistakes = `Overlooking integer overflow and zero/negative bounds.`;
    interviewTips = `Always state the assumptions on limits and data types before coding.`;
    relatedProblems = [`Two Sum`, `Reverse Array`];
    followUpQuestions = [`Can we optimize the space complexity further to O(1)?`];
  }

  const structuredJson = {
    title,
    difficulty,
    topic,
    companies: ['Amazon', 'Microsoft', 'Google', 'Adobe', 'Goldman Sachs'],
    problemStatement: statement,
    inputFormat,
    outputFormat,
    constraints,
    sampleTestCases: [
      {
        sampleInput: question.sampleInput,
        sampleOutput: question.sampleOutput,
        explanation: explanation || 'The sample output matches the expected result of processing the sample input.'
      }
    ],
    edgeCases: ['Single element', 'Duplicate values', 'Maximum constraints', 'Negative numbers'],
    hiddenTestCases: [
      { input: question.sampleInput, output: question.sampleOutput, isHidden: true },
      { input: question.sampleInput, output: question.sampleOutput, isHidden: true }
    ],
    functionSignatures: {
      python: pythonSol,
      java: javaSol,
      cpp: cppSol,
      javascript: jsSol
    },
    timeComplexity,
    spaceComplexity,
    hints,
    editorial: {
      bruteForce: bruteForceEditorial,
      optimized: optimizedEditorial,
      correctnessProof: correctnessProof
    },
    referenceSolutions: {
      python: pythonSol,
      java: javaSol,
      cpp: cppSol,
      javascript: jsSol
    },
    aiMentor: {
      commonMistakes,
      interviewTips,
      relatedProblems,
      followUpQuestions
    },
    metadata: {
      questionId: id,
      slug,
      difficulty,
      topic,
      subtopic: topic,
      tags: [topic],
      companies: ['Amazon', 'Microsoft', 'Google'],
      acceptanceRate: '48%',
      frequency: 'High',
      premiumFree: 'Free',
      estimatedSolveTime: '20-30 mins',
      xpReward
    }
  };

  const markdownVersion = `
## 📝 Problem Statement
${statement}

---

## 📥 Input Format
${inputFormat}

## 📤 Output Format
${outputFormat}

## ⚙️ Constraints
\`\`\`
${constraints}
\`\`\`

---

## 💡 Sample Test Cases

### Sample Test Case 1
**Input:**
\`\`\`
${question.sampleInput}
\`\`\`
**Output:**
\`\`\`
${question.sampleOutput}
\`\`\`
**Explanation:**
${explanation || 'The sample output matches the expected result of processing the sample input.'}

---

## ⏱️ Complexity Analysis
- **Expected Time Complexity:** \`${timeComplexity}\`
- **Expected Space Complexity:** \`${spaceComplexity}\`

## 🔑 Hints
${hints.map((h, i) => `**Hint ${i + 1}:** ${h}`).join('\n\n')}

---

## 📖 Editorial / Solution Walkthrough

### Brute Force Approach
${bruteForceEditorial}

### Optimized Approach
${optimizedEditorial}

### Proof of Correctness
${correctnessProof}

---

## 💻 Reference Solutions

### JavaScript
\`\`\`javascript
${jsSol}
\`\`\`

### Python
\`\`\`python
${pythonSol}
\`\`\`

---

## 🤖 AI Mentor Insights
- **Common Mistakes:** ${commonMistakes}
- **Interview Tips:** ${interviewTips}
- **Related Problems:** ${relatedProblems.join(', ')}
- **Follow-up Interview Questions:** ${followUpQuestions.join(', ')}
  `.trim();

  return {
    ...question,
    statement: markdownVersion,
    inputFormat: inputFormat,
    outputFormat: outputFormat,
    constraints: constraints,
    structuredJson: JSON.stringify(structuredJson),
  };
}

// GET /challenges/questions/:slug — Retrieve single question details
router.get('/questions/:slug', async (req, res, next) => {
  try {
    const question = await prisma.question.findUnique({
      where: { slug: req.params.slug }
    });
    if (!question) throw new AppError('Question not found', 404);
    sendSuccess({ res, data: enrichQuestionDescription(question) });
  } catch (err) { next(err); }
});

// POST /challenges/questions/:id/run — Run code against sample tests
router.post('/questions/:id/run', authenticate, async (req, res, next) => {
  try {
    const { code, language, input } = req.body;
    const question = await prisma.question.findUnique({
      where: { id: req.params.id }
    });
    if (!question) throw new AppError('Question not found', 404);

    const runInput = typeof input === 'string' ? input : question.sampleInput;
    const isCustomRun = typeof input === 'string' && input !== question.sampleInput;
    const results = await judge.runTestCase(
      code,
      language,
      runInput,
      isCustomRun ? undefined : question.sampleOutput,
      question.timeLimit
    );

    sendSuccess({
      res,
      data: {
        passed: results.passed,
        actualOutput: results.actualOutput,
        expectedOutput: isCustomRun ? undefined : question.sampleOutput,
        input: runInput,
        isCustomRun,
        runtime: results.runtime,
        errorType: results.errorType,
        errorMessage: results.errorMessage,
      },
    });
  } catch (err) { next(err); }
});

// Helper function to detect hardcoding outputs
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

interface TestCase {
  input: string;
  output: string;
  isHidden: boolean;
  type?: 'visible' | 'hidden' | 'edge' | 'stress';
}

function generateTestCasesForQuestion(title: string, sampleInput: string, sampleOutput: string): TestCase[] {
  const cases: TestCase[] = [];

  const solveKadane = (nums: number[]) => {
    let max = nums[0], curr = nums[0];
    for (let i = 1; i < nums.length; i++) {
      curr = Math.max(nums[i], curr + nums[i]);
      max = Math.max(max, curr);
    }
    return max;
  };

  const solveTwoSum = (nums: number[], target: number) => {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
      const diff = target - nums[i];
      if (map.has(diff)) {
        return `${map.get(diff)} ${i}`;
      }
      map.set(nums[i], i);
    }
    return "0 0";
  };

  const solveChocolate = (nums: number[], m: number) => {
    const sorted = [...nums].sort((a, b) => a - b);
    let minDiff = Infinity;
    for (let i = 0; i <= sorted.length - m; i++) {
      minDiff = Math.min(minDiff, sorted[i + m - 1] - sorted[i]);
    }
    return minDiff;
  };

  const isKadane = title.includes("Subarray") || title.includes("Kadane");
  const isTwoSum = title.toLowerCase().includes("two sum");
  const isChocolate = title.includes("Chocolate");

  // 5 Visible Cases
  for (let i = 1; i <= 5; i++) {
    let input = '';
    let output = '';
    if (isKadane) {
      const arr = Array.from({ length: 5 + i }, () => Math.floor(Math.random() * 20) - 10);
      input = arr.join(' ');
      output = String(solveKadane(arr));
    } else if (isTwoSum) {
      const arr = [2, 7, 11, 15, 3, 4, 6].slice(0, 4 + i);
      const target = arr[0] + arr[arr.length - 1];
      input = `${arr.join(' ')}\n${target}`;
      output = solveTwoSum(arr, target);
    } else if (isChocolate) {
      const arr = Array.from({ length: 5 + i }, () => Math.floor(Math.random() * 50) + 1);
      const m = Math.floor(Math.random() * 3) + 2;
      input = `${arr.join(' ')}\n${m}`;
      output = String(solveChocolate(arr, m));
    } else {
      input = `${sampleInput} ${i}`;
      output = sampleOutput;
    }
    cases.push({ input, output, isHidden: false, type: 'visible' });
  }

  // 20 Hidden Cases
  for (let i = 1; i <= 20; i++) {
    let input = '';
    let output = '';
    if (isKadane) {
      const arr = Array.from({ length: 15 + i }, () => Math.floor(Math.random() * 100) - 50);
      input = arr.join(' ');
      output = String(solveKadane(arr));
    } else if (isTwoSum) {
      const arr = Array.from({ length: 10 + i }, () => Math.floor(Math.random() * 100) + 1);
      const target = arr[Math.floor(Math.random() * 3)] + arr[Math.floor(Math.random() * 3) + 3];
      input = `${arr.join(' ')}\n${target}`;
      output = solveTwoSum(arr, target);
    } else if (isChocolate) {
      const arr = Array.from({ length: 10 + i }, () => Math.floor(Math.random() * 100) + 1);
      const m = Math.floor(Math.random() * 5) + 2;
      input = `${arr.join(' ')}\n${m}`;
      output = String(solveChocolate(arr, m));
    } else {
      input = `${sampleInput} ${10 + i}`;
      output = sampleOutput;
    }
    cases.push({ input, output, isHidden: true, type: 'hidden' });
  }

  // 10 Edge Cases
  for (let i = 1; i <= 10; i++) {
    let input = '';
    let output = '';
    if (isKadane) {
      let arr: number[] = [];
      if (i === 1) arr = [-5];
      else if (i === 2) arr = [-10, -2, -3, -4, -1, -9];
      else if (i === 3) arr = [1000, 2000, 3000];
      else if (i === 4) arr = [0, 0, 0, 0];
      else arr = Array.from({ length: 5 }, () => (i % 2 === 0 ? 50 : -50));
      input = arr.join(' ');
      output = String(solveKadane(arr));
    } else if (isTwoSum) {
      let arr: number[] = [];
      let target = 0;
      if (i === 1) { arr = [1, 2]; target = 3; }
      else if (i === 2) { arr = [100000, 200000]; target = 300000; }
      else { arr = [0, 0, 5, 10]; target = 0; }
      input = `${arr.join(' ')}\n${target}`;
      output = solveTwoSum(arr, target);
    } else if (isChocolate) {
      let arr: number[] = [];
      let m = 2;
      if (i === 1) { arr = [5, 5]; m = 2; }
      else if (i === 2) { arr = [10, 20, 30]; m = 3; }
      else { arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; m = 10; }
      input = `${arr.join(' ')}\n${m}`;
      output = String(solveChocolate(arr, m));
    } else {
      input = `${sampleInput} ${100 + i}`;
      output = sampleOutput;
    }
    cases.push({ input, output, isHidden: true, type: 'edge' });
  }

  // 5 Stress Cases
  for (let i = 1; i <= 5; i++) {
    let input = '';
    let output = '';
    if (isKadane) {
      const arr = Array.from({ length: 500 + i * 100 }, () => Math.floor(Math.random() * 1000) - 500);
      input = arr.join(' ');
      output = String(solveKadane(arr));
    } else if (isTwoSum) {
      const arr = Array.from({ length: 300 + i * 50 }, (_, idx) => idx + 1);
      const target = arr[arr.length - 2] + arr[arr.length - 1];
      input = `${arr.join(' ')}\n${target}`;
      output = solveTwoSum(arr, target);
    } else if (isChocolate) {
      const arr = Array.from({ length: 200 + i * 50 }, () => Math.floor(Math.random() * 1000) + 1);
      const m = 50;
      input = `${arr.join(' ')}\n${m}`;
      output = String(solveChocolate(arr, m));
    } else {
      input = `${sampleInput} ${1000 + i}`;
      output = sampleOutput;
    }
    cases.push({ input, output, isHidden: true, type: 'stress' });
  }

  return cases;
}

function getQuestionTestCases(question: any): TestCase[] {
  const rawCases = Array.isArray(question.testCases) ? question.testCases : [];
  const storedCases = rawCases
    .filter((testCase: any) => typeof testCase?.input === 'string' && typeof testCase?.output === 'string')
    .map((testCase: any) => ({
      input: testCase.input,
      output: testCase.output,
      isHidden: Boolean(testCase.isHidden),
      type: testCase.type,
    }));

  // Questions authored in MySQL keep their exact visible and hidden cases.
  // The legacy generator remains only as a fallback for older records.
  return storedCases.length > 0
    ? storedCases
    : generateTestCasesForQuestion(question.title, question.sampleInput, question.sampleOutput);
}

// POST /challenges/questions/:id/submit — Submit code against all test cases
router.post('/questions/:id/submit', authenticate, async (req, res, next) => {
  try {
    const { code, language } = req.body;
    const question = await prisma.question.findUnique({
      where: { id: req.params.id }
    });
    if (!question) throw new AppError('Question not found', 404);

    const testCases = getQuestionTestCases(question);
    
    // Anti-cheat check: detect if code hardcodes sample outputs
    const sampleOutputs = [question.sampleOutput];
    const visibleOutputs = testCases.filter(t => !t.isHidden).map(t => t.output);
    const expectedOutputs = Array.from(new Set([...sampleOutputs, ...visibleOutputs]));
    const isCheating = detectHardcoding(code, expectedOutputs);

    let passedCount = 0;
    let finalStatus: 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'compile_error' | 'runtime_error' = 'accepted';
    let errorMessage = '';
    let maxRuntime = 0;

    if (isCheating) {
      finalStatus = 'wrong_answer';
      errorMessage = 'Cheat Detected: Solution hardcodes output values instead of computing them.';
    } else {
      // Execute all test cases to get accurate counts
      for (const tc of testCases) {
        const result = await judge.runTestCase(
          code,
          language,
          tc.input,
          tc.output,
          question.timeLimit
        );

        if (result.passed) {
          passedCount++;
          maxRuntime = Math.max(maxRuntime, result.runtime);
        } else {
          if (finalStatus === 'accepted') {
            finalStatus = (result.errorType as any) || 'wrong_answer';
            errorMessage = result.errorMessage || `Wrong Answer on testcase ${passedCount + 1}`;
          }
        }
      }
    }

    // Save submission to MySQL via Prisma
    const submission = await prisma.submission.create({
      data: {
        userId: req.user!.userId,
        questionId: question.id,
        code,
        language,
        status: finalStatus,
        errorMessage: errorMessage || null,
        runtime: maxRuntime,
        passedCount,
        totalCount: testCases.length,
      }
    });

    let unlockedBadge = null;

    // Award XP and update solved stats on success
    if (finalStatus === 'accepted') {
      const profile = await prisma.studentProfile.findUnique({
        where: { userId: req.user!.userId }
      });
      if (profile) {
        // Only award XP if this is the first successful submission for this question
        const alreadySolved = await prisma.submission.findFirst({
          where: {
            userId: req.user!.userId,
            questionId: question.id,
            status: 'accepted',
            id: { not: submission.id },
          }
        });

        if (!alreadySolved) {
          const updatedXp = profile.xp + question.xpReward;
          const updatedLevel = Math.floor(updatedXp / 100) + 1; // 100 XP per level
          await prisma.studentProfile.update({
            where: { userId: req.user!.userId },
            data: {
              xp: updatedXp,
              level: updatedLevel
            }
          });

          // Check if this is their first ever solved coding challenge
          const firstSolvedEver = await prisma.submission.findFirst({
            where: {
              userId: req.user!.userId,
              status: 'accepted',
              id: { not: submission.id }
            }
          });

          if (!firstSolvedEver) {
            try {
              const prismaBadgeExists = await prisma.badge.findFirst({
                where: {
                  userId: req.user!.userId,
                  badgeType: 'code-warrior'
                }
              });

              if (!prismaBadgeExists) {
                unlockedBadge = await prisma.badge.create({
                  data: {
                    userId: req.user!.userId,
                    badgeType: 'code-warrior',
                    name: 'Code Warrior',
                    iconUrl: '🏆',
                  }
                });
              } else {
                unlockedBadge = prismaBadgeExists;
              }
            } catch (badgeErr) {
              console.error('Failed to award Code Warrior badge:', badgeErr);
            }
          }

          // Check topic-wise completion
          const currentTopics = (question.topics as string[]) || [];
          for (const topicKey of currentTopics) {
            const allQuestions = await prisma.question.findMany();
            const topicQuestions = allQuestions.filter(q => {
              const qt = (q.topics as string[]) || [];
              return qt.includes(topicKey);
            });
            const topicQuestionIds = topicQuestions.map(q => q.id);

            const solvedTopicSubmissions = await prisma.submission.findMany({
              where: {
                userId: req.user!.userId,
                status: 'accepted',
                questionId: { in: topicQuestionIds }
              },
              distinct: ['questionId']
            });

            if (solvedTopicSubmissions.length === topicQuestions.length && topicQuestions.length > 0) {
              try {
                const { CertificateService } = require('../services/certificate.service');
                const certService = new CertificateService();
                const User = require('../models/user.model').default;
                const Course = require('../models/course.model').default;
                const mongoUser = await User.findOne({ email: req.user!.email });
                if (mongoUser) {
                  let dsaCourse = await Course.findOne({ slug: `dsa-topic-${topicKey}` });
                  if (!dsaCourse) {
                    dsaCourse = await Course.create({
                      title: `DSA Topic: ${topicKey.toUpperCase()}`,
                      slug: `dsa-topic-${topicKey}`,
                      shortDescription: `Crack any coding interview with comprehensive DSA preparation for ${topicKey}`,
                      description: `Master Data Structures and Algorithms with ${topicKey} problems.`,
                      category: 'placement',
                      subCategory: 'DSA',
                      skillsTaught: [topicKey],
                      certificateEnabled: true,
                    });
                  }
                  await certService.generateDSACertificate(mongoUser._id.toString(), dsaCourse._id.toString(), topicKey);
                }
              } catch (certErr) {
                console.error(`Auto certificate generation for topic ${topicKey} failed:`, certErr);
              }
            }
          }
        }
      }
    }

    sendSuccess({
      res,
      statusCode: 201,
      data: {
        id: submission.id,
        userId: submission.userId,
        questionId: submission.questionId,
        code: submission.code,
        language: submission.language,
        status: submission.status,
        errorMessage: submission.errorMessage,
        runtime: submission.runtime,
        passedCount: submission.passedCount,
        totalCount: submission.totalCount,
        createdAt: submission.createdAt,
        unlockedBadge
      },
      message: finalStatus === 'accepted' ? 'Accepted!' : 'Failed',
    });
  } catch (err) { next(err); }
});

// GET /challenges/stats — Get total solved and total questions for the logged in user
router.get('/stats', authenticate, async (req, res, next) => {
  try {
    const questions = await prisma.question.findMany({
      select: {
        id: true,
        topics: true
      }
    });

    const solvedQuestions = await prisma.submission.findMany({
      where: {
        userId: req.user!.userId,
        status: 'accepted'
      },
      distinct: ['questionId'],
      select: {
        questionId: true
      }
    });

    const solvedQuestionIds = new Set(solvedQuestions.map(s => s.questionId));
    const topicStats: Record<string, { total: number; solved: number }> = {};

    questions.forEach(q => {
      const topics = (q.topics as string[]) || [];
      const isSolved = solvedQuestionIds.has(q.id);

      topics.forEach(t => {
        const key = t.toLowerCase();
        if (!topicStats[key]) {
          topicStats[key] = { total: 0, solved: 0 };
        }
        topicStats[key].total++;
        if (isSolved) {
          topicStats[key].solved++;
        }
      });
    });

    sendSuccess({
      res,
      data: {
        solvedCount: solvedQuestionIds.size,
        totalQuestions: questions.length,
        topicStats
      }
    });
  } catch (err) { next(err); }
});

// GET /challenges/leaderboard — Retrieve coding leaderboard rankings
router.get('/leaderboard', async (req, res, next) => {
  try {
    const leaderboard = await prisma.studentProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      },
      orderBy: { xp: 'desc' },
      take: 20
    });

    // Adapt to match expected Mongoose response fields (renaming user -> userId)
    const adaptedLeaderboard = leaderboard.map(profile => ({
      _id: profile.id,
      userId: profile.user,
      totalXP: profile.xp,
      level: profile.level
    }));

    sendSuccess({ res, data: adaptedLeaderboard });
  } catch (err) { next(err); }
});

// POST /challenges/ai-mentor — Ask AI mentor about a coding problem
router.post('/ai-mentor', authenticate, async (req, res, next) => {
  try {
    const { questionSlug, code, requestType } = req.body;
    const question = await prisma.question.findUnique({
      where: { slug: questionSlug }
    });

    if (!question) {
      throw new AppError('Question not found', 404);
    }
    const title = question.title;

    let systemPrompt = '';
    if (requestType === 'explain') {
      systemPrompt = `Explain the coding problem "${title}" clearly to a student. Describe the logic, constraints, and standard input/output formatting. Do not show the solution code yet.`;
    } else if (requestType === 'hint') {
      systemPrompt = `Give a helpful, progressive conceptual hint to solve the coding problem "${title}" without writing any code. Check the student's current code if provided:\n\`\`\`\n${code || 'No code written yet'}\n\`\`\``;
    } else if (requestType === 'complexity') {
      systemPrompt = `Analyze the time and space complexity of the student's current code for problem "${title}":\n\`\`\`\n${code}\n\`\`\`\nSuggest how they can optimize it if possible.`;
    } else {
      systemPrompt = `You are an expert competitive programming tutor. Provide a detailed, production-quality review of the student's code for the problem "${title}".
Analyze what is wrong with the student's code, list logical bugs, syntax errors, or complexity issues.
Provide a complete, correct, optimized reference solution in the same language. Explain step-by-step why the student's code failed and how the correct solution fixes it. Refer to standard patterns from LeetCode, GeeksforGeeks, or Codeforces if helpful.
Student's Code:
\`\`\`
${code || '// No code written'}
\`\`\n`;
    }

    // Call OpenAI/AI microservice
    let aiResponse = 'Unable to connect to AI Mentor service. Please try again later.';
    try {
      const response = await axios.post(
        `${process.env.AI_SERVICE_URL || 'http://localhost:8000'}/api/chat`,
        {
          message: systemPrompt,
        },
        {
          headers: {
            'X-API-Key': process.env.AI_SERVICE_API_KEY || 'adyapan_internal_ai_key_2024',
          },
        }
      );
      aiResponse = response.data?.response || response.data?.choices?.[0]?.message?.content || aiResponse;
    } catch {
      aiResponse = getFallbackAIMentorResponse(title, code || '');
    }

    sendSuccess({ res, data: { response: aiResponse } });
  } catch (err) { next(err); }
});

function getFallbackAIMentorResponse(questionTitle: string, studentCode: string): string {
  let lang = 'javascript';
  const codeStr = String(studentCode);
  if (codeStr.includes('def ') || codeStr.includes('import sys')) lang = 'python';
  else if (codeStr.includes('#include')) lang = 'cpp';
  else if (codeStr.includes('class Main')) lang = 'java';

  const cleanTitle = questionTitle.replace(/[^a-zA-Z0-9]/g, ' ');
  const camelCase = cleanTitle
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((word, i) => i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  let refSolution = '';
  if (lang === 'python') {
    refSolution = `def ${camelCase || 'solve'}(input_data):\n    # TODO: Implement optimal solution for ${questionTitle}\n    # Time Complexity: O(N)\n    # Space Complexity: O(1)\n    pass`;
  } else if (lang === 'cpp') {
    refSolution = `// Optimal solution for ${questionTitle}\n// Time: O(N), Space: O(1)\nauto ${camelCase || 'solve'}(auto& input_data) {\n    // Implement logic here\n    return 0;\n}`;
  } else if (lang === 'java') {
    refSolution = `// Optimal solution for ${questionTitle}\n// Time: O(N), Space: O(1)\npublic static int ${camelCase || 'solve'}(int[] nums) {\n    // Implement logic here\n    return 0;\n}`;
  } else {
    refSolution = `function ${camelCase || 'solve'}(input) {\n    // Optimal solution for ${questionTitle}\n    // Time Complexity: O(N)\n    // Space Complexity: O(1)\n    return 0;\n}`;
  }

  const titleLower = questionTitle.toLowerCase();
  if (titleLower.includes('smallest') || titleLower.includes('largest')) {
    const smallestSolutions = {
      python: `def getSecondSmallestAndLargest(arr):\n    if len(arr) < 2:\n        return -1\n    small = float('inf')\n    second_small = float('inf')\n    large = float('-inf')\n    second_large = float('-inf')\n    \n    for x in arr:\n        if x < small:\n            second_small = small\n            small = x\n        elif x < second_small and x != small:\n            second_small = x\n            \n        if x > large:\n            second_large = large\n            large = x\n        elif x > second_large and x != large:\n            second_large = x\n            \n    return [second_small, second_large]`,
      javascript: `function getSecondSmallestAndLargest(arr) {\n    if (arr.length < 2) return -1;\n    let small = Infinity, secondSmall = Infinity;\n    let large = -Infinity, secondLarge = -Infinity;\n    \n    for (let x of arr) {\n        if (x < small) {\n            secondSmall = small;\n            small = x;\n        } else if (x < secondSmall && x !== small) {\n            secondSmall = x;\n        }\n        \n        if (x > large) {\n            secondLarge = large;\n            large = x;\n        } else if (x > secondLarge && x !== large) {\n            secondLarge = x;\n        }\n    }\n    return [secondSmall, secondLarge];\n}`,
      cpp: `vector<int> getSecondSmallestAndLargest(vector<int>& arr) {\n    if (arr.size() < 2) return {-1, -1};\n    int small = INT_MAX, secondSmall = INT_MAX;\n    int large = INT_MIN, secondLarge = INT_MIN;\n    for (int x : arr) {\n        if (x < small) {\n            secondSmall = small;\n            small = x;\n        } else if (x < secondSmall && x != small) {\n            secondSmall = x;\n        }\n        if (x > large) {\n            secondLarge = large;\n            large = x;\n        } else if (x > secondLarge && x != large) {\n            secondLarge = x;\n        }\n    }\n    return {secondSmall, secondLarge};\n}`,
      java: `public static int[] getSecondSmallestAndLargest(int[] arr) {\n    if (arr.length < 2) return new int[]{-1, -1};\n    int small = Integer.MAX_VALUE, secondSmall = Integer.MAX_VALUE;\n    int large = Integer.MIN_VALUE, secondLarge = Integer.MIN_VALUE;\n    for (int x : arr) {\n        if (x < small) {\n            secondSmall = small;\n            small = x;\n        } else if (x < secondSmall && x != small) {\n            secondSmall = x;\n        }\n        if (x > large) {\n            secondLarge = large;\n            large = x;\n        } else if (x > secondLarge && x != large) {\n            secondLarge = x;\n        }\n    }\n    return new int[]{secondSmall, secondLarge};\n}`
    };
    refSolution = smallestSolutions[lang as keyof typeof smallestSolutions] || smallestSolutions.javascript;
  } else if (titleLower.includes('maximum subarray') || titleLower.includes('kadane')) {
    const solutions = {
      python: `def maxSubarray(nums):\n    max_sum = nums[0]\n    curr_sum = nums[0]\n    for x in nums[1:]:\n        curr_sum = max(x, curr_sum + x)\n        max_sum = max(max_sum, curr_sum)\n    return max_sum`,
      javascript: `function maxSubarray(nums) {\n    let max = nums[0], curr = nums[0];\n    for (let i = 1; i < nums.length; i++) {\n        curr = Math.max(nums[i], curr + nums[i]);\n        max = Math.max(max, curr);\n    }\n    return max;\n}`,
      cpp: `int maxSubarray(vector<int>& nums) {\n    int maxSum = nums[0], currSum = nums[0];\n    for (size_t i = 1; i < nums.size(); ++i) {\n        currSum = max(nums[i], currSum + nums[i]);\n        maxSum = max(maxSum, currSum);\n    }\n    return maxSum;\n}`,
      java: `public static int maxSubarray(int[] nums) {\n    int maxSum = nums[0], currSum = nums[0];\n    for (int i = 1; i < nums.length; ++i) {\n        currSum = Math.max(nums[i], currSum + nums[i]);\n        maxSum = Math.max(maxSum, currSum);\n    }\n    return maxSum;\n}`
    };
    refSolution = solutions[lang as keyof typeof solutions] || solutions.javascript;
  } else if (titleLower.includes('chocolate distribution')) {
    const solutions = {
      python: `def chocolateDistributionProblem(nums, m):\n    nums.sort()\n    min_diff = float('inf')\n    for i in range(len(nums) - m + 1):\n        min_diff = min(min_diff, nums[i+m-1] - nums[i])\n    return min_diff`,
      javascript: `function chocolateDistributionProblem(nums, m) {\n    nums.sort((a, b) => a - b);\n    let minDiff = Infinity;\n    for (let i = 0; i <= nums.length - m; i++) {\n        minDiff = Math.min(minDiff, nums[i + m - 1] - nums[i]);\n    }\n    return minDiff;\n}`,
      cpp: `int chocolateDistributionProblem(vector<int>& nums, int m) {\n    sort(nums.begin(), nums.end());\n    int min_diff = 1e9;\n    for (int i = 0; i <= nums.size() - m; i++) {\n        min_diff = min(min_diff, nums[i + m - 1] - nums[i]);\n    }\n    return min_diff;\n}`,
      java: `public static int chocolateDistributionProblem(int[] nums, int m) {\n    Arrays.sort(nums);\n    int minDiff = Integer.MAX_VALUE;\n    for (int i = 0; i <= nums.length - m; i++) {\n        minDiff = Math.min(minDiff, nums[i + m - 1] - nums[i]);\n    }\n    return minDiff;\n}`
    };
    refSolution = solutions[lang as keyof typeof solutions] || solutions.javascript;
  }

  return `### **AI Mentor Code Review & Reference Solution**\n\n**1. Analysis of Your Code:**\n* Ensure your function correctly parses input parameters and returns the target type.\n* Common pitfalls include off-by-one errors in loop boundaries and incorrect variable initializations.\n\n**2. Correct Reference Implementation (${lang.toUpperCase()}):**\n\`\`\`${lang}\n${refSolution}\n\`\`\``;
}

export default router;
