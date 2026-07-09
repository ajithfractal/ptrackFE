import type { LucideIcon } from 'lucide-react'
import { Bell } from 'lucide-react'
import {
  NOTIFICATION_ENGINE_MENU_PERMISSIONS,
  NOTIFICATION_ENGINE_SUB_PERMISSIONS,
} from '@/lib/permissions'
import { userHasAnyPermission } from '@/lib/menuPermissions'

export interface SubMenuItemConfig {
  path: string
  label: string
  permissions: readonly string[]
}

export interface MenuItemConfig {
  label: string
  icon: LucideIcon
  path: string
  permissions: readonly string[]
  subItems?: readonly SubMenuItemConfig[]
}

export const notificationEngineSubItems: readonly SubMenuItemConfig[] = [
  {
    path: '/admin/notifications',
    label: 'Notifications',
    permissions: NOTIFICATION_ENGINE_SUB_PERMISSIONS.notifications,
  },
  {
    path: '/admin/notifications/templates',
    label: 'Templates',
    permissions: NOTIFICATION_ENGINE_SUB_PERMISSIONS.templates,
  },
  {
    path: '/admin/notifications/playground',
    label: 'Playground',
    permissions: NOTIFICATION_ENGINE_SUB_PERMISSIONS.playground,
  },
]

export const adminMenuItems: readonly MenuItemConfig[] = [
  {
    label: 'Notifications',
    icon: Bell,
    path: '/admin/notifications',
    permissions: NOTIFICATION_ENGINE_MENU_PERMISSIONS,
    subItems: notificationEngineSubItems,
  },
]

export function filterMenuItems(
  items: readonly MenuItemConfig[],
  userPermissions: string[] | undefined
): MenuItemConfig[] {
  return items.reduce<MenuItemConfig[]>((visible, item) => {
    if (!userHasAnyPermission(userPermissions, item.permissions)) {
      return visible
    }

    if (item.subItems) {
      const subItems = item.subItems.filter((sub) =>
        userHasAnyPermission(userPermissions, sub.permissions)
      )

      if (subItems.length === 0) {
        return visible
      }

      visible.push({ ...item, subItems })
      return visible
    }

    visible.push(item)
    return visible
  }, [])
}

export function isGroupExpanded(
  subItems: readonly SubMenuItemConfig[],
  pathname: string
): boolean {
  return subItems.some(
    (sub) => pathname === sub.path || pathname.startsWith(`${sub.path}/`)
  )
}

export function getActiveSubItemPath(
  subItems: readonly SubMenuItemConfig[],
  pathname: string
): string | null {
  const matches = subItems.filter(
    (sub) => pathname === sub.path || pathname.startsWith(`${sub.path}/`)
  )

  if (matches.length === 0) {
    return null
  }

  return matches.reduce((longest, sub) =>
    sub.path.length > longest.path.length ? sub : longest
  ).path
}
