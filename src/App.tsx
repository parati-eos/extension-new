import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/pages/Home";
import Login from "./components/auth/login";
import OnboardingContainer from "./components/pages/OnboardingContainer";
import PresentationBuilder from "./components/pages/PresentationBuilder";
import Refineppt from "./components/pages/refineppt";
import Refinepresentations from "./components/pages/newpresentation";
const App = () => {
  useEffect(() => {
    const extractPresentationId = () => {
      const match = window.location.href.match(/presentation\/d\/([a-zA-Z0-9-_]+)/);
      if (match) {
        sessionStorage.setItem("presentationId", match[1]); // Store it in localStorage
        console.log("Captured Presentation ID:", match[1]); // Debugging
      }
    };

    extractPresentationId();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<OnboardingContainer />} />
        <Route path="/new-presentation" element={<PresentationBuilder />} />
        <Route path="/refine-ppt" element={<Refineppt />} />
        <Route path="/refine-presentation" element={<Refinepresentations/>}/>
      </Routes>
    </Router>
  );
};

export default App;
