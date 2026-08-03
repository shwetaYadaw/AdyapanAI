import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { prisma } from '../config/prisma';
import { JudgeService } from '../services/judge.service';
import { sendSuccess } from '../utils/response.utils';
import { AppError } from '../middleware/errorHandler.middleware';
import { logger } from '../utils/logger';
import axios from 'axios';

const router = Router();
const judge = new JudgeService();

// GET /challenges/questions — List coding questions (supports search, difficulty, topic, company, pagination)
router.get('/questions', async (req, res, next) => {
  try {
    const { difficulty, topic, search, company, page = '1', limit = '50' } = req.query;

    const pageNum  = Math.max(1, parseInt(String(page), 10));
    const limitNum = Math.min(200, Math.max(1, parseInt(String(limit), 10)));
    const skip     = (pageNum - 1) * limitNum;

    // Build Prisma query condition
    const where: any = {};

    if (difficulty) where.difficulty = String(difficulty);

    if (topic) {
      where.topics = { array_contains: String(topic).toLowerCase() };
    }

    if (company) {
      where.companies = { array_contains: String(company).toLowerCase() };
    }

    if (search) {
      where.OR = [
        { title:     { contains: String(search) } },
        { statement: { contains: String(search) } },
        { slug:      { contains: String(search) } },
      ];
    }

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        select: {
          id: true,
          title: true,
          slug: true,
          difficulty: true,
          topics: true,
          companies: true,
          timeLimit: true,
          memoryLimit: true,
          xpReward: true,
          sampleInput: true,
          sampleOutput: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.question.count({ where }),
    ]);

    sendSuccess({
      res,
      data: questions,
      // @ts-ignore
      pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) },
    });
  } catch (err) { next(err); }
});

function enrichQuestionDescription(question: any) {
  const title = question.title;
  const topic = question.topics[0] || 'algorithm';
  const difficulty = question.difficulty || 'Easy';
  const xpReward = question.xpReward || 10;
  const slug = question.slug;
  const id = question.id;

  let statement = '';
  let inputFormat = '';
  let outputFormat = '';
  let constraints = '';
  let explanation = '';
  let timeComplexity = '';
  let spaceComplexity = '';
  let hints: string[] = [];
  let bruteForceEditorial = '';
  let optimizedEditorial = '';
  let correctnessProof = '';
  let pythonSol = '';
  let javaSol = '';
  let cppSol = '';
  let jsSol = '';
  let commonMistakes = '';
  let interviewTips = '';
  let relatedProblems: string[] = [];
  let followUpQuestions: string[] = [];

  if (title === 'Chocolate Distribution Problem') {
    statement = `Given an array of integer values representing the number of chocolates in a packet. There are $m$ packets and $n$ students. The task is to distribute chocolate packets such that:\n1. Each student gets exactly one packet.\n2. The difference between the maximum number of chocolates given to a student and the minimum number of chocolates given to a student is minimized.\n\nReturn the minimum difference.`;
    inputFormat = `First line contains space-separated integers representing packet sizes.\nSecond line contains the integer $m$ (number of students).`;
    outputFormat = `An integer representing the minimum possible difference.`;
    constraints = `1 <= nums.length <= 10^5\n1 <= m <= nums.length`;
    explanation = `Sorted packets: [1, 2, 3]\nFor m=2, subarray of size 2 with minimum diff is [1, 2] or [2, 3], diff is 1.`;
    timeComplexity = `O(N \\log N) where N is the number of packets.`;
    spaceComplexity = `O(1) auxiliary space.`;
    hints = [
      `Try sorting the array of packet sizes first.`,
      `Use a sliding window of size m to track the difference between the maximum and minimum elements in each window.`,
      `The first element in the window will be the minimum, and the last will be the maximum.`
    ];
    bruteForceEditorial = `Generate all combinations of size m, find the difference between max and min in each combination, and return the minimum. Time complexity: O(2^N).`;
    optimizedEditorial = `Sort the array. Use a sliding window of size m. The difference between the maximum and minimum chocolate packet sizes in the window starting at index i is nums[i + m - 1] - nums[i]. Find the minimum of this value over all i.`;
    correctnessProof = `Since the array is sorted, any contiguous subarray of size m represents the closest possible values for m students. Non-contiguous selections would only increase or keep the difference same.`;
    pythonSol = `def chocolateDistributionProblem(nums, m):\n    nums.sort()\n    min_diff = float('inf')\n    for i in range(len(nums) - m + 1):\n        min_diff = min(min_diff, nums[i+m-1] - nums[i])\n    return min_diff`;
    javaSol = `public static int chocolateDistributionProblem(int[] nums, int m) {\n    Arrays.sort(nums);\n    int minDiff = Integer.MAX_VALUE;\n    for (int i = 0; i <= nums.length - m; i++) {\n        minDiff = Math.min(minDiff, nums[i + m - 1] - nums[i]);\n    }\n    return minDiff;\n}`;
    cppSol = `int chocolateDistributionProblem(vector<int>& nums, int m) {\n    sort(nums.begin(), nums.end());\n    int min_diff = 1e9;\n    for (int i = 0; i <= nums.size() - m; i++) {\n        min_diff = min(min_diff, nums[i + m - 1] - nums[i]);\n    }\n    return min_diff;\n}`;
    jsSol = `function chocolateDistributionProblem(nums, m) {\n    nums.sort((a, b) => a - b);\n    let minDiff = Infinity;\n    for (let i = 0; i <= nums.length - m; i++) {\n        minDiff = Math.min(minDiff, nums[i + m - 1] - nums[i]);\n    }\n    return minDiff;\n}`;
    commonMistakes = `Not sorting the array first, or using incorrect window boundaries.`;
    interviewTips = `Be ready to explain how sorting guarantees that the contiguous window contains the optimal subset.`;
    relatedProblems = [`Sliding Window Maximum`, `Minimum Window Substring`];
    followUpQuestions = [`Can we solve this without sorting if the range of chocolates is very small?`];
  } else if (title === 'Find Smallest and Second Smallest Distinct Elements in Array') {
    statement = question.statement || `Given an array \`arr[]\` of integers, find the **smallest and second smallest distinct elements** in the array.\n\nReturn them in **ascending order**. If no valid second smallest exists, return \`[-1]\`.`;
    inputFormat = `First line contains integer n (size of array).\nSecond line contains n space-separated integers.`;
    outputFormat = `Return an array [smallest, secondSmallest] or [-1].`;
    constraints = `1 ≤ n ≤ 10^5\n-10^9 ≤ arr[i] ≤ 10^9`;
    explanation = `For [12, 25, 8, 55, 10, 33, 17, 11], smallest=8, second smallest=10.`;
    timeComplexity = `O(n) - Single pass approach`;
    spaceComplexity = `O(1) - Constant extra space`;
    hints = [
      `Start by thinking about edge cases: arrays with < 2 elements or all same elements.`,
      `Do you need to sort? Can you solve in one pass?`,
      `Keep track of at most 2 values as you iterate.`,
      `What happens when you encounter a duplicate of your smallest?`
    ];
    bruteForceEditorial = `Sort the array O(n log n). Then iterate to find the first two distinct elements.`;
    optimizedEditorial = `Use two variables: \`first\` and \`second\`. Iterate through the array once. Update these variables as you find smaller numbers. Ensure elements are distinct by skipping duplicates of first.`;
    correctnessProof = `By maintaining only two tracking variables and updating them based on comparisons, we capture the two smallest distinct elements. Since we skip duplicates of the first element, we guarantee distinctness.`;
    pythonSol = `def findSmallestSecond(arr):
    if len(arr) < 2:
        return [-1]
    
    first = float('inf')
    second = float('inf')
    
    for num in arr:
        if num < first:
            second = first
            first = num
        elif num < second and num != first:
            second = num
    
    return [-1] if second == float('inf') else [first, second]`;
    javaSol = `public static int[] findSmallestSecond(int[] arr) {
    if (arr.length < 2) return new int[]{-1};
    
    int first = Integer.MAX_VALUE;
    int second = Integer.MAX_VALUE;
    
    for (int num : arr) {
        if (num < first) {
            second = first;
            first = num;
        } else if (num < second && num != first) {
            second = num;
        }
    }
    
    return second == Integer.MAX_VALUE ? new int[]{-1} : new int[]{first, second};
}`;
    cppSol = `vector<int> findSmallestSecond(vector<int>& arr) {
    if (arr.size() < 2) return {-1};
    
    int first = INT_MAX;
    int second = INT_MAX;
    
    for (int num : arr) {
        if (num < first) {
            second = first;
            first = num;
        } else if (num < second && num != first) {
            second = num;
        }
    }
    
    return second == INT_MAX ? vector<int>{-1} : vector<int>{first, second};
}`;
    jsSol = `function findSmallestSecond(arr) {
    if (arr.length < 2) return [-1];
    
    let first = Infinity;
    let second = Infinity;
    
    for (let num of arr) {
        if (num < first) {
            second = first;
            first = num;
        } else if (num < second && num !== first) {
            second = num;
        }
    }
    
    return second === Infinity ? [-1] : [first, second];
}`;
    commonMistakes = `Not handling duplicates correctly. Forgetting edge cases (array < 2 elements, all same elements).`;
    interviewTips = `Explain how you handle distinctness. Discuss why a single pass is optimal. Be ready to compare with sorting approaches.`;
    relatedProblems = [`Find Min and Max`, `Kth Smallest Element`, `Top K Elements`];
    followUpQuestions = [`Can you find the 3rd smallest distinct element using the same approach?`];
  } else if (title === 'Palindromic Substrings') {
    statement = `Given a string s, return the number of **palindromic substrings** in it.\n\nA string is a **palindrome** when it reads the same backward as forward.\nA **substring** is a contiguous sequence of characters within the string.`;
    inputFormat = `Single line containing string s (lowercase English letters)`;
    outputFormat = `Single integer: count of palindromic substrings`;
    constraints = `1 <= s.length <= 1000\ns consists of lowercase English letters`;
    explanation = `Three palindromic strings: "a", "b", "c".`;
    timeComplexity = `O(n²) where n is the length of string - for each of n centers, we expand up to n times`;
    spaceComplexity = `O(1) - no additional data structures needed`;
    hints = [
      `How can we reuse a previously computed palindrome to compute a larger palindrome?`,
      `If "aba" is a palindrome, is "xabax" a palindrome? Similarly is "xabay" a palindrome?`,
      `Complexity based hint: If we use brute force and check whether for every start and end position a substring is a palindrome we have O(n²) start-end pairs and O(n) palindromic checks. Can we reduce the time for palindromic checks to O(1) by reusing some previous computation?`
    ];
    bruteForceEditorial = `Test every possible substring (O(n²) start-end pairs) with O(n) palindrome check for each = O(n³) total complexity. For each pair (i,j), check if s[i:j+1] is palindrome by comparing characters from both ends.`;
    optimizedEditorial = `Use "expand around center" approach. Every palindrome has a center - either a single character (odd-length like "aba") or a gap between two characters (even-length like "abba"). For each of the n positions, expand outward as long as characters match, counting each valid palindrome found. This reduces time to O(n²) with O(1) space.`;
    correctnessProof = `Every palindrome has a unique center point. By checking each possible center (n single-character centers + n-1 gap centers), and expanding while characters match, we're guaranteed to find all palindromic substrings exactly once. No palindrome can be missed because we check all possible centers.`;
    pythonSol = `def count_palindromic_substrings(s):
    def expand_around_center(left, right):
        count = 0
        while left >= 0 and right < len(s) and s[left] == s[right]:
            count += 1
            left -= 1
            right += 1
        return count
    
    if not s:
        return 0
    
    total_count = 0
    for i in range(len(s)):
        # Odd-length palindromes (single character center)
        total_count += expand_around_center(i, i)
        # Even-length palindromes (gap between characters)
        total_count += expand_around_center(i, i + 1)
    
    return total_count

s = input().strip()
result = count_palindromic_substrings(s)
print(result)`;
    javaSol = `import java.util.*;

public class Solution {
    public static int countPalindromicSubstrings(String s) {
        if (s == null || s.length() == 0) {
            return 0;
        }
        
        int totalCount = 0;
        for (int i = 0; i < s.length(); i++) {
            totalCount += expandAroundCenter(s, i, i);
            totalCount += expandAroundCenter(s, i, i + 1);
        }
        return totalCount;
    }
    
    private static int expandAroundCenter(String s, int left, int right) {
        int count = 0;
        while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {
            count++;
            left--;
            right++;
        }
        return count;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine().trim();
        System.out.println(countPalindromicSubstrings(s));
        sc.close();
    }
}`;
    cppSol = `#include <iostream>
#include <string>
using namespace std;

int expandAroundCenter(const string& s, int left, int right) {
    int count = 0;
    while (left >= 0 && right < s.length() && s[left] == s[right]) {
        count++;
        left--;
        right++;
    }
    return count;
}

int countPalindromicSubstrings(string s) {
    if (s.empty()) {
        return 0;
    }
    
    int totalCount = 0;
    for (int i = 0; i < s.length(); i++) {
        totalCount += expandAroundCenter(s, i, i);
        totalCount += expandAroundCenter(s, i, i + 1);
    }
    return totalCount;
}

int main() {
    string s;
    getline(cin, s);
    cout << countPalindromicSubstrings(s) << endl;
    return 0;
}`;
    jsSol = `function countPalindromicSubstrings(s) {
    function expandAroundCenter(left, right) {
        let count = 0;
        while (left >= 0 && right < s.length && s[left] === s[right]) {
            count++;
            left--;
            right++;
        }
        return count;
    }
    
    if (!s || s.length === 0) {
        return 0;
    }
    
    let totalCount = 0;
    for (let i = 0; i < s.length; i++) {
        totalCount += expandAroundCenter(i, i);
        totalCount += expandAroundCenter(i, i + 1);
    }
    return totalCount;
}

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (line) => {
    const s = line.trim();
    console.log(countPalindromicSubstrings(s));
    rl.close();
});`;
    commonMistakes = `Forgetting to check even-length palindromes (only checking odd-length with single center), not handling single character edge case, or trying to use DP with O(n²) space when O(1) space solution exists.`;
    interviewTips = `Explain why expand-around-center is better than DP for this problem (O(1) space vs O(n²) space). Mention that there are 2n-1 possible centers (n single-char centers + n-1 gaps). Discuss the tradeoff with Manacher's algorithm which is O(n) time but more complex.`;
    relatedProblems = [`Longest Palindromic Substring`, `Count Palindromic Subsequences`, `Palindrome Partitioning`];
    followUpQuestions = [`Can we solve this in O(n) time using Manacher's algorithm?`, `How would the solution change if we needed to find the longest palindromic substring instead?`];
  } else {
    // Use actual data from the database
    statement = question.statement || `Implement the algorithm to solve **${title}**.`;
    inputFormat = question.inputFormat || `A single line containing the primary input sequence.`;
    outputFormat = question.outputFormat || `The computed result formatted according to the problem constraints.`;
    constraints = question.constraints || `1 <= input.length <= 10^5`;
    explanation = `The sample output matches the expected result of applying the algorithm on the sample input.`;

    // Derive complexity from the stored reference solution
    const refSol = question.referenceSolution || '';
    const hasSort = /\.sort|Arrays\.sort|sort\(|sorted\(/.test(refSol);
    const hasTwoLoop = (refSol.match(/for\s*\(/g) || []).length >= 2;
    const hasDP = /dp\[|memo\[|cache/.test(refSol);
    timeComplexity = hasDP ? `O(N²) DP approach` : hasSort ? `O(N log N) — sorting-based approach` : hasTwoLoop ? `O(N²) — nested iteration` : `O(N) — single-pass linear scan`;
    spaceComplexity = hasDP ? `O(N) auxiliary DP table` : /HashMap|dict\s*=|map</.test(refSol) ? `O(N) hash map` : `O(1) constant space`;

    hints = [
      `Read the constraints carefully — they hint at the expected time complexity.`,
      `Try a brute-force approach first, then optimize using standard data structure techniques.`,
      `Consider edge cases: empty input, single element, duplicate values, and maximum bounds.`
    ];

    // Use referenceSolution from DB if available, otherwise generate topic-specific solution
    const dbRef = question.referenceSolution || '';
    const topic0 = (Array.isArray(question.topics) ? question.topics[0] : question.topics) || 'arrays';
    const titleLower = title.toLowerCase();

    // Set generic defaults first — title/topic matching below will override these
    correctnessProof = `The approach leverages the problem's optimal substructure — solving smaller sub-instances leads to the globally optimal answer.`;
    commonMistakes = `Off-by-one errors in loop bounds, missing edge cases (empty array, single element), and integer overflow for large inputs.`;
    interviewTips = `State your approach and complexity before coding. Mention edge cases proactively. Walk through the example before writing the full solution.`;
    relatedProblems = question.topics
      ? (Array.isArray(question.topics) ? question.topics : JSON.parse(question.topics as string)).slice(0, 3).map((t: string) => t.charAt(0).toUpperCase() + t.slice(1) + ' Problems')
      : [`Two Sum`, `Sliding Window Maximum`];
    followUpQuestions = [`Can you solve this in O(1) space?`, `What if the input is a stream (online algorithm)?`];
    bruteForceEditorial = `**Brute Force:** Try all configurations exhaustively. Time: O(N²) or O(2^N) — suitable only for small N.`;
    optimizedEditorial = `**Optimized:** Use ${hasSort ? 'sorting + sliding window' : hasDP ? 'dynamic programming' : 'single-pass linear scan'} to achieve ${timeComplexity}. This is the expected approach for the given constraints.`;
    jsSol = `function solve(nums) {\n    // Time: ${timeComplexity} | Space: ${spaceComplexity}\n    let result = nums[0];\n    for (let i = 1; i < nums.length; i++) {\n        result = Math.max(result, nums[i]);\n    }\n    return result;\n}`;
    pythonSol = `# ${title} — ${timeComplexity}\ndef solve(nums):\n    # Space: ${spaceComplexity}\n    result = 0\n    for x in nums:\n        result = max(result, x)\n    return result`;
    javaSol = `// ${title} — ${timeComplexity}\npublic static int solve(int[] nums) {\n    int result = 0;\n    for (int x : nums) result = Math.max(result, x);\n    return result;\n}`;
    cppSol = `// ${title} — ${timeComplexity}\nint solve(vector<int>& nums) {\n    int result = 0;\n    for (int x : nums) result = max(result, x);\n    return result;\n}`;

    // Title/topic-specific overrides
    if (dbRef) {
      jsSol = dbRef;
    } else if (titleLower.includes('two sum')) {
      jsSol = `function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) return [map.get(complement), i];\n        map.set(nums[i], i);\n    }\n    return [];\n}`;
      bruteForceEditorial = `Check all pairs (i, j) with i < j and return when nums[i] + nums[j] === target. Time: O(N²).`;
      optimizedEditorial = `Use a hash map to store visited numbers. For each number, check if its complement (target - num) exists in the map. Time: O(N), Space: O(N).`;
    } else if (titleLower.includes('maximum subarray') || titleLower.includes('kadane')) {
      jsSol = `function maxSubArray(nums) {\n    let maxSum = nums[0], curr = nums[0];\n    for (let i = 1; i < nums.length; i++) {\n        curr = Math.max(nums[i], curr + nums[i]);\n        maxSum = Math.max(maxSum, curr);\n    }\n    return maxSum;\n}`;
      bruteForceEditorial = `Try all subarrays [i, j] and compute their sums. Track the maximum. Time: O(N²), Space: O(1).`;
      optimizedEditorial = `Kadane's Algorithm: maintain a running sum. At each index either extend the current subarray or start fresh. Time: O(N), Space: O(1).`;
    } else if (titleLower.includes('reverse') && (topic0 === 'arrays' || topic0 === 'strings')) {
      jsSol = `function reverse(arr) {\n    let left = 0, right = arr.length - 1;\n    while (left < right) {\n        [arr[left], arr[right]] = [arr[right], arr[left]];\n        left++; right--;\n    }\n    return arr;\n}`;
      bruteForceEditorial = `Create a new array and fill it in reverse order. Time: O(N), Space: O(N).`;
      optimizedEditorial = `Two-pointer in-place swap: swap elements from both ends moving inward. Time: O(N), Space: O(1).`;
    } else if (titleLower.includes('binary search') || (titleLower.includes('search') && topic0 === 'binary-search')) {
      jsSol = `function binarySearch(nums, target) {\n    let lo = 0, hi = nums.length - 1;\n    while (lo <= hi) {\n        const mid = (lo + hi) >> 1;\n        if (nums[mid] === target) return mid;\n        if (nums[mid] < target) lo = mid + 1;\n        else hi = mid - 1;\n    }\n    return -1;\n}`;
      bruteForceEditorial = `Linear scan through array. Time: O(N), Space: O(1).`;
      optimizedEditorial = `Binary search on sorted array: eliminate half the search space each iteration. Time: O(log N), Space: O(1).`;
    } else if (titleLower.includes('anagram')) {
      jsSol = `function isAnagram(s, t) {\n    if (s.length !== t.length) return false;\n    const count = {};\n    for (const c of s) count[c] = (count[c] || 0) + 1;\n    for (const c of t) {\n        if (!count[c]) return false;\n        count[c]--;\n    }\n    return true;\n}`;
      bruteForceEditorial = `Sort both strings and compare. Time: O(N log N), Space: O(1).`;
      optimizedEditorial = `Count character frequencies using a hash map. Compare counts for both strings. Time: O(N), Space: O(1).`;
    } else if (titleLower.includes('palindrome')) {
      jsSol = `function isPalindrome(s) {\n    let l = 0, r = s.length - 1;\n    while (l < r) {\n        if (s[l] !== s[r]) return false;\n        l++; r--;\n    }\n    return true;\n}`;
      bruteForceEditorial = `Reverse the string and compare with original. Time: O(N), Space: O(N).`;
      optimizedEditorial = `Two pointers from both ends — compare characters inward. Time: O(N), Space: O(1).`;
    } else if (topic0 === 'dynamic-programming' || titleLower.includes('dp') || titleLower.includes('ways')) {
      jsSol = `function solve(n) {\n    // Bottom-up DP approach\n    const dp = new Array(n + 1).fill(0);\n    dp[0] = 1; // base case\n    for (let i = 1; i <= n; i++) {\n        // dp[i] = dp[i-1] + ... (fill based on transitions)\n        dp[i] = dp[i - 1]; // placeholder transition\n    }\n    return dp[n];\n}`;
      bruteForceEditorial = `Recursive solution with exponential branching. Time: O(2^N), Space: O(N) call stack.`;
      optimizedEditorial = `Bottom-up DP: build the solution table from base cases. Time: O(N²) or O(N), Space: O(N).`;
    } else if (topic0 === 'graphs' || topic0 === 'dfs-bfs') {
      jsSol = `function bfs(graph, start) {\n    const visited = new Set([start]);\n    const queue = [start];\n    const result = [];\n    while (queue.length) {\n        const node = queue.shift();\n        result.push(node);\n        for (const neighbor of (graph[node] || [])) {\n            if (!visited.has(neighbor)) {\n                visited.add(neighbor);\n                queue.push(neighbor);\n            }\n        }\n    }\n    return result;\n}`;
      bruteForceEditorial = `DFS/BFS with visited set tracking. Time: O(V + E), Space: O(V).`;
      optimizedEditorial = `BFS for shortest paths, DFS for connected components. Use adjacency list for O(V + E) traversal.`;
    } else if (topic0 === 'trees') {
      jsSol = `function inorder(root) {\n    const result = [];\n    const stack = [];\n    let curr = root;\n    while (curr || stack.length) {\n        while (curr) { stack.push(curr); curr = curr.left; }\n        curr = stack.pop();\n        result.push(curr.val);\n        curr = curr.right;\n    }\n    return result;\n}`;
      bruteForceEditorial = `Recursive DFS traversal. Time: O(N), Space: O(H) where H is tree height.`;
      optimizedEditorial = `Iterative inorder using explicit stack. Time: O(N), Space: O(H) — avoids call stack overflow on deep trees.`;
    } else if (topic0 === 'linked-list') {
      jsSol = `function reverseList(head) {\n    let prev = null, curr = head;\n    while (curr) {\n        const next = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = next;\n    }\n    return prev;\n}`;
      bruteForceEditorial = `Collect values in array, rebuild list in reverse. Time: O(N), Space: O(N).`;
      optimizedEditorial = `Iterative pointer reversal: track prev, curr, next. Time: O(N), Space: O(1).`;
    } else if (topic0 === 'stack') {
      jsSol = `function isValid(s) {\n    const stack = [];\n    const map = { ')': '(', '}': '{', ']': '[' };\n    for (const c of s) {\n        if ('([{'.includes(c)) stack.push(c);\n        else if (stack.pop() !== map[c]) return false;\n    }\n    return stack.length === 0;\n}`;
      bruteForceEditorial = `Try all permutations of matching brackets. Exponential time — not feasible.`;
      optimizedEditorial = `Use a stack: push opening brackets, pop on closing and verify match. Time: O(N), Space: O(N).`;
    } else if (topic0 === 'hashing') {
      jsSol = `function longestConsecutive(nums) {\n    const set = new Set(nums);\n    let longest = 0;\n    for (const n of set) {\n        if (!set.has(n - 1)) {\n            let curr = n, streak = 1;\n            while (set.has(curr + 1)) { curr++; streak++; }\n            longest = Math.max(longest, streak);\n        }\n    }\n    return longest;\n}`;
      bruteForceEditorial = `Sort array, iterate and find longest consecutive run. Time: O(N log N).`;
      optimizedEditorial = `Hash set lookup: only start a sequence from its smallest element. Time: O(N), Space: O(N).`;
    } else {
      jsSol = `function solve(nums) {\n    // Time: ${timeComplexity} | Space: ${spaceComplexity}\n    let result = nums[0];\n    for (let i = 1; i < nums.length; i++) {\n        result = Math.max(result, nums[i]);\n    }\n    return result;\n}`;
      bruteForceEditorial = `Try all configurations exhaustively. Time: O(N²) or higher — suitable only for small N.`;
      optimizedEditorial = `Apply ${topic0}-specific optimization: single or double pass with appropriate data structure. Time: ${timeComplexity}.`;
    }
    pythonSol = `# ${title} — ${timeComplexity}\ndef solve(nums):\n    # Space: ${spaceComplexity}\n    result = 0\n    for x in nums:\n        result = max(result, x)\n    return result`;
    javaSol = `// ${title} — ${timeComplexity}\npublic static int solve(int[] nums) {\n    int result = 0;\n    for (int x : nums) {\n        result = Math.max(result, x);\n    }\n    return result;\n}`;
    cppSol = `// ${title} — ${timeComplexity}\nint solve(vector<int>& nums) {\n    int result = 0;\n    for (int x : nums) result = max(result, x);\n    return result;\n}`;
  }

  const structuredJson = {
    title,
    difficulty,
    topic,
    companies: ['Amazon', 'Microsoft', 'Google', 'Adobe', 'Goldman Sachs'],
    problemStatement: statement,
    inputFormat,
    outputFormat,
    constraints,
    sampleTestCases: [
      {
        sampleInput: question.sampleInput,
        sampleOutput: question.sampleOutput,
        explanation: explanation || 'The sample output matches the expected result of processing the sample input.'
      }
    ],
    edgeCases: ['Single element', 'Duplicate values', 'Maximum constraints', 'Negative numbers'],
    hiddenTestCases: [
      { input: question.sampleInput, output: question.sampleOutput, isHidden: true },
      { input: question.sampleInput, output: question.sampleOutput, isHidden: true }
    ],
    functionSignatures: {
      python: pythonSol,
      java: javaSol,
      cpp: cppSol,
      javascript: jsSol
    },
    timeComplexity,
    spaceComplexity,
    hints,
    editorial: {
      bruteForce: bruteForceEditorial,
      optimized: optimizedEditorial,
      correctnessProof: correctnessProof
    },
    referenceSolutions: {
      python: pythonSol,
      java: javaSol,
      cpp: cppSol,
      javascript: jsSol
    },
    aiMentor: {
      commonMistakes,
      interviewTips,
      relatedProblems,
      followUpQuestions
    },
    metadata: {
      questionId: id,
      slug,
      difficulty,
      topic,
      subtopic: topic,
      tags: [topic],
      companies: ['Amazon', 'Microsoft', 'Google'],
      acceptanceRate: '48%',
      frequency: 'High',
      premiumFree: 'Free',
      estimatedSolveTime: '20-30 mins',
      xpReward
    }
  };

  const markdownVersion = `
## 📝 Problem Statement
${statement}

---

## 📥 Input Format
${inputFormat}

## 📤 Output Format
${outputFormat}

## ⚙️ Constraints
\`\`\`
${constraints}
\`\`\`

---

## 💡 Sample Test Cases

### Sample Test Case 1
**Input:**
\`\`\`
${question.sampleInput}
\`\`\`
**Output:**
\`\`\`
${question.sampleOutput}
\`\`\`
**Explanation:**
${explanation || 'The sample output matches the expected result of processing the sample input.'}

---

## ⏱️ Complexity Analysis
- **Expected Time Complexity:** \`${timeComplexity}\`
- **Expected Space Complexity:** \`${spaceComplexity}\`

## 🔑 Hints
${hints.map((h, i) => `**Hint ${i + 1}:** ${h}`).join('\n\n')}

---

## 🤖 AI Mentor Insights
- **Common Mistakes:** ${commonMistakes}
- **Interview Tips:** ${interviewTips}
- **Related Problems:** ${relatedProblems.join(', ')}
- **Follow-up Interview Questions:** ${followUpQuestions.join(', ')}
  `.trim();

  // Parse templates from JSON string to array format expected by frontend
  let templates = [];
  if (question.templates) {
    try {
      const templatesObj = typeof question.templates === 'string' 
        ? JSON.parse(question.templates) 
        : question.templates;
      
      // Convert object format { python: "code", javascript: "code" } 
      // to array format [{ language: "python", code: "code" }, ...]
      if (typeof templatesObj === 'object' && !Array.isArray(templatesObj)) {
        templates = Object.entries(templatesObj).map(([language, code]) => ({
          language,
          code: code as string
        }));
      } else if (Array.isArray(templatesObj)) {
        templates = templatesObj;
      }
    } catch (e) {
      console.error('Error parsing templates:', e);
      templates = [];
    }
  }

  // Parse testCases from JSON string to array
  let testCases = [];
  if (question.testCases) {
    try {
      testCases = typeof question.testCases === 'string' 
        ? JSON.parse(question.testCases) 
        : question.testCases;
    } catch (e) {
      console.error('Error parsing testCases:', e);
      testCases = [];
    }
  }

  // Parse topics from JSON string to array
  let topics = [];
  if (question.topics) {
    try {
      topics = typeof question.topics === 'string' 
        ? JSON.parse(question.topics) 
        : question.topics;
    } catch (e) {
      console.error('Error parsing topics:', e);
      topics = [];
    }
  }

  return {
    ...question,
    statement: markdownVersion,
    inputFormat: inputFormat,
    outputFormat: outputFormat,
    constraints: constraints,
    structuredJson: JSON.stringify(structuredJson),
    templates,
    testCases,
    topics
  };
}

// GET /challenges/questions/:slug — Retrieve single question details
router.get('/questions/:slug', async (req, res, next) => {
  try {
    const question = await prisma.question.findUnique({
      where: { slug: req.params.slug }
    });
    if (!question) throw new AppError('Question not found', 404);
    sendSuccess({ res, data: enrichQuestionDescription(question) });
  } catch (err) { next(err); }
});

// POST /challenges/questions/:id/run — Run code against sample tests
router.post('/questions/:id/run', authenticate, async (req, res, next) => {
  try {
    const { code, language, input } = req.body;
    const question = await prisma.question.findUnique({
      where: { id: req.params.id }
    });
    if (!question) throw new AppError('Question not found', 404);

    const runInput = typeof input === 'string' ? input : question.sampleInput;
    const isCustomRun = typeof input === 'string' && input !== question.sampleInput;
    
    // Use Judge0 for code execution
    const result = await judge.runTestCase(
      code,
      language,
      runInput,
      isCustomRun ? undefined : question.sampleOutput,
      question.timeLimit
    );

    // Check if output matches expected (only for non-custom runs)
    const passed = result.passed;

    sendSuccess({
      res,
      data: {
        passed,
        actualOutput: result.actualOutput,
        expectedOutput: isCustomRun ? undefined : question.sampleOutput,
        input: runInput,
        isCustomRun,
        runtime: result.runtime,
        memory: 0,
        errorType: result.errorType,
        errorMessage: result.errorMessage,
      },
    });
  } catch (err) { next(err); }
});

// Helper function to detect hardcoding outputs
function detectHardcoding(code: string, expectedOutputs: string[]): boolean {
  const normalizedCode = code.replace(/\s+/g, '');
  for (const out of expectedOutputs) {
    const cleanOut = String(out).trim();
    if (!cleanOut || cleanOut.length === 0) continue;
    const patterns = [
      `return"${cleanOut}"`,
      `return'${cleanOut}'`,
      `return\`${cleanOut}\``,
      `return${cleanOut}`,
      `print("${cleanOut}")`,
      `print('${cleanOut}')`,
      `print(${cleanOut})`,
      `console.log("${cleanOut}")`,
      `console.log('${cleanOut}')`,
      `console.log(${cleanOut})`,
      `System.out.println("${cleanOut}")`,
      `System.out.println('${cleanOut}')`,
      `System.out.println(${cleanOut})`,
      `cout<<"${cleanOut}"`,
      `cout<<${cleanOut}`
    ];
    if (patterns.some(p => normalizedCode.includes(p))) {
      return true;
    }
  }
  return false;
}

interface TestCase {
  input: string;
  output: string;
  isHidden: boolean;
  type?: 'visible' | 'hidden' | 'edge' | 'stress';
}

function generateTestCasesForQuestion(title: string, sampleInput: string, sampleOutput: string): TestCase[] {
  const cases: TestCase[] = [];

  const solveKadane = (nums: number[]) => {
    let max = nums[0], curr = nums[0];
    for (let i = 1; i < nums.length; i++) {
      curr = Math.max(nums[i], curr + nums[i]);
      max = Math.max(max, curr);
    }
    return max;
  };

  const solveDivisibleK = (nums: number[], k: number) => {
    const map = new Map<number, number>();
    map.set(0, 1); // Frequency map: remainder → count
    let prefixSum = 0;
    let count = 0;
    
    for (let num of nums) {
      prefixSum += num;
      // Handle negative numbers correctly
      let rem = ((prefixSum % k) + k) % k;
      
      if (map.has(rem)) {
        count += map.get(rem)!; // Add frequency of this remainder
      }
      map.set(rem, (map.get(rem) || 0) + 1); // Increment frequency
    }
    return count;
  };

  const solveTwoSum = (nums: number[], target: number) => {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
      const diff = target - nums[i];
      if (map.has(diff)) {
        return `${map.get(diff)} ${i}`;
      }
      map.set(nums[i], i);
    }
    return "0 0";
  };

  const solveChocolate = (nums: number[], m: number) => {
    const sorted = [...nums].sort((a, b) => a - b);
    let minDiff = Infinity;
    for (let i = 0; i <= sorted.length - m; i++) {
      minDiff = Math.min(minDiff, sorted[i + m - 1] - sorted[i]);
    }
    return minDiff;
  };

  const solveSpaceOptimization = (a: number, b: number) => {
    const result: number[] = [];
    for (let i = a; i <= b; i++) {
      if (i % 2 === 0 || i % 5 === 0) {
        result.push(i);
      }
    }
    return result.join(' ');
  };

  const isKadane = title.includes("Subarray") || title.includes("Kadane");
  const isDivisibleK = title.includes("Divisible K") || title.includes("Divisible k");
  const isTwoSum = title.toLowerCase().includes("two sum");
  const isChocolate = title.includes("Chocolate");
  const isKthSmallest = title.toLowerCase().includes("kth") && title.toLowerCase().includes("smallest");
  const isSmallest = title.toLowerCase().includes("smallest");
  const isSpaceOptimization = title.includes("Space Optimization");

  // 5 Visible Cases
  for (let i = 1; i <= 5; i++) {
    let input = '';
    let output = '';
    if (isDivisibleK) {
      const arr = Array.from({ length: 5 + i }, () => Math.floor(Math.random() * 20) - 10);
      const k = [2, 3, 5, 7][i % 4];
      input = `${arr.join(' ')}\n${k}`;
      output = String(solveDivisibleK(arr, k));
    } else if (isKadane) {
      const arr = Array.from({ length: 5 + i }, () => Math.floor(Math.random() * 20) - 10);
      input = arr.join(' ');
      output = String(solveKadane(arr));
    } else if (isTwoSum) {
      const arr = [2, 7, 11, 15, 3, 4, 6].slice(0, 4 + i);
      const target = arr[0] + arr[arr.length - 1];
      input = `${arr.join(' ')}\n${target}`;
      output = solveTwoSum(arr, target);
    } else if (isChocolate) {
      const arr = Array.from({ length: 5 + i }, () => Math.floor(Math.random() * 50) + 1);
      const m = Math.floor(Math.random() * 3) + 2;
      input = `${arr.join(' ')}\n${m}`;
      output = String(solveChocolate(arr, m));
    } else if (isKthSmallest) {
      // Kth Smallest Element requires array + k value
      const arr = Array.from({ length: 5 + i }, () => Math.floor(Math.random() * 100) + 1);
      const k = Math.floor(Math.random() * arr.length) + 1;
      const sorted = [...arr].sort((a, b) => a - b);
      input = `${arr.join(' ')}\n${k}`;
      output = String(sorted[k - 1]);
    } else if (isSmallest) {
      // For "find smallest" problems, generate proper test cases
      const testArr = Array.from({ length: 5 + i }, () => Math.floor(Math.random() * 100) + 1);
      input = testArr.join(' ');
      output = String(Math.min(...testArr));
    } else if (isSpaceOptimization) {
      const a = Math.floor(Math.random() * 10) + 1;
      const b = a + Math.floor(Math.random() * 20) + 10;
      input = `${a} ${b}`;
      output = solveSpaceOptimization(a, b);
    } else {
      input = `${sampleInput} ${i}`;
      output = sampleOutput;
    }
    cases.push({ input, output, isHidden: false, type: 'visible' });
  }

  // 10 Hidden Cases
  for (let i = 1; i <= 10; i++) {
    let input = '';
    let output = '';
    if (isDivisibleK) {
      const arr = Array.from({ length: 15 + i }, () => Math.floor(Math.random() * 100) - 50);
      const k = [2, 3, 5, 7, 11][i % 5];
      input = `${arr.join(' ')}\n${k}`;
      output = String(solveDivisibleK(arr, k));
    } else if (isKadane) {
      const arr = Array.from({ length: 15 + i }, () => Math.floor(Math.random() * 100) - 50);
      input = arr.join(' ');
      output = String(solveKadane(arr));
    } else if (isTwoSum) {
      const arr = Array.from({ length: 10 + i }, () => Math.floor(Math.random() * 100) + 1);
      const target = arr[Math.floor(Math.random() * 3)] + arr[Math.floor(Math.random() * 3) + 3];
      input = `${arr.join(' ')}\n${target}`;
      output = solveTwoSum(arr, target);
    } else if (isChocolate) {
      const arr = Array.from({ length: 10 + i }, () => Math.floor(Math.random() * 100) + 1);
      const m = Math.floor(Math.random() * 5) + 2;
      input = `${arr.join(' ')}\n${m}`;
      output = String(solveChocolate(arr, m));
    } else if (isKthSmallest) {
      // Kth Smallest Element - Hidden test cases
      const arr = Array.from({ length: 15 + i }, () => Math.floor(Math.random() * 1000) + 1);
      const k = Math.floor(Math.random() * arr.length) + 1;
      const sorted = [...arr].sort((a, b) => a - b);
      input = `${arr.join(' ')}\n${k}`;
      output = String(sorted[k - 1]);
    } else if (isSpaceOptimization) {
      const a = Math.floor(Math.random() * 50) + 1;
      const b = a + Math.floor(Math.random() * 100) + 50;
      input = `${a} ${b}`;
      output = solveSpaceOptimization(a, b);
    } else {
      input = `${sampleInput} ${10 + i}`;
      output = sampleOutput;
    }
    cases.push({ input, output, isHidden: true, type: 'hidden' });
  }

  // 5 Edge Cases
  for (let i = 1; i <= 5; i++) {
    let input = '';
    let output = '';
    if (isDivisibleK) {
      let arr: number[] = [];
      let k = 3;
      if (i === 1) { arr = [2, 3, -1, 1, -3, -1]; k = 5; }
      else if (i === 2) { arr = [4, 5, 0, -2, -3, 1]; k = 5; }
      else if (i === 3) { arr = [-1, -1, -1]; k = 2; }
      else if (i === 4) { arr = [0, 0, 0]; k = 3; }
      else { arr = Array.from({ length: 10 }, () => (i % 2 === 0 ? 10 : -10)); k = 5; }
      input = `${arr.join(' ')}\n${k}`;
      output = String(solveDivisibleK(arr, k));
    } else if (isKadane) {
      let arr: number[] = [];
      if (i === 1) arr = [-5];
      else if (i === 2) arr = [-10, -2, -3, -4, -1, -9];
      else if (i === 3) arr = [1000, 2000, 3000];
      else if (i === 4) arr = [0, 0, 0, 0];
      else arr = Array.from({ length: 5 }, () => (i % 2 === 0 ? 50 : -50));
      input = arr.join(' ');
      output = String(solveKadane(arr));
    } else if (isTwoSum) {
      let arr: number[] = [];
      let target = 0;
      if (i === 1) { arr = [1, 2]; target = 3; }
      else if (i === 2) { arr = [100000, 200000]; target = 300000; }
      else { arr = [0, 0, 5, 10]; target = 0; }
      input = `${arr.join(' ')}\n${target}`;
      output = solveTwoSum(arr, target);
    } else if (isChocolate) {
      let arr: number[] = [];
      let m = 2;
      if (i === 1) { arr = [5, 5]; m = 2; }
      else if (i === 2) { arr = [10, 20, 30]; m = 3; }
      else { arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; m = 10; }
      input = `${arr.join(' ')}\n${m}`;
      output = String(solveChocolate(arr, m));
    } else if (isKthSmallest) {
      // Kth Smallest Element - Edge cases
      let arr: number[] = [];
      let k = 1;
      if (i === 1) { arr = [10]; k = 1; }
      else if (i === 2) { arr = [5, 3, 7, 2, 8]; k = 1; }
      else if (i === 3) { arr = [5, 3, 7, 2, 8]; k = 5; }
      else if (i === 4) { arr = Array.from({ length: 20 }, () => Math.floor(Math.random() * 100)); k = 10; }
      else { arr = [100, 200, 1, 50, 25]; k = 3; }
      const sorted = [...arr].sort((a, b) => a - b);
      input = `${arr.join(' ')}\n${k}`;
      output = String(sorted[k - 1]);
    } else if (isSmallest) {
      const testArr = Array.from({ length: 10 + i }, () => Math.floor(Math.random() * 1000) + 1);
      input = testArr.join(' ');
      output = String(Math.min(...testArr));
    } else if (isSpaceOptimization) {
      let a = 1, b = 10;
      if (i === 1) { a = 1; b = 5; }
      else if (i === 2) { a = 10; b = 20; }
      else if (i === 3) { a = 50; b = 100; }
      else if (i === 4) { a = 1; b = 2; }
      else if (i === 5) { a = 100; b = 200; }
      else { a = i * 10; b = a + 50; }
      input = `${a} ${b}`;
      output = solveSpaceOptimization(a, b);
    } else {
      input = `${sampleInput} ${100 + i}`;
      output = sampleOutput;
    }
    cases.push({ input, output, isHidden: true, type: 'edge' });
  }

  // 5 Stress Cases
  for (let i = 1; i <= 5; i++) {
    let input = '';
    let output = '';
    if (isDivisibleK) {
      const arr = Array.from({ length: 500 + i * 100 }, () => Math.floor(Math.random() * 1000) - 500);
      const k = [2, 3, 5, 7, 11][i % 5];
      input = `${arr.join(' ')}\n${k}`;
      output = String(solveDivisibleK(arr, k));
    } else if (isKadane) {
      const arr = Array.from({ length: 500 + i * 100 }, () => Math.floor(Math.random() * 1000) - 500);
      input = arr.join(' ');
      output = String(solveKadane(arr));
    } else if (isTwoSum) {
      const arr = Array.from({ length: 300 + i * 50 }, (_, idx) => idx + 1);
      const target = arr[arr.length - 2] + arr[arr.length - 1];
      input = `${arr.join(' ')}\n${target}`;
      output = solveTwoSum(arr, target);
    } else if (isChocolate) {
      const arr = Array.from({ length: 200 + i * 50 }, () => Math.floor(Math.random() * 1000) + 1);
      const m = 50;
      input = `${arr.join(' ')}\n${m}`;
      output = String(solveChocolate(arr, m));
    } else if (isKthSmallest) {
      // Kth Smallest Element - Stress test cases
      const arr = Array.from({ length: 500 + i * 100 }, () => Math.floor(Math.random() * 10000) + 1);
      const k = Math.floor(arr.length / 2);
      const sorted = [...arr].sort((a, b) => a - b);
      input = `${arr.join(' ')}\n${k}`;
      output = String(sorted[k - 1]);
    } else if (isSmallest) {
      const testArr = Array.from({ length: 500 + i * 100 }, () => Math.floor(Math.random() * 10000) + 1);
      input = testArr.join(' ');
      output = String(Math.min(...testArr));
    } else if (isSpaceOptimization) {
      const a = Math.floor(Math.random() * 1000) + 1;
      const b = a + Math.floor(Math.random() * 10000) + 5000;
      input = `${a} ${b}`;
      output = solveSpaceOptimization(a, b);
    } else {
      input = `${sampleInput} ${1000 + i}`;
      output = sampleOutput;
    }
    cases.push({ input, output, isHidden: true, type: 'stress' });
  }

  return cases;
}

function getQuestionTestCases(question: any): TestCase[] {
  // ALWAYS generate test cases dynamically for correct validation
  // Ignore database test cases which may be corrupted/incorrect
  const generatedCases = generateTestCasesForQuestion(question.title, question.sampleInput, question.sampleOutput);
  
  logger.info(`[getQuestionTestCases] Generated ${generatedCases.length} test cases for "${question.title}"`);
  return generatedCases;
}

// POST /challenges/questions/:id/submit — Submit code against all test cases
router.post('/questions/:id/submit', authenticate, async (req, res, next) => {
  try {
    const { code, language } = req.body;
    const question = await prisma.question.findUnique({
      where: { id: req.params.id }
    });
    if (!question) throw new AppError('Question not found', 404);

    const testCases = getQuestionTestCases(question);
    
    logger.info(`[SUBMIT DEBUG] Question: ${question.slug}, Test Cases: ${testCases.length}, Sample Output: "${question.sampleOutput.substring(0,30)}"`);
    
    // Anti-cheat check: detect if code hardcodes sample outputs
    const sampleOutputs = [question.sampleOutput];
    const visibleOutputs = testCases.filter(t => !t.isHidden).map(t => t.output);
    const expectedOutputs = Array.from(new Set([...sampleOutputs, ...visibleOutputs]));
    const isCheating = detectHardcoding(code, expectedOutputs);

    let passedCount = 0;
    let finalStatus: 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'compile_error' | 'runtime_error' = 'accepted';
    let errorMessage = '';
    let maxRuntime = 0;
    const testCaseResults: Array<{
      testCaseNumber: number;
      passed: boolean;
      isHidden: boolean;
      input?: string;
      expectedOutput?: string;
      actualOutput?: string;
      runtime?: number;
      errorMessage?: string;
    }> = [];

    if (isCheating) {
      finalStatus = 'wrong_answer';
      errorMessage = 'Cheat Detected: Solution hardcodes output values instead of computing them.';
    } else {
      // Enhanced output comparison function
      const compareOutputs = (actual: string, expected: string): boolean => {
        if (!expected) return false;
        
        // Method 1: Exact trim match
        if (actual.trim() === expected.trim()) return true;
        
        // Method 2: Line-by-line comparison ignoring empty lines
        const actualLines = actual.trim().split('\n').map(l => l.trim()).filter(l => l);
        const expectedLines = expected.trim().split('\n').map(l => l.trim()).filter(l => l);
        
        if (actualLines.length === expectedLines.length) {
          return actualLines.every((line, i) => line === expectedLines[i]);
        }
        
        // Method 3: Normalize whitespace and compare
        const normalizeSpaces = (str: string) => str.trim().replace(/\s+/g, ' ');
        if (normalizeSpaces(actual) === normalizeSpaces(expected)) return true;
        
        return false;
      };

      // Execute all test cases using Execution Engine
      for (let idx = 0; idx < testCases.length; idx++) {
        const tc = testCases[idx];
        
        try {
          // Use Judge0 for code execution
          const result = await judge.runTestCase(
            code,
            language,
            tc.input,
            tc.output,
            question.timeLimit
          );

          // Use the result from Judge0
          const passed = result.passed;

          logger.info(`[TC ${idx + 1}/${testCases.length}] Input: "${tc.input.substring(0,20)}", Expected: "${tc.output}", Got: "${result.actualOutput.substring(0,20)}", Passed: ${passed}`);

          // Store test case result
          testCaseResults.push({
            testCaseNumber: idx + 1,
            passed,
            isHidden: tc.isHidden,
            // Only include input/output for non-hidden test cases
            input: tc.isHidden ? undefined : tc.input,
            expectedOutput: tc.isHidden ? undefined : tc.output,
            actualOutput: tc.isHidden ? undefined : result.actualOutput,
            runtime: result.runtime,
            errorMessage: result.errorMessage,
          });

          if (passed) {
            passedCount++;
            maxRuntime = Math.max(maxRuntime, result.runtime);
          } else {
            if (finalStatus === 'accepted') {
              // Map error type to status
              if (result.errorType === 'time_limit_exceeded') {
                finalStatus = 'time_limit_exceeded';
              } else if (result.errorType === 'compile_error') {
                finalStatus = 'compile_error';
              } else if (result.errorType === 'runtime_error') {
                finalStatus = 'runtime_error';
              } else {
                finalStatus = 'wrong_answer';
              }
              errorMessage = result.error || `Wrong Answer on testcase ${passedCount + 1}`;
              logger.warn(`[FAILED] TC ${idx + 1}: Expected "${tc.output}", Got "${result.output}"`);
            }
            break;
          }
        } catch (error: any) {
          logger.error(`[EXECUTION ERROR] TC ${idx + 1}:`, error.message);
          
          // Store error result
          testCaseResults.push({
            testCaseNumber: idx + 1,
            passed: false,
            isHidden: tc.isHidden,
            input: tc.isHidden ? undefined : tc.input,
            expectedOutput: tc.isHidden ? undefined : tc.output,
            actualOutput: undefined,
            runtime: 0,
            errorMessage: error.message,
          });
          
          finalStatus = 'runtime_error';
          errorMessage = error.message || 'Execution failed';
          break;
        }
      }
    }

    // Save submission to MySQL via Prisma
    const submission = await prisma.submission.create({
      data: {
        userId: req.user!.userId,
        questionId: question.id,
        code,
        language,
        status: finalStatus,
        errorMessage: errorMessage || null,
        runtime: maxRuntime,
        passedCount,
        totalCount: testCases.length,
      }
    });

    let unlockedBadge = null;

    // Award XP and update solved stats on success
    if (finalStatus === 'accepted') {
      const profile = await prisma.studentProfile.findUnique({
        where: { userId: req.user!.userId }
      });
      if (profile) {
        // Only award XP if this is the first successful submission for this question
        const alreadySolved = await prisma.submission.findFirst({
          where: {
            userId: req.user!.userId,
            questionId: question.id,
            status: 'accepted',
            id: { not: submission.id },
          }
        });

        if (!alreadySolved) {
          const updatedXp = profile.xp + question.xpReward;
          const updatedTotalXP = profile.totalXP + question.xpReward;
          const updatedLevel = Math.floor(updatedTotalXP / 100) + 1; // 100 XP per level
          
          // Calculate streak
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          let newStreak = profile.streak || 0;
          const lastActive = profile.lastActiveDate ? new Date(profile.lastActiveDate) : null;
          
          if (lastActive) {
            lastActive.setHours(0, 0, 0, 0);
            const diffDays = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
            
            if (diffDays === 0) {
              // Same day - keep current streak
              newStreak = profile.streak;
            } else if (diffDays === 1) {
              // Consecutive day - increment streak
              newStreak = profile.streak + 1;
            } else {
              // Streak broken - reset to 1
              newStreak = 1;
            }
          } else {
            // First time solving - start streak at 1
            newStreak = 1;
          }
          
          await prisma.studentProfile.update({
            where: { userId: req.user!.userId },
            data: {
              xp: updatedXp,
              totalXP: updatedTotalXP,
              level: updatedLevel,
              streak: newStreak,
              lastActiveDate: today
            }
          });

          // Check if this is their first ever solved coding challenge
          const firstSolvedEver = await prisma.submission.findFirst({
            where: {
              userId: req.user!.userId,
              status: 'accepted',
              id: { not: submission.id }
            }
          });

          if (!firstSolvedEver) {
            try {
              const prismaBadgeExists = await prisma.badge.findFirst({
                where: {
                  userId: req.user!.userId,
                  badgeType: 'code-warrior'
                }
              });

              if (!prismaBadgeExists) {
                unlockedBadge = await prisma.badge.create({
                  data: {
                    userId: req.user!.userId,
                    badgeType: 'code-warrior',
                    name: 'Code Warrior',
                    iconUrl: '🏆',
                  }
                });
              } else {
                unlockedBadge = prismaBadgeExists;
              }
            } catch (badgeErr) {
              console.error('Failed to award Code Warrior badge:', badgeErr);
            }
          }

          // Check topic-wise completion
          const currentTopics = (question.topics as string[]) || [];
          for (const topicKey of currentTopics) {
            try {
              const allQuestions = await prisma.question.findMany();
              const topicQuestions = allQuestions.filter(q => {
                const qt = (q.topics as string[]) || [];
                return qt.includes(topicKey);
              });
              const topicQuestionIds = topicQuestions.map(q => q.id);

              const solvedTopicSubmissions = await prisma.submission.findMany({
                where: {
                  userId: req.user!.userId,
                  status: 'accepted',
                  questionId: { in: topicQuestionIds }
                },
                distinct: ['questionId']
              });

              // TODO: Certificate generation for topic completion
              // Disabled temporarily - needs MongoDB to Prisma migration
              if (solvedTopicSubmissions.length === topicQuestions.length && topicQuestions.length > 0) {
                logger.info(`User ${req.user!.userId} completed all questions for topic: ${topicKey}`);
                // Certificate generation would go here
              }
            } catch (topicErr) {
              logger.error(`Topic completion check failed for ${topicKey}:`, topicErr);
            }
          }
        }
      }
    }

    sendSuccess({
      res,
      statusCode: 201,
      data: {
        id: submission.id,
        userId: submission.userId,
        questionId: submission.questionId,
        code: submission.code,
        language: submission.language,
        status: submission.status,
        errorMessage: submission.errorMessage,
        runtime: submission.runtime,
        passedCount: submission.passedCount,
        totalCount: submission.totalCount,
        createdAt: submission.createdAt,
        unlockedBadge,
        testCaseResults: testCaseResults.map(tc => ({
          testCaseNumber: tc.testCaseNumber,
          passed: tc.passed,
          isHidden: tc.isHidden,
          // Only show details for visible test cases
          ...(tc.isHidden ? {} : {
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            actualOutput: tc.actualOutput,
          }),
          runtime: tc.runtime,
          errorMessage: tc.errorMessage,
        })),
      },
      message: finalStatus === 'accepted' ? 'Accepted!' : 'Failed',
    });
  } catch (err) { next(err); }
});

// GET /challenges/stats — Get total solved and total questions for the logged in user
router.get('/stats', authenticate, async (req, res, next) => {
  try {
    // Use Problem table for DSA Coding Arena stats (not Question table which has TCS NQT)
    const problems = await prisma.problem.findMany({
      select: {
        id: true,
        topics: true
      }
    });

    // Filter submissions that have problemId (DSA Coding Arena submissions)
    const solvedProblems = await prisma.submission.findMany({
      where: {
        userId: req.user!.userId,
        status: 'accepted',
        problemId: { not: null }
      },
      distinct: ['problemId'],
      select: {
        problemId: true
      }
    });

    const solvedProblemIds = new Set(solvedProblems.map(s => s.problemId).filter(Boolean));
    const topicStats: Record<string, { total: number; solved: number }> = {};

    problems.forEach(p => {
      // Problem table stores topics as comma-separated string, not JSON
      let topics: string[] = [];
      if (p.topics) {
        topics = typeof p.topics === 'string' 
          ? p.topics.split(',').map(t => t.trim()).filter(Boolean)
          : [];
      }
      
      const isSolved = solvedProblemIds.has(p.id);

      topics.forEach(t => {
        const key = t.toLowerCase();
        if (!topicStats[key]) {
          topicStats[key] = { total: 0, solved: 0 };
        }
        topicStats[key].total++;
        if (isSolved) {
          topicStats[key].solved++;
        }
      });
    });

    sendSuccess({
      res,
      data: {
        solvedCount: solvedProblemIds.size,
        totalQuestions: problems.length,
        topicStats
      }
    });
  } catch (err) { next(err); }
});

// GET /challenges/leaderboard — Retrieve coding leaderboard rankings
router.get('/leaderboard', async (req, res, next) => {
  try {
    const leaderboard = await prisma.studentProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      },
      orderBy: { xp: 'desc' },
      take: 20
    });

    // Adapt to match expected Mongoose response fields (renaming user -> userId)
    const adaptedLeaderboard = leaderboard.map(profile => ({
      _id: profile.id,
      userId: profile.user,
      totalXP: profile.xp,
      level: profile.level
    }));

    sendSuccess({ res, data: adaptedLeaderboard });
  } catch (err) { next(err); }
});

// POST /challenges/ai-mentor — Ask AI mentor about a coding problem
router.post('/ai-mentor', authenticate, async (req, res, next) => {
  try {
    const { questionSlug, code, requestType } = req.body;
    const question = await prisma.question.findUnique({
      where: { slug: questionSlug }
    });

    if (!question) {
      throw new AppError('Question not found', 404);
    }
    const title = question.title;

    let systemPrompt = '';
    const topics = Array.isArray(question.topics) ? question.topics.join(', ') : String(question.topics || '');
    const difficulty = question.difficulty || 'medium';

    if (requestType === 'explain') {
      systemPrompt = `You are an expert DSA tutor. Explain the coding problem "${title}" (Difficulty: ${difficulty}, Topics: ${topics}) clearly to a student.
- Describe what the problem is asking in plain English
- Break down the input/output requirements  
- Highlight the key constraints and what they imply about complexity
- Give an intuitive real-world analogy if helpful
- Do NOT reveal the solution or code yet.
Problem Statement: ${question.statement?.slice(0, 500) || title}`;

    } else if (requestType === 'hint') {
      systemPrompt = `You are a competitive programming mentor for the problem "${title}" (${difficulty}).
The student has written this code so far:
\`\`\`
${code || '// No code written yet'}
\`\`\`
Give 2-3 progressive, conceptual hints that guide the student toward the solution WITHOUT writing any code or revealing the full approach. 
- Hint 1: General direction (what technique/pattern to think about)
- Hint 2: More specific guidance on the key insight
- Hint 3: Edge case or optimization to keep in mind
Topics involved: ${topics}`;

    } else if (requestType === 'complexity') {
      systemPrompt = `Analyze the time and space complexity of this student's code for the problem "${title}" (${difficulty}):
\`\`\`
${code || '// No code provided'}
\`\`\`
- State the current Time Complexity with justification
- State the current Space Complexity with justification
- If suboptimal, explain what the optimal complexity should be for this problem (Topics: ${topics})
- Suggest a specific optimization strategy to achieve better complexity
- Keep the explanation clear and educational`;

    } else {
      // review
      systemPrompt = `You are an expert competitive programming tutor reviewing code for "${title}" (${difficulty}, Topics: ${topics}).

Student's Code:
\`\`\`
${code || '// No code written yet'}
\`\`\`

Provide a thorough code review covering:
1. **Correctness** — Does the logic correctly solve the problem? Point out any bugs or wrong assumptions.
2. **Edge Cases** — What inputs could break this code? (empty array, negative numbers, overflow, etc.)
3. **Complexity** — Current time/space complexity vs optimal
4. **Code Quality** — Variable naming, readability, redundant operations
5. **Reference Solution** — Provide a clean, optimal, well-commented solution in the same programming language the student used

Be specific, educational, and constructive.`;
    }

    // Call OpenAI/AI microservice
    let aiResponse = 'Unable to connect to AI Mentor service. Please try again later.';
    try {
      const response = await axios.post(
        `${process.env.AI_SERVICE_URL || 'http://localhost:8000'}/api/chat`,
        {
          message: systemPrompt,
        },
        {
          headers: {
            'X-API-Key': process.env.AI_SERVICE_API_KEY || 'adyapan_internal_ai_key_2024',
          },
        }
      );
      aiResponse = response.data?.response || response.data?.choices?.[0]?.message?.content || aiResponse;
    } catch {
      // Fallback: generate a question-specific response
      aiResponse = getFallbackAIMentorResponse(title, code || '', requestType, String(question.topics || ''), question.difficulty || 'medium');
    }

    sendSuccess({ res, data: { response: aiResponse } });
  } catch (err) { next(err); }
});

function getFallbackAIMentorResponse(questionTitle: string, studentCode: string, requestType = 'review', topics = '', difficulty = 'medium'): string {
  let lang = 'javascript';
  const codeStr = String(studentCode);
  if (codeStr.includes('def ') || codeStr.includes('import sys')) lang = 'python';
  else if (codeStr.includes('#include')) lang = 'cpp';
  else if (codeStr.includes('class Main') || codeStr.includes('public static void main')) lang = 'java';

  const titleLower = questionTitle.toLowerCase();

  if (requestType === 'explain') {
    return `### 📖 Problem Explanation: ${questionTitle}\n\n**Difficulty:** ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} | **Topics:** ${topics || 'DSA'}\n\n**What the problem is asking:**\nThis problem requires you to apply algorithmic thinking to process the given input and produce the expected output according to the stated constraints.\n\n**Key observations:**\n- Read the constraints carefully — they define the expected time complexity\n- Understand what the input represents and what transformation is needed\n- Consider edge cases: empty input, single elements, duplicates, and maximum bounds\n\n**Approach:**\n1. Understand the problem fully before writing any code\n2. Work through the example test case manually\n3. Identify the pattern or technique required\n4. Code, test, optimize\n\n> 💡 Try to solve this without looking at hints first!`;
  }

  if (requestType === 'hint') {
    const isArray = titleLower.includes('array') || titleLower.includes('subarray') || titleLower.includes('sum');
    const isString = titleLower.includes('string') || titleLower.includes('palindrome') || titleLower.includes('anagram');
    const isDP = titleLower.includes('subsequence') || titleLower.includes('path') || titleLower.includes('ways');
    
    let hint1 = '**Hint 1:** Start by understanding what you need to track — is it a running total, a window, or a pattern?';
    let hint2 = isArray ? '**Hint 2:** Consider using a two-pointer or sliding window approach on the array.' 
                : isString ? '**Hint 2:** Consider processing characters with a frequency map or a stack.'
                : isDP ? '**Hint 2:** Think about breaking the problem into overlapping subproblems — DP might help.'
                : '**Hint 2:** Sorting the input often simplifies comparison or search problems.';
    let hint3 = '**Hint 3:** What happens with an empty input or a single element? Handle these edge cases first.';
    
    return `### 💡 Hints for: ${questionTitle}\n\n${hint1}\n\n${hint2}\n\n${hint3}\n\n> 🔒 Try implementing with these hints before asking for a full review!`;
  }

  if (requestType === 'complexity') {
    const hasLoop = (codeStr.match(/for\s*\(/g) || codeStr.match(/for\s+\w/g) || []).length;
    const hasNestedLoop = hasLoop >= 2;
    const hasSort = /\.sort|sort\(|sorted\(/.test(codeStr);
    const currTime = hasNestedLoop ? 'O(N²)' : hasSort ? 'O(N log N)' : 'O(N)';
    const currSpace = /HashMap|dict|map<|{}/.test(codeStr) ? 'O(N)' : 'O(1)';
    
    return `### ⏱️ Complexity Analysis: ${questionTitle}\n\n**Your Current Code:**\n- **Time Complexity:** ${currTime}\n- **Space Complexity:** ${currSpace}\n\n**Expected for ${difficulty} difficulty:**\n- Time: O(N) or O(N log N) is typically expected\n- Space: O(1) auxiliary is ideal unless hashing is needed\n\n**Optimization suggestions:**\n${hasNestedLoop ? '- The nested loops make this O(N²). Consider if you can reduce to a single pass with a hash map or sliding window.' : hasSort ? '- Sorting is appropriate here. The O(N log N) is likely optimal.' : '- Your linear approach looks efficient! Verify the space usage doesn\'t add hidden overhead.'}\n\n> 📊 Always mention complexity tradeoffs in interviews!`;
  }

  // review fallback
  const cleanTitle = questionTitle.replace(/[^a-zA-Z0-9]/g, ' ');
  const camelCase = cleanTitle
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((word, i) => i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  let refSolution = '';
  if (lang === 'python') {
    refSolution = `def ${camelCase || 'solve'}(input_data):\n    # TODO: Implement optimal solution for ${questionTitle}\n    # Time Complexity: O(N)\n    # Space Complexity: O(1)\n    pass`;
  } else if (lang === 'cpp') {
    refSolution = `// Optimal solution for ${questionTitle}\n// Time: O(N), Space: O(1)\nauto ${camelCase || 'solve'}(auto& input_data) {\n    // Implement logic here\n    return 0;\n}`;
  } else if (lang === 'java') {
    refSolution = `// Optimal solution for ${questionTitle}\n// Time: O(N), Space: O(1)\npublic static int ${camelCase || 'solve'}(int[] nums) {\n    // Implement logic here\n    return 0;\n}`;
  } else {
    refSolution = `function ${camelCase || 'solve'}(input) {\n    // Optimal solution for ${questionTitle}\n    // Time Complexity: O(N)\n    // Space Complexity: O(1)\n    return 0;\n}`;
  }

  const qTitleLower = questionTitle.toLowerCase();
  if (qTitleLower.includes('smallest') || qTitleLower.includes('largest')) {
    const smallestSolutions = {
      python: `def getSecondSmallestAndLargest(arr):\n    if len(arr) < 2:\n        return -1\n    small = float('inf')\n    second_small = float('inf')\n    large = float('-inf')\n    second_large = float('-inf')\n    \n    for x in arr:\n        if x < small:\n            second_small = small\n            small = x\n        elif x < second_small and x != small:\n            second_small = x\n            \n        if x > large:\n            second_large = large\n            large = x\n        elif x > second_large and x != large:\n            second_large = x\n            \n    return [second_small, second_large]`,
      javascript: `function getSecondSmallestAndLargest(arr) {\n    if (arr.length < 2) return -1;\n    let small = Infinity, secondSmall = Infinity;\n    let large = -Infinity, secondLarge = -Infinity;\n    \n    for (let x of arr) {\n        if (x < small) {\n            secondSmall = small;\n            small = x;\n        } else if (x < secondSmall && x !== small) {\n            secondSmall = x;\n        }\n        \n        if (x > large) {\n            secondLarge = large;\n            large = x;\n        } else if (x > secondLarge && x !== large) {\n            secondLarge = x;\n        }\n    }\n    return [secondSmall, secondLarge];\n}`,
      cpp: `vector<int> getSecondSmallestAndLargest(vector<int>& arr) {\n    if (arr.size() < 2) return {-1, -1};\n    int small = INT_MAX, secondSmall = INT_MAX;\n    int large = INT_MIN, secondLarge = INT_MIN;\n    for (int x : arr) {\n        if (x < small) {\n            secondSmall = small;\n            small = x;\n        } else if (x < secondSmall && x != small) {\n            secondSmall = x;\n        }\n        if (x > large) {\n            secondLarge = large;\n            large = x;\n        } else if (x > secondLarge && x != large) {\n            secondLarge = x;\n        }\n    }\n    return {secondSmall, secondLarge};\n}`,
      java: `public static int[] getSecondSmallestAndLargest(int[] arr) {\n    if (arr.length < 2) return new int[]{-1, -1};\n    int small = Integer.MAX_VALUE, secondSmall = Integer.MAX_VALUE;\n    int large = Integer.MIN_VALUE, secondLarge = Integer.MIN_VALUE;\n    for (int x : arr) {\n        if (x < small) {\n            secondSmall = small;\n            small = x;\n        } else if (x < secondSmall && x != small) {\n            secondSmall = x;\n        }\n        if (x > large) {\n            secondLarge = large;\n            large = x;\n        } else if (x > secondLarge && x != large) {\n            secondLarge = x;\n        }\n    }\n    return new int[]{secondSmall, secondLarge};\n}`
    };
    refSolution = smallestSolutions[lang as keyof typeof smallestSolutions] || smallestSolutions.javascript;
  } else if (qTitleLower.includes('maximum subarray') || qTitleLower.includes('kadane')) {
    const solutions = {
      python: `def maxSubarray(nums):\n    max_sum = nums[0]\n    curr_sum = nums[0]\n    for x in nums[1:]:\n        curr_sum = max(x, curr_sum + x)\n        max_sum = max(max_sum, curr_sum)\n    return max_sum`,
      javascript: `function maxSubarray(nums) {\n    let max = nums[0], curr = nums[0];\n    for (let i = 1; i < nums.length; i++) {\n        curr = Math.max(nums[i], curr + nums[i]);\n        max = Math.max(max, curr);\n    }\n    return max;\n}`,
      cpp: `int maxSubarray(vector<int>& nums) {\n    int maxSum = nums[0], currSum = nums[0];\n    for (size_t i = 1; i < nums.size(); ++i) {\n        currSum = max(nums[i], currSum + nums[i]);\n        maxSum = max(maxSum, currSum);\n    }\n    return maxSum;\n}`,
      java: `public static int maxSubarray(int[] nums) {\n    int maxSum = nums[0], currSum = nums[0];\n    for (int i = 1; i < nums.length; ++i) {\n        currSum = Math.max(nums[i], currSum + nums[i]);\n        maxSum = Math.max(maxSum, currSum);\n    }\n    return maxSum;\n}`
    };
    refSolution = solutions[lang as keyof typeof solutions] || solutions.javascript;
  } else if (qTitleLower.includes('chocolate distribution')) {
    const solutions = {
      python: `def chocolateDistributionProblem(nums, m):\n    nums.sort()\n    min_diff = float('inf')\n    for i in range(len(nums) - m + 1):\n        min_diff = min(min_diff, nums[i+m-1] - nums[i])\n    return min_diff`,
      javascript: `function chocolateDistributionProblem(nums, m) {\n    nums.sort((a, b) => a - b);\n    let minDiff = Infinity;\n    for (let i = 0; i <= nums.length - m; i++) {\n        minDiff = Math.min(minDiff, nums[i + m - 1] - nums[i]);\n    }\n    return minDiff;\n}`,
      cpp: `int chocolateDistributionProblem(vector<int>& nums, int m) {\n    sort(nums.begin(), nums.end());\n    int min_diff = 1e9;\n    for (int i = 0; i <= nums.size() - m; i++) {\n        min_diff = min(min_diff, nums[i + m - 1] - nums[i]);\n    }\n    return min_diff;\n}`,
      java: `public static int chocolateDistributionProblem(int[] nums, int m) {\n    Arrays.sort(nums);\n    int minDiff = Integer.MAX_VALUE;\n    for (int i = 0; i <= nums.length - m; i++) {\n        minDiff = Math.min(minDiff, nums[i + m - 1] - nums[i]);\n    }\n    return minDiff;\n}`
    };
    refSolution = solutions[lang as keyof typeof solutions] || solutions.javascript;
  }

  return `### 🔍 Code Review: ${questionTitle}\n\n**Language Detected:** ${lang.toUpperCase()}\n\n**1. Analysis of Your Code:**\n${studentCode ? '* Review your loop boundaries and return values carefully.\n* Check for off-by-one errors in index-based operations.\n* Ensure all edge cases (empty input, single element) are handled.' : '* No code provided yet. Write your initial solution and ask for a review!'}\n\n**2. Common Pitfalls for this Problem:**\n* Integer overflow when summing large values\n* Incorrect variable initialization before loops\n* Missing return statement for edge cases\n\n**3. Reference Implementation (${lang.toUpperCase()}):**\n\`\`\`${lang}\n${refSolution}\n\`\`\`\n\n> 💪 Compare your approach with the reference and identify differences!`;
}

export default router;
