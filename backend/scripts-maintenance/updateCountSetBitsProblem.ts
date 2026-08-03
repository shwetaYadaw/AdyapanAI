import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function updateCountSetBitsProblem() {
  try {
    // Delete old versions if they exist
    await prisma.question.deleteMany({
      where: {
        slug: {
          in: ['count-total-set-bits', 'count-total-set-bits-easy']
        }
      }
    }).catch(() => {});

    const countSetBitsProblem = {
      title: 'Count Total Set Bits in First N Natural Numbers',
      slug: 'count-total-set-bits',
      statement: `Given a positive integer n, determine the total number of set bits (1s) in the binary representation of all numbers from 1 to n, inclusive.

### Example 1

**Input:**
\`\`\`
n = 3
\`\`\`

**Output:**
\`\`\`
4
\`\`\`

**Explanation:**

Numbers from 1 to 3: {1, 2, 3}

| Number | Binary | Set Bits |
|--------|--------|----------|
| 1 | 01 | 1 |
| 2 | 10 | 1 |
| 3 | 11 | 2 |

Total set bits from 1 to 3 = 1 + 1 + 2 = **4**

### Example 2

**Input:**
\`\`\`
n = 11
\`\`\`

**Output:**
\`\`\`
20
\`\`\`

**Explanation:**

Numbers from 1 to 11: {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11}

| Number | Binary | Set Bits |
|--------|--------|----------|
| 1 | 0001 | 1 |
| 2 | 0010 | 1 |
| 3 | 0011 | 2 |
| 4 | 0100 | 1 |
| 5 | 0101 | 2 |
| 6 | 0110 | 2 |
| 7 | 0111 | 3 |
| 8 | 1000 | 1 |
| 9 | 1001 | 2 |
| 10 | 1010 | 2 |
| 11 | 1011 | 3 |

Total set bits = 1 + 1 + 2 + 1 + 2 + 2 + 3 + 1 + 2 + 2 + 3 = **20**

### Approach

**Naive Approach (O(n log n)):**
- For each number from 1 to n, count set bits
- Sum all the counts

**Optimized Approach (O(log n)):**
- Find the pattern of set bits at each bit position
- Count contribution of each bit position separately
- For each bit position i (0-indexed from right):
  - Numbers repeat in a pattern: 2^(i+1) numbers per cycle
  - In each cycle: 2^i zeros followed by 2^i ones
  - Calculate how many complete cycles and remaining numbers
  - Sum the contributions

**Pattern Analysis:**
- Position 0 (rightmost): 0, 1, 0, 1, 0, 1... (alternates every 1 number)
- Position 1: 0, 0, 1, 1, 0, 0, 1, 1... (alternates every 2 numbers)
- Position 2: 0, 0, 0, 0, 1, 1, 1, 1... (alternates every 4 numbers)
- And so on...`,
      difficulty: 'medium',
      topics: ['bit-manipulation', 'math'],
      companies: ['Google', 'Amazon', 'Microsoft', 'Facebook'],
      timeLimit: 1000,
      memoryLimit: 128,
      inputFormat: 'A positive integer n',
      outputFormat: 'Return the total number of set bits in binary representations of all numbers from 1 to n.',
      constraints: '1 <= n <= 10^9',
      sampleInput: '11',
      sampleOutput: '20',
      templates: [
        {
          language: 'python',
          code: `def countSetBits(n: int) -> int:\n    \"\"\"\n    Count total set bits in numbers from 1 to n.\n    \n    Optimized approach: Analyze bit patterns\n    For each bit position, count how many times it's set in range [1, n]\n    \n    Time Complexity: O(log n)\n    Space Complexity: O(1)\n    \"\"\"\n    if n <= 0:\n        return 0\n    \n    totalSetBits = 0\n    powerOf2 = 1  # 2^i\n    \n    # Iterate through each bit position\n    while powerOf2 <= n:\n        # Complete cycles of 2*powerOf2\n        completeCycles = (n + 1) // (2 * powerOf2)\n        totalSetBits += completeCycles * powerOf2\n        \n        # Remaining numbers after complete cycles\n        remainder = (n + 1) % (2 * powerOf2)\n        # If remainder > powerOf2, extra set bits in this position\n        if remainder > powerOf2:\n            totalSetBits += remainder - powerOf2\n        \n        powerOf2 *= 2\n    \n    return totalSetBits\n\n# Main execution\nfs = require('fs')\nn = int(fs.readFileSync(0, 'utf-8').strip())\nprint(countSetBits(n))`
        },
        {
          language: 'javascript',
          code: `const fs = require('fs');\n\nfunction countSetBits(n) {\n    /**\n     * Count total set bits in numbers from 1 to n.\n     * \n     * Optimized approach: Analyze bit patterns\n     * For each bit position, count how many times it's set in range [1, n]\n     * \n     * Time Complexity: O(log n)\n     * Space Complexity: O(1)\n     */\n    if (n <= 0) {\n        return 0;\n    }\n    \n    let totalSetBits = 0;\n    let powerOf2 = 1; // 2^i\n    \n    // Iterate through each bit position\n    while (powerOf2 <= n) {\n        // Complete cycles of 2*powerOf2\n        const completeCycles = Math.floor((n + 1) / (2 * powerOf2));\n        totalSetBits += completeCycles * powerOf2;\n        \n        // Remaining numbers after complete cycles\n        const remainder = (n + 1) % (2 * powerOf2);\n        // If remainder > powerOf2, extra set bits in this position\n        if (remainder > powerOf2) {\n            totalSetBits += remainder - powerOf2;\n        }\n        \n        powerOf2 *= 2;\n    }\n    \n    return totalSetBits;\n}\n\n// Main execution\nconst input = fs.readFileSync(0, 'utf-8').trim();\nconst n = parseInt(input);\nconsole.log(countSetBits(n));`
        },
        {
          language: 'cpp',
          code: `#include <bits/stdc++.h>\nusing namespace std;\n\nlong long countSetBits(long long n) {\n    /**\n     * Count total set bits in numbers from 1 to n.\n     * \n     * Optimized approach: Analyze bit patterns\n     * For each bit position, count how many times it's set in range [1, n]\n     * \n     * Time Complexity: O(log n)\n     * Space Complexity: O(1)\n     */\n    if (n <= 0) {\n        return 0;\n    }\n    \n    long long totalSetBits = 0;\n    long long powerOf2 = 1; // 2^i\n    \n    // Iterate through each bit position\n    while (powerOf2 <= n) {\n        // Complete cycles of 2*powerOf2\n        long long completeCycles = (n + 1) / (2 * powerOf2);\n        totalSetBits += completeCycles * powerOf2;\n        \n        // Remaining numbers after complete cycles\n        long long remainder = (n + 1) % (2 * powerOf2);\n        // If remainder > powerOf2, extra set bits in this position\n        if (remainder > powerOf2) {\n            totalSetBits += remainder - powerOf2;\n        }\n        \n        powerOf2 *= 2;\n    }\n    \n    return totalSetBits;\n}\n\nint main() {\n    long long n;\n    cin >> n;\n    \n    cout << countSetBits(n) << \"\\n\";\n    \n    return 0;\n}`
        },
        {
          language: 'java',
          code: `public class Solution {\n    /**\n     * Count total set bits in numbers from 1 to n.\n     * \n     * Optimized approach: Analyze bit patterns\n     * For each bit position, count how many times it's set in range [1, n]\n     * \n     * Time Complexity: O(log n)\n     * Space Complexity: O(1)\n     */\n    public long countSetBits(long n) {\n        if (n <= 0) {\n            return 0;\n        }\n        \n        long totalSetBits = 0;\n        long powerOf2 = 1; // 2^i\n        \n        // Iterate through each bit position\n        while (powerOf2 <= n) {\n            // Complete cycles of 2*powerOf2\n            long completeCycles = (n + 1) / (2 * powerOf2);\n            totalSetBits += completeCycles * powerOf2;\n            \n            // Remaining numbers after complete cycles\n            long remainder = (n + 1) % (2 * powerOf2);\n            // If remainder > powerOf2, extra set bits in this position\n            if (remainder > powerOf2) {\n                totalSetBits += remainder - powerOf2;\n            }\n            \n            powerOf2 *= 2;\n        }\n        \n        return totalSetBits;\n    }\n}\n\nimport java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        long n = Long.parseLong(br.readLine().trim());\n        \n        Solution sol = new Solution();\n        System.out.println(sol.countSetBits(n));\n    }\n}`
        }
      ],
      testCases: [
        {
          input: '3',
          output: '4',
          isHidden: false
        },
        {
          input: '11',
          output: '20',
          isHidden: false
        },
        {
          input: '1',
          output: '1',
          isHidden: false
        },
        {
          input: '7',
          output: '12',
          isHidden: true
        },
        {
          input: '15',
          output: '33',
          isHidden: true
        },
        {
          input: '1000000000',
          output: '13421772800',
          isHidden: true
        }
      ],
      xpReward: 6
    };

    const result = await prisma.question.upsert({
      where: { slug: countSetBitsProblem.slug },
      update: countSetBitsProblem,
      create: countSetBitsProblem
    });

    console.log('✅ Count Total Set Bits problem created successfully!');
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

updateCountSetBitsProblem();
