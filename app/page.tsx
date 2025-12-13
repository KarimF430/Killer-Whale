import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import HeroSection from '@/components/home/HeroSection'
import CarsByBudget from '@/components/home/CarsByBudget'
import TopCarsByBodyType from '@/components/home/TopCarsByBodyType'
import TataSierraAdBanner from '@/components/ads/TataSierraAdBanner'
import PageSection from '@/components/common/PageSection'
import Card from '@/components/common/Card'
import { staticPageSEO } from '@/lib/seo'

// Lazy load below-fold components for better performance
const PopularCars = dynamic(() => import('@/components/home/PopularCars'), {
  loading: () => <div className="h-96 bg-gray-100 rounded-lg animate-pulse" />
})

const DecemberOffersSection = dynamic(() => import('@/components/home/DecemberOffersSection'), {
  loading: () => <div className="h-96 bg-gray-100 rounded-lg animate-pulse" />
})

const BrandSection = dynamic(() => import('@/components/home/BrandSection'), {
  loading: () => <div className="h-96 bg-gray-100 rounded-lg animate-pulse" />
})

const UpcomingCars = dynamic(() => import('@/components/home/UpcomingCars'), {
  loading: () => <div className="h-96 bg-gray-100 rounded-lg animate-pulse" />
})

const FavouriteCars = dynamic(() => import('@/components/home/FavouriteCars'), {
  loading: () => <div className="h-96 bg-gray-100 rounded-lg animate-pulse" />
})

const NewLaunchedCars = dynamic(() => import('@/components/home/NewLaunchedCars'), {
  loading: () => <div className="h-96 bg-gray-100 rounded-lg animate-pulse" />
})

const LatestCarNews = dynamic(() => import('@/components/home/LatestCarNews'), {
  loading: () => <div className="h-96 bg-gray-100 rounded-lg animate-pulse" />
})

const PopularComparisons = dynamic(() => import('@/components/home/PopularComparisons'), {
  loading: () => <div className="h-80 bg-gray-100 rounded-lg animate-pulse" />
})

const YouTubeVideoPlayer = dynamic(() => import('@/components/home/YouTubeVideoPlayer'), {
  loading: () => <div className="h-80 bg-gray-100 rounded-lg animate-pulse" />
})

const VideoAd = dynamic(() => import('@/components/ads/VideoAd'), {
  loading: () => <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
})

const Ad3DCarousel = dynamic(() => import('@/components/ads/Ad3DCarousel'), {
  loading: () => <div className="h-48 bg-gray-100 rounded-lg animate-pulse" />
})

const AIChatbotPopup = dynamic(() => import('@/components/ads/AIChatbotPopup'), {
  loading: () => null
})

const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div className="h-96 bg-gray-900 animate-pulse" />
})


export const metadata: Metadata = staticPageSEO.home
export const revalidate = 3600 // Revalidate every hour

// Helper interfaces and functions
interface Car {
  id: string
  name: string
  brand: string
  brandName: string
  image: string
  startingPrice: number
  lowestPriceFuelType?: string
  fuelTypes: string[]
  transmissions: string[]
  seating: number
  launchDate: string
  slug: string
  isNew: boolean
  isPopular: boolean
  popularRank: number | null
  newRank: number | null
  bodyType?: string
  topRank?: number | null
}

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

// Helper function to normalize fuel types
const normalizeFuelType = (fuel: string): string => {
  const lower = fuel.toLowerCase()
  if (lower === 'petrol') return 'Petrol'
  if (lower === 'diesel') return 'Diesel'
  if (lower === 'cng') return 'CNG'
  if (lower === 'electric') return 'Electric'
  if (lower === 'hybrid') return 'Hybrid'
  return fuel.charAt(0).toUpperCase() + fuel.slice(1).toLowerCase()
}

// Helper function to normalize transmission types
const normalizeTransmission = (transmission: string): string => {
  const lower = transmission.toLowerCase()
  if (lower === 'manual') return 'Manual'
  if (lower === 'automatic') return 'Automatic'
  if (lower === 'amt') return 'AMT'
  if (lower === 'cvt') return 'CVT'
  if (lower === 'dct') return 'DCT'
  if (lower === 'torque converter') return 'Automatic'
  return transmission.toUpperCase()
}

async function getHomeData() {
  // Use BACKEND_URL for server-side fetching (not NEXT_PUBLIC_BACKEND_URL which is for client)
  const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'
  console.log('🔍 Fetching home data from:', backendUrl)

  try {
    // Fetch all data in parallel (10 requests) - Including all budget ranges for optimal SSR performance
    // This eliminates client-side fetching, improves SEO, and leverages ISR + Redis caching
    const [
      popularRes,
      modelsRes,
      brandsRes,
      comparisonsRes,
      newsRes,
      upcomingCarsRes,
      // Pre-fetch all budget ranges for Cars by Budget section (SSR optimization)
      budgetUnder8Res,
      budgetUnder15Res,
      budgetUnder25Res,
      budgetUnder50Res
    ] = await Promise.all([
      fetch(`${backendUrl}/api/cars/popular`, { next: { revalidate: 3600 } }),
      fetch(`${backendUrl}/api/models-with-pricing?limit=80`, { next: { revalidate: 3600 } }),
      fetch(`${backendUrl}/api/brands`, { next: { revalidate: 3600 } }),
      fetch(`${backendUrl}/api/popular-comparisons`, { next: { revalidate: 3600 } }),
      fetch(`${backendUrl}/api/news?limit=6`, { next: { revalidate: 3600 } }),
      fetch(`${backendUrl}/api/upcoming-cars`, { next: { revalidate: 3600 } }),
      // Budget cars - fetch 12 each (10 displayed + buffer) with 1-hour cache
      fetch(`${backendUrl}/api/cars-by-budget/under-8?limit=12`, { next: { revalidate: 3600 } }),
      fetch(`${backendUrl}/api/cars-by-budget/under-15?limit=12`, { next: { revalidate: 3600 } }),
      fetch(`${backendUrl}/api/cars-by-budget/under-25?limit=12`, { next: { revalidate: 3600 } }),
      fetch(`${backendUrl}/api/cars-by-budget/under-50?limit=12`, { next: { revalidate: 3600 } })
    ])

    const popularData = await popularRes.json()
    const modelsData = await modelsRes.json()
    const brandsData = await brandsRes.json()
    const comparisonsData = await comparisonsRes.json()
    const upcomingCarsData = await upcomingCarsRes.json()

    // Parse budget cars data
    const budgetUnder8Data = await budgetUnder8Res.json()
    const budgetUnder15Data = await budgetUnder15Res.json()
    const budgetUnder25Data = await budgetUnder25Res.json()
    const budgetUnder50Data = await budgetUnder50Res.json()

    // Check news response
    let newsData = { articles: [] }
    try {
      if (newsRes.ok) {
        newsData = await newsRes.json()
        console.log('✅ News fetched:', newsData.articles?.length || 0, 'articles')
      } else {
        console.error('❌ News fetch failed:', newsRes.status, newsRes.statusText)
      }
    } catch (err) {
      console.error('❌ News parse error:', err)
    }

    const models = modelsData.data || modelsData
    const brands = brandsData

    // Create brand map
    const brandMap = brands.reduce((acc: any, brand: any) => {
      acc[brand.id] = brand.name
      return acc
    }, {})

    // Process Popular Cars with normalization
    const popularCars: Car[] = Array.isArray(popularData) ? popularData.map((car: any) => ({
      id: car.id,
      name: car.name,
      brand: car.brandId,
      brandName: car.brandName,
      image: car.image ? (car.image.startsWith('http') ? car.image : `${backendUrl}${car.image}`) : '',
      startingPrice: car.startingPrice,
      popularRank: (car as any).popularRank ?? null,
      newRank: (car as any).newRank ?? null,
      lowestPriceFuelType: (car as any).lowestPriceFuelType,
      fuelTypes: (car.fuelTypes || ['Petrol']).map(normalizeFuelType),
      transmissions: (car.transmissions || ['Manual']).map(normalizeTransmission),
      seating: car.seating,
      launchDate: car.launchDate ? `Launched ${formatLaunchDate(car.launchDate)}` : 'Launched',
      slug: `${car.brandName.toLowerCase().replace(/\s+/g, '-')}-${car.name.toLowerCase().replace(/\s+/g, '-')}`,
      isNew: car.isNew,
      isPopular: car.isPopular,

    })) : []

    // Process All Cars (for Budget) with normalization
    const allCars: Car[] = Array.isArray(models) ? models.map((model: any) => {
      const brandName = brandMap[model.brandId] || 'Unknown'
      return {
        id: model.id,
        name: model.name,
        brand: model.brandId,
        brandName: brandName,
        image: model.heroImage ? (model.heroImage.startsWith('http') ? model.heroImage : `${backendUrl}${model.heroImage}`) : '/car-placeholder.jpg',
        startingPrice: model.lowestPrice || 0,
        fuelTypes: (model.fuelTypes || ['Petrol']).map(normalizeFuelType),
        transmissions: (model.transmissions || ['Manual']).map(normalizeTransmission),
        seating: 5,
        launchDate: model.launchDate || 'Launched',
        slug: `${brandName.toLowerCase().replace(/\s+/g, '-')}-${model.name.toLowerCase().replace(/\s+/g, '-')}`,
        isNew: model.isNew || false,
        isPopular: model.isPopular || false,
        popularRank: model.popularRank ?? null,
        newRank: model.newRank ?? null,
        bodyType: model.bodyType || undefined,
        topRank: model.topRank ?? null
      }
    }) : []

    // Process New Launched Cars
    const newLaunchedCars = allCars
      .filter(car => car.isNew)
      .sort((a, b) => (a.newRank || 999) - (b.newRank || 999))

    // Process Comparisons with model and brand data
    const processedComparisons = Array.isArray(comparisonsData) ? comparisonsData
      .filter((comp: any) => comp.model1Id && comp.model2Id)
      .map((comp: any) => {
        const model1 = models.find((m: any) => m.id === comp.model1Id)
        const model2 = models.find((m: any) => m.id === comp.model2Id)

        if (!model1 || !model2) return null

        return {
          id: comp.id,
          model1: {
            id: model1.id,
            name: model1.name,
            brand: brandMap[model1.brandId] || 'Unknown',
            heroImage: model1.heroImage || '',
            startingPrice: model1.lowestPrice || 0,
            fuelTypes: model1.fuelTypes || ['Petrol']
          },
          model2: {
            id: model2.id,
            name: model2.name,
            brand: brandMap[model2.brandId] || 'Unknown',
            heroImage: model2.heroImage || '',
            startingPrice: model2.lowestPrice || 0,
            fuelTypes: model2.fuelTypes || ['Petrol']
          }
        }
      })
      .filter((comp): comp is NonNullable<typeof comp> => comp !== null) : []

    // Process Upcoming Cars
    const upcomingCars = Array.isArray(upcomingCarsData) ? upcomingCarsData.map((car: any) => ({
      id: car.id,
      name: car.name,
      brandId: car.brandId,
      brandName: brandMap[car.brandId] || 'Unknown',
      image: car.heroImage ? (car.heroImage.startsWith('http') ? car.heroImage : `${backendUrl}${car.heroImage}`) : '',
      expectedPriceMin: car.expectedPriceMin,
      expectedPriceMax: car.expectedPriceMax,
      fuelTypes: (car.fuelTypes || ['Petrol']).map(normalizeFuelType),
      expectedLaunchDate: car.expectedLaunchDate,
      isNew: true,
      isPopular: false
    })) : []

    // ✅ Process Budget Cars (pre-fetched from dedicated API for optimal performance)
    // This data is ISR-cached for 1 hour + Redis-cached, eliminating runtime DB calls
    const processBudgetCars = (data: any): Car[] => {
      const cars = data?.data || []
      return cars.map((car: any) => ({
        id: car.id,
        name: car.name,
        brand: car.brand,
        brandName: car.brandName,
        image: car.image,
        startingPrice: car.startingPrice,
        fuelTypes: (car.fuelTypes || ['Petrol']).map(normalizeFuelType),
        transmissions: (car.transmissions || ['Manual']).map(normalizeTransmission),
        seating: car.seating || 5,
        launchDate: car.launchDate || 'Launched',
        slug: car.slug,
        isNew: car.isNew || false,
        isPopular: car.isPopular || false,
        popularRank: null,
        newRank: null
      }))
    }

    const budgetCarsByRange = {
      'under-8': processBudgetCars(budgetUnder8Data),
      'under-15': processBudgetCars(budgetUnder15Data),
      'under-25': processBudgetCars(budgetUnder25Data),
      'under-50': processBudgetCars(budgetUnder50Data)
    }

    return {
      popularCars,
      allCars,
      newLaunchedCars,
      brands,
      comparisons: processedComparisons,
      news: newsData.articles || [],
      upcomingCars,
      budgetCarsByRange
    }
  } catch (error) {
    console.error('Error fetching home data:', error)
    return {
      popularCars: [],
      allCars: [],
      newLaunchedCars: [],
      brands: [],
      comparisons: [],
      news: [],
      upcomingCars: [],
      budgetCarsByRange: {
        'under-8': [],
        'under-15': [],
        'under-25': [],
        'under-50': []
      }
    }
  }
}

export default async function HomePage() {
  const { popularCars, allCars, newLaunchedCars, brands, comparisons, news, upcomingCars, budgetCarsByRange } = await getHomeData()

  return (
    <div className="min-h-screen bg-white relative">
      <main className="relative z-[2]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <Ad3DCarousel className="my-3 sm:my-4" />
        </div>
        <HeroSection />

        <PageSection background="gray">
          <CarsByBudget budgetCarsByRange={budgetCarsByRange} />
        </PageSection>

        <PageSection background="white">
          <TopCarsByBodyType initialCars={allCars} />
        </PageSection>

        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <TataSierraAdBanner />
        </div>

        <PageSection background="white">
          <PopularCars initialCars={popularCars} />
        </PageSection>

        <PageSection background="gray">
          <DecemberOffersSection initialCars={allCars} initialBrands={brands} />
        </PageSection>

        <PageSection background="white">
          <BrandSection initialBrands={brands} />
        </PageSection>

        <PageSection background="white">
          <UpcomingCars initialCars={upcomingCars} />
        </PageSection>

        <PageSection background="white">
          <FavouriteCars />
        </PageSection>

        <PageSection background="gray">
          <div className="max-w-4xl mx-auto">
            <VideoAd videoId="MVYRGxM7NtU" variant="inline" />
          </div>
        </PageSection>

        <PageSection background="white">
          <NewLaunchedCars initialCars={newLaunchedCars} />
        </PageSection>

        <PageSection background="white">
          <PopularComparisons initialComparisons={comparisons} />
        </PageSection>

        <PageSection background="white">
          <LatestCarNews initialNews={news} />
        </PageSection>

        <PageSection background="white">
          <YouTubeVideoPlayer />
        </PageSection>
      </main >

      <Footer />

      {/* AI Chatbot Popup Ad */}
      <AIChatbotPopup />
    </div >
  )
}
