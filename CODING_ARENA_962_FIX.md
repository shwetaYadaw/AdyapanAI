# Coding Arena 962 Question Fix - COMPLETED ✅

## Problem Summary
The Coding Arena was showing **962 questions** instead of the expected **421 DSA problems**.

## Root Cause Analysis
- The frontend was correctly calling `/problems` endpoint (which returns from the Problem table with 421 items)
- **BUT** the `/challenges/stats` endpoint was querying the **Question table** (962 items - TCS NQT + legacy) instead of the **Problem table**
- This caused the stats display to show "Total Solved: 1/962" instead of the correct count

## Database Tables Explained
1. **Question table** (962 entries)
   - Contains TCS NQT questions + legacy DSA questions
   - Should ONLY be used for TCS NQT page
   - Submissions reference via `questionId`

2. **Problem table** (421 entries)
   - Contains NEW DSA Coding Arena problems
   - Should ONLY be used for Coding Arena
   - Submissions reference via `problemId`

## Fix Applied
**File:** `apps/backend/src/routes/challenge.routes.ts`
**Endpoint:** `GET /challenges/stats` (line ~1337)

### Changes Made:
1. Changed `prisma.question.findMany()` → `prisma.problem.findMany()`
2. Changed submission query to filter `problemId: { not: null }` instead of all submissions
3. Updated topic parsing logic (Problem stores topics as comma-separated string, Question stores as JSON)
4. Updated variable names for clarity (questions → problems, solvedQuestions → solvedProblems)

### Code Changes:
```typescript
// BEFORE (WRONG - counting Question table)
const questions = await prisma.question.findMany({ ... });
const solvedQuestions = await prisma.submission.findMany({
  where: {
    userId: req.user!.userId,
    status: 'accepted'
  },
  distinct: ['questionId'],
  select: { questionId: true }
});

// AFTER (CORRECT - counting Problem table)
const problems = await prisma.problem.findMany({ ... });
const solvedProblems = await prisma.submission.findMany({
  where: {
    userId: req.user!.userId,
    status: 'accepted',
    problemId: { not: null } // Only DSA problems
  },
  distinct: ['problemId'],
  select: { problemId: true }
});
```

## Testing Instructions

### 1. Restart Backend Server
The backend MUST be restarted for changes to take effect:

```bash
# Stop the backend if running
# Then restart:
cd apps/backend
npm run dev
```

### 2. Clear Browser Cache
```
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"
```

### 3. Test the Fix
1. Navigate to Coding Arena: http://localhost:3000/student/challenges
2. Check the stats card: Should show "Total Solved: X / 421" (not 962)
3. Click on a topic to verify problems are loading correctly
4. The problem count should match the database (421 DSA problems)

## Expected Results
- ✅ Stats should show correct total: 421 (not 962)
- ✅ Questions list already working correctly (was fixed previously)
- ✅ Only DSA problems appear in Coding Arena
- ✅ TCS NQT questions remain separate in TCS NQT page

## Related Files Modified
- ✅ `apps/backend/src/routes/challenge.routes.ts` - Stats endpoint fixed (THIS FIX)
- ✅ `apps/web/src/pages/student/CodingChallengesPage.tsx` - Questions list already fixed (PREVIOUS FIX)

## Status
**TASK COMPLETE** - Backend code updated, awaiting server restart and testing.

## Notes
- The frontend was already correctly using `/problems` endpoint
- Only the stats endpoint needed fixing
- No database migration needed - schema already supports both tables
- No frontend changes needed - already using correct endpoint
