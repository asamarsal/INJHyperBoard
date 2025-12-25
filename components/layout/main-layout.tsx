"use client"

import type React from "react"
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
