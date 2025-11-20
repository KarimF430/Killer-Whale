'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

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
    isAutoAdded?: boolean // Flag for auto-added favourites based on viewing behavior
}

interface FavouritesContextType {
    favourites: Car[]
    addFavourite: (car: Car) => void
    removeFavourite: (carId: string) => void
    isFavourite: (carId: string) => boolean
    toggleFavourite: (car: Car) => void
    clearAllFavourites: () => void
}

const FavouritesContext = createContext<FavouritesContextType | undefined>(undefined)

const STORAGE_KEY = 'motoroctane_favourites'

export function FavouritesProvider({ children }: { children: ReactNode }) {
    const [favourites, setFavourites] = useState<Car[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    // Load favourites from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY)
            if (stored) {
                const parsed = JSON.parse(stored)
                setFavourites(Array.isArray(parsed) ? parsed : [])
            }
        } catch (error) {
            console.error('Error loading favourites:', error)
        } finally {
            setIsLoaded(true)
        }
    }, [])

    // Save to localStorage whenever favourites change
    useEffect(() => {
        if (isLoaded) {
            try {
                console.log('💾 Saving favourites to localStorage:', favourites.length, 'cars')
                localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites))
            } catch (error) {
                console.error('Error saving favourites:', error)
            }
        }
    }, [favourites, isLoaded])

    const addFavourite = (car: Car) => {
        // Validate and ensure all required fields exist
        const validatedCar: Car = {
            id: car.id || `temp-${Date.now()}`,
            name: car.name || 'Unknown Car',
            brand: car.brand || car.brandName || 'Unknown',
            brandName: car.brandName || car.brand || 'Unknown',
            image: car.image || '',
            startingPrice: car.startingPrice || 0,
            fuelTypes: car.fuelTypes && car.fuelTypes.length > 0 ? car.fuelTypes : ['Petrol'],
            transmissions: car.transmissions && car.transmissions.length > 0 ? car.transmissions : ['Manual'],
            seating: car.seating || 5,
            launchDate: car.launchDate || 'Launched',
            slug: car.slug || `${(car.brandName || 'unknown').toLowerCase().replace(/\s+/g, '-')}-${(car.name || 'car').toLowerCase().replace(/\s+/g, '-')}`,
            isNew: car.isNew || false,
            isPopular: car.isPopular || false,
            isAutoAdded: car.isAutoAdded
        }

        console.log('✅ Adding validated car to favourites:', validatedCar)

        setFavourites(prev => {
            if (prev.some(c => c.id === validatedCar.id)) return prev
            return [...prev, validatedCar]
        })
    }

    const removeFavourite = (carId: string) => {
        setFavourites(prev => prev.filter(c => c.id !== carId))
    }

    const isFavourite = (carId: string) => {
        return favourites.some(c => c.id === carId)
    }

    const toggleFavourite = (car: Car) => {
        console.log('🔄 Toggling favourite for car:', car.name)
        if (isFavourite(car.id)) {
            console.log('❌ Removing from favourites')
            removeFavourite(car.id)
        } else {
            console.log('✅ Adding to favourites')
            addFavourite(car)
        }
    }

    const clearAllFavourites = () => {
        setFavourites([])
    }

    const value: FavouritesContextType = {
        favourites,
        addFavourite,
        removeFavourite,
        isFavourite,
        toggleFavourite,
        clearAllFavourites
    }

    return (
        <FavouritesContext.Provider value={value}>
            {children}
        </FavouritesContext.Provider>
    )
}

export function useFavourites() {
    const context = useContext(FavouritesContext)
    if (context === undefined) {
        throw new Error('useFavourites must be used within a FavouritesProvider')
    }
    return context
}
