import { Router } from 'express';
import type { IStorage } from '../storage';

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Helper function to format view count
function formatViewCount(count: number): string {
    if (count >= 1000000) {
        return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
}

// Helper function to format published date
function formatPublishedDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? 's' : ''} ago`;
}

// Helper function to parse ISO 8601 duration to readable format
function parseDuration(duration: string): string {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return '0:00';

    const hours = (match[1] || '').replace('H', '');
    const minutes = (match[2] || '').replace('M', '');
    const seconds = (match[3] || '').replace('S', '');

    if (hours) {
        return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    }
    return `${minutes || '0'}:${seconds.padStart(2, '0')}`;
}

async function fetchYouTubeVideos(apiKey: string, channelId: string, searchQuery?: string) {
    // If channelId is a handle (starts with @), we need to get the actual channel ID first
    let actualChannelId = channelId;
    if (channelId.startsWith('@')) {
        const searchResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${channelId}&type=channel&key=${apiKey}`
        );
        const searchData = await searchResponse.json();

        if (searchData.error) {
            throw new Error(searchData.error.message);
        }

        if (searchData.items && searchData.items.length > 0) {
            actualChannelId = searchData.items[0].snippet.channelId;
        }
    }

    // Build search URL with optional search query
    let searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${actualChannelId}&part=snippet,id&order=date&maxResults=4&type=video`;

    if (searchQuery) {
        // Add search query for model-specific videos
        searchUrl += `&q=${encodeURIComponent(`"${searchQuery}"`)}`;
    }

    // Fetch latest videos from the channel
    const videosResponse = await fetch(searchUrl);

    if (!videosResponse.ok) {
        const errorData = await videosResponse.json().catch(() => ({}));
        if (errorData.error?.message?.includes('quota')) {
            throw new Error('QUOTA_EXCEEDED');
        }
        throw new Error(errorData.error?.message || 'Failed to fetch YouTube videos');
    }

    const videosData = await videosResponse.json();

    if (!videosData.items || videosData.items.length === 0) {
        throw new Error('No videos found');
    }

    // Get video IDs
    const videoIds = videosData.items.map((item: any) => item.id.videoId).join(',');

    // Fetch video statistics and content details
    const statsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoIds}&part=statistics,contentDetails,snippet`
    );

    const statsData = await statsResponse.json();

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
    }));

    // Return featured video (first one) and related videos (rest)
    return {
        featuredVideo: videos[0],
        relatedVideos: videos.slice(1)
    };
}

export default function createYouTubeRoutes(storage: IStorage): Router {
    const router = Router();

    router.get('/videos', async (req, res) => {
        try {
            const searchQuery = req.query.search as string | undefined;

            // For search queries, fetch fresh data (model-specific videos)
            if (searchQuery) {
                // Try to get from Redis cache first
                try {
                    const { getCacheRedisClient } = await import('../config/redis-config');
                    const redis = getCacheRedisClient();

                    if (redis) {
                        const cacheKey = `youtube:search:${searchQuery.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
                        const cachedData = await redis.get(cacheKey);

                        if (cachedData) {
                            const parsed = JSON.parse(cachedData);
                            const cacheAge = Date.now() - parsed.timestamp;
                            const minutesOld = Math.floor(cacheAge / 1000 / 60);

                            console.log(`✅ YouTube search cache hit for "${searchQuery}" (age: ${minutesOld} minutes)`);
                            return res.json({
                                ...parsed.data,
                                cached: true,
                                cacheAge: minutesOld
                            });
                        }
                    }
                } catch (cacheError) {
                    console.warn('⚠️ Redis cache check failed for search query:', cacheError);
                    // Continue to fetch fresh data if cache fails
                }

                const apiKey = process.env.YOUTUBE_API_KEY;
                const channelId = process.env.YOUTUBE_CHANNEL_ID || '@motoroctane';

                if (!apiKey) {
                    console.log('ℹ️ YouTube API key not configured - cannot fetch search results');
                    return res.status(503).json({ error: 'API key not configured' });
                }

                try {
                    const freshData = await fetchYouTubeVideos(apiKey, channelId, searchQuery);
                    console.log(`✅ Fetched model-specific videos for: ${searchQuery}`);

                    // Save to Redis cache
                    try {
                        const { getCacheRedisClient } = await import('../config/redis-config');
                        const redis = getCacheRedisClient();

                        if (redis) {
                            const cacheKey = `youtube:search:${searchQuery.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
                            const cacheData = {
                                data: freshData,
                                timestamp: Date.now()
                            };
                            const TTL = 48 * 60 * 60; // 48 hours

                            await redis.setex(cacheKey, TTL, JSON.stringify(cacheData));
                            console.log(`💾 Cached search results for "${searchQuery}" (TTL: 48h)`);
                        }
                    } catch (saveError) {
                        console.warn('⚠️ Failed to save search results to Redis:', saveError);
                    }

                    return res.json({
                        ...freshData,
                        cached: false
                    });
                } catch (error) {
                    console.error('YouTube search API error:', error);
                    return res.status(503).json({ error: 'Failed to fetch videos' });
                }
            }

            // For general videos, use scheduled cache from persistent storage
            const cache = await storage.getYouTubeCache();

            if (!cache) {
                console.log('📺 YouTube cache is empty - waiting for scheduled fetch');
                return res.status(503).json({
                    error: 'No videos available',
                    message: 'Fresh content will be available soon'
                });
            }

            // Check if cache is still valid (within 24 hours)
            const cacheAge = Date.now() - cache.timestamp;
            if (cacheAge >= CACHE_DURATION) {
                const hoursOld = Math.floor(cacheAge / 1000 / 60 / 60);
                console.log(`⏰ YouTube cache expired (${hoursOld} hours old) - waiting for next scheduled fetch`);
                return res.status(503).json({
                    error: 'Cache expired',
                    message: 'Fresh content will be available at the next scheduled update'
                });
            }

            // Cache is valid, return it
            const minutesOld = Math.floor(cacheAge / 1000 / 60);
            console.log(`✅ Serving YouTube videos from persistent cache (age: ${minutesOld} minutes)`);

            return res.json({
                ...cache.data,
                cached: true,
                cacheAge: minutesOld
            });

        } catch (error) {
            console.error('Error in YouTube API route:', error);
            return res.status(500).json({
                error: 'Internal server error',
                message: 'Failed to retrieve videos'
            });
        }
    });

    // Manual refresh endpoint (for production when Shell is not available)
    router.post('/force-refresh', async (req, res) => {
        try {
            console.log('🔄 Manual YouTube fetch triggered via API');
            const { fetchAndCacheYouTubeVideos } = await import('../scheduled-youtube-fetch');
            await fetchAndCacheYouTubeVideos(storage);
            return res.json({
                success: true,
                message: 'YouTube cache refreshed successfully'
            });
        } catch (error) {
            console.error('Manual fetch failed:', error);
            return res.status(500).json({
                success: false,
                error: 'Fetch failed',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });

    // GET version for easy browser access
    router.get('/force-refresh', async (req, res) => {
        try {
            console.log('🔄 Manual YouTube fetch triggered via browser');
            const { fetchAndCacheYouTubeVideos } = await import('../scheduled-youtube-fetch');
            await fetchAndCacheYouTubeVideos(storage);
            return res.send(`
                <html>
                    <body style="font-family: Arial; padding: 40px; text-align: center;">
                        <h1 style="color: green;">✅ Success!</h1>
                        <p>YouTube cache has been refreshed successfully.</p>
                        <p>You can now close this window and check your website.</p>
                    </body>
                </html>
            `);
        } catch (error) {
            console.error('Manual fetch failed:', error);
            return res.status(500).send(`
                <html>
                    <body style="font-family: Arial; padding: 40px; text-align: center;">
                        <h1 style="color: red;">❌ Error</h1>
                        <p>Failed to refresh cache: ${error instanceof Error ? error.message : 'Unknown error'}</p>
                    </body>
                </html>
            `);
        }
    });

    return router;
}
