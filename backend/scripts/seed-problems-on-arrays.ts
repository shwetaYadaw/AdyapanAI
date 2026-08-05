import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { prisma } from '../src/config/prisma';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface QuestionDef {
  title: string;
  difficulty: string;
  statement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  referenceSolution: string;
  testCases: { input: string; output: string; isHidden?: boolean; explanation?: string }[];
}

const PROBLEMS: QuestionDef[] = [
  {
    title: 'Find Minimum and Maximum Element in Array',
    difficulty: 'easy',
    statement: 'Given an array of N integers, write a program to find the minimum and maximum elements in the array.',
    inputFormat: 'The first line contains an integer N representing size of array.\nThe second line contains N space-separated integers.',
    outputFormat: 'Print the minimum element followed by space and maximum element.',
    constraints: '1 <= N <= 10^5\n-10^9 <= Arr[i] <= 10^9',
    referenceSolution: `function solve(input) {
  const lines = input.trim().split('\\n');
  const n = parseInt(lines[0]);
  const arr = lines[1].trim().split(/\\s+/).map(Number);
  let min = arr[0], max = arr[0];
  for (let i = 1; i < n; i++) {
    if (arr[i] < min) min = arr[i];
    if (arr[i] > max) max = arr[i];
  }
  console.log(min + ' ' + max);
}`,
    testCases: [
      { input: '5\n3 2 1 56 1000', output: '1 1000', isHidden: false, explanation: '1 is minimum and 1000 is maximum' },
      { input: '6\n1 345 234 21 5678 9', output: '1 5678', isHidden: false },
      { input: '4\n-10 -20 -30 -5', output: '-30 -5', isHidden: true },
      { input: '1\n42', output: '42 42', isHidden: true }
    ]
  },
  {
    title: 'Reverse an Array',
    difficulty: 'easy',
    statement: 'Given an array of N integers, write a program to reverse the array.',
    inputFormat: 'The first line contains an integer N.\nThe second line contains N space-separated integers.',
    outputFormat: 'Print the space-separated elements of the reversed array.',
    constraints: '1 <= N <= 10^5\n-10^5 <= Arr[i] <= 10^5',
    referenceSolution: `function solve(input) {
  const lines = input.trim().split('\\n');
  const n = parseInt(lines[0]);
  const arr = lines[1].trim().split(/\\s+/);
  console.log(arr.reverse().join(' '));
}`,
    testCases: [
      { input: '4\n1 2 3 4', output: '4 3 2 1', isHidden: false },
      { input: '5\n10 20 30 40 50', output: '50 40 30 20 10', isHidden: false },
      { input: '3\n7 7 7', output: '7 7 7', isHidden: true }
    ]
  },
  {
    title: 'Sum of All Elements in Array',
    difficulty: 'easy',
    statement: 'Given an array of N integers, calculate and print the sum of all elements present in the array.',
    inputFormat: 'The first line contains N.\nThe second line contains N space-separated integers.',
    outputFormat: 'Print a single integer representing the sum.',
    constraints: '1 <= N <= 10^5\n-10^4 <= Arr[i] <= 10^4',
    referenceSolution: `function solve(input) {
  const lines = input.trim().split('\\n');
  const n = parseInt(lines[0]);
  const arr = lines[1].trim().split(/\\s+/).map(Number);
  const sum = arr.reduce((acc, curr) => acc + curr, 0);
  console.log(sum);
}`,
    testCases: [
      { input: '5\n1 2 3 4 5', output: '15', isHidden: false },
      { input: '3\n10 -5 15', output: '20', isHidden: false },
      { input: '4\n100 200 300 400', output: '1000', isHidden: true }
    ]
  },
  {
    title: 'Count Even and Odd Numbers in Array',
    difficulty: 'easy',
    statement: 'Given an array of N positive integers, count the number of even integers and odd integers in the array.',
    inputFormat: 'The first line contains N.\nThe second line contains N space-separated integers.',
    outputFormat: 'Print two space-separated integers: count of even numbers and count of odd numbers.',
    constraints: '1 <= N <= 10^5\n1 <= Arr[i] <= 10^9',
    referenceSolution: `function solve(input) {
  const lines = input.trim().split('\\n');
  const n = parseInt(lines[0]);
  const arr = lines[1].trim().split(/\\s+/).map(Number);
  let even = 0, odd = 0;
  for (let num of arr) {
    if (num % 2 === 0) even++;
    else odd++;
  }
  console.log(even + ' ' + odd);
}`,
    testCases: [
      { input: '6\n1 2 3 4 5 6', output: '3 3', isHidden: false },
      { input: '5\n2 4 6 8 10', output: '5 0', isHidden: false },
      { input: '4\n1 3 5 7', output: '0 4', isHidden: true }
    ]
  },
  {
    title: 'Check if Array is Sorted',
    difficulty: 'easy',
    statement: 'Given an array of N integers, check whether the array is sorted in non-decreasing (ascending) order. Print "YES" if sorted, else "NO".',
    inputFormat: 'First line contains N.\nSecond line contains N space-separated integers.',
    outputFormat: 'Print "YES" or "NO".',
    constraints: '1 <= N <= 10^5\n-10^9 <= Arr[i] <= 10^9',
    referenceSolution: `function solve(input) {
  const lines = input.trim().split('\\n');
  const n = parseInt(lines[0]);
  const arr = lines[1].trim().split(/\\s+/).map(Number);
  let isSorted = true;
  for (let i = 0; i < n - 1; i++) {
    if (arr[i] > arr[i + 1]) {
      isSorted = false;
      break;
    }
  }
  console.log(isSorted ? 'YES' : 'NO');
}`,
    testCases: [
      { input: '5\n10 20 30 40 50', output: 'YES', isHidden: false },
      { input: '5\n10 20 15 40 50', output: 'NO', isHidden: false },
      { input: '1\n100', output: 'YES', isHidden: true }
    ]
  },
  {
    title: 'Find Second Largest Element in Array',
    difficulty: 'easy',
    statement: 'Given an array of N distinct integers, find the second largest element in the array. If no such element exists, print -1.',
    inputFormat: 'First line contains N.\nSecond line contains N space-separated integers.',
    outputFormat: 'Print the second largest element.',
    constraints: '2 <= N <= 10^5\n-10^9 <= Arr[i] <= 10^9',
    referenceSolution: `function solve(input) {
  const lines = input.trim().split('\\n');
  const n = parseInt(lines[0]);
  const arr = lines[1].trim().split(/\\s+/).map(Number);
  let largest = -Infinity, second = -Infinity;
  for (let num of arr) {
    if (num > largest) {
      second = largest;
      largest = num;
    } else if (num > second && num !== largest) {
      second = num;
    }
  }
  console.log(second === -Infinity ? -1 : second);
}`,
    testCases: [
      { input: '6\n12 35 1 10 34 1', output: '34', isHidden: false },
      { input: '5\n10 5 10 10 10', output: '5', isHidden: false },
      { input: '2\n10 20', output: '10', isHidden: true }
    ]
  },
  {
    title: 'Linear Search in Array',
    difficulty: 'easy',
    statement: 'Given an array of N elements and a target element K, find the 0-based index of key K in the array. If K is not present, print -1.',
    inputFormat: 'First line contains two integers N and K.\nSecond line contains N space-separated integers.',
    outputFormat: 'Print the 0-based index of K or -1.',
    constraints: '1 <= N <= 10^5\n-10^9 <= Arr[i], K <= 10^9',
    referenceSolution: `function solve(input) {
  const lines = input.trim().split('\\n');
  const [n, k] = lines[0].trim().split(/\\s+/).map(Number);
  const arr = lines[1].trim().split(/\\s+/).map(Number);
  const index = arr.indexOf(k);
  console.log(index);
}`,
    testCases: [
      { input: '5 15\n10 20 15 30 40', output: '2', isHidden: false },
      { input: '4 100\n1 2 3 4', output: '-1', isHidden: false },
      { input: '5 5\n5 4 3 2 1', output: '0', isHidden: true }
    ]
  },
  {
    title: 'Move All Zeros to End of Array',
    difficulty: 'easy',
    statement: 'Given an array of N integers, move all the zeros to the end of the array while maintaining the relative order of non-zero elements.',
    inputFormat: 'First line contains N.\nSecond line contains N space-separated integers.',
    outputFormat: 'Print space-separated elements of the modified array.',
    constraints: '1 <= N <= 10^5\n-10^5 <= Arr[i] <= 10^5',
    referenceSolution: `function solve(input) {
  const lines = input.trim().split('\\n');
  const n = parseInt(lines[0]);
  const arr = lines[1].trim().split(/\\s+/).map(Number);
  const nonZeros = arr.filter(x => x !== 0);
  const zerosCount = n - nonZeros.length;
  const result = [...nonZeros, ...Array(zerosCount).fill(0)];
  console.log(result.join(' '));
}`,
    testCases: [
      { input: '6\n0 1 0 3 12 0', output: '1 3 12 0 0 0', isHidden: false },
      { input: '4\n1 2 3 4', output: '1 2 3 4', isHidden: false },
      { input: '5\n0 0 0 0 1', output: '1 0 0 0 0', isHidden: true }
    ]
  },
  {
    title: 'Find Missing Number in Array',
    difficulty: 'easy',
    statement: 'Given an array containing N-1 distinct numbers in the range of 1 to N, find the single missing number.',
    inputFormat: 'First line contains N.\nSecond line contains N-1 space-separated integers.',
    outputFormat: 'Print the missing integer.',
    constraints: '2 <= N <= 10^5',
    referenceSolution: `function solve(input) {
  const lines = input.trim().split('\\n');
  const n = parseInt(lines[0]);
  const arr = lines[1].trim().split(/\\s+/).map(Number);
  const expectedSum = (n * (n + 1)) / 2;
  const actualSum = arr.reduce((a, b) => a + b, 0);
  console.log(expectedSum - actualSum);
}`,
    testCases: [
      { input: '5\n1 2 4 5', output: '3', isHidden: false },
      { input: '2\n1', output: '2', isHidden: false },
      { input: '6\n1 2 3 5 6', output: '4', isHidden: true }
    ]
  },
  {
    title: 'Find Frequency of an Element',
    difficulty: 'easy',
    statement: 'Given an array of N integers and a target integer X, find how many times X appears in the array.',
    inputFormat: 'First line contains N and X.\nSecond line contains N space-separated integers.',
    outputFormat: 'Print the total frequency of X.',
    constraints: '1 <= N <= 10^5\n-10^9 <= Arr[i], X <= 10^9',
    referenceSolution: `function solve(input) {
  const lines = input.trim().split('\\n');
  const [n, x] = lines[0].trim().split(/\\s+/).map(Number);
  const arr = lines[1].trim().split(/\\s+/).map(Number);
  const count = arr.filter(num => num === x).length;
  console.log(count);
}`,
    testCases: [
      { input: '6 2\n1 2 2 3 2 4', output: '3', isHidden: false },
      { input: '5 10\n1 2 3 4 5', output: '0', isHidden: false },
      { input: '4 7\n7 7 7 7', output: '4', isHidden: true }
    ]
  },
  {
    title: 'Single Number (Element Appears Once)',
    difficulty: 'easy',
    statement: 'Given a non-empty array of N integers where every element appears twice except for one element which appears once. Find that single element.',
    inputFormat: 'First line contains N.\nSecond line contains N space-separated integers.',
    outputFormat: 'Print the single non-repeating integer.',
    constraints: '1 <= N <= 10^5 (N is odd)',
    referenceSolution: `function solve(input) {
  const lines = input.trim().split('\\n');
  const n = parseInt(lines[0]);
  const arr = lines[1].trim().split(/\\s+/).map(Number);
  let res = 0;
  for (let num of arr) res ^= num;
  console.log(res);
}`,
    testCases: [
      { input: '5\n4 1 2 1 2', output: '4', isHidden: false },
      { input: '3\n2 2 1', output: '1', isHidden: false },
      { input: '1\n99', output: '99', isHidden: true }
    ]
  },
  {
    title: 'Rotate Array Right by K Steps',
    difficulty: 'easy',
    statement: 'Given an array of N integers, rotate the array to the right by K steps, where K is non-negative.',
    inputFormat: 'First line contains N and K.\nSecond line contains N space-separated integers.',
    outputFormat: 'Print space-separated elements of rotated array.',
    constraints: '1 <= N <= 10^5\n0 <= K <= 10^5',
    referenceSolution: `function solve(input) {
  const lines = input.trim().split('\\n');
  const [n, kRaw] = lines[0].trim().split(/\\s+/).map(Number);
  const arr = lines[1].trim().split(/\\s+/).map(Number);
  const k = kRaw % n;
  const rotated = [...arr.slice(n - k), ...arr.slice(0, n - k)];
  console.log(rotated.join(' '));
}`,
    testCases: [
      { input: '5 2\n1 2 3 4 5', output: '4 5 1 2 3', isHidden: false },
      { input: '7 3\n1 2 3 4 5 6 7', output: '5 6 7 1 2 3 4', isHidden: false },
      { input: '3 4\n10 20 30', output: '30 10 20', isHidden: true }
    ]
  }
];

async function seedProblemsOnArrays() {
  console.log('🌱 Starting to seed "Problems on Arrays" topic and fresher problems...\n');

  const TOPIC_NAME = 'Problems on Arrays';

  // 1. Ensure Topic exists in Topic table for both tcs-nqt and coding-arena
  for (const system of ['tcs-nqt', 'coding-arena', 'aptitude']) {
    try {
      const existing = await prisma.topic.findFirst({
        where: { name: TOPIC_NAME, system: system as any }
      });
      if (!existing) {
        await prisma.topic.create({
          data: {
            name: TOPIC_NAME,
            system: system as any,
            description: 'Fresher-level practice problems on Arrays',
            order: 0,
            isActive: true
          }
        });
      } else {
        await prisma.topic.update({
          where: { id: existing.id },
          data: { isActive: true, description: 'Fresher-level practice problems on Arrays' }
        });
      }
      console.log(`✅ Topic "${TOPIC_NAME}" ready for system: ${system}`);
    } catch (err: any) {
      console.warn(`⚠️ Warning setting topic for ${system}:`, err.message);
    }
  }

  let tcsCreated = 0;
  let arenaCreated = 0;

  for (const prob of PROBLEMS) {
    const slugBase = slugify(prob.title);
    const tcsSlug = `${slugBase}-fresher-array-tcs`;
    const arenaSlug = `${slugBase}-fresher-array`;

    // A. Seed into TcsNqtQuestion table
    try {
      const existingTcs = await prisma.tcsNqtQuestion.findUnique({
        where: { slug: tcsSlug }
      });

      if (!existingTcs) {
        await prisma.tcsNqtQuestion.create({
          data: {
            title: prob.title,
            slug: tcsSlug,
            difficulty: prob.difficulty,
            topic: TOPIC_NAME,
            statement: prob.statement,
            inputFormat: prob.inputFormat,
            outputFormat: prob.outputFormat,
            constraints: prob.constraints,
            referenceSolution: prob.referenceSolution,
            testCases: prob.testCases as any,
            companies: 'TCS, Wipro, Infosys, Accenture, Cognizant',
            xpReward: 10
          }
        });
      } else {
        await prisma.tcsNqtQuestion.update({
          where: { id: existingTcs.id },
          data: {
            title: prob.title,
            difficulty: prob.difficulty,
            topic: TOPIC_NAME,
            statement: prob.statement,
            inputFormat: prob.inputFormat,
            outputFormat: prob.outputFormat,
            constraints: prob.constraints,
            referenceSolution: prob.referenceSolution,
            testCases: prob.testCases as any
          }
        });
      }
      tcsCreated++;
    } catch (err: any) {
      console.error(`❌ Error creating TCS question "${prob.title}":`, err.message || err);
    }

    // B. Seed into Problem table (Coding Arena)
    try {
      const existingProblem = await prisma.problem.findUnique({
        where: { slug: arenaSlug }
      });

      const starterCodeJson = {
        javascript: `function solve() {\n    // Write your code here\n}\nsolve();`,
        python: `def solve():\n    # Write your code here\n    pass\nsolve()`,
        java: `import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your code here\n    }\n}`,
        cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    // Write your code here\n    return 0;\n}`
      };

      if (!existingProblem) {
        await prisma.problem.create({
          data: {
            title: prob.title,
            slug: arenaSlug,
            difficulty: prob.difficulty,
            statement: prob.statement,
            constraints: prob.constraints,
            inputFormat: prob.inputFormat,
            outputFormat: prob.outputFormat,
            timeLimit: 2000,
            memoryLimit: 256,
            starterCode: starterCodeJson,
            referenceSolution: prob.referenceSolution,
            topics: TOPIC_NAME,
            companies: 'TCS, Wipro, Infosys, Accenture, Cognizant',
            tags: 'Arrays,Fresher,Easy',
            category: 'fresher',
            testCases: {
              create: prob.testCases.map((tc, idx) => ({
                input: tc.input,
                expectedOutput: tc.output,
                isHidden: tc.isHidden || false,
                type: tc.isHidden ? 'hidden' : 'sample',
                explanation: tc.explanation || null,
                order: idx
              }))
            }
          }
        });
        arenaCreated++;
      } else {
        await prisma.problem.update({
          where: { id: existingProblem.id },
          data: {
            title: prob.title,
            difficulty: prob.difficulty,
            statement: prob.statement,
            constraints: prob.constraints,
            inputFormat: prob.inputFormat,
            outputFormat: prob.outputFormat,
            topics: TOPIC_NAME,
            category: 'fresher'
          }
        });
        arenaCreated++;
      }
    } catch (err: any) {
      console.error(`❌ Error creating Problem "${prob.title}":`, err.message || err);
    }
  }

  console.log('\n==================================================');
  console.log('✨ SEEDING COMPLETE FOR "Problems on Arrays"');
  console.log(`   Topic: ${TOPIC_NAME}`);
  console.log(`   TCS/Placement Prep Questions created/updated: ${tcsCreated}`);
  console.log(`   Coding Arena Problems created/updated: ${arenaCreated}`);
  console.log('==================================================\n');
}

seedProblemsOnArrays()
  .catch((err) => {
    console.error('Error seeding array problems:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
