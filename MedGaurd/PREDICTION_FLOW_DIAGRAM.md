# MedGuard - Prediction Data Flow

## Complete Flow Diagram

```
FRONTEND (SymptomChecker.jsx)
    |
    | POST /api/predict
    | {symptoms: ["fever", "headache"]}
    |
    v
BACKEND (server.js)
    |
    |-- Validate symptoms array
    |-- Call Flask ML API: POST http://127.0.0.1:5001/predict
    |
    v
FLASK ML API (ml_api.py)
    |
    |-- Load model and symptoms list
    |-- Convert symptoms to binary vector
    |-- Make prediction: model.predict()
    |-- Get probabilities: model.predict_proba()
    |-- Get medicines: get_medicines()
    |
    |-- Response (HTTP 200):
    | {
    |   "success": true,
    |   "disease": "Heart attack",
    |   "confidence": 0.1392,
    |   "confidence_percentage": "13.92%",
    |   "top3": [["Heart attack", 0.1392], ["Pneumonia", 0.0892], ...],
    |   "medicines": ["Aspirin", "Nitroglycerin", ...],
    |   "user_symptoms": ["chest_pain", "chills", ...],
    |   "disclaimer": "..."
    | }
    |
    v
BACKEND (server.js) - Process Response
    |
    |-- Check: mlResponse.status === 200? ✓
    |-- Calculate risk level based on confidence
    |-- Create Prediction object
    |-- Save to MongoDB
    |-- Update user.totalPredictions
    |
    |-- Response (HTTP 200):
    | {
    |   "success": true,
    |   "disease": "Heart attack",
    |   "confidence": 0.1392,
    |   "confidence_percentage": "13.92%",
    |   "top3": [["Heart attack", 0.1392], ...],
    |   "medicines": [...],
    |   "user_symptoms": [...],
    |   "disclaimer": "...",
    |   "riskLevel": "Low"
    | }
    |
    v
FRONTEND (SymptomChecker.jsx) - Display
    |
    |-- Check: response.data.success === true? ✓
    |-- Set prediction state
    |-- Show results:
    |   - prediction.disease
    |   - prediction.confidence_percentage
    |   - prediction.top3
    |   - prediction.medicines
    |   - prediction.riskLevel
```

## What Changed (Fixed)

### 1. **Risk Level Calculation Bug** ❌→✅
**Before:**
```javascript
if (mlResponse.data.confidence_percentage > 80) // STRING "13.92%" > 80 = always false
```

**After:**
```javascript
const confidenceNumber = mlResponse.data.confidence * 100;
if (confidenceNumber > 80)
```

### 2. **Database Save Format** ❌→✅
**Before:**
```javascript
confidence: mlResponse.data.confidence_percentage,  // "13.92%" (string)
top3: mlResponse.data.top3  // [["disease", 0.13], ...]
```

**After:**
```javascript
confidence: mlResponse.data.confidence,  // 0.1392 (number)
top3: mlResponse.data.top3.map(item => ({disease: item[0], confidence: item[1]}))
```

### 3. **Response Format** ❌→✅
**Before:**
```javascript
res.json({success: true, ...mlResponse.data, riskLevel})  // Spread operator
```

**After:**
```javascript
res.json({
  success: true,
  disease: mlResponse.data.disease,
  confidence: mlResponse.data.confidence,
  confidence_percentage: mlResponse.data.confidence_percentage,
  top3: mlResponse.data.top3,
  medicines: mlResponse.data.medicines,
  user_symptoms: mlResponse.data.user_symptoms,
  disclaimer: mlResponse.data.disclaimer,
  riskLevel
})
```

### 4. **Error Logging** ❌→✅
Added detailed logging at each step:
- Frontend logs complete response and error details
- Backend logs all parameters and errors
- Error handling for validation failures

## Testing Steps

1. **Start all services:**
   ```bash
   # Terminal 1: Flask ML API
   cd ml-model && python ml_api.py
   
   # Terminal 2: Backend
   cd backend && npm start
   
   # Terminal 3: Frontend
   cd frontend && npm run dev
   ```

2. **Make a prediction:**
   - Login at http://localhost:5173
   - Go to Symptom Checker
   - Select symptoms (e.g., fever, headache, cough)
   - Click "Get Prediction"

3. **Check Frontend Browser Console (F12):**
   ```
   ✅ Prediction received: {
     disease: "...",
     confidence: 0.xxx,
     confidence_percentage: "xx.x%",
     top3: [...],
     medicines: [...],
     riskLevel: "Low|Medium|High"
   }
   ```

4. **Check Backend Terminal:**
   ```
   🔬 PREDICT - Received symptoms: [...]
   📊 Confidence: xx.x%
   📝 Saving prediction to database: {...}
   ✅ Prediction saved to database successfully
   ✅ User prediction count updated
   📤 Sending response to frontend: {...}
   ```

5. **Frontend should display:**
   - Disease name
   - Confidence percentage with progress bar
   - Top 3 alternative predictions
   - Medicines
   - Risk level

## Debugging Checklist

- [ ] Flask running? `curl http://127.0.0.1:5001/`
- [ ] Backend running? `curl http://localhost:5000/api/health`
- [ ] MongoDB connected? Check backend logs
- [ ] Token valid? Check localStorage
- [ ] Symptoms recognized? Flask logs show symptom count
- [ ] Prediction made? Backend logs show predicted disease
- [ ] Database saved? Backend logs show "saved successfully"
- [ ] Frontend received? Browser console shows full response
- [ ] Display renders? Prediction visible on page

## If Still Not Working

1. **Check Backend Terminal** for exact error message
2. **Check Browser Console (F12)** for response data
3. **Check MongoDB Compass** for saved prediction
4. **Verify all three services are running**
5. **Share exact error message from Terminal/Console**
