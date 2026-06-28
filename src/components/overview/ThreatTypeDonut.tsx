import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import type { ThreatTypeCount } from '@/types'

interface ThreatTypeDonutProps {
  data: ThreatTypeCount[]
  loading?: boolean
}

export function ThreatTypeDonut({ data, loading }: ThreatTypeDonutProps) {
  if (loading) {
    return (
      <Card className="border-slate-800 bg-slate-900">
        <CardHeader><Skeleton className="h-5 w-40 bg-slate-800" /></CardHeader>
        <CardContent className="flex justify-center"><Skeleton className="h-[200px] w-[200px] rounded-full bg-slate-800" /></CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-slate-800 bg-slate-900">
      <CardHeader>
        <CardTitle className="text-base text-white">Threat Types</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                border: '1px solid #1e293b',
                borderRadius: '8px',
                color: '#f8fafc',
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span className="text-xs text-slate-400">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
