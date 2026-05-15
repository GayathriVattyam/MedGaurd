import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaHeartbeat, FaUserMd, FaNotesMedical } from "react-icons/fa";
import apiClient, { API_ENDPOINTS } from "../config/axiosInstance";

function Dashboard(){
  const [stats, setStats] = useState({
    totalPredictions: 0,
    totalUsers: 0,
    activePredictionsToday: 0,
    healthTips: 18
  });

  const [recentPredictions, setRecentPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(API_ENDPOINTS.GET_DASHBOARD_STATS);
        
        if (response.data.success) {
          setStats(response.data.stats);
          setRecentPredictions(response.data.recentPredictions);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return(
    <div style={{padding:"40px"}}>
      <h1 style={{marginBottom:"30px"}}>MedGuard Dashboard</h1>

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

      {/* Overview Cards */}
      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(3,1fr)",
        gap:"30px"
      }}>
        <motion.div
          whileHover={{scale:1.05}}
          style={{
            background:"white",
            color:"black",
            padding:"25px",
            borderRadius:"15px",
            boxShadow:"0 10px 20px rgba(0,0,0,0.15)"
          }}
        >
          <h2><FaHeartbeat/> Predictions Today</h2>
          <h1 style={{marginTop:"10px"}}>
            {loading ? "..." : stats.activePredictionsToday}
          </h1>
        </motion.div>

        <motion.div
          whileHover={{scale:1.05}}
          style={{
            background:"white",
            color:"black",
            padding:"25px",
            borderRadius:"15px",
            boxShadow:"0 10px 20px rgba(0,0,0,0.15)"
          }}
        >
          <h2><FaUserMd/> Active Users</h2>
          <h1 style={{marginTop:"10px"}}>
            {loading ? "..." : stats.totalUsers}
          </h1>
        </motion.div>

        <motion.div
          whileHover={{scale:1.05}}
          style={{
            background:"white",
            color:"black",
            padding:"25px",
            borderRadius:"15px",
            boxShadow:"0 10px 20px rgba(0,0,0,0.15)"
          }}
        >
          <h2><FaNotesMedical/> Total Predictions</h2>
          <h1 style={{marginTop:"10px"}}>
            {loading ? "..." : stats.totalPredictions}
          </h1>
        </motion.div>
      </div>

      {/* Latest Predictions */}
      <div style={{marginTop:"50px"}}>
        <h2>Latest Predictions</h2>

        <div style={{
          background:"white",
          color:"black",
          padding:"25px",
          borderRadius:"15px",
          marginTop:"20px",
          boxShadow:"0 10px 20px rgba(0,0,0,0.15)"
        }}>
          {loading ? (
            <p style={{textAlign:"center", color:"#666"}}>Loading predictions...</p>
          ) : recentPredictions.length === 0 ? (
            <p style={{textAlign:"center", color:"#666"}}>No predictions yet</p>
          ) : (
            <table style={{
              width:"100%",
              borderCollapse:"collapse",
              textAlign:"left"
            }}>
              <thead>
                <tr style={{borderBottom:"2px solid #ddd"}}>
                  <th style={{padding:"12px"}}>Patient</th>
                  <th style={{padding:"12px"}}>Symptoms</th>
                  <th style={{padding:"12px"}}>Prediction</th>
                  <th style={{padding:"12px"}}>Confidence</th>
                  <th style={{padding:"12px"}}>Risk Level</th>
                </tr>
              </thead>

              <tbody>
                {recentPredictions.map((pred, index) => (
                  <tr key={index} style={{borderBottom:"1px solid #eee"}}>
                    <td style={{padding:"12px"}}>
                      {pred.userId?.name || "Unknown"}
                    </td>
                    <td style={{padding:"12px"}}>
                      {pred.symptoms.slice(0, 2).join(", ")}
                      {pred.symptoms.length > 2 ? "..." : ""}
                    </td>
                    <td style={{padding:"12px"}}>{pred.disease}</td>
                    <td style={{padding:"12px"}}>
                      {pred.confidence.toFixed(1)}%
                    </td>
                    <td style={{padding:"12px"}}>
                      <span style={{
                        background: pred.riskLevel === "High" ? "#fee2e2" : 
                                   pred.riskLevel === "Medium" ? "#fef3c7" : "#dcfce7",
                        color: pred.riskLevel === "High" ? "#991b1b" :
                               pred.riskLevel === "Medium" ? "#92400e" : "#166534",
                        padding:"4px 8px",
                        borderRadius:"4px",
                        fontSize:"12px"
                      }}>
                        {pred.riskLevel} Risk
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Medical Illustration */}
      <div style={{
        marginTop:"60px",
        display:"flex",
        justifyContent:"space-between",
        alignItems:"center"
      }}>
        <div>
          <h2>AI Healthcare Monitoring</h2>
          <p style={{marginTop:"10px",opacity:"0.8"}}>
            MedGuard continuously analyzes symptoms and provides
            AI powered disease prediction to assist early diagnosis.
          </p>
        </div>

        <img
          src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
          width="220"
          alt="Healthcare Illustration"
        />
      </div>
    </div>
  )
}

export default Dashboard