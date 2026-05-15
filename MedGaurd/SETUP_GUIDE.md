# 📖 MedGuard - Complete Setup Guide

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Installation Steps](#installation-steps)
3. [Configuration](#configuration)
4. [Starting Services](#starting-services)
5. [Verification](#verification)
6. [Troubleshooting](#troubleshooting)
7. [First Steps](#first-steps)

---

## System Requirements

### Minimum Hardware
- RAM: 4GB (8GB recommended)
- Storage: 5GB free space
- Processor: 2-core (4-core recommended)

### Required Software
| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | v16+ | Frontend & Backend |
| Python | 3.8+ | Machine Learning |
| MongoDB | 4.4+ | Database |
| npm | v8+ | Package Manager |
| pip | v21+ | Python Package Manager |

### Supported OS
- ✅ Windows 10/11
- ✅ macOS (Intel/Apple Silicon)
- ✅ Linux (Ubuntu/Debian)

---

## Installation Steps

### Step 1: Verify Prerequisites

#### Check Node.js
```bash
node --version  # Should be v16 or higher
npm --version   # Should be v8 or higher
```

**Windows Installation**:
- Download from https://nodejs.org/
- Run installer with default settings
- Restart terminal/computer

#### Check Python
```bash
python --version  # Should be 3.8+
```

**Windows Installation**:
- Download from https://www.python.org/
- **IMPORTANT**: Check "Add Python to PATH" during install
- Restart terminal after installation

#### Check MongoDB
- Download from https://www.mongodb.com/try/download/community
- Install with default settings
- Start MongoDB (usually runs as service automatically)

### Step 2: Extract/Clone Project

```bash
# Extract MedGuard folder to Desktop or preferred location
cd MedGuard
```

### Step 3: Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

**Troubleshoot if failed:**
```bash
cd backend
rm -rf node_modules package-lock.json  # Clear cache
npm cache clean --force
npm install
cd ..
```

### Step 4: Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

### Step 5: Install Python Dependencies

```bash
cd ml-model
pip install -r requirements.txt
cd ..
```

**If pip not found:**
```bash
# Windows
py -m pip install -r requirements.txt

# macOS/Linux
python3 -m pip install -r requirements.txt
```

### Step 6: Verify MongoDB

**Windows Option 1: MongoDB Compass (GUI)**
1. Download MongoDB Compass from https://www.mongodb.com/products/tools/compass
2. Open MongoDB Compass
3. Click "Connect" button
4. Should show connection to localhost:27017

**Windows Option 2: Command Line**
```bash
mongod
```
Should show: "Waiting for connections on port 27017"

**Keep MongoDB Running** throughout the session!

---

## Configuration

### Create Backend .env

Create file: `backend/.env`

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/medguard

# JWT Configuration
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRE=7d

# ML API
ML_API_URL=http://127.0.0.1:5001/predict

# CORS
CORS_ORIGIN=http://localhost:5173

# Logging
LOG_LEVEL=debug
```

### Create Frontend .env

Create file: `frontend/.env`

```env
# API Configuration
VITE_API_URL=http://localhost:5000
VITE_ML_API_URL=http://127.0.0.1:5001

# App Configuration
VITE_APP_NAME=MedGuard
VITE_DEBUG=true

# Timeouts
VITE_REQUEST_TIMEOUT=30000
```

### Create ML API .env

Create file: `ml-model/.env`

```env
# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True
FLASK_APP=ml_api.py

# Server
PORT=5001
HOST=127.0.0.1

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:5000
```

---

## Starting Services

### ✅ Option 1: Quick Start (Windows)

Simply double-click: **START_ALL.bat**

This will:
1. Check Node.js & Python installation
2. Start Flask API (Port 5001)
3. Start Express Backend (Port 5000)
4. Start React Frontend (Port 5173)

All in separate terminal windows!

### ✅ Option 2: Manual Startup

Open 3 separate terminal windows:

**Terminal 1 - ML API (START FIRST)**
```bash
cd ml-model
python ml_api.py
```
Expected output:
```
 * Running on http://127.0.0.1:5001
 * Debug mode: on
```

**Terminal 2 - Backend Server (START SECOND)**
```bash
cd backend
npm start
```
Expected output:
```
Server running on port 5000
Connected to MongoDB
```

**Terminal 3 - Frontend (START LAST)**
```bash
cd frontend
npm run dev
```
Expected output:
```
VITE v4.0.0  ready in XXX ms
➜  Local:   http://localhost:5173/
```

---

## Verification

### ✅ Check All Services Running

**In Browser:**
- Frontend: http://localhost:5173 → Should show login page
- Backend Health: http://localhost:5000/api/health
- ML API: http://127.0.0.1:5001 → Should return JSON

**In Terminal:**
```bash
# Windows - Check ports in use
netstat -ano | findstr :5000
netstat -ano | findstr :5001
netstat -ano | findstr :5173

# macOS/Linux
lsof -i :5000
lsof -i :5001
lsof -i :5173
```

### ✅ Check MongoDB Connection

```bash
# In MongoDB Compass or command:
db.admins.find()  # Should return empty array or connected message
```

### ✅ Test Backend API

```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{"success": true, "message": "Backend is running"}
```

### ✅ Test ML API

```bash
curl http://127.0.0.1:5001/
```

Should return JSON with API info.

---

## Troubleshooting

### Problem: Port Already in Use

**Solution 1: Check What's Using the Port (Windows)**
```bash
# Find the process ID (PID)
netstat -ano | findstr :5000

# Kill the process
taskkill /PID <PID_NUMBER> /F
```

**Solution 2: Use Different Port**

Edit `.env` files and change ports, then restart.

### Problem: "Python not found"

**Verify Installation:**
```bash
python --version
```

**If not found:**
1. Reinstall Python from https://www.python.org/
2. **IMPORTANT**: Check "Add Python to PATH"
3. Restart computer
4. Try again

**Workaround:**
```bash
# Use full path (Windows)
C:\Users\[YourUsername]\AppData\Local\Programs\Python\Python311\python.exe

# Or use py command
py --version
py -m pip install -r requirements.txt
```

### Problem: "Node not found"

**Verify Installation:**
```bash
node --version
npm --version
```

**If not found:**
1. Reinstall Node.js from https://nodejs.org/
2. Restart computer
3. Try again

### Problem: MongoDB Connection Failed

**Check if MongoDB is Running:**
- Open MongoDB Compass
- Should show "Connected" at top
- Or check if mongod.exe is running in Windows Task Manager

**If not running:**

**Windows Option 1: MongoDB Compass**
1. Download from https://www.mongodb.com/products/tools/compass
2. Open and click "Connect"

**Windows Option 2: Start Service**
```bash
# If installed as service
net start MongoDB

# Or manually run
mongod
```

### Problem: npm install fails

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Problem: pip install fails

```bash
# Upgrade pip first
python -m pip install --upgrade pip

# Try install again
pip install -r requirements.txt

# If still fails, install individually
pip install scikit-learn
pip install pandas
pip install numpy
pip install flask
pip install flask-cors
```

### Problem: Can't access http://localhost:5173

1. Check Frontend terminal - should say "ready in XXX ms"
2. Check browser console (F12) for errors
3. Verify Vite config file exists
4. Try hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### Problem: Login not working

1. Verify Backend is running (check terminal for logs)
2. Check MongoDB is running
3. Clear browser cache: F12 → Application → Clear Storage
4. Check browser console for error messages
5. Verify .env files are created with correct URLs

### Problem: Prediction not working

1. Verify ML API is running (check Terminal 1)
2. Check ML API logs for errors
3. Verify symptoms are selected correctly
4. Check ML model file exists: `ml-model/model.pkl`
5. Clear browser cache and try again

---

## First Steps

### Step 1: Create Account

1. Go to http://localhost:5173
2. Click "Register" button
3. Fill in:
   - Full Name
   - Email (unique)
   - Password (min 6 chars)
4. Click "Register"
5. Should redirect to login

### Step 2: Login

1. Go to http://localhost:5173
2. Enter email and password
3. Click "Login"
4. Should see Dashboard

### Step 3: Complete Profile

1. Click "Profile" in top menu
2. Click "Edit Profile"
3. Fill in health information:
   - Age, Gender
   - Height, Weight
   - Medical history
   - Medications
4. Click "Save Changes"

### Step 4: Test Symptom Checker

1. From Dashboard, click "Get Started"
2. Click "Symptom Checker"
3. Select symptoms from list:
   - e.g., Fever, Headache, Cough
4. Click "Get Prediction"
5. View results with:
   - Disease prediction
   - Confidence score
   - Top 3 possibilities
   - Recommended medicines

### Step 5: View Results

1. Go to "Dashboard" to see statistics
2. Click "Results" to see prediction history
3. Each prediction shows:
   - Date
   - Symptoms
   - Disease
   - Confidence %

---

## Common Tasks

### Stop All Services

**Option 1:** Close all terminal windows (Ctrl+C or close button)

**Option 2:** Windows Task Manager
- Find: node.exe, python.exe, mongod.exe
- Right-click → End Task

### Restart Services

1. Close all terminals/applications
2. Wait 5 seconds
3. Start MongoDB again (if not running as service)
4. Run START_ALL.bat or start terminals manually

### Update Dependencies

```bash
# Backend
cd backend && npm update && cd ..

# Frontend
cd frontend && npm update && cd ..

# Python
pip install --upgrade -r ml-model/requirements.txt
```

### Clear Database

```bash
# In MongoDB Compass:
# Right-click database → Delete Database → medguard

# Or in terminal:
mongo
db.dropDatabase()
exit
```

### Export Data

Backend provides debug routes:
```bash
# Get all users
curl http://localhost:5000/api/debug/users

# Get all predictions
curl http://localhost:5000/api/debug/predictions
```

---

## Performance Tips

1. **Keep MongoDB running** in background
2. **Use Chrome/Firefox** for best compatibility
3. **Close unused applications** to free RAM
4. **Disable browser extensions** if experiencing issues
5. **Keep VS Code closed** if low on RAM

---

## Next Steps

1. ✅ Complete setup and verification
2. ✅ Create test account
3. ✅ Explore all features
4. ✅ Check code in each folder
5. 📚 Read code documentation
6. 🚀 Deploy to production (advanced)

---

## Support Resources

- **Node.js Issues**: https://nodejs.org/en/docs/
- **Python Issues**: https://docs.python.org/3/
- **MongoDB Issues**: https://docs.mongodb.com/manual/
- **React Issues**: https://react.dev/
- **Express Issues**: https://expressjs.com/

---

**Last Updated**: April 2026  
**Version**: 1.0.0
