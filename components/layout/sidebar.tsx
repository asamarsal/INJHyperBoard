"use client"

import { useRef, useEffect, useLayoutEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { gsap } from "gsap"
import {
  LayoutDashboard,
  MessageSquare,
  ArrowRightLeft,
  Calculator,
  Wallet,
  FileCode,
  Activity,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { RobotAvatar } from "@/components/ui/robot-avatar"

import { useSidebar } from "@/components/providers/sidebar-provider"

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Chatbot", href: "/chatbot", icon: MessageSquare },
  { name: "Transaction Preview", href: "/transaction", icon: ArrowRightLeft },
  { name: "Cost Estimator", href: "/cost-estimator", icon: Calculator },
  { name: "Wallet Activity", href: "/wallet", icon: Wallet },
  { name: "Contract Explorer", href: "/contracts", icon: FileCode },
  { name: "Network Status", href: "/network", icon: Activity },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isCollapsed, toggleSidebar } = useSidebar()
  const sidebarRef = useRef<HTMLElement>(null)
  const navItemsRef = useRef<(HTMLAnchorElement | null)[]>([])
  const robotRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const logoTextRef = useRef<HTMLDivElement>(null)
  const toggleButtonRef = useRef<HTMLButtonElement>(null)

  // Initial entrance animation
  useEffect(() => {
    const sidebar = sidebarRef.current
    if (!sidebar) return

    gsap.fromTo(sidebar, { x: -100, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" })

    gsap.fromTo(
      navItemsRef.current.filter(Boolean),
      { x: -30, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        delay: 0.3,
        ease: "power2.out",
      },
    )
  }, [])

  // Collapse/Expand animation
  useLayoutEffect(() => {
    const sidebar = sidebarRef.current
    const robot = robotRef.current
    const logo = logoRef.current
    const logoText = logoTextRef.current
    if (!sidebar || !robot || !logo || !logoText) return

    const ctx = gsap.context(() => {
      if (isCollapsed) {
        // Collapse animation
        gsap.to(sidebar, {
          width: 80,
          duration: 0.5,
          ease: "power3.inOut",
        })

        // Robot flies out animation
        gsap.to(robot, {
          x: 300,
          y: 100,
          scale: 0,
          opacity: 0,
          rotation: 360,
          duration: 0.6,
          ease: "power2.in",
        })

        gsap.fromTo(
          logo,
          { scale: 0, opacity: 0, rotation: -180 },
          {
            scale: 1,
            opacity: 1,
            rotation: 0,
            duration: 0.5,
            delay: 0.3,
            ease: "back.out(1.7)",
          },
        )

        // Hide logo text
        gsap.to(logoText, {
          opacity: 0,
          x: -20,
          duration: 0.3,
        })

        // Hide nav text
        navItemsRef.current.filter(Boolean).forEach((item) => {
          const textSpan = item?.querySelector("span")
          if (textSpan) {
            gsap.to(textSpan, { opacity: 0, width: 0, duration: 0.3 })
          }
        })
      } else {
        // Expand animation
        gsap.to(sidebar, {
          width: 256,
          duration: 0.5,
          ease: "power3.inOut",
        })

        gsap.to(logo, {
          scale: 0,
          opacity: 0,
          rotation: 180,
          duration: 0.3,
          ease: "power2.in",
        })

        gsap.fromTo(
          robot,
          { x: 300, y: 100, scale: 0, opacity: 0, rotation: -360 },
          {
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            rotation: 0,
            duration: 0.8,
            ease: "back.out(1.7)",
            delay: 0.2,
          },
        )

        // Show logo text
        gsap.to(logoText, {
          opacity: 1,
          x: 0,
          duration: 0.4,
          delay: 0.3,
        })

        // Show nav text
        navItemsRef.current.filter(Boolean).forEach((item, index) => {
          const textSpan = item?.querySelector("span")
          if (textSpan) {
            gsap.to(textSpan, {
              opacity: 1,
              width: "auto",
              duration: 0.3,
              delay: 0.1 * index,
            })
          }
        })
      }
    })

    return () => ctx.revert()
  }, [isCollapsed])

  return (
    <aside
      ref={sidebarRef}
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-white/[0.05] bg-[#030712]/95 backdrop-blur-xl",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div
          className={cn(
            "flex h-20 items-center border-b border-white/[0.05]",
            isCollapsed ? "justify-center px-2" : "gap-3 px-6",
          )}
        >
          <div className="relative flex-shrink-0">
            <div ref={robotRef}>
              <RobotAvatar size="sm" variant="cyan" />
            </div>
            {/* Injective logo - shown when collapsed */}
            <div ref={logoRef} className="absolute left-0 top-0 opacity-0">
              <Image 
                src="/images/injective-inj-logo.png" 
                alt="Injective Logo" 
                width={40} 
                height={40}
                className="object-contain"
              />
            </div>
          </div>
          <div ref={logoTextRef} className={cn("overflow-hidden", isCollapsed && "hidden")}>
            <h1 className="font-[var(--font-orbitron)] text-sm font-bold tracking-wider text-cyan-400">INJECTIVE</h1>
            <p className="text-xs text-slate-500">Control Center</p>
          </div>
        </div>

        {/* Toggle Button */}
        <button
          ref={toggleButtonRef}
          onClick={toggleSidebar}
          className="absolute -right-3 top-24 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-pink-500/50 bg-slate-900 text-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.3)] transition-all hover:bg-pink-500/20 hover:shadow-[0_0_20px_rgba(236,72,153,0.5)]"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>

        {/* Navigation */}
        <nav className={cn("flex-1 space-y-1", isCollapsed ? "p-2" : "p-4")}>
          {navItems.map((item, index) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                ref={(el) => {
                  navItemsRef.current[index] = el
                }}
                title={isCollapsed ? item.name : undefined}
                className={cn(
                  "group relative flex items-center rounded-xl text-sm font-medium transition-all duration-300",
                  isCollapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-3",
                  isActive ? "bg-pink-500/10 text-pink-400" : "text-slate-400 hover:bg-white/[0.03] hover:text-white",
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.8)]" />
                )}

                <item.icon
                  className={cn(
                    "h-5 w-5 flex-shrink-0 transition-all duration-300",
                    isActive
                      ? "text-pink-400 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]"
                      : "group-hover:text-pink-400 group-hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]",
                  )}
                />
                <span className={cn("overflow-hidden whitespace-nowrap", isCollapsed && "hidden")}>{item.name}</span>

                {/* Hover glow effect */}
                <div
                  className={cn(
                    "pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300",
                    "group-hover:opacity-100",
                    "bg-gradient-to-r from-pink-500/5 to-transparent",
                  )}
                />
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className={cn("border-t border-white/[0.05]", isCollapsed ? "p-2" : "p-4")}>
          <div className={cn("rounded-xl border border-white/[0.05] bg-white/[0.02]", isCollapsed ? "p-2" : "p-4")}>
            <div className={cn("flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                {!isCollapsed && <span className="text-xs text-slate-400">Network Status</span>}
              </div>
              {!isCollapsed && <span className="text-xs font-medium text-emerald-400">Online</span>}
            </div>
            {!isCollapsed && (
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div className="h-full w-[99%] rounded-full bg-gradient-to-r from-pink-500 to-emerald-500" />
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}
