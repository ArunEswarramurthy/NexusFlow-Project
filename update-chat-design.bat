@echo off
echo ========================================
echo    NexusFlow Chat - Professional UI/UX
echo ========================================
echo.

echo [1/3] Installing Framer Motion for animations...
cd frontend
npm install framer-motion
if %errorlevel% neq 0 (
    echo ❌ Failed to install framer-motion
    pause
    exit /b 1
)

echo.
echo [2/3] Starting backend server...
cd ..\backend
start cmd /k "npm run dev"

echo.
echo [3/3] Starting frontend with new design...
cd ..\frontend
start cmd /k "npm start"

echo.
echo ✅ Professional Chat UI/UX Applied!
echo.
echo 🎨 New Design Features:
echo    ✓ Professional NexusFlow branding colors
echo    ✓ Gradient backgrounds and modern shadows
echo    ✓ Smooth animations with Framer Motion
echo    ✓ Enhanced message bubbles with better typography
echo    ✓ Professional search interface
echo    ✓ Typing indicators with animations
echo    ✓ Improved spacing and visual hierarchy
echo    ✓ Mobile-responsive design
echo    ✓ Consistent with project UI standards
echo.
echo 🚀 Features:
echo    ✓ Real-time search for colleagues
echo    ✓ Professional message interface
echo    ✓ Status indicators and online presence
echo    ✓ File sharing capabilities
echo    ✓ Date separators and message grouping
echo    ✓ Professional color scheme matching NexusFlow
echo.
echo 🌐 Access: http://localhost:3000/chat
echo.
pause