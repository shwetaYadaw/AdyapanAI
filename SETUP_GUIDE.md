# ADYAPAN — Complete Setup Guide for Windows

## What You Need First (One-time Setup)

### 1. Install Node.js 20
https://nodejs.org/en/download → Download "LTS" version

### 2. Install Python 3.11
https://www.python.org/downloads/ → 3.11.x
✅ CHECK "Add Python to PATH" during install

### 3. Install Git
https://git-scm.com/download/win

### 4. Install Redis (for Windows)
Option A — Use Upstash (free cloud Redis, no install needed):
  → Go to https://upstash.com → Create free database → Copy Redis URL

Option B — Run Redis via Docker:
  → Install Docker Desktop: https://www.docker.com/products/docker-desktop
  → Then run: docker run -d -p 6379:6379 redis:7-alpine

### 5. MongoDB Atlas (free cloud database)
→ Go to https://www.mongodb.com/atlas
→ Create free cluster (M0)
→ Create database user
→ Whitelist your IP (or 0.0.0.0/0 for dev)
→ Copy connection string

---

## External Services to Create Accounts

| Service | URL | What you need |
|---|---|---|
| MongoDB Atlas | https://cloud.mongodb.com | Connection string |
| Cloudinary | https://cloudinary.com | cloud_name, api_key, api_secret |
| Google Cloud | https://console.cloud.google.com | OAuth client_id |
| Razorpay | https://dashboard.razorpay.com | key_id, key_secret |
| Stripe (optional) | https://dashboard.stripe.com | secret_key |
| OpenAI | https://platform.openai.com | api_key |
| Gmail/SMTP | Any email | SMTP credentials |

---

## Step-by-Step Setup

### STEP 1: Open 4 PowerShell/CMD windows (all in this folder)

Open Windows Terminal or PowerShell and navigate to:
```
cd C:\Users\HP\Downloads\AdyapanAI
```

---

### STEP 2: Configure Backend Environment

Copy and edit the backend .env:
```
copy apps\backend\.env.example apps\backend\.env
notepad apps\backend\.env
```

Fill in these REQUIRED values:
```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000

MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/adyapan

REDIS_URL=redis://localhost:6379
# OR if using Upstash:
# REDIS_URL=rediss://default:xxxxx@xxxx.upstash.io:6380

JWT_ACCESS_SECRET=adyapan_access_secret_change_this_to_random_64chars
JWT_REFRESH_SECRET=adyapan_refresh_secret_change_this_to_random_64chars
JWT_EMAIL_SECRET=adyapan_email_secret_change_this

GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_gmail_app_password

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret
RAZORPAY_WEBHOOK_SECRET=any_random_string

STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

AI_SERVICE_URL=http://localhost:8000
AI_SERVICE_API_KEY=adyapan_internal_ai_key_2024

FRONTEND_URL=http://localhost:3000
CERTIFICATE_SECRET=adyapan_cert_secret_2024
```

---

### STEP 3: Configure Web Environment

```
copy apps\web\.env.example apps\web\.env
notepad apps\web\.env
```

Fill in:
```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
```

---

### STEP 4: Configure AI Service Environment

```
copy apps\ai-service\.env.example apps\ai-service\.env
notepad apps\ai-service\.env
```

Fill in:
```env
OPENAI_API_KEY=sk-xxxxx
OPENAI_MODEL=gpt-4o-mini
AI_SERVICE_API_KEY=adyapan_internal_ai_key_2024
REDIS_URL=redis://localhost:6379
DEBUG=true
```

---

### STEP 5: Install Backend Dependencies

In TERMINAL 1:
```powershell
cd C:\Users\HP\Downloads\AdyapanAI\apps\backend
npm install
```
Wait for "added X packages" ✅

---

### STEP 6: Install Web Dependencies

In TERMINAL 2:
```powershell
cd C:\Users\HP\Downloads\AdyapanAI\apps\web
npm install
```
Wait for "added X packages" ✅

---

### STEP 7: Install AI Service Dependencies

In TERMINAL 3:
```powershell
cd C:\Users\HP\Downloads\AdyapanAI\apps\ai-service
python -m venv venv
venv\Scripts\activate
pip install fastapi uvicorn pydantic pydantic-settings python-dotenv langchain langchain-community langchain-openai openai sentence-transformers faiss-cpu pypdf python-multipart httpx redis tiktoken loguru aiofiles
```

---

### STEP 8: Start All Services

**TERMINAL 1 — Backend (port 5000):**
```powershell
cd C:\Users\HP\Downloads\AdyapanAI\apps\backend
npx ts-node-dev --respawn --transpile-only src/server.ts
```

Wait for: `✅ MongoDB Atlas connected` and `ADYAPAN API Server` message

**TERMINAL 2 — Web Frontend (port 3000):**
```powershell
cd C:\Users\HP\Downloads\AdyapanAI\apps\web
npx vite
```

Wait for: `Local: http://localhost:3000/`

**TERMINAL 3 — AI Service (port 8000):**
```powershell
cd C:\Users\HP\Downloads\AdyapanAI\apps\ai-service
venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

Wait for: `Uvicorn running on http://0.0.0.0:8000`

---

### STEP 9: Open the App

Open browser → http://localhost:3000

You should see the ADYAPAN landing page! 🎉

---

## Test the Setup

### Check Backend API:
```
http://localhost:5000/api/v1/health
```
Should return: `{"status":"ok","database":"connected"}`

### Check AI Service:
```
http://localhost:8000/docs
```
Should show FastAPI swagger docs

### Register a test account:
1. Go to http://localhost:3000/register
2. Select "Student" role
3. Fill in details and register
4. Check backend terminal — you'll see the verification email logged
5. In development mode, find the verification token in terminal logs
6. Use it at http://localhost:3000/verify-email?token=YOUR_TOKEN

---

## Quick Dev Mode (Skip Email Verification)

To bypass email verification in development, add this to `apps/backend/src/services/auth.service.ts`:

In the `register` method, after creating the user, add:
```typescript
// DEV ONLY: auto-verify
if (env.isDevelopment()) {
  await User.findByIdAndUpdate(user._id, { isEmailVerified: true });
}
```

---

## Common Issues & Fixes

### "Cannot connect to MongoDB"
→ Check your MONGODB_URI in .env
→ Make sure you whitelisted your IP in MongoDB Atlas
→ Try adding ?retryWrites=true&w=majority to the URI

### "ECONNREFUSED redis"
→ Start Redis: `docker run -d -p 6379:6379 redis:7-alpine`
→ Or use Upstash cloud Redis

### "Module not found @adyapan/shared"
→ Run: `npm install` in the root folder first
→ Or in `apps/backend`: `npm install ../../packages/shared`

### "Port 5000 already in use"
→ Change PORT=5001 in backend .env
→ Update VITE_API_URL=http://localhost:5001 in web .env

### TypeScript compilation errors
→ These are non-blocking in dev mode with ts-node-dev
→ They won't stop the server from running

---

## Mobile App (Optional)

```powershell
cd C:\Users\HP\Downloads\AdyapanAI\apps\mobile
npm install
npx expo start
```

Then scan QR code with Expo Go app on your phone.
Make sure your phone and PC are on the same WiFi.
Update `EXPO_PUBLIC_API_URL` in the Expo start output to your PC's local IP.

---

## Production Deployment

See README.md → Deployment section for Vercel + Render deployment.

---

## Summary of What Runs Where

| Service | Port | Command |
|---|---|---|
| Backend API | 5000 | `npx ts-node-dev --respawn --transpile-only src/server.ts` |
| Web Frontend | 3000 | `npx vite` |
| AI Service | 8000 | `uvicorn app.main:app --reload` |
| Redis | 6379 | `docker run -d -p 6379:6379 redis:7-alpine` |
