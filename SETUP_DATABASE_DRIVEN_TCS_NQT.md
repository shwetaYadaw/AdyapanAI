# Setup Database-Driven TCS NQT Questions

## 🎯 What You Need to Know

TCS NQT questions are NOW managed from the **database**, not hardcoded in code. This means:
- ✅ Add/Edit/Delete questions without code changes
- ✅ Admin API to manage questions dynamically
- ✅ JSON file for bulk imports
- ✅ Questions stored safely in database

## 📦 Quick Setup (3 Steps)

### Step 1: Pull Latest Code
```bash
git pull origin tcs
cd apps/backend
```

### Step 2: Seed Questions from JSON
```bash
npm run seed:tcs-json
```

**Expected Output:**
```
📚 Seeding TCS NQT questions from JSON...
✓ Loaded 101 questions from JSON
✓ Deleted 102 old TCS NQT questions from database
✅ Successfully seeded 101 TCS NQT questions from JSON!
```

### Step 3: Start the Application
```bash
npm run dev
```

## ✨ What's New

### Files Created:

1. **JSON Data File** - Easy to manage questions
   - `apps/backend/src/data/tcs-nqt-questions.json`
   - Contains all 101 TCS NQT questions
   - Edit directly or import programmatically

2. **Seed Script** - Load questions from JSON to database
   - `apps/backend/src/scripts/seedTcsNqtFromJson.ts`
   - Run: `npm run seed:tcs-json`

3. **Admin API** - CRUD operations for questions
   - `apps/backend/src/routes/tcs-nqt-admin.routes.ts`
   - Endpoints: `/api/v1/admin/tcs-nqt`
   - Requires admin authentication

## 🛠️ How to Manage Questions

### Option A: Edit JSON File
**File**: `apps/backend/src/data/tcs-nqt-questions.json`

```json
{
  "questions": [
    {
      "title": "Your Question Title",
      "difficulty": "easy",  // easy | medium | hard
      "category": "arrays"   // or: numbers, strings, sorting, etc.
    },
    ...
  ]
}
```

Then run: `npm run seed:tcs-json`

### Option B: Use Admin API

**Create a question:**
```javascript
const response = await fetch('http://localhost:5000/api/v1/admin/tcs-nqt', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'Find Missing Number',
    statement: 'Given an array of n-1 integers...',
    difficulty: 'medium',
    inputFormat: 'First line contains n...',
    outputFormat: 'Return the missing number',
    constraints: '1 ≤ n ≤ 10^5',
    sampleInput: 'n',
    sampleOutput: '...',
    testCases: [
      { input: '...', output: '...', isHidden: false }
    ]
  })
});
```

**List questions:**
```bash
curl "http://localhost:5000/api/v1/admin/tcs-nqt?page=1&limit=20" \
  -H "Authorization: Bearer ${token}"
```

**Update question:**
```bash
curl -X PUT "http://localhost:5000/api/v1/admin/tcs-nqt/{id}" \
  -H "Authorization: Bearer ${token}" \
  -H "Content-Type: application/json" \
  -d '{ "statement": "Updated problem..." }'
```

**Delete question:**
```bash
curl -X DELETE "http://localhost:5000/api/v1/admin/tcs-nqt/{id}" \
  -H "Authorization: Bearer ${token}"
```

## 📋 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/admin/tcs-nqt` | List all TCS NQT questions |
| POST | `/api/v1/admin/tcs-nqt` | Create new question |
| GET | `/api/v1/admin/tcs-nqt/:id` | Get one question |
| PUT | `/api/v1/admin/tcs-nqt/:id` | Update question |
| DELETE | `/api/v1/admin/tcs-nqt/:id` | Delete question |

## 🔑 Important Notes

### Authentication
All admin endpoints require:
- Admin role
- Bearer token in Authorization header
- HTTPS in production

### Database Requirements
- Questions stored in `question` table
- All questions have `tcs-nqt` in topics array
- Company set to `TCS`
- Slug format: `{title-slugified}-tcs-nqt`

### Backward Compatibility
- Old `npm run seed:tcs` still works
- Both scripts use the same database table
- Running both may cause conflicts - use one or the other

## 🚀 Workflow Example

### Add New Question:

**1. Edit JSON file:**
```json
{
  "title": "Two Sum Problem",
  "difficulty": "medium",
  "category": "arrays"
}
```

**2. Seed from JSON:**
```bash
npm run seed:tcs-json
```

**3. Verify in database:**
```bash
curl "http://localhost:5000/api/v1/admin/tcs-nqt?search=Two+Sum" \
  -H "Authorization: Bearer ${token}"
```

**4. Edit in database (via API):**
```bash
curl -X PUT "http://localhost:5000/api/v1/admin/tcs-nqt/{id}" \
  -H "Authorization: Bearer ${token}" \
  -H "Content-Type: application/json" \
  -d '{
    "statement": "Full problem description here...",
    "testCases": [...]
  }'
```

## 📊 Current State

- **Total TCS NQT Questions**: 101
- **Storage**: Database (question table)
- **Source File**: `tcs-nqt-questions.json`
- **Management**: Via Admin API
- **Categories**: Arrays, Numbers, Strings, Sorting, Number Systems

## 🆘 Troubleshooting

### Questions not showing?
1. Make sure you ran: `npm run seed:tcs-json`
2. Check database has entries: `SELECT * FROM question WHERE topics LIKE '%tcs-nqt%'`

### Can't access admin API?
1. Make sure you're authenticated: Include Bearer token
2. Check you have admin role
3. Verify endpoint: `/api/v1/admin/tcs-nqt`

### Need to reset?
```bash
# Delete all TCS NQT questions
DELETE FROM question WHERE topics LIKE '%tcs-nqt%';

# Then reseed from JSON
npm run seed:tcs-json
```

## 📚 Full Documentation

See: `TCS_NQT_DATABASE_DRIVEN.md` for complete API documentation

## ✅ You're Ready!

1. ✓ Pull latest code
2. ✓ Run `npm run seed:tcs-json`
3. ✓ Start with `npm run dev`
4. ✓ Manage questions via API or JSON

Questions are now database-driven! 🎉
