import * as dotenv from 'dotenv';
import { prisma } from '../src/config/prisma';

dotenv.config();

const codingProblemsByTopic = {
  'Arrays': [
    {
      title: 'Two Sum',
      difficulty: 'easy',
      statement: 'Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target.',
      inputFormat: 'Line 1: n (size), Line 2: n integers, Line 3: target',
      outputFormat: 'Two indices as "i j"',
      constraints: '2 <= n <= 10^4, -10^9 <= nums[i] <= 10^9',
      starterCode: `def twoSum(nums, target):
    pass

nums = [2, 7, 11, 15]
target = 9
print(twoSum(nums, target))`,
      solution: `def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        if target - num in seen:
            return [seen[target - num], i]
        seen[num] = i
    return []`,
    },
    {
      title: 'Best Time to Buy and Sell Stock',
      difficulty: 'easy',
      statement: 'Find the maximum profit from buying and selling stock once.',
      inputFormat: 'Line 1: n, Line 2: n prices',
      outputFormat: 'Maximum profit (integer)',
      constraints: '1 <= n <= 10^5, 0 <= prices[i] <= 10^4',
      starterCode: `def maxProfit(prices):
    pass

prices = [7, 1, 5, 3, 6, 4]
print(maxProfit(prices))`,
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
      statement: 'Return true if any value appears at least twice in the array.',
      inputFormat: 'Line 1: n, Line 2: n integers',
      outputFormat: 'true/false',
      constraints: '1 <= n <= 10^5',
      starterCode: `def containsDuplicate(nums):
    pass

nums = [1, 2, 3, 1]
print(containsDuplicate(nums))`,
      solution: `def containsDuplicate(nums):
    return len(nums) != len(set(nums))`,
    },
    {
      title: 'Product of Array Except Self',
      difficulty: 'medium',
      statement: 'Return array where answer[i] = product of all elements except nums[i]. O(n) time, no division.',
      inputFormat: 'Line 1: n, Line 2: n integers',
      outputFormat: 'Product array',
      constraints: '2 <= n <= 10^5, -30 <= nums[i] <= 30',
      starterCode: `def productExceptSelf(nums):
    pass

nums = [1, 2, 3, 4]
print(productExceptSelf(nums))`,
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
      title: 'Max Subarray (Kadane\'s Algorithm)',
      difficulty: 'medium',
      statement: 'Find the contiguous subarray with the largest sum.',
      inputFormat: 'Line 1: n, Line 2: n integers',
      outputFormat: 'Maximum sum (integer)',
      constraints: '1 <= n <= 10^5, -10^4 <= nums[i] <= 10^4',
      starterCode: `def maxSubArray(nums):
    pass

nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
print(maxSubArray(nums))`,
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
      statement: 'Reverse a string in-place with O(1) extra space.',
      inputFormat: 'Single line: a string',
      outputFormat: 'Reversed string',
      constraints: '1 <= s.length <= 10^5',
      starterCode: `def reverseString(s):
    pass

s = "hello"
print(reverseString(s))`,
      solution: `def reverseString(s):
    return s[::-1]`,
    },
    {
      title: 'Valid Anagram',
      difficulty: 'easy',
      statement: 'Check if two strings are anagrams of each other.',
      inputFormat: 'Line 1: string s, Line 2: string t',
      outputFormat: 'true/false',
      constraints: '1 <= s.length <= 5*10^4',
      starterCode: `def isAnagram(s, t):
    pass

s = "anagram"
t = "nagaram"
print(isAnagram(s, t))`,
      solution: `def isAnagram(s, t):
    return sorted(s) == sorted(t)`,
    },
    {
      title: 'Longest Substring Without Repeating Characters',
      difficulty: 'medium',
      statement: 'Find the length of the longest substring without repeating characters.',
      inputFormat: 'Single line: string',
      outputFormat: 'Length (integer)',
      constraints: '0 <= s.length <= 5*10^4',
      starterCode: `def lengthOfLongestSubstring(s):
    pass

s = "abcabcbb"
print(lengthOfLongestSubstring(s))`,
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
      statement: 'Group anagrams together from an array of strings.',
      inputFormat: 'Array of strings',
      outputFormat: 'Grouped anagrams',
      constraints: '1 <= strs.length <= 10^4',
      starterCode: `def groupAnagrams(strs):
    pass

strs = ["eat", "tea", "ate", "bat"]
print(groupAnagrams(strs))`,
      solution: `def groupAnagrams(strs):
    from collections import defaultdict
    anagrams = defaultdict(list)
    for word in strs:
        sorted_word = ''.join(sorted(word))
        anagrams[sorted_word].append(word)
    return list(anagrams.values())`,
    },
    {
      title: 'Valid Palindrome',
      difficulty: 'easy',
      statement: 'Check if a string is a valid palindrome considering only alphanumeric characters, ignoring case.',
      inputFormat: 'Single line: string',
      outputFormat: 'true/false',
      constraints: '1 <= s.length <= 2*10^5',
      starterCode: `def isPalindrome(s):
    pass

s = "A man, a plan, a canal: Panama"
print(isPalindrome(s))`,
      solution: `def isPalindrome(s):
    cleaned = ''.join(c.lower() for c in s if c.isalnum())
    return cleaned == cleaned[::-1]`,
    },
  ],
  'Binary Search': [
    {
      title: 'Binary Search',
      difficulty: 'easy',
      statement: 'Search for a target value in a sorted array and return its index. Return -1 if not found.',
      inputFormat: 'Line 1: n, Line 2: sorted n integers, Line 3: target',
      outputFormat: 'Index or -1',
      constraints: '1 <= n <= 10^4, -10^9 <= nums[i] <= 10^9',
      starterCode: `def search(nums, target):
    pass

nums = [-1, 0, 3, 5, 9, 12]
target = 9
print(search(nums, target))`,
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
      statement: 'Search a target in a rotated sorted array. Return index or -1.',
      inputFormat: 'Line 1: n, Line 2: n integers, Line 3: target',
      outputFormat: 'Index or -1',
      constraints: '1 <= n <= 5000',
      starterCode: `def search(nums, target):
    pass

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
    },
    {
      title: 'First Bad Version',
      difficulty: 'easy',
      statement: 'Find the first bad version. You have n versions and isBadVersion API.',
      inputFormat: 'Line 1: n (total versions), Line 2: first bad version number',
      outputFormat: 'First bad version',
      constraints: '1 <= bad <= n <= 2*10^31',
      starterCode: `def firstBadVersion(n):
    # Use the isBadVersion API
    pass

print(firstBadVersion(5))`,
      solution: `def firstBadVersion(n):
    left, right = 1, n
    while left < right:
        mid = (left + right) // 2
        if isBadVersion(mid):
            right = mid
        else:
            left = mid + 1
    return left`,
    },
  ],
};

async function seedCodingProblems() {
  try {
    console.log('🌱 Replacing theoretical questions with real coding problems...\n');

    let totalCreated = 0;
    const topicsProcessed: string[] = [];

    for (const [topicName, problems] of Object.entries(codingProblemsByTopic)) {
      console.log(`📚 Processing: ${topicName}`);

      // Find topic
      const topic = await prisma.topic.findUnique({
        where: {
          name_system: {
            name: topicName,
            system: 'coding-arena'
          }
        }
      });

      if (!topic) {
        console.log(`   ⚠️  Topic not found\n`);
        continue;
      }

      // Create problems
      for (let i = 0; i < problems.length; i++) {
        const p = problems[i];
        const slug = `${topicName.toLowerCase().replace(/\\s+/g, '-')}-${i + 1}`;

        try {
          // Upsert to avoid duplicates
          await prisma.problem.upsert({
            where: { slug },
            update: {
              title: p.title,
              statement: p.statement,
              difficulty: p.difficulty,
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
          totalCreated++;
        } catch (err: any) {
          console.error(`   ❌ Error: ${err.message}`);
        }
      }

      topicsProcessed.push(topicName);
      console.log(`   ✅ Created ${problems.length} coding problems\n`);
    }

    console.log(`\n✨ Complete!`);
    console.log(`   Topics: ${topicsProcessed.length}`);
    console.log(`   Problems: ${totalCreated}`);
    console.log(`\n📝 Each problem now has:`);
    console.log(`   ✓ Problem statement`);
    console.log(`   ✓ Starter code template`);
    console.log(`   ✓ Reference solution`);
    console.log(`   ✓ I/O format and constraints`);
    console.log(`\n🎯 All ready for students to solve!\n`);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedCodingProblems();
