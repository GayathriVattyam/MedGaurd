import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaHeartbeat } from "react-icons/fa";

function Navbar(){
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return(

  <nav key={location.pathname} style={{
  display:"flex",
  justifyContent:"space-between",
  alignItems:"center",
  padding:"15px 40px",
  background:"#0f172a",
  color:"white"
  }}>

  <h2 style={{display:"flex",alignItems:"center",gap:"10px"}}><FaHeartbeat/> MedGuard</h2>

  <div style={{display:"flex",gap:"20px",alignItems:"center"}}>

  {token ? (
    <>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/symptom-checker">🔍 Symptom Checker</Link>
      <Link to="/tips">Health Tips</Link>
      <Link to="/profile">Profile</Link>
      <Link to="/about">About</Link>
      <button
        onClick={handleLogout}
        style={{
          background:"#22c55e",
          border:"none",
          borderRadius:"6px",
          color:"white",
          padding:"8px 14px",
          cursor:"pointer"
        }}
      >
        Logout
      </button>
    </>
  ) : (
    <>
      <Link to="/">Home</Link>
      <Link to="/login">Login</Link>
    </>
  )}

  </div>

  </nav>

  )

}

export default Navbar