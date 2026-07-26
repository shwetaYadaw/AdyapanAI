# Quick Fix - "Something went wrong" Error

## Problem
Frontend shows "Something went wrong" error:
```
Failed to fetch dynamically imported module: http://localhost:3000/src/pages/auth/LoginPage.tsx
```

## Root Cause
1. **Node modules not installed** - Run `yarn install`
2. **Backend not running** - Backend API at port 5000 is not accessible
3. **Frontend not built** - Frontend needs to be built first
4. **Wrong URL** - Trying to access localhost:3000 but app not running there

---

## Solution - Step by Step

### Step 1: Clean Install (5 minutes)

```powershell
cd "c:\Users\HP\Downloads\AdyapanAI"

# Remove lock files to avoid conflicts
Remove-Item package-lock.json -Force -ErrorAction SilentlyContinue
Remove-Item yarn.lock -Force -ErrorAction SilentlyContinue

# Clear node_modules
Remove-Item node_modules -Recurse -Force -ErrorAction SilentlyContinue

# Fresh install
yarn install
```

If yarn times out:
```powershell
# Use npm instead
npm install
```

### Step 2: Setup Environment (2 minutes)

Verify `.env` file has at minimum:
```env
DATABASE_URL="your-database-url"
JWT_ACCESS_SECRET="secret-key-min-32-chars"
JWT_REFRESH_SECRET="secret-key-min-32-chars"
```

**NOTE:** Your current `.env` only has DATABASE_URL. You need more!

### Step 3: Build Backend (2 minutes)

```powershell
cd apps/backend

# Install backend dependencies
npm install

# Build TypeScript
npm run build

# Or compile directly
npx tsc
```

### Step 4: Run Backend First (Required!)

```powershell
# From project root
yarn dev:backend

# Or directly from backend
cd apps/backend
npm run dev
```

**WAIT** until you see:
```
✅ Server running on http://localhost:5000
```

### Step 5: Run Frontend (In a NEW Terminal)

```powershell
# From project root
yarn dev:web

# Or directly from web
cd apps/web
npm run dev
```

**WAIT** until you see:
```
✅ Frontend running on http://localhost:3000
```

### Step 6: Access the App

Open browser:
```
http://localhost:3000
```

---

## Common Errors & Fixes

### Error: "Can't find module 'dotenv'"
```powershell
npm install dotenv
```

### Error: "PORT 5000 already in use"
```powershell
# Kill the process using port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or use different port
SET PORT=5001
npm run dev
```

### Error: "PORT 3000 already in use"
```powershell
# Kill the process using port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
SET PORT=3001
npm run dev
```

### Error: "ENOENT: no such file or directory"
Make sure you're in the correct directory:
```powershell
pwd  # Should show: C:\Users\HP\Downloads\AdyapanAI
ls apps/backend  # Should list backend files
```

### Error: "Cannot find module @adyapan/shared"
Packages not linked. Run:
```powershell
yarn install
# Wait for complete installation
```

---

## Quick Verification Checklist

- [ ] Node.js installed: `node --version`
- [ ] Yarn installed: `yarn --version`
- [ ] In correct directory: `pwd` shows `AdyapanAI`
- [ ] .env file exists
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can access http://localhost:3000
- [ ] Can see login page (not error)

---

## Full Restart (Nuclear Option)

If everything fails, do a complete restart:

```powershell
cd "c:\Users\HP\Downloads\AdyapanAI"

# Kill all node processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Clean all
Remove-Item node_modules -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item apps/*/node_modules -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item package-lock.json -Force -ErrorAction SilentlyContinue
Remove-Item yarn.lock -Force -ErrorAction SilentlyContinue

# Fresh start
yarn install

# Then follow Steps 3-6 above
```

---

## Still Not Working?

1. **Check backend is running:**
   ```powershell
   curl http://localhost:5000/api/health
   ```

2. **Check frontend is running:**
   ```powershell
   curl http://localhost:3000
   ```

3. **Check logs for errors:**
   - Backend: Look in `backend-dev.log`
   - Frontend: Look in `web-dev.log`

4. **Check ports are correct:**
   ```powershell
   netstat -ano | findstr :5000
   netstat -ano | findstr :3000
   ```

---

## Best Practice - Run in Order

**Terminal 1 - Backend:**
```powershell
cd "c:\Users\HP\Downloads\AdyapanAI"
yarn dev:backend
# Wait for "Server running on port 5000"
```

**Terminal 2 - Frontend:**
```powershell
cd "c:\Users\HP\Downloads\AdyapanAI"
yarn dev:web
# Wait for "Frontend running on port 3000"
```

**Browser:**
```
http://localhost:3000
```

---

## Expected Output

### Backend Ready:
```
✅ Server running on http://localhost:5000
📦 Database connected
🔐 JWT configured
```

### Frontend Ready:
```
✅ Vite server running at http://localhost:3000
📦 Building modules...
🎉 Ready for development
```

### Frontend in Browser:
```
Login Page loads successfully
No errors in console
No red error messages
```

---

## Next: Run DSA Problem Scripts

Once both are running successfully, you can run the DSA problem scripts in Terminal 3:

```powershell
cd "c:\Users\HP\Downloads\AdyapanAI\apps\backend"

# Run any of the DSA scripts
npx ts-node --transpile-only src/scripts/checkDbCount.ts
npx ts-node --transpile-only src/scripts/updateJumpGameProblem.ts
# etc...
```

---

**Key:** Backend MUST run before frontend! The frontend needs the API!

✅ Backend on port 5000 → Frontend on port 3000 → Access at http://localhost:3000
