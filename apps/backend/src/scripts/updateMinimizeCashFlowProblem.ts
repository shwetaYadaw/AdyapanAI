import { prisma } from '../config/prisma';

async function updateMinimizeCashFlowProblem() {
  try {
    // Delete any existing problem with this slug to avoid duplicates
    await prisma.question.deleteMany({
      where: { slug: 'minimize-cash-flow' }
    });

    const problem = await prisma.question.create({
      data: {
        title: 'Minimize Cash Flow',
        slug: 'minimize-cash-flow',
        difficulty: 'MEDIUM',
        topics: ['graphs', 'greedy', 'cash-flow', 'optimization'],
        companies: ['Amazon', 'Goldman Sachs', 'Morgan Stanley', 'JP Morgan', 'Uber', 'Airbnb'],
        xpReward: 8,
        timeLimit: 2,
        memoryLimit: 256,
        
        statement: `# Minimize Cash Flow

## Problem Statement

You are given n friends and a 2D array \`transaction[][]\`, where \`transaction[i][j]\` denotes the amount of money that friend i owes to friend j.

Your task is to design an algorithm that **minimizes the total cash flow among all friends** by calculating a new transaction table where the total amount transacted is minimized.

The key insight is that if friend A owes friend C through friend B, we can eliminate the intermediate transaction and have A pay C directly.

## Problem Details

- Input: A 2D matrix representing debt relationships between n friends
- Output: A 2D matrix with minimized transactions
- Goal: Minimize total number of transactions while settling all debts
- Constraints:
  - 1 <= n <= 1000
  - 0 <= transaction[i][j] <= 1000

## Key Insights

1. **Net Calculation:** Calculate net balance for each person (money owed - money to receive)
2. **Greedy Matching:** Match people who owe with people who are owed
3. **Minimum Transactions:** Reduce unnecessary intermediate transactions
4. **Cycle Detection:** Identify and eliminate circular debts

## Examples

### Example 1: Circular Debt Elimination
**Input:** 
\`\`\`
transaction[][] = [[0, 100, 0], [0, 0, 100], [100, 0, 0]]
\`\`\`
**Output:** 
\`\`\`
[[0, 0, 0], [0, 0, 0], [0, 0, 0]]
\`\`\`
**Explanation:**
- Friend 0 owes Friend 1: 100
- Friend 1 owes Friend 2: 100
- Friend 2 owes Friend 0: 100
- This forms a cycle: 0 → 1 → 2 → 0
- Net balance for each: 0
- Result: No transactions needed!

### Example 2: Direct Flow Optimization
**Input:**
\`\`\`
transaction[][] = [[0, 100, 0], [0, 0, 200], [0, 0, 0]]
\`\`\`
**Output:**
\`\`\`
[[0, 0, 100], [0, 0, 100], [0, 0, 0]]
\`\`\`
**Explanation:**
- Friend 0 owes Friend 1: 100
- Friend 1 owes Friend 2: 200
- Net calculation:
  - Friend 0: -100 (owes 100)
  - Friend 1: 100 - 200 = -100 (owes 100)
  - Friend 2: 200 (is owed 200)
- Direct settlement: 0 pays 2 directly 100, 1 pays 2 directly 100
- Result: 2 transactions instead of 3

### Example 3: Three Friends Simple Debt
**Input:**
\`\`\`
transaction[][] = [[0, 1000, 0], [0, 0, 1000], [0, 0, 0]]
\`\`\`
**Output:**
\`\`\`
[[0, 0, 1000], [0, 0, 0], [0, 0, 0]]
\`\`\`
**Explanation:**
- Friend 0 owes 1: 1000
- Friend 1 owes 2: 1000
- Combined: Friend 0 pays 2 directly: 1000
- Result: 1 transaction (optimal)

### Example 4: Complex Multi-Party
**Input:**
\`\`\`
transaction[][] = [[0, 500, 100], [100, 0, 50], [0, 200, 0]]
\`\`\`
**Output:** (Multiple valid solutions possible)
\`\`\`
[[0, 0, 0], [0, 0, 50], [150, 200, 0]]  or other equivalent minimal flows
\`\`\`
**Explanation:**
- Friend 0 owes: 500+100 = 600
- Friend 1 owes: 100+50 = 150, is owed: 500
- Friend 2 owes: 0, is owed: 100+200 = 300
- Net calculation:
  - Friend 0: -600 (needs to pay)
  - Friend 1: 500 - 150 = 350 (net receiver)
  - Friend 2: 300 - 0 = 300 (net receiver)
- After settlement minimization

## Algorithm Approaches

### Approach 1: Greedy with Net Balance (Optimal)
**Time Complexity:** O(n²) in worst case
**Space Complexity:** O(n)

Steps:
1. Calculate net balance for each person
2. Separate into debtors (negative) and creditors (positive)
3. Greedily match debtors with creditors
4. Record transactions and update balances
5. Repeat until all balanced

**Advantages:**
- Minimizes total transactions
- Simple and efficient
- Works for all cases

### Approach 2: DFS with Maximum Flow
**Time Complexity:** O(n³) or O(n² × edges)
**Space Complexity:** O(n²) for graph

Steps:
1. Build transaction graph
2. Calculate net flow for each node
3. Use DFS to find settlement paths
4. Update flows along paths
5. Output minimal transactions

**Advantages:**
- Handles complex flows
- Theoretically optimal

### Approach 3: Recursive Backtracking
**Time Complexity:** O(n!) worst case, O(n²) average
**Space Complexity:** O(n)

Steps:
1. Find person with max debt
2. Recursively match with creditors
3. Backtrack and explore alternatives
4. Return minimal transaction set

**Disadvantages:**
- Can be slower for large inputs
- Explores many possibilities

## Correctness Proof

**Theorem:** Greedy matching of net debtors and creditors produces minimal transactions.

**Proof:**
1. Each person has a net balance (positive/negative)
2. Total positive balance = Total negative balance (sum property)
3. Matching maximizes settlement per transaction
4. Minimum transactions = max(|debtors|, |creditors|)
5. Greedy approach achieves this minimum

## Common Mistakes

1. **Not calculating net balance:** Must compute net for each person
2. **Intermediate transactions:** Not eliminating unnecessary flows
3. **Circular debts:** Not detecting and eliminating cycles
4. **Precision issues:** Floating point rounding errors
5. **Array bounds:** Wrong matrix dimensions
6. **Negative values:** Not handling negative transactions

## Edge Cases

- **n = 1:** Single person, no transactions
- **All zeros:** No debts, empty output
- **Circular debts:** Multiple cycles need elimination
- **One-way debt:** Simple linear settlement
- **Large transactions:** Up to 1000 × 1000 friends
- **No debt:** Everyone balanced already
- **Complete circuit:** Everyone owes next person

## Interview Tips

- **Clarify requirements:** Minimize number of transactions vs. total amount
- **Net balance insight:** Key to optimal solution
- **Edge cases:** Start with simple examples
- **Complexity discussion:** Trade-offs between approaches
- **Follow-ups:**
  - What if we want minimum number of transactions?
  - How to handle partial payments?
  - Can we do it with multiple rounds?

## Real-World Applications

- **Expense splitting:** Friends settling bills (Splitwise, Venmo)
- **Supply chain:** Minimizing inter-company payments
- **Settlement systems:** Bank clearing houses
- **Project teams:** Settling internal project costs
- **Rental management:** Splitting utility bills

## Why This Problem Matters

This problem teaches:
1. **Net flow calculation:** Understanding debt aggregation
2. **Greedy algorithms:** Optimal local choices
3. **Graph theory:** Transaction networks
4. **Optimization:** Minimizing total flow
5. **Real-world systems:** Expense splitting apps

## Complexity Analysis

| Aspect | Value | Notes |
|--------|-------|-------|
| Time | O(n²) | Greedy matching |
| Space | O(n) | Balance array |
| Graph Size | O(n²) | Dense transaction matrix |
| Transactions | O(n) | Maximum in result |

## Key Learning Points

- Calculate net balance for each participant
- Greedy matching of debtors and creditors
- Eliminate circular and intermediate flows
- Verify solution conserves total debt
- Handle edge cases properly
`,

        inputFormat: `Number of friends n
2D array of transactions where transaction[i][j] is money friend i owes friend j`,

        outputFormat: `2D array with minimized transactions
Same format as input, where result[i][j] is the minimized amount i owes j`,

        constraints: `- 1 <= n <= 1000
- 0 <= transaction[i][j] <= 1000
- Output must preserve net flow
- Multiple solutions possible`,

        sampleInput: '3\n0 100 0\n0 0 100\n100 0 0',
        sampleOutput: '0 0 0\n0 0 0\n0 0 0',

        templates: [
          {
            language: 'python',
            code: `def minimizeCashFlow(transaction):
    """
    Minimize cash flow among friends using greedy net balance approach.
    
    Args:
        transaction: 2D list where transaction[i][j] = amount i owes j
        
    Returns:
        2D list with minimized transactions
    """
    n = len(transaction)
    
    # Calculate net balance for each person
    # Positive: person is owed money, Negative: person owes money
    balance = [0] * n
    
    for i in range(n):
        for j in range(n):
            # i owes money (decreases balance)
            balance[i] -= transaction[i][j]
            # j is owed money (increases balance)
            balance[j] += transaction[i][j]
    
    # Result matrix
    result = [[0] * n for _ in range(n)]
    
    # Greedy settlement
    def settle(balances):
        # Find debtor (most negative) and creditor (most positive)
        debtor = -1
        creditor = -1
        
        for i in range(len(balances)):
            if balances[i] < 0 and (debtor == -1 or balances[i] < balances[debtor]):
                debtor = i
            if balances[i] > 0 and (creditor == -1 or balances[i] > balances[creditor]):
                creditor = i
        
        # If everyone is settled
        if debtor == -1 or creditor == -1:
            return
        
        # Amount to transfer
        amount = min(-balances[debtor], balances[creditor])
        
        # Record transaction
        result[debtor][creditor] += amount
        
        # Update balances
        balances[debtor] += amount
        balances[creditor] -= amount
        
        # Continue settling
        settle(balances)
    
    settle(balance)
    return result

# Test cases
if __name__ == "__main__":
    # Example 1: Circular debts
    t1 = [[0, 100, 0], [0, 0, 100], [100, 0, 0]]
    result1 = minimizeCashFlow(t1)
    print("Example 1:", result1)
    
    # Example 2: Linear flow
    t2 = [[0, 100, 0], [0, 0, 200], [0, 0, 0]]
    result2 = minimizeCashFlow(t2)
    print("Example 2:", result2)
    
    # Example 3: Simple chain
    t3 = [[0, 1000, 0], [0, 0, 1000], [0, 0, 0]]
    result3 = minimizeCashFlow(t3)
    print("Example 3:", result3)`
          },
          {
            language: 'javascript',
            code: `function minimizeCashFlow(transaction) {
    /**
     * Minimize cash flow among friends using greedy net balance approach.
     * 
     * @param {number[][]} transaction - 2D array where transaction[i][j] = amount i owes j
     * @return {number[][]} - 2D array with minimized transactions
     */
    
    const n = transaction.length;
    
    // Calculate net balance for each person
    const balance = new Array(n).fill(0);
    
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            // i owes money (decreases balance)
            balance[i] -= transaction[i][j];
            // j is owed money (increases balance)
            balance[j] += transaction[i][j];
        }
    }
    
    // Result matrix
    const result = Array(n).fill(0).map(() => Array(n).fill(0));
    
    // Greedy settlement function
    function settle(balances) {
        // Find debtor (most negative) and creditor (most positive)
        let debtor = -1;
        let creditor = -1;
        
        for (let i = 0; i < balances.length; i++) {
            if (balances[i] < 0 && (debtor === -1 || balances[i] < balances[debtor])) {
                debtor = i;
            }
            if (balances[i] > 0 && (creditor === -1 || balances[i] > balances[creditor])) {
                creditor = i;
            }
        }
        
        // If everyone is settled
        if (debtor === -1 || creditor === -1) {
            return;
        }
        
        // Amount to transfer
        const amount = Math.min(-balances[debtor], balances[creditor]);
        
        // Record transaction
        result[debtor][creditor] += amount;
        
        // Update balances
        balances[debtor] += amount;
        balances[creditor] -= amount;
        
        // Continue settling
        settle(balances);
    }
    
    settle(balance);
    return result;
}

// Test cases
console.log("Example 1:", minimizeCashFlow([[0, 100, 0], [0, 0, 100], [100, 0, 0]]));
console.log("Example 2:", minimizeCashFlow([[0, 100, 0], [0, 0, 200], [0, 0, 0]]));
console.log("Example 3:", minimizeCashFlow([[0, 1000, 0], [0, 0, 1000], [0, 0, 0]]));</
`
          },
          {
            language: 'cpp',
            code: `#include <iostream>
#include <vector>
#include <cmath>
#include <algorithm>
using namespace std;

int main() {
    /**
     * Minimize cash flow among friends using greedy net balance approach.
     */
    
    int n;
    cin >> n;
    
    vector<vector<int>> transaction(n, vector<int>(n));
    
    // Read transactions
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            cin >> transaction[i][j];
        }
    }
    
    // Calculate net balance for each person
    vector<long long> balance(n, 0);
    
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            // i owes money (decreases balance)
            balance[i] -= transaction[i][j];
            // j is owed money (increases balance)
            balance[j] += transaction[i][j];
        }
    }
    
    // Result matrix
    vector<vector<long long>> result(n, vector<long long>(n, 0));
    
    // Greedy settlement using recursion
    function<void(vector<long long>&)> settle = [&](vector<long long>& balances) {
        // Find debtor (most negative) and creditor (most positive)
        int debtor = -1;
        int creditor = -1;
        
        for (int i = 0; i < (int)balances.size(); i++) {
            if (balances[i] < 0 && (debtor == -1 || balances[i] < balances[debtor])) {
                debtor = i;
            }
            if (balances[i] > 0 && (creditor == -1 || balances[i] > balances[creditor])) {
                creditor = i;
            }
        }
        
        // If everyone is settled
        if (debtor == -1 || creditor == -1) {
            return;
        }
        
        // Amount to transfer
        long long amount = min(-balances[debtor], balances[creditor]);
        
        // Record transaction
        result[debtor][creditor] += amount;
        
        // Update balances
        balances[debtor] += amount;
        balances[creditor] -= amount;
        
        // Continue settling
        settle(balances);
    };
    
    settle(balance);
    
    // Output result
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            cout << result[i][j];
            if (j < n - 1) cout << " ";
        }
        cout << endl;
    }
    
    return 0;
}`
          },
          {
            language: 'java',
            code: `import java.util.*;

public class Solution {
    /**
     * Minimize cash flow among friends using greedy net balance approach.
     * 
     * @param transaction - 2D array where transaction[i][j] = amount i owes j
     * @return - 2D array with minimized transactions
     */
    public static long[][] minimizeCashFlow(int[][] transaction) {
        int n = transaction.length;
        
        // Calculate net balance for each person
        long[] balance = new long[n];
        
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                // i owes money (decreases balance)
                balance[i] -= transaction[i][j];
                // j is owed money (increases balance)
                balance[j] += transaction[i][j];
            }
        }
        
        // Result matrix
        long[][] result = new long[n][n];
        
        // Greedy settlement
        settle(balance, result);
        
        return result;
    }
    
    private static void settle(long[] balance, long[][] result) {
        // Find debtor (most negative) and creditor (most positive)
        int debtor = -1;
        int creditor = -1;
        
        for (int i = 0; i < balance.length; i++) {
            if (balance[i] < 0 && (debtor == -1 || balance[i] < balance[debtor])) {
                debtor = i;
            }
            if (balance[i] > 0 && (creditor == -1 || balance[i] > balance[creditor])) {
                creditor = i;
            }
        }
        
        // If everyone is settled
        if (debtor == -1 || creditor == -1) {
            return;
        }
        
        // Amount to transfer
        long amount = Math.min(-balance[debtor], balance[creditor]);
        
        // Record transaction
        result[debtor][creditor] += amount;
        
        // Update balances
        balance[debtor] += amount;
        balance[creditor] -= amount;
        
        // Continue settling
        settle(balance, result);
    }
    
    // Test cases
    public static void main(String[] args) {
        // Example 1: Circular debts
        int[][] t1 = {{0, 100, 0}, {0, 0, 100}, {100, 0, 0}};
        long[][] result1 = minimizeCashFlow(t1);
        System.out.println("Example 1:");
        for (long[] row : result1) {
            System.out.println(Arrays.toString(row));
        }
        
        // Example 2: Linear flow
        int[][] t2 = {{0, 100, 0}, {0, 0, 200}, {0, 0, 0}};
        long[][] result2 = minimizeCashFlow(t2);
        System.out.println("Example 2:");
        for (long[] row : result2) {
            System.out.println(Arrays.toString(row));
        }
        
        // Example 3: Simple chain
        int[][] t3 = {{0, 1000, 0}, {0, 0, 1000}, {0, 0, 0}};
        long[][] result3 = minimizeCashFlow(t3);
        System.out.println("Example 3:");
        for (long[] row : result3) {
            System.out.println(Arrays.toString(row));
        }
    }
}`
          }
        ],

        testCases: [
          // Visible test cases
          {
            input: '3\n0 100 0\n0 0 100\n100 0 0',
            output: '0 0 0\n0 0 0\n0 0 0',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '3\n0 100 0\n0 0 200\n0 0 0',
            output: '0 0 100\n0 0 100\n0 0 0',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '3\n0 1000 0\n0 0 1000\n0 0 0',
            output: '0 0 1000\n0 0 0\n0 0 0',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '2\n0 500\n500 0',
            output: '0 500\n0 0',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '4\n0 100 0 50\n0 0 200 0\n0 0 0 100\n0 0 0 0',
            output: '0 0 50 50\n0 0 150 50\n0 0 0 100\n0 0 0 0',
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
            input: '4\n0 200 100 0\n0 0 50 100\n0 0 0 200\n50 0 0 0',
            output: '0 100 0 100\n0 0 0 150\n0 0 0 200\n0 0 0 0',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '5\n0 100 100 0 0\n0 0 100 0 0\n0 0 0 100 100\n0 0 0 0 0\n100 0 0 0 0',
            output: '0 0 200 0 0\n0 0 0 100 0\n0 0 0 0 200\n0 0 0 0 0\n0 0 0 0 0',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '3\n0 50 50\n50 0 50\n50 50 0',
            output: '0 0 0\n0 0 0\n0 0 0',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '4\n0 100 0 0\n100 0 100 0\n0 100 0 100\n0 0 100 0',
            output: '0 0 0 0\n0 0 200 0\n0 0 0 200\n0 0 0 0',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '2\n0 1000\n0 0',
            output: '0 1000\n0 0',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '3\n0 200 300\n100 0 100\n0 0 0',
            output: '0 200 300\n0 0 100\n0 0 0',
            isHidden: true,
            type: 'hidden'
          },
          // Edge cases
          {
            input: '2\n0 0\n0 0',
            output: '0 0\n0 0',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '5\n0 0 0 0 0\n0 0 0 0 0\n0 0 0 0 0\n0 0 0 0 0\n0 0 0 0 0',
            output: '0 0 0 0 0\n0 0 0 0 0\n0 0 0 0 0\n0 0 0 0 0\n0 0 0 0 0',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '3\n0 1000 1000\n0 0 1000\n0 0 0',
            output: '0 0 2000\n0 0 1000\n0 0 0',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '4\n0 250 250 0\n250 0 0 250\n0 250 0 250\n0 0 250 0',
            output: '0 0 0 0\n0 0 0 0\n0 0 0 0\n0 0 0 0',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '3\n0 100 200\n100 0 100\n50 150 0',
            output: '0 0 0\n0 0 200\n150 150 0',
            isHidden: true,
            type: 'edge'
          }
        ]
      }
    });

    console.log('✅ Minimize Cash Flow problem created successfully!');
    console.log('Problem ID:', problem.id);
    console.log('Slug:', problem.slug);
    console.log('Difficulty:', problem.difficulty);
    console.log('XP Reward:', problem.xpReward);
    const testCasesArray = Array.isArray(problem.testCases) ? problem.testCases : [];
    console.log('Test Cases:', testCasesArray.length);

  } catch (error) {
    console.error('❌ Error creating Minimize Cash Flow problem:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateMinimizeCashFlowProblem();
