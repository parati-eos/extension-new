import React, { useEffect } from 'react'
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
import PitchZynthShare from './components/pitchZynthShare/Share.jsx'
import ProtectedRoutes from './components/shared/ProtectedRoutes.tsx'
import Test from './test/test.tsx'
import PricingPage from './pages/PricingPage.tsx'
import BlogPage from './pages/BlogPage.tsx'

const App: React.FC = () => {
  useEffect(() => {
    const INACTIVITY_THRESHOLD = 3 * 60 * 60 * 1000 // 3 hours in milliseconds

    // Store the current timestamp of user activity
    const storeActivityTimestamp = () => {
      sessionStorage.setItem('lastActivity', Date.now().toString())
    }

    // Check if 3 hours of inactivity have passed
    const checkInactivity = () => {
      const lastActivity = sessionStorage.getItem('lastActivity')
      if (
        lastActivity &&
        Date.now() - parseInt(lastActivity, 10) > INACTIVITY_THRESHOLD
      ) {
        // 2 hours of inactivity detected, redirect to login page
        window.location.href = '/auth/login' // Use window.location for redirect
        sessionStorage.clear()
      }
    }

    // Add event listeners for user activity
    const activityEvents = ['click', 'mousemove', 'keypress', 'scroll']
    activityEvents.forEach((event) => {
      window.addEventListener(event, storeActivityTimestamp)
    })

    // Set the initial timestamp when the app loads
    storeActivityTimestamp()

    // Check inactivity every minute (or adjust interval as needed)
    const inactivityInterval = setInterval(checkInactivity, 60 * 1000)

    // Cleanup event listeners and intervals on component unmount
    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, storeActivityTimestamp)
      })
      clearInterval(inactivityInterval)
    }
  }, [])

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/blog" element={<BlogPage />} />
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
                </Routes>
              </ProtectedRoutes>
            }
          />
          <Route path="/presentation" element={<PresentationShare />} />
          <Route path="/share" element={<PitchZynthShare />} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  )
}

export default App
