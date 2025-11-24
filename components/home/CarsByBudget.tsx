'use client'

import { useState, useEffect } from 'react'
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

// Helper function to format launch date
const formatLaunchDate = (date: string): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const parts = date.split('-')
  if (parts.length === 2) {
    const year = parts[0]
    const monthIndex = parseInt(parts[1]) - 1
    return `${months[monthIndex]} ${year}`
  }
  return date
}

// Helper function to format transmission
const formatTransmission = (transmission: string): string => {
  const lower = transmission.toLowerCase()
  if (lower === 'manual') {
    return 'Manual'
  }
  if (lower === 'automatic') {
    return 'Automatic'
  }
  return transmission.toUpperCase()
}

// Helper function to format fuel type
const formatFuelType = (fuel: string): string => {
  const lower = fuel.toLowerCase()
  if (lower === 'cng') {
    return 'CNG'
  }
  return fuel.charAt(0).toUpperCase() + fuel.slice(1).toLowerCase()
}

export default function CarsByBudget({ initialCars = [] }: { initialCars?: Car[] }) {
  const [selectedBudget, setSelectedBudget] = useState('under-8')
  const [carsByBudget, setCarsByBudget] = useState<Record<string, Car[]>>({})
  const [loading, setLoading] = useState(false)

  const budgetRanges = [
    { id: 'under-8', label: 'Under ₹8 Lakh', max: 800000 },
    { id: 'under-15', label: 'Under ₹15 Lakh', max: 1500000 },
    { id: 'under-25', label: 'Under ₹25 Lakh', max: 2500000 },
    { id: 'under-50', label: 'Under ₹50 Lakh', max: 5000000 },
    { id: 'above-50', label: 'Above ₹50 Lakh', max: Infinity }
  ]

  useEffect(() => {
    if (initialCars.length > 0) {
      // ✅ FIXED: Use proper price RANGES, not cumulative filters
      const organized: Record<string, Car[]> = {
        'under-8': initialCars.filter(car => car.startingPrice > 0 && car.startingPrice <= 800000),
        'under-15': initialCars.filter(car => car.startingPrice > 800000 && car.startingPrice <= 1500000),
        'under-25': initialCars.filter(car => car.startingPrice > 1500000 && car.startingPrice <= 2500000),
        'under-50': initialCars.filter(car => car.startingPrice > 2500000 && car.startingPrice <= 5000000),
        'above-50': initialCars.filter(car => car.startingPrice > 5000000)
      }
      setCarsByBudget(organized)
    }
  }, [initialCars])

  const currentCars = carsByBudget[selectedBudget as keyof typeof carsByBudget] || []

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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Cars by Budget</h2>

      {/* Budget Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        {budgetRanges.map((budget) => (
          <button
            key={budget.id}
            onClick={() => setSelectedBudget(budget.id)}
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${selectedBudget === budget.id
              ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {budget.label}
          </button>
        ))}
      </div>

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
        ) : currentCars.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No cars found in this budget range.</p>
          </div>
        ) : (
          <div className="relative">
            <div
              id={`budget-cars-${selectedBudget}`}
              className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {currentCars.slice(0, 10).map((car, index) => (
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
                  href={`/cars-by-budget/${selectedBudget}`}
                  className="flex-shrink-0 w-72 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  {/* Top section matching image height */}
                  <div className="h-48 flex items-center justify-center bg-gradient-to-br from-orange-400 to-orange-500">
                    <div className="text-center px-6">
                      <h3 className="text-4xl font-bold text-white mb-2">
                        See More
                      </h3>
                    </div>
                  </div>

                  {/* Bottom section matching card info height */}
                  <div className="p-5 bg-gradient-to-br from-orange-500 to-orange-600">
                    <h4 className="text-2xl font-bold text-white text-center mb-4">
                      {budgetRanges.find(b => b.id === selectedBudget)?.label} Cars
                    </h4>

                    {/* Spacer to match card height */}
                    <div className="h-24"></div>

                    {/* Button matching View Details */}
                    <div className="w-full bg-white text-orange-600 py-2.5 rounded-lg font-semibold text-center shadow-md">
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
