import { MainLayout } from "@/components/layout/main-layout"
import { GSAPProvider } from "@/components/providers/gsap-provider"
import { BentoHero } from "@/components/dashboard/bento-hero"
import { BentoStats } from "@/components/dashboard/bento-stats"
import { BentoActions } from "@/components/dashboard/bento-actions"
import { BentoLiveData } from "@/components/dashboard/bento-live-data"
import { BentoLinks } from "@/components/dashboard/bento-links"
import { BentoPriceCard } from "@/components/dashboard/bento-price"

export default function DashboardPage() {
  return (
    <GSAPProvider>
      <MainLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="font-[var(--font-orbitron)] text-2xl font-bold tracking-wide text-foreground">Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Your unified control center for Injective blockchain tools
            </p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" style={{ gridAutoRows: 'minmax(180px, auto)' }}>
            {/* Hero - Large card spanning 2 cols and 2 rows */}
            <BentoHero />

            {/* INJ Price Card - Real-time from CoinGecko */}
            <BentoPriceCard />

            {/* Stats cards */}
            <BentoStats />

            {/* Live Data - Tall card */}
            <BentoLiveData />

            {/* Quick Actions - Wide card */}
            <BentoActions />

            {/* Resources & Community Links */}
            <BentoLinks />
          </div>
        </div>
      </MainLayout>
    </GSAPProvider>
  )
}
