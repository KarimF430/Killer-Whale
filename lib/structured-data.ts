
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.gadizone.com'

export function generateOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'gadizone',
        url: BASE_URL,
        logo: `${BASE_URL}/logo.png`,
        sameAs: [
            'https://facebook.com/gadizone',
            'https://twitter.com/gadizone',
            'https://instagram.com/gadizone',
            'https://youtube.com/gadizone'
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+91-9876543210',
            contactType: 'customer service',
            areaServed: 'IN',
            availableLanguage: 'en'
        }
    }
}

export function generateWebSiteSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'gadizone',
        url: BASE_URL,
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${BASE_URL}/search?q={search_term_string}`
            },
            'query-input': 'required name=search_term_string'
        }
    }
}

export function generateBreadcrumbSchema(items: { name: string; item: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.item.startsWith('http') ? item.item : `${BASE_URL}${item.item}`
        }))
    }
}

export function generateCarProductSchema(car: {
    name: string
    brand: string
    image: string
    description?: string
    lowPrice: number
    highPrice?: number
    currency?: string
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: car.name,
        image: car.image.startsWith('http') ? car.image : `${BASE_URL}${car.image}`,
        description: car.description,
        brand: {
            '@type': 'Brand',
            name: car.brand
        },
        offers: {
            '@type': 'AggregateOffer',
            priceCurrency: car.currency || 'INR',
            lowPrice: car.lowPrice,
            highPrice: car.highPrice || car.lowPrice,
            offerCount: 1,
            availability: 'https://schema.org/InStock'
        }
    }
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer
            }
        }))
    }
}
