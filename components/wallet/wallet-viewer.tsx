"use client"

import { useState, useEffect } from "react"
import { Search, ArrowUpRight, ArrowDownLeft, Wallet, Copy, Check, ExternalLink, QrCode, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { FuturisticCard } from "@/components/ui/futuristic-card"
import { QRCodeSVG } from 'qrcode.react'
import toast, { Toaster } from 'react-hot-toast'

interface WalletData {
  address: string
  balance: {
    total: number
    available: number
    staked: number
    unstaking: number
    restaking: number
    claimableRewards: number
  }
  tokens: Array<{
    denom: string
    amount: number
    displayDenom: string
  }>
  transactions: Array<{
    hash: string
    fullHash: string
    block: string
    status: string
    type: 'send' | 'receive'
    amount: string
    token: string
    from: string
    to: string
    time: string
    timestamp: string
  }>
  delegations: number
}

export function WalletViewer() {
  const [address, setAddress] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [walletData, setWalletData] = useState<WalletData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showQR, setShowQR] = useState(false)

  // Auto-fill wallet address if connected
  useEffect(() => {
    const connectedAddress = localStorage.getItem('inj_wallet_address')
    if (connectedAddress && !isLoaded) {
      setAddress(connectedAddress)
      // Auto-search after setting address
      setTimeout(() => {
        handleSearchWithAddress(connectedAddress)
      }, 100)
    }
  }, [])

  const handleSearchWithAddress = async (searchAddress: string) => {
    if (!searchAddress.trim()) return
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/wallet?address=${encodeURIComponent(searchAddress)}`)
      const data = await response.json()
      
      console.log('API Response:', data)
      console.log('Transactions:', data.transactions)
      console.log('Transactions length:', data.transactions?.length || 0)
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch wallet data')
      }
      
      setWalletData(data)
      setIsLoaded(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch wallet data')
      setIsLoaded(false)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    await handleSearchWithAddress(address)
  }

  const handleCopy = () => {
    if (walletData) {
      navigator.clipboard.writeText(walletData.address)
      setCopied(true)
      toast.success('Address copied to clipboard!', {
        duration: 2000,
        position: 'top-center',
        style: {
          background: '#0f172a',
          color: '#fff',
          border: '1px solid rgba(6, 182, 212, 0.3)',
        },
      })
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <>
      <Toaster />
      <div className="space-y-6">
        {/* Search Input */}
        <FuturisticCard glowColor="cyan" delay={0.1}>
          <div className="relative flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Input
                placeholder="Enter wallet address (e.g., inj1...)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="h-12 border-cyan-500/30 bg-white/[0.02] pl-12 font-mono text-sm focus:border-cyan-500/50"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                disabled={loading}
              />
              <Wallet className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            </div>
            <Button
              onClick={handleSearch}
              disabled={loading || !address.trim()}
              className="h-12 gap-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-6 hover:bg-cyan-500/30 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] w-full sm:w-auto touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Search className="h-4 w-4" />
              {loading ? "Scanning..." : "Scan Wallet"}
            </Button>
          </div>
          {error && (
            <p className="mt-3 text-sm text-rose-400">{error}</p>
          )}
        </FuturisticCard>

        {isLoaded && walletData && (
          <>
            {/* Wallet Summary */}
            <FuturisticCard glowColor="cyan" delay={0.2}>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Wallet Address</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-sm text-foreground">{walletData.address}</p>
                    <button 
                      onClick={handleCopy} 
                      className="text-muted-foreground hover:text-cyan-400 transition-colors"
                      title="Copy address"
                    >
                      {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => setShowQR(true)}
                      className="text-muted-foreground hover:text-cyan-400 transition-colors"
                      title="Show QR Code"
                    >
                      <QrCode className="h-4 w-4" />
                    </button>
                    <a 
                      href={`https://injscan.com/account/${walletData.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-cyan-400 transition-colors"
                      title="View on Injscan"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total INJ Balance</p>
                  <p className="font-mono text-2xl font-bold text-cyan-400">
                    {walletData.balance.total.toFixed(2)} INJ
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    ≈ ${(walletData.balance.total * 4.85).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4">
                  <div className="flex items-center gap-2">
                    <ArrowDownLeft className="h-5 w-5 text-emerald-400" />
                    <span className="text-sm text-muted-foreground">Available</span>
                  </div>
                  <p className="mt-1 font-mono text-lg font-semibold text-emerald-400">
                    {walletData.balance.available.toFixed(2)} INJ
                  </p>
                </div>
                <div className="rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/20 p-4">
                  <div className="flex items-center gap-2">
                    <ArrowUpRight className="h-5 w-5 text-fuchsia-400" />
                    <span className="text-sm text-muted-foreground">Staked</span>
                  </div>
                  <p className="mt-1 font-mono text-lg font-semibold text-fuchsia-400">
                    {walletData.balance.staked.toFixed(2)} INJ
                  </p>
                </div>
              </div>

              {/* Additional Balance Info */}
              {walletData.balance.claimableRewards > 0 && (
                <div className="mt-4 rounded-lg bg-amber-500/10 border border-amber-500/20 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Claimable Rewards</span>
                    <span className="font-mono text-sm font-semibold text-amber-400">
                      {walletData.balance.claimableRewards.toFixed(4)} INJ
                    </span>
                  </div>
                </div>
              )}
            </FuturisticCard>

            {/* Token Balances */}
            <FuturisticCard glowColor="magenta" delay={0.3}>
              <h3 className="mb-4 text-lg font-semibold text-foreground">Token Balances</h3>
              <div className="space-y-3">
                {walletData.tokens.length > 0 ? (
                  <>
                    {/* Table Header */}
                    <div className="grid grid-cols-4 gap-4 px-4 pb-2 border-b border-white/[0.05]">
                      <div className="text-sm text-muted-foreground">Holding</div>
                      <div className="text-sm text-muted-foreground text-right">Price</div>
                      <div className="text-sm text-muted-foreground text-right">Amount</div>
                      <div className="text-sm text-muted-foreground text-right">USD Value</div>
                    </div>
                    
                    {/* Token Rows */}
                    {walletData.tokens.map((token) => {
                      const price = token.displayDenom === 'INJ' ? 4.85 : 0
                      const usdValue = token.amount * price
                      
                      return (
                        <div
                          key={token.denom}
                          className="group grid grid-cols-4 gap-4 items-center rounded-lg bg-white/[0.02] border border-white/[0.05] p-4 transition-all duration-300 hover:bg-white/[0.05] hover:border-fuchsia-500/30"
                        >
                          {/* Holding */}
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-fuchsia-500/20 p-1">
                              <img 
                                src="/images/injective-inj-logo.png" 
                                alt={token.displayDenom}
                                className="h-full w-full object-contain"
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-foreground text-sm">{token.displayDenom}</p>
                              <p className="text-xs text-muted-foreground">Injective</p>
                            </div>
                          </div>
                          
                          {/* Price */}
                          <div className="text-right">
                            <p className="font-mono text-sm text-foreground">
                              ${price.toFixed(2)}
                            </p>
                          </div>
                          
                          {/* Amount */}
                          <div className="text-right">
                            <p className="font-mono text-sm text-foreground">
                              {token.amount.toFixed(4)}
                            </p>
                          </div>
                          
                          {/* USD Value */}
                          <div className="text-right">
                            <p className="font-mono text-sm font-semibold text-foreground">
                              ${usdValue.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </>
                ) : (
                  <div className="rounded-lg bg-white/[0.02] border border-white/[0.05] p-4 text-center">
                    <p className="text-muted-foreground">No tokens found</p>
                    <p className="font-mono text-sm text-foreground mt-2">0.00 INJ</p>
                  </div>
                )}
              </div>
            </FuturisticCard>

            {/* Recent Transactions */}
            <FuturisticCard glowColor="emerald" delay={0.4}>
              <h3 className="mb-4 text-lg font-semibold text-foreground">Recent Transactions</h3>
              <div className="space-y-3">
                {walletData.transactions && walletData.transactions.length > 0 ? (
                  <>
                    {/* Table Header */}
                    <div className="grid grid-cols-6 gap-4 px-4 pb-2 border-b border-white/[0.05]">
                      <div className="text-sm text-muted-foreground">Txn Hash</div>
                      <div className="text-sm text-muted-foreground">Status</div>
                      <div className="text-sm text-muted-foreground">Type</div>
                      <div className="text-sm text-muted-foreground">Block</div>
                      <div className="text-sm text-muted-foreground text-right">Amount</div>
                      <div className="text-sm text-muted-foreground text-right">Time</div>
                    </div>
                    
                    {/* Transaction Rows */}
                    {walletData.transactions.map((tx) => (
                      <div
                        key={tx.fullHash}
                        className="group grid grid-cols-6 gap-4 items-center rounded-lg bg-white/[0.02] border border-white/[0.05] p-4 transition-all duration-300 hover:bg-white/[0.05] hover:border-emerald-500/30"
                      >
                        {/* Txn Hash */}
                        <div>
                          <a
                            href={`https://injscan.com/tx/${tx.fullHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                          >
                            {tx.hash}
                          </a>
                        </div>
                        
                        {/* Status */}
                        <div>
                          <span className={cn(
                            "text-xs px-2 py-1 rounded",
                            tx.status === 'Success' 
                              ? "bg-emerald-500/20 text-emerald-400" 
                              : "bg-rose-500/20 text-rose-400"
                          )}>
                            {tx.status}
                          </span>
                        </div>
                        
                        {/* Type */}
                        <div>
                          <span className={cn(
                            "text-xs px-2 py-1 rounded flex items-center gap-1 w-fit",
                            tx.type === 'receive' 
                              ? "bg-emerald-500/20 text-emerald-400" 
                              : "bg-rose-500/20 text-rose-400"
                          )}>
                            {tx.type === 'receive' ? (
                              <ArrowDownLeft className="h-3 w-3" />
                            ) : (
                              <ArrowUpRight className="h-3 w-3" />
                            )}
                            {tx.type === 'receive' ? 'Receive' : 'Send'}
                          </span>
                        </div>
                        
                        {/* Block */}
                        <div>
                          <a
                            href={`https://injscan.com/block/${tx.block}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                          >
                            #{tx.block}
                          </a>
                        </div>
                        
                        {/* Amount */}
                        <div className="text-right">
                          <p className="font-mono text-sm text-foreground">
                            {tx.amount} {tx.token}
                          </p>
                        </div>
                        
                        {/* Time */}
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">{tx.time}</p>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="rounded-lg bg-white/[0.02] border border-white/[0.05] p-4 text-center">
                    <p className="text-muted-foreground">No recent transactions</p>
                  </div>
                )}
              </div>
            </FuturisticCard>
          </>
        )}

        {/* QR Code Modal */}
        {showQR && walletData && (
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
                    value={walletData.address}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Address:</p>
                  <p className="font-mono text-sm text-foreground break-all px-4">
                    {walletData.address}
                  </p>
                </div>
              </div>
            </FuturisticCard>
          </div>
        )}
      </div>
    </>
  )
}
