import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { ChartDataPoint } from '@/types'

interface ThreatActivityChartProps {
  data: ChartDataPoint[]
  loading?: boolean
}

export function ThreatActivityChart({ data, loading }: ThreatActivityChartProps) {
  if (loading) {
    return (
      <Card className="border-slate-800 bg-slate-900">
        <CardHeader><Skeleton className="h-5 w-48 bg-slate-800" /></CardHeader>
        <CardContent><Skeleton className="h-[300px] w-full bg-slate-800" /></CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-slate-800 bg-slate-900">
      <CardHeader>
        <CardTitle className="text-base text-white">Threat Activity — Last 30 Days</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                border: '1px solid #1e293b',
                borderRadius: '8px',
                color: '#f8fafc',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="threats"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
              name="Threats"
            />
            <Line
              type="monotone"
              dataKey="blocked"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
              name="Blocked"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
