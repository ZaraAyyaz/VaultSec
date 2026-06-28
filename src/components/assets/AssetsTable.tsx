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
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AssetDetailDialog } from './AssetDetailDialog'
import { Search } from 'lucide-react'
import { useStore } from '@/store/store'
import type { Asset } from '@/types'

function RiskBar({ score }: { score: number }) {
  const color = score < 30 ? 'bg-green-600' : score < 70 ? 'bg-orange-500' : 'bg-red-600'
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-800">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs text-slate-400">{score}</span>
    </div>
  )
}

export function AssetsTable() {
  const assets = useStore((s) => s.assets)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [detailAsset, setDetailAsset] = useState<Asset | null>(null)

  const filtered = useMemo(() => {
    let list = [...assets]
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(
        (a) => a.name.toLowerCase().includes(q) || a.ip.includes(q) || a.id.toLowerCase().includes(q),
      )
    }
    if (filterType !== 'All') list = list.filter((a) => a.type === filterType)
    if (filterStatus !== 'All') list = list.filter((a) => a.status === filterStatus)
    return list
  }, [assets, search, filterType, filterStatus])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            placeholder="Search assets..."
            className="border-slate-800 bg-slate-900/50 pl-9 text-sm text-slate-300 placeholder:text-slate-600"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[130px] border-slate-800 bg-slate-900/50 text-slate-300">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent className="border-slate-800 bg-slate-950">
            <SelectItem value="All">All Types</SelectItem>
            <SelectItem value="Server">Server</SelectItem>
            <SelectItem value="Endpoint">Endpoint</SelectItem>
            <SelectItem value="Database">Database</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[130px] border-slate-800 bg-slate-900/50 text-slate-300">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="border-slate-800 bg-slate-950">
            <SelectItem value="All">All Status</SelectItem>
            <SelectItem value="Secure">Secure</SelectItem>
            <SelectItem value="Vulnerable">Vulnerable</SelectItem>
            <SelectItem value="At Risk">At Risk</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800 hover:bg-transparent">
              <TableHead className="text-xs font-medium uppercase tracking-wider text-slate-400">Asset</TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-slate-400">Type</TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-slate-400">IP Address</TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-slate-400">OS</TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-slate-400">Status</TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-slate-400">Risk Score</TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-slate-400">Vulnerabilities</TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-slate-400">Last Scan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((asset) => (
              <TableRow
                key={asset.id}
                className="cursor-pointer border-slate-800 hover:bg-slate-800/40"
                onClick={() => setDetailAsset(asset)}
              >
                <TableCell>
                  <span className="font-medium text-slate-200">{asset.name}</span>
                </TableCell>
                <TableCell className="text-sm text-slate-400">{asset.type}</TableCell>
                <TableCell className="font-mono text-xs text-slate-500">{asset.ip}</TableCell>
                <TableCell className="text-xs text-slate-400">{asset.os}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`border px-1.5 py-0 text-[10px] font-medium ${
                    asset.status === 'Secure' ? 'text-green-400 border-green-900 bg-green-500/5' :
                    asset.status === 'Vulnerable' ? 'text-orange-400 border-orange-900 bg-orange-500/5' :
                    'text-red-400 border-red-900 bg-red-500/5'
                  }`}>
                    {asset.status}
                  </Badge>
                </TableCell>
                <TableCell><RiskBar score={asset.riskScore} /></TableCell>
                <TableCell>
                  <span className={`text-xs font-medium ${
                    asset.vulnerabilities === 0 ? 'text-green-400' :
                    asset.vulnerabilities < 5 ? 'text-orange-400' : 'text-red-400'
                  }`}>{asset.vulnerabilities}</span>
                </TableCell>
                <TableCell className="text-xs text-slate-500">
                  {new Date(asset.lastScan).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="py-12 text-center text-sm text-slate-500">
                  No assets match your filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AssetDetailDialog
        asset={detailAsset}
        open={!!detailAsset}
        onOpenChange={(o) => { if (!o) setDetailAsset(null) }}
      />
    </div>
  )
}
