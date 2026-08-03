import { prisma } from '../config/prisma';

async function updateDivideTwoIntegersProblem() {
  try {
    // Delete any existing problem with this slug to avoid duplicates
    await prisma.question.deleteMany({
      where: { slug: 'divide-two-integers' }
    });

    const problem = await prisma.question.create({
      data: {
        title: 'Divide Two Integers',
        slug: 'divide-two-integers',
        difficulty: 'MEDIUM',
        topics: ['bit-manipulation', 'math'],
        companies: ['Microsoft', 'Google', 'Amazon', 'Apple', 'Adobe', 'Bloomberg', 'LinkedIn'],
        xpReward: 8,
        timeLimit: 2,
        memoryLimit: 256,
        
        statement: `# Divide Two Integers

## Problem Statement

Given two integers \`dividend\` and \`divisor\`, divide two integers **without using multiplication, division, and mod operator**.

The integer division should **truncate toward zero**, which means losing its fractional part. For example:
- 8.345 would be truncated to 8
- -2.7335 would be truncated to -2

Return the quotient after dividing dividend by divisor.

**Special Case:** Assume we are dealing with an environment that could only store integers within the 32-bit signed integer range: [-2^31, 2^31 - 1]
- If the quotient is strictly greater than 2^31 - 1, return 2^31 - 1 (2147483647)
- If the quotient is strictly less than -2^31, return -2^31 (-2147483648)

## Problem Details

- Input: Two integers dividend and divisor
- Output: The quotient (result of division truncated toward zero)
- Constraints:
  - -2^31 <= dividend, divisor <= 2^31 - 1
  - divisor != 0

## Key Constraints

You **cannot use**:
- Multiplication operator (*)
- Division operator (/)
- Modulo operator (%)

This forces us to use bit manipulation and subtraction.

## Examples

### Example 1
**Input:** dividend = 10, divisor = 3
**Output:** 3
**Explanation:**
- 10 / 3 = 3.33333...
- Truncate toward zero gives 3
- Result: 3

### Example 2
**Input:** dividend = 7, divisor = -3
**Output:** -2
**Explanation:**
- 7 / -3 = -2.33333...
- Truncate toward zero gives -2
- Result: -2

### Example 3
**Input:** dividend = 0, divisor = 1
**Output:** 0
**Explanation:**
- 0 / 1 = 0
- Result: 0

### Example 4
**Input:** dividend = -2147483648, divisor = -1
**Output:** 2147483647
**Explanation:**
- -2147483648 / -1 = 2147483648
- But 2147483648 exceeds 2^31 - 1 (2147483647)
- Return clamped value: 2147483647

### Example 5
**Input:** dividend = -2147483648, divisor = 1
**Output:** -2147483648
**Explanation:**
- -2147483648 / 1 = -2147483648
- Within 32-bit range
- Result: -2147483648

### Example 6
**Input:** dividend = 1, divisor = 1
**Output:** 1
**Explanation:**
- 1 / 1 = 1
- Result: 1

## Algorithm Approaches

### Approach 1: Bit Shift with Repeated Subtraction (Optimal)
**Time Complexity:** O(log n * log n) or O(log n) with optimization
**Space Complexity:** O(1)

Steps:
1. Handle sign separately: determine if result should be negative
2. Work with absolute values
3. Use bit shifting to find the largest power of divisor that fits
4. Greedily subtract largest possible multiples (using bit shifts)
5. Handle overflow for edge case -2^31 / -1

**Algorithm:**
- For each bit position from 31 down to 0:
  - Check if (divisor << bit_position) fits into dividend
  - If yes, subtract and add (1 << bit_position) to quotient
  - Continue with remaining dividend

**Example trace for 10 / 3:**
- dividend = 10, divisor = 3
- Can fit 3 once (3 * 1 = 3, or 3 << 0)
- Remaining: 10 - 3 = 7
- Can fit 3 twice total (but 3 * 2 = 6, or 3 << 1)
- But 6 * 2 > 10, so only 1 fits at that position
- Continue checking smaller positions
- Result: 3

### Approach 2: Binary Exponentiation
**Time Complexity:** O(log n)
**Space Complexity:** O(log n)

Steps:
1. Compute all powers of divisor (2^0 * divisor, 2^1 * divisor, etc.)
2. Store them in a list
3. Greedily select largest powers that fit
4. Build quotient from largest to smallest

### Approach 3: Long Division Simulation
**Time Complexity:** O(log n)
**Space Complexity:** O(1)

Simulate the long division algorithm:
1. Process dividend bit by bit
2. Maintain current dividend value
3. Check how many times divisor fits
4. Build quotient

### Approach 4: Repeated Subtraction (Naive, Too Slow)
**Time Complexity:** O(quotient) - Too slow for large inputs
**Space Complexity:** O(1)

Steps:
1. Repeatedly subtract divisor from dividend
2. Count how many times we subtract
3. Return count

**Limitation:** Extremely slow for large quotients

## Correctness Proof

**Theorem:** Bit shift method correctly computes division without using / operator.

**Proof:**
1. Division: dividend = quotient * divisor + remainder
2. Bit shifting: value << k = value * 2^k (proven mathematically)
3. By processing from largest to smallest bit positions:
   - We ensure each power of 2 is tried once
   - We build quotient incrementally
   - The sum of selected bit positions equals quotient

**Example:**
- 10 / 3 = 3 remainder 1
- 10 = 3 * 3 + 1
- 3 = (2^1) + (2^0) = 2 + 1
- 3 * 3 = (2 + 1) * 3 = 6 + 3 = 9
- Remainder: 10 - 9 = 1

## Handling Edge Cases

1. **Overflow case:** -2^31 / -1 = 2^31 (exceeds limit, clamp to 2^31 - 1)
2. **Sign handling:** Track sign separately, apply at end
3. **Negative numbers:** Use two's complement representation
4. **Zero dividend:** Immediately return 0
5. **Divisor = 1 or -1:** Simplified cases

## Common Mistakes

1. **Forgetting sign:** Must track and apply sign to result
2. **Missing overflow check:** -2^31 / -1 overflows in 32-bit signed
3. **Using forbidden operators:** Accidentally using *, /, or %
4. **Incorrect bit shifting:** Left shift is multiply, right shift is divide
5. **Off-by-one errors:** In bit position iteration
6. **Not truncating toward zero:** Should truncate, not floor (different for negatives)
7. **Integer overflow in intermediate calculations:** When working with bit shifts

## Truncate vs Floor

**Important distinction:**
- **Truncate toward zero:** 7 / 3 = 2 (not 2.33...), -7 / 3 = -2 (not -2.33...)
- **Floor division:** 7 / 3 = 2, -7 / 3 = -3 (rounds toward negative infinity)
- This problem requires truncate toward zero (remove fractional part)

## Interview Tips

- **Explain the constraint:** Why we can't use /, *, or %
- **Start with simple approach:** Repeated subtraction (slow), then optimize
- **Discuss bit shifting:** a << k = a * 2^k, a >> k = a / 2^k
- **Handle the overflow case:** -2^31 / -1 is the key edge case
- **Sign handling:** Separate sign from magnitude for cleaner code
- **Binary search alternative:** Can also use binary search on quotient range
- **Follow-ups:**
  - What if we had unlimited integer size?
  - Can you solve it using only bit operations and no subtraction?
  - How would you handle floating-point division?

## Complexity Analysis

| Approach | Time | Space | Valid | Notes |
|----------|------|-------|-------|-------|
| Bit Shift | O(log^2 n) | O(1) | ✅ | Optimal, uses bit operations |
| Binary Exp | O(log n) | O(log n) | ✅ | Fast, uses extra space |
| Long Division | O(log n) | O(1) | ✅ | Efficient, clean logic |
| Repeated Sub | O(quotient) | O(1) | ❌ | Too slow |

## Real-World Applications

- CPU arithmetic units: Division without dedicated hardware
- Embedded systems: Limited instruction sets
- Cryptography: Modular arithmetic and division
- Compiler optimization: Code generation for division
`,

        inputFormat: `Two space-separated integers: dividend and divisor
Format: dividend divisor`,

        outputFormat: `A single integer representing the quotient (result of division truncated toward zero)`,

        constraints: `- -2^31 <= dividend, divisor <= 2^31 - 1
- divisor != 0
- Cannot use *, /, or %
- Result must be within 32-bit signed integer range`,

        sampleInput: '10 3',
        sampleOutput: '3',

        templates: [
          {
            language: 'python',
            code: `def divide(dividend: int, divisor: int) -> int:
    """
    Divide two integers without using *, /, or % operators.
    Uses bit manipulation for efficient division.
    
    Args:
        dividend: The number to be divided
        divisor: The divisor
        
    Returns:
        Quotient truncated toward zero
    """
    # 32-bit signed integer limits
    INT_MAX = 2**31 - 1
    INT_MIN = -2**31
    
    # Handle overflow edge case
    if dividend == INT_MIN and divisor == -1:
        return INT_MAX
    
    # Determine sign
    sign = -1 if (dividend < 0) ^ (divisor < 0) else 1
    
    # Work with absolute values
    dividend = abs(dividend)
    divisor = abs(divisor)
    
    quotient = 0
    
    # Bit shift approach: subtract divisor at different scales
    while dividend >= divisor:
        # Find the largest power of 2 multiplier
        temp_divisor = divisor
        multiplier = 1
        
        # Keep doubling divisor while it fits in dividend
        while dividend >= (temp_divisor << 1):
            temp_divisor <<= 1
            multiplier <<= 1
        
        # Subtract and accumulate
        dividend -= temp_divisor
        quotient += multiplier
    
    return sign * quotient

# Test cases
if __name__ == "__main__":
    print(divide(10, 3))                    # Output: 3
    print(divide(7, -3))                    # Output: -2
    print(divide(0, 1))                     # Output: 0
    print(divide(-2147483648, -1))          # Output: 2147483647
    print(divide(-2147483648, 1))           # Output: -2147483648
    print(divide(1, 1))                     # Output: 1`
          },
          {
            language: 'javascript',
            code: `function divide(dividend, divisor) {
    /**
     * Divide two integers without using *, /, or % operators.
     * Uses bit manipulation for efficient division.
     * 
     * @param {number} dividend - The number to be divided
     * @param {number} divisor - The divisor
     * @return {number} - Quotient truncated toward zero
     */
    
    // 32-bit signed integer limits
    const INT_MAX = Math.pow(2, 31) - 1;
    const INT_MIN = -Math.pow(2, 31);
    
    // Handle overflow edge case
    if (dividend === INT_MIN && divisor === -1) {
        return INT_MAX;
    }
    
    // Determine sign (XOR: true if signs differ)
    const sign = (dividend < 0) ^ (divisor < 0) ? -1 : 1;
    
    // Work with absolute values
    dividend = Math.abs(dividend);
    divisor = Math.abs(divisor);
    
    let quotient = 0;
    
    // Bit shift approach: subtract divisor at different scales
    while (dividend >= divisor) {
        // Find the largest power of 2 multiplier
        let tempDivisor = divisor;
        let multiplier = 1;
        
        // Keep doubling divisor while it fits in dividend
        while (dividend >= (tempDivisor << 1)) {
            tempDivisor <<= 1;
            multiplier <<= 1;
        }
        
        // Subtract and accumulate
        dividend -= tempDivisor;
        quotient += multiplier;
    }
    
    // Apply sign and clamp to 32-bit range
    quotient = sign * quotient;
    return quotient < INT_MIN ? INT_MIN : quotient > INT_MAX ? INT_MAX : quotient;
}

// Test cases
console.log(divide(10, 3));                    // Output: 3
console.log(divide(7, -3));                    // Output: -2
console.log(divide(0, 1));                     // Output: 0
console.log(divide(-2147483648, -1));          // Output: 2147483647
console.log(divide(-2147483648, 1));           // Output: -2147483648
console.log(divide(1, 1));                     // Output: 1`
          },
          {
            language: 'cpp',
            code: `#include <iostream>
#include <climits>
using namespace std;

int divide(long long dividend, long long divisor) {
    /**
     * Divide two integers without using *, /, or % operators.
     * Uses bit manipulation for efficient division.
     * 
     * @param dividend - The number to be divided
     * @param divisor - The divisor
     * @return - Quotient truncated toward zero
     */
    
    // 32-bit signed integer limits
    const long long INT_MAX = (1LL << 31) - 1;
    const long long INT_MIN = 1LL << 31;
    
    // Handle overflow edge case
    if (dividend == INT_MIN && divisor == -1) {
        return INT_MAX;
    }
    
    // Determine sign
    int sign = ((dividend < 0) ^ (divisor < 0)) ? -1 : 1;
    
    // Work with absolute values
    dividend = abs(dividend);
    divisor = abs(divisor);
    
    long long quotient = 0;
    
    // Bit shift approach: subtract divisor at different scales
    while (dividend >= divisor) {
        // Find the largest power of 2 multiplier
        long long tempDivisor = divisor;
        long long multiplier = 1;
        
        // Keep doubling divisor while it fits in dividend
        while (dividend >= (tempDivisor << 1)) {
            tempDivisor <<= 1;
            multiplier <<= 1;
        }
        
        // Subtract and accumulate
        dividend -= tempDivisor;
        quotient += multiplier;
    }
    
    return sign * quotient;
}

// Test cases
int main() {
    cout << divide(10, 3) << endl;                    // Output: 3
    cout << divide(7, -3) << endl;                    // Output: -2
    cout << divide(0, 1) << endl;                     // Output: 0
    cout << divide(-2147483648, -1) << endl;          // Output: 2147483647
    cout << divide(-2147483648, 1) << endl;           // Output: -2147483648
    cout << divide(1, 1) << endl;                     // Output: 1
    return 0;
}`
          },
          {
            language: 'java',
            code: `public class Solution {
    /**
     * Divide two integers without using *, /, or % operators.
     * Uses bit manipulation for efficient division.
     * 
     * @param dividend - The number to be divided
     * @param divisor - The divisor
     * @return - Quotient truncated toward zero
     */
    public int divide(int dividend, int divisor) {
        // 32-bit signed integer limits
        final long INT_MAX = (1L << 31) - 1;
        final long INT_MIN = 1L << 31;
        
        // Handle overflow edge case
        if (dividend == INT_MIN && divisor == -1) {
            return (int)INT_MAX;
        }
        
        // Determine sign
        int sign = ((dividend < 0) ^ (divisor < 0)) ? -1 : 1;
        
        // Convert to long to avoid overflow in intermediate calculations
        long dvd = Math.abs((long)dividend);
        long dvs = Math.abs((long)divisor);
        
        long quotient = 0;
        
        // Bit shift approach: subtract divisor at different scales
        while (dvd >= dvs) {
            // Find the largest power of 2 multiplier
            long tempDivisor = dvs;
            long multiplier = 1;
            
            // Keep doubling divisor while it fits in dividend
            while (dvd >= (tempDivisor << 1)) {
                tempDivisor <<= 1;
                multiplier <<= 1;
            }
            
            // Subtract and accumulate
            dvd -= tempDivisor;
            quotient += multiplier;
        }
        
        // Apply sign
        quotient = sign * quotient;
        
        // Clamp to 32-bit range
        if (quotient > INT_MAX) return (int)INT_MAX;
        if (quotient < INT_MIN) return (int)INT_MIN;
        return (int)quotient;
    }
    
    // Test cases
    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(sol.divide(10, 3));                    // Output: 3
        System.out.println(sol.divide(7, -3));                    // Output: -2
        System.out.println(sol.divide(0, 1));                     // Output: 0
        System.out.println(sol.divide(-2147483648, -1));          // Output: 2147483647
        System.out.println(sol.divide(-2147483648, 1));           // Output: -2147483648
        System.out.println(sol.divide(1, 1));                     // Output: 1
    }
}`
          }
        ],

        testCases: [
          // Visible test cases
          {
            input: '10 3',
            output: '3',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '7 -3',
            output: '-2',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '0 1',
            output: '0',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '-2147483648 -1',
            output: '2147483647',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '-2147483648 1',
            output: '-2147483648',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '1 1',
            output: '1',
            isHidden: false,
            type: 'visible'
          },
          // Hidden test cases - basic division
          {
            input: '15 2',
            output: '7',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '100 10',
            output: '10',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '1 -1',
            output: '-1',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '-5 2',
            output: '-2',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '5 -2',
            output: '-2',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '-5 -2',
            output: '2',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '1000 1',
            output: '1000',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '1000 -1',
            output: '-1000',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '-1000 1',
            output: '-1000',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '-1000 -1',
            output: '1000',
            isHidden: true,
            type: 'hidden'
          },
          // Hidden test cases - various quotients
          {
            input: '123 4',
            output: '30',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '456 7',
            output: '65',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '999 11',
            output: '90',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '100000 999',
            output: '100',
            isHidden: true,
            type: 'hidden'
          },
          // Hidden test cases - edge cases with negatives
          {
            input: '2147483647 1',
            output: '2147483647',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '2147483647 -1',
            output: '-2147483647',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '-2147483648 2',
            output: '-1073741824',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '-1 -1',
            output: '1',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '2 2',
            output: '1',
            isHidden: true,
            type: 'hidden'
          },
          // Edge cases - divisor edge cases
          {
            input: '1000000000 2',
            output: '500000000',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '-1000000000 2',
            output: '-500000000',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '1000000000 -3',
            output: '-333333333',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '2147483647 2',
            output: '1073741823',
            isHidden: true,
            type: 'edge'
          }
        ]
      }
    });

    console.log('✅ Divide Two Integers problem created successfully!');
    console.log('Problem ID:', problem.id);
    console.log('Slug:', problem.slug);
    console.log('Difficulty:', problem.difficulty);
    console.log('XP Reward:', problem.xpReward);
    const testCasesArray = Array.isArray(problem.testCases) ? problem.testCases : [];
    console.log('Test Cases:', testCasesArray.length);

  } catch (error) {
    console.error('❌ Error creating Divide Two Integers problem:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateDivideTwoIntegersProblem();
