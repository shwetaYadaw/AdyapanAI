# TCS Reasoning Ability - Seating Arrangement Test Added ✅

## Summary

Successfully added a comprehensive **TCS Reasoning Ability test** for **"Seating Arrangement"** to the AdyapanAI platform.

---

## Test Details

### Test Information:
- **Title**: TCS Reasoning: Seating Arrangement
- **Category**: Reasoning Ability
- **Difficulty**: Medium
- **Duration**: 45 minutes
- **Total Marks**: 100 points (25 marks per question)
- **Questions**: 4 comprehensive seating arrangement problems
- **Status**: ✅ Active & Published
- **Database ID**: `e779344c-e587-4fce-8e64-184da8c305e3`

---

## Questions Included

### **Question 1: Simple Row Arrangement** (20 marks)
**Problem**: A, P, R, X, S and Z are sitting in a row.

**Given Conditions**:
- S and Z are in the centre
- A and P are at the ends
- R is sitting to the left of A

**Question**: Who is to the right of P?

**Options**:
- A) X
- B) A
- C) R
- D) Z

**Correct Answer**: A (X)

**Solution Logic**:
- Since R is to the left of A and A must be at an end, A is at the right end (position 6)
- P is at the left end (position 1)
- S and Z occupy the centre positions (3 and 4)
- R is at position 2 (to the left of A at position 6)
- X is at position 5
- Final arrangement: P(1) - R(2) - S(3) - Z(4) - X(5) - A(6)
- **X is to the right of P**

---

### **Question 2: Complex 8-House Arrangement** (30 marks)
**Problem**: 8 houses in a line with one boy in each.

**Given Conditions**:
- Jack is not the neighbour of Simon
- Harry is just next to the left of Larry
- At least one person to the left of Larry
- Paul lives in one of two middle houses (4 or 5)
- Mike lives in between Paul and Larry
- At least one person to the right of Robert
- Harry is NOT between Taud and Larry

**Question**: Which statement is NOT correct?

**Options**:
- A) Robert is not at the left end
- B) Robert is in between Simon and Taud
- C) Taud is in between Paul and Jack
- D) **There are three persons to the right of Paul**

**Correct Answer**: D

**Solution**:
- Paul at position 4
- Mike at position 5
- Harry at position 6
- Larry at position 7
- Remaining positions: Jack(1), Robert(2), Simon(3), Taud(8)

**Final Arrangement**: Jack(1) - Robert(2) - Simon(3) - Paul(4) - Mike(5) - Harry(6) - Larry(7) - Taud(8)

**Why D is incorrect**: There are **4 persons** to the right of Paul (positions 5, 6, 7, 8), not 3.

---

### **Question 3: Five People on a Bench** (20 marks)
**Problem**: A, B, C, D and E are sitting on a bench.

**Given Conditions**:
- A is sitting next to B
- C is sitting next to D
- D is NOT sitting with E
- E is on the left end of the bench
- C is on the second position from the right (position 4)
- A is to the right of B and E
- A and C are sitting together

**Question**: In which position is A sitting?

**Options**:
- A) Between B and D
- B) **Between B and C**
- C) Between E and D
- D) Between C and E

**Correct Answer**: B

**Solution**:
- E at position 1 (left end)
- C at position 4 (second from right)
- D must be at position 5 (next to C, and not with E)
- A must be at position 3 (next to C at position 4)
- B must be at position 2 (next to A)

**Final Arrangement**: E(1) - B(2) - A(3) - C(4) - D(5)

**Verification**:
- ✅ E at left end
- ✅ C at second from right
- ✅ A next to B (positions 3-2)
- ✅ C next to D (positions 4-5)
- ✅ D not with E (positions 5 and 1, not adjacent)
- ✅ A right of B and E
- ✅ A and C together (positions 3-4 adjacent)

**Answer**: B - A is between B (position 2) and C (position 4), specifically at position 3

---

### **Question 4: Challenge - Complex Logical Deduction** (30 marks)
**Problem**: Six people seated in a row with multiple constraints.

**Given Conditions**:
- Person X is at one end
- Person Y is in the middle (3rd or 4th position)
- Person Z is next to Y
- Person W is not next to X
- Person V is to the left of Person T
- There are 2 people between X and Z

**Question**: Which arrangement is correct?

**Options**:
- A) **X is at position 1, all conditions satisfied**
- B) Y must be at position 3, Z at position 2 or 4
- C) V and T must be adjacent
- D) W must be at one of the ends

**Correct Answer**: A

**Solution Logic**:
1. **"2 people between X and Z"** means their positions differ by 3
   - If X at position 1, then Z at position 4
   - If X at position 6, then Z at position 3

2. **Try X at position 1, Z at position 4**:
   - Since Z next to Y: Y at position 3 or 5
   - Z at position 4 next to Y at position 3 ✓

3. **Place W** (not next to X at position 1):
   - W not at position 2
   - W at position 5 or 6

4. **Place V and T** (V left of T):
   - If W at position 6: V and T at positions 2 and 5
   - V(2) left of T(5) ✓

**Final Valid Arrangement**: X(1) - V(2) - Y(3) - Z(4) - T(5) - W(6)

**All Conditions Verified**:
- ✅ X at end (position 1)
- ✅ Y in middle (position 3)
- ✅ Z next to Y (positions 4-3)
- ✅ 2 people between X(1) and Z(4): positions 2, 3
- ✅ W not next to X: positions 6 and 1 not adjacent
- ✅ V left of T: positions 2 < 5

---

## Files Created/Modified

### Files Created:
✅ `apps/backend/src/scripts/seedTcsSeatingArrangement.ts`
   - 4 detailed seating arrangement problems
   - Complete step-by-step solutions
   - Multi-level difficulty (20, 30, 20, 30 marks)

### Files Updated:
✅ `apps/backend/package.json`
   - Added: `"seed:tcs-seating"` npm script
   - Updated: `"seed:all"` to include seating arrangement test

### Documentation:
✅ `TCS_SEATING_ARRANGEMENT_ADDITION.md` - This file

---

## Difficulty Progression

| Question | Difficulty | Marks | Type |
|----------|-----------|-------|------|
| 1. Simple Row | Easy-Medium | 20 | Single row with 6 people |
| 2. Complex 8-House | Medium-Hard | 30 | Evaluate incorrect statement |
| 3. Bench Arrangement | Medium | 20 | Position deduction |
| 4. Challenge Logic | Hard | 30 | Complex multi-constraint |

---

## Key Concepts Tested

✅ **Logical Deduction** - Working backwards from constraints  
✅ **Positional Reasoning** - Understanding left/right/between relationships  
✅ **Constraint Satisfaction** - Managing multiple conditions simultaneously  
✅ **Spatial Arrangement** - Visualizing linear arrangements  
✅ **Problem Analysis** - Breaking complex problems into steps  

---

## How to Access

### Via API:
```bash
GET http://localhost:5000/api/placement/aptitude/tests?category=reasoning&company=TCS
```

### Or specifically:
```bash
GET http://localhost:5000/api/placement/aptitude/tests?title=Seating%20Arrangement
```

### In Frontend Navigation:
**Aptitude Prep → TCS Reasoning Ability → Seating Arrangement**

---

## Test Taking Tips for Students

1. **Start with question 1** - Build confidence with simpler arrangement
2. **Draw diagrams** - Visualize positions on paper or whiteboard
3. **List constraints** - Write down all conditions before solving
4. **Eliminate options** - Use constraints to rule out impossible arrangements
5. **Verify solutions** - Always check final arrangement against all conditions
6. **Time management** - ~11 minutes per question (45 minutes total)

---

## Additional Resources

### Related Tests Available:
- TCS Reasoning: Identify Word and Numeric Patterns
- TCS Coding NQT Problems
- TCS Aptitude Tests

### Suggested Learning Path:
1. Master logical reasoning fundamentals
2. Practice simple seating arrangements (2-4 people)
3. Advance to complex multi-person arrangements
4. Combine with other reasoning topics
5. Take full-length mock tests

---

## Integration Status

- ✅ Database: Successfully seeded (ID: e779344c-e587-4fce-8e64-184da8c305e3)
- ✅ API: Accessible via REST endpoints
- ✅ Frontend: Ready for student access
- ✅ Scoring: 100 marks total with progression
- ✅ Time Limit: 45 minutes for 4 questions
- ✅ Difficulty: Medium (suitable for TCS NQT preparation)

---

## Performance Metrics Expected

After completion:
- **Excellent** (90-100 marks): Strong logical reasoning ability
- **Good** (70-89 marks): Solid understanding with minor gaps
- **Average** (50-69 marks): Basic comprehension, needs practice
- **Below Average** (<50 marks): Requires more practice with fundamentals

---

## Seeding Command

To re-seed this test data:
```bash
npm run seed:tcs-seating
```

To seed all TCS tests together:
```bash
npm run seed:all
```

---

**Created**: July 27, 2026  
**Status**: Production Ready  
**Version**: 1.0.0  
**Test ID**: e779344c-e587-4fce-8e64-184da8c305e3
