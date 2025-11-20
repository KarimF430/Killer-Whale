import Link from 'next/link'
import { Star, ChevronRight } from 'lucide-react'
import { useOnRoadPrice } from '@/hooks/useOnRoadPrice'
import { FrontendModel } from '@/lib/models-api'
import { truncateCarName } from '@/lib/text-utils'

interface BrandCarCardProps {
  car: FrontendModel
  brandSlug: string
  brandName?: string
}

export default function BrandCarCard({ car, brandSlug, brandName }: BrandCarCardProps) {
  // Convert price string (e.g., "₹12.39" or "12.39") to number for calculation
  // Remove rupee symbol and any other non-numeric characters except decimal point
  const cleanPrice = car.price.replace(/[₹,\s]/g, '')
  const priceInLakh = parseFloat(cleanPrice)
  const exShowroomPrice = priceInLakh * 100000

  // Debug logging (remove after testing)
  if (car.name === 'Elevate') {
    console.log('🚗 BrandCarCard Elevate:', {
      rawPrice: car.price,
      cleanPrice,
      priceInLakh,
      exShowroomPrice
    })
  }

  // Get on-road price
  const { onRoadPrice, isOnRoadMode } = useOnRoadPrice({
    exShowroomPrice,
    fuelType: car.fuelType || 'Petrol'
  })

  // Use on-road price if mode is enabled
  const displayPrice = isOnRoadMode ? (onRoadPrice / 100000).toFixed(2) : priceInLakh.toFixed(2)
  const priceLabel = isOnRoadMode ? 'On-Road' : 'Ex-Showroom'

  return (
    <Link
      href={`/${brandSlug}-cars/${car.name.toLowerCase().replace(/\s+/g, '-')}`}
      className="block group"
    >
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md active:shadow-lg active:scale-[0.99] transition-all duration-200">
        <div className="flex h-40">
          {/* Car Image - Compact */}
          <div className="w-44 flex-shrink-0 relative overflow-hidden rounded-l-lg">
            <img
              src={(() => {
                if (!car.image) return '';
                if (car.image.startsWith('http://') || car.image.startsWith('https://')) return car.image;
                if (car.image.startsWith('/uploads/')) return `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}${car.image}`;
                return car.image;
              })()}
              alt={car.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                const parent = e.currentTarget.parentElement
                if (parent) {
                  const fallback = document.createElement('div')
                  fallback.className = 'bg-gray-200 text-gray-600 text-sm font-semibold text-center flex items-center justify-center h-full'
                  fallback.innerHTML = car.name
                  parent.appendChild(fallback)
                }
              }}
            />
            {car.isNew && (
              <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded z-10">
                NEW
              </span>
            )}
          </div>

          {/* Car Details - Improved Layout */}
          <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between">
            {/* Top Section: Name & Arrow */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 pr-2">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                    {brandName ? (
                      <>
                        {/* Mobile: Show truncated brand + model name */}
                        <span className="sm:hidden">
                          {truncateCarName(brandName, car.name, 16)}
                        </span>
                        {/* Desktop: Show brand + model separately */}
                        <span className="hidden sm:inline">
                          <span className="text-gray-600 font-semibold">{brandName} </span>
                          {car.name}
                        </span>
                      </>
                    ) : (
                      car.name
                    )}
                  </h3>
                </div>
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 mt-1" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-2">
                <Star className="h-4 w-4 text-green-600 fill-current" />
                <span className="font-semibold text-gray-900 text-sm">{car.rating}/5</span>
                <span className="text-gray-500 text-sm">{car.reviews} Ratings</span>
              </div>

              {/* Variants */}
              <div className="text-gray-600 text-sm mb-3">
                {car.variants} Variants
              </div>
            </div>

            {/* Bottom Section: Price */}
            <div>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-xl sm:text-2xl font-bold text-red-600">₹ {displayPrice}</span>
                <span className="text-base sm:text-lg font-semibold text-red-600">Lakh</span>
                <span className="text-gray-500 text-sm">Onwards</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
