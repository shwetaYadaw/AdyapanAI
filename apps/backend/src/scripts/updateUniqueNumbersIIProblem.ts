import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function updateUniqueNumbersIIProblem() {
  try {
    // Delete old versions if they exist
    await prisma.question.deleteMany({
      where: {
        slug: {
          in: ['unique-numbers-ii', 'find-two-non-repeating-elements']
        }
      }
    }).catch(() => {});

    const uniqueNumbersIIProblem = {
      title: 'Unique Numbers II',
      slug: 'unique-numbers-ii',
      statement: `Given an array arr[] containing 2*n + 2 positive numbers, out of which 2*n numbers exist in pairs whereas the other two numbers occur exactly once and are distinct.

The task is to find the other two numbers that occur exactly once.

**Note:** Return the numbers in increasing order.

### Example 1

**Input:**
\`\`\`
arr[] = [1, 2, 3, 2, 1, 4]
\`\`\`

**Output:**
\`\`\`
3 4
\`\`\`

**Explanation:**
- 1 occurs twice
- 2 occurs twice
- 3 and 4 occur exactly once each

### Example 2

**Input:**
\`\`\`
arr[] = [2, 1, 3, 2]
\`\`\`

**Output:**
\`\`\`
1 3
\`\`\`

**Explanation:**
- 2 occurs twice
- 1 and 3 occur exactly once each

### Example 3

**Input:**
\`\`\`
arr[] = [1, 1, 5, 5, 6, 7]
\`\`\`

**Output:**
\`\`\`
6 7
\`\`\`

**Explanation:**
- 1 and 5 occur twice
- 6 and 7 occur exactly once each

### Approach

**Method 1: Using Hash Map (O(n) time, O(n) space)**
- Count frequency of each element
- Find and return elements with frequency 1
- Sort the result

**Method 2: Using XOR (O(n) time, O(1) space) - OPTIMAL**

Key Insight: XOR of two identical numbers is 0, XOR of any number with 0 is the number itself.

**Algorithm:**
1. XOR all elements → gets XOR of two unique numbers (let's call it \`xor_result\`)
2. Find the rightmost set bit in \`xor_result\` (differs between the two unique numbers)
3. Partition elements into two groups based on that bit
4. XOR each group separately to get the two unique numbers
5. Sort and return

**Example:**
\`\`\`
arr = [1, 2, 3, 2, 1, 4]

Step 1: XOR all elements
1 ^ 2 ^ 3 ^ 2 ^ 1 ^ 4 = (1^1) ^ (2^2) ^ 3 ^ 4 = 0 ^ 0 ^ 3 ^ 4 = 3 ^ 4 = 0111 (binary: 7)

Step 2: Find rightmost set bit
3 = 0011
4 = 0100
3 ^ 4 = 0111 (rightmost set bit at position 0)

Step 3: Partition and XOR
Group 1 (bit 0 = 1): 1, 3, 1 → 1 ^ 3 ^ 1 = 3
Group 2 (bit 0 = 0): 2, 2, 4 → 2 ^ 2 ^ 4 = 4

Result: 3, 4 ✓
\`\`\`

**Time Complexity:**
- Method 1: O(n log n) due to sorting
- Method 2: O(n) optimal

**Space Complexity:**
- Method 1: O(n) for hash map
- Method 2: O(1) optimal`,
      difficulty: 'medium',
      topics: ['bit-manipulation', 'array', 'hashing'],
      companies: ['Google', 'Amazon', 'Microsoft', 'Apple', 'Facebook'],
      timeLimit: 1000,
      memoryLimit: 128,
      inputFormat: 'An array arr[] of 2*n + 2 positive integers where 2*n numbers appear exactly twice and 2 numbers appear exactly once.',
      outputFormat: 'Return two integers that appear exactly once in the array, in increasing order.',
      constraints: '1 <= arr[i] <= 10^9\n4 <= arr.length <= 10^5\nExactly 2 elements appear once, rest appear twice.',
      sampleInput: '1 2 3 2 1 4',
      sampleOutput: '3 4',
      templates: [
        {
          language: 'python',
          code: `def findTwoUniqueNumbers(arr):\n    \"\"\"\n    Find two unique numbers in array where all others appear twice.\n    \n    Optimal Approach: Bit Manipulation (O(n) time, O(1) space)\n    - XOR all elements to get XOR of two unique numbers\n    - Find rightmost set bit using AND with two's complement\n    - Partition and XOR to find individual numbers\n    \n    Time Complexity: O(n)\n    Space Complexity: O(1)\n    \"\"\"\n    # Step 1: XOR all elements to get xor of two unique numbers\n    xor_result = 0\n    for num in arr:\n        xor_result ^= num\n    \n    # Step 2: Find rightmost set bit (differs between two unique numbers)\n    # xor_result & -xor_result gives rightmost set bit\n    rightmost_bit = xor_result & (-xor_result)\n    \n    # Step 3: Partition elements and XOR each group\n    num1, num2 = 0, 0\n    for num in arr:\n        if num & rightmost_bit:\n            num1 ^= num\n        else:\n            num2 ^= num\n    \n    # Step 4: Return in sorted order\n    return sorted([num1, num2])\n\n# Alternative approach using Hash Map:\ndef findTwoUniqueNumbers_hashmap(arr):\n    freq = {}\n    for num in arr:\n        freq[num] = freq.get(num, 0) + 1\n    \n    unique = [num for num, count in freq.items() if count == 1]\n    return sorted(unique)\n\n# Main execution\nfs = require('fs')\nline = fs.readFileSync(0, 'utf-8').strip()\narr = list(map(int, line.split()))\nresult = findTwoUniqueNumbers(arr)\nprint(' '.join(map(str, result)))`
        },
        {
          language: 'javascript',
          code: `const fs = require('fs');\n\nfunction findTwoUniqueNumbers(arr) {\n    /**\n     * Find two unique numbers in array where all others appear twice.\n     * \n     * Optimal Approach: Bit Manipulation (O(n) time, O(1) space)\n     * - XOR all elements to get XOR of two unique numbers\n     * - Find rightmost set bit using AND with two's complement\n     * - Partition and XOR to find individual numbers\n     * \n     * Time Complexity: O(n)\n     * Space Complexity: O(1)\n     */\n    // Step 1: XOR all elements to get xor of two unique numbers\n    let xorResult = 0;\n    for (let num of arr) {\n        xorResult ^= num;\n    }\n    \n    // Step 2: Find rightmost set bit (differs between two unique numbers)\n    // xorResult & -xorResult gives rightmost set bit\n    let rightmostBit = xorResult & (-xorResult);\n    \n    // Step 3: Partition elements and XOR each group\n    let num1 = 0, num2 = 0;\n    for (let num of arr) {\n        if (num & rightmostBit) {\n            num1 ^= num;\n        } else {\n            num2 ^= num;\n        }\n    }\n    \n    // Step 4: Return in sorted order\n    return [Math.min(num1, num2), Math.max(num1, num2)];\n}\n\n// Alternative approach using Map:\nfunction findTwoUniqueNumbers_map(arr) {\n    const freq = new Map();\n    for (let num of arr) {\n        freq.set(num, (freq.get(num) || 0) + 1);\n    }\n    \n    const unique = [];\n    for (let [num, count] of freq.entries()) {\n        if (count === 1) {\n            unique.push(num);\n        }\n    }\n    return unique.sort((a, b) => a - b);\n}\n\n// Main execution\nconst input = fs.readFileSync(0, 'utf-8').trim();\nconst arr = input.split(' ').map(Number);\nconst result = findTwoUniqueNumbers(arr);\nconsole.log(result.join(' '));`
        },
        {
          language: 'cpp',
          code: `#include <bits/stdc++.h>\nusing namespace std;\n\npair<int, int> findTwoUniqueNumbers(vector<int>& arr) {\n    /**\n     * Find two unique numbers in array where all others appear twice.\n     * \n     * Optimal Approach: Bit Manipulation (O(n) time, O(1) space)\n     * - XOR all elements to get XOR of two unique numbers\n     * - Find rightmost set bit using AND with two's complement\n     * - Partition and XOR to find individual numbers\n     * \n     * Time Complexity: O(n)\n     * Space Complexity: O(1)\n     */\n    // Step 1: XOR all elements to get xor of two unique numbers\n    int xorResult = 0;\n    for (int num : arr) {\n        xorResult ^= num;\n    }\n    \n    // Step 2: Find rightmost set bit (differs between two unique numbers)\n    // xorResult & -xorResult gives rightmost set bit\n    int rightmostBit = xorResult & (-xorResult);\n    \n    // Step 3: Partition elements and XOR each group\n    int num1 = 0, num2 = 0;\n    for (int num : arr) {\n        if (num & rightmostBit) {\n            num1 ^= num;\n        } else {\n            num2 ^= num;\n        }\n    }\n    \n    // Step 4: Return in sorted order\n    if (num1 > num2) swap(num1, num2);\n    return {num1, num2};\n}\n\nint main() {\n    int n;\n    cin >> n;\n    \n    vector<int> arr(n);\n    for (int i = 0; i < n; i++) {\n        cin >> arr[i];\n    }\n    \n    auto result = findTwoUniqueNumbers(arr);\n    cout << result.first << \" \" << result.second << \"\\n\";\n    \n    return 0;\n}`
        },
        {
          language: 'java',
          code: `import java.util.*;\nimport java.io.*;\n\npublic class Solution {\n    /**\n     * Find two unique numbers in array where all others appear twice.\n     * \n     * Optimal Approach: Bit Manipulation (O(n) time, O(1) space)\n     * - XOR all elements to get XOR of two unique numbers\n     * - Find rightmost set bit using AND with two's complement\n     * - Partition and XOR to find individual numbers\n     * \n     * Time Complexity: O(n)\n     * Space Complexity: O(1)\n     */\n    public int[] findTwoUniqueNumbers(int[] arr) {\n        // Step 1: XOR all elements to get xor of two unique numbers\n        int xorResult = 0;\n        for (int num : arr) {\n            xorResult ^= num;\n        }\n        \n        // Step 2: Find rightmost set bit (differs between two unique numbers)\n        // xorResult & -xorResult gives rightmost set bit\n        int rightmostBit = xorResult & (-xorResult);\n        \n        // Step 3: Partition elements and XOR each group\n        int num1 = 0, num2 = 0;\n        for (int num : arr) {\n            if ((num & rightmostBit) != 0) {\n                num1 ^= num;\n            } else {\n                num2 ^= num;\n            }\n        }\n        \n        // Step 4: Return in sorted order\n        int[] result = new int[2];\n        if (num1 < num2) {\n            result[0] = num1;\n            result[1] = num2;\n        } else {\n            result[0] = num2;\n            result[1] = num1;\n        }\n        return result;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String[] input = br.readLine().trim().split(\" \");\n        \n        int[] arr = new int[input.length];\n        for (int i = 0; i < input.length; i++) {\n            arr[i] = Integer.parseInt(input[i]);\n        }\n        \n        Solution sol = new Solution();\n        int[] result = sol.findTwoUniqueNumbers(arr);\n        System.out.println(result[0] + \" \" + result[1]);\n    }\n}`
        }
      ],
      testCases: [
        {
          input: '1 2 3 2 1 4',
          output: '3 4',
          isHidden: false
        },
        {
          input: '2 1 3 2',
          output: '1 3',
          isHidden: false
        },
        {
          input: '1 1 5 5 6 7',
          output: '6 7',
          isHidden: false
        },
        {
          input: '10 5 10 3 8 8',
          output: '3 5',
          isHidden: true
        },
        {
          input: '100 200 100 300 200 400',
          output: '300 400',
          isHidden: true
        },
        {
          input: '1 1 2 2 3 4 3 5',
          output: '4 5',
          isHidden: true
        }
      ],
      xpReward: 6
    };

    const result = await prisma.question.upsert({
      where: { slug: uniqueNumbersIIProblem.slug },
      update: uniqueNumbersIIProblem,
      create: uniqueNumbersIIProblem
    });

    console.log('✅ Unique Numbers II problem created successfully!');
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

updateUniqueNumbersIIProblem();
