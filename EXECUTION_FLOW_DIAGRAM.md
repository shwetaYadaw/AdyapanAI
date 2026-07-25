# Execution Flow & Diagram

## Complete Project Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    AdyapanAI DSA Problems Project                        │
│                      Complete Execution Flow                             │
└─────────────────────────────────────────────────────────────────────────┘

                            START
                              │
                              ▼
                    ┌──────────────────┐
                    │  Prerequisites   │
                    │  ✓ Node.js       │
                    │  ✓ MySQL         │
                    │  ✓ npm           │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  Setup .env File │
                    │  - Database URL  │
                    │  - MySQL Creds   │
                    │  - JWT Secrets   │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Create Database  │
                    │ adyapan          │
                    │ npx prisma       │
                    │ db push          │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  npm install     │
                    │  Install deps    │
                    └────────┬─────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
   PHASE 1 (Optional)   PHASE 2              PHASE 3
   Cleanup              Updates              Creation
        │                    │                    │
        │                    │                    │
        ▼                    ▼                    ▼
    ┌────────────┐    ┌──────────────┐   ┌────────────────┐
    │ Cleanup    │    │Update 4 Old  │   │ Create 6 New   │
    │• Remove    │    │  Problems    │   │   Problems     │
    │  duplicates│    │• Jump Game   │   │• Min Abs Sum   │
    │• Verify    │    │• Jump Game   │   │• Min Arrows    │
    │  database  │    │  II          │   │• Max Equal Sum │
    └────┬───────┘    │• Gas Station │   │• Min Cost K    │
         │            │• Cash Flow   │   │• Min Coins     │
         │            └──────┬───────┘   │• Max Height    │
         │                   │           └────────┬───────┘
         │                   │                    │
         ▼                   ▼                    ▼
    ┌────────────┐   ┌──────────────┐   ┌────────────────┐
    │ Check DB   │   │ Prisma       │   │ Prisma         │
    │ Count      │   │ Update()     │   │ Create()       │
    │ 535 → 535  │   │ 4 problems   │   │ 6 problems     │
    └────┬───────┘   └──────┬───────┘   └────────┬───────┘
         │                   │                    │
         └────────────────────┼────────────────────┘
                              │
                              ▼
                        ┌──────────────┐
                        │ PHASE 4      │
                        │ Verification │
                        └──────┬───────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    ▼                     ▼
            ┌───────────────┐      ┌────────────────┐
            │ Check Count   │      │ Verify Content │
            │ 535 + 6 = 541 │      │ • Templates    │
            │ ✅ PASS       │      │ • Tests        │
            └────────┬──────┘      │ • Examples     │
                     │             │ ✅ PASS        │
                     │             └────────┬───────┘
                     │                      │
                     └──────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │    DATABASE      │
                    │  541 Problems    │
                    │ Ready for Use    │
                    └──────────────────┘
                              │
                              ▼
                           SUCCESS ✅
```

---

## Detailed Phase Breakdown

### PHASE 1: Cleanup (Optional)

```
CLEANUP PHASE
│
├─ checkDbCount.ts
│  └─ Query: SELECT COUNT(*) FROM Question
│     └─ Output: Current database count
│
├─ identifyExtraProblems.ts
│  └─ Query: Find problems created after 2026-07-20
│     └─ Output: List of extra problems
│
└─ finalCleanup.ts
   └─ Action: DELETE extra problems
      └─ Output: 23 deleted, count restored to 535
```

### PHASE 2: Update Existing (4 Problems)

```
UPDATE PHASE (Prisma update())
│
├─ updateJumpGameProblem.ts
│  ├─ Input: Comprehensive content
│  ├─ Action: prisma.question.update({id, data})
│  └─ Output: Jump Game updated ✅
│
├─ updateJumpGameIIProblem.ts
│  ├─ Input: Comprehensive content
│  ├─ Action: prisma.question.update({id, data})
│  └─ Output: Jump Game II updated ✅
│
├─ updateGasStationProblem.ts
│  ├─ Input: Comprehensive content
│  ├─ Action: prisma.question.update({id, data})
│  └─ Output: Gas Station updated ✅
│
└─ updateMinimizeCashFlowProblem.ts
   ├─ Input: Comprehensive content
   ├─ Action: prisma.question.update({id, data})
   └─ Output: Minimize Cash Flow updated ✅
```

### PHASE 3: Create New (6 Problems)

```
CREATION PHASE (Prisma create())
│
├─ updateMaxHeightStackingCuboidsProblem.ts
│  ├─ Input: Full problem data (HARD, 12 XP)
│  ├─ Action: prisma.question.create({data})
│  └─ Output: Problem created ✅
│
├─ updateMinimumAbsoluteSumDifferenceProblem.ts
│  ├─ Input: Full problem data (MEDIUM, 8 XP)
│  ├─ Action: prisma.question.create({data})
│  └─ Output: Problem created ✅
│
├─ updateMinArrowsForBalloonsProblems.ts
│  ├─ Input: Full problem data (MEDIUM, 8 XP)
│  ├─ Action: prisma.question.create({data})
│  └─ Output: Problem created ✅
│
├─ updateMinCoinsSpecificDenominationsProblem.ts
│  ├─ Input: Full problem data (EASY, 4 XP)
│  ├─ Action: prisma.question.create({data})
│  └─ Output: Problem created ✅
│
├─ updateMaxEqualSumThreeStacksProblem.ts
│  ├─ Input: Full problem data (MEDIUM, 8 XP)
│  ├─ Action: prisma.question.create({data})
│  └─ Output: Problem created ✅
│
└─ updateMinCostCoinsKExtraProblem.ts
   ├─ Input: Full problem data (MEDIUM, 8 XP)
   ├─ Action: prisma.question.create({data})
   └─ Output: Problem created ✅
```

### PHASE 4: Verification

```
VERIFICATION PHASE
│
├─ verifyUpdates.ts
│  └─ Query: Find 4 updated problems by ID
│     └─ Output: Confirm all content updated ✅
│
├─ verifyAllProblems.ts
│  ├─ Count: SELECT COUNT(*) FROM Question
│  │  └─ Expected: 541 (535 + 6 new)
│  │
│  ├─ For each problem:
│  │  ├─ Check statement length
│  │  ├─ Check template count
│  │  ├─ Check test case count
│  │  └─ ✅ All verified
│  │
│  └─ Output: Summary statistics
│
└─ showUpdatedContent.ts
   ├─ Select: Sample problem (Jump Game II)
   ├─ Display:
   │  ├─ Problem title
   │  ├─ Statement (first 500 chars)
   │  ├─ Constraints
   │  ├─ Code templates
   │  └─ Test cases count
   └─ Output: Sample content display ✅
```

---

## Script Dependency Graph

```
┌─────────────────────────────────────────────┐
│         Environment & Database              │
│  .env file + MySQL Database (adyapan)       │
└──────────────────┬──────────────────────────┘
                   │
       ┌───────────┼───────────┐
       │           │           │
       ▼           ▼           ▼
   Cleanup      Updates      Creates
       │           │           │
       │     ┌─────┴─────┐     │
       │     │           │     │
       ▼     ▼           ▼     ▼
    Check  Update4   Create6  Database
    Count  Problems  Problems  Updated
       │     │           │     │
       └─────┴───────────┴─────┘
               │
         ┌─────▼─────┐
         │Verification
         │Scripts
         └────────────┘
```

---

## Data Flow Diagram

```
INPUT
  │
  ├─── Problem Data (JSON/Objects)
  │    ├─ Title
  │    ├─ Statement (800+ chars)
  │    ├─ Topics
  │    ├─ Companies
  │    ├─ Templates (2 languages)
  │    ├─ TestCases (10-20 each)
  │    └─ Constraints
  │
  ▼
PRISMA ORM
  │
  ├─ For Updates: prisma.question.update({where, data})
  ├─ For Creates: prisma.question.create({data})
  └─ For Queries: prisma.question.find...()
  │
  ▼
MYSQL DATABASE
  │
  └─ Table: Question
     ├─ id (UUID)
     ├─ title (String)
     ├─ slug (String, unique)
     ├─ statement (Text, 800+)
     ├─ difficulty (EASY|MEDIUM|HARD)
     ├─ topics (JSON array)
     ├─ companies (JSON array)
     ├─ xpReward (Int)
     ├─ templates (JSON array)
     ├─ testCases (JSON array)
     ├─ constraints (Text)
     └─ createdAt/updatedAt
  │
  ▼
VERIFICATION & OUTPUT
  │
  ├─ Console logs
  ├─ Error messages (if any)
  └─ Success confirmations
```

---

## Timeline & Duration

```
Typical Execution Times
(Per Phase)

PHASE 1: Cleanup (Optional)
├─ checkDbCount.ts: 2-3 seconds
├─ identifyExtraProblems.ts: 2-3 seconds
└─ finalCleanup.ts: 3-5 seconds
   └─ Total: ~10 seconds

PHASE 2: Updates (4 problems)
├─ updateJumpGameProblem.ts: 3-5 seconds
├─ updateJumpGameIIProblem.ts: 3-5 seconds
├─ updateGasStationProblem.ts: 3-5 seconds
└─ updateMinimizeCashFlowProblem.ts: 3-5 seconds
   └─ Total: ~15 seconds

PHASE 3: Creates (6 problems)
├─ updateMaxHeightStackingCuboidsProblem.ts: 3-5 seconds
├─ updateMinimumAbsoluteSumDifferenceProblem.ts: 3-5 seconds
├─ updateMinArrowsForBalloonsProblems.ts: 3-5 seconds
├─ updateMinCoinsSpecificDenominationsProblem.ts: 3-5 seconds
├─ updateMaxEqualSumThreeStacksProblem.ts: 3-5 seconds
└─ updateMinCostCoinsKExtraProblem.ts: 3-5 seconds
   └─ Total: ~25 seconds

PHASE 4: Verification
├─ verifyUpdates.ts: 2-3 seconds
├─ verifyAllProblems.ts: 3-5 seconds
└─ showUpdatedContent.ts: 2-3 seconds
   └─ Total: ~10 seconds

═══════════════════════════════════
GRAND TOTAL: ~60 seconds (1 minute)
═══════════════════════════════════
```

---

## Success Indicators

```
✅ PHASE 1 Complete:
   └─ Database count verified
   └─ Extra problems identified
   └─ Cleanup completed without errors

✅ PHASE 2 Complete:
   └─ 4 problems updated successfully
   └─ "✅ Problem updated successfully!" messages
   └─ No update errors

✅ PHASE 3 Complete:
   └─ 6 problems created successfully
   └─ "✅ Problem created successfully!" messages
   └─ No creation errors

✅ PHASE 4 Complete:
   └─ Verification shows 541 total problems
   └─ All 10 problems have content
   └─ All templates present
   └─ All test cases loaded

═══════════════════════════════════
FINAL STATUS: ✅ ALL GREEN
Database: 541 problems ✅
Content: Complete ✅
Tests: 151 cases ✅
Templates: 20+ ✅
═══════════════════════════════════
```

---

## Troubleshooting Decision Tree

```
ERROR OCCURS
    │
    ├─ "Cannot find module"?
    │  └─ npm install
    │
    ├─ "Connection refused"?
    │  ├─ Start MySQL service
    │  └─ Check .env DATABASE_URL
    │
    ├─ "ENOENT: no such file"?
    │  └─ Check working directory
    │     └─ cd c:\Users\HP\Downloads\AdyapanAI\apps\backend
    │
    ├─ "TimeoutError"?
    │  └─ Increase timeout or restart MySQL
    │
    ├─ "TypeScript compilation error"?
    │  └─ npm install again
    │
    └─ Other errors?
       └─ Check MANUAL_SETUP_GUIDE.md
          └─ Troubleshooting section
```

---

## Next Steps After Success

```
                    PROJECT COMPLETE ✅
                           │
                ┌──────────┴──────────┐
                │                     │
                ▼                     ▼
           Browse Data          Start Backend
                │                     │
                ▼                     ▼
    npx prisma studio         npm run dev
                │                     │
                ▼                     ▼
        View all problems    API running at
        in web interface     http://localhost:5000
```

---

**You now have a complete understanding of the execution flow!** 🎉
