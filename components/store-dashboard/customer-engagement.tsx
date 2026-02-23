"use client"

import {
    AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend,
} from "recharts"
import { MessageCircle, Users, Star, Clock, TrendingUp, ThumbsUp, Sparkles, Zap } from "lucide-react"

const SESSION_DAILY = [
    { day: "Feb 1", sessions: 210, messages: 1050 },
    { day: "Feb 5", sessions: 264, messages: 1320 },
    { day: "Feb 9", sessions: 298, messages: 1490 },
    { day: "Feb 13", sessions: 321, messages: 1605 },
    { day: "Feb 17", sessions: 356, messages: 1780 },
    { day: "Feb 21", sessions: 389, messages: 1945 },
    { day: "Feb 23", sessions: 412, messages: 2060 },
]

const INTENT_BREAKDOWN = [
    { name: "Product Reco.", value: 28, color: "#EC4899" },
    { name: "Order Status", value: 21, color: "#6366F1" },
    { name: "Size Guide", value: 18, color: "#A78BFA" },
    { name: "Try-On", value: 15, color: "#22D3EE" },
    { name: "Returns", value: 10, color: "#FBBF24" },
    { name: "Other", value: 8, color: "#475569" },
]

const SATISFACTION = [
    { score: "5★", count: 1824, pct: 64, color: "#34D399" },
    { score: "4★", count: 641, pct: 22, color: "#22D3EE" },
    { score: "3★", count: 228, pct: 8, color: "#FBBF24" },
    { score: "2★", count: 85, pct: 3, color: "#F87171" },
    { score: "1★", count: 71, pct: 3, color: "#EF4444" },
]

const TOP_QUESTIONS = [
    { q: "Do you have this in size M/L?", count: 480, resolution: "99%", icon: "👗" },
    { q: "What's the return policy?", count: 342, resolution: "100%", icon: "🔄" },
    { q: "When will my order arrive?", count: 298, resolution: "98%", icon: "📦" },
    { q: "Show me similar styles", count: 271, resolution: "97%", icon: "✨" },
    { q: "Can I try this on virtually?", count: 241, resolution: "100%", icon: "👓" },
]

function ChartTip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null
    return (
        <div className="rounded-xl px-4 py-3 text-xs"
            style={{ background: "#0D1828", border: "1px solid rgba(99,102,241,0.25)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
            <p className="font-bold text-slate-300 mb-2">{label}</p>
            {payload.map((p: any) => (
                <div key={p.dataKey} className="flex items-center justify-between gap-5 mb-1">
                    <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
                        <span className="text-slate-500">{p.dataKey === "sessions" ? "Chat Sessions" : "Messages"}</span>
                    </span>
                    <span className="font-bold text-white">{p.value.toLocaleString()}</span>
                </div>
            ))}
        </div>
    )
}

const RADIAN = Math.PI / 180
function CustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) {
    if (percent < 0.1) return null
    const r = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + r * Math.cos(-midAngle * RADIAN)
    const y = cy + r * Math.sin(-midAngle * RADIAN)
    return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={9} fontWeight="bold">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    )
}

export function CustomerEngagement() {
    const totalSessions = SESSION_DAILY.reduce((s, d) => s + d.sessions, 0)
    const avgCsat = ((1824 * 5 + 641 * 4 + 228 * 3 + 85 * 2 + 71 * 1) / (1824 + 641 + 228 + 85 + 71)).toFixed(1)

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">Customer Engagement</h2>
                    <p className="text-sm text-slate-400 mt-0.5">Chat sessions, intents, satisfaction scores and top questions.</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold"
                    style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", color: "#34D399" }}>
                    <ThumbsUp className="h-3.5 w-3.5" /> {avgCsat}★ avg CSAT · 91.4% resolved
                </div>
            </div>

            {/* KPIs */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger">
                {[
                    { label: "Chat Sessions", value: "7,204", sub: "+12.1% this month", icon: MessageCircle, color: "#22D3EE", rgb: "34,211,238" },
                    { label: "Unique Shoppers", value: "3,842", sub: "53% returning visitors", icon: Users, color: "#6366F1", rgb: "99,102,241" },
                    { label: "Avg CSAT Score", value: `${avgCsat}★`, sub: "Out of 2,849 ratings", icon: Star, color: "#FBBF24", rgb: "251,191,36" },
                    { label: "Avg Session Length", value: "4m 12s", sub: "↑ 38s vs last month", icon: Clock, color: "#A78BFA", rgb: "167,139,250" },
                ].map(c => (
                    <div key={c.label} className="relative rounded-2xl p-5 overflow-hidden group hover:-translate-y-0.5 transition-all cursor-pointer animate-fade-in-up"
                        style={{ background: `rgba(${c.rgb},0.07)`, border: `1px solid rgba(${c.rgb},0.22)`, backdropFilter: "blur(16px)" }}>
                        <div className="absolute -top-5 -right-5 h-20 w-20 rounded-full pointer-events-none"
                            style={{ background: `radial-gradient(circle,${c.color},transparent 70%)`, opacity: 0.1 }} />
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl mb-4"
                            style={{ background: `rgba(${c.rgb},0.14)`, border: `1px solid rgba(${c.rgb},0.25)` }}>
                            <c.icon className="h-5 w-5" style={{ color: c.color }} />
                        </div>
                        <p className="text-2xl font-black text-white tracking-tight">{c.value}</p>
                        <p className="text-sm font-semibold text-slate-300 mt-0.5">{c.label}</p>
                        <p className="text-[11px] text-slate-500">{c.sub}</p>
                    </div>
                ))}
            </div>

            {/* Charts row */}
            <div className="grid gap-5 lg:grid-cols-3">
                {/* Sessions trend (2/3) */}
                <div className="lg:col-span-2 rounded-2xl overflow-hidden animate-fade-in"
                    style={{ background: "rgba(13,20,33,0.8)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-indigo-400" />
                            <h3 className="text-sm font-bold text-white">Daily Chat Sessions & Messages</h3>
                        </div>
                        <div className="flex items-center gap-4">
                            {[{ l: "Sessions", c: "#6366F1" }, { l: "Messages", c: "#22D3EE" }].map(i => (
                                <div key={i.l} className="flex items-center gap-1.5">
                                    <div className="h-2 w-2 rounded-full" style={{ background: i.c }} />
                                    <span className="text-[11px] text-slate-500">{i.l}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="p-6">
                        <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={SESSION_DAILY}>
                                <defs>
                                    <linearGradient id="engSess" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="engMsg" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#22D3EE" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.04)" />
                                <XAxis dataKey="day" tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
                                <Tooltip content={<ChartTip />} />
                                <Area type="monotone" dataKey="messages" stroke="#22D3EE" strokeWidth={1.5} fill="url(#engMsg)" dot={false} />
                                <Area type="monotone" dataKey="sessions" stroke="#6366F1" strokeWidth={2} fill="url(#engSess)" dot={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Intent pie (1/3) */}
                <div className="rounded-2xl p-6 animate-fade-in"
                    style={{ background: "rgba(13,20,33,0.8)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>
                    <div className="flex items-center gap-2 mb-4">
                        <Zap className="h-4 w-4 text-pink-400" />
                        <h3 className="text-sm font-bold text-white">Intent Breakdown</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={170}>
                        <PieChart>
                            <Pie data={INTENT_BREAKDOWN} dataKey="value" nameKey="name" cx="50%" cy="50%"
                                innerRadius={42} outerRadius={72} labelLine={false} label={CustomLabel}>
                                {INTENT_BREAKDOWN.map((e, i) => (
                                    <Cell key={i} fill={e.color} style={{ filter: `drop-shadow(0 0 4px ${e.color}60)` }} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-1.5 mt-2">
                        {INTENT_BREAKDOWN.map(i => (
                            <div key={i.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: i.color }} />
                                    <span className="text-[11px] text-slate-500">{i.name}</span>
                                </div>
                                <span className="text-[11px] font-bold text-white">{i.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CSAT + Top Questions */}
            <div className="grid gap-5 lg:grid-cols-2">
                {/* CSAT */}
                <div className="rounded-2xl p-6 animate-fade-in"
                    style={{ background: "rgba(13,20,33,0.8)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>
                    <div className="flex items-center gap-2 mb-5">
                        <Star className="h-4 w-4 text-amber-400" />
                        <h3 className="text-sm font-bold text-white">Customer Satisfaction (CSAT)</h3>
                        <span className="ml-auto text-xl font-black" style={{ color: "#34D399" }}>{avgCsat}★</span>
                    </div>
                    <div className="space-y-3">
                        {SATISFACTION.map(s => (
                            <div key={s.score} className="flex items-center gap-3">
                                <span className="text-xs font-bold w-8 text-slate-400 flex-shrink-0">{s.score}</span>
                                <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                                    <div className="h-full rounded-full transition-all duration-1000"
                                        style={{ width: `${s.pct}%`, background: `linear-gradient(90deg,${s.color},${s.color}80)`, boxShadow: `0 0 6px ${s.color}50` }} />
                                </div>
                                <span className="text-xs text-slate-500 w-8 text-right flex-shrink-0">{s.pct}%</span>
                                <span className="text-[11px] text-slate-600 w-14 flex-shrink-0">{s.count.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-5 p-3 rounded-xl flex items-center gap-3"
                        style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.15)" }}>
                        <ThumbsUp className="h-4 w-4 text-emerald-400" />
                        <p className="text-xs text-slate-400">
                            <span className="text-emerald-400 font-bold">86%</span> of shoppers rated 4★ or higher — top-quartile for fashion ecommerce.
                        </p>
                    </div>
                </div>

                {/* Top questions */}
                <div className="rounded-2xl p-6 animate-fade-in"
                    style={{ background: "rgba(13,20,33,0.8)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>
                    <div className="flex items-center gap-2 mb-5">
                        <MessageCircle className="h-4 w-4 text-cyan-400" />
                        <h3 className="text-sm font-bold text-white">Top Customer Questions</h3>
                    </div>
                    <div className="space-y-3">
                        {TOP_QUESTIONS.map((q, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-xl group hover:bg-white/[0.02] cursor-pointer transition-all"
                                style={{ border: "1px solid rgba(255,255,255,0.04)" }}>
                                <span className="text-lg flex-shrink-0 leading-none mt-0.5">{q.icon}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors leading-snug">{q.q}</p>
                                    <p className="text-[10px] text-slate-600 mt-0.5">{q.count.toLocaleString()} times</p>
                                </div>
                                <span className="text-[11px] font-bold flex-shrink-0 px-2 py-0.5 rounded-lg"
                                    style={{ background: "rgba(52,211,153,0.08)", color: "#34D399", border: "1px solid rgba(52,211,153,0.15)" }}>
                                    {q.resolution}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* AI tip */}
            <div className="flex items-start gap-4 px-5 py-4 rounded-2xl animate-fade-in"
                style={{ background: "linear-gradient(135deg,rgba(99,102,241,0.08),rgba(34,211,238,0.04))", border: "1px solid rgba(99,102,241,0.2)" }}>
                <Sparkles className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-400 leading-relaxed">
                    <span className="text-indigo-400 font-bold">Size guide is your #3 query</span> with 480 asks. Adding an AI-powered size predictor (based on measurements) could resolve this 100% autonomously and reduce human escalations by an estimated <span className="text-indigo-400 font-semibold">~180/month</span>.
                </p>
            </div>
        </div>
    )
}
