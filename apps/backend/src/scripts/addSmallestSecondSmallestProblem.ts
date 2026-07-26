import { prisma } from '../config/prisma';
import { logger } from '../utils/logger';

const problem = {
  title: 'Find Smallest and Second Smallest Distinct Elements in Array',
  slug: 'find-smallest-second-smallest-in-array',
  difficulty: 'easy',
  statement: `
## Problem Statement

Given an array \`arr[]\` of integers, find the **smallest and second smallest distinct elements** in the array. 

The result should be returned in **ascending order**, meaning the smallest element should come first, followed by the second smallest.

**Important:** If there is no valid second smallest (i.e., all elements are the same or the array has fewer than two distinct elements), then return \`[-1]\`.

---

## Constraints

- \`1 ≤ n ≤ 10^5\`
- \`-10^9 ≤ arr[i] ≤ 10^9\`
- Array may contain duplicates

---

## Examples

### Example 1
**Input:** \`arr[] = [12, 25, 8, 55, 10, 33, 17, 11]\`
**Output:** \`[8, 10]\`
**Explanation:** The smallest element is 8 and the second smallest distinct element is 10.

### Example 2
**Input:** \`arr[] = [2, 4, 3, 5, 6]\`
**Output:** \`[2, 3]\`
**Explanation:** 2 and 3 are respectively the smallest and second smallest elements in the array.

### Example 3
**Input:** \`arr[] = [1, 1, 1]\`
**Output:** \`[-1]\`
**Explanation:** Only element is 1 which is the smallest, so there is no distinct second smallest element.

### Example 4
**Input:** \`arr[] = [5]\`
**Output:** \`[-1]\`
**Explanation:** Array has only one element, so no second smallest exists.

### Example 5
**Input:** \`arr[] = [100, 50, 100, 25, 75]\`
**Output:** \`[25, 50]\`
**Explanation:** Distinct elements are [25, 50, 75, 100]. The two smallest are 25 and 50.

---

## Approach Suggestions

### Approach 1: Sorting
- Sort the array
- Iterate through sorted array and pick first two distinct elements
- **Time Complexity:** O(n log n)
- **Space Complexity:** O(1)

### Approach 2: Using Set + Sorting
- Convert array to Set to get distinct elements
- Sort the set
- Return first two elements
- **Time Complexity:** O(n log n)
- **Space Complexity:** O(n)

### Approach 3: Single Pass (Two Variables)
- Use two variables to track smallest and second smallest
- Iterate through array once, updating variables based on conditions
- **Time Complexity:** O(n)
- **Space Complexity:** O(1)
- **Most Optimal!**

### Approach 4: Using Min-Heap
- Build a min-heap from array elements
- Extract two smallest distinct elements
- **Time Complexity:** O(n + k log n) where k=2
- **Space Complexity:** O(n)

---

## Key Insights

1. **Distinct Elements Only:** Must ignore duplicate values
2. **Edge Cases:** Handle arrays with < 2 elements or all same elements
3. **Negative Numbers:** Array can have negative integers
4. **Return Format:** Always return in ascending order [smallest, secondSmallest]

---

## Hints

1. Start by thinking about edge cases
2. Do you need to sort? Can you solve in one pass?
3. Keep track of at most 2 values as you iterate
4. What happens when you encounter a duplicate of your smallest?

---

## Related Problems

- Find minimum and maximum in array
- Kth smallest element in array
- Find top K largest elements

---

## Tags

#Array #Sorting #TCS-NQT-Prep #Easy
`,
  constraints: `
- 1 ≤ n ≤ 10^5
- -10^9 ≤ arr[i] ≤ 10^9
- Array may contain duplicates
- Must find distinct elements only
  `,
  inputFormat: `First line contains integer n (size of array).
Second line contains n space-separated integers representing the array elements.`,
  outputFormat: `Return an array with two elements: [smallest, secondSmallest].
If no valid second smallest exists, return [-1].`,
  timeLimit: 2000,
  memoryLimit: 256,
  starterCode: {
    python: `def findSmallestSecond(arr):
    """
    Find the smallest and second smallest distinct elements in array.
    
    Args:
        arr: List of integers
    
    Returns:
        List containing [smallest, secondSmallest] or [-1] if not possible
    
    Examples:
        >>> findSmallestSecond([12, 25, 8, 55, 10, 33, 17, 11])
        [8, 10]
        >>> findSmallestSecond([1, 1, 1])
        [-1]
    """
    # Write your code here
    pass


# Do not modify below this
if __name__ == "__main__":
    # Test cases
    test_cases = [
        ([12, 25, 8, 55, 10, 33, 17, 11], [8, 10]),
        ([2, 4, 3, 5, 6], [2, 3]),
        ([1, 1, 1], [-1]),
        ([5], [-1]),
        ([100, 50, 100, 25, 75], [25, 50]),
        ([-5, -10, 3, 0, 5], [-10, -5]),
        ([7, 7, 7, 7], [-1]),
        ([3, 2, 1], [1, 2]),
    ]
    
    for i, (arr, expected) in enumerate(test_cases):
        result = findSmallestSecond(arr)
        status = "✓" if result == expected else "✗"
        print(f"Test {i+1} {status}: Input: {arr}, Expected: {expected}, Got: {result}")
`,
    javascript: `function findSmallestSecond(arr) {
    /**
     * Find the smallest and second smallest distinct elements in array.
     * 
     * @param {number[]} arr - Array of integers
     * @returns {number[]} Array containing [smallest, secondSmallest] or [-1] if not possible
     * 
     * @example
     * findSmallestSecond([12, 25, 8, 55, 10, 33, 17, 11]) // [8, 10]
     * findSmallestSecond([1, 1, 1]) // [-1]
     */
    // Write your code here
    
}

// Do not modify below this
const testCases = [
    { input: [12, 25, 8, 55, 10, 33, 17, 11], expected: [8, 10] },
    { input: [2, 4, 3, 5, 6], expected: [2, 3] },
    { input: [1, 1, 1], expected: [-1] },
    { input: [5], expected: [-1] },
    { input: [100, 50, 100, 25, 75], expected: [25, 50] },
    { input: [-5, -10, 3, 0, 5], expected: [-10, -5] },
    { input: [7, 7, 7, 7], expected: [-1] },
    { input: [3, 2, 1], expected: [1, 2] },
];

console.log("Running tests...");
testCases.forEach((test, i) => {
    const result = findSmallestSecond(test.input);
    const passed = JSON.stringify(result) === JSON.stringify(test.expected);
    const status = passed ? "✓" : "✗";
    console.log(\`Test \${i + 1} \${status}: Input: [\${test.input}], Expected: [\${test.expected}], Got: [\${result}]\`);
});
`,
    cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

/**
 * Find the smallest and second smallest distinct elements in array.
 * 
 * @param arr Vector of integers
 * @returns Vector containing {smallest, secondSmallest} or {-1} if not possible
 */
vector<int> findSmallestSecond(vector<int>& arr) {
    // Write your code here
    
}

int main() {
    // Test cases
    vector<pair<vector<int>, vector<int>>> testCases = {
        {{12, 25, 8, 55, 10, 33, 17, 11}, {8, 10}},
        {{2, 4, 3, 5, 6}, {2, 3}},
        {{1, 1, 1}, {-1}},
        {{5}, {-1}},
        {{100, 50, 100, 25, 75}, {25, 50}},
        {{-5, -10, 3, 0, 5}, {-10, -5}},
        {{7, 7, 7, 7}, {-1}},
        {{3, 2, 1}, {1, 2}},
    };
    
    cout << "Running tests...\\n";
    for (int i = 0; i < testCases.size(); i++) {
        auto result = findSmallestSecond(testCases[i].first);
        bool passed = (result == testCases[i].second);
        cout << "Test " << (i + 1) << (passed ? " ✓" : " ✗") << ": ";
        cout << "Expected: [";
        for (int j = 0; j < testCases[i].second.size(); j++) {
            cout << testCases[i].second[j];
            if (j < testCases[i].second.size() - 1) cout << ", ";
        }
        cout << "], Got: [";
        for (int j = 0; j < result.size(); j++) {
            cout << result[j];
            if (j < result.size() - 1) cout << ", ";
        }
        cout << "]\\n";
    }
    
    return 0;
}
`,
    java: `import java.util.*;

public class Solution {
    /**
     * Find the smallest and second smallest distinct elements in array.
     * 
     * @param arr Array of integers
     * @return Array containing [smallest, secondSmallest] or [-1] if not possible
     */
    public static int[] findSmallestSecond(int[] arr) {
        // Write your code here
        
    }
    
    // Do not modify below this
    public static void main(String[] args) {
        int[][][] testCases = {
            {{12, 25, 8, 55, 10, 33, 17, 11}, {8, 10}},
            {{2, 4, 3, 5, 6}, {2, 3}},
            {{1, 1, 1}, {-1}},
            {{5}, {-1}},
            {{100, 50, 100, 25, 75}, {25, 50}},
            {{-5, -10, 3, 0, 5}, {-10, -5}},
            {{7, 7, 7, 7}, {-1}},
            {{3, 2, 1}, {1, 2}},
        };
        
        System.out.println("Running tests...");
        for (int i = 0; i < testCases.length; i++) {
            int[] result = findSmallestSecond(testCases[i][0]);
            boolean passed = Arrays.equals(result, testCases[i][1]);
            String status = passed ? "✓" : "✗";
            System.out.println("Test " + (i + 1) + " " + status + 
                             ": Expected: " + Arrays.toString(testCases[i][1]) + 
                             ", Got: " + Arrays.toString(result));
        }
    }
}
`
  },
  testCases: [
    {
      input: '8\n12 25 8 55 10 33 17 11',
      output: '[8, 10]',
      explanation: 'Smallest is 8, second smallest is 10'
    },
    {
      input: '5\n2 4 3 5 6',
      output: '[2, 3]',
      explanation: '2 and 3 are the two smallest elements'
    },
    {
      input: '3\n1 1 1',
      output: '[-1]',
      explanation: 'All elements are same, no distinct second smallest'
    },
    {
      input: '1\n5',
      output: '[-1]',
      explanation: 'Only one element in array'
    },
    {
      input: '5\n100 50 100 25 75',
      output: '[25, 50]',
      explanation: 'Distinct elements: [25, 50, 75, 100], two smallest are 25 and 50'
    },
    {
      input: '5\n-5 -10 3 0 5',
      output: '[-10, -5]',
      explanation: 'Array contains negative numbers, -10 is smallest, -5 is second smallest'
    },
    {
      input: '4\n7 7 7 7',
      output: '[-1]',
      explanation: 'All elements are duplicates'
    },
    {
      input: '3\n3 2 1',
      output: '[1, 2]',
      explanation: 'Sorted: [1, 2, 3], smallest is 1, second smallest is 2'
    },
    {
      input: '6\n10 10 10 20 30 20',
      output: '[10, 20]',
      explanation: 'Distinct elements: [10, 20, 30], two smallest are 10 and 20'
    },
    {
      input: '2\n5 3',
      output: '[3, 5]',
      explanation: 'Two different elements, 3 is smallest, 5 is second smallest'
    },
  ],
  referenceSolution: `
# Smallest and Second Smallest - Reference Solution

## Most Optimal Approach: Single Pass (O(n) time, O(1) space)

\`\`\`python
def findSmallestSecond(arr):
    """Single pass solution - most optimal"""
    if len(arr) < 2:
        return [-1]
    
    first = float('inf')
    second = float('inf')
    
    for num in arr:
        if num < first:
            second = first
            first = num
        elif num < second and num != first:  # Must be distinct
            second = num
    
    if second == float('inf'):
        return [-1]
    return [first, second]
\`\`\`

## Alternative: Using Set and Sorting

\`\`\`python
def findSmallestSecond(arr):
    """Convert to set for distinct elements, then sort"""
    distinct = sorted(set(arr))
    
    if len(distinct) < 2:
        return [-1]
    return [distinct[0], distinct[1]]
\`\`\`

## Time & Space Complexity

- **Single Pass Method**: O(n) time, O(1) space ⭐ BEST
- **Set + Sort Method**: O(n log n) time, O(n) space
- **Sorting Method**: O(n log n) time, O(1) space

## Key Points

1. Handle edge cases (array < 2 elements, all duplicates)
2. Ensure elements are distinct 
3. Update second only if new element is between first and second, and different from first
4. Return [-1] if no valid second smallest exists
`,
  topics: 'Array, Sorting, TCS NQT Prep',
  companies: 'TCS, Accenture, Cognizant',
};

async function addProblem() {
  try {
    logger.info('Adding "Find Smallest and Second Smallest" problem...');

    // Check if problem already exists
    const existing = await prisma.problem.findUnique({
      where: { slug: problem.slug },
    });

    if (existing) {
      logger.info('Problem already exists. Updating...');
      const updated = await prisma.problem.update({
        where: { slug: problem.slug },
        data: {
          title: problem.title,
          difficulty: problem.difficulty,
          statement: problem.statement,
          constraints: problem.constraints,
          inputFormat: problem.inputFormat,
          outputFormat: problem.outputFormat,
          timeLimit: problem.timeLimit,
          memoryLimit: problem.memoryLimit,
          starterCode: problem.starterCode,
          topics: problem.topics,
          companies: problem.companies,
        },
      });

      // Delete existing test cases
      await prisma.problemTestCase.deleteMany({
        where: { problemId: updated.id },
      });

      // Add new test cases
      for (const testCase of problem.testCases) {
        await prisma.problemTestCase.create({
          data: {
            problemId: updated.id,
            input: testCase.input,
            expectedOutput: testCase.output,
            isHidden: false,
          },
        });
      }

      logger.info(`✅ Problem updated successfully! Problem ID: ${updated.id}`);
      return updated;
    }

    // Create new problem
    const created = await prisma.problem.create({
      data: {
        title: problem.title,
        slug: problem.slug,
        difficulty: problem.difficulty,
        statement: problem.statement,
        constraints: problem.constraints,
        inputFormat: problem.inputFormat,
        outputFormat: problem.outputFormat,
        timeLimit: problem.timeLimit,
        memoryLimit: problem.memoryLimit,
        starterCode: problem.starterCode,
        topics: problem.topics,
        companies: problem.companies,
        referenceSolution: problem.referenceSolution,
      },
    });

    // Add test cases
    for (const testCase of problem.testCases) {
      await prisma.problemTestCase.create({
        data: {
          problemId: created.id,
          input: testCase.input,
          expectedOutput: testCase.output,
          isHidden: false,
        },
      });
    }

    logger.info(`✅ Problem created successfully! Problem ID: ${created.id}`);
    logger.info(`📊 Added ${problem.testCases.length} test cases`);
    return created;
  } catch (error) {
    logger.error('❌ Error adding problem:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

addProblem();
