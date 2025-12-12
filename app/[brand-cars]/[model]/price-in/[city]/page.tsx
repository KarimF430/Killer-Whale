import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import PriceBreakupPage from '@/components/price-breakup/PriceBreakupPage'
import { FloatingAIBot } from '@/components/FloatingAIBot'

// Enable ISR with 1-hour revalidation
export const revalidate = 3600

interface PriceInCityPageProps {
  params: Promise<{
    'brand-cars': string
    model: string
    city: string
  }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Helper to convert slug to display name
const toDisplayName = (slug: string) =>
  slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

// City mapping for display
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
  'jaipur': 'Jaipur, Rajasthan',
  'gulbarga': 'Gulbarga, Karnataka',
  'lucknow': 'Lucknow, Uttar Pradesh',
  'chandigarh': 'Chandigarh, Punjab',
  'kochi': 'Kochi, Kerala',
  'indore': 'Indore, Madhya Pradesh'
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: PriceInCityPageProps): Promise<Metadata> {
  const resolvedParams = await params

  const brandSlug = resolvedParams['brand-cars'].replace('-cars', '')
  const modelSlug = resolvedParams.model
  const citySlug = resolvedParams.city

  const brandName = toDisplayName(brandSlug)
  const modelName = toDisplayName(modelSlug)
  const cityName = cityMap[citySlug.toLowerCase()]?.split(',')[0] || toDisplayName(citySlug)

  const title = `${brandName} ${modelName} Price in ${cityName} - On-Road Price, EMI, Variants | gadizone`
  const description = `Get ${brandName} ${modelName} on-road price in ${cityName}. Check detailed price breakup including ex-showroom price, RTO, insurance, and calculate EMI. Compare variants and get the best deals.`

  return {
    title,
    description,
    keywords: `${brandName} ${modelName} price ${cityName}, ${modelName} on-road price, ${modelName} EMI, ${modelName} variants, ${modelName} price breakup`,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `/${resolvedParams['brand-cars']}/${modelSlug}/price-in/${citySlug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `/${resolvedParams['brand-cars']}/${modelSlug}/price-in/${citySlug}`,
    },
  }
}

// Server-side data fetching
async function getPriceBreakupData(brandSlug: string, modelSlug: string, citySlug: string) {
  const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

  try {
    // Parallel fetch for better performance
    const [brandsRes, modelsRes] = await Promise.all([
      fetch(`${backendUrl}/api/brands`, { next: { revalidate: 3600 } }),
      fetch(`${backendUrl}/api/models`, { next: { revalidate: 3600 } }),
    ])

    if (!brandsRes.ok || !modelsRes.ok) {
      console.error('Failed to fetch initial data')
      return null
    }

    const brands = await brandsRes.json()
    const models = await modelsRes.json()

    // Find the brand
    const normalizedBrandSlug = brandSlug.toLowerCase().replace(/-/g, ' ')
    const brand = brands.find((b: any) =>
      b.name.toLowerCase() === normalizedBrandSlug ||
      b.name.toLowerCase().replace(/\s+/g, '-') === brandSlug.toLowerCase()
    )

    if (!brand) return null

    // Find the model
    const normalizedModelSlug = modelSlug.toLowerCase().replace(/-/g, ' ')
    const model = models.find((m: any) =>
      m.brandId === brand.id && (
        m.name.toLowerCase() === normalizedModelSlug ||
        m.name.toLowerCase().replace(/\s+/g, '-') === modelSlug.toLowerCase()
      )
    )

    if (!model) return null

    // Fetch variants for this model
    const variantsRes = await fetch(`${backendUrl}/api/variants?modelId=${model.id}&full=true`, {
      next: { revalidate: 3600 }
    })

    let variants: any[] = []
    if (variantsRes.ok) {
      variants = await variantsRes.json()
    }

    // Get hero image with proper URL
    const heroImage = model.heroImage
      ? (model.heroImage.startsWith('http')
        ? model.heroImage
        : `${backendUrl}${model.heroImage}`)
      : ''

    return {
      brand: {
        id: brand.id,
        name: brand.name,
        logo: brand.logo ? `${backendUrl}${brand.logo}` : '',
      },
      model: {
        id: model.id,
        name: model.name,
        brandId: brand.id,
        heroImage,
        bodyType: model.bodyType,
        seating: model.seating,
        fuelTypes: model.fuelTypes || ['Petrol'],
        transmissions: model.transmissions || ['Manual'],
      },
      variants: variants.map((v: any) => ({
        id: v.id,
        name: v.name,
        price: v.price,
        fuel: v.fuel || v.fuelType,
        transmission: v.transmission,
        mileage: v.mileage,
        power: v.maxPower || v.power || '',
        keyFeatures: v.keyFeatures || [],
        features: Array.isArray(v.keyFeatures) ? v.keyFeatures.join(', ') : (v.keyFeatures || ''),
      })),
    }
  } catch (error) {
    console.error('Error fetching price breakup data:', error)
    return null
  }
}

export default async function PriceInCityPage({ params, searchParams }: PriceInCityPageProps) {
  // Await params and searchParams as required by Next.js 15
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams

  // Extract brand from "honda-cars" -> "honda"
  const brandSlug = resolvedParams['brand-cars'].replace('-cars', '')
  const modelSlug = resolvedParams.model
  const citySlug = resolvedParams.city

  // Extract variant from search params if provided
  const variantSlug = resolvedSearchParams.variant as string | undefined

  // Fetch initial data server-side for SSR
  const initialData = await getPriceBreakupData(brandSlug, modelSlug, citySlug)

  return (
    <>
      <PriceBreakupPage
        brandSlug={brandSlug}
        modelSlug={modelSlug}
        citySlug={citySlug}
        // Pass initial data for SSR
        initialBrand={initialData?.brand}
        initialModel={initialData?.model}
        initialVariants={initialData?.variants}
      />
      <FloatingAIBot type="price" id={modelSlug} name={modelSlug} />
    </>
  )
}
