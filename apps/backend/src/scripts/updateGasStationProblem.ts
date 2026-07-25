import { prisma } from '../config/prisma';

async function updateGasStationProblem() {
  try {
    // Delete any existing problem with this slug to avoid duplicates
    await prisma.question.deleteMany({
      where: { slug: 'gas-station' }
    });

    const problem = await prisma.question.create({
      data: {
        title: 'Gas Station',
        slug: 'gas-station',
        difficulty: 'MEDIUM',
        topics: ['arrays', 'greedy', 'simulation', 'circular-array'],
        companies: ['Amazon', 'Microsoft', 'Google', 'Facebook', 'Uber', 'Lyft'],
        xpReward: 8,
        timeLimit: 2,
        memoryLimit: 256,
        
        statement: `# Gas Station

## Problem Statement

There are n gas stations along a **circular route**, where the amount of gas at the ith station is \`gas[i]\`.

You have a car with an **unlimited gas tank** and it costs \`cost[i]\` of gas to travel from the ith station to its next (i + 1)th station. You begin the journey with an **empty tank** at one of the gas stations.

Given two integer arrays \`gas\` and \`cost\`, return the **starting gas station's index** if you can travel around the circuit **once in the clockwise direction**, otherwise return **-1**.

If there exists a solution, it is guaranteed to be unique.

## Problem Details

- Input: Two arrays of gas amounts and costs
- Output: Starting station index or -1 if impossible
- Constraint: Circular route (returns to starting point)
- Goal: Find valid starting position to complete full circuit

## Key Insights

1. **Net Fuel:** Calculate net fuel at each station (gas[i] - cost[i])
2. **Cumulative Sum:** Track running total fuel during journey
3. **Greedy Selection:** If we can't complete from position i, skip all positions from i to j
4. **Single Pass:** Optimal solution achievable in O(n) with one iteration

## Examples

### Example 1: Valid Starting Point
**Input:** 
\`\`\`
gas = [1, 2, 3, 4, 5]
cost = [3, 4, 5, 1, 2]
\`\`\`
**Output:** \`3\`

**Explanation:**
- Station 0: gain 1, cost 3 = -2 net
- Station 1: gain 2, cost 4 = -2 net
- Station 2: gain 3, cost 5 = -2 net
- Station 3: gain 4, cost 1 = +3 net
- Station 4: gain 5, cost 2 = +3 net

Starting at station 3:
- Tank at 3: 0 + 4 = 4
- Travel to 4: 4 - 1 + 5 = 8
- Travel to 0: 8 - 2 + 1 = 7
- Travel to 1: 7 - 3 + 2 = 6
- Travel to 2: 6 - 4 + 3 = 5
- Travel to 3: 5 - 5 = 0 (completes!)

Result: Return 3

### Example 2: No Valid Starting Point
**Input:**
\`\`\`
gas = [2, 3, 4]
cost = [3, 4, 3]
\`\`\`
**Output:** \`-1\`

**Explanation:**
- Total gas: 2 + 3 + 4 = 9
- Total cost: 3 + 4 + 3 = 10
- Since total gas < total cost, impossible to complete circuit
- Cannot start from any station

Result: Return -1

### Example 3: Single Station
**Input:**
\`\`\`
gas = [5]
cost = [4]
\`\`\`
**Output:** \`0\`

**Explanation:**
- Single station with enough gas (5 > 4)
- Can return to starting point
- Result: Return 0

### Example 4: Complex Journey
**Input:**
\`\`\`
gas = [3, 3, 4]
cost = [3, 4, 4]
\`\`\`
**Output:** \`-1\`

**Explanation:**
- Total gas: 10, Total cost: 11
- Impossible to complete

Result: Return -1

### Example 5: Perfect Balance
**Input:**
\`\`\`
gas = [1, 1, 1]
cost = [1, 1, 1]
\`\`\`
**Output:** \`0\` (or 1 or 2, all valid)

**Explanation:**
- Each station: 1 unit gain, 1 unit cost
- Net zero at each position
- Can start from any station
- Result: Return 0

## Algorithm Approaches

### Approach 1: Greedy One-Pass (Optimal)
**Time Complexity:** O(n)
**Space Complexity:** O(1)

Steps:
1. Check if total gas >= total cost (if not, return -1)
2. Iterate through stations tracking current tank
3. If tank goes negative at station j, start must be after j
4. Return index when you complete the circuit

**Why it works:**
- If we reach station j with negative tank from start i, then stations i to j-1 cannot be valid starts
- The only candidate is station j (or later)
- If total gas >= cost, a valid start exists

### Approach 2: Simulation with Retry
**Time Complexity:** O(n²) worst case
**Space Complexity:** O(1)

Steps:
1. Try each station as starting point
2. Simulate full circuit from that point
3. If tank never goes negative, return index
4. If all fail, return -1

**Disadvantage:** Slower for large inputs but easier to understand

### Approach 3: Dynamic Programming
**Time Complexity:** O(n)
**Space Complexity:** O(n)

Steps:
1. Precompute prefix sums
2. For each potential start, verify using prefix sums
3. Return first valid start or -1

**Trade-off:** Uses extra space for faster verification

## Correctness Proof

**Theorem:** Greedy approach finds the starting station or correctly returns -1.

**Proof:**
1. **Necessity:** If total gas < total cost, no solution exists (must check)
2. **Sufficiency:** If total gas >= total cost, exactly one solution exists
3. **Greedy Jump:** If we fail at station j starting from i, stations i...j cannot work
   - Proof: If i fails at j, then gas[i] < cost[i]
   - For any k between i and j: total at k <= total at j
   - Therefore k also fails at j or earlier
4. **Conclusion:** Skipping to j+1 and iterating guarantees finding valid start

## Common Mistakes

1. **Ignoring circular nature:** Forgetting it's a circle (returns to start)
2. **Tank goes negative:** Not checking if tank ever dips below 0
3. **Cumulative loss:** Not recognizing when all prior stations are invalid
4. **Off-by-one:** Boundary conditions for circular array
5. **Early termination:** Returning before checking entire circuit
6. **Integer overflow:** For large gas/cost values

## Edge Cases

- **n = 1:** Single station must have gas >= cost
- **All zeros:** All gas[i] = 0 and cost[i] = 0, return 0
- **Impossible:** Total gas < total cost
- **Perfect match:** gas[i] = cost[i] for all i
- **Large values:** gas[i], cost[i] up to 10^4, n up to 10^5
- **One station valid:** Only one starting position works
- **All but one invalid:** Most positions lead to negative tank

## Interview Tips

- **Clarify input:** Verify circular nature and constraints
- **Brute force first:** Start with O(n²) simulation
- **Optimize insight:** Why can we skip entire segments?
- **Proof:** Explain why greedy guarantees correctness
- **Edge cases:** Discuss handling single station and boundary
- **Follow-ups:**
  - What if we want to return at any point, not complete circle?
  - How to handle partial solutions?
  - Can we optimize space to O(1) strictly?

## Real-World Applications

- **Route planning:** Fuel efficiency optimization
- **Delivery networks:** Minimizing fuel stops
- **Circular bus routes:** Optimal starting points
- **Ride-sharing:** Trip planning with fuel constraints
- **Logistics:** Vehicle routing with fuel constraints

## Why This Problem Matters

This problem teaches:
1. **Greedy algorithms:** Local optimization leads to global solution
2. **Circular arrays:** Handling wrap-around logic
3. **Mathematical insight:** Total sum determines solvability
4. **Efficiency:** O(n) vs O(n²) trade-offs
5. **Problem analysis:** Recognizing why certain approaches work

## Complexity Analysis

| Aspect | Value | Notes |
|--------|-------|-------|
| Time | O(n) | Single pass, no nested loops |
| Space | O(1) | Only tracking current tank |
| Tank Check | O(1) | No array growth |
| Circular Logic | O(1) | Modulo arithmetic avoided |
| Optimal | Yes | Best possible for this problem |

## Key Learning Points

- Calculate net gain/loss at each station
- Track cumulative fuel during simulation
- Skip invalid starting segments entirely
- Verify total gas >= total cost first
- Handle circular array wrap-around efficiently
`,

        inputFormat: `n (number of stations)
gas array: space-separated integers for gas at each station
cost array: space-separated integers for cost from each station`,

        outputFormat: `Starting station index (0-indexed) or -1 if impossible to complete circuit`,

        constraints: `- n == gas.length == cost.length
- 1 <= n <= 10^5
- 0 <= gas[i], cost[i] <= 10^4
- Answer is guaranteed to be unique if it exists`,

        sampleInput: '5\n1 2 3 4 5\n3 4 5 1 2',
        sampleOutput: '3',

        templates: [
          {
            language: 'python',
            code: `def canCompleteCircuit(gas, cost):
    """
    Find starting gas station to complete circular journey.
    
    Args:
        gas: List of gas amounts at each station
        cost: List of costs to travel from each station
        
    Returns:
        Starting station index or -1 if impossible
    """
    # Check if total gas is enough
    if sum(gas) < sum(cost):
        return -1
    
    tank = 0
    start = 0
    
    # Greedy single pass
    for i in range(len(gas)):
        tank += gas[i] - cost[i]
        
        # If tank goes negative, can't start from any station up to i
        if tank < 0:
            tank = 0
            start = i + 1
    
    return start

# Test cases
if __name__ == "__main__":
    # Example 1: Valid starting point
    gas1 = [1, 2, 3, 4, 5]
    cost1 = [3, 4, 5, 1, 2]
    print(canCompleteCircuit(gas1, cost1))  # Output: 3
    
    # Example 2: No valid starting point
    gas2 = [2, 3, 4]
    cost2 = [3, 4, 3]
    print(canCompleteCircuit(gas2, cost2))  # Output: -1
    
    # Example 3: Single station
    gas3 = [5]
    cost3 = [4]
    print(canCompleteCircuit(gas3, cost3))  # Output: 0
    
    # Example 4: Perfect balance
    gas4 = [1, 1, 1]
    cost4 = [1, 1, 1]
    print(canCompleteCircuit(gas4, cost4))  # Output: 0`
          },
          {
            language: 'javascript',
            code: `function canCompleteCircuit(gas, cost) {
    /**
     * Find starting gas station to complete circular journey.
     * 
     * @param {number[]} gas - Gas amounts at each station
     * @param {number[]} cost - Costs to travel from each station
     * @return {number} - Starting station index or -1
     */
    
    // Check if total gas is enough
    const totalGas = gas.reduce((a, b) => a + b, 0);
    const totalCost = cost.reduce((a, b) => a + b, 0);
    
    if (totalGas < totalCost) {
        return -1;
    }
    
    let tank = 0;
    let start = 0;
    
    // Greedy single pass
    for (let i = 0; i < gas.length; i++) {
        tank += gas[i] - cost[i];
        
        // If tank goes negative, can't start from any station up to i
        if (tank < 0) {
            tank = 0;
            start = i + 1;
        }
    }
    
    return start;
}

// Test cases
console.log(canCompleteCircuit([1, 2, 3, 4, 5], [3, 4, 5, 1, 2]));  // Output: 3
console.log(canCompleteCircuit([2, 3, 4], [3, 4, 3]));  // Output: -1
console.log(canCompleteCircuit([5], [4]));  // Output: 0
console.log(canCompleteCircuit([1, 1, 1], [1, 1, 1]));  // Output: 0`
          },
          {
            language: 'cpp',
            code: `#include <iostream>
#include <vector>
#include <numeric>
using namespace std;

int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {
    /**
     * Find starting gas station to complete circular journey.
     * 
     * @param gas - Gas amounts at each station
     * @param cost - Costs to travel from each station
     * @return - Starting station index or -1
     */
    
    // Check if total gas is enough
    long long totalGas = accumulate(gas.begin(), gas.end(), 0LL);
    long long totalCost = accumulate(cost.begin(), cost.end(), 0LL);
    
    if (totalGas < totalCost) {
        return -1;
    }
    
    long long tank = 0;
    int start = 0;
    
    // Greedy single pass
    for (int i = 0; i < (int)gas.size(); i++) {
        tank += gas[i] - cost[i];
        
        // If tank goes negative, can't start from any station up to i
        if (tank < 0) {
            tank = 0;
            start = i + 1;
        }
    }
    
    return start;
}

// Test cases
int main() {
    vector<int> gas1 = {1, 2, 3, 4, 5};
    vector<int> cost1 = {3, 4, 5, 1, 2};
    cout << canCompleteCircuit(gas1, cost1) << endl;  // Output: 3
    
    vector<int> gas2 = {2, 3, 4};
    vector<int> cost2 = {3, 4, 3};
    cout << canCompleteCircuit(gas2, cost2) << endl;  // Output: -1
    
    vector<int> gas3 = {5};
    vector<int> cost3 = {4};
    cout << canCompleteCircuit(gas3, cost3) << endl;  // Output: 0
    
    vector<int> gas4 = {1, 1, 1};
    vector<int> cost4 = {1, 1, 1};
    cout << canCompleteCircuit(gas4, cost4) << endl;  // Output: 0
    
    return 0;
}`
          },
          {
            language: 'java',
            code: `import java.util.*;

public class Solution {
    /**
     * Find starting gas station to complete circular journey.
     * 
     * @param gas - Gas amounts at each station
     * @param cost - Costs to travel from each station
     * @return - Starting station index or -1
     */
    public int canCompleteCircuit(int[] gas, int[] cost) {
        // Check if total gas is enough
        long totalGas = 0;
        long totalCost = 0;
        
        for (int i = 0; i < gas.length; i++) {
            totalGas += gas[i];
            totalCost += cost[i];
        }
        
        if (totalGas < totalCost) {
            return -1;
        }
        
        long tank = 0;
        int start = 0;
        
        // Greedy single pass
        for (int i = 0; i < gas.length; i++) {
            tank += gas[i] - cost[i];
            
            // If tank goes negative, can't start from any station up to i
            if (tank < 0) {
                tank = 0;
                start = i + 1;
            }
        }
        
        return start;
    }
    
    // Test cases
    public static void main(String[] args) {
        Solution sol = new Solution();
        
        System.out.println(sol.canCompleteCircuit(
            new int[]{1, 2, 3, 4, 5}, 
            new int[]{3, 4, 5, 1, 2}
        ));  // Output: 3
        
        System.out.println(sol.canCompleteCircuit(
            new int[]{2, 3, 4}, 
            new int[]{3, 4, 3}
        ));  // Output: -1
        
        System.out.println(sol.canCompleteCircuit(
            new int[]{5}, 
            new int[]{4}
        ));  // Output: 0
        
        System.out.println(sol.canCompleteCircuit(
            new int[]{1, 1, 1}, 
            new int[]{1, 1, 1}
        ));  // Output: 0
    }
}`
          }
        ],

        testCases: [
          // Visible test cases
          {
            input: '5\n1 2 3 4 5\n3 4 5 1 2',
            output: '3',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '3\n2 3 4\n3 4 3',
            output: '-1',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '1\n5\n4',
            output: '0',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '3\n1 1 1\n1 1 1',
            output: '0',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '4\n1 2 3 4\n2 3 4 1',
            output: '0',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '2\n4 5\n3 4',
            output: '0',
            isHidden: false,
            type: 'visible'
          },
          // Hidden test cases
          {
            input: '4\n5 1 2 3\n4 4 1 5',
            output: '0',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '3\n3 4 5\n5 4 3',
            output: '-1',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '5\n1 2 3 4 5\n5 4 3 2 1',
            output: '0',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '6\n6 1 1 1 1 1\n1 1 1 1 1 6',
            output: '-1',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '4\n1 2 3 4\n4 3 2 1',
            output: '3',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '5\n3 3 4 1 5\n3 2 3 2 4',
            output: '2',
            isHidden: true,
            type: 'hidden'
          },
          // Edge cases
          {
            input: '1\n1\n1',
            output: '0',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '1\n0\n1',
            output: '-1',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '3\n3 3 3\n3 3 3',
            output: '0',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '5\n1 1 1 1 1\n1 1 1 1 1',
            output: '0',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '4\n4 4 4 4\n3 3 3 3',
            output: '0',
            isHidden: true,
            type: 'edge'
          }
        ]
      }
    });

    console.log('✅ Gas Station problem created successfully!');
    console.log('Problem ID:', problem.id);
    console.log('Slug:', problem.slug);
    console.log('Difficulty:', problem.difficulty);
    console.log('XP Reward:', problem.xpReward);
    const testCasesArray = Array.isArray(problem.testCases) ? problem.testCases : [];
    console.log('Test Cases:', testCasesArray.length);

  } catch (error) {
    console.error('❌ Error creating Gas Station problem:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateGasStationProblem();
