import api from './api'
import { endpoints } from '@/lib/endpoints'
import type { ApiResponse, User, UserSyncResult } from '../types'

export const userService = {
  getAll: () => api.get<ApiResponse<User[]>>(endpoints.users.list).then((r) => r.data.data),

  sync: () => api.post<ApiResponse<UserSyncResult>>(endpoints.users.sync).then((r) => r.data.data),
}
