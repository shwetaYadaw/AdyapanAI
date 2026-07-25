# AdyapanAI - Complete Project Startup Guide

## Quick Overview
AdyapanAI is a **monorepo** with three main applications:
- **Backend** (`apps/backend`) - Node.js/Express API on port **5000**
- **Frontend** (`apps/web`) - React/Vite UI on port **3000**
- **AI Service** (`apps/ai-service`) - Python/FastAPI service (optional)

> ⚠️ **CRITICAL**: Backend MUST start FIRST before opening frontend in browser

---

## Prerequisites

### 1. System Requirements
- **Node.js**: v16 or higher (check: `node --version`)
- **npm**: v7 or higher (check: `npm --version`)
- **Python**: v3.8+ (only for AI service, optional)
- **Database**: Supabase PostgreSQL configured in `apps/backend/.env`

### 2. Install Dependencies
Run from the project root:
```bash
npm install --ignore-scripts --force
```

**Why `--ignore-scripts --force`?**
- Skips postinstall scripts to avoid Windows permission issues with esbuild
- `-force` allows npm to install with conflicts

---

## Step-by-Step Startup

### Step 1: Terminal 1 - Start Backend (Port 5000)

```bash
cd apps/backend
npm run dev
```

**Expected Output:**
```
✓ Prisma Client generated
✓ Database connected to Supabase
✓ Server running on http://localhost:5000
✓ API health check: GET http://localhost:5000/health
```

**What if it fails?**
- Check `apps/backend/.env` - Supabase credentials must be set
- Run `npx prisma generate` manually if client isn't generated
- Check if port 5000 is already in use: `netstat -ano | findstr :5000`

---

### Step 2: Terminal 2 - Start Frontend (Port 3000)

```bash
cd apps/web
npm run dev
```

**Expected Output:**
```
✓ Vite dev server running
✓ Frontend available at http://localhost:3000
✓ Proxying API requests to http://localhost:5000
```

**What if it fails?**
- Ensure backend is running first (Step 1)
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Check if port 3000 is already in use: `netstat -ano | findstr :3000`

---

### Step 3: Open in Browser

Go to **http://localhost:3000**

**Login with test credentials:**
- Email: `student@test.com`
- Password: `password123`

---

## Common Issues & Fixes

### ❌ "Failed to fetch dynamically imported module"
**Cause**: Backend not running  
**Fix**: 
1. Start backend first (Step 1)
2. Clear browser cache: F12 → Application → Clear All Storage
3. Hard refresh: Ctrl+Shift+R

### ❌ "Cannot find module '@prisma/client'"
**Cause**: Prisma client not generated  
**Fix**:
```bash
cd apps/backend
npx prisma generate
```

### ❌ "EADDRINUSE: address already in use :::5000"
**Cause**: Port 5000 already in use  
**Fix** (Windows):
```bash
# Find process on port 5000
netstat -ano | findstr :5000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### ❌ Dependencies won't install
**Fix**:
```bash
npm cache clean --force
rm -r node_modules package-lock.json
npm install --ignore-scripts --force
```

---

## Project Structure

```
AdyapanAI/
├── apps/
│   ├── backend/                    # Node.js/Express API
│   │   ├── src/
│   │   │   ├── routes/            # API endpoints
│   │   │   ├── scripts/           # Database scripts
│   │   │   └── middleware/        # Auth, logging, etc.
│   │   ├── prisma/
│   │   │   └── schema.prisma      # Database schema
│   │   └── .env                   # Supabase credentials
│   │
│   ├── web/                        # React/Vite frontend
│   │   ├── src/
│   │   │   ├── pages/             # Page components
│   │   │   ├── components/        # Reusable components
│   │   │   ├── styles/            # Global styles
│   │   │   └── services/          # API client
│   │   └── .env                   # API proxy config
│   │
│   └── ai-service/                # Python/FastAPI (optional)
│
├── package.json                    # Root package.json
└── .env                           # Root environment variables
```

---

## Environment Variables

### Backend (`apps/backend/.env`)
```
# Supabase PostgreSQL Connection
DATABASE_URL=postgresql://user:password@host:6543/dbname
DIRECT_URL=postgresql://user:password@host:5432/dbname

# API Config
PORT=5000
NODE_ENV=development
```

### Frontend (`apps/web/.env`)
```
# API Proxy (backend URL)
VITE_API_URL=http://localhost:5000
```

---

## Key Commands

### Backend
```bash
cd apps/backend

# Start development server
npm run dev

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Check database connection
npx prisma db execute

# View database in Prisma Studio
npx prisma studio
```

### Frontend
```bash
cd apps/web

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## API Endpoints

### Health Check
```bash
curl http://localhost:5000/health
```

### Get DSA Questions
```bash
curl http://localhost:5000/challenges/questions
```

### Run Code
```bash
curl -X POST http://localhost:5000/challenges/questions/{id}/run \
  -H "Content-Type: application/json" \
  -d '{"code":"...", "language":"javascript", "input":"..."}'
```

---

## Stopping the Project

1. In each terminal, press `Ctrl+C` to stop the server
2. Or close the terminal window

---

## Next Steps

- **Create DSA Problems**: See `DSA_ENHANCEMENT_COMPLETE_REPORT.md`
- **Make Changes**: Edit files in `apps/web/src/` or `apps/backend/src/`
- **Test Code**: Use the Coding Portal at `/student/challenges`
- **View Database**: Run `npx prisma studio` in backend folder

---

## Support

**Backend Issues?**
- Check logs in terminal
- Verify `.env` file has correct Supabase credentials
- Run `npx prisma generate` to regenerate client

**Frontend Issues?**
- Check browser console (F12)
- Clear cache and hard refresh (Ctrl+Shift+R)
- Verify backend is running on port 5000

**Database Issues?**
- Verify Supabase connection in `apps/backend/.env`
- Check database is created and accessible
- Run `npx prisma db push` to sync schema

---

**Created**: $(date)  
**Last Updated**: 2026-07-25  
**Status**: Ready for Development ✅
