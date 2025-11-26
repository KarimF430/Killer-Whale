import { Metadata } from 'next'
import VariantPage from '@/components/variant/VariantPage'
import { generateVariantSEO } from '@/lib/seo'
import { FloatingAIBot } from '@/components/FloatingAIBot'

interface PageProps {
  params: Promise<{
    'brand-cars': string
    model: string
    variant: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const brandSlug = resolvedParams['brand-cars'].replace('-cars', '')
  const modelSlug = resolvedParams.model
  const variantSlug = resolvedParams.variant

  // Convert slugs to display names
  const brandName = brandSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  const modelName = modelSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  const variantName = variantSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

  return generateVariantSEO(brandName, modelName, variantName)
}

export default async function VariantDetailPage({ params }: PageProps) {
  const resolvedParams = await params
  const brandSlug = resolvedParams['brand-cars'].replace('-cars', '')
  const modelSlug = resolvedParams.model
  const variantSlug = resolvedParams.variant

  // Convert slugs to display names
  const brandName = brandSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  const modelName = modelSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  const variantName = variantSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

  console.log('VariantDetailPage: Brand slug:', brandSlug)
  console.log('VariantDetailPage: Model slug:', modelSlug)
  console.log('VariantDetailPage: Variant slug:', variantSlug)
  console.log('VariantDetailPage: Parsed params:', { brandName, modelName, variantName })

  // Fetch new launches data for the New Launches section (copied from home page)
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'
  let newLaunchedCars: any[] = []

  try {
    // Fetch all data in parallel
    const [modelsRes, brandsRes] = await Promise.all([
      fetch(`${backendUrl}/api/models-with-pricing?limit=100`, { next: { revalidate: 3600 } }),
      fetch(`${backendUrl}/api/brands`, { next: { revalidate: 3600 } })
    ])

    const modelsData = await modelsRes.json()
    const brandsData = await brandsRes.json()

    const models = modelsData.data || modelsData
    const brands = brandsData

    // Create brand map
    const brandMap = brands.reduce((acc: any, brand: any) => {
      acc[brand.id] = brand.name
      return acc
    }, {})

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

    // Process All Cars (for Budget) with normalization
    const allCars: any[] = Array.isArray(models) ? models.map((model: any) => {
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
        newRank: model.newRank ?? null
      }
    }) : []

    // Process New Launched Cars
    newLaunchedCars = allCars
      .filter(car => car.isNew)
      .sort((a, b) => (a.newRank || 999) - (b.newRank || 999))
  } catch (error) {
    console.error('Error fetching new launches:', error)
  }

  // Fallback mock data for when backend is unavailable
  const mockVariantData = {
    brand: brandName,
    model: modelName,
    variant: variantName,
    fullName: `${brandName} ${modelName} ${variantName}`,
    price: 8.00,
    originalPrice: 9.50,
    savings: 1.50,
    fuelType: 'Petrol',
    transmission: 'Manual',
    seating: 5,
    mileage: 22.3,
    engine: '1.0L',
    power: '68 PS',
    torque: '91 Nm',
    rating: 4.5,
    reviewCount: 1250,
    launchYear: 2023,
    description: `The ${brandName} ${modelName} ${variantName} offers exceptional value with modern features and reliable performance.`,
    images: [
      'https://images.unsplash.com/photo-1549399084-d56e05c50b8d?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1494905998402-395d579af36f?w=800&h=600&fit=crop&crop=center'
    ],
    highlights: [
      'Best-in-class fuel efficiency',
      'Spacious cabin design',
      'Advanced safety features',
      'Modern infotainment system',
      'Comfortable seating for 5'
    ],
    cities: [
      { id: 1, name: 'Delhi', onRoadPrice: 880000 },
      { id: 2, name: 'Mumbai', onRoadPrice: 920000 },
      { id: 3, name: 'Bangalore', onRoadPrice: 896000 },
      { id: 4, name: 'Chennai', onRoadPrice: 904000 }
    ]
  }

  return (
    <>
      <VariantPage
        variantData={mockVariantData}
        brandName={brandName}
        modelName={modelName}
        variantName={variantName}
        newLaunchedCars={newLaunchedCars}
      />
      <FloatingAIBot type="variant" id={variantSlug} name={variantName} />
    </>
  )
}
