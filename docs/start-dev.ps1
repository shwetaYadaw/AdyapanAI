# Start development environment
# Run this FIRST to start everything

Write-Host "🚀 Starting AdyapanAI Development Environment..." -ForegroundColor Green
Write-Host ""

# Navigate to project root
cd "c:\Users\HP\Downloads\AdyapanAI"

Write-Host "📋 Prerequisites Check..." -ForegroundColor Cyan

# Check Node
$nodeVersion = node --version 2>$null
if ($nodeVersion) {
    Write-Host "✅ Node.js installed: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js not installed! Download from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check Yarn
$yarnVersion = yarn --version 2>$null
if ($yarnVersion) {
    Write-Host "✅ Yarn installed: $yarnVersion" -ForegroundColor Green
} else {
    Write-Host "⚠️  Yarn not found. Installing..." -ForegroundColor Yellow
    npm install -g yarn
}

Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
Write-Host "(This may take 2-3 minutes...)" -ForegroundColor Gray

# Remove old lock files to avoid conflicts
if (Test-Path package-lock.json) {
    Remove-Item package-lock.json -Force
}

# Install
yarn install 2>&1 | Select-Object -Last 5

Write-Host ""
Write-Host "✅ Installation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 NEXT STEPS:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  1️⃣  Start Backend (Run in Terminal 1):" -ForegroundColor White
Write-Host "     yarn dev:backend" -ForegroundColor Yellow
Write-Host "     (Wait for 'Server running on port 5000')" -ForegroundColor Gray
Write-Host ""
Write-Host "  2️⃣  Start Frontend (Run in NEW Terminal 2):" -ForegroundColor White
Write-Host "     yarn dev:web" -ForegroundColor Yellow
Write-Host "     (Wait for 'Frontend running on port 3000')" -ForegroundColor Gray
Write-Host ""
Write-Host "  3️⃣  Open Browser:" -ForegroundColor White
Write-Host "     http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "🎯 To run DSA Problem Scripts (Terminal 3):" -ForegroundColor Cyan
Write-Host "   cd apps\backend" -ForegroundColor Yellow
Write-Host "   npx ts-node --transpile-only src/scripts/checkDbCount.ts" -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  IMPORTANT:" -ForegroundColor Yellow
Write-Host "   • Backend MUST run first on port 5000" -ForegroundColor Gray
Write-Host "   • Frontend needs backend running to work" -ForegroundColor Gray
Write-Host "   • Run each in a SEPARATE terminal" -ForegroundColor Gray
Write-Host ""
Write-Host "❓ Need help? Read: QUICK_FIX_NOT_WORKING.md" -ForegroundColor Cyan
