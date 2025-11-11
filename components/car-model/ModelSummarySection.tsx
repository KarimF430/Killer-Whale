'use client'

import { useState } from 'react'

interface ModelSummarySectionProps {
  carName: string
  summaryData: {
    description: string[]
    exteriorDesign: string[]
    comfortConvenience: string[]
  }
}

export default function ModelSummarySection({ carName, summaryData }: ModelSummarySectionProps) {
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [showFullExterior, setShowFullExterior] = useState(false)
  const [showFullComfort, setShowFullComfort] = useState(false)

  const visibleDescription = showFullDescription ? summaryData.description : summaryData.description.slice(0, 1)
  const visibleExterior = showFullExterior ? summaryData.exteriorDesign : summaryData.exteriorDesign.slice(0, 1)
  const visibleComfort = showFullComfort ? summaryData.comfortConvenience : summaryData.comfortConvenience.slice(0, 1)

  return (
    <section className="py-8 bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-700 mb-6">
          {carName} Summary
        </h2>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
          {/* Description Section */}
          <div className="mb-5">
            <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center">
              <div className="w-1.5 h-1.5 bg-gray-600 rounded-full mr-2"></div>
              Description
            </h3>
            <div className="ml-4 space-y-2">
              {visibleDescription.map((paragraph, index) => (
                <p key={index} className="text-gray-700 text-sm leading-relaxed font-normal">
                  {paragraph}
                </p>
              ))}
              {summaryData.description.length > 1 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-red-500 hover:text-red-600 font-normal text-sm transition-colors"
                >
                  {showFullDescription ? 'Read Less' : 'Read More'}
                </button>
              )}
            </div>
          </div>

          {/* Exterior Design Section */}
          <div className="mb-5">
            <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center">
              <div className="w-1.5 h-1.5 bg-gray-600 rounded-full mr-2"></div>
              Exterior Design
            </h3>
            <div className="ml-4 space-y-2">
              {visibleExterior.map((paragraph, index) => (
                <p key={index} className="text-gray-700 text-sm leading-relaxed font-normal">
                  {paragraph}
                </p>
              ))}
              {summaryData.exteriorDesign.length > 1 && (
                <button
                  onClick={() => setShowFullExterior(!showFullExterior)}
                  className="text-red-500 hover:text-red-600 font-normal text-sm transition-colors"
                >
                  {showFullExterior ? 'Read Less' : 'Read More'}
                </button>
              )}
            </div>
          </div>

          {/* Comfort & Convenience Section */}
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center">
              <div className="w-1.5 h-1.5 bg-gray-600 rounded-full mr-2"></div>
              Comfort & Convenience
            </h3>
            <div className="ml-4 space-y-2">
              {visibleComfort.map((paragraph, index) => (
                <p key={index} className="text-gray-700 text-sm leading-relaxed font-normal">
                  {paragraph}
                </p>
              ))}
              {summaryData.comfortConvenience.length > 1 && (
                <button
                  onClick={() => setShowFullComfort(!showFullComfort)}
                  className="text-red-500 hover:text-red-600 font-normal text-sm transition-colors"
                >
                  {showFullComfort ? 'Read Less' : 'Read More'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
