const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    symptoms: {
      type: [String],
      required: true
    },
    disease: {
      type: String,
      required: true
    },
    confidence: {
      type: Number,
      required: true
    },
    top3: {
      type: [
        {
          disease: String,
          confidence: Number
        }
      ],
      default: []
    },
    medicines: {
      type: [String],
      default: []
    },
    riskLevel: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prediction", predictionSchema);
