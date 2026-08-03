import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

function generateBoilerplates(title: string) {
  const methodName = 'atMostKDistinct';

  return JSON.stringify([
    {
      language: 'python',
      code: `import sys\n\ndef ${methodName}(arr, k):\n    # Write your logic here\n    # Find number of subarrays with at most k distinct elements\n    return 0\n\ndef solve():\n    line1 = sys.stdin.readline().strip().split()\n    arr = [int(x) for x in line1]\n    line2 = sys.stdin.readline().strip()\n    k = int(line2)\n    res = ${methodName}(arr, k)\n    print(res)\n\nif __name__ == "__main__":\n    solve()`
    },
    {
      language: 'javascript',
      code: `// Solution for ${title}\nconst fs = require('fs');\n\nfunction ${methodName}(arr, k) {\n    // Write your logic here\n    // Find number of subarrays with at most k distinct elements\n    return 0;\n}\n\nfunction solve() {\n    const lines = fs.readFileSync(0, 'utf-8').trim().split('\\n');\n    const arr = lines[0].split(' ').map(Number);\n    const k = parseInt(lines[1]);\n    console.log(${methodName}(arr, k));\n}\nsolve();`
    },
    {
      language: 'cpp',
      code: `// Solution for ${title}\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nint ${methodName}(vector<int>& arr, int k) {\n    // Write your logic here\n    // Find number of subarrays with at most k distinct elements\n    return 0;\n}\n\nint main() {\n    int n, k;\n    cin >> n;\n    vector<int> arr(n);\n    for (int i = 0; i < n; i++) {\n        cin >> arr[i];\n    }\n    cin >> k;\n    cout << ${methodName}(arr, k) << endl;\n    return 0;\n}`
    },
    {
      language: 'java',
      code: `// Solution for ${title}\nimport java.util.*;\nimport java.io.*;\n\nclass Main {\n    public static int ${methodName}(int[] arr, int k) {\n        // Write your logic here\n        // Find number of subarrays with at most k distinct elements\n        return 0;\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String line1 = br.readLine();\n        int[] arr = Arrays.stream(line1.trim().split(\" \")).mapToInt(Integer::parseInt).toArray();\n        int k = Integer.parseInt(br.readLine().trim());\n        System.out.println(${methodName}(arr, k));\n    }\n}`
    }
  ]);
}

async function updateProblem() {
  try {
    const problemSlug = 'subarrays-with-distinct-elements-hashing';
    const title = 'Subarrays With At Most K Distinct';

    const problemData = {
      title: title,
      slug: problemSlug,
      difficulty: 'medium',
      topics: JSON.stringify(['hashing', 'sliding-window', 'array']),
      statement: `## 📝 Problem Statement
You are given an array arr[] of positive integers and an integer k, find the number of subarrays in arr[] where the count of distinct integers is at most k.

**Note:** A subarray is a contiguous part of an array.

**Problem Details:**
- Given an array of positive integers
- Given an integer k
- Count all subarrays with at most k distinct elements
- A subarray is a contiguous portion of the array

**Algorithm Approach:**
1. **Brute Force Approach:**
   - Generate all subarrays
   - For each subarray, count distinct elements
   - Check if distinct count ≤ k
   - Time: O(n²), Space: O(n)

2. **Sliding Window with Hash Map (Recommended):**
   - Use a hash map to track element frequencies
   - Maintain a sliding window of at most k distinct elements
   - Expand right pointer, contract left pointer when needed
   - Time: O(n), Space: O(k)

3. **Two Pointer Approach:**
   - Count subarrays with exactly k distinct = subarrays(≤ k) - subarrays(≤ k-1)
   - Use two pointer technique for each calculation
   - Time: O(n), Space: O(k)

**Key Insight:**
- For each position i, if we can extend the window to include it, all subarrays ending at i with left pointer from any valid position are valid
- Use the formula: number of subarrays = (number of valid positions for left pointer)

**Examples:**

Input: arr[] = [1, 2, 2, 3], k = 2
Output: 9
Explanation: Subarrays with at most 2 distinct elements are: [1], [2], [2], [3], [1, 2], [2, 2], [2, 3], [1, 2, 2] and [2, 2, 3].

Input: arr[] = [1, 1, 1], k = 1
Output: 6
Explanation: Subarrays with at most 1 distinct element are: [1], [1], [1], [1, 1], [1, 1] and [1, 1, 1].

Input: arr[] = [1, 2, 1, 1, 3, 3, 4, 2, 1], k = 2
Output: 24
Explanation: There are 24 subarrays with at most 2 distinct elements.

**Time Complexity:** O(n) using sliding window with hash map
**Space Complexity:** O(k) for the hash map storing at most k distinct elements

Complete the function to find the number of subarrays with at most k distinct elements.`,
      inputFormat: 'First line: array arr[] as space-separated integers. Second line: integer k (number of allowed distinct elements).',
      outputFormat: 'Return the count of subarrays with at most k distinct elements as a single integer.',
      constraints: '1 ≤ arr.length ≤ 10^5\n1 ≤ k ≤ 26 (or number of unique elements)\n1 ≤ arr[i] ≤ 10^9',
      sampleInput: '1 2 2 3\n2',
      sampleOutput: '9',
      testCases: JSON.stringify([
        { input: '1 2 2 3\n2', output: '9', isHidden: false },
        { input: '1 1 1\n1', output: '6', isHidden: false },
        { input: '1 2 1 1 3 3 4 2 1\n2', output: '24', isHidden: false },
        { input: '1 2 3\n2', output: '6', isHidden: true },
        { input: '1 2 3 4\n2', output: '6', isHidden: true },
        { input: '1\n1', output: '1', isHidden: true },
        { input: '1 1 1 1\n1', output: '10', isHidden: true },
        { input: '1 2 1 2 1\n2', output: '12', isHidden: true }
      ]),
      timeLimit: 2000,
      memoryLimit: 256,
      templates: generateBoilerplates(title),
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
          xpReward: 400,
          companies: JSON.stringify(['Google', 'Amazon', 'Microsoft', 'Facebook', 'Adobe']),
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

