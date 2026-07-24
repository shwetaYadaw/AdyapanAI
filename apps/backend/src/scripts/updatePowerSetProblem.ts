import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function updatePowerSetProblem() {
  try {
    // Delete old versions if they exist
    await prisma.question.deleteMany({
      where: {
        slug: {
          in: ['power-set', 'power-set-recursion']
        }
      }
    }).catch(() => {});

    const powerSetProblem = {
      title: 'Power Set',
      slug: 'power-set',
      statement: `Power Set P(S) of a set S is the set of all subsets of S.

For example, if S = {a, b, c}, then P(S) = {{}, {a}, {b}, {c}, {a, b}, {a, c}, {b, c}, {a, b, c}}.

If S has n elements in it, then P(S) will have 2^n elements.

### Example 1

**Input:**
\`\`\`
s = "ab"
\`\`\`

**Output:**
\`\`\`
["", "a", "b", "ab"]
\`\`\`

**Explanation:**
The power set of "ab" includes all possible subsets:
- Empty set: ""
- Single characters: "a", "b"
- Full string: "ab"

### Example 2

**Input:**
\`\`\`
s = "abc"
\`\`\`

**Output:**
\`\`\`
["", "a", "b", "c", "ab", "ac", "bc", "abc"]
\`\`\`

**Explanation:**
The power set of "abc" includes all subsets formed by choosing any combination of its characters:
- 0 elements: ""
- 1 element: "a", "b", "c"
- 2 elements: "ab", "ac", "bc"
- 3 elements: "abc"

### Example 3

**Input:**
\`\`\`
s = "a"
\`\`\`

**Output:**
\`\`\`
["", "a"]
\`\`\`

**Explanation:**
The power set of "a" consists of the empty set and the single character itself.

### Approach

**Method 1: Iterative Approach (O(n * 2^n))**
- Start with empty subset in result
- For each character in the string:
  - For each existing subset, add a new subset by appending current character
  - Add this new subset to result

**Method 2: Recursive Approach (O(n * 2^n))**
- Base case: If string is empty, return [""]
- Recursive case: Get power set of string without last character
  - For each subset in previous result:
    - Create new subset by adding last character
    - Add both original and new subset to result

**Method 3: Bit Manipulation (O(n * 2^n))**
- For a set of n elements, iterate from 0 to 2^n - 1
- For each number, check each bit position
- If bit is set, include character at that position in subset

**Time Complexity:** O(n * 2^n) - 2^n subsets, each of average length n/2
**Space Complexity:** O(n * 2^n) - to store all subsets`,
      difficulty: 'medium',
      topics: ['recursion', 'backtracking', 'bit-manipulation'],
      companies: ['Google', 'Amazon', 'Microsoft', 'Facebook', 'Apple'],
      timeLimit: 1000,
      memoryLimit: 128,
      inputFormat: 'A string s of unique lowercase English letters',
      outputFormat: 'Return all subsets (the power set) of the given string. The result can be in any order.',
      constraints: '0 <= s.length <= 10\ns consists of lowercase English letters\nAll characters in the given string are unique.',
      sampleInput: 'ab',
      sampleOutput: '["", "a", "b", "ab"]',
      templates: [
        {
          language: 'python',
          code: `def powerSet(s: str) -> list:\n    \"\"\"\n    Generate all subsets (power set) of given string.\n    \n    Iterative approach:\n    - Start with empty subset\n    - For each character, add it to all existing subsets\n    - This doubles the number of subsets each iteration\n    \"\"\"\n    result = [\"\"]\n    \n    for char in s:\n        # Add current character to all existing subsets\n        result += [subset + char for subset in result]\n    \n    return result\n\n# Alternative recursive approach:\ndef powerSetRecursive(s: str) -> list:\n    if not s:\n        return [\"\"]\n    \n    # Get power set of string without last character\n    prev_subsets = powerSetRecursive(s[:-1])\n    \n    # Add last character to all previous subsets\n    result = prev_subsets + [subset + s[-1] for subset in prev_subsets]\n    return result\n\n# Main execution\nfs = require('fs')\ns = fs.readFileSync(0, 'utf-8').strip()\nresult = powerSet(s)\nprint(result)`
        },
        {
          language: 'javascript',
          code: `const fs = require('fs');\n\nfunction powerSet(s) {\n    /**\n     * Generate all subsets (power set) of given string.\n     * \n     * Iterative approach:\n     * - Start with empty subset\n     * - For each character, add it to all existing subsets\n     * - This doubles the number of subsets each iteration\n     */\n    let result = [\"\"];\n    \n    for (let char of s) {\n        // Add current character to all existing subsets\n        const newSubsets = result.map(subset => subset + char);\n        result = result.concat(newSubsets);\n    }\n    \n    return result;\n}\n\n// Alternative recursive approach:\nfunction powerSetRecursive(s) {\n    if (s.length === 0) {\n        return [\"\"];\n    }\n    \n    // Get power set of string without last character\n    const prevSubsets = powerSetRecursive(s.slice(0, -1));\n    \n    // Add last character to all previous subsets\n    const result = [...prevSubsets, ...prevSubsets.map(subset => subset + s[s.length - 1])];\n    return result;\n}\n\n// Main execution\nconst input = fs.readFileSync(0, 'utf-8').trim();\nconst result = powerSet(input);\nconsole.log(JSON.stringify(result));`
        },
        {
          language: 'cpp',
          code: `#include <bits/stdc++.h>\nusing namespace std;\n\nvector<string> powerSet(string s) {\n    /**\n     * Generate all subsets (power set) of given string.\n     * \n     * Bit manipulation approach:\n     * - For n elements, iterate from 0 to 2^n - 1\n     * - For each number, check each bit\n     * - If bit is set, include character at that position\n     */\n    vector<string> result;\n    int n = s.length();\n    int totalSubsets = 1 << n; // 2^n\n    \n    for (int i = 0; i < totalSubsets; i++) {\n        string subset = \"\";\n        for (int j = 0; j < n; j++) {\n            // Check if jth bit is set in i\n            if (i & (1 << j)) {\n                subset += s[j];\n            }\n        }\n        result.push_back(subset);\n    }\n    \n    return result;\n}\n\nint main() {\n    string s;\n    cin >> s;\n    \n    vector<string> result = powerSet(s);\n    cout << \"[\";\n    for (int i = 0; i < result.size(); i++) {\n        cout << \"\\\"\" << result[i] << \"\\\"\";\n        if (i < result.size() - 1) cout << \", \";\n    }\n    cout << \"]\\n\";\n    \n    return 0;\n}`
        },
        {
          language: 'java',
          code: `import java.util.*;\nimport java.io.*;\n\npublic class Solution {\n    /**\n     * Generate all subsets (power set) of given string.\n     * \n     * Iterative approach:\n     * - Start with empty subset\n     * - For each character, add it to all existing subsets\n     * - This doubles the number of subsets each iteration\n     */\n    public List<String> powerSet(String s) {\n        List<String> result = new ArrayList<>();\n        result.add(\"\");\n        \n        for (char c : s.toCharArray()) {\n            int size = result.size();\n            for (int i = 0; i < size; i++) {\n                result.add(result.get(i) + c);\n            }\n        }\n        \n        return result;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String s = br.readLine().trim();\n        \n        Solution sol = new Solution();\n        List<String> result = sol.powerSet(s);\n        \n        System.out.print(\"[\");\n        for (int i = 0; i < result.size(); i++) {\n            System.out.print(\"\\\"\" + result.get(i) + \"\\\"\");\n            if (i < result.size() - 1) System.out.print(\", \");\n        }\n        System.out.println(\"]\");\n    }\n}`
        }
      ],
      testCases: [
        {
          input: 'ab',
          output: '["", "a", "b", "ab"]',
          isHidden: false
        },
        {
          input: 'abc',
          output: '["", "a", "b", "ab", "c", "ac", "bc", "abc"]',
          isHidden: false
        },
        {
          input: 'a',
          output: '["", "a"]',
          isHidden: false
        },
        {
          input: '',
          output: '[""]',
          isHidden: true
        },
        {
          input: 'abcd',
          output: '["", "a", "b", "ab", "c", "ac", "bc", "abc", "d", "ad", "bd", "abd", "cd", "acd", "bcd", "abcd"]',
          isHidden: true
        },
        {
          input: 'xyz',
          output: '["", "x", "y", "xy", "z", "xz", "yz", "xyz"]',
          isHidden: true
        }
      ],
      xpReward: 6
    };

    const result = await prisma.question.upsert({
      where: { slug: powerSetProblem.slug },
      update: powerSetProblem,
      create: powerSetProblem
    });

    console.log('✅ Power Set problem created successfully!');
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

updatePowerSetProblem();
