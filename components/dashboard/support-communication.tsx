"use client"

import { useState } from "react"
import { MessageSquare, Calendar, Mail, Phone, Clock, ArrowUpRight, ChevronDown, ChevronUp, CheckCircle2, AlertCircle, Headphones, Zap, BookOpen } from "lucide-react"

/* ─── Data ─────────────────────────────────────────────────────────────── */
const TICKETS = [
  { id: "TKT-1042", title: "Bot not responding on WhatsApp", priority: "High", status: "Open", time: "2h ago", color: "#F87171", rgb: "248,113,113" },
  { id: "TKT-1039", title: "Lead data not syncing to Salesforce", priority: "Medium", status: "In Progress", time: "5h ago", color: "#FBBF24", rgb: "251,191,36" },
  { id: "TKT-1031", title: "Analytics export showing wrong dates", priority: "Low", status: "Resolved", time: "2d ago", color: "#34D399", rgb: "52,211,153" },
]

const FAQS = [
  {
    q: "How do I add a new AI agent?",
    a: "Navigate to Active Projects → click \"New Agent\". Follow the 4-step setup wizard to configure your agent's persona, integrations and deployment channel.",
  },
  {
    q: "What should I do if my agent stops responding?",
    a: "Check the agent status card in Active Projects. If status is \"Failed\", try toggling it off and on. If the problem persists, open a support ticket.",
  },
  {
    q: "How can I export my conversation data?",
    a: "Go to Insights & Reports and click \"Export Report\" to download data in CSV or PDF format. Exports include all conversation logs and metrics.",
  },
  {
    q: "Can I white-label the chatbot for my clients?",
    a: "Yes! On Enterprise plan you can fully white-label — custom domain, logo, colors and remove all ChatAI Pro branding.",
  },
]

/* ─── FAQ Accordion ─────────────────────────────────────────────────────── */
function FAQItem({ faq }: { faq: typeof FAQS[0] }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-300 cursor-pointer"
      style={{ background: open ? "rgba(99,102,241,0.05)" : "rgba(255,255,255,0.02)", border: open ? "1px solid rgba(99,102,241,0.2)" : "1px solid rgba(255,255,255,0.05)" }}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <p className="text-sm font-semibold text-slate-300 group-hover:text-white flex-1">{faq.q}</p>
        {open
          ? <ChevronUp className="h-4 w-4 text-indigo-400 flex-shrink-0" />
          : <ChevronDown className="h-4 w-4 text-slate-600 flex-shrink-0" />}
      </div>
      {open && (
        <div className="px-5 pb-4">
          <p className="text-sm text-slate-400 leading-relaxed">{faq.a}</p>
        </div>
      )}
    </div>
  )
}

/* ─── Main ──────────────────────────────────────────────────────────────── */
export function SupportCommunication() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Support & Communication</h2>
          <p className="text-sm text-slate-400 mt-0.5">Get help, contact your account manager, and track open tickets.</p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold"
          style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", color: "#34D399" }}>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Support Online · ~2 min response
        </div>
      </div>

      {/* Contact cards */}
      <div className="grid gap-5 md:grid-cols-2 animate-fade-in">
        {/* Chat */}
        <div className="relative rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:border-indigo-500/30 hover:shadow-lg"
          style={{ background: "rgba(13,20,33,0.8)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>
          <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,#6366F1,transparent 70%)", opacity: 0.08 }} />
          <div className="relative z-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl mb-4"
              style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)", boxShadow: "0 0 18px rgba(99,102,241,0.2)" }}>
              <MessageSquare className="h-5 w-5 text-indigo-400" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Live Support Chat</h3>
            <p className="text-xs text-slate-500 mb-5">Our AI + human team is ready to help you right now.</p>
            <div className="flex items-center gap-2 mb-5">
              {["2 min avg", "24/7 available", "AI-first"].map(badge => (
                <span key={badge} className="text-[10px] font-bold px-2 py-1 rounded-lg"
                  style={{ background: "rgba(99,102,241,0.08)", color: "#A78BFA", border: "1px solid rgba(99,102,241,0.15)" }}>
                  {badge}
                </span>
              ))}
            </div>
            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: "linear-gradient(135deg,#6366F1,#A78BFA)", boxShadow: "0 4px 14px rgba(99,102,241,0.4)" }}>
              <MessageSquare className="h-4 w-4" /> Open Live Chat
            </button>
          </div>
        </div>

        {/* Schedule call */}
        <div className="relative rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:border-violet-500/30 hover:shadow-lg"
          style={{ background: "rgba(13,20,33,0.8)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>
          <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,#A78BFA,transparent 70%)", opacity: 0.08 }} />
          <div className="relative z-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl mb-4"
              style={{ background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.25)", boxShadow: "0 0 18px rgba(167,139,250,0.2)" }}>
              <Calendar className="h-5 w-5 text-violet-400" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Schedule a Strategy Call</h3>
            <p className="text-xs text-slate-500 mb-5">Book time with your dedicated account manager.</p>
            <div className="flex items-center gap-2 mb-5">
              {["Mon–Fri", "9AM–6PM EST", "60 min"].map(badge => (
                <span key={badge} className="text-[10px] font-bold px-2 py-1 rounded-lg"
                  style={{ background: "rgba(167,139,250,0.08)", color: "#A78BFA", border: "1px solid rgba(167,139,250,0.15)" }}>
                  {badge}
                </span>
              ))}
            </div>
            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: "linear-gradient(135deg,#7C3AED,#A78BFA)", boxShadow: "0 4px 14px rgba(124,58,237,0.4)" }}>
              <Calendar className="h-4 w-4" /> Book a Meeting
            </button>
          </div>
        </div>
      </div>

      {/* Account Manager + Tickets */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Account manager card */}
        <div className="rounded-2xl p-6 animate-fade-in"
          style={{ background: "rgba(13,20,33,0.8)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>
          <div className="flex items-center gap-2 mb-5">
            <Headphones className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Your Account Manager</h3>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-black text-white flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#6366F1,#EC4899)", boxShadow: "0 0 18px rgba(99,102,241,0.4)" }}>
              SJ
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white">Sarah Johnson</p>
              <p className="text-[11px] text-slate-500">Senior Account Manager · ChatAI Pro</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" style={{ boxShadow: "0 0 4px #34D399" }} />
                <span className="text-[10px] text-emerald-400 font-semibold">Online now</span>
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {[
              { icon: Mail, label: "sarah@chatai.pro", href: "mailto:sarah@chatai.pro", color: "#6366F1" },
              { icon: Phone, label: "+1 (234) 567-890", href: "tel:+1234567890", color: "#22D3EE" },
              { icon: Clock, label: "Response SLA: 2 business hours", color: "#A78BFA" },
            ].map((c, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0"
                  style={{ background: `rgba(${c.color === "#6366F1" ? "99,102,241" : c.color === "#22D3EE" ? "34,211,238" : "167,139,250"},0.1)` }}>
                  <c.icon className="h-3.5 w-3.5" style={{ color: c.color }} />
                </div>
                {c.href
                  ? <a href={c.href} className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">{c.label}</a>
                  : <span className="text-sm text-slate-400">{c.label}</span>}
              </div>
            ))}
          </div>

          <button className="mt-5 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-all hover:bg-white/[0.06]"
            style={{ border: "1px solid rgba(255,255,255,0.08)", color: "#A78BFA" }}>
            <ArrowUpRight className="h-3.5 w-3.5" /> Send Message
          </button>
        </div>

        {/* Open Tickets */}
        <div className="rounded-2xl p-6 animate-fade-in"
          style={{ background: "rgba(13,20,33,0.8)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>
          <div className="flex items-center gap-2 mb-5">
            <Zap className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Recent Tickets</h3>
            <span className="ml-auto text-[10px] font-bold px-2 py-1 rounded-lg" style={{ background: "rgba(248,113,113,0.1)", color: "#F87171", border: "1px solid rgba(248,113,113,0.2)" }}>2 Open</span>
          </div>
          <div className="space-y-3">
            {TICKETS.map(t => (
              <div key={t.id} className="flex items-start gap-3 p-3 rounded-xl group hover:bg-white/[0.02] cursor-pointer transition-all"
                style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0 mt-0.5"
                  style={{ background: `rgba(${t.rgb},0.1)`, border: `1px solid rgba(${t.rgb},0.2)` }}>
                  {t.status === "Resolved"
                    ? <CheckCircle2 className="h-3.5 w-3.5" style={{ color: t.color }} />
                    : <AlertCircle className="h-3.5 w-3.5" style={{ color: t.color }} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors leading-snug">{t.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px]" style={{ color: t.color }}>{t.status}</span>
                    <span className="text-[10px] text-slate-600">·</span>
                    <span className="text-[10px] text-slate-600">{t.id}</span>
                    <span className="text-[10px] text-slate-600">·</span>
                    <span className="text-[10px] text-slate-600">{t.time}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md flex-shrink-0"
                  style={{ background: `rgba(${t.rgb},0.08)`, color: t.color, border: `1px solid rgba(${t.rgb},0.15)` }}>
                  {t.priority}
                </span>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full text-xs font-medium text-slate-500 hover:text-indigo-400 transition-colors py-2">
            View all tickets →
          </button>
        </div>
      </div>

      {/* FAQ accordion */}
      <div className="rounded-2xl p-6 animate-fade-in"
        style={{ background: "rgba(13,20,33,0.8)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>
        <div className="flex items-center gap-2 mb-5">
          <BookOpen className="h-4 w-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-white">FAQ & Troubleshooting</h3>
        </div>
        <div className="space-y-2">
          {FAQS.map((faq, i) => <FAQItem key={i} faq={faq} />)}
        </div>
      </div>
    </div>
  )
}
