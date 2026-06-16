import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

type AuthBootstrapProps = {
  children: React.ReactNode
}

export function AuthBootstrap({ children }: AuthBootstrapProps) {
  const initializing = useAuthStore((s) => s.initializing)
  const initialize = useAuthStore((s) => s.initialize)

  useEffect(() => {
    void initialize()
  }, [initialize])

  if (initializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Checking your session…
        </div>
      </div>
    )
  }

  return children
}
