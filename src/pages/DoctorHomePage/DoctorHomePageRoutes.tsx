// DoctorHomePageRoutes.tsx
import { Routes, Route } from "react-router-dom";
import { DoctorHomePage } from "./DoctorHomePage";
import NewPatientEntry from "./NewPatientEntry"; // Example component
// import DoctorHomePageCentre  from "./DoctorHomePageCentre";
import PatientList from "./PatientLIst";
import PatientDetails from "./PatientDetails";
import PatientTreatmentHistory from "./PatientTreatmentHistory";
import PatientTreatmentBuilder from "./PatientTreatmentBuilder";
import DoctorHomeLandingPage from "./DoctorHomeLandingPage";
import { useState } from "react";
// import { iPatientDto } from "../../dtos/PatientDto";

const DoctorHomePageRoutes = () => {
  // const [patients, setPatients] = useState([] as iPatientDto[]);
  const [patientListRefresh, setPatientListRefresh] = useState(false);
  const onNewPatientCreation = () =>{
    setPatientListRefresh(!patientListRefresh);
  }

  return (
    <Routes>
      <Route path="/" element={<DoctorHomePage />}>
        {/* <Route index element={<DoctorHomePageCentre />} /> */}
        <Route index element={<DoctorHomeLandingPage onSave={onNewPatientCreation} refreshTrigger={patientListRefresh} setPatientListRefresh={setPatientListRefresh}/>} />
        
        {/* ... other nested routes ... */}
        <Route path="newPatient" element={<NewPatientEntry onSave={onNewPatientCreation}/>} />
        <Route path="patientList" element={<PatientList refreshTrigger={patientListRefresh} setPatientListRefresh={setPatientListRefresh}/>} />
        <Route path="patientDetails" element={<PatientDetails />} />
        <Route path="patientTreatmentHistory" element={<PatientTreatmentHistory />} />
        <Route path="patientTreatmentBuilder" element={<PatientTreatmentBuilder />} />
      </Route>
    </Routes>
  );
};

export default DoctorHomePageRoutes;
