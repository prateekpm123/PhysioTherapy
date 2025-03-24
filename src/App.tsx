import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage/LoginPage";
import "@radix-ui/themes/styles.css";
import { SignIn } from "./pages/SignInPage/SignIn";
import LandingPage from "./pages/LandingPage/LandingPage";
// import { DoctorHomePage } from './pages/DoctorHomePage/DoctorHomePage';
import DoctorHomePageRoutes from "./pages/DoctorHomePage/DoctorHomePageRoutes";
import DoctorDetails from "./pages/DoctorDetails";

const App: React.FC = () => {
  return (
    <Router basename="/PhysioTherapy">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup/details" element={<LoginPage />} />
        <Route path="/signup" element={<SignIn />} />
        <Route path="/doctor/details" element={<DoctorDetails />} />
        {/* <Route path="/doctorhome" element={<DoctorHomePage />} /> */}
        <Route path="/doctorhome/*" element={<DoctorHomePageRoutes />} />{" "}
        {/* Use DoctorHomePageRoutes */}
      </Routes>
    </Router>
  );
};

export default App;
