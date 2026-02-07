import { Metadata } from 'next'
import { Suspense } from 'react'
import EMICalculatorPage from '@/components/emi/EMICalculatorPage'

export const metadata: Metadata = {
  title: 'Car Loan EMI Calculator - Calculate Monthly Payments | gadizone',
  description: 'Calculate car loan EMI with our interactive calculator. Get instant results for down payment, tenure, and interest rates. Compare loan options for your dream car.',
  keywords: 'car loan EMI calculator, car loan calculator, monthly EMI calculator, car finance, auto loan EMI, car loan interest rate',
  alternates: {
    canonical: '/emi-calculator',
  },
  openGraph: {
    title: 'Car Loan EMI Calculator - Calculate Monthly Payments | gadizone',
    description: 'Calculate car loan EMI with our interactive calculator. Get instant results for down payment, tenure, and interest rates.',
    type: 'website',
  },
}

export default function EMIPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <h1 className="sr-only">Car Loan EMI Calculator</h1>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading EMI Calculator...</p>
        </div>
      </div>
    }>
      <EMICalculatorPage />
    </Suspense>
  )
}
