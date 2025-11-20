'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import CarCard from './CarCard'
import { Calendar, Fuel, Heart, Gauge } from 'lucide-react'

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
  popularRank: number | null
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

export default function PopularCars() {
  const [popularCars, setPopularCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch popular cars from backend
  useEffect(() => {
    const fetchPopularCars = async () => {
      try {
        setLoading(true)
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

        // Fetch only popular cars from the optimized endpoint
        const res = await fetch(`${backendUrl}/api/cars/popular`)

        if (!res.ok) {
          console.error('Failed to fetch popular cars:', res.status)
          setPopularCars([])
          setLoading(false)
          return
        }

        const data = await res.json()

        // Map backend data to component state
        const processedCars: Car[] = data.map((car: any) => ({
          id: car.id,
          name: car.name,
          brand: car.brandId,
          brandName: car.brandName,
          image: car.image ? (car.image.startsWith('http') ? car.image : `${backendUrl}${car.image}`) : '',
          startingPrice: car.startingPrice,
          fuelTypes: car.fuelTypes,
          transmissions: car.transmissions,
          seating: car.seating,
          launchDate: car.launchDate ? `Launched ${formatLaunchDate(car.launchDate)}` : 'Launched',
          slug: `${car.brandName.toLowerCase().replace(/\s+/g, '-')}-${car.name.toLowerCase().replace(/\s+/g, '-')}`,
          isNew: car.isNew,
          isPopular: car.isPopular,
          popularRank: car.popularRank
        }))

        setPopularCars(processedCars)
      } catch (error) {
        console.error('Error fetching popular cars:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPopularCars()
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Popular Cars</h2>

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
        ) : popularCars.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No popular cars found.</p>
          </div>
        ) : (
          <div
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {popularCars.map((car) => (
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
          </div>
        )}
      </div>
    </div>
  )
}
