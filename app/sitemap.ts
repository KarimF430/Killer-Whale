import { MetadataRoute } from 'next'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gadizone.com'
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

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

    try {
        // Fetch brands
        const brandsRes = await fetch(`${backendUrl}/api/brands`, {
            next: { revalidate: 3600 }
        })
        const brands = await brandsRes.json()

        // Fetch models
        const modelsRes = await fetch(`${backendUrl}/api/models?limit=1000`, {
            next: { revalidate: 3600 }
        })
        const models = await modelsRes.json()
        const allModels = models.data || models

        // Helper for URL slugs
        const toSlug = (str: string) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

        // Brand routes
        const brandRoutes = brands.map((brand: any) => ({
            url: `${baseUrl}/${toSlug(brand.name)}-cars`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        }))

        // Model routes
        const modelRoutes = allModels.map((model: any) => {
            const brand = brands.find((b: any) => b.id === model.brandId)
            const brandSlug = brand ? toSlug(brand.name) : 'unknown'
            return {
                url: `${baseUrl}/${brandSlug}-cars/${toSlug(model.name)}`,
                lastModified: new Date(model.updatedAt || new Date()),
                changeFrequency: 'weekly' as const,
                priority: 0.9,
            }
        })

        // Variant routes (fetch all variants if possible, or top variants)
        // Note: Fetching all variants for all models might timeout. 
        // For now, let's limit to ensuring structure. In a real scenario, this might need pagination or sitemap-index.
        let variantRoutes: any[] = []

        // We will verify if we can fetch variants efficiently.
        // If not, we might need to skip variants in the main sitemap or fetch per model in batches.
        // Given the constraints, we'll try to fetch variants for the top popular models or recent ones.
        // Or we can use `Promise.all` for a subset.
        // For this implementation, let's stick to Brands + Models + Static.
        // Variants are numerous (500+). We CAN fetch them if the API supports bulk or we iterate.
        // Let's assume we can fetch all variants via a dedicated endpoint or just iterate models.

        // NOTE: Fetching 500 variants is fine. 500 requests is not.
        // Let's rely on models for now.

        const allRoutes = [...staticRoutes, ...brandRoutes, ...modelRoutes]

        return allRoutes
    } catch (error) {
        console.error('Error generating sitemap:', error)
        return staticRoutes
    }
}
