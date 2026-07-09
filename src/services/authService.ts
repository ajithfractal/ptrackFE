import api from './api'
import { endpoints } from '@/lib/endpoints'
import type { ApiResponse, AuthUser, LoginRequest, LoginResponse } from '../types'

type RegisterPayload = {
  email: string
  password: string
  firstName: string
  lastName: string
}

export const authService = {
  login: (credentials: LoginRequest) =>
    api.post<ApiResponse<LoginResponse>>(endpoints.auth.login, credentials).then((r) => r.data.data),

  register: (payload: RegisterPayload) =>
    api.post<ApiResponse<void>>(endpoints.auth.register, payload).then((r) => r.data.data),

  getMe: () => api.get<ApiResponse<AuthUser>>(endpoints.auth.me).then((r) => r.data.data),

  changePassword: (newPassword: string) =>
    api
      .post<ApiResponse<void>>(endpoints.auth.changePassword, null, { params: { newPassword } })
      .then((r) => r.data.data),
}
