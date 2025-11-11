import AllVariantsClient from '@/components/car-model/AllVariantsClient'
import { notFound } from 'next/navigation'

interface VariantsPageProps {
  params: Promise<{
    'brand-cars': string
    model: string
  }>
}

async function getModelData(brandSlug: string, modelSlug: string) {
  try {
    const brandsResponse = await fetch('http://localhost:5001/api/brands', { cache: 'no-store' })
    if (!brandsResponse.ok) throw new Error('Failed to fetch brands')
    
    const brands = await brandsResponse.json()
    
    const brandData = brands.find((brand: any) => {
      const slug = brand.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      return slug === brandSlug
    })
    
    if (!brandData) throw new Error('Brand not found')
    
    const modelsResponse = await fetch(`http://localhost:5001/api/frontend/brands/${brandData.id}/models`, { cache: 'no-store' })
    if (!modelsResponse.ok) throw new Error('Failed to fetch models')
    
    const modelsData = await modelsResponse.json()
    const modelData = modelsData.models.find((m: any) => m.slug === modelSlug)
    if (!modelData) throw new Error('Model not found')
    
    return modelData
  } catch (error) {
    console.error('Error fetching model data:', error)
    return null
  }
}

export default async function VariantsPage({ params }: VariantsPageProps) {
  const resolvedParams = await params
  
  // Extract brand from "honda-cars" -> "honda"
  const brandSlug = resolvedParams['brand-cars'].replace('-cars', '')
  const modelSlug = resolvedParams.model
  
  const modelData = await getModelData(brandSlug, modelSlug)
  
  if (!modelData) {
    notFound()
  }
  
  return <AllVariantsClient model={modelData} />
}
