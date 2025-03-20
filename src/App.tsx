import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { LoginPage } from './pages/LoginPage/LoginPage';
import "@radix-ui/themes/styles.css";
import { SignIn } from './pages/SignInPage/SignIn';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignIn />} />
      </Routes>
    </Router>
  );
};

export default App;