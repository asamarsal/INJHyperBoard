"use client"

import { useRef, useEffect, useState } from "react"
import { gsap } from "gsap"
import { BentoCard } from "@/components/ui/bento-card"
import { TrendingUp, Cpu, Wifi } from "lucide-react"

interface NetworkStats {
  tps: number
  validators: number
  uptime: number
}

export function BentoLiveData() {
  const [data, setData] = useState<NetworkStats>({
    tps: 0,
    validators: 0,
    uptime: 0,
  })
  const [loading, setLoading] = useState(true)
  const tpsRef = useRef<HTMLSpanElement>(null)
  const validatorsRef = useRef<HTMLSpanElement>(null)
  const uptimeRef = useRef<HTMLSpanElement>(null)
  const barRef = useRef<HTMLDivElement>(null)

  // Fetch real-time network stats
  useEffect(() => {
    const fetchNetworkStats = async () => {
      try {
        const response = await fetch('/api/network-stats')
        if (response.ok) {
          const stats = await response.json()
          
          // Animate to new values
          gsap.to(data, {
            tps: stats.tps,
            validators: stats.validators,
            uptime: stats.uptime,
            duration: 1.5,
            ease: "power2.out",
            onUpdate: () => {
              if (tpsRef.current) {
                tpsRef.current.textContent = Math.floor(data.tps).toLocaleString()
              }
              if (validatorsRef.current) {
                validatorsRef.current.textContent = Math.floor(data.validators).toString()
              }
              if (uptimeRef.current) {
                uptimeRef.current.textContent = data.uptime.toFixed(2) + "%"
              }
            },
          })

          setData(stats)
          setLoading(false)

          // Animate progress bar
          if (barRef.current) {
            gsap.to(barRef.current, { width: `${stats.uptime}%`, duration: 1.5, ease: "power2.out" })
          }
        }
      } catch (error) {
        console.error('Error fetching network stats:', error)
        setLoading(false)
      }
    }

    // Initial fetch
    fetchNetworkStats()

    // Refresh every 10 seconds
    const interval = setInterval(fetchNetworkStats, 10000)

    return () => {
      clearInterval(interval)
      gsap.killTweensOf(data)
    }
  }, [])

  return (
    <BentoCard glowColor="cyan" size="md" delay={0.6} className="md:row-span-2">
      <div className="flex h-full flex-col">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-[var(--font-orbitron)] text-sm font-bold uppercase tracking-wider text-cyan-400">
            Realtime Data
          </h3>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span className="text-xs text-emerald-400">Live</span>
          </div>
        </div>

        <div className="flex-1 space-y-6">
          {/* TPS */}
          <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
            <div className="mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-cyan-400" />
              <span className="text-xs uppercase tracking-wider text-slate-500">Transactions/sec</span>
            </div>
            <span ref={tpsRef} className="text-3xl font-bold text-white">
              {loading ? "..." : "0"}
            </span>
          </div>

          {/* Validators */}
          <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
            <div className="mb-2 flex items-center gap-2">
              <Cpu className="h-4 w-4 text-fuchsia-400" />
              <span className="text-xs uppercase tracking-wider text-slate-500">Active Validators</span>
            </div>
            <span ref={validatorsRef} className="text-3xl font-bold text-white">
              {loading ? "..." : "0"}
            </span>
          </div>

          {/* Uptime */}
          <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
            <div className="mb-2 flex items-center gap-2">
              <Wifi className="h-4 w-4 text-emerald-400" />
              <span className="text-xs uppercase tracking-wider text-slate-500">Network Uptime</span>
            </div>
            <span ref={uptimeRef} className="text-3xl font-bold text-white">
              {loading ? "..." : "0%"}
            </span>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div ref={barRef} className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500" style={{ width: '0%' }} />
            </div>
          </div>
        </div>
      </div>
    </BentoCard>
  )
}
