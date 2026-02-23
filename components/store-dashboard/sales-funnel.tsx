"use client"

import { useState } from "react"
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts"
import {
    Users, MessageCircle, MousePointerClick,
    ShoppingCart, CreditCard, ArrowDown,
    TrendingDown, TrendingUp, Sparkles,
    Zap, ArrowUpRight, Info,
} from "lucide-react"

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Funnel data  ━━━━━━━━━━━━━━━━━ */
const FUNNEL_STEPS = [
    {
        id: "visitors",
        label: "Visitors",
        sublabel: "Total store sessions",
        value: 18400,
        icon: Users,
        color: "#6366F1",
        rgb: "99,102,241",
        pct: 100,           // base = 100 %
        dropPct: null,          // no drop before first step
        dropLabel: null,
        insight: "18,400 unique sessions recorded via chatbot widget impressions.",
    },
    {
        id: "interaction",
        label: "Chatbot Interaction",
        sublabel: "Opened & engaged with bot",
        value: 7204,
        icon: MessageCircle,
        color: "#A78BFA",
        rgb: "167,139,250",
        pct: 39.2,
        dropPct: 60.8,
        dropLabel: "Did not open chatbot",
        insight: "39.2% of visitors interacted — above industry average of 25–30%.",
    },
    {
        id: "click",
        label: "Product Click",
        sublabel: "Clicked a chatbot recommendation",
        value: 4840,
        icon: MousePointerClick,
        color: "#22D3EE",
        rgb: "34,211,238",
        pct: 26.3,
        dropPct: 32.8,
        dropLabel: "Left after browsing",
        insight: "67.2% of bot users clicked a recommended product — strong intent signal.",
    },
    {
        id: "cart",
        label: "Add to Cart",
        sublabel: "Added recommended item to bag",
        value: 2318,
        icon: ShoppingCart,
        color: "#FBBF24",
        rgb: "251,191,36",
        pct: 12.6,
        dropPct: 52.1,
        dropLabel: "Abandoned before cart",
        insight: "47.9% of product-clickers added to cart — 1.8× the site average.",
    },
    {
        id: "purchase",
        label: "Purchase",
        sublabel: "Completed checkout",
        value: 964,
        icon: CreditCard,
        color: "#34D399",
        rgb: "52,211,153",
        pct: 5.2,
        dropPct: 58.4,
        dropLabel: "Cart abandoned (recovered 124)",
        insight: "964 orders placed — 3.8% overall conversion rate (store avg: 1.9%).",
    },
]

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Weekly funnel trend  ━━━━━━━━━ */
const WEEKLY = [
    { week: "Wk 1", visitors: 4100, interactions: 1420, clicks: 1020, carts: 486, purchases: 198 },
    { week: "Wk 2", visitors: 4480, interactions: 1700, clicks: 1142, carts: 548, purchases: 228 },
    { week: "Wk 3", visitors: 4820, interactions: 1980, clicks: 1280, carts: 614, purchases: 258 },
    { week: "Wk 4", visitors: 5000, interactions: 2104, clicks: 1398, carts: 670, purchases: 280 },
]

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Drop-off breakdown  ━━━━━━━━━━ */
const DROPOFF_REASONS = [
    { step: "Bot → Click", reasons: ["Just browsing", "No relevant product", "Price shock"], pcts: [44, 32, 24] },
    { step: "Click → Cart", reasons: ["No size available", "Comparing elsewhere", "Distracted"], pcts: [38, 36, 26] },
    { step: "Cart → Buy", reasons: ["Unexpected shipping", "Payment hesitation", "Saved for later"], pcts: [35, 40, 25] },
]

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Tooltip  ━━━━━━━━━━━━━━━━━━━━━ */
function WeeklyTip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null
    return (
        <div
            className="rounded-xl px-4 py-3 text-xs min-w-[180px]"
            style={{
                background: "#0A1120",
                border: "1px solid rgba(99,102,241,0.3)",
                boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
            }}
        >
            <p className="font-bold text-slate-300 mb-2">{label}</p>
            {payload.map((p: any) => (
                <div key={p.dataKey} className="flex items-center justify-between gap-5 mb-1">
                    <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
                        <span className="text-slate-500 capitalize">{p.dataKey}</span>
                    </span>
                    <span className="font-bold text-white">{p.value.toLocaleString()}</span>
                </div>
            ))}
        </div>
    )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Funnel step card  ━━━━━━━━━━━━ */
function FunnelStep({
    step, i, total, isLast, isActive, onClick,
}: {
    step: typeof FUNNEL_STEPS[0]
    i: number
    total: number
    isLast: boolean
    isActive: boolean
    onClick: () => void
}) {
    const Icon = step.icon
    const barWidth = step.pct         // % of base for the visual bar
    const prevPct = i === 0 ? 100 : FUNNEL_STEPS[i - 1].pct

    return (
        <div className="relative animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>

            {/* Main card */}
            <div
                onClick={onClick}
                className="relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 group"
                style={{
                    background: isActive
                        ? `linear-gradient(145deg,rgba(${step.rgb},0.16) 0%,rgba(13,20,33,0.97) 100%)`
                        : "rgba(13,20,33,0.78)",
                    border: isActive
                        ? `1px solid rgba(${step.rgb},0.45)`
                        : "1px solid rgba(255,255,255,0.07)",
                    boxShadow: isActive
                        ? `0 0 0 1px rgba(${step.rgb},0.1), 0 16px 44px rgba(0,0,0,0.55), 0 0 40px rgba(${step.rgb},0.08)`
                        : "0 4px 24px rgba(0,0,0,0.3)",
                    backdropFilter: "blur(16px)",
                    transform: isActive ? "translateY(-1px)" : "none",
                }}
            >
                {/* Step number ribbon */}
                <div
                    className="absolute top-0 left-0 w-1 h-full"
                    style={{ background: `linear-gradient(180deg,${step.color},${step.color}40)` }}
                />

                <div className="pl-5 pr-5 py-4">
                    <div className="flex items-center justify-between gap-4">

                        {/* Left — icon + info */}
                        <div className="flex items-center gap-3">
                            <div
                                className="flex h-11 w-11 items-center justify-center rounded-xl flex-shrink-0 transition-all duration-300"
                                style={{
                                    background: `rgba(${step.rgb},0.13)`,
                                    border: `1px solid rgba(${step.rgb},0.28)`,
                                    boxShadow: isActive ? `0 0 20px rgba(${step.rgb},0.35)` : "none",
                                }}
                            >
                                <Icon className="h-5 w-5" style={{ color: step.color }} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span
                                        className="text-[10px] font-black uppercase tracking-widest"
                                        style={{ color: step.color }}
                                    >
                                        Step {i + 1}
                                    </span>
                                    {i === total - 1 && (
                                        <span
                                            className="text-[9px] font-black uppercase tracking-wide px-1.5 py-0.5 rounded"
                                            style={{ background: "rgba(52,211,153,0.15)", color: "#34D399", border: "1px solid rgba(52,211,153,0.3)" }}
                                        >
                                            Goal
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm font-bold text-white leading-tight">{step.label}</p>
                                <p className="text-[11px] text-slate-500">{step.sublabel}</p>
                            </div>
                        </div>

                        {/* Right — count + pct */}
                        <div className="text-right flex-shrink-0">
                            <p className="text-xl font-black text-white leading-tight">{step.value.toLocaleString()}</p>
                            <p className="text-xs font-bold" style={{ color: step.color }}>{step.pct}% of visitors</p>
                        </div>
                    </div>

                    {/* Visual width bar */}
                    <div className="mt-3 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                        <div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{
                                width: `${barWidth}%`,
                                background: `linear-gradient(90deg,${step.color},${step.color}70)`,
                                boxShadow: `0 0 8px ${step.color}50`,
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* ─ Drop-off connector ─ */}
            {!isLast && step.dropPct !== null && (
                <div className="relative flex items-center gap-4 my-2 px-5">
                    {/* Vertical line */}
                    <div
                        className="absolute left-[calc(1.25rem+22px)] top-0 bottom-0 w-px"
                        style={{ background: `linear-gradient(180deg,rgba(${step.rgb},0.6),rgba(${FUNNEL_STEPS[i + 1].rgb},0.4))` }}
                    />

                    {/* Drop label */}
                    <div className="ml-[calc(1.25rem+34px)] flex items-center gap-2 py-1.5">
                        <div
                            className="flex h-5 w-5 items-center justify-center rounded-full flex-shrink-0"
                            style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)" }}
                        >
                            <TrendingDown className="h-3 w-3 text-red-400" />
                        </div>
                        <span className="text-[10px] text-red-400 font-bold">{step.dropPct}% dropped</span>
                        <span className="text-[10px] text-slate-600">— {step.dropLabel}</span>
                    </div>
                </div>
            )}
        </div>
    )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Main page  ━━━━━━━━━━━━━━━━━━━ */
export function SalesFunnel() {
    const [activeStep, setActiveStep] = useState<number | null>(null)
    const [showTrend, setShowTrend] = useState(false)

    const convRate = ((964 / 18400) * 100).toFixed(1)
    const chatbotLift = "+100%"                              // 1.9% → 3.8%
    const activeData = activeStep !== null ? FUNNEL_STEPS[activeStep] : null

    return (
        <div className="space-y-8">

            {/* ── Header ──────────────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">Sales Funnel</h2>
                    <p className="text-sm text-slate-400 mt-0.5">
                        End-to-end conversion journey powered by the AI chatbot — February 2026.
                    </p>
                </div>
                <button
                    onClick={() => setShowTrend(t => !t)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold self-start sm:self-auto transition-all"
                    style={showTrend
                        ? { background: "linear-gradient(135deg,#6366F1,#A78BFA)", color: "#fff", boxShadow: "0 4px 12px rgba(99,102,241,0.4)" }
                        : { background: "rgba(99,102,241,0.09)", border: "1px solid rgba(99,102,241,0.22)", color: "#6366F1" }}
                >
                    <TrendingUp className="h-3.5 w-3.5" />
                    {showTrend ? "Hide Trend" : "Show Weekly Trend"}
                </button>
            </div>

            {/* ── Summary pills ───────────────────────────────────────────────── */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger">
                {[
                    { label: "Total Visitors", value: "18,400", color: "#6366F1", rgb: "99,102,241", icon: Users },
                    { label: "Bot Interaction Rate", value: "39.2%", color: "#A78BFA", rgb: "167,139,250", icon: MessageCircle },
                    { label: "Overall Conversion", value: `${convRate}%`, color: "#34D399", rgb: "52,211,153", icon: CreditCard },
                    { label: "Chatbot CVR Lift", value: chatbotLift, color: "#EC4899", rgb: "236,72,153", icon: TrendingUp },
                ].map((s, i) => (
                    <div
                        key={s.label}
                        className="relative rounded-2xl p-5 overflow-hidden animate-fade-in-up"
                        style={{
                            background: `rgba(${s.rgb},0.07)`,
                            border: `1px solid rgba(${s.rgb},0.22)`,
                            backdropFilter: "blur(16px)",
                            animationDelay: `${i * 60}ms`,
                        }}
                    >
                        <div
                            className="absolute -top-5 -right-5 h-20 w-20 rounded-full pointer-events-none"
                            style={{ background: `radial-gradient(circle,${s.color},transparent 70%)`, opacity: 0.1 }}
                        />
                        <div
                            className="flex h-10 w-10 items-center justify-center rounded-xl mb-4"
                            style={{ background: `rgba(${s.rgb},0.14)`, border: `1px solid rgba(${s.rgb},0.25)` }}
                        >
                            <s.icon className="h-5 w-5" style={{ color: s.color }} />
                        </div>
                        <p className="text-2xl font-black text-white tracking-tight">{s.value}</p>
                        <p className="text-xs text-slate-500 mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* ── Main layout: Funnel + Side panel ────────────────────────────── */}
            <div className="grid gap-6 lg:grid-cols-5">

                {/* ─ Funnel steps (3/5) ─ */}
                <div className="lg:col-span-3 space-y-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-4 px-1">
                        Click a step to inspect
                    </p>
                    {FUNNEL_STEPS.map((step, i) => (
                        <FunnelStep
                            key={step.id}
                            step={step}
                            i={i}
                            total={FUNNEL_STEPS.length}
                            isLast={i === FUNNEL_STEPS.length - 1}
                            isActive={activeStep === i}
                            onClick={() => setActiveStep(activeStep === i ? null : i)}
                        />
                    ))}
                </div>

                {/* ─ Side panel (2/5) ─ */}
                <div className="lg:col-span-2 flex flex-col gap-5">

                    {/* Funnel shape visualizer */}
                    <div
                        className="rounded-2xl p-5 animate-fade-in"
                        style={{
                            background: "rgba(13,20,33,0.82)",
                            border: "1px solid rgba(255,255,255,0.07)",
                            backdropFilter: "blur(20px)",
                        }}
                    >
                        <p className="text-xs font-bold text-white mb-5 flex items-center gap-2">
                            <span className="h-[3px] w-4 rounded-full inline-block" style={{ background: "linear-gradient(90deg,#6366F1,#EC4899)" }} />
                            Funnel Shape
                        </p>
                        <div className="space-y-2">
                            {FUNNEL_STEPS.map((step, i) => {
                                const widthPct = step.pct          // max = 100 for step 0
                                return (
                                    <div
                                        key={step.id}
                                        onClick={() => setActiveStep(activeStep === i ? null : i)}
                                        className="cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <span
                                                className="text-[10px] font-bold truncate flex-1"
                                                style={{ color: step.color }}
                                            >
                                                {step.label}
                                            </span>
                                            <span className="text-[10px] font-black text-white flex-shrink-0">
                                                {step.value.toLocaleString()}
                                            </span>
                                        </div>
                                        {/* Centred trapezoid bar */}
                                        <div className="flex justify-center">
                                            <div
                                                className="h-7 rounded-lg transition-all duration-700 flex items-center justify-center text-[10px] font-black text-white"
                                                style={{
                                                    width: `${widthPct}%`,
                                                    background: activeStep === i
                                                        ? `linear-gradient(90deg,${step.color},${step.color}90)`
                                                        : `linear-gradient(90deg,${step.color}80,${step.color}40)`,
                                                    boxShadow: activeStep === i ? `0 0 14px ${step.color}60` : "none",
                                                    minWidth: "10%",
                                                }}
                                            >
                                                {step.pct}%
                                            </div>
                                        </div>
                                        {/* Drop arrow between steps */}
                                        {i < FUNNEL_STEPS.length - 1 && (
                                            <div className="flex items-center gap-1 justify-center mt-1 mb-0.5">
                                                <ArrowDown className="h-3 w-3 text-red-400/60" />
                                                <span className="text-[9px] text-red-400/60 font-bold">-{FUNNEL_STEPS[i + 1].dropPct}%</span>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Step detail card */}
                    <div
                        className="rounded-2xl p-5 transition-all duration-300 flex-1 animate-fade-in"
                        style={{
                            background: activeData
                                ? `linear-gradient(145deg,rgba(${activeData.rgb},0.1),rgba(13,20,33,0.95))`
                                : "rgba(13,20,33,0.82)",
                            border: activeData
                                ? `1px solid rgba(${activeData.rgb},0.35)`
                                : "1px solid rgba(255,255,255,0.07)",
                            backdropFilter: "blur(20px)",
                            minHeight: "140px",
                        }}
                    >
                        {activeData ? (
                            <>
                                <div className="flex items-center gap-2 mb-3">
                                    <div
                                        className="flex h-8 w-8 items-center justify-center rounded-lg"
                                        style={{ background: `rgba(${activeData.rgb},0.15)`, border: `1px solid rgba(${activeData.rgb},0.3)` }}
                                    >
                                        <activeData.icon className="h-4 w-4" style={{ color: activeData.color }} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-white">{activeData.label}</p>
                                        <p className="text-[10px]" style={{ color: activeData.color }}>{activeData.pct}% of visitors</p>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed mb-3">{activeData.insight}</p>
                                {activeData.dropPct !== null && (
                                    <div
                                        className="flex items-center gap-2 p-2.5 rounded-xl"
                                        style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}
                                    >
                                        <TrendingDown className="h-3.5 w-3.5 text-red-400 flex-shrink-0" />
                                        <span className="text-[11px] text-red-300">
                                            <span className="font-bold">{activeData.dropPct}%</span> dropped — {activeData.dropLabel}
                                        </span>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center gap-2 text-center py-6">
                                <Info className="h-5 w-5 text-slate-700" />
                                <p className="text-xs text-slate-600">Select a funnel step to see detailed insights.</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* ── Weekly trend (collapsible) ───────────────────────────────────── */}
            {showTrend && (
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
                            <TrendingUp className="h-4 w-4 text-indigo-400" />
                            <h3 className="text-sm font-bold text-white">Weekly Funnel Performance</h3>
                        </div>
                        <div className="flex items-center gap-4 flex-wrap">
                            {[
                                { l: "Visitors", c: "#6366F1" },
                                { l: "Interactions", c: "#A78BFA" },
                                { l: "Clicks", c: "#22D3EE" },
                                { l: "Carts", c: "#FBBF24" },
                                { l: "Purchases", c: "#34D399" },
                            ].map(i => (
                                <div key={i.l} className="flex items-center gap-1.5">
                                    <div className="h-2 w-2 rounded-full" style={{ background: i.c }} />
                                    <span className="text-[10px] text-slate-500">{i.l}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="p-6">
                        <ResponsiveContainer width="100%" height={260}>
                            <AreaChart data={WEEKLY} margin={{ top: 4, right: 10, left: -10, bottom: 0 }}>
                                <defs>
                                    {[
                                        ["fVisitors", "#6366F1"],
                                        ["fInteractions", "#A78BFA"],
                                        ["fClicks", "#22D3EE"],
                                        ["fCarts", "#FBBF24"],
                                        ["fPurchases", "#34D399"],
                                    ].map(([id, c]) => (
                                        <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={c} stopOpacity={0.25} />
                                            <stop offset="95%" stopColor={c} stopOpacity={0} />
                                        </linearGradient>
                                    ))}
                                </defs>
                                <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.04)" />
                                <XAxis dataKey="week" tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
                                <Tooltip content={<WeeklyTip />} />
                                <Area type="monotone" dataKey="visitors" stroke="#6366F1" strokeWidth={1.5} fill="url(#fVisitors)" dot={false} />
                                <Area type="monotone" dataKey="interactions" stroke="#A78BFA" strokeWidth={1.5} fill="url(#fInteractions)" dot={false} />
                                <Area type="monotone" dataKey="clicks" stroke="#22D3EE" strokeWidth={1.5} fill="url(#fClicks)" dot={false} />
                                <Area type="monotone" dataKey="carts" stroke="#FBBF24" strokeWidth={1.5} fill="url(#fCarts)" dot={false} />
                                <Area type="monotone" dataKey="purchases" stroke="#34D399" strokeWidth={2} fill="url(#fPurchases)" dot={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* ── Drop-off reasons ────────────────────────────────────────────── */}
            <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-4">
                    Top Drop-off Reasons by Funnel Stage
                </p>
                <div className="grid gap-4 sm:grid-cols-3">
                    {DROPOFF_REASONS.map(drop => (
                        <div
                            key={drop.step}
                            className="rounded-2xl p-5 animate-fade-in"
                            style={{
                                background: "rgba(13,20,33,0.78)",
                                border: "1px solid rgba(248,113,113,0.15)",
                                backdropFilter: "blur(16px)",
                            }}
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingDown className="h-4 w-4 text-red-400" />
                                <p className="text-xs font-bold text-white">{drop.step}</p>
                            </div>
                            <div className="space-y-3">
                                {drop.reasons.map((r, idx) => (
                                    <div key={r}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[11px] text-slate-400">{r}</span>
                                            <span className="text-[11px] font-bold text-red-400">{drop.pcts[idx]}%</span>
                                        </div>
                                        <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                                            <div
                                                className="h-full rounded-full"
                                                style={{
                                                    width: `${drop.pcts[idx]}%`,
                                                    background: "linear-gradient(90deg,#F87171,#EF444460)",
                                                    boxShadow: "0 0 6px rgba(248,113,113,0.4)",
                                                    transition: "width 1s ease",
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── AI insight ──────────────────────────────────────────────────── */}
            <div
                className="flex items-start gap-4 px-5 py-4 rounded-2xl animate-fade-in"
                style={{
                    background: "linear-gradient(135deg,rgba(99,102,241,0.08) 0%,rgba(52,211,153,0.04) 100%)",
                    border: "1px solid rgba(99,102,241,0.22)",
                }}
            >
                <Sparkles className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white mb-0.5">Biggest Funnel Opportunity</p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        The <span className="text-indigo-400 font-semibold">Cart → Purchase</span> stage has a&nbsp;
                        <span className="text-red-400 font-semibold">58.4% drop-off</span>, but the bot already recovered&nbsp;
                        <span className="text-emerald-400 font-semibold">124 carts ($15,748)</span>.
                        Enabling a <span className="text-indigo-400 font-semibold">2-hour WhatsApp nudge</span> for all
                        abandoned carts could cut this drop-off to ~40%, adding an estimated&nbsp;
                        <span className="text-emerald-400 font-semibold">+$8,200/month</span>.
                    </p>
                </div>
                <button
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 active:scale-95 whitespace-nowrap"
                    style={{
                        background: "linear-gradient(135deg,#6366F1,#A78BFA)",
                        boxShadow: "0 4px 12px rgba(99,102,241,0.4)",
                    }}
                >
                    <Zap className="h-3.5 w-3.5" /> Automate
                </button>
            </div>

        </div>
    )
}
