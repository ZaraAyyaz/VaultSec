import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useStore } from '@/store/store'
import { CheckCircle, XCircle } from 'lucide-react'
import type { Threat } from '@/types'

interface ThreatDetailDrawerProps {
  threat: Threat | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ThreatDetailDrawer({ threat, open, onOpenChange }: ThreatDetailDrawerProps) {
  const updateThreatStatus = useStore((s) => s.updateThreatStatus)

  if (!open || !threat) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60" onClick={() => onOpenChange(false)} />
      <div className="relative w-full max-w-md bg-slate-950 border-l border-slate-800 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">Threat Details</h2>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="text-slate-400">
            Close
          </Button>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-slate-500 mb-1">Type</p>
            <p className="text-sm text-white font-medium">{threat.type}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Severity</p>
            <Badge variant={threat.severity as any}>{threat.severity}</Badge>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Status</p>
            <Badge variant="outline" className="border-slate-700 text-slate-300">{threat.status}</Badge>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Source</p>
            <p className="text-sm text-slate-300">{threat.source}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Description</p>
            <p className="text-sm text-slate-300">{threat.description}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Detected</p>
            <p className="text-sm text-slate-300">{new Date(threat.timestamp).toLocaleString()}</p>
          </div>
          <Separator className="bg-slate-800" />
          <div>
            <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">Timeline</p>
            <div className="space-y-3">
              {['Detected', 'Analyzed', 'Escalated'].map((step, i) => (
                <div key={step} className="flex items-start gap-3">
                  <div className={`mt-1 h-2 w-2 rounded-full ${i === 0 ? 'bg-red-500' : 'bg-slate-700'}`} />
                  <div>
                    <p className="text-sm text-slate-300">{step}</p>
                    <p className="text-xs text-slate-600">{new Date(threat.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white flex-1"
              onClick={() => { updateThreatStatus(threat.id, 'Resolved'); onOpenChange(false) }}
            >
              <CheckCircle className="mr-1 h-4 w-4" /> Resolve
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-slate-700 text-slate-400 flex-1"
              onClick={() => { updateThreatStatus(threat.id, 'Dismissed'); onOpenChange(false) }}
            >
              <XCircle className="mr-1 h-4 w-4" /> Dismiss
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
