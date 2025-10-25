@echo off
echo.
echo ========================================
echo    🚀 Starting NexusFlow Development
echo    Streamline Teams, Amplify Productivity
echo ========================================
echo.

:: Check if node_modules exists
if not exist "node_modules" (
    echo ❌ Dependencies not installed. Please run install.bat first.
    pause
    exit /b 1
)

if not exist "backend\node_modules" (
    echo ❌ Backend dependencies not installed. Please run install.bat first.
    pause
    exit /b 1
)

if not exist "frontend\node_modules" (
    echo ❌ Frontend dependencies not installed. Please run install.bat first.
    pause
    exit /b 1
)

echo ✅ All dependencies found
echo.

:: Start both backend and frontend
echo 🚀 Starting NexusFlow servers...
echo.
echo Backend will start on: http://localhost:5000
echo Frontend will start on: http://localhost:3000
echo.
echo Press Ctrl+C to stop both servers
echo.

start "NexusFlow Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul
start "NexusFlow Frontend" cmd /k "cd frontend && npm start"

echo.
echo ✅ Both servers are starting...
echo.
echo 📋 Quick Links:
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:5000
echo - API Health: http://localhost:5000/api/health
echo.
echo 💡 Tips:
echo - Register a new organization at: http://localhost:3000/register
echo - Admin login at: http://localhost:3000/admin/login
echo - User login at: http://localhost:3000/login
echo.
echo Happy coding! 🎉
pause