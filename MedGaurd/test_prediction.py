import requests
import json

print("=" * 60)
print("TESTING MEDGUARD PREDICTION SYSTEM")
print("=" * 60)

# Test 1: Flask API Health
print("\n1. Testing Flask API Health Check...")
try:
    response = requests.get('http://127.0.0.1:5001/', timeout=5)
    if response.status_code == 200:
        data = response.json()
        print("OK - Flask API is running!")
        print(f"   Symptoms available: {data['symptoms_count']}")
        print(f"   API version: {data['version']}")
    else:
        print(f"ERROR - Flask API error: {response.status_code}")
except Exception as e:
    print(f"ERROR - Flask API not responding: {str(e)}")

# Test 2: Get Symptoms
print("\n2. Testing Symptoms Endpoint...")
try:
    response = requests.get('http://127.0.0.1:5001/symptoms', timeout=5)
    if response.status_code == 200:
        data = response.json()
        print(f"OK - Symptoms loaded: {data['count']} total")
        print(f"   Sample symptoms: {', '.join(data['symptoms'][:5])}")
    else:
        print(f"ERROR: {response.status_code}")
except Exception as e:
    print(f"ERROR - Failed: {str(e)}")

# Test 3: Make Prediction
print("\n3. Testing Disease Prediction...")
try:
    payload = {
        "symptoms": ["shivering", "chills", "watering_from_eyes"]
    }
    response = requests.post('http://127.0.0.1:5001/predict', 
                            json=payload, 
                            timeout=5)
    if response.status_code == 200:
        data = response.json()
        print("OK - Prediction successful!")
        print(f"   Disease: {data['disease']}")
        print(f"   Confidence: {data['confidence_percentage']}")
        print(f"   Top 3:")
        for i, (disease, conf) in enumerate(data['top3'], 1):
            print(f"      {i}. {disease} ({conf*100:.1f}%)")
        print(f"   Medicines: {', '.join(data['medicines'][:3])}")
    else:
        print(f"ERROR - Prediction error: {response.status_code}")
        print(f"   Response: {response.text}")
except Exception as e:
    print(f"ERROR - Failed: {str(e)}")

print("\n" + "=" * 60)
print("TESTING COMPLETE!")
print("=" * 60)
