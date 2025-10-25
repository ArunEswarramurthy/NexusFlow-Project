@echo off
echo ========================================
echo    Fixing Chat User Data Display
echo ========================================
echo.

echo [1/2] Restarting backend with fixes...
cd backend
taskkill /f /im node.exe 2>nul
start cmd /k "npm run dev"

echo.
echo [2/2] Restarting frontend...
cd ..\frontend
taskkill /f /im node.exe 2>nul
start cmd /k "npm start"

echo.
echo ✅ Chat fixes applied!
echo.
echo 🔧 Fixed Issues:
echo    ✓ User names now display properly
echo    ✓ Direct message room names fixed
echo    ✓ Search shows real user names
echo    ✓ Message display improved
echo    ✓ Null/undefined handling added
echo.
echo 🌐 Test at: http://localhost:3000/chat
echo.
pause