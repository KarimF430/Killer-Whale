'use client'

import { useState } from 'react'
import CarProductBox from './CarProductBox'
import { ChevronLeft, ChevronRight, Grid, List } from 'lucide-react'

interface CarData {
  id: number
  brand: string
  model: string
  fullName: string
  image: string
  priceRange: string
  startingPrice: number
  rating: number
  reviewCount: number
  mileage: string
  seating: number
  fuelType: string
  transmission: string
  keyFeatures: string[]
  badge?: string
  isNew?: boolean
  isPopular?: boolean
}

interface CarGridProps {
  cars: CarData[]
  title?: string
  showPagination?: boolean
  itemsPerPage?: number
  gridCols?: 2 | 3 | 4
  showViewToggle?: boolean
  className?: string
}

export default function CarGrid({
  cars,
  title,
  showPagination = false,
  itemsPerPage = 12,
  gridCols = 3,
  showViewToggle = false,
  className = ''
}: CarGridProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const totalPages = Math.ceil(cars.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentCars = showPagination ? cars.slice(startIndex, endIndex) : cars

  const gridColsClass = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of grid
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className={`${className}`}>
      {/* Header */}
      {(title || showViewToggle) && (
        <div className="flex items-center justify-between mb-6">
          {title && (
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          )}
          
          {showViewToggle && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Cars Grid/List */}
      {viewMode === 'grid' ? (
        <div className={`grid gap-6 ${gridColsClass[gridCols]}`}>
          {currentCars.map((car) => (
            <CarProductBox
              key={car.id}
              car={car}
              size="medium"
              showCompare={true}
              showWishlist={true}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {currentCars.map((car) => (
            <CarProductBox
              key={car.id}
              car={car}
              size="large"
              showCompare={true}
              showWishlist={true}
              className="w-full"
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {cars.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Grid className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No cars found</h3>
          <p className="text-gray-600">Try adjusting your filters or search criteria.</p>
        </div>
      )}

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            // Show first page, last page, current page, and pages around current
            const showPage = 
              page === 1 || 
              page === totalPages || 
              (page >= currentPage - 1 && page <= currentPage + 1)

            if (!showPage) {
              // Show ellipsis for gaps
              if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <span key={page} className="px-2 text-gray-400">
                    ...
                  </span>
                )
              }
              return null
            }

            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            )
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Results Info */}
      {showPagination && (
        <div className="text-center mt-4 text-sm text-gray-600">
          Showing {startIndex + 1}-{Math.min(endIndex, cars.length)} of {cars.length} cars
        </div>
      )}
    </div>
  )
}
