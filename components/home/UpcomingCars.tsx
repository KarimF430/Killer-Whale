'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import UpcomingCarCard from './UpcomingCarCard'

interface UpcomingCar {
  id: string
  name: string
  brandId: string
  brandName: string
  image: string
  expectedPriceMin: number
  expectedPriceMax: number
  fuelTypes: string[]
  expectedLaunchDate: string
  isNew: boolean
  isPopular: boolean
}

export default function UpcomingCars({ initialCars = [] }: { initialCars?: UpcomingCar[] }) {
  const [upcomingCars, setUpcomingCars] = useState<UpcomingCar[]>(initialCars)
  const [loading, setLoading] = useState(false)

  // Update state if props change (though for SSR initial render is key)
  useEffect(() => {
    if (initialCars.length > 0) {
      setUpcomingCars(initialCars)
    }
  }, [initialCars])

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">Upcoming Cars</h2>

      {/* Cars Horizontal Scroll */}
      <div className="relative">
        {loading ? (
          <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-shrink-0 w-72 bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-5 space-y-3">
                  <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-8 bg-gray-200 animate-pulse rounded w-1/2"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : upcomingCars.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No upcoming cars found.</p>
          </div>
        ) : (
          <div className="relative">
            <div className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {upcomingCars.map((car) => (
                <UpcomingCarCard
                  key={car.id}
                  car={car}
                  onClick={() => {
                    const brandSlug = car.brandName.toLowerCase().replace(/\s+/g, '-')
                    const modelSlug = car.name.toLowerCase().replace(/\s+/g, '-')
                    // Navigate to upcoming car detail page (can be updated later)
                    window.location.href = `/${brandSlug}-cars/${modelSlug}`
                  }}
                />
              ))}
            </div>
            <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-gray-50 via-gray-50/80 to-transparent pointer-events-none sm:hidden -z-10" />
          </div>
        )}
      </div>
    </div >
  )
}
