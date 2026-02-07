import { NextRequest, NextResponse } from 'next/server'

// Use Node.js runtime for Vercel Free plan compatibility
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    try {
        // Get search query from URL parameters
        const { searchParams } = new URL(request.url)
        const searchQuery = searchParams.get('search')

        // Construct backend URL
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
        let url = `${backendUrl}/api/youtube/videos`;

        if (searchQuery) {
            url += `?search=${encodeURIComponent(searchQuery)}`;
        }

        console.log(`[YouTube API] Fetching from: ${url}`);

        // Fetch from backend
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            cache: 'no-store'
        });

        console.log(`[YouTube API] Response status: ${response.status}, Content-Type: ${response.headers.get('content-type')}`);

        // Check if response is JSON before parsing
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            console.error('[YouTube API] Received non-JSON response:', text.substring(0, 200));
            return NextResponse.json({
                error: 'Backend returned invalid response',
                message: 'Unexpected response format from backend'
            }, { status: 500 });
        }

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data);

    } catch (error) {
        console.error('Error in YouTube API route:', error)
        return NextResponse.json({
            error: 'Internal server error',
            message: 'Failed to retrieve videos'
        }, { status: 500 })
    }
}
