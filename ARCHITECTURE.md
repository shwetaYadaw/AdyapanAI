# ADYAPAN — Architecture Decision: MySQL Only

> **Status**: Enforced ✅  
> **Date**: 2026-07-20  
> **Decision**: All application data is stored in **MySQL via Prisma ORM**. MongoDB/Mongoose is permanently removed.

---

## Database Architecture

| Component | Technology |
|---|---|
| **Primary Database** | MySQL 8.0 |
| **ORM / Query Builder** | Prisma (v5) |
| **Schema Definition** | `apps/backend/prisma/schema.prisma` |
| **Cache** | Redis (Upstash in production) — optional |
| **MongoDB** | ❌ **REMOVED AND BANNED** |

---

## Why MySQL + Prisma?

- **Type safety**: Prisma auto-generates TypeScript types from the schema — no runtime errors from schema drift
- **Relational data model**: Courses → Enrollments → Payments → Certificates all have proper FK relationships
- **Single source of truth**: One schema file defines the entire data model
- **Migrations**: Reproducible, versioned migrations via `prisma migrate`
- **Performance**: MySQL handles relational joins, aggregations, and transactions natively

---

## ❌ MongoDB is BANNED

MongoDB/Mongoose has been **completely removed** from this codebase. This is enforced at **four levels**:

### Level 1 — Package Removal
`mongoose` and `express-mongo-sanitize` are **not** in `apps/backend/package.json`.

### Level 2 — Environment Config
`MONGODB_URI` is **not** a recognized environment variable. The app will not start without `DATABASE_URL` (MySQL).

### Level 3 — Git Pre-commit Hook
`.git/hooks/pre-commit` automatically **rejects commits** containing:
- `import from 'mongoose'`
- `import from '../models/*'` (Mongoose model files)
- `MONGODB_URI=` in any `.env` file
- `"mongoose"` added back to `package.json`
- New files in `src/models/` directory

### Level 4 — CI/CD Workflow
`.github/workflows/ci-backend.yml` runs a **MySQL-Only Architecture Guard** job that **blocks all merges** to `main`/`develop` if any MongoDB artifacts are detected.

---

## How to Work with the Database

### Adding a new data entity

1. **Define the model** in `apps/backend/prisma/schema.prisma`
2. **Run migration**: `npx prisma db push` (dev) or `npx prisma migrate dev` (tracked migration)
3. **Use Prisma client** in services/routes:
   ```typescript
   import { prisma } from '../config/prisma';
   
   const user = await prisma.user.findUnique({ where: { id } });
   ```

### Never do this ❌
```typescript
// NEVER import mongoose
import mongoose from 'mongoose';                     // ❌ BANNED
import User from '../models/user.model';              // ❌ BANNED

// NEVER use Mongoose-style queries
const user = await User.findById(id);                // ❌ BANNED
const users = await User.find({ role: 'student' });  // ❌ BANNED
```

### Always do this ✅
```typescript
import { prisma } from '../config/prisma';

const user = await prisma.user.findUnique({ where: { id } });
const users = await prisma.user.findMany({ where: { role: 'student' } });
```

---

## Running the Architecture Audit

At any time, verify the codebase is MySQL-only:

```bash
yarn check:mysql-only
```

This runs 9 checks and exits with code 1 if anything is wrong.

---

## Environment Variables

The **only** database-related env vars needed:

```env
# Required — MySQL connection for Prisma
DATABASE_URL="mysql://root:password@127.0.0.1:3306/adyapan"

# Required — MySQL connection for direct pool (src/config/mysql.ts)
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=yourpassword
MYSQL_DATABASE=adyapan
```

`MONGODB_URI` is **not read, not required, and should not exist** in any `.env` file.
