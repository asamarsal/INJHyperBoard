import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function POST(request: NextRequest) {
    try {
        const { message } = await request.json()

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 })
        }

        const apiKey = process.env.GEMINI_API_KEY

        if (!apiKey) {
            return NextResponse.json(
                { error: "Gemini API key not configured. Please add GEMINI_API_KEY to your .env.local file" },
                { status: 500 }
            )
        }

        // Check if user is asking about price
        const isPriceQuery = message.toLowerCase().includes("price") ||
            message.toLowerCase().includes("cost") ||
            message.toLowerCase().includes("worth") ||
            message.toLowerCase().includes("value")

        let priceInfo = ""

        if (isPriceQuery) {
            try {
                // Fetch real-time price from our API
                const priceResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/price`)
                if (priceResponse.ok) {
                    const priceData = await priceResponse.json()
                    const trend = priceData.change24h >= 0 ? "up" : "down"
                    const trendSymbol = priceData.change24h >= 0 ? "📈" : "📉"

                    priceInfo = `\n\n**REAL-TIME INJ PRICE DATA:**
- Current Price: $${priceData.price.toFixed(2)} USD
- 24h Change: ${priceData.change24h >= 0 ? '+' : ''}${priceData.change24h.toFixed(2)}% ${trendSymbol}
- Trend: ${trend === 'up' ? 'Bullish' : 'Bearish'}
- Last Updated: ${new Date(priceData.timestamp).toLocaleString()}

`
                }
            } catch (error) {
                console.warn("Could not fetch real-time price:", error)
            }
        }

        // Read the Injective context from the markdown file
        const contextPath = path.join(
            process.cwd(),
            "app",
            "api",
            "chatbot",
            "injective-context.md"
        )

        let injectiveContext = ""

        try {
            injectiveContext = fs.readFileSync(contextPath, "utf-8")
        } catch {
            console.warn("Could not read injective-context.md, using basic context")
            injectiveContext =
                "Injective is a lightning-fast blockchain built for finance with instant finality and near-zero gas fees."
        }

        // Call Gemini 2.5 Flash API
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: `You are an AI assistant specialized in the Injective blockchain protocol and ecosystem.

IMPORTANT INSTRUCTIONS:
- Use the context provided below to answer questions accurately
- If the answer is in the context, provide detailed and helpful information
- If the question is outside the context, politely indicate that and provide general blockchain knowledge if relevant
- Be conversational, friendly, and educational
- Format responses in a clear, easy-to-read manner
- Always cite specific features or facts when available
- When real-time price data is provided, ALWAYS include it in your response

CONTEXT (Injective Knowledge Base):
${injectiveContext}
${priceInfo}

---

USER QUESTION: ${message}

Please provide a helpful, accurate, and well-structured response based on the context above.`,
                                },
                            ],
                        },
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1024,
                    },
                }),
            }
        )

        if (!response.ok) {
            const errorData = await response.json()
            console.error("Gemini API error:", errorData)
            return NextResponse.json(
                { error: "Failed to get response from Gemini API", details: errorData },
                { status: response.status }
            )
        }

        const data = await response.json()

        const generatedText =
            data.candidates?.[0]?.content?.parts?.[0]?.text ??
            "I apologize, but I couldn't generate a response. Please try again."

        return NextResponse.json({ response: generatedText })
    } catch (error) {
        console.error("Error in chatbot API:", error)
        return NextResponse.json(
            {
                error: "Internal server error",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        )
    }
}
