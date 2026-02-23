"use client"

import { useState } from "react"
import {
    AreaChart, Area, BarChart, Bar, LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell,
} from "recharts"
import {
    MessageSquare, Clock, ThumbsUp, Zap,
    TrendingUp, ArrowUpRight, Sparkles, Activity,
    Star, Users, CheckCircle2, AlertCircle,
} from "lucide-react"

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  DATA  ━━━━━━━━━━ */

/** Total conversations — monthly */
const CONV_TREND = [
    { month: "Sep", conversations: 1840, resolved: 1520, escalated: 140 },
    { month: "Oct", conversations: 2105, resolved: 1780, escalated: 158 },
    { month: "Nov", conversations: 2480, resolved: 2140, escalated: 186 },
    { month: "Dec", conversations: 3020, resolved: 2650, escalated: 220 },
    { month: "Jan", conversations: 2760, resolved: 2410, escalated: 198 },
    { month: "Feb", conversations: 3340, resolved: 2980, escalated: 214 },
]

/** Avg response time trend (seconds) */
const RESP_TREND = [
    { month: "Sep", responseTime: 4.8 },
    { month: "Oct", responseTime: 4.1 },
    { month: "Nov", responseTime: 3.6 },
    { month: "Dec", responseTime: 3.2 },
    { month: "Jan", responseTime: 2.9 },
    { month: "Feb", responseTime: 2.4 },
]

/** CSAT trend (%) */
const CSAT_TREND = [
    { month: "Sep", csat: 74, promoters: 52, detractors: 14 },
    { month: "Oct", csat: 77, promoters: 56, detractors: 12 },
    { month: "Nov", csat: 80, promoters: 60, detractors: 10 },
    { month: "Dec", csat: 83, promoters: 64, detractors: 9 },
    { month: "Jan", csat: 85, promoters: 66, detractors: 8 },
    { month: "Feb", csat: 88, promoters: 70, detractors: 7 },
]

/** Peak usage — hourly conversation volume (0–23h) */
const PEAK_USAGE = [
    { hour: "12am", volume: 48 },
    { hour: "1am", volume: 22 },
    { hour: "2am", volume: 14 },
    { hour: "3am", volume: 9 },
    { hour: "4am", volume: 11 },
    { hour: "5am", volume: 19 },
    { hour: "6am", volume: 52 },
    { hour: "7am", volume: 98 },
    { hour: "8am", volume: 148 },
    { hour: "9am", volume: 204 },
    { hour: "10am", volume: 248 },
    { hour: "11am", volume: 282 },
    { hour: "12pm", volume: 310 },
    { hour: "1pm", volume: 294 },
    { hour: "2pm", volume: 268 },
    { hour: "3pm", volume: 241 },
    { hour: "4pm", volume: 256 },
    { hour: "5pm", volume: 288 },
    { hour: "6pm", volume: 320 },
    { hour: "7pm", volume: 348 },
    { hour: "8pm", volume: 362 },
    { hour: "9pm", volume: 330 },
    { hour: "10pm", volume: 240 },
    { hour: "11pm", volume: 124 },
]
const PEAK_MAX = Math.max(...PEAK_USAGE.map(d => d.volume))

/** CSAT breakdown */
const CSAT_BREAKDOWN = [
    { label: "😍  Excellent (5★)", pct: 48, count: 1603, color: "#34D399" },
    { label: "😊  Good (4★)", pct: 22, count: 735, color: "#6366F1" },
    { label: "😐  Neutral (3★)", pct: 18, count: 601, color: "#FBBF24" },
    { label: "😕  Poor (2★)", pct: 8, count: 267, color: "#F97316" },
    { label: "😡  Bad (1★)", pct: 4, count: 134, color: "#F87171" },
]

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Tooltips  ━━━━━━━━ */
function ConvTip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null
    const d = CONV_TREND.find(m => m.month === label)
    return (
        <div className="rounded-xl px-4 py-3 text-xs min-w-[180px]"
            style={{ background: "#0A1120", border: "1px solid rgba(99,102,241,0.3)", boxShadow: "0 12px 40px rgba(0,0,0,0.6)" }}>
            <p className="font-bold text-white mb-2">{label}</p>
            <div className="space-y-1.5">
                <div className="flex justify-between gap-6"><span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-indigo-400" /><span className="text-slate-500">Total</span></span><span className="font-bold text-white">{d?.conversations.toLocaleString()}</span></div>
                <div className="flex justify-between gap-6"><span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-400" /><span className="text-slate-500">Resolved</span></span><span className="font-bold text-emerald-400">{d?.resolved.toLocaleString()}</span></div>
                <div className="flex justify-between gap-6"><span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-400" /><span className="text-slate-500">Escalated</span></span><span className="font-bold text-red-400">{d?.escalated}</span></div>
            </div>
        </div>
    )
}

function PeakTip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null
    return (
        <div className="rounded-xl px-3 py-2 text-xs"
            style={{ background: "#0A1120", border: "1px solid rgba(236,72,153,0.3)", boxShadow: "0 8px 32px rgba(0,0,0,0.6)" }}>
            <p className="font-bold text-white">{label}</p>
            <p className="text-pink-400 font-bold mt-0.5">{payload[0]?.value} conversations</p>
        </div>
    )
}

function CsatTip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null
    const d = CSAT_TREND.find(m => m.month === label)
    return (
        <div className="rounded-xl px-4 py-3 text-xs min-w-[160px]"
            style={{ background: "#0A1120", border: "1px solid rgba(52,211,153,0.3)", boxShadow: "0 12px 40px rgba(0,0,0,0.6)" }}>
            <p className="font-bold text-white mb-2">{label}</p>
            <div className="space-y-1.5">
                <div className="flex justify-between gap-6"><span className="text-slate-500">CSAT</span><span className="font-bold text-emerald-400">{d?.csat}%</span></div>
                <div className="flex justify-between gap-6"><span className="text-slate-500">Promoters</span><span className="font-bold text-white">{d?.promoters}%</span></div>
                <div className="flex justify-between gap-6"><span className="text-slate-500">Detractors</span><span className="font-bold text-red-400">{d?.detractors}%</span></div>
            </div>
        </div>
    )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Main  ━━━━━━━━━ */
export function EngagementMetrics() {
    const [convMode, setConvMode] = useState<"area" | "bar">("area")

    const feb = CONV_TREND[CONV_TREND.length - 1]
    const jan = CONV_TREND[CONV_TREND.length - 2]
    const convMoM = (((feb.conversations - jan.conversations) / jan.conversations) * 100).toFixed(0)
    const resRate = ((feb.resolved / feb.conversations) * 100).toFixed(0)

    const latestResp = RESP_TREND[RESP_TREND.length - 1].responseTime
    const firstResp = RESP_TREND[0].responseTime
    const respImprove = (((firstResp - latestResp) / firstResp) * 100).toFixed(0)

    const latestCsat = CSAT_TREND[CSAT_TREND.length - 1]
    const peakHour = PEAK_USAGE.reduce((a, b) => b.volume > a.volume ? b : a)

    return (
        <div className="space-y-8">

            {/* ── Header ──────────────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">Engagement Metrics</h2>
                    <p className="text-sm text-slate-400 mt-0.5">
                        Chatbot conversation health — volumes, speed, satisfaction &amp; peak activity.
                    </p>
                </div>
                <span
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold self-start sm:self-auto"
                    style={{ background: "rgba(52,211,153,0.09)", border: "1px solid rgba(52,211,153,0.22)", color: "#34D399" }}
                >
                    <Activity className="h-3.5 w-3.5" /> Live · February 2026
                </span>
            </div>

            {/* ── KPI Cards ───────────────────────────────────────────────────── */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    {
                        label: "Total Conversations",
                        value: feb.conversations.toLocaleString(),
                        sub: `+${convMoM}% MoM · ${resRate}% self-resolved`,
                        delta: `+${convMoM}%`,
                        positive: true,
                        icon: MessageSquare, color: "#6366F1", rgb: "99,102,241",
                    },
                    {
                        label: "Avg Response Time",
                        value: `${latestResp}s`,
                        sub: `${respImprove}% faster than Sep baseline`,
                        delta: `-${respImprove}%`,
                        positive: true,
                        icon: Clock, color: "#34D399", rgb: "52,211,153",
                    },
                    {
                        label: "Customer Satisfaction",
                        value: `${latestCsat.csat}%`,
                        sub: `+${latestCsat.csat - CSAT_TREND[0].csat}pp since Sep · ${latestCsat.promoters}% promoters`,
                        delta: `+${latestCsat.csat - CSAT_TREND[CSAT_TREND.length - 2].csat}pp MoM`,
                        positive: true,
                        icon: ThumbsUp, color: "#EC4899", rgb: "236,72,153",
                    },
                    {
                        label: "Peak Usage Hour",
                        value: peakHour.hour,
                        sub: `${peakHour.volume} conversations at peak`,
                        delta: "Daily peak",
                        positive: true,
                        icon: TrendingUp, color: "#FBBF24", rgb: "251,191,36",
                    },
                ].map((c, i) => (
                    <div
                        key={c.label}
                        className="relative rounded-2xl p-5 overflow-hidden cursor-pointer group hover:-translate-y-0.5 transition-all duration-300 animate-fade-in-up"
                        style={{
                            background: `rgba(${c.rgb},0.07)`,
                            border: `1px solid rgba(${c.rgb},0.22)`,
                            backdropFilter: "blur(16px)",
                            animationDelay: `${i * 60}ms`,
                        }}
                    >
                        <div className="absolute -top-5 -right-5 h-20 w-20 rounded-full pointer-events-none"
                            style={{ background: `radial-gradient(circle,${c.color},transparent 70%)`, opacity: 0.1 }} />
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl"
                                style={{ background: `rgba(${c.rgb},0.14)`, border: `1px solid rgba(${c.rgb},0.25)` }}>
                                <c.icon className="h-5 w-5" style={{ color: c.color }} />
                            </div>
                            <span
                                className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                                style={{ background: `rgba(${c.rgb},0.15)`, color: c.color, border: `1px solid rgba(${c.rgb},0.25)` }}
                            >
                                {c.delta}
                            </span>
                        </div>
                        <p className="text-2xl font-black text-white tracking-tight">{c.value}</p>
                        <p className="text-sm font-semibold text-slate-300 mt-0.5">{c.label}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{c.sub}</p>
                    </div>
                ))}
            </div>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━  CHART 1 — Total Conversations  ━━━━━━ */}
            <div
                className="rounded-2xl overflow-hidden animate-fade-in"
                style={{ background: "rgba(13,20,33,0.82)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}
            >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-indigo-400" />
                        <h3 className="text-sm font-bold text-white">Total Conversations</h3>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* View toggle */}
                        <div
                            className="inline-flex rounded-lg p-0.5 gap-0.5"
                            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                        >
                            {(["area", "bar"] as const).map(m => (
                                <button
                                    key={m}
                                    onClick={() => setConvMode(m)}
                                    className="px-2.5 py-1 rounded-md text-[11px] font-bold capitalize transition-all"
                                    style={
                                        convMode === m
                                            ? { background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "#fff" }
                                            : { color: "#64748B" }
                                    }
                                >
                                    {m === "area" ? "Trend" : "Breakdown"}
                                </button>
                            ))}
                        </div>
                        {/* Legend */}
                        <div className="hidden sm:flex items-center gap-4">
                            {[
                                { label: "Total", color: "#6366F1" },
                                { label: "Resolved", color: "#34D399" },
                                { label: "Escalated", color: "#F87171" },
                            ].map(l => (
                                <div key={l.label} className="flex items-center gap-1.5">
                                    <div className="h-2 w-2 rounded-full" style={{ background: l.color }} />
                                    <span className="text-[11px] text-slate-500">{l.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <ResponsiveContainer width="100%" height={260}>
                        {convMode === "area" ? (
                            <AreaChart data={CONV_TREND} margin={{ top: 8, right: 8, left: -4, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="resolvedGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#34D399" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.04)" />
                                <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
                                <Tooltip content={<ConvTip />} />
                                <Area type="monotone" dataKey="conversations" stroke="#6366F1" strokeWidth={2.5} fill="url(#convGrad)" dot={false}
                                    style={{ filter: "drop-shadow(0 0 6px rgba(99,102,241,0.5))" }} />
                                <Area type="monotone" dataKey="resolved" stroke="#34D399" strokeWidth={2} fill="url(#resolvedGrad)" dot={false}
                                    style={{ filter: "drop-shadow(0 0 5px rgba(52,211,153,0.4))" }} />
                                <Area type="monotone" dataKey="escalated" stroke="#F87171" strokeWidth={1.5} fill="none" dot={false} strokeDasharray="4 3" />
                            </AreaChart>
                        ) : (
                            <BarChart data={CONV_TREND} margin={{ top: 8, right: 8, left: -4, bottom: 0 }} barCategoryGap="24%" barGap={3}>
                                <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.04)" vertical={false} />
                                <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
                                <Tooltip content={<ConvTip />} cursor={{ fill: "rgba(255,255,255,0.025)" }} />
                                <Bar dataKey="conversations" radius={[4, 4, 0, 0]} fill="#6366F1"
                                    style={{ filter: "drop-shadow(0 0 5px rgba(99,102,241,0.4))" }} />
                                <Bar dataKey="resolved" radius={[4, 4, 0, 0]} fill="#34D399"
                                    style={{ filter: "drop-shadow(0 0 5px rgba(52,211,153,0.4))" }} />
                                <Bar dataKey="escalated" radius={[4, 4, 0, 0]} fill="#F87171"
                                    style={{ filter: "drop-shadow(0 0 4px rgba(248,113,113,0.4))" }} />
                            </BarChart>
                        )}
                    </ResponsiveContainer>
                </div>

                <div
                    className="px-6 py-3 flex items-center justify-between border-t border-white/[0.04]"
                    style={{ background: "rgba(255,255,255,0.01)" }}
                >
                    <p className="text-[11px] text-slate-500">
                        Feb self-resolution rate: <span className="text-emerald-400 font-bold">{resRate}%</span>
                        &nbsp;·&nbsp;Escalated: <span className="text-red-400 font-bold">{feb.escalated}</span>
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-indigo-400 font-semibold">
                        <ArrowUpRight className="h-3 w-3" /> +{convMoM}% MoM
                    </div>
                </div>
            </div>

            {/* ━━━━━━━━━━━━━━━━━━  CHARTS ROW — Response Time + CSAT  ━━━━━━━━━ */}
            <div className="grid gap-5 lg:grid-cols-2">

                {/* Response time trend */}
                <div
                    className="rounded-2xl overflow-hidden animate-fade-in"
                    style={{ background: "rgba(13,20,33,0.82)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}
                >
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-emerald-400" />
                            <h3 className="text-sm font-bold text-white">Avg Response Time</h3>
                        </div>
                        <span className="text-[11px] text-slate-500">seconds · improving</span>
                    </div>
                    <div className="p-6">
                        <div className="flex items-end gap-3 mb-5">
                            <span className="text-4xl font-black text-white">{latestResp}s</span>
                            <div className="pb-1">
                                <span
                                    className="text-xs font-bold px-2 py-0.5 rounded-lg"
                                    style={{ background: "rgba(52,211,153,0.12)", color: "#34D399", border: "1px solid rgba(52,211,153,0.25)" }}
                                >
                                    -{respImprove}% since Sep
                                </span>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={170}>
                            <LineChart data={RESP_TREND} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="respLineGrad" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#6366F1" />
                                        <stop offset="100%" stopColor="#34D399" />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.04)" />
                                <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false}
                                    tickFormatter={v => `${v}s`} domain={[0, 6]} />
                                <Tooltip
                                    content={({ active, payload, label }) => {
                                        if (!active || !payload?.length) return null
                                        return (
                                            <div className="rounded-xl px-3 py-2 text-xs"
                                                style={{ background: "#0A1120", border: "1px solid rgba(52,211,153,0.3)", boxShadow: "0 8px 32px rgba(0,0,0,0.6)" }}>
                                                <p className="font-bold text-white">{label}</p>
                                                <p className="text-emerald-400 font-bold mt-0.5">{payload[0]?.value}s avg response</p>
                                            </div>
                                        )
                                    }}
                                />
                                <Line
                                    type="monotone" dataKey="responseTime"
                                    stroke="url(#respLineGrad)" strokeWidth={2.5}
                                    dot={{ r: 4, fill: "#34D399", strokeWidth: 0 }}
                                    activeDot={{ r: 6, fill: "#34D399" }}
                                    style={{ filter: "drop-shadow(0 0 6px rgba(52,211,153,0.5))" }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div
                        className="px-6 py-3 flex items-center gap-2 border-t border-white/[0.04]"
                        style={{ background: "rgba(52,211,153,0.03)" }}
                    >
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                        <p className="text-[11px] text-slate-400">
                            Industry benchmark: <span className="text-white font-semibold">~8s</span>. You're{" "}
                            <span className="text-emerald-400 font-bold">3.3× faster</span>.
                        </p>
                    </div>
                </div>

                {/* CSAT trend + breakdown */}
                <div
                    className="rounded-2xl overflow-hidden animate-fade-in"
                    style={{ background: "rgba(13,20,33,0.82)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}
                >
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                        <div className="flex items-center gap-2">
                            <ThumbsUp className="h-4 w-4 text-pink-400" />
                            <h3 className="text-sm font-bold text-white">Customer Satisfaction %</h3>
                        </div>
                        <span
                            className="text-xs font-black px-2 py-0.5 rounded-lg"
                            style={{ background: "rgba(236,72,153,0.12)", color: "#EC4899", border: "1px solid rgba(236,72,153,0.25)" }}
                        >
                            {latestCsat.csat}% CSAT
                        </span>
                    </div>

                    <div className="p-6">
                        {/* Hero score row */}
                        <div className="flex items-center gap-6 mb-5">
                            <div className="text-center">
                                <p className="text-4xl font-black text-white">{latestCsat.csat}%</p>
                                <div className="flex items-center justify-center gap-1 mt-1">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <Star key={s} className="h-3.5 w-3.5" style={{ fill: s <= 4 ? "#EC4899" : "transparent", color: "#EC4899" }} />
                                    ))}
                                </div>
                                <p className="text-[10px] text-slate-600 mt-0.5">Feb 2026</p>
                            </div>
                            <div className="flex-1 space-y-2">
                                {CSAT_BREAKDOWN.map(b => (
                                    <div key={b.label}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[10px] text-slate-500">{b.label}</span>
                                            <span className="text-[10px] font-bold text-white">{b.pct}%</span>
                                        </div>
                                        <div className="h-1.5 w-full rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                                            <div
                                                className="h-full rounded-full"
                                                style={{
                                                    width: `${b.pct}%`,
                                                    background: b.color,
                                                    boxShadow: `0 0 5px ${b.color}55`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CSAT line trend */}
                        <ResponsiveContainer width="100%" height={100}>
                            <LineChart data={CSAT_TREND} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.03)" />
                                <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 9 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: "#64748B", fontSize: 9 }} axisLine={false} tickLine={false}
                                    tickFormatter={v => `${v}%`} domain={[60, 100]} />
                                <Tooltip content={<CsatTip />} />
                                <Line type="monotone" dataKey="csat" stroke="#EC4899" strokeWidth={2}
                                    dot={{ r: 3, fill: "#EC4899", strokeWidth: 0 }}
                                    activeDot={{ r: 5, fill: "#F472B6" }}
                                    style={{ filter: "drop-shadow(0 0 5px rgba(236,72,153,0.5))" }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div
                        className="px-6 py-3 flex items-center gap-2 border-t border-white/[0.04]"
                        style={{ background: "rgba(236,72,153,0.03)" }}
                    >
                        <ArrowUpRight className="h-3.5 w-3.5 text-pink-400 flex-shrink-0" />
                        <p className="text-[11px] text-slate-400">
                            +<span className="text-pink-400 font-bold">{latestCsat.csat - CSAT_TREND[0].csat}pp</span> improvement since Sep.
                            NPS promoters: <span className="text-white font-bold">{latestCsat.promoters}%</span>.
                        </p>
                    </div>
                </div>
            </div>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━  CHART 3 — Peak Usage Time  ━━━━━━━━━━ */}
            <div
                className="rounded-2xl overflow-hidden animate-fade-in"
                style={{ background: "rgba(13,20,33,0.82)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}
            >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-amber-400" />
                        <h3 className="text-sm font-bold text-white">Peak Usage Time</h3>
                    </div>
                    <div className="flex items-center gap-3">
                        <div
                            className="px-3 py-1.5 rounded-xl text-xs"
                            style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)" }}
                        >
                            <span className="text-amber-400 font-bold">🔥 Peak: {peakHour.hour}</span>
                            <span className="text-slate-500 ml-2">({peakHour.volume} sessions)</span>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={PEAK_USAGE} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                            <defs>
                                <linearGradient id="peakGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#EC4899" stopOpacity={0.35} />
                                    <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.04)" vertical={false} />
                            <XAxis
                                dataKey="hour"
                                tick={{ fill: "#64748B", fontSize: 9 }}
                                axisLine={false}
                                tickLine={false}
                                interval={2}
                            />
                            <YAxis tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<PeakTip />} />
                            <Area
                                type="monotone"
                                dataKey="volume"
                                stroke="#EC4899"
                                strokeWidth={2}
                                fill="url(#peakGrad)"
                                dot={false}
                                activeDot={{ r: 5, fill: "#EC4899", strokeWidth: 0 }}
                                style={{ filter: "drop-shadow(0 0 6px rgba(236,72,153,0.5))" }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>

                    {/* Time-of-day summary pills */}
                    <div className="grid grid-cols-4 gap-3 mt-5">
                        {[
                            { label: "Morning", range: "6am – 11am", pct: 28, color: "#F59E0B", rgb: "245,158,11" },
                            { label: "Afternoon", range: "12pm – 5pm", pct: 32, color: "#6366F1", rgb: "99,102,241" },
                            { label: "Evening", range: "6pm – 10pm", pct: 30, color: "#EC4899", rgb: "236,72,153" },
                            { label: "Night", range: "11pm – 5am", pct: 10, color: "#475569", rgb: "71,85,105" },
                        ].map(t => (
                            <div
                                key={t.label}
                                className="rounded-xl p-3 text-center"
                                style={{ background: `rgba(${t.rgb},0.07)`, border: `1px solid rgba(${t.rgb},0.2)` }}
                            >
                                <p className="text-lg font-black text-white">{t.pct}%</p>
                                <p className="text-[11px] font-semibold" style={{ color: t.color }}>{t.label}</p>
                                <p className="text-[9px] text-slate-600 mt-0.5">{t.range}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div
                    className="px-6 py-3 flex items-center gap-2 border-t border-white/[0.04]"
                    style={{ background: "rgba(236,72,153,0.03)" }}
                >
                    <AlertCircle className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" />
                    <p className="text-[11px] text-slate-400">
                        <span className="text-amber-400 font-bold">62%</span> of all conversations happen between{" "}
                        <span className="text-white font-semibold">6pm – 10pm</span>. Schedule campaigns for this window for maximum reach.
                    </p>
                </div>
            </div>

            {/* ── Stat mini-cards row ──────────────────────────────────────────── */}
            <div className="grid gap-4 sm:grid-cols-3">
                {[
                    {
                        label: "Conversations / Day",
                        value: Math.round(feb.conversations / 28).toString(),
                        sub: "Daily average, Feb",
                        icon: MessageSquare, color: "#6366F1", rgb: "99,102,241",
                        delta: "+12% vs Jan",
                    },
                    {
                        label: "First Contact Resolution",
                        value: `${resRate}%`,
                        sub: "No human hand-off needed",
                        icon: CheckCircle2, color: "#34D399", rgb: "52,211,153",
                        delta: "Industry avg 68%",
                    },
                    {
                        label: "Escalation Rate",
                        value: `${((feb.escalated / feb.conversations) * 100).toFixed(1)}%`,
                        sub: `${feb.escalated} tickets handed to agents`,
                        icon: Users, color: "#FBBF24", rgb: "251,191,36",
                        delta: "-2.1pp MoM",
                    },
                ].map((c, i) => (
                    <div
                        key={c.label}
                        className="relative rounded-2xl p-5 overflow-hidden cursor-pointer hover:-translate-y-0.5 transition-all duration-300 animate-fade-in-up"
                        style={{
                            background: `rgba(${c.rgb},0.07)`,
                            border: `1px solid rgba(${c.rgb},0.22)`,
                            backdropFilter: "blur(16px)",
                            animationDelay: `${i * 60}ms`,
                        }}
                    >
                        <div className="absolute -top-5 -right-5 h-20 w-20 rounded-full pointer-events-none"
                            style={{ background: `radial-gradient(circle,${c.color},transparent 70%)`, opacity: 0.1 }} />
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl"
                                style={{ background: `rgba(${c.rgb},0.14)`, border: `1px solid rgba(${c.rgb},0.25)` }}>
                                <c.icon className="h-5 w-5" style={{ color: c.color }} />
                            </div>
                            <span
                                className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                                style={{ background: `rgba(${c.rgb},0.15)`, color: c.color, border: `1px solid rgba(${c.rgb},0.25)` }}
                            >
                                {c.delta}
                            </span>
                        </div>
                        <p className="text-3xl font-black text-white tracking-tight">{c.value}</p>
                        <p className="text-sm font-semibold text-slate-300 mt-0.5">{c.label}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{c.sub}</p>
                    </div>
                ))}
            </div>

            {/* ── AI Insight Banner ────────────────────────────────────────────── */}
            <div
                className="flex items-start gap-4 px-5 py-4 rounded-2xl animate-fade-in"
                style={{
                    background: "linear-gradient(135deg,rgba(236,72,153,0.09),rgba(99,102,241,0.05))",
                    border: "1px solid rgba(236,72,153,0.25)",
                }}
            >
                <Sparkles className="h-5 w-5 text-pink-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white mb-0.5">Optimise for Peak Hours</p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        <span className="text-amber-400 font-bold">62%</span> of conversations happen{" "}
                        <span className="text-white font-semibold">6pm – 10pm</span>. Scheduling flash-sale chatbot{" "}
                        announcements during this window could boost evening conversions by{" "}
                        <span className="text-pink-400 font-semibold">25–35%</span>, adding up to{" "}
                        <span className="text-emerald-400 font-semibold">+$5,800/month</span> in incremental revenue.
                    </p>
                </div>
                <button
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 active:scale-95"
                    style={{ background: "linear-gradient(135deg,#EC4899,#6366F1)", boxShadow: "0 4px 12px rgba(236,72,153,0.4)" }}
                >
                    <Zap className="h-3.5 w-3.5" /> Schedule
                </button>
            </div>

        </div>
    )
}
