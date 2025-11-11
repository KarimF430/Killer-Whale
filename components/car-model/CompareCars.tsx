'use client'

import { useState } from 'react'
import { Plus, X, ArrowRight, Star, Fuel, Users, Zap, Shield } from 'lucide-react'
import Link from 'next/link'

interface CarData {
  fullName: string
  brand: string
  model: string
}

interface CompareCarsProps {
  carData: CarData
}

export default function CompareCars({ carData }: CompareCarsProps) {
  const [compareList, setCompareList] = useState<number[]>([1]) // Current car is always first

  const availableCars = [
    {
      id: 1,
      brand: carData.brand,
      model: carData.model,
      fullName: carData.fullName,
      image: '/api/placeholder/300/200',
      priceRange: '₹6.19 - 8.90 Lakh',
      rating: 4.2,
      mileage: '23.26 kmpl',
      seating: 5,
      fuelType: 'Petrol',
      safetyRating: 4,
      keySpecs: {
        engine: '1.2L Petrol',
        power: '82 bhp',
        torque: '113 Nm',
        transmission: 'Manual/AMT'
      },
      isCurrent: true
    },
    {
      id: 2,
      brand: 'Hyundai',
      model: 'i20',
      fullName: 'Hyundai i20',
      image: '/api/placeholder/300/200',
      priceRange: '₹7.04 - 11.21 Lakh',
      rating: 4.3,
      mileage: '20.35 kmpl',
      seating: 5,
      fuelType: 'Petrol',
      safetyRating: 4,
      keySpecs: {
        engine: '1.2L Petrol',
        power: '88 bhp',
        torque: '115 Nm',
        transmission: 'Manual/CVT'
      }
    },
    {
      id: 3,
      brand: 'Tata',
      model: 'Altroz',
      fullName: 'Tata Altroz',
      image: '/api/placeholder/300/200',
      priceRange: '₹6.60 - 10.74 Lakh',
      rating: 4.1,
      mileage: '25.11 kmpl',
      seating: 5,
      fuelType: 'Petrol/Diesel',
      safetyRating: 5,
      keySpecs: {
        engine: '1.2L Petrol',
        power: '86 bhp',
        torque: '113 Nm',
        transmission: 'Manual/DCT'
      }
    },
    {
      id: 4,
      brand: 'Honda',
      model: 'Jazz',
      fullName: 'Honda Jazz',
      image: '/api/placeholder/300/200',
      priceRange: '₹7.89 - 10.29 Lakh',
      rating: 4.2,
      mileage: '18.2 kmpl',
      seating: 5,
      fuelType: 'Petrol',
      safetyRating: 4,
      keySpecs: {
        engine: '1.2L Petrol',
        power: '90 bhp',
        torque: '110 Nm',
        transmission: 'Manual/CVT'
      }
    },
    {
      id: 5,
      brand: 'Volkswagen',
      model: 'Polo',
      fullName: 'Volkswagen Polo',
      image: '/api/placeholder/300/200',
      priceRange: '₹6.79 - 10.99 Lakh',
      rating: 4.4,
      mileage: '18.78 kmpl',
      seating: 5,
      fuelType: 'Petrol',
      safetyRating: 4,
      keySpecs: {
        engine: '1.0L TSI',
        power: '110 bhp',
        torque: '175 Nm',
        transmission: 'Manual/AT'
      }
    }
  ]

  const addToCompare = (carId: number) => {
    if (compareList.length < 3 && !compareList.includes(carId)) {
      setCompareList([...compareList, carId])
    }
  }

  const removeFromCompare = (carId: number) => {
    if (carId !== 1) { // Don't allow removing the current car
      setCompareList(compareList.filter(id => id !== carId))
    }
  }

  const getComparedCars = () => {
    return availableCars.filter(car => compareList.includes(car.id))
  }

  const getAvailableCars = () => {
    return availableCars.filter(car => !compareList.includes(car.id))
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Compare {carData.fullName}
          </h2>
          <p className="text-gray-600">
            Add up to 2 more cars to compare specifications and features
          </p>
        </div>
        
        {compareList.length > 1 && (
          <Link
            href={`/compare?cars=${compareList.join(',')}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center space-x-2"
          >
            <span>Compare Now</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Current Car + Comparison Slots */}
        {Array.from({ length: 3 }, (_, index) => {
          const car = getComparedCars()[index]
          
          if (car) {
            return (
              <div key={car.id} className={`border-2 rounded-lg p-4 ${car.isCurrent ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                {car.isCurrent && (
                  <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium mb-3 inline-block">
                    Current Selection
                  </div>
                )}
                
                {!car.isCurrent && (
                  <button
                    onClick={() => removeFromCompare(car.id)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
                
                <div className="relative">
                  <img
                    src={car.image}
                    alt={car.fullName}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                </div>
                
                <h3 className="font-bold text-gray-900 mb-1">{car.fullName}</h3>
                <p className="text-blue-600 font-semibold mb-3">{car.priceRange}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Rating:</span>
                    <div className="flex items-center space-x-1">
                      <div className="flex">{renderStars(Math.floor(car.rating))}</div>
                      <span className="text-gray-700">{car.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Mileage:</span>
                    <span className="font-medium text-gray-900">{car.mileage}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Engine:</span>
                    <span className="font-medium text-gray-900">{car.keySpecs.engine}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Power:</span>
                    <span className="font-medium text-gray-900">{car.keySpecs.power}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Safety:</span>
                    <div className="flex">{renderStars(car.safetyRating)}</div>
                  </div>
                </div>
              </div>
            )
          } else {
            return (
              <div key={`empty-${index}`} className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Plus className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-700 mb-2">Add Car to Compare</h3>
                <p className="text-sm text-gray-500 text-center mb-4">
                  Select a car from the list below to compare with {carData.fullName}
                </p>
                <div className="text-xs text-gray-400">
                  Slot {index + 1} of 3
                </div>
              </div>
            )
          }
        })}
      </div>

      {/* Available Cars to Add */}
      {compareList.length < 3 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Add Cars to Compare ({compareList.length}/3)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {getAvailableCars().map((car) => (
              <div key={car.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                <img
                  src={car.image}
                  alt={car.fullName}
                  className="w-full h-24 object-cover rounded mb-2"
                />
                
                <h4 className="font-semibold text-gray-900 text-sm mb-1">{car.fullName}</h4>
                <p className="text-blue-600 font-medium text-sm mb-2">{car.priceRange}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                  <div className="flex items-center space-x-1">
                    <Fuel className="h-3 w-3" />
                    <span>{car.mileage}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span>{car.rating}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => addToCompare(car.id)}
                  className="w-full bg-blue-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Add to Compare
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Comparison Summary */}
      {compareList.length > 1 && (
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Quick Comparison Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Fuel className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-gray-900">Best Mileage</span>
              </div>
              <p className="text-lg font-bold text-green-600">
                {Math.max(...getComparedCars().map(car => parseFloat(car.mileage)))} kmpl
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Zap className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-gray-900">Most Powerful</span>
              </div>
              <p className="text-lg font-bold text-orange-600">
                {Math.max(...getComparedCars().map(car => parseInt(car.keySpecs.power)))} bhp
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Shield className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">Safest</span>
              </div>
              <div className="flex justify-center">
                {renderStars(Math.max(...getComparedCars().map(car => car.safetyRating)))}
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Star className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-gray-900">Highest Rated</span>
              </div>
              <p className="text-lg font-bold text-yellow-600">
                {Math.max(...getComparedCars().map(car => car.rating))}/5
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="mt-6 text-center">
        <p className="text-gray-600 mb-3">
          Need help choosing? Our experts can guide you through the comparison.
        </p>
        <div className="flex justify-center space-x-3">
          <Link
            href="/expert-consultation"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            Talk to Expert
          </Link>
          <Link
            href="/compare-tool"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Advanced Compare Tool
          </Link>
        </div>
      </div>
    </div>
  )
}
