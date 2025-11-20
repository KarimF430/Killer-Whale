'use client'

import { Heart, Calendar, Fuel, Users } from 'lucide-react'

interface Car {
  id: number
  name: string
  brand: string
  image: string
  startingPrice: number
  fuelType: string
  seating: number
  launchDate: string
  slug: string
  isNew: boolean
}

export default function UpcomingCars() {
  // Upcoming cars data - same structure as CarsByBudget
  const upcomingCars: Car[] = [
    {
      id: 1,
      name: 'Grand Vitara',
      brand: 'Maruti Suzuki',
      image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=300&fit=crop&crop=center',
      startingPrice: 1099000,
      fuelType: 'Petrol/Hybrid',
      seating: 5,
      launchDate: 'Launched January 2024',
      slug: 'maruti-suzuki-grand-vitara',
      isNew: true
    },
    {
      id: 2,
      name: 'Safari',
      brand: 'Tata',
      image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=300&fit=crop&crop=center',
      startingPrice: 2999000,
      fuelType: 'Petrol/Diesel',
      seating: 7,
      launchDate: 'Launched March 2024',
      slug: 'tata-safari',
      isNew: true
    },
    {
      id: 3,
      name: 'Creta',
      brand: 'Hyundai',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop&crop=center',
      startingPrice: 1199000,
      fuelType: 'Petrol/Diesel',
      seating: 5,
      launchDate: 'Launched February 2024',
      slug: 'hyundai-creta',
      isNew: false
    },
    {
      id: 4,
      name: 'Nexon',
      brand: 'Tata',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop&crop=center',
      startingPrice: 799000,
      fuelType: 'Petrol/Electric',
      seating: 5,
      launchDate: 'Launched April 2024',
      slug: 'tata-nexon',
      isNew: true
    }
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Upcoming Cars</h2>

      {/* Cars Horizontal Scroll */}
      <div className="relative">
        <div
          className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {upcomingCars.map((car) => (
            <div
              key={car.id}
              className="flex-shrink-0 w-72 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              {/* Car Image with Badges */}
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                {/* NEW Badge */}
                {car.isNew && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                    NEW
                  </div>
                )}

                {/* Heart Icon */}
                <button className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors z-10">
                  <Heart className="h-5 w-5 text-gray-600" />
                </button>

                {/* Car Image */}
                <div className="w-full h-full flex items-center justify-center">
                  <img
                    src={car.image}
                    alt={`${car.brand} ${car.name}`}
                    className="w-full h-full object-contain object-center transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='%23374151'%3E%3Cpath d='M50 200h300c5.5 0 10-4.5 10-10v-80c0-16.6-13.4-30-30-30H70c-16.6 0-30 13.4-30 30v80c0 5.5 4.5 10 10 10z'/%3E%3Ccircle cx='100' cy='220' r='25' fill='%23111827'/%3E%3Ccircle cx='300' cy='220' r='25' fill='%23111827'/%3E%3Cpath d='M80 110h240l-20-30H100z' fill='%236B7280'/%3E%3C/svg%3E"
                    }}
                  />
                </div>
              </div>

              {/* Car Info */}
              <div className="p-5">
                <h3 className="font-bold text-gray-900 mb-2 text-lg">{car.brand} {car.name}</h3>

                <div className="flex items-center text-red-600 font-bold text-xl mb-4">
                  <span>₹ {(car.startingPrice / 100000).toFixed(2)} Lakh</span>
                </div>

                <div className="space-y-3 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-3 text-gray-400" />
                    <span>{car.launchDate}</span>
                  </div>
                  <div className="flex items-center">
                    <Fuel className="h-4 w-4 mr-3 text-gray-400" />
                    <span>{car.fuelType}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-3 text-gray-400" />
                    <span>{car.seating} Seater</span>
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white py-3 rounded-lg transition-all duration-200 text-sm font-semibold">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-gray-50 via-gray-50/80 to-transparent pointer-events-none sm:hidden -z-10" />
      </div>
    </div>
  )
}
