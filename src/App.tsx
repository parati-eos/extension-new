import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import OnboardingPage from './pages/OnboardingPage.tsx'
import ViewOrganizationProfilePage from './pages/ViewOrganizationProfilePage.tsx'
import EditOrganizationProfilePage from './pages/EditOrganizationProfilePage.tsx'
import PresentationViewPage from './pages/PresentationViewPage.tsx'
import AuthPage from './pages/AuthPage.tsx'
import HistoryPage from './pages/HistoryPage.tsx'
import PresentationTypePage from './pages/PresentationType.tsx'
import Points from './components/presentation-view/custom-builder/Points.tsx'
import Test from './test/test.tsx'
import GraphPage from './pages/GraphPage.tsx'
import LandingPage from './pages/LandingPage.tsx'

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route
          path="/organization-profile"
          element={<ViewOrganizationProfilePage />}
        />
        <Route
          path="/edit-organization-profile"
          element={<EditOrganizationProfilePage />}
        />
        <Route path="/new-presentation" element={<PresentationTypePage />} />
        <Route path="/graph" element={<GraphPage />} />
        <Route path="/presentation-view/" element={<PresentationViewPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/points" element={<Points />} />
        <Route path="/test" element={<Test />} />
        <Route path="/landing-page" element={<LandingPage />} />
      </Routes>
    </Router>
  )
}

export default App
