'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Calendar, Clock, Eye, MessageCircle, ArrowRight } from 'lucide-react'

interface ContentBlock {
  id: string
  type: string
  content: string
  imageUrl?: string
  imageCaption?: string
}

interface NewsArticle {
  id: string
  title: string
  excerpt: string
  categoryId: string
  authorId: string
  publishDate: string
  views: number
  likes: number
  contentBlocks: ContentBlock[]
  slug: string
  isFeatured: boolean
  status: string
}

export default function LatestCarNews() {
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      // Use environment variable or fallback to localhost
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
      const response = await fetch(`${apiUrl}/api/news?limit=6`)
      if (response.ok) {
        const data = await response.json()
        setNewsArticles(data.articles || [])
      } else {
        console.error('Failed to fetch news:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setLoading(false)
    }
  }

  // Get first image from contentBlocks
  const getFirstImage = (blocks: ContentBlock[]) => {
    const imageBlock = blocks.find(block => block.type === 'image' && block.imageUrl)
    if (!imageBlock?.imageUrl) return '/api/placeholder/400/300'

    // Handle blob URLs (shouldn't happen but fallback)
    if (imageBlock.imageUrl.startsWith('blob:')) {
      return '/api/placeholder/400/300'
    }

    // Prepend backend URL for uploaded images
    if (imageBlock.imageUrl.startsWith('/uploads')) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
      return `${apiUrl}${imageBlock.imageUrl}`
    }

    return imageBlock.imageUrl
  }

  // Calculate reading time from content blocks
  const calculateReadTime = (blocks: ContentBlock[]) => {
    const wordCount = blocks.reduce((count, block) => {
      return count + (block.content?.split(' ').length || 0)
    }, 0)
    const minutes = Math.ceil(wordCount / 200)
    return `${minutes} min read`
  }

  if (loading) {
    return <div className="py-12 text-center">Loading latest news...</div>
  }

  if (newsArticles.length === 0) {
    return <div className="py-12 text-center text-gray-500">No news articles available</div>
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'review':
        return 'bg-blue-100 text-blue-800'
      case 'news':
        return 'bg-green-100 text-green-800'
      case 'comparison':
        return 'bg-purple-100 text-purple-800'
      case 'guide':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const scrollContainer = (direction: 'left' | 'right') => {
    const container = document.getElementById('latest-news-scroll')
    if (container) {
      const scrollAmount = 350
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Latest Car News</h2>
        <Link
          href="/news"
          className="flex items-center text-red-600 hover:text-orange-600 font-medium"
        >
          View All News
          <ArrowRight className="h-4 w-4 ml-1" />
        </Link>
      </div>

      {/* News Articles Horizontal Scroll */}
      <div className="relative">
        <div
          id="latest-news-scroll"
          className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {newsArticles.map((article) => (
            <Link
              key={article.id}
              href={`/news/${article.slug}`}
              className="flex-shrink-0 w-64 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden"
            >
              {/* Article Image - First image from contentBlocks or gradient */}
              <div className="h-40 relative overflow-hidden">
                {getFirstImage(article.contentBlocks) !== '/api/placeholder/400/300' ? (
                  <img
                    src={getFirstImage(article.contentBlocks)}
                    alt={article.title}
                    className="w-full h-full object-contain bg-gray-100"
                  />
                ) : (
                  <div className="h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
                    <div className="text-center text-white px-3">
                      <div className="w-12 h-8 bg-white/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <span className="text-xs font-medium">NEWS</span>
                      </div>
                      <h3 className="text-sm font-bold leading-tight line-clamp-2">
                        {article.title}
                      </h3>
                    </div>
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {article.categoryId}
                  </span>
                </div>

                {/* Featured Badge */}
                {article.isFeatured && (
                  <div className="absolute top-3 right-3">
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Featured
                    </span>
                  </div>
                )}
              </div>

              {/* Article Info */}
              <div className="p-3">
                <h3 className="font-bold text-gray-900 mb-2 text-base leading-tight line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-sm text-gray-600 mb-3 leading-relaxed line-clamp-2">
                  {article.excerpt}
                </p>

                {/* Author and Date */}
                <div className="flex items-center text-xs text-gray-500 mb-3">
                  <span className="font-medium">{article.authorId}</span>
                  <span className="mx-2">•</span>
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{new Date(article.publishDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short'
                  })}</span>
                </div>

                {/* Article Stats */}
                <div className="flex items-center space-x-3 text-xs text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{calculateReadTime(article.contentBlocks)}</span>
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    <span>{article.views.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    <span>{article.likes}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-gray-50 via-gray-50/80 to-transparent pointer-events-none sm:hidden -z-10" />
      </div>
    </div>
  )
}
