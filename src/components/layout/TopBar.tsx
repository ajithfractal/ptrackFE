import { PanelLeft } from 'lucide-react'

interface TopBarProps {
  collapsed: boolean
  onToggle: () => void
}

export default function TopBar({ collapsed, onToggle }: TopBarProps) {
  return (
    <header className="flex h-14 flex-shrink-0 items-center justify-between bg-navbar px-4">
      {!collapsed && (
        <button
          onClick={onToggle}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground/60 hover:bg-navbar-border hover:text-foreground transition-colors"
          aria-label="Toggle sidebar"
        >
          <PanelLeft className="h-4 w-4" />
        </button>
      )}
    </header>
  )
}
