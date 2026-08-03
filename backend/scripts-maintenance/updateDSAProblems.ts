import { prisma } from '../config/prisma';

// Jump Game data
const jumpGameData = {
  title: 'Jump Game',
  slug: 'jump-game',
  difficulty: 'MEDIUM',
  topics: ['arrays', 'greedy', 'dynamic-programming', 'reachability'],
  companies: ['Amazon', 'Google', 'Facebook', 'Microsoft', 'Apple', 'Adobe'],
  xpReward: 8,
  timeLimit: 2,
  memoryLimit: 256,
  statement: `# Jump Game

## Problem Statement

You are given an **integer array nums**. You are **initially positioned at the array's first index**, and each element in the array represents your **maximum jump length at that position**.

Return **true if you can reach the last index**, or **false otherwise**.

## Problem Details

- Input: Array of non-negative integers (jump lengths)
- Output: Boolean (true if reachable, false otherwise)
- Goal: Determine if last index is reachable from first index
- Constraint: Can only jump forward, and only within max jump range

## Key Insights

1. **Greedy Approach:** Track maximum reachable index as we iterate
2. **Reachability:** If current index > max reachable, cannot proceed
3. **Optimization:** Greedy is O(n), DP is O(n), Brute Force is O(2^n)
4. **Tracking:** Keep pointer to farthest position we can reach`,
  inputFormat: `n (array length)
nums: space-separated array of integers representing max jump lengths`,
  outputFormat: `true if last index is reachable, false otherwise`,
  constraints: `- 1 <= nums.length <= 10^4
- 0 <= nums[i] <= 10^5
- All values are non-negative integers`,
  sampleInput: '5\n2 3 1 1 4',
  sampleOutput: 'true',
};

// Jump Game II data
const jumpGameIIData = {
  title: 'Jump Game II',
  slug: 'jump-game-ii',
  difficulty: 'MEDIUM',
  topics: ['arrays', 'greedy', 'dynamic-programming', 'bfs'],
  companies: ['Amazon', 'Google', 'Facebook', 'Microsoft', 'Apple', 'Bloomberg'],
  xpReward: 8,
  timeLimit: 2,
  memoryLimit: 256,
  statement: `# Jump Game II

## Problem Statement

You are given a **0-indexed array of integers nums of length n**. You are **initially positioned at index 0**.

Each element \`nums[i]\` represents the **maximum length of a forward jump from index i**. In other words, if you are at index i, you can jump to any index **(i + j)** where:
- \`0 <= j <= nums[i]\`
- \`i + j < n\`

**Return the minimum number of jumps** to reach index **n - 1**.

The test cases are generated such that you can reach index n - 1.

## Problem Details

- Input: Array of non-negative integers (max jump lengths)
- Output: Minimum number of jumps to reach last index
- Goal: Find optimal jumping strategy with fewest jumps
- Guarantee: Always reachable (greedy solution exists)

## Key Insights

1. **Greedy Window:** Track current jump's reach and next jump's reach
2. **Level-by-level:** Process jumps level by level (BFS-like)
3. **Farthest Reach:** Update farthest position reachable with current jumps
4. **Minimum Jumps:** Increment when need to jump again to proceed
5. **O(n) Solution:** Single pass without DP overhead`,
  inputFormat: `n (array length)
nums: space-separated array of integers representing max jump lengths`,
  outputFormat: `Minimum number of jumps to reach the last index`,
  constraints: `- 1 <= nums.length <= 10^4
- 0 <= nums[i] <= 10^3
- It's guaranteed you can reach nums[n - 1]`,
  sampleInput: '5\n2 3 1 1 4',
  sampleOutput: '2',
};

// Gas Station data
const gasStationData = {
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
4. **Single Pass:** Optimal solution achievable in O(n) with one iteration`,
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
};

// Minimize Cash Flow data
const minimizeCashFlowData = {
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
4. **Cycle Detection:** Identify and eliminate circular debts`,
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
};

// Jump Game templates
const jumpGameTemplates = [
  {
    language: 'python',
    code: `def canJump(nums):
    if len(nums) <= 1:
        return True
    max_reach = 0
    for i in range(len(nums)):
        if i > max_reach:
            return False
        max_reach = max(max_reach, i + nums[i])
        if max_reach >= len(nums) - 1:
            return True
    return False`
  },
  {
    language: 'javascript',
    code: `function canJump(nums) {
    if (nums.length <= 1) return true;
    let maxReach = 0;
    for (let i = 0; i < nums.length; i++) {
        if (i > maxReach) return false;
        maxReach = Math.max(maxReach, i + nums[i]);
        if (maxReach >= nums.length - 1) return true;
    }
    return false;
}`
  }
];

// Jump Game II templates
const jumpGameIITemplates = [
  {
    language: 'python',
    code: `def jump(nums):
    n = len(nums)
    if n <= 1:
        return 0
    jumps = 0
    current_end = 0
    farthest = 0
    for i in range(n - 1):
        farthest = max(farthest, i + nums[i])
        if i == current_end:
            jumps += 1
            current_end = farthest
            if current_end >= n - 1:
                break
    return jumps`
  },
  {
    language: 'javascript',
    code: `function jump(nums) {
    const n = nums.length;
    if (n <= 1) return 0;
    let jumps = 0, currentEnd = 0, farthest = 0;
    for (let i = 0; i < n - 1; i++) {
        farthest = Math.max(farthest, i + nums[i]);
        if (i === currentEnd) {
            jumps++;
            currentEnd = farthest;
            if (currentEnd >= n - 1) break;
        }
    }
    return jumps;
}`
  }
];

// Gas Station templates
const gasStationTemplates = [
  {
    language: 'python',
    code: `def canCompleteCircuit(gas, cost):
    if sum(gas) < sum(cost):
        return -1
    tank = 0
    start = 0
    for i in range(len(gas)):
        tank += gas[i] - cost[i]
        if tank < 0:
            tank = 0
            start = i + 1
    return start`
  },
  {
    language: 'javascript',
    code: `function canCompleteCircuit(gas, cost) {
    const totalGas = gas.reduce((a,b)=>a+b, 0);
    const totalCost = cost.reduce((a,b)=>a+b, 0);
    if (totalGas < totalCost) return -1;
    let tank = 0, start = 0;
    for (let i = 0; i < gas.length; i++) {
        tank += gas[i] - cost[i];
        if (tank < 0) {
            tank = 0;
            start = i + 1;
        }
    }
    return start;
}`
  }
];

// Minimize Cash Flow templates
const minimizeCashFlowTemplates = [
  {
    language: 'python',
    code: `def minimizeCashFlow(transaction):
    n = len(transaction)
    balance = [0] * n
    for i in range(n):
        for j in range(n):
            balance[i] -= transaction[i][j]
            balance[j] += transaction[i][j]
    result = [[0] * n for _ in range(n)]
    def settle(balances):
        debtor = creditor = -1
        for i in range(len(balances)):
            if balances[i] < 0 and (debtor == -1 or balances[i] < balances[debtor]):
                debtor = i
            if balances[i] > 0 and (creditor == -1 or balances[i] > balances[creditor]):
                creditor = i
        if debtor == -1 or creditor == -1:
            return
        amount = min(-balances[debtor], balances[creditor])
        result[debtor][creditor] += amount
        balances[debtor] += amount
        balances[creditor] -= amount
        settle(balances)
    settle(balance)
    return result`
  },
  {
    language: 'javascript',
    code: `function minimizeCashFlow(transaction) {
    const n = transaction.length;
    const balance = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            balance[i] -= transaction[i][j];
            balance[j] += transaction[i][j];
        }
    }
    const result = Array(n).fill(0).map(() => Array(n).fill(0));
    function settle(balances) {
        let debtor = -1, creditor = -1;
        for (let i = 0; i < balances.length; i++) {
            if (balances[i] < 0 && (debtor === -1 || balances[i] < balances[debtor]))
                debtor = i;
            if (balances[i] > 0 && (creditor === -1 || balances[i] > balances[creditor]))
                creditor = i;
        }
        if (debtor === -1 || creditor === -1) return;
        const amount = Math.min(-balances[debtor], balances[creditor]);
        result[debtor][creditor] += amount;
        balances[debtor] += amount;
        balances[creditor] -= amount;
        settle(balances);
    }
    settle(balance);
    return result;
}`
  }
];

// Jump Game test cases
const jumpGameTestCases = [
  { input: '5\n2 3 1 1 4', output: 'true', isHidden: false, type: 'visible' },
  { input: '5\n3 2 1 0 4', output: 'false', isHidden: false, type: 'visible' },
  { input: '1\n0', output: 'true', isHidden: false, type: 'visible' },
  { input: '3\n2 0 0', output: 'true', isHidden: false, type: 'visible' },
  { input: '4\n0 1 1 0', output: 'false', isHidden: false, type: 'visible' },
  { input: '6\n1 1 1 1 1 1', output: 'true', isHidden: false, type: 'visible' },
  { input: '2\n1 0', output: 'true', isHidden: true, type: 'hidden' },
  { input: '3\n2 3 1', output: 'true', isHidden: true, type: 'hidden' },
  { input: '4\n0 2 3 0', output: 'false', isHidden: true, type: 'hidden' },
  { input: '5\n2 0 0 0 4', output: 'false', isHidden: true, type: 'hidden' },
];

// Jump Game II test cases
const jumpGameIITestCases = [
  { input: '5\n2 3 1 1 4', output: '2', isHidden: false, type: 'visible' },
  { input: '5\n2 3 0 1 4', output: '2', isHidden: false, type: 'visible' },
  { input: '5\n1 1 1 1 1', output: '4', isHidden: false, type: 'visible' },
  { input: '5\n10 0 0 0 0', output: '1', isHidden: false, type: 'visible' },
  { input: '5\n1 2 3 4 5', output: '2', isHidden: false, type: 'visible' },
  { input: '1\n0', output: '0', isHidden: false, type: 'visible' },
  { input: '2\n1 1', output: '1', isHidden: true, type: 'hidden' },
  { input: '10\n1 1 1 0 1 1 1 1 1 1', output: '9', isHidden: true, type: 'hidden' },
  { input: '8\n2 1 3 2 4 1 2 0', output: '3', isHidden: true, type: 'hidden' },
  { input: '6\n3 2 1 0 4 0', output: '2', isHidden: true, type: 'hidden' },
];

// Gas Station test cases
const gasStationTestCases = [
  { input: '5\n1 2 3 4 5\n3 4 5 1 2', output: '3', isHidden: false, type: 'visible' },
  { input: '3\n2 3 4\n3 4 3', output: '-1', isHidden: false, type: 'visible' },
  { input: '1\n5\n4', output: '0', isHidden: false, type: 'visible' },
  { input: '3\n1 1 1\n1 1 1', output: '0', isHidden: false, type: 'visible' },
  { input: '4\n1 2 3 4\n2 3 4 1', output: '0', isHidden: false, type: 'visible' },
  { input: '2\n4 5\n3 4', output: '0', isHidden: false, type: 'visible' },
  { input: '4\n5 1 2 3\n4 4 1 5', output: '0', isHidden: true, type: 'hidden' },
  { input: '3\n3 4 5\n5 4 3', output: '-1', isHidden: true, type: 'hidden' },
  { input: '5\n1 2 3 4 5\n5 4 3 2 1', output: '0', isHidden: true, type: 'hidden' },
  { input: '6\n6 1 1 1 1 1\n1 1 1 1 1 6', output: '-1', isHidden: true, type: 'hidden' },
];

// Minimize Cash Flow test cases
const minimizeCashFlowTestCases = [
  { input: '3\n0 100 0\n0 0 100\n100 0 0', output: '0 0 0\n0 0 0\n0 0 0', isHidden: false, type: 'visible' },
  { input: '3\n0 100 0\n0 0 200\n0 0 0', output: '0 0 100\n0 0 100\n0 0 0', isHidden: false, type: 'visible' },
  { input: '3\n0 1000 0\n0 0 1000\n0 0 0', output: '0 0 1000\n0 0 0\n0 0 0', isHidden: false, type: 'visible' },
  { input: '2\n0 500\n500 0', output: '0 500\n0 0', isHidden: false, type: 'visible' },
  { input: '4\n0 100 0 50\n0 0 200 0\n0 0 0 100\n0 0 0 0', output: '0 0 50 50\n0 0 150 50\n0 0 0 100\n0 0 0 0', isHidden: false, type: 'visible' },
  { input: '1\n0', output: '0', isHidden: false, type: 'visible' },
  { input: '4\n0 200 100 0\n0 0 50 100\n0 0 0 200\n50 0 0 0', output: '0 100 0 100\n0 0 0 150\n0 0 0 200\n0 0 0 0', isHidden: true, type: 'hidden' },
  { input: '3\n0 50 50\n50 0 50\n50 50 0', output: '0 0 0\n0 0 0\n0 0 0', isHidden: true, type: 'hidden' },
  { input: '2\n0 1000\n0 0', output: '0 1000\n0 0', isHidden: true, type: 'hidden' },
  { input: '3\n0 200 300\n100 0 100\n0 0 0', output: '0 200 300\n0 0 100\n0 0 0', isHidden: true, type: 'hidden' },
];

// Main update function
async function updateDSAProblems() {
  try {
    console.log('🔄 Starting DSA problems update...\n');

    // Update Jump Game
    console.log('📝 Updating Jump Game...');
    const jumpGameUpdated = await prisma.question.update({
      where: { id: 'e484f9ef-cb3e-4aa2-8e4a-a2f463c8e9f4' },
      data: {
        title: jumpGameData.title,
        slug: jumpGameData.slug,
        difficulty: jumpGameData.difficulty,
        topics: jumpGameData.topics,
        companies: jumpGameData.companies,
        xpReward: jumpGameData.xpReward,
        timeLimit: jumpGameData.timeLimit,
        memoryLimit: jumpGameData.memoryLimit,
        statement: jumpGameData.statement,
        inputFormat: jumpGameData.inputFormat,
        outputFormat: jumpGameData.outputFormat,
        constraints: jumpGameData.constraints,
        sampleInput: jumpGameData.sampleInput,
        sampleOutput: jumpGameData.sampleOutput,
        templates: jumpGameTemplates,
        testCases: jumpGameTestCases,
      }
    });
    console.log('✅ Jump Game updated successfully!');
    console.log(`   ID: ${jumpGameUpdated.id}`);
    console.log(`   Slug: ${jumpGameUpdated.slug}\n`);

    // Update Jump Game II
    console.log('📝 Updating Jump Game II...');
    const jumpGameIIUpdated = await prisma.question.update({
      where: { id: 'fb32e963-d583-4c1e-9e1a-76d61c27be28' },
      data: {
        title: jumpGameIIData.title,
        slug: jumpGameIIData.slug,
        difficulty: jumpGameIIData.difficulty,
        topics: jumpGameIIData.topics,
        companies: jumpGameIIData.companies,
        xpReward: jumpGameIIData.xpReward,
        timeLimit: jumpGameIIData.timeLimit,
        memoryLimit: jumpGameIIData.memoryLimit,
        statement: jumpGameIIData.statement,
        inputFormat: jumpGameIIData.inputFormat,
        outputFormat: jumpGameIIData.outputFormat,
        constraints: jumpGameIIData.constraints,
        sampleInput: jumpGameIIData.sampleInput,
        sampleOutput: jumpGameIIData.sampleOutput,
        templates: jumpGameIITemplates,
        testCases: jumpGameIITestCases,
      }
    });
    console.log('✅ Jump Game II updated successfully!');
    console.log(`   ID: ${jumpGameIIUpdated.id}`);
    console.log(`   Slug: ${jumpGameIIUpdated.slug}\n`);

    // Update Gas Station
    console.log('📝 Updating Gas Station...');
    const gasStationUpdated = await prisma.question.update({
      where: { id: '0e7c8db2-74cd-46c3-a991-dd18e6bbe29c' },
      data: {
        title: gasStationData.title,
        slug: gasStationData.slug,
        difficulty: gasStationData.difficulty,
        topics: gasStationData.topics,
        companies: gasStationData.companies,
        xpReward: gasStationData.xpReward,
        timeLimit: gasStationData.timeLimit,
        memoryLimit: gasStationData.memoryLimit,
        statement: gasStationData.statement,
        inputFormat: gasStationData.inputFormat,
        outputFormat: gasStationData.outputFormat,
        constraints: gasStationData.constraints,
        sampleInput: gasStationData.sampleInput,
        sampleOutput: gasStationData.sampleOutput,
        templates: gasStationTemplates,
        testCases: gasStationTestCases,
      }
    });
    console.log('✅ Gas Station updated successfully!');
    console.log(`   ID: ${gasStationUpdated.id}`);
    console.log(`   Slug: ${gasStationUpdated.slug}\n`);

    // Update Minimize Cash Flow
    console.log('📝 Updating Minimize Cash Flow...');
    const minimizeCashFlowUpdated = await prisma.question.update({
      where: { id: '0cccc1fa-4067-4845-aefa-019ffa56d613' },
      data: {
        title: minimizeCashFlowData.title,
        slug: minimizeCashFlowData.slug,
        difficulty: minimizeCashFlowData.difficulty,
        topics: minimizeCashFlowData.topics,
        companies: minimizeCashFlowData.companies,
        xpReward: minimizeCashFlowData.xpReward,
        timeLimit: minimizeCashFlowData.timeLimit,
        memoryLimit: minimizeCashFlowData.memoryLimit,
        statement: minimizeCashFlowData.statement,
        inputFormat: minimizeCashFlowData.inputFormat,
        outputFormat: minimizeCashFlowData.outputFormat,
        constraints: minimizeCashFlowData.constraints,
        sampleInput: minimizeCashFlowData.sampleInput,
        sampleOutput: minimizeCashFlowData.sampleOutput,
        templates: minimizeCashFlowTemplates,
        testCases: minimizeCashFlowTestCases,
      }
    });
    console.log('✅ Minimize Cash Flow updated successfully!');
    console.log(`   ID: ${minimizeCashFlowUpdated.id}`);
    console.log(`   Slug: ${minimizeCashFlowUpdated.slug}\n`);

    console.log('✅ All 4 DSA problems updated successfully!');
    console.log('\n📊 Summary:');
    console.log('   ✓ Jump Game (MEDIUM, 8 XP)');
    console.log('   ✓ Jump Game II (MEDIUM, 8 XP)');
    console.log('   ✓ Gas Station (MEDIUM, 8 XP)');
    console.log('   ✓ Minimize Cash Flow (MEDIUM, 8 XP)');

  } catch (error) {
    console.error('❌ Error updating DSA problems:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the update
updateDSAProblems();
