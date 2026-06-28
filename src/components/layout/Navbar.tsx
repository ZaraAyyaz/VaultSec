import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Search,
  Bell,
  ChevronDown,
  Menu,
  User,
  LogOut,
  Settings,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'

const mockNotifications = [
  { id: '1', title: 'Critical Threat Detected', message: 'Ransomware on prod-web-01', time: '2m ago', read: false },
  { id: '2', title: 'Asset Scan Complete', message: '12 assets scanned, 3 vulnerabilities', time: '15m ago', read: false },
  { id: '3', title: 'Alert Rule Triggered', message: 'Brute Force Detection fired 3x', time: '1h ago', read: false },
  { id: '4', title: 'API Key Expiring', message: 'Production Monitor key expires in 7d', time: '1d ago', read: true },
  { id: '5', title: 'Bulk Action Complete', message: '5 threats resolved', time: '2d ago', read: true },
]

type NavbarProps = {
  onMenuClick: () => void
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const [notifOpen, setNotifOpen] = useState(false)
  const unreadCount = mockNotifications.filter((n) => !n.read).length

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-slate-800 bg-slate-950/95 px-4 backdrop-blur">
      <button
        onClick={onMenuClick}
        className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <Input
          placeholder="Search threats, assets, logs..."
          className="border-slate-800 bg-slate-900 pl-9 text-sm text-slate-300 placeholder:text-slate-600 focus-visible:ring-red-500/30"
        />
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-white">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 border-slate-800 bg-slate-950">
              <DropdownMenuLabel className="text-white">Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-800" />
              <ScrollArea className="h-[300px]">
                {mockNotifications.map((n) => (
                  <div
                    key={n.id}
                    className={cn(
                      'flex items-start gap-3 px-4 py-3 text-sm transition-colors hover:bg-slate-800/50',
                      !n.read && 'border-l-2 border-red-500 bg-red-500/5',
                    )}
                  >
                    <div
                      className={cn(
                        'mt-1 h-2 w-2 shrink-0 rounded-full',
                        n.read ? 'bg-slate-600' : 'bg-red-500',
                      )}
                    />
                    <div className="flex-1">
                      <p className={cn('text-sm', n.read ? 'text-slate-400' : 'text-white')}>{n.title}</p>
                      <p className="text-xs text-slate-500">{n.message}</p>
                      <p className="mt-0.5 text-xs text-slate-600">{n.time}</p>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 text-slate-400 hover:text-white">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-red-600 text-[10px] text-white">AD</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm sm:inline">Admin</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 border-slate-800 bg-slate-950">
            <DropdownMenuLabel className="text-white">Admin User</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-800" />
            <DropdownMenuItem className="text-slate-400 focus:text-white focus:bg-slate-800">
              <User className="mr-2 h-4 w-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="text-slate-400 focus:text-white focus:bg-slate-800">
              <Settings className="mr-2 h-4 w-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-800" />
            <DropdownMenuItem className="text-slate-400 focus:text-white focus:bg-slate-800">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
