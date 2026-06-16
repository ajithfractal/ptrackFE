import { ShieldX } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
        <ShieldX className="h-7 w-7 text-destructive" />
      </div>
      <h1 className="text-2xl font-semibold text-foreground">Unauthorized</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        You don&apos;t have permission to access this page. Contact your administrator if you
        believe this is a mistake.
      </p>
      <Link
        to="/workspaces"
        className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        Back to workspaces
      </Link>
    </div>
  )
}
