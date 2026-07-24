# Smallest Window in a String - Complete Solutions

## Problem Statement
Given two strings `s` and `p`, find the smallest substring in `s` that contains all characters of `p`, including duplicates.

**Requirements:**
- If no such substring exists, return ""
- If multiple substrings of the same length are found, return the one with the smallest starting index
- Must contain ALL characters from `p`, including duplicates

## Examples

### Example 1:
**Input:** s = "timetopractice", p = "toc"
**Output:** "toprac"
**Explanation:** "toprac" is the smallest substring in which "toc" can be found.

### Example 2:
**Input:** s = "zoomlazapzo", p = "oza"
**Output:** "apzo"
**Explanation:** "apzo" is the smallest substring in which "oza" can be found.

## Algorithm: Sliding Window with Two Hash Maps

### Approach:
1. Create a frequency map for pattern `p`
2. Use two pointers (left, right) for the sliding window
3. Expand window by moving right pointer
4. When all characters are found, contract from left
5. Track minimum window

### Time Complexity: O(|s| + |p|)
### Space Complexity: O(|p|)

---

## Python Solution

```python
def smallest_window(s, p):
    """
    Find the smallest window in s that contains all characters of p.
    Uses sliding window technique with hash maps.
    
    Time: O(|s| + |p|)
    Space: O(|p|)
    """
    if not s or not p or len(s) < len(p):
        return ""
    
    # Create frequency map for pattern
    pattern_freq = {}
    for char in p:
        pattern_freq[char] = pattern_freq.get(char, 0) + 1
    
    # Sliding window variables
    left = 0
    min_len = float('inf')
    min_start = 0
    required = len(pattern_freq)  # Unique characters needed
    formed = 0  # Unique characters matched with desired frequency
    
    # Window frequency map
    window_freq = {}
    
    for right in range(len(s)):
        # Add character from right
        char = s[right]
        window_freq[char] = window_freq.get(char, 0) + 1
        
        # Check if frequency matches for this character
        if char in pattern_freq and window_freq[char] == pattern_freq[char]:
            formed += 1
        
        # Try to contract window from left
        while left <= right and formed == required:
            char = s[left]
            
            # Update minimum window if current is smaller
            if right - left + 1 < min_len:
                min_len = right - left + 1
                min_start = left
            
            # Remove leftmost character
            window_freq[char] -= 1
            if char in pattern_freq and window_freq[char] < pattern_freq[char]:
                formed -= 1
            
            left += 1
    
    # Return result
    if min_len == float('inf'):
        return ""
    return s[min_start:min_start + min_len]


# Input reading
s = input().strip()
p = input().strip()

# Find and print result
result = smallest_window(s, p)
print(result)
```

---

## JavaScript Solution

```javascript
function smallestWindow(s, p) {
    /**
     * Find the smallest window in s that contains all characters of p.
     * Uses sliding window technique with hash maps.
     * 
     * Time: O(|s| + |p|)
     * Space: O(|p|)
     */
    if (!s || !p || s.length < p.length) {
        return "";
    }
    
    // Create frequency map for pattern
    const patternFreq = {};
    for (const char of p) {
        patternFreq[char] = (patternFreq[char] || 0) + 1;
    }
    
    // Sliding window variables
    let left = 0;
    let minLen = Infinity;
    let minStart = 0;
    const required = Object.keys(patternFreq).length;
    let formed = 0;
    
    // Window frequency map
    const windowFreq = {};
    
    for (let right = 0; right < s.length; right++) {
        // Add character from right
        const char = s[right];
        windowFreq[char] = (windowFreq[char] || 0) + 1;
        
        // Check if frequency matches for this character
        if (char in patternFreq && windowFreq[char] === patternFreq[char]) {
            formed++;
        }
        
        // Try to contract window from left
        while (left <= right && formed === required) {
            const leftChar = s[left];
            
            // Update minimum window if current is smaller
            if (right - left + 1 < minLen) {
                minLen = right - left + 1;
                minStart = left;
            }
            
            // Remove leftmost character
            windowFreq[leftChar]--;
            if (leftChar in patternFreq && windowFreq[leftChar] < patternFreq[leftChar]) {
                formed--;
            }
            
            left++;
        }
    }
    
    // Return result
    if (minLen === Infinity) {
        return "";
    }
    return s.substring(minStart, minStart + minLen);
}

// Input reading
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const lines = [];
rl.on('line', (line) => {
    lines.push(line);
    if (lines.length === 2) {
        const s = lines[0].trim();
        const p = lines[1].trim();
        console.log(smallestWindow(s, p));
        rl.close();
    }
});
```

---

## Java Solution

```java
import java.util.*;

public class Solution {
    
    /**
     * Find the smallest window in s that contains all characters of p.
     * Uses sliding window technique with hash maps.
     * 
     * Time: O(|s| + |p|)
     * Space: O(|p|)
     */
    public static String smallestWindow(String s, String p) {
        if (s == null || p == null || s.length() < p.length()) {
            return "";
        }
        
        // Create frequency map for pattern
        Map<Character, Integer> patternFreq = new HashMap<>();
        for (char c : p.toCharArray()) {
            patternFreq.put(c, patternFreq.getOrDefault(c, 0) + 1);
        }
        
        // Sliding window variables
        int left = 0;
        int minLen = Integer.MAX_VALUE;
        int minStart = 0;
        int required = patternFreq.size();
        int formed = 0;
        
        // Window frequency map
        Map<Character, Integer> windowFreq = new HashMap<>();
        
        for (int right = 0; right < s.length(); right++) {
            // Add character from right
            char c = s.charAt(right);
            windowFreq.put(c, windowFreq.getOrDefault(c, 0) + 1);
            
            // Check if frequency matches for this character
            if (patternFreq.containsKey(c) && 
                windowFreq.get(c).intValue() == patternFreq.get(c).intValue()) {
                formed++;
            }
            
            // Try to contract window from left
            while (left <= right && formed == required) {
                char leftChar = s.charAt(left);
                
                // Update minimum window if current is smaller
                if (right - left + 1 < minLen) {
                    minLen = right - left + 1;
                    minStart = left;
                }
                
                // Remove leftmost character
                windowFreq.put(leftChar, windowFreq.get(leftChar) - 1);
                if (patternFreq.containsKey(leftChar) && 
                    windowFreq.get(leftChar) < patternFreq.get(leftChar)) {
                    formed--;
                }
                
                left++;
            }
        }
        
        // Return result
        if (minLen == Integer.MAX_VALUE) {
            return "";
        }
        return s.substring(minStart, minStart + minLen);
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine().trim();
        String p = sc.nextLine().trim();
        System.out.println(smallestWindow(s, p));
        sc.close();
    }
}
```

---

## C++ Solution

```cpp
#include <iostream>
#include <string>
#include <unordered_map>
#include <climits>
using namespace std;

/**
 * Find the smallest window in s that contains all characters of p.
 * Uses sliding window technique with hash maps.
 * 
 * Time: O(|s| + |p|)
 * Space: O(|p|)
 */
string smallestWindow(string s, string p) {
    if (s.empty() || p.empty() || s.length() < p.length()) {
        return "";
    }
    
    // Create frequency map for pattern
    unordered_map<char, int> patternFreq;
    for (char c : p) {
        patternFreq[c]++;
    }
    
    // Sliding window variables
    int left = 0;
    int minLen = INT_MAX;
    int minStart = 0;
    int required = patternFreq.size();
    int formed = 0;
    
    // Window frequency map
    unordered_map<char, int> windowFreq;
    
    for (int right = 0; right < s.length(); right++) {
        // Add character from right
        char c = s[right];
        windowFreq[c]++;
        
        // Check if frequency matches for this character
        if (patternFreq.count(c) && windowFreq[c] == patternFreq[c]) {
            formed++;
        }
        
        // Try to contract window from left
        while (left <= right && formed == required) {
            char leftChar = s[left];
            
            // Update minimum window if current is smaller
            if (right - left + 1 < minLen) {
                minLen = right - left + 1;
                minStart = left;
            }
            
            // Remove leftmost character
            windowFreq[leftChar]--;
            if (patternFreq.count(leftChar) && windowFreq[leftChar] < patternFreq[leftChar]) {
                formed--;
            }
            
            left++;
        }
    }
    
    // Return result
    if (minLen == INT_MAX) {
        return "";
    }
    return s.substr(minStart, minLen);
}

int main() {
    string s, p;
    getline(cin, s);
    getline(cin, p);
    cout << smallestWindow(s, p) << endl;
    return 0;
}
```

---

## Test Cases

### Test Case 1
**Input:**
```
timetopractice
toc
```
**Output:** `toprac`
**Explanation:** "toprac" contains t, o, c and is the smallest such substring

### Test Case 2
**Input:**
```
zoomlazapzo
oza
```
**Output:** `apzo`
**Explanation:** "apzo" contains o, z, a and is the smallest

### Test Case 3
**Input:**
```
ADOBECODEBANC
ABC
```
**Output:** `BANC`
**Explanation:** Classic LeetCode #76 example

### Test Case 4
**Input:**
```
a
aa
```
**Output:** `` (empty string)
**Explanation:** Pattern requires 2 'a's but string has only 1

### Test Case 5
**Input:**
```
ab
b
```
**Output:** `b`
**Explanation:** Single character "b" is the minimum window

---

## Key Points

1. **Two Hash Maps Approach**: 
   - `patternFreq`: Stores required character frequencies
   - `windowFreq`: Stores current window character frequencies

2. **Two Counters**:
   - `required`: Number of unique characters needed
   - `formed`: Number of unique characters with correct frequency in window

3. **Window Management**:
   - Expand: Add characters from right
   - Contract: Remove characters from left when all chars found
   - Track minimum window during contraction

4. **Edge Cases**:
   - Empty strings
   - Pattern longer than string
   - No valid window exists
   - Pattern with duplicate characters

5. **Optimization**:
   - Only track characters that exist in pattern
   - Contract window as soon as all characters found
   - Early termination if no solution possible
