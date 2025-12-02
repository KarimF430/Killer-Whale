'use client'

import { useState, useEffect, useRef } from 'react'
import { MapPin, ArrowLeft, X, Navigation, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { searchCities, type City } from '@/lib/cities-data'
import {
    detectLocationAndGetCity,
    searchCitiesWithGoogle,
    getPlaceDetails,
    loadGoogleMapsAPI
} from '@/lib/google-maps'

interface GoogleCity {
    description: string
    place_id: string
    structured_formatting: {
        main_text: string
        secondary_text: string
    }
}

interface LocationSelectorProps {
    popularCities: City[]
}

export default function LocationSelector({ popularCities }: LocationSelectorProps) {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<City[]>([])
    const [googleResults, setGoogleResults] = useState<GoogleCity[]>([])
    const [selectedCity, setSelectedCity] = useState<string | null>(null)
    const [isDetectingLocation, setIsDetectingLocation] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const [useGoogleMaps, setUseGoogleMaps] = useState(false)
    const searchTimeoutRef = useRef<NodeJS.Timeout>()

    // Load saved city from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('selectedCity')
        if (saved) {
            setSelectedCity(saved)
        }
    }, [])

    // Initialize Google Maps API
    useEffect(() => {
        loadGoogleMapsAPI()
            .then(() => {
                setUseGoogleMaps(true)
                console.log('Google Maps API loaded successfully')
            })
            .catch((error) => {
                console.warn('Google Maps API not available, using fallback:', error)
                setUseGoogleMaps(false)
            })
    }, [])

    // Search functionality with Google Maps integration
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setSearchResults([])
            setGoogleResults([])
            return
        }

        // Clear previous timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current)
        }

        setIsSearching(true)

        // Debounce search
        searchTimeoutRef.current = setTimeout(async () => {
            if (useGoogleMaps) {
                try {
                    const predictions = await searchCitiesWithGoogle(searchQuery)
                    const formattedResults: GoogleCity[] = predictions.map(p => ({
                        description: p.description,
                        place_id: p.place_id,
                        structured_formatting: {
                            main_text: p.structured_formatting.main_text,
                            secondary_text: p.structured_formatting.secondary_text || ''
                        }
                    }))
                    setGoogleResults(formattedResults)
                } catch (error) {
                    console.error('Google search failed, using fallback:', error)
                    const results = searchCities(searchQuery)
                    setSearchResults(results)
                }
            } else {
                // Fallback to local search
                const results = searchCities(searchQuery)
                setSearchResults(results)
            }
            setIsSearching(false)
        }, 300)

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current)
            }
        }
    }, [searchQuery, useGoogleMaps])

    const handleCitySelect = (city: City) => {
        const cityName = `${city.name}, ${city.state}`
        setSelectedCity(cityName)
        localStorage.setItem('selectedCity', cityName)
        window.dispatchEvent(new Event('storage'))
        setTimeout(() => router.back(), 300)
    }

    const handleGoogleCitySelect = async (googleCity: GoogleCity) => {
        try {
            const details = await getPlaceDetails(googleCity.place_id)
            if (details && details.city && details.state) {
                const cityName = `${details.city}, ${details.state}`
                setSelectedCity(cityName)
                localStorage.setItem('selectedCity', cityName)
                window.dispatchEvent(new Event('storage'))
                setTimeout(() => router.back(), 300)
            } else {
                const cityName = googleCity.structured_formatting.main_text
                setSelectedCity(cityName)
                localStorage.setItem('selectedCity', cityName)
                window.dispatchEvent(new Event('storage'))
                setTimeout(() => router.back(), 300)
            }
        } catch (error) {
            const cityName = googleCity.structured_formatting.main_text
            setSelectedCity(cityName)
            localStorage.setItem('selectedCity', cityName)
            window.dispatchEvent(new Event('storage'))
            setTimeout(() => router.back(), 300)
        }
    }

    const handleDetectLocation = async () => {
        if (!useGoogleMaps) {
            alert('Location detection requires Google Maps API. Please select a city manually.')
            return
        }

        setIsDetectingLocation(true)

        try {
            const result = await detectLocationAndGetCity()

            if (result && result.city && result.state) {
                const cityName = `${result.city}, ${result.state}`
                setSelectedCity(cityName)
                localStorage.setItem('selectedCity', cityName)
                window.dispatchEvent(new Event('storage'))
                alert(`Location detected: ${cityName}`)
                setTimeout(() => router.back(), 1000)
            } else {
                alert('Could not determine city from your location. Please select manually.')
            }
        } catch (error: any) {
            console.error('Location detection error:', error)
            alert(error.message || 'Unable to detect location. Please select manually.')
        } finally {
            setIsDetectingLocation(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-gray-50">
            {/* Header with Search Bar */}
            <div className="bg-white shadow-sm sticky top-0 z-50 backdrop-blur-lg bg-white/95">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    {searchQuery.trim() === '' && (
                        <div className="flex items-center gap-3 mb-4">
                            <button
                                onClick={() => router.back()}
                                className="p-2.5 hover:bg-gradient-to-br hover:from-orange-50 hover:to-red-50 rounded-xl transition-all duration-200 group"
                                aria-label="Go back"
                            >
                                <ArrowLeft className="h-5 w-5 text-gray-600 group-hover:text-orange-600 transition-colors" />
                            </button>

                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-sm">
                                    <MapPin className="h-4 w-4 text-white" />
                                </div>
                                <h1 className="text-xl font-bold text-gray-900">Select Location</h1>
                            </div>

                            <button
                                onClick={() => router.back()}
                                className="ml-auto p-2.5 hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-200 rounded-xl transition-all duration-200 group"
                                aria-label="Close"
                            >
                                <X className="h-5 w-5 text-gray-500 group-hover:text-gray-700 transition-colors" />
                            </button>
                        </div>
                    )}

                    {/* Search Input */}
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-orange-500" />
                        <input
                            type="text"
                            placeholder="Search for city or area..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white text-sm text-gray-900 placeholder-gray-400 transition-all duration-200"
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

                    {/* Detect Location Button */}
                    {searchQuery.trim() === '' && (
                        <button
                            onClick={handleDetectLocation}
                            disabled={isDetectingLocation}
                            className="w-full mt-3 flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 hover:border-green-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="w-9 h-9 bg-green-500 rounded-lg flex items-center justify-center">
                                {isDetectingLocation ? (
                                    <Loader2 className="h-4 w-4 text-white animate-spin" />
                                ) : (
                                    <Navigation className="h-4 w-4 text-white" />
                                )}
                            </div>
                            <div className="flex-1 text-left">
                                <div className="font-semibold text-gray-900 text-sm">
                                    {isDetectingLocation ? 'Detecting...' : 'Use Current Location'}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {useGoogleMaps ? 'GPS enabled' : 'Enable GPS'}
                                </div>
                            </div>
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                {searchQuery.trim() === '' ? (
                    <div>
                        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Popular Cities</h2>
                        <div className="space-y-2">
                            {popularCities.map((city) => (
                                <button
                                    key={`${city.name}-${city.state}`}
                                    onClick={() => handleCitySelect(city)}
                                    className="group w-full flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-200 hover:border-orange-500 hover:shadow-md transition-all duration-200 text-left"
                                >
                                    <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500 transition-colors">
                                        <MapPin className="h-5 w-5 text-orange-600 group-hover:text-white transition-colors" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold text-gray-900 text-sm group-hover:text-orange-600 transition-colors">{city.name}</div>
                                        <div className="text-xs text-gray-500">{city.state}</div>
                                    </div>
                                    <svg className="w-4 h-4 text-gray-400 group-hover:text-orange-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : isSearching ? (
                    <div className="text-center py-12">
                        <Loader2 className="h-10 w-10 text-orange-600 mx-auto mb-4 animate-spin" />
                        <h2 className="text-lg font-bold text-gray-900 mb-2">Searching...</h2>
                        <p className="text-sm text-gray-500">Finding <span className="font-semibold">"{searchQuery}"</span></p>
                    </div>
                ) : googleResults.length === 0 && searchResults.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-5xl mb-4">📍</div>
                        <h2 className="text-lg font-bold text-gray-900 mb-2">No cities found</h2>
                        <p className="text-sm text-gray-500">No results for <span className="font-semibold">"{searchQuery}"</span></p>
                    </div>
                ) : (
                    <div>
                        {/* Google Maps Results */}
                        {googleResults.length > 0 && (
                            <div>
                                <div className="mb-4 text-sm text-gray-600 flex items-center gap-2">
                                    <span>Found {googleResults.length} {googleResults.length === 1 ? 'city' : 'cities'}</span>
                                    {useGoogleMaps && (
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                            Google Maps
                                        </span>
                                    )}
                                </div>
                                <div className="bg-white rounded-lg divide-y divide-gray-100">
                                    {googleResults.map((city) => (
                                        <button
                                            key={city.place_id}
                                            onClick={() => handleGoogleCitySelect(city)}
                                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                                        >
                                            <div className="flex items-center gap-3">
                                                <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {city.structured_formatting.main_text}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {city.structured_formatting.secondary_text}
                                                    </div>
                                                </div>
                                            </div>
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Local Fallback Results */}
                        {searchResults.length > 0 && googleResults.length === 0 && (
                            <div>
                                <div className="mb-4 text-sm text-gray-600">
                                    Found {searchResults.length} {searchResults.length === 1 ? 'city' : 'cities'}
                                </div>
                                <div className="bg-white rounded-lg divide-y divide-gray-100">
                                    {searchResults.map((city) => (
                                        <button
                                            key={`${city.name}-${city.state}`}
                                            onClick={() => handleCitySelect(city)}
                                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                                        >
                                            <div className="flex items-center gap-3">
                                                <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                                <div>
                                                    <div className="font-medium text-gray-900">{city.name}</div>
                                                    <div className="text-sm text-gray-500">{city.state}</div>
                                                </div>
                                            </div>
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
