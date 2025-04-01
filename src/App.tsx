import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage/LoginPage";
import "@radix-ui/themes/styles.css";
import { SignIn } from "./pages/SignInPage/SignIn";
import LandingPage from "./pages/LandingPage/LandingPage";
// import { DoctorHomePage } from './pages/DoctorHomePage/DoctorHomePage';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import DoctorHomePageRoutes from "./pages/DoctorHomePage/DoctorHomePageRoutes";
import DoctorDetails from "./pages/DoctorDetails";
import { DoctorHomePage } from "./pages/DoctorHomePage/DoctorHomePage";
import PatientTreatmentBuilder from "./pages/DoctorHomePage/PatientTreatmentBuilder";
import PatientTreatmentHistory from "./pages/DoctorHomePage/PatientTreatmentHistory";
import CreateExcercisePlanPage from "./pages/DoctorHomePage/MainPages/CreateExcercisePlanPage";
import PatientDetails from "./pages/DoctorHomePage/MainPages/PatientDetails";
import PatientList from "./pages/DoctorHomePage/MainPages/PatientLIst";
import NewPatientEntry from "./pages/DoctorHomePage/MainPages/NewPatientEntry";
import DoctorHomeLandingPage from "./pages/DoctorHomePage/MainPages/DoctorHomeLandingPage";
import { ExcerciseBuilder } from "./pages/DoctorHomePage/MainPages/ExcerciseBuilder";
import DoctorSettings from "./pages/DoctorHomePage/DoctorSettings";
import NotFound from "./pages/NotFound";
// import Modal from "./pages/DoctorHomePage/MainPages/ExcerciseBuilder/TestModal";
import { EditExcercise } from "./pages/DoctorHomePage/MainPages/ExcerciseBuilder/EditExcercise";
import { ExcerciseDetail } from "./pages/DoctorHomePage/MainPages/ExcerciseBuilder/ExcerciseDetail";
import { AddExcercise } from "./pages/DoctorHomePage/MainPages/ExcerciseBuilder/AddExcercise";
import DeleteExcercise from "./pages/DoctorHomePage/MainPages/ExcerciseBuilder/DeleteExcercise";
import ExcercisePlanDetailsPage from "./pages/DoctorHomePage/MainPages/ExcercisePlanDetailsPage";
import ExcercisePlanTrackSession from "./pages/DoctorHomePage/MainPages/ExcercisePlanTrackSession";

const App: React.FC = () => {
  // const {oeid} = useParams();
  return (
    <Router basename="/PhysioTherapy">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/signup" element={<SignIn />}></Route>
        <Route path="/signup/details" element={<DoctorDetails />} />
        {/* <Route path="/doctorhome" element={<DoctorHomePage />} /> */}
        {/* <Route path="/doctorhome/*" element={<DoctorHomePageRoutes />} /> */}
        <Route path="/doctorhome" element={<DoctorHomePage />}>
          <Route path="main" element={<DoctorHomeLandingPage />}>
            <Route path="newPatient" element={<NewPatientEntry />} />
            <Route path="patientDetails/:pid" element={<PatientDetails />}/>
            <Route path="patientDetails/:pid/excercisePlans/:epid" element={<ExcercisePlanDetailsPage  />} />
            <Route path="patientDetails/:pid/excercisePlans/:epid/trackSession" element={<ExcercisePlanTrackSession />} />
            <Route path="patientDetails/:pid/buildPlan" element={<ExcerciseBuilder />} >
              <Route path="editExcercise/:oeid" element={<EditExcercise />}/>
              <Route path="excerciseDetails/:oeid" element={<ExcerciseDetail />}/>
              <Route path="addExcercise" element={<AddExcercise />}/>
              <Route path="deleteExcercise" element={<DeleteExcercise />}/>
            </Route>
            <Route path="patientDetails/:pid/buildPlan/createPlan" element={<CreateExcercisePlanPage />} />
          </Route>
          <Route path="settings" element={<DoctorSettings />} />
          <Route path="patientList" element={<PatientList />} />
          <Route
            path="patientTreatmentHistory"
            element={<PatientTreatmentHistory />}
          />
          <Route
            path="patientTreatmentBuilder"
            element={<PatientTreatmentBuilder />}
          />
        </Route>
        {/* Use DoctorHomePageRoutes */}
      </Routes>
    </Router>
  );
};

export default App;
