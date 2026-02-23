"use client"

import { useState } from "react"
import { AlertTriangle, AlertCircle, Info, CheckCircle2, Bell, X, Settings, BellOff, Zap, Clock, Filter } from "lucide-react"

/* ─── Data ─────────────────────────────────────────────────────────────── */
type AlertType = "warning" | "error" | "success" | "info"

const ALERTS = [
  {
    id: 1, type: "warning" as AlertType,
    title: "Plan Usage at 85%",
    message: "Your API calls are at 8,500/10,000. Consider upgrading your plan to avoid throttling during peak hours.",
    time: "2 hours ago", icon: AlertTriangle, dismissed: false,
  },
  {
    id: 2, type: "error" as AlertType,
    title: "Slack Integration Failed",
    message: "OAuth token has expired. Reconnect under Integrations to restore real-time notifications.",
    time: "5 hours ago", icon: AlertCircle, dismissed: false,
  },
  {
    id: 3, type: "success" as AlertType,
    title: "AI Model Updated to v2.5",
    message: "Upgraded to GPT-4o — intent recognition improved by 4.2%. No action required.",
    time: "1 day ago", icon: CheckCircle2, dismissed: false,
  },
  {
    id: 4, type: "info" as AlertType,
    title: "Scheduled Maintenance Window",
    message: "System maintenance this Sunday 2:00–4:00 AM EST. Short downtime (<5 min) expected.",
    time: "2 days ago", icon: Info, dismissed: false,
  },
  {
    id: 5, type: "success" as AlertType,
    title: "Salesforce CRM Connected",
    message: "Your Salesforce integration successfully synced 412 new leads to the CRM pipeline.",
    time: "3 days ago", icon: CheckCircle2, dismissed: false,
  },
  {
    id: 6, type: "info" as AlertType,
    title: "New Feature: Live Handoff",
    message: "You can now configure live agent escalation thresholds in each bot's settings panel.",
    time: "5 days ago", icon: Zap, dismissed: false,
  },
]

const TYPE_STYLES: Record<AlertType, { bg: string; border: string; icon: string; badge: string; badgeBorder: string; label: string }> = {
  warning: { bg: "rgba(251,191,36,0.07)", border: "rgba(251,191,36,0.22)", icon: "#FBBF24", badge: "rgba(251,191,36,0.12)", badgeBorder: "rgba(251,191,36,0.25)", label: "Warning" },
  error: { bg: "rgba(248,113,113,0.07)", border: "rgba(248,113,113,0.22)", icon: "#F87171", badge: "rgba(248,113,113,0.12)", badgeBorder: "rgba(248,113,113,0.25)", label: "Error" },
  success: { bg: "rgba(52,211,153,0.07)", border: "rgba(52,211,153,0.22)", icon: "#34D399", badge: "rgba(52,211,153,0.12)", badgeBorder: "rgba(52,211,153,0.25)", label: "Success" },
  info: { bg: "rgba(34,211,238,0.07)", border: "rgba(34,211,238,0.22)", icon: "#22D3EE", badge: "rgba(34,211,238,0.12)", badgeBorder: "rgba(34,211,238,0.25)", label: "Info" },
}

const PREFS = [
  { id: "usage", label: "Usage Alerts", sub: "Notify when usage reaches 80%", on: true },
  { id: "agent", label: "Agent Status Alerts", sub: "Notify when agents go offline", on: true },
  { id: "system", label: "System Updates", sub: "New features and maintenance notices", on: true },
  { id: "reports", label: "Weekly Reports", sub: "Performance summaries every Monday", on: true },
  { id: "billing", label: "Billing Alerts", sub: "Invoice and payment notifications", on: false },
]

/* ─── Toggle ─────────────────────────────────────────────────────────────── */
function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className="relative h-6 w-11 rounded-full transition-all duration-300 flex-shrink-0"
      style={{ background: on ? "linear-gradient(135deg,#6366F1,#A78BFA)" : "rgba(255,255,255,0.08)", boxShadow: on ? "0 0 10px rgba(99,102,241,0.4)" : "none" }}
    >
      <span
        className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300"
        style={{ left: on ? "calc(100% - 22px)" : "2px" }}
      />
    </button>
  )
}

/* ─── Main ──────────────────────────────────────────────────────────────── */
export function NotificationsAlerts() {
  const [alerts, setAlerts] = useState(ALERTS)
  const [prefs, setPrefs] = useState(PREFS)
  const [filter, setFilter] = useState<"all" | AlertType>("all")

  const dismiss = (id: number) => setAlerts(prev => prev.filter(a => a.id !== id))
  const togglePref = (id: string) => setPrefs(prev => prev.map(p => p.id === id ? { ...p, on: !p.on } : p))
  const shown = filter === "all" ? alerts : alerts.filter(a => a.type === filter)

  const counts = {
    warning: alerts.filter(a => a.type === "warning").length,
    error: alerts.filter(a => a.type === "error").length,
    success: alerts.filter(a => a.type === "success").length,
    info: alerts.filter(a => a.type === "info").length,
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Notifications & Alerts</h2>
          <p className="text-sm text-slate-400 mt-0.5">Stay up-to-date with real-time alerts across your AI platform.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:bg-white/[0.05] text-slate-500 hover:text-slate-200"
            style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
            <BellOff className="h-3.5 w-3.5" /> Mark all read
          </button>
        </div>
      </div>

      {/* Summary badges */}
      <div className="flex flex-wrap gap-3 animate-fade-in">
        {(["all", "error", "warning", "success", "info"] as const).map(f => {
          const cnt = f === "all" ? alerts.length : counts[f]
          const st = f !== "all" ? TYPE_STYLES[f] : null
          return (
            <button key={f} onClick={() => setFilter(f)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 capitalize"
              style={filter === f
                ? { background: st ? st.badge : "rgba(99,102,241,0.15)", border: `1px solid ${st ? st.badgeBorder : "rgba(99,102,241,0.3)"}`, color: st ? st.icon : "#A78BFA" }
                : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "#64748B" }}>
              <Filter className="h-3 w-3" />
              {f === "all" ? "All" : f} {cnt > 0 && <span className="ml-1 h-4 w-4 flex items-center justify-center rounded-full text-[9px]" style={{ background: st ? st.badge : "rgba(99,102,241,0.15)", color: st ? st.icon : "#A78BFA" }}>{cnt}</span>}
            </button>
          )
        })}
      </div>

      {/* Alert list */}
      <div className="space-y-3 animate-fade-in">
        {shown.length === 0 && (
          <div className="text-center py-16 text-slate-600">
            <Bell className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No alerts in this category.</p>
          </div>
        )}
        {shown.map(alert => {
          const Icon = alert.icon
          const st = TYPE_STYLES[alert.type]
          return (
            <div key={alert.id}
              className="relative flex items-start gap-4 px-5 py-4 rounded-2xl transition-all duration-300 animate-fade-in-up group"
              style={{ background: st.bg, border: `1px solid ${st.border}`, backdropFilter: "blur(10px)" }}>
              {/* Type indicator strip */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-10 rounded-r-full flex-shrink-0"
                style={{ background: st.icon, boxShadow: `0 0 6px ${st.icon}` }} />
              <div className="flex h-9 w-9 items-center justify-center rounded-xl flex-shrink-0"
                style={{ background: st.badge, border: `1px solid ${st.badgeBorder}` }}>
                <Icon className="h-4 w-4" style={{ color: st.icon }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-bold text-white">{alert.title}</p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg"
                      style={{ background: st.badge, color: st.icon, border: `1px solid ${st.badgeBorder}` }}>
                      {st.label}
                    </span>
                    <button onClick={() => dismiss(alert.id)}
                      className="h-6 w-6 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-300 hover:bg-white/[0.06] transition-all opacity-0 group-hover:opacity-100">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{alert.message}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <Clock className="h-3 w-3 text-slate-600" />
                  <span className="text-[10px] text-slate-600">{alert.time}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Preferences */}
      <div className="rounded-2xl overflow-hidden animate-fade-in"
        style={{ background: "rgba(13,20,33,0.8)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>
        <div className="flex items-center gap-2 px-6 py-4 border-b border-white/[0.06]">
          <Settings className="h-4 w-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-white">Alert Preferences</h3>
          <span className="ml-auto text-[11px] text-slate-500">{prefs.filter(p => p.on).length}/{prefs.length} enabled</span>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {prefs.map(pref => (
            <div key={pref.id} className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors">
              <div>
                <p className="text-sm font-semibold text-slate-300">{pref.label}</p>
                <p className="text-xs text-slate-600 mt-0.5">{pref.sub}</p>
              </div>
              <Toggle on={pref.on} onChange={() => togglePref(pref.id)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
