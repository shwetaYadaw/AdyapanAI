# AdyapanAI - Error Fix Documentation

## Current Status

Your application is showing an error:

```
Something went wrong
Failed to fetch dynamically imported module: 
http://localhost:3000/src/pages/auth/LoginPage.tsx
```

**This error is FIXABLE in 2-3 minutes!** ✅

---

## The Problem

The backend API server (port 5000) is **not running**. 

When you open http://localhost:3000 in your browser:
- ✅ Frontend loads successfully
- ❌ Frontend tries to connect to backend at http://localhost:5000
- ❌ Backend isn't running → connection fails
- ❌ Frontend crashes with module loading error

**Solution:** Start the backend server before opening the frontend in the browser.

---

## Quick Start (Choose One)

### Option 1: Automated (Recommended) ⚡

**Run this one command:**

```powershell
cd "c:\Users\HP\Downloads\AdyapanAI"
.\start-adyapan.ps1
```

The script will:
1. ✅ Verify Node.js and Yarn
2. ✅ Install dependencies if needed
3. ✅ Start backend (port 5000)
4. ✅ Start frontend (port 3000)
5. ✅ Open browser to http://localhost:3000
6. ✅ Verify everything is working

**Time: 2-3 minutes**

---

### Option 2: Step-by-Step Manual

**Terminal 1:**
```powershell
cd "c:\Users\HP\Downloads\AdyapanAI"
yarn dev:backend
```

Wait for:
```
Server running on port 5000
✅ MySQL (Prisma) connected successfully
```

**Terminal 2 (NEW):**
```powershell
cd "c:\Users\HP\Downloads\AdyapanAI"
yarn dev:web
```

Wait for:
```
Local: http://localhost:3000/
```

**Browser:**
```
http://localhost:3000
```

Should see login page with **no errors** ✅

---

## Detailed Guides

Read one of these guides depending on your preference:

| Guide | Time | Best For |
|-------|------|----------|
| **FIX_NOW.md** | 5 min | Ultra-quick fix, copy-paste commands |
| **QUICK_REFERENCE.txt** | 2 min | Cheat sheet, commands, quick lookup |
| **startup-guide.md** | 15 min | Detailed step-by-step with explanations |
| **VISUAL_STARTUP_GUIDE.txt** | 10 min | ASCII diagrams, visual learners |
| **QUICK_FIX_NOT_WORKING.md** | 30 min | Comprehensive troubleshooting |
| **ERROR_FIX_SUMMARY.md** | 20 min | Complete reference guide |

---

## Files Created for You

### Startup Tools
- **`start-adyapan.ps1`** - Automated startup script (recommended)
- **`diagnose-error.ps1`** - Diagnostic tool to check what's wrong

### Documentation
- **`FIX_NOW.md`** - 5-minute ultra-quick fix
- **`startup-guide.md`** - Detailed startup guide
- **`QUICK_REFERENCE.txt`** - Quick reference card
- **`VISUAL_STARTUP_GUIDE.txt`** - Visual ASCII diagrams
- **`ERROR_FIX_SUMMARY.md`** - Complete overview
- **`QUICK_FIX_NOT_WORKING.md`** - Troubleshooting (already existed)

---

## Why This Happens

AdyapanAI is a **monorepo** with two separate services:

```
┌─────────────────────────────────────────┐
│  Backend                                │
│  Express.js on port 5000                │
│  Handles API requests & database        │
└─────────────────┬───────────────────────┘
                  │
                  │ API calls (/api/...)
                  │
┌─────────────────▼───────────────────────┐
│  Frontend                               │
│  React + Vite on port 3000              │
│  Browser UI, makes API calls            │
└─────────────────────────────────────────┘
```

**Frontend needs Backend to work!**

If backend is not running → frontend can't get data → crashes!

---

## Technology Stack

- **Backend**: Express.js + TypeScript + Node.js
- **Frontend**: React 18 + Vite + TailwindCSS
- **Database**: PostgreSQL (via Prisma ORM)
- **Build Tool**: Yarn workspaces
- **Development**: Hot reload enabled

---

## Port Reference

| Service | Port | URL |
|---------|------|-----|
| Backend API | 5000 | http://localhost:5000 |
| Frontend | 3000 | http://localhost:3000 |
| Database | 51213 | Configured in .env |

---

## Troubleshooting

### Port Already in Use?

```powershell
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill it (replace PID with the number shown above)
taskkill /PID <PID> /F

# Then restart: yarn dev:backend
```

### Dependencies Missing?

```powershell
cd "c:\Users\HP\Downloads\AdyapanAI"
yarn install
```

### Still Getting Error?

1. **Run diagnostic:**
   ```powershell
   .\diagnose-error.ps1
   ```

2. **Check backend is running:**
   ```powershell
   curl http://localhost:5000/api/health
   ```

3. **Check frontend is running:**
   ```powershell
   curl http://localhost:3000
   ```

4. **Restart everything:**
   ```powershell
   Get-Process node | Stop-Process -Force
   .\start-adyapan.ps1
   ```

---

## Key Rules

✅ **Backend starts FIRST** on port 5000
✅ **Frontend starts SECOND** on port 3000
✅ **Keep both terminals open** while developing
✅ **Open browser AFTER** both are ready
✅ **Check for errors** in both terminal windows

❌ Never close Terminal 1 or 2 while working
❌ Never open browser before backend is ready
❌ Never use only `yarn dev:web` without backend

---

## Next Steps After Starting

Once everything is running:

### 1. Verify It Works
```powershell
# Backend health check
curl http://localhost:5000/api/health

# Check database
cd apps/backend
npx ts-node --transpile-only src/scripts/checkDbCount.ts
```

### 2. Use the Application
- Open http://localhost:3000
- Log in with your credentials
- Browse DSA problems
- Create/update content

### 3. Development
- Edit code and it will hot-reload
- Check browser console (F12) for errors
- Check terminal for backend/frontend logs

### 4. Stopping Services
Press **Ctrl+C** in each terminal to gracefully shut down.

---

## Environment Configuration

Check your `.env` file:

```powershell
cat .env
```

Should contain:
```env
DATABASE_URL="prisma+postgres://localhost:51213/..."
```

If missing or incorrect, contact admin for database credentials.

---

## Visual Workflow

```
1. Terminal 1: Start Backend
   ├─ Run: yarn dev:backend
   ├─ Wait for: "Server running on port 5000"
   └─ Status: ✅ Ready

2. Terminal 2: Start Frontend
   ├─ Run: yarn dev:web
   ├─ Wait for: "Local: http://localhost:3000/"
   └─ Status: ✅ Ready

3. Browser: Open App
   ├─ URL: http://localhost:3000
   ├─ See: Login page
   └─ Status: ✅ Working!
```

---

## Success Indicators ✅

Before you're done:

- [ ] Backend terminal shows "Server running on port 5000"
- [ ] Frontend terminal shows "Local: http://localhost:3000/"
- [ ] Browser shows login page at http://localhost:3000
- [ ] No error messages in either terminal
- [ ] Browser console (F12) has no red errors
- [ ] Both terminals are still running

---

## Quick Commands

```powershell
# Install dependencies
yarn install

# Start backend
yarn dev:backend

# Start frontend (in new terminal)
yarn dev:web

# Run diagnostic
.\diagnose-error.ps1

# Run automated startup
.\start-adyapan.ps1

# Kill all node processes
Get-Process node | Stop-Process -Force

# Test backend
curl http://localhost:5000/api/health

# Test frontend
curl http://localhost:3000

# View environment config
cat .env

# Check database count
cd apps/backend
npx ts-node --transpile-only src/scripts/checkDbCount.ts
```

---

## When You're Stuck

1. **First**, try the quick fix: `.\start-adyapan.ps1`

2. **If that doesn't work**, read: `FIX_NOW.md` (5 minutes)

3. **Still stuck?** Read: `QUICK_FIX_NOT_WORKING.md` (30 minutes)

4. **Need diagrams?** Read: `VISUAL_STARTUP_GUIDE.txt`

5. **Still problems?** Run: `.\diagnose-error.ps1`

---

## File Organization

```
c:\Users\HP\Downloads\AdyapanAI\
├─ README_ERROR_FIX.md               (← You are here)
├─ FIX_NOW.md                        (Quick 5-min fix)
├─ QUICK_REFERENCE.txt               (Cheat sheet)
├─ startup-guide.md                  (Detailed guide)
├─ VISUAL_STARTUP_GUIDE.txt          (ASCII diagrams)
├─ ERROR_FIX_SUMMARY.md              (Complete overview)
├─ QUICK_FIX_NOT_WORKING.md          (Troubleshooting)
├─ start-adyapan.ps1                 (Automated startup)
├─ diagnose-error.ps1                (Diagnostic tool)
├─ .env                              (Configuration)
├─ apps/
│  ├─ backend/                       (Express API)
│  ├─ web/                           (React frontend)
│  └─ ai-service/                    (AI service)
└─ packages/
   └─ shared/                        (Shared code)
```

---

## Common Error Messages

### "Failed to fetch dynamically imported module"
- **Cause**: Backend not running
- **Fix**: `yarn dev:backend` first, then `yarn dev:web`

### "Cannot connect to database"
- **Cause**: DATABASE_URL missing or invalid
- **Fix**: Check `.env` file

### "Port already in use"
- **Cause**: Process already using port 5000 or 3000
- **Fix**: `taskkill /PID <PID> /F`

### "Cannot find module"
- **Cause**: Dependencies not installed
- **Fix**: `yarn install`

### "Cannot GET /api/..."
- **Cause**: Backend not running
- **Fix**: Start backend first

---

## System Requirements

- Node.js v20+ (check: `node --version`)
- Yarn v1.22+ (check: `yarn --version`)
- 1GB free disk space
- Access to PostgreSQL database (configured in .env)

---

## Support Resources

### Documentation
- `README_ERROR_FIX.md` - This file
- `FIX_NOW.md` - Quick fix
- `startup-guide.md` - Detailed guide
- `QUICK_FIX_NOT_WORKING.md` - Troubleshooting

### Tools
- `start-adyapan.ps1` - Automated startup
- `diagnose-error.ps1` - Diagnostic tool

### Code
- `apps/backend/src/server.ts` - Backend entry point
- `apps/web/vite.config.ts` - Frontend config
- `.env` - Environment variables

---

## Next Time You Start

Once you know the process, just run:

```powershell
.\start-adyapan.ps1
```

It handles everything automatically!

---

## Summary

**Your Issue**: Frontend shows error
**Root Cause**: Backend not running
**Solution**: Start backend, then frontend
**Time to Fix**: 2-3 minutes
**Effort**: Copy-paste two commands

**You can do this!** 🚀

---

## Version History

- **Jul 25, 2026** - Initial error fix documentation created
- All supporting guides and tools created
- Automated startup script added
- Diagnostic tool added

---

**Last Updated**: July 25, 2026
**Status**: ✅ Ready to fix your error!

For questions or issues, refer to the detailed guides or run the diagnostic tool.
