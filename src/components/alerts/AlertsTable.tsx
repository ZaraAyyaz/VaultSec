import { useState } from 'react'
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
import { Switch } from '@/components/ui/switch'
import { AddRuleModal } from './AddRuleModal'
import { Plus } from 'lucide-react'
import { useStore } from '@/store/store'

export function AlertsTable() {
  const alertRules = useStore((s) => s.alertRules)
  const toggleAlertRule = useStore((s) => s.toggleAlertRule)
  const [addOpen, setAddOpen] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button className="bg-red-600 hover:bg-red-700" onClick={() => setAddOpen(true)}>
          <Plus className="mr-1.5 h-4 w-4" /> Add Rule
        </Button>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800 hover:bg-transparent">
              <TableHead className="text-xs font-medium uppercase tracking-wider text-slate-400">Rule</TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-slate-400">Severity</TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-slate-400">Condition</TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-slate-400">Channel</TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-slate-400">Created</TableHead>
              <TableHead className="w-20 text-xs font-medium uppercase tracking-wider text-slate-400">Enabled</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alertRules.map((rule) => (
              <TableRow key={rule.id} className="border-slate-800 hover:bg-slate-800/40">
                <TableCell>
                  <p className="text-sm font-medium text-slate-200">{rule.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{rule.description}</p>
                </TableCell>
                <TableCell>
                  <Badge variant={rule.severity as any} className="px-1.5 py-0 text-[10px] font-semibold uppercase tracking-wider">
                    {rule.severity}
                  </Badge>
                </TableCell>
                <TableCell>
                  <code className="rounded-md bg-slate-800 px-2 py-0.5 text-xs font-mono text-slate-400">
                    {rule.condition}
                  </code>
                </TableCell>
                <TableCell className="text-sm text-slate-400">{rule.channel}</TableCell>
                <TableCell className="text-xs text-slate-500">
                  {new Date(rule.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Switch checked={rule.enabled} onCheckedChange={() => toggleAlertRule(rule.id)} />
                </TableCell>
              </TableRow>
            ))}
            {alertRules.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-sm text-slate-500">
                  No alert rules configured
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AddRuleModal open={addOpen} onOpenChange={setAddOpen} />
    </div>
  )
}
