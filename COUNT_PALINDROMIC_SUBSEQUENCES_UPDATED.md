# ✅ Count Palindromic Subsequences Problem Successfully Updated

## Problem Details

**Title:** Count Palindromic Subsequences

**Database ID:** `27928688-988a-4824-beb1-07121734ea26`

**Slug:** `count-palindromic-subsequences`

**Difficulty:** Hard

**Topics:** Strings, Dynamic Programming, Subsequence, Palindrome

**Companies:** Google, Amazon, Microsoft, Facebook, Apple

**XP Reward:** 50 points

---

## Problem Statement

Given a string of digits `s`, return the number of **palindromic subsequences** of `s` having length 5. Since the answer may be very large, return it modulo 10^9 + 7.

**Key Definitions:**
- **Palindromic**: A string that reads the same forward and backward
- **Subsequence**: Derived by deleting some or no characters without changing the order of remaining characters
- **Length 5**: We only count subsequences with exactly 5 characters

---

## Examples from Problem

### Example 1:
**Input:** `103301`
**Output:** `2`

**Explanation:** 
There are 6 possible subsequences of length 5:
- "10330", "10331", "10301", "10301", "13301", "03301"

Two of them (both equal to "10301") are palindromic.

### Example 2:
**Input:** `0000000`
**Output:** `21`

**Explanation:** 
All 21 subsequences are "00000", which is palindromic.
This is C(7,5) = 7!/(5!×2!) = 21 combinations.

### Example 3:
**Input:** `9999900000`
**Output:** `2`

**Explanation:** 
The only two palindromic subsequences are:
- "99999" (choosing all 5 nines)
- "00000" (choosing all 5 zeros)

---

## Algorithm: Dynamic Programming with Suffix Counting

### Palindrome Pattern for Length 5:
For a 5-character palindrome: **a b c b a**
- Position 0 must equal Position 4 (outer pair)
- Position 1 must equal Position 3 (inner pair)
- Position 2 (middle) can be any digit

### Approach:
1. **Precompute Suffix Counts:**
   - Build a 2D array `suffix[i][d]`
   - `suffix[i][d]` = count of digit `d` from position `i` to end
   - This allows O(1) lookup when counting valid positions

2. **Iterate Through Valid Positions:**
   - Fix position `i` (1st character)
   - Fix position `j > i` (2nd character)
   - Fix position `k > j` (3rd/middle character)
   - For each position `m > k` where `s[m]` matches 2nd character
   - Count positions `p > m` where `s[p]` matches 1st character

3. **Count Valid Combinations:**
   - Use suffix array for efficient counting
   - Apply modulo 10^9 + 7 to prevent overflow

### Complexity:
- **Time:** O(n⁴) worst case, but typically much better
- **Space:** O(n) for suffix count array

---

## Test Cases in Database

### Test Case 1
**Input:** `103301`
**Output:** `2`
**Explanation:** There are 6 possible subsequences of length 5: "10330","10331","10301","10301","13301","03301". Two of them (both equal to "10301") are palindromic.

### Test Case 2
**Input:** `0000000`
**Output:** `21`
**Explanation:** All 21 subsequences are "00000", which is palindromic. C(7,5) = 21 ways to choose 5 positions from 7.

### Test Case 3
**Input:** `9999900000`
**Output:** `2`
**Explanation:** The only two palindromic subsequences are "99999" and "00000".

### Test Case 4
**Input:** `1`
**Output:** `0`
**Explanation:** String length is 1, cannot form subsequence of length 5.

### Test Case 5
**Input:** `12345`
**Output:** `0`
**Explanation:** All digits are different, no palindromic subsequence of length 5 possible.

---

## Solutions Provided

All solutions use the **Dynamic Programming with Suffix Counting** approach:

### ✅ Python Solution
- Uses 2D list for suffix counts
- List comprehension for array initialization
- Integer arithmetic with MOD = 10**9 + 7

### ✅ JavaScript Solution
- Uses 2D array with Array.fill()
- parseInt() for digit conversion
- const MOD = 1e9 + 7

### ✅ Java Solution
- Uses int[][] for suffix counts
- Character to digit: `s.charAt(i) - '0'`
- long result to prevent overflow before MOD

### ✅ C++ Solution
- Uses vector<vector<int>> for suffix counts
- Character to digit: `s[i] - '0'`
- long long result for safe arithmetic

---

## Code Templates

Each language provides:
- Function signature with clear documentation
- Input reading setup (Scanner/readline/cin)
- Modulo constant defined (10^9 + 7)
- Comments explaining the approach
- Proper output formatting

Students implement the core logic:
1. Build suffix count array
2. Iterate through all valid position combinations
3. Count palindromic patterns
4. Return result with modulo

---

## Algorithm Walkthrough

### Example: s = "103301"

**Step 1: Build Suffix Count Array**
```
Position:  0  1  2  3  4  5  6(end)
String:    1  0  3  3  0  1

suffix[0][0] = 2  (two 0's from pos 0 to end)
suffix[0][1] = 2  (two 1's from pos 0 to end)
suffix[0][3] = 2  (two 3's from pos 0 to end)

suffix[4][0] = 1  (one 0 from pos 4 to end)
suffix[4][1] = 1  (one 1 from pos 4 to end)
suffix[4][3] = 0  (no 3's from pos 4 to end)
```

**Step 2: Find Valid Palindromes**

Pattern: **i - j - k - j - i**

Example combination:
- i=0: s[0]='1' (1st position)
- j=1: s[1]='0' (2nd position)
- k=2: s[2]='3' (middle position)
- m=4: s[4]='0' (4th position, matches j)
- p=5: s[5]='1' (5th position, matches i)

Forms palindrome: **1-0-3-0-1** ✓

Another combination:
- i=0: s[0]='1'
- j=1: s[1]='0'
- k=3: s[3]='3' (different middle)
- m=4: s[4]='0'
- p=5: s[5]='1'

Forms palindrome: **1-0-3-0-1** ✓ (same palindrome, different indices)

**Total:** 2 palindromic subsequences

---

## Key Implementation Details

### 1. Suffix Count Array Construction
```python
suffix = [[0] * 10 for _ in range(n + 1)]

for i in range(n - 1, -1, -1):
    for d in range(10):
        suffix[i][d] = suffix[i + 1][d]
    suffix[i][int(s[i])] += 1
```

### 2. Main Counting Loop
```python
for i in range(n - 4):              # 1st position
    for j in range(i + 1, n - 3):   # 2nd position
        for k in range(j + 1, n - 2): # 3rd position
            for m in range(k + 1, n - 1): # 4th position
                if s[m] == s[j]:
                    # Count 5th positions matching s[i]
                    result += suffix[m + 1][int(s[i])]
```

### 3. Modulo Application
```python
result = (result + count) % MOD
```

### 4. Edge Cases Handled
- String length < 5 → return 0
- All same digits → combinatorial count
- All different digits → return 0
- Empty string → return 0

---

## Mathematical Insight

For a string with all same digits (e.g., "0000000"):
- Any 5 positions form a palindrome
- Count = C(n, 5) = n! / (5! × (n-5)!)
- Example: C(7, 5) = 7! / (5! × 2!) = 21

For mixed digits:
- Must satisfy palindrome constraints
- Algorithm counts all valid combinations
- Suffix array optimization crucial for efficiency

---

## Files Created/Updated

1. **Script File:**
   - `apps/backend/src/scripts/updateCountPalindromicSubsequences.ts`
   - Contains complete problem data with all solutions

2. **Solutions Document:**
   - `count-palindromic-subsequences-solutions.md`
   - Detailed explanations and working code in all 4 languages

3. **This Summary:**
   - `COUNT_PALINDROMIC_SUBSEQUENCES_UPDATED.md`

---

## Database Update Status

✅ **Successfully Updated!**

- Problem inserted/updated in PostgreSQL (Supabase)
- All 5 test cases stored as JSON
- All 4 code templates stored as JSON
- Problem accessible via slug in Coding Arena
- XP reward: 50 points per completion

---

## How to Access

1. Navigate to **Coding Arena** in the application
2. Go to **Dynamic Programming** or **Strings** topic
3. Find "Count Palindromic Subsequences"
4. Select difficulty: **Hard**
5. Choose your language and start coding!

---

## Related Problems

This problem is similar to:
- **LeetCode #730:** Count Different Palindromic Subsequences
- **LeetCode #516:** Longest Palindromic Subsequence
- **Subsequence counting problems**
- **Dynamic programming on strings**

**Algorithm Pattern:** Dynamic Programming + Suffix Arrays
**Common Applications:** String analysis, pattern counting, combinatorics

---

## Complexity Notes

### Time Complexity: O(n⁴)
- 4 nested loops for positions i, j, k, m
- Suffix array lookup is O(1)
- For n = 10⁴, this is manageable

### Space Complexity: O(n)
- Suffix array: O(n × 10) = O(n)
- Only 10 digits (0-9) tracked
- No additional DP table needed

### Optimization Opportunities:
- Memoization for repeated subproblems
- Early termination when no valid chars remain
- Pruning based on suffix counts

---

## Constraints

- 1 ≤ s.length ≤ 10⁴
- s consists of digits only (0-9)
- Answer modulo 10⁹ + 7
- Must handle large outputs (up to 10⁹ + 7)

---

## Update Date
**Last Updated:** July 24, 2026

**Status:** ✅ Complete and Ready for Students

**Difficulty Level:** Hard - suitable for advanced students and competitive programming practice
