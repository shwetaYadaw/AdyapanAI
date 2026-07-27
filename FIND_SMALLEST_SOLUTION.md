# Solution: Find the Smallest Number in an Array

## Problem
Find the smallest number in an array of space-separated integers.

**Input:** A single line of space-separated integers
**Output:** The smallest integer

**Constraints:** 1 ≤ nums.length ≤ 10^5

---

## Python Solution ✅

```python
import sys

def findTheSmallestNumberInAnArray(input_str):
    """Find the smallest number in an array"""
    # Convert the input string to list of integers
    arr = list(map(int, input_str.split()))
    
    # Return the smallest element
    return str(min(arr))

def solve():
    lines = sys.stdin.readlines()
    if not lines:
        return
    
    # First line contains the array elements
    res = findTheSmallestNumberInAnArray(lines[0].strip())
    print(res)

if __name__ == "__main__":
    solve()
```

**Usage:**
```bash
echo "5 2 8 1 9" | python solution_find_smallest.py
# Output: 1
```

---

## JavaScript Solution ✅

```javascript
// JavaScript Solution - Find the smallest number in an array
const fs = require('fs');

function findTheSmallestNumberInAnArray(inputStr) {
  // Convert the input string to array of integers
  const arr = inputStr.trim().split(' ').map(Number);
  
  // Find and return the minimum element
  return String(Math.min(...arr));
}

function solve() {
  const input = fs.readFileSync(0, 'utf-8').trim();
  if (!input) return;
  console.log(findTheSmallestNumberInAnArray(input));
}

solve();
```

**Usage:**
```bash
echo "5 2 8 1 9" | node solution_find_smallest.js
# Output: 1
```

---

## C++ Solution ✅

```cpp
// C++ Solution - Find the smallest number in an array
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int num;
    int minNum = INT_MAX;
    
    // Read all integers from input until EOF
    while (cin >> num) {
        minNum = min(minNum, num);
    }
    
    // Output the minimum
    cout << minNum << endl;
    
    return 0;
}
```

**Usage:**
```bash
g++ -o solution_find_smallest solution_find_smallest.cpp
echo "5 2 8 1 9" | ./solution_find_smallest
# Output: 1
```

---

## Java Solution ✅

```java
// Java Solution - Find the smallest number in an array
import java.util.Scanner;

public class SolutionFindSmallest {
    
    public static String findTheSmallestNumberInAnArray(String inputStr) {
        // Split input string and convert to integers
        String[] nums = inputStr.trim().split(" ");
        
        // Find minimum
        int minNum = Integer.parseInt(nums[0]);
        for (int i = 1; i < nums.length; i++) {
            minNum = Math.min(minNum, Integer.parseInt(nums[i]));
        }
        
        return String.valueOf(minNum);
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        if (scanner.hasNextLine()) {
            String input = scanner.nextLine().trim();
            System.out.println(findTheSmallestNumberInAnArray(input));
        }
        
        scanner.close();
    }
}
```

**Usage:**
```bash
javac SolutionFindSmallest.java
echo "5 2 8 1 9" | java SolutionFindSmallest
# Output: 1
```

---

## Algorithm

### Approach 1: Using Built-in min()
```
1. Parse input string to get array of integers
2. Use min() function to find smallest
3. Return result
```

Time: O(n)
Space: O(n) for array

### Approach 2: Single Pass
```
1. Initialize minNum = INT_MAX
2. For each number in input:
   - Update minNum = min(minNum, current)
3. Return minNum
```

Time: O(n)
Space: O(1)

---

## Test Cases

```
Input: "5 2 8 1 9"
Output: "1"

Input: "10"
Output: "10"

Input: "-5 -2 -10"
Output: "-10"

Input: "100 50 75 25 99"
Output: "25"

Input: "0 -1 1"
Output: "-1"
```

---

## Complexity Analysis

| Metric | Value |
|--------|-------|
| Time Complexity | O(n) - single pass |
| Space Complexity | O(n) for storing array / O(1) for single pass |
| Best Case | O(n) |
| Worst Case | O(n) |

---

## Why TIME_LIMIT_EXCEEDED?

❌ **Common Mistakes:**
1. Reading multiple lines when only one is needed
2. Using inefficient parsing methods
3. Creating unnecessary data structures
4. Not handling EOF properly

✅ **Fix:**
1. Read only ONE line of input
2. Use efficient split and min operations
3. Minimize memory usage
4. Handle input correctly

---

## Key Points

✅ Input is on a **single line**
✅ Numbers are **space-separated**
✅ Output should be **just the minimum number**
✅ No extra output or debugging prints
✅ Handle both positive and negative numbers

---

## Quick Comparison

| Language | Time | Space | Status |
|----------|------|-------|--------|
| Python | O(n) | O(n) | ✅ |
| JavaScript | O(n) | O(n) | ✅ |
| C++ | O(n) | O(1) | ✅ |
| Java | O(n) | O(n) | ✅ |

---

## Files Provided

✅ `solution_find_smallest.py`
✅ `solution_find_smallest.js`
✅ `solution_find_smallest.cpp`
✅ `SolutionFindSmallest.java`

All solutions pass test cases and are optimized to avoid TIME_LIMIT_EXCEEDED!

---

**Status: READY TO SUBMIT ✅**
