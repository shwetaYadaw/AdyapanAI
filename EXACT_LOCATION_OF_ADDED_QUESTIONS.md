# Exact Location of Added Syllogism Questions

**File**: `apps/web/src/pages/student/AptitudePage.tsx`

---

## 📍 Location Details

### File Path (Full)
```
c:\Users\HP\AdyapanAI\apps\web\src\pages\student\AptitudePage.tsx
```

### Lines in File
```
Start Line: 1440
End Line: 1530
```

### Export Variable
```typescript
export const TCS_REASONING_TOPICS: Topic[] = [
  // ... other topics ...
  {
    name: 'Syllogism',
    pageNumber: 250,
    questions: [
      // ← Questions 1-10 are here (lines 1443-1530)
    ]
  }
];
```

---

## 📋 Structure Overview

```
File: AptitudePage.tsx
│
├─ Line 1199: First Syllogism Topic (Page 72)
│  │  ✅ 7 existing questions
│  │  • Apples-Bananas-Mangoes-Oranges
│  │  • Men-Vertebrates-Mammals
│  │  • Actors-Singers-Dancers
│  │  • Harmoniums-Instruments-Flutes
│  │  • Mangoes-Yellow-Tixo
│  │  • Ants-Parrots-Apples
│  │  • Papers-Pens-Pencils
│  └─ Line 1240: End of first Syllogism section
│
└─ Line 1440: Second Syllogism Topic (Page 250) ← NEW SECTION
   │  ✅ 10 NEW questions added
   │  • Question 1 (Lines 1444-1453): Benches-Desks-Roads-Pillars
   │  • Question 2 (Lines 1454-1462): Dogs-Rats-Trees
   │  • Question 3 (Lines 1463-1471): Bricks-Trees-Pens-Boats
   │  • Question 4 (Lines 1472-1480): Cups-Glasses-Bowls-Plates
   │  • Question 5 (Lines 1481-1489): Trains-Roads-Flowers-Jungles
   │  • Question 16 (Lines 1490-1498): Pearls-Stones-Diamonds-Gems
   │  • Question 17 (Lines 1499-1507): Rods-Bricks-Ropes-Doors
   │  • Question 18 (Lines 1508-1516): Myths-Fictions-Novels-Stories
   │  • Question 19 (Lines 1517-1525): Papers-Pens-Pencils-Erasers
   │  • Question 20 (Lines 1526-1534): Men-Sky-Roads
   └─ Line 1534: End of second Syllogism section (end of TCS_REASONING_TOPICS)
```

---

## 🎯 Quick Navigation

### To Find the Questions in VS Code:

**Step 1**: Open the file
```
File: apps/web/src/pages/student/AptitudePage.tsx
```

**Step 2**: Press `Ctrl+G` (Go to Line)

**Step 3**: Enter line number
```
Go to Line: 1440
```

**Step 4**: You'll see the new Syllogism section with all 10 questions

---

## 📍 Exact Line Numbers for Each Question

### Within the Second Syllogism Section (1440-1534)

| Question | Topic | Start Line | End Line |
|----------|-------|------------|----------|
| **Q1** | Benches-Desks-Roads-Pillars | 1444 | 1453 |
| **Q2** | Dogs-Rats-Trees | 1454 | 1462 |
| **Q3** | Bricks-Trees-Pens-Boats | 1463 | 1471 |
| **Q4** | Cups-Glasses-Bowls-Plates | 1472 | 1480 |
| **Q5** | Trains-Roads-Flowers-Jungles | 1481 | 1489 |
| **Q16** | Pearls-Stones-Diamonds-Gems | 1490 | 1498 |
| **Q17** | Rods-Bricks-Ropes-Doors | 1499 | 1507 |
| **Q18** | Myths-Fictions-Novels-Stories | 1508 | 1516 |
| **Q19** | Papers-Pens-Pencils-Erasers | 1517 | 1525 |
| **Q20** | Men-Sky-Roads | 1526 | 1534 |

---

## 💻 Code Structure

### Section Header (Line 1440)
```typescript
{
  name: 'Syllogism',
  pageNumber: 250,
  questions: [
```

### Individual Question Structure
Each question follows this pattern (lines 1444+):
```typescript
{
  question: 'Statements: [statements]. Conclusions: [conclusions]',
  options: ['option1', 'option2', 'option3', 'option4', 'option5'],
  answer: 'correct answer',
  explanation: 'detailed explanation'
},
```

### Section Footer (Line 1534)
```typescript
    ]
  }
];
```

---

## 🌐 In the Application

### How to Access the Questions:

**URL**: http://localhost:3000/student/aptitude

**Steps**:
1. Click "TCS Reasoning Ability" button
2. Click "Syllogism" topic
3. You'll see both old and new questions together in the same page

### Note:
Currently, both Syllogism sections (Page 72 and Page 250) will appear in the list. You can scroll through all 17 Syllogism questions (7 original + 10 new).

---

## 📊 Total Content Added

```
File Modified: AptitudePage.tsx
Lines Added: ~100 lines
Questions Added: 10 questions
Questions per line: ~10 lines per question

Total Content:
- Question text: ~1 line
- Options: ~1 line  
- Answer: ~1 line
- Explanation: ~5-7 lines

Total Syllogism Questions in File: 17 questions
- Original (Page 72): 7 questions
- New (Page 250): 10 questions
```

---

## 🔍 Search & Find

### Using VS Code Find Feature

**Press**: `Ctrl+F`

**Search For**:
1. To find first Syllogism section:
   ```
   name: 'Syllogism',
   pageNumber: 72,
   ```

2. To find second Syllogism section (NEW):
   ```
   name: 'Syllogism',
   pageNumber: 250,
   ```

3. To find specific question:
   ```
   Statements: Some pearls are stones  // Question 16
   Statements: All rods are bricks     // Question 17
   Statements: All myths are fictions  // Question 18
   Statements: No paper is pen         // Question 19
   Statements: No man is sky           // Question 20
   ```

---

## ✅ Verification Checklist

- [x] File: `apps/web/src/pages/student/AptitudePage.tsx`
- [x] Export: `TCS_REASONING_TOPICS`
- [x] Topic Name: "Syllogism"
- [x] Page Number: 250
- [x] Questions Count: 10
- [x] Line Range: 1440-1534
- [x] All questions have:
  - [x] question text
  - [x] options array (5 options)
  - [x] answer
  - [x] explanation

---

## 📱 In the Browser

### What You'll See:

**Aptitude Preparation Page**
├─ TCS Numerical Ability (section)
└─ TCS Reasoning Ability (section) ← Click here
   ├─ Logical Deduction (topic)
   ├─ Direction Sense (topic)
   ├─ Seating Arrangement (topic)
   └─ Syllogism (topic) ← Click here
      └─ Your 10 new questions appear here!

---

## 🎯 Direct Links

### In VS Code:
- **File**: `apps/web/src/pages/student/AptitudePage.tsx`
- **Go to Line**: 1440
- **Find Export**: `export const TCS_REASONING_TOPICS`
- **Look for**: Topic named "Syllogism" with pageNumber 250

### In Browser:
- **URL**: http://localhost:3000/student/aptitude
- **Click**: TCS Reasoning Ability
- **Click**: Syllogism
- **Scroll**: To see all 10 new questions

---

## 📋 Summary

**File**: `apps/web/src/pages/student/AptitudePage.tsx`  
**Location**: Lines 1440-1534  
**Topic**: Syllogism (Page 250)  
**Questions**: 10 (Q1-Q5, Q16-Q20)  
**Status**: ✅ Live and accessible

---

**The questions are now integrated into the TCS Reasoning Ability section and are live in the application!** 🎉

