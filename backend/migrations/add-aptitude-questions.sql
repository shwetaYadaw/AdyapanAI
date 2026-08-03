-- Migration: Add AptitudeQuestion table
-- Date: 2024
-- Description: Create table for storing aptitude questions from hardcoded data to database

-- Create AptitudeQuestion table
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

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS "AptitudeQuestion_module_idx" ON "AptitudeQuestion"("module");
CREATE INDEX IF NOT EXISTS "AptitudeQuestion_topic_idx" ON "AptitudeQuestion"("topic");
CREATE INDEX IF NOT EXISTS "AptitudeQuestion_difficulty_idx" ON "AptitudeQuestion"("difficulty");
CREATE INDEX IF NOT EXISTS "AptitudeQuestion_module_topic_idx" ON "AptitudeQuestion"("module", "topic");

-- Migration completed successfully
