import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
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
import ProtectedRoutes from './components/shared/ProtectedRoutes.tsx'
import Test from './test/test.tsx'
import PricingPage from './pages/PricingPage.tsx'

const App: React.FC = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoutes>
                <Routes>
                  <Route path="onboarding" element={<OnboardingPage />} />
                  <Route
                    path="organization-profile"
                    element={<ViewOrganizationProfilePage />}
                  />
                  <Route
                    path="edit-organization-profile"
                    element={<EditOrganizationProfilePage />}
                  />
                  <Route
                    path="new-presentation"
                    element={<PresentationTypePage />}
                  />
                  <Route
                    path="presentation-view"
                    element={<PresentationViewPage />}
                  />
                  <Route path="history" element={<HistoryPage />} />
                  <Route path="share" element={<PresentationShare />} />
                 
                </Routes>
              </ProtectedRoutes>
            }
          />
          <Route path="/test" element={<Test />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  )
}

export default App
