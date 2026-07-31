# 📚 TCS NQT & Aptitude: Database vs Hardcoded

## Quick Answer

| Section | Questions Source | Can Edit Without Code? |
|---------|-----------------|----------------------|
| **TCS NQT** | ✅ DATABASE | ✅ Yes (via admin panel) |
| **Aptitude** | ❌ HARDCODED | ❌ No (need code change) |

---

## 🎯 TCS NQT Prep

### Source: ✅ DATABASE

**Location**: `/student/tcs-nqt`

**How It Works**:
```typescript
// Fetches from database
const { data } = await api.get('/challenges/questions');

// Filters for TCS NQT questions
return data.filter(q => q.topics.includes('tcs-nqt'));
```

### Evidence:
```typescript
// File: apps/web/src/pages/student/TcsNqtPrepPage.tsx (line 133)
queryFn: async () => {
  const { data } = await api.get('/challenges/questions'); // ← DATABASE
  return (data.data || [])
    .filter((question) => question.topics?.includes('tcs-nqt'));
}
```

### How To Add TCS NQT Questions:

**Option 1: Admin Panel** ✅ Recommended
```
1. Login as admin
2. Go to /admin/problems
3. Click "Create Problem"
4. Add topics: ["tcs-nqt", "array"] ← MUST include "tcs-nqt"
5. Save → Appears automatically on TCS NQT page!
```

**Option 2: Tell Your Friend**
```
When adding questions to database:
- MUST include topic: "tcs-nqt"
- Add category topic: "array", "string", "number", etc.
- Questions will appear automatically!
```

### Category Filtering:
```typescript
// Dynamic filtering based on topics
'arrays': questions with ['array', 'arrays'] in topics
'numbers': questions with ['number', 'math'] in topics  
'strings': questions with ['string', 'strings'] in topics
'sorting': questions with ['sorting', 'sort'] in topics
'number-system': questions with ['number-system', 'binary'] in topics
```

### ✅ Benefits:
- Add questions without code changes
- Edit anytime via admin panel
- Dynamic loading
- Scalable

---

## 📝 Aptitude Prep

### Source: ❌ HARDCODED

**Location**: `/student/aptitude`

**How It Works**:
```typescript
// Hardcoded in the file
export const TCS_NUMERICAL_TOPICS: Topic[] = [
  {
    name: 'Percentage',
    pageNumber: 4,
    questions: [
      {
        question: 'A number is increased by 25%...',
        options: ['450', '480', '500', '520'],
        answer: '480',
        explanation: 'Let x + 0.25x = 600...'
      },
      // ... more questions
    ]
  },
  // ... more topics
];
```

### Evidence:
```typescript
// File: apps/web/src/pages/student/AptitudePage.tsx (line 7)
import { topicSlug, Question, Topic } from './aptitudeData'; // ← HARDCODED

// File: apps/web/src/pages/student/aptitudeData.ts
// Contains all questions hardcoded in arrays
```

### How To Add Aptitude Questions:

**Current Method: Edit Code** ❌
```typescript
// File: apps/web/src/pages/student/aptitudeData.ts
export const TCS_NUMERICAL_TOPICS: Topic[] = [
  {
    name: 'Percentage',
    questions: [
      // Add new question here
      {
        question: 'Your new question...',
        options: ['A', 'B', 'C', 'D'],
        answer: 'A',
        explanation: '...'
      }
    ]
  }
];
```

### ❌ Limitations:
- Must edit code files
- Need to redeploy frontend
- Not scalable
- No admin panel

### 🔄 To Make It Dynamic:

**Would Need**:
1. Create `AptitudeQuestion` table in database
2. Create API endpoint: `GET /api/v1/aptitude/questions`
3. Create admin panel for aptitude questions
4. Update frontend to fetch from API instead of hardcoded array

---

## 📊 Detailed Comparison

### TCS NQT (Database)

**File**: `apps/web/src/pages/student/TcsNqtPrepPage.tsx`

```typescript
// ✅ Loads from database
const { data: storedQuestions } = useQuery({
  queryKey: ['tcsNqtQuestions'],
  queryFn: async () => {
    const { data } = await api.get('/challenges/questions'); // DATABASE
    return data.data.filter(q => q.topics?.includes('tcs-nqt'));
  }
});
```

**Storage**: PostgreSQL → `Question` table

**Admin Panel**: ✅ Yes (`/admin/problems`)

**API Endpoint**: ✅ `GET /api/v1/challenges/questions`

**Editable**: ✅ Yes, anytime without code changes

---

### Aptitude (Hardcoded)

**File**: `apps/web/src/pages/student/aptitudeData.ts`

```typescript
// ❌ Hardcoded array
export const TCS_NUMERICAL_TOPICS: Topic[] = [
  {
    name: 'Percentage',
    pageNumber: 4,
    questions: [ /* 20+ hardcoded questions */ ]
  },
  {
    name: 'Numbers',
    pageNumber: 93,
    questions: [ /* more hardcoded questions */ ]
  }
  // ... more topics
];
```

**Storage**: Frontend code file

**Admin Panel**: ❌ No

**API Endpoint**: ❌ No

**Editable**: ❌ Only by editing code and redeploying

---

## 🎯 Your Situation

### ✅ TCS NQT: Working Great
- Questions in database
- New questions appear automatically
- Admin can add via panel
- Your friend can add via database

### ❌ Aptitude: Static
- Questions hardcoded in code
- To add new questions → must edit code
- No admin panel
- Need frontend redeploy

---

## 💡 Recommendation

### For TCS NQT:
✅ **Keep using database** - it's perfect!

**To add questions**:
1. Use admin panel at `/admin/problems`
2. Include topics: `["tcs-nqt", "array"]`
3. Questions appear automatically!

### For Aptitude:
⚠️ **Consider migrating to database**

**Benefits**:
- Admin can add questions via panel
- No code changes needed
- Scalable to thousands of questions
- Consistent with TCS NQT approach

**Effort Required**:
1. Create database table (30 min)
2. Create API endpoints (1 hour)
3. Create admin panel (2 hours)
4. Update frontend to fetch from API (1 hour)
**Total**: ~4-5 hours

---

## 📋 Summary

| Feature | TCS NQT | Aptitude |
|---------|---------|----------|
| **Data Source** | Database | Hardcoded |
| **Questions Count** | Dynamic | Fixed (~100+) |
| **Admin Panel** | Yes | No |
| **API Endpoint** | Yes | No |
| **Add Without Code** | Yes ✓ | No ✗ |
| **Your Friend Can Add** | Yes ✓ | No ✗ |
| **Recommended** | Current ✓ | Migrate to DB |

---

**TL;DR**: 
- **TCS NQT** = Database ✅ (Dynamic, Admin Panel, Easy to Add)
- **Aptitude** = Hardcoded ❌ (Static, Need Code Change)

