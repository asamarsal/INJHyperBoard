import { MainLayout } from "@/components/layout/main-layout"
import { NetworkStatus } from "@/components/network/network-status"

export default function NetworkPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-[var(--font-orbitron)] text-2xl font-bold tracking-wide text-foreground">
            Network Status
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time monitoring of Injective network health and performance
          </p>
        </div>

        {/* Network Status */}
        <NetworkStatus />
      </div>
    </MainLayout>
  )
}
