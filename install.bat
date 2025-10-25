@echo off
echo.
echo ========================================
echo    🚀 NexusFlow Installation Script
echo    Streamline Teams, Amplify Productivity
echo ========================================
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

:: Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed
echo.

:: Install root dependencies
echo 📦 Installing root dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install root dependencies
    pause
    exit /b 1
)

:: Install backend dependencies
echo.
echo 📦 Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..

:: Install frontend dependencies
echo.
echo 📦 Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

:: Install additional Tailwind CSS dependencies
echo.
echo 🎨 Installing Tailwind CSS dependencies...
call npm install -D @tailwindcss/forms @tailwindcss/typography @tailwindcss/aspect-ratio
if %errorlevel% neq 0 (
    echo ❌ Failed to install Tailwind CSS dependencies
    pause
    exit /b 1
)

cd ..

echo.
echo ========================================
echo ✅ Installation completed successfully!
echo ========================================
echo.
echo 📋 Next steps:
echo.
echo 1. Set up your MySQL database:
echo    - Database name: nexusflow_project
echo    - Password: 12345
echo.
echo 2. Update backend/.env file with your settings
echo.
echo 3. Start the development servers:
echo    - Run: npm run dev
echo    - Or start separately:
echo      Backend: cd backend && npm run dev
echo      Frontend: cd frontend && npm start
echo.
echo 4. Open your browser and go to:
echo    - Frontend: http://localhost:3000
echo    - Backend API: http://localhost:5000
echo.
echo 🚀 Happy coding with NexusFlow!
echo.
pause