'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronDown, ChevronUp, Share2, Heart, Calendar, Fuel, Users } from 'lucide-react'
import { formatPrice } from '@/utils/priceFormatter'
import { calculateOnRoadPrice, OnRoadPriceBreakup } from '@/lib/rto-data-optimized'
import PageSection from '../common/PageSection'
import AdBanner from '../home/AdBanner'
import Ad3DCarousel from '../ads/Ad3DCarousel'
import Footer from '../Footer'
import VariantCard from '../car-model/VariantCard'
import CarCard from '../home/CarCard'
import { KillerWhaleSpinner } from '../common/KillerWhaleLoader'

// Helper function to format price in Indian numbering system
const formatIndianPrice = (price: number): string => {
  return price.toLocaleString('en-IN', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  })
}

// Helper function to format launch date
const formatLaunchDate = (date: string): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const parts = date.split('-')
  if (parts.length === 2) {
    const year = parts[0]
    const monthIndex = parseInt(parts[1]) - 1
    return `${months[monthIndex]} ${year}`
  }
  return date
}

// Helper function to normalize variant names for matching - moved outside component for SSR initialization
const normalizeForMatch = (str: string) =>
  str
    .toLowerCase()
    .replace(/\s*\(([^)]*)\)/g, '-$1-') // Extract content from parentheses: "S (O)" -> "s-o-"
    .replace(/[()]/g, '')  // Remove any remaining parentheses
    .replace(/\s+/g, '-')  // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '') // Remove all non-alphanumeric except hyphens
    .replace(/-+/g, '-')   // Replace multiple consecutive hyphens with single hyphen
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens

// Helper to find lowest price variant from array
const findLowestPriceVariant = (variants: any[]) => {
  if (!variants || variants.length === 0) return null
  return variants.reduce((lowest, current) =>
    (current.price < lowest.price) ? current : lowest, variants[0]
  )
}

interface PriceBreakupPageProps {
  brandSlug?: string
  modelSlug?: string
  citySlug?: string
  // SSR initial data
  initialBrand?: any
  initialModel?: any
  initialVariants?: any[]
}

export default function PriceBreakupPage({
  brandSlug,
  modelSlug,
  citySlug,
  initialBrand,
  initialModel,
  initialVariants = []
}: PriceBreakupPageProps = {}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [showVariantDropdown, setShowVariantDropdown] = useState(false)
  const variantDropdownRef = useRef<HTMLDivElement>(null)

  // Get URL parameters - support both new slug-based URLs and old query params
  const getBrandName = () => {
    if (brandSlug) {
      // Convert slug to display name: "honda" -> "Honda"
      return brandSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    }
    return searchParams.get('brand') || 'Honda'
  }

  const getModelName = () => {
    if (modelSlug) {
      // Convert slug to display name: "elevate" -> "Elevate"
      return modelSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    }
    return searchParams.get('model') || 'Elevate'
  }

  const getCityName = () => {
    if (citySlug) {
      // Convert slug to display name: "bangalore" -> "Bangalore, Karnataka"
      const cityMap: { [key: string]: string } = {
        'mumbai': 'Mumbai, Maharashtra',
        'delhi': 'Delhi, NCR',
        'bangalore': 'Bangalore, Karnataka',
        'bengaluru': 'Bangalore, Karnataka',
        'chennai': 'Chennai, Tamil Nadu',
        'hyderabad': 'Hyderabad, Telangana',
        'pune': 'Pune, Maharashtra',
        'kolkata': 'Kolkata, West Bengal',
        'ahmedabad': 'Ahmedabad, Gujarat',
        'jaipur': 'Jaipur, Rajasthan'
      }
      return cityMap[citySlug.toLowerCase()] || `${citySlug.charAt(0).toUpperCase() + citySlug.slice(1)}, India`
    }
    return searchParams.get('city') || 'Mumbai, Maharashtra'
  }

  const brandName = getBrandName()
  const modelName = getModelName()
  const variantParam = searchParams.get('variant')
  const [selectedCity, setSelectedCity] = useState(() => getCityName())

  // Initialize selectedVariantName from SSR data immediately (no waiting for useEffect)
  const [selectedVariantName, setSelectedVariantName] = useState<string>(() => {
    if (initialVariants && initialVariants.length > 0) {
      // Try to match variant from URL param first
      if (variantParam) {
        const normalizedParam = normalizeForMatch(variantParam)
        const matched = initialVariants.find((v: any) =>
          normalizeForMatch(v.name) === normalizedParam
        )
        if (matched) return matched.name
        // Try partial match
        const partial = initialVariants.find((v: any) => {
          const normalized = normalizeForMatch(v.name)
          return normalized.includes(normalizedParam) || normalizedParam.includes(normalized)
        })
        if (partial) return partial.name
      }
      // Fallback to lowest price variant
      const lowest = findLowestPriceVariant(initialVariants)
      return lowest?.name || ''
    }
    return ''
  })
  const [activeSection, setActiveSection] = useState('overview')

  // Section navigation data
  const sections = [
    { id: 'overview', name: 'Overview' },
    { id: 'price-breakup', name: 'Price Breakup' },
    { id: 'emi', name: 'EMI' },
    { id: 'variants', name: 'Variants' },
    { id: 'similar-cars', name: 'Similar Cars' },
    { id: 'popular-cars', name: 'Popular Cars' },
    { id: 'reviews', name: 'Reviews' },
    { id: 'faq', name: 'FAQ' },
    { id: 'dealers', name: 'Dealers' },
    { id: 'price-cities', name: 'Price Across Cities' },
    { id: 'feedback', name: 'Feedback' }
  ]

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const headerOffset = 60 // Height of sticky header
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })

      // Update active section after scroll
      setTimeout(() => setActiveSection(sectionId), 100)
    }
  }

  // Scroll spy - update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100 // Offset for better UX

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id)
        if (section) {
          const sectionTop = section.offsetTop
          if (scrollPosition >= sectionTop) {
            setActiveSection(sections[i].id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Call once on mount

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Update city when citySlug prop changes
  useEffect(() => {
    console.log('🔍 citySlug changed:', citySlug)
    const cityMap: { [key: string]: string } = {
      'mumbai': 'Mumbai, Maharashtra',
      'delhi': 'Delhi, NCR',
      'bangalore': 'Bangalore, Karnataka',
      'bengaluru': 'Bangalore, Karnataka',
      'chennai': 'Chennai, Tamil Nadu',
      'hyderabad': 'Hyderabad, Telangana',
      'pune': 'Pune, Maharashtra',
      'kolkata': 'Kolkata, West Bengal',
      'ahmedabad': 'Ahmedabad, Gujarat',
      'jaipur': 'Jaipur, Rajasthan'
    }

    if (citySlug) {
      const newCity = cityMap[citySlug.toLowerCase()] || `${citySlug.charAt(0).toUpperCase() + citySlug.slice(1)}, India`
      console.log('✅ Setting city to:', newCity)
      setSelectedCity(newCity)
    }
  }, [citySlug])

  // Variants state - Use multi-select filters like VariantPage
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['All'])
  const [modelVariants, setModelVariants] = useState<any[]>(initialVariants)
  const [loadingVariants, setLoadingVariants] = useState(initialVariants.length === 0)
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  // Popular cars state
  const [popularCars, setPopularCars] = useState<any[]>([])
  const [loadingPopularCars, setLoadingPopularCars] = useState(true)

  // On-Road Price Calculation - Calculate immediately from SSR data
  const initialPriceBreakup = useMemo(() => {
    if (!selectedVariantName || !initialVariants || initialVariants.length === 0) return null
    const variant = initialVariants.find((v: any) => v.name === selectedVariantName)
    if (!variant) return null
    const state = selectedCity.split(',')[1]?.trim() || 'Maharashtra'
    const fuelType = variant.fuel || variant.fuelType || 'Petrol'
    console.log('⚡ Instant SSR price calculation:', { variant: variant.name, price: variant.price, state, fuel: fuelType })
    return calculateOnRoadPrice(variant.price, state, fuelType)
  }, [selectedVariantName, selectedCity, initialVariants])

  const [priceBreakup, setPriceBreakup] = useState<OnRoadPriceBreakup | null>(initialPriceBreakup)
  const [isTextExpanded, setIsTextExpanded] = useState(false)

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

  const displayEMI = priceBreakup ? calculateDisplayEMI(priceBreakup.totalOnRoadPrice) : 0

  // Hero image - use SSR data if available
  const [heroImage, setHeroImage] = useState<string>(() => {
    if (initialModel?.heroImage) {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'
      return initialModel.heroImage.startsWith('http')
        ? initialModel.heroImage
        : `${backendUrl}${initialModel.heroImage}`
    }
    return 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=500&fit=crop'
  })

  // Model and Brand data - initialize from SSR props
  const [model, setModel] = useState<any>(initialModel || null)
  const [brand, setBrand] = useState<any>(initialBrand || null)

  // Fetch model, brand, and variants from backend - SKIP if SSR data exists
  useEffect(() => {
    // Skip fetch if we have SSR data
    if (initialVariants && initialVariants.length > 0 && initialModel) {
      console.log('✅ Using SSR data, skipping client-side fetch. Variants:', initialVariants.length)
      setLoadingVariants(false)
      return
    }

    const fetchData = async () => {
      try {
        setLoadingVariants(true)
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

        console.log('🔍 PriceBreakup: Fetching data for:', { brandName, modelName, variantParam })

        // Fetch all models to find the current model
        const modelsRes = await fetch(`${backendUrl}/api/models`)
        const models = await modelsRes.json()

        // Find the model by name (case-insensitive)
        const foundModel = models.find((m: any) =>
          m.name.toLowerCase() === modelName.toLowerCase()
        )

        if (foundModel) {
          setModel(foundModel)

          // Fetch hero image - handle full URLs and relative paths
          if (foundModel.heroImage) {
            const imageUrl = foundModel.heroImage.startsWith('http')
              ? foundModel.heroImage
              : foundModel.heroImage.startsWith('/uploads/') || foundModel.heroImage.startsWith('/')
                ? `${backendUrl}${foundModel.heroImage}`
                : `${backendUrl}/uploads/${foundModel.heroImage}`
            console.log('✅ Setting hero image to:', imageUrl)
            setHeroImage(imageUrl)
          } else {
            console.warn('⚠️ No hero image found for model:', foundModel.name)
          }

          // Fetch variants for this model - use full=true to get keyFeatures and power
          const variantsRes = await fetch(`${backendUrl}/api/variants?modelId=${foundModel.id}&full=true`)
          const variants = await variantsRes.json()

          console.log('✅ Fetched variants:', variants.length)

          // Transform variants to match the expected format
          const transformedVariants = variants.map((v: any) => ({
            id: v.id,
            name: v.name,
            fuel: v.fuel || v.fuelType || 'Petrol',
            transmission: v.transmission || 'Manual',
            power: v.maxPower || v.power || '',
            keyFeatures: v.keyFeatures || [],
            features: Array.isArray(v.keyFeatures) ? v.keyFeatures.join(', ') : (v.keyFeatures || ''),
            price: v.price // Keep in rupees for exact calculation
          }))

          setModelVariants(transformedVariants)

          // Set default variant: use URL param if provided, otherwise lowest price variant
          if (variantParam) {
            // Enhanced normalize function to handle all edge cases
            // MUST match the normalization in VariantPage.tsx exactly
            const normalizeForMatch = (str: string) =>
              str
                .toLowerCase()
                .replace(/\s*\(([^)]*)\)/g, '-$1-') // Extract content from parentheses: "S (O)" -> "s-o-"
                .replace(/[()]/g, '')  // Remove any remaining parentheses
                .replace(/\s+/g, '-')  // Replace spaces with hyphens
                .replace(/[^a-z0-9-]/g, '') // Remove all non-alphanumeric except hyphens
                .replace(/-+/g, '-')   // Replace multiple consecutive hyphens with single hyphen
                .replace(/^-|-$/g, '') // Remove leading/trailing hyphens

            const normalizedParam = normalizeForMatch(variantParam)

            console.log('🔍 Variant matching - Input:', {
              variantParam,
              normalizedParam
            })

            // Try to find match by comparing normalized versions
            const matchedVariant = transformedVariants.find((v: any) => {
              const normalizedVariantName = normalizeForMatch(v.name)
              const isMatch = normalizedVariantName === normalizedParam

              if (isMatch) {
                console.log('✅ MATCH FOUND:', {
                  original: v.name,
                  normalized: normalizedVariantName,
                  urlParam: normalizedParam
                })
              }

              return isMatch
            })

            console.log('🔍 Variant matching - Results:', {
              variantParam,
              normalizedParam,
              matchedVariant: matchedVariant?.name,
              allVariants: transformedVariants.map((v: any) => ({
                name: v.name,
                normalized: normalizeForMatch(v.name),
                matches: normalizeForMatch(v.name) === normalizedParam
              }))
            })

            if (matchedVariant) {
              setSelectedVariantName(matchedVariant.name)
              console.log('✅ Successfully matched variant from URL:', matchedVariant.name)
            } else {
              // Fallback: Try partial matching if exact match fails
              const partialMatch = transformedVariants.find((v: any) => {
                const normalizedName = normalizeForMatch(v.name)
                return normalizedName.includes(normalizedParam) || normalizedParam.includes(normalizedName)
              })

              if (partialMatch) {
                setSelectedVariantName(partialMatch.name)
                console.log('✅ Matched variant using partial match:', partialMatch.name)
              } else {
                // Final fallback to lowest price variant if no match found
                const lowestPriceVariant = transformedVariants.reduce((lowest: any, current: any) => {
                  return (current.price < lowest.price) ? current : lowest
                }, transformedVariants[0])
                setSelectedVariantName(lowestPriceVariant?.name || '')
                console.warn('⚠️ No variant match found, using lowest price:', lowestPriceVariant?.name, {
                  searchedFor: normalizedParam,
                  availableVariants: transformedVariants.map((v: any) => normalizeForMatch(v.name))
                })
              }
            }
          } else {
            // Find lowest price variant
            const lowestPriceVariant = transformedVariants.reduce((lowest: any, current: any) => {
              return (current.price < lowest.price) ? current : lowest
            }, transformedVariants[0])

            setSelectedVariantName(lowestPriceVariant?.name || '')
            console.log('🎯 Auto-selected lowest price variant:', lowestPriceVariant?.name, '₹', lowestPriceVariant?.price)
          }
        }

        setLoadingVariants(false)
      } catch (error) {
        console.error('❌ Error fetching data:', error)
        setLoadingVariants(false)
      }
    }

    fetchData()
  }, [brandName, modelName, variantParam, initialVariants, initialModel])

  // Fetch popular cars from backend
  useEffect(() => {
    const fetchPopularCars = async () => {
      try {
        setLoadingPopularCars(true)
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

        // Fetch all models, brands, and variants
        const [modelsRes, brandsRes, variantsRes] = await Promise.all([
          fetch(`${backendUrl}/api/models`),
          fetch(`${backendUrl}/api/brands`),
          fetch(`${backendUrl}/api/variants?fields=minimal`)
        ])

        if (!modelsRes.ok || !brandsRes.ok || !variantsRes.ok) {
          console.error('Failed to fetch popular cars data')
          setPopularCars([])
          setLoadingPopularCars(false)
          return
        }

        const models = await modelsRes.json()
        const brands = await brandsRes.json()
        const variants = await variantsRes.json()

        // Create a map of brand IDs to brand names
        const brandMap = brands.reduce((acc: Record<string, string>, brand: any) => {
          acc[brand.id] = brand.name
          return acc
        }, {})

        // Filter only popular models
        const popularModels = models.filter((model: any) => model.isPopular === true)

        // Process each popular model
        const processedCars = popularModels.map((model: any) => {
          // Find all variants for this model
          const modelVariants = variants.filter((v: any) => v.modelId === model.id)

          // Find lowest price variant
          const lowestPrice = modelVariants.length > 0
            ? Math.min(...modelVariants.map((v: any) => v.price || 0))
            : model.price || 0

          // Get unique fuel types and transmissions
          const fuelTypes = model.fuelTypes && model.fuelTypes.length > 0
            ? model.fuelTypes
            : Array.from(new Set(modelVariants.map((v: any) => v.fuel).filter(Boolean)))

          const transmissions = model.transmissions && model.transmissions.length > 0
            ? model.transmissions
            : Array.from(new Set(modelVariants.map((v: any) => v.transmission).filter(Boolean)))

          // Get hero image - handle full URLs and relative paths
          const heroImage = model.heroImage
            ? (model.heroImage.startsWith('http')
              ? model.heroImage
              : model.heroImage.startsWith('/uploads/') || model.heroImage.startsWith('/')
                ? `${backendUrl}${model.heroImage}`
                : `${backendUrl}/uploads/${model.heroImage}`)
            : ''

          return {
            id: model.id,
            name: model.name,
            brand: model.brandId,
            brandName: brandMap[model.brandId] || 'Unknown',
            image: heroImage,
            startingPrice: lowestPrice,
            fuelTypes: fuelTypes.length > 0 ? fuelTypes : ['Petrol'],
            transmissions: transmissions.length > 0 ? transmissions : ['Manual'],
            seating: model.seating || 5,
            launchDate: model.launchDate ? `Launched ${formatLaunchDate(model.launchDate)}` : 'Launched',
            slug: `${(brandMap[model.brandId] || '').toLowerCase().replace(/\s+/g, '-')}-${model.name.toLowerCase().replace(/\s+/g, '-')}`,
            isNew: model.isNew || false,
            isPopular: model.isPopular || false,
            popularRank: model.popularRank || null
          }
        })

        // Sort by popularRank
        const sortedCars = processedCars.sort((a: any, b: any) => {
          const rankA = a.popularRank || 999
          const rankB = b.popularRank || 999
          return rankA - rankB
        })

        setPopularCars(sortedCars)
      } catch (error) {
        console.error('Error fetching popular cars:', error)
      } finally {
        setLoadingPopularCars(false)
      }
    }

    fetchPopularCars()
  }, [])

  const mockVariants = [
    'V Apex Summer Edition',
    'VX',
    'ZX',
    'ZX CVT'
  ]
  const mockCities = [
    'Mumbai, Maharashtra',
    'Delhi, NCR',
    'Bangalore, Karnataka',
    'Chennai, Tamil Nadu'
  ]

  // Similar cars data - using exact same logic as CarModelPage
  const [similarCars, setSimilarCars] = useState<any[]>([])
  const [loadingSimilarCars, setLoadingSimilarCars] = useState(true)

  // Helper function to format launch date (same as CarModelPage)
  const formatLaunchDateForSimilar = (date: string): string => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const parts = date.split('-')
    if (parts.length === 2) {
      const year = parts[0]
      const monthIndex = parseInt(parts[1]) - 1
      return `${months[monthIndex]} ${year}`
    }
    return date
  }

  // Fetch similar cars using exact same logic as CarModelPage
  useEffect(() => {
    const fetchSimilarCars = async () => {
      if (!model?.id) {
        setSimilarCars([])
        setLoadingSimilarCars(false)
        return
      }

      try {
        setLoadingSimilarCars(true)
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

        // Fetch all models, brands, and variants (same as CarModelPage)
        const [modelsRes, brandsRes, variantsRes] = await Promise.all([
          fetch(`${backendUrl}/api/models`),
          fetch(`${backendUrl}/api/brands`),
          fetch(`${backendUrl}/api/variants?fields=minimal`)
        ])

        if (!modelsRes.ok || !brandsRes.ok || !variantsRes.ok) {
          console.error('Failed to fetch similar cars data')
          setSimilarCars([])
          setLoadingSimilarCars(false)
          return
        }

        const models = await modelsRes.json()
        const brands = await brandsRes.json()
        const variants = await variantsRes.json()

        // Create a map of brand IDs to brand names (same as CarModelPage)
        const brandMap = brands.reduce((acc: Record<string, string>, brand: any) => {
          acc[brand.id] = brand.name
          return acc
        }, {})

        // Process each model to find lowest variant price (same as CarModelPage)
        const processedCars = models
          .filter((m: any) => m.id !== model.id) // Exclude current model
          .map((m: any) => {
            // Find all variants for this model
            const modelVariants = variants.filter((v: any) => v.modelId === m.id)

            // Find lowest price variant
            const lowestPrice = modelVariants.length > 0
              ? Math.min(...modelVariants.map((v: any) => v.price || 0))
              : m.price || 0

            // Get unique fuel types and transmissions from model or variants
            const fuelTypes = m.fuelTypes && m.fuelTypes.length > 0
              ? m.fuelTypes
              : Array.from(new Set(modelVariants.map((v: any) => v.fuel).filter(Boolean)))

            const transmissions = m.transmissions && m.transmissions.length > 0
              ? m.transmissions
              : Array.from(new Set(modelVariants.map((v: any) => v.transmission).filter(Boolean)))

            // Get hero image from model (same as CarModelPage)
            const heroImage = m.heroImage
              ? (m.heroImage.startsWith('http')
                ? m.heroImage
                : `${backendUrl}${m.heroImage}`)
              : ''

            return {
              id: m.id,
              name: m.name,
              brand: m.brandId,
              brandName: brandMap[m.brandId] || 'Unknown',
              image: heroImage,
              startingPrice: lowestPrice,
              fuelTypes: fuelTypes.length > 0 ? fuelTypes : ['Petrol'],
              transmissions: transmissions.length > 0 ? transmissions : ['Manual'],
              seating: m.seating || 5,
              launchDate: m.launchDate ? `Launched ${formatLaunchDateForSimilar(m.launchDate)}` : 'Launched',
              slug: `${(brandMap[m.brandId] || '').toLowerCase().replace(/\s+/g, '-')}-${m.name.toLowerCase().replace(/\s+/g, '-')}`,
              isNew: m.isNew || false,
              isPopular: m.isPopular || false
            }
          })

        setSimilarCars(processedCars)
        setLoadingSimilarCars(false)
      } catch (error) {
        console.error('Error fetching similar cars:', error)
        setSimilarCars([])
        setLoadingSimilarCars(false)
      }
    }

    fetchSimilarCars()
  }, [model?.id])


  // Use real variants from backend, fallback to empty array if loading
  const allVariants = modelVariants

  // Helper function to check if transmission is automatic type
  const isAutomaticTransmission = (transmission: string) => {
    const automaticTypes = ['automatic', 'cvt', 'amt', 'dct', 'torque converter', 'dual clutch']
    return automaticTypes.some(type => transmission.toLowerCase().includes(type))
  }

  // Helper function to check if transmission is manual type
  const isManualTransmission = (transmission: string) => {
    return transmission.toLowerCase().includes('manual') ||
      (transmission.toLowerCase() === 'mt') ||
      (!isAutomaticTransmission(transmission) && transmission.toLowerCase() !== '')
  }

  // Generate dynamic filters based on available variants - matches VariantPage
  const getDynamicFilters = () => {
    const filters = ['All']
    const fuelTypes = new Set<string>()
    let hasAutomatic = false
    let hasManual = false

    allVariants.forEach(variant => {
      if (variant.fuel) fuelTypes.add(variant.fuel)
      if (variant.transmission) {
        if (isAutomaticTransmission(variant.transmission)) {
          hasAutomatic = true
        }
        if (isManualTransmission(variant.transmission)) {
          hasManual = true
        }
      }
    })

    // Add fuel types first
    fuelTypes.forEach(fuel => filters.push(fuel))

    // Add transmission types (Manual before Automatic like VariantPage)
    if (hasManual) filters.push('Manual')
    if (hasAutomatic) filters.push('Automatic')

    return filters
  }

  const availableFilters = getDynamicFilters()

  // Filter variants based on selected filters (multi-select like VariantPage)
  const getFilteredVariants = () => {
    if (selectedFilters.includes('All')) {
      return allVariants
    }

    return allVariants.filter(variant => {
      // Check if variant matches any of the selected filters
      const matchesFuel = selectedFilters.some(filter =>
        ['Petrol', 'Diesel', 'CNG', 'Electric'].includes(filter) && variant.fuel === filter
      )
      const matchesAutomatic = selectedFilters.includes('Automatic') &&
        variant.transmission && isAutomaticTransmission(variant.transmission)
      const matchesManual = selectedFilters.includes('Manual') &&
        variant.transmission && isManualTransmission(variant.transmission)

      return matchesFuel || matchesAutomatic || matchesManual
    })
  }

  const filteredVariants = getFilteredVariants()

  // Handle filter toggle (multi-select) - Exact copy from VariantPage
  const handleFilterToggle = (filter: string) => {
    if (filter === 'All') {
      setSelectedFilters(['All'])
    } else {
      setSelectedFilters(prev => {
        // Remove 'All' if selecting a specific filter
        const withoutAll = prev.filter(f => f !== 'All')

        // Toggle the clicked filter
        if (withoutAll.includes(filter)) {
          const newFilters = withoutAll.filter(f => f !== filter)
          // If no filters left, select 'All'
          return newFilters.length === 0 ? ['All'] : newFilters
        } else {
          return [...withoutAll, filter]
        }
      })
    }
  }

  const handleVariantClick = (variant: any) => {
    const brandSlug = brandName?.toLowerCase().replace(/\s+/g, '-')
    const modelSlug = modelName?.toLowerCase().replace(/\s+/g, '-')
    const variantSlug = variant.name.toLowerCase().replace(/\s+/g, '-')
    router.push(`/${brandSlug}-cars/${modelSlug}/${variantSlug}`)
  }

  // Note: Model image is now fetched in the main fetchData useEffect above
  // This separate useEffect is no longer needed as it duplicates the logic

  // Listen for city changes from localStorage (when user returns from location page)
  useEffect(() => {
    const handleStorageChange = () => {
      const savedCity = localStorage.getItem('selectedCity')
      if (savedCity && savedCity !== selectedCity) {
        setSelectedCity(savedCity)
        // Update URL with new city
        const brandSlug = brandName.toLowerCase().replace(/\s+/g, '-')
        const modelSlug = modelName.toLowerCase().replace(/\s+/g, '-')
        const citySlug = savedCity.split(',')[0].toLowerCase().replace(/\s+/g, '-')
        router.push(`/${brandSlug}-cars/${modelSlug}/price-in/${citySlug}`)
      }
    }

    // Listen for storage events
    window.addEventListener('storage', handleStorageChange)

    // Check on mount
    handleStorageChange()

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  // Calculate On-Road Price when variant or city changes
  useEffect(() => {
    // Only calculate if we have variants loaded and a selected variant
    if (allVariants.length === 0 || !selectedVariantName) {
      console.log('⏳ Waiting for variants to load...', {
        variantsCount: allVariants.length,
        selectedVariantName
      })
      return
    }

    // Find the selected variant from allVariants
    const selectedVariant = allVariants.find(v => v.name === selectedVariantName)

    if (selectedVariant) {
      // Price is already in rupees from backend (e.g., 1201150)
      const exShowroomPrice = selectedVariant.price

      console.log('💰 Calculating on-road price:', {
        variant: selectedVariantName,
        exShowroomPrice,
        city: selectedCity
      })

      // Extract state from city (e.g., "Mumbai, Maharashtra" -> "Maharashtra")
      const state = selectedCity.split(',')[1]?.trim() || 'Maharashtra'

      // Get fuel type
      const fuelType = selectedVariant.fuel || 'Petrol'

      // Calculate the breakup
      const breakup = calculateOnRoadPrice(exShowroomPrice, state, fuelType)
      setPriceBreakup(breakup)
    } else {
      console.warn('⚠️ Variant not found:', selectedVariantName, 'Available:', allVariants.map(v => v.name))
    }
  }, [selectedVariantName, selectedCity, allVariants])

  // FAQ toggle function
  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  // Mock FAQ data
  const faqs = [
    {
      question: `Q: What is the avg ex-showroom price of ${brandName} ${modelName} base model?`,
      answer: `The ex-showroom price of the ${brandName} ${modelName} base model starts at approximately ₹12.01 Lakh.`
    },
    {
      question: `Q: What is the avg ex-showroom price of ${brandName} ${modelName} top model?`,
      answer: `The ex-showroom price of the ${brandName} ${modelName} top model is around ₹16.93 Lakh.`
    },
    {
      question: `Q: What is the real world versus claimed mileage of ${brandName} ${modelName}?`,
      answer: `The ${brandName} ${modelName} delivers a real-world mileage of 14-16 km/l in city conditions and 18-20 km/l on highways, while the claimed mileage is around 16-18 km/l.`
    },
    {
      question: `Q: What is the seating capacity in ${brandName} ${modelName}?`,
      answer: `The ${brandName} ${modelName} has a seating capacity of 5 people.`
    }
  ]

  // Mock dealers data
  const dealers = [
    {
      name: 'Solitaire Honda',
      address: 'Krish Cars Pvt.Ltd. C/o Shakti Insulated Wires, Shakti Industrial & Commercial Business Centre, Dattapada road, Rajendra Nagar, Borivali (East)',
      city: 'Mumbai, Maharashtra, 400066'
    },
    {
      name: 'Arya Honda',
      address: 'Shaman Cars India, 99/100, L.B.S. Marg, Next to St. Xaviers High School, Bhandup (W)',
      city: 'Mumbai, Maharashtra, 400078'
    },
    {
      name: 'Arya Honda',
      address: 'Janmabhoomi Chambers, Walchand Hirachand Marg, Near G.P.O, Ballard Estate',
      city: 'Mumbai, Maharashtra, 400001'
    }
  ]

  // Mock city prices data
  const cityPrices = [
    { id: '1', name: 'Delhi', price: 12.89 },
    { id: '2', name: 'Mumbai', price: 12.99 },
    { id: '3', name: 'Bangalore', price: 13.09 },
    { id: '4', name: 'Chennai', price: 13.19 },
  ]

  // Feedback form state
  const [feedbackForm, setFeedbackForm] = useState({
    feedback: '',
    name: '',
    email: ''
  })

  // Close variant dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (variantDropdownRef.current && !variantDropdownRef.current.contains(event.target as Node)) {
        setShowVariantDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Navigation Ribbon */}
      <div className="bg-white border-b sticky top-0 z-40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`py-3 px-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeSection === section.id
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {section.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Section 1: Hero with Car Image, Variant/City Selection, and On-Road Price */}
      <PageSection background="white" maxWidth="7xl">
        <div id="overview" className="pt-4 pb-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {modelName} Price in {selectedCity.split(',')[0]}
            </h1>
            <div className="relative">
              <div className={`text-gray-600 leading-relaxed transition-all duration-300 ${!isTextExpanded ? 'line-clamp-2' : ''}`}>
                <p>
                  The on road price of the {modelName} in {selectedCity.split(',')[0]} ranges from Rs. {formatIndianPrice(priceBreakup ? priceBreakup.totalOnRoadPrice : (modelVariants[0]?.price || 0))} to Rs. {formatIndianPrice(Math.max(...(modelVariants.map(v => v.price) || [0])))}. The ex-showroom price is between Rs. {formatIndianPrice(Math.min(...(modelVariants.map(v => v.price) || [0])))} and Rs. {formatIndianPrice(Math.max(...(modelVariants.map(v => v.price) || [0])))}.
                </p>
                <p className="mt-2">
                  {modelName} On-Road Price in {selectedCity.split(',')[0]} starts at ₹{((modelVariants[0]?.price || 0) / 100000).toFixed(2)} Lakh. Check RTO charges, insurance cost, and EMI options.
                </p>
              </div>
              <button
                onClick={() => setIsTextExpanded(!isTextExpanded)}
                className="flex items-center text-red-600 font-medium text-sm mt-1 hover:text-orange-600 transition-colors"
              >
                {isTextExpanded ? (
                  <>
                    Read Less <ChevronUp className="w-4 h-4 ml-1" />
                  </>
                ) : (
                  <>
                    Read More <ChevronDown className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Hero Image */}
            <div>
              {/* Clickable Image - Links to Model Page */}
              <Link
                href={`/${brandName.toLowerCase().replace(/\s+/g, '-')}-cars/${modelName.toLowerCase().replace(/\s+/g, '-')}`}
                className="block bg-gray-100 rounded-2xl overflow-hidden mb-4 cursor-pointer hover:opacity-90 transition-opacity"
              >
                {heroImage ? (
                  <img
                    src={heroImage}
                    alt={`${brandName} ${modelName}`}
                    className="w-full h-auto object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='%23374151'%3E%3Cpath d='M50 200h300c5.5 0 10-4.5 10-10v-80c0-16.6-13.4-30-30-30H70c-16.6 0-30 13.4-30 30v80c0 5.5 4.5 10 10 10z'/%3E%3Ccircle cx='100' cy='220' r='25' fill='%23111827'/%3E%3Ccircle cx='300' cy='220' r='25' fill='%23111827'/%3E%3Cpath d='M80 110h240l-20-30H100z' fill='%236B7280'/%3E%3C/svg%3E"
                    }}
                  />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center bg-gray-200">
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='#374151' className="w-3/4 h-3/4">
                      <path d='M50 200h300c5.5 0 10-4.5 10-10v-80c0-16.6-13.4-30-30-30H70c-16.6 0-30 13.4-30 30v80c0 5.5 4.5 10 10 10z' />
                      <circle cx='100' cy='220' r='25' fill='#111827' />
                      <circle cx='300' cy='220' r='25' fill='#111827' />
                      <path d='M80 110h240l-20-30H100z' fill='#6B7280' />
                    </svg>
                  </div>
                )}
              </Link>

              {/* Car Name with Icons */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {brandName} {modelName} {selectedVariantName}
                </h2>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      const shareData = {
                        title: `${brandName} ${modelName} Price - gadizone`,
                        text: `Check out the on-road price of ${brandName} ${modelName} in ${selectedCity}`,
                        url: window.location.href
                      };

                      if (navigator.share) {
                        navigator.share(shareData).catch(console.error);
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Link copied to clipboard!');
                      }
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full"
                    title="Share"
                  >
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Heart className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Variant Dropdown - Shows all variants with prices */}
              <div className="mb-4 relative" ref={variantDropdownRef}>
                <button
                  onClick={() => setShowVariantDropdown(!showVariantDropdown)}
                  className="w-full bg-white border-2 border-blue-500 rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-blue-600 transition-colors"
                >
                  <span className="text-gray-900 font-medium">Choose Variant</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showVariantDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showVariantDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-96 overflow-y-auto">
                    {allVariants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => {
                          setSelectedVariantName(variant.name)
                          setShowVariantDropdown(false)
                        }}
                        className={`block w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${variant.name === selectedVariantName ? 'bg-blue-50' : ''
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-gray-900 font-medium ${variant.name === selectedVariantName ? 'text-blue-600' : ''}`}>
                            {variant.name}
                          </span>
                          <span className="text-gray-600 text-sm font-semibold">
                            ₹ {(variant.price / 100000).toFixed(2)} Lakh
                          </span>
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
                <span className="text-gray-700">{selectedCity}</span>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </Link>
            </div>

            {/* Right: On-Road Price Breakdown - Refined & Mobile-Friendly */}
            <div id="price-breakup">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header - Standard red-orange gradient theme */}
                <div className="bg-gradient-to-r from-red-600 to-orange-500 px-4 sm:px-6 py-4">
                  <h3 className="text-lg sm:text-xl font-bold text-white">On-Road Price</h3>
                </div>

                <div className="p-4 sm:p-5">
                  {priceBreakup ? (
                    <>
                      {/* Price Items - Compact mobile-first design */}
                      <div className="divide-y divide-gray-100">
                        <div className="flex justify-between items-center py-2.5 sm:py-3">
                          <span className="text-sm sm:text-base text-gray-600">Ex-Showroom Price</span>
                          <span className="font-semibold text-gray-900 text-sm sm:text-base">₹ {formatIndianPrice(priceBreakup.exShowroomPrice)}</span>
                        </div>

                        <div className="flex justify-between items-center py-2.5 sm:py-3">
                          <span className="text-sm sm:text-base text-gray-600">RTO Charges</span>
                          <span className="font-semibold text-gray-900 text-sm sm:text-base">₹ {formatIndianPrice(priceBreakup.rtoCharges)}</span>
                        </div>

                        <div className="flex justify-between items-center py-2.5 sm:py-3">
                          <span className="text-sm sm:text-base text-gray-600">Road Safety Tax/Cess</span>
                          <span className="font-semibold text-gray-900 text-sm sm:text-base">₹ {formatIndianPrice(priceBreakup.roadSafetyTax)}</span>
                        </div>

                        <div className="flex justify-between items-center py-2.5 sm:py-3">
                          <span className="text-sm sm:text-base text-gray-600">Insurance Cost</span>
                          <span className="font-semibold text-gray-900 text-sm sm:text-base">₹ {formatIndianPrice(priceBreakup.insurance)}</span>
                        </div>

                        {priceBreakup.tcs > 0 && (
                          <div className="flex justify-between items-center py-2.5 sm:py-3">
                            <span className="text-sm sm:text-base text-gray-600">TCS</span>
                            <span className="font-semibold text-gray-900 text-sm sm:text-base">₹ {formatIndianPrice(priceBreakup.tcs)}</span>
                          </div>
                        )}

                        <div className="flex justify-between items-center py-2.5 sm:py-3">
                          <span className="text-sm sm:text-base text-gray-600">Other Charges</span>
                          <span className="font-semibold text-gray-900 text-sm sm:text-base">₹ {formatIndianPrice(priceBreakup.otherCharges)}</span>
                        </div>

                        {/* Optional Charges - Subtle styling */}
                        <div className="flex justify-between items-center py-2.5 sm:py-3">
                          <span className="text-sm text-gray-400">Hypothecation</span>
                          <span className="text-sm text-gray-400">₹ {formatIndianPrice(priceBreakup.hypothecation)}</span>
                        </div>

                        <div className="flex justify-between items-center py-2.5 sm:py-3">
                          <span className="text-sm text-gray-400">FASTag</span>
                          <span className="text-sm text-gray-400">₹ {formatIndianPrice(priceBreakup.fasTag)}</span>
                        </div>
                      </div>

                      {/* Total On-Road Price - Clean highlight */}
                      <div className="mt-4 sm:mt-5">
                        <div className="bg-green-50 rounded-lg p-3 sm:p-4 border border-green-100">
                          <div className="text-xs sm:text-sm text-gray-500 mb-1">On-Road Price</div>
                          <div className="text-xl sm:text-2xl font-bold text-green-600">
                            ₹ {formatIndianPrice(priceBreakup.totalOnRoadPrice)}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-6 text-gray-400 text-sm">
                      Calculating price...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div >
      </PageSection >

      {/* Section 2: AD Banner & EMI Calculator */}
      < PageSection background="gray" maxWidth="7xl" >
        <div className="py-8 space-y-8">
          {/* Ad Banner */}
          <Ad3DCarousel className="mb-6" />

          {/* EMI Calculator Card */}
          <div id="emi" className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">K</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">kotak</h3>
                  <p className="text-sm text-gray-600">Mahindra Bank</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Starting EMI</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(displayEMI)}
                </p>
                <p className="text-sm text-gray-600">per month</p>
              </div>
            </div>

            <Link
              href={`/emi-calculator?brand=${encodeURIComponent(brandName)}&model=${encodeURIComponent(modelName)}&variant=${encodeURIComponent(selectedVariantName)}&price=${priceBreakup?.totalOnRoadPrice || 0}`}
              className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white py-3 rounded-full font-semibold transition-colors flex items-center justify-center"
            >
              <span>Calculate EMI</span>
            </Link>
          </div>
        </div>
      </PageSection >

      {/* Section 3: More Variants */}
      < PageSection background="white" maxWidth="7xl" >
        <div id="variants" className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
            More {brandName} {modelName} Variants
          </h2>

          {/* Filter Options - Dynamic based on available variants */}
          <div className="flex flex-wrap gap-3">
            {availableFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilterToggle(filter)}
                className={`px-4 py-2 rounded-lg transition-colors ${selectedFilters.includes(filter)
                  ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Variant Cards - Show only 8 */}
          <div className="space-y-4">
            {loadingVariants ? (
              <div className="text-center py-8">
                <KillerWhaleSpinner size={60} />
                <p className="text-gray-500 mt-4">Loading variants...</p>
              </div>
            ) : filteredVariants.length > 0 ? (
              filteredVariants.slice(0, 8).map((variant) => (
                <VariantCard
                  key={variant.id}
                  variant={{
                    ...variant,
                    price: variant.price / 100000 // Convert rupees to lakhs for VariantCard
                  }}
                  onClick={() => {
                    const brandSlug = brandName?.toLowerCase().replace(/\s+/g, '-')
                    const modelSlug = modelName?.toLowerCase().replace(/\s+/g, '-')
                    const variantSlug = variant.name.toLowerCase().replace(/\s+/g, '-')
                    router.push(`/${brandSlug}-cars/${modelSlug}/${variantSlug}`)
                  }}
                  onGetPrice={(e) => {
                    e.stopPropagation()
                    setSelectedVariantName(variant.name)
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
          {!loadingVariants && allVariants.length > 8 && (
            <div className="text-center pt-4">
              <button
                className="text-red-600 hover:text-orange-600 font-medium text-lg"
                onClick={() => {
                  const brandSlug = brandName?.toLowerCase().replace(/\s+/g, '-')
                  const modelSlug = modelName?.toLowerCase().replace(/\s+/g, '-')
                  router.push(`/${brandSlug}-cars/${modelSlug}/variants`)
                }}
              >
                View All {allVariants.length} Variants
              </button>
            </div>
          )}
        </div>
      </PageSection >

      {/* Section 4: AD Banner, Similar Cars & Popular Cars */}
      < PageSection background="white" maxWidth="7xl" >
        <div id="similar-cars" className="space-y-12">
          {/* Ad Banner */}
          <Ad3DCarousel className="mb-6" />

          {/* Similar Cars Section - Exact copy from VariantPage */}
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
              Similar Cars To {modelName}
            </h2>

            {/* Cars Horizontal Scroll - Exact copy from VariantPage */}
            <div className="relative">
              {loadingSimilarCars ? (
                <div className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex-shrink-0 w-72 bg-white rounded-xl border border-gray-200 overflow-hidden">
                      <div className="h-48 bg-gray-200 animate-pulse"></div>
                      <div className="p-5 space-y-3">
                        <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
                        <div className="h-8 bg-gray-200 animate-pulse rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : similarCars.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>No similar cars found</p>
                </div>
              ) : (
                <div className="relative group">
                  {/* Left Scroll Arrow */}
                  <button
                    onClick={() => {
                      const container = document.getElementById('price-similar-scroll')
                      container?.scrollBy({ left: -300, behavior: 'smooth' })
                    }}
                    className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full items-center justify-center text-gray-700 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 -ml-5"
                    aria-label="Scroll left"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => {
                      const container = document.getElementById('price-similar-scroll')
                      container?.scrollBy({ left: 300, behavior: 'smooth' })
                    }}
                    className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full items-center justify-center text-gray-700 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 -mr-5"
                    aria-label="Scroll right"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <div
                    id="price-similar-scroll"
                    className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {similarCars.map((car: any) => {
                      // Transform the data to match CarCard interface
                      const transformedCar = {
                        id: car.id,
                        name: car.name,
                        brand: car.brand || car.brandName,
                        brandName: car.brandName,
                        image: car.image || '/placeholder-car.png',
                        startingPrice: car.startingPrice,
                        lowestPriceFuelType: car.fuelTypes?.[0] || 'Petrol',
                        fuelTypes: car.fuelTypes || ['Petrol'],
                        transmissions: car.transmissionTypes || car.transmissions || ['Manual'],
                        seating: car.seating || 5,
                        launchDate: car.launchDate || 'Recently Launched',
                        slug: car.slug || `${car.brandName?.toLowerCase().replace(/\s+/g, '-')}-${car.name?.toLowerCase().replace(/\s+/g, '-')}`,
                        isNew: car.isNew || false,
                        isPopular: car.isPopular || false
                      }

                      return (
                        <CarCard
                          key={car.id}
                          car={transformedCar}
                          onClick={() => {
                            const brandSlug = car.brandName.toLowerCase().replace(/\s+/g, '-')
                            const modelSlug = car.name.toLowerCase().replace(/\s+/g, '-')
                            window.location.href = `/${brandSlug}-cars/${modelSlug}`
                          }}
                        />
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Popular Cars Section - Exact styling from VariantPage */}
          <div id="popular-cars" className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">Popular Cars</h2>

            {/* Cars Horizontal Scroll - Exact copy from VariantPage */}
            <div className="relative">
              {loadingPopularCars ? (
                <div className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex-shrink-0 w-72 bg-white rounded-xl border border-gray-200 overflow-hidden">
                      <div className="h-48 bg-gray-200 animate-pulse"></div>
                      <div className="p-5 space-y-3">
                        <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
                        <div className="h-8 bg-gray-200 animate-pulse rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : popularCars.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>No popular cars found</p>
                </div>
              ) : (
                <div className="relative group">
                  {/* Left Scroll Arrow */}
                  <button
                    onClick={() => {
                      const container = document.getElementById('price-popular-scroll')
                      container?.scrollBy({ left: -300, behavior: 'smooth' })
                    }}
                    className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full items-center justify-center text-gray-700 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 -ml-5"
                    aria-label="Scroll left"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => {
                      const container = document.getElementById('price-popular-scroll')
                      container?.scrollBy({ left: 300, behavior: 'smooth' })
                    }}
                    className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full items-center justify-center text-gray-700 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 -mr-5"
                    aria-label="Scroll right"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <div
                    id="price-popular-scroll"
                    className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {popularCars.map((car: any) => (
                      <CarCard
                        key={car.id}
                        car={car}
                        onClick={() => {
                          const brandSlug = car.brandName.toLowerCase().replace(/\s+/g, '-')
                          const modelSlug = car.name.toLowerCase().replace(/\s+/g, '-')
                          window.location.href = `/${brandSlug}-cars/${modelSlug}`
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </PageSection >

      {/* Section 5: AD Banner & Owner Reviews */}
      < PageSection background="white" maxWidth="7xl" >
        <div id="reviews" className="py-8 space-y-12">
          {/* Ad Banner */}
          <Ad3DCarousel className="mb-6" />

          {/* Owner Reviews Section */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">{brandName} {modelName} Owner Reviews</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Rating Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      {[1, 2, 3, 4].map((star) => (
                        <svg key={star} className="h-6 w-6 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <svg className="h-6 w-6 text-gray-300" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <span className="ml-2 text-2xl font-bold text-gray-900">4.2</span>
                    <span className="ml-2 text-gray-500">(1,543 reviews)</span>
                  </div>

                  <div className="space-y-2 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Rating Breakdown</h3>

                    {/* 5 Star */}
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 w-8">5★</span>
                      <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-400 h-2 rounded-full" style={{ width: '55%' }}></div>
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">856</span>
                    </div>

                    {/* 4 Star */}
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 w-8">4★</span>
                      <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-400 h-2 rounded-full" style={{ width: '21%' }}></div>
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">324</span>
                    </div>

                    {/* 3 Star */}
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 w-8">3★</span>
                      <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-400 h-2 rounded-full" style={{ width: '12%' }}></div>
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">189</span>
                    </div>

                    {/* 2 Star */}
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 w-8">2★</span>
                      <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                        <div className="bg-gray-300 h-2 rounded-full" style={{ width: '2%' }}></div>
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">26</span>
                    </div>

                    {/* 1 Star */}
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 w-8">1★</span>
                      <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                        <div className="bg-gray-300 h-2 rounded-full" style={{ width: '1%' }}></div>
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">13</span>
                    </div>
                  </div>

                  {/* Filter Options */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Filter by rating:</label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                        <option>All Ratings</option>
                        <option>5 Stars</option>
                        <option>4 Stars</option>
                        <option>3 Stars</option>
                        <option>2 Stars</option>
                        <option>1 Star</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sort by:</label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                        <option>Most Recent</option>
                        <option>Most Helpful</option>
                        <option>Highest Rating</option>
                        <option>Lowest Rating</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="lg:col-span-2">
                {/* Individual Reviews */}
                <div className="space-y-6">
                  {/* Review 1 */}
                  <div className="border-b border-gray-200 pb-6">
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                        <span className="text-orange-600 font-semibold text-sm">R</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900 flex items-center">
                              Rajesh Kumar
                              <svg className="h-4 w-4 text-green-500 ml-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </h4>
                            <p className="text-sm text-gray-500">15/01/2024</p>
                          </div>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg key={star} className="h-4 w-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <h5 className="font-semibold text-gray-900 mb-2">Excellent car with great mileage</h5>
                        <p className="text-gray-700 mb-3">
                          I have been using this car for 6 months now. The mileage is excellent in city conditions. Build quality is good and maintenance cost is reasonable.
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <button className="flex items-center hover:text-gray-700">
                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                            </svg>
                            24
                          </button>
                          <button className="flex items-center hover:text-gray-700">
                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.737 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                            </svg>
                            2
                          </button>
                          <span>Helpful</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Review 2 */}
                  <div className="border-b border-gray-200 pb-6">
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                        <span className="text-orange-600 font-semibold text-sm">P</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900 flex items-center">
                              Priya Sharma
                              <svg className="h-4 w-4 text-green-500 ml-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </h4>
                            <p className="text-sm text-gray-500">10/01/2024</p>
                          </div>
                          <div className="flex items-center">
                            {[1, 2, 3, 4].map((star) => (
                              <svg key={star} className="h-4 w-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <svg className="h-4 w-4 text-gray-300" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                        </div>
                        <h5 className="font-semibold text-gray-900 mb-2">Good family car</h5>
                        <p className="text-gray-700 mb-3">
                          Perfect for family use. Spacious interior and comfortable seats. Only issue is the road noise at high speeds.
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <button className="flex items-center hover:text-gray-700">
                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                            </svg>
                            18
                          </button>
                          <button className="flex items-center hover:text-gray-700">
                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.737 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                            </svg>
                            1
                          </button>
                          <span>Helpful</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Read More Button */}
                <div className="text-center mt-6">
                  <button className="text-red-600 hover:text-orange-600 font-medium transition-colors">Read More</button>
                </div>

                {/* Write Review CTA */}
                <div className="bg-gray-50 rounded-lg p-6 mt-6 text-center">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Own a {brandName} {modelName}? Share your experience!</h3>
                  <p className="text-gray-600 mb-4">
                    Help other buyers make informed decisions by sharing your honest review
                  </p>
                  <button className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-md">
                    Write a Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageSection >

      {/* Section 6: AD Banner, FAQ & Brand Dealers */}
      < PageSection background="white" maxWidth="7xl" >
        <div id="faq" className="py-8 space-y-12">
          {/* Ad Banner */}
          <Ad3DCarousel className="mb-6" />

          {/* FAQ Section */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">{brandName} {modelName} FAQ</h2>

            <div className="space-y-4 max-w-4xl mx-auto">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-gray-50 rounded-lg border border-gray-200">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-base font-medium text-gray-900">
                      {faq.question}
                    </span>
                    <svg
                      className={`h-5 w-5 text-gray-500 transition-transform flex-shrink-0 ml-4 ${openFAQ === index ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFAQ === index && (
                    <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Brand Dealers Section */}
          <div id="dealers">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">{brandName} Dealers in {selectedCity.split(',')[0]}</h2>
            <p className="text-gray-600 mb-8">
              Planning to Buy {modelName}? Here are a few showrooms/dealers in {selectedCity.split(',')[0]}
            </p>

            <div className="space-y-8">
              {dealers.map((dealer, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start">
                    {/* Dealer Icon */}
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>

                    {/* Dealer Info */}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{dealer.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Address:</span> {dealer.address}
                      </p>
                      <p className="text-sm text-gray-600">{dealer.city}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Dealers Button */}
            <div className="text-center mt-8">
              <button className="w-full max-w-md bg-white border-2 border-gray-300 hover:border-red-600 text-gray-900 hover:text-red-600 px-6 py-3 rounded-lg font-semibold transition-all duration-200">
                View All Dealers in {selectedCity.split(',')[0]}
              </button>
            </div>
          </div>
        </div>
      </PageSection >

      {/* Section 7: Price across India, AD Banner & Share Feedback */}
      < PageSection background="white" maxWidth="7xl" >
        <div className="py-8 space-y-12">
          {/* Price across India */}
          <div id="price-cities" className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {brandName} {modelName} {selectedVariantName} Price across India
            </h2>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {/* Table Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <h3 className="text-lg font-semibold text-gray-900">City</h3>
                  <h3 className="text-lg font-semibold text-gray-900">On-Road Prices</h3>
                </div>
              </div>

              {/* City Price List */}
              <div className="divide-y divide-gray-200">
                {cityPrices.map((city) => (
                  <div key={city.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="grid grid-cols-2 gap-4">
                      <span className="text-red-600 font-medium hover:text-red-700 cursor-pointer">
                        {city.name}
                      </span>
                      <span className="text-gray-900 font-semibold">
                        Rs. {city.price.toFixed(2)} Lakh
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* View More Cities Button */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-center">
                <button className="text-gray-600 hover:text-gray-800 font-medium text-sm flex items-center justify-center space-x-1 mx-auto">
                  <span>View More Cities</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Ad Banner */}
          <Ad3DCarousel className="mb-6" />

          {/* Share Your Feedback */}
          <div id="feedback" className="max-w-2xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-xl p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-6 sm:mb-8">Share Your Feedback</h2>
              <p className="text-gray-600 text-center mb-8">
                Help us improve by sharing your thoughts about this page
              </p>

              <form className="space-y-6">
                {/* Feedback Textarea */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Feedback
                  </label>
                  <textarea
                    value={feedbackForm.feedback}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, feedback: e.target.value })}
                    placeholder="Tell us what you think about this car page..."
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={feedbackForm.name}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={feedbackForm.email}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, email: e.target.value })}
                    placeholder="Enter your email"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Submit Feedback</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </PageSection >

      {/* Footer */}
      < Footer />
    </div >
  )
}
