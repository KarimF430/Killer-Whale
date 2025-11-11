'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, FileText } from 'lucide-react'

interface CarData {
  fullName: string
  brand: string
  model: string
}

interface ModelSummarySEOProps {
  carData: CarData
}

export default function ModelSummarySEO({ carData }: ModelSummarySEOProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const summaryContent = {
    shortSummary: `The ${carData.fullName} is a premium hatchback that combines style, performance, and efficiency. With its modern design, advanced features, and reliable engine, it offers an exceptional driving experience for urban commuters and families alike.`,
    
    fullSummary: `The ${carData.fullName} stands as one of India's most popular and trusted hatchbacks, representing the perfect blend of contemporary design, advanced technology, and proven reliability. Since its launch, this model has consistently been a top choice for Indian car buyers seeking a compact yet feature-rich vehicle.

**Design and Styling**
The ${carData.fullName} features a bold and contemporary exterior design with sharp character lines, a distinctive front grille, and modern LED lighting elements. The aerodynamic profile not only enhances its visual appeal but also contributes to improved fuel efficiency. The interior showcases a well-thought-out layout with premium materials, ergonomic seating, and intuitive controls that create a comfortable and user-friendly environment.

**Performance and Engine**
Under the hood, the ${carData.fullName} is powered by a refined 1.2-liter petrol engine that delivers an optimal balance of power and fuel efficiency. The engine produces adequate power for city driving while maintaining excellent fuel economy of over 23 kmpl. The smooth transmission options, including both manual and AMT variants, cater to different driving preferences and traffic conditions.

**Technology and Features**
The ${carData.fullName} comes equipped with modern technology features including the SmartPlay Pro+ infotainment system with a touchscreen display, smartphone connectivity through Android Auto and Apple CarPlay, and various convenience features like push-button start, automatic climate control, and cruise control in higher variants.

**Safety and Security**
Safety is a priority in the ${carData.fullName} with standard features including dual front airbags, ABS with EBD, electronic stability program, and a strong body structure. The vehicle has received good safety ratings, making it a reliable choice for families.

**Value Proposition**
The ${carData.fullName} offers excellent value for money with its combination of features, reliability, and strong resale value. The wide service network and affordable maintenance costs make it an economical choice for long-term ownership. Whether you're a first-time car buyer or looking to upgrade, the ${carData.fullName} provides a compelling package that meets diverse needs and preferences.`
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <FileText className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {carData.fullName} - Model Summary
          </h2>
          <p className="text-gray-600">
            Comprehensive overview and detailed analysis
          </p>
        </div>
      </div>

      {/* Short Summary */}
      <div className="prose prose-gray max-w-none mb-6">
        <p className="text-gray-700 leading-relaxed text-lg">
          {summaryContent.shortSummary}
        </p>
      </div>

      {/* Expandable Full Summary */}
      <div className="border-t border-gray-200 pt-6">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left mb-4 hover:bg-gray-50 p-3 rounded-lg transition-colors"
        >
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Detailed Analysis & Review
            </h3>
            <p className="text-sm text-gray-600">
              In-depth information about design, performance, features, and value
            </p>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
          )}
        </button>

        {isExpanded && (
          <div className="prose prose-gray max-w-none">
            <div className="text-gray-700 leading-relaxed space-y-4">
              {summaryContent.fullSummary.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  // Handle bold headers
                  const headerText = paragraph.replace(/\*\*/g, '')
                  return (
                    <h4 key={index} className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                      {headerText}
                    </h4>
                  )
                } else {
                  return (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  )
                }
              })}
            </div>
          </div>
        )}
      </div>

      {/* Key Highlights */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Highlights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">23+</p>
              <p className="text-sm text-blue-700">kmpl Mileage</p>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">4.5</p>
              <p className="text-sm text-green-700">Safety Rating</p>
            </div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">7</p>
              <p className="text-sm text-orange-700">Variants</p>
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">5</p>
              <p className="text-sm text-purple-700">Seating</p>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Tags */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs font-bold">SEO</span>
          </div>
          <div>
            <p className="text-sm text-gray-700 font-medium mb-2">
              Related Keywords & Topics
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                `${carData.brand} ${carData.model}`,
                `${carData.model} price`,
                `${carData.model} mileage`,
                `${carData.model} review`,
                `${carData.model} specifications`,
                `${carData.model} variants`,
                `${carData.model} colors`,
                `${carData.model} features`,
                'hatchback cars',
                'fuel efficient cars',
                'family cars',
                'city cars'
              ].map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
