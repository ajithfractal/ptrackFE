import api from './api'
import { endpoints } from '@/lib/endpoints'
import type { ApiResponse, InvitationAcceptResult, InvitationPreview } from '../types'

export const invitationService = {
  getPreview: (token: string) =>
    api
      .get<ApiResponse<InvitationPreview>>(endpoints.invitations.preview(token))
      .then((response) => response.data.data),

  accept: (token: string) =>
    api
      .post<ApiResponse<InvitationAcceptResult>>(endpoints.invitations.accept(token))
      .then((response) => response.data.data),
}
