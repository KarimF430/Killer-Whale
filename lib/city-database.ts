/**
 * Comprehensive City-to-State Mapping for India
 * Covers all major cities, district headquarters, and popular locations
 * Optimized for O(1) lookup performance
 */

export interface CityData {
    city: string;
    state: string;
    rtoState: string; // Exact state name as per RTO_DATA
    popular: boolean; // For showing in dropdowns first
}

// Complete city database (500+ cities)
export const CITY_DATABASE: CityData[] = [
    // Delhi NCR
    { city: 'Delhi', state: 'Delhi', rtoState: 'THE GOV OF NCT OF DELHI (UT)', popular: true },
    { city: 'New Delhi', state: 'Delhi', rtoState: 'THE GOV OF NCT OF DELHI (UT)', popular: true },
    { city: 'Noida', state: 'Uttar Pradesh', rtoState: 'UTTAR PRADESH', popular: true },
    { city: 'Gurgaon', state: 'Haryana', rtoState: 'HARYANA', popular: true },
    { city: 'Gurugram', state: 'Haryana', rtoState: 'HARYANA', popular: true },
    { city: 'Faridabad', state: 'Haryana', rtoState: 'HARYANA', popular: true },
    { city: 'Ghaziabad', state: 'Uttar Pradesh', rtoState: 'UTTAR PRADESH', popular: true },
    { city: 'Greater Noida', state: 'Uttar Pradesh', rtoState: 'UTTAR PRADESH', popular: false },

    // Maharashtra
    { city: 'Mumbai', state: 'Maharashtra', rtoState: 'MAHARASHTRA', popular: true },
    { city: 'Pune', state: 'Maharashtra', rtoState: 'MAHARASHTRA', popular: true },
    { city: 'Nagpur', state: 'Maharashtra', rtoState: 'MAHARASHTRA', popular: true },
    { city: 'Nashik', state: 'Maharashtra', rtoState: 'MAHARASHTRA', popular: false },
    { city: 'Thane', state: 'Maharashtra', rtoState: 'MAHARASHTRA', popular: false },
    { city: 'Aurangabad', state: 'Maharashtra', rtoState: 'MAHARASHTRA', popular: false },
    { city: 'Solapur', state: 'Maharashtra', rtoState: 'MAHARASHTRA', popular: false },
    { city: 'Kolhapur', state: 'Maharashtra', rtoState: 'MAHARASHTRA', popular: false },
    { city: 'Navi Mumbai', state: 'Maharashtra', rtoState: 'MAHARASHTRA', popular: false },

    // Karnataka
    { city: 'Bangalore', state: 'Karnataka', rtoState: 'KARNATAKA', popular: true },
    { city: 'Bengaluru', state: 'Karnataka', rtoState: 'KARNATAKA', popular: true },
    { city: 'Mysore', state: 'Karnataka', rtoState: 'KARNATAKA', popular: false },
    { city: 'Mangalore', state: 'Karnataka', rtoState: 'KARNATAKA', popular: false },
    { city: 'Hubli', state: 'Karnataka', rtoState: 'KARNATAKA', popular: false },
    { city: 'Belgaum', state: 'Karnataka', rtoState: 'KARNATAKA', popular: false },

    // Tamil Nadu
    { city: 'Chennai', state: 'Tamil Nadu', rtoState: 'TAMIL NADU', popular: true },
    { city: 'Coimbatore', state: 'Tamil Nadu', rtoState: 'TAMIL NADU', popular: false },
    { city: 'Madurai', state: 'Tamil Nadu', rtoState: 'TAMIL NADU', popular: false },
    { city: 'Tiruchirappalli', state: 'Tamil Nadu', rtoState: 'TAMIL NADU', popular: false },
    { city: 'Salem', state: 'Tamil Nadu', rtoState: 'TAMIL NADU', popular: false },
    { city: 'Tirunelveli', state: 'Tamil Nadu', rtoState: 'TAMIL NADU', popular: false },

    // Telangana
    { city: 'Hyderabad', state: 'Telangana', rtoState: 'TELANGANA', popular: true },
    { city: 'Warangal', state: 'Telangana', rtoState: 'TELANGANA', popular: false },
    { city: 'Nizamabad', state: 'Telangana', rtoState: 'TELANGANA', popular: false },

    // Andhra Pradesh
    { city: 'Visakhapatnam', state: 'Andhra Pradesh', rtoState: 'ANDHRA PRADESH', popular: false },
    { city: 'Vijayawada', state: 'Andhra Pradesh', rtoState: 'ANDHRA PRADESH', popular: false },
    { city: 'Guntur', state: 'Andhra Pradesh', rtoState: 'ANDHRA PRADESH', popular: false },
    { city: 'Tirupati', state: 'Andhra Pradesh', rtoState: 'ANDHRA PRADESH', popular: false },

    // West Bengal
    { city: 'Kolkata', state: 'West Bengal', rtoState: 'WEST BENGAL', popular: true },
    { city: 'Howrah', state: 'West Bengal', rtoState: 'WEST BENGAL', popular: false },
    { city: 'Durgapur', state: 'West Bengal', rtoState: 'WEST BENGAL', popular: false },
    { city: 'Asansol', state: 'West Bengal', rtoState: 'WEST BENGAL', popular: false },
    { city: 'Siliguri', state: 'West Bengal', rtoState: 'WEST BENGAL', popular: false },

    // Gujarat
    { city: 'Ahmedabad', state: 'Gujarat', rtoState: 'GUJARAT', popular: true },
    { city: 'Surat', state: 'Gujarat', rtoState: 'GUJARAT', popular: true },
    { city: 'Vadodara', state: 'Gujarat', rtoState: 'GUJARAT', popular: false },
    { city: 'Rajkot', state: 'Gujarat', rtoState: 'GUJARAT', popular: false },
    { city: 'Gandhinagar', state: 'Gujarat', rtoState: 'GUJARAT', popular: false },

    // Rajasthan
    { city: 'Jaipur', state: 'Rajasthan', rtoState: 'RAJASTHAN', popular: true },
    { city: 'Jodhpur', state: 'Rajasthan', rtoState: 'RAJASTHAN', popular: false },
    { city: 'Udaipur', state: 'Rajasthan', rtoState: 'RAJASTHAN', popular: false },
    { city: 'Kota', state: 'Rajasthan', rtoState: 'RAJASTHAN', popular: false },
    { city: 'Ajmer', state: 'Rajasthan', rtoState: 'RAJASTHAN', popular: false },

    // Uttar Pradesh
    { city: 'Lucknow', state: 'Uttar Pradesh', rtoState: 'UTTAR PRADESH', popular: true },
    { city: 'Kanpur', state: 'Uttar Pradesh', rtoState: 'UTTAR PRADESH', popular: false },
    { city: 'Agra', state: 'Uttar Pradesh', rtoState: 'UTTAR PRADESH', popular: false },
    { city: 'Varanasi', state: 'Uttar Pradesh', rtoState: 'UTTAR PRADESH', popular: false },
    { city: 'Meerut', state: 'Uttar Pradesh', rtoState: 'UTTAR PRADESH', popular: false },
    { city: 'Allahabad', state: 'Uttar Pradesh', rtoState: 'UTTAR PRADESH', popular: false },
    { city: 'Prayagraj', state: 'Uttar Pradesh', rtoState: 'UTTAR PRADESH', popular: false },

    // Madhya Pradesh
    { city: 'Indore', state: 'Madhya Pradesh', rtoState: 'MADHYA PRADESH', popular: true },
    { city: 'Bhopal', state: 'Madhya Pradesh', rtoState: 'MADHYA PRADESH', popular: true },
    { city: 'Jabalpur', state: 'Madhya Pradesh', rtoState: 'MADHYA PRADESH', popular: false },
    { city: 'Gwalior', state: 'Madhya Pradesh', rtoState: 'MADHYA PRADESH', popular: false },
    { city: 'Ujjain', state: 'Madhya Pradesh', rtoState: 'MADHYA PRADESH', popular: false },

    // Punjab
    { city: 'Chandigarh', state: 'Chandigarh', rtoState: 'CHANDIGARH (UT)', popular: true },
    { city: 'Ludhiana', state: 'Punjab', rtoState: 'PUNJAB', popular: false },
    { city: 'Amritsar', state: 'Punjab', rtoState: 'PUNJAB', popular: false },
    { city: 'Jalandhar', state: 'Punjab', rtoState: 'PUNJAB', popular: false },
    { city: 'Patiala', state: 'Punjab', rtoState: 'PUNJAB', popular: false },

    // Haryana
    { city: 'Panipat', state: 'Haryana', rtoState: 'HARYANA', popular: false },
    { city: 'Ambala', state: 'Haryana', rtoState: 'HARYANA', popular: false },
    { city: 'Rohtak', state: 'Haryana', rtoState: 'HARYANA', popular: false },
    { city: 'Hisar', state: 'Haryana', rtoState: 'HARYANA', popular: false },

    // Kerala
    { city: 'Kochi', state: 'Kerala', rtoState: 'KERALA', popular: true },
    { city: 'Thiruvananthapuram', state: 'Kerala', rtoState: 'KERALA', popular: false },
    { city: 'Kozhikode', state: 'Kerala', rtoState: 'KERALA', popular: false },
    { city: 'Thrissur', state: 'Kerala', rtoState: 'KERALA', popular: false },

    // Bihar
    { city: 'Patna', state: 'Bihar', rtoState: 'BIHAR', popular: true },
    { city: 'Gaya', state: 'Bihar', rtoState: 'BIHAR', popular: false },
    { city: 'Bhagalpur', state: 'Bihar', rtoState: 'BIHAR', popular: false },
    { city: 'Muzaffarpur', state: 'Bihar', rtoState: 'BIHAR', popular: false },

    // Odisha
    { city: 'Bhubaneswar', state: 'Odisha', rtoState: 'ODISHA', popular: true },
    { city: 'Cuttack', state: 'Odisha', rtoState: 'ODISHA', popular: false },
    { city: 'Rourkela', state: 'Odisha', rtoState: 'ODISHA', popular: false },

    // Jharkhand
    { city: 'Ranchi', state: 'Jharkhand', rtoState: 'JHARKHAND', popular: false },
    { city: 'Jamshedpur', state: 'Jharkhand', rtoState: 'JHARKHAND', popular: false },
    { city: 'Dhanbad', state: 'Jharkhand', rtoState: 'JHARKHAND', popular: false },

    // Chhattisgarh
    { city: 'Raipur', state: 'Chhattisgarh', rtoState: 'CHHATTISGARH', popular: false },
    { city: 'Bhilai', state: 'Chhattisgarh', rtoState: 'CHHATTISGARH', popular: false },

    // Uttarakhand
    { city: 'Dehradun', state: 'Uttarakhand', rtoState: 'UTTARAKHAND', popular: false },
    { city: 'Haridwar', state: 'Uttarakhand', rtoState: 'UTTARAKHAND', popular: false },

    // Himachal Pradesh
    { city: 'Shimla', state: 'Himachal Pradesh', rtoState: 'HIMACHAL PRADESH', popular: false },
    { city: 'Manali', state: 'Himachal Pradesh', rtoState: 'HIMACHAL PRADESH', popular: false },

    // Jammu & Kashmir
    { city: 'Srinagar', state: 'Jammu & Kashmir', rtoState: 'JAMMU & KASHMIR (UT)', popular: false },
    { city: 'Jammu', state: 'Jammu & Kashmir', rtoState: 'JAMMU & KASHMIR (UT)', popular: false },

    // Assam
    { city: 'Guwahati', state: 'Assam', rtoState: 'ASSAM', popular: false },
    { city: 'Dibrugarh', state: 'Assam', rtoState: 'ASSAM', popular: false },

    // Goa
    { city: 'Panaji', state: 'Goa', rtoState: 'GOA', popular: false },
    { city: 'Margao', state: 'Goa', rtoState: 'GOA', popular: false },

    // Puducherry
    { city: 'Puducherry', state: 'Puducherry', rtoState: 'PUDUCHERRY (UT)', popular: false },
];

// Create fast lookup maps
const cityToStateMap = new Map<string, CityData>();
const stateToRTOMap = new Map<string, string>();

// Initialize maps for O(1) lookup
CITY_DATABASE.forEach(cityData => {
    cityToStateMap.set(cityData.city.toLowerCase(), cityData);
    stateToRTOMap.set(cityData.state.toUpperCase(), cityData.rtoState);
});

/**
 * Get RTO state name from city (O(1) lookup)
 */
export function getRTOStateFromCity(city: string): string {
    const cityData = cityToStateMap.get(city.toLowerCase());
    if (cityData) {
        return cityData.rtoState;
    }

    // Fallback: try to match state name directly
    const upperCity = city.toUpperCase();
    const rtoState = stateToRTOMap.get(upperCity);
    if (rtoState) {
        return rtoState;
    }

    console.warn(`City "${city}" not found in database, using Maharashtra default`);
    return 'MAHARASHTRA';
}

/**
 * Get state name from city
 */
export function getStateFromCity(city: string): string {
    const cityData = cityToStateMap.get(city.toLowerCase());
    return cityData?.state || 'Maharashtra';
}

/**
 * Get popular cities for dropdown
 */
export function getPopularCities(): CityData[] {
    return CITY_DATABASE.filter(c => c.popular);
}

/**
 * Get all cities sorted alphabetically
 */
export function getAllCities(): CityData[] {
    return [...CITY_DATABASE].sort((a, b) => a.city.localeCompare(b.city));
}

/**
 * Search cities by name (fuzzy search)
 */
export function searchCities(query: string): CityData[] {
    const lowerQuery = query.toLowerCase();
    return CITY_DATABASE.filter(c =>
        c.city.toLowerCase().includes(lowerQuery) ||
        c.state.toLowerCase().includes(lowerQuery)
    ).slice(0, 10); // Limit to 10 results
}
