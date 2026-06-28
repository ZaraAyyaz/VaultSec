import { useEffect, useState } from 'react'
import { ThreatsTable } from '@/components/threats/ThreatsTable'
import { useStore } from '@/store/store'
import { mockThreats } from '@/data/mockData'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertTriangle } from 'lucide-react'

export default function Threats() {
  const { setThreats } = useStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setThreats(mockThreats)
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [setThreats])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-6 w-6 text-red-500" />
        <div>
          <h1 className="text-xl font-bold text-white">Threats</h1>
          <p className="text-sm text-slate-500">Monitor and manage security threats</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="flex gap-3">
            <Skeleton className="h-9 flex-1 bg-slate-800" />
            <Skeleton className="h-9 w-[130px] bg-slate-800" />
            <Skeleton className="h-9 w-[130px] bg-slate-800" />
            <Skeleton className="h-9 w-[130px] bg-slate-800" />
          </div>
          <Skeleton className="h-[400px] w-full rounded-lg bg-slate-800" />
        </div>
      ) : (
        <ThreatsTable />
      )}
    </div>
  )
}
