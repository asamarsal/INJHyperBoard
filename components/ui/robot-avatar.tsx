"use client"

import { useRef, useEffect } from "react"
import { gsap } from "gsap"

interface RobotAvatarProps {
  size?: "sm" | "md" | "lg"
  variant?: "cyan" | "magenta"
  animated?: boolean
}

export function RobotAvatar({ size = "md", variant = "cyan", animated = true }: RobotAvatarProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const eyeLeftRef = useRef<HTMLDivElement>(null)
  const eyeRightRef = useRef<HTMLDivElement>(null)
  const antennaRef = useRef<HTMLDivElement>(null)

  const sizeClasses = {
    sm: "h-12 w-12",
    md: "h-20 w-20",
    lg: "h-32 w-32",
  }

  const eyeSizes = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-5 w-5",
  }

  useEffect(() => {
    if (!animated) return
    const container = containerRef.current
    const eyeLeft = eyeLeftRef.current
    const eyeRight = eyeRightRef.current
    const antenna = antennaRef.current
    if (!container || !eyeLeft || !eyeRight || !antenna) return

    // Floating animation
    gsap.to(container, {
      y: -5,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    })

    // Eye blink animation
    const blinkTimeline = gsap.timeline({ repeat: -1, repeatDelay: 3 })
    blinkTimeline
      .to([eyeLeft, eyeRight], { scaleY: 0.1, duration: 0.1 })
      .to([eyeLeft, eyeRight], { scaleY: 1, duration: 0.1 })

    // Antenna glow pulse
    gsap.to(antenna, {
      boxShadow:
        variant === "cyan"
          ? "0 0 20px rgba(0, 255, 255, 1), 0 0 40px rgba(0, 255, 255, 0.5)"
          : "0 0 20px rgba(255, 0, 255, 1), 0 0 40px rgba(255, 0, 255, 0.5)",
      duration: 1,
      repeat: -1,
      yoyo: true,
    })

    return () => {
      gsap.killTweensOf([container, eyeLeft, eyeRight, antenna])
    }
  }, [animated, variant])

  const glowColor = variant === "cyan" ? "rgba(0, 255, 255," : "rgba(255, 0, 255,"

  return (
    <div ref={containerRef} className={`relative ${sizeClasses[size]}`}>
      {/* Antenna */}
      <div
        ref={antennaRef}
        className={`absolute -top-2 left-1/2 h-3 w-1 -translate-x-1/2 rounded-full ${
          variant === "cyan" ? "bg-cyan-400" : "bg-fuchsia-400"
        }`}
      />

      {/* Head */}
      <div
        className={`relative h-full w-full rounded-xl border-2 ${
          variant === "cyan"
            ? "border-cyan-500/50 bg-gradient-to-br from-slate-800 to-slate-900"
            : "border-fuchsia-500/50 bg-gradient-to-br from-slate-800 to-slate-900"
        }`}
        style={{
          boxShadow: `0 0 30px ${glowColor}0.2), inset 0 0 20px ${glowColor}0.1)`,
        }}
      >
        {/* Face plate */}
        <div className="absolute inset-2 rounded-lg bg-slate-900/80">
          {/* Eyes */}
          <div className="absolute left-1/2 top-1/3 flex -translate-x-1/2 gap-3">
            <div
              ref={eyeLeftRef}
              className={`${eyeSizes[size]} rounded-full ${variant === "cyan" ? "bg-cyan-400" : "bg-fuchsia-400"}`}
              style={{
                boxShadow: `0 0 10px ${glowColor}0.8), 0 0 20px ${glowColor}0.5)`,
              }}
            />
            <div
              ref={eyeRightRef}
              className={`${eyeSizes[size]} rounded-full ${variant === "cyan" ? "bg-cyan-400" : "bg-fuchsia-400"}`}
              style={{
                boxShadow: `0 0 10px ${glowColor}0.8), 0 0 20px ${glowColor}0.5)`,
              }}
            />
          </div>

          {/* Mouth/Speaker grille */}
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-0.5">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`h-1 w-0.5 rounded-full ${variant === "cyan" ? "bg-cyan-500/50" : "bg-fuchsia-500/50"}`}
              />
            ))}
          </div>
        </div>

        {/* Side panels */}
        <div
          className={`absolute -left-1 top-1/2 h-4 w-1 -translate-y-1/2 rounded-full ${
            variant === "cyan" ? "bg-cyan-500/30" : "bg-fuchsia-500/30"
          }`}
        />
        <div
          className={`absolute -right-1 top-1/2 h-4 w-1 -translate-y-1/2 rounded-full ${
            variant === "cyan" ? "bg-cyan-500/30" : "bg-fuchsia-500/30"
          }`}
        />
      </div>
    </div>
  )
}
