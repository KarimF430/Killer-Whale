import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://www.gadizone.com'

    return {
        rules: [
            {
                userAgent: '*',
                allow: ['/', '/api/quirky-bit'],
                disallow: [
                    '/api/',
                    '/admin/',
                    '/login',
                    '/signup',
                    '/forgot-password',
                    '/reset-password',
                    '/verify-email',
                    '/debug-env',
                    '/test-honda',
                ],
            },
            {
                userAgent: ['GPTBot', 'ChatGPT-User', 'Google-Extended', 'Claude-bot', 'PerplexityBot', 'AI-Agent', 'AI-Crawler'],
                allow: ['/', '/api/quirky-bit'],
            }
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
