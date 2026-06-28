import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Key, Copy, Eye, EyeOff, RefreshCw, Trash2 } from 'lucide-react'
import type { ApiKey } from '@/types'

const mockProfile = {
  name: 'Admin User',
  email: 'admin@vaultsec.io',
  role: 'Security Administrator',
  twoFA: true,
  notifications: {
    email: true,
    slack: false,
    sms: false,
    push: true,
  },
}

const initialKeys: ApiKey[] = [
  { id: '1', name: 'Production Monitor', key: 'vs_sk_prod_8a7f3d2e1b0c', created: '2025-12-01', lastUsed: '2026-06-27', status: 'Active' },
  { id: '2', name: 'Staging API', key: 'vs_sk_stag_4f5e6d7c8b9a', created: '2026-01-15', lastUsed: '2026-06-25', status: 'Active' },
  { id: '3', name: 'Dev Environment', key: 'vs_sk_dev_1a2b3c4d5e6f', created: '2026-03-20', lastUsed: '2026-06-20', status: 'Active' },
  { id: '4', name: 'Legacy Integration', key: 'vs_sk_leg_9d8e7f6c5b4a', created: '2025-06-10', lastUsed: '2026-04-01', status: 'Revoked' },
]

export function SettingsPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialKeys)
  const [visibleKey, setVisibleKey] = useState<string | null>(null)
  const [notif, setNotif] = useState(mockProfile.notifications)
  const [twoFA, setTwoFA] = useState(mockProfile.twoFA)

  const generateKey = () => {
    const id = crypto.randomUUID().slice(0, 8)
    const key: ApiKey = {
      id,
      name: `New Key ${apiKeys.length + 1}`,
      key: `vs_sk_${Math.random().toString(36).slice(2, 14)}`,
      created: new Date().toISOString().slice(0, 10),
      lastUsed: '-',
      status: 'Active',
    }
    setApiKeys([key, ...apiKeys])
  }

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key)
  }

  const revokeKey = (id: string) => {
    setApiKeys((prev) => prev.map((k) => (k.id === id ? { ...k, status: 'Revoked' } : k)))
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-white">Settings</h1>
        <p className="text-sm text-slate-500">Manage your account and security preferences</p>
      </div>

      <Card className="border-slate-800 bg-slate-900">
        <CardHeader>
          <CardTitle className="text-base text-white">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-400 text-xs">Name</Label>
              <Input value={mockProfile.name} readOnly className="border-slate-800 bg-slate-950 text-slate-300 mt-1" />
            </div>
            <div>
              <Label className="text-slate-400 text-xs">Email</Label>
              <Input value={mockProfile.email} readOnly className="border-slate-800 bg-slate-950 text-slate-300 mt-1" />
            </div>
          </div>
          <div>
            <Label className="text-slate-400 text-xs">Role</Label>
            <Input value={mockProfile.role} readOnly className="border-slate-800 bg-slate-950 text-slate-300 mt-1" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-800 bg-slate-900">
        <CardHeader>
          <CardTitle className="text-base text-white">API Keys</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={generateKey}>
            <Key className="mr-1.5 h-4 w-4" /> Generate New Key
          </Button>
          <div className="space-y-2">
            {apiKeys.map((k) => (
              <div key={k.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-800 p-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{k.name}</span>
                    <Badge
                      variant="outline"
                      className={cn(
                        'px-1.5 py-0 text-[10px]',
                        k.status === 'Active' ? 'border-green-500/50 text-green-400' : 'border-slate-600 text-slate-500',
                      )}
                    >
                      {k.status}
                    </Badge>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <code className="text-xs font-mono text-slate-500">
                      {visibleKey === k.id ? k.key : `${k.key.slice(0, 12)}...`}
                    </code>
                    <button onClick={() => setVisibleKey(visibleKey === k.id ? null : k.id)} className="text-slate-600 hover:text-white">
                      {visibleKey === k.id ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                    <button onClick={() => copyKey(k.key)} className="text-slate-600 hover:text-white">
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-600">Created {k.created} · Last used {k.lastUsed}</p>
                </div>
                {k.status === 'Active' && (
                  <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300" onClick={() => revokeKey(k.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-800 bg-slate-900">
        <CardHeader>
          <CardTitle className="text-base text-white">Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(['email', 'slack', 'sms', 'push'] as const).map((channel) => (
            <div key={channel} className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white capitalize">{channel}</p>
                <p className="text-xs text-slate-500">{channel === 'email' ? 'Send email alerts' : channel === 'slack' ? 'Send Slack notifications' : channel === 'sms' ? 'Send SMS alerts' : 'Send push notifications'}</p>
              </div>
              <Switch checked={notif[channel]} onCheckedChange={(v) => setNotif((n) => ({ ...n, [channel]: v }))} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-slate-800 bg-slate-900">
        <CardHeader>
          <CardTitle className="text-base text-white">Security</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white">Two-Factor Authentication</p>
              <p className="text-xs text-slate-500">Add an extra layer of security</p>
            </div>
            <Switch checked={twoFA} onCheckedChange={setTwoFA} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}
