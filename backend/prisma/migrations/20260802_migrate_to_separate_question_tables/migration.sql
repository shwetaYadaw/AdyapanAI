-- ============================================================================
-- MIGRATION: Separate Questions into System-Specific Tables
-- 
-- This migration:
-- 1. Creates new separate tables for each system
-- 2. Migrates existing data from old tables
-- 3. Drops old tables
-- ============================================================================

-- ============================================================================
-- STEP 1: CREATE NEW SEPARATE TABLES FOR EACH SYSTEM
-- ============================================================================

-- TCS NQT Questions Table
CREATE TABLE "TcsNqtQuestion" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "statement" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL DEFAULT 'easy',
    "topic" TEXT NOT NULL,
    "companies" TEXT NOT NULL DEFAULT 'TCS',
    "timeLimit" INTEGER NOT NULL DEFAULT 2000,
    "memoryLimit" INTEGER NOT NULL DEFAULT 256,
    "inputFormat" TEXT,
    "outputFormat" TEXT,
    "constraints" TEXT,
    "referenceSolution" TEXT,
    "testCases" JSONB,
    "xpReward" INTEGER NOT NULL DEFAULT 10,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TcsNqtQuestion_pkey" PRIMARY KEY ("id")
);

-- Coding Arena Problems Table
CREATE TABLE "CodingArenaProblem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "statement" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL DEFAULT 'easy',
    "topic" TEXT NOT NULL,
    "companies" TEXT,
    "timeLimit" INTEGER NOT NULL DEFAULT 2000,
    "memoryLimit" INTEGER NOT NULL DEFAULT 256,
    "inputFormat" TEXT,
    "outputFormat" TEXT,
    "constraints" TEXT,
    "referenceSolution" TEXT,
    "testCases" JSONB,
    "xpReward" INTEGER NOT NULL DEFAULT 10,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CodingArenaProblem_pkey" PRIMARY KEY ("id")
);

-- Aptitude Admin Questions Table (replacing old AptitudeQuestion structure)
CREATE TABLE "AptitudeAdminQuestion" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "statement" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL DEFAULT 'easy',
    "topic" TEXT NOT NULL,
    "companies" TEXT,
    "inputFormat" TEXT,
    "outputFormat" TEXT,
    "constraints" TEXT,
    "referenceSolution" TEXT,
    "xpReward" INTEGER NOT NULL DEFAULT 10,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AptitudeAdminQuestion_pkey" PRIMARY KEY ("id")
);

-- ============================================================================
-- STEP 2: CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX "idx_tcs_nqt_topic" ON "TcsNqtQuestion"("topic");
CREATE INDEX "idx_tcs_nqt_difficulty" ON "TcsNqtQuestion"("difficulty");
CREATE INDEX "idx_tcs_nqt_created" ON "TcsNqtQuestion"("createdAt");

CREATE INDEX "idx_coding_arena_topic" ON "CodingArenaProblem"("topic");
CREATE INDEX "idx_coding_arena_difficulty" ON "CodingArenaProblem"("difficulty");
CREATE INDEX "idx_coding_arena_created" ON "CodingArenaProblem"("createdAt");

CREATE INDEX "idx_aptitude_admin_topic" ON "AptitudeAdminQuestion"("topic");
CREATE INDEX "idx_aptitude_admin_difficulty" ON "AptitudeAdminQuestion"("difficulty");
CREATE INDEX "idx_aptitude_admin_created" ON "AptitudeAdminQuestion"("createdAt");

-- ============================================================================
-- STEP 3: MIGRATE DATA FROM OLD TABLES TO NEW TABLES
-- ============================================================================

-- Migrate TCS NQT Questions from old "Question" table
INSERT INTO "TcsNqtQuestion" (
    "id", "title", "slug", "statement", "difficulty", "topic", 
    "companies", "timeLimit", "memoryLimit", "inputFormat", "outputFormat", 
    "constraints", "referenceSolution", "testCases", "xpReward", 
    "createdAt", "updatedAt"
)
SELECT 
    q.id,
    q.title,
    q.slug,
    q.statement,
    q.difficulty,
    COALESCE(q.topics::jsonb->0->>'name', 'General'),  -- Extract first topic or default to 'General'
    COALESCE(q.companies::jsonb->0->>'name', 'TCS'),   -- Extract first company or default to 'TCS'
    q."timeLimit",
    q."memoryLimit",
    q."inputFormat",
    q."outputFormat",
    q.constraints,
    '',  -- No reference solution in old table
    q."testCases",
    q."xpReward",
    q."createdAt",
    q."updatedAt"
FROM "Question" q
WHERE q.topics::jsonb @> '"tcs-nqt"'
ON CONFLICT ("slug") DO NOTHING;

-- Migrate Coding Arena Problems from old "Problem" table
INSERT INTO "CodingArenaProblem" (
    "id", "title", "slug", "statement", "difficulty", "topic",
    "companies", "timeLimit", "memoryLimit", "inputFormat", "outputFormat",
    "constraints", "referenceSolution", "testCases", "xpReward",
    "createdBy", "updatedBy", "createdAt", "updatedAt"
)
SELECT 
    p.id,
    p.title,
    p.slug,
    p.statement,
    p.difficulty,
    COALESCE(p.topics, 'General'),  -- Use topics field or default to 'General'
    p.companies,
    p."timeLimit",
    p."memoryLimit",
    p."inputFormat",
    p."outputFormat",
    p.constraints,
    p."referenceSolution",
    NULL,  -- testCases handled separately
    10,    -- Default XP reward
    p."createdBy",
    p."updatedBy",
    p."createdAt",
    p."updatedAt"
FROM "Problem" p
WHERE p."isArchived" = false
ON CONFLICT ("slug") DO NOTHING;

-- Migrate Aptitude Questions from old "AptitudeQuestion" table
INSERT INTO "AptitudeAdminQuestion" (
    "id", "title", "slug", "statement", "difficulty", "topic",
    "companies", "xpReward", "createdAt", "updatedAt"
)
SELECT 
    id,
    question,  -- Use question as title for now
    'aptitude-' || id,  -- Generate slug
    question,  -- Use as statement
    difficulty,
    topic,
    NULL,
    10,  -- Default XP reward
    "createdAt",
    "updatedAt"
FROM "AptitudeQuestion"
ON CONFLICT ("slug") DO NOTHING;

-- ============================================================================
-- STEP 4: DROP OLD TABLES (AFTER DATA MIGRATION)
-- ============================================================================

-- Drop old Question table and related indexes
DROP TABLE IF EXISTS "QuestionSubmission" CASCADE;
DROP TABLE IF EXISTS "QuestionSubmissionResult" CASCADE;
DROP TABLE IF EXISTS "Question" CASCADE;

-- Drop old Problem table and related objects
DROP TABLE IF EXISTS "ProblemSubmission" CASCADE;
DROP TABLE IF EXISTS "ProblemSubmissionResult" CASCADE;
DROP TABLE IF EXISTS "ProblemTestCase" CASCADE;
DROP TABLE IF EXISTS "ProblemSolution" CASCADE;
DROP TABLE IF EXISTS "ProblemVersion" CASCADE;
DROP TABLE IF EXISTS "Problem" CASCADE;

-- Drop old AptitudeQuestion table
DROP TABLE IF EXISTS "AptitudeQuestion" CASCADE;

-- ============================================================================
-- SUMMARY
-- ============================================================================
-- 
-- New Structure:
-- ✅ TcsNqtQuestion     - For TCS NQT system questions
-- ✅ CodingArenaProblem - For Coding Arena system problems
-- ✅ AptitudeAdminQuestion - For Aptitude system questions
--
-- Each table has:
-- - Separate storage (easy to count)
-- - Topic field (admin-selected topic from Topic table)
-- - Difficulty (easy, medium, hard)
-- - Companies field
-- - Full question/problem details
-- - Timestamps and audit fields
-- - Optimized indexes for fast queries
--
-- ============================================================================
