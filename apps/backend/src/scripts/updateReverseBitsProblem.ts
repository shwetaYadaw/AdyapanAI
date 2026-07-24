import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function updateReverseBitsProblem() {
  try {
    // Delete old versions if they exist
    await prisma.question.deleteMany({
      where: {
        slug: {
          in: ['reverse-bits', 'reverse-bits-easy']
        }
      }
    }).catch(() => {});

    const reverseBitsProblem = {
      title: 'Reverse Bits',
      slug: 'reverse-bits',
      statement: `Reverse bits of a given 32-bit signed integer.

### Example 1

**Input:**
\`\`\`
n = 43261596
\`\`\`

**Output:**
\`\`\`
964176192
\`\`\`

**Explanation:**

| | Integer | Binary |
|---|---------|--------|
| Input | 43261596 | 00000010100101000001111010011100 |
| Output | 964176192 | 00111001011110000010100101000000 |

### Example 2

**Input:**
\`\`\`
n = 2147483644
\`\`\`

**Output:**
\`\`\`
1073741822
\`\`\`

**Explanation:**

| | Integer | Binary |
|---|---------|--------|
| Input | 2147483644 | 01111111111111111111111111111100 |
| Output | 1073741822 | 00111111111111111111111111111110 |

### Approach

To reverse the bits of a 32-bit integer:

1. **Bit Extraction & Reversal:**
   - Extract each bit from the input number starting from the least significant bit (LSB)
   - Place each extracted bit in the result starting from the most significant bit (MSB)
   - Shift the input right to get the next bit
   - Shift the result left to make room for the next bit

2. **Algorithm:**
   - Initialize result = 0
   - For 32 iterations:
     - Extract the last bit of n: \`bit = n & 1\`
     - Add it to result at the left: \`result = (result << 1) | bit\`
     - Shift n right: \`n = n >> 1\`

3. **Time Complexity:** O(1) - constant 32 iterations
4. **Space Complexity:** O(1) - only using a few variables`,
      difficulty: 'easy',
      topics: ['bit-manipulation'],
      companies: ['Google', 'Apple', 'Amazon', 'Microsoft', 'Facebook'],
      timeLimit: 1000,
      memoryLimit: 128,
      inputFormat: 'A 32-bit signed integer n where 0 <= n <= 2^31 - 2',
      outputFormat: 'Return the integer obtained by reversing the bits of n.',
      constraints: '0 <= n <= 2^31 - 2\nn is even.',
      sampleInput: '43261596',
      sampleOutput: '964176192',
      templates: [
        {
          language: 'python',
          code: `def reverseBits(n: int) -> int:\n    \"\"\"\n    Reverse bits of a 32-bit unsigned integer.\n    \n    Approach:\n    Extract each bit from right to left and build result from left to right.\n    \"\"\"\n    result = 0\n    \n    # Process 32 bits\n    for _ in range(32):\n        # Extract the rightmost bit of n\n        bit = n & 1\n        \n        # Shift result left and add the extracted bit\n        result = (result << 1) | bit\n        \n        # Shift n right to process next bit\n        n = n >> 1\n    \n    return result\n\n# Main execution\nfs = require('fs')\nn = int(fs.readFileSync(0, 'utf-8').strip())\nprint(reverseBits(n))`
        },
        {
          language: 'javascript',
          code: `const fs = require('fs');\n\nfunction reverseBits(n) {\n    /**\n     * Reverse bits of a 32-bit unsigned integer.\n     * \n     * Approach:\n     * Extract each bit from right to left and build result from left to right.\n     */\n    let result = 0;\n    \n    // Process 32 bits\n    for (let i = 0; i < 32; i++) {\n        // Extract the rightmost bit of n\n        const bit = n & 1;\n        \n        // Shift result left and add the extracted bit\n        result = (result << 1) | bit;\n        \n        // Shift n right to process next bit (use >>> for unsigned right shift)\n        n = n >>> 1;\n    }\n    \n    // Convert to unsigned 32-bit integer\n    return result >>> 0;\n}\n\n// Main execution\nconst input = fs.readFileSync(0, 'utf-8').trim();\nconst n = parseInt(input);\nconsole.log(reverseBits(n));`
        },
        {
          language: 'cpp',
          code: `#include <bits/stdc++.h>\nusing namespace std;\n\nuint32_t reverseBits(uint32_t n) {\n    /**\n     * Reverse bits of a 32-bit unsigned integer.\n     * \n     * Approach:\n     * Extract each bit from right to left and build result from left to right.\n     */\n    uint32_t result = 0;\n    \n    // Process 32 bits\n    for (int i = 0; i < 32; i++) {\n        // Extract the rightmost bit of n\n        uint32_t bit = n & 1;\n        \n        // Shift result left and add the extracted bit\n        result = (result << 1) | bit;\n        \n        // Shift n right to process next bit\n        n = n >> 1;\n    }\n    \n    return result;\n}\n\nint main() {\n    uint32_t n;\n    cin >> n;\n    \n    cout << reverseBits(n) << \"\\n\";\n    \n    return 0;\n}`
        },
        {
          language: 'java',
          code: `public class Solution {\n    /**\n     * Reverse bits of a 32-bit unsigned integer.\n     * \n     * Approach:\n     * Extract each bit from right to left and build result from left to right.\n     */\n    public int reverseBits(int n) {\n        int result = 0;\n        \n        // Process 32 bits\n        for (int i = 0; i < 32; i++) {\n            // Extract the rightmost bit of n\n            int bit = n & 1;\n            \n            // Shift result left and add the extracted bit\n            result = (result << 1) | bit;\n            \n            // Shift n right to process next bit\n            // Use >>> for unsigned right shift\n            n = n >>> 1;\n        }\n        \n        return result;\n    }\n}\n\nimport java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        int n = Integer.parseInt(br.readLine().trim());\n        \n        Solution sol = new Solution();\n        System.out.println(sol.reverseBits(n));\n    }\n}`
        }
      ],
      testCases: [
        {
          input: '43261596',
          output: '964176192',
          isHidden: false
        },
        {
          input: '2147483644',
          output: '1073741822',
          isHidden: false
        },
        {
          input: '0',
          output: '0',
          isHidden: false
        },
        {
          input: '1',
          output: '2147483648',
          isHidden: true
        },
        {
          input: '4294967295',
          output: '4294967295',
          isHidden: true
        },
        {
          input: '2',
          output: '1073741824',
          isHidden: true
        }
      ],
      xpReward: 4
    };

    const result = await prisma.question.upsert({
      where: { slug: reverseBitsProblem.slug },
      update: reverseBitsProblem,
      create: reverseBitsProblem
    });

    console.log('✅ Reverse Bits problem updated successfully!');
    console.log('Problem:', result.title);
    console.log('Slug:', result.slug);
    console.log('Difficulty:', result.difficulty);
    
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to update problem:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

updateReverseBitsProblem();
