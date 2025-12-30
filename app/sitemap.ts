import { MetadataRoute } from 'next'

export const revalidate = 3600 // Revalidate every hour

// Define sitemap separate files/indexes
export async function generateSitemaps() {
    return [
        { id: 'static' },
        { id: 'brands' },
        { id: 'models' },
        { id: 'variants' },
        { id: 'cities' },
    ]
}

export default async function sitemap({ id }: { id: string }): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gadizone.com'
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

    // Helper for URL slugs
    const toSlug = (str: string) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    // Types
    type Brand = { id: string; name: string; status: string }
    type Model = { id: string; name: string; brandId: string; status: string; updatedAt?: string }

    try {
        // --- STATIC ROUTES SITEMAP ---
        if (id === 'static') {
            const routes = [
                '',
                '/about-us',
                '/contact-us',
                '/privacy-policy',
                '/terms-and-conditions',
                '/visitor-agreement',
                '/feedback',
                '/emi-calculator',
                '/fuel-cost-calculator',
                '/price-breakup',
                '/compare',
                '/electric-cars',
                '/popular-cars-in-india',
                '/top-selling-cars-in-india',
                '/new-car-launches-in-india',
                '/upcoming-cars-in-india',
                '/new-cars',
                '/news',
                '/search',
                '/location',
                '/ai-chat',
                '/ai-search',
                '/best-cars-under-8-lakh',
                '/best-cars-under-10-lakh',
                '/best-cars-under-15-lakh',
                '/best-cars-under-20-lakh',
                '/best-cars-under-25-lakh',
                '/best-cars-under-30-lakh',
                '/best-cars-under-40-lakh',
                '/best-cars-under-50-lakh',
                '/best-cars-under-60-lakh',
                '/best-cars-under-80-lakh',
                '/best-cars-under-1-crore-lakh',
                '/best-cars-under-above-1-crore-lakh',
                '/top-cars/suv',
                '/top-cars/sedan',
                '/top-cars/hatchback',
                '/top-cars/muv',
                '/top-cars/luxury',
                '/top-cars/sports',
            ]
            return routes.map((route) => ({
                url: `${baseUrl}${route}`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: route === '' ? 1.0 : 0.8,
            }))
        }

        // --- BRANDS SITEMAP ---
        if (id === 'brands') {
            const brandsRes = await fetch(`${backendUrl}/api/brands`, { next: { revalidate: 3600 } })
            const brands: Brand[] = await brandsRes.json()

            return brands.map((brand) => ({
                url: `${baseUrl}/${toSlug(brand.name)}-cars`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 0.9,
            }))
        }

        // Data fetching for Models/Variants/Cities (Shared requirement)
        // We fetch these only when needed to optimize performance

        let brands: Brand[] = []
        let allModels: Model[] = []

        if (['models', 'variants', 'cities'].includes(id)) {
            // We need brands for slugs
            const brandsRes = await fetch(`${backendUrl}/api/brands`, { next: { revalidate: 3600 } })
            brands = await brandsRes.json()
        }

        if (['models', 'cities'].includes(id)) {
            const modelsRes = await fetch(`${backendUrl}/api/models?limit=1000`, { next: { revalidate: 3600 } })
            const modelsData = await modelsRes.json()
            allModels = Array.isArray(modelsData) ? modelsData : modelsData.data || []
        }

        const brandMap = new Map<string, Brand>(brands.map((b) => [b.id, b]))

        // --- MODELS SITEMAP ---
        if (id === 'models') {
            return allModels
                .filter(m => m.status === 'active' && brandMap.has(m.brandId))
                .map(model => {
                    const brand = brandMap.get(model.brandId)!
                    return {
                        url: `${baseUrl}/${toSlug(brand.name)}-cars/${toSlug(model.name)}`,
                        lastModified: new Date(model.updatedAt || new Date()),
                        changeFrequency: 'weekly',
                        priority: 0.9,
                    }
                })
        }

        // --- CITIES SITEMAP ---
        if (id === 'cities') {
            const cities = [
                'mumbai', 'delhi', 'bangalore', 'chennai', 'hyderabad', 'pune',
                'kolkata', 'ahmedabad', 'jaipur', 'lucknow', 'chandigarh',
                'kochi', 'indore', 'gulbarga'
            ]

            const routes: MetadataRoute.Sitemap = []

            for (const model of allModels) {
                if (model.status !== 'active' || !brandMap.has(model.brandId)) continue
                const brand = brandMap.get(model.brandId)!

                for (const city of cities) {
                    routes.push({
                        url: `${baseUrl}/${toSlug(brand.name)}-cars/${toSlug(model.name)}/price-in/${city}`,
                        lastModified: new Date(),
                        changeFrequency: 'weekly',
                        priority: 0.7,
                    })
                }
            }
            return routes
        }

        // --- VARIANTS SITEMAP ---
        if (id === 'variants') {
            // Fetch models for context
            const modelsRes = await fetch(`${backendUrl}/api/models?limit=1000`, { next: { revalidate: 3600 } })
            const modelsData = await modelsRes.json()
            const models: Model[] = Array.isArray(modelsData) ? modelsData : modelsData.data || []
            const modelMap = new Map<string, Model>(models.map(m => [m.id, m]))

            // Fetch variants
            const variantsRes = await fetch(`${backendUrl}/api/variants`, { next: { revalidate: 3600 } })
            const variants: any[] = await variantsRes.json()

            const routes: MetadataRoute.Sitemap = []

            for (const variant of variants) {
                if (variant.status !== 'active') continue
                const model = modelMap.get(variant.modelId)
                if (!model) continue
                const brand = brandMap.get(variant.brandId || model.brandId)
                if (!brand) continue

                routes.push({
                    url: `${baseUrl}/${toSlug(brand.name)}-cars/${toSlug(model.name)}/variant/${toSlug(variant.name)}`,
                    lastModified: new Date(variant.updatedAt || new Date()),
                    changeFrequency: 'weekly',
                    priority: 0.8,
                })
            }
            return routes
        }

        return []

    } catch (error) {
        console.error(`[Sitemap] Error generating sitemap for id ${id}:`, error)
        return []
    }
}
