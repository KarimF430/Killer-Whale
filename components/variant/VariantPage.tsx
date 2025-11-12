'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { truncateCarName } from '@/lib/text-utils'
import { formatPrice, formatPriceRange } from '@/utils/priceFormatter'
import { Heart, Star, Share2, ChevronDown, ChevronRight, Calendar, Users, Fuel, ChevronLeft, Clock, Eye, MessageCircle, ArrowRight, Play, ExternalLink, ThumbsUp, Phone, CheckCircle } from 'lucide-react'
import Footer from '../Footer'
import PageSection from '../common/PageSection'
import AdBanner from '../home/AdBanner'
import { useOnRoadPrice } from '@/hooks/useOnRoadPrice'
import VariantCard from '../car-model/VariantCard'
import UpcomingCars from '../home/UpcomingCars'
import NewLaunchedCars from '../home/NewLaunchedCars'

interface VariantData {
  brand: string
  model: string
  variant: string
  fullName: string
  price: number
  originalPrice: number
  savings: number
  fuelType: string
  transmission: string
  seating: number
  mileage: number
  engine: string
  power: string
  torque: string
  rating: number
  reviewCount: number
  launchYear: number
  description: string
  images: string[]
  highlights: string[]
  cities: Array<{
    id: number
    name: string
  }>
}

interface VariantPageProps {
  brandName: string
  modelName: string
  variantName: string
}

// Mock variant data
const mockVariantData = {
  brand: "Renault",
  model: "Kwid",
  variant: "LXI",
  fullName: "Renault Kwid LXI",
  price: 8.00,
  originalPrice: 9.50,
  savings: 1.50,
  fuelType: "Petrol",
  transmission: "Manual",
  seating: 5,
  mileage: 22.3,
  engine: "1.0L",
  power: "68 PS",
  torque: "91 Nm",
  launchYear: 2015,
  rating: 4.2,
  reviewCount: 1234,
  description: "The Renault Kwid is a compact hatchback that offers excellent fuel efficiency, modern features, and a spacious interior. Perfect for city driving with its compact dimensions and easy maneuverability.",
  images: [
    "/api/placeholder/800/600",
    "/api/placeholder/800/600", 
    "/api/placeholder/800/600",
    "/api/placeholder/800/600"
  ],
  highlights: [
    'Best-in-class fuel efficiency',
    'Spacious cabin design',
    'Advanced safety features',
    'Modern infotainment system'
  ],
  cities: [
    { id: 1, name: "Delhi" },
    { id: 2, name: "Mumbai" },
    { id: 3, name: "Bangalore" },
    { id: 4, name: "Chennai" }
  ]
}

const navigationSections = [
  { id: 'overview', label: 'Overview' },
  { id: 'highlights', label: 'Key & Features' },
  { id: 'specifications', label: 'Specifications' },
  { id: 'variants', label: 'Variants' },
  { id: 'offers', label: 'Offers' },
  { id: 'expert-review', label: 'Expert Review' }
]

export default function VariantPage({ 
  variantData = mockVariantData,
  brandName,
  modelName,
  variantName
}: { 
  variantData?: VariantData,
  brandName?: string,
  modelName?: string,
  variantName?: string
}) {
  const router = useRouter()
  const [expandedSpecs, setExpandedSpecs] = useState<Record<string, boolean>>({})
  const [activeSection, setActiveSection] = useState('')
  const [isSticky, setIsSticky] = useState(false)
  const [activeFilter, setActiveFilter] = useState('All')
  const [isLiked, setIsLiked] = useState(false)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState(variantData.variant)
  const [selectedCity, setSelectedCity] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedCity = localStorage.getItem('selectedCity')
      if (savedCity) return savedCity
    }
    return 'Delhi'
  })
  const [showVariantDropdown, setShowVariantDropdown] = useState(false)
  const [showCityDropdown, setShowCityDropdown] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showSummaryDescription, setShowSummaryDescription] = useState(false)
  const [showSummaryExterior, setShowSummaryExterior] = useState(false)
  const [showSummaryComfort, setShowSummaryComfort] = useState(false)
  const [expandedEngine, setExpandedEngine] = useState<boolean>(false)
  
  // Backend data fetching states
  const [variant, setVariant] = useState<any>(null)
  const [model, setModel] = useState<any>(null)
  const [brand, setBrand] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [initialLoad, setInitialLoad] = useState(true)
  const [allModelVariants, setAllModelVariants] = useState<any[]>([])
  
  const variantDropdownRef = useRef<HTMLDivElement>(null)
  const cityDropdownRef = useRef<HTMLDivElement>(null)

  // Optimized data fetching - fetch only what we need
  useEffect(() => {
    const fetchData = async () => {
      if (!brandName || !modelName || !variantName) {
        setLoading(false)
        return
      }
      
      try {
        setLoading(true)
        setError(null)
        
        // First, find the brand to get brandId
        const brandsResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}/api/brands`)
        if (!brandsResponse.ok) throw new Error('Failed to fetch brands')
        const brands = await brandsResponse.json()
        
        const foundBrand = brands.find((b: any) => 
          b.name.toLowerCase().replace(/\s+/g, '-') === brandName.toLowerCase()
        )
        
        if (!foundBrand) {
          setError('Brand not found')
          return
        }
        
        // Then fetch models for this brand only
        const modelsResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}/api/models?brandId=${foundBrand.id}`)
        if (!modelsResponse.ok) throw new Error('Failed to fetch models')
        const models = await modelsResponse.json()
        
        const foundModel = models.find((m: any) => 
          m.name.toLowerCase().replace(/\s+/g, '-') === modelName.toLowerCase()
        )
        
        if (!foundModel) {
          setError('Model not found')
          return
        }
        
        // Finally fetch variants for this model only
        const variantsResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}/api/variants?modelId=${foundModel.id}`)
        if (!variantsResponse.ok) throw new Error('Failed to fetch variants')
        const variants = await variantsResponse.json()
        
        // Store all variants for the More Variants section
        setAllModelVariants(variants)
        
        // Find variant with flexible matching
        // Normalize both the variant name from URL and database for comparison
        const normalizeForMatch = (str: string) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        const normalizedVariantName = normalizeForMatch(variantName)
        
        console.log('Looking for variant:', variantName)
        console.log('Normalized variant name:', normalizedVariantName)
        console.log('Available variants:', variants.map((v: any) => ({ name: v.name, normalized: normalizeForMatch(v.name) })))
        
        let foundVariant = variants.find((v: any) => 
          normalizeForMatch(v.name) === normalizedVariantName
        )
        
        if (!foundVariant) {
          // Try partial matching
          foundVariant = variants.find((v: any) => 
            normalizeForMatch(v.name).includes(normalizedVariantName) ||
            normalizedVariantName.includes(normalizeForMatch(v.name))
          )
        }
        
        if (!foundVariant && variants.length > 0) {
          console.warn('Variant not found, using first variant as fallback')
          foundVariant = variants[0] // Use first variant as fallback
        }
        
        console.log('Found variant:', foundVariant?.name)

        setBrand(foundBrand)
        setModel(foundModel)
        setVariant(foundVariant)
        
        if (!foundVariant) {
          setError('Variant not found')
        } else {
          console.log('VariantPage: Successfully found variant:', foundVariant.name)
          console.log('VariantPage: Variant highlightImages:', foundVariant.highlightImages)
          console.log('VariantPage: Variant highlightImages count:', foundVariant.highlightImages?.length || 0)
          console.log('VariantPage: Comfort & Convenience specs:', {
            ventilatedSeats: foundVariant.ventilatedSeats,
            sunroof: foundVariant.sunroof,
            airPurifier: foundVariant.airPurifier,
            cruiseControl: foundVariant.cruiseControl,
            rainSensingWipers: foundVariant.rainSensingWipers,
            automaticHeadlamp: foundVariant.automaticHeadlamp,
            followMeHomeHeadlights: foundVariant.followMeHomeHeadlights,
            ignition: foundVariant.ignition,
            ambientLighting: foundVariant.ambientLighting,
            airConditioning: foundVariant.airConditioning,
            climateZones: foundVariant.climateZones,
            rearACVents: foundVariant.rearACVents,
            frontArmrest: foundVariant.frontArmrest
          })
          console.log('VariantPage: Safety specs:', {
            globalNCAPRating: foundVariant.globalNCAPRating,
            airbags: foundVariant.airbags,
            airbagsLocation: foundVariant.airbagsLocation,
            adasLevel: foundVariant.adasLevel,
            reverseCamera: foundVariant.reverseCamera
          })
          console.log('VariantPage: Entertainment & Connectivity specs:', {
            touchScreenInfotainment: foundVariant.touchScreenInfotainment,
            androidAppleCarplay: foundVariant.androidAppleCarplay,
            speakers: foundVariant.speakers,
            wirelessCharging: foundVariant.wirelessCharging
          })
          console.log('VariantPage: Engine & Transmission specs:', {
            engineNamePage4: foundVariant.engineNamePage4,
            engineCapacity: foundVariant.engineCapacity,
            fuel: foundVariant.fuel,
            transmission: foundVariant.transmission,
            maxPower: foundVariant.maxPower
          })
          console.log('VariantPage: Seating Comfort specs:', {
            seatUpholstery: foundVariant.seatUpholstery,
            seatsAdjustment: foundVariant.seatsAdjustment,
            driverSeatAdjustment: foundVariant.driverSeatAdjustment,
            passengerSeatAdjustment: foundVariant.passengerSeatAdjustment,
            rearSeatAdjustment: foundVariant.rearSeatAdjustment,
            welcomeSeats: foundVariant.welcomeSeats,
            memorySeats: foundVariant.memorySeats
          })
          console.log('VariantPage: Exteriors specs:', {
            headLights: foundVariant.headLights,
            tailLight: foundVariant.tailLight,
            frontFogLights: foundVariant.frontFogLights,
            roofRails: foundVariant.roofRails
          })
          console.log('VariantPage: Dimensions specs:', {
            groundClearance: foundVariant.groundClearance,
            length: foundVariant.length,
            width: foundVariant.width,
            height: foundVariant.height,
            wheelbase: foundVariant.wheelbase
          })
          console.log('VariantPage: Tyre & Suspension specs:', {
            frontTyreProfile: foundVariant.frontTyreProfile,
            rearTyreProfile: foundVariant.rearTyreProfile,
            spareTyreProfile: foundVariant.spareTyreProfile,
            frontSuspension: foundVariant.frontSuspension,
            rearSuspension: foundVariant.rearSuspension
          })
          console.log('VariantPage: Storage specs:', {
            cupholders: foundVariant.cupholders,
            fuelTankCapacity: foundVariant.fuelTankCapacity,
            bootSpace: foundVariant.bootSpace,
            bootSpaceAfterFoldingRearRowSeats: foundVariant.bootSpaceAfterFoldingRearRowSeats
          })
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Failed to load variant data')
      } finally {
        setLoading(false)
        setInitialLoad(false)
      }
    }

    fetchData()
  }, [brandName, modelName, variantName])

  // Extract brand, model, variant names from data (fallback to props or backend data)
  const displayBrandName = brand?.name || brandName || variantData.brand
  const displayModelName = model?.name || modelName || variantData.model
  const displayVariantName = variant?.name || variantName || variantData.variant

  // Helper function to check if transmission is automatic type
  const isAutomaticTransmission = (transmission: string) => {
    const automaticTypes = ['automatic', 'cvt', 'amt', 'dct', 'torque converter', 'dual clutch']
    return automaticTypes.some(type => transmission.toLowerCase().includes(type))
  }

  // Transform backend variant data for More Variants section - exclude current variant and sort by price
  const transformedVariants = allModelVariants
    .filter(v => v.id !== variant?.id) // Exclude current variant
    .map(v => ({
      id: v.id,
      name: v.name,
      price: v.price ? (v.price / 100000) : 0, // Convert to lakhs
      fuel: v.fuel || 'Petrol',
      transmission: v.transmission || 'Manual',
      power: v.maxPower || 'N/A',
      features: v.keyFeatures || v.headerSummary || 'Key features not available'
    }))
    .sort((a, b) => a.price - b.price) // Sort by price in ascending order

  // Generate dynamic filters based on available variants
  const getDynamicFilters = () => {
    const filters = ['All']
    const fuelTypes = new Set<string>()
    let hasAutomatic = false

    transformedVariants.forEach(v => {
      if (v.fuel) fuelTypes.add(v.fuel)
      if (v.transmission && isAutomaticTransmission(v.transmission)) {
        hasAutomatic = true
      }
    })

    fuelTypes.forEach(fuel => filters.push(fuel))
    if (hasAutomatic) filters.push('Automatic')
    
    return filters
  }

  const availableFilters = getDynamicFilters()

  // Filter variants based on active filter
  const getFilteredVariants = () => {
    switch (activeFilter) {
      case 'Diesel':
        return transformedVariants.filter(v => v.fuel === 'Diesel')
      case 'Petrol':
        return transformedVariants.filter(v => v.fuel === 'Petrol')
      case 'CNG':
        return transformedVariants.filter(v => v.fuel === 'CNG')
      case 'Automatic':
        return transformedVariants.filter(v => 
          v.transmission && isAutomaticTransmission(v.transmission)
        )
      default:
        return transformedVariants
    }
  }

  const filteredVariants = getFilteredVariants()

  // Helper function to parse bullet points from backend string
  const parseBulletPoints = (text: string | string[]): string[] => {
    if (Array.isArray(text)) return text
    if (!text) return []
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => line.replace(/^[•\-\*]\s*/, ''))
  }

  // Create dynamic variant data from backend
  const dynamicVariantData = variant ? {
    brand: displayBrandName,
    model: displayModelName,
    variant: displayVariantName,
    fullName: `${displayBrandName} ${displayModelName} ${displayVariantName}`,
    price: variant.price ? (variant.price / 100000) : variantData.price,
    originalPrice: variant.price ? (variant.price / 100000) : variantData.originalPrice,
    savings: 0,
    fuelType: (variant as any).fuel || variant.fuelType || variantData.fuelType,
    transmission: (variant as any).transmission || variantData.transmission,
    seating: 5, // Default or from specifications
    mileage: parseFloat((variant as any).mileageCompanyClaimed || '0') || variantData.mileage,
    engine: variant.engineName || (variant as any).engineCapacity || variantData.engine,
    power: (variant as any).maxPower || variant.enginePower || variantData.power,
    torque: (variant as any).torque || variant.engineTorque || variantData.torque,
    rating: 4.2, // Default or from reviews
    reviewCount: 1234, // Default or from reviews
    launchYear: 2024, // Default or from model data
    description: variant.headerSummary || variant.description || variant.keyFeatures || variantData.description,
    images: variant.highlightImages?.map((img: any) => `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}${img.url}`) || 
            model?.galleryImages?.map((img: any) => `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}${img.url}`) || 
            variantData.images,
    highlights: parseBulletPoints(variant.keyFeatures || variant.headerSummary || ''),
    cities: variantData.cities
  } : variantData

  // Use dynamic data if available, otherwise fallback to mock data
  // Don't show mock data during initial loading to avoid flash
  const currentVariantData = loading && !variant ? {
    ...variantData,
    fullName: `${displayBrandName || brandName || 'Loading'} ${displayModelName || modelName || 'Loading'} ${displayVariantName || variantName || 'Loading'}`,
    description: 'Loading variant details...',
    price: 0,
    rating: 4.2,
    reviewCount: 1234,
    fuelType: 'Loading...',
    transmission: 'Loading...',
    power: 'Loading...',
    torque: 'Loading...',
    engine: 'Loading...',
    mileage: 0
  } : (variant ? dynamicVariantData : variantData)

  // Get on-road price for current variant
  // currentVariantData.price is in lakhs, so convert to rupees for the hook
  const exShowroomPriceInRupees = (currentVariantData.price || 0) * 100000
  
  const { onRoadPrice, isOnRoadMode } = useOnRoadPrice({
    exShowroomPrice: exShowroomPriceInRupees,
    fuelType: currentVariantData.fuelType || 'Petrol'
  })
  
  // displayPrice should be in rupees for formatPrice to work correctly
  const displayPrice = isOnRoadMode ? onRoadPrice : exShowroomPriceInRupees
  const priceLabel = isOnRoadMode ? 'On-Road' : 'Ex-showroom'
  
  // Calculate EMI for display (20% down, 7 years, 8% interest)
  const calculateDisplayEMI = (price: number) => {
    const downPayment = price * 0.2
    const principal = price - downPayment
    const monthlyRate = 8 / 12 / 100
    const months = 7 * 12
    
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                (Math.pow(1 + monthlyRate, months) - 1)
    
    return Math.round(emi)
  }
  
  const displayEMI = calculateDisplayEMI(displayPrice)

  // Mock variants data for the more variants section
  const mockVariants = [
    {
      id: 1,
      name: "Smart (O) 1.2 Revotron",
      fuel: "Petrol",
      transmission: "Manual",
      power: "86 Bhp",
      price: 8.00,
      features: "Dual Airbags, ABS with EBD, Reverse Parking Sensors, Central Locking, Power Steering"
    },
    {
      id: 2,
      name: "Smart Plus 1.2 Revotron",
      fuel: "Petrol",
      transmission: "Manual",
      power: "86 Bhp",
      price: 9.25,
      features: "All Smart features plus Touchscreen Infotainment, Steering Mounted Controls, Height Adjustable Driver Seat"
    },
    {
      id: 3,
      name: "Smart (O) 1.2 Revotron",
      fuel: "Petrol",
      transmission: "Manual",
      power: "86 Bhp",
      price: 8.00,
      features: "Dual Airbags, ABS with EBD, Reverse Parking Sensors, Central Locking, Power Steering"
    },
    {
      id: 4,
      name: "Smart Plus 1.2 Revotron",
      fuel: "Petrol",
      transmission: "Manual",
      power: "86 Bhp",
      price: 9.25,
      features: "All Smart features plus Touchscreen Infotainment, Steering Mounted Controls, Height Adjustable Driver Seat"
    }
  ]

  // Handle variant click function
  const handleVariantChange = (variant: typeof availableVariants[0]) => {
    if (!displayBrandName || !displayModelName || !variant?.name) return
    
    const brandSlug = displayBrandName.toLowerCase().replace(/\s+/g, '-')
    const modelSlug = displayModelName.toLowerCase().replace(/\s+/g, '-')
    const variantSlug = variant.name.toLowerCase().replace(/\s+/g, '-')
    const url = `/${brandSlug}-cars/${modelSlug}/${variantSlug}`
    console.log('Navigating to variant page:', url)
    router.push(url)
  }

  // Available variants for the dropdown - exclude current variant
  const availableVariants = allModelVariants
    .filter(v => v.id !== variant?.id) // Exclude current variant
    .map(v => ({
      id: v.id,
      name: v.name,
      price: (v.price || 0) / 100000 // Convert to lakhs
    }))

  // Listen for city changes from localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const savedCity = localStorage.getItem('selectedCity')
      if (savedCity) {
        setSelectedCity(savedCity)
      }
    }
    window.addEventListener('storage', handleStorageChange)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        handleStorageChange()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    handleStorageChange() // Check immediately on mount
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (variantDropdownRef.current && !variantDropdownRef.current.contains(event.target as Node)) {
        setShowVariantDropdown(false)
      }
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) {
        setShowCityDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Toggle specification section
  const toggleSpecSection = (sectionKey: string) => {
    setExpandedSpecs(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }))
  }

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      const headerHeight = 80 // Account for navigation ribbon
      const elementPosition = element.offsetTop - headerHeight
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })
    }
  }

  // Fast loading state - show skeleton instead of blank page
  const showSkeleton = loading || initialLoad

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => router.back()}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Navigation Ribbon */}
      <div className="variant-nav-ribbon bg-white border-b sticky top-0 z-40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
            {navigationSections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="py-3 px-4 font-medium text-sm whitespace-nowrap text-gray-500 hover:text-gray-700 transition-colors"
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div>
        {/* Section 1: Overview - Variant Specific */}
        <PageSection background="white" maxWidth="7xl">
          <div id="overview" className="space-y-6">
            {/* Hero Car Image with Gallery - Scrollable */}
            <div className="relative">
              <div id="variant-gallery" className="aspect-[16/10] bg-gray-100 rounded-2xl overflow-x-auto snap-x snap-mandatory scrollbar-hide flex touch-pan-x" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
                {showSkeleton ? (
                  <div className="w-full h-full flex-shrink-0 bg-gray-200 animate-pulse flex items-center justify-center">
                    <div className="text-gray-400">Loading image...</div>
                  </div>
                ) : (
                  <>
                    {/* Hero Image */}
                    {model?.heroImage && (
                      <div className="w-full h-full flex-shrink-0 snap-center relative">
                        <img
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}${model.heroImage}`}
                          alt={`${displayBrandName || 'Car'} ${displayModelName || 'Model'}`}
                          className="w-full h-full object-contain rounded-2xl"
                          loading="eager"
                          fetchpriority="high"
                          decoding="async"
                        />
                      </div>
                    )}
                    {/* Gallery Images */}
                    {model?.galleryImages?.map((img: any, index: number) => (
                      <div key={index} className="w-full h-full flex-shrink-0 snap-center relative">
                        <img
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}${img.url}`}
                          alt={`${displayBrandName || 'Car'} ${displayModelName || 'Model'} - Image ${index + 1}`}
                          className="w-full h-full object-cover rounded-2xl"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    ))}
                  </>
                )}
              </div>
              
              {/* Gallery Navigation Arrow */}
              {!showSkeleton && ((model?.heroImage && model?.galleryImages && model.galleryImages.length > 0) || (model?.galleryImages && model.galleryImages.length > 1)) && (
                <button 
                  onClick={() => {
                    const gallery = document.getElementById('variant-gallery');
                    if (gallery) {
                      gallery.scrollBy({ left: gallery.clientWidth, behavior: 'smooth' });
                    }
                  }}
                  className="absolute bottom-4 right-4 bg-white rounded-full p-3 hover:bg-gray-50 transition-colors shadow-lg"
                >
                  <ChevronRight className="w-6 h-6 text-gray-600" />
                </button>
              )}
            </div>

            {/* Car Title and Actions */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {showSkeleton ? (
                    <div className="bg-gray-200 animate-pulse h-9 w-96 rounded"></div>
                  ) : (
                    currentVariantData.fullName
                  )}
                </h1>
                
                {/* Rating */}
                <div className="flex items-center space-x-4 mb-4">
                  {showSkeleton ? (
                    <div className="bg-gray-200 animate-pulse h-8 w-24 rounded"></div>
                  ) : (
                    <div className="flex items-center bg-gradient-to-r from-red-600 to-orange-500 text-white px-3 py-1 rounded">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      <span className="font-semibold">{currentVariantData.rating || 4.2}</span>
                      <span className="ml-1">({currentVariantData.reviewCount || 1234})</span>
                    </div>
                  )}
                  <button className="text-red-600 hover:text-orange-600 font-medium">
                    Rate & Review
                  </button>
                </div>
              </div>
              
              {/* Share and Heart Icons */}
              <div className="flex items-center space-x-3">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-2 transition-colors ${
                    isLiked ? 'text-red-600' : 'text-gray-400 hover:text-red-600'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="text-gray-700 leading-relaxed">
              {showSkeleton ? (
                <div className="space-y-2">
                  <div className="bg-gray-200 animate-pulse h-4 w-full rounded"></div>
                  <div className="bg-gray-200 animate-pulse h-4 w-3/4 rounded"></div>
                </div>
              ) : (
                <>
                  <p>
                    {showFullDescription ? currentVariantData.description : 
                      (currentVariantData.description?.length > 150 ? 
                        `${currentVariantData.description.substring(0, 150)}...` : 
                        currentVariantData.description)}
                  </p>
                  {currentVariantData.description?.length > 150 && (
                    <div className="mt-2">
                      {!showFullDescription ? (
                        <button
                          onClick={() => setShowFullDescription(true)}
                          className="text-red-600 hover:text-orange-600 font-medium"
                        >
                          ...more
                        </button>
                      ) : (
                        <button
                          onClick={() => setShowFullDescription(false)}
                          className="text-red-600 hover:text-orange-600 font-medium"
                        >
                          Show less
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Single Price Display for Variant */}
            <div className="space-y-4">
              <div className="text-3xl font-bold text-green-600">
                {showSkeleton ? (
                  <div className="bg-gray-200 animate-pulse h-9 w-32 rounded"></div>
                ) : (
                  formatPrice(displayPrice / 100000)
                )}
              </div>
              <div className="text-sm text-gray-500">*{priceLabel}</div>
              
              <button 
                onClick={() => {
                  const brandSlug = displayBrandName?.toLowerCase().replace(/\s+/g, '-')
                  const modelSlug = displayModelName?.toLowerCase().replace(/\s+/g, '-')
                  const variantSlug = variantName?.toLowerCase().replace(/\s+/g, '-')
                  router.push(`/${brandSlug}-cars/${modelSlug}/price-in/mumbai?variant=${variantSlug}`)
                }}
                className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Get On-Road Price
              </button>
            </div>

            {/* Variant and City Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Variant Dropdown */}
              <div className="relative" ref={variantDropdownRef}>
                <button
                  onClick={() => setShowVariantDropdown(!showVariantDropdown)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-gray-400 transition-colors"
                >
                  <span className="text-gray-700">
                    {selectedVariant || 'Choose Variant'}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showVariantDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showVariantDropdown && availableVariants.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-96 overflow-y-auto">
                    {availableVariants.map((variantItem) => (
                      <button
                        key={variantItem.id}
                        onClick={() => {
                          const brandSlug = displayBrandName?.toLowerCase().replace(/\s+/g, '-')
                          const modelSlug = displayModelName?.toLowerCase().replace(/\s+/g, '-')
                          const variantSlug = variantItem.name.toLowerCase().replace(/\s+/g, '-')
                          router.push(`/${brandSlug}-cars/${modelSlug}/${variantSlug}`)
                        }}
                        className="block w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-gray-900">{variantItem.name}</span>
                          <span className="text-gray-600 text-sm">{formatPrice(variantItem.price)}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* City Selector - Links to Location Page */}
              <Link
                href="/location"
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-gray-400 transition-colors"
              >
                <span className="text-gray-700">
                  {selectedCity || 'Delhi'}
                </span>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </Link>
            </div>

            {/* EMI Calculator Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-orange-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-lg font-bold">K</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">kotak</h3>
                    <p className="text-gray-600 text-base">Mahindra Bank</p>
                  </div>
                </div>
                
                {/* EMI Amount Display */}
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(displayEMI)}
                  </p>
                  <p className="text-gray-600 text-base">per month</p>
                </div>
              </div>

              {/* Calculate EMI Button */}
              <Link
                href={`/emi-calculator?brand=${encodeURIComponent(displayBrandName)}&model=${encodeURIComponent(displayModelName)}&variant=${encodeURIComponent(variantName)}&price=${displayPrice}`}
                className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-full transition-colors flex items-center justify-center space-x-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Calculate EMI</span>
              </Link>
            </div>
          </div>
        </PageSection>

        {/* Section 2: AD Banner + Variant Highlights */}
        <PageSection background="white" maxWidth="7xl">
          <div id="highlights" className="space-y-8">
            {/* AD Banner */}
            <div className="bg-gray-300 rounded-lg py-20 text-center">
              <h2 className="text-3xl font-bold text-gray-600">AD Banner</h2>
            </div>

            {/* Key Features */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Key Features</h2>
              
              {/* Highlights Grid - Horizontal Scroll */}
              <div className="relative">
                <div className="highlights-scroll-container flex gap-4 overflow-x-auto scrollbar-hide pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {/* Dynamic Highlight Cards from Variant Backend */}
                  {showSkeleton ? (
                    /* Skeleton loading cards */
                    <>
                      {[1, 2, 3].map((index) => (
                        <div key={index} className="flex-shrink-0 w-64">
                          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <div className="aspect-[4/3] bg-gray-200 animate-pulse"></div>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (() => {
                    const variantHighlights = variant?.highlightImages || [];
                    
                    return variantHighlights.length > 0 ? (
                      variantHighlights.map((highlight: any, index: number) => (
                        <div key={index} className="flex-shrink-0 w-64">
                          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <div className="aspect-[4/3] bg-gray-200 relative">
                              <img
                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}${highlight.url}`}
                                alt={highlight.caption || `${displayBrandName} ${displayModelName} Feature ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg"
                                loading="lazy"
                                decoding="async"
                                onError={(e) => {
                                  // Fallback to placeholder if image fails to load
                                  e.currentTarget.src = `https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&crop=center`
                                }}
                              />
                              {/* Image Caption Overlay - Backend Caption */}
                              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2">
                                <p className="text-sm font-medium text-center">
                                  {highlight.caption || `${displayBrandName} ${displayModelName} Feature ${index + 1}`}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                    /* Fallback cards if no backend data */
                    <>
                      {/* Highlight Card 1 */}
                      <div className="flex-shrink-0 w-64">
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                          <div className="aspect-[4/3] bg-gray-200 relative">
                            <img
                              src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&crop=center"
                              alt="Advanced Safety Features"
                              className="w-full h-full object-cover rounded-lg"
                              loading="lazy"
                              decoding="async"
                            />
                            {/* Image Caption Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2">
                              <p className="text-sm font-medium text-center">Advanced Safety Features</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Highlight Card 2 */}
                      <div className="flex-shrink-0 w-64">
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                          <div className="aspect-[4/3] bg-gray-200 relative">
                            <img
                              src="https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&h=300&fit=crop&crop=center"
                              alt="Premium Interior"
                              className="w-full h-full object-cover rounded-lg"
                              loading="lazy"
                              decoding="async"
                            />
                            {/* Image Caption Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2">
                              <p className="text-sm font-medium text-center">Premium Interior</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Highlight Card 3 */}
                      <div className="flex-shrink-0 w-64">
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                          <div className="aspect-[4/3] bg-gray-200 relative">
                            <img
                              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop&crop=center"
                              alt="Fuel Efficiency"
                              className="w-full h-full object-cover rounded-lg"
                              loading="lazy"
                              decoding="async"
                            />
                            {/* Image Caption Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2">
                              <p className="text-sm font-medium text-center">Fuel Efficiency</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </PageSection>

        {/* Section 3: SEO Text + Specifications */}
        <PageSection background="white" maxWidth="7xl">
          <div id="specifications" className="space-y-8">
            {/* SEO Text Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">{brandName} {modelName} {variantName} Info</h2>
              <div className="text-gray-700 leading-relaxed">
                <p>
                  Tata Nexon price for the base model starts at Rs. 8.00 Lakh and the top model price goes upto Rs. 15.60 Lakh (Avg. ex-showroom). Nexon price for 49 variants is listed below.
                </p>
              </div>
            </div>

            {/* Specifications Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {brandName} {variantName} {modelName} Specifications & Features
              </h2>

              {/* Specifications Categories */}
              <div className="space-y-8">
                {/* Comfort & Convenience */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 pb-4">
                    <h3 className="text-xl font-bold text-gray-900">Comfort & Convenience</h3>
                    <button 
                      onClick={() => toggleSpecSection('comfort')}
                      className="p-1"
                    >
                      <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${expandedSpecs['comfort'] ? 'rotate-90' : ''}`} />
                    </button>
                  </div>
                  
                  {/* Content */}
                  <div className="px-6 pb-6">
                    {/* Always visible specs */}
                    <div className="space-y-4">
                      {showSkeleton ? (
                        /* Skeleton loading */
                        <>
                          {[1, 2].map((index) => (
                            <div key={index} className="flex justify-between items-center">
                              <div className="bg-gray-200 animate-pulse h-4 text-base rounded"></div>
                              <div className="bg-gray-200 animate-pulse h-4 w-1/4 rounded"></div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <>
                          {/* Show first 2 specs always */}
                          {variant?.ventilatedSeats && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Ventilated Seats</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.ventilatedSeats}</span>
                            </div>
                          )}
                          
                          {variant?.sunroof && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Sunroof</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.sunroof}</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    
                    {/* Expanded content */}
                    {expandedSpecs['comfort'] && !showSkeleton && (
                      <div className="mt-4 space-y-4">
                        {variant?.airPurifier && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Air Purifier</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.airPurifier}</span>
                          </div>
                        )}
                        
                        {variant?.headsUpDisplay && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Heads Up Display (HUD)</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.headsUpDisplay}</span>
                          </div>
                        )}
                        
                        {variant?.cruiseControl && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Cruise Control</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.cruiseControl}</span>
                          </div>
                        )}
                        
                        {variant?.rainSensingWipers && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Rain Sensing Wipers</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.rainSensingWipers}</span>
                          </div>
                        )}
                        
                        {variant?.automaticHeadlamp && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Automatic Headlamp</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.automaticHeadlamp}</span>
                          </div>
                        )}
                        
                        {variant?.followMeHomeHeadlights && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Follow Me Home Headlights</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.followMeHomeHeadlights}</span>
                          </div>
                        )}
                        
                        {variant?.ignition && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Ignition</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.ignition}</span>
                          </div>
                        )}
                        
                        {variant?.ambientLighting && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Ambient Lighting</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.ambientLighting}</span>
                          </div>
                        )}
                        
                        {variant?.airConditioning && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Air Conditioning</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.airConditioning}</span>
                          </div>
                        )}
                        
                        {variant?.climateZones && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Climate Zones</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.climateZones}</span>
                          </div>
                        )}
                        
                        {variant?.rearACVents && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Rear A/C Vents</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.rearACVents}</span>
                          </div>
                        )}
                        
                        {variant?.frontArmrest && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Front Armrest</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.frontArmrest}</span>
                          </div>
                        )}
                        
                        {variant?.automaticClimateControl && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Automatic Climate Control</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.automaticClimateControl}</span>
                          </div>
                        )}
                        
                        {variant?.airQualityIndexDisplay && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Air Quality Index Display</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.airQualityIndexDisplay}</span>
                          </div>
                        )}
                        
                        {variant?.remoteEngineStartStop && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Remote Engine Start / Stop</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.remoteEngineStartStop}</span>
                          </div>
                        )}
                        
                        {variant?.remoteClimateControl && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Remote Climate Control</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.remoteClimateControl}</span>
                          </div>
                        )}
                        
                        {variant?.steeringAdjustment && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Steering Adjustment</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.steeringAdjustment}</span>
                          </div>
                        )}
                        
                        {variant?.steeringWheelMaterial && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Steering Wheel Material</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.steeringWheelMaterial}</span>
                          </div>
                        )}
                        
                        {variant?.parkingSensors && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Parking Sensors</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.parkingSensors}</span>
                          </div>
                        )}
                        
                        {variant?.keylessEntry && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Keyless Entry</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.keylessEntry}</span>
                          </div>
                        )}
                        
                        {variant?.engineStartStopButton && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Engine Start Stop Button</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.engineStartStopButton}</span>
                          </div>
                        )}
                        
                        {variant?.gloveCompartment && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Glove Compartment</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.gloveCompartment}</span>
                          </div>
                        )}
                        
                        {variant?.centerConsoleArmrest && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Center Console Armrest</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.centerConsoleArmrest}</span>
                          </div>
                        )}
                        
                        {variant?.rearArmrest && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Rear Armrest</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.rearArmrest}</span>
                          </div>
                        )}
                        
                        {variant?.insideRearViewMirror && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Inside Rear View Mirror</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.insideRearViewMirror}</span>
                          </div>
                        )}
                        
                        {variant?.outsideRearViewMirrors && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Outside Rear View Mirrors</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.outsideRearViewMirrors}</span>
                          </div>
                        )}
                        
                        {variant?.steeringMountedControls && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Steering Mounted Controls</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.steeringMountedControls}</span>
                          </div>
                        )}
                        
                        {variant?.rearWindshieldDefogger && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Rear Windshield Defogger</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.rearWindshieldDefogger}</span>
                          </div>
                        )}
                        
                        {variant?.frontWindshieldDefogger && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Front Windshield Defogger</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.frontWindshieldDefogger}</span>
                          </div>
                        )}
                        
                        {variant?.cooledGlovebox && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Cooled Glovebox</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.cooledGlovebox}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* View More/Less Button */}
                    <div className="mt-6 flex justify-center">
                      <button 
                        onClick={() => toggleSpecSection('comfort')}
                        className="text-red-500 hover:text-red-600 font-medium text-sm flex items-center space-x-1 transition-colors duration-200"
                      >
                        <span>{expandedSpecs['comfort'] ? 'View less' : 'View more'}</span>
                        <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${expandedSpecs['comfort'] ? 'rotate-270' : 'rotate-90'}`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Safety */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 pb-4">
                    <h3 className="text-xl font-bold text-gray-900">Safety</h3>
                    <button 
                      onClick={() => toggleSpecSection('safety')}
                      className="p-1"
                    >
                      <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${expandedSpecs['safety'] ? 'rotate-90' : ''}`} />
                    </button>
                  </div>
                  
                  {/* Content */}
                  <div className="px-6 pb-6">
                    {/* Always visible specs */}
                    <div className="space-y-4">
                      {showSkeleton ? (
                        /* Skeleton loading */
                        <>
                          {[1, 2].map((index) => (
                            <div key={index} className="flex justify-between items-center">
                              <div className="bg-gray-200 animate-pulse h-4 text-base rounded"></div>
                              <div className="bg-gray-200 animate-pulse h-4 w-1/4 rounded"></div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <>
                          {/* Show first 2 specs always */}
                          {variant?.globalNCAPRating && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Global NCAP Rating</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.globalNCAPRating}</span>
                            </div>
                          )}
                          
                          {variant?.airbags && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Airbags</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.airbags}</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    
                    {/* Expanded content */}
                    {expandedSpecs['safety'] && !showSkeleton && (
                      <div className="mt-4 space-y-4">
                        {/* Airbags Location - Only show if data exists */}
                        {variant?.airbagsLocation && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Airbags Location</span>
                            <span className="text-gray-900 text-sm">{variant.airbagsLocation}</span>
                          </div>
                        )}
                        
                        {/* ADAS Level - Only show if data exists */}
                        {variant?.adasLevel && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">ADAS Level</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.adasLevel}</span>
                          </div>
                        )}
                        
                        {/* ADAS Features - Only show if data exists */}
                        {variant?.adasFeatures && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">ADAS Features</span>
                            <span className="text-gray-900 text-sm leading-relaxed">{variant.adasFeatures}</span>
                          </div>
                        )}
                        
                        {/* Reverse Camera - Only show if data exists */}
                        {variant?.reverseCamera && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Reverse Camera</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.reverseCamera}</span>
                          </div>
                        )}
                        
                        {/* Reverse Camera Guidelines - Only show if data exists */}
                        {variant?.reverseCameraGuidelines && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Reverse Camera Guidelines</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.reverseCameraGuidelines}</span>
                          </div>
                        )}
                        
                        {/* Tyre Pressure Monitor (TPMS) - Only show if data exists */}
                        {variant?.tyrePressureMonitor && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Tyre Pressure Monitor (TPMS)</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.tyrePressureMonitor}</span>
                          </div>
                        )}
                        
                        {/* Hill Hold Assist - Only show if data exists */}
                        {variant?.hillHoldAssist && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Hill Hold Assist</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.hillHoldAssist}</span>
                          </div>
                        )}
                        
                        {/* Hill Descent Control - Only show if data exists */}
                        {variant?.hillDescentControl && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Hill Descent Control</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.hillDescentControl}</span>
                          </div>
                        )}
                        
                        {/* Roll Over Mitigation - Only show if data exists */}
                        {variant?.rollOverMitigation && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Roll Over Mitigation</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.rollOverMitigation}</span>
                          </div>
                        )}
                        
                        {/* Parking Sensor - Only show if data exists */}
                        {variant?.parkingSensor && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Parking Sensor</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.parkingSensor}</span>
                          </div>
                        )}
                        
                        {/* Disc Brakes - Only show if data exists */}
                        {variant?.discBrakes && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Disc Brakes</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.discBrakes}</span>
                          </div>
                        )}
                        
                        {/* Electronic Stability Program - Only show if data exists */}
                        {variant?.electronicStabilityProgram && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Electronic Stability Program</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.electronicStabilityProgram}</span>
                          </div>
                        )}
                        
                        {/* ABS - Only show if data exists */}
                        {variant?.abs && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">ABS</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.abs}</span>
                          </div>
                        )}
                        
                        {/* EBD - Only show if data exists */}
                        {variant?.ebd && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">EBD</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.ebd}</span>
                          </div>
                        )}
                        
                        {/* Brake Assist (BA) - Only show if data exists */}
                        {variant?.brakeAssist && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Brake Assist (BA)</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.brakeAssist}</span>
                          </div>
                        )}
                        
                        {/* ISOFIX Mounts - Only show if data exists */}
                        {variant?.isofixMounts && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">ISOFIX Mounts</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.isofixMounts}</span>
                          </div>
                        )}
                        
                        {/* Seatbelt Warning - Only show if data exists */}
                        {variant?.seatbeltWarning && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Seatbelt Warning</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.seatbeltWarning}</span>
                          </div>
                        )}
                        
                        {/* Speed Alert System - Only show if data exists */}
                        {variant?.speedAlertSystem && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Speed Alert System</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.speedAlertSystem}</span>
                          </div>
                        )}
                        
                        {/* Speed Sensing Door Locks - Only show if data exists */}
                        {variant?.speedSensingDoorLocks && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Speed Sensing Door Locks</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.speedSensingDoorLocks}</span>
                          </div>
                        )}
                        
                        {/* Immobiliser - Only show if data exists */}
                        {variant?.immobiliser && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Immobiliser</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.immobiliser}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* View More/Less Button */}
                    <div className="mt-6 flex justify-center">
                      <button 
                        onClick={() => toggleSpecSection('safety')}
                        className="text-red-500 hover:text-red-600 font-medium text-sm flex items-center space-x-1 transition-colors duration-200"
                      >
                        <span>{expandedSpecs['safety'] ? 'View less' : 'View more'}</span>
                        <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${expandedSpecs['safety'] ? 'rotate-270' : 'rotate-90'}`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Entertainment & Connectivity */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 pb-4">
                    <h3 className="text-xl font-bold text-gray-900">Entertainment & Connectivity</h3>
                    <button 
                      onClick={() => toggleSpecSection('entertainment')}
                      className="p-1"
                    >
                      <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${expandedSpecs['entertainment'] ? 'rotate-90' : ''}`} />
                    </button>
                  </div>
                  
                  {/* Content */}
                  <div className="px-6 pb-6">
                    {/* Always visible specs */}
                    <div className="space-y-4">
                      {showSkeleton ? (
                        /* Skeleton loading */
                        <>
                          {[1, 2].map((index) => (
                            <div key={index} className="flex justify-between items-center">
                              <div className="bg-gray-200 animate-pulse h-4 text-base rounded"></div>
                              <div className="bg-gray-200 animate-pulse h-4 w-1/4 rounded"></div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <>
                          {/* Show first 2 specs always */}
                          {variant?.touchScreenInfotainment && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Touch Screen Infotainment</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.touchScreenInfotainment}</span>
                            </div>
                          )}
                          
                          {variant?.androidAppleCarplay && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Android & Apple CarPlay</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.androidAppleCarplay}</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    
                    {/* Expanded content */}
                    {expandedSpecs['entertainment'] && !showSkeleton && (
                      <div className="mt-4 space-y-4">
                        
                        {/* Speakers - Only show if data exists */}
                        {variant?.speakers && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Speakers</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.speakers}</span>
                          </div>
                        )}
                        
                        {/* Tweeters - Only show if data exists */}
                        {variant?.tweeters && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Tweeters</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.tweeters}</span>
                          </div>
                        )}
                        
                        {/* Subwoofers - Only show if data exists */}
                        {variant?.subwoofers && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Subwoofers</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.subwoofers}</span>
                          </div>
                        )}
                        
                        {/* USB-C Charging Ports - Only show if data exists */}
                        {variant?.usbCChargingPorts && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">USB-C Charging Ports</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.usbCChargingPorts}</span>
                          </div>
                        )}
                        
                        {/* USB-A Charging Ports - Only show if data exists */}
                        {variant?.usbAChargingPorts && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">USB-A Charging Ports</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.usbAChargingPorts}</span>
                          </div>
                        )}
                        
                        {/* 12V Charging Ports - Only show if data exists */}
                        {variant?.twelvevChargingPorts && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">12V Charging Ports</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.twelvevChargingPorts}</span>
                          </div>
                        )}
                        
                        {/* Wireless Charging - Only show if data exists */}
                        {variant?.wirelessCharging && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Wireless Charging</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.wirelessCharging}</span>
                          </div>
                        )}
                        
                        {/* Connected Car Tech - Only show if data exists */}
                        {variant?.connectedCarTech && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Connected Car Tech</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.connectedCarTech}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* View More/Less Button */}
                    <div className="mt-6 flex justify-center">
                      <button 
                        onClick={() => toggleSpecSection('entertainment')}
                        className="text-red-500 hover:text-red-600 font-medium text-sm flex items-center space-x-1 transition-colors duration-200"
                      >
                        <span>{expandedSpecs['entertainment'] ? 'View less' : 'View more'}</span>
                        <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${expandedSpecs['entertainment'] ? 'rotate-270' : 'rotate-90'}`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Engine & Transmission */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 pb-4">
                    <h3 className="text-xl font-bold text-gray-900">Engine & Transmission</h3>
                    <button 
                      onClick={() => toggleSpecSection('engine')}
                      className="p-1"
                    >
                      <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${expandedSpecs['engine'] ? 'rotate-90' : ''}`} />
                    </button>
                  </div>
                  
                  {/* Content */}
                  <div className="px-6 pb-6">
                    {/* Always visible specs */}
                    <div className="space-y-4">
                      {showSkeleton ? (
                        /* Skeleton loading */
                        <>
                          {[1, 2].map((index) => (
                            <div key={index} className="flex justify-between items-center">
                              <div className="bg-gray-200 animate-pulse h-4 text-base rounded"></div>
                              <div className="bg-gray-200 animate-pulse h-4 w-1/4 rounded"></div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <>
                          {/* Show first 2 specs always */}
                          {variant?.engineNamePage4 && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Engine Name</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.engineNamePage4}</span>
                            </div>
                          )}
                          
                          {variant?.engineCapacity && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Engine Capacity</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.engineCapacity}</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    
                    {/* Expanded content */}
                    {expandedSpecs['engine'] && !showSkeleton && (
                      <div className="mt-4 space-y-4">
                        {/* Fuel - Only show if data exists */}
                        {variant?.fuel && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Fuel</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.fuel}</span>
                          </div>
                        )}
                        
                        {/* Transmission - Only show if data exists */}
                        {variant?.transmission && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Transmission</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.transmission}</span>
                          </div>
                        )}
                        
                        {/* No of Gears - Only show if data exists */}
                        {variant?.noOfGears && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">No of Gears</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.noOfGears}</span>
                          </div>
                        )}
                        
                        {/* Paddle Shifter - Only show if data exists */}
                        {variant?.paddleShifter && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Paddle Shifter</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.paddleShifter}</span>
                          </div>
                        )}
                        
                        {/* Max Power - Only show if data exists */}
                        {variant?.maxPower && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Max Power</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.maxPower}</span>
                          </div>
                        )}
                        
                        {/* Torque - Only show if data exists */}
                        {variant?.torque && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Torque</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.torque}</span>
                          </div>
                        )}
                        
                        {/* 0 to 100 Kmph Time - Only show if data exists */}
                        {variant?.zeroToHundredKmphTime && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">0 to 100 Kmph Time</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.zeroToHundredKmphTime}</span>
                          </div>
                        )}
                        
                        {/* Top Speed - Only show if data exists */}
                        {variant?.topSpeed && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Top Speed</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.topSpeed}</span>
                          </div>
                        )}
                        
                        {/* EV Battery Capacity - Only show if data exists */}
                        {variant?.evBatteryCapacity && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">EV Battery Capacity</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.evBatteryCapacity}</span>
                          </div>
                        )}
                        
                        {/* Hybrid Battery Capacity - Only show if data exists */}
                        {variant?.hybridBatteryCapacity && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Hybrid Battery Capacity</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.hybridBatteryCapacity}</span>
                          </div>
                        )}
                        
                        {/* Battery Type - Only show if data exists */}
                        {variant?.batteryType && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Battery Type</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.batteryType}</span>
                          </div>
                        )}
                        
                        {/* Electric Motor Placement - Only show if data exists */}
                        {variant?.electricMotorPlacement && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Electric Motor Placement</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.electricMotorPlacement}</span>
                          </div>
                        )}
                        
                        {/* EV Range - Only show if data exists */}
                        {variant?.evRange && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">EV Range</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.evRange}</span>
                          </div>
                        )}
                        
                        {/* EV Charging Time - Only show if data exists */}
                        {variant?.evChargingTime && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">EV Charging Time</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.evChargingTime}</span>
                          </div>
                        )}
                        
                        {/* Max Electric Motor Power - Only show if data exists */}
                        {variant?.maxElectricMotorPower && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Max Electric Motor Power</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.maxElectricMotorPower}</span>
                          </div>
                        )}
                        
                        {/* Turbo Charged - Only show if data exists */}
                        {variant?.turboCharged && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Turbo Charged</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.turboCharged}</span>
                          </div>
                        )}
                        
                        {/* Hybrid Type - Only show if data exists */}
                        {variant?.hybridType && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Hybrid Type</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.hybridType}</span>
                          </div>
                        )}
                        
                        {/* Drive Train - Only show if data exists */}
                        {variant?.driveTrain && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Drive Train</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.driveTrain}</span>
                          </div>
                        )}
                        
                        {/* Driving Modes - Only show if data exists */}
                        {variant?.drivingModes && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Driving Modes</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.drivingModes}</span>
                          </div>
                        )}
                        
                        {/* Off Road Modes - Only show if data exists */}
                        {variant?.offRoadModes && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Off Road Modes</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.offRoadModes}</span>
                          </div>
                        )}
                        
                        {/* Differential Lock - Only show if data exists */}
                        {variant?.differentialLock && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Differential Lock</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.differentialLock}</span>
                          </div>
                        )}
                        
                        {/* Limited Slip Differential - Only show if data exists */}
                        {variant?.limitedSlipDifferential && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Limited Slip Differential</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.limitedSlipDifferential}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* View More/Less Button */}
                    <div className="mt-6 flex justify-center">
                      <button 
                        onClick={() => toggleSpecSection('engine')}
                        className="text-red-500 hover:text-red-600 font-medium text-sm flex items-center space-x-1 transition-colors duration-200"
                      >
                        <span>{expandedSpecs['engine'] ? 'View less' : 'View more'}</span>
                        <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${expandedSpecs['engine'] ? 'rotate-270' : 'rotate-90'}`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Seating Comfort */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 pb-4">
                    <h3 className="text-xl font-bold text-gray-900">Seating Comfort</h3>
                    <button 
                      onClick={() => toggleSpecSection('seating')}
                      className="p-1"
                    >
                      <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${expandedSpecs['seating'] ? 'rotate-90' : ''}`} />
                    </button>
                  </div>
                  
                  {/* Content */}
                  <div className="px-6 pb-6">
                    {/* Always visible specs */}
                    <div className="space-y-4">
                      {showSkeleton ? (
                        /* Skeleton loading */
                        <>
                          {[1, 2].map((index) => (
                            <div key={index} className="flex justify-between items-center">
                              <div className="bg-gray-200 animate-pulse h-4 text-base rounded"></div>
                              <div className="bg-gray-200 animate-pulse h-4 w-1/4 rounded"></div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <>
                          {/* Show first 2 specs always */}
                          {variant?.seatUpholstery && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Seat Upholstery</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.seatUpholstery}</span>
                            </div>
                          )}
                          
                          {variant?.seatsAdjustment && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Seats Adjustment</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.seatsAdjustment}</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    
                    {/* Expanded content */}
                    {expandedSpecs['seating'] && !showSkeleton && (
                      <div className="mt-4 space-y-4">
                        {variant?.driverSeatAdjustment && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Driver Seat Adjustment</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.driverSeatAdjustment}</span>
                          </div>
                        )}
                        
                        {variant?.passengerSeatAdjustment && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Passenger Seat Adjustment</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.passengerSeatAdjustment}</span>
                          </div>
                        )}
                        
                        {variant?.rearSeatAdjustment && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Rear Seat Adjustment</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.rearSeatAdjustment}</span>
                          </div>
                        )}
                        
                        {variant?.welcomeSeats && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Welcome Seats</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.welcomeSeats}</span>
                          </div>
                        )}
                        
                        {variant?.memorySeats && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Memory Seats</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.memorySeats}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* View More/Less Button */}
                    <div className="mt-6 flex justify-center">
                      <button 
                        onClick={() => toggleSpecSection('seating')}
                        className="text-red-500 hover:text-red-600 font-medium text-sm flex items-center space-x-1 transition-colors duration-200"
                      >
                        <span>{expandedSpecs['seating'] ? 'View less' : 'View more'}</span>
                        <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${expandedSpecs['seating'] ? 'rotate-270' : 'rotate-90'}`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Exteriors */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 pb-4">
                    <h3 className="text-xl font-bold text-gray-900">Exteriors</h3>
                    <button 
                      onClick={() => toggleSpecSection('exteriors')}
                      className="p-1"
                    >
                      <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${expandedSpecs['exteriors'] ? 'rotate-90' : ''}`} />
                    </button>
                  </div>
                  
                  {/* Content */}
                  <div className="px-6 pb-6">
                    {/* Always visible specs */}
                    <div className="space-y-4">
                      {showSkeleton ? (
                        /* Skeleton loading */
                        <>
                          {[1, 2].map((index) => (
                            <div key={index} className="flex justify-between items-center">
                              <div className="bg-gray-200 animate-pulse h-4 text-base rounded"></div>
                              <div className="bg-gray-200 animate-pulse h-4 w-1/4 rounded"></div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <>
                          {/* Show first 2 specs always */}
                          {variant?.headLights && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Head Lights</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.headLights}</span>
                            </div>
                          )}
                          
                          {variant?.tailLight && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Tail Light</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.tailLight}</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    
                    {/* Expanded content */}
                    {expandedSpecs['exteriors'] && !showSkeleton && (
                      <div className="mt-4 space-y-4">
                        {variant?.frontFogLights && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Front Fog Lights</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.frontFogLights}</span>
                          </div>
                        )}
                        
                        {variant?.roofRails && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Roof Rails</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.roofRails}</span>
                          </div>
                        )}
                        
                        {variant?.radioAntenna && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Radio Antenna</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.radioAntenna}</span>
                          </div>
                        )}
                        
                        {variant?.outsideRearViewMirror && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Outside Rear View Mirror</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.outsideRearViewMirror}</span>
                          </div>
                        )}
                        
                        {variant?.daytimeRunningLights && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Daytime Running Lights</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.daytimeRunningLights}</span>
                          </div>
                        )}
                        
                        {variant?.sideIndicator && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Side Indicator</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.sideIndicator}</span>
                          </div>
                        )}
                        
                        {variant?.rearWindshieldWiper && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Rear Windshield Wiper</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.rearWindshieldWiper}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* View More/Less Button */}
                    <div className="mt-6 flex justify-center">
                      <button 
                        onClick={() => toggleSpecSection('exteriors')}
                        className="text-red-500 hover:text-red-600 font-medium text-sm flex items-center space-x-1 transition-colors duration-200"
                      >
                        <span>{expandedSpecs['exteriors'] ? 'View less' : 'View more'}</span>
                        <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${expandedSpecs['exteriors'] ? 'rotate-270' : 'rotate-90'}`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Dimensions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 pb-4">
                    <h3 className="text-xl font-bold text-gray-900">Dimensions</h3>
                    <button 
                      onClick={() => toggleSpecSection('dimensions')}
                      className="p-1"
                    >
                      <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${expandedSpecs['dimensions'] ? 'rotate-90' : ''}`} />
                    </button>
                  </div>
                  
                  {/* Content */}
                  <div className="px-6 pb-6">
                    {/* Always visible specs */}
                    <div className="space-y-4">
                      {showSkeleton ? (
                        /* Skeleton loading */
                        <>
                          {[1, 2].map((index) => (
                            <div key={index} className="flex justify-between items-center">
                              <div className="bg-gray-200 animate-pulse h-4 text-base rounded"></div>
                              <div className="bg-gray-200 animate-pulse h-4 w-1/4 rounded"></div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <>
                          {/* Show first 2 specs always */}
                          {variant?.groundClearance && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Ground Clearance</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.groundClearance}</span>
                            </div>
                          )}
                          
                          {variant?.length && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Length</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.length}</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    
                    {/* Expanded content */}
                    {expandedSpecs['dimensions'] && !showSkeleton && (
                      <div className="mt-4 space-y-4">
                        {variant?.width && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Width</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.width}</span>
                          </div>
                        )}
                        
                        {variant?.height && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Height</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.height}</span>
                          </div>
                        )}
                        
                        {variant?.wheelbase && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Wheelbase</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.wheelbase}</span>
                          </div>
                        )}
                        
                        {variant?.turningRadius && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Turning Radius</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.turningRadius}</span>
                          </div>
                        )}
                        
                        {variant?.kerbWeight && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Kerb Weight</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.kerbWeight}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* View More/Less Button */}
                    <div className="mt-6 flex justify-center">
                      <button 
                        onClick={() => toggleSpecSection('dimensions')}
                        className="text-red-500 hover:text-red-600 font-medium text-sm flex items-center space-x-1 transition-colors duration-200"
                      >
                        <span>{expandedSpecs['dimensions'] ? 'View less' : 'View more'}</span>
                        <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${expandedSpecs['dimensions'] ? 'rotate-270' : 'rotate-90'}`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tyre & Suspension */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 pb-4">
                    <h3 className="text-xl font-bold text-gray-900">Tyre & Suspension</h3>
                    <button 
                      onClick={() => toggleSpecSection('tyre')}
                      className="p-1"
                    >
                      <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${expandedSpecs['tyre'] ? 'rotate-90' : ''}`} />
                    </button>
                  </div>
                  
                  {/* Content */}
                  <div className="px-6 pb-6">
                    {/* Always visible specs */}
                    <div className="space-y-4">
                      {showSkeleton ? (
                        /* Skeleton loading */
                        <>
                          {[1, 2].map((index) => (
                            <div key={index} className="flex justify-between items-center">
                              <div className="bg-gray-200 animate-pulse h-4 text-base rounded"></div>
                              <div className="bg-gray-200 animate-pulse h-4 w-1/4 rounded"></div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <>
                          {/* Show first 2 specs always */}
                          {variant?.frontTyreProfile && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Front Tyre Profile</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.frontTyreProfile}</span>
                            </div>
                          )}
                          
                          {variant?.rearTyreProfile && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Rear Tyre Profile</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.rearTyreProfile}</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    
                    {/* Expanded content */}
                    {expandedSpecs['tyre'] && !showSkeleton && (
                      <div className="mt-4 space-y-4">
                        {variant?.spareTyreProfile && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Spare Tyre Profile</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.spareTyreProfile}</span>
                          </div>
                        )}
                        
                        {variant?.spareWheelType && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Spare Wheel Type</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.spareWheelType}</span>
                          </div>
                        )}
                        
                        {variant?.frontSuspension && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Front Suspension</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.frontSuspension}</span>
                          </div>
                        )}
                        
                        {variant?.rearSuspension && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Rear Suspension</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.rearSuspension}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* View More/Less Button */}
                    <div className="mt-6 flex justify-center">
                      <button 
                        onClick={() => toggleSpecSection('tyre')}
                        className="text-red-500 hover:text-red-600 font-medium text-sm flex items-center space-x-1 transition-colors duration-200"
                      >
                        <span>{expandedSpecs['tyre'] ? 'View less' : 'View more'}</span>
                        <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${expandedSpecs['tyre'] ? 'rotate-270' : 'rotate-90'}`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Storage */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 pb-4">
                    <h3 className="text-xl font-bold text-gray-900">Storage</h3>
                    <button 
                      onClick={() => toggleSpecSection('storage')}
                      className="p-1"
                    >
                      <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${expandedSpecs['storage'] ? 'rotate-90' : ''}`} />
                    </button>
                  </div>
                  
                  {/* Content */}
                  <div className="px-6 pb-6">
                    {/* Always visible specs */}
                    <div className="space-y-4">
                      {showSkeleton ? (
                        /* Skeleton loading */
                        <>
                          {[1, 2].map((index) => (
                            <div key={index} className="flex justify-between items-center">
                              <div className="bg-gray-200 animate-pulse h-4 text-base rounded"></div>
                              <div className="bg-gray-200 animate-pulse h-4 w-1/4 rounded"></div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <>
                          {/* Show first 2 specs always */}
                          {variant?.cupholders && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Cupholders</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.cupholders}</span>
                            </div>
                          )}
                          
                          {variant?.fuelTankCapacity && (
                            <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                              <span className="text-gray-500 text-sm">Fuel Tank Capacity</span>
                              <span className="text-gray-900 text-sm font-medium">{variant.fuelTankCapacity}</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    
                    {/* Expanded content */}
                    {expandedSpecs['storage'] && !showSkeleton && (
                      <div className="mt-4 space-y-4">
                        {variant?.bootSpace && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Boot Space</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.bootSpace}</span>
                          </div>
                        )}
                        
                        {variant?.bootSpaceAfterFoldingRearRowSeats && (
                          <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                            <span className="text-gray-500 text-sm">Boot Space After Folding Rear Row Seats</span>
                            <span className="text-gray-900 text-sm font-medium">{variant.bootSpaceAfterFoldingRearRowSeats}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* View More/Less Button */}
                    <div className="mt-6 flex justify-center">
                      <button 
                        onClick={() => toggleSpecSection('storage')}
                        className="text-red-500 hover:text-red-600 font-medium text-sm flex items-center space-x-1 transition-colors duration-200"
                      >
                        <span>{expandedSpecs['storage'] ? 'View less' : 'View more'}</span>
                        <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${expandedSpecs['storage'] ? 'rotate-270' : 'rotate-90'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PageSection>

        {/* Section 4: AD Banner + More Variants */}
        <PageSection background="white" maxWidth="7xl">
          <div className="space-y-8">
            {/* AD Banner */}
            <div className="bg-gray-300 rounded-lg py-20 text-center">
              <h2 className="text-3xl font-bold text-gray-600">AD Banner</h2>
            </div>

            {/* More Variants Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">More {displayBrandName} {displayModelName} {variantName} Variants</h2>
              
              {/* Filter Options - Dynamic based on available variants */}
              <div className="flex flex-wrap gap-3">
                {availableFilters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      activeFilter === filter
                        ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Variant Cards - Dynamic (Show only 8) */}
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading variants...</p>
                  </div>
                ) : filteredVariants.length > 0 ? (
                  filteredVariants.slice(0, 8).map((variantItem) => (
                    <VariantCard
                      key={variantItem.id}
                      variant={variantItem}
                      onClick={() => {
                        const brandSlug = displayBrandName?.toLowerCase().replace(/\s+/g, '-')
                        const modelSlug = displayModelName?.toLowerCase().replace(/\s+/g, '-')
                        const variantSlug = variantItem.name.toLowerCase().replace(/\s+/g, '-')
                        router.push(`/${brandSlug}-cars/${modelSlug}/variant/${variantSlug}`)
                      }}
                      onGetPrice={(e) => {
                        e.stopPropagation()
                        const brandSlug = displayBrandName?.toLowerCase().replace(/\s+/g, '-')
                        const modelSlug = displayModelName?.toLowerCase().replace(/\s+/g, '-')
                        const varSlug = variant.name?.toLowerCase().replace(/\s+/g, '-')
                        router.push(`/${brandSlug}-cars/${modelSlug}/price-in/mumbai?variant=${varSlug}`)
                      }}
                      onCompare={(e) => e.stopPropagation()}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No variants found for the selected filter.</p>
                  </div>
                )}
              </div>

              {/* View All Variants Button - Only show if more than 8 variants */}
              {!loading && transformedVariants.length > 8 && (
                <div className="text-center pt-4">
                  <button 
                    className="text-red-600 hover:text-orange-600 font-medium text-lg"
                    onClick={() => {
                      const brandSlug = displayBrandName?.toLowerCase().replace(/\s+/g, '-')
                      const modelSlug = displayModelName?.toLowerCase().replace(/\s+/g, '-')
                      router.push(`/${brandSlug}-cars/${modelSlug}/variants`)
                    }}
                  >
                    View All {transformedVariants.length} Variants
                  </button>
                </div>
              )}
            </div>
          </div>
        </PageSection>

        {/* Section 5: Variant Summary, AD Banner, Engine & Mileage */}
        <PageSection background="white" maxWidth="7xl">
          <div className="space-y-8">
            {/* Variant Summary Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">{displayBrandName} {displayModelName} {variantName} Summary</h2>
              
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <h3 className="text-lg font-bold text-gray-900">Description</h3>
                  </div>
                  {variant?.description ? (
                    <ul className="space-y-2">
                      {parseBulletPoints(variant.description).map((point: string, index: number) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-gray-400 mt-1">•</span>
                          <span className="text-gray-700 text-sm leading-relaxed">{point}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-700 text-sm leading-relaxed mb-3">
                      The {displayBrandName} {displayModelName} is a {currentVariantData.fuelType} {currentVariantData.transmission.toLowerCase()} variant that belongs to the premium hatchback segment. It offers excellent value for money with modern features and was launched in {currentVariantData.launchYear}.
                      {showSummaryDescription && (
                        <span> The vehicle offers excellent value for money with its efficient engine, modern features, and reliable performance. It's designed for urban commuting with a focus on fuel efficiency and ease of driving.</span>
                      )}
                    </p>
                  )}
                  {!variant?.description && (
                    <button 
                      onClick={() => setShowSummaryDescription(!showSummaryDescription)}
                      className="text-red-500 hover:text-red-600 text-sm font-medium"
                    >
                      {showSummaryDescription ? 'Show Less' : 'Read More'}
                    </button>
                  )}
                </div>

                {/* Exterior Design */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <h3 className="text-lg font-bold text-gray-900">Exterior Design</h3>
                  </div>
                  {variant?.exteriorDesign ? (
                    <ul className="space-y-2">
                      {parseBulletPoints(variant.exteriorDesign).map((point: string, index: number) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-gray-400 mt-1">•</span>
                          <span className="text-gray-700 text-sm leading-relaxed">{point}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-700 text-sm leading-relaxed mb-3">
                      The {displayBrandName} {displayModelName} comes with a modern and stylish exterior design. The front features sleek headlamps with integrated DRLs and a bold grille design that gives it a distinctive appearance.
                      {showSummaryExterior && (
                        <span> The side profile features clean lines with subtle character lines running along the doors. The rear design includes wraparound tail lamps and a compact boot lid.</span>
                      )}
                    </p>
                  )}
                  {!variant?.exteriorDesign && (
                    <button 
                      onClick={() => setShowSummaryExterior(!showSummaryExterior)}
                      className="text-red-500 hover:text-red-600 text-sm font-medium"
                    >
                      {showSummaryExterior ? 'Show Less' : 'Read More'}
                    </button>
                  )}
                </div>

                {/* Comfort & Convenience */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <h3 className="text-lg font-bold text-gray-900">Comfort & Convenience</h3>
                  </div>
                  {variant?.comfortConvenience ? (
                    <ul className="space-y-2">
                      {parseBulletPoints(variant.comfortConvenience).map((point: string, index: number) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-gray-400 mt-1">•</span>
                          <span className="text-gray-700 text-sm leading-relaxed">{point}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-700 text-sm leading-relaxed mb-3">
                      The interior features a well-designed dashboard with premium materials. It comes equipped with a touchscreen infotainment system, automatic climate control, and various comfort features for an enhanced driving experience.
                      {showSummaryComfort && (
                        <span> Additional comfort features include air conditioning, power windows, central locking, and comfortable fabric upholstery. The cabin offers adequate storage spaces including door pockets, glove compartment, and cup holders.</span>
                      )}
                    </p>
                  )}
                  {!variant?.comfortConvenience && (
                    <button 
                      onClick={() => setShowSummaryComfort(!showSummaryComfort)}
                      className="text-red-500 hover:text-red-600 text-sm font-medium"
                    >
                      {showSummaryComfort ? 'Show Less' : 'Read More'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* AD Banner */}
            <div className="bg-gray-300 rounded-lg py-20 text-center">
              <h2 className="text-3xl font-bold text-gray-600">AD Banner</h2>
            </div>

            {/* Engine Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">{displayBrandName} {displayModelName} {variantName} Engine</h2>
              
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {/* Engine Header - Always Visible */}
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-orange-500 rounded flex items-center justify-center">
                        <span className="text-white font-bold text-sm">1</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {variant?.engineName || currentVariantData.engine}
                      </h3>
                    </div>
                    <button 
                      onClick={() => setExpandedEngine(!expandedEngine)}
                      className="text-red-500 hover:text-red-600 font-medium text-sm transition-colors"
                    >
                      {expandedEngine ? 'Show Less' : 'Read More'}
                    </button>
                  </div>
                  
                  {/* Collapsed Preview */}
                  {!expandedEngine && variant?.engineSummary && (
                    <ul className="space-y-1 mt-3">
                      {parseBulletPoints(variant.engineSummary).slice(0, 1).map((point: string, idx: number) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="text-gray-400 mt-1">•</span>
                          <span className="text-gray-600 text-sm">{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {!expandedEngine && !variant?.engineSummary && (
                    <p className="text-gray-600 text-sm mt-3 line-clamp-2">
                      Suitable for both city driving and highway cruising. The {variant?.engineName || currentVariantData.engine} engine offers excellent fuel efficiency with smooth acceleration.
                    </p>
                  )}
                </div>

                {/* Expanded Content */}
                {expandedEngine && (
                  <div className="px-6 pb-6">
                    {/* Backend engine summary with bullet points */}
                    {variant?.engineSummary ? (
                      <>
                        <ul className="space-y-2 mb-6">
                          {parseBulletPoints(variant.engineSummary).map((point: string, idx: number) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <span className="text-gray-400 mt-1">•</span>
                              <span className="text-gray-700 text-sm leading-relaxed">{point}</span>
                            </li>
                          ))}
                        </ul>
                        
                        {/* Engine Specs from backend */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          {/* Transmission Label */}
                          <h4 className="font-bold text-gray-900 mb-3 text-center">
                            {(() => {
                              const trans = variant?.engineTransmission || variant?.transmission || currentVariantData.transmission
                              return trans.toLowerCase() === 'manual' ? 'Manual' : trans.toUpperCase()
                            })()}
                          </h4>
                          
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Power:</p>
                              <p className="font-medium text-gray-900">{variant?.enginePower || currentVariantData.power}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Torque:</p>
                              <p className="font-medium text-gray-900">{variant?.engineTorque || currentVariantData.torque}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Transmission:</p>
                              <p className="font-medium text-gray-900">{variant?.engineSpeed || 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-700 text-sm leading-relaxed mb-6">
                          Suitable for both city driving and highway cruising. The {variant?.engineName || currentVariantData.engine} engine offers excellent fuel efficiency with smooth acceleration. It provides a perfect balance between performance and economy, making it ideal for daily commuting and long-distance travel.
                        </p>
                        
                        {/* Engine Specs */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-bold text-gray-900 mb-3 text-center">
                            {(() => {
                              const trans = variant?.engineTransmission || variant?.transmission || currentVariantData.transmission
                              return trans.toLowerCase() === 'manual' ? 'Manual' : trans.toUpperCase()
                            })()}
                          </h4>
                          
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Power:</p>
                              <p className="font-medium text-gray-900">{variant?.enginePower || currentVariantData.power}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Torque:</p>
                              <p className="font-medium text-gray-900">{variant?.engineTorque || currentVariantData.torque}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Transmission:</p>
                              <p className="font-medium text-gray-900">{variant?.engineSpeed || 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Mileage Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">{displayBrandName} {displayModelName} {variantName} Mileage</h2>
              
              <div className="flex justify-center">
                <div className="w-64 bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-300">
                  {/* Engine Header */}
                  <div className="text-center mb-4">
                    <h3 className="text-red-500 font-bold text-sm mb-1">Engine & Transmission</h3>
                    <h4 className="text-red-500 font-bold text-base mb-1">
                      {variant?.mileageEngineName || variant?.engineName || currentVariantData.engine}
                    </h4>
                  </div>

                  {/* Mileage Details */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 text-sm">Company Claimed</span>
                      <span className="text-gray-900 font-bold text-sm">
                        {variant?.mileageCompanyClaimed || currentVariantData.mileage} Kmpl
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 text-sm">City Real World</span>
                      <span className="text-gray-900 font-bold text-sm">
                        {variant?.mileageCityRealWorld || (currentVariantData.mileage * 0.85).toFixed(1)} Kmpl
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 text-sm">Highway Real World</span>
                      <span className="text-gray-900 font-bold text-sm">
                        {variant?.mileageHighwayRealWorld || (currentVariantData.mileage * 1.1).toFixed(1)} Kmpl
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PageSection>

        {/* Section 6: City On-Road Prices, AD Banner & Upcoming Cars */}
        <PageSection background="white" maxWidth="7xl">
          <div className="space-y-8">
            {/* City On-Road Prices */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">{brandName} {modelName} {variantName} Price Across India</h2>
              
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {/* Table Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                    <h3 className="text-lg font-semibold text-gray-900">City</h3>
                    <h3 className="text-lg font-semibold text-gray-900">On-Road Prices</h3>
                  </div>
                </div>
                
                {/* City Price List */}
                <div className="divide-y divide-gray-200">
                  {currentVariantData.cities.map((city, index) => (
                    <div key={city.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
                        <span className="text-red-600 font-medium hover:text-red-700 cursor-pointer">
                          {city.name}
                        </span>
                        <span className="text-gray-900 font-semibold">
                          Rs. {(currentVariantData.price + (index * 0.1) + 0.5).toFixed(2)} Lakh
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* View More Cities Button */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-center">
                  <button className="text-gray-600 hover:text-gray-800 font-medium text-sm flex items-center justify-center space-x-1">
                    <span>View More Cities</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* AD Banner */}
            <div className="bg-gray-300 rounded-lg py-20 text-center">
              <h2 className="text-3xl font-bold text-gray-600">AD Banner</h2>
            </div>

            {/* Upcoming Cars Section */}
            <UpcomingCars />
          </div>
        </PageSection>

        {/* Section 7: New Launched Cars, AD Banner & Feedback */}
        <PageSection background="white" maxWidth="7xl">
          <div className="space-y-8">
            {/* New Launched Cars */}
            <NewLaunchedCars />

            {/* AD Banner */}
            <div className="bg-gray-300 rounded-lg py-20 text-center">
              <h2 className="text-3xl font-bold text-gray-600">AD Banner</h2>
            </div>

            {/* Feedback Section */}
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Share Your Feedback</h2>
                <p className="text-gray-600">Help us improve by sharing your thoughts about this page</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <form className="space-y-6">
                  {/* Feedback Textarea */}
                  <div>
                    <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Feedback
                    </label>
                    <textarea
                      id="feedback"
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                      placeholder="Tell us what you think about this car page..."
                    ></textarea>
                  </div>

                  {/* Name Input */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Enter your name"
                    />
                  </div>

                  {/* Email Input */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Enter your email"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Submit Feedback
                  </button>
                </form>
              </div>
            </div>
          </div>
        </PageSection>
      </div>

      <Footer />
    </div>
  )
}
