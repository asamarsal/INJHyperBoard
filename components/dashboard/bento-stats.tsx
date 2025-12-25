"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { BentoCard } from "@/components/ui/bento-card"
import { Activity, Fuel, Blocks, TrendingUp, Zap } from "lucide-react"

interface StatItemProps {
  icon: React.ElementType
  label: string
  value: string
  subtitle?: string
  trend?: "up" | "down" | "neutral"
  glowColor: "cyan" | "magenta"
  delay?: number
}

function StatItem({ icon: Icon, label, value, subtitle, trend, glowColor, delay = 0 }: StatItemProps) {
  const valueRef = useRef<HTMLSpanElement>(null)
  const iconRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const valueEl = valueRef.current
    const iconEl = iconRef.current
    if (!valueEl || !iconEl) return

    // Entrance animation
    gsap.fromTo(valueEl, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, delay: delay + 0.3 })

    // Icon pulse animation
    gsap.to(iconEl, {
      scale: 1.1,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    })

    return () => {
      gsap.killTweensOf([valueEl, iconEl])
    }
  }, [delay])

  return (
    <div className="flex items-center gap-4">
      <div
        ref={iconRef}
        className={`flex h-12 w-12 items-center justify-center rounded-xl ${
          glowColor === "cyan"
            ? "bg-cyan-500/10 shadow-[0_0_20px_rgba(0,255,255,0.2)]"
            : "bg-fuchsia-500/10 shadow-[0_0_20px_rgba(255,0,255,0.2)]"
        }`}
      >
        <Icon className={`h-6 w-6 ${glowColor === "cyan" ? "text-cyan-400" : "text-fuchsia-400"}`} />
      </div>
      <div className="flex-1">
        <p className="text-xs uppercase tracking-wider text-slate-500">{label}</p>
        <div className="flex items-center gap-2">
          <span ref={valueRef} className="text-xl font-bold text-white">
            {value}
          </span>
          {trend && (
            <TrendingUp
              className={`h-4 w-4 ${
                trend === "up" ? "text-emerald-400" : trend === "down" ? "rotate-180 text-red-400" : "text-slate-400"
              }`}
            />
          )}
        </div>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
    </div>
  )
}

export function BentoStats() {
  return (
    <>
      <BentoCard glowColor="cyan" size="md" delay={0.1}>
        <div className="flex h-full flex-col justify-between">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-cyan-500/70">Network</span>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span className="text-xs text-emerald-400">Online</span>
            </div>
          </div>
          <StatItem
            icon={Activity}
            label="Status"
            value="Operational"
            subtitle="All systems running"
            glowColor="cyan"
            delay={0.1}
          />
        </div>
      </BentoCard>

      <BentoCard glowColor="magenta" size="md" delay={0.2}>
        <div className="flex h-full flex-col justify-between">
          <span className="mb-4 text-xs uppercase tracking-wider text-fuchsia-500/70">Gas Price</span>
          <StatItem
            icon={Fuel}
            label="Average"
            value="0.0001 INJ"
            subtitle="~$0.002 USD"
            trend="down"
            glowColor="magenta"
            delay={0.2}
          />
        </div>
      </BentoCard>

      <BentoCard glowColor="cyan" size="md" delay={0.3}>
        <div className="flex h-full flex-col justify-between">
          <span className="mb-4 text-xs uppercase tracking-wider text-cyan-500/70">Latest Block</span>
          <StatItem
            icon={Blocks}
            label="Height"
            value="#78,234,567"
            subtitle="2 seconds ago"
            trend="up"
            glowColor="cyan"
            delay={0.3}
          />
        </div>
      </BentoCard>

      <BentoCard glowColor="magenta" size="md" delay={0.4}>
        <div className="flex h-full flex-col justify-between">
          <span className="mb-4 text-xs uppercase tracking-wider text-fuchsia-500/70">Performance</span>
          <StatItem
            icon={Zap}
            label="Block Time"
            value="~1.2s"
            subtitle="Instant finality"
            glowColor="magenta"
            delay={0.4}
          />
        </div>
      </BentoCard>
    </>
  )
}
