"use client"

import { useState } from 'react'
import { X, Wallet } from 'lucide-react'
import { FuturisticCard } from '@/components/ui/futuristic-card'
import { Button } from '@/components/ui/button'
import { useWallet } from '@/contexts/wallet-context'

interface WalletOption {
  id: string
  name: string
  icon: string
  description: string
}

const walletOptions: WalletOption[] = [
  {
    id: 'keplr',
    name: 'Keplr',
    icon: '🔐',
    description: 'Keplr Browser Extension'
  },
  {
    id: 'leap',
    name: 'Leap',
    icon: '🦘',
    description: 'Leap Cosmos Wallet'
  },
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: '🦊',
    description: 'MetaMask Snap'
  },
  {
    id: 'cosmostation',
    name: 'Cosmostation',
    icon: '🌌',
    description: 'Cosmostation Wallet'
  }
]

interface WalletConnectModalProps {
  isOpen: boolean
  onClose: () => void
}

export function WalletConnectModal({ isOpen, onClose }: WalletConnectModalProps) {
  const { connect, isConnecting, error } = useWallet()
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)

  if (!isOpen) return null

  const handleConnect = async (walletId: string) => {
    setSelectedWallet(walletId)
    await connect(walletId)
    if (!error) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-lg"
      onClick={onClose}
    >
      <FuturisticCard 
        glowColor="cyan" 
        className="relative w-full max-w-md mx-4"
        onClick={(e: any) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-cyan-400 transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="space-y-4 pt-2">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-foreground mb-2">Connect Wallet</h3>
            <p className="text-sm text-muted-foreground">Choose your preferred wallet to connect</p>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-3">
              <p className="text-sm text-rose-400">{error}</p>
            </div>
          )}

          <div className="grid gap-3">
            {walletOptions.map((wallet) => (
              <button
                key={wallet.id}
                onClick={() => handleConnect(wallet.id)}
                disabled={isConnecting}
                className="group flex items-center gap-4 p-4 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:border-cyan-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="text-3xl">{wallet.icon}</div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-foreground group-hover:text-cyan-400 transition-colors">
                    {wallet.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{wallet.description}</p>
                </div>
                {isConnecting && selectedWallet === wallet.id && (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
                )}
              </button>
            ))}
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-muted-foreground">
              Don't have a wallet?{' '}
              <a 
                href="https://www.keplr.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Get Keplr
              </a>
            </p>
          </div>
        </div>
      </FuturisticCard>
    </div>
  )
}
