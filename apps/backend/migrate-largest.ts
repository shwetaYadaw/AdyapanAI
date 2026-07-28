import { prisma } from './src/config/prisma';

async function migrate() {
  try {
    console.log('Starting migration...');
    
    // Delete the old problem with the old slug
    const deleted = await prisma.question.deleteMany({
      where: {
        slug: {
          in: ['find-the-largest-number-in-an-array-tcs-nqt']
        }
      }
    });
    
    console.log(`✅ Deleted ${deleted.count} old problems`);
    
    // Create the new problem with correct details
    const newProblem = await prisma.question.create({
      data: {
        title: 'Largest in Array',
        slug: 'largest-in-array-tcs-nqt',
        statement: `Given an array arr[]. The task is to find the largest element and return it.

**Examples:**
- Input: arr[] = [1, 8, 7, 56, 90] → Output: 90
- Input: arr[] = [5, 5, 5, 5] → Output: 5
- Input: arr[] = [10] → Output: 10

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
        difficulty: 'easy',
        topics: ['tcs-nqt'],
        companies: ['TCS'],
        timeLimit: 1000,
        memoryLimit: 128,
        inputFormat: 'First line contains N (size of array), second line contains N space-separated integers.',
        outputFormat: 'Return the largest element in the array.',
        constraints: '1 ≤ N ≤ 10^5\n-10^9 ≤ arr[i] ≤ 10^9',
        sampleInput: '5\n1 8 7 56 90',
        sampleOutput: '90',
        templates: [
          {
            language: 'python',
            code: `import sys\n\ndef largestInArray(input_str):\n    lines = input_str.strip().split('\\\\n')\n    n = int(lines[0])\n    arr = list(map(int, lines[1].split()))\n    return max(arr)\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    res = largestInArray('\\\\n'.join(lines))\n    print(res)\n\nif __name__ == "__main__":\n    solve()`
          },
          {
            language: 'javascript',
            code: `const fs = require('fs');\n\nfunction largestInArray(inputStr) {\n    const lines = inputStr.trim().split('\\\\n');\n    const n = parseInt(lines[0]);\n    const arr = lines[1].split(' ').map(Number);\n    return Math.max(...arr);\n}\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    if (!input) return;\n    console.log(largestInArray(input));\n}\nsolve();`
          },
          {
            language: 'cpp',
            code: `#include <iostream>\n#include <string>\n#include <algorithm>\n#include <sstream>\n#include <vector>\nusing namespace std;\n\nstring largestInArray(string inputStr) {\n    istringstream iss(inputStr);\n    int n;\n    iss >> n;\n    vector<int> arr(n);\n    for(int i = 0; i < n; i++) {\n        iss >> arr[i];\n    }\n    return to_string(*max_element(arr.begin(), arr.end()));\n}\n\nint main() {\n    string inputStr;\n    int n;\n    cin >> n;\n    inputStr = to_string(n);\n    int x;\n    while(cin >> x) {\n        inputStr += \" \" + to_string(x);\n    }\n    cout << largestInArray(inputStr) << endl;\n    return 0;\n}`
          },
          {
            language: 'java',
            code: `import java.util.*;\nimport java.io.*;\n\nclass Main {\n    public static String largestInArray(String inputStr) {\n        String[] lines = inputStr.trim().split(\"\\\\n\");\n        int n = Integer.parseInt(lines[0]);\n        String[] numStrs = lines[1].split(\" \");\n        int max = Integer.MIN_VALUE;\n        for(String s : numStrs) {\n            max = Math.max(max, Integer.parseInt(s));\n        }\n        return String.valueOf(max);\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        StringBuilder sb = new StringBuilder();\n        String line;\n        while((line = br.readLine()) != null) {\n            sb.append(line).append(\"\\\\n\");\n        }\n        System.out.println(largestInArray(sb.toString()));\n    }\n}`
          }
        ],
        testCases: [
          { input: '5\n1 8 7 56 90', output: '90', isHidden: false },
          { input: '4\n5 5 5 5', output: '5', isHidden: false },
          { input: '1\n10', output: '10', isHidden: false },
          { input: '3\n-5 -2 -10', output: '-2', isHidden: true },
          { input: '6\n100 200 150 300 250 280', output: '300', isHidden: true },
          { input: '2\n1000000000 -1000000000', output: '1000000000', isHidden: true }
        ],
        xpReward: 10
      }
    });
    
    console.log('✅ Created new problem:', newProblem.title);
    console.log('📝 Slug:', newProblem.slug);
    console.log('🧪 Test Cases:', (newProblem.testCases as any[]).length);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrate();
