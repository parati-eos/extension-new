import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/pages/Home";
import Login from "./components/auth/login";
import OnboardingContainer from "./components/pages/OnboardingContainer";
import PresentationBuilder from "./components/pages/PresentationBuilder";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<OnboardingContainer />} />
        <Route path="/new-presentation" element={<PresentationBuilder />} />
      </Routes>
    </Router>
  );
};

export default App;
