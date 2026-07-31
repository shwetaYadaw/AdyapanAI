# 🚀 Quick Start - How Others Can See Recent Changes

## TL;DR (Too Long; Didn't Read)
```bash
# 1. Pull latest code
git pull origin tcs

# 2. Seed the database (IMPORTANT!)
cd apps/backend
npm run seed:tcs          # TCS NQT problems
npm run seed:challenges   # Coding Arena problems

# 3. Start the app
npm run dev               # Both backend and frontend

# 4. Hard refresh browser
Ctrl+Shift+R             # Windows/Linux
Cmd+Shift+R              # Mac
```

## What Will You See?

✅ **Binary Heap Operations** in Coding Arena → Hashing section
✅ **Sum of First N Natural Numbers** in TCS NQT section
✅ **All 545 questions** properly formatted with no duplicate headings

## Step-by-Step Instructions

### Step 1: Get Latest Code
```bash
cd c:\Users\HP\AdyapanAI
git pull origin tcs
git status  # Should show "working tree clean"
```

### Step 2: Install Dependencies (if first time)
```bash
cd apps/backend
npm install

cd ../web
npm install
```

### Step 3: Seed the Database
This is **CRITICAL** - database changes don't come from Git!

```bash
cd apps/backend

# Option A: Seed just what you need
npm run seed:tcs              # TCS NQT problems (102)
npm run seed:challenges       # Coding Arena problems (443)

# Option B: Seed everything
npm run seed:all

# Wait for completion - you should see:
# ✅ Successfully seeded 102 TCS NQT questions!
# ✅ Successfully seeded 537 questions into MySQL Coding Arena!
```

### Step 4: Start the Application
In separate terminals:

**Terminal 1 - Backend:**
```bash
cd apps/backend
npm run dev
# Wait for: "✅ Using PostgreSQL (Supabase)"
# Port 5000
```

**Terminal 2 - Frontend:**
```bash
cd apps/web
npm run dev
# Wait for: "Local: http://localhost:3000"
# Port 3000
```

### Step 5: Clear Cache & Refresh
Open http://localhost:3000 in browser and do one of:

**Option A: Hard Refresh**
- Windows/Linux: `Ctrl+Shift+R`
- Mac: `Cmd+Shift+R`

**Option B: Clear Cache Manually**
- Press `F12` to open DevTools
- Go to "Application" tab
- Click "Clear Site Data"
- Refresh page

## ✅ Verify It Worked

### See New Problems
1. Go to Coding Arena → Hashing
2. Look for "Binary Heap Operations" (Medium difficulty)
3. Check it has 8 test cases

### See Fixed Problems
1. Go to TCS NQT → any problem
2. Should see ONLY ONE "Problem Statement" heading (not two)
3. "Sum of first N natural numbers" should have 8 test cases

### Run Verification Script
```bash
cd apps/backend
npx ts-node --transpile-only src/scripts/verifyAllQuestions.ts
```

Expected output:
```
✓ All questions have titles
✓ All questions have statements
✓ All questions have test cases
✓ No duplicate slugs found
✓ All questions have valid difficulty levels
✅ All questions are properly sorted and valid!
```

## 🆘 Troubleshooting

### Issue: Still seeing old data
**Fix:**
1. Hard refresh: `Ctrl+Shift+R`
2. Clear DevTools cache: F12 → Application → Clear
3. Check if seed ran successfully (should show "✅" messages)

### Issue: Port already in use
**Fix:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### Issue: Database connection error
**Fix:**
1. Check `.env` file has DATABASE_URL
2. Verify MySQL/PostgreSQL is running
3. Try: `mysql -u root -p` or `psql -U user`

### Issue: npm command not found
**Fix:**
```bash
npm install -g npm@latest  # Update npm
node --version              # Check Node.js installed
npm --version               # Check npm installed
```

## 📊 What Changed

| Item | Before | After |
|------|--------|-------|
| Questions | 5054 | 545 ✅ |
| Duplicate headings | 40 | 0 ✅ |
| Binary Heap Operations | Missing | Added ✅ |
| TCS NQT Sum problem | Incomplete | 8 test cases ✅ |
| Data integrity | N/A | Verified ✅ |

## 📝 Reference

- Code changes: `tcs` branch on GitHub
- Detailed docs: See `INSTRUCTIONS_FOR_TEAM.md`
- Technical details: See `DATABASE_CHANGES_README.md`
- Visibility explanation: See `VISIBILITY_SOLUTION.md`

## ✨ You're All Set!

After following these steps, all changes should be visible and working perfectly. If you hit any issues, check the Troubleshooting section or refer to the detailed documentation files.

**Happy coding! 🎉**
