'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import CarCard from './CarCard'
import { Heart, Calendar, Fuel, Gauge } from 'lucide-react'

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
  newRank: number | null
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

export default function NewLaunchedCars() {
  const [newLaunchedCars, setNewLaunchedCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch new launched cars from backend
  useEffect(() => {
    const fetchNewLaunchedCars = async () => {
      try {
        setLoading(true)
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

        // Fetch all models, brands, and variants
        const [modelsRes, brandsRes, variantsRes] = await Promise.all([
          fetch(`${backendUrl}/api/models`),
          fetch(`${backendUrl}/api/brands`),
          fetch(`${backendUrl}/api/variants`)
        ])

        if (!modelsRes.ok || !brandsRes.ok || !variantsRes.ok) {
          console.error('Failed to fetch data:', {
            models: modelsRes.status,
            brands: brandsRes.status,
            variants: variantsRes.status
          })
          setNewLaunchedCars([])
          setLoading(false)
          return
        }

        const models = await modelsRes.json()
        const brands = await brandsRes.json()
        const variants = await variantsRes.json()

        // Create a map of brand IDs to brand names
        const brandMap = brands.reduce((acc: any, brand: any) => {
          acc[brand.id] = brand.name
          return acc
        }, {})

        // Filter only new models
        const newModels = models.filter((model: any) => model.isNew === true)

        // Process each new model
        const processedCars: Car[] = newModels.map((model: any) => {
          // Find all variants for this model
          const modelVariants = variants.filter((v: any) => v.modelId === model.id)

          // Find lowest price variant
          const lowestPrice = modelVariants.length > 0
            ? Math.min(...modelVariants.map((v: any) => v.price || 0))
            : model.price || 0

          // Get unique fuel types and transmissions from model or variants
          const fuelTypes = model.fuelTypes && model.fuelTypes.length > 0
            ? model.fuelTypes
            : Array.from(new Set(modelVariants.map((v: any) => v.fuel).filter(Boolean)))

          const transmissions = model.transmissions && model.transmissions.length > 0
            ? model.transmissions
            : Array.from(new Set(modelVariants.map((v: any) => v.transmission).filter(Boolean)))

          // Get hero image from model (handle both full URLs and relative paths)
          const heroImage = model.heroImage
            ? (model.heroImage.startsWith('http') ? model.heroImage : `${backendUrl}${model.heroImage}`)
            : ''

          return {
            id: model.id,
            name: model.name,
            brand: model.brandId,
            brandName: brandMap[model.brandId] || 'Unknown',
            image: heroImage,
            startingPrice: lowestPrice,
            fuelTypes: fuelTypes.length > 0 ? fuelTypes : ['Petrol'],
            transmissions: transmissions.length > 0 ? transmissions : ['Manual'],
            seating: model.seating || 5,
            launchDate: model.launchDate ? `Launched ${formatLaunchDate(model.launchDate)}` : 'Launched',
            slug: `${(brandMap[model.brandId] || '').toLowerCase().replace(/\s+/g, '-')}-${model.name.toLowerCase().replace(/\s+/g, '-')}`,
            isNew: model.isNew || false,
            isPopular: model.isPopular || false,
            newRank: model.newRank || null
          }
        })

        // Sort by newRank (ascending order - 1, 2, 3...)
        const sortedCars = processedCars.sort((a, b) => {
          const rankA = a.newRank || 999
          const rankB = b.newRank || 999
          return rankA - rankB
        })

        setNewLaunchedCars(sortedCars)
      } catch (error) {
        console.error('Error fetching new launched cars:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNewLaunchedCars()
  }, [])


  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-8">New Launches</h2>

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
        ) : newLaunchedCars.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No new launches found.</p>
          </div>
        ) : (
          <div className="relative">
            <div
              className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {newLaunchedCars.map((car) => (
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
            <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-gray-50 via-gray-50/80 to-transparent pointer-events-none sm:hidden -z-10" />
          </div>
        )}
      </div>
    </div>
  )
}
