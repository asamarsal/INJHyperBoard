"use client"

import type React from "react"
import { useState } from "react"
import { Search, ArrowRight, Fuel, Clock, User, Wallet, Coins, CheckCircle2 } from "lucide-react"
import { FuturisticCard } from "@/components/ui/futuristic-card"

interface TransactionDetails {
  hash: string
  sender: string
  receiver: string
  amount: string
  token: string
  gasEstimate: string
  gasCost: string
  status: string
  summary: string
}

const mockTransaction: TransactionDetails = {
  hash: "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385",
  sender: "inj1abc...xyz",
  receiver: "inj1def...uvw",
  amount: "100.00",
  token: "INJ",
  gasEstimate: "0.0001 INJ",
  gasCost: "~$0.002 USD",
  status: "Simulated",
  summary: "This transaction will transfer 100 INJ tokens from the sender wallet to the receiver wallet.",
}

export function TransactionPreview() {
  const [txHash, setTxHash] = useState("")
  const [transaction, setTransaction] = useState<TransactionDetails | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handlePreview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!txHash.trim()) return

    setIsLoading(true)
    setTimeout(() => {
      setTransaction({ ...mockTransaction, hash: txHash })
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <FuturisticCard glowColor="cyan" delay={0.1}>
        <form onSubmit={handlePreview} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Transaction Hash</label>
            <div className="relative">
              <input
                type="text"
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                placeholder="Enter transaction hash or paste simulated parameters..."
                className="w-full rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 text-sm text-foreground placeholder:text-muted-foreground transition-all duration-300 focus:border-cyan-500/50 focus:outline-none focus:shadow-[0_0_20px_rgba(0,255,255,0.15)]"
              />
              <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-cyan-500/20 border border-cyan-500/30 py-2.5 sm:py-3 text-sm sm:text-base text-cyan-400 font-medium transition-all duration-300 hover:bg-cyan-500/30 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] touch-manipulation"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
                Analyzing...
              </span>
            ) : (
              "Preview Transaction"
            )}
          </button>
        </form>
      </FuturisticCard>

      {transaction && (
        <div className="grid gap-4 lg:grid-cols-2">
          <FuturisticCard glowColor="cyan" delay={0.2}>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
              <User className="h-5 w-5 text-cyan-400" />
              Transaction Parties
            </h3>
            <div className="space-y-4">
              <div className="rounded-lg bg-white/[0.02] border border-white/[0.05] p-4">
                <p className="text-xs text-muted-foreground">Sender</p>
                <p className="mt-1 font-mono text-sm text-foreground">{transaction.sender}</p>
              </div>
              <div className="flex items-center justify-center">
                <div className="rounded-full bg-cyan-500/20 p-2">
                  <ArrowRight className="h-4 w-4 text-cyan-400" />
                </div>
              </div>
              <div className="rounded-lg bg-white/[0.02] border border-white/[0.05] p-4">
                <p className="text-xs text-muted-foreground">Receiver</p>
                <p className="mt-1 font-mono text-sm text-foreground">{transaction.receiver}</p>
              </div>
            </div>
          </FuturisticCard>

          <FuturisticCard glowColor="magenta" delay={0.25}>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
              <Coins className="h-5 w-5 text-fuchsia-400" />
              Transfer Details
            </h3>
            <div className="space-y-4">
              <div className="rounded-lg bg-white/[0.02] border border-white/[0.05] p-4">
                <p className="text-xs text-muted-foreground">Amount</p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {transaction.amount} <span className="text-fuchsia-400">{transaction.token}</span>
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-white/[0.02] border border-white/[0.05] p-4">
                  <div className="flex items-center gap-2">
                    <Fuel className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Gas Estimate</p>
                  </div>
                  <p className="mt-1 text-sm font-medium text-foreground">{transaction.gasEstimate}</p>
                  <p className="text-xs text-muted-foreground">{transaction.gasCost}</p>
                </div>
                <div className="rounded-lg bg-white/[0.02] border border-white/[0.05] p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Status</p>
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-sm font-medium text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    {transaction.status}
                  </p>
                </div>
              </div>
            </div>
          </FuturisticCard>

          <div className="lg:col-span-2">
            <FuturisticCard glowColor="cyan" delay={0.3}>
              <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                <Wallet className="h-5 w-5 text-cyan-400" />
                Transaction Summary
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{transaction.summary}</p>
              <div className="mt-4 rounded-lg bg-amber-500/10 border border-amber-500/20 p-3">
                <p className="text-xs text-amber-400">This is a read-only preview. No transaction will be executed.</p>
              </div>
            </FuturisticCard>
          </div>
        </div>
      )}
    </div>
  )
}
