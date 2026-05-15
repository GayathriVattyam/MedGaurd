import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaHeartbeat,
  FaRunning,
  FaAppleAlt,
  FaBed,
  FaBrain,
  FaShieldAlt,
  FaStethoscope,
  FaSyringe,
  FaWeight,
  FaLungs,
  FaEye,
  FaTooth,
  FaUserMd
} from "react-icons/fa";

function HealthTips(){

const [selectedFood,setSelectedFood] = useState(null)
const [activeCategory, setActiveCategory] = useState('general')

const healthCategories = [
  { id: 'general', name: 'General Health', icon: <FaHeartbeat /> },
  { id: 'cardio', name: 'Cardiovascular', icon: <FaHeartbeat /> },
  { id: 'mental', name: 'Mental Health', icon: <FaBrain /> },
  { id: 'preventive', name: 'Preventive Care', icon: <FaShieldAlt /> }
]

const foods = [
{
name:"Refined Carbohydrates",
image:"https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
description: "High glycemic index foods that cause rapid blood sugar spikes",
alternatives:[
{name:"Quinoa",image:"https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?w=200", benefits:"Complete protein, fiber-rich, low GI"},
{name:"Millets",image:"https://images.unsplash.com/photo-1598514983318-2f64f8f4796c?w=200", benefits:"Magnesium-rich, gluten-free, sustained energy"},
{name:"Brown Rice",image:"https://images.unsplash.com/photo-1516685018646-549d1c9c1f07?w=200", benefits:"Whole grain, B-vitamins, antioxidants"}
]
},
{
name:"Added Sugars",
image:"https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=400",
description: "Empty calories that contribute to obesity and metabolic disorders",
alternatives:[
{name:"Raw Honey",image:"https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=200", benefits:"Antioxidants, antibacterial, natural sweetener"},
{name:"Organic Jaggery",image:"https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=200", benefits:"Iron-rich, minerals, traditional sweetener"},
{name:"Stevia Extract",image:"https://images.unsplash.com/photo-1604908177522-0400b9c2d2ff?w=200", benefits:"Zero calories, diabetic-friendly, natural"}
]
},
{
name:"Trans Fats",
image:"https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=400",
description: "Artificially hydrogenated oils linked to heart disease",
alternatives:[
{name:"Roasted Foxnuts",image:"https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=200", benefits:"Protein-rich, lotus seed, Ayurvedic superfood"},
{name:"Raw Peanuts",image:"https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=200", benefits:"Heart-healthy fats, resveratrol, antioxidants"},
{name:"Almonds",image:"https://images.unsplash.com/photo-1505253216365-2b9d1d17d17c?w=200", benefits:"Vitamin E, magnesium, brain health"}
]
},
{
name:"Processed Meats",
image:"https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=400",
description: "High in sodium and preservatives, carcinogenic risk",
alternatives:[
{name:"Grass-fed Beef",image:"https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=200", benefits:"Omega-3 rich, CLA, nutrient-dense"},
{name:"Free-range Poultry",image:"https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=200", benefits:"High protein, B-vitamins, lean meat"},
{name:"Plant Proteins",image:"https://images.unsplash.com/photo-1515548706936-056551566c18?w=200", benefits:"Fiber-rich, sustainable, heart-healthy"}
]
},
{
name:"Sugary Beverages",
image:"https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=400",
description: "Liquid calories that contribute to obesity and dental issues",
alternatives:[
{name:"Coconut Water",image:"https://images.unsplash.com/photo-1582450871972-ab5ca641643d?w=200", benefits:"Electrolytes, potassium, natural hydration"},
{name:"Infused Water",image:"https://images.unsplash.com/photo-1524594154908-edd6c9f65db5?w=200", benefits:"Vitamin C, antioxidants, zero calories"},
{name:"Herbal Teas",image:"https://images.unsplash.com/photo-1576092762793-48d4d7c8c6b8?w=200", benefits:"Antioxidants, calming, digestive health"}
]
}
]

const healthTips = {
  general: [
    {icon:<FaHeartbeat size={35}/>,text:"Drink 2-3 liters of water daily", detail:"Hydration supports all bodily functions and prevents dehydration-related fatigue"},
    {icon:<FaRunning size={35}/>,text:"150 minutes moderate exercise weekly", detail:"WHO guidelines for cardiovascular health and weight management"},
    {icon:<FaAppleAlt size={35}/>,text:"5+ servings fruits/vegetables daily", detail:"Rich in vitamins, minerals, and fiber for immune system support"},
    {icon:<FaBed size={35}/>,text:"7-9 hours quality sleep nightly", detail:"Essential for hormone regulation, memory consolidation, and immune function"},
    {icon:<FaWeight size={35}/>,text:"Maintain healthy BMI (18.5-24.9)", detail:"Reduces risk of diabetes, heart disease, and certain cancers"},
    {icon:<FaShieldAlt size={35}/>,text:"Annual health check-ups", detail:"Early detection of potential health issues through preventive screening"}
  ],
  cardio: [
    {icon:<FaHeartbeat size={35}/>,text:"Limit sodium to 2,300mg daily", detail:"Reduces blood pressure and cardiovascular strain"},
    {icon:<FaRunning size={35}/>,text:"30 minutes brisk walking daily", detail:"Improves circulation and reduces heart disease risk by 30%"},
    {icon:<FaAppleAlt size={35}/>,text:"Mediterranean diet pattern", detail:"Olive oil, fish, nuts, vegetables - proven heart protection"},
    {icon:<FaWeight size={35}/>,text:"Maintain healthy cholesterol levels", detail:"LDL <100mg/dL, HDL >40mg/dL for optimal heart health"},
    {icon:<FaLungs size={35}/>,text:"Quit smoking completely", detail:"Reduces heart attack risk by 50% within 1 year of quitting"},
    {icon:<FaStethoscope size={35}/>,text:"Monitor blood pressure regularly", detail:"Target <120/80 mmHg for cardiovascular health"}
  ],
  mental: [
    {icon:<FaBrain size={35}/>,text:"Practice mindfulness meditation", detail:"Reduces stress hormones and improves emotional regulation"},
    {icon:<FaRunning size={35}/>,text:"Regular aerobic exercise", detail:"Releases endorphins and improves mood and cognitive function"},
    {icon:<FaBed size={35}/>,text:"Consistent sleep schedule", detail:"Regulates circadian rhythms essential for mental health"},
    {icon:<FaAppleAlt size={35}/>,text:"Omega-3 rich diet", detail:"Supports brain health and may reduce depression symptoms"},
    {icon:<FaUserMd size={35}/>,text:"Seek professional help when needed", detail:"Therapy and counseling are effective treatments for mental health"},
    {icon:<FaShieldAlt size={35}/>,text:"Build social connections", detail:"Strong relationships provide emotional support and resilience"}
  ],
  preventive: [
    {icon:<FaSyringe size={35}/>,text:"Stay current with vaccinations", detail:"Protects against preventable diseases like flu, HPV, and hepatitis"},
    {icon:<FaEye size={35}/>,text:"Annual eye examinations", detail:"Early detection of glaucoma, cataracts, and vision changes"},
    {icon:<FaTooth size={35}/>,text:"Dental check-ups every 6 months", detail:"Prevents gum disease and maintains overall health"},
    {icon:<FaShieldAlt size={35}/>,text:"Cancer screenings as recommended", detail:"Mammograms, colonoscopies, skin checks based on age and risk"},
    {icon:<FaStethoscope size={35}/>,text:"Regular blood pressure monitoring", detail:"Early intervention prevents hypertension complications"},
    {icon:<FaUserMd size={35}/>,text:"Know your family medical history", detail:"Identifies genetic predispositions for proactive health management"}
  ]
}

return(

<div style={{maxWidth:"1200px",margin:"auto",padding:"40px"}}>

{/* HERO SECTION */}

<div style={{
display:"flex",
alignItems:"center",
justifyContent:"space-between",
marginBottom:"50px",
background:"linear-gradient(135deg,#f0f9ff,#e0f2fe)",
padding:"30px",
borderRadius:"15px"
}}>

<div style={{flex:1}}>

<h1 style={{fontSize:"42px",color:"#1e40af",marginBottom:"10px"}}>🩺 Medical Health Guide</h1>

<p style={{marginTop:"10px",opacity:"0.8",fontSize:"18px",lineHeight:"1.6"}}>
Evidence-based health recommendations from medical professionals.
Focus on prevention, early detection, and healthy lifestyle choices
backed by clinical research and WHO guidelines.
</p>

<div style={{marginTop:"20px",fontSize:"14px",color:"#64748b",fontStyle:"italic"}}>
⚠️ This information is for educational purposes. Consult healthcare providers for personalized medical advice.
</div>

</div>

<img
src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
width="180"
style={{opacity:"0.8"}}
/>

</div>

{/* HEALTH CATEGORIES */}

<div style={{marginBottom:"40px"}}>
<h2 style={{textAlign:"center",marginBottom:"30px",color:"#1e40af"}}>Health Focus Areas</h2>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",
gap:"20px"
}}>

{healthCategories.map((category) => (
<motion.button
key={category.id}
whileHover={{scale:1.05}}
whileTap={{scale:0.95}}
onClick={() => setActiveCategory(category.id)}
style={{
padding:"20px",
background: activeCategory === category.id ? "#3b82f6" : "white",
color: activeCategory === category.id ? "white" : "black",
border:"none",
borderRadius:"12px",
cursor:"pointer",
boxShadow:"0 10px 20px rgba(0,0,0,0.15)",
display:"flex",
flexDirection:"column",
alignItems:"center",
gap:"10px",
fontSize:"16px",
fontWeight:"bold"
}}
>
{category.icon}
{category.name}
</motion.button>
))}

</div>
</div>

{/* DAILY HABITS BY CATEGORY */}

<h2 style={{textAlign:"center",color:"#1e40af"}}>Medical Recommendations</h2>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",
gap:"25px",
marginTop:"30px"
}}>

{healthTips[activeCategory].map((tip,index)=>(
<motion.div
key={index}
whileHover={{scale:1.03}}
style={{
background:"white",
color:"black",
padding:"25px",
borderRadius:"12px",
textAlign:"center",
boxShadow:"0 10px 20px rgba(0,0,0,0.15)",
border:"2px solid #f1f5f9"
}}
>

<div style={{color:"#3b82f6",marginBottom:"15px"}}>
{tip.icon}
</div>

<h3 style={{marginBottom:"10px",color:"#1e40af"}}>{tip.text}</h3>

<p style={{opacity:"0.8",fontSize:"14px",lineHeight:"1.5"}}>{tip.detail}</p>

</motion.div>
))}

</div>

{/* NUTRITIONAL ALTERNATIVES */}

<h2 style={{marginTop:"60px",textAlign:"center",color:"#1e40af"}}>🫒 Evidence-Based Nutrition</h2>
<p style={{textAlign:"center",marginBottom:"30px",opacity:"0.7"}}>
Click on unhealthy foods to discover medically recommended alternatives with proven health benefits</p>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",
gap:"25px",
marginTop:"30px"
}}>

{foods.map((food,index)=>(

<motion.div
key={index}
whileHover={{scale:1.05}}
onClick={()=>setSelectedFood(food)}
style={{
background:"white",
color:"black",
borderRadius:"12px",
overflow:"hidden",
cursor:"pointer",
boxShadow:"0 10px 20px rgba(0,0,0,0.15)",
border:"2px solid #fee2e2"
}}

>

<img
src={food.image}
style={{
width:"100%",
height:"180px",
objectFit:"cover"
}}
/>

<div style={{padding:"20px"}}>
<h3 style={{color:"#dc2626",marginBottom:"8px"}}>⚠️ {food.name}</h3>
<p style={{fontSize:"14px",opacity:"0.8",lineHeight:"1.4"}}>{food.description}</p>
</div>

</motion.div>

))}

</div>

{/* FOOD RESULT */}

{selectedFood && (

<div style={{
marginTop:"40px",
background:"linear-gradient(135deg,#f0fdf4,#dcfce7)",
color:"black",
padding:"30px",
borderRadius:"15px",
boxShadow:"0 15px 30px rgba(0,0,0,0.2)",
border:"2px solid #16a34a"
}}>

<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px"}}>
<h3 style={{color:"#166534",margin:0}}>✅ Healthy Alternatives for {selectedFood.name}</h3>
<button
onClick={()=>setSelectedFood(null)}
style={{
background:"none",
border:"none",
fontSize:"24px",
cursor:"pointer",
color:"#166534"
}}
>×</button>
</div>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",
gap:"25px",
textAlign:"center"
}}>

{selectedFood.alternatives.map((alt,i)=>(

<div key={i}>

<img
src={alt.image}
style={{
width:"80px",
height:"80px",
objectFit:"cover",
borderRadius:"10px"
}}
/>

<p style={{marginTop:"6px"}}>{alt.name}</p>

</div>

))}

</div>

</div>

)}

{/* MEDICAL DISCLAIMER */}

<div style={{
marginTop:"60px",
background:"linear-gradient(135deg,#fef3c7,#fde68a)",
padding:"25px",
borderRadius:"12px",
border:"2px solid #f59e0b",
textAlign:"center"
}}>

<h3 style={{color:"#92400e",marginBottom:"15px"}}>🏥 Medical Disclaimer</h3>

<p style={{color:"#78350f",lineHeight:"1.6",margin:0}}>
This health guide provides general information based on established medical research and WHO guidelines.
Individual health conditions vary, and this is not a substitute for professional medical advice,
diagnosis, or treatment. Always consult with qualified healthcare providers for personalized recommendations.
</p>

</div>

</div>

)

}

export default HealthTips
