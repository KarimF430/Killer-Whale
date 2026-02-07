import { Metadata } from 'next'

interface SEOConfig {
  title: string
  description: string
  keywords?: string
  ogImage?: string
  canonical?: string
}

export function generateSEO({
  title,
  description,
  keywords,
  ogImage = '/og-image.jpg',
  canonical
}: SEOConfig): Metadata {
  const siteName = 'gadizone'
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.gadizone.com'

  return {
    title: fullTitle,
    description,
    keywords: keywords || `${title}, car prices, car reviews, car specifications, gadizone`,
    authors: [{ name: 'gadizone' }],
    creator: 'gadizone',
    publisher: 'gadizone',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: canonical || baseUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical || baseUrl,
      siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
      creator: '@gadizone',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      // Google verification is set in layout.tsx
    },
  }
}

// Brand-specific SEO
export function generateBrandSEO(brandName: string): Metadata {
  return generateSEO({
    title: `${brandName} Cars Price, Models & Reviews in India`,
    description: `Explore ${brandName} cars in India. Get latest prices, detailed specifications, expert reviews, and compare all ${brandName} models. Find the best ${brandName} car for you.`,
    keywords: `${brandName} cars, ${brandName} price, ${brandName} models, ${brandName} reviews, ${brandName} specifications, ${brandName} India`,
    canonical: `/${brandName.toLowerCase().replace(/\s+/g, '-')}-cars`,
  })
}

// Model-specific SEO
export function generateModelSEO(brandName: string, modelName: string): Metadata {
  return generateSEO({
    title: `${brandName} ${modelName} Price, Specs, Features & Reviews`,
    description: `Get complete details about ${brandName} ${modelName} including ex-showroom price, on-road price, specifications, features, variants, mileage, and expert reviews. Compare variants and check latest offers.`,
    keywords: `${brandName} ${modelName}, ${brandName} ${modelName} price, ${brandName} ${modelName} specs, ${brandName} ${modelName} features, ${brandName} ${modelName} review, ${brandName} ${modelName} mileage, ${brandName} ${modelName} variants`,
    canonical: `/${brandName.toLowerCase().replace(/\s+/g, '-')}-cars/${modelName.toLowerCase().replace(/\s+/g, '-')}`,
  })
}

// Variant-specific SEO
export function generateVariantSEO(brandName: string, modelName: string, variantName: string): Metadata {
  return generateSEO({
    title: `${brandName} ${modelName} ${variantName} - Price, Specs & Features`,
    description: `Get detailed information about ${brandName} ${modelName} ${variantName} variant including price, specifications, features, and expert reviews. Check on-road price in your city.`,
    keywords: `${brandName} ${modelName} ${variantName}, ${brandName} ${modelName} ${variantName} price, ${brandName} ${modelName} ${variantName} specs, ${brandName} ${modelName} ${variantName} features`,
    canonical: `/${brandName.toLowerCase().replace(/\s+/g, '-')}-cars/${modelName.toLowerCase().replace(/\s+/g, '-')}/${variantName.toLowerCase().replace(/\s+/g, '-')}`,
  })
}

// Static page SEO
export const staticPageSEO = {
  home: generateSEO({
    title: 'New Cars in India - Latest Prices, Reviews & Comparisons',
    description: 'Find new cars in India with AI-powered search. Compare prices, specs, reviews and get best deals from authorized dealers.',
    keywords: `new cars India, car prices ${new Date().getFullYear()}, car specifications, car reviews, car comparison, EMI calculator, car deals, Maruti Suzuki, Hyundai, Tata, Mahindra`,
    canonical: '/',
  }),

  emiCalculator: generateSEO({
    title: 'Car EMI Calculator - Calculate Monthly Car Loan EMI',
    description: 'Calculate your car loan EMI with our advanced EMI calculator. Get instant results with detailed amortization schedule, interest breakdown, and compare different loan options.',
    keywords: 'car EMI calculator, car loan calculator, EMI calculation, car finance, auto loan calculator, monthly EMI',
    canonical: '/emi-calculator',
  }),

  priceBreakup: generateSEO({
    title: 'Car Price Breakup - On-Road Price Calculator',
    description: 'Calculate on-road price of any car with detailed price breakup including ex-showroom price, RTO charges, road tax, insurance, and accessories. Get accurate pricing for your city.',
    keywords: 'car price breakup, on-road price calculator, car price calculator, RTO charges, road tax calculator, car insurance',
    canonical: '/price-breakup',
  }),

  compare: generateSEO({
    title: 'Compare Cars - Side by Side Car Comparison',
    description: 'Compare cars side by side with detailed specifications, features, prices, and expert reviews. Make an informed decision with our comprehensive car comparison tool.',
    keywords: 'compare cars, car comparison, side by side comparison, car specs comparison, car features comparison',
    canonical: '/compare',
  }),

  news: generateSEO({
    title: 'Car News - Latest Automotive News & Updates',
    description: 'Stay updated with latest car news, launches, reviews, and automotive industry updates. Get expert insights and analysis on new cars, technology, and trends.',
    keywords: 'car news, automotive news, car launches, car reviews, auto industry news, latest cars',
    canonical: '/news',
  }),

  offers: generateSEO({
    title: 'Car Offers & Deals - Best Car Discounts in India',
    description: 'Discover the best car offers, discounts, and deals in India. Get exclusive offers on new cars, exchange bonuses, and festive discounts from authorized dealers.',
    keywords: 'car offers, car discounts, car deals, car exchange offers, festive car offers, car promotions',
    canonical: '/offers',
  }),

  location: generateSEO({
    title: 'Select Your City - Car Prices by City',
    description: 'Select your city to get accurate on-road car prices, dealer information, and local offers. We cover all major cities across India.',
    keywords: 'car prices by city, on-road price, city-wise car prices, car dealers by city',
    canonical: '/location',
  }),

  search: generateSEO({
    title: 'Search Cars - Find Your Perfect Car',
    description: 'Search and find your perfect car from thousands of models. Filter by price, brand, fuel type, body type, and more. Get detailed information and compare cars.',
    keywords: 'search cars, find cars, car search, car finder, search by price, search by brand',
    canonical: '/search',
  }),
}
