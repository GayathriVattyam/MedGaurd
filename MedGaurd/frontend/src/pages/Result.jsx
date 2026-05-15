import { useLocation, useNavigate } from "react-router-dom";

function Result(){

  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state;

  if(!data){
    return <h2 style={{padding:"40px"}}>No Data Found</h2>
  }

  return(

    <div style={{padding:"40px"}}>

      <h1>Prediction Result</h1>

      <div style={{
        padding:"30px",
        background:"white",
        borderRadius:"12px",
        boxShadow:"0 5px 15px rgba(0,0,0,0.1)",
        marginTop:"20px"
      }}>

        <h2>Possible Disease: {data.disease}</h2>

        <p>
          This prediction is based on your symptoms.
          Please consult a doctor for confirmation.
        </p>

      </div>

      <button
        onClick={()=>navigate("/symptom-checker")}
        style={{
          marginTop:"20px",
          padding:"10px 20px",
          background:"#3b82f6",
          color:"white",
          border:"none",
          borderRadius:"8px"
        }}
      >
        Try Again
      </button>

    </div>

  )

}

export default Result;