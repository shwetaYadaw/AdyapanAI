-- Migration: Separate submission tables for Problems (Coding Arena) and Questions (TCS NQT)
-- Date: 2026-08-02

-- ============================================================
-- 1. Create QuestionSubmission table for TCS NQT
-- ============================================================

CREATE TABLE IF NOT EXISTS "QuestionSubmission" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL,
  "questionId" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "language" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "errorMessage" TEXT,
  "runtime" INTEGER NOT NULL DEFAULT 0,
  "passedCount" INTEGER NOT NULL DEFAULT 0,
  "totalCount" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "QuestionSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
  CONSTRAINT "QuestionSubmission_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE
);

-- ============================================================
-- 2. Create QuestionSubmissionResult table
-- ============================================================

CREATE TABLE IF NOT EXISTS "QuestionSubmissionResult" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "questionSubmissionId" TEXT UNIQUE NOT NULL,
  "status" TEXT NOT NULL,
  "errorMessage" TEXT,
  "runtime" INTEGER NOT NULL DEFAULT 0,
  "memory" INTEGER NOT NULL DEFAULT 0,
  "passedCount" INTEGER NOT NULL DEFAULT 0,
  "totalCount" INTEGER NOT NULL DEFAULT 0,
  "score" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "QuestionSubmissionResult_questionSubmissionId_fkey" FOREIGN KEY ("questionSubmissionId") REFERENCES "QuestionSubmission"("id") ON DELETE CASCADE
);

-- ============================================================
-- 3. Create ProblemSubmission table for Coding Arena
-- ============================================================

CREATE TABLE IF NOT EXISTS "ProblemSubmission" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL,
  "problemId" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "language" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "errorMessage" TEXT,
  "runtime" INTEGER NOT NULL DEFAULT 0,
  "passedCount" INTEGER NOT NULL DEFAULT 0,
  "totalCount" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProblemSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
  CONSTRAINT "ProblemSubmission_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE
);

-- ============================================================
-- 4. Create ProblemSubmissionResult table
-- ============================================================

CREATE TABLE IF NOT EXISTS "ProblemSubmissionResult" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "problemSubmissionId" TEXT UNIQUE NOT NULL,
  "status" TEXT NOT NULL,
  "errorMessage" TEXT,
  "runtime" INTEGER NOT NULL DEFAULT 0,
  "memory" INTEGER NOT NULL DEFAULT 0,
  "passedCount" INTEGER NOT NULL DEFAULT 0,
  "totalCount" INTEGER NOT NULL DEFAULT 0,
  "score" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProblemSubmissionResult_problemSubmissionId_fkey" FOREIGN KEY ("problemSubmissionId") REFERENCES "ProblemSubmission"("id") ON DELETE CASCADE
);

-- ============================================================
-- 5. Create indexes for better query performance
-- ============================================================

-- QuestionSubmission indexes
CREATE INDEX IF NOT EXISTS "QuestionSubmission_userId_idx" ON "QuestionSubmission"("userId");
CREATE INDEX IF NOT EXISTS "QuestionSubmission_questionId_idx" ON "QuestionSubmission"("questionId");
CREATE INDEX IF NOT EXISTS "QuestionSubmission_status_idx" ON "QuestionSubmission"("status");
CREATE INDEX IF NOT EXISTS "QuestionSubmission_createdAt_idx" ON "QuestionSubmission"("createdAt" DESC);
CREATE INDEX IF NOT EXISTS "QuestionSubmission_userId_questionId_idx" ON "QuestionSubmission"("userId", "questionId");

-- ProblemSubmission indexes
CREATE INDEX IF NOT EXISTS "ProblemSubmission_userId_idx" ON "ProblemSubmission"("userId");
CREATE INDEX IF NOT EXISTS "ProblemSubmission_problemId_idx" ON "ProblemSubmission"("problemId");
CREATE INDEX IF NOT EXISTS "ProblemSubmission_status_idx" ON "ProblemSubmission"("status");
CREATE INDEX IF NOT EXISTS "ProblemSubmission_createdAt_idx" ON "ProblemSubmission"("createdAt" DESC);
CREATE INDEX IF NOT EXISTS "ProblemSubmission_userId_problemId_idx" ON "ProblemSubmission"("userId", "problemId");

-- ============================================================
-- 6. Add comments for documentation
-- ============================================================

COMMENT ON TABLE "QuestionSubmission" IS 'Student submissions for TCS NQT questions';
COMMENT ON TABLE "QuestionSubmissionResult" IS 'Detailed evaluation results for TCS NQT question submissions';
COMMENT ON TABLE "ProblemSubmission" IS 'Student submissions for Coding Arena problems';
COMMENT ON TABLE "ProblemSubmissionResult" IS 'Detailed evaluation results for Coding Arena problem submissions';

-- ============================================================
-- Migration complete
-- ============================================================
-- Tables created:
--   - QuestionSubmission (TCS NQT submissions)
--   - QuestionSubmissionResult (TCS NQT results)
--   - ProblemSubmission (Coding Arena submissions)
--   - ProblemSubmissionResult (Coding Arena results)
--
-- Indexes created for optimal query performance
-- Foreign key constraints ensure referential integrity
-- ============================================================
