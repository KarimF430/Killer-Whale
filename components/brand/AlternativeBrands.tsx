'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Brand {
  id: string
  name: string
  logo: string
  slug: string
}

interface AlternativeBrandsProps {
  currentBrand: string
  initialBrands?: any[]
}

export default function AlternativeBrands({ currentBrand, initialBrands = [] }: AlternativeBrandsProps) {
  const [showAllBrands, setShowAllBrands] = useState(false)

  // Transform backend brands to frontend format, excluding current brand
  const allBrands = initialBrands
    .filter((brand: any) => {
      const brandSlug = brand.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      return brand.status === 'active' && brandSlug !== currentBrand
    })
    .map((brand: any) => {
      return {
        id: brand.id,
        name: brand.name,
        logo: brand.logo ? (brand.logo.startsWith('http') ? brand.logo : `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}${brand.logo}`) : '/brands/default.png',
        slug: brand.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      }
    })

  return (
    <section className="py-6 sm:py-8 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">Alternative Brands</h2>

        {/* Brands Grid - Matching Home Page BrandSection */}
        <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
          {/* Show backend brands */}
          {(showAllBrands ? allBrands : allBrands.slice(0, 6)).map((brand) => (
            <Link
              key={brand.id}
              href={`/${brand.slug}-cars`}
              className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 p-4 text-center"
            >
              {/* Brand Logo */}
              <div className="h-16 flex items-center justify-center mb-3">
                {brand.logo && (brand.logo.startsWith('http') || brand.logo.startsWith('/uploads')) ? (
                  <img
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    className="w-12 h-12 object-contain"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.parentElement?.querySelector('.fallback-logo') as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`fallback-logo w-12 h-12 bg-gradient-to-r from-red-600 to-orange-500 rounded-lg flex items-center justify-center ${brand.logo && (brand.logo.startsWith('http') || brand.logo.startsWith('/uploads')) ? 'hidden' : ''}`}>
                  <span className="text-sm font-bold text-white">
                    {brand.name.split(' ').map((word: string) => word.charAt(0)).join('')}
                  </span>
                </div>
              </div>

              {/* Brand Name */}
              <h3 className="font-medium text-gray-900 text-sm">{brand.name}</h3>
            </Link>
          ))}
        </div>

        {/* Show All Brands Button */}
        <div className="text-center">
          <button
            onClick={() => setShowAllBrands(!showAllBrands)}
            className="inline-flex items-center bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white px-5 py-2.5 sm:px-8 sm:py-4 rounded-lg font-semibold text-sm sm:text-lg transition-all duration-200 shadow-md"
          >
            {showAllBrands ? (
              <>
                <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                <span className="hidden sm:inline">Show Less Brands</span>
                <span className="sm:hidden">Show Less</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                <span className="hidden sm:inline">Show All {allBrands.length} Brands</span>
                <span className="sm:hidden">Show All {allBrands.length} Brands</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  )
}
