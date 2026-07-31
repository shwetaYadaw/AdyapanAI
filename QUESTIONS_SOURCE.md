# 📚 Questions Source: Database vs Hardcoded

## ✅ Questions Are Stored in DATABASE

All coding questions in your platform are stored in the **PostgreSQL database** (Supabase), NOT hardcoded.

---

## 🗄️ How It Works

### Questions Flow

```
Student visits /student/challenges
         ↓
Frontend calls GET /api/v1/challenges/questions
         ↓
Backend queries database: prisma.question.findMany()
         ↓
Returns questions from "Question" table
         ↓
Frontend displays the list
```

### Code Evidence

**File**: `apps/backend/src/routes/challenge.routes.ts`

```typescript
// GET /challenges/questions — List coding questions
router.get('/questions', async (req, res, next) => {
  try {
    // Retrieve all questions FROM DATABASE
    const questions = await prisma.question.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        difficulty: true,
        topics: true,
        companies: true,
        xpReward: true,
        createdAt: true,
      },
    });
    
    // Return from database
    sendSuccess({ res, data: questions });
  } catch (err) {
    next(err);
  }
});
```

**Key Line**: `prisma.question.findMany()` 
- This queries the **"Question" table** in your PostgreSQL database
- NOT reading from a hardcoded array

---

## 📊 Database vs Hardcoded Comparison

### ✅ What's in DATABASE

| Feature | Stored Where | Editable? |
|---------|--------------|-----------|
| **Questions** | Database (`Question` table) | ✅ Yes, via admin panel |
| **Submissions** | Database (`Submission` table) | ✅ Auto-created on submit |
| **Test Cases** | Database (`Question.testCases` JSON) | ✅ Yes, via admin panel |
| **XP Rewards** | Database (`Question.xpReward`) | ✅ Yes, editable |
| **Contests** | Database (`Contest` table) | ✅ Yes, via admin panel |
| **Problems** | Database (`Problem` table) | ✅ Yes, via admin panel |
| **User Data** | Database (`User`, `StudentProfile`) | ✅ Yes, auto-updated |

### ❌ What's HARDCODED (Static)

| Feature | Location | Editable? |
|---------|----------|-----------|
| **TCS NQT Categories** | `TcsNqtPrepPage.tsx` | ❌ Need code change |
| **Quick Start Cards** | `DashboardPage.tsx` | ❌ Need code change |
| **Sidebar Navigation** | `Sidebar.tsx` | ❌ Need code change |
| **Difficulty Levels** | Code (`easy/medium/hard`) | ❌ Need code change |
| **Language Support** | Code (`javascript/python/java/cpp`) | ❌ Need code change |

---

## 🎯 How Questions Get Into Database

### Option 1: Admin Panel (Recommended)
```
1. Login as admin
2. Go to /admin/problems
3. Click "Create Problem"
4. Fill form (title, difficulty, test cases, etc.)
5. Save → Stored in database ✓
```

### Option 2: Database Scripts
```bash
# Run a script that inserts questions
cd apps/backend
ts-node scripts/create-questions.ts
```

### Option 3: Direct SQL
```sql
INSERT INTO "Question" (
  id, title, slug, difficulty, topics, 
  testCases, xpReward, statement, ...
) VALUES (...);
```

---

## 📍 Where Questions Are Used

### 1. Coding Arena (`/student/challenges`)
```typescript
// Frontend: apps/web/src/pages/student/CodingChallengesPage.tsx
const { data: questions } = useQuery({
  queryKey: ['codingQuestions'],
  queryFn: async () => {
    const { data } = await api.get('/challenges/questions'); // ← DATABASE
    return data.data;
  }
});
```

### 2. TCS NQT Prep (`/student/tcs-nqt`)
```typescript
// Frontend: apps/web/src/pages/student/TcsNqtPrepPage.tsx
const { data: storedQuestions } = useQuery({
  queryKey: ['tcsNqtQuestions'],
  queryFn: async () => {
    const { data } = await api.get('/challenges/questions'); // ← DATABASE
    return data.data.filter(q => q.topics.includes('tcs-nqt'));
  }
});
```

### 3. Problem Solving Page (`/student/challenges/:slug`)
```typescript
// Backend: apps/backend/src/routes/challenge.routes.ts
router.get('/questions/:slug', async (req, res, next) => {
  const question = await prisma.question.findUnique({ // ← DATABASE
    where: { slug: req.params.slug }
  });
  sendSuccess({ res, data: question });
});
```

---

## 🔍 How to Verify

### Check If Questions Are in Database

**Method 1: API Call**
```bash
curl http://localhost:5000/api/v1/challenges/questions
# Returns JSON array of questions from database
```

**Method 2: Supabase Dashboard**
1. Go to https://supabase.com
2. Select your project
3. Go to "Table Editor"
4. Click on "Question" table
5. See all questions stored there

**Method 3: SQL Query**
```sql
SELECT id, title, slug, difficulty, xpReward 
FROM "Question" 
LIMIT 10;
```

---

## 📝 Summary

### ✅ Database (Dynamic - Can Edit Without Code)
- **All coding questions**
- **Test cases**
- **Submissions**
- **User profiles**
- **Contests**
- **XP rewards**

### ❌ Hardcoded (Static - Need Code Change)
- **Page layouts**
- **Navigation menus**
- **UI components**
- **Category labels**
- **Supported languages list**

---

## 🎉 Benefits of Database Storage

✅ **Dynamic**: Add/edit/delete questions without redeploying code  
✅ **Scalable**: Can have thousands of questions  
✅ **Manageable**: Admin panel to manage all questions  
✅ **Searchable**: Filter by difficulty, topic, company  
✅ **Trackable**: Know which questions users solved  
✅ **Updatable**: Fix test cases or XP rewards anytime  

---

## ⚠️ Exception: TCS NQT Category Grouping

While TCS NQT questions themselves are in the database, the **category tabs** (Arrays, Numbers, Strings, etc.) are currently **hardcoded** in the frontend.

**Why I Fixed It Recently**:
- Before: Only questions with slugs in hardcoded arrays would show
- After: All questions with `tcs-nqt` topic show automatically

**Current State**:
- Questions: ✅ Database
- Category filtering: ✅ Dynamic (based on topics)
- Category tab names: ❌ Still hardcoded (but doesn't block new questions)

---

**Answer**: Questions are **100% stored in the DATABASE** (PostgreSQL/Supabase), fetched dynamically via API calls. They are NOT hardcoded! 🎉

