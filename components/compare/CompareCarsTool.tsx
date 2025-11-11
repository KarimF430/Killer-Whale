'use client'

import { useState } from 'react'
import { Search, X, Plus, Star, Fuel, Users, Zap, IndianRupee, Check, Minus } from 'lucide-react'

interface Car {
  id: number
  name: string
  brand: string
  image: string
  price: string
  rating: number
  mileage: string
  engine: string
  power: string
  torque: string
  fuelType: string
  transmission: string
  seating: number
  bodyType: string
  safetyRating: number
  features: string[]
  pros: string[]
  cons: string[]
}

export default function CompareCarsTool() {
  const [selectedCars, setSelectedCars] = useState<Car[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showCarSelector, setShowCarSelector] = useState(false)

  // Mock car data - in real app, this would be fetched from API
  const availableCars: Car[] = [
    {
      id: 1,
      name: 'Swift',
      brand: 'Maruti Suzuki',
      image: '/cars/swift.jpg',
      price: '₹5.85 - 8.67 Lakh',
      rating: 4.2,
      mileage: '23.20 kmpl',
      engine: '1197 cc',
      power: '89 bhp',
      torque: '113 Nm',
      fuelType: 'Petrol',
      transmission: 'Manual/AMT',
      seating: 5,
      bodyType: 'Hatchback',
      safetyRating: 4,
      features: ['SmartPlay Pro+', 'Auto AC', 'Cruise Control', 'Dual Airbags'],
      pros: ['Excellent fuel economy', 'Reliable brand', 'Good resale value'],
      cons: ['Limited rear space', 'Basic interior']
    },
    {
      id: 2,
      name: 'i20',
      brand: 'Hyundai',
      image: '/cars/i20.jpg',
      price: '₹7.04 - 11.21 Lakh',
      rating: 4.3,
      mileage: '20.35 kmpl',
      engine: '1197 cc',
      power: '82 bhp',
      torque: '114 Nm',
      fuelType: 'Petrol',
      transmission: 'Manual/CVT',
      seating: 5,
      bodyType: 'Hatchback',
      safetyRating: 5,
      features: ['BlueLink', '10.25" Touchscreen', 'Wireless Charging', '6 Airbags'],
      pros: ['Premium features', 'Spacious cabin', 'Strong build quality'],
      cons: ['Higher price', 'Average fuel economy']
    },
    {
      id: 3,
      name: 'Baleno',
      brand: 'Maruti Suzuki',
      image: '/cars/baleno.jpg',
      price: '₹6.61 - 9.88 Lakh',
      rating: 4.1,
      mileage: '22.35 kmpl',
      engine: '1197 cc',
      power: '89 bhp',
      torque: '113 Nm',
      fuelType: 'Petrol',
      transmission: 'Manual/AMT',
      seating: 5,
      bodyType: 'Hatchback',
      safetyRating: 4,
      features: ['SmartPlay Pro+', 'Head-up Display', 'UV Cut Glass', 'Dual Airbags'],
      pros: ['Spacious interior', 'Good fuel efficiency', 'Premium feel'],
      cons: ['Soft suspension', 'Road noise']
    },
    {
      id: 4,
      name: 'Altroz',
      brand: 'Tata',
      image: '/cars/altroz.jpg',
      price: '₹6.60 - 10.74 Lakh',
      rating: 4.0,
      mileage: '25.11 kmpl',
      engine: '1199 cc',
      power: '85 bhp',
      torque: '113 Nm',
      fuelType: 'Petrol',
      transmission: 'Manual',
      seating: 5,
      bodyType: 'Hatchback',
      safetyRating: 5,
      features: ['Harman Infotainment', 'Ambient Lighting', 'Rain Sensing Wipers', 'Dual Airbags'],
      pros: ['5-star safety rating', 'Solid build', 'Good handling'],
      cons: ['AMT not available', 'Limited service network']
    }
  ]

  const filteredCars = availableCars.filter(car =>
    car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    car.brand.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const addCar = (car: Car) => {
    if (selectedCars.length < 4 && !selectedCars.find(c => c.id === car.id)) {
      setSelectedCars([...selectedCars, car])
      setShowCarSelector(false)
      setSearchQuery('')
    }
  }

  const removeCar = (carId: number) => {
    setSelectedCars(selectedCars.filter(car => car.id !== carId))
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <div className="space-y-6">
      {/* Car Selection */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Select Cars to Compare ({selectedCars.length}/4)
          </h2>
          <button
            onClick={() => setShowCarSelector(true)}
            disabled={selectedCars.length >= 4}
            className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>Add Car</span>
          </button>
        </div>

        {/* Selected Cars Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {selectedCars.map((car) => (
            <div key={car.id} className="relative border border-gray-200 rounded-lg p-4">
              <button
                onClick={() => removeCar(car.id)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="text-center">
                <div className="w-16 h-12 bg-gray-200 rounded mx-auto mb-2"></div>
                <h3 className="font-semibold text-sm text-gray-900">{car.brand} {car.name}</h3>
                <p className="text-xs text-gray-600">{car.price}</p>
              </div>
            </div>
          ))}
          
          {/* Empty slots */}
          {Array.from({ length: 4 - selectedCars.length }, (_, i) => (
            <div
              key={i}
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center min-h-[100px]"
            >
              <div className="text-center text-gray-500">
                <Plus className="h-6 w-6 mx-auto mb-1" />
                <span className="text-sm">Add Car</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Car Selector Modal */}
      {showCarSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Select a Car</h3>
                <button
                  onClick={() => setShowCarSelector(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search cars..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-96">
              <div className="space-y-3">
                {filteredCars.map((car) => (
                  <button
                    key={car.id}
                    onClick={() => addCar(car)}
                    disabled={selectedCars.find(c => c.id === car.id) !== undefined}
                    className="w-full flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <div className="w-16 h-12 bg-gray-200 rounded flex-shrink-0"></div>
                    <div className="flex-1 text-left">
                      <h4 className="font-semibold text-gray-900">{car.brand} {car.name}</h4>
                      <p className="text-sm text-gray-600">{car.price}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        {renderStars(Math.floor(car.rating))}
                        <span className="text-sm text-gray-500">({car.rating})</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Table */}
      {selectedCars.length > 1 && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Detailed Comparison</h2>
          </div>
          
          {/* Mobile Comparison - Stack Cards */}
          <div className="lg:hidden">
            {selectedCars.map((car, index) => (
              <div key={car.id} className="p-6 border-b border-gray-200 last:border-b-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {car.brand} {car.name}
                  </h3>
                  <button
                    onClick={() => removeCar(car.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Price</span>
                      <p className="font-semibold text-primary-600">{car.price}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Rating</span>
                      <div className="flex items-center space-x-1">
                        {renderStars(Math.floor(car.rating))}
                        <span className="text-sm">({car.rating})</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Mileage</span>
                      <p className="font-semibold">{car.mileage}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Engine</span>
                      <p className="font-semibold">{car.engine}</p>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-500 block mb-2">Key Features</span>
                    <div className="flex flex-wrap gap-2">
                      {car.features.slice(0, 3).map((feature, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Comparison - Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 font-semibold text-gray-900 w-48">Specification</th>
                  {selectedCars.map((car) => (
                    <th key={car.id} className="text-center p-4 min-w-48">
                      <div className="space-y-2">
                        <div className="w-20 h-16 bg-gray-200 rounded mx-auto"></div>
                        <h3 className="font-semibold text-gray-900">{car.brand} {car.name}</h3>
                        <button
                          onClick={() => removeCar(car.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-900">Price</td>
                  {selectedCars.map((car) => (
                    <td key={car.id} className="p-4 text-center font-semibold text-primary-600">
                      {car.price}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-900">Rating</td>
                  {selectedCars.map((car) => (
                    <td key={car.id} className="p-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        {renderStars(Math.floor(car.rating))}
                        <span className="text-sm ml-2">({car.rating})</span>
                      </div>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-900">Mileage</td>
                  {selectedCars.map((car) => (
                    <td key={car.id} className="p-4 text-center font-semibold">
                      {car.mileage}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-900">Engine</td>
                  {selectedCars.map((car) => (
                    <td key={car.id} className="p-4 text-center">{car.engine}</td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-900">Power</td>
                  {selectedCars.map((car) => (
                    <td key={car.id} className="p-4 text-center">{car.power}</td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-900">Transmission</td>
                  {selectedCars.map((car) => (
                    <td key={car.id} className="p-4 text-center">{car.transmission}</td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-900">Seating</td>
                  {selectedCars.map((car) => (
                    <td key={car.id} className="p-4 text-center">{car.seating} Seater</td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-900">Safety Rating</td>
                  {selectedCars.map((car) => (
                    <td key={car.id} className="p-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        {renderStars(car.safetyRating)}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pros & Cons */}
          <div className="p-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pros & Cons</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
              {selectedCars.map((car) => (
                <div key={car.id} className="space-y-4">
                  <h4 className="font-medium text-gray-900">{car.brand} {car.name}</h4>
                  
                  <div>
                    <h5 className="text-sm font-medium text-green-700 mb-2 flex items-center">
                      <Check className="h-4 w-4 mr-1" />
                      Pros
                    </h5>
                    <ul className="space-y-1">
                      {car.pros.map((pro, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-red-700 mb-2 flex items-center">
                      <Minus className="h-4 w-4 mr-1" />
                      Cons
                    </h5>
                    <ul className="space-y-1">
                      {car.cons.map((con, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start">
                          <span className="text-red-500 mr-2">•</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {selectedCars.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Start Comparing Cars
            </h3>
            <p className="text-gray-600 mb-6">
              Add cars to compare their specifications, features, and prices side by side
            </p>
            <button
              onClick={() => setShowCarSelector(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Add Your First Car
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
