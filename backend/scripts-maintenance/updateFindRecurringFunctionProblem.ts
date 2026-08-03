import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function updateProblem() {
  try {
    const problemSlug = 'find-the-recurring-function-hashing';

    const problemData = {
      title: 'Sum of Natural Numbers',
      slug: problemSlug,
      difficulty: 'easy',
      topics: JSON.stringify(['hashing', 'recursion', 'mathematics']),
      statement: `## 📝 Problem Statement
Write a recursive function to find the sum of first n natural numbers.

Natural numbers are positive integers starting from 1: 1, 2, 3, 4, 5, ...

You need to implement a **recurring function** (recursive solution) that calculates the sum of the first n natural numbers.

**Problem Details:**
- Given a positive integer n
- Find the sum of first n natural numbers
- Return the sum as an integer
- Natural numbers start from 1 (not 0)

**Examples:**

Input: n = 3
Output: 6
Explanation: The sum of first 3 natural numbers is 1+2+3 = 6

Input: n = 7
Output: 28
Explanation: The sum of first 7 natural numbers is 1+2+3+4+5+6+7 = 28

Input: n = 1
Output: 1
Explanation: For n=1, sum is just 1

Input: n = 10
Output: 55
Explanation: 1+2+3+4+5+6+7+8+9+10 = 55

**Algorithm Approach:**
1. **Recursive Approach (Recommended):** Define a base case (when n=0 or n=1) and recursive case (n + sum(n-1))
   - Time Complexity: O(n)
   - Space Complexity: O(n) due to call stack
   
2. **Mathematical Formula:** Sum = n × (n+1) / 2
   - Time Complexity: O(1)
   - Space Complexity: O(1)

3. **Iterative Approach:** Loop from 1 to n and accumulate sum
   - Time Complexity: O(n)
   - Space Complexity: O(1)

**Recommended:** Implement the recursive approach as the primary solution.

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
      inputFormat: 'A single line containing integer n (positive integer).',
      outputFormat: 'Return the sum of first n natural numbers as a single integer.',
      constraints: '1 ≤ n ≤ 10^6\nFor large values, ensure your recursion depth doesn\'t exceed system limits or use iteration/formula',
      sampleInput: '3',
      sampleOutput: '6',
      testCases: JSON.stringify([
        { input: '3', output: '6', isHidden: false },
        { input: '7', output: '28', isHidden: false },
        { input: '10', output: '55', isHidden: false },
        { input: '1', output: '1', isHidden: true },
        { input: '2', output: '3', isHidden: true },
        { input: '100', output: '5050', isHidden: true },
        { input: '1000', output: '500500', isHidden: true },
        { input: '999999', output: '499999500000', isHidden: true }
      ]),
      timeLimit: 1000,
      memoryLimit: 128,
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
          xpReward: 200,
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
