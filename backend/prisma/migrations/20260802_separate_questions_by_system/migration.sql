-- Create separate tables for each system

-- ===== TCS NQT QUESTIONS =====
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

-- ===== CODING ARENA PROBLEMS =====
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

-- ===== APTITUDE QUESTIONS =====
CREATE TABLE "AptitudeQuestion" (
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

    CONSTRAINT "AptitudeQuestion_pkey" PRIMARY KEY ("id")
);

-- ===== INDEXES FOR FAST QUERIES =====
CREATE INDEX "idx_tcs_nqt_topic" ON "TcsNqtQuestion"("topic");
CREATE INDEX "idx_tcs_nqt_difficulty" ON "TcsNqtQuestion"("difficulty");
CREATE INDEX "idx_tcs_nqt_created" ON "TcsNqtQuestion"("createdAt");

CREATE INDEX "idx_coding_arena_topic" ON "CodingArenaProblem"("topic");
CREATE INDEX "idx_coding_arena_difficulty" ON "CodingArenaProblem"("difficulty");
CREATE INDEX "idx_coding_arena_created" ON "CodingArenaProblem"("createdAt");

CREATE INDEX "idx_aptitude_topic" ON "AptitudeQuestion"("topic");
CREATE INDEX "idx_aptitude_difficulty" ON "AptitudeQuestion"("difficulty");
CREATE INDEX "idx_aptitude_created" ON "AptitudeQuestion"("createdAt");
