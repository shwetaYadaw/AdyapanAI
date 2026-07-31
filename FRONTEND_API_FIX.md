# Frontend API Endpoint Fix ✅

**Issue:** "Problem not found" when clicking on coding problems
**Root Cause:** Frontend was calling wrong API endpoint (`/challenges/questions`) instead of `/problems`

---

## Problem

When clicking on any coding problem from Coding Arena, the page showed:
```
Problem not found.
```

**URL Example:** 
`http://localhost:3000/student/challenges/sliding-window-sliding-window-maximum`

---

## Root Cause Analysis

### Database Structure
- **Question table:** TCS NQT questions (95 items)
- **Problem table:** DSA Coding Arena problems (436 items)

### Frontend Issue
The `CodingPortalPage.tsx` component was using the WRONG endpoint:

**Before (WRONG):**
```typescript
// Fetching from Question table (TCS NQT)
api.get(`/challenges/questions/${slug}`)
api.post(`/challenges/questions/${id}/run`)
api.post(`/challenges/questions/${id}/submit`)
```

**After (CORRECT):**
```typescript
// Fetching from Problem table (DSA Coding Arena)
api.get(`/problems/${slug}`)
api.post(`/problems/${id}/run`)
api.post(`/problems/${id}/submit`)
```

---

## Fix Applied

**File:** `apps/web/src/pages/student/CodingPortalPage.tsx`

### 1. Problem Fetch Endpoint
**Line ~260:**
```typescript
// OLD
const { data } = await api.get(`/challenges/questions/${slug}`);

// NEW
const { data } = await api.get(`/problems/${slug}`);
```

### 2. Run Code Endpoint
**Line ~330:**
```typescript
// OLD
api.post(`/challenges/questions/${question?.id}/run`, payload)

// NEW
api.post(`/problems/${question?.id}/run`, payload)
```

### 3. Submit Code Endpoint
**Line ~350:**
```typescript
// OLD
api.post(`/challenges/questions/${question?.id}/submit`, payload)

// NEW
api.post(`/problems/${question?.id}/submit`, payload)
```

---

## Why This Happened

When we cleaned up the database:
1. Moved DSA problems to Problem table
2. Kept only TCS NQT in Question table
3. **But forgot to update the frontend endpoints!**

The frontend was still trying to fetch DSA problems from the Question table (`/challenges/questions`), which now only contains TCS NQT questions.

---

## Testing

After this fix, the following should work:

### ✅ Viewing Problems
1. Go to Coding Arena: http://localhost:3000/student/challenges
2. Click any problem
3. Problem details should load correctly

### ✅ Running Code
1. Open any problem
2. Write/modify code
3. Click "Run Code"
4. Should execute against sample test cases

### ✅ Submitting Code
1. Open any problem
2. Write solution
3. Click "Submit"
4. Should run against all test cases and award XP

---

## Related Backend Routes

The backend already has correct routes for both:

**TCS NQT Routes** (`/challenges/questions`):
- GET `/challenges/questions` - List TCS NQT questions
- GET `/challenges/questions/:id` - Get TCS NQT question detail

**Coding Arena Routes** (`/problems`):
- GET `/problems` - List DSA problems
- GET `/problems/:slug` - Get DSA problem detail
- POST `/problems/:id/run` - Run code against sample tests
- POST `/problems/:id/submit` - Submit code for all tests

---

## What's Fixed

| Component | Before | After | Status |
|-----------|--------|-------|--------|
| **CodingChallengesPage** (list) | `/problems` | `/problems` | ✅ Already correct |
| **CodingPortalPage** (detail) | `/challenges/questions` | `/problems` | ✅ **FIXED** |
| **Run Code** | `/challenges/questions/:id/run` | `/problems/:id/run` | ✅ **FIXED** |
| **Submit Code** | `/challenges/questions/:id/submit` | `/problems/:id/submit` | ✅ **FIXED** |
| **Stats** | `/challenges/stats` | `/challenges/stats` | ✅ Backend fixed |

---

## Next Steps

1. **No backend restart needed** - This is a frontend-only change
2. **Refresh browser** - Hard reload (Ctrl+F5) to clear cache
3. **Test:**
   - Browse Coding Arena
   - Click any problem
   - Try running code
   - Try submitting code

---

## Summary

✅ **Fixed:** CodingPortalPage now uses correct `/problems` endpoint  
✅ **Fixed:** Run and Submit code endpoints updated  
✅ **Status:** All Coding Arena problems should now load correctly  
✅ **Action Required:** Just refresh the browser!

---

**File Modified:** `apps/web/src/pages/student/CodingPortalPage.tsx`  
**Lines Changed:** 3 endpoints updated (fetch, run, submit)  
**Status:** Ready to test
