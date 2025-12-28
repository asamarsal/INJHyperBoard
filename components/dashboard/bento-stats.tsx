"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { BentoCard } from "@/components/ui/bento-card"
import { Activity, Fuel, Blocks, TrendingUp, Zap, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"

interface StatItemProps {
  icon: React.ElementType
  label: string
  value: string
  subtitle?: string
  trend?: "up" | "down" | "neutral"
  glowColor: "cyan" | "magenta"
  delay?: number
  compact?: boolean
}

function StatItem({ icon: Icon, label, value, subtitle, trend, glowColor, delay = 0, compact = false }: StatItemProps) {
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
    <div className={`flex items-center ${compact ? 'gap-2' : 'gap-4'}`}>
      <div
        ref={iconRef}
        className={`flex ${compact ? 'h-8 w-8' : 'h-12 w-12'} items-center justify-center rounded-xl ${
          glowColor === "cyan"
            ? "bg-cyan-500/10 shadow-[0_0_20px_rgba(0,255,255,0.2)]"
            : "bg-fuchsia-500/10 shadow-[0_0_20px_rgba(255,0,255,0.2)]"
        }`}
      >
        <Icon className={`${compact ? 'h-4 w-4' : 'h-6 w-6'} ${glowColor === "cyan" ? "text-cyan-400" : "text-fuchsia-400"}`} />
      </div>
      <div className="flex-1">
        <p className={`${compact ? 'text-[10px]' : 'text-xs'} uppercase tracking-wider text-slate-500`}>{label}</p>
        <div className="flex items-center gap-2">
          <span ref={valueRef} className={`${compact ? 'text-sm' : 'text-xl'} font-bold text-white`}>
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
        {subtitle && <p className={`${compact ? 'text-[10px]' : 'text-xs'} text-slate-500`}>{subtitle}</p>}
      </div>
    </div>
  )
}

export function BentoStats() {
  return (
    <>
      {/* Connect Wallet Card */}
      <BentoCard glowColor="cyan" size="md" delay={0.1}>
        <div className="flex h-full flex-col justify-between">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-cyan-500/70">Wallet</span>
            <Wallet className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-xs text-slate-500 mb-1">Connect your wallet</p>
              <p className="text-sm text-white font-semibold">Get started with Injective</p>
            </div>
            <Button 
              className="w-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]"
              disabled
            >
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </Button>
          </div>
        </div>
      </BentoCard>

      {/* Performance Card - Merged Gas Price + Block Time (LEFT) */}
      <BentoCard glowColor="magenta" size="md" delay={0.2}>
        <div className="flex h-full flex-col justify-between">
          <span className="mb-3 text-xs uppercase tracking-wider text-fuchsia-500/70">Performance</span>
          <div className="space-y-3">
            <StatItem
              icon={Fuel}
              label="Gas Price"
              value="0.0001 INJ"
              subtitle="~$0.002 USD"
              trend="down"
              glowColor="magenta"
              delay={0.2}
              compact={true}
            />
            <StatItem
              icon={Zap}
              label="Block Time"
              value="~1.2s"
              subtitle="Instant finality"
              glowColor="magenta"
              delay={0.3}
              compact={true}
            />
          </div>
        </div>
      </BentoCard>

      {/* Network Status Card (RIGHT) */}
      <BentoCard glowColor="cyan" size="md" delay={0.3}>
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
            delay={0.3}
          />
        </div>
      </BentoCard>
    </>
  )
}
