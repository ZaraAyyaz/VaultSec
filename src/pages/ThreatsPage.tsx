import { useState } from 'react'
import { useStore } from '@/store/store'
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
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { bulkResolveThreats, bulkDismissThreats } from '@/data/mockData'
import { cn } from '@/lib/utils'
import {
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Activity,
  AlertTriangle,
  Shield,
  Skull,
} from 'lucide-react'
import type { Threat, Severity, ThreatStatus, ThreatType } from '@/types'

const severityIcon: Record<string, React.ReactNode> = {
  Critical: <Skull className="h-4 w-4" />,
  High: <AlertTriangle className="h-4 w-4" />,
  Medium: <Shield className="h-4 w-4" />,
  Low: <Activity className="h-4 w-4" />,
}

type SortField = 'severity' | 'timestamp' | 'type' | 'source'
type SortDir = 'asc' | 'desc'

export function ThreatsPage() {
  const { threats, updateThreatStatus } = useStore()
  const [search, setSearch] = useState('')
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortField, setSortField] = useState<SortField>('timestamp')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [detailThreat, setDetailThreat] = useState<Threat | null>(null)
  const perPage = 10

  const filtered = threats
    .filter((t) => {
      if (search && !t.source.toLowerCase().includes(search.toLowerCase()) && !t.type.toLowerCase().includes(search.toLowerCase())) return false
      if (severityFilter !== 'all' && t.severity !== severityFilter) return false
      if (typeFilter !== 'all' && t.type !== typeFilter) return false
      if (statusFilter !== 'all' && t.status !== statusFilter) return false
      return true
    })
    .sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1
      if (sortField === 'severity') {
        const rank = { Critical: 4, High: 3, Medium: 2, Low: 1 }
        return (rank[a.severity] - rank[b.severity]) * dir
      }
      if (sortField === 'timestamp') return (new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()) * dir
      if (sortField === 'type') return a.type.localeCompare(b.type) * dir
      if (sortField === 'source') return a.source.localeCompare(b.source) * dir
      return 0
    })

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortField(field); setSortDir('asc') }
  }

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selected.size === paginated.length) setSelected(new Set())
    else setSelected(new Set(paginated.map((t) => t.id)))
  }

  const handleBulkResolve = () => {
    const ids = Array.from(selected)
    const resolvedIds = bulkResolveThreats(ids)
    resolvedIds.forEach((id) => updateThreatStatus(id, 'Resolved'))
    setSelected(new Set())
  }

  const handleBulkDismiss = () => {
    const ids = Array.from(selected)
    const dismissedIds = bulkDismissThreats(ids)
    dismissedIds.forEach((id) => updateThreatStatus(id, 'Dismissed'))
    setSelected(new Set())
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-white">Threats</h1>
        <p className="text-sm text-slate-500">Manage and investigate security threats across your infrastructure</p>
      </div>

      <Card className="border-slate-800 bg-slate-900">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                placeholder="Search threats..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                className="border-slate-800 bg-slate-950 pl-9 text-sm text-slate-300 placeholder:text-slate-600"
              />
            </div>
            <Select value={severityFilter} onValueChange={(v) => { setSeverityFilter(v); setPage(1) }}>
              <SelectTrigger className="w-[130px] border-slate-800 bg-slate-950 text-slate-300">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent className="border-slate-800 bg-slate-950">
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1) }}>
              <SelectTrigger className="w-[130px] border-slate-800 bg-slate-950 text-slate-300">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="border-slate-800 bg-slate-950">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Ransomware">Ransomware</SelectItem>
                <SelectItem value="Phishing">Phishing</SelectItem>
                <SelectItem value="DDoS">DDoS</SelectItem>
                <SelectItem value="Malware">Malware</SelectItem>
                <SelectItem value="SQL Injection">SQL Injection</SelectItem>
                <SelectItem value="Brute Force">Brute Force</SelectItem>
                <SelectItem value="Insider Threat">Insider Threat</SelectItem>
                <SelectItem value="Zero-Day">Zero-Day</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
              <SelectTrigger className="w-[130px] border-slate-800 bg-slate-950 text-slate-300">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="border-slate-800 bg-slate-950">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Investigating">Investigating</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
                <SelectItem value="Dismissed">Dismissed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {selected.size > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm text-slate-400">{selected.size} selected</span>
              <Button size="sm" variant="outline" className="border-slate-700 text-green-400 hover:bg-green-600/10" onClick={handleBulkResolve}>
                <CheckCircle className="mr-1 h-3.5 w-3.5" /> Resolve
              </Button>
              <Button size="sm" variant="outline" className="border-slate-700 text-slate-400 hover:bg-slate-800" onClick={handleBulkDismiss}>
                <XCircle className="mr-1 h-3.5 w-3.5" /> Dismiss
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="max-w-full">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="w-8">
                    <input
                      type="checkbox"
                      checked={selected.size === paginated.length && paginated.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-slate-700 bg-slate-800 text-red-600 focus:ring-red-500/30"
                    />
                  </TableHead>
                  <TableHead className="text-slate-400 w-24">
                    <button onClick={() => toggleSort('severity')} className="flex items-center gap-1 text-xs uppercase tracking-wider">
                      Severity <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead className="text-slate-400">
                    <button onClick={() => toggleSort('type')} className="flex items-center gap-1 text-xs uppercase tracking-wider">
                      Type <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead className="text-slate-400">Description</TableHead>
                  <TableHead className="text-slate-400">
                    <button onClick={() => toggleSort('source')} className="flex items-center gap-1 text-xs uppercase tracking-wider">
                      Source <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead className="text-slate-400">
                    <button onClick={() => toggleSort('timestamp')} className="flex items-center gap-1 text-xs uppercase tracking-wider">
                      Detected <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead className="text-slate-400 text-xs uppercase tracking-wider">Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((t) => (
                  <TableRow key={t.id} className="border-slate-800/50 hover:bg-slate-800/30 cursor-pointer" onClick={() => setDetailThreat(t)}>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selected.has(t.id)}
                        onChange={() => toggleSelect(t.id)}
                        className="rounded border-slate-700 bg-slate-800 text-red-600 focus:ring-red-500/30"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {severityIcon[t.severity]}
                        <Badge variant={t.severity as 'Critical' | 'High' | 'Medium' | 'Low'} className="px-1.5 py-0 text-[10px]">
                          {t.severity}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-300">{t.type}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-sm text-slate-400">{t.description}</TableCell>
                    <TableCell className="text-sm text-slate-300">{t.source}</TableCell>
                    <TableCell className="text-sm text-slate-500">{formatDate(t.timestamp)}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          'border px-1.5 py-0 text-[10px]',
                          t.status === 'Active' && 'border-red-500/50 text-red-400 bg-red-500/5',
                          t.status === 'Investigating' && 'border-yellow-500/50 text-yellow-400 bg-yellow-500/5',
                          t.status === 'Resolved' && 'border-green-500/50 text-green-400 bg-green-500/5',
                          t.status === 'Dismissed' && 'border-slate-600 text-slate-500 bg-slate-800/50',
                        )}
                      >
                        {t.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); updateThreatStatus(t.id, 'Resolved') }}
                          className="rounded p-1 text-slate-600 hover:text-green-400"
                          title="Resolve"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); updateThreatStatus(t.id, 'Dismissed') }}
                          className="rounded p-1 text-slate-600 hover:text-slate-400"
                          title="Dismiss"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {paginated.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="py-8 text-center text-sm text-slate-600">
                      No threats found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-800 px-4 py-3">
            <span className="text-xs text-slate-500">
              Page {page} of {totalPages} ({filtered.length} total)
            </span>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="text-slate-400">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <Button
                  key={i}
                  variant={page === i + 1 ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPage(i + 1)}
                  className={page === i + 1 ? 'bg-red-600 text-white hover:bg-red-700' : 'text-slate-400'}
                >
                  {i + 1}
                </Button>
              ))}
              <Button variant="ghost" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="text-slate-400">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Detail Side Drawer */}
      {detailThreat && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDetailThreat(null)} />
          <div className="relative w-full max-w-md bg-slate-950 border-l border-slate-800 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Threat Details</h2>
              <Button variant="ghost" size="sm" onClick={() => setDetailThreat(null)} className="text-slate-400">Close</Button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Type</p>
                <p className="text-sm text-white font-medium">{detailThreat.type}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Severity</p>
                <Badge variant={detailThreat.severity as 'Critical' | 'High' | 'Medium' | 'Low'}>{detailThreat.severity}</Badge>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Status</p>
                <Badge variant="outline" className="border-slate-700 text-slate-300">{detailThreat.status}</Badge>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Source</p>
                <p className="text-sm text-slate-300">{detailThreat.source}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Description</p>
                <p className="text-sm text-slate-300">{detailThreat.description}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Detected</p>
                <p className="text-sm text-slate-300">{new Date(detailThreat.timestamp).toLocaleString()}</p>
              </div>
              <Separator className="bg-slate-800" />
              <div>
                <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">Timeline</p>
                <div className="space-y-3">
                  {['Detected', 'Analyzed', 'Escalated'].map((step, i) => (
                    <div key={step} className="flex items-start gap-3">
                      <div className={cn(
                        'mt-1 h-2 w-2 rounded-full',
                        i === 0 ? 'bg-red-500' : 'bg-slate-700',
                      )} />
                      <div>
                        <p className="text-sm text-slate-300">{step}</p>
                        <p className="text-xs text-slate-600">{new Date(detailThreat.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white flex-1" onClick={() => { updateThreatStatus(detailThreat.id, 'Resolved'); setDetailThreat(null) }}>
                  <CheckCircle className="mr-1 h-4 w-4" /> Resolve
                </Button>
                <Button size="sm" variant="outline" className="border-slate-700 text-slate-400 flex-1" onClick={() => { updateThreatStatus(detailThreat.id, 'Dismissed'); setDetailThreat(null) }}>
                  <XCircle className="mr-1 h-4 w-4" /> Dismiss
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function formatDate(ts: string): string {
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
