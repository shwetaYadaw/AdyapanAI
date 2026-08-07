# Aptitude System Restructure - Hierarchical Organization

## Overview
Restructure Aptitude from flat "topic + question" model to hierarchical: **Topic → Chapter → Question (with MCQ options)**

Example:
```
Numerical Reasoning (Topic)
├── Train Problems (Chapter)
│   ├── Question 1: A train running at 60 km/hr...
│   ├── Question 2: Two trains...
│   └── Question 3: A train crosses...
├── Speed & Distance (Chapter)
│   ├── Question 1: A man walks...
│   └── Question 2: A car travels...
└── Time & Work (Chapter)
    ├── Question 1: A can complete...
    └── Question 2: B can complete...

Logical Reasoning (Topic)
├── Series (Chapter)
├── Puzzles (Chapter)
└── Coding (Chapter)
```

---

## Phase 1: Database Schema Redesign

### New Tables Structure

#### 1. AptitudeTopic (replaces current unstructured topics)
```sql
model AptitudeTopic {
  id          String   @id @default(uuid())
  name        String   @unique  // e.g., "Numerical Reasoning"
  description String?
  icon        String?           // Optional icon/emoji
  order       Int      @default(0)
  isActive    Boolean  @default(true)
  createdBy   String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  chapters    AptitudeChapter[]
  
  @@index([isActive])
}
```

#### 2. AptitudeChapter (NEW - represents subtopics/chapters)
```sql
model AptitudeChapter {
  id          String   @id @default(uuid())
  topicId     String
  topic       AptitudeTopic @relation(fields: [topicId], references: [id], onDelete: Cascade)
  name        String   // e.g., "Train Problems", "Speed & Distance"
  description String?
  order       Int      @default(0)
  isActive    Boolean  @default(true)
  createdBy   String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  questions   AptitudeQuestion[]
  
  @@unique([topicId, name])
  @@index([topicId])
}
```

#### 3. AptitudeQuestion (replaces AptitudeAdminQuestion with MCQ structure)
```sql
model AptitudeQuestion {
  id              String   @id @default(uuid())
  chapterId       String
  chapter         AptitudeChapter @relation(fields: [chapterId], references: [id], onDelete: Cascade)
  
  // Question content
  statement       String   @db.Text
  difficulty      String   @default("medium")  // easy | medium | hard
  
  // MCQ Options (NEW)
  options         AptitudeOption[]  // Relation to options
  correctOption   String            // Option ID that is correct
  
  // Metadata
  explanation     String?  @db.Text
  xpReward        Int      @default(10)
  companies       String   @default("")
  timeLimit       Int      @default(30)  // seconds for aptitude
  
  // Audit
  createdBy       String?
  updatedBy       String?
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  options_rel     AptitudeOption[]
  submissions     AptitudeSubmission[]
  
  @@index([chapterId])
  @@index([difficulty])
}
```

#### 4. AptitudeOption (NEW - MCQ options for each question)
```sql
model AptitudeOption {
  id          String   @id @default(uuid())
  questionId  String
  question    AptitudeQuestion @relation(fields: [questionId], references: [id], onDelete: Cascade)
  
  optionKey   String   // A, B, C, D
  text        String   @db.Text
  order       Int      @default(0)
  isCorrect   Boolean  @default(false)
  
  @@unique([questionId, optionKey])
  @@index([questionId])
}
```

#### 5. AptitudeSubmission (NEW - track student attempts)
```sql
model AptitudeSubmission {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation("AptitudeSubmissions", fields: [userId], references: [id], onDelete: Cascade)
  
  questionId  String
  question    AptitudeQuestion @relation(fields: [questionId], references: [id], onDelete: Cascade)
  
  selectedOption String?   // The option key student selected (A, B, C, D)
  isCorrect   Boolean   @default(false)
  timeSpent   Int       @default(0)  // seconds
  xpGained    Int       @default(0)
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  @@index([userId])
  @@index([questionId])
}
```

### Migration Plan
1. Create new tables (Phase 1: Database)
2. Migrate existing questions to new structure (if any)
3. Delete old AptitudeAdminQuestion table
4. Add foreign key relationships

---

## Phase 2: Backend API Structure

### Routes: `/api/v1/admin/aptitude`

#### Topic Management
```
GET    /topics                    - List all topics with chapters count
POST   /topics                    - Create new topic
GET    /topics/:topicId           - Get topic with all chapters
PUT    /topics/:topicId           - Update topic
DELETE /topics/:topicId           - Delete topic (cascade delete chapters & questions)
```

#### Chapter Management (nested under topics)
```
GET    /topics/:topicId/chapters              - List chapters in topic
POST   /topics/:topicId/chapters              - Create chapter in topic
GET    /topics/:topicId/chapters/:chapterId   - Get specific chapter
PUT    /topics/:topicId/chapters/:chapterId   - Update chapter
DELETE /topics/:topicId/chapters/:chapterId   - Delete chapter (cascade delete questions)
```

#### Question Management (nested under chapters)
```
GET    /topics/:topicId/chapters/:chapterId/questions              - List questions
POST   /topics/:topicId/chapters/:chapterId/questions              - Create question
GET    /topics/:topicId/chapters/:chapterId/questions/:questionId  - Get question details
PUT    /topics/:topicId/chapters/:chapterId/questions/:questionId  - Update question
DELETE /topics/:topicId/chapters/:chapterId/questions/:questionId  - Delete question
```

#### Student-Facing Routes: `/api/v1/aptitude`
```
GET    /topics                          - List all topics (student view)
GET    /topics/:topicId/chapters        - List chapters in topic
GET    /topics/:topicId/chapters/:chapterId/questions    - List questions with options
GET    /topics/:topicId/chapters/:chapterId/questions/:questionId - Get question (full)
POST   /questions/:questionId/submit    - Submit answer
GET    /progress                        - Get student progress
```

### Request/Response Examples

#### Create Question Request
```json
{
  "statement": "A train running at 60 km/hr crosses a pole in 9 seconds. What is the length of the train?",
  "difficulty": "easy",
  "options": [
    { "optionKey": "A", "text": "120 metres", "isCorrect": true },
    { "optionKey": "B", "text": "180 metres", "isCorrect": false },
    { "optionKey": "C", "text": "324 metres", "isCorrect": false },
    { "optionKey": "D", "text": "150 metres", "isCorrect": false }
  ],
  "explanation": "Speed = 60 km/hr = 60 × (5/18) = 16.67 m/s. Time = 9 seconds. Distance = Speed × Time = 16.67 × 9 = 150 metres",
  "xpReward": 10,
  "companies": "TCS,Infosys",
  "timeLimit": 30
}
```

#### Get Question Response (Student View)
```json
{
  "id": "q123",
  "statement": "A train running at 60 km/hr crosses a pole in 9 seconds. What is the length of the train?",
  "difficulty": "easy",
  "options": [
    { "optionKey": "A", "text": "120 metres" },
    { "optionKey": "B", "text": "180 metres" },
    { "optionKey": "C", "text": "324 metres" },
    { "optionKey": "D", "text": "150 metres" }
  ],
  "timeLimit": 30,
  "xpReward": 10
  // Note: correctOption and explanation NOT included for students
}
```

---

## Phase 3: Frontend Components

### Admin Pages

#### 1. AptitudeDashboard.tsx
- List all topics
- Add/Edit/Delete topics
- Button to manage chapters in each topic

#### 2. AptitudeTopicDetail.tsx
- Show all chapters in selected topic
- Add/Edit/Delete chapters
- Button to manage questions in each chapter

#### 3. AptitudeChapterDetail.tsx
- Show all questions in chapter
- Add/Edit/Delete questions (with MCQ options builder)

#### 4. AptitudeQuestionForm.tsx
- Form to create/edit question
- MCQ Options builder (A, B, C, D fields)
- Difficulty selector
- Explanation field
- XP Reward field

### Student Pages

#### 1. AptitudePractice.tsx
- List all topics
- Select topic → List chapters
- Select chapter → Start quiz

#### 2. AptitudeQuizPage.tsx
- Display question + options (A, B, C, D)
- Timer countdown
- Submit button
- Show result (correct/incorrect)
- Show explanation if incorrect

#### 3. AptitudeProgress.tsx
- Overall stats (total attempted, correct, accuracy %)
- Topic-wise breakdown
- Chapter-wise performance

---

## Phase 4: Data Migration

### Step 1: Create new tables in Prisma
```prisma
model AptitudeTopic { ... }
model AptitudeChapter { ... }
model AptitudeQuestion { ... }
model AptitudeOption { ... }
model AptitudeSubmission { ... }
```

### Step 2: Run migration
```bash
npx prisma migrate dev --name restructure_aptitude
```

### Step 3: (Optional) Seed sample data
If existing `AptitudeAdminQuestion` records exist, migrate them:
```
1. Group by current "topic" field
2. Create AptitudeTopic records
3. Create default AptitudeChapter for each (e.g., "General")
4. Create AptitudeQuestion records with MCQ options
```

### Step 4: Delete old table
```sql
DROP TABLE AptitudeAdminQuestion;
```

---

## Implementation Checklist

### Backend
- [ ] Create migration: `20260804_restructure_aptitude.sql`
- [ ] Update `schema.prisma` with new models
- [ ] Create `aptitude-admin.routes.ts` (topic/chapter/question CRUD)
- [ ] Create `aptitude.routes.ts` (student-facing endpoints)
- [ ] Add validation middleware
- [ ] Add audit logging

### Frontend - Admin
- [ ] Create `AptitudeDashboard.tsx`
- [ ] Create `AptitudeTopicDetail.tsx`
- [ ] Create `AptitudeChapterDetail.tsx`
- [ ] Create `AptitudeQuestionForm.tsx` (with MCQ builder)
- [ ] Create `aptitudeAdminService.ts`
- [ ] Add to admin routes

### Frontend - Student
- [ ] Create `AptitudePractice.tsx`
- [ ] Create `AptitudeQuizPage.tsx`
- [ ] Create `AptitudeProgress.tsx`
- [ ] Create `aptitudeService.ts`
- [ ] Add to student routes

### Testing
- [ ] Manual test: Create topic → chapter → question with options
- [ ] Manual test: Student attempts question
- [ ] Manual test: Delete operations cascade correctly
- [ ] Manual test: Progress tracking works

---

## Benefits of New Structure

1. **Better Organization**: Topics → Chapters → Questions (hierarchical)
2. **MCQ Support**: Native support for multiple choice options with visual A, B, C, D format
3. **Scalability**: Easy to add more chapters/questions under any topic
4. **Student Experience**: Clear progression through topic → chapter → quiz
5. **Admin Experience**: Intuitive management interface mirroring the student experience
6. **Analytics**: Track performance per topic/chapter/question
7. **Duplication**: Questions can be organized under multiple chapters if needed

---

## Timeline Estimate
- Phase 1 (Database): 1-2 hours
- Phase 2 (Backend API): 3-4 hours
- Phase 3 (Frontend): 4-5 hours
- Phase 4 (Migration & Testing): 1-2 hours
- **Total: ~10-13 hours**

---

## Questions for Confirmation

1. Should we keep AptitudeTest table or remove it?
2. Should we support moving questions between chapters?
3. Should we track time-based analytics per question?
4. Should we add difficulty-based filtering in student view?
5. Do you want to show explanations after attempt or only for wrong answers?
