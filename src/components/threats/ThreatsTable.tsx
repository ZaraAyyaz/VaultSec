import { useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ThreatDetailDrawer } from './ThreatDetailDrawer'
import { ArrowUpDown, Search, ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react'
import { useStore } from '@/store/store'
import type { Threat, Severity } from '@/types'

const PAGE_SIZE = 10
const SEVERITY_ORDER: Record<Severity, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 }

export function ThreatsTable() {
  const threats = useStore((s) => s.threats)
  const updateThreatStatus = useStore((s) => s.updateThreatStatus)

  const [search, setSearch] = useState('')
  const [filterSeverity, setFilterSeverity] = useState('All')
  const [filterType, setFilterType] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [sortField, setSortField] = useState('timestamp')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [detailThreat, setDetailThreat] = useState<Threat | null>(null)

  const toggleSort = (field: string) => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortField(field); setSortDir('asc') }
  }

  const filtered = useMemo(() => {
    let list = [...threats]
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.source.includes(q),
      )
    }
    if (filterSeverity !== 'All') list = list.filter((t) => t.severity === filterSeverity)
    if (filterType !== 'All') list = list.filter((t) => t.type === filterType)
    if (filterStatus !== 'All') list = list.filter((t) => t.status === filterStatus)
    list.sort((a, b) => {
      let cmp = 0
      if (sortField === 'severity') cmp = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
      else if (sortField === 'timestamp') cmp = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      else cmp = String(a[sortField as keyof Threat]).localeCompare(String(b[sortField as keyof Threat]))
      return sortDir === 'asc' ? cmp : -cmp
    })
    return list
  }, [threats, search, filterSeverity, filterType, filterStatus, sortField, sortDir])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    setSelected((prev) =>
      prev.size === paged.length ? new Set() : new Set(paged.map((t) => t.id)),
    )
  }

  const bulkResolve = () => {
    selected.forEach((id) => updateThreatStatus(id, 'Resolved'))
    setSelected(new Set())
  }

  const bulkDismiss = () => {
    selected.forEach((id) => updateThreatStatus(id, 'Dismissed'))
    setSelected(new Set())
  }

  const SortHeader = ({ field, label }: { field: string; label: string }) => (
    <TableHead
      className="cursor-pointer text-slate-400 hover:text-white"
      onClick={() => toggleSort(field)}
    >
      <span className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider">
        {label}
        <ArrowUpDown className="h-3 w-3" />
      </span>
    </TableHead>
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            placeholder="Search threats..."
            className="border-slate-800 bg-slate-900/50 pl-9 text-sm text-slate-300 placeholder:text-slate-600"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0) }}
          />
        </div>
        <Select value={filterSeverity} onValueChange={(v) => { setFilterSeverity(v); setPage(0) }}>
          <SelectTrigger className="w-[130px] border-slate-800 bg-slate-900/50 text-slate-300">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent className="border-slate-800 bg-slate-950">
            <SelectItem value="All">All Severities</SelectItem>
            <SelectItem value="Critical">Critical</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={(v) => { setFilterType(v); setPage(0) }}>
          <SelectTrigger className="w-[130px] border-slate-800 bg-slate-900/50 text-slate-300">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent className="border-slate-800 bg-slate-950">
            <SelectItem value="All">All Types</SelectItem>
            <SelectItem value="Malware">Malware</SelectItem>
            <SelectItem value="Phishing">Phishing</SelectItem>
            <SelectItem value="DDoS">DDoS</SelectItem>
            <SelectItem value="Ransomware">Ransomware</SelectItem>
            <SelectItem value="Insider">Insider</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setPage(0) }}>
          <SelectTrigger className="w-[130px] border-slate-800 bg-slate-900/50 text-slate-300">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="border-slate-800 bg-slate-950">
            <SelectItem value="All">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
            <SelectItem value="Dismissed">Dismissed</SelectItem>
          </SelectContent>
        </Select>
        {selected.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400">{selected.size} selected</span>
            <Button size="sm" className="h-8 bg-green-600 hover:bg-green-700" onClick={bulkResolve}>
              <CheckCircle className="mr-1 h-3.5 w-3.5" /> Resolve
            </Button>
            <Button size="sm" variant="outline" className="h-8 border-slate-700 text-slate-400 hover:text-white" onClick={bulkDismiss}>
              <XCircle className="mr-1 h-3.5 w-3.5" /> Dismiss
            </Button>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800 hover:bg-transparent">
              <TableHead className="w-10">
                <Checkbox
                  checked={paged.length > 0 && selected.size === paged.length}
                  onCheckedChange={toggleAll}
                  className="border-slate-600"
                />
              </TableHead>
              <SortHeader field="id" label="ID" />
              <SortHeader field="severity" label="Severity" />
              <SortHeader field="type" label="Type" />
              <TableHead className="text-xs font-medium uppercase tracking-wider text-slate-400">Description</TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-slate-400">Source</TableHead>
              <SortHeader field="status" label="Status" />
              <SortHeader field="timestamp" label="Time" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((threat) => (
              <TableRow
                key={threat.id}
                className="cursor-pointer border-slate-800 hover:bg-slate-800/40"
                onClick={() => setDetailThreat(threat)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selected.has(threat.id)}
                    onCheckedChange={() => toggleSelect(threat.id)}
                    className="border-slate-600"
                  />
                </TableCell>
                <TableCell className="font-mono text-xs font-medium text-slate-300">{threat.id}</TableCell>
                <TableCell>
                  <Badge variant={threat.severity as any} className="px-1.5 py-0 text-[10px] font-semibold uppercase tracking-wider">
                    {threat.severity}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-slate-300">{threat.type}</TableCell>
                <TableCell className="max-w-xs truncate text-sm text-slate-400">{threat.description}</TableCell>
                <TableCell className="font-mono text-xs text-slate-500">{threat.source}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    threat.status === 'Active' ? 'bg-red-500/10 text-red-400' :
                    threat.status === 'Resolved' ? 'bg-green-500/10 text-green-400' :
                    'bg-slate-500/10 text-slate-400'
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      threat.status === 'Active' ? 'bg-red-400' :
                      threat.status === 'Resolved' ? 'bg-green-400' : 'bg-slate-400'
                    }`} />
                    {threat.status}
                  </span>
                </TableCell>
                <TableCell className="text-xs text-slate-500">
                  {new Date(threat.timestamp).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
            {paged.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="py-12 text-center text-sm text-slate-500">
                  No threats match your filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">
          Showing <span className="font-medium text-slate-400">{page * PAGE_SIZE + 1}</span>–
          <span className="font-medium text-slate-400">{Math.min((page + 1) * PAGE_SIZE, filtered.length)}</span> of{' '}
          <span className="font-medium text-slate-400">{filtered.length}</span> threats
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
              const start = Math.max(0, Math.min(page - 2, totalPages - 5))
              const num = start + i
              if (num >= totalPages) return null
              return (
                <button
                  key={num}
                  onClick={() => setPage(num)}
                  className={`flex h-7 w-7 items-center justify-center rounded-md text-xs font-medium ${
                    page === num ? 'bg-red-600 text-white' : 'text-slate-500 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {num + 1}
                </button>
              )
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ThreatDetailDrawer
        threat={detailThreat}
        open={!!detailThreat}
        onOpenChange={(o) => { if (!o) setDetailThreat(null) }}
      />
    </div>
  )
}
