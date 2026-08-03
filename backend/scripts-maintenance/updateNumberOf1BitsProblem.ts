import { prisma } from '../config/prisma';

async function updateNumberOf1BitsProblem() {
  try {
    // Delete any existing problem with this slug to avoid duplicates
    await prisma.question.deleteMany({
      where: { slug: 'number-of-1-bits' }
    });

    const problem = await prisma.question.create({
      data: {
        title: 'Number of 1 Bits',
        slug: 'number-of-1-bits',
        difficulty: 'EASY',
        topics: ['bit-manipulation'],
        companies: ['Microsoft', 'Google', 'Amazon', 'Apple', 'Adobe', 'Goldman Sachs', 'Uber'],
        xpReward: 4,
        timeLimit: 1,
        memoryLimit: 256,
        
        statement: `# Number of 1 Bits (Hamming Weight)

## Problem Statement

Given a positive integer \`n\`, write a function that returns the **number of set bits** in its binary representation (also known as the **Hamming weight**).

A set bit is a bit position that contains a 1 in the binary representation.

## Problem Details

- Input: A positive integer \`n\`
- Output: An integer representing the count of 1s in the binary representation of \`n\`
- Constraints: \`1 <= n <= 2^31 - 1\`

## Examples

### Example 1
**Input:** \`n = 11\`
**Output:** \`3\`
**Explanation:** 
- Binary representation of 11: \`1011\`
- Count of 1s: 3 (at positions 0, 1, and 3)

### Example 2
**Input:** \`n = 128\`
**Output:** \`1\`
**Explanation:**
- Binary representation of 128: \`10000000\`
- Count of 1s: 1 (only at position 7)

### Example 3
**Input:** \`n = 2147483645\`
**Output:** \`30\`
**Explanation:**
- Binary representation: \`1111111111111111111111111111101\` (31 bits, missing one 1 at position 1)
- Count of 1s: 30 set bits

## Algorithm Approaches

### Approach 1: Bit Manipulation (Optimal)
**Time Complexity:** O(number of set bits) or O(log n)
**Space Complexity:** O(1)

Use the trick \`n & (n-1)\` which removes the rightmost set bit:
- While \`n\` is not 0:
  - Apply \`n = n & (n-1)\` to remove the rightmost 1
  - Increment counter
- The loop runs only for the number of 1s in the binary representation

**Why it works:**
- \`n & (n-1)\` clears the lowest set bit in n
- Example: \`n = 12 (1100)\`, \`n-1 = 11 (1011)\`, \`n & (n-1) = 1000 (8)\`
- Repeat until n becomes 0

### Approach 2: Right Shift with Bit Check
**Time Complexity:** O(log n) or O(32) for 32-bit integers
**Space Complexity:** O(1)

Check each bit from right to left:
- For each bit position (0 to 31):
  - Check if the bit is set using \`n & 1\`
  - Right shift n by 1 (\`n >>= 1\`)
  - Increment counter if bit was set

### Approach 3: Using Built-in Function (Language Specific)
Some languages provide built-in functions:
- Python: \`bin(n).count('1')\`
- JavaScript: \`n.toString(2).split('1').length - 1\`
- Java: \`Integer.bitCount(n)\`
- C++: \`__builtin_popcount(n)\`

## Correctness Proof

**Claim:** The Brian Kernighan algorithm (\`n & (n-1)\`) correctly counts set bits.

**Proof:**
1. Each iteration of \`n & (n-1)\` flips the rightmost set bit to 0
2. The operation terminates when n = 0 (no more set bits)
3. Number of iterations = number of 1s in binary representation
4. Therefore, the counter equals the Hamming weight

## Common Mistakes

1. **Using arithmetic right shift instead of logical:** In languages like Java, ensure using \`>>>\` (unsigned right shift) not \`>>\`
2. **Integer overflow:** In languages without arbitrary precision, be careful with bit operations on negative numbers
3. **Off-by-one errors:** When iterating through bit positions, ensure correct loop bounds (0-31 for 32-bit)
4. **Forgetting the problem constraint:** The problem specifies positive integers, so no need to handle negative numbers

## Interview Tips

- **Explain the bit manipulation trick:** Before coding, explain why \`n & (n-1)\` removes the rightmost set bit
- **Discuss time complexity:** Emphasize that the optimal approach runs in O(k) where k is the number of 1s, not O(log n)
- **Mention built-in functions:** While less impressive in interviews, knowing language-specific solutions is good
- **Handle edge cases:** Test with n=1 (one bit), n=2147483645 (almost all bits set), n=2^30 (power of two)
- **Space optimization:** Highlight that this problem can be solved with O(1) space
`,

        inputFormat: `A single positive integer \`n\` (1 <= n <= 2^31 - 1)`,

        outputFormat: `An integer representing the number of set bits (1s) in the binary representation of \`n\``,

        constraints: `- 1 <= n <= 2^31 - 1
- The input is a positive integer`,

        sampleInput: '11',
        sampleOutput: '3',

        templates: [
          {
            language: 'python',
            code: `def hammingWeight(n: int) -> int:
    """
    Count the number of 1s in binary representation of n.
    
    Args:
        n: A positive integer
        
    Returns:
        Number of 1s in binary representation
    """
    count = 0
    while n:
        # Remove rightmost set bit
        n &= n - 1
        count += 1
    return count

# Test cases
if __name__ == "__main__":
    print(hammingWeight(11))           # Output: 3
    print(hammingWeight(128))          # Output: 1
    print(hammingWeight(2147483645))   # Output: 30`
          },
          {
            language: 'javascript',
            code: `function hammingWeight(n) {
    /**
     * Count the number of 1s in binary representation of n.
     * 
     * @param {number} n - A positive integer
     * @return {number} - Number of 1s in binary representation
     */
    let count = 0;
    while (n > 0) {
        // Remove rightmost set bit
        n = n & (n - 1);
        count++;
    }
    return count;
}

// Test cases
console.log(hammingWeight(11));           // Output: 3
console.log(hammingWeight(128));          // Output: 1
console.log(hammingWeight(2147483645));   // Output: 30`
          },
          {
            language: 'cpp',
            code: `#include <iostream>
using namespace std;

int hammingWeight(uint32_t n) {
    /**
     * Count the number of 1s in binary representation of n.
     * 
     * @param n - A positive 32-bit unsigned integer
     * @return - Number of 1s in binary representation
     */
    int count = 0;
    while (n) {
        // Remove rightmost set bit
        n &= n - 1;
        count++;
    }
    return count;
}

// Test cases
int main() {
    cout << hammingWeight(11) << endl;           // Output: 3
    cout << hammingWeight(128) << endl;          // Output: 1
    cout << hammingWeight(2147483645) << endl;   // Output: 30
    return 0;
}`
          },
          {
            language: 'java',
            code: `public class Solution {
    /**
     * Count the number of 1s in binary representation of n.
     * 
     * @param n - A positive integer
     * @return - Number of 1s in binary representation
     */
    public int hammingWeight(int n) {
        int count = 0;
        while (n != 0) {
            // Remove rightmost set bit
            n = n & (n - 1);
            count++;
        }
        return count;
    }
    
    // Test cases
    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(sol.hammingWeight(11));           // Output: 3
        System.out.println(sol.hammingWeight(128));          // Output: 1
        System.out.println(sol.hammingWeight(2147483645));   // Output: 30
    }
}`
          }
        ],

        testCases: [
          // Visible test cases
          {
            input: '11',
            output: '3',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '128',
            output: '1',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '2147483645',
            output: '30',
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
            input: '3',
            output: '2',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '7',
            output: '3',
            isHidden: false,
            type: 'visible'
          },
          // Hidden test cases - various bit patterns
          {
            input: '15',
            output: '4',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '255',
            output: '8',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '65536',
            output: '1',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '1073741823',
            output: '30',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '2',
            output: '1',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '4',
            output: '1',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '8',
            output: '1',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '16',
            output: '1',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '32',
            output: '1',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '63',
            output: '6',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '127',
            output: '7',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '256',
            output: '1',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '512',
            output: '1',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '1023',
            output: '10',
            isHidden: true,
            type: 'hidden'
          },
          // Edge cases
          {
            input: '2147483647',
            output: '31',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '1',
            output: '1',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '2097151',
            output: '21',
            isHidden: true,
            type: 'edge'
          }
        ]
      }
    });

    console.log('✅ Number of 1 Bits problem created successfully!');
    console.log('Problem ID:', problem.id);
    console.log('Slug:', problem.slug);
    console.log('Difficulty:', problem.difficulty);
    console.log('XP Reward:', problem.xpReward);
    const testCasesArray = Array.isArray(problem.testCases) ? problem.testCases : [];
    console.log('Test Cases:', testCasesArray.length);

  } catch (error) {
    console.error('❌ Error creating Number of 1 Bits problem:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateNumberOf1BitsProblem();
