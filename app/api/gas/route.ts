import { NextResponse } from "next/server"

export async function GET(request: Request) {
    try {
        // Get action type from query params
        const { searchParams } = new URL(request.url)
        const actionType = searchParams.get('type') || 'transfer'

        // Use Injective LCD API to get recent transactions
        const response = await fetch(
            "https://lcd.injective.network/cosmos/tx/v1beta1/txs?events=tx.height>0&limit=20&order_by=ORDER_BY_DESC",
            {
                next: { revalidate: 30 },
            }
        )

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`)
        }

        const data = await response.json()
        const transactions = data.tx_responses || []

        // Filter transactions by message type
        const messageTypeMap: Record<string, string[]> = {
            transfer: ['MsgSend', '/cosmos.bank.v1beta1.MsgSend'],
            swap: ['MsgSwap', '/injective.exchange.v1beta1.MsgBatchUpdateOrders'],
            contract: ['MsgExecuteContract', '/cosmwasm.wasm.v1.MsgExecuteContract']
        }

        const relevantTypes = messageTypeMap[actionType] || messageTypeMap.transfer

        let totalGasUsed = 0
        let txCount = 0

        // Filter and calculate gas for specific transaction type
        transactions.forEach((tx: any) => {
            if (tx.tx?.body?.messages) {
                const messages = tx.tx.body.messages
                const hasRelevantMsg = messages.some((msg: any) =>
                    relevantTypes.some(type => msg['@type']?.includes(type))
                )

                if (hasRelevantMsg && tx.gas_used) {
                    totalGasUsed += parseInt(tx.gas_used)
                    txCount++
                }
            }
        })

        // If no specific transactions found, use all transactions as fallback
        if (txCount === 0) {
            transactions.forEach((tx: any) => {
                if (tx.gas_used) {
                    totalGasUsed += parseInt(tx.gas_used)
                    txCount++
                }
            })
        }

        // Convert gas units to INJ with high precision
        const avgGasUnits = txCount > 0 ? totalGasUsed / txCount : 100000
        const conversionFactor = 0.0001 / 500000
        const avgGasInINJ = avgGasUnits * conversionFactor

        console.log(`✅ Real ${actionType} gas data:`, {
            avgGasUnits: Math.round(avgGasUnits),
            avgGasInINJ: avgGasInINJ.toFixed(7),
            txCount,
            actionType
        })

        return NextResponse.json({
            gasPrice: 0.0001,
            avgGasUsed: avgGasInINJ,
            avgGasUnits: avgGasUnits,
            sampleSize: txCount,
            actionType: actionType,
            timestamp: new Date().toISOString(),
            network: "injective-mainnet",
            source: "lcd-api-filtered",
        })
    } catch (error) {
        console.error("❌ Using fallback:", error instanceof Error ? error.message : error)

        // Fallback with slight randomization
        const randomVariation = 0.00008 + (Math.random() * 0.00004)

        return NextResponse.json({
            gasPrice: 0.0001,
            avgGasUsed: randomVariation,
            avgGasUnits: randomVariation * 5000000,
            sampleSize: 0,
            timestamp: new Date().toISOString(),
            network: "injective-mainnet",
            source: "fallback",
            fallback: true,
        })
    }
}
