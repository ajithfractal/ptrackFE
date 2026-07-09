import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import {
  adminMenuItems,
  filterMenuItems,
  getActiveSubItemPath,
  isGroupExpanded,
  type MenuItemConfig,
  type SubMenuItemConfig,
} from './sideNavConfig'
import { SidebarNavLink } from './SidebarNavLink'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip'

interface SideNavProps {
  collapsed: boolean
}

function SidebarSubNavLink({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center rounded-lg py-1.5 pl-9 pr-3 text-left text-xs font-medium transition-colors',
        active
          ? 'bg-background text-foreground font-semibold shadow-sm'
          : 'text-foreground/70 hover:bg-navbar-border hover:text-foreground'
      )}
    >
      {label}
    </button>
  )
}

function ExpandableMenuGroup({
  item,
  collapsed,
}: {
  item: MenuItemConfig
  collapsed: boolean
}) {
  const location = useLocation()
  const navigate = useNavigate()
  const subItems = item.subItems ?? []
  const groupActive = isGroupExpanded(subItems, location.pathname)
  const activeSubPath = getActiveSubItemPath(subItems, location.pathname)
  const [open, setOpen] = useState(groupActive)

  useEffect(() => {
    if (groupActive) {
      setOpen(true)
    }
  }, [groupActive])

  const Icon = item.icon
  const showSubItems = !collapsed && open

  const parentButton = (
    <button
      type="button"
      onClick={() => {
        if (collapsed) {
          navigate(item.path)
          return
        }
        setOpen((value) => !value)
      }}
      className={cn(
        'flex items-center gap-3 rounded-lg transition-colors font-medium',
        collapsed ? 'h-10 w-10 justify-center text-sm' : 'w-full px-3 py-2 text-sm',
        groupActive
          ? 'bg-background text-foreground font-semibold shadow-sm'
          : 'text-foreground/70 hover:bg-navbar-border hover:text-foreground'
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      {!collapsed && (
        <>
          <span className="flex-1 text-left">{item.label}</span>
          <ChevronDown
            className={cn(
              'h-4 w-4 flex-shrink-0 text-foreground/50 transition-transform',
              open && 'rotate-180'
            )}
          />
        </>
      )}
    </button>
  )

  return (
    <div className={cn(collapsed ? 'flex flex-col items-center gap-0.5' : 'flex flex-col gap-0.5')}>
      {collapsed ? (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{parentButton}</TooltipTrigger>
          <TooltipContent side="right" className="text-xs">
            {item.label}
          </TooltipContent>
        </Tooltip>
      ) : (
        parentButton
      )}

      {showSubItems && (
        <div className="flex flex-col gap-0.5">
          {subItems.map((sub: SubMenuItemConfig) => (
            <SidebarSubNavLink
              key={sub.path}
              label={sub.label}
              active={activeSubPath === sub.path}
              onClick={() => navigate(sub.path)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function SideNav({ collapsed }: SideNavProps) {
  const { user } = useAuth()
  const visibleItems = filterMenuItems(adminMenuItems, user?.permissions)

  return (
    <>
      {visibleItems.map((item) =>
        item.subItems ? (
          <ExpandableMenuGroup key={item.label} item={item} collapsed={collapsed} />
        ) : (
          <SidebarNavLink
            key={item.path}
            to={item.path}
            label={item.label}
            icon={item.icon}
            collapsed={collapsed}
          />
        )
      )}
    </>
  )
}
