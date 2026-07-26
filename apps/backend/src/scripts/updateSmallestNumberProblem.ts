import { prisma } from '../config/prisma';

async function updateSmallestNumberProblem() {
  try {
    // Delete any existing problem with this slug to avoid duplicates
    await prisma.question.deleteMany({
      where: { slug: 'smallest-number-with-given-digit-sum' }
    });

    const problem = await prisma.question.create({
      data: {
        title: 'Smallest Number with Given Digit Count and Sum',
        slug: 'smallest-number-with-given-digit-sum',
        difficulty: 'MEDIUM',
        topics: ['greedy', 'strings', 'math'],
        companies: ['Amazon', 'Microsoft', 'Google', 'Adobe', 'Apple', 'Goldman Sachs', 'Flipkart'],
        xpReward: 7,
        timeLimit: 2,
        memoryLimit: 256,
        
        statement: `# Smallest Number with Given Digit Count and Sum

## Problem Statement

Given two integers \`s\` (digit sum) and \`d\` (digit count), find the **smallest possible number that has exactly d digits and a sum of digits equal to s**.

Return the number as a **string**. If no such number exists, return **"-1"**.

The smallest number means:
1. The number has minimum value (e.g., 18 is smaller than 81)
2. This is achieved by placing smaller digits in the front and larger digits at the back

## Problem Details

- Input: Two integers s (digit sum) and d (digit count)
- Output: Smallest number as string, or "-1" if impossible
- Constraints vary based on problem version

## Key Insights

To find the smallest number with d digits and sum s:
1. **Validity check:** Minimum sum possible = 1 (first digit) + 0*(d-1), Maximum = 9*d
   - If s < 1 or s > 9*d, return "-1"
   - Special case: if d == 1 and s == 0, return "-1" (no single digit 0 for d-digit number)
2. **Greedy approach:** Fill digits from right to left
   - Place 0s as much as possible from front
   - Place remaining sum from right to left with 9s, then remaining digit
3. **Construct result:**
   - First digit: minimum 1 (cannot be 0)
   - Fill remaining digits greedily to minimize value

## Examples

### Example 1
**Input:** s = 9, d = 2
**Output:** "18"
**Explanation:**
- Need 2 digits with sum 9
- Start with minimum: "1?" where ? needs sum = 8
- Place 8 in second position: "18"
- Result: 18

### Example 2
**Input:** s = 20, d = 3
**Output:** "299"
**Explanation:**
- Need 3 digits with sum 20
- Start with minimum: "1??" where remaining sum = 19
- We need to fill 2 positions with sum 19
- Maximum for 2 positions = 18 (9+9), not enough
- So try "2??": remaining sum = 18, which is 9+9
- Result: "299"

### Example 3
**Input:** s = 1, d = 1
**Output:** "1"
**Explanation:**
- Need 1 digit with sum 1
- Result: 1

### Example 4
**Input:** s = 0, d = 2
**Output:** "-1"
**Explanation:**
- Cannot have 2-digit number with sum 0
- Minimum 2-digit = 10 (sum = 1)
- Return -1

### Example 5
**Input:** s = 100, d = 2
**Output:** "-1"
**Explanation:**
- Maximum 2-digit sum = 9 + 9 = 18
- s = 100 > 18, impossible
- Return -1

### Example 6
**Input:** s = 15, d = 3
**Output:** "159"
**Explanation:**
- Need 3 digits with sum 15
- Start with "1": remaining = 14 for 2 positions
- Maximum for 2 positions = 18, sufficient
- Fill from right: remaining = 14, use 9 in last position
- remaining = 5, use 5 in middle: "159"

## Algorithm Approaches

### Approach 1: Greedy Fill from Right (Optimal)
**Time Complexity:** O(d)
**Space Complexity:** O(d) for result string

Steps:
1. Check validity: s < 1 or s > 9*d → return "-1"
2. Initialize array with all 0s
3. Set first digit to 1, subtract 1 from s
4. Fill from right to left with maximum possible digits (up to 9)
5. Add remaining sum to a position before the first digit
6. Convert to string

**Example trace for s=20, d=3:**
- Check: 1 <= 20 <= 27 ✓
- Initialize: [0, 0, 0]
- Set first: [1, 0, 0], s=19
- Fill right: [1, 0, 9], s=10
- Fill right: [1, 9, 9], s=1
- No remaining digits, s=1 goes to position before first
- Update first digit: [2, 9, 9]
- Result: "299"

### Approach 2: Greedy Fill with Position Tracking
**Time Complexity:** O(d)
**Space Complexity:** O(d)

Similar to Approach 1 but uses explicit position tracking.

### Approach 3: Mathematical Construction
**Time Complexity:** O(d)
**Space Complexity:** O(d)

Build the number digit by digit using mathematical calculation.

## Correctness Proof

**Theorem:** Greedy right-to-left filling produces the lexicographically smallest number.

**Proof:**
1. To minimize number, we want smallest leftmost digits
2. First digit must be at least 1 (cannot start with 0)
3. After fixing first digit to 1, we minimize remaining positions
4. To minimize remaining positions, place largest values (9s) at rightmost
5. This allows leftmost positions to have smallest possible values
6. By filling right-to-left with 9s and adjusting first digit as needed, we achieve minimum

**Example:** For s=20, d=3
- Any 3-digit starting with 1: "1ab" requires a+b=19, min is "199" (19=9+10, but max digit is 9)
- "199" has a+b=18, need 1 more, so increase first digit: "299"
- No smaller option exists

## Validity Conditions

1. **Minimum possible sum:** 1 + 0 + 0 + ... = 1 (d digits)
2. **Maximum possible sum:** 9 + 9 + 9 + ... = 9*d (d nines)
3. **Valid range:** 1 <= s <= 9*d
4. **Special case:** s < 1 or s > 9*d → return "-1"

## Common Mistakes

1. **Forgetting first digit must be >= 1:** Cannot have leading zeros
2. **Wrong validity check:** Not checking s < 1 properly
3. **Off-by-one errors:** When updating first digit
4. **Integer overflow:** For large d values
5. **String conversion:** Make sure to convert correctly
6. **Edge cases:** s = 0, d = 0, mismatches

## Edge Cases

- **s = 0, d = 1:** Return "-1" (no single digit 0)
- **s = 0, d > 1:** Return "-1" (multi-digit cannot be all 0s)
- **s = 1, d = 1:** Return "1"
- **s = 9, d = 1:** Return "9"
- **s = 1, d = 2:** Return "-1" (minimum 2-digit is 10, sum 1)
- **s = 9*d, d = any:** Return string of d nines "999...9"
- **Very large d:** Handle efficiently

## Interview Tips

- **Explain validity check:** Why s must be in range [1, 9*d]
- **Greedy intuition:** Why filling right-to-left minimizes value
- **First digit handling:** Why it must be >= 1
- **String construction:** How to build result efficiently
- **Edge cases:** Discuss various boundary conditions
- **Follow-ups:**
  - What if we need the largest number instead?
  - What if we need all permutations?
  - How to optimize space further?
  - What if digits must be unique?

## Real-World Applications

- **Number generation:** Creating specific digit patterns
- **Data validation:** Checking digit constraints
- **Coding challenges:** Constraint satisfaction
- **Cryptography:** Digit pattern generation
- **Mathematical puzzles:** Digit manipulation problems

## Why This Problem Matters

This problem teaches:
1. **Greedy algorithm thinking:** When greedy approach works
2. **Constraint satisfaction:** Working within bounds
3. **String manipulation:** Converting numbers to strings
4. **Edge case handling:** Boundary conditions
5. **Optimization:** Finding lexicographically smallest

## Complexity Analysis

| Aspect | Value | Notes |
|--------|-------|-------|
| Time | O(d) | Single pass through d positions |
| Space | O(d) | String of length d |
| Validity check | O(1) | Constant operations |
| String conversion | O(d) | Converting d digits to string |
`,

        inputFormat: `Two space-separated integers: s and d
Format: s d
where s = digit sum, d = digit count`,

        outputFormat: `A string representing the smallest number with d digits and digit sum s, or "-1" if impossible`,

        constraints: `Varies based on problem version - typically:
- 1 <= s <= 10^3 (or more)
- 1 <= d <= 10^5 (or more)
- Result must have exactly d digits with sum s`,

        sampleInput: '9 2',
        sampleOutput: '18',

        templates: [
          {
            language: 'python',
            code: `def smallestNumberWithDigitSum(s, d):
    """
    Find smallest number with d digits and digit sum s.
    
    Args:
        s: Digit sum required
        d: Number of digits required
        
    Returns:
        Smallest number as string, or "-1" if impossible
    """
    # Validity check
    # Minimum sum for d digits: 1 (at least one 1)
    # Maximum sum for d digits: 9*d (all 9s)
    if s < 1 or s > 9 * d:
        return "-1"
    
    # Initialize result with all zeros
    result = [0] * d
    
    # Set first digit to 1 (cannot be 0)
    result[0] = 1
    remaining = s - 1
    
    # Fill from right to left with maximum possible digits
    for i in range(d - 1, -1, -1):
        if remaining == 0:
            break
        
        # Add at most 9 to current position (already has 0 except first)
        add = min(9, remaining)
        result[i] += add
        remaining -= add
    
    # If we still have remaining sum, add to first digit
    result[0] += remaining
    
    # Convert to string
    return ''.join(map(str, result))

# Alternative approach - more explicit
def smallestNumberWithDigitSum_v2(s, d):
    """Alternative implementation"""
    # Check validity
    if s == 0 or s > 9 * d:
        return "-1"
    
    # Array to store digits
    digits = [0] * d
    digits[0] = 1
    remaining_sum = s - 1
    
    # Fill from back to front
    pos = d - 1
    while remaining_sum > 0 and pos >= 0:
        add = min(9 - digits[pos], remaining_sum)
        digits[pos] += add
        remaining_sum -= add
        pos -= 1
    
    if remaining_sum > 0:
        return "-1"
    
    return ''.join(map(str, digits))

# Test cases
if __name__ == "__main__":
    print(smallestNumberWithDigitSum(9, 2))      # Output: 18
    print(smallestNumberWithDigitSum(20, 3))     # Output: 299
    print(smallestNumberWithDigitSum(1, 1))      # Output: 1
    print(smallestNumberWithDigitSum(0, 2))      # Output: -1
    print(smallestNumberWithDigitSum(100, 2))    # Output: -1
    print(smallestNumberWithDigitSum(15, 3))     # Output: 159`
          },
          {
            language: 'javascript',
            code: `function smallestNumberWithDigitSum(s, d) {
    /**
     * Find smallest number with d digits and digit sum s.
     * 
     * @param {number} s - Digit sum required
     * @param {number} d - Number of digits required
     * @return {string} - Smallest number as string, or "-1" if impossible
     */
    
    // Validity check
    if (s < 1 || s > 9 * d) {
        return "-1";
    }
    
    // Initialize result with all zeros
    const result = new Array(d).fill(0);
    
    // Set first digit to 1 (cannot be 0)
    result[0] = 1;
    let remaining = s - 1;
    
    // Fill from right to left with maximum possible digits
    for (let i = d - 1; i >= 0 && remaining > 0; i--) {
        const add = Math.min(9, remaining);
        result[i] += add;
        remaining -= add;
    }
    
    // If still have remaining, add to first digit
    result[0] += remaining;
    
    // Convert to string
    return result.join('');
}

// Alternative approach
function smallestNumberWithDigitSum_v2(s, d) {
    if (s === 0 || s > 9 * d) {
        return "-1";
    }
    
    const digits = new Array(d).fill(0);
    digits[0] = 1;
    let remainingSum = s - 1;
    
    // Fill from back to front
    for (let pos = d - 1; pos >= 0 && remainingSum > 0; pos--) {
        const add = Math.min(9 - digits[pos], remainingSum);
        digits[pos] += add;
        remainingSum -= add;
    }
    
    if (remainingSum > 0) {
        return "-1";
    }
    
    return digits.join('');
}

// Test cases
console.log(smallestNumberWithDigitSum(9, 2));      // Output: 18
console.log(smallestNumberWithDigitSum(20, 3));     // Output: 299
console.log(smallestNumberWithDigitSum(1, 1));      // Output: 1
console.log(smallestNumberWithDigitSum(0, 2));      // Output: -1
console.log(smallestNumberWithDigitSum(100, 2));    // Output: -1
console.log(smallestNumberWithDigitSum(15, 3));     // Output: 159`
          },
          {
            language: 'cpp',
            code: `#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

string smallestNumberWithDigitSum(int s, int d) {
    /**
     * Find smallest number with d digits and digit sum s.
     * 
     * @param s - Digit sum required
     * @param d - Number of digits required
     * @return - Smallest number as string, or "-1" if impossible
     */
    
    // Validity check
    if (s < 1 || s > 9 * d) {
        return "-1";
    }
    
    // Initialize result with all zeros
    vector<int> result(d, 0);
    
    // Set first digit to 1 (cannot be 0)
    result[0] = 1;
    int remaining = s - 1;
    
    // Fill from right to left with maximum possible digits
    for (int i = d - 1; i >= 0 && remaining > 0; i--) {
        int add = min(9, remaining);
        result[i] += add;
        remaining -= add;
    }
    
    // If still have remaining, add to first digit
    result[0] += remaining;
    
    // Convert to string
    string resultStr = "";
    for (int digit : result) {
        resultStr += to_string(digit);
    }
    
    return resultStr;
}

// Test cases
int main() {
    cout << smallestNumberWithDigitSum(9, 2) << endl;      // Output: 18
    cout << smallestNumberWithDigitSum(20, 3) << endl;     // Output: 299
    cout << smallestNumberWithDigitSum(1, 1) << endl;      // Output: 1
    cout << smallestNumberWithDigitSum(0, 2) << endl;      // Output: -1
    cout << smallestNumberWithDigitSum(100, 2) << endl;    // Output: -1
    cout << smallestNumberWithDigitSum(15, 3) << endl;     // Output: 159
    
    return 0;
}`
          },
          {
            language: 'java',
            code: `public class Solution {
    /**
     * Find smallest number with d digits and digit sum s.
     * 
     * @param s - Digit sum required
     * @param d - Number of digits required
     * @return - Smallest number as string, or "-1" if impossible
     */
    public String smallestNumberWithDigitSum(int s, int d) {
        // Validity check
        if (s < 1 || s > 9 * d) {
            return "-1";
        }
        
        // Initialize result with all zeros
        int[] result = new int[d];
        
        // Set first digit to 1 (cannot be 0)
        result[0] = 1;
        int remaining = s - 1;
        
        // Fill from right to left with maximum possible digits
        for (int i = d - 1; i >= 0 && remaining > 0; i--) {
            int add = Math.min(9, remaining);
            result[i] += add;
            remaining -= add;
        }
        
        // If still have remaining, add to first digit
        result[0] += remaining;
        
        // Convert to string
        StringBuilder sb = new StringBuilder();
        for (int digit : result) {
            sb.append(digit);
        }
        
        return sb.toString();
    }
    
    // Test cases
    public static void main(String[] args) {
        Solution sol = new Solution();
        
        System.out.println(sol.smallestNumberWithDigitSum(9, 2));      // Output: 18
        System.out.println(sol.smallestNumberWithDigitSum(20, 3));     // Output: 299
        System.out.println(sol.smallestNumberWithDigitSum(1, 1));      // Output: 1
        System.out.println(sol.smallestNumberWithDigitSum(0, 2));      // Output: -1
        System.out.println(sol.smallestNumberWithDigitSum(100, 2));    // Output: -1
        System.out.println(sol.smallestNumberWithDigitSum(15, 3));     // Output: 159
    }
}`
          }
        ],

        testCases: [
          // Visible test cases
          {
            input: '9 2',
            output: '18',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '20 3',
            output: '299',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '1 1',
            output: '1',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '0 2',
            output: '-1',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '100 2',
            output: '-1',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '15 3',
            output: '159',
            isHidden: false,
            type: 'visible'
          },
          // Hidden test cases - valid cases
          {
            input: '1 2',
            output: '-1',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '10 2',
            output: '19',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '27 3',
            output: '999',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '5 1',
            output: '5',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '18 2',
            output: '99',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '2 2',
            output: '-1',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '3 1',
            output: '3',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '11 2',
            output: '29',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '25 3',
            output: '889',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '12 2',
            output: '39',
            isHidden: true,
            type: 'hidden'
          },
          // Hidden test cases - edge cases
          {
            input: '9 1',
            output: '9',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '30 4',
            output: '3999',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '50 5',
            output: '59999',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '45 5',
            output: '99999',
            isHidden: true,
            type: 'hidden'
          },
          // Edge cases - impossible cases
          {
            input: '0 1',
            output: '-1',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '91 10',
            output: '-1',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '1 10',
            output: '1000000000',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '9 10',
            output: '1000000008',
            isHidden: true,
            type: 'edge'
          }
        ]
      }
    });

    console.log('✅ Smallest Number with Given Digit Sum problem created successfully!');
    console.log('Problem ID:', problem.id);
    console.log('Slug:', problem.slug);
    console.log('Difficulty:', problem.difficulty);
    console.log('XP Reward:', problem.xpReward);
    const testCasesArray = Array.isArray(problem.testCases) ? problem.testCases : [];
    console.log('Test Cases:', testCasesArray.length);

  } catch (error) {
    console.error('❌ Error creating Smallest Number problem:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateSmallestNumberProblem();
