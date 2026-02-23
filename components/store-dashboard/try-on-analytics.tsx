"use client"

import { useState } from "react"
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell,
    AreaChart, Area,
} from "recharts"
import {
    Camera, DollarSign, ShoppingBag, Shirt,
    Star, ArrowUpRight, Sparkles, TrendingUp, Zap,
} from "lucide-react"

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Sample data  ━━━━ */

/** Top tried products */
const TOP_PRODUCTS = [
    { name: "Rose Floral Midi Dress", tries: 312, conv: 44, revenue: 5820, color: "#EC4899" },
    { name: "Banarasi Silk Kurta Set", tries: 278, conv: 41, revenue: 4340, color: "#A78BFA" },
    { name: "Indigo Linen Co-ord", tries: 241, conv: 39, revenue: 3780, color: "#6366F1" },
    { name: "Hand-Block Print Kurti", tries: 204, conv: 34, revenue: 2960, color: "#22D3EE" },
    { name: "Classic White Cotton Tee", tries: 196, conv: 28, revenue: 2160, color: "#34D399" },
    { name: "Embroidered Saree", tries: 168, conv: 42, revenue: 3920, color: "#FBBF24" },
    { name: "Denim Wide-Leg Pants", tries: 145, conv: 26, revenue: 1740, color: "#F87171" },
]

/** Session trend (daily) */
const SESSION_TREND = [
    { day: "Feb 1", sessions: 78 },
    { day: "Feb 5", sessions: 112 },
    { day: "Feb 9", sessions: 148 },
    { day: "Feb 13", sessions: 174 },
    { day: "Feb 17", sessions: 201 },
    { day: "Feb 21", sessions: 231 },
    { day: "Feb 23", sessions: 256 },
]

/** Category breakdown */
const CATEGORIES = [
    { name: "Dresses", tries: 890, conv: 38, color: "#EC4899", rgb: "236,72,153" },
    { name: "Kurtas", tries: 680, conv: 35, color: "#A78BFA", rgb: "167,139,250" },
    { name: "Tops", tries: 520, conv: 28, color: "#6366F1", rgb: "99,102,241" },
    { name: "Denim", tries: 410, conv: 24, color: "#22D3EE", rgb: "34,211,238" },
    { name: "Sarees", tries: 341, conv: 42, color: "#FBBF24", rgb: "251,191,36" },
    { name: "Activewear", tries: 210, conv: 20, color: "#34D399", rgb: "52,211,153" },
]

const MAX_TRIES = Math.max(...TOP_PRODUCTS.map(p => p.tries))
const MAX_CAT = Math.max(...CATEGORIES.map(c => c.tries))

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Tooltips  ━━━━━━━━━ */
function BarTip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null
    const product = TOP_PRODUCTS.find(p => p.name === label)
    return (
        <div
            className="rounded-xl px-4 py-3 text-xs min-w-[200px]"
            style={{
                background: "#0A1120",
                border: "1px solid rgba(167,139,250,0.35)",
                boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
            }}
        >
            <p className="font-bold text-white mb-2 leading-snug">{label}</p>
            <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-5">
                    <span className="flex items-center gap-1.5">
                        <Camera className="h-3 w-3 text-violet-400" />
                        <span className="text-slate-500">Try-On sessions</span>
                    </span>
                    <span className="font-bold text-white">{payload[0]?.value}</span>
                </div>
                {product && (
                    <>
                        <div className="flex items-center justify-between gap-5">
                            <span className="flex items-center gap-1.5">
                                <TrendingUp className="h-3 w-3 text-emerald-400" />
                                <span className="text-slate-500">Conversion</span>
                            </span>
                            <span className="font-bold text-emerald-400">{product.conv}%</span>
                        </div>
                        <div className="flex items-center justify-between gap-5">
                            <span className="flex items-center gap-1.5">
                                <DollarSign className="h-3 w-3 text-pink-400" />
                                <span className="text-slate-500">Revenue</span>
                            </span>
                            <span className="font-bold text-pink-400">${product.revenue.toLocaleString()}</span>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

function TrendTip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null
    return (
        <div
            className="rounded-xl px-4 py-3 text-xs"
            style={{
                background: "#0A1120",
                border: "1px solid rgba(167,139,250,0.3)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            }}
        >
            <p className="font-bold text-slate-300 mb-1.5">{label}</p>
            <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-violet-400" />
                <span className="text-slate-500">Sessions</span>
                <span className="font-bold text-white ml-auto pl-4">{payload[0]?.value}</span>
            </div>
        </div>
    )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Stat card  ━━━━━ */
interface CardProps {
    label: string
    sublabel: string
    value: string
    badge: string
    badgeColor: string
    badgeRgb: string
    icon: React.ElementType
    color: string
    rgb: string
    delay?: number
}

function StatCard({ label, sublabel, value, badge, badgeColor, badgeRgb, icon: Icon, color, rgb, delay = 0 }: CardProps) {
    const [hov, setHov] = useState(false)
    return (
        <div
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            className="relative rounded-2xl p-5 overflow-hidden cursor-pointer transition-all duration-300 animate-fade-in-up"
            style={{
                background: hov
                    ? `linear-gradient(145deg,rgba(${rgb},0.14) 0%,rgba(13,20,33,0.97) 100%)`
                    : "rgba(13,20,33,0.78)",
                border: hov
                    ? `1px solid rgba(${rgb},0.42)`
                    : "1px solid rgba(255,255,255,0.07)",
                boxShadow: hov
                    ? `0 0 0 1px rgba(${rgb},0.1), 0 16px 44px rgba(0,0,0,0.55)`
                    : "0 4px 24px rgba(0,0,0,0.3)",
                backdropFilter: "blur(16px)",
                transform: hov ? "translateY(-2px)" : "translateY(0)",
                animationDelay: `${delay}ms`,
            }}
        >
            {/* Glow blob */}
            <div
                className="absolute -top-8 -right-8 h-32 w-32 rounded-full pointer-events-none transition-opacity duration-300"
                style={{
                    background: `radial-gradient(circle,${color},transparent 70%)`,
                    opacity: hov ? 0.14 : 0.06,
                }}
            />

            <div className="relative z-10">
                {/* Icon */}
                <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl mb-4 transition-all duration-300"
                    style={{
                        background: `rgba(${rgb},0.12)`,
                        border: `1px solid rgba(${rgb},0.28)`,
                        boxShadow: hov ? `0 0 18px rgba(${rgb},0.3)` : "none",
                    }}
                >
                    <Icon className="h-5 w-5" style={{ color }} />
                </div>

                {/* Value */}
                <p className="text-[2.1rem] font-black text-white tracking-tight leading-none mb-1">
                    {value}
                </p>
                <p className="text-sm font-semibold text-slate-300 leading-snug">{label}</p>
                <p className="text-[11px] text-slate-500 mt-0.5 mb-4">{sublabel}</p>

                {/* Badge */}
                <span
                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold"
                    style={{
                        background: `rgba(${badgeRgb},0.12)`,
                        color: badgeColor,
                        border: `1px solid rgba(${badgeRgb},0.28)`,
                    }}
                >
                    <ArrowUpRight className="h-3 w-3" />
                    {badge}
                </span>
            </div>
        </div>
    )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Custom label  ━━━━ */
function ConvLabel(props: any) {
    const { x, y, width, index } = props
    const product = TOP_PRODUCTS[index]
    return (
        <text
            x={x + width + 6}
            y={y + 12}
            fill="#34D399"
            fontSize={10}
            fontWeight={800}
        >
            {product.conv}%
        </text>
    )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Main  ━━━━━━━━ */
export function TryOnAnalytics() {
    const [hoverIdx, setHoverIdx] = useState<number | null>(null)

    const totalSessions = 2841
    const totalRevenue = 24720
    const purchaseRate = 33.9        // %
    const topCategory = "Dresses"

    return (
        <div className="space-y-8">

            {/* ── Header ──────────────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">Try-On Impact</h2>
                    <p className="text-sm text-slate-400 mt-0.5">
                        AI-powered virtual fitting room — sessions, conversions &amp; revenue.
                    </p>
                </div>
                <span
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold self-start sm:self-auto"
                    style={{ background: "rgba(167,139,250,0.09)", border: "1px solid rgba(167,139,250,0.25)", color: "#A78BFA" }}
                >
                    <Camera className="h-3.5 w-3.5" /> Avg Fit Score 4.7 ★
                </span>
            </div>

            {/* ── 4 stat cards ────────────────────────────────────────────────── */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label="Total Try-On Sessions"
                    sublabel="AI fitting room opens this month"
                    value="2,841"
                    badge="+44.7% vs last month"
                    badgeColor="#A78BFA"
                    badgeRgb="167,139,250"
                    icon={Camera}
                    color="#A78BFA"
                    rgb="167,139,250"
                    delay={0}
                />
                <StatCard
                    label="Try-On → Purchase Rate"
                    sublabel="Sessions converting to orders"
                    value={`${purchaseRate}%`}
                    badge="2.1× higher than avg"
                    badgeColor="#34D399"
                    badgeRgb="52,211,153"
                    icon={TrendingUp}
                    color="#34D399"
                    rgb="52,211,153"
                    delay={60}
                />
                <StatCard
                    label="Revenue from Try-On"
                    sublabel="Chatbot-attributed try-on sales"
                    value={`$${(totalRevenue / 1000).toFixed(1)}K`}
                    badge="+$6,480 vs last month"
                    badgeColor="#EC4899"
                    badgeRgb="236,72,153"
                    icon={DollarSign}
                    color="#EC4899"
                    rgb="236,72,153"
                    delay={120}
                />
                <StatCard
                    label="Most Tried Category"
                    sublabel="Dresses — 890 try-ons · 38% conv."
                    value={topCategory}
                    badge="#1 performing category"
                    badgeColor="#FBBF24"
                    badgeRgb="251,191,36"
                    icon={Shirt}
                    color="#FBBF24"
                    rgb="251,191,36"
                    delay={180}
                />
            </div>

            {/* ── Charts row ──────────────────────────────────────────────────── */}
            <div className="grid gap-5 lg:grid-cols-3">

                {/* BAR CHART: Top tried products (2/3 width) */}
                <div
                    className="lg:col-span-2 rounded-2xl overflow-hidden animate-fade-in"
                    style={{
                        background: "rgba(13,20,33,0.82)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        backdropFilter: "blur(20px)",
                    }}
                >
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                        <div className="flex items-center gap-2">
                            <BarChart2Icon className="h-4 w-4 text-violet-400" />
                            <div>
                                <h3 className="text-sm font-bold text-white">Top Tried Products</h3>
                                <p className="text-[11px] text-slate-500 mt-0.5">
                                    Try-on count · green label = conversion rate
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="px-2 py-6">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={TOP_PRODUCTS}
                                layout="vertical"
                                barCategoryGap="22%"
                                margin={{ top: 0, right: 56, left: 8, bottom: 0 }}
                                onMouseMove={s => {
                                    if (s.isTooltipActive) setHoverIdx(s.activeTooltipIndex ?? null)
                                    else setHoverIdx(null)
                                }}
                                onMouseLeave={() => setHoverIdx(null)}
                            >
                                <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                                <XAxis
                                    type="number"
                                    tick={{ fill: "#64748B", fontSize: 10 }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={v => `${v}`}
                                />
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    tick={{ fill: "#94A3B8", fontSize: 10 }}
                                    axisLine={false}
                                    tickLine={false}
                                    width={165}
                                    tickFormatter={v => v.length > 22 ? v.slice(0, 22) + "…" : v}
                                />
                                <Tooltip content={<BarTip />} cursor={{ fill: "rgba(255,255,255,0.025)", radius: 4 }} />
                                <Bar dataKey="tries" radius={[0, 6, 6, 0]} label={<ConvLabel />}>
                                    {TOP_PRODUCTS.map((p, i) => (
                                        <Cell
                                            key={i}
                                            fill={p.color}
                                            opacity={hoverIdx === null || hoverIdx === i ? 1 : 0.35}
                                            style={{ filter: `drop-shadow(0 0 5px ${p.color}60)`, transition: "opacity 0.2s" }}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Session trend area + category mini-list (1/3) */}
                <div className="flex flex-col gap-5">

                    {/* Session trend */}
                    <div
                        className="rounded-2xl overflow-hidden animate-fade-in flex-1"
                        style={{
                            background: "rgba(13,20,33,0.82)",
                            border: "1px solid rgba(255,255,255,0.07)",
                            backdropFilter: "blur(20px)",
                        }}
                    >
                        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06]">
                            <TrendingUp className="h-4 w-4 text-violet-400" />
                            <h3 className="text-xs font-bold text-white">Daily Sessions</h3>
                        </div>
                        <div className="px-3 py-4">
                            <ResponsiveContainer width="100%" height={130}>
                                <AreaChart data={SESSION_TREND} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="tryonGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.35} />
                                            <stop offset="95%" stopColor="#A78BFA" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.04)" />
                                    <XAxis
                                        dataKey="day"
                                        tick={{ fill: "#64748B", fontSize: 9 }}
                                        axisLine={false}
                                        tickLine={false}
                                        interval={2}
                                    />
                                    <YAxis
                                        tick={{ fill: "#64748B", fontSize: 9 }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip content={<TrendTip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="sessions"
                                        stroke="#A78BFA"
                                        strokeWidth={2}
                                        fill="url(#tryonGrad)"
                                        dot={false}
                                        style={{ filter: "drop-shadow(0 0 4px rgba(167,139,250,0.6))" }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                            <div className="mt-3 flex items-baseline justify-between px-1">
                                <span className="text-[10px] text-slate-600">Feb 1</span>
                                <span className="text-sm font-black text-violet-400">256 <span className="text-[10px] font-normal text-slate-500">today</span></span>
                                <span className="text-[10px] text-slate-600">Feb 23</span>
                            </div>
                        </div>
                    </div>

                    {/* Category mini-breakdown */}
                    <div
                        className="rounded-2xl p-5 animate-fade-in"
                        style={{
                            background: "rgba(13,20,33,0.82)",
                            border: "1px solid rgba(255,255,255,0.07)",
                            backdropFilter: "blur(20px)",
                        }}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Shirt className="h-4 w-4 text-pink-400" />
                            <h3 className="text-xs font-bold text-white">By Category</h3>
                        </div>
                        <div className="space-y-3">
                            {CATEGORIES.map(cat => (
                                <div key={cat.name}>
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-1.5">
                                            <span
                                                className="h-2 w-2 rounded-full flex-shrink-0"
                                                style={{ background: cat.color, boxShadow: `0 0 5px ${cat.color}` }}
                                            />
                                            <span className="text-[11px] font-medium text-slate-400">{cat.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-slate-600">{cat.tries}</span>
                                            <span className="text-[10px] font-bold" style={{ color: cat.color }}>{cat.conv}%</span>
                                        </div>
                                    </div>
                                    <div
                                        className="h-1.5 w-full rounded-full overflow-hidden"
                                        style={{ background: "rgba(255,255,255,0.05)" }}
                                    >
                                        <div
                                            className="h-full rounded-full"
                                            style={{
                                                width: `${(cat.tries / MAX_CAT) * 100}%`,
                                                background: `linear-gradient(90deg,${cat.color},${cat.color}80)`,
                                                boxShadow: `0 0 6px ${cat.color}50`,
                                                transition: "width 1.2s cubic-bezier(.4,0,.2,1)",
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* ── Product leaderboard table ────────────────────────────────────── */}
            <div
                className="rounded-2xl overflow-hidden animate-fade-in"
                style={{
                    background: "rgba(13,20,33,0.82)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    backdropFilter: "blur(20px)",
                }}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-amber-400" />
                        <h3 className="text-sm font-bold text-white">Product Try-On Leaderboard</h3>
                    </div>
                    <button className="text-xs font-medium text-slate-500 hover:text-indigo-400 transition-colors">
                        Export CSV →
                    </button>
                </div>

                {/* Table header */}
                <div
                    className="grid grid-cols-12 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-600"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.015)" }}
                >
                    <span className="col-span-1">#</span>
                    <span className="col-span-4">Product</span>
                    <span className="col-span-2 text-right">Try-Ons</span>
                    <span className="col-span-2 text-right">Conv. Rate</span>
                    <span className="col-span-2 text-right">Revenue</span>
                    <span className="col-span-1 text-right">Share</span>
                </div>

                {/* Rows */}
                {TOP_PRODUCTS.map((p, i) => {
                    const rankColors = ["#FBBF24", "#9CA3AF", "#CD7F32"]
                    const rankColor = rankColors[i] ?? "#475569"
                    return (
                        <div
                            key={p.name}
                            className="grid grid-cols-12 items-center px-6 py-3.5 transition-colors hover:bg-white/[0.02] cursor-pointer group"
                            style={{ borderBottom: i < TOP_PRODUCTS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                        >
                            {/* Rank */}
                            <span className="col-span-1 text-base font-black" style={{ color: rankColor }}>
                                {i + 1}
                            </span>

                            {/* Product */}
                            <div className="col-span-4 flex items-center gap-2.5">
                                <div
                                    className="flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0"
                                    style={{
                                        background: `rgba(${p.color.replace("#", "").match(/.{2}/g)?.map(h => parseInt(h, 16)).join(",")},0.12)` ?? "rgba(255,255,255,0.05)",
                                        border: `1px solid ${p.color}30`,
                                    }}
                                >
                                    <Shirt className="h-4 w-4" style={{ color: p.color }} />
                                </div>
                                <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors leading-snug">
                                    {p.name}
                                </span>
                            </div>

                            {/* Try-ons */}
                            <span className="col-span-2 text-right text-xs font-bold text-white">
                                {p.tries.toLocaleString()}
                            </span>

                            {/* Conv rate */}
                            <div className="col-span-2 flex justify-end">
                                <span
                                    className="text-xs font-black px-2 py-0.5 rounded-lg"
                                    style={{
                                        background: "rgba(52,211,153,0.1)",
                                        color: "#34D399",
                                        border: "1px solid rgba(52,211,153,0.2)",
                                    }}
                                >
                                    {p.conv}%
                                </span>
                            </div>

                            {/* Revenue */}
                            <span className="col-span-2 text-right text-xs font-bold text-white">
                                ${p.revenue.toLocaleString()}
                            </span>

                            {/* Bar share */}
                            <div className="col-span-1 flex justify-end items-center">
                                <div className="w-12 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                                    <div
                                        className="h-full rounded-full"
                                        style={{
                                            width: `${(p.tries / MAX_TRIES) * 100}%`,
                                            background: `linear-gradient(90deg,${p.color},${p.color}80)`,
                                            boxShadow: `0 0 5px ${p.color}60`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )
                })}

                {/* Footer */}
                <div
                    className="px-6 py-3 flex items-center justify-between text-xs border-t border-white/[0.04]"
                    style={{ background: "rgba(255,255,255,0.01)" }}
                >
                    <span className="text-slate-600">Showing 7 of {TOP_PRODUCTS.length} products</span>
                    <button className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                        View all products →
                    </button>
                </div>
            </div>

            {/* ── AI insight ──────────────────────────────────────────────────── */}
            <div
                className="flex items-start gap-4 px-5 py-4 rounded-2xl animate-fade-in"
                style={{
                    background: "linear-gradient(135deg,rgba(167,139,250,0.08) 0%,rgba(236,72,153,0.04) 100%)",
                    border: "1px solid rgba(167,139,250,0.22)",
                }}
            >
                <Sparkles className="h-5 w-5 text-violet-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white mb-0.5">Try-On Boosts Conversion 2.1×</p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Shoppers who use the virtual fitting room convert at&nbsp;
                        <span className="text-violet-400 font-semibold">33.9%</span>, vs&nbsp;
                        <span className="text-slate-400">16.2%</span> for those who don't.
                        Promoting Try-On earlier on the product page (above the fold) could add an estimated&nbsp;
                        <span className="text-violet-400 font-semibold">+840 sessions/month</span>, translating to
                        ~<span className="text-emerald-400 font-semibold">$7,200 extra revenue</span>.
                    </p>
                </div>
                <button
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 active:scale-95 whitespace-nowrap"
                    style={{
                        background: "linear-gradient(135deg,#A78BFA,#7C3AED)",
                        boxShadow: "0 4px 12px rgba(167,139,250,0.4)",
                    }}
                >
                    <Zap className="h-3.5 w-3.5" /> Enable
                </button>
            </div>

        </div>
    )
}

/* tiny icon helper so we don't import BarChart2 from recharts */
function BarChart2Icon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
            <line x1="2" y1="20" x2="22" y2="20" />
        </svg>
    )
}
