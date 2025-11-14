import { Metadata } from 'next'
import CarModelPage from '@/components/car-model/CarModelPage'
import { notFound } from 'next/navigation'
import { generateModelSEO } from '@/lib/seo'

interface ModelPageProps {
  params: Promise<{
    'brand-cars': string
    model: string
  }>
}

export async function generateMetadata({ params }: ModelPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const brandSlug = resolvedParams['brand-cars'].replace('-cars', '')
  const modelSlug = resolvedParams.model
  // Ignore Chrome DevTools /.well-known probes
  if (brandSlug.startsWith('.well-known') || brandSlug === 'well-known') {
    return {}
  }
  
  // Convert slugs to display names
  const brandName = brandSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  const modelName = modelSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  
  return generateModelSEO(brandName, modelName)
}

async function getModelData(brandSlug: string, modelSlug: string) {
  try {
    // Remove '-cars' suffix from brand slug to get actual brand name
    const brandName = brandSlug.replace('-cars', '')
    
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'
    // Guard against /.well-known devtools requests being treated as dynamic routes
    if (brandSlug.startsWith('.well-known') || brandSlug === 'well-known') {
      throw new Error('Ignore well-known probe')
    }
    
    // Get all brands first to match properly
    const brandsResponse = await fetch(`${backendUrl}/api/brands`, { cache: 'no-store' })
    if (!brandsResponse.ok) throw new Error('Failed to fetch brands')
    
    const brands = await brandsResponse.json()
    
    // Find the brand by matching slug
    const brandData = brands.find((brand: any) => {
      const slug = brand.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      return slug === brandName
    })
    
    if (!brandData) throw new Error('Brand not found')
    
    // Get models for this brand
    const modelsResponse = await fetch(`${backendUrl}/api/frontend/brands/${brandData.id}/models`, { cache: 'no-store' })
    if (!modelsResponse.ok) throw new Error('Failed to fetch models')
    
    const modelsData = await modelsResponse.json()
    const modelData = modelsData.models.find((m: any) => m.slug === modelSlug)
    if (!modelData) throw new Error('Model not found')
    
    // Get detailed model data directly from models API
    let detailedModelData = null
    try {
      const detailResponse = await fetch(`${backendUrl}/api/models/${modelData.id}`, { cache: 'no-store' })
      if (detailResponse.ok) {
        detailedModelData = await detailResponse.json()
        console.log('✅ Successfully fetched detailed model data:', detailedModelData)
      } else {
        console.log('❌ Failed to fetch model details:', detailResponse.status)
      }
    } catch (error) {
      console.log('❌ Error fetching detailed model data:', error)
    }
    
    console.log('Model ID:', modelData.id)
    console.log('Detailed model data:', detailedModelData)
    console.log('Header SEO:', detailedModelData?.headerSeo)
    
    // Build gallery array from backend data
    const galleryImages: string[] = []
    
    // Add hero image first
    const heroImageUrl = detailedModelData?.heroImage || modelData.image
    if (heroImageUrl) {
      galleryImages.push(heroImageUrl.startsWith('/uploads/') ? `${backendUrl}${heroImageUrl}` : heroImageUrl)
    }
    
    // Add gallery images from backend
    if (detailedModelData?.galleryImages && Array.isArray(detailedModelData.galleryImages)) {
      detailedModelData.galleryImages.forEach((img: any) => {
        if (img?.url) {
          const fullUrl = img.url.startsWith('/uploads/') ? `${backendUrl}${img.url}` : img.url
          if (!galleryImages.includes(fullUrl)) {
            galleryImages.push(fullUrl)
          }
        }
      })
    }
    
    console.log('Gallery images from backend:', detailedModelData?.galleryImages)
    console.log('Final gallery array:', galleryImages)
    
    // Fetch variants for this model to get dynamic pricing
    let variantsData = []
    let lowestPrice = 0
    let highestPrice = 0
    
    try {
      const variantsResponse = await fetch(`${backendUrl}/api/variants?modelId=${modelData.id}`, { cache: 'no-store' })
      if (variantsResponse.ok) {
        variantsData = await variantsResponse.json()
        
        // Calculate lowest and highest prices from actual variants
        if (variantsData.length > 0) {
          const prices = variantsData.map((v: any) => v.price).filter((p: number) => p > 0)
          if (prices.length > 0) {
            lowestPrice = Math.min(...prices)
            highestPrice = Math.max(...prices)
          }
        }
        
        console.log('✅ Fetched variants:', variantsData.length)
        console.log('💰 Price range:', lowestPrice, '-', highestPrice)
      }
    } catch (error) {
      console.log('❌ Error fetching variants:', error)
    }
    
    // Fallback to model price if no variants found
    if (lowestPrice === 0) {
      lowestPrice = parseFloat(modelData.price.replace('₹', '')) * 100000
      highestPrice = lowestPrice * 1.5
    }
    
    // Transform variants data
    const transformedVariants = variantsData.length > 0 
      ? variantsData.map((variant: any) => ({
          id: variant.id,
          name: variant.name,
          price: variant.price,
          fuelType: variant.fuelType || modelData.fuelType,
          transmission: variant.transmission || modelData.transmission,
          keyFeatures: [
            variant.engine ? `Engine: ${variant.engine}` : null,
            variant.power ? `Power: ${variant.power}` : null,
            variant.mileage ? `Mileage: ${variant.mileage}` : null,
            'Safety Features'
          ].filter(Boolean)
        }))
      : [
          {
            id: '1',
            name: `${modelData.name} Base`,
            price: lowestPrice,
            fuelType: modelData.fuelType,
            transmission: modelData.transmission,
            keyFeatures: ['Dual Airbags', 'ABS with EBD', 'Power Steering', 'Central Locking']
          },
          {
            id: '2',
            name: `${modelData.name} Mid`,
            price: lowestPrice * 1.2,
            fuelType: modelData.fuelType,
            transmission: modelData.transmission,
            keyFeatures: ['All Base features', 'Touchscreen Infotainment', 'Steering Controls', 'Rear Parking Sensors']
          },
          {
            id: '3',
            name: `${modelData.name} Top`,
            price: highestPrice,
            fuelType: modelData.fuelType,
            transmission: modelData.transmission,
            keyFeatures: ['All Mid features', 'Sunroof', 'Cruise Control', 'Auto Climate Control']
          }
        ]
    
    const enhancedModelData = {
      id: modelData.id,
      slug: modelData.slug,
      brand: modelData.brandName,
      name: modelData.name,
      heroImage: galleryImages[0] || (modelData.image.startsWith('/uploads/') ? `${backendUrl}${modelData.image}` : modelData.image),
      gallery: galleryImages,
      rating: modelData.rating,
      reviewCount: modelData.reviews,
      seoDescription: detailedModelData?.headerSeo || `${modelData.brandName} ${modelData.name} is a premium vehicle that offers excellent performance, modern features, and great value for money. Starting at ${(lowestPrice / 100000).toFixed(2)} Lakh.`,
      startingPrice: lowestPrice,
      endingPrice: highestPrice,
      bodyType: detailedModelData?.bodyType || modelData.bodyType,
      subBodyType: detailedModelData?.subBodyType || modelData.subBodyType,
      variants: transformedVariants,
      cities: [
        { name: 'Delhi', onRoadPrice: lowestPrice * 1.1 },
        { name: 'Mumbai', onRoadPrice: lowestPrice * 1.15 },
        { name: 'Bangalore', onRoadPrice: lowestPrice * 1.12 },
        { name: 'Chennai', onRoadPrice: lowestPrice * 1.13 }
      ],
      emi: {
        starting: Math.round((lowestPrice / 100000) * 1000),
        tenure: 60
      },
      keySpecs: {
        engine: '1199 cc',
        groundClearance: '165 mm',
        power: modelData.power,
        torque: '110 Nm',
        seatingCapacity: parseInt(modelData.seating.split(' ')[0]),
        safetyRating: '4 Star'
      },
      // Backend highlight images
      keyFeatureImages: detailedModelData?.keyFeatureImages || [],
      spaceComfortImages: detailedModelData?.spaceComfortImages || [],
      storageConvenienceImages: detailedModelData?.storageConvenienceImages || [],
      // Backend color images
      colorImages: detailedModelData?.colorImages || [],
      // Backend pros, cons, and summary data
      pros: detailedModelData?.pros || [],
      cons: detailedModelData?.cons || [],
      description: detailedModelData?.description,
      exteriorDesign: detailedModelData?.exteriorDesign,
      comfortConvenience: detailedModelData?.comfortConvenience,
      // Backend engine summaries
      engineSummaries: detailedModelData?.engineSummaries || [],
      // Backend mileage data
      mileageData: detailedModelData?.mileageData || [],
      // Backend FAQs
      faqs: detailedModelData?.faqs || [],
      // Fallback highlights for compatibility
      highlights: {
        keyFeatures: [
          { title: 'Spacious Interior', image: '/highlights/spacious-interior.jpg' },
          { title: 'Advanced Safety', image: '/highlights/safety.jpg' },
          { title: 'Fuel Efficient Engine', image: '/highlights/engine.jpg' }
        ],
        spaceComfort: [
          { title: 'Rear Seat Space', image: '/highlights/rear-seat.jpg' },
          { title: 'Boot Space', image: '/highlights/boot.jpg' }
        ],
        storageConvenience: [
          { title: 'Glove Box', image: '/highlights/glove-box.jpg' },
          { title: 'Door Pockets', image: '/highlights/door-pockets.jpg' }
        ]
      },
      colors: [
        { name: 'Platinum White Pearl', image: '/colors/white.jpg', code: '#FFFFFF' },
        { name: 'Metallic Midnight Blue', image: '/colors/blue.jpg', code: '#1E3A8A' },
        { name: 'Radiant Red Metallic', image: '/colors/red.jpg', code: '#DC2626' },
        { name: 'Modern Steel Metallic', image: '/colors/silver.jpg', code: '#6B7280' }
      ],
      summary: `The ${modelData.brandName} ${modelData.name} is a well-rounded vehicle that offers excellent value for money with its efficient engine, spacious interior, and reliable performance.`,
      engineHighlights: `The engine delivers smooth performance with excellent fuel efficiency of ${modelData.mileage}, making it perfect for both city and highway driving.`,
      mileage: [
        { condition: 'City', value: 18.6, unit: 'kmpl' },
        { condition: 'Highway', value: 24.2, unit: 'kmpl' },
        { condition: 'Combined', value: parseFloat(modelData.mileage.split(' ')[0]), unit: 'kmpl' }
      ]
    }
    
    return enhancedModelData
  } catch (error) {
    console.error('Error fetching model data:', error)
    
    // Return fallback data instead of null to prevent errors
    const fallbackBrand = brandSlug.replace('-cars', '').split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    const fallbackModel = modelSlug.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    
    return {
      id: 'fallback-id',
      slug: modelSlug,
      brand: fallbackBrand,
      name: fallbackModel,
      heroImage: 'https://images.unsplash.com/photo-1549399084-d56e05c50b8d?w=800&h=600&fit=crop',
      gallery: ['https://images.unsplash.com/photo-1549399084-d56e05c50b8d?w=800&h=600&fit=crop'],
      rating: 4.5,
      reviewCount: 1250,
      seoDescription: `${fallbackBrand} ${fallbackModel} - Premium vehicle with excellent features.`,
      startingPrice: 500000,
      endingPrice: 800000,
      variants: [],
      cities: [
        { name: 'Delhi', onRoadPrice: 550000 },
        { name: 'Mumbai', onRoadPrice: 575000 },
        { name: 'Bangalore', onRoadPrice: 560000 },
        { name: 'Chennai', onRoadPrice: 565000 }
      ],
      emi: { starting: 5000, tenure: 60 },
      keySpecs: {
        engine: '1199 cc',
        groundClearance: '165 mm',
        power: '85 PS',
        torque: '110 Nm',
        seatingCapacity: 5,
        safetyRating: '4 Star'
      },
      keyFeatureImages: [],
      spaceComfortImages: [],
      storageConvenienceImages: [],
      colorImages: [],
      pros: [],
      cons: [],
      description: `The ${fallbackBrand} ${fallbackModel} offers excellent value with modern features.`,
      exteriorDesign: undefined,
      comfortConvenience: undefined,
      engineSummaries: [],
      mileageData: [],
      faqs: [],
      highlights: {
        keyFeatures: [],
        spaceComfort: [],
        storageConvenience: []
      },
      colors: [],
      summary: `The ${fallbackBrand} ${fallbackModel} is a well-rounded vehicle.`,
      engineHighlights: 'Efficient engine with smooth performance.',
      mileage: [
        { condition: 'City', value: 18.6, unit: 'kmpl' },
        { condition: 'Highway', value: 24.2, unit: 'kmpl' },
        { condition: 'Combined', value: 21.0, unit: 'kmpl' }
      ]
    }
  }
}

export default async function ModelPage({ params }: ModelPageProps) {
  const resolvedParams = await params
  if (resolvedParams['brand-cars'].startsWith('.well-known') || resolvedParams['brand-cars'] === 'well-known') {
    // Return a minimal fragment instead of trying to resolve data
    return null as any
  }
  const modelData = await getModelData(resolvedParams['brand-cars'], resolvedParams.model)
  
  if (!modelData) {
    notFound()
  }
  
  return <CarModelPage model={modelData} />
}
