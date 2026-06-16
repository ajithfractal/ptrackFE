import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { userService } from '../services/userService'

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAll(),
  })
}

export const useSyncUsers = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => userService.sync(),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success(
        `Synced ${result.total} user${result.total === 1 ? '' : 's'} (${result.created} new, ${result.updated} updated)`
      )
    },
    onError: (e: Error) => toast.error(e.message),
  })
}
