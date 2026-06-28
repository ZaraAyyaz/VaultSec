import { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Smartphone, Copy, Check, QrCode } from 'lucide-react'

export function TwoFactorAuth() {
  const [enabled, setEnabled] = useState(false)

  const handleCopyKey = () => {
    navigator.clipboard.writeText('VAULTSEC-ABCD-EFGH-IJKL')
  }

  return (
    <Card className="border-slate-800 bg-slate-900">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-white">Two-Factor Authentication</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-slate-800/50 p-2 mt-0.5">
              <Shield className="h-4 w-4 text-slate-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">Enable 2FA</p>
              <p className="text-xs text-slate-500 mt-0.5">Add an extra layer of security to your account</p>
            </div>
          </div>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </div>

        {enabled && (
          <div className="space-y-5 rounded-xl border border-slate-800 bg-slate-950/50 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-600/10 p-2">
                <Smartphone className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">Authenticator App</p>
                <p className="text-xs text-slate-500 mt-0.5">Scan this code or enter the key manually in your authenticator app.</p>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="flex h-44 w-44 items-center justify-center rounded-xl border-2 border-dashed border-slate-700 bg-white/5">
                <div className="text-center">
                  <QrCode className="mx-auto h-16 w-16 text-slate-600" />
                  <p className="mt-2 text-[10px] font-mono text-slate-600">VSEC-2FA</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-slate-900 px-4 py-2.5">
              <code className="text-xs font-mono text-slate-400 tracking-wider">VAULTSEC-ABCD-EFGH-IJKL</code>
              <Button size="sm" variant="ghost" className="h-7 text-slate-400 hover:text-white" onClick={handleCopyKey}>
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="flex items-center gap-2.5 rounded-lg bg-green-600/10 border border-green-600/20 p-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600/20">
                <Check className="h-3.5 w-3.5 text-green-400" />
              </div>
              <p className="text-xs font-medium text-green-300">Two-factor authentication is now active for your account.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
