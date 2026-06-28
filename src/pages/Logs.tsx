import { useEffect, useState } from 'react'
import { AuditLogsTable } from '@/components/logs/AuditLogsTable'
import { useStore } from '@/store/store'
import { mockAuditLogs } from '@/data/mockData'
import { Skeleton } from '@/components/ui/skeleton'
import { FileText } from 'lucide-react'

export default function Logs() {
  const { setAuditLogs } = useStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAuditLogs(mockAuditLogs)
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [setAuditLogs])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="h-6 w-6 text-amber-500" />
        <div>
          <h1 className="text-xl font-bold text-white">Audit Logs</h1>
          <p className="text-sm text-slate-500">Chronological record of system events</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="flex gap-3">
            <Skeleton className="h-9 flex-1 bg-slate-800" />
            <Skeleton className="h-9 w-40 bg-slate-800" />
            <Skeleton className="h-9 w-40 bg-slate-800" />
            <Skeleton className="h-9 w-[120px] bg-slate-800" />
          </div>
          <Skeleton className="h-[400px] w-full rounded-lg bg-slate-800" />
        </div>
      ) : (
        <AuditLogsTable />
      )}
    </div>
  )
}
