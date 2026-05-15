import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaHeartbeat } from "react-icons/fa";

function HeroSection(){

const navigate = useNavigate();

return(

<div style={{
height:"85vh",
display:"flex",
justifyContent:"space-around",
alignItems:"center"
}}>

<motion.div
initial={{opacity:0,x:-100}}
animate={{opacity:1,x:0}}
transition={{duration:1}}
>

<h1 style={{fontSize:"55px"}}>
<FaHeartbeat/> MedGuard
</h1>

<p style={{marginTop:"20px",fontSize:"20px"}}>
AI Powered Healthcare Assistant
</p>

<p style={{opacity:"0.7",marginTop:"10px"}}>
Predict diseases early. Stay healthy.
</p>

<button
style={{
marginTop:"20px",
background:"#22c55e",
color:"white"
}}
onClick={()=>navigate("/login")}
>

Get Started

</button>

</motion.div>

<motion.img
initial={{opacity:0,x:100}}
animate={{opacity:1,x:0}}
transition={{duration:1}}
src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
width="350"
/>

</div>

)

}

export default HeroSection