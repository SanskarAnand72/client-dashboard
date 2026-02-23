"use client"

import { useState } from "react"
import { Bot, Zap, ShoppingBag, Headphones, TrendingUp, Plus, Clock, MoreHorizontal, Play, Pause, Settings2, ExternalLink, ChevronRight, MessageSquare, Users, Star } from "lucide-react"

interface Project {
  id: number
  name: string
  purpose: string
  status: "Running" | "Paused" | "Testing" | "Draft"
  lastUpdated: string
  icon: React.ElementType
  color: string
  rgb: string
  conversations: number
  leads: number
  satisfaction: number
  uptime: number
  weekData: number[]
}

const PROJECTS: Project[] = [
  {
    id: 1,
    name: "Appointment Booking Agent",
    purpose: "Automated appointment scheduling & reminders",
    status: "Running",
    lastUpdated: "2 hours ago",
    icon: Bot,
    color: "#6366F1",
    rgb: "99,102,241",
    conversations: 3420,
    leads: 284,
    satisfaction: 4.8,
    uptime: 99.4,
    weekData: [40, 55, 48, 70, 82, 76, 91],
  },
  {
    id: 2,
    name: "Lead Nurturing Campaign",
    purpose: "Automated follow-up & conversion sequences",
    status: "Running",
    lastUpdated: "30 minutes ago",
    icon: TrendingUp,
    color: "#22D3EE",
    rgb: "34,211,238",
    conversations: 2180,
    leads: 196,
    satisfaction: 4.6,
    uptime: 98.7,
    weekData: [30, 42, 38, 55, 60, 58, 72],
  },
  {
    id: 3,
    name: "Customer Support Bot",
    purpose: "FAQ routing & ticket deflection",
    status: "Paused",
    lastUpdated: "1 day ago",
    icon: Headphones,
    color: "#FBBF24",
    rgb: "251,191,36",
    conversations: 810,
    leads: 32,
    satisfaction: 4.3,
    uptime: 87.2,
    weekData: [25, 28, 30, 20, 15, 0, 0],
  },
  {
    id: 4,
    name: "Sales Qualification Agent",
    purpose: "Lead qualification & BANT scoring",
    status: "Testing",
    lastUpdated: "5 hours ago",
    icon: ShoppingBag,
    color: "#EC4899",
    rgb: "236,72,153",
    conversations: 142,
    leads: 48,
    satisfaction: 4.1,
    uptime: 94.0,
    weekData: [10, 18, 22, 35, 40, 38, 45],
  },
  {
    id: 5,
    name: "Post-Purchase Upsell Bot",
    purpose: "Order follow-up, reviews & upsell flows",
    status: "Running",
    lastUpdated: "12 minutes ago",
    icon: Zap,
    color: "#34D399",
    rgb: "52,211,153",
    conversations: 4860,
    leads: 521,
    satisfaction: 4.9,
    uptime: 99.8,
    weekData: [60, 72, 68, 84, 90, 88, 98],
  },
]

const STATUS_META: Record<string, { label: string; bg: string; border: string; dot: string; textColor: string }> = {
  Running: { label: "Running", bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.25)", dot: "#34D399", textColor: "#34D399" },
  Paused: { label: "Paused", bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.25)", dot: "#FBBF24", textColor: "#FBBF24" },
  Testing: { label: "Testing", bg: "rgba(34,211,238,0.08)", border: "rgba(34,211,238,0.25)", dot: "#22D3EE", textColor: "#22D3EE" },
  Draft: { label: "Draft", bg: "rgba(100,116,139,0.08)", border: "rgba(100,116,139,0.25)", dot: "#64748B", textColor: "#64748B" },
}

function MiniBar({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data) || 1
  return (
    <div className="flex items-end gap-0.5 h-8">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm transition-all duration-500"
          style={{
            height: `${(v / max) * 100}%`,
            background: i === data.length - 1
              ? color
              : `rgba(${color === "#6366F1" ? "99,102,241" : color === "#22D3EE" ? "34,211,238" : color === "#FBBF24" ? "251,191,36" : color === "#EC4899" ? "236,72,153" : "52,211,153"},0.35)`,
            boxShadow: i === data.length - 1 ? `0 0 6px ${color}80` : "none",
          }}
        />
      ))}
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const [hovered, setHovered] = useState(false)
  const Icon = project.icon
  const meta = STATUS_META[project.status]

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-2xl p-5 overflow-hidden cursor-pointer transition-all duration-300 animate-fade-in-up"
      style={{
        background: hovered
          ? `linear-gradient(145deg, rgba(${project.rgb},0.10) 0%, rgba(13,20,33,0.98) 100%)`
          : "rgba(13,20,33,0.8)",
        border: hovered ? `1px solid rgba(${project.rgb},0.35)` : "1px solid rgba(255,255,255,0.07)",
        boxShadow: hovered ? `0 0 0 1px rgba(${project.rgb},0.1), 0 12px 40px rgba(0,0,0,0.5)` : "0 4px 20px rgba(0,0,0,0.3)",
        backdropFilter: "blur(16px)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
      }}
    >
      {/* Glow blob */}
      <div
        className="absolute -top-10 -right-10 h-36 w-36 rounded-full pointer-events-none transition-opacity duration-300"
        style={{ background: `radial-gradient(circle, ${project.color}, transparent 70%)`, opacity: hovered ? 0.12 : 0.05 }}
      />

      <div className="relative z-10">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl flex-shrink-0 transition-all duration-300"
              style={{
                background: `rgba(${project.rgb},0.12)`,
                border: `1px solid rgba(${project.rgb},0.25)`,
                boxShadow: hovered ? `0 0 16px rgba(${project.rgb},0.3)` : "none",
              }}
            >
              <Icon className="h-5 w-5" style={{ color: project.color }} />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight">{project.name}</p>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">{project.purpose}</p>
            </div>
          </div>
          <button className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-600 hover:text-slate-300 hover:bg-white/[0.06] transition-colors flex-shrink-0">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* Status + uptime */}
        <div className="flex items-center gap-3 mb-4">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all"
            style={{ background: meta.bg, border: `1px solid ${meta.border}`, color: meta.textColor }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full flex-shrink-0"
              style={{
                background: meta.dot,
                boxShadow: project.status === "Running" ? `0 0 6px ${meta.dot}` : "none",
                animation: project.status === "Running" ? "pulse 2s infinite" : "none",
              }}
            />
            {meta.label}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-slate-600">
            <Clock className="h-3 w-3" />
            {project.lastUpdated}
          </span>
          <span className="ml-auto text-[11px] font-bold" style={{ color: project.uptime >= 98 ? "#34D399" : project.uptime >= 90 ? "#FBBF24" : "#F87171" }}>
            {project.uptime}% uptime
          </span>
        </div>

        {/* Mini metrics */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { icon: MessageSquare, label: "Conversations", value: project.conversations.toLocaleString(), color: project.color },
            { icon: Users, label: "Leads", value: project.leads.toLocaleString(), color: "#A78BFA" },
            { icon: Star, label: "CSAT", value: `${project.satisfaction}/5`, color: "#FBBF24" },
          ].map(m => (
            <div key={m.label} className="rounded-xl p-2.5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <m.icon className="h-3 w-3 mb-1" style={{ color: m.color }} />
              <p className="text-xs font-bold text-white">{m.value}</p>
              <p className="text-[10px] text-slate-600">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Mini bar chart */}
        <div className="mb-4">
          <p className="text-[10px] text-slate-600 mb-1.5">7-day activity</p>
          <MiniBar data={project.weekData} color={project.color} />
        </div>

        {/* Divider */}
        <div className="h-px mb-3" style={{ background: `rgba(${project.rgb},0.12)` }} />

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {project.status === "Running" ? (
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:opacity-90"
              style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)", color: "#FBBF24" }}
            >
              <Pause className="h-3 w-3" /> Pause
            </button>
          ) : project.status === "Paused" ? (
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:opacity-90"
              style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", color: "#34D399" }}
            >
              <Play className="h-3 w-3" /> Resume
            </button>
          ) : (
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:opacity-90"
              style={{ background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.2)", color: "#22D3EE" }}
            >
              <Play className="h-3 w-3" /> Deploy
            </button>
          )}
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-200 hover:bg-white/[0.04] transition-all"
          >
            <Settings2 className="h-3 w-3" /> Configure
          </button>
          <button
            className="ml-auto flex items-center gap-1 text-xs font-medium transition-all hover:opacity-80"
            style={{ color: project.color }}
          >
            View <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  )
}

export function ActiveProjects() {
  const running = PROJECTS.filter(p => p.status === "Running").length
  const paused = PROJECTS.filter(p => p.status === "Paused").length
  const testing = PROJECTS.filter(p => p.status === "Testing").length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Active Projects</h2>
          <p className="text-sm text-slate-400 mt-0.5">Manage your AI chatbot agents across all clients.</p>
        </div>
        <button
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
          style={{ background: "linear-gradient(135deg, #6366F1, #A78BFA)", boxShadow: "0 4px 14px rgba(99,102,241,0.4)" }}
        >
          <Plus className="h-4 w-4" /> New Agent
        </button>
      </div>

      {/* Summary pills */}
      <div className="flex flex-wrap items-center gap-3 animate-fade-in">
        {[
          { label: "Total Agents", value: PROJECTS.length, color: "#6366F1", rgb: "99,102,241" },
          { label: "Running", value: running, color: "#34D399", rgb: "52,211,153" },
          { label: "Paused", value: paused, color: "#FBBF24", rgb: "251,191,36" },
          { label: "Testing", value: testing, color: "#22D3EE", rgb: "34,211,238" },
        ].map(p => (
          <div key={p.label}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl"
            style={{ background: `rgba(${p.rgb},0.08)`, border: `1px solid rgba(${p.rgb},0.2)` }}
          >
            <span className="text-xl font-black" style={{ color: p.color }}>{p.value}</span>
            <span className="text-xs font-medium text-slate-400">{p.label}</span>
          </div>
        ))}
      </div>

      {/* Cards grid */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 stagger">
        {PROJECTS.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}

        {/* Add new card */}
        <button className="relative rounded-2xl p-5 transition-all duration-300 animate-fade-in-up group"
          style={{
            background: "rgba(13,20,33,0.5)",
            border: "1px dashed rgba(255,255,255,0.1)",
            backdropFilter: "blur(16px)",
            minHeight: 260,
          }}>
          <div className="absolute inset-0 rounded-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"
            style={{ background: "rgba(99,102,241,0.04)", border: "1px dashed rgba(99,102,241,0.3)" }} />
          <div className="relative z-10 h-full flex flex-col items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-200 group-hover:scale-110"
              style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>
              <Plus className="h-6 w-6 text-indigo-400" />
            </div>
            <p className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">Create New Agent</p>
            <p className="text-[11px] text-slate-600 group-hover:text-slate-500 transition-colors">Deploy a fresh AI chatbot</p>
          </div>
        </button>
      </div>
    </div>
  )
}
