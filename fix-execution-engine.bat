@echo off
echo ========================================
echo Fixing and Restarting Execution Engine
echo ========================================
echo.

echo [1/4] Stopping execution engine...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8001') do taskkill /F /PID %%a 2>nul
timeout /t 2 /nobreak >nul

echo [2/4] Cleaning build artifacts...
cd apps\execution-engine
if exist dist rmdir /s /q dist
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo [3/4] Building TypeScript...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo [4/4] Starting execution engine...
start "Execution Engine" cmd /k "npm run start"

echo.
echo ========================================
echo Execution Engine Restarted!
echo ========================================
echo.
echo Check if it's running:
timeout /t 3 /nobreak >nul
curl http://localhost:8001/health
echo.
pause
