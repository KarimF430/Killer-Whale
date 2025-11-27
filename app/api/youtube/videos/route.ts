import { NextResponse } from 'next/server'

// Helper function to format view count
function formatViewCount(count: number): string {
    if (count >= 1000000) {
        return (count / 1000000).toFixed(1) + 'M'
    } else if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'K'
    }
    return count.toString()
}

// Helper function to format published date
function formatPublishedDate(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`
    return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? 's' : ''} ago`
}

// Helper function to parse ISO 8601 duration to readable format
function parseDuration(duration: string): string {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
    if (!match) return '0:00'

    const hours = (match[1] || '').replace('H', '')
    const minutes = (match[2] || '').replace('M', '')
    const seconds = (match[3] || '').replace('S', '')

    if (hours) {
        return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`
    }
    return `${minutes || '0'}:${seconds.padStart(2, '0')}`
}

export async function GET() {
    try {
        // Get API key from environment variables (server-side only)
        const apiKey = process.env.YOUTUBE_API_KEY
        const channelId = process.env.YOUTUBE_CHANNEL_ID || '@motoroctane'

        if (!apiKey) {
            console.log('ℹ️ YouTube API key not configured - returning fallback videos')
            return NextResponse.json({
                featuredVideo: {
                    id: 'placeholder',
                    title: 'Maruti Suzuki Grand Vitara Detailed Review | Hybrid vs Petrol | Which One to Buy?',
                    thumbnail: 'https://img.youtube.com/vi/hVdKkXyXkS0/maxresdefault.jpg',
                    duration: '12:45',
                    views: '2.5M',
                    likes: '45K',
                    publishedAt: '2 days ago',
                    channelName: 'MotorOctane'
                },
                relatedVideos: [
                    {
                        id: 'placeholder1',
                        title: 'Top 5 Cars Under 10 Lakhs in 2024',
                        thumbnail: 'https://img.youtube.com/vi/Qy8qg5y5x5c/maxresdefault.jpg',
                        duration: '8:30',
                        views: '1.2M',
                        likes: '28K',
                        publishedAt: '1 week ago',
                        channelName: 'MotorOctane'
                    },
                    {
                        id: 'placeholder2',
                        title: 'Electric vs Petrol Cars: Complete Cost Analysis',
                        thumbnail: 'https://img.youtube.com/vi/7y8qg5y5x5c/maxresdefault.jpg',
                        duration: '15:20',
                        views: '890K',
                        likes: '19K',
                        publishedAt: '3 days ago',
                        channelName: 'MotorOctane'
                    },
                    {
                        id: 'placeholder3',
                        title: 'Hyundai Creta 2024 First Drive Review',
                        thumbnail: 'https://img.youtube.com/vi/9y8qg5y5x5c/maxresdefault.jpg',
                        duration: '10:15',
                        views: '1.8M',
                        likes: '35K',
                        publishedAt: '5 days ago',
                        channelName: 'MotorOctane'
                    }
                ]
            })
        }

        // If channelId is a handle (starts with @), we need to get the actual channel ID first
        let actualChannelId = channelId
        if (channelId.startsWith('@')) {
            const searchResponse = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${channelId}&type=channel&key=${apiKey}`
            )
            const searchData = await searchResponse.json()

            if (searchData.error) {
                throw new Error(searchData.error.message)
            }

            if (searchData.items && searchData.items.length > 0) {
                actualChannelId = searchData.items[0].snippet.channelId
            }
        }

        // Fetch latest videos from the channel
        const videosResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${actualChannelId}&part=snippet,id&order=date&maxResults=4&type=video`
        )

        if (!videosResponse.ok) {
            const errorData = await videosResponse.json().catch(() => ({}))
            if (errorData.error?.message?.includes('quota')) {
                console.warn('⚠️ YouTube API quota exceeded - returning fallback')
                return NextResponse.json({
                    featuredVideo: {
                        id: 'placeholder',
                        title: 'Maruti Suzuki Grand Vitara Detailed Review | Hybrid vs Petrol | Which One to Buy?',
                        thumbnail: 'https://img.youtube.com/vi/hVdKkXyXkS0/maxresdefault.jpg',
                        duration: '12:45',
                        views: '2.5M',
                        likes: '45K',
                        publishedAt: '2 days ago',
                        channelName: 'MotorOctane'
                    },
                    relatedVideos: []
                })
            }
            throw new Error(errorData.error?.message || 'Failed to fetch YouTube videos')
        }

        const videosData = await videosResponse.json()

        if (!videosData.items || videosData.items.length === 0) {
            throw new Error('No videos found')
        }

        // Get video IDs
        const videoIds = videosData.items.map((item: any) => item.id.videoId).join(',')

        // Fetch video statistics and content details
        const statsResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoIds}&part=statistics,contentDetails,snippet`
        )

        const statsData = await statsResponse.json()

        // Transform the data
        const videos = statsData.items.map((item: any) => ({
            id: item.id,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.high.url,
            duration: parseDuration(item.contentDetails.duration),
            views: formatViewCount(parseInt(item.statistics.viewCount)),
            likes: formatViewCount(parseInt(item.statistics.likeCount || '0')),
            publishedAt: formatPublishedDate(item.snippet.publishedAt),
            channelName: item.snippet.channelTitle
        }))

        // Return featured video (first one) and related videos (rest)
        return NextResponse.json({
            featuredVideo: videos[0],
            relatedVideos: videos.slice(1)
        })

    } catch (error) {
        console.error('Error fetching YouTube videos:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to load videos' },
            { status: 500 }
        )
    }
}
