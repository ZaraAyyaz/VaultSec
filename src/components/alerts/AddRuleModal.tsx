import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useStore } from '@/store/store'
import type { AlertRule } from '@/types'

interface AddRuleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddRuleModal({ open, onOpenChange }: AddRuleModalProps) {
  const addAlertRule = useStore((s) => s.addAlertRule)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [severity, setSeverity] = useState('Medium')
  const [condition, setCondition] = useState('')
  const [channel, setChannel] = useState('Email')

  const handleSubmit = () => {
    if (!name.trim() || !condition.trim()) return
    const rule: AlertRule = {
      id: `RLE-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      name: name.trim(),
      description: description.trim(),
      severity: severity as AlertRule['severity'],
      condition: condition.trim(),
      channel: channel as AlertRule['channel'],
      enabled: true,
      createdAt: new Date().toISOString(),
    }
    addAlertRule(rule)
    setName('')
    setDescription('')
    setCondition('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-slate-800 bg-slate-950">
        <DialogHeader>
          <DialogTitle className="text-white">Create Alert Rule</DialogTitle>
        </DialogHeader>
        <div className="space-y-5">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-300">Rule Name</Label>
            <Input
              placeholder="e.g., Unauthorized Access Detection"
              className="border-slate-800 bg-slate-900 text-slate-300 placeholder:text-slate-600"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-300">Description</Label>
            <Textarea
              placeholder="Describe what this rule monitors..."
              className="border-slate-800 bg-slate-900 text-slate-300 placeholder:text-slate-600"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-300">Severity</Label>
              <Select value={severity} onValueChange={setSeverity}>
                <SelectTrigger className="border-slate-800 bg-slate-900 text-slate-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-slate-800 bg-slate-950">
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-300">Channel</Label>
              <Select value={channel} onValueChange={setChannel}>
                <SelectTrigger className="border-slate-800 bg-slate-900 text-slate-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-slate-800 bg-slate-950">
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="Slack">Slack</SelectItem>
                  <SelectItem value="SMS">SMS</SelectItem>
                  <SelectItem value="Webhook">Webhook</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-300">Trigger Condition</Label>
            <Input
              placeholder="e.g., failed_logins > 5 in 10m"
              className="border-slate-800 bg-slate-900 text-slate-300 font-mono text-xs placeholder:text-slate-600"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" className="border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="bg-red-600 hover:bg-red-700" onClick={handleSubmit} disabled={!name.trim() || !condition.trim()}>
            Create Rule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
