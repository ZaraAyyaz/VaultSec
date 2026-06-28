import { useEffect, useState } from 'react'
import { ProfileSettings } from '@/components/settings/ProfileSettings'
import { ApiKeys } from '@/components/settings/ApiKeys'
import { NotificationsSettings } from '@/components/settings/NotificationsSettings'
import { TwoFactorAuth } from '@/components/settings/TwoFactorAuth'
import { useStore } from '@/store/store'
import { mockApiKeys } from '@/data/mockData'
import { Skeleton } from '@/components/ui/skeleton'
import { Settings as SettingsIcon } from 'lucide-react'

export default function Settings() {
  const { setApiKeys } = useStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setApiKeys(mockApiKeys)
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [setApiKeys])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <SettingsIcon className="h-6 w-6 text-slate-400" />
          <div>
            <Skeleton className="h-7 w-40 bg-slate-800" />
            <Skeleton className="mt-1 h-4 w-60 bg-slate-800" />
          </div>
        </div>
        <Skeleton className="h-[300px] w-full rounded-lg bg-slate-800" />
        <Skeleton className="h-[300px] w-full rounded-lg bg-slate-800" />
        <Skeleton className="h-[200px] w-full rounded-lg bg-slate-800" />
        <Skeleton className="h-[200px] w-full rounded-lg bg-slate-800" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <SettingsIcon className="h-6 w-6 text-slate-400" />
        <div>
          <h1 className="text-xl font-bold text-white">Settings</h1>
          <p className="text-sm text-slate-500">Manage your account and configuration</p>
        </div>
      </div>

      <ProfileSettings />
      <ApiKeys />
      <NotificationsSettings />
      <TwoFactorAuth />
    </div>
  )
}
