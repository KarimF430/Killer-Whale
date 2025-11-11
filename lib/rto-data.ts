// RTO Charges Data - State-wise and Fuel Type-wise percentages
// RTO is calculated as: Ex-Showroom Price × RTO Percentage

export interface RTOData {
  state: string
  petrol: number // Percentage
  diesel: number // Percentage
  cng: number // Percentage
  electric: number // Percentage
}

// RTO percentages by state and fuel type
export const rtoData: RTOData[] = [
  { state: 'Maharashtra', petrol: 13, diesel: 15, cng: 13, electric: 10 },
  { state: 'Delhi', petrol: 10, diesel: 12, cng: 10, electric: 8 },
  { state: 'Karnataka', petrol: 14, diesel: 16, cng: 14, electric: 10 },
  { state: 'Tamil Nadu', petrol: 12, diesel: 14, cng: 12, electric: 9 },
  { state: 'Gujarat', petrol: 11, diesel: 13, cng: 11, electric: 8 },
  { state: 'Uttar Pradesh', petrol: 10, diesel: 12, cng: 10, electric: 8 },
  { state: 'West Bengal', petrol: 12, diesel: 14, cng: 12, electric: 9 },
  { state: 'Rajasthan', petrol: 11, diesel: 13, cng: 11, electric: 8 },
  { state: 'Madhya Pradesh', petrol: 11, diesel: 13, cng: 11, electric: 8 },
  { state: 'Telangana', petrol: 13, diesel: 15, cng: 13, electric: 10 },
  { state: 'Andhra Pradesh', petrol: 12, diesel: 14, cng: 12, electric: 9 },
  { state: 'Kerala', petrol: 13, diesel: 15, cng: 13, electric: 10 },
  { state: 'Punjab', petrol: 10, diesel: 12, cng: 10, electric: 8 },
  { state: 'Haryana', petrol: 10, diesel: 12, cng: 10, electric: 8 },
  { state: 'Bihar', petrol: 11, diesel: 13, cng: 11, electric: 8 },
  { state: 'Odisha', petrol: 12, diesel: 14, cng: 12, electric: 9 },
  { state: 'Assam', petrol: 11, diesel: 13, cng: 11, electric: 8 },
  { state: 'Jharkhand', petrol: 11, diesel: 13, cng: 11, electric: 8 },
  { state: 'Chhattisgarh', petrol: 11, diesel: 13, cng: 11, electric: 8 },
  { state: 'Uttarakhand', petrol: 10, diesel: 12, cng: 10, electric: 8 },
  { state: 'Himachal Pradesh', petrol: 9, diesel: 11, cng: 9, electric: 7 },
  { state: 'Goa', petrol: 8, diesel: 10, cng: 8, electric: 6 },
  { state: 'Jammu and Kashmir', petrol: 9, diesel: 11, cng: 9, electric: 7 },
  { state: 'Chandigarh', petrol: 8, diesel: 10, cng: 8, electric: 6 },
  { state: 'Puducherry', petrol: 8, diesel: 10, cng: 8, electric: 6 },
]

// Get RTO percentage for a state and fuel type
export const getRTOPercentage = (state: string, fuelType: string): number => {
  const stateData = rtoData.find(
    (data) => data.state.toLowerCase() === state.toLowerCase()
  )

  if (!stateData) {
    // Default to Maharashtra if state not found
    return 13
  }

  const normalizedFuelType = fuelType.toLowerCase()

  if (normalizedFuelType.includes('petrol') || normalizedFuelType.includes('gasoline')) {
    return stateData.petrol
  } else if (normalizedFuelType.includes('diesel')) {
    return stateData.diesel
  } else if (normalizedFuelType.includes('cng') || normalizedFuelType.includes('gas')) {
    return stateData.cng
  } else if (normalizedFuelType.includes('electric') || normalizedFuelType.includes('ev')) {
    return stateData.electric
  } else {
    // Default to petrol if fuel type not recognized
    return stateData.petrol
  }
}

// Calculate RTO charges
export const calculateRTO = (exShowroomPrice: number, state: string, fuelType: string): number => {
  const rtoPercentage = getRTOPercentage(state, fuelType)
  return (exShowroomPrice * rtoPercentage) / 100
}

// Calculate Road Safety Tax/Cess (2% of RTO)
export const calculateRoadSafetyTax = (rtoCharges: number): number => {
  return (rtoCharges * 2) / 100
}

// Calculate Insurance (4.6% of Ex-Showroom Price)
export const calculateInsurance = (exShowroomPrice: number): number => {
  return (exShowroomPrice * 4.6) / 100
}

// Calculate TCS (1% of Ex-Showroom if price > 9.99 Lakh)
export const calculateTCS = (exShowroomPrice: number): number => {
  if (exShowroomPrice > 999000) {
    return (exShowroomPrice * 1) / 100
  }
  return 0
}

// Fixed charges
export const FIXED_CHARGES = {
  otherCharges: 2000,
  hypothecation: 1500,
  fasTag: 500,
}

// Calculate total On-Road Price
export interface OnRoadPriceBreakup {
  exShowroomPrice: number
  rtoCharges: number
  roadSafetyTax: number
  insurance: number
  tcs: number
  otherCharges: number
  hypothecation: number
  fasTag: number
  totalOnRoadPrice: number
}

export const calculateOnRoadPrice = (
  exShowroomPrice: number,
  state: string,
  fuelType: string
): OnRoadPriceBreakup => {
  const rtoCharges = calculateRTO(exShowroomPrice, state, fuelType)
  const roadSafetyTax = calculateRoadSafetyTax(rtoCharges)
  const insurance = calculateInsurance(exShowroomPrice)
  const tcs = calculateTCS(exShowroomPrice)
  const otherCharges = FIXED_CHARGES.otherCharges
  const hypothecation = FIXED_CHARGES.hypothecation
  const fasTag = FIXED_CHARGES.fasTag

  const totalOnRoadPrice =
    exShowroomPrice +
    rtoCharges +
    roadSafetyTax +
    insurance +
    tcs +
    otherCharges +
    hypothecation +
    fasTag

  return {
    exShowroomPrice,
    rtoCharges,
    roadSafetyTax,
    insurance,
    tcs,
    otherCharges,
    hypothecation,
    fasTag,
    totalOnRoadPrice,
  }
}

// Format price in Indian format (e.g., 8,70,900)
export const formatIndianPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN').format(Math.round(price))
}

// Format price in Lakh format (e.g., 8.71 Lakh)
export const formatLakhPrice = (price: number): string => {
  const lakh = price / 100000
  return `${lakh.toFixed(2)} Lakh`
}
