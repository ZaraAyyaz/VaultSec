import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useStore } from '@/store/store'
import {
  Shield,
  Activity,
  AlertTriangle,
  Server,
  FileText,
  Bell,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'

const navItems = [
  { to: '/', label: 'Overview', icon: Activity },
  { to: '/threats', label: 'Threats', icon: AlertTriangle },
  { to: '/assets', label: 'Assets', icon: Server },
  { to: '/logs', label: 'Audit Logs', icon: FileText },
  { to: '/alerts', label: 'Alerts & Rules', icon: Bell },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useStore()

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-slate-800 bg-slate-950 transition-all duration-300',
        sidebarOpen ? 'w-60' : 'w-16',
      )}
    >
      <div className="flex h-14 items-center border-b border-slate-800 px-4">
        <div className="flex items-center gap-2 overflow-hidden">
          <Shield className="h-6 w-6 shrink-0 text-red-500" />
          <span
            className={cn(
              'whitespace-nowrap text-lg font-bold tracking-wide transition-opacity duration-300',
              sidebarOpen ? 'opacity-100' : 'opacity-0 w-0',
            )}
          >
            Vault<span className="text-red-500">Sec</span>
          </span>
        </div>
        <button
          onClick={toggleSidebar}
          className="ml-auto shrink-0 rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-red-600/10 text-red-400'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white',
              )
            }
          >
            <item.icon className="h-5 w-5 shrink-0" />
            <span
              className={cn(
                'whitespace-nowrap transition-opacity duration-300',
                sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden',
              )}
            >
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-800 p-4">
        <div className={cn('flex items-center gap-3', !sidebarOpen && 'justify-center')}>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
            VS
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="text-xs font-medium text-white">VaultSec Ops</p>
              <p className="text-xs text-slate-500">v2.4.1</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
