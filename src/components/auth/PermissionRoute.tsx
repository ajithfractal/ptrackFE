import { Loader2 } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import UnauthorizedPage from '@/pages/UnauthorizedPage'

type PermissionRouteProps = {
  permission: string
}

export default function PermissionRoute({ permission }: PermissionRouteProps) {
  const { hasPermission, initializing } = useAuth()

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

  if (!hasPermission(permission)) {
    return <UnauthorizedPage />
  }

  return <Outlet />
}
