import Link from 'next/link'
import { Calendar, Users, Fuel, Heart, Gauge } from 'lucide-react'
import { useOnRoadPrice } from '@/hooks/useOnRoadPrice'
import { useFavourites } from '@/lib/favourites-context'

interface Car {
  id: string
  name: string
  brand: string
  brandName: string
  image: string
  startingPrice: number
  lowestPriceFuelType?: string
  fuelTypes: string[]
  transmissions: string[]
  seating: number
  launchDate: string
  slug: string
  isNew: boolean
  isPopular: boolean
}

interface CarCardProps {
  car: Car
  onClick: () => void
}

// Helper function to format transmission
const formatTransmission = (transmission: string): string => {
  const lower = transmission.toLowerCase()
  if (lower === 'manual') return 'Manual'
  if (lower === 'automatic') return 'Automatic'
  return transmission.toUpperCase()
}

// Helper function to format fuel type
const formatFuelType = (fuel: string): string => {
  const lower = fuel.toLowerCase()
  if (lower === 'cng') return 'CNG'
  if (lower === 'petrol') return 'Petrol'
  if (lower === 'diesel') return 'Diesel'
  if (lower === 'electric') return 'Electric'
  return fuel
}

// Helper function to format launch date
const formatLaunchDate = (dateString: string): string => {
  if (!dateString || dateString === 'Recently Launched' || dateString === 'Launched') return 'Recently Launched'

  // Remove "Launched " prefix if present to parse the date
  const cleanDate = dateString.replace(/^Launched\s+/, '')

  // Consistent month names (same as other components)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  try {
    const date = new Date(cleanDate)

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateString.startsWith('Launched') ? dateString : `Launched ${dateString}`
    }

    const month = months[date.getMonth()]
    const year = date.getFullYear()

    return `Launched ${month} ${year}`
  } catch (e) {
    return dateString.startsWith('Launched') ? dateString : `Launched ${dateString}`
  }
}

export default function CarCard({ car, onClick }: CarCardProps) {
  const { isFavourite, toggleFavourite } = useFavourites()
  const isFav = isFavourite(car.id)

  // Get on-road price (lightning fast with caching)
  const { onRoadPrice, isOnRoadMode } = useOnRoadPrice({
    exShowroomPrice: car.startingPrice,
    fuelType: car.lowestPriceFuelType || car.fuelTypes?.[0] || 'Petrol'
  })

  // Use on-road price if mode is enabled, otherwise ex-showroom
  const displayPrice = isOnRoadMode ? onRoadPrice : car.startingPrice
  const priceLabel = isOnRoadMode ? 'On-Road' : 'Ex-Showroom'

  return (
    <div
      onClick={onClick}
      className="flex-shrink-0 w-[260px] sm:w-72 bg-white rounded-xl border border-gray-200 hover:shadow-lg active:scale-95 transition-all duration-300 overflow-hidden cursor-pointer group"
    >
      {/* Image Container */}
      <div className="relative h-40 sm:h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {/* New/Popular Badge */}
        {car.isNew && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold z-10 shadow-md">
            NEW
          </div>
        )}
        {car.isPopular && !car.isNew && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-gradient-to-r from-orange-500 to-red-600 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold z-10 shadow-md">
            POPULAR
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            toggleFavourite(car)
          }}
          className={`absolute top-2 right-2 sm:top-3 sm:right-3 p-2 sm:p-2.5 rounded-full shadow-md transition-all duration-200 z-10 ${isFav
            ? 'bg-red-500 hover:bg-red-600 active:bg-red-700'
            : 'bg-white hover:bg-red-50 active:bg-red-100'
            }`}
        >
          <Heart
            className={`h-4 w-4 sm:h-5 sm:w-5 transition-colors ${isFav ? 'text-white' : 'text-gray-400 hover:text-red-500'
              }`}
            fill={isFav ? 'currentColor' : 'none'}
          />
        </button>


        {/* Car Image */}
        <div className="w-full h-full flex items-center justify-center">
          {car.image ? (
            <img
              src={car.image}
              alt={`${car.brandName} ${car.name}`}
              className="w-full h-full object-contain object-center transition-transform duration-300"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='%23374151'%3E%3Cpath d='M50 200h300c5.5 0 10-4.5 10-10v-80c0-16.6-13.4-30-30-30H70c-16.6 0-30 13.4-30 30v80c0 5.5 4.5 10 10 10z'/%3E%3Ccircle cx='100' cy='220' r='25' fill='%23111827'/%3E%3Ccircle cx='300' cy='220' r='25' fill='%23111827'/%3E%3Cpath d='M80 110h240l-20-30H100z' fill='%236B7280'/%3E%3C/svg%3E"
              }}
            />
          ) : (
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='#374151' className="w-3/4 h-3/4">
              <path d='M50 200h300c5.5 0 10-4.5 10-10v-80c0-16.6-13.4-30-30-30H70c-16.6 0-30 13.4-30 30v80c0 5.5 4.5 10 10 10z' />
              <circle cx='100' cy='220' r='25' fill='#111827' />
              <circle cx='300' cy='220' r='25' fill='#111827' />
              <path d='M80 110h240l-20-30H100z' fill='#6B7280' />
            </svg>
          )}
        </div>
      </div>

      {/* Car Info */}
      <div className="p-4 sm:p-5">
        <h3 className="font-bold text-gray-900 mb-2 text-base sm:text-lg truncate" title={`${car.brandName} ${car.name}`}>
          {car.brandName} {car.name}
        </h3>

        <div className="flex flex-col mb-3 sm:mb-4">
          <div className="flex items-baseline">
            <span className="text-red-600 font-bold text-lg sm:text-xl">₹ {(displayPrice / 100000).toFixed(2)} Lakh</span>
            <span className="text-gray-500 text-xs sm:text-sm ml-2">Onwards</span>
          </div>
          <span className="text-xs text-gray-500 mt-1">{priceLabel} Price</span>
        </div>

        <div className="space-y-2 sm:space-y-2.5 text-sm text-gray-600 mb-3 sm:mb-4">
          <div className="flex items-center">
            <Fuel className="h-4 w-4 mr-2 sm:mr-3 text-gray-400 flex-shrink-0" />
            <span className="truncate">{(car.fuelTypes || ['Petrol']).map(f => formatFuelType(f)).join('/')}</span>
          </div>
          <div className="flex items-center">
            <Gauge className="h-4 w-4 mr-2 sm:mr-3 text-gray-400 flex-shrink-0" />
            <span className="truncate">{(car.transmissions || ['Manual']).map(t => formatTransmission(t)).join('/')}</span>
          </div>
        </div>

        <button
          className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white py-2 sm:py-2.5 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 shadow-md hover:shadow-lg transform group-hover:scale-105"
        >
          View Details
        </button>
      </div>
    </div>
  )
}
