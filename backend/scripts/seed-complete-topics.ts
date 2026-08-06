import * as dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

dotenv.config();

// Create fresh Prisma instance for seeding with adapter
const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

// ALL problems for each topic shown in UI
const topicsWithProblems = {
  'Sorting Techniques': [
    {
      title: 'Merge Sort Implementation',
      slug: 'merge-sort-implementation',
      difficulty: 'medium',
      statement: 'Implement merge sort and sort an array of integers.',
      inputFormat: 'First line: n (array size), second line: n space-separated integers',
      outputFormat: 'Sorted array elements space-separated',
      constraints: '1 <= n <= 10^5, -10^9 <= arr[i] <= 10^9',
      companies: 'Google,Amazon,Microsoft,Meta,Apple',
      xpReward: 75,
      starterCode: `def mergeSort(arr, left=0, right=None):\n    if right is None:\n        right = len(arr) - 1\n    if left < right:\n        mid = (left + right) // 2\n        mergeSort(arr, left, mid)\n        mergeSort(arr, mid + 1, right)\n        merge(arr, left, mid, right)\n    return arr\n\ndef merge(arr, left, mid, right):\n    pass`,
      solution: `def mergeSort(arr, left=0, right=None):\n    if right is None:\n        right = len(arr) - 1\n    if left < right:\n        mid = (left + right) // 2\n        mergeSort(arr, left, mid)\n        mergeSort(arr, mid + 1, right)\n        merge(arr, left, mid, right)\n    return arr\n\ndef merge(arr, left, mid, right):\n    left_arr = arr[left:mid + 1]\n    right_arr = arr[mid + 1:right + 1]\n    i = j = 0\n    k = left\n    while i < len(left_arr) and j < len(right_arr):\n        if left_arr[i] <= right_arr[j]:\n            arr[k] = left_arr[i]\n            i += 1\n        else:\n            arr[k] = right_arr[j]\n            j += 1\n        k += 1\n    while i < len(left_arr):\n        arr[k] = left_arr[i]\n        i += 1\n        k += 1\n    while j < len(right_arr):\n        arr[k] = right_arr[j]\n        j += 1\n        k += 1`
    },
    {
      title: 'Quick Sort Implementation',
      slug: 'quick-sort-implementation',
      difficulty: 'medium',
      statement: 'Implement quick sort using pivot partitioning.',
      inputFormat: 'First line: n, second line: n integers',
      outputFormat: 'Sorted array',
      constraints: '1 <= n <= 10^5, -10^9 <= arr[i] <= 10^9',
      companies: 'Google,Amazon,Microsoft',
      xpReward: 75,
      starterCode: `def quickSort(arr, low=0, high=None):\n    if high is None:\n        high = len(arr) - 1\n    if low < high:\n        pi = partition(arr, low, high)\n        quickSort(arr, low, pi - 1)\n        quickSort(arr, pi + 1, high)\n    return arr\n\ndef partition(arr, low, high):\n    pass`,
      solution: `def quickSort(arr, low=0, high=None):\n    if high is None:\n        high = len(arr) - 1\n    if low < high:\n        pi = partition(arr, low, high)\n        quickSort(arr, low, pi - 1)\n        quickSort(arr, pi + 1, high)\n    return arr\n\ndef partition(arr, low, high):\n    pivot = arr[high]\n    i = low - 1\n    for j in range(low, high):\n        if arr[j] < pivot:\n            i += 1\n            arr[i], arr[j] = arr[j], arr[i]\n    arr[i + 1], arr[high] = arr[high], arr[i + 1]\n    return i + 1`
    },
    {
      title: 'Heap Sort Algorithm',
      slug: 'heap-sort-algorithm',
      difficulty: 'medium',
      statement: 'Implement heap sort by building a max heap.',
      inputFormat: 'First line: n, second line: n integers',
      outputFormat: 'Sorted array',
      constraints: '1 <= n <= 10^5',
      companies: 'Google,Amazon,Microsoft',
      xpReward: 75,
      starterCode: `def heapSort(arr):\n    n = len(arr)\n    for i in range(n // 2 - 1, -1, -1):\n        heapify(arr, n, i)\n    for i in range(n - 1, 0, -1):\n        arr[0], arr[i] = arr[i], arr[0]\n        heapify(arr, i, 0)\n    return arr\n\ndef heapify(arr, n, i):\n    pass`,
      solution: `def heapSort(arr):\n    n = len(arr)\n    for i in range(n // 2 - 1, -1, -1):\n        heapify(arr, n, i)\n    for i in range(n - 1, 0, -1):\n        arr[0], arr[i] = arr[i], arr[0]\n        heapify(arr, i, 0)\n    return arr\n\ndef heapify(arr, n, i):\n    largest = i\n    left = 2 * i + 1\n    right = 2 * i + 2\n    if left < n and arr[left] > arr[largest]:\n        largest = left\n    if right < n and arr[right] > arr[largest]:\n        largest = right\n    if largest != i:\n        arr[i], arr[largest] = arr[largest], arr[i]\n        heapify(arr, n, largest)`
    }
  ],

  'Arrays': [
    {
      title: 'Two Sum',
      slug: 'two-sum',
      difficulty: 'easy',
      statement: 'Given array and target, find two numbers that add to target.',
      inputFormat: 'First line: n, second line: array, third line: target',
      outputFormat: 'Two indices',
      constraints: '2 <= n <= 10^4',
      companies: 'Google,Amazon,Microsoft,Meta',
      xpReward: 50,
      starterCode: `def twoSum(nums, target):\n    pass`,
      solution: `def twoSum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        if target - num in seen:\n            return [seen[target - num], i]\n        seen[num] = i\n    return []`
    },
    {
      title: 'Maximum Subarray',
      slug: 'maximum-subarray',
      difficulty: 'medium',
      statement: 'Find contiguous subarray with largest sum (Kadane algorithm).',
      inputFormat: 'First line: n, second line: array',
      outputFormat: 'Maximum sum',
      constraints: '1 <= n <= 10^5',
      companies: 'Amazon,Google,Bloomberg',
      xpReward: 60,
      starterCode: `def maxSubArray(nums):\n    pass`,
      solution: `def maxSubArray(nums):\n    max_sum = nums[0]\n    current_sum = nums[0]\n    for num in nums[1:]:\n        current_sum = max(num, current_sum + num)\n        max_sum = max(max_sum, current_sum)\n    return max_sum`
    },
    {
      title: 'Contains Duplicate',
      slug: 'contains-duplicate',
      difficulty: 'easy',
      statement: 'Check if array contains any duplicate element.',
      inputFormat: 'First line: n, second line: array',
      outputFormat: 'true/false',
      constraints: '1 <= n <= 10^5',
      companies: 'Google,Amazon,Meta',
      xpReward: 40,
      starterCode: `def containsDuplicate(nums):\n    pass`,
      solution: `def containsDuplicate(nums):\n    return len(nums) != len(set(nums))`
    },
    {
      title: 'Product of Array Except Self',
      slug: 'product-of-array-except-self',
      difficulty: 'medium',
      statement: 'Return array where each element is product of all others.',
      inputFormat: 'First line: n, second line: array',
      outputFormat: 'Product array',
      constraints: '2 <= n <= 10^5',
      companies: 'Google,Amazon,Microsoft',
      xpReward: 65,
      starterCode: `def productExceptSelf(nums):\n    pass`,
      solution: `def productExceptSelf(nums):\n    result = [1] * len(nums)\n    prefix = 1\n    for i in range(len(nums)):\n        result[i] *= prefix\n        prefix *= nums[i]\n    suffix = 1\n    for i in range(len(nums) - 1, -1, -1):\n        result[i] *= suffix\n        suffix *= nums[i]\n    return result`
    },
    {
      title: 'Best Time to Buy and Sell Stock',
      slug: 'best-time-buy-sell-stock',
      difficulty: 'easy',
      statement: 'Find max profit from buying and selling stock once.',
      inputFormat: 'First line: n, second line: prices',
      outputFormat: 'Maximum profit',
      constraints: '1 <= n <= 10^5, 0 <= prices[i] <= 10^4',
      companies: 'Amazon,Apple,Google',
      xpReward: 50,
      starterCode: `def maxProfit(prices):\n    pass`,
      solution: `def maxProfit(prices):\n    min_price = float('inf')\n    max_profit = 0\n    for price in prices:\n        min_price = min(min_price, price)\n        max_profit = max(max_profit, price - min_price)\n    return max_profit`
    }
  ],

  'Binary Search': [
    {
      title: 'Binary Search',
      slug: 'binary-search',
      difficulty: 'easy',
      statement: 'Find target in sorted array using binary search.',
      inputFormat: 'First line: n, second line: sorted array, third line: target',
      outputFormat: 'Index or -1',
      constraints: '1 <= n <= 10^5',
      companies: 'Google,Microsoft,Amazon',
      xpReward: 50,
      starterCode: `def search(nums, target):\n    pass`,
      solution: `def search(nums, target):\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1`
    },
    {
      title: 'Search in Rotated Sorted Array',
      slug: 'search-rotated-sorted-array',
      difficulty: 'medium',
      statement: 'Find target in rotated sorted array.',
      inputFormat: 'First line: n, second line: rotated array, third line: target',
      outputFormat: 'Index or -1',
      constraints: '1 <= n <= 5000',
      companies: 'Google,Microsoft,Amazon',
      xpReward: 65,
      starterCode: `def search(nums, target):\n    pass`,
      solution: `def search(nums, target):\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if nums[mid] == target:\n            return mid\n        if nums[left] <= nums[mid]:\n            if nums[left] <= target < nums[mid]:\n                right = mid - 1\n            else:\n                left = mid + 1\n        else:\n            if nums[mid] < target <= nums[right]:\n                left = mid + 1\n            else:\n                right = mid - 1\n    return -1`
    },
    {
      title: 'First Bad Version',
      slug: 'first-bad-version',
      difficulty: 'easy',
      statement: 'Find first bad version in sequence.',
      inputFormat: 'Integer n (total versions)',
      outputFormat: 'First bad version',
      constraints: '1 <= bad <= n <= 2*10^31 - 1',
      companies: 'Google,Facebook,Apple',
      xpReward: 45,
      starterCode: `def firstBadVersion(n):\n    pass`,
      solution: `def firstBadVersion(n):\n    left, right = 1, n\n    while left < right:\n        mid = (left + right) // 2\n        if isBadVersion(mid):\n            right = mid\n        else:\n            left = mid + 1\n    return left`
    }
  ],

  'Strings': [
    {
      title: 'Reverse String',
      slug: 'reverse-string',
      difficulty: 'easy',
      statement: 'Reverse a string in-place.',
      inputFormat: 'String s',
      outputFormat: 'Reversed string',
      constraints: '1 <= s.length <= 10^5',
      companies: 'Google,Facebook,Amazon',
      xpReward: 40,
      starterCode: `def reverseString(s):\n    pass`,
      solution: `def reverseString(s):\n    return s[::-1]`
    },
    {
      title: 'Valid Palindrome',
      slug: 'valid-palindrome',
      difficulty: 'easy',
      statement: 'Check if string is palindrome (ignore case, non-alphanumeric).',
      inputFormat: 'String s',
      outputFormat: 'true/false',
      constraints: '1 <= s.length <= 2*10^5',
      companies: 'Facebook,Amazon,Microsoft',
      xpReward: 50,
      starterCode: `def isPalindrome(s):\n    pass`,
      solution: `def isPalindrome(s):\n    s = ''.join(c.lower() for c in s if c.isalnum())\n    return s == s[::-1]`
    },
    {
      title: 'Longest Substring Without Repeating',
      slug: 'longest-substring-without-repeating',
      difficulty: 'medium',
      statement: 'Find length of longest substring without repeating characters.',
      inputFormat: 'String s',
      outputFormat: 'Length',
      constraints: '0 <= s.length <= 5*10^4',
      companies: 'Google,Amazon,Bloomberg',
      xpReward: 65,
      starterCode: `def lengthOfLongestSubstring(s):\n    pass`,
      solution: `def lengthOfLongestSubstring(s):\n    char_index = {}\n    max_len = 0\n    start = 0\n    for i, c in enumerate(s):\n        if c in char_index:\n            start = max(start, char_index[c] + 1)\n        char_index[c] = i\n        max_len = max(max_len, i - start + 1)\n    return max_len`
    },
    {
      title: 'Valid Anagram',
      slug: 'valid-anagram',
      difficulty: 'easy',
      statement: 'Determine if two strings are anagrams.',
      inputFormat: 'Two strings s and t',
      outputFormat: 'true/false',
      constraints: '1 <= s.length, t.length <= 5*10^4',
      companies: 'Google,Amazon,Meta',
      xpReward: 40,
      starterCode: `def isAnagram(s, t):\n    pass`,
      solution: `def isAnagram(s, t):\n    return sorted(s) == sorted(t)`
    },
    {
      title: 'Group Anagrams',
      slug: 'group-anagrams',
      difficulty: 'medium',
      statement: 'Group strings that are anagrams of each other.',
      inputFormat: 'Array of strings',
      outputFormat: 'Grouped anagrams',
      constraints: '1 <= strs.length <= 10^4',
      companies: 'Google,Facebook,Amazon',
      xpReward: 70,
      starterCode: `def groupAnagrams(strs):\n    pass`,
      solution: `def groupAnagrams(strs):\n    from collections import defaultdict\n    groups = defaultdict(list)\n    for s in strs:\n        key = ''.join(sorted(s))\n        groups[key].append(s)\n    return list(groups.values())`
    }
  ],

  'Linked List': [
    {
      title: 'Reverse Linked List',
      slug: 'reverse-linked-list',
      difficulty: 'easy',
      statement: 'Reverse a singly linked list.',
      inputFormat: 'Linked list head node',
      outputFormat: 'Reversed linked list',
      constraints: '0 <= nodes <= 5000',
      companies: 'Google,Amazon,Facebook',
      xpReward: 50,
      starterCode: `def reverseList(head):\n    pass`,
      solution: `def reverseList(head):\n    prev = None\n    while head:\n        next_temp = head.next\n        head.next = prev\n        prev = head\n        head = next_temp\n    return prev`
    },
    {
      title: 'Linked List Cycle Detection',
      slug: 'linked-list-cycle',
      difficulty: 'easy',
      statement: 'Detect if linked list has a cycle.',
      inputFormat: 'Linked list head',
      outputFormat: 'true/false',
      constraints: 'List length <= 10^4',
      companies: 'Google,Facebook,Amazon',
      xpReward: 50,
      starterCode: `def hasCycle(head):\n    pass`,
      solution: `def hasCycle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow == fast:\n            return True\n    return False`
    },
    {
      title: 'Merge Two Sorted Lists',
      slug: 'merge-two-sorted-lists',
      difficulty: 'easy',
      statement: 'Merge two sorted linked lists.',
      inputFormat: 'Two linked list heads',
      outputFormat: 'Merged sorted list',
      constraints: 'Nodes in both lists <= 50',
      companies: 'Google,Amazon,Microsoft',
      xpReward: 45,
      starterCode: `def mergeTwoLists(list1, list2):\n    pass`,
      solution: `def mergeTwoLists(list1, list2):\n    dummy = ListNode(0)\n    current = dummy\n    while list1 and list2:\n        if list1.val <= list2.val:\n            current.next = list1\n            list1 = list1.next\n        else:\n            current.next = list2\n            list2 = list2.next\n        current = current.next\n    current.next = list1 or list2\n    return dummy.next`
    }
  ],

  'Trees': [
    {
      title: 'Maximum Depth of Binary Tree',
      slug: 'max-depth-binary-tree',
      difficulty: 'easy',
      statement: 'Find maximum depth of binary tree.',
      inputFormat: 'Binary tree root',
      outputFormat: 'Maximum depth',
      constraints: '0 <= nodes <= 10^4',
      companies: 'Google,Facebook,Amazon',
      xpReward: 50,
      starterCode: `def maxDepth(root):\n    pass`,
      solution: `def maxDepth(root):\n    if not root:\n        return 0\n    return 1 + max(maxDepth(root.left), maxDepth(root.right))`
    },
    {
      title: 'Binary Tree Level Order Traversal',
      slug: 'binary-tree-level-order',
      difficulty: 'medium',
      statement: 'Traverse binary tree level by level.',
      inputFormat: 'Binary tree root',
      outputFormat: 'Level order list',
      constraints: '0 <= nodes <= 2000',
      companies: 'Google,Amazon,Facebook',
      xpReward: 65,
      starterCode: `def levelOrder(root):\n    pass`,
      solution: `def levelOrder(root):\n    if not root:\n        return []\n    result = []\n    queue = [root]\n    while queue:\n        level = []\n        for _ in range(len(queue)):\n            node = queue.pop(0)\n            level.append(node.val)\n            if node.left:\n                queue.append(node.left)\n            if node.right:\n                queue.append(node.right)\n        result.append(level)\n    return result`
    },
    {
      title: 'Lowest Common Ancestor',
      slug: 'lowest-common-ancestor',
      difficulty: 'medium',
      statement: 'Find LCA of two nodes in binary tree.',
      inputFormat: 'Binary tree root and two node values',
      outputFormat: 'LCA node value',
      constraints: '2 <= nodes <= 10^5',
      companies: 'Google,Microsoft,Facebook',
      xpReward: 70,
      starterCode: `def lowestCommonAncestor(root, p, q):\n    pass`,
      solution: `def lowestCommonAncestor(root, p, q):\n    if not root or root == p or root == q:\n        return root\n    left = lowestCommonAncestor(root.left, p, q)\n    right = lowestCommonAncestor(root.right, p, q)\n    if left and right:\n        return root\n    return left or right`
    }
  ]
};

export async function seedCompleteTopics() {
  try {
    console.log('🌱 Seeding complete topics with all questions...\n');
    
    let totalCreated = 0;
    let totalSkipped = 0;
    
    for (const [topicName, problems] of Object.entries(topicsWithProblems)) {
      console.log(`📚 Topic: ${topicName}`);
      console.log(`   Adding ${problems.length} problems...`);
      
      for (const problem of problems) {
        try {
          // Check if problem already exists
          const existing = await prisma.problem.findUnique({
            where: { slug: problem.slug }
          });
          
          if (existing) {
            console.log(`   ⏭️  ${problem.title}`);
            totalSkipped++;
            continue;
          }

          // Create problem
          await prisma.problem.create({
            data: {
              title: problem.title,
              slug: problem.slug,
              difficulty: problem.difficulty,
              statement: problem.statement,
              inputFormat: problem.inputFormat,
              outputFormat: problem.outputFormat,
              constraints: problem.constraints,
              companies: problem.companies,
              topics: topicName,
              starterCode: { python: problem.starterCode },
              referenceSolution: problem.solution,
              category: 'coding-arena',
              timeLimit: 2000,
              memoryLimit: 256,
              tags: problem.difficulty,
              metadata: {
                languages: ['python', 'javascript', 'java', 'cpp'],
                topics: [topicName],
                difficulty: problem.difficulty
              }
            }
          });

          console.log(`   ✅ ${problem.title}`);
          totalCreated++;
          
        } catch (err: any) {
          console.error(`   ❌ ${problem.title}: ${err.message}`);
        }
      }
      console.log('');
    }

    console.log('\n=====================================');
    console.log('✅ SEEDING COMPLETE');
    console.log('=====================================');
    console.log(`✨ Problems created: ${totalCreated}`);
    console.log(`⏭️  Already existed: ${totalSkipped}`);
    console.log(`📊 Total topics: ${Object.keys(topicsWithProblems).length}`);
    console.log(`📋 Total problems: ${totalCreated + totalSkipped}`);
    console.log('=====================================\n');

    // Verify by checking counts
    console.log('📊 VERIFICATION:');
    for (const topicName of Object.keys(topicsWithProblems)) {
      const count = await prisma.problem.count({
        where: { topics: { contains: topicName } }
      });
      console.log(`   ${topicName}: ${count} problems ✅`);
    }
    console.log('');
    
  } catch (err) {
    console.error('❌ Error:', err);
    throw err;
  } finally {
    await prisma.$disconnect();
  }
}

seedCompleteTopics().then(() => {
  console.log('🎉 Seeding finished successfully!');
  process.exit(0);
}).catch((err) => {
  console.error('🔴 Seeding failed:', err);
  process.exit(1);
});
