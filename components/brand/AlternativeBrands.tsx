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
}

export default function AlternativeBrands({ currentBrand }: AlternativeBrandsProps) {
  const [showAllBrands, setShowAllBrands] = useState(false)
  const [allBrands, setAllBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true)
        console.log('🚀 AlternativeBrands: Fetching brands...')
        
        // Fetch brands from backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}/api/brands`)
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const brands = await response.json()
        console.log('📊 AlternativeBrands: Raw brands data:', brands)
        
        if (!Array.isArray(brands)) {
          throw new Error('Invalid response format')
        }
        
        // Transform backend brands to frontend format, excluding current brand
        const transformedBrands = brands
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
          // Keep original backend order (by ranking)
        
        setAllBrands(transformedBrands)
        console.log('✅ AlternativeBrands: Loaded brands:', transformedBrands.length)
      } catch (err) {
        console.error('❌ AlternativeBrands: Error:', err)
        setError(err instanceof Error ? err.message : 'Failed to load brands')
      } finally {
        setLoading(false)
      }
    }

    fetchBrands()
  }, [currentBrand])

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Alternative Brands</h2>
        
        {/* Brands Grid */}
        {loading ? (
          <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 text-center animate-pulse">
                <div className="h-16 flex items-center justify-center mb-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
            {/* Show only backend brands */}
            {(showAllBrands ? allBrands : allBrands.slice(0, 6)).map((brand) => (
              <Link
                key={brand.id}
                href={`/${brand.slug}-cars`}
                className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 p-3 text-center"
              >
                {/* Brand Logo */}
                <div className="h-14 flex items-center justify-center mb-2">
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
        )}

        {/* Show All Brands Button */}
        <div className="text-center">
          <button
            onClick={() => setShowAllBrands(!showAllBrands)}
            className="inline-flex items-center bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-md"
          >
            {showAllBrands ? (
              <>
                <ChevronUp className="h-5 w-5 mr-2" />
                Show Less Brands
              </>
            ) : (
              <>
                <ChevronDown className="h-5 w-5 mr-2" />
                Show All {allBrands.length} Brands
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  )
}
