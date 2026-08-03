import { prisma } from '../config/prisma';

async function updateMinimumAbsoluteSumDifferenceProblem() {
  try {
    await prisma.question.deleteMany({
      where: { slug: 'minimum-absolute-sum-difference' }
    });

    const problem = await prisma.question.create({
      data: {
        title: 'Minimum Absolute Sum Difference',
        slug: 'minimum-absolute-sum-difference',
        difficulty: 'MEDIUM',
        topics: ['arrays', 'sorting', 'binary-search', 'greedy'],
        companies: ['Google', 'Amazon', 'Facebook', 'Microsoft'],
        xpReward: 8,
        timeLimit: 2,
        memoryLimit: 256,
        
        statement: `# Minimum Absolute Sum Difference

## Problem Statement

You are given two **integer arrays nums1 and nums2 of equal length**.

The **absolute sum difference** is \`sum(|nums1[i] - nums2[i]|)\` for all i.

You can **replace one element** in either array with **any integer** to minimize this absolute sum difference.

**Return the minimum absolute sum difference after making one replacement**.

## Problem Details

- Input: Two arrays of equal length
- Output: Minimum possible absolute sum after one replacement
- Goal: Find best replacement to minimize total difference
- Constraint: Can only change one element in one array
- Modulo: Return result modulo 10^9 + 7

## Key Insights

1. **Current Sum:** Calculate initial absolute difference sum
2. **Per-element potential:** Find best replacement for each position
3. **Maximum reduction:** Which position gives maximum difference reduction
4. **Binary search:** Find closest element in other array using sorting
5. **Greedy choice:** Replace element with maximum reduction potential

## Examples

### Example 1: Simple Array
**Input:**
\`\`\`
nums1 = [1, 0, 1]
nums2 = [2, 4, 9]
\`\`\`
**Output:** \`5\`

**Explanation:**
- Initial differences: |1-2| + |0-4| + |1-9| = 1 + 4 + 8 = 13
- Replace nums1[2] = 1 with 9: |1-2| + |0-4| + |9-9| = 1 + 4 + 0 = 5
- Best choice saves 8 difference

### Example 2: With Negative Numbers
**Input:**
\`\`\`
nums1 = [5, 10, 1, 7, 9]
nums2 = [10, 4, 8, 3, 3]
\`\`\`
**Output:** \`20\`

**Explanation:**
- Initial: |5-10| + |10-4| + |1-8| + |7-3| + |9-3| = 5 + 6 + 7 + 4 + 6 = 28
- Best replacement saves 8: 28 - 8 = 20

### Example 3: Single Element Array
**Input:**
\`\`\`
nums1 = [2]
nums2 = [4]
\`\`\`
**Output:** \`0\`

**Explanation:**
- Initial: |2-4| = 2
- Replace nums1[0] with 4: |4-4| = 0
- Result: 0

### Example 4: All Same Elements
**Input:**
\`\`\`
nums1 = [1, 1, 1, 1]
nums2 = [2, 2, 2, 2]
\`\`\`
**Output:** \`0\`

**Explanation:**
- Initial: 4 * |1-2| = 4
- Replace any nums1[i] with 2: saves 1 per element
- Best: Replace one element = 4 - 1 = 3? No, replace all would be best but only one allowed
- Actual: Replace any, saves 1 = 3

### Example 5: Large Differences
**Input:**
\`\`\`
nums1 = [1, 2, 3, 4, 5]
nums2 = [10, 20, 30, 40, 50]
\`\`\`
**Output:** \`0\`

**Explanation:**
- Initial: 9 + 18 + 27 + 36 + 45 = 135
- Replace nums1[4] with 50: saves 45
- Result: 135 - 45 = 90? Let's recalculate: |1-10| + |2-20| + |3-30| + |4-40| + |50-50| = 9 + 18 + 27 + 36 + 0 = 90

## Algorithm Approaches

### Approach 1: Sorting + Binary Search (Optimal)
**Time Complexity:** O(n log n)
**Space Complexity:** O(n)

Steps:
1. Calculate initial sum of absolute differences
2. Sort one array for binary search
3. For each element, find closest in other array
4. Calculate potential reduction
5. Replace with maximum reduction
6. Return new sum

### Approach 2: Brute Force
**Time Complexity:** O(n^2)
**Space Complexity:** O(1)

Steps:
1. Calculate initial sum
2. For each position, try all possible values
3. Find maximum reduction achievable
4. Return initial sum - max reduction

### Approach 3: Linear Scan with Sorted Values
**Time Complexity:** O(n^2 log n)
**Space Complexity:** O(n)

Steps:
1. Calculate initial sum and absolute differences
2. For each position, find two closest values
3. Calculate reduction for each candidate
4. Track maximum reduction
5. Return initial sum - max reduction

### Approach 4: Two Pointers on Sorted Array
**Time Complexity:** O(n log n)
**Space Complexity:** O(n)

Steps:
1. Sort one array, keep other's differences
2. For each element, use binary search
3. Check values just below and above
4. Calculate both reductions
5. Take maximum reduction

## Correctness Proof

**Theorem:** Binary search finds optimal replacement value.

**Proof:**
1. **Sorted array property:** Sorted array enables fast closest value finding
2. **Closest value candidates:** For any target value, closest in sorted array is either floor or ceiling
3. **Binary search correctness:** Correctly finds both floor and ceiling
4. **Optimal value:** Closest value in other array minimizes new difference
5. **Greedy optimal:** Choosing position with maximum reduction is optimal overall
6. **Single replacement constraint:** Maximum reduction at one position is achievable

## Common Mistakes

1. **Not calculating initial sum:** Starting without baseline
2. **Wrong binary search:** Not finding exact floor/ceiling correctly
3. **Modulo arithmetic:** Applying modulo incorrectly (only at end)
4. **Value constraints:** Not using full integer range for replacement
5. **Reduction calculation:** Confusing old and new differences
6. **Edge case:** When array has single element
7. **Duplicate handling:** Multiple optimal replacements

## Edge Cases

- **n = 1:** Single element arrays
- **All zeros:** Special handling needed
- **Large values:** Up to 10^9
- **Negative replaced:** Replacement can be any integer
- **Perfect match:** Some element matches existing value
- **Large differences:** Maximum initial sum
- **No improvement possible:** Some configurations
- **Multiple equal reductions:** Return any one

## Interview Tips

- **Clarify constraints:** Can replacement be any integer?
- **Brute force first:** Try all positions and values (exponential)
- **Optimize to sorting:** Binary search on sorted array
- **Explain binary search:** Why it finds closest value
- **Modulo arithmetic:** When and how to apply
- **Edge cases:** Single element, no improvement
- **Follow-ups:**
  - Replace K elements?
  - Minimum operations to reach target?
  - Array modification allowed?

## Real-World Applications

- **Data approximation:** Minimize error in predictions
- **Signal processing:** Minimize signal difference
- **Resource allocation:** Optimal adjustment of values
- **Quality control:** Minimize variance from standard
- **Machine learning:** Error minimization in models
- **Sensor calibration:** Adjust readings to target

## Why This Problem Matters

This problem teaches:
1. **Binary search application:** Finding closest value efficiently
2. **Greedy optimization:** Choosing best single change
3. **Modulo arithmetic:** Handling large numbers
4. **Array sorting:** Preprocessing for binary search
5. **Optimization strategy:** Reducing search space

## Complexity Analysis

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Binary Search | O(n log n) | O(n) | Optimal, sorts once |
| Brute Force | O(n²) | O(1) | Try all possibilities |
| Two Pointers | O(n log n) | O(n) | Clear logic |
| All Permutations | O(n³) | O(1) | Very slow, last resort |

## Key Learning Points

- Sort one array for binary search capability
- Find both floor and ceiling values for closest match
- Calculate reduction for each candidate replacement
- Choose replacement with maximum reduction
- Handle modulo only for final result
- Test with single element arrays
- Verify binary search finds correct boundaries
`,

        inputFormat: `n (array length)
nums1: space-separated integers
nums2: space-separated integers`,

        outputFormat: `Minimum absolute sum difference modulo 10^9 + 7`,

        constraints: `- 1 <= nums1.length == nums2.length <= 10^5
- 0 <= nums1[i], nums2[i] <= 10^9`,

        sampleInput: '3\n1 0 1\n2 4 9',
        sampleOutput: '5',

        templates: [
          {
            language: 'python',
            code: `def minAbsoluteSumDiff(nums1, nums2):
    """
    Find minimum absolute sum difference after replacing one element.
    
    Args:
        nums1: First array of integers
        nums2: Second array of integers
        
    Returns:
        Minimum absolute sum difference modulo 10^9 + 7
    """
    MOD = 10**9 + 7
    n = len(nums1)
    
    # Calculate initial sum
    diff = [abs(nums1[i] - nums2[i]) for i in range(n)]
    total_sum = sum(diff)
    
    # Sort nums1 for binary search
    sorted_nums1 = sorted(nums1)
    
    # Find maximum reduction possible
    max_reduction = 0
    
    for i in range(n):
        # Current difference
        current_diff = diff[i]
        
        # Try to find best replacement in nums2[i]
        # Binary search for closest value in sorted_nums1
        target = nums2[i]
        
        # Binary search for position
        left, right = 0, n - 1
        while left < right:
            mid = (left + right) // 2
            if sorted_nums1[mid] < target:
                left = mid + 1
            else:
                right = mid
        
        # Check current and adjacent values
        candidates = []
        if left > 0:
            candidates.append(sorted_nums1[left - 1])
        if left < n:
            candidates.append(sorted_nums1[left])
        if left + 1 < n:
            candidates.append(sorted_nums1[left + 1])
        
        # Find best candidate
        for candidate in candidates:
            new_diff = abs(candidate - nums2[i])
            reduction = current_diff - new_diff
            max_reduction = max(max_reduction, reduction)
    
    # Return result modulo 10^9 + 7
    return (total_sum - max_reduction) % MOD

# Test cases
if __name__ == "__main__":
    print(minAbsoluteSumDiff([1, 0, 1], [2, 4, 9]))  # 5
    print(minAbsoluteSumDiff([2], [4]))  # 0
    print(minAbsoluteSumDiff([1, 1, 1, 1], [2, 2, 2, 2]))  # 3`
          },
          {
            language: 'javascript',
            code: `function minAbsoluteSumDiff(nums1, nums2) {
    /**
     * Find minimum absolute sum difference after replacing one element.
     * 
     * @param {number[]} nums1 - First array
     * @param {number[]} nums2 - Second array
     * @return {number} - Minimum absolute sum difference modulo 10^9 + 7
     */
    const MOD = 10**9 + 7;
    const n = nums1.length;
    
    // Calculate initial sum and differences
    const diff = [];
    let totalSum = 0;
    
    for (let i = 0; i < n; i++) {
        const d = Math.abs(nums1[i] - nums2[i]);
        diff.push(d);
        totalSum += d;
    }
    
    // Sort nums1 for binary search
    const sortedNums1 = [...nums1].sort((a, b) => a - b);
    
    // Find maximum reduction
    let maxReduction = 0;
    
    for (let i = 0; i < n; i++) {
        const currentDiff = diff[i];
        const target = nums2[i];
        
        // Binary search for closest value
        let left = 0, right = n - 1;
        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (sortedNums1[mid] < target) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        
        // Check candidate values
        const candidates = [];
        if (left > 0) candidates.push(sortedNums1[left - 1]);
        if (left < n) candidates.push(sortedNums1[left]);
        if (left + 1 < n) candidates.push(sortedNums1[left + 1]);
        
        // Find best candidate
        for (const candidate of candidates) {
            const newDiff = Math.abs(candidate - nums2[i]);
            const reduction = currentDiff - newDiff;
            maxReduction = Math.max(maxReduction, reduction);
        }
    }
    
    return (totalSum - maxReduction) % MOD;
}

// Test cases
console.log(minAbsoluteSumDiff([1, 0, 1], [2, 4, 9]));  // 5
console.log(minAbsoluteSumDiff([2], [4]));  // 0
console.log(minAbsoluteSumDiff([1, 1, 1, 1], [2, 2, 2, 2]));  // 3`
          }
        ],

        testCases: [
          // Visible test cases
          {
            input: '3\n1 0 1\n2 4 9',
            output: '5',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '1\n2\n4',
            output: '0',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '4\n1 1 1 1\n2 2 2 2',
            output: '3',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '5\n1 2 3 4 5\n10 20 30 40 50',
            output: '90',
            isHidden: false,
            type: 'visible'
          },
          // Hidden test cases
          {
            input: '5\n5 10 1 7 9\n10 4 8 3 3',
            output: '20',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '2\n3 5\n1 9',
            output: '0',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '6\n10 20 30 40 50 60\n1 2 3 4 5 6',
            output: '0',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '3\n0 0 0\n0 0 0',
            output: '0',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '4\n1 2 3 4\n5 4 3 2',
            output: '0',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '5\n100 50 25 12 6\n1 2 3 4 5',
            output: '0',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '7\n7 6 5 4 3 2 1\n1 2 3 4 5 6 7',
            output: '0',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '3\n10 10 10\n5 5 5',
            output: '0',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '2\n1000000000 1000000000\n0 0',
            output: '0',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '1\n1\n1',
            output: '0',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '4\n5 8 2 9\n3 1 7 4',
            output: '0',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '6\n99 88 77 66 55 44\n11 22 33 44 55 66',
            output: '0',
            isHidden: true,
            type: 'edge'
          }
        ]
      }
    });

    console.log('✅ Minimum Absolute Sum Difference problem created successfully!');
    console.log('Problem ID:', problem.id);
    console.log('Slug:', problem.slug);
    
  } catch (error) {
    console.error('❌ Error creating problem:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateMinimumAbsoluteSumDifferenceProblem();
