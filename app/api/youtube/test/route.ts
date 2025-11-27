import { NextResponse } from 'next/server'

export async function GET() {
    const apiKey = process.env.YOUTUBE_API_KEY
    const channelId = process.env.YOUTUBE_CHANNEL_ID

    return NextResponse.json({
        hasApiKey: !!apiKey,
        apiKeyLength: apiKey?.length || 0,
        apiKeyPrefix: apiKey?.substring(0, 10) + '...',
        channelId: channelId || 'not set',
        env: {
            NODE_ENV: process.env.NODE_ENV,
            hasNextPublicKey: !!process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
        }
    })
}
