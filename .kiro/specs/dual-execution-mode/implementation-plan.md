# Dual Execution Mode - Implementation Plan

## Overview

This document provides a detailed, step-by-step implementation plan for adding dual execution mode support to Adyapan AI.

---

## Phase 1: Database Migration (Days 1-2)

### Task 1.1: Create Prisma Migration

**File**: `apps/backend/prisma/migrations/YYYYMMDD_add_execution_mode/migration.sql`

```sql
-- Add new columns to Question table
ALTER TABLE "Question" 
ADD COLUMN "executionMode" TEXT DEFAULT 'full-program',
ADD COLUMN "functionSignature" JSONB,
ADD COLUMN "parameterTypes" JSONB;

-- Update all existing questions
UPDATE "Question" 
SET "executionMode" = 'full-program'
WHERE "executionMode" IS NULL;

-- Add constraints
ALTER TABLE "Question"
ADD CONSTRAINT "check_execution_mode" 
CHECK ("executionMode" IN ('full-program', 'function'));

-- Create index for performance
CREATE INDEX "idx_question_execution_mode" 
ON "Question"("executionMode");
```

### Task 1.2: Update Prisma Schema

**File**: `apps/backend/prisma/schema.prisma`

```prisma
model Question {
  id                String       @id @default(uuid())
  title             String
  slug              String       @unique
  statement         String       @db.Text
  difficulty        String       @default("easy")
  
  // NEW FIELDS
  executionMode     String       @default("full-program") // "full-program" | "function"
  functionSignature Json?        // { python: "def solution(...):", java: "...", ... }
  parameterTypes    Json?        // { params: [...], returnType: "..." }
  
  // Existing fields
  topics            Json
  companies         Json
  timeLimit         Int          @default(2000)
  memoryLimit       Int          @default(256)
  inputFormat       String       @db.Text
  outputFormat      String       @db.Text
  constraints       String       @db.Text
  sampleInput       String       @db.Text
  sampleOutput      String       @db.Text
  templates         Json
  testCases         Json
