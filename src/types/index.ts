export type Severity = 'Critical' | 'High' | 'Medium' | 'Low'
export type ThreatType = 'Malware' | 'Phishing' | 'DDoS' | 'Ransomware' | 'Insider'
export type ThreatStatus = 'Active' | 'Resolved' | 'Dismissed'
export type AssetType = 'Server' | 'Endpoint' | 'Database'
export type AssetStatus = 'Secure' | 'Vulnerable' | 'At Risk'
export type AlertRuleSeverity = 'Critical' | 'High' | 'Medium' | 'Low'
export type NotificationChannel = 'Email' | 'Slack' | 'SMS' | 'Webhook'

export interface Threat {
  id: string
  type: ThreatType
  description: string
  severity: Severity
  status: ThreatStatus
  source: string
  destination: string
  timestamp: string
  assignedTo?: string
  timeline: TimelineEvent[]
}

export interface TimelineEvent {
  time: string
  action: string
  detail: string
}

export interface Asset {
  id: string
  name: string
  type: AssetType
  status: AssetStatus
  ip: string
  os: string
  riskScore: number
  lastScan: string
  vulnerabilities: number
}

export interface AuditLog {
  id: string
  user: string
  action: string
  resource: string
  timestamp: string
  ipAddress: string
  details: string
}

export interface AlertRule {
  id: string
  name: string
  description: string
  severity: AlertRuleSeverity
  condition: string
  channel: NotificationChannel
  enabled: boolean
  createdAt: string
}

export interface Incident {
  id: string
  title: string
  severity: Severity
  type: ThreatType
  timestamp: string
  status: string
}

export interface Stats {
  totalThreats: number
  activeIncidents: number
  assetsMonitored: number
  riskScore: number
}

export interface ChartDataPoint {
  day: string
  threats: number
  blocked: number
}

export interface ThreatTypeCount {
  name: string
  value: number
  color: string
}

export interface LiveThreat {
  id: string
  type: string
  source: string
  timestamp: string
  severity: Severity
}

export interface Notification {
  id: string
  title: string
  message: string
  read: boolean
  timestamp: string
}

export interface ApiKey {
  id: string
  name: string
  key: string
  created: string
  lastUsed: string
  status: 'Active' | 'Revoked'
}
