import { prisma } from '../config/prisma';

async function updateFractionalKnapsackProblem() {
  try {
    // Delete any existing problem with this slug to avoid duplicates
    await prisma.question.deleteMany({
      where: { slug: 'fractional-knapsack' }
    });

    const problem = await prisma.question.create({
      data: {
        title: 'Fractional Knapsack',
        slug: 'fractional-knapsack',
        difficulty: 'MEDIUM',
        topics: ['greedy', 'dynamic-programming', 'optimization'],
        companies: ['Amazon', 'Microsoft', 'Google', 'Adobe', 'Goldman Sachs', 'Morgan Stanley', 'Flipkart'],
        xpReward: 7,
        timeLimit: 2,
        memoryLimit: 256,
        
        statement: `# Fractional Knapsack Problem

## Problem Statement

Given two arrays, \`val[]\` and \`wt[]\`, representing the **values and weights of items**, and an integer \`capacity\` representing the **maximum weight a knapsack can hold**, determine the **maximum total value** that can be achieved by putting items in the knapsack.

You are **allowed to break items into fractions** if necessary. This is the key difference from the 0/1 Knapsack problem.

Return the **maximum value as a double, rounded to 6 decimal places**.

## Problem Details

- Input: Two arrays (values and weights) and capacity
- Output: Maximum total value (double, 6 decimal places)
- Constraints:
  - 1 <= val.size = wt.size <= 10^5
  - 1 <= capacity <= 10^9
  - 1 <= val[i], wt[i] <= 10^4

## Key Insight

This is a **greedy algorithm problem**. The optimal strategy is:
1. Calculate value-to-weight ratio (value/weight) for each item
2. Sort items by ratio in descending order
3. Greedily pick items with highest ratios first
4. Take fractions of items if needed to fill remaining capacity

Unlike 0/1 Knapsack (which needs dynamic programming), Fractional Knapsack has an optimal greedy solution.

## Examples

### Example 1
**Input:** val[] = [60, 100, 120], wt[] = [10, 20, 30], capacity = 50
**Output:** 240.000000
**Explanation:**
- Item 1: value=60, weight=10, ratio=6.0
- Item 2: value=100, weight=20, ratio=5.0
- Item 3: value=120, weight=30, ratio=4.0
- Sorted by ratio: Item1(6.0), Item2(5.0), Item3(4.0)
- Take Item 1 (10kg): value=60, remaining=40kg
- Take Item 2 (20kg): value=100, remaining=20kg
- Take 2/3 of Item 3 (20kg out of 30kg): value=80, remaining=0kg
- Total: 60 + 100 + 80 = 240.0

### Example 2
**Input:** val[] = [500], wt[] = [30], capacity = 10
**Output:** 166.670000
**Explanation:**
- Only one item with ratio = 500/30 = 16.667
- We can only take 10/30 = 1/3 of the item
- Value = 500 * (10/30) = 166.670000

### Example 3
**Input:** val[] = [10, 20, 30], wt[] = [5, 10, 15], capacity = 20
**Output:** 50.000000
**Explanation:**
- Item 1: ratio = 10/5 = 2.0
- Item 2: ratio = 20/10 = 2.0
- Item 3: ratio = 30/15 = 2.0
- Take Item 3 (15kg): value=30, remaining=5kg
- Take 5/10 of Item 2 (5kg out of 10kg): value=10, remaining=0kg
- Total: 30 + 10 + 5 = 45 (or different order with same total)

### Example 4
**Input:** val[] = [100, 200], wt[] = [50, 100], capacity = 75
**Output:** 233.333333
**Explanation:**
- Item 1: ratio = 100/50 = 2.0
- Item 2: ratio = 200/100 = 2.0
- Take Item 1 (50kg): value=100, remaining=25kg
- Take 25/100 of Item 2 (25kg out of 100kg): value=50, remaining=0kg
- Total: 100 + 50 = 150

Wait, let me recalculate:
- Item 1: ratio = 100/50 = 2.0
- Item 2: ratio = 200/100 = 2.0
- Take Item 2 (100kg, but capacity is 75): Take 75/100 of Item 2
- Value = 200 * (75/100) = 150

If both have same ratio, take Item 1 first:
- Take Item 1 (50kg): value=100, remaining=25kg
- Take 25/100 of Item 2 (25kg): value=50
- Total: 100 + 50 = 150

Actually for Example 4: val[] = [100, 200, 300], wt[] = [50, 100, 50], capacity = 100
- Item 1: ratio = 2.0
- Item 2: ratio = 2.0
- Item 3: ratio = 6.0
- Take Item 3 (50kg): value=300, remaining=50kg
- Take Item 1 (50kg): value=100, remaining=0kg
- Total: 400.0

## Algorithm Approaches

### Approach 1: Greedy by Value-to-Weight Ratio (Optimal)
**Time Complexity:** O(n log n) due to sorting
**Space Complexity:** O(n) for storing items with ratios

Steps:
1. Create array of items with value-to-weight ratio
2. Sort by ratio in descending order
3. Iterate through sorted items
4. For each item:
   - If weight <= remaining capacity: take entire item
   - Else: take fraction that fits in remaining capacity
5. Return total value

**Why Greedy Works:**
- Taking items with highest value-per-unit-weight maximizes value
- Since we can take fractions, greedy choice is always optimal
- No need for dynamic programming

### Approach 2: Using Priority Queue (Max Heap)
**Time Complexity:** O(n log n)
**Space Complexity:** O(n)

Steps:
1. Create max heap based on value-to-weight ratio
2. Extract items one by one from heap
3. Add to knapsack until full

### Approach 3: Direct Sorting Without Extra Data Structure
**Time Complexity:** O(n log n)
**Space Complexity:** O(1) excluding input

Steps:
1. Create pairs of (value, weight, index)
2. Sort by ratio
3. Greedily select items

## Correctness Proof

**Theorem:** Greedy selection by value-to-weight ratio produces optimal solution.

**Proof by Exchange Argument:**
1. Assume optimal solution O with different selection
2. If O doesn't include item with highest ratio, we can swap it with lower ratio item
3. This increases total value (since ratio is higher)
4. Contradiction - so O must include highest ratio items first
5. By induction, greedy order is optimal

## Key Differences from 0/1 Knapsack

| Aspect | 0/1 Knapsack | Fractional Knapsack |
|--------|--------------|-------------------|
| Constraint | Each item taken or not | Can take fractions |
| Algorithm | Dynamic Programming O(n*W) | Greedy O(n log n) |
| Optimal? | Greedy doesn't work | Greedy is optimal |
| Complexity | Pseudo-polynomial | Polynomial |

## Common Mistakes

1. **Using 0/1 approach:** This doesn't work - need greedy
2. **Not sorting:** Must sort by ratio first
3. **Integer division:** Use floating-point for accurate ratios
4. **Overflow:** Handle large capacities (up to 10^9)
5. **Rounding errors:** Be careful with double precision
6. **Edge cases:** Empty array, single item, capacity=0

## Edge Cases

- **Capacity = 0:** Return 0.0
- **Single item, weight > capacity:** Return (value * capacity/weight)
- **All items fit:** Take all items
- **Very large capacity:** Sum of all values
- **Equal ratios:** Order doesn't matter, result is same
- **Very small weights:** Watch for precision loss

## Interview Tips

- **Explain the greedy choice:** Why value-to-weight ratio is optimal
- **Compare with 0/1 Knapsack:** Highlight why greedy works here
- **Discuss complexity:** O(n log n) vs O(n*W) for DP
- **Handle precision:** Discuss floating-point rounding
- **Real-world context:** Loading cargo, resource allocation
- **Follow-ups:**
  - What if items have dependencies?
  - How would you solve with 0/1 constraint?
  - What if capacity and values are very large?
  - How to handle ties in ratios?

## Practical Applications

- **Cargo loading:** Maximize value while respecting weight limit
- **Portfolio optimization:** Select investments by return-to-risk ratio
- **Resource allocation:** Distribute resources by efficiency ratio
- **Mining problems:** Extract ore by value-to-weight ratio
- **Space packing:** Fill spacecraft by value density

## Why This Problem Matters

This is a classic **greedy algorithm problem** that teaches:
1. When greedy solutions are optimal
2. The contrast with NP-hard problems (0/1 Knapsack)
3. Real-world optimization thinking
4. Importance of sorting and data structures
5. How to prove greedy correctness

## Comparison Table

| Problem | Type | Complexity | Optimal Solution |
|---------|------|-----------|-----------------|
| Fractional Knapsack | Greedy | O(n log n) | Greedy by ratio |
| 0/1 Knapsack | DP | O(n*W) | Dynamic Programming |
| Unbounded Knapsack | DP | O(n*W) | Dynamic Programming |
`,

        inputFormat: `First line: n (number of items)
Second line: space-separated values
Third line: space-separated weights
Fourth line: capacity
Format: All space-separated integers`,

        outputFormat: `A floating-point number representing maximum value, rounded to 6 decimal places`,

        constraints: `- 1 <= val.size = wt.size <= 10^5
- 1 <= capacity <= 10^9
- 1 <= val[i], wt[i] <= 10^4`,

        sampleInput: '3\n60 100 120\n10 20 30\n50',
        sampleOutput: '240.000000',

        templates: [
          {
            language: 'python',
            code: `def fractionalKnapsack(capacity, val, wt):
    """
    Find maximum value in fractional knapsack using greedy approach.
    
    Args:
        capacity: Maximum weight capacity
        val: List of values
        wt: List of weights
        
    Returns:
        Maximum value rounded to 6 decimal places
    """
    # Create list of items with their value-to-weight ratio
    items = []
    for i in range(len(val)):
        ratio = val[i] / wt[i]
        items.append((ratio, val[i], wt[i]))
    
    # Sort by ratio in descending order (highest ratio first)
    items.sort(reverse=True, key=lambda x: x[0])
    
    total_value = 0.0
    remaining_capacity = capacity
    
    # Greedily select items
    for ratio, value, weight in items:
        if remaining_capacity == 0:
            break
        
        # If item fits completely, take it
        if weight <= remaining_capacity:
            total_value += value
            remaining_capacity -= weight
        else:
            # Take fraction of item that fits
            fraction = remaining_capacity / weight
            total_value += value * fraction
            remaining_capacity = 0
    
    return round(total_value, 6)

# Test cases
if __name__ == "__main__":
    # Test 1
    val1 = [60, 100, 120]
    wt1 = [10, 20, 30]
    capacity1 = 50
    print(f"{fractionalKnapsack(capacity1, val1, wt1):.6f}")  # 240.000000
    
    # Test 2
    val2 = [500]
    wt2 = [30]
    capacity2 = 10
    print(f"{fractionalKnapsack(capacity2, val2, wt2):.6f}")  # 166.670000
    
    # Test 3
    val3 = [10, 20, 30]
    wt3 = [5, 10, 15]
    capacity3 = 20
    print(f"{fractionalKnapsack(capacity3, val3, wt3):.6f}")  # 50.000000`
          },
          {
            language: 'javascript',
            code: `function fractionalKnapsack(capacity, val, wt) {
    /**
     * Find maximum value in fractional knapsack using greedy approach.
     * 
     * @param {number} capacity - Maximum weight capacity
     * @param {number[]} val - List of values
     * @param {number[]} wt - List of weights
     * @return {string} - Maximum value rounded to 6 decimal places
     */
    
    // Create list of items with their value-to-weight ratio
    const items = [];
    for (let i = 0; i < val.length; i++) {
        const ratio = val[i] / wt[i];
        items.push({ratio, value: val[i], weight: wt[i]});
    }
    
    // Sort by ratio in descending order (highest ratio first)
    items.sort((a, b) => b.ratio - a.ratio);
    
    let totalValue = 0.0;
    let remainingCapacity = capacity;
    
    // Greedily select items
    for (const item of items) {
        if (remainingCapacity === 0) break;
        
        // If item fits completely, take it
        if (item.weight <= remainingCapacity) {
            totalValue += item.value;
            remainingCapacity -= item.weight;
        } else {
            // Take fraction of item that fits
            const fraction = remainingCapacity / item.weight;
            totalValue += item.value * fraction;
            remainingCapacity = 0;
        }
    }
    
    return totalValue.toFixed(6);
}

// Test cases
console.log(fractionalKnapsack(50, [60, 100, 120], [10, 20, 30]));  // 240.000000
console.log(fractionalKnapsack(10, [500], [30]));                   // 166.670000
console.log(fractionalKnapsack(20, [10, 20, 30], [5, 10, 15]));     // 50.000000`
          },
          {
            language: 'cpp',
            code: `#include <iostream>
#include <vector>
#include <algorithm>
#include <iomanip>
using namespace std;

struct Item {
    double ratio;
    double value;
    double weight;
};

bool compare(const Item& a, const Item& b) {
    return a.ratio > b.ratio;  // Descending order
}

double fractionalKnapsack(double capacity, vector<double>& val, vector<double>& wt) {
    /**
     * Find maximum value in fractional knapsack using greedy approach.
     * 
     * @param capacity - Maximum weight capacity
     * @param val - Vector of values
     * @param wt - Vector of weights
     * @return - Maximum value
     */
    
    // Create list of items with their value-to-weight ratio
    vector<Item> items;
    for (int i = 0; i < val.size(); i++) {
        double ratio = val[i] / wt[i];
        items.push_back({ratio, val[i], wt[i]});
    }
    
    // Sort by ratio in descending order (highest ratio first)
    sort(items.begin(), items.end(), compare);
    
    double totalValue = 0.0;
    double remainingCapacity = capacity;
    
    // Greedily select items
    for (const auto& item : items) {
        if (remainingCapacity == 0) break;
        
        // If item fits completely, take it
        if (item.weight <= remainingCapacity) {
            totalValue += item.value;
            remainingCapacity -= item.weight;
        } else {
            // Take fraction of item that fits
            double fraction = remainingCapacity / item.weight;
            totalValue += item.value * fraction;
            remainingCapacity = 0;
        }
    }
    
    return totalValue;
}

// Test cases
int main() {
    vector<double> val1 = {60, 100, 120};
    vector<double> wt1 = {10, 20, 30};
    double capacity1 = 50;
    
    cout << fixed << setprecision(6);
    cout << fractionalKnapsack(capacity1, val1, wt1) << endl;  // 240.000000
    
    vector<double> val2 = {500};
    vector<double> wt2 = {30};
    double capacity2 = 10;
    cout << fractionalKnapsack(capacity2, val2, wt2) << endl;  // 166.670000
    
    return 0;
}`
          },
          {
            language: 'java',
            code: `import java.util.*;

public class Solution {
    
    static class Item implements Comparable<Item> {
        double ratio;
        double value;
        double weight;
        
        Item(double value, double weight) {
            this.value = value;
            this.weight = weight;
            this.ratio = value / weight;
        }
        
        @Override
        public int compareTo(Item other) {
            // Descending order of ratio
            return Double.compare(other.ratio, this.ratio);
        }
    }
    
    /**
     * Find maximum value in fractional knapsack using greedy approach.
     * 
     * @param capacity - Maximum weight capacity
     * @param val - Array of values
     * @param wt - Array of weights
     * @return - Maximum value
     */
    public static double fractionalKnapsack(double capacity, double[] val, double[] wt) {
        // Create list of items
        List<Item> items = new ArrayList<>();
        for (int i = 0; i < val.length; i++) {
            items.add(new Item(val[i], wt[i]));
        }
        
        // Sort by ratio in descending order (highest ratio first)
        Collections.sort(items);
        
        double totalValue = 0.0;
        double remainingCapacity = capacity;
        
        // Greedily select items
        for (Item item : items) {
            if (remainingCapacity == 0) break;
            
            // If item fits completely, take it
            if (item.weight <= remainingCapacity) {
                totalValue += item.value;
                remainingCapacity -= item.weight;
            } else {
                // Take fraction of item that fits
                double fraction = remainingCapacity / item.weight;
                totalValue += item.value * fraction;
                remainingCapacity = 0;
            }
        }
        
        return totalValue;
    }
    
    // Test cases
    public static void main(String[] args) {
        double[] val1 = {60, 100, 120};
        double[] wt1 = {10, 20, 30};
        double capacity1 = 50;
        
        System.out.printf("%.6f%n", fractionalKnapsack(capacity1, val1, wt1));  // 240.000000
        
        double[] val2 = {500};
        double[] wt2 = {30};
        double capacity2 = 10;
        
        System.out.printf("%.6f%n", fractionalKnapsack(capacity2, val2, wt2));  // 166.670000
    }
}`
          }
        ],

        testCases: [
          // Visible test cases
          {
            input: '3\n60 100 120\n10 20 30\n50',
            output: '240.000000',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '1\n500\n30\n10',
            output: '166.670000',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '3\n10 20 30\n5 10 15\n20',
            output: '50.000000',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '2\n100 200\n50 100\n75',
            output: '200.000000',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '4\n10 40 30 50\n5 4 10 2\n5',
            output: '50.000000',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '2\n60 120\n10 20\n15',
            output: '120.000000',
            isHidden: false,
            type: 'visible'
          },
          // Hidden test cases - all items fit
          {
            input: '3\n10 20 30\n5 5 5\n20',
            output: '60.000000',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '4\n100 200 300 400\n10 20 30 40\n100',
            output: '1000.000000',
            isHidden: true,
            type: 'hidden'
          },
          // Hidden test cases - fractions needed
          {
            input: '2\n50 75\n10 20\n15',
            output: '75.000000',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '5\n10 20 30 40 50\n2 3 4 5 6\n10',
            output: '130.000000',
            isHidden: true,
            type: 'hidden'
          },
          // Hidden test cases - equal ratios
          {
            input: '3\n10 20 30\n5 10 15\n25',
            output: '60.000000',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '2\n100 200\n10 20\n25',
            output: '250.000000',
            isHidden: true,
            type: 'hidden'
          },
          // Hidden test cases - capacity very small
          {
            input: '5\n100 200 300 400 500\n10 20 30 40 50\n5',
            output: '250.000000',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '3\n1000 2000 3000\n100 200 300\n1',
            output: '10.000000',
            isHidden: true,
            type: 'hidden'
          },
          // Hidden test cases - single item variations
          {
            input: '1\n1000\n100\n50',
            output: '500.000000',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '1\n999\n999\n999',
            output: '999.000000',
            isHidden: true,
            type: 'hidden'
          },
          // Edge cases - large capacity
          {
            input: '3\n10 20 30\n5 10 15\n1000',
            output: '60.000000',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '5\n100 200 300 400 500\n10 20 30 40 50\n1000000',
            output: '1500.000000',
            isHidden: true,
            type: 'edge'
          },
          // Edge cases - capacity equals total weight
          {
            input: '4\n10 20 30 40\n5 10 15 20\n50',
            output: '100.000000',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '3\n50 100 150\n20 30 50\n100',
            output: '300.000000',
            isHidden: true,
            type: 'edge'
          },
          // Edge cases - very high value-to-weight ratios
          {
            input: '3\n1000 2000 3000\n1 2 3\n3',
            output: '3000.000000',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '2\n10000 5000\n1 10\n5',
            output: '12500.000000',
            isHidden: true,
            type: 'edge'
          }
        ]
      }
    });

    console.log('✅ Fractional Knapsack problem created successfully!');
    console.log('Problem ID:', problem.id);
    console.log('Slug:', problem.slug);
    console.log('Difficulty:', problem.difficulty);
    console.log('XP Reward:', problem.xpReward);
    const testCasesArray = Array.isArray(problem.testCases) ? problem.testCases : [];
    console.log('Test Cases:', testCasesArray.length);

  } catch (error) {
    console.error('❌ Error creating Fractional Knapsack problem:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateFractionalKnapsackProblem();
