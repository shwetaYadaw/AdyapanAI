# 🚀 Migration Guide: MySQL to Supabase (PostgreSQL)

This guide will help you migrate the ADYAPAN project from MySQL to Supabase PostgreSQL.

---

## ✅ Changes Made

1. **Prisma Schema Updated**: Changed from `mysql` to `postgresql` provider
2. **Environment Variables**: Removed MySQL vars, added Supabase connection strings
3. **MySQL Config**: Updated `mysql.ts` to be a no-op (kept for backward compatibility)
4. **Environment Config**: Removed MySQL-specific env vars from `env.ts`

---

## 📋 Step-by-Step Migration

### Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: `adyapan` (or your choice)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is sufficient for development

5. Wait for the project to be created (2-3 minutes)

### Step 2: Get Your Connection Strings

1. In your Supabase dashboard, go to **Settings** → **Database**
2. Scroll to **Connection string** section
3. You'll need two connection strings:

   **A. Connection Pooling (Transaction Mode)** - for your app:
   ```
   postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```

   **B. Direct Connection** - for migrations:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   ```

### Step 3: Update Your `.env` File

Open `apps/backend/.env` and update the database section:

```env
# ── Database (Supabase PostgreSQL) ──────────────────────────────────────────
# Connection pooling URL (for serverless/edge functions)
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"

# Direct connection URL (for migrations and Prisma Studio)
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

**Important**: Replace:
- `[YOUR-PROJECT-REF]` - Your Supabase project reference (e.g., `abcdefghijklmnop`)
- `[YOUR-PASSWORD]` - Your database password
- `[REGION]` - Your region (e.g., `ap-south-1`, `us-east-1`)

**Example**:
```env
DATABASE_URL="postgresql://postgres.abcdefghijklmnop:MySecurePass123@aws-0-ap-south-1.pooler.supabase.com:6543/postgres"
DIRECT_URL="postgresql://postgres:MySecurePass123@db.abcdefghijklmnop.supabase.co:5432/postgres"
```

### Step 4: Generate Prisma Client

```bash
cd apps/backend
npx prisma generate
```

### Step 5: Push Schema to Supabase

This will create all the tables in your Supabase database:

```bash
npx prisma db push
```

You should see output like:
```
✔ Generated Prisma Client
✔ Database now in sync with schema
```

### Step 6: (Optional) Seed Initial Data

If you have seed scripts:

```bash
npm run seed
```

Or individually:
```bash
npm run seed:challenges
npm run seed:tcs
```

### Step 7: Verify Database Connection

Start your backend server:

```bash
cd ../..
yarn dev:backend
```

You should see:
```
✅ MySQL (Prisma) connected successfully
✅ Using PostgreSQL (Supabase) - MySQL adapter not needed
```

---

## 🔍 Verify in Supabase Dashboard

1. Go to **Table Editor** in your Supabase dashboard
2. You should see all your tables created:
   - User
   - StudentProfile
   - Course
   - Enrollment
   - Payment
   - Certificate
   - etc.

---

## 🎯 Key Differences: MySQL vs PostgreSQL

### 1. **JSON Fields**
- MySQL: Uses `JSON` type
- PostgreSQL: Uses `JSONB` type (more efficient)
- Prisma handles this automatically ✅

### 2. **UUID Generation**
- MySQL: `@default(uuid())` uses MySQL's UUID function
- PostgreSQL: Uses `gen_random_uuid()` function
- Prisma handles this automatically ✅

### 3. **Text Fields**
- MySQL: `@db.Text`
- PostgreSQL: `@db.Text` (same syntax)
- No changes needed ✅

### 4. **Indexes**
- PostgreSQL supports more advanced indexes (GIN, GiST)
- Consider adding for JSON fields and full-text search later

---

## 🚨 Common Issues & Solutions

### Issue 1: "Can't reach database server"
**Solution**: Check your connection string. Make sure:
- Password is correct
- No typos in project reference
- Port numbers are correct (6543 for pooler, 5432 for direct)

### Issue 2: "SSL/TLS connection required"
**Solution**: Add `?sslmode=require` to your connection string:
```
DATABASE_URL="postgresql://...?sslmode=require"
```

### Issue 3: "Prepared statement already exists"
**Solution**: Use the transaction mode connection pooler (port 6543, not 5432)

### Issue 4: "Too many connections"
**Solution**: 
- Use connection pooling URL for your app
- Use direct URL only for migrations
- Check Supabase dashboard → Database → Connection pooling

---

## 📊 Database Administration

### View Logs
Supabase Dashboard → **Database** → **Logs**

### Run SQL Queries
Supabase Dashboard → **SQL Editor**

Example:
```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Count users
SELECT COUNT(*) FROM "User";
```

### Prisma Studio (Visual Database Browser)
```bash
cd apps/backend
npx prisma studio
```

---

## 🔐 Security Best Practices

1. **Never commit `.env` files** - Already in `.gitignore` ✅
2. **Use Row Level Security (RLS)** in Supabase for sensitive tables
3. **Enable connection pooling** for production
4. **Use `DIRECT_URL` only for migrations**, not in production app
5. **Rotate database passwords** regularly
6. **Enable Supabase Auth** if you want to use their authentication features

---

## 📦 Deployment Considerations

### Vercel / Netlify
- Use `DATABASE_URL` (pooled connection)
- Set environment variables in platform settings

### Railway / Render
- Use `DATABASE_URL` (pooled connection)
- Add to environment variables

### Docker
- Add to `docker-compose.yml` environment section

---

## 🔄 Rollback (If Needed)

If you need to go back to MySQL:

1. Revert Prisma schema:
   ```prisma
   datasource db {
     provider = "mysql"
     url      = env("DATABASE_URL")
   }
   ```

2. Update `.env`:
   ```env
   DATABASE_URL="mysql://root:password@localhost:3306/adyapan"
   ```

3. Regenerate Prisma Client:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

---

## ✅ Checklist

- [ ] Created Supabase project
- [ ] Copied connection strings
- [ ] Updated `apps/backend/.env`
- [ ] Ran `npx prisma generate`
- [ ] Ran `npx prisma db push`
- [ ] Verified tables in Supabase dashboard
- [ ] Started backend server successfully
- [ ] Tested login/signup functionality
- [ ] (Optional) Ran seed scripts

---

## 🆘 Need Help?

- **Supabase Docs**: https://supabase.com/docs
- **Prisma PostgreSQL Guide**: https://www.prisma.io/docs/concepts/database-connectors/postgresql
- **Connection Issues**: Check Supabase Dashboard → Database → Connection Pooling

---

## 🎉 Success!

Once you complete these steps, your ADYAPAN project will be running on Supabase PostgreSQL instead of MySQL!

**Benefits**:
- ✅ No local MySQL installation needed
- ✅ Free tier with generous limits
- ✅ Built-in authentication (optional)
- ✅ Real-time subscriptions
- ✅ Auto-generated APIs
- ✅ Built-in storage for files
- ✅ Better JSON support with JSONB
- ✅ Advanced indexing capabilities

Happy coding! 🚀
