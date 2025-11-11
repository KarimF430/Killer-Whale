import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ChevronRight, Calendar, MapPin, Tag, Gift, Percent, Car, IndianRupee, Clock, CheckCircle, AlertCircle, Phone, Mail } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

interface OfferDetailPageProps {
  params: Promise<{
    id: string
  }>
}

// Mock offer data - in real app, this would be fetched from database
const getOfferById = (id: string) => {
  const offers = [
    {
      id: '1',
      title: 'Festive Season Mega Discount',
      description: 'Get up to ₹50,000 cash discount + exchange bonus on Swift',
      brand: 'Maruti Suzuki',
      model: 'Swift',
      offerType: 'festive-offer',
      discountAmount: 50000,
      validUntil: '2024-01-31',
      cities: ['Delhi', 'Mumbai', 'Bangalore', 'Chennai'],
      terms: [
        'Valid on select variants only',
        'Exchange bonus applicable on cars above 3 years',
        'Cannot be combined with other offers',
        'Offer valid till stocks last',
        'Final discount amount may vary based on variant selected'
      ],
      eligibility: [
        'Valid for individual customers only',
        'Age should be between 21-65 years',
        'Valid driving license required',
        'Income proof mandatory for finance offers'
      ],
      howToAvail: [
        'Visit nearest authorized dealership',
        'Carry valid ID proof and address proof',
        'Book a test drive to experience the car',
        'Complete documentation for final booking'
      ],
      contactInfo: {
        phone: '1800-102-1800',
        email: 'offers@marutisuzuki.com',
        website: 'www.marutisuzuki.com'
      },
      image: '/cars/swift-offer.jpg',
      isActive: true,
      isFeatured: true
    }
  ]
  
  return offers.find(offer => offer.id === id)
}

export async function generateMetadata({ params }: OfferDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const offer = getOfferById(id)
  
  if (!offer) {
    return {
      title: 'Offer Not Found | MotorOctane'
    }
  }

  return {
    title: `${offer.title} - ${offer.brand} ${offer.model} | MotorOctane`,
    description: `${offer.description} Valid until ${new Date(offer.validUntil).toLocaleDateString()}. Available in ${offer.cities.join(', ')}.`,
    keywords: `${offer.brand}, ${offer.model}, car offer, discount, ${offer.offerType}`,
    openGraph: {
      title: `${offer.title} - ${offer.brand} ${offer.model}`,
      description: offer.description,
      type: 'website',
      url: `/offers/${id}`,
    },
  }
}

export default async function OfferDetailPage({ params }: OfferDetailPageProps) {
  const { id } = await params
  const offer = getOfferById(id)

  if (!offer) {
    notFound()
  }

  const getOfferTypeIcon = (type: string) => {
    switch (type) {
      case 'cash-discount': return <IndianRupee className="h-5 w-5" />
      case 'exchange-bonus': return <Car className="h-5 w-5" />
      case 'finance-offer': return <Percent className="h-5 w-5" />
      case 'festive-offer': return <Gift className="h-5 w-5" />
      case 'corporate-discount': return <Tag className="h-5 w-5" />
      default: return <Gift className="h-5 w-5" />
    }
  }

  const getOfferTypeLabel = (type: string) => {
    const types = {
      'cash-discount': 'Cash Discount',
      'exchange-bonus': 'Exchange Bonus',
      'finance-offer': 'Finance Offer',
      'festive-offer': 'Festive Offer',
      'corporate-discount': 'Corporate Discount'
    }
    return types[type as keyof typeof types] || 'Special Offer'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <Link href="/offers" className="text-gray-500 hover:text-gray-700">Offers</Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900 font-medium">{offer.title}</span>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Offer Header */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="relative">
                <div className="h-64 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Car className="h-20 w-20 mx-auto mb-4 opacity-80" />
                    <h2 className="text-2xl font-bold">{offer.brand} {offer.model}</h2>
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {offer.isFeatured ? 'Featured' : 'Active'}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-white/90 text-gray-800 px-3 py-1 rounded-lg text-sm font-medium flex items-center">
                    {getOfferTypeIcon(offer.offerType)}
                    <span className="ml-2">{getOfferTypeLabel(offer.offerType)}</span>
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{offer.title}</h1>
                <p className="text-lg text-gray-600 mb-6">{offer.description}</p>

                {offer.discountAmount > 0 && (
                  <div className="flex items-center mb-6">
                    <IndianRupee className="h-6 w-6 text-green-600 mr-2" />
                    <span className="text-3xl font-bold text-green-600">
                      {offer.discountAmount.toLocaleString()}
                    </span>
                    <span className="text-gray-500 ml-3 text-lg">Maximum Savings</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>Valid until {new Date(offer.validUntil).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{offer.cities.join(', ')}</span>
                  </div>
                </div>

                <Link
                  href={`/cars/${offer.brand.toLowerCase().replace(' ', '-')}/${offer.model?.toLowerCase().replace(' ', '-')}`}
                  className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  View {offer.brand} {offer.model} Details
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Link>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-orange-500" />
                Terms & Conditions
              </h3>
              <ul className="space-y-2">
                {offer.terms.map((term, index) => (
                  <li key={index} className="flex items-start">
                    <div className="h-2 w-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-600">{term}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Eligibility */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                Eligibility Criteria
              </h3>
              <ul className="space-y-2">
                {offer.eligibility.map((criteria, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">{criteria}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* How to Avail */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">How to Avail This Offer</h3>
              <div className="space-y-3">
                {offer.howToAvail.map((step, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-blue-600 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-gray-600">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Need Help?</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Call Us</p>
                      <p className="font-medium text-gray-900">{offer.contactInfo.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{offer.contactInfo.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Get Quote
                  </button>
                  <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium">
                    Book Test Drive
                  </button>
                  <Link
                    href="/emi-calculator"
                    className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium text-center block"
                  >
                    Calculate EMI
                  </Link>
                </div>
              </div>

              {/* Offer Validity */}
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg p-6">
                <div className="flex items-center mb-2">
                  <Clock className="h-5 w-5 mr-2" />
                  <span className="font-medium">Limited Time Offer</span>
                </div>
                <p className="text-sm opacity-90">
                  This offer expires on {new Date(offer.validUntil).toLocaleDateString()}
                </p>
                <p className="text-xs opacity-75 mt-2">
                  Don't miss out on these amazing savings!
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
