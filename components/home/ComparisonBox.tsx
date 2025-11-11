'use client'

interface Car {
  id: number
  name: string
  brand: string
  startingPrice: number
  image: string
  slug: string
}

export default function ComparisonBox() {
  // Popular comparison cars data - only VS comparisons for horizontal scroll
  const comparisonCards = [
    // Card 1: Maruti Victoris VS Maruti Grand Vitara
    {
      id: 1,
      car1: {
        id: 1,
        name: 'Victoris',
        brand: 'Maruti',
        startingPrice: 1050000,
        image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=300&h=200&fit=crop&crop=center',
        slug: 'maruti-victoris'
      },
      car2: {
        id: 2,
        name: 'Grand Vitara',
        brand: 'Maruti',
        startingPrice: 1077000,
        image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=300&h=200&fit=crop&crop=center',
        slug: 'maruti-grand-vitara'
      }
    },
    // Card 2: Tata Nexon VS Hyundai Creta
    {
      id: 2,
      car1: {
        id: 3,
        name: 'Nexon',
        brand: 'Tata',
        startingPrice: 732000,
        image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=300&h=200&fit=crop&crop=center',
        slug: 'tata-nexon'
      },
      car2: {
        id: 4,
        name: 'Creta',
        brand: 'Hyundai',
        startingPrice: 1199000,
        image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=300&h=200&fit=crop&crop=center',
        slug: 'hyundai-creta'
      }
    },
    // Card 3: Honda City VS Maruti Baleno
    {
      id: 3,
      car1: {
        id: 5,
        name: 'City',
        brand: 'Honda',
        startingPrice: 1199000,
        image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=300&h=200&fit=crop&crop=center',
        slug: 'honda-city'
      },
      car2: {
        id: 6,
        name: 'Baleno',
        brand: 'Maruti',
        startingPrice: 649000,
        image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=300&h=200&fit=crop&crop=center',
        slug: 'maruti-baleno'
      }
    }
  ]

  const formatPrice = (price: number) => {
    return (price / 100000).toFixed(2)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Popular Comparison</h2>
        
        {/* Comparison Cards - Horizontal Scroll */}
        <div className="relative mb-8">
          <div
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {comparisonCards.map((card) => (
              <div key={card.id} className="flex-shrink-0 w-96 bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                {/* VS Comparison Layout */}
                <div className="flex items-center justify-between mb-4">
                  {/* Car 1 */}
                  <div className="flex-1 text-center">
                    <img 
                      src={card.car1.image}
                      alt={`${card.car1.brand} ${card.car1.name}`}
                      className="w-20 h-16 object-cover rounded-lg mx-auto mb-2"
                    />
                    <div className="text-sm text-gray-600">{card.car1.brand}</div>
                    <div className="font-semibold text-gray-900">{card.car1.name}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Rs. {formatPrice(card.car1.startingPrice)} Lakh
                    </div>
                    <div className="text-xs text-gray-500">onwards</div>
                  </div>

                  {/* VS Badge */}
                  <div className="mx-4">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">VS</span>
                    </div>
                  </div>

                  {/* Car 2 */}
                  <div className="flex-1 text-center">
                    <img 
                      src={card.car2.image}
                      alt={`${card.car2.brand} ${card.car2.name}`}
                      className="w-20 h-16 object-cover rounded-lg mx-auto mb-2"
                    />
                    <div className="text-sm text-gray-600">{card.car2.brand}</div>
                    <div className="font-semibold text-gray-900">{card.car2.name}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Rs. {formatPrice(card.car2.startingPrice)} Lakh
                    </div>
                    <div className="text-xs text-gray-500">onwards</div>
                  </div>
                </div>

                <button className="w-full bg-white border border-red-500 text-red-500 py-2 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium">
                  Compare Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Compare Cars of Your Choice Button */}
        <div className="text-center">
          <button className="w-full max-w-md bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white py-3 rounded-lg transition-all duration-200 font-medium">
            Compare Cars of Your Choice
          </button>
        </div>
    </div>
  )
}
