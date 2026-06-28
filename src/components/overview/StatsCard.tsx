import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  trend?: { value: string; positive: boolean }
  loading?: boolean
  className?: string
}

export function StatsCard({ title, value, subtitle, icon, trend, loading, className }: StatsCardProps) {
  if (loading) {
    return (
      <Card className={cn('border-slate-800 bg-slate-900', className)}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 bg-slate-800" />
              <Skeleton className="h-8 w-16 bg-slate-800" />
              <Skeleton className="h-3 w-20 bg-slate-800" />
            </div>
            <Skeleton className="h-10 w-10 rounded-lg bg-slate-800" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('border-slate-800 bg-slate-900 transition-colors hover:border-slate-700', className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{title}</p>
            <p className="mt-1 text-2xl font-bold text-white">{value}</p>
            {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
            {trend && (
              <p className={cn('mt-1 text-xs font-medium', trend.positive ? 'text-green-400' : 'text-red-400')}>
                {trend.value}
              </p>
            )}
          </div>
          <div className="rounded-lg bg-red-600/10 p-2.5 text-red-500">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}
