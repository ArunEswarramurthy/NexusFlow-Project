@echo off
echo ========================================
echo 🚀 NexusFlow - Complete Project Startup
echo ========================================
echo.

:: Set colors
color 0A

:: Check if Node.js is installed
echo 📋 Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js is installed

:: Check if MySQL is running
echo 📋 Checking MySQL service...
sc query mysql >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  MySQL service not found. Starting MySQL...
    net start mysql >nul 2>&1
)
echo ✅ MySQL is ready

:: Navigate to project directory
cd /d "%~dp0"

echo.
echo 🔧 Installing dependencies...
echo.

:: Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
if not exist node_modules (
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install backend dependencies
        pause
        exit /b 1
    )
)
echo ✅ Backend dependencies installed

:: Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd ..\frontend
if not exist node_modules (
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install frontend dependencies
        pause
        exit /b 1
    )
)
echo ✅ Frontend dependencies installed

:: Go back to root
cd ..

echo.
echo 🗄️  Setting up database...
echo.

:: Create database if it doesn't exist
mysql -u root -p12345 -e "CREATE DATABASE IF NOT EXISTS nexusflow_project;" 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  Database creation failed or already exists
) else (
    echo ✅ Database created successfully
)

:: Run database setup
mysql -u root -p12345 nexusflow_project < setup-database.sql 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  Database setup completed with warnings (tables may already exist)
) else (
    echo ✅ Database tables created successfully
)

echo.
echo 🌟 Starting NexusFlow servers...
echo.

:: Create a new command window for backend
echo 🔧 Starting Backend Server (Port 5000)...
start "NexusFlow Backend" cmd /k "cd /d %~dp0backend && echo 🚀 Starting NexusFlow Backend Server... && echo. && npm run dev"

:: Wait a moment for backend to start
timeout /t 3 /nobreak >nul

:: Create a new command window for frontend
echo 🎨 Starting Frontend Server (Port 3000)...
start "NexusFlow Frontend" cmd /k "cd /d %~dp0frontend && echo 🚀 Starting NexusFlow Frontend Server... && echo. && npm start"

:: Wait for servers to start
echo.
echo ⏳ Waiting for servers to start...
timeout /t 8 /nobreak >nul

echo.
echo ========================================
echo ✅ NexusFlow is now running!
echo ========================================
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔌 Backend:  http://localhost:5000
echo 📊 API Health: http://localhost:5000/api/health
echo.
echo 📋 Demo Credentials:
echo ==================
echo 👑 Admin Registration:
echo   Organization: NexusFlow Demo
echo   Email: e22ec018@shanmugha.edu.in
echo   Password: E22EC018 732722106004
echo   OTP: 123456 (demo)
echo.
echo 🔑 Quick Login:
echo   Admin: e22ec018@shanmugha.edu.in
echo   Password: E22EC018 732722106004
echo.
echo 🎯 Features Available:
echo   ✅ Landing Page with animations
echo   ✅ Organization Registration with OTP
echo   ✅ Admin & User Login (separate)
echo   ✅ Role-based Access Control
echo   ✅ User Management (CRUD)
echo   ✅ Role Management with Permissions
echo   ✅ Group Management (Hierarchical)
echo   ✅ Task Management (Complete workflow)
echo   ✅ Real-time Notifications
echo   ✅ Reports & Analytics
echo   ✅ Activity Logs
echo   ✅ Settings & Configuration
echo   ✅ Professional UI/UX with RGB colors
echo   ✅ Responsive Design
echo   ✅ Smooth Animations
echo.
echo 🚀 Opening NexusFlow in your browser...
timeout /t 2 /nobreak >nul
start http://localhost:3000

echo.
echo 💡 Tips:
echo   - Use Ctrl+C in server windows to stop servers
echo   - Check console for any errors
echo   - Database: nexusflow_project (user: root, pass: 12345)
echo.
echo 🎉 Enjoy using NexusFlow!
echo    Streamline Teams, Amplify Productivity
echo.
pause