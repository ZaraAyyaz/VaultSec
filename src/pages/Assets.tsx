import { useEffect, useState } from 'react'
import { AssetsTable } from '@/components/assets/AssetsTable'
import { useStore } from '@/store/store'
import { mockAssets } from '@/data/mockData'
import { Skeleton } from '@/components/ui/skeleton'
import { Server } from 'lucide-react'

export default function Assets() {
  const { setAssets } = useStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAssets(mockAssets)
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [setAssets])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Server className="h-6 w-6 text-blue-500" />
        <div>
          <h1 className="text-xl font-bold text-white">Assets Inventory</h1>
          <p className="text-sm text-slate-500">Monitored assets and risk assessment</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="flex gap-3">
            <Skeleton className="h-9 flex-1 bg-slate-800" />
            <Skeleton className="h-9 w-[130px] bg-slate-800" />
            <Skeleton className="h-9 w-[130px] bg-slate-800" />
          </div>
          <Skeleton className="h-[400px] w-full rounded-lg bg-slate-800" />
        </div>
      ) : (
        <AssetsTable />
      )}
    </div>
  )
}
