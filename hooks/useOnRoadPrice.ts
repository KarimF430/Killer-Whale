import { useState, useEffect, useMemo } from 'react'
import { calculateOnRoadPrice, getRTOCharges } from '@/lib/rto-data-optimized'
import { subscribeToCityChange } from '@/lib/city-events'

interface PriceConfig {
  exShowroomPrice: number
  fuelType: string
  showBreakup?: boolean
}

interface OnRoadPriceResult {
  onRoadPrice: number
  exShowroomPrice: number
  rtoCharges: number
  city: string
  state: string
  isOnRoadMode: boolean
}

// Cache for calculated prices to avoid recalculation
const priceCache = new Map<string, number>()

/**
 * Lightning-fast hook for on-road price calculations
 * - Reads city from localStorage
 * - Calculates on-road price instantly (< 1ms)
 * - Caches results for performance
 * - Auto-updates when city changes
 */
export function useOnRoadPrice(config: PriceConfig): OnRoadPriceResult {
  const { exShowroomPrice, fuelType, showBreakup = false } = config

  const [selectedCity, setSelectedCity] = useState<string>('Mumbai, Maharashtra')
  const [isOnRoadMode, setIsOnRoadMode] = useState<boolean>(false)

  // Load city from localStorage on mount
  useEffect(() => {
    const savedCity = localStorage.getItem('selectedCity')
    if (savedCity) {
      setSelectedCity(savedCity)
      setIsOnRoadMode(true) // User has selected a city, show on-road prices
    }
  }, [])

  // Listen for city changes
  useEffect(() => {
    const handleCityChange = (newCity: string) => {
      setSelectedCity(newCity)
      setIsOnRoadMode(true)
    }

    // Subscribe to custom event (same tab)
    const unsubscribe = subscribeToCityChange(handleCityChange)

    // Also listen to storage event (cross-tab)
    const handleStorageChange = () => {
      const savedCity = localStorage.getItem('selectedCity')
      if (savedCity) {
        setSelectedCity(savedCity)
        setIsOnRoadMode(true)
      }
    }
    window.addEventListener('storage', handleStorageChange)

    return () => {
      unsubscribe()
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  // Memoized calculation - only recalculates when inputs change
  const result = useMemo(() => {
    const state = selectedCity.split(',')[1]?.trim() || 'Maharashtra'

    // Create cache key
    const cacheKey = `${exShowroomPrice}-${state}-${fuelType}`

    // Check cache first
    let onRoadPrice = priceCache.get(cacheKey)

    if (!onRoadPrice) {
      // Calculate and cache
      const breakup = calculateOnRoadPrice(exShowroomPrice, state, fuelType)
      onRoadPrice = breakup.totalOnRoadPrice
      priceCache.set(cacheKey, onRoadPrice)
    }

    // Get RTO for breakup if needed
    const rtoCharges = showBreakup
      ? getRTOCharges(state, fuelType, exShowroomPrice)
      : 0

    return {
      onRoadPrice,
      exShowroomPrice,
      rtoCharges,
      city: selectedCity.split(',')[0]?.trim() || 'Mumbai',
      state,
      isOnRoadMode
    }
  }, [exShowroomPrice, fuelType, selectedCity, showBreakup, isOnRoadMode])

  return result
}

/**
 * Batch calculator for multiple prices (for lists)
 * Even faster for calculating many prices at once
 */
export function useBatchOnRoadPrice(
  items: Array<{ exShowroomPrice: number; fuelType: string; id: string }>
): Map<string, OnRoadPriceResult> {
  const [selectedCity, setSelectedCity] = useState<string>('Mumbai, Maharashtra')
  const [isOnRoadMode, setIsOnRoadMode] = useState<boolean>(false)

  // Load city from localStorage on mount
  useEffect(() => {
    const savedCity = localStorage.getItem('selectedCity')
    if (savedCity) {
      setSelectedCity(savedCity)
      setIsOnRoadMode(true)
    }
  }, [])

  // Listen for city changes
  useEffect(() => {
    const handleCityChange = (newCity: string) => {
      setSelectedCity(newCity)
      setIsOnRoadMode(true)
    }

    // Subscribe to custom event (same tab)
    const unsubscribe = subscribeToCityChange(handleCityChange)

    // Also listen to storage event (cross-tab)
    const handleStorageChange = () => {
      const savedCity = localStorage.getItem('selectedCity')
      if (savedCity) {
        setSelectedCity(savedCity)
        setIsOnRoadMode(true)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => {
      unsubscribe()
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  // Batch calculation - memoized
  const results = useMemo(() => {
    const state = selectedCity.split(',')[1]?.trim() || 'Maharashtra'
    const city = selectedCity.split(',')[0]?.trim() || 'Mumbai'
    const resultMap = new Map<string, OnRoadPriceResult>()

    items.forEach(item => {
      const cacheKey = `${item.exShowroomPrice}-${state}-${item.fuelType}`

      let onRoadPrice = priceCache.get(cacheKey)

      if (!onRoadPrice) {
        const breakup = calculateOnRoadPrice(item.exShowroomPrice, state, item.fuelType)
        onRoadPrice = breakup.totalOnRoadPrice
        priceCache.set(cacheKey, onRoadPrice)
      }

      resultMap.set(item.id, {
        onRoadPrice,
        exShowroomPrice: item.exShowroomPrice,
        rtoCharges: 0,
        city,
        state,
        isOnRoadMode
      })
    })

    return resultMap
  }, [items, selectedCity, isOnRoadMode])

  return results
}

/**
 * Simple function to format price display
 * Shows "Ex-Showroom" or "On-Road" based on mode
 */
export function formatPriceLabel(isOnRoadMode: boolean): string {
  return isOnRoadMode ? 'On-Road' : 'Ex-Showroom'
}

/**
 * Clear price cache (useful for testing or memory management)
 */
export function clearPriceCache(): void {
  priceCache.clear()
}
