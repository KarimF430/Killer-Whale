
import { MetadataRoute } from 'next'

// Configuration for sitemap generation
const BASE_URL = 'https://www.gadizone.com'
const EXTERNAL_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

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
    // 1. Static Routes (Priority: 0.9 - 1.0)
    const staticRoutes: MetadataRoute.Sitemap = [
        { url: `${BASE_URL}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
        { url: `${BASE_URL}/new-cars`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${BASE_URL}/news`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
        { url: `${BASE_URL}/compare`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
        { url: `${BASE_URL}/emi-calculator`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
        { url: `${BASE_URL}/electric-cars`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
        { url: `${BASE_URL}/upcoming-cars-in-india`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
        { url: `${BASE_URL}/best-cars-under-10-lakh`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
        { url: `${BASE_URL}/best-cars-under-20-lakh`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    ]

    // 2. Fetch Dynamic Data in Parallel
    const [brandsData, modelsData, newsData] = await Promise.all([
        fetchData('/api/brands'),
        fetchData('/api/models?limit=1000'), // Ensure we get all active models
        fetchData('/api/news?limit=100'),   // Get recent news
    ])

    // 3. Brand Pages (Priority: 0.9)
    // URL pattern: /tata-cars
    const brands = Array.isArray(brandsData) ? brandsData : []
    const brandRoutes: MetadataRoute.Sitemap = brands
        .filter((b: any) => b.name)
        .map((brand: any) => ({
            url: `${BASE_URL}/${brand.name.toLowerCase().replace(/\s+/g, '-')}-cars`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        }))

    // 4. Car Model Pages (Priority: 0.8)
    // URL pattern: /tata-cars/nexon
    const models = Array.isArray(modelsData?.data || modelsData) ? (modelsData?.data || modelsData) : []
    const modelRoutes: MetadataRoute.Sitemap = models
        .filter((m: any) => m.brandName && m.name)
        .map((model: any) => ({
            url: `${BASE_URL}/${model.brandName.toLowerCase().replace(/\s+/g, '-')}-cars/${model.name.toLowerCase().replace(/\s+/g, '-')}`,
            lastModified: new Date(), // Ideally use model.updatedAt if available
            changeFrequency: 'weekly',
            priority: 0.8,
        }))

    // 5. News Pages (Priority: 0.7)
    // URL pattern: /news/article-slug
    const articles = Array.isArray(newsData?.articles || newsData) ? (newsData?.articles || newsData) : []
    const newsRoutes: MetadataRoute.Sitemap = articles
        .filter((a: any) => a.slug)
        .map((article: any) => ({
            url: `${BASE_URL}/news/${article.slug}`,
            lastModified: new Date(article.publishedAt || new Date()),
            changeFrequency: 'never', // Old news doesn't change
            priority: 0.7,
        }))

    return [
        ...staticRoutes,
        ...brandRoutes,
        ...modelRoutes,
        ...newsRoutes,
    ]
}
