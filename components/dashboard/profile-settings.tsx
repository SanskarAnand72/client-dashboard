"use client"

import { useState } from "react"
import { User, Lock, Bell, Key, Copy, Eye, EyeOff, Check, Camera, Globe, Shield, Smartphone, Save, RefreshCw, Trash2 } from "lucide-react"

/* ─── Toggle ─────────────────────────────────────────────────────────────── */
function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange}
      className="relative h-6 w-11 rounded-full transition-all duration-300 flex-shrink-0"
      style={{ background: on ? "linear-gradient(135deg,#6366F1,#A78BFA)" : "rgba(255,255,255,0.08)", boxShadow: on ? "0 0 10px rgba(99,102,241,0.4)" : "none" }}>
      <span className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300"
        style={{ left: on ? "calc(100% - 22px)" : "2px" }} />
    </button>
  )
}

/* ─── Input field ────────────────────────────────────────────────────────── */
function Field({ label, value, type = "text", readOnly = false, onChange }: {
  label: string; value: string; type?: string; readOnly?: boolean; onChange?: (v: string) => void
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        onChange={e => onChange?.(e.target.value)}
        className="mt-2 w-full px-4 py-3 rounded-xl text-sm text-slate-200 outline-none transition-all focus:border-indigo-500/40"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
        onFocus={e => (e.target.style.borderColor = "rgba(99,102,241,0.4)")}
        onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
      />
    </div>
  )
}

/* ─── Section wrapper ────────────────────────────────────────────────────── */
function Section({ icon, label, color, children }: { icon: React.ElementType; label: string; color: string; children: React.ReactNode }) {
  const Icon = icon
  return (
    <div className="rounded-2xl overflow-hidden animate-fade-in-up"
      style={{ background: "rgba(13,20,33,0.8)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-white/[0.06]">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${color}15` }}>
          <Icon className="h-4 w-4" style={{ color }} />
        </div>
        <h3 className="text-sm font-bold text-white">{label}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

/* ─── Main ──────────────────────────────────────────────────────────────── */
export function ProfileSettings() {
  const [showApiKey, setShowApiKey] = useState(false)
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [name, setName] = useState("John Doe")
  const [email, setEmail] = useState("john@techcorp.com")
  const [company, setCompany] = useState("TechCorp Inc.")
  const [webhook, setWebhook] = useState("https://techcorp.com/webhooks/ai-agency")

  const [emailPrefs, setEmailPrefs] = useState({
    reports: true, alerts: true, updates: false, tips: true,
  })
  const [security, setSecurity] = useState({
    twoFa: true, sessionAlerts: true, apiLogs: false,
  })

  const apiKey = "YOUR_API_KEY_HERE"

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Profile & Settings</h2>
          <p className="text-sm text-slate-400 mt-0.5">Manage your account, security and API access.</p>
        </div>
      </div>

      {/* Profile picture + info */}
      <div className="rounded-2xl p-6 animate-fade-in"
        style={{ background: "linear-gradient(145deg,rgba(99,102,241,0.1) 0%,rgba(13,20,33,0.95) 100%)", border: "1px solid rgba(99,102,241,0.2)", backdropFilter: "blur(20px)" }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl text-2xl font-black text-white"
              style={{ background: "linear-gradient(135deg,#6366F1,#EC4899)", boxShadow: "0 0 24px rgba(99,102,241,0.5)" }}>
              JD
            </div>
            <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-lg text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#6366F1,#A78BFA)", boxShadow: "0 0 10px rgba(99,102,241,0.4)" }}>
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex-1">
            <p className="text-xl font-black text-white">{name}</p>
            <p className="text-sm text-slate-400">{email}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {[
                { label: "Agency Admin", color: "#A78BFA", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.2)" },
                { label: "Enterprise Plan", color: "#34D399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.2)" },
                { label: "Member since Oct 2024", color: "#64748B", bg: "rgba(100,116,139,0.08)", border: "rgba(100,116,139,0.15)" },
              ].map(b => (
                <span key={b.label} className="text-[10px] font-bold px-2 py-1 rounded-lg"
                  style={{ background: b.bg, color: b.color, border: `1px solid ${b.border}` }}>
                  {b.label}
                </span>
              ))}
            </div>
          </div>

          <button onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
            style={{ background: saved ? "linear-gradient(135deg,#34D399,#059669)" : "linear-gradient(135deg,#6366F1,#A78BFA)", boxShadow: "0 4px 14px rgba(99,102,241,0.4)" }}>
            {saved ? <><Check className="h-4 w-4" /> Saved!</> : <><Save className="h-4 w-4" /> Save Changes</>}
          </button>
        </div>
      </div>

      {/* Grid: profile + password */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Profile info */}
        <Section icon={User} label="Profile Information" color="#6366F1">
          <div className="space-y-4">
            <Field label="Full Name" value={name} onChange={setName} />
            <Field label="Email Address" value={email} type="email" onChange={setEmail} />
            <Field label="Company" value={company} onChange={setCompany} />
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Timezone</label>
              <select className="mt-2 w-full px-4 py-3 rounded-xl text-sm text-slate-200 outline-none transition-all"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#cbd5e1" }}>
                <option value="IST">Asia/Kolkata (IST, UTC+5:30)</option>
                <option value="EST">America/New_York (EST)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
          </div>
        </Section>

        {/* Password */}
        <Section icon={Lock} label="Change Password" color="#EC4899">
          <div className="space-y-4">
            <Field label="Current Password" type="password" value="" />
            <Field label="New Password" type="password" value="" />
            <Field label="Confirm New Password" type="password" value="" />
            <div className="flex items-center gap-2 mt-1">
              {["8+ chars", "1 uppercase", "1 number", "1 symbol"].map(r => (
                <span key={r} className="text-[10px] px-2 py-1 rounded-lg" style={{ background: "rgba(52,211,153,0.08)", color: "#34D399", border: "1px solid rgba(52,211,153,0.15)" }}>{r}</span>
              ))}
            </div>
            <button className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 mt-2"
              style={{ background: "linear-gradient(135deg,#EC4899,#A78BFA)", boxShadow: "0 4px 14px rgba(236,72,153,0.3)" }}>
              Update Password
            </button>
          </div>
        </Section>
      </div>

      {/* Email preferences + Security */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Email prefs */}
        <Section icon={Bell} label="Email Preferences" color="#22D3EE">
          <div className="space-y-4">
            {[
              { id: "reports", label: "Weekly Reports", sub: "Performance summaries every Monday" },
              { id: "alerts", label: "Alert Notifications", sub: "Critical issues and warnings" },
              { id: "updates", label: "Product Updates", sub: "New features and improvements" },
              { id: "tips", label: "Tips & Best Practices", sub: "Optimization recommendations" },
            ].map(pref => (
              <div key={pref.id} className="flex items-center justify-between gap-3 p-3 rounded-xl transition-all hover:bg-white/[0.02]"
                style={{ border: "1px solid rgba(255,255,255,0.04)" }}>
                <div>
                  <p className="text-sm font-semibold text-slate-300">{pref.label}</p>
                  <p className="text-[11px] text-slate-600">{pref.sub}</p>
                </div>
                <Toggle
                  on={(emailPrefs as any)[pref.id]}
                  onChange={() => setEmailPrefs(p => ({ ...p, [pref.id]: !(p as any)[pref.id] }))}
                />
              </div>
            ))}
          </div>
        </Section>

        {/* Security */}
        <Section icon={Shield} label="Security Settings" color="#34D399">
          <div className="space-y-4">
            {[
              { id: "twoFa", label: "Two-Factor Authentication", sub: "Require 2FA on every sign-in", icon: Smartphone },
              { id: "sessionAlerts", label: "Session Alerts", sub: "Notify on new logins", icon: Globe },
              { id: "apiLogs", label: "API Access Logs", sub: "Detailed per-request audit trail", icon: Key },
            ].map(pref => (
              <div key={pref.id} className="flex items-center justify-between gap-3 p-3 rounded-xl transition-all hover:bg-white/[0.02]"
                style={{ border: "1px solid rgba(255,255,255,0.04)" }}>
                <div className="flex items-center gap-3">
                  <pref.icon className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-300">{pref.label}</p>
                    <p className="text-[11px] text-slate-600">{pref.sub}</p>
                  </div>
                </div>
                <Toggle
                  on={(security as any)[pref.id]}
                  onChange={() => setSecurity(p => ({ ...p, [pref.id]: !(p as any)[pref.id] }))}
                />
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* API Key + Danger Zone */}
      <Section icon={Key} label="API Key & Webhooks" color="#FBBF24">
        <div className="space-y-5">
          {/* API Key */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">API Key</label>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "monospace" }}>
                <Key className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" />
                <span className="flex-1 text-sm text-slate-300 truncate select-none">
                  {showApiKey ? apiKey : "sk_live_•••••••••••••••••••••••••"}
                </span>
              </div>
              <button onClick={() => setShowApiKey(v => !v)}
                className="flex h-11 w-11 items-center justify-center rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/[0.06] transition-all"
                style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <button onClick={handleCopy}
                className="flex h-11 w-11 items-center justify-center rounded-xl transition-all hover:bg-white/[0.06]"
                style={{ border: "1px solid rgba(255,255,255,0.07)", color: copied ? "#34D399" : "#A78BFA" }}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-600 mt-1.5">Keep this key secret. It grants full API access to your account.</p>
          </div>

          {/* Webhook */}
          <Field label="Webhook URL" value={webhook} onChange={setWebhook} />

          <div className="flex items-center gap-3 pt-2">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 active:scale-95"
              style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.25)", color: "#FBBF24" }}>
              <RefreshCw className="h-4 w-4" /> Regenerate Key
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#6366F1,#A78BFA)", boxShadow: "0 4px 14px rgba(99,102,241,0.35)", color: "#fff" }}>
              <Save className="h-4 w-4" /> Save Webhook
            </button>
          </div>
        </div>
      </Section>

      {/* Danger zone */}
      <div className="rounded-2xl p-6 animate-fade-in"
        style={{ background: "rgba(248,113,113,0.04)", border: "1px solid rgba(248,113,113,0.15)" }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-red-400">Danger Zone</p>
            <p className="text-xs text-slate-600 mt-0.5">Permanently delete your account and all its data. This action cannot be undone.</p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 flex-shrink-0"
            style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "#F87171" }}>
            <Trash2 className="h-4 w-4" /> Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}
