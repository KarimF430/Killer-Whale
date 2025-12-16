import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import PageSection from '@/components/common/PageSection'
import Footer from '@/components/Footer'
import Ad3DCarousel from '@/components/ads/Ad3DCarousel'
import TopSellingCarsClient from './TopSellingCarsClient'

// Enable ISR with 1-hour revalidation
export const revalidate = 3600

// Generate metadata for SEO
// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
    const { dynamicDescription } = await getTopSellingCarsData()
    let description = `Explore the top selling cars in India with detailed prices, specifications, and expert reviews. Compare the most popular cars from Maruti, Hyundai, Tata, Mahindra, and more.`

    if (dynamicDescription) {
        try {
            const parsed = JSON.parse(dynamicDescription)
            if (parsed.short) {
                description = parsed.short
            }
        } catch (e) {
            // Fallback
        }
    }

    return {
        title: `Top Selling Cars in India 2025 - Prices, Specs & Reviews | gadizone`,
        description,
        keywords: `top selling cars India, best selling cars 2025, popular cars India, car prices, car reviews`,
        openGraph: {
            title: `Top Selling Cars in India 2025`,
            description,
            type: 'website'
        },
        alternates: {
            canonical: `/top-selling-cars-in-india`
        }
    }
}

// Helper function to format launch date
const formatLaunchDate = (date: string): string => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const parts = date.split('-')
    if (parts.length === 2) {
        const year = parts[0]
        const monthIndex = parseInt(parts[1]) - 1
        return `${months[monthIndex]} ${year}`
    }
    return date
}

// Server-side data fetching
async function getTopSellingCarsData() {
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

    try {
        const [modelsRes, brandsRes] = await Promise.all([
            fetch(`${backendUrl}/api/models-with-pricing?limit=300`, { next: { revalidate: 3600 } }),
            fetch(`${backendUrl}/api/brands`, { next: { revalidate: 3600 } })
        ])

        const modelsResponse = await modelsRes.json()
        const brands = await brandsRes.json()

        const models = modelsResponse.data || modelsResponse

        // Create brand map
        const brandMap = brands.reduce((acc: any, brand: any) => {
            acc[brand.id] = brand.name
            return acc
        }, {})

        // Process all cars
        const allCars = models.map((model: any) => {
            const lowestPrice = model.lowestPrice || model.price || 0
            const fuelTypes = model.fuelTypes && model.fuelTypes.length > 0 ? model.fuelTypes : ['Petrol']
            const transmissions = model.transmissionTypes && model.transmissionTypes.length > 0 ? model.transmissionTypes : ['Manual']
            const heroImage = model.heroImage
                ? (model.heroImage.startsWith('http') ? model.heroImage : `${backendUrl}${model.heroImage}`)
                : ''

            return {
                id: model.id,
                name: model.name,
                brand: model.brandId,
                brandName: brandMap[model.brandId] || 'Unknown',
                image: heroImage,
                startingPrice: lowestPrice,
                lowestPriceFuelType: model.lowestPriceFuelType || fuelTypes[0],
                fuelTypes,
                transmissions,
                bodyType: model.bodyType,
                seating: model.seating || 5,
                launchDate: model.launchDate ? `Launched ${formatLaunchDate(model.launchDate)}` : 'Launched',
                slug: `${(brandMap[model.brandId] || '').toLowerCase().replace(/\s+/g, '-')}-${model.name.toLowerCase().replace(/\s+/g, '-')}`,
                isNew: model.isNew || false,
                isPopular: model.isPopular || false,
                rating: 4.5,
                reviews: 1247,
                variants: model.variantCount || 0
            }
        })

        // Sort by popularity first, then by price
        const sortedCars = allCars.sort((a: any, b: any) => {
            if (a.isPopular && !b.isPopular) return -1
            if (!a.isPopular && b.isPopular) return 1
            return (b.startingPrice || 0) - (a.startingPrice || 0)
        })

        // For "All" category, show ALL cars (sorted by popularity)
        // For specific body types, show top 10
        const bodyTypes = ['SUV', 'Sedan', 'Hatchback', 'MPV', 'Coupe']
        const carsByBodyType: Record<string, any[]> = { 'All': sortedCars }

        bodyTypes.forEach(bodyType => {
            const bodyCars = allCars.filter((car: any) =>
                car.bodyType && car.bodyType.toLowerCase() === bodyType.toLowerCase()
            )
            const sorted = bodyCars.sort((a: any, b: any) => {
                if (a.isPopular && !b.isPopular) return -1
                if (!a.isPopular && b.isPopular) return 1
                return (b.startingPrice || 0) - (a.startingPrice || 0)
            })
            carsByBodyType[bodyType] = sorted.slice(0, 10)
        })

        const popularCars = sortedCars.filter((c: any) => c.isPopular).slice(0, 10)
        const newLaunchedCars = sortedCars.filter((c: any) => c.isNew).slice(0, 10)

        // Generate dynamic description
        const topCars = sortedCars.slice(0, 3)
        const topCarNames = topCars.map((car: any) => `${car.brandName} ${car.name}`)
        const carCount = sortedCars.length
        const topCar = sortedCars.length > 0 ? `${sortedCars[0].brandName} ${sortedCars[0].name}` : null

        let shortDesc = `Discover India's most popular cars! Browse our curated list of ${carCount}+ top-selling models featuring unbeatable value, trusted reliability, and impressive performance across all segments.`

        let extendedDesc = ''
        if (topCarNames.length >= 3) {
            extendedDesc += ` Leading the charts are ${topCarNames[0]}, ${topCarNames[1]}, and ${topCarNames[2]} - India's most loved cars known for their exceptional quality and customer satisfaction.`
        } else if (topCarNames.length >= 1) {
            extendedDesc += ` The ${topCarNames[0]} is one of the most sought-after cars in India.`
        }

        extendedDesc += ` Compare prices, specifications, mileage, features, and genuine owner reviews to find your ideal car.`

        if (topCar) {
            extendedDesc += ` Based on sales and user ratings, we recommend the ${topCar} as an excellent choice for car buyers in India.`
        }

        const dynamicDescription = JSON.stringify({ short: shortDesc, extended: extendedDesc })

        return { carsByBodyType, popularCars, newLaunchedCars, dynamicDescription }
    } catch (error) {
        console.error('Error fetching top selling cars data:', error)
        return { carsByBodyType: { 'All': [] }, popularCars: [], newLaunchedCars: [], dynamicDescription: '' }
    }
}

export default async function TopSellingCarsPage() {
    const { carsByBodyType, popularCars, newLaunchedCars, dynamicDescription } = await getTopSellingCarsData()

    return (
        <div className="min-h-screen bg-gray-50">
            <main>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Ad3DCarousel className="my-4" />
                </div>

                <PageSection background="white">
                    <Link
                        href="/"
                        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 mr-1" />
                        Back to Home
                    </Link>

                    <TopSellingCarsClient
                        carsByBodyType={carsByBodyType}
                        popularCars={popularCars}
                        newLaunchedCars={newLaunchedCars}
                        dynamicDescription={dynamicDescription || ''}
                    />
                </PageSection>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Ad3DCarousel className="my-4" />
                </div>
            </main>

            <Footer />
        </div>
    )
}
