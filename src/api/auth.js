import { client } from './client'

// POST /api/auth/login
// Request:  { username, password }
// Response: { accessToken, tokenType, expiresIn, username, role }
export async function login(username, password) {
  const { data } = await client.post('/api/auth/login', { username, password })
  return data
}

// GET /api/auth/me
// Response: { username, role }
export async function fetchCurrentUser() {
  const { data } = await client.get('/api/auth/me')
  return data
}
