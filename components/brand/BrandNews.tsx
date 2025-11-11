'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight, Calendar, Clock, Eye, MessageCircle, ArrowRight } from 'lucide-react'

interface NewsArticle {
  id: number
  title: string
  excerpt: string
  category: string
  author: string
  publishDate: string
  readTime: string
  views: number
  comments: number
  image: string
  slug: string
  featured: boolean
}

interface BrandNewsProps {
  brandName: string
}

export default function BrandNews({ brandName }: BrandNewsProps) {
  // Mock news articles data
  const newsArticles: NewsArticle[] = [
    {
      id: 1,
      title: 'Maruti Suzuki Grand Vitara Hybrid Review: Best Fuel Economy in Segment',
      excerpt: 'We test drive the new Grand Vitara hybrid to see if it lives up to the fuel efficiency claims.',
      category: 'Review',
      author: 'Rajesh Kumar',
      publishDate: '2024-03-15',
      readTime: '5 min read',
      views: 12500,
      comments: 45,
      image: '/news/grand-vitara-review.jpg',
      slug: 'maruti-suzuki-grand-vitara-hybrid-review',
      featured: true
    },
    {
      id: 2,
      title: 'Upcoming Electric Cars in India 2024: Complete List with Expected Prices',
      excerpt: 'From Tata to Mahindra, here are all the electric cars launching in India this year.',
      category: 'News',
      author: 'Priya Sharma',
      publishDate: '2024-03-14',
      readTime: '8 min read',
      views: 18200,
      comments: 67,
      image: '/news/electric-cars-2024.jpg',
      slug: 'upcoming-electric-cars-india-2024',
      featured: true
    },
    {
      id: 3,
      title: 'Hyundai Creta vs Kia Seltos 2024: Which Compact SUV Should You Buy?',
      excerpt: 'Detailed comparison of two popular compact SUVs with latest updates and pricing.',
      category: 'Comparison',
      author: 'Amit Singh',
      publishDate: '2024-03-13',
      readTime: '6 min read',
      views: 9800,
      comments: 32,
      image: '/news/creta-vs-seltos.jpg',
      slug: 'hyundai-creta-vs-kia-seltos-2024-comparison',
      featured: false
    },
    {
      id: 4,
      title: 'Car Loan Interest Rates March 2024: Best Banks for Auto Financing',
      excerpt: 'Compare car loan rates from top banks and NBFCs to get the best deal on your next car.',
      category: 'Guide',
      author: 'Neha Gupta',
      publishDate: '2024-03-12',
      readTime: '4 min read',
      views: 7500,
      comments: 28,
      image: '/news/car-loan-rates.jpg',
      slug: 'car-loan-interest-rates-march-2024',
      featured: false
    },
    {
      id: 5,
      title: 'Tata Nexon EV Max Long Term Review: 6 Months and 15,000 KM Later',
      excerpt: 'Our comprehensive long-term review of the Nexon EV Max after extensive real-world usage.',
      category: 'Review',
      author: 'Vikram Patel',
      publishDate: '2024-03-11',
      readTime: '7 min read',
      views: 11200,
      comments: 54,
      image: '/news/nexon-ev-long-term.jpg',
      slug: 'tata-nexon-ev-max-long-term-review',
      featured: false
    },
    {
      id: 6,
      title: 'New Car Launches in April 2024: Mahindra XUV 3XO, Honda Elevate and More',
      excerpt: 'Get ready for exciting new car launches coming to India next month.',
      category: 'News',
      author: 'Rohit Mehta',
      publishDate: '2024-03-10',
      readTime: '3 min read',
      views: 6800,
      comments: 19,
      image: '/news/april-launches.jpg',
      slug: 'new-car-launches-april-2024',
      featured: false
    }
  ]

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
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Latest {brandName.charAt(0).toUpperCase() + brandName.slice(1)} News</h2>
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
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {newsArticles.map((article) => (
              <Link
                key={article.id}
                href={`/news/${article.slug}`}
                className="flex-shrink-0 w-64 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden"
              >
                {/* Article Image with Gradient */}
                <div className="h-40 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center relative">
                  <div className="text-center text-white px-3">
                    <div className="w-12 h-8 bg-white/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <span className="text-xs font-medium">NEWS</span>
                    </div>
                    <h3 className="text-sm font-bold leading-tight line-clamp-2">
                      {article.title}
                    </h3>
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {article.category}
                    </span>
                  </div>

                  {/* Featured Badge */}
                  {article.featured && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    </div>
                  )}
                </div>

                {/* Article Info */}
                <div className="p-3">
                  <h3 className="font-bold text-gray-900 mb-2 text-base leading-tight">
                    {article.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed line-clamp-2">
                    {article.excerpt}
                  </p>

                  {/* Author and Date */}
                  <div className="flex items-center text-xs text-gray-500 mb-3">
                    <span className="font-medium">{article.author}</span>
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
                      <span>{article.readTime}</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      <span>{article.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      <span>{article.comments}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
