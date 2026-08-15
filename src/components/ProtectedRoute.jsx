import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute({ children }) {
  const { isAuthenticated, status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return <div className="loading-state">Checking session…</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
