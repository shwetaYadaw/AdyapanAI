# Quick Start - Dual Admin Dashboard 🚀

## 🎯 Access the System

### Main Admin Dashboard
```
📱 URL: http://localhost:3000/admin
🔐 Required: Admin login
⏱️ Load time: ~2-3 seconds
```

## 🎨 System Selection Screen

When you navigate to `/admin`, you'll see:

```
┌─────────────────────────────────────────────┐
│         Admin Dashboard                     │
│  Manage coding problems and placement prep  │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────────┐    ┌──────────────┐      │
│  │   💻 Coding  │    │   📖 TCS     │      │
│  │   Arena      │    │   NQT        │      │
│  │              │    │              │      │
│  │ ✅ Create    │    │ ✅ Create    │      │
│  │ ✅ Manage    │    │ ✅ Manage    │      │
│  │ ✅ Export    │    │ ✅ Export    │      │
│  └──────────────┘    └──────────────┘      │
│                                             │
└─────────────────────────────────────────────┘
```

## 🔧 System URLs

### Coding Arena Management
```
Route: http://localhost:3000/admin
Click: "Coding Arena" card
Features:
  - Add/Edit/Delete problems
  - Archive/Restore functionality
  - Version history tracking
  - Bulk import problems
  - Problem analytics
```

### TCS NQT Management
```
Route: http://localhost:3000/admin
Click: "TCS NQT" card
Features:
  - Add/Edit/Delete questions
  - Test case management
  - Bulk import questions
  - Topic/Company tagging
  - Performance tracking
```

## 📋 Available Operations

### Create New Problem (Coding Arena)
```
Step 1: Navigate to http://localhost:3000/admin
Step 2: Click "Coding Arena" card
Step 3: Click "Add Coding Problem" button
Step 4: Fill form with:
  - Title (required)
  - Difficulty (easy/medium/hard)
  - Problem Statement (required)
  - Input/Output Format
  - Constraints
  - Reference Solution
  - Topics & Companies
Step 5: Click "Create Problem"
Step 6: See success toast notification
```

### Create New Question (TCS NQT)
```
Step 1: Navigate to http://localhost:3000/admin
Step 2: Click "TCS NQT" card
Step 3: Click "Add TCS Question" button
Step 4: Fill form with:
  - Title (required)
  - Difficulty (easy/medium/hard)
  - Problem Statement (required)
  - Input/Output Format
  - Constraints
  - Reference Solution
  - Topics & Companies
Step 5: Click "Create Question"
Step 6: See success toast notification
```

### View All Problems/Questions
```
Coding Arena: http://localhost:3000/admin → Click "Coding Arena"
TCS NQT: http://localhost:3000/admin → Click "TCS NQT"

Each shows:
  - List of all items (paginated)
  - Filter options
  - Edit/Delete buttons
  - Search functionality
```

### Edit Existing Problem/Question
```
Step 1: Navigate to the appropriate dashboard
Step 2: Find item in table
Step 3: Click Edit icon (pencil)
Step 4: Modal opens with current data
Step 5: Make changes
Step 6: Click "Update" button
Step 7: See success notification
```

### Delete Problem/Question
```
Step 1: Navigate to the appropriate dashboard
Step 2: Find item in table
Step 3: Click Delete icon (trash can)
Step 4: Confirm deletion
Step 5: Item removed from table
```

### Bulk Import
```
Coding Arena:
  URL: http://localhost:3000/admin
  Click: "Coding Arena" → (Import button)
  Upload: JSON file with problems array
  
TCS NQT:
  URL: http://localhost:3000/admin
  Click: "TCS NQT" → (Import button)
  Upload: JSON file with questions array
```

## 🗄️ API Endpoints

### Coding Arena API
```
GET    /api/v1/admin/problems          - List all problems
POST   /api/v1/admin/problems          - Create problem
GET    /api/v1/admin/problems/:id      - Get single problem
PUT    /api/v1/admin/problems/:id      - Update problem
DELETE /api/v1/admin/problems/:id      - Delete problem
POST   /api/v1/admin/problems/bulk/import - Bulk import
GET    /api/v1/admin/problems/stats    - Get statistics
```

### TCS NQT API
```
GET    /api/v1/admin/tcs-nqt           - List all questions
POST   /api/v1/admin/tcs-nqt           - Create question
GET    /api/v1/admin/tcs-nqt/:id       - Get single question
PUT    /api/v1/admin/tcs-nqt/:id       - Update question
DELETE /api/v1/admin/tcs-nqt/:id       - Delete question
POST   /api/v1/admin/tcs-nqt/bulk/import - Bulk import
GET    /api/v1/admin/tcs-nqt/stats     - Get statistics
```

## 📊 Sample Data Format

### Coding Arena Problem JSON
```json
{
  "title": "Two Sum",
  "difficulty": "easy",
  "statement": "Given an array of integers...",
  "inputFormat": "First line: n (array length)...",
  "outputFormat": "Return array indices...",
  "constraints": "1 ≤ n ≤ 10^5",
  "referenceSolution": "Solution code here",
  "topics": "arrays,hashing",
  "companies": "Google,Amazon"
}
```

### TCS NQT Question JSON
```json
{
  "title": "Profit Calculation",
  "difficulty": "medium",
  "statement": "Calculate profit from transactions...",
  "inputFormat": "Enter costs and prices...",
  "outputFormat": "Total profit",
  "constraints": "0 ≤ value ≤ 10^6",
  "referenceSolution": "Solution code",
  "topics": "quantitative,reasoning",
  "companies": "TCS,Infosys"
}
```

## 🔍 Troubleshooting

### Problem: Cannot access /admin
```
Check: Are you logged in with admin role?
Fix: Login with admin credentials at /login
```

### Problem: "Unauthorized" error
```
Check: Is your token valid?
Fix: Logout and login again
```

### Problem: No problems/questions showing
```
Check: Have you added any yet?
Fix: Create one using "Add" button
```

### Problem: Import fails
```
Check: Is JSON format correct?
Fix: Verify JSON has required fields
    (title, difficulty, statement)
```

### Problem: Component not loading
```
Check: Are servers running?
Fix: npm run dev (backend and web)
```

## 📚 Component Structure

```
AdminDashboard
├── Card Selection
│   ├── Coding Arena Card
│   └── TCS NQT Card
│
├── CodingArenaDashboard (when selected)
│   ├── Header with back button
│   ├── Add button
│   ├── Filters
│   ├── ProblemTable
│   └── CreateEditProblemModal
│
└── TcsNqtDashboard (when selected)
    ├── Header with back button
    ├── Add button
    ├── Filters
    ├── TcsQuestionTable
    └── CreateEditTcsQuestionModal
```

## 🎯 Key Features

### Coding Arena Dashboard
- ✅ Version history of problems
- ✅ Archive/Restore (soft delete)
- ✅ Template code in multiple languages
- ✅ Hidden vs visible test cases
- ✅ Performance analytics
- ✅ Bulk operations

### TCS NQT Dashboard
- ✅ Quick question creation
- ✅ Test case JSON management
- ✅ Topic filtering
- ✅ Company tagging
- ✅ Quick bulk import
- ✅ Performance tracking

## 🚀 Performance Tips

1. **Pagination**: Default 20 items per page (configurable)
2. **Search**: Use search to quickly find items
3. **Filters**: Filter by difficulty to narrow results
4. **Bulk Import**: Use bulk import for many items at once
5. **Caching**: Problems cached for faster loading

## 📱 Browser Compatibility

- ✅ Chrome/Chromium (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

Dark mode automatically adjusts to system preference.

## 🆘 Support

### Common Questions

**Q: Can I have both dashboards open?**
A: No, but you can switch between them using back button.

**Q: Are changes saved immediately?**
A: Yes, all operations save immediately to database.

**Q: Can I undo deletions?**
A: For Coding Arena: Yes (restore from archive)
   For TCS NQT: No (permanent delete)

**Q: How many items can I bulk import?**
A: No limit, but performance depends on server.

**Q: Can students see admin changes immediately?**
A: Yes, cache is invalidated on every change.

---

**Ready to manage your problems and questions? Start at:**
# 👉 http://localhost:3000/admin
