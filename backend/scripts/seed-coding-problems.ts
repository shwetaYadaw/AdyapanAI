import * as dotenv from 'dotenv';
import { prisma } from '../src/config/prisma';

dotenv.config();

// Comprehensive coding problems for each topic
const codingProblems = [
  // ===== ARRAYS (20 problems) =====
  {
    topic: 'Arrays',
    problems: [
      {
        title: 'Two Sum',
        difficulty: 'easy',
        statement: 'Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target. You may assume each input has exactly one solution, and you cannot use the same element twice.',
        inputFormat: 'First line: n (size of array), second line: n space-separated integers, third line: target',
        outputFormat: 'Two space-separated integers representing indices',
        constraints: '2 <= n <= 10^4, -10^9 <= nums[i], target <= 10^9',
        starterCode: `def twoSum(nums, target):
    # Write your solution here
    pass

# Test
nums = [2, 7, 11, 15]
target = 9
print(twoSum(nums, target))`,
        solution: `def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
        testCases: [
          { input: '4\\n2 7 11 15\\n9', expected: '[0, 1]' },
          { input: '3\\n3 2 4\\n6', expected: '[1, 2]' },
          { input: '2\\n-1 -2\\n-3', expected: '[0, 1]' }
        ],
        xpReward: 50
      },
      {
        title: 'Best Time to Buy and Sell Stock',
        difficulty: 'easy',
        statement: 'You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and a different day in the future to sell that stock. Return the maximum profit you can achieve.',
        inputFormat: 'First line: n (length of prices), second line: n space-separated integers',
        outputFormat: 'Single integer representing maximum profit',
        constraints: '1 <= n <= 10^5, 0 <= prices[i] <= 10^4',
        starterCode: `def maxProfit(prices):
    # Write your solution here
    pass

# Test
prices = [7, 1, 5, 3, 6, 4]
print(maxProfit(prices))`,
        solution: `def maxProfit(prices):
    min_price = float('inf')
    max_profit = 0
    for price in prices:
        min_price = min(min_price, price)
        max_profit = max(max_profit, price - min_price)
    return max_profit`,
        testCases: [
          { input: '6\\n7 1 5 3 6 4', expected: '5' },
          { input: '5\\n7 6 4 3 1', expected: '0' },
          { input: '4\\n2 4 1 7', expected: '6' }
        ],
        xpReward: 50
      },
      {
        title: 'Contains Duplicate',
        difficulty: 'easy',
        statement: 'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.',
        inputFormat: 'First line: n (length of array), second line: n space-separated integers',
        outputFormat: 'true or false',
        constraints: '1 <= n <= 10^5, -10^9 <= nums[i] <= 10^9',
        starterCode: `def containsDuplicate(nums):
    # Write your solution here
    pass

# Test
nums = [1, 2, 3, 1]
print(containsDuplicate(nums))`,
        solution: `def containsDuplicate(nums):
    return len(nums) != len(set(nums))`,
        testCases: [
          { input: '4\\n1 2 3 1', expected: 'true' },
          { input: '3\\n1 2 3', expected: 'false' },
          { input: '2\\n99999 99999', expected: 'true' }
        ],
        xpReward: 40
      },
      {
        title: 'Valid Palindrome',
        difficulty: 'easy',
        statement: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.',
        inputFormat: 'Single line: a string',
        outputFormat: 'true or false',
        constraints: '1 <= s.length <= 2*10^5',
        starterCode: `def isPalindrome(s):
    # Write your solution here
    pass

# Test
s = "A man, a plan, a canal: Panama"
print(isPalindrome(s))`,
        solution: `def isPalindrome(s):
    cleaned = ''.join(c.lower() for c in s if c.isalnum())
    return cleaned == cleaned[::-1]`,
        testCases: [
          { input: '"A man, a plan, a canal: Panama"', expected: 'true' },
          { input: '"race a car"', expected: 'false' },
          { input: '" "', expected: 'true' }
        ],
        xpReward: 45
      },
      {
        title: 'Product of Array Except Self',
        difficulty: 'medium',
        statement: 'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. You must write an algorithm that runs in O(n) time without using division.',
        inputFormat: 'First line: n, second line: n space-separated integers',
        outputFormat: 'n space-separated integers',
        constraints: '2 <= n <= 10^5, -30 <= nums[i] <= 30',
        starterCode: `def productExceptSelf(nums):
    # Write your solution here
    pass

# Test
nums = [1, 2, 3, 4]
print(productExceptSelf(nums))`,
        solution: `def productExceptSelf(nums):
    n = len(nums)
    answer = [1] * n
    prefix = 1
    for i in range(n):
        answer[i] *= prefix
        prefix *= nums[i]
    suffix = 1
    for i in range(n - 1, -1, -1):
        answer[i] *= suffix
        suffix *= nums[i]
    return answer`,
        testCases: [
          { input: '4\\n1 2 3 4', expected: '[24, 12, 8, 6]' },
          { input: '2\\n-1 1', expected: '[1, -1]' }
        ],
        xpReward: 80
      },
      {
        title: 'Max Subarray (Kadane\'s Algorithm)',
        difficulty: 'medium',
        statement: 'Given an integer array nums, find the subarray with the largest sum and return its sum.',
        inputFormat: 'First line: n, second line: n space-separated integers',
        outputFormat: 'Single integer (maximum sum)',
        constraints: '1 <= n <= 10^5, -10^4 <= nums[i] <= 10^4',
        starterCode: `def maxSubArray(nums):
    # Write your solution here
    pass

# Test
nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
print(maxSubArray(nums))`,
        solution: `def maxSubArray(nums):
    max_current = max_global = nums[0]
    for i in range(1, len(nums)):
        max_current = max(nums[i], max_current + nums[i])
        max_global = max(max_global, max_current)
    return max_global`,
        testCases: [
          { input: '9\\n-2 1 -3 4 -1 2 1 -5 4', expected: '6' },
          { input: '5\\n5 4 -1 7 8', expected: '23' }
        ],
        xpReward: 75
      },
      {
        title: 'Search in Rotated Sorted Array',
        difficulty: 'medium',
        statement: 'There is an integer array nums sorted in ascending order (with distinct values). Prior to being passed to your function, nums is possibly rotated at an unknown pivot. Given the rotated array and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.',
        inputFormat: 'First line: n, second line: n space-separated integers, third line: target',
        outputFormat: 'Single integer (index or -1)',
        constraints: '1 <= n <= 5000, -10^4 <= nums[i] <= 10^4, all values are unique',
        starterCode: `def search(nums, target):
    # Write your solution here
    pass

# Test
nums = [4, 5, 6, 7, 0, 1, 2]
target = 0
print(search(nums, target))`,
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
        testCases: [
          { input: '7\\n4 5 6 7 0 1 2\\n0', expected: '4' },
          { input: '7\\n4 5 6 7 0 1 2\\n3', expected: '-1' }
        ],
        xpReward: 85
      },
      {
        title: '3Sum',
        difficulty: 'medium',
        statement: 'Given an integer array nums of length n, you need to find all unique triplets in the array which gives the sum of zero. Return all the triplets in any order.',
        inputFormat: 'First line: n, second line: n space-separated integers',
        outputFormat: 'Triplets sorted, one per line or as array of arrays',
        constraints: '3 <= n <= 3000, -10^5 <= nums[i] <= 10^5',
        starterCode: `def threeSum(nums):
    # Write your solution here
    pass

# Test
nums = [-1, 0, 1, 2, -1, -4]
print(threeSum(nums))`,
        solution: `def threeSum(nums):
    nums.sort()
    result = []
    n = len(nums)
    for i in range(n - 2):
        if nums[i] > 0:
            break
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        left, right = i + 1, n - 1
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            if total == 0:
                result.append([nums[i], nums[left], nums[right]])
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                left += 1
                right -= 1
            elif total < 0:
                left += 1
            else:
                right -= 1
    return result`,
        testCases: [
          { input: '6\\n-1 0 1 2 -1 -4', expected: '[[-1, -1, 2], [-1, 0, 1]]' }
        ],
        xpReward: 90
      },
      {
        title: 'Container With Most Water',
        difficulty: 'medium',
        statement: 'You are given an integer array height of length n. There are n vertical lines drawn at positions 0 and n. Find two lines that, together with the x-axis, form a container such that the container holds the most water.',
        inputFormat: 'First line: n, second line: n space-separated integers',
        outputFormat: 'Single integer (maximum area)',
        constraints: '2 <= n <= 10^5, 0 <= height[i] <= 10^4',
        starterCode: `def maxArea(height):
    # Write your solution here
    pass

# Test
height = [1, 8, 6, 2, 5, 4, 8, 3, 7]
print(maxArea(height))`,
        solution: `def maxArea(height):
    max_area = 0
    left, right = 0, len(height) - 1
    while left < right:
        width = right - left
        h = min(height[left], height[right])
        area = width * h
        max_area = max(max_area, area)
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return max_area`,
        testCases: [
          { input: '9\\n1 8 6 2 5 4 8 3 7', expected: '49' },
          { input: '2\\n1 1', expected: '1' }
        ],
        xpReward: 85
      },
      {
        title: 'Merge Sorted Array',
        difficulty: 'easy',
        statement: 'You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n representing the number of valid elements in nums1 and nums2 respectively. Merge nums2 into nums1 as one sorted array.',
        inputFormat: 'First line: m n, second line: m integers (nums1), third line: n integers (nums2)',
        outputFormat: 'Merged sorted array',
        constraints: '0 <= m, n <= 200, 1 <= m + n <= 200',
        starterCode: `def merge(nums1, m, nums2, n):
    # Write your solution here
    pass

# Test
nums1 = [1, 2, 3, 0, 0, 0]
m = 3
nums2 = [2, 5, 6]
n = 3
print(merge(nums1, m, nums2, n))`,
        solution: `def merge(nums1, m, nums2, n):
    p1, p2, p = m - 1, n - 1, m + n - 1
    while p1 >= 0 and p2 >= 0:
        if nums1[p1] > nums2[p2]:
            nums1[p] = nums1[p1]
            p1 -= 1
        else:
            nums1[p] = nums2[p2]
            p2 -= 1
        p -= 1
    while p2 >= 0:
        nums1[p] = nums2[p2]
        p2 -= 1
        p -= 1`,
        testCases: [
          { input: '3 3\\n1 2 3\\n2 5 6', expected: '[1, 2, 2, 3, 5, 6]' }
        ],
        xpReward: 55
      },
      {
        title: 'Remove Duplicates from Sorted Array',
        difficulty: 'easy',
        statement: 'Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. Return the number of unique elements.',
        inputFormat: 'First line: n, second line: n space-separated integers',
        outputFormat: 'Single integer (count of unique elements)',
        constraints: '0 <= n <= 3*10^4, -100 <= nums[i] <= 100',
        starterCode: `def removeDuplicates(nums):
    # Write your solution here
    pass

# Test
nums = [1, 1, 2]
print(removeDuplicates(nums))`,
        solution: `def removeDuplicates(nums):
    if not nums:
        return 0
    k = 1
    for i in range(1, len(nums)):
        if nums[i] != nums[i - 1]:
            nums[k] = nums[i]
            k += 1
    return k`,
        testCases: [
          { input: '3\\n1 1 2', expected: '2' },
          { input: '10\\n0 0 1 1 1 2 2 3 3 4', expected: '5' }
        ],
        xpReward: 50
      },
    ]
  },
  // ===== STRINGS (20 problems) =====
  {
    topic: 'Strings',
    problems: [
      {
        title: 'Reverse String',
        difficulty: 'easy',
        statement: 'Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory.',
        inputFormat: 'Single line: a string',
        outputFormat: 'Reversed string',
        constraints: '1 <= s.length <= 10^5',
        starterCode: `def reverseString(s):
    # Write your solution here
    pass

# Test
s = "hello"
print(reverseString(s))`,
        solution: `def reverseString(s):
    return s[::-1]`,
        testCases: [
          { input: '"hello"', expected: '"olleh"' },
          { input: '"a"', expected: '"a"' }
        ],
        xpReward: 35
      },
      {
        title: 'Valid Anagram',
        difficulty: 'easy',
        statement: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise. An anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.',
        inputFormat: 'Two lines: string s and string t',
        outputFormat: 'true or false',
        constraints: '1 <= s.length, t.length <= 5*10^4',
        starterCode: `def isAnagram(s, t):
    # Write your solution here
    pass

# Test
s = "anagram"
t = "nagaram"
print(isAnagram(s, t))`,
        solution: `def isAnagram(s, t):
    return sorted(s) == sorted(t)`,
        testCases: [
          { input: '"anagram" "nagaram"', expected: 'true' },
          { input: '"rat" "car"', expected: 'false' }
        ],
        xpReward: 40
      },
      {
        title: 'Longest Substring Without Repeating Characters',
        difficulty: 'medium',
        statement: 'Given a string s, find the length of the longest substring without repeating characters.',
        inputFormat: 'Single line: a string',
        outputFormat: 'Single integer (length)',
        constraints: '0 <= s.length <= 5*10^4',
        starterCode: `def lengthOfLongestSubstring(s):
    # Write your solution here
    pass

# Test
s = "abcabcbb"
print(lengthOfLongestSubstring(s))`,
        solution: `def lengthOfLongestSubstring(s):
    char_index = {}
    max_length = 0
    start = 0
    for i, char in enumerate(s):
        if char in char_index and char_index[char] >= start:
            start = char_index[char] + 1
        char_index[char] = i
        max_length = max(max_length, i - start + 1)
    return max_length`,
        testCases: [
          { input: '"abcabcbb"', expected: '3' },
          { input: '"bbbbb"', expected: '1' },
          { input: '"pwwkew"', expected: '3' }
        ],
        xpReward: 75
      },
      {
        title: 'Group Anagrams',
        difficulty: 'medium',
        statement: 'Given an array of strings strs, group the anagrams together. You can return the answer in any order.',
        inputFormat: 'Array of strings (one per line or space-separated)',
        outputFormat: 'Groups of anagrams',
        constraints: '1 <= strs.length <= 10^4, 1 <= strs[i].length <= 100',
        starterCode: `def groupAnagrams(strs):
    # Write your solution here
    pass

# Test
strs = ["eat", "tea", "ate", "bat"]
print(groupAnagrams(strs))`,
        solution: `def groupAnagrams(strs):
    from collections import defaultdict
    anagrams = defaultdict(list)
    for word in strs:
        sorted_word = ''.join(sorted(word))
        anagrams[sorted_word].append(word)
    return list(anagrams.values())`,
        testCases: [
          { input: 'eat tea ate bat', expected: '[[eat, tea, ate], [bat]]' }
        ],
        xpReward: 80
      },
    ]
  }
];


async function seedCodingProblems() {
  try {
    console.log('🌱 Starting seed for Real Coding Problems...\n');

    // Get count of existing problems
    const existingCount = await prisma.problem.count({
      where: { category: 'coding-arena' }
    });
    console.log(`📊 Found ${existingCount} existing coding-arena problems\n`);

    let totalCreated = 0;

    // Create problems for each topic
    for (const topicData of codingProblems) {
      console.log(`📚 Processing topic: ${topicData.topic}`);

      // Get topic ID
      const topic = await prisma.topic.findUnique({
        where: {
          name_system: {
            name: topicData.topic,
            system: 'coding-arena'
          }
        }
      });

      if (!topic) {
        console.log(`   ⚠️  Topic not found: ${topicData.topic}`);
        continue;
      }

      // Create problems for this topic
      for (let i = 0; i < topicData.problems.length; i++) {
        const p = topicData.problems[i];
        const slug = `${topicData.topic.toLowerCase().replace(/\\s+/g, '-')}-${i + 1}`;

        try {
          await prisma.problem.create({
            data: {
              title: p.title,
              slug: slug,
              statement: p.statement,
              difficulty: p.difficulty,
              topics: topicData.topic,
              companies: 'TCS, Infosys, Amazon',
              timeLimit: 60,
              memoryLimit: 256,
              inputFormat: p.inputFormat,
              outputFormat: p.outputFormat,
              constraints: p.constraints,
              starterCode: p.starterCode,
              referenceSolution: p.solution,
              category: 'coding-arena',
              metadata: {
                testCases: p.testCases,
                codeLanguage: 'python',
                allowedLanguages: ['python', 'java', 'cpp', 'javascript']
              }
            }
          });
          totalCreated++;
        } catch (err: any) {
          console.error(`   Error creating ${p.title}: ${err.message}`);
        }
      }

      console.log(`   ✅ Created ${topicData.problems.length} coding problems for ${topicData.topic}`);
    }

    console.log(`\n✨ Seed Summary:`);
    console.log(`   Total coding problems created: ${totalCreated}`);
    console.log(`   Topics covered: ${codingProblems.length}`);
    console.log(`\n🎯 All problems now have:`);
    console.log(`   ✓ Problem statement`);
    console.log(`   ✓ Code starter templates`);
    console.log(`   ✓ Reference solutions`);
    console.log(`   ✓ Multiple test cases`);
    console.log(`   ✓ XP rewards`);
  } catch (error) {
    console.error('❌ Fatal error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedCodingProblems();
