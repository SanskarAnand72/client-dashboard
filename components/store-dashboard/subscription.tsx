"use client"

import { useState } from "react"
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell,
} from "recharts"
import {
    CreditCard, Zap, Calendar, CheckCircle2, Star,
    ArrowUpRight, Sparkles, Shield, Clock, Download,
    AlertTriangle, TrendingUp, Package, ChevronRight,
    Lock,
} from "lucide-react"

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  DATA  ━━━━━━━━━━ */

const PLAN = {
    name: "Pro",
    price: 79,
    billingCycle: "monthly",
    renewalDate: "Mar 9, 2026",
    daysLeft: 14,
    status: "Active",
    features: [
        "Unlimited chatbot conversations",
        "Virtual Try-On (up to 5,000/mo)",
        "Cart Recovery campaigns",
        "Advanced analytics & reports",
        "Priority support (< 2hr SLA)",
        "Custom branding & domain",
    ],
}

const CREDITS = {
    total: 10000,
    used: 7840,
    percentage: 78.4,
    breakdown: [
        { label: "Chatbot Conversations", used: 3340, color: "#6366F1", rgb: "99,102,241" },
        { label: "Virtual Try-Ons", used: 2180, color: "#EC4899", rgb: "236,72,153" },
        { label: "Cart Recovery Msgs", used: 1480, color: "#FBBF24", rgb: "251,191,36" },
        { label: "AI Recommendations", used: 840, color: "#34D399", rgb: "52,211,153" },
    ],
}

const PAYMENT_HISTORY = [
    { id: "INV-2026-02", date: "Feb 9, 2026", amount: 79, status: "Paid", method: "Visa •••• 4242" },
    { id: "INV-2026-01", date: "Jan 9, 2026", amount: 79, status: "Paid", method: "Visa •••• 4242" },
    { id: "INV-2025-12", date: "Dec 9, 2025", amount: 79, status: "Paid", method: "Visa •••• 4242" },
    { id: "INV-2025-11", date: "Nov 9, 2025", amount: 49, status: "Paid", method: "Visa •••• 4242" },
    { id: "INV-2025-10", date: "Oct 9, 2025", amount: 49, status: "Paid", method: "Visa •••• 4242" },
    { id: "INV-2025-09", date: "Sep 9, 2025", amount: 49, status: "Paid", method: "Visa •••• 4242" },
]

/** Monthly spend bar chart */
const SPEND_TREND = [
    { month: "Sep", amount: 49 },
    { month: "Oct", amount: 49 },
    { month: "Nov", amount: 49 },
    { month: "Dec", amount: 79 },
    { month: "Jan", amount: 79 },
    { month: "Feb", amount: 79 },
]

const PLANS = [
    {
        name: "Starter",
        price: 29,
        credits: "3,000",
        tag: null,
        color: "#6366F1", rgb: "99,102,241",
        features: ["3,000 conversations/mo", "Basic analytics", "Email support"],
        current: false,
    },
    {
        name: "Pro",
        price: 79,
        credits: "10,000",
        tag: "Current",
        color: "#EC4899", rgb: "236,72,153",
        features: ["10,000 conversations/mo", "Full analytics suite", "Virtual Try-On", "Priority support"],
        current: true,
    },
    {
        name: "Business",
        price: 199,
        credits: "Unlimited",
        tag: "Best Value",
        color: "#FBBF24", rgb: "251,191,36",
        features: ["Unlimited conversations", "Custom AI training", "Dedicated account manager", "White-label"],
        current: false,
    },
]

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Tooltip  ━━━━━━━━━ */
function SpendTip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null
    return (
        <div className="rounded-xl px-3 py-2 text-xs"
            style={{ background: "#0A1120", border: "1px solid rgba(99,102,241,0.3)", boxShadow: "0 8px 32px rgba(0,0,0,0.6)" }}>
            <p className="font-bold text-white">{label}</p>
            <p className="text-indigo-400 font-bold mt-0.5">${payload[0]?.value}/mo</p>
        </div>
    )
}

const STATUS_STYLE: Record<string, { bg: string; text: string; border: string }> = {
    Paid: { bg: "rgba(52,211,153,0.1)", text: "#34D399", border: "rgba(52,211,153,0.25)" },
    Pending: { bg: "rgba(251,191,36,0.1)", text: "#FBBF24", border: "rgba(251,191,36,0.25)" },
    Failed: { bg: "rgba(248,113,113,0.1)", text: "#F87171", border: "rgba(248,113,113,0.25)" },
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Main  ━━━━━━━━━ */
export function Subscription() {
    const [showUpgrade, setShowUpgrade] = useState(false)
    const remaining = CREDITS.total - CREDITS.used
    const lowCredit = CREDITS.percentage > 75

    return (
        <div className="space-y-8">

            {/* ── Header ──────────────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">Subscription</h2>
                    <p className="text-sm text-slate-400 mt-0.5">
                        Manage your plan, credits &amp; billing — all in one place.
                    </p>
                </div>
                <button
                    onClick={() => setShowUpgrade(v => !v)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95 self-start sm:self-auto"
                    style={{ background: "linear-gradient(135deg,#EC4899,#6366F1)", boxShadow: "0 4px 16px rgba(236,72,153,0.4)" }}
                >
                    <Zap className="h-4 w-4" /> Upgrade Plan
                </button>
            </div>

            {/* ── Top summary: 4 KPI cards ─────────────────────────────────────── */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    {
                        label: "Current Plan",
                        value: PLAN.name,
                        sub: `$${PLAN.price}/month · billed monthly`,
                        icon: Package, color: "#EC4899", rgb: "236,72,153",
                        badge: PLAN.status,
                    },
                    {
                        label: "Credits Used",
                        value: `${CREDITS.percentage.toFixed(0)}%`,
                        sub: `${CREDITS.used.toLocaleString()} of ${CREDITS.total.toLocaleString()} used`,
                        icon: TrendingUp, color: lowCredit ? "#F87171" : "#34D399", rgb: lowCredit ? "248,113,113" : "52,211,153",
                        badge: lowCredit ? "Low" : "Good",
                    },
                    {
                        label: "Expiry Date",
                        value: `${PLAN.daysLeft}d`,
                        sub: `Renews on ${PLAN.renewalDate}`,
                        icon: Calendar, color: "#FBBF24", rgb: "251,191,36",
                        badge: "Auto-renew ON",
                    },
                    {
                        label: "Total Spent",
                        value: `$${PAYMENT_HISTORY.reduce((s, p) => s + p.amount, 0)}`,
                        sub: `${PAYMENT_HISTORY.length} invoices · Visa •••• 4242`,
                        icon: CreditCard, color: "#6366F1", rgb: "99,102,241",
                        badge: "All paid",
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
                                {c.badge}
                            </span>
                        </div>
                        <p className="text-2xl font-black text-white tracking-tight">{c.value}</p>
                        <p className="text-sm font-semibold text-slate-300 mt-0.5">{c.label}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{c.sub}</p>
                    </div>
                ))}
            </div>

            {/* ━━━━━━━━━━━━━━━━━━━  Current Plan card + Credit meter  ━━━━━━━━━━ */}
            <div className="grid gap-5 lg:grid-cols-5">

                {/* Plan card — 2/5 */}
                <div
                    className="lg:col-span-2 rounded-2xl p-6 relative overflow-hidden animate-fade-in"
                    style={{
                        background: "linear-gradient(135deg,rgba(236,72,153,0.12) 0%,rgba(99,102,241,0.07) 100%)",
                        border: "1px solid rgba(236,72,153,0.28)",
                        backdropFilter: "blur(20px)",
                    }}
                >
                    {/* Glow blob */}
                    <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full pointer-events-none"
                        style={{ background: "radial-gradient(circle,rgba(236,72,153,0.2),transparent 70%)" }} />

                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-pink-400">Current Plan</span>
                            <h3 className="text-2xl font-black text-white mt-0.5">Pro&nbsp;
                                <span className="text-lg font-bold text-slate-400">${PLAN.price}<span className="text-sm">/mo</span></span>
                            </h3>
                        </div>
                        <div
                            className="flex h-12 w-12 items-center justify-center rounded-2xl"
                            style={{ background: "linear-gradient(135deg,#EC4899,#6366F1)", boxShadow: "0 0 20px rgba(236,72,153,0.4)" }}
                        >
                            <Star className="h-6 w-6 text-white" />
                        </div>
                    </div>

                    <div className="space-y-2.5 mb-6">
                        {PLAN.features.map(f => (
                            <div key={f} className="flex items-center gap-2.5">
                                <CheckCircle2 className="h-4 w-4 text-pink-400 flex-shrink-0" />
                                <span className="text-[12px] text-slate-300">{f}</span>
                            </div>
                        ))}
                    </div>

                    {/* Expiry countdown */}
                    <div
                        className="flex items-center gap-3 px-4 py-3 rounded-xl"
                        style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)" }}
                    >
                        <Calendar className="h-4 w-4 text-amber-400 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-xs font-bold text-white">Renews {PLAN.renewalDate}</p>
                            <p className="text-[10px] text-slate-500">{PLAN.daysLeft} days remaining · auto-renew on</p>
                        </div>
                        <span
                            className="text-[10px] font-black px-2 py-0.5 rounded"
                            style={{ background: "rgba(251,191,36,0.15)", color: "#FBBF24", border: "1px solid rgba(251,191,36,0.3)" }}
                        >
                            {PLAN.daysLeft}d
                        </span>
                    </div>

                    <button
                        onClick={() => setShowUpgrade(v => !v)}
                        className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
                        style={{ background: "linear-gradient(135deg,#EC4899,#6366F1)", boxShadow: "0 4px 14px rgba(236,72,153,0.35)" }}
                    >
                        <Zap className="h-4 w-4" /> Upgrade to Business
                    </button>
                </div>

                {/* Credits Used — 3/5 */}
                <div
                    className="lg:col-span-3 rounded-2xl p-6 animate-fade-in"
                    style={{ background: "rgba(13,20,33,0.82)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}
                >
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-indigo-400" />
                            <h3 className="text-sm font-bold text-white">Credits Used This Month</h3>
                        </div>
                        {lowCredit && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold"
                                style={{ background: "rgba(248,113,113,0.1)", color: "#F87171", border: "1px solid rgba(248,113,113,0.25)" }}>
                                <AlertTriangle className="h-3 w-3" /> Low Credits
                            </div>
                        )}
                    </div>

                    {/* Overall meter */}
                    <div className="mb-6">
                        <div className="flex items-end justify-between mb-2">
                            <div>
                                <span className="text-3xl font-black text-white">{CREDITS.used.toLocaleString()}</span>
                                <span className="text-slate-500 text-sm ml-1">/ {CREDITS.total.toLocaleString()}</span>
                            </div>
                            <span className="text-sm font-black" style={{ color: lowCredit ? "#F87171" : "#34D399" }}>
                                {CREDITS.percentage.toFixed(1)}%
                            </span>
                        </div>
                        <div className="h-3 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                            <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{
                                    width: `${CREDITS.percentage}%`,
                                    background: lowCredit
                                        ? "linear-gradient(90deg,#F87171,#EF4444)"
                                        : "linear-gradient(90deg,#6366F1,#EC4899)",
                                    boxShadow: `0 0 10px ${lowCredit ? "rgba(248,113,113,0.5)" : "rgba(236,72,153,0.4)"}`,
                                }}
                            />
                        </div>
                        <div className="flex justify-between mt-1.5">
                            <span className="text-[10px] text-slate-600">0</span>
                            <span className="text-[10px] text-slate-600">{remaining.toLocaleString()} remaining</span>
                            <span className="text-[10px] text-slate-600">{CREDITS.total.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Breakdown by feature */}
                    <div className="space-y-4">
                        {CREDITS.breakdown.map(b => (
                            <div key={b.label}>
                                <div className="flex items-center justify-between mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: b.color }} />
                                        <span className="text-[11px] text-slate-400">{b.label}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[11px] text-slate-500">{b.used.toLocaleString()}</span>
                                        <span className="text-[10px] font-bold" style={{ color: b.color }}>
                                            {((b.used / CREDITS.total) * 100).toFixed(0)}%
                                        </span>
                                    </div>
                                </div>
                                <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                                    <div
                                        className="h-full rounded-full transition-all duration-700"
                                        style={{
                                            width: `${(b.used / CREDITS.total) * 100}%`,
                                            background: `linear-gradient(90deg,${b.color},${b.color}80)`,
                                            boxShadow: `0 0 6px ${b.color}50`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div
                        className="mt-5 flex items-center gap-2 px-3 py-2.5 rounded-xl"
                        style={{ background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.18)" }}
                    >
                        <Sparkles className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0" />
                        <p className="text-[11px] text-slate-400">
                            At current pace you'll exhaust credits in{" "}
                            <span className="text-white font-semibold">~5 days</span>.{" "}
                            <span className="text-indigo-400 font-semibold cursor-pointer hover:underline" onClick={() => setShowUpgrade(true)}>
                                Upgrade for unlimited →
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            {/* ━━━━━━━━━━━━━━━━━━━━  Upgrade Plans (toggled)  ━━━━━━━━━━━━━━━━━━ */}
            {showUpgrade && (
                <div className="animate-fade-in">
                    <div className="flex items-center gap-2 mb-4">
                        <Zap className="h-4 w-4 text-pink-400" />
                        <h3 className="text-sm font-bold text-white">Choose Your Plan</h3>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                        {PLANS.map((plan, i) => (
                            <div
                                key={plan.name}
                                className={`relative rounded-2xl p-6 transition-all duration-300 cursor-pointer ${plan.current ? "" : "hover:-translate-y-1"}`}
                                style={{
                                    background: plan.current
                                        ? `linear-gradient(135deg,rgba(${plan.rgb},0.18),rgba(${plan.rgb},0.06))`
                                        : `rgba(${plan.rgb},0.06)`,
                                    border: `1px solid rgba(${plan.rgb},${plan.current ? "0.4" : "0.2"})`,
                                    backdropFilter: "blur(16px)",
                                    boxShadow: plan.current ? `0 0 30px rgba(${plan.rgb},0.15)` : "none",
                                }}
                            >
                                {plan.tag && (
                                    <span
                                        className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-black px-3 py-1 rounded-full whitespace-nowrap"
                                        style={{
                                            background: plan.current
                                                ? "linear-gradient(135deg,#EC4899,#6366F1)"
                                                : `linear-gradient(135deg,${plan.color},${plan.color}cc)`,
                                            color: plan.current ? "#fff" : "#000",
                                            boxShadow: `0 4px 12px rgba(${plan.rgb},0.4)`,
                                        }}
                                    >
                                        {plan.tag}
                                    </span>
                                )}

                                <div className="mt-2 mb-4">
                                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: plan.color }}>{plan.name}</p>
                                    <div className="flex items-end gap-1 mt-1">
                                        <span className="text-3xl font-black text-white">${plan.price}</span>
                                        <span className="text-slate-500 text-sm mb-1">/month</span>
                                    </div>
                                    <p className="text-[11px] text-slate-600 mt-0.5">{plan.credits} credits/mo</p>
                                </div>

                                <div className="space-y-2 mb-6">
                                    {plan.features.map(f => (
                                        <div key={f} className="flex items-center gap-2">
                                            <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" style={{ color: plan.color }} />
                                            <span className="text-[11px] text-slate-400">{f}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    className="w-full py-2.5 rounded-xl text-xs font-bold transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-1.5"
                                    style={
                                        plan.current
                                            ? { background: "rgba(255,255,255,0.07)", color: "#64748B", cursor: "default" }
                                            : { background: `linear-gradient(135deg,${plan.color},${plan.color}cc)`, color: plan.name === "Business" ? "#000" : "#fff", boxShadow: `0 4px 12px rgba(${plan.rgb},0.35)` }
                                    }
                                    disabled={plan.current}
                                >
                                    {plan.current ? (
                                        <><CheckCircle2 className="h-3.5 w-3.5" /> Current Plan</>
                                    ) : (
                                        <><Zap className="h-3.5 w-3.5" /> Upgrade to {plan.name}</>
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Payment History  ━━━━━━━━━━━━━ */}
            <div
                className="rounded-2xl overflow-hidden animate-fade-in"
                style={{ background: "rgba(13,20,33,0.82)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-indigo-400" />
                        <h3 className="text-sm font-bold text-white">Payment History</h3>
                    </div>
                    <button className="text-xs text-slate-500 hover:text-indigo-400 transition-colors font-medium flex items-center gap-1">
                        <Download className="h-3.5 w-3.5" /> Export All
                    </button>
                </div>

                {/* Table header */}
                <div
                    className="grid grid-cols-12 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-600"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.015)" }}
                >
                    <span className="col-span-3">Invoice</span>
                    <span className="col-span-3">Date</span>
                    <span className="col-span-3">Method</span>
                    <span className="col-span-1 text-center">Status</span>
                    <span className="col-span-1 text-right">Amount</span>
                    <span className="col-span-1 text-right">PDF</span>
                </div>

                {PAYMENT_HISTORY.map((p, i) => {
                    const ss = STATUS_STYLE[p.status] ?? STATUS_STYLE.Pending
                    return (
                        <div
                            key={p.id}
                            className="grid grid-cols-12 items-center px-6 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group"
                            style={{ borderBottom: i < PAYMENT_HISTORY.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                        >
                            <span className="col-span-3 text-xs font-bold text-indigo-400 group-hover:text-indigo-300 transition-colors">{p.id}</span>
                            <span className="col-span-3 text-xs text-slate-400">{p.date}</span>
                            <div className="col-span-3 flex items-center gap-1.5">
                                <div className="h-5 w-8 rounded flex items-center justify-center"
                                    style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.2)" }}>
                                    <CreditCard className="h-3 w-3 text-indigo-400" />
                                </div>
                                <span className="text-[11px] text-slate-500">{p.method}</span>
                            </div>
                            <div className="col-span-1 flex justify-center">
                                <span
                                    className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                                    style={{ background: ss.bg, color: ss.text, border: `1px solid ${ss.border}` }}
                                >
                                    {p.status}
                                </span>
                            </div>
                            <span className="col-span-1 text-right text-xs font-black text-white">${p.amount}</span>
                            <div className="col-span-1 flex justify-end">
                                <button className="flex items-center justify-center h-6 w-6 rounded-lg transition-colors hover:bg-white/[0.06]"
                                    style={{ color: "#475569" }}>
                                    <Download className="h-3 w-3" />
                                </button>
                            </div>
                        </div>
                    )
                })}

                <div
                    className="px-6 py-3 flex items-center justify-between text-xs border-t border-white/[0.04]"
                    style={{ background: "rgba(255,255,255,0.01)" }}
                >
                    <span className="text-slate-600">
                        Total paid: <span className="text-white font-bold">${PAYMENT_HISTORY.reduce((s, p) => s + p.amount, 0)}</span>
                    </span>
                    <button className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">View all →</button>
                </div>
            </div>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━  Monthly Spend Bar Chart  ━━━━━━━━━━━━━ */}
            <div
                className="rounded-2xl overflow-hidden animate-fade-in"
                style={{ background: "rgba(13,20,33,0.82)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-pink-400" />
                        <h3 className="text-sm font-bold text-white">Monthly Spend</h3>
                    </div>
                    <span className="text-[11px] text-slate-500">Sep 2025 – Feb 2026</span>
                </div>
                <div className="p-6">
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={SPEND_TREND} margin={{ top: 4, right: 4, left: -24, bottom: 0 }} barCategoryGap="35%">
                            <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.04)" vertical={false} />
                            <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false}
                                tickFormatter={v => `$${v}`} domain={[0, 100]} />
                            <Tooltip content={<SpendTip />} cursor={{ fill: "rgba(255,255,255,0.025)", radius: 4 }} />
                            <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                                {SPEND_TREND.map((d, i) => (
                                    <Cell
                                        key={i}
                                        fill={d.amount === 79 ? "#6366F1" : "#475569"}
                                        style={{ filter: d.amount === 79 ? "drop-shadow(0 0 7px rgba(99,102,241,0.5))" : "none" }}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="flex items-center gap-4 mt-3">
                        {[
                            { label: "Starter ($49)", color: "#475569" },
                            { label: "Pro ($79)", color: "#6366F1" },
                        ].map(l => (
                            <div key={l.label} className="flex items-center gap-1.5">
                                <div className="h-2 w-2 rounded-sm" style={{ background: l.color }} />
                                <span className="text-[11px] text-slate-500">{l.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Security + Payment method strip ─────────────────────────────── */}
            <div className="grid gap-4 sm:grid-cols-2">
                {/* Payment method */}
                <div
                    className="flex items-center gap-4 px-5 py-4 rounded-2xl"
                    style={{ background: "rgba(13,20,33,0.82)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}
                >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl flex-shrink-0"
                        style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)" }}>
                        <CreditCard className="h-5 w-5 text-indigo-400" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-bold text-white">Visa •••• 4242</p>
                        <p className="text-[11px] text-slate-500">Expires 08/2027 · Default card</p>
                    </div>
                    <button className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors flex items-center gap-1">
                        Change <ChevronRight className="h-3 w-3" />
                    </button>
                </div>

                {/* Security */}
                <div
                    className="flex items-center gap-4 px-5 py-4 rounded-2xl"
                    style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.18)", backdropFilter: "blur(20px)" }}
                >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl flex-shrink-0"
                        style={{ background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.25)" }}>
                        <Shield className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-bold text-white">Payments Secured</p>
                        <p className="text-[11px] text-slate-500">256-bit SSL · PCI-DSS compliant · Auto-renew</p>
                    </div>
                    <Lock className="h-4 w-4 text-emerald-400 flex-shrink-0" />
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
                    <p className="text-sm font-bold text-white mb-0.5">You're getting exceptional ROI on Pro</p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Your chatbot generated <span className="text-emerald-400 font-semibold">$18,796</span> in cart recovery +{" "}
                        <span className="text-emerald-400 font-semibold">$57,600</span> in AI orders this month —{" "}
                        a <span className="text-white font-semibold">965× return</span> on your $79 plan.
                        Upgrading to <span className="text-amber-400 font-semibold">Business at $199</span> unlocks
                        unlimited credits &amp; custom AI training, projected to add{" "}
                        <span className="text-emerald-400 font-semibold">+$12,000/month</span>.
                    </p>
                </div>
                <button
                    onClick={() => setShowUpgrade(true)}
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-90 active:scale-95"
                    style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)", boxShadow: "0 4px 12px rgba(251,191,36,0.4)", color: "#000" }}
                >
                    <Zap className="h-3.5 w-3.5" /> Upgrade
                </button>
            </div>

        </div>
    )
}
