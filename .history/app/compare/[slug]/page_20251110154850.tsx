'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, Search } from 'lucide-react'
import { calculateOnRoadPrice } from '@/lib/rto-data-optimized'

interface Variant {
  id: string
  name: string
  price: number
  fuelType: string
  transmission: string
  specifications: {
    engine: {
      maxPower: string
      maxTorque: string
      engineType: string
      engineCapacity: string
    }
  }
}

interface Model {
  id: string
  name: string
  brandName: string
  heroImage: string
  variants: Variant[]
  fuelTypes: string[]
}

interface ComparePageProps {
  params: Promise<{ slug: string }>
}

export default function ComparePage({ params }: ComparePageProps) {
  const router = useRouter()
  const [slug, setSlug] = useState<string>('')
  const [model1, setModel1] = useState<Model | null>(null)
  const [model2, setModel2] = useState<Model | null>(null)
  const [selectedVariant1, setSelectedVariant1] = useState<Variant | null>(null)
  const [selectedVariant2, setSelectedVariant2] = useState<Variant | null>(null)
  const [loading, setLoading] = useState(true)
  const [showVariantDropdown1, setShowVariantDropdown1] = useState(false)
  const [showVariantDropdown2, setShowVariantDropdown2] = useState(false)
  const [showDifferences, setShowDifferences] = useState(false)

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

  useEffect(() => {
    params.then(p => setSlug(p.slug))
  }, [params])

  useEffect(() => {
    if (!slug) return
    fetchComparisonData()
  }, [slug])

  const fetchComparisonData = async () => {
    try {
      setLoading(true)
      
      // Parse slug: "brand1-model1-vs-brand2-model2"
      const parts = slug.split('-vs-')
      if (parts.length !== 2) {
        console.error('Invalid comparison slug format')
        return
      }

      const [slug1, slug2] = parts

      // Fetch all models and brands
      const [modelsRes, brandsRes, variantsRes] = await Promise.all([
        fetch(`${backendUrl}/api/models`),
        fetch(`${backendUrl}/api/brands`),
        fetch(`${backendUrl}/api/variants`)
      ])

      const models = await modelsRes.json()
      const brands = await brandsRes.json()
      const allVariants = await variantsRes.json()

      // Create brand map
      const brandMap: Record<string, string> = {}
      brands.forEach((brand: any) => {
        brandMap[brand.id] = brand.name
      })

      // Find models by slug
      const findModel = (targetSlug: string) => {
        return models.find((m: any) => {
          const brandName = brandMap[m.brandId] || ''
          const modelSlug = `${brandName.toLowerCase().replace(/\s+/g, '-')}-${m.name.toLowerCase().replace(/\s+/g, '-')}`
          return modelSlug === targetSlug
        })
      }

      const foundModel1 = findModel(slug1)
      const foundModel2 = findModel(slug2)

      if (!foundModel1 || !foundModel2) {
        console.error('Models not found')
        return
      }

      // Get variants for each model
      const model1Variants = allVariants
        .filter((v: any) => v.modelId === foundModel1.id)
        .map((v: any) => ({
          id: v.id,
          name: v.name,
          price: v.price || 0,
          fuelType: v.fuelType || 'Petrol',
          transmission: v.transmission || 'Manual',
          specifications: v.specifications || {
            engine: {
              maxPower: '',
              maxTorque: '',
              engineType: '',
              engineCapacity: ''
            }
          }
        }))

      const model2Variants = allVariants
        .filter((v: any) => v.modelId === foundModel2.id)
        .map((v: any) => ({
          id: v.id,
          name: v.name,
          price: v.price || 0,
          fuelType: v.fuelType || 'Petrol',
          transmission: v.transmission || 'Manual',
          specifications: v.specifications || {
            engine: {
              maxPower: '',
              maxTorque: '',
              engineType: '',
              engineCapacity: ''
            }
          }
        }))

      const processedModel1: Model = {
        id: foundModel1.id,
        name: foundModel1.name,
        brandName: brandMap[foundModel1.brandId],
        heroImage: foundModel1.heroImage ? `${backendUrl}${foundModel1.heroImage}` : '',
        variants: model1Variants,
        fuelTypes: foundModel1.fuelTypes || ['Petrol']
      }

      const processedModel2: Model = {
        id: foundModel2.id,
        name: foundModel2.name,
        brandName: brandMap[foundModel2.brandId],
        heroImage: foundModel2.heroImage ? `${backendUrl}${foundModel2.heroImage}` : '',
        variants: model2Variants,
        fuelTypes: foundModel2.fuelTypes || ['Petrol']
      }

      setModel1(processedModel1)
      setModel2(processedModel2)

      // Select lowest price variants by default
      if (model1Variants.length > 0) {
        const lowestVariant1 = model1Variants.reduce((prev: Variant, curr: Variant) => 
          (curr.price < prev.price && curr.price > 0) ? curr : prev
        )
        setSelectedVariant1(lowestVariant1)
      }

      if (model2Variants.length > 0) {
        const lowestVariant2 = model2Variants.reduce((prev: Variant, curr: Variant) => 
          (curr.price < prev.price && curr.price > 0) ? curr : prev
        )
        setSelectedVariant2(lowestVariant2)
      }

    } catch (error) {
      console.error('Error fetching comparison data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getOnRoadPrice = (exShowroomPrice: number, fuelType: string): number => {
    const selectedCity = typeof window !== 'undefined' 
      ? localStorage.getItem('selectedCity') || 'Mumbai, Maharashtra'
      : 'Mumbai, Maharashtra'
    
    const state = selectedCity.split(',')[1]?.trim() || 'Maharashtra'
    const breakup = calculateOnRoadPrice(exShowroomPrice, state, fuelType)
    return breakup.totalOnRoadPrice
  }

  const calculateEMI = (price: number, downPayment: number = 0, interestRate: number = 9.5, tenure: number = 60): number => {
    const principal = price - downPayment
    const monthlyRate = interestRate / 12 / 100
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1)
    return Math.round(emi)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading comparison...</p>
        </div>
      </div>
    )
  }

  if (!model1 || !model2 || !selectedVariant1 || !selectedVariant2) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Unable to load comparison data</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  const onRoadPrice1 = getOnRoadPrice(selectedVariant1.price, selectedVariant1.fuelType)
  const onRoadPrice2 = getOnRoadPrice(selectedVariant2.price, selectedVariant2.fuelType)
  const emi1 = calculateEMI(onRoadPrice1)
  const emi2 = calculateEMI(onRoadPrice2)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">
            {model1.brandName} {model1.name} vs {model2.brandName} {model2.name}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Compare specifications, prices, and features
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Comparison Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Model 1 Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="relative mb-3">
              <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                <Search className="h-4 w-4 text-gray-600" />
              </button>
              <img
                src={model1.heroImage}
                alt={`${model1.brandName} ${model1.name}`}
                className="w-full h-32 object-contain"
                onError={(e) => {
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='%23374151'%3E%3Cpath d='M50 200h300c5.5 0 10-4.5 10-10v-80c0-16.6-13.4-30-30-30H70c-16.6 0-30 13.4-30 30v80c0 5.5 4.5 10 10 10z'/%3E%3Ccircle cx='100' cy='220' r='25' fill='%23111827'/%3E%3Ccircle cx='300' cy='220' r='25' fill='%23111827'/%3E%3Cpath d='M80 110h240l-20-30H100z' fill='%236B7280'/%3E%3C/svg%3E"
                }}
              />
            </div>

            <h3 className="font-bold text-gray-900 text-lg mb-1">
              {model1.brandName} {model1.name}
            </h3>

            {/* Variant Selector */}
            <div className="relative mb-3">
              <button
                onClick={() => setShowVariantDropdown1(!showVariantDropdown1)}
                className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm hover:bg-gray-100"
              >
                <span className="text-gray-700 truncate">{selectedVariant1.name}</span>
                <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0 ml-2" />
              </button>
              
              {showVariantDropdown1 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-20">
                  {model1.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => {
                        setSelectedVariant1(variant)
                        setShowVariantDropdown1(false)
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm border-b border-gray-100 last:border-0"
                    >
                      <div className="font-medium text-gray-900">{variant.name}</div>
                      <div className="text-xs text-gray-500">₹ {(variant.price / 100000).toFixed(2)} Lakh</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="text-red-600 font-bold text-xl mb-1">
              {(onRoadPrice1 / 100000).toFixed(2)} Lakhs
            </div>
            <div className="text-sm text-gray-500 mb-4">On-Road Price</div>

            {/* EMI */}
            <div className="bg-gray-900 text-white px-4 py-3 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Per Month</div>
              <div className="text-2xl font-bold">₹{emi1.toLocaleString('en-IN')}*</div>
            </div>
          </div>

          {/* Model 2 Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="relative mb-3">
              <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                <Search className="h-4 w-4 text-gray-600" />
              </button>
              <img
                src={model2.heroImage}
                alt={`${model2.brandName} ${model2.name}`}
                className="w-full h-32 object-contain"
                onError={(e) => {
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='%23374151'%3E%3Cpath d='M50 200h300c5.5 0 10-4.5 10-10v-80c0-16.6-13.4-30-30-30H70c-16.6 0-30 13.4-30 30v80c0 5.5 4.5 10 10 10z'/%3E%3Ccircle cx='100' cy='220' r='25' fill='%23111827'/%3E%3Ccircle cx='300' cy='220' r='25' fill='%23111827'/%3E%3Cpath d='M80 110h240l-20-30H100z' fill='%236B7280'/%3E%3C/svg%3E"
                }}
              />
            </div>

            <h3 className="font-bold text-gray-900 text-lg mb-1">
              {model2.brandName} {model2.name}
            </h3>

            {/* Variant Selector */}
            <div className="relative mb-3">
              <button
                onClick={() => setShowVariantDropdown2(!showVariantDropdown2)}
                className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm hover:bg-gray-100"
              >
                <span className="text-gray-700 truncate">{selectedVariant2.name}</span>
                <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0 ml-2" />
              </button>
              
              {showVariantDropdown2 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-20">
                  {model2.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => {
                        setSelectedVariant2(variant)
                        setShowVariantDropdown2(false)
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm border-b border-gray-100 last:border-0"
                    >
                      <div className="font-medium text-gray-900">{variant.name}</div>
                      <div className="text-xs text-gray-500">₹ {(variant.price / 100000).toFixed(2)} Lakh</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="text-red-600 font-bold text-xl mb-1">
              {(onRoadPrice2 / 100000).toFixed(2)} Lakhs
            </div>
            <div className="text-sm text-gray-500 mb-4">On-Road Price</div>

            {/* EMI */}
            <div className="bg-gray-900 text-white px-4 py-3 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Per Month</div>
              <div className="text-2xl font-bold">₹{emi2.toLocaleString('en-IN')}*</div>
            </div>
          </div>
        </div>

        {/* Specification Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Specification</h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showDifferences}
                onChange={(e) => setShowDifferences(e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm text-gray-600">Show differences</span>
            </label>
          </div>

          {/* Engine Section */}
          <div className="mb-4">
            <button className="w-full flex items-center justify-between py-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Engine</h3>
              <ChevronDown className="h-5 w-5 text-gray-500" />
            </button>

            <div className="mt-4 space-y-4">
              {/* Max Power */}
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Max Power (PS@rpm)</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-gray-900">{selectedVariant1.specifications.engine.maxPower || 'N/A'}</div>
                  <div className="text-gray-900">{selectedVariant2.specifications.engine.maxPower || 'N/A'}</div>
                </div>
              </div>

              {/* Max Torque */}
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Max Torque (Nm@rpm)</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-gray-900">{selectedVariant1.specifications.engine.maxTorque || 'N/A'}</div>
                  <div className="text-gray-900">{selectedVariant2.specifications.engine.maxTorque || 'N/A'}</div>
                </div>
              </div>

              {/* Engine Type */}
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Engine Type</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-gray-900">{selectedVariant1.specifications.engine.engineType || 'N/A'}</div>
                  <div className="text-gray-900">{selectedVariant2.specifications.engine.engineType || 'N/A'}</div>
                </div>
              </div>

              {/* Engine Capacity */}
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Engine Capacity (cc)</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-gray-900">{selectedVariant1.specifications.engine.engineCapacity || 'N/A'}</div>
                  <div className="text-gray-900">{selectedVariant2.specifications.engine.engineCapacity || 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
