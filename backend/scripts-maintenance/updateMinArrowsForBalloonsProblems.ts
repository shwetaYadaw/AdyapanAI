import { prisma } from '../config/prisma';

async function updateMinArrowsForBalloonsProblem() {
  try {
    await prisma.question.deleteMany({
      where: { slug: 'minimum-number-of-arrows-to-burst-balloons' }
    });

    const problem = await prisma.question.create({
      data: {
        title: 'Minimum Number of Arrows to Burst Balloons',
        slug: 'minimum-number-of-arrows-to-burst-balloons',
        difficulty: 'MEDIUM',
        topics: ['arrays', 'greedy', 'sorting', 'interval-merging'],
        companies: ['Google', 'Amazon', 'Microsoft', 'ByteDance'],
        xpReward: 8,
        timeLimit: 2,
        memoryLimit: 256,
        
        statement: `# Minimum Number of Arrows to Burst Balloons

## Problem Statement

There are a number of **spherical balloons** spread in 2D space.

For each balloon, provided input is the set of points representing its **diameter endpoints**.

You need to find the **minimum number of arrows** that must be shot **exactly on a line** to **burst all balloons**.

An arrow shot on a line will **burst all balloons** that are on this line.

Points \`(xs, xe)\` means the balloon **expands from xs to xe** on the **x-axis**. You may assume \`xs < xe\`.

**Return the minimum number of arrows needed to burst all balloons**.

## Problem Details

- Input: Array of balloon diameter endpoints [start, end]
- Output: Minimum arrows needed to burst all balloons
- Goal: Find optimal arrow placement to burst maximum balloons
- Constraint: Arrow must lie within balloon's range to burst it
- Overlapping: Multiple balloons may be burst by single arrow

## Key Insights

1. **Overlap detection:** Balloons overlap if ranges intersect
2. **Greedy choice:** Shoot arrow at rightmost point to cover maximum balloons
3. **Sorting:** Sort by end points for efficient greedy selection
4. **Interval merging:** Similar to interval merging but tracking arrows
5. **Boundary handling:** Integer overflow when comparing large endpoints

## Examples

### Example 1: Overlapping Balloons
**Input:**
\`\`\`
points = [[10,16],[2,8],[1,6],[7,12]]
\`\`\`
**Output:** \`2\`

**Explanation:**
- Sort by endpoints: [1,6], [2,8], [7,12], [10,16]
- Shoot arrow at 6: bursts [1,6], [2,8]
- Shoot arrow at 12: bursts [7,12], [10,16]
- Total: 2 arrows

### Example 2: Non-Overlapping Balloons
**Input:**
\`\`\`
points = [[1,2],[3,4],[5,6],[7,8]]
\`\`\`
**Output:** \`4\`

**Explanation:**
- No overlap between balloons
- Each needs separate arrow
- Total: 4 arrows

### Example 3: All Overlapping
**Input:**
\`\`\`
points = [[1,10],[2,9],[3,8],[4,7]]
\`\`\`
**Output:** \`1\`

**Explanation:**
- All ranges share common point (e.g., 7)
- Single arrow at 7 bursts all
- Total: 1 arrow

### Example 4: Partially Overlapping
**Input:**
\`\`\`
points = [[1,3],[2,5],[3,7],[4,9]]
\`\`\`
**Output:** \`2\`

**Explanation:**
- [1,3] and [2,5] overlap: arrow at 3
- [3,7] and [4,9] overlap: arrow at 7
- Alternatively: [1,3], [2,5] overlap at 2-3
- Then [3,7], [4,9] overlap at 4-7
- Total: 2 arrows

### Example 5: Single Balloon
**Input:**
\`\`\`
points = [[1,5]]
\`\`\`
**Output:** \`1\`

**Explanation:**
- Single balloon needs single arrow
- Total: 1 arrow

## Algorithm Approaches

### Approach 1: Greedy Sorting (Optimal)
**Time Complexity:** O(n log n)
**Space Complexity:** O(1)

Steps:
1. Sort balloons by end point (ascending)
2. Shoot arrow at first balloon's end
3. For each balloon, if not already burst:
   - Shoot arrow at its end point
4. Count arrows

Why it works:
- Shooting at rightmost point covers maximum future balloons
- Earliest end balloon is processed first
- If new balloon isn't covered, must shoot new arrow

### Approach 2: Interval Merging
**Time Complexity:** O(n log n)
**Space Complexity:** O(n)

Steps:
1. Sort by start point
2. Merge overlapping intervals
3. Count merged intervals
4. Each group needs one arrow

### Approach 3: Event-Based Sweep
**Time Complexity:** O(n log n)
**Space Complexity:** O(n)

Steps:
1. Create start and end events
2. Sort events
3. Track active balloons
4. When no active, need new arrow

### Approach 4: Recursive Greedy
**Time Complexity:** O(n log n)
**Space Complexity:** O(n) recursion

Steps:
1. Sort by end point
2. Recursively find non-overlapping balloons
3. Count balloons removed at each step

## Correctness Proof

**Theorem:** Greedy selection by rightmost end point is optimal.

**Proof:**
1. **Optimal substructure:** After shooting arrow at position p, remaining balloons form independent subproblem
2. **Greedy choice:** For any set of balloons, shooting at rightmost end covers maximum balloons
3. **Exchange argument:** If solution shoots at different point, we can replace it with rightmost end without increasing arrows
4. **Induction:** After optimal first arrow, remaining problem is optimally solved
5. **Conclusion:** Greedy algorithm achieves optimal solution

## Common Mistakes

1. **Integer overflow:** Comparing large endpoints directly
2. **Wrong sorting:** Sorting by start instead of end
3. **Boundary conditions:** Not handling touching balloons [1,2], [2,3]
4. **Off-by-one errors:** Incorrectly checking if balloon is burst
5. **Not excluding burst balloons:** Processing already burst balloons
6. **Wrong comparison:** Using >= instead of > or vice versa
7. **Special cases:** Single balloon or empty list

## Edge Cases

- **Empty array:** Return 0
- **Single balloon:** Return 1
- **Large endpoints:** Up to 2^31-1
- **Negative endpoints:** Ranges can be negative
- **Identical ranges:** Multiple identical balloons
- **Nested ranges:** One inside another
- **Touching boundaries:** Balloons touch at single point
- **Duplicate endpoints:** Multiple balloons with same end

## Interview Tips

- **Clarify overlap:** Does touching count as overlapping?
- **Brute force first:** Try all arrow positions (2^n)
- **Optimize to greedy:** Sort and select non-overlapping
- **Prove correctness:** Explain exchange argument
- **Explain sorting:** Why end point sorting matters
- **Handle overflow:** Compare using Long type
- **Follow-ups:**
  - Return arrow positions?
  - Minimize total shots?
  - 3D balloons?

## Real-World Applications

- **Air defense:** Intercepting incoming projectiles
- **Collision detection:** Finding minimal collision fixes
- **Scheduling:** Minimizing resource conflicts
- **Route planning:** Optimal waypoint selection
- **Coverage optimization:** Minimum coverage points
- **Resource allocation:** Minimal setup for multiple ranges

## Why This Problem Matters

This problem teaches:
1. **Greedy algorithm:** Optimal choice at each step
2. **Sorting strategy:** Preprocessing for algorithm
3. **Interval problems:** Common pattern in algorithms
4. **Exchange argument:** Proving greedy correctness
5. **Implementation care:** Integer overflow handling
6. **Edge case handling:** Boundaries and overlaps

## Complexity Analysis

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Greedy | O(n log n) | O(1) | Optimal, single pass after sort |
| Merging | O(n log n) | O(n) | Clear logic, extra space |
| Sweep Line | O(n log n) | O(n) | Complex, harder to implement |
| Recursive | O(n log n) | O(n) | Elegant but recursion overhead |

## Key Learning Points

- Sort by end point for greedy selection
- Track last arrow position
- Compare if balloon start exceeds last arrow (no overlap)
- Handle integer overflow with long comparisons
- Test with touching and nested ranges
- Verify with various overlap configurations
- Understand why rightmost end is greedy choice
`,

        inputFormat: `n (number of balloons)
points: each line contains two integers start end (balloon diameter endpoints)`,

        outputFormat: `Minimum number of arrows needed to burst all balloons`,

        constraints: `- 1 <= points.length <= 10^5
- points[i].length == 2
- -2^31 <= xs < xe <= 2^31 - 1`,

        sampleInput: '4\n10 16\n2 8\n1 6\n7 12',
        sampleOutput: '2',

        testCases: [
          {
            input: '4\n10 16\n2 8\n1 6\n7 12',
            output: '2',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '4\n1 2\n3 4\n5 6\n7 8',
            output: '4',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '4\n1 10\n2 9\n3 8\n4 7',
            output: '1',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '1\n1 5',
            output: '1',
            isHidden: false,
            type: 'visible'
          },
          {
            input: '4\n1 3\n2 5\n3 7\n4 9',
            output: '2',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '5\n9 12\n1 10\n4 11\n8 12\n3 9',
            output: '2',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '3\n1 2\n2 3\n3 4',
            output: '1',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '2\n-2147483647 2147483647\n-2147483646 2147483647',
            output: '1',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '5\n0 1\n1 2\n2 3\n3 4\n4 5',
            output: '1',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '6\n1 2\n3 5\n4 6\n7 8\n9 11\n10 12',
            output: '3',
            isHidden: true,
            type: 'hidden'
          },
          {
            input: '3\n50 50\n1 2\n3 4',
            output: '2',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '2\n1 1\n1 1',
            output: '1',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '1\n-2147483648 2147483647',
            output: '1',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '4\n-10 -8\n-5 -2\n0 1\n2 5',
            output: '4',
            isHidden: true,
            type: 'edge'
          },
          {
            input: '5\n-100 -50\n-40 -20\n-20 0\n10 20\n25 30',
            output: '3',
            isHidden: true,
            type: 'edge'
          }
        ],

        templates: [
          {
            language: 'python',
            code: `def findMinArrowShots(points):
    """
    Find minimum number of arrows to burst all balloons.
    
    Args:
        points: List of [start, end] representing balloon diameter endpoints
        
    Returns:
        Minimum number of arrows needed
    """
    
    if not points:
        return 0
    
    # Sort by end point
    # Use negative start as tiebreaker for stability
    points.sort(key=lambda x: x[1])
    
    arrows = 1
    current_end = points[0][1]
    
    for i in range(1, len(points)):
        # If current balloon starts after previous arrow position
        if points[i][0] > current_end:
            # Need new arrow
            arrows += 1
            current_end = points[i][1]
    
    return arrows

# Test cases
if __name__ == "__main__":
    print(findMinArrowShots([[10,16],[2,8],[1,6],[7,12]]))  # 2
    print(findMinArrowShots([[1,2],[3,4],[5,6],[7,8]]))  # 4
    print(findMinArrowShots([[1,10],[2,9],[3,8],[4,7]]))  # 1
    print(findMinArrowShots([[1]]))  # 1 (edge: single point)`
          },
          {
            language: 'javascript',
            code: `function findMinArrowShots(points) {
    /**
     * Find minimum number of arrows to burst all balloons.
     * 
     * @param {number[][]} points - Array of [start, end] pairs
     * @return {number} - Minimum number of arrows needed
     */
    
    if (points.length === 0) {
        return 0;
    }
    
    // Sort by end point
    points.sort((a, b) => {
        // Use BigInt for comparison to avoid overflow
        if (BigInt(a[1]) < BigInt(b[1])) return -1;
        if (BigInt(a[1]) > BigInt(b[1])) return 1;
        return 0;
    });
    
    let arrows = 1;
    let currentEnd = BigInt(points[0][1]);
    
    for (let i = 1; i < points.length; i++) {
        // If current balloon starts after previous arrow position
        if (BigInt(points[i][0]) > currentEnd) {
            // Need new arrow
            arrows++;
            currentEnd = BigInt(points[i][1]);
        }
    }
    
    return arrows;
}

// Test cases
console.log(findMinArrowShots([[10,16],[2,8],[1,6],[7,12]]));  // 2
console.log(findMinArrowShots([[1,2],[3,4],[5,6],[7,8]]));  // 4
console.log(findMinArrowShots([[1,10],[2,9],[3,8],[4,7]]));  // 1`
          }
        ]
      }
    });

    console.log('✅ Minimum Arrows for Balloons problem created successfully!');
    console.log('Problem ID:', problem.id);
    console.log('Slug:', problem.slug);

    return problem;
  } catch (error) {
    console.error('❌ Error creating problem:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateMinArrowsForBalloonsProblem();
