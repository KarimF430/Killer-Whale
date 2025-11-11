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

interface BrandYouTubeProps {
  brandName: string
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

// Helper function to get brand-specific fallback data
function getBrandFallbackData(brand: string) {
    const brandData: Record<string, any> = {
      honda: {
        featured: {
          id: 'placeholder',
          title: 'Honda Amaze Detailed Review | Hybrid vs Petrol | Which One to Buy?',
          thumbnail: '',
          duration: '12:45',
          views: '2.5M',
          likes: '45K',
          publishedAt: '2 days ago',
          channelName: 'MotorOctane'
        },
        related: [
          {
            id: 'placeholder1',
            title: 'Top 5 Honda Cars Under 10 Lakhs in 2024',
            thumbnail: '',
            duration: '8:30',
            views: '1.2M',
            likes: '28K',
            publishedAt: '1 week ago',
            channelName: 'MotorOctane'
          },
          {
            id: 'placeholder2',
            title: 'Honda Electric vs Petrol Cars: Complete Cost Analysis',
            thumbnail: '',
            duration: '15:20',
            views: '890K',
            likes: '19K',
            publishedAt: '3 days ago',
            channelName: 'MotorOctane'
          },
          {
            id: 'placeholder3',
            title: 'Honda City 2024 First Drive Review',
            thumbnail: '',
            duration: '10:15',
            views: '1.8M',
            likes: '35K',
            publishedAt: '5 days ago',
            channelName: 'MotorOctane'
          }
        ]
      },
      'maruti-suzuki': {
        featured: {
          id: 'placeholder',
          title: 'Maruti Suzuki Swift Detailed Review | Petrol vs CNG | Which One to Buy?',
          thumbnail: '',
          duration: '14:20',
          views: '3.1M',
          likes: '52K',
          publishedAt: '1 day ago',
          channelName: 'MotorOctane'
        },
        related: [
          {
            id: 'placeholder1',
            title: 'Top 5 Maruti Suzuki Cars Under 8 Lakhs in 2024',
            thumbnail: '',
            duration: '9:15',
            views: '1.8M',
            likes: '35K',
            publishedAt: '4 days ago',
            channelName: 'MotorOctane'
          },
          {
            id: 'placeholder2',
            title: 'Maruti Suzuki Baleno vs Swift: Complete Comparison',
            thumbnail: '',
            duration: '16:45',
            views: '2.2M',
            likes: '41K',
            publishedAt: '1 week ago',
            channelName: 'MotorOctane'
          },
          {
            id: 'placeholder3',
            title: 'Maruti Suzuki Grand Vitara Hybrid Review',
            thumbnail: '',
            duration: '11:30',
            views: '1.5M',
            likes: '29K',
            publishedAt: '2 weeks ago',
            channelName: 'MotorOctane'
          }
        ]
      },
      tata: {
        featured: {
          id: 'placeholder',
          title: 'Tata Nexon EV Detailed Review | Range Test | Should You Buy?',
          thumbnail: '',
          duration: '13:35',
          views: '2.8M',
          likes: '48K',
          publishedAt: '3 days ago',
          channelName: 'MotorOctane'
        },
        related: [
          {
            id: 'placeholder1',
            title: 'Top 5 Tata Cars Under 12 Lakhs in 2024',
            thumbnail: '',
            duration: '10:20',
            views: '1.6M',
            likes: '32K',
            publishedAt: '1 week ago',
            channelName: 'MotorOctane'
          },
          {
            id: 'placeholder2',
            title: 'Tata Safari vs Mahindra XUV700: Ultimate SUV Battle',
            thumbnail: '',
            duration: '18:15',
            views: '3.5M',
            likes: '67K',
            publishedAt: '5 days ago',
            channelName: 'MotorOctane'
          },
          {
            id: 'placeholder3',
            title: 'Tata Harrier Safety Features Explained',
            thumbnail: '',
            duration: '12:10',
            views: '1.9M',
            likes: '38K',
            publishedAt: '2 weeks ago',
            channelName: 'MotorOctane'
          }
        ]
      },
      hyundai: {
        featured: {
          id: 'placeholder',
          title: 'Hyundai Creta 2024 Detailed Review | Petrol vs Diesel | Best Variant?',
          thumbnail: '',
          duration: '15:25',
          views: '4.2M',
          likes: '78K',
          publishedAt: '1 day ago',
          channelName: 'MotorOctane'
        },
        related: [
          {
            id: 'placeholder1',
            title: 'Top 5 Hyundai Cars Under 15 Lakhs in 2024',
            thumbnail: '',
            duration: '11:40',
            views: '2.1M',
            likes: '42K',
            publishedAt: '6 days ago',
            channelName: 'MotorOctane'
          },
          {
            id: 'placeholder2',
            title: 'Hyundai Venue N Line vs Tata Nexon: Compact SUV Battle',
            thumbnail: '',
            duration: '17:30',
            views: '2.8M',
            likes: '55K',
            publishedAt: '3 days ago',
            channelName: 'MotorOctane'
          },
          {
            id: 'placeholder3',
            title: 'Hyundai i20 Buying Guide 2024',
            thumbnail: '',
            duration: '13:20',
            views: '1.7M',
            likes: '34K',
            publishedAt: '1 week ago',
            channelName: 'MotorOctane'
          }
        ]
      },
      kia: {
        featured: {
          id: 'placeholder',
          title: 'Kia Seltos 2024 Detailed Review | Turbo Petrol vs Diesel | Worth It?',
          thumbnail: '',
          duration: '14:50',
          views: '3.3M',
          likes: '61K',
          publishedAt: '2 days ago',
          channelName: 'MotorOctane'
        },
        related: [
          {
            id: 'placeholder1',
            title: 'Top 5 Kia Cars Under 20 Lakhs in 2024',
            thumbnail: '',
            duration: '12:15',
            views: '1.9M',
            likes: '37K',
            publishedAt: '1 week ago',
            channelName: 'MotorOctane'
          },
          {
            id: 'placeholder2',
            title: 'Kia Sonet vs Hyundai Venue: Which is Better?',
            thumbnail: '',
            duration: '16:05',
            views: '2.4M',
            likes: '46K',
            publishedAt: '4 days ago',
            channelName: 'MotorOctane'
          },
          {
            id: 'placeholder3',
            title: 'Kia Carens 7-Seater Review',
            thumbnail: '',
            duration: '13:45',
            views: '2.0M',
            likes: '39K',
            publishedAt: '10 days ago',
            channelName: 'MotorOctane'
          }
        ]
      }
    }
    
    const defaultData = brandData[brand.toLowerCase()] || {
      featured: {
        id: 'placeholder',
        title: `${brand} Grand Vitara Detailed Review | Hybrid vs Petrol | Which One to Buy?`,
        thumbnail: '',
        duration: '12:45',
        views: '2.5M',
        likes: '45K',
        publishedAt: '2 days ago',
        channelName: 'MotorOctane'
      },
      related: [
        {
          id: 'placeholder1',
          title: `Top 5 ${brand} Cars Under 10 Lakhs in 2024`,
          thumbnail: '',
          duration: '8:30',
          views: '1.2M',
          likes: '28K',
          publishedAt: '1 week ago',
          channelName: 'MotorOctane'
        },
        {
          id: 'placeholder2',
          title: `${brand} Electric vs Petrol Cars: Complete Cost Analysis`,
          thumbnail: '',
          duration: '15:20',
          views: '890K',
          likes: '19K',
          publishedAt: '3 days ago',
          channelName: 'MotorOctane'
        },
        {
          id: 'placeholder3',
          title: `${brand} Creta 2024 First Drive Review`,
          thumbnail: '',
          duration: '10:15',
          views: '1.8M',
          likes: '35K',
          publishedAt: '5 days ago',
          channelName: 'MotorOctane'
        }
      ]
    }
    
    return defaultData
}

export default function BrandYouTube({ brandName }: BrandYouTubeProps) {
  const [featuredVideo, setFeaturedVideo] = useState<YouTubeVideo | null>(null)
  const [relatedVideos, setRelatedVideos] = useState<YouTubeVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBrandVideos = async () => {
      try {
        setLoading(true)
        
        // Directly use fallback data (skip API calls)
        const fallbackData = getBrandFallbackData(brandName)
        setFeaturedVideo(fallbackData.featured)
        setRelatedVideos(fallbackData.related)
        setError(null)
      } catch (err) {
        console.error('Error loading brand videos:', err)
        // Even if there's an error, use fallback data
        const fallbackData = getBrandFallbackData(brandName)
        setFeaturedVideo(fallbackData.featured)
        setRelatedVideos(fallbackData.related)
      } finally {
        setLoading(false)
      }
    }

    fetchBrandVideos()
  }, [brandName])

  const handleVideoClick = (videoId: string) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank')
  }

  if (loading || !featuredVideo) {
    return (
      <section className="py-4 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{brandName.charAt(0).toUpperCase() + brandName.slice(1)} Videos</h2>
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
      </section>
    )
  }

  return (
    <section className="py-4 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{brandName.charAt(0).toUpperCase() + brandName.slice(1)} Videos</h2>
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
              {/* Video Thumbnail */}
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
    </section>
  )
}
