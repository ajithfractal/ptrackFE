import { create } from 'zustand'
import { authStorage } from '../lib/authStorage'
import { authService } from '../services/authService'
import type { AuthUser, LoginResponse } from '../types'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  initializing: boolean
  setSession: (tokens: LoginResponse, user: AuthUser) => void
  setUser: (user: AuthUser) => void
  clearAuth: () => void
  setInitializing: (initializing: boolean) => void
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: authStorage.getAccessToken(),
  refreshToken: authStorage.getRefreshToken(),
  user: null,
  isAuthenticated: authStorage.isAuthenticated(),
  initializing: authStorage.isAuthenticated(),

  setSession: (tokens, user) => {
    authStorage.setTokens(tokens.accessToken, tokens.refreshToken)
    set({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user,
      isAuthenticated: true,
      initializing: false,
    })
  },

  setUser: (user) => set({ user }),

  clearAuth: () => {
    authStorage.clearTokens()
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      initializing: false,
    })
  },

  setInitializing: (initializing) => set({ initializing }),

  initialize: async () => {
    if (!authStorage.isAuthenticated()) {
      set({ initializing: false, isAuthenticated: false })
      return
    }

    set({ initializing: true, isAuthenticated: true })

    try {
      const user = await authService.getMe()
      set({
        accessToken: authStorage.getAccessToken(),
        refreshToken: authStorage.getRefreshToken(),
        user,
        isAuthenticated: true,
        initializing: false,
      })
    } catch {
      get().clearAuth()
    }
  },
}))
