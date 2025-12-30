'use client'

import React, { useState, useMemo, useRef } from 'react'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { useOnRoadPrice } from '@/hooks/useOnRoadPrice'
import { useFavourites } from '@/lib/favourites-context'

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
    topRank?: number | null
    popularRank?: number | null
}

interface RankedCar extends Car {
    displayRank: number
}

const BODY_TYPES = [
    { id: 'all', label: 'All' },
    { id: 'SUV', label: 'SUV' },
    { id: 'Sedan', label: 'Sedan' },
    { id: 'Hatchback', label: 'Hatchback' },
    { id: 'MPV', label: 'MPV' },
]

// Compact Car Card with Ranking Badge (no fuel/transmission)
function TopCarCard({ car, rank, onClick }: { car: RankedCar; rank: number; onClick: () => void }) {
    const { isFavourite, toggleFavourite } = useFavourites()
    const [mounted, setMounted] = React.useState(false)
    const isFav = mounted ? isFavourite(car.id) : false

    React.useEffect(() => {
        setMounted(true)
    }, [])

    const { onRoadPrice, isOnRoadMode, city } = useOnRoadPrice({
        exShowroomPrice: car.startingPrice,
        fuelType: car.lowestPriceFuelType || car.fuelTypes?.[0] || 'Petrol'
    })

    const displayPrice = isOnRoadMode ? onRoadPrice : car.startingPrice
    const priceLabel = isOnRoadMode ? `On-Road Price in ${city}` : 'Ex-Showroom Price'

    return (
        <div
            onClick={onClick}
            className="flex-shrink-0 w-[220px] sm:w-[240px] bg-white rounded-2xl shadow-sm hover:shadow-xl active:scale-[0.98] transition-all duration-300 overflow-hidden cursor-pointer group border border-gray-100 flex flex-col"
        >
            {/* Image Container */}
            <div className="relative h-36 sm:h-40 bg-gradient-to-br from-slate-50 to-gray-100 overflow-hidden">
                {/* Large Ranking Badge */}
                <div
                    className="absolute top-3 left-3 z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shadow-xl"
                    style={{
                        background: 'linear-gradient(145deg, #ff6b35 0%, #f7931e 50%, #ff6b35 100%)',
                        border: '3px solid white',
                        boxShadow: '0 4px 15px rgba(249, 115, 22, 0.4)',
                    }}
                >
                    <span className="text-white font-black text-lg sm:text-xl" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                        {rank}
                    </span>
                </div>

                {/* Wishlist Button - Outline style by default */}
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        toggleFavourite(car)
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 z-10 ${isFav
                        ? 'bg-red-500 shadow-lg'
                        : 'bg-white shadow-md hover:shadow-lg'
                        }`}
                >
                    <Heart
                        className={`h-4 w-4 sm:h-5 sm:w-5 ${isFav ? 'text-white' : 'text-gray-300 hover:text-red-400'}`}
                        fill={isFav ? 'currentColor' : 'none'}
                        strokeWidth={isFav ? 0 : 2}
                    />
                </button>

                {/* Car Image */}
                <div className="w-full h-full flex items-center justify-center p-2 pt-4">
                    {car.image ? (
                        <img
                            src={car.image}
                            alt={`${car.brandName} ${car.name}`}
                            className="w-full h-full object-contain object-center transition-transform duration-300 group-hover:scale-110"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-20 h-14 bg-gray-200 rounded-lg animate-pulse" />
                    )}
                </div>
            </div>

            {/* Car Info - Flex grow to fill space and align button */}
            <div className="px-3 pt-2 pb-2 sm:px-4 sm:pt-3 sm:pb-3 flex flex-col flex-grow">
                <h3 className="font-bold text-gray-900 text-sm leading-tight truncate" title={`${car.brandName} ${car.name}`}>
                    {car.brandName} {car.name}
                </h3>

                <div className="mt-1">
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-red-600 font-bold text-base sm:text-lg">₹ {(displayPrice / 100000).toFixed(2)} Lakh</span>
                        <span className="text-gray-500 text-[10px] sm:text-xs">Onwards</span>
                    </div>
                    <span className="text-[10px] text-gray-400">{priceLabel}</span>
                </div>

                <button
                    className="w-full mt-auto bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-200 shadow-md hover:shadow-lg"
                >
                    View Details
                </button>
            </div>
        </div>
    )
}

export default function TopCarsByBodyType({ initialCars = [] }: { initialCars?: Car[] }) {
    const [selectedBodyType, setSelectedBodyType] = useState('all')
    const scrollRef = useRef<HTMLDivElement>(null)
    const filterRef = useRef<HTMLDivElement>(null)

    // Filter cars by body type and assign rankings
    const rankedCars = useMemo((): RankedCar[] => {
        let filtered = selectedBodyType === 'all'
            ? [...initialCars]
            : initialCars.filter(car => car.bodyType === selectedBodyType)

        // Get cars with explicit topRank (1-10)
        const carsWithTopRank = filtered
            .filter(car => car.topRank && car.topRank >= 1 && car.topRank <= 10)
            .sort((a, b) => (a.topRank || 999) - (b.topRank || 999))

        // Get remaining cars sorted by popularity for filling slots
        const topRankIds = new Set(carsWithTopRank.map(c => c.id))
        const remainingCars = filtered
            .filter(car => !topRankIds.has(car.id))
            .sort((a, b) => {
                if (a.isPopular && !b.isPopular) return -1
                if (!a.isPopular && b.isPopular) return 1
                if (a.popularRank && b.popularRank) return a.popularRank - b.popularRank
                if (a.popularRank && !b.popularRank) return -1
                if (!a.popularRank && b.popularRank) return 1
                return (b.startingPrice || 0) - (a.startingPrice || 0)
            })

        // Combine: topRank cars first, then fill with popular cars up to 10
        const combined = [...carsWithTopRank, ...remainingCars].slice(0, 10)

        return combined.map((car, index) => ({
            ...car,
            displayRank: car.topRank || index + 1
        }))
    }, [initialCars, selectedBodyType])

    const scrollContainer = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 280
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            })
        }
    }

    if (initialCars.length === 0) {
        return null
    }

    return (
        <div>
            {/* Section Header */}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                Top Selling Cars in India
            </h2>

            {/* Compact Horizontal Scrollable Filter Pills */}
            <div
                ref={filterRef}
                className="flex gap-2 overflow-x-auto scrollbar-hide mb-5 pb-1"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {BODY_TYPES.map((type) => (
                    <button
                        key={type.id}
                        onClick={() => setSelectedBodyType(type.id)}
                        className={`
                            flex-shrink-0 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium 
                            transition-all duration-200 whitespace-nowrap
                            ${selectedBodyType === type.id
                                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                            }
                        `}
                    >
                        {type.label}
                    </button>
                ))}
            </div>

            {/* Cars Horizontal Scroll */}
            <div className="relative">
                {rankedCars.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p className="text-sm">No cars found in this category.</p>
                    </div>
                ) : (
                    <div className="relative group">
                        {/* Left Scroll Arrow */}
                        <button
                            onClick={() => scrollContainer('left')}
                            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white hover:bg-gray-50 shadow-lg rounded-full items-center justify-center text-gray-500 hover:text-orange-600 transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-1/2 border border-gray-100"
                            aria-label="Scroll left"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        {/* Right Scroll Arrow */}
                        <button
                            onClick={() => scrollContainer('right')}
                            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white hover:bg-gray-50 shadow-lg rounded-full items-center justify-center text-gray-500 hover:text-orange-600 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-1/2 border border-gray-100"
                            aria-label="Scroll right"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        {/* Scrollable Container */}
                        <div
                            ref={scrollRef}
                            className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-2 scroll-smooth"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {rankedCars.map((car) => (
                                <TopCarCard
                                    key={car.id}
                                    car={car}
                                    rank={car.displayRank}
                                    onClick={() => {
                                        const brandSlug = car.brandName.toLowerCase().replace(/\s+/g, '-')
                                        const modelSlug = car.name.toLowerCase().replace(/\s+/g, '-')
                                        window.location.href = `/${brandSlug}-cars/${modelSlug}`
                                    }}
                                />
                            ))}

                            {/* View All Card */}
                            {rankedCars.length > 0 && (
                                <Link
                                    href={selectedBodyType === 'all' ? '/top-selling-cars-in-india' : `/top-selling-cars-in-india?bodyType=${selectedBodyType}`}
                                    className="flex-shrink-0 w-[220px] sm:w-[240px] bg-gradient-to-br from-orange-500 to-red-500 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                                >
                                    <div className="h-full flex flex-col items-center justify-center p-6 text-center min-h-[280px] sm:min-h-[300px]">
                                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-1">View All</h3>
                                        <p className="text-white/80 text-sm mb-4">
                                            {selectedBodyType === 'all' ? 'Top Cars' : selectedBodyType}
                                        </p>
                                        <div className="px-5 py-2 bg-white text-orange-600 rounded-full font-semibold text-sm">
                                            Explore
                                        </div>
                                    </div>
                                </Link>
                            )}
                        </div>

                    </div>
                )}
            </div>
        </div>
    )
}
