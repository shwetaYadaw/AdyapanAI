# 🚀 Quick Start - Aptitude System

## ⚡ 3-Minute Setup

### Step 1: Run Migration (30 seconds)
```bash
cd apps/backend
npx prisma migrate dev --name add-aptitude-questions
```

### Step 2: Restart Backend (30 seconds)
```bash
# Stop current backend (Ctrl+C)
npm run dev
```

### Step 3: Test Admin Panel (1 minute)
1. Open browser: http://localhost:5173/login
2. Login: `admin@adyapan.com` / `Admin@123`
3. Click "Aptitude" in sidebar
4. Click "Create Question"
5. Fill form and submit

### Step 4: Switch to New Pages (30 seconds)
```bash
cd apps/web/src/pages/student
mv AptitudePage.tsx AptitudePageOld.tsx
mv AptitudePageNew.tsx AptitudePage.tsx
mv AptitudeQuizPage.tsx AptitudeQuizPageOld.tsx  
mv AptitudeQuizPageNew.tsx AptitudeQuizPage.tsx
```

### Step 5: Test Student View (30 seconds)
1. Navigate to: http://localhost:5173/student/aptitude
2. Select a module
3. Click a topic
4. Take the quiz!

---

## 📋 File Checklist

### ✅ Created Files (Ready to Use)
- `apps/backend/prisma/schema.prisma` - ✅ Model added
- `apps/backend/src/routes/aptitude.routes.ts` - ✅ API ready
- `apps/web/src/pages/admin/AptitudePage.tsx` - ✅ Admin panel
- `apps/web/src/pages/student/AptitudePageNew.tsx` - ✅ Student browse
- `apps/web/src/pages/student/AptitudeQuizPageNew.tsx` - ✅ Student quiz

### 🔧 Modified Files (Updated)
- `apps/backend/src/app.ts` - ✅ Routes registered
- `apps/web/src/components/layout/Sidebar/Sidebar.tsx` - ✅ Link added
- `apps/web/src/router/AppRouter.tsx` - ✅ Route added

---

## 🎯 Quick Commands

### Backend
```bash
cd apps/backend

# Run migration
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Start server
npm run dev

# Seed questions (optional)
npx ts-node src/scripts/seedAptitude.ts
```

### Frontend
```bash
cd apps/web

# Start dev server
npm run dev
```

---

## 📍 Important URLs

| Page | URL | Access |
|------|-----|--------|
| Admin Panel | http://localhost:5173/admin/aptitude | Admin only |
| Student Browse | http://localhost:5173/student/aptitude | Students |
| Login | http://localhost:5173/login | All |

---

## 🔑 Admin Credentials
```
Email: admin@adyapan.com
Password: Admin@123
```

---

## 🧪 Quick Test

### Test Admin Panel
```bash
# 1. Login as admin
# 2. Go to /admin/aptitude
# 3. Click "Create Question"
# 4. Fill:
Module: quantitative
Topic: test
Difficulty: easy
Question: What is 2+2?
Options: 3, 4, 5, 6
Answer: 4
Explanation: Basic math

# 5. Submit
# ✅ Question created!
```

### Test Student View
```bash
# 1. Go to /student/aptitude
# 2. Click "Quantitative"
# 3. Click "test" topic
# 4. Answer the question
# ✅ Quiz working!
```

---

## 📊 API Endpoints

```bash
# List questions
GET /api/v1/aptitude

# Filter by module
GET /api/v1/aptitude?module=quantitative

# Filter by topic
GET /api/v1/aptitude?topic=percentage

# Get single question
GET /api/v1/aptitude/:id

# Create (admin only)
POST /api/v1/aptitude

# Update (admin only)
PUT /api/v1/aptitude/:id

# Delete (admin only)
DELETE /api/v1/aptitude/:id
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
cd apps/backend
npx prisma generate
npm run dev
```

### Questions not showing
```bash
# Check if migration ran
cd apps/backend
npx prisma migrate status

# Check database
npx prisma studio
```

### Admin panel not accessible
- Clear browser cache
- Check if logged in as admin
- Verify sidebar link exists

---

## 📚 Full Documentation

For detailed information, see:
- `APTITUDE_MIGRATION_GUIDE.md` - Complete guide
- `APTITUDE_ARCHITECTURE.md` - System architecture
- `IMPLEMENTATION_SUMMARY.md` - What was done

---

## ✨ What You Get

### Before (Hardcoded)
```typescript
// apps/web/src/pages/student/aptitudeData.ts
export const TCS_NUMERICAL_TOPICS = [
  {
    name: 'Percentage',
    questions: [
      { question: '...', options: [...], answer: '...' }
    ]
  }
];
```
❌ Hardcoded in file  
❌ Requires code changes  
❌ Needs redeployment  

### After (Database)
```typescript
// Admin panel at /admin/aptitude
✅ Add questions via UI
✅ Edit anytime
✅ No code changes
✅ No redeployment
✅ Instant updates
```

---

## 🎉 Done!

Your aptitude system is now database-driven and ready to use!

**Next Steps:**
1. Run the migration ✅
2. Test the admin panel ✅
3. Add your questions ✅
4. Launch! 🚀
