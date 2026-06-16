import { RefreshCw } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import { useSyncUsers, useUsers } from '@/hooks/useUsers'

export default function UsersPage() {
  const { data: users, isLoading, error } = useUsers()
  const syncMutation = useSyncUsers()

  return (
    <div>
      <PageHeader
        title="Users"
        description="Users synced from the auth service for this application."
        action={
          <button
            type="button"
            onClick={() => syncMutation.mutate()}
            disabled={syncMutation.isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
            {syncMutation.isPending ? 'Syncing…' : 'Sync users'}
          </button>
        }
      />

      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}

      {error && (
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : 'Failed to load users'}
        </p>
      )}

      {!isLoading && !error && users?.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No users synced yet. Click &quot;Sync users&quot; to pull users from the auth service.
        </p>
      )}

      {users && users.length > 0 && (
        <ul className="divide-y divide-border rounded-xl border border-border bg-card">
          {users.map((user) => (
            <li key={user.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <div>
                <p className="font-medium text-foreground">{user.displayName || user.email}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <p className="font-mono text-xs text-muted-foreground">{user.externalAuthId}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
