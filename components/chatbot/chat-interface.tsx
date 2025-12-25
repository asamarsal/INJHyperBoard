"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { FuturisticCard } from "@/components/ui/futuristic-card"
import { parseMarkdownToHTML } from "@/lib/markdown-parser"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Welcome to the Injective AI Assistant. I can help you understand Injective protocol, smart contracts, transactions, and more. What would you like to know?",
    timestamp: new Date(),
  },
]



export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = input
    setInput("")
    setIsTyping(true)

    try {
      // Call the Gemini API endpoint
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: currentInput }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response")
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error calling chatbot API:", error)
      
      // Show error message to user
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : "Unknown error"}. Please make sure your Gemini API key is configured in the .env.local file.`,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <FuturisticCard glowColor="cyan" className="p-0 overflow-hidden" delay={0.1}>
      <div className="flex h-[calc(100vh-12rem)] sm:h-[calc(100vh-10rem)] flex-col">
        {/* Chat Header */}
        <div className="flex items-center gap-2 sm:gap-3 border-b border-white/[0.08] px-3 sm:px-6 py-3 sm:py-4 bg-white/[0.02]">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/20">
              <Bot className="h-5 w-5 text-cyan-400" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0a0f1a] bg-emerald-500 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-foreground">Injective AI Assistant</h2>
            <p className="text-xs text-muted-foreground">Ask anything about Injective</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6">
          <div className="space-y-4 sm:space-y-6">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={cn("flex gap-3", message.role === "user" ? "flex-row-reverse" : "flex-row")}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    message.role === "user" ? "bg-fuchsia-500/20" : "bg-cyan-500/20",
                  )}
                >
                  {message.role === "user" ? (
                    <User className="h-4 w-4 text-fuchsia-400" />
                  ) : (
                    <Sparkles className="h-4 w-4 text-cyan-400" />
                  )}
                </div>
                <div
                  className={cn(
                    "max-w-[85%] sm:max-w-[70%] rounded-xl px-3 sm:px-4 py-2 sm:py-3 border",
                    message.role === "user"
                      ? "bg-fuchsia-500/10 border-fuchsia-500/20"
                      : "bg-cyan-500/5 border-cyan-500/20",
                  )}
                >
                  <div 
                    className="text-sm leading-relaxed text-foreground [&>p]:mb-3 [&>p:last-child]:mb-0 [&>strong]:font-semibold [&>strong]:text-cyan-300 [&>em]:italic [&>ul]:my-2 [&>ul]:space-y-1.5 [&>li]:leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: parseMarkdownToHTML(message.content) }}
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20">
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                </div>
                <div className="flex items-center gap-1 rounded-xl bg-cyan-500/5 border border-cyan-500/20 px-4 py-3">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-cyan-400 [animation-delay:-0.3s]" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-cyan-400 [animation-delay:-0.15s]" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-cyan-400" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="border-t border-white/[0.08] px-4 py-3 bg-white/[0.02]">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setInput("What is Injective?")}
              className="px-3 py-1.5 text-xs rounded-lg border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/50 transition-all duration-200"
            >
              What is Injective?
            </button>
            <button
              type="button"
              onClick={() => setInput("What is the current INJ price?")}
              className="px-3 py-1.5 text-xs rounded-lg border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/50 transition-all duration-200"
            >
              INJ Price
            </button>
            <button
              type="button"
              onClick={() => setInput("How do I stake INJ tokens?")}
              className="px-3 py-1.5 text-xs rounded-lg border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/50 transition-all duration-200"
            >
              How to Stake
            </button>
            <button
              type="button"
              onClick={() => setInput("What are the gas fees on Injective?")}
              className="px-3 py-1.5 text-xs rounded-lg border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/50 transition-all duration-200"
            >
              Gas Fees
            </button>
            <button
              type="button"
              onClick={() => setInput("How does the Injective Bridge work?")}
              className="px-3 py-1.5 text-xs rounded-lg border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/50 transition-all duration-200"
            >
              Bridge Guide
            </button>
          </div>
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="border-t border-white/[0.08] p-4 bg-white/[0.02]">
          <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2 transition-all duration-300 focus-within:border-cyan-500/50 focus-within:shadow-[0_0_20px_rgba(0,255,255,0.15)]">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Injective..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="rounded-lg bg-cyan-500/20 p-2 text-cyan-400 transition-all duration-300 hover:bg-cyan-500/30 hover:shadow-[0_0_15px_rgba(0,255,255,0.5)] disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Powered by Injective documentation and community knowledge
          </p>
        </form>
      </div>
    </FuturisticCard>
  )
}
