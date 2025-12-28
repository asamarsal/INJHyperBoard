"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { gsap } from "gsap"
import { BentoCard } from "@/components/ui/bento-card"
import { Activity, Fuel, Blocks, TrendingUp, Zap, Wallet, Copy, Check, QrCode, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { QRCodeSVG } from 'qrcode.react'
import { FuturisticCard } from "@/components/ui/futuristic-card"

// Declare window.keplr type
declare global {
  interface Window {
    keplr: any;
  }
}

interface StatItemProps {
  icon: React.ElementType
  label: string
  value: string
  subtitle?: string
  trend?: "up" | "down" | "neutral"
  glowColor: "cyan" | "magenta"
  delay?: number
  compact?: boolean
}

function StatItem({ icon: Icon, label, value, subtitle, trend, glowColor, delay = 0, compact = false }: StatItemProps) {
  const valueRef = useRef<HTMLSpanElement>(null)
  const iconRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const valueEl = valueRef.current
    const iconEl = iconRef.current
    if (!valueEl || !iconEl) return

    // Entrance animation
    gsap.fromTo(valueEl, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, delay: delay + 0.3 })

    // Icon pulse animation
    gsap.to(iconEl, {
      scale: 1.1,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    })

    return () => {
      gsap.killTweensOf([valueEl, iconEl])
    }
  }, [delay])

  return (
    <div className={`flex items-center ${compact ? 'gap-2' : 'gap-4'}`}>
      <div
        ref={iconRef}
        className={`flex ${compact ? 'h-8 w-8' : 'h-12 w-12'} items-center justify-center rounded-xl ${
          glowColor === "cyan"
            ? "bg-cyan-500/10 shadow-[0_0_20px_rgba(0,255,255,0.2)]"
            : "bg-fuchsia-500/10 shadow-[0_0_20px_rgba(255,0,255,0.2)]"
        }`}
      >
        <Icon className={`${compact ? 'h-4 w-4' : 'h-6 w-6'} ${glowColor === "cyan" ? "text-cyan-400" : "text-fuchsia-400"}`} />
      </div>
      <div className="flex-1">
        <p className={`${compact ? 'text-[10px]' : 'text-xs'} uppercase tracking-wider text-muted-foreground`}>{label}</p>
        <div className="flex items-center gap-2">
          <span ref={valueRef} className={`${compact ? 'text-sm' : 'text-xl'} font-bold text-foreground`}>
            {value}
          </span>
          {trend && (
            <TrendingUp
              className={`h-4 w-4 ${
                trend === "up" ? "text-emerald-400" : trend === "down" ? "rotate-180 text-red-400" : "text-slate-400"
              }`}
            />
          )}
        </div>
        {subtitle && <p className={`${compact ? 'text-[10px]' : 'text-xs'} text-muted-foreground`}>{subtitle}</p>}
      </div>
    </div>
  )
}

export function BentoStats() {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)

  useEffect(() => {
    // Check if previously connected
    const savedAddress = localStorage.getItem('inj_wallet_address')
    if (savedAddress) {
      setAddress(savedAddress)
    }
  }, [])

  const connectWallet = async () => {
    // Check if Keplr is installed
    if (!window.keplr) {
      alert('Please install Keplr extension')
      return
    }

    setIsConnecting(true)
    try {
      const chainId = 'injective-1'

      // Enable the chain (prompts user approval)
      await window.keplr.enable(chainId)

      // Get offline signer
      const offlineSigner = window.keplr.getOfflineSigner(chainId)

      // Get accounts
      const accounts = await offlineSigner.getAccounts()
      const injAddress = accounts[0].address

      setAddress(injAddress)
      localStorage.setItem('inj_wallet_address', injAddress)
    } catch (error) {
      console.error('Wallet connection failed:', error)
      alert('Failed to connect wallet. Please try again.')
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setAddress(null)
    localStorage.removeItem('inj_wallet_address')
  }

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shortenAddress = (addr: string) => {
    return `${addr.substring(0, 10)}...${addr.substring(addr.length - 6)}`
  }

  return (
    <>
      {/* Connect Wallet Card */}
      <BentoCard glowColor="cyan" size="md" delay={0.1}>
        <div className="flex h-full flex-col justify-between">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-cyan-500/70">Wallet</span>
            <Wallet className="h-4 w-4 text-cyan-400" />
          </div>
          
          {address ? (
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Connected</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-foreground font-mono">{shortenAddress(address)}</p>
                  <button
                    onClick={handleCopy}
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                    title="Copy address"
                  >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </button>
                  <button
                    onClick={() => setShowQR(true)}
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                    title="Show QR Code"
                  >
                    <QrCode className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <Button 
                onClick={disconnectWallet}
                className="w-full bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30"
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Connect your wallet</p>
                <p className="text-sm text-foreground font-semibold">Get started with Injective</p>
              </div>
              <Button 
                onClick={connectWallet}
                disabled={isConnecting}
                className="w-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] disabled:opacity-50"
              >
                <Wallet className="h-4 w-4 mr-2" />
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            </div>
          )}
        </div>
      </BentoCard>

      {/* Performance Card - Merged Gas Price + Block Time (LEFT) */}
      <BentoCard glowColor="magenta" size="md" delay={0.2}>
        <div className="flex h-full flex-col justify-between">
          <span className="mb-3 text-xs uppercase tracking-wider text-fuchsia-500/70">Performance</span>
          <div className="space-y-3">
            <StatItem
              icon={Fuel}
              label="Gas Price"
              value="0.0001 INJ"
              subtitle="~$0.002 USD"
              trend="down"
              glowColor="magenta"
              delay={0.2}
              compact={true}
            />
            <StatItem
              icon={Zap}
              label="Block Time"
              value="~1.2s"
              subtitle="Instant finality"
              glowColor="magenta"
              delay={0.3}
              compact={true}
            />
          </div>
        </div>
      </BentoCard>

      {/* Network Status Card (RIGHT) */}
      <BentoCard glowColor="cyan" size="md" delay={0.3}>
        <div className="flex h-full flex-col justify-between">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-cyan-500/70">Network</span>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span className="text-xs text-emerald-400">Online</span>
            </div>
          </div>
          <StatItem
            icon={Activity}
            label="Status"
            value="Operational"
            subtitle="All systems running"
            glowColor="cyan"
            delay={0.3}
          />
        </div>
      </BentoCard>

      {/* QR Code Modal */}
      {showQR && address && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-lg"
          onClick={() => setShowQR(false)}
        >
          <FuturisticCard 
            glowColor="cyan" 
            className="relative w-full max-w-md mx-4"
            onClick={(e: any) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowQR(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-cyan-400 transition-colors z-10"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="text-center space-y-4 pt-2">
              <h3 className="text-xl font-semibold text-foreground">Wallet QR Code</h3>
              
              <div className="flex justify-center p-6 bg-white rounded-xl shadow-lg">
                <QRCodeSVG 
                  value={address}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Address:</p>
                <p className="font-mono text-sm text-foreground break-all px-4">
                  {address}
                </p>
              </div>
            </div>
          </FuturisticCard>
        </div>
      )}
    </>
  )
}
