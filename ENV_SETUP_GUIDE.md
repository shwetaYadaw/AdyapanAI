# 🚀 ADYAPAN Project - Environment Setup Guide

This guide will help you set up all the required environment variables to run the ADYAPAN project.

---

## 📋 Prerequisites

Before setting up, make sure you have:
- ✅ Node.js (v18 or higher)
- ✅ Yarn package manager
- ✅ PostgreSQL database (Supabase recommended)
- ✅ Redis (optional, for caching)
- ✅ Judge0 API (optional, for code execution)

---

## 📁 Project Structure

```
AdyapanAI/
├── .env                          # Root config
├── apps/
│   ├── backend/.env             # Backend API
│   ├── web/.env                 # Frontend
│   └── ai-service/.env          # AI Service
```

---

## 🔧 Setup Instructions

### Step 1: Create Environment Files

Create the following `.env` files in your project:

#### 1️⃣ Root: `.env`
```bash
DATABASE_URL="your_postgres_connection_string"
```

#### 2️⃣ Backend: `apps/backend/.env`
```bash
# ── Server ──────────────────────────────────────────────────────────────────
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000
MOBILE_URL=

# ── Database (Supabase PostgreSQL) ──────────────────────────────────────────
# IMPORTANT: Get your connection strings from Supabase Dashboard
# Go to: Project Settings > Database > Connection String

# Connection pooling URL (Transaction mode - Port 6543)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection URL (Session mode - Port 5432)
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres"

# NOTE: If your password has special characters, encode them:
# @ = %40
# ! = %21
# # = %23
# $ = %24
# % = %25
# ^ = %5E
# & = %26
# * = %2A

# ── Redis (Optional) ─────────────────────────────────────────────────────────
# Leave as localhost if you don't have Redis
REDIS_URL=redis://localhost:6379

# ── JWT Secrets (CHANGE THESE!) ──────────────────────────────────────────────
# Generate random strings (minimum 32 characters)
JWT_ACCESS_SECRET=your_random_access_secret_minimum_32_chars
JWT_REFRESH_SECRET=your_random_refresh_secret_minimum_32_chars
JWT_EMAIL_SECRET=your_random_email_secret_minimum_32_chars
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# ── Google OAuth (Optional) ──────────────────────────────────────────────────
# Get from: https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# ── Email (Optional) ─────────────────────────────────────────────────────────
# For Gmail: Enable 2FA, then create App Password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_gmail_app_password
EMAIL_FROM=ADYAPAN <noreply@adyapan.com>

# ── Cloudinary (Optional) ────────────────────────────────────────────────────
# Get from: https://cloudinary.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ── Payment Gateways (Optional) ──────────────────────────────────────────────
# Razorpay: https://dashboard.razorpay.com/app/keys
RAZORPAY_KEY_ID=rzp_test_placeholder
RAZORPAY_KEY_SECRET=placeholder_secret
RAZORPAY_WEBHOOK_SECRET=placeholder_webhook_secret

# Stripe: https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_test_placeholder
STRIPE_WEBHOOK_SECRET=whsec_placeholder

# ── AI Service ───────────────────────────────────────────────────────────────
AI_SERVICE_URL=http://localhost:8000
AI_SERVICE_API_KEY=adyapan_internal_ai_key_2024

# ── Frontend URL ─────────────────────────────────────────────────────────────
FRONTEND_URL=http://localhost:3000

# ── Certificate ──────────────────────────────────────────────────────────────
CERTIFICATE_SECRET=adyapan_certificate_secret_2024

# ── Judge0 Code Execution (Optional) ─────────────────────────────────────────
JUDGE0_API_URL=http://localhost:2358
JUDGE0_API_KEY=
```

#### 3️⃣ Frontend: `apps/web/.env`
```bash
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_RAZORPAY_KEY_ID=rzp_test_placeholder
```

#### 4️⃣ AI Service: `apps/ai-service/.env`
```bash
# ── OpenAI API (Required for AI features) ────────────────────────────────────
OPENAI_API_KEY=sk-your-openai-key
OPENAI_MODEL=gpt-4o-mini
EMBEDDING_MODEL=text-embedding-3-small

# ── Local LLM (Alternative to OpenAI) ────────────────────────────────────────
USE_LOCAL_LLM=false
OLLAMA_BASE_URL=http://localhost:11434
LOCAL_MODEL=llama3

# ── AI Service Settings ──────────────────────────────────────────────────────
AI_SERVICE_API_KEY=adyapan_internal_ai_key_2024
REDIS_URL=redis://localhost:6379
CHROMA_PERSIST_DIR=./data/chroma
FAISS_INDEX_DIR=./data/faiss
DEBUG=true
PORT=8000
```

---

## 🗄️ Step 2: Set Up Supabase Database

### Option A: Use Existing Supabase Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Project Settings** > **Database**
4. Copy the connection strings:
   - **Transaction mode** (Port 6543) → `DATABASE_URL`
   - **Session mode** (Port 5432) → `DIRECT_URL`

### Option B: Create New Supabase Project
1. Sign up at [supabase.com](https://supabase.com)
2. Click **"New Project"**
3. Choose:
   - Name: `adyapan-db`
   - Database Password: (save this!)
   - Region: Closest to you
4. Wait 2-3 minutes for setup
5. Copy connection strings as above

**⚠️ IMPORTANT:** If your password has special characters, encode them:
```
Original password: Shweta@2004!
Encoded password: Shweta%402004%21
```

---

## 🔑 Step 3: Get API Keys (Optional Services)

### Google OAuth (For Login)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Create **OAuth 2.0 Client ID**
5. Add authorized redirect URIs:
   - `http://localhost:3000`
   - `http://localhost:5000/api/v1/auth/google/callback`
6. Copy **Client ID** to both backend and frontend `.env`

### OpenAI API (For AI Features)
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up/Login
3. Go to **API Keys**
4. Create new secret key
5. Copy to `apps/ai-service/.env`

### Cloudinary (For Image Upload)
1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to **Dashboard**
3. Copy:
   - Cloud Name
   - API Key
   - API Secret
4. Add to backend and frontend `.env`

### Razorpay (For Payments)
1. Sign up at [Razorpay](https://razorpay.com/)
2. Go to **Settings** > **API Keys**
3. Generate **Test Keys**
4. Copy Key ID and Secret

---

## 🚀 Step 4: Install and Run

### Install Dependencies
```bash
# Install all workspace dependencies
yarn install
```

### Set Up Database
```bash
# Navigate to backend
cd apps/backend

# Generate Prisma Client
npx prisma generate

# Run migrations to create tables
npx prisma migrate dev

# Seed database with sample data
yarn seed
```

### Start Development Servers

#### Option 1: Run All Services Together
```bash
# From root directory
yarn dev
```

#### Option 2: Run Services Separately
```bash
# Terminal 1: Backend
yarn dev:backend

# Terminal 2: Frontend
yarn dev:web

# Terminal 3: AI Service (optional)
cd apps/ai-service
python -m uvicorn app.main:app --reload --port 8000
```

---

## 🌐 Access the Application

Once all services are running:

- 🌍 **Frontend:** http://localhost:3000
- 🔧 **Backend API:** http://localhost:5000
- 🤖 **AI Service:** http://localhost:8000
- 📊 **Prisma Studio:** `npx prisma studio` (from apps/backend)

---

## 👤 Default Admin Credentials

After seeding the database:

```
Email: admin@adyapan.com
Password: Admin@1234
```

---

## 🔍 Verify Setup

### Check Backend Health
```bash
curl http://localhost:5000/api/v1/health
```

### Check Database Connection
```bash
cd apps/backend
npx prisma studio
```
This will open a GUI to view your database tables.

### Check Frontend
Open http://localhost:3000 in your browser

---

## ⚠️ Common Issues

### Issue 1: Prisma Connection Error
**Problem:** `Can't reach database server`
**Solution:**
- Check DATABASE_URL is correct
- Verify password is URL-encoded
- Check Supabase project is not paused

### Issue 2: Port Already in Use
**Problem:** `Port 5000 is already in use`
**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

### Issue 3: Missing Dependencies
**Problem:** `Module not found`
**Solution:**
```bash
# Clean install
rm -rf node_modules
rm yarn.lock
yarn install
```

---

## 📝 Minimum Required Configuration

To run the project with **basic features only**, you only need:

### `apps/backend/.env` (Minimum)
```bash
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000

DATABASE_URL="your_supabase_connection_string"
DIRECT_URL="your_supabase_direct_connection_string"

JWT_ACCESS_SECRET=any_random_32_character_string_here
JWT_REFRESH_SECRET=another_random_32_character_string
JWT_EMAIL_SECRET=third_random_32_character_string
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

REDIS_URL=redis://localhost:6379
```

### `apps/web/.env` (Minimum)
```bash
VITE_API_URL=http://localhost:5000
```

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Judge0 Setup Guide](https://github.com/judge0/judge0)
- [OpenAI API Documentation](https://platform.openai.com/docs)

---

## 🆘 Need Help?

If you encounter any issues:
1. Check the logs in the terminal
2. Verify all environment variables are set correctly
3. Make sure all required services are running
4. Check database connection in Prisma Studio

---

## 🎉 You're All Set!

Once everything is configured, you should have:
- ✅ Backend running on port 5000
- ✅ Frontend running on port 3000
- ✅ Database with 545 coding questions
- ✅ Admin user created

Happy coding! 🚀
