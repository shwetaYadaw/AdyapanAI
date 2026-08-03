import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function updateLongestWordProblem() {
  try {
    // Delete old versions if they exist
    await prisma.question.deleteMany({
      where: {
        slug: {
          in: ['longest-word-in-dictionary', 'longest-word-in-dictionary-trie']
        }
      }
    }).catch(() => {});

    const longestWordProblem = {
      title: 'Longest Word in Dictionary',
      slug: 'longest-word-in-dictionary',
      statement: `Given an array of strings words representing an English Dictionary, return the longest word in words that can be built one character at a time by other words in words.

If there is more than one possible answer, return the longest word with the smallest lexicographical order. If there is no answer, return the empty string.

Note that the word should be built from left to right with each additional character being added to the end of a previous word.

### Example 1

**Input:**
\`\`\`
words = ["w","wo","wor","worl","world"]
\`\`\`

**Output:**
\`\`\`
"world"
\`\`\`

**Explanation:**
The word "world" can be built one character at a time by "w", "wo", "wor", and "worl".

### Example 2

**Input:**
\`\`\`
words = ["a","banana","app","appl","ap","apply","apple"]
\`\`\`

**Output:**
\`\`\`
"apple"
\`\`\`

**Explanation:**
Both "apply" and "apple" can be built from other words in the dictionary. However, "apple" is lexicographically smaller than "apply".

### Approach

Use a Trie data structure to build the words and track which prefixes exist. Then, for each word, check if all its prefixes exist in the Trie. Keep track of the longest word that satisfies this condition, with lexicographical ordering as a tiebreaker.`,
      difficulty: 'medium',
      topics: ['trie', 'string', 'dynamic-programming'],
      companies: ['Google', 'Amazon', 'Apple', 'Microsoft'],
      timeLimit: 1000,
      memoryLimit: 128,
      inputFormat: 'An array of strings representing words in the dictionary.',
      outputFormat: 'Return the longest word that can be built one character at a time, or empty string if no such word exists.',
      constraints: '1 <= words.length <= 1000\n1 <= words[i].length <= 30\nwords[i] consists of lowercase English letters.',
      sampleInput: '5\nw\nwo\nwor\nworl\nworld',
      sampleOutput: 'world',
      templates: [
        {
          language: 'python',
          code: `class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_end = False\n\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()\n    \n    def insert(self, word):\n        node = self.root\n        for char in word:\n            if char not in node.children:\n                node.children[char] = TrieNode()\n            node = node.children[char]\n        node.is_end = True\n    \n    def search_prefix(self, word):\n        # Check if word can be built character by character\n        node = self.root\n        for char in word:\n            if char not in node.children:\n                return False\n            node = node.children[char]\n            if not node.is_end and char != word[-1]:\n                return False\n        return node.is_end\n\nfs = require('fs')\ninput_lines = fs.readFileSync(0, 'utf-8').strip().split('\\n')\nn = int(input_lines[0])\nwords = []\nfor i in range(1, n + 1):\n    words.append(input_lines[i])\n\ntrie = Trie()\nfor word in words:\n    trie.insert(word)\n\nresult = \"\"\nfor word in words:\n    if trie.search_prefix(word):\n        if len(word) > len(result) or (len(word) == len(result) and word < result):\n            result = word\n\nprint(result)`
        },
        {
          language: 'javascript',
          code: `const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf-8').trim().split('\\n');\n\nclass TrieNode {\n    constructor() {\n        this.children = {};\n        this.isEnd = false;\n    }\n}\n\nclass Trie {\n    constructor() {\n        this.root = new TrieNode();\n    }\n    \n    insert(word) {\n        let node = this.root;\n        for (let char of word) {\n            if (!node.children[char]) {\n                node.children[char] = new TrieNode();\n            }\n            node = node.children[char];\n        }\n        node.isEnd = true;\n    }\n    \n    searchPrefix(word) {\n        // Check if word can be built character by character\n        let node = this.root;\n        for (let i = 0; i < word.length; i++) {\n            const char = word[i];\n            if (!node.children[char]) {\n                return false;\n            }\n            node = node.children[char];\n            if (!node.isEnd && i !== word.length - 1) {\n                return false;\n            }\n        }\n        return node.isEnd;\n    }\n}\n\nconst n = parseInt(input[0]);\nconst words = [];\nfor (let i = 1; i <= n; i++) {\n    words.push(input[i]);\n}\n\nconst trie = new Trie();\nfor (let word of words) {\n    trie.insert(word);\n}\n\nlet result = \"\";\nfor (let word of words) {\n    if (trie.searchPrefix(word)) {\n        if (word.length > result.length || (word.length === result.length && word < result)) {\n            result = word;\n        }\n    }\n}\n\nconsole.log(result);`
        },
        {
          language: 'cpp',
          code: `#include <bits/stdc++.h>\nusing namespace std;\n\nstruct TrieNode {\n    unordered_map<char, TrieNode*> children;\n    bool isEnd = false;\n};\n\nclass Trie {\nprivate:\n    TrieNode* root;\n    \npublic:\n    Trie() {\n        root = new TrieNode();\n    }\n    \n    void insert(string word) {\n        TrieNode* node = root;\n        for (char c : word) {\n            if (node->children.find(c) == node->children.end()) {\n                node->children[c] = new TrieNode();\n            }\n            node = node->children[c];\n        }\n        node->isEnd = true;\n    }\n    \n    bool searchPrefix(string word) {\n        TrieNode* node = root;\n        for (int i = 0; i < word.length(); i++) {\n            char c = word[i];\n            if (node->children.find(c) == node->children.end()) {\n                return false;\n            }\n            node = node->children[c];\n            if (!node->isEnd && i != word.length() - 1) {\n                return false;\n            }\n        }\n        return node->isEnd;\n    }\n};\n\nint main() {\n    int n;\n    cin >> n;\n    cin.ignore();\n    \n    vector<string> words;\n    for (int i = 0; i < n; i++) {\n        string word;\n        getline(cin, word);\n        words.push_back(word);\n    }\n    \n    Trie trie;\n    for (const string& word : words) {\n        trie.insert(word);\n    }\n    \n    string result = \"\";\n    for (const string& word : words) {\n        if (trie.searchPrefix(word)) {\n            if (word.length() > result.length() || \n                (word.length() == result.length() && word < result)) {\n                result = word;\n            }\n        }\n    }\n    \n    cout << result << \"\\n\";\n    return 0;\n}`
        },
        {
          language: 'java',
          code: `import java.util.*;\nimport java.io.*;\n\nclass TrieNode {\n    Map<Character, TrieNode> children = new HashMap<>();\n    boolean isEnd = false;\n}\n\nclass Trie {\n    private TrieNode root;\n    \n    public Trie() {\n        root = new TrieNode();\n    }\n    \n    public void insert(String word) {\n        TrieNode node = root;\n        for (char c : word.toCharArray()) {\n            if (!node.children.containsKey(c)) {\n                node.children.put(c, new TrieNode());\n            }\n            node = node.children.get(c);\n        }\n        node.isEnd = true;\n    }\n    \n    public boolean searchPrefix(String word) {\n        TrieNode node = root;\n        for (int i = 0; i < word.length(); i++) {\n            char c = word.charAt(i);\n            if (!node.children.containsKey(c)) {\n                return false;\n            }\n            node = node.children.get(c);\n            if (!node.isEnd && i != word.length() - 1) {\n                return false;\n            }\n        }\n        return node.isEnd;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        int n = Integer.parseInt(br.readLine());\n        \n        List<String> words = new ArrayList<>();\n        for (int i = 0; i < n; i++) {\n            words.add(br.readLine().trim());\n        }\n        \n        Trie trie = new Trie();\n        for (String word : words) {\n            trie.insert(word);\n        }\n        \n        String result = \"\";\n        for (String word : words) {\n            if (trie.searchPrefix(word)) {\n                if (word.length() > result.length() || \n                    (word.length() == result.length() && word.compareTo(result) < 0)) {\n                    result = word;\n                }\n            }\n        }\n        \n        System.out.println(result);\n    }\n}`
        }
      ],
      testCases: [
        {
          input: '5\nw\nwo\nwor\nworl\nworld',
          output: 'world',
          isHidden: false
        },
        {
          input: '7\na\nbanana\napp\nappl\nap\napply\napple',
          output: 'apple',
          isHidden: false
        },
        {
          input: '4\nhello\nhell\nhe\nh',
          output: 'hello',
          isHidden: true
        }
      ],
      xpReward: 8
    };

    const result = await prisma.question.upsert({
      where: { slug: longestWordProblem.slug },
      update: longestWordProblem,
      create: longestWordProblem
    });

    console.log('✅ Longest Word in Dictionary problem created successfully!');
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

updateLongestWordProblem();
