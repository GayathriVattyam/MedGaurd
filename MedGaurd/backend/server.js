require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const axios = require("axios");

const app = express();

// ============================================
// CONFIGURATION
// ============================================

const PORT = process.env.PORT || 5000;
const ML_API_URL = process.env.ML_API_URL || "http://127.0.0.1:5001/predict";
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/medguard";
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// ============================================
// MIDDLEWARE
// ============================================

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173"
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// MODELS
// ============================================

const User = require("./models/User");
const Prediction = require("./models/Prediction");

// ============================================
// DATABASE CONNECTION
// ============================================

console.log("\n🔄 Starting MongoDB connection...");
console.log("📍 URI:", MONGO_URI);

mongoose.set("strictQuery", true);

mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => {
    console.log("✅ MongoDB Connected Successfully!");
  })
  .catch(err => {
    console.error("❌ MongoDB Connection Failed!");
    console.error("Error:", err.message);
    console.error("\n📌 TROUBLESHOOTING:");
    console.error("   1. Make sure MongoDB is running");
    console.error("   2. Open MongoDB Compass or start mongod");
    console.error("   3. Check MONGO_URI in .env file");
    console.error("   4. Ensure connection string is correct");
  });

// Monitor connection
mongoose.connection.on("connected", () => {
  console.log("✅ Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB Error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB disconnected");
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  return password && password.length >= 6;
}

// ============================================
// HEALTH CHECK
// ============================================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend server is running",
    timestamp: new Date().toISOString(),
    mongoConnected: mongoose.connection.readyState === 1
  });
});

// ============================================
// AUTHENTICATION MIDDLEWARE
// ============================================

function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "No authentication token provided"
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();

  } catch (error) {
    console.error("❌ AUTH ERROR:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "Token expired. Please login again."
      });
    }

    return res.status(403).json({
      success: false,
      error: "Invalid or malformed token"
    });
  }
}

// ============================================
// ROUTES - AUTH
// ============================================

// 1️⃣ SIGNUP ROUTE
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    console.log("\n📝 SIGNUP - Received:", { name, email });

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Name, email, and password are required"
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email format"
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters"
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: "Passwords do not match"
      });
    }

    // Check if email already exists
    const emailLower = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: emailLower });

    if (existingUser) {
      console.log("❌ Email already exists:", emailLower);
      return res.status(400).json({
        success: false,
        error: "Email already registered"
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      name: name.trim(),
      email: emailLower,
      password: hashedPassword
    });

    // Save to database
    const savedUser = await newUser.save();
    console.log("✅ User registered successfully!");

    res.status(201).json({
      success: true,
      message: "Registration successful. Please login.",
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email
      }
    });

  } catch (error) {
    console.error("❌ SIGNUP ERROR:", error.message);
    res.status(500).json({
      success: false,
      error: "Registration failed. Please try again."
    });
  }
});

// 2️⃣ LOGIN ROUTE
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("\n🔑 LOGIN - Attempting with email:", email);

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password required"
      });
    }

    // Find user
    const emailLower = email.toLowerCase().trim();
    const user = await User.findOne({ email: emailLower });

    if (!user) {
      console.log("❌ User not found:", emailLower);
      return res.status(401).json({
        success: false,
        error: "Invalid email or password"
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log("❌ Password incorrect");
      return res.status(401).json({
        success: false,
        error: "Invalid email or password"
      });
    }

    console.log("✅ Password verified");

    // Create JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("✅ Login successful for:", user.email);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("❌ LOGIN ERROR:", error.message);
    res.status(500).json({
      success: false,
      error: "Login failed. Please try again."
    });
  }
});

// 3️⃣ GET PROFILE ROUTE (Protected)
app.get("/api/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age || null,
        gender: user.gender || null,
        phone: user.phone || null,
        height: user.height || null,
        weight: user.weight || null,
        medicalHistory: user.medicalHistory || {
          diabetes: false,
          bloodPressure: "Normal",
          allergies: "",
          medications: ""
        },
        emergencyContact: user.emergencyContact || {
          name: "",
          phone: "",
          relation: ""
        },
        totalPredictions: user.totalPredictions || 0,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error("❌ PROFILE ERROR:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch profile"
    });
  }
});

// 3️⃣B UPDATE PROFILE ROUTE (Protected)
app.put("/api/profile", authenticateToken, async (req, res) => {
  try {
    const { age, gender, phone, height, weight, medicalHistory, emergencyContact } = req.body;

    // Validation
    if (age && (isNaN(age) || age < 0 || age > 150)) {
      return res.status(400).json({
        success: false,
        error: "Invalid age"
      });
    }

    if (gender && !["Male", "Female", "Other"].includes(gender)) {
      return res.status(400).json({
        success: false,
        error: "Invalid gender"
      });
    }

    if (height && (isNaN(height) || height < 0 || height > 300)) {
      return res.status(400).json({
        success: false,
        error: "Invalid height"
      });
    }

    if (weight && (isNaN(weight) || weight < 0 || weight > 500)) {
      return res.status(400).json({
        success: false,
        error: "Invalid weight"
      });
    }

    const updateData = {};
    if (age !== undefined) updateData.age = age;
    if (gender !== undefined) updateData.gender = gender;
    if (phone !== undefined) updateData.phone = phone;
    if (height !== undefined) updateData.height = height;
    if (weight !== undefined) updateData.weight = weight;
    if (medicalHistory !== undefined) updateData.medicalHistory = medicalHistory;
    if (emergencyContact !== undefined) updateData.emergencyContact = emergencyContact;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    console.log("✅ Profile updated for user:", user.email);

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        phone: user.phone,
        height: user.height,
        weight: user.weight,
        medicalHistory: user.medicalHistory,
        emergencyContact: user.emergencyContact,
        totalPredictions: user.totalPredictions
      }
    });

  } catch (error) {
    console.error("❌ UPDATE PROFILE ERROR:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to update profile"
    });
  }
});

// 4️⃣ PREDICT ROUTE - Call ML API with symptoms and save to DB
app.post("/api/predict", authenticateToken, async (req, res) => {
  try {
    const { symptoms, input } = req.body;

    // Support legacy clients that send a numeric input vector.
    let normalizedSymptoms = symptoms;
    if ((!normalizedSymptoms || !Array.isArray(normalizedSymptoms)) && Array.isArray(input)) {
      normalizedSymptoms = input;
    }

    console.log("\n🔬 PREDICT - Received symptoms:", normalizedSymptoms);

    if (!normalizedSymptoms || !Array.isArray(normalizedSymptoms)) {
      return res.status(400).json({
        success: false,
        error: "Symptoms must be an array"
      });
    }

    if (normalizedSymptoms.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Please select at least one symptom"
      });
    }

    // Call Flask ML API with timeout
    console.log(`🌐 Calling ML API: ${ML_API_URL}`);

    const mlResponse = await axios.post(ML_API_URL, { symptoms: normalizedSymptoms }, {
      timeout: 30000
    });

    if (!mlResponse.data || !mlResponse.data.success) {
      return res.status(502).json({
        success: false,
        error: mlResponse.data?.error || "Invalid response from ML service"
      });
    }

    console.log("✅ Prediction received:", mlResponse.data.disease);

    // Determine risk level based on confidence
    let riskLevel = "Low";
    const confidenceValue = Number(mlResponse.data.confidence || 0);
    const confidenceNumber = confidenceValue * 100;
    console.log(`📊 Confidence: ${confidenceNumber}%`);
    
    if (confidenceNumber > 80) {
      riskLevel = "High";
    } else if (confidenceNumber > 60) {
      riskLevel = "Medium";
    }

    let persistenceWarning = null;
    try {
      // Save prediction to database (best effort)
      const prediction = new Prediction({
        userId: req.user.id,
        symptoms: normalizedSymptoms,
        disease: mlResponse.data.disease,
        confidence: Number(confidenceNumber.toFixed(2)),
        top3: (mlResponse.data.top3 || []).map(item => ({
          disease: Array.isArray(item) ? item[0] : item?.disease,
          confidence: Number(Array.isArray(item) ? item[1] : item?.confidence || 0)
        })),
        medicines: mlResponse.data.medicines || [],
        riskLevel
      });

      console.log("📝 Saving prediction to database:", prediction);
      await prediction.save();
      console.log("✅ Prediction saved to database successfully");

      // Update user's total predictions count
      await User.findByIdAndUpdate(req.user.id, {
        $inc: { totalPredictions: 1 }
      });
      console.log("✅ User prediction count updated");
    } catch (dbError) {
      // Do not fail user-facing prediction when persistence fails.
      persistenceWarning = "Prediction generated, but history save failed";
      console.error("⚠️ DB SAVE WARNING:", dbError.message);
    }

    const responseData = {
      success: true,
      disease: mlResponse.data.disease,
      confidence: confidenceValue,
      confidence_percentage: mlResponse.data.confidence_percentage,
      top3: mlResponse.data.top3,
      medicines: mlResponse.data.medicines,
      user_symptoms: mlResponse.data.user_symptoms || normalizedSymptoms,
      disclaimer: mlResponse.data.disclaimer,
      riskLevel
    };

    if (persistenceWarning) {
      responseData.warning = persistenceWarning;
    }

    console.log("📤 Sending response to frontend:", responseData);
    res.json(responseData);

  } catch (error) {
    console.error("❌ PREDICT ERROR:", error.message);
    console.error("Error Stack:", error.stack);
    console.error("Error Name:", error.name);
    console.error("Error Code:", error.code);

    if (error.code === "ECONNREFUSED") {
      console.error("🔌 ML API Connection Refused - Flask not running?");
      return res.status(503).json({
        success: false,
        error: "ML API is not available. Please ensure Flask server is running on port 5001."
      });
    }

    if (error.response) {
      console.error("ML API Response Status:", error.response.status);
      console.error("ML API Response Data:", error.response.data);
      return res.status(error.response.status || 500).json({
        success: false,
        error: error.response.data?.error || "ML API Error",
        details: error.response.data
      });
    }

    if (error.code === "ENOTFOUND") {
      console.error("🌐 Cannot resolve ML API host");
      return res.status(503).json({
        success: false,
        error: "Cannot reach ML API server"
      });
    }

    // Validation error from Mongoose
    if (error.name === "ValidationError") {
      console.error("📋 Validation Error - Invalid prediction data:");
      Object.keys(error.errors).forEach(key => {
        console.error(`   ${key}: ${error.errors[key].message}`);
      });
      return res.status(400).json({
        success: false,
        error: "Invalid prediction data: " + Object.keys(error.errors).join(", ")
      });
    }

    res.status(500).json({
      success: false,
      error: "Prediction failed: " + error.message,
      debug: error.name
    });
  }
});

// 4️⃣A GET USER PREDICTIONS (Protected)
app.get("/api/predictions", authenticateToken, async (req, res) => {
  try {
    const predictions = await Prediction.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      predictions
    });

  } catch (error) {
    console.error("❌ GET PREDICTIONS ERROR:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch predictions"
    });
  }
});

// 4️⃣B GET DASHBOARD STATISTICS
app.get("/api/dashboard-stats", authenticateToken, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPredictions = await Prediction.countDocuments();
    const recentPredictions = await Prediction.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "name email");

    res.json({
      success: true,
      stats: {
        totalUsers: totalUsers || 0,
        totalPredictions: totalPredictions || 0,
        activePredictionsToday: Math.max(1, Math.floor(totalPredictions * 0.3)),
        healthTips: 18
      },
      recentPredictions: recentPredictions || []
    });

  } catch (error) {
    console.error("❌ DASHBOARD STATS ERROR:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch statistics"
    });
  }
});

// ============================================
// DEBUG ROUTES
// ============================================

app.get("/api/debug/users", async (req, res) => {
  try {
    const users = await User.find({}, { name: 1, email: 1, _id: 1 });
    res.json({
      success: true,
      totalUsers: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get("/api/debug/predictions", async (req, res) => {
  try {
    const predictions = await Prediction.find().limit(10).sort({ createdAt: -1 });
    res.json({
      success: true,
      total: await Prediction.countDocuments(),
      predictions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post("/api/debug/clear-all", async (req, res) => {
  try {
    await User.deleteMany({});
    await Prediction.deleteMany({});
    res.json({
      success: true,
      message: "All data cleared"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// ERROR HANDLING
// ============================================

app.use((err, req, res, next) => {
  console.error("❌ UNHANDLED ERROR:", err.message);
  res.status(500).json({
    success: false,
    error: "Internal server error"
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found"
  });
});

// ============================================
// START SERVER
// ============================================

const server = app.listen(PORT, () => {
  console.log("\n✅ Backend server running on port:", PORT);
  console.log("📝 API endpoints ready");
  console.log("🔗 Frontend URL: http://localhost:5173");
  console.log("🐍 ML API URL:", ML_API_URL);
  console.log("\n");
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    mongoose.connection.close(false, () => {
      console.log("MongoDB connection closed");
      process.exit(0);
    });
  });
});

module.exports = app;