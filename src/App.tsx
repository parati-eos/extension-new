import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Onboarding from './pages/Onboarding.tsx'
import { UserProvider } from './utils/UserContext.tsx'

const App: React.FC = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/onboarding" element={<Onboarding />} />
        </Routes>
      </Router>
    </UserProvider>
  )
}

export default App
