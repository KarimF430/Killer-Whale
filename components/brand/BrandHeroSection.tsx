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

          <div className="bg-white rounded-lg border border-gray-200 p-5 sm:p-6">
            {/* Overall Rating */}
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="flex items-center flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-1 sm:ml-2 text-xl sm:text-2xl font-bold text-gray-900">4.2</span>
                <span className="text-sm sm:text-base text-gray-600">(1,543 reviews)</span>
              </div>
            </div>

            {/* Rating Breakdown */}
            <div className="mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Rating Breakdown</h3>
              <div className="space-y-1.5 sm:space-y-2">
                {/* 5 Star */}
                <div className="flex items-center">
                  <span className="text-xs sm:text-sm font-medium text-gray-700 w-5 sm:w-6">5★</span>
                  <div className="flex-1 mx-2 sm:mx-3 bg-gray-200 rounded-full h-1.5 sm:h-2">
                    <div className="bg-orange-500 h-1.5 sm:h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600 w-7 sm:w-8 text-right">856</span>
                </div>

                {/* 4 Star */}
                <div className="flex items-center">
                  <span className="text-xs sm:text-sm font-medium text-gray-700 w-5 sm:w-6">4★</span>
                  <div className="flex-1 mx-2 sm:mx-3 bg-gray-200 rounded-full h-1.5 sm:h-2">
                    <div className="bg-orange-500 h-1.5 sm:h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600 w-7 sm:w-8 text-right">324</span>
                </div>

                {/* 3 Star */}
                <div className="flex items-center">
                  <span className="text-xs sm:text-sm font-medium text-gray-700 w-5 sm:w-6">3★</span>
                  <div className="flex-1 mx-2 sm:mx-3 bg-gray-200 rounded-full h-1.5 sm:h-2">
                    <div className="bg-orange-500 h-1.5 sm:h-2 rounded-full" style={{ width: '12%' }}></div>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600 w-7 sm:w-8 text-right">189</span>
                </div>

                {/* 2 Star */}
                <div className="flex items-center">
                  <span className="text-xs sm:text-sm font-medium text-gray-700 w-5 sm:w-6">2★</span>
                  <div className="flex-1 mx-2 sm:mx-3 bg-gray-200 rounded-full h-1.5 sm:h-2">
                    <div className="bg-orange-500 h-1.5 sm:h-2 rounded-full" style={{ width: '2%' }}></div>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600 w-7 sm:w-8 text-right">26</span>
                </div>

                {/* 1 Star */}
                <div className="flex items-center">
                  <span className="text-xs sm:text-sm font-medium text-gray-700 w-5 sm:w-6">1★</span>
                  <div className="flex-1 mx-2 sm:mx-3 bg-gray-200 rounded-full h-1.5 sm:h-2">
                    <div className="bg-orange-500 h-1.5 sm:h-2 rounded-full" style={{ width: '1%' }}></div>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600 w-7 sm:w-8 text-right">13</span>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Filter by rating:</label>
                <select className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-2 bg-white text-sm">
                  <option>All Ratings</option>
                  <option>5 Stars</option>
                  <option>4 Stars</option>
                  <option>3 Stars</option>
                  <option>2 Stars</option>
                  <option>1 Star</option>
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Sort by:</label>
                <select className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-2 bg-white text-sm">
                  <option>Most Recent</option>
                  <option>Most Helpful</option>
                  <option>Highest Rating</option>
                  <option>Lowest Rating</option>
                </select>
              </div>
            </div>

            {/* Individual Reviews */}
            <div className="space-y-4 sm:space-y-6">
              {/* Review 1 */}
              <div className="border-b border-gray-200 pb-4 sm:pb-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-full flex items-center justify-center mr-2 sm:mr-4 flex-shrink-0">
                    <span className="text-orange-600 font-semibold text-xs sm:text-sm">R</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start sm:items-center justify-between mb-2 flex-col sm:flex-row gap-2 sm:gap-0">
                      <div>
                        <h4 className="font-semibold text-gray-900 flex items-center text-sm sm:text-base">
                          Rajesh Kumar
                          <svg className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 ml-1 sm:ml-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-500">15/01/2024</p>
                      </div>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <h5 className="font-semibold text-gray-900 mb-1.5 sm:mb-2 text-sm sm:text-base">Excellent car with great mileage</h5>
                    <p className="text-gray-700 mb-2 sm:mb-3 text-sm">
                      I have been using this car for 6 months now. The mileage is excellent in city conditions. Build quality is good and maintenance cost is reasonable.
                    </p>
                    <div className="flex items-center space-x-3 sm:space-x-4 text-xs sm:text-sm text-gray-500">
                      <button className="flex items-center hover:text-gray-700 min-h-[44px] py-2 sm:py-0">
                        <svg className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        24
                      </button>
                      <button className="flex items-center hover:text-gray-700 min-h-[44px] py-2 sm:py-0">
                        <svg className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.737 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                        </svg>
                        2
                      </button>
                      <span className="hidden sm:inline">Helpful</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review 2 */}
              <div className="border-b border-gray-200 pb-4 sm:pb-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-full flex items-center justify-center mr-2 sm:mr-4 flex-shrink-0">
                    <span className="text-orange-600 font-semibold text-xs sm:text-sm">P</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start sm:items-center justify-between mb-2 flex-col sm:flex-row gap-2 sm:gap-0">
                      <div>
                        <h4 className="font-semibold text-gray-900 flex items-center text-sm sm:text-base">
                          Priya Sharma
                          <svg className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 ml-1 sm:ml-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-500">12/01/2024</p>
                      </div>
                      <div className="flex items-center">
                        {[1, 2, 3, 4].map((star) => (
                          <svg key={star} className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <svg className="h-3 w-3 sm:h-4 sm:w-4 text-gray-300" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    </div>
                    <h5 className="font-semibold text-gray-900 mb-1.5 sm:mb-2 text-sm sm:text-base">Good family car</h5>
                    <p className="text-gray-700 mb-2 sm:mb-3 text-sm">
                      Perfect for family use. Spacious interior and comfortable seats. Only issue is the road noise at high speeds.
                    </p>
                    <div className="flex items-center space-x-3 sm:space-x-4 text-xs sm:text-sm text-gray-500">
                      <button className="flex items-center hover:text-gray-700 min-h-[44px] py-2 sm:py-0">
                        <svg className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        18
                      </button>
                      <button className="flex items-center hover:text-gray-700 min-h-[44px] py-2 sm:py-0">
                        <svg className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.737 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                        </svg>
                        1
                      </button>
                      <span className="hidden sm:inline">Helpful</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Read More Button */}
            <div className="text-center mt-4 sm:mt-6">
              <button className="text-red-600 hover:text-orange-600 font-medium transition-colors min-h-[44px] py-2 text-sm sm:text-base">Read More</button>
            </div>

            {/* Write Review CTA */}
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mt-4 sm:mt-6 text-center">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Own a {brand.name.toLowerCase()} car? Share your experience!</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                Help other buyers make informed decisions by sharing your honest review
              </p>
              <button className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white px-5 py-2 sm:px-6 sm:py-2 rounded-lg font-medium transition-all duration-200 shadow-md text-sm sm:text-base">
                Write a Review
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
