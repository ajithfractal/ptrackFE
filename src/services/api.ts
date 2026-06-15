import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = import.meta.env.VITE_API_TOKEN
  if (token?.trim()) {
    config.headers.Authorization = `Bearer ${token.trim()}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

export default api
