'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { Search, Menu, X, MapPin, LogOut, User as UserIcon } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'


export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [lottieLoaded, setLottieLoaded] = useState(false)
  const [isRevving, setIsRevving] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

  useEffect(() => {
    // Start revving on mount
    setIsRevving(true)
    // Stop after 2 seconds
    const timer = setTimeout(() => setIsRevving(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const handleLogout = async () => {
    try {
      await logout()
      setIsMenuOpen(false)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

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
    <>
      {/* Load dotLottie web component script */}
      <Script
        src="https://unpkg.com/@lottiefiles/dotlottie-wc@0.8.11/dist/dotlottie-wc.js"
        type="module"
        onLoad={() => setLottieLoaded(true)}
      />

      <style jsx global>{`
        @keyframes smoke {
          0% { opacity: 0.8; transform: scale(0.5) translate(0, 0); }
          100% { opacity: 0; transform: scale(2.5) translate(-30px, -20px); }
        }
        .smoke-particle {
          animation: smoke 0.8s ease-out infinite;
          transform-origin: center;
        }
      `}</style>
      <header className={`bg-white shadow-sm sticky top-0 z-50 transition-transform duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
        }`}>
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              {/* Car Icon */}
              <div className="w-12 h-12 flex items-center justify-center relative">
                <svg width="48" height="32" viewBox="0 0 600 350" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
                  <g transform={`translate(0, 20) ${isRevving ? 'translate(1, -1)' : ''}`}>
                    {/* Smoke Particles - Only visible when revving */}
                    {isRevving && (
                      <g transform="translate(430, 250)">
                        <circle cx="0" cy="0" r="20" fill="#9CA3AF" className="smoke-particle" style={{ animationDelay: '0s' }} />
                        <circle cx="15" cy="8" r="15" fill="#D1D5DB" className="smoke-particle" style={{ animationDelay: '0.1s' }} />
                        <circle cx="-8" cy="15" r="25" fill="#9CA3AF" className="smoke-particle" style={{ animationDelay: '0.2s' }} />
                      </g>
                    )}

                    {/* Car Body - More defined hatchback shape */}
                    <path d="M60 250 L60 190 Q60 160 100 160 L160 150 L230 90 L450 90 L510 160 L520 190 L520 250 L480 250 Q480 195 430 195 Q380 195 380 250 L220 250 Q220 195 170 195 Q120 195 120 250 L60 250 Z"
                      fill="#14B8A6" />

                    {/* Windows - unified side profile */}
                    <path d="M240 105 L440 105 L490 160 L260 160 Z" fill="#0D9488" opacity="0.3" />
                    <path d="M230 110 L180 160 L250 160 L250 110 Z" fill="#0D9488" opacity="0.3" />

                    {/* Wheels */}
                    <g className={isRevving ? "origin-[170px_250px] animate-[spin_0.1s_linear_infinite]" : ""}>
                      <circle cx="170" cy="250" r="48" fill="black" stroke="white" strokeWidth="8" />
                      <circle cx="170" cy="250" r="18" fill="#374151" />
                      {/* Spokes for spin visibility */}
                      <rect x="150" y="248" width="40" height="4" fill="#374151" rx="2" className={isRevving ? "opacity-50" : "opacity-0"} />
                      <rect x="168" y="230" width="4" height="40" fill="#374151" rx="2" className={isRevving ? "opacity-50" : "opacity-0"} />
                    </g>

                    <g className={isRevving ? "origin-[430px_250px] animate-[spin_0.1s_linear_infinite]" : ""}>
                      <circle cx="430" cy="250" r="48" fill="black" stroke="white" strokeWidth="8" />
                      <circle cx="430" cy="250" r="18" fill="#374151" />
                      {/* Spokes for spin visibility */}
                      <rect x="410" y="248" width="40" height="4" fill="#374151" rx="2" className={isRevving ? "opacity-50" : "opacity-0"} />
                      <rect x="428" y="230" width="4" height="40" fill="#374151" rx="2" className={isRevving ? "opacity-50" : "opacity-0"} />
                    </g>
                  </g>
                </svg>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent group-hover:from-red-700 group-hover:to-orange-600 transition-all">gadizone</span>
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
                  href="/compare"
                  className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 font-medium py-3 px-4 rounded-lg transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Compare Cars
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

                {/* Login / User Profile */}
                {isAuthenticated && user ? (
                  <div className="border-t border-gray-200 pt-3 mt-2">
                    <div className="px-4 py-2 text-gray-600 text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <UserIcon className="h-5 w-5" />
                        <span>{user.firstName} {user.lastName}</span>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left text-gray-700 hover:text-red-600 hover:bg-red-50 font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center space-x-2"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="text-white bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 font-medium py-3 px-4 rounded-lg transition-all duration-200 text-center shadow-md hover:shadow-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  )
}
