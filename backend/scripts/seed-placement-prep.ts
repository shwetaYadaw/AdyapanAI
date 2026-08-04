/**
 * seed-placement-prep.ts
 * Seeds all Placement Prep (formerly TCS NQT) questions into TcsNqtQuestion table.
 * Topics: arrays, strings, sorting, numbers, number-system, hashing, linked-list, recursion-backtracking
 */

import * as dotenv from 'dotenv';
dotenv.config();
import { prisma } from '../src/config/prisma';

function toSlug(topic: string, title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// All questions organised by topic
const QUESTIONS: Record<string, { title: string; difficulty: string }[]> = {
  arrays: [
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
    { title: 'Maximum Sum Subarray', difficulty: 'medium' },
    { title: 'Move Zeroes to End', difficulty: 'easy' },
    { title: 'Find Missing Number in Array', difficulty: 'easy' },
    { title: 'Intersection of Two Arrays', difficulty: 'easy' },
    { title: 'Union of Two Arrays', difficulty: 'easy' },
    { title: 'Leaders in an Array', difficulty: 'easy' },
    { title: 'Trapping Rain Water', difficulty: 'hard' },
    { title: 'Two Sum', difficulty: 'easy' },
    { title: 'Stock Buy and Sell', difficulty: 'medium' },
    { title: 'Minimum Jumps to Reach End', difficulty: 'hard' },
    { title: 'Majority Element', difficulty: 'easy' },
    { title: 'Merge Two Sorted Arrays', difficulty: 'medium' },
    { title: 'Next Permutation', difficulty: 'medium' },
  ],
  strings: [
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
    { title: 'Change case of each character in a string', difficulty: 'easy' },
    { title: 'Concatenate one string to another', difficulty: 'easy' },
    { title: 'Reverse words in a string', difficulty: 'medium' },
    { title: 'Longest Common Prefix', difficulty: 'medium' },
    { title: 'Valid Anagram', difficulty: 'easy' },
    { title: 'First Unique Character in a String', difficulty: 'easy' },
    { title: 'String Compression', difficulty: 'medium' },
  ],
  sorting: [
    { title: 'Bubble Sort Algorithm', difficulty: 'easy' },
    { title: 'Selection Sort Algorithm', difficulty: 'easy' },
    { title: 'Insertion Sort Algorithm', difficulty: 'easy' },
    { title: 'Quick Sort Algorithm', difficulty: 'medium' },
    { title: 'Merge Sort Algorithm', difficulty: 'medium' },
    { title: 'Count Sort Algorithm', difficulty: 'medium' },
    { title: 'Radix Sort Algorithm', difficulty: 'medium' },
    { title: 'Heap Sort Algorithm', difficulty: 'hard' },
    { title: 'Shell Sort Algorithm', difficulty: 'medium' },
    { title: 'Binary Search in Sorted Array', difficulty: 'easy' },
    { title: 'Linear Search', difficulty: 'easy' },
    { title: 'Search in Rotated Sorted Array', difficulty: 'hard' },
    { title: 'Find First and Last Position in Sorted Array', difficulty: 'medium' },
    { title: 'Find Kth Smallest Element', difficulty: 'medium' },
    { title: 'Sort an Array of 0s, 1s and 2s', difficulty: 'medium' },
    { title: 'Find the Duplicate Number', difficulty: 'medium' },
    { title: 'Count Inversions in Array', difficulty: 'hard' },
    { title: 'Sort Characters By Frequency', difficulty: 'medium' },
    { title: 'Find Minimum in Rotated Sorted Array', difficulty: 'medium' },
    { title: 'Aggressive Cows', difficulty: 'hard' },
    { title: 'Book Allocation Problem', difficulty: 'hard' },
    { title: 'Floor and Ceil in Sorted Array', difficulty: 'easy' },
    { title: 'Peak Element in Array', difficulty: 'medium' },
    { title: 'Count Zeros in Row-wise Col-wise Sorted Matrix', difficulty: 'medium' },
    { title: 'Minimum Difference Element in Sorted Array', difficulty: 'easy' },
    { title: 'Median of Two Sorted Arrays', difficulty: 'hard' },
    { title: 'Find Pair with Given Sum in Sorted Array', difficulty: 'easy' },
    { title: 'Triplet Sum in Array', difficulty: 'medium' },
    { title: 'Minimum Swaps to Sort', difficulty: 'medium' },
  ],
  numbers: [
    { title: 'Check if a number is Palindrome', difficulty: 'easy' },
    { title: 'Palindromes in a Range', difficulty: 'medium' },
    { title: 'Check if a number is prime', difficulty: 'easy' },
    { title: 'Primes in a Range', difficulty: 'medium' },
    { title: 'Check if a number is armstrong number', difficulty: 'easy' },
    { title: 'Check if a number is perfect number', difficulty: 'easy' },
    { title: 'Even or Odd', difficulty: 'easy' },
    { title: 'Check if a number is positive or negative', difficulty: 'easy' },
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
    { title: 'Program to add two fractions', difficulty: 'medium' },
    { title: 'Replace all 0s with 1s in a given integer', difficulty: 'easy' },
    { title: 'Can a number be expressed as sum of two primes', difficulty: 'medium' },
    { title: 'Calculate the area of circle', difficulty: 'easy' },
    { title: 'Program to find roots of a Quadratic Equation', difficulty: 'hard' },
    { title: 'Count digits in a number', difficulty: 'easy' },
  ],
  'number-system': [
    { title: 'Convert Binary to Decimal', difficulty: 'easy' },
    { title: 'Convert binary to octal', difficulty: 'medium' },
    { title: 'Decimal to Binary conversion', difficulty: 'easy' },
    { title: 'Convert decimal to octal', difficulty: 'medium' },
    { title: 'Convert octal to binary', difficulty: 'medium' },
    { title: 'Convert octal to decimal', difficulty: 'medium' },
    { title: 'Convert digits numbers to words', difficulty: 'hard' },
  ],
  hashing: [
    { title: 'Two Sum Problem', difficulty: 'easy' },
    { title: 'Count frequency of each element in array', difficulty: 'easy' },
    { title: 'Find duplicate in array', difficulty: 'easy' },
    { title: 'Check if array is subset of another', difficulty: 'easy' },
    { title: 'Union and Intersection of two arrays using Hashing', difficulty: 'medium' },
    { title: 'Count pairs with given sum', difficulty: 'medium' },
    { title: 'Find all pairs with a given sum', difficulty: 'medium' },
    { title: 'Longest subarray with zero sum', difficulty: 'medium' },
    { title: 'Count subarrays with given sum', difficulty: 'medium' },
    { title: 'Largest subarray with equal number of 0s and 1s', difficulty: 'medium' },
    { title: 'Group anagrams together', difficulty: 'medium' },
    { title: 'Count distinct elements in every window', difficulty: 'hard' },
    { title: 'Find first repeating element in array', difficulty: 'easy' },
    { title: 'Find first non-repeating element in array', difficulty: 'easy' },
    { title: 'Top K frequent elements', difficulty: 'medium' },
    { title: 'Subarray with given XOR', difficulty: 'hard' },
    { title: 'Count number of subarrays with given XOR', difficulty: 'hard' },
    { title: 'Longest consecutive sequence', difficulty: 'medium' },
    { title: 'Valid Sudoku using Hashing', difficulty: 'medium' },
    { title: '4 Sum Problem', difficulty: 'hard' },
    { title: 'Open the Lock', difficulty: 'hard' },
    { title: 'Word Pattern', difficulty: 'easy' },
    { title: 'Isomorphic Strings', difficulty: 'easy' },
    { title: 'Design HashMap', difficulty: 'medium' },
    { title: 'Design HashSet', difficulty: 'easy' },
    { title: 'Find Itinerary from Tickets', difficulty: 'hard' },
    { title: 'Minimum Window Substring', difficulty: 'hard' },
    { title: 'Contiguous Array', difficulty: 'medium' },
    { title: 'Find common elements in three sorted arrays', difficulty: 'easy' },
    { title: 'Count subarrays with equal 0s and 1s', difficulty: 'medium' },
    { title: 'Longest common span with same sum in binary arrays', difficulty: 'hard' },
    { title: 'Clone a linked list using random pointer', difficulty: 'hard' },
  ],
  'linked-list': [
    { title: 'Reverse a Linked List', difficulty: 'easy' },
    { title: 'Find the middle of a Linked List', difficulty: 'easy' },
    { title: 'Detect a loop in Linked List', difficulty: 'medium' },
    { title: 'Remove loop in Linked List', difficulty: 'hard' },
    { title: 'Find starting point of loop in Linked List', difficulty: 'hard' },
    { title: 'Remove Nth node from end of Linked List', difficulty: 'medium' },
    { title: 'Add two numbers represented as Linked Lists', difficulty: 'medium' },
    { title: 'Intersection Point of Two Linked Lists', difficulty: 'medium' },
    { title: 'Merge Two Sorted Linked Lists', difficulty: 'medium' },
    { title: 'Flatten a Linked List', difficulty: 'hard' },
    { title: 'Sort a Linked List', difficulty: 'hard' },
    { title: 'Check if Linked List is Palindrome', difficulty: 'medium' },
    { title: 'Reverse a Linked List in groups of K', difficulty: 'hard' },
    { title: 'Rotate Linked List by K places', difficulty: 'medium' },
    { title: 'Delete all occurrences of a key in Linked List', difficulty: 'easy' },
    { title: 'Delete middle node of Linked List', difficulty: 'medium' },
    { title: 'Segregate even and odd nodes in Linked List', difficulty: 'medium' },
    { title: 'LRU Cache Implementation', difficulty: 'hard' },
    { title: 'Clone Linked List with random pointer', difficulty: 'hard' },
    { title: 'Reorder List', difficulty: 'medium' },
    { title: 'Swap nodes in pairs', difficulty: 'medium' },
    { title: 'Convert Sorted List to BST', difficulty: 'medium' },
    { title: 'Odd Even Linked List', difficulty: 'medium' },
    { title: 'Insert in Sorted Linked List', difficulty: 'easy' },
    { title: 'Delete a node from Linked List', difficulty: 'easy' },
    { title: 'Merge K sorted Linked Lists', difficulty: 'hard' },
    { title: 'Skip M Delete N nodes in Linked List', difficulty: 'medium' },
  ],
  'recursion-backtracking': [
    { title: 'Print all permutations of a string', difficulty: 'medium' },
    { title: 'N Queens Problem', difficulty: 'hard' },
    { title: 'Rat in a Maze', difficulty: 'hard' },
    { title: 'Sudoku Solver', difficulty: 'hard' },
    { title: 'Generate all subsets', difficulty: 'medium' },
    { title: 'Combination Sum', difficulty: 'medium' },
    { title: 'Combination Sum II', difficulty: 'medium' },
    { title: 'Word Search in Grid', difficulty: 'hard' },
    { title: 'Letter Combinations of a Phone Number', difficulty: 'medium' },
    { title: 'Generate Parentheses', difficulty: 'medium' },
    { title: 'Palindrome Partitioning', difficulty: 'hard' },
    { title: 'Subset Sum Problem', difficulty: 'medium' },
    { title: 'Tower of Hanoi', difficulty: 'medium' },
    { title: 'Knight Tour Problem', difficulty: 'hard' },
    { title: 'M Coloring Problem', difficulty: 'hard' },
    { title: 'Print all subsequences of a string', difficulty: 'medium' },
    { title: 'Flood Fill Algorithm', difficulty: 'medium' },
    { title: 'Find path in maze', difficulty: 'medium' },
    { title: 'Count paths in matrix', difficulty: 'medium' },
    { title: 'Permutations of array', difficulty: 'medium' },
    { title: 'String permutations with spaces', difficulty: 'medium' },
    { title: 'Phone number to words', difficulty: 'medium' },
    { title: 'Binary strings without consecutive 1s', difficulty: 'medium' },
    { title: 'Print all paths in a DAG', difficulty: 'hard' },
    { title: 'Generate all balanced parentheses', difficulty: 'medium' },
    { title: 'Restore IP Addresses', difficulty: 'hard' },
  ],
};

async function main() {
  console.log('\n🧹 Cleaning existing TcsNqtQuestion records...');
  const del = await prisma.tcsNqtQuestion.deleteMany({});
  console.log(`   Deleted ${del.count} records\n`);

  let created = 0;
  let failed  = 0;

  for (const [topic, questions] of Object.entries(QUESTIONS)) {
    console.log(`📁 ${topic.padEnd(30)} ${questions.length} questions`);

    for (const q of questions) {
      const slug = toSlug(topic, q.title) + '-placement';
      try {
        await prisma.tcsNqtQuestion.create({
          data: {
            title:             q.title,
            slug,
            difficulty:        q.difficulty,
            topic,
            statement:         `Solve the following problem: ${q.title}`,
            inputFormat:       'As described in the problem',
            outputFormat:      'As described in the problem',
            constraints:       '1 ≤ n ≤ 10^5',
            referenceSolution: `// TODO: Add reference solution for ${q.title}`,
            testCases:         [],
            companies:         'TCS, Infosys, Wipro, Accenture, Cognizant',
            xpReward:          10,
          },
        });
        created++;
        process.stdout.write('.');
      } catch (e: any) {
        if (e.code === 'P2002') {
          process.stdout.write('s'); // skipped
        } else {
          console.error(`\n  ❌ ${q.title}: ${e.message}`);
          failed++;
        }
      }
    }
    console.log();
  }

  console.log('\n' + '='.repeat(55));
  console.log('✅ PLACEMENT PREP SEED COMPLETE');
  console.log(`   Created : ${created}`);
  console.log(`   Failed  : ${failed}`);
  console.log('='.repeat(55) + '\n');
}

main()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
