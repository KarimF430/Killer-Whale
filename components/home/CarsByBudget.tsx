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

export default function CarsByBudget() {
  const [selectedBudget, setSelectedBudget] = useState('under-8')
  const [carsByBudget, setCarsByBudget] = useState<Record<string, Car[]>>({})
  const [loading, setLoading] = useState(true)

  const budgetRanges = [
    { id: 'under-8', label: 'Under ₹8 Lakh', max: 800000 },
    { id: 'under-15', label: 'Under ₹15 Lakh', max: 1500000 },
    { id: 'under-25', label: 'Under ₹25 Lakh', max: 2500000 },
    { id: 'under-50', label: 'Under ₹50 Lakh', max: 5000000 },
    { id: 'above-50', label: 'Above ₹50 Lakh', max: Infinity }
  ]

  // Fetch real data from backend
  useEffect(() => {
    const fetchCarsData = async () => {
      try {
        setLoading(true)
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

        console.log('🚗 CarsByBudget: Fetching data from:', backendUrl)

        // Fetch all models, brands, and variants
        const [modelsRes, brandsRes, variantsRes] = await Promise.all([
          fetch(`${backendUrl}/api/models`),
          fetch(`${backendUrl}/api/brands`),
          fetch(`${backendUrl}/api/variants`)
        ])

        console.log('📊 Response status:', {
          models: modelsRes.status,
          brands: brandsRes.status,
          variants: variantsRes.status
        })

        if (!modelsRes.ok || !brandsRes.ok || !variantsRes.ok) {
          console.error('❌ Failed to fetch data:', {
            models: modelsRes.status,
            brands: brandsRes.status,
            variants: variantsRes.status
          })
          setCarsByBudget({})
          setLoading(false)
          return
        }

        const models = await modelsRes.json()
        const brands = await brandsRes.json()
        const variants = await variantsRes.json()

        console.log('✅ Data fetched successfully:', {
          modelsCount: models.length,
          brandsCount: brands.length,
          variantsCount: variants.length
        })

        // Create a map of brand IDs to brand names
        const brandMap = brands.reduce((acc: any, brand: any) => {
          acc[brand.id] = brand.name
          return acc
        }, {})

        // Process each model to find lowest variant price
        const processedCars: Car[] = models.map((model: any) => {
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
            isNew: model.isModelNew || false,
            isPopular: model.isModelPopular || false
          }
        })

        // Organize cars by budget (include cars with price 0 in all categories for now)
        const organized: Record<string, Car[]> = {
          'under-8': processedCars.filter(car => car.startingPrice <= 800000),
          'under-15': processedCars.filter(car => car.startingPrice <= 1500000),
          'under-25': processedCars.filter(car => car.startingPrice <= 2500000),
          'under-50': processedCars.filter(car => car.startingPrice <= 5000000),
          'above-50': processedCars.filter(car => car.startingPrice > 5000000 || car.startingPrice === 0)
        }

        setCarsByBudget(organized)
      } catch (error) {
        console.error('Error fetching cars data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCarsData()
  }, [])

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
          <div
            id={`budget-cars-${selectedBudget}`}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {currentCars.map((car, index) => (
              <>
                <CarCard
                  key={car.id}
                  car={car}
                  onClick={() => {
                    const brandSlug = car.brandName.toLowerCase().replace(/\s+/g, '-')
                    const modelSlug = car.name.toLowerCase().replace(/\s+/g, '-')
                    window.location.href = `/${brandSlug}-cars/${modelSlug}`
                  }}
                />
                {/* Insert "See More" tile after every 10th car */}
                {(index + 1) % 10 === 0 && index !== currentCars.length - 1 && (
                  <Link
                    href={`/cars-by-budget/${selectedBudget}`}
                    key={`see-more-${index}`}
                    className="flex-shrink-0 w-72 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center p-8"
                  >
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        See More
                      </h3>
                      <p className="text-xl font-semibold text-white">
                        {budgetRanges.find(b => b.id === selectedBudget)?.label} Cars
                      </p>
                    </div>
                  </Link>
                )}
              </>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
