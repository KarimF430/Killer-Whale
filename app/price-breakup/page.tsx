import { Metadata } from 'next'
import PriceBreakupPage from '@/components/price-breakup/PriceBreakupPage'

export const metadata: Metadata = {
  title: 'Car Price Breakup - On-Road Price Calculator | MotorOctane',
  description: 'Calculate detailed on-road price breakup for any car. Get complete cost analysis including ex-showroom price, RTO, insurance, and other charges.',
  keywords: 'car price breakup, on-road price calculator, car cost analysis, RTO charges, insurance cost',
}

export default function PriceBreakup() {
  return <PriceBreakupPage />
}
