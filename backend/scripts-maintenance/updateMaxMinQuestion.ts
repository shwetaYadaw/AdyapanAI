import { prisma } from '../config/prisma';

async function updateMaxMinQuestion() {
  try {
    console.log('🔍 Looking for "Maximum and Minimum Element in an Array" question...');

    // Find the question by slug or title
    const question = await prisma.question.findFirst({
      where: {
        OR: [
          { slug: { contains: 'maximum-and-minimum-element' } },
          { slug: { contains: 'maximum_and_minimum_element' } },
          { title: { contains: 'Maximum and Minimum Element' } }
        ]
      }
    });

    if (!question) {
      console.log('❌ Question not found in database');
      return;
    }

    console.log(`✅ Found question: "${question.title}" (slug: ${question.slug})`);

    // Update the question with proper test cases
    const updated = await prisma.question.update({
      where: { id: question.id },
      data: {
        title: 'Maximum and Minimum Element in an Array',
        difficulty: 'easy',
        statement: `Given an array arr[]. Your task is to find the minimum and maximum elements in the array.

**Example 1:**
- Input: arr[] = [1, 4, 3, 5, 8, 6]
- Output: [1, 8]
- Explanation: minimum and maximum elements of array are 1 and 8.

**Example 2:**
- Input: arr[] = [12, 3, 15, 7, 9]
- Output: [3, 15]
- Explanation: minimum and maximum element of array are 3 and 15.`,
        inputFormat: 'First line contains n. Second line contains n space-separated integers.',
        outputFormat: 'Two space-separated integers: minimum and maximum.',
        constraints: '1 ≤ arr.size() ≤ 10^5\n1 ≤ arr[i] ≤ 10^9',
        sampleInput: '6\n1 4 3 5 8 6',
        sampleOutput: '1 8',
        testCases: [
          {
            input: '6\n1 4 3 5 8 6',
            output: '1 8',
            isHidden: false
          },
          {
            input: '5\n12 3 15 7 9',
            output: '3 15',
            isHidden: false
          },
          {
            input: '1\n42',
            output: '42 42',
            isHidden: true
          },
          {
            input: '3\n100 50 75',
            output: '50 100',
            isHidden: true
          },
          {
            input: '7\n9 2 7 4 1 6 3',
            output: '1 9',
            isHidden: true
          },
          {
            input: '4\n1000000000 1 999999999 500000000',
            output: '1 1000000000',
            isHidden: true
          }
        ],
        topics: ['arrays'],
        companies: [],
        templates: {
          cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

pair<int, int> findMinMax(vector<int>& arr) {
    // Write your code here
    int minVal = arr[0];
    int maxVal = arr[0];
    
    for (int num : arr) {
        minVal = min(minVal, num);
        maxVal = max(maxVal, num);
    }
    
    return {minVal, maxVal};
}

int main() {
    int n;
    cin >> n;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    
    pair<int, int> result = findMinMax(arr);
    cout << result.first << " " << result.second << endl;
    
    return 0;
}`,
          java: `import java.util.*;

public class Solution {
    public static int[] findMinMax(int[] arr) {
        // Write your code here
        int min = arr[0];
        int max = arr[0];
        
        for (int num : arr) {
            if (num < min) min = num;
            if (num > max) max = num;
        }
        
        return new int[]{min, max};
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }
        
        int[] result = findMinMax(arr);
        System.out.println(result[0] + " " + result[1]);
    }
}`,
          python: `def find_min_max(arr):
    # Write your code here
    return min(arr), max(arr)

if __name__ == "__main__":
    n = int(input())
    arr = list(map(int, input().split()))
    
    min_val, max_val = find_min_max(arr)
    print(min_val, max_val)`,
          javascript: `function findMinMax(arr) {
    // Write your code here
    let min = arr[0];
    let max = arr[0];
    
    for (let num of arr) {
        if (num < min) min = num;
        if (num > max) max = num;
    }
    
    return [min, max];
}

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let lines = [];
rl.on('line', (line) => {
    lines.push(line);
}).on('close', () => {
    const n = parseInt(lines[0]);
    const arr = lines[1].split(' ').map(Number);
    
    const [min, max] = findMinMax(arr);
    console.log(min + ' ' + max);
});`
        },
        timeLimit: 1000,
        memoryLimit: 256,
        xpReward: 10
      }
    });

    console.log('\n✅ Question updated successfully!');
    console.log(`   ID: ${updated.id}`);
    console.log(`   Title: ${updated.title}`);
    console.log(`   Slug: ${updated.slug}`);
    console.log(`   Test Cases: ${updated.testCases.length}`);
    console.log('\n📝 Test Cases:');
    updated.testCases.forEach((tc: any, idx: number) => {
      console.log(`   ${idx + 1}. ${tc.isHidden ? '🔒 Hidden' : '👁️ Visible'} - Input: ${tc.input.replace(/\n/g, ' ')}`);
    });

  } catch (error) {
    console.error('❌ Error updating question:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateMaxMinQuestion();
