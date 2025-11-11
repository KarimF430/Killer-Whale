import { Metadata } from 'next'
import EMICalculatorPage from '@/components/emi/EMICalculatorPage'

export const metadata: Metadata = {
  title: 'Car Loan EMI Calculator - Calculate Monthly Payments | CarWale',
  description: 'Calculate car loan EMI with our interactive calculator. Get instant results for down payment, tenure, and interest rates. Compare loan options for your dream car.',
  keywords: 'car loan EMI calculator, car loan calculator, monthly EMI calculator, car finance, auto loan EMI, car loan interest rate',
  openGraph: {
    title: 'Car Loan EMI Calculator - Calculate Monthly Payments | CarWale',
    description: 'Calculate car loan EMI with our interactive calculator. Get instant results for down payment, tenure, and interest rates.',
    type: 'website',
  },
}

export default function EMIPage() {
  return <EMICalculatorPage />
}
