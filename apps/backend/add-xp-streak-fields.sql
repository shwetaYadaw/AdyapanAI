-- Add totalXP, streak, and lastActiveDate fields to StudentProfile table
-- Run this SQL script manually on your database

-- Add new columns
ALTER TABLE "StudentProfile" 
ADD COLUMN IF NOT EXISTS "totalXP" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "streak" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "lastActiveDate" TIMESTAMP(3);

-- Copy existing XP values to totalXP for existing users
UPDATE "StudentProfile" SET "totalXP" = "xp" WHERE "totalXP" = 0;

-- Optionally, generate Prisma Client after running this
-- Run: npx prisma generate
