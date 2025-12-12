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
  const { user, isAuthenticated, logout } = useAuth()

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

      <header className={`bg-white shadow-sm sticky top-0 z-50 transition-transform duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
        }`}>
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              {/* gadizone Lottie Logo */}
              <div className="w-16 h-16 flex items-center justify-center -mr-2">
                <dotlottie-wc
                  src="https://lottie.host/af28a44c-5cbb-476e-847a-5a453e6c82fd/pkioW7VK8s.lottie"
                  style={{ width: '64px', height: '64px' }}
                  autoplay
                  loop
                />
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
