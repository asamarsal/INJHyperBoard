"use client"

import { useState, useEffect } from "react"
import { FuturisticCard } from "@/components/ui/futuristic-card"
import { cn } from "@/lib/utils"
import { ArrowRightLeft, RefreshCw, FileCode, Fuel, TrendingDown, TrendingUp, Minus } from "lucide-react"

type ActionType = "transfer" | "swap" | "contract"

interface CostEstimate {
  minGas: string
  avgGas: string
  maxGas: string
  minUsd: string
  avgUsd: string
  maxUsd: string
  trend: "up" | "down" | "stable"
}

interface RealTimeData {
  injPrice: number
  gasPrice: number
  gasDataByType?: Record<string, number> // Gas costs for each action type
  lastUpdated: string
}

const actionOptions = [
  {
    id: "transfer" as ActionType,
    name: "Token Transfer",
    icon: ArrowRightLeft,
    description: "Send tokens to another wallet",
  },
  { id: "swap" as ActionType, name: "Token Swap", icon: RefreshCw, description: "Exchange one token for another" },
  {
    id: "contract" as ActionType,
    name: "Contract Interaction",
    icon: FileCode,
    description: "Call a smart contract function",
  },
]

export function CostCalculator() {
  const [selectedAction, setSelectedAction] = useState<ActionType | null>(null)
  const [realTimeData, setRealTimeData] = useState<RealTimeData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchRealTimeData = async () => {
    try {
      let injPrice = 4.62
      let gasDataByType: Record<string, number> = {}

      // Fetch INJ price
      try {
        const priceResponse = await fetch('/api/price')
        if (priceResponse.ok) {
          const priceData = await priceResponse.json()
          injPrice = priceData.price
        }
      } catch (err) {
        console.warn('⚠️ Price API failed, using fallback')
      }

      // Fetch gas data for each action type
      const actionTypes: ActionType[] = ['transfer', 'swap', 'contract']
      
      for (const type of actionTypes) {
        try {
          const gasResponse = await fetch(`/api/gas?type=${type}`)
          if (gasResponse.ok) {
            const gasData = await gasResponse.json()
            gasDataByType[type] = gasData.avgGasUsed || 0.0001
            
            console.log(`📊 ${type} gas data:`, { 
              avgGasUsed: gasData.avgGasUsed,
              sampleSize: gasData.sampleSize
            })
          }
        } catch (err) {
          console.warn(`⚠️ Gas API failed for ${type}`)
          gasDataByType[type] = 0.0001
        }
      }

      setRealTimeData({
        injPrice,
        gasPrice: gasDataByType.transfer || 0.0001, // Default to transfer
        gasDataByType, // Store all types
        lastUpdated: new Date().toISOString(),
      })
      setLoading(false)
    } catch (error) {
      console.error('Error fetching real-time data:', error)
      setRealTimeData({
        injPrice: 4.62,
        gasPrice: 0.0001,
        lastUpdated: new Date().toISOString(),
      })
      setLoading(false)
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchRealTimeData()

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchRealTimeData, 30000)

    return () => clearInterval(interval)
  }, [])

  // Calculate real-time estimates using actual blockchain data per action type
  const calculateEstimate = (actionType: ActionType): CostEstimate => {
    const injPrice = realTimeData?.injPrice || 4.62
    
    // Use real gas data for this specific action type
    const realGasForType = realTimeData?.gasDataByType?.[actionType] || realTimeData?.gasPrice || 0.0001
    
    const avgGasAmount = realGasForType
    const minGasAmount = avgGasAmount * 0.8 // 20% less for best case
    const maxGasAmount = avgGasAmount * 1.3 // 30% more for worst case

    console.log('💰 Real gas costs from blockchain:', {
      actionType,
      injPrice,
      realGasForType,
      avgGasAmount,
      avgUsd: (avgGasAmount * injPrice).toFixed(4),
      source: realTimeData?.gasDataByType ? 'filtered-real-data' : 'fallback'
    })

    return {
      minGas: `${minGasAmount.toFixed(7)} INJ`,
      avgGas: `${avgGasAmount.toFixed(7)} INJ`,
      maxGas: `${maxGasAmount.toFixed(7)} INJ`,
      minUsd: `$${(minGasAmount * injPrice).toFixed(4)}`,
      avgUsd: `$${(avgGasAmount * injPrice).toFixed(4)}`,
      maxUsd: `$${(maxGasAmount * injPrice).toFixed(4)}`,
      trend: "stable",
    }
  }

  const estimate = selectedAction ? calculateEstimate(selectedAction) : null

  const TrendIcon = estimate?.trend === "up" ? TrendingUp : estimate?.trend === "down" ? TrendingDown : Minus
  const trendColor =
    estimate?.trend === "up"
      ? "text-rose-400"
      : estimate?.trend === "down"
        ? "text-emerald-400"
        : "text-muted-foreground"

  return (
    <div className="space-y-6">
      {/* Action Selector */}
      <FuturisticCard glowColor="cyan" delay={0.1}>
        <h3 className="mb-4 text-base sm:text-lg font-semibold text-foreground">Select Action Type</h3>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
          {actionOptions.map((action, index) => (
            <button
              key={action.id}
              onClick={() => setSelectedAction(action.id)}
              className={cn(
                "rounded-xl p-3 sm:p-4 text-left transition-all duration-300 border touch-manipulation",
                selectedAction === action.id
                  ? "bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_20px_rgba(0,255,255,0.2)]"
                  : "bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.05] hover:border-white/[0.15] active:bg-white/[0.08]",
              )}
            >
              <div
                className={cn(
                  "mb-3 inline-flex rounded-lg p-2",
                  selectedAction === action.id ? "bg-cyan-500/20" : "bg-white/[0.05]",
                )}
              >
                <action.icon
                  className={cn("h-5 w-5", selectedAction === action.id ? "text-cyan-400" : "text-muted-foreground")}
                />
              </div>
              <h4 className="text-sm sm:text-base font-medium text-foreground">{action.name}</h4>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{action.description}</p>
            </button>
          ))}
        </div>
      </FuturisticCard>

      {/* Cost Estimate Display */}
      {estimate && (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <FuturisticCard glowColor="emerald" delay={0.2} className="text-center">
            <p className="text-sm text-muted-foreground">Minimum Cost</p>
            <p className="mt-2 text-xl sm:text-2xl font-bold text-foreground break-all">{loading ? "..." : estimate.minGas}</p>
            <p className="text-sm text-muted-foreground">{loading ? "Loading..." : estimate.minUsd}</p>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/[0.05]">
              <div className="h-full w-1/4 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Best case scenario</p>
          </FuturisticCard>

          <FuturisticCard glowColor="cyan" delay={0.25} className="text-center">
            <p className="text-sm text-muted-foreground">Average Cost</p>
            <p className="mt-2 text-2xl sm:text-3xl font-bold text-cyan-400 break-all">{loading ? "..." : estimate.avgGas}</p>
            <p className="text-sm text-muted-foreground">{loading ? "Loading..." : estimate.avgUsd}</p>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/[0.05]">
              <div className="h-full w-1/2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(0,255,255,0.5)]" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Expected cost</p>
          </FuturisticCard>

          <FuturisticCard glowColor="magenta" delay={0.3} className="text-center">
            <p className="text-sm text-muted-foreground">Maximum Cost</p>
            <p className="mt-2 text-xl sm:text-2xl font-bold text-foreground break-all">{loading ? "..." : estimate.maxGas}</p>
            <p className="text-sm text-muted-foreground">{loading ? "Loading..." : estimate.maxUsd}</p>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/[0.05]">
              <div className="h-full w-3/4 rounded-full bg-fuchsia-500 shadow-[0_0_10px_rgba(255,0,255,0.5)]" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Peak congestion</p>
          </FuturisticCard>
        </div>
      )}

      {/* Gas Trend */}
      {estimate && (
        <FuturisticCard glowColor="cyan" delay={0.35}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-cyan-500/20 p-2">
                <Fuel className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-foreground">Gas Price Trend</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Current network conditions</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className={cn("flex items-center gap-2", trendColor)}>
                <TrendIcon className="h-5 w-5" />
                <span className="text-sm font-medium capitalize">{estimate.trend}</span>
              </div>
              {realTimeData && (
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs text-emerald-400">Live: ${realTimeData.injPrice.toFixed(2)}/INJ</span>
                </div>
              )}
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {estimate.trend === "up"
              ? "Gas prices are currently trending up due to high network activity. Consider waiting for lower fees."
              : estimate.trend === "down"
                ? "Gas prices are decreasing. This is a good time to execute transactions."
                : "Gas prices are stable. Network conditions are normal."}
          </p>
        </FuturisticCard>
      )}

      {/* Explanation */}
      <FuturisticCard glowColor="magenta" delay={0.4}>
        <h3 className="mb-3 font-semibold text-foreground">Understanding Gas Costs</h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            Gas fees on Injective are significantly lower than most blockchains, typically costing less than a cent per
            transaction.
          </p>
          <p>
            The actual cost depends on network congestion and transaction complexity. Simple transfers cost less than
            swaps or contract interactions.
          </p>
          <p>
            Injective uses a dynamic fee market similar to Ethereum, where fees adjust based on demand. During peak
            times, you may need to pay slightly higher fees for faster confirmation.
          </p>
        </div>
      </FuturisticCard>
    </div>
  )
}
