# TCS NQT Questions - Database-Driven Approach

## ✅ What Changed

TCS NQT questions are now **database-driven** instead of hardcoded. They can be managed dynamically through:
- Admin API endpoints
- JSON file imports
- Direct database operations

## 📁 New Files Created

### 1. **JSON Data File**
**Location**: `apps/backend/src/data/tcs-nqt-questions.json`
- Contains all 101 TCS NQT questions
- Format: Array of question objects with title, difficulty, category
- Easy to edit and version control
- Can be imported via migration script

### 2. **Seed Script (JSON-based)**
**Location**: `apps/backend/src/scripts/seedTcsNqtFromJson.ts`
- Reads from `tcs-nqt-questions.json`
- Loads questions into database
- Replaces old questions with new ones
- Run with: `npm run seed:tcs-json`

### 3. **Admin API Routes**
**Location**: `apps/backend/src/routes/tcs-nqt-admin.routes.ts`
- Full CRUD operations for TCS NQT questions
- Admin-only endpoints (requires authentication)
- Can manage questions without code changes

### 4. **Updated App Configuration**
**Location**: `apps/backend/src/app.ts`
- Added TCS NQT admin routes
- Endpoint: `/api/v1/admin/tcs-nqt`

## 🚀 How to Use

### Option 1: Seed from JSON (Recommended)
```bash
cd apps/backend
npm run seed:tcs-json
```

**Output:**
```
📚 Seeding TCS NQT questions from JSON...
✓ Loaded 101 questions from JSON
✓ Deleted 102 old TCS NQT questions from database
✅ Successfully seeded 101 TCS NQT questions from JSON!
```

### Option 2: Add Questions via Admin API

**Create a new question:**
```bash
curl -X POST http://localhost:5000/api/v1/admin/tcs-nqt \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Merge Two Sorted Arrays",
    "statement": "Given two sorted arrays...",
    "difficulty": "medium",
    "inputFormat": "Two arrays",
    "outputFormat": "Merged array",
    "constraints": "1 ≤ n ≤ 10^5",
    "sampleInput": "[1,2,3] [2,5,6]",
    "sampleOutput": "[1,2,2,3,5,6]",
    "testCases": [
      { "input": "[1,2,3] [2,5,6]", "output": "[1,2,2,3,5,6]", "isHidden": false }
    ]
  }'
```

**List all questions:**
```bash
curl -X GET "http://localhost:5000/api/v1/admin/tcs-nqt?page=1&limit=10" \
  -H "Authorization: Bearer <admin_token>"
```

**Get single question:**
```bash
curl -X GET http://localhost:5000/api/v1/admin/tcs-nqt/{id} \
  -H "Authorization: Bearer <admin_token>"
```

**Update question:**
```bash
curl -X PUT http://localhost:5000/api/v1/admin/tcs-nqt/{id} \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{ "statement": "Updated statement..." }'
```

**Delete question:**
```bash
curl -X DELETE http://localhost:5000/api/v1/admin/tcs-nqt/{id} \
  -H "Authorization: Bearer <admin_token>"
```

## 📊 API Endpoints

### Admin TCS NQT Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/tcs-nqt` | List all TCS NQT questions (with pagination, filters) |
| POST | `/api/v1/admin/tcs-nqt` | Create new TCS NQT question |
| GET | `/api/v1/admin/tcs-nqt/:id` | Get single TCS NQT question |
| PUT | `/api/v1/admin/tcs-nqt/:id` | Update TCS NQT question |
| DELETE | `/api/v1/admin/tcs-nqt/:id` | Delete TCS NQT question |
| GET | `/api/v1/admin/tcs-nqt/admin/stats` | Get TCS NQT statistics |

### Query Parameters (for GET /admin/tcs-nqt)

```bash
# Pagination
?page=1&limit=20

# Filter by difficulty
?difficulty=medium

# Search by title
?search=array

# Combine filters
?page=1&limit=20&difficulty=easy&search=string
```

### Response Format

**List Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "q1",
      "slug": "find-the-smallest-number-in-an-array-tcs-nqt",
      "title": "Find the smallest number in an array",
      "difficulty": "easy",
      "topics": ["tcs-nqt"],
      "createdAt": "2026-07-31T10:00:00Z",
      "updatedAt": "2026-07-31T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 101
  }
}
```

**Single Question Response:**
```json
{
  "success": true,
  "data": {
    "id": "q1",
    "slug": "find-the-smallest-number-in-an-array-tcs-nqt",
    "title": "Find the smallest number in an array",
    "difficulty": "easy",
    "statement": "Given an array arr[]...",
    "inputFormat": "First line contains N...",
    "outputFormat": "Return the smallest element...",
    "constraints": "1 ≤ N ≤ 10^5",
    "sampleInput": "5\n1 8 7 56 90",
    "sampleOutput": "1",
    "testCases": [
      {
        "input": "5\n1 8 7 56 90",
        "output": "1",
        "isHidden": false
      }
    ],
    "topics": ["tcs-nqt"],
    "companies": ["TCS"],
    "timeLimit": 1000,
    "memoryLimit": 128,
    "createdAt": "2026-07-31T10:00:00Z",
    "updatedAt": "2026-07-31T10:00:00Z"
  }
}
```

## 🔄 Migration Path

### From Hardcoded to Database:

**Before:**
```typescript
// seedTcsNqt.ts
const TCS_QUESTIONS = [
  { title: "Q1", difficulty: "easy" },
  { title: "Q2", difficulty: "medium" },
  // ... 102 questions hardcoded
];
```

**After:**
```json
// tcs-nqt-questions.json
{
  "questions": [
    { "title": "Q1", "difficulty": "easy" },
    { "title": "Q2", "difficulty": "medium" }
  ]
}
```

**Seed Process:**
```typescript
// seedTcsNqtFromJson.ts
1. Read JSON file
2. Delete old database records
3. Insert new records
4. Verify count
```

## ✨ Benefits

### ✅ Advantages:
1. **No Code Changes** - Edit questions in JSON
2. **Dynamic Management** - Add/edit/delete via API
3. **Version Control** - JSON tracked in Git
4. **Scalability** - Can handle 10,000+ questions
5. **Admin Panel Ready** - API ready for UI dashboard
6. **Easy Bulk Import** - Update all questions at once
7. **Database as Source of Truth** - Questions live in database

### ❌ Removed Limitations:
- ~~Need code change to add question~~
- ~~All questions hardcoded in TS file~~
- ~~Difficult to manage 100+ questions~~
- ~~No dynamic updates~~

## 📝 npm Scripts

```bash
# New script: Seed from JSON
npm run seed:tcs-json

# Old script: Still available (hardcoded)
npm run seed:tcs

# Run both (not recommended - may conflict)
npm run seed:all
```

## 🔒 Security

All admin endpoints require:
- ✅ Authentication (Bearer token)
- ✅ Admin role authorization
- ✅ Validation of input data
- ✅ Error handling

Example with auth:
```bash
curl -X POST http://localhost:5000/api/v1/admin/tcs-nqt \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1..." \
  -d '{...}'
```

## 🛠️ Development Workflow

### Adding Questions:

**Option A: Edit JSON manually**
```json
{
  "questions": [
    {
      "title": "New Question Title",
      "difficulty": "medium",
      "category": "strings"
    }
  ]
}
```

Then run: `npm run seed:tcs-json`

**Option B: Use Admin API**
```javascript
const response = await fetch('/api/v1/admin/tcs-nqt', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'New Question',
    difficulty: 'medium',
    statement: '...'
  })
});
```

## 📊 Database Schema

TCS NQT questions are stored in the `question` table:

```sql
SELECT * FROM question 
WHERE slug LIKE '%-tcs-nqt' 
ORDER BY createdAt DESC;
```

**Key Fields:**
- `id`: Unique identifier
- `slug`: URL-friendly slug (e.g., "find-smallest-number-in-an-array-tcs-nqt")
- `title`: Question title
- `statement`: Full problem statement
- `difficulty`: easy | medium | hard
- `topics`: Array containing 'tcs-nqt'
- `companies`: Array containing 'TCS'
- `testCases`: Array of test case objects
- `timeLimit`: Time limit in milliseconds
- `memoryLimit`: Memory limit in MB

## 🚀 Next Steps

1. **Seed from JSON**: `npm run seed:tcs-json`
2. **Verify**: Check database has 101 questions
3. **Test API**: Call `/api/v1/admin/tcs-nqt` with admin token
4. **Build Admin Dashboard** (optional):
   - List questions with pagination
   - Create/Edit/Delete UI
   - Import/Export functionality
5. **Monitor**: Track question stats via `/api/v1/admin/tcs-nqt/admin/stats`

---

**TCS NQT questions are now fully database-driven and manageable without code changes!** 🎉
