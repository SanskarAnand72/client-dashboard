"use client"

import {
    LayoutDashboard, TrendingUp, ShoppingBag, RefreshCw,
    Shirt, MessageCircle, BarChart2, Settings, Bot, ChevronRight,
    GitMerge, BarChartHorizontal, Users, MessageSquare, CreditCard, Flame,
} from "lucide-react"
import { cn } from "@/lib/utils"

const NAV = [
    { id: "overview", label: "Business Overview", icon: LayoutDashboard, badge: null },
    { id: "roi", label: "ROI Summary", icon: Flame, badge: null },
    { id: "revenue", label: "Revenue Impact", icon: TrendingUp, badge: null },
    { id: "funnel", label: "Sales Funnel", icon: GitMerge, badge: null },
    { id: "orders", label: "AI-Generated Orders", icon: ShoppingBag, badge: "HOT" },
    { id: "cart", label: "Cart Recovery", icon: RefreshCw, badge: "12" },
    { id: "tryon", label: "Virtual Try-On", icon: Shirt, badge: "NEW" },
    { id: "engagement", label: "Customer Engagement", icon: MessageCircle, badge: null },
    { id: "products", label: "Product Insights", icon: BarChart2, badge: null },
    { id: "performance", label: "Product Performance", icon: BarChartHorizontal, badge: "NEW" },
    { id: "behavior", label: "Customer Behavior", icon: Users, badge: "NEW" },
    { id: "metrics", label: "Engagement Metrics", icon: MessageSquare, badge: "NEW" },
    { id: "subscription", label: "Subscription", icon: CreditCard, badge: null },
    { id: "settings", label: "Chatbot Settings", icon: Settings, badge: null },
]

interface SidebarProps {
    active: string
    setActive: (s: string) => void
}

export function Sidebar({ active, setActive }: SidebarProps) {
    return (
        <aside
            className="hidden lg:flex flex-col w-64 min-h-screen flex-shrink-0 sticky top-0"
            style={{
                background: "linear-gradient(180deg,#080C14 0%,#090E1B 60%,#070B13 100%)",
                borderRight: "1px solid rgba(255,255,255,0.06)",
            }}
        >
            {/* Logo */}
            <div className="flex items-center gap-3 px-5 h-[65px] border-b border-white/[0.06]">
                <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl flex-shrink-0"
                    style={{
                        background: "linear-gradient(135deg,#6366F1 0%,#EC4899 100%)",
                        boxShadow: "0 0 20px rgba(236,72,153,0.45)",
                    }}
                >
                    <Shirt className="text-white" style={{ width: 18, height: 18 }} />
                </div>
                <div>
                    <p className="text-sm font-bold text-white leading-none tracking-tight">FashionAI</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Store Dashboard</p>
                </div>
                <span
                    className="ml-auto text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded"
                    style={{
                        background: "linear-gradient(135deg,rgba(236,72,153,0.2),rgba(99,102,241,0.1))",
                        border: "1px solid rgba(236,72,153,0.3)",
                        color: "#EC4899",
                    }}
                >
                    LIVE
                </span>
            </div>

            {/* Store status */}
            <div
                className="mx-3 mt-4 px-3 py-2.5 rounded-xl"
                style={{
                    background: "linear-gradient(135deg,rgba(52,211,153,0.08),rgba(34,211,238,0.05))",
                    border: "1px solid rgba(52,211,153,0.15)",
                }}
            >
                <div className="flex items-center gap-2">
                    <Bot className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                    <span className="text-[11px] font-semibold text-emerald-400">Chatbot Active</span>
                    <span className="ml-auto relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">247 sessions today · 98.4% uptime</p>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-600">Dashboard</p>
                {NAV.map((item) => {
                    const Icon = item.icon
                    const isActive = active === item.id
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActive(item.id)}
                            className={cn(
                                "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 relative overflow-hidden",
                                isActive ? "text-white font-medium" : "text-slate-500 hover:text-slate-200 font-normal hover:bg-white/[0.04]"
                            )}
                            style={
                                isActive
                                    ? {
                                        background: "linear-gradient(135deg,rgba(236,72,153,0.12) 0%,rgba(99,102,241,0.06) 100%)",
                                        border: "1px solid rgba(236,72,153,0.2)",
                                        boxShadow: "0 0 12px rgba(236,72,153,0.06)",
                                    }
                                    : { border: "1px solid transparent" }
                            }
                        >
                            {isActive && (
                                <span
                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
                                    style={{ background: "linear-gradient(180deg,#EC4899,#6366F1)" }}
                                />
                            )}
                            <Icon
                                className={cn(
                                    "h-4 w-4 flex-shrink-0 transition-colors",
                                    isActive ? "text-pink-400" : "text-slate-600 group-hover:text-slate-400"
                                )}
                            />
                            <span className="flex-1 text-left">{item.label}</span>
                            {item.badge && (
                                <span
                                    className={cn(
                                        "text-[10px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0",
                                        item.badge === "NEW" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                                            : item.badge === "HOT" ? "bg-pink-500/15 text-pink-400 border border-pink-500/20"
                                                : "bg-indigo-500/15 text-indigo-300"
                                    )}
                                >
                                    {item.badge}
                                </span>
                            )}
                            {isActive && !item.badge && (
                                <ChevronRight className="ml-auto h-3.5 w-3.5 text-pink-400 flex-shrink-0" />
                            )}
                        </button>
                    )
                })}
            </nav>

            {/* Store info */}
            <div className="px-3 pb-5">
                <div
                    className="rounded-2xl p-4 relative overflow-hidden"
                    style={{
                        background: "linear-gradient(135deg,rgba(236,72,153,0.15) 0%,rgba(99,102,241,0.08) 100%)",
                        border: "1px solid rgba(236,72,153,0.2)",
                    }}
                >
                    <div className="absolute -top-5 -right-5 h-20 w-20 rounded-full opacity-25"
                        style={{ background: "radial-gradient(circle,#EC4899,transparent)" }} />
                    <p className="text-xs font-bold text-white mb-0.5">Korakari Fashion</p>
                    <p className="text-[11px] text-slate-400 mb-3">Shopify · Pro Plan · 14 days left</p>
                    <button
                        className="w-full rounded-lg py-1.5 text-xs font-bold text-white transition-all hover:opacity-90 active:scale-95"
                        style={{
                            background: "linear-gradient(135deg,#EC4899 0%,#6366F1 100%)",
                            boxShadow: "0 4px 12px rgba(236,72,153,0.35)",
                        }}
                    >
                        Upgrade Plan
                    </button>
                </div>
            </div>
        </aside>
    )
}
