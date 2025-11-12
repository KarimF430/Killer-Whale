'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import Footer from '@/components/Footer'
import PopularComparisons from '@/components/home/PopularComparisons'
import PageContainer, { PageSection } from '@/components/layout/PageContainer'

interface Car {
  id: string
  name: string
  brand: string
  brandName: string
  heroImage: string
}

export default function CompareCarsPage() {
  const router = useRouter()
  const [selectedCar1, setSelectedCar1] = useState<Car | null>(null)
  const [selectedCar2, setSelectedCar2] = useState<Car | null>(null)
  const [showCarSelector, setShowCarSelector] = useState<1 | 2 | null>(null)
  const [cars, setCars] = useState<Car[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

  useEffect(() => {
    fetchCars()
  }, [])

  const fetchCars = async () => {
    try {
      setLoading(true)
      const [modelsRes, brandsRes] = await Promise.all([
        fetch(`${backendUrl}/api/models`),
        fetch(`${backendUrl}/api/brands`)
      ])

      const models = await modelsRes.json()
      const brands = await brandsRes.json()

      const brandMap: Record<string, string> = {}
      brands.forEach((brand: any) => {
        brandMap[brand.id] = brand.name
      })

      const processedCars = models.map((model: any) => ({
        id: model.id,
        name: model.name,
        brand: model.brandId,
        brandName: brandMap[model.brandId] || 'Unknown',
        heroImage: model.heroImage ? `${backendUrl}${model.heroImage}` : ''
      }))

      setCars(processedCars)
    } catch (error) {
      console.error('Error fetching cars:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCars = cars.filter(car =>
    car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    car.brandName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCarSelect = (car: Car) => {
    if (showCarSelector === 1) {
      setSelectedCar1(car)
    } else if (showCarSelector === 2) {
      setSelectedCar2(car)
    }
    setShowCarSelector(null)
    setSearchQuery('')
  }

  const handleStartComparison = () => {
    if (selectedCar1 && selectedCar2) {
      const slug1 = `${selectedCar1.brandName.toLowerCase().replace(/\s+/g, '-')}-${selectedCar1.name.toLowerCase().replace(/\s+/g, '-')}`
      const slug2 = `${selectedCar2.brandName.toLowerCase().replace(/\s+/g, '-')}-${selectedCar2.name.toLowerCase().replace(/\s+/g, '-')}`
      router.push(`/compare/${slug1}-vs-${slug2}`)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <PageContainer maxWidth="lg">
        <PageSection spacing="normal">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Add cars of your choice
          </h1>
          <p className="text-base text-gray-600 leading-relaxed">
            Motoroctane brings you comparison of Hyundai Venue, Kia Sonet and Maruti Suzuki Baleno...
            <span className="text-blue-600 cursor-pointer hover:underline">more</span>
          </p>
        </div>

        {/* Car Selection Container */}
        <div className="bg-gray-100 rounded-3xl p-8 mb-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Car 1 */}
            <button
              onClick={() => setShowCarSelector(1)}
              className="aspect-square bg-white rounded-2xl flex items-center justify-center hover:shadow-md transition-shadow border border-gray-200"
            >
              {selectedCar1 ? (
                <div className="text-center p-4 w-full">
                  <img
                    src={selectedCar1.heroImage}
                    alt={`${selectedCar1.brandName} ${selectedCar1.name}`}
                    className="w-full h-28 object-contain mb-3"
                    onError={(e) => {
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='%23374151'%3E%3Cpath d='M50 200h300c5.5 0 10-4.5 10-10v-80c0-16.6-13.4-30-30-30H70c-16.6 0-30 13.4-30 30v80c0 5.5 4.5 10 10 10z'/%3E%3Ccircle cx='100' cy='220' r='25' fill='%23111827'/%3E%3Ccircle cx='300' cy='220' r='25' fill='%23111827'/%3E%3C/svg%3E"
                    }}
                  />
                  <h3 className="font-semibold text-sm text-gray-900">{selectedCar1.brandName}</h3>
                  <p className="text-xs text-gray-600">{selectedCar1.name}</p>
                </div>
              ) : (
                <svg className="w-20 h-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              )}
            </button>

            {/* Car 2 */}
            <button
              onClick={() => setShowCarSelector(2)}
              className="aspect-square bg-white rounded-2xl flex items-center justify-center hover:shadow-md transition-shadow border border-gray-200"
            >
              {selectedCar2 ? (
                <div className="text-center p-4 w-full">
                  <img
                    src={selectedCar2.heroImage}
                    alt={`${selectedCar2.brandName} ${selectedCar2.name}`}
                    className="w-full h-28 object-contain mb-3"
                    onError={(e) => {
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='%23374151'%3E%3Cpath d='M50 200h300c5.5 0 10-4.5 10-10v-80c0-16.6-13.4-30-30-30H70c-16.6 0-30 13.4-30 30v80c0 5.5 4.5 10 10 10z'/%3E%3Ccircle cx='100' cy='220' r='25' fill='%23111827'/%3E%3Ccircle cx='300' cy='220' r='25' fill='%23111827'/%3E%3C/svg%3E"
                    }}
                  />
                  <h3 className="font-semibold text-sm text-gray-900">{selectedCar2.brandName}</h3>
                  <p className="text-xs text-gray-600">{selectedCar2.name}</p>
                </div>
              ) : (
                <svg className="w-20 h-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Start Comparison Button */}
        <button
          onClick={handleStartComparison}
          disabled={!selectedCar1 || !selectedCar2}
          className="w-full bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed text-gray-900 font-bold text-xl py-5 rounded-2xl transition-colors mb-12"
        >
          Start Comparison
        </button>

        {/* Popular Comparison Section */}
        <div>
          <PopularComparisons />
        </div>
        </PageSection>
      </PageContainer>

      {/* Car Selector Modal */}
      {showCarSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Select Car {showCarSelector}
                </h3>
                <button
                  onClick={() => setShowCarSelector(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Search */}
              <input
                type="text"
                placeholder="Search cars..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="p-6 overflow-y-auto max-h-96">
              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading cars...</div>
              ) : (
                <div className="space-y-3">
                  {filteredCars.map((car) => (
                    <button
                      key={car.id}
                      onClick={() => handleCarSelect(car)}
                      className="w-full flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <img
                        src={car.heroImage}
                        alt={`${car.brandName} ${car.name}`}
                        className="w-20 h-16 object-contain"
                        onError={(e) => {
                          e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='%23374151'%3E%3Cpath d='M50 200h300c5.5 0 10-4.5 10-10v-80c0-16.6-13.4-30-30-30H70c-16.6 0-30 13.4-30 30v80c0 5.5 4.5 10 10 10z'/%3E%3Ccircle cx='100' cy='220' r='25' fill='%23111827'/%3E%3Ccircle cx='300' cy='220' r='25' fill='%23111827'/%3E%3C/svg%3E"
                        }}
                      />
                      <div className="flex-1 text-left">
                        <h4 className="font-bold text-gray-900">
                          {car.brandName} {car.name}
                        </h4>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
