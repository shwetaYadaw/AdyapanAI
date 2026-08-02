import { prisma } from '../config/prisma';

async function createSeparateSubmissionTables() {
  try {
    console.log('🔧 Creating separate submission tables for Problems and Questions...\n');

    // Execute raw SQL to create the new tables
    await prisma.$executeRawUnsafe(`
      -- Create QuestionSubmission table for TCS NQT
      CREATE TABLE IF NOT EXISTS "QuestionSubmission" (
        "id" TEXT PRIMARY KEY,
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
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
        FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE
      );

      -- Create QuestionSubmissionResult table
      CREATE TABLE IF NOT EXISTS "QuestionSubmissionResult" (
        "id" TEXT PRIMARY KEY,
        "questionSubmissionId" TEXT UNIQUE NOT NULL,
        "status" TEXT NOT NULL,
        "errorMessage" TEXT,
        "runtime" INTEGER NOT NULL DEFAULT 0,
        "memory" INTEGER NOT NULL DEFAULT 0,
        "passedCount" INTEGER NOT NULL DEFAULT 0,
        "totalCount" INTEGER NOT NULL DEFAULT 0,
        "score" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("questionSubmissionId") REFERENCES "QuestionSubmission"("id") ON DELETE CASCADE
      );

      -- Create ProblemSubmission table for Coding Arena
      CREATE TABLE IF NOT EXISTS "ProblemSubmission" (
        "id" TEXT PRIMARY KEY,
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
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
        FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE
      );

      -- Create ProblemSubmissionResult table
      CREATE TABLE IF NOT EXISTS "ProblemSubmissionResult" (
        "id" TEXT PRIMARY KEY,
        "problemSubmissionId" TEXT UNIQUE NOT NULL,
        "status" TEXT NOT NULL,
        "errorMessage" TEXT,
        "runtime" INTEGER NOT NULL DEFAULT 0,
        "memory" INTEGER NOT NULL DEFAULT 0,
        "passedCount" INTEGER NOT NULL DEFAULT 0,
        "totalCount" INTEGER NOT NULL DEFAULT 0,
        "score" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("problemSubmissionId") REFERENCES "ProblemSubmission"("id") ON DELETE CASCADE
      );

      -- Create indexes for better query performance
      CREATE INDEX IF NOT EXISTS "QuestionSubmission_userId_idx" ON "QuestionSubmission"("userId");
      CREATE INDEX IF NOT EXISTS "QuestionSubmission_questionId_idx" ON "QuestionSubmission"("questionId");
      CREATE INDEX IF NOT EXISTS "QuestionSubmission_status_idx" ON "QuestionSubmission"("status");
      CREATE INDEX IF NOT EXISTS "QuestionSubmission_createdAt_idx" ON "QuestionSubmission"("createdAt");

      CREATE INDEX IF NOT EXISTS "ProblemSubmission_userId_idx" ON "ProblemSubmission"("userId");
      CREATE INDEX IF NOT EXISTS "ProblemSubmission_problemId_idx" ON "ProblemSubmission"("problemId");
      CREATE INDEX IF NOT EXISTS "ProblemSubmission_status_idx" ON "ProblemSubmission"("status");
      CREATE INDEX IF NOT EXISTS "ProblemSubmission_createdAt_idx" ON "ProblemSubmission"("createdAt");
    `);

    console.log('✅ Successfully created separate submission tables!');
    console.log('   - QuestionSubmission (for TCS NQT)');
    console.log('   - QuestionSubmissionResult');
    console.log('   - ProblemSubmission (for Coding Arena)');
    console.log('   - ProblemSubmissionResult');
    console.log('   - Created indexes for performance');

  } catch (error) {
    console.error('❌ Error creating tables:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSeparateSubmissionTables();
