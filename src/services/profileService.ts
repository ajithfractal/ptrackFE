import api from './api'
import type { ApiResponse, UserProfile } from '../types'

export const profileService = {
  get: () => api.get<ApiResponse<UserProfile>>('/api/profile').then((r) => r.data.data),

  uploadAvatar: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api
      .post<ApiResponse<UserProfile>>('/api/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data.data)
  },

  updateBio: (bio: string) =>
    api.put<ApiResponse<UserProfile>>('/api/profile/bio', { bio }).then((r) => r.data.data),
}
