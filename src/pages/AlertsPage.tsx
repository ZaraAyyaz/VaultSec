import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useStore } from '@/store/store'
import { Plus, Bell, BellOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AlertRule } from '@/types'

export function AlertsPage() {
  const { alertRules, toggleAlertRule, addAlertRule } = useStore()
  const [modalOpen, setModalOpen] = useState(false)
  const [newRule, setNewRule] = useState({ name: '', severity: 'Medium' as const, condition: '' })

  const handleAdd = () => {
    if (!newRule.name || !newRule.condition) return
    addAlertRule({
      id: crypto.randomUUID(),
      name: newRule.name,
      severity: newRule.severity,
      condition: newRule.condition,
      enabled: true,
    })
    setNewRule({ name: '', severity: 'Medium', condition: '' })
    setModalOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Alerts & Rules</h1>
          <p className="text-sm text-slate-500">Configure security alert rules and notifications</p>
        </div>
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
              <Plus className="mr-1 h-4 w-4" /> Add Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="border-slate-800 bg-slate-950 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white">Add Alert Rule</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-slate-400">Rule Name</Label>
                <Input
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  placeholder="e.g., Brute Force Detection"
                  className="border-slate-800 bg-slate-900 text-slate-300"
                />
              </div>
              <div>
                <Label className="text-slate-400">Severity</Label>
                <select
                  value={newRule.severity}
                  onChange={(e) => setNewRule({ ...newRule, severity: e.target.value as any })}
                  className="w-full rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-300"
                >
                  <option>Critical</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
              <div>
                <Label className="text-slate-400">Condition</Label>
                <Input
                  value={newRule.condition}
                  onChange={(e) => setNewRule({ ...newRule, condition: e.target.value })}
                  placeholder="e.g., Failed login > 5 in 5m"
                  className="border-slate-800 bg-slate-900 text-slate-300"
                />
              </div>
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white" onClick={handleAdd}>
                Create Rule
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-slate-800 bg-slate-900">
        <CardHeader>
          <CardTitle className="text-base text-white">Alert Rules ({alertRules.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="max-h-[500px]">
            <div className="divide-y divide-slate-800">
              {alertRules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between px-4 py-3 hover:bg-slate-800/30">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">{rule.name}</span>
                      <Badge variant={rule.severity as 'Critical' | 'High' | 'Medium' | 'Low'} className="px-1.5 py-0 text-[10px]">
                        {rule.severity}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500 truncate">{rule.condition}</p>
                  </div>
                  <Switch
                    checked={rule.enabled}
                    onCheckedChange={() => toggleAlertRule(rule.id)}
                    className="ml-4"
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
