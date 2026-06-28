import { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Bell, Shield, Server, AlertTriangle, FileText } from 'lucide-react'

const notificationOptions = [
  { id: 'critical', label: 'Critical Threats', description: 'Real-time alerts for critical security threats', icon: Shield },
  { id: 'high', label: 'High Severity Events', description: 'Notifications for high-severity events', icon: AlertTriangle },
  { id: 'scan', label: 'Scan Results', description: 'When vulnerability scans complete', icon: Server },
  { id: 'weekly', label: 'Weekly Report', description: 'Weekly security summary report', icon: FileText },
  { id: 'system', label: 'System Notifications', description: 'Platform updates and maintenance notices', icon: Bell },
] as const

export function NotificationsSettings() {
  const [settings, setSettings] = useState<Record<string, boolean>>({
    critical: true,
    high: true,
    scan: true,
    weekly: false,
    system: true,
  })

  return (
    <Card className="border-slate-800 bg-slate-900">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-white">Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-0">
        {notificationOptions.map((opt, i) => {
          const Icon = opt.icon
          return (
            <div key={opt.id}>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-slate-800/50 p-2 mt-0.5">
                    <Icon className="h-4 w-4 text-slate-400" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-200 cursor-pointer">{opt.label}</Label>
                    <p className="text-xs text-slate-500 mt-0.5">{opt.description}</p>
                  </div>
                </div>
                <Switch
                  checked={settings[opt.id]}
                  onCheckedChange={(v) => setSettings((s) => ({ ...s, [opt.id]: v }))}
                />
              </div>
              {i < notificationOptions.length - 1 && <Separator className="bg-slate-800" />}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
