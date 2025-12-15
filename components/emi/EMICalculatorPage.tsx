'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ChevronDown, Info, X, Pencil, Search, ArrowLeft } from 'lucide-react'
import dynamic from 'next/dynamic'
import PageContainer, { PageSection } from '../layout/PageContainer'

// Dynamically import the TataSierraAdBanner
const TataSierraAdBanner = dynamic(() => import('@/components/ads/TataSierraAdBanner'), { ssr: false })

interface CarVariant {
  id: string
  name: string
  price: number
  transmission?: string
  fuelType?: string
}

interface CarModel {
  id: string
  name: string
  brand: string
  slug: string
  brandSlug: string
  image?: string
  startingPrice?: number
}

export default function EMICalculatorPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)

  // Get URL parameters
  const brandParam = searchParams.get('brand') || ''
  const modelParam = searchParams.get('model') || ''
  const variantParam = searchParams.get('variant') || ''
  const priceParam = searchParams.get('price') || ''

  // State
  const [carPrice, setCarPrice] = useState(Number(priceParam) || 1358976)
  const [downPayment, setDownPayment] = useState(Math.round((Number(priceParam) || 1358976) * 0.2))
  const [tenure, setTenure] = useState(7)
  const [tenureMonths, setTenureMonths] = useState(84)
  const [interestRate, setInterestRate] = useState(8)

  // Section visibility - all open by default
  const [showDownPayment, setShowDownPayment] = useState(true)
  const [showInterest, setShowInterest] = useState(true)

  // Car selection state
  const [showCarSearch, setShowCarSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<CarModel[]>([])
  const [allModels, setAllModels] = useState<CarModel[]>([])
  const [modelsLoaded, setModelsLoaded] = useState(false)

  // Two-step selection
  const [selectionStep, setSelectionStep] = useState<'search' | 'variants'>('search')
  const [selectedModel, setSelectedModel] = useState<CarModel | null>(null)
  const [modelVariants, setModelVariants] = useState<CarVariant[]>([])
  const [loadingVariants, setLoadingVariants] = useState(false)

  // Selected car details
  const displayBrand = brandParam || 'Hyundai'
  const displayModel = modelParam || 'Creta'
  const displayVariant = variantParam || 'E Petrol MT'

  const [selectedCar, setSelectedCar] = useState({
    brand: displayBrand,
    model: displayModel,
    variant: displayVariant,
    fullName: `${displayBrand} ${displayModel} ${displayVariant}`,
    price: Number(priceParam) || 1358976
  })

  // Fetch models on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
        const [brandsRes, modelsRes] = await Promise.all([
          fetch(`${API_URL}/api/brands`),
          fetch(`${API_URL}/api/models`)
        ])

        const brandsData = await brandsRes.json()
        const modelsData = await modelsRes.json()

        const brandMap = new Map()
        if (Array.isArray(brandsData)) {
          brandsData.forEach((brand: any) => {
            brandMap.set(brand.id, {
              name: brand.name,
              slug: brand.name.toLowerCase().replace(/\s+/g, '-')
            })
          })
        }

        if (Array.isArray(modelsData)) {
          setAllModels(modelsData.map((model: any) => {
            const brandInfo = brandMap.get(model.brandId) || { name: 'Unknown', slug: '' }
            return {
              id: model.id || model._id,
              name: model.name,
              brand: brandInfo.name,
              slug: model.slug || model.name?.toLowerCase().replace(/\s+/g, '-'),
              brandSlug: brandInfo.slug,
              image: model.heroImage || model.image,
              startingPrice: model.startingPrice || model.price || 1000000
            }
          }))
        }
        setModelsLoaded(true)
      } catch (error) {
        console.error('Failed to fetch data:', error)
        setModelsLoaded(true)
      }
    }
    fetchData()
  }, [])

  // Fetch variants for selected model - FIXED to use correct API endpoint
  const fetchVariantsForModel = async (model: CarModel) => {
    setLoadingVariants(true)
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
      // Use correct API endpoint: /api/variants?modelId=<id>
      const response = await fetch(`${API_URL}/api/variants?modelId=${model.id}`)
      const data = await response.json()

      if (Array.isArray(data) && data.length > 0) {
        setModelVariants(data.map((v: any) => ({
          id: v.id || v._id,
          name: v.name,
          price: v.exShowroomPrice || v.price || model.startingPrice || 1000000,
          transmission: v.transmission,
          fuelType: v.fuelType
        })))
      } else {
        setModelVariants([{ id: 'default', name: 'Base Variant', price: model.startingPrice || 1000000 }])
      }
    } catch {
      setModelVariants([{ id: 'default', name: 'Base Variant', price: model.startingPrice || 1000000 }])
    }
    setLoadingVariants(false)
  }

  // Filter models
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([])
      return
    }
    const query = searchQuery.toLowerCase()
    setSearchResults(allModels.filter(m =>
      m.name?.toLowerCase().includes(query) ||
      m.brand?.toLowerCase().includes(query) ||
      `${m.brand} ${m.name}`.toLowerCase().includes(query)
    ).slice(0, 10))
  }, [searchQuery, allModels])

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowCarSearch(false)
        setSelectionStep('search')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectModel = (model: CarModel) => {
    setSelectedModel(model)
    setSelectionStep('variants')
    fetchVariantsForModel(model)
  }

  const handleSelectVariant = (variant: CarVariant) => {
    if (!selectedModel) return
    setSelectedCar({
      brand: selectedModel.brand,
      model: selectedModel.name,
      variant: variant.name,
      fullName: `${selectedModel.brand} ${selectedModel.name} ${variant.name}`,
      price: variant.price
    })
    setCarPrice(variant.price)
    setDownPayment(Math.round(variant.price * 0.2))
    setShowCarSearch(false)
    setSelectionStep('search')
    setSelectedModel(null)
    setSearchQuery('')
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Calculate EMI
  const emiCalculation = useMemo(() => {
    const principal = carPrice - downPayment
    const monthlyRate = interestRate / 12 / 100
    const months = tenureMonths

    if (monthlyRate === 0) {
      return { emi: Math.round(principal / months), totalAmount: principal, totalInterest: 0, principal }
    }

    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
    const totalAmount = emi * months
    return { emi: Math.round(emi), totalAmount: Math.round(totalAmount), totalInterest: Math.round(totalAmount - principal), principal }
  }, [carPrice, downPayment, tenureMonths, interestRate])

  // Amortization table
  const amortizationTable = useMemo(() => {
    const monthlyRate = interestRate / 12 / 100
    const table = []
    for (const month of [12, 24, 36, 48, 60, 72, 84]) {
      if (month <= tenureMonths) {
        let tempBalance = emiCalculation.principal
        let totalPrincipal = 0, totalInt = 0
        for (let i = 1; i <= month; i++) {
          const interest = tempBalance * monthlyRate
          const principalPaid = emiCalculation.emi - interest
          tempBalance -= principalPaid
          totalPrincipal += principalPaid
          totalInt += interest
        }
        // If this is the last period, set balance to 0 to avoid rounding errors
        const finalBalance = month === tenureMonths ? 0 : Math.round(Math.max(0, emiCalculation.principal - totalPrincipal))
        table.push({ months: month, principal: Math.round(totalPrincipal), interest: Math.round(totalInt), balance: finalBalance })
      }
    }
    return table
  }, [emiCalculation.principal, emiCalculation.emi, tenureMonths, interestRate])

  // Sync tenure months
  useEffect(() => { setTenureMonths(tenure * 12) }, [tenure])

  const loanAmount = carPrice - downPayment

  return (
    <div className="min-h-screen bg-gray-50">
      <PageContainer maxWidth="md">
        <PageSection spacing="normal">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">

            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h1 className="text-base font-semibold text-gray-900">Choose your EMI options</h1>
                <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Car Selection */}
            <div className="p-4 border-b border-gray-200 relative" ref={searchRef}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Selected Car</p>
                  <p className="font-semibold text-gray-900">{selectedCar.brand} {selectedCar.model}</p>
                  <p className="text-sm text-gray-600">{selectedCar.variant}</p>
                </div>
                <button
                  onClick={() => { setShowCarSearch(!showCarSearch); setSelectionStep('search') }}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                  Change
                  <ChevronDown className={`w-4 h-4 transition-transform ${showCarSearch ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Search Dropdown */}
              {showCarSearch && (
                <div className="absolute left-4 right-4 top-full mt-2 bg-white rounded-lg border border-gray-200 shadow-lg z-30 p-3">
                  {selectionStep === 'search' ? (
                    <>
                      <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search car brand or model..."
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm"
                          autoFocus
                        />
                      </div>
                      <p className="text-xs text-gray-400 mb-2">Step 1: Select a model</p>
                      {searchQuery.length >= 2 && searchResults.length === 0 && modelsLoaded && (
                        <p className="text-center py-4 text-gray-500 text-sm">No cars found</p>
                      )}
                      {searchResults.length > 0 && (
                        <div className="max-h-48 overflow-y-auto space-y-1">
                          {searchResults.map(model => (
                            <button
                              key={model.id}
                              onClick={() => handleSelectModel(model)}
                              className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded text-left"
                            >
                              <p className="font-medium text-gray-900 text-sm">{model.brand} {model.name}</p>
                              <ChevronDown className="w-4 h-4 text-gray-400 -rotate-90" />
                            </button>
                          ))}
                        </div>
                      )}
                      {searchQuery.length < 2 && <p className="text-center py-4 text-gray-400 text-sm">Type at least 2 characters</p>}
                    </>
                  ) : (
                    <>
                      <button onClick={() => { setSelectionStep('search'); setSelectedModel(null) }} className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600 mb-3">
                        <ArrowLeft className="w-4 h-4" /> Back
                      </button>
                      <div className="bg-gray-50 rounded p-3 mb-3">
                        <p className="font-semibold text-gray-900 text-sm">{selectedModel?.brand} {selectedModel?.name}</p>
                        <p className="text-xs text-gray-500">Step 2: Select variant</p>
                      </div>
                      {loadingVariants ? (
                        <div className="text-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto"></div>
                        </div>
                      ) : (
                        <div className="max-h-48 overflow-y-auto space-y-1">
                          {modelVariants.map(v => (
                            <button
                              key={v.id}
                              onClick={() => handleSelectVariant(v)}
                              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded border border-gray-100 text-left"
                            >
                              <div>
                                <p className="font-medium text-gray-900 text-sm">{v.name}</p>
                                {(v.transmission || v.fuelType) && <p className="text-xs text-gray-500">{[v.fuelType, v.transmission].filter(Boolean).join(' • ')}</p>}
                              </div>
                              <p className="font-semibold text-orange-600 text-sm">{formatCurrency(v.price)}</p>
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* EMI Display */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-baseline justify-between">
                <p className="text-lg font-bold text-gray-900">{formatCurrency(emiCalculation.emi)}</p>
                <span className="text-xs text-gray-600">EMI For {tenure} Years</span>
              </div>
            </div>

            {/* Down Payment */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-900">
                  Down Payment: <span className="text-orange-600">{formatCurrency(downPayment)}</span>
                </label>
                <button onClick={() => setShowDownPayment(!showDownPayment)} className="text-sm text-orange-600 hover:text-orange-700">
                  {showDownPayment ? 'Hide' : 'Show'}
                </button>
              </div>

              {showDownPayment && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>{formatCurrency(Math.round(carPrice * 0.2))}</span>
                    <span>{formatCurrency(carPrice)}</span>
                  </div>
                  <input
                    type="range"
                    min={Math.round(carPrice * 0.2)}
                    max={carPrice}
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                  />
                  <input
                    type="text"
                    inputMode="numeric"
                    value={downPayment}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '')
                      setDownPayment(val ? Number(val) : 0)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm"
                  />
                  <p className="text-xs text-gray-600">
                    Your loan amount will be: <span className="text-orange-600 font-medium">{formatCurrency(loanAmount)}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Tenure Section - FIXED: Swapped layout */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-900">Tenure</label>
                <div className="flex items-center space-x-1">
                  <span className="text-sm text-gray-900">Interest</span>
                  <Info className="w-4 h-4 text-gray-400" />
                  <button onClick={() => setShowInterest(!showInterest)} className="text-sm text-orange-600 hover:text-orange-700 ml-2">
                    {showInterest ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                    <span>1 year</span>
                    <span>7 years</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={7}
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                    <span>8%</span>
                    <span>20%</span>
                  </div>
                  <input
                    type="range"
                    min={8}
                    max={20}
                    step={0.5}
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                  />
                </div>
              </div>

              {/* FIXED: Swapped boxes - Years left, Months middle, Interest right */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Years</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={tenure}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '')
                      const num = val ? Math.min(7, Math.max(1, Number(val))) : 1
                      setTenure(num)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm text-center"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Months</label>
                  <div className="px-3 py-2 border border-orange-200 rounded bg-orange-50 text-sm text-center text-orange-700 font-medium">
                    {tenureMonths}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Interest %</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={interestRate}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9.]/g, '')
                      const num = val ? Math.min(20, Math.max(5, Number(val))) : 8
                      setInterestRate(num)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm text-center"
                  />
                </div>
              </div>
            </div>

            {/* AD Banner */}
            <div className="p-4">
              <TataSierraAdBanner />
            </div>

            {/* Amortization Table */}
            <div className="px-4 pb-4">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left py-2 font-semibold text-gray-700">Months</th>
                    <th className="text-right py-2 font-semibold text-gray-700">Principal</th>
                    <th className="text-right py-2 font-semibold text-gray-700">Interest</th>
                    <th className="text-right py-2 font-semibold text-gray-700">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {amortizationTable.map((row, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-2 text-gray-900">{row.months}</td>
                      <td className="py-2 text-right text-gray-900">{formatCurrency(row.principal)}</td>
                      <td className="py-2 text-right text-gray-900">{formatCurrency(row.interest)}</td>
                      <td className="py-2 text-right text-gray-900">{formatCurrency(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Know Your Loan Eligibility */}
            <div className="p-4 border-t border-gray-200">
              <h3 className="text-base font-bold text-gray-900 mb-2">Know Your Loan Eligibility</h3>
              <p className="text-sm text-gray-600 mb-4">Buy your dream car with easy online offers in 3 simple steps</p>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900">Step 1 - Get Started</h4>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">FULL NAME</label>
                  <div className="flex space-x-2">
                    <select className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm">
                      <option>Mr</option>
                      <option>Mrs</option>
                      <option>Ms</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Full Name as per PAN card"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">MOBILE*</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l text-sm">+91</span>
                    <input
                      type="tel"
                      placeholder="Mobile Number"
                      maxLength={10}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-r focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">An OTP will be sent to you for verification</p>
                </div>
              </div>
            </div>

            {/* Get Loan Offers Button - FIXED: Orange theme instead of teal */}
            <div className="p-4">
              <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded transition-colors">
                Get Eligible Loan Offers
              </button>
              <p className="text-xs text-gray-500 text-center mt-3 leading-relaxed">
                By proceeding ahead you agree to gadizone <a href="#" className="text-orange-600">Visitor Agreement</a>, <a href="#" className="text-orange-600">Privacy Policy</a> and <a href="#" className="text-orange-600">Terms and Conditions</a>. This site is protected by reCAPTCHA and Google <a href="#" className="text-orange-600">terms of service</a> apply.
              </p>
            </div>
          </div>
        </PageSection>
      </PageContainer>
    </div>
  )
}
