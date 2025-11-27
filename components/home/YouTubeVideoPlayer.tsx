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



export default function YouTubeVideoPlayer() {
  const [featuredVideo, setFeaturedVideo] = useState<YouTubeVideo | null>(null)
  const [relatedVideos, setRelatedVideos] = useState<YouTubeVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchYouTubeVideos = async () => {
      const setFallbackData = () => {
        setFeaturedVideo({
          id: 'placeholder',
          title: 'Maruti Suzuki Grand Vitara Detailed Review | Hybrid vs Petrol | Which One to Buy?',
          thumbnail: 'https://img.youtube.com/vi/hVdKkXyXkS0/maxresdefault.jpg',
          duration: '12:45',
          views: '2.5M',
          likes: '45K',
          publishedAt: '2 days ago',
          channelName: 'MotorOctane'
        })

        setRelatedVideos([
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
        ])
        setLoading(false)
      }

      try {
        setLoading(true)

        // Fetch videos from our secure API route (no API key exposed to client)
        const response = await fetch('/api/youtube/videos')

        if (!response.ok) {
          throw new Error('Failed to fetch YouTube videos')
        }

        const data = await response.json()

        if (data.error) {
          throw new Error(data.error)
        }

        // Set featured video and related videos from API response
        setFeaturedVideo(data.featuredVideo)
        setRelatedVideos(data.relatedVideos)
        setError(null)
        setLoading(false)

      } catch (err) {
        console.error('Error fetching YouTube videos:', err)
        setError(err instanceof Error ? err.message : 'Failed to load videos')
        setFallbackData()
      }
    }

    fetchYouTubeVideos()
  }, [])

  const [playingVideo, setPlayingVideo] = useState<string | null>(null)

  const handleVideoClick = (videoId: string) => {
    // If clicking a related video, swap it with the featured video
    if (videoId !== featuredVideo?.id) {
      const clickedVideo = relatedVideos.find(v => v.id === videoId)
      if (clickedVideo && featuredVideo) {
        // Swap: move current featured to related videos, and clicked video to featured
        const newRelatedVideos = relatedVideos.filter(v => v.id !== videoId)
        newRelatedVideos.unshift(featuredVideo) // Add old featured to start of related
        setRelatedVideos(newRelatedVideos)
        setFeaturedVideo(clickedVideo)
      }
    }
    // Set the video to play
    setPlayingVideo(videoId)
  }

  if (loading || !featuredVideo) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Latest Videos</h2>
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="h-64 md:h-80 bg-gray-200 animate-pulse"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            </div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-3">
                <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Latest Videos</h2>
        <a
          href="https://www.youtube.com/@motoroctane"
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

                {/* Duration Badge */}
                <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-sm font-medium">
                  {featuredVideo.duration}
                </div>

                {/* Video Overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />

                {/* Video Title Overlay */}
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
                {/* Video Thumbnail */}
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

                  {/* Duration Badge */}
                  <div className="absolute bottom-1 right-1 bg-black/80 text-white px-1 py-0.5 rounded text-xs">
                    {video.duration}
                  </div>
                </div>

                {/* Video Info */}
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
            <h4 className="font-bold text-gray-900 mb-2">Subscribe to MotorOctane</h4>
            <p className="text-sm text-gray-600 mb-3">
              Get the latest car reviews, comparisons, and buying guides
            </p>
            <a
              href="https://www.youtube.com/@motoroctane?sub_confirmation=1"
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
