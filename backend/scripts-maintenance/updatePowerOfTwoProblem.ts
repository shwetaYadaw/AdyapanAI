import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function updatePowerOfTwoProblem() {
  try {
    // Delete old versions if they exist
    await prisma.question.deleteMany({
      where: {
        slug: {
          in: ['power-of-two', 'power-of-two-easy']
        }
      }
    }).catch(() => {});

    const powerOfTwoProblem = {
      title: 'Power of Two',
      slug: 'power-of-two',
      statement: `Given an integer n, return true if it is a power of two. Otherwise, return false.

An integer n is a power of two, if there exists an integer x such that n == 2^x.

### Example 1

**Input:**
\`\`\`
n = 1
\`\`\`

**Output:**
\`\`\`
true
\`\`\`

**Explanation:**
2^0 = 1

### Example 2

**Input:**
\`\`\`
n = 16
\`\`\`

**Output:**
\`\`\`
true
\`\`\`

**Explanation:**
2^4 = 16

### Example 3

**Input:**
\`\`\`
n = 3
\`\`\`

**Output:**
\`\`\`
false
\`\`\`

### Approach

A number is a power of two if:
1. It's greater than 0
2. In binary representation, it has exactly one bit set to 1

For example:
- 1 = 0001 (power of 2)
- 2 = 0010 (power of 2)
- 4 = 0100 (power of 2)
- 8 = 1000 (power of 2)
- 3 = 0011 (NOT a power of 2)
- 5 = 0101 (NOT a power of 2)

**Optimization:** Use bitwise operation: \`n & (n - 1) == 0\`
- For a power of 2, subtracting 1 flips all the bits after the single 1-bit
- AND-ing them results in 0`,
      difficulty: 'easy',
      topics: ['bit-manipulation', 'math'],
      companies: ['Google', 'Amazon', 'Facebook', 'Apple'],
      timeLimit: 1000,
      memoryLimit: 128,
      inputFormat: 'A single integer n where -2^31 <= n <= 2^31 - 1',
      outputFormat: 'Return true if n is a power of two, otherwise false.',
      constraints: '-2^31 <= n <= 2^31 - 1',
      sampleInput: '16',
      sampleOutput: 'true',
      templates: [
        {
          language: 'python',
          code: `def isPowerOfTwo(n: int) -> bool:\n    \"\"\"\n    Determine if n is a power of two.\n    \n    Approach:\n    A number is power of 2 if it has exactly one bit set.\n    Using bitwise trick: n & (n-1) == 0 and n > 0\n    \"\"\"\n    if n <= 0:\n        return False\n    \n    # If n is power of 2, n & (n-1) will be 0\n    # because n has only one bit set\n    return (n & (n - 1)) == 0\n\n# Main execution\nfs = require('fs')\nn = int(fs.readFileSync(0, 'utf-8').strip())\nprint(str(isPowerOfTwo(n)).lower())`
        },
        {
          language: 'javascript',
          code: `const fs = require('fs');\n\nfunction isPowerOfTwo(n) {\n    /**\n     * Determine if n is a power of two.\n     * \n     * Approach:\n     * A number is power of 2 if it has exactly one bit set.\n     * Using bitwise trick: n & (n-1) == 0 and n > 0\n     */\n    if (n <= 0) {\n        return false;\n    }\n    \n    // If n is power of 2, n & (n-1) will be 0\n    // because n has only one bit set\n    return (n & (n - 1)) === 0;\n}\n\n// Main execution\nconst input = fs.readFileSync(0, 'utf-8').trim();\nconst n = parseInt(input);\nconsole.log(isPowerOfTwo(n));`
        },
        {
          language: 'cpp',
          code: `#include <bits/stdc++.h>\nusing namespace std;\n\nbool isPowerOfTwo(int n) {\n    /**\n     * Determine if n is a power of two.\n     * \n     * Approach:\n     * A number is power of 2 if it has exactly one bit set.\n     * Using bitwise trick: n & (n-1) == 0 and n > 0\n     */\n    if (n <= 0) {\n        return false;\n    }\n    \n    // If n is power of 2, n & (n-1) will be 0\n    // because n has only one bit set\n    return (n & (n - 1)) == 0;\n}\n\nint main() {\n    int n;\n    cin >> n;\n    \n    cout << (isPowerOfTwo(n) ? \"true\" : \"false\") << \"\\n\";\n    \n    return 0;\n}`
        },
        {
          language: 'java',
          code: `import java.util.*;\nimport java.io.*;\n\nclass Solution {\n    /**\n     * Determine if n is a power of two.\n     * \n     * Approach:\n     * A number is power of 2 if it has exactly one bit set.\n     * Using bitwise trick: n & (n-1) == 0 and n > 0\n     */\n    public boolean isPowerOfTwo(int n) {\n        if (n <= 0) {\n            return false;\n        }\n        \n        // If n is power of 2, n & (n-1) will be 0\n        // because n has only one bit set\n        return (n & (n - 1)) == 0;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        int n = Integer.parseInt(br.readLine().trim());\n        \n        Solution sol = new Solution();\n        System.out.println(sol.isPowerOfTwo(n));\n    }\n}`
        }
      ],
      testCases: [
        {
          input: '1',
          output: 'true',
          isHidden: false
        },
        {
          input: '16',
          output: 'true',
          isHidden: false
        },
        {
          input: '3',
          output: 'false',
          isHidden: false
        },
        {
          input: '0',
          output: 'false',
          isHidden: true
        },
        {
          input: '-1',
          output: 'false',
          isHidden: true
        },
        {
          input: '1024',
          output: 'true',
          isHidden: true
        }
      ],
      xpReward: 4
    };

    const result = await prisma.question.upsert({
      where: { slug: powerOfTwoProblem.slug },
      update: powerOfTwoProblem,
      create: powerOfTwoProblem
    });

    console.log('✅ Power of Two problem created successfully!');
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

updatePowerOfTwoProblem();
