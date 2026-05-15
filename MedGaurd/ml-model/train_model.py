"""
MedGuard ML Model Training Script
Preprocesses symptom data and trains disease prediction model
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import pickle
import os

# ==================== CONFIGURATION ====================
DATASET_PATH = "dataset.csv"
MODEL_OUTPUT = "model.pkl"
SYMPTOMS_OUTPUT = "symptoms_list.pkl"

print("=" * 60)
print("🏥 MedGuard ML Model Training")
print("=" * 60)

# ==================== STEP 1: LOAD DATASET ====================
print("\n📂 Loading dataset...")
if not os.path.exists(DATASET_PATH):
    print(f"❌ ERROR: {DATASET_PATH} not found!")
    print(f"📍 Place your dataset.csv in the ml-model folder")
    exit(1)

df = pd.read_csv(DATASET_PATH)
print(f"✅ Dataset loaded: {df.shape[0]} rows, {df.shape[1]} columns")

# ==================== STEP 2: DATA PREPROCESSING ====================
print("\n🔧 Preprocessing data...")

# Replace NaN with empty strings
df = df.fillna('')

# Get disease column
diseases = df['Disease'].values
print(f"✅ Found {len(np.unique(diseases))} unique diseases")
print(f"   Diseases: {', '.join(list(np.unique(diseases))[:10])}...")

# ==================== STEP 3: EXTRACT ALL SYMPTOMS ====================
print("\n📋 Extracting symptoms...")

# Get all symptom columns (Symptom_1 to Symptom_17)
symptom_columns = [col for col in df.columns if col.startswith('Symptom_')]
print(f"✅ Found {len(symptom_columns)} symptom columns")

# Collect all unique symptoms
all_symptoms = set()
for col in symptom_columns:
    symptoms_in_col = df[col].unique()
    # Add non-empty symptoms
    for symptom in symptoms_in_col:
        if symptom and symptom.strip():  # Ignore empty strings
            all_symptoms.add(symptom.strip().lower())

# Convert to sorted list
all_symptoms = sorted(list(all_symptoms))
print(f"✅ Found {len(all_symptoms)} unique symptoms")
print(f"   Sample: {all_symptoms[:15]}")

# Create symptom index mapping
symptom_index = {symptom: idx for idx, symptom in enumerate(all_symptoms)}

# ==================== STEP 4: CREATE BINARY FEATURE VECTORS ====================
print("\n🔨 Creating binary feature vectors...")

X = []
y = []

for idx, row in df.iterrows():
    # Get all symptoms for this patient
    patient_symptoms = set()
    for col in symptom_columns:
        symptom = str(row[col]).strip().lower()
        if symptom and symptom != 'nan':
            patient_symptoms.add(symptom)
    
    # Create binary vector
    binary_vector = [1 if symptom in patient_symptoms else 0 
                     for symptom in all_symptoms]
    
    X.append(binary_vector)
    y.append(row['Disease'])
    
    if (idx + 1) % 100 == 0:
        print(f"   ✓ Processed {idx + 1}/{len(df)} rows")

X = np.array(X)
y = np.array(y)

print(f"✅ Feature matrix shape: {X.shape}")
print(f"✅ Label shape: {y.shape}")

# ==================== STEP 5: TRAIN MODEL ====================
print("\n🧠 Training RandomForestClassifier...")

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
print(f"✅ Split: {len(X_train)} train, {len(X_test)} test")

# Train model with strong parameters
model = RandomForestClassifier(
    n_estimators=300,
    max_depth=25,
    random_state=42,
    n_jobs=-1,
    verbose=1
)

model.fit(X_train, y_train)
print("✅ Model training complete!")

# ==================== STEP 6: EVALUATE MODEL ====================
print("\n📊 Model Evaluation:")

train_predictions = model.predict(X_train)
train_accuracy = accuracy_score(y_train, train_predictions)
print(f"✅ Train Accuracy: {train_accuracy:.2%}")

test_predictions = model.predict(X_test)
test_accuracy = accuracy_score(y_test, test_predictions)
print(f"✅ Test Accuracy: {test_accuracy:.2%}")

# Print classification report
print("\n📈 Classification Report (first 5 diseases):")
unique_diseases = np.unique(y_test)[:5]
print(classification_report(y_test, test_predictions, 
                           labels=unique_diseases, 
                           zero_division=0))

# ==================== STEP 7: FEATURE IMPORTANCE ====================
print("\n⭐ Top 15 Most Important Features (Symptoms):")
feature_importance = model.feature_importances_
top_indices = np.argsort(feature_importance)[-15:][::-1]

for rank, idx in enumerate(top_indices, 1):
    symptom = all_symptoms[idx]
    importance = feature_importance[idx]
    print(f"   {rank:2d}. {symptom:25s} → {importance:.4f}")

# ==================== STEP 8: SAVE MODEL ====================
print(f"\n💾 Saving model to {MODEL_OUTPUT}...")
with open(MODEL_OUTPUT, 'wb') as f:
    pickle.dump(model, f)
print("✅ Model saved!")

print(f"💾 Saving symptoms list to {SYMPTOMS_OUTPUT}...")
with open(SYMPTOMS_OUTPUT, 'wb') as f:
    pickle.dump(all_symptoms, f)
print("✅ Symptoms list saved!")

# ==================== SUMMARY ====================
print("\n" + "=" * 60)
print("✅ MODEL TRAINING COMPLETE!")
print("=" * 60)
print(f"\n📊 Summary:")
print(f"   • Test Accuracy: {test_accuracy:.2%}")
print(f"   • Total Diseases: {len(np.unique(y))}")
print(f"   • Total Symptoms: {len(all_symptoms)}")
print(f"   • Features per patient: {X.shape[1]}")
print(f"   • Training samples: {len(X_train)}")
print(f"   • Test samples: {len(X_test)}")
print(f"\n📁 Output Files:")
print(f"   • {MODEL_OUTPUT} (model)")
print(f"   • {SYMPTOMS_OUTPUT} (symptoms)")
print(f"\n🚀 Next step: Run 'python ml_api.py' to start Flask server")
print("=" * 60)
