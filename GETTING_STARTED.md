# Getting Started - AdyapanAI Development

## ✅ All Question Updates Now Auto-Sync!

**Good news:** All the questions you've updated are now **automatically synced** when:
- ✅ Team members pull the code
- ✅ Backend starts (auto-seed runs)
- ✅ Deployed to production

No manual seeding needed! 🎉

---

## Quick Start (Development)

### Prerequisites
- Node.js >= 20.0.0
- Yarn >= 1.22.0
- PostgreSQL or MySQL running

### Step 1: Install Dependencies

```bash
yarn install
```

### Step 2: Configure Environment Variables

#### Backend (`apps/backend/.env`)
```env
MONGODB_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_32_char_secret_key_here
JWT_REFRESH_SECRET=your_32_char_secret_key_here
JWT_EMAIL_SECRET=your_32_char_secret_key_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
DATABASE_URL=postgresql://user:password@localhost:5432/adyapan
```

#### Web (`apps/web/.env`)
```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### Step 3: Start Services

**Terminal 1 - Backend (Port 5000):**
```bash
cd apps/backend
npm run dev
```

You'll see:
```
🌱 Starting auto-seed of questions from JSON files...
  ✅ arrays.json: 26 questions processed
  ✅ strings.json: 20 questions processed
  ...
✨ Auto-seed complete!
   ✅ Total created: X
   ✏️  Total updated: Y
   ❌ Total failed: Z
```

**Terminal 2 - Web (Port 3000):**
```bash
cd apps/web
npm run dev
```

### Step 4: Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api/v1
- **API Documentation:** http://localhost:5000/api/v1/docs

---

## ⚠️ Fixing Google OAuth "Access Blocked" Error

If you see **"Error 400: origin_mismatch"**:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Add these URLs under **Authorized JavaScript origins:**
   ```
   http://localhost:3000
   http://localhost:5000
   http://127.0.0.1:3000
   http://127.0.0.1:5000
   ```
5. Add these URLs under **Authorized redirect URIs:**
   ```
   http://localhost:3000/auth/callback
   http://localhost:5000/auth/callback
   http://127.0.0.1:3000/auth/callback
   http://127.0.0.1:5000/auth/callback
   ```
6. Click **Save** and wait 2-3 minutes
7. Clear browser cache and try again

See [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) for detailed instructions.

---

## 📚 Question Updates - Now Fully Automated!

### What Happens When You Pull Code:

1. ✅ Get latest JSON files from Git (arrays.json, strings.json, etc.)
2. ✅ Backend starts with auto-seed
3. ✅ Database is automatically updated with all question changes
4. ✅ Frontend fetches and displays updated questions

### No More Manual Steps! 🎉

Before, you had to:
```bash
npm run seed:all-questions  # NOT NEEDED ANYMORE
```

Now it happens automatically when backend starts.

### For Future Deployments:

When deployed to production:
- ✅ Questions auto-seed on deploy startup
- ✅ All users see latest updates
- ✅ No downtime needed
- ✅ Works on all cloud platforms (Vercel, Render, AWS, etc.)

---

## Project Structure

```
adyapan/
├── apps/
│   ├── web/              React 18 + Vite (Port 3000)
│   ├── backend/          Node.js + Express (Port 5000)
│   ├── ai-service/       Python FastAPI
│   └── mobile/           React Native (Expo)
├── packages/
│   └── shared/           Shared types & constants
└── GOOGLE_OAUTH_SETUP.md Setup instructions
```

---

## Common Commands

### Development

```bash
# Start all services (from root)
yarn dev:web          # Terminal 1
yarn dev:backend      # Terminal 2

# Or individual
cd apps/web && npm run dev
cd apps/backend && npm run dev
```

### Database

```bash
# Apply migrations
cd apps/backend && npx prisma migrate deploy

# View database
cd apps/backend && npx prisma studio

# Reset database (⚠️ WARNING: Deletes all data)
cd apps/backend && npx prisma migrate reset
```

### Question Management

```bash
# Questions now auto-seed on startup
# No manual commands needed!

# But if you want to manually seed:
cd apps/backend
npm run seed:all-questions

# Check array questions count
npx ts-node --transpile-only src/scripts/checkArraysQuestions.ts

# Cleanup duplicates (if any)
npx ts-node --transpile-only src/scripts/cleanupArraysDuplicates.ts
```

---

## Troubleshooting

### Backend fails to start
```bash
# Check database connection
echo $DATABASE_URL

# Verify PostgreSQL is running
# On Windows: Check Services or Task Manager
```

### Port 3000 already in use
```bash
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <PID> /F
```

### Google OAuth not working
- See [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)
- Clear browser cache: `Ctrl + Shift + Delete`
- Try in incognito window

### Questions not updating
- Backend should auto-seed on startup
- Check backend logs for "Auto-seed complete!"
- If issues persist, run: `npm run seed:all-questions`

---

## Next Steps

1. ✅ Install dependencies: `yarn install`
2. ✅ Set up `.env` files (see Step 2 above)
3. ✅ Start backend: `yarn dev:backend`
4. ✅ Start web: `yarn dev:web`
5. ✅ Fix Google OAuth (if needed)
6. ✅ Access http://localhost:3000

---

## Questions Updated (Auto-Synced)

### Arrays (26 questions)
- Best Time to Buy and Sell Stock
- Chocolate Distribution Problem
- Container With Most Water
- Merge Intervals
- Maximum Subarray (Kadane's Algorithm)
- Rotate Array
- ... and 20 more

### Strings (20 questions)
- Word Wrap
- Boyer Moore Algorithm
- Rabin-Karp Algorithm
- Wildcard String Matching
- Longest Prefix Suffix
- Smallest Window in a String
- Transform One String to Another
- ... and 13 more

**All updates are now automatically visible to everyone!** 🚀

---

For questions or issues, please check the logs or contact the development team.

Happy coding! 💻
