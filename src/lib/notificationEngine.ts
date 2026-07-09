import { authStorage } from './authStorage'

const NOTIFICATION_ENGINE_BASE_URL =
  import.meta.env.VITE_NOTIFICATION_ENGINE_APP_URL ?? 'http://localhost:5173'

const ROUTE_PREFIX = '/admin/notifications'

export function getNotificationEngineSubPath(pathname: string): string {
  if (!pathname.startsWith(ROUTE_PREFIX)) {
    return '/'
  }

  const subPath = pathname.slice(ROUTE_PREFIX.length)
  return subPath || '/'
}

export function buildNotificationEngineUrl(pathname: string): string {
  const subPath = getNotificationEngineSubPath(pathname)
  const base = NOTIFICATION_ENGINE_BASE_URL.replace(/\/$/, '')
  const url = new URL(subPath, `${base}/`)

  const token = authStorage.getAccessToken()
  if (token) {
    url.searchParams.set('token', token)
  }

  return url.toString()
}
