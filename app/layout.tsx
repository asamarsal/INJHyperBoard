import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Orbitron } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" })

export const metadata: Metadata = {
  title: "InjHyperBoard",
  description: "Next-generation Web3 control interface for Injective blockchain",
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
      <body className={`font-sans antialiased ${_orbitron.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
