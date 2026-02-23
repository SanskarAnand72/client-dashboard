"use client"

import { useState } from "react"
import {
    LineChart, Line, BarChart, Bar, AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Cell, PieChart, Pie, Legend,
} from "recharts"
import {
    Users, Repeat2, Clock, TrendingUp,
    ArrowUpRight, Sparkles, Zap, UserCheck, UserPlus,
    Activity,
} from "lucide-react"

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  DATA  ━━━━━━━━━━━━ */

/** Repeat Purchase Rate — last 8 weeks (%) */
const REPEAT_RATE = [
    { week: "Dec W1", rate: 18, chatbot: 31 },
    { week: "Dec W2", rate: 20, chatbot: 34 },
    { week: "Dec W3", rate: 19, chatbot: 36 },
    { week: "Dec W4", rate: 22, chatbot: 39 },
    { week: "Jan W1", rate: 24, chatbot: 42 },
    { week: "Jan W2", rate: 23, chatbot: 44 },
    { week: "Jan W3", rate: 26, chatbot: 47 },
    { week: "Jan W4", rate: 28, chatbot: 51 },
]

/** New vs Returning — monthly breakdown */
const NEW_VS_RETURNING = [
    { month: "Sep", newC: 820, returning: 310 },
    { month: "Oct", newC: 910, returning: 380 },
    { month: "Nov", newC: 1050, returning: 460 },
    { month: "Dec", newC: 1240, returning: 590 },
    { month: "Jan", newC: 1180, returning: 720 },
    { month: "Feb", newC: 1320, returning: 890 },
]

/** Avg Session Duration (minutes) by interaction type */
const SESSION_DURATION = [
    { type: "Browse Only", avg: 2.1 },
    { type: "Chatbot (no conv)", avg: 3.8 },
    { type: "Chatbot Engaged", avg: 7.4 },
    { type: "Try-On Used", avg: 11.2 },
    { type: "Chatbot + Try-On", avg: 14.6 },
]

const SESSION_COLORS = ["#475569", "#6366F1", "#EC4899", "#34D399", "#FBBF24"]

/** Pie — new vs returning share this month */
const PIE_DATA = [
    { name: "New Customers", value: 1320, color: "#6366F1" },
    { name: "Returning Customers", value: 890, color: "#EC4899" },
]
const TOTAL_CUSTOMERS = PIE_DATA.reduce((s, d) => s + d.value, 0)

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Tooltips  ━━━━━━━━━ */
function RepeatTip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null
    return (
        <div className="rounded-xl px-4 py-3 text-xs min-w-[180px]"
            style={{ background: "#0A1120", border: "1px solid rgba(236,72,153,0.3)", boxShadow: "0 12px 40px rgba(0,0,0,0.6)" }}>
            <p className="font-bold text-white mb-2">{label}</p>
            {payload.map((p: any) => (
                <div key={p.dataKey} className="flex justify-between gap-6 mb-1">
                    <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full" style={{ background: p.stroke }} />
                        <span className="text-slate-500">{p.dataKey === "chatbot" ? "Chatbot Users" : "All Users"}</span>
                    </span>
                    <span className="font-bold text-white">{p.value}%</span>
                </div>
            ))}
        </div>
    )
}

function NewReturnTip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null
    const total = (payload[0]?.value ?? 0) + (payload[1]?.value ?? 0)
    return (
        <div className="rounded-xl px-4 py-3 text-xs min-w-[160px]"
            style={{ background: "#0A1120", border: "1px solid rgba(99,102,241,0.3)", boxShadow: "0 12px 40px rgba(0,0,0,0.6)" }}>
            <p className="font-bold text-white mb-2">{label}</p>
            {payload.map((p: any) => (
                <div key={p.dataKey} className="flex justify-between gap-6 mb-1">
                    <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full" style={{ background: p.fill }} />
                        <span className="text-slate-500">{p.dataKey === "newC" ? "New" : "Returning"}</span>
                    </span>
                    <span className="font-bold text-white">{p.value.toLocaleString()}</span>
                </div>
            ))}
            <div className="mt-2 pt-2 border-t border-white/10 flex justify-between">
                <span className="text-slate-600">Total</span>
                <span className="font-bold text-white">{total.toLocaleString()}</span>
            </div>
        </div>
    )
}

function SessionTip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null
    return (
        <div className="rounded-xl px-4 py-3 text-xs min-w-[180px]"
            style={{ background: "#0A1120", border: "1px solid rgba(52,211,153,0.3)", boxShadow: "0 12px 40px rgba(0,0,0,0.6)" }}>
            <p className="font-bold text-white mb-2">{label}</p>
            <div className="flex justify-between gap-6">
                <span className="text-slate-500">Avg Duration</span>
                <span className="font-bold text-emerald-400">{payload[0]?.value} min</span>
            </div>
        </div>
    )
}

/* custom donut label */
function renderPieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) {
    const RADIAN = Math.PI / 180
    const r = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + r * Math.cos(-midAngle * RADIAN)
    const y = cy + r * Math.sin(-midAngle * RADIAN)
    if (percent < 0.1) return null
    return (
        <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="bold">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Main  ━━━━━━━━ */
export function CustomerBehavior() {
    const latestRate = REPEAT_RATE[REPEAT_RATE.length - 1]
    const prevRate = REPEAT_RATE[REPEAT_RATE.length - 2]
    const rateChange = (latestRate.chatbot - prevRate.chatbot).toFixed(0)
    const febTotal = NEW_VS_RETURNING[NEW_VS_RETURNING.length - 1]
    const returningPct = ((febTotal.returning / (febTotal.newC + febTotal.returning)) * 100).toFixed(0)
    const topSession = SESSION_DURATION[SESSION_DURATION.length - 1]

    return (
        <div className="space-y-8">

            {/* ── Page Header ─────────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">Customer Behavior</h2>
                    <p className="text-sm text-slate-400 mt-0.5">
                        How customers interact with your chatbot — purchase patterns, loyalty &amp; session depth.
                    </p>
                </div>
                <span
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold self-start sm:self-auto"
                    style={{ background: "rgba(236,72,153,0.09)", border: "1px solid rgba(236,72,153,0.22)", color: "#EC4899" }}
                >
                    <Activity className="h-3.5 w-3.5" /> Live · February 2026
                </span>
            </div>

            {/* ── KPI Cards ───────────────────────────────────────────────────── */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    {
                        label: "Repeat Rate (Chatbot)",
                        value: `${latestRate.chatbot}%`,
                        sub: `+${rateChange}pp vs prior week`,
                        icon: Repeat2,
                        color: "#EC4899", rgb: "236,72,153",
                    },
                    {
                        label: "All-User Repeat Rate",
                        value: `${latestRate.rate}%`,
                        sub: "Across all channels",
                        icon: TrendingUp,
                        color: "#6366F1", rgb: "99,102,241",
                    },
                    {
                        label: "Returning Customers",
                        value: `${returningPct}%`,
                        sub: `${febTotal.returning.toLocaleString()} of ${(febTotal.newC + febTotal.returning).toLocaleString()} this month`,
                        icon: UserCheck,
                        color: "#34D399", rgb: "52,211,153",
                    },
                    {
                        label: "Top Session Duration",
                        value: `${topSession.avg} min`,
                        sub: topSession.type,
                        icon: Clock,
                        color: "#FBBF24", rgb: "251,191,36",
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
                        <p className="text-[11px] text-slate-500">{c.sub}</p>
                    </div>
                ))}
            </div>

            {/* ━━━━━━━━━━━━━━  CHART 1 · Repeat Purchase Rate  ━━━━━━━━━━━━━━━ */}
            <div
                className="rounded-2xl overflow-hidden animate-fade-in"
                style={{ background: "rgba(13,20,33,0.82)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}
            >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2">
                        <Repeat2 className="h-4 w-4 text-pink-400" />
                        <h3 className="text-sm font-bold text-white">Repeat Purchase Rate</h3>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Legend */}
                        {[
                            { label: "All Users", color: "#6366F1" },
                            { label: "Chatbot Users", color: "#EC4899" },
                        ].map(l => (
                            <div key={l.label} className="flex items-center gap-1.5">
                                <div className="h-2.5 w-5 rounded-full" style={{ background: l.color, boxShadow: `0 0 6px ${l.color}` }} />
                                <span className="text-[11px] text-slate-500">{l.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6">
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={REPEAT_RATE} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                            <defs>
                                <linearGradient id="lineGradAll" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#6366F1" />
                                    <stop offset="100%" stopColor="#818CF8" />
                                </linearGradient>
                                <linearGradient id="lineGradBot" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#EC4899" />
                                    <stop offset="100%" stopColor="#F472B6" />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="week" tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis
                                tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false}
                                tickFormatter={v => `${v}%`}
                                domain={[0, 60]}
                            />
                            <Tooltip content={<RepeatTip />} />
                            {/* shaded fill under chatbot line */}
                            <defs>
                                <linearGradient id="botFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#EC4899" stopOpacity={0.18} />
                                    <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Line
                                type="monotone"
                                dataKey="rate"
                                stroke="url(#lineGradAll)"
                                strokeWidth={2}
                                dot={{ r: 3, fill: "#6366F1", strokeWidth: 0 }}
                                activeDot={{ r: 5, fill: "#818CF8" }}
                                strokeDasharray="6 3"
                            />
                            <Line
                                type="monotone"
                                dataKey="chatbot"
                                stroke="url(#lineGradBot)"
                                strokeWidth={2.5}
                                dot={{ r: 3.5, fill: "#EC4899", strokeWidth: 0 }}
                                activeDot={{ r: 6, fill: "#F472B6" }}
                                style={{ filter: "drop-shadow(0 0 6px rgba(236,72,153,0.5))" }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Insight strip */}
                <div
                    className="px-6 py-3 flex items-center gap-3 border-t border-white/[0.04]"
                    style={{ background: "rgba(236,72,153,0.04)" }}
                >
                    <ArrowUpRight className="h-3.5 w-3.5 text-pink-400 flex-shrink-0" />
                    <p className="text-[11px] text-slate-400">
                        Chatbot users repeat-purchase at <span className="text-pink-400 font-bold">51%</span> —{" "}
                        <span className="text-white font-semibold">1.8× higher</span> than the store average of {latestRate.rate}%.
                    </p>
                </div>
            </div>

            {/* ━━━━━━━━━━━━━━  CHART 2 · New vs Returning  ━━━━━━━━━━━━━━━━━━━ */}
            <div className="grid gap-5 lg:grid-cols-3">

                {/* Stacked bar — 2/3 */}
                <div
                    className="lg:col-span-2 rounded-2xl overflow-hidden animate-fade-in"
                    style={{ background: "rgba(13,20,33,0.82)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-white/[0.06]">
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-indigo-400" />
                            <h3 className="text-sm font-bold text-white">New vs Returning Customers</h3>
                        </div>
                        <div className="flex items-center gap-4">
                            {[
                                { label: "New", color: "#6366F1" },
                                { label: "Returning", color: "#EC4899" },
                            ].map(l => (
                                <div key={l.label} className="flex items-center gap-1.5">
                                    <div className="h-2.5 w-2.5 rounded-sm" style={{ background: l.color }} />
                                    <span className="text-[11px] text-slate-500">{l.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="p-6">
                        <ResponsiveContainer width="100%" height={240}>
                            <BarChart data={NEW_VS_RETURNING} margin={{ top: 4, right: 4, left: -12, bottom: 0 }} barCategoryGap="28%">
                                <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.04)" vertical={false} />
                                <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
                                <Tooltip content={<NewReturnTip />} cursor={{ fill: "rgba(255,255,255,0.025)" }} />
                                <Bar dataKey="newC" stackId="a" fill="#6366F1" radius={[0, 0, 0, 0]}
                                    style={{ filter: "drop-shadow(0 0 4px rgba(99,102,241,0.4))" }} />
                                <Bar dataKey="returning" stackId="a" fill="#EC4899" radius={[5, 5, 0, 0]}
                                    style={{ filter: "drop-shadow(0 0 5px rgba(236,72,153,0.45))" }} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Donut — 1/3 */}
                <div
                    className="rounded-2xl p-5 animate-fade-in flex flex-col"
                    style={{ background: "rgba(13,20,33,0.82)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}
                >
                    <div className="flex items-center gap-2 mb-0.5">
                        <UserPlus className="h-4 w-4 text-indigo-400" />
                        <h3 className="text-xs font-bold text-white">Feb Share</h3>
                    </div>
                    <p className="text-[10px] text-slate-600 mb-2">new vs returning this month</p>

                    <ResponsiveContainer width="100%" height={190}>
                        <PieChart>
                            <Pie
                                data={PIE_DATA}
                                cx="50%"
                                cy="50%"
                                innerRadius={48}
                                outerRadius={78}
                                dataKey="value"
                                paddingAngle={3}
                                labelLine={false}
                                label={renderPieLabel}
                            >
                                {PIE_DATA.map((d, i) => (
                                    <Cell key={i} fill={d.color} style={{ filter: `drop-shadow(0 0 6px ${d.color}60)` }} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Legend */}
                    <div className="mt-auto space-y-3">
                        {PIE_DATA.map(d => (
                            <div key={d.name} className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <div className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ background: d.color, boxShadow: `0 0 5px ${d.color}` }} />
                                    <span className="text-[11px] text-slate-400">{d.name}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[11px] font-bold text-white">{d.value.toLocaleString()}</span>
                                    <span className="text-[10px] text-slate-600 ml-1">
                                        ({((d.value / TOTAL_CUSTOMERS) * 100).toFixed(0)}%)
                                    </span>
                                </div>
                            </div>
                        ))}
                        <div className="pt-2 border-t border-white/[0.06] flex justify-between text-[11px]">
                            <span className="text-slate-600">Total</span>
                            <span className="font-bold text-white">{TOTAL_CUSTOMERS.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ━━━━━━━━━━━━━━  CHART 3 · Avg Session Duration  ━━━━━━━━━━━━━━━ */}
            <div
                className="rounded-2xl overflow-hidden animate-fade-in"
                style={{ background: "rgba(13,20,33,0.82)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-emerald-400" />
                        <h3 className="text-sm font-bold text-white">Avg Session Duration with Chatbot</h3>
                    </div>
                    <span className="text-[11px] text-slate-500">by interaction type · minutes</span>
                </div>

                <div className="grid lg:grid-cols-3 gap-0">
                    {/* Bar chart */}
                    <div className="lg:col-span-2 p-6">
                        <ResponsiveContainer width="100%" height={240}>
                            <BarChart data={SESSION_DURATION} margin={{ top: 4, right: 8, left: -16, bottom: 0 }} barCategoryGap="30%">
                                <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.04)" vertical={false} />
                                <XAxis
                                    dataKey="type"
                                    tick={{ fill: "#64748B", fontSize: 9 }}
                                    axisLine={false}
                                    tickLine={false}
                                    interval={0}
                                    tickFormatter={v => v.length > 14 ? v.slice(0, 14) + "…" : v}
                                />
                                <YAxis
                                    tick={{ fill: "#64748B", fontSize: 10 }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={v => `${v}m`}
                                    domain={[0, 16]}
                                />
                                <Tooltip content={<SessionTip />} cursor={{ fill: "rgba(255,255,255,0.025)", radius: 4 }} />
                                <Bar dataKey="avg" radius={[6, 6, 0, 0]}>
                                    {SESSION_DURATION.map((_, i) => (
                                        <Cell
                                            key={i}
                                            fill={SESSION_COLORS[i]}
                                            style={{ filter: `drop-shadow(0 0 6px ${SESSION_COLORS[i]}55)` }}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Right: ranked breakdown cards */}
                    <div className="border-l border-white/[0.05] divide-y divide-white/[0.04]">
                        {SESSION_DURATION.slice().reverse().map((s, i) => {
                            const color = SESSION_COLORS[SESSION_DURATION.length - 1 - i]
                            const pct = ((s.avg / topSession.avg) * 100).toFixed(0)
                            return (
                                <div key={s.type} className="px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <p className="text-[11px] font-semibold text-slate-300 truncate pr-2">{s.type}</p>
                                        <span className="text-xs font-black flex-shrink-0" style={{ color }}>
                                            {s.avg}m
                                        </span>
                                    </div>
                                    <div className="h-1.5 w-full rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                                        <div
                                            className="h-full rounded-full transition-all duration-700"
                                            style={{
                                                width: `${pct}%`,
                                                background: `linear-gradient(90deg,${color},${color}88)`,
                                                boxShadow: `0 0 6px ${color}55`,
                                            }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Key insight strip */}
                <div
                    className="px-6 py-3 flex items-center gap-3 border-t border-white/[0.04]"
                    style={{ background: "rgba(52,211,153,0.04)" }}
                >
                    <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                    <p className="text-[11px] text-slate-400">
                        Sessions combining <span className="text-yellow-400 font-bold">Chatbot + Try-On</span> average{" "}
                        <span className="text-emerald-400 font-bold">14.6 min</span> —{" "}
                        <span className="text-white font-semibold">6.9× longer</span> than browse-only sessions.
                    </p>
                </div>
            </div>

            {/* ── Behaviour breakdown cards ────────────────────────────────────── */}
            <div className="grid gap-4 sm:grid-cols-3">
                {[
                    {
                        label: "Chatbot Engagement Rate",
                        value: "68.4%",
                        sub: "Of all site visitors open the chatbot",
                        delta: "+4.2pp MoM",
                        icon: Activity,
                        color: "#EC4899", rgb: "236,72,153",
                    },
                    {
                        label: "Chatbot-to-Purchase",
                        value: "34.1%",
                        sub: "Sessions resulting in an order",
                        delta: "+2.8pp MoM",
                        icon: UserCheck,
                        color: "#34D399", rgb: "52,211,153",
                    },
                    {
                        label: "Avg Messages / Session",
                        value: "8.3",
                        sub: "Before checkout or exit",
                        delta: "+1.1 vs last month",
                        icon: Users,
                        color: "#6366F1", rgb: "99,102,241",
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
                                className="text-[10px] font-bold px-2 py-1 rounded-lg"
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
                    background: "linear-gradient(135deg,rgba(99,102,241,0.10),rgba(236,72,153,0.05))",
                    border: "1px solid rgba(99,102,241,0.25)",
                }}
            >
                <Sparkles className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white mb-0.5">Loyalty Opportunity · Re-engagement</p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        <span className="text-white font-semibold">40% of new customers</span> never return after
                        their first purchase. A chatbot-triggered <span className="text-indigo-400 font-semibold">
                            "Welcome back" flow</span> with a personalised outfit recommendation within 7 days could lift
                        returning customer share from <span className="text-pink-400 font-semibold">{returningPct}%</span> to{" "}
                        <span className="text-emerald-400 font-semibold">~45%</span>, adding an estimated{" "}
                        <span className="text-emerald-400 font-semibold">+$6,200/month</span>.
                    </p>
                </div>
                <button
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 active:scale-95"
                    style={{ background: "linear-gradient(135deg,#6366F1,#EC4899)", boxShadow: "0 4px 12px rgba(99,102,241,0.4)" }}
                >
                    <Zap className="h-3.5 w-3.5" /> Enable Flow
                </button>
            </div>

        </div>
    )
}
