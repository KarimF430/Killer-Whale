'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import VariantCard from './VariantCard'

interface AllVariantsClientProps {
  model: any
}

export default function AllVariantsClient({ model }: AllVariantsClientProps) {
  const router = useRouter()
  const [modelVariants, setModelVariants] = useState<any[]>([])
  const [loadingVariants, setLoadingVariants] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')

  // Fetch variants for this model (EXACT COPY FROM MODEL PAGE)
  useEffect(() => {
    const fetchVariants = async () => {
      if (!model?.id) return
      
      try {
        setLoadingVariants(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}/api/variants?modelId=${model.id}`)
        if (response.ok) {
          const variants = await response.json()
          setModelVariants(variants)
        } else {
          console.error('Failed to fetch variants:', response.statusText)
          setModelVariants([])
        }
      } catch (error) {
        console.error('Error fetching variants:', error)
        setModelVariants([])
      } finally {
        setLoadingVariants(false)
      }
    }

    fetchVariants()
  }, [model?.id])

  // Transform backend variant data to match component structure (EXACT COPY FROM MODEL PAGE)
  const allVariants = modelVariants.map(variant => ({
    id: variant.id,
    name: variant.name,
    price: variant.price ? (variant.price / 100000) : 0, // Convert to lakhs
    fuel: (variant as any).fuel || variant.fuelType || "Petrol",
    transmission: (variant as any).transmission || "Manual",
    power: (variant as any).maxPower || variant.enginePower || "N/A",
    features: variant.keyFeatures || variant.headerSummary || "Standard features included",
    isValueForMoney: variant.isValueForMoney || false
  })).sort((a, b) => a.price - b.price)

  // Helper function to check if transmission is automatic type (EXACT COPY FROM MODEL PAGE)
  const isAutomaticTransmission = (transmission: string) => {
    const automaticTypes = ['automatic', 'cvt', 'amt', 'dct', 'torque converter', 'dual clutch']
    return automaticTypes.some(type => transmission.toLowerCase().includes(type))
  }

  // Generate dynamic filters based on available variants (EXACT COPY FROM MODEL PAGE)
  const getDynamicFilters = () => {
    const filters = ['All']
    const fuelTypes = new Set<string>()
    let hasAutomatic = false
    let hasValueVariants = false

    allVariants.forEach(variant => {
      if (variant.fuel) fuelTypes.add(variant.fuel)
      if (variant.transmission && isAutomaticTransmission(variant.transmission)) {
        hasAutomatic = true
      }
      if (variant.isValueForMoney === true) {
        hasValueVariants = true
      }
    })

    fuelTypes.forEach(fuel => filters.push(fuel))
    if (hasAutomatic) filters.push('Automatic')
    if (hasValueVariants) filters.push('Value for Money Variants')
    
    return filters
  }

  const availableFilters = getDynamicFilters()

  // Filter variants based on active filter (EXACT COPY FROM MODEL PAGE)
  const getFilteredVariants = () => {
    switch (activeFilter) {
      case 'All':
        return allVariants
      case 'Diesel':
        return allVariants.filter(variant => variant.fuel === 'Diesel')
      case 'Petrol':
        return allVariants.filter(variant => variant.fuel === 'Petrol')
      case 'CNG':
        return allVariants.filter(variant => variant.fuel === 'CNG')
      case 'Automatic':
        return allVariants.filter(variant => 
          variant.transmission && isAutomaticTransmission(variant.transmission)
        )
      case 'Value for Money Variants':
        return allVariants.filter(variant => variant.isValueForMoney === true)
      default:
        return allVariants
    }
  }

  const filteredVariants = getFilteredVariants()

  const handleVariantClick = (variant: any) => {
    const brandSlug = model?.brandName?.toLowerCase().replace(/\s+/g, '-')
    const modelSlug = model?.name?.toLowerCase().replace(/\s+/g, '-')
    const variantSlug = variant.name.toLowerCase().replace(/\s+/g, '-')
    router.push(`/${brandSlug}-cars/${modelSlug}/${variantSlug}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-2"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Variants</h1>
        </div>
      </div>

      {/* EXACT COPY OF VARIANTS SECTION FROM MODEL PAGE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Filter Options - Dynamic based on available variants */}
          <div className="flex flex-wrap gap-3">
            {availableFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeFilter === filter
                    ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Variant Cards - Dynamic (Show ALL variants) */}
          <div className="space-y-4">
            {loadingVariants ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading variants...</p>
              </div>
            ) : filteredVariants.length > 0 ? (
              filteredVariants.map((variant) => (
                <VariantCard
                  key={variant.id}
                  variant={variant}
                  onClick={() => handleVariantClick(variant)}
                  onGetPrice={(e) => {
                    e.stopPropagation()
                    handleVariantClick(variant)
                  }}
                  onCompare={(e) => e.stopPropagation()}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No variants found for the selected filter.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
