import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function updateBoyerMooreProblem() {
  try {
    console.log('🔄 Updating Boyer Moore Algorithm problem...');

    const problemData = {
      title: 'Boyer Moore Algorithm for Pattern Searching',
      slug: 'boyer-moore-algorithm-for-pattern-searching-strings',
      statement: `Pattern searching is an important problem in computer science. When we do search for a string in a notepad/word file, browser, or database, pattern searching algorithms are used to show the search results.

**Problem Statement:**
Given a text txt[0..n-1] and a pattern pat[0..m-1] where n is the length of the text and m is the length of the pattern, write a function search(char pat[], char txt[]) that prints all occurrences of pat[] in txt[]. 

You may assume that n > m.

**Boyer Moore Algorithm:**
The Boyer Moore algorithm is one of the most efficient string searching algorithms. It uses two heuristics:
1. **Bad Character Heuristic**: When a mismatch occurs, shift the pattern so that the bad character in text aligns with its last occurrence in pattern.
2. **Good Suffix Heuristic**: When a mismatch occurs after matching a suffix of pattern, shift the pattern to align the matched suffix with its previous occurrence.

The algorithm preprocesses the pattern and can skip sections of the text, resulting in sublinear time complexity in many cases.`,
      
      difficulty: 'hard',
      topics: JSON.stringify(['strings', 'pattern-matching', 'algorithms', 'boyer-moore']),
      companies: JSON.stringify(['Google', 'Amazon', 'Microsoft', 'Adobe', 'Oracle']),
      timeLimit: 2000,
      memoryLimit: 256,
      
      inputFormat: `First line contains the text string txt
Second line contains the pattern string pat to search for`,
      
      outputFormat: `Print all indices where pattern is found in the text (0-indexed)
If pattern is not found, print "Pattern not found"
Print each index on a new line`,
      
      constraints: `1 ≤ length of pattern ≤ length of text ≤ 10^5
Both strings contain only uppercase English letters`,
      
      sampleInput: `THIS IS A TEST TEXT
TEST`,
      
      sampleOutput: `Pattern found at index 10`,
      
      templates: JSON.stringify({
        python: `def bad_char_heuristic(pattern):
    """
    Preprocessing for bad character heuristic.
    Returns a dictionary with last occurrence of each character in pattern.
    """
    # Write your code here
    pass

def boyer_moore_search(txt, pat):
    """
    Search for pattern in text using Boyer Moore algorithm.
    Print all occurrences.
    """
    # Write your code here
    pass

# Input reading
txt = input().strip()
pat = input().strip()

# Search for pattern
boyer_moore_search(txt, pat)`,
        
        javascript: `function badCharHeuristic(pattern) {
    /**
     * Preprocessing for bad character heuristic.
     * Returns an object with last occurrence of each character in pattern.
     */
    // Write your code here
}

function boyerMooreSearch(txt, pat) {
    /**
     * Search for pattern in text using Boyer Moore algorithm.
     * Print all occurrences.
     */
    // Write your code here
}

// Input reading
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const lines = [];
rl.on('line', (line) => {
    lines.push(line);
    if (lines.length === 2) {
        const txt = lines[0].trim();
        const pat = lines[1].trim();
        boyerMooreSearch(txt, pat);
        rl.close();
    }
});`,
        
        java: `import java.util.*;

public class Solution {
    
    /**
     * Preprocessing for bad character heuristic.
     * Returns array with last occurrence of each character.
     */
    public static int[] badCharHeuristic(String pattern) {
        // Write your code here
        return null;
    }
    
    /**
     * Search for pattern in text using Boyer Moore algorithm.
     */
    public static void boyerMooreSearch(String txt, String pat) {
        // Write your code here
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String txt = sc.nextLine().trim();
        String pat = sc.nextLine().trim();
        boyerMooreSearch(txt, pat);
        sc.close();
    }
}`,
        
        cpp: `#include <iostream>
#include <string>
#include <vector>
#include <unordered_map>
using namespace std;

/**
 * Preprocessing for bad character heuristic.
 * Returns array with last occurrence of each character.
 */
vector<int> badCharHeuristic(string pattern) {
    // Write your code here
    return vector<int>();
}

/**
 * Search for pattern in text using Boyer Moore algorithm.
 */
void boyerMooreSearch(string txt, string pat) {
    // Write your code here
}

int main() {
    string txt, pat;
    getline(cin, txt);
    getline(cin, pat);
    boyerMooreSearch(txt, pat);
    return 0;
}`
      }),
      
      testCases: JSON.stringify([
        {
          input: 'THIS IS A TEST TEXT\nTEST',
          output: 'Pattern found at index 10',
          explanation: 'Pattern "TEST" occurs once at index 10 in the text'
        },
        {
          input: 'AABAACAADAABAABA\nAABA',
          output: 'Pattern found at index 0\nPattern found at index 9\nPattern found at index 12',
          explanation: 'Pattern "AABA" occurs three times at indices 0, 9, and 12'
        },
        {
          input: 'ABCDEFGH\nXYZ',
          output: 'Pattern not found',
          explanation: 'Pattern "XYZ" does not exist in the text'
        },
        {
          input: 'ABABABABAB\nABAB',
          output: 'Pattern found at index 0\nPattern found at index 2\nPattern found at index 4\nPattern found at index 6',
          explanation: 'Pattern "ABAB" occurs at overlapping positions'
        },
        {
          input: 'GEEKSFORGEEKS\nGEEKS',
          output: 'Pattern found at index 0\nPattern found at index 8',
          explanation: 'Pattern "GEEKS" occurs twice in the text'
        }
      ]),
      
      xpReward: 40
    };

    // Upsert the problem
    const problem = await prisma.question.upsert({
      where: { slug: 'boyer-moore-algorithm-for-pattern-searching-strings' },
      update: problemData,
      create: problemData
    });

    console.log('✅ Boyer Moore Algorithm problem updated successfully!');
    console.log(`   ID: ${problem.id}`);
    console.log(`   Title: ${problem.title}`);
    console.log(`   Difficulty: ${problem.difficulty}`);
    console.log(`   Test Cases: ${JSON.parse(problem.testCases as string).length}`);

  } catch (error) {
    console.error('❌ Error updating Boyer Moore problem:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateBoyerMooreProblem();
