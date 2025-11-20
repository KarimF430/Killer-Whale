'use client'

import { useState, useEffect } from 'react'
import { Heart, X } from 'lucide-react'
import { useFavourites } from '@/lib/favourites-context'
import CarCard from './CarCard'

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
}

export default function FavouriteCars() {
    const { favourites, clearAllFavourites } = useFavourites()
    const [favouriteCars, setFavouriteCars] = useState<Car[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchFavouriteCars()
    }, [favourites])

    const fetchFavouriteCars = async () => {
        if (favourites.length === 0) {
            setFavouriteCars([])
            setLoading(false)
            return
        }

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

            // Fetch all favourite cars
            const carPromises = favourites.map(async (carId) => {
                try {
                    const response = await fetch(`${apiUrl}/api/cars/${carId}`)
                    if (response.ok) {
                        const data = await response.json()
                        // Map API response to Car interface if needed, or ensure backend sends correct format
                        // Assuming backend sends mostly correct data, but ensuring defaults for missing fields
                        return {
                            ...data,
                            brand: data.brand || data.brandName || 'Unknown',
                            brandName: data.brandName || data.brand || 'Unknown',
                            fuelTypes: data.fuelTypes || [data.fuelType || 'Petrol'],
                            transmissions: data.transmissions || [data.transmission || 'Manual'],
                            launchDate: data.launchDate || new Date().toISOString(),
                            isNew: data.isNew || false,
                            isPopular: data.isPopular || false
                        } as Car
                    }
                    return null
                } catch (error) {
                    console.error(`Error fetching car ${carId}:`, error)
                    return null
                }
            })

            const cars = await Promise.all(carPromises)
            const validCars = cars.filter((car): car is Car => car !== null)
            setFavouriteCars(validCars)
        } catch (error) {
            console.error('Error fetching favourite cars:', error)
        } finally {
            setLoading(false)
        }
    }

    // Don't show section if no favourites
    if (favourites.length === 0) {
        return null
    }

    // Don't show if loading finished but no valid cars found (e.g. API errors)
    if (!loading && favouriteCars.length === 0) {
        return null
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                    Favourite Cars
                </h2>

                {favourites.length > 0 && (
                    <button
                        onClick={clearAllFavourites}
                        className="text-sm text-gray-600 hover:text-red-600 transition-colors flex items-center gap-2"
                    >
                        <X className="h-4 w-4" />
                        Clear All
                    </button>
                )}
            </div>

            {/* Cars Horizontal Scroll */}
            <div className="relative">
                {loading ? (
                    <div className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex-shrink-0 w-64 sm:w-72 bg-white rounded-xl border border-gray-200 overflow-hidden">
                                <div className="h-48 bg-gray-200 animate-pulse"></div>
                                <div className="p-5 space-y-3">
                                    <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
                                    <div className="h-8 bg-gray-200 animate-pulse rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <div
                            className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-4"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {favouriteCars.map((car) => (
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
                        <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-gray-50 via-gray-50/80 to-transparent pointer-events-none sm:hidden -z-10" />
                    </>
                )}
            </div>
        </div>
    )
}
