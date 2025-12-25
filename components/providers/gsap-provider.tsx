"use client"

import type React from "react"
import { useEffect, createContext, useContext } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const GSAPContext = createContext<typeof gsap | null>(null)

export function GSAPProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Set default ease
    gsap.defaults({ ease: "power3.out" })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return <GSAPContext.Provider value={gsap}>{children}</GSAPContext.Provider>
}

export function useGSAP() {
  const context = useContext(GSAPContext)
  if (!context) {
    return gsap
  }
  return context
}
