import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ComparePageClient from './ComparePageClient'
import { generateVerdict } from '@/lib/comparison-logic'

interface PageProps {
  params: Promise<{ slug: string }>
}

// Enable ISR with 1-hour revalidation
export const revalidate = 3600

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
        title: 'Compare Cars | gadizone',
        description: 'Compare car specifications, prices, and features side by side.'
      }
    }

    const data = await response.json()

    // Transform for logic helper
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

    const modelNames = comparisonItems.map((item: any) => `${item.model.brandName} ${item.model.name}`)
    const title = modelNames.join(' vs ')

    // Generate intelligent description
    let description = `Compare ${title}. Detailed side-by-side comparison.`
    if (comparisonItems.length === 2) {
      const verdict = generateVerdict(comparisonItems[0], comparisonItems[1])
      description = `Compare ${title}. Verdict: ${verdict}`
    }

    return {
      title: `${title} Comparison - Specs, Price & Features | gadizone`,
      description: description.substring(0, 160), // Truncate for SEO
      keywords: `${title} comparison, ${modelNames.join(', ')}, car comparison, ${modelNames[0]} vs ${modelNames[1]}`,
      openGraph: {
        title: `${title} Comparison`,
        description: description,
        type: 'website',
        images: comparisonItems[0]?.model.heroImage ? [comparisonItems[0].model.heroImage] : []
      },
      alternates: {
        canonical: `/compare/${slug}`
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Compare Cars | gadizone',
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

    // Generate dynamic verdict text
    let seoText = ''
    if (comparisonItems.length === 2) {
      seoText = generateVerdict(comparisonItems[0], comparisonItems[1])
    } else {
      const modelNames = comparisonItems.map((item: any) => `${item.model.brandName} ${item.model.name}`)
      seoText = `gadizone brings you comparison of ${modelNames.join(', ')}. Compare prices, specs, and features to find the best car for you.`
    }

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

  // Generate Schema.org JSON-LD
  const comparisonItems = comparisonData.comparisonItems
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': `Which is better: ${comparisonItems[0]?.model.brandName} ${comparisonItems[0]?.model.name} or ${comparisonItems[1]?.model.brandName} ${comparisonItems[1]?.model.name}?`,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': comparisonData.seoText
        }
      },
      {
        '@type': 'Question',
        'name': `What is the price difference between ${comparisonItems[0]?.model.name} and ${comparisonItems[1]?.model.name}?`,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `The ${comparisonItems[0]?.model.name} starts at ₹${comparisonItems[0]?.variant?.price || 'N/A'} while the ${comparisonItems[1]?.model.name} starts at ₹${comparisonItems[1]?.variant?.price || 'N/A'}.`
        }
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ComparePageClient
        initialSlug={slug}
        initialComparisonItems={comparisonData.comparisonItems}
        initialSimilarCars={comparisonData.similarCars}
        initialBrands={comparisonData.brands}
        initialSeoText={comparisonData.seoText}
      />
    </>
  )
}

