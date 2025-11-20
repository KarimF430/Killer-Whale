'use client'

import { X, Zap } from 'lucide-react'
import { useFavourites } from '@/lib/favourites-context'
import CarCard from './CarCard'

export default function FavouriteCars() {
    const { favourites, clearAllFavourites } = useFavourites()

    // Don't show section if no favourites
    if (favourites.length === 0) {
        return null
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                    Favourite Cars
                </h2>

                <button
                    onClick={clearAllFavourites}
                    className="text-sm text-gray-600 hover:text-red-600 transition-colors flex items-center gap-2"
                >
                    <X className="h-4 w-4" />
                    Clear All
                </button>
            </div>

            {/* Cars Horizontal Scroll */}
            <div className="relative">
                <div
                    className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {favourites.map((car) => (
                        <div key={car.id} className="relative">
                            {/* Auto-added badge */}
                            {car.isAutoAdded && (
                                <div className="absolute top-2 left-2 z-20 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full shadow-md flex items-center gap-1">
                                    <Zap className="w-3 h-3" />
                                    <span className="font-semibold">Smart Pick</span>
                                </div>
                            )}
                            <CarCard
                                car={car}
                                onClick={() => {
                                    const brandSlug = car.brandName.toLowerCase().replace(/\s+/g, '-')
                                    const modelSlug = car.name.toLowerCase().replace(/\s+/g, '-')
                                    window.location.href = `/${brandSlug}-cars/${modelSlug}`
                                }}
                            />
                        </div>
                    ))}
                </div>
                <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-gray-50 via-gray-50/80 to-transparent pointer-events-none sm:hidden -z-10" />
            </div>
        </div>
    )
}
