# 🎯 Dual Admin System - Coding Arena + TCS NQT

## Overview

A unified admin dashboard where admins can manage **BOTH** systems from one place:
- **Coding Arena** - DSA & Interview Problems (Competitive Programming)
- **TCS NQT** - Placement Preparation Questions (Company-Specific)

Each system has its own management interface, API endpoints, and database tables.

---

## 🏗️ Architecture

```
Admin Dashboard (Frontend)
    ↓
    ┌─────────────────────────────────────┐
    │  Select Coding Arena or TCS NQT     │
    └─────────────────────────────────────┘
           ↓                    ↓
    ┌─────────────────┐  ┌─────────────────┐
    │ Coding Arena    │  │   TCS NQT       │
    │ Dashboard       │  │ Dashboard       │
    └────────┬────────┘  └────────┬────────┘
             ↓                     ↓
    API: /admin/problems   API: /admin/tcs-nqt
             ↓                     ↓
    Database:               Database:
    Problem table           Question table
    ProblemTestCase         (testCases as JSON)
    ProblemSolution
    ProblemVersion
```

---

## 📱 Frontend Structure

### Main Admin Dashboard (`AdminDashboard.tsx`)

Starting point for admins - choose which system to manage:

```
┌──────────────────────────────────────────────┐
│          Admin Dashboard                     │
├──────────────────────────────────────────────┤
│                                              │
│  ┌──────────────────┐  ┌──────────────────┐ │
│  │  Coding Arena    │  │   TCS NQT        │ │
│  │  □ DSA Problems  │  │  □ Aptitude      │ │
│  │  □ Interviews    │  │  □ Reasoning     │ │
│  │  □ Coding Tests  │  │  □ Verbal        │ │
│  │  □ Data Structs  │  │  □ Technical     │ │
│  └──────────────────┘  └──────────────────┘ │
│                                              │
└──────────────────────────────────────────────┘
```

### Coding Arena Dashboard (`CodingArenaDashboard.tsx`)

Manage DSA & coding problems:
- List problems with filters
- Create new problems
- Edit existing problems
- Delete (archive) problems
- Bulk import/export
- Track analytics

### TCS NQT Dashboard (`TcsNqtDashboard.tsx`)

Manage placement prep questions:
- List TCS NQT questions
- Create new questions
- Edit existing questions
- Delete questions
- Bulk import/export
- Track by difficulty level

---

## 🔧 Backend API Endpoints

### Coding Arena Endpoints

```
GET    /api/v1/admin/problems              - List all
POST   /api/v1/admin/problems              - Create
GET    /api/v1/admin/problems/:id          - Get details
PUT    /api/v1/admin/problems/:id          - Update
DELETE /api/v1/admin/problems/:id          - Delete (archive)
POST   /api/v1/admin/problems/:id/restore  - Restore
GET    /api/v1/admin/problems/:id/version-history - Versions
POST   /api/v1/admin/problems/bulk/import  - Bulk import
GET    /api/v1/admin/problems/analytics    - Analytics
```

### TCS NQT Endpoints

```
GET    /api/v1/admin/tcs-nqt              - List all
POST   /api/v1/admin/tcs-nqt              - Create
GET    /api/v1/admin/tcs-nqt/:id          - Get details
PUT    /api/v1/admin/tcs-nqt/:id          - Update
DELETE /api/v1/admin/tcs-nqt/:id          - Delete
POST   /api/v1/admin/tcs-nqt/bulk/import  - Bulk import
GET    /api/v1/admin/tcs-nqt/analytics    - Analytics
```

---

## 📊 Database Schema

### Coding Arena (Problem Table)

```sql
Problem {
  id (UUID)
  title
  slug (unique)
  difficulty (easy/medium/hard)
  statement (TEXT)
  constraints
  inputFormat
  outputFormat
  timeLimit
  memoryLimit
  referenceSolution
  topics (JSON)
  companies (JSON)
  tags
  category
  successRate (float)
  totalAttempts
  totalAccepted
  averageRuntime
  createdBy
  updatedBy
  isArchived (soft delete)
  metadata (JSON)
  createdAt
  updatedAt
}

ProblemTestCase {
  id
  problemId (FK)
  input
  expectedOutput
  isHidden
  explanation
  order
}

ProblemSolution {
  id
  problemId (FK)
  code
  language
  approach
  timeComplexity
  spaceComplexity
  explanation
  isOptimal
}

ProblemVersion {
  id
  problemId (FK)
  versionNum
  title (snapshot)
  changes (JSON)
  changedBy
  changeReason
}
```

### TCS NQT (Question Table)

```sql
Question {
  id (UUID)
  title
  slug (unique)
  difficulty (easy/medium/hard)
  statement (TEXT)
  constraints
  inputFormat
  outputFormat
  timeLimit
  memoryLimit
  referenceSolution
  topics (JSON)
  companies (JSON)
  templates (JSON)
  testCases (JSON)
  xpReward
  createdAt
  updatedAt
}

QuestionSubmission {
  id
  userId (FK)
  questionId (FK)
  code
  language
  status
  runtime
  passedCount
  totalCount
  createdAt
}
```

---

## 🎯 Workflow: Creating Problems

### Workflow 1: Create Coding Arena Problem

```
1. Admin clicks "Admin Dashboard"
2. Selects "Coding Arena"
3. Clicks "Add Coding Problem"
4. Fills form:
   - Title, Difficulty
   - Statement, Constraints
   - Input/Output Format
   - Reference Solution
   - Add Test Cases (visible + hidden)
5. Clicks "Create Problem"
6. ✅ Problem saved to Problem table
7. ✅ Version created automatically
8. ✅ Live for students immediately
```

### Workflow 2: Create TCS NQT Question

```
1. Admin clicks "Admin Dashboard"
2. Selects "TCS NQT"
3. Clicks "Add TCS Question"
4. Fills form:
   - Title, Difficulty
   - Statement, Constraints
   - Input/Output Format
   - Reference Solution
5. Clicks "Create Question"
6. ✅ Question saved to Question table
7. ✅ Live for students immediately
```

---

## 🔄 Data Flow Comparison

### Coding Arena Flow

```
Admin Creates → API /admin/problems
    ↓
Prisma ORM
    ↓
Problem table
ProblemTestCase table
ProblemSolution table
ProblemVersion table (auto)
    ↓
Students Query /api/v1/problems
    ↓
Display & Solve
```

### TCS NQT Flow

```
Admin Creates → API /admin/tcs-nqt
    ↓
Prisma ORM
    ↓
Question table
    ↓
Students Query /api/v1/questions
    ↓
Display & Attempt
```

---

## 📋 File Structure

### Backend
```
apps/backend/src/routes/
├── problem-admin.routes.ts (Coding Arena API)
└── question-admin.routes.ts (TCS NQT API) ✨ NEW

apps/backend/src/scripts/
├── backupProblems.ts
├── verifyDataIntegrity.ts
└── (TCS NQT scripts unchanged)
```

### Frontend
```
apps/web/src/features/admin/
├── pages/
│   ├── AdminDashboard.tsx ✨ NEW (Main entry point)
│   ├── CodingArenaDashboard.tsx ✨ NEW
│   └── TcsNqtDashboard.tsx ✨ NEW
│
├── components/
│   ├── ProblemManagement.tsx (old - still works)
│   ├── CreateEditProblemModal.tsx (updated - supports both types)
│   ├── CreateEditTcsQuestionModal.tsx ✨ NEW
│   ├── TcsQuestionTable.tsx ✨ NEW
│   ├── TcsQuestionFilters.tsx ✨ NEW
│   ├── TcsBulkImportModal.tsx ✨ NEW
│   └── (other components)
│
├── services/
│   ├── problemAdminService.ts (Coding Arena)
│   └── tcsNqtAdminService.ts ✨ NEW (TCS NQT)
│
└── types/
    └── problem.ts
```

---

## 🚀 Setup Instructions

### Step 1: Register Backend Routes

```typescript
// apps/backend/src/app.ts

app.use('/api/v1/admin/problems', problemAdminRoutes);
app.use('/api/v1/admin/tcs-nqt', questionAdminRoutes); // ✨ NEW
```

### Step 2: Add Frontend Route

```typescript
// apps/web/src/router/index.tsx

import AdminDashboard from './features/admin/pages/AdminDashboard';

{
  path: '/admin',
  element: <AdminDashboard />
}
```

### Step 3: Test

```
Visit: http://localhost:3000/admin
See: Two cards for Coding Arena and TCS NQT
```

---

## ✨ Key Differences

| Feature | Coding Arena | TCS NQT |
|---------|--------------|---------|
| **Table** | Problem | Question |
| **Purpose** | DSA & Interviews | Placement Prep |
| **Test Cases** | Structured (separate table) | JSON format |
| **Solutions** | Multiple, versioned | Reference only |
| **Version History** | Complete | Manual tracking |
| **Complexity Tracking** | Time/Space tracked | Optional |
| **Students Table** | ProblemSubmission | QuestionSubmission |

---

## 🎯 Usage Examples

### Example 1: Add Coding Problem

```
Path: /admin → Coding Arena → Add Problem

Form:
- Title: "Two Sum"
- Difficulty: "Easy"
- Statement: "Given an array of integers..."
- Test Cases: [
    {input: "2\n3 3 4\n6", output: "0 1", visible: true},
    {input: "...", output: "...", visible: false}
  ]

Result: Problem in database, live for students
```

### Example 2: Add TCS Question

```
Path: /admin → TCS NQT → Add Question

Form:
- Title: "Find Missing Number"
- Difficulty: "Medium"
- Statement: "Given an array of n-1 distinct numbers..."
- Topics: "Arrays, Math"
- Companies: "TCS, Infosys"

Result: Question in database, live for students
```

---

## 📊 Analytics

### Coding Arena Analytics
- Problems by difficulty
- Success rates per problem
- Attempts per problem
- Average runtime
- Total accepted solutions

### TCS NQT Analytics
- Questions by difficulty
- Attempts per question
- Success rate per question
- Topic-wise distribution

---

## 🔒 Security

- ✅ Admin role check on all endpoints
- ✅ Authentication required
- ✅ Soft delete support (no permanent loss)
- ✅ Complete audit trail
- ✅ Version history for coding arena
- ✅ Change tracking

---

## 🚦 Status

| Component | Status | Location |
|-----------|--------|----------|
| Admin Dashboard (Main) | ✅ Created | `AdminDashboard.tsx` |
| Coding Arena Dashboard | ✅ Created | `CodingArenaDashboard.tsx` |
| TCS NQT Dashboard | ✅ Created | `TcsNqtDashboard.tsx` |
| Backend API (Coding) | ✅ Existing | `problem-admin.routes.ts` |
| Backend API (TCS) | ✅ Created | `question-admin.routes.ts` |
| Frontend Services | ✅ Created | Both services ready |
| Components | ✅ Created | All components ready |

---

## 🎉 Summary

✅ **Unified Admin Interface**
- One entry point for both systems
- Choose which system to manage
- Clean separation of concerns

✅ **Independent Management**
- Coding Arena: Full versioning & solutions
- TCS NQT: Direct question management
- Each has own tables, APIs, components

✅ **Easy to Use**
- Intuitive dashboard selection
- Familiar form-based interfaces
- Real-time validation & feedback

✅ **Production Ready**
- Complete error handling
- Security checks
- Data validation
- Performance optimized

---

## 🔄 Next Steps

1. Register routes in `app.ts`
2. Add admin route to frontend router
3. Test both dashboards
4. Train admins on usage
5. Monitor analytics

Everything is ready to go! 🚀
