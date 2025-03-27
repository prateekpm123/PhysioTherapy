// DoctorHomePageRoutes.tsx
import { Routes, Route } from "react-router-dom";
import { DoctorHomePage } from "./DoctorHomePage";
import NewPatientEntry from "./MainPages/NewPatientEntry"; // Example component
// import DoctorHomePageCentre  from "./DoctorHomePageCentre";
import PatientList from "./MainPages/PatientLIst";
import PatientDetails from "./MainPages/PatientDetails";
import PatientTreatmentHistory from "./PatientTreatmentHistory";
import PatientTreatmentBuilder from "./PatientTreatmentBuilder";
import DoctorHomeLandingPage from "./MainPages/DoctorHomeLandingPage";
import CreateExcercisePlanPage from "./MainPages/CreateExcercisePlanPage";
// import { iExcerciseDataDto } from "../../models/ExcerciseInterface";
// import CreateExcercisePlanPage from "../CreateExcercisePlanPage";
// import { useState } from "react";
// import { iPatientDto } from "../../dtos/PatientDto";

const DoctorHomePageRoutes = () => {

  return (
    <Routes>
      <Route path="/" element={<DoctorHomePage />}>
        {/* <Route index element={<DoctorHomePageCentre />} /> */}
        <Route index element={<DoctorHomeLandingPage />} />
        {/* <Route index element={<DoctorHomeLandingPage onSave={onNewPatientCreation} refreshTrigger={patientListRefresh} setPatientListRefresh={setPatientListRefresh}/>} /> */}
        
        {/* ... other nested routes ... */}
        <Route path="newPatient" element={<NewPatientEntry />}/>
        {/* <Route path="newPatient" element={<NewPatientEntry onSave={onNewPatientCreation}/>} /> */}
        <Route path="patientList" element={<PatientList />} />
        <Route path="patientDetails" element={<PatientDetails />} />
        <Route path="createPlan" element={<CreateExcercisePlanPage />} />
        <Route path="patientTreatmentHistory" element={<PatientTreatmentHistory />} />
        <Route path="patientTreatmentBuilder" element={<PatientTreatmentBuilder />} />
      </Route>
    </Routes>
  );
};

export default DoctorHomePageRoutes;
