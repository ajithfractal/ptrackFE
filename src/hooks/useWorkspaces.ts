import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { workspaceService } from '../services/workspaceService'
import type { CreateWorkspaceRequest, InviteMemberRequest, WorkspaceRole } from '../types'

export const useWorkspaces = (role?: WorkspaceRole) => {
  return useQuery({
    queryKey: ['workspaces', role ?? 'all'],
    queryFn: () => workspaceService.getAll(role),
  })
}

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateWorkspaceRequest) => workspaceService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] })
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export const useInviteMember = () => {
  return useMutation({
    mutationFn: ({
      workspaceId,
      data,
    }: {
      workspaceId: string
      data: InviteMemberRequest
    }) => workspaceService.inviteMember(workspaceId, data),
    onSuccess: () => toast.success('Invitation sent'),
    onError: (e: Error) => toast.error(e.message),
  })
}
