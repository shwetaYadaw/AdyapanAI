import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function updateMapSumPairsProblem() {
  try {
    // Delete old versions if they exist
    await prisma.question.deleteMany({
      where: {
        slug: {
          in: ['map-sum-pairs', 'map-sum-pairs-trie']
        }
      }
    }).catch(() => {});

    const mapSumPairsProblem = {
      title: 'Map Sum Pairs',
      slug: 'map-sum-pairs',
      statement: `Design a map that allows you to do the following:

- Maps a string key to a given value.
- Returns the sum of the values that have a key with a prefix equal to a given string.

Implement the MapSum class:

- \`MapSum()\` Initializes the MapSum object.
- \`void insert(String key, int val)\` Inserts the key-val pair into the map. If the key already existed, the original key-value pair will be overridden to the new one.
- \`int sum(string prefix)\` Returns the sum of all the pairs' value whose key starts with the prefix.

### Example 1

**Input:**
\`\`\`
["MapSum", "insert", "sum", "insert", "sum"]
[[], ["apple", 3], ["ap"], ["app", 2], ["ap"]]
\`\`\`

**Output:**
\`\`\`
[null, null, 3, null, 5]
\`\`\`

**Explanation:**
\`\`\`
MapSum mapSum = new MapSum();
mapSum.insert("apple", 3);
mapSum.sum("ap");           // return 3 (apple = 3)
mapSum.insert("app", 2);
mapSum.sum("ap");           // return 5 (apple + app = 3 + 2 = 5)
\`\`\`

### Example 2

**Input:**
\`\`\`
["MapSum", "insert", "insert", "sum", "insert", "sum"]
[[], ["bat", 5], ["bat", 10], ["ba"], ["bat", 2], ["ba"]]
\`\`\`

**Output:**
\`\`\`
[null, null, null, 15, null, 7]
\`\`\`

**Explanation:**
\`\`\`
MapSum mapSum = new MapSum();
mapSum.insert("bat", 5);    // New key, value = 5
mapSum.insert("bat", 10);   // Update existing key, value = 10
mapSum.sum("ba");           // return 15 (bat = 10)
mapSum.insert("bat", 2);    // Update existing key, value = 2
mapSum.sum("ba");           // return 2 (bat = 2)
\`\`\``,
      difficulty: 'medium',
      topics: ['trie', 'hash-table', 'design'],
      companies: ['Google', 'Amazon', 'Bloomberg'],
      timeLimit: 1000,
      memoryLimit: 128,
      inputFormat: 'A sequence of operations with ["MapSum", "insert", "sum", ...]. For insert, provide key and value. For sum, provide prefix.',
      outputFormat: 'Return results of each operation. insert returns null, sum returns the integer sum.',
      constraints: '1 <= key.length, prefix.length <= 50\nkey and prefix consist of only lowercase English letters.\n1 <= val <= 1000\nAt most 50 calls will be made to insert and sum.',
      sampleInput: '5\nMapSum\ninsert apple 3\nsum ap\ninsert app 2\nsum ap',
      sampleOutput: 'null\nnull\n3\nnull\n5',
      templates: [
        {
          language: 'python',
          code: `class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.value = 0\n\nclass MapSum:\n    def __init__(self):\n        self.root = TrieNode()\n        self.map = {}  # Store current values for keys\n    \n    def insert(self, key: str, val: int) -> None:\n        # Calculate the difference to add/subtract\n        delta = val - self.map.get(key, 0)\n        self.map[key] = val\n        \n        # Update the trie with delta\n        node = self.root\n        for char in key:\n            if char not in node.children:\n                node.children[char] = TrieNode()\n            node = node.children[char]\n            node.value += delta\n    \n    def sum(self, prefix: str) -> int:\n        node = self.root\n        for char in prefix:\n            if char not in node.children:\n                return 0\n            node = node.children[char]\n        return node.value\n\nfs = require('fs')\ninput_lines = fs.readFileSync(0, 'utf-8').strip().split('\\n')\nn = int(input_lines[0])\n\nmapSum = None\nresults = []\n\nfor i in range(1, n + 1):\n    parts = input_lines[i].split()\n    op = parts[0]\n    \n    if op == 'MapSum':\n        mapSum = MapSum()\n        results.append('null')\n    elif op == 'insert':\n        key = parts[1]\n        val = int(parts[2])\n        mapSum.insert(key, val)\n        results.append('null')\n    elif op == 'sum':\n        prefix = parts[1]\n        results.append(str(mapSum.sum(prefix)))\n\nfor res in results:\n    print(res)`
        },
        {
          language: 'javascript',
          code: `const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf-8').trim().split('\\n');\n\nclass TrieNode {\n    constructor() {\n        this.children = {};\n        this.value = 0;\n    }\n}\n\nclass MapSum {\n    constructor() {\n        this.root = new TrieNode();\n        this.map = {}; // Store current values for keys\n    }\n    \n    insert(key, val) {\n        // Calculate the difference to add/subtract\n        const delta = val - (this.map[key] || 0);\n        this.map[key] = val;\n        \n        // Update the trie with delta\n        let node = this.root;\n        for (let char of key) {\n            if (!node.children[char]) {\n                node.children[char] = new TrieNode();\n            }\n            node = node.children[char];\n            node.value += delta;\n        }\n    }\n    \n    sum(prefix) {\n        let node = this.root;\n        for (let char of prefix) {\n            if (!node.children[char]) {\n                return 0;\n            }\n            node = node.children[char];\n        }\n        return node.value;\n    }\n}\n\nconst n = parseInt(input[0]);\nlet mapSum = null;\nconst results = [];\n\nfor (let i = 1; i <= n; i++) {\n    const parts = input[i].split(' ');\n    const op = parts[0];\n    \n    if (op === 'MapSum') {\n        mapSum = new MapSum();\n        results.push('null');\n    } else if (op === 'insert') {\n        const key = parts[1];\n        const val = parseInt(parts[2]);\n        mapSum.insert(key, val);\n        results.push('null');\n    } else if (op === 'sum') {\n        const prefix = parts[1];\n        results.push(String(mapSum.sum(prefix)));\n    }\n}\n\nfor (let res of results) {\n    console.log(res);\n}`
        },
        {
          language: 'cpp',
          code: `#include <bits/stdc++.h>\nusing namespace std;\n\nstruct TrieNode {\n    unordered_map<char, TrieNode*> children;\n    int value = 0;\n};\n\nclass MapSum {\nprivate:\n    TrieNode* root;\n    unordered_map<string, int> map;\n    \npublic:\n    MapSum() {\n        root = new TrieNode();\n    }\n    \n    void insert(string key, int val) {\n        // Calculate the difference to add/subtract\n        int delta = val - (map.count(key) ? map[key] : 0);\n        map[key] = val;\n        \n        // Update the trie with delta\n        TrieNode* node = root;\n        for (char c : key) {\n            if (node->children.find(c) == node->children.end()) {\n                node->children[c] = new TrieNode();\n            }\n            node = node->children[c];\n            node->value += delta;\n        }\n    }\n    \n    int sum(string prefix) {\n        TrieNode* node = root;\n        for (char c : prefix) {\n            if (node->children.find(c) == node->children.end()) {\n                return 0;\n            }\n            node = node->children[c];\n        }\n        return node->value;\n    }\n};\n\nint main() {\n    int n;\n    cin >> n;\n    cin.ignore();\n    \n    MapSum* mapSum = nullptr;\n    \n    for (int i = 0; i < n; i++) {\n        string line;\n        getline(cin, line);\n        \n        stringstream ss(line);\n        string op, arg1;\n        ss >> op >> arg1;\n        \n        if (op == \"MapSum\") {\n            mapSum = new MapSum();\n            cout << \"null\\n\";\n        } else if (op == \"insert\") {\n            int val;\n            ss >> val;\n            mapSum->insert(arg1, val);\n            cout << \"null\\n\";\n        } else if (op == \"sum\") {\n            cout << mapSum->sum(arg1) << \"\\n\";\n        }\n    }\n    \n    return 0;\n}`
        },
        {
          language: 'java',
          code: `import java.util.*;\nimport java.io.*;\n\nclass TrieNode {\n    Map<Character, TrieNode> children = new HashMap<>();\n    int value = 0;\n}\n\nclass MapSum {\n    private TrieNode root;\n    private Map<String, Integer> map;\n    \n    public MapSum() {\n        root = new TrieNode();\n        map = new HashMap<>();\n    }\n    \n    public void insert(String key, int val) {\n        // Calculate the difference to add/subtract\n        int delta = val - map.getOrDefault(key, 0);\n        map.put(key, val);\n        \n        // Update the trie with delta\n        TrieNode node = root;\n        for (char c : key.toCharArray()) {\n            if (!node.children.containsKey(c)) {\n                node.children.put(c, new TrieNode());\n            }\n            node = node.children.get(c);\n            node.value += delta;\n        }\n    }\n    \n    public int sum(String prefix) {\n        TrieNode node = root;\n        for (char c : prefix.toCharArray()) {\n            if (!node.children.containsKey(c)) {\n                return 0;\n            }\n            node = node.children.get(c);\n        }\n        return node.value;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        int n = Integer.parseInt(br.readLine());\n        \n        MapSum mapSum = null;\n        \n        for (int i = 0; i < n; i++) {\n            String line = br.readLine().trim();\n            String[] parts = line.split(\" \");\n            String op = parts[0];\n            \n            if (op.equals(\"MapSum\")) {\n                mapSum = new MapSum();\n                System.out.println(\"null\");\n            } else if (op.equals(\"insert\")) {\n                String key = parts[1];\n                int val = Integer.parseInt(parts[2]);\n                mapSum.insert(key, val);\n                System.out.println(\"null\");\n            } else if (op.equals(\"sum\")) {\n                String prefix = parts[1];\n                System.out.println(mapSum.sum(prefix));\n            }\n        }\n    }\n}`
        }
      ],
      testCases: [
        {
          input: '5\nMapSum\ninsert apple 3\nsum ap\ninsert app 2\nsum ap',
          output: 'null\nnull\n3\nnull\n5',
          isHidden: false
        },
        {
          input: '6\nMapSum\ninsert bat 5\ninsert bat 10\nsum ba\ninsert bat 2\nsum ba',
          output: 'null\nnull\nnull\n15\nnull\n2',
          isHidden: false
        },
        {
          input: '7\nMapSum\ninsert hello 10\nsum he\ninsert help 5\nsum hel\ninsert hell 2\nsum hel',
          output: 'null\nnull\n10\nnull\n17\nnull\n17',
          isHidden: true
        }
      ],
      xpReward: 8
    };

    const result = await prisma.question.upsert({
      where: { slug: mapSumPairsProblem.slug },
      update: mapSumPairsProblem,
      create: mapSumPairsProblem
    });

    console.log('✅ Map Sum Pairs problem created successfully!');
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

updateMapSumPairsProblem();
