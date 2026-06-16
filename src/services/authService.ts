import authApi from './authApi'
import type { LoginRequest, LoginResponse } from '../types'

export const authService = {
  login: (credentials: LoginRequest) =>
    authApi.post<LoginResponse>('/api/auth/login', credentials).then((r) => r.data),
}
