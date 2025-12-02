import { Metadata } from 'next'
import { Suspense } from 'react'
import SearchClient from './SearchClient'

// Static metadata for SEO
export const metadata: Metadata = {
  title: 'Search Cars - Find Your Perfect Car | MotorOctane',
  description: 'Search for cars by name, brand, or model. Find detailed specifications, prices, reviews, and comparisons for all car models in India.',
  keywords: 'car search, find cars, search cars India, car models, car brands',
  openGraph: {
    title: 'Search Cars | MotorOctane',
    description: 'Search and find your perfect car from thousands of models',
    type: 'website'
  }
}

// Popular searches - server-side data
const popularSearches = [
  'Honda Amaze',
  'Hyundai Creta',
  'Maruti Swift',
  'Tata Nexon',
  'Mahindra Scorpio'
]

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const initialQuery = params.q || ''

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    }>
      <SearchClient
        popularSearches={popularSearches}
        initialQuery={initialQuery}
      />
    </Suspense>
  )
}
