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

export type WorkspaceRole = 'OWNER' | 'ADMIN' | 'MEMBER'

export interface CreateWorkspaceRequest {
  name: string
  slug: string
}

export interface InviteMemberRequest {
  email: string
  role: WorkspaceRole
  /** ISO-8601 datetime, e.g. 2026-06-22T23:59:59.000Z. Omit to default to 7 days on the server. */
  expiresAt?: string
}

export interface WorkspaceInvitation {
  id: string
  workspaceId: string
  email: string
  role: WorkspaceRole
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED'
  expiresAt: string
}

export interface InvitationPreview {
  workspaceName: string
  inviteeEmail: string
  role: WorkspaceRole
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED'
  expiresAt: string
  expired: boolean
}

export interface InvitationAcceptResult {
  workspaceId: string
  workspaceName: string
  role: WorkspaceRole
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
