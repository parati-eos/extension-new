import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/pages/Home";
import Login from "./components/auth/Login";
import OnboardingContainer from "./components/pages/OnboardingContainer";
import PresentationBuilder from "./components/pages/PresentationBuilder";
import Refineppt from "./components/pages/refineppt";
import Refinepresentations from "./components/pages/newpresentation";
import PresentationSuccess from "./components/pages/PresentationSuccess";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import PricingModal from './components/pages/Pricing';
import { initGA, logPageView } from "./analytics"; // 👈 Import analytics
import RewriteRefinePanel from "./components/pages/RewriteRefinePanel";
import ToneAudiencePanel from "./components/pages/ToneAudiencePanel";
import ExtensionLandingPage from "./components/pages/ExtensionLandingPage";

//import { Pricing } from "aws-sdk";

const App = () => {
  const [presentationId, setPresentationId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Loader on by default
    useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const presId = queryParams.get("presentationId");

    if (presId) {
      setPresentationId(presId);
      sessionStorage.setItem("presentationId", presId);
      setLoading(false);
    } else {
      const storedId = sessionStorage.getItem("presentationId");
      if (storedId) {
        setPresentationId(storedId);
      }
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initGA(); // :point_left: Initialize Google Analytics
  }, []);
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
    <ToastContainer />
      <Routes>
      {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<ExtensionLandingPage />} />
        <Route  path="/login" element={<Login />} />
        <Route path="/onboarding" element={<OnboardingContainer />} />
        <Route path="/new-presentation" element={<PresentationBuilder />} />
        <Route path="/refine-ppt" element={<Refineppt />} />
        {/* <Route path='/sidebar' element={<Refinepresentations/>} /> */}
        <Route path="/refine-presentation" element={<Refinepresentations/>}/>
        <Route path="/presentation-success" element={<PresentationSuccess />} />
        <Route path="/pricing" element={<PricingModal/>} />
        {/* <Route path="/rewrite-refine" element={<RewriteRefinePanel onBack={() => navigate(-1)} />} />
        <Route path="/tone-audience" element={<ToneAudiencePanel onBack={() => navigate(-1)} />} /> */}

      </Routes>
   
    </Router>
  );
};

export default App;
