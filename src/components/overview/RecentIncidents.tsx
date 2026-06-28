import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Clock } from 'lucide-react'
import type { Incident } from '@/types'

interface RecentIncidentsProps {
  incidents: Incident[]
  loading?: boolean
}

export function RecentIncidents({ incidents, loading }: RecentIncidentsProps) {
  if (loading) {
    return (
      <Card className="border-slate-800 bg-slate-900">
        <CardHeader><Skeleton className="h-5 w-36 bg-slate-800" /></CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full bg-slate-800" />
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-slate-800 bg-slate-900">
      <CardHeader>
        <CardTitle className="text-base text-white">Recent Incidents</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[320px]">
          <div className="space-y-1 px-4 pb-4">
            {incidents.map((inc) => (
              <div
                key={inc.id}
                className="flex items-start gap-3 rounded-md border border-slate-800/50 p-3 transition-colors hover:bg-slate-800/30"
              >
                <Badge
                  variant={inc.severity as 'Critical' | 'High' | 'Medium' | 'Low'}
                  className="mt-0.5 shrink-0 px-1.5 py-0 text-[10px]"
                >
                  {inc.severity}
                </Badge>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-200">{inc.title}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 text-xs">{inc.type}</span>
                    <span>{inc.status}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0 text-xs text-slate-600">
                  <Clock className="h-3 w-3" />
                  {formatTimeAgo(inc.timestamp)}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

function formatTimeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return `${Math.floor(diff / 60000)}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}
