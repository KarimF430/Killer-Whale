'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ChevronDown, Info, Eye, EyeOff, ArrowLeft, X } from 'lucide-react'
import Link from 'next/link'
import Footer from '../Footer'
import PageContainer, { PageSection } from '../layout/PageContainer'

interface EMICalculation {
  emi: number
  totalAmount: number
  totalInterest: number
  principal: number
}

export default function EMICalculatorPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Get URL parameters
  const brandParam = searchParams.get('brand') || ''
  const modelParam = searchParams.get('model') || ''
  const variantParam = searchParams.get('variant') || ''
  const priceParam = searchParams.get('price') || ''
  
  // State
  const [carPrice, setCarPrice] = useState(Number(priceParam) || 1228244)
  const [downPaymentPercent, setDownPaymentPercent] = useState(20)
  const [downPayment, setDownPayment] = useState(Math.round(carPrice * 0.2))
  const [tenure, setTenure] = useState(7)
  const [tenureMonths, setTenureMonths] = useState(84)
  const [interestRate, setInterestRate] = useState(8)
  const [showPaymentBreakup, setShowPaymentBreakup] = useState(false)
  const [showDownPayment, setShowDownPayment] = useState(false)
  const [showInterest, setShowInterest] = useState(false)
  
  // Brand and model display
  const displayBrand = brandParam || 'Honda'
  const displayModel = modelParam || 'Elevate'
  const displayVariant = variantParam || 'SV MT'
  const fullCarName = `${displayBrand} ${displayModel} ${displayVariant}`

  // Calculate EMI (memoized for performance)
  const emiCalculation = useMemo((): EMICalculation => {
    const principal = carPrice - downPayment
    const monthlyRate = interestRate / 12 / 100
    const months = tenureMonths
    
    if (monthlyRate === 0) {
      const emi = principal / months
      return {
        emi: Math.round(emi),
        totalAmount: Math.round(principal),
        totalInterest: 0,
        principal
      }
    }
    
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                (Math.pow(1 + monthlyRate, months) - 1)
    
    const totalAmount = emi * months
    const totalInterest = totalAmount - principal
    
    return {
      emi: Math.round(emi),
      totalAmount: Math.round(totalAmount),
      totalInterest: Math.round(totalInterest),
      principal
    }
  }, [carPrice, downPayment, tenureMonths, interestRate])

  // Generate amortization table
  const amortizationTable = useMemo(() => {
    const monthlyRate = interestRate / 12 / 100
    const table = []
    let balance = emiCalculation.principal
    
    const periods = [12, 24, 36, 48, 60]
    
    for (const month of periods) {
      if (month <= tenureMonths) {
        let tempBalance = emiCalculation.principal
        let totalPrincipal = 0
        let totalInt = 0
        
        for (let i = 1; i <= month; i++) {
          const interest = tempBalance * monthlyRate
          const principalPaid = emiCalculation.emi - interest
          tempBalance -= principalPaid
          totalPrincipal += principalPaid
          totalInt += interest
        }
        
        table.push({
          months: month,
          principal: Math.round(totalPrincipal),
          interest: Math.round(totalInt),
          balance: Math.round(Math.max(0, emiCalculation.principal - totalPrincipal))
        })
      }
    }
    
    return table
  }, [emiCalculation.principal, emiCalculation.emi, tenureMonths, interestRate])

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Update down payment when percentage changes
  useEffect(() => {
    setDownPayment(Math.round(carPrice * (downPaymentPercent / 100)))
  }, [carPrice, downPaymentPercent])

  // Update tenure months when tenure years change
  useEffect(() => {
    setTenureMonths(tenure * 12)
  }, [tenure])

  // Handle down payment change
  const handleDownPaymentChange = (value: number) => {
    setDownPayment(value)
    setDownPaymentPercent(Math.round((value / carPrice) * 100))
  }

  const loanAmount = carPrice - downPayment

  return (
    <div className="min-h-screen bg-gray-50">
      <PageContainer maxWidth="md">
        <PageSection spacing="normal">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-base font-semibold text-gray-900">Choose your EMI options</h1>
                <p className="text-sm text-gray-600">{fullCarName}</p>
              </div>
              <button
                onClick={() => router.back()}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* EMI Display */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-baseline justify-between mb-1">
              <p className="text-lg font-bold text-gray-900">{formatCurrency(emiCalculation.emi)}</p>
              <span className="text-xs text-gray-600">EMI For {tenure} Years</span>
            </div>
            
          </div>

          {/* Down Payment */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-900">
                Down Payment: <span className="text-blue-600">{formatCurrency(downPayment)}</span>
              </label>
              <button
                onClick={() => setShowDownPayment(!showDownPayment)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {showDownPayment ? 'Hide' : 'Hide'}
              </button>
            </div>
            
            {showDownPayment && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>{formatCurrency(Math.round(carPrice * 0.2))}</span>
                  <span>{formatCurrency(carPrice)}</span>
                </div>
                <input
                  type="range"
                  min={Math.round(carPrice * 0.2)}
                  max={carPrice}
                  value={downPayment}
                  onChange={(e) => handleDownPaymentChange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
                <input
                  type="number"
                  value={downPayment}
                  onChange={(e) => handleDownPaymentChange(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  placeholder="₹ 3,73,815"
                />
                <p className="text-xs text-gray-600">
                  Your loan amount will be: <span className="text-teal-600 font-medium">{formatCurrency(loanAmount)}</span>
                </p>
              </div>
            )}
          </div>

          {/* Tenure */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-900">Tenure</label>
              <div className="flex items-center space-x-1">
                <span className="text-sm text-gray-900">Interest</span>
                <Info className="w-4 h-4 text-gray-400" />
                <button
                  onClick={() => setShowInterest(!showInterest)}
                  className="text-sm text-blue-600 hover:text-blue-700 ml-2"
                >
                  Hide
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                  <span>1 year</span>
                  <span>7 years</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={7}
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
              </div>
              <div>
                <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                  <span>8%</span>
                  <span>20%</span>
                </div>
                <input
                  type="range"
                  min={8}
                  max={20}
                  step={0.5}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                value={tenure}
                onChange={(e) => setTenure(Math.min(7, Math.max(1, Number(e.target.value))))}
                min={1}
                max={7}
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-center"
                placeholder="5"
              />
              <input
                type="number"
                value={tenureMonths}
                onChange={(e) => {
                  const months = Math.min(84, Math.max(12, Number(e.target.value)))
                  setTenureMonths(months)
                  setTenure(Math.round(months / 12))
                }}
                min={12}
                max={84}
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-center"
                placeholder="60 months"
              />
            </div>
            
            {showInterest && (
              <div className="mt-3">
                <input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Math.min(20, Math.max(5, Number(e.target.value))))}
                  step={0.1}
                  min={5}
                  max={20}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  placeholder="10"
                />
              </div>
            )}
          </div>

          {/* AD Banner */}
          <div className="p-4">
            <div className="bg-gray-200 rounded-lg py-20 text-center">
              <p className="text-gray-500 font-semibold text-xl">AD Banner</p>
            </div>
          </div>

          {/* Amortization Table */}
          <div className="px-4 pb-4">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left py-2 font-semibold text-gray-700">Months</th>
                    <th className="text-right py-2 font-semibold text-gray-700">Principal</th>
                    <th className="text-right py-2 font-semibold text-gray-700">Interest</th>
                    <th className="text-right py-2 font-semibold text-gray-700">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {amortizationTable.map((row, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-2 text-gray-900">{row.months}</td>
                      <td className="py-2 text-right text-gray-900">{formatCurrency(row.principal)}</td>
                      <td className="py-2 text-right text-gray-900">{formatCurrency(row.interest)}</td>
                      <td className="py-2 text-right text-gray-900">{formatCurrency(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Know Your Loan Eligibility */}
          <div className="p-4 border-t border-gray-200">
            <h3 className="text-base font-bold text-gray-900 mb-2">Know Your Loan Eligibility</h3>
            <p className="text-sm text-gray-600 mb-4">
              Buy your dream car with easy online offers in 3 simple steps
            </p>

            {/* Step 1 - Get Started */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-900">Step 1 - Get Started</h4>
              
              {/* Title & Full Name */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">FULL NAME</label>
                <div className="flex space-x-2">
                  <select className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm">
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Ms">Ms</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Full Name as per PAN card"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">MOBILE*</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l text-sm">
                    +91
                  </span>
                  <input
                    type="tel"
                    placeholder="Mobile Number"
                    maxLength={10}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-r focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">An OTP will be sent to you for verification</p>
              </div>
            </div>
          </div>

          {/* Lending Partners */}
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Our Lending Partners</h3>
            <div className="flex items-center justify-around py-4 border border-gray-200 rounded-lg bg-white">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-red-600 font-bold text-xl">A</span>
                </div>
                <p className="text-xs text-gray-600">Axis Bank</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-600 font-bold text-xl">C</span>
                </div>
                <p className="text-xs text-gray-600">Chola</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-orange-600 font-bold text-xl">H</span>
                </div>
                <p className="text-xs text-gray-600">HDFC</p>
              </div>
            </div>
          </div>

          {/* Get Loan Offers Button */}
          <div className="p-4">
            <button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded transition-colors">
              Get Eligible Loan Offers
            </button>
            <p className="text-xs text-gray-500 text-center mt-3 leading-relaxed">
              By proceeding ahead you agree to CarWale <a href="#" className="text-blue-600">Visitor Agreement</a>, <a href="#" className="text-blue-600">Privacy Policy</a> and <a href="#" className="text-blue-600">Terms and Conditions</a>. This site is protected by reCAPTCHA and Google <a href="#" className="text-blue-600">terms of service</a> apply.
            </p>
          </div>
        </div>
        </PageSection>
      </PageContainer>
    </div>
  )
}
