// DoctorHomePageRoutes.tsx
import { Routes, Route } from "react-router-dom";
import { DoctorHomePage } from "./DoctorHomePage";
import NewPatientEntry from "./NewPatientEntry"; // Example component
import DoctorHomePageCentre  from "./DoctorHomePageCentre";
import PatientList from "./PatientLIst";
import PatientDetails from "./PatientDetails";
import PatientTreatmentHistory from "./PatientTreatmentHistory";
import PatientTreatmentBuilder from "./PatientTreatmentBuilder";

const DoctorHomePageRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DoctorHomePage />}>
        <Route index element={<DoctorHomePageCentre />} />
        {/* <Route index element={<div onClick={()=> navigate("/doctorhome/patientList")}>Patient List</div>} />
        <Route index element={<div onClick={()=> navigate("/doctorhome/patientDetails")}>Patient Details</div>} />
        <Route index element={<div onClick={()=> navigate("/doctorhome/patientTreatmentHistory")}>Patient treatment History</div>} />
        <Route index element={<div onClick={()=> navigate("/doctorhome/patientTreatmentBuilder")}>Patient Treatment builder</div>} /> */}
        {/* Default route */}
        {/* ... other nested routes ... */}
        <Route path="newPatient" element={<NewPatientEntry />} />
        <Route path="patientList" element={<PatientList />} />
        <Route path="patientDetails" element={<PatientDetails />} />
        <Route path="patientTreatmentHistory" element={<PatientTreatmentHistory />} />
        <Route path="patientTreatmentBuilder" element={<PatientTreatmentBuilder />} />
      </Route>
    </Routes>
  );
};

export default DoctorHomePageRoutes;
