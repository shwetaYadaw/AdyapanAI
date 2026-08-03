import { prisma } from '../config/prisma';

async function updateMinimumBitFlipsProblem() {
  try {
    // Delete any existing problem with this slug to avoid duplicates
    await prisma.question.deleteMany({
      where: { slug: 'minimum-bit-flips-to-convert-a-to-b' }
    });

    const problem = await prisma.question.create({
      data: {
        title: 'Minimum Bit Flips to Convert A to B',
        slug: 'minimum-bit-flips-to-convert-a-to-b',
        difficulty: 'EASY',
        topics: ['bit-manipulation'],
        companies: ['Microsoft', 'Google', 'Amazon', 'Apple', 'Adobe', 'Facebook', 'LinkedIn', 'Uber'],
        xpReward: 4,
        timeLimit: 1,
        memoryLimit: 256,
        
        statement: `# Minimum Bit Flips to Convert A to B

## Problem Statement

Given two integers \`a\` and \`b\`, write a program to count the **number of bits needed to be flipped** to convert \`a\` to \`b\`.

In other words, find the number of positions where the corresponding bits in the binary representations of \`a\` and \`b\` differ.

## Problem Details

- Input: Two non-negative integers \`a\` and \`b\`
- Output: An integer representing the count of bit positions that differ
- Constraints: \`0 <= a, b <= 10^9\`

## Key Concept

To find the differing bits between two numbers:
1. Use XOR operation: \`a ^ b\` produces 1s exactly where bits differ
2. Count the number of 1s in the XOR result
3. This count equals the minimum bit flips needed

## Examples

### Example 1
**Input:** \`a = 10, b = 20\`
**Output:** \`4\`
**Explanation:**
- Binary representation of 10: \`00001010\`
- Binary representation of 20: \`00010100\`
- XOR result (10 ^ 20): \`00011110\`
- Positions with difference (1s in XOR): positions 1, 2, 3, 4
- Number of 1s: 4
- Output: 4

### Example 2
**Input:** \`a = 10, b = 7\`
**Output:** \`3\`
**Explanation:**
- Binary representation of 10: \`00001010\`
- Binary representation of 7:  \`00000111\`
- XOR result (10 ^ 7): \`00001101\`
- Positions with difference (1s in XOR): positions 0, 2, 3
- Number of 1s: 3
- Output: 3

### Example 3
**Input:** \`a = 5, b = 5\`
**Output:** \`0\`
**Explanation:**
- Binary representation of 5: \`00000101\`
- Binary representation of 5: \`00000101\`
- XOR result (5 ^ 5): \`00000000\`
- No differing bits
- Output: 0

### Example 4
**Input:** \`a = 1, b = 15\`
**Output:** \`3\`
**Explanation:**
- Binary representation of 1:  \`00001\`
- Binary representation of 15: \`01111\`
- XOR result (1 ^ 15): \`01110\`
- Number of 1s: 3
- Output: 3

### Example 5
**Input:** \`a = 0, b = 15\`
**Output:** \`4\`
**Explanation:**
- Binary representation of 0:  \`00000\`
- Binary representation of 15: \`01111\`
- XOR result (0 ^ 15): \`01111\`
- Number of 1s: 4
- Output: 4

## Algorithm Approaches

### Approach 1: XOR + Brian Kernighan's Algorithm (Optimal)
**Time Complexity:** O(k) where k is the number of differing bits
**Space Complexity:** O(1)

Steps:
1. Compute XOR of a and b: \`xor_result = a ^ b\`
2. Use Brian Kernighan's trick: repeatedly apply \`xor_result & (xor_result - 1)\` to remove rightmost set bit
3. Count iterations until xor_result becomes 0

**Why it works:**
- XOR produces 1s where bits differ, 0s where bits are same
- \`n & (n-1)\` removes the rightmost set bit efficiently
- Loop runs exactly k times where k = number of set bits

### Approach 2: XOR + Bit Counting (Intuitive)
**Time Complexity:** O(log n) where n is the maximum of a and b
**Space Complexity:** O(1)

Steps:
1. Compute XOR: \`xor_result = a ^ b\`
2. Check each bit position from right to left
3. If bit is set, increment counter
4. Right-shift and repeat

### Approach 3: XOR + Built-in Functions (Language Specific)
**Time Complexity:** O(log n)
**Space Complexity:** O(1)

- Python: \`bin(a ^ b).count('1')\`
- JavaScript: \`(a ^ b).toString(2).split('1').length - 1\`
- Java: \`Integer.bitCount(a ^ b)\`
- C++: \`__builtin_popcount(a ^ b)\`

### Approach 4: Direct Bit Comparison (Brute Force)
**Time Complexity:** O(log n × constant)
**Space Complexity:** O(1)

Steps:
1. For each bit position (0 to 31 for 32-bit):
   - Extract bit from a: \`(a >> i) & 1\`
   - Extract bit from b: \`(b >> i) & 1\`
   - If different, increment counter
2. Return counter

## Correctness Proof

**Claim:** XOR of two numbers produces 1s exactly at positions where bits differ.

**Proof:**
- XOR truth table:
  - 0 XOR 0 = 0 (bits same)
  - 0 XOR 1 = 1 (bits differ)
  - 1 XOR 0 = 1 (bits differ)
  - 1 XOR 1 = 0 (bits same)
- Therefore, XOR result has 1s at all differing positions
- Counting 1s in XOR result = number of differing bits

**Claim:** \`n & (n-1)\` removes the rightmost set bit.

**Proof:**
- If n = ...1000 (rightmost 1 at position k)
- Then n-1 = ...0111 (all bits to right of k flipped)
- n & (n-1) = ...0000 (rightmost 1 and all right bits become 0)
- Each iteration reduces count of set bits by 1

## Common Mistakes

1. **Forgetting XOR operation:** Direct bit comparison without XOR is inefficient
2. **Using arithmetic right shift:** In some languages, use logical shift (>>>) not arithmetic (>>)
3. **Integer overflow:** For numbers up to 10^9, use 32-bit integers safely
4. **Off-by-one errors:** When iterating bit positions, ensure correct bounds
5. **Not handling zero:** When a == b, XOR is 0, result should be 0

## Edge Cases

- **a == b:** XOR is 0, output 0 (no flips needed)
- **a = 0, b = 2^k - 1:** All bits in b are set, output k
- **Large numbers:** Up to 10^9 (fits in 32-bit int)
- **Different bit lengths:** XOR naturally handles different lengths

## Interview Tips

- **Explain XOR operation:** XOR is fundamental to bit manipulation problems
- **Mention Hamming distance:** This problem is computing Hamming distance between a and b
- **Discuss efficiency:** Compare O(k) vs O(log n) approaches
- **Brian Kernighan's trick:** Explain why \`n & (n-1)\` is powerful
- **Follow-ups:**
  - Can you find which specific bits differ?
  - How would you convert a to b with minimum flips (if flips have different costs)?
  - What if a and b are very large (beyond 32-bit)?
- **Real-world applications:** Hamming distance used in error detection, bioinformatics (DNA comparison)

## Time & Space Complexity Analysis

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| XOR + Kernighan | O(k) | O(1) | k = number of differing bits, optimal |
| XOR + Bit Check | O(log n) | O(1) | n = max(a,b), simpler to understand |
| Built-in Function | O(log n) | O(1) | Language dependent, fastest in practice |
| Direct Comparison | O(32) | O(1) | Fixed iterations for 32-bit, simple |
`,

        inputFormat: `Two space-separated non-negative integers \`a\` and \`b\` (0 <= a, b <= 10^9)`,

        outputFormat: `An integer representing the number of bit positions where a and b differ`,

        constraints: `- 0 <= a, b <= 10^9
- Both numbers fit in 32-bit signed integer`,

        sampleInput: '10 20',
        sampleOutput: '4',

        templates: [
          {
            language: 'python',
            code: `def minBitFlips(a: int, b: int) -> int:
    """
    Count minimum bit flips needed to convert a to b.
    
    Args:
        a: First integer
        b: Second integer
        
    Returns:
        Number of bit positions where a and b differ
    """
    # XOR to find differing bits
    xor_result = a ^ b
    
    # Count set bits using Brian Kernighan's algorithm
    count = 0
    while xor_result:
        xor_result &= xor_result - 1  # Remove rightmost set bit
        count += 1
    
    return count

# Alternative: Using built-in
def minBitFlips_v2(a: int, b: int) -> int:
    """Alternative: Using built-in bin and count"""
    return bin(a ^ b).count('1')

# Alternative: Direct bit comparison
def minBitFlips_v3(a: int, b: int) -> int:
    """Alternative: Check each bit position"""
    count = 0
    xor_result = a ^ b
    for i in range(32):
        if (xor_result >> i) & 1:
            count += 1
    return count

# Test cases
if __name__ == "__main__":
    print(minBitFlips(10, 20))   # Output: 4
    print(minBitFlips(10, 7))    # Output: 3
    print(minBitFlips(5, 5))     # Output: 0
    print(minBitFlips(1, 15))    # Output: 3
    print(minBitFlips(0, 15))    # Output: 4`
          },
          {
            language: 'javascript',
            code: `function minBitFlips(a, b) {
    /**
     * Count minimum bit flips needed to convert a to b.
     * 
     * @param {number} a - First integer
     * @param {number} b - Second integer
     * @return {number} - Number of bit positions where a and b differ
     */
    
    // XOR to find differing bits
    let xorResult = a ^ b;
    
    // Count set bits using Brian Kernighan's algorithm
    let count = 0;
    while (xorResult > 0) {
        xorResult &= xorResult - 1;  // Remove rightmost set bit
        count++;
    }
    
    return count;
}

// Alternative: Using bit manipulation
function minBitFlips_v2(a, b) {
    let xorResult = a ^ b;
    let count = 0;
    
    while (xorResult) {
        count += xorResult & 1;  // Check if rightmost bit is 1
        xorResult >>>= 1;        // Unsigned right shift
    }
    
    return count;
}

// Alternative: Using toString
function minBitFlips_v3(a, b) {
    return (a ^ b).toString(2).split('1').length - 1;
}

// Test cases
console.log(minBitFlips(10, 20));   // Output: 4
console.log(minBitFlips(10, 7));    // Output: 3
console.log(minBitFlips(5, 5));     // Output: 0
console.log(minBitFlips(1, 15));    // Output: 3
console.log(minBitFlips(0, 15));    // Output: 4`
          },
          {
            language: 'cpp',
            code: `#include <iostream>
#include <bitset>
using namespace std;

int minBitFlips(int a, int b) {
    /**
     * Count minimum bit flips needed to convert a to b.
     * 
     * @param a - First integer
     * @param b - Second integer
     * @return - Number of bit positions where a and b differ
     */
    
    // XOR to find differing bits
    int xorResult = a ^ b;
    
    // Count set bits using Brian Kernighan's algorithm
    int count = 0;
    while (xorResult) {
        xorResult &= xorResult - 1;  // Remove rightmost set bit
        count++;
    }
    
    return count;
}

// Alternative: Using __builtin_popcount
int minBitFlips_v2(int a, int b) {
    return __builtin_popcount(a ^ b);
}

// Alternative: Bit-by-bit check
int minBitFlips_v3(int a, int b) {
    int xorResult = a ^ b;
    int count = 0;
    
    for (int i = 0; i < 32; i++) {
        if ((xorResult >> i) & 1) {
            count++;
        }
    }
    
    return count;
}

// Test cases
int main() {
    cout << minBitFlips(10, 20) << endl;   // Output: 4
    cout << minBitFlips(10, 7) << endl;    // Output: 3
    cout << minBitFlips(5, 5) << endl;     // Output: 0
    cout << minBitFlips(1, 15) << endl;    // Output: 3
    cout << minBitFlips(0, 15) << endl;    // Output: 4
    return 0;
}`
          },
          {
            language: 'java',
            code: `public class Solution {
    /**
     * Count minimum bit flips needed to convert a to b.
     * 
     * @param a - First integer
     * @param b - Second integer
     * @return - Number of bit positions where a and b differ
     */
    public int minBitFlips(int a, int b) {
        // XOR to find differing bits
        int xorResult = a ^ b;
        
        // Count set bits using Brian Kernighan's algorithm
        int count = 0;
        while (xorResult != 0) {
            xorResult &= xorResult - 1;  // Remove rightmost set bit
            count++;
        }
        
        return count;
    }
    
    // Alternative: Using Integer.bitCount
    public int minBitFlips_v2(int a, int b) {
        return Integer.bitCount(a ^ b);
    }
    
    // Alternative: Bit-by-bit check
    public int minBitFlips_v3(int a, int b) {
        int xorResult = a ^ b;
        int count = 0;
        
        for (int i = 0; i < 32; i++) {
            if (((xorResult >>> i) & 1) == 1) {
                count++;
            }
        }
        
        return count;
    }
    
    // Test cases
    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(sol.minBitFlips(10, 20));   // Output: 4
        System.out.println(sol.minBitFlips(10, 7));    // Output: 3
        System.out.println(sol.minBitFlips(5, 5));     // Output: 0
        System.out.println(sol.minBitFlips(1, 15));    // Output: 3
        System.out.println(sol.minBitFlips(0, 15));    // Output: 4
    }
}`
          }
        ],

        testCases: [
          // Visible test cases
          {
            input: '10 20',
            output: '4',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '10 7',
            output: '3',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '5 5',
            output: '0',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '1 15',
            output: '3',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '0 15',
            output: '4',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '0 0',
            output: '0',
            isHidden: false,
            type: 'visible'
          },
          // Hidden test cases - various bit patterns
          {
            input: '1 2',
            output: '2',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '3 7',
            output: '2',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '15 15',
            output: '0',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '255 128',
            output: '4',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '8 16',
            output: '2',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '31 0',
            output: '5',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '63 127',
            output: '1',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '100 200',
            output: '3',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '999 888',
            output: '7',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '512 1024',
            output: '2',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '65535 0',
            output: '16',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '1000000 500000',
            output: '6',
            isHidden: true,
            type: 'hidden'
          },
          // Edge cases with power of 2s
          {
            input: '1 2',
            output: '2',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '2 4',
            output: '2',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '4 8',
            output: '2',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '16 32',
            output: '2',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '256 512',
            output: '2',
            isHidden: true,
            type: 'hidden'
          },
          // Edge cases - large numbers near 10^9
          {
            input: '1000000000 999999999',
            output: '8',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '536870912 268435456',
            output: '1',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '1 1073741823',
            output: '29',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '0 1073741823',
            output: '30',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '2147483647 0',
            output: '31',
            isHidden: true,
            type: 'edge'
          }
        ]
      }
    });

    console.log('✅ Minimum Bit Flips to Convert A to B problem created successfully!');
    console.log('Problem ID:', problem.id);
    console.log('Slug:', problem.slug);
    console.log('Difficulty:', problem.difficulty);
    console.log('XP Reward:', problem.xpReward);
    const testCasesArray = Array.isArray(problem.testCases) ? problem.testCases : [];
    console.log('Test Cases:', testCasesArray.length);

  } catch (error) {
    console.error('❌ Error creating Minimum Bit Flips problem:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateMinimumBitFlipsProblem();
