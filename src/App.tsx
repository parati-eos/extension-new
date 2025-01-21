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
import PitchDeckShare from './components/pitchZynthShare/Share.jsx'
import ProtectedRoutes from './components/shared/ProtectedRoutes.tsx'
import Test from './test/test.tsx'
import PricingPage from './pages/PricingPage.tsx'
import BlogPage from './pages/BlogPage.tsx'
import { SocketProvider } from './components/shared/SubscriptionSocket.tsx'
import RazorpayWebhooks from './components/shared/RazorPayWebHooks.tsx'

const App: React.FC = () => {
  const orgId = sessionStorage.getItem('orgId')
  useEffect(() => {
    const currentUrl = window.location.href

    // Normalize the URL
    const normalizedUrl = currentUrl.endsWith('/')
      ? currentUrl.slice(0, -1)
      : currentUrl

    // Parse the URL for UTM parameters
    const urlParams = new URLSearchParams(window.location.search)

    // Construct the full URL including UTM parameters
    const fullUrlWithUtm = urlParams.toString()
      ? `${normalizedUrl}?${urlParams.toString()}`
      : normalizedUrl

    // Debug: Check if UTM parameters are present
    console.log('URL Parameters:', urlParams.toString())

    // Check if 'sign_up_link' is already in localStorage
    const storedUrl = localStorage.getItem('sign_up_link')

    // Always update the stored URL if UTM parameters are present or if it's the first time
    if (!storedUrl || (storedUrl && storedUrl !== fullUrlWithUtm)) {
      localStorage.setItem('sign_up_link', fullUrlWithUtm)
      console.log('URL with UTM parameters stored:', fullUrlWithUtm)
    } else {
      console.log('URL already stored:', storedUrl)
    }

    const INACTIVITY_THRESHOLD = 3 * 60 * 60 * 1000 // 3 hours in milliseconds
    const CURRENT_USER_EMAIL = sessionStorage.getItem('userEmail') // Replace with actual logic to get logged-in user's email
    // Store the current timestamp of user activity in localStorage with the email as key
    const storeActivityTimestamp = () => {
      localStorage.setItem(
        `lastActivity_${CURRENT_USER_EMAIL}`,
        Date.now().toString()
      )
    }
    // Check if 3 hours of inactivity have passed
    const checkInactivity = () => {
      const lastActivity = localStorage.getItem(
        `lastActivity_${CURRENT_USER_EMAIL}`
      )
      const currentPath = window.location.pathname
      // Define paths for exclusion
      const exactExcludedPaths = ['/'] // Paths that require an exact match
      const prefixExcludedPaths = ['/share', '/presentation-share', '/auth'] // Paths that start with these prefixes

      // Check if current path matches any excluded paths
      const isExactExcludedPath = exactExcludedPaths.includes(currentPath)
      const isPrefixExcludedPath = prefixExcludedPaths.some((path) =>
        currentPath.startsWith(path)
      )

      // Skip inactivity logic if the path is excluded
      if (
        isExactExcludedPath ||
        isPrefixExcludedPath ||
        !lastActivity ||
        Date.now() - parseInt(lastActivity, 10) <= INACTIVITY_THRESHOLD
      ) {
        return
      }
      // Inactivity detected, show alert and redirect
      alert('You have been logged out due to inactivity.')
      localStorage.removeItem(`lastActivity_${CURRENT_USER_EMAIL}`)
      window.location.href = '/' // Redirect to login page
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

    // Listen for storage events to synchronize activity between tabs for the same email
    const handleStorageEvent = (event: StorageEvent) => {
      if (
        event.key === `lastActivity_${CURRENT_USER_EMAIL}` &&
        event.newValue
      ) {
        checkInactivity() // Recheck inactivity when another tab updates the timestamp
      }
    }

    window.addEventListener('storage', handleStorageEvent)

    // Cleanup event listeners and intervals on component unmount
    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, storeActivityTimestamp)
      })
      clearInterval(inactivityInterval)
      window.removeEventListener('storage', handleStorageEvent)
    }
  }, [])

  return (
    <>
      <SocketProvider>
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
            <Route
              path="/razorpay"
              element={<RazorpayWebhooks orgId={orgId!} />}
            />
            <Route path="/presentation-share" element={<PresentationShare />} />
            <Route path="/share" element={<PitchDeckShare />} />
            <Route path="/test" element={<Test />} />
          </Routes>
        </Router>
        <ToastContainer />
      </SocketProvider>
    </>
  )
}

export default App
