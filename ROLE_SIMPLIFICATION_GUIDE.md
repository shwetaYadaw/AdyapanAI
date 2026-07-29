# 🎯 Role Simplification - Student & Admin Only

## Changes Made

The system now supports **only 2 roles**:
- **student** - Regular users learning on the platform
- **admin** - Administrators managing the platform

## What Was Removed

### ❌ Removed Roles:
- ~~teacher~~
- ~~mentor~~
- ~~recruiter~~  
- ~~superadmin~~

### ❌ Removed Routes:
- ~~`/teacher/*`~~
- ~~`/mentor/*`~~
- ~~`/recruiter/*`~~

### ❌ Removed Pages:
- All teacher dashboard pages
- All mentor dashboard pages
- All recruiter dashboard pages

---

## Updated Files

### 1. Frontend

#### `apps/web/src/router/AppRouter.tsx`
```typescript
// BEFORE: 6 role sections
- Student routes ✅ (kept)
- Teacher routes ❌ (removed)
- Mentor routes ❌ (removed)
- Recruiter routes ❌ (removed)
- Admin routes ✅ (kept)

// AFTER: 2 role sections
- Student routes ✅
- Admin routes ✅
```

#### `apps/web/src/pages/auth/LoginPage.tsx`
```typescript
// BEFORE: Complex redirect map
const redirectMap = {
  student: '/student/dashboard',
  teacher: '/teacher/dashboard',
  mentor: '/mentor/dashboard',
  recruiter: '/recruiter/dashboard',
  admin: '/admin/dashboard',
};

// AFTER: Simple logic
const redirectPath = role === 'admin' 
  ? '/admin/dashboard' 
  : '/student/dashboard';
```

### 2. Backend

#### `apps/backend/src/controllers/auth.controller.ts`
```typescript
// BEFORE: 
role: z.enum(['student', 'teacher', 'recruiter'])

// AFTER:
role: z.enum(['student', 'admin'])
```

#### `apps/backend/src/routes/admin.routes.ts`
```typescript
// BEFORE:
authorize('admin', 'superadmin')

// AFTER:
authorize('admin')
```

### 3. Shared Constants

#### `packages/shared/src/constants/roles.ts`
```typescript
// BEFORE:
export const ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  MENTOR: 'mentor',
  RECRUITER: 'recruiter',
  ADMIN: 'admin',
  SUPER_ADMIN: 'superadmin',
};

// AFTER:
export const ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin',
};
```

---

## Database Changes Needed

### Update Existing Users

Run this SQL to migrate existing users to the new role system:

```sql
-- Option 1: Convert all non-student/admin roles to student
UPDATE "User" 
SET role = 'student' 
WHERE role IN ('teacher', 'mentor', 'recruiter', 'superadmin');

-- Option 2: Convert superadmin to admin
UPDATE "User" 
SET role = 'admin' 
WHERE role = 'superadmin';

-- Option 3: Keep teacher/mentor/recruiter data but change role
-- (They can still login but will be treated as students)
```

### Check Current Role Distribution

```sql
SELECT role, COUNT(*) as count 
FROM "User" 
GROUP BY role;
```

---

## Migration Script

Create and run this script:

```bash
cd apps/backend
npx ts-node scripts/migrate-roles.ts
```

Script content (`apps/backend/scripts/migrate-roles.ts`):

```typescript
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function migrateRoles() {
  try {
    // Get current role distribution
    const roles = await prisma.user.groupBy({
      by: ['role'],
      _count: true,
    });

    console.log('Current role distribution:');
    roles.forEach(r => {
      console.log(`  ${r.role}: ${r._count}`);
    });

    // Update superadmin to admin
    const superAdminUpdated = await prisma.user.updateMany({
      where: { role: 'superadmin' },
      data: { role: 'admin' },
    });

    console.log(`\nConverted ${superAdminUpdated.count} superadmins to admin`);

    // Update teacher/mentor/recruiter to student
    const otherRolesUpdated = await prisma.user.updateMany({
      where: { 
        role: { in: ['teacher', 'mentor', 'recruiter'] }
      },
      data: { role: 'student' },
    });

    console.log(`Converted ${otherRolesUpdated.count} other roles to student`);

    // Show final distribution
    const finalRoles = await prisma.user.groupBy({
      by: ['role'],
      _count: true,
    });

    console.log('\nFinal role distribution:');
    finalRoles.forEach(r => {
      console.log(`  ${r.role}: ${r._count}`);
    });

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateRoles();
```

---

## Testing

### 1. Test Student Login
```
Email: student@example.com
Password: Student@123

Expected: Redirect to /student/dashboard ✅
```

### 2. Test Admin Login
```
Email: admin@adyapan.com
Password: Admin@123

Expected: Redirect to /admin/dashboard ✅
```

### 3. Test Registration
```
Sign up form should only allow:
- Role: student (default)
- Admin accounts created via script only
```

---

## Benefits

### ✅ Simplified System
- 2 roles instead of 6
- Easier to understand
- Less code to maintain

### ✅ Cleaner Codebase
- Removed unused routes
- Removed unused components
- Simplified auth logic

### ✅ Better Performance
- Fewer routes to check
- Simpler role validation
- Faster navigation logic

### ✅ Easier Onboarding
- New developers understand quickly
- Less confusion about role hierarchy
- Clear separation: users vs admins

---

## Future Considerations

If you need to add roles back later:

### Option 1: Add Role Type Column
```sql
ALTER TABLE "User" ADD COLUMN role_type VARCHAR(50);

-- student_basic, student_premium, etc.
-- admin_support, admin_super, etc.
```

### Option 2: Add Permissions Table
```sql
CREATE TABLE "UserPermission" (
  userId VARCHAR REFERENCES "User"(id),
  permission VARCHAR,
  PRIMARY KEY (userId, permission)
);
```

### Option 3: Add Groups
```sql
CREATE TABLE "UserGroup" (
  id VARCHAR PRIMARY KEY,
  name VARCHAR,
  permissions JSON
);

-- User can belong to multiple groups
```

---

## Rollback Plan

If you need to restore old roles:

1. Keep backup of old database
2. Restore from backup
3. Revert code changes:
   ```bash
   git revert <commit-hash>
   ```

---

## Summary

### Before:
- 6 roles: student, teacher, mentor, recruiter, admin, superadmin
- Complex routing and permissions
- Multiple dashboards to maintain

### After:
- 2 roles: **student**, **admin**
- Simple routing: student OR admin
- Two dashboards: student & admin
- Cleaner, faster, easier to maintain

---

**Status**: ✅ Code Updated  
**Next Step**: Run database migration script  
**Impact**: Non-breaking for student and admin users
