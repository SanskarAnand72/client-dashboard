"use client"

import { Bell, Search, RefreshCw, ChevronDown, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"

interface HeaderProps {
  darkMode: boolean
  setDarkMode: (value: boolean) => void
}

export function Header({ darkMode, setDarkMode }: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-20 h-[65px] flex items-center justify-between px-6 lg:px-8"
      style={{
        background: "rgba(8,12,20,0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Left: Search */}
      <div className="relative w-72 group">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
        <Input
          placeholder="Search clients, reports, bots..."
          className="pl-9 h-9 text-sm border-white/[0.07] text-slate-300 placeholder:text-slate-600 rounded-xl focus-visible:ring-1 focus-visible:ring-indigo-500 focus-visible:border-indigo-500/40"
          style={{ background: "rgba(19,27,46,0.8)" }}
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 text-[10px] text-slate-600">
          <span className="px-1 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">⌘</span>
          <span className="px-1 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">K</span>
        </kbd>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* AI Insights Button */}
        <button
          className="flex items-center gap-2 h-9 px-3 rounded-xl text-sm font-medium transition-all hover:scale-105"
          style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(167,139,250,0.08))",
            border: "1px solid rgba(99,102,241,0.22)",
            color: "#A78BFA",
          }}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span className="hidden sm:block text-xs">AI Insights</span>
        </button>

        <div className="h-5 w-px bg-white/[0.06]" />

        {/* Refresh */}
        <button className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] transition-all hover:rotate-180">
          <RefreshCw className="h-3.5 w-3.5 transition-transform duration-500" />
        </button>

        {/* Notifications */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] transition-all group">
          <Bell className="h-4 w-4" />
          <span
            className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full"
            style={{ background: "linear-gradient(135deg, #6366F1, #A78BFA)", boxShadow: "0 0 6px #6366F1" }}
          />
        </button>

        <div className="h-5 w-px bg-white/[0.06]" />

        {/* Profile */}
        <button className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 hover:bg-white/[0.04] transition-colors">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #6366F1 0%, #EC4899 100%)",
              boxShadow: "0 0 10px rgba(99,102,241,0.4)",
            }}
          >
            JD
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-white leading-none">John Doe</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Agency Admin</p>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-slate-600" />
        </button>
      </div>
    </header>
  )
}
