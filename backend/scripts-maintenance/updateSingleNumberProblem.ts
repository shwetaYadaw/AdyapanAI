import { prisma } from '../config/prisma';

async function updateSingleNumberProblem() {
  try {
    // Delete any existing problem with this slug to avoid duplicates
    await prisma.question.deleteMany({
      where: { slug: 'single-number' }
    });

    const problem = await prisma.question.create({
      data: {
        title: 'Single Number',
        slug: 'single-number',
        difficulty: 'EASY',
        topics: ['bit-manipulation', 'arrays'],
        companies: ['Microsoft', 'Google', 'Amazon', 'Apple', 'Facebook', 'Uber', 'LinkedIn', 'Adobe'],
        xpReward: 5,
        timeLimit: 1,
        memoryLimit: 256,
        
        statement: `# Single Number

## Problem Statement

Given a **non-empty array** of integers where **every element appears exactly twice except for one element which appears only once**. Find that single element.

You must implement a solution with:
- **Linear runtime complexity:** O(n)
- **Constant extra space:** O(1)

This constraint rules out using hash maps or sorting.

## Problem Details

- Input: A non-empty array of integers
- Output: The single element that appears only once
- Constraints:
  - 1 <= nums.length <= 3 * 10^4
  - -3 * 10^4 <= nums[i] <= 3 * 10^4
  - Each element appears twice except one

## Key Insight

The key to solving this efficiently is the **XOR (exclusive OR) operation**:
- a XOR a = 0 (XOR of a number with itself is 0)
- a XOR 0 = a (XOR of a number with 0 is the number itself)
- a XOR b = b XOR a (XOR is commutative)
- (a XOR b) XOR c = a XOR (b XOR c) (XOR is associative)

Since all elements except one appear twice, XORing all elements will cancel out the pairs, leaving only the single element.

## Examples

### Example 1
**Input:** nums = [2, 2, 1]
**Output:** 1
**Explanation:**
- 2 appears twice, 1 appears once
- XOR computation: 2 XOR 2 XOR 1 = 0 XOR 1 = 1
- Result: 1

### Example 2
**Input:** nums = [4, 1, 2, 1, 2]
**Output:** 4
**Explanation:**
- 1 appears twice, 2 appears twice, 4 appears once
- XOR computation: 4 XOR 1 XOR 2 XOR 1 XOR 2 = 4 XOR (1 XOR 1) XOR (2 XOR 2) = 4 XOR 0 XOR 0 = 4
- Result: 4

### Example 3
**Input:** nums = [1]
**Output:** 1
**Explanation:**
- Single element, appears once
- Result: 1

### Example 4
**Input:** nums = [-1, -1, 0, 1, 1, 5, 5]
**Output:** 0
**Explanation:**
- All elements except 0 appear twice
- XOR computation: -1 XOR -1 XOR 0 XOR 1 XOR 1 XOR 5 XOR 5 = 0
- Result: 0

### Example 5
**Input:** nums = [30000]
**Output:** 30000
**Explanation:**
- Single element at maximum constraint value
- Result: 30000

## Algorithm Approaches

### Approach 1: XOR Bit Manipulation (Optimal)
**Time Complexity:** O(n)
**Space Complexity:** O(1)

Steps:
1. Initialize result = 0
2. Iterate through each element in the array
3. XOR each element with result: result = result XOR nums[i]
4. Return result

**Why it works:**
- XOR of identical numbers is 0
- All paired elements cancel out
- Only the single element remains

**Example trace for [4, 1, 2, 1, 2]:**
- result = 0
- result = result XOR 4 gives 4
- result = result XOR 1 gives 5
- result = result XOR 2 gives 7
- result = result XOR 1 gives 6
- result = result XOR 2 gives 4

### Approach 2: Hash Set (Not Optimal, for Comparison)
**Time Complexity:** O(n)
**Space Complexity:** O(n) - Violates the O(1) space constraint

Steps:
1. Use a set to track elements
2. For each element: if in set, remove; else add
3. Return the remaining element

**Limitation:** Uses O(n) extra space, violates problem constraints

### Approach 3: Hash Map with Counts (Not Optimal)
**Time Complexity:** O(n)
**Space Complexity:** O(n) - Violates the O(1) space constraint

Steps:
1. Count occurrences of each element
2. Find element with count = 1
3. Return that element

**Limitation:** Uses O(n) extra space, violates problem constraints

### Approach 4: Sorting (Not Optimal)
**Time Complexity:** O(n log n)
**Space Complexity:** O(1) or O(n) depending on sort

Steps:
1. Sort the array
2. Compare adjacent pairs
3. If pair does not match, one is the single element

**Limitation:** Does not meet O(n) time complexity requirement

## Correctness Proof

**Theorem:** XORing all elements where all appear twice except one yields that single element.

**Proof:**
1. Let the array be [a, a, b, b, c]
2. XOR all: a XOR a XOR b XOR b XOR c
3. By associativity and commutativity: (a XOR a) XOR (b XOR b) XOR c
4. By property: 0 XOR 0 XOR c
5. By identity: c

**Generalization:** For any array where all elements appear even times except one:
- All even-occurring elements cancel to 0
- Only odd-occurring (single) element remains

## Properties of XOR Used

| Property | Formula | Example |
|----------|---------|---------|
| Identity | a XOR 0 = a | 5 XOR 0 = 5 |
| Self | a XOR a = 0 | 5 XOR 5 = 0 |
| Commutative | a XOR b = b XOR a | 3 XOR 5 = 5 XOR 3 |
| Associative | (a XOR b) XOR c = a XOR (b XOR c) | (3 XOR 5) XOR 7 = 3 XOR (5 XOR 7) |

## Common Mistakes

1. **Forgetting XOR properties:** Not recognizing that a XOR a = 0
2. **Using forbidden approaches:** Hash maps/sets use O(n) space (violates constraints)
3. **Using sorting:** Changes time complexity to O(n log n)
4. **Not handling negative numbers:** XOR works perfectly with negative integers in two's complement
5. **Off-by-one errors:** Ensure loop covers all elements
6. **Integer overflow:** Not an issue with XOR operation

## Edge Cases

- **Single element array:** nums = [1] returns 1
- **Minimum array size:** nums = [x, x, y] returns y
- **Maximum array size:** 3 * 10^4 elements
- **Negative numbers:** nums = [-1, -1, 2] returns 2
- **Zeros:** nums = [0, 0, 1] returns 1
- **Range extremes:** nums with values +/- 3 * 10^4
- **Large negative:** nums = [-30000, -30000, 5] returns 5

## Interview Tips

- **Explain XOR first:** Start by explaining the key property a XOR a = 0
- **Draw binary examples:** Show how XOR works at the bit level
- **Discuss space constraint:** Emphasize why O(1) space rules out hash maps
- **Mention time complexity:** Explain why sorting won't work (O(n log n))
- **Consider variations:**
  - What if three elements appear once and the rest twice?
  - What if all elements appear twice except two appear once?
  - Can you do it without modifying the array?
- **Real-world applications:**
  - Error detection in data transmission
  - Finding unique elements in large datasets
  - Cryptography and encryption
  - Memory-constrained systems

## Why This Matters

This problem is a **classic bit manipulation problem** that:
1. Tests understanding of XOR properties
2. Requires space-efficient thinking (O(1) constraint)
3. Emphasizes the importance of algorithm optimization
4. Appears in many coding interviews
5. Is used in real-world applications like error detection
`,

        inputFormat: `A non-empty array of integers where each element appears twice except one. Format: Space-separated integers on a single line`,

        outputFormat: `A single integer representing the element that appears only once`,

        constraints: `- 1 <= nums.length <= 3 * 10^4
- -3 * 10^4 <= nums[i] <= 3 * 10^4
- Each element appears twice except one
- Must use O(1) extra space
- Must use O(n) time complexity`,

        sampleInput: '2 2 1',
        sampleOutput: '1',

        templates: [
          {
            language: 'python',
            code: `def singleNumber(nums: list) -> int:
    """
    Find the single number in array where all others appear twice.
    Uses XOR bit manipulation for O(1) space complexity.
    
    Args:
        nums: Array where all elements appear twice except one
        
    Returns:
        The single number that appears only once
    """
    result = 0
    for num in nums:
        result ^= num  # XOR each element
    return result

# Alternative: Using functools.reduce
from functools import reduce
from operator import xor

def singleNumber_v2(nums: list) -> int:
    """Alternative: Using reduce with XOR operator"""
    return reduce(xor, nums)

# Alternative: More explicit version
def singleNumber_v3(nums: list) -> int:
    """Alternative: Explicit loop with explanation"""
    result = 0
    for num in nums:
        # XOR is its own inverse
        # a XOR a = 0, so paired elements cancel
        # a XOR 0 = a, so single element remains
        result = result ^ num
    return result

# Test cases
if __name__ == "__main__":
    print(singleNumber([2, 2, 1]))              # Output: 1
    print(singleNumber([4, 1, 2, 1, 2]))        # Output: 4
    print(singleNumber([1]))                     # Output: 1
    print(singleNumber([-1, -1, 0, 1, 1]))      # Output: 0
    print(singleNumber([7, 3, 5, 4, 3, 4, 5]))  # Output: 7`
          },
          {
            language: 'javascript',
            code: `function singleNumber(nums) {
    /**
     * Find the single number in array where all others appear twice.
     * Uses XOR bit manipulation for O(1) space complexity.
     * 
     * @param {number[]} nums - Array where all elements appear twice except one
     * @return {number} - The single number that appears only once
     */
    let result = 0;
    for (let num of nums) {
        result ^= num;  // XOR each element
    }
    return result;
}

// Alternative: Using reduce
function singleNumber_v2(nums) {
    return nums.reduce((result, num) => result ^ num, 0);
}

// Alternative: Using forEach
function singleNumber_v3(nums) {
    let result = 0;
    nums.forEach(num => {
        result = result ^ num;
    });
    return result;
}

// Test cases
console.log(singleNumber([2, 2, 1]));              // Output: 1
console.log(singleNumber([4, 1, 2, 1, 2]));        // Output: 4
console.log(singleNumber([1]));                     // Output: 1
console.log(singleNumber([-1, -1, 0, 1, 1]));      // Output: 0
console.log(singleNumber([7, 3, 5, 4, 3, 4, 5]));  // Output: 7`
          },
          {
            language: 'cpp',
            code: `#include <iostream>
#include <vector>
using namespace std;

int singleNumber(vector<int>& nums) {
    /**
     * Find the single number in array where all others appear twice.
     * Uses XOR bit manipulation for O(1) space complexity.
     * 
     * @param nums - Vector where all elements appear twice except one
     * @return - The single number that appears only once
     */
    int result = 0;
    for (int num : nums) {
        result ^= num;  // XOR each element
    }
    return result;
}

// Alternative: Using traditional for loop
int singleNumber_v2(vector<int>& nums) {
    int result = 0;
    for (size_t i = 0; i < nums.size(); i++) {
        result ^= nums[i];
    }
    return result;
}

// Alternative: Using accumulate
#include <numeric>
int singleNumber_v3(vector<int>& nums) {
    return accumulate(nums.begin(), nums.end(), 0, 
                     [](int a, int b) { return a ^ b; });
}

// Test cases
int main() {
    vector<int> test1 = {2, 2, 1};
    vector<int> test2 = {4, 1, 2, 1, 2};
    vector<int> test3 = {1};
    vector<int> test4 = {-1, -1, 0, 1, 1};
    vector<int> test5 = {7, 3, 5, 4, 3, 4, 5};
    
    cout << singleNumber(test1) << endl;   // Output: 1
    cout << singleNumber(test2) << endl;   // Output: 4
    cout << singleNumber(test3) << endl;   // Output: 1
    cout << singleNumber(test4) << endl;   // Output: 0
    cout << singleNumber(test5) << endl;   // Output: 7
    
    return 0;
}`
          },
          {
            language: 'java',
            code: `public class Solution {
    /**
     * Find the single number in array where all others appear twice.
     * Uses XOR bit manipulation for O(1) space complexity.
     * 
     * @param nums - Array where all elements appear twice except one
     * @return - The single number that appears only once
     */
    public int singleNumber(int[] nums) {
        int result = 0;
        for (int num : nums) {
            result ^= num;  // XOR each element
        }
        return result;
    }
    
    // Alternative: Using traditional for loop
    public int singleNumber_v2(int[] nums) {
        int result = 0;
        for (int i = 0; i < nums.length; i++) {
            result ^= nums[i];
        }
        return result;
    }
    
    // Alternative: More explicit with comments
    public int singleNumber_v3(int[] nums) {
        int result = 0;
        
        // XOR all elements
        // Since a XOR a = 0 and a XOR 0 = a,
        // all paired elements cancel out,
        // leaving only the single element
        for (int num : nums) {
            result ^= num;
        }
        
        return result;
    }
    
    // Test cases
    public static void main(String[] args) {
        Solution sol = new Solution();
        
        System.out.println(sol.singleNumber(new int[]{2, 2, 1}));              // Output: 1
        System.out.println(sol.singleNumber(new int[]{4, 1, 2, 1, 2}));        // Output: 4
        System.out.println(sol.singleNumber(new int[]{1}));                     // Output: 1
        System.out.println(sol.singleNumber(new int[]{-1, -1, 0, 1, 1}));      // Output: 0
        System.out.println(sol.singleNumber(new int[]{7, 3, 5, 4, 3, 4, 5}));  // Output: 7
    }
}`
          }
        ],

        testCases: [
          // Visible test cases
          {
            input: '2 2 1',
            output: '1',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '4 1 2 1 2',
            output: '4',
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
            input: '0 0 1',
            output: '1',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '-1 -1 2',
            output: '2',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '5 5 7 7 3',
            output: '3',
            isHidden: false,
            type: 'visible'
          },
          // Hidden test cases - various patterns
          {
            input: '2 2 3',
            output: '3',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '10 10 20 20 30',
            output: '30',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '0 0 0',
            output: '0',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '100 100 200 200 300 300 42',
            output: '42',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '1 2 1 3 2 3 4',
            output: '4',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '-5 -5 -10 -10 15',
            output: '15',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '7 3 5 4 3 4 5',
            output: '7',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '999 999 888 888 777',
            output: '777',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '-1000 -1000 2000 2000 5000',
            output: '5000',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '11 11 22 22 33 33 44 44 55 55 99',
            output: '99',
            isHidden: true,
            type: 'hidden'
          },
          // Hidden test cases - single element
          {
            input: '5',
            output: '5',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '-9999',
            output: '-9999',
            isHidden: true,
            type: 'hidden'
          },
          // Hidden test cases - with zeros
          {
            input: '0 0 1 1 2',
            output: '2',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '0 1 1 2 2 3 3',
            output: '0',
            isHidden: true,
            type: 'hidden'
          },
          // Hidden test cases - negative and positive mix
          {
            input: '-5 10 -5 10 20',
            output: '20',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '-1 -2 -1 -2 100',
            output: '100',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '-30000 -30000 15000 15000 7',
            output: '7',
            isHidden: true,
            type: 'hidden'
          },
          // Edge cases - maximum range
          {
            input: '30000 30000 -30000 -30000 1',
            output: '1',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '30000 30000 -30000 -30000 0',
            output: '0',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '30000 30000 -30000 -30000 -1',
            output: '-1',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '29999 29999 -29999 -29999 12345',
            output: '12345',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '1 1 2 2 3 3 4 4 5 5 6 6 7 7 8 8 9 9 10',
            output: '10',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '-100 -100 -200 -200 -300 -300 -400 -400 999',
            output: '999',
            isHidden: true,
            type: 'edge'
          }
        ]
      }
    });

    console.log('✅ Single Number problem created successfully!');
    console.log('Problem ID:', problem.id);
    console.log('Slug:', problem.slug);
    console.log('Difficulty:', problem.difficulty);
    console.log('XP Reward:', problem.xpReward);
    const testCasesArray = Array.isArray(problem.testCases) ? problem.testCases : [];
    console.log('Test Cases:', testCasesArray.length);

  } catch (error) {
    console.error('❌ Error creating Single Number problem:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateSingleNumberProblem();
