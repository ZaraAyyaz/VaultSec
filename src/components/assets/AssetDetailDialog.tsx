import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Shield, Server, HardDrive, Globe, Calendar, AlertTriangle } from 'lucide-react'
import type { Asset } from '@/types'

interface AssetDetailDialogProps {
  asset: Asset | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const TYPE_ICONS = {
  Server: Server,
  Database: HardDrive,
  Endpoint: Globe,
} as const

export function AssetDetailDialog({ asset, open, onOpenChange }: AssetDetailDialogProps) {
  if (!asset) return null

  const statusColor =
    asset.status === 'Secure'
      ? 'text-green-400'
      : asset.status === 'Vulnerable'
        ? 'text-orange-400'
        : 'text-red-400'

  const riskColor =
    asset.riskScore < 30 ? 'bg-green-600' : asset.riskScore < 70 ? 'bg-orange-500' : 'bg-red-600'

  const riskLabel =
    asset.riskScore < 30
      ? 'Asset is secure. Continue regular monitoring.'
      : asset.riskScore < 70
        ? 'Apply pending security patches and review access controls.'
        : 'Immediate action required: critical vulnerabilities detected.'

  const TypeIcon = TYPE_ICONS[asset.type]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg border-slate-800 bg-slate-950 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-slate-800/50 p-2">
              <Server className="h-5 w-5 text-slate-400" />
            </div>
            <div>
              <DialogTitle className="text-white">{asset.name}</DialogTitle>
              <DialogDescription className="text-slate-400">Asset ID: {asset.id}</DialogDescription>
            </div>
            <Badge
              variant="outline"
              className={`ml-auto border-slate-700 ${statusColor} text-[10px] font-semibold uppercase tracking-wider`}
            >
              {asset.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-5 text-sm">
          <div className="space-y-1">
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-600">Type</p>
            <div className="flex items-center gap-1.5 text-slate-200 font-medium">
              <TypeIcon className="h-3.5 w-3.5 text-slate-500" />
              {asset.type}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-600">IP Address</p>
            <p className="font-mono text-xs text-slate-300">{asset.ip}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-600">OS / Platform</p>
            <p className="text-sm text-slate-200">{asset.os}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-600">Vulnerabilities</p>
            <p className="text-sm text-slate-200">{asset.vulnerabilities} found</p>
          </div>
          <div className="space-y-1">
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-600">Last Scan</p>
            <div className="flex items-center gap-1.5 text-slate-200">
              <Calendar className="h-3.5 w-3.5 text-slate-600" />
              {new Date(asset.lastScan).toLocaleDateString()}
            </div>
          </div>
        </div>

        <Separator className="bg-slate-800" />

        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-white">Risk Score</p>
            <span className={`text-lg font-bold ${riskColor.replace('bg-', 'text-')}`}>
              {asset.riskScore}/100
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${riskColor}`}
              style={{ width: `${asset.riskScore}%` }}
            />
          </div>
          <div className="mt-4 flex items-start gap-3 rounded-lg border border-slate-800 bg-slate-900/50 p-3.5">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
            <div>
              <p className="text-xs font-semibold text-slate-300">Security Recommendation</p>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{riskLabel}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
