import { Metadata } from 'next'
import Footer from '@/components/Footer'
import AdBanner from '@/components/home/AdBanner'
import Ad3DCarousel from '@/components/ads/Ad3DCarousel'
import HeroSection from '@/components/home/HeroSection'
import CarsByBudget from '@/components/home/CarsByBudget'
import PopularCars from '@/components/home/PopularCars'
import BrandSection from '@/components/home/BrandSection'
import UpcomingCars from '@/components/home/UpcomingCars'
import FavouriteCars from '@/components/home/FavouriteCars'
import NewLaunchedCars from '@/components/home/NewLaunchedCars'
import LatestCarNews from '@/components/home/LatestCarNews'
import YouTubeVideoPlayer from '@/components/home/YouTubeVideoPlayer'
import PopularComparisons from '@/components/home/PopularComparisons'
import VideoAd from '@/components/ads/VideoAd'
import PageSection from '@/components/common/PageSection'
import Card from '@/components/common/Card'
import { staticPageSEO } from '@/lib/seo'
import OceanBackground from '@/components/home/OceanBackground'

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
    // Fetch all data in parallel (6 requests)
    const [popularRes, modelsRes, brandsRes, comparisonsRes, newsRes, upcomingCarsRes] = await Promise.all([
      fetch(`${backendUrl}/api/cars/popular`, { next: { revalidate: 3600 } }),
      fetch(`${backendUrl}/api/models-with-pricing?limit=100`, { next: { revalidate: 3600 } }),
      fetch(`${backendUrl}/api/brands`, { next: { revalidate: 3600 } }),
      fetch(`${backendUrl}/api/popular-comparisons`, { next: { revalidate: 3600 } }),
      fetch(`${backendUrl}/api/news?limit=6`, { next: { revalidate: 3600 } }),
      fetch(`${backendUrl}/api/upcoming-cars`, { next: { revalidate: 3600 } })
    ])

    const popularData = await popularRes.json()
    const modelsData = await modelsRes.json()
    const brandsData = await brandsRes.json()
    const comparisonsData = await comparisonsRes.json()
    const upcomingCarsData = await upcomingCarsRes.json()

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
        newRank: model.newRank ?? null
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

    return {
      popularCars,
      allCars,
      newLaunchedCars,
      brands,
      comparisons: processedComparisons,
      news: newsData.articles || [],
      upcomingCars
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
      upcomingCars: []
    }
  }
}

export default async function HomePage() {
  const { popularCars, allCars, newLaunchedCars, brands, comparisons, news, upcomingCars } = await getHomeData()

  return (
    <div className="min-h-screen bg-white relative">
      <OceanBackground />
      <main className="relative z-[2]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <Ad3DCarousel className="my-3 sm:my-4" />
        </div>
        <HeroSection />

        <PageSection background="gray">
          <CarsByBudget initialCars={allCars} />
        </PageSection>

        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <Ad3DCarousel className="my-3 sm:my-4" />
        </div>

        <PageSection background="white">
          <PopularCars initialCars={popularCars} />
        </PageSection>

        <PageSection background="gray">
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
      </main>

      <Footer />
    </div>
  )
}
