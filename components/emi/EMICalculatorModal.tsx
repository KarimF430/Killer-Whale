'use client'

import { useState, useEffect } from 'react'
import { X, ChevronDown, Eye, EyeOff } from 'lucide-react'

interface EMICalculatorModalProps {
  isOpen: boolean
  onClose: () => void
  carName?: string
  carPrice?: number
}

interface LoanEligibilityForm {
  title: string
  fullName: string
  mobile: string
}

export default function EMICalculatorModal({ isOpen, onClose, carName = 'Honda Elevate SV MT', carPrice = 2103200 }: EMICalculatorModalProps) {
  const [activeTab, setActiveTab] = useState<'standard' | 'instant'>('standard')
  const [loanAmount, setLoanAmount] = useState(carPrice)
  const [downPayment, setDownPayment] = useState(Math.round(carPrice * 0.15))
  const [tenure, setTenure] = useState(5)
  const [tenureMonths, setTenureMonths] = useState(60)
  const [interestRate, setInterestRate] = useState(10)
  const [showPaymentBreakup, setShowPaymentBreakup] = useState(false)
  const [showDownPayment, setShowDownPayment] = useState(false)
  const [showInterest, setShowInterest] = useState(false)
  
  // Loan eligibility form
  const [eligibilityForm, setEligibilityForm] = useState<LoanEligibilityForm>({
    title: 'Mr',
    fullName: '',
    mobile: ''
  })

  // Calculate EMI
  const calculateEMI = () => {
    const principal = loanAmount - downPayment
    const monthlyRate = interestRate / 12 / 100
    const months = tenureMonths
    
    if (monthlyRate === 0) {
      return Math.round(principal / months)
    }
    
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                (Math.pow(1 + monthlyRate, months) - 1)
    
    return Math.round(emi)
  }

  const emi = calculateEMI()
  const principal = loanAmount - downPayment
  const totalAmount = emi * tenureMonths
  const totalInterest = totalAmount - principal

  // Generate amortization table
  const generateAmortizationTable = () => {
    const monthlyRate = interestRate / 12 / 100
    const table = []
    let balance = principal
    
    const periods = [12, 24, 36, 48, 60]
    
    for (const month of periods) {
      if (month <= tenureMonths) {
        let tempBalance = principal
        let totalPrincipal = 0
        let totalInt = 0
        
        for (let i = 1; i <= month; i++) {
          const interest = tempBalance * monthlyRate
          const principalPaid = emi - interest
          tempBalance -= principalPaid
          totalPrincipal += principalPaid
          totalInt += interest
        }
        
        table.push({
          months: month,
          principal: Math.round(totalPrincipal),
          interest: Math.round(totalInt),
          balance: Math.round(Math.max(0, principal - totalPrincipal))
        })
      }
    }
    
    return table
  }

  const amortizationTable = generateAmortizationTable()

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Update tenure months when tenure years change
  useEffect(() => {
    setTenureMonths(tenure * 12)
  }, [tenure])

  // Update loan amount when down payment changes
  const handleDownPaymentChange = (value: number) => {
    setDownPayment(value)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-md w-full my-8 relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-xl">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Choose your EMI options</h2>
            <p className="text-sm text-gray-600">{carName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('standard')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'standard'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Standard
          </button>
          <button
            onClick={() => setActiveTab('instant')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'instant'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Instant Loan
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* EMI Display */}
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-2xl font-bold text-gray-900">{formatCurrency(emi)}</span>
              <span className="text-sm text-gray-600">EMI For {tenure} Years</span>
            </div>
            
            {/* View Payment Breakup */}
            <button
              onClick={() => setShowPaymentBreakup(!showPaymentBreakup)}
              className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700"
            >
              {showPaymentBreakup ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{showPaymentBreakup ? 'Hide' : 'View'} Payment Break-Up</span>
            </button>
          </div>

          {/* Payment Breakup Table */}
          {showPaymentBreakup && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
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
          )}

          {/* Down Payment */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Down Payment: {formatCurrency(downPayment)}</label>
              <button
                onClick={() => setShowDownPayment(!showDownPayment)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {showDownPayment ? 'Hide' : 'Edit'}
              </button>
            </div>
            
            {showDownPayment && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{formatCurrency(Math.round(carPrice * 0.1))}</span>
                  <span>{formatCurrency(Math.round(carPrice * 0.5))}</span>
                </div>
                <input
                  type="range"
                  min={Math.round(carPrice * 0.1)}
                  max={Math.round(carPrice * 0.5)}
                  value={downPayment}
                  onChange={(e) => handleDownPaymentChange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <input
                  type="number"
                  value={downPayment}
                  onChange={(e) => handleDownPaymentChange(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter down payment"
                />
                <p className="text-sm text-gray-600">Your loan amount will be: {formatCurrency(carPrice - downPayment)}</p>
              </div>
            )}
          </div>

          {/* Tenure */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Tenure</label>
            <div className="flex items-center space-x-4">
              {/* Tenure Slider */}
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>5 year</span>
                  <span>7 years</span>
                  <span>10%</span>
                  <span>20%</span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min={1}
                    max={7}
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between mt-2">
                    <input
                      type="number"
                      value={tenure}
                      onChange={(e) => setTenure(Number(e.target.value))}
                      min={1}
                      max={7}
                      className="w-20 px-2 py-1 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      value={tenureMonths}
                      onChange={(e) => {
                        const months = Number(e.target.value)
                        setTenureMonths(months)
                        setTenure(Math.round(months / 12))
                      }}
                      className="w-24 px-2 py-1 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="months"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Interest</label>
              <button
                onClick={() => setShowInterest(!showInterest)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {showInterest ? 'Hide' : 'Edit'}
              </button>
            </div>
            
            {showInterest && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>5%</span>
                  <span>20%</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={20}
                  step={0.5}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  step={0.1}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter interest rate"
                />
              </div>
            )}
          </div>

          {/* AD Banner */}
          <div className="bg-gray-200 rounded-lg py-16 text-center">
            <p className="text-gray-500 font-semibold">AD Banner</p>
          </div>

          {/* Know Your Loan Eligibility */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Know Your Loan Eligibility</h3>
            <p className="text-sm text-gray-600 mb-4">
              Buy your dream car with easy online offers in 3 simple steps
            </p>

            {/* Step 1 - Get Started */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Step 1 - Get Started</h4>
              
              {/* Title Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">FULL NAME</label>
                <div className="flex space-x-2">
                  <select
                    value={eligibilityForm.title}
                    onChange={(e) => setEligibilityForm({ ...eligibilityForm, title: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Ms">Ms</option>
                  </select>
                  <input
                    type="text"
                    value={eligibilityForm.fullName}
                    onChange={(e) => setEligibilityForm({ ...eligibilityForm, fullName: e.target.value })}
                    placeholder="Full Name as per PAN card"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">MOBILE*</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-lg">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={eligibilityForm.mobile}
                    onChange={(e) => setEligibilityForm({ ...eligibilityForm, mobile: e.target.value })}
                    placeholder="Mobile Number"
                    maxLength={10}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">An OTP will be sent to you for verification</p>
              </div>
            </div>
          </div>

          {/* Lending Partners */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Our Lending Partners</h3>
            <div className="flex items-center justify-around py-4 border border-gray-200 rounded-lg">
              <img src="/logos/axis-bank.png" alt="Axis Bank" className="h-8 object-contain" onError={(e) => { e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="32"><text y="20" font-size="14" fill="%23666">AXIS BANK</text></svg>' }} />
              <img src="/logos/chola.png" alt="Chola" className="h-8 object-contain" onError={(e) => { e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="32"><text y="20" font-size="14" fill="%23666">CHOLA</text></svg>' }} />
              <img src="/logos/hdfc.png" alt="HDFC" className="h-8 object-contain" onError={(e) => { e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="32"><text y="20" font-size="14" fill="%23666">HDFC</text></svg>' }} />
            </div>
          </div>

          {/* Get Eligible Loan Offers Button */}
          <button className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold py-3 rounded-lg transition-colors">
            Get Eligible Loan Offers
          </button>

          {/* Disclaimer */}
          <p className="text-xs text-gray-500 text-center">
            By proceeding ahead you agree to CarWale <a href="#" className="text-blue-600">Visitor Agreement</a>, <a href="#" className="text-blue-600">Privacy Policy</a> and <a href="#" className="text-blue-600">Terms and Conditions</a>. This site is protected by reCAPTCHA and Google <a href="#" className="text-blue-600">terms of service</a> apply.
          </p>
        </div>
      </div>
    </div>
  )
}
