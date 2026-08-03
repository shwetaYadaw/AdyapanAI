import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function updateXorProblem() {
  try {
    const xorProblem = {
      title: 'Maximum XOR of Two Numbers in an Array',
      slug: 'maximum-xor-of-two-numbers',
      statement: `Given an integer array \`nums\`, return the maximum result of \`nums[i] XOR nums[j]\`, where \`0 <= i <= j < n\`.

### Example 1

**Input:** \`nums = [3,10,5,25,2,8]\`

**Output:** \`28\`

**Explanation:** The maximum result is \`5 XOR 25 = 28\`.

### Example 2

**Input:** \`nums = [14,70,53,83,49,91,36,80,92,51,66,70]\`

**Output:** \`127\`

**Explanation:** The maximum result is \`70 XOR 53 = 127\`.`,
      difficulty: 'medium',
      topics: ['trie'],
      companies: ['Google', 'Microsoft', 'Amazon'],
      timeLimit: 1000,
      memoryLimit: 128,
      inputFormat: 'The first line contains n. The second line contains n space-separated integers of nums.',
      outputFormat: 'Print the maximum XOR result of any two numbers in the array.',
      constraints: '1 <= nums.length <= 2 * 10^5\n0 <= nums[i] <= 2^31 - 1',
      sampleInput: '6\n3 10 5 25 2 8',
      sampleOutput: '28',
      templates: [
        {
          language: 'python',
          code: `def solve():\n    n = int(input())\n    nums = list(map(int, input().split()))\n    max_xor = 0\n    for i in range(n):\n        for j in range(i, n):\n            max_xor = max(max_xor, nums[i] ^ nums[j])\n    print(max_xor)\n\nsolve()`
        },
        {
          language: 'javascript',
          code: `const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf-8').trim().split('\\n');\nconst n = parseInt(input[0]);\nconst nums = input[1].split(' ').map(Number);\n\nlet max_xor = 0;\nfor (let i = 0; i < n; i++) {\n    for (let j = i; j < n; j++) {\n        max_xor = Math.max(max_xor, nums[i] ^ nums[j]);\n    }\n}\nconsole.log(max_xor);`
        },
        {
          language: 'cpp',
          code: `#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    int n;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    int max_xor = 0;\n    for (int i = 0; i < n; i++) {\n        for (int j = i; j < n; j++) {\n            max_xor = max(max_xor, nums[i] ^ nums[j]);\n        }\n    }\n    cout << max_xor << endl;\n    return 0;\n}`
        },
        {
          language: 'java',
          code: `import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int max_xor = 0;\n        for (int i = 0; i < n; i++) {\n            for (int j = i; j < n; j++) {\n                max_xor = Math.max(max_xor, nums[i] ^ nums[j]);\n            }\n        }\n        System.out.println(max_xor);\n    }\n}`
        }
      ],
      testCases: [
        { input: '6\n3 10 5 25 2 8', output: '28', isHidden: false },
        { input: '12\n14 70 53 83 49 91 36 80 92 51 66 70', output: '127', isHidden: false },
        { input: '4\n8 10 2 5', output: '12', isHidden: true }
      ],
      xpReward: 6
    };

    // Update or create the problem
    const result = await prisma.question.upsert({
      where: { slug: xorProblem.slug },
      update: xorProblem,
      create: xorProblem
    });

    console.log('✅ Maximum XOR problem updated successfully!');
    console.log('Problem:', result);
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to update problem:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

updateXorProblem();
