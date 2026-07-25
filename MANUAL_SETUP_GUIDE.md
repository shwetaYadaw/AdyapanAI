# AdyapanAI DSA Problems - Manual Setup & Execution Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Setup](#database-setup)
4. [Project Installation](#project-installation)
5. [Running Individual Scripts](#running-individual-scripts)
6. [Running All Scripts](#running-all-scripts)
7. [Verification & Testing](#verification--testing)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MySQL** (v5.7 or higher) - [Download](https://dev.mysql.com/downloads/mysql/)
- **Git** (optional, for version control)
- **Visual Studio Code** (recommended editor)
- **PowerShell** or **Command Prompt** (Windows terminal)

### Verify Installation
```powershell
# Check Node.js version
node --version

# Check npm version
npm --version

# Check MySQL version (if MySQL is in PATH)
mysql --version
```

---

## Environment Setup

### Step 1: Navigate to Project Directory

```powershell
# Navigate to the backend directory
cd "c:\Users\HP\Downloads\AdyapanAI\apps\backend"

# Verify you're in the right directory
pwd  # Should show: c:\Users\HP\Downloads\AdyapanAI\apps\backend
```

### Step 2: Create .env File

1. **Copy the .env.example file:**
```powershell
# Copy .env.example to .env
Copy-Item .env.example -Destination .env
```

2. **Edit .env file with your MySQL credentials:**

Open `.env` in VS Code and update these key variables:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000

# Database Configuration (IMPORTANT!)
DATABASE_URL="mysql://root:your_password@127.0.0.1:3306/adyapan"

# MySQL Connection Details
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=adyapan

# JWT Secrets (can be any random string > 32 chars)
JWT_ACCESS_SECRET=your_access_secret_min_32_chars_long_string
JWT_REFRESH_SECRET=your_refresh_secret_min_32_chars_long_string
```

**Important:** Replace `your_password` with your actual MySQL root password.

---

## Database Setup

### Step 1: Create MySQL Database

```powershell
# Open MySQL Command Line
mysql -u root -p

# When prompted, enter your MySQL password
# Then run these commands:

CREATE DATABASE adyapan;
USE adyapan;
```

Or use this one-liner:
```powershell
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS adyapan;"
```

### Step 2: Run Prisma Migrations

```powershell
# Navigate to backend directory
cd "c:\Users\HP\Downloads\AdyapanAI\apps\backend"

# Run Prisma migrations to create tables
npx prisma migrate deploy

# Or use db push if no migrations exist
npx prisma db push
```

### Step 3: Verify Database Connection

```powershell
# Test Prisma connection
npx prisma studio

# This opens a web interface showing your database
# Close it with Ctrl+C when done
```

---

## Project Installation

### Step 1: Install Dependencies

```powershell
# Navigate to backend directory
cd "c:\Users\HP\Downloads\AdyapanAI\apps\backend"

# Install all npm packages
npm install

# Wait for installation to complete (takes 2-5 minutes)
```

### Step 2: Verify Installation

```powershell
# Check if node_modules was created
ls node_modules | head -10

# Check if prisma was installed
npx prisma --version
```

---

## Running Individual Scripts

### Overview of Available Scripts

All DSA problem scripts are located in:
```
c:\Users\HP\Downloads\AdyapanAI\apps\backend\src\scripts\
```

**Phase 1: Cleanup Scripts**
- `checkDbCount.ts` - Check current database count
- `identifyExtraProblems.ts` - Find extra/duplicate problems
- `finalCleanup.ts` - Delete extra problems

**Phase 2: Update Scripts (4 problems)**
- `updateJumpGameProblem.ts` - Update Jump Game
- `updateJumpGameIIProblem.ts` - Update Jump Game II
- `updateGasStationProblem.ts` - Update Gas Station
- `updateMinimizeCashFlowProblem.ts` - Update Minimize Cash Flow

**Phase 3: Create Scripts (6 new problems)**
- `updateMinimumAbsoluteSumDifferenceProblem.ts`
- `updateMinArrowsForBalloonsProblems.ts`
- `updateMaxEqualSumThreeStacksProblem.ts`
- `updateMinCostCoinsKExtraProblem.ts`
- `updateMinCoinsSpecificDenominationsProblem.ts`
- `updateMaxHeightStackingCuboidsProblem.ts`

**Verification Scripts**
- `verifyUpdates.ts` - Verify updated problems
- `verifyAllProblems.ts` - Verify all 10 problems
- `showUpdatedContent.ts` - Display sample problem content

---

### Running Individual Scripts

#### Format:
```powershell
npx ts-node --transpile-only src/scripts/<SCRIPT_NAME>.ts
```

#### Examples:

**1. Check Database Count**
```powershell
cd "c:\Users\HP\Downloads\AdyapanAI\apps\backend"
npx ts-node --transpile-only src/scripts/checkDbCount.ts
```

**2. Verify All Problems (Recommended First Step)**
```powershell
npx ts-node --transpile-only src/scripts/verifyAllProblems.ts
```

**3. Update Jump Game Problem**
```powershell
npx ts-node --transpile-only src/scripts/updateJumpGameProblem.ts
```

**4. Create Minimum Absolute Sum Difference Problem**
```powershell
npx ts-node --transpile-only src/scripts/updateMinimumAbsoluteSumDifferenceProblem.ts
```

**5. Show Updated Content Sample**
```powershell
npx ts-node --transpile-only src/scripts/showUpdatedContent.ts
```

---

## Running All Scripts

### Recommended Execution Order

If running from scratch, follow this order:

#### **Step 1: Cleanup Phase (Optional - only if database has extras)**
```powershell
cd "c:\Users\HP\Downloads\AdyapanAI\apps\backend"

# Check current status
npx ts-node --transpile-only src/scripts/checkDbCount.ts

# If extra problems found, run cleanup
npx ts-node --transpile-only src/scripts/finalCleanup.ts

# Verify cleanup
npx ts-node --transpile-only src/scripts/checkDbCount.ts
```

#### **Step 2: Update Phase (4 existing problems)**
```powershell
# Update Jump Game
npx ts-node --transpile-only src/scripts/updateJumpGameProblem.ts

# Update Jump Game II
npx ts-node --transpile-only src/scripts/updateJumpGameIIProblem.ts

# Update Gas Station
npx ts-node --transpile-only src/scripts/updateGasStationProblem.ts

# Update Minimize Cash Flow
npx ts-node --transpile-only src/scripts/updateMinimizeCashFlowProblem.ts
```

#### **Step 3: Create Phase (6 new problems)**
```powershell
# Create new problems
npx ts-node --transpile-only src/scripts/updateMaxHeightStackingCuboidsProblem.ts
npx ts-node --transpile-only src/scripts/updateMinimumAbsoluteSumDifferenceProblem.ts
npx ts-node --transpile-only src/scripts/updateMinArrowsForBalloonsProblems.ts
npx ts-node --transpile-only src/scripts/updateMinCoinsSpecificDenominationsProblem.ts
npx ts-node --transpile-only src/scripts/updateMaxEqualSumThreeStacksProblem.ts
npx ts-node --transpile-only src/scripts/updateMinCostCoinsKExtraProblem.ts
```

#### **Step 4: Verification Phase**
```powershell
# Verify all problems
npx ts-node --transpile-only src/scripts/verifyAllProblems.ts

# Show sample content
npx ts-node --transpile-only src/scripts/showUpdatedContent.ts
```

### Create Batch Script (Windows)

Create a file named `run-all-dsa-problems.ps1`:

```powershell
# Save this as: c:\Users\HP\Downloads\AdyapanAI\apps\backend\run-all-dsa-problems.ps1

cd "c:\Users\HP\Downloads\AdyapanAI\apps\backend"

Write-Host "🚀 Starting DSA Problems Enhancement Process..." -ForegroundColor Green
Write-Host ""

# Phase 1: Cleanup
Write-Host "📋 Phase 1: Database Cleanup" -ForegroundColor Cyan
Write-Host "Checking database count..." -ForegroundColor Yellow
npx ts-node --transpile-only src/scripts/checkDbCount.ts
Write-Host ""

# Phase 2: Updates
Write-Host "🔄 Phase 2: Updating Existing Problems" -ForegroundColor Cyan

Write-Host "Updating Jump Game..." -ForegroundColor Yellow
npx ts-node --transpile-only src/scripts/updateJumpGameProblem.ts

Write-Host "Updating Jump Game II..." -ForegroundColor Yellow
npx ts-node --transpile-only src/scripts/updateJumpGameIIProblem.ts

Write-Host "Updating Gas Station..." -ForegroundColor Yellow
npx ts-node --transpile-only src/scripts/updateGasStationProblem.ts

Write-Host "Updating Minimize Cash Flow..." -ForegroundColor Yellow
npx ts-node --transpile-only src/scripts/updateMinimizeCashFlowProblem.ts

# Phase 3: Creation
Write-Host ""
Write-Host "✨ Phase 3: Creating New Problems" -ForegroundColor Cyan

Write-Host "Creating Maximum Height Stacking Cuboids..." -ForegroundColor Yellow
npx ts-node --transpile-only src/scripts/updateMaxHeightStackingCuboidsProblem.ts

Write-Host "Creating Minimum Absolute Sum Difference..." -ForegroundColor Yellow
npx ts-node --transpile-only src/scripts/updateMinimumAbsoluteSumDifferenceProblem.ts

Write-Host "Creating Minimum Arrows to Burst Balloons..." -ForegroundColor Yellow
npx ts-node --transpile-only src/scripts/updateMinArrowsForBalloonsProblems.ts

Write-Host "Creating Minimum Coins with Specific Denominations..." -ForegroundColor Yellow
npx ts-node --transpile-only src/scripts/updateMinCoinsSpecificDenominationsProblem.ts

Write-Host "Creating Maximum Equal Sum of Three Stacks..." -ForegroundColor Yellow
npx ts-node --transpile-only src/scripts/updateMaxEqualSumThreeStacksProblem.ts

Write-Host "Creating Minimum Cost Coins with K Extra..." -ForegroundColor Yellow
npx ts-node --transpile-only src/scripts/updateMinCostCoinsKExtraProblem.ts

# Phase 4: Verification
Write-Host ""
Write-Host "✅ Phase 4: Verification" -ForegroundColor Cyan

Write-Host "Verifying all problems..." -ForegroundColor Yellow
npx ts-node --transpile-only src/scripts/verifyAllProblems.ts

Write-Host ""
Write-Host "🎉 Process Complete!" -ForegroundColor Green
Write-Host "Database has been updated with 10 comprehensive DSA problems." -ForegroundColor Green
```

**Run the batch script:**
```powershell
cd "c:\Users\HP\Downloads\AdyapanAI\apps\backend"
.\run-all-dsa-problems.ps1
```

---

## Verification & Testing

### Check Results After Running

```powershell
cd "c:\Users\HP\Downloads\AdyapanAI\apps\backend"

# 1. Check database count
npx ts-node --transpile-only src/scripts/checkDbCount.ts

# Expected output: Total problems: 541 (or your target count)

# 2. Verify specific problems
npx ts-node --transpile-only src/scripts/verifyUpdates.ts

# Expected: All 4 updated problems shown with content details

# 3. View comprehensive statistics
npx ts-node --transpile-only src/scripts/verifyAllProblems.ts

# Expected: All 10 problems (4 updated + 6 new) with complete details
```

### Database Inspection

```powershell
# Open Prisma Studio (visual database inspector)
npx prisma studio

# This opens http://localhost:5555 in your browser
# You can browse and edit data visually
# Press Ctrl+C to close
```

### Query Problems Directly

Create a file `query-problems.ts`:

```typescript
import { prisma } from './src/config/prisma';

async function queryProblems() {
  try {
    // Count total
    const total = await prisma.question.count();
    console.log('Total problems:', total);

    // Find by slug
    const jumpGame = await prisma.question.findFirst({
      where: { slug: 'jump-game' },
      select: { id: true, title: true, difficulty: true, xpReward: true }
    });
    console.log('Jump Game:', jumpGame);

    // Find recently created
    const recent = await prisma.question.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { title: true, difficulty: true, createdAt: true }
    });
    console.log('Recent problems:', recent);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

queryProblems();
```

Run it:
```powershell
npx ts-node --transpile-only query-problems.ts
```

---

## Troubleshooting

### Issue 1: "Cannot find module '@prisma/client'"

**Solution:**
```powershell
npm install
npx prisma generate
```

### Issue 2: "Connection refused" or database errors

**Solution:**
```powershell
# Verify MySQL is running
# Windows: Check Services (services.msc) for MySQL service

# Or restart MySQL:
net stop mysql80  # Stop
net start mysql80  # Start

# Verify DATABASE_URL in .env is correct
cat .env | findstr DATABASE_URL

# Test connection
npx prisma db execute --stdin "SELECT 1;"
```

### Issue 3: "ENOENT: no such file or directory"

**Solution:**
```powershell
# Make sure you're in the right directory
pwd

# Should show: C:\Users\HP\Downloads\AdyapanAI\apps\backend

# If not, navigate there:
cd "c:\Users\HP\Downloads\AdyapanAI\apps\backend"
```

### Issue 4: TypeScript errors

**Solution:**
```powershell
# Clear TypeScript cache
rm -r node_modules/.cache -Force

# Reinstall dependencies
npm install

# Try running script again
npx ts-node --transpile-only src/scripts/checkDbCount.ts
```

### Issue 5: "port 5555 already in use" (when running prisma studio)

**Solution:**
```powershell
# Kill process on port 5555
netstat -ano | findstr :5555  # Find PID
taskkill /PID <PID> /F         # Kill process

# Or use different port
npx prisma studio --port 5556
```

### Issue 6: Permission Denied

**Solution:**
```powershell
# Run PowerShell as Administrator
# Right-click PowerShell → "Run as Administrator"

# Or run individual commands with admin rights
Start-Process powershell -ArgumentList "-Command npx ts-node --transpile-only src/scripts/checkDbCount.ts" -Verb runAs
```

---

## Quick Reference Commands

### Essential Commands

```powershell
# Navigate to project
cd "c:\Users\HP\Downloads\AdyapanAI\apps\backend"

# Install dependencies
npm install

# Check database
npx ts-node --transpile-only src/scripts/checkDbCount.ts

# Run single script (replace <SCRIPT>)
npx ts-node --transpile-only src/scripts/<SCRIPT>.ts

# Open Prisma Studio
npx prisma studio

# Create database
npx prisma db push

# View logs
npm run dev
```

### Verification Steps

```powershell
# 1. Check if Node is installed
node --version

# 2. Check if npm packages are installed
npm list

# 3. Check if database exists
npx prisma studio

# 4. Run verification script
npx ts-node --transpile-only src/scripts/verifyAllProblems.ts

# 5. Check final results
npx ts-node --transpile-only src/scripts/showUpdatedContent.ts
```

---

## Expected Results

After running all scripts successfully, you should see:

### Database
- ✅ Total problems: 541 (535 original + 6 new)
- ✅ 4 updated problems with comprehensive content
- ✅ 6 newly created comprehensive problems
- ✅ 151 total test cases
- ✅ 20+ code templates

### Output Indicators
- ✅ "✅ Problem created successfully!" messages
- ✅ No error messages in console
- ✅ All script executions complete
- ✅ Verification shows all 10 problems in database

### Files Generated
- ✅ All problem data in MySQL database
- ✅ Documentation files created
- ✅ Scripts executed without errors

---

## Next Steps

After successful setup:

1. **Test with API:** Start the server and test endpoints
   ```powershell
   npm run dev
   ```

2. **Browse Problems:** Use Prisma Studio
   ```powershell
   npx prisma studio
   ```

3. **Create Frontend:** Connect to the backend API

4. **Deploy:** Push to production when ready

---

## Support & Documentation

### Generated Documentation Files
- `MANUAL_SETUP_GUIDE.md` (this file)
- `DSA_ENHANCEMENT_COMPLETE_REPORT.md`
- `ALL_DSA_PROBLEMS_OVERVIEW.md`
- `PROJECT_COMPLETION_CHECKLIST.md`

### Project Directory Structure
```
AdyapanAI/
├── apps/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── scripts/
│   │   │   │   ├── updateJumpGameProblem.ts
│   │   │   │   ├── updateMaxHeightStackingCuboidsProblem.ts
│   │   │   │   ├── verifyAllProblems.ts
│   │   │   │   └── ... (other scripts)
│   │   │   ├── config/
│   │   │   │   └── prisma.ts
│   │   │   └── server.ts
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── .env
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── frontend/
└── docs/
    ├── MANUAL_SETUP_GUIDE.md
    └── ... (other documentation)
```

---

**Ready to go! Follow the steps above to manually run the AdyapanAI DSA Problems Enhancement project.** 🚀
