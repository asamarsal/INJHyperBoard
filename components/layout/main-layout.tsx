"use client"

import type React from "react"
import Image from "next/image"
import { Sidebar } from "./sidebar"
import { SidebarProvider, useSidebar } from "@/components/providers/sidebar-provider"
import { cn } from "@/lib/utils"

function MainLayoutContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar()

  return (
    <div className="min-h-screen bg-[#030712] cyber-grid">
      {/* Ambient glow effects */}
      <div className="pointer-events-none fixed left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-cyan-500/[0.03] blur-[100px]" />
      <div className="pointer-events-none fixed bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-fuchsia-500/[0.03] blur-[100px]" />

      <Sidebar />
      
      {/* Injective Logo - Top Right */}
      <div className="fixed right-8 top-8 z-30 transition-all duration-300 hover:scale-110">
        <Image 
          src="/images/injective-inj-logo.png" 
          alt="Injective Logo" 
          width={48} 
          height={48}
          className="object-contain drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]"
        />
      </div>

      <main
        className={cn("min-h-screen p-8 transition-[margin] duration-500 ease-in-out", isCollapsed ? "ml-20" : "ml-64")}
      >
        {children}
      </main>
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
