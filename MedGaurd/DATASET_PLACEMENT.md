# 📊 DATASET PLACEMENT GUIDE

## ⭐ CRITICAL: Where to Place Your Dataset

### Location
```
MedGuard/ml-model/dataset.csv
```

### Exact Path
Windows:
```
C:\Users\[YourUsername]\OneDrive\Desktop\MedGaurd\ml-model\dataset.csv
```

---

## 📋 Dataset Format Requirements

### Columns (MUST MATCH EXACTLY)
```
Disease, Symptom_1, Symptom_2, Symptom_3, ..., Symptom_17
```

### Data Types
- **Disease** (String): Disease name
- **Symptom_1 to Symptom_17** (String): Symptom names or blank/NaN

### Example Structure

```csv
Disease,Symptom_1,Symptom_2,Symptom_3,Symptom_4,Symptom_5,Symptom_6,Symptom_7,Symptom_8,Symptom_9,Symptom_10,Symptom_11,Symptom_12,Symptom_13,Symptom_14,Symptom_15,Symptom_16,Symptom_17
Fungal infection,itching,skin_rash,nodal_skin_eruptions,,,,,,,,,,,,,
Fungal infection,itching,skin_rash,,,,,,,,,,,,,,,
AIDS,itching,nodal_skin_eruptions,patches_in_throat,mouth_ulcers,throat_irritation,,,,,,,,,,,,
AIDS,chills,fatigue,weight_loss,joint_pain,night_sweats,,,,,,,,,,,,
Allergy,continuous_sneezing,shivering,chills,watering_from_eyes,nasal_congestion,,,,,,,,,,,,
GERD,chest_pain,acidity,upper_stomach_pain,indigestion,burning_in_stomach,,,,,,,,,,,,
Pneumonia,cough,high_fever,breathlessness,chest_pain,fatigue,,,,,,,,,,,,
Influenza (H1N1),cough,high_fever,headache,body_ache,chills,,,,,,,,,,,,
```

---

## ✅ VERIFICATION CHECKLIST

Before running, verify your dataset:

- [ ] File is named `dataset.csv` (exact name)
- [ ] File is in `ml-model/` folder
- [ ] File has 18 columns (Disease + 17 Symptoms)
- [ ] Column names match exactly (case-sensitive)
- [ ] Data has at least 1000 rows
- [ ] CSV format (comma-separated)
- [ ] No special characters in column names
- [ ] Empty cells are blank (or NaN)
- [ ] Disease names are consistent (no typos)

---

## 🔍 Sample Dataset Preview

```
Row 1: Disease, Symptom_1, Symptom_2, ...
Row 2: Fungal infection, itching, skin_rash, ...
Row 3: AIDS, itching, nodal_skin_eruptions, ...
Row 4: Allergy, continuous_sneezing, shivering, ...
...
```

---

## 🚨 Common Issues & Solutions

### Issue: "Dataset not found"
**Solution:** 
- Verify file is named exactly `dataset.csv`
- Check it's in `ml-model/` folder
- Verify path: `MedGaurd/ml-model/dataset.csv`

### Issue: "Column mismatch"
**Solution:**
- Ensure first column is `Disease`
- Next 17 columns: `Symptom_1`, `Symptom_2`, ..., `Symptom_17`
- No extra columns
- Column names are case-sensitive

### Issue: "Not enough data"
**Solution:**
- Dataset needs at least 1000 rows
- More rows = better accuracy (4000+ recommended)

### Issue: "Model accuracy too low"
**Solution:**
- Check data quality
- Verify no duplicate rows
- Ensure symptoms are consistent (no typos)
- Check disease distribution (balanced is better)

---

## 💾 How to Create/Convert Dataset

### Option 1: Using Excel
1. Open Excel
2. Create columns: Disease, Symptom_1, Symptom_2, ..., Symptom_17
3. Add your data
4. Save as CSV (File → Save As → CSV format)
5. Move to `ml-model/dataset.csv`

### Option 2: Using Python
```python
import pandas as pd

# Create sample dataset
data = {
    'Disease': ['Fungal infection', 'AIDS', 'Allergy'],
    'Symptom_1': ['itching', 'itching', 'continuous_sneezing'],
    'Symptom_2': ['skin_rash', 'nodal_skin_eruptions', 'shivering'],
    # ... add more symptoms (up to Symptom_17)
}

df = pd.DataFrame(data)
df.to_csv('ml-model/dataset.csv', index=False)
```

### Option 3: Using Google Sheets
1. Create sheet with required columns
2. Add your data
3. File → Download → CSV format
4. Move to `ml-model/dataset.csv`

---

## 📊 Expected Data Structure

### Minimum Requirements
- **Rows:** 1000+ (4000+ recommended)
- **Columns:** 18 (1 Disease + 17 Symptoms)
- **File Size:** 50KB - 500KB typical

### Optional Optimizations
- Remove duplicate rows
- Balance disease classes
- Handle missing values consistently
- Standardize symptom names (lowercase)

---

## 🎯 Directory Structure After Placing Dataset

```
MedGaurd/
├── ml-model/
│   ├── dataset.csv          ✅ YOUR DATASET (NEWLY PLACED)
│   ├── train_model.py       (existing)
│   ├── ml_api.py           (existing)
│   ├── medicine_db.py      (existing)
│   ├── requirements.txt    (existing)
│   └── README.md           (existing)
```

---

## ⚡ Next Steps After Placing Dataset

### Step 1: Verify File
```bash
# Windows - Check file exists
dir ml-model\dataset.csv

# Mac/Linux - Check file exists
ls -la ml-model/dataset.csv
```

### Step 2: Train Model
```bash
cd ml-model
python train_model.py
```

**Expected Output:**
```
✅ Dataset loaded: 4920 rows, 18 columns
✅ Found 41 unique diseases
✅ Found 132 unique symptoms
...
✅ Test Accuracy: 95.23%
✅ Model saved!
```

### Step 3: Start Services
See RUN_INSTRUCTIONS.md for complete steps

---

## 📝 Dataset Format Tips

### Symptom Names
- Use lowercase with underscores: `high_fever`, `chest_pain`, `skin_rash`
- Avoid spaces and special characters
- Be consistent (spell-check!)

### Disease Names
- Use full names: `Fungal infection`, `AIDS`, not `AIDS/HIV`
- Capitalize first letter
- Be consistent

### Missing Values
- Leave blank (empty cell) or put `NaN`
- Don't put `0`, `None`, or `?`
- Blank cells are automatically handled

### Example of Good Format
```
Disease,Symptom_1,Symptom_2,Symptom_3,Symptom_4,Symptom_5,...
Fungal infection,itching,skin_rash,nodal_skin_eruptions,,,
AIDS,chills,fatigue,weight_loss,night_sweats,,
Allergy,continuous_sneezing,shivering,chills,watering_from_eyes,
```

---

## 🔗 Sample Datasets

If you don't have a dataset, you can find examples at:
- Kaggle: Search "disease symptoms prediction"
- UCI ML Repository
- GitHub medical datasets

Requirements:
- Must have disease column
- Must have symptom columns
- CSV format

---

## ✨ Once Dataset is Placed

1. ✅ Place `dataset.csv` in `ml-model/`
2. ✅ Run `python train_model.py`
3. ✅ Start all services
4. ✅ Open http://localhost:5173
5. ✅ Use Symptom Checker!

---

## 📞 Troubleshooting

### Still having issues?
1. Check file name: `dataset.csv` (exact)
2. Check folder: `ml-model/` (exact)
3. Check format: CSV (not Excel, not JSON)
4. Check columns: 18 total (Disease + 17 Symptoms)
5. Check rows: 1000+ rows

---

**Your dataset placement is the first critical step!**
*Once done, follow RUN_INSTRUCTIONS.md*
