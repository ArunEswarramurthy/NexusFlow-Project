@echo off
echo Starting NexusFlow Development Environment...

echo.
echo Starting Backend Server...
start "NexusFlow Backend" cmd /k "cd backend && npm start"

echo.
echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo.
echo Starting Frontend Server...
start "NexusFlow Frontend" cmd /k "cd frontend && npm start"

echo.
echo ✅ Both servers are starting...
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend: http://localhost:5000
echo.
echo Press any key to exit...
pause > nul