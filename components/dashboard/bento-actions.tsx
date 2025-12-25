"use client"

import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import Link from "next/link"
import { BentoCard } from "@/components/ui/bento-card"
import { MessageSquare, ArrowRightLeft, Calculator, Wallet, FileCode, Activity, ChevronRight } from "lucide-react"

const actions = [
  {
    title: "AI Chatbot",
    description: "Ask anything about Injective blockchain",
    href: "/chatbot",
    icon: MessageSquare,
    glowColor: "cyan" as const,
  },
  {
    title: "Transaction Preview",
    description: "Analyze and simulate transactions",
    href: "/transaction",
    icon: ArrowRightLeft,
    glowColor: "magenta" as const,
  },
  {
    title: "Cost Estimator",
    description: "Calculate gas fees and costs",
    href: "/cost-estimator",
    icon: Calculator,
    glowColor: "cyan" as const,
  },
  {
    title: "Wallet Activity",
    description: "Track your wallet transactions",
    href: "/wallet",
    icon: Wallet,
    glowColor: "magenta" as const,
  },
  {
    title: "Contract Explorer",
    description: "Interact with smart contracts",
    href: "/contracts",
    icon: FileCode,
    glowColor: "cyan" as const,
  },
  {
    title: "Network Status",
    description: "Real-time network monitoring",
    href: "/network",
    icon: Activity,
    glowColor: "magenta" as const,
  },
]

interface ActionItemProps {
  action: (typeof actions)[0]
  index: number
}

function ActionItem({ action, index }: ActionItemProps) {
  const itemRef = useRef<HTMLAnchorElement>(null)
  const arrowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const item = itemRef.current
    const arrow = arrowRef.current
    if (!item || !arrow) return

    const handleMouseEnter = () => {
      gsap.to(arrow, {
        x: 5,
        opacity: 1,
        duration: 0.3,
      })
      gsap.to(item, {
        x: 5,
        duration: 0.3,
      })
    }

    const handleMouseLeave = () => {
      gsap.to(arrow, {
        x: 0,
        opacity: 0.5,
        duration: 0.3,
      })
      gsap.to(item, {
        x: 0,
        duration: 0.3,
      })
    }

    item.addEventListener("mouseenter", handleMouseEnter)
    item.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      item.removeEventListener("mouseenter", handleMouseEnter)
      item.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <Link
      ref={itemRef}
      href={action.href}
      className="group flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.02] p-4 transition-all duration-300 hover:border-white/[0.1] hover:bg-white/[0.05]"
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${
            action.glowColor === "cyan"
              ? "bg-cyan-500/10 group-hover:shadow-[0_0_15px_rgba(0,255,255,0.3)]"
              : "bg-fuchsia-500/10 group-hover:shadow-[0_0_15px_rgba(255,0,255,0.3)]"
          } transition-shadow duration-300`}
        >
          <action.icon className={`h-5 w-5 ${action.glowColor === "cyan" ? "text-cyan-400" : "text-fuchsia-400"}`} />
        </div>
        <div>
          <p className="font-medium text-white">{action.title}</p>
          <p className="text-xs text-slate-500">{action.description}</p>
        </div>
      </div>
      <div ref={arrowRef} className="opacity-50">
        <ChevronRight className="h-5 w-5 text-slate-400" />
      </div>
    </Link>
  )
}

export function BentoActions() {
  return (
    <BentoCard glowColor="purple" size="md" delay={0.5} className="col-span-2 row-span-2">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-[var(--font-orbitron)] text-lg font-bold text-white">Quick Actions</h3>
        <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs text-violet-400">
          6 Features
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {actions.map((action, index) => (
          <ActionItem key={action.href} action={action} index={index} />
        ))}
      </div>
    </BentoCard>
  )
}

