export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface Workspace {
  id: string
  name: string
  slug: string
}

export interface CreateWorkspaceRequest {
  name: string
  slug: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  accessTokenExpiresIn: number
  refreshTokenExpiresIn: number
}

export interface AuthUser {
  userId: string
  applicationId: string
  orgUnitId: string
  email: string
  name: string
  roles: string[]
  permissions: string[]
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  orgUnitId: string
  applicationCode: string
}

export interface User {
  id: string
  externalAuthId: string
  email: string
  displayName: string
}

export interface UserSyncResult {
  created: number
  updated: number
  total: number
}

export interface UserProfile {
  name: string
  email: string
  roles: string[]
  permissions: string[]
  avatarUrl: string | null
  bio: string | null
}
