import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { authService } from '../services/authService'
import { useAuthStore } from '../stores/authStore'
import type { LoginRequest } from '../types'

type LoginVariables = LoginRequest & { redirectTo?: string }

export const useLogin = () => {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  return useMutation({
    mutationFn: ({ email, password }: LoginVariables) =>
      authService.login({ email, password }),
    onSuccess: (data, variables) => {
      setAuth(data)
      toast.success('Logged in successfully')
      navigate(variables.redirectTo ?? '/workspaces', { replace: true })
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export const useLogout = () => {
  const navigate = useNavigate()
  const clearAuth = useAuthStore((s) => s.clearAuth)

  return () => {
    clearAuth()
    navigate('/login', { replace: true })
  }
}
