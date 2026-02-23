"use client"

import { useState } from "react"
import {
    BarChart, Bar, AreaChart, Area, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts"
import {
    ShoppingBag, DollarSign, Clock, TrendingUp,
    Shirt, ArrowUpRight, Sparkles, Zap, CheckCircle2,
    PackageCheck, Star, Tag,
} from "lucide-react"

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Sample data  ━━━━━ */

const DAILY_ORDERS = [
    { day: "Feb 1", orders: 28, revenue: 3360 },
    { day: "Feb 5", orders: 34, revenue: 4080 },
    { day: "Feb 9", orders: 41, revenue: 4920 },
    { day: "Feb 13", orders: 48, revenue: 5760 },
    { day: "Feb 17", orders: 55, revenue: 6600 },
    { day: "Feb 21", orders: 62, revenue: 7440 },
    { day: "Feb 23", orders: 68, revenue: 8160 },
]

const CATEGORY_ORDERS = [
    { cat: "Dresses", orders: 112, aov: 189, color: "#EC4899" },
    { cat: "Kurtas", orders: 86, aov: 142, color: "#A78BFA" },
    { cat: "Tops", orders: 74, aov: 97, color: "#6366F1" },
    { cat: "Denim", orders: 58, aov: 124, color: "#22D3EE" },
    { cat: "Sarees", orders: 34, aov: 214, color: "#FBBF24" },
    { cat: "Activewear", orders: 22, aov: 88, color: "#34D399" },
]

const RECENT_ORDERS = [
    { id: "#KR-4821", customer: "Priya M.", product: "Rose Floral Midi Dress", amount: "$189", status: "Shipped", channel: "Try-On", time: "2h ago" },
    { id: "#KR-4820", customer: "Anika R.", product: "Banarasi Silk Kurta Set", amount: "$214", status: "Delivered", channel: "Chatbot", time: "5h ago" },
    { id: "#KR-4819", customer: "Divya S.", product: "Indigo Linen Co-ord", amount: "$156", status: "Shipped", channel: "Cart Bot", time: "7h ago" },
    { id: "#KR-4818", customer: "Meera K.", product: "Hand-Block Print Kurti", amount: "$98", status: "Pending", channel: "Chatbot", time: "9h ago" },
    { id: "#KR-4817", customer: "Sunita P.", product: "Classic White Cotton Tee", amount: "$64", status: "Delivered", channel: "Try-On", time: "12h ago" },
    { id: "#KR-4816", customer: "Ritu B.", product: "Embroidered Silk Saree", amount: "$340", status: "Shipped", channel: "Cart Bot", time: "14h ago" },
]

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Shared tooltip  ━━━━━━━ */
function ChartTip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null
    return (
        <div
            className="rounded-xl px-4 py-3 text-xs min-w-[160px]"
            style={{ background: "#0A1120", border: "1px solid rgba(236,72,153,0.3)", boxShadow: "0 12px 40px rgba(0,0,0,0.6)" }}
        >
            <p className="font-bold text-slate-300 mb-2">{label}</p>
            {payload.map((p: any) => (
                <div key={p.dataKey} className="flex items-center justify-between gap-5 mb-1">
                    <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
                        <span className="text-slate-500 capitalize">{
                            p.dataKey === "orders" ? "Orders" :
                                p.dataKey === "revenue" ? "Revenue" : p.dataKey
                        }</span>
                    </span>
                    <span className="font-bold text-white">
                        {p.dataKey === "revenue" ? `$${p.value.toLocaleString()}` : p.value}
                    </span>
                </div>
            ))}
        </div>
    )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Status badge  ━━━━━━━━━ */
const STATUS_STYLES: Record<string, { bg: string; text: string; border: string }> = {
    Shipped: { bg: "rgba(99,102,241,0.1)", text: "#818CF8", border: "rgba(99,102,241,0.25)" },
    Delivered: { bg: "rgba(52,211,153,0.1)", text: "#34D399", border: "rgba(52,211,153,0.25)" },
    Pending: { bg: "rgba(251,191,36,0.1)", text: "#FBBF24", border: "rgba(251,191,36,0.25)" },
}

const CHANNEL_COLORS: Record<string, string> = {
    "Try-On": "#A78BFA",
    "Chatbot": "#22D3EE",
    "Cart Bot": "#FBBF24",
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Main  ━━━━━━━━━━ */
export function AIOrders() {
    const [chartMode, setChartMode] = useState<"orders" | "revenue">("orders")
    const totalOrders = 386
    const totalRevenue = 48320
    const avgAOV = 127
    const completionRate = 93.5

    return (
        <div className="space-y-8">

            {/* ── Header ──────────────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">AI-Generated Orders</h2>
                    <p className="text-sm text-slate-400 mt-0.5">
                        Orders initiated or assisted by the chatbot — February 2026.
                    </p>
                </div>
                <span
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold self-start sm:self-auto"
                    style={{ background: "rgba(236,72,153,0.09)", border: "1px solid rgba(236,72,153,0.22)", color: "#EC4899" }}
                >
                    <PackageCheck className="h-3.5 w-3.5" /> {totalOrders} orders this month
                </span>
            </div>

            {/* ── KPI cards ───────────────────────────────────────────────────── */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: "Total Bot Orders", value: totalOrders.toString(), sub: "+18.2% vs last month", icon: ShoppingBag, color: "#EC4899", rgb: "236,72,153" },
                    { label: "Revenue Generated", value: `$${(totalRevenue / 1000).toFixed(1)}K`, sub: "Chatbot-attributed", icon: DollarSign, color: "#34D399", rgb: "52,211,153" },
                    { label: "Avg Order Value", value: `$${avgAOV}`, sub: "+$14 vs organic AOV", icon: Tag, color: "#6366F1", rgb: "99,102,241" },
                    { label: "Completion Rate", value: `${completionRate}%`, sub: "361 completed · 25 pending", icon: CheckCircle2, color: "#FBBF24", rgb: "251,191,36" },
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
                        <div
                            className="absolute -top-5 -right-5 h-20 w-20 rounded-full pointer-events-none"
                            style={{ background: `radial-gradient(circle,${c.color},transparent 70%)`, opacity: 0.1 }}
                        />
                        <div
                            className="flex h-11 w-11 items-center justify-center rounded-xl mb-4"
                            style={{ background: `rgba(${c.rgb},0.14)`, border: `1px solid rgba(${c.rgb},0.25)` }}
                        >
                            <c.icon className="h-5 w-5" style={{ color: c.color }} />
                        </div>
                        <p className="text-2xl font-black text-white tracking-tight">{c.value}</p>
                        <p className="text-sm font-semibold text-slate-300 mt-0.5">{c.label}</p>
                        <p className="text-[11px] text-slate-500">{c.sub}</p>
                    </div>
                ))}
            </div>

            {/* ── Charts row ──────────────────────────────────────────────────── */}
            <div className="grid gap-5 lg:grid-cols-2">

                {/* Daily orders / revenue toggle chart */}
                <div
                    className="rounded-2xl overflow-hidden animate-fade-in"
                    style={{ background: "rgba(13,20,33,0.82)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}
                >
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-pink-400" />
                            <h3 className="text-sm font-bold text-white">Daily Performance</h3>
                        </div>
                        <div
                            className="inline-flex rounded-lg p-0.5 gap-0.5"
                            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                        >
                            {(["orders", "revenue"] as const).map(m => (
                                <button
                                    key={m}
                                    onClick={() => setChartMode(m)}
                                    className="px-2.5 py-1 rounded-md text-[11px] font-bold capitalize transition-all"
                                    style={chartMode === m
                                        ? { background: "linear-gradient(135deg,#EC4899,#6366F1)", color: "#fff" }
                                        : { color: "#64748B" }}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="p-6">
                        <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={DAILY_ORDERS} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="ordGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={chartMode === "orders" ? "#EC4899" : "#34D399"} stopOpacity={0.35} />
                                        <stop offset="95%" stopColor={chartMode === "orders" ? "#EC4899" : "#34D399"} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.04)" />
                                <XAxis dataKey="day" tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
                                <YAxis
                                    tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false}
                                    tickFormatter={v => chartMode === "revenue" ? `$${(v / 1000).toFixed(0)}K` : `${v}`}
                                />
                                <Tooltip content={<ChartTip />} />
                                <Area
                                    type="monotone"
                                    dataKey={chartMode}
                                    stroke={chartMode === "orders" ? "#EC4899" : "#34D399"}
                                    strokeWidth={2.5}
                                    fill="url(#ordGrad)"
                                    dot={false}
                                    style={{ filter: `drop-shadow(0 0 6px ${chartMode === "orders" ? "rgba(236,72,153,0.5)" : "rgba(52,211,153,0.5)"})` }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Orders by category */}
                <div
                    className="rounded-2xl overflow-hidden animate-fade-in"
                    style={{ background: "rgba(13,20,33,0.82)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}
                >
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                        <div className="flex items-center gap-2">
                            <Shirt className="h-4 w-4 text-violet-400" />
                            <h3 className="text-sm font-bold text-white">Orders by Category</h3>
                        </div>
                        <span className="text-[11px] text-slate-500">orders · avg AOV</span>
                    </div>
                    <div className="p-6">
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={CATEGORY_ORDERS} margin={{ top: 4, right: 4, left: -16, bottom: 0 }} barCategoryGap="32%">
                                <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.04)" vertical={false} />
                                <XAxis dataKey="cat" tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: "rgba(255,255,255,0.025)", radius: 4 }}
                                    content={({ active, payload, label }) => {
                                        if (!active || !payload?.length) return null
                                        const d = CATEGORY_ORDERS.find(c => c.cat === label)
                                        return (
                                            <div className="rounded-xl px-4 py-3 text-xs" style={{ background: "#0A1120", border: "1px solid rgba(167,139,250,0.3)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
                                                <p className="font-bold text-white mb-2">{label}</p>
                                                <div className="flex justify-between gap-5 mb-1">
                                                    <span className="text-slate-500">Orders</span>
                                                    <span className="font-bold text-white">{d?.orders}</span>
                                                </div>
                                                <div className="flex justify-between gap-5">
                                                    <span className="text-slate-500">Avg AOV</span>
                                                    <span className="font-bold text-emerald-400">${d?.aov}</span>
                                                </div>
                                            </div>
                                        )
                                    }}
                                />
                                <Bar dataKey="orders" radius={[5, 5, 0, 0]}>
                                    {CATEGORY_ORDERS.map((c, i) => (
                                        <Cell key={i} fill={c.color} style={{ filter: `drop-shadow(0 0 5px ${c.color}60)` }} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* ── Fulfillment split ────────────────────────────────────────────── */}
            <div className="grid gap-4 sm:grid-cols-3 animate-fade-in">
                {[
                    { label: "Via Try-On", value: 148, pct: 38, color: "#A78BFA", rgb: "167,139,250", icon: Shirt },
                    { label: "Via Chatbot", value: 174, pct: 45, color: "#6366F1", rgb: "99,102,241", icon: ShoppingBag },
                    { label: "Via Cart Bot", value: 64, pct: 17, color: "#FBBF24", rgb: "251,191,36", icon: Clock },
                ].map(c => (
                    <div
                        key={c.label}
                        className="rounded-2xl p-5 transition-all hover:-translate-y-0.5 cursor-pointer"
                        style={{ background: `rgba(${c.rgb},0.07)`, border: `1px solid rgba(${c.rgb},0.22)`, backdropFilter: "blur(14px)" }}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <c.icon className="h-4 w-4" style={{ color: c.color }} />
                                <span className="text-xs font-bold text-white">{c.label}</span>
                            </div>
                            <span className="text-xs font-black" style={{ color: c.color }}>{c.pct}%</span>
                        </div>
                        <p className="text-3xl font-black text-white mb-3">{c.value}</p>
                        <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                            <div
                                className="h-full rounded-full transition-all duration-1000"
                                style={{
                                    width: `${c.pct}%`,
                                    background: `linear-gradient(90deg,${c.color},${c.color}70)`,
                                    boxShadow: `0 0 8px ${c.color}50`,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Recent orders table ─────────────────────────────────────────── */}
            <div
                className="rounded-2xl overflow-hidden animate-fade-in"
                style={{ background: "rgba(13,20,33,0.82)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2">
                        <PackageCheck className="h-4 w-4 text-emerald-400" />
                        <h3 className="text-sm font-bold text-white">Recent Bot Orders</h3>
                    </div>
                    <button className="text-xs text-slate-500 hover:text-indigo-400 transition-colors font-medium">
                        Export CSV →
                    </button>
                </div>

                {/* Table header */}
                <div
                    className="grid grid-cols-12 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-600"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.015)" }}
                >
                    <span className="col-span-2">Order ID</span>
                    <span className="col-span-2">Customer</span>
                    <span className="col-span-3">Product</span>
                    <span className="col-span-2 text-center">Channel</span>
                    <span className="col-span-1 text-right">Amount</span>
                    <span className="col-span-1 text-center">Status</span>
                    <span className="col-span-1 text-right">Time</span>
                </div>

                {RECENT_ORDERS.map((order, i) => {
                    const statusStyle = STATUS_STYLES[order.status] ?? STATUS_STYLES.Pending
                    const chColor = CHANNEL_COLORS[order.channel] ?? "#64748B"
                    return (
                        <div
                            key={order.id}
                            className="grid grid-cols-12 items-center px-6 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group"
                            style={{ borderBottom: i < RECENT_ORDERS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                        >
                            <span className="col-span-2 text-xs font-bold text-indigo-400 group-hover:text-indigo-300 transition-colors">{order.id}</span>
                            <span className="col-span-2 text-xs font-medium text-slate-300">{order.customer}</span>
                            <span className="col-span-3 text-xs text-slate-500 truncate pr-2">{order.product}</span>
                            <div className="col-span-2 flex justify-center">
                                <span
                                    className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                                    style={{ background: `${chColor}18`, color: chColor, border: `1px solid ${chColor}35` }}
                                >
                                    {order.channel}
                                </span>
                            </div>
                            <span className="col-span-1 text-right text-xs font-bold text-white">{order.amount}</span>
                            <div className="col-span-1 flex justify-center">
                                <span
                                    className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                                    style={{ background: statusStyle.bg, color: statusStyle.text, border: `1px solid ${statusStyle.border}` }}
                                >
                                    {order.status}
                                </span>
                            </div>
                            <span className="col-span-1 text-right text-[10px] text-slate-600">{order.time}</span>
                        </div>
                    )
                })}

                <div
                    className="px-6 py-3 flex items-center justify-between text-xs border-t border-white/[0.04]"
                    style={{ background: "rgba(255,255,255,0.01)" }}
                >
                    <span className="text-slate-600">Showing 6 of {totalOrders} orders</span>
                    <button className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">View all →</button>
                </div>
            </div>

            {/* ── AI insight ──────────────────────────────────────────────────── */}
            <div
                className="flex items-start gap-4 px-5 py-4 rounded-2xl animate-fade-in"
                style={{
                    background: "linear-gradient(135deg,rgba(236,72,153,0.08),rgba(99,102,241,0.04))",
                    border: "1px solid rgba(236,72,153,0.22)",
                }}
            >
                <Sparkles className="h-5 w-5 text-pink-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white mb-0.5">Upsell Opportunity</p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Sarees have the highest AOV at <span className="text-pink-400 font-semibold">$214</span> but only
                        34 bot orders. Adding a proactive &quot;Complete the look&quot; upsell after Try-On could push
                        Saree orders to <span className="text-pink-400 font-semibold">60+</span>, adding
                        ~<span className="text-emerald-400 font-semibold">$5,600/month</span>.
                    </p>
                </div>
                <button
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 active:scale-95"
                    style={{ background: "linear-gradient(135deg,#EC4899,#6366F1)", boxShadow: "0 4px 12px rgba(236,72,153,0.4)" }}
                >
                    <Zap className="h-3.5 w-3.5" /> Enable
                </button>
            </div>

        </div>
    )
}
