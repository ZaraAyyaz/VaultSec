import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { useStore } from '@/store/store'
import { Search, Shield, AlertTriangle } from 'lucide-react'
import type { Asset } from '@/types'

export function AssetsPage() {
  const { assets } = useStore()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [detailAsset, setDetailAsset] = useState<Asset | null>(null)

  const filtered = useMemo(() => {
    return assets.filter((a) => {
      if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !a.ip.toLowerCase().includes(search.toLowerCase())) return false
      if (typeFilter !== 'all' && a.type !== typeFilter) return false
      if (statusFilter !== 'all' && a.status !== statusFilter) return false
      return true
    })
  }, [assets, search, typeFilter, statusFilter])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-white">Assets</h1>
        <p className="text-sm text-slate-500">Monitor and manage your infrastructure assets</p>
      </div>

      <Card className="border-slate-800 bg-slate-900">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                placeholder="Search assets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-slate-800 bg-slate-950 pl-9 text-sm text-slate-300 placeholder:text-slate-600"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[130px] border-slate-800 bg-slate-950 text-slate-300">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="border-slate-800 bg-slate-950">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Server">Server</SelectItem>
                <SelectItem value="Workstation">Workstation</SelectItem>
                <SelectItem value="Network">Network</SelectItem>
                <SelectItem value="Database">Database</SelectItem>
                <SelectItem value="Cloud">Cloud</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px] border-slate-800 bg-slate-950 text-slate-300">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="border-slate-800 bg-slate-950">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Secure">Secure</SelectItem>
                <SelectItem value="At Risk">At Risk</SelectItem>
                <SelectItem value="Compromised">Compromised</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-slate-400 text-xs uppercase tracking-wider">Name</TableHead>
                <TableHead className="text-slate-400 text-xs uppercase tracking-wider">Type</TableHead>
                <TableHead className="text-slate-400 text-xs uppercase tracking-wider">IP Address</TableHead>
                <TableHead className="text-slate-400 text-xs uppercase tracking-wider">Risk Score</TableHead>
                <TableHead className="text-slate-400 text-xs uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-slate-400 text-xs uppercase tracking-wider">Last Scan</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((a) => (
                <TableRow key={a.id} className="border-slate-800/50 hover:bg-slate-800/30 cursor-pointer" onClick={() => setDetailAsset(a)}>
                  <TableCell className="text-sm font-medium text-white">{a.name}</TableCell>
                  <TableCell className="text-sm text-slate-400">{a.type}</TableCell>
                  <TableCell className="text-sm text-slate-500 font-mono">{a.ip}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full',
                            a.riskScore >= 80 ? 'bg-red-500' : a.riskScore >= 50 ? 'bg-yellow-500' : 'bg-green-500',
                          )}
                          style={{ width: `${a.riskScore}%` }}
                        />
                      </div>
                      <span className={cn(
                        'text-xs font-medium',
                        a.riskScore >= 80 ? 'text-red-400' : a.riskScore >= 50 ? 'text-yellow-400' : 'text-green-400',
                      )}>
                        {a.riskScore}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        'px-1.5 py-0 text-[10px]',
                        a.status === 'Secure' && 'border-green-500/50 text-green-400 bg-green-500/5',
                        a.status === 'At Risk' && 'border-yellow-500/50 text-yellow-400 bg-yellow-500/5',
                        a.status === 'Compromised' && 'border-red-500/50 text-red-400 bg-red-500/5',
                        a.status === 'Maintenance' && 'border-slate-600 text-slate-500 bg-slate-800/50',
                      )}
                    >
                      {a.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-slate-500">{formatDate(a.lastScan)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="text-slate-500 hover:text-white" onClick={() => setDetailAsset(a)}>
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-sm text-slate-600">
                    No assets found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!detailAsset} onOpenChange={() => setDetailAsset(null)}>
        <DialogContent className="border-slate-800 bg-slate-950 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">{detailAsset?.name}</DialogTitle>
          </DialogHeader>
          {detailAsset && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Type</p>
                  <p className="text-sm text-slate-300">{detailAsset.type}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Status</p>
                  <Badge
                    variant="outline"
                    className={cn(
                      'mt-1 px-1.5 py-0 text-[10px]',
                      detailAsset.status === 'Secure' && 'border-green-500/50 text-green-400',
                      detailAsset.status === 'At Risk' && 'border-yellow-500/50 text-yellow-400',
                      detailAsset.status === 'Compromised' && 'border-red-500/50 text-red-400',
                    )}
                  >
                    {detailAsset.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-slate-500">IP Address</p>
                  <p className="text-sm font-mono text-slate-300">{detailAsset.ip}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Risk Score</p>
                  <p className={cn(
                    'text-sm font-medium',
                    detailAsset.riskScore >= 80 ? 'text-red-400' : detailAsset.riskScore >= 50 ? 'text-yellow-400' : 'text-green-400',
                  )}>
                    {detailAsset.riskScore}/100
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Last Scan</p>
                  <p className="text-sm text-slate-300">{new Date(detailAsset.lastScan).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Open Ports</p>
                  <p className="text-sm text-slate-300">{detailAsset.openPorts || 'None'}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Vulnerabilities</p>
                <p className="text-sm text-slate-300">{detailAsset.vulnerabilities || 'No known vulnerabilities'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">Security Recommendation</p>
                <div className={cn(
                  'rounded-lg border p-3 text-sm',
                  detailAsset.riskScore >= 80 ? 'border-red-500/30 bg-red-500/5 text-red-300' :
                  detailAsset.riskScore >= 50 ? 'border-yellow-500/30 bg-yellow-500/5 text-yellow-300' :
                  'border-green-500/30 bg-green-500/5 text-green-300',
                )}>
                  {detailAsset.riskScore >= 80 ? 'Immediate action required. Isolate asset and run full security scan.' :
                   detailAsset.riskScore >= 50 ? 'Review open ports and update security patches.' :
                   'Asset is secure. Continue regular monitoring.'}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function formatDate(ts: string): string {
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
