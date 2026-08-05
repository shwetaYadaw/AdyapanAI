import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { prisma } from '../src/config/prisma';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface QuestionDef {
  title: string;
  difficulty: string;
  statement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  referenceSolution: string;
  testCases: { input: string; output: string; isHidden?: boolean; explanation?: string }[];
  experienceLevel?: 'freshers' | 'experienced';
}

const PROBLEMS: QuestionDef[] = [
  {
    title: 'Find Minimum and Maximum Element in Array',
    difficulty: 'easy',
    statement: 'Given an array of N integers, write a program to find the minimum and maximum elements in the array.',
    inputFormat: 'The first line contains an integer N representing size of array.\nThe second line contains N space-separated integers.',
    outputFormat: 'Print the minimum element followed by space and maximum element.',
    constraints: '1 <= N <= 10^5\n-10^9 <= Arr[i] <= 10^9',
    referenceSolution: `function solve(input) {
  const lines = input.trim().split('\\n');
  const n = parseInt(lines[0]);
  const arr = lines[1].trim().split(/\\s+/).map(Number);
  let min = arr[0], max = arr[0];
  for (let i = 1; i < n; i++) {
    if (arr[i] < min) min = arr[i];
    if (arr[i] > max) max = arr[i];
  }
  console.log(min + ' ' + max);
}`,
    testCases: [
      { input: '5\n3 2 1 56 1000', output: '1 1000', isHidden: false, explanation: '1 is minimum and 1000 is maximum' },
      { input: '6\n1 345 234 21 5678 9', output: '1 5678', isHidden: false },
      { input: '4\n-10 -20 -30 -5', output: '-30 -5', isHidden: true },
      { input: '1\n42', output: '42 42', isHidden: true }
    ]
  },
  {
    title: 'Reverse an Array',
    difficulty: 'easy',
    statement: 'Given an array of N integers, write a program to reverse the array.',
    inputFormat: 'The first line contains an integer N.\nThe second line contains N space-separated integers.',
    outputFormat: 'Print the space-separated elements of the reversed array.',
    constraints: '1 <= N <= 10^5\n-10^5 <= Arr[i] <= 10^5',
    referenceSolution: `function solve(input) {
  const lines = input.trim().split('\\n');
  const n = parseInt(lines[0]);
  const arr = lines[1].trim().split(/\\s+/);
  console.log(arr.reverse().join(' '));
}`,
    testCases: [
      { input: '4\n1 2 3 4', output: '4 3 2 1', isHidden: false },
      { input: '5\n10 20 30 40 50', output: '50 40 30 20 10', isHidden: false },
      { input: '3\n7 7 7', output: '7 7 7', isHidden: true }
    ]
  },
  {
    title: 'Sum of All Elements in Array',
    difficulty: 'easy',
    statement: 'Given an array of N integers, calculate and print the sum of all elements present in the array.',
    inputFormat: 'The first line contains N.\nThe second line contains N space-separated integers.',
    outputFormat: 'Print a single integer representing the sum.',
    constraints: '1 <= N <= 10^5\n-10^4 <= Arr[i] <= 10^4',
    referenceSolution: `function solve(input) {
  const lines = input.trim().split('\\n');
  const n = parseInt(lines[0]);
  const arr = lines[1].trim().split(/\\s+/).map(Number);
  const sum = arr.reduce((acc, curr) => acc + curr, 0);
  console.log(sum);
}`,
    testCases: [
      { input: '5\n1 2 3 4 5', output: '15', isHidden: false },
      { input: '3\n10 -5 15', output: '20', isHidden: false },
      { input: '4\n100 200 300 400', output: '1000', isHidden: true }
    ]
  },
  {
    title: 'Count Even and Odd Numbers in Array',
    difficulty: 'easy',
    statement: 'Given an array of N positive integers, count the number of even integers and odd integers in the array.',
    inputFormat: 'The first line contains N.\nThe second line contains N space-separated integers.',
    outputFormat: 'Print two space-separated integers: count of even numbers and count of odd numbers.',
    constraints: '1 <= N <= 10^5\n1 <= Arr[i] <= 10^9',
    referenceSolution: `function solve(input) {
  const lines = input.trim().split('\\n');
  const n = parseInt(lines[0]);
  const arr = lines[1].trim().split(/\\s+/).map(Number);
  let even = 0, odd = 0;
  for (let num of arr) {
    if (num % 2 === 0) even++;
    else odd++;
  }
  console.log(even + ' ' + odd);
}`,
    testCases: [
      { input: '6\n1 2 3 4 5 6', output: '3 3', isHidden: false },
      { input: '5\n2 4 6 8 10', output: '5 0', isHidden: false },
      { input: '4\n1 3 5 7', output: '0 4', isHidden: true }
    ]
  },
  {
    title: 'Check if Array is Sorted',
    difficulty: 'easy',
    statement: 'Given an array of N integers, check whether the array is sorted in non-decreasing (ascending) order. Print "YES" if sorted, else "NO".',
    inputFormat: 'First line contains N.\nSecond line contains N space-separated integers.',
    outputFormat: 'Print "YES" or "NO".',
    constraints: '1 <= N <= 10^5\n-10^9 <= Arr[i] <= 10^9',
    referenceSolution: `function solve(input) {
  const lines = input.trim().split('\\n');
  const n = parseInt(lines[0]);
  const arr = lines[1].trim().split(/\\s+/).map(Number);
  let isSorted = true;
  for (let i = 0; i < n - 1; i++) {
    if (arr[i] > arr[i + 1]) {
      isSorted = false;
      break;
    }
  }
  console.log(isSorted ? 'YES' : 'NO');
}`,
    testCases: [
      { input: '5\n10 20 30 40 50', output: 'YES', isHidden: false },
      { input: '5\n10 20 15 40 50', output: 'NO', isHidden: false },
      { input: '1\n100', output: 'YES', isHidden: true }
    ]
  },
  {
    title: 'Find Second Largest Element in Array',
    difficulty: 'easy',
    statement: 'Given an array of N distinct integers, find the second largest element in the array. If no such element exists, print -1.',
    inputFormat: 'First line contains N.\nSecond line contains N space-separated integers.',
    outputFormat: 'Print the second largest element.',
    constraints: '2 <= N <= 10^5\n-10^9 <= Arr[i] <= 10^9',
    referenceSolution: `function solve(input) {
  const lines = input.trim().split('\\n');
  const n = parseInt(lines[0]);
  const arr = lines[1].trim().split(/\\s+/).map(Number);
  let largest = -Infinity, second = -Infinity;
  for (let num of arr) {
    if (num > largest) {
      second = largest;
      largest = num;
    } else if (num > second && num !== largest) {
      second = num;
    }
  }
  console.log(second === -Infinity ? -1 : second);
}`,
    testCases: [
      { input: '6\n12 35 1 10 34 1', output: '34', isHidden: false },
      { input: '5\n10 5 10 10 10', output: '5', isHidden: false },
      { input: '2\n10 20', output: '10', isHidden: true }
    ]
  },
  {
    title: 'Linear Search in Array',
    difficulty: 'easy',
    statement: 'Given an array of N elements and a target element K, find the 0-based index of key K in the array. If K is not present, print -1.',
    inputFormat: 'First line contains two integers N and K.\nSecond line contains N space-separated integers.',
    outputFormat: 'Print the 0-based index of K or -1.',
    constraints: '1 <= N <= 10^5\n-10^9 <= Arr[i], K <= 10^9',
    referenceSolution: `function solve(input) {
  const lines = input.trim().split('\\n');
  const [n, k] = lines[0].trim().split(/\\s+/).map(Number);
  const arr = lines[1].trim().split(/\\s+/).map(Number);
  const index = arr.indexOf(k);
  console.log(index);
}`,
    testCases: [
      { input: '5 15\n10 20 15 30 40', output: '2', isHidden: false },
      { input: '4 100\n1 2 3 4', output: '-1', isHidden: false },
      { input: '5 5\n5 4 3 2 1', output: '0', isHidden: true }
    ]
  },
  {
    title: 'Move All Zeros to End of Array',
    difficulty: 'easy',
    statement: 'Given an array of N integers, move all the zeros to the end of the array while maintaining the relative order of non-zero elements.',
    inputFormat: 'First line contains N.\nSecond line contains N space-separated integers.',
    outputFormat: 'Print space-separated elements of the modified array.',
    constraints: '1 <= N <= 10^5\n-10^5 <= Arr[i] <= 10^5',
    referenceSolution: `function solve(input) {
  const lines = input.trim().split('\\n');
  const n = parseInt(lines[0]);
  const arr = lines[1].trim().split(/\\s+/).map(Number);
  const nonZeros = arr.filter(x => x !== 0);
  const zerosCount = n - nonZeros.length;
  const result = [...nonZeros, ...Array(zerosCount).fill(0)];
  console.log(result.join(' '));
}`,
    testCases: [
      { input: '6\n0 1 0 3 12 0', output: '1 3 12 0 0 0', isHidden: false },
      { input: '4\n1 2 3 4', output: '1 2 3 4', isHidden: false },
      { input: '5\n0 0 0 0 1', output: '1 0 0 0 0', isHidden: true }
    ]
  },
  {
    title: 'Find Missing Number in Array',
    difficulty: 'easy',
    statement: 'Given an array containing N-1 distinct numbers in the range of 1 to N, find the single missing number.',
    inputFormat: 'First line contains N.\nSecond line contains N-1 space-separated integers.',
    outputFormat: 'Print the missing integer.',
    constraints: '2 <= N <= 10^5',
    referenceSolution: `function solve(input) {
  const lines = input.trim().split('\\n');
  const n = parseInt(lines[0]);
  const arr = lines[1].trim().split(/\\s+/).map(Number);
  const expectedSum = (n * (n + 1)) / 2;
  const actualSum = arr.reduce((a, b) => a + b, 0);
  console.log(expectedSum - actualSum);
}`,
    testCases: [
      { input: '5\n1 2 4 5', output: '3', isHidden: false },
      { input: '2\n1', output: '2', isHidden: false },
      { input: '6\n1 2 3 5 6', output: '4', isHidden: true }
    ]
  },
  {
    title: 'Find Frequency of an Element',
    difficulty: 'easy',
    statement: 'Given an array of N integers and a target integer X, find how many times X appears in the array.',
    inputFormat: 'First line contains N and X.\nSecond line contains N space-separated integers.',
    outputFormat: 'Print the total frequency of X.',
    constraints: '1 <= N <= 10^5\n-10^9 <= Arr[i], X <= 10^9',
    referenceSolution: `function solve(input) {
  const lines = input.trim().split('\\n');
  const [n, x] = lines[0].trim().split(/\\s+/).map(Number);
  const arr = lines[1].trim().split(/\\s+/).map(Number);
  const count = arr.filter(num => num === x).length;
  console.log(count);
}`,
    testCases: [
      { input: '6 2\n1 2 2 3 2 4', output: '3', isHidden: false },
      { input: '5 10\n1 2 3 4 5', output: '0', isHidden: false },
      { input: '4 7\n7 7 7 7', output: '4', isHidden: true }
    ]
  },
  {
    title: 'Single Number (Element Appears Once)',
    difficulty: 'easy',
    statement: 'Given a non-empty array of N integers where every element appears twice except for one element which appears once. Find that single element.',
    inputFormat: 'First line contains N.\nSecond line contains N space-separated integers.',
    outputFormat: 'Print the single non-repeating integer.',
    constraints: '1 <= N <= 10^5 (N is odd)',
    referenceSolution: `function solve(input) {
  const lines = input.trim().split('\\n');
  const n = parseInt(lines[0]);
  const arr = lines[1].trim().split(/\\s+/).map(Number);
  let res = 0;
  for (let num of arr) res ^= num;
  console.log(res);
}`,
    testCases: [
      { input: '5\n4 1 2 1 2', output: '4', isHidden: false },
      { input: '3\n2 2 1', output: '1', isHidden: false },
      { input: '1\n99', output: '99', isHidden: true }
    ]
  },
  {
    title: 'Rotate Array Right by K Steps',
    difficulty: 'easy',
    statement: 'Given an array of N integers, rotate the array to the right by K steps, where K is non-negative.',
    inputFormat: 'First line contains N and K.\nSecond line contains N space-separated integers.',
    outputFormat: 'Print space-separated elements of rotated array.',
    constraints: '1 <= N <= 10^5\n0 <= K <= 10^5',
    referenceSolution: `function solve(input) {
  const lines = input.trim().split('\\n');
  const [n, kRaw] = lines[0].trim().split(/\\s+/).map(Number);
  const arr = lines[1].trim().split(/\\s+/).map(Number);
  const k = kRaw % n;
  const rotated = [...arr.slice(n - k), ...arr.slice(0, n - k)];
  console.log(rotated.join(' '));
}`,
    testCases: [
      { input: '5 2\n1 2 3 4 5', output: '4 5 1 2 3', isHidden: false },
      { input: '7 3\n1 2 3 4 5 6 7', output: '5 6 7 1 2 3 4', isHidden: false },
      { input: '3 4\n10 20 30', output: '30 10 20', isHidden: true }
    ]
  }
];

const EXPERIENCED_PROBLEMS: QuestionDef[] = [
  {
    title: 'Maximum Subarray Sum (Kadane\'s Algorithm)',
    difficulty: 'medium',
    statement: 'Given an integer array `nums`, find the subarray with the largest sum, and return its sum.',
    inputFormat: 'The first line contains an integer N representing size of array.\nThe second line contains N space-separated integers.',
    outputFormat: 'Print the maximum subarray sum.',
    constraints: '1 <= N <= 10^5\n-10^4 <= nums[i] <= 10^4',
    referenceSolution: `function solve(input) {
  const lines = input.trim().split('\\n');
  const n = parseInt(lines[0]);
  const arr = lines[1].trim().split(/\\s+/).map(Number);
  let max_so_far = arr[0];
  let current_max = arr[0];
  for (let i = 1; i < n; i++) {
    current_max = Math.max(arr[i], current_max + arr[i]);
    max_so_far = Math.max(max_so_far, current_max);
  }
  console.log(max_so_far);
}`,
    testCases: [
      { input: '9\n-2 1 -3 4 -1 2 1 -5 4', output: '6', isHidden: false, explanation: 'The subarray [4,-1,2,1] has the largest sum = 6.' },
      { input: '1\n1', output: '1', isHidden: false },
      { input: '5\n5 4 -1 7 8', output: '23', isHidden: true },
      { input: '3\n-1 -2 -3', output: '-1', isHidden: true }
    ],
    experienceLevel: 'experienced'
  },
  {
    title: 'Merge Overlapping Intervals',
    difficulty: 'medium',
    statement: 'Given an array of `intervals` where `intervals[i] = [starti, endi]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
    inputFormat: 'The first line contains an integer N.\nEach of the next N lines contains two space-separated integers representing start and end of an interval.',
    outputFormat: 'Print each merged interval on a new line, with start and end space-separated.',
    constraints: '1 <= N <= 10^4\n0 <= starti <= endi <= 10^5',
    referenceSolution: `function solve(input) {
  const lines = input.trim().split('\\n');
  const n = parseInt(lines[0]);
  const intervals = [];
  for (let i = 1; i <= n; i++) {
    intervals.push(lines[i].split(' ').map(Number));
  }
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [];
  for (const interval of intervals) {
    if (!merged.length || interval[0] > merged[merged.length - 1][1]) {
      merged.push(interval);
    } else {
      merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], interval[1]);
    }
  }
  merged.forEach(interval => console.log(interval.join(' ')));
}`,
    testCases: [
      { input: '4\n1 3\n2 6\n8 10\n15 18', output: '1 6\n8 10\n15 18', isHidden: false },
      { input: '2\n1 4\n4 5', output: '1 5', isHidden: false },
      { input: '3\n1 4\n0 4\n0 1', output: '0 4', isHidden: true }
    ],
    experienceLevel: 'experienced'
  },
  {
    title: 'Container With Most Water',
    difficulty: 'medium',
    statement: 'Given `n` non-negative integers `a1, a2, ..., an` where each represents a point at coordinate `(i, ai)`. `n` vertical lines are drawn such that the two endpoints of the line `i` are `(i, ai)` and `(i, 0)`. Find two lines, which, together with the x-axis, form a container, such that the container contains the most water.',
    inputFormat: 'The first line contains an integer N.\nThe second line contains N space-separated integers representing heights.',
    outputFormat: 'Print the maximum amount of water that can be contained.',
    constraints: '2 <= N <= 10^5\n0 <= height[i] <= 10^4',
    referenceSolution: `function solve(input) {
  const lines = input.trim().split('\\n');
  const n = parseInt(lines[0]);
  const height = lines[1].trim().split(' ').map(Number);
  let maxArea = 0;
  let left = 0;
  let right = n - 1;
  while (left < right) {
    const currentArea = Math.min(height[left], height[right]) * (right - left);
    maxArea = Math.max(maxArea, currentArea);
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }
  console.log(maxArea);
}`,
    testCases: [
      { input: '9\n1 8 6 2 5 4 8 3 7', output: '49', isHidden: false },
      { input: '2\n1 1', output: '1', isHidden: false },
      { input: '4\n4 3 2 1', output: '6', isHidden: true }
    ],
    experienceLevel: 'experienced'
  },
  {
    title: '3Sum',
    difficulty: 'medium',
    statement: 'Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`. The solution set must not contain duplicate triplets.',
    inputFormat: 'The first line contains an integer N.\nThe second line contains N space-separated integers.',
    outputFormat: 'Print each triplet on a new line, with elements space-separated and sorted. If no triplets, print nothing.',
    constraints: '0 <= N <= 3000\n-10^5 <= nums[i] <= 10^5',
    referenceSolution: `function solve(input) {
  const lines = input.trim().split('\\n');
  const n = parseInt(lines[0]);
  const nums = lines[1].trim().split(' ').map(Number);
  nums.sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < n - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let left = i + 1;
    let right = n - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++;
        right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }
  result.forEach(triplet => console.log(triplet.join(' ')));
}`,
    testCases: [
      { input: '6\n-1 0 1 2 -1 -4', output: '-1 -1 2\n-1 0 1', isHidden: false },
      { input: '3\n0 0 0', output: '0 0 0', isHidden: false },
      { input: '4\n1 2 3 4', output: '', isHidden: true }
    ],
    experienceLevel: 'experienced'
  },
  {
    title: 'Product of Array Except Self',
    difficulty: 'medium',
    statement: 'Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`. You must write an algorithm that runs in `O(n)` time and without using the division operator.',
    inputFormat: 'The first line contains an integer N.\nThe second line contains N space-separated integers.',
    outputFormat: 'Print the elements of the answer array space-separated.',
    constraints: '2 <= N <= 10^5\n-30 <= nums[i] <= 30',
    referenceSolution: `function solve(input) {
  const lines = input.trim().split('\\n');
  const n = parseInt(lines[0]);
  const nums = lines[1].trim().split(' ').map(Number);
  const answer = new Array(n).fill(1);
  let prefix = 1;
  for (let i = 0; i < n; i++) {
    answer[i] = prefix;
    prefix *= nums[i];
  }
  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    answer[i] *= suffix;
    suffix *= nums[i];
  }
  console.log(answer.join(' '));
}`,
    testCases: [
      { input: '4\n1 2 3 4', output: '24 12 8 6', isHidden: false },
      { input: '2\n-1 1', output: '1 -1', isHidden: false },
      { input: '3\n0 0 0', output: '0 0 0', isHidden: true }
    ],
    experienceLevel: 'experienced'
  },
  {
    title: 'Find the Duplicate Number',
    difficulty: 'medium',
    statement: 'Given an array of integers `nums` containing `n + 1` integers where each integer is in the range `[1, n]` inclusive. There is only one repeated number in `nums`, return this repeated number. You must solve the problem without modifying the array `nums` and uses only constant extra space.',
    inputFormat: 'The first line contains an integer N (which is n+1).\nThe second line contains N space-separated integers.',
    outputFormat: 'Print the duplicate number.',
    constraints: '1 <= N <= 10^5\nnums contains n+1 integers, each in [1, n].',
    referenceSolution: `function solve(input) {
  const lines = input.trim().split('\\n');
  const nPlus1 = parseInt(lines[0]);
  const nums = lines[1].trim().split(' ').map(Number);
  let slow = nums[0];
  let fast = nums[0];
  do {
    slow = nums[slow];
    fast = nums[nums[fast]];
  } while (slow !== fast);
  slow = nums[0];
  while (slow !== fast) {
    slow = nums[slow];
    fast = nums[fast];
  }
  console.log(slow);
}`,
    testCases: [
      { input: '5\n1 3 4 2 2', output: '2', isHidden: false },
      { input: '4\n3 1 3 4 2', output: '3', isHidden: false },
      { input: '2\n1 1', output: '1', isHidden: true }
    ],
    experienceLevel: 'experienced'
  },
  {
    title: 'Spiral Matrix',
    difficulty: 'medium',
    statement: 'Given an `m x n` matrix, return all elements of the matrix in spiral order.',
    inputFormat: 'The first line contains two space-separated integers M and N.\nEach of the next M lines contains N space-separated integers representing a row of the matrix.',
    outputFormat: 'Print the elements of the matrix in spiral order, space-separated.',
    constraints: '1 <= M, N <= 10\n-100 <= matrix[i][j] <= 100',
    referenceSolution: `function solve(input) {
  const lines = input.trim().split('\\n');
  const [m, n] = lines[0].split(' ').map(Number);
  const matrix = [];
  for (let i = 1; i <= m; i++) {
    matrix.push(lines[i].split(' ').map(Number));
  }
  const result = [];
  let top = 0, bottom = m - 1, left = 0, right = n - 1;
  while (top <= bottom && left <= right) {
    // Traverse right
    for (let i = left; i <= right; i++) {
      result.push(matrix[top][i]);
    }
    top++;
    // Traverse down
    for (let i = top; i <= bottom; i++) {
      result.push(matrix[i][right]);
    }
    right--;
    // Traverse left
    if (top <= bottom) {
      for (let i = right; i >= left; i--) {
        result.push(matrix[bottom][i]);
      }
      bottom--;
    }
    // Traverse up
    if (left <= right) {
      for (let i = bottom; i >= top; i--) {
        result.push(matrix[i][left]);
      }
      left++;
    }
  }
  console.log(result.join(' '));
}`,
    testCases: [
      { input: '3 3\n1 2 3\n4 5 6\n7 8 9', output: '1 2 3 6 9 8 7 4 5', isHidden: false },
      { input: '3 4\n1 2 3 4\n5 6 7 8\n9 10 11 12', output: '1 2 3 4 8 12 11 10 9 5 6 7', isHidden: false },
      { input: '1 1\n10', output: '10', isHidden: true }
    ],
    experienceLevel: 'experienced'
  },
  {
    title: 'Rotate Image (Matrix)',
    difficulty: 'medium',
    statement: 'You are given an `n x n` 2D `matrix` representing an image, rotate the image by 90 degrees (clockwise). You have to rotate the image in-place, which means you have to modify the input 2D matrix directly. DO NOT allocate another 2D matrix.',
    inputFormat: 'The first line contains an integer N.\nEach of the next N lines contains N space-separated integers representing a row of the matrix.',
    outputFormat: 'Print the rotated matrix, each row on a new line with elements space-separated.',
    constraints: '1 <= N <= 20\n-1000 <= matrix[i][j] <= 1000',
    referenceSolution: `function solve(input) {
  const lines = input.trim().split('\\n');
  const n = parseInt(lines[0]);
  const matrix = [];
  for (let i = 1; i <= n; i++) {
    matrix.push(lines[i].split(' ').map(Number));
  }
  // Transpose the matrix
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    }
  }
  // Reverse each row
  for (let i = 0; i < n; i++) {
    matrix[i].reverse();
  }
  matrix.forEach(row => console.log(row.join(' ')));
}`,
    testCases: [
      { input: '3\n1 2 3\n4 5 6\n7 8 9', output: '7 4 1\n8 5 2\n9 6 3', isHidden: false },
      { input: '2\n5 1\n2 4', output: '2 5\n4 1', isHidden: false },
      { input: '4\n5 1 9 11\n2 4 8 10\n13 3 6 7\n15 14 12 16', output: '15 13 2 5\n14 3 4 1\n12 6 8 9\n16 7 10 11', isHidden: true }
    ],
    experienceLevel: 'experienced'
  },
  {
    title: 'Longest Consecutive Sequence',
    difficulty: 'hard',
    statement: 'Given an unsorted array of integers `nums`, return the length of the longest consecutive elements sequence. You must write an algorithm that runs in `O(n)` time.',
    inputFormat: 'The first line contains an integer N.\nThe second line contains N space-separated integers.',
    outputFormat: 'Print the length of the longest consecutive sequence.',
    constraints: '0 <= N <= 10^5\n-10^9 <= nums[i] <= 10^9',
    referenceSolution: `function solve(input) {
  const lines = input.trim().split('\\n');
  const n = parseInt(lines[0]);
  if (n === 0) {
    console.log(0);
    return;
  }
  const nums = lines[1].trim().split(' ').map(Number);
  const numSet = new Set(nums);
  let longestStreak = 0;
  for (const num of numSet) {
    if (!numSet.has(num - 1)) { // Check if it's the start of a sequence
      let currentNum = num;
      let currentStreak = 1;
      while (numSet.has(currentNum + 1)) {
        currentNum++;
        currentStreak++;
      }
      longestStreak = Math.max(longestStreak, currentStreak);
    }
  }
  console.log(longestStreak);
}`,
    testCases: [
      { input: '6\n100 4 200 1 3 2', output: '4', isHidden: false, explanation: 'The longest consecutive sequence is [1, 2, 3, 4].' },
      { input: '0\n', output: '0', isHidden: false },
      { input: '9\n0 3 7 2 5 8 4 6 0 1', output: '9', isHidden: true }
    ],
    experienceLevel: 'experienced'
  },
  {
    title: 'Trapping Rain Water',
    difficulty: 'hard',
    statement: 'Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    inputFormat: 'The first line contains an integer N.\nThe second line contains N space-separated integers representing heights.',
    outputFormat: 'Print the total amount of trapped rain water.',
    constraints: '1 <= N <= 2 * 10^4\n0 <= height[i] <= 10^5',
    referenceSolution: `function solve(input) {
  const lines = input.trim().split('\\n');
  const n = parseInt(lines[0]);
  const height = lines[1].trim().split(' ').map(Number);
  if (n === 0) {
    console.log(0);
    return;
  }
  let left = 0, right = n - 1;
  let leftMax = 0, rightMax = 0;
  let trappedWater = 0;
  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) {
        leftMax = height[left];
      } else {
        trappedWater += leftMax - height[left];
      }
      left++;
    } else {
      if (height[right] >= rightMax) {
        rightMax = height[right];
      } else {
        trappedWater += rightMax - height[right];
      }
      right--;
    }
  }
  console.log(trappedWater);
}`,
    testCases: [
      { input: '12\n0 1 0 2 1 0 1 3 2 1 2 1', output: '6', isHidden: false },
      { input: '6\n4 2 0 3 2 5', output: '9', isHidden: false },
      { input: '3\n2 0 2', output: '2', isHidden: true }
    ],
    experienceLevel: 'experienced'
  },
  {
    title: 'Subarray Sum Equals K',
    difficulty: 'medium',
    statement: 'Given an array of integers `nums` and an integer `k`, return the total number of subarrays whose sum equals `k`. A subarray is a contiguous non-empty sequence of elements within an array.',
    inputFormat: 'The first line contains two space-separated integers N and K.\nThe second line contains N space-separated integers.',
    outputFormat: 'Print the total count of subarrays whose sum equals K.',
    constraints: '1 <= N <= 2 * 10^4\n-1000 <= nums[i] <= 1000\n-10^7 <= K <= 10^7',
    referenceSolution: `function solve(input) {
  const lines = input.trim().split('\\n');
  const [n, k] = lines[0].split(' ').map(Number);
  const nums = lines[1].trim().split(' ').map(Number);
  let count = 0;
  let sum = 0;
  const map = new Map();
  map.set(0, 1);
  for (let i = 0; i < n; i++) {
    sum += nums[i];
    if (map.has(sum - k)) {
      count += map.get(sum - k);
    }
    map.set(sum, (map.get(sum) || 0) + 1);
  }
  console.log(count);
}`,
    testCases: [
      { input: '5 2\n1 1 1 1 1', output: '4', isHidden: false },
      { input: '3 3\n1 2 3', output: '2', isHidden: false, explanation: 'Subarrays are [1,2] and [3]' },
      { input: '4 0\n-1 -1 1 1', output: '2', isHidden: true }
    ],
    experienceLevel: 'experienced'
  },
  {
    title: 'Game of Life',
    difficulty: 'medium',
    statement: 'According to Wikipedia\'s article: "The Game of Life, also known simply as Life, is a cellular automaton devised by the British mathematician John Horton Conway in 1970." Given an `m x n` binary grid `board` representing the game of life. Update the board to represent the next state.',
    inputFormat: 'The first line contains two space-separated integers M and N.\nEach of the next M lines contains N space-separated integers (0 or 1) representing a row of the board.',
    outputFormat: 'Print the updated board, each row on a new line with elements space-separated.',
    constraints: '1 <= M, N <= 25\nboard[i][j] is 0 or 1.',
    referenceSolution: `function solve(input) {
  const lines = input.trim().split('\\n');
  const [m, n] = lines[0].split(' ').map(Number);
  const board = [];
  for (let i = 1; i <= m; i++) {
    board.push(lines[i].split(' ').map(Number));
  }
  const neighbors = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      let liveNeighbors = 0;
      for (const [dr, dc] of neighbors) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < m && nc >= 0 && nc < n && (board[nr][nc] === 1 || board[nr][nc] === 2)) {
          liveNeighbors++;
        }
      }
      if (board[r][c] === 1 && (liveNeighbors < 2 || liveNeighbors > 3)) {
        board[r][c] = 2; // Live to Dead
      }
      if (board[r][c] === 0 && liveNeighbors === 3) {
        board[r][c] = 3; // Dead to Live
      }
    }
  }
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (board[r][c] === 2) {
        board[r][c] = 0;
      } else if (board[r][c] === 3) {
        board[r][c] = 1;
      }
    }
  }
  board.forEach(row => console.log(row.join(' ')));
}`,
    testCases: [
      { input: '3 3\n0 1 0\n0 0 1\n1 1 1', output: '0 0 0\n1 0 1\n0 1 1', isHidden: false },
      { input: '4 3\n0 1 0\n0 0 1\n1 1 1\n0 0 0', output: '0 0 0\n1 0 1\n0 1 1\n0 0 0', isHidden: true }
    ],
    experienceLevel: 'experienced'
  },
  {
    title: 'Median of Two Sorted Arrays',
    difficulty: 'hard',
    statement: 'Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays. The overall run time complexity should be `O(log(m+n))`.' +
               'For an even total number of elements, the median is the average of the two middle elements.',
    inputFormat: 'The first line contains an integer M.\nThe second line contains M space-separated integers for nums1.\nThe third line contains an integer N.\nThe fourth line contains N space-separated integers for nums2.',
    outputFormat: 'Print the median as a floating-point number.',
    constraints: '0 <= M, N <= 1000\n1 <= M + N <= 2000\n-10^6 <= nums1[i], nums2[i] <= 10^6',
    referenceSolution: `function solve(input) {
  const lines = input.trim().split('\\n');
  const m = parseInt(lines[0]);
  const nums1 = lines[1].split(' ').map(Number);
  const n = parseInt(lines[2]);
  const nums2 = lines[3].split(' ').map(Number);

  const merged = [];
  let i = 0, j = 0;
  while (i < m && j < n) {
    if (nums1[i] < nums2[j]) {
      merged.push(nums1[i++]);
    } else {
      merged.push(nums2[j++]);
    }
  }
  while (i < m) merged.push(nums1[i++]);
  while (j < n) merged.push(nums2[j++]);

  const totalLength = m + n;
  if (totalLength % 2 === 1) {
    console.log(merged[Math.floor(totalLength / 2)].toFixed(5));
  } else {
    const mid1 = merged[totalLength / 2 - 1];
    const mid2 = merged[totalLength / 2];
    console.log(((mid1 + mid2) / 2).toFixed(5));
  }
}`,
    testCases: [
      { input: '2\n1 3\n2\n2', output: '2.00000', isHidden: false },
      { input: '2\n1 2\n2\n3 4', output: '2.50000', isHidden: false },
      { input: '0\n\n1\n1', output: '1.00000', isHidden: true },
      { input: '1\n1\n0\n', output: '1.00000', isHidden: true }
    ],
    experienceLevel: 'experienced'
  },
  {
    title: 'Set Matrix Zeroes',
    difficulty: 'medium',
    statement: 'Given an `m x n` integer matrix `matrix`, if an element is `0`, set its entire row and column to `0`s. You must do it in-place.',
    inputFormat: 'The first line contains two space-separated integers M and N.\nEach of the next M lines contains N space-separated integers representing a row of the matrix.',
    outputFormat: 'Print the modified matrix, each row on a new line with elements space-separated.',
    constraints: '1 <= M, N <= 200\n-10^9 <= matrix[i][j] <= 10^9',
    referenceSolution: `function solve(input) {
  const lines = input.trim().split('\\n');
  const [m, n] = lines[0].split(' ').map(Number);
  const matrix = [];
  for (let i = 1; i <= m; i++) {
    matrix.push(lines[i].split(' ').map(Number));
  }

  let firstRowHasZero = false;
  let firstColHasZero = false;

  // Check if first row has a zero
  for (let j = 0; j < n; j++) {
    if (matrix[0][j] === 0) {
      firstRowHasZero = true;
      break;
    }
  }

  // Check if first column has a zero
  for (let i = 0; i < m; i++) {
    if (matrix[i][0] === 0) {
      firstColHasZero = true;
      break;
    }
  }

  // Use first row and column as markers
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      if (matrix[i][j] === 0) {
        matrix[i][0] = 0;
        matrix[0][j] = 0;
      }
    }
  }

  // Zero out rows and columns based on markers
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      if (matrix[i][0] === 0 || matrix[0][j] === 0) {
        matrix[i][j] = 0;
      }
    }
  }

  // Zero out first row if needed
  if (firstRowHasZero) {
    for (let j = 0; j < n; j++) {
      matrix[0][j] = 0;
    }
  }

  // Zero out first column if needed
  if (firstColHasZero) {
    for (let i = 0; i < m; i++) {
      matrix[i][0] = 0;
    }
  }

  matrix.forEach(row => console.log(row.join(' ')));
}`,
    testCases: [
      { input: '3 3\n1 1 1\n1 0 1\n1 1 1', output: '1 0 1\n0 0 0\n1 0 1', isHidden: false },
      { input: '3 4\n0 1 2 0\n3 4 5 2\n1 3 1 5', output: '0 0 0 0\n0 4 5 0\n0 3 1 0', isHidden: false },
      { input: '2 2\n1 0\n1 1', output: '0 0\n1 0', isHidden: true }
    ],
    experienceLevel: 'experienced'
  },
  {
    title: 'Word Search',
    difficulty: 'medium',
    statement: 'Given an `m x n` grid of characters `board` and a string `word`, return `true` if `word` exists in the grid. The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.',
    inputFormat: 'The first line contains two space-separated integers M and N.\nEach of the next M lines contains N characters (no spaces) representing a row of the board.\nThe last line contains the word to search.',
    outputFormat: 'Print `true` or `false`.',
    constraints: '1 <= M, N <= 6\n1 <= word.length <= 15\nboard and word consist of lowercase and uppercase English letters.',
    referenceSolution: `function solve(input) {
  const lines = input.trim().split('\\n');
  const [m, n] = lines[0].split(' ').map(Number);
  const board = [];
  for (let i = 1; i <= m; i++) {
    board.push(lines[i].split(''));
  }
  const word = lines[m + 1];

  function dfs(r, c, k) {
    if (k === word.length) return true;
    if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] !== word[k]) return false;

    const temp = board[r][c];
    board[r][c] = '#'; // Mark as visited

    const found = dfs(r + 1, c, k + 1) ||
                  dfs(r - 1, c, k + 1) ||
                  dfs(r, c + 1, k + 1) ||
                  dfs(r, c - 1, k + 1);

    board[r][c] = temp; // Backtrack
    return found;
  }

  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (board[r][c] === word[0] && dfs(r, c, 0)) {
        console.log(true);
        return;
      }
    }
  }
  console.log(false);
}`,
    testCases: [
      { input: '3 4\nA B C E\nS F C S\nA D E E\nABCCED', output: 'true', isHidden: false },
      { input: '3 4\nA B C E\nS F C S\nA D E E\nSEE', output: 'true', isHidden: false },
      { input: '3 4\nA B C E\nS F C S\nA D E E\nABCB', output: 'false', isHidden: false },
      { input: '1 1\nA\nA', output: 'true', isHidden: true }
    ],
    experienceLevel: 'experienced'
  },
  {
    title: 'Maximum Product Subarray',
    difficulty: 'medium',
    statement: 'Given an integer array `nums`, find a contiguous non-empty subarray within the array that has the largest product, and return the product. The test cases are generated so that the answer will fit in a 32-bit integer.',
    inputFormat: 'The first line contains an integer N.\nThe second line contains N space-separated integers.',
    outputFormat: 'Print the maximum product subarray.',
    constraints: '1 <= N <= 2 * 10^4\n-10 <= nums[i] <= 10',
    referenceSolution: `function solve(input) {
  const lines = input.trim().split('\\n');
  const n = parseInt(lines[0]);
  const nums = lines[1].trim().split(' ').map(Number);

  if (n === 0) {
    console.log(0);
    return;
  }

  let maxSoFar = nums[0];
  let minSoFar = nums[0];
  let result = maxSoFar;

  for (let i = 1; i < n; i++) {
    const curr = nums[i];
    const tempMax = Math.max(curr, Math.max(maxSoFar * curr, minSoFar * curr));
    minSoFar = Math.min(curr, Math.min(maxSoFar * curr, minSoFar * curr));

    maxSoFar = tempMax;

    result = Math.max(maxSoFar, result);
  }

  console.log(result);
}`,
    testCases: [
      { input: '4\n2 3 -2 4', output: '6', isHidden: false, explanation: 'Subarray [2,3] has the largest product 6.' },
      { input: '3\n-2 0 -1', output: '0', isHidden: false, explanation: 'The result cannot be 2, because [-2,-1] is not a subarray. The largest product is 0 from [0].' },
      { input: '1\n-2', output: '-2', isHidden: true },
      { input: '6\n-2 3 -4 -1 0 5', output: '24', isHidden: true }
    ],
    experienceLevel: 'experienced'
  }
];

async function seedProblemsOnArrays() {
  console.log('🌱 Starting to seed "Problems on Arrays" topic and fresher problems...\n');

  const TOPIC_NAME = 'Problems on Arrays';

  // 1. Ensure Topic exists in Topic table for both tcs-nqt and coding-arena
  for (const system of ['tcs-nqt', 'coding-arena', 'aptitude']) {
    try {
      const existing = await prisma.topic.findFirst({
        where: { name: TOPIC_NAME, system: system as any }
      });
      if (!existing) {
        await prisma.topic.create({
          data: {
            name: TOPIC_NAME,
            system: system as any,
            description: 'Fresher-level practice problems on Arrays',
            order: 0,
            isActive: true
          }
        });
      } else {
        await prisma.topic.update({
          where: { id: existing.id },
          data: { isActive: true, description: 'Fresher-level practice problems on Arrays' }
        });
      }
      console.log(`✅ Topic "${TOPIC_NAME}" ready for system: ${system}`);
    } catch (err: any) {
      console.warn(`⚠️ Warning setting topic for ${system}:`, err.message);
    }
  }

  let tcsCreated = 0;
  let arenaCreated = 0;

  const allProblems = [...PROBLEMS, ...EXPERIENCED_PROBLEMS]; // Combine both arrays

  for (const prob of allProblems) {
    const slugBase = slugify(prob.title);
    const levelSuffix = prob.experienceLevel === 'experienced' ? 'experienced-array' : 'fresher-array';
    const tcsSlug = `${slugBase}-${levelSuffix}-tcs`;
    const arenaSlug = `${slugBase}-${levelSuffix}`;

    // A. Seed into TcsNqtQuestion table
    try {
      const existingTcs = await prisma.tcsNqtQuestion.findUnique({
        where: { slug: tcsSlug }
      });

      if (!existingTcs) {
        await prisma.tcsNqtQuestion.create({
          data: {
            title: prob.title,
            slug: tcsSlug,
            difficulty: prob.difficulty,
            topic: TOPIC_NAME,
            statement: prob.statement,
            inputFormat: prob.inputFormat,
            outputFormat: prob.outputFormat,
            constraints: prob.constraints,
            referenceSolution: prob.referenceSolution,
            testCases: prob.testCases as any,
            companies: prob.experienceLevel === 'experienced' ? 'TCS, Wipro, Infosys, Accenture, Cognizant, Google, Microsoft, Amazon' : 'TCS, Wipro, Infosys, Accenture, Cognizant',
            experienceLevel: prob.experienceLevel || 'freshers',
            xpReward: 10
          }
        });
      } else {
        await prisma.tcsNqtQuestion.update({
          where: { id: existingTcs.id },
          data: {
            title: prob.title,
            difficulty: prob.difficulty,
            topic: TOPIC_NAME,
            statement: prob.statement,
            inputFormat: prob.inputFormat,
            outputFormat: prob.outputFormat,
            constraints: prob.constraints,
            referenceSolution: prob.referenceSolution,
            testCases: prob.testCases as any
          }
        });
      }
      tcsCreated++;
    } catch (err: any) {
      console.error(`❌ Error creating TCS question "${prob.title}":`, err.message || err);
    }

    // B. Seed into Problem table (Coding Arena)
    try {
      const existingProblem = await prisma.problem.findUnique({
        where: { slug: arenaSlug }
      });

      const starterCodeJson = {
        javascript: `function solve() {\n    // Write your code here\n}\nsolve();`,
        python: `def solve():\n    # Write your code here\n    pass\nsolve()`,
        java: `import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your code here\n    }\n}`,
        cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    // Write your code here\n    return 0;\n}`
      };

      if (!existingProblem) {
        await prisma.problem.create({
          data: {
            title: prob.title,
            slug: arenaSlug,
            difficulty: prob.difficulty,
            statement: prob.statement,
            constraints: prob.constraints,
            inputFormat: prob.inputFormat,
            outputFormat: prob.outputFormat,
            timeLimit: 2000,
            memoryLimit: 256,
            starterCode: starterCodeJson,
            referenceSolution: prob.referenceSolution,
            topics: TOPIC_NAME,
            companies: 'TCS, Wipro, Infosys, Accenture, Cognizant',
            tags: prob.experienceLevel === 'experienced' ? 'Arrays,Experienced' : 'Arrays,Fresher,Easy',
            category: prob.experienceLevel || 'fresher',
            testCases: {
              create: prob.testCases.map((tc, idx) => ({
                input: tc.input,
                expectedOutput: tc.output,
                isHidden: tc.isHidden || false,
                type: tc.isHidden ? 'hidden' : 'sample',
                explanation: tc.explanation || null,
                order: idx
              }))
            }
          }
        });
        arenaCreated++;
      } else {
        await prisma.problem.update({
          where: { id: existingProblem.id },
          data: {
            title: prob.title,
            difficulty: prob.difficulty,
            statement: prob.statement,
            constraints: prob.constraints,
            inputFormat: prob.inputFormat,
            outputFormat: prob.outputFormat,
            topics: TOPIC_NAME,
            companies: prob.experienceLevel === 'experienced' ? 'TCS, Wipro, Infosys, Accenture, Cognizant, Google, Microsoft, Amazon' : 'TCS, Wipro, Infosys, Accenture, Cognizant',
            tags: prob.experienceLevel === 'experienced' ? 'Arrays,Experienced' : 'Arrays,Fresher,Easy',
            category: prob.experienceLevel || 'fresher'
          }
        });
        arenaCreated++;
      }
    } catch (err: any) {
      console.error(`❌ Error creating Problem "${prob.title}":`, err.message || err);
    }
  }

  console.log('\n==================================================');
  console.log('✨ SEEDING COMPLETE FOR "Problems on Arrays"');
  console.log(`   Topic: ${TOPIC_NAME}`);
  console.log(`   TCS/Placement Prep Questions created/updated: ${tcsCreated}`);
  console.log(`   Coding Arena Problems created/updated: ${arenaCreated}`);
  console.log('==================================================\n');
}

seedProblemsOnArrays()
  .catch((err) => {
    console.error('Error seeding array problems:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
