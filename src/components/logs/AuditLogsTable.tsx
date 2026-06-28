import { useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Download, ChevronLeft, ChevronRight } from 'lucide-react'
import { useStore } from '@/store/store'

const PAGE_SIZE = 15

export function AuditLogsTable() {
  const auditLogs = useStore((s) => s.auditLogs)
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [page, setPage] = useState(0)

  const filtered = useMemo(() => {
    let list = [...auditLogs]
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(
        (l) =>
          l.user.toLowerCase().includes(q) ||
          l.action.toLowerCase().includes(q) ||
          l.details.toLowerCase().includes(q),
      )
    }
    if (dateFrom) {
      const from = new Date(dateFrom).getTime()
      list = list.filter((l) => new Date(l.timestamp).getTime() >= from)
    }
    if (dateTo) {
      const to = new Date(dateTo).getTime() + 86400000
      list = list.filter((l) => new Date(l.timestamp).getTime() <= to)
    }
    return list
  }, [auditLogs, search, dateFrom, dateTo])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const exportCSV = () => {
    const headers = ['ID', 'User', 'Action', 'Resource', 'Timestamp', 'IP Address', 'Details']
    const rows = filtered.map((l) => [l.id, l.user, l.action, l.resource, new Date(l.timestamp).toISOString(), l.ipAddress, l.details])
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            placeholder="Search logs..."
            className="border-slate-800 bg-slate-900/50 pl-9 text-sm text-slate-300 placeholder:text-slate-600"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0) }}
          />
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => { setDateFrom(e.target.value); setPage(0) }}
            className="w-40 border-slate-800 bg-slate-900/50 text-sm text-slate-300"
          />
          <span className="text-xs text-slate-600">to</span>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => { setDateTo(e.target.value); setPage(0) }}
            className="w-40 border-slate-800 bg-slate-900/50 text-sm text-slate-300"
          />
        </div>
        <Button size="sm" className="bg-slate-800 text-slate-300 hover:bg-slate-700" onClick={exportCSV}>
          <Download className="mr-1.5 h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800 hover:bg-transparent">
              <TableHead className="text-xs font-medium uppercase tracking-wider text-slate-400">User</TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-slate-400">Action</TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-slate-400">Resource</TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-slate-400">Timestamp</TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-slate-400">IP Address</TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-slate-400">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((log) => (
              <TableRow key={log.id} className="border-slate-800 hover:bg-slate-800/40">
                <TableCell className="text-sm font-medium text-slate-200">{log.user}</TableCell>
                <TableCell>
                  <span className="rounded-md bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-300">
                    {log.action}
                  </span>
                </TableCell>
                <TableCell className="font-mono text-xs text-slate-500">{log.resource}</TableCell>
                <TableCell className="text-xs text-slate-400">
                  {new Date(log.timestamp).toLocaleString()}
                </TableCell>
                <TableCell className="font-mono text-xs text-slate-500">{log.ipAddress}</TableCell>
                <TableCell className="max-w-xs truncate text-xs text-slate-500">{log.details}</TableCell>
              </TableRow>
            ))}
            {paged.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-sm text-slate-500">
                  No logs match your filters
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
          <span className="font-medium text-slate-400">{filtered.length}</span> logs
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
          <span className="text-xs text-slate-500">{page + 1} / {totalPages || 1}</span>
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
    </div>
  )
}
