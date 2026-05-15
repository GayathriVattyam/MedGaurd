import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaHeartbeat,
  FaHistory,
  FaExclamationTriangle,
  FaSignOutAlt,
  FaSave,
  FaTimes
} from "react-icons/fa";
import apiClient, { API_ENDPOINTS } from "../config/axiosInstance";

function Profile(){
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    phone: "",
    height: "",
    weight: ""
  });

  const [medicalHistory, setMedicalHistory] = useState({
    diabetes: false,
    bloodPressure: "Normal",
    allergies: "",
    medications: ""
  });

  const [emergencyContact, setEmergencyContact] = useState({
    name: "",
    phone: "",
    relation: ""
  });

  const [predictions, setPredictions] = useState([]);
  const [bmi, setBmi] = useState(null);

  // Fetch user profile and predictions
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!localStorage.getItem("token")) {
          window.location.href = "/login";
          return;
        }

        // Fetch profile
        const profileRes = await apiClient.get(API_ENDPOINTS.PROFILE);

        setUser(profileRes.data.user);
        setFormData({
          age: profileRes.data.user.age || "",
          gender: profileRes.data.user.gender || "",
          phone: profileRes.data.user.phone || "",
          height: profileRes.data.user.height || "",
          weight: profileRes.data.user.weight || ""
        });

        if (profileRes.data.user.medicalHistory) {
          setMedicalHistory(profileRes.data.user.medicalHistory);
        }

        if (profileRes.data.user.emergencyContact) {
          setEmergencyContact(profileRes.data.user.emergencyContact);
        }

        // Fetch predictions
        const predictRes = await apiClient.get(API_ENDPOINTS.GET_PREDICTIONS);

        setPredictions(predictRes.data.predictions);

      } catch (err) {
        console.error("Profile error:", err);
        setError("Failed to load profile data");

        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Calculate BMI
  const calculateBMI = () => {
    if (formData.height && formData.weight) {
      const h = formData.height / 100;
      const bmiValue = (formData.weight / (h * h)).toFixed(1);
      setBmi(bmiValue);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleMedicalHistoryChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMedicalHistory({
      ...medicalHistory,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleEmergencyContactChange = (e) => {
    const { name, value } = e.target;
    setEmergencyContact({
      ...emergencyContact,
      [name]: value
    });
  };

  // Save profile
  const saveProfile = async () => {
    try {
      setError(null);
      setSuccess(null);

      const res = await apiClient.put(API_ENDPOINTS.UPDATE_PROFILE, {
        ...formData,
        medicalHistory,
        emergencyContact
      });

      setUser(res.data.user);
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => setSuccess(null), 3000);

    } catch (err) {
      console.error("Save error:", err);
      setError(err.response?.data?.error || "Failed to save profile");
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div style={{padding:"40px", textAlign:"center"}}>
        <p>Loading profile...</p>
      </div>
    );
  }

  return(
    <div style={{padding:"40px",maxWidth:"1100px",margin:"auto"}}>
      <h1>Your Profile</h1>

      {error && (
        <div style={{
          background:"#fee2e2",
          color:"#991b1b",
          padding:"15px",
          borderRadius:"8px",
          marginBottom:"20px"
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          background:"#dcfce7",
          color:"#166534",
          padding:"15px",
          borderRadius:"8px",
          marginBottom:"20px"
        }}>
          {success}
        </div>
      )}

      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(2,1fr)",
        gap:"30px",
        marginTop:"30px"
      }}>
        {/* Personal Info */}
        <motion.div
          whileHover={{scale:1.02}}
          style={{
            background:"white",
            color:"black",
            padding:"25px",
            borderRadius:"12px",
            boxShadow:"0 10px 20px rgba(0,0,0,0.15)"
          }}
        >
          <h2><FaUser style={{marginRight:"8px"}}/>Personal Information</h2>

          <p style={{marginTop:"10px"}}><b>Name:</b> {user?.name}</p>
          <p><b>Email:</b> {user?.email}</p>

          {isEditing ? (
            <>
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleInputChange}
                style={{
                  padding:"10px",
                  width:"100%",
                  marginTop:"10px",
                  border:"1px solid #ddd",
                  borderRadius:"4px"
                }}
              />

              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                style={{
                  padding:"10px",
                  width:"100%",
                  marginTop:"10px",
                  border:"1px solid #ddd",
                  borderRadius:"4px"
                }}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleInputChange}
                style={{
                  padding:"10px",
                  width:"100%",
                  marginTop:"10px",
                  border:"1px solid #ddd",
                  borderRadius:"4px"
                }}
              />
            </>
          ) : (
            <>
              <p><b>Age:</b> {formData.age || "Not specified"}</p>
              <p><b>Gender:</b> {formData.gender || "Not specified"}</p>
              <p><b>Phone:</b> {formData.phone || "Not specified"}</p>
            </>
          )}
        </motion.div>

        {/* Health Metrics */}
        <motion.div
          whileHover={{scale:1.02}}
          style={{
            background:"white",
            color:"black",
            padding:"25px",
            borderRadius:"12px",
            boxShadow:"0 10px 20px rgba(0,0,0,0.15)"
          }}
        >
          <h2><FaHeartbeat style={{marginRight:"8px"}}/>Health Metrics</h2>

          {isEditing ? (
            <>
              <input
                type="number"
                name="height"
                placeholder="Height (cm)"
                value={formData.height}
                onChange={handleInputChange}
                style={{
                  padding:"10px",
                  width:"100%",
                  marginTop:"10px",
                  border:"1px solid #ddd",
                  borderRadius:"4px"
                }}
              />

              <input
                type="number"
                name="weight"
                placeholder="Weight (kg)"
                value={formData.weight}
                onChange={handleInputChange}
                style={{
                  padding:"10px",
                  width:"100%",
                  marginTop:"10px",
                  border:"1px solid #ddd",
                  borderRadius:"4px"
                }}
              />

              <motion.button
                whileHover={{scale:1.05}}
                whileTap={{scale:0.95}}
                onClick={calculateBMI}
                style={{
                  marginTop:"10px",
                  padding:"10px",
                  width:"100%",
                  background:"#3b82f6",
                  color:"white",
                  border:"none",
                  borderRadius:"6px",
                  cursor:"pointer"
                }}
              >
                Calculate BMI
              </motion.button>
            </>
          ) : (
            <>
              <p><b>Height:</b> {formData.height ? `${formData.height} cm` : "Not specified"}</p>
              <p><b>Weight:</b> {formData.weight ? `${formData.weight} kg` : "Not specified"}</p>
            </>
          )}

          {bmi && (
            <p style={{marginTop:"10px", background:"#f0f0f0", padding:"10px", borderRadius:"4px"}}>
              <b>Your BMI:</b> {bmi}
            </p>
          )}
        </motion.div>

        {/* Medical History */}
        <motion.div
          whileHover={{scale:1.02}}
          style={{
            background:"white",
            color:"black",
            padding:"25px",
            borderRadius:"12px",
            boxShadow:"0 10px 20px rgba(0,0,0,0.15)"
          }}
        >
          <h2><FaHistory style={{marginRight:"8px"}}/>Medical History</h2>

          {isEditing ? (
            <>
              <label style={{display:"block", marginTop:"10px"}}>
                <input
                  type="checkbox"
                  name="diabetes"
                  checked={medicalHistory.diabetes}
                  onChange={handleMedicalHistoryChange}
                />
                <span style={{marginLeft:"8px"}}>Have Diabetes</span>
              </label>

              <select
                name="bloodPressure"
                value={medicalHistory.bloodPressure}
                onChange={handleMedicalHistoryChange}
                style={{
                  padding:"10px",
                  width:"100%",
                  marginTop:"10px",
                  border:"1px solid #ddd",
                  borderRadius:"4px"
                }}
              >
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Low">Low</option>
              </select>

              <input
                type="text"
                name="allergies"
                placeholder="Allergies (comma separated)"
                value={medicalHistory.allergies}
                onChange={handleMedicalHistoryChange}
                style={{
                  padding:"10px",
                  width:"100%",
                  marginTop:"10px",
                  border:"1px solid #ddd",
                  borderRadius:"4px"
                }}
              />

              <input
                type="text"
                name="medications"
                placeholder="Current Medications"
                value={medicalHistory.medications}
                onChange={handleMedicalHistoryChange}
                style={{
                  padding:"10px",
                  width:"100%",
                  marginTop:"10px",
                  border:"1px solid #ddd",
                  borderRadius:"4px"
                }}
              />
            </>
          ) : (
            <>
              <p><b>Diabetes:</b> {medicalHistory.diabetes ? "Yes" : "No"}</p>
              <p><b>Blood Pressure:</b> {medicalHistory.bloodPressure}</p>
              <p><b>Allergies:</b> {medicalHistory.allergies || "None"}</p>
              <p><b>Medications:</b> {medicalHistory.medications || "None"}</p>
            </>
          )}
        </motion.div>

        {/* Recent Predictions */}
        <motion.div
          whileHover={{scale:1.02}}
          style={{
            background:"white",
            color:"black",
            padding:"25px",
            borderRadius:"12px",
            boxShadow:"0 10px 20px rgba(0,0,0,0.15)"
          }}
        >
          <h2><FaExclamationTriangle style={{marginRight:"8px"}}/>Recent Predictions</h2>

          {predictions.length === 0 ? (
            <p style={{marginTop:"10px", color:"#666"}}>No predictions yet</p>
          ) : (
            <ul style={{marginTop:"10px", listStyle:"none", padding:"0"}}>
              {predictions.slice(0, 5).map((pred, index) => (
                <li key={index} style={{
                  padding:"8px",
                  background:"#f9fafb",
                  marginBottom:"8px",
                  borderRadius:"4px",
                  borderLeft:`3px solid ${pred.riskLevel === "High" ? "#ef4444" : pred.riskLevel === "Medium" ? "#f59e0b" : "#22c55e"}`
                }}>
                  <b>{pred.disease}</b> - {pred.confidence.toFixed(1)}% confidence
                  <br/>
                  <small style={{color:"#666"}}>{new Date(pred.createdAt).toLocaleDateString()}</small>
                </li>
              ))}
            </ul>
          )}

          <p style={{marginTop:"15px", fontSize:"14px", color:"#666"}}>
            <b>Total Predictions:</b> {user?.totalPredictions || 0}
          </p>
        </motion.div>

        {/* Emergency Contact */}
        <div style={{
          background:"white",
          color:"black",
          padding:"25px",
          borderRadius:"12px",
          boxShadow:"0 10px 20px rgba(0,0,0,0.15)",
          gridColumn:"span 2"
        }}>
          <h2>Emergency Contact</h2>

          {isEditing ? (
            <>
              <input
                type="text"
                name="name"
                placeholder="Contact Name"
                value={emergencyContact.name}
                onChange={handleEmergencyContactChange}
                style={{
                  padding:"10px",
                  width:"100%",
                  marginTop:"10px",
                  border:"1px solid #ddd",
                  borderRadius:"4px"
                }}
              />

              <input
                type="tel"
                name="phone"
                placeholder="Contact Phone"
                value={emergencyContact.phone}
                onChange={handleEmergencyContactChange}
                style={{
                  padding:"10px",
                  width:"100%",
                  marginTop:"10px",
                  border:"1px solid #ddd",
                  borderRadius:"4px"
                }}
              />

              <input
                type="text"
                name="relation"
                placeholder="Relation (e.g., Father, Mother, Friend)"
                value={emergencyContact.relation}
                onChange={handleEmergencyContactChange}
                style={{
                  padding:"10px",
                  width:"100%",
                  marginTop:"10px",
                  border:"1px solid #ddd",
                  borderRadius:"4px"
                }}
              />
            </>
          ) : (
            <>
              <p style={{marginTop:"10px"}}><b>Name:</b> {emergencyContact.name || "Not specified"}</p>
              <p><b>Phone:</b> {emergencyContact.phone || "Not specified"}</p>
              <p><b>Relation:</b> {emergencyContact.relation || "Not specified"}</p>
            </>
          )}
        </div>
      </div>

      {/* Edit/Save/Cancel Buttons */}
      <div style={{textAlign:"center", marginTop:"40px", display:"flex", gap:"15px", justifyContent:"center"}}>
        {!isEditing ? (
          <motion.button
            whileHover={{scale:1.05}}
            whileTap={{scale:0.95}}
            onClick={() => setIsEditing(true)}
            style={{
              padding:"12px 25px",
              background:"#3b82f6",
              color:"white",
              border:"none",
              borderRadius:"8px",
              cursor:"pointer",
              fontSize:"16px",
              fontWeight:"bold"
            }}
          >
            ✏️ Edit Profile
          </motion.button>
        ) : (
          <>
            <motion.button
              whileHover={{scale:1.05}}
              whileTap={{scale:0.95}}
              onClick={saveProfile}
              style={{
                padding:"12px 25px",
                background:"#22c55e",
                color:"white",
                border:"none",
                borderRadius:"8px",
                cursor:"pointer",
                fontSize:"16px",
                fontWeight:"bold"
              }}
            >
              <FaSave style={{marginRight:"8px"}}/>
              Save Changes
            </motion.button>

            <motion.button
              whileHover={{scale:1.05}}
              whileTap={{scale:0.95}}
              onClick={() => setIsEditing(false)}
              style={{
                padding:"12px 25px",
                background:"#9ca3af",
                color:"white",
                border:"none",
                borderRadius:"8px",
                cursor:"pointer",
                fontSize:"16px",
                fontWeight:"bold"
              }}
            >
              <FaTimes style={{marginRight:"8px"}}/>
              Cancel
            </motion.button>
          </>
        )}

        <motion.button
          whileHover={{scale:1.05}}
          whileTap={{scale:0.95}}
          onClick={logout}
          style={{
            padding:"12px 25px",
            background:"#ef4444",
            color:"white",
            border:"none",
            borderRadius:"8px",
            cursor:"pointer",
            fontSize:"16px",
            fontWeight:"bold"
          }}
        >
          <FaSignOutAlt style={{marginRight:"8px"}}/>
          Logout
        </motion.button>
      </div>
    </div>
  )
}

export default Profile;