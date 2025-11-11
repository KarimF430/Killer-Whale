'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Force dynamic rendering to prevent static generation
export const dynamic = 'force-dynamic'
import { ChevronDown, Plus, Share2, X, TrendingUp, TrendingDown, Award } from 'lucide-react'
import { calculateOnRoadPrice } from '@/lib/rto-data-optimized'
import Footer from '@/components/Footer'

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

export default function ComparePage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter()
  const [slug, setSlug] = useState('')
  const [comparisonItems, setComparisonItems] = useState<ComparisonItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showVariantDropdown, setShowVariantDropdown] = useState<number | null>(null)
  const [seoText, setSeoText] = useState('')
  const [showDifferences, setShowDifferences] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [similarCars, setSimilarCars] = useState<any[]>([])
  const [loadingSimilarCars, setLoadingSimilarCars] = useState(false)
  const [popularComparisons, setPopularComparisons] = useState<any[]>([])
  const [loadingPopularComparisons, setLoadingPopularComparisons] = useState(false)
  const [popularCars, setPopularCars] = useState<any[]>([])
  const [loadingPopularCars, setLoadingPopularCars] = useState(false)
  const [upcomingCars, setUpcomingCars] = useState<any[]>([])
  const [loadingUpcomingCars, setLoadingUpcomingCars] = useState(false)

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

  useEffect(() => {
    params.then(p => setSlug(p.slug))
  }, [params])

  useEffect(() => {
    if (!slug) return
    fetchComparisonData()
    fetchPopularComparisons()
    fetchPopularCars()
    fetchUpcomingCars()
  }, [slug])

  useEffect(() => {
    if (comparisonItems.length > 0) {
      fetchSimilarCars()
    }
  }, [comparisonItems])

  const fetchComparisonData = async () => {
    try {
      setLoading(true)
      const parts = slug.split('-vs-')
      if (parts.length < 2) return

      const [modelsRes, brandsRes, variantsRes] = await Promise.all([
        fetch(`${backendUrl}/api/models`),
        fetch(`${backendUrl}/api/brands`),
        fetch(`${backendUrl}/api/variants`)
      ])

      const allModels = await modelsRes.json()
      const brands = await brandsRes.json()
      const allVariants = await variantsRes.json()

      const brandMap: Record<string, string> = {}
      brands.forEach((brand: any) => { brandMap[brand.id] = brand.name })

      const findModel = (targetSlug: string) => {
        return allModels.find((m: any) => {
          const brandName = brandMap[m.brandId] || ''
          const modelSlug = `${brandName.toLowerCase().replace(/\s+/g, '-')}-${m.name.toLowerCase().replace(/\s+/g, '-')}`
          return modelSlug === targetSlug
        })
      }

      const items: ComparisonItem[] = []
      const modelNames: string[] = []

      for (let i = 0; i < Math.min(parts.length, 4); i++) {
        const foundModel = findModel(parts[i])
        if (foundModel) {
          const modelVariants = allVariants.filter((v: any) => v.modelId === foundModel.id)

          const model: Model = {
            id: foundModel.id,
            name: foundModel.name,
            brandName: brandMap[foundModel.brandId],
            heroImage: foundModel.heroImage ? `${backendUrl}${foundModel.heroImage}` : '',
            variants: modelVariants
          }

          if (modelVariants.length > 0) {
            const lowestVariant = modelVariants.reduce((prev: Variant, curr: Variant) => 
              (curr.price < prev.price && curr.price > 0) ? curr : prev
            )
            items.push({ model, variant: lowestVariant })
            modelNames.push(`${model.brandName} ${model.name}`)
          }
        }
      }

      setComparisonItems(items)
      if (modelNames.length > 0) {
        setSeoText(`Motoroctane brings you comparison of ${modelNames.join(', ')}...`)
      }

    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSimilarCars = async () => {
    if (comparisonItems.length === 0) return
    
    try {
      setLoadingSimilarCars(true)
      const firstModel = comparisonItems[0].model
      
      const [modelsRes, brandsRes, variantsRes] = await Promise.all([
        fetch(`${backendUrl}/api/models`),
        fetch(`${backendUrl}/api/brands`),
        fetch(`${backendUrl}/api/variants`)
      ])

      const allModels = await modelsRes.json()
      const brands = await brandsRes.json()
      const allVariants = await variantsRes.json()

      const brandMap: Record<string, string> = {}
      brands.forEach((brand: any) => { brandMap[brand.id] = brand.name })

      // Filter similar cars (exclude current comparison cars)
      const currentModelIds = comparisonItems.map(item => item.model.id)
      const similar = allModels
        .filter((m: any) => !currentModelIds.includes(m.id))
        .slice(0, 6)
        .map((m: any) => {
          const modelVariants = allVariants.filter((v: any) => v.modelId === m.id)
          const lowestPrice = modelVariants.length > 0
            ? Math.min(...modelVariants.map((v: any) => v.price || 0))
            : 0

          return {
            id: m.id,
            name: m.name,
            brand: brandMap[m.brandId],
            image: m.heroImage ? `${backendUrl}${m.heroImage}` : '',
            startingPrice: lowestPrice,
            fuelTypes: m.fuelTypes || ['Petrol']
          }
        })

      setSimilarCars(similar)
    } catch (error) {
      console.error('Error fetching similar cars:', error)
    } finally {
      setLoadingSimilarCars(false)
    }
  }

  const fetchPopularComparisons = async () => {
    try {
      setLoadingPopularComparisons(true)
      
      const comparisonsRes = await fetch(`${backendUrl}/api/popular-comparisons`)
      if (!comparisonsRes.ok) {
        setPopularComparisons([])
        return
      }
      
      const comparisonsData = await comparisonsRes.json()
      
      const [modelsRes, brandsRes, variantsRes] = await Promise.all([
        fetch(`${backendUrl}/api/models`),
        fetch(`${backendUrl}/api/brands`),
        fetch(`${backendUrl}/api/variants`)
      ])

      const models = await modelsRes.json()
      const brands = await brandsRes.json()
      const variants = await variantsRes.json()

      const brandMap: Record<string, string> = {}
      brands.forEach((brand: any) => { brandMap[brand.id] = brand.name })

      const processedComparisons = comparisonsData
        .filter((comp: any) => comp.model1Id && comp.model2Id)
        .map((comp: any) => {
          const model1 = models.find((m: any) => m.id === comp.model1Id)
          const model2 = models.find((m: any) => m.id === comp.model2Id)
          
          if (!model1 || !model2) return null
          
          const model1Variants = variants.filter((v: any) => v.modelId === model1.id)
          const model2Variants = variants.filter((v: any) => v.modelId === model2.id)
          
          const model1Price = model1Variants.length > 0
            ? Math.min(...model1Variants.map((v: any) => v.price || 0))
            : 0
            
          const model2Price = model2Variants.length > 0
            ? Math.min(...model2Variants.map((v: any) => v.price || 0))
            : 0
          
          return {
            id: comp.id,
            model1: {
              id: model1.id,
              name: model1.name,
              brand: brandMap[model1.brandId] || 'Unknown',
              heroImage: model1.heroImage ? `${backendUrl}${model1.heroImage}` : '',
              startingPrice: model1Price,
              fuelTypes: model1.fuelTypes || ['Petrol']
            },
            model2: {
              id: model2.id,
              name: model2.name,
              brand: brandMap[model2.brandId] || 'Unknown',
              heroImage: model2.heroImage ? `${backendUrl}${model2.heroImage}` : '',
              startingPrice: model2Price,
              fuelTypes: model2.fuelTypes || ['Petrol']
            }
          }
        })
        .filter(Boolean)
      
      setPopularComparisons(processedComparisons)
    } catch (error) {
      console.error('Error fetching popular comparisons:', error)
      setPopularComparisons([])
    } finally {
      setLoadingPopularComparisons(false)
    }
  }

  const fetchPopularCars = async () => {
    try {
      setLoadingPopularCars(true)
      
      const [modelsRes, brandsRes, variantsRes] = await Promise.all([
        fetch(`${backendUrl}/api/models`),
        fetch(`${backendUrl}/api/brands`),
        fetch(`${backendUrl}/api/variants`)
      ])
      
      if (!modelsRes.ok || !brandsRes.ok || !variantsRes.ok) {
        setPopularCars([])
        return
      }
      
      const models = await modelsRes.json()
      const brands = await brandsRes.json()
      const variants = await variantsRes.json()
      
      const brandMap = brands.reduce((acc: any, brand: any) => {
        acc[brand.id] = brand.name
        return acc
      }, {})
      
      const popularModels = models.filter((model: any) => model.isPopular === true)
      
      const processedCars = popularModels.map((model: any) => {
        const modelVariants = variants.filter((v: any) => v.modelId === model.id)
        const lowestPrice = modelVariants.length > 0
          ? Math.min(...modelVariants.map((v: any) => v.price || 0))
          : 0
        
        const fuelTypes = model.fuelTypes && model.fuelTypes.length > 0
          ? model.fuelTypes
          : Array.from(new Set(modelVariants.map((v: any) => v.fuel).filter(Boolean)))
        
        const transmissions = model.transmissions && model.transmissions.length > 0
          ? model.transmissions
          : Array.from(new Set(modelVariants.map((v: any) => v.transmission).filter(Boolean)))
        
        return {
          id: model.id,
          name: model.name,
          brandName: brandMap[model.brandId] || 'Unknown',
          image: model.heroImage ? `${backendUrl}${model.heroImage}` : '',
          startingPrice: lowestPrice,
          fuelTypes: fuelTypes.length > 0 ? fuelTypes : ['Petrol'],
          transmissions: transmissions.length > 0 ? transmissions : ['Manual'],
          seating: model.seating || 5,
          launchDate: model.launchDate || '',
          isNew: model.isNew || false,
          popularRank: model.popularRank || null
        }
      }).sort((a: any, b: any) => (a.popularRank || 999) - (b.popularRank || 999))
      
      setPopularCars(processedCars)
    } catch (error) {
      console.error('Error fetching popular cars:', error)
      setPopularCars([])
    } finally {
      setLoadingPopularCars(false)
    }
  }

  const fetchUpcomingCars = async () => {
    // Using static data like home page since backend might not have isUpcoming flag
    const staticUpcomingCars = [
      {
        id: 1,
        name: 'Grand Vitara',
        brandName: 'Maruti Suzuki',
        image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=300&fit=crop&crop=center',
        startingPrice: 1099000,
        fuelType: 'Petrol/Hybrid',
        seating: 5,
        launchDate: 'Launched January 2024',
        isNew: true
      },
      {
        id: 2,
        name: 'Safari',
        brandName: 'Tata',
        image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=300&fit=crop&crop=center',
        startingPrice: 2999000,
        fuelType: 'Petrol/Diesel',
        seating: 7,
        launchDate: 'Launched March 2024',
        isNew: true
      },
      {
        id: 3,
        name: 'Creta',
        brandName: 'Hyundai',
        image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop&crop=center',
        startingPrice: 1199000,
        fuelType: 'Petrol/Diesel',
        seating: 5,
        launchDate: 'Launched February 2024',
        isNew: false
      },
      {
        id: 4,
        name: 'Nexon',
        brandName: 'Tata',
        image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop&crop=center',
        startingPrice: 799000,
        fuelType: 'Petrol/Electric',
        seating: 5,
        launchDate: 'Launched April 2024',
        isNew: true
      }
    ]
    
    setUpcomingCars(staticUpcomingCars)
    setLoadingUpcomingCars(false)
  }

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
    newItems[index].variant = newVariant
    setComparisonItems(newItems)
    setShowVariantDropdown(null)
  }

  const handleAddMore = () => {
    // TODO: Implement modal to select car and variant
    alert('Add more cars functionality - to be implemented with car selection modal')
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${comparisonItems.map(item => `${item.model.brandName} ${item.model.name}`).join(' vs ')}`,
          text: 'Compare these cars on MotorOctane',
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
    if (comparisonItems.length !== 2) return null
    
    const item1 = comparisonItems[0]
    const item2 = comparisonItems[1]
    
    const price1 = getOnRoadPrice(item1.variant.price, item1.variant.fuelType)
    const price2 = getOnRoadPrice(item2.variant.price, item2.variant.fuelType)
    
    const priceDiff = Math.abs(price1 - price2)
    const priceDiffPercent = ((priceDiff / Math.min(price1, price2)) * 100).toFixed(1)
    const cheaperIndex = price1 < price2 ? 0 : 1
    
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
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {comparisonItems.map(item => `${item.model.brandName} ${item.model.name}`).join(' vs ')}
            </h1>
            <p className="text-base text-gray-600 leading-relaxed">
              {seoText}
              <span className="text-orange-600 font-bold cursor-pointer hover:text-orange-700">more</span>
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

        {/* Quick Comparison Stats */}
        {stats && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 mb-6 border border-orange-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-orange-600" />
                <span className="font-semibold text-gray-900">Quick Comparison</span>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Price Difference</div>
                <div className="text-lg font-bold text-orange-600">
                  ₹{(stats.priceDiff / 100000).toFixed(2)}L ({stats.priceDiffPercent}%)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Cards */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {comparisonItems.map((item, index) => {
            const onRoadPrice = getOnRoadPrice(item.variant.price, item.variant.fuelType)
            const isCheaper = stats && stats.cheaperIndex === index

            return (
              <div key={index} className={`bg-white rounded-2xl p-4 border-2 transition-all ${isCheaper ? 'border-orange-400 shadow-lg' : 'border-gray-200'}`}>
                {/* Best Value Badge */}
                {isCheaper && (
                  <div className="flex items-center gap-1 mb-2 bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-semibold w-fit">
                    <TrendingDown className="h-3 w-3" />
                    <span>Best Value</span>
                  </div>
                )}

                <div className="mb-3 bg-gray-50 rounded-xl p-2">
                  <img
                    src={item.model.heroImage}
                    alt={`${item.model.brandName} ${item.model.name}`}
                    className="w-full h-32 object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='%23374151'%3E%3Cpath d='M50 200h300c5.5 0 10-4.5 10-10v-80c0-16.6-13.4-30-30-30H70c-16.6 0-30 13.4-30 30v80c0 5.5 4.5 10 10 10z'/%3E%3Ccircle cx='100' cy='220' r='25' fill='%23111827'/%3E%3Ccircle cx='300' cy='220' r='25' fill='%23111827'/%3E%3C/svg%3E"
                    }}
                  />
                </div>

                <h3 className="font-bold text-gray-900 text-base mb-2">
                  {item.model.brandName} {item.model.name}
                </h3>

                {/* Variant Dropdown */}
                <div className="relative mb-3">
                  <button
                    onClick={() => setShowVariantDropdown(showVariantDropdown === index ? null : index)}
                    className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm hover:border-gray-300 transition-colors"
                  >
                    <span className="text-gray-700 truncate">{item.variant.name}</span>
                    <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0 ml-2" />
                  </button>
                  
                  {showVariantDropdown === index && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto z-30">
                      {item.model.variants.map((v) => (
                        <button
                          key={v.id}
                          onClick={() => handleVariantChange(index, v)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm border-b border-gray-100 last:border-0"
                        >
                          <div className="font-medium text-gray-900">{v.name}</div>
                          <div className="text-xs text-gray-500 mt-0.5">₹{(v.price / 100000).toFixed(2)} Lakhs</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-3">
                  <div className="text-xl font-bold text-red-600 mb-0.5">
                    ₹{(onRoadPrice / 100000).toFixed(2)} L
                  </div>
                  <div className="text-xs text-gray-600">On-Road Price</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Add More Button */}
        <button 
          onClick={handleAddMore}
          className="w-full bg-gray-200 rounded-2xl py-4 mb-4 flex items-center justify-center gap-2 text-gray-700 font-semibold text-lg hover:bg-gray-300 transition-colors"
        >
          <span>Add more</span>
          <Plus className="h-6 w-6" />
        </button>

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
            {comparisonItems.map((item, index) => {
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

        {/* Ad Banner - Proper Dimensions */}
        <div className="bg-gray-300 rounded-2xl py-24 mb-6 text-center">
          <h2 className="text-5xl font-bold text-gray-600">AD Banner</h2>
        </div>

        {/* Specifications - 9 Sections from Variant Page */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Specifications</h2>
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
                      const values = comparisonItems.map(item => item.variant[spec.key] || 'N/A')
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
                            {comparisonItems.map((item, idx) => (
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
        <div className="bg-gray-300 rounded-lg py-20 mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-600">AD Banner</h2>
        </div>

        {/* Compare With Similar Cars */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Compare With Similar Cars</h2>
          
          {loadingSimilarCars ? (
            <div className="flex gap-4 overflow-x-auto pb-4">
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
            <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'thin' }}>
              {similarCars.map((car) => {
                const currentModelOnRoad = getOnRoadPrice(comparisonItems[0].variant.price, comparisonItems[0].variant.fuelType)
                const compareCarOnRoad = getOnRoadPrice(car.startingPrice, car.fuelTypes?.[0] || 'Petrol')
                
                return (
                  <div key={car.id} className="flex-shrink-0 w-[320px] bg-white rounded-xl border border-gray-200 p-3 hover:shadow-lg transition-all">
                    <div className="flex items-start gap-2 mb-3">
                      <div className="flex-1">
                        <div className="relative mb-2">
                          <img 
                            src={comparisonItems[0].model.heroImage}
                            alt={`${comparisonItems[0].model.brandName} ${comparisonItems[0].model.name}`}
                            className="w-full h-20 object-contain"
                            onError={(e) => {
                              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='%23374151'%3E%3Cpath d='M50 200h300c5.5 0 10-4.5 10-10v-80c0-16.6-13.4-30-30-30H70c-16.6 0-30 13.4-30 30v80c0 5.5 4.5 10 10 10z'/%3E%3Ccircle cx='100' cy='220' r='25' fill='%23111827'/%3E%3Ccircle cx='300' cy='220' r='25' fill='%23111827'/%3E%3C/svg%3E"
                            }}
                          />
                        </div>
                        <div className="text-left">
                          <div className="text-xs text-gray-500">{comparisonItems[0].model.brandName}</div>
                          <div className="font-bold text-sm text-gray-900 mb-1">{comparisonItems[0].model.name}</div>
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
                          <div className="text-xs text-gray-500">{car.brand}</div>
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
                        const currentModelSlug = `${comparisonItems[0].model.brandName.toLowerCase().replace(/\s+/g, '-')}-${comparisonItems[0].model.name.toLowerCase().replace(/\s+/g, '-')}`
                        const compareModelSlug = `${car.brand.toLowerCase().replace(/\s+/g, '-')}-${car.name.toLowerCase().replace(/\s+/g, '-')}`
                        router.push(`/compare/${currentModelSlug}-vs-${compareModelSlug}`)
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
        <div className="bg-gray-300 rounded-lg py-20 mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-600">AD Banner</h2>
        </div>

        {/* Popular Comparison */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Popular Comparison</h2>
          
          {loadingPopularComparisons ? (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex-shrink-0 w-[320px] bg-white rounded-xl border border-gray-200 p-3">
                  <div className="h-48 bg-gray-200 animate-pulse rounded"></div>
                </div>
              ))}
            </div>
          ) : popularComparisons.length === 0 ? null : (
            <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'thin' }}>
              {popularComparisons.map((comparison) => {
                const model1OnRoad = getOnRoadPrice(comparison.model1.startingPrice, comparison.model1.fuelTypes[0] || 'Petrol')
                const model2OnRoad = getOnRoadPrice(comparison.model2.startingPrice, comparison.model2.fuelTypes[0] || 'Petrol')

                return (
                  <div key={comparison.id} className="flex-shrink-0 w-[320px] bg-white rounded-xl border border-gray-200 p-3 hover:shadow-lg transition-all">
                    <div className="flex items-start gap-2 mb-3">
                      <div className="flex-1">
                        <div className="relative mb-2">
                          <img
                            src={comparison.model1.heroImage}
                            alt={`${comparison.model1.brand} ${comparison.model1.name}`}
                            className="w-full h-20 object-contain"
                            onError={(e) => {
                              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='%23374151'%3E%3Cpath d='M50 200h300c5.5 0 10-4.5 10-10v-80c0-16.6-13.4-30-30-30H70c-16.6 0-30 13.4-30 30v80c0 5.5 4.5 10 10 10z'/%3E%3Ccircle cx='100' cy='220' r='25' fill='%23111827'/%3E%3Ccircle cx='300' cy='220' r='25' fill='%23111827'/%3E%3C/svg%3E"
                            }}
                          />
                        </div>
                        <div className="text-left">
                          <div className="text-xs text-gray-500">{comparison.model1.brand}</div>
                          <div className="font-bold text-sm text-gray-900 mb-1">{comparison.model1.name}</div>
                          <div className="text-red-600 font-bold text-sm">
                            ₹ {(model1OnRoad / 100000).toFixed(2)} Lakh
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
                            src={comparison.model2.heroImage}
                            alt={`${comparison.model2.brand} ${comparison.model2.name}`}
                            className="w-full h-20 object-contain"
                            onError={(e) => {
                              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='%23374151'%3E%3Cpath d='M50 200h300c5.5 0 10-4.5 10-10v-80c0-16.6-13.4-30-30-30H70c-16.6 0-30 13.4-30 30v80c0 5.5 4.5 10 10 10z'/%3E%3Ccircle cx='100' cy='220' r='25' fill='%23111827'/%3E%3Ccircle cx='300' cy='220' r='25' fill='%23111827'/%3E%3C/svg%3E"
                            }}
                          />
                        </div>
                        <div className="text-left">
                          <div className="text-xs text-gray-500">{comparison.model2.brand}</div>
                          <div className="font-bold text-sm text-gray-900 mb-1">{comparison.model2.name}</div>
                          <div className="text-red-600 font-bold text-sm">
                            ₹ {(model2OnRoad / 100000).toFixed(2)} Lakh
                          </div>
                          <div className="text-xs text-gray-500">On-Road Price</div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const slug1 = `${comparison.model1.brand.toLowerCase().replace(/\s+/g, '-')}-${comparison.model1.name.toLowerCase().replace(/\s+/g, '-')}`
                        const slug2 = `${comparison.model2.brand.toLowerCase().replace(/\s+/g, '-')}-${comparison.model2.name.toLowerCase().replace(/\s+/g, '-')}`
                        router.push(`/compare/${slug1}-vs-${slug2}`)
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

        {/* Popular Cars */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Cars</h2>
          
          {loadingPopularCars ? (
            <div className="flex gap-6 overflow-x-auto pb-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex-shrink-0 w-72 bg-white rounded-xl border border-gray-200">
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-8 bg-gray-200 animate-pulse rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : popularCars.length === 0 ? null : (
            <div className="flex gap-6 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
              {popularCars.map((car) => {
                const onRoadPrice = getOnRoadPrice(car.startingPrice, car.fuelTypes[0] || 'Petrol')
                
                return (
                  <div
                    key={car.id}
                    className="flex-shrink-0 w-72 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => {
                      const brandSlug = car.brandName.toLowerCase().replace(/\s+/g, '-')
                      const modelSlug = car.name.toLowerCase().replace(/\s+/g, '-')
                      router.push(`/${brandSlug}-cars/${modelSlug}`)
                    }}
                  >
                    <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden rounded-t-xl">
                      {car.isNew && (
                        <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                          NEW
                        </div>
                      )}
                      <img 
                        src={car.image}
                        alt={`${car.brandName} ${car.name}`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='%23374151'%3E%3Cpath d='M50 200h300c5.5 0 10-4.5 10-10v-80c0-16.6-13.4-30-30-30H70c-16.6 0-30 13.4-30 30v80c0 5.5 4.5 10 10 10z'/%3E%3Ccircle cx='100' cy='220' r='25' fill='%23111827'/%3E%3Ccircle cx='300' cy='220' r='25' fill='%23111827'/%3E%3C/svg%3E"
                        }}
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 mb-2 text-lg">{car.brandName} {car.name}</h3>
                      <div className="text-red-600 font-bold text-xl mb-1">
                        ₹ {(onRoadPrice / 100000).toFixed(2)} Lakh
                      </div>
                      <div className="text-xs text-gray-500 mb-4">On-Road Price</div>
                      <button className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white py-3 rounded-lg transition-all text-sm font-semibold">
                        View Details
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Ad Banner */}
        <div className="bg-gray-300 rounded-lg py-20 mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-600">AD Banner</h2>
        </div>

        {/* Upcoming Cars - EXACT from home page */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Upcoming Cars</h2>
          
          <div className="relative">
            <div
              className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {upcomingCars.map((car) => (
                <div
                  key={car.id}
                  className="flex-shrink-0 w-72 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  {/* Car Image with Badges */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                    {/* NEW Badge */}
                    {car.isNew && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                        NEW
                      </div>
                    )}
                    
                    {/* Heart Icon */}
                    <button className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors z-10">
                      <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>

                    {/* Car Image */}
                    <div className="w-full h-full flex items-center justify-center">
                      <img 
                        src={car.image}
                        alt={`${car.brandName} ${car.name}`}
                        className="w-full h-full object-contain object-center transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='%23374151'%3E%3Cpath d='M50 200h300c5.5 0 10-4.5 10-10v-80c0-16.6-13.4-30-30-30H70c-16.6 0-30 13.4-30 30v80c0 5.5 4.5 10 10 10z'/%3E%3Ccircle cx='100' cy='220' r='25' fill='%23111827'/%3E%3Ccircle cx='300' cy='220' r='25' fill='%23111827'/%3E%3Cpath d='M80 110h240l-20-30H100z' fill='%236B7280'/%3E%3C/svg%3E"
                        }}
                      />
                    </div>
                  </div>

                  {/* Car Info */}
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">{car.brandName} {car.name}</h3>
                    
                    <div className="flex items-center text-red-600 font-bold text-xl mb-4">
                      <span>₹ {(car.startingPrice / 100000).toFixed(2)} Lakh</span>
                    </div>

                    <div className="space-y-3 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <svg className="h-4 w-4 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{car.launchDate}</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="h-4 w-4 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>{car.fuelType}</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="h-4 w-4 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>{car.seating} Seater</span>
                      </div>
                    </div>

                    <button className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white py-3 rounded-lg transition-all duration-200 text-sm font-semibold">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
