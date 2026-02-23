"use client"

import { useState } from "react"
import { Download, CreditCard, Zap, HardDrive, Users, ArrowUpRight, ChevronRight, CheckCircle2, Sparkles } from "lucide-react"

/* ─── Data ────────────────────────────────────────────────────────────────── */
const HISTORY = [
  { date: "Feb 15, 2026", amount: "$3,299", status: "Paid", invoice: "INV-2026-002", method: "Visa •••• 4242" },
  { date: "Jan 15, 2026", amount: "$3,299", status: "Paid", invoice: "INV-2026-001", method: "Visa •••• 4242" },
  { date: "Dec 15, 2025", amount: "$2,999", status: "Paid", invoice: "INV-2025-012", method: "Visa •••• 4242" },
  { date: "Nov 15, 2025", amount: "$2,999", status: "Paid", invoice: "INV-2025-011", method: "Visa •••• 4242" },
  { date: "Oct 15, 2025", amount: "$2,999", status: "Paid", invoice: "INV-2025-010", method: "Stripe ACH" },
]

const USAGE_ITEMS = [
  { label: "API Calls", used: 8500, total: 10000, unit: "", color: "#6366F1", rgb: "99,102,241" },
  { label: "Storage", used: 45, total: 100, unit: " GB", color: "#22D3EE", rgb: "34,211,238" },
  { label: "Team Seats", used: 8, total: 20, unit: "", color: "#34D399", rgb: "52,211,153" },
  { label: "Bots", used: 5, total: 10, unit: "", color: "#EC4899", rgb: "236,72,153" },
]

const PLAN_FEATURES = [
  "Unlimited conversations",
  "Up to 10 active AI bots",
  "Priority AI model access (GPT-4o)",
  "White-label chatbot branding",
  "Advanced analytics & exports",
  "Dedicated account manager",
]

/* ─── Usage bar ───────────────────────────────────────────────────────────── */
function UsageRow({ item }: { item: typeof USAGE_ITEMS[0] }) {
  const pct = Math.round((item.used / item.total) * 100)
  const isWarning = pct >= 80
  const alertColor = isWarning ? "#FBBF24" : item.color
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: alertColor, boxShadow: isWarning ? `0 0 6px ${alertColor}` : "none" }} />
          <span className="text-sm font-medium text-slate-300">{item.label}</span>
          {isWarning && (
            <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md" style={{ background: "rgba(251,191,36,0.12)", color: "#FBBF24", border: "1px solid rgba(251,191,36,0.25)" }}>NEAR LIMIT</span>
          )}
        </div>
        <span className="text-xs font-bold text-white">{item.used.toLocaleString()}{item.unit} <span className="text-slate-600 font-normal">/ {item.total.toLocaleString()}{item.unit}</span></span>
      </div>
      <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: `${pct}%`,
            background: isWarning ? "linear-gradient(90deg, #FBBF24, #F59E0B)" : `linear-gradient(90deg, ${item.color}, ${item.color}80)`,
            boxShadow: `0 0 8px ${alertColor}50`,
          }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-slate-600">{pct}% used</span>
        <span className="text-[10px] text-slate-600">{(item.total - item.used).toLocaleString()}{item.unit} remaining</span>
      </div>
    </div>
  )
}

/* ─── Main ────────────────────────────────────────────────────────────────── */
export function BillingSubscription() {
  const [openInvoice, setOpenInvoice] = useState<string | null>(null)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Billing & Subscription</h2>
          <p className="text-sm text-slate-400 mt-0.5">Manage your plan, payments and usage limits.</p>
        </div>
        <button
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
          style={{ background: "rgba(13,20,33,0.8)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <Download className="h-4 w-4 text-indigo-400" /> Download Invoice
        </button>
      </div>

      {/* Top 2-col */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Current plan card */}
        <div className="relative rounded-2xl p-6 overflow-hidden animate-fade-in"
          style={{ background: "linear-gradient(145deg, rgba(99,102,241,0.18) 0%, rgba(13,20,33,0.95) 100%)", border: "1px solid rgba(99,102,241,0.3)", backdropFilter: "blur(20px)" }}>
          <div className="absolute -top-8 -right-8 h-36 w-36 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,#6366F1,transparent 70%)", opacity: 0.2 }} />
          <div className="absolute top-4 right-4">
            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg" style={{ background: "rgba(99,102,241,0.2)", color: "#A78BFA", border: "1px solid rgba(99,102,241,0.35)" }}>ENTERPRISE</span>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", boxShadow: "0 0 18px rgba(99,102,241,0.25)" }}>
                <Zap className="h-5 w-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-lg font-black text-white">Enterprise Plan</p>
                <p className="text-xs text-slate-400">Full-featured AI chatbot suite</p>
              </div>
            </div>

            <div className="flex items-end gap-1 mb-5">
              <span className="text-4xl font-black text-white">$3,299</span>
              <span className="text-slate-500 text-sm mb-1">/month</span>
            </div>

            <div className="space-y-2 mb-5">
              {PLAN_FEATURES.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0" />
                  <span className="text-xs text-slate-300">{f}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-4 border-t border-white/[0.07]">
              {[
                { label: "Next Billing", value: "Mar 15, 2026" },
                { label: "Billing Cycle", value: "Monthly" },
                { label: "Status", value: "Active ✓" },
                { label: "Member Since", value: "Oct 2024" },
              ].map(i => (
                <div key={i.label}>
                  <p className="text-slate-600">{i.label}</p>
                  <p className="font-bold text-white">{i.value}</p>
                </div>
              ))}
            </div>

            <button
              className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: "linear-gradient(135deg,#6366F1,#A78BFA)", boxShadow: "0 4px 14px rgba(99,102,241,0.4)" }}
            >
              <Sparkles className="h-4 w-4" /> Manage Subscription
            </button>
          </div>
        </div>

        {/* Usage card */}
        <div className="rounded-2xl p-6 animate-fade-in"
          style={{ background: "rgba(13,20,33,0.8)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>
          <div className="flex items-center gap-2 mb-5">
            <HardDrive className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Usage vs. Limits</h3>
            <span className="ml-auto text-[11px] text-slate-600">Feb 2026</span>
          </div>
          <div className="space-y-5">
            {USAGE_ITEMS.map(item => <UsageRow key={item.label} item={item} />)}
          </div>
          <div className="mt-5 pt-4 border-t border-white/[0.05]">
            <div className="flex items-center gap-1.5 rounded-xl px-3 py-2.5"
              style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.15)" }}>
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 flex-shrink-0" style={{ boxShadow: "0 0 4px #FBBF24" }} />
              <p className="text-[11px] text-amber-400/80">API calls at <strong className="text-amber-400">85%</strong> — consider upgrading to avoid throttling.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Billing history */}
      <div className="rounded-2xl overflow-hidden animate-fade-in"
        style={{ background: "rgba(13,20,33,0.8)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Billing History</h3>
          </div>
          <span className="text-xs text-slate-500">Last 5 invoices</span>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {HISTORY.map((item) => (
            <div key={item.invoice}
              className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors group cursor-pointer"
              onClick={() => setOpenInvoice(openInvoice === item.invoice ? null : item.invoice)}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg flex-shrink-0"
                style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)" }}>
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{item.date}</p>
                <p className="text-[11px] text-slate-500">{item.invoice} · {item.method}</p>
              </div>
              <span className="text-sm font-bold text-white">{item.amount}</span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold"
                style={{ background: "rgba(52,211,153,0.08)", color: "#34D399", border: "1px solid rgba(52,211,153,0.2)" }}>
                {item.status}
              </span>
              <button className="text-slate-600 hover:text-slate-300 transition-colors p-1.5 rounded-lg hover:bg-white/[0.04]">
                <Download className="h-3.5 w-3.5" />
              </button>
              <ChevronRight className={`h-4 w-4 text-slate-600 transition-transform ${openInvoice === item.invoice ? "rotate-90" : ""}`} />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.05] bg-white/[0.01]">
          <div className="flex items-center gap-2">
            <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-400">$16,795 total billed in 2026</span>
          </div>
          <button className="text-xs font-medium text-slate-500 hover:text-indigo-400 transition-colors">View All Invoices →</button>
        </div>
      </div>
    </div>
  )
}
