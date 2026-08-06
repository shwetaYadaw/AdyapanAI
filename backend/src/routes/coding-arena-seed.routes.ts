import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { sendSuccess } from '../utils/response.utils';

const router = Router();

const codingProblems = {
  'Arrays': [
    {
      title: 'Two Sum',
      difficulty: 'easy',
      statement: 'Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target. You may assume each input has exactly one solution, and you cannot use the same element twice.',
      inputFormat: 'Line 1: n (array size), Line 2: n space-separated integers, Line 3: target',
      outputFormat: 'Two space-separated integers (indices)',
      constraints: '2 <= n <= 10^4, -10^9 <= nums[i], target <= 10^9',
      starterCode: `def twoSum(nums, target):
    # Write your solution here
    pass

# Example usage:
nums = [2, 7, 11, 15]
target = 9
print(twoSum(nums, target))  # Output: [0, 1]`,
      solution: `def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
    },
    {
      title: 'Best Time to Buy and Sell Stock',
      difficulty: 'easy',
      statement: 'You are given an array prices where prices[i] is the price on ith day. You want to maximize profit by choosing one day to buy and a different day in the future to sell. Return the maximum profit. You may not sell before you buy.',
      inputFormat: 'Line 1: n (number of days), Line 2: n space-separated integers (prices)',
      outputFormat: 'Single integer (maximum profit)',
      constraints: '1 <= n <= 10^5, 0 <= prices[i] <= 10^4',
      starterCode: `def maxProfit(prices):
    # Write your solution here
    pass

# Example:
prices = [7, 1, 5, 3, 6, 4]
print(maxProfit(prices))  # Output: 5`,
      solution: `def maxProfit(prices):
    min_price = float('inf')
    max_profit = 0
    for price in prices:
        min_price = min(min_price, price)
        max_profit = max(max_profit, price - min_price)
    return max_profit`,
    },
    {
      title: 'Contains Duplicate',
      difficulty: 'easy',
      statement: 'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.',
      inputFormat: 'Line 1: n, Line 2: n space-separated integers',
      outputFormat: 'true or false',
      constraints: '1 <= n <= 10^5, -10^9 <= nums[i] <= 10^9',
      starterCode: `def containsDuplicate(nums):
    pass

nums = [1, 2, 3, 1]
print(containsDuplicate(nums))  # Output: true`,
      solution: `def containsDuplicate(nums):
    return len(nums) != len(set(nums))`,
    },
    {
      title: 'Product of Array Except Self',
      difficulty: 'medium',
      statement: 'Given integer array nums, return array answer where answer[i] = product of all elements except nums[i]. Must run in O(n) time without using division.',
      inputFormat: 'Line 1: n, Line 2: n integers',
      outputFormat: 'n integers (products)',
      constraints: '2 <= n <= 10^5, -30 <= nums[i] <= 30',
      starterCode: `def productExceptSelf(nums):
    pass

nums = [1, 2, 3, 4]
print(productExceptSelf(nums))  # Output: [24, 12, 8, 6]`,
      solution: `def productExceptSelf(nums):
    n = len(nums)
    answer = [1] * n
    for i in range(1, n):
        answer[i] = answer[i-1] * nums[i-1]
    right = 1
    for i in range(n-1, -1, -1):
        answer[i] *= right
        right *= nums[i]
    return answer`,
    },
    {
      title: 'Maximum Subarray (Kadane\'s Algorithm)',
      difficulty: 'medium',
      statement: 'Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.',
      inputFormat: 'Line 1: n, Line 2: n integers',
      outputFormat: 'Single integer (maximum sum)',
      constraints: '1 <= n <= 10^5, -10^4 <= nums[i] <= 10^4',
      starterCode: `def maxSubArray(nums):
    pass

nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
print(maxSubArray(nums))  # Output: 6`,
      solution: `def maxSubArray(nums):
    max_current = max_global = nums[0]
    for i in range(1, len(nums)):
        max_current = max(nums[i], max_current + nums[i])
        max_global = max(max_global, max_current)
    return max_global`,
    },
  ],
  'Strings': [
    {
      title: 'Reverse String',
      difficulty: 'easy',
      statement: 'Write a function that reverses a string. The input string is given as an array of characters s.',
      inputFormat: 'Single line: a string',
      outputFormat: 'Reversed string',
      constraints: '1 <= s.length <= 10^5',
      starterCode: `def reverseString(s):
    pass

s = "hello"
print(reverseString(s))  # Output: "olleh"`,
      solution: `def reverseString(s):
    return s[::-1]`,
    },
    {
      title: 'Valid Anagram',
      difficulty: 'easy',
      statement: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise.',
      inputFormat: 'Line 1: string s, Line 2: string t',
      outputFormat: 'true or false',
      constraints: '1 <= s.length, t.length <= 5*10^4',
      starterCode: `def isAnagram(s, t):
    pass

s = "anagram"
t = "nagaram"
print(isAnagram(s, t))  # Output: true`,
      solution: `def isAnagram(s, t):
    return sorted(s) == sorted(t)`,
    },
    {
      title: 'Longest Substring Without Repeating Characters',
      difficulty: 'medium',
      statement: 'Given a string s, find the length of the longest substring without repeating characters.',
      inputFormat: 'Single line: a string',
      outputFormat: 'Single integer (length)',
      constraints: '0 <= s.length <= 5*10^4',
      starterCode: `def lengthOfLongestSubstring(s):
    pass

s = "abcabcbb"
print(lengthOfLongestSubstring(s))  # Output: 3`,
      solution: `def lengthOfLongestSubstring(s):
    char_index = {}
    max_len = 0
    start = 0
    for i, char in enumerate(s):
        if char in char_index and char_index[char] >= start:
            start = char_index[char] + 1
        char_index[char] = i
        max_len = max(max_len, i - start + 1)
    return max_len`,
    },
    {
      title: 'Group Anagrams',
      difficulty: 'medium',
      statement: 'Given an array of strings strs, group the anagrams together. You can return the answer in any order.',
      inputFormat: 'Array of strings',
      outputFormat: 'Grouped anagrams',
      constraints: '1 <= strs.length <= 10^4, 1 <= strs[i].length <= 100',
      starterCode: `def groupAnagrams(strs):
    pass

strs = ["eat", "tea", "ate", "bat"]
print(groupAnagrams(strs))`,
      solution: `def groupAnagrams(strs):
    from collections import defaultdict
    groups = defaultdict(list)
    for word in strs:
        sorted_word = ''.join(sorted(word))
        groups[sorted_word].append(word)
    return list(groups.values())`,
    },
  ],
  'Binary Search': [
    {
      title: 'Binary Search',
      difficulty: 'easy',
      statement: 'Given a sorted array of integers nums and an integer target, return the index of target if it is in nums, or -1 if it is not in nums. You must write an algorithm with O(log n) runtime complexity.',
      inputFormat: 'Line 1: n, Line 2: sorted n integers, Line 3: target',
      outputFormat: 'Index or -1',
      constraints: '1 <= n <= 10^4, -10^9 <= nums[i] <= 10^9',
      starterCode: `def search(nums, target):
    pass

nums = [-1, 0, 3, 5, 9, 12]
target = 9
print(search(nums, target))  # Output: 4`,
      solution: `def search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
    },
    {
      title: 'Search in Rotated Sorted Array',
      difficulty: 'medium',
      statement: 'There is an integer array nums sorted in ascending order (with distinct values). Prior to being passed to your function, nums is possibly rotated at an unknown pivot index k. Return the index of target if it is in nums, or -1 if it is not in nums.',
      inputFormat: 'Line 1: n, Line 2: n integers, Line 3: target',
      outputFormat: 'Index or -1',
      constraints: '1 <= n <= 5000, -10^4 <= nums[i] <= 10^4',
      starterCode: `def search(nums, target):
    pass

nums = [4, 5, 6, 7, 0, 1, 2]
target = 0
print(search(nums, target))  # Output: 4`,
      solution: `def search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    return -1`,
    },
  ]
};

// POST /admin/coding-arena/seed - Seed coding problems (PUBLIC - for setup only)
router.post('/seed', async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('🌱 Seeding coding problems via API...');

    let totalCreated = 0;
    const results: any[] = [];

    for (const [topicName, problems] of Object.entries(codingProblems)) {
      const topicResults = { topic: topicName, created: 0, errors: 0 };

      // Get topic
      const topic = await prisma.topic.findFirst({
        where: {
          name: topicName,
          system: 'coding-arena',
          courseId: null // Global/DSA topics
        }
      });

      if (!topic) {
        topicResults.errors++;
        results.push(topicResults);
        continue;
      }

      // Create problems
      for (let i = 0; i < problems.length; i++) {
        const p = problems[i];
        const slug = `${topicName.toLowerCase().replace(/\\s+/g, '-')}-${i + 1}`;

        try {
          await prisma.problem.upsert({
            where: { slug },
            update: {
              title: p.title,
              statement: p.statement,
              difficulty: p.difficulty,
              topics: topicName,
              starterCode: p.starterCode,
              referenceSolution: p.solution
            },
            create: {
              title: p.title,
              slug,
              statement: p.statement,
              difficulty: p.difficulty,
              topics: topicName,
              companies: 'TCS, Infosys, Amazon',
              timeLimit: 60,
              memoryLimit: 256,
              inputFormat: p.inputFormat,
              outputFormat: p.outputFormat,
              constraints: p.constraints,
              starterCode: p.starterCode,
              referenceSolution: p.solution,
              category: 'coding-arena'
            }
          });
          topicResults.created++;
          totalCreated++;
        } catch (err: any) {
          topicResults.errors++;
          console.error(`Error creating ${p.title}:`, err.message);
        }
      }

      results.push(topicResults);
    }

    sendSuccess({
      res,
      message: `Seeded ${totalCreated} coding problems`,
      data: {
        totalCreated,
        byTopic: results
      },
      statusCode: 201
    });
  } catch (err) {
    next(err);
  }
});

export default router;

// Additional helper function to get detailed seed stats
router.get('/stats', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const problems = await prisma.problem.findMany({
      where: { category: 'coding-arena' },
      select: {
        id: true,
        title: true,
        topics: true,
        difficulty: true
      }
    });

    const byTopic: Record<string, any> = {};
    problems.forEach(p => {
      if (!byTopic[p.topics]) {
        byTopic[p.topics] = { easy: 0, medium: 0, hard: 0, total: 0 };
      }
      byTopic[p.topics][p.difficulty]++;
      byTopic[p.topics].total++;
    });

    sendSuccess({
      res,
      data: {
        totalProblems: problems.length,
        byTopic,
        topicsCount: Object.keys(byTopic).length
      }
    });
  } catch (err) {
    next(err);
  }
});
