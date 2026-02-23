"use client"

import { useState } from "react"
import { Download, Lightbulb, Globe, Brain, MessageCircle, TrendingUp, ArrowUpRight, Star, BarChart2, Search, Shield } from "lucide-react"

/* ─── Data ─────────────────────────────────────────────────────────────── */
const CAMPAIGNS = [
  { name: "Post-Purchase Upsell Bot", leads: 521, conversion: "31%", roi: "410%", color: "#34D399", rgb: "52,211,153" },
  { name: "Appointment Booking Agent", leads: 284, conversion: "22%", roi: "340%", color: "#6366F1", rgb: "99,102,241" },
  { name: "Lead Nurturing Campaign", leads: 196, conversion: "18%", roi: "280%", color: "#22D3EE", rgb: "34,211,238" },
  { name: "Customer Support Bot", leads: 32, conversion: "14%", roi: "210%", color: "#FBBF24", rgb: "251,191,36" },
]

const QUERIES = [
  { query: "How do I schedule an appointment?", count: 342, resolution: "98%", trend: +12 },
  { query: "What are your pricing options?", count: 287, resolution: "95%", trend: +5 },
  { query: "Can I cancel my subscription?", count: 156, resolution: "100%", trend: -3 },
  { query: "How do I reset my password?", count: 143, resolution: "99%", trend: +8 },
  { query: "Is there a mobile app?", count: 119, resolution: "96%", trend: +14 },
]

const GEO = [
  { region: "North America", calls: 1240, leads: 245, pct: 56, color: "#6366F1" },
  { region: "Europe", calls: 580, leads: 98, pct: 26, color: "#22D3EE" },
  { region: "Asia Pacific", calls: 390, leads: 69, pct: 18, color: "#34D399" },
]

const AI_METRICS = [
  { label: "Intent Recognition", pct: 94, color: "#6366F1", rgb: "99,102,241" },
  { label: "Response Quality", pct: 92, color: "#22D3EE", rgb: "34,211,238" },
  { label: "User Satisfaction", pct: 89, color: "#34D399", rgb: "52,211,153" },
  { label: "Slot Fill Rate", pct: 85, color: "#A78BFA", rgb: "167,139,250" },
  { label: "Fallback Rate (low=good)", pct: 6, color: "#F87171", rgb: "248,113,113", invert: true },
]

/* ─── Gauge bar ─────────────────────────────────────────────────────────── */
function GaugeBar({ label, pct, color, rgb, invert }: { label: string; pct: number; color: string; rgb: string; invert?: boolean }) {
  const display = invert ? `${pct}%` : `${pct}%`
  const goodColor = invert ? (pct < 10 ? "#34D399" : "#F87171") : (pct >= 90 ? "#34D399" : pct >= 75 ? "#FBBF24" : "#F87171")
  const barColor = invert ? (pct < 10 ? "#34D399" : "#F87171") : color
  return (
    <div className="rounded-xl p-4 transition-all hover:bg-white/[0.02]"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-medium text-slate-400">{label}</span>
        <span className="text-sm font-black" style={{ color: goodColor }}>{display}</span>
      </div>
      <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
        <div className="h-full rounded-full transition-all duration-1000"
          style={{
            width: `${invert ? Math.max(pct * 10, 4) : pct}%`,
            background: `linear-gradient(90deg,${barColor},${barColor}80)`,
            boxShadow: `0 0 8px ${barColor}50`,
          }} />
      </div>
    </div>
  )
}

/* ─── Main ──────────────────────────────────────────────────────────────── */
export function InsightsReports() {
  const [searchQ, setSearchQ] = useState("")
  const filteredQ = QUERIES.filter(q => q.query.toLowerCase().includes(searchQ.toLowerCase()))

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Insights & Reports</h2>
          <p className="text-sm text-slate-400 mt-0.5">Deep-dive analytics on campaigns, queries and AI accuracy.</p>
        </div>
        <button
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
          style={{ background: "linear-gradient(135deg,#6366F1,#A78BFA)", boxShadow: "0 4px 14px rgba(99,102,241,0.4)" }}
        >
          <Download className="h-4 w-4" /> Export Report
        </button>
      </div>

      {/* Top campaigns */}
      <div className="rounded-2xl overflow-hidden animate-fade-in"
        style={{ background: "rgba(13,20,33,0.8)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>
        <div className="flex items-center gap-2 px-6 py-4 border-b border-white/[0.06]">
          <TrendingUp className="h-4 w-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-white">Top Performing Campaigns</h3>
          <span className="ml-auto text-[11px] text-slate-500">Feb 2026</span>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {CAMPAIGNS.map((c, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors group cursor-pointer">
              <span className="text-2xl font-black w-7 flex-shrink-0 text-center"
                style={{ color: i === 0 ? "#FBBF24" : i === 1 ? "#A8A8B3" : i === 2 ? "#CD7F32" : "#64748B" }}>
                {i + 1}
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0"
                style={{ background: `rgba(${c.rgb},0.1)`, border: `1px solid rgba(${c.rgb},0.2)` }}>
                <BarChart2 className="h-4 w-4" style={{ color: c.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white group-hover:text-white transition-colors">{c.name}</p>
                <p className="text-[11px] text-slate-500">{c.leads.toLocaleString()} leads generated</p>
              </div>
              <div className="hidden sm:flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm font-bold" style={{ color: c.color }}>{c.conversion}</p>
                  <p className="text-[10px] text-slate-600">Conversion</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-indigo-400">{c.roi}</p>
                  <p className="text-[10px] text-slate-600">ROI</p>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-slate-700 group-hover:text-slate-400 transition-colors flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Queries + Geo */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Common queries */}
        <div className="rounded-2xl p-6 animate-fade-in"
          style={{ background: "rgba(13,20,33,0.8)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Most Common Queries</h3>
          </div>
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-600" />
            <input
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              placeholder="Filter queries..."
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs text-slate-300 placeholder:text-slate-600 outline-none focus:border-indigo-500/40 transition-colors"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            />
          </div>
          <div className="space-y-2">
            {filteredQ.map((item, i) => (
              <div key={i} className="flex items-start justify-between gap-3 p-3 rounded-xl group hover:bg-white/[0.02] transition-all cursor-pointer"
                style={{ border: "1px solid rgba(255,255,255,0.04)" }}>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-slate-300 group-hover:text-white transition-colors leading-snug">{item.query}</p>
                  <p className="text-[10px] text-slate-600 mt-0.5">{item.count.toLocaleString()} queries</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold"
                    style={{ background: "rgba(52,211,153,0.1)", color: "#34D399", border: "1px solid rgba(52,211,153,0.2)" }}>
                    {item.resolution}
                  </span>
                  <span className="text-[10px]" style={{ color: item.trend > 0 ? "#34D399" : "#F87171" }}>
                    {item.trend > 0 ? "+" : ""}{item.trend}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geo insights */}
        <div className="rounded-2xl p-6 animate-fade-in"
          style={{ background: "rgba(13,20,33,0.8)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>
          <div className="flex items-center gap-2 mb-5">
            <Globe className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Geographical Breakdown</h3>
          </div>
          <div className="space-y-5">
            {GEO.map((g, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-white">{g.region}</p>
                    <p className="text-[11px] text-slate-500">{g.calls.toLocaleString()} conversations · {g.leads} leads</p>
                  </div>
                  <span className="text-sm font-black" style={{ color: g.color }}>{g.pct}%</span>
                </div>
                <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${g.pct}%`, background: g.color, boxShadow: `0 0 8px ${g.color}60` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Funnel summary */}
          <div className="mt-6 pt-5 border-t border-white/[0.05] space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-600 mb-3">Funnel Summary · Global</p>
            {[
              { label: "Total Conversations", value: "2,210", icon: MessageCircle, color: "#6366F1" },
              { label: "Leads Captured", value: "412", icon: Star, color: "#FBBF24" },
              { label: "Converted to Sale", value: "76", icon: TrendingUp, color: "#34D399" },
            ].map(f => (
              <div key={f.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <f.icon className="h-3.5 w-3.5" style={{ color: f.color }} />
                  <span className="text-xs text-slate-400">{f.label}</span>
                </div>
                <span className="text-sm font-bold text-white">{f.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Accuracy */}
      <div className="rounded-2xl p-6 animate-fade-in"
        style={{ background: "rgba(13,20,33,0.8)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>
        <div className="flex items-center gap-2 mb-5">
          <Brain className="h-4 w-4 text-violet-400" />
          <h3 className="text-sm font-bold text-white">AI Accuracy & Model Metrics</h3>
          <span className="ml-auto inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold"
            style={{ background: "rgba(99,102,241,0.1)", color: "#A78BFA", border: "1px solid rgba(99,102,241,0.2)" }}>
            <Shield className="h-3 w-3" /> Model v2.5 · GPT-4o
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {AI_METRICS.map(m => (
            <GaugeBar key={m.label} label={m.label} pct={m.pct} color={m.color} rgb={m.rgb} invert={m.invert} />
          ))}
        </div>
        <p className="text-[11px] text-slate-600 mt-4">Metrics computed over 124,530 conversations · Feb 2026</p>
      </div>
    </div>
  )
}
