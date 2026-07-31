import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function updateProblem() {
  try {
    const problemSlug = 'k-maximum-sum-combinations-from-two-arrays-hashing';

    const problemData = {
      title: 'K maximum sum combinations from two arrays',
      slug: problemSlug,
      difficulty: 'hard',
      topics: JSON.stringify(['hashing', 'arrays', 'heap']),
      statement: `## 📝 Problem Statement
Given two integer arrays a[] and b[] of the same length, and a positive integer k, the goal is to find the top k maximum sum combinations, where each combination is formed by adding one element from a and one from b. Each index from both arrays can be used at most once in a pair. Return the k largest sums in descending order.

**Problem Details:**
- Two arrays of integers: a[] and b[]
- Each combination pairs one element from a[] with one element from b[]
- Each index can be used at most once in a single pair
- Find the k largest possible sums
- Return results in descending order

**Algorithm Approach:**
1. **Brute Force Approach:**
   - Generate all n² possible combinations
   - Sort all combinations
   - Return top k
   - Time: O(n² log n), Space: O(n²)

2. **Max Heap Approach (Recommended):**
   - Sort both arrays
   - Use max heap to track the largest sums
   - Extract k times from heap
   - Time: O(n log n + k log n), Space: O(k)

3. **Two Pointers Approach:**
   - Sort both arrays
   - Use two pointers to find maximum combinations
   - Time: O(n log n + k), Space: O(k)

4. **Optimized Heap with Indices:**
   - Maintain heap of (sum, index_a, index_b) tuples
   - Use visited set to avoid duplicates
   - Time: O(n log n + k log k)

**Examples:**

Input: a[] = [3, 2], b[] = [1, 4], k = 2
Output: [7, 6]
Explanation: Possible sums: 3 + 1 = 4, 3 + 4 = 7, 2 + 1 = 3, 2 + 4 = 6. Top 2 sums are 7 and 6.

Input: a[] = [1, 4, 2, 3], b[] = [2, 5, 1, 6], k = 3
Output: [10, 9, 9]
Explanation: The top 3 maximum possible sums are: 4 + 6 = 10, 3 + 6 = 9, and 4 + 5 = 9.

**Time Complexity:** O(n log n + k log n) for optimized approach
**Space Complexity:** O(k) for storing k combinations

Complete the function to parse input and return the k maximum sum combinations.`,
      inputFormat: 'First line: n (length of both arrays). Second line: n space-separated integers for array a[]. Third line: n space-separated integers for array b[]. Fourth line: k (number of combinations to find).',
      outputFormat: 'Return k maximum sum combinations in descending order as space-separated integers on a single line.',
      constraints: '1 ≤ n ≤ 1000\n1 ≤ k ≤ min(n², 10000)\n-10^5 ≤ a[i], b[i] ≤ 10^5',
      sampleInput: '2\n3 2\n1 4\n2',
      sampleOutput: '7 6',
      testCases: JSON.stringify([
        { input: '2\n3 2\n1 4\n2', output: '7 6', isHidden: false },
        { input: '4\n1 4 2 3\n2 5 1 6\n3', output: '10 9 9', isHidden: false },
        { input: '3\n1 2 3\n1 2 3\n2', output: '6 5', isHidden: false },
        { input: '2\n5 10\n3 7\n2', output: '17 12', isHidden: true },
        { input: '3\n1 1 1\n1 1 1\n3', output: '2 2 2', isHidden: true },
        { input: '4\n10 20 15 25\n5 10 8 6\n4', output: '35 32 31 30', isHidden: true },
        { input: '3\n-5 -10 0\n1 2 3\n3', output: '3 2 1', isHidden: true },
        { input: '5\n100 200 50 150 75\n10 20 30 15 25\n5', output: '220 215 210 205 200', isHidden: true }
      ]),
      timeLimit: 2000,
      memoryLimit: 256,
    };

    const existingProblem = await prisma.question.findUnique({
      where: { slug: problemSlug },
    });

    if (existingProblem) {
      await prisma.question.update({
        where: { slug: problemSlug },
        data: problemData,
      });
      console.log(`✅ Updated problem: ${problemSlug}`);
    } else {
      await prisma.question.create({
        data: {
          ...problemData,
          xpReward: 500,
        },
      });
      console.log(`✅ Created problem: ${problemSlug}`);
    }

    console.log('✅ Problem update completed successfully!');
  } catch (error) {
    console.error('❌ Error updating problem:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

updateProblem();
