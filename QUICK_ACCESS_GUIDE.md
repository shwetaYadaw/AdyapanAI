# ⚡ Quick Access Guide - TCS Reasoning Tests

## 🎯 Get Started in 30 Seconds

### Access in Web App:
1. Go to http://localhost:3000
2. Navigate: **Aptitude Prep → TCS Reasoning Ability**
3. Choose test and start

### Access via API:
```bash
curl 'http://localhost:5000/api/placement/aptitude/tests?category=reasoning&company=TCS'
```

---

## 📋 Available Tests

### Test 1: Word & Numeric Patterns
- **🆔 ID**: `bacaaa2b-d855-4cbb-99c0-7c48691a5379`
- **⏱️ Time**: 30 minutes
- **📊 Marks**: 100 (4 questions × 25)
- **❓ Questions**: Pattern sequences, alphanumeric progressions
- **📈 Difficulty**: Medium

### Test 2: Seating Arrangement
- **🆔 ID**: `e779344c-e587-4fce-8e64-184da8c305e3`
- **⏱️ Time**: 45 minutes
- **📊 Marks**: 100 (4 questions, varied marks)
- **❓ Questions**: Row arrangements, position logic
- **📈 Difficulty**: Medium-Hard

---

## 🔍 Test Details

### Pattern Recognition - 4 Questions
```
Q1: Row arrangement (6 people) → 25 marks
Q2: Multi-pattern analysis → 25 marks
Q3: Alphanumeric sequences → 25 marks
Q4: Complex patterns → 25 marks
```

### Seating Arrangement - 4 Questions
```
Q1: Simple row (6 houses) → 20 marks
Q2: Complex (8 houses, validate) → 30 marks
Q3: Bench logic (5 people) → 20 marks
Q4: Challenge (6 people, complex) → 30 marks
```

---

## 🎓 Sample Questions

### Pattern Test Sample:
```
Q: A, P, R, X, S and Z in a row
   - S and Z in centre
   - A and P at ends
   - R left of A
   
Answer: X is to the right of P ✅
```

### Seating Test Sample:
```
Q: A, B, C, D, E on bench
   - A next to B, C next to D
   - E at left end
   - C at 2nd from right
   
Answer: A is between B and C ✅
```

---

## 📊 Score Interpretation

### Combined (Both Tests):
```
170-200 → Excellent ⭐⭐⭐ (TCS Ready)
140-169 → Good ⭐⭐
100-139 → Average ⭐
< 100   → Needs Practice
```

---

## 🚀 Quick Actions

### Seed Tests:
```bash
npm run seed:tcs-reasoning
npm run seed:tcs-seating
npm run seed:all
```

### View in Database:
```sql
SELECT id, title, duration, totalMarks FROM "AptitudeTest" 
WHERE category = 'reasoning' AND company = 'TCS';
```

### API Endpoints:
```
GET /api/placement/aptitude/tests?category=reasoning&company=TCS
GET /api/placement/aptitude/tests?title=Seating%20Arrangement
```

---

## ✅ Features

✅ Instant scoring  
✅ Detailed explanations  
✅ Time tracking  
✅ Multiple attempts  
✅ XP rewards  
✅ Performance analytics  

---

## 📞 Need Help?

**Detailed Docs**:
- Pattern Test: `TCS_REASONING_PATTERN_ADDITION.md`
- Seating Test: `TCS_SEATING_ARRANGEMENT_ADDITION.md`
- Complete Guide: `TCS_REASONING_TESTS_SUMMARY.md`

**Implementation**: `IMPLEMENTATION_COMPLETE.md`

---

## 🎯 Recommended Path

1. **Start**: Pattern Recognition Test (30 min)
2. **Review**: Explanations and solutions
3. **Next**: Seating Arrangement Test (45 min)
4. **Assess**: Combined score analysis
5. **Improve**: Focus on weak areas

---

**Status**: ✅ Live & Ready  
**Total Content**: 8 questions, 200 marks  
**Duration**: 75 minutes total
