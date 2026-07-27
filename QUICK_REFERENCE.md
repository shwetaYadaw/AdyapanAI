# 🚀 Quick Reference - TCS Tests

## Available Tests

### 1️⃣ Non-Verbal Pattern Recognition
- **ID**: `8cfeefcc-3225-40fb-b6d6-d623b8c4d114`
- **URL**: `/student/tests/8cfeefcc-3225-40fb-b6d6-d623b8c4d114`
- **Questions**: 5 | **Time**: 60 min | **Marks**: 150

### 2️⃣ Seating Arrangement
- **ID**: `1bcbf3bf-922f-483e-90a1-313622097652`
- **URL**: `/student/tests/1bcbf3bf-922f-483e-90a1-313622097652`
- **Questions**: 7 | **Time**: 120 min | **Marks**: 200

### 3️⃣ Word & Numeric Patterns
- **ID**: `bacaaa2b-d855-4cbb-99c0-7c48691a5379`
- **URL**: `/student/tests/bacaaa2b-d855-4cbb-99c0-7c48691a5379`
- **Questions**: 4 | **Time**: 30 min | **Marks**: 100

---

## 🔗 Direct Access

**Frontend**: `http://localhost:3000/student/placement`
- Click "Aptitude Tests" → Select test → Start

**API**:
```
GET /api/placement/aptitude/tests
GET /api/placement/aptitude/tests/{testId}
```

---

## 📝 Non-Verbal Test Questions

| Q | Type | Answer | Marks |
|---|------|--------|-------|
| 1 | Sequence Rotation | **E** | 30 |
| 2 | Shape Transform | **A** | 30 |
| 3 | Odd-One-Out | **C** | 30 |
| 4 | Matrix Pattern | **A** | 30 |
| 5 | Logic Analysis | **D** | 30 |

---

## 🔄 Adding More Questions

**New Test Seed Template**:
```typescript
// apps/backend/src/scripts/seed{Name}.ts
await prisma.aptitudeTest.create({
  data: {
    title: "Title",
    category: "reasoning",
    company: "TCS",
    duration: 60,
    totalMarks: 100,
    questions: [
      {
        text: "Question?",
        options: [
          { id: 'a', text: "Option A", image: "url?" },
          { id: 'b', text: "Option B" }
        ],
        correctAnswer: 'a',
        explanation: "Why A is correct...",
        marks: 25
      }
    ]
  }
});
```

**Run**: `npm run seed:{name}`

---

## ⚡ Commands

```bash
# Seed tests
npm run seed:tcs-nonverbal
npm run seed:tcs-seating
npm run seed:tcs-reasoning

# Verify
npx ts-node --transpile-only src/scripts/listAllTests.ts

# List API
curl http://localhost:5000/api/placement/aptitude/tests?company=TCS
```

---

## 📊 Stats

- **Tests**: 3 ✅
- **Questions**: 16 ✅
- **Total Marks**: 450 ✅
- **Support**: Images + Text ✅
- **Status**: Live ✅

**Everything Ready!** 🎉
