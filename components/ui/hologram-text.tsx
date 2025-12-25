"use client"

import { useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { gsap } from "gsap"

interface HologramTextProps {
  children: string
  className?: string
  variant?: "cyan" | "magenta"
  size?: "sm" | "md" | "lg" | "xl"
  animated?: boolean
}

export function HologramText({
  children,
  className,
  variant = "cyan",
  size = "md",
  animated = true,
}: HologramTextProps) {
  const textRef = useRef<HTMLSpanElement>(null)
  const glitchRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!animated) return
    const text = textRef.current
    const glitch = glitchRef.current
    if (!text || !glitch) return

    // Random glitch effect
    const glitchInterval = setInterval(() => {
      const shouldGlitch = Math.random() > 0.9
      if (shouldGlitch) {
        gsap.to(glitch, {
          opacity: 1,
          x: Math.random() * 4 - 2,
          duration: 0.05,
        })
        gsap.to(glitch, {
          opacity: 0,
          x: 0,
          duration: 0.05,
          delay: 0.1,
        })
      }
    }, 500)

    return () => clearInterval(glitchInterval)
  }, [animated])

  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
    xl: "text-4xl",
  }

  const colorClasses = {
    cyan: "text-cyan-400",
    magenta: "text-fuchsia-400",
  }

  const glowStyles = {
    cyan: "text-shadow: 0 0 10px rgba(0, 255, 255, 0.8), 0 0 20px rgba(0, 255, 255, 0.5), 0 0 40px rgba(0, 255, 255, 0.3)",
    magenta:
      "text-shadow: 0 0 10px rgba(255, 0, 255, 0.8), 0 0 20px rgba(255, 0, 255, 0.5), 0 0 40px rgba(255, 0, 255, 0.3)",
  }

  return (
    <span className={cn("relative inline-block font-[var(--font-orbitron)] font-bold", className)}>
      <span
        ref={textRef}
        className={cn(sizeClasses[size], colorClasses[variant])}
        style={{
          textShadow:
            variant === "cyan"
              ? "0 0 10px rgba(0, 255, 255, 0.8), 0 0 20px rgba(0, 255, 255, 0.5), 0 0 40px rgba(0, 255, 255, 0.3)"
              : "0 0 10px rgba(255, 0, 255, 0.8), 0 0 20px rgba(255, 0, 255, 0.5), 0 0 40px rgba(255, 0, 255, 0.3)",
        }}
      >
        {children}
      </span>
      {/* Glitch overlay */}
      <span
        ref={glitchRef}
        className={cn(
          "pointer-events-none absolute left-0 top-0 opacity-0",
          sizeClasses[size],
          variant === "cyan" ? "text-fuchsia-400" : "text-cyan-400",
        )}
        aria-hidden="true"
      >
        {children}
      </span>
    </span>
  )
}
