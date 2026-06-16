import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { profileService } from '../services/profileService'

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => profileService.get(),
  })
}

export const useUploadAvatar = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (file: File) => profileService.uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast.success('Profile photo updated')
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export const useUpdateBio = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (bio: string) => profileService.updateBio(bio),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast.success('Bio updated')
    },
    onError: (e: Error) => toast.error(e.message),
  })
}
