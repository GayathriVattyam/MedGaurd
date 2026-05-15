# ⚡ MedGuard - Quick Reference

## 🚀 Quick Start (60 seconds)

```bash
# 1. Extract MedGuard folder
# 2. Install dependencies (one time only):
cd MedGuard

cd backend && npm install && cd ..
cd frontend && npm install && cd ..
cd ml-model && pip install -r requirements.txt && cd ..

# 3. Start all services:
START_ALL.bat        # Windows - Just double-click!
# OR manually:
# Terminal 1: cd ml-model && python ml_api.py
# Terminal 2: cd backend && npm start
# Terminal 3: cd frontend && npm run dev

# 4. Open browser: http://localhost:5173
```

---

## ✅ Service Status Checklist

| Service | Port | URL | Status Command |
|---------|------|-----|-----------------|
| Frontend | 5173 | http://localhost:5173 | Open in browser |
| Backend | 5000 | http://localhost:5000/api/health | curl command |
| ML API | 5001 | http://127.0.0.1:5001 | Check terminal |
| MongoDB | 27017 | MongoDB Compass | Check Compass |

---

## 🔧 Port Conflicts Solution

**Windows - Kill Process Using Port:**
```bash
# Find process
netstat -ano | findstr :5000

# Kill it (replace PID with the number)
taskkill /PID 1234 /F
```

**macOS/Linux:**
```bash
lsof -i :5000
kill -9 <PID>
```

---

## 🗄️ MongoDB Common Commands

```bash
# Check if running (should see "Waiting for connections on port 27017")
mongod

# In MongoDB shell/Compass:
show dbs                    # List all databases
use medguard               # Select medguard database
show collections           # Show tables
db.users.find()           # View all users
db.predictions.find()     # View all predictions
db.users.drop()           # Delete all users
db.predictions.drop()     # Delete all predictions
```

---

## 📝 Environment Files (.env)

Create these files if missing:

**backend/.env:**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/medguard
JWT_SECRET=dev_secret_key
ML_API_URL=http://127.0.0.1:5001/predict
```

**frontend/.env:**
```env
VITE_API_URL=http://localhost:5000
VITE_ML_API_URL=http://127.0.0.1:5001
```

**ml-model/.env:**
```env
FLASK_ENV=development
FLASK_DEBUG=True
```

---

## 🆘 SOS Checklist

- [ ] MongoDB running? Check Compass or `mongod`
- [ ] Node v16+? Run `node --version`
- [ ] Python 3.8+? Run `python --version`
- [ ] Ports free? Run port check commands
- [ ] All 3 services started? Check terminals
- [ ] Can access http://localhost:5173? Refresh (Ctrl+Shift+R)
- [ ] Error in browser? Press F12 → Console tab
- [ ] Still failing? Check terminal logs!

---

## 🧹 Nuclear Reset (Last Resort)

```bash
# Full cleanup and reinstall
cd backend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
cd ..

cd frontend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
cd ..

cd ml-model
pip install --upgrade -r requirements.txt
cd ..

# Clear MongoDB
# In MongoDB Compass: Right-click medguard → Delete Database

# Start fresh!
# Double-click START_ALL.bat
```

---

## 🔑 Default Test Credentials

Create your own account or use:
- Email: test@example.com
- Password: test123456

(Create via Registration page)

---

## 📱 API Quick Test

```bash
# Test Backend
curl http://localhost:5000/api/health

# Test ML API  
curl http://127.0.0.1:5001/

# Test Login
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123456"}'
```

---

## 🎯 Feature Quick Guide

| Feature | Path | How To |
|---------|------|--------|
| Register | /register | Enter email, name, password |
| Login | /login | Enter credentials |
| Dashboard | /dashboard | See stats after login |
| Symptom Check | Dashboard → Symptom Checker | Select symptoms → Get Prediction |
| Profile | /profile | Edit your health info |
| Results | /results | View prediction history |

---

## 📊 File Structure

```
MedGuard/
├── backend/          # Express API
│   ├── server.js     # Main server
│   ├── .env          # Config (create this)
│   └── package.json
├── frontend/         # React app
│   ├── src/          # Source code
│   ├── .env          # Config (create this)
│   └── vite.config.js
├── ml-model/         # Python API
│   ├── ml_api.py     # Main API
│   ├── model.pkl     # ML model
│   ├── .env          # Config (create this)
│   └── requirements.txt
└── START_ALL.bat     # One-click startup
```

---

## 🐛 Error Messages & Solutions

| Error | Solution |
|-------|----------|
| "Cannot find module" | Run `npm install` in that folder |
| "Port 5000 in use" | Kill process or change port in .env |
| "Cannot connect to MongoDB" | Start MongoDB/Compass |
| "Python not found" | Reinstall Python, check PATH |
| "Module not found (Python)" | Run `pip install -r requirements.txt` |
| "CORS error in browser" | Check ML_API_URL in frontend .env |
| "Cannot POST /api/login" | Backend not running or URL wrong |
| "Prediction not working" | ML API not running or model file missing |

---

## ⏱️ First Run Timeline

| Time | Action |
|------|--------|
| 0s | Double-click START_ALL.bat |
| 2s | Flask window opens, wait for "Running on..." |
| 5s | Backend window opens, wait for "Connected to MongoDB" |
| 8s | Frontend window opens, wait for "ready" message |
| 10s | Open browser to http://localhost:5173 |
| 15s | Should see login page - Success! ✅ |

---

## 🚨 Service Won't Start?

**Flask/Python Issue:**
```bash
cd ml-model
python ml_api.py

# If error, try:
python --version  # Check version
pip list          # Check packages
pip install -r requirements.txt  # Reinstall
```

**Backend/Node Issue:**
```bash
cd backend
npm start

# If error, try:
npm install       # Reinstall
npm test          # Run tests
npm cache clean --force
```

**Frontend/Vite Issue:**
```bash
cd frontend
npm run dev

# If error, try:
npm install
npm run build     # Check if builds
```

---

## 💡 Pro Tips

1. **Keep all 3 terminals open** during development
2. **Monitor MongoDB Compass** to see data changes in real-time
3. **Use F12 in browser** to see network requests and errors
4. **Ctrl+C** stops a service (type in its terminal)
5. **First prediction is slow** (model loading) - subsequent ones are fast
6. **Clear localStorage** if stuck: F12 → Application → Local Storage → Clear All

---

## 📚 Documentation Files

- `README_PROFESSIONAL.md` - Complete technical documentation
- `SETUP_GUIDE.md` - Detailed setup instructions
- `QUICK_REFERENCE.md` - This file

---

## 🎓 Learn More

- **Frontend**: Open `frontend/src/App.jsx`
- **Backend**: Open `backend/server.js`  
- **ML Model**: Open `ml-model/ml_api.py`
- **Database**: Open MongoDB Compass → medguard

---

## ✨ You're Ready!

1. ✅ Run START_ALL.bat
2. ✅ Wait for all 3 windows
3. ✅ Open http://localhost:5173
4. ✅ Click Register
5. ✅ Create account
6. ✅ Login
7. ✅ Try Symptom Checker
8. ✅ View Results

**Enjoy MedGuard!** 🎉

---

**Version**: 1.0.0 | **Last Updated**: April 2026
