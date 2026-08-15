import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { RoleBadge } from './RoleBadge'

export function Layout({ children }) {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar__brand">
          <span className="topbar__brand-mark">Registry</span>
          <span className="topbar__brand-sub">Personnel Directory</span>
        </div>
        {isAuthenticated && (
          <div className="topbar__session">
            <span>{user.username}</span>
            <RoleBadge role={user.role} />
            <button className="topbar__logout" onClick={handleLogout}>
              Log out
            </button>
          </div>
        )}
      </header>
      <main className="page">{children}</main>
    </div>
  )
}
