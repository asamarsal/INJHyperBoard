"use client"

import { useState } from "react"
import { Search, FileCode, ChevronDown, ChevronRight, Play, Eye, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FuturisticCard } from "@/components/ui/futuristic-card"

interface ContractFunction {
  name: string
  type: "read" | "write"
  inputs: { name: string; type: string }[]
  description: string
}

const mockFunctions: ContractFunction[] = [
  {
    name: "balanceOf",
    type: "read",
    inputs: [{ name: "account", type: "address" }],
    description: "Returns the token balance of a given account",
  },
  { name: "totalSupply", type: "read", inputs: [], description: "Returns the total token supply" },
  { name: "decimals", type: "read", inputs: [], description: "Returns the number of decimals used by the token" },
  { name: "symbol", type: "read", inputs: [], description: "Returns the token symbol" },
  { name: "name", type: "read", inputs: [], description: "Returns the token name" },
]

export function ContractExplorer() {
  const [address, setAddress] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)
  const [expandedFunction, setExpandedFunction] = useState<string | null>(null)
  const [inputValues, setInputValues] = useState<Record<string, string>>({})
  const [results, setResults] = useState<Record<string, string>>({})

  const handleSearch = () => {
    if (address.trim()) {
      setIsLoaded(true)
    }
  }

  const handleExecute = (funcName: string) => {
    const mockResults: Record<string, string> = {
      balanceOf: "1,234,567.89 INJ",
      totalSupply: "100,000,000 INJ",
      decimals: "18",
      symbol: "INJ",
      name: "Injective Token",
    }
    setResults((prev) => ({ ...prev, [funcName]: mockResults[funcName] || "0" }))
  }

  return (
    <div className="space-y-6">
      <FuturisticCard glowColor="magenta" delay={0.1}>
        <div className="relative flex gap-3">
          <div className="relative flex-1">
            <Input
              placeholder="Enter contract address (e.g., inj1...)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="h-12 border-white/[0.08] bg-white/[0.02] pl-12 font-mono text-sm focus:border-fuchsia-500/50"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <FileCode className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          </div>
          <Button
            onClick={handleSearch}
            className="h-12 gap-2 bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30 px-6 hover:bg-fuchsia-500/30 hover:shadow-[0_0_20px_rgba(255,0,255,0.3)]"
          >
            <Search className="h-4 w-4" />
            Load Contract
          </Button>
        </div>
      </FuturisticCard>

      {isLoaded && (
        <>
          <FuturisticCard glowColor="magenta" delay={0.2}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-fuchsia-500/20">
                  <Code className="h-6 w-6 text-fuchsia-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Token Contract</h3>
                  <p className="font-mono text-sm text-muted-foreground">{address || "inj1abc...xyz"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 text-xs font-medium text-emerald-400">
                  Verified
                </span>
                <span className="rounded-full bg-cyan-500/20 border border-cyan-500/30 px-3 py-1 text-xs font-medium text-cyan-400">
                  CW20
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-white/[0.02] border border-white/[0.05] p-4">
                <p className="text-sm text-muted-foreground">Total Transactions</p>
                <p className="font-mono text-xl font-semibold text-foreground">12,456</p>
              </div>
              <div className="rounded-lg bg-white/[0.02] border border-white/[0.05] p-4">
                <p className="text-sm text-muted-foreground">Holders</p>
                <p className="font-mono text-xl font-semibold text-foreground">8,932</p>
              </div>
              <div className="rounded-lg bg-white/[0.02] border border-white/[0.05] p-4">
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-mono text-xl font-semibold text-foreground">45 days ago</p>
              </div>
            </div>
          </FuturisticCard>

          <FuturisticCard glowColor="cyan" delay={0.3}>
            <div className="mb-4 flex items-center gap-2">
              <Eye className="h-5 w-5 text-cyan-400" />
              <h3 className="text-lg font-semibold text-foreground">Read Functions</h3>
              <span className="rounded-full bg-cyan-500/20 border border-cyan-500/30 px-2 py-0.5 text-xs text-cyan-400">
                {mockFunctions.length} available
              </span>
            </div>

            <div className="space-y-3">
              {mockFunctions.map((func) => (
                <div
                  key={func.name}
                  className="overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.02] transition-all duration-300 hover:border-cyan-500/30"
                >
                  <button
                    onClick={() => setExpandedFunction(expandedFunction === func.name ? null : func.name)}
                    className="flex w-full items-center justify-between p-4"
                  >
                    <div className="flex items-center gap-3">
                      {expandedFunction === func.name ? (
                        <ChevronDown className="h-4 w-4 text-cyan-400" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="font-mono font-medium text-foreground">{func.name}</span>
                      {func.inputs.length > 0 && (
                        <span className="text-sm text-muted-foreground">
                          ({func.inputs.map((i) => `${i.name}: ${i.type}`).join(", ")})
                        </span>
                      )}
                    </div>
                    <span className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 text-xs text-cyan-400">
                      view
                    </span>
                  </button>

                  {expandedFunction === func.name && (
                    <div className="border-t border-white/[0.08] bg-black/20 p-4">
                      <p className="mb-4 text-sm text-muted-foreground">{func.description}</p>

                      {func.inputs.length > 0 && (
                        <div className="mb-4 space-y-3">
                          {func.inputs.map((input) => (
                            <div key={input.name}>
                              <label className="mb-1 block text-sm text-muted-foreground">
                                {input.name} ({input.type})
                              </label>
                              <Input
                                placeholder={`Enter ${input.name}...`}
                                value={inputValues[`${func.name}-${input.name}`] || ""}
                                onChange={(e) =>
                                  setInputValues((prev) => ({
                                    ...prev,
                                    [`${func.name}-${input.name}`]: e.target.value,
                                  }))
                                }
                                className="font-mono text-sm border-white/[0.08] bg-white/[0.02]"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <Button
                          onClick={() => handleExecute(func.name)}
                          className="gap-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30"
                        >
                          <Play className="h-4 w-4" />
                          Query
                        </Button>
                        {results[func.name] && (
                          <div className="flex-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-2">
                            <span className="text-sm text-muted-foreground">Result: </span>
                            <span className="font-mono font-medium text-emerald-400">{results[func.name]}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </FuturisticCard>
        </>
      )}
    </div>
  )
}
