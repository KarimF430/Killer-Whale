import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://www.gadizone.com'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
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
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
