import { prisma } from '../config/prisma';

async function updateMaximumSumCircularSubarrayProblem() {
  try {
    // Delete any existing problem with this slug to avoid duplicates
    await prisma.question.deleteMany({
      where: { slug: 'maximum-sum-circular-subarray' }
    });

    const problem = await prisma.question.create({
      data: {
        title: 'Maximum Sum Circular Subarray',
        slug: 'maximum-sum-circular-subarray',
        difficulty: 'MEDIUM',
        topics: ['arrays', 'dynamic-programming', 'kadane-algorithm'],
        companies: ['Amazon', 'Microsoft', 'Google', 'Facebook', 'Apple', 'Adobe', 'Bloomberg'],
        xpReward: 8,
        timeLimit: 2,
        memoryLimit: 256,
        
        statement: `# Maximum Sum Circular Subarray

## Problem Statement

Given a **circular integer array** \`nums\` of length n, return the **maximum possible sum of a non-empty subarray** of nums.

A **circular array** means the end of the array connects to the beginning of the array. Formally:
- The next element of \`nums[i]\` is \`nums[(i + 1) % n]\`
- The previous element of \`nums[i]\` is \`nums[(i - 1 + n) % n]\`

A **subarray may only include each element** of the fixed buffer \`nums\` **at most once**. For a subarray \`nums[i], nums[i + 1], ..., nums[j]\`, there does not exist \`i <= k1, k2 <= j\` with \`k1 % n == k2 % n\`.

## Problem Details

- Input: A circular array of integers
- Output: Maximum sum of any subarray
- Constraints:
  - n == nums.length
  - 1 <= n <= 3 * 10^4
  - -3 * 10^4 <= nums[i] <= 3 * 10^4

## Key Insight

This problem extends Kadane's algorithm to handle circular arrays. There are two cases:
1. **Maximum subarray does not wrap around:** Use standard Kadane's algorithm
2. **Maximum subarray wraps around:** Total sum - minimum subarray sum

The trick is finding both the maximum subarray and the minimum subarray.

## Examples

### Example 1
**Input:** nums = [1, -2, 3, -2]
**Output:** 3
**Explanation:**
- Subarrays: [1], [1,-2], [1,-2,3], [1,-2,3,-2], [-2], [-2,3], [-2,3,-2], [3], [3,-2], [-2]
- And wrapped: [1,-2,3,-2,1], [-2,3,-2,1], [3,-2,1], [-2,1]
- Maximum sum: 3 (subarray [3])

### Example 2
**Input:** nums = [5, -3, 5]
**Output:** 10
**Explanation:**
- Non-wrapped: [5], [5,-3], [5,-3,5]=7, [-3], [-3,5]=2, [5]
- Wrapped: [5,5] (wrapping around, elements at indices 0 and 2)
- Maximum sum: 10 (subarray [5,5] wrapping around)

### Example 3
**Input:** nums = [-3, -2, -3]
**Output:** -2
**Explanation:**
- All positive combinations have negatives
- Best is single element [-2]
- Cannot take all and wrap (still negative)

### Example 4
**Input:** nums = [3, -1, 2, -1]
**Output:** 4
**Explanation:**
- Total sum: 3
- Non-wrapped max: [3,-1,2] = 4
- Wrapped would be: total - min, min = [-1,-1] = -2, wrapped = 3 - (-2) = 5
- But we need to check: if we exclude [-1,-1], we get [3,2] = 5
- Actually, wrapped: [3,2] wrapping (indices 0,2) = 5, or [2,-1,3] wrapping = 4
- Maximum: 5

### Example 5
**Input:** nums = [1]
**Output:** 1
**Explanation:**
- Only one element, subarray is [1]
- Maximum sum: 1

## Algorithm Approaches

### Approach 1: Kadane's + Total Sum - Min Subarray (Optimal)
**Time Complexity:** O(n)
**Space Complexity:** O(1)

Steps:
1. Apply Kadane's algorithm to find max subarray sum (non-wrapped)
2. Apply modified Kadane's to find min subarray sum
3. Check two cases:
   - Case 1: max_subarray_sum (non-wrapped)
   - Case 2: total_sum - min_subarray_sum (wrapped)
4. Return maximum of two cases
5. Edge case: If all elements are negative and we take min_subarray = total_sum, return max_subarray instead

**Why it works:**
- If max wraps around, it equals total - (minimum subarray)
- We check both wrapped and non-wrapped possibilities
- Special case: all negatives (min_subarray = total_sum)

### Approach 2: Brute Force All Subarrays
**Time Complexity:** O(n^2)
**Space Complexity:** O(1)

Steps:
1. For each starting position i
2. For each ending position j (considering circular)
3. Calculate subarray sum
4. Track maximum

**Limitation:** Too slow for n up to 3*10^4

### Approach 3: Prefix Sum + Two Pointers
**Time Complexity:** O(n)
**Space Complexity:** O(n)

Steps:
1. Build prefix sum array
2. Use circular logic to calculate sums
3. Track maximum

## Correctness Proof

**Theorem:** Maximum sum circular subarray is either the max non-wrapped subarray or (total - min subarray).

**Proof:**
1. Case 1: If max subarray doesn't wrap, Kadane's finds it
2. Case 2: If max subarray wraps (like [end-elements...start-elements]):
   - Wrapped subarray = total - (excluded middle elements)
   - Excluded middle elements form a contiguous subarray
   - To maximize wrapped, minimize the middle part
   - Hence: wrapped_max = total - min_subarray
3. Therefore: answer = max(Case1, Case2)

## Handling Edge Cases

**All positive:** Take all elements = total sum
**All negative:** Take largest (least negative) single element
**Mix:** Compare wrapped vs non-wrapped

## Special Cases

1. **n = 1:** Only element itself
2. **All elements same:** Sum of all or single element
3. **One positive among negatives:** Return the positive
4. **min_subarray = total_sum:** All elements are minimum, skip this case

## Common Mistakes

1. **Forgetting all-negative case:** min_subarray = total_sum, which gives 0 when subtracted (wrong)
2. **Not handling single element:** Edge case for n = 1
3. **Off-by-one in circular:** Getting indices wrong with modulo
4. **Integer overflow:** Use long if needed
5. **Not checking both cases:** Must compare wrapped and non-wrapped
6. **Negative total:** When all elements are negative, wrapped case fails

## Edge Cases

- **Single element:** nums = [5] → 5
- **All positive:** nums = [1, 2, 3] → 6
- **All negative:** nums = [-1, -2, -3] → -1
- **One positive:** nums = [-5, 10, -5] → 10
- **Mix with wrap:** nums = [5, -3, 5] → 10

## Interview Tips

- **Explain circular array:** Draw the array as circular
- **Two cases approach:** Explain why we need both cases
- **Kadane's algorithm:** Review standard Kadane's first
- **Edge case handling:** Discuss all-negative scenario
- **Complexity:** O(n) time with single pass (optimized version)
- **Follow-ups:**
  - What if we need to return the actual subarray indices?
  - How to handle if rotation is allowed?
  - What if we need k subarrays instead of 1?
  - Can we do it with limited memory?

## Real-World Applications

- **Circular buffers:** Stock price analysis in rolling time windows
- **Network routing:** Finding optimal circular paths
- **Game levels:** Circular track optimization
- **Inventory:** Circular queue analysis
- **Time series:** Cyclic data analysis

## Why This Problem Matters

This problem teaches:
1. **Extensions of classic algorithms:** Adapting Kadane's to new constraints
2. **Case analysis:** Handling multiple scenarios
3. **Circular array handling:** Using modulo arithmetic
4. **Optimization intuition:** Relating wrapped sum to total - min
5. **Edge case awareness:** All-negative scenario

## Complexity Comparison

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Kadane's + Min | O(n) | O(1) | Optimal |
| Brute Force | O(n^2) | O(1) | Simple but slow |
| Prefix Sum | O(n) | O(n) | Alternative |
| Prefix + Deque | O(n) | O(n) | Advanced |

## Key Learning Points

- Maximum circular subarray = max(Kadane result, total - min_subarray)
- Handle all-negative edge case separately
- Use modulo for circular indexing
- Track both max and min during single pass
- Understand when wrapping is beneficial
`,

        inputFormat: `Array of integers separated by spaces
Format: Space-separated integers`,

        outputFormat: `A single integer representing maximum sum of circular subarray`,

        constraints: `- n == nums.length
- 1 <= n <= 3 * 10^4
- -3 * 10^4 <= nums[i] <= 3 * 10^4`,

        sampleInput: '1 -2 3 -2',
        sampleOutput: '3',

        templates: [
          {
            language: 'python',
            code: `def maxSubarraySumCircular(nums):
    """
    Find maximum sum of subarray in circular array.
    
    Args:
        nums: List of integers representing circular array
        
    Returns:
        Maximum sum of any subarray (wrapped or non-wrapped)
    """
    def kadane_max(arr):
        """Find maximum subarray sum"""
        max_sum = float('-inf')
        current_sum = 0
        for num in arr:
            current_sum = max(num, current_sum + num)
            max_sum = max(max_sum, current_sum)
        return max_sum
    
    def kadane_min(arr):
        """Find minimum subarray sum"""
        min_sum = float('inf')
        current_sum = 0
        for num in arr:
            current_sum = min(num, current_sum + num)
            min_sum = min(min_sum, current_sum)
        return min_sum
    
    # Case 1: Maximum subarray doesn't wrap (standard Kadane)
    max_kadane = kadane_max(nums)
    
    # Case 2: Maximum subarray wraps around
    total_sum = sum(nums)
    min_subarray = kadane_min(nums)
    max_wrap = total_sum - min_subarray
    
    # Edge case: if min_subarray = total_sum, all elements are excluded
    # This means we took the wrap case with nothing in middle
    if max_wrap == 0:
        return max_kadane
    
    return max(max_kadane, max_wrap)

# Test cases
if __name__ == "__main__":
    print(maxSubarraySumCircular([1, -2, 3, -2]))      # Output: 3
    print(maxSubarraySumCircular([5, -3, 5]))          # Output: 10
    print(maxSubarraySumCircular([-3, -2, -3]))        # Output: -2
    print(maxSubarraySumCircular([3, -1, 2, -1]))      # Output: 3
    print(maxSubarraySumCircular([1]))                 # Output: 1`
          },
          {
            language: 'javascript',
            code: `function maxSubarraySumCircular(nums) {
    /**
     * Find maximum sum of subarray in circular array.
     * 
     * @param {number[]} nums - Array of integers representing circular array
     * @return {number} - Maximum sum of any subarray
     */
    
    function kadaneMax(arr) {
        let maxSum = -Infinity;
        let currentSum = 0;
        for (let num of arr) {
            currentSum = Math.max(num, currentSum + num);
            maxSum = Math.max(maxSum, currentSum);
        }
        return maxSum;
    }
    
    function kadaneMin(arr) {
        let minSum = Infinity;
        let currentSum = 0;
        for (let num of arr) {
            currentSum = Math.min(num, currentSum + num);
            minSum = Math.min(minSum, currentSum);
        }
        return minSum;
    }
    
    // Case 1: Maximum subarray doesn't wrap (standard Kadane)
    const maxKadane = kadaneMax(nums);
    
    // Case 2: Maximum subarray wraps around
    const totalSum = nums.reduce((a, b) => a + b, 0);
    const minSubarray = kadaneMin(nums);
    const maxWrap = totalSum - minSubarray;
    
    // Edge case: if min_subarray = total_sum, all elements excluded
    if (maxWrap === 0) {
        return maxKadane;
    }
    
    return Math.max(maxKadane, maxWrap);
}

// Test cases
console.log(maxSubarraySumCircular([1, -2, 3, -2]));   // Output: 3
console.log(maxSubarraySumCircular([5, -3, 5]));       // Output: 10
console.log(maxSubarraySumCircular([-3, -2, -3]));     // Output: -2
console.log(maxSubarraySumCircular([3, -1, 2, -1]));   // Output: 3
console.log(maxSubarraySumCircular([1]));              // Output: 1`
          },
          {
            language: 'cpp',
            code: `#include <iostream>
#include <vector>
#include <algorithm>
#include <climits>
#include <numeric>
using namespace std;

int maxSubarraySumCircular(vector<int>& nums) {
    /**
     * Find maximum sum of subarray in circular array.
     * 
     * @param nums - Vector of integers representing circular array
     * @return - Maximum sum of any subarray
     */
    
    auto kadaneMax = [](const vector<int>& arr) {
        int maxSum = INT_MIN;
        int currentSum = 0;
        for (int num : arr) {
            currentSum = max(num, currentSum + num);
            maxSum = max(maxSum, currentSum);
        }
        return maxSum;
    };
    
    auto kadaneMin = [](const vector<int>& arr) {
        int minSum = INT_MAX;
        int currentSum = 0;
        for (int num : arr) {
            currentSum = min(num, currentSum + num);
            minSum = min(minSum, currentSum);
        }
        return minSum;
    };
    
    // Case 1: Maximum subarray doesn't wrap
    int maxKadane = kadaneMax(nums);
    
    // Case 2: Maximum subarray wraps around
    int totalSum = accumulate(nums.begin(), nums.end(), 0);
    int minSubarray = kadaneMin(nums);
    int maxWrap = totalSum - minSubarray;
    
    // Edge case: if all elements are part of min subarray
    if (maxWrap == 0) {
        return maxKadane;
    }
    
    return max(maxKadane, maxWrap);
}

// Test cases
int main() {
    vector<int> test1 = {1, -2, 3, -2};
    vector<int> test2 = {5, -3, 5};
    vector<int> test3 = {-3, -2, -3};
    vector<int> test4 = {3, -1, 2, -1};
    vector<int> test5 = {1};
    
    cout << maxSubarraySumCircular(test1) << endl;  // Output: 3
    cout << maxSubarraySumCircular(test2) << endl;  // Output: 10
    cout << maxSubarraySumCircular(test3) << endl;  // Output: -2
    cout << maxSubarraySumCircular(test4) << endl;  // Output: 3
    cout << maxSubarraySumCircular(test5) << endl;  // Output: 1
    
    return 0;
}`
          },
          {
            language: 'java',
            code: `public class Solution {
    /**
     * Find maximum sum of subarray in circular array.
     * 
     * @param nums - Array of integers representing circular array
     * @return - Maximum sum of any subarray
     */
    public int maxSubarraySumCircular(int[] nums) {
        // Case 1: Maximum subarray doesn't wrap (standard Kadane)
        int maxKadane = kadaneMax(nums);
        
        // Case 2: Maximum subarray wraps around
        int totalSum = 0;
        for (int num : nums) {
            totalSum += num;
        }
        
        int minSubarray = kadaneMin(nums);
        int maxWrap = totalSum - minSubarray;
        
        // Edge case: if all elements are part of min subarray
        if (maxWrap == 0) {
            return maxKadane;
        }
        
        return Math.max(maxKadane, maxWrap);
    }
    
    private int kadaneMax(int[] arr) {
        int maxSum = Integer.MIN_VALUE;
        int currentSum = 0;
        for (int num : arr) {
            currentSum = Math.max(num, currentSum + num);
            maxSum = Math.max(maxSum, currentSum);
        }
        return maxSum;
    }
    
    private int kadaneMin(int[] arr) {
        int minSum = Integer.MAX_VALUE;
        int currentSum = 0;
        for (int num : arr) {
            currentSum = Math.min(num, currentSum + num);
            minSum = Math.min(minSum, currentSum);
        }
        return minSum;
    }
    
    // Test cases
    public static void main(String[] args) {
        Solution sol = new Solution();
        
        System.out.println(sol.maxSubarraySumCircular(new int[]{1, -2, 3, -2}));   // Output: 3
        System.out.println(sol.maxSubarraySumCircular(new int[]{5, -3, 5}));       // Output: 10
        System.out.println(sol.maxSubarraySumCircular(new int[]{-3, -2, -3}));     // Output: -2
        System.out.println(sol.maxSubarraySumCircular(new int[]{3, -1, 2, -1}));   // Output: 3
        System.out.println(sol.maxSubarraySumCircular(new int[]{1}));              // Output: 1
    }
}`
          }
        ],

        testCases: [
          // Visible test cases
          {
            input: '1 -2 3 -2',
            output: '3',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '5 -3 5',
            output: '10',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '-3 -2 -3',
            output: '-2',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '3 -1 2 -1',
            output: '3',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '1',
            output: '1',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '1 2 3',
            output: '6',
            isHidden: false,
            type: 'visible'
          },
          // Hidden test cases - wrap around
          {
            input: '10 -5 10',
            output: '20',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '8 -1 8',
            output: '16',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '5 -10 5',
            output: '10',
            isHidden: true,
            type: 'hidden'
          },
          // Hidden test cases - no wrap
          {
            input: '1 2 -1 3',
            output: '5',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '2 -1 2 -1',
            output: '2',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '-1 -2 -3 -4 -5',
            output: '-1',
            isHidden: true,
            type: 'hidden'
          },
          // Hidden test cases - all positive
          {
            input: '1 2 3 4 5',
            output: '15',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '5 5 5',
            output: '15',
            isHidden: true,
            type: 'hidden'
          },
          // Hidden test cases - mixed
          {
            input: '3 1 -100 2 -3 4',
            output: '7',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '-5 0 -3 5',
            output: '5',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '10 -3 -10 10',
            output: '17',
            isHidden: true,
            type: 'hidden'
          },
          // Hidden test cases - large values
          {
            input: '30000 -20000 30000',
            output: '60000',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '-30000 -30000 -30000',
            output: '-30000',
            isHidden: true,
            type: 'hidden'
          },
          // Edge cases
          {
            input: '100',
            output: '100',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '-100',
            output: '-100',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '0 0 0',
            output: '0',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '1 -1 1 -1',
            output: '1',
            isHidden: true,
            type: 'edge'
          }
        ]
      }
    });

    console.log('✅ Maximum Sum Circular Subarray problem created successfully!');
    console.log('Problem ID:', problem.id);
    console.log('Slug:', problem.slug);
    console.log('Difficulty:', problem.difficulty);
    console.log('XP Reward:', problem.xpReward);
    const testCasesArray = Array.isArray(problem.testCases) ? problem.testCases : [];
    console.log('Test Cases:', testCasesArray.length);

  } catch (error) {
    console.error('❌ Error creating Maximum Sum Circular Subarray problem:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateMaximumSumCircularSubarrayProblem();
