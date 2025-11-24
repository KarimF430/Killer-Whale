import { Metadata } from 'next'
import VariantPage from '@/components/variant/VariantPage'
import { generateVariantSEO } from '@/lib/seo'

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

  // Fetch real data from backend
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

    // Fetch brands to get brand ID
    const brandsRes = await fetch(`${backendUrl}/api/brands`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    })
    const brands = await brandsRes.json()
    const brand = brands.find((b: any) =>
      b.name.toLowerCase().replace(/\s+/g, '-') === brandSlug
    )

    if (!brand) {
      throw new Error('Brand not found')
    }

    // Fetch models for this brand
    const modelsRes = await fetch(`${backendUrl}/api/models?brandId=${brand.id}`, {
      next: { revalidate: 1800 } // Cache for 30 minutes
    })
    const models = await modelsRes.json()
    const model = models.find((m: any) =>
      m.name.toLowerCase().replace(/\s+/g, '-') === modelSlug
    )

    if (!model) {
      throw new Error('Model not found')
    }

    // Fetch variants for this model
    const variantsRes = await fetch(`${backendUrl}/api/variants?modelId=${model.id}`, {
      next: { revalidate: 1800 } // Cache for 30 minutes
    })
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

    // Fetch similar cars (same as model page)
    const similarModelsRes = await fetch(
      `${backendUrl}/api/models-with-pricing?bodyType=${model.bodyType || 'Hatchback'}`,
      { next: { revalidate: 3600 } }
    ).then(res => res.json()).catch(() => [])

    const similarModelsData = similarModelsRes?.data || similarModelsRes || []

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
        const transmissionTypes = m.transmissionTypes && m.transmissionTypes.length > 0
          ? m.transmissionTypes
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

    // Add similar cars to model object
    const modelWithSimilarCars = {
      ...model,
      similarCars
    }

    return <VariantPage
      brandName={brandName}
      modelName={modelName}
      variantName={variantName}
      initialBrand={brand}
      initialModel={modelWithSimilarCars}
      initialVariant={variant}
      initialAllVariants={variants}
    />
  } catch (error) {
    console.error('Error fetching variant data:', error)

    // Return with empty data on error
    return <VariantPage
      brandName={brandName}
      modelName={modelName}
      variantName={variantName}
    />
  }
}
