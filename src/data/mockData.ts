import type {
  Threat,
  Asset,
  AuditLog,
  AlertRule,
  Incident,
  ChartDataPoint,
  ThreatTypeCount,
  LiveThreat,
  Notification,
  ApiKey,
} from '@/types'

const SEVERITIES = ['Critical', 'High', 'Medium', 'Low'] as const
const THREAT_TYPES = ['Malware', 'Phishing', 'DDoS', 'Ransomware', 'Insider'] as const
const ASSET_TYPES = ['Server', 'Endpoint', 'Database'] as const
const ASSET_STATUSES = ['Secure', 'Vulnerable', 'At Risk'] as const

function rand<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function daysAgo(n: number): string {
  const d = new Date(Date.now() - n * 86400000)
  return d.toISOString()
}

const threatDescriptions = [
  'Suspicious outbound connection detected',
  'Unauthorized access attempt blocked',
  'Malicious payload detected in attachment',
  'Credential harvesting attempt detected',
  'Ransomware variant identified in sandbox',
  'DNS tunneling activity observed',
  'Brute force attack on SSH port',
  'Data exfiltration attempt blocked',
  'Zero-day exploit attempt detected',
  'Privilege escalation attempt on server',
]

export const mockThreats: Threat[] = Array.from({ length: 47 }, (_, i) => ({
  id: `THR-${String(i + 1).padStart(4, '0')}`,
  type: rand(THREAT_TYPES),
  description: threatDescriptions[i % threatDescriptions.length],
  severity: rand(SEVERITIES),
  status: i < 30 ? 'Active' : i < 40 ? 'Resolved' : 'Dismissed',
  source: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
  destination: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
  timestamp: daysAgo(i),
  assignedTo: i % 3 === 0 ? 'Alice Chen' : i % 3 === 1 ? 'Bob Martinez' : 'Carol Davis',
  timeline: [
    { time: daysAgo(i), action: 'Detected', detail: 'Threat detected by SIEM sensor' },
    { time: daysAgo(i - 0.01), action: 'Analyzed', detail: 'Automated analysis complete' },
    { time: daysAgo(i - 0.02), action: i < 30 ? 'Pending' : 'Resolved', detail: i < 30 ? 'Awaiting review' : 'Remediation applied' },
  ],
}))

export const mockAssets: Asset[] = [
  { id: 'AST-001', name: 'prod-web-01', type: 'Server', status: 'Secure', ip: '10.0.1.10', os: 'Ubuntu 22.04', riskScore: 12, lastScan: daysAgo(0), vulnerabilities: 2 },
  { id: 'AST-002', name: 'prod-db-master', type: 'Database', status: 'Vulnerable', ip: '10.0.2.5', os: 'Debian 11', riskScore: 68, lastScan: daysAgo(1), vulnerabilities: 7 },
  { id: 'AST-003', name: 'dev-app-01', type: 'Server', status: 'At Risk', ip: '10.0.3.15', os: 'CentOS 9', riskScore: 82, lastScan: daysAgo(0), vulnerabilities: 14 },
  { id: 'AST-004', name: 'hr-endpoint-12', type: 'Endpoint', status: 'Secure', ip: '192.168.1.45', os: 'Windows 11', riskScore: 8, lastScan: daysAgo(2), vulnerabilities: 1 },
  { id: 'AST-005', name: 'finance-db-slave', type: 'Database', status: 'Secure', ip: '10.0.2.6', os: 'PostgreSQL 15', riskScore: 15, lastScan: daysAgo(0), vulnerabilities: 3 },
  { id: 'AST-006', name: 'eng-laptop-23', type: 'Endpoint', status: 'Vulnerable', ip: '192.168.2.88', os: 'macOS 14', riskScore: 55, lastScan: daysAgo(3), vulnerabilities: 5 },
  { id: 'AST-007', name: 'staging-api-01', type: 'Server', status: 'Secure', ip: '10.0.4.20', os: 'Ubuntu 24.04', riskScore: 22, lastScan: daysAgo(1), vulnerabilities: 4 },
  { id: 'AST-008', name: 'analytics-cluster', type: 'Server', status: 'At Risk', ip: '10.0.5.30', os: 'Rocky Linux 9', riskScore: 91, lastScan: daysAgo(0), vulnerabilities: 21 },
  { id: 'AST-009', name: 'marketing-endpoint-05', type: 'Endpoint', status: 'Secure', ip: '192.168.1.102', os: 'Windows 11', riskScore: 5, lastScan: daysAgo(1), vulnerabilities: 0 },
  { id: 'AST-010', name: 'redis-cache-01', type: 'Database', status: 'Vulnerable', ip: '10.0.6.12', os: 'Redis 7', riskScore: 45, lastScan: daysAgo(2), vulnerabilities: 6 },
  { id: 'AST-011', name: 'prod-web-02', type: 'Server', status: 'Secure', ip: '10.0.1.11', os: 'Ubuntu 22.04', riskScore: 18, lastScan: daysAgo(0), vulnerabilities: 2 },
  { id: 'AST-012', name: 'ci-runner-01', type: 'Server', status: 'Vulnerable', ip: '10.0.7.50', os: 'Debian 12', riskScore: 60, lastScan: daysAgo(1), vulnerabilities: 9 },
]

export const mockAuditLogs: AuditLog[] = Array.from({ length: 35 }, (_, i) => ({
  id: `LOG-${String(i + 1).padStart(4, '0')}`,
  user: rand(['Alice Chen', 'Bob Martinez', 'Carol Davis', 'System', 'Admin']),
  action: rand(['Login', 'Logout', 'Threat Resolved', 'Alert Created', 'Alert Disabled', 'Rule Updated', 'API Key Generated', 'Settings Changed', 'Export', 'Bulk Action']),
  resource: rand(['/threats', '/assets', '/settings', '/alerts', '/logs', '/overview', 'API']),
  timestamp: daysAgo(i * 0.5),
  ipAddress: `192.168.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 255)}`,
  details: rand(['User logged in from remote location', 'Bulk threat resolution executed', 'New alert rule created', 'API key revoked', 'Export completed successfully', '2FA setting toggled']),
}))

export const mockAlertRules: AlertRule[] = [
  { id: 'RLE-001', name: 'Brute Force Detection', description: 'Triggers when >10 failed login attempts in 5 minutes', severity: 'Critical', condition: 'failed_logins > 10 in 5m', channel: 'Slack', enabled: true, createdAt: daysAgo(30) },
  { id: 'RLE-002', name: 'Malware Signature Match', description: 'Known malware signature detected in network traffic', severity: 'Critical', condition: 'signature_match = true', channel: 'Email', enabled: true, createdAt: daysAgo(28) },
  { id: 'RLE-003', name: 'Unusual Outbound Traffic', description: 'Outbound traffic exceeds 1GB in 1 hour', severity: 'High', condition: 'outbound > 1GB in 1h', channel: 'SMS', enabled: true, createdAt: daysAgo(25) },
  { id: 'RLE-004', name: 'New Admin Account', description: 'New administrative account created', severity: 'High', condition: 'admin_account_created', channel: 'Slack', enabled: false, createdAt: daysAgo(20) },
  { id: 'RLE-005', name: 'Vulnerability Scan Complete', description: 'Scheduled vulnerability scan completed with findings', severity: 'Medium', condition: 'scan_completed && vulns > 0', channel: 'Email', enabled: true, createdAt: daysAgo(15) },
  { id: 'RLE-006', name: 'SSL Certificate Expiry', description: 'SSL certificate expires within 7 days', severity: 'Medium', condition: 'cert_expiry < 7d', channel: 'Email', enabled: true, createdAt: daysAgo(10) },
  { id: 'RLE-007', name: 'Data Exfiltration Attempt', description: 'Sensitive data transfer to external IP', severity: 'Critical', condition: 'sensitive_data_external', channel: 'Webhook', enabled: true, createdAt: daysAgo(7) },
  { id: 'RLE-008', name: 'Low Disk Space', description: 'Disk usage exceeds 90% on any server', severity: 'Low', condition: 'disk_usage > 90%', channel: 'Slack', enabled: false, createdAt: daysAgo(5) },
]

export const mockIncidents: Incident[] = [
  { id: 'INC-001', title: 'Ransomware detected on prod-web-01', severity: 'Critical', type: 'Ransomware', timestamp: daysAgo(0.1), status: 'Investigating' },
  { id: 'INC-002', title: 'Phishing campaign targeting finance team', severity: 'High', type: 'Phishing', timestamp: daysAgo(0.3), status: 'Active' },
  { id: 'INC-003', title: 'DDoS attack on API gateway', severity: 'Critical', type: 'DDoS', timestamp: daysAgo(0.5), status: 'Mitigating' },
  { id: 'INC-004', title: 'Insider data access anomaly', severity: 'Medium', type: 'Insider', timestamp: daysAgo(1), status: 'Investigating' },
  { id: 'INC-005', title: 'Malware outbreak on endpoint devices', severity: 'High', type: 'Malware', timestamp: daysAgo(1.5), status: 'Active' },
  { id: 'INC-006', title: 'SQL injection attempt on finance-db', severity: 'Medium', type: 'Phishing', timestamp: daysAgo(2), status: 'Resolved' },
  { id: 'INC-007', title: 'Zero-day exploit in analytics server', severity: 'Critical', type: 'Malware', timestamp: daysAgo(2.5), status: 'Active' },
  { id: 'INC-008', title: 'Credential stuffing on VPN gateway', severity: 'Low', type: 'Phishing', timestamp: daysAgo(3), status: 'Resolved' },
]

export const mockChartData: ChartDataPoint[] = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  threats: Math.floor(Math.random() * 80) + 20,
  blocked: Math.floor(Math.random() * 60) + 10,
}))

export const mockThreatTypeDistribution: ThreatTypeCount[] = [
  { name: 'Malware', value: 185, color: '#ef4444' },
  { name: 'Phishing', value: 142, color: '#f97316' },
  { name: 'DDoS', value: 98, color: '#eab308' },
  { name: 'Ransomware', value: 67, color: '#dc2626' },
  { name: 'Insider', value: 43, color: '#a855f7' },
]

const threatSources = [
  '45.33.32.156 (DigitalOcean)',
  '185.220.101.42 (Tor Exit)',
  '91.121.87.34 (OVH)',
  '103.235.46.10 (Alibaba)',
  '198.98.50.30 (BuyVM)',
  '5.255.88.100 (Yandex)',
  '192.168.1.100 (Internal)',
  '10.0.1.50 (DMZ Host)',
]

const threatTypes = ['Malware', 'Phishing', 'DDoS', 'Ransomware', 'Insider', 'Brute Force', 'XSS', 'SQLi']

export function generateLiveThreat(): LiveThreat {
  return {
    id: `THR-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    type: rand(threatTypes),
    source: rand(threatSources),
    timestamp: new Date().toISOString(),
    severity: rand(SEVERITIES),
  }
}

export const mockNotifications: Notification[] = [
  { id: 'NTF-001', title: 'Critical Threat Detected', message: 'Ransomware signature detected on prod-web-01', read: false, timestamp: daysAgo(0.01) },
  { id: 'NTF-002', title: 'Asset Scan Complete', message: 'Vulnerability scan finished for 12 assets', read: false, timestamp: daysAgo(0.05) },
  { id: 'NTF-003', title: 'Alert Rule Triggered', message: 'Brute Force Detection rule fired 3 times', read: false, timestamp: daysAgo(0.1) },
  { id: 'NTF-004', title: 'API Key Expiring', message: 'API key "Production Monitor" expires in 7 days', read: true, timestamp: daysAgo(1) },
  { id: 'NTF-005', title: 'Bulk Action Completed', message: '5 threats resolved in bulk operation', read: true, timestamp: daysAgo(2) },
  { id: 'NTF-006', title: 'System Update Available', message: 'Security agent v3.2.1 is ready to install', read: false, timestamp: daysAgo(2.5) },
]

export const mockApiKeys: ApiKey[] = [
  { id: 'KEY-001', name: 'Production Monitor', key: 'vs_sk_prod_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p', created: daysAgo(90), lastUsed: daysAgo(0.5), status: 'Active' },
  { id: 'KEY-002', name: 'Staging API', key: 'vs_sk_stag_b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q', created: daysAgo(45), lastUsed: daysAgo(1), status: 'Active' },
  { id: 'KEY-003', name: 'Dev Integration', key: 'vs_sk_dev_c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r', created: daysAgo(120), lastUsed: daysAgo(30), status: 'Revoked' },
]
