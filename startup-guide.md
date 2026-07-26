# AdyapanAI Startup Guide - Fix "Something went wrong" Error

## The Problem You're Seeing

When you open `http://localhost:3000`, you see:
```
Something went wrong

Failed to fetch dynamically imported module: 
http://localhost:3000/src/pages/auth/LoginPage.tsx
```

## Root Cause

**The Backend API (port 5000) is NOT running!**

The frontend tries to connect to the backend API at `http://localhost:5000`, but it's not responding. This causes the frontend to fail loading.

---

## Solution: 3-Step Startup Process

### What You Need

- **2 Terminal Windows** (Command Prompt or PowerShell)
- **1 Browser Window**
- **Patience**: Wait for each step to complete before moving to the next

---

### STEP 1: Verify Installation (5 minutes)

```powershell
cd "c:\Users\HP\Downloads\AdyapanAI"

# Check Node.js
node --version
# Should output: v20.x.x or higher

# Check Yarn
yarn --version
# Should output: 1.22.x or higher

# Install dependencies (if not done yet)
yarn install
# This will take 2-3 minutes
```

**✅ If all commands work, proceed to Step 2**

---

### STEP 2: Start Backend API (Terminal 1)

**Open Terminal 1 and run:**

```powershell
cd "c:\Users\HP\Downloads\AdyapanAI"
yarn dev:backend
```

**Wait until you see this message:**
```
╔═══════════════════════════════════════════════╗
║          ADYAPAN API Server                   ║
║  Environment : development                    ║
║  Port        : 5000                           ║
║  URL         : http://localhost:5000          ║
║  Database    : MySQL only (Prisma)            ║
╚═══════════════════════════════════════════════╝
✅ MySQL (Prisma) connected successfully
```

**DO NOT close this terminal!** Keep it running. This is your backend API server.

**❌ If you see errors:**
- `PORT already in use`: Another process is using port 5000. Close it or run `netstat -ano | findstr :5000`
- `Cannot connect to database`: Check DATABASE_URL in `.env` file
- `Module not found`: Run `yarn install` again

---

### STEP 3: Start Frontend (Terminal 2)

**Open a NEW Terminal (Terminal 2) and run:**

```powershell
cd "c:\Users\HP\Downloads\AdyapanAI"
yarn dev:web
```

**Wait until you see:**
```
  VITE v5.0.0  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  press h to show help
```

**DO NOT close this terminal!** Keep it running.

**❌ If you see errors:**
- `PORT 3000 already in use`: Close other instances using port 3000
- `Cannot find module`: Run `yarn install` in root directory
- `Vite configuration not found`: Verify you're in the correct directory

---

### STEP 4: Open App in Browser

**Now open your browser:**
```
http://localhost:3000
```

You should see the **AdyapanAI Login Page** without any errors! 🎉

---

## Running Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                   Your Computer                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Terminal 1              Terminal 2              Browser     │
│  ───────────             ───────────             ───────     │
│  ├─ Backend API          ├─ Frontend             │ Open:    │
│  │  Port: 5000           │  Port: 3000           │ http://  │
│  │  Status: Running ✅   │  Status: Running ✅   │ localhost│
│  │  Database: MySQL      │  App Framework: React │ :3000    │
│  │  Framework: Express   │  Build Tool: Vite     │          │
│  │                       │                       │ ← Shows  │
│  │ API Endpoints:        │ Routes to /api/...    │ Login    │
│  │ /api/problems         └──────┬────────────────→ Page     │
│  │ /api/auth                    │  Requests            ✅    │
│  │ /api/user                    │  API Data                   │
│  └────────────────────────────────────────────────┘
│
│  🔄 Frontend makes API calls to Backend
│  📊 Backend processes requests and returns data
│  💾 Database stores all DSA problems
│
└─────────────────────────────────────────────────────────────┘
```

---

## Port Information

- **Backend API**: `http://localhost:5000` (Express.js server)
- **Frontend**: `http://localhost:3000` (Vite dev server)
- **Database**: Configured in `.env` as PostgreSQL via Prisma

The frontend's `vite.config.ts` automatically proxies all `/api/*` requests to the backend:
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:5000',
  },
}
```

---

## Troubleshooting

### "Failed to fetch dynamically imported module"
**Solution**: Make sure backend is running on port 5000 BEFORE opening frontend in browser.

### Port Already in Use
```powershell
# Find what's using the port
netstat -ano | findstr :5000
# or
netstat -ano | findstr :3000

# Kill it (replace PID with the number from above)
taskkill /PID <PID> /F
```

### Can't Connect to Database
```powershell
# Check .env file
cat .env

# Should show DATABASE_URL with valid connection string
# Current: prisma+postgres://localhost:51213/?api_key=...
```

### "Cannot find module" errors
```powershell
# Clean install from root
yarn install

# Wait for it to complete, then run backend/frontend again
```

### Module loading fails in browser
1. Open browser DevTools (F12)
2. Check Console tab for actual error message
3. Reload page (Ctrl+R or Cmd+R)
4. If persists, restart both terminals

---

## Process Management

### To Stop Everything
```powershell
# Press Ctrl+C in each terminal window to gracefully shut down

Terminal 1: Ctrl+C  # Backend shuts down
Terminal 2: Ctrl+C  # Frontend shuts down
```

### To Restart
```powershell
# Close both terminals and repeat Steps 2-4
```

### To Kill Stuck Processes
```powershell
# Kill all Node processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Then restart
```

---

## Next Steps After Startup

Once the app is running and you're logged in:

### Run DSA Problem Scripts (Terminal 3)

```powershell
cd "c:\Users\HP\Downloads\AdyapanAI\apps\backend"

# Check database
npx ts-node --transpile-only src/scripts/checkDbCount.ts

# Update problems
npx ts-node --transpile-only src/scripts/updateJumpGameProblem.ts
```

### View DSA Problems
- Navigate to Problems section in the app
- Browse and filter by difficulty
- Each problem has comprehensive content

### Run Tests
```powershell
yarn test
```

---

## Quick Reference

| Task | Command | Terminal |
|------|---------|----------|
| Install deps | `yarn install` | Any |
| Start backend | `yarn dev:backend` | 1 |
| Start frontend | `yarn dev:web` | 2 |
| Check DB | `npx ts-node --transpile-only src/scripts/checkDbCount.ts` | 3 |
| Kill node processes | `Get-Process node \| Stop-Process -Force` | Any |
| View .env | `cat .env` | Any |

---

## Success Indicators ✅

- [x] Both terminals show "ready" messages
- [x] http://localhost:3000 opens without errors
- [x] Login page displays correctly
- [x] Browser console has no red error messages
- [x] Frontend loads DSA problems from backend API

---

## Still Having Issues?

1. **Run diagnostic tool:**
   ```powershell
   .\diagnose-error.ps1
   ```

2. **Check log files:**
   - Backend logs appear in Terminal 1
   - Frontend logs appear in Terminal 2
   - Look for red error messages

3. **Read the detailed guide:**
   - See `QUICK_FIX_NOT_WORKING.md` for more solutions

4. **Verify ports:**
   ```powershell
   curl http://localhost:5000/api/health  # Backend health
   curl http://localhost:3000             # Frontend
   ```

---

**Key Rule: Backend MUST be running on port 5000 BEFORE you open frontend in browser!**

✅ Backend (5000) → ✅ Frontend (3000) → ✅ Open Browser = SUCCESS!
