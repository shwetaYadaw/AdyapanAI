# Aptitude Questions Database Migration Guide

## Overview
This guide walks you through migrating aptitude questions from hardcoded arrays to a PostgreSQL database, making them dynamically manageable through an admin panel.

## Changes Made

### 1. Database Schema (Backend)
**File: `apps/backend/prisma/schema.prisma`**
- Added `AptitudeQuestion` model with fields:
  - `id`: Unique identifier
  - `question`: Question text
  - `options`: JSON array of answer options
  - `answer`: Correct answer
  - `explanation`: Detailed explanation
  - `module`: "quantitative", "verbal", or "logical"
  - `topic`: Topic name (e.g., "percentage", "profit-loss")
  - `difficulty`: "easy", "medium", or "hard"
  - `questionImage`, `optionImages`, `isImageBased`: Optional image support

### 2. API Routes (Backend)
**File: `apps/backend/src/routes/aptitude.routes.ts`**
- `GET /api/v1/aptitude` - Fetch all questions with optional filters
- `GET /api/v1/aptitude/:id` - Get single question
- `POST /api/v1/aptitude` - Create new question (admin only)
- `PUT /api/v1/aptitude/:id` - Update question (admin only)
- `DELETE /api/v1/aptitude/:id` - Delete question (admin only)
- `GET /api/v1/aptitude/modules/list` - Get list of modules
- `GET /api/v1/aptitude/topics/list` - Get list of topics

**File: `apps/backend/src/app.ts`**
- Registered aptitude routes at `/api/v1/aptitude`

### 3. Admin Panel (Frontend)
**File: `apps/web/src/pages/admin/AptitudePage.tsx`**
- Full CRUD interface for managing aptitude questions
- Create, edit, and delete questions
- Support for image-based questions
- Filter by module, topic, and difficulty

**Navigation Updates:**
- Added "Aptitude" to admin sidebar
- Added route `/admin/aptitude` in AppRouter

### 4. Student Interface (Frontend)
**Files Created:**
- `apps/web/src/pages/student/AptitudePageNew.tsx` - Browse topics by module
- `apps/web/src/pages/student/AptitudeQuizPageNew.tsx` - Take quizzes from database

**Note:** Old hardcoded pages still exist for backward compatibility:
- `apps/web/src/pages/student/AptitudePage.tsx` (old)
- `apps/web/src/pages/student/AptitudeQuizPage.tsx` (old)

## Migration Steps

### Step 1: Run Database Migration
```bash
cd apps/backend
npx prisma migrate dev --name add-aptitude-questions
```

Or manually run the SQL:
```sql
-- File: apps/backend/migrations/add-aptitude-questions.sql
CREATE TABLE IF NOT EXISTS "AptitudeQuestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "question" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "answer" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL DEFAULT 'medium',
    "questionImage" TEXT,
    "optionImages" JSONB,
    "isImageBased" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "AptitudeQuestion_module_idx" ON "AptitudeQuestion"("module");
CREATE INDEX "AptitudeQuestion_topic_idx" ON "AptitudeQuestion"("topic");
CREATE INDEX "AptitudeQuestion_difficulty_idx" ON "AptitudeQuestion"("difficulty");
CREATE INDEX "AptitudeQuestion_module_topic_idx" ON "AptitudeQuestion"("module", "topic");
```

### Step 2: Generate Prisma Client
```bash
cd apps/backend
npx prisma generate
```

### Step 3: Restart Backend Server
```bash
cd apps/backend
npm run dev
```

### Step 4: Test the Admin Panel
1. Login as admin: `admin@adyapan.com` / `Admin@123`
2. Navigate to `/admin/aptitude`
3. Create a test question

### Step 5: Migrate Existing Questions (Optional)
You have two options:

**Option A: Manual Entry via Admin Panel**
- Use the admin panel to manually add questions from `aptitudeData.ts`

**Option B: Create a Seed Script**
Create `apps/backend/src/scripts/seedAptitude.ts`:
```typescript
import { prisma } from '../config/prisma';
import { TCS_NUMERICAL_TOPICS } from '../../../web/src/pages/student/aptitudeData';

async function seedAptitude() {
  for (const topic of TCS_NUMERICAL_TOPICS) {
    for (const q of topic.questions) {
      await prisma.aptitudeQuestion.create({
        data: {
          question: q.question,
          options: q.options,
          answer: q.answer,
          explanation: q.explanation,
          module: 'quantitative',
          topic: topic.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          difficulty: 'medium',
        },
      });
    }
  }
  console.log('Aptitude questions seeded successfully!');
}

seedAptitude();
```

Run the seed:
```bash
cd apps/backend
npx ts-node src/scripts/seedAptitude.ts
```

### Step 6: Switch to New Frontend Pages
Once questions are in the database, update the router:

**File: `apps/web/src/router/AppRouter.tsx`**
```typescript
// Replace old imports
const AptitudePage = lazy(() => import('../pages/student/AptitudePageNew'));
const AptitudeQuizPage = lazy(() => import('../pages/student/AptitudeQuizPageNew'));
```

Or rename files:
```bash
cd apps/web/src/pages/student
mv AptitudePage.tsx AptitudePageOld.tsx
mv AptitudePageNew.tsx AptitudePage.tsx
mv AptitudeQuizPage.tsx AptitudeQuizPageOld.tsx
mv AptitudeQuizPageNew.tsx AptitudeQuizPage.tsx
```

## Benefits of Database Migration

### Before (Hardcoded)
❌ Questions hardcoded in `aptitudeData.ts`  
❌ Need code changes to add/edit questions  
❌ Requires frontend redeployment for updates  
❌ No admin interface for management  
❌ Difficult to track question analytics  

### After (Database)
✅ Questions stored in PostgreSQL database  
✅ Add/edit via admin panel - no code changes  
✅ Instant updates without redeployment  
✅ Full CRUD admin interface  
✅ Easy to add analytics and tracking  
✅ Scalable for thousands of questions  
✅ Support for image-based questions  

## Testing Checklist

- [ ] Database migration ran successfully
- [ ] Prisma client generated
- [ ] Backend server starts without errors
- [ ] Admin login works
- [ ] Can access `/admin/aptitude`
- [ ] Can create a question
- [ ] Can edit a question
- [ ] Can delete a question
- [ ] Student can see topics at `/student/aptitude`
- [ ] Student can take quiz from database
- [ ] Questions display correctly
- [ ] Explanations show after answering

## API Endpoints

### Get All Questions
```bash
GET /api/v1/aptitude
Query Params: ?module=quantitative&topic=percentage&difficulty=easy
```

### Get Single Question
```bash
GET /api/v1/aptitude/:id
```

### Create Question (Admin)
```bash
POST /api/v1/aptitude
Headers: Authorization: Bearer <token>
Body: {
  "question": "What is 2+2?",
  "options": ["3", "4", "5", "6"],
  "answer": "4",
  "explanation": "2+2 equals 4",
  "module": "quantitative",
  "topic": "basic-math",
  "difficulty": "easy"
}
```

### Update Question (Admin)
```bash
PUT /api/v1/aptitude/:id
Headers: Authorization: Bearer <token>
Body: { ... same as create ... }
```

### Delete Question (Admin)
```bash
DELETE /api/v1/aptitude/:id
Headers: Authorization: Bearer <token>
```

## Troubleshooting

### Backend Won't Start
- Check if Prisma client is generated: `npx prisma generate`
- Check if migration ran: `npx prisma migrate status`
- Check console for import errors

### Admin Panel Not Showing
- Clear browser cache
- Check if route is registered in AppRouter
- Check if sidebar link was added

### Questions Not Appearing
- Check if questions exist in database
- Check browser console for API errors
- Verify API endpoint is correct
- Check if backend is running

### Authentication Issues
- Verify admin credentials
- Check if JWT token is valid
- Check backend auth middleware

## Next Steps

1. Run the migration
2. Test admin panel
3. Add questions via admin interface
4. Switch frontend to new pages
5. Test student interface
6. (Optional) Create seed script for bulk import
7. Remove old hardcoded files once migration is complete

## Questions?

If you encounter issues:
1. Check console logs (both frontend and backend)
2. Verify database connection
3. Check API responses in Network tab
4. Ensure all files were created correctly
