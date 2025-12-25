"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { gsap } from "gsap"

interface FuturisticCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glowColor?: "cyan" | "magenta" | "emerald" | "amber"
  children: React.ReactNode
  delay?: number
  enableTilt?: boolean
  enableCornerLines?: boolean
}

export function FuturisticCard({
  glowColor = "cyan",
  className,
  children,
  delay = 0,
  enableTilt = true,
  enableCornerLines = true,
  ...props
}: FuturisticCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const borderRef = useRef<HTMLDivElement>(null)
  const topLeftLineH = useRef<HTMLDivElement>(null)
  const topLeftLineV = useRef<HTMLDivElement>(null)
  const bottomRightLineH = useRef<HTMLDivElement>(null)
  const bottomRightLineV = useRef<HTMLDivElement>(null)
  const [isNear, setIsNear] = useState(false)

  useEffect(() => {
    const card = cardRef.current
    const glow = glowRef.current
    const border = borderRef.current
    if (!card || !glow || !border) return

    // Initial entrance animation
    gsap.fromTo(
      card,
      { opacity: 0, y: 30, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        delay: delay,
        ease: "power3.out",
      },
    )

    // Mouse move handler for 3D tilt effect and glow
    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2

      if (enableTilt) {
        const rotateX = (y - centerY) / 25
        const rotateY = (centerX - x) / 25

        gsap.to(card, {
          rotateX: rotateX,
          rotateY: rotateY,
          transformPerspective: 1000,
          duration: 0.4,
          ease: "power2.out",
        })
      }

      // Move glow to cursor position
      gsap.to(glow, {
        x: x - 150,
        y: y - 150,
        opacity: 0.8,
        duration: 0.3,
      })

      // Animate border glow
      gsap.to(border, {
        opacity: 1,
        duration: 0.3,
      })

      // Animate corner lines
      if (enableCornerLines) {
        gsap.to([topLeftLineH.current, topLeftLineV.current], {
          width: topLeftLineH.current ? "40px" : undefined,
          height: topLeftLineV.current ? "40px" : undefined,
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        })
        gsap.to([bottomRightLineH.current, bottomRightLineV.current], {
          width: bottomRightLineH.current ? "40px" : undefined,
          height: bottomRightLineV.current ? "40px" : undefined,
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        })
      }
    }

    const handleMouseLeave = () => {
      if (enableTilt) {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.5,
          ease: "power2.out",
        })
      }
      gsap.to(glow, {
        opacity: 0,
        duration: 0.3,
      })
      gsap.to(border, {
        opacity: 0.2,
        duration: 0.3,
      })

      // Reset corner lines
      if (enableCornerLines) {
        gsap.to([topLeftLineH.current, topLeftLineV.current], {
          width: topLeftLineH.current ? "20px" : undefined,
          height: topLeftLineV.current ? "20px" : undefined,
          opacity: 0.5,
          duration: 0.3,
          ease: "power2.out",
        })
        gsap.to([bottomRightLineH.current, bottomRightLineV.current], {
          width: bottomRightLineH.current ? "20px" : undefined,
          height: bottomRightLineV.current ? "20px" : undefined,
          opacity: 0.5,
          duration: 0.3,
          ease: "power2.out",
        })
      }
    }

    // Proximity detection for corner lines animation
    const handleGlobalMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const buffer = 100
      const isNearCard =
        e.clientX >= rect.left - buffer &&
        e.clientX <= rect.right + buffer &&
        e.clientY >= rect.top - buffer &&
        e.clientY <= rect.bottom + buffer

      setIsNear(isNearCard)
    }

    card.addEventListener("mousemove", handleMouseMove)
    card.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mousemove", handleGlobalMouseMove)

    return () => {
      card.removeEventListener("mousemove", handleMouseMove)
      card.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mousemove", handleGlobalMouseMove)
    }
  }, [delay, enableTilt, enableCornerLines])

  const glowColors = {
    cyan: "bg-cyan-500/30",
    magenta: "bg-fuchsia-500/30",
    emerald: "bg-emerald-500/30",
    amber: "bg-amber-500/30",
  }

  const lineColors = {
    cyan: "bg-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.9),0_0_30px_rgba(0,255,255,0.5)]",
    magenta: "bg-fuchsia-400 shadow-[0_0_15px_rgba(255,0,255,0.9),0_0_30px_rgba(255,0,255,0.5)]",
    emerald: "bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.9),0_0_30px_rgba(16,185,129,0.5)]",
    amber: "bg-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.9),0_0_30px_rgba(245,158,11,0.5)]",
  }

  const borderGradients = {
    cyan: "from-cyan-500/50 via-cyan-400/30 to-cyan-500/50",
    magenta: "from-fuchsia-500/50 via-fuchsia-400/30 to-fuchsia-500/50",
    emerald: "from-emerald-500/50 via-emerald-400/30 to-emerald-500/50",
    amber: "from-amber-500/50 via-amber-400/30 to-amber-500/50",
  }

  return (
    <div
      ref={cardRef}
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-[#0a0f1a]/90 backdrop-blur-xl p-6",
        "border border-white/[0.08] transition-colors duration-500",
        "hover:border-white/[0.15]",
        className,
      )}
      style={{ transformStyle: "preserve-3d" }}
      {...props}
    >
      {/* Animated border gradient overlay */}
      <div
        ref={borderRef}
        className={cn("pointer-events-none absolute inset-0 rounded-2xl opacity-20 transition-opacity duration-500")}
        style={{
          background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "1px",
        }}
      >
        <div className={cn("h-full w-full rounded-2xl bg-gradient-to-r", borderGradients[glowColor])} />
      </div>

      {/* Cursor-following light glow */}
      <div
        ref={glowRef}
        className={cn(
          "pointer-events-none absolute h-[300px] w-[300px] rounded-full opacity-0 blur-[80px]",
          glowColors[glowColor],
        )}
      />

      {/* Corner accent lines - Top Left */}
      {enableCornerLines && (
        <div className="absolute left-0 top-0 h-12 w-12 pointer-events-none">
          <div
            ref={topLeftLineH}
            className={cn(
              "absolute left-0 top-0 h-[2px] w-[20px] opacity-50 transition-all duration-300",
              lineColors[glowColor],
              isNear && "animate-pulse",
            )}
          />
          <div
            ref={topLeftLineV}
            className={cn(
              "absolute left-0 top-0 h-[20px] w-[2px] opacity-50 transition-all duration-300",
              lineColors[glowColor],
              isNear && "animate-pulse",
            )}
          />
        </div>
      )}

      {/* Corner accent lines - Bottom Right */}
      {enableCornerLines && (
        <div className="absolute bottom-0 right-0 h-12 w-12 pointer-events-none">
          <div
            ref={bottomRightLineH}
            className={cn(
              "absolute bottom-0 right-0 h-[2px] w-[20px] opacity-50 transition-all duration-300",
              lineColors[glowColor],
              isNear && "animate-pulse",
            )}
          />
          <div
            ref={bottomRightLineV}
            className={cn(
              "absolute bottom-0 right-0 h-[20px] w-[2px] opacity-50 transition-all duration-300",
              lineColors[glowColor],
              isNear && "animate-pulse",
            )}
          />
        </div>
      )}

      {/* Scan line effect */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div
          className={cn(
            "absolute left-0 right-0 h-[1px] animate-scan-line",
            glowColor === "cyan" && "bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent",
            glowColor === "magenta" && "bg-gradient-to-r from-transparent via-fuchsia-500/60 to-transparent",
            glowColor === "emerald" && "bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent",
            glowColor === "amber" && "bg-gradient-to-r from-transparent via-amber-500/60 to-transparent",
          )}
        />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-500"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
