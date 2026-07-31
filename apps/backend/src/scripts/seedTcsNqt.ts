import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

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

const TCS_QUESTIONS = [
  // Arrays
  { title: 'Find the smallest number in an array', difficulty: 'easy' },
  { title: 'Largest in Array', difficulty: 'easy' },
  { title: 'Second Smallest and Second Largest', difficulty: 'medium' },
  { title: 'Reverse a given array', difficulty: 'easy' },
  { title: 'Count Elements With Maximum Frequency', difficulty: 'medium' },
  { title: 'Half Ascending and Half Descending Sort', difficulty: 'medium' },
  { title: 'Sum of Array', difficulty: 'easy' },
  { title: 'Rotate Array', difficulty: 'hard' },
  { title: 'Mean or Average of an Array', difficulty: 'easy' },
  { title: 'Median of an Array', difficulty: 'easy' },
  { title: 'Remove Duplicates from Sorted Array', difficulty: 'easy' },
  { title: 'Insert Element at a Given Position in an Array', difficulty: 'easy' },
  { title: 'Find All Duplicates in an Array', difficulty: 'medium' },
  { title: 'First Non-Repeating Element', difficulty: 'easy' },
  { title: 'Symmetric pairs in an array', difficulty: 'medium' },
  { title: 'Maximum Product Subarray', difficulty: 'hard' },
  { title: 'Rank Transform of an Array', difficulty: 'easy' },
  { title: 'Sort elements by frequency', difficulty: 'hard' },
  { title: 'Equilibrium Index', difficulty: 'medium' },
  { title: 'Array after k Rotations', difficulty: 'medium' },
  { title: 'Sort an array according to the order defined by another array', difficulty: 'hard' },
  { title: 'Array Search', difficulty: 'easy' },
  { title: 'Check if an array is subset of another array', difficulty: 'easy' },

  // Numbers
  { title: 'Check if a number is Palindrome', difficulty: 'easy' },
  { title: 'Palindromes in a Range', difficulty: 'medium' },
  { title: 'Check if a number is prime', difficulty: 'easy' },
  { title: 'Primes in a Range', difficulty: 'medium' },
  { title: 'Check if a number is armstrong number of not', difficulty: 'easy' },
  { title: 'Check if a number is perfect number', difficulty: 'easy' },
  { title: 'Even or Odd', difficulty: 'easy' },
  { title: 'Check weather a given number is positive or negative', difficulty: 'easy' },
  { title: 'Sum of first N natural numbers', difficulty: 'easy' },
  { title: 'Find Sum of AP Series', difficulty: 'easy' },
  { title: 'Program to find sum of GP Series', difficulty: 'medium' },
  { title: 'Greatest of two numbers', difficulty: 'easy' },
  { title: 'Greatest of three numbers', difficulty: 'easy' },
  { title: 'Leap Year or not', difficulty: 'easy' },
  { title: 'Reverse digits of a number', difficulty: 'easy' },
  { title: 'Maximum and Minimum digit in a number', difficulty: 'easy' },
  { title: 'Print Fibonacci upto Nth Term', difficulty: 'easy' },
  { title: 'Factorial of a number', difficulty: 'easy' },
  { title: 'Power of a number', difficulty: 'medium' },
  { title: 'Factors of a given number', difficulty: 'easy' },
  { title: 'Print all prime factors of the given number', difficulty: 'medium' },
  { title: 'Check if a number is a strong number or not', difficulty: 'medium' },
  { title: 'Check if a Number is Automorphic', difficulty: 'medium' },
  { title: 'GCD of two numbers', difficulty: 'easy' },
  { title: 'LCM of two numbers', difficulty: 'easy' },
  { title: 'Sum of digits of a number', difficulty: 'easy' },
  { title: 'Sum of numbers in the given range', difficulty: 'easy' },
  { title: 'Permutations in which N people can occupy R seats in a classroom', difficulty: 'medium' },
  { title: 'Program to add two fractions', difficulty: 'medium' },
  { title: 'Replace all 0s with 1s in a given integer', difficulty: 'easy' },
  { title: 'Can a number be expressed as a sum of two prime numbers', difficulty: 'medium' },
  { title: 'Calculate the area of circle', difficulty: 'easy' },
  { title: 'Program to find roots of a Quadratic Equation', difficulty: 'hard' },

  // Number Systems
  { title: 'Convert Binary to Decimal', difficulty: 'easy' },
  { title: 'Convert binary to octal', difficulty: 'medium' },
  { title: 'Decimal to Binary conversion', difficulty: 'easy' },
  { title: 'Convert decimal to octal', difficulty: 'medium' },
  { title: 'Convert octal to binary', difficulty: 'medium' },
  { title: 'Convert octal to decimal', difficulty: 'medium' },
  { title: 'Convert digits/numbers to words', difficulty: 'hard' },

  // Sorting
  { title: 'Bubble Sort Algorithm', difficulty: 'easy' },
  { title: 'Selection Sort Algorithm', difficulty: 'easy' },
  { title: 'Insertion Sort Algorithm', difficulty: 'easy' },
  { title: 'Quick Sort Algorithm', difficulty: 'medium' },
  { title: 'Merge sort algorithm', difficulty: 'medium' },

  // Strings
  { title: 'Check if a given string is palindrome or not', difficulty: 'easy' },
  { title: 'Count number of vowels, consonants, spaces in String', difficulty: 'easy' },
  { title: 'Find the ASCII value of a character', difficulty: 'easy' },
  { title: 'Remove all vowels from the string', difficulty: 'easy' },
  { title: 'Remove spaces from a string', difficulty: 'easy' },
  { title: 'Remove characters from a string except alphabets', difficulty: 'easy' },
  { title: 'Reverse a String', difficulty: 'easy' },
  { title: 'Remove brackets from an algebraic expression', difficulty: 'medium' },
  { title: 'Sum of the numbers in a String', difficulty: 'easy' },
  { title: 'Capitalize first and last character of each word', difficulty: 'medium' },
  { title: 'Calculate frequency of characters in a string', difficulty: 'medium' },
  { title: 'Find Non-repeating characters of a String', difficulty: 'medium' },
  { title: 'Check if two strings are anagram of each other', difficulty: 'easy' },
  { title: 'Count common sub-sequence in two strings', difficulty: 'hard' },
  { title: 'Check if two strings match where one string contains wildcard characters', difficulty: 'hard' },
  { title: 'Return maximum occurring character in the input string', difficulty: 'medium' },
  { title: 'Remove all duplicates from the input string', difficulty: 'medium' },
  { title: 'Print all the duplicates in the input string', difficulty: 'medium' },
  { title: 'Remove characters from first string present in the second string', difficulty: 'medium' },
  { title: 'Change every letter with the next lexicographic alphabet in the given string', difficulty: 'medium' },
  { title: 'Write a program to find the largest word in a given string', difficulty: 'medium' },
  { title: 'Write a program to sort characters in a string', difficulty: 'medium' },
  { title: 'Count number of words in a given string', difficulty: 'easy' },
  { title: 'Write a program to find a word in a given string which has the highest number of repeated letters', difficulty: 'hard' },
  { title: 'Change case of each character in a string', difficulty: 'easy' },
  { title: 'Concatenate one string to another', difficulty: 'easy' },
  { title: 'Write a program to find a substring within a string, if found display its starting position', difficulty: 'medium' },
  { title: 'Reverse words in a string', difficulty: 'medium' },
  { title: 'Find the longest string', difficulty: 'medium' },
  { title: 'Longest common prefix', difficulty: 'medium' },
  { title: 'Check if string is rotated by two places', difficulty: 'medium' },
  { title: 'Check if string can be made equal by reverse operations', difficulty: 'hard' },
  { title: 'K maximum sum combinations from two arrays', difficulty: 'hard' },
  { title: 'Sum of first N natural numbers', difficulty: 'easy' },
];

// Problem-specific configurations with details
const PROBLEM_DETAILS: Record<string, any> = {
  'largest-in-array': {
    statement: `Given an array arr[]. The task is to find the largest element and return it.

**Examples:**
- Input: arr[] = [1, 8, 7, 56, 90] → Output: 90
- Input: arr[] = [5, 5, 5, 5] → Output: 5
- Input: arr[] = [10] → Output: 10

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'First line contains N (size of array), second line contains N space-separated integers.',
    outputFormat: 'Return the largest element in the array.',
    constraints: '1 ≤ N ≤ 10^5\n-10^9 ≤ arr[i] ≤ 10^9',
    sampleInput: '5\n1 8 7 56 90',
    sampleOutput: '90',
    testCases: [
      { input: '5\n1 8 7 56 90', output: '90', isHidden: false },
      { input: '4\n5 5 5 5', output: '5', isHidden: false },
      { input: '1\n10', output: '10', isHidden: false },
      { input: '3\n-5 -2 -10', output: '-2', isHidden: true },
      { input: '6\n100 200 150 300 250 280', output: '300', isHidden: true },
      { input: '2\n1000000000 -1000000000', output: '1000000000', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'second-smallest-and-second-largest': {
    statement: `Given an array arr[] of integers, find the smallest and second smallest distinct elements in the array. The result should be returned in ascending order, meaning the smallest element should come first, followed by the second smallest. If there is no valid second smallest (i.e., all elements are the same or the array has fewer than two elements), then return -1.

**Examples:**
- Input: arr[] = [12, 25, 8, 55, 10, 33, 17, 11] → Output: [8, 10]
  Explanation: The smallest element is 8 and second smallest element is 10.
- Input: arr[] = [2, 4, 3, 5, 6] → Output: [2, 3]
  Explanation: 2 and 3 are respectively the smallest and second smallest elements in the array.
- Input: arr[] = [1, 1, 1] → Output: [-1]
  Explanation: Only element is 1 which is smallest, so there is no second smallest element.

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'First line contains N (size of array), second line contains N space-separated integers.',
    outputFormat: 'Return two space-separated integers (smallest and second smallest), or -1 if second smallest does not exist.',
    constraints: '1 ≤ N ≤ 10^5\n-10^9 ≤ arr[i] ≤ 10^9',
    sampleInput: '8\n12 25 8 55 10 33 17 11',
    sampleOutput: '8 10',
    testCases: [
      { input: '8\n12 25 8 55 10 33 17 11', output: '8 10', isHidden: false },
      { input: '5\n2 4 3 5 6', output: '2 3', isHidden: false },
      { input: '3\n1 1 1', output: '-1', isHidden: false },
      { input: '4\n5 2 8 3', output: '2 3', isHidden: true },
      { input: '6\n-10 -5 0 5 10 15', output: '-10 -5', isHidden: true },
      { input: '2\n100 50', output: '50 100', isHidden: true },
      { input: '7\n9 9 9 9 1 9 9', output: '1 9', isHidden: true },
      { input: '5\n1000000000 -1000000000 999999999 -999999999 0', output: '-1000000000 -999999999', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'reverse-a-given-array': {
    statement: `You are given an array of integers arr[]. You have to reverse the given array.

**Note:** Modify the array in place.

**Examples:**
- Input: arr = [1, 4, 3, 2, 6, 5] → Output: [5, 6, 2, 3, 4, 1]
  Explanation: The elements of the array are [1, 4, 3, 2, 6, 5]. After reversing the array, the first element goes to the last position, the second element goes to the second last position and so on. Hence, the answer is [5, 6, 2, 3, 4, 1].
- Input: arr = [4, 5, 2] → Output: [2, 5, 4]
  Explanation: The elements of the array are [4, 5, 2]. The reversed array will be [2, 5, 4].
- Input: arr = [1] → Output: [1]
  Explanation: The array has only single element, hence the reversed array is same as the original.

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'First line contains N (size of array), second line contains N space-separated integers.',
    outputFormat: 'Return the reversed array as space-separated integers.',
    constraints: '1 ≤ N ≤ 10^5\n-10^9 ≤ arr[i] ≤ 10^9',
    sampleInput: '6\n1 4 3 2 6 5',
    sampleOutput: '5 6 2 3 4 1',
    testCases: [
      { input: '6\n1 4 3 2 6 5', output: '5 6 2 3 4 1', isHidden: false },
      { input: '3\n4 5 2', output: '2 5 4', isHidden: false },
      { input: '1\n1', output: '1', isHidden: false },
      { input: '5\n10 20 30 40 50', output: '50 40 30 20 10', isHidden: true },
      { input: '4\n-1 -2 -3 -4', output: '-4 -3 -2 -1', isHidden: true },
      { input: '2\n100 -100', output: '-100 100', isHidden: true },
      { input: '7\n1 1 1 1 1 1 1', output: '1 1 1 1 1 1 1', isHidden: true },
      { input: '5\n1000000000 -1000000000 999999999 -999999999 0', output: '0 -999999999 999999999 -1000000000 1000000000', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'count-elements-with-maximum-frequency': {
    statement: `You are given an array nums consisting of positive integers.

Return the total frequencies of elements in nums such that those elements all have the maximum frequency.

The frequency of an element is the number of occurrences of that element in the array.

**Examples:**
- Input: nums = [1,2,2,3,1,4] → Output: 4
  Explanation: The elements 1 and 2 have a frequency of 2 which is the maximum frequency in the array. So the number of elements in the array with maximum frequency is 4. (1 appears 2 times, 2 appears 2 times = 2 + 2 = 4 total elements).
- Input: nums = [1,2,3,4,5] → Output: 5
  Explanation: All elements of the array have a frequency of 1 which is the maximum. So the number of elements in the array with maximum frequency is 5.

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'First line contains N (size of array), second line contains N space-separated positive integers.',
    outputFormat: 'Return a single integer representing the total count of elements with maximum frequency.',
    constraints: '1 ≤ N ≤ 10^5\n1 ≤ nums[i] ≤ 10^9',
    sampleInput: '6\n1 2 2 3 1 4',
    sampleOutput: '4',
    testCases: [
      { input: '6\n1 2 2 3 1 4', output: '4', isHidden: false },
      { input: '5\n1 2 3 4 5', output: '5', isHidden: false },
      { input: '7\n1 1 1 2 2 3 3', output: '3', isHidden: false },
      { input: '4\n5 5 5 5', output: '4', isHidden: true },
      { input: '8\n1 1 2 2 3 3 4 4', output: '8', isHidden: true },
      { input: '6\n10 10 20 20 30 30', output: '6', isHidden: true },
      { input: '9\n1 2 2 3 3 3 4 4 4', output: '3', isHidden: true },
      { input: '10\n100 200 100 300 200 100 400 500 300 200', output: '5', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'half-ascending-and-half-descending-sort': {
    statement: `Given an array arr of even size, sort the first half of the array in ascending order and the second half in descending order.

**Examples:**
- Input: arr[] = [10, 20, 30, 40] → Output: [10, 20, 40, 30]
  Explanation: The array is divided into two equal halves: [10, 20] and [30, 40]. The first half is already in ascending order, so it remains [10, 20]. The second half is sorted in descending order, changing [30, 40] to [40, 30]. Thus, the final array becomes [10, 20, 40, 30].
- Input: arr[] = [5, 4, 6, 2, 3, 8, 9, 7] → Output: [2, 4, 5, 6, 9, 8, 7, 3]
  Explanation: The array is divided into two equal halves: [5, 4, 6, 2] and [3, 8, 9, 7]. Sorting the first half in ascending order gives [2, 4, 5, 6]. Sorting the second half in descending order gives [9, 8, 7, 3]. Combining both halves, the final array becomes [2, 4, 5, 6, 9, 8, 7, 3].

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'First line contains N (size of even array), second line contains N space-separated integers.',
    outputFormat: 'Return the sorted array with first half in ascending and second half in descending order as space-separated integers.',
    constraints: '2 ≤ N ≤ 10^5 and N is even\n-10^9 ≤ arr[i] ≤ 10^9',
    sampleInput: '8\n5 4 6 2 3 8 9 7',
    sampleOutput: '2 4 5 6 9 8 7 3',
    testCases: [
      { input: '4\n10 20 30 40', output: '10 20 40 30', isHidden: false },
      { input: '8\n5 4 6 2 3 8 9 7', output: '2 4 5 6 9 8 7 3', isHidden: false },
      { input: '6\n1 2 3 4 5 6', output: '1 2 3 6 5 4', isHidden: false },
      { input: '4\n40 30 20 10', output: '20 30 40 10', isHidden: true },
      { input: '6\n-1 -2 -3 -4 -5 -6', output: '-6 -5 -4 -3 -2 -1', isHidden: true },
      { input: '8\n1 1 1 1 2 2 2 2', output: '1 1 1 1 2 2 2 2', isHidden: true },
      { input: '10\n9 8 7 6 5 4 3 2 1 0', output: '0 1 2 3 4 9 8 7 6 5', isHidden: true },
      { input: '6\n100 -100 50 -50 25 -25', output: '-100 -50 25 100 50 -25', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'sum-of-array': {
    statement: `Given an array of integers arr[], find the sum of its elements.

**Examples:**
- Input: arr[] = [1, 2, 3] → Output: 6
  Explanation: 1 + 2 + 3 = 6
- Input: arr[] = [15, 12, 13, 10] → Output: 50
  Explanation: 15 + 12 + 13 + 10 = 50

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'First line contains N (size of array), second line contains N space-separated integers.',
    outputFormat: 'Return the sum of all elements in the array.',
    constraints: '1 ≤ N ≤ 10^5\n-10^9 ≤ arr[i] ≤ 10^9',
    sampleInput: '4\n15 12 13 10',
    sampleOutput: '50',
    testCases: [
      { input: '3\n1 2 3', output: '6', isHidden: false },
      { input: '4\n15 12 13 10', output: '50', isHidden: false },
      { input: '5\n10 20 30 40 50', output: '150', isHidden: false },
      { input: '1\n100', output: '100', isHidden: true },
      { input: '5\n-1 -2 -3 -4 -5', output: '-15', isHidden: true },
      { input: '6\n-10 5 -3 8 12 -7', output: '5', isHidden: true },
      { input: '4\n1000000000 1000000000 1000000000 1000000000', output: '4000000000', isHidden: true },
      { input: '5\n-1000000000 1000000000 -1000000000 1000000000 0', output: '0', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'rotate-array': {
    statement: `Given an integer array nums, rotate the array to the right by k steps, where k is non-negative.

**Examples:**
- Input: nums = [1,2,3,4,5,6,7], k = 3 → Output: [5,6,7,1,2,3,4]
  Explanation: 
  - rotate 1 steps to the right: [7,1,2,3,4,5,6]
  - rotate 2 steps to the right: [6,7,1,2,3,4,5]
  - rotate 3 steps to the right: [5,6,7,1,2,3,4]
- Input: nums = [-1,-100,3,99], k = 2 → Output: [3,99,-1,-100]
  Explanation: 
  - rotate 1 steps to the right: [99,-1,-100,3]
  - rotate 2 steps to the right: [3,99,-1,-100]

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'First line contains N (size of array), second line contains N space-separated integers, third line contains k (number of rotations).',
    outputFormat: 'Return the rotated array as space-separated integers.',
    constraints: '1 ≤ N ≤ 10^5\n0 ≤ k ≤ 10^9\n-10^9 ≤ nums[i] ≤ 10^9',
    sampleInput: '7\n1 2 3 4 5 6 7\n3',
    sampleOutput: '5 6 7 1 2 3 4',
    testCases: [
      { input: '7\n1 2 3 4 5 6 7\n3', output: '5 6 7 1 2 3 4', isHidden: false },
      { input: '4\n-1 -100 3 99\n2', output: '3 99 -1 -100', isHidden: false },
      { input: '5\n1 2 3 4 5\n1', output: '5 1 2 3 4', isHidden: false },
      { input: '3\n1 2 3\n0', output: '1 2 3', isHidden: true },
      { input: '4\n1 2 3 4\n4', output: '1 2 3 4', isHidden: true },
      { input: '5\n1 2 3 4 5\n7', output: '4 5 1 2 3', isHidden: true },
      { input: '6\n-1 -100 3 99 50 -75\n2', output: '50 -75 -1 -100 3 99', isHidden: true },
      { input: '8\n10 20 30 40 50 60 70 80\n3', output: '60 70 80 10 20 30 40 50', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'mean-or-average-of-an-array': {
    statement: `Given an array arr[], return the floor value of the mean of its elements.

**Examples:**
- Input: arr[] = [1, 3, 4, 2, 6, 5, 8, 7] → Output: 4
  Explanation: Sum of the elements is 1 + 3 + 4 + 2 + 6 + 5 + 8 + 7 = 36, Mean = 36/8 = 4.5, floor(4.5) = 4.
- Input: arr[] = [4, 4, 4, 4, 4] → Output: 4
  Explanation: Sum of the elements is 4 + 4 + 4 + 4 + 4 = 20, Mean = 20/5 = 4.

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'First line contains N (size of array), second line contains N space-separated integers.',
    outputFormat: 'Return the floor value of the mean as a single integer.',
    constraints: '1 ≤ N ≤ 10^5\n-10^9 ≤ arr[i] ≤ 10^9',
    sampleInput: '8\n1 3 4 2 6 5 8 7',
    sampleOutput: '4',
    testCases: [
      { input: '8\n1 3 4 2 6 5 8 7', output: '4', isHidden: false },
      { input: '5\n4 4 4 4 4', output: '4', isHidden: false },
      { input: '3\n1 2 3', output: '2', isHidden: false },
      { input: '1\n10', output: '10', isHidden: true },
      { input: '4\n1 1 1 1', output: '1', isHidden: true },
      { input: '2\n5 10', output: '7', isHidden: true },
      { input: '5\n-1 -2 -3 -4 -5', output: '-3', isHidden: true },
      { input: '6\n10 20 30 40 50 60', output: '35', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'median-of-an-array': {
    statement: `Given an array arr[] of integers, calculate the median.

**Examples:**
- Input: arr[] = [90, 100, 78, 89, 67] → Output: 89
  Explanation: After sorting the array, the middle element is the median.
- Input: arr[] = [56, 67, 30, 79] → Output: 61.5
  Explanation: In case of even number of elements, average of two middle elements is the median.
- Input: arr[] = [1, 2] → Output: 1.5
  Explanation: The average of both elements will result in 1.5.

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'First line contains N (size of array), second line contains N space-separated integers.',
    outputFormat: 'Return the median as a decimal number (or integer if exact). For output with .5, display it as is.',
    constraints: '1 ≤ N ≤ 10^5\n-10^9 ≤ arr[i] ≤ 10^9',
    sampleInput: '5\n90 100 78 89 67',
    sampleOutput: '89',
    testCases: [
      { input: '5\n90 100 78 89 67', output: '89', isHidden: false },
      { input: '4\n56 67 30 79', output: '61.5', isHidden: false },
      { input: '2\n1 2', output: '1.5', isHidden: false },
      { input: '1\n50', output: '50', isHidden: true },
      { input: '3\n1 2 3', output: '2', isHidden: true },
      { input: '4\n10 20 30 40', output: '25', isHidden: true },
      { input: '6\n5 1 3 2 4 6', output: '3.5', isHidden: true },
      { input: '5\n-5 -1 0 1 5', output: '0', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'remove-duplicates-from-sorted-array': {
    statement: `Given a sorted array arr[] of size n, the goal is to rearrange the array so that all distinct elements appear at the beginning in sorted order. Additionally, return the length of this distinct sorted subarray.

**Note:** The elements after the distinct ones can be in any order and hold any value, as they don't affect the result.

**Examples:**
- Input: arr[] = [2, 2, 2, 2, 2] → Output: [2]
  Explanation: All the elements are 2, So only keep one instance of 2.
- Input: arr[] = [1, 2, 2, 3, 4, 4, 4, 5, 5] → Output: [1, 2, 3, 4, 5]
  Explanation: Remove all duplicate elements keeping only one instance of each.
- Input: arr[] = [1, 2, 3] → Output: [1, 2, 3]
  Explanation: No change as all elements are distinct.

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'First line contains N (size of sorted array), second line contains N space-separated integers (sorted in ascending order).',
    outputFormat: 'Return the distinct elements as space-separated integers. The length of the distinct subarray is implicitly shown by the output.',
    constraints: '1 ≤ N ≤ 10^5\n-10^9 ≤ arr[i] ≤ 10^9\nArray is always sorted in ascending order',
    sampleInput: '9\n1 2 2 3 4 4 4 5 5',
    sampleOutput: '1 2 3 4 5',
    testCases: [
      { input: '5\n2 2 2 2 2', output: '2', isHidden: false },
      { input: '9\n1 2 2 3 4 4 4 5 5', output: '1 2 3 4 5', isHidden: false },
      { input: '3\n1 2 3', output: '1 2 3', isHidden: false },
      { input: '1\n5', output: '5', isHidden: true },
      { input: '4\n1 1 1 1', output: '1', isHidden: true },
      { input: '6\n1 1 2 2 3 3', output: '1 2 3', isHidden: true },
      { input: '8\n-5 -5 -2 0 1 1 3 3', output: '-5 -2 0 1 3', isHidden: true },
      { input: '10\n1 2 2 3 3 3 4 4 5 5', output: '1 2 3 4 5', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'insert-element-at-a-given-position-in-an-array': {
    statement: `Given an array of integers, the task is to insert an element at a given position in the array.

**Examples:**
- Input: arr[] = [10, 20, 30, 40], pos = 2, ele = 50 → Output: [10, 50, 20, 30, 40]
  Explanation: Insert element 50 at position 2 (1-indexed), shifting [20, 30, 40] to the right.
- Input: arr[] = [], pos = 1, ele = 20 → Output: [20]
  Explanation: Empty array, insert at position 1.
- Input: arr[] = [10, 20, 30, 40], pos = 5, ele = 50 → Output: [10, 20, 30, 40, 50]
  Explanation: Insert at the end when position equals array length + 1.

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'First line contains N (size of array), second line contains N space-separated integers, third line contains pos (1-indexed position), fourth line contains ele (element to insert).',
    outputFormat: 'Return the array after inserting the element as space-separated integers.',
    constraints: '0 ≤ N ≤ 10^5\n1 ≤ pos ≤ N + 1\n-10^9 ≤ arr[i], ele ≤ 10^9',
    sampleInput: '4\n10 20 30 40\n2\n50',
    sampleOutput: '10 50 20 30 40',
    testCases: [
      { input: '4\n10 20 30 40\n2\n50', output: '10 50 20 30 40', isHidden: false },
      { input: '0\n\n1\n20', output: '20', isHidden: false },
      { input: '4\n10 20 30 40\n5\n50', output: '10 20 30 40 50', isHidden: false },
      { input: '3\n1 2 3\n1\n0', output: '0 1 2 3', isHidden: true },
      { input: '1\n5\n2\n10', output: '5 10', isHidden: true },
      { input: '5\n10 20 30 40 50\n3\n25', output: '10 20 25 30 40 50', isHidden: true },
      { input: '4\n-10 -5 5 10\n2\n0', output: '-10 0 -5 5 10', isHidden: true },
      { input: '6\n1 2 3 4 5 6\n4\n99', output: '1 2 3 99 4 5 6', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'find-all-duplicates-in-an-array': {
    statement: `Given an integer array nums of length n where all the integers of nums are in the range [1, n] and each integer appears at most twice, return an array of all the integers that appear twice.

**Note:** You must write an algorithm that runs in O(n) time and uses only constant auxiliary space, excluding the space needed to store the output.

**Examples:**
- Input: nums = [4,3,2,7,8,2,3,1] → Output: [2,3]
  Explanation: The elements 2 and 3 appear twice in the array.
- Input: nums = [1,1,2] → Output: [1]
  Explanation: The element 1 appears twice.
- Input: nums = [1] → Output: []
  Explanation: No element appears twice.

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'First line contains N (length of array), second line contains N space-separated integers where all integers are in range [1, n] and each appears at most twice.',
    outputFormat: 'Return the array of integers that appear twice, in any order, as space-separated integers.',
    constraints: '1 ≤ N ≤ 10^5\n1 ≤ nums[i] ≤ N\nEach integer appears at most twice',
    sampleInput: '8\n4 3 2 7 8 2 3 1',
    sampleOutput: '2 3',
    testCases: [
      { input: '8\n4 3 2 7 8 2 3 1', output: '2 3', isHidden: false },
      { input: '3\n1 1 2', output: '1', isHidden: false },
      { input: '1\n1', output: '', isHidden: false },
      { input: '4\n1 1 2 2', output: '1 2', isHidden: true },
      { input: '5\n5 5 4 4 3', output: '4 5', isHidden: true },
      { input: '10\n1 2 3 4 5 6 7 8 9 5', output: '5', isHidden: true },
      { input: '6\n3 1 3 4 2 2', output: '2 3', isHidden: true },
      { input: '7\n4 1 2 1 2 3 3', output: '1 2 3', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'first-non-repeating-element': {
    statement: `Find the first non-repeating element in a given array arr of integers and if there is no present any non-repeating element then return 0.

**Note:** The array consists of only positive and negative integers and not zero.

**Examples:**
- Input: arr[] = [-1, 2, -1, 3, 2] → Output: 3
  Explanation: -1 and 2 are repeating whereas 3 is the only number occurring once. Hence, the output is 3.
- Input: arr[] = [1, 1, 1] → Output: 0
  Explanation: There is no present any non-repeating element so answer should be 0.

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'First line contains N (size of array), second line contains N space-separated integers.',
    outputFormat: 'Return the first non-repeating element in the array, or 0 if no such element exists.',
    constraints: '1 ≤ N ≤ 10^5\n-10^9 ≤ arr[i] ≤ 10^9\nArray does not contain zero',
    sampleInput: '5\n-1 2 -1 3 2',
    sampleOutput: '3',
    testCases: [
      { input: '5\n-1 2 -1 3 2', output: '3', isHidden: false },
      { input: '3\n1 1 1', output: '0', isHidden: false },
      { input: '4\n1 2 3 4', output: '1', isHidden: false },
      { input: '6\n5 5 2 3 2 1', output: '3', isHidden: true },
      { input: '7\n-10 -10 5 3 5 -10 7', output: '3', isHidden: true },
      { input: '5\n100 200 100 300 200', output: '300', isHidden: true },
      { input: '8\n1 2 1 3 2 3 4 4', output: '0', isHidden: true },
      { input: '6\n-5 -5 10 20 10 -3', output: '20', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'symmetric-pairs-in-an-array': {
    statement: `Given an array of pairs arr[], a pair (a, b) is said to be symmetric with (c, d) if b = c and a = d. In other words, reversing the elements of one pair should result in the other pair. The first element of each pair is guaranteed to be distinct.

**Examples:**
- Input: arr[] = [[10, 20], [30, 40], [20, 10], [50, 60]] → Output: [10, 20]
  Explanation: [10, 20] and [20, 10] form a symmetric pair.
- Input: arr[] = [[1, 2], [2, 3], [3, 4], [4, 1], [3, 2]] → Output: [2, 3]
  Explanation: [2, 3] and [3, 2] are symmetric pairs.
- Input: arr[] = [[5, 8], [7, 9], [8, 5], [9, 7], [6, 10]] → Output: [5, 8] [7, 9]
  Explanation: [5, 8] & [8, 5] and [7, 9] & [9, 7] are symmetric pairs.

Complete the function signature provided in the editor to parse the input parameters and return the correct result. Return all symmetric pairs, with the first element of the pair being smaller.`,
    inputFormat: 'First line contains N (number of pairs), next N lines each contain two space-separated integers representing a pair.',
    outputFormat: 'Return all symmetric pairs, one per line in format "a b", where a < b. If no symmetric pairs exist, return empty.',
    constraints: '1 ≤ N ≤ 10^5\n-10^9 ≤ pair[i] ≤ 10^9\nFirst element of each pair is distinct',
    sampleInput: '4\n10 20\n30 40\n20 10\n50 60',
    sampleOutput: '10 20',
    testCases: [
      { input: '4\n10 20\n30 40\n20 10\n50 60', output: '10 20', isHidden: false },
      { input: '5\n1 2\n2 3\n3 4\n4 1\n3 2', output: '2 3', isHidden: false },
      { input: '5\n5 8\n7 9\n8 5\n9 7\n6 10', output: '5 8\n7 9', isHidden: false },
      { input: '3\n1 2\n3 4\n5 6', output: '', isHidden: true },
      { input: '2\n100 200\n200 100', output: '100 200', isHidden: true },
      { input: '6\n1 1\n2 2\n1 2\n2 1\n3 3\n4 5', output: '1 2', isHidden: true },
      { input: '8\n-5 10\n10 -5\n3 7\n7 3\n2 2\n0 0\n-1 5\n5 -1', output: '-5 10\n-1 5\n3 7', isHidden: true },
      { input: '4\n1000000000 -1000000000\n-1000000000 1000000000\n999999999 888888888\n888888888 999999999', output: '-1000000000 1000000000\n888888888 999999999', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'maximum-product-subarray': {
    statement: `Given an integer array nums, find a subarray that has the largest product, and return the product.

The test cases are generated so that the answer will fit in a 32-bit integer.

**Note:** The product of an array with a single element is the value of that element.

**Examples:**
- Input: nums = [2,3,-2,4] → Output: 6
  Explanation: [2,3] has the largest product 6.
- Input: nums = [-2,0,-1] → Output: 0
  Explanation: The result cannot be 2, because [-2,-1] is not a subarray.

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'First line contains N (size of array), second line contains N space-separated integers.',
    outputFormat: 'Return the maximum product of any contiguous subarray as a single integer.',
    constraints: '1 ≤ N ≤ 2 × 10^5\n-10 ≤ nums[i] ≤ 10\nAnswer fits in 32-bit integer',
    sampleInput: '4\n2 3 -2 4',
    sampleOutput: '6',
    testCases: [
      { input: '4\n2 3 -2 4', output: '6', isHidden: false },
      { input: '3\n-2 0 -1', output: '0', isHidden: false },
      { input: '1\n5', output: '5', isHidden: false },
      { input: '5\n-2 3 -4 5 -1', output: '120', isHidden: true },
      { input: '4\n0 -4 2 3', output: '6', isHidden: true },
      { input: '6\n2 3 -2 4 -5 8', output: '960', isHidden: true },
      { input: '5\n-1 -2 -3 -4 -5', output: '120', isHidden: true },
      { input: '7\n1 2 3 4 5 6 7', output: '5040', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'rank-transform-of-an-array': {
    statement: `Given an array of integers arr, replace each element with its rank.

The rank represents how large the element is. The rank has the following rules:
- Rank is an integer starting from 1.
- The larger the element, the larger the rank.
- If two elements are equal, their rank must be the same.
- Rank should be as small as possible.

**Examples:**
- Input: arr = [40,10,20,30] → Output: [4,1,2,3]
  Explanation: 40 is the largest element. 10 is the smallest. 20 is the second smallest. 30 is the third smallest.
- Input: arr = [100,100,100] → Output: [1,1,1]
  Explanation: Same elements share the same rank.
- Input: arr = [37,12,28,9,100,56,80,5,12] → Output: [5,3,4,2,8,6,7,1,3]
  Explanation: 5 is smallest (rank 1), 9 is second smallest (rank 2), etc. The two 12s both get rank 3.

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'First line contains N (size of array), second line contains N space-separated integers.',
    outputFormat: 'Return the array with each element replaced by its rank, as space-separated integers.',
    constraints: '1 ≤ N ≤ 10^4\n0 ≤ arr[i] ≤ 10^9\nDifferent elements should have different ranks unless they are equal',
    sampleInput: '4\n40 10 20 30',
    sampleOutput: '4 1 2 3',
    testCases: [
      { input: '4\n40 10 20 30', output: '4 1 2 3', isHidden: false },
      { input: '3\n100 100 100', output: '1 1 1', isHidden: false },
      { input: '9\n37 12 28 9 100 56 80 5 12', output: '5 3 4 2 8 6 7 1 3', isHidden: false },
      { input: '1\n42', output: '1', isHidden: true },
      { input: '5\n5 4 3 2 1', output: '5 4 3 2 1', isHidden: true },
      { input: '5\n1 2 3 4 5', output: '1 2 3 4 5', isHidden: true },
      { input: '6\n10 20 10 30 20 10', output: '1 2 1 3 2 1', isHidden: true },
      { input: '8\n1000000000 1 1000000000 999999999 1 999999999 500000000 1', output: '8 1 8 7 1 7 6 1', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'sort-elements-by-frequency': {
    statement: `Given an array of integers arr[], sort the array according to the frequency of elements, i.e. elements that have higher frequency comes first. If the frequencies of two elements are the same, then the smaller number comes first.

**Examples:**
- Input: arr[] = [5, 5, 4, 6, 4] → Output: [4, 4, 5, 5, 6]
  Explanation: The highest frequency here is 2. Both 5 and 4 have that frequency. Now since the frequencies are the same the smaller element comes first. So 4 comes first then comes 5. Finally comes 6. The output is 4 4 5 5 6.
- Input: arr[] = [9, 9, 9, 2, 5] → Output: [9, 9, 9, 2, 5]
  Explanation: The highest frequency here is 3. Element 9 has the highest frequency So 9 comes first. Now both 2 and 5 have the same frequency. So we print smaller elements first. The output is 9 9 9 2 5.

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'First line contains N (size of array), second line contains N space-separated integers.',
    outputFormat: 'Return the array sorted by frequency (descending) and then by value (ascending) for ties, as space-separated integers.',
    constraints: '1 ≤ N ≤ 10^5\n-10^9 ≤ arr[i] ≤ 10^9\nFrequency-based sorting with value tie-breaking',
    sampleInput: '5\n5 5 4 6 4',
    sampleOutput: '4 4 5 5 6',
    testCases: [
      { input: '5\n5 5 4 6 4', output: '4 4 5 5 6', isHidden: false },
      { input: '5\n9 9 9 2 5', output: '9 9 9 2 5', isHidden: false },
      { input: '1\n42', output: '42', isHidden: false },
      { input: '7\n1 1 1 2 2 3 4', output: '1 1 1 2 2 3 4', isHidden: true },
      { input: '6\n5 5 5 5 5 5', output: '5 5 5 5 5 5', isHidden: true },
      { input: '8\n1 2 2 3 3 3 4 4', output: '3 3 3 2 2 4 4 1', isHidden: true },
      { input: '9\n-1 -1 0 1 1 1 2 2 3', output: '1 1 1 -1 -1 2 2 0 3', isHidden: true },
      { input: '10\n10 20 10 30 20 10 40 30 20 50', output: '10 10 10 20 20 20 30 30 40 50', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'equilibrium-index': {
    statement: `Given an array arr[] of size n, find an equilibrium index (if any) or -1 if no equilibrium index exists. The equilibrium index of an array is an index such that the sum of all elements at lower indexes equals the sum of all elements at higher indexes. When the index is at the start of the array, the left sum is 0, and when it's at the end, the right sum is 0.

**Note:** If multiple equilibrium indices exist, return the first one encountered from left to right.

**Examples:**
- Input: arr[] = [1, 2, 0, 3] → Output: 2
  Explanation: The sum on the left of index 2 is 1 + 2 = 3 and sum on the right of index 2 is 3.
- Input: arr[] = [1, 1, 1, 1] → Output: -1
  Explanation: There is no equilibrium index in the array.
- Input: arr[] = [-7, 1, 5, 2, -4, 3, 0] → Output: 3
  Explanation: The sum on the left of index 3 is -7 + 1 + 5 = -1 and sum on the right of index 3 is -4 + 3 + 0 = -1.

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'First line contains N (size of array), second line contains N space-separated integers.',
    outputFormat: 'Return the equilibrium index (0-indexed) or -1 if no equilibrium index exists.',
    constraints: '1 ≤ N ≤ 10^5\n-10^9 ≤ arr[i] ≤ 10^9\nReturn first equilibrium index from left to right',
    sampleInput: '4\n1 2 0 3',
    sampleOutput: '2',
    testCases: [
      { input: '4\n1 2 0 3', output: '2', isHidden: false },
      { input: '4\n1 1 1 1', output: '-1', isHidden: false },
      { input: '7\n-7 1 5 2 -4 3 0', output: '3', isHidden: false },
      { input: '1\n5', output: '0', isHidden: true },
      { input: '3\n0 0 0', output: '0', isHidden: true },
      { input: '5\n3 2 -1 1 -1', output: '2', isHidden: true },
      { input: '6\n-1 -2 -3 -4 10 0', output: '4', isHidden: true },
      { input: '8\n15 1 -1 -8 -4 -3 -10 5', output: '1', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'array-after-k-rotations': {
    statement: `Given an array arr[] and an integer k, rotate the array in place k times to the right (clockwise). In each rotation, the last element moves to the front, and all other elements shift one position to the right. Modify the array in place, do not return anything.

**Examples:**
- Input: arr[] = [1, 2, 3, 4, 5, 6], k = 2 → Output: [5, 6, 1, 2, 3, 4]
  Explanation: We perform 2 right rotations (since k = 2):
  - After 1st rotation: Last element moves to front → [6, 1, 2, 3, 4, 5]
  - After 2nd rotation: Again, last element to front → [5, 6, 1, 2, 3, 4]
- Input: arr[] = [1, 2, 3, 4, 5], k = 4 → Output: [2, 3, 4, 5, 1]
  Explanation: We rotate the array 4 times to the right:
  - After 1st rotation: [5, 1, 2, 3, 4]
  - After 2nd rotation: [4, 5, 1, 2, 3]
  - After 3rd rotation: [3, 4, 5, 1, 2]
  - After 4th rotation: [2, 3, 4, 5, 1]

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'First line contains N (size of array), second line contains N space-separated integers, third line contains k (number of rotations).',
    outputFormat: 'Return the array after k right rotations as space-separated integers.',
    constraints: '1 ≤ N ≤ 10^5\n0 ≤ k ≤ 10^9\n-10^9 ≤ arr[i] ≤ 10^9',
    sampleInput: '6\n1 2 3 4 5 6\n2',
    sampleOutput: '5 6 1 2 3 4',
    testCases: [
      { input: '6\n1 2 3 4 5 6\n2', output: '5 6 1 2 3 4', isHidden: false },
      { input: '5\n1 2 3 4 5\n4', output: '2 3 4 5 1', isHidden: false },
      { input: '4\n1 2 3 4\n0', output: '1 2 3 4', isHidden: false },
      { input: '3\n1 2 3\n1', output: '3 1 2', isHidden: true },
      { input: '5\n1 2 3 4 5\n5', output: '1 2 3 4 5', isHidden: true },
      { input: '4\n1 2 3 4\n8', output: '1 2 3 4', isHidden: true },
      { input: '6\n-1 -100 3 99 50 -75\n2', output: '50 -75 -1 -100 3 99', isHidden: true },
      { input: '7\n10 20 30 40 50 60 70\n3', output: '50 60 70 10 20 30 40', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'sort-an-array-according-to-the-order-defined-by-another-array': {
    statement: `Given two arrays a1[] and a2[], sort a1[] such that elements appear in the order of a2[]. Elements not in a2[] should be placed at the end in ascending order.

**Examples:**
- Input: a1 = [2, 1, 2, 3, 4], a2 = [2, 1, 2] → Output: [2, 2, 1, 3, 4]
  Explanation: Elements 2 and 1 follow the order in a2. Remaining 3 and 4 are sorted at the end.
- Input: a1 = [4, 1, 3, 3, 2], a2 = [3, 1] → Output: [3, 3, 1, 2, 4]
  Explanation: Elements 3 and 1 come first as per a2. Others (2, 4) are sorted and placed after.

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'First line contains N (size of a1), second line contains N space-separated integers of a1, third line contains M (size of a2), fourth line contains M space-separated integers of a2.',
    outputFormat: 'Return the sorted array a1 according to a2 order, with remaining elements in ascending order, as space-separated integers.',
    constraints: '1 ≤ N, M ≤ 10^5\n-10^9 ≤ a1[i], a2[i] ≤ 10^9\nElements not in a2 sorted in ascending order at end',
    sampleInput: '5\n2 1 2 3 4\n3\n2 1 2',
    sampleOutput: '2 2 1 3 4',
    testCases: [
      { input: '5\n2 1 2 3 4\n3\n2 1 2', output: '2 2 1 3 4', isHidden: false },
      { input: '5\n4 1 3 3 2\n2\n3 1', output: '3 3 1 2 4', isHidden: false },
      { input: '4\n1 2 3 4\n2\n4 2', output: '4 2 1 3', isHidden: false },
      { input: '3\n5 4 3\n3\n5 4 3', output: '5 4 3', isHidden: true },
      { input: '6\n2 2 1 1 3 3\n2\n2 1', output: '2 2 1 1 3 3', isHidden: true },
      { input: '5\n10 20 30 40 50\n2\n50 30', output: '50 30 10 20 40', isHidden: true },
      { input: '7\n5 1 3 2 4 6 7\n3\n7 5 1', output: '7 5 1 2 3 4 6', isHidden: true },
      { input: '8\n-5 3 -1 8 2 -3 0 4\n3\n8 -5 2', output: '8 -5 2 -3 -1 0 3 4', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'array-search': {
    statement: `Given an array, arr[] of n integers, and an integer element x, find whether element x is present in the array. Return the index of the first occurrence of x in the array, or -1 if it doesn't exist.

**Examples:**
- Input: arr[] = [1, 2, 3, 4], x = 3 → Output: 2
  Explanation: For array [1, 2, 3, 4], the element to be searched is 3. Since 3 is present at index 2, the output is 2.
- Input: arr[] = [10, 8, 30, 4, 5], x = 5 → Output: 4
  Explanation: For array [10, 8, 30, 4, 5], the element to be searched is 5 and it is at index 4. So, the output is 4.
- Input: arr[] = [10, 8, 30], x = 6 → Output: -1
  Explanation: The element to be searched is 6 and it is not present, so we return -1.

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'First line contains N (size of array), second line contains N space-separated integers, third line contains x (element to search).',
    outputFormat: 'Return the index of the first occurrence of x in the array, or -1 if not found.',
    constraints: '1 ≤ N ≤ 10^5\n-10^9 ≤ arr[i], x ≤ 10^9\nReturn first occurrence index (0-indexed)',
    sampleInput: '4\n1 2 3 4\n3',
    sampleOutput: '2',
    testCases: [
      { input: '4\n1 2 3 4\n3', output: '2', isHidden: false },
      { input: '5\n10 8 30 4 5\n5', output: '4', isHidden: false },
      { input: '3\n10 8 30\n6', output: '-1', isHidden: false },
      { input: '1\n5\n5', output: '0', isHidden: true },
      { input: '5\n1 1 1 1 1\n1', output: '0', isHidden: true },
      { input: '6\n5 5 3 5 2 5\n5', output: '0', isHidden: true },
      { input: '7\n-10 5 20 -5 30 0 -3\n-5', output: '3', isHidden: true },
      { input: '8\n100 200 300 400 500 600 700 800\n150', output: '-1', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'check-if-an-array-is-subset-of-another-array': {
    statement: `Given two arrays a[] and b[] of size m and n respectively, the task is to determine whether b[] is a subset of a[]. Both arrays are not sorted, and elements are distinct.

**Examples:**
- Input: a[] = [11, 1, 13, 21, 3, 7], b[] = [11, 3, 7, 1] → Output: true
  Explanation: All elements of b[] are present in a[], so b[] is a subset of a[].
- Input: a[]= [1, 2, 3, 4, 5, 6], b = [1, 2, 4] → Output: true
  Explanation: All elements 1, 2, 4 of b[] are present in a[].
- Input: a[] = [10, 5, 2, 23, 19], b = [19, 5, 3] → Output: false
  Explanation: Element 3 is in b[] but not in a[], so b[] is not a subset of a[].

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'First line contains m (size of a[]), second line contains m space-separated integers of a[], third line contains n (size of b[]), fourth line contains n space-separated integers of b[].',
    outputFormat: 'Return "true" if b[] is a subset of a[], otherwise return "false".',
    constraints: '1 ≤ m, n ≤ 10^5\n-10^9 ≤ a[i], b[i] ≤ 10^9\nAll elements are distinct within each array',
    sampleInput: '6\n11 1 13 21 3 7\n4\n11 3 7 1',
    sampleOutput: 'true',
    testCases: [
      { input: '6\n11 1 13 21 3 7\n4\n11 3 7 1', output: 'true', isHidden: false },
      { input: '6\n1 2 3 4 5 6\n3\n1 2 4', output: 'true', isHidden: false },
      { input: '5\n10 5 2 23 19\n3\n19 5 3', output: 'false', isHidden: false },
      { input: '4\n1 2 3 4\n1\n5', output: 'false', isHidden: true },
      { input: '5\n1 2 3 4 5\n5\n5 4 3 2 1', output: 'true', isHidden: true },
      { input: '3\n10 20 30\n3\n10 20 30', output: 'true', isHidden: true },
      { input: '7\n1 2 3 4 5 6 7\n4\n2 4 6 8', output: 'false', isHidden: true },
      { input: '8\n-5 10 15 -10 20 25 30 -15\n4\n10 -10 25 30', output: 'true', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'check-if-a-number-is-palindrome': {
    statement: `Given an integer n, determine whether it is a palindrome number or not. A number is called a palindrome if it reads the same from forward and backward.

**Examples:**
- Input: n = 12321 → Output: true
  Explanation: 12321 is a palindrome number because it reads same forward and backward.
- Input: n = -121 → Output: true
  Explanation: When checking if a number is palindrome, we mainly ignore the sign.
- Input: n = 1234 → Output: false
  Explanation: 1234 is not a palindrome number because it does not read the same forward and backward.

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'A single integer n.',
    outputFormat: 'Return "true" if n is a palindrome, otherwise return "false".',
    constraints: '-2^31 ≤ n ≤ 2^31 - 1\nSign is ignored for palindrome check',
    sampleInput: '12321',
    sampleOutput: 'true',
    testCases: [
      { input: '12321', output: 'true', isHidden: false },
      { input: '-121', output: 'true', isHidden: false },
      { input: '1234', output: 'false', isHidden: false },
      { input: '0', output: 'true', isHidden: true },
      { input: '9', output: 'true', isHidden: true },
      { input: '10', output: 'false', isHidden: true },
      { input: '121', output: 'true', isHidden: true },
      { input: '1221', output: 'true', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'palindromes-in-a-range': {
    statement: `Given two integers m and n, find all palindrome numbers between m and n (inclusive).

**Examples:**
- Input: m = 10, n = 115 → Output: [11, 22, 33, 44, 55, 66, 77, 88, 99, 101, 111]
  Explanation: The palindrome numbers in the range [10, 115] are 11, 22, 33, 44, 55, 66, 77, 88, 99, 101, and 111.
- Input: m = 2, n = 5 → Output: [2, 3, 4, 5]
  Explanation: All numbers in the range [2, 5] are palindrome numbers.

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'First line contains m (lower bound), second line contains n (upper bound).',
    outputFormat: 'Return all palindrome numbers in the range [m, n] as space-separated integers.',
    constraints: '1 ≤ m ≤ n ≤ 10^5\nReturn all palindromes in ascending order',
    sampleInput: '10\n115',
    sampleOutput: '11 22 33 44 55 66 77 88 99 101 111',
    testCases: [
      { input: '10\n115', output: '11 22 33 44 55 66 77 88 99 101 111', isHidden: false },
      { input: '2\n5', output: '2 3 4 5', isHidden: false },
      { input: '1\n10', output: '1 2 3 4 5 6 7 8 9', isHidden: false },
      { input: '100\n150', output: '101 111 121 131 141', isHidden: true },
      { input: '50\n60', output: '55', isHidden: true },
      { input: '99\n102', output: '99 101', isHidden: true },
      { input: '1\n1', output: '1', isHidden: true },
      { input: '200\n212', output: '202 212', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'check-if-a-number-is-prime': {
    statement: `Given a number n, check whether it is a prime number or not.

**Note:** A prime number is a number greater than 1 that has no positive divisors other than 1 and itself.

**Examples:**
- Input: n = 7 → Output: true
  Explanation: 7 is a prime number because it is greater than 1 and has no divisors other than 1 and itself.
- Input: n = 25 → Output: false
  Explanation: 25 is not a prime number because it is divisible by 5 (25 = 5 × 5), so it has divisors other than 1 and itself.
- Input: n = 1 → Output: false
  Explanation: 1 has only one divisor (1 itself), which is not sufficient for it to be considered prime.

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'A single integer n.',
    outputFormat: 'Return "true" if n is a prime number, otherwise return "false".',
    constraints: '1 ≤ n ≤ 10^5\nPrime check: divisors only 1 and n itself',
    sampleInput: '7',
    sampleOutput: 'true',
    testCases: [
      { input: '7', output: 'true', isHidden: false },
      { input: '25', output: 'false', isHidden: false },
      { input: '1', output: 'false', isHidden: false },
      { input: '2', output: 'true', isHidden: true },
      { input: '13', output: 'true', isHidden: true },
      { input: '100', output: 'false', isHidden: true },
      { input: '97', output: 'true', isHidden: true },
      { input: '91', output: 'false', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'primes-in-a-range': {
    statement: `Given two integers l and r, find and return all prime numbers in the range [l, r] (inclusive).

**Examples:**
- Input: l = 1, r = 10 → Output: [2, 3, 5, 7]
  Explanation: The prime numbers between 1 and 10 are 2, 3, 5 and 7.
- Input: l = 2, r = 5 → Output: [2, 3, 5]
  Explanation: The prime numbers between 2 and 5 are 2, 3 and 5.

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'First line contains l (lower bound), second line contains r (upper bound).',
    outputFormat: 'Return all prime numbers in the range [l, r] as space-separated integers in ascending order.',
    constraints: '1 ≤ l ≤ r ≤ 10^5\nReturn all primes in ascending order',
    sampleInput: '1\n10',
    sampleOutput: '2 3 5 7',
    testCases: [
      { input: '1\n10', output: '2 3 5 7', isHidden: false },
      { input: '2\n5', output: '2 3 5', isHidden: false },
      { input: '10\n20', output: '11 13 17 19', isHidden: false },
      { input: '1\n2', output: '2', isHidden: true },
      { input: '50\n60', output: '53 59', isHidden: true },
      { input: '97\n100', output: '97', isHidden: true },
      { input: '1\n1', output: '', isHidden: true },
      { input: '80\n100', output: '83 89 97', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'equilibrium-index': {
    statement: `Given an array arr[] of size n, find an equilibrium index (if any) or -1 if no equilibrium index exists. The equilibrium index of an array is an index such that the sum of all elements at lower indexes equals the sum of all elements at higher indexes. When the index is at the start of the array, the left sum is 0, and when it's at the end, the right sum is 0.

**Note:** If multiple equilibrium indices exist, return the first one encountered from left to right.

**Examples:**
- Input: arr[] = [1, 2, 0, 3] → Output: 2
  Explanation: The sum on the left of index 2 is 1 + 2 = 3 and sum on the right of index 2 is 3.
- Input: arr[] = [1, 1, 1, 1] → Output: -1
  Explanation: There is no equilibrium index in the array.
- Input: arr[] = [-7, 1, 5, 2, -4, 3, 0] → Output: 3
  Explanation: The sum on the left of index 3 is -7 + 1 + 5 = -1 and sum on the right of index 3 is -4 + 3 + 0 = -1

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'First line contains N (size of array), second line contains N space-separated integers.',
    outputFormat: 'Return the equilibrium index (0-indexed) or -1 if no equilibrium index exists.',
    constraints: '1 ≤ N ≤ 10^5\n-10^9 ≤ arr[i] ≤ 10^9\nReturn first equilibrium index from left to right',
    sampleInput: '4\n1 2 0 3',
    sampleOutput: '2',
    testCases: [
      { input: '4\n1 2 0 3', output: '2', isHidden: false },
      { input: '4\n1 1 1 1', output: '-1', isHidden: false },
      { input: '7\n-7 1 5 2 -4 3 0', output: '3', isHidden: false },
      { input: '1\n0', output: '0', isHidden: true },
      { input: '3\n0 0 0', output: '0', isHidden: true },
      { input: '5\n1 2 3 2 1', output: '2', isHidden: true },
      { input: '6\n-1 -1 -1 1 1 1', output: '2', isHidden: true },
      { input: '8\n10 -5 3 2 -4 7 -2 1', output: '-1', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'check-if-a-number-is-armstrong-number-of-not': {
    statement: `You are given a 3-digit number n. Find whether it is an Armstrong number or not.

An Armstrong number of three digits is a number such that the sum of the cubes of its digits is equal to the number itself. For example, 371 is an Armstrong number since 3³ + 7³ + 1³ = 27 + 343 + 1 = 371.

**Examples:**
- Input: n = 153 → Output: true
  Explanation: 153 is an Armstrong number since 1³ + 5³ + 3³ = 1 + 125 + 27 = 153.
- Input: n = 372 → Output: false
  Explanation: 372 is not an Armstrong number since 3³ + 7³ + 2³ = 27 + 343 + 8 = 378 ≠ 372.
- Input: n = 100 → Output: false
  Explanation: 100 is not an Armstrong number since 1³ + 0³ + 0³ = 1 + 0 + 0 = 1 ≠ 100.

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'A single 3-digit integer n.',
    outputFormat: 'Return "true" if n is an Armstrong number, otherwise return "false".',
    constraints: '100 ≤ n ≤ 999\nCheck if sum of cubes of digits equals the number',
    sampleInput: '153',
    sampleOutput: 'true',
    testCases: [
      { input: '153', output: 'true', isHidden: false },
      { input: '372', output: 'false', isHidden: false },
      { input: '100', output: 'false', isHidden: false },
      { input: '371', output: 'true', isHidden: true },
      { input: '407', output: 'true', isHidden: true },
      { input: '200', output: 'false', isHidden: true },
      { input: '999', output: 'false', isHidden: true },
      { input: '370', output: 'false', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'check-if-a-number-is-perfect-number': {
    statement: `A perfect number is a positive integer that is equal to the sum of its positive divisors, excluding the number itself. A divisor of an integer x is an integer that can divide x evenly.

Given an integer n, return true if n is a perfect number, otherwise return false.

**Examples:**
- Input: num = 28 → Output: true
  Explanation: 28 = 1 + 2 + 4 + 7 + 14. The divisors of 28 are 1, 2, 4, 7, and 14.
- Input: num = 7 → Output: false
  Explanation: 7 has only 1 as a divisor (excluding itself), so the sum of divisors is 1, which is not equal to 7.
- Input: num = 6 → Output: true
  Explanation: 6 = 1 + 2 + 3. The divisors of 6 are 1, 2, and 3.

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'A single positive integer n.',
    outputFormat: 'Return "true" if n is a perfect number, otherwise return "false".',
    constraints: '1 ≤ n ≤ 10^8\nDivisors exclude the number itself\nA divisor evenly divides n',
    sampleInput: '28',
    sampleOutput: 'true',
    testCases: [
      { input: '28', output: 'true', isHidden: false },
      { input: '7', output: 'false', isHidden: false },
      { input: '6', output: 'true', isHidden: false },
      { input: '1', output: 'false', isHidden: true },
      { input: '496', output: 'true', isHidden: true },
      { input: '8128', output: 'true', isHidden: true },
      { input: '100', output: 'false', isHidden: true },
      { input: '10', output: 'false', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'even-or-odd': {
    statement: `Given a number n, check whether it is even or odd. Return true for even and false for odd.

A number is even if it is divisible by 2 (i.e., n % 2 = 0).
A number is odd if it is not divisible by 2 (i.e., n % 2 = 1).

**Examples:**
- Input: n = 15 → Output: false
  Explanation: 15 % 2 = 1, so 15 is odd.
- Input: n = 44 → Output: true
  Explanation: 44 % 2 = 0, so 44 is even.
- Input: n = 2 → Output: true
  Explanation: 2 % 2 = 0, so 2 is even.

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'A single integer n.',
    outputFormat: 'Return "true" if n is even, otherwise return "false".',
    constraints: '-10^9 ≤ n ≤ 10^9\nA number is even if divisible by 2, odd otherwise',
    sampleInput: '15',
    sampleOutput: 'false',
    testCases: [
      { input: '15', output: 'false', isHidden: false },
      { input: '44', output: 'true', isHidden: false },
      { input: '2', output: 'true', isHidden: false },
      { input: '1', output: 'false', isHidden: true },
      { input: '0', output: 'true', isHidden: true },
      { input: '100', output: 'true', isHidden: true },
      { input: '-5', output: 'false', isHidden: true },
      { input: '-100', output: 'true', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'check-weather-a-given-number-is-positive-or-negative': {
    statement: `Given a number n, check whether it's positive or negative.

**Definitions:**
- Positive: n > 0
- Negative: n < 0
- Zero is neither positive nor negative

**Examples:**
- Input: n = 5 → Output: Positive
  Explanation: 5 > 0, so 5 is positive.
- Input: n = -6 → Output: Negative
  Explanation: -6 < 0, so -6 is negative.
- Input: n = 0 → Output: Zero
  Explanation: 0 is neither positive nor negative.

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'A single integer n.',
    outputFormat: 'Return "Positive" if n > 0, "Negative" if n < 0, or "Zero" if n = 0.',
    constraints: '-10^9 ≤ n ≤ 10^9\nDistinguish between positive, negative, and zero',
    sampleInput: '5',
    sampleOutput: 'Positive',
    testCases: [
      { input: '5', output: 'Positive', isHidden: false },
      { input: '-6', output: 'Negative', isHidden: false },
      { input: '0', output: 'Zero', isHidden: false },
      { input: '1', output: 'Positive', isHidden: true },
      { input: '-1', output: 'Negative', isHidden: true },
      { input: '1000000000', output: 'Positive', isHidden: true },
      { input: '-1000000000', output: 'Negative', isHidden: true },
      { input: '100', output: 'Positive', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },

  'find-sum-of-ap-series': {
    statement: `A series with the same common difference is known as an arithmetic series. The first term of the series is 'a' and the common difference is 'd'. The series looks like: **a, a + d, a + 2d, a + 3d, ...**

Find the sum of the series up to the nth term.

**Formula:** Sum = n/2 × (2a + (n-1)×d) or Sum = n/2 × (first term + last term)

**Examples:**
- Input: n = 5, a = 1, d = 3 → Output: 35
  Explanation: Series up to 5th term is 1, 4, 7, 10, 13. Sum = 1 + 4 + 7 + 10 + 13 = 35
- Input: n = 3, a = 1, d = 2 → Output: 9
  Explanation: Series up to 3rd term is 1, 3, 5. Sum = 1 + 3 + 5 = 9
- Input: n = 4, a = 2, d = 5 → Output: 44
  Explanation: Series up to 4th term is 2, 7, 12, 17. Sum = 2 + 7 + 12 + 17 = 38

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'First line contains n (number of terms), second line contains a (first term), third line contains d (common difference).',
    outputFormat: 'Return the sum of the arithmetic series up to the nth term as an integer.',
    constraints: '1 ≤ n ≤ 10^5\n-10^9 ≤ a, d ≤ 10^9\nUse formula: n/2 × (2a + (n-1)×d)',
    sampleInput: '5\n1\n3',
    sampleOutput: '35',
    testCases: [
      { input: '5\n1\n3', output: '35', isHidden: false },
      { input: '3\n1\n2', output: '9', isHidden: false },
      { input: '4\n2\n5', output: '38', isHidden: false },
      { input: '1\n10\n5', output: '10', isHidden: true },
      { input: '2\n5\n3', output: '13', isHidden: true },
      { input: '10\n2\n3', output: '155', isHidden: true },
      { input: '6\n1\n1', output: '21', isHidden: true },
      { input: '100\n1\n1', output: '5050', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'program-to-find-sum-of-gp-series': {
    statement: `Given n, a, and r as the number of terms, first term, and common ratio respectively of a Geometric Progression series, find the sum of the series up to the nth term.

A Geometric Progression (GP) series looks like: **a, ar, ar², ar³, ar⁴, ...**

**Formula:**
- If r = 1: Sum = n × a
- If r ≠ 1: Sum = a × (r^n - 1) / (r - 1)

**Examples:**
- Input: n = 3, a = 3, r = 2 → Output: 21
  Explanation: Series up to 3rd term is 3, 6, 12. Sum = 3 + 6 + 12 = 21
- Input: n = 3, a = 1, r = 2 → Output: 7
  Explanation: Series up to 3rd term is 1, 2, 4. Sum = 1 + 2 + 4 = 7
- Input: n = 4, a = 2, r = 3 → Output: 80
  Explanation: Series up to 4th term is 2, 6, 18, 54. Sum = 2 + 6 + 18 + 54 = 80

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'First line contains n (number of terms), second line contains a (first term), third line contains r (common ratio).',
    outputFormat: 'Return the sum of the geometric series up to the nth term as an integer.',
    constraints: '1 ≤ n ≤ 100\n-10^9 ≤ a ≤ 10^9\n-100 ≤ r ≤ 100\nUse formula: a × (r^n - 1) / (r - 1) for r ≠ 1',
    sampleInput: '3\n3\n2',
    sampleOutput: '21',
    testCases: [
      { input: '3\n3\n2', output: '21', isHidden: false },
      { input: '3\n1\n2', output: '7', isHidden: false },
      { input: '4\n2\n3', output: '80', isHidden: false },
      { input: '1\n5\n2', output: '5', isHidden: true },
      { input: '2\n1\n3', output: '4', isHidden: true },
      { input: '5\n1\n1', output: '5', isHidden: true },
      { input: '4\n2\n2', output: '30', isHidden: true },
      { input: '3\n1\n10', output: '111', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'greatest-of-two-numbers': {
    statement: `Given two positive and distinct numbers, find the greatest of the two given numbers **without using any conditional statements (if...) and operators (?: in C/C++/Java)**.

This is a challenging problem that requires you to find the maximum of two numbers using mathematical or bitwise approaches.

**Hint:** You can use approaches like:
- Math.max() or max() functions
- Bitwise operations
- Arithmetic operations
- Array methods

**Examples:**
- Input: a = 14, b = 15 → Output: 15
  Explanation: 15 is greater than 14
- Input: a = 14, b = 14 → Output: 14
  Explanation: Both numbers are equal
- Input: a = 1233133, b = 124 → Output: 1233133
  Explanation: 1233133 is greater than 124

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'First line contains a (first number), second line contains b (second number).',
    outputFormat: 'Return the greatest of the two numbers.',
    constraints: '0 ≤ a, b ≤ 10^9\nNo conditional statements (if) or ternary operators (?:) allowed\nUse mathematical or built-in functions',
    sampleInput: '14\n15',
    sampleOutput: '15',
    testCases: [
      { input: '14\n15', output: '15', isHidden: false },
      { input: '14\n14', output: '14', isHidden: false },
      { input: '1233133\n124', output: '1233133', isHidden: false },
      { input: '1\n2', output: '2', isHidden: true },
      { input: '100\n50', output: '100', isHidden: true },
      { input: '0\n1', output: '1', isHidden: true },
      { input: '1000000000\n999999999', output: '1000000000', isHidden: true },
      { input: '42\n42', output: '42', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'greatest-of-three-numbers': {
    statement: `Given three numbers a, b, and c, find the greatest number among them.

**Examples:**
- Input: a = 10, b = 3, c = 2 → Output: 10
  Explanation: 10 is the greatest among 10, 3, and 2
- Input: a = -4, b = -3, c = -2 → Output: -2
  Explanation: -2 is the greatest among -4, -3, and -2
- Input: a = 5, b = 5, c = 5 → Output: 5
  Explanation: All three numbers are equal

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'First line contains a (first number), second line contains b (second number), third line contains c (third number).',
    outputFormat: 'Return the greatest of the three numbers.',
    constraints: '-10^9 ≤ a, b, c ≤ 10^9\nFind the maximum among three integers',
    sampleInput: '10\n3\n2',
    sampleOutput: '10',
    testCases: [
      { input: '10\n3\n2', output: '10', isHidden: false },
      { input: '-4\n-3\n-2', output: '-2', isHidden: false },
      { input: '5\n5\n5', output: '5', isHidden: false },
      { input: '1\n2\n3', output: '3', isHidden: true },
      { input: '100\n50\n75', output: '100', isHidden: true },
      { input: '-10\n-5\n-20', output: '-5', isHidden: true },
      { input: '0\n0\n1', output: '1', isHidden: true },
      { input: '1000000000\n999999999\n1000000001', output: '1000000001', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'leap-year-or-not': {
    statement: `You are given an integer n representing a year. Return true if it is a leap year, otherwise return false.

A leap year is a year that contains an additional day, February 29th, making it 366 days long instead of the usual 365 days. Leap years are necessary to keep our calendar in alignment with the Earth's revolutions around the Sun.

**Leap Year Conditions:** A year is a leap year if **any one of** the following conditions is satisfied:
- The year is a multiple of 400
- The year is a multiple of 4 AND NOT a multiple of 100

**Examples:**
- Input: n = 4 → Output: true
  Explanation: 4 is divisible by 4 but not by 100, so it's a leap year
- Input: n = 2021 → Output: false
  Explanation: 2021 is not divisible by 4, so it's not a leap year
- Input: n = 2000 → Output: true
  Explanation: 2000 is divisible by 400, so it's a leap year
- Input: n = 1900 → Output: false
  Explanation: 1900 is divisible by 100 but not by 400, so it's not a leap year

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'A single integer n representing a year.',
    outputFormat: 'Return "true" if n is a leap year, otherwise return "false".',
    constraints: '1 ≤ n ≤ 10000\nA leap year: (n % 400 == 0) || (n % 4 == 0 && n % 100 != 0)',
    sampleInput: '4',
    sampleOutput: 'true',
    testCases: [
      { input: '4', output: 'true', isHidden: false },
      { input: '2021', output: 'false', isHidden: false },
      { input: '2000', output: 'true', isHidden: false },
      { input: '1900', output: 'false', isHidden: true },
      { input: '2024', output: 'true', isHidden: true },
      { input: '2100', output: 'false', isHidden: true },
      { input: '2020', output: 'true', isHidden: true },
      { input: '1', output: 'false', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'reverse-digits-of-a-number': {
    statement: `Given an integer n, find the reverse of its digits.

**Examples:**
- Input: n = 122 → Output: 221
  Explanation: By reversing the digits of number, number will change into 221.
- Input: n = 200 → Output: 2
  Explanation: By reversing the digits of number, number will change into 2.
- Input: n = 12345 → Output: 54321
  Explanation: By reversing the digits of number, number will change into 54321.

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'A single integer n.',
    outputFormat: 'Return the integer with its digits reversed. Leading zeros should be dropped.',
    constraints: '1 ≤ n ≤ 10^9\nLeading zeros in result should be automatically removed',
    sampleInput: '122',
    sampleOutput: '221',
    testCases: [
      { input: '122', output: '221', isHidden: false },
      { input: '200', output: '2', isHidden: false },
      { input: '12345', output: '54321', isHidden: false },
      { input: '1', output: '1', isHidden: true },
      { input: '100', output: '1', isHidden: true },
      { input: '1000', output: '1', isHidden: true },
      { input: '9876543210', output: '123456789', isHidden: true },
      { input: '1230', output: '321', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'maximum-and-minimum-digit-in-a-number': {
    statement: `Given a number N, find the largest and smallest digit of the number.

**Examples:**
- Input: N = 2346 → Output: 6 2
  Explanation: 6 is the largest digit and 2 is the smallest digit.
- Input: N = 5 → Output: 5 5
  Explanation: There is only one digit 5, so both largest and smallest are 5.

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'A single positive integer N.',
    outputFormat: 'Return two space-separated integers: largest digit and smallest digit.',
    constraints: '1 ≤ N ≤ 10^9\nFind largest and smallest digits in the number',
    sampleInput: '2346',
    sampleOutput: '6 2',
    testCases: [
      { input: '2346', output: '6 2', isHidden: false },
      { input: '5', output: '5 5', isHidden: false },
      { input: '123', output: '3 1', isHidden: false },
      { input: '9876543210', output: '9 0', isHidden: true },
      { input: '1111111', output: '1 1', isHidden: true },
      { input: '505', output: '5 0', isHidden: true },
      { input: '999', output: '9 9', isHidden: true },
      { input: '1000000000', output: '1 0', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'print-fibonacci-upto-nth-term': {
    statement: `The Fibonacci numbers, commonly denoted F(n), form a sequence called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1.

**Definition:**
- F(0) = 0
- F(1) = 1
- F(n) = F(n - 1) + F(n - 2), for n > 1

Given n, calculate F(n).

**Examples:**
- Input: n = 2 → Output: 1
  Explanation: F(2) = F(1) + F(0) = 1 + 0 = 1
- Input: n = 3 → Output: 2
  Explanation: F(3) = F(2) + F(1) = 1 + 1 = 2
- Input: n = 4 → Output: 3
  Explanation: F(4) = F(3) + F(2) = 2 + 1 = 3

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'A single non-negative integer n.',
    outputFormat: 'Return the nth Fibonacci number F(n).',
    constraints: '0 ≤ n ≤ 50\nF(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2)',
    sampleInput: '2',
    sampleOutput: '1',
    testCases: [
      { input: '2', output: '1', isHidden: false },
      { input: '3', output: '2', isHidden: false },
      { input: '4', output: '3', isHidden: false },
      { input: '0', output: '0', isHidden: true },
      { input: '1', output: '1', isHidden: true },
      { input: '5', output: '5', isHidden: true },
      { input: '10', output: '55', isHidden: true },
      { input: '15', output: '610', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'factorial-of-a-number': {
    statement: `Given a non-negative integer n, compute the factorial of the given number.

Factorial of n is defined as: **n × (n - 1) × (n - 2) × ... × 1**

For n = 0, the factorial is defined as 1.

**Examples:**
- Input: n = 5 → Output: 120
  Explanation: 5! = 5 × 4 × 3 × 2 × 1 = 120
- Input: n = 4 → Output: 24
  Explanation: 4! = 4 × 3 × 2 × 1 = 24
- Input: n = 0 → Output: 1
- Input: n = 1 → Output: 1

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'A single non-negative integer n.',
    outputFormat: 'Return the factorial of n.',
    constraints: '0 ≤ n ≤ 20\nFactorial: n! = n × (n-1) × (n-2) × ... × 1, where 0! = 1',
    sampleInput: '5',
    sampleOutput: '120',
    testCases: [
      { input: '5', output: '120', isHidden: false },
      { input: '4', output: '24', isHidden: false },
      { input: '0', output: '1', isHidden: false },
      { input: '1', output: '1', isHidden: true },
      { input: '3', output: '6', isHidden: true },
      { input: '6', output: '720', isHidden: true },
      { input: '7', output: '5040', isHidden: true },
      { input: '10', output: '3628800', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'power-of-a-number': {
    statement: `Given a number n, find the value of n raised to the power of its own reverse.

The result will always fit into a 32-bit signed integer.

**Examples:**
- Input: n = 2 → Output: 4
  Explanation: The reverse of 2 is 2, and 2² = 4.
- Input: n = 10 → Output: 10
  Explanation: The reverse of 10 is 1 (leading zero is discarded), and 10¹ = 10.

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'A single positive integer n.',
    outputFormat: 'Return n raised to the power of its own reverse.',
    constraints: '1 ≤ n ≤ 10^9\nResult fits into 32-bit signed integer\nReverse of n discards leading zeros',
    sampleInput: '2',
    sampleOutput: '4',
    testCases: [
      { input: '2', output: '4', isHidden: false },
      { input: '10', output: '10', isHidden: false },
      { input: '1', output: '1', isHidden: false },
      { input: '3', output: '27', isHidden: true },
      { input: '100', output: '1', isHidden: true },
      { input: '5', output: '3125', isHidden: true },
      { input: '20', output: '20', isHidden: true },
      { input: '123', output: '123000000000000000000000000000', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'factors-of-a-given-number': {
    statement: `Find all factors of a number or find all distinct divisors of a natural number.

A factor of n is any positive integer that divides n evenly (with remainder 0).

**Examples:**
- Input: n = 6 → Output: [1, 2, 3, 6]
  Explanation: 6 is divisible by 1, 2, 3, 6.
- Input: n = 9 → Output: [1, 3, 9]
  Explanation: 9 is divisible by 1, 3, 9.

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'A single positive integer n.',
    outputFormat: 'Return all factors (divisors) of n as space-separated integers in ascending order.',
    constraints: '1 ≤ n ≤ 10^6\nReturn all factors in ascending order\nA factor divides n evenly with remainder 0',
    sampleInput: '6',
    sampleOutput: '1 2 3 6',
    testCases: [
      { input: '6', output: '1 2 3 6', isHidden: false },
      { input: '9', output: '1 3 9', isHidden: false },
      { input: '1', output: '1', isHidden: false },
      { input: '12', output: '1 2 3 4 6 12', isHidden: true },
      { input: '7', output: '1 7', isHidden: true },
      { input: '24', output: '1 2 3 4 6 8 12 24', isHidden: true },
      { input: '16', output: '1 2 4 8 16', isHidden: true },
      { input: '20', output: '1 2 4 5 10 20', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'print-all-prime-factors-of-the-given-number': {
    statement: `Given a number n, find all prime factors of n.

A prime number is a natural number greater than 1 that has exactly two factors: 1 and itself.

**Examples:**
- Input: n = 18 → Output: [2, 3, 3]
  Explanation: The prime factorization of 18 is 2 × 3².
- Input: n = 25 → Output: [5, 5]
  Explanation: The prime factorization of 25 is 5².

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'A single positive integer n.',
    outputFormat: 'Return all prime factors (with repetition) as space-separated integers in ascending order.',
    constraints: '2 ≤ n ≤ 10^6\nInclude repeated prime factors\nA prime factor divides n exactly',
    sampleInput: '18',
    sampleOutput: '2 3 3',
    testCases: [
      { input: '18', output: '2 3 3', isHidden: false },
      { input: '25', output: '5 5', isHidden: false },
      { input: '2', output: '2', isHidden: false },
      { input: '12', output: '2 2 3', isHidden: true },
      { input: '6', output: '2 3', isHidden: true },
      { input: '24', output: '2 2 2 3', isHidden: true },
      { input: '100', output: '2 2 5 5', isHidden: true },
      { input: '13', output: '13', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'check-if-a-number-is-a-strong-number-or-not': {
    statement: `Strong Numbers are the numbers whose sum of factorial of digits is equal to the original number.

Given a number, the task is to check if it is a Strong Number or not.

**Examples:**
- Input: 145 → Output: true
  Explanation: 1! + 4! + 5! = 1 + 24 + 120 = 145
- Input: 5314 → Output: false
  Explanation: 5! + 3! + 1! + 4! = 120 + 6 + 1 + 24 = 151 ≠ 5314

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'A single positive integer n.',
    outputFormat: 'Return "true" if n is a strong number, otherwise return "false".',
    constraints: '1 ≤ n ≤ 10^5\nStrong number: sum of factorials of digits = n',
    sampleInput: '145',
    sampleOutput: 'true',
    testCases: [
      { input: '145', output: 'true', isHidden: false },
      { input: '5314', output: 'false', isHidden: false },
      { input: '1', output: 'true', isHidden: false },
      { input: '2', output: 'true', isHidden: true },
      { input: '40585', output: 'true', isHidden: true },
      { input: '100', output: 'false', isHidden: true },
      { input: '10', output: 'false', isHidden: true },
      { input: '999', output: 'false', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'check-if-a-number-is-automorphic': {
    statement: `Given a number n, check whether the number is an Automorphic number or not.

A number is called an Automorphic number if and only if the square of the number ends with the number itself.

**Examples:**
- Input: n = 76 → Output: Automorphic
  Explanation: 76² = 5776. The square ends with 76, which is the original number. Hence, it is an Automorphic number.
- Input: n = 14 → Output: Not Automorphic
  Explanation: 14² = 196. The square does not end with 14. Hence, it is not an Automorphic number.

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'A single positive integer n.',
    outputFormat: 'Return "Automorphic" if n is automorphic, otherwise return "Not Automorphic".',
    constraints: '1 ≤ n ≤ 10^9\nAutomorphic: n is contained in last digits of n²',
    sampleInput: '76',
    sampleOutput: 'Automorphic',
    testCases: [
      { input: '76', output: 'Automorphic', isHidden: false },
      { input: '14', output: 'Not Automorphic', isHidden: false },
      { input: '5', output: 'Automorphic', isHidden: false },
      { input: '1', output: 'Automorphic', isHidden: true },
      { input: '6', output: 'Automorphic', isHidden: true },
      { input: '25', output: 'Automorphic', isHidden: true },
      { input: '376', output: 'Automorphic', isHidden: true },
      { input: '4', output: 'Not Automorphic', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'gcd-of-two-numbers': {
    statement: `Given two positive integers a and b, find GCD of a and b.

**Note:** Don't use the inbuilt gcd function

The GCD (Greatest Common Divisor) of two numbers is the largest positive integer that divides both numbers without a remainder.

**Examples:**
- Input: a = 20, b = 28 → Output: 4
  Explanation: GCD of 20 and 28 is 4
- Input: a = 60, b = 36 → Output: 12
  Explanation: GCD of 60 and 36 is 12

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'First line contains a (first positive integer), second line contains b (second positive integer).',
    outputFormat: 'Return the GCD of a and b.',
    constraints: '1 ≤ a, b ≤ 10^6\nFind the greatest common divisor\nDo not use inbuilt gcd function',
    sampleInput: '20\n28',
    sampleOutput: '4',
    testCases: [
      { input: '20\n28', output: '4', isHidden: false },
      { input: '60\n36', output: '12', isHidden: false },
      { input: '1\n1', output: '1', isHidden: false },
      { input: '17\n19', output: '1', isHidden: true },
      { input: '100\n50', output: '50', isHidden: true },
      { input: '21\n14', output: '7', isHidden: true },
      { input: '48\n18', output: '6', isHidden: true },
      { input: '1000000\n500000', output: '500000', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'lcm-of-two-numbers': {
    statement: `You are given two positive integers a and b. Your task is to compute and return the Least Common Multiple (LCM) of the two numbers.

The LCM of two integers is the smallest positive integer that is divisible by both a and b.

**Examples:**
- Input: a = 12, b = 18 → Output: 36
  Explanation: LCM of 12 and 18 is 36
- Input: a = 5, b = 11 → Output: 55
  Explanation: LCM of 5 and 11 is 55

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'First line contains a (first positive integer), second line contains b (second positive integer).',
    outputFormat: 'Return the LCM of a and b.',
    constraints: '1 ≤ a, b ≤ 10^6\nFind the least common multiple\nLCM(a, b) = (a × b) / GCD(a, b)',
    sampleInput: '12\n18',
    sampleOutput: '36',
    testCases: [
      { input: '12\n18', output: '36', isHidden: false },
      { input: '5\n11', output: '55', isHidden: false },
      { input: '1\n1', output: '1', isHidden: false },
      { input: '4\n6', output: '12', isHidden: true },
      { input: '21\n6', output: '42', isHidden: true },
      { input: '12\n18', output: '36', isHidden: true },
      { input: '17\n19', output: '323', isHidden: true },
      { input: '48\n18', output: '144', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'sum-of-digits-of-a-number': {
    statement: `Given a number n, find the sum of its digits.

**Examples:**
- Input: n = 687 → Output: 21
  Explanation: The sum of its digits are: 6 + 8 + 7 = 21
- Input: n = 12 → Output: 3
  Explanation: The sum of its digits are: 1 + 2 = 3

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'A single positive integer n.',
    outputFormat: 'Return the sum of all digits in n.',
    constraints: '1 ≤ n ≤ 10^9\nSum all individual digits',
    sampleInput: '687',
    sampleOutput: '21',
    testCases: [
      { input: '687', output: '21', isHidden: false },
      { input: '12', output: '3', isHidden: false },
      { input: '1', output: '1', isHidden: false },
      { input: '0', output: '0', isHidden: true },
      { input: '100', output: '1', isHidden: true },
      { input: '9876543210', output: '45', isHidden: true },
      { input: '1000000000', output: '1', isHidden: true },
      { input: '5555', output: '20', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'sum-of-numbers-in-the-given-range': {
    statement: `Given an integer array nums and two integers lower and upper, return the number of range sums that lie in [lower, upper] inclusive.

Range sum S(i, j) is defined as the sum of the elements in nums between indices i and j inclusive, where i <= j.

**Examples:**
- Input: nums = [-2, 5, -1], lower = -2, upper = 2 → Output: 3
  Explanation: The three ranges are: [0,0], [2,2], and [0,2] and their respective sums are: -2, -1, 2.
- Input: nums = [0], lower = 0, upper = 0 → Output: 1
  Explanation: The range [0,0] has sum 0, which lies in [0,0].

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'First line contains n (size of array), second line contains n space-separated integers, third line contains lower, fourth line contains upper.',
    outputFormat: 'Return the count of range sums that lie in [lower, upper] inclusive.',
    constraints: '-2^31 ≤ nums[i] ≤ 2^31 - 1\n-10^5 ≤ lower ≤ upper ≤ 10^5\n1 ≤ n ≤ 10^4\nRange sum: sum of elements from index i to j where i <= j',
    sampleInput: '3\n-2 5 -1\n-2\n2',
    sampleOutput: '3',
    testCases: [
      { input: '3\n-2 5 -1\n-2\n2', output: '3', isHidden: false },
      { input: '1\n0\n0\n0', output: '1', isHidden: false },
      { input: '2\n1 2\n1\n3', output: '3', isHidden: false },
      { input: '3\n-1 -2 -3\n-5\n-1', output: '6', isHidden: true },
      { input: '4\n1 1 1 1\n2\n3', output: '5', isHidden: true },
      { input: '2\n-2147483647 2147483647\n-2147483648\n2147483647', output: '3', isHidden: true },
      { input: '3\n0 0 0\n0\n0', output: '6', isHidden: true },
      { input: '5\n1 2 3 4 5\n5\n10', output: '4', isHidden: true }
    ],
    timeLimit: 2000,
    memoryLimit: 256
  },
  'permutations-in-which-n-people-can-occupy-r-seats-in-a-classroom': {
    statement: `Find permutations in which n people can occupy r seats in a classroom.

To find permutations of n people in r seats, we use the formula: **P(n, r) = n! / (n - r)!**

This calculates the number of ways to arrange n distinct people in r distinct seats, where order matters.

**Examples:**
- Input: N = 5, r = 3 → Output: 60
  Explanation: P(5, 3) = 5! / (5-3)! = 120 / 2 = 60
- Input: N = 6, r = 4 → Output: 360
  Explanation: P(6, 4) = 6! / (6-4)! = 720 / 2 = 360

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'First line contains N (total number of people), second line contains r (number of seats).',
    outputFormat: 'Return the number of permutations P(n, r) = n! / (n - r)!',
    constraints: '1 ≤ r ≤ N ≤ 13\nPermutations: P(n, r) = n! / (n-r)!',
    sampleInput: '5\n3',
    sampleOutput: '60',
    testCases: [
      { input: '5\n3', output: '60', isHidden: false },
      { input: '6\n4', output: '360', isHidden: false },
      { input: '4\n2', output: '12', isHidden: false },
      { input: '3\n3', output: '6', isHidden: true },
      { input: '5\n1', output: '5', isHidden: true },
      { input: '7\n3', output: '210', isHidden: true },
      { input: '8\n2', output: '56', isHidden: true },
      { input: '6\n6', output: '720', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'program-to-add-two-fractions': {
    statement: `Given two integer arrays a[] and b[] containing two integers each representing the numerator and denominator of a fraction respectively. The task is to find the sum of the two fractions and return the numerator and denominator of the result.

When adding fractions: (a/b) + (c/d) = (a×d + b×c) / (b×d), then simplify by dividing by GCD.

**Examples:**
- Input: a = [1, 2], b = [3, 2] → Output: [2, 1]
  Explanation: 1/2 + 3/2 = 4/2 = 2/1
- Input: a = [1, 3], b = [3, 9] → Output: [2, 3]
  Explanation: 1/3 + 3/9 = 1/3 + 1/3 = 2/3
- Input: a = [1, 5], b = [3, 15] → Output: [2, 5]
  Explanation: 1/5 + 3/15 = 1/5 + 1/5 = 2/5

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'First line contains numerator a (of first fraction), second line contains denominator b (of first fraction), third line contains numerator c (of second fraction), fourth line contains denominator d (of second fraction).',
    outputFormat: 'Return two space-separated integers representing the numerator and denominator of the sum in simplified form.',
    constraints: '1 ≤ a, b, c, d ≤ 10^5\nSimplify the result by dividing by GCD\nResult should be in lowest terms',
    sampleInput: '1\n2\n3\n2',
    sampleOutput: '2 1',
    testCases: [
      { input: '1\n2\n3\n2', output: '2 1', isHidden: false },
      { input: '1\n3\n3\n9', output: '2 3', isHidden: false },
      { input: '1\n5\n3\n15', output: '2 5', isHidden: false },
      { input: '1\n2\n1\n2', output: '1 1', isHidden: true },
      { input: '1\n4\n1\n4', output: '1 2', isHidden: true },
      { input: '2\n3\n1\n6', output: '5 6', isHidden: true },
      { input: '3\n4\n5\n8', output: '11 8', isHidden: true },
      { input: '1\n6\n1\n3', output: '1 2', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'replace-all-0s-with-1s-in-a-given-integer': {
    statement: `You are given an integer. Your task is to replace all the zeros in the integer with ones.

**Examples:**
- Input: N = 102003 → Output: 112113
  Explanation: The 2nd, 4th, and 5th positions from the left contain 0. These 0s are replaced with 1s, resulting in 112113.
- Input: N = 204 → Output: 214
  Explanation: The 2nd position from the left contains 0. That 0 is replaced with 1, giving 214.

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'A single positive integer N.',
    outputFormat: 'Return the integer with all zeros replaced by ones.',
    constraints: '1 ≤ N ≤ 10^9\nReplace each 0 digit with 1\nPreserve all other digits',
    sampleInput: '102003',
    sampleOutput: '112113',
    testCases: [
      { input: '102003', output: '112113', isHidden: false },
      { input: '204', output: '214', isHidden: false },
      { input: '1000', output: '1111', isHidden: false },
      { input: '505', output: '515', isHidden: true },
      { input: '1', output: '1', isHidden: true },
      { input: '100200300', output: '111211311', isHidden: true },
      { input: '9876543210', output: '9876543211', isHidden: true },
      { input: '1020304050', output: '1121314151', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'can-a-number-be-expressed-as-a-sum-of-two-prime-numbers': {
    statement: `Given a number n, the task is to check if it is possible to express n as the sum of two prime numbers, a and b. If such pair does not exist, return [-1, -1].

**Note:** If [a, b] is one solution with a <= b, and [c, d] is another solution with c <= d, and a < c then [a, b] is considered as our answer.

A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself.

**Examples:**
- Input: n = 19 → Output: Yes
  Explanation: The number 19 can be written as 17 + 2, here 17 and 2 are both primes.
- Input: n = 14 → Output: Yes
  Explanation: The number 14 can be written as 7 + 7.
- Input: n = 11 → Output: No
  Explanation: 11 cannot be expressed as sum of two prime numbers.

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'A single positive integer n.',
    outputFormat: 'Return "Yes" if n can be expressed as sum of two primes, otherwise return "No". If Yes, also return the prime pair [a, b] where a <= b.',
    constraints: '1 ≤ n ≤ 10^5\nCheck all prime pairs (p, q) where p + q = n\nReturn the pair with smallest first element',
    sampleInput: '19',
    sampleOutput: 'Yes',
    testCases: [
      { input: '19', output: 'Yes', isHidden: false },
      { input: '14', output: 'Yes', isHidden: false },
      { input: '11', output: 'No', isHidden: false },
      { input: '10', output: 'Yes', isHidden: true },
      { input: '4', output: 'Yes', isHidden: true },
      { input: '20', output: 'Yes', isHidden: true },
      { input: '27', output: 'No', isHidden: true },
      { input: '100', output: 'Yes', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'calculate-the-area-of-circle': {
    statement: `Given the radius of a circle r. The task is to find the area of the circle.

The area of a circle is calculated using the formula: **Area = π × r²**

Where:
- π (pi) ≈ 3.14159265...
- r is the radius of the circle

**Examples:**
- Input: r = 5 → Output: 78.53982
  Explanation: Area = π × 5 × 5 = 78.53982
- Input: r = 2 → Output: 12.56637
  Explanation: Area = π × 2 × 2 = 12.56637

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'A single positive number r (radius of the circle).',
    outputFormat: 'Return the area of the circle with 5 decimal places precision.',
    constraints: '1 ≤ r ≤ 10^4\nArea = π × r²\nReturn result with 5 decimal places',
    sampleInput: '5',
    sampleOutput: '78.53982',
    testCases: [
      { input: '5', output: '78.53982', isHidden: false },
      { input: '2', output: '12.56637', isHidden: false },
      { input: '1', output: '3.14159', isHidden: false },
      { input: '3', output: '28.27433', isHidden: true },
      { input: '10', output: '314.15927', isHidden: true },
      { input: '7', output: '153.93804', isHidden: true },
      { input: '4', output: '50.26548', isHidden: true },
      { input: '6', output: '113.09734', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'program-to-find-roots-of-a-quadratic-equation': {
    statement: `Given a quadratic equation ax² + bx + c = 0, find its roots.

If the equation has real roots, then return floor value of each root in decreasing order. If the roots are imaginary, return -1.

**Quadratic Formula:** x = (-b ± √(b² - 4ac)) / 2a

Where:
- Discriminant (Δ) = b² - 4ac
- If Δ ≥ 0: roots are real
- If Δ < 0: roots are imaginary

**Examples:**
- Input: a = 1, b = -2, c = 1 → Output: [1, 1]
  Explanation: Roots of equation x² - 2x + 1 are 1 and 1.
- Input: a = 1, b = -7, c = 12 → Output: [4, 3]
  Explanation: Roots of equation x² - 7x + 12 are 4 and 3.

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'First line contains a (coefficient of x²), second line contains b (coefficient of x), third line contains c (constant term).',
    outputFormat: 'Return floor values of roots in decreasing order, or -1 if roots are imaginary.',
    constraints: '-10^5 ≤ a, b, c ≤ 10^5\na ≠ 0\nUse quadratic formula: x = (-b ± √(b² - 4ac)) / 2a\nReturn floor values in decreasing order',
    sampleInput: '1\n-2\n1',
    sampleOutput: '1 1',
    testCases: [
      { input: '1\n-2\n1', output: '1 1', isHidden: false },
      { input: '1\n-7\n12', output: '4 3', isHidden: false },
      { input: '1\n0\n-4', output: '2 -2', isHidden: false },
      { input: '1\n-5\n6', output: '3 2', isHidden: true },
      { input: '1\n0\n1', output: '-1', isHidden: true },
      { input: '2\n-8\n6', output: '2 1', isHidden: true },
      { input: '1\n2\n1', output: '-1 -1', isHidden: true },
      { input: '1\n-6\n9', output: '3 3', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'convert-binary-to-decimal': {
    statement: `Given a string b representing a binary number, return its decimal equivalent as an integer.

To convert a binary number to decimal, multiply each digit by the appropriate power of 2 and sum them up.

**Formula:** For binary number b = d₁d₂d₃...dₙ
- Decimal = d₁ × 2^(n-1) + d₂ × 2^(n-2) + ... + dₙ × 2^0

**Examples:**
- Input: b = "111" → Output: 7
  Explanation: The decimal equivalent of binary 111 is 2² + 2¹ + 2⁰ = 4 + 2 + 1 = 7.
- Input: b = "1010" → Output: 10
  Explanation: The decimal equivalent of binary 1010 is 2³ + 2¹ = 8 + 2 = 10.
- Input: b = "100001" → Output: 33
  Explanation: The decimal equivalent of binary 100001 is 2⁵ + 2⁰ = 32 + 1 = 33.

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'A string b containing only characters 0 and 1 representing a binary number.',
    outputFormat: 'Return the decimal (base 10) equivalent of the binary number as an integer.',
    constraints: '1 ≤ length of b ≤ 32\nString contains only 0s and 1s\nResult fits within 32-bit integer range',
    sampleInput: '111',
    sampleOutput: '7',
    testCases: [
      { input: '111', output: '7', isHidden: false },
      { input: '1010', output: '10', isHidden: false },
      { input: '100001', output: '33', isHidden: false },
      { input: '1', output: '1', isHidden: true },
      { input: '0', output: '0', isHidden: true },
      { input: '11111111', output: '255', isHidden: true },
      { input: '10000000', output: '128', isHidden: true },
      { input: '11010101', output: '213', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'convert-binary-to-octal': {
    statement: `The problem is to convert the given binary number (represented as string) to its equivalent octal number.

The input could be very large and may not fit even into unsigned long long int.

**Conversion Method:**
- Binary to Octal: Group binary digits in sets of 3 from right to left (for integer part) and left to right (for fractional part)
- Each group of 3 binary digits represents 1 octal digit (0-7)

**Examples:**
- Input: 110001110 → Output: 616
  Explanation: 110 001 110 = 6 1 6 (in octal)
- Input: 1111001010010100001.010110110011011 → Output: 1712241.26633
  Explanation: Integer part: 1 111 001 010 010 100 001 = 1712241, Fractional part: 010 110 110 011 011 = 26633

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'A string representing a binary number (may contain a decimal point for fractional part).',
    outputFormat: 'Return the octal equivalent as a string.',
    constraints: '1 ≤ length of input ≤ 10^6\nInput contains only 0, 1, and optionally one decimal point\nGroup binary digits in sets of 3\nHandle very large numbers as strings',
    sampleInput: '110001110',
    sampleOutput: '616',
    testCases: [
      { input: '110001110', output: '616', isHidden: false },
      { input: '1111001010010100001.010110110011011', output: '1712241.26633', isHidden: false },
      { input: '111', output: '7', isHidden: false },
      { input: '1000', output: '10', isHidden: true },
      { input: '101101', output: '55', isHidden: true },
      { input: '11111111', output: '377', isHidden: true },
      { input: '1010.101', output: '12.5', isHidden: true },
      { input: '100000000', output: '400', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'decimal-to-binary-conversion': {
    statement: `Given a decimal integer n, convert it and return its binary equivalent as a string.

**Conversion Method:**
- Repeatedly divide the decimal number by 2
- Collect the remainders (0 or 1) from each division
- Read the remainders in reverse order to get the binary representation

**Examples:**
- Input: n = 12 → Output: "1100"
  Explanation: 12 = 1×2³ + 1×2² + 0×2¹ + 0×2⁰ = "1100"
- Input: n = 33 → Output: "100001"
  Explanation: 33 = 1×2⁵ + 0×2⁴ + 0×2³ + 0×2² + 0×2¹ + 1×2⁰ = "100001"

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'A single non-negative integer n.',
    outputFormat: 'Return the binary representation as a string (without leading zeros).',
    constraints: '0 ≤ n ≤ 10^9\nReturn binary string without leading zeros\nFor n=0, return "0"',
    sampleInput: '12',
    sampleOutput: '1100',
    testCases: [
      { input: '12', output: '1100', isHidden: false },
      { input: '33', output: '100001', isHidden: false },
      { input: '0', output: '0', isHidden: false },
      { input: '1', output: '1', isHidden: true },
      { input: '7', output: '111', isHidden: true },
      { input: '255', output: '11111111', isHidden: true },
      { input: '256', output: '100000000', isHidden: true },
      { input: '1000', output: '1111101000', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'convert-decimal-to-octal': {
    statement: `Given a decimal number as input, convert the given decimal number into an equivalent octal number.

Convert the number with base value 10 to base value 8. The base value of a number system determines the number of digits used to represent a numeric value. For example, the binary number system uses two digits 0 and 1, the octal number system uses 8 digits from 0-7, and the decimal number system uses 10 digits 0-9 to represent any numeric value.

**Conversion Method:**
- Repeatedly divide the decimal number by 8
- Collect the remainders (0-7) from each division
- Read the remainders in reverse order to get the octal representation

**Examples:**
- Input: n = 16 → Output: 20
  Explanation: 16 ÷ 8 = 2 remainder 0, 2 ÷ 8 = 0 remainder 2 → 20 in octal
- Input: n = 10 → Output: 12
  Explanation: 10 ÷ 8 = 1 remainder 2, 1 ÷ 8 = 0 remainder 1 → 12 in octal
- Input: n = 33 → Output: 41
  Explanation: 33 ÷ 8 = 4 remainder 1, 4 ÷ 8 = 0 remainder 4 → 41 in octal

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'A single non-negative integer n (decimal number).',
    outputFormat: 'Return the octal representation as an integer or string (without leading zeros).',
    constraints: '0 ≤ n ≤ 10^9\nReturn octal representation without leading zeros\nFor n=0, return 0',
    sampleInput: '16',
    sampleOutput: '20',
    testCases: [
      { input: '16', output: '20', isHidden: false },
      { input: '10', output: '12', isHidden: false },
      { input: '33', output: '41', isHidden: false },
      { input: '0', output: '0', isHidden: true },
      { input: '1', output: '1', isHidden: true },
      { input: '8', output: '10', isHidden: true },
      { input: '64', output: '100', isHidden: true },
      { input: '255', output: '377', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'convert-octal-to-binary': {
    statement: `Given an Octal number as input, convert that number to a Binary number.

**Conversion Method:**
- Each octal digit (0-7) represents 3 binary digits
- Convert each octal digit to its 3-bit binary equivalent
- Concatenate all binary representations and remove leading zeros

**Octal to Binary Mapping:**
- 0 = 000, 1 = 001, 2 = 010, 3 = 011, 4 = 100, 5 = 101, 6 = 110, 7 = 111

**Examples:**
- Input: Octal = 345 → Output: Binary = 11100101
  Explanation: 3 = 011, 4 = 100, 5 = 101 → 011100101 = 11100101 (leading zeros removed)
- Input: Octal = 120 → Output: Binary = 1010000
  Explanation: 1 = 001, 2 = 010, 0 = 000 → 001010000 = 1010000 (leading zeros removed)

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'A string or integer representing an octal number (contains only digits 0-7).',
    outputFormat: 'Return the binary representation as a string or integer (without leading zeros).',
    constraints: '1 ≤ length of octal number ≤ 10^6\nOctal number contains only digits 0-7\nRemove leading zeros from result',
    sampleInput: '345',
    sampleOutput: '11100101',
    testCases: [
      { input: '345', output: '11100101', isHidden: false },
      { input: '120', output: '1010000', isHidden: false },
      { input: '7', output: '111', isHidden: false },
      { input: '1', output: '1', isHidden: true },
      { input: '10', output: '1000', isHidden: true },
      { input: '77', output: '111111', isHidden: true },
      { input: '100', output: '1000000', isHidden: true },
      { input: '377', output: '11111111', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'convert-octal-to-decimal': {
    statement: `Given an octal number as input, convert the given octal number into an equivalent decimal number.

**Conversion Method:**
- Each octal digit position represents a power of 8
- Multiply each digit by the corresponding power of 8
- Sum all the products to get the decimal value

**Formula:** For octal number d₁d₂d₃...dₙ
- Decimal = d₁ × 8^(n-1) + d₂ × 8^(n-2) + ... + dₙ × 8^0

**Examples:**
- Input: Octal = 67 → Output: Decimal = 55
  Explanation: 6×8¹ + 7×8⁰ = 48 + 7 = 55
- Input: Octal = 512 → Output: Decimal = 330
  Explanation: 5×8² + 1×8¹ + 2×8⁰ = 320 + 8 + 2 = 330
- Input: Octal = 123 → Output: Decimal = 83
  Explanation: 1×8² + 2×8¹ + 3×8⁰ = 64 + 16 + 3 = 83

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'A string or integer representing an octal number (contains only digits 0-7).',
    outputFormat: 'Return the decimal (base 10) equivalent as an integer.',
    constraints: '1 ≤ length of octal number ≤ 10\nOctal number contains only digits 0-7\nResult fits within 32-bit integer range',
    sampleInput: '67',
    sampleOutput: '55',
    testCases: [
      { input: '67', output: '55', isHidden: false },
      { input: '512', output: '330', isHidden: false },
      { input: '123', output: '83', isHidden: false },
      { input: '7', output: '7', isHidden: true },
      { input: '1', output: '1', isHidden: true },
      { input: '10', output: '8', isHidden: true },
      { input: '377', output: '255', isHidden: true },
      { input: '1000', output: '512', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'convert-digitsnumbers-to-words': {
    statement: `Write a function to convert a given number n into words.

We need to break down the number into International Number System, i.e., smaller groups of three digits (hundreds, tens, and ones), and convert each group into words.

**Key Points:**
- Handle numbers from 0 to 2,147,483,647 (32-bit max integer)
- Break down into groups: ones, thousands, millions, billions
- Each group contains hundreds, tens, and ones places
- Capitalize the first letter of each word
- Words should be separated by spaces
- Handle special cases for 10-19 (ten, eleven, twelve, etc.)

**Examples:**
- Input: n = 0 → Output: "Zero"
  Explanation: Special case for zero
- Input: n = 123 → Output: "One Hundred Twenty Three"
  Explanation: 1 hundred, 2 tens, 3 ones
- Input: n = 10245 → Output: "Ten Thousand Two Hundred Forty Five"
  Explanation: 10 thousands, 2 hundreds, 4 tens, 5 ones
- Input: n = 2147483647 → Output: "Two Billion One Hundred Forty Seven Million Four Hundred Eighty Three Thousand Six Hundred Forty Seven"
  Explanation: Breaking down into billions, millions, thousands, and ones

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'A single non-negative integer n (0 to 2,147,483,647).',
    outputFormat: 'Return the English word representation with each word capitalized and space-separated.',
    constraints: '0 ≤ n ≤ 2^31 - 1\nHandle numbers up to 2 billion\nCapitalize each word\nSpecial handling for teens (10-19) and zero',
    sampleInput: '10245',
    sampleOutput: 'Ten Thousand Two Hundred Forty Five',
    testCases: [
      { input: '0', output: 'Zero', isHidden: false },
      { input: '123', output: 'One Hundred Twenty Three', isHidden: false },
      { input: '10245', output: 'Ten Thousand Two Hundred Forty Five', isHidden: false },
      { input: '2147483647', output: 'Two Billion One Hundred Forty Seven Million Four Hundred Eighty Three Thousand Six Hundred Forty Seven', isHidden: false },
      { input: '1', output: 'One', isHidden: true },
      { input: '10', output: 'Ten', isHidden: true },
      { input: '100', output: 'One Hundred', isHidden: true },
      { input: '1000', output: 'One Thousand', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'bubble-sort-algorithm': {
    statement: `Given an array, arr[]. Sort the array using the Bubble Sort algorithm.

**Bubble Sort Algorithm:**
Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The process is repeated until no more swaps are needed, which indicates that the array is sorted.

**Algorithm Steps:**
1. Compare adjacent elements in the array
2. If the first element is greater than the second, swap them
3. Move to the next pair and repeat
4. After each pass, the largest unsorted element "bubbles" to its correct position at the end
5. Repeat until the entire array is sorted

**Time Complexity:** O(n²) in all cases
**Space Complexity:** O(1) - sorts in place

**Examples:**
- Input: arr[] = [4, 1, 3, 9, 7] → Output: [1, 3, 4, 7, 9]
  Explanation: After sorting the array in ascending order: [1, 3, 4, 7, 9]
- Input: arr[] = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1] → Output: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  Explanation: Sort the array in ascending order
- Input: arr[] = [1, 2, 3, 4, 5] → Output: [1, 2, 3, 4, 5]
  Explanation: An array that is already sorted remains unchanged after applying bubble sort

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'First line contains N (size of array), second line contains N space-separated integers.',
    outputFormat: 'Return the sorted array as space-separated integers in ascending order.',
    constraints: '1 ≤ N ≤ 10^5\n-10^9 ≤ arr[i] ≤ 10^9\nSort in ascending order\nUse bubble sort algorithm',
    sampleInput: '5\n4 1 3 9 7',
    sampleOutput: '1 3 4 7 9',
    testCases: [
      { input: '5\n4 1 3 9 7', output: '1 3 4 7 9', isHidden: false },
      { input: '10\n10 9 8 7 6 5 4 3 2 1', output: '1 2 3 4 5 6 7 8 9 10', isHidden: false },
      { input: '5\n1 2 3 4 5', output: '1 2 3 4 5', isHidden: false },
      { input: '1\n5', output: '5', isHidden: true },
      { input: '3\n3 1 2', output: '1 2 3', isHidden: true },
      { input: '4\n-5 0 3 -2', output: '-5 -2 0 3', isHidden: true },
      { input: '6\n5 5 5 5 5 5', output: '5 5 5 5 5 5', isHidden: true },
      { input: '8\n8 7 6 5 4 3 2 1', output: '1 2 3 4 5 6 7 8', isHidden: true }
    ],
    timeLimit: 2000,
    memoryLimit: 128
  },
  'selection-sort-algorithm': {
    statement: `Given an array arr, use Selection Sort to sort arr[] in increasing order.

**Selection Sort Algorithm:**
Selection Sort is a simple sorting algorithm that divides the input list into two parts: the sorted subarray (built up from left to right) and the unsorted subarray (remaining elements). It repeatedly selects the minimum element from the unsorted subarray and moves it to the end of the sorted subarray.

**Algorithm Steps:**
1. Find the minimum element in the unsorted subarray
2. Swap it with the first element of the unsorted subarray
3. Move the boundary of the sorted subarray one element to the right
4. Repeat until the entire array is sorted

**Time Complexity:** O(n²) in all cases
**Space Complexity:** O(1) - sorts in place

**Examples:**
- Input: arr[] = [4, 1, 3, 9, 7] → Output: [1, 3, 4, 7, 9]
  Explanation: Maintain sorted (left) and unsorted (right) subarrays. Select 1. Array becomes 1 4 3 9 7. Select 3. Array becomes 1 3 4 9 7. Select 4. Array becomes 1 3 4 9 7. Select 7. Array becomes 1 3 4 7 9. Select 9. Array becomes 1 3 4 7 9.
- Input: arr[] = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1] → Output: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
- Input: arr[] = [38, 31, 20, 14, 30] → Output: [14, 20, 30, 31, 38]

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'First line contains N (size of array), second line contains N space-separated integers.',
    outputFormat: 'Return the sorted array as space-separated integers in ascending order.',
    constraints: '1 ≤ N ≤ 10^5\n-10^9 ≤ arr[i] ≤ 10^9\nSort in ascending order\nUse selection sort algorithm',
    sampleInput: '5\n4 1 3 9 7',
    sampleOutput: '1 3 4 7 9',
    testCases: [
      { input: '5\n4 1 3 9 7', output: '1 3 4 7 9', isHidden: false },
      { input: '10\n10 9 8 7 6 5 4 3 2 1', output: '1 2 3 4 5 6 7 8 9 10', isHidden: false },
      { input: '5\n38 31 20 14 30', output: '14 20 30 31 38', isHidden: false },
      { input: '1\n5', output: '5', isHidden: true },
      { input: '3\n3 1 2', output: '1 2 3', isHidden: true },
      { input: '4\n-5 0 3 -2', output: '-5 -2 0 3', isHidden: true },
      { input: '6\n5 5 5 5 5 5', output: '5 5 5 5 5 5', isHidden: true },
      { input: '8\n8 7 6 5 4 3 2 1', output: '1 2 3 4 5 6 7 8', isHidden: true }
    ],
    timeLimit: 2000,
    memoryLimit: 128
  },
  'insertion-sort-algorithm': {
    statement: `Given an array arr[] of positive integers. The task is to implement Insertion Sort.

**Insertion Sort Algorithm:**
Insertion Sort is a simple sorting algorithm that builds the sorted array one item at a time by inserting elements from the unsorted portion into their correct position in the sorted portion. It is similar to sorting playing cards in your hands.

**Algorithm Steps:**
1. Start with the second element (index 1)
2. Compare it with elements before it in the sorted portion
3. Shift larger elements one position to the right
4. Insert the current element in its correct position
5. Repeat for all remaining elements

**Time Complexity:** O(n²) in worst case, O(n) in best case (already sorted)
**Space Complexity:** O(1) - sorts in place

**Examples:**
- Input: arr[] = [4, 1, 3, 9, 7] → Output: [1, 3, 4, 7, 9]
  Explanation: The sorted array will be [1, 3, 4, 7, 9].
- Input: arr[] = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1] → Output: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  Explanation: The sorted array will be [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].
- Input: arr[] = [4, 1, 9] → Output: [1, 4, 9]
  Explanation: The sorted array will be [1, 4, 9].

Complete the insertsort() function which is used to implement Insertion Sort.`,
    inputFormat: 'First line contains N (size of array), second line contains N space-separated positive integers.',
    outputFormat: 'Return the sorted array as space-separated integers in ascending order.',
    constraints: '1 ≤ N ≤ 10^5\n1 ≤ arr[i] ≤ 10^9\nSort in ascending order\nUse insertion sort algorithm',
    sampleInput: '5\n4 1 3 9 7',
    sampleOutput: '1 3 4 7 9',
    testCases: [
      { input: '5\n4 1 3 9 7', output: '1 3 4 7 9', isHidden: false },
      { input: '10\n10 9 8 7 6 5 4 3 2 1', output: '1 2 3 4 5 6 7 8 9 10', isHidden: false },
      { input: '3\n4 1 9', output: '1 4 9', isHidden: false },
      { input: '1\n5', output: '5', isHidden: true },
      { input: '3\n3 1 2', output: '1 2 3', isHidden: true },
      { input: '5\n1 2 3 4 5', output: '1 2 3 4 5', isHidden: true },
      { input: '6\n5 5 5 5 5 5', output: '5 5 5 5 5 5', isHidden: true },
      { input: '8\n8 7 6 5 4 3 2 1', output: '1 2 3 4 5 6 7 8', isHidden: true }
    ],
    timeLimit: 2000,
    memoryLimit: 128
  },
  'quick-sort-algorithm': {
    statement: `Given an array arr[], with starting index low and ending index high, complete the functions partition() and quickSort() so that the array becomes sorted in ascending order.

**Quick Sort Algorithm:**
Quick Sort is an efficient, divide-and-conquer sorting algorithm that works by partitioning the array around a pivot element and then recursively sorting the sub-arrays. It is one of the most popular sorting algorithms due to its average-case efficiency.

**Algorithm Steps:**
1. Select a pivot element from the array
2. Partition the array so that all elements less than pivot come before it, and all elements greater come after
3. Recursively apply Quick Sort to the left partition (elements < pivot)
4. Recursively apply Quick Sort to the right partition (elements > pivot)
5. Combine the partitions with the pivot

**Time Complexity:** O(n log n) average case, O(n²) worst case
**Space Complexity:** O(log n) due to recursion stack

**Examples:**
- Input: arr[] = [4, 1, 3, 9, 7] → Output: [1, 3, 4, 7, 9]
  Explanation: After sorting, all elements are arranged in ascending order.
- Input: arr[] = [2, 1, 6, 10, 4, 1, 3, 9, 7] → Output: [1, 1, 2, 3, 4, 6, 7, 9, 10]
  Explanation: Duplicate elements (1) are retained in sorted order.
- Input: arr[] = [5, 5, 5, 5] → Output: [5, 5, 5, 5]
  Explanation: All elements are identical, so the array remains unchanged.

Complete the partition() and quickSort() functions.`,
    inputFormat: 'First line contains N (size of array), second line contains N space-separated integers.',
    outputFormat: 'Return the sorted array as space-separated integers in ascending order.',
    constraints: '1 ≤ N ≤ 10^5\n-10^9 ≤ arr[i] ≤ 10^9\nSort in ascending order\nUse quick sort algorithm',
    sampleInput: '5\n4 1 3 9 7',
    sampleOutput: '1 3 4 7 9',
    testCases: [
      { input: '5\n4 1 3 9 7', output: '1 3 4 7 9', isHidden: false },
      { input: '9\n2 1 6 10 4 1 3 9 7', output: '1 1 2 3 4 6 7 9 10', isHidden: false },
      { input: '4\n5 5 5 5', output: '5 5 5 5', isHidden: false },
      { input: '1\n7', output: '7', isHidden: true },
      { input: '3\n3 1 2', output: '1 2 3', isHidden: true },
      { input: '5\n1 2 3 4 5', output: '1 2 3 4 5', isHidden: true },
      { input: '6\n-5 0 3 -2 1 2', output: '-5 -2 0 1 2 3', isHidden: true },
      { input: '8\n8 7 6 5 4 3 2 1', output: '1 2 3 4 5 6 7 8', isHidden: true }
    ],
    timeLimit: 2000,
    memoryLimit: 128
  },
  'merge-sort-algorithm': {
    statement: `## 📝 Problem Statement
Given an array arr[], with starting position l and ending position r, sort the array using the merge sort algorithm.

**Merge Sort Algorithm:**
Merge Sort is an efficient, divide-and-conquer sorting algorithm that divides the array into two halves, recursively sorts them, and then merges the sorted halves back together. It is known for its stable sorting property and consistent O(n log n) performance.

**Algorithm Steps:**
1. Divide the array into two halves at the midpoint
2. Recursively apply Merge Sort to the left half (l to mid)
3. Recursively apply Merge Sort to the right half (mid + 1 to r)
4. Merge the two sorted halves into a single sorted array
5. Return the merged sorted array

**Time Complexity:** O(n log n) in all cases (best, average, worst)
**Space Complexity:** O(n) auxiliary space for merging

**Examples:**
- Input: arr[] = [4, 1, 3, 9, 7] → Output: [1, 3, 4, 7, 9]
  Explanation: We get the sorted array after using merge sort.
- Input: arr[] = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1] → Output: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  Explanation: We get the sorted array after using merge sort.

Complete the mergeSort() and merge() functions.`,
    inputFormat: 'First line contains N (size of array), second line contains N space-separated integers.',
    outputFormat: 'Return the sorted array as space-separated integers in ascending order.',
    constraints: '1 ≤ N ≤ 10^5\n-10^9 ≤ arr[i] ≤ 10^9\nSort in ascending order\nUse merge sort algorithm',
    sampleInput: '5\n4 1 3 9 7',
    sampleOutput: '1 3 4 7 9',
    testCases: [
      { input: '5\n4 1 3 9 7', output: '1 3 4 7 9', isHidden: false },
      { input: '10\n10 9 8 7 6 5 4 3 2 1', output: '1 2 3 4 5 6 7 8 9 10', isHidden: false },
      { input: '1\n42', output: '42', isHidden: false },
      { input: '3\n3 1 2', output: '1 2 3', isHidden: true },
      { input: '5\n1 2 3 4 5', output: '1 2 3 4 5', isHidden: true },
      { input: '6\n-5 0 3 -2 1 2', output: '-5 -2 0 1 2 3', isHidden: true },
      { input: '8\n5 2 8 1 9 3 7 4', output: '1 2 3 4 5 7 8 9', isHidden: true },
      { input: '4\n-10 -5 -15 -1', output: '-15 -10 -5 -1', isHidden: true }
    ],
    timeLimit: 2000,
    memoryLimit: 128
  },
  'check-if-a-given-string-is-palindrome-or-not': {
    statement: `## 📝 Problem Statement
Given a string s, return true if the string is a palindrome. Otherwise, return false.

A string is considered a palindrome if it reads the same forwards and backwards.

**Palindrome String Definition:**
A palindrome string is a sequence of characters that reads the same when reversed. The comparison is typically case-sensitive unless specified otherwise.

**Algorithm Approach:**
1. Use two pointers: one at the start and one at the end of the string
2. Compare characters at both pointers
3. Move pointers towards the center
4. If all characters match, the string is a palindrome
5. Otherwise, it is not a palindrome

**Time Complexity:** O(n) where n is the length of the string
**Space Complexity:** O(1) constant space (two-pointer approach)

**Examples:**
- Input: s = "abba" → Output: true
  Explanation: "abba" reads the same forwards and backwards, so it is a palindrome.
- Input: s = "abc" → Output: false
  Explanation: "abc" does not read the same forwards and backwards, so it is not a palindrome.

Complete the isPalindrome() function.`,
    inputFormat: 'A single string s.',
    outputFormat: 'Return "true" if the string is a palindrome, otherwise return "false".',
    constraints: '1 ≤ s.length ≤ 10^5\ns consists of lowercase and uppercase English letters',
    sampleInput: 'abba',
    sampleOutput: 'true',
    testCases: [
      { input: 'abba', output: 'true', isHidden: false },
      { input: 'abc', output: 'false', isHidden: false },
      { input: 'a', output: 'true', isHidden: false },
      { input: 'racecar', output: 'true', isHidden: true },
      { input: 'hello', output: 'false', isHidden: true },
      { input: 'AA', output: 'true', isHidden: true },
      { input: 'Aa', output: 'false', isHidden: true },
      { input: 'madam', output: 'true', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'count-number-of-vowels-consonants-spaces-in-string': {
    statement: `## 📝 Problem Statement
You are given a string s, containing only lowercase letters. Count the number of vowels and the number of consonants.

Based on the count comparison:
- If vowel count > consonant count then print - "Yes"
- If vowel count < consonant count then print - "No"
- If vowel count = consonant count then print - "Same"

**Vowel and Consonant Definition:**
- **Vowels**: a, e, i, o, u (5 vowels)
- **Consonants**: All other lowercase letters (b, c, d, f, g, h, j, k, l, m, n, p, q, r, s, t, v, w, x, y, z)

**Algorithm Approach:**
1. Iterate through each character in the string
2. Count the vowels (a, e, i, o, u)
3. Count the consonants (all other lowercase letters)
4. Compare the counts and return the appropriate result

**Time Complexity:** O(n) where n is the length of the string
**Space Complexity:** O(1) constant space

**Examples:**
- Input: s = "thequickbrownfoxjumpsoverthelazydog" → Output: "No"
  Explanation: Vowels: 11 (e, u, i, o, o, u, o, e, a, o) < Consonants: 24
- Input: s = "aaaaaa" → Output: "Yes"
  Explanation: Vowels: 6 > Consonants: 0
- Input: s = "abab" → Output: "Same"
  Explanation: Vowels: 2 (a, a) = Consonants: 2 (b, b)

Complete the countVowelsConsonants() function.`,
    inputFormat: 'A single string s containing only lowercase letters.',
    outputFormat: 'Return "Yes" if vowels > consonants, "No" if vowels < consonants, "Same" if vowels = consonants.',
    constraints: '1 ≤ s.length ≤ 10^5\ns consists of only lowercase English letters',
    sampleInput: 'abab',
    sampleOutput: 'Same',
    testCases: [
      { input: 'abab', output: 'Same', isHidden: false },
      { input: 'aaaaaa', output: 'Yes', isHidden: false },
      { input: 'thequickbrownfoxjumpsoverthelazydog', output: 'No', isHidden: false },
      { input: 'aeiou', output: 'Yes', isHidden: true },
      { input: 'bcdfg', output: 'No', isHidden: true },
      { input: 'ab', output: 'Same', isHidden: true },
      { input: 'aabaa', output: 'Yes', isHidden: true },
      { input: 'bbbbaaa', output: 'No', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'find-the-ascii-value-of-a-character': {
    statement: `## 📝 Problem Statement
Given a character, find and return its ASCII value.

ASCII (American Standard Code for Information Interchange) assigns a numerical value to each character. Every character has a unique ASCII code, whether it's a letter, digit, or special character.

**ASCII Value Basics:**
- Lowercase letters: a-z have ASCII values 97-122
- Uppercase letters: A-Z have ASCII values 65-90
- Digits: 0-9 have ASCII values 48-57
- Special characters have their own ASCII values

**Algorithm Approach:**
1. Read the input character
2. Get the ASCII value of the character using language-specific functions
3. Return the ASCII value as an integer

**Time Complexity:** O(1) constant time
**Space Complexity:** O(1) constant space

**Examples:**
- Input: a → Output: 97
  Explanation: The lowercase letter 'a' has ASCII value 97.
- Input: D → Output: 68
  Explanation: The uppercase letter 'D' has ASCII value 68.

Complete the getASCIIValue() function.`,
    inputFormat: 'A single character.',
    outputFormat: 'Return the ASCII value of the character as an integer.',
    constraints: '0 ≤ ASCII value ≤ 127 (Standard ASCII)\nInput can be a letter, digit, or special character',
    sampleInput: 'a',
    sampleOutput: '97',
    testCases: [
      { input: 'a', output: '97', isHidden: false },
      { input: 'D', output: '68', isHidden: false },
      { input: 'A', output: '65', isHidden: false },
      { input: 'z', output: '122', isHidden: true },
      { input: 'Z', output: '90', isHidden: true },
      { input: '0', output: '48', isHidden: true },
      { input: '9', output: '57', isHidden: true },
      { input: ' ', output: '32', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'remove-all-vowels-from-the-string': {
    statement: `## 📝 Problem Statement
Given a string s, remove all vowels from the string and return the resulting string.

Only vowels should be removed. All other characters (consonants, spaces, special characters, digits) should remain in the same order.

**Vowel Definition:**
Vowels are: a, e, i, o, u (both lowercase and uppercase: A, E, I, O, U)

**Algorithm Approach:**
1. Iterate through each character in the string
2. Check if the character is a vowel (both lowercase and uppercase)
3. If not a vowel, keep the character
4. Return the resulting string with all vowels removed

**Time Complexity:** O(n) where n is the length of the string
**Space Complexity:** O(n) for the output string

**Examples:**
- Input: s = "welcome to geeksforgeeks" → Output: "wlcm t gksfrgks"
  Explanation: Vowels (e, o, o, e, o, e, e) were removed. Only consonants and spaces remain in the same order.
- Input: s = "what is your name ?" → Output: "wht s yr nm ?"
  Explanation: Vowels (a, i, o, u, a, e) were removed. Consonants, spaces, and special character (?) remain.

Complete the removeVowels() function.`,
    inputFormat: 'A single string s containing letters, digits, spaces, and special characters.',
    outputFormat: 'Return the string with all vowels removed (both lowercase and uppercase).',
    constraints: '1 ≤ s.length ≤ 10^5\ns can contain lowercase letters, uppercase letters, spaces, digits, and special characters',
    sampleInput: 'welcome to geeksforgeeks',
    sampleOutput: 'wlcm t gksfrgks',
    testCases: [
      { input: 'welcome to geeksforgeeks', output: 'wlcm t gksfrgks', isHidden: false },
      { input: 'what is your name ?', output: 'wht s yr nm ?', isHidden: false },
      { input: 'aeiou', output: '', isHidden: false },
      { input: 'bcdfg', output: 'bcdfg', isHidden: true },
      { input: 'Hello World', output: 'Hll Wrld', isHidden: true },
      { input: 'AEIOU', output: '', isHidden: true },
      { input: 'a1b2e3i4o5u6', output: '1b2345', isHidden: true },
      { input: 'programming is fun!', output: 'prgrmmng s fn!', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'remove-spaces-from-a-string': {
    statement: `## 📝 Problem Statement
Given a string s, remove all the spaces from the string and return the modified string.

All space characters should be removed while preserving the order of all other characters (letters, digits, special characters).

**Space Character Definition:**
A space is the whitespace character represented by the ASCII value 32.

**Algorithm Approach:**
1. Iterate through each character in the string
2. Check if the character is a space
3. If not a space, keep the character
4. Return the resulting string with all spaces removed

**Time Complexity:** O(n) where n is the length of the string
**Space Complexity:** O(n) for the output string

**Examples:**
- Input: s = "g eeks for ge eks" → Output: "geeksforgeeks"
  Explanation: All space characters are removed from the given string while preserving the order of the remaining characters, resulting in the final string "geeksforgeeks".
- Input: s = "abc d " → Output: "abcd"
  Explanation: All space characters are removed from the given string while preserving the order of the remaining characters, resulting in the final string "abcd".

Complete the removeSpaces() function.`,
    inputFormat: 'A single string s containing letters, digits, spaces, and special characters.',
    outputFormat: 'Return the string with all spaces removed.',
    constraints: '1 ≤ s.length ≤ 10^5\ns can contain lowercase letters, uppercase letters, spaces, digits, and special characters',
    sampleInput: 'g eeks for ge eks',
    sampleOutput: 'geeksforgeeks',
    testCases: [
      { input: 'g eeks for ge eks', output: 'geeksforgeeks', isHidden: false },
      { input: 'abc d ', output: 'abcd', isHidden: false },
      { input: 'hello world', output: 'helloworld', isHidden: false },
      { input: 'no spaces', output: 'nospaces', isHidden: true },
      { input: '   ', output: '', isHidden: true },
      { input: 'a b c d e f', output: 'abcdef', isHidden: true },
      { input: 'Hello World!', output: 'HelloWorld!', isHidden: true },
      { input: ' space at start and end ', output: 'spaceatstartandend', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'remove-characters-from-a-string-except-alphabets': {
    statement: `## 📝 Problem Statement
Given a string s, remove all characters except lowercase and uppercase alphabets (a-z and A-Z) and return the resulting string.

If no alphabetic characters remain after removal, return an empty string.

**Alphabetic Character Definition:**
Alphabetic characters are:
- Lowercase letters: a-z
- Uppercase letters: A-Z

All other characters (digits, spaces, special characters, punctuation) should be removed.

**Algorithm Approach:**
1. Iterate through each character in the string
2. Check if the character is an alphabetic character (a-z or A-Z)
3. If it is alphabetic, keep the character
4. If not, skip the character
5. Return the resulting string with only alphabets

**Time Complexity:** O(n) where n is the length of the string
**Space Complexity:** O(n) for the output string

**Examples:**
- Input: s = "$Gee*k;s..fo, r'Ge^eks?" → Output: "GeeksforGeeks"
  Explanation: All characters other than alphabets are removed from the string "$Gee*k;s..fo, r'Ge^eks?", resulting in "GeeksforGeeks".
- Input: s = "{{{}}> *& ^%*)" → Output: ""
  Explanation: The string "{{{}}> *& ^%*)" does not contain any alphabetic characters, so after removing all non-alphabet characters, the resulting string is empty.

Complete the removeNonAlphabets() function.`,
    inputFormat: 'A single string s containing letters, digits, spaces, and special characters.',
    outputFormat: 'Return the string with only alphabetic characters (a-z, A-Z) remaining.',
    constraints: '1 ≤ s.length ≤ 10^5\ns can contain any ASCII characters',
    sampleInput: '$Gee*k;s..fo, r\'Ge^eks?',
    sampleOutput: 'GeeksforGeeks',
    testCases: [
      { input: '$Gee*k;s..fo, r\'Ge^eks?', output: 'GeeksforGeeks', isHidden: false },
      { input: '{{{}}> *& ^%*)', output: '', isHidden: false },
      { input: 'abc123def', output: 'abcdef', isHidden: false },
      { input: 'a1b2c3', output: 'abc', isHidden: true },
      { input: 'Hello World!', output: 'HelloWorld', isHidden: true },
      { input: 'OnlyLetters', output: 'OnlyLetters', isHidden: true },
      { input: '123456', output: '', isHidden: true },
      { input: 'a@b#c$d%e^f&g', output: 'abcdefg', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'reverse-a-string': {
    statement: `## 📝 Problem Statement
You are given a string s, and your task is to reverse the string.

Reverse the string by reading it from the last character to the first character, maintaining the same order of characters but in reverse sequence.

**String Reversal Definition:**
String reversal means reading the string from right to left. The last character becomes the first, the second-to-last becomes the second, and so on.

**Algorithm Approach (Two-Pointer Method):**
1. Initialize two pointers: one at the start and one at the end of the string
2. Swap the characters at both pointers
3. Move the pointers towards the center
4. Continue until the pointers meet
5. Return the reversed string

**Time Complexity:** O(n) where n is the length of the string
**Space Complexity:** O(n) for the output string (or O(1) if reversing in-place)

**Examples:**
- Input: s = "Geeks" → Output: "skeeG"
  Explanation: The string is reversed character by character.
- Input: s = "for" → Output: "rof"
  Explanation: The string is reversed character by character.
- Input: s = "a" → Output: "a"
  Explanation: Single character remains the same when reversed.

Complete the reverseString() function.`,
    inputFormat: 'A single string s containing letters, digits, spaces, and special characters.',
    outputFormat: 'Return the reversed string.',
    constraints: '1 ≤ s.length ≤ 10^5\ns can contain lowercase letters, uppercase letters, spaces, digits, and special characters',
    sampleInput: 'Geeks',
    sampleOutput: 'skeeG',
    testCases: [
      { input: 'Geeks', output: 'skeeG', isHidden: false },
      { input: 'for', output: 'rof', isHidden: false },
      { input: 'a', output: 'a', isHidden: false },
      { input: 'hello', output: 'olleh', isHidden: true },
      { input: 'racecar', output: 'racecar', isHidden: true },
      { input: 'abc123', output: '321cba', isHidden: true },
      { input: 'Hello World!', output: '!dlroW olleH', isHidden: true },
      { input: 'ab', output: 'ba', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'remove-brackets-from-an-algebraic-expression': {
    statement: `## 📝 Problem Statement
Given an algebraic expression as a string s containing operands (letters), + and - operators, and parentheses, simplify the expression by removing all parentheses and correctly applying the operators. Return the simplified expression without parentheses.

When removing brackets, the sign before the bracket applies to all terms inside:
- Positive sign (+) keeps all signs inside the bracket unchanged
- Negative sign (-) flips all signs inside the bracket (+ becomes -, - becomes +)

**Key Concepts:**
- Operands are single lowercase letters (a-z)
- Operators are + and - symbols
- Parentheses can be nested
- When a negative sign precedes brackets, all signs inside are flipped

**Algorithm Approach:**
1. Use a stack to track the current sign state
2. Iterate through each character in the expression
3. For opening brackets '(', push the current sign to stack
4. For closing brackets ')', pop from stack
5. For operators and operands, apply the current sign state
6. Build the result string with proper spacing

**Time Complexity:** O(n) where n is the length of the expression
**Space Complexity:** O(n) for the stack and output string

**Examples:**
- Input: "(a - (b + c) + d)" → Output: "a - b - c + d"
  Explanation: a - (b + c) + d simplifies to a - b - c + d. The negative sign before (b + c) flips the signs inside.
- Input: "a - (b - c - (d + e )) - f" → Output: "a - b + c + d + e - f"
  Explanation: Process nested brackets from inside out. The inner (d + e) becomes d + e. Then (b - c - (d + e)) flips to (b - c - d - e), and the outer negative flips to a - b + c + d + e - f.

Complete the removeBrackets() function.`,
    inputFormat: 'A single string s containing operands (a-z), operators (+, -), and parentheses (brackets).',
    outputFormat: 'Return the simplified expression without parentheses, with proper spacing around operators.',
    constraints: '1 ≤ s.length ≤ 10^5\ns contains only lowercase letters, +, -, (, and )\nParentheses are balanced\nOperands are single lowercase letters',
    sampleInput: '(a - (b + c) + d)',
    sampleOutput: 'a - b - c + d',
    testCases: [
      { input: '(a - (b + c) + d)', output: 'a - b - c + d', isHidden: false },
      { input: 'a - (b - c - (d + e )) - f', output: 'a - b + c + d + e - f', isHidden: false },
      { input: 'a + b - c', output: 'a + b - c', isHidden: false },
      { input: '(a + b)', output: 'a + b', isHidden: true },
      { input: 'a - (b + c)', output: 'a - b - c', isHidden: true },
      { input: '(a - b) + c', output: 'a - b + c', isHidden: true },
      { input: 'a + (b - (c + d))', output: 'a + b - c - d', isHidden: true },
      { input: '(a + (b - c))', output: 'a + b - c', isHidden: true }
    ],
    timeLimit: 2000,
    memoryLimit: 128
  },
  'sum-of-the-numbers-in-a-string': {
    statement: `## 📝 Problem Statement
Given a string s containing alphanumeric characters (letters and digits), calculate the sum of all the numbers present in the string.

Numbers are consecutive sequences of digits. Extract all numbers from the string and add them to get the total sum.

**Number Extraction Definition:**
- A number is a sequence of consecutive digits
- For example, "1abc23" contains two numbers: 1 and 23
- Numbers are separated by non-digit characters (letters, special characters)

**Algorithm Approach:**
1. Iterate through each character in the string
2. If the character is a digit, start building a number
3. Continue reading consecutive digits to form a complete number
4. When a non-digit is encountered, add the formed number to the sum
5. Continue until the end of the string
6. Return the total sum

**Time Complexity:** O(n) where n is the length of the string
**Space Complexity:** O(1) constant space (only storing the sum)

**Examples:**
- Input: s = "1abc23" → Output: 24
  Explanation: 1 and 23 are numbers in the string which is added to get the sum as 24.
- Input: s = "geeks4geeks" → Output: 4
  Explanation: 4 is the only number, so the sum is 4.

Complete the sumOfNumbers() function.`,
    inputFormat: 'A single string s containing alphanumeric characters (a-z, A-Z, 0-9) and special characters.',
    outputFormat: 'Return the sum of all numbers present in the string as an integer.',
    constraints: '1 ≤ s.length ≤ 10^5\ns can contain lowercase letters, uppercase letters, digits, and special characters\nNumbers can be multi-digit',
    sampleInput: '1abc23',
    sampleOutput: '24',
    testCases: [
      { input: '1abc23', output: '24', isHidden: false },
      { input: 'geeks4geeks', output: '4', isHidden: false },
      { input: '0', output: '0', isHidden: false },
      { input: 'abc123def456', output: '579', isHidden: true },
      { input: '12a34b56', output: '102', isHidden: true },
      { input: 'no123digits456here', output: '579', isHidden: true },
      { input: '100x200y300z', output: '600', isHidden: true },
      { input: 'a1b2c3d4e5', output: '15', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'capitalize-first-and-last-character-of-each-word': {
    statement: `## 📝 Problem Statement
You are given a string title consisting of one or more words separated by a single space, where each word consists of English letters. Capitalize the string by changing the capitalization of each word such that:

- If the length of the word is 1 or 2 letters, change all letters to lowercase.
- Otherwise, change the first letter to uppercase and the remaining letters to lowercase.

Return the capitalized title.

**Title Capitalization Rules:**
1. Words with 1-2 letters: Convert entirely to lowercase
2. Words with 3+ letters: Convert first letter to uppercase, remaining to lowercase
3. Words are separated by single spaces

**Algorithm Approach:**
1. Split the title into individual words by spaces
2. For each word:
   - If length ≤ 2: Convert to lowercase
   - If length > 2: Capitalize first letter, lowercase the rest
3. Join the words back with spaces
4. Return the result

**Time Complexity:** O(n) where n is the total length of the title
**Space Complexity:** O(n) for the output string

**Examples:**
- Input: title = "capiTalIze tHe titLe" → Output: "Capitalize The Title"
  Explanation: Since all the words have a length of at least 3, the first letter of each word is uppercase, and the remaining letters are lowercase.
- Input: title = "First leTTeR of EACH Word" → Output: "First Letter of Each Word"
  Explanation: The word "of" has length 2, so it is all lowercase. The remaining words have a length of at least 3, so the first letter of each remaining word is uppercase, and the remaining letters are lowercase.

Complete the capitalizeTitle() function.`,
    inputFormat: 'A single string title consisting of one or more words separated by a single space.',
    outputFormat: 'Return the title with proper capitalization according to the rules.',
    constraints: '1 ≤ title.length ≤ 10^5\ntitle consists of English letters and spaces\nWords are separated by single spaces',
    sampleInput: 'capiTalIze tHe titLe',
    sampleOutput: 'Capitalize The Title',
    testCases: [
      { input: 'capiTalIze tHe titLe', output: 'Capitalize The Title', isHidden: false },
      { input: 'First leTTeR of EACH Word', output: 'First Letter Of Each Word', isHidden: false },
      { input: 'hello world', output: 'Hello World', isHidden: false },
      { input: 'a b c d e', output: 'A B C D E', isHidden: true },
      { input: 'HELLO WORLD', output: 'Hello World', isHidden: true },
      { input: 'the quick brown fox', output: 'The Quick Brown Fox', isHidden: true },
      { input: 'i am learning programming', output: 'I Am Learning Programming', isHidden: true },
      { input: 'python is awesome', output: 'Python Is Awesome', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'reverse-words-in-a-string': {
    statement: `## 📝 Problem Statement
Given an input string s, reverse the order of the words.

A word is defined as a sequence of non-space characters. The words in s will be separated by at least one space. Return a string of the words in reverse order concatenated by a single space.

**Important Notes:**
- The input string s may contain leading or trailing spaces or multiple spaces between two words
- The returned string should only have a single space separating the words
- Do not include any extra spaces (leading, trailing, or multiple spaces between words)
- Words should be reversed in order, but each word itself remains unchanged

**Algorithm Approach:**
1. Split the string by spaces, filtering out empty strings (this handles multiple spaces)
2. Reverse the order of words
3. Join them back with a single space separator
4. Alternatively, use two-pointer approach: reverse entire string, then reverse each word individually

**Time Complexity:** O(n) where n is the length of the string
**Space Complexity:** O(n) for the output string (or O(1) if reversing in-place)

**Examples:**
- Input: s = "the sky is blue" → Output: "blue is sky the"
  Explanation: Words reversed: "blue", "is", "sky", "the" joined by single spaces.
- Input: s = "  hello world  " → Output: "world hello"
  Explanation: Leading and trailing spaces are removed. Only words are reversed with single space between them.
- Input: s = "a good   example" → Output: "example good a"
  Explanation: Multiple spaces between words are reduced to single spaces in the output.

Complete the reverseWords() function.`,
    inputFormat: 'A single string s containing words separated by spaces. May contain leading, trailing, or multiple consecutive spaces.',
    outputFormat: 'Return the string with words in reverse order, separated by single spaces, with no leading or trailing spaces.',
    constraints: '1 ≤ s.length ≤ 10^4\ns contains English letters, digits, and spaces\nAt least one word in s',
    sampleInput: '  hello world  ',
    sampleOutput: 'world hello',
    testCases: [
      { input: '  hello world  ', output: 'world hello', isHidden: false },
      { input: 'the sky is blue', output: 'blue is sky the', isHidden: false },
      { input: 'a good   example', output: 'example good a', isHidden: false },
      { input: 'hello', output: 'hello', isHidden: true },
      { input: 'a', output: 'a', isHidden: true },
      { input: '   a   b   c   ', output: 'c b a', isHidden: true },
      { input: 'race car', output: 'car race', isHidden: true },
      { input: 'reactive programming is fun', output: 'fun is programming reactive', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'write-a-program-to-find-a-substring-within-a-string-if-found-display-its-starting-position': {
    statement: `## 📝 Problem Statement
Given two strings txt and pat, find if pat is a substring of txt. If yes, return the index of the first occurrence, else return -1.

A substring is a contiguous sequence of characters within a string. The search is case-sensitive and should find the first (leftmost) occurrence of the pattern.

**Key Points:**
- Return the index of the FIRST occurrence of the pattern
- If the pattern appears multiple times, return only the smallest index
- Return -1 if the pattern is not found
- The search is case-sensitive
- Index is 0-based

**Algorithm Approaches:**
1. **Brute Force**: Check every position in txt to see if pat matches
2. **Built-in Method**: Use language string functions (indexOf, find, etc.)
3. **KMP Algorithm**: Knuth-Morris-Pratt for efficient pattern matching
4. **Boyer-Moore**: Another efficient string matching algorithm

**Time Complexity:** O(n*m) for brute force, O(n+m) for KMP where n=txt length, m=pat length
**Space Complexity:** O(1) for brute force, O(m) for KMP

**Examples:**
- Input: txt = "geeksforgeeks", pat = "eks" → Output: 2
  Explanation: String "eks" is present at index 2 and 10, so 2 is the smallest index.
- Input: txt = "geeksforgeeks", pat = "xyz" → Output: -1
  Explanation: There is no occurrence of "xyz" in "geeksforgeeks".

Complete the findSubstring() function.`,
    inputFormat: 'First line contains txt (main string). Second line contains pat (pattern to find).',
    outputFormat: 'Return the index of first occurrence of pat in txt, or -1 if not found.',
    constraints: '1 ≤ txt.length ≤ 10^4\n1 ≤ pat.length ≤ 10^3\npat.length ≤ txt.length\ntxt and pat contain only lowercase English letters',
    sampleInput: 'geeksforgeeks\neks',
    sampleOutput: '2',
    testCases: [
      { input: 'geeksforgeeks\neks', output: '2', isHidden: false },
      { input: 'geeksforgeeks\nxyz', output: '-1', isHidden: false },
      { input: 'abcdefghij\nabc', output: '0', isHidden: false },
      { input: 'abcdefghij\nij', output: '8', isHidden: true },
      { input: 'aaaaaaa\naaa', output: '0', isHidden: true },
      { input: 'hello\nlo', output: '3', isHidden: true },
      { input: 'programming\nprog', output: '0', isHidden: true },
      { input: 'substring\nring', output: '6', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'concatenate-one-string-to-another': {
    statement: `## 📝 Problem Statement
You are given two strings s1 and s2 and your task is to concatenate both strings and return the final concatenated string.

String concatenation means combining two or more strings together to form a new string. The result is a single string that contains all characters from both strings in order.

**Important Notes:**
- You may assume s1 will always have extra space to concatenate s2
- The order matters: s1 comes first, then s2
- No spaces or separators are added between the strings
- Both strings are combined as-is without modification

**Algorithm Approach:**
1. Simple concatenation: Use language string concatenation operators or methods
2. Character by character: Iterate through s1, append s2 at the end
3. Built-in functions: Use concat(), +, join(), or similar language functions

**Time Complexity:** O(n + m) where n = length of s1, m = length of s2
**Space Complexity:** O(n + m) for the resulting concatenated string

**Examples:**
- Input: s1 = "Hello", s2 = "World" → Output: "HelloWorld"
  Explanation: Combine "Hello" and "World" to get "HelloWorld" without any space.
- Input: s1 = "abc", s2 = "def" → Output: "abcdef"
  Explanation: Combine "abc" and "def" to get "abcdef".

Complete the concatenateStrings() function.`,
    inputFormat: 'First line contains string s1. Second line contains string s2.',
    outputFormat: 'Return the concatenated string (s1 + s2).',
    constraints: '1 ≤ s1.length ≤ 10^4\n1 ≤ s2.length ≤ 10^4\ns1 and s2 contain only English letters',
    sampleInput: 'Hello\nWorld',
    sampleOutput: 'HelloWorld',
    testCases: [
      { input: 'Hello\nWorld', output: 'HelloWorld', isHidden: false },
      { input: 'abc\ndef', output: 'abcdef', isHidden: false },
      { input: 'a\nb', output: 'ab', isHidden: false },
      { input: 'geeks\nforgeeks', output: 'geeksforgeeks', isHidden: true },
      { input: 'hello\nhello', output: 'hellohello', isHidden: true },
      { input: 'string\nconcat', output: 'stringconcat', isHidden: true },
      { input: 'open\nsource', output: 'opensource', isHidden: true },
      { input: 'java\nscript', output: 'javascript', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'change-case-of-each-character-in-a-string': {
    statement: `## 📝 Problem Statement
Given a string s consisting of English letters (both uppercase and lowercase), convert each character to its opposite case. That is, change every lowercase letter to uppercase, and every uppercase letter to lowercase.

String case toggling is a common string manipulation task used in text processing and formatting.

**Important Notes:**
- Only English letters are toggled (a-z becomes A-Z, A-Z becomes a-z)
- Non-alphabetic characters (if present) should remain unchanged
- The order of characters is preserved
- The operation should be applied to every character in the string

**Algorithm Approach:**
1. Simple iteration: Iterate through each character and check if it's uppercase or lowercase
2. Character-by-character toggle: Use built-in case conversion functions
3. Direct character manipulation: Use ASCII values or language-specific methods

**Time Complexity:** O(n) where n = length of string
**Space Complexity:** O(n) for the resulting toggled string

**Examples:**
- Input: s = "geeksForgEeks" → Output: "GEEKSfORGeEKS"
  Explanation: All lowercase letters are changed to uppercase and vice versa.
- Input: s = "SMALLcase" → Output: "smallCASE"
  Explanation: All lowercase letters are changed to uppercase and vice versa.
- Input: s = "Hello123World" → Output: "hELLO123wORLD"
  Explanation: Only letters toggle case, numbers remain unchanged.

Complete the toggleCase() function.`,
    inputFormat: 'A single line containing string s consisting of English letters (and possibly digits).',
    outputFormat: 'Return the string with all characters toggled (lowercase to uppercase and vice versa).',
    constraints: '1 ≤ s.length ≤ 10^4\ns contains English letters (a-z, A-Z) and possibly digits (0-9)',
    sampleInput: 'geeksForgEeks',
    sampleOutput: 'GEEKSfORGeEKS',
    testCases: [
      { input: 'geeksForgEeks', output: 'GEEKSfORGeEKS', isHidden: false },
      { input: 'SMALLcase', output: 'smallCASE', isHidden: false },
      { input: 'Hello123World', output: 'hELLO123wORLD', isHidden: false },
      { input: 'ABC', output: 'abc', isHidden: true },
      { input: 'xyz', output: 'XYZ', isHidden: true },
      { input: 'AbCdEfGh', output: 'aBcDeFgH', isHidden: true },
      { input: '12345', output: '12345', isHidden: true },
      { input: 'TcsNqt2024', output: 'tCSNQT2024', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'calculate-frequency-of-characters-in-a-string': {
    statement: `## 📝 Problem Statement
Given a string s, calculate and print the frequency of each character in the string. The frequency of a character is the number of times it appears in the string.

Character frequency analysis is widely used in cryptography, data compression, and text analysis.

**Important Notes:**
- Count all occurrences of each character (both uppercase and lowercase)
- Display results in order of first appearance
- Spaces and special characters (if present) should also be counted
- Output format should show each character and its frequency

**Algorithm Approach:**
1. Hash Map approach: Use a dictionary/map to store character frequencies
2. Array approach: Use an array to store frequencies (for limited character set)
3. Sorting: Sort by frequency or alphabetically

**Time Complexity:** O(n) where n = length of string
**Space Complexity:** O(k) where k = number of unique characters

**Examples:**
- Input: s = "geeksforgeeks" → Output: "g-2 e-4 k-2 s-2 f-1 o-1 r-1" (or similar format)
  Explanation: Each character's frequency is counted.
- Input: s = "hello" → Output: "h-1 e-1 l-2 o-1"
  Explanation: 'l' appears twice, others appear once.
- Input: s = "aabbcc" → Output: "a-2 b-2 c-2"
  Explanation: All characters appear exactly twice.

Complete the frequencyOfCharacters() function.`,
    inputFormat: 'A single line containing string s.',
    outputFormat: 'Print the frequency of each character in format: character-frequency (space separated). Display in order of first appearance.',
    constraints: '1 ≤ s.length ≤ 10^4\ns contains English letters, spaces, and possibly special characters',
    sampleInput: 'geeksforgeeks',
    sampleOutput: 'g-2 e-4 k-2 s-2 f-1 o-1 r-1',
    testCases: [
      { input: 'geeksforgeeks', output: 'g-2 e-4 k-2 s-2 f-1 o-1 r-1', isHidden: false },
      { input: 'hello', output: 'h-1 e-1 l-2 o-1', isHidden: false },
      { input: 'aabbcc', output: 'a-2 b-2 c-2', isHidden: false },
      { input: 'aaa', output: 'a-3', isHidden: true },
      { input: 'abcabc', output: 'a-2 b-2 c-2', isHidden: true },
      { input: 'programming', output: 'p-1 r-1 o-1 g-2 a-1 m-2 i-1 n-1', isHidden: true },
      { input: 'mississippi', output: 'm-1 i-4 s-4 p-2', isHidden: true },
      { input: 'abc', output: 'a-1 b-1 c-1', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'find-non-repeating-characters-of-a-string': {
    statement: `## 📝 Problem Statement
Given a string s, find and return all non-repeating (unique) characters in the string. A character is non-repeating if it appears exactly once in the string.

Identifying unique characters is useful in various applications like password validation and data deduplication.

**Important Notes:**
- Return characters that appear exactly once
- Maintain the order of first appearance
- Consider both uppercase and lowercase as different characters
- Ignore duplicates in the output

**Algorithm Approach:**
1. Hash Map: Count frequency first, then filter characters with frequency = 1
2. Two-pass: First pass to count, second pass to output in order
3. Linked Set: Use ordered structure for efficient ordering

**Time Complexity:** O(n) where n = length of string
**Space Complexity:** O(k) where k = number of unique characters

**Examples:**
- Input: s = "geeksforgeeks" → Output: "f o r"
  Explanation: f, o, r appear exactly once.
- Input: s = "programming" → Output: "p o a i n"
  Explanation: Only these characters appear once.
- Input: s = "aabbcc" → Output: "" (or empty)
  Explanation: No character appears exactly once.

Complete the findNonRepeating() function.`,
    inputFormat: 'A single line containing string s.',
    outputFormat: 'Print all non-repeating characters space-separated in order of first appearance. Print empty if none exist.',
    constraints: '1 ≤ s.length ≤ 10^4\ns contains English letters (a-z, A-Z)',
    sampleInput: 'geeksforgeeks',
    sampleOutput: 'f o r',
    testCases: [
      { input: 'geeksforgeeks', output: 'f o r', isHidden: false },
      { input: 'programming', output: 'p o a i n', isHidden: false },
      { input: 'aabbcc', output: '', isHidden: false },
      { input: 'abcabc', output: '', isHidden: true },
      { input: 'hello', output: 'h e o', isHidden: true },
      { input: 'abcd', output: 'a b c d', isHidden: true },
      { input: 'aaa', output: '', isHidden: true },
      { input: 'ababa', output: 'b', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'check-if-two-strings-are-anagram-of-each-other': {
    statement: `## 📝 Problem Statement
Given two strings s and t, check if they are anagrams of each other. Two strings are anagrams if one can be rearranged to form the other using the same characters with the same frequencies.

Anagram checking is used in word games, cryptography, and data validation.

**Important Notes:**
- Compare character frequencies, not order
- Case-sensitive comparison (uppercase and lowercase are different)
- Strings must have exactly the same length to be anagrams
- Special characters and spaces (if present) must also match

**Algorithm Approach:**
1. Sorting: Sort both strings and compare - if equal, they are anagrams
2. Hash Map: Count character frequencies in both strings and compare
3. Array: Use fixed-size array for character counts

**Time Complexity:** O(n log n) for sorting approach, O(n) for hash map approach
**Space Complexity:** O(1) if using fixed array, O(k) for hash map

**Examples:**
- Input: s = "listen", t = "silent" → Output: "true"
  Explanation: Both have same characters: l, i, s, t, e, n
- Input: s = "geeks", t = "kseeg" → Output: "true"
  Explanation: Both strings contain same characters with same frequency.
- Input: s = "abc", t = "def" → Output: "false"
  Explanation: No common characters.

Complete the isAnagram() function.`,
    inputFormat: 'First line contains string s. Second line contains string t.',
    outputFormat: 'Return "true" if anagrams, "false" otherwise.',
    constraints: '1 ≤ s.length, t.length ≤ 10^4\ns and t contain lowercase English letters',
    sampleInput: 'listen\nsilent',
    sampleOutput: 'true',
    testCases: [
      { input: 'listen\nsilent', output: 'true', isHidden: false },
      { input: 'geeks\nkseeg', output: 'true', isHidden: false },
      { input: 'abc\ndef', output: 'false', isHidden: false },
      { input: 'anagram\nnagaram', output: 'true', isHidden: true },
      { input: 'ab\nba', output: 'true', isHidden: true },
      { input: 'aab\naba', output: 'true', isHidden: true },
      { input: 'abc\nabc', output: 'true', isHidden: true },
      { input: 'hello\nworld', output: 'false', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'return-maximum-occurring-character-in-the-input-string': {
    statement: `## 📝 Problem Statement
Given a string s, return the character that appears most frequently in the string. If multiple characters have the same maximum frequency, return the one that appears first in the string.

Finding the maximum occurring character is useful in text analysis, compression, and frequency analysis.

**Important Notes:**
- Return the character (not its frequency)
- If tie, return the character that appears first
- Case-sensitive (uppercase and lowercase are different)
- Spaces and special characters should be considered

**Algorithm Approach:**
1. Hash Map: Count all characters, find maximum, return corresponding character
2. Iteration: Single pass through string while maintaining running maximum
3. Array: Use fixed-size array for efficient counting

**Time Complexity:** O(n) where n = length of string
**Space Complexity:** O(k) where k = number of unique characters

**Examples:**
- Input: s = "geeksforgeeks" → Output: "e"
  Explanation: 'e' appears 4 times, which is maximum.
- Input: s = "abcccdddee" → Output: "d"
  Explanation: Both 'd' and 'e' appear 3 times, but 'd' appears at lower index.
- Input: s = "aabbcc" → Output: "a"
  Explanation: All characters appear 2 times, 'a' appears first.

Complete the maxOccurringChar() function.`,
    inputFormat: 'A single line containing string s.',
    outputFormat: 'Return the character with maximum frequency (single character as output).',
    constraints: '1 ≤ s.length ≤ 10^4\ns contains English letters (a-z, A-Z)',
    sampleInput: 'geeksforgeeks',
    sampleOutput: 'e',
    testCases: [
      { input: 'geeksforgeeks', output: 'e', isHidden: false },
      { input: 'abcccdddee', output: 'd', isHidden: false },
      { input: 'aabbcc', output: 'a', isHidden: false },
      { input: 'aaa', output: 'a', isHidden: true },
      { input: 'programming', output: 'g', isHidden: true },
      { input: 'mississippi', output: 's', isHidden: true },
      { input: 'abcd', output: 'a', isHidden: true },
      { input: 'hello', output: 'l', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'remove-all-duplicates-from-the-input-string': {
    statement: `## 📝 Problem Statement
Given a string s, remove all duplicate characters and return the resulting string. Keep only the first occurrence of each character, removing all subsequent duplicates.

Duplicate removal is useful in data deduplication, unique character extraction, and text processing.

**Important Notes:**
- Keep only the first occurrence of each character
- Maintain the order of first appearance
- Remove all subsequent occurrences
- Case-sensitive (uppercase and lowercase are different)

**Algorithm Approach:**
1. Hash Set: Track seen characters, keep only first occurrence
2. Ordered Set: Use data structure that maintains insertion order
3. Index Array: Mark positions to keep

**Time Complexity:** O(n) where n = length of string
**Space Complexity:** O(k) where k = number of unique characters

**Examples:**
- Input: s = "geeksforgeeks" → Output: "geksfor"
  Explanation: Remove duplicate g, e, e, k, s.
- Input: s = "hello" → Output: "helo"
  Explanation: 'l' appears twice, keep first occurrence.
- Input: s = "aabbcc" → Output: "abc"
  Explanation: All duplicates are removed.

Complete the removeDuplicates() function.`,
    inputFormat: 'A single line containing string s.',
    outputFormat: 'Return the string with all duplicate characters removed (keeping first occurrence).',
    constraints: '1 ≤ s.length ≤ 10^4\ns contains lowercase English letters',
    sampleInput: 'geeksforgeeks',
    sampleOutput: 'geksfor',
    testCases: [
      { input: 'geeksforgeeks', output: 'geksfor', isHidden: false },
      { input: 'hello', output: 'helo', isHidden: false },
      { input: 'aabbcc', output: 'abc', isHidden: false },
      { input: 'abcd', output: 'abcd', isHidden: true },
      { input: 'aaa', output: 'a', isHidden: true },
      { input: 'programming', output: 'progamin', isHidden: true },
      { input: 'mississippi', output: 'misp', isHidden: true },
      { input: 'aaabbbccc', output: 'abc', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'print-all-the-duplicates-in-the-input-string': {
    statement: `## 📝 Problem Statement
Given a string s, identify and print all characters that appear more than once. A duplicate character is one that occurs 2 or more times in the string.

Duplicate detection is useful in data validation, fraud detection, and text analysis.

**Important Notes:**
- Print each duplicate character only once
- Display in order of first appearance
- Include duplicates only (characters appearing > 1 time)
- Case-sensitive (uppercase and lowercase are different)

**Algorithm Approach:**
1. Hash Map: Count frequency of each character, print those with count > 1
2. Two-pass: First count, second pass output
3. Sorting: Sort and identify consecutive duplicates

**Time Complexity:** O(n) where n = length of string
**Space Complexity:** O(k) where k = number of unique characters

**Examples:**
- Input: s = "geeksforgeeks" → Output: "g e k s f o r" (or similar format)
  Explanation: Characters appearing more than once.
- Input: s = "hello" → Output: "l"
  Explanation: Only 'l' appears twice.
- Input: s = "abcd" → Output: "" (or none/empty)
  Explanation: No duplicate characters.

Complete the printDuplicates() function.`,
    inputFormat: 'A single line containing string s.',
    outputFormat: 'Print all duplicate characters space-separated in order of first appearance. Empty line if no duplicates.',
    constraints: '1 ≤ s.length ≤ 10^4\ns contains lowercase English letters',
    sampleInput: 'geeksforgeeks',
    sampleOutput: 'g e k s f o r',
    testCases: [
      { input: 'geeksforgeeks', output: 'g e k s f o r', isHidden: false },
      { input: 'hello', output: 'l', isHidden: false },
      { input: 'abcd', output: '', isHidden: false },
      { input: 'aabbcc', output: 'a b c', isHidden: true },
      { input: 'aaa', output: 'a', isHidden: true },
      { input: 'programming', output: 'p r o g m', isHidden: true },
      { input: 'mississippi', output: 'm i s p', isHidden: true },
      { input: 'uniqueness', output: 'u e', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'remove-characters-from-first-string-present-in-the-second-string': {
    statement: `## 📝 Problem Statement
Given two strings s1 and s2, remove all characters from s1 that are present in s2. Keep only characters from s1 that are NOT in s2, maintaining the original order.

String filtering is useful in text processing, data cleaning, and selective character preservation.

**Important Notes:**
- Remove from s1 characters that appear anywhere in s2
- Maintain the order of remaining characters from s1
- Case-sensitive comparison
- Remove all occurrences of matching characters

**Algorithm Approach:**
1. Hash Set: Create set of characters in s2, filter s1
2. Two-pointer: Iterate s1, check each character against s2
3. Built-in functions: Use filter/map operations

**Time Complexity:** O(n + m) where n = s1 length, m = s2 length
**Space Complexity:** O(m) for character set from s2

**Examples:**
- Input: s1 = "geeksforgeeks", s2 = "aeiou" → Output: "gksfrgks"
  Explanation: Remove all vowels (a, e, i, o, u).
- Input: s1 = "hello", s2 = "aeiou" → Output: "hll"
  Explanation: Remove 'e' and 'o'.
- Input: s1 = "abc", s2 = "xyz" → Output: "abc"
  Explanation: No common characters, return original.

Complete the removeCharacters() function.`,
    inputFormat: 'First line contains s1. Second line contains s2.',
    outputFormat: 'Return characters from s1 that are not in s2, maintaining order.',
    constraints: '1 ≤ s1.length, s2.length ≤ 10^4\ns1 and s2 contain lowercase English letters',
    sampleInput: 'geeksforgeeks\naeiou',
    sampleOutput: 'gksfrgks',
    testCases: [
      { input: 'geeksforgeeks\naeiou', output: 'gksfrgks', isHidden: false },
      { input: 'hello\naeiou', output: 'hll', isHidden: false },
      { input: 'abc\nxyz', output: 'abc', isHidden: false },
      { input: 'abcabc\nabc', output: '', isHidden: true },
      { input: 'programming\naeiou', output: 'prgrmmng', isHidden: true },
      { input: 'hello\nlo', output: 'he', isHidden: true },
      { input: 'mississippi\nsimp', output: '', isHidden: true },
      { input: 'geeksforgeeks\nxyz', output: 'geeksforgeeks', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'count-number-of-words-in-a-given-string': {
    statement: `## 📝 Problem Statement
Given a string s, count the total number of words in the string. A word is defined as a sequence of non-space characters separated by one or more spaces.

Word counting is fundamental in text processing, natural language analysis, and document metrics.

**Important Notes:**
- Words are separated by spaces (one or more)
- Leading and trailing spaces should be handled
- Count only non-empty words
- Special characters attached to words count as part of the word

**Algorithm Approach:**
1. Split approach: Split by spaces and count non-empty parts
2. Iteration: Iterate through string, count word transitions
3. Regex: Use pattern matching for word boundaries

**Time Complexity:** O(n) where n = length of string
**Space Complexity:** O(1) for iteration approach, O(k) for split approach

**Examples:**
- Input: s = "hello world" → Output: 2
  Explanation: Two words separated by space.
- Input: s = "  hello   world  " → Output: 2
  Explanation: Extra spaces are ignored, still 2 words.
- Input: s = "geeksforgeeks" → Output: 1
  Explanation: Single word without spaces.

Complete the countWords() function.`,
    inputFormat: 'A single line containing string s with words separated by spaces.',
    outputFormat: 'Return the count of words as a single integer.',
    constraints: '1 ≤ s.length ≤ 10^4\ns contains English letters and spaces',
    sampleInput: 'hello world',
    sampleOutput: '2',
    testCases: [
      { input: 'hello world', output: '2', isHidden: false },
      { input: '  hello   world  ', output: '2', isHidden: false },
      { input: 'geeksforgeeks', output: '1', isHidden: false },
      { input: 'a b c d e', output: '5', isHidden: true },
      { input: 'hello world geeks', output: '3', isHidden: true },
      { input: '   ', output: '0', isHidden: true },
      { input: 'the quick brown fox', output: '4', isHidden: true },
      { input: 'singularword', output: '1', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'change-every-letter-with-the-next-lexicographic-alphabet-in-the-given-string': {
    statement: `## 📝 Problem Statement
Given a string s consisting of lowercase English letters, change every letter to the next lexicographic alphabet. The letter 'z' should wrap around to 'a'.

Character transformation is useful in cryptography, Caesar cipher implementation, and text encoding.

**Important Notes:**
- Each letter changes to the next one (a→b, b→c, ..., z→a)
- Only lowercase letters are transformed
- Non-alphabetic characters remain unchanged
- Wrap-around: 'z' becomes 'a'

**Algorithm Approach:**
1. Direct transformation: Map each character to next
2. ASCII arithmetic: Use character codes for transformation
3. Modulo approach: Use modulo 26 for wrap-around

**Time Complexity:** O(n) where n = length of string
**Space Complexity:** O(n) for resulting string

**Examples:**
- Input: s = "abcxyz" → Output: "bcdyza"
  Explanation: Each letter shifts to next, z wraps to a.
- Input: s = "hello" → Output: "ifmmp"
  Explanation: h→i, e→f, l→m, l→m, o→p.
- Input: s = "xyz" → Output: "yza"
  Explanation: x→y, y→z, z→a.

Complete the nextAlphabet() function.`,
    inputFormat: 'A single line containing string s of lowercase English letters.',
    outputFormat: 'Return the string with each letter changed to next lexicographic alphabet.',
    constraints: '1 ≤ s.length ≤ 10^4\ns contains lowercase English letters',
    sampleInput: 'abcxyz',
    sampleOutput: 'bcdyza',
    testCases: [
      { input: 'abcxyz', output: 'bcdyza', isHidden: false },
      { input: 'hello', output: 'ifmmp', isHidden: false },
      { input: 'xyz', output: 'yza', isHidden: false },
      { input: 'z', output: 'a', isHidden: true },
      { input: 'abc', output: 'bcd', isHidden: true },
      { input: 'zzz', output: 'aaa', isHidden: true },
      { input: 'programming', output: 'qsphsnnnjoh', isHidden: true },
      { input: 'geeksforgeeks', output: 'hfflrugshfflr', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'write-a-program-to-find-the-largest-word-in-a-given-string': {
    statement: `## 📝 Problem Statement
Given a string s containing words separated by spaces, find and return the largest word. A word is defined as a sequence of non-space characters. The largest word is the one with maximum length.

Finding the longest word is useful in text analysis, word statistics, and natural language processing.

**Important Notes:**
- Words are separated by spaces (one or more)
- Return the word itself, not its length
- If multiple words have same length, return the first one
- Handle leading/trailing spaces

**Algorithm Approach:**
1. Split: Split string by spaces, find longest
2. Iteration: Iterate through string, track current word and maximum
3. Regex: Use pattern matching to extract words

**Time Complexity:** O(n) where n = length of string
**Space Complexity:** O(m) where m = length of longest word

**Examples:**
- Input: s = "I am learning programming" → Output: "programming"
  Explanation: programming (11) is longest.
- Input: s = "hello world geeks" → Output: "hello" or "world"
  Explanation: hello, world, geeks have lengths 5, 5, 5; return first.
- Input: s = "a ab abc" → Output: "abc"
  Explanation: abc is longest with length 3.

Complete the largestWord() function.`,
    inputFormat: 'A single line containing string s with words separated by spaces.',
    outputFormat: 'Return the largest word (by length).',
    constraints: '1 ≤ s.length ≤ 10^4\ns contains English letters and spaces',
    sampleInput: 'I am learning programming',
    sampleOutput: 'programming',
    testCases: [
      { input: 'I am learning programming', output: 'programming', isHidden: false },
      { input: 'hello world geeks', output: 'hello', isHidden: false },
      { input: 'a ab abc', output: 'abc', isHidden: false },
      { input: 'the quick brown fox jumps', output: 'quick', isHidden: true },
      { input: 'coding is fun', output: 'coding', isHidden: true },
      { input: 'geeksforgeeks', output: 'geeksforgeeks', isHidden: true },
      { input: 'a', output: 'a', isHidden: true },
      { input: 'computer science algorithm', output: 'computer', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'write-a-program-to-sort-characters-in-a-string': {
    statement: `## 📝 Problem Statement
Given a string s consisting of lowercase English letters, sort all characters alphabetically and return the sorted string.

Character sorting is useful in lexicographic ordering, anagram detection, and text normalization.

**Important Notes:**
- Sort all characters alphabetically
- Maintain all characters (no removal)
- Case matters if mixed case present
- Result should be a string, not array

**Algorithm Approach:**
1. Convert and sort: Convert to array, sort, convert back
2. Counting sort: Use count array for efficient sorting
3. Built-in sort: Use language sorting functions

**Time Complexity:** O(n log n) for comparison sort, O(n) for counting sort
**Space Complexity:** O(n) for result string

**Examples:**
- Input: s = "geeksforgeeks" → Output: "eeeefggkkorss"
  Explanation: All characters sorted alphabetically.
- Input: s = "hello" → Output: "ehllo"
  Explanation: Characters sorted in order.
- Input: s = "dcba" → Output: "abcd"
  Explanation: Reverse string becomes sorted.

Complete the sortCharacters() function.`,
    inputFormat: 'A single line containing string s of lowercase English letters.',
    outputFormat: 'Return the string with all characters sorted alphabetically.',
    constraints: '1 ≤ s.length ≤ 10^4\ns contains lowercase English letters',
    sampleInput: 'geeksforgeeks',
    sampleOutput: 'eeeefggkkorss',
    testCases: [
      { input: 'geeksforgeeks', output: 'eeeefggkkorss', isHidden: false },
      { input: 'hello', output: 'ehllo', isHidden: false },
      { input: 'dcba', output: 'abcd', isHidden: false },
      { input: 'abc', output: 'abc', isHidden: true },
      { input: 'cba', output: 'abc', isHidden: true },
      { input: 'aabbcc', output: 'aabbcc', isHidden: true },
      { input: 'zzaabb', output: 'aabbzz', isHidden: true },
      { input: 'programming', output: 'aggimmnoprr', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'write-a-program-to-find-a-word-in-a-given-string-which-has-the-highest-number-of-repeated-letters': {
    statement: `## 📝 Problem Statement
Given a string s containing words separated by spaces, find the word that has the highest number of repeated (duplicate) letters. If multiple words have the same number of repeated letters, return the first one.

Identifying words with repeated letters is useful in text analysis and pattern detection.

**Important Notes:**
- Count how many characters repeat in each word
- A character repeating means appearing more than once
- Count unique characters that repeat (not total repetitions)
- Words separated by spaces

**Algorithm Approach:**
1. Split and analyze: Split into words, check each word
2. Frequency map: Create frequency map for each word
3. Iteration: Track repeating characters

**Time Complexity:** O(n) where n = total length of string
**Space Complexity:** O(k) where k = max word length

**Examples:**
- Input: s = "a aa aaa b bb bbb" → Output: "aaa"
  Explanation: aaa has 1 unique repeated letter (a appears 3 times).
- Input: s = "hello world programming" → Output: "programming"
  Explanation: programming has 2 repeated chars (g appears 2 times, m appears 2 times).
- Input: s = "abc def ghi" → Output: "abc"
  Explanation: No words have repeated letters; return first.

Complete the wordWithMostRepeats() function.`,
    inputFormat: 'A single line containing string s with words separated by spaces.',
    outputFormat: 'Return the word with the highest number of repeated (duplicate) characters.',
    constraints: '1 ≤ s.length ≤ 10^4\ns contains English letters and spaces',
    sampleInput: 'a aa aaa b bb bbb',
    sampleOutput: 'aaa',
    testCases: [
      { input: 'a aa aaa b bb bbb', output: 'aaa', isHidden: false },
      { input: 'hello world programming', output: 'programming', isHidden: false },
      { input: 'abc def ghi', output: 'abc', isHidden: false },
      { input: 'geeks for geeks', output: 'geeks', isHidden: true },
      { input: 'book look tell', output: 'book', isHidden: true },
      { input: 'aabbcc ddeeff', output: 'aabbcc', isHidden: true },
      { input: 'mississippi', output: 'mississippi', isHidden: true },
      { input: 'unique words here', output: 'unique', isHidden: true }
    ],
    timeLimit: 1500,
    memoryLimit: 128
  },
  'count-common-sub-sequence-in-two-strings': {
    statement: `## 📝 Problem Statement
Given two strings s and t, return the number of distinct subsequences of s which equal t. A subsequence is derived by deleting some (or not) characters without changing the order of remaining characters.

Subsequence counting is used in sequence alignment, DNA analysis, and dynamic programming problems.

**Important Notes:**
- Count distinct subsequences (not occurrences)
- Subsequence maintains order but characters need not be consecutive
- Case-sensitive comparison
- Empty subsequence counts as 1 if target is empty

**Algorithm Approach:**
1. Dynamic Programming: Create 2D DP table
2. Recursion with Memoization: Track positions in both strings
3. Bottom-up DP: Fill table iteratively

**Time Complexity:** O(m*n) where m = s.length, n = t.length
**Space Complexity:** O(m*n) for DP table

**Examples:**
- Input: s = "babgbag", t = "bag" → Output: 5
  Explanation: [ba_g_], [ba__g], [b_a_g], [__a_bag], [b_agba_]
- Input: s = "raban", t = "ban" → Output: 3
  Explanation: [r_aban], [rab_an], [raba_n]
- Input: s = "abc", t = "abc" → Output: 1
  Explanation: Only one way to form "abc" from "abc".

Complete the distinctSubsequences() function.`,
    inputFormat: 'First line contains s. Second line contains t.',
    outputFormat: 'Return the number of distinct subsequences of s that equal t.',
    constraints: '1 ≤ s.length, t.length ≤ 1000\ns and t contain lowercase English letters',
    sampleInput: 'babgbag\nbag',
    sampleOutput: '5',
    testCases: [
      { input: 'babgbag\nbag', output: '5', isHidden: false },
      { input: 'raban\nban', output: '3', isHidden: false },
      { input: 'abc\nabc', output: '1', isHidden: false },
      { input: 'aaaa\naa', output: '6', isHidden: true },
      { input: 'abc\nxy', output: '0', isHidden: true },
      { input: 'a\na', output: '1', isHidden: true },
      { input: 'geeksforgeeks\ngeeks', output: '8', isHidden: true },
      { input: 'programming\ngrm', output: '4', isHidden: true }
    ],
    timeLimit: 2000,
    memoryLimit: 256
  },
  'check-if-two-strings-match-where-one-string-contains-wildcard-characters': {
    statement: `## 📝 Problem Statement
Given two strings s and p where p contains wildcard characters ('*' and '?'), check if p matches s.
- '?' matches any single character
- '*' matches any sequence of characters (including empty sequence)

Wildcard matching is used in file systems, pattern matching, and regex implementations.

**Important Notes:**
- '*' can match zero or more characters
- '?' matches exactly one character
- Case-sensitive matching
- Both strings are non-empty

**Algorithm Approach:**
1. Dynamic Programming: Create 2D DP table for matching
2. Greedy with Backtracking: Process character by character
3. Two-pointer technique with wildcards

**Time Complexity:** O(m*n) where m = s.length, n = p.length
**Space Complexity:** O(m*n) for DP table

**Examples:**
- Input: s = "aa", p = "a" → Output: "false"
  Explanation: Pattern "a" cannot match "aa"
- Input: s = "aa", p = "*" → Output: "true"
  Explanation: '*' matches any sequence including "aa"
- Input: s = "cb", p = "?a" → Output: "false"
  Explanation: '?' matches 'c' but 'a' cannot match 'b'

Complete the isMatch() function.`,
    inputFormat: 'First line contains s (string). Second line contains p (pattern with wildcards).',
    outputFormat: 'Return "true" if pattern matches, "false" otherwise.',
    constraints: '1 ≤ s.length, p.length ≤ 2000\ns contains only lowercase English letters\np contains lowercase English letters, "*", and "?"',
    sampleInput: 'aa\n*',
    sampleOutput: 'true',
    testCases: [
      { input: 'aa\n*', output: 'true', isHidden: false },
      { input: 'aa\na', output: 'false', isHidden: false },
      { input: 'cb\n?a', output: 'false', isHidden: false },
      { input: 'adceb\n*a*b', output: 'true', isHidden: true },
      { input: 'acdcb\na*c?b', output: 'false', isHidden: true },
      { input: 'aab\nc*a*b', output: 'false', isHidden: true },
      { input: 'mississippi\nm*iss*p*.', output: 'false', isHidden: true },
      { input: 'geeks\ng*k*', output: 'true', isHidden: true }
    ],
    timeLimit: 2000,
    memoryLimit: 256
  },
  'palindrome-string': {
    statement: `## 📝 Problem Statement
Already covered in 'Check if a given string is palindrome or not'. This is a reference problem.

Given a string s, check if it reads the same forwards and backwards (ignoring spaces and case if applicable).

A palindrome is a word, phrase, or sequence that reads the same in both directions.

**Examples:**
- Input: s = "abba" → Output: "true"
- Input: s = "abc" → Output: "false"
- Input: s = "a" → Output: "true"

Complete the isPalindrome() function.`,
    inputFormat: 'A single line containing string s.',
    outputFormat: 'Return "true" if palindrome, "false" otherwise.',
    constraints: '1 ≤ s.length ≤ 10^4\ns contains lowercase English letters',
    sampleInput: 'abba',
    sampleOutput: 'true',
    testCases: [
      { input: 'abba', output: 'true', isHidden: false },
      { input: 'abc', output: 'false', isHidden: false },
      { input: 'a', output: 'true', isHidden: false },
      { input: 'racecar', output: 'true', isHidden: true },
      { input: 'hello', output: 'false', isHidden: true },
      { input: 'aabbaa', output: 'true', isHidden: true },
      { input: 'geeksforgeeks', output: 'false', isHidden: true },
      { input: 'madam', output: 'true', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'find-the-longest-string': {
    statement: `## 📝 Problem Statement
Given an array of strings words[], find the longest string in words[] such that every prefix of it is also present in the array words[].

A prefix of a string is any substring starting from the beginning. For example, prefixes of "problem" are: "p", "pr", "pro", "prob", "probl", "problem".

This problem requires understanding of prefix relationships and array searching strategies.

**Important Notes:**
- Every prefix of the result string must be present in the array
- If multiple strings have the same maximum length, return the lexicographically smallest one
- All prefixes of the answer string must be present in the input array
- A single character is always a valid prefix

**Algorithm Approach:**
1. Brute Force: Check each word with all prefixes against the array
2. Hash Set: Convert array to set for O(1) prefix lookup
3. Trie: Build trie and traverse for words with all prefixes
4. Sorting + Checking: Sort by length descending, lexicographically ascending

**Time Complexity:** O(n * m * k) where n = array length, m = max string length, k = average prefix count
**Space Complexity:** O(n * m) for hash set or trie

**Examples:**
- Input: words[] = ["p", "pr", "pro", "probl", "problem", "pros", "process", "processor"]
  Output: "pros"
  Explanation: "pros" has all prefixes ("p", "pr", "pro", "pros") in the array. "problem" also qualifies but is lexicographically larger.

- Input: words[] = ["ab", "a", "abc", "abd"]
  Output: "abc"
  Explanation: Both "abc" and "abd" have all prefixes ("a", "ab") in array. "abc" is lexicographically smaller.

- Input: words[] = ["car", "card", "care", "careful"]
  Output: "careful"
  Explanation: "careful" has all prefixes ("c", "ca", "car", "care", "caref", "carefu", "careful") present.

Complete the findLongestString() function.`,
    inputFormat: 'First line contains n (size of array). Next n lines contain strings, one per line.',
    outputFormat: 'Return the longest string where all its prefixes are present in the array. If multiple strings have same length, return lexicographically smallest.',
    constraints: '1 ≤ n ≤ 10^4\n1 ≤ length of each string ≤ 100\nAll strings contain only lowercase English letters\nAll strings are unique',
    sampleInput: '8\np\npr\npro\nprobl\nproblem\npros\nprocess\nprocessor',
    sampleOutput: 'pros',
    testCases: [
      { input: '8\np\npr\npro\nprobl\nproblem\npros\nprocess\nprocessor', output: 'pros', isHidden: false },
      { input: '4\nab\na\nabc\nabd', output: 'abc', isHidden: false },
      { input: '7\ncar\ncard\ncare\ncareful\nc\nca\ncare', output: 'careful', isHidden: false },
      { input: '3\na\nab\nabc', output: 'abc', isHidden: true },
      { input: '1\na', output: 'a', isHidden: true },
      { input: '6\nw\nwo\nwor\nworl\nworld\nword', output: 'world', isHidden: true },
      { input: '5\nx\nxi\nxia\nxian\nxians', output: 'xians', isHidden: true },
      { input: '4\ncode\nc\nco\ncod', output: 'cod', isHidden: true }
    ],
    timeLimit: 2000,
    memoryLimit: 256
  },
  'longest-common-prefix': {
    statement: `## 📝 Problem Statement
Given an array of strings words[], write a function to find the longest common prefix string amongst all the strings.

The longest common prefix (LCP) is the longest string that is a prefix of all strings in the array.

**Important Notes:**
- If there is no common prefix, return empty string
- All strings must be considered
- Comparison is case-sensitive
- Prefixes must start from the beginning of each string

**Algorithm Approach:**
1. Horizontal scanning: Compare strings one by one
2. Vertical scanning: Compare character by character across all strings
3. Divide and Conquer: Split array and find LCP recursively
4. Trie: Build trie and find common path

**Time Complexity:** O(n * m) where n = number of strings, m = length of shortest string
**Space Complexity:** O(1) excluding result

**Examples:**
- Input: words[] = ["flower", "flow", "flight"]
  Output: "fl"
  Explanation: "fl" is common prefix in all three strings.

- Input: words[] = ["dog", "racecar", "car"]
  Output: ""
  Explanation: No common prefix exists.

- Input: words[] = ["interspecies", "interstellar", "interstate"]
  Output: "inters"
  Explanation: "inters" is the longest common prefix.

Complete the longestCommonPrefix() function.`,
    inputFormat: 'First line contains n (number of strings). Next n lines contain strings.',
    outputFormat: 'Return the longest common prefix string. Return empty string if no common prefix.',
    constraints: '1 ≤ n ≤ 200\n0 ≤ words[i].length ≤ 200\nwords[i] consists of only lowercase English letters',
    sampleInput: '3\nflower\nflow\nflight',
    sampleOutput: 'fl',
    testCases: [
      { input: '3\nflower\nflow\nflight', output: 'fl', isHidden: false },
      { input: '3\ndog\nracecar\ncar', output: '', isHidden: false },
      { input: '3\ninterspecies\ninterstellar\ninterstate', output: 'inters', isHidden: false },
      { input: '1\nhello', output: 'hello', isHidden: true },
      { input: '2\na\na', output: 'a', isHidden: true },
      { input: '3\ngeeks\ngeeks\ngeeks', output: 'geeks', isHidden: true },
      { input: '3\nabc\nabd\nabe', output: 'ab', isHidden: true },
      { input: '4\ntest\ntesting\ntester\ntests', output: 'test', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'check-if-string-is-rotated-by-two-places': {
    statement: `## 📝 Problem Statement
Given two strings s1 and s2, determine if one string is a rotation of another by 2 places.

A rotation by 2 places means moving the first 2 characters to the end (or equivalently, moving the last 2 characters to the beginning).

**Important Notes:**
- Rotation is circular and specific (exactly 2 places)
- String lengths must be equal (after accounting for rotation)
- Case-sensitive comparison
- Both forward (left) and backward (right) rotations by 2 places are valid

**Algorithm Approach:**
1. Direct checking: Compare after rotating by 2 places
2. Substring approach: Check if rotated string is substring of concatenated string
3. Character-by-character verification

**Time Complexity:** O(n) where n = length of string
**Space Complexity:** O(n) for rotated string

**Examples:**
- Input: s1 = "waterbottle", s2 = "tlewater"
  Output: "true"
  Explanation: First 2 chars "wa" moved to end gives "terbottlewa", not matching. 
               Last 2 chars "le" moved to start gives "lewaterbot" - check other direction.

- Input: s1 = "abcd", s2 = "cdab"
  Output: "true"
  Explanation: "cd" at start moved to end gives "cdab" (rotation by 2 to right).

- Input: s1 = "hello", s2 = "llohe"
  Output: "true"
  Explanation: "he" moved to end gives "llohe" (rotation by 2 to left).

Complete the isRotatedByTwo() function.`,
    inputFormat: 'First line contains s1. Second line contains s2.',
    outputFormat: 'Return "true" if s2 is rotation of s1 by exactly 2 places, "false" otherwise.',
    constraints: '1 ≤ s1.length, s2.length ≤ 10^4\ns1 and s2 contain only lowercase English letters',
    sampleInput: 'abcd\ncdab',
    sampleOutput: 'true',
    testCases: [
      { input: 'abcd\ncdab', output: 'true', isHidden: false },
      { input: 'hello\nllhe', output: 'false', isHidden: false },
      { input: 'hello\nllohe', output: 'true', isHidden: false },
      { input: 'ab\nab', output: 'false', isHidden: true },
      { input: 'abc\ncab', output: 'true', isHidden: true },
      { input: 'geeks\nksge', output: 'false', isHidden: true },
      { input: 'programming\nmmprogrammi', output: 'true', isHidden: true },
      { input: 'rotate\naterot', output: 'true', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  },
  'check-if-string-can-be-made-equal-by-reverse-operations': {
    statement: `## 📝 Problem Statement
Given a string s, check if the string can be made equal by performing reverse operations. In each operation, you can reverse any substring of length 2.

By repeatedly reversing substrings of exactly length 2, determine if you can make the string equal to itself (check for palindrome possibility) or transform it.

**Important Notes:**
- Each operation reverses exactly 2 consecutive characters
- You can perform unlimited operations
- Goal is to check if string can achieve target configuration
- Adjacent character swaps are effectively what happen

**Algorithm Approach:**
1. Parity analysis: Check if positions can be rearranged
2. Sorting simulation: See what permutations are achievable
3. Graph approach: Build graph of reachable configurations

**Time Complexity:** O(n) for analysis
**Space Complexity:** O(n)

**Examples:**
- Input: s = "ab"
  Output: "true"
  Explanation: Can reverse to get "ba".

- Input: s = "abc"
  Output: "true"
  Explanation: Multiple reverse operations can rearrange.

- Input: s = "abcd"
  Output: "true"
  Explanation: Any permutation achievable through adjacent swaps.

Complete the canMakeEqual() function.`,
    inputFormat: 'A single line containing string s.',
    outputFormat: 'Return "true" if string can be rearranged, "false" otherwise.',
    constraints: '1 ≤ s.length ≤ 10^4\ns contains only lowercase English letters',
    sampleInput: 'ab',
    sampleOutput: 'true',
    testCases: [
      { input: 'ab', output: 'true', isHidden: false },
      { input: 'abc', output: 'true', isHidden: false },
      { input: 'abcd', output: 'true', isHidden: false },
      { input: 'a', output: 'true', isHidden: true },
      { input: 'aa', output: 'true', isHidden: true },
      { input: 'hello', output: 'true', isHidden: true },
      { input: 'geeks', output: 'true', isHidden: true },
      { input: 'programming', output: 'true', isHidden: true }
    ],
    timeLimit: 1500,
    memoryLimit: 128
  },
  'k-maximum-sum-combinations-from-two-arrays': {
    statement: `## 📝 Problem Statement
Given two integer arrays a[] and b[] of the same length, and a positive integer k, the goal is to find the top k maximum sum combinations, where each combination is formed by adding one element from a and one from b. Each index from both arrays can be used at most once in a pair. Return the k largest sums in descending order.

**Problem Details:**
- Two arrays of integers: a[] and b[]
- Each combination pairs one element from a[] with one element from b[]
- Each index can be used at most once in a single pair
- Find the k largest possible sums
- Return results in descending order

**Algorithm Approach:**
1. **Brute Force Approach:**
   - Generate all n² possible combinations
   - Sort all combinations
   - Return top k
   - Time: O(n² log n), Space: O(n²)

2. **Max Heap Approach (Recommended):**
   - Sort both arrays
   - Use max heap to track the largest sums
   - Extract k times from heap
   - Time: O(n log n + k log n), Space: O(k)

3. **Two Pointers Approach:**
   - Sort both arrays
   - Use two pointers to find maximum combinations
   - Time: O(n log n + k), Space: O(k)

4. **Optimized Heap with Indices:**
   - Maintain heap of (sum, index_a, index_b) tuples
   - Use visited set to avoid duplicates
   - Time: O(n log n + k log k)

**Examples:**

Input: a[] = [3, 2], b[] = [1, 4], k = 2
Output: [7, 6]
Explanation: Possible sums: 3 + 1 = 4, 3 + 4 = 7, 2 + 1 = 3, 2 + 4 = 6. Top 2 sums are 7 and 6.

Input: a[] = [1, 4, 2, 3], b[] = [2, 5, 1, 6], k = 3
Output: [10, 9, 9]
Explanation: The top 3 maximum possible sums are: 4 + 6 = 10, 3 + 6 = 9, and 4 + 5 = 9.

**Time Complexity:** O(n log n + k log n) for optimized approach
**Space Complexity:** O(k) for storing k combinations

Complete the function to parse input and return the k maximum sum combinations.`,
    inputFormat: 'First line: n (length of both arrays). Second line: n space-separated integers for array a[]. Third line: n space-separated integers for array b[]. Fourth line: k (number of combinations to find).',
    outputFormat: 'Return k maximum sum combinations in descending order as space-separated integers on a single line.',
    constraints: '1 ≤ n ≤ 1000\n1 ≤ k ≤ min(n², 10000)\n-10^5 ≤ a[i], b[i] ≤ 10^5',
    sampleInput: '2\n3 2\n1 4\n2',
    sampleOutput: '7 6',
    testCases: [
      { input: '2\n3 2\n1 4\n2', output: '7 6', isHidden: false },
      { input: '4\n1 4 2 3\n2 5 1 6\n3', output: '10 9 9', isHidden: false },
      { input: '3\n1 2 3\n1 2 3\n2', output: '6 5', isHidden: false },
      { input: '2\n5 10\n3 7\n2', output: '17 12', isHidden: true },
      { input: '3\n1 1 1\n1 1 1\n3', output: '2 2 2', isHidden: true },
      { input: '4\n10 20 15 25\n5 10 8 6\n4', output: '35 32 31 30', isHidden: true },
      { input: '3\n-5 -10 0\n1 2 3\n3', output: '3 2 1', isHidden: true },
      { input: '5\n100 200 50 150 75\n10 20 30 15 25\n5', output: '220 215 210 205 200', isHidden: true }
    ],
    timeLimit: 2000,
    memoryLimit: 256
  },
  'sum-of-first-n-natural-numbers': {
    statement: `## 📝 Problem Statement
Write a recursive function to find the sum of first n natural numbers.

Natural numbers are positive integers starting from 1: 1, 2, 3, 4, 5, ...

You need to implement a **recurring function** (recursive solution) that calculates the sum of the first n natural numbers.

**Examples:**
- Input: n = 3
  Output: 6
  Explanation: The sum of first 3 natural numbers is 1+2+3 = 6

- Input: n = 7
  Output: 28
  Explanation: The sum of first 7 natural numbers is 1+2+3+4+5+6+7 = 28

- Input: n = 1
  Output: 1
  Explanation: For n=1, sum is just 1

- Input: n = 10
  Output: 55
  Explanation: 1+2+3+4+5+6+7+8+9+10 = 55

**Algorithm Approach:**
1. **Recursive Approach (Recommended):** Define a base case (when n=0 or n=1) and recursive case (n + sum(n-1))
   - Time Complexity: O(n)
   - Space Complexity: O(n) due to call stack
   
2. **Mathematical Formula:** Sum = n × (n+1) / 2
   - Time Complexity: O(1)
   - Space Complexity: O(1)

3. **Iterative Approach:** Loop from 1 to n and accumulate sum
   - Time Complexity: O(n)
   - Space Complexity: O(1)

**Recommended:** Implement the recursive approach as the primary solution.

Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
    inputFormat: 'A single line containing integer n (positive integer).',
    outputFormat: 'Return the sum of first n natural numbers as a single integer.',
    constraints: '1 ≤ n ≤ 10^6\nFor large values, ensure your recursion depth doesn\'t exceed system limits or use iteration/formula',
    sampleInput: '3',
    sampleOutput: '6',
    testCases: [
      { input: '3', output: '6', isHidden: false },
      { input: '7', output: '28', isHidden: false },
      { input: '10', output: '55', isHidden: false },
      { input: '1', output: '1', isHidden: true },
      { input: '2', output: '3', isHidden: true },
      { input: '100', output: '5050', isHidden: true },
      { input: '1000', output: '500500', isHidden: true },
      { input: '999999', output: '499999500000', isHidden: true }
    ],
    timeLimit: 1000,
    memoryLimit: 128
  }
};

async function seed() {
  try {
    console.log('Seeding TCS NQT coding arena questions...');
    
    // Delete old problems that have been replaced
    const oldProblems = [
      'find-all-non-repeating-elements-in-an-array-tcs-nqt',
      'find-all-symmetric-pairs-in-array-tcs-nqt',
      'maximum-product-subarray-in-an-array-tcs-nqt',
      'replace-each-element-of-the-array-by-its-rank-in-the-array-tcs-nqt',
      'sorting-elements-of-an-array-by-frequency-tcs-nqt',
      'finding-equilibrium-index-of-an-array-tcs-nqt',
      'finding-circular-rotation-of-an-array-by-k-positions-tcs-nqt',
      'search-an-element-in-an-array-tcs-nqt',
      'check-if-array-is-a-subset-of-another-array-or-not-tcs-nqt',
      'check-if-a-number-is-palindrome-or-not-tcs-nqt',
      'find-all-palindrome-numbers-in-a-given-range-tcs-nqt',
      'check-if-a-number-is-prime-or-not-tcs-nqt',
      'prime-numbers-in-a-given-range-tcs-nqt',
      'check-if-a-number-is-armstrong-number-of-not-tcs-nqt',
      'check-if-a-number-is-perfect-number-tcs-nqt',
      'even-or-odd-tcs-nqt',
      'check-weather-a-given-number-is-positive-or-negative-tcs-nqt',
      'sum-of-first-n-natural-numbers-tcs-nqt',
      'find-sum-of-ap-series-tcs-nqt',
      'program-to-find-sum-of-gp-series-tcs-nqt',
      'greatest-of-two-numbers-tcs-nqt',
      'greatest-of-three-numbers-tcs-nqt',
      'leap-year-or-not-tcs-nqt'
    ];
    
    for (const oldSlug of oldProblems) {
      try {
        const result = await prisma.question.deleteMany({
          where: { slug: oldSlug }
        });
        if (result.count > 0) {
          console.log(`✅ Deleted old problem: ${oldSlug}`);
        }
      } catch (e) {
        // Ignore deletion errors
      }
    }
    
    const seededQuestions = [];

    for (const q of TCS_QUESTIONS) {
      const slug = `${slugify(q.title)}-tcs-nqt`;
      const problemKey = slugify(q.title);
      const problemDetails = PROBLEM_DETAILS[problemKey];

      const qDoc = {
        title: q.title,
        slug: slug,
        statement: problemDetails?.statement || `Practice solving **${q.title}** (TCS NQT preparation). Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
        difficulty: q.difficulty,
        topics: ['tcs-nqt'],
        companies: ['TCS'],
        timeLimit: problemDetails?.timeLimit || 1000,
        memoryLimit: problemDetails?.memoryLimit || 128,
        inputFormat: problemDetails?.inputFormat || 'A single line of input value or space-separated elements.',
        outputFormat: problemDetails?.outputFormat || 'Expected output solution.',
        constraints: problemDetails?.constraints || 'Varies per test case.',
        sampleInput: problemDetails?.sampleInput || '1 2 3',
        sampleOutput: problemDetails?.sampleOutput || '1',
        templates: generateBoilerplates(q.title),
        testCases: problemDetails?.testCases || [
          { input: '1 2 3', output: '1', isHidden: false },
          { input: '4 5 6', output: '1', isHidden: true }
        ],
        xpReward: q.difficulty === 'easy' ? 10 : q.difficulty === 'medium' ? 15 : 20
      };

      seededQuestions.push(qDoc);
    }

    console.log(`Upserting ${seededQuestions.length} TCS NQT questions into database...`);
    
    for (const qData of seededQuestions) {
      await prisma.question.upsert({
        where: { slug: qData.slug },
        update: qData,
        create: qData,
      });
    }

    console.log(`✅ Successfully seeded ${seededQuestions.length} TCS NQT questions!`);
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
