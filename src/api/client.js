import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export const client = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach the bearer token, if one is stored, to every request.
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// The API returns RFC 7807 ProblemDetail bodies on error:
// { type, title, status, detail, instance }
// Normalize that into a plain message string so callers don't
// need to know about the response shape.
export function extractErrorMessage(error) {
  const detail = error?.response?.data?.detail
  if (detail) return detail
  if (error?.message === 'Network Error') {
    return 'Could not reach the server. Check that the API is running and CORS is configured for this origin.'
  }
  return error?.message || 'Something went wrong'
}

let onUnauthorized = null
export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler
}

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && onUnauthorized) {
      onUnauthorized()
    }
    return Promise.reject(error)
  }
)
