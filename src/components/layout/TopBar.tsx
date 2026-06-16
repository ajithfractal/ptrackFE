import { Link } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useLogout } from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'
import { getInitials, resolveAvatarUrl } from '@/lib/avatar'

export default function TopBar() {
  const logout = useLogout()
  const { data: profile } = useProfile()

  const name = profile?.name ?? 'Account'
  const email = profile?.email ?? ''
  const avatarSrc = resolveAvatarUrl(profile?.avatarUrl ?? null)
  const initials = getInitials(name, email)

  return (
    <header className="flex h-14 flex-shrink-0 items-center justify-end gap-3 bg-navbar px-4">
      <Link
        to="/profile"
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-navbar-border"
      >
        {avatarSrc ? (
          <img src={avatarSrc} alt={name} className="h-8 w-8 rounded-full object-cover" />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            {initials}
          </div>
        )}
        <span className="hidden text-sm font-medium text-foreground sm:inline">{name}</span>
      </Link>

      <button
        onClick={logout}
        className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-foreground/60 transition-colors hover:bg-navbar-border hover:text-foreground"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">Sign out</span>
      </button>
    </header>
  )
}
