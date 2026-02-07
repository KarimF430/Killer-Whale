import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://www.gadizone.com'

    return {
        rules: [
            {
                userAgent: '*',
                allow: [
                    '/',
                    '/*-cars/',
                    '/*-cars/*/',
                    '/news/',
                    '/news/*',
                    '/top-selling-cars-in-india',
                    '/electric-cars',
                    '/upcoming-cars-in-india',
                    '/new-car-launches-in-india',
                    '/popular-cars-in-india',
                    '/about-us',
                    '/contact-us',
                    '/fuel-cost-calculator',
                    '/emi-calculator',
                    '/compare',
                ],
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

                    // Parameter URLs (CRITICAL - wastes crawl budget)
                    '/*?*',
                    '/emi-calculator?*',
                    '/insurance?*',
                    '/service?*',
                    '/sell-car?*',
                    '/compare?*',
                    '/search?*',
                    '/location?*',

                    // Rate/Review pages (low SEO value)
                    '/*/rate-review',
                    '/*/write-review',

                    // Technical files (Next.js chunks)
                    '/_next/static/',
                    '/_next/data/',
                    '/_next/image/',

                    // Utility pages with low SEO value
                    '/feedback',
                    '/privacy-policy',
                    '/terms-and-conditions',
                    '/visitor-agreement',
                    '/google-terms',

                    // Duplicate car routes (legacy)
                    '/cars/',
                ],
            },
            {
                userAgent: 'GPTBot',
                allow: '/',
                disallow: ['/api/', '/admin/', '/_next/'],
            },
            {
                userAgent: 'Google-Extended',
                allow: '/',
                disallow: ['/api/', '/admin/', '/_next/'],
            },
            {
                userAgent: 'CCBot',
                allow: '/',
                disallow: ['/api/', '/admin/', '/_next/'],
            },
            {
                userAgent: 'Googlebot',
                allow: [
                    '/',
                    '/*-cars/',
                    '/*-cars/*/',
                    '/news/',
                ],
                disallow: [
                    '/*?*',
                    '/_next/',
                    '/api/',
                    '/*/rate-review',
                    '/*/write-review',
                ],
            }
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
