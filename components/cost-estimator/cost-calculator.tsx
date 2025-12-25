"use client"

import { useState } from "react"
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

const costEstimates: Record<ActionType, CostEstimate> = {
  transfer: {
    minGas: "0.00005 INJ",
    avgGas: "0.0001 INJ",
    maxGas: "0.0002 INJ",
    minUsd: "$0.001",
    avgUsd: "$0.002",
    maxUsd: "$0.004",
    trend: "stable",
  },
  swap: {
    minGas: "0.0002 INJ",
    avgGas: "0.0005 INJ",
    maxGas: "0.001 INJ",
    minUsd: "$0.004",
    avgUsd: "$0.01",
    maxUsd: "$0.02",
    trend: "down",
  },
  contract: {
    minGas: "0.0005 INJ",
    avgGas: "0.002 INJ",
    maxGas: "0.01 INJ",
    minUsd: "$0.01",
    avgUsd: "$0.04",
    maxUsd: "$0.20",
    trend: "up",
  },
}

export function CostCalculator() {
  const [selectedAction, setSelectedAction] = useState<ActionType | null>(null)
  const estimate = selectedAction ? costEstimates[selectedAction] : null

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
        <h3 className="mb-4 text-lg font-semibold text-foreground">Select Action Type</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {actionOptions.map((action, index) => (
            <button
              key={action.id}
              onClick={() => setSelectedAction(action.id)}
              className={cn(
                "rounded-xl p-4 text-left transition-all duration-300 border",
                selectedAction === action.id
                  ? "bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_20px_rgba(0,255,255,0.2)]"
                  : "bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.05] hover:border-white/[0.15]",
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
              <h4 className="font-medium text-foreground">{action.name}</h4>
              <p className="mt-1 text-xs text-muted-foreground">{action.description}</p>
            </button>
          ))}
        </div>
      </FuturisticCard>

      {/* Cost Estimate Display */}
      {estimate && (
        <div className="grid gap-4 lg:grid-cols-3">
          <FuturisticCard glowColor="emerald" delay={0.2} className="text-center">
            <p className="text-sm text-muted-foreground">Minimum Cost</p>
            <p className="mt-2 text-2xl font-bold text-foreground">{estimate.minGas}</p>
            <p className="text-sm text-muted-foreground">{estimate.minUsd}</p>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/[0.05]">
              <div className="h-full w-1/4 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Best case scenario</p>
          </FuturisticCard>

          <FuturisticCard glowColor="cyan" delay={0.25} className="text-center">
            <p className="text-sm text-muted-foreground">Average Cost</p>
            <p className="mt-2 text-3xl font-bold text-cyan-400">{estimate.avgGas}</p>
            <p className="text-sm text-muted-foreground">{estimate.avgUsd}</p>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/[0.05]">
              <div className="h-full w-1/2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(0,255,255,0.5)]" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Expected cost</p>
          </FuturisticCard>

          <FuturisticCard glowColor="magenta" delay={0.3} className="text-center">
            <p className="text-sm text-muted-foreground">Maximum Cost</p>
            <p className="mt-2 text-2xl font-bold text-foreground">{estimate.maxGas}</p>
            <p className="text-sm text-muted-foreground">{estimate.maxUsd}</p>
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-cyan-500/20 p-2">
                <Fuel className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Gas Price Trend</h3>
                <p className="text-sm text-muted-foreground">Current network conditions</p>
              </div>
            </div>
            <div className={cn("flex items-center gap-2", trendColor)}>
              <TrendIcon className="h-5 w-5" />
              <span className="text-sm font-medium capitalize">{estimate.trend}</span>
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
