'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, Plus, Share2, X, TrendingUp, TrendingDown, Award } from 'lucide-react'
import { calculateOnRoadPrice } from '@/lib/rto-data-optimized'
import Footer from '@/components/Footer'
import PopularComparisons from '@/components/home/PopularComparisons'
import PopularCars from '@/components/home/PopularCars'
import UpcomingCars from '@/components/home/UpcomingCars'
import MovingAdBanner from '@/components/ads/MovingAdBanner'
import Ad3DCarousel from '@/components/ads/Ad3DCarousel'
import PageSection from '@/components/common/PageSection'
import CarCard from '@/components/home/CarCard'
import ComparisonYouTube from '@/components/comparison/ComparisonYouTube'
import { FloatingAIBot } from '@/components/FloatingAIBot'
import { KillerWhaleSpinner } from '@/components/common/KillerWhaleLoader'

interface Variant {
  id: string
  name: string
  price: number
  fuelType: string
  transmission: string
  [key: string]: any
}

interface Model {
  id: string
  name: string
  brandName: string
  heroImage: string
  variants: Variant[]
}

interface ComparisonItem {
  model: Model
  variant: Variant
}

interface ComparePageClientProps {
  initialSlug: string
  initialComparisonItems: ComparisonItem[]
  initialSimilarCars: any[]
  initialBrands: any[]
  initialSeoText: string
}

export default function ComparePageClient({
  initialSlug,
  initialComparisonItems,
  initialSimilarCars,
  initialBrands,
  initialSeoText
}: ComparePageClientProps) {
  const router = useRouter()
  const [slug, setSlug] = useState(initialSlug)
  const [comparisonItems, setComparisonItems] = useState<(ComparisonItem | null)[]>(initialComparisonItems)
  const [loading, setLoading] = useState(false) // Changed from true since we have initial data
  const [showVariantDropdown, setShowVariantDropdown] = useState<number | null>(null)
  const [seoText, setSeoText] = useState(initialSeoText)
  const [showDifferences, setShowDifferences] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [similarCars, setSimilarCars] = useState<any[]>(initialSimilarCars)
  const [loadingSimilarCars, setLoadingSimilarCars] = useState(false)
  const [showAddCarModal, setShowAddCarModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [addCarAtIndex, setAddCarAtIndex] = useState<number | null>(null)
  const [showVariantModal, setShowVariantModal] = useState<number | null>(null)

  // ✅ OPTIMIZED: Use single API call for all comparison data
  const [brands, setBrands] = useState<any[]>(initialBrands)
  const [dataLoaded, setDataLoaded] = useState(true) // Changed from false since we have initial data
  const [allModels, setAllModels] = useState<any[]>([])
  const [loadingAllModels, setLoadingAllModels] = useState(false)

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

  const resolveImageUrl = (image?: string) => {
    if (!image) return ''
    if (image.startsWith('http')) return image
    if (image.startsWith('/uploads/') || image.startsWith('/')) return `${backendUrl}${image}`
    return `${backendUrl}/uploads/${image}`
  }

  // No need to fetch initial data since it's provided via props
  // useEffect for slug resolution removed

  const generateSeoText = (modelNames: string[]) => {
    if (modelNames.length === 0) return ''
    return `gadizone brings you comparison of ${modelNames.join(', ')}...`
  }

  // fetchComparisonData removed - data provided via props from SSR parent


  const getOnRoadPrice = (exShowroomPrice: number, fuelType: string): number => {
    const selectedCity = typeof window !== 'undefined' ? localStorage.getItem('selectedCity') || 'Mumbai, Maharashtra' : 'Mumbai, Maharashtra'
    const state = selectedCity.split(',')[1]?.trim() || 'Maharashtra'
    const safeFuelType = fuelType || 'Petrol'
    const breakup = calculateOnRoadPrice(exShowroomPrice, state, safeFuelType)
    return breakup.totalOnRoadPrice
  }

  const calculateEMI = (price: number): number => {
    const principal = price * 0.8
    const monthlyRate = 9.5 / 12 / 100
    const tenure = 60
    return Math.round((principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1))
  }

  const handleVariantChange = (index: number, newVariant: Variant) => {
    const newItems = [...comparisonItems]
    if (newItems[index]) {
      newItems[index]!.variant = newVariant
      setComparisonItems(newItems)
    }
    setShowVariantDropdown(null)
  }

  const handleAddMore = (index?: number) => {
    setAddCarAtIndex(index ?? null)
    setShowAddCarModal(true)
    setSearchQuery('')
    if (allModels.length === 0) {
      fetchAllModels()
    }
  }

  const fetchAllModels = async () => {
    try {
      setLoadingAllModels(true)
      const response = await fetch(`${backendUrl}/api/models?fields=id,name,brandId,heroImage`)
      if (response.ok) {
        const data = await response.json()
        setAllModels(data)
      }
    } catch (error) {
      console.error('Failed to fetch models:', error)
    } finally {
      setLoadingAllModels(false)
    }
  }

  const handleAddCar = async (model: any) => {
    try {
      // Fetch variants for this model on demand
      const response = await fetch(`${backendUrl}/api/variants?modelId=${model.id}`)
      if (!response.ok) throw new Error('Failed to fetch variants')

      const modelVariants = await response.json()

      const brandMap: Record<string, string> = {}
      brands.forEach((brand: any) => { brandMap[brand.id] = brand.name })

      if (modelVariants.length > 0) {
        const lowestVariant = modelVariants.reduce((prev: Variant, curr: Variant) =>
          (curr.price < prev.price && curr.price > 0) ? curr : prev
        )

        const newModel: Model = {
          id: model.id,
          name: model.name,
          brandName: brandMap[model.brandId] || 'Unknown',
          heroImage: resolveImageUrl(model.heroImage),
          variants: modelVariants
        }

        const newItem = { model: newModel, variant: lowestVariant }

        let newItems: (ComparisonItem | null)[]
        if (addCarAtIndex !== null) {
          // Replace at specific index
          newItems = [...comparisonItems]
          newItems[addCarAtIndex] = newItem
        } else {
          // Add to end
          newItems = [...comparisonItems, newItem]
        }

        setComparisonItems(newItems)

        // Update URL - only include non-null items
        const validItems = newItems.filter((item): item is ComparisonItem => item !== null)
        if (validItems.length > 0) {
          const newSlug = validItems.map(item =>
            `${item.model.brandName.toLowerCase().replace(/\s+/g, '-')}-${item.model.name.toLowerCase().replace(/\s+/g, '-')}`
          ).join('-vs-')
          router.push(`/compare/${newSlug}`)
        }

        setShowAddCarModal(false)
        setAddCarAtIndex(null)
      }
    } catch (error) {
      console.error('Error adding car:', error)
      alert('Failed to add car. Please try again.')
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${comparisonItems.filter((item): item is ComparisonItem => item !== null).map(item => `${item.model.brandName} ${item.model.name}`).join(' vs ')}`,
          text: 'Compare these cars on gadizone',
          url: window.location.href
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  // Calculate comparison stats
  const getComparisonStats = () => {
    const validItems = comparisonItems.filter((item): item is ComparisonItem => item !== null)
    if (validItems.length !== 2) return null

    const item1 = validItems[0]
    const item2 = validItems[1]

    if (!item1.variant || !item2.variant) return null

    const price1 = getOnRoadPrice(item1.variant.price, item1.variant.fuelType)
    const price2 = getOnRoadPrice(item2.variant.price, item2.variant.fuelType)

    const priceDiff = Math.abs(price1 - price2)
    const priceDiffPercent = ((priceDiff / Math.min(price1, price2)) * 100).toFixed(1)
    const cheaperIndex = comparisonItems.findIndex(item => item === item1) < comparisonItems.findIndex(item => item === item2) && price1 < price2 ? comparisonItems.findIndex(item => item === item1) : comparisonItems.findIndex(item => item === item2)

    return {
      priceDiff,
      priceDiffPercent,
      cheaperIndex,
      cheaperCar: comparisonItems[cheaperIndex]
    }
  }

  const stats = getComparisonStats()

  // 9 Specification sections from variant page - EXACT ORDER
  const specificationSections = [
    {
      id: 'comfort',
      title: 'Comfort & Convenience',
      specs: [
        { key: 'ventilatedSeats', label: 'Ventilated Seats' },
        { key: 'sunroof', label: 'Sunroof' },
        { key: 'airPurifier', label: 'Air Purifier' },
        { key: 'headsUpDisplay', label: 'Heads Up Display' },
        { key: 'cruiseControl', label: 'Cruise Control' },
        { key: 'rainSensingWipers', label: 'Rain Sensing Wipers' },
        { key: 'automaticHeadlamp', label: 'Automatic Headlamp' },
        { key: 'followMeHomeHeadlights', label: 'Follow Me Home Headlights' },
        { key: 'keylessEntry', label: 'Keyless Entry' },
        { key: 'ignition', label: 'Ignition' },
        { key: 'ambientLighting', label: 'Ambient Lighting' },
        { key: 'steeringAdjustment', label: 'Steering Adjustment' },
        { key: 'airConditioning', label: 'Air Conditioning' },
        { key: 'climateZones', label: 'Climate Zones' },
        { key: 'climateControl', label: 'Climate Control' },
        { key: 'rearACVents', label: 'Rear A/C Vents' },
        { key: 'frontArmrest', label: 'Front Armrest' },
        { key: 'rearArmrest', label: 'Rear Armrest' },
        { key: 'insideRearViewMirror', label: 'Inside Rear View Mirror' },
        { key: 'outsideRearViewMirrors', label: 'Outside Rear View Mirrors' },
        { key: 'steeringMountedControls', label: 'Steering Mounted Controls' },
        { key: 'rearWindshieldDefogger', label: 'Rear Windshield Defogger' },
        { key: 'frontWindshieldDefogger', label: 'Front Windshield Defogger' },
        { key: 'cooledGlovebox', label: 'Cooled Glovebox' },
        { key: 'pushButtonStart', label: 'Push Button Start' },
        { key: 'powerWindows', label: 'Power Windows' },
        { key: 'powerSteering', label: 'Power Steering' },
        { key: 'cupholders', label: 'Cup Holders' }
      ]
    },
    {
      id: 'safety',
      title: 'Safety',
      specs: [
        { key: 'globalNCAPRating', label: 'Global NCAP Rating' },
        { key: 'airbags', label: 'Airbags' },
        { key: 'airbagsLocation', label: 'Airbags Location' },
        { key: 'adasLevel', label: 'ADAS Level' },
        { key: 'adasFeatures', label: 'ADAS Features' },
        { key: 'reverseCamera', label: 'Reverse Camera' },
        { key: 'reverseCameraGuidelines', label: 'Reverse Camera Guidelines' },
        { key: 'tyrePressureMonitor', label: 'Tyre Pressure Monitor' },
        { key: 'hillHoldAssist', label: 'Hill Hold Assist' },
        { key: 'hillDescentControl', label: 'Hill Descent Control' },
        { key: 'rollOverMitigation', label: 'Roll Over Mitigation' },
        { key: 'parkingSensor', label: 'Parking Sensor' },
        { key: 'discBrakes', label: 'Disc Brakes' },
        { key: 'electronicStabilityProgram', label: 'Electronic Stability Program' },
        { key: 'abs', label: 'ABS' },
        { key: 'ebd', label: 'EBD' },
        { key: 'brakeAssist', label: 'Brake Assist' },
        { key: 'isofixMounts', label: 'ISOFIX Mounts' },
        { key: 'seatbeltWarning', label: 'Seatbelt Warning' },
        { key: 'speedAlertSystem', label: 'Speed Alert System' },
        { key: 'speedSensingDoorLocks', label: 'Speed Sensing Door Locks' },
        { key: 'immobiliser', label: 'Immobiliser' },
        { key: 'esc', label: 'ESC' },
        { key: 'tractionControl', label: 'Traction Control' },
        { key: 'hillAssist', label: 'Hill Assist' },
        { key: 'isofix', label: 'ISOFIX' },
        { key: 'parkingSensors', label: 'Parking Sensors' },
        { key: 'parkingCamera', label: 'Parking Camera' },
        { key: 'blindSpotMonitor', label: 'Blind Spot Monitor' }
      ]
    },
    {
      id: 'entertainment',
      title: 'Entertainment & Connectivity',
      specs: [
        { key: 'touchScreenInfotainment', label: 'Touch Screen Infotainment' },
        { key: 'androidAppleCarplay', label: 'Android Auto / Apple CarPlay' },
        { key: 'speakers', label: 'Speakers' },
        { key: 'tweeters', label: 'Tweeters' },
        { key: 'subwoofers', label: 'Subwoofers' },
        { key: 'usbCChargingPorts', label: 'USB-C Charging Ports' },
        { key: 'usbAChargingPorts', label: 'USB-A Charging Ports' },
        { key: 'twelvevChargingPorts', label: '12V Charging Ports' },
        { key: 'wirelessCharging', label: 'Wireless Charging' },
        { key: 'infotainmentScreen', label: 'Infotainment Screen' },
        { key: 'bluetooth', label: 'Bluetooth' },
        { key: 'usb', label: 'USB' },
        { key: 'aux', label: 'AUX' },
        { key: 'androidAuto', label: 'Android Auto' },
        { key: 'appleCarPlay', label: 'Apple CarPlay' },
        { key: 'connectedCarTech', label: 'Connected Car Tech' }
      ]
    },
    {
      id: 'engine',
      title: 'Engine & Transmission',
      specs: [
        { key: 'engineNamePage4', label: 'Engine Name' },
        { key: 'engineCapacity', label: 'Engine Capacity (cc)' },
        { key: 'fuel', label: 'Fuel Type' },
        { key: 'maxPower', label: 'Max Power' },
        { key: 'maxTorque', label: 'Max Torque' },
        { key: 'transmission', label: 'Transmission' },
        { key: 'noOfGears', label: 'No of Gears' },
        { key: 'paddleShifter', label: 'Paddle Shifter' },
        { key: 'driveType', label: 'Drive Type' },
        { key: 'turboCharged', label: 'Turbo Charged' },
        { key: 'mileageCompanyClaimed', label: 'Mileage (Company Claimed)' },
        { key: 'mileageCity', label: 'Mileage City' },
        { key: 'mileageHighway', label: 'Mileage Highway' },
        { key: 'fuelTankCapacity', label: 'Fuel Tank Capacity (Litres)' },
        { key: 'emissionStandard', label: 'Emission Standard' },
        { key: 'zeroTo100KmphTime', label: '0-100 km/h Time' },
        { key: 'topSpeed', label: 'Top Speed' },
        { key: 'evBatteryCapacity', label: 'EV Battery Capacity' },
        { key: 'hybridBatteryCapacity', label: 'Hybrid Battery Capacity' },
        { key: 'batteryType', label: 'Battery Type' },
        { key: 'electricMotorPlacement', label: 'Electric Motor Placement' },
        { key: 'evRange', label: 'EV Range' },
        { key: 'evChargingTime', label: 'EV Charging Time' },
        { key: 'maxElectricMotorPower', label: 'Max Electric Motor Power' },
        { key: 'hybridType', label: 'Hybrid Type' },
        { key: 'driveTrain', label: 'Drive Train' },
        { key: 'drivingModes', label: 'Driving Modes' },
        { key: 'offRoadModes', label: 'Off Road Modes' },
        { key: 'differentialLock', label: 'Differential Lock' },
        { key: 'limitedSlipDifferential', label: 'Limited Slip Differential' }
      ]
    },
    {
      id: 'seating',
      title: 'Seating Comfort',
      specs: [
        { key: 'seatUpholstery', label: 'Seat Upholstery' },
        { key: 'seatsAdjustment', label: 'Seats Adjustment' },
        { key: 'driverSeatAdjustment', label: 'Driver Seat Adjustment' },
        { key: 'passengerSeatAdjustment', label: 'Passenger Seat Adjustment' },
        { key: 'rearSeatAdjustment', label: 'Rear Seat Adjustment' },
        { key: 'welcomeSeats', label: 'Welcome Seats' },
        { key: 'memorySeats', label: 'Memory Seats' }
      ]
    },
    {
      id: 'exteriors',
      title: 'Exteriors',
      specs: [
        { key: 'headLights', label: 'Head Lights' },
        { key: 'tailLight', label: 'Tail Light' },
        { key: 'frontFogLights', label: 'Front Fog Lights' },
        { key: 'daytimeRunningLights', label: 'Daytime Running Lights' },
        { key: 'roofRails', label: 'Roof Rails' },
        { key: 'radioAntenna', label: 'Radio Antenna' },
        { key: 'outsideRearViewMirror', label: 'Outside Rear View Mirror' },
        { key: 'sideIndicator', label: 'Side Indicator' },
        { key: 'rearWindshieldWiper', label: 'Rear Windshield Wiper' },
        { key: 'alloyWheels', label: 'Alloy Wheels' }
      ]
    },
    {
      id: 'dimensions',
      title: 'Dimensions',
      specs: [
        { key: 'groundClearance', label: 'Ground Clearance (mm)' },
        { key: 'length', label: 'Length (mm)' },
        { key: 'width', label: 'Width (mm)' },
        { key: 'height', label: 'Height (mm)' },
        { key: 'wheelbase', label: 'Wheelbase (mm)' },
        { key: 'kerbWeight', label: 'Kerb Weight (kg)' },
        { key: 'seatingCapacity', label: 'Seating Capacity' },
        { key: 'doors', label: 'No of Doors' }
      ]
    },
    {
      id: 'tyre',
      title: 'Tyre & Suspension',
      specs: [
        { key: 'frontTyreProfile', label: 'Front Tyre Profile' },
        { key: 'rearTyreProfile', label: 'Rear Tyre Profile' },
        { key: 'spareTyreProfile', label: 'Spare Tyre Profile' },
        { key: 'spareWheelType', label: 'Spare Wheel Type' },
        { key: 'wheelSize', label: 'Wheel Size' },
        { key: 'tyreSize', label: 'Tyre Size' },
        { key: 'frontSuspension', label: 'Front Suspension' },
        { key: 'rearSuspension', label: 'Rear Suspension' },
        { key: 'frontBrake', label: 'Front Brake' },
        { key: 'rearBrake', label: 'Rear Brake' }
      ]
    },
    {
      id: 'storage',
      title: 'Storage',
      specs: [
        { key: 'cupholders', label: 'Cup Holders' },
        { key: 'fuelTankCapacity', label: 'Fuel Tank Capacity (Litres)' },
        { key: 'bootSpace', label: 'Boot Space (Litres)' },
        { key: 'bootSpaceAfterFoldingRearRowSeats', label: 'Boot Space (Rear Seats Folded)' }
      ]
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <KillerWhaleSpinner size={80} />
      </div>
    )
  }

  if (comparisonItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-3">Unable to load comparison</p>
          <button onClick={() => router.push('/')} className="px-5 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium">Go Home</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Share Button */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {comparisonItems.filter((item): item is ComparisonItem => item !== null).map(item => `${item.model.brandName} ${item.model.name}`).join(' vs ')}
            </h1>
            <p className="text-base text-gray-600 leading-relaxed">
              Detailed comparison of {comparisonItems.filter((item): item is ComparisonItem => item !== null).map(item => `${item.model.brandName} ${item.model.name}`).join(' vs ')}. Compare prices, specifications, mileage, safety rating, and features to choose the best car for you.
            </p>
          </div>
          <button
            onClick={handleShare}
            className="ml-4 p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
            title="Share comparison"
          >
            <Share2 className="h-5 w-5 text-gray-600" />
          </button>
        </div>


        {/* Comparison Cards - Side by Side, Mobile Friendly */}
        <div className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-2 mb-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {comparisonItems.map((item, index) => {
            // Handle empty slot or corrupted item
            if (!item || !item.variant) {
              return (
                <div
                  key={index}
                  className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl md:rounded-2xl border-2 border-dashed border-gray-300 transition-all duration-300 flex-shrink-0 w-[calc(50%-6px)] md:w-full md:flex-1 hover:border-orange-400 hover:bg-gradient-to-br hover:from-orange-50 hover:to-red-50"
                >
                  <button
                    onClick={() => handleAddMore(index)}
                    className="w-full h-full min-h-[400px] md:min-h-[500px] flex flex-col items-center justify-center gap-3 md:gap-4 p-6 group"
                  >
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white border-2 border-gray-300 group-hover:border-orange-500 flex items-center justify-center transition-all duration-200 group-hover:scale-110 shadow-md">
                      <Plus className="h-8 w-8 md:h-10 md:w-10 text-gray-400 group-hover:text-orange-600 transition-colors" />
                    </div>
                    <div className="text-center">
                      <div className="text-base md:text-lg font-bold text-gray-600 group-hover:text-orange-600 transition-colors">
                        Add Car to Compare
                      </div>
                      <div className="text-xs md:text-sm text-gray-500 mt-1">
                        Click to search and add
                      </div>
                    </div>
                  </button>
                </div>
              )
            }

            const onRoadPrice = getOnRoadPrice(item.variant.price, item.variant.fuelType)
            const isCheaper = stats && stats.cheaperIndex === index

            return (
              <div
                key={index}
                className={`relative bg-white rounded-xl md:rounded-2xl border-2 transition-all duration-300 flex-shrink-0 w-[calc(50%-6px)] md:w-full md:flex-1 ${isCheaper
                  ? 'border-orange-500 shadow-xl shadow-orange-100'
                  : 'border-gray-200 hover:border-gray-300 shadow-md'
                  }`}
                style={{ overflow: 'visible' }}
              >
                {/* Best Value Badge - Enhanced */}
                {isCheaper && (
                  <div className="absolute top-2 md:top-4 left-2 md:left-4 z-20 flex items-center gap-1 md:gap-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold shadow-lg">
                    <Award className="h-3 w-3 md:h-3.5 md:w-3.5" />
                    <span>Best Value</span>
                  </div>
                )}

                {/* Remove Button - X Icon */}
                <button
                  onClick={() => {
                    const newItems = [...comparisonItems]
                    newItems[index] = null
                    setComparisonItems(newItems)
                  }}
                  className="absolute top-2 md:top-4 right-2 md:right-4 z-20 bg-white hover:bg-red-50 border-2 border-gray-200 hover:border-red-500 rounded-full p-1.5 md:p-2 transition-all duration-200 shadow-md hover:shadow-lg group"
                  aria-label="Remove car"
                >
                  <X className="h-4 w-4 md:h-5 md:w-5 text-gray-600 group-hover:text-red-600" />
                </button>

                {/* Car Image Section - Enhanced */}
                <div className={`relative h-32 md:h-48 ${isCheaper ? 'bg-gradient-to-br from-orange-50 to-red-50' : 'bg-gradient-to-br from-gray-50 to-gray-100'} flex items-center justify-center p-2 md:p-4`}>
                  {item.model.heroImage ? (
                    <img
                      src={item.model.heroImage}
                      alt={`${item.model.brandName} ${item.model.name}`}
                      className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='%23374151'%3E%3Cpath d='M50 200h300c5.5 0 10-4.5 10-10v-80c0-16.6-13.4-30-30-30H70c-16.6 0-30 13.4-30 30v80c0 5.5 4.5 10 10 10z'/%3E%3Ccircle cx='100' cy='220' r='25' fill='%23111827'/%3E%3Ccircle cx='300' cy='220' r='25' fill='%23111827'/%3E%3C/svg%3E"
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='#374151' className="w-3/4 h-3/4 opacity-50">
                        <path d='M50 200h300c5.5 0 10-4.5 10-10v-80c0-16.6-13.4-30-30-30H70c-16.6 0-30 13.4-30 30v80c0 5.5 4.5 10 10 10z' />
                        <circle cx='100' cy='220' r='25' fill='#111827' />
                        <circle cx='300' cy='220' r='25' fill='#111827' />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Car Info Section */}
                <div className="p-3 md:p-5">
                  {/* Brand and Model Name */}
                  <h3 className="font-bold text-gray-900 text-sm md:text-lg mb-2 md:mb-3 leading-tight line-clamp-2">
                    {item.model.brandName} {item.model.name}
                  </h3>

                  {/* Variant Button - Opens Modal */}
                  <div className="relative mb-3 md:mb-4">
                    <button
                      onClick={() => setShowVariantModal(index)}
                      className={`w-full flex items-center justify-between px-3 md:px-4 py-2.5 md:py-3.5 bg-white border-2 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all ${isCheaper
                        ? 'border-orange-300 hover:border-orange-400 text-gray-900'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                    >
                      <span className="truncate pr-2">{item.variant.name}</span>
                      <ChevronDown className={`h-4 w-4 md:h-5 md:w-5 flex-shrink-0 ${isCheaper ? 'text-orange-600' : 'text-gray-500'}`} />
                    </button>
                  </div>

                  {/* Price Section - Enhanced */}
                  <div className={`rounded-lg md:rounded-xl p-3 md:p-4 ${isCheaper
                    ? 'bg-gradient-to-r from-orange-500 to-red-500'
                    : 'bg-gradient-to-r from-red-50 to-orange-50 border-2 border-gray-100'
                    }`}>
                    <div className={`text-lg md:text-2xl font-bold mb-0.5 md:mb-1 ${isCheaper ? 'text-white' : 'text-red-600'
                      }`}>
                      ₹{(onRoadPrice / 100000).toFixed(2)} Lakhs
                    </div>
                    <div className={`text-[10px] md:text-xs font-medium ${isCheaper ? 'text-orange-50' : 'text-gray-600'
                      }`}>
                      On-Road Price
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>



        {/* EMI Section - Compact Refined */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm mb-6">
          {/* Bank Info */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-base font-bold">K</span>
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-gray-900">kotak</h3>
              <p className="text-xs text-gray-600">Mahindra Bank</p>
            </div>
          </div>

          {/* EMI Values - Two Columns */}
          <div className="grid grid-cols-2 gap-6">
            {comparisonItems.filter((item): item is ComparisonItem => item !== null && !!item.variant).map((item, index) => {
              const onRoadPrice = getOnRoadPrice(item.variant.price, item.variant.fuelType)
              const emi = calculateEMI(onRoadPrice)

              return (
                <div key={index} className="text-center">
                  <div className="text-xs text-gray-600 mb-1">Starting EMI</div>
                  <div className="text-2xl font-bold text-gray-900">₹{emi.toLocaleString('en-IN')}</div>
                  <div className="text-xs text-gray-600 mt-1">per month</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Ad Banner */}
        <Ad3DCarousel className="my-4" />

        {/* Specifications - 9 Sections from Variant Page */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Specifications</h2>
              <div className="h-1 w-32 bg-gradient-to-r from-orange-600 to-red-600 rounded-full mt-2"></div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer bg-orange-50 px-4 py-2 rounded-lg hover:bg-orange-100 transition-colors">
              <input
                type="checkbox"
                checked={showDifferences}
                onChange={(e) => setShowDifferences(e.target.checked)}
                className="w-4 h-4 text-orange-600"
              />
              <span className="text-sm font-medium text-gray-700">Show differences only</span>
            </label>
          </div>

          {/* All 9 Specification Sections - Show ALL fields */}
          {specificationSections.map((section) => {
            return (
              <div key={section.id} className="border-b border-gray-200 mb-2">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between py-3 text-left"
                >
                  <h3 className="text-base font-semibold text-gray-900">{section.title}</h3>
                  <span className="text-2xl text-gray-600">{expandedSections[section.id] ? '−' : '—'}</span>
                </button>

                {expandedSections[section.id] && (
                  <div className="pb-4 space-y-2">
                    {section.specs.map((spec) => {
                      const validItems = comparisonItems.filter((item): item is ComparisonItem => item !== null && !!item.variant)
                      const values = validItems.map(item => item.variant[spec.key] || 'N/A')
                      const allSame = values.every(v => v === values[0])
                      if (showDifferences && allSame) return null

                      return (
                        <div key={spec.key} className={`py-3 px-3 rounded-lg transition-colors ${!allSame ? 'bg-orange-50 border-l-4 border-orange-400' : 'hover:bg-gray-50'}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="text-sm font-semibold text-gray-800">{spec.label}</div>
                            {!allSame && (
                              <span className="text-xs bg-orange-200 text-orange-800 px-2 py-0.5 rounded-full font-medium">
                                Different
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            {comparisonItems.filter((item): item is ComparisonItem => item !== null && !!item.variant).map((item, idx) => (
                              <div key={idx} className={`text-sm font-medium ${!allSame ? 'text-gray-900' : 'text-gray-600'}`}>
                                {item.variant[spec.key] || 'N/A'}
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Ad Banner */}
        <Ad3DCarousel className="my-4" />

        {/* Compare With Similar Cars */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">Compare With Similar Cars</h2>

          {loadingSimilarCars ? (
            <div className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto pb-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-shrink-0 w-80 bg-white rounded-xl border border-gray-200 p-4">
                  <div className="h-32 bg-gray-200 animate-pulse rounded"></div>
                </div>
              ))}
            </div>
          ) : similarCars.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No cars available for comparison</p>
            </div>
          ) : (
            <div className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto pb-4" style={{ scrollbarWidth: 'thin' }}>
              {similarCars.map((car) => {
                const firstValidItem = comparisonItems.find((item): item is ComparisonItem => item !== null && !!item.variant)
                if (!firstValidItem) return null

                // Fix: Handle undefined or zero prices
                const carPrice = car.startingPrice || 0
                if (carPrice === 0) return null

                const currentModelOnRoad = getOnRoadPrice(firstValidItem.variant.price, firstValidItem.variant.fuelType)
                const compareCarOnRoad = getOnRoadPrice(carPrice, car.fuelTypes?.[0] || car.lowestPriceFuelType || 'Petrol')

                return (
                  <div key={car.id} className="flex-shrink-0 w-[320px] bg-white rounded-xl border border-gray-200 p-3 hover:shadow-lg transition-all">
                    <div className="flex items-start gap-2 mb-3">
                      <div className="flex-1">
                        <div className="relative mb-2">
                          <img
                            src={firstValidItem.model.heroImage}
                            alt={`${firstValidItem.model.brandName} ${firstValidItem.model.name}`}
                            className="w-full h-20 object-contain"
                            onError={(e) => {
                              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='%23374151'%3E%3Cpath d='M50 200h300c5.5 0 10-4.5 10-10v-80c0-16.6-13.4-30-30-30H70c-16.6 0-30 13.4-30 30v80c0 5.5 4.5 10 10 10z'/%3E%3Ccircle cx='100' cy='220' r='25' fill='%23111827'/%3E%3Ccircle cx='300' cy='220' r='25' fill='%23111827'/%3E%3C/svg%3E"
                            }}
                          />
                        </div>
                        <div className="text-left">
                          <div className="text-xs text-gray-500">{firstValidItem.model.brandName}</div>
                          <div className="font-bold text-sm text-gray-900 mb-1">{firstValidItem.model.name}</div>
                          <div className="text-red-600 font-bold text-sm">
                            ₹ {(currentModelOnRoad / 100000).toFixed(2)} Lakh
                          </div>
                          <div className="text-xs text-gray-500">On-Road Price</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-center" style={{ marginTop: '30px' }}>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-600 to-orange-500 flex items-center justify-center shadow-md">
                          <span className="text-white text-xs font-bold">VS</span>
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="relative mb-2">
                          <img
                            src={car.image}
                            alt={`${car.brand} ${car.name}`}
                            className="w-full h-20 object-contain"
                            onError={(e) => {
                              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='%23374151'%3E%3Cpath d='M50 200h300c5.5 0 10-4.5 10-10v-80c0-16.6-13.4-30-30-30H70c-16.6 0-30 13.4-30 30v80c0 5.5 4.5 10 10 10z'/%3E%3Ccircle cx='100' cy='220' r='25' fill='%23111827'/%3E%3Ccircle cx='300' cy='220' r='25' fill='%23111827'/%3E%3C/svg%3E"
                            }}
                          />
                        </div>
                        <div className="text-left">
                          <div className="text-xs text-gray-500">{car.brandName || car.brand}</div>
                          <div className="font-bold text-sm text-gray-900 mb-1">{car.name}</div>
                          <div className="text-red-600 font-bold text-sm">
                            ₹ {(compareCarOnRoad / 100000).toFixed(2)} Lakh
                          </div>
                          <div className="text-xs text-gray-500">On-Road Price</div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const brand1 = firstValidItem.model.brandName.toLowerCase().replace(/\s+/g, '-')
                        const model1 = firstValidItem.model.name.toLowerCase().replace(/\s+/g, '-')
                        const brand2 = (car.brandName || car.brand || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^brand-/, '')
                        const model2 = car.name.toLowerCase().replace(/\s+/g, '-')
                        router.push(`/compare/${brand1}-${model1}-vs-${brand2}-${model2}`)
                      }}
                      className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white py-2 rounded-lg transition-all text-sm font-semibold shadow-sm"
                    >
                      Compare Now
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Ad Banner */}
        <Ad3DCarousel className="my-4" />

        {/* Popular Comparison - Using Homepage Component */}
        <div className="mb-6">
          <PopularComparisons />
        </div>

        {/* Similar Cars Section - Exact copy from Model Page */}
        <div className="mb-6">
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Similar Cars You May Like
            </h2>

            {/* Cars Horizontal Scroll */}
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
                      const container = document.getElementById('compare-similar-scroll')
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
                      const container = document.getElementById('compare-similar-scroll')
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
                    id="compare-similar-scroll"
                    className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {similarCars.map((car) => (
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

        {/* Ad Banner */}
        <Ad3DCarousel className="my-4" />

        {/* Comparison Videos */}
        <ComparisonYouTube carNames={comparisonItems.filter((item): item is ComparisonItem => item !== null).map(item => `${item.model.brandName} ${item.model.name}`)} />
      </div>

      {/* Variant Selection Modal */}
      {showVariantModal !== null && comparisonItems[showVariantModal] && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowVariantModal(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Select Variant</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {comparisonItems[showVariantModal]!.model.brandName} {comparisonItems[showVariantModal]!.model.name}
                </p>
              </div>
              <button
                onClick={() => setShowVariantModal(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            {/* Variants List */}
            <div className="overflow-y-auto max-h-96 p-4">
              {comparisonItems[showVariantModal]!.model.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    handleVariantChange(showVariantModal, v)
                    setShowVariantModal(null)
                  }}
                  className={`w-full text-left px-5 py-4 hover:bg-gray-50 rounded-xl transition-colors border-2 mb-3 ${v.id === comparisonItems[showVariantModal]!.variant.id
                    ? 'bg-orange-50 border-orange-500'
                    : 'border-gray-100 hover:border-gray-200'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-base mb-1">{v.name}</div>
                      <div className="text-sm text-gray-500">₹{(v.price / 100000).toFixed(2)} Lakhs</div>
                    </div>
                    {v.id === comparisonItems[showVariantModal]!.variant.id && (
                      <div className="ml-3 w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Car Search Modal */}
      {showAddCarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddCarModal(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Add Car to Compare</h2>
              <button
                onClick={() => setShowAddCarModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-6 border-b border-gray-200">
              <input
                type="text"
                placeholder="Search for a car model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-base"
                autoFocus
              />
            </div>

            {/* Search Results */}
            <div className="overflow-y-auto max-h-96 p-4">
              {allModels
                .filter((m: any) => {
                  const brandMap: Record<string, string> = {}
                  brands.forEach((brand: any) => { brandMap[brand.id] = brand.name })
                  const brandName = brandMap[m.brandId] || ''
                  const fullName = `${brandName} ${m.name}`.toLowerCase()
                  return fullName.includes(searchQuery.toLowerCase()) && !comparisonItems.filter((item): item is ComparisonItem => item !== null).some(item => item.model.id === m.id)
                })
                .slice(0, 10)
                .map((model: any) => {
                  const brandMap: Record<string, string> = {}
                  brands.forEach((brand: any) => { brandMap[brand.id] = brand.name })
                  const brandName = brandMap[model.brandId] || ''

                  return (
                    <button
                      key={model.id}
                      onClick={() => handleAddCar(model)}
                      className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors border border-gray-100 mb-2"
                    >
                      <img
                        src={resolveImageUrl(model.heroImage)}
                        alt={`${brandName} ${model.name}`}
                        className="w-20 h-16 object-contain"
                        onError={(e) => {
                          e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='%23374151'%3E%3Cpath d='M50 200h300c5.5 0 10-4.5 10-10v-80c0-16.6-13.4-30-30-30H70c-16.6 0-30 13.4-30 30v80c0 5.5 4.5 10 10 10z'/%3E%3Ccircle cx='100' cy='220' r='25' fill='%23111827'/%3E%3Ccircle cx='300' cy='220' r='25' fill='%23111827'/%3E%3C/svg%3E"
                        }}
                      />
                      <div className="flex-1 text-left">
                        <div className="text-xs text-gray-500">{brandName}</div>
                        <div className="font-bold text-gray-900">{model.name}</div>
                      </div>
                      <Plus className="h-5 w-5 text-orange-600" />
                    </button>
                  )
                })}
              {searchQuery && allModels.filter((m: any) => {
                const brandMap: Record<string, string> = {}
                brands.forEach((brand: any) => { brandMap[brand.id] = brand.name })
                const brandName = brandMap[m.brandId] || ''
                const fullName = `${brandName} ${m.name}`.toLowerCase()
                return fullName.includes(searchQuery.toLowerCase()) && !comparisonItems.filter((item): item is ComparisonItem => item !== null).some(item => item.model.id === m.id)
              }).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No cars found matching "{searchQuery}"
                  </div>
                )}
            </div>
          </div>
        </div>
      )}


      <Footer />
      <FloatingAIBot
        type="comparison"
        id={comparisonItems.length > 0
          ? comparisonItems
            .filter((item): item is ComparisonItem => item !== null)
            .map(item => item.model.id) // Use Model IDs for stability
            .join(',')
          : "general"
        }
        name={comparisonItems.length > 0 ? "Comparison" : "Comparison Tool"}
      />
    </div>
  )
}
