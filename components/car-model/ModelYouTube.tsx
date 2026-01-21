'use client'

import { Play, ExternalLink, Clock, Eye, ThumbsUp } from 'lucide-react'
import { useState, useEffect } from 'react'

interface YouTubeVideo {
    id: string
    title: string
    thumbnail: string
    duration: string
    views: string
    likes: string
    publishedAt: string
    channelName: string
}

interface ModelYouTubeProps {
    brandName: string
    modelName: string
    initialData?: {
        featuredVideo: YouTubeVideo
        relatedVideos: YouTubeVideo[]
    }
}

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

export default function ModelYouTube({ brandName, modelName, initialData }: ModelYouTubeProps) {
    const [featuredVideo, setFeaturedVideo] = useState<YouTubeVideo | null>(initialData?.featuredVideo || null)
    const [relatedVideos, setRelatedVideos] = useState<YouTubeVideo[]>(initialData?.relatedVideos || [])
    const [loading, setLoading] = useState(!initialData)
    const [playingVideo, setPlayingVideo] = useState<string | null>(null)

    useEffect(() => {
        if (initialData) return // Skip if already have data from server

        const fetchModelVideos = async () => {
            try {
                setLoading(true)

                // Fetch videos from secure server-side API route
                // The API will search for model-specific videos using the brand and model name
                const response = await fetch(`/api/youtube/videos?search=${encodeURIComponent(`${brandName} ${modelName}`)}`)

                if (!response.ok) {
                    throw new Error('Failed to fetch videos')
                }

                const data = await response.json()

                if (data.featuredVideo) {
                    setFeaturedVideo(data.featuredVideo)
                }

                if (data.relatedVideos && data.relatedVideos.length > 0) {
                    setRelatedVideos(data.relatedVideos)
                }
            } catch (err) {
                console.error('Error fetching model videos:', err)
                // Set fallback data on error
                setFeaturedVideo({
                    id: 'hVdKkXyXkS0',
                    title: `${brandName} ${modelName} Review`,
                    thumbnail: 'https://img.youtube.com/vi/hVdKkXyXkS0/maxresdefault.jpg',
                    duration: '12:45',
                    views: '2.5M',
                    likes: '45K',
                    publishedAt: '2 days ago',
                    channelName: 'gadizone'
                })
                setRelatedVideos([])
            } finally {
                setLoading(false)
            }
        }

        fetchModelVideos()
    }, [brandName, modelName])

    const handleVideoClick = (videoId: string) => {
        // If clicking a related video, swap it with the featured video
        if (videoId !== featuredVideo?.id) {
            const clickedVideo = relatedVideos.find(v => v.id === videoId)
            if (clickedVideo && featuredVideo) {
                const newRelatedVideos = relatedVideos.filter(v => v.id !== videoId)
                newRelatedVideos.unshift(featuredVideo)
                setRelatedVideos(newRelatedVideos)
                setFeaturedVideo(clickedVideo)
            }
        }
        setPlayingVideo(videoId)
    }

    if (loading || !featuredVideo) {
        return null
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-2xl font-bold text-gray-900">
                    {brandName} {modelName} Videos
                </h2>
                <a
                    href="https://www.youtube.com/@gadizone"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-red-600 hover:text-red-700 font-medium"
                >
                    Visit Channel
                    <ExternalLink className="h-4 w-4 ml-1" />
                </a>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Featured Video */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        {/* Video Player or Thumbnail */}
                        {playingVideo === featuredVideo.id ? (
                            <div className="relative h-64 md:h-80 bg-black">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${featuredVideo.id}?autoplay=1`}
                                    title={featuredVideo.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        ) : (
                            <div
                                className="relative h-64 md:h-80 bg-gradient-to-r from-red-500 to-pink-500 cursor-pointer group"
                                onClick={() => handleVideoClick(featuredVideo.id)}
                                style={{
                                    backgroundImage: featuredVideo.thumbnail ? `url(${featuredVideo.thumbnail})` : undefined,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            >
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-white/90 rounded-full p-4 group-hover:bg-white transition-colors">
                                        <Play className="h-8 w-8 text-red-600 fill-current" />
                                    </div>
                                </div>

                                <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-sm font-medium">
                                    {featuredVideo.duration}
                                </div>

                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />

                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                    <h3 className="text-white font-bold text-lg line-clamp-2">
                                        {featuredVideo.title}
                                    </h3>
                                </div>
                            </div>
                        )}

                        {/* Video Info */}
                        <div className="p-4">
                            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                                <span className="font-medium text-red-600">{featuredVideo.channelName}</span>
                                <span>{featuredVideo.publishedAt}</span>
                            </div>

                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center">
                                    <Eye className="h-4 w-4 mr-1" />
                                    <span>{featuredVideo.views} views</span>
                                </div>
                                <div className="flex items-center">
                                    <ThumbsUp className="h-4 w-4 mr-1" />
                                    <span>{featuredVideo.likes} likes</span>
                                </div>
                                <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1" />
                                    <span>{featuredVideo.duration}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Videos */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900">More Videos</h3>

                    {relatedVideos.map((video) => (
                        <div
                            key={video.id}
                            className="bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => handleVideoClick(video.id)}
                        >
                            <div className="flex">
                                <div
                                    className="relative w-32 h-20 bg-gradient-to-r from-blue-400 to-purple-500 flex-shrink-0"
                                    style={{
                                        backgroundImage: video.thumbnail ? `url(${video.thumbnail})` : undefined,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}
                                >
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Play className="h-4 w-4 text-white fill-current" />
                                    </div>

                                    <div className="absolute bottom-1 right-1 bg-black/80 text-white px-1 py-0.5 rounded text-xs">
                                        {video.duration}
                                    </div>
                                </div>

                                <div className="flex-1 p-3">
                                    <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                                        {video.title}
                                    </h4>

                                    <div className="text-xs text-gray-500 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-red-600 font-medium">{video.channelName}</span>
                                            <span>{video.publishedAt}</span>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <span>{video.views} views</span>
                                            <span>•</span>
                                            <span>{video.likes} likes</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Subscribe Button */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                        <h4 className="font-bold text-gray-900 mb-2">Subscribe to gadizone</h4>
                        <p className="text-sm text-gray-600 mb-3">
                            Get the latest car reviews, comparisons, and buying guides
                        </p>
                        <a
                            href="https://www.youtube.com/@gadizone?sub_confirmation=1"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                        >
                            Subscribe Now
                            <ExternalLink className="h-4 w-4 ml-1" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
