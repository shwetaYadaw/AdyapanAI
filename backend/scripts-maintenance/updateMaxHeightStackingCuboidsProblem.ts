import { prisma } from '../config/prisma';

async function updateMaxHeightStackingCuboidsProblem() {
  try {
    await prisma.question.deleteMany({
      where: { slug: 'maximum-height-by-stacking-cuboids' }
    });

    const problem = await prisma.question.create({
      data: {
        title: 'Maximum Height by Stacking Cuboids',
        slug: 'maximum-height-by-stacking-cuboids',
        difficulty: 'HARD',
        topics: ['3d-dp', 'sorting', 'dynamic-programming', 'geometry'],
        companies: ['Google', 'Facebook', 'Amazon'],
        xpReward: 12,
        timeLimit: 3,
        memoryLimit: 512,
        
        statement: `# Maximum Height by Stacking Cuboids

## Problem Statement

Given **N cuboids**, each with **dimensions (length, width, height)**.

You can **stack cuboids on top of each other** if:
1. **Dimensions of lower cuboid** are **strictly greater** than upper cuboid
2. **Any orientation** of cuboid is allowed (rotate freely)

For a cuboid with dimensions (a, b, c), you can arrange them in **any order**.

**Return the maximum height** achievable by stacking cuboids optimally.

## Problem Details

- Input: Array of cuboids with three dimensions each
- Output: Maximum achievable height
- Goal: Stack cuboids to maximize height
- Constraint: Strict inequality for base dimensions
- Flexibility: Can rotate cuboids (any orientation)
- Choice: Choose height dimension strategically

## Key Insights

1. **Cuboid orientation:** For each cuboid, choose which dimension is height
2. **Base consideration:** Two base dimensions must be strictly greater
3. **Greedy orientation:** Minimize base to maximize stackability
4. **Sorting:** Pre-sort cuboids for DP efficiency
5. **3D DP:** Track cuboid index and previous base dimensions

## Examples

### Example 1: Two Cuboids
**Input:**
\`\`\`
cuboids = [[2,1,3],[2,2,2]]
\`\`\`
**Output:** \`5\`

**Explanation:**
- Cuboid 1: (2,1,3) - choose height 3, base (1,2)
- Cuboid 2: (2,2,2) - choose height 2, base (2,2)
- Check: base (2,2) NOT strictly greater than (1,2)
- Try: Cuboid 2 bottom: height 2, base (2,2)
- Cuboid 1 top: height 3, base (1,2)
- Check: (2,2) > (1,2)? Yes! Height = 2 + 3 = 5

### Example 2: Single Cuboid
**Input:**
\`\`\`
cuboids = [[1,2,3]]
\`\`\`
**Output:** \`3\`

**Explanation:**
- Single cuboid, use max dimension as height
- Height: 3

### Example 3: Non-Stackable
**Input:**
\`\`\`
cuboids = [[1,1,1],[1,1,2]]
\`\`\`
**Output:** \`2\`

**Explanation:**
- Cannot stack [1,1,1] on [1,1,2]
- Cannot stack [1,1,2] on [1,1,1]
- Each separate: max height 2

### Example 4: Linear Stack
**Input:**
\`\`\`
cuboids = [[1,1,1],[2,2,2],[3,3,3]]
\`\`\`
**Output:** \`6\`

**Explanation:**
- [3,3,3]: height 3, base (3,3)
- [2,2,2]: height 2, base (2,2) - stackable on (3,3)
- [1,1,1]: height 1, base (1,1) - stackable on (2,2)
- Total: 3 + 2 + 1 = 6

### Example 5: Complex Stacking
**Input:**
\`\`\`
cuboids = [[2,3,4],[5,6,7],[1,2,3]]
\`\`\`
**Output:** \`15\`

**Explanation:**
- [5,6,7]: height 7, base (5,6)
- [2,3,4]: height 4, base (2,3) - stackable on (5,6)
- [1,2,3]: height 3, base (1,2) - stackable on (2,3)
- Total: 7 + 4 + 3 = 14? Or different arrangement?
- Alternative: [5,6,7]: height 7, base (5,6)
- [2,3,4]: height 4, base (2,3)
- [1,2,3]: height 3, base (1,2)
- Check stacking all three: (5,6) > (2,3) > (1,2)? Yes!
- Total: 7 + 4 + 3 = 14

## Algorithm Approaches

### Approach 1: DP with Rotation (Optimal)
**Time Complexity:** O(n² * log n)
**Space Complexity:** O(n²)

Steps:
1. For each cuboid, generate 3 orientations (different heights)
2. Sort all cuboids by base dimensions
3. DP: dp[i] = max height with cuboid i as top
4. For each cuboid i, try stacking on all previous j
5. Check if base of i strictly greater than base of j
6. Return maximum dp value

### Approach 2: 3D DP without Rotation
**Time Complexity:** O(n² * h)
**Space Complexity:** O(n² * h)

Steps:
1. Fixed cuboid orientation
2. DP with 3D state: (cuboid_idx, prev_base_dims)
3. Complex state tracking
4. Less efficient

### Approach 3: Greedy with Sorting
**Time Complexity:** O(n² * log n)
**Space Complexity:** O(n)

Steps:
1. Generate all orientations and sort
2. Greedy: always pick max height possible
3. Track stacked base dimensions
4. May not find optimal

### Approach 4: Recursive DP with Memoization
**Time Complexity:** O(n² * log n)
**Space Complexity:** O(n²)

Steps:
1. Recursively try stacking each cuboid
2. Memoize with (cuboid_index, previous_base)
3. Backtracking over stacking choices
4. Cache results to avoid recomputation

## Correctness Proof

**Theorem:** DP approach finds maximum stacking height.

**Proof:**
1. **Optimal substructure:** If optimal solution stacks cuboids 1..i with i on top, then stacking 1..i-1 is optimal for that subset
2. **Monotonicity:** Sorting ensures we process cuboids in optimal order
3. **State completeness:** DP state (current cuboid) captures all necessary information
4. **Transition validity:** Only valid stackings (base strictly greater) are considered
5. **Correctness:** DP explores all valid stacking sequences
6. **Termination:** Finite cuboids guarantee termination
7. **Conclusion:** Maximum found is optimal solution

## Common Mistakes

1. **Rotation not considered:** Fixed orientations limit solutions
2. **Wrong comparison:** Using >= instead of >
3. **State not tracked:** Not remembering previous cuboid's base
4. **Sorting issues:** Not sorting correctly for DP
5. **Base dimensions:** Confusing which dimensions are base
6. **DP initialization:** Not starting DP correctly
7. **Off-by-one:** Indexing errors in DP
8. **Overflow:** Large height sums

## Edge Cases

- **Single cuboid:** Return max dimension
- **All identical:** Can only use one
- **Very different sizes:** Linear stacking
- **All same dimensions:** Cannot stack
- **Large numbers:** Up to 10^9 per dimension
- **Maximum cuboids:** Up to 100
- **Non-stackable:** Each cuboid separate
- **Partial stackability:** Some can stack, others can't

## Interview Tips

- **Clarify rotation:** Can cuboids be oriented any way?
- **Understand stacking:** What makes valid stacking?
- **Brute force first:** Try all permutations and orientations (exponential)
- **Optimize to DP:** Sort and dynamic programming
- **Explain rotations:** Why considering all orientations matters
- **Trace example:** Show DP table building
- **Complexity:** Why O(n²) is necessary
- **Follow-ups:**
  - Return actual stacking?
  - Different stacking rules?
  - Maximum cuboids to use?

## Real-World Applications

- **Tower building:** Stacking blocks optimally
- **Architecture:** Structural design with constraints
- **Logistics:** Stacking boxes in warehouses
- **Compression:** Nested storage optimization
- **Engineering:** Load-bearing constraints
- **Space optimization:** Vertical storage maximization

## Why This Problem Matters

This problem teaches:
1. **Advanced DP:** Multi-state dynamic programming
2. **3D geometry:** Working with spatial dimensions
3. **Rotation handling:** State transformation
4. **Sorting strategy:** Preprocessing for DP
5. **Constraint satisfaction:** Valid state transitions
6. **Optimization:** Complex problem decomposition
7. **Hard problem thinking:** Approaching difficult algorithms

## Complexity Analysis

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| DP Rotation | O(n² log n) | O(n²) | Optimal, practical |
| 3D DP | O(n² h) | O(n² h) | Complex, slower |
| Recursive | O(n²) | O(n²) | Cache-friendly |
| Greedy | O(n²) | O(n) | May not be optimal |

## Key Learning Points

- Generate all 3 orientations per cuboid
- Sort by base dimensions carefully
- DP: dp[i] = max height ending at cuboid i
- Check strict inequality for stacking validity
- Compare both base dimensions
- Initialize all dp values to single cuboid heights
- Verify with various cuboid configurations
- Handle non-stackable cases
- Test edge cases thoroughly
`,

        inputFormat: `n (number of cuboids)
cuboids: each line contains three integers (length, width, height)`,

        outputFormat: `Maximum possible height by stacking cuboids`,

        constraints: `- 1 <= cuboids.length <= 100
- 1 <= cuboids[i][0], cuboids[i][1], cuboids[i][2] <= 10^9`,

        sampleInput: '2\n2 1 3\n2 2 2',
        sampleOutput: '5',

        testCases: [
          {
            input: '2\n2 1 3\n2 2 2',
            output: '5',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '1\n1 2 3',
            output: '3',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '2\n1 1 1\n1 1 2',
            output: '2',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '3\n1 1 1\n2 2 2\n3 3 3',
            output: '6',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '3\n2 3 4\n5 6 7\n1 2 3',
            output: '14',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '2\n1 2 3\n4 5 6',
            output: '9',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '4\n1 1 1\n2 2 2\n3 3 3\n4 4 4',
            output: '10',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '3\n50 50 50\n40 40 40\n30 30 30',
            output: '150',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '2\n2 4 6\n1 3 5',
            output: '11',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '5\n1 2 3\n2 3 4\n3 4 5\n4 5 6\n5 6 7',
            output: '15',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '1\n1000000000 1000000000 1000000000',
            output: '1000000000',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '2\n1 1 1\n1 1 1',
            output: '1',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '3\n1 2 3\n1 2 3\n1 2 3',
            output: '3',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '4\n1 1 1000000000\n2 2 2\n3 3 3\n4 4 4',
            output: '1000000009',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '3\n10 20 30\n5 15 25\n1 2 3',
            output: '58',
            isHidden: true,
            type: 'edge'
          }
        ],

        templates: [
          {
            language: 'python',
            code: `def maxHeight(cuboids):
    """
    Find maximum height by stacking cuboids optimally.
    
    Args:
        cuboids: List of [length, width, height] for each cuboid
        
    Returns:
        Maximum achievable height
    """
    
    n = len(cuboids)
    if n == 0:
        return 0
    
    # Generate all orientations: sort dimensions for each cuboid
    orientations = []
    for l, w, h in cuboids:
        dims = sorted([l, w, h])
        # Three possible heights (any dimension can be height)
        for height_idx in range(3):
            # Base dimensions are the other two
            base = [dims[i] for i in range(3) if i != height_idx]
            base.sort()  # Sort base dimensions
            orientations.append((base[0], base[1], dims[height_idx]))
    
    # Sort by base dimensions
    orientations.sort()
    
    m = len(orientations)
    # dp[i] = max height with orientations[i] at top
    dp = [o[2] for o in orientations]
    
    # DP
    for i in range(m):
        for j in range(i):
            # Can stack i on top of j if base of j > base of i
            if orientations[j][0] > orientations[i][0] and \\
               orientations[j][1] > orientations[i][1]:
                dp[i] = max(dp[i], dp[j] + orientations[i][2])
    
    return max(dp) if dp else 0

# Test cases
if __name__ == "__main__":
    print(maxHeight([[2,1,3],[2,2,2]]))  # 5
    print(maxHeight([[1,2,3]]))  # 3
    print(maxHeight([[1,1,1],[2,2,2],[3,3,3]]))  # 6`
          },
          {
            language: 'javascript',
            code: `function maxHeight(cuboids) {
    /**
     * Find maximum height by stacking cuboids optimally.
     * 
     * @param {number[][]} cuboids - Array of [length, width, height]
     * @return {number} - Maximum achievable height
     */
    
    const n = cuboids.length;
    if (n === 0) return 0;
    
    // Generate all orientations
    const orientations = [];
    
    for (const [l, w, h] of cuboids) {
        const dims = [l, w, h].sort((a, b) => a - b);
        // Three possible heights
        for (let heightIdx = 0; heightIdx < 3; heightIdx++) {
            const base = dims
                .map((_, i) => i !== heightIdx ? dims[i] : null)
                .filter(x => x !== null)
                .sort((a, b) => a - b);
            orientations.push([base[0], base[1], dims[heightIdx]]);
        }
    }
    
    // Sort by base dimensions
    orientations.sort((a, b) => {
        if (a[0] !== b[0]) return a[0] - b[0];
        return a[1] - b[1];
    });
    
    const m = orientations.length;
    // dp[i] = max height with orientation i at top
    const dp = orientations.map(o => o[2]);
    
    // DP
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < i; j++) {
            // Can stack i on top of j
            if (orientations[j][0] > orientations[i][0] &&
                orientations[j][1] > orientations[i][1]) {
                dp[i] = Math.max(dp[i], dp[j] + orientations[i][2]);
            }
        }
    }
    
    return Math.max(...dp);
}

// Test cases
console.log(maxHeight([[2,1,3],[2,2,2]]));  // 5
console.log(maxHeight([[1,2,3]]));  // 3
console.log(maxHeight([[1,1,1],[2,2,2],[3,3,3]]));  // 6`
          }
        ]
      }
    });

    console.log('✅ Maximum Height Stacking Cuboids problem created successfully!');
    
  } catch (error) {
    console.error('❌ Error creating problem:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateMaxHeightStackingCuboidsProblem();
