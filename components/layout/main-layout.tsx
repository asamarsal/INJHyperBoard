"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Sidebar } from "./sidebar"
import { Footer } from "./footer"
import { SidebarProvider, useSidebar } from "@/components/providers/sidebar-provider"
import { cn } from "@/lib/utils"

function MainLayoutContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar()
  const [isLogoVisible, setIsLogoVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 30) {
        // Scrolling down & past 30px
        setIsLogoVisible(false)
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsLogoVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <div className="min-h-screen bg-[#030712] cyber-grid">
      {/* Ambient glow effects */}
      <div className="pointer-events-none fixed left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-cyan-500/[0.03] blur-[100px]" />
      <div className="pointer-events-none fixed bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-fuchsia-500/[0.03] blur-[100px]" />

      <Sidebar />
      
      {/* Injective Logo - Top Right (Aligned with Dashboard header, hidden when scrolled) */}
      <div className={cn(
        "absolute right-8 top-8 z-30 transition-all duration-300 hidden md:block group cursor-pointer",
        isLogoVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        <Image 
          src="/images/injective-inj-logo.png" 
          alt="Injective Logo" 
          width={48} 
          height={48}
          className="object-contain drop-shadow-[0_0_15px_rgba(0,255,255,0.5)] transition-transform duration-500 group-hover:rotate-180 group-hover:scale-110"
        />
      </div>

      <main
        className={cn(
          "min-h-screen transition-[margin,padding] duration-500 ease-in-out",
          "p-4 pt-20 md:p-8 md:pt-8", // Mobile: top padding for navbar
          isCollapsed ? "md:ml-20" : "md:ml-64" // Desktop: sidebar margin
        )}
      >
        {children}
      </main>

      <Footer isCollapsed={isCollapsed} />
    </div>
  )
}

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <MainLayoutContent>{children}</MainLayoutContent>
    </SidebarProvider>
  )
}
