import { MainLayout } from "@/components/layout/main-layout"
import { CostCalculator } from "@/components/cost-estimator/cost-calculator"

export default function CostEstimatorPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-[var(--font-orbitron)] text-2xl font-bold tracking-wide text-foreground">
            Cost Estimator
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Simulate and estimate gas costs for different actions on Injective
          </p>
        </div>

        {/* Cost Calculator */}
        <CostCalculator />
      </div>
    </MainLayout>
  )
}
