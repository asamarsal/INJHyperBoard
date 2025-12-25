import { NextResponse } from "next/server"

export async function GET() {
    try {
        // Fetch INJ price from CoinGecko API
        const response = await fetch(
            "https://api.coingecko.com/api/v3/simple/price?ids=injective-protocol&vs_currencies=usd&include_24hr_change=true",
            {
                next: { revalidate: 60 }, // Cache for 60 seconds
            }
        )

        if (!response.ok) {
            throw new Error("Failed to fetch price from CoinGecko")
        }

        const data = await response.json()

        const injData = data["injective-protocol"]

        if (!injData) {
            throw new Error("INJ data not found in response")
        }

        return NextResponse.json({
            price: injData.usd,
            change24h: injData.usd_24h_change,
            timestamp: new Date().toISOString(),
        })
    } catch (error) {
        console.error("Error fetching INJ price:", error)
        return NextResponse.json(
            {
                error: "Failed to fetch INJ price",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        )
    }
}
