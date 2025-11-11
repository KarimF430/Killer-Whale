'use client'

import { useState, useEffect } from 'react'
import { Star, ChevronRight, ChevronDown, X } from 'lucide-react'
import Link from 'next/link'
import { getBrandIdFromSlug, getModelsByBrand, FrontendModel } from '@/lib/models-api'
import { truncateCarName } from '@/lib/text-utils'
import BrandCarFilters, { FilterState } from './BrandCarFilters'
import BrandCarCard from './BrandCarCard'

interface Car {
  id: number
  name: string
  price: string
  rating: number
  reviews: number
  power: string
  image: string
  isNew?: boolean
  seating: string
  fuelType: string
  transmission: string
  mileage: string
  safetyRating?: string
  variants: number
}

interface BrandCarsListProps {
  brand: string
}

export default function BrandCarsList({ brand }: BrandCarsListProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [models, setModels] = useState<FrontendModel[]>([])
  const [brandData, setBrandData] = useState<{ id: string; name: string; slug: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<FilterState>({
    sort: '',
    fuelType: [],
    transmission: [],
    priceRange: '',
    make: []
  })

  // Fetch models from backend
  useEffect(() => {
    async function fetchModels() {
      try {
        setLoading(true)
        setError(null)
        
        console.log('🔍 Fetching models for brand:', brand)
        
        // First try known brand IDs for speed (using semantic IDs)
        const knownBrandIds: { [key: string]: string } = {
          'honda': 'brand-honda',
          'maruti-suzuki': 'brand-maruti-suzuki',
          'maruti': 'brand-maruti-suzuki',
          'tata': 'brand-tata',
          'hyundai': 'brand-hyundai',
          'kia': 'brand-kia'
        }
        
        let brandId = knownBrandIds[brand.toLowerCase()]
        
        // If not in known brands, fetch from API dynamically
        if (!brandId) {
          console.log('🔍 Brand not in known list, fetching from API...')
          try {
            const brandsResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}/api/brands`)
            if (brandsResponse.ok) {
              const brands = await brandsResponse.json()
              const foundBrand = brands.find((b: any) => {
                const normalizedBrandName = b.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                return normalizedBrandName === brand.toLowerCase()
              })
              if (foundBrand) {
                brandId = foundBrand.id
                console.log('✅ Found brand ID from API:', brandId, 'for', foundBrand.name)
              }
            }
          } catch (apiError) {
            console.error('❌ Error fetching brands from API:', apiError)
          }
        }
        
        console.log('🔍 Final brand ID:', brandId)
        
        if (!brandId) {
          console.error('❌ No brand ID found for:', brand)
          setError(`Brand "${brand}" not found`)
          return
        }

        console.log('🔍 Fetching models for brand ID:', brandId)
        
        // Fetch models filtered by brand ID
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}/api/models?brandId=${brandId}`)
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const brandModels = await response.json()
        console.log('📊 Models response:', brandModels)
        
        if (brandModels && Array.isArray(brandModels)) {
          console.log('🔍 Found models for brand:', brandModels.length)
          
          if (brandModels.length === 0) {
            setError(`No models found for brand ID: ${brandId}`)
            return
          }
          
          // Fetch all variants to calculate prices and counts
          const variantsResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}/api/variants`)
          let allVariants: any[] = []
          
          if (variantsResponse.ok) {
            allVariants = await variantsResponse.json()
            console.log('📊 Total variants loaded:', allVariants.length)
          }
          
          // Get brand name for display
          const brandName = brand === 'maruti-suzuki' ? 'Maruti Suzuki' : brand.charAt(0).toUpperCase() + brand.slice(1)
          
          // Process models with variant data
          const modelsWithVariants = brandModels.map((model: any) => {
            // Find variants for this model
            const modelVariants = allVariants.filter((variant: any) => variant.modelId === model.id)
            
            // Calculate lowest price and variant count
            let lowestPrice = 0
            let variantCount = modelVariants.length
            
            if (modelVariants.length > 0) {
              const prices = modelVariants.map((v: any) => v.price || 0).filter(p => p > 0)
              if (prices.length > 0) {
                lowestPrice = Math.min(...prices)
              }
            }
            
            // Convert backend model to frontend format
            return {
              id: model.id,
              name: model.name,
              price: lowestPrice > 0 ? (lowestPrice / 100000).toFixed(2) : '0.00',
              rating: 4.5, // Default rating
              reviews: 1247, // Default reviews
              power: '120 PS',
              image: model.heroImage ? `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}${model.heroImage}` : '/car-placeholder.jpg',
              isNew: model.isNewModel || false,
              seating: '5',
              fuelType: model.fuelTypes ? model.fuelTypes.join('/') : 'Petrol',
              transmission: model.transmissions ? model.transmissions.join('/') : 'Manual',
              mileage: '18.5 kmpl',
              variants: variantCount || 0,
              slug: model.name.toLowerCase().replace(/\s+/g, '-'),
              brandName: brandName
            }
          })
          
          setModels(modelsWithVariants)
          setBrandData({ id: brandId, name: brandName, slug: brand })
          console.log('✅ Models processed with variant data:', modelsWithVariants.length)
        } else {
          console.error('❌ Invalid models data structure:', brandModels)
          setError('Invalid data structure received')
        }
      } catch (err) {
        console.error('❌ Error loading models:', err)
        setError('Failed to load models')
      } finally {
        setLoading(false)
      }
    }

    fetchModels()
  }, [brand])

  const brandName = brandData?.name || (brand === 'maruti-suzuki' ? 'Maruti Suzuki' : brand.charAt(0).toUpperCase() + brand.slice(1))

  // Apply filters to models
  const filteredModels = models.filter((model) => {
    // Filter by fuel type
    if (filters.fuelType.length > 0) {
      const modelFuelType = model.fuelType.toLowerCase()
      const hasMatchingFuel = filters.fuelType.some(filter => 
        modelFuelType.includes(filter)
      )
      if (!hasMatchingFuel) return false
    }

    // Filter by transmission
    if (filters.transmission.length > 0) {
      const modelTransmission = model.transmission.toLowerCase()
      const hasMatchingTransmission = filters.transmission.some(filter =>
        modelTransmission.includes(filter)
      )
      if (!hasMatchingTransmission) return false
    }

    return true
  })

  // Sort models
  const sortedModels = [...filteredModels].sort((a, b) => {
    if (filters.sort === 'price-low') {
      const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ''))
      const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ''))
      return priceA - priceB
    } else if (filters.sort === 'price-high') {
      const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ''))
      const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ''))
      return priceB - priceA
    }
    return 0
  })

  return (
    <>
      {/* Filters Section */}
      <BrandCarFilters filters={filters} onFilterChange={setFilters} />
      
      <section className="bg-white py-4">
        <div className="max-w-6xl mx-auto px-4">

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">Loading models...</div>
          </div>
        )}


        {/* Show error */}
        {error && (
          <div className="flex flex-col justify-center items-center py-12 space-y-4">
            <div className="text-red-500 text-xl font-bold">Error: {error}</div>
            <div className="text-gray-600 text-sm">
              <p>Brand slug: {brand}</p>
              <p>Please check the browser console for more details.</p>
              <p className="mt-2">Trying to fetch from: {process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}/api/brands</p>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* Car List */}
        {!loading && !error && (
          <div className="space-y-3">
            {models.length === 0 ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-gray-500">No models found for {brandName}</div>
              </div>
            ) : (
              sortedModels.map((car) => (
                <BrandCarCard
                  key={car.id}
                  car={car}
                  brandSlug={brand}
                  brandName={brandData?.name}
                />
              ))
            )}
          </div>
        )}
      </div>
    </section>
    </>
  )
}
