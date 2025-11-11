'use client'

import { useState } from 'react'
import { Users, Fuel, MapPin, ChevronLeft, ChevronRight } from 'lucide-react'

interface SimilarCar {
  id: string
  name: string
  brand: string
  price: string
  fuelType: string
  seating: string
  mileage: string
  location: string
  image: string
}

interface SimilarCarsSectionProps {
  carName: string
  similarCars: SimilarCar[]
}

export default function SimilarCarsSection({ carName, similarCars }: SimilarCarsSectionProps) {
  return (
    <section className="py-8 bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-700 mb-6">
          Similar cars to {carName}
        </h2>

        {/* Horizontal Scroll Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow duration-200 flex items-center justify-center group">
            <ChevronLeft className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
          </button>

          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow duration-200 flex items-center justify-center group">
            <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
          </button>

          {/* Horizontal Scrollable Cars */}
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
            {similarCars.map((car) => (
              <div
                key={car.id}
                className="flex-shrink-0 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden w-72"
              >
                {/* Car Image */}
                <div className="relative h-32 bg-gray-300 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-8 bg-gray-500 rounded mx-auto mb-2 flex items-center justify-center">
                      <span className="text-white font-bold text-xs">CAR</span>
                    </div>
                    <p className="text-gray-700 text-xs font-medium">{car.name}</p>
                  </div>
                </div>

                {/* Car Details */}
                <div className="p-3">
                  {/* Car Name and Price */}
                  <div className="mb-3">
                    <h3 className="text-gray-900 font-bold text-sm mb-1">{car.name}</h3>
                    <p className="text-green-600 font-bold text-base">₹ {car.price}</p>
                  </div>

                  {/* Car Specifications */}
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center text-gray-600 text-xs">
                      <Fuel className="w-3 h-3 mr-2" />
                      <span>{car.fuelType}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600 text-xs">
                      <Users className="w-3 h-3 mr-2" />
                      <span>{car.seating}</span>
                    </div>
                    
                    <div className="flex items-center text-red-500 text-xs">
                      <div className="w-3 h-3 mr-2 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      </div>
                      <span>{car.mileage}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600 text-xs">
                      <MapPin className="w-3 h-3 mr-2" />
                      <span>{car.location}</span>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-3 rounded-lg text-xs transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
