import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Copy, Trash2, Key } from 'lucide-react'
import { useStore } from '@/store/store'
import type { ApiKey } from '@/types'

function generateKeyString(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from({ length: 40 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export function ApiKeys() {
  const apiKeys = useStore((s) => s.apiKeys)
  const addApiKey = useStore((s) => s.addApiKey)
  const revokeApiKey = useStore((s) => s.revokeApiKey)
  const [newName, setNewName] = useState('')

  const handleGenerate = () => {
    if (!newName.trim()) return
    const key: ApiKey = {
      id: `KEY-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      name: newName.trim(),
      key: `vs_sk_${generateKeyString()}`,
      created: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
      status: 'Active',
    }
    addApiKey(key)
    setNewName('')
  }

  const handleCopy = (keyValue: string) => {
    navigator.clipboard.writeText(keyValue)
  }

  const handleRevoke = (id: string) => {
    revokeApiKey(id)
  }

  return (
    <Card className="border-slate-800 bg-slate-900">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-white">API Keys</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-3">
          <div className="flex-1 space-y-2">
            <Label className="text-sm font-medium text-slate-300">New API Key Name</Label>
            <Input
              placeholder="e.g., Production Monitor"
              className="border-slate-800 bg-slate-950/50 text-slate-300 placeholder:text-slate-600"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
          </div>
          <Button className="bg-red-600 hover:bg-red-700" onClick={handleGenerate} disabled={!newName.trim()}>
            <Key className="mr-1.5 h-4 w-4" /> Generate
          </Button>
        </div>

        <div className="rounded-lg border border-slate-800 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-xs font-medium uppercase tracking-wider text-slate-400">Name</TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wider text-slate-400">Key</TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wider text-slate-400">Created</TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wider text-slate-400">Last Used</TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wider text-slate-400">Status</TableHead>
                <TableHead className="w-20 text-xs font-medium uppercase tracking-wider text-slate-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((apiKey) => (
                <TableRow key={apiKey.id} className="border-slate-800 hover:bg-slate-800/40">
                  <TableCell className="text-sm font-medium text-slate-200">{apiKey.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="rounded-md bg-slate-800 px-2 py-0.5 text-xs font-mono text-slate-400">
                        {apiKey.key.slice(0, 12)}...
                      </code>
                      {apiKey.status === 'Active' && (
                        <button onClick={() => handleCopy(apiKey.key)} className="text-slate-600 hover:text-white">
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {new Date(apiKey.created).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {new Date(apiKey.lastUsed).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      apiKey.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${apiKey.status === 'Active' ? 'bg-green-400' : 'bg-red-400'}`} />
                      {apiKey.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {apiKey.status === 'Active' && (
                      <button onClick={() => handleRevoke(apiKey.id)} className="text-slate-600 hover:text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {apiKeys.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-sm text-slate-500">
                    No API keys generated yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
