import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

const COLLAPSED_KEY = 'project_tracker_sidebar_collapsed'

export default function Layout() {
  const [collapsed, setCollapsed] = useState<boolean>(
    () => localStorage.getItem(COLLAPSED_KEY) === 'true'
  )

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev
      localStorage.setItem(COLLAPSED_KEY, String(next))
      return next
    })
  }

  return (
    <div className="flex h-screen overflow-hidden bg-navbar">
      <Sidebar collapsed={collapsed} onToggle={toggleCollapsed} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto bg-background rounded-tl-3xl">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
