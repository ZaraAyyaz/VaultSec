import { useEffect, useState } from 'react'
import { AlertsTable } from '@/components/alerts/AlertsTable'
import { useStore } from '@/store/store'
import { mockAlertRules } from '@/data/mockData'
import { Skeleton } from '@/components/ui/skeleton'
import { Bell } from 'lucide-react'

export default function Alerts() {
  const { setAlertRules } = useStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAlertRules(mockAlertRules)
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [setAlertRules])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Bell className="h-6 w-6 text-purple-500" />
        <div>
          <h1 className="text-xl font-bold text-white">Alerts & Rules</h1>
          <p className="text-sm text-slate-500">Manage alert rules and notification channels</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Skeleton className="h-9 w-[100px] bg-slate-800" />
          </div>
          <Skeleton className="h-[400px] w-full rounded-lg bg-slate-800" />
        </div>
      ) : (
        <AlertsTable />
      )}
    </div>
  )
}
