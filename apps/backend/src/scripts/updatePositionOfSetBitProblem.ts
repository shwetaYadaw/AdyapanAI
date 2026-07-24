import { prisma } from '../config/prisma';

async function updatePositionOfSetBitProblem() {
  try {
    // Delete any existing problem with this slug to avoid duplicates
    await prisma.question.deleteMany({
      where: { slug: 'position-of-the-set-bit' }
    });

    const problem = await prisma.question.create({
      data: {
        title: 'Position of the Set Bit',
        slug: 'position-of-the-set-bit',
        difficulty: 'EASY',
        topics: ['bit-manipulation'],
        companies: ['Microsoft', 'Google', 'Amazon', 'Apple', 'Adobe', 'Accenture', 'TCS', 'Infosys'],
        xpReward: 3,
        timeLimit: 1,
        memoryLimit: 256,
        
        statement: `# Position of the Set Bit

## Problem Statement

Given an integer \`n\`, determine the **position of the only set bit** (1) in its binary representation. The position is counted starting from **1** at the **least significant bit (LSB)** (rightmost bit).

### Rules:
- If \`n\` contains **exactly one set bit**, return its position (1-indexed from the right)
- If \`n\` contains **no set bits** (n = 0) or **more than one set bit**, return **-1**

## Problem Details

- Input: A non-negative integer \`n\`
- Output: An integer representing the position of the only set bit (1-indexed), or -1 if the condition is not met
- Constraints: \`0 <= n <= 10^8\`

## Examples

### Example 1
**Input:** \`n = 2\`
**Output:** \`2\`
**Explanation:**
- Binary representation of 2: \`10\`
- Position counting from right (1-indexed):
  - Position 1 (rightmost): 0
  - Position 2: 1 ✓
- Only one set bit at position 2
- Output: 2

### Example 2
**Input:** \`n = 5\`
**Output:** \`-1\`
**Explanation:**
- Binary representation of 5: \`101\`
- Position counting from right (1-indexed):
  - Position 1 (rightmost): 1
  - Position 2: 0
  - Position 3: 1
- Two set bits found (positions 1 and 3)
- Output: -1 (more than one set bit)

### Example 3
**Input:** \`n = 8\`
**Output:** \`4\`
**Explanation:**
- Binary representation of 8: \`1000\`
- Position counting from right (1-indexed):
  - Positions 1, 2, 3: 0
  - Position 4: 1 ✓
- Only one set bit at position 4
- Output: 4

### Example 4
**Input:** \`n = 0\`
**Output:** \`-1\`
**Explanation:**
- Binary representation of 0: \`0\`
- No set bits
- Output: -1

### Example 5
**Input:** \`n = 1\`
**Output:** \`1\`
**Explanation:**
- Binary representation of 1: \`1\`
- Only one set bit at position 1
- Output: 1

## Algorithm Approaches

### Approach 1: Bit Manipulation Check + Position Finding (Optimal)
**Time Complexity:** O(log n) or O(1) for 32-bit integers
**Space Complexity:** O(1)

Steps:
1. Check if \`n\` is a power of 2 using: \`n > 0 && (n & (n-1)) == 0\`
   - This ensures exactly one set bit
2. If valid, count the position by right-shifting until we find the bit
3. Or use built-in functions to find bit position

**Why it works:**
- \`n & (n-1)\` clears the rightmost set bit. If result is 0, there was exactly one bit
- This is more efficient than counting all bits

### Approach 2: Bit Counting + Position Calculation
**Time Complexity:** O(log n)
**Space Complexity:** O(1)

Steps:
1. Count total set bits in \`n\`
2. If count != 1, return -1
3. Otherwise, right-shift and count position until we find the set bit

### Approach 3: Find MSB Position (Log Approach)
**Time Complexity:** O(log n)
**Space Complexity:** O(1)

Steps:
1. Use logarithm to find position: \`position = floor(log2(n)) + 1\`
2. Verify by checking if \`n == 2^(position-1)\`
3. If \`n\` is exactly a power of 2, return position; else -1

### Approach 4: Using Built-in Functions (Language Specific)
- Python: \`n.bit_length()\` + validation
- JavaScript: Use bit operations or \`Math.log2()\`
- Java: \`Integer.numberOfLeadingZeros()\`
- C++: \`__builtin_ctz()\` (count trailing zeros)

## Correctness Proof

**Claim:** \`n & (n-1) == 0\` if and only if \`n\` has exactly one set bit.

**Proof:**
1. **If n has exactly one set bit:**
   - \`n = 2^k\` for some k >= 0
   - \`n-1 = 2^k - 1\` has k consecutive 1s from position 0 to k-1
   - \`n & (n-1) = 0\` (no overlapping 1s)

2. **If n & (n-1) == 0:**
   - The operation clears the rightmost set bit
   - If result is 0, there was only one set bit
   - Therefore, n is a power of 2

## Common Mistakes

1. **Zero-indexed vs One-indexed:** The problem uses 1-indexed positions from the right, not 0-indexed. Be careful with off-by-one errors.

2. **Forgetting to check for n = 0:** Zero has no set bits, so should return -1.

3. **Not validating single bit:** Must ensure exactly one set bit exists before finding position.

4. **Using signed right shift:** In languages like Java, use \`>>>\` (unsigned) not \`>>\` for bit operations on larger numbers.

5. **Integer overflow in position calculation:** When using logarithm, ensure proper rounding and validation.

## Edge Cases

- **n = 0:** No set bits → return -1
- **n = 1:** Binary \`1\`, position 1 → return 1
- **Powers of 2:** \`2, 4, 8, 16, 32, ...\` → return their position
- **All bits set:** Like 7 (binary 111) → return -1
- **Maximum value:** 10^8 → handle correctly

## Interview Tips

- **Explain the power of 2 check:** Start by explaining why \`n & (n-1)\` is powerful
- **Discuss trade-offs:** Compare bit manipulation vs. logarithm approach
- **Validate input:** Always check edge cases first (n=0, n=1)
- **Position counting:** Clarify that position is 1-indexed from the right
- **Follow-ups:**
  - What if we need to handle negative numbers?
  - How would you find all set bit positions (not just one)?
  - Can you solve it without bit operations?
`,

        inputFormat: `A single non-negative integer \`n\` (0 <= n <= 10^8)`,

        outputFormat: `An integer representing the position (1-indexed from right) of the only set bit, or -1 if n has zero or more than one set bit`,

        constraints: `- 0 <= n <= 10^8
- Position is 1-indexed from the least significant bit (rightmost)`,

        sampleInput: '2',
        sampleOutput: '2',

        templates: [
          {
            language: 'python',
            code: `def findPositionOfSetBit(n: int) -> int:
    """
    Find the position of the only set bit in n.
    Position is 1-indexed from the right (LSB).
    
    Args:
        n: A non-negative integer
        
    Returns:
        Position of the only set bit (1-indexed), or -1 if n has 0 or >1 set bits
    """
    # Check if n has exactly one set bit
    # A number has exactly one set bit if n & (n-1) == 0 and n > 0
    if n <= 0 or (n & (n - 1)) != 0:
        return -1
    
    # Find the position of the set bit
    # Use bit_length() which returns the position + 1 of MSB
    return n.bit_length()

# Alternative approach using position counting
def findPositionOfSetBit_v2(n: int) -> int:
    """Alternative: Check if power of 2, then count position"""
    if n <= 0 or (n & (n - 1)) != 0:
        return -1
    
    position = 0
    while n > 1:
        n >>= 1
        position += 1
    
    return position + 1

# Test cases
if __name__ == "__main__":
    print(findPositionOfSetBit(2))    # Output: 2
    print(findPositionOfSetBit(5))    # Output: -1
    print(findPositionOfSetBit(8))    # Output: 4
    print(findPositionOfSetBit(0))    # Output: -1
    print(findPositionOfSetBit(1))    # Output: 1`
          },
          {
            language: 'javascript',
            code: `function findPositionOfSetBit(n) {
    /**
     * Find the position of the only set bit in n.
     * Position is 1-indexed from the right (LSB).
     * 
     * @param {number} n - A non-negative integer
     * @return {number} - Position of the only set bit (1-indexed), or -1
     */
    
    // Check if n has exactly one set bit
    // A number has exactly one set bit if n & (n-1) == 0 and n > 0
    if (n <= 0 || (n & (n - 1)) !== 0) {
        return -1;
    }
    
    // Find the position of the set bit using bit length
    // We can also use Math.log2(n) + 1
    let position = 0;
    let temp = n;
    
    while (temp > 1) {
        temp >>= 1;
        position++;
    }
    
    return position + 1;
}

// Alternative using bit_length simulation
function findPositionOfSetBit_v2(n) {
    if (n <= 0 || (n & (n - 1)) !== 0) {
        return -1;
    }
    
    // n.toString(2) converts to binary, length - 1 is the position
    return n.toString(2).length;
}

// Test cases
console.log(findPositionOfSetBit(2));    // Output: 2
console.log(findPositionOfSetBit(5));    // Output: -1
console.log(findPositionOfSetBit(8));    // Output: 4
console.log(findPositionOfSetBit(0));    // Output: -1
console.log(findPositionOfSetBit(1));    // Output: 1`
          },
          {
            language: 'cpp',
            code: `#include <iostream>
#include <cmath>
using namespace std;

int findPositionOfSetBit(int n) {
    /**
     * Find the position of the only set bit in n.
     * Position is 1-indexed from the right (LSB).
     * 
     * @param n - A non-negative integer
     * @return - Position of the only set bit (1-indexed), or -1
     */
    
    // Check if n has exactly one set bit
    // A number has exactly one set bit if n & (n-1) == 0 and n > 0
    if (n <= 0 || (n & (n - 1)) != 0) {
        return -1;
    }
    
    // Find the position of the set bit
    // Use __builtin_ctz (count trailing zeros) for efficiency
    // Position = trailing zeros + 1
    int position = __builtin_ctz(n) + 1;
    return position;
}

// Alternative: Manual counting
int findPositionOfSetBit_v2(int n) {
    if (n <= 0 || (n & (n - 1)) != 0) {
        return -1;
    }
    
    int position = 0;
    while (n > 1) {
        n >>= 1;
        position++;
    }
    
    return position + 1;
}

// Test cases
int main() {
    cout << findPositionOfSetBit(2) << endl;    // Output: 2
    cout << findPositionOfSetBit(5) << endl;    // Output: -1
    cout << findPositionOfSetBit(8) << endl;    // Output: 4
    cout << findPositionOfSetBit(0) << endl;    // Output: -1
    cout << findPositionOfSetBit(1) << endl;    // Output: 1
    return 0;
}`
          },
          {
            language: 'java',
            code: `public class Solution {
    /**
     * Find the position of the only set bit in n.
     * Position is 1-indexed from the right (LSB).
     * 
     * @param n - A non-negative integer
     * @return - Position of the only set bit (1-indexed), or -1
     */
    public int findPositionOfSetBit(int n) {
        // Check if n has exactly one set bit
        // A number has exactly one set bit if n & (n-1) == 0 and n > 0
        if (n <= 0 || (n & (n - 1)) != 0) {
            return -1;
        }
        
        // Find the position of the set bit
        // Use Integer.numberOfTrailingZeros() for efficiency
        // Position = trailing zeros + 1
        int position = Integer.numberOfTrailingZeros(n) + 1;
        return position;
    }
    
    // Alternative: Manual counting
    public int findPositionOfSetBit_v2(int n) {
        if (n <= 0 || (n & (n - 1)) != 0) {
            return -1;
        }
        
        int position = 0;
        while (n > 1) {
            n >>>= 1;  // Unsigned right shift
            position++;
        }
        
        return position + 1;
    }
    
    // Test cases
    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(sol.findPositionOfSetBit(2));    // Output: 2
        System.out.println(sol.findPositionOfSetBit(5));    // Output: -1
        System.out.println(sol.findPositionOfSetBit(8));    // Output: 4
        System.out.println(sol.findPositionOfSetBit(0));    // Output: -1
        System.out.println(sol.findPositionOfSetBit(1));    // Output: 1
    }
}`
          }
        ],

        testCases: [
          // Visible test cases
          {
            input: '2',
            output: '2',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '5',
            output: '-1',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '8',
            output: '4',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '0',
            output: '-1',
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
            input: '16',
            output: '5',
            isHidden: false,
            type: 'visible'
          },
          // Hidden test cases - powers of 2
          {
            input: '4',
            output: '3',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '32',
            output: '6',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '64',
            output: '7',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '128',
            output: '8',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '256',
            output: '9',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '512',
            output: '10',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '1024',
            output: '11',
            isHidden: true,
            type: 'hidden'
          },
          // Hidden test cases - multiple bits
          {
            input: '3',
            output: '-1',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '7',
            output: '-1',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '15',
            output: '-1',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '63',
            output: '-1',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '100',
            output: '-1',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '1023',
            output: '-1',
            isHidden: true,
            type: 'hidden'
          },
          // Hidden test cases - larger powers of 2
          {
            input: '2048',
            output: '12',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '4096',
            output: '13',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '8192',
            output: '14',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '16384',
            output: '15',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '32768',
            output: '16',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '65536',
            output: '17',
            isHidden: true,
            type: 'hidden'
          },
          // Edge cases
          {
            input: '67108864',
            output: '27',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '10',
            output: '-1',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '99999999',
            output: '-1',
            isHidden: true,
            type: 'edge'
          }
        ]
      }
    });

    console.log('✅ Position of the Set Bit problem created successfully!');
    console.log('Problem ID:', problem.id);
    console.log('Slug:', problem.slug);
    console.log('Difficulty:', problem.difficulty);
    console.log('XP Reward:', problem.xpReward);
    const testCasesArray = Array.isArray(problem.testCases) ? problem.testCases : [];
    console.log('Test Cases:', testCasesArray.length);

  } catch (error) {
    console.error('❌ Error creating Position of the Set Bit problem:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updatePositionOfSetBitProblem();
