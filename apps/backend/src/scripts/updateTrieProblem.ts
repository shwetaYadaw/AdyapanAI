import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function updateTrieProblem() {
  try {
    const trieProblem = {
      title: 'Implement Trie (Prefix Tree)',
      slug: 'implement-trie-prefix-tree',
      statement: `A trie (pronounced as "try") or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. There are various applications of this data structure, such as autocomplete and spellchecker.

Implement the Trie class:

- \`Trie()\` Initializes the trie object.
- \`void insert(String word)\` Inserts the string word into the trie.
- \`boolean search(String word)\` Returns true if the string word is in the trie (i.e., was inserted before), and false otherwise.
- \`boolean startsWith(String prefix)\` Returns true if there is a previously inserted string word that has the prefix prefix, and false otherwise.

### Example 1

**Input:**
\`\`\`
["Trie", "insert", "search", "search", "startsWith", "insert", "search"]
[[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]
\`\`\`

**Output:**
\`\`\`
[null, null, true, false, true, null, true]
\`\`\`

**Explanation:**
\`\`\`
Trie trie = new Trie();
trie.insert("apple");
trie.search("apple");   // return True
trie.search("app");     // return False
trie.startsWith("app"); // return True
trie.insert("app");
trie.search("app");     // return True
\`\`\``,
      difficulty: 'medium',
      topics: ['trie'],
      companies: ['Google', 'Amazon', 'Microsoft', 'Facebook', 'Bloomberg'],
      timeLimit: 1000,
      memoryLimit: 128,
      inputFormat: 'The first line contains the number of operations. Each subsequent line contains an operation: "Trie", "insert word", "search word", or "startsWith prefix".',
      outputFormat: 'Return an array where each operation returns null for Trie() and insert(), true/false for search() and startsWith().',
      constraints: '1 <= word.length, prefix.length <= 2000\nword and prefix consist only of lowercase English letters.\nAt most 3 * 10^4 calls in total will be made to insert, search, and startsWith.',
      sampleInput: '7\nTrie\ninsert apple\nsearch apple\nsearch app\nstartsWith app\ninsert app\nsearch app',
      sampleOutput: 'null\nnull\ntrue\nfalse\ntrue\nnull\ntrue',
      templates: [
        {
          language: 'python',
          code: `class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_end = False\n\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()\n    \n    def insert(self, word: str) -> None:\n        node = self.root\n        for char in word:\n            if char not in node.children:\n                node.children[char] = TrieNode()\n            node = node.children[char]\n        node.is_end = True\n    \n    def search(self, word: str) -> bool:\n        node = self.root\n        for char in word:\n            if char not in node.children:\n                return False\n            node = node.children[char]\n        return node.is_end\n    \n    def startsWith(self, prefix: str) -> bool:\n        node = self.root\n        for char in prefix:\n            if char not in node.children:\n                return False\n            node = node.children[char]\n        return True\n\n# Main execution\nfs = require('fs')\ninput_lines = fs.readFileSync(0, 'utf-8').trim().split('\\n')\nn = int(input_lines[0])\ntrie = None\nresults = []\n\nfor i in range(1, n + 1):\n    parts = input_lines[i].split()\n    op = parts[0]\n    \n    if op == 'Trie':\n        trie = Trie()\n        results.append('null')\n    elif op == 'insert':\n        word = parts[1]\n        trie.insert(word)\n        results.append('null')\n    elif op == 'search':\n        word = parts[1]\n        results.append('true' if trie.search(word) else 'false')\n    elif op == 'startsWith':\n        prefix = parts[1]\n        results.append('true' if trie.startsWith(prefix) else 'false')\n\nfor res in results:\n    print(res)`
        },
        {
          language: 'javascript',
          code: `const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf-8').trim().split('\\n');\n\nclass TrieNode {\n    constructor() {\n        this.children = {};\n        this.isEnd = false;\n    }\n}\n\nclass Trie {\n    constructor() {\n        this.root = new TrieNode();\n    }\n    \n    insert(word) {\n        let node = this.root;\n        for (let char of word) {\n            if (!node.children[char]) {\n                node.children[char] = new TrieNode();\n            }\n            node = node.children[char];\n        }\n        node.isEnd = true;\n    }\n    \n    search(word) {\n        let node = this.root;\n        for (let char of word) {\n            if (!node.children[char]) {\n                return false;\n            }\n            node = node.children[char];\n        }\n        return node.isEnd;\n    }\n    \n    startsWith(prefix) {\n        let node = this.root;\n        for (let char of prefix) {\n            if (!node.children[char]) {\n                return false;\n            }\n            node = node.children[char];\n        }\n        return true;\n    }\n}\n\nconst n = parseInt(input[0]);\nlet trie = null;\nconst results = [];\n\nfor (let i = 1; i <= n; i++) {\n    const parts = input[i].split(' ');\n    const op = parts[0];\n    \n    if (op === 'Trie') {\n        trie = new Trie();\n        results.push('null');\n    } else if (op === 'insert') {\n        const word = parts[1];\n        trie.insert(word);\n        results.push('null');\n    } else if (op === 'search') {\n        const word = parts[1];\n        results.push(trie.search(word) ? 'true' : 'false');\n    } else if (op === 'startsWith') {\n        const prefix = parts[1];\n        results.push(trie.startsWith(prefix) ? 'true' : 'false');\n    }\n}\n\nfor (let res of results) {\n    console.log(res);\n}`
        },
        {
          language: 'cpp',
          code: `#include <bits/stdc++.h>\nusing namespace std;\n\nstruct TrieNode {\n    unordered_map<char, TrieNode*> children;\n    bool isEnd = false;\n};\n\nclass Trie {\npublic:\n    TrieNode* root;\n    \n    Trie() {\n        root = new TrieNode();\n    }\n    \n    void insert(string word) {\n        TrieNode* node = root;\n        for (char c : word) {\n            if (node->children.find(c) == node->children.end()) {\n                node->children[c] = new TrieNode();\n            }\n            node = node->children[c];\n        }\n        node->isEnd = true;\n    }\n    \n    bool search(string word) {\n        TrieNode* node = root;\n        for (char c : word) {\n            if (node->children.find(c) == node->children.end()) {\n                return false;\n            }\n            node = node->children[c];\n        }\n        return node->isEnd;\n    }\n    \n    bool startsWith(string prefix) {\n        TrieNode* node = root;\n        for (char c : prefix) {\n            if (node->children.find(c) == node->children.end()) {\n                return false;\n            }\n            node = node->children[c];\n        }\n        return true;\n    }\n};\n\nint main() {\n    int n;\n    cin >> n;\n    cin.ignore();\n    \n    Trie* trie = nullptr;\n    \n    for (int i = 0; i < n; i++) {\n        string line;\n        getline(cin, line);\n        \n        stringstream ss(line);\n        string op, arg;\n        ss >> op >> arg;\n        \n        if (op == \"Trie\") {\n            trie = new Trie();\n            cout << \"null\\n\";\n        } else if (op == \"insert\") {\n            trie->insert(arg);\n            cout << \"null\\n\";\n        } else if (op == \"search\") {\n            cout << (trie->search(arg) ? \"true\" : \"false\") << \"\\n\";\n        } else if (op == \"startsWith\") {\n            cout << (trie->startsWith(arg) ? \"true\" : \"false\") << \"\\n\";\n        }\n    }\n    \n    return 0;\n}`
        },
        {
          language: 'java',
          code: `import java.util.*;\nimport java.io.*;\n\nclass TrieNode {\n    Map<Character, TrieNode> children = new HashMap<>();\n    boolean isEnd = false;\n}\n\nclass Trie {\n    private TrieNode root;\n    \n    public Trie() {\n        root = new TrieNode();\n    }\n    \n    public void insert(String word) {\n        TrieNode node = root;\n        for (char c : word.toCharArray()) {\n            if (!node.children.containsKey(c)) {\n                node.children.put(c, new TrieNode());\n            }\n            node = node.children.get(c);\n        }\n        node.isEnd = true;\n    }\n    \n    public boolean search(String word) {\n        TrieNode node = root;\n        for (char c : word.toCharArray()) {\n            if (!node.children.containsKey(c)) {\n                return false;\n            }\n            node = node.children.get(c);\n        }\n        return node.isEnd;\n    }\n    \n    public boolean startsWith(String prefix) {\n        TrieNode node = root;\n        for (char c : prefix.toCharArray()) {\n            if (!node.children.containsKey(c)) {\n                return false;\n            }\n            node = node.children.get(c);\n        }\n        return true;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        int n = Integer.parseInt(br.readLine());\n        \n        Trie trie = null;\n        \n        for (int i = 0; i < n; i++) {\n            String line = br.readLine().trim();\n            String[] parts = line.split(\" \");\n            String op = parts[0];\n            \n            if (op.equals(\"Trie\")) {\n                trie = new Trie();\n                System.out.println(\"null\");\n            } else if (op.equals(\"insert\")) {\n                String word = parts[1];\n                trie.insert(word);\n                System.out.println(\"null\");\n            } else if (op.equals(\"search\")) {\n                String word = parts[1];\n                System.out.println(trie.search(word) ? \"true\" : \"false\");\n            } else if (op.equals(\"startsWith\")) {\n                String prefix = parts[1];\n                System.out.println(trie.startsWith(prefix) ? \"true\" : \"false\");\n            }\n        }\n    }\n}`
        }
      ],
      testCases: [
        { 
          input: '7\nTrie\ninsert apple\nsearch apple\nsearch app\nstartsWith app\ninsert app\nsearch app', 
          output: 'null\nnull\ntrue\nfalse\ntrue\nnull\ntrue', 
          isHidden: false 
        },
        { 
          input: '6\nTrie\ninsert cat\nstartsWith ca\nstartsWith dog\nsearch cat\nsearch dog', 
          output: 'null\nnull\ntrue\nfalse\ntrue\nfalse', 
          isHidden: false 
        },
        { 
          input: '5\nTrie\ninsert hello\ninsert hell\nsearch hello\nsearch he', 
          output: 'null\nnull\nnull\ntrue\nfalse', 
          isHidden: true 
        }
      ],
      xpReward: 8
    };

    // Update or create the problem
    const result = await prisma.question.upsert({
      where: { slug: trieProblem.slug },
      update: trieProblem,
      create: trieProblem
    });

    console.log('✅ Implement Trie problem updated successfully!');
    console.log('Problem:', result.title);
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to update problem:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

updateTrieProblem();
