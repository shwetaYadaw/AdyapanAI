import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { getMysqlPool, initializeMysql } from '../config/mysql';
import { logger } from '../utils/logger';

const PHASES = [
  { num: 0, name: 'Prerequisites', desc: 'Variables, loops, functions, basic OOP, time/space complexity', dur: '1 Week' },
  { num: 1, name: 'Learn Problem Solving', desc: 'Big O, Dry run, recursion, binary search thinking, two pointers, sliding window', dur: '1-2 Weeks' },
  { num: 2, name: 'Arrays + Strings', desc: 'Kadane, sorting, palindrome, sliding window, patterns', dur: '2-3 Weeks' },
  { num: 3, name: 'Searching + Sorting', desc: 'Binary search, merge sort, quick sort, search limits', dur: '1 Week' },
  { num: 4, name: 'Linked List', desc: 'Reverse, cycle detection, merge list, LRU Cache', dur: '1-2 Weeks' },
  { num: 5, name: 'Stack + Queue', desc: 'Monotonic stack, valid parentheses, queues', dur: '1 Week' },
  { num: 6, name: 'Trees', desc: 'DFS, BFS traversals, tree height/diameter, LCA', dur: '2 Weeks' },
  { num: 7, name: 'Binary Search Tree', desc: 'BST insertion, deletion, validate BST, LCA', dur: '1 Week' },
  { num: 8, name: 'Heap + Hashing', desc: 'Priority queues, hashing operations, sliding window max', dur: '1 Week' },
  { num: 9, name: 'Graph', desc: 'Representation, BFS/DFS, topological sort, MST, shortest path algorithms', dur: '2 Weeks' },
  { num: 10, name: 'Dynamic Programming', desc: 'Recursion to DP, Knapsack, Coin Change, LIS, LCS, MCM', dur: '3 Weeks' },
  { num: 11, name: 'Tries', desc: 'Prefix trees, auto-complete design, dictionary search', dur: '1 Week' },
  { num: 12, name: 'Backtracking', desc: 'N-Queens, Sudoku solver, combination sum', dur: '1-2 Weeks' },
  { num: 13, name: 'Greedy Algorithms', desc: 'Activity selection, fractional knapsack, scheduling', dur: '1 Week' },
  { num: 14, name: 'Bit Manipulation', desc: 'XOR logic, powers of two, counting bits', dur: '1 Week' }
];

const QUESTIONS = [
  {
    phaseNum: 2,
    title: 'Two Sum',
    slug: 'two-sum-mysql',
    statement: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
    difficulty: 'easy',
    topics: 'arrays, hashmap',
    companies: 'google, amazon, microsoft',
    timeLimit: 2000,
    memoryLimit: 256,
    inputFormat: 'Line 1: Space-separated integers representing the array.\nLine 2: Single integer representing the target.',
    outputFormat: 'Space-separated indices of the two numbers.',
    constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9',
    sampleInput: '2 7 11 15\n9',
    sampleOutput: '0 1',
    templates: [
      { language: 'python', code: 'import sys\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    nums = list(map(int, lines[0].split()))\n    target = int(lines[1])\n    # Implement here\n    # Example Output: print("0 1")\n    lookup = {}\n    for i, n in enumerate(nums):\n        if target - n in lookup:\n            print(f"{lookup[target-n]} {i}")\n            return\n        lookup[n] = i\n\nif __name__ == "__main__":\n    solve()' },
      { language: 'javascript', code: 'const fs = require("fs");\nfunction solve() {\n    const input = fs.readFileSync(0, "utf-8").trim().split("\\n");\n    const nums = input[0].split(" ").map(Number);\n    const target = parseInt(input[1], 10);\n    // Implement here\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        if (map.has(target - nums[i])) {\n            console.log(map.get(target - nums[i]) + " " + i);\n            return;\n        }\n        map.set(nums[i], i);\n    }\n}\nsolve();' },
      { language: 'cpp', code: '#include <iostream>\n#include <vector>\n#include <unordered_map>\n#include <sstream>\nusing namespace std; \nint main() {\n    string line1;\n    if (getline(cin, line1)) {\n        stringstream ss(line1);\n        int val;\n        vector<int> nums;\n        while (ss >> val) nums.push_back(val);\n        int target;\n        cin >> target;\n        unordered_map<int, int> map;\n        for (int i = 0; i < nums.size(); i++) {\n            if (map.count(target - nums[i])) {\n                cout << map[target - nums[i]] << " " << i << endl;\n                return 0;\n            }\n            map[nums[i]] = i;\n        }\n    }\n    return 0;\n}' },
      { language: 'java', code: 'import java.util.*;\nimport java.io.*;\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String line = br.readLine();\n        if (line == null) return;\n        String[] parts = line.trim().split("\\s+");\n        int[] nums = new int[parts.length];\n        for (int i = 0; i < parts.length; i++) nums[i] = Integer.parseInt(parts[i]);\n        int target = Integer.parseInt(br.readLine().trim());\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            if (map.containsKey(target - nums[i])) {\n                System.out.println(map.get(target - nums[i]) + " " + i);\n                return;\n            }\n            map.put(nums[i], i);\n        }\n    }\n}' }
    ],
    testCases: [
      { input: '2 7 11 15\n9', output: '0 1' },
      { input: '3 2 4\n6', output: '1 2' }
    ],
    xpReward: 15
  },
  {
    phaseNum: 14,
    title: 'Power of Two',
    slug: 'power-of-two-mysql',
    statement: 'Given an integer `n`, return `true` if it is a power of two. Otherwise, return `false`. An integer `n` is a power of two if there exists an integer `x` such that `n == 2^x`.',
    difficulty: 'easy',
    topics: 'bit-manipulation',
    companies: 'google, apple',
    timeLimit: 1000,
    memoryLimit: 128,
    inputFormat: 'A single integer n.',
    outputFormat: 'true or false.',
    constraints: '-2^31 <= n <= 2^31 - 1',
    sampleInput: '16',
    sampleOutput: 'true',
    templates: [
      { language: 'python', code: 'import sys\ndef solve():\n    n = int(sys.stdin.read().strip())\n    print("true" if n > 0 and (n & (n - 1)) == 0 else "false")\nif __name__ == "__main__":\n    solve()' },
      { language: 'javascript', code: 'const fs = require("fs");\nfunction solve() {\n    const n = parseInt(fs.readFileSync(0, "utf-8").trim(), 10);\n    console.log(n > 0 && (n & (n - 1)) === 0 ? "true" : "false");\n}\nsolve();' },
      { language: 'cpp', code: '#include <iostream>\nusing namespace std;\nint main() {\n    long long n;\n    if (cin >> n) {\n        if (n > 0 && (n & (n - 1)) == 0) cout << "true" << endl;\n        else cout << "false" << endl;\n    }\n    return 0;\n}' },
      { language: 'java', code: 'import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextLong()) {\n            long n = sc.nextLong();\n            if (n > 0 && (n & (n - 1)) == 0) System.out.println("true");\n            else System.out.println("false");\n        }\n    }\n}' }
    ],
    testCases: [
      { input: '1', output: 'true' },
      { input: '16', output: 'true' },
      { input: '3', output: 'false' },
      { input: '-8', output: 'false' }
    ],
    xpReward: 10
  }
];

async function seed() {
  await initializeMysql();
  const pool = getMysqlPool();

  try {
    logger.info('🌱 Seeding MySQL coding roadmap...');

    // Seed phases
    for (const phase of PHASES) {
      await pool.query(
        `INSERT INTO roadmap_phases (phase_number, name, description, duration)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description), duration=VALUES(duration)`,
        [phase.num, phase.name, phase.desc, phase.dur]
      );
    }
    logger.info('✅ Seeding phases complete');

    // Retrieve phases to get their IDs
    const [rows]: any = await pool.query('SELECT id, phase_number FROM roadmap_phases');
    const phaseMap = new Map<number, number>();
    for (const row of rows) {
      phaseMap.set(row.phase_number, row.id);
    }

    // Seed questions
    for (const q of QUESTIONS) {
      const phaseId = phaseMap.get(q.phaseNum);
      if (!phaseId) continue;

      await pool.query(
        `INSERT INTO roadmap_questions (phase_id, title, slug, statement, difficulty, topics, companies, time_limit, memory_limit, input_format, output_format, constraints, sample_input, sample_output, templates, test_cases, xp_reward)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title=VALUES(title), statement=VALUES(statement), difficulty=VALUES(difficulty), templates=VALUES(templates), test_cases=VALUES(test_cases)`,
        [
          phaseId,
          q.title,
          q.slug,
          q.statement,
          q.difficulty,
          q.topics,
          q.companies,
          q.timeLimit,
          q.memoryLimit,
          q.inputFormat,
          q.outputFormat,
          q.constraints,
          q.sampleInput,
          q.sampleOutput,
          JSON.stringify(q.templates),
          JSON.stringify(q.testCases),
          q.xpReward
        ]
      );
    }
    logger.info('✅ Seeding questions complete');

    process.exit(0);
  } catch (error) {
    logger.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
