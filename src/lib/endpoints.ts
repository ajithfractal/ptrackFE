export const endpoints = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    me: '/api/auth/me',
    changePassword: '/api/auth/password/change',
  },
  workspaces: {
    list: '/api/workspaces',
    create: '/api/workspaces',
    invite: (workspaceId: string) => `/api/workspaces/${workspaceId}/invitations`,
  },
  invitations: {
    preview: (token: string) => `/api/invitations/${token}`,
    accept: (token: string) => `/api/invitations/${token}/accept`,
  },
  profile: {
    get: '/api/profile',
    avatar: '/api/profile/avatar',
    bio: '/api/profile/bio',
  },
  users: {
    list: '/api/users',
    sync: '/api/users/sync',
  },
} as const
