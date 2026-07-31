# Aptitude System Architecture

## System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         STUDENT INTERFACE                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  AptitudePage.tsx                                             │  │
│  │  - Select Module (Quantitative/Verbal/Logical)                │  │
│  │  - Browse Topics                                              │  │
│  │  - View Question Count per Topic                              │  │
│  └────────────────────┬──────────────────────────────────────────┘  │
│                       │                                              │
│                       ▼                                              │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  AptitudeQuizPage.tsx                                         │  │
│  │  - Take Quiz                                                  │  │
│  │  - View Questions One by One                                  │  │
│  │  - See Explanations                                           │  │
│  │  - Track Score                                                │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
└────────────────────────────┬──────────────────────────────────────┘
                             │
                             │ GET /api/v1/aptitude?module=X&topic=Y
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          API LAYER                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  aptitude.routes.ts                                                  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  GET    /api/v1/aptitude           - List all questions       │  │
│  │  GET    /api/v1/aptitude/:id       - Get single question      │  │
│  │  POST   /api/v1/aptitude           - Create (Admin)           │  │
│  │  PUT    /api/v1/aptitude/:id       - Update (Admin)           │  │
│  │  DELETE /api/v1/aptitude/:id       - Delete (Admin)           │  │
│  │  GET    /api/v1/aptitude/modules/list  - List modules         │  │
│  │  GET    /api/v1/aptitude/topics/list   - List topics          │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
└────────────────────────────┬──────────────────────────────────────┘
                             │
                             │ Prisma ORM
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  PostgreSQL / Supabase                                               │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  AptitudeQuestion Table                                       │  │
│  │  ├── id (UUID)                                                │  │
│  │  ├── question (TEXT)                                          │  │
│  │  ├── options (JSONB)           [Array of strings]            │  │
│  │  ├── answer (TEXT)                                            │  │
│  │  ├── explanation (TEXT)                                       │  │
│  │  ├── module (TEXT)             quantitative/verbal/logical   │  │
│  │  ├── topic (TEXT)              percentage/profit-loss/etc    │  │
│  │  ├── difficulty (TEXT)         easy/medium/hard              │  │
│  │  ├── questionImage (TEXT?)     Optional image path           │  │
│  │  ├── optionImages (JSONB?)     Optional option images        │  │
│  │  ├── isImageBased (BOOLEAN)                                  │  │
│  │  ├── createdAt (TIMESTAMP)                                   │  │
│  │  └── updatedAt (TIMESTAMP)                                   │  │
│  │                                                                │  │
│  │  Indexes:                                                     │  │
│  │  - module_idx                                                 │  │
│  │  - topic_idx                                                  │  │
│  │  - difficulty_idx                                             │  │
│  │  - module_topic_idx (composite)                               │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
└────────────────────────────┬──────────────────────────────────────┘
                             │
                             │ POST/PUT/DELETE (Admin Only)
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        ADMIN INTERFACE                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  AdminAptitudePage.tsx                                        │  │
│  │  - View All Questions                                         │  │
│  │  - Create New Question                                        │  │
│  │  - Edit Existing Question                                     │  │
│  │  - Delete Question                                            │  │
│  │  - Filter by Module/Topic/Difficulty                          │  │
│  │  - Support Image-based Questions                              │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Student Taking Quiz
```
1. Student → AptitudePage
   └─ Selects "Quantitative" module
   
2. AptitudePage → API
   └─ GET /api/v1/aptitude?module=quantitative
   
3. API → Database
   └─ SELECT * FROM AptitudeQuestion WHERE module='quantitative'
   
4. Database → API
   └─ Returns grouped questions by topic
   
5. API → AptitudePage
   └─ Display topics with question counts
   
6. Student → Clicks "Percentage" topic
   
7. AptitudePage → AptitudeQuizPage
   └─ Navigate to /student/aptitude/quantitative/percentage
   
8. AptitudeQuizPage → API
   └─ GET /api/v1/aptitude?module=quantitative&topic=percentage
   
9. API → Database
   └─ SELECT * FROM AptitudeQuestion 
      WHERE module='quantitative' AND topic='percentage'
      
10. Database → API → AptitudeQuizPage
    └─ Display questions one by one with options
```

### Admin Managing Questions
```
1. Admin → Login
   └─ admin@adyapan.com / Admin@123
   
2. Admin → AdminAptitudePage
   └─ Navigate to /admin/aptitude
   
3. AdminAptitudePage → API
   └─ GET /api/v1/aptitude (fetch all questions)
   
4. Admin → Clicks "Create Question"
   └─ Opens modal form
   
5. Admin → Fills form and submits
   └─ POST /api/v1/aptitude with question data
   
6. API → Validates + Authenticates
   └─ Checks JWT token, admin role
   
7. API → Database
   └─ INSERT INTO AptitudeQuestion VALUES (...)
   
8. Database → API → AdminAptitudePage
   └─ Returns created question
   
9. AdminAptitudePage
   └─ Shows success message, refreshes list
```

## Component Structure

### Student Pages
```
AptitudePage.tsx
├── Module Selection Cards (Quantitative, Verbal, Logical)
├── Topics Grid
│   ├── Topic Card
│   │   ├── Topic Name
│   │   ├── Question Count
│   │   └── Difficulty Distribution
│   └── [More Topic Cards...]
└── Navigation

AptitudeQuizPage.tsx
├── Progress Bar
├── Question Card
│   ├── Question Text
│   ├── Options (Multiple Choice)
│   ├── Explanation (After Answer)
│   └── Feedback (Correct/Incorrect)
├── Navigation Buttons
│   ├── Previous
│   └── Next / Finish
└── Score Display
```

### Admin Page
```
AdminAptitudePage.tsx
├── Header + Create Button
├── Questions List
│   ├── Question Card
│   │   ├── Question Preview
│   │   ├── Module Badge
│   │   ├── Topic Badge
│   │   ├── Difficulty Badge
│   │   ├── Edit Button
│   │   └── Delete Button
│   └── [More Question Cards...]
└── Modal (Create/Edit)
    ├── Module Select
    ├── Topic Input
    ├── Difficulty Select
    ├── Question Text Area
    ├── Options Input (Dynamic)
    ├── Answer Input
    ├── Explanation Text Area
    └── Image Fields (Optional)
```

## Database Schema Details

### AptitudeQuestion Model
```typescript
model AptitudeQuestion {
  id             String   @id @default(uuid())
  question       String   @db.Text
  options        Json     // ["option1", "option2", "option3", "option4"]
  answer         String   // Must match one of the options
  explanation    String   @db.Text
  module         String   // "quantitative" | "verbal" | "logical"
  topic          String   // "percentage", "profit-loss", etc.
  difficulty     String   @default("medium") // "easy" | "medium" | "hard"
  questionImage  String?  // Optional: /images/questions/q1.png
  optionImages   Json?    // Optional: {"A": "/img/a.png", "B": "/img/b.png"}
  isImageBased   Boolean  @default(false)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

### Example Database Record
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "question": "A number is increased by 25%, then it becomes 600. The original number is:",
  "options": ["450", "480", "500", "520"],
  "answer": "480",
  "explanation": "Let the original number be x. x + 0.25x = 600 => 1.25x = 600 => x = 480.",
  "module": "quantitative",
  "topic": "percentage",
  "difficulty": "medium",
  "questionImage": null,
  "optionImages": null,
  "isImageBased": false,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

## API Request/Response Examples

### List Questions
```http
GET /api/v1/aptitude?module=quantitative&topic=percentage

Response:
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "question": "A number is increased by 25%...",
      "options": ["450", "480", "500", "520"],
      "answer": "480",
      "explanation": "Let the original number be x...",
      "module": "quantitative",
      "topic": "percentage",
      "difficulty": "medium"
    },
    // ... more questions
  ]
}
```

### Create Question (Admin)
```http
POST /api/v1/aptitude
Headers: Authorization: Bearer <admin-token>

Request Body:
{
  "question": "What is 2 + 2?",
  "options": ["3", "4", "5", "6"],
  "answer": "4",
  "explanation": "Basic addition: 2 + 2 = 4",
  "module": "quantitative",
  "topic": "basic-math",
  "difficulty": "easy"
}

Response:
{
  "success": true,
  "message": "Question created successfully",
  "data": {
    "id": "new-uuid",
    "question": "What is 2 + 2?",
    // ... rest of the created question
  }
}
```

## Technology Stack

- **Frontend**: React + TypeScript + TanStack Query
- **Backend**: Node.js + Express + Prisma ORM
- **Database**: PostgreSQL (Supabase)
- **Authentication**: JWT tokens
- **Styling**: Tailwind CSS

## Key Features

✅ **Dynamic Question Management**
- Add/Edit/Delete via admin panel
- No code changes required

✅ **Filtering & Search**
- Filter by module, topic, difficulty
- Fast database queries with indexes

✅ **Scalability**
- Supports thousands of questions
- Efficient pagination (future)

✅ **Image Support**
- Optional question images
- Optional option images
- Image-based questions flag

✅ **User Experience**
- Instant feedback on answers
- Progress tracking
- Score calculation
- Detailed explanations

✅ **Admin Experience**
- Full CRUD operations
- Form validation
- Batch operations (future)
- Analytics (future)
