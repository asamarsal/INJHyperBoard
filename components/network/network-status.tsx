"use client"

import { useState, useEffect } from "react"
import { Activity, Clock, Fuel, Blocks, Server, Zap, TrendingUp, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { FuturisticCard } from "@/components/ui/futuristic-card"

interface StatusIndicator {
  label: string
  status: "healthy" | "degraded" | "down"
  description: string
}

interface NetworkData {
  blockHeight: string
  blockTime: string
  gasPrice: string
  status: "healthy" | "degraded" | "down"
  lastUpdated: string
}

const systemStatus: StatusIndicator[] = [
  { label: "Chain RPC", status: "healthy", description: "All endpoints responding normally" },
  { label: "Indexer API", status: "healthy", description: "Data synced to latest block" },
  { label: "Explorer", status: "healthy", description: "Web interface operational" },
  { label: "Oracle", status: "healthy", description: "Price feeds updating" },
]

const metrics = [
  {
    label: "Network Health",
    value: "Operational",
    icon: Activity,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/20",
    glowColor: "emerald" as const,
  },
  {
    label: "Block Height",
    value: "#78,234,567",
    icon: Blocks,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/20",
    glowColor: "cyan" as const,
  },
  {
    label: "Block Time",
    value: "~1.2s",
    icon: Clock,
    color: "text-fuchsia-400",
    bgColor: "bg-fuchsia-500/20",
    glowColor: "magenta" as const,
  },
  {
    label: "Gas Price",
    value: "0.0001 INJ",
    icon: Fuel,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/20",
    glowColor: "cyan" as const,
  },
]

const gasHistory = [
  { time: "Now", value: 65 },
  { time: "5m", value: 72 },
  { time: "10m", value: 58 },
  { time: "15m", value: 80 },
  { time: "20m", value: 45 },
  { time: "25m", value: 62 },
  { time: "30m", value: 55 },
]

export function NetworkStatus() {
  const [networkData, setNetworkData] = useState<NetworkData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNetworkData = async () => {
    try {
      // Fetch from Injective LCD API and gas price in parallel
      const [blockResponse, gasResponse] = await Promise.all([
        fetch('https://lcd.injective.network/cosmos/base/tendermint/v1beta1/blocks/latest'),
        fetch('/api/gas')
      ])
      
      if (!blockResponse.ok) {
        throw new Error('Failed to fetch network data')
      }

      const blockData = await blockResponse.json()
      const gasData = gasResponse.ok ? await gasResponse.json() : { gasPrice: 0.0001 }
      
      // Extract block height
      const blockHeight = blockData.block?.header?.height || "0"
      
      // Calculate block time (approximate from timestamp)
      const blockTime = "~1.2s" // Injective's average block time
      
      // Gas price from API
      const gasPrice = `${gasData.gasPrice.toFixed(6)} INJ`

      setNetworkData({
        blockHeight: `#${parseInt(blockHeight).toLocaleString()}`,
        blockTime,
        gasPrice,
        status: "healthy",
        lastUpdated: new Date().toISOString(),
      })
      
      setError(null)
    } catch (err) {
      console.error('Error fetching network data:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchNetworkData()

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchNetworkData, 30000)

    return () => clearInterval(interval)
  }, [])
  return (
    <div className="space-y-6">
      <FuturisticCard glowColor="emerald" delay={0.1}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
              </div>
              <div className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-emerald-400">All Systems Operational</h2>
              <p className="text-sm sm:text-base text-muted-foreground">Injective Network is running smoothly</p>
              {/* Last updated - shown below on mobile */}
              <div className="mt-2 sm:hidden">
                <p className="text-xs text-muted-foreground">Last updated: {loading ? "Loading..." : networkData ? new Date(networkData.lastUpdated).toLocaleTimeString() : "Just now"}</p>
              </div>
            </div>
          </div>
          {/* Last updated - shown on right for desktop */}
          <div className="hidden sm:block text-right">
            <p className="text-sm text-muted-foreground">Last updated</p>
            <p className="font-mono text-foreground">
              {loading ? "Loading..." : networkData ? new Date(networkData.lastUpdated).toLocaleTimeString() : "Just now"}
            </p>
          </div>
        </div>
      </FuturisticCard>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Network Health */}
        <FuturisticCard glowColor="emerald" delay={0.15} className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="rounded-lg p-2 bg-emerald-500/20">
              <Activity className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">Network Health</p>
            <p className="text-base sm:text-xl font-mono font-bold text-emerald-400">
              {loading ? "..." : error ? "Error" : "Operational"}
            </p>
          </div>
        </FuturisticCard>

        {/* Block Height - Real-time */}
        <FuturisticCard glowColor="cyan" delay={0.2} className="p-5">
          <div className="flex items-center justify-between">
            <div className="rounded-lg p-2 bg-cyan-500/20">
              <Blocks className="h-5 w-5 text-cyan-400" />
            </div>
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">Block Height</p>
            <p className="font-mono text-xl font-bold text-cyan-400">
              {loading ? "Loading..." : error ? "N/A" : networkData?.blockHeight || "#0"}
            </p>
          </div>
        </FuturisticCard>

        {/* Block Time */}
        <FuturisticCard glowColor="magenta" delay={0.25} className="p-5">
          <div className="flex items-center justify-between">
            <div className="rounded-lg p-2 bg-fuchsia-500/20">
              <Clock className="h-5 w-5 text-fuchsia-400" />
            </div>
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">Block Time</p>
            <p className="font-mono text-xl font-bold text-fuchsia-400">
              {loading ? "..." : networkData?.blockTime || "~1.2s"}
            </p>
          </div>
        </FuturisticCard>

        {/* Gas Price */}
        <FuturisticCard glowColor="cyan" delay={0.3} className="p-5">
          <div className="flex items-center justify-between">
            <div className="rounded-lg p-2 bg-cyan-500/20">
              <Fuel className="h-5 w-5 text-cyan-400" />
            </div>
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">Gas Price</p>
            <p className="font-mono text-xl font-bold text-cyan-400">
              {loading ? "..." : networkData?.gasPrice || "0.0001 INJ"}
            </p>
          </div>
        </FuturisticCard>
      </div>

      <FuturisticCard glowColor="cyan" delay={0.35}>
        <div className="mb-4 flex items-center gap-2">
          <Server className="h-5 w-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-foreground">System Status</h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {systemStatus.map((system) => (
            <div
              key={system.label}
              className="flex items-center gap-4 rounded-lg bg-white/[0.02] border border-white/[0.05] p-4 transition-all duration-300 hover:bg-white/[0.05] hover:border-cyan-500/30"
            >
              <div
                className={cn(
                  "h-3 w-3 rounded-full animate-pulse",
                  system.status === "healthy"
                    ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                    : system.status === "degraded"
                      ? "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]"
                      : "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]",
                )}
              />
              <div className="flex-1">
                <p className="font-medium text-foreground">{system.label}</p>
                <p className="text-sm text-muted-foreground">{system.description}</p>
              </div>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-medium capitalize border",
                  system.status === "healthy"
                    ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                    : system.status === "degraded"
                      ? "bg-amber-500/20 border-amber-500/30 text-amber-400"
                      : "bg-rose-500/20 border-rose-500/30 text-rose-400",
                )}
              >
                {system.status}
              </span>
            </div>
          ))}
        </div>
      </FuturisticCard>

      <FuturisticCard glowColor="magenta" delay={0.4}>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-fuchsia-400" />
            <h3 className="text-lg font-semibold text-foreground">Gas Price Trend</h3>
          </div>
          <span className="text-sm text-muted-foreground">Last 30 minutes</span>
        </div>

        <div className="flex h-40 items-end justify-between gap-2">
          {gasHistory.map((point, index) => (
            <div key={point.time} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-fuchsia-500/50 to-fuchsia-400 transition-all duration-500 hover:from-fuchsia-500/70 hover:to-fuchsia-300 hover:shadow-[0_0_20px_rgba(255,0,255,0.5)]"
                style={{ height: `${point.value}%`, minHeight: '20px' }}
              />
              <span className="text-xs text-muted-foreground whitespace-nowrap">{point.time}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between rounded-lg bg-white/[0.02] border border-white/[0.05] p-3">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-cyan-400" />
            <span className="text-sm text-muted-foreground">Average Gas Price</span>
          </div>
          <span className="font-mono font-medium text-cyan-400">0.0001 INJ</span>
        </div>
      </FuturisticCard>

      <div className="grid gap-4 sm:grid-cols-2">
        <FuturisticCard glowColor="cyan" delay={0.45}>
          <h4 className="mb-3 font-semibold text-foreground">What is Block Height?</h4>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Block height represents the number of blocks in the blockchain since the genesis block. Each new block
            contains validated transactions and is added to the chain approximately every 1.2 seconds on Injective.
          </p>
        </FuturisticCard>
        <FuturisticCard glowColor="magenta" delay={0.5}>
          <h4 className="mb-3 font-semibold text-foreground">Understanding Gas Fees</h4>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Gas fees on Injective are extremely low compared to other networks. They compensate validators for
            processing your transactions. Current average fees are around $0.002 per transaction.
          </p>
        </FuturisticCard>
      </div>
    </div>
  )
}
