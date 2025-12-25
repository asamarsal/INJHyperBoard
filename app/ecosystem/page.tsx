"use client"

import { useState, useEffect } from "react"
import { FuturisticCard } from "@/components/ui/futuristic-card"
import { ExternalLink, Rocket, TrendingUp, Users } from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"

interface DApp {
  name: string
  description: string
  category: string
  logo: string
  url: string
  featured?: boolean
}

// Curated list of popular Injective dApps (verified from injhub.com/ecosystem)
const dapps: DApp[] = [
  {
    name: "Helix",
    description: "Premier decentralized exchange on Injective with advanced trading features",
    category: "DeFi",
    logo: "https://willing-flame-a009dd7c0a.media.strapiapp.com/thumbnail_1f52690a_01e9_4da9_b1df_9a01b126e3ef_fe3e0bed3f.webp",
    url: "https://helixapp.com",
    featured: true
  },
  {
    name: "Mito Finance",
    description: "Liquidity infrastructure and automated market maker",
    category: "DeFi",
    logo: "https://willing-flame-a009dd7c0a.media.strapiapp.com/thumbnail_c4bfdc20_66d9_447f_92d7_f1d4d011f1b0_897dc2347f.webp",
    url: "https://mito.fi",
    featured: true
  },
  {
    name: "Hydro Protocol",
    description: "Decentralized perpetual trading platform",
    category: "DeFi",
    logo: "https://willing-flame-a009dd7c0a.media.strapiapp.com/thumbnail_39fcd80e_6de9_4591_8804_0d33d284739e_7c4ff65ebf.webp",
    url: "https://hydro.so",
    featured: true
  },
  {
    name: "Talis Protocol",
    description: "NFT marketplace and launchpad",
    category: "NFT",
    logo: "https://willing-flame-a009dd7c0a.media.strapiapp.com/thumbnail_ec46caed_7691_43b0_85b8_6abd134d31aa_f47af2fb23.webp",
    url: "https://talis.art",
  },
  {
    name: "Stride",
    description: "Liquid staking protocol for the Cosmos ecosystem",
    category: "Apps & Tooling",
    logo: "https://willing-flame-a009dd7c0a.media.strapiapp.com/thumbnail_52d19af2_4c1f_490a_9e9a_51c9cf05af42_29dfcf5af7.webp",
    url: "https://stride.zone",
  },
]

const categories = ["All", "DeFi", "NFT", "Apps & Tooling"]

export default function EcosystemPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [filteredDapps, setFilteredDapps] = useState(dapps)

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredDapps(dapps)
    } else {
      setFilteredDapps(dapps.filter(dapp => dapp.category === selectedCategory))
    }
  }, [selectedCategory])

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div>
            <h1 className="font-[var(--font-orbitron)] text-3xl font-bold text-white sm:text-4xl">
              Injective Ecosystem
            </h1>
            <p className="mt-2 text-slate-400">
              Explore the thriving ecosystem of dApps built on Injective
            </p>
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <FuturisticCard glowColor="cyan" delay={0.1} className="text-center">
              <Rocket className="mx-auto h-8 w-8 text-cyan-400" />
              <p className="mt-2 text-2xl font-bold text-white">100+</p>
              <p className="text-sm text-slate-400">dApps</p>
            </FuturisticCard>
            <FuturisticCard glowColor="magenta" delay={0.15} className="text-center">
              <Users className="mx-auto h-8 w-8 text-fuchsia-400" />
              <p className="mt-2 text-2xl font-bold text-white">100K+</p>
              <p className="text-sm text-slate-400">Active Users</p>
            </FuturisticCard>
            <FuturisticCard glowColor="emerald" delay={0.2} className="text-center">
              <TrendingUp className="mx-auto h-8 w-8 text-emerald-400" />
              <p className="mt-2 text-2xl font-bold text-white">$1B+</p>
              <p className="text-sm text-slate-400">Total Volume</p>
            </FuturisticCard>
          </div>
        </div>

        {/* Category Filter and Explore All Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.3)]"
                    : "bg-white/[0.02] text-slate-400 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Explore All Button */}
          <a
            href="https://injhub.com/ecosystem"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 rounded-xl bg-white/[0.05] backdrop-blur-md border border-white/[0.1] px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-white/[0.1] hover:shadow-[0_0_30px_rgba(0,255,255,0.3)]"
          >
            <span>Explore All</span>
            <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* dApps Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDapps.map((dapp, index) => (
            <FuturisticCard
              key={dapp.name}
              glowColor={dapp.featured ? "cyan" : "magenta"}
              delay={0.1 * index}
              className="group relative overflow-hidden transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-white/[0.05] p-2 overflow-hidden">
                  <img 
                    src={dapp.logo} 
                    alt={`${dapp.name} logo`}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{dapp.name}</h3>
                  <p className="mt-1 text-xs text-slate-500">{dapp.category}</p>
                </div>
              </div>

              {dapp.featured && (
                <div className="mt-3 inline-flex items-center rounded-full bg-white/[0.1] backdrop-blur-md border border-white/[0.2] px-3 py-1 text-xs font-semibold text-white shadow-lg">
                  Featured
                </div>
              )}

              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                {dapp.description}
              </p>

              <a
                href={dapp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center gap-2 text-sm font-medium text-cyan-400 transition-colors hover:text-cyan-300"
              >
                <span>Visit dApp</span>
                <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </FuturisticCard>
          ))}
        </div>

        {/* Empty State */}
        {filteredDapps.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-slate-400">No dApps found in this category</p>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
