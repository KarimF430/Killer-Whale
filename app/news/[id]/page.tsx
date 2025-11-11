'use client'

import Link from 'next/link'
import { Eye, Calendar, User } from 'lucide-react'

// Force dynamic rendering to prevent static generation
export const dynamic = 'force-dynamic'
import Footer from '@/components/Footer'
import FeedbackSection from '@/components/car-model/FeedbackSection'
import LatestCarNews from '@/components/home/LatestCarNews'
import UpcomingCars from '@/components/home/UpcomingCars'
import NewLaunchedCars from '@/components/home/NewLaunchedCars'
import ArticleRenderer from '@/components/news/ArticleRenderer'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function NewsArticlePage() {
  const params = useParams()
  const [article, setArticle] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchArticle() {
      try {
        const slug = params.id as string
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
        const res = await fetch(`${apiUrl}/api/news/${slug}`)
        
        if (!res.ok) {
          setError(true)
          return
        }
        
        const data = await res.json()
        setArticle(data)
      } catch (err) {
        console.error('Error fetching article:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading article...</p>
        </div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <Link href="/news" className="text-blue-600 hover:underline">
            Back to News
          </Link>
        </div>
      </div>
    )
  }

  // Format for display
  const displayArticle = {
    id: article.id,
    title: article.title,
    views: article.views || 0,
    author: {
      name: article.authorId || 'Admin',
      image: '/api/placeholder/50/50',
      date: new Date(article.publishDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    featuredImage: article.featuredImage?.startsWith('/uploads') 
      ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}${article.featuredImage}`
      : article.featuredImage || '/api/placeholder/600/400',
    keyPoints: [],
    contentBlocks: article.contentBlocks || [
      {
        id: 'block-1',
        type: 'paragraph' as const,
        content: 'Mini India has officially introduced the new Countryman SE All4 at a price tag of Rs. 66.90 lakh (ex-showroom). Brought to the country via the CBU route, the model can now be booked at all authorised dealerships, with deliveries set to begin from today itself.'
      },
      {
        id: 'block-2',
        type: 'image' as const,
        content: '',
        imageUrl: '/api/placeholder/600/400',
        imageCaption: 'Mini Countryman SE All4 - Front View'
      },
      {
        id: 'block-3',
        type: 'heading2' as const,
        content: 'Exterior Design'
      },
      {
        id: 'block-4',
        type: 'paragraph' as const,
        content: 'On the outside, the 2025 Countryman SE All4 features a new grille, fresh design for the headlights, sculpted bonnet, Jet Black roof, flush door handles, and more. Offered only in the JCW trim, it boasts blacked-out elements such as the sports stripes, roof rails, 19-inch alloy wheels, and wheel arches.'
      },
      {
        id: 'block-5',
        type: 'heading2' as const,
        content: 'Interior Features'
      },
      {
        id: 'block-6',
        type: 'paragraph' as const,
        content: 'The interior of the new Mini Countryman SE All4 comes equipped with JCW sports elements like the steering wheel, sports seats, upholstery, and dashboard trims. It also features a panoramic glass roof, JCW door sill, recycled 2D knitted fabric lining, and ambient lighting.'
      },
      {
        id: 'block-7',
        type: 'image' as const,
        content: '',
        imageUrl: '/api/placeholder/600/400',
        imageCaption: 'Premium interior with JCW sports elements'
      },
      {
        id: 'block-8',
        type: 'heading2' as const,
        content: 'Performance & Battery'
      },
      {
        id: 'block-9',
        type: 'paragraph' as const,
        content: 'At the heart of the Countryman SE All4 is a 66.45kWh battery pack paired with dual electric motors that return a claimed range of up to 440km on a single charge. Tuned to produce 313bhp and 494Nm, Mini claims it can sprint from 0-100kmph in 5.6 seconds.'
      }
    ]
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Article Header */}
        <article>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            {displayArticle.title}
          </h1>

          {/* Views */}
          <div className="flex items-center text-gray-600 text-sm mb-4">
            <Eye className="h-4 w-4 mr-1" />
            <span>{displayArticle.views} Views</span>
          </div>

          {/* Author Info */}
          <div className="flex items-center mb-6">
            <img
              src={displayArticle.author.image}
              alt={displayArticle.author.name}
              className="w-12 h-12 rounded-full mr-3"
            />
            <div>
              <p className="font-semibold text-gray-900">{displayArticle.author.name}</p>
              <p className="text-sm text-gray-600">{displayArticle.author.date}</p>
            </div>
          </div>

          {/* Featured Image */}
          {displayArticle.featuredImage && displayArticle.featuredImage !== '/api/placeholder/600/400' && (
            <div className="mb-6">
              <img
                src={displayArticle.featuredImage}
                alt={displayArticle.title}
                className="w-full rounded-lg"
              />
            </div>
          )}

          {/* Excerpt */}
          {article.excerpt && (
            <div className="mb-6 text-lg text-gray-700 font-medium">
              {article.excerpt}
            </div>
          )}

          {/* Article Content - Block-based rendering */}
          <ArticleRenderer blocks={displayArticle.contentBlocks} linkedCars={article.linkedCars} />
        </article>

        {/* Related Cars Section */}
        {article.linkedCars && article.linkedCars.length > 0 && (
          <div className="my-8 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Cars Mentioned in this Article</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {article.linkedCars.map((carId: string) => (
                <a
                  key={carId}
                  href={`/models/${carId}`}
                  className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">🚗</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{carId}</p>
                    <p className="text-sm text-gray-500">View Details →</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Feedback Section - Direct Import from Model Page */}
        <FeedbackSection />

        {/* AD Banner */}
        <div className="bg-gray-200 rounded-lg py-16 my-8 text-center">
          <h2 className="text-2xl font-bold text-gray-500">AD Banner</h2>
        </div>
      </main>

      {/* Latest Car News - Direct Import from Home Page */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LatestCarNews />
      </div>

      {/* Upcoming Cars - Direct Import from Home Page */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UpcomingCars />
      </div>

      {/* AD Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-200 rounded-lg py-16 mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-500">AD Banner</h2>
        </div>
      </div>

      {/* New Launches - Direct Import from Home Page */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NewLaunchedCars />
      </div>

      {/* Next Article (Loop Continuation) */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="border-t-4 border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Continue Reading</h2>
          
          <Link
            href="/news/2"
            className="block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            <div className="h-48 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center p-6 relative">
              <div className="absolute top-4 left-4">
                <span className="bg-blue-500 px-3 py-1 rounded-full text-xs font-semibold text-white">
                  Review
                </span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <span className="text-white font-bold text-lg">NEWS</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white font-bold text-lg line-clamp-2">
                  Maruti Suzuki Grand Vitara Hybrid Review: Best Fuel Economy in Segment
                </h3>
              </div>
            </div>

            <div className="p-4 lg:p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Maruti Suzuki Grand Vitara Hybrid Review: Best Fuel Economy in Segment
              </h3>
              
              <p className="text-sm text-gray-600 mb-4">
                We test drive the new Grand Vitara hybrid to see if it lives up to the fuel efficiency claims.
              </p>

              <div className="flex items-center text-xs text-gray-500">
                <User className="h-3 w-3 mr-1" />
                <span className="font-medium">Rajesh Kumar</span>
                <span className="mx-2">•</span>
                <Calendar className="h-3 w-3 mr-1" />
                <span>15 Mar</span>
              </div>
            </div>
          </Link>
        </section>
      </div>

      <Footer />
    </div>
  )
}
