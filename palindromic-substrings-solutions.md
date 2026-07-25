# Palindromic Substrings - Complete Solutions

## Problem Statement
Given a string `s`, return the number of palindromic substrings in it.

**Definitions:**
- A string is a **palindrome** when it reads the same backward as forward
- A **substring** is a contiguous sequence of characters within the string

## Examples

### Example 1:
**Input:** s = "abc"
**Output:** 3
**Explanation:** Three palindromic strings: "a", "b", "c".

### Example 2:
**Input:** s = "aaa"
**Output:** 6
**Explanation:** Six palindromic strings: "a", "a", "a", "aa", "aa", "aaa".

## Algorithm: Expand Around Center

### Approach:
The key insight is that every palindrome has a center. We can expand around each possible center and count palindromes.

**Two types of centers:**
1. **Odd-length palindromes:** Single character center (e.g., "aba")
2. **Even-length palindromes:** Gap between two characters (e.g., "abba")

**Steps:**
1. For each position i in string (0 to n-1):
   - Expand around i as center of odd-length palindrome
   - Expand around i and i+1 as center of even-length palindrome
2. While expanding, count each valid palindrome

### Time Complexity: O(n²)
### Space Complexity: O(1)

---

## Python Solution

```python
def count_palindromic_substrings(s):
    """
    Count all palindromic substrings using expand around center approach.
    
    Time: O(n²) - n centers, each expands up to n times
    Space: O(1) - no extra space except variables
    """
    def expand_around_center(left, right):
        """
        Helper function to expand around center and count palindromes.
        Returns count of palindromes found by expanding from this center.
        """
        count = 0
        while left >= 0 and right < len(s) and s[left] == s[right]:
            count += 1  # Found a palindrome
            left -= 1   # Expand left
            right += 1  # Expand right
        return count
    
    if not s:
        return 0
    
    total_count = 0
    
    # Check each position as potential center
    for i in range(len(s)):
        # Odd-length palindromes (single character center)
        total_count += expand_around_center(i, i)
        
        # Even-length palindromes (gap between two characters)
        total_count += expand_around_center(i, i + 1)
    
    return total_count


# Input reading
s = input().strip()

# Calculate and print result
result = count_palindromic_substrings(s)
print(result)
```

---

## JavaScript Solution

```javascript
function countPalindromicSubstrings(s) {
    /**
     * Count all palindromic substrings using expand around center approach.
     * 
     * Time: O(n²) - n centers, each expands up to n times
     * Space: O(1) - no extra space except variables
     */
    
    /**
     * Helper function to expand around center and count palindromes.
     * Returns count of palindromes found by expanding from this center.
     */
    function expandAroundCenter(left, right) {
        let count = 0;
        while (left >= 0 && right < s.length && s[left] === s[right]) {
            count++;     // Found a palindrome
            left--;      // Expand left
            right++;     // Expand right
        }
        return count;
    }
    
    if (!s || s.length === 0) {
        return 0;
    }
    
    let totalCount = 0;
    
    // Check each position as potential center
    for (let i = 0; i < s.length; i++) {
        // Odd-length palindromes (single character center)
        totalCount += expandAroundCenter(i, i);
        
        // Even-length palindromes (gap between two characters)
        totalCount += expandAroundCenter(i, i + 1);
    }
    
    return totalCount;
}

// Input reading
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (line) => {
    const s = line.trim();
    console.log(countPalindromicSubstrings(s));
    rl.close();
});
```

---

## Java Solution

```java
import java.util.*;

public class Solution {
    
    /**
     * Count all palindromic substrings using expand around center approach.
     * 
     * Time: O(n²) - n centers, each expands up to n times
     * Space: O(1) - no extra space except variables
     */
    public static int countPalindromicSubstrings(String s) {
        if (s == null || s.length() == 0) {
            return 0;
        }
        
        int totalCount = 0;
        
        // Check each position as potential center
        for (int i = 0; i < s.length(); i++) {
            // Odd-length palindromes (single character center)
            totalCount += expandAroundCenter(s, i, i);
            
            // Even-length palindromes (gap between two characters)
            totalCount += expandAroundCenter(s, i, i + 1);
        }
        
        return totalCount;
    }
    
    /**
     * Helper function to expand around center and count palindromes.
     * Returns count of palindromes found by expanding from this center.
     */
    private static int expandAroundCenter(String s, int left, int right) {
        int count = 0;
        
        while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {
            count++;     // Found a palindrome
            left--;      // Expand left
            right++;     // Expand right
        }
        
        return count;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine().trim();
        System.out.println(countPalindromicSubstrings(s));
        sc.close();
    }
}
```

---

## C++ Solution

```cpp
#include <iostream>
#include <string>
using namespace std;

/**
 * Helper function to expand around center and count palindromes.
 * Returns count of palindromes found by expanding from this center.
 */
int expandAroundCenter(const string& s, int left, int right) {
    int count = 0;
    
    while (left >= 0 && right < s.length() && s[left] == s[right]) {
        count++;     // Found a palindrome
        left--;      // Expand left
        right++;     // Expand right
    }
    
    return count;
}

/**
 * Count all palindromic substrings using expand around center approach.
 * 
 * Time: O(n²) - n centers, each expands up to n times
 * Space: O(1) - no extra space except variables
 */
int countPalindromicSubstrings(string s) {
    if (s.empty()) {
        return 0;
    }
    
    int totalCount = 0;
    
    // Check each position as potential center
    for (int i = 0; i < s.length(); i++) {
        // Odd-length palindromes (single character center)
        totalCount += expandAroundCenter(s, i, i);
        
        // Even-length palindromes (gap between two characters)
        totalCount += expandAroundCenter(s, i, i + 1);
    }
    
    return totalCount;
}

int main() {
    string s;
    getline(cin, s);
    cout << countPalindromicSubstrings(s) << endl;
    return 0;
}
```

---

## Algorithm Walkthrough

### Example: s = "aaa"

**Step 1: Check position 0 as center**
- Odd-length (center at 0):
  - "a" (0,0) ✓
  - "aaa" (expand: left=-1, right=3) ✓
  - Count: 2

- Even-length (center between 0 and 1):
  - "aa" (0,1) ✓
  - Can't expand further
  - Count: 1

**Step 2: Check position 1 as center**
- Odd-length (center at 1):
  - "a" (1,1) ✓
  - Can't expand (would make "aaa" but already counted differently)
  - Count: 1

- Even-length (center between 1 and 2):
  - "aa" (1,2) ✓
  - Can't expand further
  - Count: 1

**Step 3: Check position 2 as center**
- Odd-length (center at 2):
  - "a" (2,2) ✓
  - Can't expand further
  - Count: 1

- Even-length (center between 2 and 3):
  - Out of bounds
  - Count: 0

**Total: 2 + 1 + 1 + 1 + 1 + 0 = 6** ✓

---

## Test Cases

### Test Case 1
**Input:** `abc`
**Output:** `3`
**Explanation:** "a", "b", "c" - only single characters are palindromes

### Test Case 2
**Input:** `aaa`
**Output:** `6`
**Explanation:** 
- Single chars: "a" (pos 0), "a" (pos 1), "a" (pos 2) = 3
- Two chars: "aa" (0-1), "aa" (1-2) = 2
- Three chars: "aaa" (0-2) = 1
- Total: 6

### Test Case 3
**Input:** `a`
**Output:** `1`
**Explanation:** Single character is a palindrome

### Test Case 4
**Input:** `racecar`
**Output:** `10`
**Explanation:** 
- Single: r, a, c, e, c, a, r = 7
- Multi: cec, aceca, racecar = 3
- Total: 10

### Test Case 5
**Input:** `noon`
**Output:** `6`
**Explanation:**
- Single: n, o, o, n = 4
- Two: oo = 1
- Four: noon = 1
- Total: 6

---

## Key Points

1. **Two Types of Centers:**
   - Odd-length: single character (i, i)
   - Even-length: between characters (i, i+1)

2. **Expand Strategy:**
   - Start from center
   - Expand while characters match
   - Count each valid palindrome

3. **Why This Works:**
   - Every palindrome has a unique center
   - Expanding from center is efficient
   - No duplicate counting

4. **Edge Cases:**
   - Empty string → 0
   - Single character → 1
   - All same characters → n*(n+1)/2
   - No multi-char palindromes → n

5. **Optimization:**
   - O(1) space (no DP table needed)
   - O(n²) time (optimal for this problem)
   - Early termination when chars don't match

---

## Alternative: Dynamic Programming Approach

```python
def count_palindromic_substrings_dp(s):
    """
    Alternative DP approach.
    Time: O(n²), Space: O(n²)
    """
    n = len(s)
    if n == 0:
        return 0
    
    # dp[i][j] = True if s[i:j+1] is palindrome
    dp = [[False] * n for _ in range(n)]
    count = 0
    
    # Single characters are palindromes
    for i in range(n):
        dp[i][i] = True
        count += 1
    
    # Two characters
    for i in range(n - 1):
        if s[i] == s[i + 1]:
            dp[i][i + 1] = True
            count += 1
    
    # Three or more characters
    for length in range(3, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            if s[i] == s[j] and dp[i + 1][j - 1]:
                dp[i][j] = True
                count += 1
    
    return count
```

**Note:** Expand around center is preferred due to O(1) space complexity.

---

## Comparison with Related Problems

| Problem | Difference | Approach |
|---------|-----------|----------|
| **Palindromic Substrings** (This) | Count all palindromic substrings | Expand around center |
| **Longest Palindromic Substring** | Find THE longest one | Expand around center or DP |
| **Palindromic Subsequences** | Non-contiguous characters | Different DP approach |
| **Count Palindromic Subsequences** | Count palindromic sequences of length 5 | Suffix counting |

---

## LeetCode Stats

- **Problem Number:** 647
- **Difficulty:** Medium
- **Acceptance Rate:** 73.0%
- **Accepted:** 1,223,093 submissions
- **Companies:** Amazon, Microsoft, Google, Facebook, Apple, Bloomberg
