import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import OnboardingPage from './pages/OnboardingPage.tsx'
import ViewOrganizationProfilePage from './pages/ViewOrganizationProfilePage.tsx'
import EditOrganizationProfilePage from './pages/EditOrganizationProfilePage.tsx'
import PresentationViewPage from './pages/PresentationViewPage.tsx'
import AuthPage from './pages/AuthPage.tsx'
import HistoryPage from './pages/HistoryPage.tsx'
import PresentationTypePage from './pages/PresentationType.tsx'
import LandingPage from './pages/LandingPage.tsx'
import PresentationShare from './pages/PresentationShare.tsx'
import PitchDeckShare from './components/pitchZynthShare/Share.jsx'
import ProtectedRoutes from './components/shared/ProtectedRoutes.tsx'
import PricingPage from './pages/PricingPage.tsx'
import BlogPage from './pages/BlogPage.tsx'
import { SocketProvider } from './components/payment/SubscriptionSocket.tsx'
import ContactUsPage from './pages/ContactUsPage.tsx'
import ReferPage from './pages/ReferPage.tsx'
import ReactGA from 'react-ga';
// Initialize Google Analytics
ReactGA.initialize('G-YHL4Z27NY0');

const TrackPageView = () => {
  const location = useLocation();

  useEffect(() => {
    ReactGA.pageview(location.pathname + location.search);
  }, [location]);

  return null; // No UI component, just tracking
};

const App: React.FC = () => {
  useEffect(() => {
    const currentUrl = window.location.href;

    // Normalize the URL
    const normalizedUrl = currentUrl.endsWith('/')
      ? currentUrl.slice(0, -1)
      : currentUrl;

    // Parse the URL for UTM parameters
    const urlParams = new URLSearchParams(window.location.search);

    // Construct the full URL including UTM parameters
    const fullUrlWithUtm = urlParams.toString() ? normalizedUrl : normalizedUrl;

    console.log('URL Parameters:', urlParams.toString());

    const storedUrl = localStorage.getItem('sign_up_link');

    if (!storedUrl || storedUrl !== fullUrlWithUtm) {
      localStorage.setItem('sign_up_link', fullUrlWithUtm);
      console.log('URL with UTM parameters stored:', fullUrlWithUtm);
    }

    // Store referral details in sessionStorage
    const referralCode = urlParams.get('referralCode');
    const referredByOrgId = urlParams.get('orgId');
    const referredByUserId = urlParams.get('userId');

    if (referredByOrgId) sessionStorage.setItem('referredByOrgId', referredByOrgId);
    if (referredByUserId) sessionStorage.setItem('referredByUserId', referredByUserId);
    if (referralCode) sessionStorage.setItem('referralCode', referralCode);

    console.log('Session Storage Updated:', { referredByOrgId, referredByUserId, referralCode });

  }, []);

  return (
    <SocketProvider>
      <Router>
        <TrackPageView />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contact-us" element={<ContactUsPage />} />

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

          {/* Sharing Routes */}
          <Route path="/presentation-share" element={<PresentationShare />} />
          <Route path="/share" element={<PitchDeckShare />} />
        </Routes>
      </Router>
      <ToastContainer />
    </SocketProvider>
  );
};

export default App;
