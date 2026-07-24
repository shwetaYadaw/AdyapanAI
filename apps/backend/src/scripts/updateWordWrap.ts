import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateWordWrapProblem() {
  try {
    console.log('🔄 Updating Word Wrap problem...');

    const problemData = {
      title: 'Word Wrap',
      slug: 'word-wrap',
      statement: `Given an array arr[] of size n, where arr[i] denotes the number of characters in one word. Let k be the limit on the number of characters that can be put in one line (line width). Put line breaks in the given sequence such that the lines are printed neatly.

Assume that the length of each word is smaller than the line width. When line breaks are inserted there is a possibility that extra spaces are present in each line. The extra spaces include spaces put at the end of every line except the last one.

The task is to minimize the following total cost:
Total cost = Sum of cost of all lines
Where cost of line = (Number of extra spaces in the line)²`,
      
      difficulty: 'medium',
      topics: JSON.stringify(['dynamic-programming', 'array', 'string']),
      companies: JSON.stringify(['Google', 'Microsoft', 'Amazon', 'Adobe']),
      timeLimit: 2000,
      memoryLimit: 256,
      
      inputFormat: `First line contains two integers n and k
- n: size of array (number of words)
- k: maximum characters per line (line width)
Second line contains n space-separated integers representing arr[]
- arr[i]: number of characters in word i`,
      
      outputFormat: `A single integer representing the minimum total cost`,
      
      constraints: `1 ≤ n ≤ 500
1 ≤ k ≤ 2000
1 ≤ arr[i] < k (each word fits in a line)`,
      
      sampleInput: `4 6
3 2 2 5`,
      
      sampleOutput: `10`,
      
      templates: JSON.stringify({
        python: `def solve_word_wrap(arr, k):
    # Write your code here
    n = len(arr)
    dp = [float('inf')] * (n + 1)
    dp[n] = 0
    
    # Your implementation
    
    return dp[0]

# Input reading
n, k = map(int, input().split())
arr = list(map(int, input().split()))

# Output
print(solve_word_wrap(arr, k))`,
        
        javascript: `function solveWordWrap(arr, k) {
    // Write your code here
    const n = arr.length;
    const dp = new Array(n + 1).fill(Infinity);
    dp[n] = 0;
    
    // Your implementation
    
    return dp[0];
}

// Input reading
const input = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');
const [n, k] = input[0].split(' ').map(Number);
const arr = input[1].split(' ').map(Number);

// Output
console.log(solveWordWrap(arr, k));`,
        
        java: `import java.util.*;

public class Solution {
    public static int solveWordWrap(int[] arr, int k) {
        // Write your code here
        int n = arr.length;
        int[] dp = new int[n + 1];
        Arrays.fill(dp, Integer.MAX_VALUE);
        dp[n] = 0;
        
        // Your implementation
        
        return dp[0];
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int k = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }
        System.out.println(solveWordWrap(arr, k));
    }
}`,
        
        cpp: `#include <iostream>
#include <vector>
#include <climits>
using namespace std;

int solveWordWrap(vector<int>& arr, int k) {
    // Write your code here
    int n = arr.size();
    vector<int> dp(n + 1, INT_MAX);
    dp[n] = 0;
    
    // Your implementation
    
    return dp[0];
}

int main() {
    int n, k;
    cin >> n >> k;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    cout << solveWordWrap(arr, k) << endl;
    return 0;
}`
      }),
      
      testCases: JSON.stringify([
        {
          input: '4 6\n3 2 2 5',
          output: '10',
          explanation: 'Line 1: word 1 (length 3) → extra = 6-3 = 3 → cost = 9\nLine 2: words 2,3 (lengths 2,2) → extra = 6-2-2-1 = 1 → cost = 1\nLine 3: word 4 (length 5) → last line → cost = 0\nTotal: 9+1 = 10'
        },
        {
          input: '3 4\n3 2 2',
          output: '5',
          explanation: 'Line 1: word 1 → extra = 4-3 = 1 → cost = 1\nLine 2: word 2 → extra = 4-2 = 2 → cost = 4\nLine 3: word 3 → last line → cost = 0\nTotal: 1+4 = 5'
        },
        {
          input: '3 6\n2 3 4',
          output: '1',
          explanation: 'Line 1: words 1,2 → extra = 6-2-3-1 = 0 → cost = 0\nLine 2: word 3 → last line → cost = 0\nOr: Line 1: word 1 → extra = 4 → cost = 16 (worse)\nOptimal: 0+1 = 1 for Line1:[2], Line2:[3,4]'
        },
        {
          input: '5 10\n3 2 2 2 5',
          output: '0',
          explanation: 'All words can fit in one line: 3+2+2+2+5+4spaces = 18 > 10? No.\n3+2+1+2+1+2+1+5 = 17 > 10, needs split.\nOptimal arrangement gives cost 0'
        },
        {
          input: '2 5\n2 3',
          output: '0',
          explanation: 'Both words fit in one line: 2+3+1 = 6 > 5, needs split.\nLine 1: [2] → cost = 9\nLine 2: [3] → cost = 0\nOR Line 1: [2,3] → fits with 0 extra\nOptimal: 0'
        }
      ]),
      
      xpReward: 30
    };

    // Upsert the problem (update if exists, create if doesn't)
    const problem = await prisma.question.upsert({
      where: { slug: 'word-wrap' },
      update: problemData,
      create: problemData
    });

    console.log('✅ Word Wrap problem updated successfully!');
    console.log(`   ID: ${problem.id}`);
    console.log(`   Title: ${problem.title}`);
    console.log(`   Difficulty: ${problem.difficulty}`);
    console.log(`   Test Cases: ${JSON.parse(problem.testCases as string).length}`);

  } catch (error) {
    console.error('❌ Error updating Word Wrap problem:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateWordWrapProblem();
