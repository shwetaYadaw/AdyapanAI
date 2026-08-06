-- AlterTable: Add 'section' column to AptitudeTopic
ALTER TABLE "AptitudeTopic" ADD COLUMN IF NOT EXISTS "section" TEXT NOT NULL DEFAULT 'Numerical Ability';

-- Create index on section
CREATE INDEX IF NOT EXISTS "AptitudeTopic_section_idx" ON "AptitudeTopic"("section");

-- AlterTable: Add new fields to AptitudeQuestion
ALTER TABLE "AptitudeQuestion" ADD COLUMN IF NOT EXISTS "stepSolution" TEXT;
ALTER TABLE "AptitudeQuestion" ADD COLUMN IF NOT EXISTS "formula" TEXT;
ALTER TABLE "AptitudeQuestion" ADD COLUMN IF NOT EXISTS "hints" TEXT;
ALTER TABLE "AptitudeQuestion" ADD COLUMN IF NOT EXISTS "questionType" TEXT NOT NULL DEFAULT 'MCQ';
ALTER TABLE "AptitudeQuestion" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;
ALTER TABLE "AptitudeQuestion" ADD COLUMN IF NOT EXISTS "tags" TEXT;

-- Create index on questionType
CREATE INDEX IF NOT EXISTS "AptitudeQuestion_questionType_idx" ON "AptitudeQuestion"("questionType");
