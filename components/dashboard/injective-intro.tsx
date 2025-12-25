import { GlassCard } from "@/components/ui/glass-card"
import { NeonButton } from "@/components/ui/neon-button"
import { ExternalLink } from "lucide-react"

export function InjectiveIntro() {
  return (
    <GlassCard glowColor="cyan" className="relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative">
        <h2 className="text-xl font-bold text-foreground">
          Welcome to <span className="text-primary neon-text-cyan">Injective</span>
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Injective is a lightning-fast, interoperable layer-1 blockchain optimized for building premier Web3 financial
          applications. Experience instant transaction finality, near-zero gas fees, and access to unlimited
          decentralized markets.
        </p>
        <div className="mt-4 flex gap-3">
          <NeonButton variant="cyan">
            <a
              href="https://docs.injective.network"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              Documentation
              <ExternalLink className="h-4 w-4" />
            </a>
          </NeonButton>
          <NeonButton variant="magenta">
            <a
              href="https://injective.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              Learn More
              <ExternalLink className="h-4 w-4" />
            </a>
          </NeonButton>
        </div>
      </div>
    </GlassCard>
  )
}
