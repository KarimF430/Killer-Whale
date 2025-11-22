'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Star, ChevronRight } from 'lucide-react'
import { useOnRoadPrice } from '@/hooks/useOnRoadPrice'
import PageSection from '@/components/common/PageSection'
import Footer from '@/components/Footer'
import CarCard from '@/components/home/CarCard'
import AdBanner from '@/components/home/AdBanner'
import Ad3DCarousel from '@/components/ads/Ad3DCarousel'

interface Car {
    id: string
    name: string
    brand: string
    brandName: string
    image: string
    startingPrice: number
    lowestPriceFuelType?: string
    fuelTypes: string[]
    transmissions: string[]
    seating: number
    launchDate: string
    slug: string
    isNew: boolean
    isPopular: boolean
    rating?: number
    reviews?: number
    variants?: number
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

// BrandCarCard component (exact copy from brand page) - MOBILE OPTIMIZED
function BudgetCarCard({ car, budgetLabel }: { car: Car; budgetLabel: string }) {
    const exShowroomPrice = car.startingPrice

    const { onRoadPrice, isOnRoadMode } = useOnRoadPrice({
        exShowroomPrice,
        fuelType: car.lowestPriceFuelType || car.fuelTypes[0] || 'Petrol'
    })

    const displayPrice = isOnRoadMode ? (onRoadPrice / 100000).toFixed(2) : (exShowroomPrice / 100000).toFixed(2)
    const priceLabel = isOnRoadMode ? 'On-Road' : 'Ex-Showroom'

    return (
        <Link
            href={`/${car.brandName.toLowerCase().replace(/\s+/g, '-')}-cars/${car.name.toLowerCase().replace(/\s+/g, '-')}`}
            className="block group"
        >
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200">
                <div className="flex h-36 sm:h-44">
                    {/* Car Image - Responsive */}
                    <div className="w-32 sm:w-48 flex-shrink-0 relative overflow-hidden rounded-l-lg">
                        <img
                            src={car.image}
                            alt={car.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none'
                                const parent = e.currentTarget.parentElement
                                if (parent) {
                                    const fallback = document.createElement('div')
                                    fallback.className = 'bg-gray-200 text-gray-600 text-xs sm:text-sm font-semibold text-center flex items-center justify-center h-full p-1'
                                    fallback.innerHTML = car.name
                                    parent.appendChild(fallback)
                                }
                            }}
                        />
                        {car.isNew && (
                            <span className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-green-600 text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded z-10">
                                NEW
                            </span>
                        )}
                        {car.isPopular && !car.isNew && (
                            <span className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-orange-600 text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded z-10">
                                POPULAR
                            </span>
                        )}
                    </div>

                    {/* Car Details - Responsive */}
                    <div className="flex-1 p-2 sm:p-3 md:p-4 flex flex-col justify-between min-w-0">
                        {/* Top Section */}
                        <div>
                            <div className="flex items-start justify-between mb-1 sm:mb-2">
                                <div className="flex-1 pr-1 sm:pr-2 min-w-0">
                                    <h3 className="text-base sm:text-xl md:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight truncate">
                                        <span className="text-gray-600 font-semibold">{car.brandName} </span>
                                        {car.name}
                                    </h3>
                                </div>
                                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 mt-0.5 sm:mt-1" />
                            </div>

                            {/* Rating - Responsive */}
                            <div className="flex items-center gap-0.5 sm:gap-1 mb-1 sm:mb-2">
                                <Star className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 fill-current flex-shrink-0" />
                                <span className="font-semibold text-gray-900 text-sm sm:text-base whitespace-nowrap">{car.rating || 4.5}/5</span>
                                <span className="text-gray-500 text-sm sm:text-base whitespace-nowrap">{car.reviews || 1247} Ratings</span>
                            </div>

                            {/* Variants - Responsive */}
                            <div className="text-gray-600 text-sm sm:text-base mb-1 sm:mb-3">
                                {car.variants || 0} Variants
                            </div>
                        </div>

                        {/* Bottom Section: Price - Responsive */}
                        <div>
                            <div className="flex items-baseline gap-1 sm:gap-2 flex-wrap">
                                <span className="text-lg sm:text-2xl md:text-3xl font-bold text-red-600">₹ {displayPrice}</span>
                                <span className="text-base sm:text-lg md:text-xl font-semibold text-red-600">Lakh</span>
                                <span className="text-gray-500 text-sm sm:text-base">Onwards</span>
                            </div>
                            <span className="text-xs sm:text-sm text-gray-500">{priceLabel} Price</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default function BudgetCarsPage() {
    const params = useParams()
    const budgetSlug = params?.budget as string

    const [cars, setCars] = useState<Car[]>([])
    const [popularCars, setPopularCars] = useState<Car[]>([])
    const [newLaunchedCars, setNewLaunchedCars] = useState<Car[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedFuel, setSelectedFuel] = useState<string[]>([])
    const [selectedTransmission, setSelectedTransmission] = useState<string[]>([])

    const budgetRanges: Record<string, { label: string; min: number; max: number; description: string }> = {
        'under-8': {
            label: 'Under ₹8 Lakh',
            min: 100000,
            max: 800000,
            description: 'Hyundai Motor India Limited (HMIL) is the second-largest car manufacturer in India by market share and the largest passenger car exporter from India. Established in 1996, Hyundai India is consistently delivered ...'
        },
        'under-15': {
            label: 'Under ₹15 Lakh',
            min: 800001,
            max: 1500000,
            description: 'Explore affordable cars between ₹8 Lakh to ₹15 Lakh with great features and performance.'
        },
        'under-25': {
            label: 'Under ₹25 Lakh',
            min: 1500001,
            max: 2500000,
            description: 'Premium cars between ₹15 Lakh to ₹25 Lakh with advanced technology and comfort.'
        },
        'under-50': {
            label: 'Under ₹50 Lakh',
            min: 2500001,
            max: 5000000,
            description: 'Luxury cars between ₹25 Lakh to ₹50 Lakh with top-tier features.'
        },
        'above-50': {
            label: 'Above ₹50 Lakh',
            min: 5000001,
            max: Infinity,
            description: 'Ultra-luxury vehicles above ₹50 Lakh.'
        }
    }

    const currentBudget = budgetRanges[budgetSlug] || budgetRanges['under-8']

    const fuelFilters = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid']
    const transmissionFilters = ['Manual', 'Automatic']

    // Fetch cars data using optimized endpoint
    useEffect(() => {
        const fetchCars = async () => {
            try {
                setLoading(true)
                const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

                // Use optimized budget endpoint - single API call with server-side filtering
                const response = await fetch(`${backendUrl}/api/cars-by-budget/${budgetSlug}?page=1&limit=100`)

                if (!response.ok) {
                    console.error('Failed to fetch budget cars')
                    setCars([])
                    setLoading(false)
                    return
                }

                const data = await response.json()

                console.log('📊 Budget API Response:', {
                    total: data.pagination.total,
                    page: data.pagination.page,
                    took: data.performance.took + 'ms'
                })

                // Set the filtered cars directly from API
                setCars(data.data || [])
                console.log('🚗 Cars set:', data.data?.length || 0, 'cars')
                console.log('🚗 First car:', data.data?.[0])

                // For popular and new cars, we still need to fetch all models
                // But we can do this in parallel and it's cached
                const [modelsRes] = await Promise.all([
                    fetch(`${backendUrl}/api/models?limit=100`)
                ])

                if (modelsRes.ok) {
                    const modelsResponse = await modelsRes.json()
                    const models = modelsResponse.data || modelsResponse

                    // Get brands for mapping
                    const brandsRes = await fetch(`${backendUrl}/api/brands`)
                    const brands = await brandsRes.json()
                    const brandMap = brands.reduce((acc: any, brand: any) => {
                        acc[brand.id] = brand.name
                        return acc
                    }, {})

                    // Get variants for pricing
                    const variantsRes = await fetch(`${backendUrl}/api/variants?fields=minimal&limit=1000`)
                    const variantsResponse = await variantsRes.json()
                    const variants = variantsResponse.data || variantsResponse

                    // Process for popular and new cars
                    const processedCars: Car[] = models.map((model: any) => {
                        const modelVariants = variants.filter((v: any) => v.modelId === model.id)
                        const lowestPrice = modelVariants.length > 0
                            ? Math.min(...modelVariants.map((v: any) => v.price || 0))
                            : model.price || 0

                        const fuelTypes = model.fuelTypes && model.fuelTypes.length > 0
                            ? model.fuelTypes
                            : Array.from(new Set(modelVariants.map((v: any) => v.fuel).filter(Boolean)))

                        const transmissions = model.transmissions && model.transmissions.length > 0
                            ? model.transmissions
                            : Array.from(new Set(modelVariants.map((v: any) => v.transmission).filter(Boolean)))

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
                            rating: 4.5,
                            reviews: 1247,
                            variants: modelVariants.length
                        }
                    })

                    setPopularCars(processedCars.filter(c => c.isPopular).slice(0, 10))
                    setNewLaunchedCars(processedCars.filter(c => c.isNew).slice(0, 10))
                }

            } catch (error) {
                console.error('Error fetching cars:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchCars()
    }, [budgetSlug])


    // Apply filters
    const filteredCars = cars.filter(car => {
        if (selectedFuel.length > 0) {
            const hasFuel = selectedFuel.some(fuel =>
                car.fuelTypes.some(f => f.toLowerCase() === fuel.toLowerCase())
            )
            if (!hasFuel) return false
        }

        if (selectedTransmission.length > 0) {
            const hasTransmission = selectedTransmission.some(trans =>
                car.transmissions.some(t => t.toLowerCase().includes(trans.toLowerCase()))
            )
            if (!hasTransmission) return false
        }

        return true
    })

    console.log('🔍 Filter state:', {
        totalCars: cars.length,
        filteredCars: filteredCars.length,
        selectedFuel,
        selectedTransmission
    })

    const toggleFilter = (type: 'fuel' | 'transmission', value: string) => {
        if (type === 'fuel') {
            setSelectedFuel(prev =>
                prev.includes(value) ? prev.filter(f => f !== value) : [...prev, value]
            )
        } else {
            setSelectedTransmission(prev =>
                prev.includes(value) ? prev.filter(t => t !== value) : [...prev, value]
            )
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <main>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Ad3DCarousel className="my-4" />
                </div>

                {/* Header & Filters */}
                <PageSection background="white">
                    <Link
                        href="/"
                        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 mr-1" />
                        Back to Home
                    </Link>

                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {currentBudget.label} Cars
                    </h1>
                    <p className="text-gray-600 mb-6">
                        {currentBudget.description}
                        <button className="text-red-600 ml-1 font-medium">...read more</button>
                    </p>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-3 pb-4 border-b border-gray-200">
                        {fuelFilters.map(fuel => (
                            <button
                                key={fuel}
                                onClick={() => toggleFilter('fuel', fuel)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedFuel.includes(fuel)
                                    ? 'bg-red-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {fuel}
                            </button>
                        ))}
                        {transmissionFilters.map(trans => (
                            <button
                                key={trans}
                                onClick={() => toggleFilter('transmission', trans)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedTransmission.includes(trans)
                                    ? 'bg-red-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {trans}
                            </button>
                        ))}
                    </div>
                </PageSection>

                {/* Cars List */}
                <PageSection background="white">
                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="bg-white border border-gray-200 rounded-lg h-40 animate-pulse"></div>
                            ))}
                        </div>
                    ) : filteredCars.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-500 text-lg">No cars found matching your filters.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredCars.map((car) => (
                                <BudgetCarCard key={car.id} car={car} budgetLabel={currentBudget.label} />
                            ))}
                        </div>
                    )}
                </PageSection>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Ad3DCarousel className="my-4" />
                </div>

                {/* Popular Cars */}
                {popularCars.length > 0 && (
                    <PageSection background="white">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">Popular Cars</h2>
                        <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
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
                    </PageSection>
                )}

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Ad3DCarousel className="my-4" />
                </div>

                {/* New Launches */}
                {newLaunchedCars.length > 0 && (
                    <PageSection background="white">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">New Launches</h2>
                        <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
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
                    </PageSection>
                )}
            </main>

            <Footer />
        </div>
    )
}
