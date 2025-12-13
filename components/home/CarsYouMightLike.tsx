'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import CarCard from './CarCard'
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

interface VisitedModel {
    id: string
    name: string
    brandName: string
    bodyType?: string
    timestamp: number
}

const VISITED_MODELS_KEY = 'motoroctane_visited_models'
const MAX_VISITED_MODELS = 5

/**
 * ✅ PERSONALIZED RECOMMENDATIONS: Cars You Might Like
 * 
 * Matches CarsByBudget styling exactly.
 * Shows similar cars based on user's visited model page.
 */
export default function CarsYouMightLike({ allCars }: { allCars: Car[] }) {
    const [visitedModel, setVisitedModel] = useState<VisitedModel | null>(null)
    const [similarCars, setSimilarCars] = useState<Car[]>([])
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)

        console.log('[CarsYouMightLike] useEffect running, allCars count:', allCars?.length)

        // Get visited models from localStorage
        const getVisitedModels = (): VisitedModel[] => {
            try {
                const stored = localStorage.getItem(VISITED_MODELS_KEY)
                if (stored) {
                    const parsed = JSON.parse(stored)
                    console.log('[CarsYouMightLike] Visited models:', parsed)
                    return parsed
                }
            } catch (e) {
                console.error('[CarsYouMightLike] Error reading:', e)
            }
            return []
        }

        const visitedModels = getVisitedModels()

        if (visitedModels.length === 0) {
            console.log('[CarsYouMightLike] No visited models found')
            return
        }

        // Get the most recently visited model
        const lastVisited = visitedModels[0]
        console.log('[CarsYouMightLike] Last visited:', lastVisited)
        setVisitedModel(lastVisited)

        // Find similar cars based on body type
        const visitedIds = new Set(visitedModels.map(m => m.id))

        // First try: Match by body type
        let filtered = allCars.filter(car => {
            // Exclude already visited models
            if (visitedIds.has(car.id)) return false

            // Match body type if available
            if (lastVisited.bodyType && car.bodyType) {
                return car.bodyType.toLowerCase() === lastVisited.bodyType.toLowerCase()
            }

            return false
        })

        console.log('[CarsYouMightLike] Body type matched cars:', filtered.length)

        // Second try: If no body type matches, just show popular cars not visited
        if (filtered.length === 0) {
            console.log('[CarsYouMightLike] No body type matches, showing popular cars')
            filtered = allCars.filter(car => !visitedIds.has(car.id))
        }

        // Sort by popularity
        filtered.sort((a, b) => {
            if (a.isPopular && !b.isPopular) return -1
            if (!a.isPopular && b.isPopular) return 1
            return 0
        })

        // Limit to 5 cars
        const result = filtered.slice(0, 5)
        console.log('[CarsYouMightLike] Final similar cars:', result.length, result.map(c => c.name))
        setSimilarCars(result)
    }, [allCars])

    const scrollContainer = (direction: 'left' | 'right') => {
        const container = document.getElementById('cars-you-might-like-scroll')
        if (container) {
            const scrollAmount = 300
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            })
        }
    }

    // Don't render on server or if no data
    if (!mounted || !visitedModel || similarCars.length === 0) {
        return null
    }

    return (
        <PageSection background="white">
            <div className="mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Cars You Might Like</h2>
                <p className="text-sm text-gray-500 mt-1">
                    Based on your interest in {visitedModel.brandName} {visitedModel.name}
                </p>
            </div>

            {/* Cars Horizontal Scroll - Exact copy from CarsByBudget */}
            <div className="relative">
                <div className="relative group">
                    {/* Left Scroll Arrow */}
                    <button
                        onClick={() => scrollContainer('left')}
                        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full items-center justify-center text-gray-700 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 -ml-5"
                        aria-label="Scroll left"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Right Scroll Arrow */}
                    <button
                        onClick={() => scrollContainer('right')}
                        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full items-center justify-center text-gray-700 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 -mr-5"
                        aria-label="Scroll right"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    <div
                        id="cars-you-might-like-scroll"
                        className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {similarCars.map((car) => (
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
                    <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none sm:hidden -z-10" />
                </div>
            </div>
        </PageSection>
    )
}

/**
 * Helper function to save visited model - call this from model page
 */
export function saveVisitedModel(model: { id: string; name: string; brandName: string; bodyType?: string }) {
    if (typeof window === 'undefined') return

    try {
        const stored = localStorage.getItem(VISITED_MODELS_KEY)
        let visitedModels: VisitedModel[] = stored ? JSON.parse(stored) : []

        // Remove if already exists
        visitedModels = visitedModels.filter(m => m.id !== model.id)

        // Add to the beginning
        visitedModels.unshift({
            ...model,
            timestamp: Date.now()
        })

        // Limit to max visited models
        if (visitedModels.length > MAX_VISITED_MODELS) {
            visitedModels = visitedModels.slice(0, MAX_VISITED_MODELS)
        }

        localStorage.setItem(VISITED_MODELS_KEY, JSON.stringify(visitedModels))
        console.log('[saveVisitedModel] Saved:', model.name, 'Total:', visitedModels.length)
    } catch (e) {
        console.error('[saveVisitedModel] Error:', e)
    }
}
