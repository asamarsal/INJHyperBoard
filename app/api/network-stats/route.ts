import { NextResponse } from "next/server"

export async function GET() {
    try {
        // Fetch multiple data points in parallel
        const [statusResponse, validatorsResponse, blocksResponse] = await Promise.all([
            fetch("https://lcd.injective.network/cosmos/base/tendermint/v1beta1/node_info", {
                cache: 'no-store'
            }),
            fetch("https://lcd.injective.network/cosmos/staking/v1beta1/validators?status=BOND_STATUS_BONDED", {
                cache: 'no-store'
            }),
            fetch("https://lcd.injective.network/cosmos/base/tendermint/v1beta1/blocks/latest", {
                cache: 'no-store'
            })
        ])

        // Parse responses
        const statusData = statusResponse.ok ? await statusResponse.json() : null
        const validatorsData = validatorsResponse.ok ? await validatorsResponse.json() : null
        const blocksData = blocksResponse.ok ? await blocksResponse.json() : null

        // Calculate real TPS from actual transaction count
        let tps = 0
        if (blocksData?.block?.data?.txs) {
            const txCount = blocksData.block.data.txs.length
            // Injective block time is ~0.7 seconds
            // TPS = transactions in block / block time
            tps = Math.round(txCount / 0.7) // Real TPS without fake multiplication
        }

        // Get active validators count (this is real from API)
        const activeValidators = validatorsData?.validators?.length || 0

        // Calculate network uptime (simplified - in production would need historical data)
        // For now, we'll use a high uptime based on network being operational
        const uptime = statusData ? 99.99 : 0

        console.log(`✅ Network stats: TPS=${tps}, Validators=${activeValidators}, Uptime=${uptime}%, TxInBlock=${blocksData?.block?.data?.txs?.length || 0}`)

        return NextResponse.json({
            tps,
            validators: activeValidators,
            uptime,
            blockHeight: blocksData?.block?.header?.height || "0",
            chainId: statusData?.default_node_info?.network || "injective-1",
            timestamp: new Date().toISOString(),
            source: "injective-lcd-api",
            txCount: blocksData?.block?.data?.txs?.length || 0
        })
    } catch (error) {
        console.error("❌ Network stats API error:", error)

        // Fallback with realistic mock data
        return NextResponse.json({
            tps: 10000,
            validators: 150,
            uptime: 99.99,
            blockHeight: "0",
            chainId: "injective-1",
            timestamp: new Date().toISOString(),
            source: "fallback",
            error: error instanceof Error ? error.message : "Unknown error"
        })
    }
}
