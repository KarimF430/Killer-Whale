import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ComparePageClient from './ComparePageClient'

interface PageProps {
  params: Promise<{ slug: string }>
}

// Enable ISR with 1-hour revalidation
export const revalidate = 3600

// Pre-render popular comparison pages at build time for instant loading
export async function generateStaticParams() {
  const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

  try {
    // Fetch popular comparisons from backend
    const response = await fetch(`${backendUrl}/api/popular-comparisons`, {
      next: { revalidate: 86400 }
    })

    if (!response.ok) return []

    const comparisons = await response.json()

    // Generate slugs for top 20 popular comparisons
    return (Array.isArray(comparisons) ? comparisons : [])
      .slice(0, 20)
      .map((comp: any) => ({
        slug: comp.slug || `${comp.car1Slug}-vs-${comp.car2Slug}`
      }))
      .filter((p: any) => p.slug && p.slug !== 'undefined-vs-undefined')
  } catch (e) {
    console.log('generateStaticParams fallback for comparison pages')
    return []
  }
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'
    const response = await fetch(`${backendUrl}/api/compare/${slug}`, {
      next: { revalidate: 3600 }
    })

    if (!response.ok) {
      return {
        title: 'Compare Cars | MotorOctane',
        description: 'Compare car specifications, prices, and features side by side.'
      }
    }

    const data = await response.json()
    const modelNames = data.comparison.map((item: any) => `${item.model.brandName} ${item.model.name}`)
    const title = modelNames.join(' vs ')

    return {
      title: `${title} Comparison - Specs, Price & Features | MotorOctane`,
      description: `Compare ${title}. Detailed side-by-side comparison of specifications, prices, features, and expert reviews.`,
      keywords: `${title} comparison, ${modelNames.join(', ')}, car comparison`,
      openGraph: {
        title: `${title} Comparison`,
        description: `Compare ${title} specifications, prices, and features`,
        type: 'website'
      },
      alternates: {
        canonical: `/compare/${slug}`
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Compare Cars | MotorOctane',
      description: 'Compare car specifications, prices, and features side by side.'
    }
  }
}

// Server-side data fetching
async function getComparisonData(slug: string) {
  const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

  try {
    const response = await fetch(`${backendUrl}/api/compare/${slug}`, {
      next: { revalidate: 3600 }
    })

    if (!response.ok) {
      console.error('Failed to fetch comparison data')
      return null
    }

    const data = await response.json()

    console.log('📊 Compare API Response (SSR):', {
      comparisonCount: data.comparison.length,
      similarCarsCount: data.similarCars.length,
      took: data.performance?.took + 'ms'
    })

    // Process comparison items
    const comparisonItems = data.comparison.map((item: any) => ({
      model: {
        id: item.model.id,
        name: item.model.name,
        brandName: item.model.brandName,
        heroImage: item.model.heroImage,
        variants: item.variants
      },
      variant: item.lowestVariant
    }))

    // Generate SEO text
    const modelNames = comparisonItems.map((item: any) => `${item.model.brandName} ${item.model.name}`)
    const seoText = `Motoroctane brings you comparison of ${modelNames.join(', ')}...`

    return {
      comparisonItems,
      similarCars: data.similarCars || [],
      brands: data.brands || [],
      seoText
    }
  } catch (error) {
    console.error('Error fetching comparison data:', error)
    return null
  }
}

export default async function ComparePage({ params }: PageProps) {
  const { slug } = await params
  const comparisonData = await getComparisonData(slug)

  if (!comparisonData || comparisonData.comparisonItems.length === 0) {
    notFound()
  }

  return (
    <ComparePageClient
      initialSlug={slug}
      initialComparisonItems={comparisonData.comparisonItems}
      initialSimilarCars={comparisonData.similarCars}
      initialBrands={comparisonData.brands}
      initialSeoText={comparisonData.seoText}
    />
  )
}
