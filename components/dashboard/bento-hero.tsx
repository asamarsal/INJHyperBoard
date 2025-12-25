"use client"

import { useRef, useEffect, useLayoutEffect } from "react"
import { gsap } from "gsap"
import { BentoCard } from "@/components/ui/bento-card"
import { RobotAvatar } from "@/components/ui/robot-avatar"
import { HologramText } from "@/components/ui/hologram-text"
import { ExternalLink, Sparkles } from "lucide-react"
import { useSidebar } from "@/components/providers/sidebar-provider"
import Image from "next/image"

export function BentoHero() {
  const { isCollapsed } = useSidebar()
  const containerRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)
  const robotRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const particles = particlesRef.current
    if (!container || !particles) return

    // Create floating particles
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement("div")
      particle.className = "absolute h-1 w-1 rounded-full bg-cyan-500/30"
      particle.style.left = `${Math.random() * 100}%`
      particle.style.top = `${Math.random() * 100}%`
      particles.appendChild(particle)

      gsap.to(particle, {
        y: -100,
        opacity: 0,
        duration: 3 + Math.random() * 2,
        repeat: -1,
        delay: Math.random() * 2,
        ease: "power1.out",
      })
    }

    return () => {
      particles.innerHTML = ""
    }
  }, [])

  useLayoutEffect(() => {
    const robot = robotRef.current
    const logo = logoRef.current
    if (!robot || !logo) return

    const ctx = gsap.context(() => {
      if (isCollapsed) {
        // Logo flies out to the right
        gsap.to(logo, {
          x: 100,
          scale: 0,
          opacity: 0,
          rotation: 180,
          duration: 0.5,
          ease: "power2.in",
        })

        // Robot flies in from left (coming from sidebar)
        gsap.fromTo(
          robot,
          {
            x: -200,
            y: -50,
            scale: 0.3,
            opacity: 0,
            rotation: -360,
          },
          {
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            rotation: 0,
            duration: 0.8,
            ease: "back.out(1.7)",
            delay: 0.3,
          },
        )
      } else {
        // Robot flies out to left (going to sidebar)
        gsap.to(robot, {
          x: -200,
          y: -50,
          scale: 0.3,
          opacity: 0,
          rotation: -360,
          duration: 0.6,
          ease: "power2.in",
        })

        // Logo appears with animation
        gsap.fromTo(
          logo,
          {
            x: 100,
            scale: 0,
            opacity: 0,
            rotation: -180,
          },
          {
            x: 0,
            scale: 1,
            opacity: 1,
            rotation: 0,
            duration: 0.7,
            ease: "back.out(1.7)",
            delay: 0.3,
          },
        )
      }
    })

    return () => ctx.revert()
  }, [isCollapsed])

  return (
    <BentoCard glowColor="cyan" size="lg" className="relative md:col-span-2 md:row-span-2 overflow-hidden">
      {/* Background particles */}
      <div ref={particlesRef} className="pointer-events-none absolute inset-0" />

      {/* Hexagon grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 17.32V52.68L30 70L0 52.68V17.32L30 0z' fill='none' stroke='%2300ffff' strokeWidth='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />

      <div ref={containerRef} className="relative z-10 flex h-full flex-col justify-between p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
          <div>
            <div className="mb-3 sm:mb-4 flex items-center gap-8 sm:gap-6">
              <div className="relative h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0">
                {/* Robot - visible when sidebar is collapsed */}
                <div ref={robotRef} className="absolute left-0 top-0">
                  <RobotAvatar size="md" variant="cyan" />
                </div>
                <div ref={logoRef} className="absolute left-0 top-0 flex h-20 w-20 items-center justify-center">
                  <div className="relative h-16 w-16">
                    <Image
                      src="/images/injective-inj-logo.png"
                      alt="Injective Protocol Logo"
                      fill
                      className="object-contain drop-shadow-[0_0_10px_rgba(0,200,255,0.5)]"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] sm:text-xs uppercase tracking-widest text-cyan-500/70">AI-Powered</span>
                <HologramText size="xl" variant="cyan">
                  INJECTIVE
                </HologramText>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-8">Control Center</p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span className="text-xs font-medium text-cyan-400">Web3 Ready</span>
          </div>
        </div>

        <div className="mt-4 sm:mt-6">
          <p className="text-xs sm:text-sm leading-relaxed text-slate-300 line-clamp-3 sm:line-clamp-none">
            Experience the future of decentralized finance with Injective. Lightning-fast transactions, near-zero fees,
            and unlimited DeFi possibilities powered by AI assistance.
          </p>
          <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
            <a
              href="https://docs.injective.network"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 rounded-lg border border-cyan-500/50 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-400 transition-all hover:bg-cyan-500/20 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]"
            >
              Documentation
              <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="https://injective.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 rounded-lg border border-fuchsia-500/50 bg-fuchsia-500/10 px-4 py-2 text-sm font-medium text-fuchsia-400 transition-all hover:bg-fuchsia-500/20 hover:shadow-[0_0_20px_rgba(255,0,255,0.3)]"
            >
              Learn More
              <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </BentoCard>
  )
}
