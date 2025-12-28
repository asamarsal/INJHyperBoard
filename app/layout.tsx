import type React from "react"
import type { Metadata } from "next"
import { Orbitron, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SidebarProvider } from "@/components/providers/sidebar-provider"
import { WalletProvider } from "@/contexts/wallet-context"
import "./globals.css"

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400", "500", "600", "700", "800", "900"],
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "INJHyperBoard - Injective Blockchain Dashboard",
  description: "Your unified control center for Injective blockchain tools",
  generator: 'InjHyperBoard',
  icons: {
    icon: '/images/icononly-black.png',
    shortcut: '/images/icononly-black.png',
    apple: '/images/icononly-black.png',
  },
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${orbitron.variable} ${inter.variable} font-sans antialiased`}>
        <WalletProvider>
          <SidebarProvider>
            {children}
          </SidebarProvider>
        </WalletProvider>
        <Analytics />
      </body>
    </html>
  )
}
