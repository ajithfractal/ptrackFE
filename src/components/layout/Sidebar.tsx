import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Building2,
  ChevronDown,
  CircleDot,
  FolderKanban,
  Kanban,
  LayoutDashboard,
  ListOrdered,
  PanelLeft,
  Settings,
  Target,
  Users,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { PERMISSIONS } from '@/lib/permissions'
import { useAuth } from '@/hooks/useAuth'
import { SidebarNavLink } from './SidebarNavLink'
import logo from '@/assets/FractalHive_Logo.svg'

const projectNavItems = [
  { to: '/projects/overview', label: 'Overview', icon: LayoutDashboard, exact: true },
  { to: '/projects/backlog', label: 'Backlog', icon: ListOrdered, exact: true },
  { to: '/projects/sprint', label: 'Sprint', icon: Target, exact: true },
  { to: '/projects/board', label: 'Board', icon: Kanban, exact: true },
  { to: '/projects/issues', label: 'Issues', icon: CircleDot, exact: true },
  { to: '/projects/members', label: 'Members', icon: Users, exact: true },
  { to: '/projects/settings', label: 'Settings', icon: Settings, exact: true },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation()
  const { hasPermission } = useAuth()
  const canReadUsers = hasPermission(PERMISSIONS.USERS_READ)
  const isOnProjects = location.pathname.startsWith('/projects')
  const [projectsOpen, setProjectsOpen] = useState(isOnProjects)

  useEffect(() => {
    if (isOnProjects) {
      setProjectsOpen(true)
    }
  }, [isOnProjects])

  const showProjectItems = !collapsed && projectsOpen

  return (
    <aside
      className={cn(
        'flex h-full flex-shrink-0 flex-col overflow-hidden bg-navbar transition-all duration-200',
        collapsed ? 'w-14' : 'w-56'
      )}
    >
      <div
        className={cn(
          'flex h-14 w-full flex-shrink-0 items-center overflow-hidden',
          collapsed ? 'justify-center px-1' : 'justify-between gap-2 px-3'
        )}
      >
        {collapsed ? (
          <div
            className="group relative flex h-8 w-8 flex-shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg"
            onClick={onToggle}
            aria-label="Expand sidebar"
          >
            <img
              src={logo}
              alt="Logo"
              className="h-10 w-10 object-contain transition-opacity duration-150 group-hover:opacity-0"
            />
            <PanelLeft className="absolute h-5 w-5 rotate-180 text-foreground/60 opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
          </div>
        ) : (
          <>
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg">
                <img src={logo} alt="Logo" className="h-8 w-8 object-contain" />
              </div>
              <span className="truncate text-sm font-semibold text-navbar-foreground">
                P-Track
              </span>
            </div>
            <button
              type="button"
              onClick={onToggle}
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-foreground/60 transition-colors hover:bg-navbar-border hover:text-foreground"
              aria-label="Collapse sidebar"
            >
              <PanelLeft className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      <nav
        className={cn(
          'flex w-full flex-col flex-1 overflow-y-auto overflow-x-hidden py-2',
          collapsed ? 'items-center gap-0.5 px-1' : 'gap-0.5 px-2'
        )}
      >
        <SidebarNavLink
          to="/workspaces"
          label="Workspaces"
          icon={Building2}
          collapsed={collapsed}
        />

        {canReadUsers && (
          <SidebarNavLink
            to="/users"
            label="Users"
            icon={Users}
            collapsed={collapsed}
          />
        )}

        <div className={cn(collapsed ? 'flex flex-col items-center gap-0.5' : 'flex flex-col gap-0.5')}>
          {!collapsed ? (
            <button
              type="button"
              onClick={() => setProjectsOpen((open) => !open)}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isOnProjects
                  ? 'text-foreground'
                  : 'text-foreground/70 hover:bg-navbar-border hover:text-foreground'
              )}
            >
              <FolderKanban className="h-5 w-5 flex-shrink-0" />
              <span className="flex-1 text-left">Projects</span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 flex-shrink-0 text-foreground/50 transition-transform',
                  projectsOpen && 'rotate-180'
                )}
              />
            </button>
          ) : (
            <SidebarNavLink
              to="/projects/overview"
              label="Projects"
              icon={FolderKanban}
              collapsed={collapsed}
              exact={false}
            />
          )}

          {showProjectItems && (
            <div className={cn('flex flex-col gap-0.5', collapsed && 'items-center')}>
              {projectNavItems.map((item) => (
                <SidebarNavLink key={item.to} {...item} collapsed={collapsed} nested={!collapsed} />
              ))}
            </div>
          )}
        </div>
      </nav>
    </aside>
  )
}
