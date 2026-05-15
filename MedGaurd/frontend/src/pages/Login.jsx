import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaHeartbeat } from "react-icons/fa";
import { useState } from "react";
import apiClient, { API_ENDPOINTS } from "../config/axiosInstance";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.email || !formData.password) {
      setError("⚠️ Email and password required");
      return;
    }

    setLoading(true);

    try {
      console.log("🔑 Login attempt with:", formData.email);

      const response = await apiClient.post(API_ENDPOINTS.LOGIN, {
        email: formData.email,
        password: formData.password
      });

      console.log("✅ Login successful:", response.data);

      // Save token and user info
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        // Redirect to dashboard
        navigate("/dashboard");
      } else {
        setError("❌ No token received from server");
      }

    } catch (err) {
      console.error("❌ Login error:", err);

      if (err.response?.data?.error) {
        setError("❌ " + err.response.data.error);
      } else if (err.code === "ERR_NETWORK") {
        setError("❌ Cannot connect to server. Is backend running on port 5000?");
      } else {
        setError("❌ Login failed. Try again.");
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
          Your health, monitored intelligently.
          Predict diseases early and stay safe.
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
        <h2 style={{ marginBottom: "30px", textAlign: "center" }}>Login</h2>

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

        <form onSubmit={handleLogin}>
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
            placeholder="Password"
            value={formData.password}
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={{ marginTop: "20px", textAlign: "center", fontSize: "14px" }}>
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            style={{
              color: "#22c55e",
              cursor: "pointer",
              fontWeight: "bold",
              textDecoration: "underline"
            }}
          >
            Register here
          </span>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;