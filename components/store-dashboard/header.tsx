"use client"

import { Bell, Search, Sparkles, RefreshCw, ChevronDown, Store, ExternalLink } from "lucide-react"

interface HeaderProps {
    section: string
}

const SECTION_LABELS: Record<string, { title: string; sub: string }> = {
    overview: { title: "Business Overview", sub: "Real-time impact of your AI chatbot" },
    revenue: { title: "Revenue Impact", sub: "Chatbot-attributed sales performance" },
    orders: { title: "AI-Generated Orders", sub: "Orders initiated by chatbot interactions" },
    cart: { title: "Cart Recovery", sub: "Abandoned cart win-back campaigns" },
    tryon: { title: "Virtual Try-On", sub: "AI-powered fitting room analytics" },
    engagement: { title: "Customer Engagement", sub: "Conversations, sessions and intent analysis" },
    products: { title: "Product Insights", sub: "Top AI-recommended products and performance" },
    settings: { title: "Chatbot Settings", sub: "Configure your AI chatbot behaviour" },
}

export function Header({ section }: HeaderProps) {
    const meta = SECTION_LABELS[section] ?? SECTION_LABELS["overview"]

    return (
        <header
            className="sticky top-0 z-20 flex items-center justify-between px-6 lg:px-8 h-[65px]"
            style={{
                background: "rgba(8,12,20,0.88)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
        >
            {/* Left: breadcrumb-style title */}
            <div className="flex items-center gap-3 min-w-0">
                <div className="min-w-0">
                    <h1 className="text-sm font-bold text-white leading-none truncate">{meta.title}</h1>
                    <p className="text-[11px] text-slate-500 mt-0.5 hidden sm:block">{meta.sub}</p>
                </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2 flex-shrink-0">
                {/* Search */}
                <div className="relative hidden md:block group">
                    <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-600 group-focus-within:text-pink-400 transition-colors" />
                    <input
                        placeholder="Search orders, products..."
                        className="pl-9 pr-12 h-9 w-56 rounded-xl text-sm text-slate-300 placeholder:text-slate-600 outline-none transition-colors"
                        style={{ background: "rgba(19,27,46,0.8)", border: "1px solid rgba(255,255,255,0.07)" }}
                    />
                    <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden xl:flex items-center gap-0.5 text-[10px] text-slate-600">
                        <span className="px-1 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">⌘K</span>
                    </kbd>
                </div>

                {/* Store preview */}
                <a
                    href="https://korakari.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-xl text-xs font-medium transition-all hover:scale-105"
                    style={{
                        background: "rgba(236,72,153,0.08)",
                        border: "1px solid rgba(236,72,153,0.2)",
                        color: "#EC4899",
                    }}
                >
                    <Store className="h-3.5 w-3.5" />
                    <span>Live Store</span>
                    <ExternalLink className="h-3 w-3 opacity-60" />
                </a>

                {/* AI Insights */}
                <button
                    className="flex items-center gap-1.5 h-9 px-3 rounded-xl text-xs font-medium transition-all hover:scale-105"
                    style={{
                        background: "linear-gradient(135deg,rgba(99,102,241,0.15),rgba(236,72,153,0.08))",
                        border: "1px solid rgba(99,102,241,0.22)",
                        color: "#A78BFA",
                    }}
                >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span className="hidden sm:block">AI Tips</span>
                </button>

                <div className="h-5 w-px bg-white/[0.06]" />

                {/* Refresh */}
                <button className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] transition-all">
                    <RefreshCw className="h-3.5 w-3.5" />
                </button>

                {/* Bell */}
                <button className="relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] transition-all">
                    <Bell className="h-4 w-4" />
                    <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full"
                        style={{ background: "#EC4899", boxShadow: "0 0 6px #EC4899" }} />
                </button>

                <div className="h-5 w-px bg-white/[0.06]" />

                {/* Avatar */}
                <button className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 hover:bg-white/[0.04] transition-colors">
                    <div
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white flex-shrink-0"
                        style={{
                            background: "linear-gradient(135deg,#EC4899 0%,#6366F1 100%)",
                            boxShadow: "0 0 10px rgba(236,72,153,0.4)",
                        }}
                    >
                        KF
                    </div>
                    <div className="hidden sm:block text-left">
                        <p className="text-xs font-semibold text-white leading-none">Korakari Fashion</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Store Owner</p>
                    </div>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-600" />
                </button>
            </div>
        </header>
    )
}
