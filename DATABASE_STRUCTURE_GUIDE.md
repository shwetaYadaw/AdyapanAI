# 📊 Database Structure - Questions & Submissions

## 🗄️ Main Tables

### 1. **Question Table** - Stores All Coding Problems

**Table Name**: `Question`

**What It Stores**: All DSA coding problems (Coding Arena, TCS NQT, etc.)

**Key Fields**:
```typescript
{
  id: string           // Unique ID (UUID)
  title: string        // "Find the smallest number in an array"
  slug: string         // "find-the-smallest-number-in-an-array-tcs-nqt"
  statement: string    // Problem description
  difficulty: string   // "easy", "medium", "hard"
  topics: JSON         // ["array", "searching", "tcs-nqt"]
  companies: JSON      // ["TCS", "Infosys"]
  timeLimit: number    // 2000 ms
  memoryLimit: number  // 256 MB
  inputFormat: string  // How input is provided
  outputFormat: string // How output should be
  constraints: string  // "1 <= n <= 10^5"
  sampleInput: string  // Example input
  sampleOutput: string // Expected output
  templates: JSON      // Starter code for each language
  testCases: JSON      // Array of test cases
  xpReward: number     // 10, 15, 20, etc.
  createdAt: Date
  updatedAt: Date
}
```

**Example Record**:
```json
{
  "id": "abc-123-def-456",
  "title": "Two Sum",
  "slug": "two-sum",
  "difficulty": "easy",
  "topics": ["array", "hash-table"],
  "xpReward": 15,
  "testCases": [
    {
      "input": "[2,7,11,15]\n9",
      "output": "[0,1]",
      "isHidden": false
    }
  ]
}
```

---

### 2. **Submission Table** - Tracks All Student Submissions

**Table Name**: `Submission`

**What It Stores**: Every time a student submits code for a problem

**Key Fields**:
```typescript
{
  id: string           // Unique submission ID
  userId: string       // Which student submitted
  questionId: string   // Which question (links to Question table)
  code: string         // The code student wrote
  language: string     // "javascript", "python", "java", "cpp"
  status: string       // "pending", "accepted", "wrong_answer", 
                       // "compile_error", "runtime_error"
  errorMessage: string // Error details if failed
  runtime: number      // Execution time in ms
  passedCount: number  // How many test cases passed
  totalCount: number   // Total test cases
  createdAt: Date      // When submitted
}
```

**Example Record**:
```json
{
  "id": "sub-789-xyz",
  "userId": "user-123",
  "questionId": "abc-123-def-456",
  "code": "function twoSum(nums, target) { ... }",
  "language": "javascript",
  "status": "accepted",
  "runtime": 45,
  "passedCount": 5,
  "totalCount": 5,
  "createdAt": "2024-07-31T10:30:00Z"
}
```

---

### 3. **StudentProfile Table** - Stores Student Stats

**Table Name**: `StudentProfile`

**What It Stores**: Student's XP, streak, level, skills

**Key Fields**:
```typescript
{
  id: string           // Profile ID
  userId: string       // Which student (links to User table)
  xp: number           // Current XP (used for old logic)
  totalXP: number      // Lifetime XP earned (NEW)
  level: number        // Current level (1, 2, 3...)
  streak: number       // Consecutive days solved (NEW)
  lastActiveDate: Date // Last day solved a problem (NEW)
  skills: JSON         // Student's skills
  resumeUrl: string    // Resume link
  createdAt: Date
  updatedAt: Date
}
```

**Example Record**:
```json
{
  "id": "profile-456",
  "userId": "user-123",
  "xp": 50,
  "totalXP": 50,
  "level": 1,
  "streak": 2,
  "lastActiveDate": "2024-07-31T00:00:00Z"
}
```

---

## 🔗 How Tables Are Connected

### Question → Submission (One-to-Many)
```
Question (1) ----→ Submissions (Many)

One question can have many submissions from different students

Example:
"Two Sum" problem → 100 students submitted → 100 submission records
```

### User → Submission (One-to-Many)
```
User (1) ----→ Submissions (Many)

One student can submit multiple problems

Example:
Student "Sailesh" → Solved 10 problems → 10 submission records
```

### User → StudentProfile (One-to-One)
```
User (1) ----→ StudentProfile (1)

Each user has exactly one profile with their stats

Example:
Student "Sailesh" → 1 profile with XP: 50, Streak: 2
```

---

## 📋 Complete Flow: Student Solves Problem

### Step 1: Student Submits Code
```
POST /api/v1/challenges/questions/:id/submit
Body: { code: "...", language: "javascript" }
```

### Step 2: System Checks Question Table
```sql
SELECT * FROM Question WHERE id = ':id'
-- Gets: testCases, xpReward, timeLimit, etc.
```

### Step 3: Code Runs Against Test Cases
- Execute code with each test case
- Check if output matches expected
- Count passed/failed

### Step 4: Create Submission Record
```sql
INSERT INTO Submission (
  userId, questionId, code, language, 
  status, passedCount, totalCount, runtime
) VALUES (...)
```

### Step 5: If Status = "accepted"
```sql
-- Check if already solved
SELECT * FROM Submission 
WHERE userId = 'user-123' 
  AND questionId = 'question-456' 
  AND status = 'accepted'
  AND id != 'current-submission-id'

-- If NOT found (first time solving):
UPDATE StudentProfile 
SET totalXP = totalXP + xpReward,
    level = FLOOR(totalXP / 100) + 1,
    streak = (calculated based on lastActiveDate),
    lastActiveDate = TODAY
WHERE userId = 'user-123'
```

---

## 🔍 How to Query Your Data

### Get All Questions
```sql
SELECT id, title, slug, difficulty, xpReward 
FROM Question 
ORDER BY createdAt DESC;
```

### Get Student's Submissions
```sql
SELECT s.*, q.title, q.difficulty, q.xpReward
FROM Submission s
JOIN Question q ON s.questionId = q.id
WHERE s.userId = 'your-user-id'
ORDER BY s.createdAt DESC;
```

### Get Student's Solved Problems
```sql
SELECT DISTINCT q.id, q.title, q.xpReward
FROM Submission s
JOIN Question q ON s.questionId = q.id
WHERE s.userId = 'your-user-id' 
  AND s.status = 'accepted'
ORDER BY s.createdAt DESC;
```

### Get Student's Stats
```sql
SELECT 
  totalXP,
  level,
  streak,
  lastActiveDate
FROM StudentProfile
WHERE userId = 'your-user-id';
```

### Check Which Questions User Solved
```sql
SELECT 
  q.title,
  q.slug,
  q.difficulty,
  q.xpReward,
  s.createdAt as solvedAt,
  s.runtime
FROM Submission s
JOIN Question q ON s.questionId = q.id
WHERE s.userId = 'your-user-id' 
  AND s.status = 'accepted'
ORDER BY s.createdAt DESC;
```

### Check XP Earned Per Day
```sql
SELECT 
  DATE(s.createdAt) as date,
  COUNT(*) as problems_solved,
  SUM(q.xpReward) as xp_earned
FROM Submission s
JOIN Question q ON s.questionId = q.id
WHERE s.userId = 'your-user-id' 
  AND s.status = 'accepted'
GROUP BY DATE(s.createdAt)
ORDER BY date DESC;
```

---

## 📊 Where Different Data Lives

| What | Where | Table | Field |
|------|-------|-------|-------|
| Problem title | Question | Question | title |
| Problem difficulty | Question | Question | difficulty |
| Problem XP reward | Question | Question | xpReward |
| Test cases | Question | Question | testCases (JSON) |
| Student's code | Submission | Submission | code |
| Submission status | Submission | Submission | status |
| Pass/fail count | Submission | Submission | passedCount, totalCount |
| Student's total XP | StudentProfile | StudentProfile | totalXP |
| Student's streak | StudentProfile | StudentProfile | streak |
| Student's level | StudentProfile | StudentProfile | level |
| Last solve date | StudentProfile | StudentProfile | lastActiveDate |

---

## 🎯 Your Current Situation

Based on your screenshot showing:
- **XP: 0**
- **Problems Solved: 1**
- **Streak: 0**

### What's Happening:

**✅ Working**:
```sql
-- This is working (shows 1 problem solved)
SELECT COUNT(*) 
FROM Submission 
WHERE userId = 'your-user-id' AND status = 'accepted'
-- Result: 1
```

**❌ Not Working**:
```sql
-- These fields don't exist yet (show 0)
SELECT totalXP, streak, lastActiveDate
FROM StudentProfile
WHERE userId = 'your-user-id'
-- Error: Column 'totalXP' doesn't exist
-- Dashboard shows: 0 (default)
```

### Fix:
Run the SQL migration to add the missing columns:
```sql
ALTER TABLE StudentProfile 
ADD COLUMN totalXP INTEGER DEFAULT 0,
ADD COLUMN streak INTEGER DEFAULT 0,
ADD COLUMN lastActiveDate TIMESTAMP;
```

After running this, solve another problem and XP/streak will update!

---

## 🗺️ Visual Database Diagram

```
┌─────────────────┐
│     User        │
│  id (PK)        │
│  email          │
│  firstName      │
│  role           │
└────────┬────────┘
         │
         │ (1 to 1)
         │
         ▼
┌─────────────────┐
│ StudentProfile  │
│  id (PK)        │
│  userId (FK)────┘
│  totalXP       ◄─── Your XP shows here
│  streak        ◄─── Your streak shows here
│  lastActiveDate
│  level
└─────────────────┘

         │
         │ (1 to Many)
         │
         ▼
┌─────────────────┐       ┌─────────────────┐
│   Submission    │       │    Question     │
│  id (PK)        │       │  id (PK)        │
│  userId (FK)────┘       │  title          │
│  questionId (FK)───────►│  slug           │
│  code           │       │  difficulty     │
│  status         │       │  xpReward      ◄─── XP comes from here
│  passedCount    │       │  testCases     ◄─── Tests run from here
│  totalCount     │       │  topics         │
│  runtime        │       │  companies      │
└─────────────────┘       └─────────────────┘
```

---

## 📝 Summary

1. **Questions** stored in → `Question` table
2. **Submissions** stored in → `Submission` table  
3. **XP/Streak** stored in → `StudentProfile` table
4. **Test Cases** stored in → `Question.testCases` (JSON field)
5. **Your solved problems** → Query `Submission` table with `status='accepted'`

**To see your data**, run SQL queries in Supabase dashboard!

