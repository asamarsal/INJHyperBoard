"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { gsap } from "gsap"

interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glowColor?: "cyan" | "magenta" | "purple"
  size?: "sm" | "md" | "lg" | "xl"
  children: React.ReactNode
  delay?: number
}

export function BentoCard({
  glowColor = "cyan",
  size = "md",
  className,
  children,
  delay = 0,
  ...props
}: BentoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const borderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    const glow = glowRef.current
    const border = borderRef.current
    if (!card || !glow || !border) return

    // Initial animation
    gsap.fromTo(
      card,
      { opacity: 0, y: 50, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        delay: delay,
        ease: "power3.out",
      },
    )

    // Mouse move handler for 3D tilt effect
    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const rotateX = (y - centerY) / 20
      const rotateY = (centerX - x) / 20

      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        transformPerspective: 1000,
        duration: 0.5,
        ease: "power2.out",
      })

      // Move glow to cursor position
      gsap.to(glow, {
        x: x - 100,
        y: y - 100,
        opacity: 1,
        duration: 0.3,
      })

      // Animate border glow
      gsap.to(border, {
        opacity: 1,
        duration: 0.3,
      })
    }

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: "power2.out",
      })
      gsap.to(glow, {
        opacity: 0,
        duration: 0.3,
      })
      gsap.to(border, {
        opacity: 0.3,
        duration: 0.3,
      })
    }

    card.addEventListener("mousemove", handleMouseMove)
    card.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      card.removeEventListener("mousemove", handleMouseMove)
      card.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [delay])

  const glowColors = {
    cyan: "from-cyan-500/40 via-cyan-400/20 to-transparent",
    magenta: "from-fuchsia-500/40 via-fuchsia-400/20 to-transparent",
    purple: "from-violet-500/40 via-violet-400/20 to-transparent",
  }

  const borderColors = {
    cyan: "from-cyan-500 via-cyan-400/50 to-cyan-500",
    magenta: "from-fuchsia-500 via-fuchsia-400/50 to-fuchsia-500",
    purple: "from-violet-500 via-violet-400/50 to-violet-500",
  }

  return (
    <div
      ref={cardRef}
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-[#0a0f1a]/80 backdrop-blur-xl",
        "border border-white/[0.08] transition-all duration-500",
        size === "sm" && "p-4",
        size === "md" && "p-6",
        size === "lg" && "p-8",
        size === "xl" && "p-10",
        className,
      )}
      style={{ transformStyle: "preserve-3d" }}
      {...props}
    >
      {/* Animated border gradient */}
      <div
        ref={borderRef}
        className={cn(
          "pointer-events-none absolute inset-0 rounded-2xl opacity-30 transition-opacity duration-500",
          "before:absolute before:inset-0 before:rounded-2xl before:p-[1px]",
          "before:bg-gradient-to-r before:content-['']",
          borderColors[glowColor],
        )}
        style={{
          background: `linear-gradient(135deg, var(--${glowColor === "cyan" ? "neon-cyan" : glowColor === "magenta" ? "neon-magenta" : "neon-purple"}) 0%, transparent 50%, var(--${glowColor === "cyan" ? "neon-cyan" : glowColor === "magenta" ? "neon-magenta" : "neon-purple"}) 100%)`,
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "1px",
        }}
      />

      {/* Cursor-following glow */}
      <div
        ref={glowRef}
        className={cn(
          "pointer-events-none absolute h-[200px] w-[200px] rounded-full opacity-0 blur-3xl",
          "bg-gradient-radial",
          glowColors[glowColor],
        )}
      />

      {/* Corner accents */}
      <div className="absolute left-0 top-0 h-8 w-8">
        <div
          className={cn(
            "absolute left-0 top-0 h-[2px] w-4 transition-all duration-300 group-hover:w-6",
            glowColor === "cyan" && "bg-cyan-500 shadow-[0_0_10px_rgba(0,255,255,0.8)]",
            glowColor === "magenta" && "bg-fuchsia-500 shadow-[0_0_10px_rgba(255,0,255,0.8)]",
            glowColor === "purple" && "bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.8)]",
          )}
        />
        <div
          className={cn(
            "absolute left-0 top-0 h-4 w-[2px] transition-all duration-300 group-hover:h-6",
            glowColor === "cyan" && "bg-cyan-500 shadow-[0_0_10px_rgba(0,255,255,0.8)]",
            glowColor === "magenta" && "bg-fuchsia-500 shadow-[0_0_10px_rgba(255,0,255,0.8)]",
            glowColor === "purple" && "bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.8)]",
          )}
        />
      </div>
      <div className="absolute bottom-0 right-0 h-8 w-8">
        <div
          className={cn(
            "absolute bottom-0 right-0 h-[2px] w-4 transition-all duration-300 group-hover:w-6",
            glowColor === "cyan" && "bg-cyan-500 shadow-[0_0_10px_rgba(0,255,255,0.8)]",
            glowColor === "magenta" && "bg-fuchsia-500 shadow-[0_0_10px_rgba(255,0,255,0.8)]",
            glowColor === "purple" && "bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.8)]",
          )}
        />
        <div
          className={cn(
            "absolute bottom-0 right-0 h-4 w-[2px] transition-all duration-300 group-hover:h-6",
            glowColor === "cyan" && "bg-cyan-500 shadow-[0_0_10px_rgba(0,255,255,0.8)]",
            glowColor === "magenta" && "bg-fuchsia-500 shadow-[0_0_10px_rgba(255,0,255,0.8)]",
            glowColor === "purple" && "bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.8)]",
          )}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Scan line effect on hover */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="animate-scan-line absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      </div>
    </div>
  )
}
