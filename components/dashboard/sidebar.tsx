"use client"

import { Bot, LayoutDashboard, Zap, BarChart3, Lightbulb, CreditCard, Headphones, Plug, TrendingUp, Bell, User, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

const menuItems = [
  { id: "overview", label: "Client Overview", icon: LayoutDashboard, badge: null },
  { id: "projects", label: "Active Projects", icon: Zap, badge: "4" },
  { id: "analytics", label: "Usage Analytics", icon: BarChart3, badge: null },
  { id: "insights", label: "Insights & Reports", icon: Lightbulb, badge: "NEW" },
  { id: "billing", label: "Billing", icon: CreditCard, badge: null },
  { id: "support", label: "Support", icon: Headphones, badge: "3" },
  { id: "integrations", label: "Integrations", icon: Plug, badge: null },
  { id: "roi", label: "ROI Metrics", icon: TrendingUp, badge: null },
  { id: "notifications", label: "Alerts", icon: Bell, badge: "12" },
  { id: "settings", label: "Settings", icon: User, badge: null },
]

export function Sidebar({ activeSection, setActiveSection }: SidebarProps) {
  return (
    <aside
      className="hidden lg:flex flex-col w-64 min-h-screen flex-shrink-0 sticky top-0"
      style={{
        background: "linear-gradient(180deg, #09101F 0%, #0A1220 60%, #090E1A 100%)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-[65px] border-b border-white/[0.06]">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #6366F1 0%, #A78BFA 100%)",
            boxShadow: "0 0 18px rgba(99,102,241,0.5)",
          }}
        >
          <Bot className="text-white" style={{ width: 18, height: 18 }} />
        </div>
        <div>
          <p className="text-sm font-bold text-white leading-none tracking-tight">ChatAI Pro</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Agency Dashboard</p>
        </div>
        <span
          className="ml-auto text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded"
          style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(167,139,250,0.1))",
            border: "1px solid rgba(99,102,241,0.3)",
            color: "#A78BFA",
          }}
        >
          PRO
        </span>
      </div>

      {/* AI Status */}
      <div
        className="mx-3 mt-4 px-3 py-2.5 rounded-xl"
        style={{
          background: "linear-gradient(135deg, rgba(52,211,153,0.08), rgba(34,211,238,0.05))",
          border: "1px solid rgba(52,211,153,0.15)",
        }}
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-[11px] font-semibold text-emerald-400">All Systems Operational</span>
        </div>
        <p className="text-[10px] text-slate-500 mt-1">10 clients · 42 active bots</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-600">Navigation</p>
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={cn(
                "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 relative overflow-hidden",
                isActive
                  ? "text-white font-medium"
                  : "text-slate-500 hover:text-slate-200 font-normal hover:bg-white/[0.04]"
              )}
              style={isActive ? {
                background: "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(99,102,241,0.05) 100%)",
                border: "1px solid rgba(99,102,241,0.2)",
                boxShadow: "0 0 12px rgba(99,102,241,0.08)",
              } : { border: "1px solid transparent" }}
            >
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
                  style={{ background: "linear-gradient(180deg, #6366F1, #A78BFA)" }}
                />
              )}
              <Icon
                className={cn(
                  "h-4 w-4 flex-shrink-0 transition-colors",
                  isActive ? "text-indigo-400" : "text-slate-600 group-hover:text-slate-400"
                )}
              />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span
                  className={cn(
                    "text-[10px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0",
                    item.badge === "NEW"
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                      : "bg-indigo-500/15 text-indigo-300"
                  )}
                >
                  {item.badge}
                </span>
              )}
              {isActive && !item.badge && (
                <ChevronRight className="ml-auto h-3.5 w-3.5 text-indigo-400 flex-shrink-0" />
              )}
            </button>
          )
        })}
      </nav>

      {/* Upgrade Card */}
      <div className="px-3 pb-5">
        <div
          className="rounded-2xl p-4 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(167,139,250,0.08) 100%)",
            border: "1px solid rgba(99,102,241,0.22)",
          }}
        >
          <div
            className="absolute -top-5 -right-5 h-20 w-20 rounded-full opacity-25"
            style={{ background: "radial-gradient(circle, #6366F1, transparent)" }}
          />
          <p className="text-xs font-bold text-white mb-0.5">Upgrade to Enterprise</p>
          <p className="text-[11px] text-slate-400 mb-3">Custom training & white-label</p>
          <button
            className="w-full rounded-lg py-1.5 text-xs font-bold text-white transition-all hover:opacity-90 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #6366F1 0%, #A78BFA 100%)",
              boxShadow: "0 4px 12px rgba(99,102,241,0.4)",
            }}
          >
            Learn More
          </button>
        </div>
      </div>
    </aside>
  )
}
