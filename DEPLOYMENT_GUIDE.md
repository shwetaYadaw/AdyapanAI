# Deployment Guide - Dynamic Topic Management System

## 📋 Pre-Deployment Checklist

- [ ] All code committed and pushed
- [ ] Database backup created
- [ ] Tests completed and passed
- [ ] Documentation reviewed
- [ ] Admin training completed

---

## 🚀 Deployment Steps

### Step 1: Backend Deployment

#### 1.1 Update Environment Variables (if needed)
```bash
# Verify DATABASE_URL in production .env
echo $DATABASE_URL
```

#### 1.2 Apply Database Migration
```bash
cd apps/backend

# Option A: Using Prisma migrate deploy (production)
npx prisma migrate deploy

# Option B: Using Prisma migrate dev (development)
npx prisma migrate dev --name "add_topic_management"
```

**Expected Output:**
```
✔ Applied: 20260802_add_topic_management
```

#### 1.3 Generate Prisma Client
```bash
npx prisma generate
```

#### 1.4 Verify Schema Updated
```bash
npx prisma studio
# Open browser to http://localhost:5555
# Check for "Topic" table in sidebar
```

#### 1.5 Build Backend
```bash
npm run build
```

**Expected:**
- No TypeScript errors
- Build output in `dist/` directory

#### 1.6 Start/Restart Backend
```bash
# Development
npm run dev

# Production
npm start
```

**Check logs for:**
```
✅ Topic admin routes registered
✨ Auto-seed complete!
```

---

### Step 2: Frontend Deployment

#### 2.1 Update Environment Variables (if needed)
```bash
cd apps/web

# Verify REACT_APP_API_URL points to backend
echo $REACT_APP_API_URL
# Should be: http://localhost:5000/api/v1 (dev) or production URL
```

#### 2.2 Build Frontend
```bash
npm run build
```

**Expected:**
- No TypeScript errors
- Build output in `dist/` directory

#### 2.3 Start/Restart Frontend
```bash
# Development
npm run dev

# Production
npm start
# or use: npx serve -s dist
```

**Check logs for:**
- Hot reload working
- No console errors
- API calls successful

---

### Step 3: Seed Initial Topics (Optional)

#### 3.1 Via API
```bash
curl -X POST "http://localhost:5000/api/v1/admin/topics/bulk/seed" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Seeded 55 topics, skipped 0",
  "data": {
    "created": 55,
    "skipped": 0
  }
}
```

#### 3.2 Via Script
```bash
cd apps/backend
npx ts-node scripts/seed-topics.ts
```

**Expected Output:**
```
🌱 Seeding topics for all systems...
✅ Created: 55
⏭️  Skipped: 0
📊 Total: 55
🎉 Seeding complete!
```

---

### Step 4: Verify Deployment

#### 4.1 Check Backend Health
```bash
curl http://localhost:5000/api/v1/health
```

**Expected:**
```json
{
  "status": "ok",
  "timestamp": "2026-08-02T..."
}
```

#### 4.2 Check Topics API
```bash
curl "http://localhost:5000/api/v1/admin/topics?system=coding-arena" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Expected:**
```json
{
  "success": true,
  "data": [ /* topics array */ ]
}
```

#### 4.3 Test Frontend Access
1. Open `http://localhost:3000/admin`
2. Click "Manage Topics"
3. Verify modal opens
4. Add test topic and confirm it appears

---

## 🐳 Docker Deployment

### Backend Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/

RUN npm ci --workspace=backend

COPY apps/backend ./apps/backend
COPY prisma ./prisma

RUN npx prisma generate

EXPOSE 5000

CMD ["npm", "start", "--workspace=backend"]
```

### Frontend Dockerfile
```dockerfile
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
COPY apps/web/package*.json ./apps/web/

RUN npm ci --workspace=web

COPY apps/web ./apps/web

ENV REACT_APP_API_URL=http://backend:5000/api/v1

RUN npm run build --workspace=web

FROM nginx:alpine

COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose
```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: apps/backend/Dockerfile
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: production
      DATABASE_URL: ${DATABASE_URL}
      DIRECT_URL: ${DIRECT_URL}
      REDIS_URL: ${REDIS_URL}
      JWT_ACCESS_SECRET: ${JWT_ACCESS_SECRET}
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}
    depends_on:
      - postgres
    networks:
      - app

  frontend:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    ports:
      - "3000:80"
    environment:
      REACT_APP_API_URL: http://backend:5000/api/v1
    depends_on:
      - backend
    networks:
      - app

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app

volumes:
  postgres_data:

networks:
  app:
```

---

## ☁️ Cloud Deployment

### Vercel (Frontend)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd apps/web
vercel --prod

# Set environment variables in Vercel dashboard
# REACT_APP_API_URL=https://api.yourdomain.com/api/v1
```

### Railway (Backend)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up

# Set variables in Railway dashboard
```

### Supabase (Database)
- Already configured in `.env`
- Migration runs automatically with `prisma migrate deploy`

---

## 🔄 Migration Rollback (If Needed)

### Rollback Database
```bash
cd apps/backend

# View migration history
npx prisma migrate status

# Rollback to previous migration
npx prisma migrate resolve --rolled-back "20260802_add_topic_management"
```

### Revert Code Changes
```bash
git revert <commit-hash>
```

---

## 📊 Post-Deployment Monitoring

### Check Logs
```bash
# Backend
tail -f apps/backend/logs/app.log

# Frontend (if using)
tail -f apps/web/logs/app.log
```

### Monitor Database
```bash
# Connect to database
psql $DATABASE_URL

# Check Topic table
SELECT * FROM "Topic";
SELECT COUNT(*) FROM "Topic";
```

### Performance Monitoring
- Check API response times
- Monitor database queries
- Watch server CPU/memory usage
- Track error rates

---

## ✅ Post-Deployment Checklist

- [ ] Database migration applied successfully
- [ ] Prisma client generated
- [ ] Backend compiles without errors
- [ ] Frontend compiles without errors
- [ ] Topics API endpoints working
- [ ] Topic dropdown populated in question forms
- [ ] Can create topics via admin UI
- [ ] Can create questions with topics
- [ ] Topics persist across restarts
- [ ] No console errors
- [ ] Admin authentication working
- [ ] Database backups created

---

## 🔐 Security Verification

- [ ] Admin authentication required for all topic operations
- [ ] JWT tokens validated on backend
- [ ] SQL injection prevention (using Prisma ORM)
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Input validation on backend
- [ ] Error messages don't leak sensitive data

---

## 📞 Troubleshooting

### Migration Fails
```bash
# Check migration status
npx prisma migrate status

# If stuck, mark as resolved
npx prisma migrate resolve --rolled-back "20260802_add_topic_management"

# Try again
npx prisma migrate dev
```

### Topics API Returns 404
```bash
# Check if route is registered in app.ts
grep "topicAdminRoutes" apps/backend/src/app.ts

# Check if middleware is applied
curl -v http://localhost:5000/api/v1/admin/topics
```

### Topics Don't Appear in Dropdown
```bash
# Check browser console (F12)
# Check network tab - API call to /admin/topics
# Verify isActive = true in database

SELECT * FROM "Topic" WHERE system = 'coding-arena' AND "isActive" = true;
```

### Database Connection Error
```bash
# Verify DATABASE_URL
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1;"

# Check Prisma configuration
cat apps/backend/prisma/.env
```

---

## 📈 Scaling Considerations

### Database Indexes
Topics table already has indexes on:
- `system` (for filtering)
- `(isActive, system)` (for active topics query)

### Query Optimization
- Topics are cached in UI (no refetch unless needed)
- Pagination not needed (topics count is small)
- Consider Redis caching for frequent queries

### Load Testing
```bash
# Test with Apache Bench
ab -n 1000 -c 100 "http://localhost:5000/api/v1/admin/topics?system=coding-arena"

# Test with autocannon
npx autocannon "http://localhost:5000/api/v1/admin/topics?system=coding-arena" -d 30
```

---

## 📝 Documentation Updates

Update these if deploying to production:
- [ ] API documentation
- [ ] Admin handbook
- [ ] Release notes
- [ ] Change log
- [ ] System architecture diagram

---

## 🎉 Deployment Complete!

Your Dynamic Topic Management System is now deployed. 

**Next Steps:**
1. Train admins on using the system
2. Monitor for issues
3. Gather feedback
4. Plan future enhancements

**Support Resources:**
- ADMIN_QUICK_START.md - Admin guide
- TOPIC_MANAGEMENT_GUIDE.md - Detailed documentation
- TESTING_CHECKLIST.md - Testing reference

---

**Deployed By:** ___________________
**Deployment Date:** ________________
**Version:** 1.0
**Status:** ✅ Live
