import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { authStorage } from '@/lib/authStorage'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/stores/authStore'
import type { LoginRequest } from '@/types'

type LoginVariables = LoginRequest & { redirectTo?: string }

export const useLogin = () => {
  const navigate = useNavigate()
  const setSession = useAuthStore((s) => s.setSession)

  return useMutation({
    mutationFn: async ({ email, password }: LoginVariables) => {
      const tokens = await authService.login({ email, password })
      authStorage.setTokens(tokens.accessToken, tokens.refreshToken)
      const user = await authService.getMe()
      return { tokens, user }
    },
    onSuccess: ({ tokens, user }, variables) => {
      setSession(tokens, user)
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

type RegisterVariables = {
  email: string
  password: string
  firstName: string
  lastName: string
}

export const useRegister = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: RegisterVariables) => authService.register(data),
    onSuccess: () => {
      toast.success('Account created. Please sign in.')
      navigate('/login', { replace: true })
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (newPassword: string) => authService.changePassword(newPassword),
    onSuccess: () => toast.success('Password changed successfully'),
    onError: (e: Error) => toast.error(e.message),
  })
}

export const useAuth = () => {
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const initializing = useAuthStore((s) => s.initializing)

  const hasRole = (role: string) => user?.roles.includes(role) ?? false
  const hasPermission = (permission: string) =>
    user?.permissions.includes(permission) ?? false
  const hasAnyRole = (roles: string[]) => roles.some(hasRole)
  const hasAnyPermission = (permissions: string[]) =>
    permissions.some(hasPermission)

  return {
    user,
    isAuthenticated,
    initializing,
    hasRole,
    hasPermission,
    hasAnyRole,
    hasAnyPermission,
  }
}
