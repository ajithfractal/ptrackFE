import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { buildNotificationEngineUrl } from '@/lib/notificationEngine'

export default function NotificationEnginePage() {
  const location = useLocation()

  const iframeSrc = useMemo(
    () => buildNotificationEngineUrl(location.pathname),
    [location.pathname]
  )

  return (
    <div className="-m-6 flex h-[calc(100vh-3.5rem)] min-h-0 flex-col">
      <iframe
        title="Notifications"
        src={iframeSrc}
        className="h-full w-full flex-1 border-0"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </div>
  )
}
