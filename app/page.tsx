"use client"

import { useState } from "react"
import { Sidebar } from "@/components/store-dashboard/sidebar"
import { Header } from "@/components/store-dashboard/header"
import { Overview } from "@/components/store-dashboard/overview"
import { RevenueImpact } from "@/components/store-dashboard/revenue-impact"
import { SalesFunnel } from "@/components/store-dashboard/sales-funnel"
import { AIOrders } from "@/components/store-dashboard/ai-orders"
import { CartRecovery } from "@/components/store-dashboard/cart-recovery"
import { TryOnAnalytics } from "@/components/store-dashboard/try-on-analytics"
import { CustomerEngagement } from "@/components/store-dashboard/customer-engagement"
import { ProductInsights } from "@/components/store-dashboard/product-insights"
import { ProductPerformance } from "@/components/store-dashboard/product-performance"
import { CustomerBehavior } from "@/components/store-dashboard/customer-behavior"
import { EngagementMetrics } from "@/components/store-dashboard/engagement-metrics"
import { Subscription } from "@/components/store-dashboard/subscription"
import { ROISummary } from "@/components/store-dashboard/roi-summary"

/* ── Placeholder for not-yet-built sections ───────────────────────────── */
function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-96 text-center animate-fade-in">
      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl mb-5"
        style={{
          background: "linear-gradient(135deg,rgba(236,72,153,0.15),rgba(99,102,241,0.1))",
          border: "1px solid rgba(236,72,153,0.2)",
        }}
      >
        <span className="text-3xl">🚀</span>
      </div>
      <p className="text-lg font-bold text-white mb-2">{title}</p>
      <p className="text-sm text-slate-500">This section is coming soon.</p>
    </div>
  )
}

/* ── Route map ────────────────────────────────────────────────────────── */
function SectionContent({ section }: { section: string }) {
  switch (section) {
    case "overview": return <Overview />
    case "revenue": return <RevenueImpact />
    case "funnel": return <SalesFunnel />
    case "orders": return <AIOrders />
    case "cart": return <CartRecovery />
    case "tryon": return <TryOnAnalytics />
    case "engagement": return <CustomerEngagement />
    case "products": return <ProductInsights />
    case "performance": return <ProductPerformance />
    case "behavior": return <CustomerBehavior />
    case "metrics": return <EngagementMetrics />
    case "subscription": return <Subscription />
    case "roi": return <ROISummary />
    default: return <ComingSoon title={section.charAt(0).toUpperCase() + section.slice(1)} />
  }
}

/* ── Root page ────────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState("overview")

  return (
    <div
      className="flex min-h-screen"
      style={{ background: "linear-gradient(135deg,#080C14 0%,#090E1B 50%,#08111A 100%)" }}
    >
      <Sidebar active={activeSection} setActive={setActiveSection} />

      <div className="flex flex-col flex-1 min-w-0 min-h-screen">
        <Header section={activeSection} />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          <SectionContent section={activeSection} />
        </main>
      </div>
    </div>
  )
}
