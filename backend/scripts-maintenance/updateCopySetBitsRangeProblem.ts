import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function updateCopySetBitsRangeProblem() {
  try {
    // Delete old versions if they exist
    await prisma.question.deleteMany({
      where: {
        slug: {
          in: ['copy-set-bits-in-range', 'copy-set-bits-range-bit-manipulation']
        }
      }
    }).catch(() => {});

    const copySetBitsRangeProblem = {
      title: 'Copy Set Bits in a Range',
      slug: 'copy-set-bits-in-range',
      statement: `Given two numbers x and y, and a range [l, r] where 1 <= l, r <= 32.

The task is to consider set bits of y in range [l, r] and set these bits in x also.

In other words, for each bit position in the range [l, r]:
- If that bit is set in y, set it in x
- Otherwise, leave it unchanged in x

Note: Bit positions are counted from the right (LSB is position 1).

### Example 1

**Input:**
\`\`\`
x = 10, y = 13, l = 2, r = 3
\`\`\`

**Output:**
\`\`\`
14
\`\`\`

**Explanation:**

Binary representation:
- x = 10 → 1010
- y = 13 → 1101

Range [2, 3] means positions 2 and 3 (1-indexed from right):
- Position 3: y has 1 at position 3 → set bit 3 in x
- Position 2: y has 0 at position 2 → keep bit 2 in x as is

Process:
\`\`\`
x = 1010
y = 1101
After copying bits from y to x in range [2, 3]:
x = 1110 = 14
\`\`\`

### Example 2

**Input:**
\`\`\`
x = 8, y = 7, l = 1, r = 2
\`\`\`

**Output:**
\`\`\`
11
\`\`\`

**Explanation:**

Binary representation:
- x = 8 → 1000
- y = 7 → 0111

Range [1, 2] means positions 1 and 2:
- Position 2: y has 1 at position 2 → set bit 2 in x
- Position 1: y has 1 at position 1 → set bit 1 in x

Process:
\`\`\`
x = 1000
y = 0111
After copying bits from y to x in range [1, 2]:
x = 1011 = 11
\`\`\`

### Approach

**Step 1: Extract bits from y in range [l, r]**
- Create a mask for range [l, r]: \`(1 << (r - l + 1)) - 1\` shifted left by (l - 1)
- Get bits from y: \`y & mask\`

**Step 2: Clear bits in x in the same range**
- Create inverse mask: \`~mask\`
- Clear bits: \`x & (~mask)\`

**Step 3: Combine**
- Combine cleared x with extracted bits from y

**Algorithm:**
\`\`\`
1. Create mask for range [l, r]:
   - temp = (1 << (r - l + 1)) - 1
   - mask = temp << (l - 1)

2. Extract bits from y in range:
   - y_bits = y & mask

3. Clear bits in x in range:
   - x = x & (~mask)

4. Copy bits from y to x:
   - x = x | y_bits

Result: x now has bits from y in range [l, r]
\`\`\`

**Time Complexity:** O(1) - constant time operations
**Space Complexity:** O(1) - no extra space needed`,
      difficulty: 'medium',
      topics: ['bit-manipulation'],
      companies: ['Google', 'Amazon', 'Microsoft', 'Apple', 'Adobe'],
      timeLimit: 1000,
      memoryLimit: 128,
      inputFormat: 'Four integers: x, y, l, r where x and y are positive integers and 1 <= l, r <= 32',
      outputFormat: 'Return the value of x after copying set bits from y in range [l, r].',
      constraints: '0 <= x, y <= 2^32 - 1\n1 <= l, r <= 32\nl <= r',
      sampleInput: '10 13 2 3',
      sampleOutput: '14',
      templates: [
        {
          language: 'python',
          code: `def copySetBits(x: int, y: int, l: int, r: int) -> int:\n    \"\"\"\n    Copy set bits from y in range [l, r] to x.\n    \n    Approach:\n    1. Create mask for range [l, r]\n    2. Extract bits from y in this range\n    3. Clear these bits in x\n    4. Set the extracted bits from y in x\n    \n    Time Complexity: O(1)\n    Space Complexity: O(1)\n    \"\"\"\n    # Step 1: Create mask for range [l, r]\n    # temp = (1 << (r - l + 1)) - 1 creates mask of (r-l+1) ones\n    # temp << (l - 1) shifts it to position\n    temp = (1 << (r - l + 1)) - 1\n    mask = temp << (l - 1)\n    \n    # Step 2: Extract bits from y in range [l, r]\n    y_bits = y & mask\n    \n    # Step 3: Clear bits in x in range [l, r]\n    x = x & (~mask)\n    \n    # Step 4: Copy bits from y to x\n    x = x | y_bits\n    \n    return x\n\n# Main execution\nfs = require('fs')\nline = fs.readFileSync(0, 'utf-8').strip()\nx, y, l, r = map(int, line.split())\nprint(copySetBits(x, y, l, r))`
        },
        {
          language: 'javascript',
          code: `const fs = require('fs');\n\nfunction copySetBits(x, y, l, r) {\n    /**\n     * Copy set bits from y in range [l, r] to x.\n     * \n     * Approach:\n     * 1. Create mask for range [l, r]\n     * 2. Extract bits from y in this range\n     * 3. Clear these bits in x\n     * 4. Set the extracted bits from y in x\n     * \n     * Time Complexity: O(1)\n     * Space Complexity: O(1)\n     */\n    // Step 1: Create mask for range [l, r]\n    // temp = (1 << (r - l + 1)) - 1 creates mask of (r-l+1) ones\n    // temp << (l - 1) shifts it to position\n    const temp = (1 << (r - l + 1)) - 1;\n    const mask = temp << (l - 1);\n    \n    // Step 2: Extract bits from y in range [l, r]\n    const y_bits = y & mask;\n    \n    // Step 3: Clear bits in x in range [l, r]\n    // Use >>> 0 to ensure 32-bit unsigned integer\n    x = (x & (~mask)) >>> 0;\n    \n    // Step 4: Copy bits from y to x\n    x = (x | y_bits) >>> 0;\n    \n    return x;\n}\n\n// Main execution\nconst input = fs.readFileSync(0, 'utf-8').trim();\nconst [x, y, l, r] = input.split(' ').map(Number);\nconsole.log(copySetBits(x, y, l, r));`
        },
        {
          language: 'cpp',
          code: `#include <bits/stdc++.h>\nusing namespace std;\n\nuint32_t copySetBits(uint32_t x, uint32_t y, int l, int r) {\n    /**\n     * Copy set bits from y in range [l, r] to x.\n     * \n     * Approach:\n     * 1. Create mask for range [l, r]\n     * 2. Extract bits from y in this range\n     * 3. Clear these bits in x\n     * 4. Set the extracted bits from y in x\n     * \n     * Time Complexity: O(1)\n     * Space Complexity: O(1)\n     */\n    // Step 1: Create mask for range [l, r]\n    // temp = (1 << (r - l + 1)) - 1 creates mask of (r-l+1) ones\n    // temp << (l - 1) shifts it to position\n    uint32_t temp = (1U << (r - l + 1)) - 1;\n    uint32_t mask = temp << (l - 1);\n    \n    // Step 2: Extract bits from y in range [l, r]\n    uint32_t y_bits = y & mask;\n    \n    // Step 3: Clear bits in x in range [l, r]\n    x = x & (~mask);\n    \n    // Step 4: Copy bits from y to x\n    x = x | y_bits;\n    \n    return x;\n}\n\nint main() {\n    uint32_t x, y;\n    int l, r;\n    cin >> x >> y >> l >> r;\n    \n    cout << copySetBits(x, y, l, r) << \"\\n\";\n    \n    return 0;\n}`
        },
        {
          language: 'java',
          code: `public class Solution {\n    /**\n     * Copy set bits from y in range [l, r] to x.\n     * \n     * Approach:\n     * 1. Create mask for range [l, r]\n     * 2. Extract bits from y in this range\n     * 3. Clear these bits in x\n     * 4. Set the extracted bits from y in x\n     * \n     * Time Complexity: O(1)\n     * Space Complexity: O(1)\n     */\n    public long copySetBits(long x, long y, int l, int r) {\n        // Step 1: Create mask for range [l, r]\n        // temp = (1 << (r - l + 1)) - 1 creates mask of (r-l+1) ones\n        // temp << (l - 1) shifts it to position\n        long temp = (1L << (r - l + 1)) - 1;\n        long mask = temp << (l - 1);\n        \n        // Step 2: Extract bits from y in range [l, r]\n        long y_bits = y & mask;\n        \n        // Step 3: Clear bits in x in range [l, r]\n        x = x & (~mask);\n        \n        // Step 4: Copy bits from y to x\n        x = x | y_bits;\n        \n        return x;\n    }\n}\n\nimport java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String[] input = br.readLine().trim().split(\" \");\n        \n        long x = Long.parseLong(input[0]);\n        long y = Long.parseLong(input[1]);\n        int l = Integer.parseInt(input[2]);\n        int r = Integer.parseInt(input[3]);\n        \n        Solution sol = new Solution();\n        System.out.println(sol.copySetBits(x, y, l, r));\n    }\n}`
        }
      ],
      testCases: [
        {
          input: '10 13 2 3',
          output: '14',
          isHidden: false
        },
        {
          input: '8 7 1 2',
          output: '11',
          isHidden: false
        },
        {
          input: '5 3 1 2',
          output: '7',
          isHidden: false
        },
        {
          input: '15 8 1 4',
          output: '15',
          isHidden: true
        },
        {
          input: '0 15 1 4',
          output: '15',
          isHidden: true
        },
        {
          input: '31 16 4 5',
          output: '31',
          isHidden: true
        }
      ],
      xpReward: 6
    };

    const result = await prisma.question.upsert({
      where: { slug: copySetBitsRangeProblem.slug },
      update: copySetBitsRangeProblem,
      create: copySetBitsRangeProblem
    });

    console.log('✅ Copy Set Bits in a Range problem created successfully!');
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

updateCopySetBitsRangeProblem();
