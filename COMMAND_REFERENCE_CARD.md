# Command Reference Card

## Quick Copy-Paste Commands

### Initial Setup

```powershell
# 1. Navigate to project
cd "c:\Users\HP\Downloads\AdyapanAI\apps\backend"

# 2. Copy env file
Copy-Item .env.example -Destination .env

# 3. Create database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS adyapan;"

# 4. Install dependencies
npm install

# 5. Run migrations
npx prisma db push
```

---

## Individual Script Commands

### Cleanup Scripts

```powershell
# Check database count
npx ts-node --transpile-only src/scripts/checkDbCount.ts

# Find extra problems
npx ts-node --transpile-only src/scripts/identifyExtraProblems.ts

# Clean up extras (if needed)
npx ts-node --transpile-only src/scripts/finalCleanup.ts
```

### Update Scripts (4 Problems)

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

### Create Scripts (6 Problems)

```powershell
# Create Maximum Height by Stacking Cuboids
npx ts-node --transpile-only src/scripts/updateMaxHeightStackingCuboidsProblem.ts

# Create Minimum Absolute Sum Difference
npx ts-node --transpile-only src/scripts/updateMinimumAbsoluteSumDifferenceProblem.ts

# Create Minimum Arrows to Burst Balloons
npx ts-node --transpile-only src/scripts/updateMinArrowsForBalloonsProblems.ts

# Create Minimum Coins with Specific Denominations
npx ts-node --transpile-only src/scripts/updateMinCoinsSpecificDenominationsProblem.ts

# Create Maximum Equal Sum of Three Stacks
npx ts-node --transpile-only src/scripts/updateMaxEqualSumThreeStacksProblem.ts

# Create Minimum Cost Coins with K Extra
npx ts-node --transpile-only src/scripts/updateMinCostCoinsKExtraProblem.ts
```

### Verification Scripts

```powershell
# Verify updated problems
npx ts-node --transpile-only src/scripts/verifyUpdates.ts

# Verify all problems (complete report)
npx ts-node --transpile-only src/scripts/verifyAllProblems.ts

# Show sample content
npx ts-node --transpile-only src/scripts/showUpdatedContent.ts
```

---

## Database Management

```powershell
# Open Prisma Studio (visual database editor)
npx prisma studio

# Run migrations
npx prisma migrate deploy

# Push schema changes
npx prisma db push

# Create migration
npx prisma migrate dev --name name_of_migration

# Reset database
npx prisma migrate reset

# Generate Prisma client
npx prisma generate
```

---

## Development

```powershell
# Start dev server
npm run dev

# Build project
npm build

# Start production
npm start

# Run linter
npm run lint

# Run tests
npm run test
```

---

## Useful Queries

### Check Database Count

```powershell
npx ts-node --transpile-only -e "
import { prisma } from './src/config/prisma';
(async () => {
  const count = await prisma.question.count();
  console.log('Total:', count);
  await prisma.$disconnect();
})();
"
```

### List All Problems

```powershell
npx prisma db execute --stdin "
SELECT id, title, slug, difficulty, xpReward FROM Question LIMIT 10;
"
```

### Find Problem by Slug

```powershell
npx prisma db execute --stdin "
SELECT * FROM Question WHERE slug = 'jump-game' LIMIT 1;
"
```

---

## All Scripts at Once

### Create Batch Script

**File: `run-all-dsa.ps1`**

```powershell
$scriptsPath = "c:\Users\HP\Downloads\AdyapanAI\apps\backend"
cd $scriptsPath

Write-Host "🚀 Running all DSA problem scripts..." -ForegroundColor Green
Write-Host ""

# Phase 1: Check & Cleanup
Write-Host "📋 Checking database..." -ForegroundColor Cyan
npx ts-node --transpile-only src/scripts/checkDbCount.ts

# Phase 2: Update 4 Problems
Write-Host ""
Write-Host "🔄 Updating existing problems..." -ForegroundColor Cyan

npx ts-node --transpile-only src/scripts/updateJumpGameProblem.ts
Write-Host "✅ Jump Game updated" -ForegroundColor Green

npx ts-node --transpile-only src/scripts/updateJumpGameIIProblem.ts
Write-Host "✅ Jump Game II updated" -ForegroundColor Green

npx ts-node --transpile-only src/scripts/updateGasStationProblem.ts
Write-Host "✅ Gas Station updated" -ForegroundColor Green

npx ts-node --transpile-only src/scripts/updateMinimizeCashFlowProblem.ts
Write-Host "✅ Minimize Cash Flow updated" -ForegroundColor Green

# Phase 3: Create 6 Problems
Write-Host ""
Write-Host "✨ Creating new problems..." -ForegroundColor Cyan

npx ts-node --transpile-only src/scripts/updateMaxHeightStackingCuboidsProblem.ts
Write-Host "✅ Max Height Cuboids created" -ForegroundColor Green

npx ts-node --transpile-only src/scripts/updateMinimumAbsoluteSumDifferenceProblem.ts
Write-Host "✅ Min Absolute Sum created" -ForegroundColor Green

npx ts-node --transpile-only src/scripts/updateMinArrowsForBalloonsProblems.ts
Write-Host "✅ Min Arrows created" -ForegroundColor Green

npx ts-node --transpile-only src/scripts/updateMinCoinsSpecificDenominationsProblem.ts
Write-Host "✅ Min Coins created" -ForegroundColor Green

npx ts-node --transpile-only src/scripts/updateMaxEqualSumThreeStacksProblem.ts
Write-Host "✅ Max Equal Sum created" -ForegroundColor Green

npx ts-node --transpile-only src/scripts/updateMinCostCoinsKExtraProblem.ts
Write-Host "✅ Min Cost Coins created" -ForegroundColor Green

# Phase 4: Verify
Write-Host ""
Write-Host "✅ Verification..." -ForegroundColor Cyan
npx ts-node --transpile-only src/scripts/verifyAllProblems.ts

Write-Host ""
Write-Host "🎉 All complete!" -ForegroundColor Green
```

**Run it:**
```powershell
cd "c:\Users\HP\Downloads\AdyapanAI\apps\backend"
.\run-all-dsa.ps1
```

---

## Common Issues & Fixes

| Issue | Command |
|-------|---------|
| npm not found | Install Node.js |
| MySQL not found | Add MySQL to PATH or use full path |
| Can't connect to DB | Check .env, verify MySQL running |
| Port 5555 in use | `netstat -ano \| findstr :5555` then kill process |
| Clear cache | `rm -r node_modules -Force` then `npm install` |
| Reset database | `npx prisma migrate reset` |
| Force reinstall | `rm package-lock.json -Force` then `npm install` |

---

## Monitoring & Debugging

```powershell
# Check Node process
ps | grep node

# Kill node process
taskkill /IM node.exe /F

# Check port 5000 (server)
netstat -ano | findstr :5000

# Check MySQL running
Get-Service MySQL80

# Restart MySQL
Restart-Service MySQL80

# View logs
npm run dev 2>&1 | Tee-Object -FilePath debug.log
```

---

## Environment Variables Quick Reference

```env
# Required
DATABASE_URL=mysql://root:PASSWORD@127.0.0.1:3306/adyapan
MYSQL_PASSWORD=PASSWORD

# Recommended
JWT_ACCESS_SECRET=your_secret_min_32_chars
JWT_REFRESH_SECRET=your_secret_min_32_chars
NODE_ENV=development
PORT=5000

# Optional (for specific features)
REDIS_URL=redis://localhost:6379
GOOGLE_CLIENT_ID=your_google_id
SMTP_HOST=smtp.gmail.com
```

---

## File Structure Reference

```
c:\Users\HP\Downloads\AdyapanAI\
├── apps\
│   └── backend\
│       ├── src\
│       │   ├── scripts\
│       │   │   ├── updateJumpGameProblem.ts
│       │   │   ├── updateMaxHeightStackingCuboidsProblem.ts
│       │   │   ├── verifyAllProblems.ts
│       │   │   └── ... (other scripts)
│       │   ├── config\
│       │   │   └── prisma.ts
│       │   └── server.ts
│       ├── prisma\
│       │   └── schema.prisma
│       ├── .env (create from .env.example)
│       ├── package.json
│       └── tsconfig.json
├── QUICK_START.md
├── MANUAL_SETUP_GUIDE.md
├── EXECUTION_FLOW_DIAGRAM.md
└── COMMAND_REFERENCE_CARD.md
```

---

## Success Checklist

- [ ] Node.js installed
- [ ] MySQL installed and running
- [ ] .env file created and configured
- [ ] Database created (adyapan)
- [ ] npm install completed
- [ ] Prisma migrations ran
- [ ] All 4 update scripts executed
- [ ] All 6 create scripts executed
- [ ] Verification scripts passed
- [ ] Database shows 541 problems
- [ ] Ready to deploy!

---

## Support Files

| File | Purpose |
|------|---------|
| QUICK_START.md | 5-minute quick start |
| MANUAL_SETUP_GUIDE.md | Detailed setup instructions |
| EXECUTION_FLOW_DIAGRAM.md | Visual flow diagrams |
| COMMAND_REFERENCE_CARD.md | This file - quick commands |
| DSA_ENHANCEMENT_COMPLETE_REPORT.md | Full project report |
| ALL_DSA_PROBLEMS_OVERVIEW.md | Problem descriptions |
| PROJECT_COMPLETION_CHECKLIST.md | Verification checklist |

---

## Copy-Paste Complete Setup (Fastest Way)

```powershell
cd "c:\Users\HP\Downloads\AdyapanAI\apps\backend"
Copy-Item .env.example -Destination .env
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS adyapan;"
npm install
npx prisma db push

# Then copy-paste each script command individually
# (See "Individual Script Commands" section above)
```

---

**Save this file for quick reference!** 📋
