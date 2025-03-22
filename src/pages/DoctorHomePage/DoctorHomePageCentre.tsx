import { useNavigate } from "react-router-dom";
import ThemeColorPallate from "../../assets/ThemeColorPallate";

const DoctorHomePageCentre = () => {
    const navigate = useNavigate();
    return (
        <div style={{width: "100wh", height: "100vh", backgroundColor: ThemeColorPallate.background }}>
            <div onClick={()=> navigate("/doctorhome/newPatient")}>New Patient</div>
            <div onClick={()=> navigate("/doctorhome/patientList")}>Patient list</div>
            <div onClick={()=> navigate("/doctorhome/patientDetails")}>Patient Details</div>
            <div onClick={()=> navigate("/doctorhome/patientTreatmentHistory")}>Treatment History</div>
            <div onClick={()=> navigate("/doctorhome/patientTreatmentBuilder")}>Treatment builder</div>
        </div>
    );
}

export default DoctorHomePageCentre;