import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaHeartbeat } from "react-icons/fa";
import { useState } from "react";
import apiClient, { API_ENDPOINTS } from "../config/axiosInstance";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("⚠️ All fields are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("⚠️ Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("⚠️ Password must be at least 6 characters");
      return;
    }

    if (!formData.email.includes("@")) {
      setError("⚠️ Please enter a valid email");
      return;
    }

    setLoading(true);

    try {
      console.log("📝 Registering with:", formData.email);
      
      const response = await apiClient.post(API_ENDPOINTS.SIGNUP, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      console.log("✅ Registration successful:", response.data);
      setSuccess(true);
      setError("");
      
      // Wait 2 seconds then redirect
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      console.error("❌ Registration error:", err);
      
      if (err.response?.data?.error) {
        setError("❌ " + err.response.data.error);
      } else if (err.code === "ERR_NETWORK") {
        setError("❌ Cannot connect to server. Is backend running?");
      } else {
        setError("❌ Registration failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      height: "90vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-around",
      background: "linear-gradient(135deg,#0f172a,#1e293b)",
      color: "white",
      padding: "20px"
    }}>
      {/* LEFT SIDE */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{ maxWidth: "500px" }}
      >
        <h1 style={{ fontSize: "50px", marginBottom: "20px" }}>
          <FaHeartbeat /> MedGuard
        </h1>
        <p style={{ fontSize: "20px", marginTop: "20px", fontWeight: "bold" }}>
          AI Powered Healthcare Assistant
        </p>
        <p style={{ opacity: "0.8", fontSize: "16px", marginTop: "10px", lineHeight: "1.6" }}>
          Join thousands of users monitoring their health intelligently. 
          Get early disease predictions and personalized health tips.
        </p>
      </motion.div>

      {/* RIGHT SIDE */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          background: "white",
          color: "#333",
          padding: "40px",
          borderRadius: "15px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
          width: "100%",
          maxWidth: "400px"
        }}
      >
        <h2 style={{ marginBottom: "30px", textAlign: "center" }}>Create Account</h2>

        {error && (
          <div style={{
            background: "#fee",
            color: "#c33",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "20px",
            border: "1px solid #fcc",
            fontSize: "14px"
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            background: "#efe",
            color: "#3c3",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "20px",
            border: "1px solid #cfc",
            fontSize: "14px"
          }}>
            ✅ Registration successful! Redirecting to login...
          </div>
        )}

        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            style={{
              padding: "12px",
              width: "100%",
              marginBottom: "15px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "14px",
              boxSizing: "border-box"
            }}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={{
              padding: "12px",
              width: "100%",
              marginBottom: "15px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "14px",
              boxSizing: "border-box"
            }}
          />

          <input
            type="password"
            name="password"
            placeholder="Password (min 6 characters)"
            value={formData.password}
            onChange={handleChange}
            style={{
              padding: "12px",
              width: "100%",
              marginBottom: "15px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "14px",
              boxSizing: "border-box"
            }}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            style={{
              padding: "12px",
              width: "100%",
              marginBottom: "25px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "14px",
              boxSizing: "border-box"
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: loading ? "#ccc" : "#22c55e",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s"
            }}
            onMouseOver={(e) => !loading && (e.target.style.background = "#16a34a")}
            onMouseOut={(e) => !loading && (e.target.style.background = "#22c55e")}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p style={{ marginTop: "20px", textAlign: "center", fontSize: "14px" }}>
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{
              color: "#22c55e",
              cursor: "pointer",
              fontWeight: "bold",
              textDecoration: "underline"
            }}
          >
            Login here
          </span>
        </p>
      </motion.div>
    </div>
  );
}

export default Register;
