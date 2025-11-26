import PriceBreakupPage from '@/components/price-breakup/PriceBreakupPage'

interface PriceInCityPageProps {
  params: Promise<{
    'brand-cars': string
    model: string
    city: string
  }>
}

import { FloatingAIBot } from '@/components/FloatingAIBot'

export default async function PriceInCityPage({ params }: PriceInCityPageProps) {
  // Await params as required by Next.js 15
  const resolvedParams = await params

  // Extract brand from "honda-cars" -> "honda"
  const brandSlug = resolvedParams['brand-cars'].replace('-cars', '')
  const modelSlug = resolvedParams.model
  const citySlug = resolvedParams.city

  return (
    <>
      <PriceBreakupPage
        brandSlug={brandSlug}
        modelSlug={modelSlug}
        citySlug={citySlug}
      />
      <FloatingAIBot type="price" id={modelSlug} name={modelSlug} />
    </>
  )
}
