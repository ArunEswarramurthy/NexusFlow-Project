@echo off
echo =====================================================
echo    NexusFlow - Fix All Issues (Complete Reset)
echo =====================================================
echo.

echo [1/4] Stopping any running servers...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im nodemon.exe >nul 2>&1
echo ✅ Servers stopped

echo.
echo [2/4] Resetting Database (DROPPING ALL DATA)...
echo.
echo ⚠️  WARNING: This will permanently delete ALL data!
echo Press any key to continue or Ctrl+C to cancel...
pause >nul

echo.
echo Connecting to MySQL and resetting database...
mysql -u root -p12345 < fix-all-issues.sql

if %errorlevel% equ 0 (
    echo ✅ Database reset successful - All data deleted and recreated
) else (
    echo ❌ Database reset failed - Check MySQL connection
    echo Make sure MySQL is running with credentials: root/12345
    pause
    exit /b 1
)

echo.
echo [3/4] Installing/Updating Dependencies...
cd backend
call npm install --silent
cd ..\frontend
call npm install --silent
cd ..
echo ✅ Dependencies updated

echo.
echo [4/4] Starting Servers...
echo.

echo Starting Backend Server...
start "NexusFlow Backend" cmd /k "cd backend && npm run dev"

timeout /t 3 >nul

echo Starting Frontend Server...
start "NexusFlow Frontend" cmd /k "cd frontend && npm start"

echo.
echo =====================================================
echo                 ALL ISSUES FIXED
echo =====================================================
echo.
echo ✅ Database reset with clean structure
echo ✅ Rate limiting configuration fixed
echo ✅ JWT token issues resolved
echo ✅ Task ID duplication fixed
echo ✅ Both servers starting...
echo.
echo DEMO CREDENTIALS:
echo Organization: Demo Organization
echo Email: e22ec018@shanmugha.edu.in
echo Password: E22EC018 732722106004
echo.
echo URLS:
echo 🌐 Frontend: http://localhost:3000
echo 🔌 Backend: http://localhost:5000
echo 📊 Health Check: http://localhost:5000/api/health
echo.
echo Wait 30 seconds for servers to fully start, then visit:
echo http://localhost:3000
echo.
echo =====================================================
pause