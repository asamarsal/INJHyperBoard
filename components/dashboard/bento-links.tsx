"use client"

import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { BentoCard } from "@/components/ui/bento-card"
import { ExternalLink, BookOpen, Code, Server, HelpCircle } from "lucide-react"

const links = [
  {
    title: "Documentation",
    description: "Learn what is Injective Protocol and how it works",
    href: "https://docs.injective.network/",
    icon: BookOpen,
    glowColor: "cyan" as const,
  },
  {
    title: "Developers",
    description: "Build dApps and integrate with Injective blockchain",
    href: "https://docs.injective.network/developers",
    icon: Code,
    glowColor: "magenta" as const,
  },
  {
    title: "Infrastructure",
    description: "Run nodes and validators on Injective network",
    href: "https://docs.injective.network/infra",
    icon: Server,
    glowColor: "cyan" as const,
  },
  {
    title: "FAQ",
    description: "Common questions about Injective ecosystem",
    href: "https://docs.injective.network/faq",
    icon: HelpCircle,
    glowColor: "magenta" as const,
  },
]

const socialLinks = [
  {
    title: "Discord",
    href: "https://discord.com/invite/injective",
    icon: "discord",
    bgColor: "bg-[#5865F2]/10",
    hoverColor: "hover:bg-[#5865F2]/20",
    textColor: "text-[#5865F2]",
  },
  {
    title: "Telegram",
    href: "https://t.me/+qorn-J06fzA0YTZl",
    icon: "telegram",
    bgColor: "bg-[#0088cc]/10",
    hoverColor: "hover:bg-[#0088cc]/20",
    textColor: "text-[#0088cc]",
  },
]

interface LinkItemProps {
  link: (typeof links)[0]
  index: number
}

function LinkItem({ link, index }: LinkItemProps) {
  const itemRef = useRef<HTMLAnchorElement>(null)
  const iconRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const item = itemRef.current
    const icon = iconRef.current
    if (!item || !icon) return

    const handleMouseEnter = () => {
      gsap.to(icon, {
        scale: 1.1,
        rotate: 5,
        duration: 0.3,
      })
      gsap.to(item, {
        x: 3,
        duration: 0.3,
      })
    }

    const handleMouseLeave = () => {
      gsap.to(icon, {
        scale: 1,
        rotate: 0,
        duration: 0.3,
      })
      gsap.to(item, {
        x: 0,
        duration: 0.3,
      })
    }

    item.addEventListener("mouseenter", handleMouseEnter)
    item.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      item.removeEventListener("mouseenter", handleMouseEnter)
      item.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <a
      ref={itemRef}
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-2.5 rounded-lg border border-white/[0.05] bg-white/[0.02] p-2.5 transition-all duration-300 hover:border-white/[0.1] hover:bg-white/[0.05]"
    >
      <div
        ref={iconRef}
        className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg ${
          link.glowColor === "cyan"
            ? "bg-cyan-500/10 group-hover:shadow-[0_0_15px_rgba(0,255,255,0.3)]"
            : "bg-fuchsia-500/10 group-hover:shadow-[0_0_15px_rgba(255,0,255,0.3)]"
        } transition-shadow duration-300`}
      >
        <link.icon className={`h-3.5 w-3.5 ${link.glowColor === "cyan" ? "text-cyan-400" : "text-fuchsia-400"}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-white truncate">{link.title}</p>
        <p className="text-[10px] leading-tight text-slate-500">{link.description}</p>
      </div>
      <ExternalLink className="h-3 w-3 flex-shrink-0 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100" />
    </a>
  )
}

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  )
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12a12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472c-.18 1.898-.962 6.502-1.36 8.627c-.168.9-.499 1.201-.82 1.23c-.696.065-1.225-.46-1.9-.902c-1.056-.693-1.653-1.124-2.678-1.8c-1.185-.78-.417-1.21.258-1.91c.177-.184 3.247-2.977 3.307-3.23c.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345c-.48.33-.913.49-1.302.48c-.428-.008-1.252-.241-1.865-.44c-.752-.245-1.349-.374-1.297-.789c.027-.216.325-.437.893-.663c3.498-1.524 5.83-2.529 6.998-3.014c3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  )
}

export function BentoLinks() {
  return (
    <BentoCard glowColor="purple" size="md" delay={0.7} className="col-span-1 row-span-2">
      <div className="mb-3">
        <h3 className="font-[var(--font-orbitron)] text-base font-bold text-white">Resources & Community</h3>
      </div>

      {/* Documentation Links */}
      <div className="mb-4 space-y-2">
        {links.map((link, index) => (
          <LinkItem key={link.href} link={link} index={index} />
        ))}
      </div>

      {/* Social Links */}
      <div className="flex gap-2">
        {socialLinks.map((social) => (
          <a
            key={social.href}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/[0.05] ${social.bgColor} ${social.hoverColor} p-2 transition-all duration-300 hover:border-white/[0.1]`}
          >
            {social.icon === "discord" ? (
              <DiscordIcon className={`h-4 w-4 ${social.textColor}`} />
            ) : (
              <TelegramIcon className={`h-4 w-4 ${social.textColor}`} />
            )}
            <span className={`text-xs font-medium ${social.textColor}`}>{social.title}</span>
          </a>
        ))}
      </div>
    </BentoCard>
  )
}
