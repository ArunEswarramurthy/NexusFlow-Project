@echo off
echo ========================================
echo    Working WhatsApp-Style Chat
echo ========================================
echo.

echo [1/2] Starting backend...
cd backend
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul
start cmd /k "npm run dev"

echo.
echo [2/2] Starting frontend...
cd ..\frontend
taskkill /f /im node.exe 2>nul
timeout /t 3 /nobreak >nul
start cmd /k "npm start"

echo.
echo ✅ Working Chat is Ready!
echo.
echo 💬 WhatsApp/Telegram Features:
echo    ✓ See all organization members
echo    ✓ Search colleagues by name
echo    ✓ Click anyone to start chatting
echo    ✓ Send messages instantly
echo    ✓ WhatsApp-style green theme
echo    ✓ Online status indicators
echo    ✓ Message timestamps
echo    ✓ Responsive design
echo.
echo 🎯 How to use:
echo    1. Go to http://localhost:3000/chat
echo    2. See all colleagues in sidebar
echo    3. Click any person to start chat
echo    4. Type message and press Enter
echo    5. Messages appear instantly!
echo.
echo 🌐 Access: http://localhost:3000/chat
echo.
pause