# 🚨 FIX YOUR ERROR NOW - 5 Minutes

You're seeing: **"Something went wrong - Failed to fetch dynamically imported module"**

**Reason**: Backend API (port 5000) is not running!

---

## ⚡ Quick Fix (Follow Exactly)

### Step A: Copy This Command to PowerShell

**Open PowerShell and paste:**

```powershell
cd "c:\Users\HP\Downloads\AdyapanAI"; $null -eq (Get-Process node -ErrorAction SilentlyContinue) -and (Write-Host '✅ Ready to start') -or (Write-Host '⚠️  Kill existing node processes first: Get-Process node | Stop-Process -Force')
```

### Step B: Open TWO PowerShell/CMD Windows

**Do this for each one:**

**WINDOW 1 - Backend (copy & paste this):**
```
cd c:\Users\HP\Downloads\AdyapanAI
yarn dev:backend
```

Then **WAIT** until you see:
```
Server running on port 5000
✅ MySQL (Prisma) connected successfully
```

**DO NOT CLOSE THIS WINDOW!**

---

**WINDOW 2 - Frontend (in a NEW window, copy & paste this):**
```
cd c:\Users\HP\Downloads\AdyapanAI
yarn dev:web
```

Then **WAIT** until you see:
```
  ➜  Local:   http://localhost:3000/
```

**DO NOT CLOSE THIS WINDOW!**

---

### Step C: Open Browser

```
http://localhost:3000
```

Should see login page ✅

**Done!** The error is gone!

---

## 🔴 Still Broken? Try This

### Option 1: Port 5000 Already Used

```powershell
# Kill anything using port 5000
netstat -ano | findstr :5000
taskkill /PID <number-from-above> /F

# Then restart backend: yarn dev:backend
```

### Option 2: Port 3000 Already Used

```powershell
# Kill anything using port 3000
netstat -ano | findstr :3000
taskkill /PID <number-from-above> /F

# Then restart frontend: yarn dev:web
```

### Option 3: Node Modules Missing

```powershell
cd c:\Users\HP\Downloads\AdyapanAI
yarn install
# Wait 2-3 minutes

# Then start backend again
yarn dev:backend
```

### Option 4: Nuclear Reset

```powershell
# Kill all node
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Clean everything
cd c:\Users\HP\Downloads\AdyapanAI
Remove-Item node_modules -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item yarn.lock -Force -ErrorAction SilentlyContinue

# Reinstall
yarn install

# Start backend
yarn dev:backend
# Wait 30 seconds...

# In new window, start frontend
yarn dev:web
```

---

## ✅ Verification Checklist

Before opening browser:

- [ ] PowerShell Window 1 shows: "Server running on port 5000"
- [ ] PowerShell Window 2 shows: "http://localhost:3000/"
- [ ] No red error messages in either window
- [ ] Both windows are still running (not closed)

Then open browser to http://localhost:3000

---

## 📋 What's Happening

```
Your Browser
    ↓
Frontend (port 3000) ← needs this to be running
    ↓
Backend API (port 5000) ← MUST be running FIRST!
    ↓
Database (PostgreSQL)
```

**If Backend not running → Frontend can't get data → Error!**

---

## ⏱️ Timeline

| Time | What | Window | Status |
|------|------|--------|--------|
| 0:00 | Open Window 1 | 1 | Starting |
| 0:30 | Backend starts | 1 | ✅ Ready |
| 1:00 | Open Window 2 | 2 | Starting |
| 1:30 | Frontend starts | 2 | ✅ Ready |
| 2:00 | Open browser | Browser | ✅ Login page! |

---

## 🆘 Still Broken After All This?

Run diagnostic:
```powershell
.\diagnose-error.ps1
```

It will tell you exactly what's wrong.

---

**KEY RULE: Backend starts FIRST! Always!**

✅ Terminal 1: `yarn dev:backend` (wait for "port 5000")
✅ Terminal 2: `yarn dev:web` (wait for "port 3000")  
✅ Browser: `http://localhost:3000` (see login page)

**That's it! You're done!** 🎉
