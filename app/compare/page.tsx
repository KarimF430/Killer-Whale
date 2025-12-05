import { Metadata } from 'next'
import CompareSelectionClient from './CompareSelectionClient'

// Enable ISR with 1-hour revalidation for the car list
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Compare Cars - Side by Side Comparison | MotorOctane',
  description: 'Compare cars side by side. Select two cars to compare specifications, prices, features, and more.',
  keywords: 'car comparison, compare cars, side by side comparison, car specs comparison',
}

// Server-side data fetching for faster initial load
async function getCarsAndBrands() {
  const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

  try {
    const [modelsRes, brandsRes] = await Promise.all([
      fetch(`${backendUrl}/api/models?limit=100`, { next: { revalidate: 3600 } }),
      fetch(`${backendUrl}/api/brands`, { next: { revalidate: 3600 } })
    ])

    if (!modelsRes.ok || !brandsRes.ok) {
      return { cars: [], brands: [] }
    }

    const modelsResponse = await modelsRes.json()
    const brands = await brandsRes.json()

    const models = modelsResponse.data || modelsResponse

    const brandMap: Record<string, string> = {}
    brands.forEach((brand: any) => {
      brandMap[brand.id] = brand.name
    })

    const cars = models.map((model: any) => ({
      id: model.id,
      name: model.name,
      brand: model.brandId,
      brandName: brandMap[model.brandId] || 'Unknown',
      heroImage: model.heroImage
        ? (model.heroImage.startsWith('http') ? model.heroImage : `${backendUrl}${model.heroImage}`)
        : ''
    }))

    return { cars, brands }
  } catch (error) {
    console.error('Error fetching cars:', error)
    return { cars: [], brands: [] }
  }
}

export default async function CompareCarsPage() {
  const { cars, brands } = await getCarsAndBrands()

  return <CompareSelectionClient initialCars={cars} initialBrands={brands} />
}
