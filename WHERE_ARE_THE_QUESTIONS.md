# 🔍 WHERE TO FIND THE SEATING ARRANGEMENT QUESTIONS

## Quick Answer

The questions ARE in the system! ✅

The screenshot shows "2 Questions" which actually means **2 seating arrangement tests**, not 2 questions.

---

## 📍 Location of Questions

### In the System:
```
Database Table: AptitudeTest
│
├─ Test 1: TCS Reasoning: Seating Arrangement
│  └─ 4 Questions (20+30+20+30 marks)
│
└─ Test 2: TCS Reasoning: Circular Seating Arrangement (NEW)
   └─ 4 Questions (25+25+25+25 marks)
```

### Via Frontend (Web App):
```
http://localhost:3000
  ↓
Aptitude Prep
  ↓
TCS Reasoning Ability
  ↓
Seating Arrangement [Shows 2 Tests]
  ├─ Click: "Seating Arrangement" (45 min test)
  │  └─ View 4 Questions
  │
  └─ Click: "Circular Seating Arrangement" (60 min test) ← NEW
     └─ View 4 Sub-Questions
```

### Via API:
```bash
# Get all seating tests
GET http://localhost:5000/api/placement/aptitude/tests?category=reasoning&company=TCS

# Response includes:
{
  "data": [
    {
      "id": "e779344c-e587-4fce-8e64-184da8c305e3",
      "title": "TCS Reasoning: Seating Arrangement",
      "questions": [
        { "text": "Problem 1: ...", "options": [...], ... },
        { "text": "Problem 2: ...", "options": [...], ... },
        { "text": "Problem 3: ...", "options": [...], ... },
        { "text": "Problem 4: ...", "options": [...], ... }
      ]
    },
    {
      "id": "f5aaa392-0f89-4af4-904b-7333ea0a09f1",
      "title": "TCS Reasoning: Circular Seating Arrangement",
      "questions": [
        { "text": "Circular Seating Arrangement Problem: ...", "options": [...], ... },
        { "text": "Using the same Circular Seating Arrangement: ...", "options": [...], ... },
        { "text": "Using the same Circular Seating Arrangement: ...", "options": [...], ... },
        { "text": "Comprehensive Circular Seating Problem: ...", "options": [...], ... }
      ]
    }
  ]
}
```

---

## 📊 Questions Breakdown

### Test 1: Seating Arrangement (45 min, 100 marks)
```
Q1: Simple 6-person row (20 marks)
Q2: Complex 8-house validation (30 marks)
Q3: 5-person bench logic (20 marks)
Q4: Challenge 6-person logic (30 marks)
Total: 4 Questions
```

### Test 2: Circular Seating Arrangement (60 min, 100 marks) - NEW
```
Q1: Which NOT neighbours? (25 marks)
    Sub-problem with 8 people in circle
    
Q2: Who is right of V? (25 marks)
    Directional reasoning
    
Q3: Position of S? (25 marks)
    Position evaluation
    
Q4: Who has U,W as neighbours? (25 marks)
    Multi-constraint logic
    
Total: 4 Questions (structured as 1 main problem with 4 sub-questions)
```

---

## ✅ To View Questions

### Method 1: Via Web Browser
1. Go to `http://localhost:3000`
2. Navigate: **Aptitude Prep → TCS Reasoning Ability**
3. Click on **"Seating Arrangement"** section
4. See 2 tests listed
5. Click on **"Circular Seating Arrangement"** (NEW)
6. View all 4 questions/sub-questions

### Method 2: Via API Call
```bash
curl 'http://localhost:5000/api/placement/aptitude/tests?title=Circular%20Seating%20Arrangement'

# Returns full test with all 4 questions
```

### Method 3: Database Query
```sql
SELECT * FROM "AptitudeTest" 
WHERE title LIKE '%Circular%' 
AND category = 'reasoning' 
AND company = 'TCS';
```

---

## 🎯 Test IDs for Direct Access

### Linear Seating Test:
```
ID: e779344c-e587-4fce-8e64-184da8c305e3
Questions: 4
Duration: 45 min
Marks: 100
```

### Circular Seating Test (NEW):
```
ID: f5aaa392-0f89-4af4-904b-7333ea0a09f1
Questions: 4 (sub-questions)
Duration: 60 min
Marks: 100
```

---

## 📝 Circular Seating Questions Content

### Q1: Which two are NOT neighbours?
**Problem**: 8 people (P,Q,R,S,T,U,V,W) in circle with 6 constraints
**Options**: R&V, U&V, R&P, Q&W
**Answer**: R and V

### Q2: Who is immediately to the right of V?
**Problem**: Same circular arrangement
**Options**: P, U, R, T
**Answer**: T

### Q3: What is the position of S?
**Problem**: Same circular arrangement
**Options**: Between U&V, 2nd right of P, Right of W, Data inadequate
**Answer**: Second to the right of P

### Q4: Who has U and W as neighbours?
**Problem**: Same circular arrangement
**Options**: S, V, T, R
**Answer**: S

---

## ✨ Summary

| Where | Details |
|-------|---------|
| **Database** | ✅ Stored in AptitudeTest table |
| **API** | ✅ Accessible via /api/placement/aptitude/tests |
| **Frontend** | ✅ Visible in Aptitude Prep section |
| **Questions Count** | ✅ 4 per test (8 total for seating) |
| **Status** | ✅ Live and Ready |

---

## 🚀 Next Steps

1. **Access Web App**: Go to `http://localhost:3000`
2. **Find Tests**: Aptitude Prep → TCS Reasoning Ability → Seating Arrangement
3. **Take Test**: Click "Circular Seating Arrangement"
4. **View Questions**: 4 sub-questions visible in the test
5. **Answer**: Complete within 60 minutes
6. **Score**: Get instant feedback

---

**All questions are in the system and ready to use!** ✅
