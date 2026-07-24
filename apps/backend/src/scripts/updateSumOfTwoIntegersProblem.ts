import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function updateSumOfTwoIntegersProblem() {
  try {
    // Delete old versions if they exist
    await prisma.question.deleteMany({
      where: {
        slug: {
          in: ['sum-of-two-integers', 'sum-of-two-integers-bit-manipulation']
        }
      }
    }).catch(() => {});

    const sumOfTwoIntegersProblem = {
      title: 'Sum of Two Integers',
      slug: 'sum-of-two-integers',
      statement: `Given two integers a and b, return the sum of the two integers without using the operators + and -.

### Example 1

**Input:**
\`\`\`
a = 1, b = 2
\`\`\`

**Output:**
\`\`\`
3
\`\`\`

### Example 2

**Input:**
\`\`\`
a = 2, b = 3
\`\`\`

**Output:**
\`\`\`
5
\`\`\`

### Approach

Since we cannot use + or -, we must use bitwise operations to simulate addition:

**Key Concepts:**

1. **XOR (a ^ b):** Gives sum without carry
   - 1 ^ 1 = 0
   - 1 ^ 0 = 1
   - 0 ^ 0 = 0

2. **AND (a & b):** Identifies where carry is needed
   - 1 & 1 = 1 (carry needed)
   - 1 & 0 = 0
   - 0 & 0 = 0

3. **Left Shift (<< 1):** Moves carry to next position

**Algorithm:**
\`\`\`
while b != 0:
    carry = (a & b) << 1
    a = a ^ b
    b = carry
return a
\`\`\`

**Example:**
\`\`\`
a = 5 (binary: 0101)
b = 3 (binary: 0011)

Iteration 1:
  XOR: 0101 ^ 0011 = 0110 (6)
  AND: 0101 & 0011 = 0001
  CARRY: 0001 << 1 = 0010 (2)
  a = 6, b = 2

Iteration 2:
  XOR: 0110 ^ 0010 = 0100 (4)
  AND: 0110 & 0010 = 0010
  CARRY: 0010 << 1 = 0100 (4)
  a = 4, b = 4

Iteration 3:
  XOR: 0100 ^ 0100 = 0000 (0)
  AND: 0100 & 0100 = 0100
  CARRY: 0100 << 1 = 1000 (8)
  a = 0, b = 8

Iteration 4:
  XOR: 0000 ^ 1000 = 1000 (8)
  AND: 0000 & 1000 = 0000
  CARRY: 0000 << 1 = 0000
  a = 8, b = 0

Result: 8 (5 + 3 = 8) ✓
\`\`\`

**Time Complexity:** O(1) - maximum 32 iterations for 32-bit integers
**Space Complexity:** O(1) - only using constants`,
      difficulty: 'medium',
      topics: ['bit-manipulation'],
      companies: ['Google', 'Amazon', 'Microsoft', 'Facebook', 'Apple', 'Bloomberg'],
      timeLimit: 1000,
      memoryLimit: 128,
      inputFormat: 'Two integers a and b where -1000 <= a, b <= 1000',
      outputFormat: 'Return the sum of a and b without using + or - operators.',
      constraints: '-1000 <= a, b <= 1000',
      sampleInput: '1 2',
      sampleOutput: '3',
      templates: [
        {
          language: 'python',
          code: `def getSum(a: int, b: int) -> int:\n    \"\"\"\n    Add two integers using bitwise operations without + or -.\n    \n    Approach:\n    - XOR gives sum without carry (a ^ b)\n    - AND identifies where carry is needed (a & b)\n    - Left shift moves carry to next position ((a & b) << 1)\n    - Repeat until no carry remains\n    \n    Time Complexity: O(1) - max 32 iterations\n    Space Complexity: O(1)\n    \"\"\"\n    # In Python, integers have unlimited bits, so we need to handle this\n    # We'll use a 32-bit mask to simulate 32-bit integers\n    MASK = 0xFFFFFFFF\n    \n    # Convert to 32-bit if negative (two's complement)\n    a, b = a & MASK, b & MASK\n    \n    while b != 0:\n        # Calculate carry\n        carry = ((a & b) << 1) & MASK\n        # XOR gives sum without carry\n        a = (a ^ b) & MASK\n        # Move to next iteration\n        b = carry\n    \n    # Convert back to signed if result is negative\n    # If the sign bit is set, convert from two's complement\n    if a >= 2**31:\n        return ~(a ^ MASK)\n    return a\n\n# Main execution\nfs = require('fs')\nline = fs.readFileSync(0, 'utf-8').strip()\na, b = map(int, line.split())\nprint(getSum(a, b))`
        },
        {
          language: 'javascript',
          code: `const fs = require('fs');\n\nfunction getSum(a, b) {\n    /**\n     * Add two integers using bitwise operations without + or -.\n     * \n     * Approach:\n     * - XOR gives sum without carry (a ^ b)\n     * - AND identifies where carry is needed (a & b)\n     * - Left shift moves carry to next position ((a & b) << 1)\n     * - Repeat until no carry remains\n     * \n     * Time Complexity: O(1) - max 32 iterations\n     * Space Complexity: O(1)\n     */\n    while (b !== 0) {\n        // Calculate carry using AND and left shift\n        // In JavaScript, bitwise operations work on 32-bit signed integers\n        const carry = (a & b) << 1;\n        \n        // XOR gives sum without carry\n        a = a ^ b;\n        \n        // Move carry for next iteration\n        b = carry;\n    }\n    \n    return a;\n}\n\n// Main execution\nconst input = fs.readFileSync(0, 'utf-8').trim();\nconst [a, b] = input.split(' ').map(Number);\nconsole.log(getSum(a, b));`
        },
        {
          language: 'cpp',
          code: `#include <bits/stdc++.h>\nusing namespace std;\n\nint getSum(int a, int b) {\n    /**\n     * Add two integers using bitwise operations without + or -.\n     * \n     * Approach:\n     * - XOR gives sum without carry (a ^ b)\n     * - AND identifies where carry is needed (a & b)\n     * - Left shift moves carry to next position ((a & b) << 1)\n     * - Repeat until no carry remains\n     * \n     * Time Complexity: O(1) - max 32 iterations\n     * Space Complexity: O(1)\n     */\n    while (b != 0) {\n        // Calculate carry using AND and left shift\n        unsigned int carry = (unsigned int)(a & b) << 1;\n        \n        // XOR gives sum without carry\n        a = a ^ b;\n        \n        // Move carry for next iteration\n        b = carry;\n    }\n    \n    return a;\n}\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    \n    cout << getSum(a, b) << \"\\n\";\n    \n    return 0;\n}`
        },
        {
          language: 'java',
          code: `public class Solution {\n    /**\n     * Add two integers using bitwise operations without + or -.\n     * \n     * Approach:\n     * - XOR gives sum without carry (a ^ b)\n     * - AND identifies where carry is needed (a & b)\n     * - Left shift moves carry to next position ((a & b) << 1)\n     * - Repeat until no carry remains\n     * \n     * Time Complexity: O(1) - max 32 iterations\n     * Space Complexity: O(1)\n     */\n    public int getSum(int a, int b) {\n        while (b != 0) {\n            // Calculate carry using AND and left shift\n            int carry = (a & b) << 1;\n            \n            // XOR gives sum without carry\n            a = a ^ b;\n            \n            // Move carry for next iteration\n            b = carry;\n        }\n        \n        return a;\n    }\n}\n\nimport java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String[] input = br.readLine().trim().split(\" \");\n        int a = Integer.parseInt(input[0]);\n        int b = Integer.parseInt(input[1]);\n        \n        Solution sol = new Solution();\n        System.out.println(sol.getSum(a, b));\n    }\n}`
        }
      ],
      testCases: [
        {
          input: '1 2',
          output: '3',
          isHidden: false
        },
        {
          input: '2 3',
          output: '5',
          isHidden: false
        },
        {
          input: '0 0',
          output: '0',
          isHidden: false
        },
        {
          input: '-1 1',
          output: '0',
          isHidden: true
        },
        {
          input: '5 3',
          output: '8',
          isHidden: true
        },
        {
          input: '-1000 1000',
          output: '0',
          isHidden: true
        }
      ],
      xpReward: 7
    };

    const result = await prisma.question.upsert({
      where: { slug: sumOfTwoIntegersProblem.slug },
      update: sumOfTwoIntegersProblem,
      create: sumOfTwoIntegersProblem
    });

    console.log('✅ Sum of Two Integers problem created successfully!');
    console.log('Problem:', result.title);
    console.log('Slug:', result.slug);
    console.log('Difficulty:', result.difficulty);
    
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to create problem:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

updateSumOfTwoIntegersProblem();
