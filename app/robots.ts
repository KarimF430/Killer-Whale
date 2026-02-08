import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://www.gadizone.com'

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    // API and Admin routes
                    '/api/',
                    '/admin/',

                    // Auth routes
                    '/login',
                    '/signup',
                    '/forgot-password',
                    '/reset-password',
                    '/verify-email',

                    // Debug/Test routes
                    '/debug-env',
                    '/test-honda',
                    '/_next/',

                    // Parameter URLs (CRITICAL - conserve crawl budget)
                    '/*?*', // Block all query parameters generally
                    '/search',
                    '/location',
                    '/insurance',
                    '/service',
                    '/sell-car',

                    // Utility pages with low SEO value
                    '/feedback',
                    '/privacy-policy',
                    '/terms-and-conditions',
                    '/visitor-agreement',
                    '/google-terms',
                ],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: [
                    '/api/',
                    '/admin/',
                    '/_next/',
                    '/*?*',
                    '/search',
                    // Allowed /compare for SEO
                ],
            },
            // Explicitly ALLOW AI Bots for SEO Dominance (GEO)
            {
                userAgent: ['GPTBot', 'ChatGPT-User', 'Google-Extended', 'CCBot', 'ClaudeBot', 'PerplexityBot'],
                allow: ['/'],
                disallow: ['/api/', '/admin/'],
            }
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
