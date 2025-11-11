import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import OffersListing from '@/components/offers/OffersListing'

export const metadata: Metadata = {
  title: 'Car Offers & Promotions - Best Deals on New Cars | MotorOctane',
  description: 'Find the best car offers, discounts, and promotions on new cars. Filter by city, brand, and model to get the latest deals and save money on your car purchase.',
  keywords: 'car offers, car discounts, car promotions, new car deals, car finance offers, festive offers, exchange offers',
  openGraph: {
    title: 'Car Offers & Promotions - Best Deals on New Cars',
    description: 'Find the best car offers, discounts, and promotions on new cars. Filter by city, brand, and model to get the latest deals.',
    type: 'website',
    url: '/offers',
  },
}

export default function OffersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Best Car Offers & Promotions
              </h1>
              <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
                Discover exclusive deals, discounts, and promotional offers on new cars. 
                Save thousands on your dream car with our curated offers.
              </p>
            </div>
          </div>
        </div>

        {/* Offers Listing */}
        <OffersListing />
      </main>

      <Footer />
    </div>
  )
}
