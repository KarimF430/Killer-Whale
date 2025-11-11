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

  return <VariantPage 
    variantData={mockVariantData}
    brandName={brandName}
    modelName={modelName}
    variantName={variantName}
  />
}
