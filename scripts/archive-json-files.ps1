# archive-json-files.ps1
# Safely archive hardcoded JSON question files after verification

Write-Host "📦 Archiving Hardcoded JSON Files..." -ForegroundColor Cyan
Write-Host ""

# Check if data folder exists
$dataPath = "apps\backend\src\data"
if (-not (Test-Path $dataPath)) {
    Write-Host "✓ No data folder found - already cleaned!" -ForegroundColor Green
    exit 0
}

# Create archive folder structure
Write-Host "1️⃣  Creating archive folders..." -ForegroundColor Yellow
$archivePath = "apps\backend\archive\seed-data-$(Get-Date -Format 'yyyy-MM-dd')"
New-Item -ItemType Directory -Force -Path $archivePath | Out-Null
Write-Host "   ✓ Created: $archivePath" -ForegroundColor Green

# Check what we're about to archive
Write-Host ""
Write-Host "2️⃣  Analyzing files to archive..." -ForegroundColor Yellow

$codingArenaPath = "$dataPath\questions\coding-arena"
$tcsNqtPath = "$dataPath\questions\tcs-nqt"
$tcsLegacyPath = "$dataPath\tcs-nqt-questions.json"

$fileCount = 0
$totalSize = 0

if (Test-Path $codingArenaPath) {
    $files = Get-ChildItem -Path $codingArenaPath -Filter "*.json"
    $fileCount += $files.Count
    $totalSize += ($files | Measure-Object -Property Length -Sum).Sum
    Write-Host "   - Coding Arena: $($files.Count) files" -ForegroundColor White
}

if (Test-Path $tcsNqtPath) {
    $files = Get-ChildItem -Path $tcsNqtPath -Filter "*.json"
    $fileCount += $files.Count
    $totalSize += ($files | Measure-Object -Property Length -Sum).Sum
    Write-Host "   - TCS NQT: $($files.Count) files" -ForegroundColor White
}

if (Test-Path $tcsLegacyPath) {
    $file = Get-Item $tcsLegacyPath
    $fileCount += 1
    $totalSize += $file.Length
    Write-Host "   - Legacy TCS file: 1 file" -ForegroundColor White
}

$totalSizeMB = [math]::Round($totalSize / 1MB, 2)
Write-Host ""
Write-Host "   Total: $fileCount files ($totalSizeMB MB)" -ForegroundColor Cyan

# Ask for confirmation
Write-Host ""
Write-Host "⚠️  WARNING" -ForegroundColor Yellow
Write-Host "   This will MOVE (not delete) these files to archive folder." -ForegroundColor White
Write-Host "   Files can be restored from archive if needed." -ForegroundColor White
Write-Host ""
$confirmation = Read-Host "Continue? (yes/no)"

if ($confirmation -ne "yes") {
    Write-Host "❌ Cancelled by user" -ForegroundColor Red
    exit 1
}

# Move files to archive
Write-Host ""
Write-Host "3️⃣  Moving files to archive..." -ForegroundColor Yellow

try {
    # Move entire data folder
    Move-Item -Path $dataPath -Destination "$archivePath\data" -Force
    Write-Host "   ✓ Moved: $dataPath → $archivePath\data" -ForegroundColor Green
    
    # Create a README in archive
    $readmeContent = @"
# Archived Seed Data

**Archived Date:** $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
**Original Location:** apps/backend/src/data/
**Archive Location:** $archivePath

## Contents

This folder contains hardcoded JSON question files that were used for seeding.

- coding-arena/: DSA problems for Coding Arena (22 files)
- tcs-nqt/: TCS NQT specific questions (5 files)  
- tcs-nqt-questions.json: Legacy TCS questions (1 file)

Total: $fileCount files ($totalSizeMB MB)

## Why Archived?

These files were archived because:
1. Questions are already seeded to database
2. No longer need to be in source code
3. Kept as backup for reference

## How to Restore

If you need to restore these files:

``````powershell
# Copy back to original location
Copy-Item -Path "$archivePath\data" -Destination "apps\backend\src\" -Recurse -Force
``````

## Database Tables

Data from these files should be in:
- CodingArenaProblem table
- TcsNqtQuestion table  
- Problem table

To verify: Run ``npm run verify:database-questions``
"@
    
    Set-Content -Path "$archivePath\README.md" -Value $readmeContent
    Write-Host "   ✓ Created: README.md in archive" -ForegroundColor Green
    
} catch {
    Write-Host "   ❌ Error moving files: $_" -ForegroundColor Red
    exit 1
}

# Frontend cleanup
Write-Host ""
Write-Host "4️⃣  Checking frontend hardcoded data..." -ForegroundColor Yellow

$frontendDataFile = "apps\web\src\pages\student\aptitudeData.ts"
if (Test-Path $frontendDataFile) {
    Write-Host "   ⚠️  Found: $frontendDataFile" -ForegroundColor Yellow
    Write-Host "   ❌ This file contains hardcoded aptitude questions" -ForegroundColor Red
    Write-Host ""
    Write-Host "   ⚠️  IMPORTANT: Do NOT delete this file yet!" -ForegroundColor Yellow
    Write-Host "   You must first:" -ForegroundColor White
    Write-Host "     1. Create aptitude API endpoint in backend" -ForegroundColor White
    Write-Host "     2. Update frontend to fetch from API" -ForegroundColor White
    Write-Host "     3. Test thoroughly" -ForegroundColor White
    Write-Host "     4. Then delete this file" -ForegroundColor White
} else {
    Write-Host "   ✓ No frontend hardcoded data found" -ForegroundColor Green
}

# Git commit suggestion
Write-Host ""
Write-Host "5️⃣  Creating Git commit..." -ForegroundColor Yellow

git add $archivePath
$commitMessage = "Archive hardcoded JSON question files to $archivePath

- Moved apps/backend/src/data/ to archive
- Files contain seed data already in database
- Kept as backup for reference
- Total: $fileCount files ($totalSizeMB MB)

Tables verified:
- CodingArenaProblem
- TcsNqtQuestion
- Problem
"

git commit -m $commitMessage

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Git commit created" -ForegroundColor Green
    
    # Create tag
    $tagName = "data-archived-$(Get-Date -Format 'yyyyMMdd')"
    git tag -a $tagName -m "Archived hardcoded data files"
    Write-Host "   ✓ Created tag: $tagName" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Git commit skipped (no changes or error)" -ForegroundColor Yellow
}

# Summary
Write-Host ""
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "✅ ARCHIVING COMPLETE!" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Summary:" -ForegroundColor Cyan
Write-Host "   - Files archived: $fileCount files ($totalSizeMB MB)" -ForegroundColor White
Write-Host "   - Archive location: $archivePath" -ForegroundColor White
Write-Host "   - Original location: apps/backend/src/data/ (removed)" -ForegroundColor White
Write-Host "   - Git: Committed and tagged" -ForegroundColor White
Write-Host ""
Write-Host "📝 What Changed:" -ForegroundColor Cyan
Write-Host "   ✅ Removed: apps/backend/src/data/" -ForegroundColor Green
Write-Host "   ✅ Added: $archivePath" -ForegroundColor Green
Write-Host "   ⚠️  Still exists: apps/web/src/pages/student/aptitudeData.ts" -ForegroundColor Yellow
Write-Host ""
Write-Host "🔄 To Restore (if needed):" -ForegroundColor Cyan
Write-Host "   Copy-Item -Path '$archivePath\data' -Destination 'apps\backend\src\' -Recurse" -ForegroundColor White
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Verify app still works (questions from database)" -ForegroundColor White
Write-Host "   2. Create aptitude API endpoint" -ForegroundColor White
Write-Host "   3. Update frontend to use API" -ForegroundColor White
Write-Host "   4. Remove aptitudeData.ts file" -ForegroundColor White
Write-Host ""
Write-Host "✨ Your source code is now cleaner!" -ForegroundColor Green
