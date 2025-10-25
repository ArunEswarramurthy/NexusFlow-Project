@echo off
echo =====================================================
echo    NexusFlow - Database Reset and Project Guide
echo =====================================================
echo.

echo [1/3] Resetting Database (DROPPING ALL DATA)...
echo.
echo WARNING: This will permanently delete all data!
echo Press any key to continue or Ctrl+C to cancel...
pause >nul

echo.
echo Connecting to MySQL and resetting database...
mysql -u root -p12345 < reset-database.sql

if %errorlevel% equ 0 (
    echo ✅ Database reset successful - All data deleted
) else (
    echo ❌ Database reset failed - Check MySQL connection
    echo Make sure MySQL is running and credentials are correct
    pause
    exit /b 1
)

echo.
echo [2/3] Database is now clean and ready for new data
echo.

echo [3/3] Opening project documentation...
echo.
echo 📖 HOW-PROJECT-WORKS.md - Complete technical guide
echo 📋 COMPLETE-FEATURES.md - All features documentation
echo.

start HOW-PROJECT-WORKS.md
start COMPLETE-FEATURES.md

echo.
echo =====================================================
echo                 RESET COMPLETE
echo =====================================================
echo.
echo ✅ All data has been permanently deleted
echo ✅ Clean database tables created
echo ✅ Documentation opened
echo.
echo NEXT STEPS:
echo 1. Start backend: cd backend && npm run dev
echo 2. Start frontend: cd frontend && npm start
echo 3. Visit: http://localhost:3000
echo 4. Register new organization to begin
echo.
echo Demo Credentials for Registration:
echo Organization: NexusFlow Demo
echo Email: e22ec018@shanmugha.edu.in
echo Password: E22EC018 732722106004
echo OTP: 123456
echo.
echo =====================================================
pause