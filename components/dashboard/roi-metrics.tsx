"use client"

import { useState } from "react"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"
import { TrendingUp, DollarSign, Clock, Target, Award, ChevronRight, ArrowUpRight, Sparkles, Rocket } from "lucide-react"

/* ─── Data ───────────────────────────────────────────────────────────────── */
const roiData = [
  { month: "Aug", revenue: 45000, savings: 12000, cost: 8000 },
  { month: "Sep", revenue: 52000, savings: 14500, cost: 8000 },
  { month: "Oct", revenue: 61000, savings: 17200, cost: 9000 },
  { month: "Nov", revenue: 73000, savings: 20100, cost: 9500 },
  { month: "Dec", revenue: 85000, savings: 23500, cost: 9500 },
  { month: "Jan", revenue: 79890, savings: 21000, cost: 9500 },
  { month: "Feb", revenue: 94820, savings: 27000, cost: 9800 },
]

const ACHIEVEMENTS = [
  { title: "100K+ Conversations", sub: "Milestone reached · May 2025", color: "#34D399", rgb: "52,211,153" },
  { title: "50% Efficiency Gain", sub: "Vs. manual agent processes", color: "#6366F1", rgb: "99,102,241" },
  { title: "95% CSAT Score", sub: "Based on 3,200+ surveys", color: "#A78BFA", rgb: "167,139,250" },
  { title: "$27K Monthly Savings", sub: "Automation vs. human cost", color: "#22D3EE", rgb: "34,211,238" },
  { title: "340% Overall ROI", sub: "6-month average return", color: "#EC4899", rgb: "236,72,153" },
]

const KPI_CARDS = [
  { label: "Revenue Influenced", sublabel: "Chatbot-attributed", value: "$94,820", trend: "+18.7%", icon: DollarSign, color: "#34D399", rgb: "52,211,153" },
  { label: "Hours Saved", sublabel: "~$62K value created", value: "1,240 hrs", trend: "+22%", icon: Clock, color: "#22D3EE", rgb: "34,211,238" },
  { label: "Cost per Lead", sublabel: "Down from $11.02", value: "$7.28", trend: "-34%", icon: Target, color: "#A78BFA", rgb: "167,139,250" },
  { label: "Overall ROI", sublabel: "6-month average", value: "340%", trend: "+45 pts", icon: TrendingUp, color: "#EC4899", rgb: "236,72,153" },
]

/* ─── Tooltip ─────────────────────────────────────────────────────────────── */
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl px-4 py-3 text-xs space-y-1.5"
      style={{ background: "#0D1828", border: "1px solid rgba(99,102,241,0.25)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
      <p className="font-bold text-slate-300 mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center justify-between gap-6">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
            <span className="text-slate-500 capitalize">{p.name}</span>
          </span>
          <span className="font-bold text-white">${p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}

/* ─── KPI Card ────────────────────────────────────────────────────────────── */
function KpiCard({ card }: { card: typeof KPI_CARDS[0] }) {
  const [hov, setHov] = useState(false)
  const Icon = card.icon
  const isPositive = !card.trend.startsWith("-")
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
        style={{ background: `radial-gradient(circle,${card.color},transparent 70%)`, opacity: hov ? 0.14 : 0.06 }} />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl"
            style={{ background: `rgba(${card.rgb},0.12)`, border: `1px solid rgba(${card.rgb},0.22)`, boxShadow: hov ? `0 0 14px rgba(${card.rgb},0.25)` : "none" }}>
            <Icon className="h-5 w-5" style={{ color: card.color }} />
          </div>
          <span className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold"
            style={isPositive
              ? { background: "rgba(52,211,153,0.12)", color: "#34D399", border: "1px solid rgba(52,211,153,0.2)" }
              : { background: "rgba(248,113,113,0.12)", color: "#F87171", border: "1px solid rgba(248,113,113,0.2)" }}>
            <ArrowUpRight className="h-3 w-3" /> {card.trend}
          </span>
        </div>
        <p className="text-[2rem] font-black text-white tracking-tight leading-none mb-0.5">{card.value}</p>
        <p className="text-sm font-semibold text-slate-300">{card.label}</p>
        <p className="text-[11px] text-slate-600">{card.sublabel}</p>
      </div>
    </div>
  )
}

/* ─── Main ────────────────────────────────────────────────────────────────── */
export function ROIMetrics() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">ROI & Impact Metrics</h2>
          <p className="text-sm text-slate-400 mt-0.5">Measure the financial value of your AI automation investments.</p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold"
          style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", color: "#A78BFA" }}>
          <Sparkles className="h-3.5 w-3.5" /> Live · Feb 2026
        </div>
      </div>

      {/* 4 KPI cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4 stagger">
        {KPI_CARDS.map(c => <KpiCard key={c.label} card={c} />)}
      </div>

      {/* Area chart */}
      <div className="rounded-2xl overflow-hidden animate-fade-in"
        style={{ background: "rgba(13,20,33,0.8)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Revenue, Savings & Cost Trend</h3>
          </div>
          <div className="flex items-center gap-4">
            {[
              { label: "Revenue", color: "#6366F1" },
              { label: "Savings", color: "#34D399" },
              { label: "Cost", color: "#F87171" },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full" style={{ background: l.color }} />
                <span className="text-[11px] text-slate-500">{l.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-6">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={roiData}>
              <defs>
                <linearGradient id="roiRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="roiSav" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34D399" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="roiCost" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F87171" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#F87171" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" stroke="#475569" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#475569" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={2} fill="url(#roiRev)" dot={false} />
              <Area type="monotone" dataKey="savings" stroke="#34D399" strokeWidth={2} fill="url(#roiSav)" dot={false} />
              <Area type="monotone" dataKey="cost" stroke="#F87171" strokeWidth={1.5} fill="url(#roiCost)" dot={false} strokeDasharray="4 3" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Achievements */}
        <div className="rounded-2xl p-6 animate-fade-in"
          style={{ background: "rgba(13,20,33,0.8)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>
          <div className="flex items-center gap-2 mb-5">
            <Award className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Key Achievements</h3>
          </div>
          <div className="space-y-3">
            {ACHIEVEMENTS.map((a, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl group cursor-pointer transition-all hover:bg-white/[0.025]"
                style={{ border: "1px solid rgba(255,255,255,0.04)" }}>
                <div className="h-9 w-9 flex items-center justify-center rounded-lg flex-shrink-0"
                  style={{ background: `rgba(${a.rgb},0.1)`, border: `1px solid rgba(${a.rgb},0.2)` }}>
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: a.color, boxShadow: `0 0 6px ${a.color}` }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white">{a.title}</p>
                  <p className="text-[11px] text-slate-500">{a.sub}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-700 group-hover:text-slate-400 transition-colors flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* 6-month forecast */}
        <div className="rounded-2xl p-6 animate-fade-in relative overflow-hidden"
          style={{ background: "linear-gradient(145deg, rgba(99,102,241,0.12) 0%, rgba(13,20,33,0.95) 100%)", border: "1px solid rgba(99,102,241,0.22)", backdropFilter: "blur(16px)" }}>
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,#6366F1,transparent 70%)", opacity: 0.12 }} />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-5">
              <Rocket className="h-4 w-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Projected Impact — Next 6 Months</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: "Estimated Revenue Influenced", value: "$180,000+", color: "#34D399" },
                { label: "Projected Cost Savings", value: "$45,000+", color: "#22D3EE" },
                { label: "Expected Net ROI", value: "450%+", color: "#A78BFA" },
                { label: "Additional Leads Projected", value: "3,600+", color: "#EC4899" },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between gap-4 p-3 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <p className="text-xs text-slate-400">{item.label}</p>
                  <p className="text-lg font-black" style={{ color: item.color }}>{item.value}</p>
                </div>
              ))}
            </div>
            <button className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#6366F1,#A78BFA)", boxShadow: "0 4px 14px rgba(99,102,241,0.4)" }}>
              <Sparkles className="h-4 w-4" /> Generate Full Forecast Report
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
