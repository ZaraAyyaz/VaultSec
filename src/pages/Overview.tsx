import { useEffect, useState } from 'react'
import { StatsCard } from '@/components/overview/StatsCard'
import { ThreatActivityChart } from '@/components/overview/ThreatActivityChart'
import { ThreatTypeDonut } from '@/components/overview/ThreatTypeDonut'
import { LiveThreatFeed } from '@/components/overview/LiveThreatFeed'
import { RecentIncidents } from '@/components/overview/RecentIncidents'
import { useStore } from '@/store/store'
import { mockThreats, mockIncidents, mockChartData, mockThreatTypeDistribution } from '@/data/mockData'
import { Shield, AlertTriangle, Server, TrendingUp } from 'lucide-react'

export default function Overview() {
  const { setThreats, setIncidents } = useStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setThreats(mockThreats)
      setIncidents(mockIncidents)
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [setThreats, setIncidents])

  const activeCount = mockThreats.filter((t) => t.status === 'Active').length

  const statsCards = [
    {
      title: 'Total Threats',
      value: mockThreats.length,
      subtitle: `${activeCount} active`,
      icon: <Shield className="h-5 w-5" />,
      trend: { value: '+12% from last month', positive: false },
    },
    {
      title: 'Active Incidents',
      value: mockIncidents.filter((i) => i.status !== 'Resolved').length,
      subtitle: `${mockIncidents.filter((i) => i.severity === 'Critical').length} critical`,
      icon: <AlertTriangle className="h-5 w-5" />,
      trend: { value: '+3 new today', positive: false },
    },
    {
      title: 'Assets Monitored',
      value: 12,
      subtitle: '2 at risk',
      icon: <Server className="h-5 w-5" />,
      trend: { value: 'All agents online', positive: true },
    },
    {
      title: 'Risk Score',
      value: '64',
      subtitle: 'Moderate risk',
      icon: <TrendingUp className="h-5 w-5" />,
      trend: { value: '-5 from yesterday', positive: true },
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Security Overview</h1>
        <p className="text-sm text-slate-500">Real-time cybersecurity monitoring dashboard</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card) => (
          <StatsCard key={card.title} {...card} loading={loading} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <ThreatActivityChart data={mockChartData} loading={loading} />
        </div>
        <div className="lg:col-span-3">
          <ThreatTypeDonut data={mockThreatTypeDistribution} loading={loading} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <LiveThreatFeed />
        <RecentIncidents incidents={mockIncidents} loading={loading} />
      </div>
    </div>
  )
}
