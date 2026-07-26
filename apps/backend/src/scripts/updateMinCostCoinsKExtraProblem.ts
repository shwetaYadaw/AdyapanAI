import { prisma } from '../config/prisma';

async function updateMinCostCoinsKExtraProblem() {
  try {
    await prisma.question.deleteMany({
      where: { slug: 'min-cost-to-get-all-coins-with-k-extra' }
    });

    const problem = await prisma.question.create({
      data: {
        title: 'Minimum Cost to Get All Coins with K Extra Allowed',
        slug: 'min-cost-to-get-all-coins-with-k-extra',
        difficulty: 'MEDIUM',
        topics: ['arrays', 'greedy', 'sorting'],
        companies: ['Google', 'Amazon'],
        xpReward: 8,
        timeLimit: 2,
        memoryLimit: 256,
        
        statement: `# Minimum Cost to Get All Coins with K Extra Allowed

## Problem Statement

You are given an **array of coin costs** and **K free coins allowed**.

You need to **acquire all coins** at minimum cost.

You can get **K coins for free** (choose which K coins to skip paying for).

**Return the minimum cost** to acquire all coins.

## Problem Details

- Input: Array of coin costs and K (free coins allowed)
- Output: Minimum total cost to get all coins
- Goal: Select K coins to get free, minimize total cost
- Constraint: Must get all coins, pay for rest
- Strategy: Get expensive coins free, pay for cheaper ones

## Key Insights

1. **Greedy selection:** Avoid paying for most expensive coins
2. **Sorting:** Sort costs in descending order
3. **Skip expensive:** Choose K most expensive coins to skip
4. **Pay rest:** Sum up remaining costs
5. **Optimization:** Clearly defined optimal strategy

## Examples

### Example 1: Simple Case
**Input:**
\`\`\`
coins = [1, 2, 3, 4, 5]
K = 2
\`\`\`
**Output:** \`6\`

**Explanation:**
- Sort descending: [5, 4, 3, 2, 1]
- Skip most expensive 2: [5, 4]
- Pay for: [3, 2, 1] = 6

### Example 2: Get All Free
**Input:**
\`\`\`
coins = [10, 20, 30]
K = 3
\`\`\`
**Output:** \`0\`

**Explanation:**
- K >= number of coins
- Can get all for free
- Cost: 0

### Example 3: No Free Coins
**Input:**
\`\`\`
coins = [5, 10, 15]
K = 0
\`\`\`
**Output:** \`30\`

**Explanation:**
- No free coins allowed
- Must pay for all
- Cost: 5 + 10 + 15 = 30

### Example 4: Partial Free
**Input:**
\`\`\`
coins = [1, 1, 1, 1, 1]
K = 2
\`\`\`
**Output:** \`3\`

**Explanation:**
- All same cost
- Get 2 free
- Pay for 3
- Cost: 3

### Example 5: Mixed Costs
**Input:**
\`\`\`
coins = [100, 1, 50, 25, 75]
K = 1
\`\`\`
**Output:** \`151\`

**Explanation:**
- Sort: [100, 75, 50, 25, 1]
- Get 100 free
- Pay: 75 + 50 + 25 + 1 = 151

## Algorithm Approaches

### Approach 1: Sort and Greedy (Optimal)
**Time Complexity:** O(n log n)
**Space Complexity:** O(1)

Steps:
1. Sort coins in descending order
2. Skip first K coins (most expensive)
3. Sum remaining coins
4. Return sum

### Approach 2: Partial Sort (Optimization)
**Time Complexity:** O(n + k log k)
**Space Complexity:** O(k)

Steps:
1. Use quickselect or partial sort
2. Find K largest elements
3. Sum all except K largest
4. Return sum

### Approach 3: Min Heap Simulation
**Time Complexity:** O(n + k log n)
**Space Complexity:** O(n)

Steps:
1. Create max heap from costs
2. Extract K maximum elements
3. Sum remaining
4. Return sum

## Correctness Proof

**Theorem:** Skipping K most expensive coins minimizes total cost.

**Proof:**
1. **Goal:** Minimize cost = sum(all) - sum(skipped)
2. **Constraint:** Exactly K coins skipped
3. **Optimization:** To minimize cost, maximize skipped sum
4. **Greedy:** Skip K coins with maximum cost
5. **Correctness:** Any different choice increases cost
6. **Conclusion:** Greedy solution is optimal

## Common Mistakes

1. **Wrong direction:** Not skipping most expensive
2. **Counting error:** Including skipped coins in cost
3. **Boundary check:** Not handling K >= n
4. **Sorting issues:** Sorting ascending instead of descending
5. **Off-by-one:** Skipping wrong number of coins
6. **Overflow:** Large cost sums without proper handling

## Edge Cases

- **K = 0:** Pay for all coins
- **K >= n:** Get all coins free
- **n = 1:** Single coin
- **All same cost:** Any K coins skipped, same result
- **Very large costs:** Up to 10^9 per coin
- **Very long list:** Up to 10^5 coins
- **Negative K:** Should not occur (K >= 0)
- **Empty list:** Return 0

## Interview Tips

- **Clarify K:** How many free coins exactly
- **Verify greedy:** Prove skipping expensive is optimal
- **Trace examples:** Show selection process
- **Handle edge cases:** K >= n, K = 0
- **Optimization:** Partial sort for very large K
- **Follow-ups:**
  - Different coin groups?
  - Cost per type varies?
  - Multiple purchases?

## Real-World Applications

- **Discount strategy:** Maximize value of free items
- **Coupon optimization:** Choose items to use coupons on
- **Budget allocation:** Get essential items, skip premium
- **Procurement:** Minimize cost with limited discounts
- **Loyalty rewards:** Maximize redemption value

## Why This Problem Matters

This problem teaches:
1. **Greedy algorithm:** Optimal local choice
2. **Sorting applications:** Preprocessing for optimization
3. **Problem transformation:** Cost minimization to maximization
4. **Edge case handling:** Boundary conditions
5. **Simple optimization:** Sometimes simplicity is key

## Complexity Analysis

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Sort Greedy | O(n log n) | O(1) | Optimal, simple |
| Partial Sort | O(n + k²) | O(k) | Only for small K |
| Heap | O(n + k log n) | O(n) | Overkill here |

## Key Learning Points

- Sort descending to find most expensive coins
- Skip first K coins (most expensive)
- Sum remaining coins efficiently
- Handle K >= n case (all free)
- Verify with edge cases
`,

        inputFormat: `n (number of coins)
coins: space-separated integers (costs)
K: number of free coins allowed`,

        outputFormat: `Minimum total cost to acquire all coins`,

        constraints: `- 1 <= coins.length <= 10^5
- 1 <= coins[i] <= 10^9
- 0 <= K <= coins.length`,

        sampleInput: '5\n1 2 3 4 5\n2',
        sampleOutput: '6',

        testCases: [
          {
            input: '5\n1 2 3 4 5\n2',
            output: '6',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '3\n10 20 30\n3',
            output: '0',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '3\n5 10 15\n0',
            output: '30',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '5\n1 1 1 1 1\n2',
            output: '3',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '5\n100 1 50 25 75\n1',
            output: '151',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '1\n1000\n0',
            output: '1000',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '1\n1000\n1',
            output: '0',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '6\n10 20 30 40 50 60\n3',
            output: '60',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '4\n1 1 1 1\n0',
            output: '4',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '7\n7 6 5 4 3 2 1\n2',
            output: '18',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '2\n1000000000 1000000000\n1',
            output: '1000000000',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '5\n5 5 5 5 5\n5',
            output: '0',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '3\n1 2 3\n3',
            output: '0',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '4\n999999999 1 999999999 1\n2',
            output: '2',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '10\n1 2 3 4 5 6 7 8 9 10\n5',
            output: '15',
            isHidden: true,
            type: 'edge'
          }
        ],

        templates: [
          {
            language: 'python',
            code: `def minCostToGetAllCoins(coins, K):
    """
    Find minimum cost to get all coins with K free coins allowed.
    
    Args:
        coins: List of coin costs
        K: Number of free coins allowed
        
    Returns:
        Minimum total cost
    """
    
    # Edge case: can get all coins free
    if K >= len(coins):
        return 0
    
    # Sort coins in descending order
    coins.sort(reverse=True)
    
    # Skip first K coins (most expensive), pay for rest
    total_cost = sum(coins[K:])
    
    return total_cost

# Test cases
if __name__ == "__main__":
    print(minCostToGetAllCoins([1, 2, 3, 4, 5], 2))  # 6
    print(minCostToGetAllCoins([10, 20, 30], 3))  # 0
    print(minCostToGetAllCoins([5, 10, 15], 0))  # 30`
          },
          {
            language: 'javascript',
            code: `function minCostToGetAllCoins(coins, K) {
    /**
     * Find minimum cost to get all coins with K free coins allowed.
     * 
     * @param {number[]} coins - Array of coin costs
     * @param {number} K - Number of free coins allowed
     * @return {number} - Minimum total cost
     */
    
    // Edge case: can get all coins free
    if (K >= coins.length) {
        return 0;
    }
    
    // Sort coins in descending order
    coins.sort((a, b) => b - a);
    
    // Skip first K coins (most expensive), pay for rest
    let totalCost = 0;
    for (let i = K; i < coins.length; i++) {
        totalCost += coins[i];
    }
    
    return totalCost;
}

// Test cases
console.log(minCostToGetAllCoins([1, 2, 3, 4, 5], 2));  // 6
console.log(minCostToGetAllCoins([10, 20, 30], 3));  // 0
console.log(minCostToGetAllCoins([5, 10, 15], 0));  // 30`
          }
        ]
      }
    });

    console.log('✅ Min Cost Coins with K Extra problem created successfully!');
    
  } catch (error) {
    console.error('❌ Error creating problem:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateMinCostCoinsKExtraProblem();
