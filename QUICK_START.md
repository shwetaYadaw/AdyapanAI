# 🚀 ADYAPAN - Quick Start Guide

Get the project running in **5 minutes**!

---

## 📦 Step 1: Clone & Install (2 min)

```bash
# Clone the repository
git clone <repository-url>
cd AdyapanAI

# Install dependencies
yarn install
```

---

## 🔑 Step 2: Set Up Environment Files (2 min)

### Create `.env` files from templates:

```bash
# Root
cp .env.template .env

# Backend
cp apps/backend/.env.template apps/backend/.env

# Frontend
cp apps/web/.env.template apps/web/.env

# AI Service (optional)
cp apps/ai-service/.env.template apps/ai-service/.env
```

### Edit the files with your credentials:

#### **REQUIRED:** `apps/backend/.env`
```bash
# 1. Get Supabase connection string from:
#    https://supabase.com/dashboard > Project Settings > Database
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@[region].pooler.supabase.com:5432/postgres"

# 2. Generate random JWT secrets (run 3 times):
#    node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_ACCESS_SECRET=<generated-secret-1>
JWT_REFRESH_SECRET=<generated-secret-2>
JWT_EMAIL_SECRET=<generated-secret-3>
```

#### **REQUIRED:** `apps/web/.env`
```bash
VITE_API_URL=http://localhost:5000
```

---

## 🗄️ Step 3: Set Up Database (1 min)

```bash
cd apps/backend

# Generate Prisma Client
npx prisma generate

# Create tables
npx prisma migrate dev

# Seed data (545 coding questions + admin user)
yarn seed
```

✅ **Admin Login:**
- Email: `admin@adyapan.com`
- Password: `Admin@1234`

---

## 🎯 Step 4: Run the Project

### Option A: Run All Services Together
```bash
# From root directory
yarn dev
```

### Option B: Run Separately
```bash
# Terminal 1: Backend
yarn dev:backend

# Terminal 2: Frontend
yarn dev:web
```

---

## 🌐 Access the App

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Prisma Studio:** `npx prisma studio` (from apps/backend)

---

## ✅ Verify Setup

Open http://localhost:3000 and:
1. Click **Login**
2. Use admin credentials
3. Go to **Coding Arena** → Should see 545 questions
4. Try solving a problem!

---

## ⚠️ Troubleshooting

### Can't connect to database?
- Check DATABASE_URL is correct
- Verify password is URL-encoded (`@` → `%40`, `!` → `%21`)
- Check Supabase project is not paused

### Port 5000 already in use?
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### Missing tables in database?
```bash
cd apps/backend
npx prisma migrate reset  # This will recreate everything
yarn seed
```

---

## 🎉 That's it!

You're ready to code! For detailed setup and optional features, see `ENV_SETUP_GUIDE.md`.

---

## 📚 Useful Commands

```bash
# View database in GUI
cd apps/backend && npx prisma studio

# Reset database
cd apps/backend && npx prisma migrate reset

# View API documentation
# Open http://localhost:5000/api-docs (if Swagger is configured)

# Run tests
yarn test

# Build for production
yarn build
```

---

## 🆘 Need Help?

Read the detailed `ENV_SETUP_GUIDE.md` for:
- Setting up Google OAuth
- Configuring payment gateways
- Setting up AI features
- Judge0 code execution setup
- And more!
