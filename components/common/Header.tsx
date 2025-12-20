'use client'

import { useState } from 'react'
import { Search, Menu } from 'lucide-react'
import LocationHeader from './LocationHeader'
import Image from 'next/image'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - gadizone Logo */}
          <div className="flex items-center gap-2">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 24C8 24 10 18 14 18H34C38 18 40 24 40 24V30H8V24Z" fill="#14B8A6" />
              <path d="M14 18L16 14H32L34 18" fill="#14B8A6" />
              <rect x="10" y="24" width="28" height="6" fill="#14B8A6" />
              <path d="M17 18L18 15H30L31 18H17Z" fill="#0D9488" />
              <circle cx="16" cy="30" r="4" fill="#1F2937" />
              <circle cx="32" cy="30" r="4" fill="#1F2937" />
              <circle cx="16" cy="30" r="2" fill="#374151" />
              <circle cx="32" cy="30" r="2" fill="#374151" />
            </svg>
            <span className="text-2xl font-bold" style={{ color: '#FF6B35' }}>gadizone</span>
          </div>

          {/* Right side - Search, Location, Menu */}
          <div className="flex items-center space-x-2">
            {/* Search Icon */}
            <button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Search"
            >
              <Search className="h-6 w-6 text-gray-600" />
            </button>

            {/* Location Icon */}
            <LocationHeader />

            {/* Menu Burger */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors lg:hidden"
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (if needed) */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-2">
            <nav className="space-y-2">
              <a href="#" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
                New Cars
              </a>
              <a href="#" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
                Used Cars
              </a>
              <a href="#" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
                Reviews
              </a>
              <a href="#" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
                News
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
