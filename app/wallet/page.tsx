import { MainLayout } from "@/components/layout/main-layout"
import { WalletViewer } from "@/components/wallet/wallet-viewer"

export default function WalletPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-[var(--font-orbitron)] text-2xl font-bold tracking-wide text-foreground">
            Wallet Activity
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View token balances and transaction history for any Injective wallet
          </p>
        </div>

        {/* Wallet Viewer */}
        <WalletViewer />
      </div>
    </MainLayout>
  )
}
