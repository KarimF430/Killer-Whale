'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { Search, Menu, X, MapPin, LogOut, User as UserIcon, ChevronDown, ChevronUp } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

// Budget ranges for New Cars dropdown - matches home page CarsByBudget
const BUDGET_RANGES = [
  { label: 'Under ₹10 Lakh', slug: '10' },
  { label: '₹10-15 Lakh', slug: '15' },
  { label: '₹15-20 Lakh', slug: '20' },
  { label: '₹20-25 Lakh', slug: '25' },
  { label: '₹25-30 Lakh', slug: '30' },
  { label: '₹30-40 Lakh', slug: '40' },
  { label: '₹40-50 Lakh', slug: '50' },
  { label: '₹50-60 Lakh', slug: '60' },
  { label: '₹60-80 Lakh', slug: '80' },
  { label: '₹80L-1 Cr', slug: '1-crore' },
  { label: 'Above ₹1 Crore', slug: 'above-1-crore' },
]

// Body types for Top Selling dropdown - matches /top-cars/[bodyType] route
const BODY_TYPES = [
  { label: 'SUV', slug: 'suv' },
  { label: 'Sedan', slug: 'sedan' },
  { label: 'Hatchback', slug: 'hatchback' },
  { label: 'MUV/MPV', slug: 'muv' },
  { label: 'Luxury', slug: 'luxury' },
]

// Popular brands
const POPULAR_BRANDS = [
  { name: 'Maruti Suzuki', slug: 'maruti-suzuki' },
  { name: 'Hyundai', slug: 'hyundai' },
  { name: 'Tata', slug: 'tata' },
  { name: 'Mahindra', slug: 'mahindra' },
  { name: 'Kia', slug: 'kia' },
  { name: 'Toyota', slug: 'toyota' },
  { name: 'Honda', slug: 'honda' },
  { name: 'MG', slug: 'mg' },
  { name: 'Skoda', slug: 'skoda' },
  { name: 'Volkswagen', slug: 'volkswagen' },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [lottieLoaded, setLottieLoaded] = useState(false)
  const [isRevving, setIsRevving] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

  // Dropdown states
  const [newCarsOpen, setNewCarsOpen] = useState(false)
  const [topSellingOpen, setTopSellingOpen] = useState(false)
  const [brandsOpen, setBrandsOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)

  useEffect(() => {
    setIsRevving(true)
    const timer = setTimeout(() => setIsRevving(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isMenuOpen])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    if (isMenuOpen) {
      setNewCarsOpen(false)
      setTopSellingOpen(false)
      setBrandsOpen(false)
      setMoreOpen(false)
    }
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
    setNewCarsOpen(false)
    setTopSellingOpen(false)
    setBrandsOpen(false)
  }

  const handleLogout = async () => {
    try {
      await logout()
      closeMenu()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHeaderVisible(false)
      } else {
        setIsHeaderVisible(true)
      }
      setLastScrollY(currentScrollY)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <>
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

      <header className={`bg-white shadow-sm sticky top-0 z-50 transition-transform duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <div className="w-12 h-12 flex items-center justify-center relative">
                <svg width="48" height="32" viewBox="0 0 600 350" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
                  <g transform={`translate(0, 20) ${isRevving ? 'translate(1, -1)' : ''}`}>
                    {isRevving && (
                      <g transform="translate(430, 250)">
                        <circle cx="0" cy="0" r="20" fill="#9CA3AF" className="smoke-particle" style={{ animationDelay: '0s' }} />
                        <circle cx="15" cy="8" r="15" fill="#D1D5DB" className="smoke-particle" style={{ animationDelay: '0.1s' }} />
                        <circle cx="-8" cy="15" r="25" fill="#9CA3AF" className="smoke-particle" style={{ animationDelay: '0.2s' }} />
                      </g>
                    )}
                    <path d="M60 250 L60 190 Q60 160 100 160 L160 150 L230 90 L450 90 L510 160 L520 190 L520 250 L480 250 Q480 195 430 195 Q380 195 380 250 L220 250 Q220 195 170 195 Q120 195 120 250 L60 250 Z" fill="#14B8A6" />
                    <path d="M240 105 L440 105 L490 160 L260 160 Z" fill="#0D9488" opacity="0.3" />
                    <path d="M230 110 L180 160 L250 160 L250 110 Z" fill="#0D9488" opacity="0.3" />
                    <g className={isRevving ? "origin-[170px_250px] animate-[spin_0.1s_linear_infinite]" : ""}>
                      <circle cx="170" cy="250" r="48" fill="black" stroke="white" strokeWidth="8" />
                      <circle cx="170" cy="250" r="18" fill="#374151" />
                      <rect x="150" y="248" width="40" height="4" fill="#374151" rx="2" className={isRevving ? "opacity-50" : "opacity-0"} />
                      <rect x="168" y="230" width="4" height="40" fill="#374151" rx="2" className={isRevving ? "opacity-50" : "opacity-0"} />
                    </g>
                    <g className={isRevving ? "origin-[430px_250px] animate-[spin_0.1s_linear_infinite]" : ""}>
                      <circle cx="430" cy="250" r="48" fill="black" stroke="white" strokeWidth="8" />
                      <circle cx="430" cy="250" r="18" fill="#374151" />
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
              <Link href="/search" className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200" aria-label="Search cars">
                <Search className="h-5 w-5" />
              </Link>
              <Link href="/location" className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200" aria-label="Select location">
                <MapPin className="h-5 w-5" />
              </Link>
              <button onClick={toggleMenu} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200" aria-label={isMenuOpen ? "Close menu" : "Open menu"}>
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay - Slides from Bottom */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-[55] bg-black/40" onClick={closeMenu} />

          {/* Bottom Sheet Menu */}
          <div className="fixed bottom-0 left-0 right-0 z-[60] bg-white rounded-t-2xl shadow-2xl max-h-[85vh] overflow-y-auto animate-slideUp">
            {/* Handle bar */}
            <div className="sticky top-0 bg-white pt-3 pb-2 px-4 border-b border-gray-100 rounded-t-2xl">
              <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-2" />
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">Menu</span>
                <button onClick={closeMenu} className="p-1 text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <nav className="px-4 py-3 flex flex-col space-y-1">

              {/* New Cars Dropdown */}
              <div>
                <button onClick={() => setNewCarsOpen(!newCarsOpen)} className="w-full flex items-center justify-between text-gray-700 hover:text-orange-600 hover:bg-orange-50 font-medium py-2.5 px-4 rounded-lg transition-all">
                  <span>New Cars</span>
                  {newCarsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {newCarsOpen && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-orange-200 pl-4">
                    {BUDGET_RANGES.map((range) => (
                      <Link key={range.slug} href={`/best-cars-under-${range.slug}-lakh`} className="block text-gray-600 hover:text-orange-600 py-2 text-sm" onClick={closeMenu}>
                        {range.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Top Selling Dropdown */}
              <div>
                <button onClick={() => setTopSellingOpen(!topSellingOpen)} className="w-full flex items-center justify-between text-gray-700 hover:text-orange-600 hover:bg-orange-50 font-medium py-2.5 px-4 rounded-lg transition-all">
                  <span>Top Selling Cars</span>
                  {topSellingOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {topSellingOpen && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-orange-200 pl-4">
                    <Link href="/top-selling-cars-in-india" className="block text-gray-600 hover:text-orange-600 py-2 text-sm font-medium" onClick={closeMenu}>All Top Selling</Link>
                    {BODY_TYPES.map((type) => (
                      <Link key={type.slug} href={`/top-cars/${type.slug}`} className="block text-gray-600 hover:text-orange-600 py-2 text-sm" onClick={closeMenu}>
                        {type.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Brands Dropdown */}
              <div>
                <button onClick={() => setBrandsOpen(!brandsOpen)} className="w-full flex items-center justify-between text-gray-700 hover:text-orange-600 hover:bg-orange-50 font-medium py-2.5 px-4 rounded-lg transition-all">
                  <span>Cars by Brands</span>
                  {brandsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {brandsOpen && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-orange-200 pl-4 max-h-48 overflow-y-auto">
                    {POPULAR_BRANDS.map((brand) => (
                      <Link key={brand.slug} href={`/${brand.slug}-cars`} className="block text-gray-600 hover:text-orange-600 py-2 text-sm" onClick={closeMenu}>
                        {brand.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 my-2"></div>

              <Link href="/news" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 font-medium py-2.5 px-4 rounded-lg" onClick={closeMenu}>Latest News</Link>
              <Link href="/compare" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 font-medium py-2.5 px-4 rounded-lg" onClick={closeMenu}>Compare Cars</Link>

              <div className="border-t border-gray-200 my-2"></div>

              <Link href="/fuel-cost-calculator" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 font-medium py-2.5 px-4 rounded-lg" onClick={closeMenu}>Fuel Calculator</Link>
              <Link href="/emi-calculator" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 font-medium py-2.5 px-4 rounded-lg" onClick={closeMenu}>EMI Calculator</Link>
              <Link href="/location" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 font-medium py-2.5 px-4 rounded-lg" onClick={closeMenu}>Know On-Road Price</Link>

              {/* View More Dropdown */}
              <div>
                <button onClick={() => setMoreOpen(!moreOpen)} className="w-full flex items-center justify-between text-gray-700 hover:text-orange-600 hover:bg-orange-50 font-medium py-2.5 px-4 rounded-lg transition-all">
                  <span>View More</span>
                  {moreOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {moreOpen && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-orange-200 pl-4">
                    <Link href="/about-us" className="block text-gray-600 hover:text-orange-600 py-2 text-sm" onClick={closeMenu}>About Us</Link>
                    <Link href="/contact-us" className="block text-gray-600 hover:text-orange-600 py-2 text-sm" onClick={closeMenu}>Contact Us</Link>
                    <Link href="/feedback" className="block text-gray-600 hover:text-orange-600 py-2 text-sm" onClick={closeMenu}>Feedback</Link>
                    <Link href="/privacy-policy" className="block text-gray-600 hover:text-orange-600 py-2 text-sm" onClick={closeMenu}>Privacy Policy</Link>
                  </div>
                )}
              </div>

              {/* Login/User */}
              {isAuthenticated && user ? (
                <div className="border-t border-gray-200 pt-3 mt-2">
                  <div className="px-4 py-2 text-gray-600 text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <UserIcon className="h-5 w-5" />
                      <span>{user.firstName} {user.lastName}</span>
                    </div>
                  </div>
                  <button onClick={handleLogout} className="w-full text-left text-gray-700 hover:text-red-600 hover:bg-red-50 font-medium py-3 px-4 rounded-lg flex items-center space-x-2">
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <Link href="/login" className="text-white bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 font-medium py-2.5 px-4 rounded-lg text-center shadow-md mt-3" onClick={closeMenu}>
                  Login
                </Link>
              )}
            </nav>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  )
}
