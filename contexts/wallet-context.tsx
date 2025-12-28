"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { WalletStrategy } from '@injectivelabs/wallet-ts'
import { ChainId } from '@injectivelabs/ts-types'

interface WalletContextType {
  address: string | null
  isConnected: boolean
  isConnecting: boolean
  connect: (walletType: string) => Promise<void>
  disconnect: () => void
  error: string | null
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [walletStrategy, setWalletStrategy] = useState<WalletStrategy | null>(null)

  useEffect(() => {
    // Initialize wallet strategy
    const strategy = new WalletStrategy({
      chainId: ChainId.Mainnet,
    })
    setWalletStrategy(strategy)

    // Check if wallet was previously connected
    const savedAddress = localStorage.getItem('injective_wallet_address')
    if (savedAddress) {
      setAddress(savedAddress)
    }
  }, [])

  const connect = async (walletType: string) => {
    if (!walletStrategy) return
    
    setIsConnecting(true)
    setError(null)

    try {
      // Set wallet type (Keplr, Leap, MetaMask, etc.)
      await walletStrategy.setWallet(walletType as any)
      
      // Get addresses
      const addresses = await walletStrategy.getAddresses()
      
      if (addresses && addresses.length > 0) {
        const injAddress = addresses[0]
        setAddress(injAddress)
        localStorage.setItem('injective_wallet_address', injAddress)
      }
    } catch (err) {
      console.error('Wallet connection error:', err)
      setError(err instanceof Error ? err.message : 'Failed to connect wallet')
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    setAddress(null)
    localStorage.removeItem('injective_wallet_address')
  }

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected: !!address,
        isConnecting,
        connect,
        disconnect,
        error,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}
