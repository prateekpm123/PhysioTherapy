import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ExcerciseBuilder } from './pages/ExcerciseBuilder';
import { LoginPage } from './pages/LoginPage/LoginPage';
import "@radix-ui/themes/styles.css";
import { SignIn } from './pages/SignInPage/SignIn';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ExcerciseBuilder />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignIn />} />
      </Routes>
    </Router>
  );
};

export default App;