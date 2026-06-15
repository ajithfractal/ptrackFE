import api from './api'
import type { CreateWorkspaceRequest, Workspace } from '../types'

export const workspaceService = {
  getAll: () =>
    api.get<{ data: Workspace[] }>('/api/workspaces').then((r) => r.data.data),

  create: (data: CreateWorkspaceRequest) =>
    api.post<{ data: Workspace }>('/api/workspaces', data).then((r) => r.data.data),
}
