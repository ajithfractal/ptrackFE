import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { invitationService } from '@/services/invitationService'

export function useInvitationPreview(token: string | null) {
  return useQuery({
    queryKey: ['invitation-preview', token],
    queryFn: () => invitationService.getPreview(token!),
    enabled: !!token,
    retry: false,
  })
}

export function useAcceptInvitation() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (token: string) => invitationService.accept(token),
    onSuccess: (result) => {
      toast.success(`You joined ${result.workspaceName}`)
      navigate('/workspaces', { replace: true })
    },
    onError: (error: Error) => toast.error(error.message),
  })
}

export function buildInvitationAcceptPath(token: string) {
  return `/invitations/accept?token=${encodeURIComponent(token)}`
}

export function resolveInviteToken(searchParams: URLSearchParams) {
  return searchParams.get('token') ?? searchParams.get('invite')
}
