# Student Guide: Find Smallest and Second Smallest in Array

## 🎯 Problem Overview

Find the **smallest and second smallest distinct elements** in an array and return them in ascending order. If no valid second smallest exists, return [-1].

**Difficulty:** Easy  
**Topic:** Array, Sorting  
**Companies:** TCS, Accenture, Cognizant  
**Time Limit:** 2 seconds  
**Memory Limit:** 256 MB

---

## 📝 Problem Statement

Given an array `arr[]` of integers, find the **smallest and second smallest distinct elements**.

### Examples

#### Example 1
```
Input: arr[] = [12, 25, 8, 55, 10, 33, 17, 11]
Output: [8, 10]
Explanation: 8 is smallest, 10 is second smallest
```

#### Example 2
```
Input: arr[] = [2, 4, 3, 5, 6]
Output: [2, 3]
Explanation: 2 and 3 are the two smallest elements
```

#### Example 3
```
Input: arr[] = [1, 1, 1]
Output: [-1]
Explanation: Only one distinct element
```

#### Example 4
```
Input: arr[] = [5]
Output: [-1]
Explanation: Array has fewer than 2 elements
```

#### Example 5
```
Input: arr[] = [100, 50, 100, 25, 75]
Output: [25, 50]
Explanation: Distinct elements: [25, 50, 75, 100]
```

---

## 💭 Solution Approaches

### Approach 1: Single Pass (RECOMMENDED ⭐)
**Most Optimal - O(n) time, O(1) space**

```python
def findSmallestSecond(arr):
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
```

**How it works:**
- Keep two variables: `first` (smallest) and `second` (second smallest)
- Iterate through array once
- Update these values as we find smaller numbers
- Ensure we skip duplicates of the first element

---

### Approach 2: Using Set + Sorting
**O(n log n) time, O(n) space**

```python
def findSmallestSecond(arr):
    distinct = sorted(set(arr))
    
    if len(distinct) < 2:
        return [-1]
    return [distinct[0], distinct[1]]
```

**How it works:**
- Convert array to set to remove duplicates
- Sort the set
- Return first two elements

---

### Approach 3: Sorting
**O(n log n) time, O(1) space**

```python
def findSmallestSecond(arr):
    arr.sort()
    
    first = arr[0]
    for i in range(1, len(arr)):
        if arr[i] != first:
            return [first, arr[i]]
    
    return [-1]
```

**How it works:**
- Sort the entire array
- Find first distinct element after smallest

---

## 🔑 Key Insights

1. **Distinct Elements Only:** Skip duplicates of the first smallest
2. **Edge Cases:** Arrays with < 2 elements or all same elements
3. **Negative Numbers:** Array can have negative integers
4. **Return Format:** Always ascending order [smallest, secondSmallest]
5. **Time Complexity:** Optimal is O(n) with single pass

---

## 🎓 Learning Tips

### For Beginners
- Start with the sorting approach (Approach 2) to understand the logic
- Then optimize to single pass
- Focus on handling edge cases

### For Intermediate
- Implement all three approaches
- Understand trade-offs between time and space
- Write clean, readable code

### For Advanced
- Can you do it in one pass without extra space?
- How would you handle very large arrays?
- What's the best approach for sorted vs unsorted arrays?

---

## 🧪 Test Cases to Try

| Input | Output | Explanation |
|-------|--------|-------------|
| [12, 25, 8, 55, 10, 33, 17, 11] | [8, 10] | Normal case |
| [2, 4, 3, 5, 6] | [2, 3] | Unsorted |
| [1, 1, 1] | [-1] | All same |
| [5] | [-1] | Single element |
| [100, 50, 100, 25, 75] | [25, 50] | With duplicates |
| [-5, -10, 3, 0, 5] | [-10, -5] | Negative numbers |
| [7, 7, 7, 7] | [-1] | All duplicates |
| [3, 2, 1] | [1, 2] | Reverse sorted |
| [10, 10, 10, 20, 30, 20] | [10, 20] | Partial duplicates |
| [5, 3] | [3, 5] | Two elements |

---

## 💻 Starter Code

### Python
```python
def findSmallestSecond(arr):
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
```

### JavaScript
```javascript
function findSmallestSecond(arr) {
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
```

### C++
```cpp
vector<int> findSmallestSecond(vector<int>& arr) {
    // Write your code here
    
}
```

### Java
```java
public static int[] findSmallestSecond(int[] arr) {
    // Write your code here
    
}
```

---

## ⏱️ Complexity Analysis

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| Single Pass | O(n) | O(1) | ✅ Optimal | Need to track two variables |
| Set + Sort | O(n log n) | O(n) | Easy to code | Uses extra space |
| Sorting | O(n log n) | O(1) | Simple | Slower |

**Recommended:** Single Pass Approach

---

## 🚀 Interview Tips

1. **Ask Clarifications:**
   - "Are all elements distinct?" → No, array can have duplicates
   - "Can array have negative numbers?" → Yes
   - "What if array is empty?" → Return [-1]

2. **Discuss Trade-offs:**
   - Time vs Space complexity
   - In-place modifications
   - Stable sorting

3. **Handle Edge Cases:**
   - Single element: [-1]
   - All same: [-1]
   - Two elements: Return both
   - Negative numbers: Handle correctly

4. **Optimize:**
   - Start with O(n log n) sorting
   - Optimize to O(n) single pass
   - Discuss why optimal is better

---

## 🏆 Interview Companies

This problem is commonly asked in interviews at:
- **TCS** - Software Development Roles
- **Accenture** - Technical Roles
- **Cognizant** - Programming Interviews

---

## 📚 Related Problems

- Find Minimum and Maximum in Array
- Kth Smallest Element in Array
- Find Top K Largest Elements
- Find Missing Number
- Find Duplicate Number

---

## ✅ Success Criteria

Your solution should:
- ✅ Return correct output for all test cases
- ✅ Handle edge cases properly
- ✅ Be time-efficient (ideally O(n))
- ✅ Use minimal extra space
- ✅ Have clean, readable code
- ✅ Include comments explaining logic

---

## 📝 Submission Template

When you submit, make sure:
1. Your function name matches exactly
2. Return type is correct (array/list of integers)
3. All test cases pass
4. No syntax errors

---

Good luck! 🎯
