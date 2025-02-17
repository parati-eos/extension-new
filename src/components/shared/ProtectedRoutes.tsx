import { Outlet, Navigate } from 'react-router-dom'

const ProtectedRoutes = () => {
  const authToken = sessionStorage.getItem('authToken')

  return authToken ? <Outlet /> : <Navigate to="/auth" replace />
}

export default ProtectedRoutes
