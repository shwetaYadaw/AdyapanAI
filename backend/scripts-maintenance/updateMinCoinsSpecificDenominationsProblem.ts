import { prisma } from '../config/prisma';

async function updateMinCoinsSpecificDenominationsProblem() {
  try {
    await prisma.question.deleteMany({
      where: { slug: 'minimum-coins-specific-denominations' }
    });

    const problem = await prisma.question.create({
      data: {
        title: 'Minimum Coins with Denominations {1,2,5,10}',
        slug: 'minimum-coins-specific-denominations',
        difficulty: 'EASY',
        topics: ['greedy', 'coin-change', 'arrays'],
        companies: ['Amazon', 'Google'],
        xpReward: 4,
        timeLimit: 1,
        memoryLimit: 128,
        
        statement: `# Minimum Coins with Fixed Denominations {1, 2, 5, 10}

## Problem Statement

You need to make **an amount of money** using **coins of denominations 1, 2, 5, and 10**.

Find the **minimum number of coins** needed to make the given amount.

You have **unlimited coins** of each denomination.

**Return the minimum number of coins** needed.

## Problem Details

- Input: Target amount to make
- Output: Minimum number of coins needed
- Available: Denominations 1, 2, 5, 10 (unlimited)
- Goal: Minimize coin count
- Constraint: Fixed denominations only

## Key Insights

1. **Greedy works:** For these specific denominations, greedy is optimal
2. **Largest first:** Use largest denomination possible
3. **Special case:** Denomination 2 and 5 work well together
4. **Remainder handling:** Handle remainders systematically
5. **Edge cases:** Small amounts need special handling

## Examples

### Example 1: Simple Amount
**Input:**
\`\`\`
amount = 11
\`\`\`
**Output:** \`2\`

**Explanation:**
- Use one 10-coin and one 1-coin
- 10 + 1 = 11
- Count: 2 coins

### Example 2: Medium Amount
**Input:**
\`\`\`
amount = 23
\`\`\`
**Output:** \`4\`

**Explanation:**
- 23 = 10 + 10 + 2 + 1 (4 coins)
- Or: 23 = 10 + 5 + 5 + 2 + 1 (5 coins)
- Best: 2 tens + 1 two + 1 one = 4 coins

### Example 3: Exact Denomination
**Input:**
\`\`\`
amount = 15
\`\`\`
**Output:** \`2\`

**Explanation:**
- 15 = 10 + 5
- Count: 2 coins

### Example 4: Small Amount
**Input:**
\`\`\`
amount = 3
\`\`\`
**Output:** \`2\`

**Explanation:**
- 3 = 2 + 1
- Count: 2 coins

### Example 5: Amount = 1
**Input:**
\`\`\`
amount = 1
\`\`\`
**Output:** \`1\`

**Explanation:**
- 1 = 1
- Count: 1 coin

## Algorithm Approaches

### Approach 1: Greedy (Simple and Optimal)
**Time Complexity:** O(1)
**Space Complexity:** O(1)

Steps:
1. Count 10s: amount // 10
2. Remainder: amount % 10
3. Count 5s: remainder // 5
4. Remainder: remainder % 5
5. Count 2s: remainder // 2
6. Remainder: remainder % 2
7. Count 1s: remainder
8. Sum all coins

### Approach 2: Dynamic Programming
**Time Complexity:** O(amount)
**Space Complexity:** O(amount)

Steps:
1. dp[i] = minimum coins for amount i
2. For each amount, try all coins
3. dp[i] = min(dp[i - coin] + 1)
4. Return dp[amount]

### Approach 3: Special Remainder Handling
**Time Complexity:** O(1)
**Space Complexity:** O(1)

Steps:
1. Handle special cases: 1-9
2. Use combinations of 2 and 5 efficiently
3. Use 10s for larger amounts
4. Combine optimally

## Correctness Proof

**Theorem:** Greedy algorithm finds minimum coins for {1,2,5,10}.

**Proof:**
1. **Denomination properties:** 10 > 5, 5 > 2, 2 > 1
2. **Greedy validity:** These specific denominations satisfy greedy choice property
3. **10-cent coin:** Always beneficial to use when possible
4. **5-cent coin:** Always beneficial after 10-cent coins
5. **2-cent coin:** Always beneficial after 5-cent coins
6. **1-cent coin:** Required for remainders
7. **Conclusion:** Greedy gives minimum coins

Note: Not all denomination sets work with greedy (e.g., {1,3,4})

## Common Mistakes

1. **Not using largest first:** Wrong greedy order
2. **Overflow:** Large amounts causing integer issues
3. **Negative amounts:** Not handling properly
4. **Zero amount:** Edge case
5. **Not minimizing:** Using suboptimal combinations
6. **Remainder errors:** Calculation mistakes
7. **Off-by-one:** Counting errors

## Edge Cases

- **amount = 0:** Return 0
- **amount = 1:** Return 1 (only 1-coin)
- **amount = 2:** Return 1 (one 2-coin)
- **Very large amount:** Up to 10^9
- **Special values:** 5, 10, 15, 20, etc.
- **Difficult remainders:** Like 3, 6, 7, 8, 9
- **Negative amount:** Invalid input (handle gracefully)

## Interview Tips

- **Verify greedy:** Why these denominations allow greedy
- **Compare algorithms:** DP vs Greedy complexity
- **Trace examples:** Show step-by-step coin selection
- **Explain remainder:** How to handle remainders optimally
- **Test edge cases:** 0, 1, special amounts
- **Follow-ups:**
  - Different denominations?
  - Limited coin supply?
  - Maximize coins instead?

## Real-World Applications

- **Cash handling:** Making change optimally
- **Vending machines:** Coin dispensing
- **ATM operations:** Minimal bill count
- **Currency conversion:** Optimal denomination use
- **Budget calculation:** Coin collection simulation
- **Game mechanics:** Currency exchange

## Why This Problem Matters

This problem teaches:
1. **Greedy algorithms:** When and why greedy works
2. **Denomination analysis:** Specific properties matter
3. **Modulo arithmetic:** Efficient remainder calculation
4. **Edge case thinking:** Zero, small numbers
5. **Practical application:** Real-world cash scenarios
6. **Optimization:** Simple solutions are best

## Complexity Analysis

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Greedy | O(1) | O(1) | Optimal, fastest |
| Dynamic Programming | O(n) | O(n) | General but slower |
| Remainder Handling | O(1) | O(1) | Similar to greedy |

## Key Learning Points

- Start with largest denomination (10)
- Use modulo for efficient division
- Handle remainders in order: 5, 2, 1
- Greedy works for these specific denominations
- Edge cases: 0, 1, special amounts
- Verify with various amounts
- Understand why greedy fails for other sets
`,

        inputFormat: `amount: integer representing the amount to make`,

        outputFormat: `Minimum number of coins needed`,

        constraints: `- 0 <= amount <= 10^9`,

        sampleInput: '11',
        sampleOutput: '2',

        testCases: [
          {
            input: '11',
            output: '2',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '23',
            output: '4',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '15',
            output: '2',
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
            input: '1',
            output: '1',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '0',
            output: '0',
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
            input: '5',
            output: '1',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '10',
            output: '1',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '27',
            output: '5',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '4',
            output: '2',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '6',
            output: '2',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '7',
            output: '2',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '8',
            output: '3',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '9',
            output: '3',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '100',
            output: '10',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '1000000000',
            output: '100000000',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '999999999',
            output: '100000000',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '42',
            output: '6',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '128',
            output: '16',
            isHidden: true,
            type: 'edge'
          }
        ],

        templates: [
          {
            language: 'python',
            code: `def minCoinsForAmount(amount):
    """
    Find minimum coins for given amount using {1, 2, 5, 10}.
    
    Args:
        amount: Target amount to make
        
    Returns:
        Minimum number of coins needed
    """
    
    if amount == 0:
        return 0
    
    coins = 0
    
    # Use 10-coins
    coins += amount // 10
    amount %= 10
    
    # Use 5-coins
    coins += amount // 5
    amount %= 5
    
    # Use 2-coins
    coins += amount // 2
    amount %= 2
    
    # Use 1-coins for remainder
    coins += amount
    
    return coins

# Test cases
if __name__ == "__main__":
    print(minCoinsForAmount(11))  # 2
    print(minCoinsForAmount(23))  # 4
    print(minCoinsForAmount(15))  # 2
    print(minCoinsForAmount(3))   # 2
    print(minCoinsForAmount(1))   # 1
    print(minCoinsForAmount(0))   # 0`
          },
          {
            language: 'javascript',
            code: `function minCoinsForAmount(amount) {
    /**
     * Find minimum coins for given amount using {1, 2, 5, 10}.
     * 
     * @param {number} amount - Target amount to make
     * @return {number} - Minimum number of coins needed
     */
    
    if (amount === 0) {
        return 0;
    }
    
    let coins = 0;
    
    // Use 10-coins
    coins += Math.floor(amount / 10);
    amount %= 10;
    
    // Use 5-coins
    coins += Math.floor(amount / 5);
    amount %= 5;
    
    // Use 2-coins
    coins += Math.floor(amount / 2);
    amount %= 2;
    
    // Use 1-coins for remainder
    coins += amount;
    
    return coins;
}

// Test cases
console.log(minCoinsForAmount(11));  // 2
console.log(minCoinsForAmount(23));  // 4
console.log(minCoinsForAmount(15));  // 2
console.log(minCoinsForAmount(3));   // 2
console.log(minCoinsForAmount(1));   // 1
console.log(minCoinsForAmount(0));   // 0`
          }
        ]
      }
    });

    console.log('✅ Min Coins with Specific Denominations problem created successfully!');
    
  } catch (error) {
    console.error('❌ Error creating problem:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateMinCoinsSpecificDenominationsProblem();
