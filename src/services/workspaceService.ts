import api from './api'
import { endpoints } from '@/lib/endpoints'
import type {
  ApiResponse,
  CreateWorkspaceRequest,
  InviteMemberRequest,
  Workspace,
  WorkspaceInvitation,
  WorkspaceRole,
} from '../types'

export const workspaceService = {
  getAll: (role?: WorkspaceRole) =>
    api
      .get<ApiResponse<Workspace[]>>(endpoints.workspaces.list, {
        params: role ? { role } : undefined,
      })
      .then((r) => r.data.data),

  create: (data: CreateWorkspaceRequest) =>
    api.post<ApiResponse<Workspace>>(endpoints.workspaces.create, data).then((r) => r.data.data),

  inviteMember: (workspaceId: string, data: InviteMemberRequest) =>
    api
      .post<ApiResponse<WorkspaceInvitation>>(endpoints.workspaces.invite(workspaceId), data)
      .then((r) => r.data.data),
}
