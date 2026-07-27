# Quick Testing Guide

## Files Created

✅ `test_js.js` - JavaScript tests
✅ `test_py.py` - Python tests  
✅ `test_cpp.cpp` - C++ tests
✅ `TestJava.java` - Java tests

---

## How to Run

### JavaScript
```bash
node test_js.js
```

### Python
```bash
python test_py.py
# or
python3 test_py.py
```

### C++
```bash
# Compile
g++ -o test_cpp test_cpp.cpp

# Run
./test_cpp
```

### Java
```bash
# Compile
javac TestJava.java

# Run
java TestJava
```

---

## Test Cases: 24 Total

### Visible (6 cases)
- s=0, d=1 → "-1" (impossible)
- s=1, d=1 → "1" (single digit)
- s=9, d=2 → "18" (basic)
- s=20, d=3 → "299" (complex)
- s=15, d=3 → "159" (complex)
- s=5, d=2 → "14" (basic)

### Hidden (18 cases)
- Edge cases (impossible)
- Single digits (d=1)
- Two digits (d=2)
- Three digits (d=3)
- Four digits (d=4)
- Five digits (d=5)
- Ten digits (d=10)

---

## Expected Output

```
🧪 JavaScript Test Suite
============================================================
✅ Test 1: s=0, d=1
✅ Test 2: s=1, d=1
...
✅ Test 24: s=91, d=10

============================================================

📊 24/24 PASSED (100.00%)
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Python: "No module named" | Use `python3` instead of `python` |
| C++: g++ not found | Install MinGW or GCC |
| Java: "class not found" | Ensure file is `TestJava.java` and class is `TestJava` |
| Tests failing | Check algorithm implementation |

---

## Algorithm

```
1. Check if s and d are valid (1 <= s <= 9*d)
2. Initialize array with first digit = 1, rest = 0
3. Fill from right to left with min(9, remaining)
4. Add leftover to first digit
5. Return as string
```

---

## Success Criteria

✅ All 24 tests pass
✅ No compilation errors
✅ Correct output format
✅ 100% success rate

---

## Sample Run Output

```
Test 1: Input s=0, d=1
Expected: "-1"
Got: "-1"
✅ PASSED

Test 2: Input s=1, d=1
Expected: "1"
Got: "1"
✅ PASSED

Test 3: Input s=9, d=2
Expected: "18"
Got: "18"
✅ PASSED
```

---

## Tips

1. **Save files** in your working directory
2. **Run tests** after each implementation change
3. **Debug** by printing intermediate values if failing
4. **Compare** expected vs actual output carefully
5. **Check** edge cases first (s=0, impossible values)

---

**All test files ready to use! 🚀**
