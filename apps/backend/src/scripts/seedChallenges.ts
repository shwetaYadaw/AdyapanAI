import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

const COMPANIES_POOL = [
  'Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix', 'Uber', 'Goldman Sachs', 
  'Adobe', 'Apple', 'Nvidia', 'Intel', 'Cisco', 'Flipkart', 'Samsung', 'Paytm', 
  'Infosys', 'Walmart', 'Morgan Stanley', 'Visa', 'Directi'
];

const TOPIC_QUESTIONS: Record<string, string[]> = {
  'arrays': [
    // Existing ones
    'Two Sum', 'Best Time to Buy and Sell Stock', 'Contains Duplicate',
    'Product of Array Except Self', 'Maximum Subarray (Kadane\'s Algorithm)',
    'Merge Intervals', 'Rotate Array',
    // New ones from screenshot
    'Maximum and Minimum Element in an Array', 'Reverse the Array',
    'Chocolate Distribution Problem', 'Search in Rotated Sorted Array',
    'Next Permutation', 'Repeat and Missing Number Array',
    'Kth-Largest Element in an Array', 'Trapping Rain Water',
    'Maximum Product Subarray', 'Find Minimum in Rotated Sorted Array',
    'Find Pair with Sum in Sorted & Rotated Array', '3Sum',
    'Container With Most Water', 'Given Sum Pair', 'Kth - Smallest Element',
    'Merge Overlapping Intervals', 'Find Minimum Number of Merge Operations to Make an Array Palindrome',
    'Given an Array of Numbers Arrange the Numbers to Form the Biggest Number',
    'Space Optimization Using Bit Manipulations', 'Subarray Sum Divisible K',
    'Print all Possible Combinations of r Elements in a Given Array of Size n'
  ],
  'strings': [
    // Existing ones
    'Valid Anagram', 'Valid Palindrome', 'Longest Common Prefix',
    'Group Anagrams', 'Longest Substring Without Repeating Characters',
    'Minimum Window Substring', 'String Compression',
    // New ones from screenshot
    'Valid Parentheses', 'Remove Consecutive Characters',
    'Convert a Sentence into its Equivalent Mobile Numeric Keypad Sequence',
    'Print all the Duplicates in the Input String', 'Longest Repeating Character Replacement',
    'Longest Palindromic Substring', 'Palindromic Substrings',
    'Count Palindromic Subsequences', 'Smallest Window in a String Containing all the Characters of Another String',
    'Wildcard String Matching', 'Longest Prefix Suffix', 'Rabin-Karp Algorithm for Pattern Searching',
    'Transform One String to Another using Minimum Number of Given Operation',
    'Boyer Moore Algorithm for Pattern Searching', 'Word Wrap'
  ],
  '2d-arrays': [
    'Zigzag (or diagonal) Traversal of Matrix', 'Set Matrix Zeroes',
    'Spiral Matrix', 'Rotate Image', 'Word Search', 'Find the Number of Islands | Set 1 (Using DFS)',
    'Given a Matrix of \'O\' and \'X\', Replace \'O\' with \'X\' if Surrounded by \'X\'',
    'Find a Common Element in all Rows of a Given Row-Wise Sorted Matrix',
    'Create a Matrix with Alternating Rectangles of O and X', 'Maximum Size Rectangle of all 1s'
  ],
  'searching-sorting': [
    'Permute Two Arrays such that Sum of Every Pair is Greater or Equal to K',
    'counting sort', 'find common elements three sorted arrays',
    'Searching in an array where adjacent differ by at most k', 'ceiling in a sorted array',
    'Pair with given difference', 'majority element', 'count triplets with sum smaller that a given value',
    'Maximum Sum Subsequence with no adjacent elements', 'Merge Sorted Arrays using O(1) Space',
    'Inversion of Array', 'Find Duplicates in O(n) Time and O(1) Extra Space',
    'Radix Sort', 'Make all Array Elements Equal', 'Check if Reversing a Sub Array Make the Array Sorted',
    'Find Four Elements that Sum to a Given Value', 'Median of Two Sorted Array with Different Size',
    'Median of Stream of Integers Running Integers', 'Print Subarrays with 0 Sum',
    'Aggressive Cows', 'Allocate Minimum number of Pages', 'Minimum Swaps to Sort'
  ],
  'recursion-backtracking': [
    // Existing ones
    'Generate Parentheses', 'Subsets', 'Subsets II', 'Permutations',
    'Combination Sum', 'N Queens', 'Sudoku Solver',
    // New ones from screenshot
    'Backtracking Set 2 Rat in a Maze', 'Combinational Sum', 'Crossword-Puzzle',
    'Longest Possible Route in a Matrix with Hurdles', 'Printing all solutions in N-Queen Problem',
    'Solve the Sudoku', 'Partition Equal Subset Sum', 'M Coloring Problem',
    'Knight Tour', 'Soduko', 'Remove Invalid Parentheses', 'Word Break Problem using Backtracking',
    'Print all Palindromic Partitions of a String', 'Find Shortest Safe Route in a Path with Landmines',
    'Partition of Set into K Subsets with Equal Sum', 'Backtracking set-7 hamiltonian cycle',
    'tug-of-war', 'Maximum Possible Number by doing at most K swaps',
    'Backtracking set-8 solving cryptarithmetic puzzles', 'Find paths from corner cell to middle cell in maze',
    'Arithmetic Expressions'
  ],
  'linked-list': [
    // Existing ones
    'Reverse Linked List', 'Middle of Linked List', 'Merge Two Sorted Lists',
    'Linked List Cycle', 'Remove Nth Node From End', 'Add Two Numbers', 'LRU Cache',
    // New ones from screenshot
    'Delete without Head node', 'Remove duplicates from an unsorted linked list',
    'Sort a linked list of 0s-1s-or-2s', 'Multiply two numbers represented linked lists',
    'Reorder List', 'Detect and remove loop in a linked list',
    'Write a Function to get the Intersection Point of two Linked Lists',
    'Flatten a linked list with next and child pointers', 'Linked list in zig-zag fashion',
    'Reverse a doubly linked list', 'Delete nodes which have a greater value on right side',
    'Segregate even and odd Elements in a Linked List', 'Point to next higher value node in a linked list with an Arbitrary Pointer',
    'Rearrange a given linked list in place', 'Sort Biotonic Doubly Linked Lists',
    'Merge K Sorted Lists', 'Merge sort for linked list', 'Quicksort on singly-linked list',
    'Sum of two linked lists', 'Flattening a linked list', 'Clone a linked list with next and random Pointer',
    'Subtract two numbers represented as linked lists'
  ],
  'hashing': [
    // Existing
    'Two Sum', 'Top K Frequent Elements', 'Majority Element',
    'Happy Number', 'Longest Consecutive Sequence', 'Subarray Sum Equals K',
    'Find Duplicate Number',
    // New Heaps & Hashing from screenshot
    'Choose k array elements such that difference of maximum and minimum is minimized',
    'Heap Sort', 'k largest elements in an array', 'Next Greater Element',
    'K\'th Smallest/Largest Element in Unsorted Array',
    'Find the maximum repeating number in O(n) time and O(1) extra space',
    'K-th smallest element after removing some integers from natural numbers',
    'Find k closest elements to a given value', 'K\'th largest element in a stream',
    'Connect Ropes', 'Cuckoo Hashing', 'Itinerary from a List of Tickets',
    'Largest Subarray with 0 Sum', 'Count distinct elements in every window of size k',
    'Group Shifted Strings', 'Merge K Sorted lists', 'Find Median from Data Stream',
    'Sliding Window Maximum', 'Find the smallest positive number',
    'Find Surpasser Count of each element in array', 'Tournament Tree and Binary Heap',
    'Check for palindrome', 'Length of the largest subarray with contiguous elements',
    'Palindrome Substring Queries', 'Subarray distinct elements', 'Find the recurring function',
    'K maximum sum combinations from two arrays'
  ],
  'two-pointers': [
    'Valid Palindrome', 'Container With Most Water', '3Sum',
    'Remove Duplicates from Sorted Array', 'Move Zeroes', 'Sort Colors',
    'Trapping Rain Water'
  ],
  'sliding-window': [
    'Maximum Average Subarray', 'Maximum Sum Subarray of Size K',
    'Longest Repeating Character Replacement', 'Permutation in String',
    'Minimum Size Subarray Sum', 'Fruit Into Baskets', 'Sliding Window Maximum'
  ],
  'binary-search': [
    'Binary Search', 'Search Insert Position', 'First Bad Version',
    'Search in Rotated Sorted Array', 'Find Peak Element', 'Koko Eating Bananas',
    'Median of Two Sorted Arrays'
  ],
  'stack': [
    // Existing
    'Valid Parentheses', 'Min Stack', 'Next Greater Element',
    'Daily Temperatures', 'Largest Rectangle in Histogram', 'Decode String', 'Basic Calculator',
    // New Stacks & Queues from screenshot
    'Implement two stacks in an Array', 'Evaluation of Postfix Expression',
    'Implement Stack using Queues', 'Queue Reversal', 'Implement Stack Queue using Deque',
    'Reverse first k elements of queue', 'Design Stack with Middle Operation',
    'Infix to Postfix', 'Design and Implement Special stack', 'Longest Valid String',
    'Find if an expression has duplicate parenthesis or not',
    'Stack permutations check if an array is stack permutation of other',
    'Count natural numbers whose permutation greater number', 'Sort a stack using Recursion',
    'Queue based approach for first non repeating character in a stream', 'The Celebrity Problem',
    'Next larger Element'
  ],
  'queue-deque': [
    'Implement Queue using Stacks', 'Implement Stack using Queue',
    'Design Circular Queue', 'Sliding Window Maximum', 'Rotten Oranges',
    'Number of Recent Calls', 'First Non-Repeating Character'
  ],
  'trees': [
    // Existing
    'Maximum Depth of Binary Tree', 'Same Tree', 'Invert Binary Tree',
    'Diameter of Binary Tree', 'Lowest Common Ancestor',
    'Binary Tree Level Order Traversal', 'Serialize and Deserialize Binary Tree',
    // New Binary Trees from screenshot
    'Reverse Level Order Traversal', 'Subtree of Another Tree', 'Left View of Binary Tree',
    'Right View of Binary Tree', 'ZigZag Tree Traversal', 'Create a mirror tree from the given binary tree',
    'Leaf at same level', 'Check for Balanced Tree', 'Transform to Sum Tree',
    'Check if Tree is Isomorphic', 'Construct Binary Tree from Preorder and Inorder Traversal',
    'Height of Binary Tree', 'Diameter of a Binary Tree', 'Top View of Binary Tree',
    'Bottom View of Binary Tree', 'Diagonal Traversal of Binary Tree', 'Boundary Traversal of binary tree',
    'Construct Binary Tree from String with Brackets', 'Minimum swap required to convert binary tree to binary search tree',
    'Duplicate subtree in Binary Tree', 'Check if a given graph is tree or not',
    'Lowest Common Ancestor in a Binary Tree', 'Min distance between two given nodes of a Binary Tree',
    'Duplicate Subtrees', 'Kth ancestor of a node in binary tree', 'Binary Tree Maximum Path Sum',
    'Binary Tree to DLL'
  ],
  'binary-search-tree': [
    'Validate BST', 'Kth Smallest Element', 'Lowest Common Ancestor in BST',
    'Convert Sorted Array to BST', 'Recover BST', 'BST Iterator', 'Delete Node in BST'
  ],
  'heap-priority-queue': [
    'Kth Largest Element', 'Top K Frequent Elements', 'Merge K Sorted Lists',
    'Last Stone Weight', 'Find Median from Data Stream', 'K Closest Points to Origin',
    'Task Scheduler',
    // New Heaps & Hashing questions
    'Choose k array elements such that difference of maximum and minimum is minimized',
    'Heap Sort', 'k largest elements in an array', 'Next Greater Element',
    'K\'th Smallest/Largest Element in Unsorted Array',
    'Find the maximum repeating number in O(n) time and O(1) extra space',
    'K-th smallest element after removing some integers from natural numbers',
    'Find k closest elements to a given value', 'K\'th largest element in a stream',
    'Connect Ropes', 'Cuckoo Hashing', 'Itinerary from a List of Tickets',
    'Largest Subarray with 0 Sum', 'Count distinct elements in every window of size k',
    'Group Shifted Strings', 'Merge K Sorted lists', 'Find Median from Data Stream',
    'Sliding Window Maximum', 'Find the smallest positive number',
    'Find Surpasser Count of each element in array', 'Tournament Tree and Binary Heap',
    'Check for palindrome', 'Length of the largest subarray with contiguous elements',
    'Palindrome Substring Queries', 'Subarray distinct elements', 'Find the recurring function',
    'K maximum sum combinations from two arrays'
  ],
  'graphs': [
    'Number of Islands', 'Clone Graph', 'Course Schedule',
    'Pacific Atlantic Water Flow', 'Network Delay Time', 'Word Ladder', 'Alien Dictionary',
    // New Graphs from screenshot
    'BFS', 'DFS', 'Flood Fill Algorithm', 'Number of Triangles',
    'Detect cycle in a graph', 'Detect cycle in an undirected graph', 'Rat in a Maze Problem',
    'Steps by Knight', 'Number of Operations to Make Network Connected',
    'Dijkstra\'s shortest path algorithm', 'Topological Sort', 'Oliver and the Game',
    'Minimum time taken by each job to be completed given by a Directed Acyclic Graph',
    'Find whether it is possible to finish all tasks or not from given dependencies',
    'Find the number of islands', 'Prim\'s Algo', 'Cheapest Flights Within K Stops',
    'Find if there is a path of more than k length from a source', 'Bellman Ford',
    'Bipartitie Graph', 'Word-Ladder', 'Allen Dictionary', 'Kruskals MST',
    'Total number spanning trees graph', 'Travelling Salesman', 'Find longest path directed acyclic graph',
    'Two Clique Problem', 'Minimise the cash flow', 'Chinese postman', 'Water Jug', 'Water Jug 2'
  ],
  'dfs-bfs': [
    'Flood Fill', 'Number of Provinces', 'Rotten Oranges',
    'Surrounded Regions', 'Walls and Gates', 'Open the Lock', 'Shortest Path in Binary Matrix'
  ],
  'dynamic-programming': [
    // Existing
    'Climbing Stairs', 'House Robber', 'Coin Change',
    'Longest Increasing Subsequence', 'Longest Common Subsequence',
    'Edit Distance', 'Partition Equal Subset Sum',
    // New DP from screenshot
    'Knapsack with Duplicate Items', 'BBT counter', 'Reach a given score',
    'Maximum difference of zeros and ones in binary string', 'Permutation Coefficient',
    'Longest Repeating Subsequence', 'Pairs with specific difference', 'Longest subsequence-1',
    'LIS', 'Word Break', 'Combination Sum IV', 'House Robber 2', 'Decode Ways',
    'Unique Paths', 'Jumps Game', 'Knapsack Problem', 'nCr', 'Catalan Number',
    'Subset Sum', 'Gold mine', 'Assembly Line Scheduling', 'Maximize The Cut Segments',
    'Maximum sum increasing subsequence', 'Count all subsequences having product less than K',
    'Egg dropping puzzle', 'Max length chain', 'Longest Common Substring',
    'Longest Palindromic Subsequence', 'Count Palindromic Subsequences', 'Longest Palindromic Substring',
    'Longest Alternating Sequence', 'Weighted Job Scheduling', 'Coin Game', 'Coin Game Winner',
    'Optimal Strategy for a game', 'Word Wrap', 'Mobile numeric keypad', 'Matrix Chain Multiplication',
    'Maximum profit by buying and selling a share at most twice', 'Optimal BST',
    'Largest Submatrix with sum 0'
  ],
  'greedy': [
    // Existing
    'Jump Game', 'Jump Game II', 'Gas Station', 'Assign Cookies', 'Candy',
    'Non-overlapping Intervals', 'Minimum Number of Arrows to Burst Balloons',
    // New Greedy from screenshot
    'Activity selection problem greedy algo', 'Greedy algorithm to find minimum number of coins',
    'Minimum sum two numbers formed digits array-2', 'Minimum sum absolute difference pairs two arrays',
    'Find maximum height pyramid from the given array of objects',
    'Minimum cost for acquiring all coins with k extra coins allowed with every coin',
    'Find maximum equal sum of every three stacks', 'Job sequencing problem',
    'Greedy algorithm egyptian fraction', 'Fractional knapsack problem', 'Maximum length chain of pairs',
    'Find smallest number with given number of digits and digit sum',
    'Maximize sum of consecutive differences circular-array', 'paper-cut minimum number squares',
    'Lexicographically smallest array-k consecutive swaps', 'Problems-CHOCOLA',
    'Find minimum time to finish all jobs with given constraints', 'Job sequencing using disjoint set union',
    'Rearrange characters string such that no two adjacent are same',
    'Minimum edges to reverse to make path from a source to a destination',
    'Minimize Cash Flow among a given set of friends who have borrowed money from each other',
    'Minimum Cost to cut a board into squares'
  ],
  'bit-manipulation': [
    // Existing
    'Single Number', 'Counting Bits', 'Reverse Bits', 'Number of 1 Bits',
    'Missing Number', 'Power of Two', 'Sum of Two Integers',
    // New Bit Manipulation from screenshot
    'Count set bits in an integer', 'Find the two non-repeating elements in an array of repeating elements',
    'Find position of the only set bit', 'Count number of bits to be flipped to convert A to B',
    'Count total set bits in all numbers from 1 to n', 'Copy set bits in a range',
    'Calculate square of a number without using *, / and pow()',
    'Divide two integers without using multiplication, division and mod operator', 'Power Set'
  ],
  'trie': [
    'Implement Trie', 'Design Add and Search Words', 'Word Search II',
    'Replace Words', 'Longest Word in Dictionary', 'Map Sum Pairs', 'Maximum XOR of Two Numbers'
  ],
  'segment-tree-fenwick': [
    'Range Sum Query', 'Mutable Range Sum Query', 'Count of Smaller Numbers',
    'Queue Reconstruction by Height', 'Create Sorted Array through Instructions'
  ],
  'tcs-nqt': [
    'Find the smallest number in an array',
    'Largest in Array',
    'Second Smallest and Second Largest',
    'Reverse a given array',
    'Count Elements With Maximum Frequency',
    'Half Ascending and Half Descending Sort',
    'Sum of Array',
    'Rotate Array',
    'Mean or Average of an Array',
    'Median of an Array',
    'Remove Duplicates from Sorted Array',
    'Insert Element at a Given Position in an Array',
    'Find All Duplicates in an Array',
    'Find all non-repeating elements in an array',
    'Find all symmetric pairs in array',
    'Maximum product subarray in an array',
    'Replace each element of the array by its rank in the array',
    'Sorting elements of an array by frequency',
    'Rotation of elements of array- left and right',
    'Finding equilibrium index of an array',
    'Finding Circular rotation of an array by K positions',
    'Sort an array according to the order defined by another array',
    'Search an element in an array',
    'Check if Array is a subset of another array or not',
    'Check if a number is palindrome or not',
    'Find all Palindrome numbers in a given range',
    'Check if a number is prime or not',
    'Prime numbers in a given range',
    'Check if a number is armstrong number of not',
    'Check if a number is perfect number',
    'Even or Odd',
    'Check weather a given number is positive or negative',
    'Sum of first N natural numbers',
    'Find Sum of AP Series',
    'Program to find sum of GP Series',
    'Greatest of two numbers',
    'Greatest of three numbers',
    'Leap Year or not',
    'Reverse digits of a number',
    'Maximum and Minimum digit in a number',
    'Print Fibonacci upto Nth Term',
    'Factorial of a number',
    'Power of a number',
    'Factors of a given number',
    'Print all prime factors of the given number',
    'Check if a number is a strong number or not',
    'Check if a Number is Automorphic',
    'GCD of two numbers',
    'LCM of two numbers',
    'Sum of digits of a number',
    'Sum of numbers in the given range',
    'Permutations in which N people can occupy R seats in a classroom',
    'Program to add two fractions',
    'Replace all 0s with 1s in a given integer',
    'Can a number be expressed as a sum of two prime numbers',
    'Calculate the area of circle',
    'Program to find roots of a Quadratic Equation',
    'Convert Binary to Decimal',
    'Convert binary to octal',
    'Decimal to Binary conversion',
    'Convert decimal to octal',
    'Convert octal to binary',
    'Convert octal to decimal',
    'Convert digits/numbers to words',
    'Bubble Sort Algorithm',
    'Selection Sort Algorithm',
    'Insertion Sort Algorithm',
    'Quick Sort Algorithm',
    'Merge sort algorithm',
    'Check if a given string is palindrome or not',
    'Count number of vowels, consonants, spaces in String',
    'Find the ASCII value of a character',
    'Remove all vowels from the string',
    'Remove spaces from a string',
    'Remove characters from a string except alphabets',
    'Reverse a String',
    'Remove brackets from an algebraic expression',
    'Sum of the numbers in a String',
    'Capitalize first and last character of each word',
    'Calculate frequency of characters in a string',
    'Find Non-repeating characters of a String',
    'Check if two strings are anagram of each other',
    'Count common sub-sequence in two strings',
    'Check if two strings match where one string contains wildcard characters',
    'Return maximum occurring character in the input string',
    'Remove all duplicates from the input string',
    'Print all the duplicates in the input string',
    'Remove characters from first string present in the second string',
    'Change every letter with the next lexicographic alphabet in the given string',
    'Write a program to find the largest word in a given string',
    'Write a program to sort characters in a string',
    'Count number of words in a given string',
    'Write a program to find a word in a given string which has the highest number of repeated letters',
    'Change case of each character in a string',
    'Concatenate one string to another',
    'Write a program to find a substring within a string, if found display its starting position',
    'Reverse words in a string'
  ]
};

const CORE_QUESTIONS_DATA: Record<string, { 
  title?: string;
  sampleInput: string; 
  sampleOutput: string; 
  testCases: any[]; 
  statement?: string; 
  constraints?: string; 
  inputFormat?: string; 
  outputFormat?: string; 
  difficulty?: 'easy' | 'medium' | 'hard';
  xpReward?: number;
}> = {
  "Set Matrix Zeroes": {
    statement: `Given an **m × n** integer matrix \`matrix\`, if an element is \`0\`, set its entire row and column to \`0\`s. You must do it **in place**.

![Set Matrix Zeroes examples](/set-matrix-zeroes-examples.png)

### Example 1

**Input:** \`matrix = [[1,1,1],[1,0,1],[1,1,1]]\`

**Output:** \`[[1,0,1],[0,0,0],[1,0,1]]\`

### Example 2

**Input:** \`matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]\`

**Output:** \`[[0,0,0,0],[0,4,5,0],[0,3,1,0]]\``,
    constraints: 'm == matrix.length\n n == matrix[0].length\n1 <= m, n <= 200\n-2^31 <= matrix[i][j] <= 2^31 - 1',
    inputFormat: 'The first line contains m and n. The next m lines each contain n space-separated integers of the matrix.',
    outputFormat: 'Print the transformed matrix, with each row on a new line and elements separated by spaces.',
    sampleInput: "3 3\n1 1 1\n1 0 1\n1 1 1",
    sampleOutput: "1 0 1\n0 0 0\n1 0 1",
    testCases: [
      { input: "3 3\n1 1 1\n1 0 1\n1 1 1", output: "1 0 1\n0 0 0\n1 0 1", isHidden: false },
      { input: "3 4\n0 1 2 0\n3 4 5 2\n1 3 1 5", output: "0 0 0 0\n0 4 5 0\n0 3 1 0", isHidden: false },
      { input: "2 2\n1 0\n3 4", output: "0 0\n3 0", isHidden: true }
    ]
  },
  "Rotate Image": {
    statement: `You are given an **n × n** 2D matrix representing an image. Rotate the image by **90 degrees clockwise**.

You have to rotate the image **in place**, which means you must modify the input 2D matrix directly. **Do not** allocate another 2D matrix and perform the rotation.

![Rotate Image example](/rotate-image-example.png)

### Example 1

**Input:** \`matrix = [[1,2,3],[4,5,6],[7,8,9]]\`

**Output:** \`[[7,4,1],[8,5,2],[9,6,3]]\``,
    constraints: 'n == matrix.length == matrix[i].length\n1 <= n <= 20\n-1000 <= matrix[i][j] <= 1000',
    inputFormat: 'The first line contains n. The next n lines each contain n space-separated integers of the matrix.',
    outputFormat: 'Print the rotated matrix, with each row on a new line and elements separated by spaces.',
    sampleInput: "3\n1 2 3\n4 5 6\n7 8 9",
    sampleOutput: "7 4 1\n8 5 2\n9 6 3",
    testCases: [
      { input: "3\n1 2 3\n4 5 6\n7 8 9", output: "7 4 1\n8 5 2\n9 6 3", isHidden: false },
      { input: "4\n5 1 9 11\n2 4 8 10\n13 3 6 7\n15 14 12 16", output: "15 13 2 5\n14 3 4 1\n12 6 8 9\n16 7 10 11", isHidden: false },
      { input: "1\n42", output: "42", isHidden: true }
    ]
  },
  "Find a Common Element in all Rows of a Given Row-Wise Sorted Matrix": {
    title: 'Common element in all rows of a row-wise sorted matrix',
    statement: `_Last Updated: 24 Nov, 2025_

Given a matrix **mat[][]**, where every row is sorted in increasing order, find any one element that is common to all rows. If no such element exists, return **-1**.

### Example 1

**Input:** \`mat[][] = [[1,2,3,4,5],[2,4,5,8,10],[3,5,7,9,11],[1,3,5,7,9]]\`

**Output:** \`5\`

**Explanation:** The element \`5\` is present in every row, so it is returned.

### Example 2

**Input:** \`mat[][] = [[1,2,3],[4,5,6],[7,8,9]]\`

**Output:** \`-1\`

**Explanation:** There is no element that appears in all rows, so the answer is \`-1\`.`,
    constraints: '1 <= mat.length, mat[i].length <= 1000\nRows are sorted in increasing order.',
    inputFormat: 'The first line contains m and n. The next m lines each contain n space-separated integers of the matrix.',
    outputFormat: 'Print one element common to every row, or -1 if none exists.',
    sampleInput: "4 5\n1 2 3 4 5\n2 4 5 8 10\n3 5 7 9 11\n1 3 5 7 9",
    sampleOutput: "5",
    testCases: [
      { input: "4 5\n1 2 3 4 5\n2 4 5 8 10\n3 5 7 9 11\n1 3 5 7 9", output: "5", isHidden: false },
      { input: "3 3\n1 2 3\n4 5 6\n7 8 9", output: "-1", isHidden: false },
      { input: "3 4\n1 2 5 8\n2 5 8 10\n3 5 8 12", output: "5", isHidden: true }
    ]
  },
  "Word Search": {
    statement: `You are given a matrix **mat[][]** of size **n × m** containing English alphabets and a string **word**. Check if the word exists in mat[][] or not. The word can be constructed by using letters from adjacent cells, either horizontally or vertically. The same cell cannot be used more than once.

### Example 1

**Input:** \`mat[][] = [['T','E','E'],['S','G','K'],['T','E','L']]\`, \`word = "GEEK"\`

**Output:** \`true\`

**Explanation:** Word \`"GEEK"\` can be found in the given grid.

![Word Search: matching grid](/word-search-example-1.svg)

### Example 2

**Input:** \`mat[][] = [['T','E','U'],['S','G','K'],['T','E','L']]\`, \`word = "GEEK"\`

**Output:** \`false\`

**Explanation:** Word \`"GEEK"\` cannot be found in the given grid.

![Word Search: no match](/word-search-example-2.svg)`,
    constraints: '1 <= n, m <= 6\n1 <= word.length <= 15\nmat and word consist of only lowercase and uppercase English letters.',
    inputFormat: 'The first line contains n and m. The next n lines contain m space-separated characters. The final line contains word.',
    outputFormat: 'Print true if word can be formed using horizontally or vertically adjacent cells; otherwise print false.',
    sampleInput: "3 3\nT E E\nS G K\nT E L\nGEEK",
    sampleOutput: "true",
    testCases: [
      { input: "3 3\nT E E\nS G K\nT E L\nGEEK", output: "true", isHidden: false },
      { input: "3 3\nT E U\nS G K\nT E L\nGEEK", output: "false", isHidden: false },
      { input: "3 4\nA B C E\nS F C S\nA D E E\nABCCED", output: "true", isHidden: true },
      { input: "3 4\nA B C E\nS F C S\nA D E E\nABCB", output: "false", isHidden: true }
    ]
  },
  "Word Search II": {
    statement: `Given an \`m × n\` board of characters and a list of strings \`words\`, return all words that can be found on the board.

Each word must be built from sequentially adjacent cells. Adjacent cells are horizontal or vertical neighbors, and a cell may not be used more than once in a word.

### Example 1

**Input:** \`board = [["o", "a", "a", "n"], ["e", "t", "a", "e"], ["i", "h", "k", "r"], ["i", "f", "l", "v"]]\`, \`words = ["oath", "pea", "eat", "rain"]\`

**Output:** \`["eat", "oath"]\`

![Word Search II: matching paths](/word-search-ii-example.svg)

### Example 2

**Input:** \`board = [["a", "b"], ["c", "d"]]\`, \`words = ["abcb"]\`

**Output:** \`[]\``,
    constraints: 'm == board.length\nn == board[i].length\n1 <= m, n <= 12\nboard[i][j] is a lowercase English letter.\n1 <= words.length <= 3 * 10^4\n1 <= words[i].length <= 10\nwords[i] consists of lowercase English letters and all words are unique.',
    inputFormat: 'The first line contains m and n. The next m lines contain n space-separated board characters. The next line contains w, followed by w lines containing one word each.',
    outputFormat: 'Print every matching word in lexicographic order, separated by spaces. Print an empty line if no words match.',
    difficulty: 'hard',
    sampleInput: "4 4\no a a n\ne t a e\ni h k r\ni f l v\n4\noath\npea\neat\nrain",
    sampleOutput: 'eat oath',
    testCases: [
      { input: "4 4\no a a n\ne t a e\ni h k r\ni f l v\n4\noath\npea\neat\nrain", output: 'eat oath', isHidden: false },
      { input: "2 2\na b\nc d\n1\nabcb", output: '', isHidden: false }
    ]
  },
  "Design Add and Search Words": {
    title: 'Design Add and Search Words Data Structure',
    statement: `Design a data structure that supports adding new words and checking whether a query matches any previously added word.

Implement the \`WordDictionary\` class:

- \`WordDictionary()\` initializes the object.
- \`void addWord(word)\` adds \`word\` to the data structure.
- \`bool search(word)\` returns \`true\` if any added word matches \`word\`; otherwise, returns \`false\`. A dot \`.\` in a search query can match any letter.

### Example

**Input:**

\`["WordDictionary", "addWord", "addWord", "addWord", "search", "search", "search", "search"]\`

\`[[], ["bad"], ["dad"], ["mad"], ["pad"], ["bad"], [".ad"], ["b.."]]\`

**Output:** \`[null, null, null, null, false, true, true, true]\`

**Explanation:** Add \`"bad"\`, \`"dad"\`, and \`"mad"\`. Searches for \`"pad"\`, \`"bad"\`, \`".ad"\`, and \`"b.."\` return \`false\`, \`true\`, \`true\`, and \`true\` respectively.`,
    constraints: '1 <= word.length <= 25\nWords added with addWord contain lowercase English letters.\nSearch words contain lowercase English letters or dots.\nThere are at most 2 dots in a search query.\nAt most 10^4 addWord and search calls will be made.',
    inputFormat: 'The first line contains q. Each of the next q lines is either "addWord word" or "search word".',
    outputFormat: 'For every search operation, print true or false on a new line.',
    difficulty: 'medium',
    xpReward: 4,
    sampleInput: "7\naddWord bad\naddWord dad\naddWord mad\nsearch pad\nsearch bad\nsearch .ad\nsearch b..",
    sampleOutput: "false\ntrue\ntrue\ntrue",
    testCases: [
      { input: "7\naddWord bad\naddWord dad\naddWord mad\nsearch pad\nsearch bad\nsearch .ad\nsearch b..", output: "false\ntrue\ntrue\ntrue", isHidden: false },
      { input: "2\naddWord a\nsearch .", output: 'true', isHidden: false }
    ]
  },
  "Given a Matrix of 'O' and 'X', Replace 'O' with 'X' if Surrounded by 'X'": {
    title: "Replace O's with X's",
    statement: `You are given a grid **grid[][]** of size **n × m**, where every element is either \`'O'\` or \`'X'\`. Replace every \`'O'\` (or connected group of \`'O'\`s) that is completely surrounded by \`'X'\` with \`'X'\`.

An \`'O'\` (or group of \`'O'\`s) is surrounded by \`'X'\` when it is not connected to any boundary cell through horizontally or vertically adjacent \`'O'\`s.

### Example 1

**Input:** \`grid[][] = [['X','X','X','X'],['X','O','X','X'],['X','O','O','X'],['X','O','X','X'],['X','X','O','O']]\`

**Output:** \`[['X','X','X','X'],['X','X','X','X'],['X','X','X','X'],['X','X','X','X'],['X','X','O','O']]\`

**Explanation:** Only the \`'O'\` cells surrounded by \`'X'\` are changed.

### Example 2

**Input:** \`grid[][] = [['X','O','X','X'],['X','O','X','X'],['X','O','O','X'],['X','O','X','X'],['X','X','O','O']]\`

**Output:** \`[['X','O','X','X'],['X','O','X','X'],['X','O','O','X'],['X','O','X','X'],['X','X','O','O']]\`

**Explanation:** No \`'O'\` is surrounded by \`'X'\`.

### Example 3

**Input:** \`grid[][] = [['X','X','X'],['X','O','X'],['X','X','X']]\`

**Output:** \`[['X','X','X'],['X','X','X'],['X','X','X']]\`

**Explanation:** The only \`'O'\` is surrounded by \`'X'\`.`,
    constraints: '1 <= grid.length <= 100\n1 <= grid[0].length <= 100\ngrid[i][j] is either O or X.',
    inputFormat: 'The first line contains n and m. The next n lines contain m space-separated characters, each O or X.',
    outputFormat: 'Print the resulting grid, with each row on a new line and characters separated by spaces.',
    sampleInput: "5 4\nX X X X\nX O X X\nX O O X\nX O X X\nX X O O",
    sampleOutput: "X X X X\nX X X X\nX X X X\nX X X X\nX X O O",
    testCases: [
      { input: "5 4\nX X X X\nX O X X\nX O O X\nX O X X\nX X O O", output: "X X X X\nX X X X\nX X X X\nX X X X\nX X O O", isHidden: false },
      { input: "5 4\nX O X X\nX O X X\nX O O X\nX O X X\nX X O O", output: "X O X X\nX O X X\nX O O X\nX O X X\nX X O O", isHidden: false },
      { input: "3 3\nX X X\nX O X\nX X X", output: "X X X\nX X X\nX X X", isHidden: false }
    ]
  },
  "Find the Number of Islands | Set 1 (Using DFS)": {
    title: 'Number of Islands',
    statement: `Given an m × n 2D binary grid \`grid\` which represents a map of \`'1'\`s (land) and \`'0'\`s (water), return the number of islands.

An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.

### Example 1

**Input:**

\`\`\`
grid = [
  ["1", "1", "1", "1", "0"],
  ["1", "1", "0", "1", "0"],
  ["1", "1", "0", "0", "0"],
  ["0", "0", "0", "0", "0"]
]
\`\`\`

**Output:** \`1\`

### Example 2

**Input:**

\`\`\`
grid = [
  ["1", "1", "0", "0", "0"],
  ["1", "1", "0", "0", "0"],
  ["0", "0", "1", "0", "0"],
  ["0", "0", "0", "1", "1"]
]
\`\`\`

**Output:** \`3\``,
    constraints: 'm == grid.length\nn == grid[i].length\n1 <= m, n <= 300\ngrid[i][j] is 0 or 1.',
    inputFormat: 'The first line contains m and n. The next m lines contain n space-separated characters, each 0 or 1.',
    outputFormat: 'Print the number of islands.',
    sampleInput: "4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0",
    sampleOutput: '1',
    testCases: [
      { input: "4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0", output: '1', isHidden: false },
      { input: "4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1", output: '3', isHidden: false },
      { input: "1 1\n0", output: '0', isHidden: true }
    ]
  },
  "Zigzag (or diagonal) Traversal of Matrix": {
    title: 'Matrix Zig Zag Diagonal Traversal',
    statement: `Given a square matrix **mat[][]**, find its **diagonal** pattern, where the elements are arranged linearly by traversing the matrix diagonally, as illustrated below.

![Zigzag diagonal traversal path](/zigzag-diagonal-traversal.png)

### Example 1

**Input:** \`mat[][] = [[1,2,3],[4,5,6],[7,8,9]]\`

**Output:** \`[1,2,4,7,5,3,6,8,9]\`

**Explanation:** Start from 1. Traverse upward to downward diagonally: 2, 4. Then downward to upward: 7, 5, 3. Continue upward to downward: 6, 8, and end at 9.

### Example 2

**Input:** \`mat[][] = [[1,2,3,10],[4,5,6,11],[7,8,9,12],[13,14,15,16]]\`

**Output:** \`[1,2,4,7,5,3,10,6,8,13,14,9,11,12,15,16]\`

**Explanation:** Start from 1. Traverse upward to downward: 2, 4; then downward to upward: 7, 5, 3; then upward to downward: 10, 6, 8, 13; then downward to upward: 14, 9, 11; and finally upward to downward: 12, 15, 16.`,
    constraints: '1 <= mat.length <= 10^3\n-100 <= mat[i][j] <= 100',
    inputFormat: 'The first line contains n. The next n lines contain n space-separated integers of the square matrix.',
    outputFormat: 'Print the diagonal traversal as space-separated integers.',
    sampleInput: "3\n1 2 3\n4 5 6\n7 8 9",
    sampleOutput: '1 2 4 7 5 3 6 8 9',
    testCases: [
      { input: "3\n1 2 3\n4 5 6\n7 8 9", output: '1 2 4 7 5 3 6 8 9', isHidden: false },
      { input: "4\n1 2 3 10\n4 5 6 11\n7 8 9 12\n13 14 15 16", output: '1 2 4 7 5 3 10 6 8 13 14 9 11 12 15 16', isHidden: false },
      { input: "1\n42", output: '42', isHidden: true }
    ]
  },
  "Spiral Matrix": {
    title: 'Spirally Traversing a Matrix',
    statement: `Given a rectangular matrix **mat[][]** of size **n × m**, return a 1D array containing all its elements in spiral order.

![Example of matrix in spiral form](/spiral-matrix-traversal.png)

### Example 1

**Input:** \`mat[][] = [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]]\`

**Output:** \`[1,2,3,4,8,12,16,15,14,13,9,5,6,7,11,10]\`

### Example 2

**Input:** \`mat[][] = [[1,2,3,4,5,6],[7,8,9,10,11,12],[13,14,15,16,17,18]]\`

**Output:** \`[1,2,3,4,5,6,12,18,17,16,15,14,13,7,8,9,10,11]\`

**Explanation:** Apply the same spiral traversal technique.

### Example 3

**Input:** \`mat[][] = [[32,44,27,23],[54,28,50,62]]\`

**Output:** \`[32,44,27,23,62,50,28,54]\`

**Explanation:** Applying the same technique gives \`[32,44,27,23,62,50,28,54]\`.`,
    constraints: '1 <= n, m <= 1000\n0 <= mat[i][j] <= 100',
    inputFormat: 'The first line contains n and m. The next n lines contain m space-separated integers of the matrix.',
    outputFormat: 'Print the spiral traversal as space-separated integers.',
    sampleInput: "4 4\n1 2 3 4\n5 6 7 8\n9 10 11 12\n13 14 15 16",
    sampleOutput: '1 2 3 4 8 12 16 15 14 13 9 5 6 7 11 10',
    testCases: [
      { input: "4 4\n1 2 3 4\n5 6 7 8\n9 10 11 12\n13 14 15 16", output: '1 2 3 4 8 12 16 15 14 13 9 5 6 7 11 10', isHidden: false },
      { input: "3 6\n1 2 3 4 5 6\n7 8 9 10 11 12\n13 14 15 16 17 18", output: '1 2 3 4 5 6 12 18 17 16 15 14 13 7 8 9 10 11', isHidden: false },
      { input: "2 4\n32 44 27 23\n54 28 50 62", output: '32 44 27 23 62 50 28 54', isHidden: false }
    ]
  },
  "Create a Matrix with Alternating Rectangles of O and X": {
    title: 'Create a matrix with alternating rectangles of O and X',
    statement: `_Last Updated: 23 Jul, 2025_

Write a program that inputs two numbers \`m\` and \`n\` and creates an \`m × n\` matrix. Every element is either \`X\` or \`0\`. Fill the matrix alternately: the outermost rectangle contains \`X\`s, the next rectangle contains \`0\`s, then \`X\`s, and so on.

### Example 1

**Input:** \`m = 3, n = 3\`

**Output:**

\`\`\`
X X X
X 0 X
X X X
\`\`\`

### Example 2

**Input:** \`m = 4, n = 5\`

**Output:**

\`\`\`
X X X X X
X 0 0 0 X
X 0 0 0 X
X X X X X
\`\`\`

### Example 3

**Input:** \`m = 5, n = 5\`

**Output:**

\`\`\`
X X X X X
X 0 0 0 X
X 0 X 0 X
X 0 0 0 X
X X X X X
\`\`\`

### Example 4

**Input:** \`m = 6, n = 7\`

**Output:**

\`\`\`
X X X X X X X
X 0 0 0 0 0 X
X 0 X X X 0 X
X 0 X X X 0 X
X 0 0 0 0 0 X
X X X X X X X
\`\`\``,
    constraints: '1 <= m, n <= 1000',
    inputFormat: 'The first line contains two space-separated integers m and n.',
    outputFormat: 'Print the generated matrix, with each row on a new line and elements separated by spaces.',
    sampleInput: '3 3',
    sampleOutput: "X X X\nX 0 X\nX X X",
    testCases: [
      { input: '3 3', output: "X X X\nX 0 X\nX X X", isHidden: false },
      { input: '4 5', output: "X X X X X\nX 0 0 0 X\nX 0 0 0 X\nX X X X X", isHidden: false },
      { input: '5 5', output: "X X X X X\nX 0 0 0 X\nX 0 X 0 X\nX 0 0 0 X\nX X X X X", isHidden: false },
      { input: '6 7', output: "X X X X X X X\nX 0 0 0 0 0 X\nX 0 X X X 0 X\nX 0 X X X 0 X\nX 0 0 0 0 0 X\nX X X X X X X", isHidden: true }
    ]
  },
  "Maximum Size Rectangle of all 1s": {
    title: 'Maximal Rectangle',
    statement: `Given a \`rows × cols\` binary matrix filled with \`0\`s and \`1\`s, find the largest rectangle containing only \`1\`s and return its area.

### Example 1

![Maximal rectangle highlighted in the binary matrix](/maximal-rectangle-example-v2.png)

**Input:** \`matrix = [['1','0','1','0','0'],['1','0','1','1','1'],['1','1','1','1','1'],['1','0','0','1','0']]\`

**Output:** \`6\`

**Explanation:** The maximal rectangle is highlighted in the image above.

### Example 2

**Input:** \`matrix = [['0']]\`

**Output:** \`0\`

### Example 3

**Input:** \`matrix = [['1']]\`

**Output:** \`1\``,
    constraints: 'rows == matrix.length\ncols == matrix[i].length\n1 <= rows, cols <= 200\nmatrix[i][j] is 0 or 1.',
    inputFormat: 'The first line contains rows and cols. The next rows lines contain cols space-separated characters, each 0 or 1.',
    outputFormat: 'Print the area of the largest rectangle containing only 1s.',
    sampleInput: "4 5\n1 0 1 0 0\n1 0 1 1 1\n1 1 1 1 1\n1 0 0 1 0",
    sampleOutput: '6',
    testCases: [
      { input: "4 5\n1 0 1 0 0\n1 0 1 1 1\n1 1 1 1 1\n1 0 0 1 0", output: '6', isHidden: false },
      { input: "1 1\n0", output: '0', isHidden: false },
      { input: "1 1\n1", output: '1', isHidden: false },
      { input: "2 3\n1 1 1\n1 1 1", output: '6', isHidden: true }
    ]
  },
  "Next Greater Element": {
    statement: `Given an array **arr[]** of integers, determine the **Next Greater Element** (NGE) for every element in the array, maintaining the order of appearance.

The Next Greater Element for an element x is defined as the first element to the right of x in the array that is strictly greater than x.
If no such element exists for an element, its Next Greater Element is \`-1\`.

### Example 1

**Input:** \`arr[] = [1, 3, 2, 4]\`

**Output:** \`[3, 4, 4, -1]\`

**Explanation:** The next larger element to 1 is 3, 3 is 4, 2 is 4 and for 4, since it doesn't exist, it is -1.

### Example 2

**Input:** \`arr[] = [6, 8, 0, 1, 3]\`

**Output:** \`[8, -1, 1, 3, -1]\`

**Explanation:** The next larger element to 6 is 8, for 8 there are no larger elements hence it is -1, for 0 it is 1, for 1 it is 3 and then for 3 there is no larger element on the right and hence -1.`,
    constraints: '1 <= arr.length <= 10^6\n0 <= arr[i] <= 10^9',
    inputFormat: 'The first line contains n. The second line contains n space-separated integers of arr.',
    outputFormat: 'Print the next greater element for every array element as space-separated integers.',
    sampleInput: "4\n1 3 2 4",
    sampleOutput: '3 4 4 -1',
    testCases: [
      { input: "4\n1 3 2 4", output: '3 4 4 -1', isHidden: false },
      { input: "5\n6 8 0 1 3", output: '8 -1 1 3 -1', isHidden: false },
      { input: "4\n1 2 3 5", output: '2 3 5 -1', isHidden: true },
      { input: "4\n5 4 3 1", output: '-1 -1 -1 -1', isHidden: true }
    ]
  },
  "Longest Consecutive Sequence": {
    title: 'Longest Consecutive Sequence',
    statement: `Given an unsorted array of integers **nums**, return the length of the longest consecutive elements sequence.

You must write an algorithm that runs in **O(n)** time.

### Example 1

**Input:** \`nums = [100, 4, 200, 1, 3, 2]\`

**Output:** \`4\`

**Explanation:** The longest consecutive elements sequence is \`[1, 2, 3, 4]\`. Therefore its length is 4.

### Example 2

**Input:** \`nums = [0, 3, 7, 2, 5, 8, 4, 6, 0, 1]\`

**Output:** \`9\`


### Example 3

**Input:** \`nums = [1, 0, 1, 2]\`

**Output:** \`3\``,
    constraints: '0 <= nums.length <= 10^5\n-10^9 <= nums[i] <= 10^9',
    inputFormat: 'The first line contains n. The second line contains n space-separated integers of nums.',
    outputFormat: 'Print the length of the longest consecutive elements sequence.',
    sampleInput: "6\n100 4 200 1 3 2",
    sampleOutput: '4',
    testCases: [
      { input: "6\n100 4 200 1 3 2", output: '4', isHidden: false },
      { input: "10\n0 3 7 2 5 8 4 6 0 1", output: '9', isHidden: false },
      { input: "4\n1 0 1 2", output: '3', isHidden: false },
      { input: "0\n", output: '0', isHidden: true }
    ]
  },
  "Palindrome Substring Queries": {
    statement: `Given a string \`s\` and a 2D list \`queries[][]\` of size \`q\`, where each \`queries[i]\` consists of two integers \`[left, right]\`. Each query refers to the substring \`s[left : right]\`, where both \`left\` and \`right\` are inclusive (0-based indexing).

For each query, find whether the substring \`s[left : right]\` forms a palindrome.

### Example 1

**Input:** \`s = "abaaabaaaba", queries[][] = [[0, 10], [5, 8], [2, 5], [5, 9]]\`

**Output:** \`[1, 0, 0, 1]\`

**Explanation:** Let's process all the queries one by one:

- \`[0, 10]\`: The substring is \`"abaaabaaaba"\` which is a palindrome.
- \`[5, 8]\`: The substring is \`"baaa"\` which is not a palindrome.
- \`[2, 5]\`: The substring is \`"aaab"\` which is not a palindrome.
- \`[5, 9]\`: The substring is \`"baaab"\` which is a palindrome.

### Example 2

**Input:** \`s = "abdcaaa", queries[][] = [[0, 1], [2, 2], [4, 6]]\`

**Output:** \`[0, 1, 1]\`

**Explanation:**

- \`[0, 1]\`: The substring is \`"ab"\` which is not a palindrome.
- \`[2, 2]\`: The substring is \`"d"\` which is a palindrome.
- \`[4, 6]\`: The substring is \`"aaa"\` which is a palindrome.`,
    constraints: '1 <= s.length, q <= 10^5\n0 <= queries[i][0] <= queries[i][1] < s.length\ns consists of lowercase English letters.',
    inputFormat: 'The first line contains s. The second line contains q. Each of the next q lines contains left and right.',
    outputFormat: 'Print 1 for each palindrome substring and 0 otherwise, as space-separated integers in query order.',
    difficulty: 'hard',
    xpReward: 8,
    sampleInput: "abaaabaaaba\n4\n0 10\n5 8\n2 5\n5 9",
    sampleOutput: '1 0 0 1',
    testCases: [
      { input: "abaaabaaaba\n4\n0 10\n5 8\n2 5\n5 9", output: '1 0 0 1', isHidden: false },
      { input: "abdcaaa\n3\n0 1\n2 2\n4 6", output: '0 1 1', isHidden: false },
      { input: "a\n1\n0 0", output: '1', isHidden: true }
    ]
  },
  "Heap Sort": {
    statement: `Given an array \`arr[]\`. The task is to sort the array elements by Heap Sort.

### Example 1

**Input:** \`arr[] = [4, 1, 3, 9, 7]\`

**Output:** \`[1, 3, 4, 7, 9]\`

**Explanation:** After sorting elements using heap sort, elements will be in order as 1, 3, 4, 7, 9.

### Example 2

**Input:** \`arr[] = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]\`

**Output:** \`[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\`

**Explanation:** After sorting elements using heap sort, elements will be in order as 1, 2, 3, 4, 5, 6, 7, 8, 9, 10.

### Example 3

**Input:** \`arr[] = [2, 1, 5]\`

**Output:** \`[1, 2, 5]\`

**Explanation:** After sorting elements using heap sort, elements will be in order as 1, 2, 5.`,
    constraints: '1 <= arr.length <= 10^6\n1 <= arr[i] <= 10^6',
    inputFormat: 'The first line contains n. The second line contains n space-separated integers of arr.',
    outputFormat: 'Print the sorted array as space-separated integers.',
    difficulty: 'medium',
    xpReward: 4,
    sampleInput: "5\n4 1 3 9 7",
    sampleOutput: '1 3 4 7 9',
    testCases: [
      { input: "5\n4 1 3 9 7", output: '1 3 4 7 9', isHidden: false },
      { input: "10\n10 9 8 7 6 5 4 3 2 1", output: '1 2 3 4 5 6 7 8 9 10', isHidden: false },
      { input: "3\n2 1 5", output: '1 2 5', isHidden: false },
      { input: "1\n42", output: '42', isHidden: true }
    ]
  },
  "k largest elements in an array": {
    title: 'Kth Largest Element in an Array',
    statement: `Given an integer array \`nums\` and an integer \`k\`, return the kth largest element in the array.

Note that it is the kth largest element in the sorted order, not the kth distinct element.

Can you solve it without sorting?

### Example 1

**Input:** \`nums = [3, 2, 1, 5, 6, 4], k = 2\`

**Output:** \`5\`

### Example 2

**Input:** \`nums = [3, 2, 3, 1, 2, 4, 5, 5, 6], k = 4\`

**Output:** \`4\``,
    constraints: '1 <= k <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4',
    inputFormat: 'The first line contains the space-separated elements of nums. The second line contains k.',
    outputFormat: 'Print the kth largest element.',
    difficulty: 'medium',
    xpReward: 4,
    sampleInput: "3 2 1 5 6 4\n2",
    sampleOutput: '5',
    testCases: [
      { input: "3 2 1 5 6 4\n2", output: '5', isHidden: false },
      { input: "3 2 3 1 2 4 5 5 6\n4", output: '4', isHidden: false },
      { input: "7\n1", output: '7', isHidden: true }
    ]
  },
  "Find Median from Data Stream": {
    statement: `The median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values.

For example, for \`arr = [2, 3, 4]\`, the median is \`3\`.

For example, for \`arr = [2, 3]\`, the median is \`(2 + 3) / 2 = 2.5\`.

Implement the \`MedianFinder\` class:

- \`MedianFinder()\` initializes the MedianFinder object.
- \`void addNum(int num)\` adds the integer \`num\` from the data stream to the data structure.
- \`double findMedian()\` returns the median of all elements so far. Answers within \`10^-5\` of the actual answer will be accepted.

### Example 1

**Input:**

\`["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "findMedian"]\`

\`[[], [1], [2], [], [3], []]\`

**Output:** \`[null, null, null, 1.5, null, 2.0]\`

**Explanation:**

\`MedianFinder medianFinder = new MedianFinder();\`

\`medianFinder.addNum(1);    // arr = [1]\`

\`medianFinder.addNum(2);    // arr = [1, 2]\`

\`medianFinder.findMedian(); // return 1.5\`

\`medianFinder.addNum(3);    // arr = [1, 2, 3]\`

\`medianFinder.findMedian(); // return 2.0\``,
    constraints: '-10^5 <= num <= 10^5\nThere will be at least one element in the data structure before calling findMedian.\nAt most 5 * 10^4 calls will be made to addNum and findMedian.',
    inputFormat: 'The first line contains q. Each of the next q lines is either "addNum num" or "findMedian".',
    outputFormat: 'For every findMedian operation, print the median on a new line.',
    difficulty: 'hard',
    sampleInput: "5\naddNum 1\naddNum 2\nfindMedian\naddNum 3\nfindMedian",
    sampleOutput: "1.5\n2.0",
    testCases: [
      { input: "5\naddNum 1\naddNum 2\nfindMedian\naddNum 3\nfindMedian", output: "1.5\n2.0", isHidden: false },
      { input: "4\naddNum 2\naddNum 3\nfindMedian\nfindMedian", output: "2.5\n2.5", isHidden: false },
      { input: "2\naddNum -5\nfindMedian", output: '-5.0', isHidden: true }
    ]
  },
  "K'th largest element in a stream": {
    title: 'Kth Largest Element in a Stream',
    statement: `You are part of a university admissions office and need to keep track of the kth highest test score from applicants in real-time. This helps to determine cut-off marks for interviews and admissions dynamically as new applicants submit their scores.

Implement a class which, for a given integer \`k\`, maintains a stream of test scores and continuously returns the kth highest test score after a new score has been submitted. The kth highest score is the kth largest score in the sorted list of all scores.

Implement the \`KthLargest\` class:

- \`KthLargest(int k, int[] nums)\` initializes the object with the integer \`k\` and the stream of test scores \`nums\`.
- \`int add(int val)\` adds a new test score \`val\` to the stream and returns the kth largest test score so far.

### Example 1

**Input:**

\`["KthLargest", "add", "add", "add", "add", "add"]\`

\`[[3, [4, 5, 8, 2]], [3], [5], [10], [9], [4]]\`

**Output:** \`[null, 4, 5, 5, 8, 8]\`

**Explanation:**

\`KthLargest kthLargest = new KthLargest(3, [4, 5, 8, 2]);\`

\`kthLargest.add(3); // return 4\`

\`kthLargest.add(5); // return 5\`

\`kthLargest.add(10); // return 5\`

\`kthLargest.add(9); // return 8\`

\`kthLargest.add(4); // return 8\`

### Example 2

**Input:**

\`["KthLargest", "add", "add", "add", "add"]\`

\`[[4, [7, 7, 7, 7, 8, 3]], [2], [10], [9], [9]]\`

**Output:** \`[null, 7, 7, 7, 8]\``,
    constraints: '0 <= nums.length <= 10^4\n1 <= k <= nums.length + 1\n-10^4 <= nums[i], val <= 10^4\nAt most 10^4 calls will be made to add.',
    inputFormat: 'The first line contains k. The second line contains the initial stream elements, separated by spaces (it may be empty). The third line contains q. Each of the next q lines contains a value to add.',
    outputFormat: 'For each added value, print the kth largest element on a new line.',
    difficulty: 'easy',
    sampleInput: "3\n4 5 8 2\n5\n3\n5\n10\n9\n4",
    sampleOutput: "4\n5\n5\n8\n8",
    testCases: [
      { input: "3\n4 5 8 2\n5\n3\n5\n10\n9\n4", output: "4\n5\n5\n8\n8", isHidden: false },
      { input: "4\n7 7 7 7 8 3\n4\n2\n10\n9\n9", output: "7\n7\n7\n8", isHidden: false },
      { input: "1\n\n2\n-5\n4", output: "-5\n4", isHidden: true }
    ]
  },
  "K-th smallest element after removing some integers from natural numbers": {
    statement: `_Last Updated: 23 Jul, 2025_

Given an array **arr[]** of size **n** and a positive integer **k**. Consider the series of natural numbers and remove \`arr[0], arr[1], arr[2], ..., arr[n - 1]\` from it. Find the kth smallest number in the remaining set of natural numbers. If no such number exists, print \`-1\`.

### Example 1

**Input:** \`arr[] = [1]\` and \`k = 1\`

**Output:** \`2\`

**Explanation:** Natural numbers are \`{1, 2, 3, 4, ...}\`. After removing \`{1}\`, we get \`{2, 3, 4, ...}\`. The 1st smallest remaining element is \`2\`.

### Example 2

**Input:** \`arr[] = [1, 3]\` and \`k = 4\`

**Output:** \`6\`

**Explanation:** The first natural numbers are \`{1, 2, 3, 4, 5, 6, ...}\`. After removing \`{1, 3}\`, we get \`{2, 4, 5, 6, ...}\`. The 4th smallest remaining element is \`6\`.`,
    inputFormat: 'The first line contains the space-separated elements of arr. The second line contains k.',
    outputFormat: 'Print the kth smallest natural number that is not in arr, or -1 if it does not exist.',
    sampleInput: "1\n1",
    sampleOutput: '2',
    testCases: [
      { input: "1\n1", output: '2', isHidden: false },
      { input: "1 3\n4", output: '6', isHidden: false },
      { input: "2 4 5\n3", output: '6', isHidden: true }
    ]
  },
  "Group Shifted Strings": {
    statement: `_Last Updated: 28 Dec, 2024_

Given an array of strings containing lowercase letters, group the strings so that every string in a group is a shifted version of every other string in that group.

Two strings **s1** and **s2** are shifted if:

- \`s1.length\` is equal to \`s2.length\`.
- \`s1[i]\` is equal to \`s2[i] + m\` for every index, for a constant integer \`m\`.

The shifting is cyclic: if a shift goes past \`'z'\`, it continues from \`'a'\`; if it goes before \`'a'\`, it continues from \`'z'\`.

### Example 1

**Input:** \`arr[] = ["acd", "dfg", "wyz", "yab", "mop", "bdfh", "a", "x", "moqs"]\`

**Output:** \`[["acd", "dfg", "wyz", "yab", "mop"], ["bdfh", "moqs"], ["a", "x"]]\`

**Explanation:** All shifted strings are grouped together.

### Example 2

**Input:** \`arr[] = ["geek", "for", "geeks"]\`

**Output:** \`[["for"], ["geek"], ["geeks"]]\``,
    inputFormat: 'The first line contains the lowercase strings of arr, separated by spaces.',
    outputFormat: 'Print the groups as a nested array. The order of groups and strings within a group may vary.',
    sampleInput: 'acd dfg wyz yab mop bdfh a x moqs',
    sampleOutput: '[["acd","dfg","wyz","yab","mop"],["bdfh","moqs"],["a","x"]]',
    testCases: [
      { input: 'acd dfg wyz yab mop bdfh a x moqs', output: '[["acd","dfg","wyz","yab","mop"],["bdfh","moqs"],["a","x"]]', isHidden: false },
      { input: 'geek for geeks', output: '[["for"],["geek"],["geeks"]]', isHidden: false },
      { input: 'a z', output: '[["a","z"]]', isHidden: true }
    ]
  },
  "Choose k array elements such that difference of maximum and minimum is minimized": {
    title: 'Choose m elements having minimum difference between max and min',
    statement: `_Last Updated: 23 Jul, 2025_

Given an array **arr[]** of **n** integers, pick **exactly m elements** such that the difference between the maximum and minimum chosen elements is minimized.

### Example 1

**Input:** \`arr[] = [7, 3, 2, 4, 9, 12, 56]\`, \`m = 3\`

**Output:** \`2\`

**Explanation:** Pick \`{3, 2, 4}\`. The difference is \`4 - 2 = 2\`, which is minimum.

### Example 2

**Input:** \`arr[] = [7, 3, 2, 4, 9, 12, 56]\`, \`m = 5\`

**Output:** \`7\`

**Explanation:** Pick \`{3, 2, 4, 9, 7}\`. The difference is \`9 - 2 = 7\`.

### Example 3

**Input:** \`arr[] = [10, 100, 300, 200, 1000, 20, 30]\`, \`m = 3\`

**Output:** \`20\`

**Explanation:** Pick \`{10, 20, 30}\`. The difference is \`30 - 10 = 20\`.`,
    inputFormat: 'The first line contains the space-separated elements of arr. The second line contains m.',
    outputFormat: 'Print the minimum possible difference between the maximum and minimum selected elements.',
    sampleInput: "7 3 2 4 9 12 56\n3",
    sampleOutput: '2',
    testCases: [
      { input: "7 3 2 4 9 12 56\n3", output: '2', isHidden: false },
      { input: "7 3 2 4 9 12 56\n5", output: '7', isHidden: false },
      { input: "10 100 300 200 1000 20 30\n3", output: '20', isHidden: false }
    ]
  },
  "Sliding Window Maximum": {
    statement: `You are given an integer array \`nums\` and a sliding window of size \`k\` that moves from the left of the array to the right. At each position, consider only the \`k\` values inside the window.

Return the maximum value in every sliding window.

### Example 1

**Input:** \`nums = [1, 3, -1, -3, 5, 3, 6, 7]\`, \`k = 3\`

**Output:** \`[3, 3, 5, 5, 6, 7]\`

**Explanation:**

| Window | Maximum |
| --- | --- |
| \`[1, 3, -1]\` | \`3\` |
| \`[3, -1, -3]\` | \`3\` |
| \`[-1, -3, 5]\` | \`5\` |
| \`[-3, 5, 3]\` | \`5\` |
| \`[5, 3, 6]\` | \`6\` |
| \`[3, 6, 7]\` | \`7\` |

### Example 2

**Input:** \`nums = [1]\`, \`k = 1\`

**Output:** \`[1]\``,
    constraints: '1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4\n1 <= k <= nums.length',
    inputFormat: 'The first line contains the space-separated elements of nums. The second line contains k.',
    outputFormat: 'Print the maximum of each window as space-separated integers.',
    difficulty: 'hard',
    sampleInput: "1 3 -1 -3 5 3 6 7\n3",
    sampleOutput: '3 3 5 5 6 7',
    testCases: [
      { input: "1 3 -1 -3 5 3 6 7\n3", output: '3 3 5 5 6 7', isHidden: false },
      { input: "1\n1", output: '1', isHidden: false },
      { input: "9 11\n2", output: '11', isHidden: true }
    ]
  },
  "Find Surpasser Count of each element in array": {
    title: 'Surpasser Count',
    statement: `Given an array \`arr[]\` containing distinct integers, find the number of surpassers for each element. An element \`y\` is a surpasser of element \`x\` if it is a greater element to the right of \`x\`. In other words, if \`x = arr[i]\` and \`y = arr[j]\`, then \`i < j\` and \`arr[i] < arr[j]\`.

### Example 1

**Input:** \`arr[] = [2, 7, 5, 3, 8, 1]\`

**Output:** \`[4, 1, 1, 1, 0, 0]\`

**Explanation:**

- For \`2\`, there are 4 greater elements to its right: \`[7, 5, 3, 8]\`.
- For \`7\`, \`5\`, and \`3\`, there is 1 greater element to the right: \`[8]\`.
- For \`8\` and \`1\`, there are no greater elements to the right.

### Example 2

**Input:** \`arr[] = [4, 5, 1]\`

**Output:** \`[1, 0, 0]\`

**Explanation:** \`4\` has one greater element to its right, \`[5]\`. \`5\` and \`1\` have no greater element to their right.`,
    constraints: '1 <= arr.length <= 10^5\n1 <= arr[i] <= 10^6\nAll elements in arr are distinct.',
    inputFormat: 'The first line contains the space-separated elements of arr.',
    outputFormat: 'Print the surpasser count for every element as space-separated integers.',
    difficulty: 'medium',
    xpReward: 4,
    sampleInput: '2 7 5 3 8 1',
    sampleOutput: '4 1 1 1 0 0',
    testCases: [
      { input: '2 7 5 3 8 1', output: '4 1 1 1 0 0', isHidden: false },
      { input: '4 5 1', output: '1 0 0', isHidden: false },
      { input: '3 2 1', output: '0 0 0', isHidden: true }
    ]
  },
  "Connect Ropes": {
    title: 'Min Cost to Connect Ropes',
    statement: `Given an array \`arr[]\` of rope lengths, connect all ropes into a single rope with the minimum total cost. The cost to connect two ropes is the sum of their lengths.

### Example 1

**Input:** \`arr[] = [4, 3, 2, 6]\`

**Output:** \`29\`

**Explanation:** First connect \`2\` and \`3\` for a cost of \`5\`, giving \`[4, 5, 6]\`. Then connect \`4\` and \`5\` for a cost of \`9\`, giving \`[9, 6]\`. Finally connect \`9\` and \`6\` for a cost of \`15\`. The total is \`5 + 9 + 15 = 29\`.

### Example 2

**Input:** \`arr[] = [4, 2, 7, 6, 9]\`

**Output:** \`62\`

**Explanation:** Connect \`4\` and \`2\` (cost \`6\`), then \`6\` and \`6\` (cost \`12\`), then \`7\` and \`9\` (cost \`16\`), and finally \`12\` and \`16\` (cost \`28\`). The total cost is \`6 + 12 + 16 + 28 = 62\`.

### Example 3

**Input:** \`arr[] = [10]\`

**Output:** \`0\`

**Explanation:** With only one rope, no connections are needed.`,
    constraints: '1 <= arr.length <= 10^5\n1 <= arr[i] <= 10^4',
    inputFormat: 'The first line contains the space-separated rope lengths in arr.',
    outputFormat: 'Print the minimum total cost to connect all ropes.',
    difficulty: 'medium',
    xpReward: 4,
    sampleInput: '4 3 2 6',
    sampleOutput: '29',
    testCases: [
      { input: '4 3 2 6', output: '29', isHidden: false },
      { input: '4 2 7 6 9', output: '62', isHidden: false },
      { input: '10', output: '0', isHidden: false }
    ]
  },
  "Check for palindrome": {
    title: 'Valid Palindrome',
    statement: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string \`s\`, return \`true\` if it is a palindrome, or \`false\` otherwise.

### Example 1

**Input:** \`s = "A man, a plan, a canal: Panama"\`

**Output:** \`true\`

**Explanation:** \`"amanaplanacanalpanama"\` is a palindrome.

### Example 2

**Input:** \`s = "race a car"\`

**Output:** \`false\`

**Explanation:** \`"raceacar"\` is not a palindrome.

### Example 3

**Input:** \`s = " "\`

**Output:** \`true\`

**Explanation:** After removing non-alphanumeric characters, \`s\` is an empty string. An empty string reads the same forward and backward.`,
    constraints: '1 <= s.length <= 2 * 10^5\ns consists only of printable ASCII characters.',
    inputFormat: 'The first line contains s.',
    outputFormat: 'Print true if s is a valid palindrome; otherwise, print false.',
    difficulty: 'easy',
    xpReward: 10,
    sampleInput: 'A man, a plan, a canal: Panama',
    sampleOutput: 'true',
    testCases: [
      { input: 'A man, a plan, a canal: Panama', output: 'true', isHidden: false },
      { input: 'race a car', output: 'false', isHidden: false },
      { input: ' ', output: 'true', isHidden: false }
    ]
  },
  "Subarray distinct elements": {
    title: 'Subarrays with distinct elements',
    statement: `_Last Updated: 13 Aug, 2025_

Given an array, calculate the sum of the lengths of all contiguous subarrays whose elements are distinct.

### Example 1

**Input:** \`arr[] = [1, 2, 3]\`

**Output:** \`10\`

**Explanation:** \`{1, 2, 3}\` has length \`3\`. The two length-2 subarrays, \`{1, 2}\` and \`{2, 3}\`, contribute \`2 + 2 = 4\`. The three length-1 subarrays contribute \`1 + 1 + 1 = 3\`. Thus, the total is \`3 + 4 + 3 = 10\`.

### Example 2

**Input:** \`arr[] = [1, 2, 1]\`

**Output:** \`7\`

### Example 3

**Input:** \`arr[] = [1, 2, 3, 4]\`

**Output:** \`20\``,
    inputFormat: 'The first line contains the space-separated elements of arr.',
    outputFormat: 'Print the sum of lengths of all contiguous subarrays with distinct elements.',
    sampleInput: '1 2 3',
    sampleOutput: '10',
    testCases: [
      { input: '1 2 3', output: '10', isHidden: false },
      { input: '1 2 1', output: '7', isHidden: false },
      { input: '1 2 3 4', output: '20', isHidden: false }
    ]
  },
  "Top K Frequent Elements": {
    statement: `Given an integer array \`nums\` and an integer \`k\`, return the \`k\` most frequent elements. You may return the answer in any order.

### Example 1

**Input:** \`nums = [1, 1, 1, 2, 2, 3]\`, \`k = 2\`

**Output:** \`[1, 2]\`

### Example 2

**Input:** \`nums = [1]\`, \`k = 1\`

**Output:** \`[1]\`

### Example 3

**Input:** \`nums = [1, 2, 1, 2, 1, 2, 3, 1, 3, 2]\`, \`k = 2\`

**Output:** \`[1, 2]\``,
    constraints: '1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4\n1 <= k <= number of unique elements in nums\nThe answer is guaranteed to be unique.',
    inputFormat: 'The first line contains the space-separated elements of nums. The second line contains k.',
    outputFormat: 'Print the k most frequent elements as space-separated integers, in any order.',
    difficulty: 'medium',
    xpReward: 4,
    sampleInput: "1 1 1 2 2 3\n2",
    sampleOutput: '1 2',
    testCases: [
      { input: "1 1 1 2 2 3\n2", output: '1 2', isHidden: false },
      { input: "1\n1", output: '1', isHidden: false },
      { input: "1 2 1 2 1 2 3 1 3 2\n2", output: '1 2', isHidden: false }
    ]
  },
  "Find k closest elements to a given value": {
    title: 'Find K Closest Elements',
    statement: `Given a **sorted** integer array \`arr\` and two integers \`k\` and \`x\`, return the \`k\` integers in \`arr\` that are closest to \`x\`. Return the result sorted in ascending order.

An integer \`a\` is closer to \`x\` than an integer \`b\` if:

- \`|a - x| < |b - x|\`, or
- \`|a - x| == |b - x|\` and \`a < b\`.

### Example 1

**Input:** \`arr = [1, 2, 3, 4, 5]\`, \`k = 4\`, \`x = 3\`

**Output:** \`[1, 2, 3, 4]\`

### Example 2

**Input:** \`arr = [1, 1, 2, 3, 4, 5]\`, \`k = 4\`, \`x = -1\`

**Output:** \`[1, 1, 2, 3]\``,
    constraints: '1 <= k <= arr.length\n1 <= arr.length <= 10^4\narr is sorted in ascending order.\n-10^4 <= arr[i], x <= 10^4',
    inputFormat: 'The first line contains the sorted, space-separated elements of arr. The second line contains k and x.',
    outputFormat: 'Print the k closest elements in ascending order, separated by spaces.',
    difficulty: 'medium',
    xpReward: 4,
    sampleInput: "1 2 3 4 5\n4 3",
    sampleOutput: '1 2 3 4',
    testCases: [
      { input: "1 2 3 4 5\n4 3", output: '1 2 3 4', isHidden: false },
      { input: "1 1 2 3 4 5\n4 -1", output: '1 1 2 3', isHidden: false },
      { input: "1 2 3 4 5\n4 10", output: '2 3 4 5', isHidden: true }
    ]
  },
  "Two Sum": {
    statement: `Given an array of integers \`nums\` and an integer \`target\`, return the indices of the two numbers such that they add up to \`target\`.

You may assume that every input has exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

### Example 1

**Input:** \`nums = [2, 7, 11, 15]\`, \`target = 9\`

**Output:** \`[0, 1]\`

**Explanation:** Because \`nums[0] + nums[1] == 9\`, return \`[0, 1]\`.

### Example 2

**Input:** \`nums = [3, 2, 4]\`, \`target = 6\`

**Output:** \`[1, 2]\`

### Example 3

**Input:** \`nums = [3, 3]\`, \`target = 6\`

**Output:** \`[0, 1]\``,
    constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9\nOnly one valid answer exists.',
    inputFormat: 'The first line contains the space-separated elements of nums. The second line contains target.',
    outputFormat: 'Print the two indices as space-separated integers.',
    difficulty: 'easy',
    xpReward: 10,
    sampleInput: "2 7 11 15\n9",
    sampleOutput: "0 1",
    testCases: [
      { input: "2 7 11 15\n9", output: "0 1", isHidden: false },
      { input: "3 2 4\n6", output: "1 2", isHidden: false },
      { input: "3 3\n6", output: "0 1", isHidden: true }
    ]
  },
  "Count distinct elements in every window of size k": {
    title: 'Count Distinct Elements in Every Window',
    statement: `Given an integer array \`arr[]\` and a number \`k\`, find the count of distinct elements in every window of size \`k\` in the array.

### Example 1

**Input:** \`arr[] = [1, 2, 1, 3, 4, 2, 3]\`, \`k = 4\`

**Output:** \`[3, 4, 4, 3]\`

**Explanation:** The windows are \`[1, 2, 1, 3]\`, \`[2, 1, 3, 4]\`, \`[1, 3, 4, 2]\`, and \`[3, 4, 2, 3]\`, with \`3\`, \`4\`, \`4\`, and \`3\` distinct elements respectively.

### Example 2

**Input:** \`arr[] = [4, 1, 1]\`, \`k = 2\`

**Output:** \`[2, 1]\`

**Explanation:** \`[4, 1]\` contains two distinct elements and \`[1, 1]\` contains one.

### Example 3

**Input:** \`arr[] = [1, 1, 1, 1, 1]\`, \`k = 3\`

**Output:** \`[1, 1, 1]\`

**Explanation:** Every window contains only the element \`1\`.`,
    constraints: '1 <= k <= arr.length <= 10^5\n1 <= arr[i] <= 10^5',
    inputFormat: 'The first line contains the space-separated elements of arr. The second line contains k.',
    outputFormat: 'Print the distinct-element count for every window as space-separated integers.',
    difficulty: 'medium',
    xpReward: 4,
    sampleInput: "1 2 1 3 4 2 3\n4",
    sampleOutput: '3 4 4 3',
    testCases: [
      { input: "1 2 1 3 4 2 3\n4", output: '3 4 4 3', isHidden: false },
      { input: "4 1 1\n2", output: '2 1', isHidden: false },
      { input: "1 1 1 1 1\n3", output: '1 1 1', isHidden: false }
    ]
  },
  "Majority Element": {
    statement: `Given an array \`nums\` of size \`n\`, return the majority element.

The majority element is the element that appears more than \`⌊n / 2⌋\` times. You may assume that the majority element always exists in the array.

### Example 1

**Input:** \`nums = [3, 2, 3]\`

**Output:** \`3\`

### Example 2

**Input:** \`nums = [2, 2, 1, 1, 1, 2, 2]\`

**Output:** \`2\``,
    constraints: 'n == nums.length\n1 <= n <= 5 * 10^4\n-10^9 <= nums[i] <= 10^9\nA majority element always exists in nums.',
    inputFormat: 'The first line contains the space-separated elements of nums.',
    outputFormat: 'Print the majority element.',
    difficulty: 'easy',
    xpReward: 10,
    sampleInput: '3 2 3',
    sampleOutput: '3',
    testCases: [
      { input: '3 2 3', output: '3', isHidden: false },
      { input: '2 2 1 1 1 2 2', output: '2', isHidden: false },
      { input: '1', output: '1', isHidden: true }
    ]
  },
  "Happy Number": {
    statement: `Write an algorithm to determine whether a positive integer \`n\` is happy.

A happy number follows this process:

- Replace the number with the sum of the squares of its digits.
- Repeat until the number equals \`1\`, where it remains, or it enters a cycle that does not include \`1\`.

Return \`true\` if the process ends in \`1\`; otherwise, return \`false\`.

### Example 1

**Input:** \`n = 19\`

**Output:** \`true\`

**Explanation:**

\`1² + 9² = 82\`

\`8² + 2² = 68\`

\`6² + 8² = 100\`

\`1² + 0² + 0² = 1\`

### Example 2

**Input:** \`n = 2\`

**Output:** \`false\``,
    constraints: '1 <= n <= 2^31 - 1',
    inputFormat: 'The first line contains n.',
    outputFormat: 'Print true if n is a happy number; otherwise, print false.',
    difficulty: 'easy',
    xpReward: 10,
    sampleInput: '19',
    sampleOutput: 'true',
    testCases: [
      { input: '19', output: 'true', isHidden: false },
      { input: '2', output: 'false', isHidden: false },
      { input: '1', output: 'true', isHidden: true }
    ]
  },
  "K'th Smallest/Largest Element in Unsorted Array": {
    title: "K'th Smallest/Largest Element in Unsorted Array | Expected Linear Time",
    statement: `_Last Updated: 23 Jul, 2025_

Given an array of distinct integers and an integer \`k\`, where \`k\` is smaller than the array's size, find the kth smallest element in the array.

### Example 1

**Input:** \`arr = [7, 10, 4, 3, 20, 15]\`, \`k = 3\`

**Output:** \`7\`

**Explanation:** The sorted array is \`[3, 4, 7, 10, 15, 20]\`, so the 3rd smallest element is \`7\`.

### Example 2

**Input:** \`arr = [7, 10, 4, 3, 20, 15]\`, \`k = 4\`

**Output:** \`10\`

**Explanation:** The sorted array is \`[3, 4, 7, 10, 15, 20]\`, so the 4th smallest element is \`10\`.`,
    inputFormat: 'The first line contains the space-separated, distinct elements of arr. The second line contains k.',
    outputFormat: 'Print the kth smallest element.',
    sampleInput: "7 10 4 3 20 15\n3",
    sampleOutput: '7',
    testCases: [
      { input: "7 10 4 3 20 15\n3", output: '7', isHidden: false },
      { input: "7 10 4 3 20 15\n4", output: '10', isHidden: false },
      { input: "5 1 9\n1", output: '1', isHidden: true }
    ]
  },
  "Length of the largest subarray with contiguous elements": {
    title: 'Length of the largest subarray with contiguous elements | Set 1',
    statement: `_Last Updated: 23 Jul, 2025_

Given an array of distinct integers, find the length of the longest subarray whose values can be arranged into a continuous sequence.

### Example 1

**Input:** \`arr[] = [10, 12, 11]\`

**Output:** \`3\`

**Explanation:** The entire subarray can be arranged as \`[10, 11, 12]\`.

### Example 2

**Input:** \`arr[] = [14, 12, 11, 20]\`

**Output:** \`2\`

### Example 3

**Input:** \`arr[] = [1, 56, 58, 57, 90, 92, 94, 93, 91, 45]\`

**Output:** \`5\``,
    inputFormat: 'The first line contains the space-separated, distinct elements of arr.',
    outputFormat: 'Print the length of the longest subarray with contiguous elements.',
    sampleInput: '10 12 11',
    sampleOutput: '3',
    testCases: [
      { input: '10 12 11', output: '3', isHidden: false },
      { input: '14 12 11 20', output: '2', isHidden: false },
      { input: '1 56 58 57 90 92 94 93 91 45', output: '5', isHidden: false }
    ]
  },
  "Merge K Sorted lists": {
    title: 'Merge K Sorted Lists',
    statement: `You are given an array of \`k\` linked lists, where each linked list is sorted in ascending order.

Merge all the linked lists into one sorted linked list and return it.

### Example 1

**Input:** \`lists = [[1, 4, 5], [1, 3, 4], [2, 6]]\`

**Output:** \`[1, 1, 2, 3, 4, 4, 5, 6]\`

**Explanation:** The lists \`1 → 4 → 5\`, \`1 → 3 → 4\`, and \`2 → 6\` merge into \`1 → 1 → 2 → 3 → 4 → 4 → 5 → 6\`.

### Example 2

**Input:** \`lists = []\`

**Output:** \`[]\`

### Example 3

**Input:** \`lists = [[]]\`

**Output:** \`[]\``,
    constraints: 'k == lists.length\n0 <= k <= 10^4\n0 <= lists[i].length <= 500\n-10^4 <= lists[i][j] <= 10^4\nEach list is sorted in ascending order.\nThe total number of elements does not exceed 10^4.',
    inputFormat: 'The first line contains k. Each of the next k lines contains the space-separated values of one sorted list; an empty line represents an empty list.',
    outputFormat: 'Print all values from the merged list as space-separated integers.',
    difficulty: 'hard',
    sampleInput: "3\n1 4 5\n1 3 4\n2 6",
    sampleOutput: '1 1 2 3 4 4 5 6',
    testCases: [
      { input: "3\n1 4 5\n1 3 4\n2 6", output: '1 1 2 3 4 4 5 6', isHidden: false },
      { input: '0', output: '', isHidden: false },
      { input: "1\n", output: '', isHidden: false }
    ]
  },
  "Largest Subarray with 0 Sum": {
    statement: `Given an array \`arr[]\` containing positive and negative integers, find the length of the longest subarray whose sum equals \`0\`.

A subarray is a contiguous part of an array formed by selecting one or more consecutive elements while maintaining their original order.

### Example 1

**Input:** \`arr[] = [15, -2, 2, -8, 1, 7, 10, 23]\`

**Output:** \`5\`

**Explanation:** The longest subarray with sum \`0\` is \`[-2, 2, -8, 1, 7]\`.

### Example 2

**Input:** \`arr[] = [2, 10, 4]\`

**Output:** \`0\`

**Explanation:** No subarray has a sum of \`0\`.

### Example 3

**Input:** \`arr[] = [1, 0, -4, 3, 1, 0]\`

**Output:** \`5\`

**Explanation:** The longest subarray with sum \`0\` is \`[0, -4, 3, 1, 0]\`.`,
    constraints: '1 <= arr.length <= 10^6\n-10^3 <= arr[i] <= 10^3',
    inputFormat: 'The first line contains the space-separated elements of arr.',
    outputFormat: 'Print the length of the longest subarray with sum 0.',
    difficulty: 'medium',
    xpReward: 4,
    sampleInput: '15 -2 2 -8 1 7 10 23',
    sampleOutput: '5',
    testCases: [
      { input: '15 -2 2 -8 1 7 10 23', output: '5', isHidden: false },
      { input: '2 10 4', output: '0', isHidden: false },
      { input: '1 0 -4 3 1 0', output: '5', isHidden: false }
    ]
  },
  "Mutable Range Sum Query": {
    title: 'Range Sum Query - Mutable',
    statement: `Given an integer array \`nums\`, handle multiple queries of these types:

- Update the value of an element in \`nums\`.
- Calculate the sum of elements in \`nums\` between inclusive indices \`left\` and \`right\`.

Implement the \`NumArray\` class:

- \`NumArray(int[] nums)\` initializes the object with \`nums\`.
- \`void update(int index, int val)\` updates \`nums[index]\` to \`val\`.
- \`int sumRange(int left, int right)\` returns \`nums[left] + nums[left + 1] + ... + nums[right]\`.

### Example 1

**Input:**

\`["NumArray", "sumRange", "update", "sumRange"]\`

\`[[[1, 3, 5]], [0, 2], [1, 2], [0, 2]]\`

**Output:** \`[null, 9, null, 8]\`

**Explanation:** Initialize \`NumArray([1, 3, 5])\`. \`sumRange(0, 2)\` returns \`9\`; after \`update(1, 2)\`, \`sumRange(0, 2)\` returns \`8\`.`,
    constraints: '1 <= nums.length <= 3 * 10^4\n-100 <= nums[i], val <= 100\n0 <= index < nums.length\n0 <= left <= right < nums.length\nAt most 3 * 10^4 update and sumRange calls will be made.',
    inputFormat: 'The first line contains the space-separated elements of nums. The second line contains q. Each of the next q lines is either "update index val" or "sumRange left right".',
    outputFormat: 'For every sumRange operation, print the resulting sum on a new line.',
    difficulty: 'medium',
    xpReward: 4,
    sampleInput: "1 3 5\n3\nsumRange 0 2\nupdate 1 2\nsumRange 0 2",
    sampleOutput: "9\n8",
    testCases: [
      { input: "1 3 5\n3\nsumRange 0 2\nupdate 1 2\nsumRange 0 2", output: "9\n8", isHidden: false },
      { input: "-2 0 3 -5 2 -1\n2\nsumRange 0 2\nsumRange 2 5", output: "1\n-1", isHidden: false },
      { input: "1\n2\nsumRange 0 0\nupdate 0 -1", output: '1', isHidden: true }
    ]
  },
  "Range Sum Query": {
    title: 'Range Sum Query - Immutable',
    statement: `Given an integer array \`nums\`, handle multiple range-sum queries.

Implement the \`NumArray\` class:

- \`NumArray(int[] nums)\` initializes the object with the integer array \`nums\`.
- \`int sumRange(int left, int right)\` returns the sum of elements between inclusive indices \`left\` and \`right\`.

### Example 1

**Input:**

\`["NumArray", "sumRange", "sumRange", "sumRange"]\`

\`[[[-2, 0, 3, -5, 2, -1]], [0, 2], [2, 5], [0, 5]]\`

**Output:** \`[null, 1, -1, -3]\`

**Explanation:** Initialize \`NumArray([-2, 0, 3, -5, 2, -1])\`. The calls \`sumRange(0, 2)\`, \`sumRange(2, 5)\`, and \`sumRange(0, 5)\` return \`1\`, \`-1\`, and \`-3\` respectively.`,
    constraints: '1 <= nums.length <= 10^4\n-10^5 <= nums[i] <= 10^5\n0 <= left <= right < nums.length\nAt most 10^4 sumRange calls will be made.',
    inputFormat: 'The first line contains the space-separated elements of nums. The second line contains q. Each of the next q lines contains "sumRange left right".',
    outputFormat: 'Print the sum for every sumRange operation on a new line.',
    difficulty: 'easy',
    xpReward: 10,
    sampleInput: "-2 0 3 -5 2 -1\n3\nsumRange 0 2\nsumRange 2 5\nsumRange 0 5",
    sampleOutput: "1\n-1\n-3",
    testCases: [
      { input: "-2 0 3 -5 2 -1\n3\nsumRange 0 2\nsumRange 2 5\nsumRange 0 5", output: "1\n-1\n-3", isHidden: false },
      { input: "1\n1\nsumRange 0 0", output: '1', isHidden: false },
      { input: "5 -2 7\n2\nsumRange 1 2\nsumRange 0 1", output: "5\n3", isHidden: true }
    ]
  },
  "Create Sorted Array through Instructions": {
    statement: `Given an integer array \`instructions\`, create a sorted array by processing its elements from left to right. Start with an empty array \`nums\`. For each \`instructions[i]\`, insert it into \`nums\`.

The cost of an insertion is the minimum of:

- The number of elements in \`nums\` strictly less than \`instructions[i]\`.
- The number of elements in \`nums\` strictly greater than \`instructions[i]\`.

Return the total insertion cost modulo \`10^9 + 7\`.

### Example 1

**Input:** \`instructions = [1, 5, 6, 2]\`

**Output:** \`1\`

**Explanation:** Insert \`1\`, \`5\`, and \`6\` at cost \`0\`. Inserting \`2\` has cost \`min(1, 2) = 1\`. The total cost is \`1\`.

### Example 2

**Input:** \`instructions = [1, 2, 3, 6, 5, 4]\`

**Output:** \`3\`

**Explanation:** The insertion costs are \`0, 0, 0, 0, 1, 2\`, totaling \`3\`.

### Example 3

**Input:** \`instructions = [1, 3, 3, 3, 2, 4, 2, 1, 2]\`

**Output:** \`4\`

**Explanation:** The insertion costs are \`0, 0, 0, 0, 1, 0, 1, 0, 2\`, totaling \`4\`.`,
    constraints: '1 <= instructions.length <= 10^5\n1 <= instructions[i] <= 10^5',
    inputFormat: 'The first line contains the space-separated elements of instructions.',
    outputFormat: 'Print the total insertion cost modulo 10^9 + 7.',
    difficulty: 'hard',
    sampleInput: '1 5 6 2',
    sampleOutput: '1',
    testCases: [
      { input: '1 5 6 2', output: '1', isHidden: false },
      { input: '1 2 3 6 5 4', output: '3', isHidden: false },
      { input: '1 3 3 3 2 4 2 1 2', output: '4', isHidden: false }
    ]
  },
  "Queue Reconstruction by Height": {
    statement: `You are given an array \`people\` describing people in a queue, in arbitrary order. Each \`people[i] = [hi, ki]\` represents a person of height \`hi\` with exactly \`ki\` people in front of them whose height is greater than or equal to \`hi\`.

Reconstruct and return the queue. The result must be formatted as an array where \`queue[j] = [hj, kj]\` is the person at position \`j\`.

### Example 1

**Input:** \`people = [[7, 0], [4, 4], [7, 1], [5, 0], [6, 1], [5, 2]]\`

**Output:** \`[[5, 0], [7, 0], [5, 2], [6, 1], [4, 4], [7, 1]]\`

**Explanation:** In the reconstructed queue, each person has exactly the required number of people of at least their height before them.

### Example 2

**Input:** \`people = [[6, 0], [5, 0], [4, 0], [3, 2], [2, 2], [1, 4]]\`

**Output:** \`[[4, 0], [5, 0], [2, 2], [3, 2], [1, 4], [6, 0]]\``,
    constraints: '1 <= people.length <= 2000\n0 <= hi <= 10^6\n0 <= ki < people.length\nThe queue can be reconstructed.',
    inputFormat: 'The first line contains n. Each of the next n lines contains hi and ki for one person.',
    outputFormat: 'Print the reconstructed queue as n lines, each containing hi and ki.',
    difficulty: 'medium',
    xpReward: 4,
    sampleInput: "6\n7 0\n4 4\n7 1\n5 0\n6 1\n5 2",
    sampleOutput: "5 0\n7 0\n5 2\n6 1\n4 4\n7 1",
    testCases: [
      { input: "6\n7 0\n4 4\n7 1\n5 0\n6 1\n5 2", output: "5 0\n7 0\n5 2\n6 1\n4 4\n7 1", isHidden: false },
      { input: "6\n6 0\n5 0\n4 0\n3 2\n2 2\n1 4", output: "4 0\n5 0\n2 2\n3 2\n1 4\n6 0", isHidden: false }
    ]
  },
  "Count of Smaller Numbers": {
    title: 'Count of Smaller Numbers After Self',
    statement: `Given an integer array \`nums\`, return an integer array \`counts\` where \`counts[i]\` is the number of smaller elements to the right of \`nums[i]\`.

### Example 1

**Input:** \`nums = [5, 2, 6, 1]\`

**Output:** \`[2, 1, 1, 0]\`

**Explanation:** To the right of \`5\` there are two smaller elements, \`2\` and \`1\`. To the right of \`2\` and \`6\` there is one smaller element, \`1\`. To the right of \`1\` there are none.

### Example 2

**Input:** \`nums = [-1]\`

**Output:** \`[0]\`

### Example 3

**Input:** \`nums = [-1, -1]\`

**Output:** \`[0, 0]\``,
    constraints: '1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4',
    inputFormat: 'The first line contains the space-separated elements of nums.',
    outputFormat: 'Print the count for every element as space-separated integers.',
    difficulty: 'hard',
    sampleInput: '5 2 6 1',
    sampleOutput: '2 1 1 0',
    testCases: [
      { input: '5 2 6 1', output: '2 1 1 0', isHidden: false },
      { input: '-1', output: '0', isHidden: false },
      { input: '-1 -1', output: '0 0', isHidden: false }
    ]
  },
  "Maximum Subarray (Kadane's Algorithm)": {
    sampleInput: "-2 1 -3 4 -1 2 1 -5 4",
    sampleOutput: "6",
    testCases: [
      { input: "-2 1 -3 4 -1 2 1 -5 4", output: "6", isHidden: false },
      { input: "1", output: "1", isHidden: false },
      { input: "5 4 -1 7 8", output: "23", isHidden: true }
    ]
  },
  "Contains Duplicate": {
    sampleInput: "1 2 3 1",
    sampleOutput: "true",
    testCases: [
      { input: "1 2 3 1", output: "true", isHidden: false },
      { input: "1 2 3 4", output: "false", isHidden: false },
      { input: "1 1 1 3 3 4 3 2 4 2", output: "true", isHidden: true }
    ]
  },
  "Rotate Array": {
    sampleInput: "1 2 3 4 5\n2",
    sampleOutput: "3 4 5 1 2",
    testCases: [
      { input: "1 2 3 4 5\n2", output: "3 4 5 1 2", isHidden: false },
      { input: "2 4 6 8 10 12 14 16 18 20\n3", output: "8 10 12 14 16 18 20 2 4 6", isHidden: false },
      { input: "7 3 9 1\n9", output: "3 9 1 7", isHidden: true }
    ]
  },
  "Rotate array by K elements - Block Swap Algorithm": {
    sampleInput: "1 2 3 4 5\n2",
    sampleOutput: "3 4 5 1 2",
    testCases: [
      { input: "1 2 3 4 5\n2", output: "3 4 5 1 2", isHidden: false },
      { input: "2 4 6 8 10 12 14 16 18 20\n3", output: "8 10 12 14 16 18 20 2 4 6", isHidden: false },
      { input: "7 3 9 1\n9", output: "3 9 1 7", isHidden: true }
    ]
  },
  "Rotation of elements of array- left and right": {
    sampleInput: "1 2 3 4 5\n2",
    sampleOutput: "3 4 5 1 2",
    testCases: [
      { input: "1 2 3 4 5\n2", output: "3 4 5 1 2", isHidden: false },
      { input: "2 4 6 8 10 12 14 16 18 20\n3", output: "8 10 12 14 16 18 20 2 4 6", isHidden: false },
      { input: "7 3 9 1\n9", output: "3 9 1 7", isHidden: true }
    ]
  },
  "Finding Circular rotation of an array by K positions": {
    sampleInput: "1 2 3 4 5\n2",
    sampleOutput: "3 4 5 1 2",
    testCases: [
      { input: "1 2 3 4 5\n2", output: "3 4 5 1 2", isHidden: false },
      { input: "2 4 6 8 10 12 14 16 18 20\n3", output: "8 10 12 14 16 18 20 2 4 6", isHidden: false },
      { input: "7 3 9 1\n9", output: "3 9 1 7", isHidden: true }
    ]
  },
  "Find Pair with Sum in Sorted & Rotated Array": {
    sampleInput: "7 9 1 3 5\n6",
    sampleOutput: "true",
    testCases: [
      { input: "7 9 1 3 5\n6", output: "true", isHidden: false },
      { input: "2 3 4 1\n3", output: "true", isHidden: false },
      { input: "10 7 4 1\n9", output: "false", isHidden: true }
    ]
  },
  "Given Sum Pair": {
    sampleInput: "0 -1 2 -3 1\n-2",
    sampleOutput: "true",
    testCases: [
      { input: "0 -1 2 -3 1\n-2", output: "true", isHidden: false },
      { input: "1 -2 1 0 5\n0", output: "false", isHidden: false },
      { input: "11\n11", output: "false", isHidden: true }
    ]
  },
  "Two Sum - Pair with Given Sum": {
    sampleInput: "0 -1 2 -3 1\n-2",
    sampleOutput: "true",
    testCases: [
      { input: "0 -1 2 -3 1\n-2", output: "true", isHidden: false },
      { input: "1 -2 1 0 5\n0", output: "false", isHidden: false },
      { input: "11\n11", output: "false", isHidden: true }
    ]
  },
  "Pair Sum in a Sorted and Rotated Array": {
    sampleInput: "7 9 1 3 5\n6",
    sampleOutput: "true",
    testCases: [
      { input: "7 9 1 3 5\n6", output: "true", isHidden: false },
      { input: "2 3 4 1\n3", output: "true", isHidden: false },
      { input: "10 7 4 1\n9", output: "false", isHidden: true }
    ]
  },
  "Chocolate Distribution Problem": {
    sampleInput: "7 3 2 4 9 12 56\n3",
    sampleOutput: "2",
    testCases: [
      { input: "7 3 2 4 9 12 56\n3", output: "2", isHidden: false },
      { input: "3 4 1 9 56 7 9 12\n5", output: "6", isHidden: false },
      { input: "12 4 7 9 2 23 25 41 30 40 28 42 30 44 48 43 50\n7", output: "10", isHidden: true },
      { input: "10 20 30 100 101 102\n3", output: "2", isHidden: true },
      { input: "6 3 2 8 9 10\n4", output: "6", isHidden: true }
    ]
  },
  "Reverse the Array": {
    sampleInput: "1 4 3 2 6 5",
    sampleOutput: "5 6 2 3 4 1",
    testCases: [
      { input: "1 4 3 2 6 5", output: "5 6 2 3 4 1", isHidden: false },
      { input: "4 5 2", output: "2 5 4", isHidden: false },
      { input: "1", output: "1", isHidden: true }
    ]
  },
  "Reverse a given array": {
    sampleInput: "1 4 3 2 6 5",
    sampleOutput: "5 6 2 3 4 1",
    testCases: [
      { input: "1 4 3 2 6 5", output: "5 6 2 3 4 1", isHidden: false },
      { input: "4 5 2", output: "2 5 4", isHidden: false },
      { input: "1", output: "1", isHidden: true }
    ]
  },
  "3Sum": {
    sampleInput: "-1 0 1 2 -1 -4",
    sampleOutput: "-1 -1 2\n-1 0 1",
    testCases: [
      { input: "-1 0 1 2 -1 -4", output: "-1 -1 2\n-1 0 1", isHidden: false },
      { input: "0 0 0", output: "0 0 0", isHidden: false },
      { input: "-2 0 1 1 2", output: "-2 0 2\n-2 1 1", isHidden: true }
    ]
  },
  "Three Sum": {
    sampleInput: "-1 0 1 2 -1 -4",
    sampleOutput: "-1 -1 2\n-1 0 1",
    testCases: [
      { input: "-1 0 1 2 -1 -4", output: "-1 -1 2\n-1 0 1", isHidden: false },
      { input: "0 0 0", output: "0 0 0", isHidden: false },
      { input: "-2 0 1 1 2", output: "-2 0 2\n-2 1 1", isHidden: true }
    ]
  },
  "Find Minimum in Rotated Sorted Array": {
    sampleInput: "5 6 1 2 3 4",
    sampleOutput: "1",
    testCases: [
      { input: "5 6 1 2 3 4", output: "1", isHidden: false },
      { input: "3 1 2", output: "1", isHidden: false },
      { input: "4 2 3", output: "2", isHidden: true }
    ]
  },
  "Sorted and Rotated Minimum": {
    sampleInput: "5 6 1 2 3 4",
    sampleOutput: "1",
    testCases: [
      { input: "5 6 1 2 3 4", output: "1", isHidden: false },
      { input: "3 1 2", output: "1", isHidden: false },
      { input: "4 2 3", output: "2", isHidden: true }
    ]
  },
  "Subarray Sum Divisible K": {
    sampleInput: "4 5 0 -2 -3 1\n5",
    sampleOutput: "7",
    testCases: [
      { input: "4 5 0 -2 -3 1\n5", output: "7", isHidden: false },
      { input: "5\n9", output: "0", isHidden: false },
      { input: "1 2 3\n3", output: "2", isHidden: true }
    ]
  },
  "Subarray Sums Divisible by K": {
    sampleInput: "4 5 0 -2 -3 1\n5",
    sampleOutput: "7",
    testCases: [
      { input: "4 5 0 -2 -3 1\n5", output: "7", isHidden: false },
      { input: "5\n9", output: "0", isHidden: false },
      { input: "1 2 3\n3", output: "2", isHidden: true }
    ]
  },
  "Given an Array of Numbers Arrange the Numbers to Form the Biggest Number": {
    sampleInput: "3 30 34 5 9",
    sampleOutput: "9534330",
    testCases: [
      { input: "3 30 34 5 9", output: "9534330", isHidden: false },
      { input: "10 2", output: "210", isHidden: false },
      { input: "0 0", output: "0", isHidden: true }
    ]
  },
  "Largest Number": {
    sampleInput: "3 30 34 5 9",
    sampleOutput: "9534330",
    testCases: [
      { input: "3 30 34 5 9", output: "9534330", isHidden: false },
      { input: "10 2", output: "210", isHidden: false },
      { input: "0 0", output: "0", isHidden: true }
    ]
  },
  "Repeat and Missing Number Array": {
    sampleInput: "2 2",
    sampleOutput: "2 1",
    testCases: [
      { input: "2 2", output: "2 1", isHidden: false },
      { input: "1 3 3", output: "3 2", isHidden: false },
      { input: "4 3 6 2 1 1", output: "1 5", isHidden: true }
    ]
  },
  "Missing And Repeating": {
    sampleInput: "2 2",
    sampleOutput: "2 1",
    testCases: [
      { input: "2 2", output: "2 1", isHidden: false },
      { input: "1 3 3", output: "3 2", isHidden: false },
      { input: "4 3 6 2 1 1", output: "1 5", isHidden: true }
    ]
  },
  "Best Time to Buy and Sell Stock": {
    sampleInput: "7 1 5 3 6 4",
    sampleOutput: "5",
    testCases: [
      { input: "7 1 5 3 6 4", output: "5", isHidden: false },
      { input: "7 6 4 3 1", output: "0", isHidden: false },
      { input: "1 2", output: "1", isHidden: true }
    ]
  },
  "Maximum and Minimum Element in an Array": {
    sampleInput: "1 4 3 5 8 6",
    sampleOutput: "1 8",
    testCases: [
      { input: "1 4 3 5 8 6", output: "1 8", isHidden: false },
      { input: "12 3 15 7 9", output: "3 15", isHidden: false },
      { input: "5", output: "5 5", isHidden: true }
    ]
  },
  "Min and Max in Array": {
    sampleInput: "1 4 3 5 8 6",
    sampleOutput: "1 8",
    testCases: [
      { input: "1 4 3 5 8 6", output: "1 8", isHidden: false },
      { input: "12 3 15 7 9", output: "3 15", isHidden: false },
      { input: "5", output: "5 5", isHidden: true }
    ]
  },
  "Find Minimum Number of Merge Operations to Make an Array Palindrome": {
    sampleInput: "aabb",
    sampleOutput: "2",
    testCases: [
      { input: "aabb", output: "2", isHidden: false },
      { input: "letelt", output: "2", isHidden: false },
      { input: "ntiin", output: "1", isHidden: true }
    ]
  },
  "Minimum Number of Moves to Make Palindrome": {
    sampleInput: "aabb",
    sampleOutput: "2",
    testCases: [
      { input: "aabb", output: "2", isHidden: false },
      { input: "letelt", output: "2", isHidden: false },
      { input: "ntiin", output: "1", isHidden: true }
    ]
  },
  "Kth-Largest Element in an Array": {
    sampleInput: "3 5 4 2 9\n3",
    sampleOutput: "4",
    testCases: [
      { input: "3 5 4 2 9\n3", output: "4", isHidden: false },
      { input: "4 3 7 6 5\n5", output: "3", isHidden: false },
      { input: "10 20 30\n1", output: "30", isHidden: true }
    ]
  },
  "Kth Largest": {
    sampleInput: "3 5 4 2 9\n3",
    sampleOutput: "4",
    testCases: [
      { input: "3 5 4 2 9\n3", output: "4", isHidden: false },
      { input: "4 3 7 6 5\n5", output: "3", isHidden: false },
      { input: "10 20 30\n1", output: "30", isHidden: true }
    ]
  },
  "Container With Most Water": {
    sampleInput: "1 8 6 2 5 4 8 3 7",
    sampleOutput: "49",
    testCases: [
      { input: "1 8 6 2 5 4 8 3 7", output: "49", isHidden: false },
      { input: "1 1", output: "1", isHidden: false },
      { input: "4 3 2 1 4", output: "16", isHidden: true }
    ]
  },
  "Kth - Smallest Element": {
    sampleInput: "10 5 4 3 48 6 2 33 53 10\n4",
    sampleOutput: "5",
    testCases: [
      { input: "10 5 4 3 48 6 2 33 53 10\n4", output: "5", isHidden: false },
      { input: "7 10 4 3 20 15\n3", output: "7", isHidden: false },
      { input: "1 2\n2", output: "2", isHidden: true }
    ]
  },
  "Kth Smallest": {
    sampleInput: "10 5 4 3 48 6 2 33 53 10\n4",
    sampleOutput: "5",
    testCases: [
      { input: "10 5 4 3 48 6 2 33 53 10\n4", output: "5", isHidden: false },
      { input: "7 10 4 3 20 15\n3", output: "7", isHidden: false },
      { input: "1 2\n2", output: "2", isHidden: true }
    ]
  },
  "Product of Array Except Self": {
    sampleInput: "1 2 3 4",
    sampleOutput: "24 12 8 6",
    testCases: [
      { input: "1 2 3 4", output: "24 12 8 6", isHidden: false },
      { input: "-1 1 0 -3 3", output: "0 0 9 0 0", isHidden: false },
      { input: "2 3", output: "3 2", isHidden: true }
    ]
  },
  "Print all Possible Combinations of r Elements in a Given Array of Size n": {
    sampleInput: "1 2 3 4\n2",
    sampleOutput: "1 2\n1 3\n1 4\n2 3\n2 4\n3 4",
    testCases: [
      { input: "1 2 3 4\n2", output: "1 2\n1 3\n1 4\n2 3\n2 4\n3 4", isHidden: false },
      { input: "1 2 3 4\n3", output: "1 2 3\n1 2 4\n1 3 4\n2 3 4", isHidden: false },
      { input: "1 2\n1", output: "1\n2", isHidden: true }
    ]
  },
  "Search in Rotated Sorted Array": {
    sampleInput: "5 6 7 8 9 10 1 2 3\n3",
    sampleOutput: "8",
    testCases: [
      { input: "5 6 7 8 9 10 1 2 3\n3", output: "8", isHidden: false },
      { input: "3 5 1 2\n6", output: "-1", isHidden: false },
      { input: "33 42 72 99\n42", output: "1", isHidden: true }
    ]
  },
  "Trapping Rain Water": {
    sampleInput: "3 0 1 0 4 0 2",
    sampleOutput: "10",
    testCases: [
      { input: "3 0 1 0 4 0 2", output: "10", isHidden: false },
      { input: "3 0 2 0 4", output: "7", isHidden: false },
      { input: "1 2 3 4", output: "0", isHidden: true },
      { input: "2 1 5 3 1 0 4", output: "9", isHidden: true }
    ]
  },
  "Maximum Product Subarray": {
    sampleInput: "-2 6 -3 -10 0 2",
    sampleOutput: "180",
    testCases: [
      { input: "-2 6 -3 -10 0 2", output: "180", isHidden: false },
      { input: "-1 -3 -10 0 6", output: "30", isHidden: false },
      { input: "2 3 4", output: "24", isHidden: true }
    ]
  },
  "Merge Overlapping Intervals": {
    sampleInput: "1 3 2 4 6 8 9 10",
    sampleOutput: "1 4\n6 8\n9 10",
    testCases: [
      { input: "1 3 2 4 6 8 9 10", output: "1 4\n6 8\n9 10", isHidden: false },
      { input: "6 8 1 9 2 4 4 7", output: "1 9", isHidden: false },
      { input: "1 4 4 5", output: "1 5", isHidden: true }
    ]
  },
  "Merge Intervals": {
    sampleInput: "1 3 2 4 6 8 9 10",
    sampleOutput: "1 4\n6 8\n9 10",
    testCases: [
      { input: "1 3 2 4 6 8 9 10", output: "1 4\n6 8\n9 10", isHidden: false },
      { input: "6 8 1 9 2 4 4 7", output: "1 9", isHidden: false },
      { input: "1 4 4 5", output: "1 5", isHidden: true }
    ]
  },
  "Overlapping Intervals": {
    sampleInput: "1 3 2 4 6 8 9 10",
    sampleOutput: "1 4\n6 8\n9 10",
    testCases: [
      { input: "1 3 2 4 6 8 9 10", output: "1 4\n6 8\n9 10", isHidden: false },
      { input: "6 8 1 9 2 4 4 7", output: "1 9", isHidden: false },
      { input: "1 4 4 5", output: "1 5", isHidden: true }
    ]
  },
  "Space Optimization Using Bit Manipulations": {
    sampleInput: "2 10",
    sampleOutput: "2 4 5 6 8 10",
    testCases: [
      { input: "2 10", output: "2 4 5 6 8 10", isHidden: false },
      { input: "60 95", output: "60 62 64 65 66 68 70 72 74 75 76 78 80 82 84 85 86 88 90 92 94 95", isHidden: false },
      { input: "1 5", output: "2 4 5", isHidden: true }
    ]
  },
  "Maximum Subarray": {
    sampleInput: "2 3 -8 7 -1 2 3",
    sampleOutput: "11",
    testCases: [
      { input: "2 3 -8 7 -1 2 3", output: "11", isHidden: false },
      { input: "-2 -4", output: "-2", isHidden: false },
      { input: "5 4 1 7 8", output: "25", isHidden: true }
    ]
  },
  "Kadane's Algorithm": {
    sampleInput: "2 3 -8 7 -1 2 3",
    sampleOutput: "11",
    testCases: [
      { input: "2 3 -8 7 -1 2 3", output: "11", isHidden: false },
      { input: "-2 -4", output: "-2", isHidden: false },
      { input: "5 4 1 7 8", output: "25", isHidden: true }
    ]
  },
  "Next Permutation": {
    sampleInput: "2 4 1 7 5 0",
    sampleOutput: "2 4 5 0 1 7",
    testCases: [
      { input: "2 4 1 7 5 0", output: "2 4 5 0 1 7", isHidden: false },
      { input: "3 2 1", output: "1 2 3", isHidden: false },
      { input: "3 4 2 5 1", output: "3 4 5 1 2", isHidden: true }
    ]
  },
  "Longest Repeating Character Replacement": {
    statement: `Given a string **s** of length n consisting of uppercase English letters and an integer **k**, you may perform at most k operations. In one operation, change any character in the string to any other uppercase English letter.\n\nReturn the length of the longest substring that can be transformed into a string containing only identical characters using at most k operations.`,
    inputFormat: `The first line contains the uppercase string s.\nThe second line contains the integer k.`,
    outputFormat: `Print the maximum possible length of a uniform-character substring.`,
    constraints: `1 <= n, k <= 10^5\ns contains uppercase English letters only.`,
    sampleInput: "ABBA\n2",
    sampleOutput: "4",
    testCases: [
      { input: "ABBA\n2", output: "4", isHidden: false },
      { input: "ADBD\n1", output: "3", isHidden: false },
      { input: "AABABBA\n1", output: "4", isHidden: true },
      { input: "AAAA\n1", output: "4", isHidden: true }
    ]
  },
  "Smallest Window in a String Containing all the Characters of Another String": {
    statement: `Given two strings **s** and **t**, return the minimum window substring of s that contains every character in t, including duplicate characters. If no such substring exists, return the empty string.\n\nThe test cases guarantee that the answer, when it exists, is unique.`,
    inputFormat: `The first line contains s.\nThe second line contains t.`,
    outputFormat: `Print the minimum window substring, or an empty line if no valid window exists.`,
    constraints: `1 <= s.length, t.length <= 10^5\ns and t contain uppercase and lowercase English letters.`,
    sampleInput: "ADOBECODEBANC\nABC",
    sampleOutput: "BANC",
    testCases: [
      { input: "ADOBECODEBANC\nABC", output: "BANC", isHidden: false },
      { input: "a\na", output: "a", isHidden: false },
      { input: "a\naa", output: "", isHidden: false },
      { input: "aa\naa", output: "aa", isHidden: true },
      { input: "ab\nb", output: "b", isHidden: true }
    ]
  },
  "Valid Anagram": {
    sampleInput: "geeks\nkseeg",
    sampleOutput: "true",
    testCases: [
      { input: "geeks\nkseeg", output: "true", isHidden: false },
      { input: "allergy\nallergyy", output: "false", isHidden: false },
      { input: "listen\nlists", output: "false", isHidden: true }
    ]
  },
  "Anagram": {
    sampleInput: "geeks\nkseeg",
    sampleOutput: "true",
    testCases: [
      { input: "geeks\nkseeg", output: "true", isHidden: false },
      { input: "allergy\nallergyy", output: "false", isHidden: false },
      { input: "listen\nlists", output: "false", isHidden: true }
    ]
  },
  "Valid Palindrome": {
    sampleInput: "A man, a plan, a canal: Panama",
    sampleOutput: "true",
    testCases: [
      { input: "A man, a plan, a canal: Panama", output: "true", isHidden: false },
      { input: "race a car", output: "false", isHidden: false },
      { input: " ", output: "true", isHidden: true }
    ]
  },
  "Transform One String to Another using Minimum Number of Given Operation": {
    sampleInput: "abd\nbad",
    sampleOutput: "1",
    testCases: [
      { input: "abd\nbad", output: "1", isHidden: false },
      { input: "GeeksForGeeks\nForGeeksGeeks", output: "3", isHidden: false },
      { input: "abc\ndef", output: "-1", isHidden: true }
    ]
  },
  "Transform String": {
    sampleInput: "abd\nbad",
    sampleOutput: "1",
    testCases: [
      { input: "abd\nbad", output: "1", isHidden: false },
      { input: "GeeksForGeeks\nForGeeksGeeks", output: "3", isHidden: false },
      { input: "abc\ndef", output: "-1", isHidden: true }
    ]
  },
  "Palindromic Substrings": {
    sampleInput: "abc",
    sampleOutput: "3",
    testCases: [
      { input: "abc", output: "3", isHidden: false },
      { input: "aaa", output: "6", isHidden: false },
      { input: "a", output: "1", isHidden: true }
    ]
  },
  "Longest Palindromic Substring": {
    sampleInput: "forgeeksskeegfor",
    sampleOutput: "geeksskeeg",
    testCases: [
      { input: "forgeeksskeegfor", output: "geeksskeeg", isHidden: false },
      { input: "abacac", output: "aba", isHidden: false },
      { input: "geeks", output: "ee", isHidden: true }
    ]
  },
  "Group Anagrams": {
    sampleInput: "eat tea tan ate nat bat",
    sampleOutput: "bat\nnat tan\nate eat tea",
    testCases: [
      { input: "eat tea tan ate nat bat", output: "bat\nnat tan\nate eat tea", isHidden: false },
      { input: "a", output: "a", isHidden: false },
      { input: "abc cba bca cab", output: "abc bca cab cba", isHidden: true }
    ]
  },
  "Word Wrap": {
    sampleInput: "3 2 2 5\n6",
    sampleOutput: "10",
    testCases: [
      { input: "3 2 2 5\n6", output: "10", isHidden: false },
      { input: "3 2 2\n4", output: "5", isHidden: false },
      { input: "4 3\n6", output: "0", isHidden: true }
    ]
  },
  "Rabin-Karp Algorithm for Pattern Searching": {
    statement: `Given two strings: a text string in which you want to search, and a pattern string that you are looking for within the text. Return all positions (0-based indexing) where the pattern occurs as a substring in the text. If the pattern does not occur, return an empty list.\n\n![Rabin-Karp pattern matching example](/rabin-karp-pattern-search.png)\n\nUse the Rabin-Karp rolling-hash technique. Verify matching hash windows character by character to avoid collisions.`,
    inputFormat: `The first line contains the text string.\nThe second line contains the pattern string.`,
    outputFormat: `Print the 0-based starting indices in the format [i, j, ...]. Print [] when there are no matches.`,
    constraints: `1 <= text.length <= 10^5\n1 <= pattern.length <= text.length\nBoth strings contain lowercase English letters.`,
    sampleInput: "geeksforgeeks\ngeek",
    sampleOutput: "[0, 8]",
    testCases: [
      { input: "geeksforgeeks\ngeek", output: "[0, 8]", isHidden: false },
      { input: "aabaacaadaabaaba\naaba", output: "[0, 9, 12]", isHidden: false },
      { input: "aaaaa\naa", output: "[0, 1, 2, 3]", isHidden: true },
      { input: "abcdef\ngh", output: "[]", isHidden: true }
    ]
  },
  "Count Palindromic Subsequences": {
    statement: `Given a string **s**, find the number of palindromic subsequences present in s. Subsequences do not need to be distinct: occurrences chosen from different positions are counted separately.`,
    inputFormat: `A single line containing the string s.`,
    outputFormat: `Print the total number of palindromic subsequences.`,
    constraints: `1 <= s.length <= 30\ns contains lowercase English letters.`,
    sampleInput: "abcd",
    sampleOutput: "4",
    testCases: [
      { input: "abcd", output: "4", isHidden: false },
      { input: "aab", output: "4", isHidden: false },
      { input: "b", output: "1", isHidden: false },
      { input: "aaa", output: "7", isHidden: true },
      { input: "aba", output: "5", isHidden: true }
    ]
  },
  "Valid Parentheses": {
    statement: `Given a string **s** containing only the characters \`(\`, \`)\`, \`{\`, \`}\`, \`[\`, and \`]\`, determine whether the input string is valid.\n\nAn input string is valid when:\n\n- Open brackets are closed by the same type of brackets.\n- Open brackets are closed in the correct order.\n- Every closing bracket has a corresponding opening bracket of the same type.`,
    inputFormat: `A single line containing the bracket string s.`,
    outputFormat: `Print true if the string is valid; otherwise print false.`,
    constraints: `1 <= s.length <= 10^5\ns contains only (), {}, and [] bracket characters.`,
    sampleInput: "()[]{}",
    sampleOutput: "true",
    testCases: [
      { input: "()", output: "true", isHidden: false },
      { input: "()[]{}", output: "true", isHidden: false },
      { input: "(]", output: "false", isHidden: false },
      { input: "([])", output: "true", isHidden: false },
      { input: "([)]", output: "false", isHidden: true }
    ]
  },
  "Wildcard String Matching": {
    statement: `Given an input string **s** and a pattern **p**, implement wildcard pattern matching with support for \`?\` and \`*\`.\n\n- \`?\` matches any single character.\n- \`*\` matches any sequence of characters, including the empty sequence.\n\nThe match must cover the **entire** input string, not only a substring. Return \`true\` if \`p\` matches \`s\`; otherwise return \`false\`.`,
    inputFormat: `The first line contains the string s.\nThe second line contains the pattern p.`,
    outputFormat: `Print true if the entire string matches the pattern; otherwise print false.`,
    constraints: `0 <= s.length, p.length <= 2000\ns contains lowercase English letters only.\np contains lowercase English letters, ? or *.`,
    sampleInput: "aa\na",
    sampleOutput: "false",
    testCases: [
      { input: "aa\na", output: "false", isHidden: false },
      { input: "aa\n*", output: "true", isHidden: false },
      { input: "cb\n?a", output: "false", isHidden: false },
      { input: "adceb\n*a*b", output: "true", isHidden: true },
      { input: "acdcb\na*c?b", output: "false", isHidden: true }
    ]
  },
  "Print all the Duplicates in the Input String": {
    sampleInput: "geeksforgeeks",
    sampleOutput: "['e', 4], ['g', 2], ['k', 2], ['s', 2]",
    testCases: [
      { input: "geeksforgeeks", output: "['e', 4], ['g', 2], ['k', 2], ['s', 2]", isHidden: false },
      { input: "programming", output: "['r', 2], ['g', 2], ['m', 2]", isHidden: false },
      { input: "mississippi", output: "['i', 4], ['s', 4], ['p', 2]", isHidden: true }
    ]
  },
  "Boyer Moore Algorithm for Pattern Searching": {
    sampleInput: "THIS IS A TEST TEXT\nTEST",
    sampleOutput: "Pattern found at index 10",
    testCases: [
      { input: "THIS IS A TEST TEXT\nTEST", output: "Pattern found at index 10", isHidden: false },
      { input: "AABAACAADAABAABA\nAABA", output: "Pattern found at index 0\nPattern found at index 9\nPattern found at index 12", isHidden: false },
      { input: "aaaaa\naa", output: "Pattern found at index 0\nPattern found at index 1\nPattern found at index 2\nPattern found at index 3", isHidden: true }
    ]
  },
  "Convert a Sentence into its Equivalent Mobile Numeric Keypad Sequence": {
    statement: "Given a sentence in the form of a string in uppercase, convert it into its equivalent mobile numeric keypad sequence. Please note there might be spaces in between the words in a sentence and we can print spaces by pressing 0.\n\n![Mobile Keypad](/keypad.png)",
    inputFormat: "A single string representing the uppercase sentence.",
    outputFormat: "A string of digits representing the equivalent mobile numeric keypad sequence.",
    constraints: "1 <= length of string <= 10^5\nString consists of uppercase English letters and spaces.",
    sampleInput: "GFG",
    sampleOutput: "43334",
    testCases: [
      { input: "GFG", output: "43334", isHidden: false },
      { input: "HEY U", output: "443339999088", isHidden: false },
      { input: "HELLO WORLD", output: "4433555555666096667775553", isHidden: true }
    ]
  },
  "Remove Consecutive Characters": {
    sampleInput: "aaaaabbbbbb",
    sampleOutput: "ab",
    testCases: [
      { input: "aaaaabbbbbb", output: "ab", isHidden: false },
      { input: "geeksforgeeks", output: "geksforgeks", isHidden: false },
      { input: "aabccba", output: "abcba", isHidden: true }
    ]
  },
  "Longest Common Prefix": {
    sampleInput: "geeksforgeeks geeks geek geezer",
    sampleOutput: "gee",
    testCases: [
      { input: "geeksforgeeks geeks geek geezer", output: "gee", isHidden: false },
      { input: "hello world", output: "", isHidden: false },
      { input: "apple ape april", output: "ap", isHidden: true }
    ]
  },
  "Longest Substring Without Repeating Characters": {
    sampleInput: "geeksforgeeks",
    sampleOutput: "7",
    testCases: [
      { input: "geeksforgeeks", output: "7", isHidden: false },
      { input: "aaa", output: "1", isHidden: false },
      { input: "abcdefabcbb", output: "6", isHidden: true }
    ]
  },
  "Longest substring with distinct characters": {
    sampleInput: "geeksforgeeks",
    sampleOutput: "7",
    testCases: [
      { input: "geeksforgeeks", output: "7", isHidden: false },
      { input: "aaa", output: "1", isHidden: false },
      { input: "abcdefabcbb", output: "6", isHidden: true }
    ]
  },
  "Longest Prefix Suffix": {
    statement: `Given a lowercase English string **s**, find the length of the longest proper prefix that is also a suffix of s.\n\nA prefix and suffix may overlap, but they must not be equal to the entire string.`,
    inputFormat: `A single line containing the string s.`,
    outputFormat: `Print the length of the longest proper prefix that is also a suffix.`,
    constraints: `1 <= s.length <= 10^6\ns contains lowercase English letters only.`,
    sampleInput: "abab",
    sampleOutput: "2",
    testCases: [
      { input: "abab", output: "2", isHidden: false },
      { input: "aabcdaabc", output: "4", isHidden: false },
      { input: "aaaa", output: "3", isHidden: false },
      { input: "abcab", output: "2", isHidden: true },
      { input: "abcdef", output: "0", isHidden: true }
    ]
  },
  "String Compression": {
    statement: `Given an array of characters **chars**, compress it in-place. For every consecutive group of equal characters, write the character once; if the group length is greater than 1, write the decimal digits of its length after the character. Return the new length.\n\nThe first returned-length characters of chars must contain the compressed string. Group lengths of 10 or more are written as separate digits. Use only constant extra space.`,
    inputFormat: `A single line containing the character sequence without commas or quotes. For example, aabbccc represents ["a", "a", "b", "b", "c", "c", "c"].`,
    outputFormat: `Print the new compressed length.`,
    constraints: `1 <= chars.length <= 2000\nEach character is a lowercase letter, uppercase letter, digit, or symbol.`,
    sampleInput: "aabbccc",
    sampleOutput: "6",
    testCases: [
      { input: "aabbccc", output: "6", isHidden: false },
      { input: "a", output: "1", isHidden: false },
      { input: "abbbbbbbbbbbbb", output: "4", isHidden: false },
      { input: "aaaaaaaaaa", output: "3", isHidden: true }
    ]
  }
};

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function generateBoilerplates(title: string) {
  const methodName = slugify(title).replace(/-([a-z])/g, (g) => g[1].toUpperCase());

  if (title === "Two Sum") {
    return [
      {
        language: 'python',
        code: `import sys\n\ndef ${methodName}(nums, target):\n    # Write your logic here\n    # Return a list of two indices [i, j]\n    return []\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    nums = list(map(int, lines[0].split()))\n    target = int(lines[1])\n    result = ${methodName}(nums, target)\n    print(" ".join(map(str, result)))\n\nif __name__ == "__main__":\n    solve()`
      },
      {
        language: 'javascript',
        code: `// Solution for ${title}\nconst fs = require('fs');\n\nfunction ${methodName}(nums, target) {\n    // Write your logic here\n    // Return an array of two indices [i, j]\n    return [];\n}\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    if (!input) return;\n    const lines = input.split(/\\r?\\n/);\n    const nums = lines[0].trim().split(/\\s+/).map(Number);\n    const target = parseInt(lines[1].trim());\n    const result = ${methodName}(nums, target);\n    console.log(result.join(' '));\n}\nsolve();`
      },
      {
        language: 'cpp',
        code: `// Solution for ${title}\n#include <iostream>\n#include <vector>\n#include <sstream>\n#include <unordered_map>\nusing namespace std;\n\nvector<int> ${methodName}(vector<int>& nums, int target) {\n    // Write your logic here\n    // Return a vector of two indices {i, j}\n    return {};\n}\n\nint main() {\n    string line;\n    if (getline(cin, line)) {\n        stringstream ss(line);\n        int val;\n        vector<int> nums;\n        while (ss >> val) nums.push_back(val);\n        int target;\n        if (cin >> target) {\n            vector<int> result = ${methodName}(nums, target);\n            if (result.size() == 2) {\n                cout << result[0] << " " << result[1] << endl;\n            }\n        }\n    }\n    return 0;\n}`
      },
      {
        language: 'java',
        code: `// Solution for ${title}\nimport java.util.*;\nimport java.io.*;\n\nclass Main {\n    public static int[] ${methodName}(int[] nums, int target) {\n        // Write your logic here\n        // Return an array of two indices [i, j]\n        return new int[] {};\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String line = br.readLine();\n        if (line == null) return;\n        String[] parts = line.trim().split("\\\\s+");\n        int[] nums = new int[parts.length];\n        for (int i = 0; i < parts.length; i++) {\n            nums[i] = Integer.parseInt(parts[i]);\n        }\n        String targetLine = br.readLine();\n        if (targetLine == null) return;\n        int target = Integer.parseInt(targetLine.trim());\n        int[] result = ${methodName}(nums, target);\n        if (result.length == 2) {\n            System.out.println(result[0] + " " + result[1]);\n        }\n    }\n}`
      }
    ];
  }

  if (title === "Maximum Subarray (Kadane's Algorithm)" || title === "Maximum Subarray") {
    return [
      {
        language: 'python',
        code: `import sys\n\ndef ${methodName}(nums):\n    # Write your logic here\n    # Process 'nums' and return max subarray sum\n    return 0\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    nums = list(map(int, lines[0].split()))\n    print(${methodName}(nums))\n\nif __name__ == "__main__":\n    solve()`
      },
      {
        language: 'javascript',
        code: `// Solution for ${title}\nconst fs = require('fs');\n\nfunction ${methodName}(nums) {\n    // Write your logic here\n    // Process 'nums' and return max subarray sum\n    return 0;\n}\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    if (!input) return;\n    const nums = input.split(/\\s+/).map(Number);\n    console.log(${methodName}(nums));\n}\nsolve();`
      },
      {
        language: 'cpp',
        code: `// Solution for ${title}\n#include <iostream>\n#include <vector>\n#include <sstream>\n#include <algorithm>\nusing namespace std;\n\nint ${methodName}(vector<int>& nums) {\n    // Write your logic here\n    // Process 'nums' and return max subarray sum\n    return 0;\n}\n\nint main() {\n    string line;\n    if (getline(cin, line)) {\n        stringstream ss(line);\n        int val;\n        vector<int> nums;\n        while (ss >> val) nums.push_back(val);\n        cout << ${methodName}(nums) << endl;\n    }\n    return 0;\n}`
      },
      {
        language: 'java',
        code: `// Solution for ${title}\nimport java.util.*;\nimport java.io.*;\n\nclass Main {\n    public static int ${methodName}(int[] nums) {\n        // Write your logic here\n        // Process 'nums' and return max subarray sum\n        return 0;\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String line = br.readLine();\n        if (line == null) return;\n        String[] parts = line.trim().split("\\\\s+");\n        int[] nums = new int[parts.length];\n        for (int i = 0; i < parts.length; i++) {\n            nums[i] = Integer.parseInt(parts[i]);\n        }\n        System.out.println(${methodName}(nums));\n    }\n}`
      }
    ];
  }

  if (title === "Contains Duplicate") {
    return [
      {
        language: 'python',
        code: `import sys\n\ndef ${methodName}(nums):\n    # Write your logic here\n    # Process 'nums' and return True or False\n    return False\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    nums = list(map(int, lines[0].split()))\n    print(str(${methodName}(nums)).lower())\n\nif __name__ == "__main__":\n    solve()`
      },
      {
        language: 'javascript',
        code: `// Solution for ${title}\nconst fs = require('fs');\n\nfunction ${methodName}(nums) {\n    // Write your logic here\n    // Process 'nums' and return true or false\n    return false;\n}\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    if (!input) return;\n    const nums = input.split(/\\s+/).map(Number);\n    console.log(${methodName}(nums));\n}\nsolve();`
      },
      {
        language: 'cpp',
        code: `// Solution for ${title}\n#include <iostream>\n#include <vector>\n#include <sstream>\n#include <algorithm>\nusing namespace std;\n\nbool ${methodName}(vector<int>& nums) {\n    // Write your logic here\n    // Process 'nums' and return true or false\n    return false;\n}\n\nint main() {\n    string line;\n    if (getline(cin, line)) {\n        stringstream ss(line);\n        int val;\n        vector<int> nums;\n        while (ss >> val) nums.push_back(val);\n        cout << (${methodName}(nums) ? "true" : "false") << endl;\n    }\n    return 0;\n}`
      },
      {
        language: 'java',
        code: `// Solution for ${title}\nimport java.util.*;\nimport java.io.*;\n\nclass Main {\n    public static boolean ${methodName}(int[] nums) {\n        // Write your logic here\n        // Process 'nums' and return true or false\n        return false;\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String line = br.readLine();\n        if (line == null) return;\n        String[] parts = line.trim().split("\\\\s+");\n        int[] nums = new int[parts.length];\n        for (int i = 0; i < parts.length; i++) {\n            nums[i] = Integer.parseInt(parts[i]);\n        }\n        System.out.println(${methodName}(nums) ? "true" : "false");\n    }\n}`
      }
    ];
  }

  const titleLower = title.toLowerCase();
  if (titleLower.includes("mutable range sum") || titleLower.includes("range sum query")) {
    return [
      {
        language: 'python',
        code: `import sys

class NumArray:
    def __init__(self, nums):
        self.nums = nums[:]

    def update(self, index, val):
        # Update nums[index] to val.
        self.nums[index] = val

    def sumRange(self, left, right):
        # Return the inclusive range sum.
        return sum(self.nums[left:right + 1])

def solve():
    lines = sys.stdin.read().splitlines()
    if len(lines) < 2:
        return
    num_array = NumArray(list(map(int, lines[0].split())))
    q = int(lines[1])
    output = []
    for line in lines[2:2 + q]:
        op, *args = line.split()
        if op == "update":
            num_array.update(int(args[0]), int(args[1]))
        else:
            output.append(str(num_array.sumRange(int(args[0]), int(args[1]))))
    print("\\n".join(output))

if __name__ == "__main__":
    solve()`
      },
      {
        language: 'javascript',
        code: `const fs = require('fs');

class NumArray {
    constructor(nums) {
        this.nums = [...nums];
    }

    update(index, val) {
        // Update nums[index] to val.
        this.nums[index] = val;
    }

    sumRange(left, right) {
        // Return the inclusive range sum.
        let sum = 0;
        for (let i = left; i <= right; i++) sum += this.nums[i];
        return sum;
    }
}

function solve() {
    const lines = fs.readFileSync(0, 'utf8').trimEnd().split(/\\r?\\n/);
    if (lines.length < 2) return;
    const numArray = new NumArray(lines[0].trim().split(/\\s+/).map(Number));
    const q = Number(lines[1]);
    const output = [];
    for (let i = 0; i < q; i++) {
        const [op, a, b] = lines[i + 2].trim().split(/\\s+/);
        if (op === 'update') numArray.update(Number(a), Number(b));
        else output.push(String(numArray.sumRange(Number(a), Number(b))));
    }
    console.log(output.join('\\n'));
}

solve();`
      },
      {
        language: 'cpp',
        code: `#include <iostream>
#include <sstream>
#include <string>
#include <vector>
using namespace std;

class NumArray {
    vector<int> nums;
public:
    NumArray(vector<int> values) : nums(values) {}

    void update(int index, int val) {
        // Update nums[index] to val.
        nums[index] = val;
    }

    int sumRange(int left, int right) {
        // Return the inclusive range sum.
        int sum = 0;
        for (int i = left; i <= right; i++) sum += nums[i];
        return sum;
    }
};

int main() {
    string line;
    if (!getline(cin, line)) return 0;
    stringstream values(line);
    vector<int> nums;
    int value;
    while (values >> value) nums.push_back(value);
    NumArray numArray(nums);
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        string op;
        int a, b;
        cin >> op >> a >> b;
        if (op == "update") numArray.update(a, b);
        else cout << numArray.sumRange(a, b) << '\\n';
    }
    return 0;
}`
      },
      {
        language: 'java',
        code: `import java.io.*;
import java.util.*;

class NumArray {
    private final int[] nums;

    NumArray(int[] nums) {
        this.nums = nums.clone();
    }

    void update(int index, int val) {
        // Update nums[index] to val.
        nums[index] = val;
    }

    int sumRange(int left, int right) {
        // Return the inclusive range sum.
        int sum = 0;
        for (int i = left; i <= right; i++) sum += nums[i];
        return sum;
    }
}

class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String firstLine = br.readLine();
        if (firstLine == null || firstLine.trim().isEmpty()) return;
        String[] parts = firstLine.trim().split("\\\\s+");
        int[] nums = new int[parts.length];
        for (int i = 0; i < parts.length; i++) nums[i] = Integer.parseInt(parts[i]);
        NumArray numArray = new NumArray(nums);
        int q = Integer.parseInt(br.readLine().trim());
        StringBuilder output = new StringBuilder();
        for (int i = 0; i < q; i++) {
            String[] op = br.readLine().trim().split("\\\\s+");
            int a = Integer.parseInt(op[1]);
            int b = Integer.parseInt(op[2]);
            if (op[0].equals("update")) numArray.update(a, b);
            else output.append(numArray.sumRange(a, b)).append('\\n');
        }
        System.out.print(output);
    }
}`
      }
    ];
  }

  if (titleLower.includes("rotate array") || 
      titleLower.includes("rotation of elements of array") || 
      titleLower.includes("circular rotation of an array")) {
    return [
      {
        language: 'python',
        code: `import sys\n\ndef ${methodName}(arr, d):\n    # Write your logic here\n    # Modify arr in-place or return the rotated array\n    n = len(arr)\n    if n == 0:\n        return arr\n    d = d % n\n    arr[:] = arr[d:] + arr[:d]\n    return arr\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    arr = list(map(int, lines[0].split()))\n    d = int(lines[1])\n    res = ${methodName}(arr, d)\n    print(" ".join(map(str, res)))\n\nif __name__ == "__main__":\n    solve()`
      },
      {
        language: 'javascript',
        code: `// Solution for ${title}\nconst fs = require('fs');\n\nfunction ${methodName}(arr, d) {\n    // Write your logic here\n    // Modify arr in-place or return the rotated array\n    const n = arr.length;\n    if (n === 0) return arr;\n    d = d % n;\n    const temp = arr.slice(d).concat(arr.slice(0, d));\n    for (let i = 0; i < n; i++) {\n        arr[i] = temp[i];\n    }\n    return arr;\n}\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    if (!input) return;\n    const lines = input.split(/\\r?\\n/);\n    const arr = lines[0].trim().split(/\\s+/).map(Number);\n    const d = parseInt(lines[1].trim());\n    const res = ${methodName}(arr, d);\n    console.log(res.join(' '));\n}\nsolve();`
      },
      {
        language: 'cpp',
        code: `// Solution for ${title}\n#include <iostream>\n#include <vector>\n#include <sstream>\n#include <algorithm>\nusing namespace std;\n\nvoid ${methodName}(vector<int>& arr, int d) {\n    // Write your logic here\n    int n = arr.size();\n    if (n == 0) return;\n    d = d % n;\n    rotate(arr.begin(), arr.begin() + d, arr.end());\n}\n\nint main() {\n    string line;\n    if (getline(cin, line)) {\n        stringstream ss(line);\n        int val;\n        vector<int> arr;\n        while (ss >> val) arr.push_back(val);\n        int d;\n        if (cin >> d) {\n            ${methodName}(arr, d);\n            for (size_t i = 0; i < arr.size(); i++) {\n                cout << arr[i] << (i == arr.size() - 1 ? "" : " ");\n            }\n            cout << endl;\n        }\n    }\n    return 0;\n}`
      },
      {
        language: 'java',
        code: `// Solution for ${title}\nimport java.util.*;\nimport java.io.*;\n\nclass Main {\n    public static void ${methodName}(int[] arr, int d) {\n        // Write your logic here\n        int n = arr.length;\n        if (n == 0) return;\n        d = d % n;\n        int[] temp = new int[n];\n        for (int i = 0; i < n; i++) {\n            temp[i] = arr[(i + d) % n];\n        }\n        System.arraycopy(temp, 0, arr, 0, n);\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String line = br.readLine();\n        if (line == null) return;\n        String[] parts = line.trim().split("\\\\s+");\n        int[] arr = new int[parts.length];\n        for (int i = 0; i < parts.length; i++) {\n            arr[i] = Integer.parseInt(parts[i]);\n        }\n        String dLine = br.readLine();\n        if (dLine == null) return;\n        int d = Integer.parseInt(dLine.trim());\n        ${methodName}(arr, d);\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < arr.length; i++) {\n            sb.append(arr[i]).append(i == arr.length - 1 ? "" : " ");\n        }\n        System.out.println(sb.toString());\n    }\n}`
      }
    ];
  }

  if (titleLower.includes("pair sum in") || 
      titleLower.includes("pair with sum in sorted") || 
      titleLower.includes("given sum pair") || 
      titleLower.includes("pair with given sum")) {
    return [
      {
        language: 'python',
        code: `import sys\n\ndef ${methodName}(arr, target):\n    # Write your logic here\n    # Return True or False\n    return False\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    arr = list(map(int, lines[0].split()))\n    target = int(lines[1])\n    print(str(${methodName}(arr, target)).lower())\n\nif __name__ == "__main__":\n    solve()`
      },
      {
        language: 'javascript',
        code: `// Solution for ${title}\nconst fs = require('fs');\n\nfunction ${methodName}(arr, target) {\n    // Write your logic here\n    // Return true or false\n    return false;\n}\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    if (!input) return;\n    const lines = input.split(/\\r?\\n/);\n    const arr = lines[0].trim().split(/\\s+/).map(Number);\n    const target = parseInt(lines[1].trim());\n    console.log(${methodName}(arr, target));\n}\nsolve();`
      },
      {
        language: 'cpp',
        code: `// Solution for ${title}\n#include <iostream>\n#include <vector>\n#include <sstream>\n#include <algorithm>\nusing namespace std;\n\nbool ${methodName}(vector<int>& arr, int target) {\n    // Write your logic here\n    // Return true or false\n    return false;\n}\n\nint main() {\n    string line;\n    if (getline(cin, line)) {\n        stringstream ss(line);\n        int val;\n        vector<int> arr;\n        while (ss >> val) arr.push_back(val);\n        int target;\n        if (cin >> target) {\n            cout << (${methodName}(arr, target) ? "true" : "false") << endl;\n        }\n    }\n    return 0;\n}`
      },
      {
        language: 'java',
        code: `// Solution for ${title}\nimport java.util.*;\nimport java.io.*;\n\nclass Main {\n    public static boolean ${methodName}(int[] arr, int target) {\n        // Write your logic here\n        // Return true or false\n        return false;\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String line = br.readLine();\n        if (line == null) return;\n        String[] parts = line.trim().split("\\\\s+");\n        int[] arr = new int[parts.length];\n        for (int i = 0; i < parts.length; i++) {\n            arr[i] = Integer.parseInt(parts[i]);\n        }\n        String targetLine = br.readLine();\n        if (targetLine == null) return;\n        int target = Integer.parseInt(targetLine.trim());\n        System.out.println(${methodName}(arr, target) ? "true" : "false");\n    }\n}`
      }
    ];
  }

  if (title === "Chocolate Distribution Problem" || titleLower.includes("word wrap")) {
    return [
      {
        language: 'python',
        code: `import sys\n\ndef ${methodName}(arr, m):\n    # Write your logic here\n    # Return the minimum possible difference\n    return 0\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    arr = list(map(int, lines[0].split()))\n    m = int(lines[1])\n    print(${methodName}(arr, m))\n\nif __name__ == "__main__":\n    solve()`
      },
      {
        language: 'javascript',
        code: `// Solution for ${title}\nconst fs = require('fs');\n\nfunction ${methodName}(arr, m) {\n    // Write your logic here\n    // Return the minimum possible difference\n    return 0;\n}\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    if (!input) return;\n    const lines = input.split(/\\r?\\n/);\n    const arr = lines[0].trim().split(/\\s+/).map(Number);\n    const m = parseInt(lines[1].trim());\n    console.log(${methodName}(arr, m));\n}\nsolve();`
      },
      {
        language: 'cpp',
        code: `// Solution for ${title}\n#include <iostream>\n#include <vector>\n#include <sstream>\n#include <algorithm>\nusing namespace std;\n\nint ${methodName}(vector<int>& arr, int m) {\n    // Write your logic here\n    // Return the minimum possible difference\n    return 0;\n}\n\nint main() {\n    string line;\n    if (getline(cin, line)) {\n        stringstream ss(line);\n        int val;\n        vector<int> arr;\n        while (ss >> val) arr.push_back(val);\n        int m;\n        if (cin >> m) {\n            cout << ${methodName}(arr, m) << endl;\n        }\n    }\n    return 0;\n}`
      },
      {
        language: 'java',
        code: `// Solution for ${title}\nimport java.util.*;\nimport java.io.*;\n\nclass Main {\n    public static int ${methodName}(int[] arr, int m) {\n        // Write your logic here\n        // Return the minimum possible difference\n        return 0;\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String line = br.readLine();\n        if (line == null) return;\n        String[] parts = line.trim().split("\\\\s+");\n        int[] arr = new int[parts.length];\n        for (int i = 0; i < parts.length; i++) {\n            arr[i] = Integer.parseInt(parts[i]);\n        }\n        String mLine = br.readLine();\n        if (mLine == null) return;\n        int m = Integer.parseInt(mLine.trim());\n        System.out.println(${methodName}(arr, m));\n    }\n}`
      }
    ];
  }

  if (titleLower.includes("reverse the array") || titleLower.includes("reverse a given array") || titleLower.includes("next permutation")) {
    return [
      {
        language: 'python',
        code: `import sys\n\ndef ${methodName}(arr):\n    # Write your logic here\n    # Modify arr in-place\n    return arr\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    arr = list(map(int, lines[0].split()))\n    result = ${methodName}(arr)\n    print(" ".join(map(str, result)))\n\nif __name__ == "__main__":\n    solve()`
      },
      {
        language: 'javascript',
        code: `// Solution for ${title}\nconst fs = require('fs');\n\nfunction ${methodName}(arr) {\n    // Write your logic here\n    // Modify arr in-place\n    return arr;\n}\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    if (!input) return;\n    const arr = input.split(/\\s+/).map(Number);\n    const result = ${methodName}(arr);\n    console.log(result.join(' '));\n}\nsolve();`
      },
      {
        language: 'cpp',
        code: `// Solution for ${title}\n#include <iostream>\n#include <vector>\n#include <sstream>\n#include <algorithm>\nusing namespace std;\n\nvoid ${methodName}(vector<int>& arr) {\n    // Write your logic here\n}\n\nint main() {\n    string line;\n    if (getline(cin, line)) {\n        stringstream ss(line);\n        int val;\n        vector<int> arr;\n        while (ss >> val) arr.push_back(val);\n        ${methodName}(arr);\n        for (size_t i = 0; i < arr.size(); i++) {\n            cout << arr[i] << (i == arr.size() - 1 ? "" : " ");\n        }\n        cout << endl;\n    }\n    return 0;\n}`
      },
      {
        language: 'java',
        code: `// Solution for ${title}\nimport java.util.*;\nimport java.io.*;\n\nclass Main {\n    public static void ${methodName}(int[] arr) {\n        // Write your logic here\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String line = br.readLine();\n        if (line == null) return;\n        String[] parts = line.trim().split("\\\\s+");\n        int[] arr = new int[parts.length];\n        for (int i = 0; i < parts.length; i++) {\n            arr[i] = Integer.parseInt(parts[i]);\n        }\n        ${methodName}(arr);\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < arr.length; i++) {\n            sb.append(arr[i]).append(i == arr.length - 1 ? "" : " ");\n        }\n        System.out.println(sb.toString());\n    }\n}`
      }
    ];
  }

  if (titleLower.includes("3sum") || titleLower.includes("three sum")) {
    return [
      {
        language: 'python',
        code: `import sys\n\ndef ${methodName}(arr):\n    # Write your logic here\n    # Return unique triplets [a, b, c] such that a + b + c == 0\n    return []\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    arr = list(map(int, lines[0].split()))\n    triplets = ${methodName}(arr)\n    for t in triplets:\n        print(" ".join(map(str, t)))\n\nif __name__ == "__main__":\n    solve()`
      },
      {
        language: 'javascript',
        code: `// Solution for ${title}\nconst fs = require('fs');\n\nfunction ${methodName}(arr) {\n    // Write your logic here\n    // Return unique triplets [a, b, c] such that a + b + c == 0\n    return [];\n}\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    if (!input) return;\n    const arr = input.split(/\\s+/).map(Number);\n    const triplets = ${methodName}(arr);\n    triplets.forEach(t => console.log(t.join(' ')));\n}\nsolve();`
      },
      {
        language: 'cpp',
        code: `// Solution for ${title}\n#include <iostream>\n#include <vector>\n#include <sstream>\n#include <algorithm>\nusing namespace std;\n\nvector<vector<int>> ${methodName}(vector<int>& arr) {\n    // Write your logic here\n    // Return unique triplets [a, b, c] such that a + b + c == 0\n    return {};\n}\n\nint main() {\n    string line;\n    if (getline(cin, line)) {\n        stringstream ss(line);\n        int val;\n        vector<int> arr;\n        while (ss >> val) arr.push_back(val);\n        vector<vector<int>> triplets = ${methodName}(arr);\n        for (const auto& t : triplets) {\n            cout << t[0] << " " << t[1] << " " << t[2] << endl;\n        }\n    }\n    return 0;\n}`
      },
      {
        language: 'java',
        code: `// Solution for ${title}\nimport java.util.*;\nimport java.io.*;\n\nclass Main {\n    public static List<List<Integer>> ${methodName}(int[] arr) {\n        // Write your logic here\n        // Return unique triplets [a, b, c] such that a + b + c == 0\n        return new ArrayList<>();\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String line = br.readLine();\n        if (line == null) return;\n        String[] parts = line.trim().split("\\\\s+");\n        int[] arr = new int[parts.length];\n        for (int i = 0; i < parts.length; i++) {\n            arr[i] = Integer.parseInt(parts[i]);\n        }\n        List<List<Integer>> triplets = ${methodName}(arr);\n        for (List<Integer> t : triplets) {\n            System.out.println(t.get(0) + " " + t.get(1) + " " + t.get(2));\n        }\n    }\n}`
      }
    ];
  }

  if (titleLower.includes("minimum in rotated sorted array") || 
      titleLower.includes("sorted and rotated minimum") || 
      titleLower.includes("maximum subarray") || 
      titleLower.includes("kadane's algorithm")) {
    return [
      {
        language: 'python',
        code: `import sys\n\ndef ${methodName}(arr):\n    # Write your logic here\n    # Return the minimum element\n    return 0\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    arr = list(map(int, lines[0].split()))\n    print(${methodName}(arr))\n\nif __name__ == "__main__":\n    solve()`
      },
      {
        language: 'javascript',
        code: `// Solution for ${title}\nconst fs = require('fs');\n\nfunction ${methodName}(arr) {\n    // Write your logic here\n    // Return the minimum element\n    return 0;\n}\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    if (!input) return;\n    const arr = input.split(/\\s+/).map(Number);\n    console.log(${methodName}(arr));\n}\nsolve();`
      },
      {
        language: 'cpp',
        code: `// Solution for ${title}\n#include <iostream>\n#include <vector>\n#include <sstream>\n#include <algorithm>\nusing namespace std;\n\nint ${methodName}(vector<int>& arr) {\n    // Write your logic here\n    // Return the minimum element\n    return 0;\n}\n\nint main() {\n    string line;\n    if (getline(cin, line)) {\n        stringstream ss(line);\n        int val;\n        vector<int> arr;\n        while (ss >> val) arr.push_back(val);\n        cout << ${methodName}(arr) << endl;\n    }\n    return 0;\n}`
      },
      {
        language: 'java',
        code: `// Solution for ${title}\nimport java.util.*;\nimport java.io.*;\n\nclass Main {\n    public static int ${methodName}(int[] arr) {\n        // Write your logic here\n        // Return the minimum element\n        return 0;\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String line = br.readLine();\n        if (line == null) return;\n        String[] parts = line.trim().split("\\\\s+");\n        int[] arr = new int[parts.length];\n        for (int i = 0; i < parts.length; i++) {\n            arr[i] = Integer.parseInt(parts[i]);\n        }\n        System.out.println(${methodName}(arr));\n    }\n}`
      }
    ];
  }

  if (titleLower.includes("subarray sum divisible k") || titleLower.includes("subarray sums divisible by k")) {
    return [
      {
        language: 'python',
        code: `import sys\n\ndef ${methodName}(nums, k):\n    # Write your logic here\n    # Return count of subarrays divisible by k\n    return 0\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    nums = list(map(int, lines[0].split()))\n    k = int(lines[1])\n    print(${methodName}(nums, k))\n\nif __name__ == "__main__":\n    solve()`
      },
      {
        language: 'javascript',
        code: `// Solution for ${title}\nconst fs = require('fs');\n\nfunction ${methodName}(nums, k) {\n    // Write your logic here\n    // Return count of subarrays divisible by k\n    return 0;\n}\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    if (!input) return;\n    const lines = input.split(/\\r?\\n/);\n    const nums = lines[0].trim().split(/\\s+/).map(Number);\n    const k = parseInt(lines[1].trim());\n    console.log(${methodName}(nums, k));\n}\nsolve();`
      },
      {
        language: 'cpp',
        code: `// Solution for ${title}\n#include <iostream>\n#include <vector>\n#include <sstream>\n#include <algorithm>\nusing namespace std;\n\nint ${methodName}(vector<int>& nums, int k) {\n    // Write your logic here\n    // Return count of subarrays divisible by k\n    return 0;\n}\n\nint main() {\n    string line;\n    if (getline(cin, line)) {\n        stringstream ss(line);\n        int val;\n        vector<int> nums;\n        while (ss >> val) nums.push_back(val);\n        int k;\n        if (cin >> k) {\n            cout << ${methodName}(nums, k) << endl;\n        }\n    }\n    return 0;\n}`
      },
      {
        language: 'java',
        code: `// Solution for ${title}\nimport java.util.*;\nimport java.io.*;\n\nclass Main {\n    public static int ${methodName}(int[] nums, int k) {\n        // Write your logic here\n        // Return count of subarrays divisible by k\n        return 0;\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String line = br.readLine();\n        if (line == null) return;\n        String[] parts = line.trim().split("\\\\s+");\n        int[] nums = new int[parts.length];\n        for (int i = 0; i < parts.length; i++) {\n            nums[i] = Integer.parseInt(parts[i]);\n        }\n        String kLine = br.readLine();\n        if (kLine == null) return;\n        int k = Integer.parseInt(kLine.trim());\n        System.out.println(${methodName}(nums, k));\n    }\n}`
      }
    ];
  }

  if (titleLower.includes("biggest number") || titleLower.includes("largest number")) {
    return [
      {
        language: 'python',
        code: `import sys\n\ndef ${methodName}(nums):\n    # Write your logic here\n    # Return the largest number as string\n    return ""\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    nums = list(map(int, lines[0].split()))\n    print(${methodName}(nums))\n\nif __name__ == "__main__":\n    solve()`
      },
      {
        language: 'javascript',
        code: `// Solution for ${title}\nconst fs = require('fs');\n\nfunction ${methodName}(nums) {\n    // Write your logic here\n    // Return the largest number as string\n    return "";\n}\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    if (!input) return;\n    const nums = input.split(/\\s+/).map(Number);\n    console.log(${methodName}(nums));\n}\nsolve();`
      },
      {
        language: 'cpp',
        code: `// Solution for ${title}\n#include <iostream>\n#include <vector>\n#include <sstream>\n#include <algorithm>\n#include <string>\nusing namespace std;\n\nstring ${methodName}(vector<int>& nums) {\n    // Write your logic here\n    // Return the largest number as string\n    return "";\n}\n\nint main() {\n    string line;\n    if (getline(cin, line)) {\n        stringstream ss(line);\n        int val;\n        vector<int> nums;\n        while (ss >> val) nums.push_back(val);\n        cout << ${methodName}(nums) << endl;\n    }\n    return 0;\n}`
      },
      {
        language: 'java',
        code: `// Solution for ${title}\nimport java.util.*;\nimport java.io.*;\n\nclass Main {\n    public static String ${methodName}(int[] nums) {\n        // Write your logic here\n        // Return the largest number as string\n        return "";\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String line = br.readLine();\n        if (line == null) return;\n        String[] parts = line.trim().split("\\\\s+");\n        int[] nums = new int[parts.length];\n        for (int i = 0; i < parts.length; i++) {\n            nums[i] = Integer.parseInt(parts[i]);\n        }\n        System.out.println(${methodName}(nums));\n    }\n}`
      }
    ];
  }

  if (titleLower.includes("repeat and missing") || titleLower.includes("missing and repeating")) {
    return [
      {
        language: 'python',
        code: `import sys\n\ndef ${methodName}(arr):\n    # Write your logic here\n    # Return a list of [repeating, missing]\n    return []\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    arr = list(map(int, lines[0].split()))\n    res = ${methodName}(arr)\n    print(" ".join(map(str, res)))\n\nif __name__ == "__main__":\n    solve()`
      },
      {
        language: 'javascript',
        code: `// Solution for ${title}\nconst fs = require('fs');\n\nfunction ${methodName}(arr) {\n    // Write your logic here\n    // Return an array of [repeating, missing]\n    return [];\n}\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    if (!input) return;\n    const arr = input.split(/\\s+/).map(Number);\n    const res = ${methodName}(arr);\n    console.log(res.join(' '));\n}\nsolve();`
      },
      {
        language: 'cpp',
        code: `// Solution for ${title}\n#include <iostream>\n#include <vector>\n#include <sstream>\n#include <algorithm>\nusing namespace std;\n\nvector<int> ${methodName}(vector<int>& arr) {\n    // Write your logic here\n    // Return a vector {repeating, missing}\n    return {};\n}\n\nint main() {\n    string line;\n    if (getline(cin, line)) {\n        stringstream ss(line);\n        int val;\n        vector<int> arr;\n        while (ss >> val) arr.push_back(val);\n        vector<int> res = ${methodName}(arr);\n        if (res.size() == 2) {\n            cout << res[0] << " " << res[1] << endl;\n        }\n    }\n    return 0;\n}`
      },
      {
        language: 'java',
        code: `// Solution for ${title}\nimport java.util.*;\nimport java.io.*;\n\nclass Main {\n    public static int[] ${methodName}(int[] arr) {\n        // Write your logic here\n        // Return an array [repeating, missing]\n        return new int[] {};\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String line = br.readLine();\n        if (line == null) return;\n        String[] parts = line.trim().split("\\\\s+");\n        int[] arr = new int[parts.length];\n        for (int i = 0; i < parts.length; i++) {\n            arr[i] = Integer.parseInt(parts[i]);\n        }\n        int[] res = ${methodName}(arr);\n        if (res.length == 2) {\n            System.out.println(res[0] + " " + res[1]);\n        }\n    }\n}`
      }
    ];
  }

  if (titleLower.includes("best time to buy and sell stock")) {
    return [
      {
        language: 'python',
        code: `import sys\n\ndef ${methodName}(prices):\n    # Write your logic here\n    # Return the maximum profit\n    return 0\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    prices = list(map(int, lines[0].split()))\n    print(${methodName}(prices))\n\nif __name__ == "__main__":\n    solve()`
      },
      {
        language: 'javascript',
        code: `// Solution for ${title}\nconst fs = require('fs');\n\nfunction ${methodName}(prices) {\n    // Write your logic here\n    // Return the maximum profit\n    return 0;\n}\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    if (!input) return;\n    const prices = input.split(/\\s+/).map(Number);\n    console.log(${methodName}(prices));\n}\nsolve();`
      },
      {
        language: 'cpp',
        code: `// Solution for ${title}\n#include <iostream>\n#include <vector>\n#include <sstream>\n#include <algorithm>\nusing namespace std;\n\nint ${methodName}(vector<int>& prices) {\n    // Write your logic here\n    // Return the maximum profit\n    return 0;\n}\n\nint main() {\n    string line;\n    if (getline(cin, line)) {\n        stringstream ss(line);\n        int val;\n        vector<int> prices;\n        while (ss >> val) prices.push_back(val);\n        cout << ${methodName}(prices) << endl;\n    }\n    return 0;\n}`
      },
      {
        language: 'java',
        code: `// Solution for ${title}\nimport java.util.*;\nimport java.io.*;\n\nclass Main {\n    public static int ${methodName}(int[] prices) {\n        // Write your logic here\n        // Return the maximum profit\n        return 0;\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String line = br.readLine();\n        if (line == null) return;\n        String[] parts = line.trim().split("\\\\s+");\n        int[] prices = new int[parts.length];\n        for (int i = 0; i < parts.length; i++) {\n            prices[i] = Integer.parseInt(parts[i]);\n        }\n        System.out.println(${methodName}(prices));\n    }\n}`
      }
    ];
  }

  if (titleLower.includes("maximum and minimum element in") || titleLower.includes("min and max in array")) {
    return [
      {
        language: 'python',
        code: `import sys\n\ndef ${methodName}(arr):\n    # Write your logic here\n    # Return a list of two elements [min, max]\n    return []\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    arr = list(map(int, lines[0].split()))\n    res = ${methodName}(arr)\n    print(" ".join(map(str, res)))\n\nif __name__ == "__main__":\n    solve()`
      },
      {
        language: 'javascript',
        code: `// Solution for ${title}\nconst fs = require('fs');\n\nfunction ${methodName}(arr) {\n    // Write your logic here\n    // Return an array of two elements [min, max]\n    return [];\n}\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    if (!input) return;\n    const arr = input.split(/\\s+/).map(Number);\n    const res = ${methodName}(arr);\n    console.log(res.join(' '));\n}\nsolve();`
      },
      {
        language: 'cpp',
        code: `// Solution for ${title}\n#include <iostream>\n#include <vector>\n#include <sstream>\n#include <algorithm>\nusing namespace std;\n\nvector<int> ${methodName}(vector<int>& arr) {\n    // Write your logic here\n    // Return a vector {min, max}\n    return {};\n}\n\nint main() {\n    string line;\n    if (getline(cin, line)) {\n        stringstream ss(line);\n        int val;\n        vector<int> arr;\n        while (ss >> val) arr.push_back(val);\n        vector<int> res = ${methodName}(arr);\n        if (res.size() == 2) {\n            cout << res[0] << " " << res[1] << endl;\n        }\n    }\n    return 0;\n}`
      },
      {
        language: 'java',
        code: `// Solution for ${title}\nimport java.util.*;\nimport java.io.*;\n\nclass Main {\n    public static int[] ${methodName}(int[] arr) {\n        // Write your logic here\n        // Return an array [min, max]\n        return new int[] {};\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String line = br.readLine();\n        if (line == null) return;\n        String[] parts = line.trim().split("\\\\s+");\n        int[] arr = new int[parts.length];\n        for (int i = 0; i < parts.length; i++) {\n            arr[i] = Integer.parseInt(parts[i]);\n        }\n        int[] res = ${methodName}(arr);\n        if (res.length == 2) {\n            System.out.println(res[0] + " " + res[1]);\n        }\n    }\n}`
      }
    ];
  }

  if (titleLower.includes("string compression")) {
    return [
      { language: 'python', code: `import sys\n\ndef ${methodName}(chars):\n    # Compress chars in-place and return the new length.\n    return 0\n\nchars = list(sys.stdin.readline().rstrip('\\n'))\nprint(${methodName}(chars))` },
      { language: 'javascript', code: `const fs = require('fs');\n\nfunction ${methodName}(chars) {\n  // Compress chars in-place and return the new length.\n  return 0;\n}\n\nconst chars = [...fs.readFileSync(0, 'utf8').replace(/\\r?\\n$/, '')];\nconsole.log(${methodName}(chars));` },
      { language: 'cpp', code: `#include <iostream>\n#include <string>\n#include <vector>\nusing namespace std;\n\nint ${methodName}(vector<char>& chars) {\n    // Compress chars in-place and return the new length.\n    return 0;\n}\n\nint main() {\n    string s;\n    if (getline(cin, s)) { vector<char> chars(s.begin(), s.end()); cout << ${methodName}(chars) << '\\n'; }\n}` },
      { language: 'java', code: `import java.io.*;\n\nclass Main {\n    static int ${methodName}(char[] chars) {\n        // Compress chars in-place and return the new length.\n        return 0;\n    }\n\n    public static void main(String[] args) throws Exception {\n        String s = new BufferedReader(new InputStreamReader(System.in)).readLine();\n        if (s != null) System.out.println(${methodName}(s.toCharArray()));\n    }\n}` }
    ];
  }

  if (titleLower.includes("count palindromic subsequences")) {
    return [
      { language: 'python', code: `import sys\n\ndef ${methodName}(s):\n    # Return the number of palindromic subsequences (not necessarily distinct).\n    return 0\n\ns = sys.stdin.readline().strip()\nif s:\n    print(${methodName}(s))` },
      { language: 'javascript', code: `const fs = require('fs');\n\nfunction ${methodName}(s) {\n  // Return the number of palindromic subsequences (not necessarily distinct).\n  return 0;\n}\n\nconst s = fs.readFileSync(0, 'utf8').trim();\nif (s) console.log(${methodName}(s));` },
      { language: 'cpp', code: `#include <iostream>\n#include <string>\nusing namespace std;\n\nlong long ${methodName}(const string& s) {\n    // Return the number of palindromic subsequences (not necessarily distinct).\n    return 0;\n}\n\nint main() {\n    string s;\n    if (getline(cin, s)) cout << ${methodName}(s) << '\\n';\n}` },
      { language: 'java', code: `import java.io.*;\n\nclass Main {\n    static long ${methodName}(String s) {\n        // Return the number of palindromic subsequences (not necessarily distinct).\n        return 0;\n    }\n\n    public static void main(String[] args) throws Exception {\n        String s = new BufferedReader(new InputStreamReader(System.in)).readLine();\n        if (s != null && !s.isEmpty()) System.out.println(${methodName}(s));\n    }\n}` }
    ];
  }

  if (titleLower.includes("moves to make palindrome") || 
      titleLower.includes("merge operations to make") || 
      titleLower.includes("palindromic substrings") ||
      titleLower.includes("count palindromic subsequences") ||
      titleLower.includes("substring without repeating characters") ||
      titleLower.includes("substring with distinct characters") ||
      titleLower.includes("longest prefix suffix") ||
      titleLower.includes("string compression")) {
    return [
      {
        language: 'python',
        code: `import sys\n\ndef ${methodName}(s):\n    # Write your logic here\n    # Return the minimum number of moves\n    return 0\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    print(${methodName}(lines[0]))\n\nif __name__ == "__main__":\n    solve()`
      },
      {
        language: 'javascript',
        code: `// Solution for ${title}\nconst fs = require('fs');\n\nfunction ${methodName}(s) {\n    // Write your logic here\n    // Return the minimum number of moves\n    return 0;\n}\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    if (!input) return;\n    console.log(${methodName}(input));\n}\nsolve();`
      },
      {
        language: 'cpp',
        code: `// Solution for ${title}\n#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nint ${methodName}(string s) {\n    // Write your logic here\n    // Return the minimum number of moves\n    return 0;\n}\n\nint main() {\n    string s;\n    if (getline(cin, s)) {\n        cout << ${methodName}(s) << endl;\n    }\n    return 0;\n}`
      },
      {
        language: 'java',
        code: `// Solution for ${title}\nimport java.util.*;\nimport java.io.*;\n\nclass Main {\n    public static int ${methodName}(String s) {\n        // Write your logic here\n        // Return the minimum number of moves\n        return 0;\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String line = br.readLine();\n        if (line == null) return;\n        System.out.println(${methodName}(line.trim()));\n    }\n}`
      }
    ];
  }

  if (titleLower.includes("kth-largest") || titleLower.includes("kth largest")) {
    return [
      {
        language: 'python',
        code: `import sys\n\ndef ${methodName}(arr, k):\n    # Write your logic here\n    # Return the kth largest element\n    return 0\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    arr = list(map(int, lines[0].split()))\n    k = int(lines[1])\n    print(${methodName}(arr, k))\n\nif __name__ == "__main__":\n    solve()`
      },
      {
        language: 'javascript',
        code: `// Solution for ${title}\nconst fs = require('fs');\n\nfunction ${methodName}(arr, k) {\n    // Write your logic here\n    // Return the kth largest element\n    return 0;\n}\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    if (!input) return;\n    const lines = input.split(/\\r?\\n/);\n    const arr = lines[0].trim().split(/\\s+/).map(Number);\n    const k = parseInt(lines[1].trim());\n    console.log(${methodName}(arr, k));\n}\nsolve();`
      },
      {
        language: 'cpp',
        code: `// Solution for ${title}\n#include <iostream>\n#include <vector>\n#include <sstream>\n#include <algorithm>\nusing namespace std;\n\nint ${methodName}(vector<int>& arr, int k) {\n    // Write your logic here\n    // Return the kth largest element\n    return 0;\n}\n\nint main() {\n    string line;\n    if (getline(cin, line)) {\n        stringstream ss(line);\n        int val;\n        vector<int> arr;\n        while (ss >> val) arr.push_back(val);\n        int k;\n        if (cin >> k) {\n            cout << ${methodName}(arr, k) << endl;\n        }\n    }\n    return 0;\n}`
      },
      {
        language: 'java',
        code: `// Solution for ${title}\nimport java.util.*;\nimport java.io.*;\n\nclass Main {\n    public static int ${methodName}(int[] arr, int k) {\n        // Write your logic here\n        // Return the kth largest element\n        return 0;\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String line = br.readLine();\n        if (line == null) return;\n        String[] parts = line.trim().split("\\\\s+");\n        int[] arr = new int[parts.length];\n        for (int i = 0; i < parts.length; i++) {\n            arr[i] = Integer.parseInt(parts[i]);\n        }\n        String kLine = br.readLine();\n        if (kLine == null) return;\n        int k = Integer.parseInt(kLine.trim());\n        System.out.println(${methodName}(arr, k));\n    }\n}`
      }
    ];
  }

  if (titleLower.includes("container with most water")) {
    return [
      {
        language: 'python',
        code: `import sys\n\ndef ${methodName}(height):\n    # Write your logic here\n    # Return the maximum area of water\n    return 0\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    height = list(map(int, lines[0].split()))\n    print(${methodName}(height))\n\nif __name__ == "__main__":\n    solve()`
      },
      {
        language: 'javascript',
        code: `// Solution for ${title}\nconst fs = require('fs');\n\nfunction ${methodName}(height) {\n    // Write your logic here\n    // Return the maximum area of water\n    return 0;\n}\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    if (!input) return;\n    const height = input.split(/\\s+/).map(Number);\n    console.log(${methodName}(height));\n}\nsolve();`
      },
      {
        language: 'cpp',
        code: `// Solution for ${title}\n#include <iostream>\n#include <vector>\n#include <sstream>\n#include <algorithm>\nusing namespace std;\n\nint ${methodName}(vector<int>& height) {\n    // Write your logic here\n    // Return the maximum area of water\n    return 0;\n}\n\nint main() {\n    string line;\n    if (getline(cin, line)) {\n        stringstream ss(line);\n        int val;\n        vector<int> height;\n        while (ss >> val) height.push_back(val);\n        cout << ${methodName}(height) << endl;\n    }\n    return 0;\n}`
      },
      {
        language: 'java',
        code: `// Solution for ${title}\nimport java.util.*;\nimport java.io.*;\n\nclass Main {\n    public static int ${methodName}(int[] height) {\n        // Write your logic here\n        // Return the maximum area of water\n        return 0;\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String line = br.readLine();\n        if (line == null) return;\n        String[] parts = line.trim().split("\\\\s+");\n        int[] height = new int[parts.length];\n        for (int i = 0; i < parts.length; i++) {\n            height[i] = Integer.parseInt(parts[i]);\n        }\n        System.out.println(${methodName}(height));\n    }\n}`
      }
    ];
  }

  if (titleLower.includes("kth - smallest") || titleLower.includes("kth smallest")) {
    return [
      {
        language: 'python',
        code: `import sys\n\ndef ${methodName}(arr, k):\n    # Write your logic here\n    # Return the kth smallest element\n    return 0\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    arr = list(map(int, lines[0].split()))\n    k = int(lines[1])\n    print(${methodName}(arr, k))\n\nif __name__ == "__main__":\n    solve()`
      },
      {
        language: 'javascript',
        code: `// Solution for ${title}\nconst fs = require('fs');\n\nfunction ${methodName}(arr, k) {\n    // Write your logic here\n    // Return the kth smallest element\n    return 0;\n}\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    if (!input) return;\n    const lines = input.split(/\\r?\\n/);\n    const arr = lines[0].trim().split(/\\s+/).map(Number);\n    const k = parseInt(lines[1].trim());\n    console.log(${methodName}(arr, k));\n}\nsolve();`
      },
      {
        language: 'cpp',
        code: `// Solution for ${title}\n#include <iostream>\n#include <vector>\n#include <sstream>\n#include <algorithm>\nusing namespace std;\n\nint ${methodName}(vector<int>& arr, int k) {\n    // Write your logic here\n    // Return the kth smallest element\n    return 0;\n}\n\nint main() {\n    string line;\n    if (getline(cin, line)) {\n        stringstream ss(line);\n        int val;\n        vector<int> arr;\n        while (ss >> val) arr.push_back(val);\n        int k;\n        if (cin >> k) {\n            cout << ${methodName}(arr, k) << endl;\n        }\n    }\n    return 0;\n}`
      },
      {
        language: 'java',
        code: `// Solution for ${title}\nimport java.util.*;\nimport java.io.*;\n\nclass Main {\n    public static int ${methodName}(int[] arr, int k) {\n        // Write your logic here\n        // Return the kth smallest element\n        return 0;\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String line = br.readLine();\n        if (line == null) return;\n        String[] parts = line.trim().split("\\\\s+");\n        int[] arr = new int[parts.length];\n        for (int i = 0; i < parts.length; i++) {\n            arr[i] = Integer.parseInt(parts[i]);\n        }\n        String kLine = br.readLine();\n        if (kLine == null) return;\n        int k = Integer.parseInt(kLine.trim());\n        System.out.println(${methodName}(arr, k));\n    }\n}`
      }
    ];
  }

  if (titleLower.includes("product of array except self")) {
    return [
      {
        language: 'python',
        code: `import sys\n\ndef ${methodName}(nums):\n    # Write your logic here\n    # Return a list of integers answer\n    return []\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    nums = list(map(int, lines[0].split()))\n    res = ${methodName}(nums)\n    print(" ".join(map(str, res)))\n\nif __name__ == "__main__":\n    solve()`
      },
      {
        language: 'javascript',
        code: `// Solution for ${title}\nconst fs = require('fs');\n\nfunction ${methodName}(nums) {\n    // Write your logic here\n    // Return an array of integers answer\n    return [];\n}\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    if (!input) return;\n    const nums = input.split(/\\s+/).map(Number);\n    const res = ${methodName}(nums);\n    console.log(res.join(' '));\n}\nsolve();`
      },
      {
        language: 'cpp',
        code: `// Solution for ${title}\n#include <iostream>\n#include <vector>\n#include <sstream>\n#include <algorithm>\nusing namespace std;\n\nvector<int> ${methodName}(vector<int>& nums) {\n    // Write your logic here\n    // Return a vector of integers answer\n    return {};\n}\n\nint main() {\n    string line;\n    if (getline(cin, line)) {\n        stringstream ss(line);\n        int val;\n        vector<int> nums;\n        while (ss >> val) nums.push_back(val);\n        vector<int> res = ${methodName}(nums);\n        for (size_t i = 0; i < res.size(); i++) {\n            cout << res[i] << (i == res.size() - 1 ? "" : " ");\n        }\n        cout << endl;\n    }\n    return 0;\n}`
      },
      {
        language: 'java',
        code: `// Solution for ${title}\nimport java.util.*;\nimport java.io.*;\n\nclass Main {\n    public static int[] ${methodName}(int[] nums) {\n        // Write your logic here\n        // Return an array of integers answer\n        return new int[] {};\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String line = br.readLine();\n        if (line == null) return;\n        String[] parts = line.trim().split("\\\\s+");\n        int[] nums = new int[parts.length];\n        for (int i = 0; i < parts.length; i++) {\n            nums[i] = Integer.parseInt(parts[i]);\n        }\n        int[] res = ${methodName}(nums);\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < res.length; i++) {\n            sb.append(res[i]).append(i == res.length - 1 ? "" : " ");\n        }\n        System.out.println(sb.toString());\n    }\n}`
      }
    ];
  }

  if (titleLower.includes("combinations of r elements")) {
    return [
      {
        language: 'python',
        code: `import sys\n\ndef ${methodName}(arr, r):\n    # Write your logic here\n    # Return a list of lists representing combinations of size r\n    return []\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    arr = list(map(int, lines[0].split()))\n    r = int(lines[1])\n    combs = ${methodName}(arr, r)\n    for c in combs:\n        print(" ".join(map(str, c)))\n\nif __name__ == "__main__":\n    solve()`
      },
      {
        language: 'javascript',
        code: `// Solution for ${title}\nconst fs = require('fs');\n\nfunction ${methodName}(arr, r) {\n    // Write your logic here\n    // Return an array of arrays representing combinations of size r\n    return [];\n}\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    if (!input) return;\n    const lines = input.split(/\\r?\\n/);\n    const arr = lines[0].trim().split(/\\s+/).map(Number);\n    const r = parseInt(lines[1].trim());\n    const combs = ${methodName}(arr, r);\n    combs.forEach(c => console.log(c.join(' ')));\n}\nsolve();`
      },
      {
        language: 'cpp',
        code: `// Solution for ${title}\n#include <iostream>\n#include <vector>\n#include <sstream>\n#include <algorithm>\nusing namespace std;\n\nvector<vector<int>> ${methodName}(vector<int>& arr, int r) {\n    // Write your logic here\n    // Return a vector of vectors representing combinations of size r\n    return {};\n}\n\nint main() {\n    string line;\n    if (getline(cin, line)) {\n        stringstream ss(line);\n        int val;\n        vector<int> arr;\n        while (ss >> val) arr.push_back(val);\n        int r;\n        if (cin >> r) {\n            vector<vector<int>> combs = ${methodName}(arr, r);\n            for (const auto& c : combs) {\n                for (size_t i = 0; i < c.size(); i++) {\n                    cout << c[i] << (i == c.size() - 1 ? "" : " ");\n                }\n                cout << endl;\n            }\n        }\n    }\n    return 0;\n}`
      },
      {
        language: 'java',
        code: `// Solution for ${title}\nimport java.util.*;\nimport java.io.*;\n\nclass Main {\n    public static List<List<Integer>> ${methodName}(int[] arr, int r) {\n        // Write your logic here\n        // Return a List of Lists representing combinations of size r\n        return new ArrayList<>();\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String line = br.readLine();\n        if (line == null) return;\n        String[] parts = line.trim().split("\\\\s+");\n        int[] arr = new int[parts.length];\n        for (int i = 0; i < parts.length; i++) {\n            arr[i] = Integer.parseInt(parts[i]);\n        }\n        String rLine = br.readLine();\n        if (rLine == null) return;\n        int r = Integer.parseInt(rLine.trim());\n        List<List<Integer>> combs = ${methodName}(arr, r);\n        for (List<Integer> c : combs) {\n            StringBuilder sb = new StringBuilder();\n            for (int i = 0; i < c.size(); i++) {\n                sb.append(c.get(i)).append(i == c.size() - 1 ? "" : " ");\n            }\n            System.out.println(sb.toString());\n        }\n    }\n}`
      }
    ];
  }

  if (titleLower.includes("search in rotated sorted array")) {
    return [
      {
        language: 'python',
        code: `import sys\n\ndef ${methodName}(arr, key):\n    # Write your logic here\n    # Return the index of key or -1\n    return -1\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    arr = list(map(int, lines[0].split()))\n    key = int(lines[1])\n    print(${methodName}(arr, key))\n\nif __name__ == "__main__":\n    solve()`
      },
      {
        language: 'javascript',
        code: `// Solution for ${title}\nconst fs = require('fs');\n\nfunction ${methodName}(arr, key) {\n    // Write your logic here\n    // Return the index of key or -1\n    return -1;\n}\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    if (!input) return;\n    const lines = input.split(/\\r?\\n/);\n    const arr = lines[0].trim().split(/\\s+/).map(Number);\n    const key = parseInt(lines[1].trim());\n    console.log(${methodName}(arr, key));\n}\nsolve();`
      },
      {
        language: 'cpp',
        code: `// Solution for ${title}\n#include <iostream>\n#include <vector>\n#include <sstream>\n#include <algorithm>\nusing namespace std;\n\nint ${methodName}(vector<int>& arr, int key) {\n    // Write your logic here\n    // Return the index of key or -1\n    return -1;\n}\n\nint main() {\n    string line;\n    if (getline(cin, line)) {\n        stringstream ss(line);\n        int val;\n        vector<int> arr;\n        while (ss >> val) arr.push_back(val);\n        int key;\n        if (cin >> key) {\n            cout << ${methodName}(arr, key) << endl;\n        }\n    }\n    return 0;\n}`
      },
      {
        language: 'java',
        code: `// Solution for ${title}\nimport java.util.*;\nimport java.io.*;\n\nclass Main {\n    public static int ${methodName}(int[] arr, int key) {\n        // Write your logic here\n        // Return the index of key or -1\n        return -1;\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String line = br.readLine();\n        if (line == null) return;\n        String[] parts = line.trim().split("\\\\s+");\n        int[] arr = new int[parts.length];\n        for (int i = 0; i < parts.length; i++) {\n            arr[i] = Integer.parseInt(parts[i]);\n        }\n        String keyLine = br.readLine();\n        if (keyLine == null) return;\n        int key = Integer.parseInt(keyLine.trim());\n        System.out.println(${methodName}(arr, key));\n    }\n}`
      }
    ];
  }

  if (titleLower.includes("trapping rain water")) {
    return [
      {
        language: 'python',
        code: `import sys\n\ndef ${methodName}(arr):\n    # Write your logic here\n    # Return the amount of trapped water\n    return 0\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    arr = list(map(int, lines[0].split()))\n    print(${methodName}(arr))\n\nif __name__ == "__main__":\n    solve()`
      },
      {
        language: 'javascript',
        code: `// Solution for ${title}\nconst fs = require('fs');\n\nfunction ${methodName}(arr) {\n    // Write your logic here\n    // Return the amount of trapped water\n    return 0;\n}\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    if (!input) return;\n    const arr = input.split(/\\s+/).map(Number);\n    console.log(${methodName}(arr));\n}\nsolve();`
      },
      {
        language: 'cpp',
        code: `// Solution for ${title}\n#include <iostream>\n#include <vector>\n#include <sstream>\n#include <algorithm>\nusing namespace std;\n\nlong long ${methodName}(vector<int>& arr) {\n    // Write your logic here\n    // Return the amount of trapped water\n    return 0;\n}\n\nint main() {\n    string line;\n    if (getline(cin, line)) {\n        stringstream ss(line);\n        int val;\n        vector<int> arr;\n        while (ss >> val) arr.push_back(val);\n        cout << ${methodName}(arr) << endl;\n    }\n    return 0;\n}`
      },
      {
        language: 'java',
        code: `// Solution for ${title}\nimport java.util.*;\nimport java.io.*;\n\nclass Main {\n    public static long ${methodName}(int[] arr) {\n        // Write your logic here\n        // Return the amount of trapped water\n        return 0;\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String line = br.readLine();\n        if (line == null) return;\n        String[] parts = line.trim().split("\\\\s+");\n        int[] arr = new int[parts.length];\n        for (int i = 0; i < parts.length; i++) {\n            arr[i] = Integer.parseInt(parts[i]);\n        }\n        System.out.println(${methodName}(arr));\n    }\n}`
      }
    ];
  }

  if (titleLower.includes("maximum product subarray")) {
    return [
      {
        language: 'python',
        code: `import sys\n\ndef ${methodName}(arr):\n    # Write your logic here\n    # Return the maximum product of a subarray\n    return 0\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    arr = list(map(int, lines[0].split()))\n    print(${methodName}(arr))\n\nif __name__ == "__main__":\n    solve()`
      },
      {
        language: 'javascript',
        code: `// Solution for ${title}\nconst fs = require('fs');\n\nfunction ${methodName}(arr) {\n    // Write your logic here\n    // Return the maximum product of a subarray\n    return 0;\n}\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    if (!input) return;\n    const arr = input.split(/\\s+/).map(Number);\n    console.log(${methodName}(arr));\n}\nsolve();`
      },
      {
        language: 'cpp',
        code: `// Solution for ${title}\n#include <iostream>\n#include <vector>\n#include <sstream>\n#include <algorithm>\nusing namespace std;\n\nlong long ${methodName}(vector<int>& arr) {\n    // Write your logic here\n    // Return the maximum product of a subarray\n    return 0;\n}\n\nint main() {\n    string line;\n    if (getline(cin, line)) {\n        stringstream ss(line);\n        int val;\n        vector<int> arr;\n        while (ss >> val) arr.push_back(val);\n        cout << ${methodName}(arr) << endl;\n    }\n    return 0;\n}`
      },
      {
        language: 'java',
        code: `// Solution for ${title}\nimport java.util.*;\nimport java.io.*;\n\nclass Main {\n    public static long ${methodName}(int[] arr) {\n        // Write your logic here\n        // Return the maximum product of a subarray\n        return 0;\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String line = br.readLine();\n        if (line == null) return;\n        String[] parts = line.trim().split("\\\\s+");\n        int[] arr = new int[parts.length];\n        for (int i = 0; i < parts.length; i++) {\n            arr[i] = Integer.parseInt(parts[i]);\n        }\n        System.out.println(${methodName}(arr));\n    }\n}`
      }
    ];
  }

  if (titleLower.includes("merge overlapping") || titleLower.includes("merge intervals") || titleLower.includes("overlapping intervals")) {
    return [
      {
        language: 'python',
        code: `import sys\n\ndef ${methodName}(intervals):\n    # Write your logic here\n    # intervals is a list of [start, end]\n    # Return the merged list of [start, end]\n    return []\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    parts = list(map(int, lines[0].split()))\n    intervals = []\n    for i in range(0, len(parts), 2):\n        if i + 1 < len(parts):\n            intervals.append([parts[i], parts[i+1]])\n    res = ${methodName}(intervals)\n    for interval in res:\n        print(f"{interval[0]} {interval[1]}")\n\nif __name__ == "__main__":\n    solve()`
      },
      {
        language: 'javascript',
        code: `// Solution for ${title}\nconst fs = require('fs');\n\nfunction ${methodName}(intervals) {\n    // Write your logic here\n    // intervals is an array of [start, end]\n    // Return the merged array of [start, end]\n    return [];\n}\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    if (!input) return;\n    const parts = input.split(/\\s+/).map(Number);\n    const intervals = [];\n    for (let i = 0; i < parts.length; i += 2) {\n        if (i + 1 < parts.length) {\n            intervals.push([parts[i], parts[i+1]]);\n        }\n    }\n    const res = ${methodName}(intervals);\n    res.forEach(interval => console.log(\`\${interval[0]} \${interval[1]}\`));\n}\nsolve();`
      },
      {
        language: 'cpp',
        code: `// Solution for ${title}\n#include <iostream>\n#include <vector>\n#include <sstream>\n#include <algorithm>\nusing namespace std;\n\nvector<vector<int>> ${methodName}(vector<vector<int>>& intervals) {\n    // Write your logic here\n    // Return the merged intervals\n    return {};\n}\n\nint main() {\n    string line;\n    if (getline(cin, line)) {\n        stringstream ss(line);\n        int start, end;\n        vector<vector<int>> intervals;\n        while (ss >> start >> end) {\n            intervals.push_back({start, end});\n        }\n        vector<vector<int>> res = ${methodName}(intervals);\n        for (const auto& interval : res) {\n            cout << interval[0] << " " << interval[1] << endl;\n        }\n    }\n    return 0;\n}`
      },
      {
        language: 'java',
        code: `// Solution for ${title}\nimport java.util.*;\nimport java.io.*;\n\nclass Main {\n    public static int[][] ${methodName}(int[][] intervals) {\n        // Write your logic here\n        // Return the merged intervals\n        return new int[][] {};\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String line = br.readLine();\n        if (line == null) return;\n        String[] parts = line.trim().split("\\\\s+");\n        int[][] intervals = new int[parts.length / 2][2];\n        for (int i = 0; i < intervals.length; i++) {\n            intervals[i][0] = Integer.parseInt(parts[i * 2]);\n            intervals[i][1] = Integer.parseInt(parts[i * 2 + 1]);\n        }\n        int[][] res = ${methodName}(intervals);\n        for (int[] interval : res) {\n            System.out.println(interval[0] + " " + interval[1]);\n        }\n    }\n}`
      }
    ];
  }

  if (titleLower.includes("space optimization using")) {
    return [
      {
        language: 'python',
        code: `import sys\n\ndef ${methodName}(a, b):\n    # Write your logic here\n    # Return a list of multiples of 2 and 5 between a and b\n    return []\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    parts = list(map(int, lines[0].split()))\n    a, b = parts[0], parts[1]\n    res = ${methodName}(a, b)\n    print(" ".join(map(str, res)))\n\nif __name__ == "__main__":\n    solve()`
      },
      {
        language: 'javascript',
        code: `// Solution for ${title}\nconst fs = require('fs');\n\nfunction ${methodName}(a, b) {\n    // Write your logic here\n    // Return an array of multiples of 2 and 5 between a and b\n    return [];\n}\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    if (!input) return;\n    const parts = input.split(/\\s+/).map(Number);\n    const a = parts[0], b = parts[1];\n    const res = ${methodName}(a, b);\n    console.log(res.join(' '));\n}\nsolve();`
      },
      {
        language: 'cpp',
        code: `// Solution for ${title}\n#include <iostream>\n#include <vector>\n#include <sstream>\n#include <algorithm>\nusing namespace std;\n\nvector<int> ${methodName}(int a, int b) {\n    // Write your logic here\n    // Return multiples of 2 and 5 between a and b\n    return {};\n}\n\nint main() {\n    int a, b;\n    if (cin >> a >> b) {\n        vector<int> res = ${methodName}(a, b);\n        for (size_t i = 0; i < res.size(); i++) {\n            cout << res[i] << (i == res.size() - 1 ? "" : " ");\n        }\n        cout << endl;\n    }\n    return 0;\n}`
      },
      {
        language: 'java',
        code: `// Solution for ${title}\nimport java.util.*;\nimport java.io.*;\n\nclass Main {\n    public static List<Integer> ${methodName}(int a, int b) {\n        // Write your logic here\n        // Return multiples of 2 and 5 between a and b\n        return new ArrayList<>();\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String line = br.readLine();\n        if (line == null) return;\n        String[] parts = line.trim().split("\\\\s+");\n        int a = Integer.parseInt(parts[0]);\n        int b = Integer.parseInt(parts[1]);\n        List<Integer> res = ${methodName}(a, b);\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < res.size(); i++) {\n            sb.append(res.get(i)).append(i == res.size() - 1 ? "" : " ");\n        }\n        System.out.println(sb.toString());\n    }\n}`
      }
    ];
  }

  if (titleLower.includes("longest repeating character replacement")) {
    return [
      {
        language: 'python',
        code: `import sys\n\ndef ${methodName}(s, k):\n    # Write your logic here\n    # Return the length of the longest substring\n    return 0\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    s = lines[0].strip()\n    k = int(lines[1].strip())\n    print(${methodName}(s, k))\n\nif __name__ == "__main__":\n    solve()`
      },
      {
        language: 'javascript',
        code: `// Solution for ${title}\nconst fs = require('fs');\n\nfunction ${methodName}(s, k) {\n    // Write your logic here\n    // Return the length of the longest substring\n    return 0;\n}\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    if (!input) return;\n    const lines = input.split(/\\r?\\n/);\n    const s = lines[0].trim();\n    const k = parseInt(lines[1].trim());\n    console.log(${methodName}(s, k));\n}\nsolve();`
      },
      {
        language: 'cpp',
        code: `// Solution for ${title}\n#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nint ${methodName}(string s, int k) {\n    // Write your logic here\n    // Return the length of the longest substring\n    return 0;\n}\n\nint main() {\n    string s;\n    int k;\n    if (cin >> s >> k) {\n        cout << ${methodName}(s, k) << endl;\n    }\n    return 0;\n}`
      },
      {
        language: 'java',
        code: `// Solution for ${title}\nimport java.util.*;\nimport java.io.*;\n\nclass Main {\n    public static int ${methodName}(String s, int k) {\n        // Write your logic here\n        // Return the length of the longest substring\n        return 0;\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String s = br.readLine();\n        if (s == null) return;\n        String kLine = br.readLine();\n        if (kLine == null) return;\n        int k = Integer.parseInt(kLine.trim());\n        System.out.println(${methodName}(s.trim(), k));\n    }\n}`
      }
    ];
  }

  if (titleLower.includes("smallest window in a string containing")) {
    return [
      {
        language: 'python',
        code: `import sys\n\ndef ${methodName}(s, p):\n    # Write your logic here\n    # Return the smallest substring or ""\n    return ""\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    s = lines[0].strip()\n    p = lines[1].strip()\n    print(${methodName}(s, p))\n\nif __name__ == "__main__":\n    solve()`
      },
      {
        language: 'javascript',
        code: `// Solution for ${title}\nconst fs = require('fs');\n\nfunction ${methodName}(s, p) {\n    // Write your logic here\n    // Return the smallest substring or ""\n    return "";\n}\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    if (!input) return;\n    const lines = input.split(/\\r?\\n/);\n    const s = lines[0].trim();\n    const p = lines[1].trim();\n    console.log(${methodName}(s, p));\n}\nsolve();`
      },
      {
        language: 'cpp',
        code: `// Solution for ${title}\n#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nstring ${methodName}(string s, string p) {\n    // Write your logic here\n    // Return the smallest substring or ""\n    return "";\n}\n\nint main() {\n    string s, p;\n    if (cin >> s >> p) {\n        cout << ${methodName}(s, p) << endl;\n    }\n    return 0;\n}`
      },
      {
        language: 'java',
        code: `// Solution for ${title}\nimport java.util.*;\nimport java.io.*;\n\nclass Main {\n    public static String ${methodName}(String s, String p) {\n        // Write your logic here\n        // Return the smallest substring or ""\n        return "";\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String s = br.readLine();\n        if (s == null) return;\n        String p = br.readLine();\n        if (p == null) return;\n        System.out.println(${methodName}(s.trim(), p.trim()));\n    }\n}`
      }
    ];
  }

  if (titleLower.includes("anagram")) {
    return [
      {
        language: 'python',
        code: `import sys\n\ndef ${methodName}(s1, s2):\n    # Write your logic here\n    # Return True or False\n    return False\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    s1 = lines[0].strip()\n    s2 = lines[1].strip()\n    print(str(${methodName}(s1, s2)).lower())\n\nif __name__ == "__main__":\n    solve()`
      },
      {
        language: 'javascript',
        code: `// Solution for ${title}\nconst fs = require('fs');\n\nfunction ${methodName}(s1, s2) {\n    // Write your logic here\n    // Return true or false\n    return false;\n}\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    if (!input) return;\n    const lines = input.split(/\\r?\\n/);\n    const s1 = lines[0].trim();\n    const s2 = lines[1].trim();\n    console.log(${methodName}(s1, s2));\n}\nsolve();`
      },
      {
        language: 'cpp',
        code: `// Solution for ${title}\n#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nbool ${methodName}(string s1, string s2) {\n    // Write your logic here\n    // Return true or false\n    return false;\n}\n\nint main() {\n    string s1, s2;\n    if (cin >> s1 >> s2) {\n        cout << (${methodName}(s1, s2) ? "true" : "false") << endl;\n    }\n    return 0;\n}`
      },
      {
        language: 'java',
        code: `// Solution for ${title}\nimport java.util.*;\nimport java.io.*;\n\nclass Main {\n    public static boolean ${methodName}(String s1, String s2) {\n        // Write your logic here\n        // Return true or false\n        return false;\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String s1 = br.readLine();\n        if (s1 == null) return;\n        String s2 = br.readLine();\n        if (s2 == null) return;\n        System.out.println(${methodName}(s1.trim(), s2.trim()) ? "true" : "false");\n    }\n}`
      }
    ];
  }

  if (titleLower.includes("valid palindrome") || titleLower.includes("valid parentheses")) {
    return [
      {
        language: 'python',
        code: `import sys\n\ndef ${methodName}(s):\n    # Write your logic here\n    # Return True or False\n    return False\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    print(str(${methodName}(lines[0])).lower())\n\nif __name__ == "__main__":\n    solve()`
      },
      {
        language: 'javascript',
        code: `// Solution for ${title}\nconst fs = require('fs');\n\nfunction ${methodName}(s) {\n    // Write your logic here\n    // Return true or false\n    return false;\n}\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8');\n    console.log(${methodName}(input.replace(/\\r?\\n$/, '')));\n}\nsolve();`
      },
      {
        language: 'cpp',
        code: `// Solution for ${title}\n#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nbool ${methodName}(string s) {\n    // Write your logic here\n    // Return true or false\n    return false;\n}\n\nint main() {\n    string s;\n    if (getline(cin, s)) {\n        cout << (${methodName}(s) ? "true" : "false") << endl;\n    }\n    return 0;\n}`
      },
      {
        language: 'java',
        code: `// Solution for ${title}\nimport java.util.*;\nimport java.io.*;\n\nclass Main {\n    public static boolean ${methodName}(String s) {\n        // Write your logic here\n        // Return true or false\n        return false;\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String line = br.readLine();\n        if (line == null) line = "";\n        System.out.println(${methodName}(line) ? "true" : "false");\n    }\n}`
      }
    ];
  }

  if (titleLower.includes("longest common prefix")) {
    return [
      {
        language: 'python',
        code: `import sys\n\ndef ${methodName}(arr):\n    # Write your logic here\n    # Return the longest common prefix or ""\n    return ""\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    arr = lines[0].split()\n    print(${methodName}(arr))\n\nif __name__ == "__main__":\n    solve()`
      },
      {
        language: 'javascript',
        code: `// Solution for ${title}\nconst fs = require('fs');\n\nfunction ${methodName}(arr) {\n    // Write your logic here\n    // Return the longest common prefix or ""\n    return "";\n}\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    if (!input) return;\n    const arr = input.split(/\\s+/);\n    console.log(${methodName}(arr));\n}\nsolve();`
      },
      {
        language: 'cpp',
        code: `// Solution for ${title}\n#include <iostream>\n#include <vector>\n#include <string>\n#include <sstream>\n#include <algorithm>\nusing namespace std;\n\nstring ${methodName}(vector<string>& arr) {\n    // Write your logic here\n    // Return the longest common prefix or ""\n    return "";\n}\n\nint main() {\n    string line;\n    if (getline(cin, line)) {\n        stringstream ss(line);\n        string s;\n        vector<string> arr;\n        while (ss >> s) arr.push_back(s);\n        cout << ${methodName}(arr) << endl;\n    }\n    return 0;\n}`
      },
      {
        language: 'java',
        code: `// Solution for ${title}\nimport java.util.*;\nimport java.io.*;\n\nclass Main {\n    public static String ${methodName}(String[] arr) {\n        // Write your logic here\n        // Return the longest common prefix or ""\n        return "";\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String line = br.readLine();\n        if (line == null) return;\n        String[] arr = line.trim().split("\\\\s+");\n        System.out.println(${methodName}(arr));\n    }\n}`
      }
    ];
  }

  if (titleLower.includes("longest palindromic substring")) {
    return [
      {
        language: 'python',
        code: `import sys\n\ndef ${methodName}(s):\n    # Write your logic here\n    # Return the longest palindromic substring\n    return ""\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    print(${methodName}(lines[0].strip()))\n\nif __name__ == "__main__":\n    solve()`
      },
      {
        language: 'javascript',
        code: `// Solution for ${title}\nconst fs = require('fs');\n\nfunction ${methodName}(s) {\n    // Write your logic here\n    // Return the longest palindromic substring\n    return "";\n}\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    if (!input) return;\n    console.log(${methodName}(input));\n}\nsolve();`
      },
      {
        language: 'cpp',
        code: `// Solution for ${title}\n#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nstring ${methodName}(string s) {\n    // Write your logic here\n    // Return the longest palindromic substring\n    return "";\n}\n\nint main() {\n    string s;\n    if (cin >> s) {\n        cout << ${methodName}(s) << endl;\n    }\n    return 0;\n}`
      },
      {
        language: 'java',
        code: `// Solution for ${title}\nimport java.util.*;\nimport java.io.*;\n\nclass Main {\n    public static String ${methodName}(String s) {\n        // Write your logic here\n        // Return the longest palindromic substring\n        return "";\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String line = br.readLine();\n        if (line == null) return;\n        System.out.println(${methodName}(line.trim()));\n    }\n}`
      }
    ];
  }

  if (titleLower.includes("group anagrams")) {
    return [
      {
        language: 'python',
        code: `import sys\n\ndef ${methodName}(strs):\n    # Write your logic here\n    # Return a list of lists of strings\n    return []\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    strs = lines[0].split()\n    groups = ${methodName}(strs)\n    for g in groups:\n        g.sort()\n    groups.sort(key=lambda x: (len(x), x[0] if x else ""))\n    for g in groups:\n        print(" ".join(g))\n\nif __name__ == "__main__":\n    solve()`
      },
      {
        language: 'javascript',
        code: `// Solution for ${title}\nconst fs = require('fs');\n\nfunction ${methodName}(strs) {\n    // Write your logic here\n    // Return an array of arrays of strings\n    return [];\n}\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    if (!input) return;\n    const strs = input.split(/\\s+/);\n    const groups = ${methodName}(strs);\n    groups.forEach(g => g.sort());\n    groups.sort((a, b) => {\n        if (a.length !== b.length) return a.length - b.length;\n        return a[0].localeCompare(b[0]);\n    });\n    groups.forEach(g => console.log(g.join(' ')));\n}\nsolve();`
      },
      {
        language: 'cpp',
        code: `// Solution for ${title}\n#include <iostream>\n#include <vector>\n#include <string>\n#include <sstream>\n#include <algorithm>\nusing namespace std;\n\nvector<vector<string>> ${methodName}(vector<string>& strs) {\n    // Write your logic here\n    // Return a vector of vectors of strings\n    return {};\n}\n\nint main() {\n    string line;\n    if (getline(cin, line)) {\n        stringstream ss(line);\n        string s;\n        vector<string> strs;\n        while (ss >> s) strs.push_back(s);\n        vector<vector<string>> groups = ${methodName}(strs);\n        for (auto& g : groups) sort(g.begin(), g.end());\n        sort(groups.begin(), groups.end(), [](const vector<string>& a, const vector<string>& b) {\n            if (a.size() != b.size()) return a.size() < b.size();\n            return a[0] < b[0];\n        });\n        for (const auto& g : groups) {\n            for (size_t i = 0; i < g.size(); i++) {\n                cout << g[i] << (i == g.size() - 1 ? "" : " ");\n            }\n            cout << endl;\n        }\n    }\n    return 0;\n}`
      },
      {
        language: 'java',
        code: `// Solution for ${title}\nimport java.util.*;\nimport java.io.*;\n\nclass Main {\n    public static List<List<String>> ${methodName}(String[] strs) {\n        // Write your logic here\n        // Return a List of Lists of strings\n        return new ArrayList<>();\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String line = br.readLine();\n        if (line == null) return;\n        String[] strs = line.trim().split("\\\\s+");\n        List<List<String>> groups = ${methodName}(strs);\n        for (List<String> g : groups) {\n            Collections.sort(g);\n        }\n        groups.sort((a, b) -> {\n            if (a.size() != b.size()) return a.size() - b.size();\n            return a.get(0).compareTo(b.get(0));\n        });\n        for (List<String> g : groups) {\n            StringBuilder sb = new StringBuilder();\n            for (int i = 0; i < g.size(); i++) {\n                sb.append(g.get(i)).append(i == g.size() - 1 ? "" : " ");\n            }\n            System.out.println(sb.toString());\n        }\n    }\n}`
      }
    ];
  }

  if (titleLower.includes("transform one string to another") || titleLower.includes("transform string")) {
    return [
      {
        language: 'python',
        code: `import sys\n\ndef ${methodName}(s1, s2):\n    # Write your logic here\n    # Return the minimum operations or -1\n    return -1\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    s1 = lines[0].strip()\n    s2 = lines[1].strip()\n    print(${methodName}(s1, s2))\n\nif __name__ == "__main__":\n    solve()`
      },
      {
        language: 'javascript',
        code: `// Solution for ${title}\nconst fs = require('fs');\n\nfunction ${methodName}(s1, s2) {\n    // Write your logic here\n    // Return the minimum operations or -1\n    return -1;\n}\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    if (!input) return;\n    const lines = input.split(/\\r?\\n/);\n    const s1 = lines[0].trim();\n    const s2 = lines[1].trim();\n    console.log(${methodName}(s1, s2));\n}\nsolve();`
      },
      {
        language: 'cpp',
        code: `// Solution for ${title}\n#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nint ${methodName}(string s1, string s2) {\n    // Write your logic here\n    // Return the minimum operations or -1\n    return -1;\n}\n\nint main() {\n    string s1, s2;\n    if (cin >> s1 >> s2) {\n        cout << ${methodName}(s1, s2) << endl;\n    }\n    return 0;\n}`
      },
      {
        language: 'java',
        code: `// Solution for ${title}\nimport java.util.*;\nimport java.io.*;\n\nclass Main {\n    public static int ${methodName}(String s1, String s2) {\n        // Write your logic here\n        // Return the minimum operations or -1\n        return -1;\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String s1 = br.readLine();\n        if (s1 == null) return;\n        String s2 = br.readLine();\n        if (s2 == null) return;\n        System.out.println(${methodName}(s1.trim(), s2.trim()));\n    }\n}`
      }
    ];
  }

  if (titleLower.includes("wildcard string matching")) {
    return [
      {
        language: 'python',
        code: `import sys\n\ndef ${methodName}(s, p):\n    # Return True when the complete string s matches pattern p.\n    return False\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if len(lines) < 2: return\n    print(str(${methodName}(lines[0], lines[1])).lower())\n\nif __name__ == "__main__":\n    solve()`
      },
      {
        language: 'javascript',
        code: `// Solution for ${title}\nconst fs = require('fs');\n\nfunction ${methodName}(s, p) {\n    // Return true when the complete string s matches pattern p.\n    return false;\n}\n\nconst lines = fs.readFileSync(0, 'utf-8').split(/\\r?\\n/);\nif (lines.length >= 2) console.log(${methodName}(lines[0], lines[1]));`
      },
      {
        language: 'cpp',
        code: `// Solution for ${title}\n#include <iostream>\n#include <string>\nusing namespace std;\n\nbool ${methodName}(const string& s, const string& p) {\n    // Return true when the complete string s matches pattern p.\n    return false;\n}\n\nint main() {\n    string s, p;\n    if (getline(cin, s) && getline(cin, p)) cout << (${methodName}(s, p) ? "true" : "false") << endl;\n}`
      },
      {
        language: 'java',
        code: `// Solution for ${title}\nimport java.io.*;\n\nclass Main {\n    public static boolean ${methodName}(String s, String p) {\n        // Return true when the complete string s matches pattern p.\n        return false;\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String s = br.readLine(), p = br.readLine();\n        if (s != null && p != null) System.out.println(${methodName}(s, p));\n    }\n}`
      }
    ];
  }

  if (titleLower.includes("print all the duplicates") || titleLower.includes("duplicate characters in a string")) {
    return [
      {
        language: 'python',
        code: `import sys\n\ndef ${methodName}(s):\n    # Write your logic here\n    # Return a list of lists/tuples [char, count] in order of first occurrence\n    return []\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    res = ${methodName}(lines[0])\n    out = [f"['{item[0]}', {item[1]}]" for item in res]\n    print(", ".join(out))\n\nif __name__ == "__main__":\n    solve()`
      },
      {
        language: 'javascript',
        code: `// Solution for ${title}\nconst fs = require('fs');\n\nfunction ${methodName}(s) {\n    // Write your logic here\n    // Return an array of [char, count] in order of first occurrence\n    return [];\n}\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    if (!input) return;\n    const res = ${methodName}(input);\n    const out = res.map(item => \`['\${item[0]}', \${item[1]}]\`);\n    console.log(out.join(', '));\n}\nsolve();`
      },
      {
        language: 'cpp',
        code: `// Solution for ${title}\n#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nvector<pair<char, int>> ${methodName}(string s) {\n    // Write your logic here\n    // Return a vector of pair<char, int> in order of first occurrence\n    return {};\n}\n\nint main() {\n    string s;\n    if (getline(cin, s)) {\n        vector<pair<char, int>> res = ${methodName}(s);\n        for (size_t i = 0; i < res.size(); i++) {\n            cout << "['" << res[i].first << "', " << res[i].second << "]" << (i == res.size() - 1 ? "" : ", ");\n        }\n        cout << endl;\n    }\n    return 0;\n}`
      },
      {
        language: 'java',
        code: `// Solution for ${title}\nimport java.util.*;\nimport java.io.*;\n\nclass Main {\n    public static List<Object[]> ${methodName}(String s) {\n        // Write your logic here\n        // Return a List of Object[] where each Object[] is {Character, Integer} in order of first occurrence\n        return new ArrayList<>();\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String line = br.readLine();\n        if (line == null) return;\n        List<Object[]> res = ${methodName}(line);\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < res.size(); i++) {\n            Object[] item = res.get(i);\n            sb.append("['").append(item[0]).append("', ").append(item[1]).append("]").append(i == res.size() - 1 ? "" : ", ");\n        }\n        System.out.println(sb.toString());\n    }\n}`
      }
    ];
  }

  if (titleLower.includes("boyer moore")) {
    return [
      {
        language: 'python',
        code: `import sys\n\ndef ${methodName}(txt, pat):\n    # Write your logic here\n    # Return a list of indexes where pat is found in txt\n    return []\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    txt = lines[0]\n    pat = lines[1]\n    res = ${methodName}(txt, pat)\n    for idx in res:\n        print(f"Pattern found at index {idx}")\n\nif __name__ == "__main__":\n    solve()`
      },
      {
        language: 'javascript',
        code: `// Solution for ${title}\nconst fs = require('fs');\n\nfunction ${methodName}(txt, pat) {\n    // Write your logic here\n    // Return an array of indexes where pat is found in txt\n    return [];\n}\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8');\n    if (!input) return;\n    const lines = input.split(/\\r?\\n/);\n    const txt = lines[0];\n    const pat = lines[1];\n    const res = ${methodName}(txt, pat);\n    res.forEach(idx => console.log(\`Pattern found at index \${idx}\`));\n}\nsolve();`
      },
      {
        language: 'cpp',
        code: `// Solution for ${title}\n#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nvector<int> ${methodName}(string txt, string pat) {\n    // Write your logic here\n    // Return vector of indexes where pat is found in txt\n    return {};\n}\n\nint main() {\n    string txt, pat;\n    if (getline(cin, txt) && getline(cin, pat)) {\n        vector<int> res = ${methodName}(txt, pat);\n        for (int idx : res) {\n            cout << "Pattern found at index " << idx << endl;\n        }\n    }\n    return 0;\n}`
      },
      {
        language: 'java',
        code: `// Solution for ${title}\nimport java.util.*;\nimport java.io.*;\n\nclass Main {\n    public static List<Integer> ${methodName}(String txt, String pat) {\n        // Write your logic here\n        // Return a List of indexes where pat is found in txt\n        return new ArrayList<>();\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String txt = br.readLine();\n        if (txt == null) return;\n        String pat = br.readLine();\n        if (pat == null) return;\n        List<Integer> res = ${methodName}(txt, pat);\n        for (int idx : res) {\n            System.out.println("Pattern found at index " + idx);\n        }\n    }\n}`
      }
    ];
  }

  if (titleLower.includes("rabin-karp") || titleLower.includes("rabin karp")) {
    return [
      {
        language: 'python',
        code: `import sys\n\ndef find_pattern_positions(text, pattern):\n    # Return every 0-based start index using Rabin-Karp.\n    return []\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if len(lines) < 2:\n        return\n    print(find_pattern_positions(lines[0], lines[1]))\n\nif __name__ == "__main__":\n    solve()`
      },
      {
        language: 'javascript',
        code: `const fs = require('fs');\n\nfunction findPatternPositions(text, pattern) {\n  // Return every 0-based start index using Rabin-Karp.\n  return [];\n}\n\nconst lines = fs.readFileSync(0, 'utf8').split(/\\r?\\n/);\nif (lines.length >= 2) {\n  console.log('[' + findPatternPositions(lines[0], lines[1]).join(', ') + ']');\n}`
      },
      {
        language: 'cpp',
        code: `#include <iostream>\n#include <string>\n#include <vector>\nusing namespace std;\n\nvector<int> findPatternPositions(const string& text, const string& pattern) {\n    // Return every 0-based start index using Rabin-Karp.\n    return {};\n}\n\nint main() {\n    string text, pattern;\n    if (!getline(cin, text) || !getline(cin, pattern)) return 0;\n    vector<int> positions = findPatternPositions(text, pattern);\n    cout << "[";\n    for (size_t i = 0; i < positions.size(); ++i) {\n        if (i) cout << ", ";\n        cout << positions[i];\n    }\n    cout << "]\\n";\n}`
      },
      {
        language: 'java',
        code: `import java.io.*;\nimport java.util.*;\n\nclass Main {\n    static List<Integer> findPatternPositions(String text, String pattern) {\n        // Return every 0-based start index using Rabin-Karp.\n        return new ArrayList<>();\n    }\n\n    public static void main(String[] args) throws Exception {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String text = br.readLine(), pattern = br.readLine();\n        if (text != null && pattern != null) System.out.println(findPatternPositions(text, pattern));\n    }\n}`
      }
    ];
  }

  if (titleLower.includes("mobile numeric keypad sequence") || titleLower.includes("keypad sequence")) {
    return [
      {
        language: 'python',
        code: `import sys\n\ndef ${methodName}(s):\n    # Write your logic here\n    # Return the mobile keypad sequence as a string\n    return ""\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    print(${methodName}(lines[0].strip()))\n\nif __name__ == "__main__":\n    solve()`
      },
      {
        language: 'javascript',
        code: `// Solution for ${title}\nconst fs = require('fs');\n\nfunction ${methodName}(s) { \n    // Write your logic here\n    // Return the mobile keypad sequence as a string\n    return "";\n}\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    if (!input) return;\n    console.log(${methodName}(input));\n}\nsolve();`
      },
      {
        language: 'cpp',
        code: `// Solution for ${title}\n#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nstring ${methodName}(string s) {\n    // Write your logic here\n    // Return the mobile keypad sequence as a string\n    return "";\n}\n\nint main() {\n    string s;\n    if (getline(cin, s)) {\n        cout << ${methodName}(s) << endl;\n    }\n    return 0;\n}`
      },
      {
        language: 'java',
        code: `// Solution for ${title}\nimport java.util.*;\nimport java.io.*;\n\nclass Main {\n    public static String ${methodName}(String s) {\n        // Write your logic here\n        // Return the mobile keypad sequence as a string\n        return "";\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String line = br.readLine();\n        if (line == null) return;\n        System.out.println(${methodName}(line.trim()));\n    }\n}`
      }
    ];
  }

  if (titleLower.includes("remove consecutive characters") || titleLower.includes("consecutive duplicates from a string")) {
    return [
      {
        language: 'python',
        code: `import sys\n\ndef ${methodName}(s):\n    # Write your logic here\n    # Return the string after removing consecutive duplicates\n    return ""\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    print(${methodName}(lines[0].strip()))\n\nif __name__ == "__main__":\n    solve()`
      },
      {
        language: 'javascript',
        code: `// Solution for ${title}\nconst fs = require('fs');\n\nfunction ${methodName}(s) { \n    // Write your logic here\n    // Return the string after removing consecutive duplicates\n    return "";\n}\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    if (!input) return;\n    console.log(${methodName}(input));\n}\nsolve();`
      },
      {
        language: 'cpp',
        code: `// Solution for ${title}\n#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nstring ${methodName}(string s) {\n    // Write your logic here\n    // Return the string after removing consecutive duplicates\n    return "";\n}\n\nint main() {\n    string s;\n    if (cin >> s) {\n        cout << ${methodName}(s) << endl;\n    }\n    return 0;\n}`
      },
      {
        language: 'java',
        code: `// Solution for ${title}\nimport java.util.*;\nimport java.io.*;\n\nclass Main {\n    public static String ${methodName}(String s) {\n        // Write your logic here\n        // Return the string after removing consecutive duplicates\n        return "";\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String line = br.readLine();\n        if (line == null) return;\n        System.out.println(${methodName}(line.trim()));\n    }\n}`
      }
    ];
  }

  return [
    {
      language: 'python',
      code: `import sys\n\ndef ${methodName}(input_str):\n    # Write your logic here\n    # Process 'input_str' and return the result\n    return "1"\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    res = ${methodName}(lines[0])\n    print(res)\n\nif __name__ == "__main__":\n    solve()`
    },
    {
      language: 'javascript',
      code: `// Solution for ${title}\nconst fs = require('fs');\n\nfunction ${methodName}(inputStr) {\n    // Write your logic here\n    // Process 'inputStr' and return the result\n    return "1";\n}\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    if (!input) return;\n    console.log(${methodName}(input));\n}\nsolve();`
    },
    {
      language: 'cpp',
      code: `// Solution for ${title}\n#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nstring ${methodName}(string inputStr) {\n    // Write your logic here\n    // Process 'inputStr' and return the result\n    return "1";\n}\n\nint main() {\n    string inputStr;\n    if (getline(cin, inputStr)) {\n        cout << ${methodName}(inputStr) << endl;\n    }\n    return 0;\n}`
    },
    {
      language: 'java',
      code: `// Solution for ${title}\nimport java.util.*;\nimport java.io.*;\n\nclass Main {\n    public static String ${methodName}(String inputStr) {\n        // Write your logic here\n        // Process 'inputStr' and return the result\n        return "1";\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String line = br.readLine();\n        if (line == null) return;\n        System.out.println(${methodName}(line.trim()));\n    }\n}`
    }
  ];
}

async function seed() {
  try {
    console.log('Restoring MySQL Coding Arena questions...');

    const seededQuestions = [];
    const seenSlugs = new Set();

    for (const [topicKey, questionsList] of Object.entries(TOPIC_QUESTIONS)) {
      for (let index = 0; index < questionsList.length; index++) {
        const title = questionsList[index];
        const slug = `${slugify(title)}-${topicKey}`;

        if (seenSlugs.has(slug)) {
          continue; // Skip duplicate slugs within the same topic
        }
        seenSlugs.add(slug);

        const coreData = CORE_QUESTIONS_DATA[title];
        const difficulty = coreData?.difficulty ?? (index < 5 ? 'easy' : index < 15 ? 'medium' : 'hard');
        const companies = [
          COMPANIES_POOL[index % COMPANIES_POOL.length],
          COMPANIES_POOL[(index + 3) % COMPANIES_POOL.length]
        ];

        const qDoc = {
          title: coreData && coreData.title ? coreData.title : title,
          slug,
          statement: coreData && coreData.statement ? coreData.statement : `Practice solving **${title}** under topic **${topicKey}**. Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
          difficulty,
          topics: [topicKey],
          companies,
          timeLimit: 1000,
          memoryLimit: 128,
          inputFormat: coreData && coreData.inputFormat ? coreData.inputFormat : 'A single line of space-separated integers representing target inputs.',
          outputFormat: coreData && coreData.outputFormat ? coreData.outputFormat : 'Expected solved outputs.',
          constraints: coreData && coreData.constraints ? coreData.constraints : '1 <= nums.length <= 10^5',
          sampleInput: coreData ? coreData.sampleInput : '1 2 3',
          sampleOutput: coreData ? coreData.sampleOutput : '1',
          templates: generateBoilerplates(coreData?.title ?? title),
          testCases: coreData ? coreData.testCases : [
            { input: '1 2 3', output: '1', isHidden: false },
            { input: '4 5 6', output: '1', isHidden: true }
          ],
          xpReward: coreData?.xpReward ?? (difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20)
        };

        seededQuestions.push(qDoc);
      }
    }

    console.log(`Upserting all ${seededQuestions.length} questions into MySQL...`);

    // Keep existing questions and student submissions intact. This makes the
    // script safe to run whenever the catalogue needs to be restored.
    for (const question of seededQuestions) {
      await prisma.question.upsert({
        where: { slug: question.slug },
        update: question,
        create: question,
      });
    }


    console.log(`✅ Successfully seeded ${seededQuestions.length} questions into MySQL Coding Arena!`);
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
