import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function updateSmallestWindowProblem() {
  try {
    console.log('🔄 Updating Smallest Window in a String problem...');

    const problemData = {
      title: 'Smallest Window in a String containing all characters of other String',
      slug: 'smallest-window-in-a-string-containing-all-characters-of-another-string',
      statement: `Given two strings s and p, the task is to find the smallest substring in s that contains all characters of p, including duplicates.

**Requirements:**
- If no such substring exists, return ""
- If multiple substrings of the same length are found, return the one with the smallest starting index
- The substring must contain ALL characters from p, including duplicates
- The window can contain other characters from s as well

**Algorithm Approach:**
This is a classic **Sliding Window** problem. Use two pointers (left and right) to maintain a window that contains all characters of p. Expand the window by moving right pointer, and contract it by moving left pointer to find the minimum window.

**Key Steps:**
1. Create a frequency map of all characters in pattern string p
2. Use two pointers to create a sliding window
3. Expand window until all characters are found
4. Contract window from left to minimize length
5. Track the minimum window found`,
      
      difficulty: 'hard',
      topics: JSON.stringify(['strings', 'sliding-window', 'two-pointers', 'hash-table']),
      companies: JSON.stringify(['Amazon', 'Google', 'Microsoft', 'Facebook', 'Uber', 'Apple']),
      timeLimit: 2000,
      memoryLimit: 256,
      
      inputFormat: `First line contains string s (the main string)
Second line contains string p (the pattern string)`,
      
      outputFormat: `Print the smallest substring of s that contains all characters of p
If no such substring exists, print an empty string ""`,
      
      constraints: `1 ≤ length of p ≤ length of s ≤ 10^5
Both strings contain only lowercase and uppercase English letters`,
      
      sampleInput: `timetopractice
toc`,
      
      sampleOutput: `toprac`,
      
      templates: JSON.stringify({
        python: `def smallest_window(s, p):
    """
    Find the smallest window in s that contains all characters of p.
    Uses sliding window technique with hash maps.
    """
    # Write your code here
    pass

# Input reading
s = input().strip()
p = input().strip()

# Find and print result
result = smallest_window(s, p)
print(result)`,
        
        javascript: `function smallestWindow(s, p) {
    /**
     * Find the smallest window in s that contains all characters of p.
     * Uses sliding window technique with hash maps.
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
        const s = lines[0].trim();
        const p = lines[1].trim();
        console.log(smallestWindow(s, p));
        rl.close();
    }
});`,
        
        java: `import java.util.*;

public class Solution {
    
    /**
     * Find the smallest window in s that contains all characters of p.
     * Uses sliding window technique with hash maps.
     */
    public static String smallestWindow(String s, String p) {
        // Write your code here
        return "";
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine().trim();
        String p = sc.nextLine().trim();
        System.out.println(smallestWindow(s, p));
        sc.close();
    }
}`,
        
        cpp: `#include <iostream>
#include <string>
#include <unordered_map>
#include <climits>
using namespace std;

/**
 * Find the smallest window in s that contains all characters of p.
 * Uses sliding window technique with hash maps.
 */
string smallestWindow(string s, string p) {
    // Write your code here
    return "";
}

int main() {
    string s, p;
    getline(cin, s);
    getline(cin, p);
    cout << smallestWindow(s, p) << endl;
    return 0;
}`
      }),
      
      testCases: JSON.stringify([
        {
          input: 'timetopractice\ntoc',
          output: 'toprac',
          explanation: '"toprac" is the smallest substring that contains all characters t, o, c from pattern'
        },
        {
          input: 'zoomlazapzo\noza',
          output: 'apzo',
          explanation: '"apzo" is the smallest substring containing o, z, a'
        },
        {
          input: 'ADOBECODEBANC\nABC',
          output: 'BANC',
          explanation: 'Classic example: "BANC" is the minimum window containing A, B, C'
        },
        {
          input: 'a\naa',
          output: '',
          explanation: 'Pattern requires 2 "a"s but string has only 1, so no valid window exists'
        },
        {
          input: 'ab\nb',
          output: 'b',
          explanation: 'Single character "b" is the minimum window'
        }
      ]),
      
      xpReward: 40
    };

    // Upsert the problem
    const problem = await prisma.question.upsert({
      where: { slug: 'smallest-window-in-a-string-containing-all-characters-of-another-string' },
      update: problemData,
      create: problemData
    });

    console.log('✅ Smallest Window problem updated successfully!');
    console.log(`   ID: ${problem.id}`);
    console.log(`   Title: ${problem.title}`);
    console.log(`   Difficulty: ${problem.difficulty}`);
    console.log(`   Test Cases: ${JSON.parse(problem.testCases as string).length}`);

  } catch (error) {
    console.error('❌ Error updating Smallest Window problem:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateSmallestWindowProblem();
