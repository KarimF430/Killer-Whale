// Optimized RTO Data Structure - Fast Calculation
// Data source: RTO Excel Sheet (28/11/2024)
// Format: [0-5L, 5-10L, 10-20L, 20-30L, 30-40L, 40L+]
// Value types: number (%) or string (fixed amount like "5000")

export type RTOValue = number | string;
export type PriceRange = '0-5' | '5-10' | '10-20' | '20-30' | '30-40' | '40+';

interface StateRTO {
  petrol: RTOValue[];
  diesel: RTOValue[];
  cng: RTOValue[];
  ev: RTOValue[];
}

// Complete RTO data for all states
export const RTO_DATA: Record<string, StateRTO> = {
  'ANDHRA PRADESH': {
    petrol: [13, 14, 17, 18, 18, 18],
    diesel: [13, 14, 17, 18, 18, 18],
    cng: [14.84, 14.84, 17.78, 17.78, 17.78, 17.78],
    ev: ['5000', '5000', '12000', '12000', '25000', '25000']
  },
  'ARUNACHAL PRADESH': {
    petrol: [2, 3, 3, 5, 5, 5],
    diesel: [2, 3, 3, 5, 5, 5],
    cng: [3.84, 3.84, 4.78, 4.78, 4.78, 4.78],
    ev: ['5000', '5000', '12000', '12000', '25000', '25000']
  },
  'ASSAM': {
    petrol: [5, 6, 8, 12, 14, 14],
    diesel: [10.9, 10.9, 10.75, 14.53, 14.71, 14.58],
    cng: [10.84, 10.84, 10.70, 10.70, 10.70, 10.70],
    ev: ['5000', '5000', '12000', '12000', '25000', '25000']
  },
  'BIHAR': {
    petrol: [10.18, 10.17, 9.42, 8, 7.82, 7.95],
    diesel: [9, 9, 12, 12, 12, 12],
    cng: [9, 9, 12, 12, 12, 12],
    ev: [9.62, 9.62, 12.66, 12.48, 12.81, 12.51]
  },
  'CHHATTISGARH': {
    petrol: [9, 10, 10, 10, 10, 10],
    diesel: [9, 10, 10, 10, 10, 10],
    cng: [9, 10, 10, 10, 10, 10],
    ev: [5.20, 5.20, 5, 5.40, 5.81, 5.51]
  },
  'GOA': {
    petrol: [9, 9, 12.80, 16.78, 16.31, 17.08],
    diesel: [9, 9, 12.83, 16.78, 16.3, 17],
    cng: [9, 9, 12.83, 16.78, 16.31, 17],
    ev: ['5000', '5000', '27000', '62000', '75000', '75000']
  },
  'GUJARAT': {
    petrol: [6, 6, 6, 6, 6, 6],
    diesel: [6, 6, 6, 6, 6, 6],
    cng: [6, 6, 6, 6, 6, 6],
    ev: [6.34, 6.34, 6.38, 6.19, 6.53, 6.22]
  },
  'HARYANA': {
    petrol: [5, 8, 8, 10, 10, 10],
    diesel: [5, 8, 8, 10, 10, 10],
    cng: [4, 6.40, 6.40, 8, 8, 8],
    ev: [2.69, 2.69, 2.21, 10.48, 10.88, 10.51]
  },
  'HIMACHAL PRADESH': {
    petrol: [6.6, 6.6, 6.5, 7.5, 7.5, 7.5],
    diesel: [6.6, 6.6, 7.7, 7.7, 7.7, 7.7],
    cng: [6.60, 6.60, 7.70, 7.70, 7.70, 7.70],
    ev: ['5000', '5000', '12000', '12000', '25000', '25000']
  },
  'JHARKHAND': {
    petrol: [8, 7.65, 9.81, 9.19, 9.09, 9.56],
    diesel: [9, 9, 9, 9.12, 9.71, 9.19],
    cng: [7.85, 7.85, 9.40, 9.40, 9.40, 9.40],
    ev: [9.61, 9.61, 9.16, 9.48, 9.81, 9.51]
  },
  'KARNATAKA': {
    petrol: [15.33, 16.13, 16.05, 19.13, 18.81, 21.09],
    diesel: [14.60, 15.66, 18.92, 20, 20, 20],
    cng: [15.01, 15.01, 17.85, 17.85, 17.85, 17.85],
    ev: ['6000', '6000', '13000', '13000', '11850', '11530']
  },
  'KERALA': {
    petrol: [10.50, 13.33, 13.28, 15.70, 22.70, 22.50],
    diesel: [13.2, 13.2, 15, 22.5, 22, 22.5],
    cng: [13.84, 13.84, 17.14, 17.14, 17.14, 17.14],
    ev: [5, 5, 5.66, 5.48, 5.81, 5.51]
  },
  'MADHYA PRADESH': {
    petrol: [8.60, 8, 10.61, 14.56, 14.78, 14.56],
    diesel: [10, 10, 12, 16, 16, 16],
    cng: [8, 8, 10, 14, 14, 14],
    ev: [4.62, 4.62, 4.66, 4.48, 4.81, 4.51]
  },
  'MAHARASHTRA': {
    petrol: [12.22, 11.76, 12.66, 13.83, 13.55, 13.31],
    diesel: [13, 13, 14, 15, 15, 15],
    cng: [7, 7, 8, 9, 9, 9],
    ev: ['3060', '3060', '5100', '12240', '25500', '25500']
  },
  'MANIPUR': {
    petrol: [5.80, 6.66, 7.61, 8.56, 8.41, 8.56],
    diesel: [5, 6, 7, 8, 8, 8],
    cng: [5, 6, 8, 8, 8, 8],
    ev: [5.42, 5.42, 7.06, 6.88, 7.21, 7]
  },
  'MEGHALAYA': {
    petrol: [6.82, 6.66, 6.60, 10.49, 10.78, 10.56],
    diesel: [6, 6, 6, 11, 11, 11],
    cng: [6.84, 6.84, 8.78, 8.78, 8.78, 8.78],
    ev: ['5000', '5000', '12000', '12000', '25000', '25000']
  },
  'MIZORAM': {
    petrol: [6.82, 6.77, 6.66, 6.49, 6.78, 6.56],
    diesel: [6, 6, 6, 6, 6, 6],
    cng: ['5000', '5000', '12000', '12000', '12000', '12000'],
    ev: ['5000', '5000', '12000', '12000', '25000', '25000']
  },
  'NAGALAND': {
    petrol: [6, 6, 6, 6, 6, 6],
    diesel: [6, 6, 6, 6, 6, 6],
    cng: [6.84, 6.84, 6.78, 6.78, 6.78, 6.78],
    ev: ['5000', '5000', '12000', '12000', '25000', '25000']
  },
  'ODISHA': {
    petrol: [6.50, 8.30, 10, 10, 10, 10.50],
    diesel: [8.4, 8.4, 10.2, 10.5, 10, 10],
    cng: [8.84, 8.84, 10, 10, 10, 10],
    ev: [1.64, 1.64, 1.64, 12, 25, 25]
  },
  'PUNJAB': {
    petrol: [8.90, 8.75, 8.36, 8.49, 8.69, 8.56],
    diesel: [10.5, 10.5, 10.5, 13, 14, 14],
    cng: [10.5, 10.5, 13, 14, 14, 14],
    ev: ['5000', '5000', '12000', '12000', '25000', '25000']
  },
  'RAJASTHAN': {
    petrol: [9.82, 9.77, 9.61, 10.49, 12.69, 10.56],
    diesel: [10, 10.12, 10.12, 10.12, 10.12, 10.12],
    cng: [5.60, 5.60, 5.60, 5.60, 5.60, 5.60],
    ev: ['2200', '2200', '12000', '12000', '25000', '25000']
  },
  'SIKKIM': {
    petrol: ['16000', '16000', '16000', '16000', '16000', '16000'],
    diesel: ['16000', '16000', '16000', '16000', '16000', '16000'],
    cng: ['1600', '1600', '1600', '1600', '1600', '1600'],
    ev: ['5000', '5000', '12000', '12000', '25000', '25000']
  },
  'TAMIL NADU': {
    petrol: [12, 13, 18, 20, 20, 20],
    diesel: [12, 13, 18, 20, 20, 20],
    cng: [12, 13, 18, 20, 20, 20],
    ev: ['6500', '6500', '13500', '13500', '26500', '26500']
  },
  'TELANGANA': {
    petrol: [13.82, 14.70, 17.61, 18.50, 18.69, 18.56],
    diesel: [13.4, 14.2, 17, 18.5, 18, 18],
    cng: [14.84, 14.84, 17.78, 17.78, 17.78, 17.78],
    ev: ['5000', '5000', '12000', '12000', '25000', '25000']
  },
  'TRIPURA': {
    petrol: [3, 3.5, 4, 4, 4, 4],
    diesel: [3, 3.5, 4, 4, 4, 4],
    cng: [3, 1.50, 4, 4, 4, 4],
    ev: [3.20, 3.20, 3.66, 3.48, 3.81, 3.51]
  },
  'UTTARAKHAND': {
    petrol: [8, 9, 10, 10, 10, 10],
    diesel: [8, 9, 10, 10, 10, 10],
    cng: [8, 9, 10, 10, 10, 10],
    ev: ['5000', '5000', '12000', '12000', '25000', '25000']
  },
  'UTTAR PRADESH': {
    petrol: [8, 8, 10, 10, 10, 10],
    diesel: [7, 7, 7, 7, 7, 7],
    cng: [8, 8, 10, 10, 10, 10],
    ev: ['5000', '5000', '12000', '12000', '25000', '25000']
  },
  'WEST BENGAL': {
    petrol: [15.7, 10, 10, 10, 10, 10],
    diesel: [13.7, 10, 10, 10, 10, 10],
    cng: [12.78, 9.30, 9.30, 9.30, 9.30, 9.60],
    ev: ['5000', '5000', '12000', '12000', '25000', '25000']
  },
  'ANDAMAN & NICOBAR ISLAND': {
    petrol: [10.5, 10.5, 10.5, 10.5, 10.5, 10.5],
    diesel: [10.5, 10.5, 10.5, 10.5, 10.5, 10.5],
    cng: [1.25, 1.25, 1, 1, 1, 1],
    ev: ['9500', '9500', '16500', '16500', '29500', '29500']
  },
  'CHANDIGARH (UT)': {
    petrol: [8.41, 8.18, 7.96, 8.49, 8.41, 9.64],
    diesel: [7.91, 7.91, 7.42, 8.23, 8.18, 8.07],
    cng: [8.60, 8.60, 7.08, 7.08, 7.08, 7.08],
    ev: ['5000', '5000', '12000', '12000', '25000', '27150']
  },
  'DADRA & NAGAR HAVELI (UT)': {
    petrol: [10.5, 10.5, 10.5, 10.5, 10.5, 10.5],
    diesel: [3.40, 3.40, 3.75, 3.50, 3.71, 3.58],
    cng: [3.34, 3.34, 3.78, 3.78, 3.78, 3.78],
    ev: ['5000', '5000', '12000', '12000', '25000', '25000']
  },
  'THE GOV OF NCT OF DELHI (UT)': {
    petrol: [4, 7, 10, 10, 10, 10],
    diesel: [5, 8.7, 12.5, 12.5, 12.5, 12.5],
    cng: [4, 7, 10, 10, 10, 10],
    ev: ['9000', '9000', '10000', '16000', '29000', '29000']
  },
  'JAMMU & KASHMIR (UT)': {
    petrol: ['1200', '1200', '1200', '1200', '1200', '1200'],
    diesel: ['1200', '1200', '1200', '1200', '1200', '1200'],
    cng: [9.84, 9.84, 9.78, 9.78, 9.78, 9.78],
    ev: ['1550', '1550', '12000', '12000', '25000', '25000']
  },
  'LAKSHADWEEP (UT)': {
    petrol: [10.8, 13, 15, 22.5, 22.5, 22.5],
    diesel: [13.2, 13.2, 15, 22.5, 22, 22.5],
    cng: [13.84, 13.84, 17.14, 17.14, 17.14, 17.14],
    ev: [5, 5, 5.66, 5.48, 5.81, 5.51]
  },
  'PUDUCHERRY (UT)': {
    petrol: [13.17, 4.77, 7.61, 7.49, 7.78, 7.56],
    diesel: [4, 4, 7, 7, 7, 7],
    cng: ['5000', '5000', '12000', '12000', '12000', '12000'],
    ev: ['5000', '5000', '12000', '12000', '25000', '25000']
  }
};

// Price range mapping
const PRICE_RANGES: Record<PriceRange, [number, number]> = {
  '0-5': [0, 500000],
  '5-10': [500001, 1000000],
  '10-20': [1000001, 2000000],
  '20-30': [2000001, 3000000],
  '30-40': [3000001, 4000000],
  '40+': [4000001, Infinity]
};

// Get price range index from ex-showroom price
function getPriceRangeIndex(exShowroomPrice: number): number {
  if (exShowroomPrice <= 500000) return 0;
  if (exShowroomPrice <= 1000000) return 1;
  if (exShowroomPrice <= 2000000) return 2;
  if (exShowroomPrice <= 3000000) return 3;
  if (exShowroomPrice <= 4000000) return 4;
  return 5;
}

// Calculate RTO based on value type
function calculateRTOValue(value: RTOValue, exShowroomPrice: number): number {
  if (typeof value === 'string') {
    // Fixed amount (e.g., "5000")
    return parseFloat(value);
  }
  // Percentage (e.g., 13)
  return (exShowroomPrice * value) / 100;
}

// Get RTO charges for a state, fuel type, and price
export function getRTOCharges(
  state: string,
  fuelType: string,
  exShowroomPrice: number
): number {
  const stateKey = state.toUpperCase();
  const stateData = RTO_DATA[stateKey];
  
  if (!stateData) {
    console.warn(`State "${state}" not found, using Maharashtra default`);
    return getRTOCharges('MAHARASHTRA', fuelType, exShowroomPrice);
  }

  const priceIndex = getPriceRangeIndex(exShowroomPrice);
  const fuelKey = fuelType.toLowerCase();
  
  let rtoValues: RTOValue[];
  
  if (fuelKey.includes('petrol') || fuelKey.includes('gasoline')) {
    rtoValues = stateData.petrol;
  } else if (fuelKey.includes('diesel')) {
    rtoValues = stateData.diesel;
  } else if (fuelKey.includes('cng') || fuelKey.includes('gas')) {
    rtoValues = stateData.cng;
  } else if (fuelKey.includes('electric') || fuelKey.includes('ev')) {
    rtoValues = stateData.ev;
  } else {
    rtoValues = stateData.petrol; // Default to petrol
  }

  return calculateRTOValue(rtoValues[priceIndex], exShowroomPrice);
}

// Calculate Road Safety Tax/Cess (2% of RTO)
export function calculateRoadSafetyTax(rtoCharges: number): number {
  return (rtoCharges * 2) / 100;
}

// Calculate Insurance (4.6% of Ex-Showroom Price)
export function calculateInsurance(exShowroomPrice: number): number {
  return (exShowroomPrice * 4.6) / 100;
}

// Calculate TCS (1% of Ex-Showroom if price > 9.99 Lakh)
export function calculateTCS(exShowroomPrice: number): number {
  if (exShowroomPrice > 999000) {
    return (exShowroomPrice * 1) / 100;
  }
  return 0;
}

// Fixed charges
export const FIXED_CHARGES = {
  otherCharges: 2000,
  hypothecation: 1500,
  fasTag: 500,
};

// Complete price breakup interface
export interface OnRoadPriceBreakup {
  exShowroomPrice: number;
  rtoCharges: number;
  roadSafetyTax: number;
  insurance: number;
  tcs: number;
  otherCharges: number;
  hypothecation: number;
  fasTag: number;
  totalOnRoadPrice: number;
}

// Calculate complete on-road price
export function calculateOnRoadPrice(
  exShowroomPrice: number,
  state: string,
  fuelType: string
): OnRoadPriceBreakup {
  const rtoCharges = getRTOCharges(state, fuelType, exShowroomPrice);
  const roadSafetyTax = calculateRoadSafetyTax(rtoCharges);
  const insurance = calculateInsurance(exShowroomPrice);
  const tcs = calculateTCS(exShowroomPrice);
  const otherCharges = FIXED_CHARGES.otherCharges;
  const hypothecation = FIXED_CHARGES.hypothecation;
  const fasTag = FIXED_CHARGES.fasTag;

  const totalOnRoadPrice =
    exShowroomPrice +
    rtoCharges +
    roadSafetyTax +
    insurance +
    tcs +
    otherCharges +
    hypothecation +
    fasTag;

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
  };
}

// Format price in Indian format
export function formatIndianPrice(price: number): string {
  return new Intl.NumberFormat('en-IN').format(Math.round(price));
}

// Format price in Lakh format
export function formatLakhPrice(price: number): string {
  const lakh = price / 100000;
  return `${lakh.toFixed(2)} Lakh`;
}
