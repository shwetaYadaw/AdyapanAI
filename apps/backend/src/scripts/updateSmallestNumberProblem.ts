import { prisma } from '../config/prisma';
import { testCaseGeneratorService } from '../services/testCaseGenerator.service';

async function updateSmallestNumberProblem() {
  try {
    // Delete any existing problem with this slug to avoid duplicates
    await prisma.problem.deleteMany({
      where: { slug: 'smallest-number-with-given-digit-sum' }
    });

    // Generate dynamic test cases using the test case generator service
    const dynamicTestCases = testCaseGeneratorService.generateAndVerifyTestCases({
      problemSlug: 'smallest-number-with-given-digit-sum',
      visibleCount: 6,
      hiddenCount: 18,
    });

    console.log(`\n📊 Generated ${dynamicTestCases.length} test cases dynamically:`);
    console.log(`   - Visible: ${dynamicTestCases.filter(tc => !tc.isHidden).length}`);
    console.log(`   - Hidden: ${dynamicTestCases.filter(tc => tc.isHidden).length}\n`);

    const problem = await prisma.problem.create({
      data: {
        title: 'Smallest Number with Given Digit Count and Sum',
        slug: 'smallest-number-with-given-digit-sum',
        difficulty: 'MEDIUM',
        statement: `# Smallest Number with Given Digit Count and Sum

## Problem Statement

Given two integers \`s\` (digit sum) and \`d\` (digit count), find the **smallest possible number that has exactly d digits and a sum of digits equal to s**.

Return the number as a **string**. If no such number exists, return **"-1"**.

The smallest number means:
1. The number has minimum value (e.g., 18 is smaller than 81)
2. This is achieved by placing smaller digits in the front and larger digits at the back

## Examples

### Example 1: s = 9, d = 2
**Output:** "18"
- Need 2 digits with sum 9
- Smallest is 18 (1 + 8 = 9)

### Example 2: s = 20, d = 3
**Output:** "299"
- Need 3 digits with sum 20
- Smallest is 299 (2 + 9 + 9 = 20)

### Example 3: s = 0, d = 2
**Output:** "-1"
- Cannot have 2-digit number with sum 0 (minimum is 10, sum = 1)

## Algorithm

Use a greedy approach filling digits from right to left:
1. Validate: 1 <= s <= 9*d
2. Initialize digits with first = 1, rest = 0
3. Fill remaining digits from right to left with min(9, remaining_sum)
4. Add any leftover to the first digit

## Constraints
- 1 <= s <= 10^3
- 1 <= d <= 10^5`,

        inputFormat: `Two space-separated integers: s and d
Format: s d
where s = digit sum, d = digit count`,

        outputFormat: `A string representing the smallest number with d digits and digit sum s, or "-1" if impossible`,

        constraints: `1 <= s <= 10^3, 1 <= d <= 10^5`,

        timeLimit: 2000,
        memoryLimit: 256,
        topics: 'greedy, strings, math',
        companies: 'Amazon, Microsoft, Google, Adobe, Apple, Goldman Sachs, Flipkart',
        starterCode: {
          python: `def smallestNumberWithDigitSum(s, d):
    # Write your solution here
    pass`,
          javascript: `function smallestNumberWithDigitSum(s, d) {
    // Write your solution here
}`,
          cpp: `#include <iostream>
using namespace std;

string smallestNumberWithDigitSum(int s, int d) {
    // Write your solution here
}`,
          java: `public class Solution {
    public String smallestNumberWithDigitSum(int s, int d) {
        // Write your solution here
        return "";
    }
}`
        },
        referenceSolution: `def smallestNumberWithDigitSum(s, d):
    if s < 1 or s > 9 * d:
        return "-1"
    result = [0] * d
    result[0] = 1
    remaining = s - 1
    for i in range(d - 1, -1, -1):
        if remaining == 0:
            break
        add = min(9, remaining)
        result[i] += add
        remaining -= add
    result[0] += remaining
    return ''.join(map(str, result))`,
        testCases: {
          create: dynamicTestCases.map(tc => ({
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            isHidden: tc.isHidden,
            type: tc.type,
          }))
        }
      },
      include: { testCases: true }
    });

    console.log('✅ Smallest Number with Given Digit Sum problem created successfully!');
    console.log('Problem ID:', problem.id);
    console.log('Slug:', problem.slug);
    console.log('Difficulty:', problem.difficulty);
    console.log('Test Cases:', problem.testCases.length);
    console.log('\n✅ Dynamic test case generation complete and verified!');

  } catch (error) {
    console.error('❌ Error creating Smallest Number problem:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateSmallestNumberProblem();
