"use client"

import { useState } from "react"
import {
    AreaChart, Area, BarChart, Bar, LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell, ReferenceLine,
} from "recharts"
import {
    DollarSign, TrendingUp, Zap, Sparkles,
    ArrowUpRight, CheckCircle2, Bot, BarChart2,
    Star, Flame, Target, RefreshCw,
} from "lucide-react"

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  DATA  ━━━━━━━━━━ */

const MONTHLY_ROI = [
    { month: "Sep", cost: 49, revenue: 28400, profit: 28351, roi: 579 },
    { month: "Oct", cost: 49, revenue: 34200, profit: 34151, roi: 697 },
    { month: "Nov", cost: 49, revenue: 41800, profit: 41751, roi: 853 },
    { month: "Dec", cost: 79, revenue: 58600, profit: 58521, roi: 741 },
    { month: "Jan", cost: 79, revenue: 52300, profit: 52221, roi: 662 },
    { month: "Feb", cost: 79, revenue: 93400, profit: 93321, roi: 1182 },
]

/** Revenue breakdown by source */
const REVENUE_SOURCES = [
    { label: "AI-Generated Orders", revenue: 57600, pct: 62, color: "#6366F1", rgb: "99,102,241" },
    { label: "Cart Recovery", revenue: 18796, pct: 20, color: "#EC4899", rgb: "236,72,153" },
    { label: "Upsell / Cross-sell", revenue: 9340, pct: 10, color: "#FBBF24", rgb: "251,191,36" },
    { label: "Try-On Conversions", revenue: 7664, pct: 8, color: "#34D399", rgb: "52,211,153" },
]

/** Cost breakdown */
const COST_BREAKDOWN = [
    { label: "Subscription (Pro)", amount: 79, pct: 72, color: "#6366F1" },
    { label: "WhatsApp Messages", amount: 18, pct: 16, color: "#34D399" },
    { label: "SMS Recovery", amount: 13, pct: 12, color: "#FBBF24" },
]

/** ROI multiplier trend */
const ROI_TREND = MONTHLY_ROI.map(d => ({ month: d.month, multiplier: +(d.revenue / d.cost).toFixed(1) }))

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Tooltips  ━━━━━━━━━ */
function RoiTip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null
    const d = MONTHLY_ROI.find(m => m.month === label)
    return (
        <div className="rounded-xl px-4 py-3 text-xs min-w-[190px]"
            style={{ background: "#0A1120", border: "1px solid rgba(99,102,241,0.3)", boxShadow: "0 12px 40px rgba(0,0,0,0.6)" }}>
            <p className="font-bold text-white mb-2">{label}</p>
            <div className="space-y-1.5">
                <div className="flex justify-between gap-6"><span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-400" /><span className="text-slate-500">Bot Cost</span></span><span className="font-bold text-red-400">${d?.cost}</span></div>
                <div className="flex justify-between gap-6"><span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-indigo-400" /><span className="text-slate-500">Revenue</span></span><span className="font-bold text-indigo-400">${d?.revenue.toLocaleString()}</span></div>
                <div className="pt-1.5 mt-1 border-t border-white/10 flex justify-between gap-6"><span className="text-slate-500">Net Profit</span><span className="font-bold text-emerald-400">${d?.profit.toLocaleString()}</span></div>
                <div className="flex justify-between gap-6"><span className="text-slate-500">ROI</span><span className="font-bold text-yellow-400">{d?.roi}×</span></div>
            </div>
        </div>
    )
}

function MultTip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null
    return (
        <div className="rounded-xl px-3 py-2 text-xs"
            style={{ background: "#0A1120", border: "1px solid rgba(251,191,36,0.3)", boxShadow: "0 8px 32px rgba(0,0,0,0.6)" }}>
            <p className="font-bold text-white">{label}</p>
            <p className="text-yellow-400 font-bold mt-0.5">{payload[0]?.value}× ROI multiplier</p>
        </div>
    )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Main  ━━━━━━━━━ */
export function ROISummary() {
    const [chartMode, setChartMode] = useState<"area" | "bar">("area")

    const feb = MONTHLY_ROI[MONTHLY_ROI.length - 1]
    const jan = MONTHLY_ROI[MONTHLY_ROI.length - 2]

    const roiMultiplier = (feb.revenue / feb.cost).toFixed(1)
    const revMoM = (((feb.revenue - jan.revenue) / jan.revenue) * 100).toFixed(0)
    const totalCost = COST_BREAKDOWN.reduce((s, c) => s + c.amount, 0)
    const totalRevenue = feb.revenue
    const netProfit = totalRevenue - totalCost

    return (
        <div className="space-y-8">

            {/* ── Header ──────────────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">ROI Summary</h2>
                    <p className="text-sm text-slate-400 mt-0.5">
                        Every dollar spent on your chatbot — measurable, transparent return.
                    </p>
                </div>
                <span
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold self-start sm:self-auto"
                    style={{ background: "rgba(251,191,36,0.09)", border: "1px solid rgba(251,191,36,0.25)", color: "#FBBF24" }}
                >
                    <Flame className="h-3.5 w-3.5" /> February 2026
                </span>
            </div>

            {/* ━━━━━━━━━━━━━━━  ★  HERO HIGHLIGHT CARD  ★  ━━━━━━━━━━━━━━━━━━━━ */}
            <div
                className="relative rounded-3xl px-6 py-8 overflow-hidden animate-fade-in"
                style={{
                    background: "linear-gradient(135deg,rgba(251,191,36,0.18) 0%,rgba(236,72,153,0.12) 50%,rgba(99,102,241,0.10) 100%)",
                    border: "1px solid rgba(251,191,36,0.4)",
                    boxShadow: "0 0 60px rgba(251,191,36,0.12), 0 0 120px rgba(236,72,153,0.06)",
                }}
            >
                {/* Background glows */}
                <div className="absolute -top-12 -left-12 h-48 w-48 rounded-full pointer-events-none"
                    style={{ background: "radial-gradient(circle,rgba(251,191,36,0.25),transparent 70%)" }} />
                <div className="absolute -bottom-12 -right-12 h-48 w-48 rounded-full pointer-events-none"
                    style={{ background: "radial-gradient(circle,rgba(236,72,153,0.18),transparent 70%)" }} />

                <div className="relative flex flex-col lg:flex-row lg:items-center gap-8">
                    {/* Left — main message */}
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div
                                className="flex h-14 w-14 items-center justify-center rounded-2xl flex-shrink-0"
                                style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)", boxShadow: "0 0 24px rgba(251,191,36,0.5)" }}
                            >
                                <Bot className="h-7 w-7 text-black" />
                            </div>
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-widest text-amber-400">AI Chatbot Performance</p>
                                <h3 className="text-2xl font-black text-white leading-tight">
                                    Your chatbot generated a{" "}
                                    <span
                                        className="px-1 rounded"
                                        style={{ background: "linear-gradient(90deg,rgba(251,191,36,0.25),transparent)", color: "#FBBF24" }}
                                    >
                                        8.4×
                                    </span>{" "}
                                    return this month
                                </h3>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                            {[
                                { label: "Bot Cost", value: `$${totalCost}`, color: "#F87171", icon: "💸" },
                                { label: "Revenue", value: `$${(totalRevenue / 1000).toFixed(1)}K`, color: "#6366F1", icon: "📈" },
                                { label: "Net Profit", value: `$${(netProfit / 1000).toFixed(1)}K`, color: "#34D399", icon: "💰" },
                                { label: "ROI Mult.", value: `${roiMultiplier}×`, color: "#FBBF24", icon: "🚀" },
                            ].map(m => (
                                <div
                                    key={m.label}
                                    className="rounded-xl px-3 py-3 text-center"
                                    style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.08)" }}
                                >
                                    <div className="text-lg mb-0.5">{m.icon}</div>
                                    <p className="text-lg font-black" style={{ color: m.color }}>{m.value}</p>
                                    <p className="text-[10px] text-slate-500 mt-0.5">{m.label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            {[
                                { text: `+${revMoM}% revenue MoM`, color: "#34D399" },
                                { text: "$93,290 net this month", color: "#FBBF24" },
                                { text: "Top 5% of fashion chatbots", color: "#EC4899" },
                            ].map(t => (
                                <span key={t.text}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold"
                                    style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${t.color}40`, color: t.color }}>
                                    <CheckCircle2 className="h-3 w-3" /> {t.text}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Right — giant multiplier circle */}
                    <div className="flex-shrink-0 flex flex-col items-center gap-2">
                        <div
                            className="relative flex h-36 w-36 items-center justify-center rounded-full"
                            style={{
                                background: "conic-gradient(from 180deg,#FBBF24,#EC4899,#6366F1,#FBBF24)",
                                padding: "3px",
                            }}
                        >
                            <div
                                className="flex h-full w-full items-center justify-center rounded-full flex-col"
                                style={{ background: "linear-gradient(135deg,#0D1828,#0A1120)" }}
                            >
                                <span className="text-4xl font-black text-white leading-none">8.4</span>
                                <span className="text-sm font-bold text-amber-400">× ROI</span>
                            </div>
                            {/* Glow ring */}
                            <div className="absolute inset-0 rounded-full pointer-events-none"
                                style={{ boxShadow: "0 0 30px rgba(251,191,36,0.35), 0 0 60px rgba(251,191,36,0.15)" }} />
                        </div>
                        <p className="text-[10px] text-slate-500 text-center max-w-[130px] leading-relaxed">
                            for every $1 spent on the chatbot
                        </p>
                    </div>
                </div>
            </div>

            {/* ── KPI Cards row ────────────────────────────────────────────────── */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    {
                        label: "Monthly Bot Cost",
                        value: `$${totalCost}`,
                        sub: `Plan $${feb.cost} + messaging $${totalCost - feb.cost}`,
                        delta: "Fixed overhead",
                        icon: DollarSign, color: "#F87171", rgb: "248,113,113",
                    },
                    {
                        label: "Revenue Generated",
                        value: `$${(totalRevenue / 1000).toFixed(1)}K`,
                        sub: `+${revMoM}% vs Jan · All chatbot-attributed`,
                        delta: `+${revMoM}% MoM`,
                        icon: TrendingUp, color: "#6366F1", rgb: "99,102,241",
                    },
                    {
                        label: "Net Profit",
                        value: `$${(netProfit / 1000).toFixed(1)}K`,
                        sub: `Revenue minus all bot costs`,
                        delta: "After costs",
                        icon: Target, color: "#34D399", rgb: "52,211,153",
                    },
                    {
                        label: "ROI Multiplier",
                        value: `${roiMultiplier}×`,
                        sub: `$${roiMultiplier} returned per $1 spent`,
                        delta: "↑ vs 662× Jan",
                        icon: Star, color: "#FBBF24", rgb: "251,191,36",
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

            {/* ━━━━━━━━━━━━━━━━  Monthly ROI Trend Area / Bar Chart  ━━━━━━━━━━━ */}
            <div
                className="rounded-2xl overflow-hidden animate-fade-in"
                style={{ background: "rgba(13,20,33,0.82)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}
            >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2">
                        <BarChart2 className="h-4 w-4 text-indigo-400" />
                        <h3 className="text-sm font-bold text-white">Revenue vs Cost — Monthly Trend</h3>
                    </div>
                    <div className="flex items-center gap-3">
                        <div
                            className="inline-flex rounded-lg p-0.5 gap-0.5"
                            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                        >
                            {(["area", "bar"] as const).map(m => (
                                <button
                                    key={m}
                                    onClick={() => setChartMode(m)}
                                    className="px-2.5 py-1 rounded-md text-[11px] font-bold capitalize transition-all"
                                    style={
                                        chartMode === m
                                            ? { background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "#fff" }
                                            : { color: "#64748B" }
                                    }
                                >
                                    {m === "area" ? "Trend" : "Bars"}
                                </button>
                            ))}
                        </div>
                        <div className="hidden sm:flex items-center gap-4">
                            {[{ l: "Revenue", c: "#6366F1" }, { l: "Net Profit", c: "#34D399" }, { l: "Cost", c: "#F87171" }].map(l => (
                                <div key={l.l} className="flex items-center gap-1.5">
                                    <div className="h-2 w-2 rounded-full" style={{ background: l.c }} />
                                    <span className="text-[11px] text-slate-500">{l.l}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <ResponsiveContainer width="100%" height={260}>
                        {chartMode === "area" ? (
                            <AreaChart data={MONTHLY_ROI} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#34D399" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.04)" />
                                <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
                                <YAxis
                                    tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false}
                                    tickFormatter={v => v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${v}`}
                                />
                                <Tooltip content={<RoiTip />} />
                                <Area type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={2.5} fill="url(#revGrad)" dot={false}
                                    style={{ filter: "drop-shadow(0 0 6px rgba(99,102,241,0.5))" }} />
                                <Area type="monotone" dataKey="profit" stroke="#34D399" strokeWidth={2} fill="url(#profGrad)" dot={false}
                                    style={{ filter: "drop-shadow(0 0 5px rgba(52,211,153,0.4))" }} />
                                <Area type="monotone" dataKey="cost" stroke="#F87171" strokeWidth={1.5} fill="none" dot={false} strokeDasharray="4 3" />
                            </AreaChart>
                        ) : (
                            <BarChart data={MONTHLY_ROI} margin={{ top: 8, right: 8, left: 4, bottom: 0 }} barCategoryGap="22%" barGap={3}>
                                <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.04)" vertical={false} />
                                <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
                                <YAxis
                                    tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false}
                                    tickFormatter={v => v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${v}`}
                                />
                                <Tooltip content={<RoiTip />} cursor={{ fill: "rgba(255,255,255,0.025)" }} />
                                <Bar dataKey="revenue" radius={[4, 4, 0, 0]} fill="#6366F1"
                                    style={{ filter: "drop-shadow(0 0 5px rgba(99,102,241,0.4))" }} />
                                <Bar dataKey="profit" radius={[4, 4, 0, 0]} fill="#34D399"
                                    style={{ filter: "drop-shadow(0 0 5px rgba(52,211,153,0.4))" }} />
                                <Bar dataKey="cost" radius={[4, 4, 0, 0]} fill="#F87171" />
                            </BarChart>
                        )}
                    </ResponsiveContainer>
                </div>

                <div
                    className="px-6 py-3 flex items-center justify-between border-t border-white/[0.04]"
                    style={{ background: "rgba(255,255,255,0.01)" }}
                >
                    <p className="text-[11px] text-slate-500">
                        6-month total revenue:{" "}
                        <span className="text-indigo-400 font-bold">${MONTHLY_ROI.reduce((s, d) => s + d.revenue, 0).toLocaleString()}</span>
                        &nbsp;·&nbsp;Total cost:{" "}
                        <span className="text-red-400 font-bold">${MONTHLY_ROI.reduce((s, d) => s + d.cost, 0)}</span>
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                        <ArrowUpRight className="h-3 w-3" /> +{revMoM}% revenue MoM
                    </div>
                </div>
            </div>

            {/* ── Two-column: Revenue Sources + Cost Breakdown ─────────────────── */}
            <div className="grid gap-5 lg:grid-cols-2">

                {/* Revenue sources */}
                <div
                    className="rounded-2xl p-6 animate-fade-in"
                    style={{ background: "rgba(13,20,33,0.82)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}
                >
                    <div className="flex items-center gap-2 mb-5">
                        <TrendingUp className="h-4 w-4 text-indigo-400" />
                        <h3 className="text-sm font-bold text-white">Revenue by Source</h3>
                        <span className="ml-auto text-xs font-black text-white">${(totalRevenue / 1000).toFixed(1)}K</span>
                    </div>
                    <div className="space-y-4">
                        {REVENUE_SOURCES.map(s => (
                            <div key={s.label}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                                        <span className="text-[11px] text-slate-400">{s.label}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-500">${s.revenue.toLocaleString()}</span>
                                        <span
                                            className="text-[10px] font-black px-1.5 py-0.5 rounded"
                                            style={{ background: `rgba(${s.rgb},0.15)`, color: s.color, border: `1px solid rgba(${s.rgb},0.25)` }}
                                        >
                                            {s.pct}%
                                        </span>
                                    </div>
                                </div>
                                <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                                    <div
                                        className="h-full rounded-full transition-all duration-700"
                                        style={{
                                            width: `${s.pct}%`,
                                            background: `linear-gradient(90deg,${s.color},${s.color}80)`,
                                            boxShadow: `0 0 8px ${s.color}50`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ROI multiplier line chart */}
                    <div className="mt-6 pt-4 border-t border-white/[0.06]">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-3">ROI Multiplier Trend</p>
                        <ResponsiveContainer width="100%" height={90}>
                            <LineChart data={ROI_TREND} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.03)" />
                                <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 9 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: "#64748B", fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}×`} />
                                <Tooltip content={<MultTip />} />
                                <Line type="monotone" dataKey="multiplier" stroke="#FBBF24" strokeWidth={2}
                                    dot={{ r: 3, fill: "#FBBF24", strokeWidth: 0 }}
                                    activeDot={{ r: 5, fill: "#F59E0B" }}
                                    style={{ filter: "drop-shadow(0 0 5px rgba(251,191,36,0.5))" }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Cost breakdown */}
                <div
                    className="rounded-2xl p-6 animate-fade-in"
                    style={{ background: "rgba(13,20,33,0.82)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}
                >
                    <div className="flex items-center gap-2 mb-5">
                        <DollarSign className="h-4 w-4 text-red-400" />
                        <h3 className="text-sm font-bold text-white">Cost Breakdown</h3>
                        <span className="ml-auto text-xs font-black text-red-400">${totalCost}/mo</span>
                    </div>
                    <div className="space-y-4 mb-6">
                        {COST_BREAKDOWN.map(c => (
                            <div key={c.label}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: c.color }} />
                                        <span className="text-[11px] text-slate-400">{c.label}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-white">${c.amount}</span>
                                        <span className="text-[10px] text-slate-600">{c.pct}%</span>
                                    </div>
                                </div>
                                <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                                    <div
                                        className="h-full rounded-full transition-all duration-700"
                                        style={{
                                            width: `${c.pct}%`,
                                            background: `linear-gradient(90deg,${c.color},${c.color}80)`,
                                            boxShadow: `0 0 6px ${c.color}50`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Efficiency metrics grid */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                        {[
                            { label: "Cost per Conversation", value: `$${(totalCost / 3340).toFixed(3)}`, color: "#6366F1" },
                            { label: "Revenue per Conv.", value: `$${(totalRevenue / 3340).toFixed(1)}`, color: "#34D399" },
                            { label: "Cost per Recovery", value: `$${(totalCost / 148).toFixed(2)}`, color: "#FBBF24" },
                            { label: "Revenue per Recovery", value: `$${(totalRevenue / 148).toFixed(0)}`, color: "#EC4899" },
                        ].map(m => (
                            <div
                                key={m.label}
                                className="rounded-xl px-3 py-3 text-center"
                                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                            >
                                <p className="text-base font-black" style={{ color: m.color }}>{m.value}</p>
                                <p className="text-[9px] text-slate-600 mt-0.5 leading-relaxed">{m.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Return card */}
                    <div
                        className="flex items-center justify-between px-4 py-3 rounded-xl"
                        style={{ background: "linear-gradient(135deg,rgba(52,211,153,0.1),rgba(99,102,241,0.05))", border: "1px solid rgba(52,211,153,0.2)" }}
                    >
                        <div>
                            <p className="text-[10px] text-slate-500">For every $1 spent</p>
                            <p className="text-lg font-black text-white">${roiMultiplier} returned</p>
                        </div>
                        <div
                            className="flex h-12 w-12 items-center justify-center rounded-xl"
                            style={{ background: "linear-gradient(135deg,#34D399,#059669)", boxShadow: "0 0 16px rgba(52,211,153,0.4)" }}
                        >
                            <RefreshCw className="h-5 w-5 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── AI Insight ───────────────────────────────────────────────────── */}
            <div
                className="flex items-start gap-4 px-5 py-4 rounded-2xl animate-fade-in"
                style={{
                    background: "linear-gradient(135deg,rgba(251,191,36,0.10),rgba(99,102,241,0.05))",
                    border: "1px solid rgba(251,191,36,0.28)",
                }}
            >
                <Sparkles className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white mb-0.5">Growth Opportunity · Scale Your ROI</p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        You're achieving a <span className="text-amber-400 font-semibold">{roiMultiplier}× ROI</span> at $79/month.
                        Upgrading to Business ($199/mo) with unlimited credits could scale conversations by{" "}
                        <span className="text-white font-semibold">3×</span>, projecting{" "}
                        <span className="text-emerald-400 font-semibold">$280,000+/month</span> in chatbot-attributed revenue —
                        a potential <span className="text-amber-400 font-semibold">1,400× ROI</span>.
                    </p>
                </div>
                <button
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-90 active:scale-95"
                    style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)", boxShadow: "0 4px 12px rgba(251,191,36,0.4)", color: "#000" }}
                >
                    <Zap className="h-3.5 w-3.5" /> Scale Up
                </button>
            </div>

        </div>
    )
}
