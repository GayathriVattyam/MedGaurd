@echo off
REM ============================================
REM MedGuard - Complete Startup Script
REM ============================================

echo.
echo ============================================
echo   MedGuard - Complete System Startup
echo ============================================
echo.

REM Check if Node.js is installed
where /q node
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js from https://nodejs.org/
    exit /b 1
)

REM Check if Python is installed
where /q python
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python from https://www.python.org/
    exit /b 1
)

echo ✅ Node.js and Python are installed
echo.

REM Check for running services
echo.
echo Checking for already running services...
netstat -ano | findstr :5001 >nul
if %errorlevel% equ 0 (
    echo ⚠️  Port 5001 already in use (Flask running?)
)

netstat -ano | findstr :5000 >nul
if %errorlevel% equ 0 (
    echo ⚠️  Port 5000 already in use (Backend running?)
)

netstat -ano | findstr :5173 >nul
if %errorlevel% equ 0 (
    echo ⚠️  Port 5173 already in use (Frontend running?)
)

echo.
echo 🚀 Starting MedGuard Services...
echo.

REM Start Flask ML API
echo ============================================
echo 🐍 Starting Flask ML API (Port 5001)...
echo ============================================
start "Flask ML API" cmd /k "cd ml-model && python ml_api.py"
echo ✅ Flask API started in new window
echo    URL: http://127.0.0.1:5001
echo.
timeout /t 3 /nobreak

REM Start Backend Server
echo ============================================
echo 🟢 Starting Node.js Backend (Port 5000)...
echo ============================================
start "Backend Server" cmd /k "cd backend && npm start"
echo ✅ Backend started in new window
echo    URL: http://localhost:5000
echo.
timeout /t 3 /nobreak

REM Start Frontend Server
echo ============================================
echo ⚛️  Starting React Frontend (Port 5173)...
echo ============================================
start "Frontend Server" cmd /k "cd frontend && npm run dev"
echo ✅ Frontend started in new window
echo    URL: http://localhost:5173
echo.

echo.
echo ============================================
echo   ✅ All Services Started!
echo ============================================
echo.
echo 📍 Service URLs:
echo    Frontend:  http://localhost:5173
echo    Backend:   http://localhost:5000
echo    ML API:    http://127.0.0.1:5001
echo.
echo 📋 Service Details:
echo    - Frontend (Port 5173) - React Dev Server
echo    - Backend (Port 5000) - Express.js + MongoDB
echo    - ML API (Port 5001) - Flask + ML Model
echo.
echo 💾 Database:
echo    - MongoDB must be running on localhost:27017
echo    - Open MongoDB Compass if not connected
echo.
echo 🔐 Getting Started:
echo    1. Go to http://localhost:5173
echo    2. Click Register and create your account
echo    3. Login with your credentials
echo    4. Try the Symptom Checker feature
echo.
echo ⚠️  Important:
echo    - Keep all terminal windows open
echo    - Check browser console (F12) for errors
echo    - Check each terminal for service logs
echo    - MongoDB must be running separately
echo    - First load may take a few seconds
echo.
echo ❌ Troubleshooting:
echo    - If port is in use: Close other applications using that port
echo    - If Flask fails: Check Python path and dependencies
echo    - If Backend fails: Check npm dependencies (run npm install)
echo    - If Frontend fails: Clear node_modules and reinstall
echo.
echo To stop all services:
echo    - Close all terminal windows
echo    - Or use Ctrl+C in each terminal
echo.
pause
echo ========================================
echo ✅ All services should be starting...
echo ========================================
echo.
echo 🔗 Access at: http://localhost:5173
echo.
echo Wait 10 seconds for all services to initialize.
echo.
timeout /t 10 /nobreak

REM Open browser
echo Opening browser...
start http://localhost:5173

echo.
echo ✅ Setup complete!
echo If you see errors, check the individual terminals.
echo.
pause
