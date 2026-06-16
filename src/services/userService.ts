import api from './api'
import type { ApiResponse, User, UserSyncResult } from '../types'

export const userService = {
  getAll: () => api.get<ApiResponse<User[]>>('/api/users').then((r) => r.data.data),

  sync: () => api.post<ApiResponse<UserSyncResult>>('/api/users/sync').then((r) => r.data.data),
}
