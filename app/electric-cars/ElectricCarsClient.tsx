'use client'

import { useState } from 'react'
import CarCard from '@/components/home/CarCard'
import ElectricCarCard from './ElectricCarCard'

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
    bodyType?: string
    rating?: number
    reviews?: number
    variants?: number
}

interface ElectricCarsClientProps {
    initialCars: Car[]
    popularCars: Car[]
    newLaunchedCars: Car[]
    dynamicDescription?: string
}

const rangeFilters = [
    { label: '200-300 km', min: 200, max: 300 },
    { label: '300-400 km', min: 300, max: 400 },
    { label: '400-500 km', min: 400, max: 500 },
    { label: '500+ km', min: 500, max: Infinity }
]

// EV range data
const evRangeData: Record<string, number> = {
    'Model Y': 600, 'Model 3': 570,
    'Ioniq 5': 550, 'Creta EV': 475,
    'Nexon EV': 400, 'Punch EV': 370, 'Tiago EV': 340, 'Tigor EV': 335, 'Curvv EV': 475, 'Harrier EV': 525,
    'XUV400 EV': 415, 'BE 6': 600, 'XEV 9e': 590,
    'ZS EV': 490, 'Comet EV': 230, 'Windsor EV': 380, 'M9 EV': 600,
    'EV6': 560, 'EV9': 550,
    'Atto 3': 490, 'Seal': 580, 'Sealion 7': 535, 'eMAX 7': 475, 'E6': 465,
    'VF 7': 445, 'VF e34': 300,
    'Countryman Electric': 440,
    'C40 Recharge': 500, 'XC40 Recharge': 450, 'EX30': 410,
    'Taycan': 500,
    'EQB': 425, 'EQS': 660, 'EQS SUV': 595,
    'iX': 525, 'iX1': 435, 'i4': 510, 'i7': 590,
    'e-tron': 375, 'e-tron GT': 475,
    'I-Pace': 460,
    'Spectre': 530,
    'Eletre': 550
}

export default function ElectricCarsClient({
    initialCars,
    popularCars,
    newLaunchedCars,
    dynamicDescription = ''
}: ElectricCarsClientProps) {
    const [selectedRange, setSelectedRange] = useState<string[]>([])
    const [isExpanded, setIsExpanded] = useState(false)

    // Parse description - supports both JSON format and plain text
    let shortText = 'Explore all electric cars in India with detailed prices, range, specifications and reviews. Compare EVs from Tesla, Tata, Mahindra, Hyundai, BYD and more.'
    let extendedText = ''
    try {
        const parsed = JSON.parse(dynamicDescription)
        shortText = parsed.short || shortText
        extendedText = parsed.extended || ''
    } catch {
        // Plain text fallback - no extended text
    }

    // Apply filters
    const filteredCars = initialCars.filter(car => {
        // Range filter
        if (selectedRange.length > 0) {
            const carRange = evRangeData[car.name] || 400
            const matchesRange = selectedRange.some(range => {
                const filter = rangeFilters.find(f => f.label === range)
                if (!filter) return false
                return carRange >= filter.min && carRange <= filter.max
            })
            if (!matchesRange) return false
        }

        return true
    })

    const toggleFilter = (value: string) => {
        setSelectedRange(prev =>
            prev.includes(value) ? prev.filter(f => f !== value) : [...prev, value]
        )
    }

    return (
        <>
            {/* Header & Filters */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Electric Cars in India
                </h1>
                <div className="text-gray-600 mb-6">
                    <p className={isExpanded ? '' : 'line-clamp-2'}>
                        {shortText}
                        {isExpanded && extendedText}
                    </p>
                    {extendedText && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-emerald-600 font-medium hover:text-emerald-700 transition-colors"
                        >
                            {isExpanded ? '...show less' : '...read more'}
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 pb-4 border-b border-gray-200">
                    {rangeFilters.map(range => (
                        <button
                            key={range.label}
                            onClick={() => toggleFilter(range.label)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedRange.includes(range.label)
                                ? 'bg-gradient-to-r from-emerald-600 to-green-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Cars List */}
            {filteredCars.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-gray-500 text-lg">No electric cars found matching your filters.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredCars.map((car) => (
                        <ElectricCarCard key={car.id} car={car} />
                    ))}
                </div>
            )}

            {/* Popular Cars */}
            {popularCars.length > 0 && (
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Popular Electric Cars</h2>
                    <div className="relative group">
                        <button
                            onClick={() => {
                                const container = document.getElementById('electric-popular-scroll')
                                container?.scrollBy({ left: -300, behavior: 'smooth' })
                            }}
                            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full items-center justify-center text-gray-700 hover:text-emerald-600 transition-all opacity-0 group-hover:opacity-100 -ml-5"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={() => {
                                const container = document.getElementById('electric-popular-scroll')
                                container?.scrollBy({ left: 300, behavior: 'smooth' })
                            }}
                            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full items-center justify-center text-gray-700 hover:text-emerald-600 transition-all opacity-0 group-hover:opacity-100 -mr-5"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                        <div id="electric-popular-scroll" className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
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
                    </div>
                </div>
            )}

            {/* New Launches */}
            {newLaunchedCars.length > 0 && (
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">New Electric Launches</h2>
                    <div className="relative group">
                        <button
                            onClick={() => {
                                const container = document.getElementById('electric-new-scroll')
                                container?.scrollBy({ left: -300, behavior: 'smooth' })
                            }}
                            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full items-center justify-center text-gray-700 hover:text-emerald-600 transition-all opacity-0 group-hover:opacity-100 -ml-5"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={() => {
                                const container = document.getElementById('electric-new-scroll')
                                container?.scrollBy({ left: 300, behavior: 'smooth' })
                            }}
                            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full items-center justify-center text-gray-700 hover:text-emerald-600 transition-all opacity-0 group-hover:opacity-100 -mr-5"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                        <div id="electric-new-scroll" className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
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
                    </div>
                </div>
            )}
        </>
    )
}
