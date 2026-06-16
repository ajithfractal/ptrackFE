import axios from 'axios'
import { authStorage } from '@/lib/authStorage'

const authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_BASE_URL ?? 'http://localhost:8083',
  headers: { 'Content-Type': 'application/json' },
})

authApi.interceptors.request.use((config) => {
  const token = authStorage.getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Request failed'
    return Promise.reject(new Error(message))
  }
)

export default authApi
