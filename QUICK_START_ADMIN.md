# 🚀 Quick Start - Admin Access (UPDATED!)

## ⚠️ IMPORTANT CHANGE!

Admins now use the **same login page as everyone else**. No separate admin login!

---

## Admin Login

### Login URL (For Everyone)
```
http://localhost:3000/login
```

### Admin Credentials
```
Email:    admin@adyapan.com  
Password: Admin@123
```

### How It Works
1. Go to `/login` (main login page)
2. Enter your admin credentials
3. Click "Sign In"
4. **Automatically redirected** to `/admin/dashboard` ✅

The system detects your admin role and redirects you automatically!

---

## Admin Dashboard Features

After login, you'll see:

### 📊 Overview Tab (Active)
- Total Students count
- Active Courses count
- Total Coding Problems
- Today's Submissions
- Active Students (last 7 days)

### 👥 Students Tab
- Student management (coming soon)

### 📚 Content Tab
- Course creation (coming soon)

### 💻 Problems Tab
- Coding problem management (coming soon)

### ⚙️ Settings Tab
- Platform settings (coming soon)

---

## Troubleshooting

### Can't Login?
1. Make sure you're at `/login` (not `/admin/login`)
2. Check backend is running: `http://localhost:3000/api/v1/auth/login`
3. Verify credentials are correct
4. Check browser console for errors

### Stats Not Loading?
1. Check backend logs
2. Verify database connection
3. Ensure `/api/admin/stats` endpoint is accessible

### Redirected Back to Login?
- Your session expired
- Login again with credentials above

---

## Admin Management Scripts

```bash
cd apps/backend

# Check admin users
npm run check:admin

# Reset password to Admin@123
npm run reset:admin

# Verify password works
npm run verify:admin

# Create new admin
npm run create:admin
```

---

## What Changed?

### ❌ Removed:
- Separate `/admin/login` page
- "Admin" link in footer
- Duplicate login logic

### ✅ Now Using:
- Single `/login` page for all users
- Automatic role-based redirect
- Cleaner, simpler UX

---

## Security Note

⚠️ **Change the default password after first login!**

The unified login is actually **more secure** because:
- No obvious admin entry point
- Harder for attackers to find
- Same security policies for all users

---

**Last Updated**: Unified Login Implementation  
**Status**: ✅ Fully Working  
**Login URL**: `/login` (for all users including admins)
