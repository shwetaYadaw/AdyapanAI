# 🌱 Seed Aptitude Questions Guide

## Overview
This guide will help you migrate **all 622 hardcoded aptitude questions** from the frontend into the database automatically.

## 📊 What Will Be Migrated

Based on your `AptitudePage.tsx` file:
- **Total Questions**: 622
- **Total Topics**: ~50
- **Modules**: Quantitative, Verbal, Logical Reasoning

### Current Questions Breakdown:
```
📚 TCS_NUMERICAL_TOPICS
   ├─ Percentage (20 questions)
   ├─ Numbers (22 questions)
   ├─ Profit & Loss (20 questions)
   ├─ Ratio & Proportion (15 questions)
   ├─ Time & Work (10 questions)
   └─ ... and more

📝 TCS_VERBAL_TOPICS
   └─ Verbal reasoning questions

🧩 TCS_LOGICAL_TOPICS
   └─ Logical reasoning questions

... and other company-specific topics
```

## 🚀 Quick Start (5 Steps)

### Step 1: Run Database Migration
```bash
cd apps/backend
npx prisma migrate dev --name add-aptitude-questions
```

### Step 2: Generate Prisma Client (Already Done)
```bash
# Already completed ✅
npx prisma generate
```

### Step 3: Run the Seed Script
```bash
cd apps/backend
npx ts-node src/scripts/seedAptitude.ts
```

**Expected Output:**
```
🌱 Starting aptitude questions seeding...

📖 Reading file: ../../../web/src/pages/student/AptitudePage.tsx

📦 Found array: TCS_NUMERICAL_TOPICS
   ├─ Topic: Percentage (percentage)
   ├─ Topic: Numbers (numbers)
   ├─ Topic: Profit & Loss (profit-loss)
   ... more topics

📦 Found array: TCS_VERBAL_TOPICS
   ... more topics

✅ Extracted 622 questions from file

   ✅ Progress: 50 questions created...
   ✅ Progress: 100 questions created...
   ✅ Progress: 150 questions created...
   ... continues until 622

📊 Seeding Summary:
═══════════════════════════════════════
   ✅ Created:  622 questions
   ⏭️  Skipped:  0 questions (already exist)
   ❌ Failed:   0 questions
   📝 Total:    622 questions
═══════════════════════════════════════

✨ Aptitude questions seeding completed successfully!
🎉 You now have all your aptitude questions in the database!
```

### Step 4: Verify in Database
```bash
cd apps/backend
npx prisma studio
```

Then navigate to `AptitudeQuestion` table and you'll see all 622 questions!

### Step 5: Test Admin Panel
1. Start backend: `npm run dev`
2. Login as admin: `admin@adyapan.com` / `Admin@123`
3. Go to: http://localhost:5173/admin/aptitude
4. You should see all 622 questions!

---

## 🔍 How the Seed Script Works

The seed script automatically:

1. **Reads** your `AptitudePage.tsx` file
2. **Extracts** all topic arrays (`TCS_NUMERICAL_TOPICS`, etc.)
3. **Parses** each question with its options, answer, and explanation
4. **Determines** module (quantitative/verbal/logical) from array name
5. **Converts** topic names to URL-friendly slugs
6. **Inserts** into database (skipping duplicates)

### Module Detection:
```typescript
TCS_NUMERICAL_TOPICS   → module: "quantitative"
TCS_VERBAL_TOPICS      → module: "verbal"
TCS_LOGICAL_TOPICS     → module: "logical"
WIPRO_NUMERICAL_TOPICS → module: "quantitative"
```

### Topic Slug Conversion:
```typescript
"Profit & Loss"      → "profit-loss"
"Ratio & Proportion" → "ratio-proportion"
"Time & Work"        → "time-work"
```

---

## 🐛 Troubleshooting

### Error: File not found
```bash
❌ File not found: ../../../web/src/pages/student/AptitudePage.tsx
```

**Solution:**
```bash
# Make sure you're in the backend directory
cd apps/backend
pwd  # Should show: .../AdyapanAI/apps/backend

# Try the seed again
npx ts-node src/scripts/seedAptitude.ts
```

### Error: Cannot find module '@prisma/client'
```bash
❌ Cannot find module '@prisma/client'
```

**Solution:**
```bash
cd apps/backend
npx prisma generate
npm install
npx ts-node src/scripts/seedAptitude.ts
```

### Error: PrismaClientKnownRequestError
```bash
❌ PrismaClientKnownRequestError: Table 'AptitudeQuestion' does not exist
```

**Solution:**
```bash
# Run the migration first
cd apps/backend
npx prisma migrate dev --name add-aptitude-questions

# Then try seeding again
npx ts-node src/scripts/seedAptitude.ts
```

### Some Questions Skipped
```
📊 Seeding Summary:
   ✅ Created:  500 questions
   ⏭️  Skipped:  122 questions (already exist)
```

**This is normal!** The script checks for duplicates and skips questions that already exist in the database.

---

## 📋 After Seeding

### Switch Frontend to Database

Once all questions are in the database, update the frontend to use the new pages:

```bash
cd apps/web/src/pages/student

# Backup old files
mv AptitudePage.tsx AptitudePageOld.tsx
mv AptitudeQuizPage.tsx AptitudeQuizPageOld.tsx

# Activate new database-driven pages
mv AptitudePageNew.tsx AptitudePage.tsx
mv AptitudeQuizPageNew.tsx AptitudeQuizPage.tsx
```

### Verify Student View
1. Go to: http://localhost:5173/student/aptitude
2. Select "Quantitative" module
3. Click any topic (e.g., "Percentage")
4. Take the quiz!
5. All questions should load from database ✅

---

## 🎯 What You Get

### Before Seed:
```
Database: AptitudeQuestion table - EMPTY (0 questions)
Frontend: 622 questions hardcoded in AptitudePage.tsx
```

### After Seed:
```
Database: AptitudeQuestion table - 622 questions ✅
Frontend: Can now fetch from database dynamically
Admin: Can add/edit/delete via UI
```

---

## 🔄 Re-running the Script

The seed script is **safe to run multiple times**:

- ✅ Skips questions that already exist
- ✅ Only adds new questions
- ✅ No duplicates created

Example:
```bash
# First run
✅ Created: 622 questions

# Second run
⏭️  Skipped: 622 questions (already exist)

# After adding 10 new questions to AptitudePage.tsx
✅ Created: 10 questions
⏭️  Skipped: 622 questions (already exist)
```

---

## 📊 Verify Success

### Check Database Count
```bash
cd apps/backend
npx prisma studio

# Or use PostgreSQL directly
psql -U postgres -d your_database
SELECT COUNT(*) FROM "AptitudeQuestion";
# Should show: 622

# Check by module
SELECT module, COUNT(*) FROM "AptitudeQuestion" GROUP BY module;
# quantitative | 400+
# verbal       | 100+
# logical      | 100+
```

### Check Admin Panel
1. Login: `admin@adyapan.com` / `Admin@123`
2. Go to: `/admin/aptitude`
3. You should see paginated list of all 622 questions
4. Try filtering by module/topic
5. Try editing a question
6. Try creating a new question

### Check Student View
1. Go to: `/student/aptitude`
2. Select module (Quantitative/Verbal/Logical)
3. See topics with question counts
4. Click a topic to take quiz
5. Questions load dynamically from database

---

## 🎉 Success!

You've successfully migrated **all 622 aptitude questions** from hardcoded arrays to a dynamic database!

**Benefits:**
- ✅ No more 3893-line data files
- ✅ Add questions via admin UI (no code changes)
- ✅ Edit questions instantly
- ✅ Delete questions easily
- ✅ Scalable to 10,000+ questions
- ✅ Fast filtering and search
- ✅ Ready for analytics

**Next Steps:**
1. Start using admin panel to manage questions
2. Remove old hardcoded files (optional)
3. Add more questions via UI
4. Enjoy your dynamic aptitude system! 🚀
