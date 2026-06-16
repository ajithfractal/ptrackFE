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
