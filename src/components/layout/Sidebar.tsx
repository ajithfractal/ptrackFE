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
import { cn } from '@/lib/utils'
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
        'flex flex-col flex-1 overflow-y-auto py-2',
        collapsed ? 'items-center gap-0.5 px-0' : 'px-2 gap-0.5'
      )}>
        <SidebarNavLink
          to="/workspaces"
          label="Workspaces"
          icon={Building2}
          collapsed={collapsed}
        />

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
