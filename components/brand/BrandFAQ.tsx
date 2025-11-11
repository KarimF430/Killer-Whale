'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { FrontendBrand } from '@/lib/brand-api'
import { renderTextWithCarLinks, useCarModelsData } from '@/lib/faq-hyperlinks'

interface FAQ {
  question: string
  answer: string
}

interface BrandFAQProps {
  brandName: string
  brandId?: string
}

export default function BrandFAQ({ brandName, brandId }: BrandFAQProps) {
  const [openFAQ, setOpenFAQ] = useState<string | null>(null)
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Load car models for hyperlink generation
  useCarModelsData()

  useEffect(() => {
    const fetchBrandFAQs = async () => {
      try {
        setLoading(true)
        console.log('🚀 BrandFAQ: Starting FAQ fetch for brand:', brandName, 'ID:', brandId)
        
        // First, get all brands to find the brand by name
        const response = await fetch('/api/brands', {
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache'
          }
        })
        
        console.log('📡 BrandFAQ: Response status:', response.status)
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const result = await response.json()
        console.log('📊 BrandFAQ: Full API result:', JSON.stringify(result, null, 2))
        
        if (result.success && result.data && Array.isArray(result.data)) {
          console.log('🔍 BrandFAQ: Searching for brand:', brandName, 'in', result.data.length, 'brands')
          
          // Find the brand by name (case-insensitive)
          const brand = result.data.find((b: FrontendBrand) => {
            const match = b.name.toLowerCase() === brandName.toLowerCase() ||
                         b.name.toLowerCase().includes(brandName.toLowerCase())
            console.log(`🔍 Comparing "${b.name}" with "${brandName}": ${match}`)
            return match
          })
          
          console.log('🎯 BrandFAQ: Found brand:', brand)
          
          if (brand) {
            console.log('📋 BrandFAQ: Brand FAQs:', brand.faqs)
            if (brand.faqs && Array.isArray(brand.faqs) && brand.faqs.length > 0) {
              setFaqs(brand.faqs)
              console.log(`✅ BrandFAQ: Successfully loaded ${brand.faqs.length} FAQs for ${brand.name}`)
            } else {
              console.log(`⚠️ BrandFAQ: Brand found but no FAQs available`)
              setFaqs([])
            }
          } else {
            console.log(`❌ BrandFAQ: Brand "${brandName}" not found in API response`)
            setFaqs([])
          }
        } else {
          throw new Error(result.error || 'Invalid API response format')
        }
      } catch (err) {
        console.error('❌ BrandFAQ: Error fetching FAQs:', err)
        setError(err instanceof Error ? err.message : 'Failed to load FAQs')
        setFaqs([])
      } finally {
        setLoading(false)
      }
    }

    if (brandName) {
      fetchBrandFAQs()
    } else {
      console.log('⚠️ BrandFAQ: No brand name provided')
      setLoading(false)
    }
  }, [brandName, brandId])

  const toggleFAQ = (faqId: string) => {
    setOpenFAQ(openFAQ === faqId ? null : faqId)
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {brandName} FAQ
          </h2>
          <p className="text-base text-gray-600">
            {loading ? 'Loading FAQs from backend...' : 
             error ? `Error: ${error}` :
             faqs.length > 0 ? `${faqs.length} questions about ${brandName} cars` : 
             'No FAQs available from backend'}
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-red-600 mb-4">⚠️ {error}</div>
            <p className="text-gray-600">Unable to load FAQs at this time.</p>
          </div>
        ) : faqs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">
              No FAQs available for {brandName} yet. Check back soon for answers to common questions!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleFAQ(index.toString())}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                  {openFAQ === index.toString() ? (
                    <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                
                {openFAQ === index.toString() && (
                  <div className="px-6 pb-4">
                    <div className="border-t border-gray-100 pt-4">
                      <div className="text-gray-600 leading-relaxed">
                        {renderTextWithCarLinks(faq.answer, brandName)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
