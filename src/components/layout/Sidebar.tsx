import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, PanelLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import logo from '@/assets/FractalHive_Logo.svg'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation()

  return (
    <aside
      className={cn(
        'flex h-full flex-shrink-0 flex-col bg-navbar transition-all duration-200',
        collapsed ? 'w-14 items-center' : 'w-56'
      )}
    >
      <div className={cn(
        'flex h-14 flex-shrink-0 items-center',
        collapsed ? 'justify-center' : 'px-4 gap-2.5'
      )}>
        {collapsed ? (
          <div
            className="group relative flex h-8 w-8 flex-shrink-0 cursor-pointer items-center justify-center rounded-lg"
            onClick={onToggle}
          >
            <img src={logo} alt="Logo" className="h-10 w-10 transition-opacity duration-150 group-hover:opacity-0" />
            <PanelLeft className="absolute h-4 w-4 rotate-180 text-foreground/60 opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
          </div>
        ) : (
          <>
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg">
              <img src={logo} alt="Logo" className="h-10 w-10" />
            </div>
            <span className="font-semibold text-sm truncate text-navbar-foreground">Project Tracker</span>
          </>
        )}
      </div>

      <nav className={cn(
        'flex flex-col flex-1 py-2',
        collapsed ? 'items-center gap-0.5 px-0' : 'px-2 gap-0.5'
      )}>
        {navItems.map(({ to, label, icon: Icon, exact }) => {
          const isActive = exact
            ? location.pathname === to
            : location.pathname.startsWith(to)

          const linkEl = (
            <NavLink
              to={to}
              className={cn(
                'flex items-center gap-3 rounded-lg transition-colors text-sm font-medium',
                collapsed ? 'h-10 w-10 justify-center' : 'px-3 py-2 w-full',
                isActive
                  ? 'bg-background text-foreground font-semibold shadow-sm'
                  : 'text-foreground/70 hover:bg-navbar-border hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          )

          if (collapsed) {
            return (
              <Tooltip key={to} delayDuration={0}>
                <TooltipTrigger asChild>{linkEl}</TooltipTrigger>
                <TooltipContent side="right" className="text-xs">{label}</TooltipContent>
              </Tooltip>
            )
          }
          return <div key={to}>{linkEl}</div>
        })}
      </nav>
    </aside>
  )
}
