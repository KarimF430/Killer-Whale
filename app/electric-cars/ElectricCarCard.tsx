'use client'

import Link from 'next/link'
import { ChevronRight, Fuel } from 'lucide-react'
import { useOnRoadPrice } from '@/hooks/useOnRoadPrice'

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

// EV range data
const evRangeData: Record<string, string> = {
    'Model Y': '500-660 km', 'Model 3': '513-629 km',
    'Ioniq 5': '481-631 km', 'Creta EV': '450-500 km',
    'Nexon EV': '312-465 km', 'Punch EV': '315-421 km', 'Tiago EV': '315-365 km', 'Tigor EV': '315-360 km', 'Curvv EV': '450-502 km', 'Harrier EV': '500-550 km',
    'XUV400 EV': '375-456 km', 'BE 6': '535-682 km', 'XEV 9e': '533-656 km',
    'ZS EV': '461-528 km', 'Comet EV': '230 km', 'Windsor EV': '331-425 km', 'M9 EV': '600+ km',
    'EV6': '528-590 km', 'EV9': '541-563 km',
    'Atto 3': '468-521 km', 'Seal': '510-650 km', 'Sealion 7': '502-567 km', 'eMAX 7': '420-530 km', 'E6': '415-520 km',
    'VF 7': '431-460 km', 'VF e34': '285-318 km',
    'Countryman Electric': '420-460 km',
    'C40 Recharge': '475-530 km', 'XC40 Recharge': '425-478 km', 'EX30': '344-476 km',
    'Taycan': '435-560 km',
    'EQB': '400-453 km', 'EQS': '580-740 km', 'EQS SUV': '530-660 km',
    'iX': '420-630 km', 'iX1': '425-440 km', 'i4': '435-590 km', 'i7': '560-625 km',
    'e-tron': '350-400 km', 'e-tron GT': '445-500 km',
    'I-Pace': '446-470 km',
    'Spectre': '530 km',
    'Eletre': '490-600 km'
}

export default function ElectricCarCard({ car }: { car: Car }) {
    const exShowroomPrice = car.startingPrice

    const { onRoadPrice, isOnRoadMode } = useOnRoadPrice({
        exShowroomPrice,
        fuelType: 'Electric'
    })

    const displayPrice = isOnRoadMode ? (onRoadPrice / 100000).toFixed(2) : (exShowroomPrice / 100000).toFixed(2)
    const priceLabel = isOnRoadMode ? 'On-Road' : 'Ex-Showroom'
    const range = evRangeData[car.name] || '400-500 km'

    return (
        <Link
            href={`/${car.brandName.toLowerCase().replace(/\s+/g, '-')}-cars/${car.name.toLowerCase().replace(/\s+/g, '-')}`}
            className="block group"
        >
            <div className="bg-white border border-emerald-200 hover:border-emerald-400 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200">
                <div className="flex h-36 sm:h-44">
                    {/* Car Image - Responsive */}
                    <div className="w-32 sm:w-48 flex-shrink-0 relative overflow-hidden rounded-l-lg bg-gradient-to-br from-emerald-50 to-green-100">
                        <img
                            src={car.image}
                            alt={car.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none'
                                const parent = e.currentTarget.parentElement
                                if (parent) {
                                    const fallback = document.createElement('div')
                                    fallback.className = 'bg-emerald-100 text-emerald-600 text-xs sm:text-sm font-semibold text-center flex items-center justify-center h-full p-1'
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
                            <span className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-emerald-600 text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded z-10">
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
                                    <h3 className="text-base sm:text-xl md:text-2xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors leading-tight truncate">
                                        <span className="text-gray-600 font-semibold">{car.brandName} </span>
                                        {car.name}
                                    </h3>
                                </div>
                                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-400 group-hover:text-emerald-600 transition-colors flex-shrink-0 mt-0.5 sm:mt-1" />
                            </div>

                            {/* Range Display instead of Rating */}
                            <div className="flex items-center gap-1 sm:gap-1.5 mb-2 sm:mb-3">
                                <Fuel className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 flex-shrink-0" />
                                <span className="text-emerald-600 font-bold text-sm sm:text-base whitespace-nowrap">{range} Range</span>
                            </div>

                            {/* Variants - Responsive */}
                            <div className="text-gray-600 text-sm sm:text-base">
                                {car.variants || 0} Variants
                            </div>
                        </div>

                        {/* Bottom Section: Price - Responsive */}
                        <div>
                            <div className="flex items-baseline gap-1 sm:gap-2 flex-wrap">
                                <span className="text-lg sm:text-2xl md:text-3xl font-bold text-emerald-600">₹ {displayPrice}</span>
                                <span className="text-base sm:text-lg md:text-xl font-semibold text-emerald-600">Lakh</span>
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
