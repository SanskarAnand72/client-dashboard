"use client"

import { useState } from "react"
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts"
import { MessageSquare, Users, Timer, TrendingUp, ArrowUpRight, ArrowDownRight, BarChart3, Activity } from "lucide-react"

/* ─── Data ──────────────────────────────────────────────────────────────── */
const weeklyData = [
  { day: "Mon", calls: 240, leads: 45, aov: 3200 },
  { day: "Tue", calls: 320, leads: 58, aov: 3750 },
  { day: "Wed", calls: 280, leads: 52, aov: 3100 },
  { day: "Thu", calls: 390, leads: 72, aov: 4200 },
  { day: "Fri", calls: 450, leads: 85, aov: 4900 },
  { day: "Sat", calls: 320, leads: 62, aov: 3600 },
  { day: "Sun", calls: 210, leads: 38, aov: 2800 },
]

const monthlyTrend = [
  { month: "Aug", conversations: 82000, revenue: 61000 },
  { month: "Sep", conversations: 91000, revenue: 68000 },
  { month: "Oct", conversations: 97000, revenue: 74000 },
  { month: "Nov", conversations: 108000, revenue: 81000 },
  { month: "Dec", conversations: 115000, revenue: 88000 },
  { month: "Jan", conversations: 111110, revenue: 79890 },
  { month: "Feb", conversations: 124530, revenue: 94820 },
]

const agentPerf = [
  { name: "Upsell Bot", value: 35, color: "#6366F1" },
  { name: "Lead Nurture", value: 28, color: "#22D3EE" },
  { name: "Support Bot", value: 22, color: "#34D399" },
  { name: "Sales Agent", value: 15, color: "#EC4899" },
]

/* ─── Tooltip ────────────────────────────────────────────────────────────── */
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl px-4 py-3 text-xs space-y-1"
      style={{ background: "#0D1828", border: "1px solid rgba(99,102,241,0.25)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
      <p className="font-bold text-slate-300 mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center justify-between gap-6">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
            <span className="text-slate-500 capitalize">{p.name}</span>
          </span>
          <span className="font-bold text-white">{typeof p.value === "number" && p.value > 1000 ? p.value.toLocaleString() : p.value}</span>
        </div>
      ))}
    </div>
  )
}

/* ─── Stat Card ──────────────────────────────────────────────────────────── */
const STAT_CARDS = [
  { label: "Total Calls", sublabel: "This week", value: "2,210", trend: 12, icon: MessageSquare, color: "#6366F1", rgb: "99,102,241" },
  { label: "Leads Generated", sublabel: "This week", value: "412", trend: 8, icon: Users, color: "#22D3EE", rgb: "34,211,238" },
  { label: "Avg Response", sublabel: "AI latency", value: "1.2s", trend: -0.3, icon: Timer, color: "#34D399", rgb: "52,211,153", down_good: true },
  { label: "Conversion Rate", sublabel: "Avg all bots", value: "18.6%", trend: 2.1, icon: TrendingUp, color: "#EC4899", rgb: "236,72,153" },
]

function StatCard({ card }: { card: typeof STAT_CARDS[0] }) {
  const [hov, setHov] = useState(false)
  const Icon = card.icon
  const isPositive = card.down_good ? card.trend < 0 : card.trend >= 0
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="relative rounded-2xl p-5 overflow-hidden cursor-pointer transition-all duration-300 animate-fade-in-up"
      style={{
        background: hov ? `linear-gradient(145deg,rgba(${card.rgb},0.12),rgba(13,20,33,0.95))` : "rgba(13,20,33,0.8)",
        border: hov ? `1px solid rgba(${card.rgb},0.35)` : "1px solid rgba(255,255,255,0.07)",
        boxShadow: hov ? `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(${card.rgb},0.1)` : "0 4px 20px rgba(0,0,0,0.25)",
        backdropFilter: "blur(16px)",
        transform: hov ? "translateY(-2px)" : "none",
      }}
    >
      <div className="absolute -top-6 -right-6 h-28 w-28 rounded-full pointer-events-none transition-opacity duration-300"
        style={{ background: `radial-gradient(circle,${card.color},transparent 70%)`, opacity: hov ? 0.12 : 0.05 }} />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl"
            style={{ background: `rgba(${card.rgb},0.12)`, border: `1px solid rgba(${card.rgb},0.22)`, boxShadow: hov ? `0 0 14px rgba(${card.rgb},0.25)` : "none" }}>
            <Icon className="h-5 w-5" style={{ color: card.color }} />
          </div>
          <span className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold`}
            style={isPositive
              ? { background: "rgba(52,211,153,0.12)", color: "#34D399", border: "1px solid rgba(52,211,153,0.2)" }
              : { background: "rgba(248,113,113,0.12)", color: "#F87171", border: "1px solid rgba(248,113,113,0.2)" }}>
            {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(card.trend)}{typeof card.trend === "number" && !Number.isInteger(card.trend) ? "" : "%"}
          </span>
        </div>
        <p className="text-[2rem] font-black text-white tracking-tight leading-none mb-0.5">{card.value}</p>
        <p className="text-sm font-semibold text-slate-300">{card.label}</p>
        <p className="text-[11px] text-slate-600">{card.sublabel}</p>
      </div>
    </div>
  )
}

/* ─── Custom Legend ──────────────────────────────────────────────────────── */
function CustomLegend({ payload }: any) {
  return (
    <div className="flex flex-wrap gap-3 justify-center mt-2">
      {payload?.map((e: any) => (
        <div key={e.value} className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full" style={{ background: e.color }} />
          <span className="text-[11px] text-slate-400">{e.value}</span>
        </div>
      ))}
    </div>
  )
}

/* ─── Progress bar ───────────────────────────────────────────────────────── */
function ProgressBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-medium text-slate-400">{label}</span>
        <span className="text-xs font-bold text-white">{pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
        <div className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg,${color},${color}80)`, boxShadow: `0 0 6px ${color}60` }} />
      </div>
    </div>
  )
}

/* ─── Main ───────────────────────────────────────────────────────────────── */
export function UsageAnalytics() {
  const [tab, setTab] = useState<"weekly" | "monthly">("weekly")

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Usage Analytics</h2>
          <p className="text-sm text-slate-400 mt-0.5">Deep-dive into chatbot performance and engagement data.</p>
        </div>
        <div className="inline-flex rounded-xl p-1 gap-1" style={{ background: "rgba(13,20,33,0.8)", border: "1px solid rgba(255,255,255,0.07)" }}>
          {(["weekly", "monthly"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all duration-200 capitalize"
              style={tab === t
                ? { background: "linear-gradient(135deg,#6366F1,#A78BFA)", color: "#fff", boxShadow: "0 2px 8px rgba(99,102,241,0.35)" }
                : { color: "#677393" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4 stagger">
        {STAT_CARDS.map(c => <StatCard key={c.label} card={c} />)}
      </div>

      {/* Main chart */}
      <div className="rounded-2xl overflow-hidden animate-fade-in"
        style={{ background: "rgba(13,20,33,0.8)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">{tab === "weekly" ? "Weekly Activity" : "Monthly Trend"}</h3>
          </div>
          <div className="flex items-center gap-4">
            {tab === "weekly"
              ? [{ label: "Calls", color: "#6366F1" }, { label: "Leads", color: "#22D3EE" }].map(l => (
                <div key={l.label} className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full" style={{ background: l.color }} /><span className="text-[11px] text-slate-500">{l.label}</span></div>
              ))
              : [{ label: "Conversations", color: "#6366F1" }, { label: "Revenue ($)", color: "#34D399" }].map(l => (
                <div key={l.label} className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full" style={{ background: l.color }} /><span className="text-[11px] text-slate-500">{l.label}</span></div>
              ))
            }
          </div>
        </div>
        <div className="p-6">
          <ResponsiveContainer width="100%" height={280}>
            {tab === "weekly" ? (
              <BarChart data={weeklyData} barGap={4}>
                <defs>
                  <linearGradient id="barCalls" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" /><stop offset="100%" stopColor="#6366F180" />
                  </linearGradient>
                  <linearGradient id="barLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22D3EE" /><stop offset="100%" stopColor="#22D3EE80" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" stroke="#475569" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#475569" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)", radius: 6 }} />
                <Bar dataKey="calls" fill="url(#barCalls)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="leads" fill="url(#barLeads)" radius={[6, 6, 0, 0]} />
              </BarChart>
            ) : (
              <AreaChart data={monthlyTrend}>
                <defs>
                  <linearGradient id="areaConv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} /><stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="areaRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34D399" stopOpacity={0.3} /><stop offset="95%" stopColor="#34D399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" stroke="#475569" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#475569" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="conversations" stroke="#6366F1" strokeWidth={2} fill="url(#areaConv)" dot={false} />
                <Area type="monotone" dataKey="revenue" stroke="#34D399" strokeWidth={2} fill="url(#areaRev)" dot={false} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row: pie + performance */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Pie chart */}
        <div className="rounded-2xl p-6 animate-fade-in"
          style={{ background: "rgba(13,20,33,0.8)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>
          <div className="flex items-center gap-2 mb-5">
            <Activity className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Agent Performance Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={agentPerf} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                {agentPerf.map((entry, i) => (
                  <Cell key={i} fill={entry.color} style={{ filter: `drop-shadow(0 0 6px ${entry.color}60)` }} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* AI performance metrics */}
        <div className="rounded-2xl p-6 animate-fade-in"
          style={{ background: "rgba(13,20,33,0.8)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>
          <div className="flex items-center gap-2 mb-5">
            <Activity className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">AI Model Performance</h3>
          </div>
          <div className="space-y-5">
            <ProgressBar label="Intent Recognition Accuracy" pct={94} color="#6366F1" />
            <ProgressBar label="Response Quality Score" pct={92} color="#22D3EE" />
            <ProgressBar label="Customer Satisfaction Rate" pct={89} color="#34D399" />
            <ProgressBar label="First-Contact Resolution" pct={85} color="#EC4899" />
            <ProgressBar label="Out-of-Scope Deflection" pct={78} color="#FBBF24" />
          </div>
          <div className="mt-5 pt-4 border-t border-white/[0.05] flex items-center justify-between">
            <span className="text-xs text-slate-600">Updated at 14:30 IST</span>
            <span className="text-xs font-bold text-indigo-400">Model v2.5 · GPT-4o</span>
          </div>
        </div>
      </div>
    </div>
  )
}
