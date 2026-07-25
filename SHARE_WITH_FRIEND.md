# 📤 Share This Project With Your Friend

## 📋 Files Created for Easy Setup

I've created template files for your friend to easily set up the ADYAPAN project:

### 1. 🚀 **QUICK_START.md**
   - 5-minute setup guide
   - Minimal configuration
   - Step-by-step instructions

### 2. 📖 **ENV_SETUP_GUIDE.md**
   - Complete detailed guide
   - All API key setup instructions
   - Troubleshooting tips

### 3. 🔐 **Environment Templates**
   - `.env.template` (root)
   - `apps/backend/.env.template`
   - `apps/web/.env.template`
   - `apps/ai-service/.env.template`

---

## 🎁 What to Send Your Friend

### Option 1: Send the Entire Project
```bash
# Zip the entire project (excluding node_modules)
# They can clone from Git or get a zip file
```

### Option 2: Send Just the Setup Files
Send these files:
1. ✅ `QUICK_START.md`
2. ✅ `ENV_SETUP_GUIDE.md`
3. ✅ `.env.template`
4. ✅ `apps/backend/.env.template`
5. ✅ `apps/web/.env.template`
6. ✅ `apps/ai-service/.env.template`

---

## 🔑 What Your Friend Needs to Get

### Required (To Run Basic Project):
1. **Supabase Account (Free)**
   - Sign up: https://supabase.com
   - Create a new project
   - Get PostgreSQL connection strings
   - Takes ~5 minutes

2. **JWT Secrets (Generate Locally)**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Run 3 times for 3 different secrets

### Optional (For Advanced Features):
3. **Google OAuth** - For social login
4. **OpenAI API Key** - For AI features
5. **Cloudinary** - For image uploads
6. **Razorpay/Stripe** - For payments
7. **Judge0** - For code execution

---

## 📝 Instructions for Your Friend

### Step 1: Get the Code
```bash
git clone <repository-url>
cd AdyapanAI
yarn install
```

### Step 2: Copy Templates
```bash
cp .env.template .env
cp apps/backend/.env.template apps/backend/.env
cp apps/web/.env.template apps/web/.env
cp apps/ai-service/.env.template apps/ai-service/.env
```

### Step 3: Follow QUICK_START.md
Open `QUICK_START.md` and follow the 5-minute setup guide.

---

## 🎯 Minimum Configuration (To Just Run It)

Your friend only needs to configure **2 files**:

### 1. `apps/backend/.env`
```bash
# Database (from Supabase)
DATABASE_URL="postgresql://postgres.xxx:password@xxx.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxx:password@xxx.supabase.com:5432/postgres"

# JWT Secrets (generate random strings)
JWT_ACCESS_SECRET=any_random_32_character_string
JWT_REFRESH_SECRET=another_random_32_character_string  
JWT_EMAIL_SECRET=third_random_32_character_string

# Keep these as-is
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
REDIS_URL=redis://localhost:6379
```

### 2. `apps/web/.env`
```bash
VITE_API_URL=http://localhost:5000
```

That's it! Everything else is optional.

---

## 🗄️ Database Setup

After configuring `.env` files:

```bash
cd apps/backend

# Generate Prisma Client
npx prisma generate

# Create all tables (30+ tables)
npx prisma migrate dev

# Seed 545 coding questions + admin user
yarn seed
```

---

## 🚀 Run the Project

```bash
# From root directory
yarn dev
```

Then open http://localhost:3000

---

## 🎓 What They'll Get

After setup, your friend will have:

✅ **Frontend:** React + TypeScript + Vite
✅ **Backend:** Node.js + Express + Prisma
✅ **Database:** PostgreSQL (Supabase) with:
   - 545 Coding Challenge Questions
   - 98 TCS NQT Questions  
   - 6 Sample Courses
   - Admin user (admin@adyapan.com / Admin@1234)

✅ **Features:**
   - User authentication (JWT)
   - Coding arena with 545 problems
   - TCS NQT preparation
   - Course management
   - Leaderboards
   - Problem filtering by topic/difficulty
   - Code execution (if Judge0 configured)
   - And more!

---

## 🆘 If They Get Stuck

Tell them to:
1. Read `ENV_SETUP_GUIDE.md` (detailed guide)
2. Check their Supabase connection strings
3. Verify password is URL-encoded
4. Make sure all `.env` files exist
5. Run `yarn install` again

---

## 📊 Project Statistics

- **Total Questions:** 545 (includes 46 built-in duplicates)
- **Topics:** Arrays, Strings, Linked Lists, Trees, DP, Graphs, etc.
- **Test Cases:** 5 per question
- **Languages Supported:** Python, JavaScript, Java, C++
- **Database Tables:** 30+
- **API Endpoints:** 50+

---

## 🎉 Ready to Share!

Your friend can now:
1. Clone the repo
2. Follow QUICK_START.md (5 minutes)
3. Start coding!

All sensitive data (passwords, API keys) are safely removed from templates.
They'll need to get their own Supabase account (free) and generate JWT secrets.

Good luck! 🚀
