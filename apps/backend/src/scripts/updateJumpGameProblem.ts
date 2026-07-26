import { prisma } from '../config/prisma';

async function updateJumpGameProblem() {
  try {
    // Delete any existing problem with this slug to avoid duplicates
    await prisma.question.deleteMany({
      where: { slug: 'jump-game' }
    });

    const problem = await prisma.question.create({
      data: {
        title: 'Jump Game',
        slug: 'jump-game',
        difficulty: 'MEDIUM',
        topics: ['arrays', 'greedy', 'dynamic-programming', 'reachability'],
        companies: ['Amazon', 'Google', 'Facebook', 'Microsoft', 'Apple', 'Adobe'],
        xpReward: 8,
        timeLimit: 2,
        memoryLimit: 256,
        
        statement: `# Jump Game

## Problem Statement

You are given an **integer array nums**. You are **initially positioned at the array's first index**, and each element in the array represents your **maximum jump length at that position**.

Return **true if you can reach the last index**, or **false otherwise**.

## Problem Details

- Input: Array of non-negative integers (jump lengths)
- Output: Boolean (true if reachable, false otherwise)
- Goal: Determine if last index is reachable from first index
- Constraint: Can only jump forward, and only within max jump range

## Key Insights

1. **Greedy Approach:** Track maximum reachable index as we iterate
2. **Reachability:** If current index > max reachable, cannot proceed
3. **Optimization:** Greedy is O(n), DP is O(n), Brute Force is O(2^n)
4. **Tracking:** Keep pointer to farthest position we can reach

## Examples

### Example 1: Reachable Last Index
**Input:**
\`\`\`
nums = [2, 3, 1, 1, 4]
\`\`\`
**Output:** \`true\`

**Explanation:**
- Start at index 0 (value 2): can jump to index 1 or 2
- Jump to index 1 (value 3): can now reach indices 2, 3, or 4
- Jump to index 4 (last index): SUCCESS!
- Alternative: Jump 0→1→4 or 0→2→...→4

**Step-by-step:**
\`\`\`
Index:  0  1  2  3  4
Value: [2, 3, 1, 1, 4]
Max reach after:
- Index 0: can reach up to index 0+2=2
- Index 1: can reach up to index 1+3=4 (includes last!)
- Can reach last index: TRUE
\`\`\`

### Example 2: Unreachable Last Index
**Input:**
\`\`\`
nums = [3, 2, 1, 0, 4]
\`\`\`
**Output:** \`false\`

**Explanation:**
- No matter what path taken, reach index 3 with value 0
- From index 3, can't jump anywhere (max jump = 0)
- Index 4 (last) unreachable
- Result: FALSE

**Step-by-step:**
\`\`\`
Index:  0  1  2  3  4
Value: [3, 2, 1, 0, 4]
Paths:
- 0→1: reach index 1, max to 1+2=3
- 0→1→2: reach index 2, max to 2+1=3
- 0→1→2→3: reach index 3, max to 3+0=3 (stuck!)
- 0→2: reach index 2, max to 2+1=3
- 0→3: reach index 3, max to 3+0=3 (stuck!)
All paths lead to index 3 with 0 jump length
Cannot reach index 4: FALSE
\`\`\`

### Example 3: Single Element
**Input:**
\`\`\`
nums = [0]
\`\`\`
**Output:** \`true\`

**Explanation:**
- Already at last index
- Result: TRUE

### Example 4: All Can Jump Far
**Input:**
\`\`\`
nums = [2, 0, 0]
\`\`\`
**Output:** \`true\`

**Explanation:**
- Start at 0: can jump 2 steps to index 2 (last)
- Result: TRUE

### Example 5: Cannot Jump Over Gap
**Input:**
\`\`\`
nums = [0, 1, 1, 0]
\`\`\`
**Output:** \`false\`

**Explanation:**
- At index 0 with value 0: cannot jump anywhere
- Stuck at start
- Result: FALSE

## Algorithm Approaches

### Approach 1: Greedy (Optimal)
**Time Complexity:** O(n)
**Space Complexity:** O(1)

Steps:
1. Initialize maxReach = 0 (farthest position reachable)
2. Iterate through array from start
3. If current index > maxReach, return false (unreachable)
4. Update maxReach with current position's reach
5. If maxReach >= last index, return true
6. Return false if loop ends without reaching

**Why it works:**
- Track farthest position we can reach at each step
- If we encounter unreachable position, fail early
- Otherwise, keep extending reachable range
- Single pass guarantees optimality

### Approach 2: Dynamic Programming
**Time Complexity:** O(n)
**Space Complexity:** O(n)

Steps:
1. Create dp array where dp[i] = true if reachable
2. dp[0] = true (start is always reachable)
3. For each index i: if dp[i] true, mark reachable positions
4. Return dp[n-1]

**Trade-off:** Extra space but clearer logic

### Approach 3: Backward Greedy
**Time Complexity:** O(n)
**Space Complexity:** O(1)

Steps:
1. Start from last index, move backward
2. Track minimum index needed to reach current "last"
3. Try to reach this minimum from earlier positions
4. If reach start, return true

**Advantage:** Different perspective, same O(n)

### Approach 4: BFS/Queue (Slower)
**Time Complexity:** O(n)
**Space Complexity:** O(n)

Steps:
1. Use queue, start with index 0
2. For each index, add reachable indices to queue
3. Mark visited to avoid cycles
4. If reach last, return true

**Disadvantage:** Extra space and slower than greedy

## Correctness Proof

**Theorem:** Greedy approach correctly determines reachability.

**Proof:**
1. **Observation 1:** An index i is reachable iff there exists a path 0 → i
2. **Observation 2:** A position i can reach up to index i + nums[i]
3. **Observation 3:** If maxReach < current_index, position is unreachable
4. **Greedy Choice:** Update maxReach = max(maxReach, i + nums[i])
5. **Optimality:** Greedy locally optimal choice (update reachable range) leads to globally optimal result
6. **Conclusion:** If last index in reachable range at any point, it's reachable

## Common Mistakes

1. **Array bounds:** Forgetting to check last index
2. **Zero jump:** Treating 0 as unrelated
3. **Greedy pointer:** Not tracking maximum reachable
4. **Early return:** Missing check for last index
5. **Off-by-one:** Index confusion (n vs n-1)
6. **Loop bounds:** Incorrect iteration range

## Edge Cases

- **n = 1:** Single element (always true)
- **All zeros:** First element is 0 (false unless n=1)
- **All large:** Can reach (true)
- **First element 0:** Cannot move (false unless n=1)
- **Last element unreachable:** Correctly false
- **Maximum values:** Large jumps cover entire array
- **Gradual decay:** Decreasing jump lengths

## Interview Tips

- **Clarify goal:** Confirm we need to reach last index, not count minimum jumps
- **Brute force first:** Recursion with memoization
- **Optimize to greedy:** Why greedy works
- **Backward thinking:** Alternative greedy approach
- **Edge cases:** Single element, all zeros
- **Trade-offs:** Space vs time with DP
- **Follow-ups:**
  - Minimum jumps needed?
  - Jump to exactly last index?
  - Path reconstruction?
  - Multiple starting points?

## Real-World Applications

- **Game character movement:** Maximum movement range
- **Robot navigation:** Path planning with energy constraints
- **Network routing:** Hop limits in routing
- **Puzzle solving:** Jump patterns and reachability
- **Resource constraints:** Limited access radius

## Why This Problem Matters

This problem teaches:
1. **Greedy algorithms:** When local optimum equals global
2. **Reachability analysis:** Graph-like thinking on arrays
3. **Early termination:** Optimizing with abort conditions
4. **Space optimization:** DP to greedy reduction
5. **Array traversal:** Efficient single-pass solutions

## Complexity Analysis

| Aspect | Greedy | DP | BFS |
|--------|--------|----|----|
| Time | O(n) | O(n) | O(n) |
| Space | O(1) | O(n) | O(n) |
| Best | Optimal | Good | Fair |
| Cache | Optimal | Fair | Poor |

## Key Learning Points

- Track maximum reachable position as iterate
- Check if current position is reachable before processing
- Early termination when unreachable position found
- Greedy suffices (no need for DP)
- Single pass is optimal
- Can work backward for alternative insight
`,

        inputFormat: `n (array length)
nums: space-separated array of integers representing max jump lengths`,

        outputFormat: `true if last index is reachable, false otherwise`,

        constraints: `- 1 <= nums.length <= 10^4
- 0 <= nums[i] <= 10^5
- All values are non-negative integers`,

        sampleInput: '5\n2 3 1 1 4',
        sampleOutput: 'true',

        templates: [
          {
            language: 'python',
            code: `def canJump(nums):
    """
    Determine if you can reach the last index of the array.
    
    Args:
        nums: List of integers representing max jump lengths
        
    Returns:
        True if last index is reachable, False otherwise
    """
    
    # Special case: single element
    if len(nums) <= 1:
        return True
    
    # Track the farthest position we can reach
    max_reach = 0
    
    # Iterate through the array
    for i in range(len(nums)):
        # If current position is beyond reachable range
        if i > max_reach:
            return False
        
        # Update maximum reachable position
        max_reach = max(max_reach, i + nums[i])
        
        # Early termination: if we can reach last index
        if max_reach >= len(nums) - 1:
            return True
    
    return False

# Test cases
if __name__ == "__main__":
    # Example 1: Reachable
    nums1 = [2, 3, 1, 1, 4]
    print(canJump(nums1))  # Output: True
    
    # Example 2: Unreachable
    nums2 = [3, 2, 1, 0, 4]
    print(canJump(nums2))  # Output: False
    
    # Example 3: Single element
    nums3 = [0]
    print(canJump(nums3))  # Output: True
    
    # Example 4: Can reach far
    nums4 = [2, 0, 0]
    print(canJump(nums4))  # Output: True
    
    # Example 5: Cannot move
    nums5 = [0, 1, 1, 0]
    print(canJump(nums5))  # Output: False`
          },
          {
            language: 'javascript',
            code: `function canJump(nums) {
    /**
     * Determine if you can reach the last index of the array.
     * 
     * @param {number[]} nums - Array of integers representing max jump lengths
     * @return {boolean} - True if last index is reachable, False otherwise
     */
    
    // Special case: single element
    if (nums.length <= 1) {
        return true;
    }
    
    // Track the farthest position we can reach
    let maxReach = 0;
    
    // Iterate through the array
    for (let i = 0; i < nums.length; i++) {
        // If current position is beyond reachable range
        if (i > maxReach) {
            return false;
        }
        
        // Update maximum reachable position
        maxReach = Math.max(maxReach, i + nums[i]);
        
        // Early termination: if we can reach last index
        if (maxReach >= nums.length - 1) {
            return true;
        }
    }
    
    return false;
}

// Test cases
console.log(canJump([2, 3, 1, 1, 4]));  // Output: true
console.log(canJump([3, 2, 1, 0, 4]));  // Output: false
console.log(canJump([0]));  // Output: true
console.log(canJump([2, 0, 0]));  // Output: true
console.log(canJump([0, 1, 1, 0]));  // Output: false`
          },
          {
            language: 'cpp',
            code: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

bool canJump(vector<int>& nums) {
    /**
     * Determine if you can reach the last index of the array.
     */
    
    // Special case: single element
    if (nums.size() <= 1) {
        return true;
    }
    
    // Track the farthest position we can reach
    int maxReach = 0;
    
    // Iterate through the array
    for (int i = 0; i < (int)nums.size(); i++) {
        // If current position is beyond reachable range
        if (i > maxReach) {
            return false;
        }
        
        // Update maximum reachable position
        maxReach = max(maxReach, i + nums[i]);
        
        // Early termination: if we can reach last index
        if (maxReach >= (int)nums.size() - 1) {
            return true;
        }
    }
    
    return false;
}

// Test cases
int main() {
    vector<int> nums1 = {2, 3, 1, 1, 4};
    cout << (canJump(nums1) ? "true" : "false") << endl;  // Output: true
    
    vector<int> nums2 = {3, 2, 1, 0, 4};
    cout << (canJump(nums2) ? "true" : "false") << endl;  // Output: false
    
    vector<int> nums3 = {0};
    cout << (canJump(nums3) ? "true" : "false") << endl;  // Output: true
    
    vector<int> nums4 = {2, 0, 0};
    cout << (canJump(nums4) ? "true" : "false") << endl;  // Output: true
    
    vector<int> nums5 = {0, 1, 1, 0};
    cout << (canJump(nums5) ? "true" : "false") << endl;  // Output: false
    
    return 0;
}`
          },
          {
            language: 'java',
            code: `public class Solution {
    /**
     * Determine if you can reach the last index of the array.
     * 
     * @param nums - Array of integers representing max jump lengths
     * @return - True if last index is reachable, False otherwise
     */
    public boolean canJump(int[] nums) {
        // Special case: single element
        if (nums.length <= 1) {
            return true;
        }
        
        // Track the farthest position we can reach
        int maxReach = 0;
        
        // Iterate through the array
        for (int i = 0; i < nums.length; i++) {
            // If current position is beyond reachable range
            if (i > maxReach) {
                return false;
            }
            
            // Update maximum reachable position
            maxReach = Math.max(maxReach, i + nums[i]);
            
            // Early termination: if we can reach last index
            if (maxReach >= nums.length - 1) {
                return true;
            }
        }
        
        return false;
    }
    
    // Test cases
    public static void main(String[] args) {
        Solution sol = new Solution();
        
        System.out.println(sol.canJump(new int[]{2, 3, 1, 1, 4}));  // Output: true
        System.out.println(sol.canJump(new int[]{3, 2, 1, 0, 4}));  // Output: false
        System.out.println(sol.canJump(new int[]{0}));  // Output: true
        System.out.println(sol.canJump(new int[]{2, 0, 0}));  // Output: true
        System.out.println(sol.canJump(new int[]{0, 1, 1, 0}));  // Output: false
    }
}`
          }
        ],

        testCases: [
          // Visible test cases
          {
            input: '5\n2 3 1 1 4',
            output: 'true',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '5\n3 2 1 0 4',
            output: 'false',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '1\n0',
            output: 'true',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '3\n2 0 0',
            output: 'true',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '4\n0 1 1 0',
            output: 'false',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '6\n1 1 1 1 1 1',
            output: 'true',
            isHidden: false,
            type: 'visible'
          },
          // Hidden test cases
          {
            input: '2\n1 0',
            output: 'true',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '3\n2 3 1',
            output: 'true',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '4\n0 2 3 0',
            output: 'false',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '5\n2 0 0 0 4',
            output: 'false',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '7\n1 0 1 0 1 0 1',
            output: 'false',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '8\n2 3 1 1 4 1 1 1',
            output: 'true',
            isHidden: true,
            type: 'hidden'
          },
          // Edge cases
          {
            input: '2\n0 1',
            output: 'false',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '10\n100 0 0 0 0 0 0 0 0 0',
            output: 'true',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '5\n1 2 3 4 5',
            output: 'true',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '6\n0 0 0 0 0 0',
            output: 'false',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '4\n3 2 1 0',
            output: 'true',
            isHidden: true,
            type: 'edge'
          }
        ]
      }
    });

    console.log('✅ Jump Game problem created successfully!');
    console.log('Problem ID:', problem.id);
    console.log('Slug:', problem.slug);
    console.log('Difficulty:', problem.difficulty);
    console.log('XP Reward:', problem.xpReward);
    const testCasesArray = Array.isArray(problem.testCases) ? problem.testCases : [];
    console.log('Test Cases:', testCasesArray.length);

  } catch (error) {
    console.error('❌ Error creating Jump Game problem:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateJumpGameProblem();
