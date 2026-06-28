import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ProfileSettings() {
  return (
    <Card className="border-slate-800 bg-slate-900">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-white">Profile Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 ring-2 ring-slate-800">
            <AvatarFallback className="bg-red-600 text-lg text-white">AD</AvatarFallback>
          </Avatar>
          <div>
            <Button size="sm" className="bg-slate-800 text-slate-300 hover:bg-slate-700">
              Change Avatar
            </Button>
            <p className="mt-1 text-xs text-slate-600">PNG, JPG. Max 2MB.</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-300">First Name</Label>
            <Input defaultValue="Admin" className="border-slate-800 bg-slate-950/50 text-slate-300" />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-300">Last Name</Label>
            <Input defaultValue="User" className="border-slate-800 bg-slate-950/50 text-slate-300" />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-300">Email</Label>
          <Input type="email" defaultValue="admin@vaultsec.io" className="border-slate-800 bg-slate-950/50 text-slate-300" />
        </div>
        <Button className="bg-red-600 hover:bg-red-700">Save Changes</Button>
      </CardContent>
    </Card>
  )
}
