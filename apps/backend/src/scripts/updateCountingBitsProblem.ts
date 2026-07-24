import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function updateCountingBitsProblem() {
  try {
    // Delete old versions if they exist
    await prisma.question.deleteMany({
      where: {
        slug: {
          in: ['counting-bits', 'counting-bits-dynamic-programming']
        }
      }
    }).catch(() => {});

    const countingBitsProblem = {
      title: 'Counting Bits',
      slug: 'counting-bits',
      statement: `Given an integer n, return an array ans of length n + 1 such that for each i (0 <= i <= n), ans[i] is the number of 1's in the binary representation of i.

### Example 1

**Input:**
\`\`\`
n = 2
\`\`\`

**Output:**
\`\`\`
[0, 1, 1]
\`\`\`

**Explanation:**

| i | Binary | Count of 1's |
|---|--------|-------------|
| 0 | 0 | 0 |
| 1 | 1 | 1 |
| 2 | 10 | 1 |

### Example 2

**Input:**
\`\`\`
n = 5
\`\`\`

**Output:**
\`\`\`
[0, 1, 1, 2, 1, 2]
\`\`\`

**Explanation:**

| i | Binary | Count of 1's |
|---|--------|-------------|
| 0 | 0 | 0 |
| 1 | 1 | 1 |
| 2 | 10 | 1 |
| 3 | 11 | 2 |
| 4 | 100 | 1 |
| 5 | 101 | 2 |

### Approach

**Method 1: Brute Force (O(n log n))**
- For each number from 0 to n, count the number of 1's in binary representation
- Use bit manipulation or built-in functions

**Method 2: Dynamic Programming - Optimal (O(n))**

**Pattern Observation:**
- f(0) = 0
- f(1) = 1
- f(2) = 1 (binary: 10, same as f(1))
- f(3) = 2 (binary: 11 = f(2) + 1)
- f(4) = 1 (binary: 100, same as f(2))
- f(5) = 2 (binary: 101 = f(4) + 1)

**Key Insight 1: Divide by 2**
\`\`\`
ans[i] = ans[i // 2] + i % 2
\`\`\`
- i // 2 removes the last bit
- i % 2 gives the last bit (0 or 1)

**Key Insight 2: i & (i-1)**
\`\`\`
ans[i] = ans[i & (i-1)] + 1
\`\`\`
- i & (i-1) removes the rightmost 1-bit
- So count of 1's in i = count of 1's in i & (i-1) + 1

**Key Insight 3: Most Significant Bit (MSB)**
\`\`\`
For i in range [2^k, 2^(k+1)):
ans[i] = 1 + ans[i - 2^k]
\`\`\`
- Any number in this range has 1 MSB and remaining bits same as smaller number

**Time Complexity:** O(n) - visit each number once
**Space Complexity:** O(n) - for the result array`,
      difficulty: 'easy',
      topics: ['bit-manipulation', 'dynamic-programming'],
      companies: ['Google', 'Amazon', 'Microsoft', 'Facebook', 'Apple'],
      timeLimit: 1000,
      memoryLimit: 128,
      inputFormat: 'An integer n where 0 <= n <= 10^5',
      outputFormat: 'Return an array ans of length n + 1 where ans[i] is the count of 1\'s in binary representation of i.',
      constraints: '0 <= n <= 10^5',
      sampleInput: '5',
      sampleOutput: '[0, 1, 1, 2, 1, 2]',
      templates: [
        {
          language: 'python',
          code: `def countBits(n: int) -> list:\n    \"\"\"\n    Count number of 1's in binary representation of each number from 0 to n.\n    \n    Approach: Dynamic Programming using i & (i-1) trick\n    - i & (i-1) removes the rightmost 1-bit from i\n    - So count of 1's in i = count in (i & (i-1)) + 1\n    \n    Time Complexity: O(n)\n    Space Complexity: O(n) for result array\n    \"\"\"\n    ans = [0] * (n + 1)\n    \n    for i in range(1, n + 1):\n        # i & (i-1) removes rightmost 1-bit\n        # So count of 1's = count in (i & (i-1)) + 1\n        ans[i] = ans[i & (i - 1)] + 1\n    \n    return ans\n\n# Alternative approaches:\n\n# Approach 2: Using i // 2 and i % 2\ndef countBits2(n: int) -> list:\n    ans = [0] * (n + 1)\n    for i in range(1, n + 1):\n        ans[i] = ans[i // 2] + i % 2\n    return ans\n\n# Approach 3: Using Brian Kernighan's algorithm for single number\ndef countBits3(n: int) -> list:\n    def count_ones(num):\n        count = 0\n        while num:\n            num &= num - 1\n            count += 1\n        return count\n    \n    return [count_ones(i) for i in range(n + 1)]\n\n# Main execution\nfs = require('fs')\nn = int(fs.readFileSync(0, 'utf-8').strip())\nprint(countBits(n))`
        },
        {
          language: 'javascript',
          code: `const fs = require('fs');\n\nfunction countBits(n) {\n    /**\n     * Count number of 1's in binary representation of each number from 0 to n.\n     * \n     * Approach: Dynamic Programming using i & (i-1) trick\n     * - i & (i-1) removes the rightmost 1-bit from i\n     * - So count of 1's in i = count in (i & (i-1)) + 1\n     * \n     * Time Complexity: O(n)\n     * Space Complexity: O(n) for result array\n     */\n    const ans = new Array(n + 1).fill(0);\n    \n    for (let i = 1; i <= n; i++) {\n        // i & (i-1) removes rightmost 1-bit\n        // So count of 1's = count in (i & (i-1)) + 1\n        ans[i] = ans[i & (i - 1)] + 1;\n    }\n    \n    return ans;\n}\n\n// Alternative approach: Using i >> 1 and i % 2\nfunction countBits2(n) {\n    const ans = new Array(n + 1).fill(0);\n    for (let i = 1; i <= n; i++) {\n        ans[i] = ans[i >> 1] + (i & 1);\n    }\n    return ans;\n}\n\n// Main execution\nconst input = fs.readFileSync(0, 'utf-8').trim();\nconst n = parseInt(input);\nconsole.log(JSON.stringify(countBits(n)));`
        },
        {
          language: 'cpp',
          code: `#include <bits/stdc++.h>\nusing namespace std;\n\nvector<int> countBits(int n) {\n    /**\n     * Count number of 1's in binary representation of each number from 0 to n.\n     * \n     * Approach: Dynamic Programming using i & (i-1) trick\n     * - i & (i-1) removes the rightmost 1-bit from i\n     * - So count of 1's in i = count in (i & (i-1)) + 1\n     * \n     * Time Complexity: O(n)\n     * Space Complexity: O(n) for result array\n     */\n    vector<int> ans(n + 1, 0);\n    \n    for (int i = 1; i <= n; i++) {\n        // i & (i-1) removes rightmost 1-bit\n        // So count of 1's = count in (i & (i-1)) + 1\n        ans[i] = ans[i & (i - 1)] + 1;\n    }\n    \n    return ans;\n}\n\nint main() {\n    int n;\n    cin >> n;\n    \n    vector<int> result = countBits(n);\n    \n    cout << \"[\";\n    for (int i = 0; i < result.size(); i++) {\n        cout << result[i];\n        if (i < result.size() - 1) cout << \", \";\n    }\n    cout << \"]\\n\";\n    \n    return 0;\n}`
        },
        {
          language: 'java',
          code: `import java.util.*;\nimport java.io.*;\n\npublic class Solution {\n    /**\n     * Count number of 1's in binary representation of each number from 0 to n.\n     * \n     * Approach: Dynamic Programming using i & (i-1) trick\n     * - i & (i-1) removes the rightmost 1-bit from i\n     * - So count of 1's in i = count in (i & (i-1)) + 1\n     * \n     * Time Complexity: O(n)\n     * Space Complexity: O(n) for result array\n     */\n    public int[] countBits(int n) {\n        int[] ans = new int[n + 1];\n        \n        for (int i = 1; i <= n; i++) {\n            // i & (i-1) removes rightmost 1-bit\n            // So count of 1's = count in (i & (i-1)) + 1\n            ans[i] = ans[i & (i - 1)] + 1;\n        }\n        \n        return ans;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        int n = Integer.parseInt(br.readLine().trim());\n        \n        Solution sol = new Solution();\n        int[] result = sol.countBits(n);\n        \n        System.out.print(\"[\");\n        for (int i = 0; i < result.length; i++) {\n            System.out.print(result[i]);\n            if (i < result.length - 1) System.out.print(\", \");\n        }\n        System.out.println(\"]\");\n    }\n}`
        }
      ],
      testCases: [
        {
          input: '2',
          output: '[0, 1, 1]',
          isHidden: false
        },
        {
          input: '5',
          output: '[0, 1, 1, 2, 1, 2]',
          isHidden: false
        },
        {
          input: '0',
          output: '[0]',
          isHidden: false
        },
        {
          input: '1',
          output: '[0, 1]',
          isHidden: true
        },
        {
          input: '7',
          output: '[0, 1, 1, 2, 1, 2, 2, 3]',
          isHidden: true
        },
        {
          input: '15',
          output: '[0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4]',
          isHidden: true
        }
      ],
      xpReward: 5
    };

    const result = await prisma.question.upsert({
      where: { slug: countingBitsProblem.slug },
      update: countingBitsProblem,
      create: countingBitsProblem
    });

    console.log('✅ Counting Bits problem created successfully!');
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

updateCountingBitsProblem();
