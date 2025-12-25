"use client"

import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { cn } from "@/lib/utils"

interface InjectiveLogoProps {
  size?: "sm" | "md" | "lg"
  animated?: boolean
  className?: string
}

export function InjectiveLogo({ size = "md", animated = true, className }: InjectiveLogoProps) {
  const logoRef = useRef<SVGSVGElement>(null)
  const leftWaveRef = useRef<SVGPathElement>(null)
  const rightWaveRef = useRef<SVGPathElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-16 w-16",
    lg: "h-20 w-20",
  }

  useEffect(() => {
    if (!animated) return
    const logo = logoRef.current
    const leftWave = leftWaveRef.current
    const rightWave = rightWaveRef.current
    const glow = glowRef.current
    if (!logo || !leftWave || !rightWave || !glow) return

    const ctx = gsap.context(() => {
      // Continuous rotation glow
      gsap.to(glow, {
        rotation: 360,
        duration: 8,
        repeat: -1,
        ease: "none",
      })

      // Subtle pulse animation
      gsap.to(logo, {
        scale: 1.05,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })

      // Wave shimmer effect
      gsap.to([leftWave, rightWave], {
        filter: "brightness(1.3)",
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.3,
      })
    })

    return () => ctx.revert()
  }, [animated])

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      {/* Glow effect */}
      <div
        ref={glowRef}
        className="absolute inset-0 rounded-full opacity-50 blur-xl"
        style={{
          background: "conic-gradient(from 0deg, #00d4ff, #0099ff, #00d4ff)",
        }}
      />

      {/* Logo SVG */}
      <svg
        ref={logoRef}
        viewBox="0 0 100 100"
        className="relative z-10 h-full w-full drop-shadow-[0_0_15px_rgba(0,212,255,0.5)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="leftGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0099ff" />
            <stop offset="100%" stopColor="#00b8ff" />
          </linearGradient>
          <linearGradient id="rightGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00c8ff" />
            <stop offset="100%" stopColor="#00ffff" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Left wave */}
        <path
          ref={leftWaveRef}
          d="M35 10 C15 10, 5 30, 5 50 C5 70, 15 90, 35 90 C45 90, 50 80, 50 70 C50 55, 40 50, 35 50 C25 50, 20 60, 25 70"
          stroke="url(#leftGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
          filter="url(#glow)"
        />

        {/* Right wave */}
        <path
          ref={rightWaveRef}
          d="M65 90 C85 90, 95 70, 95 50 C95 30, 85 10, 65 10 C55 10, 50 20, 50 30 C50 45, 60 50, 65 50 C75 50, 80 40, 75 30"
          stroke="url(#rightGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
          filter="url(#glow)"
        />
      </svg>
    </div>
  )
}
