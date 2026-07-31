# How to Access Supabase Backups

## Your Supabase Project Details

**Project Reference ID:** `qvblybllqbchpwibqxri`
**Region:** AWS Asia Pacific (Seoul) - `ap-northeast-2`

---

## Step-by-Step Guide to Access Backups

### Step 1: Go to Supabase Dashboard

🔗 **Direct Link:** https://supabase.com/dashboard/project/qvblybllqbchpwibqxri

Or manually:
1. Open browser and go to: https://supabase.com
2. Click **Sign In** (top right)
3. Log in with your Supabase account credentials

---

### Step 2: Navigate to Database Backups

Once you're in the dashboard:

**Option A: Direct Link (Fastest)**
```
https://supabase.com/dashboard/project/qvblybllqbchpwibqxri/database/backups
```

**Option B: Manual Navigation**
1. You'll see your project: **AdyapanAI** (or similar name)
2. Click on your project to open it
3. In the left sidebar, click **Database** (database icon)
4. Click **Backups** tab

---

## What You'll See in Backups Page

### Free Plan (Default)
- **Daily Backups:** Last 7 days
- **Backup Time:** Usually around midnight UTC
- **Retention:** 7 days

### Pro Plan
- **Daily Backups:** Last 30 days
- **Point-in-Time Recovery (PITR):** Last 7 days (every 2 minutes)

---

## How to Check If You Have a Backup from Before Today

### Look for Backup Dates

You need a backup from **BEFORE today (before the 467 questions were deleted)**.

**Example:**
- Today's Date: January 31, 2026
- You need: Backup from January 30, 2026 or earlier

### What the Backup List Looks Like

```
┌─────────────────────────────────────────────┐
│  Database Backups                           │
├─────────────────────────────────────────────┤
│                                             │
│  📅 January 31, 2026, 00:00 UTC            │
│     Size: 245 MB                            │
│     [Restore] [Download]                    │
│                                             │
│  📅 January 30, 2026, 00:00 UTC  ← USE THIS│
│     Size: 243 MB                            │
│     [Restore] [Download]                    │
│                                             │
│  📅 January 29, 2026, 00:00 UTC            │
│     Size: 242 MB                            │
│     [Restore] [Download]                    │
│                                             │
└─────────────────────────────────────────────┘
```

---

## How to Restore a Backup

### ⚠️ WARNING: Restoring Overwrites Current Database

**BEFORE YOU RESTORE:**
- Current database will be completely replaced
- All changes made today will be lost
- The platform will go down for 5-10 minutes during restore

### Restore Steps

1. **Find the backup from before today** (e.g., January 30, 2026)
2. Click the **Restore** button next to that backup
3. You'll see a confirmation dialog:
   ```
   ⚠️ Restore Database Backup
   
   This will restore your database to the state from:
   January 30, 2026, 00:00 UTC
   
   Current database will be overwritten. This cannot be undone.
   
   [Cancel]  [Restore Database]
   ```
4. Click **Restore Database**
5. Wait 5-10 minutes for restoration to complete
6. You'll see a success message when done

---

## After Restoring the Backup

Once the database is restored, you'll have:
- ✅ **962 questions back** in Question table (including duplicates)
- ✅ **421 problems** in Problem table (before 15 were added)
- ✅ All data from before today's changes

**Then we can revert the code to match the old database.**

---

## What If You Don't Have a Backup?

### Free Plan Limitations
If you're on the **Free Plan**, you only have backups from the last **7 days**.

**Scenarios:**
1. **Changes were made < 7 days ago** → You have backups ✅
2. **Changes were made > 7 days ago** → No backup available ❌

### If No Backup Exists

**Option 1: Cannot recover deleted questions**
- The 467 deleted questions are gone forever
- You can only revert code (but platform will break)

**Option 2: Recreate the questions manually**
- Would need to re-enter all 467 questions by hand
- Not practical

**Option 3: Move forward with current state**
- Keep the cleaned database (95 TCS NQT + 436 DSA)
- Keep the updated code
- Fix any specific issues you're facing

---

## Quick Check: Do You Have Backups?

**Run this quick check:**

1. Go to: https://supabase.com/dashboard/project/qvblybllqbchpwibqxri/database/backups
2. Look at the backup dates
3. Answer these questions:

   **Q1: Do you see any backups listed?**
   - YES → Continue to Q2
   - NO → You don't have backups (might be new project)

   **Q2: What's the oldest backup date you see?**
   - Example: "January 24, 2026"

   **Q3: Is there a backup from BEFORE today?**
   - YES → You can restore ✅
   - NO → Cannot restore database ❌

---

## Alternative: Check Your Supabase Plan

### How to Check Your Plan

1. Go to: https://supabase.com/dashboard/project/qvblybllqbchpwibqxri/settings/general
2. Scroll to **Subscription** section
3. You'll see:
   - **Free Plan:** 7 days of daily backups
   - **Pro Plan ($25/month):** 30 days + Point-in-Time Recovery
   - **Team/Enterprise:** Custom retention

---

## What to Tell Me

After checking the backups page, please tell me:

1. **Can you access the backups page?** (YES/NO)
2. **How many backups do you see?** (e.g., "7 backups")
3. **What's the oldest backup date?** (e.g., "January 24, 2026")
4. **Is there a backup from BEFORE today's changes?** (YES/NO)
5. **What plan are you on?** (Free/Pro/Team/Enterprise)

---

## Quick Links

| Link | Purpose |
|------|---------|
| [Dashboard](https://supabase.com/dashboard/project/qvblybllqbchpwibqxri) | Main project dashboard |
| [Backups](https://supabase.com/dashboard/project/qvblybllqbchpwibqxri/database/backups) | View and restore backups |
| [Settings](https://supabase.com/dashboard/project/qvblybllqbchpwibqxri/settings/general) | Check your plan |
| [Database](https://supabase.com/dashboard/project/qvblybllqbchpwibqxri/database/tables) | View database tables |

---

## Need Help?

If you can't access the backups page:
1. Make sure you're logged into the correct Supabase account
2. Check if you have access permissions to this project
3. Try the direct backup link: https://supabase.com/dashboard/project/qvblybllqbchpwibqxri/database/backups

**Once you check the backups page, let me know what you find, and I'll help you with the next steps.**
