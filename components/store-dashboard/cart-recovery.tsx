"use client"

import { useState } from "react"
import {
    BarChart, Bar, AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell, ReferenceLine,
} from "recharts"
import {
    RefreshCw, DollarSign, Clock, TrendingUp,
    ShoppingCart, MessageCircle, ArrowUpRight,
    Sparkles, Zap, CheckCircle2, AlertTriangle,
    BarChart2,
} from "lucide-react"

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  DATA  ━━━━━━━━━━ */

/** Monthly recovery trend — the primary Bar Chart requested */
const MONTHLY_TREND = [
    { month: "Sep", abandoned: 310, recovered: 52, revenue: 6604, chatbotRecovered: 18 },
    { month: "Oct", abandoned: 348, recovered: 68, revenue: 8636, chatbotRecovered: 24 },
    { month: "Nov", abandoned: 402, recovered: 89, revenue: 11303, chatbotRecovered: 32 },
    { month: "Dec", abandoned: 491, recovered: 124, revenue: 15748, chatbotRecovered: 48 },
    { month: "Jan", abandoned: 438, recovered: 112, revenue: 14224, chatbotRecovered: 44 },
    { month: "Feb", abandoned: 524, recovered: 148, revenue: 18796, chatbotRecovered: 61 },
]

const CHANNEL_PERF = [
    { channel: "Chatbot", recovered: 61, winRate: 41, color: "#6366F1", rgb: "99,102,241" },
    { channel: "WhatsApp", recovered: 52, winRate: 43, color: "#34D399", rgb: "52,211,153" },
    { channel: "SMS", recovered: 24, winRate: 28, color: "#FBBF24", rgb: "251,191,36" },
    { channel: "Email", recovered: 11, winRate: 19, color: "#EC4899", rgb: "236,72,153" },
]

const ABANDONMENT_REASONS = [
    { reason: "Price shock / just browsing", pct: 31, color: "#F87171" },
    { reason: "No size available", pct: 22, color: "#FBBF24" },
    { reason: "Distracted / comparison shopping", pct: 18, color: "#A78BFA" },
    { reason: "Unexpected shipping cost", pct: 16, color: "#EC4899" },
    { reason: "Payment / trust hesitation", pct: 9, color: "#22D3EE" },
    { reason: "Other", pct: 4, color: "#475569" },
]

const RECENT_RECOVERIES = [
    { customer: "Priya M.", product: "Rose Floral Midi Dress", value: "$189", channel: "Chatbot", time: "2h ago", status: "Won" },
    { customer: "Anika R.", product: "Banarasi Silk Kurta Set", value: "$214", channel: "WhatsApp", time: "4h ago", status: "Won" },
    { customer: "Divya S.", product: "Indigo Linen Co-ord", value: "$156", channel: "Chatbot", time: "6h ago", status: "Won" },
    { customer: "Nisha K.", product: "Embroidered Silk Saree", value: "$340", channel: "SMS", time: "8h ago", status: "Pending" },
    { customer: "Meera P.", product: "Classic Slim-Fit Jeans", value: "$140", channel: "Email", time: "11h ago", status: "Won" },
    { customer: "Sunita B.", product: "Block-Heel Ankle Boots", value: "$198", channel: "Chatbot", time: "14h ago", status: "Won" },
]

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Tooltips  ━━━━━━━━━ */
function MonthlyTip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null
    const d = MONTHLY_TREND.find(m => m.month === label)
    const rate = d ? ((d.recovered / d.abandoned) * 100).toFixed(0) : "–"
    return (
        <div
            className="rounded-xl px-4 py-3 text-xs min-w-[190px]"
            style={{ background: "#0A1120", border: "1px solid rgba(99,102,241,0.3)", boxShadow: "0 12px 40px rgba(0,0,0,0.6)" }}
        >
            <p className="font-bold text-white mb-2">{label} 2025{label === "Jan" || label === "Feb" ? "/26" : ""}</p>
            <div className="space-y-1.5">
                <div className="flex justify-between gap-6">
                    <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-red-400" />
                        <span className="text-slate-500">Abandoned</span>
                    </span>
                    <span className="font-bold text-white">{d?.abandoned}</span>
                </div>
                <div className="flex justify-between gap-6">
                    <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        <span className="text-slate-500">Recovered</span>
                    </span>
                    <span className="font-bold text-emerald-400">{d?.recovered}</span>
                </div>
                <div className="flex justify-between gap-6">
                    <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-indigo-400" />
                        <span className="text-slate-500">Via Chatbot</span>
                    </span>
                    <span className="font-bold text-indigo-400">{d?.chatbotRecovered}</span>
                </div>
                <div className="pt-1.5 mt-1.5 border-t border-white/10 flex justify-between gap-6">
                    <span className="text-slate-500">Revenue Saved</span>
                    <span className="font-bold text-yellow-400">${d?.revenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between gap-6">
                    <span className="text-slate-500">Win Rate</span>
                    <span className="font-bold text-pink-400">{rate}%</span>
                </div>
            </div>
        </div>
    )
}

function AreaTip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null
    return (
        <div className="rounded-xl px-4 py-3 text-xs min-w-[160px]"
            style={{ background: "#0A1120", border: "1px solid rgba(251,191,36,0.3)", boxShadow: "0 12px 40px rgba(0,0,0,0.6)" }}>
            <p className="font-bold text-white mb-2">{label}</p>
            {payload.map((p: any) => (
                <div key={p.dataKey} className="flex justify-between gap-5 mb-1">
                    <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full" style={{ background: p.stroke }} />
                        <span className="text-slate-500">
                            {p.dataKey === "abandoned" ? "Abandoned" : p.dataKey === "recovered" ? "Recovered" : "Revenue ($)"}
                        </span>
                    </span>
                    <span className="font-bold text-white">
                        {p.dataKey === "revenue" ? `$${p.value.toLocaleString()}` : p.value}
                    </span>
                </div>
            ))}
        </div>
    )
}

const STATUS_STYLE: Record<string, { bg: string; text: string; border: string }> = {
    Won: { bg: "rgba(52,211,153,0.1)", text: "#34D399", border: "rgba(52,211,153,0.25)" },
    Pending: { bg: "rgba(251,191,36,0.1)", text: "#FBBF24", border: "rgba(251,191,36,0.25)" },
}
const CHANNEL_COLOR: Record<string, string> = {
    Chatbot: "#6366F1",
    WhatsApp: "#34D399",
    SMS: "#FBBF24",
    Email: "#EC4899",
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Main  ━━━━━━━━━ */
export function CartRecovery() {
    const [barMetric, setBarMetric] = useState<"carts" | "revenue">("carts")

    const feb = MONTHLY_TREND[MONTHLY_TREND.length - 1]
    const jan = MONTHLY_TREND[MONTHLY_TREND.length - 2]

    const winRate = ((feb.recovered / feb.abandoned) * 100).toFixed(0)
    const chatbotShare = ((feb.chatbotRecovered / feb.recovered) * 100).toFixed(0)
    const revMoM = (((feb.revenue - jan.revenue) / jan.revenue) * 100).toFixed(0)
    const recMoM = (((feb.recovered - jan.recovered) / jan.recovered) * 100).toFixed(0)

    return (
        <div className="space-y-8">

            {/* ── Header ──────────────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">Cart Recovery</h2>
                    <p className="text-sm text-slate-400 mt-0.5">
                        AI-powered abandoned cart win-back — chatbot, WhatsApp &amp; messaging campaigns.
                    </p>
                </div>
                <button
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 active:scale-95 self-start sm:self-auto"
                    style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)", boxShadow: "0 4px 14px rgba(251,191,36,0.4)", color: "#000" }}
                >
                    <RefreshCw className="h-4 w-4" /> Run Campaign Now
                </button>
            </div>

            {/* ── KPI Cards ───────────────────────────────────────────────────── */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    {
                        label: "Abandoned Carts",
                        value: feb.abandoned.toString(),
                        sub: `+${(((feb.abandoned - jan.abandoned) / jan.abandoned) * 100).toFixed(0)}% MoM · $${(feb.abandoned * 127).toLocaleString()} at risk`,
                        icon: ShoppingCart, color: "#F87171", rgb: "248,113,113",
                    },
                    {
                        label: "Recovered via Chatbot",
                        value: feb.chatbotRecovered.toString(),
                        sub: `${chatbotShare}% of all recoveries this month`,
                        icon: MessageCircle, color: "#6366F1", rgb: "99,102,241",
                    },
                    {
                        label: "Total Recovered",
                        value: feb.recovered.toString(),
                        sub: `+${recMoM}% MoM · ${winRate}% win rate`,
                        icon: RefreshCw, color: "#34D399", rgb: "52,211,153",
                    },
                    {
                        label: "Revenue Recovered",
                        value: `$${(feb.revenue / 1000).toFixed(1)}K`,
                        sub: `+${revMoM}% vs last month`,
                        icon: DollarSign, color: "#FBBF24", rgb: "251,191,36",
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
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl mb-4"
                            style={{ background: `rgba(${c.rgb},0.14)`, border: `1px solid rgba(${c.rgb},0.25)` }}>
                            <c.icon className="h-5 w-5" style={{ color: c.color }} />
                        </div>
                        <p className="text-2xl font-black text-white tracking-tight">{c.value}</p>
                        <p className="text-sm font-semibold text-slate-300 mt-0.5">{c.label}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{c.sub}</p>
                    </div>
                ))}
            </div>

            {/* ━━━━━━━━━━━━━━  MAIN CHART · Monthly Recovery Trend (Bar)  ━━━━━ */}
            <div
                className="rounded-2xl overflow-hidden animate-fade-in"
                style={{ background: "rgba(13,20,33,0.82)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}
            >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2">
                        <BarChart2 className="h-4 w-4 text-amber-400" />
                        <h3 className="text-sm font-bold text-white">Recovery Trend by Month</h3>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Metric toggle */}
                        <div
                            className="inline-flex rounded-lg p-0.5 gap-0.5"
                            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                        >
                            {(["carts", "revenue"] as const).map(m => (
                                <button
                                    key={m}
                                    onClick={() => setBarMetric(m)}
                                    className="px-2.5 py-1 rounded-md text-[11px] font-bold capitalize transition-all"
                                    style={
                                        barMetric === m
                                            ? { background: "linear-gradient(135deg,#FBBF24,#F59E0B)", color: "#000" }
                                            : { color: "#64748B" }
                                    }
                                >
                                    {m === "carts" ? "Carts" : "Revenue"}
                                </button>
                            ))}
                        </div>
                        {/* Legend */}
                        {barMetric === "carts" && (
                            <div className="hidden sm:flex items-center gap-4">
                                {[
                                    { label: "Abandoned", fill: "#F87171" },
                                    { label: "Recovered", fill: "#34D399" },
                                    { label: "Via Chatbot", fill: "#6366F1" },
                                ].map(l => (
                                    <div key={l.label} className="flex items-center gap-1.5">
                                        <div className="h-2.5 w-2.5 rounded-sm" style={{ background: l.fill }} />
                                        <span className="text-[11px] text-slate-500">{l.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6">
                    <ResponsiveContainer width="100%" height={280}>
                        {barMetric === "carts" ? (
                            <BarChart
                                data={MONTHLY_TREND}
                                margin={{ top: 8, right: 8, left: -8, bottom: 0 }}
                                barCategoryGap="22%"
                                barGap={3}
                            >
                                <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.04)" vertical={false} />
                                <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
                                <Tooltip content={<MonthlyTip />} cursor={{ fill: "rgba(255,255,255,0.025)", radius: 4 }} />
                                <Bar dataKey="abandoned" radius={[4, 4, 0, 0]} fill="#F87171"
                                    style={{ filter: "drop-shadow(0 0 5px rgba(248,113,113,0.4))" }} />
                                <Bar dataKey="recovered" radius={[4, 4, 0, 0]} fill="#34D399"
                                    style={{ filter: "drop-shadow(0 0 6px rgba(52,211,153,0.5))" }} />
                                <Bar dataKey="chatbotRecovered" radius={[4, 4, 0, 0]} fill="#6366F1"
                                    style={{ filter: "drop-shadow(0 0 6px rgba(99,102,241,0.5))" }} />
                            </BarChart>
                        ) : (
                            <BarChart
                                data={MONTHLY_TREND}
                                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                                barCategoryGap="30%"
                            >
                                <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.04)" vertical={false} />
                                <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
                                <YAxis
                                    tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false}
                                    tickFormatter={v => `$${(v / 1000).toFixed(0)}K`}
                                />
                                <Tooltip content={<MonthlyTip />} cursor={{ fill: "rgba(255,255,255,0.025)", radius: 4 }} />
                                <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                                    {MONTHLY_TREND.map((d, i) => (
                                        <Cell key={i} fill={`hsl(${40 + i * 12},90%,${55 + i * 3}%)`}
                                            style={{ filter: `drop-shadow(0 0 6px rgba(251,191,36,${0.3 + i * 0.07}))` }} />
                                    ))}
                                </Bar>
                            </BarChart>
                        )}
                    </ResponsiveContainer>
                </div>

                {/* Summary strip */}
                <div
                    className="px-6 py-3 flex items-center justify-between border-t border-white/[0.04]"
                    style={{ background: "rgba(255,255,255,0.01)" }}
                >
                    <p className="text-[11px] text-slate-500">
                        Feb total at-risk value:{" "}
                        <span className="text-red-400 font-bold">${(feb.abandoned * 127).toLocaleString()}</span>
                        &nbsp;·&nbsp;Saved:{" "}
                        <span className="text-emerald-400 font-bold">${feb.revenue.toLocaleString()}</span>
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                        <ArrowUpRight className="h-3 w-3" /> +{recMoM}% vs Jan
                    </div>
                </div>
            </div>

            {/* ── Charts row — Channel perf + Abandonment reasons ─────────────── */}
            <div className="grid gap-5 lg:grid-cols-2">

                {/* Channel performance breakdown */}
                <div
                    className="rounded-2xl p-6 animate-fade-in"
                    style={{ background: "rgba(13,20,33,0.82)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}
                >
                    <div className="flex items-center gap-2 mb-5">
                        <MessageCircle className="h-4 w-4 text-indigo-400" />
                        <h3 className="text-sm font-bold text-white">Recovery by Channel</h3>
                        <span className="ml-auto text-[11px] text-slate-600">Feb 2026</span>
                    </div>
                    <div className="space-y-4">
                        {CHANNEL_PERF.map(ch => (
                            <div key={ch.channel}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full" style={{ background: ch.color }} />
                                        <span className="text-sm font-semibold text-slate-300">{ch.channel}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-slate-500">{ch.recovered} carts</span>
                                        <span
                                            className="text-[10px] font-black px-1.5 py-0.5 rounded"
                                            style={{ background: `rgba(${ch.rgb},0.15)`, color: ch.color, border: `1px solid rgba(${ch.rgb},0.3)` }}
                                        >
                                            {ch.winRate}% win
                                        </span>
                                    </div>
                                </div>
                                <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                                    <div
                                        className="h-full rounded-full transition-all duration-700"
                                        style={{
                                            width: `${(ch.recovered / CHANNEL_PERF[0].recovered) * 100}%`,
                                            background: `linear-gradient(90deg,${ch.color},${ch.color}80)`,
                                            boxShadow: `0 0 8px ${ch.color}50`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Win rate comparison */}
                    <div
                        className="mt-5 pt-4 border-t border-white/[0.06] grid grid-cols-2 gap-3"
                    >
                        <div className="text-center rounded-xl py-3" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.18)" }}>
                            <p className="text-xl font-black text-white">{winRate}%</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">Overall Win Rate</p>
                        </div>
                        <div className="text-center rounded-xl py-3" style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.18)" }}>
                            <p className="text-xl font-black text-white">{chatbotShare}%</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">Via Chatbot</p>
                        </div>
                    </div>
                </div>

                {/* Abandonment reasons */}
                <div
                    className="rounded-2xl p-6 animate-fade-in"
                    style={{ background: "rgba(13,20,33,0.82)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}
                >
                    <div className="flex items-center gap-2 mb-5">
                        <AlertTriangle className="h-4 w-4 text-red-400" />
                        <h3 className="text-sm font-bold text-white">Top Abandonment Reasons</h3>
                    </div>
                    <div className="space-y-4">
                        {ABANDONMENT_REASONS.map(r => (
                            <div key={r.reason}>
                                <div className="flex items-center justify-between mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: r.color }} />
                                        <span className="text-[11px] text-slate-400 truncate">{r.reason}</span>
                                    </div>
                                    <span className="text-xs font-black ml-3 flex-shrink-0" style={{ color: r.color }}>{r.pct}%</span>
                                </div>
                                <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                                    <div
                                        className="h-full rounded-full transition-all duration-700"
                                        style={{
                                            width: `${r.pct}%`,
                                            background: `linear-gradient(90deg,${r.color},${r.color}70)`,
                                            boxShadow: `0 0 6px ${r.color}50`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Chatbot action callout */}
                    <div
                        className="mt-5 p-3 rounded-xl"
                        style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.18)" }}
                    >
                        <p className="text-[11px] font-bold text-indigo-300 mb-0.5">Chatbot Response</p>
                        <p className="text-[10px] text-slate-500 leading-relaxed">
                            For "price shock" (31%) the chatbot auto-offers a{" "}
                            <span className="text-indigo-400 font-semibold">10% discount</span> — converting{" "}
                            <span className="text-white font-semibold">38%</span> of that segment.
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Recent recoveries table ──────────────────────────────────────── */}
            <div
                className="rounded-2xl overflow-hidden animate-fade-in"
                style={{ background: "rgba(13,20,33,0.82)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        <h3 className="text-sm font-bold text-white">Recent Recovered Carts</h3>
                    </div>
                    <span className="text-xs text-slate-500">Last 24 hours</span>
                </div>

                {/* Table header */}
                <div
                    className="grid grid-cols-12 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-600"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.015)" }}
                >
                    <span className="col-span-3">Customer</span>
                    <span className="col-span-4">Product</span>
                    <span className="col-span-2 text-center">Channel</span>
                    <span className="col-span-1 text-right">Value</span>
                    <span className="col-span-1 text-center">Status</span>
                    <span className="col-span-1 text-right">Time</span>
                </div>

                {RECENT_RECOVERIES.map((r, i) => {
                    const ss = STATUS_STYLE[r.status] ?? STATUS_STYLE.Pending
                    const cc = CHANNEL_COLOR[r.channel] ?? "#64748B"
                    const initials = r.customer.split(" ").map(w => w[0]).join("")
                    return (
                        <div
                            key={i}
                            className="grid grid-cols-12 items-center px-6 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group"
                            style={{ borderBottom: i < RECENT_RECOVERIES.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                        >
                            <div className="col-span-3 flex items-center gap-2.5">
                                <div
                                    className="flex h-8 w-8 items-center justify-center rounded-xl flex-shrink-0 text-xs font-bold text-white"
                                    style={{ background: "linear-gradient(135deg,rgba(236,72,153,0.2),rgba(99,102,241,0.15))", border: "1px solid rgba(236,72,153,0.2)" }}
                                >
                                    {initials}
                                </div>
                                <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors truncate">{r.customer}</span>
                            </div>
                            <span className="col-span-4 text-xs text-slate-500 truncate pr-3">{r.product}</span>
                            <div className="col-span-2 flex justify-center">
                                <span
                                    className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                                    style={{ background: `${cc}18`, color: cc, border: `1px solid ${cc}35` }}
                                >
                                    {r.channel}
                                </span>
                            </div>
                            <span className="col-span-1 text-right text-xs font-black text-white">{r.value}</span>
                            <div className="col-span-1 flex justify-center">
                                <span
                                    className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                                    style={{ background: ss.bg, color: ss.text, border: `1px solid ${ss.border}` }}
                                >
                                    {r.status}
                                </span>
                            </div>
                            <span className="col-span-1 text-right text-[10px] text-slate-600">{r.time}</span>
                        </div>
                    )
                })}

                <div
                    className="px-6 py-3 flex items-center justify-between text-xs border-t border-white/[0.04]"
                    style={{ background: "rgba(255,255,255,0.01)" }}
                >
                    <span className="text-slate-600">Showing 6 of {feb.recovered} recoveries this month</span>
                    <button className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">View all →</button>
                </div>
            </div>

            {/* ── AI Insight ───────────────────────────────────────────────────── */}
            <div
                className="flex items-start gap-4 px-5 py-4 rounded-2xl animate-fade-in"
                style={{
                    background: "linear-gradient(135deg,rgba(251,191,36,0.09),rgba(236,72,153,0.04))",
                    border: "1px solid rgba(251,191,36,0.25)",
                }}
            >
                <Sparkles className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white mb-0.5">Quick Win · WhatsApp Opt-In</p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        WhatsApp has your highest win rate at{" "}
                        <span className="text-amber-400 font-semibold">43%</span>, but only{" "}
                        <span className="text-white font-semibold">42%</span> of customers have opted in.
                        Enabling opt-in during checkout could recover{" "}
                        <span className="text-amber-400 font-semibold">~30 additional carts</span> per month, adding{" "}
                        <span className="text-emerald-400 font-semibold">+$4,800/month</span> in recovered revenue.
                    </p>
                </div>
                <button
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-90 active:scale-95"
                    style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)", boxShadow: "0 4px 12px rgba(251,191,36,0.4)", color: "#000" }}
                >
                    <Zap className="h-3.5 w-3.5" /> Enable
                </button>
            </div>

        </div>
    )
}
