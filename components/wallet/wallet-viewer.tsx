"use client"

import { useState } from "react"
import { Search, ArrowUpRight, ArrowDownLeft, Wallet, Copy, Check, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { FuturisticCard } from "@/components/ui/futuristic-card"

interface TokenBalance {
  symbol: string
  name: string
  balance: string
  value: string
  change: number
}

interface Transaction {
  hash: string
  type: "send" | "receive"
  amount: string
  token: string
  from: string
  to: string
  time: string
}

const mockBalances: TokenBalance[] = [
  { symbol: "INJ", name: "Injective", balance: "1,234.56", value: "$24,691.20", change: 5.2 },
  { symbol: "USDT", name: "Tether", balance: "5,000.00", value: "$5,000.00", change: 0 },
  { symbol: "ATOM", name: "Cosmos", balance: "250.00", value: "$2,125.00", change: -2.1 },
  { symbol: "WETH", name: "Wrapped ETH", balance: "0.85", value: "$2,805.00", change: 3.4 },
]

const mockTransactions: Transaction[] = [
  {
    hash: "0x1a2b3c...4d5e6f",
    type: "receive",
    amount: "100.00",
    token: "INJ",
    from: "inj1abc...xyz",
    to: "inj1def...uvw",
    time: "2 mins ago",
  },
  {
    hash: "0x2b3c4d...5e6f7g",
    type: "send",
    amount: "50.00",
    token: "USDT",
    from: "inj1def...uvw",
    to: "inj1ghi...rst",
    time: "15 mins ago",
  },
  {
    hash: "0x3c4d5e...6f7g8h",
    type: "receive",
    amount: "25.50",
    token: "ATOM",
    from: "inj1jkl...mno",
    to: "inj1def...uvw",
    time: "1 hour ago",
  },
  {
    hash: "0x4d5e6f...7g8h9i",
    type: "send",
    amount: "0.15",
    token: "WETH",
    from: "inj1def...uvw",
    to: "inj1pqr...stu",
    time: "3 hours ago",
  },
]

export function WalletViewer() {
  const [address, setAddress] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleSearch = () => {
    if (address.trim()) {
      setIsLoaded(true)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const totalValue = "$34,621.20"
  const totalIncoming = "$3,250.00"
  const totalOutgoing = "$1,845.00"

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <FuturisticCard glowColor="cyan" delay={0.1}>
        <div className="relative flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Input
              placeholder="Enter wallet address (e.g., inj1...)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="h-12 border-white/[0.08] bg-white/[0.02] pl-12 font-mono text-sm focus:border-cyan-500/50"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Wallet className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          </div>
          <Button
            onClick={handleSearch}
            className="h-12 gap-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-6 hover:bg-cyan-500/30 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] w-full sm:w-auto touch-manipulation"
          >
            <Search className="h-4 w-4" />
            Scan Wallet
          </Button>
        </div>
      </FuturisticCard>

      {isLoaded && (
        <>
          {/* Wallet Summary */}
          <FuturisticCard glowColor="cyan" delay={0.2}>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Wallet Address</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-sm text-foreground">{address || "inj1abc...xyz"}</p>
                  <button onClick={handleCopy} className="text-muted-foreground hover:text-cyan-400 transition-colors">
                    {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                  <button className="text-muted-foreground hover:text-cyan-400 transition-colors">
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="font-mono text-2xl font-bold text-cyan-400">{totalValue}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4">
                <div className="flex items-center gap-2">
                  <ArrowDownLeft className="h-5 w-5 text-emerald-400" />
                  <span className="text-sm text-muted-foreground">Total Incoming</span>
                </div>
                <p className="mt-1 font-mono text-lg font-semibold text-emerald-400">{totalIncoming}</p>
              </div>
              <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-4">
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="h-5 w-5 text-rose-400" />
                  <span className="text-sm text-muted-foreground">Total Outgoing</span>
                </div>
                <p className="mt-1 font-mono text-lg font-semibold text-rose-400">{totalOutgoing}</p>
              </div>
            </div>
          </FuturisticCard>

          {/* Token Balances */}
          <FuturisticCard glowColor="magenta" delay={0.3}>
            <h3 className="mb-4 text-lg font-semibold text-foreground">Token Balances</h3>
            <div className="space-y-3">
              {mockBalances.map((token, index) => (
                <div
                  key={token.symbol}
                  className="group flex items-center justify-between rounded-lg bg-white/[0.02] border border-white/[0.05] p-4 transition-all duration-300 hover:bg-white/[0.05] hover:border-fuchsia-500/30"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-fuchsia-500/20">
                      <span className="font-mono text-xs font-bold text-fuchsia-400">{token.symbol.slice(0, 2)}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{token.symbol}</p>
                      <p className="text-sm text-muted-foreground">{token.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-semibold text-foreground">{token.balance}</p>
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-sm text-muted-foreground">{token.value}</span>
                      <span
                        className={cn(
                          "text-xs font-medium",
                          token.change > 0
                            ? "text-emerald-400"
                            : token.change < 0
                              ? "text-rose-400"
                              : "text-muted-foreground",
                        )}
                      >
                        {token.change > 0 ? "+" : ""}
                        {token.change}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </FuturisticCard>

          {/* Recent Transactions */}
          <FuturisticCard glowColor="emerald" delay={0.4}>
            <h3 className="mb-4 text-lg font-semibold text-foreground">Recent Transactions</h3>
            <div className="space-y-3">
              {mockTransactions.map((tx) => (
                <div
                  key={tx.hash}
                  className="group flex items-center justify-between rounded-lg bg-white/[0.02] border border-white/[0.05] p-4 transition-all duration-300 hover:bg-white/[0.05] hover:border-emerald-500/30"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full",
                        tx.type === "receive" ? "bg-emerald-500/20" : "bg-rose-500/20",
                      )}
                    >
                      {tx.type === "receive" ? (
                        <ArrowDownLeft className="h-5 w-5 text-emerald-400" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-rose-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {tx.type === "receive" ? "Received" : "Sent"} {tx.token}
                      </p>
                      <p className="font-mono text-xs text-muted-foreground">{tx.hash}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={cn(
                        "font-mono font-semibold",
                        tx.type === "receive" ? "text-emerald-400" : "text-rose-400",
                      )}
                    >
                      {tx.type === "receive" ? "+" : "-"}
                      {tx.amount} {tx.token}
                    </p>
                    <p className="text-xs text-muted-foreground">{tx.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </FuturisticCard>
        </>
      )}
    </div>
  )
}
