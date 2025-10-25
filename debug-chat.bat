@echo off
echo ========================================
echo    Debug Chat - Find Click Issues
echo ========================================
echo.

echo [1/2] Restarting backend with debug...
cd backend
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul
start cmd /k "npm run dev"

echo.
echo [2/2] Restarting frontend with test component...
cd ..\frontend
taskkill /f /im node.exe 2>nul
timeout /t 3 /nobreak >nul
start cmd /k "npm start"

echo.
echo ✅ Debug mode started!
echo.
echo 🔍 Debug Steps:
echo    1. Go to http://localhost:3000/chat
echo    2. Open browser console (F12)
echo    3. Click "Test Chat" button on any user
echo    4. Check console for errors
echo    5. Check if API calls are working
echo.
echo 📝 What to check:
echo    ✓ Are users loading?
echo    ✓ Do clicks trigger console logs?
echo    ✓ Are API calls being made?
echo    ✓ What errors appear in console?
echo.
pause