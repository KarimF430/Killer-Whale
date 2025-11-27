'use client'

import { useState } from 'react'
import { Play, Eye, ThumbsUp, Clock, ExternalLink } from 'lucide-react'

interface VideoData {
  id: string
  title: string
  channel: string
  views: string
  likes: string
  duration: string
  uploadDate: string
  thumbnail: string
  videoUrl: string
}

interface YouTubeVideosSectionProps {
  carName: string
  videos: VideoData[]
}

export default function YouTubeVideosSection({ carName, videos }: YouTubeVideosSectionProps) {
  const [featuredVideo] = useState(videos[0])
  const moreVideos = videos.slice(1)

  return (
    <section className="py-6 sm:py-8 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {carName} Videos
          </h2>
          <button className="text-red-500 hover:text-red-600 font-medium text-sm flex items-center">
            Visit Channel
            <ExternalLink className="w-4 h-4 ml-1" />
          </button>
        </div>

        {/* Featured Video */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Video Thumbnail */}
            <div className="relative h-48 bg-gradient-to-br from-red-400 to-pink-600 flex items-center justify-center">
              {/* Play Button */}
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Play className="w-8 h-8 text-white ml-1" fill="white" />
              </div>

              {/* Video Title Overlay */}
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-bold text-base leading-tight">
                  {featuredVideo.title}
                </h3>
              </div>
            </div>

            {/* Video Details */}
            <div className="p-4">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span className="text-red-500 font-medium">{featuredVideo.channel}</span>
                <span>{featuredVideo.uploadDate}</span>
              </div>

              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center">
                  <Eye className="w-3 h-3 mr-1" />
                  <span>{featuredVideo.views}</span>
                </div>
                <div className="flex items-center">
                  <ThumbsUp className="w-3 h-3 mr-1" />
                  <span>{featuredVideo.likes}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>{featuredVideo.duration}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* More Videos */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">More Videos</h3>

          <div className="space-y-3">
            {moreVideos.map((video) => (
              <div key={video.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="flex">
                  {/* Video Thumbnail */}
                  <div className="relative w-32 h-20 bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 rounded">
                      {video.duration}
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="flex-1 p-3">
                    <h4 className="text-gray-900 font-medium text-sm mb-1 line-clamp-2">
                      {video.title}
                    </h4>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span className="text-red-500 font-medium">{video.channel}</span>
                      <span>{video.uploadDate}</span>
                    </div>

                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <span>{video.views} views</span>
                      <span>{video.likes} likes</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscribe Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Subscribe to MotorOctane</h3>
          <p className="text-gray-600 text-sm mb-4">
            Get the latest car reviews, comparisons, and buying guides
          </p>
          <button className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg text-sm transition-colors flex items-center mx-auto">
            Subscribe Now
            <ExternalLink className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </section>
  )
}
