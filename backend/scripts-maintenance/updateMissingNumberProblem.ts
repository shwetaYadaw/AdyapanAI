import { prisma } from '../config/prisma';

async function updateMissingNumberProblem() {
  try {
    // Delete any existing problem with this slug to avoid duplicates
    await prisma.question.deleteMany({
      where: { slug: 'missing-number' }
    });

    const problem = await prisma.question.create({
      data: {
        title: 'Missing Number',
        slug: 'missing-number',
        difficulty: 'EASY',
        topics: ['bit-manipulation', 'arrays', 'math'],
        companies: ['Microsoft', 'Google', 'Amazon', 'Apple', 'Facebook', 'Adobe', 'LinkedIn', 'TCS'],
        xpReward: 4,
        timeLimit: 1,
        memoryLimit: 256,
        
        statement: `# Missing Number

## Problem Statement

Given an array \`nums\` containing \`n\` **distinct numbers** in the range **[0, n]**, return the **only number in the range that is missing** from the array.

Since the array contains all numbers from 0 to n except one, there is always exactly one missing number.

## Problem Details

- Input: An array of n distinct integers
- Output: The single missing number in range [0, n]
- Constraints:
  - n == nums.length
  - 1 <= n <= 10^4
  - 0 <= nums[i] <= n
  - All numbers in nums are unique

## Key Insight

Since we have n numbers in the range [0, n], exactly one number is missing. There are multiple elegant approaches to find it.

## Examples

### Example 1
**Input:** nums = [3, 0, 1]
**Output:** 2
**Explanation:**
- n = 3 (array has 3 elements)
- Range is [0, 1, 2, 3]
- Array has [3, 0, 1]
- Missing number: 2

### Example 2
**Input:** nums = [0, 1]
**Output:** 2
**Explanation:**
- n = 2 (array has 2 elements)
- Range is [0, 1, 2]
- Array has [0, 1]
- Missing number: 2

### Example 3
**Input:** nums = [9, 6, 4, 2, 3, 5, 7, 0, 1]
**Output:** 8
**Explanation:**
- n = 9 (array has 9 elements)
- Range is [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
- Array has [9, 6, 4, 2, 3, 5, 7, 0, 1]
- Missing number: 8

### Example 4
**Input:** nums = [0]
**Output:** 1
**Explanation:**
- n = 1 (array has 1 element)
- Range is [0, 1]
- Array has [0]
- Missing number: 1

### Example 5
**Input:** nums = [0, 2]
**Output:** 1
**Explanation:**
- n = 2 (array has 2 elements)
- Range is [0, 1, 2]
- Array has [0, 2]
- Missing number: 1

## Algorithm Approaches

### Approach 1: Mathematical Sum Formula (Optimal)
**Time Complexity:** O(n)
**Space Complexity:** O(1)

Steps:
1. Calculate expected sum of [0, 1, 2, ..., n] using formula: n * (n + 1) / 2
2. Calculate actual sum of array elements
3. Missing number = Expected sum - Actual sum

**Why it works:**
- Sum of 0 to n: 0 + 1 + 2 + ... + n = n * (n + 1) / 2
- If one number is missing, actual sum will be less
- Difference gives the missing number

**Example:** nums = [3, 0, 1]
- n = 3
- Expected sum: 3 * 4 / 2 = 6
- Actual sum: 3 + 0 + 1 = 4
- Missing: 6 - 4 = 2

### Approach 2: XOR Bit Manipulation
**Time Complexity:** O(n)
**Space Complexity:** O(1)

Steps:
1. XOR all array elements
2. XOR the result with all numbers from 0 to n
3. Properties: a XOR a = 0, a XOR 0 = a
4. All pairs cancel, leaving missing number

**Why it works:**
- XOR of identical numbers is 0
- XOR preserves unique value
- Similar to Single Number problem

### Approach 3: HashSet (Not Optimal)
**Time Complexity:** O(n)
**Space Complexity:** O(n)

Steps:
1. Add all array elements to a set
2. Iterate from 0 to n, find first missing
3. Return missing number

**Limitation:** Uses O(n) extra space

### Approach 4: Sorting (Not Optimal)
**Time Complexity:** O(n log n)
**Space Complexity:** O(1)

Steps:
1. Sort the array
2. Check for gap in sequence
3. If no gap, last number is missing

**Limitation:** Slower than optimal approaches

### Approach 5: Index Marking (Not Optimal)
**Time Complexity:** O(n)
**Space Complexity:** O(n)

Steps:
1. Use array indices to mark presence
2. Find unmarked index
3. Return corresponding number

**Limitation:** Modifies input array

## Correctness Proof

**Theorem:** Sum formula correctly identifies missing number.

**Proof:**
1. Let missing number be m
2. Array sum: S_actual = (0 + 1 + ... + n) - m
3. Expected sum: S_expected = n * (n + 1) / 2
4. Therefore: m = S_expected - S_actual

**Example with proof:**
- Range: [0, 1, 2, 3, 4, 5]
- Array: [0, 1, 3, 4, 5] (missing 2)
- Expected: 5 * 6 / 2 = 15
- Actual: 0 + 1 + 3 + 4 + 5 = 13
- Missing: 15 - 13 = 2

## Comparison of Approaches

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Sum Formula | O(n) | O(1) | Optimal, simple |
| XOR | O(n) | O(1) | Elegant, avoids overflow risk |
| HashSet | O(n) | O(n) | Clear logic, extra space |
| Sorting | O(n log n) | O(1) | Slower, overkill |
| Index Marking | O(n) | O(1) | Modifies input, not ideal |

## Common Mistakes

1. **Integer overflow:** sum might exceed integer limits (use long in languages that need it)
2. **Off-by-one errors:** Remember range is [0, n] not [1, n]
3. **Array length confusion:** n = nums.length, not nums.length - 1
4. **Forgetting zero:** Range includes 0
5. **Not handling n=0 case:** Edge case where missing is 1

## Edge Cases

- **Single element:** nums = [0], missing = 1
- **Single element:** nums = [1], missing = 0
- **Missing at start:** nums = [1, 2, 3], missing = 0
- **Missing at end:** nums = [0, 1, 2], missing = 3
- **Large n:** n = 10^4 with missing number anywhere

## Interview Tips

- **Start with sum formula:** Most intuitive and optimal
- **Mention alternatives:** Show knowledge of XOR and other approaches
- **Discuss overflow:** How to handle in languages with limited integer size
- **Time vs space:** Explain why O(n) time with O(1) space is ideal
- **XOR elegance:** Show understanding of bit manipulation properties
- **Follow-ups:**
  - What if the array contains n+1 numbers with one duplicate?
  - What if multiple numbers are missing?
  - How would you solve with limited memory?
- **Real-world context:** Finding corrupted records, data validation

## Why This Problem Matters

This problem teaches:
1. **Mathematical insight:** Knowing formulas simplifies problems
2. **Space-time trade-off:** O(1) space possible despite O(n) time
3. **Multiple approaches:** Different ways to solve same problem
4. **XOR properties:** Understanding bit operations
5. **Constraint satisfaction:** Working within given constraints

## Key Learning Points

- **Formula:** n * (n + 1) / 2 is powerful tool
- **XOR properties:** a XOR a = 0, a XOR 0 = a
- **Edge case handling:** Always check boundaries
- **Overflow prevention:** Use long long when needed
- **Simplicity:** Best solution is often the simplest
`,

        inputFormat: `An array of n distinct integers in range [0, n]
Format: Space-separated integers on a single line`,

        outputFormat: `A single integer representing the missing number in range [0, n]`,

        constraints: `- n == nums.length
- 1 <= n <= 10^4
- 0 <= nums[i] <= n
- All numbers in nums are unique`,

        sampleInput: '3 0 1',
        sampleOutput: '2',

        templates: [
          {
            language: 'python',
            code: `def missingNumber(nums: list) -> int:
    """
    Find the missing number in range [0, n].
    Uses mathematical sum formula for O(1) space.
    
    Args:
        nums: Array containing n distinct numbers in range [0, n]
        
    Returns:
        The missing number in the range
    """
    n = len(nums)
    # Formula: sum of 0 to n is n * (n + 1) / 2
    expected_sum = n * (n + 1) // 2
    actual_sum = sum(nums)
    return expected_sum - actual_sum

# Alternative: Using XOR
def missingNumber_v2(nums: list) -> int:
    """Alternative: Using XOR bit manipulation"""
    result = len(nums)  # Start with n
    for i, num in enumerate(nums):
        # XOR with index and value
        result ^= i ^ num
    return result

# Alternative: More explicit XOR version
def missingNumber_v3(nums: list) -> int:
    """Alternative: XOR all numbers from 0 to n and all array elements"""
    n = len(nums)
    result = 0
    
    # XOR all array elements
    for num in nums:
        result ^= num
    
    # XOR all numbers from 0 to n
    for i in range(n + 1):
        result ^= i
    
    return result

# Test cases
if __name__ == "__main__":
    print(missingNumber([3, 0, 1]))                # Output: 2
    print(missingNumber([0, 1]))                   # Output: 2
    print(missingNumber([9, 6, 4, 2, 3, 5, 7, 0, 1]))  # Output: 8
    print(missingNumber([0]))                      # Output: 1
    print(missingNumber([0, 2]))                   # Output: 1`
          },
          {
            language: 'javascript',
            code: `function missingNumber(nums) {
    /**
     * Find the missing number in range [0, n].
     * Uses mathematical sum formula for O(1) space.
     * 
     * @param {number[]} nums - Array containing n distinct numbers in range [0, n]
     * @return {number} - The missing number in the range
     */
    const n = nums.length;
    // Formula: sum of 0 to n is n * (n + 1) / 2
    const expectedSum = (n * (n + 1)) / 2;
    const actualSum = nums.reduce((sum, num) => sum + num, 0);
    return expectedSum - actualSum;
}

// Alternative: Using XOR
function missingNumber_v2(nums) {
    let result = nums.length;  // Start with n
    for (let i = 0; i < nums.length; i++) {
        // XOR with index and value
        result ^= i ^ nums[i];
    }
    return result;
}

// Alternative: More explicit XOR version
function missingNumber_v3(nums) {
    const n = nums.length;
    let result = 0;
    
    // XOR all array elements
    for (let num of nums) {
        result ^= num;
    }
    
    // XOR all numbers from 0 to n
    for (let i = 0; i <= n; i++) {
        result ^= i;
    }
    
    return result;
}

// Test cases
console.log(missingNumber([3, 0, 1]));                // Output: 2
console.log(missingNumber([0, 1]));                   // Output: 2
console.log(missingNumber([9, 6, 4, 2, 3, 5, 7, 0, 1]));  // Output: 8
console.log(missingNumber([0]));                      // Output: 1
console.log(missingNumber([0, 2]));                   // Output: 1`
          },
          {
            language: 'cpp',
            code: `#include <iostream>
#include <vector>
using namespace std;

int missingNumber(vector<int>& nums) {
    /**
     * Find the missing number in range [0, n].
     * Uses mathematical sum formula for O(1) space.
     * 
     * @param nums - Vector containing n distinct numbers in range [0, n]
     * @return - The missing number in the range
     */
    long long n = nums.size();
    // Formula: sum of 0 to n is n * (n + 1) / 2
    long long expectedSum = n * (n + 1) / 2;
    long long actualSum = 0;
    
    for (int num : nums) {
        actualSum += num;
    }
    
    return expectedSum - actualSum;
}

// Alternative: Using XOR
int missingNumber_v2(vector<int>& nums) {
    int n = nums.size();
    int result = n;  // Start with n
    
    for (int i = 0; i < nums.size(); i++) {
        // XOR with index and value
        result ^= i ^ nums[i];
    }
    
    return result;
}

// Alternative: More explicit XOR version
int missingNumber_v3(vector<int>& nums) {
    int n = nums.size();
    int result = 0;
    
    // XOR all array elements
    for (int num : nums) {
        result ^= num;
    }
    
    // XOR all numbers from 0 to n
    for (int i = 0; i <= n; i++) {
        result ^= i;
    }
    
    return result;
}

// Test cases
int main() {
    vector<int> test1 = {3, 0, 1};
    vector<int> test2 = {0, 1};
    vector<int> test3 = {9, 6, 4, 2, 3, 5, 7, 0, 1};
    vector<int> test4 = {0};
    vector<int> test5 = {0, 2};
    
    cout << missingNumber(test1) << endl;  // Output: 2
    cout << missingNumber(test2) << endl;  // Output: 2
    cout << missingNumber(test3) << endl;  // Output: 8
    cout << missingNumber(test4) << endl;  // Output: 1
    cout << missingNumber(test5) << endl;  // Output: 1
    
    return 0;
}`
          },
          {
            language: 'java',
            code: `public class Solution {
    /**
     * Find the missing number in range [0, n].
     * Uses mathematical sum formula for O(1) space.
     * 
     * @param nums - Array containing n distinct numbers in range [0, n]
     * @return - The missing number in the range
     */
    public int missingNumber(int[] nums) {
        long n = nums.length;
        // Formula: sum of 0 to n is n * (n + 1) / 2
        long expectedSum = n * (n + 1) / 2;
        long actualSum = 0;
        
        for (int num : nums) {
            actualSum += num;
        }
        
        return (int)(expectedSum - actualSum);
    }
    
    // Alternative: Using XOR
    public int missingNumber_v2(int[] nums) {
        int result = nums.length;  // Start with n
        
        for (int i = 0; i < nums.length; i++) {
            // XOR with index and value
            result ^= i ^ nums[i];
        }
        
        return result;
    }
    
    // Alternative: More explicit XOR version
    public int missingNumber_v3(int[] nums) {
        int n = nums.length;
        int result = 0;
        
        // XOR all array elements
        for (int num : nums) {
            result ^= num;
        }
        
        // XOR all numbers from 0 to n
        for (int i = 0; i <= n; i++) {
            result ^= i;
        }
        
        return result;
    }
    
    // Test cases
    public static void main(String[] args) {
        Solution sol = new Solution();
        
        System.out.println(sol.missingNumber(new int[]{3, 0, 1}));                // Output: 2
        System.out.println(sol.missingNumber(new int[]{0, 1}));                   // Output: 2
        System.out.println(sol.missingNumber(new int[]{9, 6, 4, 2, 3, 5, 7, 0, 1]));  // Output: 8
        System.out.println(sol.missingNumber(new int[]{0}));                      // Output: 1
        System.out.println(sol.missingNumber(new int[]{0, 2}));                   // Output: 1
    }
}`
          }
        ],

        testCases: [
          // Visible test cases
          {
            input: '3 0 1',
            output: '2',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '0 1',
            output: '2',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '9 6 4 2 3 5 7 0 1',
            output: '8',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '0',
            output: '1',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '0 2',
            output: '1',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '1',
            output: '0',
            isHidden: false,
            type: 'visible'
          },
          // Hidden test cases - missing at start
          {
            input: '1 2 3',
            output: '0',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '1 2 3 4 5',
            output: '0',
            isHidden: true,
            type: 'hidden'
          },
          // Hidden test cases - missing at end
          {
            input: '0 1 2',
            output: '3',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '0 1 2 3 4',
            output: '5',
            isHidden: true,
            type: 'hidden'
          },
          // Hidden test cases - missing in middle
          {
            input: '0 2 3',
            output: '1',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '0 1 3 4',
            output: '2',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '0 1 2 4 5',
            output: '3',
            isHidden: true,
            type: 'hidden'
          },
          // Hidden test cases - various sizes
          {
            input: '5 0 1 2 3 4',
            output: '5',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '0 1 2 3 5 6',
            output: '4',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '2 0 1 3 4 5 6 7 8 9',
            output: '10',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '10 1 2 3 4 5 6 7 8 9 0',
            output: '11',
            isHidden: true,
            type: 'hidden'
          },
          // Hidden test cases - larger numbers
          {
            input: '50 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49',
            output: '50',
            isHidden: true,
            type: 'hidden'
          },
          // Edge cases with shuffled arrays
          {
            input: '7 2 4 0 6 1 5 3',
            output: '8',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '3 2 1 0 4',
            output: '5',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '1 0 2',
            output: '3',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '2 1 0 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20',
            output: '21',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 21',
            output: '20',
            isHidden: true,
            type: 'edge'
          }
        ]
      }
    });

    console.log('✅ Missing Number problem created successfully!');
    console.log('Problem ID:', problem.id);
    console.log('Slug:', problem.slug);
    console.log('Difficulty:', problem.difficulty);
    console.log('XP Reward:', problem.xpReward);
    const testCasesArray = Array.isArray(problem.testCases) ? problem.testCases : [];
    console.log('Test Cases:', testCasesArray.length);

  } catch (error) {
    console.error('❌ Error creating Missing Number problem:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateMissingNumberProblem();
