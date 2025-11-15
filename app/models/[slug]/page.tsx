import CarModelPage from '@/components/car-model/CarModelPage'
import { notFound } from 'next/navigation'

interface ModelPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getModelData(slug: string) {
  try {
    // Parse slug to get brand and model (e.g., "maruti-suzuki-grand-vitara" -> brand: "maruti-suzuki", model: "grand-vitara")
    // We need to handle multi-word brand names like "maruti-suzuki"
    
    // Get all brands first to match properly
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'
    const brandsResponse = await fetch(`${backendUrl}/api/brands`)
    if (!brandsResponse.ok) throw new Error('Failed to fetch brands')
    
    const brands = await brandsResponse.json()
    
    // Find the brand by matching slug patterns
    let brandData = null
    let model = null
    
    for (const brand of brands) {
      const brandSlug = brand.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      if (slug.startsWith(brandSlug + '-')) {
        brandData = brand
        model = slug.substring(brandSlug.length + 1) // Remove brand slug and hyphen
        break
      }
    }
    
    if (!brandData || !model) throw new Error('Brand or model not found in slug')
    
    // Get models for this brand
    const modelsResponse = await fetch(`${backendUrl}/api/frontend/brands/${brandData.id}/models`)
    if (!modelsResponse.ok) throw new Error('Failed to fetch models')
    
    const modelsData = await modelsResponse.json()
    const modelData = modelsData.models.find((m: any) => m.slug === model)
    if (!modelData) throw new Error('Model not found')
    
    // Get detailed model data directly from models API
    let detailedModelData = null
    try {
      // Fetch directly using model ID
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
    
    // Helper function to format image URLs
    const formatImageUrl = (url: string | undefined): string | undefined => {
      if (!url) return undefined
      if (url.startsWith('http://') || url.startsWith('https://')) return url
      if (url.startsWith('/uploads/')) return `${backendUrl}${url}`
      return url
    }

    // Build gallery array from backend data
    const galleryImages: string[] = []
    
    // Add hero image first
    const heroImageUrl = detailedModelData?.heroImage || modelData.image
    if (heroImageUrl) {
      const fullUrl = formatImageUrl(heroImageUrl)
      if (fullUrl) galleryImages.push(fullUrl)
    }
    
    // Add gallery images from backend
    if (detailedModelData?.galleryImages && Array.isArray(detailedModelData.galleryImages)) {
      detailedModelData.galleryImages.forEach((img: any) => {
        if (img?.url) {
          const fullUrl = formatImageUrl(img.url)
          if (fullUrl && !galleryImages.includes(fullUrl)) { // Avoid duplicates
            galleryImages.push(fullUrl)
          }
        }
      })
    }

    // Format highlight images
    const formatHighlightImages = (images: any[] | undefined) => {
      if (!images || !Array.isArray(images)) return []
      return images.map((img: any) => ({
        url: formatImageUrl(img.url),
        caption: img.caption || ''
      })).filter((img: any) => img.url)
    }

    // Format color images
    const formatColorImages = (images: any[] | undefined) => {
      if (!images || !Array.isArray(images)) return []
      return images.map((img: any) => ({
        url: formatImageUrl(img.url),
        caption: img.caption || ''
      })).filter((img: any) => img.url)
    }
    
    console.log('Gallery images from backend:', detailedModelData?.galleryImages)
    console.log('Final gallery array:', galleryImages)
    console.log('✅ Highlight images:', {
      keyFeatureImages: formatHighlightImages(detailedModelData?.keyFeatureImages),
      spaceComfortImages: formatHighlightImages(detailedModelData?.spaceComfortImages),
      storageConvenienceImages: formatHighlightImages(detailedModelData?.storageConvenienceImages),
      colorImages: formatColorImages(detailedModelData?.colorImages)
    })
    
    const enhancedModelData = {
      id: modelData.id,
      slug: modelData.slug,
      brand: modelData.brandName,
      name: modelData.name,
      heroImage: galleryImages[0] || (modelData.image.startsWith('/uploads/') ? `${backendUrl}${modelData.image}` : modelData.image),
      gallery: galleryImages,
      rating: modelData.rating,
      reviewCount: modelData.reviews,
      seoDescription: detailedModelData?.headerSeo || `${modelData.brandName} ${modelData.name} is a premium vehicle that offers excellent performance, modern features, and great value for money. Starting at ${modelData.price} Lakh.`,
      startingPrice: parseFloat(modelData.price.replace('₹', '')) * 100000,
      endingPrice: parseFloat(modelData.price.replace('₹', '')) * 100000 * 1.5,
      variants: [
        {
          id: '1',
          name: `${modelData.name} Base`,
          price: parseFloat(modelData.price.replace('₹', '')) * 100000,
          fuelType: modelData.fuelType,
          transmission: modelData.transmission,
          keyFeatures: ['Dual Airbags', 'ABS with EBD', 'Power Steering', 'Central Locking']
        },
        {
          id: '2',
          name: `${modelData.name} Mid`,
          price: parseFloat(modelData.price.replace('₹', '')) * 100000 * 1.2,
          fuelType: modelData.fuelType,
          transmission: modelData.transmission,
          keyFeatures: ['All Base features', 'Touchscreen Infotainment', 'Steering Controls', 'Rear Parking Sensors']
        },
        {
          id: '3',
          name: `${modelData.name} Top`,
          price: parseFloat(modelData.price.replace('₹', '')) * 100000 * 1.5,
          fuelType: modelData.fuelType,
          transmission: modelData.transmission,
          keyFeatures: ['All Mid features', 'Sunroof', 'Cruise Control', 'Auto Climate Control']
        }
      ],
      cities: [
        { name: 'Delhi', onRoadPrice: parseFloat(modelData.price.replace('₹', '')) * 100000 * 1.1 },
        { name: 'Mumbai', onRoadPrice: parseFloat(modelData.price.replace('₹', '')) * 100000 * 1.15 },
        { name: 'Bangalore', onRoadPrice: parseFloat(modelData.price.replace('₹', '')) * 100000 * 1.12 },
        { name: 'Chennai', onRoadPrice: parseFloat(modelData.price.replace('₹', '')) * 100000 * 1.13 }
      ],
      emi: {
        starting: Math.round(parseFloat(modelData.price.replace('₹', '')) * 1000),
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
      // Backend highlight images (with proper URL formatting)
      keyFeatureImages: formatHighlightImages(detailedModelData?.keyFeatureImages),
      spaceComfortImages: formatHighlightImages(detailedModelData?.spaceComfortImages),
      storageConvenienceImages: formatHighlightImages(detailedModelData?.storageConvenienceImages),
      // Backend color images (with proper URL formatting)
      colorImages: formatColorImages(detailedModelData?.colorImages),
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
    return null
  }
}

export default async function ModelPage({ params }: ModelPageProps) {
  const resolvedParams = await params
  const modelData = await getModelData(resolvedParams.slug)
  
  if (!modelData) {
    notFound()
  }
  
  return <CarModelPage model={modelData} />
}
