import { cn } from "@/lib/utils"
import { type ButtonHTMLAttributes, forwardRef } from "react"

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "cyan" | "magenta" | "purple"
  size?: "sm" | "md" | "lg"
}

export const NeonButton = forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ className, variant = "cyan", size = "md", children, ...props }, ref) => {
    const variantClasses = {
      cyan: "bg-primary/10 text-primary border-primary/50 hover:bg-primary/20 hover:neon-glow-cyan",
      magenta: "bg-accent/10 text-accent border-accent/50 hover:bg-accent/20 hover:neon-glow-magenta",
      purple: "bg-neon-purple/10 text-neon-purple border-neon-purple/50 hover:bg-neon-purple/20",
    }

    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    }

    return (
      <button
        ref={ref}
        className={cn(
          "rounded-lg border font-medium transition-all duration-300",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    )
  },
)

NeonButton.displayName = "NeonButton"
