@echo off
echo.
echo ========================================
echo    🚀 NexusFlow - Complete Startup
echo ========================================
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

:: Check if MySQL is running
echo 🔍 Checking MySQL connection...
mysql -u root -p12345 -e "SELECT 1;" >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Cannot connect to MySQL
    echo Please ensure MySQL is running and accessible with:
    echo   - Username: root
    echo   - Password: 12345
    echo   - Database: nexusflow_project
    pause
    exit /b 1
)

echo ✅ MySQL connection successful

:: Create database if it doesn't exist
echo 📊 Setting up database...
mysql -u root -p12345 -e "CREATE DATABASE IF NOT EXISTS nexusflow_project;" 2>nul

:: Install dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing root dependencies...
    npm install
)

if not exist "backend\node_modules" (
    echo 📦 Installing backend dependencies...
    cd backend
    npm install
    cd ..
)

if not exist "frontend\node_modules" (
    echo 📦 Installing frontend dependencies...
    cd frontend
    npm install
    cd ..
)

echo.
echo ✅ All dependencies installed
echo.

:: Start both servers
echo 🚀 Starting NexusFlow servers...
echo.
echo Backend will run on: http://localhost:5000
echo Frontend will run on: http://localhost:3000
echo.
echo Press Ctrl+C to stop both servers
echo.

:: Start backend and frontend concurrently
start "NexusFlow Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul
start "NexusFlow Frontend" cmd /k "cd frontend && npm start"

echo.
echo 🎉 NexusFlow is starting up!
echo.
echo 📋 Quick Start Guide:
echo   1. Wait for both servers to start (may take 30-60 seconds)
echo   2. Open http://localhost:3000 in your browser
echo   3. Click "Get Started Free" to create your organization
echo   4. Use the demo credentials:
echo      Email: e22ec018@shanmugha.edu.in
echo      Password: E22EC018 732722106004
echo.
echo 🔧 Troubleshooting:
echo   - If port 3000 is busy, React will ask to use another port
echo   - If port 5000 is busy, update backend/.env PORT setting
echo   - Check MySQL is running if you see database errors
echo.
echo Happy collaborating with NexusFlow! 🎯
echo.
pause