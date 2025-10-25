@echo off
echo ========================================
echo    Fixing NexusFlow Chat Issues
echo ========================================
echo.

echo [1/2] Checking backend server...
cd backend
echo Starting backend server...
start cmd /k "npm run dev"

echo.
echo [2/2] Starting frontend...
cd ..\frontend
echo Starting frontend...
start cmd /k "npm start"

echo.
echo ✅ Both servers are starting...
echo.
echo 🔧 Fixed Issues:
echo    ✓ User attribute names (first_name, last_name)
echo    ✓ Import conflicts resolved
echo    ✓ Socket.IO connection logging
echo    ✓ Message display formatting
echo    ✓ Search functionality
echo    ✓ Null checks added
echo.
echo 💬 Chat Features:
echo    ✓ WhatsApp-like interface
echo    ✓ Real-time search for users
echo    ✓ Direct messaging
echo    ✓ Message bubbles with proper styling
echo    ✓ Online status indicators
echo    ✓ Typing indicators
echo.
echo 🌐 Access chat at: http://localhost:3000/chat
echo.
pause