import { MainLayout } from "@/components/layout/main-layout"
import { TransactionPreview } from "@/components/transaction/transaction-preview"

export default function TransactionPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-[var(--font-orbitron)] text-2xl font-bold tracking-wide text-foreground">
            Transaction Preview
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Analyze and understand transaction details before they execute
          </p>
        </div>

        {/* Transaction Preview Component */}
        <TransactionPreview />
      </div>
    </MainLayout>
  )
}
