import { GlassCard } from "@/components/ui/glass-card"
import { StatusIndicator } from "@/components/ui/status-indicator"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string
  subtitle?: string
  icon: LucideIcon
  status?: "online" | "degraded" | "offline"
  glowColor?: "cyan" | "magenta" | "purple" | "none"
}

export function StatsCard({ title, value, subtitle, icon: Icon, status, glowColor = "cyan" }: StatsCardProps) {
  return (
    <GlassCard glowColor={glowColor}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="rounded-lg bg-primary/10 p-2">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          {status && <StatusIndicator status={status} size="sm" />}
        </div>
      </div>
    </GlassCard>
  )
}
