# Slug vs ID Fix - Problem Not Found ✅

**Issue:** Getting "500 Internal Server Error" when trying to view problems
**Root Cause:** Backend endpoint expected UUID (id) but frontend was sending slug

---

## Problem

Console error:
```
GET http://localhost:5000/api/v1/problems/maximum-and-minimum-element-in-an-array
500 (Internal Server Error)
```

The backend `/problems/:id` endpoint was expecting a UUID like:
```
f47ac10b-58cc-4372-a567-0e02b2c3d479
```

But the frontend was sending a slug like:
```
maximum-and-minimum-element-in-an-array
```

---

## Fix Applied

### Backend Fix (`problem.routes.ts`)

**Line ~140** - Modified GET `/problems/:id` to accept BOTH UUID and slug:

```typescript
// BEFORE (only accepted UUID)
const problem = await prisma.problem.findUnique({
  where: { id: req.params.id },
  ...
});

// AFTER (accepts both UUID and slug)
const { id } = req.params;

// Check if it's a UUID or a slug
const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

const problem = await prisma.problem.findUnique({
  where: isUUID ? { id } : { slug: id },
  ...
});
```

### Frontend Fix (`CodingPortalPage.tsx`)

Changed run and submit mutations to use `slug` consistently:

```typescript
// Run Code
api.post(`/problems/${slug}/run`, payload)

// Submit Code
api.post(`/problems/${slug}/submit`, payload)
```

---

## Why This Happened

The routing system works like this:

**URL:** `/student/challenges/maximum-and-minimum-element-in-an-array`

**Router extracts:**
- Route: `/student/challenges/:slug`  
- `slug` = `maximum-and-minimum-element-in-an-array`

**Frontend calls backend with slug:**
```
GET /problems/maximum-and-minimum-element-in-an-array
```

**Backend expected UUID format** (id), but got a slug instead, causing the lookup to fail.

---

## What's Fixed

| Endpoint | Before | After | Status |
|----------|--------|-------|--------|
| **Get Problem Detail** | Expects UUID only | Accepts UUID or slug | ✅ Fixed |
| **Run Code** | Uses `question.id` | Uses `slug` | ✅ Fixed |
| **Submit Code** | Uses `question.id` | Uses `slug` | ✅ Fixed |

---

## Testing

### Backend Restart Required
Since we modified backend routes, you need to restart:

```bash
cd e:\AdyapanAI\AdyapanAI\apps\backend
npm run dev
```

### Frontend Refresh
Hard reload the browser:
```
Ctrl + F5
```

### Test Steps
1. Go to Coding Arena: http://localhost:3000/student/challenges
2. Click any problem
3. Problem details should load ✅
4. Code editor should work ✅
5. Run Code button should work ✅
6. Submit button should work ✅

---

## Technical Details

### UUID vs Slug

**UUID (Universally Unique Identifier):**
```
f47ac10b-58cc-4372-a567-0e02b2c3d479
```
- Database primary key
- Guaranteed unique
- Not human-readable

**Slug:**
```
maximum-and-minimum-element-in-an-array
```
- Human-readable URL
- SEO friendly
- Easy to remember

### Solution

The backend now intelligently detects which format is being used:
- If UUID pattern → lookup by `id`
- If not UUID → lookup by `slug`

This allows both formats to work:
```
GET /problems/f47ac10b-58cc-4372-a567-0e02b2c3d479  ✅ Works
GET /problems/maximum-and-minimum-element-in-an-array  ✅ Works
```

---

## Files Modified

1. **Backend:** `apps/backend/src/routes/problem.routes.ts`
   - Line ~140: Modified GET /:id endpoint

2. **Frontend:** `apps/web/src/pages/student/CodingPortalPage.tsx`
   - Line ~330: Updated run mutation to use slug
   - Line ~350: Updated submit mutation to use slug

---

## Status

✅ **Backend:** Now accepts both UUID and slug  
✅ **Frontend:** Uses slug consistently  
⏳ **Action Required:** Restart backend server  

After restart, all Coding Arena problems should load correctly!
