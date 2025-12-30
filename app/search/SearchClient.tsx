'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, ArrowLeft, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from '@/hooks/useDebounce'

interface CarModel {
    id: string
    name: string
    brandName: string
    brandSlug: string
    modelSlug: string
    slug: string
    heroImage: string
}

interface SearchResponse {
    results: CarModel[]
    count: number
    took: number
    query: string
}

interface SearchClientProps {
    popularSearches: string[]
    initialQuery?: string
}

export default function SearchClient({ popularSearches, initialQuery = '' }: SearchClientProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [searchQuery, setSearchQuery] = useState(initialQuery)
    const [searchResults, setSearchResults] = useState<CarModel[]>([])
    const [loading, setLoading] = useState(false)
    const [searchTime, setSearchTime] = useState<number>(0)
    const abortControllerRef = useRef<AbortController | null>(null)

    // Debounce search query by 300ms
    const debouncedSearchQuery = useDebounce(searchQuery, 300)

    // Update search query from URL params
    useEffect(() => {
        const query = searchParams.get('q')
        if (query && query !== searchQuery) {
            setSearchQuery(query)
        }
    }, [searchParams])

    // Search functionality with debouncing
    useEffect(() => {
        const performSearch = async () => {
            // Cancel previous request if exists
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }

            if (debouncedSearchQuery.trim() === '' || debouncedSearchQuery.length < 2) {
                setSearchResults([])
                setSearchTime(0)
                return
            }

            try {
                setLoading(true)

                // Create new abort controller for this request
                abortControllerRef.current = new AbortController()

                const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'
                const response = await fetch(
                    `${backendUrl}/api/search?q=${encodeURIComponent(debouncedSearchQuery)}&limit=20`,
                    { signal: abortControllerRef.current.signal }
                )

                if (!response.ok) {
                    throw new Error('Search failed')
                }

                const data: SearchResponse = await response.json()
                setSearchResults(data.results)
                setSearchTime(data.took)
            } catch (error: any) {
                if (error.name !== 'AbortError') {
                    console.error('Error searching:', error)
                    setSearchResults([])
                }
            } finally {
                setLoading(false)
            }
        }

        performSearch()

        // Cleanup function
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }
        }
    }, [debouncedSearchQuery])

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Header with Search Bar - Modern Design */}
            <div className="bg-white shadow-sm sticky top-0 z-50 backdrop-blur-lg bg-white/95">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center gap-3">
                        {/* Back Button - Refined */}
                        <button
                            onClick={() => router.back()}
                            className="p-2.5 hover:bg-gradient-to-br hover:from-red-50 hover:to-orange-50 rounded-xl transition-all duration-200 group"
                            aria-label="Go back"
                        >
                            <ArrowLeft className="h-5 w-5 text-gray-600 group-hover:text-red-600 transition-colors" />
                        </button>

                        {/* Search Input - Compact Design */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                            <input
                                type="text"
                                placeholder="Search for cars..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:bg-white text-sm text-gray-900 placeholder-gray-400 transition-all duration-200"
                                autoFocus
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                    aria-label="Clear search"
                                >
                                    <X className="h-3.5 w-3.5 text-gray-400" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Search Stats */}
                    {searchTime > 0 && (
                        <div className="mt-2 text-xs text-gray-500">
                            Found {searchResults.length} results in {searchTime}ms
                        </div>
                    )}
                </div>
            </div>

            {/* Search Results */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="bg-white rounded-lg p-4 flex items-center gap-4 animate-pulse">
                                <div className="w-20 h-16 bg-gray-200 rounded"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : searchQuery.trim() === '' || searchQuery.length < 2 ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Search className="h-7 w-7 text-red-600" />
                        </div>
                        <h1 className="text-xl font-bold text-gray-900 mb-2">Search for Cars</h1>
                        <p className="text-sm text-gray-500 mb-6">Find cars by name, brand, or model</p>

                        {/* Popular Searches - Compact */}
                        <div className="mt-6">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Popular Searches</h3>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {popularSearches.map((term) => (
                                    <button
                                        key={term}
                                        onClick={() => setSearchQuery(term)}
                                        className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:border-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                                    >
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : searchResults.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-5xl mb-4">🔍</div>
                        <h2 className="text-lg font-bold text-gray-900 mb-2">No cars found</h2>
                        <p className="text-sm text-gray-500 mb-4">No results for <span className="font-semibold">"{searchQuery}"</span></p>
                        <button
                            onClick={() => setSearchQuery('')}
                            className="px-5 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Clear Search
                        </button>
                    </div>
                ) : (
                    <div>
                        <div className="mb-3 text-xs text-gray-500 font-medium">
                            <h1 className="sr-only">Search Results for {searchQuery}</h1>
                            {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
                        </div>
                        <div className="space-y-2">
                            {searchResults.map((car) => (
                                <Link
                                    key={car.id}
                                    href={`/${car.brandSlug}-cars/${car.modelSlug}`}
                                    className="group block bg-white rounded-xl border border-gray-200 hover:border-red-500 hover:shadow-md transition-all duration-200"
                                >
                                    <div className="p-3 flex items-center gap-3">
                                        {/* Car Image - Compact */}
                                        <div className="w-20 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                                            {car.heroImage ? (
                                                <img
                                                    src={car.heroImage}
                                                    alt={`${car.brandName} ${car.name}`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='%23374151'%3E%3Cpath d='M50 200h300c5.5 0 10-4.5 10-10v-80c0-16.6-13.4-30-30-30H70c-16.6 0-30 13.4-30 30v80c0 5.5 4.5 10 10 10z'/%3E%3Ccircle cx='100' cy='220' r='25' fill='%23111827'/%3E%3Ccircle cx='300' cy='220' r='25' fill='%23111827'/%3E%3Cpath d='M80 110h240l-20-30H100z' fill='%236B7280'/%3E%3C/svg%3E"
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='#9CA3AF' className="w-16 h-16">
                                                        <path d='M50 200h300c5.5 0 10-4.5 10-10v-80c0-16.6-13.4-30-30-30H70c-16.6 0-30 13.4-30 30v80c0 5.5 4.5 10 10 10z' />
                                                        <circle cx='100' cy='220' r='25' fill='#6B7280' />
                                                        <circle cx='300' cy='220' r='25' fill='#6B7280' />
                                                        <path d='M80 110h240l-20-30H100z' fill='#9CA3AF' />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>

                                        {/* Car Info - Compact */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 text-sm mb-0.5 group-hover:text-red-600 transition-colors">
                                                {car.brandName} {car.name}
                                            </h3>
                                            <p className="text-xs text-gray-500">{car.brandName}</p>
                                        </div>

                                        {/* Arrow - Simple */}
                                        <div className="flex-shrink-0">
                                            <svg className="w-5 h-5 text-gray-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
