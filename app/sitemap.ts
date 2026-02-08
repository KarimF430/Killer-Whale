import { MetadataRoute } from 'next'
import { NEXT_PUBLIC_API_URL } from '@/lib/config'

// Configuration for sitemap generation
const BASE_URL = 'https://www.gadizone.com'
// Use the public API URL because sitemap generation via Next.js routes
// ensures we get the transformed data (slugs, etc.) that the frontend expects.
const EXTERNAL_API_URL = NEXT_PUBLIC_API_URL

// Helper to fetch data with error handling
async function fetchData(endpoint: string, cacheTime = 3600) {
    try {
        const res = await fetch(`${EXTERNAL_API_URL}${endpoint}`, { next: { revalidate: cacheTime } })
        if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`)
        return await res.json()
    } catch (error) {
        console.error(`Sitemap fetch error for ${endpoint}:`, error)
        return []
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // 1. Static Routes (High Priority: 1.0 - 0.9)
    // Core landing pages
    const coreRoutes: MetadataRoute.Sitemap = [
        { url: `${BASE_URL}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
        { url: `${BASE_URL}/new-cars`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${BASE_URL}/news`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
        { url: `${BASE_URL}/compare`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${BASE_URL}/electric-cars`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${BASE_URL}/upcoming-cars-in-india`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${BASE_URL}/new-car-launches-in-india`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${BASE_URL}/top-selling-cars-in-india`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    ]

    // Service & Tool Pages (Medium Priority: 0.8)
    const toolRoutes: MetadataRoute.Sitemap = [
        { url: `${BASE_URL}/emi-calculator`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
        { url: `${BASE_URL}/fuel-cost-calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${BASE_URL}/sell-car`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${BASE_URL}/location`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: 'always', priority: 0.8 },
        { url: `${BASE_URL}/ai-car-finder`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
        { url: `${BASE_URL}/ai-search`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    ]

    // Budget & Category Pages (Medium Priority: 0.8)
    // Generated from the list of files found
    const budgetPages = [
        'best-cars-under-8-lakh',
        'best-cars-under-10-lakh',
        'best-cars-under-15-lakh',
        'best-cars-under-20-lakh',
        'best-cars-under-25-lakh',
        'best-cars-under-30-lakh',
        'best-cars-under-40-lakh',
        'best-cars-under-50-lakh',
        'best-cars-under-60-lakh',
        'best-cars-under-80-lakh',
        'best-cars-under-1-crore-lakh',
        'best-cars-under-above-1-crore-lakh',
    ]
    const categoryRoutes: MetadataRoute.Sitemap = budgetPages.map(page => ({
        url: `${BASE_URL}/${page}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8
    }))

    // Legal & Info Pages (Low Priority: 0.5)
    const infoRoutes: MetadataRoute.Sitemap = [
        { url: `${BASE_URL}/about-us`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
        { url: `${BASE_URL}/contact-us`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
        { url: `${BASE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
        { url: `${BASE_URL}/terms-and-conditions`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
        { url: `${BASE_URL}/visitor-agreement`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
        { url: `${BASE_URL}/google-terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
        { url: `${BASE_URL}/feedback`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    ]


    // 2. Fetch Dynamic Data in Parallel
    const [brandsResponse, modelsResponse, newsResponse] = await Promise.all([
        fetchData('/api/brands'),
        fetchData('/api/models?limit=2000'), // Ensure we get all active models
        fetchData('/api/news?limit=100'),   // Get recent news
    ])

    // 3. Brand Pages (Priority: 0.9)
    // URL pattern: /tata-cars
    const brandsData = brandsResponse?.data || brandsResponse
    const brands = Array.isArray(brandsData) ? brandsData : []

    const brandRoutes: MetadataRoute.Sitemap = brands
        .filter((b: any) => b.name)
        .map((brand: any) => ({
            url: `${BASE_URL}/${brand.name.toLowerCase().replace(/\s+/g, '-')}-cars`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        }))

    // 4. Car Model Pages (Priority: 0.8) and Sub-pages (Priority 0.7)
    // URL pattern: /tata-cars/nexon
    const modelsData = modelsResponse?.data || modelsResponse
    const models = Array.isArray(modelsData) ? modelsData : []

    // Flatten model routes and their sub-routes
    const modelRoutes: MetadataRoute.Sitemap = []

    models.forEach((model: any) => {
        if (!model.brandName || !model.name) return

        const brandSlug = model.brandName.toLowerCase().replace(/\s+/g, '-')
        const modelSlug = model.name.toLowerCase().replace(/\s+/g, '-')
        const basePath = `${BASE_URL}/${brandSlug}-cars/${modelSlug}`
        const lastMod = model.updatedAt ? new Date(model.updatedAt) : new Date()

        // Main Model Page
        modelRoutes.push({
            url: basePath,
            lastModified: lastMod,
            changeFrequency: 'weekly',
            priority: 0.8,
        })

        // Sub-pages for each model
        // We use a representative city (New Delhi) for the canonical price page to avoid 
        // generating 500+ URLs per car for every city (which would bloat sitemap > 50k limit)
        const subPages = [
            { path: 'price-in-new-delhi', priority: 0.8 }, // Important for "On Road Price"
            { path: 'images', priority: 0.7 },
            { path: 'reviews', priority: 0.7 },
            { path: 'colors', priority: 0.7 },
            { path: 'mileage', priority: 0.7 },
            { path: 'variants', priority: 0.7 },
        ]

        subPages.forEach(sub => {
            modelRoutes.push({
                url: `${basePath}/${sub.path}`,
                lastModified: lastMod,
                changeFrequency: 'weekly',
                priority: sub.priority as any,
            })
        })
    })

    // 5. News Pages (Priority: 0.7)
    // URL pattern: /news/article-slug
    const articlesData = newsResponse?.articles || newsResponse?.data || newsResponse
    const articles = Array.isArray(articlesData) ? articlesData : []

    const newsRoutes: MetadataRoute.Sitemap = articles
        .filter((a: any) => a.slug)
        .map((article: any) => ({
            url: `${BASE_URL}/news/${article.slug}`,
            lastModified: new Date(article.publishedAt || new Date()),
            changeFrequency: 'never', // Old news doesn't change
            priority: 0.7,
        }))

    return [
        ...coreRoutes,
        ...toolRoutes,
        ...categoryRoutes,
        ...brandRoutes,
        ...modelRoutes,
        ...infoRoutes,
        ...newsRoutes,
    ]
}
