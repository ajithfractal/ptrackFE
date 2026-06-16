import authApi from './authApi'
import type { AuthUser, LoginRequest, LoginResponse, RegisterRequest } from '../types'

const APPLICATION_CODE = import.meta.env.VITE_APPLICATION_CODE ?? 'ptrack'

export const authService = {
  login: (credentials: LoginRequest) =>
    authApi.post<LoginResponse>('/api/auth/login', credentials).then((r) => r.data),

  register: (payload: Omit<RegisterRequest, 'applicationCode' | 'orgUnitId'> & {
    orgUnitId?: string
    applicationCode?: string
  }) =>
    authApi
      .post('/api/auth/register', {
        ...payload,
        orgUnitId: payload.orgUnitId ?? '',
        applicationCode: payload.applicationCode ?? APPLICATION_CODE,
      })
      .then((r) => r.data),

  getMe: () => authApi.get<AuthUser>('/api/auth/me').then((r) => r.data),

  changePassword: (newPassword: string) =>
    authApi
      .post('/api/auth/password/change', null, { params: { newPassword } })
      .then((r) => r.data),
}
