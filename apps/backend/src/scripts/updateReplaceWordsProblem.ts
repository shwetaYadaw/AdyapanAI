import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function updateReplaceWordsProblem() {
  try {
    const replaceWordsProblem = {
      title: 'Replace Words',
      slug: 'replace-words',
      statement: `In English, we have a concept called root, which can be followed by some other word to form another longer word - let's call this word derivative. For example, when the root "help" is followed by the word "ful", we can form a derivative "helpful".

Given a dictionary consisting of many roots and a sentence consisting of words separated by spaces, replace all the derivatives in the sentence with the root forming it. If a derivative can be replaced by more than one root, replace it with the root that has the shortest length.

Return the sentence after the replacement.

### Example 1

**Input:**
\`\`\`
dictionary = ["cat","bat","rat"], sentence = "the cattle was rattled by the battery"
\`\`\`

**Output:**
\`\`\`
"the cat was rat by the bat"
\`\`\`

**Explanation:**
The words "cattle", "rattled", and "battery" are replaced by "cat", "rat", and "bat" respectively.

### Example 2

**Input:**
\`\`\`
dictionary = ["a","b","c"], sentence = "aadsfasf absbs bbab cadsfafs"
\`\`\`

**Output:**
\`\`\`
"a a b c"
\`\`\`

**Explanation:**
In this example:
- "aadsfasf" starts with "a", so it gets replaced by "a"
- "absbs" starts with "a", so it gets replaced by "a"
- "bbab" starts with "b", so it gets replaced by "b"
- "cadsfafs" starts with "c", so it gets replaced by "c"`,
      difficulty: 'medium',
      topics: ['trie', 'hash-table', 'string'],
      companies: ['Google', 'Amazon', 'Apple'],
      timeLimit: 1000,
      memoryLimit: 128,
      inputFormat: 'First line contains the dictionary size n, followed by n root words. Next line contains the sentence.',
      outputFormat: 'Return the sentence after replacing all derivatives with their roots.',
      constraints: '1 <= dictionary.length <= 1000\n1 <= dictionary[i].length <= 100\ndictionary[i] consists of only lower-case letters.\n1 <= sentence.length <= 10^6\nsentence consists of only lower-case letters and spaces.\nThe number of words in sentence is in the range [1, 1000]\nThe length of each word in sentence is in the range [1, 1000]\nEvery two consecutive words in sentence will be separated by exactly one space.\nsentence does not have leading or trailing spaces.',
      sampleInput: '3\ncat\nbat\nrat\nthe cattle was rattled by the battery',
      sampleOutput: 'the cat was rat by the bat',
      templates: [
        {
          language: 'python',
          code: `class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_root = False\n        self.root_value = None\n\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()\n    \n    def insert(self, word):\n        node = self.root\n        for char in word:\n            if char not in node.children:\n                node.children[char] = TrieNode()\n            node = node.children[char]\n        node.is_root = True\n        node.root_value = word\n    \n    def find_root(self, word):\n        node = self.root\n        for char in word:\n            if char not in node.children:\n                return None\n            node = node.children[char]\n            if node.is_root:\n                return node.root_value\n        return None\n\nfs = require('fs')\ninput_lines = fs.readFileSync(0, 'utf-8').strip().split('\\n')\nn = int(input_lines[0])\n\ntrie = Trie()\nfor i in range(1, n + 1):\n    trie.insert(input_lines[i])\n\nsentence = input_lines[n + 1]\nwords = sentence.split(' ')\nresult = []\n\nfor word in words:\n    root = trie.find_root(word)\n    if root:\n        result.append(root)\n    else:\n        result.append(word)\n\nprint(' '.join(result))`
        },
        {
          language: 'javascript',
          code: `const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf-8').trim().split('\\n');\n\nclass TrieNode {\n    constructor() {\n        this.children = {};\n        this.isRoot = false;\n        this.rootValue = null;\n    }\n}\n\nclass Trie {\n    constructor() {\n        this.root = new TrieNode();\n    }\n    \n    insert(word) {\n        let node = this.root;\n        for (let char of word) {\n            if (!node.children[char]) {\n                node.children[char] = new TrieNode();\n            }\n            node = node.children[char];\n        }\n        node.isRoot = true;\n        node.rootValue = word;\n    }\n    \n    findRoot(word) {\n        let node = this.root;\n        for (let char of word) {\n            if (!node.children[char]) {\n                return null;\n            }\n            node = node.children[char];\n            if (node.isRoot) {\n                return node.rootValue;\n            }\n        }\n        return null;\n    }\n}\n\nconst n = parseInt(input[0]);\nconst trie = new Trie();\n\nfor (let i = 1; i <= n; i++) {\n    trie.insert(input[i]);\n}\n\nconst sentence = input[n + 1];\nconst words = sentence.split(' ');\nconst result = [];\n\nfor (let word of words) {\n    const root = trie.findRoot(word);\n    result.push(root ? root : word);\n}\n\nconsole.log(result.join(' '));`
        },
        {
          language: 'cpp',
          code: `#include <bits/stdc++.h>\nusing namespace std;\n\nstruct TrieNode {\n    unordered_map<char, TrieNode*> children;\n    bool isRoot = false;\n    string rootValue = \"\";\n};\n\nclass Trie {\npublic:\n    TrieNode* root;\n    \n    Trie() {\n        root = new TrieNode();\n    }\n    \n    void insert(string word) {\n        TrieNode* node = root;\n        for (char c : word) {\n            if (node->children.find(c) == node->children.end()) {\n                node->children[c] = new TrieNode();\n            }\n            node = node->children[c];\n        }\n        node->isRoot = true;\n        node->rootValue = word;\n    }\n    \n    string findRoot(string word) {\n        TrieNode* node = root;\n        for (char c : word) {\n            if (node->children.find(c) == node->children.end()) {\n                return \"\";\n            }\n            node = node->children[c];\n            if (node->isRoot) {\n                return node->rootValue;\n            }\n        }\n        return \"\";\n    }\n};\n\nint main() {\n    int n;\n    cin >> n;\n    cin.ignore();\n    \n    Trie trie;\n    vector<string> dictionary(n);\n    \n    for (int i = 0; i < n; i++) {\n        getline(cin, dictionary[i]);\n        trie.insert(dictionary[i]);\n    }\n    \n    string sentence;\n    getline(cin, sentence);\n    \n    stringstream ss(sentence);\n    string word;\n    vector<string> result;\n    \n    while (ss >> word) {\n        string root = trie.findRoot(word);\n        if (!root.empty()) {\n            result.push_back(root);\n        } else {\n            result.push_back(word);\n        }\n    }\n    \n    for (int i = 0; i < result.size(); i++) {\n        if (i > 0) cout << \" \";\n        cout << result[i];\n    }\n    cout << \"\\n\";\n    \n    return 0;\n}`
        },
        {
          language: 'java',
          code: `import java.util.*;\nimport java.io.*;\n\nclass TrieNode {\n    Map<Character, TrieNode> children = new HashMap<>();\n    boolean isRoot = false;\n    String rootValue = \"\";\n}\n\nclass Trie {\n    private TrieNode root;\n    \n    public Trie() {\n        root = new TrieNode();\n    }\n    \n    public void insert(String word) {\n        TrieNode node = root;\n        for (char c : word.toCharArray()) {\n            if (!node.children.containsKey(c)) {\n                node.children.put(c, new TrieNode());\n            }\n            node = node.children.get(c);\n        }\n        node.isRoot = true;\n        node.rootValue = word;\n    }\n    \n    public String findRoot(String word) {\n        TrieNode node = root;\n        for (char c : word.toCharArray()) {\n            if (!node.children.containsKey(c)) {\n                return \"\";\n            }\n            node = node.children.get(c);\n            if (node.isRoot) {\n                return node.rootValue;\n            }\n        }\n        return \"\";\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        int n = Integer.parseInt(br.readLine());\n        \n        Trie trie = new Trie();\n        for (int i = 0; i < n; i++) {\n            String root = br.readLine().trim();\n            trie.insert(root);\n        }\n        \n        String sentence = br.readLine().trim();\n        String[] words = sentence.split(\" \");\n        List<String> result = new ArrayList<>();\n        \n        for (String word : words) {\n            String root = trie.findRoot(word);\n            if (!root.isEmpty()) {\n                result.add(root);\n            } else {\n                result.add(word);\n            }\n        }\n        \n        System.out.println(String.join(\" \", result));\n    }\n}`
        }
      ],
      testCases: [
        {
          input: '3\ncat\nbat\nrat\nthe cattle was rattled by the battery',
          output: 'the cat was rat by the bat',
          isHidden: false
        },
        {
          input: '3\na\nb\nc\naadsfasf absbs bbab cadsfafs',
          output: 'a a b c',
          isHidden: false
        },
        {
          input: '2\nhel\nwo\nhelp world',
          output: 'hel wo',
          isHidden: true
        }
      ],
      xpReward: 8
    };

    const result = await prisma.question.upsert({
      where: { slug: replaceWordsProblem.slug },
      update: replaceWordsProblem,
      create: replaceWordsProblem
    });

    console.log('✅ Replace Words problem created successfully!');
    console.log('Problem:', result.title);
    console.log('Slug:', result.slug);
    
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to create problem:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

updateReplaceWordsProblem();
