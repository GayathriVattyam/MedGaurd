import { motion } from "framer-motion";
import { FaHeartbeat, FaRobot, FaUserMd, FaShieldAlt } from "react-icons/fa";

function AboutContact(){

return(

<div style={{
padding:"40px",
textAlign:"center",
maxWidth:"1100px",
margin:"auto"
}}>

{/* Header */}

<motion.div
initial={{opacity:0,y:-30}}
animate={{opacity:1,y:0}}
transition={{duration:0.6}}

>

<h1>About MedGuard</h1>

<p style={{
margin:"15px auto",
maxWidth:"750px",
lineHeight:"28px",
opacity:"0.9"
}}>

MedGuard is an AI-powered healthcare assistant designed to help users
analyze symptoms, understand potential health conditions, and receive
personalized wellness guidance. By combining modern artificial
intelligence with healthcare knowledge, MedGuard helps people take
proactive steps toward better health.

</p>

</motion.div>

{/* Mission */}

<div style={{marginTop:"50px"}}>

<h2>Our Mission</h2>

<p style={{
margin:"15px auto",
maxWidth:"700px",
lineHeight:"28px"
}}>

Our mission is to make healthcare guidance intelligent, accessible,
and preventive. MedGuard empowers individuals to detect possible
health concerns early and adopt healthier lifestyle choices using
data-driven insights.

</p>

</div>

{/* Features */}

<h2 style={{marginTop:"60px"}}>Platform Features</h2>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",
gap:"30px",
marginTop:"30px"
}}>

<div style={{
background:"white",
color:"black",
padding:"25px",
borderRadius:"12px",
boxShadow:"0 10px 20px rgba(0,0,0,0.15)",
transition:"0.3s"
}}>

<FaRobot size={35}/>

<h3 style={{marginTop:"12px"}}>AI Disease Prediction</h3>

<p style={{fontSize:"14px",marginTop:"6px"}}>

Analyze symptoms and receive AI-powered predictions
about possible health conditions.

</p>

</div>

<div style={{
background:"white",
color:"black",
padding:"25px",
borderRadius:"12px",
boxShadow:"0 10px 20px rgba(0,0,0,0.15)"
}}>

<FaHeartbeat size={35}/>

<h3 style={{marginTop:"12px"}}>Health Monitoring</h3>

<p style={{fontSize:"14px",marginTop:"6px"}}>

Track wellness indicators and receive lifestyle
recommendations to stay healthy.

</p>

</div>

<div style={{
background:"white",
color:"black",
padding:"25px",
borderRadius:"12px",
boxShadow:"0 10px 20px rgba(0,0,0,0.15)"
}}>

<FaUserMd size={35}/>

<h3 style={{marginTop:"12px"}}>Doctor Guidance</h3>

<p style={{fontSize:"14px",marginTop:"6px"}}>

MedGuard provides guidance on when professional
medical consultation may be necessary.

</p>

</div>

<div style={{
background:"white",
color:"black",
padding:"25px",
borderRadius:"12px",
boxShadow:"0 10px 20px rgba(0,0,0,0.15)"
}}>

<FaShieldAlt size={35}/>

<h3 style={{marginTop:"12px"}}>Secure & Private</h3>

<p style={{fontSize:"14px",marginTop:"6px"}}>

User health inputs and data remain protected
through secure and privacy-focused systems.

</p>

</div>

</div>

{/* Technology */}

<div style={{marginTop:"60px"}}>

<h2>Technology Behind MedGuard</h2>

<p style={{
margin:"15px auto",
maxWidth:"700px",
lineHeight:"28px"
}}>

MedGuard integrates machine learning algorithms
with modern web technologies to analyze health
symptoms and identify disease patterns. The platform
is designed to assist users with early awareness
and encourage informed healthcare decisions.

</p>

</div>

{/* Contact */}

<div style={{marginTop:"60px"}}>

<h2>Contact & Support</h2>

<p style={{marginTop:"10px"}}>

📧 Email: [support@medguard.ai](mailto:support@medguard.ai)

</p>

<p>

📍 MedGuard Healthcare Innovation Lab

</p>

</div>

</div>

)

}

export default AboutContact
