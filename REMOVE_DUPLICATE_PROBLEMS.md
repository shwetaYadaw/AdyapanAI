# 🧹 Remove Duplicate Problems Guide

## Problem
You have **962 problems** showing but should have only **545 unique problems**.
This means there are **417 duplicate entries** (962 - 545 = 417).

## Solution - 2 Steps

### Step 1: View Duplicates (Safe - No Changes)

First, let's see what duplicates exist WITHOUT deleting anything:

```bash
cd apps/backend
npx ts-node src/scripts/viewDuplicateProblems.ts
```

**This will show:**
- Total problems in database
- List of duplicate slugs
- How many copies of each
- Which one will be kept (oldest)
- Which ones will be deleted

**Example output:**
```
🔍 Scanning for duplicate problems...

📊 Total problems in database: 962

⚠️  Found 417 duplicate slugs:

──────────────────────────────────────────────────────────────────────
📝 Slug: "two-sum"
   Duplicates: 2 copies (1 extra)
   ✅ KEEP #1:
      Title: Two Sum
      ID: abc123...
      Created: 2024-01-15T10:30:00Z
      Submissions: 150, TestCases: 10
   ❌ DELETE #2:
      Title: Two Sum
      ID: def456...
      Created: 2024-02-20T14:00:00Z
      Submissions: 0, TestCases: 10

... more duplicates ...

══════════════════════════════════════════════════════════════════════
📊 SUMMARY
══════════════════════════════════════════════════════════════════════
   Current total: 962 problems
   Unique problems: 545
   Duplicate entries: 417
   After cleanup: 545 problems
══════════════════════════════════════════════════════════════════════
```

### Step 2: Remove Duplicates

Once you've reviewed and confirmed, run this to DELETE the duplicates:

```bash
cd apps/backend
npx ts-node src/scripts/findDuplicateProblems.ts
```

**This will:**
- Find all duplicate slugs
- Keep the OLDEST problem (first created)
- Delete all newer duplicates
- Show progress and summary

**Example output:**
```
🔍 Scanning for duplicate problems...

📊 Found 417 duplicate slugs

📝 Slug: "two-sum" - Found 2 duplicates
   Found 2 problems with slug "two-sum":
   1. Two Sum (ID: abc123..., Created: 2024-01-15, Submissions: 150)
   2. Two Sum (ID: def456..., Created: 2024-02-20, Submissions: 0)
   ✅ Keeping: Two Sum (ID: abc123...)
   ❌ Deleting 1 duplicate(s):
      - Two Sum (ID: def456...)

... continues for all duplicates ...

════════════════════════════════════════════════════════════════════
✨ Cleanup Complete!
   🗑️  Removed: 417 duplicate problems
   ✅ Kept: 545 unique problems
════════════════════════════════════════════════════════════════════

📊 Total problems in database: 545
```

## How Duplicates Happened

Duplicates can occur when:
1. **Multiple imports** - Running seed scripts multiple times
2. **Admin panel** - Creating same problem twice
3. **API issues** - Retry logic creating duplicates
4. **Migration errors** - Data migration running multiple times

## How We Keep/Delete

The script:
- **KEEPS**: Oldest problem (first `createdAt` date)
- **DELETES**: All newer copies

**Why oldest?**
- More likely to have submissions
- Original creation usually correct
- Preserves user history

## After Cleanup

1. **Refresh your browser**
2. **Check Coding Arena page**
3. **Should show**: 1/545 instead of 1/962

## Verify in Database

```bash
cd apps/backend
npx prisma studio
```

Go to `Problem` table and check count.

## Safety Features

✅ **No data loss** - Submissions/test cases cascade deleted only from duplicates  
✅ **Keeps oldest** - Problem with most history is preserved  
✅ **Preview first** - View script shows what will be deleted  
✅ **Detailed logs** - See exactly what's happening  

## Troubleshooting

### Script won't run
```bash
# Make sure you're in backend directory
cd apps/backend
pwd  # Should show: .../apps/backend

# Try again
npx ts-node src/scripts/viewDuplicateProblems.ts
```

### Database connection error
Check `.env` file has `DATABASE_URL` set correctly.

### No duplicates found
```
✅ No duplicates found! All problems are unique.
```
This means your 962 count is correct and all problems are unique.

## Questions?

- **Will I lose submissions?** No, submissions on the kept problem are preserved
- **Can I undo?** No, but the script keeps the problem with submissions
- **How long does it take?** Usually 30 seconds - 2 minutes
- **Will site go down?** No, it runs while site is live

## Ready?

Run these commands:

```bash
# 1. View what will be deleted (safe)
cd apps/backend
npx ts-node src/scripts/viewDuplicateProblems.ts

# 2. If it looks good, remove duplicates
npx ts-node src/scripts/findDuplicateProblems.ts

# 3. Verify
npx prisma studio
# Check Problem table count
```

Expected result: **545 unique problems** ✨
