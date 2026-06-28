import { create } from 'zustand'
import type {
  Threat,
  Asset,
  AuditLog,
  AlertRule,
  Incident,
  Notification,
  ApiKey,
  LiveThreat,
} from '@/types'

interface AppState {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void

  threats: Threat[]
  setThreats: (threats: Threat[]) => void
  updateThreatStatus: (id: string, status: 'Active' | 'Resolved' | 'Dismissed') => void

  assets: Asset[]
  setAssets: (assets: Asset[]) => void

  auditLogs: AuditLog[]
  setAuditLogs: (logs: AuditLog[]) => void

  alertRules: AlertRule[]
  setAlertRules: (rules: AlertRule[]) => void
  toggleAlertRule: (id: string) => void
  addAlertRule: (rule: AlertRule) => void

  incidents: Incident[]
  setIncidents: (incidents: Incident[]) => void

  notifications: Notification[]
  addNotification: (notification: Notification) => void
  markNotificationRead: (id: string) => void
  unreadCount: number

  apiKeys: ApiKey[]
  setApiKeys: (keys: ApiKey[]) => void
  addApiKey: (key: ApiKey) => void
  revokeApiKey: (id: string) => void

  liveThreats: LiveThreat[]
  addLiveThreat: (threat: LiveThreat) => void
}

export const useStore = create<AppState>((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  threats: [],
  setThreats: (threats) => set({ threats }),
  updateThreatStatus: (id, status) =>
    set((s) => ({
      threats: s.threats.map((t) => (t.id === id ? { ...t, status } : t)),
    })),

  assets: [],
  setAssets: (assets) => set({ assets }),

  auditLogs: [],
  setAuditLogs: (logs) => set({ auditLogs: logs }),

  alertRules: [],
  setAlertRules: (rules) => set({ alertRules: rules }),
  toggleAlertRule: (id) =>
    set((s) => ({
      alertRules: s.alertRules.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)),
    })),
  addAlertRule: (rule) => set((s) => ({ alertRules: [rule, ...s.alertRules] })),

  incidents: [],
  setIncidents: (incidents) => set({ incidents }),

  notifications: [],
  addNotification: (notification) =>
    set((s) => ({ notifications: [notification, ...s.notifications] })),
  markNotificationRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),
  get unreadCount() {
    return 0
  },

  apiKeys: [],
  setApiKeys: (keys) => set({ apiKeys: keys }),
  addApiKey: (key) => set((s) => ({ apiKeys: [key, ...s.apiKeys] })),
  revokeApiKey: (id) =>
    set((s) => ({
      apiKeys: s.apiKeys.map((k) => (k.id === id ? { ...k, status: 'Revoked' } : k)),
    })),

  liveThreats: [],
  addLiveThreat: (threat) =>
    set((s) => ({ liveThreats: [threat, ...s.liveThreats].slice(0, 50) })),
}))

export const useUnreadCount = () =>
  useStore((s) => s.notifications.filter((n) => !n.read).length)
