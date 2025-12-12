import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CarFilters from '@/components/cars/CarFilters'
import CarGrid from '@/components/cars/CarGrid'
import SortOptions from '@/components/cars/SortOptions'

export const metadata: Metadata = {
  title: 'New Cars in India 2024 - Latest Prices, Specifications & Reviews | gadizone',
  description: 'Browse new cars in India with latest prices, specifications, and expert reviews. Filter by brand, price, fuel type, and more. Find your perfect car today.',
  keywords: 'new cars India, car prices 2024, car specifications, car reviews, buy new car',
}

export default function NewCarsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Page Header */}
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            <div className="text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                New Cars in India
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                Discover the latest cars with detailed specifications, prices, and expert reviews
              </p>
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium text-gray-900">487 cars</span> from 
                <span className="font-medium text-gray-900"> 25 brands</span>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <CarFilters />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 mt-6 lg:mt-0">
              <SortOptions />
              <CarGrid />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
