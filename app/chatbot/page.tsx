import { MainLayout } from "@/components/layout/main-layout"
import { ChatInterface } from "@/components/chatbot/chat-interface"

export default function ChatbotPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-[var(--font-orbitron)] text-2xl font-bold tracking-wide text-foreground">AI Chatbot</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Get instant answers about Injective protocol and ecosystem
          </p>
        </div>

        {/* Chat Interface */}
        <ChatInterface />
      </div>
    </MainLayout>
  )
}
