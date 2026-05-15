import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import HealthTips from "./pages/HealthTips";
import SymptomChecker from "./pages/SymptomChecker";
import Result from "./pages/Result";
import Profile from "./pages/Profile";
import AboutContact from "./pages/AboutContact";

function App(){

return(

<Router>

<Navbar/>

<Routes>

<Route path="/" element={<HeroSection/>}/>
<Route path="/login" element={<Login/>}/>
<Route path="/register" element={<Register/>}/>

<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard/>
    </ProtectedRoute>
  }
/>
<Route
  path="/symptom-checker"
  element={
    <ProtectedRoute>
      <SymptomChecker/>
    </ProtectedRoute>
  }
/>
<Route
  path="/result"
  element={
    <ProtectedRoute>
      <Result/>
    </ProtectedRoute>
  }
/>
<Route
  path="/tips"
  element={
    <ProtectedRoute>
      <HealthTips/>
    </ProtectedRoute>
  }
/>
<Route
  path="/about"
  element={
    <ProtectedRoute>
      <AboutContact/>
    </ProtectedRoute>
  }
/>
<Route 
  path="/profile" 
  element={
    <ProtectedRoute>
      <Profile/>
    </ProtectedRoute>
  }
/>

</Routes>

<Footer/>

</Router>

)

}

export default App