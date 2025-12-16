'use client'

import { useState } from 'react'
import Link from 'next/link'
import CarCard from './CarCard'

interface Car {
  id: string
  name: string
  brand: string
  brandName: string
  image: string
  startingPrice: number
  fuelTypes: string[]
  transmissions: string[]
  seating: number
  launchDate: string
  slug: string
  isNew: boolean
  isPopular: boolean
}

interface BudgetCarsByRange {
  'under-8': Car[]
  'under-15': Car[]
  'under-25': Car[]
  'under-50': Car[]
}

interface CarsByBudgetProps {
  budgetCarsByRange: BudgetCarsByRange
}

/**
 * ✅ PERFORMANCE OPTIMIZED: Cars by Budget Section
 * 
 * Performance Strategy:
 * 1. All data is pre-fetched on server-side (SSR/ISR) - no client-side API calls
 * 2. ISR caches the page for 1 hour - subsequent requests serve cached HTML
 * 3. Backend uses Redis caching - reduces database load
 * 4. Full SEO support - all content is server-rendered
 * 
 * No database calls happen at runtime - all data comes from cached sources.
 */
export default function CarsByBudget({ budgetCarsByRange }: CarsByBudgetProps) {
  const [selectedBudget, setSelectedBudget] = useState<keyof BudgetCarsByRange>('under-8')

  const budgetRanges = [
    { id: 'under-8' as const, label: 'Under ₹8 Lakh', max: 800000, urlSlug: '8' },
    { id: 'under-15' as const, label: 'Under ₹15 Lakh', max: 1500000, urlSlug: '15' },
    { id: 'under-25' as const, label: 'Under ₹25 Lakh', max: 2500000, urlSlug: '25' },
    { id: 'under-50' as const, label: 'Under ₹50 Lakh', max: 5000000, urlSlug: '50' },
  ]

  // ✅ SSR-OPTIMIZED: Direct access to pre-fetched data - no useEffect, no API calls
  const currentCars = budgetCarsByRange[selectedBudget] || []

  const scrollContainer = (direction: 'left' | 'right') => {
    const container = document.getElementById(`budget-cars-${selectedBudget}`)
    if (container) {
      const scrollAmount = 300
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Cars by Budget</h2>

      {/* Budget Filter Buttons - Compact like Top 10 Cars */}
      <div
        className="flex gap-2 overflow-x-auto scrollbar-hide mb-5 pb-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {budgetRanges.map((budget) => (
          <button
            key={budget.id}
            onClick={() => setSelectedBudget(budget.id)}
            className={`
              flex-shrink-0 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium 
              transition-all duration-200 whitespace-nowrap
              ${selectedBudget === budget.id
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
              }
            `}
          >
            {budget.label}
          </button>
        ))}
      </div>

      {/* Cars Horizontal Scroll */}
      <div className="relative">
        {currentCars.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No cars found in this budget range.</p>
          </div>
        ) : (
          <div className="relative group">
            {/* Left Scroll Arrow */}
            <button
              onClick={() => scrollContainer('left')}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full items-center justify-center text-gray-700 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 -ml-5"
              aria-label="Scroll left"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Right Scroll Arrow */}
            <button
              onClick={() => scrollContainer('right')}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full items-center justify-center text-gray-700 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 -mr-5"
              aria-label="Scroll right"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div
              id={`budget-cars-${selectedBudget}`}
              className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {currentCars.slice(0, 10).map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  onClick={() => {
                    const brandSlug = car.brandName.toLowerCase().replace(/\s+/g, '-')
                    const modelSlug = car.name.toLowerCase().replace(/\s+/g, '-')
                    window.location.href = `/${brandSlug}-cars/${modelSlug}`
                  }}
                />
              ))}

              {/* See More tile - always show to encourage visiting budget page for full list */}
              {currentCars.length > 0 && (
                <Link
                  href={`/best-cars-under-${budgetRanges.find(b => b.id === selectedBudget)?.urlSlug || '10'}-lakh`}
                  className="flex-shrink-0 w-[260px] sm:w-72 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  {/* Top section matching image height */}
                  <div className="h-40 sm:h-48 flex items-center justify-center bg-gradient-to-br from-orange-400 to-orange-500">
                    <div className="text-center px-4 sm:px-6">
                      <h3 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                        See More
                      </h3>
                    </div>
                  </div>

                  {/* Bottom section matching card info height */}
                  <div className="p-4 sm:p-5 bg-gradient-to-br from-orange-500 to-orange-600">
                    <h4 className="text-xl sm:text-2xl font-bold text-white text-center mb-3 sm:mb-4">
                      {budgetRanges.find(b => b.id === selectedBudget)?.label} Cars
                    </h4>

                    {/* Spacer to match card height */}
                    <div className="h-20 sm:h-24"></div>

                    {/* Button matching View Details */}
                    <div className="w-full bg-white text-orange-600 py-2 sm:py-2.5 rounded-lg font-semibold text-sm sm:text-base text-center shadow-md">
                      View All Cars
                    </div>
                  </div>
                </Link>
              )}
            </div>
            <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-gray-50 via-gray-50/80 to-transparent pointer-events-none sm:hidden -z-10" />
          </div>
        )}
      </div>
    </div>
  )
}
