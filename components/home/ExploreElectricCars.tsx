'use client'

import Link from 'next/link'
import ElectricCarCard from './ElectricCarCard'
import PageSection from '../common/PageSection'

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
    bodyType?: string
}

// Range data for EV models (in km)
const evRangeData: Record<string, string> = {
    // Tesla
    'Model Y': '500-660 km',
    'Model 3': '513-629 km',
    // Hyundai
    'Ioniq 5': '481-631 km',
    'Creta EV': '450-500 km',
    // Tata
    'Nexon EV': '312-465 km',
    'Punch EV': '315-421 km',
    'Tiago EV': '315-365 km',
    'Tigor EV': '315-360 km',
    'Curvv EV': '450-502 km',
    'Harrier EV': '500-550 km',
    // Mahindra
    'XUV400 EV': '375-456 km',
    'BE 6': '535-682 km',
    'XEV 9e': '533-656 km',
    // MG
    'ZS EV': '461-528 km',
    'Comet EV': '230 km',
    'Windsor EV': '331-425 km',
    'M9 EV': '600+ km',
    // Kia
    'EV6': '528-590 km',
    'EV9': '541-563 km',
    // BYD
    'Atto 3': '468-521 km',
    'Seal': '510-650 km',
    'Sealion 7': '502-567 km',
    'eMAX 7': '420-530 km',
    'E6': '415-520 km',
    // VinFast
    'VF 7': '431-460 km',
    'VF e34': '285-318 km',
    // Mini
    'Countryman Electric': '420-460 km',
    // Volvo
    'C40 Recharge': '475-530 km',
    'XC40 Recharge': '425-478 km',
    'EX30': '344-476 km',
    // Porsche
    'Taycan': '435-560 km',
    // Mercedes
    'EQB': '400-453 km',
    'EQS': '580-740 km',
    'EQS SUV': '530-660 km',
    // BMW
    'iX': '420-630 km',
    'iX1': '425-440 km',
    'i4': '435-590 km',
    'i7': '560-625 km',
    // Audi
    'e-tron': '350-400 km',
    'e-tron GT': '445-500 km',
    // Jaguar
    'I-Pace': '446-470 km',
    // Rolls-Royce
    'Spectre': '530 km',
    // Lotus
    'Eletre': '490-600 km',
}

export default function ExploreElectricCars({ allCars }: { allCars: Car[] }) {
    // Filter only electric cars with price >= 1 lakh
    const electricCars = allCars.filter(car =>
        car.fuelTypes?.some(fuel => fuel.toLowerCase() === 'electric') &&
        car.startingPrice >= 100000
    ).slice(0, 10) // Limit to 10 cars

    const scrollContainer = (direction: 'left' | 'right') => {
        const container = document.getElementById('electric-cars-scroll')
        if (container) {
            const scrollAmount = 300
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            })
        }
    }

    // Don't render if no electric cars
    if (electricCars.length === 0) {
        return null
    }

    return (
        <PageSection background="white">
            <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 -mx-3 sm:-mx-4 lg:-mx-6 xl:-mx-8 px-3 sm:px-4 lg:px-6 xl:px-8 py-6 sm:py-8 rounded-xl">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Explore Electric Cars</h2>
                        <p className="text-sm text-emerald-600">Go green with zero emissions</p>
                    </div>
                </div>

                {/* Cars Horizontal Scroll */}
                <div className="relative group">
                    {/* Left Scroll Arrow */}
                    <button
                        onClick={() => scrollContainer('left')}
                        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full items-center justify-center text-gray-700 hover:text-emerald-600 transition-all opacity-0 group-hover:opacity-100 -ml-5"
                        aria-label="Scroll left"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Right Scroll Arrow */}
                    <button
                        onClick={() => scrollContainer('right')}
                        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full items-center justify-center text-gray-700 hover:text-emerald-600 transition-all opacity-0 group-hover:opacity-100 -mr-5"
                        aria-label="Scroll right"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    <div
                        id="electric-cars-scroll"
                        className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {electricCars.map((car) => (
                            <ElectricCarCard
                                key={car.id}
                                car={{
                                    ...car,
                                    range: evRangeData[car.name] || '400-500 km'
                                }}
                                onClick={() => {
                                    const brandSlug = car.brandName.toLowerCase().replace(/\s+/g, '-')
                                    const modelSlug = car.name.toLowerCase().replace(/\s+/g, '-')
                                    window.location.href = `/${brandSlug}-cars/${modelSlug}`
                                }}
                            />
                        ))}

                        {/* See More tile - Green Theme */}
                        <Link
                            href="/electric-cars"
                            className="flex-shrink-0 w-[260px] sm:w-72 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
                        >
                            {/* Top section matching image height */}
                            <div className="h-40 sm:h-48 flex items-center justify-center bg-gradient-to-br from-emerald-400 to-green-500">
                                <div className="text-center px-4 sm:px-6">
                                    <h3 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                                        See More
                                    </h3>
                                </div>
                            </div>

                            {/* Bottom section matching card info height */}
                            <div className="p-4 sm:p-5 bg-gradient-to-br from-emerald-500 to-green-600">
                                <h4 className="text-xl sm:text-2xl font-bold text-white text-center mb-3 sm:mb-4">
                                    Electric Cars
                                </h4>

                                {/* Spacer to match card height (approx 80-96px for fuel/trans/price area) */}
                                <div className="h-20 sm:h-24"></div>

                                {/* Button matching View Details */}
                                <div className="w-full bg-white text-emerald-600 py-2 sm:py-2.5 rounded-lg font-semibold text-sm sm:text-base text-center shadow-md">
                                    View All Cars
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-emerald-50 via-emerald-50/80 to-transparent pointer-events-none sm:hidden -z-10" />
                </div>
            </div>
        </PageSection>
    )
}
