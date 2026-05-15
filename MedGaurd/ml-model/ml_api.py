"""
MedGuard Flask ML API
Serves disease predictions based on symptoms
Runs on http://127.0.0.1:5000
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import os
from medicine_db import get_medicines

# ==================== INITIALIZATION ====================
app = Flask(__name__)
CORS(app)

MODEL_PATH = "model.pkl"
SYMPTOMS_PATH = "symptoms_list.pkl"

# Load model and symptoms
print("🚀 Starting MedGuard ML API...")
print("=" * 60)

if not os.path.exists(MODEL_PATH):
    print(f"❌ ERROR: {MODEL_PATH} not found!")
    print(f"   Run 'python train_model.py' first to train the model")
    exit(1)

if not os.path.exists(SYMPTOMS_PATH):
    print(f"❌ ERROR: {SYMPTOMS_PATH} not found!")
    print(f"   Run 'python train_model.py' first")
    exit(1)

try:
    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
    print("✅ Model loaded successfully")
except Exception as e:
    print(f"❌ Failed to load model: {e}")
    exit(1)

try:
    with open(SYMPTOMS_PATH, 'rb') as f:
        all_symptoms = pickle.load(f)
    print(f"✅ Symptoms list loaded: {len(all_symptoms)} symptoms")
except Exception as e:
    print(f"❌ Failed to load symptoms: {e}")
    exit(1)

# ==================== HELPER FUNCTIONS ====================

def convert_symptoms_to_vector(user_symptoms):
    """
    Convert user symptom list to binary feature vector
    
    Args:
        user_symptoms (list): List of symptom strings
    
    Returns:
        np.array: Binary feature vector
    """
    # Normalize symptoms (lowercase)
    user_symptoms = [s.strip().lower() for s in user_symptoms if s and str(s).strip().lower() != 'nan']
    
    # Create binary vector
    binary_vector = np.array([1 if symptom in user_symptoms else 0 
                             for symptom in all_symptoms])
    
    return binary_vector

def get_top_predictions(disease_probabilities, top_n=3):
    """
    Get top N disease predictions with confidence scores
    
    Args:
        disease_probabilities (dict): {disease: probability}
        top_n (int): Number of top predictions to return
    
    Returns:
        list: Top predictions [[disease, confidence], ...]
    """
    sorted_diseases = sorted(disease_probabilities.items(), 
                            key=lambda x: x[1], 
                            reverse=True)
    
    return [[disease, float(prob)] for disease, prob in sorted_diseases[:top_n]]

# ==================== API ROUTES ====================

@app.route('/', methods=['GET'])
def home():
    """Health check endpoint"""
    return jsonify({
        "status": "running",
        "api": "MedGuard ML API",
        "version": "1.0",
        "symptoms_count": len(all_symptoms),
        "endpoints": {
            "predict": "POST /predict",
            "symptoms": "GET /symptoms",
            "health": "GET /"
        }
    }), 200

@app.route('/symptoms', methods=['GET'])
def get_symptoms():
    """Get list of all available symptoms"""
    return jsonify({
        "count": len(all_symptoms),
        "symptoms": all_symptoms
    }), 200

@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict disease based on symptoms
    
    Expected JSON:
    {
        "symptoms": ["itching", "skin_rash", ...]
    }
    
    Returns:
    {
        "success": true,
        "disease": "Fungal infection",
        "confidence": 0.91,
        "top3": [
            ["Fungal infection", 0.91],
            ["Allergy", 0.06],
            ["Psoriasis", 0.03]
        ],
        "medicines": ["Clotrimazole", "Fluconazole"],
        "disclaimer": "..."
    }
    """
    
    try:
        # Get JSON data
        data = request.get_json()
        
        if not data or 'symptoms' not in data:
            return jsonify({
                "success": False,
                "error": "Invalid request. Expected 'symptoms' field."
            }), 400
        
        user_symptoms = data['symptoms']
        
        # Validate input
        if not isinstance(user_symptoms, list):
            return jsonify({
                "success": False,
                "error": "'symptoms' must be a list"
            }), 400
        
        if len(user_symptoms) == 0:
            return jsonify({
                "success": False,
                "error": "Please select at least one symptom"
            }), 400
        
        # Convert symptoms to binary vector
        feature_vector = convert_symptoms_to_vector(user_symptoms)
        
        # Check if at least one known symptom was provided
        if np.sum(feature_vector) == 0:
            return jsonify({
                "success": False,
                "error": f"No recognized symptoms found. Available symptoms: {all_symptoms[:10]}..."
            }), 400
        
        # Make prediction
        prediction = model.predict([feature_vector])[0]
        
        # Get probability scores
        probabilities = model.predict_proba([feature_vector])[0]
        classes = model.classes_
        
        # Create disease-probability mapping
        disease_probs = {disease: prob for disease, prob in zip(classes, probabilities)}
        
        # Get top 3 predictions
        top3 = get_top_predictions(disease_probs, top_n=3)
        confidence = float(top3[0][1])
        
        # Get medicines
        medicines = get_medicines(prediction)
        
        # Return response
        response = {
            "success": True,
            "disease": str(prediction),
            "confidence": round(confidence, 2),
            "confidence_percentage": f"{confidence * 100:.1f}%",
            "top3": top3,
            "medicines": medicines,
            "user_symptoms": user_symptoms,
            "disclaimer": "⚠️ This is an AI-based prediction system. It should NOT replace professional medical advice. Please consult a qualified healthcare provider for proper diagnosis and treatment."
        }
        
        print(f"\n🔍 PREDICTION REQUEST:")
        print(f"   Symptoms: {user_symptoms}")
        print(f"   Predicted Disease: {prediction}")
        print(f"   Confidence: {confidence:.2%}")
        
        return jsonify(response), 200
    
    except Exception as e:
        print(f"❌ Error in /predict: {str(e)}")
        return jsonify({
            "success": False,
            "error": f"Internal server error: {str(e)}"
        }), 500

@app.route('/batch-predict', methods=['POST'])
def batch_predict():
    """
    Predict diseases for multiple patients
    
    Expected JSON:
    {
        "patients": [
            {"id": 1, "symptoms": [...]},
            {"id": 2, "symptoms": [...]}
        ]
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'patients' not in data:
            return jsonify({"success": False, "error": "Expected 'patients' field"}), 400
        
        patients = data['patients']
        results = []
        
        for patient in patients:
            patient_id = patient.get('id', 'unknown')
            symptoms = patient.get('symptoms', [])
            
            try:
                # Convert to vector
                feature_vector = convert_symptoms_to_vector(symptoms)
                
                if np.sum(feature_vector) == 0:
                    results.append({
                        "id": patient_id,
                        "success": False,
                        "error": "No recognized symptoms"
                    })
                    continue
                
                # Predict
                prediction = model.predict([feature_vector])[0]
                probabilities = model.predict_proba([feature_vector])[0]
                classes = model.classes_
                disease_probs = {disease: prob for disease, prob in zip(classes, probabilities)}
                top3 = get_top_predictions(disease_probs, top_n=3)
                
                results.append({
                    "id": patient_id,
                    "success": True,
                    "disease": str(prediction),
                    "confidence": round(float(top3[0][1]), 2),
                    "top3": top3,
                    "medicines": get_medicines(prediction)
                })
            except Exception as e:
                results.append({
                    "id": patient_id,
                    "success": False,
                    "error": str(e)
                })
        
        return jsonify({"success": True, "results": results}), 200
    
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# ==================== ERROR HANDLERS ====================

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def server_error(error):
    return jsonify({"error": "Internal server error"}), 500

# ==================== MAIN ====================

if __name__ == '__main__':
    print(f"📊 Model Classes: {len(model.classes_)} diseases")
    print(f"🔧 Features: {len(all_symptoms)} symptoms")
    print("\n" + "=" * 60)
    print("✅ MedGuard ML API is running!")
    print("=" * 60)
    print("\n🌐 API Endpoints:")
    print("   • GET  / → Health check")
    print("   • GET  /symptoms → List all symptoms")
    print("   • POST /predict → Disease prediction")
    print("   • POST /batch-predict → Batch predictions")
    print(f"🔗 Server: http://127.0.0.1:5001")
    print("=" * 60 + "\n")
    
    app.run(host='127.0.0.1', port=5001, debug=False)
