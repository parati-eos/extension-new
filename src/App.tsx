import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import OnboardingPage from './pages/OnboardingPage.tsx'
import ViewOrganizationProfilePage from './pages/ViewOrganizationProfilePage.tsx'
import EditOrganizationProfilePage from './pages/EditOrganizationProfilePage.tsx'
import PresentationViewPage from './pages/PresentationViewPage.tsx'
import AuthPage from './pages/AuthPage.tsx'
import HistoryPage from './pages/HistoryPage.tsx'
import PresentationTypePage from './pages/PresentationType.tsx'
import { TokenProvider } from './utils/TokenContext.tsx'
import ImagesPage from './pages/ImagesPage.tsx'
import CustomBuilderTypePage from './pages/CustomBuilderTypePage.tsx'
import SlideNarrativePage from './pages/SlideNarrativePage.tsx'
import CustomBuilderCoverPage from './pages/CustomBuilderPage.tsx'
import TimelinePage from './pages/Timeline.tsx'

const App: React.FC = () => {
  return (
    <TokenProvider>
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
          <Route path="/presentation-view" element={<PresentationViewPage />} />
          <Route path="/custombuilder-cover" element={<CustomBuilderCoverPage/>} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/slide-narrative" element={<SlideNarrativePage />} />
          <Route path="/custombuilder-type" element={<CustomBuilderTypePage/>} />
          <Route path="/Images" element={<ImagesPage/>} />
          <Route path="/Timeline" element={<TimelinePage/>} />
        </Routes>
      </Router>
    </TokenProvider>
  )
}

export default App
