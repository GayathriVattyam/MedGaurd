const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true
    },
    email: { 
      type: String, 
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: { 
      type: String, 
      required: true
    },
    // Health Information
    age: { 
      type: Number, 
      default: null
    },
    gender: { 
      type: String, 
      enum: ["Male", "Female", "Other"], 
      default: null
    },
    phone: { 
      type: String, 
      default: null
    },
    height: { 
      type: Number, 
      default: null
    },
    weight: { 
      type: Number, 
      default: null
    },
    // Medical History
    medicalHistory: {
      diabetes: { 
        type: Boolean, 
        default: false
      },
      bloodPressure: { 
        type: String, 
        default: "Normal"
      },
      allergies: { 
        type: String, 
        default: ""
      },
      medications: { 
        type: String, 
        default: ""
      }
    },
    // Emergency Contact
    emergencyContact: {
      name: { 
        type: String, 
        default: ""
      },
      phone: { 
        type: String, 
        default: ""
      },
      relation: { 
        type: String, 
        default: ""
      }
    },
    // Prediction Statistics
    totalPredictions: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);