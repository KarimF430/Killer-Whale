import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import PageSection from '@/components/common/PageSection'
import Footer from '@/components/Footer'
import Ad3DCarousel from '@/components/ads/Ad3DCarousel'
import BudgetCarsClient from '@/app/cars-by-budget/[budget]/BudgetCarsClient'
import Breadcrumb from '@/components/common/Breadcrumb'

const BUDGET_INFO = {
    label: 'Under ₹60 Lakh',
    min: 0,
    max: 6000000,
    lakhValue: '60 lakh',
    title: 'Best Cars Under 60 Lakh',
    apiSlug: 'under-60'
}

export const revalidate = 3600

function generateDynamicDescription(cars: any[], lakhValue: string, topCarName: string | null): string {
    const topCars = cars.slice(0, 3)
    const topCarNames = topCars.map(car => `${car.brandName} ${car.name}`)
    const carCount = cars.length

    let shortDesc = `Looking for the perfect car within your budget? Explore our curated selection of ${carCount}+ best cars under Rs. ${lakhValue} in India, featuring top-rated models with excellent mileage, safety features, and value for money.`
    let extendedDesc = ''

    if (topCarNames.length >= 3) {
        extendedDesc += ` Top picks in this price segment include ${topCarNames[0]}, ${topCarNames[1]}, and ${topCarNames[2]} - each offering a unique blend of style, performance, and affordability.`
    } else if (topCarNames.length >= 1) {
        extendedDesc += ` The ${topCarNames[0]} stands out as one of the most sought-after choices in this segment.`
    }

    extendedDesc += ` Compare specifications, on-road prices, mileage figures, interior features, and genuine owner reviews to make an informed decision.`

    if (topCarName) {
        extendedDesc += ` Based on popularity and user ratings, we recommend the ${topCarName} as an excellent choice for buyers in this budget.`
    }

    return JSON.stringify({ short: shortDesc, extended: extendedDesc })
}

export const metadata: Metadata = {
    title: `${BUDGET_INFO.title} in India - Prices, Specs & Reviews | gadizone`,
    description: `Find the best cars ${BUDGET_INFO.label.toLowerCase()} in India. Compare prices, specifications, features, and expert reviews.`,
    keywords: `cars ${BUDGET_INFO.label.toLowerCase()}, budget cars, best cars under ${BUDGET_INFO.lakhValue}, car prices India`,
    openGraph: {
        title: `${BUDGET_INFO.title} in India`,
        description: `Find the best cars ${BUDGET_INFO.label.toLowerCase()} in India.`,
        type: 'website'
    },
    alternates: {
        canonical: `/best-cars-under-60-lakh`
    }
}

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

async function getBudgetCarsData() {
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

    try {
        const [budgetRes, modelsRes, brandsRes] = await Promise.all([
            fetch(`${backendUrl}/api/cars-by-budget/${BUDGET_INFO.apiSlug}?page=1&limit=100`, { next: { revalidate: 3600 } }),
            fetch(`${backendUrl}/api/models-with-pricing?limit=20`, { next: { revalidate: 3600 } }),
            fetch(`${backendUrl}/api/brands`, { next: { revalidate: 3600 } })
        ])

        if (!budgetRes.ok) return { cars: [], popularCars: [], newLaunchedCars: [], dynamicDescription: '' }

        const budgetData = await budgetRes.json()
        const modelsResponse = await modelsRes.json()
        const brands = await brandsRes.json()

        const models = modelsResponse.data || modelsResponse

        const activeBrandIds = new Set<string>()
        const brandMap = brands.reduce((acc: any, brand: any) => {
            const isActive = brand.status === 'active' || !brand.status
            if (isActive) {
                activeBrandIds.add(brand.id)
                if (brand._id) activeBrandIds.add(brand._id)
            }

            acc[brand.id] = brand.name
            if (brand._id) acc[brand._id] = brand.name
            return acc
        }, {})

        const allCars = budgetData.data || []
        const cars = allCars.filter((car: any) => {
            // Only filter by active brand - backend already filters by budget
            return activeBrandIds.has(car.brandId || car.brand)
        })

        const processedCars = models
            .filter((model: any) => activeBrandIds.has(model.brandId))
            .map((model: any) => ({
                id: model.id,
                name: model.name,
                brand: model.brandId,
                brandName: brandMap[model.brandId] || 'Unknown',
                image: model.heroImage ? (model.heroImage.startsWith('http') ? model.heroImage : `${backendUrl}${model.heroImage}`) : '',
                startingPrice: model.lowestPrice || model.price || 0,
                lowestPriceFuelType: model.lowestPriceFuelType || (model.fuelTypes?.[0] || 'Petrol'),
                fuelTypes: model.fuelTypes?.length > 0 ? model.fuelTypes : ['Petrol'],
                transmissions: model.transmissionTypes?.length > 0 ? model.transmissionTypes : ['Manual'],
                seating: model.seating || 5,
                launchDate: model.launchDate ? `Launched ${formatLaunchDate(model.launchDate)}` : 'Launched',
                slug: `${(brandMap[model.brandId] || '').toLowerCase().replace(/\s+/g, '-')}-${model.name.toLowerCase().replace(/\s+/g, '-')}`,
                isNew: model.isNew || false,
                isPopular: model.isPopular || false,
                rating: 4.5,
                reviews: 1247,
                variants: model.variantCount || 0
            }))

        const popularCars = processedCars.filter((c: any) => c.isPopular).slice(0, 10)
        const newLaunchedCars = processedCars.filter((c: any) => c.isNew).slice(0, 10)
        const topCarName = cars.length > 0 ? `${cars[0].brandName} ${cars[0].name}` : null
        const dynamicDescription = generateDynamicDescription(cars, BUDGET_INFO.lakhValue, topCarName)

        return { cars, popularCars, newLaunchedCars, dynamicDescription }
    } catch (error) {
        console.error('Error fetching budget cars data:', error)
        return { cars: [], popularCars: [], newLaunchedCars: [], dynamicDescription: '' }
    }
}

export default async function BestCarsUnder60LakhPage() {
    const { cars, popularCars, newLaunchedCars, dynamicDescription } = await getBudgetCarsData()

    return (
        <div className="min-h-screen bg-gray-50">
            <main>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Ad3DCarousel className="my-4" />
                </div>
                <PageSection background="white">
                    <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors">
                        <ChevronLeft className="w-5 h-5 mr-1" />
                        Back to Home
                    </Link>
                    <BudgetCarsClient
                        initialCars={cars}
                        popularCars={popularCars}
                        newLaunchedCars={newLaunchedCars}
                        budgetLabel={BUDGET_INFO.title}
                        budgetDescription={dynamicDescription || ''}
                    />
                </PageSection>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Ad3DCarousel className="my-4" />
                </div>
            </main>
            <Breadcrumb items={[{ label: 'Best Cars Under 60 Lakh' }]} />
            <Footer />
        </div>
    )
}
