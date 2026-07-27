# 🔍 Understanding the "2 Questions" Display

## What Does "2 Questions" Actually Mean?

The frontend label shows **"2 Questions"** but this is MISLEADING. It actually means:

**"2 TEST ENTRIES"** available in the Seating Arrangement section

---

## The Real Breakdown

```
TCS REASONING ABILITY
│
├─ Pattern Recognition
│  └─ 1 Test Entry
│     └─ Contains: 4 Questions/Problems
│
└─ Seating Arrangement
   └─ [Shows "2 Questions" label]
      ├─ Entry 1: Pattern Recognition Test (4 questions)
      └─ Entry 2: Seating Arrangement Test (7 questions) ← THIS ONE

So "2 Questions" = 2 TEST ENTRIES visible in the section
```

---

## What's Actually in the Database

### Test 1: Pattern Recognition
- **Questions**: 4
- **Marks**: 100
- **Duration**: 30 min

### Test 2: Seating Arrangement (UPDATED)
- **Questions**: 7 (4 linear + 3 circular)
- **Marks**: 200
- **Duration**: 120 min
- **Contains all circular seating sub-questions**

---

## When You Click "Seating Arrangement Test"

You will see:

```
Problem 1: Row arrangement (20 marks)
Problem 2: House validation (30 marks)
Problem 3: Bench logic (20 marks)
Problem 4: Challenge (30 marks)
Problem 5: Circular Seating - Neighbours (25 marks)
Problem 6: Circular Seating - Direction (25 marks)
Problem 7: Circular Seating - Position (25 marks)

Total: 7 Problems
```

---

## Verification Steps

### To Confirm:
1. Go to http://localhost:3000
2. Navigate: **Aptitude Prep → TCS Reasoning Ability**
3. See: "Seating Arrangement [2 Questions]" ← This is 2 TESTS
4. Click: "Seating Arrangement" test entry
5. See: **All 7 Problems/Questions** inside the test

---

## Why "2 Questions"?

The UI is displaying the COUNT of TESTS in that section, not individual questions:

- **Pattern Recognition** = 1 test
- **Seating Arrangement** = 1 test
- **Total shown = "2 Questions"** (misleading label, should be "2 Tests")

---

## The Circular Seating Questions ARE There

When you open the Seating Arrangement test, you will definitely see:

✅ Problem 5.1: Which two are NOT neighbours? (25 marks)
✅ Problem 5.2: Who is immediate right of V? (25 marks)  
✅ Problem 5.3: What is the position of S? (25 marks)

Plus the 4 original linear seating problems.

---

## Summary

| Display | Actual Meaning |
|---------|---|
| "2 Questions" | 2 test entries |
| Pattern Recognition | 1 test = 4 questions |
| Seating Arrangement | 1 test = 7 questions |
| When you TAKE test | You see all 7 problems |

---

**The circular seating questions ARE definitely in the system!** 

They're just not showing as separate entries in the UI - they're integrated as Problems 5, 6, and 7 within the Seating Arrangement test.

**Try clicking the test and you'll see all 7 problems!** ✅
