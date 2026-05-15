from flask import Flask, request, jsonify
import pickle
import numpy as np

app = Flask(__name__)

model = pickle.load(open("model.pkl", "rb"))

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json["input"]
        features = np.array(data).reshape(1, -1)

        prediction = model.predict(features)

        return jsonify({
            "disease": prediction[0]
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

if __name__ == "__main__":
    app.run(port=5001, debug=True)