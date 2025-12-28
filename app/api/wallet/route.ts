import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')

    if (!address) {
        return NextResponse.json({ error: 'Address is required' }, { status: 400 })
    }

    // Validate Injective address format
    if (!address.startsWith('inj1')) {
        return NextResponse.json({ error: 'Invalid Injective address format' }, { status: 400 })
    }

    try {
        const LCD_BASE = 'https://lcd.injective.network'
        const INDEXER_BASE = 'https://api.injective.network'

        // Fetch data from multiple endpoints concurrently
        const [balanceRes, delegationsRes, rewardsRes, txsRes] = await Promise.all([
            fetch(`${LCD_BASE}/cosmos/bank/v1beta1/balances/${address}`, { cache: 'no-store' }),
            fetch(`${LCD_BASE}/cosmos/staking/v1beta1/delegations/${address}`, { cache: 'no-store' }),
            fetch(`${LCD_BASE}/cosmos/distribution/v1beta1/delegators/${address}/rewards`, { cache: 'no-store' }),
            fetch(`${INDEXER_BASE}/api/explorer/v1/accountTxs/${address}?limit=10`, { cache: 'no-store' }),
        ])

        // Parse responses
        const balanceData = balanceRes.ok ? await balanceRes.json() : { balances: [] }
        const delegationsData = delegationsRes.ok ? await delegationsRes.json() : { delegation_responses: [] }
        const rewardsData = rewardsRes.ok ? await rewardsRes.json() : { total: [] }
        const txsData = txsRes.ok ? await txsRes.json() : { data: [] }

        console.log('Indexer API response:', txsData)
        console.log('Transactions count:', txsData.data?.length || 0)

        // Find INJ balance (denomination: 'inj')
        const injBalance = balanceData.balances?.find((b: any) => b.denom === 'inj')
        const availableBalance = injBalance ? parseFloat(injBalance.amount) / 1e18 : 0

        // Calculate staked amount
        const stakedBalance = delegationsData.delegation_responses?.reduce((sum: number, del: any) => {
            return sum + (parseFloat(del.balance?.amount || 0) / 1e18)
        }, 0) || 0

        // Calculate claimable rewards
        const claimableRewards = rewardsData.total?.find((r: any) => r.denom === 'inj')
        const rewards = claimableRewards ? parseFloat(claimableRewards.amount) / 1e18 : 0

        // Total balance
        const totalBalance = availableBalance + stakedBalance + rewards

        // Get all tokens (CW20)
        const allTokens = balanceData.balances?.map((token: any) => ({
            denom: token.denom,
            amount: token.denom === 'inj' ? parseFloat(token.amount) / 1e18 : parseFloat(token.amount),
            displayDenom: token.denom === 'inj' ? 'INJ' : token.denom.toUpperCase(),
        })) || []

        // Parse transactions from Indexer API
        const transactions = (txsData.data || []).map((tx: any) => {
            // block_unix_timestamp is already in milliseconds
            const timestamp = new Date(parseInt(tx.block_unix_timestamp))
            const now = new Date()
            const diffMs = now.getTime() - timestamp.getTime()
            const diffMins = Math.floor(diffMs / 60000)

            let timeAgo = ''
            if (diffMins < 1) timeAgo = 'Just now'
            else if (diffMins < 60) timeAgo = `${diffMins} mins ago`
            else if (diffMins < 1440) timeAgo = `${Math.floor(diffMins / 60)} hours ago`
            else timeAgo = `${Math.floor(diffMins / 1440)} days ago`

            // Determine transaction type and amount
            const messages = tx.messages || []
            let type = 'send'
            let amount = '0'
            let token = 'INJ'

            // Check if this address is sender or receiver
            messages.forEach((msg: any) => {
                if (msg.type === '/cosmos.bank.v1beta1.MsgSend') {
                    if (msg.value?.to_address === address) {
                        type = 'receive'
                    }
                    // Parse amount
                    const amountData = msg.value?.amount?.[0]
                    if (amountData) {
                        const amountValue = parseFloat(amountData.amount) / 1e18
                        amount = amountValue.toFixed(4)
                        token = amountData.denom === 'inj' ? 'INJ' : amountData.denom.toUpperCase()
                    }
                }
            })

            return {
                hash: tx.hash.substring(0, 10) + '...' + tx.hash.substring(tx.hash.length - 6),
                fullHash: tx.hash,
                block: tx.block_number || '0',
                status: tx.code === 0 ? 'Success' : 'Failed',
                type: type,
                amount: amount,
                token: token,
                from: messages[0]?.value?.from_address || '',
                to: messages[0]?.value?.to_address || '',
                time: timeAgo,
                timestamp: timestamp.toISOString(),
            }
        })

        console.log('Final transactions array:', transactions)
        console.log('Final transactions length:', transactions.length)

        return NextResponse.json({
            address,
            balance: {
                total: totalBalance,
                available: availableBalance,
                staked: stakedBalance,
                unstaking: 0,
                restaking: 0,
                claimableRewards: rewards,
            },
            tokens: allTokens,
            transactions: transactions,
            delegations: delegationsData.delegation_responses?.length || 0,
            timestamp: new Date().toISOString(),
        })

    } catch (error) {
        console.error('Error fetching wallet data:', error)
        return NextResponse.json(
            { error: 'Failed to fetch wallet data', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}
