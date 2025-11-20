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

// BrandCarCard component (exact copy from brand page)
function BudgetCarCard({ car, budgetLabel }: { car: Car; budgetLabel: string }) {
    const exShowroomPrice = car.startingPrice

    const { onRoadPrice, isOnRoadMode } = useOnRoadPrice({
        exShowroomPrice,
        fuelType: car.fuelTypes[0] || 'Petrol'
    })

    const displayPrice = isOnRoadMode ? (onRoadPrice / 100000).toFixed(2) : (exShowroomPrice / 100000).toFixed(2)
    const priceLabel = isOnRoadMode ? 'On-Road' : 'Ex-Showroom'

    return (
        <Link
            href={`/${car.brandName.toLowerCase().replace(/\s+/g, '-')}-cars/${car.name.toLowerCase().replace(/\s+/g, '-')}`}
            className="block group"
        >
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200">
                <div className="flex h-40">
                    {/* Car Image */}
                    <div className="w-44 flex-shrink-0 relative overflow-hidden rounded-l-lg">
                        <img
                            src={car.image}
                            alt={car.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none'
                                const parent = e.currentTarget.parentElement
                                if (parent) {
                                    const fallback = document.createElement('div')
                                    fallback.className = 'bg-gray-200 text-gray-600 text-sm font-semibold text-center flex items-center justify-center h-full'
                                    fallback.innerHTML = car.name
                                    parent.appendChild(fallback)
                                }
                            }}
                        />
                        {car.isNew && (
                            <span className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded z-10">
                                NEW
                            </span>
                        )}
                        {car.isPopular && !car.isNew && (
                            <span className="absolute top-2 left-2 bg-orange-600 text-white text-xs font-bold px-2 py-1 rounded z-10">
                                POPULAR
                            </span>
                        )}
                    </div>

                    {/* Car Details */}
                    <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between">
                        {/* Top Section */}
                        <div>
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1 pr-2">
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                                        <span className="text-gray-600 font-semibold">{car.brandName} </span>
                                        {car.name}
                                    </h3>
                                </div>
                                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 mt-1" />
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-1 mb-2">
                                <Star className="h-4 w-4 text-green-600 fill-current" />
                                <span className="font-semibold text-gray-900 text-sm">{car.rating || 4.5}/5</span>
                                <span className="text-gray-500 text-sm">{car.reviews || 1247} Ratings</span>
                            </div>

                            {/* Variants */}
                            <div className="text-gray-600 text-sm mb-3">
                                {car.variants || 0} Variants
                            </div>
                        </div>

                        {/* Bottom Section: Price */}
                        <div>
                            <div className="flex items-baseline gap-2 flex-wrap">
                                <span className="text-xl sm:text-2xl font-bold text-red-600">₹ {displayPrice}</span>
                                <span className="text-base sm:text-lg font-semibold text-red-600">Lakh</span>
                                <span className="text-gray-500 text-sm">Onwards</span>
                            </div>
                            <span className="text-xs text-gray-500">{priceLabel} Price</span>
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

    // Fetch cars data
    useEffect(() => {
        const fetchCars = async () => {
            try {
                setLoading(true)
                const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

                const [modelsRes, brandsRes, variantsRes] = await Promise.all([
                    fetch(`${backendUrl}/api/models`),
                    fetch(`${backendUrl}/api/brands`),
                    fetch(`${backendUrl}/api/variants`)
                ])

                if (!modelsRes.ok || !brandsRes.ok || !variantsRes.ok) {
                    console.error('Failed to fetch data')
                    setCars([])
                    setLoading(false)
                    return
                }

                const models = await modelsRes.json()
                const brands = await brandsRes.json()
                const variants = await variantsRes.json()

                const brandMap = brands.reduce((acc: any, brand: any) => {
                    acc[brand.id] = brand.name
                    return acc
                }, {})

                // Process all models
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

                console.log('📊 Total models processed:', processedCars.length)
                console.log('💰 Budget slug:', budgetSlug)
                console.log('💰 Budget range:', currentBudget.min, '-', currentBudget.max)

                // Filter by budget - show cars within the specific price bracket
                const filteredCars = processedCars.filter(car => {
                    const price = car.startingPrice
                    return price >= currentBudget.min && price <= currentBudget.max
                })

                console.log('✅ Filtered cars for budget:', filteredCars.length)
                console.log('🚗 Sample prices:', filteredCars.slice(0, 5).map(c => ({ name: c.name, price: c.startingPrice })))

                setCars(filteredCars)
                setPopularCars(processedCars.filter(c => c.isPopular).slice(0, 10))
                setNewLaunchedCars(processedCars.filter(c => c.isNew).slice(0, 10))

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
                <AdBanner />

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

                <AdBanner />

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

                <AdBanner />

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
