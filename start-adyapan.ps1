#!/usr/bin/env pwsh
# AdyapanAI Smart Startup Script
# This script starts both backend and frontend in a coordinated way

Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                                ║" -ForegroundColor Cyan
Write-Host "║         Welcome to AdyapanAI Smart Startup!                    ║" -ForegroundColor Cyan
Write-Host "║                                                                ║" -ForegroundColor Cyan
Write-Host "║  This script will start:                                       ║" -ForegroundColor Cyan
Write-Host "║  1. Backend API (port 5000)                                    ║" -ForegroundColor Cyan
Write-Host "║  2. Frontend App (port 3000)                                   ║" -ForegroundColor Cyan
Write-Host "║  3. Launch browser (http://localhost:3000)                     ║" -ForegroundColor Cyan
Write-Host "║                                                                ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

Write-Host ""

# Check prerequisites
Write-Host "📋 Checking Prerequisites..." -ForegroundColor Yellow

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "  ✅ Node.js $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Node.js not installed! Install from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Check Yarn
try {
    $yarnVersion = yarn --version
    Write-Host "  ✅ Yarn $yarnVersion" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Yarn not installed! Run: npm install -g yarn" -ForegroundColor Red
    exit 1
}

# Check if in correct directory
if (-not (Test-Path "apps/backend") -or -not (Test-Path "apps/web")) {
    Write-Host "  ❌ Not in AdyapanAI root directory!" -ForegroundColor Red
    exit 1
}
Write-Host "  ✅ Correct directory: $(pwd)" -ForegroundColor Green

# Check if node_modules exist
if (-not (Test-Path "node_modules")) {
    Write-Host ""
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    yarn install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ❌ Yarn install failed!" -ForegroundColor Red
        exit 1
    }
    Write-Host "  ✅ Dependencies installed" -ForegroundColor Green
}

# Kill any existing node processes on ports 5000/3000
Write-Host ""
Write-Host "🧹 Cleaning up existing processes..." -ForegroundColor Yellow

$port5000 = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if ($port5000) {
    Write-Host "  ⚠️  Port 5000 is already in use. Cleaning up..." -ForegroundColor Yellow
    Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Milliseconds 500
}

$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($port3000) {
    Write-Host "  ⚠️  Port 3000 is already in use. Cleaning up..." -ForegroundColor Yellow
    Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Milliseconds 500
}

Write-Host "  ✅ Ports are clean" -ForegroundColor Green

Write-Host ""
Write-Host "🚀 Starting Services..." -ForegroundColor Green
Write-Host ""

# Start backend in new window
Write-Host "Starting Backend API (Terminal 1)..." -ForegroundColor Cyan
$backendCmd = {
    cd "c:\Users\HP\Downloads\AdyapanAI"
    yarn dev:backend
}

try {
    Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\HP\Downloads\AdyapanAI'; yarn dev:backend" -WindowStyle Normal
    Write-Host "  ✅ Backend started in new terminal" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Failed to start backend terminal" -ForegroundColor Red
    exit 1
}

# Wait for backend to be ready
Write-Host "  ⏳ Waiting for backend to be ready (this takes 10-15 seconds)..." -ForegroundColor Yellow
$backendReady = $false
$attempts = 0
while (-not $backendReady -and $attempts -lt 30) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -ErrorAction Stop
        $backendReady = $true
    } catch {
        Start-Sleep -Seconds 1
        $attempts++
    }
}

if ($backendReady) {
    Write-Host "  ✅ Backend is ready on http://localhost:5000" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Backend didn't respond yet (may still be starting)" -ForegroundColor Yellow
}

Write-Host ""

# Wait a moment
Start-Sleep -Seconds 2

# Start frontend in new window
Write-Host "Starting Frontend App (Terminal 2)..." -ForegroundColor Cyan
try {
    Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\HP\Downloads\AdyapanAI'; yarn dev:web" -WindowStyle Normal
    Write-Host "  ✅ Frontend started in new terminal" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Failed to start frontend terminal" -ForegroundColor Red
    exit 1
}

# Wait for frontend to be ready
Write-Host "  ⏳ Waiting for frontend to be ready (this takes 10-15 seconds)..." -ForegroundColor Yellow
$frontendReady = $false
$attempts = 0
while (-not $frontendReady -and $attempts -lt 30) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000" -ErrorAction Stop
        $frontendReady = $true
    } catch {
        Start-Sleep -Seconds 1
        $attempts++
    }
}

if ($frontendReady) {
    Write-Host "  ✅ Frontend is ready on http://localhost:3000" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Frontend didn't respond yet (may still be starting)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                                                                ║" -ForegroundColor Green
Write-Host "║                    ✅ STARTUP COMPLETE!                        ║" -ForegroundColor Green
Write-Host "║                                                                ║" -ForegroundColor Green
Write-Host "║  Your services are now running:                                ║" -ForegroundColor Green
Write-Host "║  • Backend API:  http://localhost:5000                          ║" -ForegroundColor Green
Write-Host "║  • Frontend:     http://localhost:3000                          ║" -ForegroundColor Green
Write-Host "║  • Database:     PostgreSQL (via Prisma)                        ║" -ForegroundColor Green
Write-Host "║                                                                ║" -ForegroundColor Green
Write-Host "║  Opening browser now...                                        ║" -ForegroundColor Green
Write-Host "║                                                                ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Green

# Open browser
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "📖 Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Check the terminal windows to see backend/frontend logs" -ForegroundColor White
Write-Host "  2. Use the app at http://localhost:3000" -ForegroundColor White
Write-Host "  3. To stop: Press Ctrl+C in each terminal window" -ForegroundColor White
Write-Host "  4. To restart: Run this script again" -ForegroundColor White
Write-Host ""
Write-Host "💡 Note: Keep both terminal windows open while developing!" -ForegroundColor Yellow
Write-Host ""
