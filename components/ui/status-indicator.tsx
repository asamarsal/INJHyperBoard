import { cn } from "@/lib/utils"

interface StatusIndicatorProps {
  status: "online" | "degraded" | "offline"
  label?: string
  size?: "sm" | "md" | "lg"
}

export function StatusIndicator({ status, label, size = "md" }: StatusIndicatorProps) {
  const sizeClasses = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4",
  }

  const statusColors = {
    online: "bg-emerald-500",
    degraded: "bg-amber-500",
    offline: "bg-red-500",
  }

  return (
    <div className="flex items-center gap-2">
      <div className={cn("rounded-full pulse-glow", sizeClasses[size], statusColors[status])} />
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
    </div>
  )
}
