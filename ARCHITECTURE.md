# Architecture: Professional Problem Management System

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        ADYAPAN PLATFORM                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                    WEB FRONTEND (React)                     │  │
│  │                                                             │  │
│  │  ┌────────────────┐  ┌──────────────────┐  ┌───────────┐  │  │
│  │  │  Student UI    │  │  Admin Dashboard │  │ Analytics │  │  │
│  │  │  ✓ Problems    │  │  ✓ Create        │  │ Dashboard │  │  │
│  │  │  ✓ Submit Code │  │  ✓ Edit          │  └───────────┘  │  │
│  │  │  ✓ View Results│  │  ✓ Delete/Archive│                  │  │
│  │  │  ✓ Leaderboard │  │  ✓ Bulk Import   │                  │  │
│  │  │  ✓ Submissions │  │  ✓ Version History                │  │
│  │  └────────────────┘  └──────────────────┘                  │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                              ↑                                      │
│                     HTTP / REST API                                │
│                              ↓                                      │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                    BACKEND (Node.js/Express)               │  │
│  │                                                             │  │
│  │  API Layer:                                                 │  │
│  │  ├─ /api/v1/problems (Student endpoints)                   │  │
│  │  │  ├─ GET / - List problems                               │  │
│  │  │  ├─ GET /:id - Get problem details                      │  │
│  │  │  ├─ POST /:id/run - Run code                            │  │
│  │  │  └─ POST /:id/submit - Submit solution                  │  │
│  │  │                                                           │  │
│  │  └─ /api/v1/admin/problems (Admin endpoints) ✨ NEW        │  │
│  │     ├─ GET / - List all problems (filtered)                │  │
│  │     ├─ POST / - Create problem                             │  │
│  │     ├─ PUT /:id - Update problem                           │  │
│  │     ├─ DELETE /:id - Archive problem                       │  │
│  │     ├─ POST /:id/restore - Restore problem                 │  │
│  │     ├─ GET /:id/version-history - View versions            │  │
│  │     ├─ POST /bulk/import - Import problems                 │  │
│  │     └─ GET /analytics/overview - Analytics                 │  │
│  │                                                              │  │
│  │  Services:                                                  │  │
│  │  ├─ problemAdminService (CRUD operations)                  │  │
│  │  ├─ JudgeService (Code execution)                          │  │
│  │  ├─ QueueService (Async submissions)                       │  │
│  │  └─ ValidationService (Input validation)                   │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                              ↑                                      │
│                        Prisma ORM                                  │
│                              ↓                                      │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │              DATABASE (PostgreSQL/MySQL)                    │  │
│  │                                                             │  │
│  │  Core Tables:                                               │  │
│  │  ├─ User                                                     │  │
│  │  ├─ StudentProfile                                          │  │
│  │  ├─ Problem ⭐ Enhanced                                     │  │
│  │  ├─ ProblemTestCase ⭐ Enhanced                             │  │
│  │  ├─ ProblemSolution ✨ NEW                                  │  │
│  │  ├─ ProblemVersion ✨ NEW (Version History)                 │  │
│  │  ├─ Submission (Legacy)                                     │  │
│  │  ├─ ProblemSubmission                                       │  │
│  │  └─ Question (TCS NQT)                                      │  │
│  │                                                             │  │
│  │  What's preserved:                                          │  │
│  │  ✅ All 469+ existing problems                              │  │
│  │  ✅ All test cases                                          │  │
│  │  ✅ All submissions                                         │  │
│  │  ✅ User data                                               │  │
│  │  ✅ Scoring & analytics                                     │  │
│  │                                                             │  │
│  │  What's new:                                                │  │
│  │  ✨ Version history                                         │  │
│  │  ✨ Solution management                                     │  │
│  │  ✨ Enhanced analytics                                      │  │
│  │  ✨ Soft delete tracking                                    │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### Student Problem Solving (Existing - Unchanged)

```
Student UI
    ↓
GET /api/v1/problems
    ↓
ProblemService.getProblems()
    ↓
Query Problem + visible TestCases
    ↓
Return problem with sample test cases
    ↓
Student sees: Title, Description, Examples
    ↓
Student submits code
    ↓
POST /api/v1/problems/:id/submit
    ↓
QueueService.enqueue()
    ↓
Judge evaluates against ALL test cases (visible + hidden)
    ↓
Update Submission status
    ↓
Return result to student
```

### Admin Problem Management (NEW)

```
Admin Dashboard
    ↓
GET /api/v1/admin/problems
    ↓
problemAdminService.getProblems(filters)
    ↓
Query all problems (admin can see everything)
    ↓
Display table with controls
    ↓
Admin clicks "Edit"
    ↓
GET /api/v1/admin/problems/:id
    ↓
Return complete problem including:
  - Title, Statement
  - ALL test cases (visible + hidden)
  - Solutions
  - Version history
    ↓
Admin modifies problem
    ↓
PUT /api/v1/admin/problems/:id
    ↓
Transaction:
  1. Update Problem record
  2. Update TestCases if modified
  3. Create new ProblemVersion
  4. Record changes
    ↓
Return updated problem
    ↓
Dashboard refreshes
```

### Bulk Import Workflow (NEW)

```
Admin uploads JSON file
    ↓
BulkImportModal parses JSON
    ↓
POST /api/v1/admin/problems/bulk/import
    ↓
For each problem in array:
  1. Validate required fields
  2. Check if slug exists
  3. Create problem
  4. Add test cases
  5. Create initial version
    ↓
Collect results:
  - Created: X
  - Skipped: Y
  - Errors: Z
    ↓
Return summary
    ↓
Dashboard shows results
```

---

## Database Schema (Enhanced)

### Before (Existing)

```
Problem
├── id (PK)
├── title
├── slug
├── statement
├── difficulty
├── topics (JSON)
├── companies (JSON)
├── timeLimit
├── memoryLimit
├── testCases (JSON - ❌ Not ideal)
└── createdAt, updatedAt

ProblemTestCase
├── id (PK)
├── problemId (FK)
├── input
├── expectedOutput
├── isHidden
└── type
```

### After (Enhanced) ✨

```
Problem
├── id (PK)
├── title
├── slug
├── statement
├── difficulty
├── topics
├── companies
├── timeLimit
├── memoryLimit
├── starterCode
├── referenceSolution
├── tags ✨ NEW
├── category ✨ NEW
├── successRate ✨ NEW (auto-calculated)
├── totalAttempts ✨ NEW
├── totalAccepted ✨ NEW
├── averageRuntime ✨ NEW
├── createdBy ✨ NEW
├── updatedBy ✨ NEW
├── isArchived ✨ NEW (soft delete)
├── metadata ✨ NEW (custom)
└── createdAt, updatedAt

ProblemTestCase
├── id (PK)
├── problemId (FK)
├── input
├── expectedOutput
├── isHidden
├── type
├── explanation ✨ NEW
└── order ✨ NEW

ProblemSolution ✨ NEW TABLE
├── id (PK)
├── problemId (FK)
├── code
├── language
├── approach
├── timeComplexity
├── spaceComplexity
├── explanation
├── isOptimal
├── rating
├── createdBy
├── versionNumber
└── isActive

ProblemVersion ✨ NEW TABLE
├── id (PK)
├── problemId (FK)
├── versionNum
├── title (snapshot)
├── statement (snapshot)
├── difficulty (snapshot)
├── changes (what changed)
├── changedBy
├── changeReason
└── createdAt
```

---

## API Endpoint Map

### Student Endpoints (Existing - Unchanged)

```
GET /api/v1/problems
  ├─ List all problems
  ├─ Filters: difficulty, category, topic
  ├─ Pagination: page, limit
  └─ Response: problems array (visible test cases only)

GET /api/v1/problems/:id
  ├─ Get problem details
  └─ Response: problem with sample test cases

POST /api/v1/problems/:id/run
  ├─ Run code against visible test cases
  ├─ Body: { code, language }
  └─ Response: test result (passed/failed/error)

POST /api/v1/problems/:id/submit
  ├─ Submit solution for grading
  ├─ Body: { code, language }
  └─ Response: submission ID (async processing)

GET /api/v1/submissions/:id
  ├─ Get submission result
  └─ Response: submission status with results
```

### Admin Endpoints (NEW)

```
GET /api/v1/admin/problems
  ├─ List all problems (admin can see everything)
  ├─ Filters: search, difficulty, category, tags
  ├─ Pagination: page, limit
  └─ Response: problems with counts

POST /api/v1/admin/problems
  ├─ Create new problem
  ├─ Body: complete problem object
  └─ Response: created problem

GET /api/v1/admin/problems/:id
  ├─ Get full problem details (including hidden test cases)
  ├─ Include: testCases, solutions, versionHistory
  └─ Response: complete problem object

PUT /api/v1/admin/problems/:id
  ├─ Update problem
  ├─ Body: partial problem object + changeReason
  └─ Response: updated problem + new version created

DELETE /api/v1/admin/problems/:id
  ├─ Archive problem (soft delete)
  └─ Response: success message

POST /api/v1/admin/problems/:id/restore
  ├─ Restore archived problem
  └─ Response: restored problem

GET /api/v1/admin/problems/:id/version-history
  ├─ Get all versions of a problem
  └─ Response: array of versions

POST /api/v1/admin/problems/bulk/import
  ├─ Import multiple problems from JSON
  ├─ Body: { problems: array }
  └─ Response: { created, skipped, results }

GET /api/v1/admin/problems/analytics/overview
  ├─ Get platform analytics
  ├─ Includes: problems by difficulty, category
  ├─ Includes: statistics (success rate, attempts)
  └─ Response: analytics object
```

---

## Component Hierarchy

```
App
├── Router
│   ├── StudentPages
│   │   ├── ProblemsPage
│   │   ├── ProblemDetail
│   │   ├── SubmitPage
│   │   └── SubmissionsPage
│   │
│   └── AdminPages ✨ NEW
│       └── ProblemManagement
│           ├── ProblemTable
│           │   └── ProblemRow (with action buttons)
│           ├── ProblemFilters
│           ├── CreateEditProblemModal
│           │   ├── ProblemForm
│           │   └── TestCaseManager
│           └── BulkImportModal
│               ├── FileUploader
│               └── JsonEditor
```

---

## State Management

### Redux Store (if using Redux)

```
store/
├── problems/
│   ├── studentSlice (list, filter)
│   │   └── state: {
│   │       problems: [],
│   │       filters: {},
│   │       pagination: {}
│   │     }
│   │
│   └── adminSlice ✨ NEW
│       └── state: {
│           problems: [],
│           selectedProblem: {},
│           filters: {},
│           pagination: {},
│           loading: false,
│           error: null,
│           versions: []
│         }
│
├── submissions/
│   └── state: {
│       submissions: [],
│       currentSubmission: {}
│     }
│
└── ui/
    └── state: {
        modals: {
          createProblem: false,
          bulkImport: false
        }
      }
```

---

## File Organization

```
Backend:
apps/backend/
├── src/
│   ├── config/
│   │   └── prisma.ts (PrismaClient)
│   │
│   ├── routes/
│   │   ├── problem.routes.ts (Student API)
│   │   └── problem-admin.routes.ts ✨ NEW (Admin API)
│   │
│   ├── services/
│   │   ├── judge.service.ts (Code execution)
│   │   ├── queue.service.ts (Async jobs)
│   │   └── problemAdminService.ts ✨ NEW
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   └── errorHandler.middleware.ts
│   │
│   ├── utils/
│   │   └── response.utils.ts
│   │
│   ├── scripts/
│   │   ├── seed.ts (Existing)
│   │   ├── backupProblems.ts ✨ NEW
│   │   └── verifyDataIntegrity.ts ✨ NEW
│   │
│   └── app.ts (Route registration)
│
├── prisma/
│   ├── schema.prisma (Database schema)
│   └── migrations/
│       ├── 20260715133359_init/
│       └── 20260802_add_professional_features/ ✨ NEW
│
└── backups/ (Created after backup)

Frontend:
apps/web/src/
├── features/
│   ├── problems/ (Existing Student features)
│   │
│   └── admin/ ✨ NEW
│       ├── pages/
│       │   └── ProblemManagement.tsx
│       │
│       ├── components/
│       │   ├── ProblemTable.tsx
│       │   ├── ProblemFilters.tsx
│       │   ├── CreateEditProblemModal.tsx
│       │   └── BulkImportModal.tsx
│       │
│       ├── services/
│       │   └── problemAdminService.ts
│       │
│       └── types/
│           └── problem.ts
│
└── router/
    └── index.tsx (Route definitions)
```

---

## Deployment Architecture

### Pre-Deployment

```
1. Backup
   └─ npm run backup:problems
   └─ Copy backup to safe location

2. Test Locally
   └─ npm run dev:backend
   └─ npm run dev:web
   └─ Verify admin dashboard works
   └─ Test CRUD operations

3. Verify Data
   └─ npm run verify:data
   └─ Confirms all data preserved
```

### Deployment Steps

```
1. Database Migration
   └─ npx prisma migrate deploy
   └─ Creates new tables/fields

2. Backend Deployment
   └─ npm run build
   └─ Deploy to production
   └─ Environment variables updated

3. Frontend Deployment
   └─ npm run build
   └─ Deploy to CDN/hosting
   └─ Route updated

4. Post-Deployment
   └─ Verify all problems display
   └─ Test student submissions
   └─ Test admin dashboard
   └─ Check analytics
```

---

## Security Model

```
┌─────────────────────────────────────────┐
│         API Request                     │
├─────────────────────────────────────────┤
│ ↓                                       │
│ Authentication Middleware               │
│   - Check JWT token                    │
│   - Verify user exists                 │
│ ↓                                       │
│ Authorization Check                     │
│   - Student endpoints: any user        │
│   - Admin endpoints: role == 'admin'   │
│ ↓                                       │
│ Request Validation                      │
│   - Validate input data                │
│   - Check required fields              │
│   - Type validation                    │
│ ↓                                       │
│ Business Logic                          │
│   - Execute operation                  │
│ ↓                                       │
│ Database Transaction                    │
│   - Atomic operation                   │
│   - Rollback on error                  │
│ ↓                                       │
│ Error Handler                           │
│   - Catch all errors                   │
│   - Log errors                         │
│   - Return error response              │
│ ↓                                       │
│ Success Response                        │
└─────────────────────────────────────────┘
```

---

## Scalability Roadmap

```
Phase 1: Current (Professional)
└─ Admin dashboard
└─ Version history
└─ Bulk operations
└─ Analytics basics

Phase 2: Optimization (Next Quarter)
├─ Add Redis caching
├─ Implement full-text search
├─ Add advanced analytics
└─ Optimize database queries

Phase 3: Features (Later)
├─ Editorial solutions ranking
├─ Company-wise filtering
├─ Interview prep tracks
├─ Discussion forums
└─ AI-powered recommendations

Phase 4: Enterprise (Future)
├─ Multi-workspace support
├─ Custom branding
├─ SSO integration
├─ Advanced reporting
└─ Team management
```

---

## Conclusion

✅ **Professional, scalable architecture**
✅ **Zero data loss design**
✅ **Admin dashboard ready**
✅ **Version history included**
✅ **Easy to extend**
✅ **Production-ready**

All components are in place. Just follow the setup guide!
