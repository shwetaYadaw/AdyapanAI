# 00-backup.ps1
# Creates a complete backup before restructuring

Write-Host "🔒 Creating Backup Before Restructuring..." -ForegroundColor Cyan
Write-Host ""

# 1. Git backup
Write-Host "1️⃣ Creating Git backup branch..." -ForegroundColor Yellow
git checkout -b backup/pre-restructure
git add .
git commit -m "Backup: Pre-restructure snapshot ($(Get-Date -Format 'yyyy-MM-dd HH:mm:ss'))"
git tag v1.0.0-pre-restructure

Write-Host "✅ Git backup created" -ForegroundColor Green
Write-Host ""

# 2. Database backup
Write-Host "2️⃣ Backing up database..." -ForegroundColor Yellow
cd apps\backend
npm run backup:problems
cd ..\..

Write-Host "✅ Database backup created" -ForegroundColor Green
Write-Host ""

# 3. Create full project backup folder
Write-Host "3️⃣ Creating full project backup..." -ForegroundColor Yellow
$backupPath = "..\AdyapanAI-Backup-$(Get-Date -Format 'yyyy-MM-dd-HHmmss')"
Copy-Item -Path "." -Destination $backupPath -Recurse -Force -Exclude @('node_modules', '.git', 'dist', 'build')

Write-Host "✅ Full backup created at: $backupPath" -ForegroundColor Green
Write-Host ""

# 4. Export current structure
Write-Host "4️⃣ Documenting current structure..." -ForegroundColor Yellow
Get-ChildItem -Recurse -Directory | Where-Object { $_.FullName -notmatch 'node_modules|\.git|dist|build' } | Select-Object FullName | Out-File "pre-restructure-folders.txt"
Get-ChildItem -Recurse -File | Where-Object { $_.FullName -notmatch 'node_modules|\.git|dist|build' } | Select-Object FullName | Out-File "pre-restructure-files.txt"

Write-Host "✅ Structure documented" -ForegroundColor Green
Write-Host ""

Write-Host "🎉 Backup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Backup Details:" -ForegroundColor Cyan
Write-Host "  - Git branch: backup/pre-restructure" -ForegroundColor White
Write-Host "  - Git tag: v1.0.0-pre-restructure" -ForegroundColor White
Write-Host "  - Full backup: $backupPath" -ForegroundColor White
Write-Host "  - Database backup: apps/backend/backups/" -ForegroundColor White
Write-Host ""
Write-Host "You can now safely proceed with restructuring!" -ForegroundColor Yellow
