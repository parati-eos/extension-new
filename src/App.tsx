import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Onboarding from './pages/Onboarding.tsx'

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
      </Routes>
    </Router>
  )
}

export default App
