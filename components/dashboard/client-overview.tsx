"use client"

import { useState } from "react"
import {
  Users, Zap, CheckCircle2, TrendingUp, ArrowUpRight, ArrowDownRight,
  MessageSquare, DollarSign, Bot, Star, Activity, Calendar,
} from "lucide-react"

/* ─── Sparkline ─────────────────────────────────────────────────────────── */
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1
  const h = 40, w = 120, step = w / (data.length - 1)
  const pts = data.map((v, i) => `${i * step},${h - ((v - min) / range) * h}`)
  const pathD = `M ${pts.join(" L ")}`
  const areaD = `M ${pts[0]} L ${pts.join(" L ")} L ${w},${h} L 0,${h} Z`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: 40 }}>
      <defs>
        <linearGradient id={`sg-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#sg-${color.replace("#", "")})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 3px ${color}80)` }} />
      <circle
        cx={(data.length - 1) * step}
        cy={h - ((data[data.length - 1] - min) / range) * h}
        r={2.5} fill={color} style={{ filter: `drop-shadow(0 0 4px ${color})` }}
      />
    </svg>
  )
}

/* ─── Ring Gauge ─────────────────────────────────────────────────────────── */
function RingGauge({ pct, color, size = 52 }: { pct: number; color: string; size?: number }) {
  const r = (size - 8) / 2, circ = 2 * Math.PI * r
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={5} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={5}
        strokeDasharray={circ} strokeDashoffset={circ - (pct / 100) * circ} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)", filter: `drop-shadow(0 0 4px ${color}80)` }}
      />
    </svg>
  )
}

/* ─── Stat Card ──────────────────────────────────────────────────────────── */
interface CardData {
  label: string; sublabel: string; value: string; trend: number; trendLabel: string
  icon: React.ElementType; color: string; rgb: string; pct: number; sparkline: number[]
  badge?: string; subMetrics?: { label: string; value: string }[]
}

function StatCard({ card }: { card: CardData }) {
  const [hovered, setHovered] = useState(false)
  const Icon = card.icon
  const isUp = card.trend >= 0
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-2xl p-5 overflow-hidden cursor-pointer transition-all duration-300 animate-fade-in-up"
      style={{
        background: hovered
          ? `linear-gradient(145deg, rgba(${card.rgb},0.14) 0%, rgba(13,20,33,0.95) 100%)`
          : "rgba(13,20,33,0.8)",
        border: hovered ? `1px solid rgba(${card.rgb},0.35)` : "1px solid rgba(255,255,255,0.07)",
        boxShadow: hovered ? `0 0 0 1px rgba(${card.rgb},0.12), 0 12px 40px rgba(0,0,0,0.5)` : "0 4px 24px rgba(0,0,0,0.3)",
        backdropFilter: "blur(16px)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
      }}
    >
      {/* Glow blob */}
      <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full pointer-events-none transition-opacity duration-300"
        style={{ background: `radial-gradient(circle, ${card.color}, transparent 70%)`, opacity: hovered ? 0.15 : 0.07 }} />

      {card.badge && (
        <span className="absolute top-4 right-4 text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md"
          style={{ background: `rgba(${card.rgb},0.15)`, color: card.color, border: `1px solid rgba(${card.rgb},0.25)` }}>
          {card.badge}
        </span>
      )}

      <div className="relative z-10">
        {/* Icon + Ring */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300"
            style={{
              background: `rgba(${card.rgb},0.12)`, border: `1px solid rgba(${card.rgb},0.22)`,
              boxShadow: hovered ? `0 0 14px rgba(${card.rgb},0.25)` : "none"
            }}>
            <Icon className="h-5 w-5" style={{ color: card.color }} />
          </div>
          <div className="relative flex items-center justify-center">
            <RingGauge pct={card.pct} color={card.color} />
            <span className="absolute text-[9px] font-black" style={{ color: card.color }}>{card.pct}%</span>
          </div>
        </div>

        {/* Value */}
        <p className="text-[2rem] font-black text-white tracking-tight leading-none mb-0.5">{card.value}</p>
        <p className="text-sm font-semibold text-slate-300 mb-0.5">{card.label}</p>
        <p className="text-[11px] text-slate-500 mb-4">{card.sublabel}</p>

        {/* Sparkline */}
        <div className="mb-3"><Sparkline data={card.sparkline} color={card.color} /></div>

        {/* Divider */}
        <div className="h-px mb-3" style={{ background: `rgba(${card.rgb},0.15)` }} />

        {/* Trend */}
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold"
            style={isUp
              ? { background: "rgba(52,211,153,0.12)", color: "#34D399", border: "1px solid rgba(52,211,153,0.25)" }
              : { background: "rgba(248,113,113,0.12)", color: "#F87171", border: "1px solid rgba(248,113,113,0.25)" }}>
            {isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {isUp ? "+" : ""}{card.trend}%
          </span>
          <span className="text-[11px] text-slate-600 text-right leading-tight">{card.trendLabel}</span>
        </div>

        {/* Sub-metrics */}
        {card.subMetrics && (
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/[0.05]">
            {card.subMetrics.map((m) => (
              <div key={m.label}>
                <p className="text-[10px] text-slate-600">{m.label}</p>
                <p className="text-xs font-bold text-white">{m.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Data ───────────────────────────────────────────────────────────────── */
const CARDS: CardData[] = [
  {
    icon: MessageSquare, label: "Total Conversations", sublabel: "Across all clients · Feb 2026",
    value: "124,530", trend: 12.5, trendLabel: "+3,420 vs last month",
    color: "#6366F1", rgb: "99,102,241", pct: 83, badge: "LIVE",
    sparkline: [45, 62, 58, 71, 83, 76, 91, 88, 95, 101, 108, 115],
    subMetrics: [{ label: "Avg/day", value: "4,161" }, { label: "Peak day", value: "Fri" }],
  },
  {
    icon: Users, label: "Active Clients", sublabel: "Managed accounts · Feb 2026",
    value: "47", trend: 8.2, trendLabel: "+4 new this month",
    color: "#22D3EE", rgb: "34,211,238", pct: 94,
    sparkline: [32, 36, 38, 37, 40, 41, 43, 44, 45, 46, 47, 47],
    subMetrics: [{ label: "Trial", value: "5" }, { label: "Enterprise", value: "12" }],
  },
  {
    icon: DollarSign, label: "Revenue Managed", sublabel: "Chatbot-attributed · Feb 2026",
    value: "$94,820", trend: 18.7, trendLabel: "+$14,930 vs last month",
    color: "#34D399", rgb: "52,211,153", pct: 78, badge: "↑ TOP",
    sparkline: [55, 68, 72, 80, 77, 88, 92, 96, 100, 104, 109, 118],
    subMetrics: [{ label: "Avg LTV", value: "$2.0K" }, { label: "MRR", value: "$31.6K" }],
  },
  {
    icon: TrendingUp, label: "Conversion Rate", sublabel: "Avg across all bots · Feb 2026",
    value: "24.8%", trend: 3.2, trendLabel: "+0.8 pts vs last month",
    color: "#EC4899", rgb: "236,72,153", pct: 24.8,
    sparkline: [60, 65, 63, 70, 68, 74, 72, 78, 80, 77, 82, 85],
    subMetrics: [{ label: "Benchmark", value: "18%" }, { label: "Delta", value: "+6.8 pts" }],
  },
  {
    icon: Bot, label: "AI Resolution Rate", sublabel: "Resolved without escalation",
    value: "91.4%", trend: 2.1, trendLabel: "+2.1% vs last month",
    color: "#FBBF24", rgb: "251,191,36", pct: 91,
    sparkline: [75, 78, 80, 82, 81, 84, 87, 89, 91, 90, 92, 93],
    subMetrics: [{ label: "Escalated", value: "8.6%" }, { label: "Human", value: "~1.1K" }],
  },
  {
    icon: Star, label: "Client Satisfaction", sublabel: "Avg CSAT across accounts",
    value: "4.8 / 5", trend: 0.4, trendLabel: "+0.4 vs last month",
    color: "#A78BFA", rgb: "167,139,250", pct: 96, badge: "★ HIGH",
    sparkline: [40, 42, 45, 43, 47, 46, 48, 47, 48, 49, 48, 50],
    subMetrics: [{ label: "NPS Score", value: "+68" }, { label: "Reviews", value: "3.2K" }],
  },
]

/* ─── AI Insight Banner ─────────────────────────────────────────────────── */
function InsightBanner() {
  return (
    <div
      className="rounded-2xl p-5 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-fade-in"
      style={{
        background: "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(34,211,238,0.06) 100%)",
        border: "1px solid rgba(99,102,241,0.2)",
      }}
    >
      <div className="absolute -top-6 -right-6 h-28 w-28 rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #6366F1, transparent)" }} />
      <div className="flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0"
        style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)" }}>
        <Activity className="h-5 w-5 text-indigo-400" />
      </div>
      <div className="flex-1 min-w-0 relative z-10">
        <p className="text-sm font-bold text-white mb-0.5">AI Insight — February 2026</p>
        <p className="text-xs text-slate-400 leading-relaxed">
          Revenue grew <span className="text-emerald-400 font-semibold">+18.7%</span> this month — highest in 12 months.
          Client satisfaction hit <span className="text-indigo-300 font-semibold">4.8/5</span>. Consider scaling capacity on
          Fridays — conversion is <span className="text-amber-400 font-semibold">32% higher</span> than weekdays.
        </p>
      </div>
      <button
        className="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
        style={{ background: "linear-gradient(135deg, #6366F1, #A78BFA)", boxShadow: "0 4px 12px rgba(99,102,241,0.35)" }}
      >
        View Full Report
      </button>
    </div>
  )
}

/* ─── Comparison Table ───────────────────────────────────────────────────── */
const CMP = [
  { metric: "Total Conversations", thisM: "124,530", lastM: "111,110", change: +12.5, unit: "%" },
  { metric: "Active Clients", thisM: "47", lastM: "43", change: +9.3, unit: "" },
  { metric: "Revenue Managed", thisM: "$94,820", lastM: "$79,890", change: +18.7, unit: "%" },
  { metric: "Conversion Rate", thisM: "24.8%", lastM: "24.0%", change: +0.8, unit: " pts" },
  { metric: "AI Resolution Rate", thisM: "91.4%", lastM: "89.3%", change: +2.1, unit: "%" },
  { metric: "Client Satisfaction", thisM: "4.8 / 5", lastM: "4.4 / 5", change: +0.4, unit: "" },
]

function ComparisonTable() {
  return (
    <div className="rounded-2xl overflow-hidden animate-fade-in"
      style={{ background: "rgba(13,20,33,0.8)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-slate-500" />
          <h3 className="text-sm font-bold text-white">Month-over-Month Comparison</h3>
        </div>
        <span className="text-xs text-slate-500">Jan 2026 → Feb 2026</span>
      </div>
      <div className="grid grid-cols-4 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-600 border-b border-white/[0.04]">
        <span>Metric</span><span className="text-center">This Month</span>
        <span className="text-center">Last Month</span><span className="text-right">Change</span>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {CMP.map((row, i) => {
          const isUp = row.change >= 0
          const card = CARDS[i]
          return (
            <div key={row.metric} className="grid grid-cols-4 px-6 py-3.5 items-center hover:bg-white/[0.02] transition-colors group">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg flex-shrink-0"
                  style={{ background: `rgba(${card.rgb},0.1)`, border: `1px solid rgba(${card.rgb},0.2)` }}>
                  <card.icon className="h-3.5 w-3.5" style={{ color: card.color }} />
                </div>
                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors truncate">{row.metric}</span>
              </div>
              <span className="text-sm font-bold text-white text-center">{row.thisM}</span>
              <span className="text-sm text-slate-500 text-center">{row.lastM}</span>
              <div className="flex justify-end">
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg"
                  style={isUp
                    ? { background: "rgba(52,211,153,0.1)", color: "#34D399", border: "1px solid rgba(52,211,153,0.2)" }
                    : { background: "rgba(248,113,113,0.1)", color: "#F87171", border: "1px solid rgba(248,113,113,0.2)" }}>
                  {isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {isUp ? "+" : ""}{row.change}{row.unit}
                </span>
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 py-4 border-t border-white/[0.05] bg-white/[0.01]">
        <p className="text-xs text-slate-600">Updated at 14:32 IST · Next update in 48s</p>
        <div className="flex items-center gap-5">
          {[
            { label: "Avg Growth", value: "+7.7%", color: "#34D399" },
            { label: "Top Metric", value: "Revenue", color: "#6366F1" },
            { label: "Health Score", value: "96/100", color: "#A78BFA" },
          ].map((k) => (
            <div key={k.label} className="text-right">
              <p className="text-[10px] text-slate-600">{k.label}</p>
              <p className="text-xs font-bold" style={{ color: k.color }}>{k.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Main ───────────────────────────────────────────────────────────────── */
export function ClientOverview() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("30d")
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Client Overview</h2>
          <p className="text-sm text-slate-400 mt-0.5">Real-time performance snapshot of your AI chatbot agency.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="inline-flex rounded-xl p-1 gap-1"
            style={{ background: "rgba(13,20,33,0.8)", border: "1px solid rgba(255,255,255,0.07)" }}>
            {(["7d", "30d", "90d"] as const).map((p) => (
              <button key={p} onClick={() => setPeriod(p)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all duration-200"
                style={period === p
                  ? { background: "linear-gradient(135deg,#6366F1,#A78BFA)", color: "#fff", boxShadow: "0 2px 8px rgba(99,102,241,0.35)" }
                  : { color: "#677393" }}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 6 Stat Cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 stagger">
        {CARDS.map((card) => <StatCard key={card.label} card={card} />)}
      </div>

      {/* AI Insight Banner */}
      <InsightBanner />

      {/* Comparison Table */}
      <ComparisonTable />
    </div>
  )
}
