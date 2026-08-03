import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function updateCountPalindromicSubsequencesProblem() {
  try {
    console.log('🔄 Updating Count Palindromic Subsequences problem...');

    const problemData = {
      title: 'Count Palindromic Subsequences',
      slug: 'count-palindromic-subsequences-strings',
      statement: `Given a string of digits s, return the number of palindromic subsequences of s having length 5. Since the answer may be very large, return it modulo 10^9 + 7.

**Key Definitions:**
- A **palindromic** string reads the same forward and backward
- A **subsequence** is derived by deleting some or no characters without changing the order of remaining characters
- We need to count subsequences of exactly length 5 that form palindromes

**Problem Requirements:**
- Count all possible subsequences of length 5
- Check which ones are palindromic
- Return count modulo 10^9 + 7

**Palindrome Pattern for Length 5:**
For a 5-character palindrome: **a b c b a**
- 1st character = 5th character
- 2nd character = 4th character
- 3rd character (middle) can be anything

**Algorithm Approach:**
1. For each possible outer pair (digit at positions i and j where i < j)
2. For each possible second layer pair (between i and j)
3. Count middle digits between the second layer
4. This forms valid 5-character palindromes: outer-second-middle-second-outer

**Example Walkthrough:**
For s = "103301":
- Valid palindromes: "10301" (appears twice in different subsequence combinations)
- Total count: 2

**Optimization:**
Use dynamic programming to precompute:
- Count of each digit to the right of any position
- This allows O(1) lookup when building palindromes`,
      
      difficulty: 'hard',
      topics: JSON.stringify(['strings', 'dynamic-programming', 'subsequence', 'palindrome']),
      companies: JSON.stringify(['Google', 'Amazon', 'Microsoft', 'Facebook', 'Apple']),
      timeLimit: 3000,
      memoryLimit: 256,
      
      inputFormat: `Single line containing string s consisting of digits (0-9)`,
      
      outputFormat: `Single integer: count of palindromic subsequences of length 5, modulo 10^9 + 7`,
      
      constraints: `1 ≤ s.length ≤ 10^4
s consists of digits only (0-9)
Answer should be returned modulo 10^9 + 7`,
      
      sampleInput: `103301`,
      
      sampleOutput: `2`,
      
      templates: JSON.stringify({
        python: `def count_palindromic_subsequences(s):
    """
    Count palindromic subsequences of length 5.
    Returns count modulo 10^9 + 7.
    
    Approach: For 5-char palindrome 'abcba', fix outer pair, second pair, count middles.
    """
    MOD = 10**9 + 7
    n = len(s)
    
    # Write your code here
    pass

# Input reading
s = input().strip()

# Calculate and print result
result = count_palindromic_subsequences(s)
print(result)`,
        
        javascript: `function countPalindromicSubsequences(s) {
    /**
     * Count palindromic subsequences of length 5.
     * Returns count modulo 10^9 + 7.
     * 
     * Approach: For 5-char palindrome 'abcba', fix outer pair, second pair, count middles.
     */
    const MOD = 1e9 + 7;
    const n = s.length;
    
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
    console.log(countPalindromicSubsequences(s));
    rl.close();
});`,
        
        java: `import java.util.*;

public class Solution {
    
    private static final int MOD = 1000000007;
    
    /**
     * Count palindromic subsequences of length 5.
     * Returns count modulo 10^9 + 7.
     * 
     * Approach: For 5-char palindrome 'abcba', fix outer pair, second pair, count middles.
     */
    public static int countPalindromicSubsequences(String s) {
        int n = s.length();
        
        // Write your code here
        return 0;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine().trim();
        System.out.println(countPalindromicSubsequences(s));
        sc.close();
    }
}`,
        
        cpp: `#include <iostream>
#include <string>
#include <vector>
using namespace std;

const int MOD = 1e9 + 7;

/**
 * Count palindromic subsequences of length 5.
 * Returns count modulo 10^9 + 7.
 * 
 * Approach: For 5-char palindrome 'abcba', fix outer pair, second pair, count middles.
 */
int countPalindromicSubsequences(string s) {
    int n = s.length();
    
    // Write your code here
    return 0;
}

int main() {
    string s;
    getline(cin, s);
    cout << countPalindromicSubsequences(s) << endl;
    return 0;
}`
      }),
      
      testCases: JSON.stringify([
        {
          input: '103301',
          output: '2',
          explanation: 'There are 6 possible subsequences of length 5: "10330","10331","10301","10301","13301","03301". Two of them (both equal to "10301") are palindromic.'
        },
        {
          input: '0000000',
          output: '21',
          explanation: 'All 21 subsequences are "00000", which is palindromic. C(7,5) = 21 ways to choose 5 positions from 7.'
        },
        {
          input: '9999900000',
          output: '2',
          explanation: 'The only two palindromic subsequences are "99999" and "00000".'
        },
        {
          input: '1',
          output: '0',
          explanation: 'String length is 1, cannot form subsequence of length 5.'
        },
        {
          input: '12345',
          output: '0',
          explanation: 'All digits are different, no palindromic subsequence of length 5 possible.'
        }
      ]),
      
      xpReward: 50
    };

    // Upsert the problem
    const problem = await prisma.question.upsert({
      where: { slug: 'count-palindromic-subsequences-strings' },
      update: problemData,
      create: problemData
    });

    console.log('✅ Count Palindromic Subsequences problem updated successfully!');
    console.log(`   ID: ${problem.id}`);
    console.log(`   Title: ${problem.title}`);
    console.log(`   Difficulty: ${problem.difficulty}`);
    console.log(`   Test Cases: ${JSON.parse(problem.testCases as string).length}`);

  } catch (error) {
    console.error('❌ Error updating Count Palindromic Subsequences problem:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateCountPalindromicSubsequencesProblem();
