import api from './api'
import { endpoints } from '@/lib/endpoints'
import type { ApiResponse, UserProfile } from '../types'

export const profileService = {
  get: () => api.get<ApiResponse<UserProfile>>(endpoints.profile.get).then((r) => r.data.data),

  uploadAvatar: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api
      .post<ApiResponse<UserProfile>>(endpoints.profile.avatar, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data.data)
  },

  updateBio: (bio: string) =>
    api.put<ApiResponse<UserProfile>>(endpoints.profile.bio, { bio }).then((r) => r.data.data),
}
