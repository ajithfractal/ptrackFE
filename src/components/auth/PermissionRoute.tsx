import { Loader2 } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import UnauthorizedPage from '@/pages/UnauthorizedPage'

type PermissionRouteProps = {
  permission?: string
  permissions?: readonly string[]
}

export default function PermissionRoute({ permission, permissions }: PermissionRouteProps) {
  const { hasPermission, hasAnyPermission, initializing } = useAuth()

  if (initializing) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Checking your session…
        </div>
      </div>
    )
  }

  const allowed = permissions
    ? hasAnyPermission([...permissions])
    : permission
      ? hasPermission(permission)
      : false

  if (!allowed) {
    return <UnauthorizedPage />
  }

  return <Outlet />
}
