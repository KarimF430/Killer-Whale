'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import PageContainer, { PageSection } from '../layout/PageContainer'

const FUEL_TYPES = [
    { id: 'petrol', label: 'Petrol', price: 104.21 },
    { id: 'diesel', label: 'Diesel', price: 90.76 },
    { id: 'cng', label: 'CNG (kg)', price: 76.59 },
]

export default function FuelCalculatorPage() {
    const [distance, setDistance] = useState('')
    const [mileage, setMileage] = useState('')
    const [fuelPrice, setFuelPrice] = useState('104.21')
    const [fuelType, setFuelType] = useState('petrol')
    const [result, setResult] = useState<{ fuelNeeded: number; totalCost: number } | null>(null)

    useEffect(() => { window.scrollTo(0, 0) }, [])

    useEffect(() => {
        const fuel = FUEL_TYPES.find(f => f.id === fuelType)
        if (fuel) setFuelPrice(fuel.price.toString())
    }, [fuelType])

    const calculate = () => {
        const d = parseFloat(distance), m = parseFloat(mileage), p = parseFloat(fuelPrice)
        if (d > 0 && m > 0 && p > 0) {
            const fuelNeeded = d / m
            setResult({ fuelNeeded, totalCost: fuelNeeded * p })
        }
    }

    const reset = () => {
        setDistance('')
        setMileage('')
        setFuelType('petrol')
        setFuelPrice('104.21')
        setResult(null)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <PageContainer maxWidth="md">
                <PageSection spacing="normal">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">

                        {/* Header */}
                        <div className="p-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h1 className="text-base font-semibold text-gray-900">Fuel Cost Calculator</h1>
                                <Link href="/" className="text-gray-400 hover:text-gray-600">
                                    <ArrowLeft className="w-5 h-5" />
                                </Link>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Calculate your trip fuel expenses</p>
                        </div>

                        {/* Fuel Type */}
                        <div className="p-4 border-b border-gray-200">
                            <label className="block text-sm font-medium text-gray-900 mb-3">Fuel Type</label>
                            <div className="grid grid-cols-3 gap-2">
                                {FUEL_TYPES.map((f) => (
                                    <button
                                        key={f.id}
                                        onClick={() => setFuelType(f.id)}
                                        className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${fuelType === f.id
                                                ? 'bg-orange-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {f.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Inputs */}
                        <div className="p-4 space-y-4 border-b border-gray-200">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">DISTANCE (km)</label>
                                <input
                                    type="number"
                                    value={distance}
                                    onChange={(e) => setDistance(e.target.value)}
                                    placeholder="Enter distance in kilometers"
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    MILEAGE ({fuelType === 'cng' ? 'km/kg' : 'km/l'})
                                </label>
                                <input
                                    type="number"
                                    value={mileage}
                                    onChange={(e) => setMileage(e.target.value)}
                                    placeholder="Enter your vehicle's mileage"
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    FUEL PRICE (₹/{fuelType === 'cng' ? 'kg' : 'litre'})
                                </label>
                                <input
                                    type="number"
                                    value={fuelPrice}
                                    onChange={(e) => setFuelPrice(e.target.value)}
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm"
                                />
                                <p className="text-xs text-gray-500 mt-1">Price auto-filled based on current rates. You can edit if needed.</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-4 flex gap-3">
                            <button
                                onClick={calculate}
                                disabled={!distance || !mileage || !fuelPrice}
                                className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded transition-colors"
                            >
                                Calculate
                            </button>
                            <button onClick={reset} className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded">
                                Reset
                            </button>
                        </div>

                        {/* Result */}
                        {result && (
                            <div className="p-4 bg-orange-50 border-t border-orange-100">
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">Estimated Fuel Cost</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white rounded-lg p-3 border border-gray-100">
                                        <p className="text-xs text-gray-500">Fuel Needed</p>
                                        <p className="text-lg font-bold text-gray-900">{result.fuelNeeded.toFixed(2)} {fuelType === 'cng' ? 'kg' : 'L'}</p>
                                    </div>
                                    <div className="bg-white rounded-lg p-3 border border-gray-100">
                                        <p className="text-xs text-gray-500">Total Cost</p>
                                        <p className="text-lg font-bold text-orange-600">₹{result.totalCost.toFixed(0)}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* SEO Content */}
                    <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">How to Use the Fuel Calculator</h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Planning a road trip or daily commute? Our fuel calculator helps you estimate fuel costs before you hit the road.
                            Simply enter the distance you plan to travel, your vehicle's mileage, and the current fuel price to get an instant estimate.
                        </p>

                        <h3 className="text-base font-semibold text-gray-900 mb-2">Understanding Fuel Efficiency</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Fuel efficiency varies based on driving conditions, vehicle type, and maintenance. Highway driving typically
                            gives better mileage than city driving. Regular servicing and proper tire pressure can improve your vehicle's fuel economy.
                        </p>

                        <h3 className="text-base font-semibold text-gray-900 mb-2">Current Fuel Prices in India</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Fuel prices in India are revised daily based on international crude oil prices. The prices shown are approximate
                            averages for metro cities. Actual prices may vary by city and fuel station.
                        </p>

                        <div className="mt-6 pt-4 border-t border-gray-100">
                            <h3 className="text-base font-semibold text-gray-900 mb-3">Related Calculators</h3>
                            <div className="flex flex-wrap gap-2">
                                <Link href="/emi-calculator" className="text-sm text-orange-600 hover:underline">EMI Calculator →</Link>
                                <span className="text-gray-300">|</span>
                                <Link href="/compare" className="text-sm text-orange-600 hover:underline">Compare Cars →</Link>
                            </div>
                        </div>
                    </div>
                </PageSection>
            </PageContainer>
        </div>
    )
}
