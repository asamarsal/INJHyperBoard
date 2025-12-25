"use client"

import { useEffect, useState } from "react"
import { BentoCard } from "@/components/ui/bento-card"
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react"

interface PriceData {
  price: number
  change24h: number
  timestamp: string
}

export function BentoPriceCard() {
  const [priceData, setPriceData] = useState<PriceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch("/api/price")
        if (!response.ok) {
          throw new Error("Failed to fetch price")
        }
        const data = await response.json()
        setPriceData(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchPrice()
    // Refresh price every 60 seconds
    const interval = setInterval(fetchPrice, 60000)

    return () => clearInterval(interval)
  }, [])

  const isPositive = priceData && priceData.change24h >= 0

  return (
    <BentoCard glowColor="magenta" size="md" delay={0.2}>
      <div className="flex h-full flex-col justify-between">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-fuchsia-500/70">INJ Price</span>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span className="text-xs text-emerald-400">Live</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-fuchsia-500/10 shadow-[0_0_20px_rgba(255,0,255,0.2)]">
            <DollarSign className="h-6 w-6 text-fuchsia-400" />
          </div>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-wider text-slate-500">Current Price</p>
            <div className="flex items-center gap-2">
              {loading ? (
                <span className="text-xl font-bold text-white">Loading...</span>
              ) : error ? (
                <span className="text-sm text-red-400">Error loading price</span>
              ) : priceData ? (
                <>
                  <span className="text-xl font-bold text-white">
                    ${priceData.price.toFixed(2)}
                  </span>
                  {isPositive ? (
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-400" />
                  )}
                </>
              ) : null}
            </div>
            {priceData && (
              <p className={`text-xs ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
                {isPositive ? "+" : ""}
                {priceData.change24h.toFixed(2)}% (24h)
              </p>
            )}
          </div>
        </div>
      </div>
    </BentoCard>
  )
}
