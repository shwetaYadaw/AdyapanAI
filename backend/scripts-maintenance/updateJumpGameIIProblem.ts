import { prisma } from '../config/prisma';

async function updateJumpGameIIProblem() {
  try {
    // Delete any existing problem with this slug to avoid duplicates
    await prisma.question.deleteMany({
      where: { slug: 'jump-game-ii' }
    });

    const problem = await prisma.question.create({
      data: {
        title: 'Jump Game II',
        slug: 'jump-game-ii',
        difficulty: 'MEDIUM',
        topics: ['arrays', 'greedy', 'dynamic-programming', 'bfs'],
        companies: ['Amazon', 'Google', 'Facebook', 'Microsoft', 'Apple', 'Bloomberg'],
        xpReward: 8,
        timeLimit: 2,
        memoryLimit: 256,
        
        statement: `# Jump Game II

## Problem Statement

You are given a **0-indexed array of integers nums of length n**. You are **initially positioned at index 0**.

Each element \`nums[i]\` represents the **maximum length of a forward jump from index i**. In other words, if you are at index i, you can jump to any index **(i + j)** where:
- \`0 <= j <= nums[i]\`
- \`i + j < n\`

**Return the minimum number of jumps** to reach index **n - 1**.

The test cases are generated such that you can reach index n - 1.

## Problem Details

- Input: Array of non-negative integers (max jump lengths)
- Output: Minimum number of jumps to reach last index
- Goal: Find optimal jumping strategy with fewest jumps
- Guarantee: Always reachable (greedy solution exists)

## Key Insights

1. **Greedy Window:** Track current jump's reach and next jump's reach
2. **Level-by-level:** Process jumps level by level (BFS-like)
3. **Farthest Reach:** Update farthest position reachable with current jumps
4. **Minimum Jumps:** Increment when need to jump again to proceed
5. **O(n) Solution:** Single pass without DP overhead

## Examples

### Example 1: Multiple Jumps
**Input:**
\`\`\`
nums = [2, 3, 1, 1, 4]
\`\`\`
**Output:** \`2\`

**Explanation:**
- Start at index 0 (value 2): can reach indices 1 or 2
- From index 0, can jump to index 1 (value 3)
- From index 1, can jump 3 steps to index 4 (last)
- Jumps: 0→1→4 (2 jumps total)

**Step-by-step:**
\`\`\`
Index:  0  1  2  3  4
Value: [2, 3, 1, 1, 4]

Jump 1: From index 0, reach up to index 2
  - Options: 0→1 or 0→2
  
Jump 2: From index 1, reach index 4 (or beyond)
  - Best: 1→4 (3 steps)
  
Result: 2 jumps
\`\`\`

### Example 2: With Zero Jump
**Input:**
\`\`\`
nums = [2, 3, 0, 1, 4]
\`\`\`
**Output:** \`2\`

**Explanation:**
- Start at 0: can jump to 1 or 2
- Index 2 has value 0 (dead end)
- Jump to index 1 (value 3)
- From index 1, jump 3 steps to index 4
- Total: 2 jumps

### Example 3: All Ones
**Input:**
\`\`\`
nums = [1, 1, 1, 1, 1]
\`\`\`
**Output:** \`4\`

**Explanation:**
- Must jump 1 step at a time
- Path: 0→1→2→3→4
- Total: 4 jumps

### Example 4: Single Large Jump
**Input:**
\`\`\`
nums = [10, 0, 0, 0, 0]
\`\`\`
**Output:** \`1\`

**Explanation:**
- First element allows jumping to last
- Direct: 0→4
- Total: 1 jump

### Example 5: Gradual Increase
**Input:**
\`\`\`
nums = [1, 2, 3, 4, 5]
\`\`\`
**Output:** \`2\`

**Explanation:**
- Jump 0→1 (reach up to 3)
- Jump 1→4 (or 2, 3, 4 but 4 is best)
- Total: 2 jumps

## Algorithm Approaches

### Approach 1: Greedy BFS-like (Optimal)
**Time Complexity:** O(n)
**Space Complexity:** O(1)

Steps:
1. Track: current_end, farthest, jumps
2. Iterate through array
3. Update farthest reachable from current position
4. When reach current_end boundary, increment jumps
5. Update current_end to farthest
6. Return jumps

**Why it works:**
- Process positions level by level (BFS)
- No need to explore all paths
- Greedy choice at each level is optimal
- Single pass guarantees O(n) time

### Approach 2: Dynamic Programming
**Time Complexity:** O(n)
**Space Complexity:** O(n)

Steps:
1. dp[i] = minimum jumps to reach index i
2. dp[0] = 0
3. For each index i, update all reachable indices
4. Return dp[n-1]

**Trade-off:** Extra space but clearer logic

### Approach 3: BFS Explicit Queue
**Time Complexity:** O(n)
**Space Complexity:** O(n)

Steps:
1. Use queue with (index, jumps) pairs
2. Explore all reachable positions from current
3. Mark visited to avoid revisiting
4. Return jumps when reaching last index

**Disadvantage:** Extra queue space

### Approach 4: Backward Greedy
**Time Complexity:** O(n)
**Space Complexity:** O(1)

Steps:
1. Start from last index
2. Move backward, find farthest position that can reach current
3. Count jumps backward
4. Return count

## Correctness Proof

**Theorem:** Greedy BFS approach finds minimum jumps.

**Proof:**
1. **Observation 1:** At each position, we can reach forward up to position + nums[position]
2. **Observation 2:** To minimize jumps, we want to progress as far as possible with each jump
3. **Observation 3:** Greedy choice: pick position from current level that extends farthest
4. **Level Property:** All positions in current level require same number of jumps
5. **Optimality:** Extending farthest at each level minimizes total jumps
6. **Conclusion:** Greedy gives optimal solution

## Common Mistakes

1. **Not tracking boundaries:** Confusing current reach and farthest reach
2. **Off-by-one errors:** Incrementing jumps at wrong time
3. **Missing update:** Not updating farthest when at last element
4. **Array bounds:** Not checking i + j < n
5. **Initialization:** Starting with wrong current_end
6. **Early termination:** Stopping before reaching last

## Edge Cases

- **n = 1:** Already at last index, return 0
- **Large single jump:** nums[0] >= n-1
- **All ones:** Minimum path (n-1 jumps)
- **Mixed values:** Optimal path not obvious
- **Multiple optimal paths:** Return minimum count
- **Large array:** Up to 10^4 elements
- **Large jumps:** Values up to 1000

## Interview Tips

- **Clarify goal:** Minimum jumps, not path
- **Brute force first:** Try all paths (exponential)
- **Optimize to DP:** Track minimum jumps to each position
- **Further optimize to greedy:** BFS-like level processing
- **Explain BFS:** Why it's like graph BFS without queue
- **Time complexity:** Why O(n) is optimal
- **Follow-ups:**
  - Return actual path?
  - Multiple jumps allowed in one step?
  - Different jump constraints?

## Real-World Applications

- **Game level progression:** Minimum moves to reach goal
- **Network routing:** Minimum hops to destination
- **Platform games:** Optimal jumping strategy
- **Elevator systems:** Minimum stops to reach floor
- **Shortest path:** When weights are uniform

## Why This Problem Matters

This problem teaches:
1. **Greedy optimization:** Selecting best at each step
2. **BFS thinking:** Level-by-level processing without queue
3. **Window tracking:** Managing current and future boundaries
4. **Space optimization:** DP to O(1) space greedy
5. **Minimum path problems:** Finding optimal with constraints

## Complexity Analysis

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Greedy | O(n) | O(1) | Optimal, no extra space |
| DP | O(n) | O(n) | Clear but extra space |
| BFS Queue | O(n) | O(n) | Queue overhead |
| Backward | O(n) | O(1) | Different perspective |

## Key Learning Points

- Track current level's reach and next level's reach
- Increment jumps when moving to next level
- Greedy works for reachability + minimum jumps
- Update farthest as iterate through positions
- No need for DP with space optimization
- Handle boundary carefully (i + j < n)
`,

        inputFormat: `n (array length)
nums: space-separated array of integers representing max jump lengths`,

        outputFormat: `Minimum number of jumps to reach the last index`,

        constraints: `- 1 <= nums.length <= 10^4
- 0 <= nums[i] <= 10^3
- It's guaranteed you can reach nums[n - 1]`,

        sampleInput: '5\n2 3 1 1 4',
        sampleOutput: '2',

        templates: [
          {
            language: 'python',
            code: `def jump(nums):
    """
    Find minimum number of jumps to reach the last index.
    
    Args:
        nums: List of integers representing max jump lengths
        
    Returns:
        Minimum number of jumps needed
    """
    
    n = len(nums)
    
    # Special case: already at last index
    if n <= 1:
        return 0
    
    jumps = 0
    current_end = 0      # End of current level
    farthest = 0         # Farthest position reachable
    
    # Iterate through array (exclude last index)
    for i in range(n - 1):
        # Update farthest position reachable from current position
        farthest = max(farthest, i + nums[i])
        
        # If reached end of current level, need another jump
        if i == current_end:
            jumps += 1
            current_end = farthest
            
            # If can reach last index, we're done
            if current_end >= n - 1:
                break
    
    return jumps

# Test cases
if __name__ == "__main__":
    # Example 1: Multiple jumps
    nums1 = [2, 3, 1, 1, 4]
    print(jump(nums1))  # Output: 2
    
    # Example 2: With zero
    nums2 = [2, 3, 0, 1, 4]
    print(jump(nums2))  # Output: 2
    
    # Example 3: All ones
    nums3 = [1, 1, 1, 1, 1]
    print(jump(nums3))  # Output: 4
    
    # Example 4: Single large jump
    nums4 = [10, 0, 0, 0, 0]
    print(jump(nums4))  # Output: 1
    
    # Example 5: Gradual increase
    nums5 = [1, 2, 3, 4, 5]
    print(jump(nums5))  # Output: 2`
          },
          {
            language: 'javascript',
            code: `function jump(nums) {
    /**
     * Find minimum number of jumps to reach the last index.
     * 
     * @param {number[]} nums - Array of integers representing max jump lengths
     * @return {number} - Minimum number of jumps needed
     */
    
    const n = nums.length;
    
    // Special case: already at last index
    if (n <= 1) {
        return 0;
    }
    
    let jumps = 0;
    let currentEnd = 0;   // End of current level
    let farthest = 0;     // Farthest position reachable
    
    // Iterate through array (exclude last index)
    for (let i = 0; i < n - 1; i++) {
        // Update farthest position reachable from current position
        farthest = Math.max(farthest, i + nums[i]);
        
        // If reached end of current level, need another jump
        if (i === currentEnd) {
            jumps++;
            currentEnd = farthest;
            
            // If can reach last index, we're done
            if (currentEnd >= n - 1) {
                break;
            }
        }
    }
    
    return jumps;
}

// Test cases
console.log(jump([2, 3, 1, 1, 4]));  // Output: 2
console.log(jump([2, 3, 0, 1, 4]));  // Output: 2
console.log(jump([1, 1, 1, 1, 1]));  // Output: 4
console.log(jump([10, 0, 0, 0, 0]));  // Output: 1
console.log(jump([1, 2, 3, 4, 5]));  // Output: 2`
          },
          {
            language: 'cpp',
            code: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int jump(vector<int>& nums) {
    /**
     * Find minimum number of jumps to reach the last index.
     */
    
    int n = nums.size();
    
    // Special case: already at last index
    if (n <= 1) {
        return 0;
    }
    
    int jumps = 0;
    int currentEnd = 0;   // End of current level
    int farthest = 0;     // Farthest position reachable
    
    // Iterate through array (exclude last index)
    for (int i = 0; i < n - 1; i++) {
        // Update farthest position reachable from current position
        farthest = max(farthest, i + nums[i]);
        
        // If reached end of current level, need another jump
        if (i == currentEnd) {
            jumps++;
            currentEnd = farthest;
            
            // If can reach last index, we're done
            if (currentEnd >= n - 1) {
                break;
            }
        }
    }
    
    return jumps;
}

// Test cases
int main() {
    vector<int> nums1 = {2, 3, 1, 1, 4};
    cout << jump(nums1) << endl;  // Output: 2
    
    vector<int> nums2 = {2, 3, 0, 1, 4};
    cout << jump(nums2) << endl;  // Output: 2
    
    vector<int> nums3 = {1, 1, 1, 1, 1};
    cout << jump(nums3) << endl;  // Output: 4
    
    vector<int> nums4 = {10, 0, 0, 0, 0};
    cout << jump(nums4) << endl;  // Output: 1
    
    vector<int> nums5 = {1, 2, 3, 4, 5};
    cout << jump(nums5) << endl;  // Output: 2
    
    return 0;
}`
          },
          {
            language: 'java',
            code: `public class Solution {
    /**
     * Find minimum number of jumps to reach the last index.
     * 
     * @param nums - Array of integers representing max jump lengths
     * @return - Minimum number of jumps needed
     */
    public int jump(int[] nums) {
        int n = nums.length;
        
        // Special case: already at last index
        if (n <= 1) {
            return 0;
        }
        
        int jumps = 0;
        int currentEnd = 0;   // End of current level
        int farthest = 0;     // Farthest position reachable
        
        // Iterate through array (exclude last index)
        for (int i = 0; i < n - 1; i++) {
            // Update farthest position reachable from current position
            farthest = Math.max(farthest, i + nums[i]);
            
            // If reached end of current level, need another jump
            if (i == currentEnd) {
                jumps++;
                currentEnd = farthest;
                
                // If can reach last index, we're done
                if (currentEnd >= n - 1) {
                    break;
                }
            }
        }
        
        return jumps;
    }
    
    // Test cases
    public static void main(String[] args) {
        Solution sol = new Solution();
        
        System.out.println(sol.jump(new int[]{2, 3, 1, 1, 4}));  // Output: 2
        System.out.println(sol.jump(new int[]{2, 3, 0, 1, 4}));  // Output: 2
        System.out.println(sol.jump(new int[]{1, 1, 1, 1, 1}));  // Output: 4
        System.out.println(sol.jump(new int[]{10, 0, 0, 0, 0}));  // Output: 1
        System.out.println(sol.jump(new int[]{1, 2, 3, 4, 5}));  // Output: 2
    }
}`
          }
        ],

        testCases: [
          // Visible test cases
          {
            input: '5\n2 3 1 1 4',
            output: '2',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '5\n2 3 0 1 4',
            output: '2',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '5\n1 1 1 1 1',
            output: '4',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '5\n10 0 0 0 0',
            output: '1',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '5\n1 2 3 4 5',
            output: '2',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '1\n0',
            output: '0',
            isHidden: false,
            type: 'visible'
          },
          // Hidden test cases
          {
            input: '2\n1 1',
            output: '1',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '10\n1 1 1 0 1 1 1 1 1 1',
            output: '9',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '8\n2 1 3 2 4 1 2 0',
            output: '3',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '6\n3 2 1 0 4 0',
            output: '2',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '4\n2 1 0 1',
            output: '2',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '7\n1 3 1 1 1 1 1',
            output: '2',
            isHidden: true,
            type: 'hidden'
          },
          // Edge cases
          {
            input: '2\n0 1',
            output: '1',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '3\n2 0 0',
            output: '1',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '10\n9 8 7 6 5 4 3 2 1 0',
            output: '1',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '5\n1 0 2 0 0',
            output: '3',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '6\n1 1 1 1 1 1',
            output: '5',
            isHidden: true,
            type: 'edge'
          }
        ]
      }
    });

    console.log('✅ Jump Game II problem created successfully!');
    console.log('Problem ID:', problem.id);
    console.log('Slug:', problem.slug);
    console.log('Difficulty:', problem.difficulty);
    console.log('XP Reward:', problem.xpReward);
    const testCasesArray = Array.isArray(problem.testCases) ? problem.testCases : [];
    console.log('Test Cases:', testCasesArray.length);

  } catch (error) {
    console.error('❌ Error creating Jump Game II problem:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateJumpGameIIProblem();
