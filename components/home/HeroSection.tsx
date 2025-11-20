'use client'

import { useState } from 'react'
import { Search, Mic } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleInputClick = () => {
    // Navigate to search page immediately when input is clicked
    router.push('/search')
  }

  return (
    <section className="bg-gradient-to-br from-red-600 to-orange-500 text-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Find Your Perfect Car
          </h1>
        </div>

        {/* Search Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            {/* Search Input */}
            <div className="relative mb-6">
              <input
                type="text"
                value={searchQuery}
                onClick={handleInputClick}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Cars"
                className="w-full px-6 py-4 text-gray-900 placeholder-gray-500 text-lg bg-gray-100 rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-red-500 pr-20 cursor-pointer"
                aria-label="Search for cars"
                readOnly
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                <button
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                  aria-label="Voice search"
                >
                  <Mic className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Search Button */}
            <button
              onClick={handleInputClick}
              className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-200 flex items-center justify-center space-x-3 text-lg"
            >
              <Search className="h-6 w-6" />
              <span>Search Cars</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
