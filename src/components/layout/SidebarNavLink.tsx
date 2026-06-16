import { NavLink, useLocation } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip'

interface SidebarNavLinkProps {
  to: string
  label: string
  icon: LucideIcon
  collapsed?: boolean
  exact?: boolean
  nested?: boolean
}

export function SidebarNavLink({
  to,
  label,
  icon: Icon,
  collapsed = false,
  exact = false,
  nested = false,
}: SidebarNavLinkProps) {
  const location = useLocation()
  const isActive = exact
    ? location.pathname === to
    : location.pathname === to || location.pathname.startsWith(`${to}/`)

  const linkEl = (
    <NavLink
      to={to}
      className={cn(
        'flex items-center gap-3 rounded-lg transition-colors font-medium',
        nested ? 'text-xs' : 'text-sm',
        collapsed
          ? 'h-10 w-10 justify-center'
          : nested
            ? 'py-1.5 pl-9 pr-3 w-full'
            : 'px-3 py-2 w-full',
        isActive
          ? 'bg-background text-foreground font-semibold shadow-sm'
          : 'text-foreground/70 hover:bg-navbar-border hover:text-foreground'
      )}
    >
      <Icon className={cn('flex-shrink-0', nested ? 'h-4 w-4' : 'h-5 w-5')} />
      {!collapsed && <span>{label}</span>}
    </NavLink>
  )

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{linkEl}</TooltipTrigger>
        <TooltipContent side="right" className="text-xs">{label}</TooltipContent>
      </Tooltip>
    )
  }

  return linkEl
}
