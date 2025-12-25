import { MainLayout } from "@/components/layout/main-layout"
import { ContractExplorer } from "@/components/contracts/contract-explorer"

export default function ContractsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-[var(--font-orbitron)] text-2xl font-bold tracking-wide text-foreground">
            Contract Explorer
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Explore and interact with smart contracts on Injective</p>
        </div>

        {/* Contract Explorer */}
        <ContractExplorer />
      </div>
    </MainLayout>
  )
}
