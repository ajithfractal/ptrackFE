import { create } from 'zustand'
import { authStorage } from '../lib/authStorage'
import type { LoginResponse } from '../types'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  setAuth: (tokens: LoginResponse) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: authStorage.getAccessToken(),
  refreshToken: authStorage.getRefreshToken(),
  isAuthenticated: authStorage.isAuthenticated(),
  setAuth: (tokens) => {
    authStorage.setTokens(tokens.accessToken, tokens.refreshToken)
    set({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      isAuthenticated: true,
    })
  },
  clearAuth: () => {
    authStorage.clearTokens()
    set({ accessToken: null, refreshToken: null, isAuthenticated: false })
  },
}))
