/**
 * MotorOctane Mobile App - API Service
 * Connects to the existing Express backend (same as web)
 */

// Use the same backend URL as the web app
const BASE_URL = 'https://killerwhale-backend.onrender.com';
// For local development:
// const BASE_URL = 'http://192.168.1.23:5001';

// Types matching the web frontend
export interface Brand {
    id: string;
    name: string;
    logo?: string;
    slug: string;
}

export interface Car {
    id: string;
    name: string;
    brand: string;
    brandName: string;
    image: string;
    startingPrice: number;
    lowestPriceFuelType?: string;
    fuelTypes: string[];
    transmissions: string[];
    seating: number;
    launchDate: string;
    slug: string;
    isNew: boolean;
    isPopular: boolean;
}

export interface Model {
    id: string;
    name: string;
    brandId: string;
    heroImage: string;
    images: string[];
    lowestPrice: number;
    highestPrice: number;
    fuelTypes: string[];
    transmissions: string[];
    bodyType: string;
    seating: number;
    description?: string;
    isNew: boolean;
    isPopular: boolean;
    launchDate?: string;
}

export interface NewsArticle {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    image: string;
    category: string;
    publishedAt: string;
    author: string;
}

export interface Comparison {
    id: string;
    model1: {
        id: string;
        name: string;
        brand: string;
        heroImage: string;
        startingPrice: number;
        fuelTypes: string[];
    };
    model2: {
        id: string;
        name: string;
        brand: string;
        heroImage: string;
        startingPrice: number;
        fuelTypes: string[];
    };
}

// API endpoints matching your backend
export const api = {
    // Brands
    getBrands: async (): Promise<Brand[]> => {
        const response = await fetch(`${BASE_URL}/api/brands`);
        return response.json();
    },

    // Popular Cars
    getPopularCars: async (): Promise<Car[]> => {
        const response = await fetch(`${BASE_URL}/api/cars/popular`);
        return response.json();
    },

    // Models with pricing
    getModelsWithPricing: async (limit = 100): Promise<Model[]> => {
        const response = await fetch(`${BASE_URL}/api/models-with-pricing?limit=${limit}`);
        const data = await response.json();
        return data.data || data;
    },

    // Model details by brand and model slug
    getModelDetails: async (brandSlug: string, modelSlug: string): Promise<Model> => {
        const response = await fetch(`${BASE_URL}/api/models/${brandSlug}/${modelSlug}`);
        return response.json();
    },

    // Models by brand
    getModelsByBrand: async (brandSlug: string): Promise<Model[]> => {
        const response = await fetch(`${BASE_URL}/api/brands/${brandSlug}/models`);
        return response.json();
    },

    // Popular comparisons
    getPopularComparisons: async (): Promise<Comparison[]> => {
        const response = await fetch(`${BASE_URL}/api/popular-comparisons`);
        return response.json();
    },

    // Upcoming cars
    getUpcomingCars: async (): Promise<Car[]> => {
        const response = await fetch(`${BASE_URL}/api/upcoming-cars`);
        return response.json();
    },

    // News
    getNews: async (limit = 6): Promise<NewsArticle[]> => {
        const response = await fetch(`${BASE_URL}/api/news?limit=${limit}`);
        const data = await response.json();
        return data.articles || [];
    },

    // AI Chat - Same as web floating bot
    aiChat: async (message: string, carContext?: any): Promise<string> => {
        const response = await fetch(`${BASE_URL}/api/ai/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, carContext }),
        });
        const data = await response.json();
        return data.response;
    },

    // Search
    search: async (query: string): Promise<any> => {
        const response = await fetch(`${BASE_URL}/api/search?q=${encodeURIComponent(query)}`);
        return response.json();
    },
};

export default api;
