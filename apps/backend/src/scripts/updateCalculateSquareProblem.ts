import { prisma } from '../config/prisma';

async function updateCalculateSquareProblem() {
  try {
    // Delete any existing problem with this slug to avoid duplicates
    await prisma.question.deleteMany({
      where: { slug: 'calculate-square-of-a-number' }
    });

    const problem = await prisma.question.create({
      data: {
        title: 'Calculate Square of a Number Without Using *, / and pow()',
        slug: 'calculate-square-of-a-number',
        difficulty: 'EASY',
        topics: ['math', 'bit-manipulation'],
        companies: ['Microsoft', 'Google', 'Amazon', 'Apple', 'Adobe', 'Morgan Stanley', 'Goldman Sachs'],
        xpReward: 3,
        timeLimit: 1,
        memoryLimit: 256,
        
        statement: `# Calculate Square of a Number Without Using *, / and pow()

## Problem Statement

Given an integer \`n\`, calculate the **square of the number** without using the multiplication operator (\`*\`), division operator (\`/\`), or the power function (\`pow()\`).

In other words, compute \`n²\` using only basic arithmetic operations like addition (+) and subtraction (-).

## Problem Details

- Input: A single integer \`n\` (can be positive, negative, or zero)
- Output: An integer representing n²
- Constraints: \`-10^9 <= n <= 10^9\`
- Restrictions: Cannot use \`*\`, \`/\`, or \`pow()\` functions

## Key Concepts

This problem tests knowledge of:
1. **Mathematical identities:** Using algebraic formulas instead of direct multiplication
2. **Alternative computation methods:** Using loops or bit operations
3. **Handling edge cases:** Negative numbers, zero, large numbers
4. **Algorithm optimization:** Trading operations for efficiency

## Examples

### Example 1
**Input:** \`n = 5\`
**Output:** \`25\`
**Explanation:**
- Direct method: 5 × 5 = 25
- Our approach: Sum 5 five times: 5 + 5 + 5 + 5 + 5 = 25
- Or using identity: (5 + 5 + 5 + 5 + 5) = 25

### Example 2
**Input:** \`n = 7\`
**Output:** \`49\`
**Explanation:**
- Our approach: Sum 7 seven times: 7 + 7 + 7 + 7 + 7 + 7 + 7 = 49

### Example 3
**Input:** \`n = 12\`
**Output:** \`144\`
**Explanation:**
- Our approach: Sum 12 twelve times = 144

### Example 4
**Input:** \`n = -5\`
**Output:** \`25\`
**Explanation:**
- Squaring negative numbers yields positive results
- (-5)² = 25
- Our approach: Sum -5 five times: -5 + -5 + -5 + -5 + -5 = -25, then negate to get 25
- Or use absolute value: square |n| = 25

### Example 5
**Input:** \`n = 0\`
**Output:** \`0\`
**Explanation:**
- 0² = 0
- No addition needed

### Example 6
**Input:** \`n = 1\`
**Output:** \`1\`
**Explanation:**
- 1² = 1
- Sum 1 once = 1

## Algorithm Approaches

### Approach 1: Repeated Addition (Simple)
**Time Complexity:** O(n)
**Space Complexity:** O(1)

Steps:
1. If n is negative, work with absolute value and square it (result is always positive)
2. Initialize sum = 0
3. Loop n times, adding n to sum each iteration
4. Return sum

**Why it works:**
- n² = n + n + n + ... (n times)
- Example: 5² = 5 + 5 + 5 + 5 + 5 = 25

**Limitation:** O(n) time complexity is slow for large n

### Approach 2: Using Bit Shifting (Optimized)
**Time Complexity:** O(log n) or O(1) for fixed bit width
**Space Complexity:** O(1)

Steps:
1. Use bit shifting instead of addition
2. Binary representation: 5 = 101₂
3. Build result by considering each bit position
4. n² can be computed as sum of shifted values

**Why it works:**
- Each bit position represents a power of 2
- n = ∑(bit_i × 2^i)
- n² = (∑(bit_i × 2^i))²

### Approach 3: Mathematical Identity
**Time Complexity:** O(1)
**Space Complexity:** O(1)

Using identity: \`(a+b)² = a² + 2ab + b²\`

Steps:
1. Split n into two parts: a and b where n = a + b
2. Recursively calculate a² and b²
3. Calculate 2ab using addition
4. Sum all components

**Example:** n = 5, split into a=2, b=3
- 5² = 2² + 2(2)(3) + 3²
- 5² = 4 + 12 + 9 = 25

### Approach 4: Using Left Shift (Bit Manipulation)
**Time Complexity:** O(log n)
**Space Complexity:** O(1)

Binary approach:
- n << 1 is equivalent to n × 2
- n << k is equivalent to n × 2^k
- Build n² using these shifted operations

### Approach 5: Using Logarithms (Mathematical)
**Time Complexity:** O(1)
**Space Complexity:** O(1)

Steps:
1. Use property: n² = 10^(2 × log₁₀(n))
2. Calculate logarithm
3. Multiply by 2
4. Take power of 10
5. Handle negative numbers and zero separately

**Limitation:** May have floating-point precision issues

## Correctness Proof

**Claim:** Repeated addition of n for n times equals n².

**Proof:**
- By definition of multiplication: n × m = n added m times
- Therefore: n × n = n added n times
- Hence: n² = n + n + n + ... (n times)
- Mathematically: n² = ∑(i=0 to n-1) n

**Claim:** Bit shifting approach preserves accuracy.

**Proof:**
- n = ∑(bit_i × 2^i) (binary decomposition)
- n² = (∑(bit_i × 2^i)) × (∑(bit_i × 2^i))
- Expanding: n² = ∑∑(bit_i × bit_j × 2^(i+j))
- Left shift: n << k = n × 2^k (proven by binary representation)

## Common Mistakes

1. **Forgetting negative numbers:** (-5)² = 25, not -25. Always square the absolute value
2. **Inefficient loops:** Using n iterations is slow for large n (use optimized approaches)
3. **Integer overflow:** For numbers near 10^9, n² can overflow (handle carefully)
4. **Using forbidden operations:** Accidentally using * or / in the solution
5. **Floating-point errors:** Avoid using logarithms due to precision issues
6. **Not handling zero:** Zero is a special case but simpler (0² = 0)

## Edge Cases

- **n = 0:** Output 0 (special case, no addition needed)
- **n = 1:** Output 1 (single iteration or base case)
- **n = -1:** Output 1 (negative squared is positive)
- **Large positive:** n = 10^9, result = 10^18 (may overflow)
- **Large negative:** n = -10^9, result = 10^18 (handle carefully)
- **Powers of 2:** n = 2, 4, 8 (test bit shifting effectiveness)

## Interview Tips

- **Explain the constraint:** Why * and / are forbidden and what we can use instead
- **Discuss trade-offs:** O(n) repeated addition vs O(log n) bit manipulation
- **Mention overflow:** How to handle results that exceed integer limits
- **Mathematical identity:** Explain why (a+b)² = a² + 2ab + b² helps here
- **Real-world applications:**
  - Competitive programming (no built-in operations)
  - Embedded systems with limited operations
  - Hardware-level computation without multipliers
- **Follow-ups:**
  - Can you compute n^k (any power) without using the power operator?
  - How would you handle floating-point numbers?
  - What's the fastest algorithm for very large n?
  - How do you prevent integer overflow?

## Time & Space Complexity Comparison

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Repeated Addition | O(n) | O(1) | Simple but slow for large n |
| Bit Manipulation | O(log n) | O(1) | Efficient, good balance |
| Math Identity | O(log n) | O(1) | Recursive approach |
| Left Shift | O(log n) | O(1) | Fast, uses bit operations |
| Logarithm | O(1) | O(1) | Precision issues possible |

## Practical Considerations

- **For competitive programming:** Use bit manipulation (Approach 2 or 4)
- **For interviews:** Explain repeated addition first, then optimize
- **For production code:** Use built-in operations (not applicable here due to constraints)
- **For embedded systems:** Bit operations are efficient and commonly used
`,

        inputFormat: `A single integer \`n\` (-10^9 <= n <= 10^9)`,

        outputFormat: `An integer representing n² (the square of n)`,

        constraints: `- -10^9 <= n <= 10^9
- Cannot use *, /, or pow()
- Result must be accurate for all valid inputs`,

        sampleInput: '5',
        sampleOutput: '25',

        templates: [
          {
            language: 'python',
            code: `def calculateSquare(n: int) -> int:
    """
    Calculate square of n without using *, /, or pow().
    Uses repeated addition with optimization for performance.
    
    Args:
        n: Integer to square
        
    Returns:
        n² (square of n)
    """
    # Handle negative numbers
    is_negative = n < 0
    n = abs(n)
    
    # Handle special case
    if n == 0:
        return 0
    
    # Approach 1: Optimized repeated addition using bit operations
    result = 0
    power = n
    bit = 1
    
    while bit <= n:
        if bit & n:  # If this bit is set
            result += power
        power += power  # Double the power (equivalent to left shift)
        bit += bit
    
    return result

# Alternative: Simple repeated addition (slower but clearer)
def calculateSquare_v2(n: int) -> int:
    """Alternative: Direct repeated addition"""
    n = abs(n)
    result = 0
    for _ in range(n):
        result += n
    return result

# Alternative: Using bit shifting
def calculateSquare_v3(n: int) -> int:
    """Alternative: Using bit shifting (n << k = n * 2^k)"""
    n = abs(n)
    result = 0
    power = n
    
    while power <= n * n:
        result += power
        power += power  # Left shift equivalent
        if result * 2 > n * n:
            break
    
    return result * result if result != 0 else 0

# Test cases
if __name__ == "__main__":
    print(calculateSquare(5))     # Output: 25
    print(calculateSquare(7))     # Output: 49
    print(calculateSquare(12))    # Output: 144
    print(calculateSquare(-5))    # Output: 25
    print(calculateSquare(0))     # Output: 0
    print(calculateSquare(1))     # Output: 1`
          },
          {
            language: 'javascript',
            code: `function calculateSquare(n) {
    /**
     * Calculate square of n without using *, /, or pow().
     * Uses optimized repeated addition.
     * 
     * @param {number} n - Integer to square
     * @return {number} - n² (square of n)
     */
    
    // Handle negative numbers
    const isNegative = n < 0;
    n = Math.abs(n);
    
    // Handle special case
    if (n === 0) {
        return 0;
    }
    
    // Approach: Optimized repeated addition using bit operations
    let result = 0;
    let power = n;
    let bit = 1;
    
    while (bit <= n) {
        if (bit & n) {  // If this bit is set
            result += power;
        }
        power += power;  // Double the power (left shift equivalent)
        bit += bit;
    }
    
    return result;
}

// Alternative: Simple repeated addition (slower but clearer)
function calculateSquare_v2(n) {
    n = Math.abs(n);
    let result = 0;
    for (let i = 0; i < n; i++) {
        result += n;
    }
    return result;
}

// Alternative: Using bit operations explicitly
function calculateSquare_v3(n) {
    n = Math.abs(n);
    let result = 0;
    
    // Add n to itself n times
    let count = n;
    while (count > 0) {
        if (count & 1) {  // If odd
            result += n;
        }
        n += n;  // Double n (equivalent to left shift)
        count >>>= 1;  // Right shift by 1
    }
    
    return result;
}

// Test cases
console.log(calculateSquare(5));     // Output: 25
console.log(calculateSquare(7));     // Output: 49
console.log(calculateSquare(12));    // Output: 144
console.log(calculateSquare(-5));    // Output: 25
console.log(calculateSquare(0));     // Output: 0
console.log(calculateSquare(1));     // Output: 1`
          },
          {
            language: 'cpp',
            code: `#include <iostream>
#include <cstdlib>
using namespace std;

int calculateSquare(int n) {
    /**
     * Calculate square of n without using *, /, or pow().
     * Uses optimized repeated addition with bit operations.
     * 
     * @param n - Integer to square
     * @return - n² (square of n)
     */
    
    // Handle negative numbers
    bool isNegative = n < 0;
    n = abs(n);
    
    // Handle special case
    if (n == 0) {
        return 0;
    }
    
    // Approach: Optimized repeated addition
    long long result = 0;
    long long power = n;
    long long bit = 1;
    
    while (bit <= n) {
        if (bit & n) {  // If this bit is set
            result += power;
        }
        power += power;  // Double the power
        bit += bit;
    }
    
    return (int)result;
}

// Alternative: Simple repeated addition (slower)
int calculateSquare_v2(int n) {
    n = abs(n);
    long long result = 0;
    for (int i = 0; i < n; i++) {
        result += n;
    }
    return (int)result;
}

// Alternative: Using bit shifting explicitly
int calculateSquare_v3(int n) {
    n = abs(n);
    long long result = 0;
    long long original_n = n;
    
    // Add n to itself n times using binary multiplication
    long long count = n;
    while (count > 0) {
        if (count & 1) {  // If odd
            result += original_n;
        }
        original_n += original_n;  // Double
        count >>= 1;  // Right shift by 1
    }
    
    return (int)result;
}

// Test cases
int main() {
    cout << calculateSquare(5) << endl;     // Output: 25
    cout << calculateSquare(7) << endl;     // Output: 49
    cout << calculateSquare(12) << endl;    // Output: 144
    cout << calculateSquare(-5) << endl;    // Output: 25
    cout << calculateSquare(0) << endl;     // Output: 0
    cout << calculateSquare(1) << endl;     // Output: 1
    return 0;
}`
          },
          {
            language: 'java',
            code: `public class Solution {
    /**
     * Calculate square of n without using *, /, or pow().
     * Uses optimized repeated addition with bit operations.
     * 
     * @param n - Integer to square
     * @return - n² (square of n)
     */
    public long calculateSquare(int n) {
        // Handle negative numbers
        boolean isNegative = n < 0;
        n = Math.abs(n);
        
        // Handle special case
        if (n == 0) {
            return 0;
        }
        
        // Approach: Optimized repeated addition
        long result = 0;
        long power = n;
        long bit = 1;
        
        while (bit <= n) {
            if ((bit & n) != 0) {  // If this bit is set
                result += power;
            }
            power += power;  // Double the power
            bit += bit;
        }
        
        return result;
    }
    
    // Alternative: Simple repeated addition (slower)
    public long calculateSquare_v2(int n) {
        n = Math.abs(n);
        long result = 0;
        for (int i = 0; i < n; i++) {
            result += n;
        }
        return result;
    }
    
    // Alternative: Using bit operations explicitly
    public long calculateSquare_v3(int n) {
        n = Math.abs(n);
        long result = 0;
        long original_n = n;
        long count = n;
        
        // Add n to itself n times using binary multiplication
        while (count > 0) {
            if ((count & 1) != 0) {  // If odd
                result += original_n;
            }
            original_n += original_n;  // Double
            count >>>= 1;  // Unsigned right shift by 1
        }
        
        return result;
    }
    
    // Test cases
    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(sol.calculateSquare(5));     // Output: 25
        System.out.println(sol.calculateSquare(7));     // Output: 49
        System.out.println(sol.calculateSquare(12));    // Output: 144
        System.out.println(sol.calculateSquare(-5));    // Output: 25
        System.out.println(sol.calculateSquare(0));     // Output: 0
        System.out.println(sol.calculateSquare(1));     // Output: 1
    }
}`
          }
        ],

        testCases: [
          // Visible test cases
          {
            input: '5',
            output: '25',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '7',
            output: '49',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '12',
            output: '144',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '0',
            output: '0',
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
            input: '-5',
            output: '25',
            isHidden: false,
            type: 'visible'
          },
          // Hidden test cases - various numbers
          {
            input: '2',
            output: '4',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '3',
            output: '9',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '4',
            output: '16',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '6',
            output: '36',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '8',
            output: '64',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '10',
            output: '100',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '15',
            output: '225',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '20',
            output: '400',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '25',
            output: '625',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '100',
            output: '10000',
            isHidden: true,
            type: 'hidden'
          },
          // Hidden test cases - negative numbers
          {
            input: '-1',
            output: '1',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '-7',
            output: '49',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '-12',
            output: '144',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '-20',
            output: '400',
            isHidden: true,
            type: 'hidden'
          },
          // Hidden test cases - larger numbers
          {
            input: '50',
            output: '2500',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '99',
            output: '9801',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '256',
            output: '65536',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '1000',
            output: '1000000',
            isHidden: true,
            type: 'hidden'
          },
          // Edge cases
          {
            input: '-100',
            output: '10000',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '31623',
            output: '1000014129',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '2147',
            output: '4609609',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '-1',
            output: '1',
            isHidden: true,
            type: 'edge'
          }
        ]
      }
    });

    console.log('✅ Calculate Square of a Number problem created successfully!');
    console.log('Problem ID:', problem.id);
    console.log('Slug:', problem.slug);
    console.log('Difficulty:', problem.difficulty);
    console.log('XP Reward:', problem.xpReward);
    const testCasesArray = Array.isArray(problem.testCases) ? problem.testCases : [];
    console.log('Test Cases:', testCasesArray.length);

  } catch (error) {
    console.error('❌ Error creating Calculate Square problem:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateCalculateSquareProblem();
