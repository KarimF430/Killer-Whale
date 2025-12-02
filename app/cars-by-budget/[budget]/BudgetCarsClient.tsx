'use client'

import { useState } from 'react'
import { useOnRoadPrice } from '@/hooks/useOnRoadPrice'
import CarCard from '@/components/home/CarCard'
import BudgetCarCard from './BudgetCarCard'

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

interface BudgetCarsClientProps {
    initialCars: Car[]
    popularCars: Car[]
    newLaunchedCars: Car[]
    budgetLabel: string
    budgetDescription: string
}

const fuelFilters = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid']
const transmissionFilters = ['Manual', 'Automatic']

export default function BudgetCarsClient({
    initialCars,
    popularCars,
    newLaunchedCars,
    budgetLabel,
    budgetDescription
}: BudgetCarsClientProps) {
    const [selectedFuel, setSelectedFuel] = useState<string[]>([])
    const [selectedTransmission, setSelectedTransmission] = useState<string[]>([])

    // Apply filters
    const filteredCars = initialCars.filter(car => {
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
        <>
            {/* Header & Filters */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {budgetLabel} Cars
                </h1>
                <p className="text-gray-600 mb-6">
                    {budgetDescription}
                    <button className="text-red-600 ml-1 font-medium">...read more</button>
                </p>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 pb-4 border-b border-gray-200">
                    {fuelFilters.map(fuel => (
                        <button
                            key={fuel}
                            onClick={() => toggleFilter('fuel', fuel)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedFuel.includes(fuel)
                                ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white'
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
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedTransmission.includes(trans)
                                ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {trans}
                        </button>
                    ))}
                </div>
            </div>

            {/* Cars List */}
            {filteredCars.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-gray-500 text-lg">No cars found matching your filters.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredCars.map((car) => (
                        <BudgetCarCard key={car.id} car={car} budgetLabel={budgetLabel} />
                    ))}
                </div>
            )}

            {/* Popular Cars */}
            {popularCars.length > 0 && (
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Popular Cars</h2>
                    <div className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
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
            )}

            {/* New Launches */}
            {newLaunchedCars.length > 0 && (
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">New Launches</h2>
                    <div className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
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
            )}
        </>
    )
}
