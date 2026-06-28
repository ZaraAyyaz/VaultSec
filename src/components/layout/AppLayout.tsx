import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'
import { useStore } from '@/store/store'
import { cn } from '@/lib/utils'

export function AppLayout() {
  const { sidebarOpen } = useStore()
  const [mobileSidebar, setMobileSidebar] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMobileSidebar(false)
  }, [location])

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <div className={cn('hidden md:block', sidebarOpen ? 'w-60' : 'w-16')}>
        <Sidebar />
      </div>

      {mobileSidebar && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileSidebar(false)} />
          <div className="absolute left-0 top-0 h-full">
            <Sidebar />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col">
        <Navbar onMenuClick={() => setMobileSidebar(true)} />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
