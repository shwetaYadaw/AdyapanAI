# Aptitude System - Data Seeding Instructions

## Overview
The Aptitude system has been successfully restructured with:
- **5 new database tables**: AptitudeTopic, AptitudeChapter, AptitudeQuestion, AptitudeOption, AptitudeSubmission
- **3 main topics**: Quantitative Aptitude, Logical Reasoning, Verbal Reasoning
- **9 chapters**: 3 per topic (Train Problems, Series, Reading Comprehension, etc.)
- **8 sample questions**: With multiple choice options (A, B, C, D)

## How to Seed Sample Data

### Option 1: Using the API Endpoint (Recommended for Admin Panel)

1. **Login to Admin Panel**
   - Go to http://localhost:3000/admin
   - Login with admin credentials

2. **Call the Seed Endpoint**
   - Make a POST request to: `http://localhost:5000/api/v1/admin/aptitude/seed`
   - Include your admin authentication token in the Authorization header

3. **Using cURL**:
   ```bash
   curl -X POST http://localhost:5000/api/v1/admin/aptitude/seed \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
   ```

4. **Using Frontend** (once UI is built)
   - Go to Admin Dashboard → Aptitude → Seed Data button

### Option 2: Direct Database Seed (Using Prisma)

```bash
# Navigate to backend directory
cd backend

# Create a seed file manually (see below)
# Then run prisma seed
npx prisma db seed
```

### Option 3: Manual SQL Seed

If you prefer to seed using SQL directly in Supabase:

1. Go to Supabase Dashboard
2. Open SQL Editor
3. Execute the SQL commands in `/APTITUDE_MANUAL_SEED.sql`

---

## Database Structure

### Tables Created

#### 1. AptitudeTopic
Stores main topic categories
```sql
SELECT * FROM "AptitudeTopic";
-- Expected: 3 records
-- - Quantitative Aptitude
-- - Logical Reasoning
-- - Verbal Reasoning
```

#### 2. AptitudeChapter
Stores chapters within topics
```sql
SELECT * FROM "AptitudeChapter" ORDER BY "topicId", "order";
-- Expected: 9 records
-- - Quantitative: Train Problems, Speed & Distance, Time & Work
-- - Logical: Series, Analogy, Puzzles
-- - Verbal: Reading Comprehension, Vocabulary, Grammar
```

#### 3. AptitudeQuestion
Stores questions with MCQ format
```sql
SELECT 
  id, statement, difficulty, "correctOption", "xpReward"
FROM "AptitudeQuestion"
ORDER BY "createdAt";
-- Expected: 8 sample questions
```

#### 4. AptitudeOption
Stores MCQ options (A, B, C, D)
```sql
SELECT q.statement, o."optionKey", o.text, o."isCorrect"
FROM "AptitudeOption" o
JOIN "AptitudeQuestion" q ON o."questionId" = q.id
ORDER BY q.statement, o."order";
-- Expected: 32 options (4 per question × 8 questions)
```

#### 5. AptitudeSubmission
Stores student attempts (initially empty)
```sql
SELECT * FROM "AptitudeSubmission";
-- Expected: 0 records (populated when students attempt)
```

---

## API Endpoints

### Admin Routes
```
POST   /api/v1/admin/aptitude/seed
       └─ Seed sample data (requires admin auth)

GET    /api/v1/admin/aptitude/topics
       └─ List all topics

POST   /api/v1/admin/aptitude/topics
       └─ Create new topic

GET    /api/v1/admin/aptitude/topics/:topicId/chapters
       └─ List chapters in topic

POST   /api/v1/admin/aptitude/topics/:topicId/chapters
       └─ Create chapter

POST   /api/v1/admin/aptitude/topics/:topicId/chapters/:chapterId/questions
       └─ Create question with options

DELETE /api/v1/admin/aptitude/topics/:topicId/chapters/:chapterId/questions/:questionId
       └─ Delete question

GET    /api/v1/admin/aptitude/stats
       └─ Get statistics
```

### Student Routes
```
GET    /api/v1/aptitude/topics
       └─ List all topics

GET    /api/v1/aptitude/topics/:topicId/chapters/:chapterId
       └─ Get chapter with questions

POST   /api/v1/aptitude/questions/:questionId/submit
       └─ Submit answer (with auth)

GET    /api/v1/aptitude/progress
       └─ Get student progress (with auth)
```

---

## Sample Data Overview

### Topics & Chapters

#### Quantitative Aptitude 🔢
1. **Train Problems** - Speed, distance, time, trains crossing
   - Question 1: Train crossing pole (150m)
   - Question 2: Two trains meeting (1h 40min)

2. **Speed & Distance** - Velocity and displacement
   - Question 7: Car speed calculation (48 km/hr)

3. **Time & Work** - Work rates and collaboration

#### Logical Reasoning 🧠
1. **Series** - Number and letter patterns
   - Question 3: Number series (42)

2. **Analogy** - Word and concept relationships
   - Question 4: Flower:Vase :: Plant:Pot

3. **Puzzles** - Logic and problem solving

#### Verbal Reasoning 📚
1. **Reading Comprehension** - Passage understanding
   - Question 5: Internet passage comprehension

2. **Vocabulary** - Word meanings
   - Question 6: Pragmatic definition

3. **Grammar** - Language rules
   - Question 8: Correct tense usage

---

## Next Steps

1. **Seed the data** using one of the methods above
2. **Verify in database** using provided SQL queries
3. **Build Frontend Components**:
   - AptitudeDashboard (admin)
   - AptitudeTopicDetail (admin)
   - AptitudeChapterDetail (admin)
   - AptitudeQuestionForm (admin)
   - AptitudePractice (student)
   - AptitudeQuiz (student)

4. **Test the flow**:
   - Admin creates topic/chapter/question
   - Student takes quiz
   - Progress is tracked

---

## Troubleshooting

### Seed fails with "data already exists"
- Delete existing data using: `DELETE FROM "AptitudeSubmission"; DELETE FROM "AptitudeOption"; DELETE FROM "AptitudeQuestion"; DELETE FROM "AptitudeChapter"; DELETE FROM "AptitudeTopic";`
- Then run seed again

### Seed endpoint returns 401 Unauthorized
- Ensure you're logged in as admin
- Check that your token is valid
- Make sure it's being passed in Authorization header

### Questions don't appear in student view
- Verify `isActive = true` for topics, chapters, and questions
- Check that options are properly created
- Ensure one option has `isCorrect = true`

---

## Manual Seed Alternative

If you prefer to manually create data through the admin UI:

1. **Create Topic**: POST to `/api/v1/admin/aptitude/topics`
   ```json
   {
     "name": "Quantitative Aptitude",
     "description": "Mathematical questions",
     "icon": "🔢",
     "order": 1
   }
   ```

2. **Create Chapter**: POST to `/api/v1/admin/aptitude/topics/{topicId}/chapters`
   ```json
   {
     "name": "Train Problems",
     "description": "Train-related questions",
     "order": 1
   }
   ```

3. **Create Question**: POST to `/api/v1/admin/aptitude/topics/{topicId}/chapters/{chapterId}/questions`
   ```json
   {
     "statement": "A train running at 60 km/hr...",
     "difficulty": "easy",
     "xpReward": 10,
     "timeLimit": 60,
     "explanation": "Speed = ...",
     "options": [
       { "optionKey": "A", "text": "150 metres", "isCorrect": true },
       { "optionKey": "B", "text": "120 metres", "isCorrect": false },
       { "optionKey": "C", "text": "180 metres", "isCorrect": false },
       { "optionKey": "D", "text": "324 metres", "isCorrect": false }
     ]
   }
   ```

---

## Summary

✅ Database schema created
✅ Backend routes implemented
✅ Frontend services created
✅ Seed data prepared
⏳ Next: Build frontend UI components
⏳ Next: Test end-to-end flow
