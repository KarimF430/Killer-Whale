'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
    id: string
    email: string
    firstName: string
    lastName: string
    phone?: string | null
    dateOfBirth?: Date | null
    profileImage?: string | null
    savedCars: string[]
}

interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (email: string, password: string, rememberMe: boolean) => Promise<void>
    logout: () => Promise<void>
    register: (data: RegisterData) => Promise<void>
}

interface RegisterData {
    firstName: string
    lastName: string
    email: string
    phone?: string
    dateOfBirth?: string
    password: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

    // Check for existing session on mount
    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/user/me`, {
                credentials: 'include'
            })

            if (response.ok) {
                const data = await response.json()
                setUser(data.user)
            }
        } catch (error) {
            console.error('Auth check failed:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const login = async (email: string, password: string, rememberMe: boolean) => {
        const response = await fetch(`${backendUrl}/api/user/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password, rememberMe })
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.message || 'Login failed')
        }

        const data = await response.json()
        setUser(data.user)
    }

    const logout = async () => {
        await fetch(`${backendUrl}/api/user/logout`, {
            method: 'POST',
            credentials: 'include'
        })
        setUser(null)
    }

    const register = async (data: RegisterData) => {
        const response = await fetch(`${backendUrl}/api/user/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.message || 'Registration failed')
        }

        const responseData = await response.json()
        setUser(responseData.user)
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                logout,
                register
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
