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

// Enable ISR with 1-hour revalidation
export const revalidate = 3600

// Pre-render popular variant pages at build time for instant loading
export async function generateStaticParams() {
  const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'
  try {
    const [brandsRes, popularRes] = await Promise.all([
      fetch(`${backendUrl}/api/brands`, { next: { revalidate: 86400 } }),
      fetch(`${backendUrl}/api/cars/popular?limit=20`, { next: { revalidate: 86400 } })
    ])

    if (!brandsRes.ok || !popularRes.ok) return []

    const brands = await brandsRes.json()
    const popularModels = await popularRes.json()

    const brandMap = brands.reduce((acc: any, b: any) => ({
      ...acc,
      [b.id]: b.name.toLowerCase().replace(/\s+/g, '-')
    }), {})

    // Fetch variants for popular models
    const variantPromises = (Array.isArray(popularModels) ? popularModels : [])
      .slice(0, 10) // Top 10 popular models
      .map(async (model: any) => {
        try {
          const varRes = await fetch(`${backendUrl}/api/variants?modelId=${model.id}&limit=3`)
          if (!varRes.ok) return []
          const variants = await varRes.json()
          return variants.map((v: any) => ({
            'brand-cars': `${brandMap[model.brandId] || 'unknown'}-cars`,
            'model': model.name?.toLowerCase().replace(/\s+/g, '-') || 'unknown',
            'variant': v.name?.toLowerCase().replace(/\s+/g, '-') || 'unknown'
          }))
        } catch { return [] }
      })

    const results = await Promise.all(variantPromises)
    return results.flat().filter((p: any) =>
      p['brand-cars'] !== 'unknown-cars' && p.model !== 'unknown' && p.variant !== 'unknown'
    )
  } catch (e) {
    console.log('generateStaticParams fallback for variant pages')
    return []
  }
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

  // Redirect if this is actually a price page (starts with "price-in")
  if (variantSlug.startsWith('price-in')) {
    const { redirect } = await import('next/navigation')
    redirect(`/${resolvedParams['brand-cars']}/${modelSlug}/${variantSlug}`)
  }

  // Convert slugs to display names
  const brandName = brandSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  const modelName = modelSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  const variantName = variantSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

  // Fetch real data from backend
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

    // OPTIMIZED: Fetch brands first (required for other calls)
    const brandsRes = await fetch(`${backendUrl}/api/brands`, {
      next: { revalidate: 3600 }
    })
    const brands = await brandsRes.json()

    const normalizeBrandSlug = (name: string) =>
      name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    const brand = brands.find((b: any) =>
      normalizeBrandSlug(b.name) === brandSlug
    )

    if (!brand) {
      throw new Error('Brand not found')
    }

    // OPTIMIZED: Parallel fetch of models and prepare for variants
    const modelsRes = await fetch(`${backendUrl}/api/models?brandId=${brand.id}`, {
      next: { revalidate: 3600 }
    })
    const models = await modelsRes.json()
    const model = models.find((m: any) =>
      m.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === modelSlug
    )

    if (!model) {
      throw new Error('Model not found')
    }

    // OPTIMIZED: Parallel fetch of variants and similar cars
    const [variantsRes, similarModelsRes] = await Promise.all([
      fetch(`${backendUrl}/api/variants?modelId=${model.id}`, {
        next: { revalidate: 3600 }
      }),
      fetch(`${backendUrl}/api/models-with-pricing?bodyType=${model.bodyType || 'Hatchback'}&limit=6`, {
        next: { revalidate: 3600 }
      }).catch(() => ({ json: () => [] }))
    ])

    const variants = await variantsRes.json()

    // Find the specific variant
    const normalizeForMatch = (str: string) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const normalizedVariantSlug = normalizeForMatch(variantSlug)

    let variant = variants.find((v: any) =>
      normalizeForMatch(v.name) === normalizedVariantSlug
    )

    if (!variant && variants.length > 0) {
      // Try partial matching
      variant = variants.find((v: any) =>
        normalizeForMatch(v.name).includes(normalizedVariantSlug) ||
        normalizedVariantSlug.includes(normalizeForMatch(v.name))
      )
    }

    if (!variant) {
      variant = variants[0] // Fallback to first variant
    }

    // Calculate model's starting price from variants
    const variantPrices = variants.map((v: any) => v.price).filter((p: number) => p > 0)
    const modelStartingPrice = variantPrices.length > 0 ? Math.min(...variantPrices) : 0

    // Use parallel-fetched similar cars data
    let similarModelsData: any[] = []
    try {
      const jsonResult = 'json' in similarModelsRes ? await similarModelsRes.json() : []
      similarModelsData = jsonResult?.data || jsonResult || []
    } catch { similarModelsData = [] }

    // Process similar cars (same logic as model page)
    const brandMap = brands.reduce((acc: any, brand: any) => {
      acc[brand.id] = brand.name
      return acc
    }, {})

    const similarCars = similarModelsData
      .filter((m: any) => m.id !== model.id) // Exclude current model
      .map((m: any) => {
        const lowestPrice = m.lowestPrice || m.price || 0
        const fuelTypes = m.fuelTypes && m.fuelTypes.length > 0
          ? m.fuelTypes
          : ['Petrol']
        const transmissionTypes = m.transmissions && m.transmissions.length > 0
          ? m.transmissions
          : ['Manual']

        return {
          id: m.id,
          brandName: brandMap[m.brandId] || 'Unknown',
          name: m.name,
          image: m.heroImage || m.image,
          startingPrice: lowestPrice,
          fuelTypes,
          transmissionTypes,
          launchDate: m.launchDate,
          isNew: m.isNew || false
        }
      })

    // Add similar cars and starting price to model object
    const modelWithSimilarCars = {
      ...model,
      startingPrice: modelStartingPrice,
      similarCars
    }

    return (
      <>
        <VariantPage
          brandName={brandName}
          modelName={modelName}
          variantName={variantName}
          initialBrand={brand}
          initialModel={modelWithSimilarCars}
          initialVariant={variant}
          initialAllVariants={variants}
        />
        <FloatingAIBot type="variant" id={variant?.id || variantSlug} name={variant?.name || variantName} />
      </>
    )
  } catch (error) {
    console.error('Error fetching variant data:', error)

    // Return with empty data on error
    return (
      <>
        <VariantPage
          brandName={brandName}
          modelName={modelName}
          variantName={variantName}
        />
        <FloatingAIBot type="variant" id={variantSlug} name={variantName} />
      </>
    )
  }
}
