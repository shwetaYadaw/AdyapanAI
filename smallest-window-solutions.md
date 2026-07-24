# Smallest Window in a String - Complete Solutions

## Problem Statement

Given two strings `s` and `p`, find the smallest substring in `s` that contains all characters of `p`, including duplicates.

**Requirements:**
- If no such substring exists, return ""
- If multiple substrings of same length exist, return the one with smallest starting index
- Must contain ALL characters from p, including duplicates

---

## Examples

### Example 1:
```
Input:
s = "timetopractice"
p = "toc"

Output:
toprac

Explanation:
"toprac" contains 't', 'o', 'c' and is the smallest such substring
```

### Example 2:
```
Input:
s = "zoomlazapzo"
p = "oza"

Output:
apzo

Explanation:
"apzo" contains 'o', 'z', 'a' and is the smallest window
```

### Example 3:
```
Input:
s = "ADOBECODEBANC"
p = "ABC"

Output:
BANC

Explanation:
"BANC" is the minimum window containing 'A', 'B', 'C'
```

---

## Algorithm: Sliding Window with Hash Maps

### Key Concepts:

1. **Two Pointers**: Maintain window using `left` and `right` pointers
2. **Frequency Map**: Track character counts needed from pattern
3. **Expand**: Move `right` to include more characters
4. **Contract**: Move `left` to minimize window size
5. **Valid Window**: When all pattern characters are in current window

### Steps:

1. Create frequency map of pattern characters
2. Use `left` and `right` pointers, both starting at 0
3. Expand window by moving `right`, add characters to window
4. When window is valid (contains all pattern chars):
   - Try to contract from left to minimize
   - Update minimum window if smaller found
5. Continue until `right` reaches end of string

---

## Python Solution (Complete & Working)

```python
def smallest_window(s, p):
    """
    Find smallest window in s containing all characters of p.
    Time: O(|s| + |p|), Space: O(|p|)
    """
    if not s or not p or len(s) < len(p):
        return ""
    
    # Frequency map for pattern
    pattern_count = {}
    for char in p:
        pattern_count[char] = pattern_count.get(char, 0) + 1
    
    # Variables for sliding window
    required = len(pattern_count)  # Unique characters needed
    formed = 0  # Unique characters formed in current window
    
    # Window counts
    window_counts = {}
    
    # Result tracking
    min_len = float('inf')
    min_left = 0
    
    # Two pointers
    left = 0
    
    for right in range(len(s)):
        # Expand window by adding character at right
        char = s[right]
        window_counts[char] = window_counts.get(char, 0) + 1
        
        # Check if this character's frequency matches requirement
        if char in pattern_count and window_counts[char] == pattern_count[char]:
            formed += 1
        
        # Try to contract window from left
        while left <= right and formed == required:
            # Update result if current window is smaller
            if right - left + 1 < min_len:
                min_len = right - left + 1
                min_left = left
            
            # Remove character from left
            char = s[left]
            window_counts[char] -= 1
            if char in pattern_count and window_counts[char] < pattern_count[char]:
                formed -= 1
            
            left += 1
    
    # Return result
    if min_len == float('inf'):
        return ""
    return s[min_left:min_left + min_len]


# Main execution
if __name__ == "__main__":
    # Input reading
    s = input().strip()
    p = input().strip()
    
    # Find and print result
    result = smallest_window(s, p)
    print(result)
```

---

## JavaScript/Node.js Solution

```javascript
function smallestWindow(s, p) {
    /**
     * Find smallest window in s containing all characters of p.
     * Time: O(|s| + |p|), Space: O(|p|)
     */
    if (!s || !p || s.length < p.length) {
        return "";
    }
    
    // Frequency map for pattern
    const patternCount = {};
    for (const char of p) {
        patternCount[char] = (patternCount[char] || 0) + 1;
    }
    
    // Variables for sliding window
    const required = Object.keys(patternCount).length;
    let formed = 0;
    
    // Window counts
    const windowCounts = {};
    
    // Result tracking
    let minLen = Infinity;
    let minLeft = 0;
    
    // Two pointers
    let left = 0;
    
    for (let right = 0; right < s.length; right++) {
        // Expand window
        const char = s[right];
        windowCounts[char] = (windowCounts[char] || 0) + 1;
        
        // Check if frequency matches
        if (patternCount[char] && windowCounts[char] === patternCount[char]) {
            formed++;
        }
        
        // Contract window
        while (left <= right && formed === required) {
            // Update result
            if (right - left + 1 < minLen) {
                minLen = right - left + 1;
                minLeft = left;
            }
            
            // Remove from left
            const leftChar = s[left];
            windowCounts[leftChar]--;
            if (patternCount[leftChar] && windowCounts[leftChar] < patternCount[leftChar]) {
                formed--;
            }
            
            left++;
        }
    }
    
    // Return result
    return minLen === Infinity ? "" : s.substring(minLeft, minLeft + minLen);
}

// Main execution
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

public class SmallestWindow {
    
    /**
     * Find smallest window in s containing all characters of p.
     * Time: O(|s| + |p|), Space: O(|p|)
     */
    public static String smallestWindow(String s, String p) {
        if (s == null || p == null || s.length() < p.length()) {
            return "";
        }
        
        // Frequency map for pattern
        Map<Character, Integer> patternCount = new HashMap<>();
        for (char c : p.toCharArray()) {
            patternCount.put(c, patternCount.getOrDefault(c, 0) + 1);
        }
        
        // Variables for sliding window
        int required = patternCount.size();
        int formed = 0;
        
        // Window counts
        Map<Character, Integer> windowCounts = new HashMap<>();
        
        // Result tracking
        int minLen = Integer.MAX_VALUE;
        int minLeft = 0;
        
        // Two pointers
        int left = 0;
        
        for (int right = 0; right < s.length(); right++) {
            // Expand window
            char c = s.charAt(right);
            windowCounts.put(c, windowCounts.getOrDefault(c, 0) + 1);
            
            // Check if frequency matches
            if (patternCount.containsKey(c) && 
                windowCounts.get(c).equals(patternCount.get(c))) {
                formed++;
            }
            
            // Contract window
            while (left <= right && formed == required) {
                // Update result
                if (right - left + 1 < minLen) {
                    minLen = right - left + 1;
                    minLeft = left;
                }
                
                // Remove from left
                char leftChar = s.charAt(left);
                windowCounts.put(leftChar, windowCounts.get(leftChar) - 1);
                if (patternCount.containsKey(leftChar) && 
                    windowCounts.get(leftChar) < patternCount.get(leftChar)) {
                    formed--;
                }
                
                left++;
            }
        }
        
        // Return result
        return minLen == Integer.MAX_VALUE ? "" : s.substring(minLeft, minLeft + minLen);
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
 * Find smallest window in s containing all characters of p.
 * Time: O(|s| + |p|), Space: O(|p|)
 */
string smallestWindow(string s, string p) {
    if (s.empty() || p.empty() || s.length() < p.length()) {
        return "";
    }
    
    // Frequency map for pattern
    unordered_map<char, int> patternCount;
    for (char c : p) {
        patternCount[c]++;
    }
    
    // Variables for sliding window
    int required = patternCount.size();
    int formed = 0;
    
    // Window counts
    unordered_map<char, int> windowCounts;
    
    // Result tracking
    int minLen = INT_MAX;
    int minLeft = 0;
    
    // Two pointers
    int left = 0;
    
    for (int right = 0; right < s.length(); right++) {
        // Expand window
        char c = s[right];
        windowCounts[c]++;
        
        // Check if frequency matches
        if (patternCount.count(c) && windowCounts[c] == patternCount[c]) {
            formed++;
        }
        
        // Contract window
        while (left <= right && formed == required) {
            // Update result
            if (right - left + 1 < minLen) {
                minLen = right - left + 1;
                minLeft = left;
            }
            
            // Remove from left
            char leftChar = s[left];
            windowCounts[leftChar]--;
            if (patternCount.count(leftChar) && 
                windowCounts[leftChar] < patternCount[leftChar]) {
                formed--;
            }
            
            left++;
        }
    }
    
    // Return result
    return minLen == INT_MAX ? "" : s.substr(minLeft, minLen);
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

## Test Cases with Detailed Walkthrough

### Test Case 1:
```
Input:
timetopractice
toc

Output:
toprac

Walkthrough:
Pattern needs: {t:1, o:1, c:1}

Windows checked:
- "timetop" ✓ has all, length 7
- "toprac" ✓ has all, length 6 ← MINIMUM
```

### Test Case 2:
```
Input:
zoomlazapzo
oza

Output:
apzo

Walkthrough:
Pattern needs: {o:1, z:1, a:1}

Windows checked:
- "omlaza" ✓ has all, length 6
- "azapzo" ✓ has all, length 6
- "apzo" ✓ has all, length 4 ← MINIMUM
```

### Test Case 3:
```
Input:
ADOBECODEBANC
ABC

Output:
BANC

Walkthrough:
Pattern needs: {A:1, B:1, C:1}

Windows checked:
- "ADOBEC" ✓ has all, length 6
- "ODEBANC" ✓ has all, length 7
- "BANC" ✓ has all, length 4 ← MINIMUM
```

### Test Case 4:
```
Input:
a
aa

Output:
(empty string)

Explanation:
Pattern needs 2 'a's but string has only 1
No valid window exists
```

### Test Case 5:
```
Input:
ab
b

Output:
b

Explanation:
Single character "b" is the minimum window
```

---

## Complexity Analysis

### Time Complexity: O(|s| + |p|)
- Building pattern frequency map: O(|p|)
- Sliding window traversal: O(|s|)
  - Each character visited at most twice (once by right, once by left)
- Total: O(|s| + |p|)

### Space Complexity: O(|p|)
- Pattern frequency map: O(unique chars in p)
- Window frequency map: O(unique chars in p)
- Result tracking: O(1)
- Total: O(|p|)

---

## Algorithm Visualization

### Example: s = "ADOBECODEBANC", p = "ABC"

```
Step 1: Build pattern map
Pattern: {A:1, B:1, C:1}
Required: 3 unique chars

Step 2: Expand window until valid
Left=0, Right moves →
ADOBEC ✓ Valid window (has A, B, C)

Step 3: Contract from left
DOBEC ✗ Missing A
Back to expansion

Step 4: Continue process
...
BANC ✓ Valid window, length 4
← MINIMUM FOUND
```

---

## Key Points to Remember

1. **Two Hash Maps**: One for pattern, one for current window
2. **Formed Counter**: Tracks how many unique chars have required frequency
3. **Valid Window**: When `formed == required`
4. **Contract Strategy**: Always try to minimize when window is valid
5. **Result Update**: Only update when finding smaller valid window

---

## Common Mistakes to Avoid

❌ Not handling duplicates in pattern  
❌ Forgetting to track minimum starting index  
❌ Not contracting window when valid  
❌ Incorrect frequency comparison  
❌ Not handling empty result case  
❌ Off-by-one errors in substring extraction  

---

## Interview Tips

1. **Clarify Requirements**: Ask about duplicates, case sensitivity
2. **Edge Cases**: Empty strings, no valid window, pattern longer than string
3. **Optimization**: Explain why two hash maps are needed
4. **Follow-up**: What if we want all minimum windows, not just one?

---

## Applications

- **Text Processing**: Finding relevant text snippets
- **Search Engines**: Query matching in documents
- **DNA Sequencing**: Finding gene patterns
- **Data Compression**: Pattern detection
- **Spell Checkers**: Finding word suggestions

---

## Related Problems

- **Longest Substring Without Repeating Characters**
- **Substring with Concatenation of All Words**
- **Minimum Window Subsequence**
- **Find All Anagrams in a String**

---

## References

- **LeetCode #76**: Minimum Window Substring (Hard)
- **Pattern**: Sliding Window + Hash Table
- **Companies**: Amazon, Google, Microsoft, Facebook, Uber

