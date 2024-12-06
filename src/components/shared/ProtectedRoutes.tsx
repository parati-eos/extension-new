import React from 'react'
import { Navigate } from 'react-router-dom'

interface ProtectedRoutesProps {
  children: React.ReactNode
}

const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({ children }) => {
  const authToken = sessionStorage.getItem('authToken')

  if (!authToken) {
    return <Navigate to="/auth" replace />
  }

  return <>{children}</>
}

export default ProtectedRoutes
