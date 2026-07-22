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
  { title: 'Find the largest number in an array', difficulty: 'easy' },
  { title: 'Second Smallest and Second Largest element in an array', difficulty: 'medium' },
  { title: 'Reverse a given array', difficulty: 'easy' },
  { title: 'Count frequency of each element in an array', difficulty: 'medium' },
  { title: 'Rearrange array in increasing-decreasing order', difficulty: 'medium' },
  { title: 'Calculate sum of the elements of the array', difficulty: 'easy' },
  { title: 'Rotate array by K elements - Block Swap Algorithm', difficulty: 'hard' },
  { title: 'Average of all elements in an array', difficulty: 'easy' },
  { title: 'Find the median of the given array', difficulty: 'easy' },
  { title: 'Remove duplicates from a sorted array', difficulty: 'easy' },
  { title: 'Remove duplicates from unsorted array', difficulty: 'medium' },
  { title: 'Adding Element in an array', difficulty: 'easy' },
  { title: 'Find all repeating elements in an array', difficulty: 'medium' },
  { title: 'Find all non-repeating elements in an array', difficulty: 'medium' },
  { title: 'Find all symmetric pairs in array', difficulty: 'medium' },
  { title: 'Maximum product subarray in an array', difficulty: 'hard' },
  { title: 'Replace each element of the array by its rank in the array', difficulty: 'medium' },
  { title: 'Sorting elements of an array by frequency', difficulty: 'hard' },
  { title: 'Rotation of elements of array- left and right', difficulty: 'medium' },
  { title: 'Finding equilibrium index of an array', difficulty: 'medium' },
  { title: 'Finding Circular rotation of an array by K positions', difficulty: 'medium' },
  { title: 'Sort an array according to the order defined by another array', difficulty: 'hard' },
  { title: 'Search an element in an array', difficulty: 'easy' },
  { title: 'Check if Array is a subset of another array or not', difficulty: 'easy' },

  // Numbers
  { title: 'Check if a number is palindrome or not', difficulty: 'easy' },
  { title: 'Find all Palindrome numbers in a given range', difficulty: 'medium' },
  { title: 'Check if a number is prime or not', difficulty: 'easy' },
  { title: 'Prime numbers in a given range', difficulty: 'medium' },
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
];

async function seed() {
  try {
    console.log('Seeding TCS NQT coding arena questions...');
    
    const seededQuestions = [];

    for (const q of TCS_QUESTIONS) {
      const slug = `${slugify(q.title)}-tcs-nqt`;

      const qDoc = {
        title: q.title,
        slug: slug,
        statement: `Practice solving **${q.title}** (TCS NQT preparation). Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
        difficulty: q.difficulty,
        topics: ['tcs-nqt'],
        companies: ['TCS'],
        timeLimit: 1000,
        memoryLimit: 128,
        inputFormat: 'A single line of input value or space-separated elements.',
        outputFormat: 'Expected output solution.',
        constraints: 'Varies per test case.',
        sampleInput: '1 2 3',
        sampleOutput: '1',
        templates: generateBoilerplates(q.title),
        testCases: [
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
