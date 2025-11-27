'use client'

import Link from 'next/link'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState, useEffect } from 'react'
import brandApi, { FrontendBrand } from '@/lib/brand-api'

export default function BrandSection({ initialBrands = [] }: { initialBrands?: FrontendBrand[] }) {
  const [showAllBrands, setShowAllBrands] = useState(false)

  // Transform backend brands to match the display format
  const transformedBrands = initialBrands.map(brand => ({
    id: brand.id,
    name: brand.name,
    logo: brand.logo,
    slug: brand.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    modelCount: brand.models ? parseInt(brand.models.replace(/[^\d]/g, '')) || 8 : 8,
    startingPrice: brand.startingPrice
  }))

  // Use transformed brands
  const allBrands = transformedBrands

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">Popular Brands</h2>

      {/* Brands Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mb-6 sm:mb-8">
        {/* Show backend brands */}
        {(showAllBrands ? allBrands : allBrands.slice(0, 6)).map((brand) => (
          <Link
            key={brand.id}
            href={`/${brand.slug}-cars`}
            className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 p-3 sm:p-4 text-center"
          >
            {/* Brand Logo */}
            <div className="h-12 sm:h-16 flex items-center justify-center mb-2 sm:mb-3">
              {brand.logo && brand.logo.startsWith('http') ? (
                <img
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  width={48}
                  height={48}
                  loading="lazy"
                  className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                  onError={(e) => {
                    const target = e.currentTarget
                    target.style.display = 'none'
                    target.nextElementSibling?.classList.remove('hidden')
                  }}
                />
              ) : null}
              <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-red-600 to-orange-500 rounded-lg flex items-center justify-center ${brand.logo && brand.logo.startsWith('http') ? 'hidden' : ''}`}>
                <span className="text-xs sm:text-sm font-bold text-white">
                  {brand.name.split(' ').map((word: string) => word.charAt(0)).join('')}
                </span>
              </div>
            </div>

            {/* Brand Name */}
            <h3 className="font-medium text-gray-900 text-xs sm:text-sm">{brand.name}</h3>
          </Link>
        ))}
      </div>

      {/* Show All Brands Button */}
      <div className="text-center">
        <button
          onClick={() => setShowAllBrands(!showAllBrands)}
          className="inline-flex items-center bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold text-sm sm:text-base lg:text-lg transition-all duration-200 shadow-md"
        >
          {showAllBrands ? (
            <>
              <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              <span className="hidden sm:inline">Show All {allBrands.length} Brands</span>
              <span className="sm:hidden">All Brands</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
