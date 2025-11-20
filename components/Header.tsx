'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Menu, X, MapPin } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  // Handle scroll for header visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px
        setIsHeaderVisible(false)
      } else {
        // Scrolling up
        setIsHeaderVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <header className={`bg-white shadow-sm sticky top-0 z-50 transition-transform duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="flex items-center">
              {/* MotorOctane Logo */}
              <img
                src="/motoroctane-logo.png"
                alt="MotorOctane"
                className="h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
              />
              <span className="text-2xl font-bold text-gray-900 ml-2 group-hover:text-red-600 transition-colors">MotorOctane</span>
            </div>
          </Link>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-2">
            {/* Search Icon - Navigate to Search Page */}
            <Link
              href="/search"
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              aria-label="Search cars"
            >
              <Search className="h-5 w-5" />
            </Link>

            {/* Location Icon - Navigate to Location Page */}
            <Link
              href="/location"
              className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200"
              aria-label="Select location"
            >
              <MapPin className="h-5 w-5" />
            </Link>

            {/* Hamburger Menu */}
            <button
              onClick={toggleMenu}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="py-4 border-t border-gray-200 bg-white">
            <nav className="flex flex-col space-y-1">
              <Link
                href="/new-cars"
                className="text-gray-700 hover:text-red-600 hover:bg-red-50 font-medium py-3 px-4 rounded-lg transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                New Cars
              </Link>
              <Link
                href="/compare"
                className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 font-medium py-3 px-4 rounded-lg transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Compare Cars
              </Link>
              <Link
                href="/brands"
                className="text-gray-700 hover:text-red-600 hover:bg-red-50 font-medium py-3 px-4 rounded-lg transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Car Brands
              </Link>
              <Link
                href="/emi-calculator"
                className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 font-medium py-3 px-4 rounded-lg transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                EMI Calculator
              </Link>
              <Link
                href="/news"
                className="text-gray-700 hover:text-red-600 hover:bg-red-50 font-medium py-3 px-4 rounded-lg transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Car News
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
