import { useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { generateLiveThreat } from '@/data/mockData'
import { useStore } from '@/store/store'
import { cn } from '@/lib/utils'
import type { LiveThreat } from '@/types'

export function LiveThreatFeed() {
  const { liveThreats, addLiveThreat } = useStore()

  useEffect(() => {
    const interval = setInterval(() => {
      const threat = generateLiveThreat()
      addLiveThreat(threat)
    }, 3000)
    return () => clearInterval(interval)
  }, [addLiveThreat])

  const displayed = liveThreats.slice(0, 20)

  return (
    <Card className="border-slate-800 bg-slate-900">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base text-white">Live Threat Feed</CardTitle>
        <span className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
            <span className="inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
          LIVE
        </span>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[320px]">
          <div className="space-y-0.5 px-4 pb-4">
            {displayed.length === 0 && (
              <p className="py-8 text-center text-sm text-slate-600">Awaiting threat data...</p>
            )}
            {displayed.map((threat, i) => (
              <ThreatRow key={`${threat.id}-${i}`} threat={threat} index={i} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

function ThreatRow({ threat, index }: { threat: LiveThreat; index: number }) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-md px-3 py-2 text-xs transition-colors',
        index === 0 ? 'bg-red-600/5' : 'hover:bg-slate-800/50',
      )}
    >
      <Badge variant={threat.severity as 'Critical' | 'High' | 'Medium' | 'Low'} className="px-1.5 py-0 text-[10px]">
        {threat.severity}
      </Badge>
      <span className="w-20 shrink-0 font-medium text-slate-300">{threat.type}</span>
      <span className="flex-1 truncate text-slate-500">{threat.source}</span>
      <span className="shrink-0 text-slate-600">
        {new Date(threat.timestamp).toLocaleTimeString()}
      </span>
    </div>
  )
}
