import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function updatePalindromicSubstringsProblem() {
  try {
    console.log('🔄 Updating Palindromic Substrings problem...');

    const problemData = {
      title: 'Palindromic Substrings',
      slug: 'palindromic-substrings-strings',
      statement: `Given a string s, return the number of palindromic substrings in it.

A string is a palindrome when it reads the same backward as forward.
A substring is a contiguous sequence of characters within the string.`,
      
      difficulty: 'medium',
      topics: JSON.stringify(['strings', 'dynamic-programming', 'two-pointers']),
      companies: JSON.stringify(['Amazon', 'Microsoft', 'Google', 'Facebook', 'Apple', 'Bloomberg']),
      timeLimit: 2000,
      memoryLimit: 256,
      
      inputFormat: `Single line containing string s (lowercase English letters)`,
      
      outputFormat: `Single integer: count of palindromic substrings`,
      
      constraints: `1 ≤ s.length ≤ 1000
s consists of lowercase English letters only`,
      
      sampleInput: `abc`,
      
      sampleOutput: `3`,
      
      templates: JSON.stringify({
        python: `def count_palindromic_substrings(s):
    """
    Count all palindromic substrings in the string.
    
    Approach: Expand around center
    - For each position, expand as center of odd-length palindrome
    - For each gap, expand as center of even-length palindrome
    """
    # Write your code here
    pass

# Input reading
s = input().strip()

# Calculate and print result
result = count_palindromic_substrings(s)
print(result)`,
        
        javascript: `function countPalindromicSubstrings(s) {
    /**
     * Count all palindromic substrings in the string.
     * 
     * Approach: Expand around center
     * - For each position, expand as center of odd-length palindrome
     * - For each gap, expand as center of even-length palindrome
     */
    // Write your code here
}

// Input reading
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (line) => {
    const s = line.trim();
    console.log(countPalindromicSubstrings(s));
    rl.close();
});`,
        
        java: `import java.util.*;

public class Solution {
    
    /**
     * Count all palindromic substrings in the string.
     * 
     * Approach: Expand around center
     * - For each position, expand as center of odd-length palindrome
     * - For each gap, expand as center of even-length palindrome
     */
    public static int countPalindromicSubstrings(String s) {
        // Write your code here
        return 0;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine().trim();
        System.out.println(countPalindromicSubstrings(s));
        sc.close();
    }
}`,
        
        cpp: `#include <iostream>
#include <string>
using namespace std;

/**
 * Count all palindromic substrings in the string.
 * 
 * Approach: Expand around center
 * - For each position, expand as center of odd-length palindrome
 * - For each gap, expand as center of even-length palindrome
 */
int countPalindromicSubstrings(string s) {
    // Write your code here
    return 0;
}

int main() {
    string s;
    getline(cin, s);
    cout << countPalindromicSubstrings(s) << endl;
    return 0;
}`
      }),
      
      testCases: JSON.stringify([
        {
          input: 'abc',
          output: '3',
          explanation: 'Three palindromic strings: "a", "b", "c".'
        },
        {
          input: 'aaa',
          output: '6',
          explanation: 'Six palindromic strings: "a", "a", "a", "aa", "aa", "aaa".'
        },
        {
          input: 'a',
          output: '1',
          explanation: 'Single character "a" is a palindrome.'
        },
        {
          input: 'racecar',
          output: '10',
          explanation: 'Palindromes: r, a, c, e, c, a, r, cec, aceca, racecar = 10 total'
        },
        {
          input: 'noon',
          output: '6',
          explanation: 'Palindromes: n, o, o, n, oo, noon = 6 total'
        }
      ]),
      
      xpReward: 30
    };

    // Upsert the problem
    const problem = await prisma.question.upsert({
      where: { slug: 'palindromic-substrings-strings' },
      update: problemData,
      create: problemData
    });

    console.log('✅ Palindromic Substrings problem updated successfully!');
    console.log(`   ID: ${problem.id}`);
    console.log(`   Title: ${problem.title}`);
    console.log(`   Difficulty: ${problem.difficulty}`);
    console.log(`   Test Cases: ${JSON.parse(problem.testCases as string).length}`);

  } catch (error) {
    console.error('❌ Error updating Palindromic Substrings problem:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updatePalindromicSubstringsProblem();
