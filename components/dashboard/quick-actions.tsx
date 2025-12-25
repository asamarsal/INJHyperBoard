import { GlassCard } from "@/components/ui/glass-card"
import Link from "next/link"
import { MessageSquare, ArrowRightLeft, Calculator, Wallet, FileCode, Activity } from "lucide-react"

const actions = [
  {
    title: "AI Chatbot",
    description: "Ask anything about Injective",
    href: "/chatbot",
    icon: MessageSquare,
    variant: "cyan" as const,
  },
  {
    title: "Preview Transaction",
    description: "Analyze transaction details",
    href: "/transaction",
    icon: ArrowRightLeft,
    variant: "magenta" as const,
  },
  {
    title: "Estimate Costs",
    description: "Calculate gas and fees",
    href: "/cost-estimator",
    icon: Calculator,
    variant: "cyan" as const,
  },
  {
    title: "View Wallet",
    description: "Check balances and activity",
    href: "/wallet",
    icon: Wallet,
    variant: "magenta" as const,
  },
  {
    title: "Explore Contracts",
    description: "Interact with smart contracts",
    href: "/contracts",
    icon: FileCode,
    variant: "cyan" as const,
  },
  {
    title: "Network Status",
    description: "Monitor network health",
    href: "/network",
    icon: Activity,
    variant: "magenta" as const,
  },
]

export function QuickActions() {
  return (
    <GlassCard>
      <h2 className="mb-4 text-lg font-semibold text-foreground">Quick Actions</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((action) => (
          <Link key={action.href} href={action.href}>
            <div className="group glass glass-hover flex items-center gap-3 rounded-lg p-4 transition-all duration-300">
              <div
                className={`rounded-lg p-2 ${
                  action.variant === "cyan"
                    ? "bg-primary/10 group-hover:bg-primary/20"
                    : "bg-accent/10 group-hover:bg-accent/20"
                }`}
              >
                <action.icon className={`h-5 w-5 ${action.variant === "cyan" ? "text-primary" : "text-accent"}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{action.title}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </GlassCard>
  )
}
