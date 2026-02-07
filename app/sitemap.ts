
import { MetadataRoute } from 'next'

// Configuration for sitemap generation
const BASE_URL = 'https://gadizone.com' // Replace with actual domain
const EXTERNAL_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

// Helper to fetch popular comparisons or generate them
async function getComparisonUrls(): Promise<string[]> {
    try {
        // 1. Fetch available models to generate combinations
        const res = await fetch(`${EXTERNAL_API_URL}/api/models?limit=20&sort=popularity`, { next: { revalidate: 3600 } })
        if (!res.ok) return []
        const models: any[] = await res.json()

        // 2. Generate "VS" URLs between popular models (limiting to avoid massive sitemap initially)
        const urls: string[] = []

        // Simple logic: Compare each popular model with next 3 popular models
        for (let i = 0; i < Math.min(models.length, 10); i++) {
            for (let j = i + 1; j < Math.min(i + 4, models.length); j++) {
                const car1 = models[i]
                const car2 = models[j]
                const slug = `${car1.brandName.toLowerCase()}-${car1.name.toLowerCase()}-vs-${car2.brandName.toLowerCase()}-${car2.name.toLowerCase()}`.replace(/\s+/g, '-')
                urls.push(`/compare/${slug}`)
            }
        }

        return urls
    } catch (error) {
        console.error('Sitemap generation error:', error)
        return []
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const comparisonUrls = await getComparisonUrls()

    const sitemapEntries = comparisonUrls.map((url) => ({
        url: `${BASE_URL}${url}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    return [
        {
            url: `${BASE_URL}/compare`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        ...sitemapEntries,
    ]
}
