'use client'

import { useState } from 'react'
import Link from 'next/link'
import BrandCarsList from './BrandCarsList'
import BrandUpcomingCars from './BrandUpcomingCars'
import AlternativeBrands from './AlternativeBrands'
import BrandFAQ from './BrandFAQ'
import BrandYouTube from './BrandYouTube'
import AdBanner from '@/components/home/AdBanner'
import Ad3DCarousel from '../ads/Ad3DCarousel'

interface Brand {
  name: string
  slug: string
  logo?: string
  description: string
  fullDescription: string
  priceRange: {
    min: number
    max: number
  }
  totalModels: number
  categories: {
    suv: number
    sedan: number
    hatchback: number
    muv: number
    minivan: number
  }
  upcomingCars: number
  models?: string[]
}

interface BrandHeroSectionProps {
  brand: Brand
  brands?: any[]
  models?: any[]
  brandId?: string
  backendBrand?: any
  newsSlot?: React.ReactNode
}

export default function BrandHeroSection({ brand, brands = [], models = [], brandId, backendBrand, newsSlot }: BrandHeroSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const formatPrice = (price: number) => {
    return (price / 100000).toFixed(2)
  }

  // Get current month and year
  const getCurrentMonthYear = () => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const now = new Date()
    return `${months[now.getMonth()]} ${now.getFullYear()}`
  }

  // Get all models sorted by price
  const getAllModels = () => {
    if (!models || models.length === 0) return []

    // Filter models with valid prices and sort by lowest price
    const validModels = models
      .filter((m: any) => m.lowestPrice && m.lowestPrice > 0)
      .sort((a: any, b: any) => a.lowestPrice - b.lowestPrice)

    return validModels
  }

  // Get top 5 for the inline text
  const getTop5Models = () => {
    const allModels = getAllModels()
    return allModels.slice(0, 5)
  }

  const allModels = getAllModels()
  const top5Models = getTop5Models()

  // Generate model slug for links
  const generateModelSlug = (brandName: string, modelName: string) => {
    const brandSlug = brandName.toLowerCase().replace(/\s+/g, '-')
    const modelSlug = modelName.toLowerCase().replace(/\s+/g, '-')
    return `/${brandSlug}-cars/${modelSlug}`
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        <Ad3DCarousel className="my-3 sm:my-4" />
      </div>

      {/* Brand Title and SEO Text Section */}
      <section className="py-6 sm:py-8 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          {/* Brand Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
            {brand.name} Cars
          </h1>

          {/* Collapsible SEO Text */}
          <div className="bg-white">
            {/* Collapsed View */}
            <div>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                {!isExpanded ? (
                  <>
                    {brand.description.split(' ').slice(0, 30).join(' ')}
                    <button
                      onClick={() => setIsExpanded(true)}
                      className="ml-1 text-red-600 hover:text-orange-600 font-medium transition-colors inline-block min-h-[44px] py-2 sm:py-0"
                    >
                      ...read more
                    </button>
                  </>
                ) : (
                  brand.description
                )}
              </p>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="mt-4 space-y-4">
                  {/* Full Description */}
                  <div className="text-gray-700 text-sm sm:text-base leading-relaxed space-y-4">
                    <p>{brand.fullDescription}</p>
                  </div>

                  {/* Price Information */}
                  <div className="mt-4 sm:mt-6">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">
                      {brand.name} Cars Price List ({getCurrentMonthYear()}) in India
                    </h3>
                    <p className="text-gray-700 text-sm sm:text-base mb-3 sm:mb-4">
                      {brand.name} car price starts at Rs. {formatPrice(brand.priceRange.min)} Lakh and goes upto Rs. {formatPrice(brand.priceRange.max)} Lakh (Avg. ex-showroom).
                      {top5Models.length > 0 && (
                        <>
                          {' '}The prices for the top {top5Models.length} popular {brand.name} Cars are:{' '}
                          {top5Models.map((model: any, index: number) => (
                            <span key={index}>
                              <Link
                                href={generateModelSlug(brand.name, model.name)}
                                className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
                                prefetch={true}
                              >
                                {brand.name} {model.name} Price
                              </Link>
                              {' '}is Rs. {formatPrice(model.lowestPrice)} Lakh
                              {index < top5Models.length - 2 && ', '}
                              {index === top5Models.length - 2 && ' and '}
                              {index === top5Models.length - 1 && '.'}
                            </span>
                          ))}
                        </>
                      )}
                    </p>

                    {/* Dynamic Car Models with Prices - Show ALL models */}
                    {allModels.length > 0 && (
                      <div className="space-y-1 sm:space-y-2">
                        <div className="flex justify-between items-center py-1.5 sm:py-2 border-b border-gray-300">
                          <span className="font-bold text-gray-900 text-xs sm:text-sm">MODEL</span>
                          <span className="font-bold text-gray-900 text-xs sm:text-sm">PRICE</span>
                        </div>

                        {allModels.map((model: any, index: number) => (
                          <div key={index} className="flex justify-between items-center py-1 hover:bg-gray-50 transition-colors rounded px-2">
                            <Link
                              href={generateModelSlug(brand.name, model.name)}
                              className="text-gray-700 hover:text-blue-600 hover:underline text-xs sm:text-sm transition-colors font-medium"
                              prefetch={true}
                            >
                              {brand.name} {model.name}
                            </Link>
                            <span className="text-red-600 font-bold text-xs sm:text-sm">
                              Rs. {formatPrice(model.lowestPrice)} Lakh
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Collapse Button */}
                  <div className="text-right mt-3 sm:mt-4">
                    <button
                      onClick={() => setIsExpanded(false)}
                      className="text-blue-600 hover:text-blue-700 text-sm transition-colors min-h-[44px] py-2"
                    >
                      Collapse
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Car Models List with Filters */}
      <BrandCarsList brand={brand.slug} initialModels={models} brandId={brandId} />

      {/* Section 3: Ad Banner */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        <Ad3DCarousel className="my-3 sm:my-4" />
      </div>

      {/* Section 4: Upcoming Cars Section - Using BrandUpcomingCars Component */}
      {brandId && <BrandUpcomingCars brandId={brandId} brandName={brand.name} />}

      {/* Section 4: Ad Banner + Alternative Brands */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        <Ad3DCarousel className="my-3 sm:my-4" />
      </div>

      {/* Alternative Brands Section - Dynamic with Backend Logic */}
      <AlternativeBrands currentBrand={brand.slug} initialBrands={brands} />

      {/* Section 6: Brand News and Videos */}
      <div className="py-6 sm:py-8 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          {newsSlot}
        </div>
      </div>

      {/* Brand Videos Section - Using BrandYouTube Component */}
      <BrandYouTube brandName={brand.name} />

      {/* Section 7: Ad Banner + Brand FAQ */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        <Ad3DCarousel className="my-3 sm:my-4" />
      </div>

      {/* Brand FAQ Section - Dynamic with Backend Logic */}
      <BrandFAQ brandName={brand.name} initialBrand={backendBrand} />

      {/* Section 8: Owner Reviews */}
      <section className="py-6 sm:py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">{brand.name} Owner Reviews</h2>
          <div className="bg-gray-50 rounded-lg p-4 sm:p-6 text-center">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Own a {brand.name.toLowerCase()} car? Share your experience!</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
              Be the first to review this car and help other buyers make informed decisions
            </p>
            <Link
              href={`/${brand.slug}-cars/write-review`}
              className="inline-block bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white px-5 py-2 sm:px-6 sm:py-2 rounded-lg font-medium transition-all duration-200 shadow-md text-sm sm:text-base"
            >
              Write a Review
            </Link>
          </div>
        </div>
      </section>

      {/* Website Feedback Section */}
      <section className="py-6 sm:py-8 bg-gray-50">
        <div className="max-w-2xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 lg:p-8">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 text-center mb-2 sm:mb-3">
              Share Your Feedback
            </h2>
            <p className="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6">
              Help us improve our website by sharing your experience
            </p>

            <form className="space-y-4 sm:space-y-5">
              {/* Feedback Textarea */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Your Feedback
                </label>
                <textarea
                  placeholder="Tell us what you think about our website..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Name and Email - Stack on mobile, side-by-side on larger screens */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base min-h-[44px]"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Submit Feedback</span>
              </button>
            </form>
          </div>
        </div>
      </section>

    </div>
  )
}
