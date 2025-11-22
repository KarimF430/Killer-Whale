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
  initialBrand?: any
}

export default function BrandFAQ({ brandName, brandId, initialBrand }: BrandFAQProps) {
  const [openFAQ, setOpenFAQ] = useState<string | null>(null)

  // Load car models for hyperlink generation
  useCarModelsData()

  // Use FAQs from initial brand or empty array
  const faqs: FAQ[] = initialBrand?.faqs || []

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
            {faqs.length > 0 ? `${faqs.length} questions about ${brandName} cars` : 'No FAQs available'}
          </p>
        </div>

        {faqs.length === 0 ? (
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
