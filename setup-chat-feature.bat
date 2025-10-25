@echo off
echo ========================================
echo    NexusFlow Chat Feature Setup
echo ========================================
echo.

echo [1/3] Setting up chat database tables...
cd backend
node setup-chat.js
if %errorlevel% neq 0 (
    echo ❌ Failed to setup chat tables
    pause
    exit /b 1
)

echo.
echo [2/3] Installing backend dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo [3/3] Installing frontend dependencies...
cd ..\frontend
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

cd ..
echo.
echo ✅ Chat feature setup completed successfully!
echo.
echo 🚀 To start the application:
echo    1. Run: start-complete.bat
echo    2. Or manually:
echo       - Backend: cd backend && npm run dev
echo       - Frontend: cd frontend && npm start
echo.
echo 💬 Chat Features Added:
echo    ✓ Real-time messaging with Socket.IO
echo    ✓ Group, Direct, and Task-based chat rooms
echo    ✓ File sharing and message replies
echo    ✓ Typing indicators and read receipts
echo    ✓ Professional UI/UX design
echo    ✓ Mobile responsive design
echo.
pause