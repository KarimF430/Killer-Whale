'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { calculateOnRoadPrice } from '@/lib/rto-data-optimized'

interface ComparisonData {
  id: string
  model1: {
    id: string
    name: string
    brand: string
    heroImage: string
    startingPrice: number
    fuelTypes: string[]
  }
  model2: {
    id: string
    name: string
    brand: string
    heroImage: string
    startingPrice: number
    fuelTypes: string[]
  }
}

interface BrandCompareBoxProps {
  brandName: string
}

export default function BrandCompareBox({ brandName }: BrandCompareBoxProps) {
  const [comparisons, setComparisons] = useState<ComparisonData[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

  // Helper function to calculate on-road price
  const getOnRoadPrice = (exShowroomPrice: number, fuelType: string): number => {
    const selectedCity = typeof window !== 'undefined'
      ? localStorage.getItem('selectedCity') || 'Mumbai, Maharashtra'
      : 'Mumbai, Maharashtra'

    const state = selectedCity.split(',')[1]?.trim() || 'Maharashtra'
    const breakup = calculateOnRoadPrice(exShowroomPrice, state, fuelType)
    return breakup.totalOnRoadPrice
  }

  useEffect(() => {
    fetchComparisons()
  }, [brandName])

  const fetchComparisons = async () => {
    try {
      setLoading(true)

      // Fetch popular comparisons
      const comparisonsRes = await fetch(`${backendUrl}/api/popular-comparisons`)
      if (!comparisonsRes.ok) {
        setComparisons([])
        return
      }

      const comparisonsData = await comparisonsRes.json()

      // ✅ OPTIMIZATION: Use models-with-pricing instead of fetching 1000 variants
      const modelsRes = await fetch(`${backendUrl}/api/models-with-pricing?limit=100`)
      const modelsResponse = await modelsRes.json()
      const models = modelsResponse.data || modelsResponse

      const brandsRes = await fetch(`${backendUrl}/api/brands`)
      const brands = await brandsRes.json()

      // Create brand map
      const brandMap: Record<string, string> = {}
      brands.forEach((brand: any) => {
        brandMap[brand.id] = brand.name
      })

      // Process comparisons with full model data and filter by brand
      const processedComparisons = comparisonsData
        .filter((comp: any) => comp.model1Id && comp.model2Id)
        .map((comp: any) => {
          const model1 = models.find((m: any) => m.id === comp.model1Id)
          const model2 = models.find((m: any) => m.id === comp.model2Id)

          if (!model1 || !model2) return null

          // Filter: at least one model must be from the specified brand
          const brand1 = brandMap[model1.brandId]?.toLowerCase()
          const brand2 = brandMap[model2.brandId]?.toLowerCase()
          const targetBrand = brandName.toLowerCase()

          if (brand1 !== targetBrand && brand2 !== targetBrand) {
            return null
          }

          // ✅ OPTIMIZATION: Use lowestPrice from models-with-pricing (no variants needed!)
          const model1Price = model1.lowestPrice || 0
          const model2Price = model2.lowestPrice || 0

          return {
            id: comp.id,
            model1: {
              id: model1.id,
              name: model1.name,
              brand: brandMap[model1.brandId] || 'Unknown',
              heroImage: model1.heroImage ? (model1.heroImage.startsWith('http') ? model1.heroImage : `${backendUrl}${model1.heroImage}`) : '',
              startingPrice: model1Price,
              fuelTypes: model1.fuelTypes || ['Petrol']
            },
            model2: {
              id: model2.id,
              name: model2.name,
              brand: brandMap[model2.brandId] || 'Unknown',
              heroImage: model2.heroImage ? (model2.heroImage.startsWith('http') ? model2.heroImage : `${backendUrl}${model2.heroImage}`) : '',
              startingPrice: model2Price,
              fuelTypes: model2.fuelTypes || ['Petrol']
            }
          }
        })
        .filter(Boolean)

      setComparisons(processedComparisons)
    } catch (error) {
      console.error('Error fetching comparisons:', error)
      setComparisons([])
    } finally {
      setLoading(false)
    }
  }

  const handleCompareClick = (model1: any, model2: any) => {
    const slug1 = `${model1.brand.toLowerCase().replace(/\s+/g, '-')}-${model1.name.toLowerCase().replace(/\s+/g, '-')}`
    const slug2 = `${model2.brand.toLowerCase().replace(/\s+/g, '-')}-${model2.name.toLowerCase().replace(/\s+/g, '-')}`
    router.push(`/compare/${slug1}-vs-${slug2}`)
  }

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
            Compare {brandName.charAt(0).toUpperCase() + brandName.slice(1)} Cars
          </h2>
          {/* Comparison Cards Horizontal Scroll */}
          <div className="relative">
            <div className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {[1, 2, 3].map(i => (
                <div key={i} className="flex-shrink-0 w-[320px] bg-white rounded-xl border border-gray-200 p-3 animate-pulse">
                  <div className="h-32 bg-gray-200 rounded mb-3"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
            <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none sm:hidden -z-10" />
          </div>
        </div>
      </section>
    )
  }

  // Show section even if no comparisons (for debugging)
  if (comparisons.length === 0) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
            Compare {brandName.charAt(0).toUpperCase() + brandName.slice(1)} Cars
          </h2>
          <div className="text-center py-8 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500">No comparisons available for this brand yet.</p>
            <button
              onClick={() => router.push('/compare')}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Create Your Own Comparison
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Only change from home page */}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
          Compare {brandName.charAt(0).toUpperCase() + brandName.slice(1)} Cars
        </h2>

        {/* Comparison Cards - With Scroll Arrows */}
        {/* Popular Comparisons */}
        <div className="relative group">
          {/* Left Scroll Arrow */}
          <button
            onClick={() => {
              const container = document.getElementById('brand-compare-scroll')
              container?.scrollBy({ left: -340, behavior: 'smooth' })
            }}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full items-center justify-center text-gray-700 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 -ml-5"
            aria-label="Scroll left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => {
              const container = document.getElementById('brand-compare-scroll')
              container?.scrollBy({ left: 340, behavior: 'smooth' })
            }}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full items-center justify-center text-gray-700 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 -mr-5"
            aria-label="Scroll right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div
            id="brand-compare-scroll"
            className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto pb-4 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {comparisons.map((comparison) => {
              const model1OnRoad = getOnRoadPrice(
                comparison.model1.startingPrice,
                comparison.model1.fuelTypes[0] || 'Petrol'
              )
              const model2OnRoad = getOnRoadPrice(
                comparison.model2.startingPrice,
                comparison.model2.fuelTypes[0] || 'Petrol'
              )

              return (
                <div
                  key={comparison.id}
                  className="flex-shrink-0 w-[320px] bg-white rounded-xl border border-gray-200 p-3 hover:shadow-lg transition-all duration-300"
                >
                  {/* Side by Side Layout with VS Badge */}
                  <div className="flex items-start gap-2 mb-3">
                    {/* Model 1 */}
                    <div className="flex-1">
                      <div className="relative mb-2">
                        <img
                          src={comparison.model1.heroImage}
                          alt={`${comparison.model1.brand} ${comparison.model1.name}`}
                          className="w-full h-20 object-contain"
                          onError={(e) => {
                            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='%23374151'%3E%3Cpath d='M50 200h300c5.5 0 10-4.5 10-10v-80c0-16.6-13.4-30-30-30H70c-16.6 0-30 13.4-30 30v80c0 5.5 4.5 10 10 10z'/%3E%3Ccircle cx='100' cy='220' r='25' fill='%23111827'/%3E%3Ccircle cx='300' cy='220' r='25' fill='%23111827'/%3E%3Cpath d='M80 110h240l-20-30H100z' fill='%236B7280'/%3E%3C/svg%3E"
                          }}
                        />
                      </div>
                      <div className="text-left">
                        <div className="text-xs text-gray-500">{comparison.model1.brand}</div>
                        <div className="font-bold text-sm text-gray-900 mb-1">{comparison.model1.name}</div>
                        <div className="text-red-600 font-bold text-sm">
                          ₹ {(model1OnRoad / 100000).toFixed(2)} Lakh
                        </div>
                        <div className="text-xs text-gray-500">On-Road Price</div>
                      </div>
                    </div>

                    {/* VS Badge - Positioned between cards */}
                    <div className="flex items-center justify-center" style={{ marginTop: '30px' }}>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-600 to-orange-500 flex items-center justify-center shadow-md">
                        <span className="text-white text-xs font-bold">VS</span>
                      </div>
                    </div>

                    {/* Model 2 */}
                    <div className="flex-1">
                      <div className="relative mb-2">
                        <img
                          src={comparison.model2.heroImage}
                          alt={`${comparison.model2.brand} ${comparison.model2.name}`}
                          className="w-full h-20 object-contain"
                          onError={(e) => {
                            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='%23374151'%3E%3Cpath d='M50 200h300c5.5 0 10-4.5 10-10v-80c0-16.6-13.4-30-30-30H70c-16.6 0-30 13.4-30 30v80c0 5.5 4.5 10 10 10z'/%3E%3Ccircle cx='100' cy='220' r='25' fill='%23111827'/%3E%3Ccircle cx='300' cy='220' r='25' fill='%23111827'/%3E%3Cpath d='M80 110h240l-20-30H100z' fill='%236B7280'/%3E%3C/svg%3E"
                          }}
                        />
                      </div>
                      <div className="text-left">
                        <div className="text-xs text-gray-500">{comparison.model2.brand}</div>
                        <div className="font-bold text-sm text-gray-900 mb-1">{comparison.model2.name}</div>
                        <div className="text-red-600 font-bold text-sm">
                          ₹ {(model2OnRoad / 100000).toFixed(2)} Lakh
                        </div>
                        <div className="text-xs text-gray-500">On-Road Price</div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCompareClick(comparison.model1, comparison.model2)}
                    className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white py-2 rounded-lg transition-all duration-200 text-sm font-semibold shadow-sm"
                  >
                    Compare Now
                  </button>
                </div>
              )
            })}
          </div>
          <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none sm:hidden -z-10" />
        </div>

        {/* Compare Cars of Your Choice Button */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push('/compare')}
            className="w-full max-w-md bg-white border-2 border-red-600 text-red-600 hover:bg-red-50 py-3 rounded-lg transition-all duration-200 font-medium"
          >
            Compare Cars of Your Choice
          </button>
        </div>
      </div>
    </section>
  )
}
