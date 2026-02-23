"use client"

import { useState } from "react"
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell, PieChart, Pie, Legend,
    LabelList,
} from "recharts"
import {
    ShoppingBag, TrendingUp, DollarSign, Percent,
    Trophy, Sparkles, Zap, ArrowUpRight, Package2,
} from "lucide-react"

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Data  ━━━━━━━━━━━━━━━━━━━━ */

const TOP_PRODUCTS = [
    {
        rank: 1,
        name: "Rose Floral Midi Dress",
        cat: "Dresses",
        units: 112,
        revenue: 21168,
        aov: 189,
        conv: 44,
        color: "#EC4899",
        rgb: "236,72,153",
        medal: "🥇",
    },
    {
        rank: 2,
        name: "Classic Slim-Fit Jeans",
        cat: "Jeans",
        units: 94,
        revenue: 13160,
        aov: 140,
        conv: 38,
        color: "#6366F1",
        rgb: "99,102,241",
        medal: "🥈",
    },
    {
        rank: 3,
        name: "Oversized Graphic Tee",
        cat: "T-Shirts",
        units: 81,
        revenue: 6480,
        aov: 80,
        conv: 35,
        color: "#34D399",
        rgb: "52,211,153",
        medal: "🥉",
    },
    {
        rank: 4,
        name: "Block-Heel Ankle Boots",
        cat: "Shoes",
        units: 63,
        revenue: 12474,
        aov: 198,
        conv: 29,
        color: "#FBBF24",
        rgb: "251,191,36",
        medal: "4️⃣",
    },
    {
        rank: 5,
        name: "Stripe Linen Shirt",
        cat: "T-Shirts",
        units: 54,
        revenue: 4320,
        aov: 80,
        conv: 25,
        color: "#22D3EE",
        rgb: "34,211,238",
        medal: "5️⃣",
    },
]

// Horizontal-bar chart data — sorted by units desc
const TOP5_BAR = TOP_PRODUCTS.map(p => ({
    name: p.name.length > 22 ? p.name.slice(0, 22) + "…" : p.name,
    fullName: p.name,
    units: p.units,
    revenue: p.revenue,
    color: p.color,
}))

const CATEGORY_DATA = [
    { cat: "T-Shirts", units: 135, revenue: 10800, aov: 80, conv: 30, color: "#34D399", rgb: "52,211,153" },
    { cat: "Dresses", units: 112, revenue: 21168, aov: 189, conv: 44, color: "#EC4899", rgb: "236,72,153" },
    { cat: "Jeans", units: 94, revenue: 13160, aov: 140, conv: 38, color: "#6366F1", rgb: "99,102,241" },
    { cat: "Shoes", units: 63, revenue: 12474, aov: 198, conv: 29, color: "#FBBF24", rgb: "251,191,36" },
]

const TOTAL_CAT_REVENUE = CATEGORY_DATA.reduce((s, c) => s + c.revenue, 0)
const TOTAL_CAT_UNITS = CATEGORY_DATA.reduce((s, c) => s + c.units, 0)

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Tooltips  ━━━━━━━━━━━━━ */
function Top5Tip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null
    const d = TOP5_BAR.find(p => p.name === label)
    return (
        <div
            className="rounded-xl px-4 py-3 text-xs"
            style={{ background: "#0A1120", border: "1px solid rgba(236,72,153,0.3)", boxShadow: "0 12px 40px rgba(0,0,0,0.6)" }}
        >
            <p className="font-bold text-white mb-2">{d?.fullName}</p>
            <div className="space-y-1.5">
                <div className="flex justify-between gap-6"><span className="text-slate-500">Units Sold</span><span className="font-bold text-white">{payload[0]?.value}</span></div>
                <div className="flex justify-between gap-6"><span className="text-slate-500">Revenue</span><span className="font-bold text-emerald-400">${d?.revenue.toLocaleString()}</span></div>
            </div>
        </div>
    )
}

function CatTip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null
    const d = CATEGORY_DATA.find(c => c.cat === label)
    return (
        <div
            className="rounded-xl px-4 py-3 text-xs min-w-[160px]"
            style={{ background: "#0A1120", border: "1px solid rgba(99,102,241,0.3)", boxShadow: "0 12px 40px rgba(0,0,0,0.6)" }}
        >
            <p className="font-bold text-white mb-2">{label}</p>
            <div className="space-y-1.5">
                <div className="flex justify-between gap-6"><span className="text-slate-500">Units</span><span className="font-bold text-white">{d?.units}</span></div>
                <div className="flex justify-between gap-6"><span className="text-slate-500">Revenue</span><span className="font-bold text-emerald-400">${d?.revenue.toLocaleString()}</span></div>
                <div className="flex justify-between gap-6"><span className="text-slate-500">Avg AOV</span><span className="font-bold text-indigo-400">${d?.aov}</span></div>
                <div className="flex justify-between gap-6"><span className="text-slate-500">Conv. rate</span><span className="font-bold text-pink-400">{d?.conv}%</span></div>
            </div>
        </div>
    )
}

/* custom donut label */
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)
    if (percent < 0.08) return null
    return (
        <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="bold">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Main  ━━━━━━━━ */
export function ProductPerformance() {
    const [catMetric, setCatMetric] = useState<"units" | "revenue">("units")

    const totalRevenue = TOP_PRODUCTS.reduce((s, p) => s + p.revenue, 0)
    const totalUnits = TOP_PRODUCTS.reduce((s, p) => s + p.units, 0)
    const topAOV = Math.max(...TOP_PRODUCTS.map(p => p.aov))
    const avgConv = (TOP_PRODUCTS.reduce((s, p) => s + p.conv, 0) / TOP_PRODUCTS.length).toFixed(0)

    return (
        <div className="space-y-8">

            {/* ── Page Header ─────────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">Product Performance</h2>
                    <p className="text-sm text-slate-400 mt-0.5">
                        Top chatbot-sold products &amp; category-wise sales — February 2026.
                    </p>
                </div>
                <span
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold self-start sm:self-auto"
                    style={{ background: "rgba(236,72,153,0.09)", border: "1px solid rgba(236,72,153,0.22)", color: "#EC4899" }}
                >
                    <Trophy className="h-3.5 w-3.5" /> {totalUnits} units sold via chatbot
                </span>
            </div>

            {/* ── KPI Cards ───────────────────────────────────────────────────── */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: "Total Bot Revenue", value: `$${(totalRevenue / 1000).toFixed(1)}K`, sub: "Chatbot-attributed", icon: DollarSign, color: "#EC4899", rgb: "236,72,153" },
                    { label: "Units Sold via Bot", value: totalUnits.toString(), sub: "Top 5 products combined", icon: Package2, color: "#34D399", rgb: "52,211,153" },
                    { label: "Highest AOV", value: `$${topAOV}`, sub: "Block-Heel Ankle Boots", icon: TrendingUp, color: "#FBBF24", rgb: "251,191,36" },
                    { label: "Avg Conversion Rate", value: `${avgConv}%`, sub: "Chatbot-assisted sessions", icon: Percent, color: "#6366F1", rgb: "99,102,241" },
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
                        <div className="absolute -top-5 -right-5 h-20 w-20 rounded-full pointer-events-none" style={{ background: `radial-gradient(circle,${c.color},transparent 70%)`, opacity: 0.1 }} />
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl mb-4" style={{ background: `rgba(${c.rgb},0.14)`, border: `1px solid rgba(${c.rgb},0.25)` }}>
                            <c.icon className="h-5 w-5" style={{ color: c.color }} />
                        </div>
                        <p className="text-2xl font-black text-white tracking-tight">{c.value}</p>
                        <p className="text-sm font-semibold text-slate-300 mt-0.5">{c.label}</p>
                        <p className="text-[11px] text-slate-500">{c.sub}</p>
                    </div>
                ))}
            </div>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  CHART 1: Top 5 Products  ━━━ */}
            <div
                className="rounded-2xl overflow-hidden animate-fade-in"
                style={{ background: "rgba(13,20,33,0.82)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}
            >
                {/* Card header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-amber-400" />
                        <h3 className="text-sm font-bold text-white">Top 5 Products Sold via Chatbot</h3>
                    </div>
                    <span className="text-[11px] text-slate-500">units sold · chatbot-attributed</span>
                </div>

                <div className="grid lg:grid-cols-5 gap-0">
                    {/* Horizontal bar chart */}
                    <div className="lg:col-span-3 p-6">
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart
                                data={TOP5_BAR}
                                layout="vertical"
                                margin={{ top: 4, right: 60, left: 8, bottom: 4 }}
                                barCategoryGap="22%"
                            >
                                <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                                <XAxis type="number" tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    width={150}
                                    tick={{ fill: "#94A3B8", fontSize: 10 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip content={<Top5Tip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                                <Bar dataKey="units" radius={[0, 6, 6, 0]}>
                                    {TOP5_BAR.map((d, i) => (
                                        <Cell
                                            key={i}
                                            fill={d.color}
                                            style={{ filter: `drop-shadow(0 0 6px ${d.color}55)` }}
                                        />
                                    ))}
                                    <LabelList
                                        dataKey="units"
                                        position="right"
                                        style={{ fill: "#CBD5E1", fontSize: 11, fontWeight: "bold" }}
                                    />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Right: ranked product cards */}
                    <div className="lg:col-span-2 border-l border-white/[0.05] divide-y divide-white/[0.04]">
                        {TOP_PRODUCTS.map((p, i) => (
                            <div
                                key={p.name}
                                className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.025] transition-colors cursor-pointer group"
                            >
                                {/* Rank badge */}
                                <div
                                    className="flex h-8 w-8 items-center justify-center rounded-xl flex-shrink-0 text-sm font-black"
                                    style={{ background: `rgba(${p.rgb},0.15)`, border: `1px solid rgba(${p.rgb},0.3)`, color: p.color }}
                                >
                                    #{p.rank}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[11px] font-semibold text-slate-300 group-hover:text-white truncate transition-colors">{p.name}</p>
                                    <p className="text-[10px] text-slate-600">{p.cat}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-xs font-black text-white">${p.revenue.toLocaleString()}</p>
                                    <p className="text-[10px] text-slate-600">{p.units} units</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Summary footer */}
                <div
                    className="px-6 py-3 border-t border-white/[0.04] flex items-center justify-between"
                    style={{ background: "rgba(255,255,255,0.01)" }}
                >
                    <span className="text-[11px] text-slate-600">
                        Combined revenue from top 5: <span className="text-emerald-400 font-bold">${totalRevenue.toLocaleString()}</span>
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-pink-400 font-semibold">
                        <ArrowUpRight className="h-3 w-3" /> +22.4% vs last month
                    </div>
                </div>
            </div>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  CHART 2: Category Sales  ━━ */}
            <div className="grid gap-5 lg:grid-cols-3">

                {/* Bar chart — 2/3 width */}
                <div
                    className="lg:col-span-2 rounded-2xl overflow-hidden animate-fade-in"
                    style={{ background: "rgba(13,20,33,0.82)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}
                >
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                        <div className="flex items-center gap-2">
                            <ShoppingBag className="h-4 w-4 text-indigo-400" />
                            <h3 className="text-sm font-bold text-white">Category-wise Sales</h3>
                        </div>
                        {/* Metric toggle */}
                        <div
                            className="inline-flex rounded-lg p-0.5 gap-0.5"
                            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                        >
                            {(["units", "revenue"] as const).map(m => (
                                <button
                                    key={m}
                                    onClick={() => setCatMetric(m)}
                                    className="px-2.5 py-1 rounded-md text-[11px] font-bold capitalize transition-all"
                                    style={
                                        catMetric === m
                                            ? { background: "linear-gradient(135deg,#6366F1,#EC4899)", color: "#fff" }
                                            : { color: "#64748B" }
                                    }
                                >
                                    {m === "units" ? "Units" : "Revenue"}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="p-6">
                        <ResponsiveContainer width="100%" height={240}>
                            <BarChart
                                data={CATEGORY_DATA}
                                margin={{ top: 4, right: 4, left: catMetric === "revenue" ? -4 : -16, bottom: 0 }}
                                barCategoryGap="30%"
                            >
                                <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.04)" vertical={false} />
                                <XAxis dataKey="cat" tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
                                <YAxis
                                    tick={{ fill: "#64748B", fontSize: 10 }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={v => catMetric === "revenue" ? `$${(v / 1000).toFixed(0)}K` : `${v}`}
                                />
                                <Tooltip content={<CatTip />} cursor={{ fill: "rgba(255,255,255,0.025)", radius: 4 }} />
                                <Bar dataKey={catMetric} radius={[6, 6, 0, 0]}>
                                    {CATEGORY_DATA.map((c, i) => (
                                        <Cell
                                            key={i}
                                            fill={c.color}
                                            style={{ filter: `drop-shadow(0 0 7px ${c.color}55)` }}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Donut + legend — 1/3 width */}
                <div
                    className="rounded-2xl p-5 animate-fade-in flex flex-col"
                    style={{ background: "rgba(13,20,33,0.82)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}
                >
                    <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="h-4 w-4 text-pink-400" />
                        <h3 className="text-xs font-bold text-white">Revenue Share</h3>
                    </div>
                    <p className="text-[10px] text-slate-600 mb-3">by category — chatbot sales</p>

                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={CATEGORY_DATA.map(c => ({ name: c.cat, value: c.revenue, color: c.color }))}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                dataKey="value"
                                paddingAngle={3}
                                labelLine={false}
                                label={renderCustomLabel}
                            >
                                {CATEGORY_DATA.map((c, i) => (
                                    <Cell
                                        key={i}
                                        fill={c.color}
                                        style={{ filter: `drop-shadow(0 0 6px ${c.color}60)` }}
                                    />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Legend */}
                    <div className="mt-auto space-y-2.5">
                        {CATEGORY_DATA.map(c => (
                            <div key={c.cat} className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <div className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ background: c.color, boxShadow: `0 0 6px ${c.color}` }} />
                                    <span className="text-[11px] text-slate-400">{c.cat}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[11px] font-bold text-white">${c.revenue.toLocaleString()}</span>
                                    <span className="text-[10px] text-slate-600 ml-1">
                                        ({((c.revenue / TOTAL_CAT_REVENUE) * 100).toFixed(0)}%)
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Category Breakdown cards ─────────────────────────────────────── */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {CATEGORY_DATA.map((c, i) => (
                    <div
                        key={c.cat}
                        className="rounded-2xl p-5 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer animate-fade-in-up"
                        style={{
                            background: `rgba(${c.rgb},0.07)`,
                            border: `1px solid rgba(${c.rgb},0.22)`,
                            backdropFilter: "blur(16px)",
                            animationDelay: `${i * 60}ms`,
                        }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold" style={{ color: c.color }}>{c.cat}</span>
                            <span
                                className="text-[10px] font-black px-1.5 py-0.5 rounded"
                                style={{ background: `rgba(${c.rgb},0.15)`, color: c.color, border: `1px solid rgba(${c.rgb},0.3)` }}
                            >
                                {c.conv}% conv.
                            </span>
                        </div>

                        {/* Revenue — big hero number */}
                        <p className="text-2xl font-black text-white tracking-tight">${c.revenue.toLocaleString()}</p>
                        <p className="text-[11px] text-slate-500 mb-4">{c.units} units · ${c.aov} AOV</p>

                        {/* Revenue share progress bar */}
                        <div>
                            <div className="flex justify-between text-[10px] text-slate-600 mb-1">
                                <span>Revenue share</span>
                                <span>{((c.revenue / TOTAL_CAT_REVENUE) * 100).toFixed(0)}%</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                                <div
                                    className="h-full rounded-full transition-all duration-700"
                                    style={{
                                        width: `${((c.revenue / TOTAL_CAT_REVENUE) * 100).toFixed(0)}%`,
                                        background: `linear-gradient(90deg,${c.color},${c.color}88)`,
                                        boxShadow: `0 0 8px ${c.color}55`,
                                    }}
                                />
                            </div>
                        </div>

                        {/* Units share progress bar */}
                        <div className="mt-2">
                            <div className="flex justify-between text-[10px] text-slate-600 mb-1">
                                <span>Units share</span>
                                <span>{((c.units / TOTAL_CAT_UNITS) * 100).toFixed(0)}%</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                                <div
                                    className="h-full rounded-full transition-all duration-700"
                                    style={{
                                        width: `${((c.units / TOTAL_CAT_UNITS) * 100).toFixed(0)}%`,
                                        background: `linear-gradient(90deg,${c.color}66,${c.color}33)`,
                                    }}
                                />
                            </div>
                        </div>
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
                    <p className="text-sm font-bold text-white mb-0.5">Growth Opportunity · Shoes</p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Shoes have the highest AOV at <span className="text-yellow-400 font-semibold">$198</span> but only
                        <span className="text-white font-semibold"> 63 units</span> sold. Adding a{" "}
                        <span className="text-indigo-400 font-semibold">"Complete the outfit"</span> recommendation after
                        Dress or Jeans purchase could push shoe sales to{" "}
                        <span className="text-pink-400 font-semibold">100+ units</span>, unlocking an estimated{" "}
                        <span className="text-emerald-400 font-semibold">+$7,500/month</span>.
                    </p>
                </div>
                <button
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 active:scale-95"
                    style={{ background: "linear-gradient(135deg,#6366F1,#EC4899)", boxShadow: "0 4px 12px rgba(99,102,241,0.4)" }}
                >
                    <Zap className="h-3.5 w-3.5" /> Enable
                </button>
            </div>

        </div>
    )
}
