'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight, IndianRupee, Calendar, Clock, MapPin } from 'lucide-react'

interface UpcomingCar {
  id: string
  name: string
  expectedPrice: string
  launchDate: string
  image: string
  fuelType: string
  bodyType: string
  city: string
  slug: string
  isConfirmed: boolean
}

interface BrandUpcomingCarsProps {
  brandName: string
}

export default function BrandUpcomingCars({ brandName }: BrandUpcomingCarsProps) {
  const getUpcomingCarsByBrand = (brand: string): UpcomingCar[] => {
    const upcomingData: Record<string, UpcomingCar[]> = {
      maruti: [
        { 
          id: '1', 
          name: 'Fronx Coupe', 
          expectedPrice: '₹8-12 Lakh', 
          launchDate: 'March 2024', 
          image: '/cars/fronx-coupe.jpg', 
          fuelType: 'Petrol/CNG',
          bodyType: 'SUV Coupe',
          city: 'Delhi',
          slug: 'fronx-coupe',
          isConfirmed: true
        },
        { 
          id: '2', 
          name: 'Jimny 5-Door', 
          expectedPrice: '₹12-15 Lakh', 
          launchDate: 'June 2024', 
          image: '/cars/jimny-5door.jpg', 
          fuelType: 'Petrol',
          bodyType: 'SUV',
          city: 'Mumbai',
          slug: 'jimny-5door',
          isConfirmed: false
        }
      ],
      hyundai: [
        { 
          id: '1', 
          name: 'Creta EV', 
          expectedPrice: '₹18-25 Lakh', 
          launchDate: 'April 2024', 
          image: '/cars/creta-ev.jpg', 
          fuelType: 'Electric',
          bodyType: 'SUV',
          city: 'Bangalore',
          slug: 'creta-ev',
          isConfirmed: true
        },
        { 
          id: '2', 
          name: 'Exter Facelift', 
          expectedPrice: '₹6-9 Lakh', 
          launchDate: 'July 2024', 
          image: '/cars/exter-facelift.jpg', 
          fuelType: 'Petrol/CNG',
          bodyType: 'SUV',
          city: 'Chennai',
          slug: 'exter-facelift',
          isConfirmed: false
        }
      ],
      tata: [
        { 
          id: '1', 
          name: 'Curvv', 
          expectedPrice: '₹10-17 Lakh', 
          launchDate: 'May 2024', 
          image: '/cars/curvv.jpg', 
          fuelType: 'Petrol/Electric',
          bodyType: 'SUV Coupe',
          city: 'Pune',
          slug: 'curvv',
          isConfirmed: true
        },
        { 
          id: '2', 
          name: 'Sierra EV', 
          expectedPrice: '₹25-35 Lakh', 
          launchDate: 'September 2024', 
          image: '/cars/sierra-ev.jpg', 
          fuelType: 'Electric',
          bodyType: 'SUV',
          city: 'Hyderabad',
          slug: 'sierra-ev',
          isConfirmed: false
        }
      ]
    }
    return upcomingData[brand.toLowerCase()] || []
  }

  const upcomingCars = getUpcomingCarsByBrand(brandName)

  const scrollContainer = (direction: 'left' | 'right') => {
    const container = document.getElementById(`upcoming-cars-scroll-${brandName}`)
    if (container) {
      const scrollAmount = 300
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  if (upcomingCars.length === 0) {
    return (
      <section className="py-4 sm:py-6 lg:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Upcoming {brandName.charAt(0).toUpperCase() + brandName.slice(1)} Cars
          </h2>
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No upcoming cars announced yet. Stay tuned for exciting launches!</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Upcoming {brandName.charAt(0).toUpperCase() + brandName.slice(1)} Cars
        </h2>
        
        {/* Cars Horizontal Scroll */}
        <div className="relative">
          {/* Navigation arrows - hidden on mobile */}
          <button
            onClick={() => scrollContainer('left')}
            className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          
          <button
            onClick={() => scrollContainer('right')}
            className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>

          <div
            id={`upcoming-cars-scroll-${brandName}`}
            className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-4 px-1 sm:px-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {upcomingCars.map((car) => (
              <Link
                key={car.id}
                href={`/cars/${brandName.toLowerCase()}/${car.slug}`}
                className="flex-shrink-0 w-72 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
              >
                {/* Car Image */}
                <div className="h-40 sm:h-48 bg-gradient-to-r from-orange-400 to-red-500 rounded-t-lg flex items-center justify-center relative">
                  <div className="text-center text-white">
                    <div className="w-16 h-10 sm:w-20 sm:h-12 bg-white/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <span className="text-xs font-medium">CAR</span>
                    </div>
                    <p className="text-xs sm:text-sm opacity-80 px-2 leading-tight">{brandName.charAt(0).toUpperCase() + brandName.slice(1)} {car.name}</p>
                  </div>
                  
                  {/* Launch Status Badge */}
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      car.isConfirmed 
                        ? 'bg-green-500 text-white' 
                        : 'bg-yellow-500 text-black'
                    }`}>
                      {car.isConfirmed ? 'Confirmed' : 'Expected'}
                    </span>
                  </div>
                </div>

                {/* Car Info */}
                <div className="p-3 sm:p-4">
                  <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-base leading-tight">{brandName.charAt(0).toUpperCase() + brandName.slice(1)} {car.name}</h3>
                  
                  <div className="flex items-center text-green-600 font-bold text-base sm:text-lg mb-2 sm:mb-3">
                    <IndianRupee className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="text-sm sm:text-base">{car.expectedPrice}</span>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{car.launchDate}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-center text-xs flex-shrink-0">⛽</span>
                      <span className="truncate">{car.fuelType}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{car.bodyType}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{car.city}</span>
                    </div>
                  </div>

                  <button className="w-full mt-3 sm:mt-4 bg-orange-600 text-white py-1.5 sm:py-2 rounded-lg hover:bg-orange-700 transition-colors text-xs sm:text-sm font-medium">
                    Get Notified
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
