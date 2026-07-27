# Puzzle Schema Migration

## Overview
This migration adds puzzle-related tables to the Adyapan platform database to support pattern recognition, logic, and shape-based puzzle functionality.

## New Models

### Puzzle Model
Stores puzzle definitions with metadata.

```sql
CREATE TABLE "Puzzle" (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  "puzzleType" TEXT NOT NULL CHECK ("puzzleType" IN ('pattern', 'sequence', 'logic', 'shape', 'odd-one-out')),
  difficulty TEXT NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  "correctAnswer" TEXT NOT NULL,
  explanation TEXT,
  category TEXT,
  topic TEXT,
  tags JSONB,
  "estimatedTime" INTEGER,
  "isPublished" BOOLEAN NOT NULL DEFAULT false,
  rating FLOAT NOT NULL DEFAULT 0,
  "ratingCount" INTEGER NOT NULL DEFAULT 0,
  "completionRate" FLOAT NOT NULL DEFAULT 0,
  "createdBy" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_puzzle_type ON "Puzzle"("puzzleType");
CREATE INDEX idx_puzzle_difficulty ON "Puzzle"(difficulty);
CREATE INDEX idx_puzzle_category ON "Puzzle"(category);
CREATE INDEX idx_puzzle_published ON "Puzzle"("isPublished");
```

### PuzzleAttempt Model
Tracks user attempts on puzzles.

```sql
CREATE TABLE "PuzzleAttempt" (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
  "puzzleId" TEXT NOT NULL REFERENCES "Puzzle"(id) ON DELETE CASCADE,
  "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  "selectedAnswer" TEXT NOT NULL,
  "isCorrect" BOOLEAN NOT NULL,
  "timeSpent" INTEGER NOT NULL,
  confidence FLOAT,
  "aiAnalysis" JSONB,
  score INTEGER,
  "xpEarned" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_attempt_puzzle_user ON "PuzzleAttempt"("puzzleId", "userId");
CREATE INDEX idx_attempt_correct ON "PuzzleAttempt"("isCorrect");
CREATE UNIQUE INDEX idx_attempt_unique ON "PuzzleAttempt"("puzzleId", "userId", "createdAt");
```

### PuzzleReview Model
Stores user reviews and ratings for puzzles.

```sql
CREATE TABLE "PuzzleReview" (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
  "puzzleId" TEXT NOT NULL REFERENCES "Puzzle"(id) ON DELETE CASCADE,
  "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  helpful BOOLEAN,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_review_puzzle ON "PuzzleReview"("puzzleId");
CREATE UNIQUE INDEX idx_review_unique ON "PuzzleReview"("puzzleId", "userId");
```

## User Model Updates

Added relations to User model:
- `puzzleAttempts: PuzzleAttempt[]`
- `puzzleReviews: PuzzleReview[]`

## Migration Steps

1. Run Prisma migration:
```bash
npx prisma migrate dev --name add_puzzle_schema
```

2. Generate Prisma Client:
```bash
npx prisma generate
```

3. Verify schema:
```bash
npx prisma db push
```

## Options Column Structure

The `options` column in Puzzle table stores JSON array:
```json
[
  {
    "id": "A",
    "description": "Option A description",
    "imageUrl": "https://example.com/image.jpg"
  },
  ...
]
```

## aiAnalysis Column Structure

The `aiAnalysis` column in PuzzleAttempt stores:
```json
{
  "reasoning": "Step-by-step reasoning",
  "stepByStep": ["step 1", "step 2"],
  "explanation": "Detailed explanation"
}
```

## Queries

### Get puzzle statistics
```sql
SELECT 
  p.id,
  p.title,
  p."puzzleType",
  COUNT(pa.id) as total_attempts,
  COUNT(CASE WHEN pa."isCorrect" THEN 1 END) as correct_attempts,
  AVG(CASE WHEN pa."isCorrect" THEN 1.0 ELSE 0 END) as success_rate,
  AVG(pa."timeSpent") as avg_time_spent
FROM "Puzzle" p
LEFT JOIN "PuzzleAttempt" pa ON p.id = pa."puzzleId"
GROUP BY p.id
ORDER BY total_attempts DESC;
```

### Get user puzzle progress
```sql
SELECT 
  p."puzzleType",
  COUNT(pa.id) as attempts,
  COUNT(CASE WHEN pa."isCorrect" THEN 1 END) as correct,
  SUM(pa."xpEarned") as total_xp
FROM "PuzzleAttempt" pa
JOIN "Puzzle" p ON pa."puzzleId" = p.id
WHERE pa."userId" = $1
GROUP BY p."puzzleType";
```

## Rollback

To rollback this migration:
```bash
npx prisma migrate resolve --rolled-back add_puzzle_schema
```
