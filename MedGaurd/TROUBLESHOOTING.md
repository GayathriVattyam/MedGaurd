# 🔧 MedGuard - Troubleshooting Guide

## Common Issues & Solutions

---

## 🔴 CRITICAL ISSUES (App Won't Start)

### Issue 1: "mongod not found" or "MongoDB not running"

**Symptoms:**
- Backend terminal shows: `MongoServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017`
- MongoDB Compass shows "Cannot connect"

**Solutions:**

**Windows Option 1: Start MongoDB Service**
```bash
# PowerShell (Admin)
net start MongoDB

# If service doesn't exist, start manually:
mongod
```

**Windows Option 2: MongoDB Compass**
1. Download from https://www.mongodb.com/products/tools/compass
2. Open MongoDB Compass application
3. Click "Connect" button (default settings)
4. Should show "Connected" with a green dot

**Windows Option 3: Check if Already Running**
```bash
# Task Manager → Check for mongod.exe process
# If not there, run: mongod
```

**Keep MongoDB Running** - Don't close the mongod window while using the app!

---

### Issue 2: "npm: command not found"

**Symptoms:**
- Terminal shows: `npm: command not found` or `npm: The term 'npm' is not recognized`

**Solutions:**

**Step 1: Verify Installation**
```bash
node --version
npm --version
```

**Step 2: If Not Found - Reinstall Node.js**
1. Download from https://nodejs.org/ (LTS version recommended)
2. Run installer
3. **IMPORTANT**: Use default installation path
4. **IMPORTANT**: Check "Add to PATH" during installation
5. **RESTART COMPUTER**
6. Try again in new terminal window

**Step 3: Verify PATH**
```bash
# Windows PowerShell
$env:PATH  # Check if Node.js path is listed

# Should show something like:
# C:\Program Files\nodejs\
```

**Step 4: Still Not Working?**
```bash
# Try using full path
cd backend
"C:\Program Files\nodejs\npm" install

# Or check npm location
where npm
```

---

### Issue 3: "python: command not found"

**Symptoms:**
- Terminal shows: `python: command not found` or `'python' is not recognized`

**Solutions:**

**Step 1: Verify Installation**
```bash
python --version
python3 --version  # Try this also
```

**Step 2: If Not Found - Reinstall Python**
1. Download from https://www.python.org/ (3.9+ recommended)
2. Run installer
3. **CRITICAL**: Check "Add Python to PATH" ✓
4. **CRITICAL**: Check "Add python.exe to PATH" ✓
5. **RESTART COMPUTER**
6. Try again in new terminal

**Step 3: If Still Not Found - Use Alternative Commands**
```bash
# Windows - Try these:
py --version
py -m pip install -r requirements.txt
py ml_api.py

# Or use full path:
C:\Users\[YourUsername]\AppData\Local\Programs\Python\Python311\python.exe --version
```

**Step 4: Update PATH Manually**
1. Press `Win + X` → "System"
2. Click "Advanced system settings"
3. Click "Environment Variables"
4. Under "User variables", find or create "PATH"
5. Add: `C:\Python311` (or your Python path)
6. Click OK, restart terminal

---

### Issue 4: "Port Already in Use"

**Symptoms:**
- Any service fails to start with: `Address already in use :::5000`
- `EADDRINUSE: address already in use :::5173`

**Windows Solution 1: Kill Process (Recommended)**
```bash
# Find what's using port 5000
netstat -ano | findstr :5000

# Output example:
# TCP    127.0.0.1:5000         LISTENING       1234

# Kill process with PID 1234
taskkill /PID 1234 /F

# Repeat for ports 5001 and 5173 if needed
netstat -ano | findstr :5001
netstat -ano | findstr :5173
```

**Windows Solution 2: Use Different Port**

Edit `.env` file and change PORT:
```env
# backend/.env
PORT=5002  # Changed from 5000
```

Then restart backend.

**Windows Solution 3: Restart Computer**
- Simple but effective
- Clears all ports and services

---

### Issue 5: "Cannot connect to backend from frontend"

**Symptoms:**
- Browser console (F12) shows: `GET http://localhost:5000/api/health 404`
- Login page shows error after clicking login

**Solutions:**

**Check 1: Backend Running?**
- Look at backend terminal
- Should show: `Server running on port 5000`
- Should show: `Connected to MongoDB`

**Check 2: Verify Backend URL in Frontend**

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
```

**Check 3: Clear Cache**
```bash
# In browser:
F12 → Application → Clear Storage → Clear Site Data

# Then refresh page: Ctrl+Shift+R
```

**Check 4: Verify Port 5000 is Free**
```bash
netstat -ano | findstr :5000
```

**Check 5: Check CORS Settings**

Backend `backend/.env`:
```env
CORS_ORIGIN=http://localhost:5173
```

---

## 🟡 MEDIUM ISSUES (App Starts But Has Errors)

### Issue 6: "Prediction not working / Returns error"

**Symptoms:**
- Click "Get Prediction" button
- See error message
- ML API returns error

**Solutions:**

**Check 1: ML API Running?**
- Look at ML API terminal (first one)
- Should show: `Running on http://127.0.0.1:5001`

**Check 2: Model Files Exist?**
```bash
cd ml-model

# These files MUST exist:
ls model.pkl                    # Windows: dir model.pkl
ls symptoms_list.pkl           # Windows: dir symptoms_list.pkl

# If missing, retrain:
python train_model.py
```

**Check 3: Python Packages Installed?**
```bash
cd ml-model
pip list

# Should show:
# scikit-learn
# pandas
# numpy
# flask
# flask-cors

# If missing, reinstall:
pip install -r requirements.txt
```

**Check 4: Clear Browser Cache**
```bash
F12 → Application → Cache Storage → Delete
F12 → Application → Local Storage → Clear All
```

**Check 5: Symptoms Selected?**
- Make sure you selected at least one symptom
- Some symptoms might not be in the trained model
- Try common symptoms: fever, headache, cough

---

### Issue 7: "Cannot Register / Email Already Exists"

**Symptoms:**
- Trying to register with new email
- Error: "Email already exists"
- Even though you haven't used this email before

**Solutions:**

**Option 1: Use Different Email**
```
test123@example.com
test456@example.com
```

**Option 2: Clear Database**
```bash
# Option A: MongoDB Compass
# 1. Open MongoDB Compass
# 2. Right-click "medguard" database
# 3. Select "Delete Database"
# 4. Confirm delete

# Option B: MongoDB Shell
# In command line, run:
mongo
use medguard
db.dropDatabase()
exit

# Option C: Clear specific collection
db.users.deleteMany({})
```

**Option 3: Check API Response**
```bash
# Test if backend is working
curl http://localhost:5000/api/health

# If no response, backend isn't running
```

---

### Issue 8: "Login Works But Can't Access Dashboard"

**Symptoms:**
- Successfully login
- Redirects to dashboard
- See loading screen or blank page

**Solutions:**

**Check 1: Browser Console**
1. Press F12
2. Go to "Console" tab
3. Look for red error messages
4. Read the error carefully

**Check 2: Check Network Requests**
1. Press F12
2. Go to "Network" tab
3. Reload page
4. Look for failed requests (red X)
5. Click on failed request to see details

**Check 3: Clear Local Storage**
```bash
F12 → Application → Local Storage
# Right-click http://localhost:5173 → Delete
```

**Check 4: Check Token**
```bash
F12 → Application → Local Storage
# Look for "token" key
# If missing, you're not logged in
# If present but invalid, login again
```

**Check 5: Verify Backend Response**
```bash
# Test profile endpoint
curl http://localhost:5000/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN"

# If returns error, check backend logs
```

---

### Issue 9: "Profile Updates Don't Save"

**Symptoms:**
- Edit profile
- Click save
- Data appears to save (no error)
- But data is gone after refresh

**Solutions:**

**Check 1: Check Backend Logs**
- Look at backend terminal
- Should see: `PUT /api/profile` with status 200

**Check 2: Verify MongoDB**
```bash
# In MongoDB Compass:
# medguard database → users collection
# Should see updated user data

# Or in command line:
mongo
use medguard
db.users.find()
```

**Check 3: Check Token Validity**
- Token might be expired
- Try logging out and back in
- F12 → Application → Clear Storage

**Check 4: Verify User ID**
```bash
# In browser console, check:
localStorage.getItem('user')

# Should show user object with _id
```

---

### Issue 10: "Database Disconnects After Some Time"

**Symptoms:**
- App works fine initially
- After 10-15 minutes, backend crashes
- Shows: `MongooseError: Cannot connect`

**Solutions:**

**Solution 1: Restart Services**
- Stop all terminals
- Restart MongoDB
- Restart backend
- Restart frontend

**Solution 2: Check MongoDB Memory**
- MongoDB might be running out of memory
- Restart MongoDB
- Close other applications

**Solution 3: Increase Timeout (backend/.env)**
```env
MONGO_CONNECT_TIMEOUT=10000
MONGO_SOCKET_TIMEOUT=45000
```

**Solution 4: Check MongoDB Logs**
```bash
# Look for MongoDB errors in logs
# Different by installation method
```

---

## 🟢 MINOR ISSUES (App Works But Has Small Problems)

### Issue 11: "Page Takes Long Time to Load"

**Symptoms:**
- First page load takes 10+ seconds
- Subsequent loads are fast

**This is NORMAL** - First load includes:
1. Bundling React code
2. Loading ML model
3. Database queries

**Normal load times:**
- First load: 5-15 seconds
- Subsequent loads: < 1 second
- First prediction: 2-5 seconds
- Subsequent predictions: < 1 second

**To optimize:**
1. Close unused browser tabs
2. Close unused applications
3. Give computer more RAM
4. Use Chrome/Firefox (fastest)

---

### Issue 12: "Browser Shows Loading Spinner Forever"

**Symptoms:**
- Page shows loading spinner
- Never loads
- No errors in console

**Solutions:**

**Check 1: Backend Running?**
```bash
# Terminal should show: Server running on port 5000
# If not, check backend terminal for errors
```

**Check 2: Network Connection**
```bash
# In browser, check Network tab (F12)
# Look for stuck requests
# Click on stuck request to see details
```

**Check 3: Increase Timeout**
- Backend might be processing long query
- Try refreshing page
- Wait longer

**Check 4: Hard Refresh**
```bash
# Clear cache and refresh:
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)
```

---

### Issue 13: "Styling Looks Wrong / CSS Not Loading"

**Symptoms:**
- Page layout is broken
- Colors don't look right
- Icons are missing

**Solutions:**

**Check 1: Hard Refresh**
```bash
Ctrl+Shift+R
```

**Check 2: Clear Cache**
```bash
F12 → Application → Cache Storage → Delete all
F12 → Application → Cookies → Delete all
```

**Check 3: Check Console for CSS Errors**
```bash
F12 → Console tab → Look for "404" errors
```

**Check 4: Restart Frontend**
```bash
# In frontend terminal, press Ctrl+C
# Then: npm run dev
```

---

### Issue 14: "Form Validation Not Working"

**Symptoms:**
- Can submit empty form
- Can enter invalid email
- No error messages

**Solutions:**

**Check 1: Browser Console**
```bash
F12 → Console → Look for JavaScript errors
```

**Check 2: Refresh Page**
```bash
Ctrl+Shift+R
```

**Check 3: Check HTML Input Attributes**
- Form might be missing validation
- Should have: `required`, `type="email"`, etc.

---

### Issue 15: "Symptom List Empty / Can't Select Symptoms"

**Symptoms:**
- Symptom dropdown is empty
- Can't select any symptoms
- Error about symptoms

**Solutions:**

**Check 1: Check symptoms_list.pkl**
```bash
cd ml-model
ls symptoms_list.pkl  # Should exist

# If missing, retrain:
python train_model.py
```

**Check 2: Check Backend Response**
```bash
# Get symptoms list:
curl http://localhost:5000/api/symptoms
```

**Check 3: Check Browser Console**
```bash
F12 → Console → Look for errors
```

**Check 4: Restart ML API**
```bash
# Kill ML API terminal
# Restart: cd ml-model && python ml_api.py
```

---

## 🛠️ DEBUGGING TECHNIQUES

### Technique 1: Check Terminal Logs

**What to look for in each terminal:**

**Backend Terminal:**
```
✓ "Server running on port 5000"
✓ "Connected to MongoDB"
✗ "ECONNREFUSED" - MongoDB not running
✗ "EADDRINUSE" - Port already in use
✗ Error stack traces - Shows what went wrong
```

**Frontend Terminal:**
```
✓ "ready in XXX ms"
✓ "Local: http://localhost:5173"
✗ "Module not found" - Missing dependency
✗ "Syntax error" - Code error in source
```

**ML API Terminal:**
```
✓ "Running on http://127.0.0.1:5001"
✓ "Debug mode: on"
✗ "ModuleNotFoundError" - Missing Python package
✗ "ImportError" - Can't import package
```

### Technique 2: Browser Developer Tools (F12)

**Console Tab:**
- Shows JavaScript errors (red text)
- Shows warnings (yellow text)
- Test code with commands

**Network Tab:**
- Shows all HTTP requests
- Click request to see response
- Look for 404, 500 errors

**Application Tab:**
- Local Storage - Shows saved data
- Cookies - Shows session cookies
- Cache - Shows cached files

**Elements Tab:**
- Inspect page HTML
- Check form inputs
- Debug CSS issues

### Technique 3: API Testing

```bash
# Test if backend is responding
curl http://localhost:5000/api/health

# Test if ML API is responding
curl http://127.0.0.1:5001/

# Test authentication
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Test prediction
curl -X POST http://127.0.0.1:5001/predict \
  -H "Content-Type: application/json" \
  -d '{"symptoms":["Fever","Headache"]}'
```

### Technique 4: Database Inspection

**MongoDB Compass:**
1. Open MongoDB Compass
2. Find medguard database
3. Click collections to view data
4. Right-click document to edit/delete

**Command Line:**
```bash
mongo
use medguard
show collections
db.users.find()
db.predictions.find()
db.users.findOne()
```

---

## 📋 FINAL TROUBLESHOOTING CHECKLIST

Before asking for help, verify all of these:

### Prerequisites
- [ ] Node.js v16+ installed: `node --version`
- [ ] Python 3.8+ installed: `python --version`
- [ ] MongoDB running: MongoDB Compass connected
- [ ] npm v8+ installed: `npm --version`
- [ ] pip updated: `pip --version`

### Dependencies
- [ ] Backend dependencies installed: `cd backend && npm list` (no errors)
- [ ] Frontend dependencies installed: `cd frontend && npm list` (no errors)
- [ ] Python packages installed: `pip list` (scikit-learn, pandas, numpy, flask)
- [ ] .env files created in all 3 folders
- [ ] .env files have correct URLs

### Services Running
- [ ] ML API running: Check terminal 1 for "Running on 5001"
- [ ] Backend running: Check terminal 2 for "Server running on port 5000"
- [ ] Frontend running: Check terminal 3 for "ready in"
- [ ] MongoDB running: Connected in MongoDB Compass
- [ ] All ports available: `netstat -ano | findstr :5000/5001/5173`

### Browser
- [ ] Can access http://localhost:5173: Not blank page
- [ ] Can see login form: No JavaScript errors
- [ ] Browser console clean: F12 → Console (no red errors)

### If All Checks Pass
- Application should work!
- If still having issues, collect screenshots/logs
- Check specific error messages above

---

## 💬 When to Seek Help

Gather this information before asking for help:

1. **Error message** - Exact text, screenshots
2. **When it happens** - Which step, which page
3. **Logs** - Output from terminals
4. **What you tried** - What solutions you already attempted
5. **System info** - Windows/Mac/Linux, Python version, Node version
6. **Screenshots** - Browser console errors (F12)

---

## 📞 Support Resources

- **Node.js Help**: https://nodejs.org/en/docs/
- **Python Help**: https://docs.python.org/3/
- **MongoDB Help**: https://docs.mongodb.com/manual/
- **React Help**: https://react.dev/
- **Express Help**: https://expressjs.com/
- **Flask Help**: https://flask.palletsprojects.com/

---

**Last Updated**: April 2026  
**Version**: 1.0.0

✅ **Your issue should be solved!** If not, use the checklist above and gather information to ask for help effectively.
