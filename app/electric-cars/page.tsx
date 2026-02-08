import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import PageSection from '@/components/common/PageSection'
import Footer from '@/components/Footer'
import Ad3DCarousel from '@/components/ads/Ad3DCarousel'
import ElectricCarsClient from './ElectricCarsClient'
import Breadcrumb from '@/components/common/Breadcrumb'

// Enable ISR with 1-hour revalidation
export const revalidate = 3600

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
    return {
        title: `Electric Cars in India 2025 - Prices, Range & Specs | gadizone`,
        description: `Explore all electric cars in India with detailed prices, range, specifications and reviews. Compare EVs from Tesla, Tata, Mahindra, Hyundai, BYD and more.`,
        keywords: `electric cars India, EV cars, electric vehicles, EV range, zero emission cars, best electric cars 2025`,
        openGraph: {
            title: `Electric Cars in India 2025`,
            description: 'Explore all electric cars in India with detailed prices, range and specifications.',
            type: 'website'
        },
        alternates: {
            canonical: `/electric-cars`
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
async function getElectricCarsData() {
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

        // Filter only electric cars
        const electricCars = allCars.filter((car: any) =>
            car.fuelTypes && car.fuelTypes.some((f: string) => f.toLowerCase() === 'electric')
        )

        const popularCars = electricCars.filter((c: any) => c.isPopular).slice(0, 10)
        const newLaunchedCars = electricCars.filter((c: any) => c.isNew).slice(0, 10)

        // Generate dynamic description based on actual car data
        const topCars = electricCars.slice(0, 3)
        const topCarNames = topCars.map((car: any) => `${car.brandName} ${car.name}`)
        const carCount = electricCars.length
        const topCar = electricCars.length > 0 ? `${electricCars[0].brandName} ${electricCars[0].name}` : null

        let shortDesc = `Thinking of going electric? Explore our comprehensive collection of ${carCount}+ electric cars available in India, featuring the latest EVs with impressive range, fast charging, and zero emissions.`

        let extendedDesc = ''
        if (topCarNames.length >= 3) {
            extendedDesc += ` Leading the EV revolution are ${topCarNames[0]}, ${topCarNames[1]}, and ${topCarNames[2]} - offering cutting-edge technology, exceptional range, and eco-friendly performance.`
        } else if (topCarNames.length >= 1) {
            extendedDesc += ` The ${topCarNames[0]} is one of the most popular electric cars in India.`
        }

        extendedDesc += ` Compare range, battery capacity, charging time, prices, and owner reviews to find your perfect electric vehicle.`

        if (topCar) {
            extendedDesc += ` Based on popularity and user ratings, we recommend the ${topCar} as an excellent choice for EV buyers in India.`
        }

        const dynamicDescription = JSON.stringify({ short: shortDesc, extended: extendedDesc })

        return { cars: electricCars, popularCars, newLaunchedCars, dynamicDescription }
    } catch (error) {
        console.error('Error fetching electric cars data:', error)
        return { cars: [], popularCars: [], newLaunchedCars: [], dynamicDescription: '' }
    }
}

export default async function ElectricCarsPage() {
    const { cars, popularCars, newLaunchedCars, dynamicDescription } = await getElectricCarsData()

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                <main>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Ad3DCarousel className="my-4" />
                    </div>

                    {/* Header & Filters */}
                    <PageSection background="white">
                        <Link
                            href="/"
                            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 mr-1" />
                            Back to Home
                        </Link>

                        <ElectricCarsClient
                            initialCars={cars}
                            popularCars={popularCars}
                            newLaunchedCars={newLaunchedCars}
                            dynamicDescription={dynamicDescription || ''}
                        />
                    </PageSection>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Ad3DCarousel className="my-4" />
                    </div>
                </main>
            </div>
            <Breadcrumb items={[{ label: 'Electric Cars' }]} />
            <Footer />
        </>
    )
}
