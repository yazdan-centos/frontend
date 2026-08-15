import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { login as loginRequest, fetchCurrentUser } from '../api/auth'
import { setUnauthorizedHandler } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null) // { username, role } | null
  const [status, setStatus] = useState('loading') // 'loading' | 'ready'

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken')
    setUser(null)
  }, [])

  // On first load, if a token is already stored, validate it against
  // /api/auth/me instead of trusting it blindly (it may have expired).
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      setStatus('ready')
      return
    }
    fetchCurrentUser()
      .then((current) => setUser(current))
      .catch(() => localStorage.removeItem('accessToken'))
      .finally(() => setStatus('ready'))
  }, [])

  // Any 401 from the API (expired/invalid token) drops the session.
  useEffect(() => {
    setUnauthorizedHandler(() => logout())
  }, [logout])

  const login = useCallback(async (username, password) => {
    const result = await loginRequest(username, password)
    localStorage.setItem('accessToken', result.accessToken)
    setUser({ username: result.username, role: result.role })
    return result
  }, [])

  const value = useMemo(
    () => ({
      user,
      status,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'ADMIN',
      login,
      logout,
    }),
    [user, status, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
