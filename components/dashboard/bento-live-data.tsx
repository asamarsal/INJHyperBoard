"use client"

import { useRef, useEffect, useState } from "react"
import { gsap } from "gsap"
import { BentoCard } from "@/components/ui/bento-card"
import { TrendingUp, Cpu, Wifi } from "lucide-react"

export function BentoLiveData() {
  const [data, setData] = useState({
    tps: 0,
    validators: 0,
    uptime: 0,
  })
  const tpsRef = useRef<HTMLSpanElement>(null)
  const validatorsRef = useRef<HTMLSpanElement>(null)
  const uptimeRef = useRef<HTMLSpanElement>(null)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Animate counters
    const tl = gsap.timeline()

    tl.to(data, {
      tps: 10000,
      duration: 2,
      ease: "power2.out",
      onUpdate: () => {
        if (tpsRef.current) {
          tpsRef.current.textContent = Math.floor(data.tps).toLocaleString()
        }
      },
    })
      .to(
        data,
        {
          validators: 150,
          duration: 1.5,
          ease: "power2.out",
          onUpdate: () => {
            if (validatorsRef.current) {
              validatorsRef.current.textContent = Math.floor(data.validators).toString()
            }
          },
        },
        "-=1.5",
      )
      .to(
        data,
        {
          uptime: 99.99,
          duration: 1.5,
          ease: "power2.out",
          onUpdate: () => {
            if (uptimeRef.current) {
              uptimeRef.current.textContent = data.uptime.toFixed(2) + "%"
            }
          },
        },
        "-=1.5",
      )

    // Animate progress bar
    if (barRef.current) {
      gsap.fromTo(barRef.current, { width: "0%" }, { width: "99.99%", duration: 2, ease: "power2.out" })
    }

    // Pulsing animation for live indicator
    const pulseInterval = setInterval(() => {
      setData((prev) => ({
        ...prev,
        tps: 10000 + Math.floor(Math.random() * 500 - 250),
      }))
    }, 2000)

    return () => {
      clearInterval(pulseInterval)
      gsap.killTweensOf(data)
    }
  }, [])

  return (
    <BentoCard glowColor="cyan" size="md" delay={0.6} className="md:row-span-2">
      <div className="flex h-full flex-col">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-[var(--font-orbitron)] text-sm font-bold uppercase tracking-wider text-cyan-400">
            Live Data
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
              0
            </span>
          </div>

          {/* Validators */}
          <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
            <div className="mb-2 flex items-center gap-2">
              <Cpu className="h-4 w-4 text-fuchsia-400" />
              <span className="text-xs uppercase tracking-wider text-slate-500">Active Validators</span>
            </div>
            <span ref={validatorsRef} className="text-3xl font-bold text-white">
              0
            </span>
          </div>

          {/* Uptime */}
          <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
            <div className="mb-2 flex items-center gap-2">
              <Wifi className="h-4 w-4 text-emerald-400" />
              <span className="text-xs uppercase tracking-wider text-slate-500">Network Uptime</span>
            </div>
            <span ref={uptimeRef} className="text-3xl font-bold text-white">
              0%
            </span>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div ref={barRef} className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500" />
            </div>
          </div>
        </div>
      </div>
    </BentoCard>
  )
}
