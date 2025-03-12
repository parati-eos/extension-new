import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import 'react-toastify/dist/ReactToastify.css';

// Import Pages
import OnboardingPage from './pages/OnboardingPage.tsx';
import ViewOrganizationProfilePage from './pages/ViewOrganizationProfilePage.tsx';
import EditOrganizationProfilePage from './pages/EditOrganizationProfilePage.tsx';
import PresentationViewPage from './pages/PresentationViewPage.tsx';
import AuthPage from './pages/AuthPage.tsx';
import HistoryPage from './pages/HistoryPage.tsx';
import PresentationTypePage from './pages/PresentationType.tsx';
import LandingPage from './pages/LandingPage.tsx';
import PresentationShare from './pages/PresentationShare.tsx';
import PitchDeckShare from './components/pitchZynthShare/Share.jsx';
import PricingPage from './pages/PricingPage.tsx';
import BlogPage from './pages/BlogPage.tsx';
import ContactUsPage from './pages/ContactUsPage.tsx';
import ReferPage from './pages/ReferPage.tsx';

// Import Components
import ProtectedRoutes from './components/shared/ProtectedRoutes.tsx';
import { SocketProvider } from './components/payment/SubscriptionSocket.tsx';

// Import Google Analytics
import ReactGA from 'react-ga';
import UseCasesSalesPage from './pages/UseCasesSalesPage.tsx';
import UseCasesProductPage from './pages/UseCasesProductPage.tsx';
import UseCasesPitchPage from './pages/UseCasesPitchPage.tsx';
import UseCasesMarketingPage from './pages/UseCasesMarketingPage.tsx';
import UseCasesEmployeePage from './pages/UseCasesEmloyeePage.tsx';
import UseCasesProjectPage from './pages/UseCasesProjectPage.tsx';
import UseCasesBoardPage from './pages/UseCasesBoardPage.tsx';
import UseCasesEducationPage from './pages/UseCasesEducationPage.tsx';

// Extend the Window interface to include dataLayer
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Initialize Google Analytics
ReactGA.initialize('G-YHL4Z27NY0');

/**
 * Tracks Page Views for Google Analytics
 */
const TrackPageView: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    ReactGA.pageview(location.pathname + location.search);
  }, [location]);

  return null; // No UI component, just tracking behavior
};

/**
 * ✅ Auth Token Expiry Check (Inside Router)
 * ✅ Excludes PresentationShare from auto logout
 * ✅ Fixes infinite redirect issue
 */
const AuthCheckComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Exclude auto-logout on /presentation-share page
    if (location.pathname === '/presentation-share') {
      return;
    }

    const checkTokenExpiry = () => {
      const token = sessionStorage.getItem('authToken');
      if (!token) {
        handleLogout();
        return;
      }

      try {
        const decoded: { exp?: number } = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (!decoded.exp || decoded.exp <= currentTime) {
          handleLogout();
          return;
        }

        // Set auto logout timeout
        const timeoutDuration = (decoded.exp - currentTime) * 1000;
        setTimeout(() => {
          handleLogout();
        }, timeoutDuration);
      } catch (error) {
        console.error('Invalid token:', error);
        handleLogout();
      }
    };

    const handleLogout = () => {
      sessionStorage.removeItem('authToken');

      // ✅ Properly exclude '/share' and '/presentation-share' from logout redirection
      if (location.pathname !== '/share' && location.pathname !== '/presentation-share'&& location.pathname !== '/'&& location.pathname !== '/auth') {
        window.location.href = 'https://zynth.ai/';
      }
    };

    checkTokenExpiry();

    // Run token check every 1 minute
    const interval = setInterval(checkTokenExpiry, 60 * 1000);

    return () => clearInterval(interval);
  }, [location]);

  return null;
};

const App: React.FC = () => {
  useEffect(() => {
    // ✅ Google Tag Manager Script
    const gtagScript = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = "https://www.googletagmanager.com/gtag/js?id=AW-667504395";
    document.head.appendChild(gtagScript);

    gtagScript.onload = () => {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', 'AW-667504395');
    };

    // ✅ Restore UTM & Referral Tracking Logic
    // Normalize the URL (remove trailing slash if present)
    const currentUrl = window.location.href;
    const normalizedUrl = currentUrl.endsWith('/') ? currentUrl.slice(0, -1) : currentUrl;

    console.log('Normalized URL:', normalizedUrl);

    // Store ANY URL (with or without UTM parameters)
    const storedUrl = localStorage.getItem('sign_up_link');

    if (!storedUrl || storedUrl !== normalizedUrl) {
      localStorage.setItem('sign_up_link', normalizedUrl);
      console.log('Stored URL:', normalizedUrl);
    }

    // Parse UTM parameters
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = urlParams.toString();

    console.log('Extracted UTM Parameters:', utmParams);

    // Store UTM parameters separately if present
    if (utmParams) {
      localStorage.setItem('utm_params', utmParams);
      console.log('Stored UTM Parameters:', utmParams);
    }

    // Store referral details in sessionStorage
    const referralCode = urlParams.get('referralCode');
    const referredByOrgId = urlParams.get('orgId');
    const referredByUserId = urlParams.get('userId');

    if (referredByOrgId) sessionStorage.setItem('referredByOrgId', referredByOrgId);
    if (referredByUserId) sessionStorage.setItem('referredByUserId', referredByUserId);
    if (referralCode) sessionStorage.setItem('referralCode', referralCode);

    console.log('Referral Data Stored:', { referredByOrgId, referredByUserId, referralCode });

  }, []);

  return (
    <SocketProvider>
      <Router>
        <AuthCheckComponent /> {/* ✅ Placed inside Router */}
        <TrackPageView />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contact-us" element={<ContactUsPage />} />

          {/* Sharing Routes */}
          <Route path="/presentation-share" element={<PresentationShare />} /> {/* ✅ No auto logout here */}
          <Route path="/share" element={<PitchDeckShare />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoutes />}>
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/organization-profile" element={<ViewOrganizationProfilePage />} />
            <Route path="/edit-organization-profile" element={<EditOrganizationProfilePage />} />
            <Route path="/new-presentation" element={<PresentationTypePage />} />
            <Route path="/presentation-view" element={<PresentationViewPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/refer" element={<ReferPage />} />
          </Route>
        </Routes>
      </Router>
      <ToastContainer />
    </SocketProvider>
  );
};

export default App;
