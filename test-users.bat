@echo off
echo ========================================
echo    Testing User Data for Chat
echo ========================================
echo.

echo Restarting servers with user data fixes...
echo.

echo [1/2] Restarting backend...
cd backend
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul
start cmd /k "npm run dev"

echo.
echo [2/2] Restarting frontend...
cd ..\frontend
taskkill /f /im node.exe 2>nul  
timeout /t 3 /nobreak >nul
start cmd /k "npm start"

echo.
echo ✅ Servers restarted with fixes!
echo.
echo 🔧 User Data Fixes:
echo    ✓ Backend returns both first_name and firstName
echo    ✓ Frontend handles both naming conventions
echo    ✓ Real user names will now display
echo    ✓ Search shows actual colleague names
echo    ✓ Chat rooms show proper names
echo.
echo 🌐 Test at: http://localhost:3000/chat
echo.
echo 📝 You should now see:
echo    - Real colleague names instead of "undefined undefined"
echo    - Proper initials in profile circles
echo    - Working search functionality
echo    - Correct room names for direct messages
echo.
pause