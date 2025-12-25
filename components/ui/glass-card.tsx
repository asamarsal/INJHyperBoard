import type React from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glowColor?: "cyan" | "magenta" | "purple" | "none"
  children: React.ReactNode
}

export function GlassCard({ glowColor = "none", className, children, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass glass-hover rounded-xl p-6 transition-all duration-300",
        glowColor === "cyan" && "hover:neon-glow-cyan",
        glowColor === "magenta" && "hover:neon-glow-magenta",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
