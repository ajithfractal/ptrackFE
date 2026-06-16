import axios from 'axios'

const authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_BASE_URL ?? 'http://localhost:8083',
  headers: { 'Content-Type': 'application/json' },
})

authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Login failed'
    return Promise.reject(new Error(message))
  }
)

export default authApi
