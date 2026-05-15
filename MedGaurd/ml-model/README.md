# 🧠 ML Model Documentation

## Overview

The ML model is a production-grade disease prediction system using RandomForestClassifier that achieves 95%+ accuracy.

## Architecture

```
dataset.csv (4920 rows × 18 columns)
    ↓
train_model.py (Preprocessing)
    ↓
Binary Feature Vectors (4920 × 132)
    ↓
RandomForestClassifier (n_estimators=300)
    ↓
model.pkl + symptoms_list.pkl
    ↓
ml_api.py (Flask API)
    ↓
Backend API (/api/predict)
    ↓
React Frontend (Symptom Checker)
```

## Files

### train_model.py
**Purpose:** Data preprocessing and model training

**Process:**
1. Load dataset.csv
2. Handle missing values (NaN → '')
3. Extract unique symptoms from 17 symptom columns
4. Create symptom index mapping
5. Convert to binary feature vectors
6. Train RandomForestClassifier
7. Evaluate accuracy
8. Save model.pkl and symptoms_list.pkl

**Run:**
```bash
python train_model.py
```

**Output:**
- model.pkl (ML model)
- symptoms_list.pkl (all symptoms in order)
- Console output with accuracy metrics

### ml_api.py
**Purpose:** Flask API server for predictions

**Endpoints:**
- GET / → Health check
- GET /symptoms → All available symptoms
- POST /predict → Disease prediction
- POST /batch-predict → Multiple predictions

**Run:**
```bash
python ml_api.py
```

**Server:** http://127.0.0.1:5001

### medicine_db.py
**Purpose:** Medicine recommendations database

**Contains:**
- Mapping of diseases to medicines
- get_medicines(disease) function
- 40+ diseases with multiple medicines each

## Dataset Format

**Required columns:**
- `Disease` - Target variable
- `Symptom_1` to `Symptom_17` - Symptom strings

**Example:**
```
Disease,Symptom_1,Symptom_2,Symptom_3,...,Symptom_17
Fungal infection,itching,skin_rash,nodal_skin_eruptions,...,
AIDS,itching,nodal_skin_eruptions,patches_in_throat,...,
```

## How It Works

### 1. Data Preprocessing
```python
# Input
patient_symptoms = ["itching", "skin_rash"]
all_symptoms = ["itching", "skin_rash", "fever", ..., "cough"]

# Process
binary_vector = [1, 1, 0, ..., 0]  # 132 features

# Model
prediction = model.predict([binary_vector])
probabilities = model.predict_proba([binary_vector])
```

### 2. Prediction Process
1. User selects symptoms
2. Convert to binary vector
3. Pass to RandomForestClassifier
4. Get probability scores for all diseases
5. Return top 3 predictions
6. Get medicines from database

### 3. API Response
```json
{
  "success": true,
  "disease": "Fungal infection",
  "confidence": 0.92,
  "confidence_percentage": "92.0%",
  "top3": [
    ["Fungal infection", 0.92],
    ["Allergy", 0.05],
    ["Psoriasis", 0.03]
  ],
  "medicines": ["Clotrimazole", "Fluconazole"],
  "user_symptoms": ["itching", "skin_rash"],
  "disclaimer": "..."
}
```

## Model Performance

**Test Accuracy:** 95%+
**Training Samples:** 4920
**Test Samples:** 984
**Unique Diseases:** 41
**Total Features:** 132

## Requirements

```
flask==2.3.0              # Web framework
flask-cors==4.0.0         # Cross-origin requests
pandas==1.5.3             # Data processing
scikit-learn==1.2.2       # ML algorithms
numpy==1.24.3             # Numerical computing
requests==2.31.0          # HTTP requests
```

## Usage

### Step 1: Train Model (First Time Only)
```bash
python train_model.py
```

### Step 2: Start Flask Server
```bash
python ml_api.py
```

### Step 3: Make Predictions (via Backend)
```bash
curl -X POST http://127.0.0.1:5001/predict \
  -H "Content-Type: application/json" \
  -d '{"symptoms": ["itching", "skin_rash"]}'
```

## Error Handling

The API handles:
- Missing required fields
- Invalid symptom names
- Empty symptom lists
- Non-list inputs
- Unrecognized symptoms
- Model not found
- Symptoms list not found

All errors return proper JSON responses with error messages.

## Performance Optimization

- Vectorized NumPy operations
- Parallel tree prediction (n_jobs=-1)
- Efficient symptom lookup
- Minimal API overhead

## Future Improvements

1. Add more diseases to medicine database
2. Include medicine dosages
3. Add side effects information
4. Implement symptom severity levels
5. Add symptom feedback for accuracy improvement
6. Cache predictions
7. Add more ML models and ensemble

## Troubleshooting

**Issue: Model not found**
- Run: `python train_model.py`

**Issue: Symptoms list not found**
- Regenerate: `python train_model.py`

**Issue: Low accuracy**
- Check dataset quality
- Verify data preprocessing
- Tune model hyperparameters
- Ensure balanced classes

**Issue: API not responding**
- Check port 5001 is free
- Verify Flask is running
- Check console for errors
