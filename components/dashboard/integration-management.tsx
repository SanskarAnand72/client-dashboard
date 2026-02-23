"use client"

import { useState } from "react"
import { Plus, Trash2, AlertCircle, RefreshCw, Check, Search, Plug, Zap, Calendar, MessageCircle, BarChart2, Phone, Slack, Database, Mail } from "lucide-react"

/* ─── Data ─────────────────────────────────────────────────────────────── */
interface Integration {
  name: string
  description: string
  status: "Active" | "Failed" | "Pending"
  lastSync: string
  icon: React.ElementType
  color: string
  rgb: string
}

const INTEGRATIONS: Integration[] = [
  { name: "Google Calendar", description: "Appointment scheduling & event creation", status: "Active", lastSync: "5 min ago", icon: Calendar, color: "#34D399", rgb: "52,211,153" },
  { name: "Salesforce CRM", description: "Lead sync, contact management", status: "Active", lastSync: "2 hours ago", icon: Database, color: "#22D3EE", rgb: "34,211,238" },
  { name: "WhatsApp Business", description: "Chat deployment & messaging", status: "Active", lastSync: "10 min ago", icon: MessageCircle, color: "#6366F1", rgb: "99,102,241" },
  { name: "Twilio", description: "SMS / voice call automation", status: "Active", lastSync: "1 hour ago", icon: Phone, color: "#A78BFA", rgb: "167,139,250" },
  { name: "Slack", description: "Team notifications & alert routing", status: "Failed", lastSync: "Token expired", icon: Slack, color: "#F87171", rgb: "248,113,113" },
  { name: "HubSpot", description: "Contact & pipeline synchronization", status: "Pending", lastSync: "Awaiting approval", icon: BarChart2, color: "#FBBF24", rgb: "251,191,36" },
]

const AVAILABLE = [
  { name: "Zapier", icon: Zap, desc: "Connect to 5,000+ apps" },
  { name: "Make (Integromat)", icon: RefreshCw, desc: "Visual automation builder" },
  { name: "Microsoft Teams", icon: MessageCircle, desc: "Team messaging" },
  { name: "Discord", icon: MessageCircle, desc: "Community notifications" },
  { name: "Mailchimp", icon: Mail, desc: "Email marketing sync" },
  { name: "Notion", icon: Database, desc: "Knowledge base & CRM" },
]

/* ─── Status helpers ─────────────────────────────────────────────────────── */
const STATUS_STYLES: Record<string, { bg: string; border: string; color: string; dot: string }> = {
  Active: { bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.25)", color: "#34D399", dot: "#34D399" },
  Failed: { bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.25)", color: "#F87171", dot: "#F87171" },
  Pending: { bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.25)", color: "#FBBF24", dot: "#FBBF24" },
}

/* ─── Integration row ───────────────────────────────────────────────────── */
function IntegrationRow({ item }: { item: Integration }) {
  const [hov, setHov] = useState(false)
  const Icon = item.icon
  const st = STATUS_STYLES[item.status]
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-all group cursor-pointer"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl flex-shrink-0 transition-all duration-300"
        style={{
          background: `rgba(${item.rgb},0.1)`,
          border: `1px solid rgba(${item.rgb},0.2)`,
          boxShadow: hov ? `0 0 14px rgba(${item.rgb},0.2)` : "none",
        }}>
        <Icon className="h-5 w-5" style={{ color: item.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">{item.name}</p>
        <p className="text-[11px] text-slate-600">{item.description}</p>
      </div>
      <div className="hidden sm:block text-right mr-4">
        <p className="text-[11px] text-slate-600">Last sync</p>
        <p className="text-xs font-medium text-slate-400">{item.lastSync}</p>
      </div>
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold flex-shrink-0"
        style={{ background: st.bg, border: `1px solid ${st.border}`, color: st.color }}>
        <span className="h-1.5 w-1.5 rounded-full flex-shrink-0"
          style={{ background: st.dot, boxShadow: item.status === "Active" ? `0 0 4px ${st.dot}` : "none" }} />
        {item.status}
      </span>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {item.status === "Failed" ? (
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:opacity-90"
            style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", color: "#A78BFA" }}>
            <RefreshCw className="h-3 w-3" /> Reconnect
          </button>
        ) : item.status === "Pending" ? (
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:opacity-90"
            style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)", color: "#FBBF24" }}>
            <AlertCircle className="h-3 w-3" /> Approve
          </button>
        ) : (
          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/[0.08] transition-all">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}

/* ─── Main ──────────────────────────────────────────────────────────────── */
export function IntegrationManagement() {
  const [search, setSearch] = useState("")
  const active = INTEGRATIONS.filter(i => i.status === "Active").length
  const failed = INTEGRATIONS.filter(i => i.status === "Failed").length
  const filtered = INTEGRATIONS.filter(i => i.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Integration Management</h2>
          <p className="text-sm text-slate-400 mt-0.5">Connect your tools and automate data flows across your stack.</p>
        </div>
        <button
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
          style={{ background: "linear-gradient(135deg,#6366F1,#A78BFA)", boxShadow: "0 4px 14px rgba(99,102,241,0.4)" }}
        >
          <Plus className="h-4 w-4" /> Add Integration
        </button>
      </div>

      {/* Summary pills */}
      <div className="flex flex-wrap gap-3 animate-fade-in">
        {[
          { label: "Total", value: INTEGRATIONS.length, color: "#6366F1", rgb: "99,102,241" },
          { label: "Active", value: active, color: "#34D399", rgb: "52,211,153" },
          { label: "Failed", value: failed, color: "#F87171", rgb: "248,113,113" },
          { label: "Pending", value: INTEGRATIONS.length - active - failed, color: "#FBBF24", rgb: "251,191,36" },
        ].map(p => (
          <div key={p.label} className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl"
            style={{ background: `rgba(${p.rgb},0.08)`, border: `1px solid rgba(${p.rgb},0.2)` }}>
            <span className="text-xl font-black" style={{ color: p.color }}>{p.value}</span>
            <span className="text-xs font-medium text-slate-400">{p.label}</span>
          </div>
        ))}
      </div>

      {/* Connected list */}
      <div className="rounded-2xl overflow-hidden animate-fade-in"
        style={{ background: "rgba(13,20,33,0.8)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Plug className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Connected Integrations</h3>
          </div>
          <div className="relative sm:ml-auto w-full sm:w-56">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-600" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search integrations..."
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs text-slate-300 placeholder:text-slate-600 outline-none transition-colors"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            />
          </div>
        </div>
        {filtered.map(item => <IntegrationRow key={item.name} item={item} />)}
        {filtered.length === 0 && (
          <div className="py-12 text-center text-slate-600 text-sm">No integrations found.</div>
        )}
      </div>

      {/* Failed alert banner */}
      {failed > 0 && (
        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl animate-fade-in"
          style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.2)" }}>
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-400/80">
            <strong className="text-red-400">{failed} integration{failed > 1 ? "s" : ""}</strong> need attention — reconnect to restore data sync.
          </p>
          <button className="ml-auto text-xs font-bold px-3 py-1.5 rounded-lg flex-shrink-0 transition-all hover:opacity-90"
            style={{ background: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.25)", color: "#F87171" }}>
            Fix Now
          </button>
        </div>
      )}

      {/* Available integrations */}
      <div className="rounded-2xl p-6 animate-fade-in"
        style={{ background: "rgba(13,20,33,0.8)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>
        <div className="flex items-center gap-2 mb-5">
          <Zap className="h-4 w-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white">Available Integrations</h3>
          <span className="ml-auto text-[11px] text-slate-500">Click to connect</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {AVAILABLE.map(a => (
            <button
              key={a.name}
              className="flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-200 group hover:border-indigo-500/30"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0 transition-all group-hover:scale-110"
                style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>
                <a.icon className="h-4 w-4 text-indigo-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">{a.name}</p>
                <p className="text-[10px] text-slate-600">{a.desc}</p>
              </div>
              <Plus className="h-4 w-4 text-slate-700 group-hover:text-indigo-400 transition-colors flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
