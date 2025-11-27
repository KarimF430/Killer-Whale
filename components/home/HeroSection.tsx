'use client'

import { useState } from 'react'
import { Sparkles, Mic } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearchClick = () => {
    router.push('/ai-chat')
  }

  const handleVoiceClick = () => {
    router.push('/ai-chat')
  }

  return (
    <section className="bg-gradient-to-br from-red-600 to-orange-500 text-white py-8 sm:py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Hero Title */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-4">
            Find Your Perfect Car
          </h1>
        </div>

        {/* Search Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8">
            {/* Search Input */}
            <div className="relative mb-4 sm:mb-6">
              <input
                type="text"
                value={searchQuery}
                onClick={handleSearchClick}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Best car for family under 15 lakhs"
                className="w-full px-4 py-3 sm:px-6 sm:py-4 text-gray-900 placeholder-gray-500 text-sm sm:text-base lg:text-lg bg-gray-100 rounded-xl sm:rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-red-500 pr-14 sm:pr-20 cursor-pointer"
                aria-label="Search for cars with AI"
                readOnly
              />
              <div className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 sm:space-x-2">
                <button
                  onClick={handleVoiceClick}
                  className="p-2 sm:p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                  aria-label="Voice search"
                >
                  <Mic className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearchClick}
              className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-semibold py-3 px-6 sm:py-4 sm:px-8 rounded-xl sm:rounded-2xl transition-all duration-200 flex items-center justify-center space-x-2 sm:space-x-3 text-base sm:text-lg hover:shadow-xl"
            >
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
              <span>Start AI Search</span>
            </button>

            <p className="text-center text-gray-500 text-xs sm:text-sm mt-3 sm:mt-4 px-2">
              Our AI will ask you a few questions to find your perfect match
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
