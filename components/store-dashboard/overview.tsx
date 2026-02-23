"use client"

import { useState } from "react"
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts"
import {
    ShoppingBag, DollarSign, TrendingUp, RefreshCw,
    Shirt, CreditCard, ArrowUpRight, ArrowDownRight,
    Sparkles, Zap, Activity, Star,
} from "lucide-react"

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Sparkline  ━━ */
function Sparkline({ data, color, height = 40 }: { data: number[]; color: string; height?: number }) {
    const max = Math.max(...data), min = Math.min(...data), range = max - min || 1
    const W = 100, H = height, step = W / (data.length - 1)
    const pts = data.map((v, i) => `${(i * step).toFixed(1)},${(H - ((v - min) / range) * (H - 4) - 2).toFixed(1)}`)
    const path = `M ${pts.join(" L ")}`
    const area = `M 0,${H} L ${pts.join(" L ")} L ${W},${H} Z`
    const gid = `sg-${color.replace(/[^a-zA-Z0-9]/g, "")}`
    return (
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: "100%", height }}>
            <defs>
                <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
            </defs>
            <path d={area} fill={`url(#${gid})`} />
            <path d={path} fill="none" stroke={color} strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 3px ${color}90)` }} />
            <circle
                cx={(data.length - 1) * step}
                cy={H - ((data[data.length - 1] - min) / range) * (H - 4) - 2}
                r={3} fill={color}
                style={{ filter: `drop-shadow(0 0 5px ${color})` }}
            />
        </svg>
    )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Ring gauge  ━━ */
function RingGauge({ pct, color, size = 52 }: { pct: number; color: string; size?: number }) {
    const r = (size - 10) / 2
    const circ = 2 * Math.PI * r
    return (
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
            <circle cx={size / 2} cy={size / 2} r={r} fill="none"
                stroke="rgba(255,255,255,0.06)" strokeWidth={6} />
            <circle cx={size / 2} cy={size / 2} r={r} fill="none"
                stroke={color} strokeWidth={6}
                strokeDasharray={circ}
                strokeDashoffset={circ - (pct / 100) * circ}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)", filter: `drop-shadow(0 0 5px ${color}90)` }}
            />
        </svg>
    )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Chart data   ━━ */
const REVENUE_DAILY = [
    { day: "Feb 1", chatbot: 1510, organic: 4200 },
    { day: "Feb 5", chatbot: 2380, organic: 4800 },
    { day: "Feb 9", chatbot: 3100, organic: 4600 },
    { day: "Feb 13", chatbot: 4020, organic: 5300 },
    { day: "Feb 17", chatbot: 5140, organic: 5100 },
    { day: "Feb 21", chatbot: 6120, organic: 5800 },
    { day: "Feb 23", chatbot: 6850, organic: 6100 },
]

const CONV_WEEKLY = [
    { week: "Wk 1", before: 1.6, after: 2.9 },
    { week: "Wk 2", before: 1.9, after: 3.2 },
    { week: "Wk 3", before: 2.1, after: 3.8 },
    { week: "Wk 4", before: 2.3, after: 4.2 },
]

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Card configs  ━━ */
interface StatCard {
    id: string
    label: string
    sublabel: string
    value: string
    change: number        // positive = up
    changeLabel: string
    icon: React.ElementType
    color: string
    rgb: string
    pct: number           // ring fill
    sparkline: number[]
    meta: { label: string; value: string }[]
    highlight?: boolean   // true for the revenue card
}

const CARDS: StatCard[] = [
    /* ── 1. Revenue — HIGHLIGHTED ───────────────────────────── */
    {
        id: "revenue",
        label: "Revenue via Chatbot",
        sublabel: "Chatbot-attributed this month",
        value: "$48,320",
        change: 24.6,
        changeLabel: "+$9,430 vs last mo.",
        icon: DollarSign,
        color: "#34D399",
        rgb: "52,211,153",
        pct: 78,
        sparkline: [22, 30, 27, 38, 46, 42, 55, 61, 65, 72, 76, 80],
        meta: [
            { label: "Avg order value", value: "$127" },
            { label: "Of total revenue", value: "54%" },
        ],
        highlight: true,
    },
    /* ── 2. Orders ───────────────────────────────────────────── */
    {
        id: "orders",
        label: "Total Orders via Chatbot",
        sublabel: "Orders initiated by bot sessions",
        value: "386",
        change: 18.2,
        changeLabel: "361 completed · 25 pending",
        icon: ShoppingBag,
        color: "#6366F1",
        rgb: "99,102,241",
        pct: 62,
        sparkline: [18, 22, 20, 27, 30, 28, 36, 39, 40, 44, 47, 51],
        meta: [
            { label: "Completion rate", value: "93.5%" },
            { label: "Multi-item orders", value: "48%" },
        ],
    },
    /* ── 3. Conversion Rate ──────────────────────────────────── */
    {
        id: "conversion",
        label: "Conversion Rate Increase",
        sublabel: "Store avg — AI-assisted sessions",
        value: "+100%",
        change: 1.9,
        changeLabel: "From 1.9% → 3.8% with AI",
        icon: TrendingUp,
        color: "#EC4899",
        rgb: "236,72,153",
        pct: 76,
        sparkline: [15, 18, 17, 22, 24, 23, 28, 30, 31, 34, 36, 38],
        meta: [
            { label: "Before chatbot", value: "1.9%" },
            { label: "With chatbot", value: "3.8%" },
        ],
    },
    /* ── 4. Cart Recovery ────────────────────────────────────── */
    {
        id: "cart",
        label: "Cart Recovery via Bot",
        sublabel: "Abandoned carts saved this month",
        value: "124 carts",
        change: 31.4,
        changeLabel: "$15,748 in revenue saved",
        icon: RefreshCw,
        color: "#FBBF24",
        rgb: "251,191,36",
        pct: 82,
        sparkline: [8, 12, 10, 16, 19, 17, 24, 27, 28, 32, 34, 36],
        meta: [
            { label: "Win rate", value: "41%" },
            { label: "Via WhatsApp", value: "52 carts" },
        ],
    },
    /* ── 5. Try-On Assisted Sales ────────────────────────────── */
    {
        id: "tryon",
        label: "Try-On Assisted Sales",
        sublabel: "Virtual try-on → purchase conversions",
        value: "964",
        change: 44.7,
        changeLabel: "2,841 sessions · 34% conv.",
        icon: Shirt,
        color: "#A78BFA",
        rgb: "167,139,250",
        pct: 91,
        sparkline: [30, 42, 38, 55, 64, 60, 72, 78, 81, 88, 92, 97],
        meta: [
            { label: "Avg fit score", value: "4.7★" },
            { label: "Try-On revenue", value: "$19,640" },
        ],
    },
    /* ── 6. Avg Order Value ──────────────────────────────────── */
    {
        id: "aov",
        label: "Avg Order Value via Bot",
        sublabel: "Per chatbot-assisted transaction",
        value: "$127",
        change: 12.3,
        changeLabel: "+$14 vs organic avg ($113)",
        icon: CreditCard,
        color: "#22D3EE",
        rgb: "34,211,238",
        pct: 68,
        sparkline: [60, 65, 63, 70, 74, 72, 80, 83, 85, 88, 90, 92],
        meta: [
            { label: "Store overall AOV", value: "$113" },
            { label: "Upsell success", value: "28%" },
        ],
    },
]

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Stat card  ━━━ */
function StatCard({ card }: { card: StatCard }) {
    const [hov, setHov] = useState(false)
    const Icon = card.icon
    const isUp = card.change >= 0

    /* ─ HIGHLIGHTED revenue card ─ */
    if (card.highlight) {
        return (
            <div
                onMouseEnter={() => setHov(true)}
                onMouseLeave={() => setHov(false)}
                className="relative rounded-2xl p-6 overflow-hidden col-span-full lg:col-span-2 xl:col-span-2 cursor-pointer transition-all duration-300"
                style={{
                    background: hov
                        ? "linear-gradient(145deg,rgba(52,211,153,0.22) 0%,rgba(34,197,94,0.06) 40%,rgba(13,20,33,0.98) 100%)"
                        : "linear-gradient(145deg,rgba(52,211,153,0.14) 0%,rgba(13,20,33,0.97) 100%)",
                    border: hov
                        ? "1px solid rgba(52,211,153,0.55)"
                        : "1px solid rgba(52,211,153,0.35)",
                    boxShadow: hov
                        ? "0 0 0 1px rgba(52,211,153,0.15), 0 20px 60px rgba(0,0,0,0.6), 0 0 80px rgba(52,211,153,0.08)"
                        : "0 0 0 1px rgba(52,211,153,0.08), 0 12px 40px rgba(0,0,0,0.45), 0 0 50px rgba(52,211,153,0.06)",
                    backdropFilter: "blur(20px)",
                    transform: hov ? "translateY(-3px)" : "translateY(0)",
                }}
            >
                {/* Background glow circles */}
                <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full pointer-events-none"
                    style={{ background: "radial-gradient(circle,rgba(52,211,153,0.18),transparent 70%)", transition: "opacity 0.4s", opacity: hov ? 1 : 0.6 }} />
                <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full pointer-events-none"
                    style={{ background: "radial-gradient(circle,rgba(16,185,129,0.1),transparent 70%)" }} />

                {/* "FEATURED" badge */}
                <span className="absolute top-4 right-4 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg"
                    style={{ background: "rgba(52,211,153,0.15)", color: "#34D399", border: "1px solid rgba(52,211,153,0.35)" }}>
                    ★ TOP METRIC
                </span>

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-start gap-6">
                    {/* Left column */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex h-13 w-13 items-center justify-center rounded-xl"
                                style={{
                                    background: "rgba(52,211,153,0.15)",
                                    border: "1px solid rgba(52,211,153,0.35)",
                                    boxShadow: "0 0 20px rgba(52,211,153,0.3)",
                                    width: 52, height: 52,
                                }}>
                                <Icon className="h-6 w-6 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-base font-bold text-white leading-tight">{card.label}</p>
                                <p className="text-[11px] text-slate-400">{card.sublabel}</p>
                            </div>
                        </div>

                        <p className="text-5xl font-black text-white tracking-tight leading-none mb-1"
                            style={{ textShadow: "0 0 40px rgba(52,211,153,0.35)" }}>
                            {card.value}
                        </p>

                        <div className="flex items-center gap-3 mt-3 mb-5">
                            <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold"
                                style={{ background: "rgba(52,211,153,0.15)", color: "#34D399", border: "1px solid rgba(52,211,153,0.3)" }}>
                                <ArrowUpRight className="h-3.5 w-3.5" />
                                +{card.change}% this month
                            </span>
                            <span className="text-xs text-slate-500">{card.changeLabel}</span>
                        </div>

                        {/* Sparkline */}
                        <Sparkline data={card.sparkline} color={card.color} height={52} />
                    </div>

                    {/* Right column — ring + meta */}
                    <div className="flex flex-row sm:flex-col items-center sm:items-end gap-4 sm:gap-6 flex-shrink-0">
                        <div className="relative flex items-center justify-center">
                            <RingGauge pct={card.pct} color={card.color} size={88} />
                            <div className="absolute flex flex-col items-center">
                                <span className="text-lg font-black text-emerald-400 leading-none">{card.pct}%</span>
                                <span className="text-[9px] text-slate-600 leading-none mt-0.5">of goal</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {card.meta.map(m => (
                                <div key={m.label} className="text-right">
                                    <p className="text-[10px] text-slate-600">{m.label}</p>
                                    <p className="text-sm font-black text-white">{m.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    /* ─ Standard cards ─ */
    return (
        <div
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            className="relative rounded-2xl p-5 overflow-hidden cursor-pointer transition-all duration-300 animate-fade-in-up"
            style={{
                background: hov
                    ? `linear-gradient(145deg,rgba(${card.rgb},0.13) 0%,rgba(13,20,33,0.97) 100%)`
                    : "rgba(13,20,33,0.78)",
                border: hov
                    ? `1px solid rgba(${card.rgb},0.4)`
                    : "1px solid rgba(255,255,255,0.07)",
                boxShadow: hov
                    ? `0 0 0 1px rgba(${card.rgb},0.1), 0 16px 44px rgba(0,0,0,0.55)`
                    : "0 4px 24px rgba(0,0,0,0.3)",
                backdropFilter: "blur(16px)",
                transform: hov ? "translateY(-2px)" : "translateY(0)",
            }}
        >
            {/* Glow blob */}
            <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full pointer-events-none transition-opacity duration-400"
                style={{ background: `radial-gradient(circle,${card.color},transparent 70%)`, opacity: hov ? 0.13 : 0.06 }} />

            <div className="relative z-10">
                {/* Icon + Ring */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl flex-shrink-0 transition-all duration-300"
                        style={{
                            background: `rgba(${card.rgb},0.12)`,
                            border: `1px solid rgba(${card.rgb},0.25)`,
                            boxShadow: hov ? `0 0 16px rgba(${card.rgb},0.28)` : "none",
                        }}>
                        <Icon className="h-5 w-5" style={{ color: card.color }} />
                    </div>
                    <div className="relative flex items-center justify-center">
                        <RingGauge pct={card.pct} color={card.color} size={52} />
                        <span className="absolute text-[10px] font-black" style={{ color: card.color }}>{card.pct}%</span>
                    </div>
                </div>

                {/* Value + label */}
                <p className="text-[2.15rem] font-black text-white tracking-tight leading-none mb-0.5">{card.value}</p>
                <p className="text-sm font-semibold text-slate-300 leading-snug">{card.label}</p>
                <p className="text-[11px] text-slate-500 mb-4 mt-0.5">{card.sublabel}</p>

                {/* Sparkline */}
                <div className="mb-4">
                    <Sparkline data={card.sparkline} color={card.color} height={40} />
                </div>

                {/* Divider */}
                <div className="h-px" style={{ background: `rgba(${card.rgb},0.15)` }} />

                {/* Trend badge + label */}
                <div className="flex items-center gap-2 mt-3">
                    <span className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold"
                        style={isUp
                            ? { background: "rgba(52,211,153,0.12)", color: "#34D399", border: "1px solid rgba(52,211,153,0.25)" }
                            : { background: "rgba(248,113,113,0.12)", color: "#F87171", border: "1px solid rgba(248,113,113,0.25)" }}>
                        {isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {isUp ? "+" : ""}{card.change}%
                    </span>
                    <span className="text-[11px] text-slate-600 truncate">{card.changeLabel}</span>
                </div>

                {/* Meta row */}
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/[0.05]">
                    {card.meta.map(m => (
                        <div key={m.label}>
                            <p className="text-[10px] text-slate-600">{m.label}</p>
                            <p className="text-xs font-bold text-white">{m.value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Chart tooltips  ━━━━━━━ */
function RevTip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null
    return (
        <div className="rounded-xl px-4 py-3 text-xs space-y-1.5"
            style={{ background: "#0D1828", border: "1px solid rgba(52,211,153,0.3)", boxShadow: "0 8px 32px rgba(0,0,0,0.55)" }}>
            <p className="font-bold text-slate-300 mb-2">{label}</p>
            {payload.map((p: any) => (
                <div key={p.name} className="flex items-center justify-between gap-6">
                    <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
                        <span className="text-slate-500">{p.name === "chatbot" ? "AI Chatbot" : "Organic"}</span>
                    </span>
                    <span className="font-bold text-white">${p.value.toLocaleString()}</span>
                </div>
            ))}
        </div>
    )
}

function ConvTip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null
    return (
        <div className="rounded-xl px-4 py-3 text-xs space-y-1.5"
            style={{ background: "#0D1828", border: "1px solid rgba(236,72,153,0.3)", boxShadow: "0 8px 32px rgba(0,0,0,0.55)" }}>
            <p className="font-bold text-slate-300 mb-2">{label}</p>
            {payload.map((p: any) => (
                <div key={p.name} className="flex items-center justify-between gap-6">
                    <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
                        <span className="text-slate-500">{p.name === "before" ? "Before AI" : "With AI"}</span>
                    </span>
                    <span className="font-bold text-white">{p.value}%</span>
                </div>
            ))}
        </div>
    )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Period toggle  ━━━━━━━━━ */
function PeriodToggle({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    return (
        <div className="inline-flex rounded-xl p-1 gap-1"
            style={{ background: "rgba(13,20,33,0.85)", border: "1px solid rgba(255,255,255,0.07)" }}>
            {(["7d", "30d", "90d"] as const).map(p => (
                <button key={p} onClick={() => onChange(p)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all duration-200"
                    style={value === p
                        ? { background: "linear-gradient(135deg,#EC4899,#6366F1)", color: "#fff", boxShadow: "0 2px 10px rgba(236,72,153,0.4)" }
                        : { color: "#677393" }}>
                    {p}
                </button>
            ))}
        </div>
    )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  AI Insight banner  ━━━━━━━ */
function AIInsightBanner() {
    return (
        <div className="relative rounded-2xl p-5 overflow-hidden flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-fade-in"
            style={{
                background: "linear-gradient(135deg,rgba(236,72,153,0.09) 0%,rgba(99,102,241,0.07) 50%,rgba(34,211,238,0.04) 100%)",
                border: "1px solid rgba(236,72,153,0.22)",
            }}>
            <div className="absolute -top-8 -right-8 h-36 w-36 rounded-full pointer-events-none opacity-15"
                style={{ background: "radial-gradient(circle,#EC4899,transparent)" }} />

            <div className="flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0"
                style={{ background: "rgba(236,72,153,0.12)", border: "1px solid rgba(236,72,153,0.28)", boxShadow: "0 0 16px rgba(236,72,153,0.25)" }}>
                <Sparkles className="h-5 w-5 text-pink-400" />
            </div>

            <div className="flex-1 min-w-0 relative z-10">
                <p className="text-sm font-bold text-white mb-0.5">AI Growth Insight — February 2026</p>
                <p className="text-xs text-slate-400 leading-relaxed">
                    Your chatbot generated <span className="text-pink-400 font-semibold">$48,320</span> this month (+24.6%).
                    Try-On is your fastest-growing channel at <span className="text-violet-400 font-semibold">+44.7%</span>.
                    Cart recovery saved <span className="text-amber-400 font-semibold">$15,748</span> — enabling WhatsApp follow-ups
                    could push win rate from 41% to <span className="text-emerald-400 font-semibold">55%+</span>.
                </p>
            </div>

            <button
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 active:scale-95"
                style={{ background: "linear-gradient(135deg,#EC4899,#6366F1)", boxShadow: "0 4px 14px rgba(236,72,153,0.4)" }}>
                <Zap className="h-3.5 w-3.5" /> Full Report
            </button>
        </div>
    )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Main page  ━━ */
export function Overview() {
    const [period, setPeriod] = useState("30d")

    /* Separate revenue card from the rest */
    const revenueCard = CARDS.find(c => c.highlight)!
    const regularCards = CARDS.filter(c => !c.highlight)

    return (
        <div className="space-y-8">

            {/* ── Header row ──────────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">Business Overview</h2>
                    <p className="text-sm text-slate-400 mt-0.5">
                        Real-time chatbot impact on&nbsp;
                        <span className="text-pink-400 font-semibold">Korakari Fashion</span>
                        &nbsp;— February 2026.
                    </p>
                </div>
                <PeriodToggle value={period} onChange={setPeriod} />
            </div>

            {/* ── Revenue HERO card (full-width) ──────────────────────────────── */}
            <div className="animate-fade-in-up" style={{ animationDelay: "0ms" }}>
                <StatCard card={revenueCard} />
            </div>

            {/* ── 5 regular cards ─────────────────────────────────────────────── */}
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {regularCards.map((card, i) => (
                    <div key={card.id} className="animate-fade-in-up" style={{ animationDelay: `${(i + 1) * 60}ms` }}>
                        <StatCard card={card} />
                    </div>
                ))}
            </div>

            {/* ── AI Insight banner ───────────────────────────────────────────── */}
            <AIInsightBanner />

            {/* ── Charts row ──────────────────────────────────────────────────── */}
            <div className="grid gap-5 lg:grid-cols-2">

                {/* Revenue area chart */}
                <div className="rounded-2xl overflow-hidden animate-fade-in"
                    style={{ background: "rgba(13,20,33,0.8)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                        <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-emerald-400" />
                            <h3 className="text-sm font-bold text-white">Revenue Breakdown · Daily</h3>
                        </div>
                        <div className="flex items-center gap-4">
                            {[{ l: "AI Chatbot", c: "#34D399" }, { l: "Organic", c: "#6366F1" }].map(i => (
                                <div key={i.l} className="flex items-center gap-1.5">
                                    <div className="h-2 w-2 rounded-full" style={{ background: i.c }} />
                                    <span className="text-[11px] text-slate-500">{i.l}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="p-6">
                        <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={REVENUE_DAILY} margin={{ top: 4, right: 0, left: -16, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="gchatbot" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#34D399" stopOpacity={0.35} />
                                        <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="gorganic" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.25} />
                                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.04)" />
                                <XAxis dataKey="day" tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false}
                                    tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
                                <Tooltip content={<RevTip />} />
                                <Area type="monotone" dataKey="organic" stroke="#6366F1" strokeWidth={1.5} fill="url(#gorganic)" dot={false} />
                                <Area type="monotone" dataKey="chatbot" stroke="#34D399" strokeWidth={2.5} fill="url(#gchatbot)" dot={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Conversion lift bar chart */}
                <div className="rounded-2xl overflow-hidden animate-fade-in"
                    style={{ background: "rgba(13,20,33,0.8)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-pink-400" />
                            <h3 className="text-sm font-bold text-white">Conversion Rate Lift · Weekly</h3>
                        </div>
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg"
                            style={{ background: "rgba(52,211,153,0.1)", color: "#34D399", border: "1px solid rgba(52,211,153,0.22)" }}>
                            +100% avg lift
                        </span>
                    </div>
                    <div className="p-6">
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={CONV_WEEKLY} barGap={6} barCategoryGap="38%"
                                margin={{ top: 4, right: 0, left: -16, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.04)" />
                                <XAxis dataKey="week" tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false}
                                    tickFormatter={v => `${v}%`} domain={[0, 5]} />
                                <Tooltip content={<ConvTip />} cursor={{ fill: "rgba(255,255,255,0.025)", radius: 4 }} />
                                <Bar dataKey="before" name="before" fill="#334155" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="after" name="after" radius={[4, 4, 0, 0]}>
                                    {CONV_WEEKLY.map((_, i) => (
                                        <Cell key={i} fill="#EC4899"
                                            style={{ filter: "drop-shadow(0 0 5px rgba(236,72,153,0.5))" }} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                        <div className="flex items-center justify-center gap-6 mt-2">
                            {[{ l: "Before AI", c: "#334155" }, { l: "With AI", c: "#EC4899" }].map(i => (
                                <div key={i.l} className="flex items-center gap-1.5">
                                    <div className="h-2.5 w-2.5 rounded-sm" style={{ background: i.c }} />
                                    <span className="text-[11px] text-slate-500">{i.l}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Quick wins strip ─────────────────────────────────────────────── */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-fade-in">
                {[
                    { icon: Zap, label: "Fastest win", value: "Try-On → Buy", sub: "34% of try-on sessions convert", color: "#A78BFA", rgb: "167,139,250" },
                    { icon: Activity, label: "Top bot trigger", value: "Size Guide", sub: "Asked 1,480× this month", color: "#22D3EE", rgb: "34,211,238" },
                    { icon: Star, label: "Most sold via bot", value: "Linen Kurta", sub: "312 chatbot orders · 4.9★", color: "#FBBF24", rgb: "251,191,36" },
                    { icon: RefreshCw, label: "Best recovery time", value: "2–4 hrs", sub: "Highest cart win-rate window", color: "#34D399", rgb: "52,211,153" },
                ].map(c => (
                    <div key={c.label}
                        className="rounded-2xl p-5 transition-all duration-300 hover:-translate-y-px cursor-pointer group"
                        style={{ background: `rgba(${c.rgb},0.06)`, border: `1px solid rgba(${c.rgb},0.2)` }}>
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl mb-3"
                            style={{ background: `rgba(${c.rgb},0.12)`, border: `1px solid rgba(${c.rgb},0.2)` }}>
                            <c.icon className="h-4 w-4" style={{ color: c.color }} />
                        </div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 mb-1">{c.label}</p>
                        <p className="text-sm font-black text-white">{c.value}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{c.sub}</p>
                    </div>
                ))}
            </div>

        </div>
    )
}
