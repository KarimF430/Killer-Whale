import { MetadataRoute } from 'next'

export const revalidate = 3600 // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.gadizone.com'
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

    // Helper for URL slugs
    const toSlug = (str: string) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    // Types
    type Brand = { id: string; name: string; status: string }
    type Model = { id: string; name: string; brandId: string; status: string; updatedAt?: string }

    // Static routes
    const staticRoutes = [
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
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1.0 : 0.8,
    }))

    // Cities for price-in pages
    const cities = [
        'mumbai', 'delhi', 'bangalore', 'chennai', 'hyderabad', 'pune',
        'kolkata', 'ahmedabad', 'jaipur', 'lucknow', 'chandigarh',
        'kochi', 'indore', 'gulbarga'
    ]

    try {
        // Fetch Brands (Active Only - API defaults to active)
        const brandsRes = await fetch(`${backendUrl}/api/brands`, {
            next: { revalidate: 3600 }
        })
        const brands: Brand[] = await brandsRes.json()

        // Fetch Models (Active Only)
        const modelsRes = await fetch(`${backendUrl}/api/models?limit=1000`, {
            next: { revalidate: 3600 }
        })
        const modelsData = await modelsRes.json()
        const allModels: Model[] = Array.isArray(modelsData) ? modelsData : modelsData.data || []

        // Fetch Variants
        const variantsRes = await fetch(`${backendUrl}/api/variants`, {
            next: { revalidate: 3600 }
        })
        const allVariants: any[] = await variantsRes.json()

        // Maps for quick lookup
        const brandMap = new Map<string, Brand>(brands.map((b) => [b.id, b]))
        const modelMap = new Map<string, Model>(allModels.map((m) => [m.id, m]))

        // Brand Routes
        const brandRoutes = brands.map((brand) => ({
            url: `${baseUrl}/${toSlug(brand.name)}-cars`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        }))

        // Model Routes + City Routes
        const modelRoutes: MetadataRoute.Sitemap = []
        const cityRoutes: MetadataRoute.Sitemap = []

        for (const model of allModels) {
            if (model.status !== 'active') continue
            const brand = brandMap.get(model.brandId)
            if (!brand) continue

            const brandSlug = toSlug(brand.name)
            const modelSlug = toSlug(model.name)

            modelRoutes.push({
                url: `${baseUrl}/${brandSlug}-cars/${modelSlug}`,
                lastModified: new Date(model.updatedAt || new Date()),
                changeFrequency: 'weekly' as const,
                priority: 0.9,
            })

            for (const city of cities) {
                cityRoutes.push({
                    url: `${baseUrl}/${brandSlug}-cars/${modelSlug}/price-in/${city}`,
                    lastModified: new Date(),
                    changeFrequency: 'weekly' as const,
                    priority: 0.7,
                })
            }
        }

        // Variant Routes
        const variantRoutes: MetadataRoute.Sitemap = []

        for (const variant of allVariants) {
            if (variant.status !== 'active') continue
            const model = modelMap.get(variant.modelId)
            if (!model) continue
            const brand = brandMap.get(variant.brandId || model.brandId)
            if (!brand) continue

            variantRoutes.push({
                url: `${baseUrl}/${toSlug(brand.name)}-cars/${toSlug(model.name)}/variant/${toSlug(variant.name)}`,
                lastModified: new Date(variant.updatedAt || new Date()),
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            })
        }

        const allRoutes = [
            ...staticRoutes,
            ...brandRoutes,
            ...modelRoutes,
            ...variantRoutes,
            ...cityRoutes
        ]

        console.log(`[Sitemap] Generated ${allRoutes.length} URLs`)
        return allRoutes

    } catch (error) {
        console.error('[Sitemap] Error generating sitemap:', error)
        return staticRoutes
    }
}

