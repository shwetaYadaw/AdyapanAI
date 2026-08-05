-- Create Aptitude hierarchical schema tables

-- AptitudeTopic table
CREATE TABLE IF NOT EXISTS "AptitudeTopic" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "description" TEXT,
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- AptitudeChapter table
CREATE TABLE IF NOT EXISTS "AptitudeChapter" (
    "id" TEXT PRIMARY KEY,
    "topicId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY ("topicId") REFERENCES "AptitudeTopic"("id") ON DELETE CASCADE,
    UNIQUE("topicId", "name")
);

-- AptitudeQuestion table
CREATE TABLE IF NOT EXISTS "AptitudeQuestion" (
    "id" TEXT PRIMARY KEY,
    "chapterId" TEXT NOT NULL,
    "statement" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL DEFAULT 'medium',
    "correctOption" TEXT NOT NULL,
    "explanation" TEXT,
    "xpReward" INTEGER NOT NULL DEFAULT 10,
    "companies" TEXT,
    "timeLimit" INTEGER NOT NULL DEFAULT 30,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY ("chapterId") REFERENCES "AptitudeChapter"("id") ON DELETE CASCADE
);

-- AptitudeOption table
CREATE TABLE IF NOT EXISTS "AptitudeOption" (
    "id" TEXT PRIMARY KEY,
    "questionId" TEXT NOT NULL,
    "optionKey" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY ("questionId") REFERENCES "AptitudeQuestion"("id") ON DELETE CASCADE,
    UNIQUE("questionId", "optionKey")
);

-- AptitudeSubmission table
CREATE TABLE IF NOT EXISTS "AptitudeSubmission" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT,
    "questionId" TEXT NOT NULL,
    "selectedOption" TEXT,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "timeSpent" INTEGER,
    "xpEarned" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY ("questionId") REFERENCES "AptitudeQuestion"("id") ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS "idx_AptitudeChapter_topicId" ON "AptitudeChapter"("topicId");
CREATE INDEX IF NOT EXISTS "idx_AptitudeQuestion_chapterId" ON "AptitudeQuestion"("chapterId");
CREATE INDEX IF NOT EXISTS "idx_AptitudeQuestion_difficulty" ON "AptitudeQuestion"("difficulty");
CREATE INDEX IF NOT EXISTS "idx_AptitudeOption_questionId" ON "AptitudeOption"("questionId");
CREATE INDEX IF NOT EXISTS "idx_AptitudeSubmission_userId" ON "AptitudeSubmission"("userId");
CREATE INDEX IF NOT EXISTS "idx_AptitudeSubmission_questionId" ON "AptitudeSubmission"("questionId");
