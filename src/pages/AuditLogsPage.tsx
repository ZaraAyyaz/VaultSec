import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useStore } from '@/store/store'
import { Search, Download, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AuditLog } from '@/types'

export function AuditLogsPage() {
  const { auditLogs } = useStore()
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [page, setPage] = useState(1)
  const perPage = 15

  const filtered = useMemo(() => {
    return auditLogs.filter((log) => {
      if (search && !log.action.toLowerCase().includes(search.toLowerCase()) && !log.user.toLowerCase().includes(search.toLowerCase()) && !log.details.toLowerCase().includes(search.toLowerCase())) return false
      if (dateFrom && new Date(log.timestamp) < new Date(dateFrom)) return false
      if (dateTo && new Date(log.timestamp) > new Date(dateTo + 'T23:59:59')) return false
      return true
    })
  }, [auditLogs, search, dateFrom, dateTo])

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  const exportCSV = () => {
    const header = 'Timestamp,User,Action,Details,IP Address\n'
    const rows = filtered.map((log) =>
      `"${log.timestamp}","${log.user}","${log.action}","${log.details}","${log.ip}"`,
    ).join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`
    a.click(); URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Audit Logs</h1>
          <p className="text-sm text-slate-500">Track user activity and system events</p>
        </div>
        <Button variant="outline" size="sm" className="border-slate-700 text-slate-400 hover:text-white" onClick={exportCSV}>
          <Download className="mr-1.5 h-3.5 w-3.5" /> Export CSV
        </Button>
      </div>

      <Card className="border-slate-800 bg-slate-900">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                placeholder="Search logs..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                className="border-slate-800 bg-slate-950 pl-9 text-sm text-slate-300 placeholder:text-slate-600"
              />
            </div>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setPage(1) }}
              className="w-[160px] border-slate-800 bg-slate-950 text-sm text-slate-300"
            />
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setPage(1) }}
              className="w-[160px] border-slate-800 bg-slate-950 text-sm text-slate-300"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-slate-400 text-xs uppercase tracking-wider">Timestamp</TableHead>
                <TableHead className="text-slate-400 text-xs uppercase tracking-wider">User</TableHead>
                <TableHead className="text-slate-400 text-xs uppercase tracking-wider">Action</TableHead>
                <TableHead className="text-slate-400 text-xs uppercase tracking-wider">Details</TableHead>
                <TableHead className="text-slate-400 text-xs uppercase tracking-wider">IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((log) => (
                <TableRow key={log.id} className="border-slate-800/50 hover:bg-slate-800/30">
                  <TableCell className="text-sm text-slate-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-sm text-slate-300">{log.user}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        'px-1.5 py-0 text-[10px]',
                        log.action.includes('Login') && 'border-blue-500/50 text-blue-400',
                        log.action.includes('Delete') && 'border-red-500/50 text-red-400',
                        log.action.includes('Create') && 'border-green-500/50 text-green-400',
                        log.action.includes('Update') && 'border-yellow-500/50 text-yellow-400',
                      )}
                    >
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[250px] truncate text-sm text-slate-400">{log.details}</TableCell>
                  <TableCell className="text-sm font-mono text-slate-600">{log.ip}</TableCell>
                </TableRow>
              ))}
              {paginated.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-sm text-slate-600">
                    No logs found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-800 px-4 py-3">
            <span className="text-xs text-slate-500">Page {page} of {totalPages} ({filtered.length} total)</span>
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
                  className={page === i + 1 ? 'bg-red-600 hover:bg-red-700 text-white' : 'text-slate-400'}
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
    </div>
  )
}
