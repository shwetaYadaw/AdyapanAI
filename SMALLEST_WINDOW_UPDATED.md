# ✅ Smallest Window Problem Successfully Updated

## Problem Details

**Title:** Smallest Window in a String containing all characters of other String

**Database ID:** `5418d6de-0ba2-4ec9-b882-41411617bf12`

**Slug:** `smallest-window-in-a-string-containing-all-characters-of-another-string`

**Difficulty:** Hard

**Topics:** Strings, Sliding Window, Two Pointers, Hash Table

**Companies:** Amazon, Google, Microsoft, Facebook, Uber, Apple

**XP Reward:** 40 points

---

## Problem Statement

Given two strings `s` and `p`, find the smallest substring in `s` that contains all characters of `p`, including duplicates.

**Requirements:**
- If no such substring exists, return ""
- If multiple substrings of the same length are found, return the one with the smallest starting index
- Must contain ALL characters from `p`, including duplicates
- The window can contain other characters from `s` as well

---

## Algorithm: Sliding Window with Two Hash Maps

**Time Complexity:** O(|s| + |p|)
**Space Complexity:** O(|p|)

### Key Steps:
1. Create frequency map for pattern `p`
2. Use two pointers (left, right) for sliding window
3. Expand window by moving right pointer
4. When all characters are found, contract from left
5. Track minimum window found

### Variables Used:
- `patternFreq`: Frequency map of pattern characters
- `windowFreq`: Frequency map of current window
- `required`: Number of unique characters needed
- `formed`: Number of unique characters matched with correct frequency
- `left`, `right`: Window boundaries
- `minLen`, `minStart`: Track minimum window

---

## Examples

### Example 1:
**Input:**
```
s = "timetopractice"
p = "toc"
```
**Output:** `toprac`

**Explanation:** "toprac" is the smallest substring in which "toc" can be found.

### Example 2:
**Input:**
```
s = "zoomlazapzo"
p = "oza"
```
**Output:** `apzo`

**Explanation:** "apzo" is the smallest substring in which "oza" can be found.

### Example 3 (LeetCode #76):
**Input:**
```
s = "ADOBECODEBANC"
p = "ABC"
```
**Output:** `BANC`

**Explanation:** "BANC" is the minimum window containing A, B, C.

---

## Test Cases in Database

### Test Case 1
**Input:**
```
timetopractice
toc
```
**Output:** `toprac`
**Explanation:** "toprac" is the smallest substring that contains all characters t, o, c from pattern

### Test Case 2
**Input:**
```
zoomlazapzo
oza
```
**Output:** `apzo`
**Explanation:** "apzo" is the smallest substring containing o, z, a

### Test Case 3
**Input:**
```
ADOBECODEBANC
ABC
```
**Output:** `BANC`
**Explanation:** Classic example: "BANC" is the minimum window containing A, B, C

### Test Case 4
**Input:**
```
a
aa
```
**Output:** `` (empty string)
**Explanation:** Pattern requires 2 "a"s but string has only 1, so no valid window exists

### Test Case 5
**Input:**
```
ab
b
```
**Output:** `b`
**Explanation:** Single character "b" is the minimum window

---

## Solutions Provided

All solutions use the **Sliding Window with Two Hash Maps** approach:

### ✅ Python Solution
- Uses dictionaries for frequency maps
- `float('inf')` for initial minimum length
- String slicing for result

### ✅ JavaScript Solution
- Uses objects for frequency maps
- `Infinity` for initial minimum length
- `substring()` method for result

### ✅ Java Solution
- Uses `HashMap<Character, Integer>`
- `Integer.MAX_VALUE` for initial minimum length
- `substring()` method for result

### ✅ C++ Solution
- Uses `unordered_map<char, int>`
- `INT_MAX` for initial minimum length
- `substr()` method for result

---

## Code Templates

Each language has a proper template with:
- Function signature and documentation
- Input reading setup
- Output printing
- Comments explaining the approach

Students need to implement the sliding window logic inside the provided functions.

---

## Key Implementation Details

### 1. Frequency Tracking
```
Pattern: "oza"
patternFreq = {'o': 1, 'z': 1, 'a': 1}
required = 3 (unique characters)
```

### 2. Window Expansion
```
Add characters from right and update windowFreq
Check if character frequency matches pattern
```

### 3. Window Contraction
```
When formed == required:
  - Update minimum window if smaller
  - Remove leftmost character
  - Decrease formed if character frequency drops below required
  - Move left pointer
```

### 4. Edge Cases Handled
- Empty strings → return ""
- Pattern longer than string → return ""
- No valid window → return ""
- Pattern with duplicates → correctly handled by frequency maps
- Multiple windows same size → returns leftmost (due to left-to-right scan)

---

## Algorithm Walkthrough

Example: `s = "timetopractice"`, `p = "toc"`

```
Step 1: patternFreq = {'t': 1, 'o': 1, 'c': 1}
Step 2: Expand window until all chars found
  - Window "timetopr" contains t, o, c
Step 3: Contract from left
  - Remove "time", window becomes "topr" (still valid)
  - Try "opr" (missing 't', invalid)
Step 4: Continue expanding and contracting
  - Find "toprac" as minimum window
Step 5: Return "toprac"
```

---

## Files Created/Updated

1. **Script File:**
   - `apps/backend/src/scripts/updateSmallestWindow.ts`
   - Contains complete problem data with all solutions

2. **Solutions Document:**
   - `smallest-window-complete-solutions.md`
   - Detailed explanations and working code in all 4 languages

3. **This Summary:**
   - `SMALLEST_WINDOW_UPDATED.md`

---

## Database Update Status

✅ **Successfully Updated!**

- Problem inserted/updated in PostgreSQL (Supabase)
- All test cases stored as JSON
- All code templates stored as JSON
- Problem accessible via slug in Coding Arena
- XP reward: 40 points per completion

---

## How to Access

1. Navigate to **Coding Arena** in the application
2. Go to **Strings** or **Sliding Window** topic
3. Find "Smallest Window in a String containing all characters of other String"
4. Click to open the problem
5. Select language and start coding!

---

## Related Problems

This problem is similar to:
- **LeetCode #76:** Minimum Window Substring
- **GeeksforGeeks:** Smallest window in a string containing all characters of another string

**Algorithm Pattern:** Sliding Window with Hash Maps
**Common Applications:** Text processing, pattern matching, substring search

---

## Update Date
**Last Updated:** July 24, 2026

**Status:** ✅ Complete and Ready for Students
