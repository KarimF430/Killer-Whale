'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface FavouritesContextType {
    favourites: string[]
    addFavourite: (carId: string) => void
    removeFavourite: (carId: string) => void
    isFavourite: (carId: string) => boolean
    toggleFavourite: (carId: string) => void
    clearAllFavourites: () => void
}

const FavouritesContext = createContext<FavouritesContextType | undefined>(undefined)

const STORAGE_KEY = 'motoroctane_favourites'

export function FavouritesProvider({ children }: { children: ReactNode }) {
    const [favourites, setFavourites] = useState<string[]>([])
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
                localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites))
            } catch (error) {
                console.error('Error saving favourites:', error)
            }
        }
    }, [favourites, isLoaded])

    const addFavourite = (carId: string) => {
        setFavourites(prev => {
            if (prev.includes(carId)) return prev
            return [...prev, carId]
        })
    }

    const removeFavourite = (carId: string) => {
        setFavourites(prev => prev.filter(id => id !== carId))
    }

    const isFavourite = (carId: string) => {
        return favourites.includes(carId)
    }

    const toggleFavourite = (carId: string) => {
        if (isFavourite(carId)) {
            removeFavourite(carId)
        } else {
            addFavourite(carId)
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
