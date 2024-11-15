import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Onboarding from './pages/Onboarding.tsx'
import ViewOrganizationProfile from './pages/ViewOrganizationProfile.tsx'
import EditOrganizationProfile from './pages/EditOrganizationProfile.tsx'

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route
          path="/organization-profile"
          element={<ViewOrganizationProfile />}
        />
        <Route
          path="/edit-organization-profile"
          element={<EditOrganizationProfile />}
        />
      </Routes>
    </Router>
  )
}

export default App
