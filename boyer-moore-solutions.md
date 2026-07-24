# Boyer Moore Algorithm for Pattern Searching - Complete Solutions

## Problem Statement

Pattern searching is an important problem in computer science. When we do search for a string in a notepad/word file, browser, or database, pattern searching algorithms are used to show the search results.

**Given:**
- Text: `txt[0..n-1]` of length n
- Pattern: `pat[0..m-1]` of length m
- Assume: n > m

**Task:** Find all occurrences of pattern in text and print their indices.

---

## Examples

### Example 1:
```
Input:
txt = "THIS IS A TEST TEXT"
pat = "TEST"

Output:
Pattern found at index 10
```

### Example 2:
```
Input:
txt = "AABAACAADAABAABA"
pat = "AABA"

Output:
Pattern found at index 0
Pattern found at index 9
Pattern found at index 12
```

---

## Algorithm Explanation

### Boyer Moore Algorithm

The Boyer Moore algorithm is one of the most efficient string searching algorithms. It scans the pattern from **right to left** but shifts the pattern from **left to right**.

**Key Concepts:**

1. **Bad Character Heuristic**
   - When a mismatch occurs, look at the character in text that caused mismatch
   - Shift the pattern to align this character with its rightmost occurrence in pattern
   - If character doesn't exist in pattern, shift pattern completely past it

2. **Good Suffix Heuristic** (Advanced)
   - When a suffix of pattern matches, but a mismatch occurs
   - Shift pattern to align the matched suffix with its previous occurrence

For simplicity, we'll implement the **Bad Character Heuristic** which gives good performance.

---

## Python Solution (Complete & Working)

```python
def bad_char_heuristic(pattern):
    """
    Preprocessing for bad character heuristic.
    Returns a dictionary with last occurrence index of each character in pattern.
    """
    bad_char = {}
    m = len(pattern)
    
    # Fill the table with last occurrence of each character
    for i in range(m):
        bad_char[pattern[i]] = i
    
    return bad_char


def boyer_moore_search(txt, pat):
    """
    Search for pattern in text using Boyer Moore algorithm (Bad Character Heuristic).
    Prints all occurrences.
    """
    n = len(txt)
    m = len(pat)
    
    if m > n:
        print("Pattern not found")
        return
    
    # Preprocess pattern
    bad_char = bad_char_heuristic(pat)
    
    found = False
    s = 0  # Shift of the pattern with respect to text
    
    while s <= n - m:
        j = m - 1  # Start from rightmost character of pattern
        
        # Keep matching characters from right to left
        while j >= 0 and pat[j] == txt[s + j]:
            j -= 1
        
        # If pattern is found at current shift
        if j < 0:
            print(f"Pattern found at index {s}")
            found = True
            
            # Shift pattern to align next character in text with its last occurrence in pattern
            # If next character doesn't exist, shift by m
            if s + m < n:
                s += m - bad_char.get(txt[s + m], -1)
            else:
                s += 1
        else:
            # Mismatch occurred
            # Shift pattern to align bad character with its last occurrence
            bad_char_pos = bad_char.get(txt[s + j], -1)
            s += max(1, j - bad_char_pos)
    
    if not found:
        print("Pattern not found")


# Main execution
if __name__ == "__main__":
    # Input reading
    txt = input().strip()
    pat = input().strip()
    
    # Search for pattern
    boyer_moore_search(txt, pat)
```

---

## JavaScript/Node.js Solution

```javascript
function badCharHeuristic(pattern) {
    /**
     * Preprocessing for bad character heuristic.
     * Returns an object with last occurrence index of each character.
     */
    const badChar = {};
    const m = pattern.length;
    
    for (let i = 0; i < m; i++) {
        badChar[pattern[i]] = i;
    }
    
    return badChar;
}

function boyerMooreSearch(txt, pat) {
    /**
     * Search for pattern in text using Boyer Moore algorithm.
     * Prints all occurrences.
     */
    const n = txt.length;
    const m = pat.length;
    
    if (m > n) {
        console.log("Pattern not found");
        return;
    }
    
    // Preprocess pattern
    const badChar = badCharHeuristic(pat);
    
    let found = false;
    let s = 0; // Shift of pattern with respect to text
    
    while (s <= n - m) {
        let j = m - 1; // Start from rightmost character
        
        // Keep matching from right to left
        while (j >= 0 && pat[j] === txt[s + j]) {
            j--;
        }
        
        // Pattern found at current shift
        if (j < 0) {
            console.log(`Pattern found at index ${s}`);
            found = true;
            
            // Shift pattern
            if (s + m < n) {
                const nextChar = txt[s + m];
                s += m - (badChar[nextChar] !== undefined ? badChar[nextChar] : -1);
            } else {
                s++;
            }
        } else {
            // Mismatch - shift pattern
            const badCharPos = badChar[txt[s + j]] !== undefined ? badChar[txt[s + j]] : -1;
            s += Math.max(1, j - badCharPos);
        }
    }
    
    if (!found) {
        console.log("Pattern not found");
    }
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
        const txt = lines[0].trim();
        const pat = lines[1].trim();
        boyerMooreSearch(txt, pat);
        rl.close();
    }
});
```

---

## Java Solution

```java
import java.util.*;

public class BoyerMoore {
    
    /**
     * Preprocessing for bad character heuristic.
     * Returns array where index represents ASCII value and value is last occurrence.
     */
    public static int[] badCharHeuristic(String pattern) {
        int m = pattern.length();
        int[] badChar = new int[256]; // ASCII size
        
        // Initialize all occurrences as -1
        Arrays.fill(badChar, -1);
        
        // Fill the actual value of last occurrence
        for (int i = 0; i < m; i++) {
            badChar[(int) pattern.charAt(i)] = i;
        }
        
        return badChar;
    }
    
    /**
     * Search for pattern in text using Boyer Moore algorithm.
     */
    public static void boyerMooreSearch(String txt, String pat) {
        int n = txt.length();
        int m = pat.length();
        
        if (m > n) {
            System.out.println("Pattern not found");
            return;
        }
        
        // Preprocess pattern
        int[] badChar = badCharHeuristic(pat);
        
        boolean found = false;
        int s = 0; // Shift of pattern with respect to text
        
        while (s <= n - m) {
            int j = m - 1; // Start from rightmost character
            
            // Keep matching from right to left
            while (j >= 0 && pat.charAt(j) == txt.charAt(s + j)) {
                j--;
            }
            
            // Pattern found at current shift
            if (j < 0) {
                System.out.println("Pattern found at index " + s);
                found = true;
                
                // Shift pattern
                if (s + m < n) {
                    s += m - badChar[(int) txt.charAt(s + m)];
                } else {
                    s++;
                }
            } else {
                // Mismatch - shift pattern
                s += Math.max(1, j - badChar[(int) txt.charAt(s + j)]);
            }
        }
        
        if (!found) {
            System.out.println("Pattern not found");
        }
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String txt = sc.nextLine().trim();
        String pat = sc.nextLine().trim();
        boyerMooreSearch(txt, pat);
        sc.close();
    }
}
```

---

## C++ Solution

```cpp
#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

/**
 * Preprocessing for bad character heuristic.
 * Returns array where index represents ASCII value and value is last occurrence.
 */
vector<int> badCharHeuristic(string pattern) {
    int m = pattern.length();
    vector<int> badChar(256, -1); // ASCII size, initialize with -1
    
    // Fill the actual value of last occurrence
    for (int i = 0; i < m; i++) {
        badChar[(int) pattern[i]] = i;
    }
    
    return badChar;
}

/**
 * Search for pattern in text using Boyer Moore algorithm.
 */
void boyerMooreSearch(string txt, string pat) {
    int n = txt.length();
    int m = pat.length();
    
    if (m > n) {
        cout << "Pattern not found" << endl;
        return;
    }
    
    // Preprocess pattern
    vector<int> badChar = badCharHeuristic(pat);
    
    bool found = false;
    int s = 0; // Shift of pattern with respect to text
    
    while (s <= n - m) {
        int j = m - 1; // Start from rightmost character
        
        // Keep matching from right to left
        while (j >= 0 && pat[j] == txt[s + j]) {
            j--;
        }
        
        // Pattern found at current shift
        if (j < 0) {
            cout << "Pattern found at index " << s << endl;
            found = true;
            
            // Shift pattern
            if (s + m < n) {
                s += m - badChar[(int) txt[s + m]];
            } else {
                s++;
            }
        } else {
            // Mismatch - shift pattern
            s += max(1, j - badChar[(int) txt[s + j]]);
        }
    }
    
    if (!found) {
        cout << "Pattern not found" << endl;
    }
}

int main() {
    string txt, pat;
    getline(cin, txt);
    getline(cin, pat);
    
    boyerMooreSearch(txt, pat);
    
    return 0;
}
```

---

## Test Cases with Expected Output

### Test Case 1:
```
Input:
THIS IS A TEST TEXT
TEST

Output:
Pattern found at index 10
```

### Test Case 2:
```
Input:
AABAACAADAABAABA
AABA

Output:
Pattern found at index 0
Pattern found at index 9
Pattern found at index 12
```

### Test Case 3:
```
Input:
ABCDEFGH
XYZ

Output:
Pattern not found
```

### Test Case 4:
```
Input:
ABABABABAB
ABAB

Output:
Pattern found at index 0
Pattern found at index 2
Pattern found at index 4
Pattern found at index 6
```

### Test Case 5:
```
Input:
GEEKSFORGEEKS
GEEKS

Output:
Pattern found at index 0
Pattern found at index 8
```

---

## Complexity Analysis

### Time Complexity:
- **Best Case**: O(n/m) - When pattern doesn't match, we can skip m characters
- **Worst Case**: O(n*m) - When all characters of text and pattern are same
- **Average Case**: O(n) - Generally performs well in practice

### Space Complexity:
- O(m + σ) where σ is the size of alphabet (256 for ASCII)
- Space for bad character table

---

## How the Algorithm Works - Step by Step

### Example: Find "AABA" in "AABAACAADAABAABA"

```
Step 1: Align pattern at start
Text:    A A B A A C A A D A A B A A B A
Pattern: A A B A
         ↑ Match from right to left
Match found at index 0!

Step 2: Shift pattern
Text:    A A B A A C A A D A A B A A B A
Pattern:     A A B A
             ↑ No match at position 3
             
Step 3: Bad character heuristic
Text character 'A' exists in pattern at position 3
Shift = j - badChar['A'] = 3 - 3 = 0, use max(1, 0) = 1

... continues until all matches found
```

---

## Key Points to Remember

1. **Scan Right to Left**: Pattern is matched from right to left
2. **Shift Left to Right**: Pattern shifts from left to right in text
3. **Bad Character**: Use last occurrence of mismatched character
4. **Efficient**: Can skip large portions of text
5. **Best for**: Large alphabets and random texts

---

## Common Mistakes to Avoid

❌ Matching from left to right (defeats the purpose)
❌ Not handling pattern longer than text
❌ Forgetting to use max(1, shift) to avoid infinite loop
❌ Not printing "Pattern not found" when no match exists
❌ Off-by-one errors in array indexing

---

## Applications

- **Text Editors**: Find/Replace functionality
- **Search Engines**: Fast text searching
- **DNA Sequencing**: Pattern matching in genetic sequences
- **Intrusion Detection**: Network security pattern matching
- **Compilers**: Lexical analysis

---

## References

- Boyer, R. S., & Moore, J. S. (1977). "A fast string searching algorithm"
- Used in GNU grep, text editors, and many search applications

