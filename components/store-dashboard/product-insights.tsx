"use client"

import { useState } from "react"
import {
    BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts"
import {
    Star, TrendingUp, Package, Eye,
    ArrowUpRight, Sparkles, Zap, ShoppingBag, BarChart2, Search,
} from "lucide-react"

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Sample data  ━━━━━ */

const TOP_PRODUCTS = [
    { rank: 1, name: "Rose Floral Midi Dress", cat: "Dresses", views: 3120, orders: 112, rev: 21168, conv: 44, rating: 4.9, tryons: 312, color: "#EC4899" },
    { rank: 2, name: "Banarasi Silk Kurta Set", cat: "Kurtas", views: 2780, orders: 86, rev: 12212, conv: 41, rating: 4.8, tryons: 278, color: "#A78BFA" },
    { rank: 3, name: "Indigo Linen Co-ord", cat: "Tops", views: 2410, orders: 74, rev: 11544, conv: 39, rating: 4.7, tryons: 241, color: "#6366F1" },
    { rank: 4, name: "Hand-Block Print Kurti", cat: "Kurtas", views: 2040, orders: 58, rev: 5684, conv: 34, rating: 4.6, tryons: 204, color: "#22D3EE" },
    { rank: 5, name: "Classic White Cotton Tee", cat: "Tops", views: 1960, orders: 48, rev: 3072, conv: 28, rating: 4.5, tryons: 196, color: "#34D399" },
    { rank: 6, name: "Embroidered Silk Saree", cat: "Sarees", views: 1680, orders: 34, rev: 7276, conv: 42, rating: 4.9, tryons: 168, color: "#FBBF24" },
    { rank: 7, name: "Denim Wide-Leg Pants", cat: "Denim", views: 1450, orders: 28, rev: 2240, conv: 26, rating: 4.4, tryons: 145, color: "#F87171" },
]

const CATEGORY_PERF = [
    { cat: "Dresses", revenue: 21168, orders: 112, conv: 44, color: "#EC4899" },
    { cat: "Kurtas", revenue: 17896, orders: 86, conv: 38, color: "#A78BFA" },
    { cat: "Tops", revenue: 14616, orders: 74, conv: 32, color: "#6366F1" },
    { cat: "Sarees", revenue: 7276, orders: 34, conv: 42, color: "#FBBF24" },
    { cat: "Denim", revenue: 5984, orders: 58, conv: 24, color: "#22D3EE" },
    { cat: "Activewear", revenue: 3080, orders: 22, conv: 20, color: "#34D399" },
]

const RADAR_DATA = [
    { metric: "Views", Dresses: 90, Kurtas: 78, Sarees: 48 },
    { metric: "Orders", Dresses: 85, Kurtas: 65, Sarees: 26 },
    { metric: "Revenue", Dresses: 95, Kurtas: 80, Sarees: 55 },
    { metric: "Conversion", Dresses: 88, Kurtas: 74, Sarees: 84 },
    { metric: "Try-On", Dresses: 100, Kurtas: 82, Sarees: 50 },
    { metric: "Rating", Dresses: 98, Kurtas: 96, Sarees: 98 },
]

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Tooltips  ━━━━━━━━━━━━━ */
function CatTip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null
    const d = CATEGORY_PERF.find(c => c.cat === label)
    return (
        <div className="rounded-xl px-4 py-3 text-xs" style={{ background: "#0A1120", border: "1px solid rgba(236,72,153,0.3)", boxShadow: "0 12px 40px rgba(0,0,0,0.6)" }}>
            <p className="font-bold text-white mb-2">{label}</p>
            <div className="space-y-1.5">
                <div className="flex justify-between gap-5"><span className="text-slate-500">Revenue</span><span className="font-bold text-white">${d?.revenue.toLocaleString()}</span></div>
                <div className="flex justify-between gap-5"><span className="text-slate-500">Orders</span><span className="font-bold text-white">{d?.orders}</span></div>
                <div className="flex justify-between gap-5"><span className="text-slate-500">Conv.</span><span className="font-bold text-emerald-400">{d?.conv}%</span></div>
            </div>
        </div>
    )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Main  ━━━━━━━━━ */
export function ProductInsights() {
    const [search, setSearch] = useState("")
    const [sortBy, setSortBy] = useState<"orders" | "rev" | "conv" | "rating">("orders")
    const [catFilter, setCatFilter] = useState("All")

    const cats = ["All", ...Array.from(new Set(TOP_PRODUCTS.map(p => p.cat)))]

    const filtered = TOP_PRODUCTS
        .filter(p => catFilter === "All" || p.cat === catFilter)
        .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => (b[sortBy] as number) - (a[sortBy] as number))

    const totalRevenue = TOP_PRODUCTS.reduce((s, p) => s + p.rev, 0)
    const totalOrders = TOP_PRODUCTS.reduce((s, p) => s + p.orders, 0)
    const avgRating = (TOP_PRODUCTS.reduce((s, p) => s + p.rating, 0) / TOP_PRODUCTS.length).toFixed(1)

    return (
        <div className="space-y-8">

            {/* ── Header ──────────────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">Product Insights</h2>
                    <p className="text-sm text-slate-400 mt-0.5">
                        Top chatbot-driven products — views, conversions, revenue &amp; ratings.
                    </p>
                </div>
                <span
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold self-start sm:self-auto"
                    style={{ background: "rgba(251,191,36,0.09)", border: "1px solid rgba(251,191,36,0.22)", color: "#FBBF24" }}
                >
                    <Star className="h-3.5 w-3.5" /> Avg Rating {avgRating}★ across all products
                </span>
            </div>

            {/* ── Summary KPIs ────────────────────────────────────────────────── */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: "Total SKUs Sold via Bot", value: `${TOP_PRODUCTS.length}+`, sub: "Across 6 categories", icon: Package, color: "#6366F1", rgb: "99,102,241" },
                    { label: "Total Bot Revenue", value: `$${(totalRevenue / 1000).toFixed(0)}K`, sub: "Product-level attribution", icon: ShoppingBag, color: "#EC4899", rgb: "236,72,153" },
                    { label: "Total Bot Orders", value: totalOrders.toString(), sub: "Chatbot-assisted", icon: BarChart2, color: "#34D399", rgb: "52,211,153" },
                    { label: "Avg Product Rating", value: `${avgRating} ★`, sub: "Based on 2,849 reviews", icon: Star, color: "#FBBF24", rgb: "251,191,36" },
                ].map((c, i) => (
                    <div
                        key={c.label}
                        className="relative rounded-2xl p-5 overflow-hidden group hover:-translate-y-0.5 transition-all duration-300 cursor-pointer animate-fade-in-up"
                        style={{ background: `rgba(${c.rgb},0.07)`, border: `1px solid rgba(${c.rgb},0.22)`, backdropFilter: "blur(16px)", animationDelay: `${i * 60}ms` }}
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

            {/* ── Charts row ──────────────────────────────────────────────────── */}
            <div className="grid gap-5 lg:grid-cols-3">

                {/* Category revenue bar (2/3) */}
                <div
                    className="lg:col-span-2 rounded-2xl overflow-hidden animate-fade-in"
                    style={{ background: "rgba(13,20,33,0.82)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}
                >
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-pink-400" />
                            <h3 className="text-sm font-bold text-white">Revenue by Category</h3>
                        </div>
                        <span className="text-[11px] text-slate-500">chatbot-attributed</span>
                    </div>
                    <div className="p-6">
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={CATEGORY_PERF} barCategoryGap="32%" margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.04)" vertical={false} />
                                <XAxis dataKey="cat" tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
                                <Tooltip content={<CatTip />} cursor={{ fill: "rgba(255,255,255,0.025)", radius: 4 }} />
                                <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                                    {CATEGORY_PERF.map((c, i) => (
                                        <Cell key={i} fill={c.color} style={{ filter: `drop-shadow(0 0 6px ${c.color}60)` }} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Radar chart (1/3) */}
                <div
                    className="rounded-2xl p-5 animate-fade-in"
                    style={{ background: "rgba(13,20,33,0.82)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Eye className="h-4 w-4 text-violet-400" />
                        <h3 className="text-xs font-bold text-white">Performance Radar</h3>
                    </div>
                    <p className="text-[10px] text-slate-600 mb-2">Top 3 categories vs 6 metrics</p>
                    <ResponsiveContainer width="100%" height={200}>
                        <RadarChart data={RADAR_DATA} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
                            <PolarGrid stroke="rgba(255,255,255,0.06)" />
                            <PolarAngleAxis dataKey="metric" tick={{ fill: "#64748B", fontSize: 9 }} />
                            <Radar name="Dresses" dataKey="Dresses" stroke="#EC4899" fill="#EC4899" fillOpacity={0.18} strokeWidth={1.5} />
                            <Radar name="Kurtas" dataKey="Kurtas" stroke="#A78BFA" fill="#A78BFA" fillOpacity={0.12} strokeWidth={1.5} />
                            <Radar name="Sarees" dataKey="Sarees" stroke="#FBBF24" fill="#FBBF24" fillOpacity={0.10} strokeWidth={1.5} />
                        </RadarChart>
                    </ResponsiveContainer>
                    <div className="flex flex-col gap-1.5 mt-1">
                        {[{ l: "Dresses", c: "#EC4899" }, { l: "Kurtas", c: "#A78BFA" }, { l: "Sarees", c: "#FBBF24" }].map(i => (
                            <div key={i.l} className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full" style={{ background: i.c }} />
                                <span className="text-[11px] text-slate-500">{i.l}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Product table ───────────────────────────────────────────────── */}
            <div
                className="rounded-2xl overflow-hidden animate-fade-in"
                style={{ background: "rgba(13,20,33,0.82)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}
            >
                {/* Table toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-amber-400" />
                        <h3 className="text-sm font-bold text-white">Product Leaderboard</h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-600" />
                            <input
                                type="text"
                                placeholder="Search product…"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="pl-8 pr-3 py-1.5 rounded-lg text-xs text-slate-300 outline-none w-36 transition-all focus:w-48"
                                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}
                            />
                        </div>
                        {/* Category filter */}
                        <div
                            className="inline-flex rounded-lg p-0.5 gap-0.5 flex-wrap"
                            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                        >
                            {cats.map(c => (
                                <button
                                    key={c}
                                    onClick={() => setCatFilter(c)}
                                    className="px-2 py-1 rounded-md text-[10px] font-bold transition-all"
                                    style={catFilter === c
                                        ? { background: "linear-gradient(135deg,#EC4899,#6366F1)", color: "#fff" }
                                        : { color: "#64748B" }}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value as any)}
                            className="rounded-lg px-2 py-1.5 text-[11px] font-bold text-slate-300 outline-none cursor-pointer"
                            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}
                        >
                            <option value="orders">Sort: Orders</option>
                            <option value="rev">Sort: Revenue</option>
                            <option value="conv">Sort: Conversion</option>
                            <option value="rating">Sort: Rating</option>
                        </select>
                    </div>
                </div>

                {/* Column headers */}
                <div
                    className="grid grid-cols-12 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-600"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.015)" }}
                >
                    <span className="col-span-1">#</span>
                    <span className="col-span-4">Product</span>
                    <span className="col-span-1 text-center">Views</span>
                    <span className="col-span-1 text-center">TryOns</span>
                    <span className="col-span-1 text-center">Orders</span>
                    <span className="col-span-1 text-center">Conv</span>
                    <span className="col-span-2 text-right">Revenue</span>
                    <span className="col-span-1 text-right">Rating</span>
                </div>

                {filtered.length === 0 ? (
                    <div className="px-6 py-12 text-center text-slate-600 text-sm">No products match your search.</div>
                ) : (
                    filtered.map((p, i) => {
                        const rankColors = ["#FBBF24", "#9CA3AF", "#CD7F32"]
                        return (
                            <div
                                key={p.name}
                                className="grid grid-cols-12 items-center px-6 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group"
                                style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                            >
                                <span className="col-span-1 text-sm font-black" style={{ color: rankColors[i] ?? "#475569" }}>
                                    {i + 1}
                                </span>
                                <div className="col-span-4 flex items-center gap-2.5 min-w-0">
                                    <div
                                        className="flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0"
                                        style={{ background: `${p.color}18`, border: `1px solid ${p.color}35` }}
                                    >
                                        <ShoppingBag className="h-3.5 w-3.5" style={{ color: p.color }} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-semibold text-slate-300 group-hover:text-white truncate transition-colors">{p.name}</p>
                                        <p className="text-[10px] text-slate-600">{p.cat}</p>
                                    </div>
                                </div>
                                <span className="col-span-1 text-center text-xs text-slate-500">{p.views.toLocaleString()}</span>
                                <span className="col-span-1 text-center text-xs text-slate-500">{p.tryons}</span>
                                <span className="col-span-1 text-center text-xs font-bold text-white">{p.orders}</span>
                                <div className="col-span-1 flex justify-center">
                                    <span
                                        className="text-[10px] font-black px-1.5 py-0.5 rounded"
                                        style={{ background: "rgba(52,211,153,0.1)", color: "#34D399", border: "1px solid rgba(52,211,153,0.2)" }}
                                    >
                                        {p.conv}%
                                    </span>
                                </div>
                                <span className="col-span-2 text-right text-xs font-bold text-white">${p.rev.toLocaleString()}</span>
                                <div className="col-span-1 flex items-center justify-end gap-0.5">
                                    <Star className="h-3 w-3 text-amber-400" />
                                    <span className="text-xs font-bold text-amber-400">{p.rating}</span>
                                </div>
                            </div>
                        )
                    })
                )}

                <div
                    className="px-6 py-3 flex items-center justify-between text-xs border-t border-white/[0.04]"
                    style={{ background: "rgba(255,255,255,0.01)" }}
                >
                    <span className="text-slate-600">{filtered.length} product{filtered.length !== 1 ? "s" : ""} shown</span>
                    <button className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Export →</button>
                </div>
            </div>

            {/* ── AI tip ──────────────────────────────────────────────────────── */}
            <div
                className="flex items-start gap-4 px-5 py-4 rounded-2xl animate-fade-in"
                style={{
                    background: "linear-gradient(135deg,rgba(251,191,36,0.08),rgba(236,72,153,0.04))",
                    border: "1px solid rgba(251,191,36,0.22)",
                }}
            >
                <Sparkles className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white mb-0.5">Restock Alert · Rose Floral Midi Dress</p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Your #1 product has <span className="text-amber-400 font-semibold">312 try-ons</span> but only
                        sizes S &amp; XL remain. Restocking M &amp; L could unlock an estimated
                        <span className="text-emerald-400 font-semibold"> +$8,400/month</span> in latent demand already
                        captured by the chatbot.
                    </p>
                </div>
                <button
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 active:scale-95 whitespace-nowrap"
                    style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)", boxShadow: "0 4px 12px rgba(251,191,36,0.4)", color: "#000" }}
                >
                    <Zap className="h-3.5 w-3.5" /> Alert Team
                </button>
            </div>

        </div>
    )
}
