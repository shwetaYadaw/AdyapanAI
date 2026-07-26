#!/usr/bin/env pwsh
# Diagnostic script to identify the "Something went wrong" error

Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║        AdyapanAI - Diagnostic Tool                             ║" -ForegroundColor Cyan
Write-Host "║  Checking why frontend shows 'Something went wrong' error      ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

Write-Host "`n[1/8] Checking Node.js Installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found! Install from https://nodejs.org" -ForegroundColor Red
    exit 1
}

Write-Host "`n[2/8] Checking Yarn Installation..." -ForegroundColor Yellow
try {
    $yarnVersion = yarn --version
    Write-Host "✅ Yarn: $yarnVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Yarn not found! Run: npm install -g yarn" -ForegroundColor Red
    exit 1
}

Write-Host "`n[3/8] Checking Project Structure..." -ForegroundColor Yellow
$requiredDirs = @(
    "apps/backend",
    "apps/web",
    "apps/ai-service",
    "packages/shared"
)

foreach ($dir in $requiredDirs) {
    if (Test-Path $dir) {
        Write-Host "✅ Found: $dir" -ForegroundColor Green
    } else {
        Write-Host "❌ Missing: $dir" -ForegroundColor Red
    }
}

Write-Host "`n[4/8] Checking Environment Configuration..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "✅ .env file exists" -ForegroundColor Green
    $envContent = Get-Content ".env" -Raw
    if ($envContent -match "DATABASE_URL") {
        Write-Host "✅ DATABASE_URL found" -ForegroundColor Green
    } else {
        Write-Host "⚠️  DATABASE_URL missing!" -ForegroundColor Red
    }
} else {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
}

Write-Host "`n[5/8] Checking if Node Modules are Installed..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    $nodeModuleCount = (Get-ChildItem node_modules -ErrorAction SilentlyContinue).Count
    Write-Host "✅ node_modules found ($nodeModuleCount packages)" -ForegroundColor Green
} else {
    Write-Host "❌ node_modules not installed! Run: yarn install" -ForegroundColor Red
}

Write-Host "`n[6/8] Checking Port Availability..." -ForegroundColor Yellow

# Check if port 5000 is in use
$port5000 = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if ($port5000) {
    Write-Host "⚠️  Port 5000 is already in use!" -ForegroundColor Yellow
    Write-Host "   This is OK if backend is already running" -ForegroundColor Yellow
} else {
    Write-Host "✅ Port 5000 is available" -ForegroundColor Green
}

# Check if port 3000 is in use
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($port3000) {
    Write-Host "⚠️  Port 3000 is already in use!" -ForegroundColor Yellow
    Write-Host "   This is OK if frontend is already running" -ForegroundColor Yellow
} else {
    Write-Host "✅ Port 3000 is available" -ForegroundColor Green
}

Write-Host "`n[7/8] Testing Backend API Connection..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -ErrorAction Stop
    Write-Host "✅ Backend API is running on port 5000!" -ForegroundColor Green
} catch {
    Write-Host "❌ Cannot connect to backend on port 5000" -ForegroundColor Red
    Write-Host "   Run 'yarn dev:backend' in Terminal 1 first!" -ForegroundColor Yellow
}

Write-Host "`n[8/8] Testing Frontend Connection..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -ErrorAction Stop
    Write-Host "✅ Frontend is running on port 3000!" -ForegroundColor Green
} catch {
    Write-Host "❌ Cannot connect to frontend on port 3000" -ForegroundColor Red
    Write-Host "   Run 'yarn dev:web' in Terminal 2 second!" -ForegroundColor Yellow
}

Write-Host "`n╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                    DIAGNOSIS SUMMARY                           ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

Write-Host "`n📋 REQUIRED STEPS TO FIX THE ERROR:" -ForegroundColor Yellow

Write-Host "`nSTEP 1: Install Dependencies (if not done)" -ForegroundColor Cyan
Write-Host "  yarn install" -ForegroundColor White

Write-Host "`nSTEP 2: Start Backend (Terminal 1)" -ForegroundColor Cyan
Write-Host "  cd c:\Users\HP\Downloads\AdyapanAI" -ForegroundColor White
Write-Host "  yarn dev:backend" -ForegroundColor White
Write-Host "  ⏳ Wait until you see: 'Server running on port 5000'" -ForegroundColor Yellow

Write-Host "`nSTEP 3: Start Frontend (Terminal 2)" -ForegroundColor Cyan
Write-Host "  cd c:\Users\HP\Downloads\AdyapanAI" -ForegroundColor White
Write-Host "  yarn dev:web" -ForegroundColor White
Write-Host "  ⏳ Wait until you see: 'Local: http://localhost:3000'" -ForegroundColor Yellow

Write-Host "`nSTEP 4: Access App" -ForegroundColor Cyan
Write-Host "  Open browser: http://localhost:3000" -ForegroundColor White

Write-Host "`n⚠️  IMPORTANT: Backend MUST run FIRST on port 5000 before frontend!" -ForegroundColor Red
Write-Host "`n✅ Once both are running, the error should disappear!" -ForegroundColor Green

Write-Host ""
